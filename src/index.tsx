import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HomePage } from './pages/home'
import { MissionPage } from './pages/mission'
import { DoctorsPage, DoctorDetailPage } from './pages/doctors'
import { TreatmentsListPage, TreatmentDetailPage } from './pages/treatments'
import { PlaceholderPage } from './pages/placeholder'
import { LoginPage, SignupPage } from './pages/auth'
import { BeforeAfterListPage, BeforeAfterDetailPage } from './pages/before-after'
import { BlogListPage, BlogDetailPage } from './pages/blog'
import { NoticesListPage, NoticeDetailPage } from './pages/notices'
import { GlossaryListPage, GlossaryDetailPage } from './pages/glossary'
import { FaqAllPage } from './pages/faq'
import { VisitPage } from './pages/visit'
import {
  AdminLoginPage,
  AdminDashboard,
  AdminUsersPage,
  AdminBAListPage,
  AdminBAFormPage,
  AdminBlogListPage,
  AdminBlogFormPage,
  AdminNoticesListPage,
  AdminNoticeFormPage,
} from './pages/admin'
import {
  type Bindings,
  hashPassword,
  createSession,
  destroySession,
  getUserFromSession,
  requireAdmin,
  isValidEmail,
  normalizePhone,
} from './lib/auth'
import { getGlossaryTerm, GLOSSARY } from './data/glossary'
import { CLINIC, SEO_REGIONS } from './lib/constants'
import { TREATMENT_LIST } from './data/treatments'

const app = new Hono<{ Bindings: Bindings }>()

// ============================================================
// CORS (for API)
// ============================================================
app.use('/api/*', cors())

// ============================================================
// Helper - detect login
// ============================================================
async function isLogged(c: any) {
  const u = await getUserFromSession(c)
  return !!u
}

// ============================================================
// PUBLIC ROUTES
// ============================================================

// Home
app.get('/', (c) => c.html(<HomePage />))

// Mission
app.get('/mission', (c) => c.html(<MissionPage />))

// Doctors
app.get('/doctors', (c) => c.html(<DoctorsPage />))
app.get('/doctors/:slug', (c) => c.html(<DoctorDetailPage slug={c.req.param('slug')} />))

// Treatments
app.get('/treatments', (c) => c.html(<TreatmentsListPage />))
app.get('/treatments/:slug', (c) => c.html(<TreatmentDetailPage slug={c.req.param('slug')} />))

// Auth pages
app.get('/login', (c) => {
  const next = c.req.query('next') ?? ''
  const error = c.req.query('error') ?? ''
  return c.html(<LoginPage error={error || undefined} next={next} />)
})
app.get('/signup', (c) => {
  const error = c.req.query('error') ?? ''
  return c.html(<SignupPage error={error || undefined} />)
})

// Logout
app.get('/logout', async (c) => {
  await destroySession(c)
  return c.redirect('/')
})

// ============================================================
// AUTH API
// ============================================================
app.post('/api/auth/signup', async (c) => {
  try {
    const form = await c.req.formData()
    const email = String(form.get('email') ?? '').trim().toLowerCase()
    const name = String(form.get('name') ?? '').trim()
    const phone = normalizePhone(String(form.get('phone') ?? ''))
    const password = String(form.get('password') ?? '')
    const agreePrivacy = form.get('agree_privacy') ? 1 : 0
    const agreeMarketing = form.get('agree_marketing') ? 1 : 0

    if (!isValidEmail(email)) return c.redirect('/signup?error=' + encodeURIComponent('이메일 형식이 올바르지 않습니다.'))
    if (!name) return c.redirect('/signup?error=' + encodeURIComponent('이름을 입력해 주세요.'))
    if (phone.length < 10) return c.redirect('/signup?error=' + encodeURIComponent('휴대폰 번호를 확인해 주세요.'))
    if (password.length < 8) return c.redirect('/signup?error=' + encodeURIComponent('비밀번호는 8자 이상이어야 합니다.'))
    if (!agreePrivacy) return c.redirect('/signup?error=' + encodeURIComponent('개인정보 수집 동의가 필요합니다.'))

    const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ? LIMIT 1').bind(email).first()
    if (existing) return c.redirect('/signup?error=' + encodeURIComponent('이미 가입된 이메일입니다.'))

    const hash = await hashPassword(password)
    const result = await c.env.DB.prepare(
      `INSERT INTO users (email, phone, name, password_hash, role, agreed_privacy, agreed_marketing) VALUES (?, ?, ?, ?, 'member', ?, ?)`
    )
      .bind(email, phone, name, hash, agreePrivacy, agreeMarketing)
      .run()
    const userId = result.meta.last_row_id as number
    await createSession(c, userId)
    return c.redirect('/')
  } catch (e) {
    return c.redirect('/signup?error=' + encodeURIComponent('가입 중 오류가 발생했습니다.'))
  }
})

