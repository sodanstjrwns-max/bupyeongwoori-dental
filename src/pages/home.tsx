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
      {/* =============== HERO =============== */}
      <section class="hero" aria-labelledby="hero-title">
        <div class="container hero-content">
          <div class="hero-eyebrow" data-reveal>
            <span class="dot" aria-hidden="true"></span>
            <span>Since {CLINIC.since} · 부평역 26번 출구 · 프리미엄 덴탈 케어</span>
          </div>

          <h1 id="hero-title" data-reveal data-reveal-delay="1">
            같은 퀄리티<br />
            같은 무드 <em>,</em><br />
            <em>변하지 않는 진료.</em>
          </h1>

          <p class="hero-sub" data-reveal data-reveal-delay="2">
            제대로 된 치료를 받고 싶을 때, 믿고 찾을 수 있는 치과.
            고려대 구강외과 의학박사 · 세계 3대 임플란트 자문의가 14년 한 자리에서
            정직하게 진료합니다.
          </p>

          <div class="hero-cta" data-reveal data-reveal-delay="3">
            <a href="/mission" class="btn btn-primary">
              병원 미션 보기 <i class="fas fa-arrow-right"></i>
            </a>
            <a href={`tel:${CLINIC.phone}`} class="btn btn-ghost">
              <i class="fas fa-phone"></i> {CLINIC.phone}
            </a>
          </div>

          <div class="hero-stats">
            <div class="stat" data-reveal data-reveal-delay="1">
              <div class="num"><span data-count="14">14</span></div>
              <div class="label">Years · 한 자리에서</div>
            </div>
            <div class="stat" data-reveal data-reveal-delay="2">
              <div class="num"><span data-count="6">6</span></div>
              <div class="label">Doctors · 의료진</div>
            </div>
            <div class="stat" data-reveal data-reveal-delay="3">
              <div class="num"><span data-count="160">160</span></div>
              <div class="label">Handpieces · 1인 1핸드피스</div>
            </div>
            <div class="stat" data-reveal data-reveal-delay="4">
              <div class="num"><span data-count="2">2</span></div>
              <div class="label">CBCT · 정밀 3D 진단</div>
            </div>
          </div>
        </div>

        <div class="hero-scroll" aria-hidden="true">
          <span>SCROLL</span>
        </div>
      </section>

      {/* =============== PHILOSOPHY =============== */}
      <section class="section section-soft">
        <div class="container">
          <div class="philosophy">
            <div class="philosophy-text">
              <div class="section-eyebrow" data-reveal>OUR PHILOSOPHY</div>
              <h2 data-reveal data-reveal-delay="1">
                <span class="quote-mark" style="display:block;">“</span>
                정직하게 최선을 다하여,<br />
                받을 수 있는 최고의 진료를 <em style="font-style:italic; color:var(--brand-600);">변하지 않고</em> 제공하는 것.
              </h2>
              <p data-reveal data-reveal-delay="2">
                진료의 퀄리티는 의사의 컨디션이나 병원의 분위기에 좌우되어서는 안 됩니다.
                같은 환자가 내일 오시든 5년 뒤 오시든, 늘 <strong>같은 퀄리티·같은 무드</strong>로 진료를
                받으실 수 있어야 한다고 믿습니다.
              </p>
              <p data-reveal data-reveal-delay="3">
                환자가 처한 경제적·신체적 여건을 고려하여 <strong>최적의 답</strong>을 제안하는 것,
                그것이 14년 동안 저희가 지켜온 진료의 기본입니다.
              </p>
              <div style="margin-top:36px; display:flex; gap:16px; flex-wrap:wrap;" data-reveal data-reveal-delay="4">
                <a href="/mission" class="btn btn-dark">
                  병원 미션 전체 보기 <i class="fas fa-arrow-right"></i>
                </a>
                <a href="/doctors" class="btn" style="background:white; border:1px solid var(--ink-200); color:var(--ink-900);">
                  의료진 소개
                </a>
              </div>
            </div>

            <div class="philosophy-visual" data-reveal data-reveal-delay="2" aria-hidden="true">
              <div class="signature">
                <div class="name">Jaein Kim, DDS, Ph.D.</div>
                <div class="role">대표원장 · 고려대 구강외과 의학박사</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============== CORE TREATMENTS =============== */}
      <section class="section">
        <div class="container">
          <div class="section-head" data-reveal>
            <div class="section-eyebrow">CORE TREATMENTS</div>
            <h2 class="section-title">
              우리가 가장 <em>잘하는</em> 진료.
            </h2>
            <p class="section-lead">
              부평우리치과의 정체성은 세 가지 진료에 있습니다.
              깊이 있는 임상 경험과 최첨단 장비, 그리고 세계적인 학회의 인정이 뒷받침하는
              확실한 선택지.
            </p>
          </div>

          <div class="treatments-grid">
            {CORE_TREATMENTS.map((t, i) => (
              <a href={`/treatments/${t.slug}`} class="treatment-card" data-reveal data-reveal-delay={String(i + 1)}>
                <div class="num">0{i + 1}</div>
                <div class="name-en">{t.nameEn}</div>
                <h3>{t.name}</h3>
                <p class="tagline">{t.tagline}</p>
                <p class="desc">{t.description}</p>
                <span class="arrow">
                  자세히 보기 <i class="fas fa-arrow-right"></i>
                </span>
              </a>
            ))}
          </div>

          <div style="margin-top:48px; text-align:center;" data-reveal>
            <a href="/treatments" class="btn btn-ghost" style="color:var(--ink-700); border-color:var(--ink-200); background:white;">
              전체 진료 과목 보기 ({CORE_TREATMENTS.length + 5}개) <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </section>

      {/* =============== DOCTORS =============== */}
      <section class="section section-dark">
        <div class="container">
          <div class="section-head" data-reveal>
            <div class="section-eyebrow">OUR DOCTORS</div>
            <h2 class="section-title">
              <em>여섯 명</em>의 전문의,<br />
              한 가지 원칙.
            </h2>
            <p class="section-lead">
              전문 분야는 다르지만, "환자에게 정직한 최선"이라는 원칙은 모두 같습니다.
            </p>
          </div>

          <div class="doctors-grid">
            {DOCTORS.map((d, i) => (
              <a href={`/doctors/${d.slug}`} class="doctor-card" data-reveal data-reveal-delay={String(i + 1)}>
                <div class="silhouette" aria-hidden="true">
                  {d.name.slice(-2)}
                </div>
                <div class="meta">
                  <span class="role">{d.title}</span>
                  <div class="name">{d.name}</div>
                  <div class="tagline">{d.tagline}</div>
                </div>
              </a>
            ))}
            {/* 추가 원장님 프로필은 업데이트 예정 슬롯 */}
            {Array.from({ length: Math.max(0, 3 - DOCTORS.length) }).map((_, i) => (
              <div class="doctor-card" data-reveal data-reveal-delay={String(DOCTORS.length + i + 1)} style="opacity:0.55;">
                <div class="silhouette" aria-hidden="true">…</div>
                <div class="meta">
                  <span class="role">Coming Soon</span>
                  <div class="name">원장님 프로필</div>
                  <div class="tagline">곧 업데이트될 예정입니다.</div>
                </div>
              </div>
            ))}
          </div>

          <div style="margin-top:48px; text-align:center;" data-reveal>
            <a href="/doctors" class="btn btn-primary">
              전체 의료진 소개 <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </section>

      {/* =============== EQUIPMENT MARQUEE =============== */}
      <section class="section section-dark" style="padding-top:0;">
        <div class="container">
          <div class="section-head" data-reveal>
            <div class="section-eyebrow">EQUIPMENT</div>
            <h2 class="section-title">장비가 말하는 <em>진료의 깊이.</em></h2>
          </div>
        </div>
        <div class="marquee" aria-hidden="true">
          <div class="marquee-track">
            {[...EQUIPMENTS, ...EQUIPMENTS].map((e) => (
              <div class="marquee-item">
                <span class="n">× {e.count}</span>
                <span class="t">{e.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============== CTA =============== */}
      <section class="section">
        <div class="container">
          <div class="cta-block" data-reveal>
            <h2>
              치과를 믿어 본 적이 있으신가요?<br />
              <em style="font-style:italic; color:var(--brand-300);">부평우리치과</em>에서 시작하세요.
            </h2>
            <p>
              상담은 언제나 무료입니다. 진료 가능 여부와 예상 치료 플랜을 정직하게 안내드립니다.
            </p>
            <div class="btns">
              <a href={`tel:${CLINIC.phone}`} class="btn btn-primary">
                <i class="fas fa-phone"></i> {CLINIC.phone}
              </a>
              <a href="/visit" class="btn btn-ghost">
                <i class="fas fa-map-marker-alt"></i> 오시는 길
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
