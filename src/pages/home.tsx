import { Layout } from '../components/Layout'
import { CLINIC, CORE_TREATMENTS, EQUIPMENTS, OG_IMAGES } from '../lib/constants'
import { DOCTORS, doctorPhotoSrc } from '../data/doctors'
import { dentistSchema, websiteSchema } from '../lib/schema'

export const HomePage = () => {
  return (
    <Layout
      heroDark
      title=""
      canonical={`https://${CLINIC.domain}/`}
      ogImage={OG_IMAGES.home}
      jsonLd={[dentistSchema(), websiteSchema()]}
    >
      {/* =============== HERO (Editorial Cinematic) =============== */}
      <section class="hero" aria-labelledby="hero-title">
        <div class="container hero-content">
          {/* Top meta bar */}
          <div class="hero-top">
            <div>
              <span class="dot" aria-hidden="true"></span>
              <span>Since {CLINIC.since} · 부평역 1번지</span>
            </div>
            <div class="hero-meta-right">
              <span>부평우리치과</span>
            </div>
          </div>

          {/* Main title (line-by-line rise) */}
          <div>
            <h1 id="hero-title" class="hero-title">
              <span class="hero-title-row"><span>변하지 않는 <em class="mint-1">진료</em>,</span></span>
              <span class="hero-title-row"><span>변하지 않는 <em class="mint-2">신뢰</em>,</span></span>
              <span class="hero-title-row"><span>변하지 않는 <em class="mint-3">우리</em>.</span></span>
            </h1>

            <p class="hero-sub">
              제대로 된 치료를 받고 싶을 때, 믿고 찾을 수 있는 치과.
              고려대 구강외과 의학박사 · 세계 3대 임플란트 자문의가 <strong style="color:#fff;">14년 한 자리</strong>에서
              정직하게 진료합니다.
            </p>

            <div class="hero-cta">
              <a href={CLINIC.socialLinks.naverBooking} target="_blank" rel="noopener" class="btn btn-primary btn-lg" data-magnetic style="background:#03C75A; border-color:#03C75A;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z"/></svg>
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

          {/* Bottom: stats + signature */}
          <div class="hero-bottom">
            <div class="hero-stats">
              <div class="stat">
                <div class="num"><span data-count="14">14</span><span style="font-size:.5em; font-weight:700; color:rgba(255,255,255,.5); margin-left:4px;">년</span></div>
                <div class="label">한 자리 진료</div>
              </div>
              <div class="stat">
                <div class="num"><span data-count="6">6</span><span style="font-size:.5em; font-weight:700; color:rgba(255,255,255,.5); margin-left:4px;">인</span></div>
                <div class="label">전문의 협진</div>
              </div>
              <div class="stat">
                <div class="num"><span data-count="160">160</span></div>
                <div class="label">1인 1핸드피스</div>
              </div>
              <div class="stat">
                <div class="num"><span data-count="2">2</span></div>
                <div class="label">CBCT · 3D 진단</div>
              </div>
            </div>
            <div class="hero-signature">
              <strong>김재인 대표원장</strong>
              고려대 구강외과 의학박사
            </div>
          </div>
        </div>

        <div class="hero-scroll" aria-hidden="true"></div>
      </section>

      {/* =============== MARQUEE — Trust statements =============== */}
      <section class="section-dark" style="padding:0; background:var(--ink-900);">
        <div class="marquee" style="margin:0;">
          <div class="marquee-track">
            {[
              { n: '14', t: 'Years · 한 자리에서', accent: false },
              { n: 'Ph.D.', t: '고려대 구강외과 의학박사', accent: true },
              { n: 'Straumann', t: '·Osstem·Neo 자문의', accent: false },
              { n: 'Invisalign', t: '우수 인증의', accent: true },
              { n: '26', t: 'Exit · 부평역 1번지', accent: false },
              { n: '400', t: 'Pyeong · 프리미엄 공간', accent: true },
              { n: '14', t: 'Years · 한 자리에서', accent: false },
              { n: 'Ph.D.', t: '고려대 구강외과 의학박사', accent: true },
              { n: 'Straumann', t: '·Osstem·Neo 자문의', accent: false },
              { n: 'Invisalign', t: '우수 인증의', accent: true },
              { n: '26', t: 'Exit · 부평역 1번지', accent: false },
              { n: '400', t: 'Pyeong · 프리미엄 공간', accent: true },
            ].map((m) => (
              <div class={`marquee-item ${m.accent ? 'accent' : ''}`}>
                <span class="n">{m.n}</span>
                <span class="t">{m.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============== PHILOSOPHY (Chapter 01) =============== */}
      <section class="section section-white">
        <div class="container">
          <div class="section-split">
            <div class="section-label">
              <span class="chapter">01</span>
              Our Philosophy
            </div>
            <div>
              <h2 data-reveal class="philosophy-h2" style="margin-bottom:40px; max-width:900px; word-break:keep-all;">
                <span class="ph-line">정직하게 진단하고,</span><br />
                <span class="ph-line">최선을 다해 <em class="ph-mint-1">진료</em>하며,</span><br />
                <span class="ph-line">14년째 같은 자리에서 <em class="ph-mint-2">신뢰</em>를 쌓고,</span><br />
                <span class="ph-line">변하지 않는 <em class="ph-mint-3">우리</em>가 되는 것.</span>
              </h2>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; max-width:900px;" data-reveal data-reveal-delay="2">
                <p style="font-size:var(--t-lead); color:var(--ink-600); line-height:1.7;">
                  진료의 퀄리티는 의사의 컨디션이나 병원의 분위기에 좌우되어서는 안 됩니다.
                  내일 오시든 5년 뒤 오시든, 늘 <strong style="color:var(--ink-900);">같은 퀄리티·같은 무드</strong>로 진료받으실 수 있어야 한다고 믿습니다.
                </p>
                <p style="font-size:var(--t-lead); color:var(--ink-600); line-height:1.7;">
                  환자의 경제적·신체적 여건을 고려해 <strong style="color:var(--ink-900);">정직하게 최적의 답</strong>을 제안하는 것.
                  그것이 14년 동안 한 자리에서 우리가 지켜온 변하지 않는 약속입니다.
                </p>
              </div>
              <div style="margin-top:48px; display:flex; gap:12px; flex-wrap:wrap;" data-reveal data-reveal-delay="3">
                <a href="/mission" class="btn btn-dark" data-magnetic>
                  병원 미션 전체 보기
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </a>
                <a href="/doctors" class="btn btn-outline">의료진 소개</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============== CORE TREATMENTS (Chapter 02) =============== */}
      <section class="section section-soft">
        <div class="container">
          <div class="section-split" style="margin-bottom: clamp(48px, 6vw, 80px);">
            <div class="section-label">
              <span class="chapter">02</span>
              Core Treatments
            </div>
            <div>
              <div class="section-eyebrow" data-reveal>우리가 가장 잘하는 진료</div>
              <h2 data-reveal data-reveal-delay="1" style="font-size:var(--h-2); margin-top:20px; max-width:900px;">
                세 가지 진료에<br />
                <em>14년의 깊이</em>를 담았습니다.
              </h2>
              <p data-reveal data-reveal-delay="2" style="font-size:var(--t-lead); color:var(--ink-600); max-width:640px; margin-top:24px; line-height:1.6;">
                부평우리치과의 정체성은 세 가지 진료에 있습니다.
                깊이 있는 임상과 최첨단 장비, 세계적인 학회의 인정이 뒷받침하는 확실한 선택지.
              </p>
            </div>
          </div>

          <div class="treatments-grid" data-reveal>
            {CORE_TREATMENTS.map((t, i) => (
              <a href={`/treatments/${t.slug}`} class="treatment-card">
                <div class="num">Chapter 0{i + 1}</div>
                <div class="name-en">{t.nameEn}</div>
                <h3>{t.name}</h3>
                <p class="tagline">{t.tagline}</p>
                <p class="desc">{t.description}</p>
                <span class="arrow">
                  자세히 보기
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </span>
              </a>
            ))}
          </div>

          <div style="margin-top:64px; text-align:center;" data-reveal>
            <a href="/treatments" class="btn btn-outline btn-lg">
              전체 진료 과목 8개 보기
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* =============== CREDENTIALS (Credentials strip) =============== */}
      <section class="section section-white" style="padding: clamp(60px, 8vw, 120px) 0;">
        <div class="container">
          <div class="section-eyebrow" style="margin-bottom:32px; display:flex; justify-content:center;" data-reveal>
            Credentials · 자격·인증
          </div>
          <h2 data-reveal data-reveal-delay="1" style="text-align:center; max-width:900px; margin:0 auto 64px;">
            말보다 <em>증명</em>으로.
          </h2>

          <div class="creds-grid" data-reveal data-reveal-delay="2">
            {[
              { k: 'Ph.D.', t: '고려대 구강악안면외과 의학박사', s: '대학원 박사과정 수료' },
              { k: 'Straumann', t: '세계 1위 임플란트 자문의', s: '스위스 스트라우만 공식 자문' },
              { k: 'Osstem', t: '국내 1위 임플란트 자문의', s: '오스템임플란트 공식 자문' },
              { k: 'Neo', t: '프리미엄 임플란트 자문의', s: '네오임플란트 공식 자문' },
              { k: 'Invisalign', t: '인비절라인 우수 인증의', s: 'Align Technology 공인' },
              { k: 'ZEISS', t: 'EXTARO 300 미세현미경', s: '심미보철·근관치료 정밀' },
            ].map((c) => (
              <div class="cred-cell">
                <div class="cred-key">{c.k}</div>
                <div class="cred-title">{c.t}</div>
                <div class="cred-sub">{c.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============== DOCTORS (Chapter 03 — Dark) =============== */}
      <section class="section section-dark">
        <div class="container">
          <div class="section-split" style="margin-bottom: clamp(48px, 6vw, 80px);">
            <div class="section-label">
              <span class="chapter">03</span>
              Our Doctors
            </div>
            <div>
              <h2 data-reveal data-reveal-delay="1" style="max-width:900px;">
                전문 분야는 다르지만,<br />
                <em>원칙은 하나</em>입니다.
              </h2>
              <p data-reveal data-reveal-delay="2" style="font-size:var(--t-lead); color:rgba(255,255,255,.7); max-width:640px; margin-top:24px; line-height:1.6;">
                "환자에게 정직한 최선을 다한다." — 여섯 명 모두가 14년간 함께 지켜온 약속.
              </p>
            </div>
          </div>

          <div class="doctors-grid">
            {DOCTORS.map((d, i) => {
              const src = doctorPhotoSrc(d.photo)
              return (
                <a href={`/doctors/${d.slug}`} class="doctor-card" data-reveal data-reveal-delay={String(i + 1)}>
                  {src ? (
                    <div class="portrait">
                      <img src={src} alt={`${d.name} ${d.title}`} loading="lazy" />
                    </div>
                  ) : (
                    <div class="silhouette" aria-hidden="true">{d.name.slice(-2)}</div>
                  )}
                  <div class="meta">
                    <span class="role">{d.title}</span>
                    <div class="name">{d.name}</div>
                    <div class="tagline">{d.tagline}</div>
                  </div>
                </a>
              )
            })}
            {Array.from({ length: Math.max(0, 3 - DOCTORS.length) }).map((_, i) => (
              <div class="doctor-card" data-reveal data-reveal-delay={String(DOCTORS.length + i + 1)} style="opacity:0.5;">
                <div class="silhouette" aria-hidden="true">…</div>
                <div class="meta">
                  <span class="role">Coming soon</span>
                  <div class="name">원장님 프로필</div>
                  <div class="tagline">곧 업데이트될 예정입니다.</div>
                </div>
              </div>
            ))}
          </div>

          <div style="margin-top:64px; text-align:center;" data-reveal>
            <a href="/doctors" class="btn btn-primary btn-lg" data-magnetic>
              전체 의료진 소개
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* =============== EQUIPMENT (double marquee) =============== */}
      <section class="section-dark" style="padding: clamp(80px, 10vw, 140px) 0; background:var(--ink-900);">
        <div class="container">
          <div class="section-split" style="margin-bottom: clamp(48px, 6vw, 80px);">
            <div class="section-label">
              <span class="chapter">04</span>
              Equipment
            </div>
            <div>
              <h2 data-reveal data-reveal-delay="1" style="max-width:900px;">
                장비가 말하는<br/>
                <em>진료의 깊이.</em>
              </h2>
              <p data-reveal data-reveal-delay="2" style="font-size:var(--t-lead); color:rgba(255,255,255,.7); max-width:640px; margin-top:24px; line-height:1.6;">
                {EQUIPMENTS.map((e) => `${e.name}×${e.count}`).join(' · ')} — 프리미엄 장비와 1인 1핸드피스 감염관리.
              </p>
            </div>
          </div>
        </div>

        <div class="marquee">
          <div class="marquee-track">
            {[...EQUIPMENTS, ...EQUIPMENTS].map((e) => (
              <div class="marquee-item">
                <span class="n">× {e.count}</span>
                <span class="t">{e.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div class="marquee reverse">
          <div class="marquee-track">
            {[...EQUIPMENTS, ...EQUIPMENTS].reverse().map((e) => (
              <div class="marquee-item accent">
                <span class="n">{e.nameEn || e.name}</span>
                <span class="t">— {e.purpose || 'Clinical Excellence'}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============== OUR SPACE — 원내 공간 =============== */}
      <section class="section section-white">
        <div class="container">
          <div class="section-split" style="margin-bottom: clamp(48px, 6vw, 80px);">
            <div class="section-label">
              <span class="chapter">05</span>
              Our Space
            </div>
            <div>
              <div class="section-eyebrow" data-reveal>400평 프리미엄 공간</div>
              <h2 data-reveal data-reveal-delay="1" style="font-size:var(--h-2); margin-top:20px; max-width:900px;">
                머무는 시간까지<br />
                <em>진료의 일부</em>입니다.
              </h2>
              <p data-reveal data-reveal-delay="2" style="font-size:var(--t-lead); color:var(--ink-600); max-width:640px; margin-top:24px; line-height:1.6;">
                대기실의 차 한 잔, 상담실의 조명, 진료부스의 창밖 풍경까지 — 환자분의 긴장이 풀리도록 모든 공간을 직접 설계했습니다.
              </p>
            </div>
          </div>
          <div class="space-grid" data-reveal>
            <figure class="space-item space-item-lg">
              <img src="/media/clinic/lobby-bright.jpg" alt="부평우리치과 로비 — 밝은 조명과 INFORMATION 데스크" loading="lazy" decoding="async" />
              <figcaption>
                <strong>Lobby · 로비</strong>
                <span>화이트 톤 메인 리셉션 — 첫인상이 닿는 곳.</span>
              </figcaption>
            </figure>
            <figure class="space-item">
              <img src="/media/clinic/lobby-lounge.jpg" alt="부평우리치과 라운지형 대기실 — 우드 톤 좌석과 차 공간" loading="lazy" decoding="async" />
              <figcaption>
                <strong>Lounge · 라운지 대기</strong>
                <span>우드 테이블·차 한 잔의 여유.</span>
              </figcaption>
            </figure>
            <figure class="space-item">
              <img src="/media/clinic/info-desk.jpg" alt="부평우리치과 INFORMATION 안내데스크" loading="lazy" decoding="async" />
              <figcaption>
                <strong>Information · 안내</strong>
                <span>접수·수납이 한 자리에서.</span>
              </figcaption>
            </figure>
            <figure class="space-item">
              <img src="/media/clinic/counseling-corridor.jpg" alt="부평우리치과 상담실 복도 — 1·2·3 독립 상담실" loading="lazy" decoding="async" />
              <figcaption>
                <strong>Counseling · 독립 상담실</strong>
                <span>상담실 3실 · 완전 분리된 프라이버시.</span>
              </figcaption>
            </figure>
            <figure class="space-item space-item-lg">
              <img src="/media/clinic/operatory-window.jpg" alt="부평우리치과 창가 개별 진료부스 — 도시 전망" loading="lazy" decoding="async" />
              <figcaption>
                <strong>Operatory · 창가 진료부스</strong>
                <span>개별 부스마다 자연광과 도시 전망.</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* =============== CTA =============== */}
      <section class="section section-white">
        <div class="container">
          <div class="cta-block" data-reveal="scale">
            <div class="section-eyebrow" style="color:rgba(255,255,255,.7); margin-bottom:24px;">
              Contact · 상담은 언제나 무료
            </div>
            <h2 class="cta-h2">
              <span class="cta-line">이번엔, <em class="cta-mint-1">제대로</em> 받아보세요.</span><br/>
              <span class="cta-line"><em class="cta-mint-2">14년</em> 한 자리에서,</span><br/>
              <span class="cta-line">변하지 않는 <em class="cta-mint-3">우리</em>가 답합니다.</span>
            </h2>
            <p>
              진료 가능 여부와 예상 치료 플랜을 <strong style="color:#fff;">정직하게</strong> 안내드립니다.
              부평역 26번 출구 · {CLINIC.hours.mon} · 수요일은 야간 21:00까지.
            </p>
            <div class="btns">
              <a href={CLINIC.socialLinks.naverBooking} target="_blank" rel="noopener" class="btn btn-primary btn-lg" data-magnetic style="background:#03C75A; border-color:#03C75A;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z"/></svg>
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
