import { Layout } from '../components/Layout'
import { CLINIC, OG_IMAGES } from '../lib/constants'
import { breadcrumbSchema } from '../lib/schema'
import { YOUTUBE_CHANNEL_URL, YOUTUBE_VIDEOS } from '../data/youtube'

// 콘텐츠 > 유튜브 — 2026-10-31 김재인 원장 요청("치과 공식 유튜브 영상을 바로 확인할 수 있는 탭")
export const VideosPage = () => {
  const [featured, ...rest] = YOUTUBE_VIDEOS
  const base = `https://${CLINIC.domain}`
  return (
    <Layout
      title="유튜브 영상 | 원장이 직접 설명하는 치과 이야기"
      description="부평우리치과 공식 유튜브 영상 모음 — 임플란트 관리, 사랑니, 잇몸 출혈, 치아 응급처치까지 의료진이 직접 설명합니다."
      keywords="부평우리치과 유튜브, 부평치과 영상, 임플란트 영상, 치과 원장 설명"
      canonical={`${base}/videos`}
      ogImage={OG_IMAGES.default}
      jsonLd={[
        breadcrumbSchema([{ name: '홈', url: '/' }, { name: '유튜브 영상', url: '/videos' }]),
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${CLINIC.name} 유튜브 영상`,
          itemListElement: YOUTUBE_VIDEOS.map((v, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `https://www.youtube.com/watch?v=${v.id}`,
            name: v.title,
          })),
        },
      ]}
    >
      <section class="page-hero">
        <div class="container">
          <div class="page-eyebrow">YOUTUBE · 유튜브 영상</div>
          <h1 class="page-title">
            진료실에서 못다 한 이야기,<br />
            <em class="ph-mint-3">영상</em>으로 전합니다.
          </h1>
          <p class="page-lead">
            부평우리치과 의료진이 직접 설명하는 영상 {YOUTUBE_VIDEOS.length}편입니다. 영상을 누르면 유튜브에서 바로 보실 수 있습니다.
          </p>
        </div>
      </section>

      <section class="section" style="padding-top:32px;">
        <div class="container">
          {featured ? (
            <div style="max-width:960px; margin:0 auto 56px;">
              <div class="yt-embed">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${featured.id}`}
                  title={featured.title}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
              <p style="margin-top:14px; font-weight:700; font-size:1.1rem; color:var(--ink-900);">{featured.title}</p>
            </div>
          ) : null}

          <div class="yt-grid">
            {rest.map((v) => (
              <a class="yt-card" href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener">
                <div class="yt-thumb">
                  <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt={v.title} loading="lazy" decoding="async" width="480" height="360" />
                </div>
                <div class="yt-title">{v.title}</div>
              </a>
            ))}
          </div>

          <div style="margin-top:56px; text-align:center;">
            <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener" class="btn btn-dark btn-lg">
              <i class="fab fa-youtube"></i> 유튜브 채널 바로가기
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}
