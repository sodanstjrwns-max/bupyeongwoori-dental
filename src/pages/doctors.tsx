import { Layout } from '../components/Layout'
import { CLINIC } from '../lib/constants'
import { DOCTORS, getDoctor } from '../data/doctors'
import { TREATMENT_LIST, getTreatment } from '../data/treatments'
import { breadcrumbSchema, doctorSchema } from '../lib/schema'

// =========================================================
// 전체 의료진 페이지
// =========================================================
export const DoctorsPage = () => {
  return (
    <Layout
      heroDark
      title="의료진 소개 | 6인의 전문의"
      description="부평우리치과 의료진 — 고려대 구강외과 의학박사 김재인 대표원장을 비롯한 6인의 전문의가 함께합니다."
      canonical={`https://${CLINIC.domain}/doctors`}
      jsonLd={breadcrumbSchema([
        { name: '홈', url: '/' },
        { name: '의료진 소개', url: '/doctors' },
      ])}
    >
      {/* Hero */}
      <section class="hero" style="min-height:70vh;">
        <div class="container hero-content">
          <div class="hero-eyebrow" data-reveal>
            <span class="dot"></span>
            <span>OUR DOCTORS · 의료진 소개</span>
          </div>
          <h1 data-reveal data-reveal-delay="1">
            여섯 명의 전문의,<br /><em>한 가지 원칙.</em>
          </h1>
          <p class="hero-sub" data-reveal data-reveal-delay="2">
            전문 분야는 다르지만 "환자에게 정직한 최선"이라는 원칙은 모두 같습니다.
          </p>
        </div>
      </section>

      {/* Doctors grid */}
      <section class="section">
        <div class="container">
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
            {/* Coming soon slots */}
            {Array.from({ length: Math.max(0, 6 - DOCTORS.length) }).map((_, i) => (
              <div class="doctor-card" style="opacity:0.55;" data-reveal data-reveal-delay={String(DOCTORS.length + i + 1)}>
                <div class="silhouette" aria-hidden="true">…</div>
                <div class="meta">
                  <span class="role">Coming Soon</span>
                  <div class="name">원장님 프로필</div>
                  <div class="tagline">곧 업데이트될 예정입니다.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

// =========================================================
// 개별 원장 프로필
// =========================================================
export const DoctorDetailPage = ({ slug }: { slug: string }) => {
  const d = getDoctor(slug)
  if (!d) {
    return (
      <Layout title="의료진을 찾을 수 없습니다" noindex>
        <section class="section" style="padding-top:160px; min-height:70vh;">
          <div class="container" style="text-align:center;">
            <h1>의료진 정보를 찾을 수 없습니다.</h1>
            <a href="/doctors" class="btn btn-dark" style="margin-top:24px;">전체 의료진 보기</a>
          </div>
        </section>
      </Layout>
    )
  }

  // 담당 진료
  const relatedTreatments = d.specialties
    .map((s) => getTreatment(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))

  return (
    <Layout
      heroDark
      title={`${d.title} ${d.name} | 의료진 소개`}
      description={`${d.title} ${d.name} — ${d.tagline}. ${d.education[0] ?? CLINIC.name + ' 의료진'}.`}
      canonical={`https://${CLINIC.domain}/doctors/${d.slug}`}
      jsonLd={[
        doctorSchema({ name: d.name, title: d.title, slug: d.slug, education: d.education }),
        breadcrumbSchema([
          { name: '홈', url: '/' },
          { name: '의료진 소개', url: '/doctors' },
          { name: `${d.title} ${d.name}`, url: `/doctors/${d.slug}` },
        ]),
      ]}
    >
      {/* Hero profile */}
      <section class="hero" style="min-height:80vh;">
        <div class="container hero-content">
          <div style="display:grid; grid-template-columns:1fr; gap:48px; align-items:center;"
            class="doctor-hero-grid">
            <div>
              <div class="hero-eyebrow" data-reveal>
                <span class="dot"></span>
                <span>{d.title.toUpperCase()} · {d.name}</span>
              </div>
              <h1 data-reveal data-reveal-delay="1" style="font-size:clamp(2.4rem, 6vw, 5rem);">
                {d.name}
                <span style="display:block; font-family:var(--font-display); font-style:italic; color:var(--brand-300); font-size:0.5em; font-weight:300; margin-top:12px;">
                  {d.title}
                </span>
              </h1>
              <p class="hero-sub" data-reveal data-reveal-delay="2" style="max-width:580px;">
                {d.tagline}
              </p>
              {d.quote && (
                <div data-reveal data-reveal-delay="3" style="margin-top:32px; padding:24px 28px; border-left:3px solid var(--brand-400); background:rgba(10,186,181,0.06);">
                  <p style="font-family:var(--font-display); font-style:italic; font-size:1.05rem; color:rgba(255,255,255,0.9); line-height:1.6;">{d.quote}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Intro text */}
      {d.intro.length > 0 && d.intro[0] !== '프로필이 곧 업데이트됩니다.' && (
        <section class="section section-soft">
          <div class="container" style="max-width:820px;">
            <div class="section-head" data-reveal>
              <div class="section-eyebrow" style="padding-left:0;">INTRODUCTION</div>
              <h2 class="section-title">진료 <em>철학.</em></h2>
            </div>
            <div data-reveal data-reveal-delay="1">
              {d.intro.map((p) => (
                <p style="font-size:1.1rem; line-height:2; color:var(--ink-700); margin-bottom:24px;">{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Specialties */}
      {relatedTreatments.length > 0 && (
        <section class="section">
          <div class="container">
            <div class="section-head" data-reveal>
              <div class="section-eyebrow">SPECIALTIES</div>
              <h2 class="section-title">{d.name} 원장의 <em>전문 진료.</em></h2>
            </div>
            <div class="treatments-grid">
              {relatedTreatments.map((t, i) => (
                <a href={`/treatments/${t.slug}`} class="treatment-card" data-reveal data-reveal-delay={String(i + 1)}>
                  <div class="num">0{i + 1}</div>
                  <div class="name-en">{t.nameEn}</div>
                  <h3>{t.name}</h3>
                  <p class="tagline">{t.tagline}</p>
                  <span class="arrow">자세히 보기 <i class="fas fa-arrow-right"></i></span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Credentials */}
      <section class="section section-dark">
        <div class="container">
          <div class="section-head" data-reveal>
            <div class="section-eyebrow">CREDENTIALS</div>
            <h2 class="section-title">학력 · 경력 · <em>자문의 자격.</em></h2>
          </div>

          <div style="display:grid; grid-template-columns:1fr; gap:40px; max-width:960px;" class="cred-grid">
            {d.education.length > 0 && (
              <div data-reveal>
                <h3 style="font-family:var(--font-display); font-weight:400; color:var(--brand-300); font-size:1.4rem; margin-bottom:20px;">학력 및 수련</h3>
                <ul style="list-style:none; padding:0; display:grid; gap:12px;">
                  {d.education.map((e) => (
                    <li style="padding:14px 18px; background:rgba(255,255,255,0.04); border-left:2px solid var(--brand-400); border-radius:4px;">
                      <i class="fas fa-graduation-cap" style="color:var(--brand-300); margin-right:12px;"></i>
                      <span style="color:rgba(255,255,255,0.9);">{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {d.careers.length > 0 && (
              <div data-reveal data-reveal-delay="1">
                <h3 style="font-family:var(--font-display); font-weight:400; color:var(--brand-300); font-size:1.4rem; margin-bottom:20px;">학회 활동</h3>
                <ul style="list-style:none; padding:0; display:grid; grid-template-columns:1fr; gap:12px;">
                  {d.careers.map((c) => (
                    <li style="padding:14px 18px; background:rgba(255,255,255,0.04); border-radius:4px; color:rgba(255,255,255,0.85);">
                      <i class="fas fa-medal" style="color:var(--brand-300); margin-right:12px;"></i>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {d.certifications.length > 0 && (
              <div data-reveal data-reveal-delay="2">
                <h3 style="font-family:var(--font-display); font-weight:400; color:var(--brand-300); font-size:1.4rem; margin-bottom:20px;">인증 · 자문의 자격</h3>
                <div style="display:grid; grid-template-columns:1fr; gap:12px;">
                  {d.certifications.map((c) => (
                    <div style="padding:20px 24px; background:linear-gradient(135deg, rgba(10,186,181,0.12), rgba(10,186,181,0.04)); border:1px solid rgba(10,186,181,0.25); border-radius:12px; display:flex; align-items:center; gap:14px;">
                      <i class="fas fa-certificate" style="color:var(--brand-300); font-size:1.3rem;"></i>
                      <span style="color:white; font-weight:500;">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section class="section">
        <div class="container">
          <div class="cta-block" data-reveal>
            <h2>{d.name} 원장님과 <em style="color:var(--brand-300); font-style:italic;">상담</em>하세요.</h2>
            <p>상담은 언제나 무료입니다. 진료 가능 여부와 치료 플랜을 정직하게 안내드립니다.</p>
            <div class="btns">
              <a href={`tel:${CLINIC.phone}`} class="btn btn-primary"><i class="fas fa-phone"></i> {CLINIC.phone}</a>
              <a href="/visit" class="btn btn-ghost"><i class="fas fa-map-marker-alt"></i> 오시는 길</a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
