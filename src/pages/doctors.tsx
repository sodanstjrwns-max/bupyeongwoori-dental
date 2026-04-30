import { Layout } from '../components/Layout'
import { CLINIC, OG_IMAGES } from '../lib/constants'
import { DOCTORS, getDoctor, doctorPhotoSrc } from '../data/doctors'
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
      ogImage={OG_IMAGES.doctors}
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
          <h1 class="hero-title" data-reveal data-reveal-delay="1">
            <span class="hero-title-row">여섯 명의 <em class="ph-mint-1">전문의</em>,</span>
            <span class="hero-title-row">변하지 않는 <em class="ph-mint-2">한 가지</em></span>
            <span class="hero-title-row">변하지 않는 <em class="ph-mint-3">우리</em>.</span>
          </h1>
          <p class="hero-sub" data-reveal data-reveal-delay="2">
            전문 분야는 달라도, "환자에게 정직한 최선"이라는 원칙은 단 하나. 6인의 전문의가 같은 무드로, 같은 깊이로 함께합니다.
          </p>
        </div>
      </section>

      {/* Atmosphere strip — 진료실 분위기 */}
      <section class="section section-soft" style="padding-top:0; padding-bottom:0;">
        <div class="doctors-atmosphere" data-reveal>
          <img src="/media/clinic/operatory-hall.jpg" alt="부평우리치과 진료실 전경 - 6인 전문의가 함께 진료하는 공간" loading="lazy" decoding="async" />
          <div class="doctors-atmosphere-cap">
            <span class="section-eyebrow" style="padding-left:0; color:rgba(255,255,255,0.85);">SAME PLACE · SAME PRINCIPLE</span>
            <p>한 자리, 한 마음 — 6인의 전문의가 함께 진료합니다.</p>
          </div>
        </div>
      </section>

      {/* Doctors grid */}
      <section class="section">
        <div class="container">
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
export const DoctorDetailPage = ({ slug, cases = [], isLoggedIn = false }: { slug: string; cases?: any[]; isLoggedIn?: boolean }) => {
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
      ogImage={doctorPhotoSrc(d.photo) || OG_IMAGES.doctors}
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
      <section class="hero doctor-hero" style="min-height:80vh;">
        <div class="container hero-content">
          <div class={`doctor-hero-grid ${doctorPhotoSrc(d.photo) ? 'with-photo' : ''}`}>
            <div>
              <div class="hero-eyebrow" data-reveal>
                <span class="dot"></span>
                <span>{d.title.toUpperCase()} · {d.name}</span>
              </div>
              <h1 class="hero-title" data-reveal data-reveal-delay="1" style="font-size:clamp(2.4rem, 6vw, 5rem);">
                {d.name}
                <span style="display:block; font-family:inherit; color:var(--brand-300); font-size:0.5em; font-weight:300; margin-top:12px;">
                  {d.title}
                </span>
              </h1>
              <p class="hero-sub" data-reveal data-reveal-delay="2" style="max-width:580px;">
                {d.tagline}
              </p>
              {d.quote && (
                <div data-reveal data-reveal-delay="3" style="margin-top:32px; padding:24px 28px; border-left:3px solid var(--brand-400); background:rgba(10,186,181,0.06);">
                  <p style="font-family:inherit; font-size:1.05rem; color:rgba(255,255,255,0.9); line-height:1.6;">{d.quote}</p>
                </div>
              )}
            </div>
            {doctorPhotoSrc(d.photo) && (
              <div class="doctor-hero-photo" data-reveal data-reveal-delay="2">
                <img src={doctorPhotoSrc(d.photo)!} alt={`${d.name} ${d.title}`} loading="eager" />
              </div>
            )}
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

      {/* In-Practice Gallery — kim-jaein 전용 (진료 / 상담 / 판독) */}
      {d.slug === 'kim-jaein' && (
        <section class="section">
          <div class="container">
            <div class="section-head" data-reveal>
              <div class="section-eyebrow">IN PRACTICE</div>
              <h2 class="section-title">진료실의 <em>김재인 원장.</em></h2>
              <p class="section-lead" style="max-width:720px;">
                14년간 한 자리에서 지켜 온 진료의 결. 사진 한 컷에 담긴 직관적 설명, 정교한 손끝, 그리고 환자에게 향하는 시선.
              </p>
            </div>
            <div class="doctor-gallery" data-reveal data-reveal-delay="1">
              <figure class="doctor-gallery-item">
                <img src="/media/doctors/kim-jaein-treatment.jpg" alt="진료 중인 김재인 대표원장 — 확대경(루페)을 착용하고 정교한 술식 진행" loading="lazy" />
                <figcaption>
                  <strong>정교한 술식</strong>
                  <span>확대경 착용 — 미세한 차이까지 손끝으로 다스립니다.</span>
                </figcaption>
              </figure>
              <figure class="doctor-gallery-item">
                <img src="/media/doctors/kim-jaein-consult.jpg" alt="환자에게 직접 손짓으로 설명하는 김재인 대표원장 — 미세현미경 EXTARO 300 도입 안내 패널 앞" loading="lazy" />
                <figcaption>
                  <strong>직관적인 설명</strong>
                  <span>전문 용어 대신, 환자의 언어로. 보이는 것을 그대로 보여드립니다.</span>
                </figcaption>
              </figure>
              <figure class="doctor-gallery-item">
                <img src="/media/doctors/kim-jaein-xray.jpg" alt="환자와 함께 파노라마 X-ray 영상을 보며 판독하는 김재인 대표원장" loading="lazy" />
                <figcaption>
                  <strong>함께 보는 진단</strong>
                  <span>CBCT·파노라마 영상을 같이 짚어가며 — 결정은 환자가 합니다.</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
      )}

      {/* YouTube Cinematic — kim-jaein 전용 인터뷰 영상 */}
      {d.slug === 'kim-jaein' && (
        <section class="cinema-section" aria-label={`${d.name} 대표원장 인터뷰 영상`}>
          <div class="cinema-eyebrow-row" data-reveal>
            <div class="container">
              <div class="section-eyebrow" style="padding-left:0;">IN HIS OWN WORDS · 직접 듣는 진료 철학</div>
              <h2 class="cinema-heading">
                <em class="ph-mint-3">김재인 대표원장</em>이 직접 전하는 14년의 이야기.
              </h2>
            </div>
          </div>
          <div class="cinema-stage" data-reveal data-reveal-delay="1">
            <div class="cinema-frame cinema-frame-yt" data-cinema-yt data-yt-id="Bsnlt16SToY">
              {/* Click-to-load 썸네일: 초기엔 YouTube 썸네일만 띄우고, 클릭 시 iframe 마운트 → 첫 LCP 가벼움 */}
              <img
                class="cinema-yt-poster"
                src="https://i.ytimg.com/vi/Bsnlt16SToY/maxresdefault.jpg"
                alt={`${d.name} 대표원장 인터뷰 영상 썸네일`}
                loading="lazy"
                decoding="async"
              />
              <div class="cinema-overlay" aria-hidden="true"></div>
              <div class="cinema-vignette" aria-hidden="true"></div>
              <div class="cinema-caption">
                <div class="cinema-caption-eyebrow">INTERVIEW · KIM JAEIN, DDS, Ph.D.</div>
                <div class="cinema-caption-title">변하지 않는 진료, 변하지 않는 우리.</div>
              </div>
              <button type="button" class="cinema-yt-play" data-cinema-yt-play aria-label="대표원장 인터뷰 영상 재생">
                <i class="fas fa-play"></i>
              </button>
              <a
                href="https://youtu.be/Bsnlt16SToY"
                target="_blank"
                rel="noopener"
                class="cinema-yt-external"
                aria-label="YouTube에서 보기"
                onclick="event.stopPropagation()"
              >
                <i class="fab fa-youtube"></i>
                <span>YouTube</span>
              </a>
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

      {/* Real Cases — 해당 원장이 담당한 비포애프터 사례 */}
      {cases.length > 0 && (
        <section class="section section-soft">
          <div class="container">
            <div class="section-head" data-reveal>
              <div class="section-eyebrow">REAL CASES</div>
              <h2 class="section-title">{d.name} 원장의 <em class="ph-mint-3">실제 케이스.</em></h2>
              <p class="section-lead">
                {d.name} {d.title}이 직접 담당한 환자분들의 실제 결과만 공유합니다. After 사진은 회원 전용으로 공개됩니다.
              </p>
            </div>
            <div class="tx-cases-grid">
              {cases.map((c, i) => {
                const tx = getTreatment(c.treatment_slug)
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
                        {tx ? <span class="tx-case-chip"><i class="fas fa-tooth"></i> {tx.name}</span> : null}
                        {c.region ? <span class="tx-case-chip"><i class="fas fa-map-marker-alt"></i> {c.region}</span> : null}
                        {c.treatment_period ? <span class="tx-case-chip"><i class="fas fa-clock"></i> {c.treatment_period}</span> : null}
                        {c.age ? <span class="tx-case-chip"><i class="fas fa-user"></i> {c.age}대 {c.gender === 'M' ? '남성' : c.gender === 'F' ? '여성' : ''}</span> : null}
                      </div>
                      <h3 class="tx-case-title">{c.title}</h3>
                      {c.summary ? <p class="tx-case-summary">{c.summary}</p> : null}
                    </div>
                  </a>
                )
              })}
            </div>
            <div class="tx-cases-more">
              <a href={`/before-after?doctor=${d.slug}`} class="btn btn-dark">
                {d.name} 원장 케이스 더 보기 <i class="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section class="section">
        <div class="container">
          <div class="cta-block" data-reveal>
            <h2 class="cta-h2">
              <span class="cta-line"><em class="cta-mint-1">{d.name}</em> 원장님께,</span><br/>
              <span class="cta-line">변하지 않는 <em class="cta-mint-2">정직한</em> 진단을</span><br/>
              <span class="cta-line">받아 <em class="cta-mint-3">보세요</em>.</span>
            </h2>
            <p>상담은 언제나 무료입니다. 진료 가능 여부와 치료 플랜을 <strong style="color:#fff;">정직하게</strong> 안내드립니다.</p>
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
    </Layout>
  )
}