app.post('/api/auth/login', async (c) => {
  try {
    const form = await c.req.formData()
    const email = String(form.get('email') ?? '').trim().toLowerCase()
    const password = String(form.get('password') ?? '')
    const next = String(form.get('next') ?? '') || '/'

    const hash = await hashPassword(password)
    const row = await c.env.DB.prepare(
      `SELECT id, role FROM users WHERE email = ? AND password_hash = ? LIMIT 1`
    ).bind(email, hash).first<{ id: number; role: string }>()

    if (!row) {
      return c.redirect('/login?error=' + encodeURIComponent('이메일 또는 비밀번호를 확인해 주세요.'))
    }
    await createSession(c, row.id)
    return c.redirect(next)
  } catch (e) {
    return c.redirect('/login?error=' + encodeURIComponent('로그인 중 오류가 발생했습니다.'))
  }
})

// ============================================================
// Before/After (public)
// ============================================================
app.get('/before-after', async (c) => {
  const treatment = c.req.query('treatment') ?? ''
  const region = c.req.query('region') ?? ''
  const q = c.req.query('q') ?? ''
  const loggedIn = await isLogged(c)

  let sql = 'SELECT * FROM before_after WHERE is_published = 1'
  const params: any[] = []
  if (treatment) { sql += ' AND treatment_slug = ?'; params.push(treatment) }
  if (region) { sql += ' AND (region = ? OR region_city LIKE ?)'; params.push(region, `%${region}%`) }
  if (q) { sql += ' AND (title LIKE ? OR summary LIKE ?)'; params.push(`%${q}%`, `%${q}%`) }
  sql += ' ORDER BY created_at DESC LIMIT 60'
  const cases = (await c.env.DB.prepare(sql).bind(...params).all()).results as any[]

  return c.html(
    <BeforeAfterListPage
      cases={cases}
      isLoggedIn={loggedIn}
      activeTreatment={treatment || undefined}
      activeRegion={region || undefined}
      query={q || undefined}
    />
  )
})

app.get('/before-after/:slug', async (c) => {
  const slug = c.req.param('slug')
  const loggedIn = await isLogged(c)
  const caseRow = await c.env.DB.prepare('SELECT * FROM before_after WHERE slug = ? AND is_published = 1 LIMIT 1').bind(slug).first<any>()
  if (!caseRow) return c.notFound()
  // view count
  c.executionCtx?.waitUntil?.(c.env.DB.prepare('UPDATE before_after SET view_count = view_count + 1 WHERE id = ?').bind(caseRow.id).run())
  const related = (await c.env.DB.prepare(
    'SELECT * FROM before_after WHERE treatment_slug = ? AND id != ? AND is_published = 1 ORDER BY created_at DESC LIMIT 3'
  ).bind(caseRow.treatment_slug, caseRow.id).all()).results as any[]

  return c.html(<BeforeAfterDetailPage caseRow={caseRow} isLoggedIn={loggedIn} relatedCases={related} />)
})

// ============================================================
// Blog (public)
// ============================================================
app.get('/blog', async (c) => {
  const category = c.req.query('category') ?? ''
  let sql = 'SELECT * FROM blog_posts WHERE is_published = 1'
  const params: any[] = []
  if (category) { sql += ' AND category = ?'; params.push(category) }
  sql += ' ORDER BY published_at DESC LIMIT 60'
  const posts = (await c.env.DB.prepare(sql).bind(...params).all()).results as any[]
  return c.html(<BlogListPage posts={posts} category={category || undefined} />)
})

app.get('/blog/:slug', async (c) => {
  const slug = c.req.param('slug')
  const post = await c.env.DB.prepare('SELECT * FROM blog_posts WHERE slug = ? AND is_published = 1 LIMIT 1').bind(slug).first<any>()
  if (!post) return c.notFound()
  c.executionCtx?.waitUntil?.(c.env.DB.prepare('UPDATE blog_posts SET view_count = view_count + 1 WHERE id = ?').bind(post.id).run())
  const related = (await c.env.DB.prepare(
    'SELECT * FROM blog_posts WHERE id != ? AND is_published = 1 ORDER BY published_at DESC LIMIT 3'
  ).bind(post.id).all()).results as any[]
  return c.html(<BlogDetailPage post={post} related={related} />)
})

