import { Layout } from '../components/Layout'
import { CLINIC, OG_IMAGES } from '../lib/constants'
import { TREATMENT_LIST, CORE_LIST, OTHER_LIST, getTreatment } from '../data/treatments'
import { DOCTORS, getDoctor, doctorPhotoSrc } from '../data/doctors'
import { breadcrumbSchema, faqSchema, serviceSchema, itemListSchema } from '../lib/schema'

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
      ogImage={OG_IMAGES.treatments}
      jsonLd={[
        breadcrumbSchema([
          { name: '홈', url: '/' },
          { name: '진료과목', url: '/treatments' },
        ]),
        itemListSchema(
          TREATMENT_LIST.map((t) => ({ name: t.name, url: `/treatments/${t.slug}` })),
          '부평우리치과 진료과목'
        ),
      ]}
    >
      <section class="hero" style="min-height:70vh;">
        <div class="container hero-content">
          <div class="hero-eyebrow" data-reveal>
            <span class="dot"></span>
            <span>TREATMENTS · 진료과목 안내</span>
          </div>
          <h1 class="hero-title" data-reveal data-reveal-delay="1">
            <span class="hero-title-row">필요한 <em class="ph-mint-1">모든 진료</em>를,</span>
            <span class="hero-title-row">변하지 않는 <em class="ph-mint-2">한 자리</em>에서,</span>
            <span class="hero-title-row">변하지 않는 <em class="ph-mint-3">퀄리티</em>로.</span>
          </h1>
          <p class="hero-sub" data-reveal data-reveal-delay="2">
            임플란트·심미보철·교정을 중심으로 일반보철·예방치료·라미네이트·투명교정·사랑니발치까지. 치과가 할 수 있는 대부분의 진료를 같은 무드, 같은 깊이로.
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
// 진료 상세 시각화 이미지 (핵심 3개 진료과목)
// R2: bupyeongwoori-media/treatments/<file> → /media/treatments/<file>
// =========================================================
type TreatmentVisual = { src: string; alt: string; caption: string; sub: string }
const TREATMENT_VISUALS: Record<string, TreatmentVisual[]> = {
  implant: [
    {
      src: '/media/treatments/implant-1-fixture.jpg',
      alt: '임플란트 픽스처 단면도 - 티타늄 나사형 픽스처가 잇몸뼈에 식립되고 어버트먼트와 세라믹 크라운이 연결된 구조',
      caption: '픽스처 단면 구조',
      sub: '티타늄 픽스처 · 어버트먼트 · 세라믹 크라운의 3단 구조',
    },
    {
      src: '/media/clinic/scanner-3d.jpg',
      alt: '부평우리치과 디지털 임플란트 장비 - 3D 구강 스캐너와 임플란트 디자인 소프트웨어',
      caption: '디지털 임플란트 워크플로',
      sub: '3D 구강 스캐너 + CAD/CAM — 인상채득 없는 정밀 진단',
    },
    {
      src: '/media/treatments/implant-3-fullmouth.jpg',
      alt: '풀마우스 임플란트 - 다수 픽스처 위에 올세라믹 풀아치 보철이 올라간 전악 임플란트 구조',
      caption: '풀마우스 임플란트',
      sub: '다수 픽스처 + 풀아치 지르코니아 보철',
    },
  ],
  ortho: [
    {
      src: '/media/treatments/ortho-1-braces.jpg',
      alt: '메탈 브라켓 교정장치 클로즈업 - 스테인리스 브라켓과 아치와이어, 결찰재가 치아에 부착된 모습',
      caption: '메탈 브라켓 교정',
      sub: '브라켓 + 아치와이어로 치아에 지속적 힘 전달',
    },
    {
      src: '/media/clinic/ortho-counseling.jpg',
      alt: '부평우리치과 교정 치료 상담실 - Orthodontic Treatment 전용 상담 공간',
      caption: '교정 전용 상담실',
      sub: 'Invisalign 우수 인증의 직접 상담 · 인비절라인 디지털 시뮬레이션',
    },
    {
      src: '/media/treatments/ortho-3-movement.jpg',
      alt: '교정 치아 이동 시퀀스 - 부정교합에서 가지런한 치열로 단계별 이동되는 과정 시각화',
      caption: '치아 이동 시퀀스',
      sub: '뿌리까지 함께 이동하는 단계별 정렬',
    },
  ],
  esthetic: [
    {
      src: '/media/treatments/esthetic-1-laminate.jpg?v=20260430b',
      alt: '라미네이트 베니어 셸 디스플레이 - 0.3~0.5mm 두께의 도재 베니어가 치과 기공소에서 가지런히 진열된 모습',
      caption: '라미네이트 베니어',
      sub: '0.3~0.5mm 초박형 도재 셸로 자연치 손상 최소화',
    },
    {
      src: '/media/treatments/esthetic-2-crown.jpg?v=20260430c',
      alt: '한국인 여성의 자연스럽고 건강한 앞니 미소 클로즈업 - 올세라믹 크라운으로 완성한 가지런한 앞니와 자연스러운 절단연 투명도',
      caption: '자연스러운 앞니 미소',
      sub: '올세라믹 크라운으로 완성하는 자연치 같은 미소 라인',
    },
    {
      src: '/media/treatments/esthetic-3-beforeafter.jpg',
      alt: '앞니 심미 보철 전후 비교 - 변색되고 어긋난 자연치와 라미네이트 시술 후의 가지런한 치열 비교',
      caption: '심미 보철 전후',
      sub: '시술 전 변색·균열에서 자연스러운 미소 라인까지',
    },
  ],
}

