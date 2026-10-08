import { Layout } from '../components/Layout'
import { BlogHubLine, htmlHasHubLink } from '../lib/hub-link'
import { CLINIC, OG_IMAGES } from '../lib/constants'
import { articleSchema, breadcrumbSchema, itemListSchema, medicalWebPageSchema } from '../lib/schema'
import { CtaSection } from '../components/CtaSection'
import { InlineCta } from '../components/InlineCta'
import { autoLinkContent } from '../lib/auto-link'
import { doctorPhotoSrc } from '../data/doctors'
import { TREATMENT_LIST } from '../data/treatments'
import { prepareArticleHtml, answerSummaryFromHtml, faqsFromArticleHtml, htmlText, metaDescription } from '../lib/article-seo'
import { faqSchema } from '../lib/schema'
import { postDoctor, clinicOrgRef, CLINIC_GENERAL_INFO_NOTE } from '../lib/authorship'

export const BLOG_PER_PAGE = 12
const listQuery = (category: string | undefined, page: number) => {
  const q: string[] = []
  if (category) q.push(`category=${encodeURIComponent(category)}`)
  if (page > 1) q.push(`page=${page}`)
  return q.length ? `?${q.join('&')}` : ''
}

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
  updated_at?: string | null
}

export const BlogListPage = ({
  posts,
  category,
  allCategories,
  page = 1,
  totalPages = 1,
}: {
  posts: BlogRow[]
  category?: string
  allCategories?: string[]
  page?: number
  totalPages?: number
}) => {
  const categories = allCategories ?? (Array.from(new Set(posts.map((p) => p.category).filter(Boolean))) as string[])
  return (
    <Layout
      title={`${category ? `${category} ` : ''}블로그${page > 1 ? ` (${page}쪽)` : ''}`}
      description="부평우리치과의 진료 정보 아카이브. 임플란트·심미보철·교정·라미네이트 등 검색했을 때 충분한 답을 드릴 수 있도록, 치과 지식과 실제 케이스를 기록합니다."
      canonical={`https://${CLINIC.domain}/blog${page > 1 ? `?page=${page}` : ''}`}
      keywords="부평치과 블로그, 임플란트 정보, 치과 건강 정보, 부평우리치과 블로그"
      ogImage={OG_IMAGES.blog}
      jsonLd={[
        breadcrumbSchema([{ name: '홈', url: '/' }, { name: '블로그', url: '/blog' }]),
        itemListSchema(
          posts.map((p) => ({ name: p.title, url: `/blog/${p.slug}` })),
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
          <p class="page-lead">부평우리치과가 정리한 치과 지식과 진료 정보. 알음알음이 아니라 정확한 판단으로 찾아오실 수 있도록.</p>
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
                const author = postDoctor(p)
                return (
                  <a href={`/blog/${p.slug}`} class="blog-card" data-reveal>
                    <div class="blog-cover">
                      {p.cover_key ? (
                        <img src={`/media/${p.cover_key}`} alt={p.title} loading="lazy" decoding="async" />
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
          {totalPages > 1 ? (
            <nav class="blog-filter wr-pager" aria-label="블로그 목록 페이지">
              {page > 1 ? <a href={`/blog${listQuery(category, page - 1)}`} class="chip" rel="prev">‹ 이전</a> : null}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) =>
                n === page ? <span class="chip active" aria-current="page">{n}</span> : <a href={`/blog${listQuery(category, n)}`} class="chip">{n}</a>
              )}
              {page < totalPages ? <a href={`/blog${listQuery(category, page + 1)}`} class="chip" rel="next">다음 ›</a> : null}
            </nav>
          ) : null}
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
  relatedCases = [],
}: {
  post: BlogRow
  related: BlogRow[]
  relatedCases?: { slug: string; title: string; treatment_period?: string | null }[]
}) => {
  // 대행사 투입 글·원장 미지정 글은 병원 발행 (lib/authorship.ts)
  const author = postDoctor(post)
  const url = `https://${CLINIC.domain}/blog/${post.slug}`
  const baseUrl = `https://${CLINIC.domain}`
  // 본문 정리(h1→h2·이미지 alt/lazy) → 핵심 요약(본문 발췌)·질문형 h3 FAQ 를 화면과 같은 HTML 에서 추출
  const bodyHtml = prepareArticleHtml(autoLinkContent(post.content), post.title)
  const answer = answerSummaryFromHtml(bodyHtml)
  const faqs = faqsFromArticleHtml(bodyHtml)
  const description = metaDescription(post.meta_description ?? post.excerpt, answer || htmlText(bodyHtml).slice(0, 200))
  const treatment = TREATMENT_LIST.find((t) => t.name === post.category)
  const photo = author ? doctorPhotoSrc(author.photo) : null
  const coverAbs = post.cover_key
    ? `${baseUrl}/media/${post.cover_key}`
    : `${baseUrl}${OG_IMAGES.blog}`

  // 실제 수정일 — updated_at이 발행일 이후면 dateModified로 사용 (구글 freshness 시그널)
  const modifiedAt = post.updated_at && post.updated_at > post.published_at ? post.updated_at : post.published_at

  // Article JSON-LD — keywords/section/image/dateModified까지 풀세트
  const articleLd = articleSchema({
    title: post.title,
    description,
    url,
    image: coverAbs,
    author: author ? `${author.title} ${author.name}` : undefined,
    authorSlug: author?.slug,
    datePublished: post.published_at,
    dateModified: modifiedAt,
  }) as any
  if (!author) articleLd.author = clinicOrgRef()
  if (post.category) articleLd.articleSection = post.category
  articleLd.keywords = post.meta_keywords
    ?? (post.tags
      ? post.tags.split(',').map((t) => t.trim()).filter(Boolean).join(', ')
      : `부평치과, 부평우리치과${post.category ? `, ${post.category}` : ''}`)
  articleLd.inLanguage = 'ko-KR'
  articleLd.isAccessibleForFree = true
  // 칼럼 = BlogPosting, 페이지 노드(MedicalWebPage)와 @id 로 연결
  articleLd['@type'] = 'BlogPosting'
  articleLd['@id'] = `${url}#article`
  articleLd.url = url
  articleLd.mainEntityOfPage = { '@id': `${url}#webpage` }
  articleLd.isPartOf = { '@id': `${baseUrl}/#website` }
  articleLd.image = { '@type': 'ImageObject', url: coverAbs }
  if (author) articleLd.reviewedBy = { '@id': `${baseUrl}/doctors/${author.slug}#person` }
  if (treatment) articleLd.about = { '@id': `${baseUrl}/treatments/${treatment.slug}#procedure` }

  return (
    <Layout
      title={post.title}
      description={description}
      keywords={post.meta_keywords ?? `부평치과, 부평우리치과, ${post.category ?? ''}`}
      canonical={url}
      ogImage={post.cover_key ? `/media/${post.cover_key}` : OG_IMAGES.blog}
      ogType="article"
      articleMeta={{
        publishedTime: post.published_at,
        modifiedTime: modifiedAt,
        author: author ? `${author.title} ${author.name}` : CLINIC.name,
        section: post.category ?? '치과 지식',
        tags: post.tags ? post.tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      }}
      jsonLd={[
        articleLd,
        breadcrumbSchema([
          { name: '홈', url: '/' },
          { name: '블로그', url: '/blog' },
          ...(post.category ? [{ name: post.category, url: `/blog?category=${encodeURIComponent(post.category)}` }] : []),
          { name: post.title, url: `/blog/${post.slug}` },
        ]),
        // E-E-A-T: 의료 블로그 콘텐츠 — 작성 의료진을 검수자로 명시
        medicalWebPageSchema({
          url,
          name: post.title,
          description,
          reviewer: author ? { name: author.name, title: author.title, slug: author.slug } : undefined,
          noReviewer: !author,
          lastReviewed: author ? modifiedAt?.slice(0, 10) : undefined,
          ...(treatment ? { about: treatment.name, aboutId: `${baseUrl}/treatments/${treatment.slug}#procedure` } : {}),
          speakableSelectors: ['h1', ...(answer ? ['.wr-answer'] : [])],
        }),
        faqs.length ? { ...faqSchema(faqs), '@id': `${url}#faq` } : null,
      ]}
    >
      <article class="section" style="padding-top:120px;">
        <div class="container" style="max-width:820px;">
          <div class="page-breadcrumb">
            <a href="/blog">블로그</a>{post.category ? <> · <a href={`/blog?category=${encodeURIComponent(post.category)}`}>{post.category}</a></> : null}
          </div>
          <h1 style="font-family:var(--font-display); font-weight:300; font-size:clamp(2rem, 4vw, 3rem); margin-top:16px; line-height:1.2;">
            {post.title}
          </h1>
          <div class="blog-detail-meta">
            <span>{author ? `${author.title} ${author.name}` : '부평우리치과'}</span>
            <span>·</span>
            <time datetime={post.published_at}>{new Date(post.published_at).toLocaleDateString('ko-KR')}</time>
            {modifiedAt !== post.published_at ? (
              <>
                <span>·</span>
                <span>수정 <time datetime={modifiedAt}>{new Date(modifiedAt).toLocaleDateString('ko-KR')}</time></span>
              </>
            ) : null}
            <span>·</span>
            <span>조회 {post.view_count.toLocaleString()}</span>
          </div>

          {/* E-E-A-T 가시적 검수 표시 — 구글 품질평가 가이드라인의 '책임 명시' 충족 */}
          {author ? (
            <aside class="medical-review-badge" aria-label="의학적 검수 정보" style="display:flex; align-items:center; gap:12px; margin-top:20px; padding:14px 18px; background:var(--ink-50, #f4f7f7); border-left:3px solid var(--brand-500, #6DBBB9); border-radius:0 12px 12px 0;">
              <i class="fas fa-user-md" aria-hidden="true" style="color:var(--brand-600, #2a9d9a); font-size:1.2rem;"></i>
              <p style="font-size:0.86rem; color:var(--ink-600); line-height:1.55; margin:0;">
                이 글은 <a href={`/doctors/${author.slug}`} style="font-weight:700; color:var(--brand-700, #1d7a78);">{author.title} {author.name}</a>
                {author.education?.[0] ? <span> ({author.education[0]})</span> : null}이(가) 직접 작성·검수한 의료 정보입니다.
              </p>
            </aside>
          ) : (
            <aside class="medical-review-badge" aria-label="작성 안내" style="display:flex; align-items:center; gap:12px; margin-top:20px; padding:14px 18px; background:var(--ink-50, #f4f7f7); border-left:3px solid var(--brand-500, #6DBBB9); border-radius:0 12px 12px 0;">
              <i class="fas fa-info-circle" aria-hidden="true" style="color:var(--brand-600, #2a9d9a); font-size:1.2rem;"></i>
              <p style="font-size:0.86rem; color:var(--ink-600); line-height:1.55; margin:0;">
                {CLINIC.name} 발행 · {CLINIC_GENERAL_INFO_NOTE}
              </p>
            </aside>
          )}

          {post.cover_key ? (
            <img src={`/media/${post.cover_key}`} alt={post.title} style="width:100%; border-radius:16px; margin:40px 0;" />
          ) : null}

          {answer ? (
            <aside class="wr-answer" aria-label="핵심 요약">
              <strong>핵심 요약</strong>
              <p>{answer}</p>
            </aside>
          ) : null}

          <div class="prose post-content">
            {/* @ts-ignore */}
            {/* Phase 3-5: 자동 내부 링크 — 진료/지역 키워드 발견 시 토픽 클러스터 링크 */}
            <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          </div>
          {/* 지역 안내 1문장 — "부평 치과" 허브로 (본문 자동 링크로 이미 허브 링크가 있으면 생략: 페이지당 2개 이하) */}
          {htmlHasHubLink(bodyHtml) ? null : <BlogHubLine slug={post.slug} />}
          <p class="wr-note">※ 이 글은 일반적인 의료 정보이며, 치료 결과는 개인의 구강 상태에 따라 다를 수 있습니다.</p>

          {author ? (
            <aside class="wr-author" aria-label="글쓴이">
              {photo ? <img src={photo} alt={`${author.title} ${author.name}`} width={72} height={72} loading="lazy" decoding="async" /> : null}
              <div>
                <span class="wr-author-label">글쓴이</span>
                <a href={`/doctors/${author.slug}`} class="wr-author-name">{author.title} {author.name}</a>
                <p>{author.specialties.map((sl) => TREATMENT_LIST.find((t) => t.slug === sl)?.name ?? sl).join(' · ')}{author.education?.[0] ? ` · ${author.education[0]}` : ''}</p>
                <p class="wr-author-date">최종 검토일 <time datetime={modifiedAt?.slice(0, 10)}>{modifiedAt?.slice(0, 10)}</time></p>
              </div>
            </aside>
          ) : null}

          {treatment || relatedCases.length ? (
            <div class="wr-related">
              {treatment ? <p><strong>관련 진료</strong> <a href={`/treatments/${treatment.slug}`}>{treatment.name} 진료 안내 →</a></p> : null}
              {relatedCases.length ? (
                <>
                  <h2>{treatment ? `${treatment.name} 비포애프터` : '비포애프터'}</h2>
                  <ul>{relatedCases.map((k) => <li><a href={`/before-after/${k.slug}`}>{k.title}</a>{k.treatment_period ? <span>{k.treatment_period}</span> : null}</li>)}</ul>
                </>
              ) : null}
            </div>
          ) : null}

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
                    {p.cover_key ? <img src={`/media/${p.cover_key}`} alt={p.title} loading="lazy" decoding="async" /> : (
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