// ============================================================
// Notices (public)
// ============================================================
app.get('/notices', async (c) => {
  const notices = (await c.env.DB.prepare('SELECT * FROM notices WHERE is_published = 1 ORDER BY is_major DESC, published_at DESC LIMIT 100').all()).results as any[]
  return c.html(<NoticesListPage notices={notices} />)
})
app.get('/notices/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const notice = await c.env.DB.prepare('SELECT * FROM notices WHERE id = ? AND is_published = 1 LIMIT 1').bind(id).first<any>()
  if (!notice) return c.notFound()
  c.executionCtx?.waitUntil?.(c.env.DB.prepare('UPDATE notices SET view_count = view_count + 1 WHERE id = ?').bind(notice.id).run())
  return c.html(<NoticeDetailPage notice={notice} />)
})

// ============================================================
// Glossary (static)
// ============================================================
app.get('/glossary', (c) => {
  const category = c.req.query('category') ?? ''
  const q = c.req.query('q') ?? ''
  return c.html(<GlossaryListPage activeCategory={category || undefined} query={q || undefined} />)
})
app.get('/glossary/:slug', (c) => {
  const slug = c.req.param('slug')
  const term = getGlossaryTerm(slug)
  if (!term) return c.notFound()
  return c.html(<GlossaryDetailPage term={term} />)
})

// ============================================================
// FAQ
// ============================================================
app.get('/faq', (c) => c.html(<FaqAllPage />))

// ============================================================
// Visit
// ============================================================
app.get('/visit', (c) => c.html(<VisitPage />))

// ============================================================
// Sitemap + robots
// ============================================================
app.get('/robots.txt', (c) => {
  return c.text(
    `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nDisallow: /login\nDisallow: /signup\n\nSitemap: https://${CLINIC.domain}/sitemap.xml`,
    200,
    { 'Content-Type': 'text/plain' }
  )
})

app.get('/sitemap.xml', async (c) => {
  const base = `https://${CLINIC.domain}`
  const urls: string[] = [
    '/', '/mission', '/doctors', '/treatments',
    '/before-after', '/blog', '/notices', '/glossary', '/faq', '/visit'
  ]
  // doctors
  urls.push('/doctors/kim-jaein')
  // treatments
  for (const t of TREATMENT_LIST) urls.push(`/treatments/${t.slug}`)
  // glossary
  for (const g of GLOSSARY) urls.push(`/glossary/${g.slug}`)
  // regional SEO pages
  for (const r of SEO_REGIONS) urls.push(`/before-after?region=${encodeURIComponent(r)}`)

  // Dynamic content
  try {
    const blogs = (await c.env.DB.prepare('SELECT slug FROM blog_posts WHERE is_published = 1').all()).results as any[]
    for (const b of blogs) urls.push(`/blog/${b.slug}`)
    const bas = (await c.env.DB.prepare('SELECT slug FROM before_after WHERE is_published = 1').all()).results as any[]
    for (const b of bas) urls.push(`/before-after/${b.slug}`)
    const notices = (await c.env.DB.prepare('SELECT id FROM notices WHERE is_published = 1').all()).results as any[]
    for (const n of notices) urls.push(`/notices/${n.id}`)
  } catch {}

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${base}${u}</loc><changefreq>weekly</changefreq></url>`).join('\n')}
</urlset>`
  return c.text(xml, 200, { 'Content-Type': 'application/xml' })
})

