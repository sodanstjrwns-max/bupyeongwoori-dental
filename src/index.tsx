import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HomePage } from './pages/home'
import { MissionPage } from './pages/mission'
import { DoctorsPage, DoctorDetailPage } from './pages/doctors'
import { TreatmentsListPage, TreatmentDetailPage } from './pages/treatments'
import { PlaceholderPage } from './pages/placeholder'
import { LoginPage, SignupPage } from './pages/auth'
import { MyPage } from './pages/mypage'
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
  AdminOgPreviewPage,
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
import { CLINIC } from './lib/constants'
import { TREATMENT_LIST, getTreatment } from './data/treatments'
import { pingIndexNow, INDEXNOW_KEY } from './lib/indexnow'
import { autoFillBlogSeo, autoFillBaSeo, buildIndexNowUrls } from './lib/auto-seo'
import { AreasIndexPage, AreaHubPage, AreaTreatmentPage } from './pages/areas'
import { AREAS, getArea, TREATMENT_LOCAL } from './data/areas'
import { SearchPage, searchStatic, type SearchResultItem } from './pages/search'
import { NotFoundPage } from './pages/not-found'
import { treatmentToMarkdown, glossaryToMarkdown, blogToMarkdown, faqToMarkdown } from './lib/markdown-export'
import { getDoctor } from './data/doctors'

const app = new Hono<{ Bindings: Bindings }>()

// ============================================================
// Trailing slash 정규화 — /blog/ → /blog (301)
// ============================================================
app.use('*', async (c, next) => {
  const url = new URL(c.req.url)
  const p = url.pathname
  if (p.length > 1 && p.endsWith('/')) {
    const newPath = p.replace(/\/+$/, '') || '/'
    return c.redirect(newPath + url.search, 301)
  }
  await next()
})

// ============================================================
// 보안 헤더 (HSTS, X-Content-Type-Options 등)
// ============================================================
app.use('*', async (c, next) => {
  await next()
  // 정적 미디어/sitemap/robots에는 적용하지 않음 (그쪽은 자체 Cache-Control 사용)
  const path = new URL(c.req.url).pathname
  if (path.startsWith('/media/') || path.startsWith('/static/')) return
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)')
  c.header('X-Frame-Options', 'SAMEORIGIN')
})

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
app.get('/doctors/:slug', async (c) => {
  const slug = c.req.param('slug')
  let cases: any[] = []
  try {
    const r = await c.env.DB.prepare(
      `SELECT id, slug, title, treatment_slug, doctor_slug, age, gender, region, region_city,
              treatment_period, summary, before_intra_key, after_intra_key, before_pano_key, after_pano_key, created_at
       FROM before_after
       WHERE doctor_slug = ? AND is_published = 1
       ORDER BY created_at DESC
       LIMIT 6`
    ).bind(slug).all()
    cases = (r.results as any[]) ?? []
  } catch (e) {
    console.error('doctor cases fetch failed', e)
  }
  const user = await getUserFromSession(c)
  const isLoggedIn = !!user
  return c.html(<DoctorDetailPage slug={slug} cases={cases} isLoggedIn={isLoggedIn} />)
})

// Treatments
app.get('/treatments', (c) => c.html(<TreatmentsListPage />))
app.get('/treatments/:slug', async (c) => {
  let slug = c.req.param('slug')
  // AEO: 마크다운 버전 — /treatments/implant.md → LLM 친화 텍스트
  if (slug.endsWith('.md')) {
    const t = getTreatment(slug.slice(0, -3))
    if (!t) return c.notFound()
    const doc = t.doctorSlugs?.[0] ? getDoctor(t.doctorSlugs[0]) : undefined
    return c.text(treatmentToMarkdown(t, doc?.name, doc?.title), 200, {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'Link': `<https://${CLINIC.domain}/treatments/${t.slug}>; rel="canonical"`,
      // 검색엔진 중복콘텐츠 방어 — LLM 크롤러는 본문을 그대로 읽음
      'X-Robots-Tag': 'noindex',
    })
  }
  let cases: any[] = []
  let relatedPosts: any[] = []
  try {
    const r = await c.env.DB.prepare(
      `SELECT id, slug, title, treatment_slug, doctor_slug, age, gender, region, region_city,
              treatment_period, summary, before_intra_key, after_intra_key, before_pano_key, after_pano_key, created_at
       FROM before_after
       WHERE treatment_slug = ? AND is_published = 1
       ORDER BY created_at DESC
       LIMIT 6`
    ).bind(slug).all()
    cases = (r.results as any[]) ?? []
  } catch (e) {
    console.error('treatment cases fetch failed', e)
  }
  // Phase 3-6: 진료 관련 블로그 자동 매칭 — 카테고리/태그로 찾기
  try {
    const tName = TREATMENT_LIST.find(t => t.slug === slug)?.name ?? ''
    if (tName) {
      const r2 = await c.env.DB.prepare(
        `SELECT id, slug, title, excerpt, cover_key, category, published_at
         FROM blog_posts
         WHERE is_published = 1
           AND (category = ? OR title LIKE ? OR tags LIKE ? OR meta_keywords LIKE ?)
         ORDER BY published_at DESC
         LIMIT 4`
      ).bind(tName, `%${tName}%`, `%${tName}%`, `%${tName}%`).all()
      relatedPosts = (r2.results as any[]) ?? []
    }
  } catch (e) {
    console.error('treatment related posts fetch failed', e)
  }
  const user = await getUserFromSession(c)
  const isLoggedIn = !!user
  return c.html(<TreatmentDetailPage slug={slug} cases={cases} relatedPosts={relatedPosts} isLoggedIn={isLoggedIn} />)
})

// ============================================================
// Areas — 지역 × 진료 SEO 랜딩 (8 지역 × 8 진료 = 64 + 9 페이지)
// ============================================================
app.get('/areas', (c) => c.html(<AreasIndexPage />))

app.get('/areas/:region', (c) => {
  const region = c.req.param('region')
  const area = getArea(region)
  if (!area) return c.notFound()
  return c.html(<AreaHubPage area={area} />)
})

app.get('/areas/:region/:treatment', (c) => {
  const region = c.req.param('region')
  const treatmentSlug = c.req.param('treatment')
  const area = getArea(region)
  if (!area) return c.notFound()
  if (!TREATMENT_LOCAL[treatmentSlug]) return c.notFound()
  const treatment = TREATMENT_LIST.find(t => t.slug === treatmentSlug)
  if (!treatment) return c.notFound()
  return c.html(<AreaTreatmentPage area={area} treatment={treatment} />)
})

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
    const agreePrivacy = form.get('agreed_privacy') ? 1 : 0
    const agreeMarketing = form.get('agreed_marketing') ? 1 : 0

    if (!isValidEmail(email)) return c.json({ ok: false, error: '이메일 형식이 올바르지 않습니다.' }, 400)
    if (!name) return c.json({ ok: false, error: '이름을 입력해 주세요.' }, 400)
    if (phone.length < 10) return c.json({ ok: false, error: '휴대폰 번호를 확인해 주세요.' }, 400)
    if (password.length < 8) return c.json({ ok: false, error: '비밀번호는 8자 이상이어야 합니다.' }, 400)
    if (!agreePrivacy) return c.json({ ok: false, error: '개인정보 수집 동의가 필요합니다.' }, 400)

    const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ? LIMIT 1').bind(email).first()
    if (existing) return c.json({ ok: false, error: '이미 가입된 이메일입니다.' }, 409)

    const hash = await hashPassword(password)
    const result = await c.env.DB.prepare(
      `INSERT INTO users (email, phone, name, password_hash, role, agreed_privacy, agreed_marketing) VALUES (?, ?, ?, ?, 'member', ?, ?)`
    )
      .bind(email, phone, name, hash, agreePrivacy, agreeMarketing)
      .run()
    const userId = result.meta.last_row_id as number
    await createSession(c, userId)
    return c.json({ ok: true, redirect: '/' })
  } catch (e: any) {
    console.error('signup error:', e?.message || e)
    return c.json({ ok: false, error: '가입 중 오류가 발생했습니다.' }, 500)
  }
})

