import { Layout } from '../components/Layout'
import { CLINIC } from '../lib/constants'
import { TREATMENT_LIST, CORE_LIST, OTHER_LIST, getTreatment } from '../data/treatments'
import { DOCTORS, getDoctor } from '../data/doctors'
import { breadcrumbSchema, faqSchema } from '../lib/schema'

// =========================================================
// 진료 전체 보기
// =========================================================
export const TreatmentsListPage = () => {
  return (
    <Layout
      heroDark
      title="진료과목 안내 | 임플란트·심미보철·교정 외"
      description="부평우리치과의 전체 진료과목. 임플란트·심미보철·치아교정을 중심으로, 일반보철·예방치료·라미네이트·투명교정·사랑니발치까지 모두 한 자리에서."
      canonical={`https://${CLINIC.domain}/treatments`}
      jsonLd={breadcrumbSchema([
        { name: '홈', url: '/' },
        { name: '진료과목', url: '/treatments' },
      ])}
    >
      <section class="hero" style="min-height:70vh;">
        <div class="container hero-content">
          <div class="hero-eyebrow" data-reveal>
            <span class="dot"></span>
            <span>TREATMENTS · 진료과목 안내</span>
          </div>
          <h1 data-reveal data-reveal-delay="1">
            필요한 모든 진료를,<br /><em>한 자리에서.</em>
          </h1>
          <p class="hero-sub" data-reveal data-reveal-delay="2">
            임플란트·심미보철·교정을 중심으로 일반보철·예방치료·라미네이트·투명교정·사랑니발치까지. 치과가 할 수 있는 대부분의 진료를 높은 수준으로 제공합니다.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head" data-reveal>
            <div class="section-eyebrow">CORE</div>
            <h2 class="section-title">부평우리치과의 <em>3대 핵심 진료.</em></h2>
            <p class="section-lead">
              병원의 정체성을 담은 세 가지 진료. 가장 깊이 있는 임상 경험과 검증된 장비 시스템이 뒷받침됩니다.
            </p>
          </div>
          <div class="treatments-grid">
            {CORE_LIST.map((t, i) => (
              <a href={`/treatments/${t.slug}`} class="treatment-card" data-reveal data-reveal-delay={String(i + 1)}>
                <div class="num">0{i + 1}</div>
                <div class="name-en">{t.nameEn}</div>
                <h3>{t.name}</h3>
                <p class="tagline">{t.tagline}</p>
                <p class="desc">{t.overview.slice(0, 110)}…</p>
                <span class="arrow">자세히 보기 <i class="fas fa-arrow-right"></i></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section class="section section-soft">
        <div class="container">
          <div class="section-head" data-reveal>
            <div class="section-eyebrow">ALL TREATMENTS</div>
            <h2 class="section-title">그 외 <em>진료 과목.</em></h2>
            <p class="section-lead">
              핵심 진료 외에도 환자분께 필요한 거의 모든 치료를 제공합니다. 각 진료마다 상세한 안내와 FAQ 를 확인하세요.
            </p>
          </div>
          <div style="display:grid; grid-template-columns:1fr; gap:16px;" class="other-list">
            {OTHER_LIST.map((t, i) => (
              <a href={`/treatments/${t.slug}`} data-reveal data-reveal-delay={String(i + 1)}
                style="display:grid; grid-template-columns:auto 1fr auto; gap:24px; align-items:center; padding:28px 32px; background:white; border:1px solid var(--ink-100); border-radius:var(--radius-lg); transition:all 0.3s;">
                <div style="width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg, var(--brand-50), var(--brand-100)); display:grid; place-items:center; color:var(--brand-600); font-size:1.2rem;">
                  <i class="fas fa-tooth"></i>
                </div>
                <div>
                  <div style="font-family:inherit; font-size:0.85rem; color:var(--brand-600);">{t.nameEn}</div>
                  <div style="font-size:1.4rem; font-weight:600; margin-top:2px;">{t.name}</div>
                  <div style="color:var(--ink-500); margin-top:4px;">{t.tagline}</div>
                </div>
                <i class="fas fa-arrow-right" style="color:var(--brand-500);"></i>
              </a>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

// =========================================================
// 진료 상세 페이지 (공용 - core도 other도 같은 템플릿)
// =========================================================
export const TreatmentDetailPage = ({ slug }: { slug: string }) => {
  const t = getTreatment(slug)
  if (!t) {
    return (
      <Layout title="진료과목을 찾을 수 없습니다" noindex>
        <section class="section" style="padding-top:160px; min-height:70vh;">
          <div class="container" style="text-align:center;">
            <h1>진료 정보를 찾을 수 없습니다.</h1>
            <a href="/treatments" class="btn btn-dark" style="margin-top:24px;">전체 진료 보기</a>
          </div>
        </section>
      </Layout>
    )
  }

  const doctors = t.doctorSlugs.map((s) => getDoctor(s)).filter((d): d is NonNullable<typeof d> => Boolean(d))

  return (
    <Layout
      heroDark
      title={`${t.name} | ${t.tagline}`}
      description={t.metaDescription}
      keywords={t.keywords}
      canonical={`https://${CLINIC.domain}/treatments/${t.slug}`}
      jsonLd={[
        breadcrumbSchema([
          { name: '홈', url: '/' },
          { name: '진료과목', url: '/treatments' },
          { name: t.name, url: `/treatments/${t.slug}` },
        ]),
        faqSchema(t.faqs),
        {
          '@context': 'https://schema.org',
          '@type': 'MedicalProcedure',
          name: t.name,
          alternateName: t.nameEn,
          description: t.metaDescription,
          url: `https://${CLINIC.domain}/treatments/${t.slug}`,
          procedureType: 'https://schema.org/SurgicalProcedure',
        },
      ]}
    >
      {/* Hero */}
      <section class="hero" style="min-height:80vh;">
        <div class="container hero-content">
          <div class="hero-eyebrow" data-reveal>
            <span class="dot"></span>
            <span>{t.isCore ? 'CORE TREATMENT' : 'TREATMENT'} · {t.nameEn}</span>
          </div>
          <h1 data-reveal data-reveal-delay="1" style="font-size:clamp(2.8rem, 7vw, 6rem);">
            {t.name}
            <span style="display:block; font-family:inherit; font-size:0.35em; color:var(--brand-300); font-weight:300; margin-top:16px;">
              {t.tagline}
            </span>
          </h1>
          <p class="hero-sub" data-reveal data-reveal-delay="2" style="max-width:680px;">{t.heroSub}</p>
          <div class="hero-cta" data-reveal data-reveal-delay="3">
            <a href={`tel:${CLINIC.phone}`} class="btn btn-primary"><i class="fas fa-phone"></i> 상담 {CLINIC.phone}</a>
            <a href="#faq" class="btn btn-ghost">자주 묻는 질문 ({t.faqs.length})</a>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section class="section">
        <div class="container" style="max-width:820px;">
          <div class="section-head" data-reveal>
            <div class="section-eyebrow" style="padding-left:0;">OVERVIEW</div>
            <h2 class="section-title">{t.name}란 <em>무엇인가.</em></h2>
          </div>
          <p data-reveal data-reveal-delay="1" style="font-size:1.15rem; line-height:2; color:var(--ink-700);">
            {t.overview}
          </p>
        </div>
      </section>

      {/* Why Us */}
      <section class="section section-soft">
        <div class="container">
          <div class="section-head" data-reveal>
            <div class="section-eyebrow">WHY US</div>
            <h2 class="section-title">부평우리치과의 <em>{t.name}.</em></h2>
          </div>
          <div style="display:grid; grid-template-columns:1fr; gap:20px;" class="why-grid">
            {t.whyUs.map((w, i) => (
              <div data-reveal data-reveal-delay={String((i % 3) + 1)}
                style="padding:32px; background:white; border-radius:var(--radius-lg); border:1px solid var(--ink-100); display:flex; gap:24px; align-items:flex-start;">
                <div style="flex-shrink:0; width:56px; height:56px; border-radius:16px; background:linear-gradient(135deg, var(--brand-100), var(--brand-200)); display:grid; place-items:center; color:var(--brand-700); font-size:1.4rem;">
                  <i class={`fas ${w.icon}`}></i>
                </div>
                <div>
                  <h3 style="font-size:1.25rem; margin-bottom:8px;">{w.title}</h3>
                  <p style="color:var(--ink-500); line-height:1.7;">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      {t.process && t.process.length > 0 && (
        <section class="section section-dark">
          <div class="container">
            <div class="section-head" data-reveal>
              <div class="section-eyebrow">PROCESS</div>
              <h2 class="section-title">진료 <em>과정.</em></h2>
            </div>
            <div style="display:grid; grid-template-columns:1fr; gap:16px;">
              {t.process.map((p, i) => (
                <div data-reveal data-reveal-delay={String((i % 4) + 1)}
                  style="display:grid; grid-template-columns:auto 1fr; gap:28px; padding:28px 32px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius-lg); align-items:center;">
                  <div style="font-family:var(--font-display); font-size:2.2rem; font-weight:300; color:var(--brand-300); line-height:1;">{p.step}</div>
                  <div>
                    <h3 style="font-family:var(--font-display); font-weight:500; font-size:1.4rem; color:white;">{p.title}</h3>
                    <p style="color:rgba(255,255,255,0.7); margin-top:6px; font-size:1rem;">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Detailed Sections */}
      {t.sections.length > 0 && (
        <section class="section">
          <div class="container" style="max-width:820px;">
            {t.sections.map((s, i) => (
              <div data-reveal data-reveal-delay={String((i % 3) + 1)} style="margin-bottom:72px;">
                <h2 style="font-family:var(--font-display); font-weight:400; font-size:clamp(1.8rem, 3vw, 2.4rem); line-height:1.3; color:var(--ink-900); margin-bottom:28px;">
                  <span style="display:inline-block; width:24px; height:2px; background:var(--brand-500); margin-right:16px; vertical-align:middle;"></span>
                  {s.heading}
                </h2>
                {s.body.map((p) => (
                  <p style="font-size:1.08rem; line-height:2; color:var(--ink-700); margin-bottom:20px;">{p}</p>
                ))}
                {s.bullets && s.bullets.length > 0 && (
                  <ul style="list-style:none; padding:0; margin-top:24px; display:grid; gap:10px;">
                    {s.bullets.map((b) => (
                      <li style="padding:12px 18px; background:var(--bg-soft); border-left:3px solid var(--brand-400); border-radius:6px; font-size:1rem; color:var(--ink-700);">
                        <i class="fas fa-check" style="color:var(--brand-600); margin-right:10px;"></i>{b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Devices */}
      {t.devices && t.devices.length > 0 && (
        <section class="section section-dark" style="padding-top:0;">
          <div class="container">
            <div class="section-head" data-reveal>
              <div class="section-eyebrow">EQUIPMENT</div>
              <h2 class="section-title">사용 <em>장비.</em></h2>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px;">
              {t.devices.map((device) => (
                <div data-reveal style="padding:24px; background:rgba(10,186,181,0.08); border:1px solid rgba(10,186,181,0.2); border-radius:var(--radius); display:flex; align-items:center; gap:14px;">
                  <i class="fas fa-cog" style="color:var(--brand-300); font-size:1.4rem;"></i>
                  <span style="color:white; font-weight:500;">{device}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Doctors */}
      {doctors.length > 0 && (
        <section class="section">
          <div class="container">
            <div class="section-head" data-reveal>
              <div class="section-eyebrow">DOCTORS</div>
              <h2 class="section-title">담당 <em>의료진.</em></h2>
            </div>
            <div class="doctors-grid">
              {doctors.map((d, i) => (
                <a href={`/doctors/${d.slug}`} class="doctor-card" data-reveal data-reveal-delay={String(i + 1)}>
                  <div class="silhouette" aria-hidden="true">{d.name.slice(-2)}</div>
                  <div class="meta">
                    <span class="role">{d.title}</span>
                    <div class="name">{d.name}</div>
                    <div class="tagline">{d.tagline}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Price Note */}
      {t.priceNote && (
        <section class="section section-soft" style="padding-top:0;">
          <div class="container" style="max-width:820px;">
            <div data-reveal style="padding:32px 36px; background:white; border-left:4px solid var(--brand-500); border-radius:var(--radius);">
              <div style="font-size:0.85rem; color:var(--brand-700); font-weight:600; letter-spacing:0.1em; margin-bottom:12px;">PRICE NOTICE · 비용 안내</div>
              <p style="color:var(--ink-700); line-height:1.8;">{t.priceNote}</p>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section class="section" id="faq">
        <div class="container" style="max-width:860px;">
          <div class="section-head" data-reveal>
            <div class="section-eyebrow" style="padding-left:0;">FAQ</div>
            <h2 class="section-title">자주 묻는 <em>질문.</em></h2>
            <p class="section-lead">{t.name}에 대해 자주 묻는 질문 {t.faqs.length}가지입니다.</p>
          </div>
          <div style="display:grid; gap:14px;">
            {t.faqs.map((f, i) => (
              <details data-reveal data-reveal-delay={String((i % 4) + 1)}
                style="background:white; border:1px solid var(--ink-100); border-radius:var(--radius); padding:4px;">
                <summary style="padding:20px 24px; cursor:pointer; font-weight:600; display:flex; justify-content:space-between; align-items:center; gap:16px; list-style:none;">
                  <span style="flex:1;">
                    <span style="color:var(--brand-600); font-family:inherit; margin-right:12px;">Q{i + 1}.</span>
                    {f.q}
                  </span>
                  <i class="fas fa-plus" style="color:var(--brand-500); transition:transform 0.2s;"></i>
                </summary>
                <div style="padding:0 24px 20px 24px; color:var(--ink-600); line-height:1.9;">
                  <span style="color:var(--brand-600); font-family:inherit; font-weight:600;">A.</span> {f.a}
                </div>
              </details>
            ))}
          </div>
          <div style="margin-top:40px; text-align:center;" data-reveal>
            <a href="/faq" class="btn btn-dark">모든 FAQ 한 곳에서 보기 <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
      </section>

      {/* Related treatments */}
      <section class="section section-soft">
        <div class="container">
          <div class="section-head" data-reveal>
            <div class="section-eyebrow">RELATED</div>
            <h2 class="section-title">다른 <em>진료 보기.</em></h2>
          </div>
          <div class="treatments-grid">
            {TREATMENT_LIST.filter((x) => x.slug !== t.slug).slice(0, 3).map((rt, i) => (
              <a href={`/treatments/${rt.slug}`} class="treatment-card" data-reveal data-reveal-delay={String(i + 1)}>
                <div class="num">0{i + 1}</div>
                <div class="name-en">{rt.nameEn}</div>
                <h3>{rt.name}</h3>
                <p class="tagline">{rt.tagline}</p>
                <span class="arrow">자세히 보기 <i class="fas fa-arrow-right"></i></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section class="section">
        <div class="container">
          <div class="cta-block" data-reveal>
            <h2>{t.name} 상담을 <em style="color:var(--brand-300); ">시작하세요.</em></h2>
            <p>CBCT 3D 진단 포함 상담은 무료입니다. 정직한 플랜과 비용을 안내드립니다.</p>
            <div class="btns">
              <a href={`tel:${CLINIC.phone}`} class="btn btn-primary"><i class="fas fa-phone"></i> {CLINIC.phone}</a>
              <a href="/visit" class="btn btn-ghost"><i class="fas fa-map-marker-alt"></i> 오시는 길</a>
            </div>
          </div>
        </div>
      </section>

      {/* 추가 스타일 - grid breakpoints */}
      <style
        // @ts-ignore
        dangerouslySetInnerHTML={{ __html: `
          @media (min-width:768px) {
            .why-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (min-width:1100px) {
            .why-grid { grid-template-columns: repeat(3, 1fr) !important; }
          }
          details[open] summary i.fa-plus { transform: rotate(45deg); }
        `}}
      />
    </Layout>
  )
}
