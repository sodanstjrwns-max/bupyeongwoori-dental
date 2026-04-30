import { Layout } from '../components/Layout'
import { CLINIC, OG_IMAGES } from '../lib/constants'
import { breadcrumbSchema } from '../lib/schema'
import { PUBLISHED_INTERIOR_PHOTOS, interiorPhotoSrc } from '../data/interior'

export const MissionPage = () => {
  return (
    <Layout
      heroDark
      title="병원 미션 | 14년, 변하지 않는 진료의 약속"
      description="부평우리치과의 미션과 철학. 같은 퀄리티·같은 무드로 변하지 않는 진료를 제공합니다. 대표원장 김재인의 진료 철학을 확인하세요."
      canonical={`https://${CLINIC.domain}/mission`}
      ogImage={OG_IMAGES.mission}
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

          <h1 class="hero-title" data-reveal data-reveal-delay="1" style="font-size:clamp(2.6rem, 8vw, 7rem);">
            <span class="hero-title-row">변하지 않는 <em class="ph-mint-1">진료</em></span>
            <span class="hero-title-row">변하지 않는 <em class="ph-mint-2">신뢰</em></span>
            <span class="hero-title-row">변하지 않는 <em class="ph-mint-3">우리</em></span>
          </h1>

          <p class="hero-sub" data-reveal data-reveal-delay="2" style="max-width:720px;">
            부평우리치과의 존재 이유는 단 하나입니다. <br/>
            <strong style="color:#fff;">검색했을 때 충분한 정보를 알 수 있는 치과</strong>,
            그래서 알음알음이 아닌 <strong style="color:#fff;">정확한 판단</strong>으로 찾아오실 수 있는 치과가 되는 것.
          </p>
        </div>
      </section>

      {/* Story - 왜 시작했는가 */}
      <section class="section section-soft">
        <div class="container" style="max-width:860px;">
          <div class="section-head" data-reveal style="text-align:center; margin-left:auto; margin-right:auto;">
            <div class="section-eyebrow" style="padding-left:0;">CHAPTER 01 · ORIGIN</div>
            <h2 class="section-title">왜 이 자리에서 <em class="ph-mint-3">시작했는가.</em></h2>
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

      {/* Origin Photos — 14년의 공간 */}
      <section class="section section-white">
        <div class="container">
          <div class="section-head" data-reveal style="text-align:center; margin-left:auto; margin-right:auto;">
            <div class="section-eyebrow" style="padding-left:0;">CHAPTER 01.5 · OUR SPACE</div>
            <h2 class="section-title">14년이 머문 <em class="ph-mint-3">자리.</em></h2>
            <p class="section-lead" style="max-width:680px;">
              부평역 26번 출구 앞 400평 공간. 진료실·상담실·라운지까지 모든 동선을 직접 설계했습니다.
            </p>
          </div>
          <div class="space-grid" data-reveal data-reveal-delay="1">
            <figure class="space-item space-item-lg">
              <img src="/media/clinic/operatory-hall.jpg" alt="부평우리치과 진료실 전경 - 다수의 유닛체어와 의료진" loading="lazy" decoding="async" />
              <figcaption>
                <strong>Treatment Hall · 진료실 전경</strong>
                <span>분리된 부스마다 1인 1핸드피스 감염관리.</span>
              </figcaption>
            </figure>
            <figure class="space-item">
              <img src="/media/clinic/treatment-scene.jpg" alt="부평우리치과 임플란트 진료 현장 - 모니터로 함께 보는 진단" loading="lazy" decoding="async" />
              <figcaption>
                <strong>In Practice · 함께 보는 진단</strong>
                <span>모니터로 같이 짚어가는 설명.</span>
              </figcaption>
            </figure>
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
              <em class="ph-mint-3">되고 싶은가.</em>
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

      {/* Cinematic Video — 변하지 않는 우리 */}
      <section class="cinema-section" aria-label="부평우리치과 홍보 영상">
        <div class="cinema-eyebrow-row" data-reveal>
          <div class="container">
            <div class="section-eyebrow" style="padding-left:0;">CHAPTER 02.5 · IN MOTION</div>
            <h2 class="cinema-heading">
              변하지 않는 우리는, <em class="ph-mint-3">움직임</em>으로 증명됩니다.
            </h2>
          </div>
        </div>
        <div class="cinema-stage" data-reveal data-reveal-delay="1">
          <div class="cinema-frame" data-cinema>
            <video
              class="cinema-video"
              data-cinema-video
              src="/media/videos/clinic-promo.mp4"
              poster="/static/og/og-default.png?v=20260430m"
              preload="metadata"
              playsinline
              muted
              loop
              aria-label="부평우리치과 14년의 모습을 담은 홍보 영상"
            ></video>
            <div class="cinema-overlay" aria-hidden="true"></div>
            <div class="cinema-vignette" aria-hidden="true"></div>
            <div class="cinema-caption">
              <div class="cinema-caption-eyebrow">SINCE 2011 · BUPYEONG</div>
              <div class="cinema-caption-title">14년, 한 자리에서.</div>
            </div>
            <div class="cinema-controls">
              <button type="button" class="cinema-btn" data-cinema-play aria-label="재생/일시정지">
                <i class="fas fa-pause"></i>
              </button>
              <button type="button" class="cinema-btn cinema-btn-mute" data-cinema-mute aria-label="음소거 해제">
                <i class="fas fa-volume-mute"></i>
                <span class="cinema-btn-label">SOUND ON</span>
              </button>
              <button type="button" class="cinema-btn" data-cinema-fullscreen aria-label="전체화면">
                <i class="fas fa-expand"></i>
              </button>
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
              <em class="ph-mint-3">우리가 지키는 것.</em>
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

      {/* Interior Gallery (R2 photos) */}
      {PUBLISHED_INTERIOR_PHOTOS.length > 0 && (
        <section class="section">
          <div class="container">
            <div class="section-head" data-reveal style="text-align:center; margin-left:auto; margin-right:auto;">
              <div class="section-eyebrow" style="padding-left:0;">SPACE · 공간</div>
              <h2 class="section-title">진료의 깊이는 <em class="ph-mint-3">공간</em>에서 시작합니다.</h2>
              <p style="margin-top:24px; font-size:1.05rem; color:var(--ink-500); line-height:1.7;">
                400평 · 6개 독립 수술실 · 에어샤워 감염관리 시스템.
              </p>
            </div>
            <div class="interior-gallery" data-reveal data-reveal-delay="1">
              {PUBLISHED_INTERIOR_PHOTOS.map((p) => {
                const src = interiorPhotoSrc(p.src)
                if (!src) return null
                return (
                  <div class={`tile ${p.size}`}>
                    <img src={src} alt={p.alt} loading="lazy" />
                    <div class="caption">{p.caption}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

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

      {/* CTA — 미션 페이지 클로징 */}
      <section class="section section-white">
        <div class="container">
          <div class="cta-block" data-reveal="scale">
            <div class="section-eyebrow" style="color:rgba(255,255,255,.7); margin-bottom:24px;">
              Mission · 14년의 약속을 지금 경험하세요
            </div>
            <h2 class="cta-h2">
              <span class="cta-line">이번엔, <em class="cta-mint-1">제대로</em> 받아보세요.</span><br/>
              <span class="cta-line"><em class="cta-mint-2">14년</em> 한 자리에서,</span><br/>
              <span class="cta-line">변하지 않는 <em class="cta-mint-3">우리</em>가 답합니다.</span>
            </h2>
            <p>
              상담은 언제나 무료입니다. 진료 가능 여부와 예상 치료 플랜을 <strong style="color:#fff;">정직하게</strong> 안내드립니다.
            </p>
            <div class="btns">
              <a href={CLINIC.socialLinks.naverBooking} target="_blank" rel="noopener" class="btn btn-primary btn-lg" data-magnetic style="background:#03C75A; border-color:#03C75A;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z"/></svg>
                네이버 예약
              </a>
              <a href={CLINIC.socialLinks.kakao} target="_blank" rel="noopener" class="btn btn-lg" style="background:#FEE500; color:#3A1D1D; border:none;">
                <i class="fas fa-comment"></i> 카카오톡 상담
              </a>
              <a href={`tel:${CLINIC.phone}`} class="btn btn-ghost btn-lg">
                <i class="fas fa-phone"></i> {CLINIC.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