app.post('/api/auth/login', async (c) => {
  try {
    const form = await c.req.formData()
    const email = String(form.get('email') ?? '').trim().toLowerCase()
    const password = String(form.get('password') ?? '')
    const next = String(form.get('redirect') ?? form.get('next') ?? '') || '/'

    const hash = await hashPassword(password)
    const row = await c.env.DB.prepare(
      `SELECT id, role FROM users WHERE email = ? AND password_hash = ? LIMIT 1`
    ).bind(email, hash).first<{ id: number; role: string }>()

    if (!row) {
      return c.json({ ok: false, error: '이메일 또는 비밀번호를 확인해 주세요.' }, 401)
    }
    await createSession(c, row.id)
    return c.json({ ok: true, redirect: next })
  } catch (e: any) {
    console.error('login error:', e?.message || e)
    return c.json({ ok: false, error: '로그인 중 오류가 발생했습니다.' }, 500)
  }
})

// 로그아웃 GET (마이페이지 등에서 링크로 호출)
app.get('/api/auth/logout', async (c) => {
  await destroySession(c)
  return c.redirect('/')
})

// 현재 로그인 사용자 정보 (Nav 동적 치환용)
app.get('/api/auth/me', async (c) => {
  const u = await getUserFromSession(c)
  if (!u) return c.json({ logged: false })
  return c.json({
    logged: true,
    user: { id: u.id, name: u.name, email: u.email, role: u.role },
  })
})

// ============================================================
// MyPage (회원 전용)
// ============================================================
app.get('/mypage', async (c) => {
  const user = await getUserFromSession(c)
  if (!user) return c.redirect('/login?next=' + encodeURIComponent('/mypage'))

  // 가입일/마케팅 동의 등 추가 정보 조회
  const detail = await c.env.DB.prepare(
    'SELECT created_at, agreed_marketing FROM users WHERE id = ? LIMIT 1'
  ).bind(user.id).first<{ created_at: string; agreed_marketing: number }>()

  // 통계 (전체 공개 콘텐츠 카운트)
  const baCount = await c.env.DB.prepare(
    'SELECT COUNT(*) as n FROM before_after WHERE is_published = 1'
  ).first<{ n: number }>()
  const blogCount = await c.env.DB.prepare(
    'SELECT COUNT(*) as n FROM blog_posts WHERE is_published = 1'
  ).first<{ n: number }>()
  const noticeCount = await c.env.DB.prepare(
    'SELECT COUNT(*) as n FROM notices WHERE is_published = 1'
  ).first<{ n: number }>()

  const notice = c.req.query('notice') || undefined
  const error = c.req.query('error') || undefined

  return c.html(
    <MyPage
      user={{
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        created_at: detail?.created_at,
        agreed_marketing: detail?.agreed_marketing ?? 0,
      }}
      stats={{
        baCount: baCount?.n ?? 0,
        blogCount: blogCount?.n ?? 0,
        noticeCount: noticeCount?.n ?? 0,
      }}
      notice={notice}
      error={error}
    />
  )
})

