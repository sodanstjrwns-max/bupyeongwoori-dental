import { Layout } from '../components/Layout'
import { CLINIC } from '../lib/constants'

export const PlaceholderPage = ({
  title,
  phase,
  description,
}: {
  title: string
  phase: string
  description?: string
}) => {
  return (
    <Layout title={title} description={description ?? `${title} - ${CLINIC.name}`}>
      <section class="section" style="padding-top:160px; min-height:80vh; display:grid; place-items:center;">
        <div class="container" style="max-width:720px; text-align:center;">
          <div class="section-eyebrow" style="padding-left:0;">{phase}</div>
          <h1 style="font-family:var(--font-display); font-weight:300; margin-top:20px;">{title}</h1>
          <p style="margin-top:24px; color:var(--ink-500); font-size:1.05rem; line-height:1.8;">
            이 페이지는 <strong>{phase}</strong> 단계에서 제작될 예정입니다.<br />
            현재는 기본 구조만 준비되어 있으며, 곧 풍부한 콘텐츠가 채워질 예정입니다.
          </p>
          <div style="margin-top:40px; display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
            <a href="/" class="btn btn-dark"><i class="fas fa-home"></i> 홈으로</a>
            <a href="/mission" class="btn" style="background:white; border:1px solid var(--ink-200); color:var(--ink-900);">
              병원 미션 보기
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}
