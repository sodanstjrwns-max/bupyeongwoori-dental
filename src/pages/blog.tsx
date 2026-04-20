import { Layout } from '../components/Layout'
import { CLINIC } from '../lib/constants'
import { DOCTORS } from '../data/doctors'
import { articleSchema, breadcrumbSchema } from '../lib/schema'

type BlogRow = {
  id: number
  slug: string
  title: string
  excerpt: string | null
  content: string
  cover_key: string | null
  author_slug: string
  category: string | null
  tags: string | null
  meta_description: string | null
  meta_keywords: string | null
  view_count: number
  published_at: string
  created_at: string
}

export const BlogListPage = ({
  posts,
  category,
}: {
  posts: BlogRow[]
  category?: string
}) => {
  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean))) as string[]
  return (
    <Layout
      title="블로그"
      description="부평우리치과의 치과 지식·케이스·건강 팁을 공유합니다."
      canonical={`https://${CLINIC.domain}/blog`}
      keywords="부평치과 블로그, 임플란트 정보, 치과 건강 정보, 부평우리치과 블로그"
      jsonLd={[breadcrumbSchema([{ name: '홈', url: '/' }, { name: '블로그', url: '/blog' }])]}
    >
      <section class="page-hero">
        <div class="container">
          <div class="page-eyebrow">BLOG</div>
          <h1 class="page-title">
            치과 지식과 <em>이야기</em>
          </h1>
          <p class="page-lead">대표원장이 직접 전하는 치과 지식과 임상 경험을 공유합니다.</p>
        </div>
      </section>

      <section class="section" style="padding-top:40px;">
        <div class="container">
          <div class="blog-filter">
            <a href="/blog" class={`chip ${!category ? 'active' : ''}`}>전체</a>
            {categories.map((cat) => (
              <a href={`/blog?category=${encodeURIComponent(cat)}`} class={`chip ${category === cat ? 'active' : ''}`}>
                {cat}
              </a>
            ))}
          </div>

          {posts.length === 0 ? (
            <div class="empty-state">
              <i class="fas fa-newspaper" style="font-size:3rem; color:var(--ink-300);"></i>
              <h3 style="margin-top:16px;">아직 발행된 글이 없습니다</h3>
            </div>
          ) : (
            <div class="blog-grid">
              {posts.map((p) => {
                const author = DOCTORS.find((d) => d.slug === p.author_slug)
                return (
                  <a href={`/blog/${p.slug}`} class="blog-card" data-reveal>
                    <div class="blog-cover">
                      {p.cover_key ? (
                        <img src={`/media/${p.cover_key}`} alt={p.title} />
                      ) : (
                        <div class="blog-cover-fallback">
                          <span class="font-display">{p.category ?? 'POST'}</span>
                        </div>
                      )}
                    </div>
                    <div class="blog-body">
                      {p.category ? <span class="blog-cat">{p.category}</span> : null}
                      <h3 class="blog-title">{p.title}</h3>
                      {p.excerpt ? <p class="blog-excerpt">{p.excerpt}</p> : null}
                      <div class="blog-meta">
                        <span>{author ? `${author.title} ${author.name}` : '부평우리치과'}</span>
                        <span>{new Date(p.published_at).toLocaleDateString('ko-KR')}</span>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}

export const BlogDetailPage = ({
  post,
  related,
}: {
  post: BlogRow
  related: BlogRow[]
}) => {
  const author = DOCTORS.find((d) => d.slug === post.author_slug)
  const url = `https://${CLINIC.domain}/blog/${post.slug}`
  return (
    <Layout
      title={post.title}
      description={post.meta_description ?? post.excerpt ?? post.title}
      keywords={post.meta_keywords ?? `부평치과, 부평우리치과, ${post.category ?? ''}`}
      canonical={url}
      ogImage={post.cover_key ? `/media/${post.cover_key}` : undefined}
      jsonLd={[
        articleSchema({
          title: post.title,
          description: post.meta_description ?? post.excerpt ?? post.title,
          url,
          author: author?.name,
          datePublished: post.published_at,
        }),
        breadcrumbSchema([
          { name: '홈', url: '/' },
          { name: '블로그', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug}` },
        ]),
      ]}
    >
      <article class="section" style="padding-top:120px;">
        <div class="container" style="max-width:820px;">
          <div class="page-breadcrumb">
            <a href="/blog">블로그</a>{post.category ? <> · {post.category}</> : null}
          </div>
          <h1 style="font-family:var(--font-display); font-weight:300; font-size:clamp(2rem, 4vw, 3rem); margin-top:16px; line-height:1.2;">
            {post.title}
          </h1>
          <div class="blog-detail-meta">
            <span>{author ? `${author.title} ${author.name}` : '부평우리치과'}</span>
            <span>·</span>
            <time>{new Date(post.published_at).toLocaleDateString('ko-KR')}</time>
            <span>·</span>
            <span>조회 {post.view_count.toLocaleString()}</span>
          </div>

          {post.cover_key ? (
            <img src={`/media/${post.cover_key}`} alt={post.title} style="width:100%; border-radius:16px; margin:40px 0;" />
          ) : null}

          <div class="prose">
            {/* @ts-ignore */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {post.tags ? (
            <div class="blog-tags">
              {post.tags.split(',').map((tag) => (
                <span class="tag">#{tag.trim()}</span>
              ))}
            </div>
          ) : null}

          <div style="margin-top:48px; padding-top:40px; border-top:1px solid var(--ink-100); display:flex; gap:12px; flex-wrap:wrap;">
            <a href="/blog" class="btn btn-dark">← 블로그 목록</a>
            <a href={`tel:${CLINIC.phone}`} class="btn btn-primary">
              <i class="fas fa-phone"></i> 상담 문의
            </a>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section class="section section-soft">
          <div class="container">
            <div class="section-head">
              <div class="section-eyebrow">RELATED</div>
              <h2 class="section-title">함께 읽으면 좋은 글</h2>
            </div>
            <div class="blog-grid">
              {related.map((p) => (
                <a href={`/blog/${p.slug}`} class="blog-card">
                  <div class="blog-cover">
                    {p.cover_key ? <img src={`/media/${p.cover_key}`} alt={p.title} /> : (
                      <div class="blog-cover-fallback"><span class="font-display">{p.category ?? 'POST'}</span></div>
                    )}
                  </div>
                  <div class="blog-body">
                    {p.category ? <span class="blog-cat">{p.category}</span> : null}
                    <h3 class="blog-title">{p.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  )
}