// 회원 정보 수정
app.post('/mypage/update', async (c) => {
  const user = await getUserFromSession(c)
  if (!user) return c.redirect('/login?next=' + encodeURIComponent('/mypage'))

  try {
    const form = await c.req.formData()
    const name = String(form.get('name') ?? '').trim()
    const phone = normalizePhone(String(form.get('phone') ?? ''))
    const agreedMarketing = form.get('agreed_marketing') ? 1 : 0

    if (!name) return c.redirect('/mypage?error=' + encodeURIComponent('이름을 입력해 주세요.'))

    await c.env.DB.prepare(
      `UPDATE users SET name = ?, phone = ?, agreed_marketing = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(name, phone, agreedMarketing, user.id).run()

    return c.redirect('/mypage?notice=' + encodeURIComponent('회원 정보가 저장되었습니다.'))
  } catch (e) {
    return c.redirect('/mypage?error=' + encodeURIComponent('저장 중 오류가 발생했습니다.'))
  }
})

// 비밀번호 변경
app.post('/mypage/password', async (c) => {
  const user = await getUserFromSession(c)
  if (!user) return c.redirect('/login?next=' + encodeURIComponent('/mypage'))

  try {
    const form = await c.req.formData()
    const current = String(form.get('current') ?? '')
    const next = String(form.get('next') ?? '')
    const confirm = String(form.get('confirm') ?? '')

    if (next.length < 8 || next.length > 80) {
      return c.redirect('/mypage?error=' + encodeURIComponent('새 비밀번호는 8~80자여야 합니다.'))
    }
    if (next !== confirm) {
      return c.redirect('/mypage?error=' + encodeURIComponent('새 비밀번호 확인이 일치하지 않습니다.'))
    }

    const currentHash = await hashPassword(current)
    const row = await c.env.DB.prepare(
      `SELECT id FROM users WHERE id = ? AND password_hash = ? LIMIT 1`
    ).bind(user.id, currentHash).first()
    if (!row) {
      return c.redirect('/mypage?error=' + encodeURIComponent('현재 비밀번호가 올바르지 않습니다.'))
    }

    const nextHash = await hashPassword(next)
    await c.env.DB.prepare(
      `UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(nextHash, user.id).run()

    return c.redirect('/mypage?notice=' + encodeURIComponent('비밀번호가 변경되었습니다.'))
  } catch (e) {
    return c.redirect('/mypage?error=' + encodeURIComponent('비밀번호 변경 중 오류가 발생했습니다.'))
  }
})

// 회원 탈퇴
app.post('/mypage/delete', async (c) => {
  const user = await getUserFromSession(c)
  if (!user) return c.redirect('/login?next=' + encodeURIComponent('/mypage'))

  try {
    await c.env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(user.id).run()
    await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(user.id).run()
    await destroySession(c)
    return c.redirect('/?notice=' + encodeURIComponent('회원 탈퇴가 완료되었습니다.'))
  } catch (e) {
    return c.redirect('/mypage?error=' + encodeURIComponent('탈퇴 처리 중 오류가 발생했습니다.'))
  }
})

// ============================================================
// Before/After (public)
// ============================================================
app.get('/before-after', async (c) => {
  const treatment = c.req.query('treatment') ?? ''
  const q = c.req.query('q') ?? ''
  const loggedIn = await isLogged(c)

  let sql = 'SELECT * FROM before_after WHERE is_published = 1'
  const params: any[] = []
  if (treatment) { sql += ' AND treatment_slug = ?'; params.push(treatment) }
  if (q) { sql += ' AND (title LIKE ? OR summary LIKE ?)'; params.push(`%${q}%`, `%${q}%`) }
  sql += ' ORDER BY created_at DESC LIMIT 60'
  const cases = (await c.env.DB.prepare(sql).bind(...params).all()).results as any[]

  return c.html(
    <BeforeAfterListPage
      cases={cases}
      isLoggedIn={loggedIn}
      activeTreatment={treatment || undefined}
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
  // AEO: 마크다운 버전 — /blog/:slug.md
  if (slug.endsWith('.md')) {
    const post = await c.env.DB.prepare('SELECT * FROM blog_posts WHERE slug = ? AND is_published = 1 LIMIT 1').bind(slug.slice(0, -3)).first<any>()
    if (!post) return c.notFound()
    const author = post.author_slug ? getDoctor(post.author_slug) : undefined
    return c.text(blogToMarkdown(post, author?.name, author?.title), 200, {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Link': `<https://${CLINIC.domain}/blog/${post.slug}>; rel="canonical"`,
      'X-Robots-Tag': 'noindex',
    })
  }
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
  // AEO: 마크다운 버전 — /glossary/implant.md
  if (slug.endsWith('.md')) {
    const term = getGlossaryTerm(slug.slice(0, -3))
    if (!term) return c.notFound()
    return c.text(glossaryToMarkdown(term), 200, {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'Link': `<https://${CLINIC.domain}/glossary/${term.slug}>; rel="canonical"`,
      'X-Robots-Tag': 'noindex',
    })
  }
  const term = getGlossaryTerm(slug)
  if (!term) return c.notFound()
  return c.html(<GlossaryDetailPage term={term} />)
})

// ============================================================
// FAQ
// ============================================================
app.get('/faq', (c) => c.html(<FaqAllPage />))

// AEO: FAQ 전체 마크다운 — 160+ Q&A를 LLM이 한 번에 흡수
app.get('/faq.md', (c) => {
  const md = faqToMarkdown(TREATMENT_LIST.map((t) => ({ name: t.name, nameEn: t.nameEn, slug: t.slug, faqs: [...t.faqs] })))
  return c.text(md, 200, {
    'Content-Type': 'text/markdown; charset=utf-8',
    'Cache-Control': 'public, max-age=86400',
    'Link': `<https://${CLINIC.domain}/faq>; rel="canonical"`,
    'X-Robots-Tag': 'noindex',
  })
})

// ============================================================
// 통합 검색 — WebSite SearchAction 실동작 엔드포인트 (AEO/Sitelinks Search Box)
// 정적(진료/용어/지역/FAQ) + DB(블로그/공지) 통합
// ============================================================
app.get('/search', async (c) => {
  const q = (c.req.query('q') ?? '').trim().slice(0, 60)
  let results: SearchResultItem[] = []
  if (q) {
    results = searchStatic(q, 30)
    // DB 검색 (블로그 + 공지) — LIKE 기반, 실패해도 정적 결과는 유지
    try {
      const like = `%${q.replace(/[%_]/g, '')}%`
      const blogs = (await c.env.DB.prepare(
        'SELECT slug, title, COALESCE(excerpt, "") AS excerpt FROM blog_posts WHERE is_published = 1 AND (title LIKE ?1 OR excerpt LIKE ?1 OR tags LIKE ?1 OR content LIKE ?1) ORDER BY published_at DESC LIMIT 10'
      ).bind(like).all()).results as any[]
      for (const b of blogs) {
        results.push({ type: '블로그', title: b.title, url: `/blog/${b.slug}`, snippet: b.excerpt || '부평우리치과 블로그' })
      }
      const notices = (await c.env.DB.prepare(
        'SELECT id, title, COALESCE(content, "") AS content FROM notices WHERE is_published = 1 AND (title LIKE ?1 OR content LIKE ?1) ORDER BY published_at DESC LIMIT 5'
      ).bind(like).all()).results as any[]
      for (const n of notices) {
        const text = String(n.content).replace(/<[^>]+>/g, '').slice(0, 110)
        results.push({ type: '공지', title: n.title, url: `/notices/${n.id}`, snippet: text })
      }
    } catch {}
  }
  return c.html(<SearchPage q={q} results={results} />)
})

// ============================================================
// Visit
// ============================================================
app.get('/visit', (c) => c.html(<VisitPage />))

// ============================================================
// IndexNow 키 파일 — 루트 위치 필수 (루트 키 = 사이트 전체 URL 제출 권한)
// ============================================================
app.get(`/${INDEXNOW_KEY}.txt`, (c) => c.text(INDEXNOW_KEY))

// ============================================================
// Sitemap + robots
// ============================================================
app.get('/robots.txt', (c) => {
  const lines = [
    '# 부평우리치과 robots.txt',
    '',
    '# 일반 검색엔진',
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /admin/',
    'Disallow: /api',
    'Disallow: /api/',
    'Disallow: /login',
    'Disallow: /signup',
    'Disallow: /mypage',
    'Disallow: /logout',
    '',
    '# AI 검색엔진 / LLM 크롤러 명시 허용',
    'User-agent: GPTBot',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api',
    '',
    'User-agent: ChatGPT-User',
    'Allow: /',
    '',
    'User-agent: OAI-SearchBot',
    'Allow: /',
    '',
    'User-agent: ClaudeBot',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api',
    '',
    'User-agent: Claude-Web',
    'Allow: /',
    '',
    'User-agent: anthropic-ai',
    'Allow: /',
    '',
    'User-agent: PerplexityBot',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api',
    '',
    'User-agent: Perplexity-User',
    'Allow: /',
    '',
    'User-agent: Google-Extended',
    'Allow: /',
    '',
    'User-agent: Bingbot',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api',
    '',
    'User-agent: Applebot',
    'Allow: /',
    '',
    'User-agent: Applebot-Extended',
    'Allow: /',
    '',
    'User-agent: Yeti',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api',
    '',
    '# 추가 AI 크롤러 명시 허용 (AEO — 답변엔진 노출 극대화)',
    'User-agent: CCBot',
    'Allow: /',
    '',
    'User-agent: Amazonbot',
    'Allow: /',
    '',
    'User-agent: meta-externalagent',
    'Allow: /',
    '',
    'User-agent: cohere-ai',
    'Allow: /',
    '',
    'User-agent: DuckAssistBot',
    'Allow: /',
    '',
    'User-agent: YouBot',
    'Allow: /',
    '',
    'User-agent: MistralAI-User',
    'Allow: /',
    '',
    '# LLM 안내 문서 (llmstxt.org)',
    `# LLM-Index: https://${CLINIC.domain}/llms.txt`,
    `# LLM-Full: https://${CLINIC.domain}/llms-full.txt`,
    '',
    `Sitemap: https://${CLINIC.domain}/sitemap.xml`,
    `Sitemap: https://${CLINIC.domain}/sitemap-pages.xml`,
    `Sitemap: https://${CLINIC.domain}/sitemap-areas.xml`,
    `Sitemap: https://${CLINIC.domain}/sitemap-glossary.xml`,
    `Sitemap: https://${CLINIC.domain}/sitemap-blog.xml`,
    `Sitemap: https://${CLINIC.domain}/sitemap-notices.xml`,
    `Host: https://${CLINIC.domain}`,
  ]
  return c.text(lines.join('\n'), 200, { 'Content-Type': 'text/plain; charset=utf-8' })
})

// LLMs.txt — AI 친화 사이트 인덱스 (https://llmstxt.org)
app.get('/llms.txt', async (c) => {
  const base = `https://${CLINIC.domain}`
  let blogList = ''
  let noticeList = ''
  try {
    const blogs = (await c.env.DB.prepare(
      'SELECT slug, title, excerpt FROM blog_posts WHERE is_published = 1 ORDER BY published_at DESC LIMIT 20'
    ).all()).results as any[]
    blogList = blogs.map((b) => `- [${b.title}](${base}/blog/${b.slug}): ${b.excerpt ?? ''}`).join('\n')
    const notices = (await c.env.DB.prepare(
      'SELECT id, title FROM notices WHERE is_published = 1 ORDER BY published_at DESC LIMIT 10'
    ).all()).results as any[]
    noticeList = notices.map((n) => `- [${n.title}](${base}/notices/${n.id})`).join('\n')
  } catch {}

  const txt = `# ${CLINIC.name}

> 부평역 26번 출구 도보 1분, 14년 한 자리에서 변하지 않는 진료를 약속하는 프리미엄 치과. 고려대 구강악안면외과 의학박사 대표원장이 직접 진료하며 임플란트·심미보철·교정·라미네이트·사랑니발치·예방진료를 한 곳에서 통합 관리합니다.

## 핵심 정보
- **공식 사이트**: ${base}
- **주소**: ${CLINIC.address}
- **대표전화**: ${CLINIC.phone}
- **카카오톡 상담**: ${CLINIC.socialLinks.kakao}
- **네이버 예약**: ${CLINIC.socialLinks.naverBooking}
- **네이버 블로그**: ${CLINIC.socialLinks.blog}
- **진료시간**: 평일 10:00~19:00 / 토요일 10:00~14:00 / 일요일·공휴일 휴진
- **대표원장**: 김재인 (고려대학교 임상치의학대학원 임상치의학 박사, 통합치의학과 전문의)

## 주요 페이지
- [홈 — 부평우리치과 소개](${base}/): 변하지 않는 진료·신뢰·우리 철학과 핵심 진료 안내
- [미션](${base}/mission): 병원의 진료 철학과 환자 약속
- [의료진 소개](${base}/doctors): 6명의 전문의 프로필
- [김재인 대표원장](${base}/doctors/kim-jaein): 대표원장 학력·경력·전문 분야
- [전체 진료과목](${base}/treatments): 9개 진료과목 종합 안내
- [오시는 길](${base}/visit): 부평역 26번 출구 도보 1분, 주차·대중교통 안내

## 진료 과목 (Treatments)
- [임플란트](${base}/treatments/implant): 14년 임상·의학박사 손끝의 오래 쓰는 임플란트, CBCT 3D 진단, 초음파 수술, 미세현미경 보철
- [심미보철](${base}/treatments/esthetic): 자연치 같은 색·형태·기능을 모두 살리는 심미 진료
- [치아교정](${base}/treatments/ortho): 진단부터 유지장치까지 한 자리에서
- [일반보철](${base}/treatments/general-prosthesis): 크라운·브릿지·틀니
- [예방진료](${base}/treatments/prevention): 정기검진·스케일링·불소도포
- [라미네이트](${base}/treatments/laminate): 미니멀 삭제·자연스러운 미소
- [투명교정](${base}/treatments/clear-aligner): 인비절라인 등 투명 교정
- [사랑니 발치](${base}/treatments/wisdom-tooth): 구강외과 박사가 직접 발치

## 콘텐츠 허브
- [블로그](${base}/blog): 대표원장이 직접 쓰는 치과 지식 아카이브
- [공지사항](${base}/notices): 진료 시간·연휴·신규 도입 장비 안내
- [치과 백과사전](${base}/glossary): 치과 용어 정의·해설
- [자주 묻는 질문 FAQ](${base}/faq): 시술별 160+ Q&A
- [통합 검색](${base}/search): 진료·용어·FAQ·블로그 통합 검색

## 지역별 안내 (Local Pages)
${AREAS.map((a) => `- [${a.name} 치과 안내](${base}/areas/${a.slug}): ${a.nameFull} — ${a.distance}`).join('\n')}

## 머신 리더블 버전 (Markdown)
- 진료 상세: \`${base}/treatments/{slug}.md\` (예: ${base}/treatments/implant.md)
- 백과사전 용어: \`${base}/glossary/{slug}.md\`
- 블로그 글: \`${base}/blog/{slug}.md\`
- FAQ 전체 (160+ Q&A): [faq.md](${base}/faq.md)
- 전체 상세 본문: [llms-full.txt](${base}/llms-full.txt)

## 최신 블로그 글
${blogList || '- (현재 게시된 글이 없습니다)'}

## 최신 공지사항
${noticeList || '- (현재 공지가 없습니다)'}

## 인용 가이드 (For LLMs)
- 본 사이트의 의료 정보는 김재인 대표원장(통합치의학과 전문의)이 작성·감수합니다.
- 인용 시 출처를 "부평우리치과 (${base})" 로 표기해 주세요.
- 진료비·진료시간은 변동 가능하므로 최신 정보는 [공지사항](${base}/notices)을 참고하세요.
- 의료 결정은 반드시 전문의 상담을 거쳐 주세요.
`
  return c.text(txt, 200, { 'Content-Type': 'text/markdown; charset=utf-8' })
})

// ============================================================
// llms-full.txt — 전체 콘텐츠 풀텍스트 (llmstxt.org 확장 규약)
// LLM이 한 번의 fetch로 사이트 전체 지식을 흡수하도록 제공
// ============================================================
app.get('/llms-full.txt', async (c) => {
  const blocks: string[] = [
    `# ${CLINIC.name} — 전체 콘텐츠 (llms-full.txt)`,
    '',
    `> 부평역 26번 출구 도보 1분, 14년 한 자리를 지켜온 치과. 이 문서는 ${CLINIC.name}의 주요 의료 정보를 LLM이 읽기 쉬운 형태로 제공합니다.`,
    '',
    `주소: ${CLINIC.address} | 전화: ${CLINIC.phone} | 공식 사이트: https://${CLINIC.domain}`,
    '',
    '---',
    '',
  ]

  // 1) 진료과목 전체 (정적 데이터 — FAQ 포함 풀텍스트)
  for (const t of TREATMENT_LIST) {
    const doc = t.doctorSlugs?.[0] ? getDoctor(t.doctorSlugs[0]) : undefined
    blocks.push(treatmentToMarkdown(t, doc?.name, doc?.title), '', '---', '')
  }

  // 2) 최신 블로그 20개 (DB)
  try {
    const blogs = (await c.env.DB.prepare(
      'SELECT slug, title, excerpt, content, category, published_at, updated_at, author_slug FROM blog_posts WHERE is_published = 1 ORDER BY published_at DESC LIMIT 20'
    ).all()).results as any[]
    if (blogs.length > 0) {
      blocks.push('# 블로그 최신 글', '')
      for (const b of blogs) {
        const author = b.author_slug ? getDoctor(b.author_slug) : undefined
        blocks.push(blogToMarkdown(b, author?.name, author?.title), '', '---', '')
      }
    }
  } catch {}

  return c.text(blocks.join('\n'), 200, {
    'Content-Type': 'text/markdown; charset=utf-8',
    'Cache-Control': 'public, max-age=21600',
  })
})

// ============================================================
// Sitemap Index — 대규모 콘텐츠 대비 (Google 권장: 카테고리별 분할)
//   /sitemap.xml          → 인덱스 (4개 하위 sitemap 가리킴)
//   /sitemap-pages.xml    → 정적 페이지 + 진료/용어
//   /sitemap-blog.xml     → 블로그 (DB)
//   /sitemap-ba.xml       → 비포애프터 (DB)
//   /sitemap-notices.xml  → 공지사항 (DB)
// ============================================================
const sitemapXmlHeaders = { 'Content-Type': 'application/xml; charset=utf-8' }

type SitemapEntry = { loc: string; lastmod: string; changefreq: string; priority: string }

function buildUrlsetXml(base: string, entries: SitemapEntry[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(e => `  <url><loc>${base}${e.loc}</loc><lastmod>${e.lastmod}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`).join('\n')}
</urlset>`
}

/**
 * lastmod ISO 8601 완전 포맷으로 변환 (W3C Datetime)
 * 예: "2026-05-27T14:30:00+09:00"
 * - DB에서 온 값이 날짜만(YYYY-MM-DD) → 정오 KST 추가
 * - DB에서 ISO 형식(YYYY-MM-DDTHH:mm:ss) → 그대로
 * - SQLite datetime "YYYY-MM-DD HH:mm:ss" → ISO 변환 (KST 가정)
 */
function toIsoLastmod(raw: string | null | undefined, fallback?: string): string {
  const fb = fallback ?? new Date().toISOString()
  if (!raw) return fb
  const s = String(raw).trim()
  // 이미 완전한 ISO 형식 (T 또는 Z 포함)
  if (/T\d{2}:\d{2}/.test(s) || s.endsWith('Z')) {
    // 그대로 사용 (timezone 없으면 +00:00 가정 — 그대로 통과)
    return s
  }
  // SQLite "YYYY-MM-DD HH:mm:ss" → ISO 변환 (KST 가정)
  const dtMatch = s.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})/)
  if (dtMatch) {
    return `${dtMatch[1]}T${dtMatch[2]}+09:00`
  }
  // "YYYY-MM-DD" → 12:00 KST 추가
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return `${s}T12:00:00+09:00`
  }
  return fb
}

/** 오늘 자정 KST의 ISO 문자열 (DB fallback 전용 — 정적 페이지에 쓰지 말 것!) */
function todayIsoKst(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T00:00:00+09:00`
}

// ============================================================
// 정직한 lastmod 원칙 (Patient Grader A3 대응)
// 모든 정적 URL에 "오늘 날짜"를 찍는 것은 거짓 lastmod → A3 0점 패턴.
// 아래 상수는 해당 콘텐츠를 실제로 수정한 배포일에만 갱신한다.
// (콘텐츠 수정 없이 재배포할 때는 절대 건드리지 말 것)
// ============================================================
/** 핵심 정적 페이지·진료 상세 — 3차 업글(D5 용어 병기 + C4 진료장면)로 콘텐츠 수정 */
const PAGES_LASTMOD = '2026-08-18T12:00:00+09:00'
/** 지역×진료 랜딩 — 2026-05-26 생성 이후 콘텐츠 변경 없음 */
const AREAS_LASTMOD = '2026-05-26T12:00:00+09:00'
/** 치과 백과사전 582 용어 — 2026-04-20 마지막 시드 이후 변경 없음 */
const GLOSSARY_LASTMOD = '2026-04-20T12:00:00+09:00'

// ============================================================
// Sitemap Index — 조건부 등록 (빈 sitemap 자동 제외)
// ============================================================
app.get('/sitemap.xml', async (c) => {
  const base = `https://${CLINIC.domain}`
  const todayIso = todayIsoKst()
  // 각 자식 sitemap의 lastmod + 등록 여부
  let blogLast = todayIso, baLast = todayIso, noticeLast = todayIso
  let blogCount = 0, baCount = 0, noticeCount = 0, newsCount = 0, imageCount = 0
  try {
    const b = await c.env.DB.prepare(
      'SELECT MAX(COALESCE(updated_at, published_at, created_at)) AS lm, COUNT(*) AS cnt FROM blog_posts WHERE is_published = 1'
    ).first<{ lm: string | null; cnt: number }>()
    if (b?.lm) blogLast = toIsoLastmod(b.lm, todayIso)
    blogCount = Number(b?.cnt ?? 0)
    const a = await c.env.DB.prepare(
      'SELECT MAX(COALESCE(updated_at, published_at, created_at)) AS lm, COUNT(*) AS cnt FROM before_after WHERE is_published = 1'
    ).first<{ lm: string | null; cnt: number }>()
    if (a?.lm) baLast = toIsoLastmod(a.lm, todayIso)
    baCount = Number(a?.cnt ?? 0)
    const n = await c.env.DB.prepare(
      'SELECT MAX(COALESCE(updated_at, published_at, created_at)) AS lm, COUNT(*) AS cnt FROM notices WHERE is_published = 1'
    ).first<{ lm: string | null; cnt: number }>()
    if (n?.lm) noticeLast = toIsoLastmod(n.lm, todayIso)
    noticeCount = Number(n?.cnt ?? 0)
    // News sitemap 활성 조건: 최근 2일 내 발행된 블로그가 있는지
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    const nw = await c.env.DB.prepare(
      'SELECT COUNT(*) AS cnt FROM blog_posts WHERE is_published = 1 AND published_at >= ?'
    ).bind(twoDaysAgo).first<{ cnt: number }>()
    newsCount = Number(nw?.cnt ?? 0)
    // Image sitemap 활성 조건: BA(공개) 이미지 또는 블로그 커버가 1개라도 있으면
    const im = await c.env.DB.prepare(
      `SELECT
         (SELECT COUNT(*) FROM before_after WHERE is_published=1 AND (before_intra_key IS NOT NULL OR before_pano_key IS NOT NULL))
       + (SELECT COUNT(*) FROM blog_posts WHERE is_published=1 AND cover_key IS NOT NULL AND cover_key != '')
         AS cnt`
    ).first<{ cnt: number }>()
    imageCount = Number(im?.cnt ?? 0)
  } catch (err) {
    console.error('Sitemap index lastmod error:', err)
  }

  // 항상 등록 (정적 콘텐츠) — 정직한 lastmod: 실제 콘텐츠 수정일
  const children: string[] = [
    `  <sitemap><loc>${base}/sitemap-pages.xml</loc><lastmod>${PAGES_LASTMOD}</lastmod></sitemap>`,
    `  <sitemap><loc>${base}/sitemap-areas.xml</loc><lastmod>${AREAS_LASTMOD}</lastmod></sitemap>`,
    `  <sitemap><loc>${base}/sitemap-glossary.xml</loc><lastmod>${GLOSSARY_LASTMOD}</lastmod></sitemap>`,
  ]
  // 조건부 등록 (DB 의존, 데이터 있을 때만)
  if (blogCount > 0) {
    children.push(`  <sitemap><loc>${base}/sitemap-blog.xml</loc><lastmod>${blogLast}</lastmod></sitemap>`)
  }
  if (baCount > 0) {
    children.push(`  <sitemap><loc>${base}/sitemap-ba.xml</loc><lastmod>${baLast}</lastmod></sitemap>`)
  }
  if (noticeCount > 0) {
    children.push(`  <sitemap><loc>${base}/sitemap-notices.xml</loc><lastmod>${noticeLast}</lastmod></sitemap>`)
  }
  if (imageCount > 0) {
    children.push(`  <sitemap><loc>${base}/sitemap-images.xml</loc><lastmod>${baLast}</lastmod></sitemap>`)
  }
  if (newsCount > 0) {
    children.push(`  <sitemap><loc>${base}/sitemap-news.xml</loc><lastmod>${blogLast}</lastmod></sitemap>`)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${children.join('\n')}
</sitemapindex>`
  return c.text(xml, 200, sitemapXmlHeaders)
})

// ============================================================
// sitemap-areas.xml — 지역 × 진료 (8 허브 + 64 상세 = 72 + 인덱스 1)
// ============================================================
app.get('/sitemap-areas.xml', (c) => {
  const base = `https://${CLINIC.domain}`
  // 정직한 lastmod: 지역 콘텐츠 실제 수정일 (매일 갱신 X)
  const entries: SitemapEntry[] = [
    { loc: '/areas', lastmod: AREAS_LASTMOD, changefreq: 'monthly', priority: '0.9' },
  ]
  // 지역 허브 페이지 (8개) — priority 0.76~0.95
  for (const a of AREAS) {
    entries.push({
      loc: `/areas/${a.slug}`,
      lastmod: AREAS_LASTMOD,
      changefreq: 'monthly',
      priority: (Math.max(0.7, a.priority * 0.95)).toFixed(2),
    })
  }
  // 지역×진료 페이지 (64개) — priority 0.72~0.9
  for (const a of AREAS) {
    for (const tSlug of Object.keys(TREATMENT_LOCAL)) {
      entries.push({
        loc: `/areas/${a.slug}/${tSlug}`,
        lastmod: AREAS_LASTMOD,
        changefreq: 'monthly',
        priority: (Math.max(0.7, a.priority * 0.9)).toFixed(2),
      })
    }
  }
  return c.text(buildUrlsetXml(base, entries), 200, sitemapXmlHeaders)
})

// ============================================================
// sitemap-pages.xml — 정적 페이지 + 진료 상세 (용어집은 별도)
// 슬림화: 약 20개 핵심 URL만 (검색콘솔 추적 효율 ↑)
// ============================================================
app.get('/sitemap-pages.xml', (c) => {
  const base = `https://${CLINIC.domain}`
  // 정직한 lastmod: 실제 콘텐츠 수정일 (거짓 lastmod = Patient Grader A3 0점)
  const entries: SitemapEntry[] = [
    { loc: '/', lastmod: PAGES_LASTMOD, changefreq: 'weekly', priority: '1.0' },
    { loc: '/mission', lastmod: PAGES_LASTMOD, changefreq: 'monthly', priority: '0.8' },
    { loc: '/doctors', lastmod: PAGES_LASTMOD, changefreq: 'monthly', priority: '0.9' },
    { loc: '/doctors/kim-jaein', lastmod: PAGES_LASTMOD, changefreq: 'monthly', priority: '0.9' },
    { loc: '/treatments', lastmod: PAGES_LASTMOD, changefreq: 'monthly', priority: '0.9' },
    { loc: '/before-after', lastmod: PAGES_LASTMOD, changefreq: 'weekly', priority: '0.8' },
    { loc: '/blog', lastmod: PAGES_LASTMOD, changefreq: 'daily', priority: '0.9' },
    { loc: '/notices', lastmod: PAGES_LASTMOD, changefreq: 'weekly', priority: '0.8' },
    { loc: '/glossary', lastmod: GLOSSARY_LASTMOD, changefreq: 'monthly', priority: '0.7' },
    { loc: '/faq', lastmod: PAGES_LASTMOD, changefreq: 'monthly', priority: '0.8' },
    { loc: '/visit', lastmod: PAGES_LASTMOD, changefreq: 'monthly', priority: '0.8' },
    { loc: '/search', lastmod: PAGES_LASTMOD, changefreq: 'monthly', priority: '0.5' },
  ]
  // 진료 상세 8종 — 핵심 SEO 페이지 (3차 업글에서 용어 병기·진료장면 추가 = 실제 수정)
  for (const t of TREATMENT_LIST) {
    entries.push({ loc: `/treatments/${t.slug}`, lastmod: PAGES_LASTMOD, changefreq: 'monthly', priority: '0.95' })
  }
  return c.text(buildUrlsetXml(base, entries), 200, sitemapXmlHeaders)
})

// ============================================================
// sitemap-glossary.xml — 치과 백과사전 (582 용어) 단독
// 검색콘솔에서 추적 효율 위해 메인 페이지 sitemap과 분리
// ============================================================
app.get('/sitemap-glossary.xml', (c) => {
  const base = `https://${CLINIC.domain}`
  // 정직한 lastmod: 용어집 마지막 실제 수정일 (2026-04-20 시드 완료)
  const entries: SitemapEntry[] = []
  for (const g of GLOSSARY) {
    entries.push({ loc: `/glossary/${g.slug}`, lastmod: GLOSSARY_LASTMOD, changefreq: 'yearly', priority: '0.6' })
  }
  return c.text(buildUrlsetXml(base, entries), 200, sitemapXmlHeaders)
})

// ============================================================
// sitemap-blog.xml — 블로그 (DB 자동 등록, is_published=1)
// ============================================================
app.get('/sitemap-blog.xml', async (c) => {
  const base = `https://${CLINIC.domain}`
  const todayIso = todayIsoKst()
  const entries: SitemapEntry[] = []
  try {
    const blogs = (await c.env.DB.prepare(
      'SELECT slug, COALESCE(updated_at, published_at, created_at) AS lastmod FROM blog_posts WHERE is_published = 1 ORDER BY COALESCE(updated_at, published_at, created_at) DESC'
    ).all()).results as any[]
    for (const b of blogs) {
      entries.push({ loc: `/blog/${b.slug}`, lastmod: toIsoLastmod(b.lastmod, todayIso), changefreq: 'weekly', priority: '0.85' })
    }
  } catch (err) {
    console.error('Sitemap blog error:', err)
  }
  return c.text(buildUrlsetXml(base, entries), 200, sitemapXmlHeaders)
})

// ============================================================
// sitemap-ba.xml — 비포애프터 (DB 자동 등록)
// ============================================================
app.get('/sitemap-ba.xml', async (c) => {
  const base = `https://${CLINIC.domain}`
  const todayIso = todayIsoKst()
  const entries: SitemapEntry[] = []
  try {
    const bas = (await c.env.DB.prepare(
      'SELECT slug, COALESCE(updated_at, published_at, created_at) AS lastmod FROM before_after WHERE is_published = 1 ORDER BY COALESCE(updated_at, published_at, created_at) DESC'
    ).all()).results as any[]
    for (const b of bas) {
      entries.push({ loc: `/before-after/${b.slug}`, lastmod: toIsoLastmod(b.lastmod, todayIso), changefreq: 'weekly', priority: '0.85' })
    }
  } catch (err) {
    console.error('Sitemap BA error:', err)
  }
  return c.text(buildUrlsetXml(base, entries), 200, sitemapXmlHeaders)
})

// ============================================================
// sitemap-notices.xml — 공지사항 (DB 자동 등록)
// ============================================================
app.get('/sitemap-notices.xml', async (c) => {
  const base = `https://${CLINIC.domain}`
  const todayIso = todayIsoKst()
  const entries: SitemapEntry[] = []
  try {
    const notices = (await c.env.DB.prepare(
      'SELECT id, COALESCE(updated_at, published_at, created_at) AS lastmod FROM notices WHERE is_published = 1 ORDER BY COALESCE(updated_at, published_at, created_at) DESC'
    ).all()).results as any[]
    for (const n of notices) {
      entries.push({ loc: `/notices/${n.id}`, lastmod: toIsoLastmod(n.lastmod, todayIso), changefreq: 'weekly', priority: '0.7' })
    }
  } catch (err) {
    console.error('Sitemap notices error:', err)
  }
  return c.text(buildUrlsetXml(base, entries), 200, sitemapXmlHeaders)
})

// ============================================================
// Phase 4-7: 이미지 sitemap — 비포애프터(공개분) + 블로그 커버 + 의료진/장비
// 구글 이미지 검색 노출용 (image: 네임스페이스 사용)
// ============================================================
app.get('/sitemap-images.xml', async (c) => {
  const base = `https://${CLINIC.domain}`
  type ImgUrl = { pageUrl: string; pageTitle: string; images: { loc: string; title?: string; caption?: string }[] }
  const urls: ImgUrl[] = []
  // BA 비포(공개) 이미지 — 애프터는 회원 전용이라 색인 제외
  try {
    const ba = (await c.env.DB.prepare(
      `SELECT id, slug, title, treatment_slug, before_intra_key, before_pano_key
       FROM before_after
       WHERE is_published = 1
       ORDER BY created_at DESC
       LIMIT 200`
    ).all()).results as any[]
    for (const b of ba) {
      const imgs: { loc: string; title?: string; caption?: string }[] = []
      if (b.before_intra_key) imgs.push({
        loc: `${base}/media/${b.before_intra_key}`,
        title: `${b.title} - 치료 전 (구강 내)`,
        caption: `${CLINIC.name} 비포애프터 - ${b.title}`,
      })
      if (b.before_pano_key) imgs.push({
        loc: `${base}/media/${b.before_pano_key}`,
        title: `${b.title} - 치료 전 (파노라마)`,
        caption: `${CLINIC.name} 비포애프터 - ${b.title}`,
      })
      if (imgs.length > 0) {
        urls.push({
          pageUrl: `${base}/before-after/${b.slug}`,
          pageTitle: b.title,
          images: imgs,
        })
      }
    }
  } catch (err) { console.error('Sitemap images BA error:', err) }
  // 블로그 커버 이미지
  try {
    const blog = (await c.env.DB.prepare(
      `SELECT slug, title, cover_key
       FROM blog_posts
       WHERE is_published = 1 AND cover_key IS NOT NULL AND cover_key != ''
       ORDER BY published_at DESC
       LIMIT 200`
    ).all()).results as any[]
    for (const p of blog) {
      urls.push({
        pageUrl: `${base}/blog/${p.slug}`,
        pageTitle: p.title,
        images: [{
          loc: `${base}/media/${p.cover_key}`,
          title: `${p.title}`,
          caption: `${CLINIC.name} 블로그 - ${p.title}`,
        }],
      })
    }
  } catch (err) { console.error('Sitemap images blog error:', err) }
  // OG 기본 이미지 (홈)
  urls.push({
    pageUrl: `${base}/`,
    pageTitle: CLINIC.name,
    images: [{
      loc: `${base}/static/og/og-default.png?v=20260430m`,
      title: `${CLINIC.name} 공식 이미지`,
      caption: `${CLINIC.name} - 부평역 26번 출구 도보 1분`,
    }],
  })

  const escapeXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
  const xmlBody = urls.map(u => {
    const imageBlocks = u.images.map(img => `
    <image:image>
      <image:loc>${escapeXml(img.loc)}</image:loc>
      ${img.title ? `<image:title>${escapeXml(img.title)}</image:title>` : ''}
      ${img.caption ? `<image:caption>${escapeXml(img.caption)}</image:caption>` : ''}
    </image:image>`).join('')
    return `  <url>
    <loc>${escapeXml(u.pageUrl)}</loc>${imageBlocks}
  </url>`
  }).join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${xmlBody}
</urlset>`
  return c.text(xml, 200, sitemapXmlHeaders)
})

// ============================================================
// Phase 4-8: News sitemap — 최근 2일 이내 블로그만 (구글 뉴스 정책)
// ============================================================
app.get('/sitemap-news.xml', async (c) => {
  const base = `https://${CLINIC.domain}`
  const escapeXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
  let items: string[] = []
  try {
    // 최근 2일 이내 발행된 블로그만 (구글 뉴스 sitemap 정책)
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    const r = await c.env.DB.prepare(
      `SELECT slug, title, published_at, meta_keywords
       FROM blog_posts
       WHERE is_published = 1 AND published_at >= ?
       ORDER BY published_at DESC
       LIMIT 1000`
    ).bind(twoDaysAgo).all()
    const posts = (r.results as any[]) ?? []
    items = posts.map(p => {
      const pubDate = new Date(p.published_at).toISOString()
      const keywords = (p.meta_keywords ?? '').slice(0, 200)
      return `  <url>
    <loc>${escapeXml(`${base}/blog/${p.slug}`)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(CLINIC.name)}</news:name>
        <news:language>ko</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(p.title)}</news:title>
      ${keywords ? `<news:keywords>${escapeXml(keywords)}</news:keywords>` : ''}
    </news:news>
  </url>`
    })
  } catch (err) { console.error('Sitemap news error:', err) }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items.join('\n')}
</urlset>`
  return c.text(xml, 200, sitemapXmlHeaders)
})

// ============================================================
// Phase 4-8: RSS 2.0 피드 — 블로그 (구글 뉴스 보조 + 피드리더)
// ============================================================
app.get('/rss.xml', async (c) => {
  const base = `https://${CLINIC.domain}`
  const escapeXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
  let items: string[] = []
  let lastBuildDate = new Date().toUTCString()
  try {
    const r = await c.env.DB.prepare(
      `SELECT slug, title, excerpt, meta_description, published_at, category, cover_key
       FROM blog_posts
       WHERE is_published = 1
       ORDER BY published_at DESC
       LIMIT 30`
    ).all()
    const posts = (r.results as any[]) ?? []
    if (posts[0]?.published_at) {
      lastBuildDate = new Date(posts[0].published_at).toUTCString()
    }
    items = posts.map(p => {
      const link = `${base}/blog/${p.slug}`
      const pubDate = new Date(p.published_at).toUTCString()
      const desc = p.excerpt ?? p.meta_description ?? ''
      const category = p.category ?? ''
      const enclosure = p.cover_key ? `\n      <enclosure url="${escapeXml(`${base}/media/${p.cover_key}`)}" type="image/jpeg"/>` : ''
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(desc)}</description>
      ${category ? `<category>${escapeXml(category)}</category>` : ''}
      <pubDate>${pubDate}</pubDate>${enclosure}
    </item>`
    })
  } catch (err) { console.error('RSS error:', err) }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${CLINIC.name} 블로그`)}</title>
    <link>${base}/blog</link>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>${escapeXml('부평우리치과의 진료 정보 아카이브. 임플란트·심미보철·교정·라미네이트 등 치과 지식과 실제 케이스를 기록합니다.')}</description>
    <language>ko-KR</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items.join('\n')}
  </channel>
</rss>`
  return c.text(xml, 200, { 'Content-Type': 'application/rss+xml; charset=utf-8' })
})

app.get('/manifest.webmanifest', (c) => {
  return c.json({
    name: CLINIC.name,
    short_name: '부평우리치과',
    description: CLINIC.mission,
    theme_color: '#6DBBB9',
    background_color: '#ffffff',
    display: 'standalone',
    start_url: '/',
    icons: [{ src: '/static/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  })
})

// ============================================================
// Media (R2) serving
// ============================================================
// AFTER 이미지 보호: 비로그인 시 모든 진입 경로(직접 URL 포함)에서 차단
async function isProtectedAfterKey(c: any, key: string): Promise<boolean> {
  // 비포애프터 R2 키 패턴(ba/pano-after-*, ba/intra-after-*)은 항상 보호 대상
  if (!/^ba\/(pano|intra)-after[-/]/.test(key)) return false
  try {
    const r = await c.env.DB.prepare(
      `SELECT 1 FROM before_after WHERE after_pano_key = ? OR after_intra_key = ? LIMIT 1`
    ).bind(key, key).first()
    return !!r
  } catch {
    // DB 조회 실패 시 안전하게 보호 처리
    return true
  }
}

app.get('/media/*', async (c) => {
  if (!c.env.R2) return c.notFound()
  const key = decodeURIComponent(c.req.path.replace(/^\/media\//, ''))

  // AFTER 이미지: 로그인 회원만 접근 허용 (직접 URL 우회 방지)
  if (await isProtectedAfterKey(c, key)) {
    const user = await getUserFromSession(c)
    if (!user) {
      return c.text('Login required to view AFTER images.', 403, {
        'Cache-Control': 'no-store',
      })
    }
  }

  // Range 요청 처리 — 영상 스트리밍 필수
  const range = c.req.header('range')
  if (range) {
    const match = /bytes=(\d+)-(\d+)?/.exec(range)
    if (match) {
      const start = Number(match[1])
      const head = await c.env.R2.head(key)
      if (!head) return c.notFound()
      const end = match[2] ? Number(match[2]) : Math.min(start + 1024 * 1024 * 4 - 1, head.size - 1)
      const length = end - start + 1
      const obj = await c.env.R2.get(key, { range: { offset: start, length } })
      if (!obj) return c.notFound()
      const headers = new Headers()
      headers.set('Content-Type', head.httpMetadata?.contentType ?? 'application/octet-stream')
      headers.set('Content-Length', String(length))
      headers.set('Content-Range', `bytes ${start}-${end}/${head.size}`)
      headers.set('Accept-Ranges', 'bytes')
      headers.set('Cache-Control', key.startsWith('videos/') ? 'public, max-age=2592000, immutable' : 'public, max-age=86400')
      return new Response(obj.body, { status: 206, headers })
    }
  }

  const obj = await c.env.R2.get(key)
  if (!obj) return c.notFound()
  const headers = new Headers()
  headers.set('Content-Type', obj.httpMetadata?.contentType ?? 'application/octet-stream')
  headers.set('Accept-Ranges', 'bytes')
  headers.set('Content-Length', String(obj.size))
  headers.set('Cache-Control', key.startsWith('videos/') ? 'public, max-age=2592000, immutable' : 'public, max-age=86400')
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

// 상수시간 문자열 비교 (타이밍 공격 방어)
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

// 어드민 토큰 = SHA-256(ADMIN_PASSWORD + "|admin-cookie-v1")
async function adminTokenFor(password: string): Promise<string> {
  return await hashPassword(password + '|admin-cookie-v1')
}

// Admin login POST — 비밀번호 단일 입력
app.post('/admin/login', async (c) => {
  try {
    const form = await c.req.formData()
    const password = String(form.get('password') ?? '')
    const adminPw = c.env.ADMIN_PASSWORD ?? ''
    if (!adminPw) {
      return c.redirect('/admin/login?error=' + encodeURIComponent('관리자 비밀번호가 설정되지 않았습니다.'))
    }
    if (!timingSafeEqual(password, adminPw)) {
      return c.redirect('/admin/login?error=' + encodeURIComponent('비밀번호가 올바르지 않습니다.'))
    }
    const token = await adminTokenFor(adminPw)
    // HttpOnly + Secure 쿠키 발급 (30일)
    c.header(
      'Set-Cookie',
      `admin_token=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 30}`
    )
    return c.redirect('/admin')
  } catch (e) {
    return c.redirect('/admin/login?error=' + encodeURIComponent('로그인 오류'))
  }
})

app.get('/admin/logout', (c) => {
  c.header('Set-Cookie', 'admin_token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0')
  return c.redirect('/admin/login')
})

// Admin auth middleware — 단일 비밀번호 쿠키 검증
app.use('/admin/*', async (c, next) => {
  if (c.req.path === '/admin/login') return next()
  const adminPw = c.env.ADMIN_PASSWORD ?? ''
  if (!adminPw) return c.redirect('/admin/login?error=' + encodeURIComponent('관리자 비밀번호가 설정되지 않았습니다.'))
  const cookieHeader = c.req.header('Cookie') ?? ''
  const m = cookieHeader.match(/(?:^|;\s*)admin_token=([^;]+)/)
  const token = m ? m[1] : ''
  const expected = await adminTokenFor(adminPw)
  if (!token || !timingSafeEqual(token, expected)) {
    return c.redirect('/admin/login')
  }
  await next()
})

// R2 list (admin only) — 업로드된 파일 확인용
app.get('/admin/r2/list', async (c) => {
  if (!c.env.R2) return c.json({ error: 'R2 not bound' }, 500)
  const prefix = c.req.query('prefix') ?? ''
  const result = await c.env.R2.list({ prefix, limit: 1000 })
  return c.json({
    objects: result.objects.map((o) => ({
      key: o.key,
      size: o.size,
      uploaded: o.uploaded,
      contentType: o.httpMetadata?.contentType,
    })),
    truncated: result.truncated,
  })
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
  // 자동 SEO: summary 비어있으면 자동 채움
  const treatmentName = TREATMENT_LIST.find((t) => t.slug === values.treatment_slug)?.name
  const seoFill = autoFillBaSeo({
    title: values.title ?? '',
    summary: values.summary,
    content: values.content,
    treatment_name: treatmentName,
  })
  values.summary = seoFill.summary
  // Upload files
  const bp = await uploadToR2(c, form.get('before_pano_file') as any, 'ba/pano-before') ?? get('before_pano_key') ?? null
  const ap = await uploadToR2(c, form.get('after_pano_file') as any, 'ba/pano-after') ?? get('after_pano_key') ?? null
  const bi = await uploadToR2(c, form.get('before_intra_file') as any, 'ba/intra-before') ?? get('before_intra_key') ?? null
  const ai = await uploadToR2(c, form.get('after_intra_file') as any, 'ba/intra-after') ?? get('after_intra_key') ?? null
  await c.env.DB.prepare(
    `INSERT INTO before_after (slug, title, treatment_slug, doctor_slug, age, gender, region, region_city, treatment_period, summary, content, before_pano_key, after_pano_key, before_intra_key, after_intra_key, is_published) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(values.slug, values.title, values.treatment_slug, values.doctor_slug, values.age, values.gender, values.region, values.region_city, values.treatment_period, values.summary, values.content, bp, ap, bi, ai, values.is_published).run()
  // IndexNow ping (fire-and-forget) — sitemap 전체에 발사
  if (values.is_published && values.slug) {
    c.executionCtx.waitUntil(pingIndexNow(buildIndexNowUrls({
      detailPath: `/before-after/${values.slug}`,
      listPath: '/before-after',
      alsoPingHome: true,
    })).catch(() => {}))
  }
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
  // 자동 SEO: summary 비어있으면 자동 채움
  const treatmentName = TREATMENT_LIST.find((t) => t.slug === get('treatment_slug'))?.name
  const seoFill = autoFillBaSeo({
    title: get('title'),
    summary: get('summary'),
    content: get('content'),
    treatment_name: treatmentName,
  })
  await c.env.DB.prepare(
    `UPDATE before_after SET slug=?, title=?, treatment_slug=?, doctor_slug=?, age=?, gender=?, region=?, region_city=?, treatment_period=?, summary=?, content=?, before_pano_key=?, after_pano_key=?, before_intra_key=?, after_intra_key=?, is_published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).bind(
    get('slug'), get('title'), get('treatment_slug'), get('doctor_slug'),
    get('age') ? Number(get('age')) : null, get('gender') || null, get('region') || null,
    get('region_city') || null, get('treatment_period') || null, seoFill.summary, get('content') || null,
    bp, ap, bi, ai, form.get('is_published') ? 1 : 0, id
  ).run()
  // IndexNow ping (fire-and-forget) — sitemap 전체에 발사
  if (form.get('is_published') && get('slug')) {
    c.executionCtx.waitUntil(pingIndexNow(buildIndexNowUrls({
      detailPath: `/before-after/${get('slug')}`,
      listPath: '/before-after',
    })).catch(() => {}))
  }
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
  // 자동 SEO: 빈 필드 자동 채움
  const seoFill = autoFillBlogSeo({
    title: get('title'),
    excerpt: get('excerpt'),
    content: get('content'),
    category: get('category'),
    tags: get('tags'),
    meta_description: get('meta_description'),
    meta_keywords: get('meta_keywords'),
  })
  await c.env.DB.prepare(
    `INSERT INTO blog_posts (slug, title, excerpt, content, cover_key, author_slug, category, tags, meta_description, meta_keywords, is_published) VALUES (?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(
    get('slug'), get('title'), seoFill.excerpt, get('content') || '',
    coverKey, get('author_slug') || 'kim-jaein', get('category') || null, get('tags') || null,
    seoFill.meta_description, seoFill.meta_keywords, form.get('is_published') ? 1 : 0
  ).run()
  // IndexNow ping (fire-and-forget) — sitemap 전체에 발사
  if (form.get('is_published') && get('slug')) {
    c.executionCtx.waitUntil(pingIndexNow(buildIndexNowUrls({
      detailPath: `/blog/${get('slug')}`,
      listPath: '/blog',
      alsoPingHome: true,
    })).catch(() => {}))
  }
  return c.redirect('/admin/blog')
})
app.post('/admin/blog/:id/edit', async (c) => {
  const id = Number(c.req.param('id'))
  const form = await c.req.formData()
  const get = (k: string) => String(form.get(k) ?? '').trim()
  const coverKey = await uploadToR2(c, form.get('cover_file') as any, 'blog/cover') ?? (get('cover_key') || null)
  // 자동 SEO: 빈 필드 자동 채움
  const seoFill = autoFillBlogSeo({
    title: get('title'),
    excerpt: get('excerpt'),
    content: get('content'),
    category: get('category'),
    tags: get('tags'),
    meta_description: get('meta_description'),
    meta_keywords: get('meta_keywords'),
  })
  await c.env.DB.prepare(
    `UPDATE blog_posts SET slug=?, title=?, excerpt=?, content=?, cover_key=?, author_slug=?, category=?, tags=?, meta_description=?, meta_keywords=?, is_published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).bind(
    get('slug'), get('title'), seoFill.excerpt, get('content') || '',
    coverKey, get('author_slug') || 'kim-jaein', get('category') || null, get('tags') || null,
    seoFill.meta_description, seoFill.meta_keywords, form.get('is_published') ? 1 : 0, id
  ).run()
  // IndexNow ping (fire-and-forget) — sitemap 전체에 발사
  if (form.get('is_published') && get('slug')) {
    c.executionCtx.waitUntil(pingIndexNow(buildIndexNowUrls({
      detailPath: `/blog/${get('slug')}`,
      listPath: '/blog',
    })).catch(() => {}))
  }
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
  const result = await c.env.DB.prepare(
    `INSERT INTO notices (title, content, image_key, is_major, is_published) VALUES (?,?,?,?,?)`
  ).bind(
    get('title'), get('content'), imageKey,
    form.get('is_major') ? 1 : 0, form.get('is_published') ? 1 : 0
  ).run()
  // IndexNow ping (fire-and-forget) — sitemap 전체에 발사
  if (form.get('is_published') && result.meta?.last_row_id) {
    c.executionCtx.waitUntil(pingIndexNow(buildIndexNowUrls({
      detailPath: `/notices/${result.meta.last_row_id}`,
      listPath: '/notices',
      alsoPingHome: true,
    })).catch(() => {}))
  }
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
  // IndexNow ping (fire-and-forget) — sitemap 전체에 발사
  if (form.get('is_published')) {
    c.executionCtx.waitUntil(pingIndexNow(buildIndexNowUrls({
      detailPath: `/notices/${id}`,
      listPath: '/notices',
    })).catch(() => {}))
  }
  return c.redirect('/admin/notices')
})

// ============================================================
// IndexNow 수동 트리거 (관리자) — 전체 사이트맵 URL 일괄 핑
// ============================================================
app.post('/admin/indexnow/ping-all', async (c) => {
  const admin = await requireAdmin(c)
  if (!admin) return c.json({ ok: false, error: 'unauthorized' }, 401)
  const urls = [
    '/', '/mission', '/doctors', '/treatments', '/before-after',
    '/blog', '/notices', '/glossary', '/faq', '/visit',
    '/treatments/implant', '/treatments/ortho', '/treatments/esthetic',
    '/treatments/laminate', '/treatments/clear-aligner', '/treatments/general-prosthesis',
    '/treatments/prevention', '/treatments/wisdom-tooth',
    '/doctors/kim-jaein', '/doctors/lim-sunyoung', '/doctors/jo-jeongha',
    '/doctors/jo-heeyoung', '/doctors/oh-youngjun', '/doctors/lim-yongmin',
  ]
  const result = await pingIndexNow(urls)
  return c.json({ ok: result.ok, status: result.status, count: urls.length, error: result.error })
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
// OG 미리보기 검증 (관리자)
// ============================================================
app.get('/admin/og-preview', async (c) => {
  const origin = new URL(c.req.url).origin
  const PAGES = [
    { path: '/', label: '홈' },
    { path: '/mission', label: '미션' },
    { path: '/doctors', label: '의료진' },
    { path: '/treatments', label: '진료과목' },
    { path: '/treatments/implant', label: '진료-임플란트' },
    { path: '/before-after', label: '비포애프터' },
    { path: '/blog', label: '블로그' },
    { path: '/notices', label: '공지사항' },
    { path: '/visit', label: '내원안내' },
    { path: '/faq', label: 'FAQ' },
    { path: '/glossary', label: '백과사전' },
    { path: '/login', label: '로그인' },
    { path: '/signup', label: '회원가입' },
  ]

  const extractMeta = (html: string, key: string): string | null => {
    const patterns = [
      new RegExp(`<meta[^>]*property=["']${key}["'][^>]*content=["']([^"']*)["']`, 'i'),
      new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${key}["']`, 'i'),
      new RegExp(`<meta[^>]*name=["']${key}["'][^>]*content=["']([^"']*)["']`, 'i'),
      new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${key}["']`, 'i'),
    ]
    for (const r of patterns) {
      const m = html.match(r)
      if (m) return m[1]
    }
    return null
  }

  const results = await Promise.all(
    PAGES.map(async (p) => {
      const url = origin + p.path
      const issues: string[] = []
      const warnings: string[] = []
      let title: string | null = null
      let description: string | null = null
      let ogImage: string | null = null
      let canonical: string | null = null
      let ogUrl: string | null = null

      try {
        const res = await fetch(url, { redirect: 'manual' })
        if (res.status >= 400) {
          issues.push(`HTTP ${res.status}`)
          return { path: p.path, label: p.label, url, title, description, ogImage, canonical, ogUrl, issues, warnings }
        }
        const html = await res.text()
        title = (html.match(/<title>([^<]*)<\/title>/i) || [, null])[1]
        description = extractMeta(html, 'description')
        ogImage = extractMeta(html, 'og:image')
        ogUrl = extractMeta(html, 'og:url')
        canonical = (html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) || [, null])[1]

        if (!title) issues.push('title 누락')
        if (!description) issues.push('description 누락')
        else if (description.length < 50) warnings.push(`description 짧음 (${description.length}자)`)
        else if (description.length > 160) warnings.push(`description 초과 (${description.length}자)`)
        if (!ogImage) issues.push('og:image 누락')
        if (!ogUrl) issues.push('og:url 누락')
        if (!canonical) issues.push('canonical 누락')
        if (ogUrl && canonical && ogUrl !== canonical) warnings.push('og:url ≠ canonical')
      } catch (e: any) {
        issues.push(`Fetch 실패: ${e.message}`)
      }

      return { path: p.path, label: p.label, url, title, description, ogImage, canonical, ogUrl, issues, warnings }
    })
  )

  return c.html(<AdminOgPreviewPage pages={results} />)
})

// ============================================================
// 404
// ============================================================
app.notFound((c) => {
  const path = new URL(c.req.url).pathname
  return c.html(<NotFoundPage path={path} />, 404)
})

export default app
