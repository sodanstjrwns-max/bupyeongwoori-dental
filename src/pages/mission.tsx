import { Layout } from '../components/Layout'
import { CLINIC } from '../lib/constants'
import { breadcrumbSchema } from '../lib/schema'

export const MissionPage = () => {
  return (
    <Layout
      heroDark
      title="병원 미션 | 14년, 변하지 않는 진료의 약속"
      description="부평우리치과의 미션과 철학. 같은 퀄리티·같은 무드로 변하지 않는 진료를 제공합니다. 대표원장 김재인의 진료 철학을 확인하세요."
      canonical={`https://${CLINIC.domain}/mission`}
      jsonLd={breadcrumbSchema([
        { name: '홈', url: '/' },
        { name: '병원 미션', url: '/mission' },
      ])}
    >
      {/* Mission hero */}
      <section class="hero" style="min-height: 90vh;">
        <div class="container hero-content">
          <div class="hero-eyebrow" data-reveal>
            <span class="dot"></span>
            <span>OUR MISSION · 병원의 미션</span>
          </div>

          <h1 data-reveal data-reveal-delay="1" style="font-size:clamp(2.6rem, 8vw, 7rem);">
            제대로 된 치료를<br />
            받고 싶을 때,<br />
            <em>믿고 찾는 곳.</em>
          </h1>

          <p class="hero-sub" data-reveal data-reveal-delay="2" style="max-width:720px;">
            부평우리치과의 존재 이유는 단 하나입니다. <br/>
            <strong style="color:#fff;">검색했을 때 많은 정보를 알 수 있는 치과</strong>,
            그래서 알음알음이 아닌 <strong style="color:#fff;">정확한 판단</strong>으로 찾아오실 수 있는 치과가 되는 것.
          </p>
        </div>
      </section>

      {/* Story - 왜 시작했는가 */}
      <section class="section section-soft">
        <div class="container" style="max-width:860px;">
          <div class="section-head" data-reveal style="text-align:center; margin-left:auto; margin-right:auto;">
            <div class="section-eyebrow" style="padding-left:0;">CHAPTER 01 · ORIGIN</div>
            <h2 class="section-title">왜 이 자리에서 <em>시작했는가.</em></h2>
          </div>

          <div data-reveal data-reveal-delay="1" style="font-size:1.15rem; line-height:2; color:var(--ink-700);">
            <p style="margin-bottom:28px;">
              인천 인근 부천에서 고등학교를 나온 저에게 <strong>부평은 학창시절 가장 번화했던 거리</strong>였습니다.
              중심지에서, 교통의 요지에서, 제대로 큰 치과를 해보고 싶다는 마음. 그것이 14년 전의 시작이었습니다.
            </p>
            <p style="margin-bottom:28px;">
              부평역 지하상가 26번 출구 바로 앞.
              인천 도심의 거점에서 많은 분들이 찾아올 수 있는 자리에서,
              저는 <strong>"새로운 도전"</strong>의 마음으로 부평우리치과를 열었습니다.
            </p>
            <p>
              14년. 같은 자리에서. 같은 마음으로.
            </p>
          </div>
        </div>
      </section>

      {/* Mission 2 - 되고 싶은 병원 */}
      <section class="section section-dark">
        <div class="container">
          <div class="section-head" data-reveal>
            <div class="section-eyebrow">CHAPTER 02 · VISION</div>
            <h2 class="section-title">
              어떤 병원이<br />
              <em>되고 싶은가.</em>
            </h2>
          </div>

          <div style="display:grid; gap:40px; grid-template-columns:1fr; max-width:900px;" data-reveal data-reveal-delay="1">
            <div style="padding:40px; border-radius:var(--radius-lg); background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);">
              <div style="font-family:var(--font-display); font-size:3rem; color:var(--brand-300); opacity:0.4; font-weight:300; line-height:1;">01</div>
              <h3 style="margin-top:20px; font-family:var(--font-display); font-weight:400; font-size:1.8rem;">
                믿고 문의하고, 믿고 찾을 수 있는 병원
              </h3>
              <p style="margin-top:16px; font-size:1.05rem; line-height:1.9; color:rgba(255,255,255,0.75);">
                근처 물량공세 치과에서 문제가 생긴 환자분들이 <strong style="color:#fff;">알음알음</strong> 저희를 찾아오실 때,
                "여기를 몰라서 그동안 고생했다"는 말씀을 들을 때마다 깊이 생각했습니다.
                <br/><br/>
                <strong style="color:var(--brand-200);">더 이상 알음알음이 아니어야 한다.</strong>
                검색했을 때 충분한 정보를 드릴 수 있는 치과가 되어야 한다.
                그래서 더 많은 지역 주민분들이 양질의 진료를 향유하실 수 있어야 한다.
              </p>
            </div>

            <div style="padding:40px; border-radius:var(--radius-lg); background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);">
              <div style="font-family:var(--font-display); font-size:3rem; color:var(--brand-300); opacity:0.4; font-weight:300; line-height:1;">02</div>
              <h3 style="margin-top:20px; font-family:var(--font-display); font-weight:400; font-size:1.8rem;">
                변하지 않는 퀄리티의 병원
              </h3>
              <p style="margin-top:16px; font-size:1.05rem; line-height:1.9; color:rgba(255,255,255,0.75);">
                같은 환자가 내일 오시든 5년 뒤 오시든,
                <strong style="color:#fff;">늘 같은 퀄리티와 같은 무드</strong>로 진료를 받으실 수 있어야 합니다.
                <br/><br/>
                이것이 14년간 저희가 지켜온, 그리고 앞으로도 지켜갈 약속입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values - 환자를 대할 때 */}
      <section class="section">
        <div class="container">
          <div class="section-head" data-reveal>
            <div class="section-eyebrow">CHAPTER 03 · VALUES</div>
            <h2 class="section-title">
              환자를 대할 때,<br />
              <em>우리가 지키는 것.</em>
            </h2>
          </div>

          <div style="display:grid; gap:24px; grid-template-columns:1fr; max-width:900px;">
            {[
              {
                title: '정직',
                en: 'Honesty',
                desc: '필요하지 않은 진료는 권하지 않습니다. 환자의 경제적·신체적 여건을 고려하여 최적의 답을 제안합니다.',
              },
              {
                title: '항상성',
                en: 'Consistency',
                desc: '오늘 오시든, 5년 뒤 오시든. 같은 환자에게 같은 퀄리티·같은 무드의 진료를.',
              },
              {
                title: '최선',
                en: 'Dedication',
                desc: '받을 수 있는 최고의 진료. 타협 없이.',
              },
            ].map((v, i) => (
              <div data-reveal data-reveal-delay={String(i + 1)}
                style="padding:32px 36px; border-radius:var(--radius-lg); background:white; border:1px solid var(--ink-100); display:grid; grid-template-columns:auto 1fr; gap:32px; align-items:center;">
                <div style="text-align:center;">
                  <div style="font-family:inherit; font-size:0.85rem; color:var(--brand-600); letter-spacing:0.1em;">{v.en}</div>
                  <div style="font-family:var(--font-display); font-weight:400; font-size:2.2rem; margin-top:4px; color:var(--ink-900);">{v.title}</div>
                </div>
                <p style="color:var(--ink-600); line-height:1.8; font-size:1.02rem;">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature */}
      <section class="section section-soft" style="padding-top:40px;">
        <div class="container" style="max-width:720px; text-align:center;">
          <div data-reveal style="padding:64px 40px; border-top:1px solid var(--ink-200); border-bottom:1px solid var(--ink-200);">
            <div style="font-family:inherit; font-size:1.8rem; color:var(--ink-700); line-height:1.5;">
              “높은 퀄리티의 진료 경험을,<br />
              변하지 않고, 항상성 있게.”
            </div>
            <div style="margin-top:32px;">
              <div style="font-family:var(--font-display); font-size:1.6rem; color:var(--ink-900);">Jaein Kim, DDS, Ph.D.</div>
              <div style="margin-top:6px; font-size:0.9rem; color:var(--ink-500); letter-spacing:0.05em;">대표원장 · 고려대 구강외과 의학박사</div>
            </div>
          </div>

          <div style="margin-top:40px;" data-reveal data-reveal-delay="1">
            <a href="/doctors/kim-jaein" class="btn btn-dark">
              대표원장 소개 <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}
