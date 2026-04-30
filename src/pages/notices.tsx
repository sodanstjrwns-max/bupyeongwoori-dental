import { Layout } from '../components/Layout'
import { CLINIC, OG_IMAGES } from '../lib/constants'
import { breadcrumbSchema, itemListSchema } from '../lib/schema'
import { CtaSection } from '../components/CtaSection'
import { InlineCta } from '../components/InlineCta'

type NoticeRow = {
  id: number
  title: string
  content: string
  image_key: string | null
  is_major: number
  view_count: number
  published_at: string
}

export const NoticesListPage = ({ notices }: { notices: NoticeRow[] }) => {
  const major = notices.filter((n) => n.is_major === 1)
  const regular = notices.filter((n) => n.is_major === 0)
  return (
    <Layout
      title="공지사항"
      description={`${CLINIC.name} 공지사항 — 진료 시간 변경, 연휴·휴진 안내, 신규 진료 도입, 의료 이벤트 등 환자분께 꼭 전해드려야 할 모든 소식을 한 곳에서 확인하세요.`}
      canonical={`https://${CLINIC.domain}/notices`}
      keywords="부평우리치과 공지사항, 부평치과 진료시간, 부평치과 연휴, 부평치과 이벤트"
      ogImage={OG_IMAGES.notices}
      jsonLd={[
        breadcrumbSchema([{ name: '홈', url: '/' }, { name: '공지사항', url: '/notices' }]),
        itemListSchema(
          notices.slice(0, 30).map((n) => ({ name: n.title, url: `/notices/${n.id}` })),
          '부평우리치과 공지사항'
        ),
      ]}
    >
      <section class="page-hero">
        <div class="container">
          <div class="page-eyebrow">NOTICES · 공지사항</div>
          <h1 class="page-title">
            변하지 않는 약속,<br/>
            <em class="ph-mint-3">정직한 안내</em>로.
          </h1>
          <p class="page-lead">부평우리치과의 최신 소식·진료 변경·이벤트를 가장 먼저 알려드립니다. 14년 한 자리에서, 변하지 않는 신뢰로.</p>
        </div>
      </section>

      <section class="section notices-section">
        <div class="container notices-container">
          {major.length > 0 && (
            <div class="notice-major-list" data-reveal>
              <div class="notices-section-label">
                <i class="fas fa-thumbtack"></i>
                <span>PINNED · 중요 공지</span>
              </div>
              {major.map((n) => (
                <a href={`/notices/${n.id}`} class="notice-item major">
                  <span class="notice-badge">대공지</span>
                  <div class="notice-body">
                    <h3>{n.title}</h3>
                    <div class="notice-meta">
                      <time>{new Date(n.published_at).toLocaleDateString('ko-KR')}</time>
                      <span class="dot-sep">·</span>
                      <span>조회 {n.view_count}</span>
                    </div>
                  </div>
                  <i class="fas fa-arrow-right"></i>
                </a>
              ))}
            </div>
          )}

          {(regular.length > 0 || major.length > 0) && (
            <div class="notices-section-label">
              <i class="fas fa-bullhorn"></i>
              <span>ALL · 전체 공지</span>
            </div>
          )}

          <ul class="notice-list">
            {regular.length === 0 && major.length === 0 ? (
              <li class="empty-state">
                <i class="fas fa-bullhorn" style="font-size:3rem; color:var(--ink-300);"></i>
                <h3 style="margin-top:16px;">등록된 공지사항이 없습니다</h3>
              </li>
            ) : (
              regular.map((n) => (
                <li>
                  <a href={`/notices/${n.id}`} class="notice-item">
                    <div class="notice-num">{String(n.id).padStart(2, '0')}</div>
                    <div class="notice-body">
                      <h3>{n.title}</h3>
                      <div class="notice-meta">
                        <time>{new Date(n.published_at).toLocaleDateString('ko-KR')}</time>
                        <span class="dot-sep">·</span>
                        <span>조회 {n.view_count}</span>
                      </div>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <CtaSection
        variant="light"
        eyebrow="CONTACT · 문의 사항이 있다면"
        title="공지 외에 궁금한 점, 직접 문의하세요."
        lead="진료 시간, 예약, 비용 등 어떤 문의도 부담 없이 연락주세요."
      />
    </Layout>
  )
}

export const NoticeDetailPage = ({ notice }: { notice: NoticeRow }) => {
  // 본문에서 텍스트 추출하여 description으로 사용 (HTML 태그 제거, 150자 이내)
  const plainText = (notice.content || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const autoDesc = plainText.length > 0
    ? `${notice.title} — ${plainText.slice(0, 140)}${plainText.length > 140 ? '…' : ''}`
    : `${notice.title} | ${CLINIC.name} 공지사항`
  const ogImage = notice.image_key ? `/media/${notice.image_key}` : OG_IMAGES.notices
  return (
    <Layout
      title={notice.title}
      description={autoDesc}
      canonical={`https://${CLINIC.domain}/notices/${notice.id}`}
      ogImage={ogImage}
      jsonLd={[
        breadcrumbSchema([
          { name: '홈', url: '/' },
          { name: '공지사항', url: '/notices' },
          { name: notice.title, url: `/notices/${notice.id}` },
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: notice.title,
          description: autoDesc,
          image: [`https://${CLINIC.domain}${ogImage}`],
          datePublished: notice.published_at,
          dateModified: notice.published_at,
          author: { '@type': 'Organization', name: CLINIC.name },
          publisher: {
            '@type': 'Organization',
            name: CLINIC.name,
            logo: { '@type': 'ImageObject', url: `https://${CLINIC.domain}/static/og/og-default.png?v=20260430m` },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://${CLINIC.domain}/notices/${notice.id}`,
          },
        },
      ]}
    >
      <article class="section" style="padding-top:120px;">
        <div class="container" style="max-width:820px;">
          <div class="page-breadcrumb">
            <a href="/notices">공지사항</a>
            {notice.is_major === 1 ? <span class="notice-badge" style="margin-left:8px;">대공지</span> : null}
          </div>
          <h1 style="font-family:var(--font-display); font-weight:300; font-size:clamp(1.8rem, 3.5vw, 2.6rem); margin-top:16px; line-height:1.25;">
            {notice.title}
          </h1>
          <div class="blog-detail-meta">
            <time>{new Date(notice.published_at).toLocaleDateString('ko-KR')}</time>
            <span>·</span>
            <span>조회 {notice.view_count}</span>
          </div>

          {notice.image_key ? (
            <img src={`/media/${notice.image_key}`} alt={notice.title} style="width:100%; border-radius:12px; margin:32px 0;" />
          ) : null}

          <div class="prose notice-content">
            {/* @ts-ignore */}
            <div dangerouslySetInnerHTML={{ __html: notice.content }} />
          </div>

          <InlineCta
            title="공지 외 진료 문의는 직접 연락이 가장 빠릅니다"
            lead="진료 일정, 예약 가능 시간, 휴진 변동 등 공지 내용 외 궁금한 점은 카카오톡·전화로 즉시 안내드립니다."
            backLabel="공지 목록으로"
            backHref="/notices"
          />
        </div>
      </article>

      <CtaSection
        variant="light"
        eyebrow="CONTACT · 더 자세한 안내가 필요하시다면"
        title="공지 외에 궁금한 점, 직접 확인하세요."
        lead="진료 일정, 예약, 비용 안내 등 어떤 문의도 부담 없이 연락주세요."
      />
    </Layout>
  )
}
