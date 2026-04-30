import { Layout } from '../components/Layout'
import { CLINIC, OG_IMAGES } from '../lib/constants'
import { DOCTORS } from '../data/doctors'
import { articleSchema, breadcrumbSchema, itemListSchema } from '../lib/schema'
import { CtaSection } from '../components/CtaSection'
import { InlineCta } from '../components/InlineCta'

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
      description="부평우리치과의 진료 정보 아카이브. 임플란트·심미보철·교정·라미네이트 등 검색했을 때 충분한 답을 드릴 수 있도록, 치과 지식과 실제 케이스를 기록합니다."
      canonical={`https://${CLINIC.domain}/blog`}
      keywords="부평치과 블로그, 임플란트 정보, 치과 건강 정보, 부평우리치과 블로그"
      ogImage={OG_IMAGES.blog}
      jsonLd={[
        breadcrumbSchema([{ name: '홈', url: '/' }, { name: '블로그', url: '/blog' }]),
        itemListSchema(
          posts.slice(0, 30).map((p) => ({ name: p.title, url: `/blog/${p.slug}` })),
          '부평우리치과 블로그'
        ),
      ]}
    >
      <section class="page-hero">
        <div class="container">
          <div class="page-eyebrow">BLOG · 치과 지식</div>
          <h1 class="page-title">
            검색했을 때 <em class="ph-mint-3">충분한 정보</em>를<br/>
            드릴 수 있는 치과.
          </h1>
          <p class="page-lead">대표원장이 직접 전하는 치과 지식과 14년 임상 경험. 알음알음이 아니라 정확한 판단으로 찾아오실 수 있도록.</p>
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

      <CtaSection
        eyebrow="CONTACT · 더 궁금한 점이 있다면"
        title="글로 다 못 담은 이야기, 직접 들어보세요."
        lead="블로그에서 본 진료가 내게도 가능한지, 무료 상담으로 정직하게 안내드립니다."
      />
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
      ogImage={post.cover_key ? `/media/${post.cover_key}` : OG_IMAGES.blog}
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

          <div class="prose post-content">
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

          <InlineCta
            title="이 글에서 다룬 진료, 직접 받아보고 싶다면"
            lead={`${post.category ? `[${post.category}] ` : ''}궁금하신 점은 진단으로 가장 정확하게 안내드립니다. 진료 가능 여부·비용·치료 플랜을 무료 상담으로 확인하세요.`}
            backLabel="블로그 목록으로"
            backHref="/blog"
            extraLabel={post.category ? `${post.category} 글 더 보기` : undefined}
            extraHref={post.category ? `/blog?category=${encodeURIComponent(post.category)}` : undefined}
          />
        </div>
      </article>

      {related.length > 0 && (
        <section class="section section-soft">
          <div class="container">
            <div class="section-head">
              <div class="section-eyebrow">RELATED</div>
              <h2 class="section-title">함께 읽으면 <em class="ph-mint-3">좋은 글</em></h2>
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

      <CtaSection
        eyebrow="CONTACT · 글에서 본 진료, 직접 상담"
        title="궁금한 점은 직접 듣는 게 가장 빠릅니다."
        lead="진료 가능 여부와 정확한 비용·치료 플랜을 무료로 안내드립니다."
      />
    </Layout>
  )
}
