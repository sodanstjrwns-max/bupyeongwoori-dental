import { Layout } from '../components/Layout'
import { CLINIC, CORE_TREATMENTS, EQUIPMENTS, OG_IMAGES, hoursSummary } from '../lib/constants'
import { DOCTORS, doctorPhotoSrc } from '../data/doctors'
import { breadcrumbSchema, dentistSchema, faqSchema, websiteSchema } from '../lib/schema'
import { CORE_LIST } from '../data/treatments'
import { BUPYEONG_CORE, CoreCardGrid, coreItemListLd } from '../lib/bupyeong-core'

// 홈 FAQ — 핵심 진료(임플란트·심미보철·교정) 대표 질문 2개씩.
// 화면(아래 #home-faq)과 FAQPage 스키마가 같은 배열을 쓰므로 문항이 항상 1:1 일치한다.
const HOME_FAQS = CORE_LIST.flatMap((t) => t.faqs.slice(0, 2).map((f) => ({ q: f.q, a: f.a, slug: t.slug, name: t.name })))

export const HomePage = () => {
  return (
    <Layout
      heroDark
      immersive
      title=""
      canonical={`https://${CLINIC.domain}/`}
      ogImage={OG_IMAGES.home}
      jsonLd={[
        dentistSchema(),
        websiteSchema(),
        // 홈 BreadcrumbList — 사이트 계층 루트 명시 (AEO)
        breadcrumbSchema([{ name: '홈', url: '/' }]),
        // 홈 FAQPage — 핵심 진료(임플란트·심미보철·교정) 대표 질문 발췌 (AEO)
        faqSchema(HOME_FAQS.map((f) => ({ q: f.q, a: f.a }))),
        // 음성검색 AEO — 시리/구글어시스턴트가 읽을 핵심 영역 지정
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `https://${CLINIC.domain}/#homepage`,
          url: `https://${CLINIC.domain}/`,
          name: `부평 치과 | ${CLINIC.name} — 부평역 26번 출구 임플란트·교정·심미보철`,
          isPartOf: { '@id': `https://${CLINIC.domain}/#website` },
          about: { '@id': `https://${CLINIC.domain}/#clinic` },
          speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#hero-title', '.hero-sub'] },
          hasPart: { '@id': `https://${CLINIC.domain}/#bupyeong-core` },
        },
        // 홈 "부평 진료별 안내" 사진 카드 6개와 1:1 (같은 순서·이름·URL·사진)
        coreItemListLd(BUPYEONG_CORE, `https://${CLINIC.domain}/`, '부평 치과 진료별 안내'),
      ]}
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
            {/* SEO-friendly H1: 검색 키워드(부평우리치과·임플란트·교정·심미보철) 명시 + 시각적 슬로건은 강조어 처리 */}
            <h1 id="hero-title" class="hero-title">
              <span class="sr-only">부평 치과, 부평우리치과 — 부평역 26번 출구 앞 임플란트·치아교정·심미보철 진료. </span>
              <span class="hero-title-row"><span>변하지 않는 <em class="mint-1">진료</em>,</span></span>
              <span class="hero-title-row"><span>변하지 않는 <em class="mint-2">신뢰</em>,</span></span>
              <span class="hero-title-row"><span>변하지 않는 <em class="mint-3">우리</em>.</span></span>
            </h1>

            <p class="hero-sub">
              제대로 된 치료를 받고 싶을 때 믿고 찾을 수 있는 부평 치과입니다.
              통합치의학과 전문의 대표원장과 의료진이 <strong style="color:#fff;">14년 한 자리</strong>에서
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
                <div class="num"><span data-count={String(DOCTORS.length)}>{DOCTORS.length}</span><span style="font-size:.5em; font-weight:700; color:rgba(255,255,255,.5); margin-left:4px;">인</span></div>
                <div class="label">의료진 협진</div>
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
              통합치의학과 전문의
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
              { n: '전문의', t: '통합치의학과 대표원장', accent: true },
              { n: 'Straumann', t: '·Osstem·Neo 자문의', accent: false },
              { n: 'Invisalign', t: '우수 인증의', accent: true },
              { n: '26', t: 'Exit · 부평역 1번지', accent: false },
              { n: '160', t: 'Handpieces · 1인 1핸드피스 감염관리', accent: true },
              { n: '14', t: 'Years · 한 자리에서', accent: false },
              { n: '전문의', t: '통합치의학과 대표원장', accent: true },
              { n: 'Straumann', t: '·Osstem·Neo 자문의', accent: false },
              { n: 'Invisalign', t: '우수 인증의', accent: true },
              { n: '26', t: 'Exit · 부평역 1번지', accent: false },
              { n: '160', t: 'Handpieces · 1인 1핸드피스 감염관리', accent: true },
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
                <span class="sr-only">부평우리치과의 진료 철학 — </span>
                <span class="ph-line">정직하게 진단하고,</span><br />
                <span class="ph-line">최선을 다해 <em class="ph-mint-1">진료</em>하며,</span><br />
                <span class="ph-line">14년째 같은 자리에서 <em class="ph-mint-2">신뢰</em>를 쌓고,</span><br />
                <span class="ph-line">변하지 않는 <em class="ph-mint-3">우리</em>가 되는 것.</span>
              </h2>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; max-width:900px;" data-reveal data-reveal-delay="2">
                <p style="font-size:var(--t-lead); color:var(--ink-600); line-height:1.7;">
                  진료의 퀄리티는 의사의 컨디션이나 병원 분위기에 따라 달라져서는 안 됩니다.
                  내일 오시든 5년 뒤 오시든 <strong style="color:var(--ink-900);">같은 퀄리티·같은 무드</strong>로 진료받으실 수 있게 하겠습니다.
                </p>
                <p style="font-size:var(--t-lead); color:var(--ink-600); line-height:1.7;">
                  환자분의 경제적·신체적 여건을 고려해 <strong style="color:var(--ink-900);">정직하게 맞는 답</strong>을 제안합니다.
                  14년 동안 한 자리에서 지켜온 변하지 않는 약속입니다.
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

      {/* =============== 14년 임플란트 · 감염관리 강조 (2026-10-31 원장 요청) =============== */}
      <section class="section section-soft" aria-labelledby="trust-title" style="padding-bottom:clamp(40px,5vw,72px);">
        <div class="container">
          <div class="section-eyebrow" data-reveal>Since {CLINIC.since} · Implant & Infection Control</div>
          <h2 id="trust-title" data-reveal data-reveal-delay="1" style="font-size:var(--h-2); margin-top:20px; max-width:900px;">
            14년 임플란트 진료,<br /><em>보이지 않는 곳까지 깨끗하게.</em>
          </h2>
          <div class="trust-pillars" data-reveal data-reveal-delay="2">
            <div class="trust-pillar">
              <img src="/media/clinic/treatment-scene.jpg" alt="부평우리치과 임플란트 진료 — 모니터로 CBCT 영상을 함께 보며 설명" loading="lazy" decoding="async" />
              <div class="tp-body">
                <span class="tp-kicker">Implant · {new Date().getFullYear() - CLINIC.since}년 한 자리</span>
                <h3><span class="nw">{CLINIC.since}년부터</span> <span class="nw">같은 자리에서</span> <span class="nw">이어 온 임플란트</span></h3>
                <p>부평역 26번 출구 앞 같은 자리에서 임플란트를 진료해 왔습니다. CBCT 3D로 뼈와 신경을 확인해 수술 계획을 세우고, 수술 뒤 관리까지 같은 병원에서 이어갑니다.</p>
                <ul>
                  <li>통합치의학과 전문의 대표원장</li>
                  <li>스트라우만·오스템·네오 자문의</li>
                  <li>CBCT 2대</li>
                </ul>
              </div>
            </div>
            <div class="trust-pillar">
              <img src="/media/clinic/operatory-hall.jpg" alt="부평우리치과 진료실 — 부스마다 분리된 진료 공간" loading="lazy" decoding="async" />
              <div class="tp-body">
                <span class="tp-kicker">Infection Control · 감염관리</span>
                <h3><span class="nw">환자분마다</span> <span class="nw">멸균된 핸드피스를 씁니다</span></h3>
                <p>KaVo 핸드피스 160개를 갖춰 1인 1핸드피스 원칙을 지킵니다. 진료 부스를 나누고, 사용한 기구는 멸균 과정을 거쳐 다시 씁니다. <a href="/videos" style="color:#7fe0d6; border-bottom:1px solid rgba(127,224,214,.5);">감염관리 영상 보기</a></p>
                <ul>
                  <li>1인 1핸드피스</li>
                  <li>핸드피스 160개</li>
                  <li>분리된 진료 부스</li>
                  <li>대표원장 대한치과감염학회 재무이사</li>
                </ul>
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
                부평우리치과 핵심 진료<br /><em>임플란트·치아교정·심미보철</em>
              </h2>
              <p data-reveal data-reveal-delay="2" style="font-size:var(--t-lead); color:var(--ink-600); max-width:640px; margin-top:24px; line-height:1.6;">
                부평우리치과의 중심은 세 가지 진료입니다.
                14년의 임상 경험과 정밀 장비, 학회 활동으로 쌓은 경험을 바탕으로 진료합니다.
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

          {/* 추가 5개 진료를 H3로 노출 — SEO 키워드 강화 (라미네이트·투명교정·사랑니·일반보철·예방치료) */}
          <div class="extra-treatments" data-reveal style="margin-top: clamp(48px, 6vw, 80px);">
            <div class="section-eyebrow" style="margin-bottom:24px;">그 외 전문 진료</div>
            <div class="extra-treatments-grid">
              <a href="/treatments/laminate" class="extra-treatment-link">
                <h3>라미네이트</h3>
                <p>치아를 적게 다듬고 자연스럽게 마무리하는 앞니 라미네이트입니다.</p>
              </a>
              <a href="/treatments/clear-aligner" class="extra-treatment-link">
                <h3>투명교정</h3>
                <p>Invisalign 우수 인증의가 진행하는 눈에 덜 띄는 교정입니다.</p>
              </a>
              <a href="/treatments/wisdom-tooth" class="extra-treatment-link">
                <h3>사랑니발치</h3>
                <p>CBCT로 신경 위치를 확인한 뒤 매복 사랑니를 발치합니다.</p>
              </a>
              <a href="/treatments/general-prosthesis" class="extra-treatment-link">
                <h3>일반보철</h3>
                <p>오래 쓰도록 만드는 크라운·브릿지·인레이입니다.</p>
              </a>
              <a href="/treatments/prevention" class="extra-treatment-link">
                <h3>예방치료</h3>
                <p>스케일링·불소도포·정기 검진으로 치아를 꾸준히 관리합니다.</p>
              </a>
            </div>
          </div>

          <div style="margin-top:64px; text-align:center;" data-reveal>
            <a href="/treatments" class="btn btn-outline btn-lg">
              전체 진료 과목 8개 보기
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* =============== 부평 진료별 안내 — 사진 카드 6개 (2026-10-14) =============== */}
      <section class="section section-white" aria-labelledby="bpc-home-title">
        <div class="container">
          <div class="section-split" style="margin-bottom: clamp(32px, 4vw, 56px);">
            <div class="section-label">
              <span class="chapter">03</span>
              Bupyeong Guide
            </div>
            <div>
              <div class="section-eyebrow">부평역 26번 출구 앞</div>
              <h2 id="bpc-home-title" style="font-size:var(--h-3); margin-top:20px; max-width:900px; word-break:keep-all;">
                부평 치과, <em>진료별로 먼저 확인하실 것.</em>
              </h2>
              <p style="font-size:var(--t-lead); color:var(--ink-600); max-width:640px; margin-top:20px; line-height:1.6;">
                진료마다 내원 횟수와 선택 기준이 다릅니다. 부평역 근처에서 다니실 분들을 위해 진료별로 정리했습니다.
              </p>
            </div>
          </div>
          <CoreCardGrid cards={BUPYEONG_CORE} idPrefix="home-core" />
        </div>
      </section>

      {/* =============== CREDENTIALS (Credentials strip) =============== */}
      <section class="section section-white" style="padding: clamp(60px, 8vw, 120px) 0;">
        <div class="container">
          <div class="section-eyebrow" style="margin-bottom:32px; display:flex; justify-content:center;" data-reveal>
            Credentials · 자격·인증
          </div>
          <h2 data-reveal data-reveal-delay="1" style="text-align:center; max-width:900px; margin:0 auto 64px;">
            <span class="sr-only">부평우리치과 자격·인증 — </span>
            말보다 <em>증명</em>으로.
          </h2>

          <div class="creds-grid" data-reveal data-reveal-delay="2">
            {[
              { k: 'Specialist', t: '통합치의학과 전문의', s: '보건복지부 인증 치과전문의' },
              { k: 'Straumann', t: '스트라우만 임플란트 자문의', s: '스위스 스트라우만 공식 자문' },
              { k: 'Osstem', t: '오스템 임플란트 임상자문위원', s: '오스템임플란트 공식 자문' },
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
              <span class="chapter">04</span>
              Our Doctors
            </div>
            <div>
              <h2 data-reveal data-reveal-delay="1" style="max-width:900px;">
                <span class="sr-only">부평우리치과 의료진 소개 — </span>
                전문 분야는 다르지만,<br />
                <em>원칙은 하나</em>입니다.
              </h2>
              <p data-reveal data-reveal-delay="2" style="font-size:var(--t-lead); color:rgba(255,255,255,.7); max-width:640px; margin-top:24px; line-height:1.6;">
                "환자에게 정직한 최선을 다한다." 모든 의료진이 함께 지키는 약속입니다. 대표원장뿐 아니라 각 분야 원장 누구에게나 편하게 상담받으실 수 있습니다.
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
              <span class="chapter">05</span>
              Equipment
            </div>
            <div>
              <h2 data-reveal data-reveal-delay="1" style="max-width:900px;">
                <span class="sr-only">부평우리치과 진료 장비 — CBCT·ZEISS 미세현미경·KaVo 핸드피스 — </span>
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
              <span class="chapter">06</span>
              Our Space
            </div>
            <div>
              <div class="section-eyebrow" data-reveal>400평 프리미엄 공간</div>
              <h2 data-reveal data-reveal-delay="1" style="font-size:var(--h-2); margin-top:20px; max-width:900px;">
                <span class="sr-only">400평 프리미엄 공간 — </span>
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

      {/* =============== FAQ (FAQPage 스키마와 동일 문항) =============== */}
      <section id="home-faq" class="section section-soft" aria-labelledby="home-faq-title">
        <div class="container" style="max-width:900px;">
          <div class="section-head" data-reveal>
            <div class="section-eyebrow" style="padding-left:0;">FAQ · 자주 묻는 질문</div>
            <h2 id="home-faq-title" class="section-title">핵심 진료, <em>먼저 묻는 질문.</em></h2>
          </div>
          <div class="faq-list">
            {HOME_FAQS.map((f, i) => (
              <details class="faq-item" name="home-faq">
                <summary>
                  <span class="faq-q-num">Q{i + 1}.</span>
                  <span class="faq-q-text">{f.q}</span>
                  <span class="faq-q-icon"><i class="fas fa-chevron-down"></i></span>
                </summary>
                <div class="faq-a">{f.a}</div>
              </details>
            ))}
          </div>
          <div style="margin-top:24px;">
            <a href="/faq" class="btn" style="background:white; border:1px solid var(--ink-200); color:var(--ink-900);">전체 FAQ 보기 →</a>
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
              <span class="sr-only">부평우리치과 상담·예약 안내 — </span>
              <span class="cta-line">이번엔, <em class="cta-mint-1">제대로</em> 받아보세요.</span><br/>
              <span class="cta-line"><em class="cta-mint-2">14년</em> 한 자리에서,</span><br/>
              <span class="cta-line">변하지 않는 <em class="cta-mint-3">우리</em>가 답합니다.</span>
            </h2>
            <p>
              진료 가능 여부와 예상 치료 플랜을 <strong style="color:#fff;">정직하게</strong> 안내드립니다.
              <a href="/areas/bupyeong-gu" style="color:#fff; border-bottom:1px solid rgba(255,255,255,.5);">부평 치과</a> 부평우리치과 · 부평역 26번 출구 · {hoursSummary()}.
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