app.get('/manifest.webmanifest', (c) => {
  return c.json({
    name: CLINIC.name,
    short_name: '부평우리치과',
    description: CLINIC.mission,
    theme_color: '#0ABAB5',
    background_color: '#ffffff',
    display: 'standalone',
    start_url: '/',
    icons: [{ src: '/static/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  })
})

// ============================================================
// Media (R2) serving
// ============================================================
app.get('/media/*', async (c) => {
  if (!c.env.R2) return c.notFound()
  const key = c.req.path.replace(/^\/media\//, '')
  const obj = await c.env.R2.get(key)
  if (!obj) return c.notFound()
  const headers = new Headers()
  headers.set('Content-Type', obj.httpMetadata?.contentType ?? 'application/octet-stream')
  headers.set('Cache-Control', 'public, max-age=86400')
  return new Response(obj.body, { headers })
})

// ============================================================
// ADMIN ROUTES
// ============================================================

// Admin login GET
app.get('/admin/login', (c) => {
  const error = c.req.query('error') ?? ''
  return c.html(<AdminLoginPage error={error || undefined} />)
})

// Admin login POST
app.post('/admin/login', async (c) => {
  try {
    const form = await c.req.formData()
    const email = String(form.get('email') ?? '').trim().toLowerCase()
    const password = String(form.get('password') ?? '')
    const hash = await hashPassword(password)
    const row = await c.env.DB.prepare(
      `SELECT id, role FROM users WHERE email = ? AND password_hash = ? AND role = 'admin' LIMIT 1`
    ).bind(email, hash).first<{ id: number; role: string }>()
    if (!row) {
      return c.redirect('/admin/login?error=' + encodeURIComponent('관리자 계정을 확인해 주세요.'))
    }
    await createSession(c, row.id)
    return c.redirect('/admin')
  } catch (e) {
    return c.redirect('/admin/login?error=' + encodeURIComponent('로그인 오류'))
  }
})

app.get('/admin/logout', async (c) => {
  await destroySession(c)
  return c.redirect('/admin/login')
})

// Admin auth middleware
app.use('/admin/*', async (c, next) => {
  if (c.req.path === '/admin/login') return next()
  const admin = await requireAdmin(c)
  if (!admin) return c.redirect('/admin/login')
  await next()
})

// Dashboard
app.get('/admin', async (c) => {
  const users = await c.env.DB.prepare('SELECT COUNT(*) as n FROM users').first<{ n: number }>()
  const bas = await c.env.DB.prepare('SELECT COUNT(*) as n, COALESCE(SUM(view_count), 0) as v FROM before_after').first<{ n: number; v: number }>()
  const blogs = await c.env.DB.prepare('SELECT COUNT(*) as n, COALESCE(SUM(view_count), 0) as v FROM blog_posts').first<{ n: number; v: number }>()
  const notices = await c.env.DB.prepare('SELECT COUNT(*) as n, COALESCE(SUM(view_count), 0) as v FROM notices').first<{ n: number; v: number }>()
  return c.html(
    <AdminDashboard
      stats={{
        users: users?.n ?? 0,
        bas: bas?.n ?? 0,
        blogs: blogs?.n ?? 0,
        notices: notices?.n ?? 0,
        totalViews: (bas?.v ?? 0) + (blogs?.v ?? 0) + (notices?.v ?? 0),
      }}
    />
  )
})

// Users
app.get('/admin/users', async (c) => {
  const users = (await c.env.DB.prepare('SELECT id, email, name, phone, role, created_at FROM users ORDER BY created_at DESC LIMIT 200').all()).results as any[]
  return c.html(<AdminUsersPage users={users} />)
})

// Before-After CRUD
app.get('/admin/before-after', async (c) => {
  const cases = (await c.env.DB.prepare('SELECT * FROM before_after ORDER BY created_at DESC LIMIT 200').all()).results as any[]
  return c.html(<AdminBAListPage cases={cases} />)
})
app.get('/admin/before-after/new', (c) => c.html(<AdminBAFormPage mode="new" />))
app.get('/admin/before-after/:id/edit', async (c) => {
  const id = Number(c.req.param('id'))
  const data = await c.env.DB.prepare('SELECT * FROM before_after WHERE id = ? LIMIT 1').bind(id).first<any>()
  if (!data) return c.notFound()
  return c.html(<AdminBAFormPage mode="edit" data={data} />)
})

async function uploadToR2(c: any, file: File | null, prefix: string): Promise<string | null> {
  if (!file || !(file instanceof File) || file.size === 0 || !c.env.R2) return null
  const ext = (file.name.split('.').pop() ?? 'bin').toLowerCase()
  const key = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  await c.env.R2.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  })
  return key
}

app.post('/admin/before-after/new', async (c) => {
  const form = await c.req.formData()
  const get = (k: string) => String(form.get(k) ?? '').trim()
  const fields = ['title','slug','treatment_slug','doctor_slug','age','gender','region','region_city','treatment_period','summary','content'] as const
  const values: any = {}
  for (const f of fields) values[f] = get(f) || null
  values.age = values.age ? Number(values.age) : null
  values.is_published = form.get('is_published') ? 1 : 0
  // Upload files
  const bp = await uploadToR2(c, form.get('before_pano_file') as any, 'ba/pano-before') ?? get('before_pano_key') ?? null
  const ap = await uploadToR2(c, form.get('after_pano_file') as any, 'ba/pano-after') ?? get('after_pano_key') ?? null
  const bi = await uploadToR2(c, form.get('before_intra_file') as any, 'ba/intra-before') ?? get('before_intra_key') ?? null
  const ai = await uploadToR2(c, form.get('after_intra_file') as any, 'ba/intra-after') ?? get('after_intra_key') ?? null
  await c.env.DB.prepare(
    `INSERT INTO before_after (slug, title, treatment_slug, doctor_slug, age, gender, region, region_city, treatment_period, summary, content, before_pano_key, after_pano_key, before_intra_key, after_intra_key, is_published) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(values.slug, values.title, values.treatment_slug, values.doctor_slug, values.age, values.gender, values.region, values.region_city, values.treatment_period, values.summary, values.content, bp, ap, bi, ai, values.is_published).run()
  return c.redirect('/admin/before-after')
})

app.post('/admin/before-after/:id/edit', async (c) => {
  const id = Number(c.req.param('id'))
  const form = await c.req.formData()
  const get = (k: string) => String(form.get(k) ?? '').trim()
  const bp = await uploadToR2(c, form.get('before_pano_file') as any, 'ba/pano-before') ?? (get('before_pano_key') || null)
  const ap = await uploadToR2(c, form.get('after_pano_file') as any, 'ba/pano-after') ?? (get('after_pano_key') || null)
  const bi = await uploadToR2(c, form.get('before_intra_file') as any, 'ba/intra-before') ?? (get('before_intra_key') || null)
  const ai = await uploadToR2(c, form.get('after_intra_file') as any, 'ba/intra-after') ?? (get('after_intra_key') || null)
  await c.env.DB.prepare(
    `UPDATE before_after SET slug=?, title=?, treatment_slug=?, doctor_slug=?, age=?, gender=?, region=?, region_city=?, treatment_period=?, summary=?, content=?, before_pano_key=?, after_pano_key=?, before_intra_key=?, after_intra_key=?, is_published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).bind(
    get('slug'), get('title'), get('treatment_slug'), get('doctor_slug'),
    get('age') ? Number(get('age')) : null, get('gender') || null, get('region') || null,
    get('region_city') || null, get('treatment_period') || null, get('summary') || null, get('content') || null,
    bp, ap, bi, ai, form.get('is_published') ? 1 : 0, id
  ).run()
  return c.redirect('/admin/before-after')
})

app.post('/admin/before-after/:id/delete', async (c) => {
  const id = Number(c.req.param('id'))
  await c.env.DB.prepare('DELETE FROM before_after WHERE id = ?').bind(id).run()
  return c.redirect('/admin/before-after')
})

// Blog CRUD
app.get('/admin/blog', async (c) => {
  const posts = (await c.env.DB.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT 200').all()).results as any[]
  return c.html(<AdminBlogListPage posts={posts} />)
})
app.get('/admin/blog/new', (c) => c.html(<AdminBlogFormPage mode="new" />))
app.get('/admin/blog/:id/edit', async (c) => {
  const id = Number(c.req.param('id'))
  const data = await c.env.DB.prepare('SELECT * FROM blog_posts WHERE id = ? LIMIT 1').bind(id).first<any>()
  if (!data) return c.notFound()
  return c.html(<AdminBlogFormPage mode="edit" data={data} />)
})
app.post('/admin/blog/new', async (c) => {
  const form = await c.req.formData()
  const get = (k: string) => String(form.get(k) ?? '').trim()
  const coverKey = await uploadToR2(c, form.get('cover_file') as any, 'blog/cover') ?? (get('cover_key') || null)
  await c.env.DB.prepare(
    `INSERT INTO blog_posts (slug, title, excerpt, content, cover_key, author_slug, category, tags, meta_description, meta_keywords, is_published) VALUES (?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(
    get('slug'), get('title'), get('excerpt') || null, get('content') || '',
    coverKey, get('author_slug') || 'kim-jaein', get('category') || null, get('tags') || null,
    get('meta_description') || null, get('meta_keywords') || null, form.get('is_published') ? 1 : 0
  ).run()
  return c.redirect('/admin/blog')
})
app.post('/admin/blog/:id/edit', async (c) => {
  const id = Number(c.req.param('id'))
  const form = await c.req.formData()
  const get = (k: string) => String(form.get(k) ?? '').trim()
  const coverKey = await uploadToR2(c, form.get('cover_file') as any, 'blog/cover') ?? (get('cover_key') || null)
  await c.env.DB.prepare(
    `UPDATE blog_posts SET slug=?, title=?, excerpt=?, content=?, cover_key=?, author_slug=?, category=?, tags=?, meta_description=?, meta_keywords=?, is_published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).bind(
    get('slug'), get('title'), get('excerpt') || null, get('content') || '',
    coverKey, get('author_slug') || 'kim-jaein', get('category') || null, get('tags') || null,
    get('meta_description') || null, get('meta_keywords') || null, form.get('is_published') ? 1 : 0, id
  ).run()
  return c.redirect('/admin/blog')
})
app.post('/admin/blog/:id/delete', async (c) => {
  const id = Number(c.req.param('id'))
  await c.env.DB.prepare('DELETE FROM blog_posts WHERE id = ?').bind(id).run()
  return c.redirect('/admin/blog')
})

// Notices CRUD
app.get('/admin/notices', async (c) => {
  const notices = (await c.env.DB.prepare('SELECT * FROM notices ORDER BY created_at DESC LIMIT 200').all()).results as any[]
  return c.html(<AdminNoticesListPage notices={notices} />)
})
app.get('/admin/notices/new', (c) => c.html(<AdminNoticeFormPage mode="new" />))
app.get('/admin/notices/:id/edit', async (c) => {
  const id = Number(c.req.param('id'))
  const data = await c.env.DB.prepare('SELECT * FROM notices WHERE id = ? LIMIT 1').bind(id).first<any>()
  if (!data) return c.notFound()
  return c.html(<AdminNoticeFormPage mode="edit" data={data} />)
})
app.post('/admin/notices/new', async (c) => {
  const form = await c.req.formData()
  const get = (k: string) => String(form.get(k) ?? '').trim()
  const imageKey = await uploadToR2(c, form.get('image_file') as any, 'notices') ?? (get('image_key') || null)
  await c.env.DB.prepare(
    `INSERT INTO notices (title, content, image_key, is_major, is_published) VALUES (?,?,?,?,?)`
  ).bind(
    get('title'), get('content'), imageKey,
    form.get('is_major') ? 1 : 0, form.get('is_published') ? 1 : 0
  ).run()
  return c.redirect('/admin/notices')
})
app.post('/admin/notices/:id/edit', async (c) => {
  const id = Number(c.req.param('id'))
  const form = await c.req.formData()
  const get = (k: string) => String(form.get(k) ?? '').trim()
  const imageKey = await uploadToR2(c, form.get('image_file') as any, 'notices') ?? (get('image_key') || null)
  await c.env.DB.prepare(
    `UPDATE notices SET title=?, content=?, image_key=?, is_major=?, is_published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).bind(
    get('title'), get('content'), imageKey,
    form.get('is_major') ? 1 : 0, form.get('is_published') ? 1 : 0, id
  ).run()
  return c.redirect('/admin/notices')
})
app.post('/admin/notices/:id/delete', async (c) => {
  const id = Number(c.req.param('id'))
  await c.env.DB.prepare('DELETE FROM notices WHERE id = ?').bind(id).run()
  return c.redirect('/admin/notices')
})

// R2 upload endpoint (for editor)
app.post('/admin/upload', async (c) => {
  const admin = await requireAdmin(c)
  if (!admin) return c.json({ ok: false, error: 'unauthorized' }, 401)
  const form = await c.req.formData()
  const file = form.get('file') as File | null
  if (!file || !(file instanceof File) || !c.env.R2) return c.json({ ok: false, error: 'no file' }, 400)
  const key = await uploadToR2(c, file, 'blog/inline')
  return c.json({ ok: true, key, url: `/media/${key}` })
})

// ============================================================
// 404
// ============================================================
app.notFound((c) =>
  c.html(
    <PlaceholderPage
      title="페이지를 찾을 수 없습니다"
      phase="404"
      description="주소를 다시 확인해 주세요."
    />,
    404
  )
)

export default app
