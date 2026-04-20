import { Layout } from '../components/Layout'
import { CLINIC } from '../lib/constants'
import { breadcrumbSchema } from '../lib/schema'

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
      description={`${CLINIC.name} 공지사항 — 진료 시간, 연휴 안내, 이벤트 등 병원 소식.`}
      canonical={`https://${CLINIC.domain}/notices`}
      jsonLd={[breadcrumbSchema([{ name: '홈', url: '/' }, { name: '공지사항', url: '/notices' }])]}
    >
      <section class="page-hero">
        <div class="container">
          <div class="page-eyebrow">NOTICES</div>
          <h1 class="page-title">공지사항</h1>
          <p class="page-lead">부평우리치과 최신 소식·진료 변경·이벤트를 안내드립니다.</p>
        </div>
      </section>

      <section class="section" style="padding-top:40px;">
        <div class="container" style="max-width:960px;">
          {major.length > 0 && (
            <div class="notice-major-list" data-reveal>
              <div class="section-eyebrow" style="padding-left:0;">PINNED</div>
              {major.map((n) => (
                <a href={`/notices/${n.id}`} class="notice-item major">
                  <span class="notice-badge">대공지</span>
                  <div class="notice-body">
                    <h3>{n.title}</h3>
                    <div class="notice-meta">
                      <time>{new Date(n.published_at).toLocaleDateString('ko-KR')}</time>
                      <span>· 조회 {n.view_count}</span>
                    </div>
                  </div>
                  <i class="fas fa-arrow-right"></i>
                </a>
              ))}
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
                    <div class="notice-body">
                      <h3>{n.title}</h3>
                      <div class="notice-meta">
                        <time>{new Date(n.published_at).toLocaleDateString('ko-KR')}</time>
                        <span>· 조회 {n.view_count}</span>
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
    </Layout>
  )
}

export const NoticeDetailPage = ({ notice }: { notice: NoticeRow }) => {
  return (
    <Layout
      title={notice.title}
      description={notice.title}
      canonical={`https://${CLINIC.domain}/notices/${notice.id}`}
      jsonLd={[
        breadcrumbSchema([
          { name: '홈', url: '/' },
          { name: '공지사항', url: '/notices' },
          { name: notice.title, url: `/notices/${notice.id}` },
        ]),
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

          <div class="prose">
            {/* @ts-ignore */}
            <div dangerouslySetInnerHTML={{ __html: notice.content }} />
          </div>

          <div style="margin-top:48px; padding-top:32px; border-top:1px solid var(--ink-100);">
            <a href="/notices" class="btn btn-dark">← 공지 목록</a>
          </div>
        </div>
      </article>
    </Layout>
  )
}