// =========================================================
// 진료 상세 페이지 (공용 - core도 other도 같은 템플릿)
// =========================================================
type TreatmentCaseRow = {
  id: number
  slug: string
  title: string
  treatment_slug: string
  doctor_slug: string
  age: number | null
  gender: string | null
  region: string | null
  region_city: string | null
  treatment_period: string | null
  summary: string | null
  before_intra_key: string | null
  after_intra_key: string | null
  before_pano_key: string | null
  after_pano_key: string | null
  created_at: string
}

export const TreatmentDetailPage = ({
  slug,
  cases = [],
  isLoggedIn = false,
}: {
  slug: string
  cases?: TreatmentCaseRow[]
  isLoggedIn?: boolean
}) => {
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
      ogImage={OG_IMAGES.treatments}
      jsonLd={[
        breadcrumbSchema([
          { name: '홈', url: '/' },
          { name: '진료과목', url: '/treatments' },
          { name: t.name, url: `/treatments/${t.slug}` },
        ]),
        faqSchema(t.faqs),
        serviceSchema({
          name: t.name,
          nameEn: t.nameEn,
          description: t.metaDescription,
          slug: t.slug,
          category: 'Dentistry',
        }),
      ]}
    >
      {/* Hero */}
      <section class="hero" style="min-height:80vh;">
        <div class="container hero-content">
          <div class="hero-eyebrow" data-reveal>
            <span class="dot"></span>
            <span>{t.isCore ? 'CORE TREATMENT' : 'TREATMENT'} · {t.nameEn}</span>
          </div>
          <h1 class="hero-title" data-reveal data-reveal-delay="1" style="font-size:clamp(2.8rem, 7vw, 6rem);">
            <em class="ph-mint-3">{t.name}</em>
            <span style="display:block; font-family:inherit; font-size:0.35em; color:var(--brand-300); font-weight:300; margin-top:16px;">
              {t.tagline}
            </span>
          </h1>
          <p class="hero-sub" data-reveal data-reveal-delay="2" style="max-width:680px;">{t.heroSub}</p>
          <div class="hero-cta" data-reveal data-reveal-delay="3">
            <a href={CLINIC.socialLinks.naverBooking} target="_blank" rel="noopener" class="btn btn-primary" style="background:#03C75A; border-color:#03C75A;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z"/></svg>
              네이버 예약
            </a>
            <a href={CLINIC.socialLinks.kakao} target="_blank" rel="noopener" class="btn" style="background:#FEE500; color:#3A1D1D; border:none;">
              <i class="fas fa-comment"></i> 카카오톡 상담
            </a>
            <a href={`tel:${CLINIC.phone}`} class="btn btn-ghost"><i class="fas fa-phone"></i> {CLINIC.phone}</a>
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

      {/* Visual Gallery (핵심 3개 진료과목 한정) */}
      {TREATMENT_VISUALS[t.slug] && (
        <section class="section section-soft" style="padding-top:0;">
          <div class="container">
            <div class="section-head" data-reveal>
              <div class="section-eyebrow">VISUAL GUIDE</div>
              <h2 class="section-title">한눈에 보는 <em>{t.name}.</em></h2>
              <p class="section-lead">진료를 시작하기 전, 어떤 구조와 원리로 이루어지는지 시각적으로 안내해 드립니다.</p>
            </div>
            <div class="tx-visual-grid">
              {TREATMENT_VISUALS[t.slug].map((v, i) => (
                <figure class="tx-visual-card" data-reveal data-reveal-delay={String((i % 3) + 1)}>
                  <div class="tx-visual-img">
                    <img src={v.src} alt={v.alt} loading="lazy" decoding="async" width="1920" height="1080" />
                  </div>
                  <figcaption class="tx-visual-cap">
                    <div class="tx-visual-num">0{i + 1}</div>
                    <div class="tx-visual-text">
                      <h3>{v.caption}</h3>
                      <p>{v.sub}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

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
              {doctors.map((d, i) => {
                const photo = doctorPhotoSrc(d.photo)
                return (
                  <a href={`/doctors/${d.slug}`} class="doctor-card" data-reveal data-reveal-delay={String(i + 1)}>
                    {photo ? (
                      <div class="portrait">
                        <img src={photo} alt={`${d.name} ${d.title}`} loading="lazy" decoding="async" />
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
            </div>
          </div>
        </section>
      )}

      {/* Real Cases - 해당 진료 비포애프터 케이스 */}
      {cases.length > 0 && (
        <section class="section section-soft">
          <div class="container">
            <div class="section-head" data-reveal>
              <div class="section-eyebrow">REAL CASES</div>
              <h2 class="section-title">{t.name} <em class="ph-mint-3">실제 케이스.</em></h2>
              <p class="section-lead">
                허락해 주신 환자분들의 실제 결과만 공유합니다. After 사진은 회원 전용으로 공개됩니다.
              </p>
            </div>
            <div class="tx-cases-grid">
              {cases.map((c, i) => {
                const doctorName = DOCTORS.find((d) => d.slug === c.doctor_slug)?.name ?? ''
                return (
                  <a href={`/before-after/${c.slug}`} class="tx-case-card" data-reveal data-reveal-delay={String((i % 3) + 1)}>
                    <div class="tx-case-compare">
                      <div class="tx-case-side">
                        {c.before_intra_key ? (
                          <img src={`/media/${c.before_intra_key}`} alt={`${c.title} 전`} loading="lazy" decoding="async" />
                        ) : (
                          <div class="tx-case-ph"><span>Before</span></div>
                        )}
                        <span class="tx-case-tag">BEFORE</span>
                      </div>
                      <div class="tx-case-side">
                        {c.after_intra_key && isLoggedIn ? (
                          <img src={`/media/${c.after_intra_key}`} alt={`${c.title} 후`} loading="lazy" decoding="async" />
                        ) : (
                          <div class="tx-case-locked">
                            <i class="fas fa-lock"></i>
                            <span>{isLoggedIn ? 'After' : '로그인 시 공개'}</span>
                          </div>
                        )}
                        <span class="tx-case-tag tx-case-tag-after">AFTER</span>
                      </div>
                    </div>
                    <div class="tx-case-body">
                      <div class="tx-case-chips">
                        {c.region ? <span class="tx-case-chip"><i class="fas fa-map-marker-alt"></i> {c.region}</span> : null}
                        {c.treatment_period ? <span class="tx-case-chip"><i class="fas fa-clock"></i> {c.treatment_period}</span> : null}
                        {c.age ? <span class="tx-case-chip"><i class="fas fa-user"></i> {c.age}대 {c.gender === 'M' ? '남성' : c.gender === 'F' ? '여성' : ''}</span> : null}
                      </div>
                      <h3 class="tx-case-title">{c.title}</h3>
                      {c.summary ? <p class="tx-case-summary">{c.summary}</p> : null}
                      {doctorName ? <div class="tx-case-doctor">담당 · {doctorName}</div> : null}
                    </div>
                  </a>
                )
              })}
            </div>
            <div class="tx-cases-more">
              <a href={`/before-after?treatment=${t.slug}`} class="btn btn-dark">
                {t.name} 전체 케이스 더 보기 <i class="fas fa-arrow-right"></i>
              </a>
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
            <h2 class="cta-h2">
              <span class="cta-line"><em class="cta-mint-1">{t.name}</em>,</span><br/>
              <span class="cta-line">변하지 않는 <em class="cta-mint-2">한 자리</em>에서,</span><br/>
              <span class="cta-line">변하지 않는 <em class="cta-mint-3">퀄리티</em>로.</span>
            </h2>
            <p>CBCT 3D 진단 포함 상담은 무료입니다. 진료 가능 여부와 비용을 <strong style="color:#fff;">정직하게</strong> 안내드립니다.</p>
            <div class="btns">
              <a href={CLINIC.socialLinks.naverBooking} target="_blank" rel="noopener" class="btn btn-primary" style="background:#03C75A; border-color:#03C75A;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z"/></svg>
                네이버 예약
              </a>
              <a href={CLINIC.socialLinks.kakao} target="_blank" rel="noopener" class="btn" style="background:#FEE500; color:#3A1D1D; border:none;">
                <i class="fas fa-comment"></i> 카카오톡 상담
              </a>
              <a href={`tel:${CLINIC.phone}`} class="btn btn-ghost"><i class="fas fa-phone"></i> {CLINIC.phone}</a>
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
