import { Layout } from '../components/Layout'
import { CLINIC, CORE_TREATMENTS, EQUIPMENTS } from '../lib/constants'
import { DOCTORS } from '../data/doctors'
import { dentistSchema, websiteSchema } from '../lib/schema'

export const HomePage = () => {
  return (
    <Layout
      heroDark
      title=""
      canonical={`https://${CLINIC.domain}/`}
      jsonLd={[dentistSchema(), websiteSchema()]}
    >
      {/* =============== HERO (Editorial Cinematic) =============== */}
      <section class="hero" aria-labelledby="hero-title">
        <div class="container hero-content">
          {/* Top meta bar */}
          <div class="hero-top">
            <div>
              <span class="dot" aria-hidden="true"></span>
              <span>Since {CLINIC.since} · Bupyeong, Incheon</span>
            </div>
            <div class="hero-meta-right">
              <div>Premium Dental Care</div>
              <div style="margin-top:4px;">N 37.489 · E 126.724</div>
            </div>
          </div>

          {/* Main title (line-by-line rise) */}
          <div>
            <h1 id="hero-title" class="hero-title">
              <span class="hero-title-row"><span>같은 퀄리티,</span></span>
              <span class="hero-title-row"><span>같은 무드<em>,</em></span></span>
              <span class="hero-title-row"><span><em>변하지 않는 진료.</em></span></span>
            </h1>

            <p class="hero-sub">
              제대로 된 치료를 받고 싶을 때, 믿고 찾을 수 있는 치과.
              고려대 구강외과 의학박사 · 세계 3대 임플란트 자문의가 <strong style="color:#fff;">14년 한 자리</strong>에서
              정직하게 진료합니다.
            </p>

            <div class="hero-cta">
              <a href="/mission" class="btn btn-primary btn-lg" data-magnetic>
                병원 미션 보기
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
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
                <div class="num"><span data-count="14">14</span></div>
                <div class="label">Years in place</div>
              </div>
              <div class="stat">
                <div class="num"><span data-count="6">6</span></div>
                <div class="label">Doctors</div>
              </div>
              <div class="stat">
                <div class="num"><span data-count="160">160</span></div>
                <div class="label">Handpieces</div>
              </div>
              <div class="stat">
                <div class="num"><span data-count="2">2</span></div>
                <div class="label">CBCT · 3D 진단</div>
              </div>
            </div>
            <div class="hero-signature">
              <strong>Jaein Kim, DDS, Ph.D.</strong>
              대표원장 서명
            </div>
          </div>
        </div>

        <div class="hero-scroll" aria-hidden="true">
          <span>Scroll</span>
        </div>
      </section>

      {/* =============== MARQUEE — Trust statements =============== */}
      <section class="section-dark" style="padding:0; border-top:1px solid rgba(255,255,255,.08); border-bottom:1px solid rgba(255,255,255,.08); background:var(--ink-900);">
        <div class="marquee" style="border:0; padding:28px 0; margin:0;">
          <div class="marquee-track">
            {[
              { n: '14', t: 'Years · 한 자리에서', accent: false },
              { n: 'Ph.D.', t: '고려대 구강외과 의학박사', accent: true },
              { n: 'Straumann', t: '·Osstem·Neo 자문의', accent: false },
              { n: 'Invisalign', t: '우수 인증의', accent: true },
              { n: '26', t: 'Exit · 부평역 1번지', accent: false },
              { n: '400', t: 'Pyeong · 5·7층 프리미엄', accent: true },
              { n: '14', t: 'Years · 한 자리에서', accent: false },
              { n: 'Ph.D.', t: '고려대 구강외과 의학박사', accent: true },
              { n: 'Straumann', t: '·Osstem·Neo 자문의', accent: false },
              { n: 'Invisalign', t: '우수 인증의', accent: true },
              { n: '26', t: 'Exit · 부평역 1번지', accent: false },
              { n: '400', t: 'Pyeong · 5·7층 프리미엄', accent: true },
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
              <span class="chapter">Ch. 01</span>
              Our Philosophy
            </div>
            <div>
              <span class="quote-mark" style="font-family:'Times New Roman',serif; font-style:italic; font-size:clamp(5rem,8vw,9rem); line-height:.7; color:var(--brand); display:block; margin-bottom:-24px;">“</span>
              <h2 data-reveal style="font-size:var(--h-2); line-height:1.02; margin-bottom:40px; max-width:900px;">
                정직하게 최선을 다하여,<br />
                받을 수 있는 최고의 진료를 <em>변하지 않고</em> 제공하는 것.
              </h2>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; max-width:900px;" data-reveal data-reveal-delay="2">
                <p style="font-size:var(--t-lead); color:var(--ink-600); line-height:1.7;">
                  진료의 퀄리티는 의사의 컨디션이나 병원의 분위기에 좌우되어서는 안 됩니다.
                  같은 환자가 내일 오시든 5년 뒤 오시든, 늘 <strong style="color:var(--ink-900);">같은 퀄리티·같은 무드</strong>로 진료받으실 수 있어야 한다고 믿습니다.
                </p>
                <p style="font-size:var(--t-lead); color:var(--ink-600); line-height:1.7;">
                  환자가 처한 경제적·신체적 여건을 고려하여 <strong style="color:var(--ink-900);">최적의 답</strong>을 제안하는 것.
                  그것이 14년 동안 저희가 지켜온 진료의 기본입니다.
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
              <span class="chapter">Ch. 02</span>
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
          <h2 data-reveal data-reveal-delay="1" style="font-size:var(--h-2); text-align:center; max-width:900px; margin:0 auto 64px; line-height:1.05; font-weight:900; letter-spacing:-0.04em;">
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
              <span class="chapter">Ch. 03</span>
              Our Doctors
            </div>
            <div>
              <div class="section-eyebrow" data-reveal>여섯 명의 전문의</div>
              <h2 data-reveal data-reveal-delay="1" style="font-size:var(--h-2); margin-top:20px; max-width:900px;">
                전문 분야는 다르지만,<br />
                <em>원칙은 하나</em>입니다.
              </h2>
              <p data-reveal data-reveal-delay="2" style="font-size:var(--t-lead); color:rgba(255,255,255,.7); max-width:640px; margin-top:24px; line-height:1.6;">
                "환자에게 정직한 최선을 다한다." — 여섯 명 모두가 14년간 함께 지켜온 약속.
              </p>
            </div>
          </div>

          <div class="doctors-grid">
            {DOCTORS.map((d, i) => (
              <a href={`/doctors/${d.slug}`} class="doctor-card" data-reveal data-reveal-delay={String(i + 1)}>
                <div class="silhouette" aria-hidden="true">{d.name.slice(-2)}</div>
                <div class="meta">
                  <span class="role">{d.title}</span>
                  <div class="name">{d.name}</div>
                  <div class="tagline">{d.tagline}</div>
                </div>
              </a>
            ))}
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
              <span class="chapter">Ch. 04</span>
              Equipment
            </div>
            <div>
              <div class="section-eyebrow" data-reveal>Equipment</div>
              <h2 data-reveal data-reveal-delay="1" style="font-size:var(--h-2); margin-top:20px; max-width:900px;">
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

      {/* =============== CTA =============== */}
      <section class="section section-white">
        <div class="container">
          <div class="cta-block" data-reveal="scale">
            <div class="section-eyebrow" style="color:rgba(255,255,255,.7); margin-bottom:24px;">
              Contact · 상담은 언제나 무료
            </div>
            <h2>
              치과를 <em>믿어 본 적</em>이<br/>
              있으신가요?
            </h2>
            <p>
              진료 가능 여부와 예상 치료 플랜을 정직하게 안내드립니다.
              부평역 26번 출구 · {CLINIC.hours.mon} · 수요일은 야간 21:00까지.
            </p>
            <div class="btns">
              <a href={`tel:${CLINIC.phone}`} class="btn btn-primary btn-lg" data-magnetic>
                <i class="fas fa-phone"></i> {CLINIC.phone}
              </a>
              <a href="/visit" class="btn btn-ghost btn-lg">
                <i class="fas fa-map-marker-alt"></i> 오시는 길
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
