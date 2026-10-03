import { Layout } from '../components/Layout'
import { CLINIC, OG_IMAGES } from '../lib/constants'
import { TREATMENT_LIST, CORE_LIST } from '../data/treatments'
import { DOCTORS } from '../data/doctors'
import { breadcrumbSchema, articleSchema, serviceSchema, itemListSchema } from '../lib/schema'
import { metaDescription } from '../lib/article-seo'

export const BA_PER_PAGE = 12
// 샘플(시드) 케이스는 실제 진료 사례로 색인되지 않게 noindex·사이트맵 제외
export const isSampleCase = (slug: string) => /^sample-/.test(slug)
const genderKo = (g: string | null) => (g === 'M' || g === 'male' ? '남성' : g === 'F' || g === 'female' ? '여성' : '')
// 구조 필드만으로 만든 사례 요약(데이터에 있는 값만)
export const caseSummaryText = (c: { treatment_slug: string; age: number | null; gender: string | null; treatment_period: string | null; doctor_slug: string }) => {
  const t = TREATMENT_LIST.find((x) => x.slug === c.treatment_slug)
  const d = DOCTORS.find((x) => x.slug === c.doctor_slug)
  const who = [c.age ? `${Math.floor(c.age / 10) * 10}대` : '', genderKo(c.gender)].filter(Boolean).join(' ')
  return [`${t?.name ?? '치과'} 사례`, who ? `${who} 환자` : '', c.treatment_period ? `치료 기간 ${c.treatment_period}` : '', d ? `담당 ${d.title} ${d.name}` : ''].filter(Boolean).join(' · ') + '.'
}
import { CtaSection } from '../components/CtaSection'
import { autoLinkContent } from '../lib/auto-link'

type BeforeAfterRow = {
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
  content: string | null
  before_pano_key: string | null
  after_pano_key: string | null
  before_intra_key: string | null
  after_intra_key: string | null
  view_count: number
  created_at: string
}

// ============================================================
// 목록 페이지 (Gallery)
// ============================================================
export const BeforeAfterListPage = ({
  cases,
  isLoggedIn,
  activeTreatment,
  query,
  page = 1,
  totalPages = 1,
}: {
  cases: BeforeAfterRow[]
  isLoggedIn: boolean
  activeTreatment?: string
  query?: string
  page?: number
  totalPages?: number
}) => {
  const pq = (n: number) => { const a: string[] = []; if (activeTreatment) a.push(`treatment=${encodeURIComponent(activeTreatment)}`); if (n > 1) a.push(`page=${n}`); return a.length ? `?${a.join('&')}` : '' }
  const treatmentName = (slug: string) => TREATMENT_LIST.find((t) => t.slug === slug)?.name ?? slug
  const doctorName = (slug: string) => DOCTORS.find((d) => d.slug === slug)?.name ?? slug

  return (
    <Layout
      title="비포애프터 갤러리"
      description="부평우리치과의 전후 케이스를 진료별로 모았습니다. 임플란트·심미보철·교정·라미네이트의 진단과 치료 과정, 치료 기간을 사례마다 설명합니다. 치료 후 사진은 회원 로그인 후 볼 수 있습니다."
      canonical={`https://${CLINIC.domain}/before-after${!activeTreatment && page > 1 ? `?page=${page}` : ''}`}
      keywords="부평 치과 비포애프터, 부평 임플란트 전후, 부평 심미보철 사례, 부평 교정 사례, 부평우리치과 케이스"
      ogImage={OG_IMAGES.beforeAfter}
      jsonLd={[
        breadcrumbSchema([
          { name: '홈', url: '/' },
          { name: '비포애프터', url: '/before-after' },
        ]),
        cases.length ? itemListSchema(cases.map((c) => ({ name: c.title, url: `/before-after/${c.slug}` })), '부평우리치과 비포애프터') : null,
      ]}
    >
      <section class="page-hero">
        <div class="container">
          <div class="page-eyebrow">BEFORE · AFTER</div>
          <h1 class="page-title">
            변하지 않는 <em class="ph-mint-3">결과</em>로<br/>
            증명합니다.
          </h1>
          <p class="page-lead">
            허락해 주신 환자분들의 사례만 공유합니다. 14년 한 자리에서 쌓아온, <strong style="color:var(--ink-900);">변하지 않는 퀄리티</strong>의 결과물입니다.
            {isLoggedIn ? (
              <> 로그인하신 회원이시므로 <strong>모든 After 사진을 확인하실 수 있습니다.</strong></>
            ) : (
              <> <a href="/login?next=/before-after" style="color:var(--brand-600); font-weight:600;">로그인</a>하시면 After 사진을 모두 확인하실 수 있습니다.</>
            )}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section class="section" style="padding-top:40px; padding-bottom:40px;">
        <div class="container">
          <form method="get" action="/before-after" class="ba-filters">
            <div class="ba-filter-row">
              <label>
                <span>진료 선택</span>
                <select name="treatment">
                  <option value="">전체 진료</option>
                  {TREATMENT_LIST.map((t) => (
                    <option value={t.slug} selected={activeTreatment === t.slug}>{t.name}{t.isCore ? ' ★' : ''}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>키워드 검색</span>
                <input type="text" name="q" placeholder="제목·요약 검색" value={query ?? ''} />
              </label>
              <button type="submit" class="btn btn-dark" style="height:44px;">
                <i class="fas fa-search"></i> 검색
              </button>
            </div>

            <div class="ba-quick">
              <span style="color:var(--ink-500); font-size:0.85rem; margin-right:8px;">빠른 선택:</span>
              {CORE_LIST.map((t) => (
                <a href={`/before-after?treatment=${t.slug}`} class="chip">★ {t.name}</a>
              ))}
              <a href="/before-after" class="chip">전체</a>
            </div>
          </form>
        </div>
      </section>

      {/* Grid */}
      <section class="section" style="padding-top:0;">
        <div class="container">
          {cases.length === 0 ? (
            <div class="empty-state">
              <i class="fas fa-images" style="font-size:3rem; color:var(--ink-300);"></i>
              <h3 style="margin-top:16px;">아직 등록된 케이스가 없습니다</h3>
              <p>곧 풍부한 사례가 업데이트될 예정입니다.</p>
            </div>
          ) : (
            <div class="ba-grid">
              {cases.map((c) => (
                <a href={`/before-after/${c.slug}`} class="ba-card">
                  <div class="ba-slider" data-reveal>
                    <div class="ba-before">
                      {c.before_intra_key ? (
                        <img src={`/media/${c.before_intra_key}`} alt={`${treatmentName(c.treatment_slug)} 치료 전`} loading="lazy" decoding="async" />
                      ) : (
                        <div class="ba-placeholder">
                          <span>Before</span>
                        </div>
                      )}
                      <span class="ba-label">BEFORE</span>
                    </div>
                    <div class="ba-after">
                      {c.after_intra_key && isLoggedIn ? (
                        <img src={`/media/${c.after_intra_key}`} alt={`${treatmentName(c.treatment_slug)} 치료 후`} loading="lazy" decoding="async" />
                      ) : (
                        <div class="ba-locked">
                          <i class="fas fa-lock"></i>
                          <span>{isLoggedIn ? 'After' : '로그인 시 공개'}</span>
                        </div>
                      )}
                      <span class="ba-label after-label">AFTER</span>
                    </div>
                  </div>
                  <div class="ba-meta">
                    <div class="ba-tags">
                      <span class="ba-tag">{treatmentName(c.treatment_slug)}</span>
                      {c.treatment_period ? <span class="ba-tag ghost">{c.treatment_period}</span> : null}
                    </div>
                    <h3 class="ba-title">{c.title}</h3>
                    {c.summary ? <p class="ba-summary">{c.summary}</p> : null}
                    <div class="ba-bottom">
                      <span>{c.age ? `${c.age}대${c.gender === 'M' ? ' 남성' : c.gender === 'F' ? ' 여성' : ''}` : ''}</span>
                      <span>{doctorName(c.doctor_slug)}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
          {totalPages > 1 ? (
            <nav class="blog-filter wr-pager" aria-label="비포애프터 목록 페이지">
              {page > 1 ? <a href={`/before-after${pq(page - 1)}`} class="chip" rel="prev">‹ 이전</a> : null}
              {Array.from({ length: totalPages }, (_, k) => k + 1).map((n) => n === page ? <span class="chip active" aria-current="page">{n}</span> : <a href={`/before-after${pq(n)}`} class="chip">{n}</a>)}
              {page < totalPages ? <a href={`/before-after${pq(page + 1)}`} class="chip" rel="next">다음 ›</a> : null}
            </nav>
          ) : null}
        </div>
      </section>

      <CtaSection
        eyebrow="CONTACT · 내 케이스도 가능할까?"
        title="실제 케이스, 직접 상담받아보세요."
        lead="비포애프터에서 본 결과가 내게도 가능한지, CBCT 3D 진단 포함 무료 상담으로 정직하게 안내드립니다."
      />
    </Layout>
  )
}

// ============================================================
// 상세 페이지
// ============================================================
export const BeforeAfterDetailPage = ({
  caseRow,
  isLoggedIn,
  relatedCases,
  relatedPosts = [],
}: {
  caseRow: BeforeAfterRow
  isLoggedIn: boolean
  relatedCases: BeforeAfterRow[]
  relatedPosts?: { slug: string; title: string; published_at?: string }[]
}) => {
  const treatment = TREATMENT_LIST.find((t) => t.slug === caseRow.treatment_slug)
  const doctor = DOCTORS.find((d) => d.slug === caseRow.doctor_slug)

  // ============================================================
  // SEO/AEO: 케이스용 풍부 JSON-LD 구축
  // ============================================================
  const baseUrl = `https://${CLINIC.domain}`
  const caseUrl = `${baseUrl}/before-after/${caseRow.slug}`

  // 이미지 절대 URL 후보 (Article의 image 배열용)
  // 치료 후(After) 사진은 회원 전용(/media 서버 게이트) → 구조화 데이터·OG 에는 치료 전 사진만 노출
  const imgKeys = [
    caseRow.before_pano_key,
    caseRow.before_intra_key,
  ].filter(Boolean) as string[]
  const summaryText = caseSummaryText(caseRow)
  const txLabel = treatment?.name ?? '치과'
  const imageUrls = imgKeys.length > 0
    ? imgKeys.map((k) => `${baseUrl}/media/${k}`)
    : [`${baseUrl}${OG_IMAGES.beforeAfter}`]

  const description = metaDescription(
    caseRow.summary,
    `${summaryText} ${String(caseRow.content ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}`,
  )

  // 1) Article (비포애프터 케이스 자체를 발행물로)
  const articleLd = articleSchema({
    title: `${caseRow.title} | 비포애프터 케이스`,
    description,
    url: caseUrl,
    image: imageUrls[0],
    author: doctor ? `${doctor.title} ${doctor.name}` : CLINIC.representative,
    authorSlug: doctor?.slug,
    datePublished: caseRow.created_at,
    dateModified: (caseRow as any).updated_at ?? caseRow.created_at,
  })
  // image를 배열로 강화 (Google 권장: 16:9, 4:3, 1:1)
  ;(articleLd as any).image = imageUrls
  ;(articleLd as any).articleSection = treatment?.name ?? '비포애프터'
  ;(articleLd as any).keywords = [
    treatment?.name,
    '비포애프터',
    '부평 치과',
    `부평 ${treatment?.name ?? ''}`,
    caseRow.region,
  ].filter(Boolean).join(', ')

  // 2) ImageObject — Before/After 각각 명시적으로 마킹 (이미지 검색 노출용)
  const imageObjectsLd = imgKeys.map((k, idx) => {
    const isAfter = false
    const isPano = k === caseRow.before_pano_key || k === caseRow.after_pano_key
    return {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      '@id': `${caseUrl}#image-${idx + 1}`,
      contentUrl: `${baseUrl}/media/${k}`,
      url: `${baseUrl}/media/${k}`,
      caption: `${caseRow.title} - ${isAfter ? 'AFTER' : 'BEFORE'} (${isPano ? '파노라마' : '구내사진'})`,
      description: `${treatment?.name ?? '진료'} ${isAfter ? '시술 후' : '시술 전'} ${isPano ? '파노라마 X-ray' : '구내 사진'}`,
      representativeOfPage: idx === 0,
      creator: { '@type': 'Organization', name: CLINIC.name },
      copyrightHolder: { '@type': 'Organization', name: CLINIC.name },
      license: caseUrl,
      acquireLicensePage: `${baseUrl}/contact`,
    }
  })

  // 3) MedicalProcedure — 어떤 진료 케이스인지 명확히
  const procedureLd = treatment ? {
    ...serviceSchema({
      name: treatment.name,
      nameEn: treatment.nameEn,
      description: treatment.metaDescription ?? description,
      slug: treatment.slug,
      category: 'Dentistry',
    }),
    '@id': `${caseUrl}#procedure`,
  } : null

  // 4) MedicalWebPage — 의료 콘텐츠임을 명시 (E-E-A-T 강화)
  const medicalWebPageLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    '@id': caseUrl,
    url: caseUrl,
    name: caseRow.title,
    description,
    inLanguage: 'ko-KR',
    isPartOf: { '@id': `${baseUrl}/#website` },
    audience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
    about: treatment ? { '@type': 'MedicalProcedure', '@id': `${baseUrl}/treatments/${treatment.slug}#procedure`, name: treatment.name } : undefined,
    lastReviewed: String(caseRow.created_at).slice(0, 10),
    reviewedBy: doctor
      ? { '@type': 'Physician', '@id': `${baseUrl}/doctors/${doctor.slug}#person`, name: `${doctor.title} ${doctor.name}`, worksFor: { '@type': 'Dentist', '@id': `${baseUrl}/#clinic`, name: CLINIC.name } }
      : { '@type': 'Dentist', '@id': `${baseUrl}/#clinic`, name: CLINIC.name },
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.wr-answer'] },
    primaryImageOfPage: imageUrls[0]
      ? { '@type': 'ImageObject', url: imageUrls[0] }
      : undefined,
  }

  // 5) BreadcrumbList
  const breadcrumbLd = breadcrumbSchema([
    { name: '홈', url: '/' },
    { name: '비포애프터', url: '/before-after' },
    ...(treatment ? [{ name: treatment.name, url: `/treatments/${treatment.slug}` }] : []),
    { name: caseRow.title, url: `/before-after/${caseRow.slug}` },
  ])

  const jsonLdList: Record<string, unknown>[] = [
    articleLd as any,
    medicalWebPageLd as any,
    ...imageObjectsLd as any[],
    breadcrumbLd as any,
  ]
  if (procedureLd) jsonLdList.push(procedureLd as any)

  return (
    <Layout
      title={`${txLabel} 사례 — ${caseRow.title}${caseRow.treatment_period && !caseRow.title.includes(caseRow.treatment_period) ? `, ${caseRow.treatment_period}` : ''}`}
      description={description}
      canonical={caseUrl}
      noindex={isSampleCase(caseRow.slug)}
      keywords={`${treatment?.keywords ?? ''}, 부평 치과 비포애프터, ${treatment?.name ?? ''} 사례, ${caseRow.region ?? ''}, 부평 임플란트 전후, 부평 라미네이트 전후, 부평 교정 전후`}
      ogImage={caseRow.before_pano_key ? `/media/${caseRow.before_pano_key}` : (caseRow.before_intra_key ? `/media/${caseRow.before_intra_key}` : OG_IMAGES.beforeAfter)}
      ogType="article"
      articleMeta={{
        publishedTime: caseRow.created_at,
        modifiedTime: caseRow.created_at,
        author: doctor ? `${doctor.title} ${doctor.name}` : CLINIC.representative,
        section: treatment?.name ?? '비포애프터',
        tags: [treatment?.name, '비포애프터', '부평 치과', caseRow.region].filter(Boolean) as string[],
      }}
      jsonLd={jsonLdList}
    >
      <section class="ba-detail-hero">
        <div class="ba-detail-hero-bg" aria-hidden="true"></div>
        <div class="container ba-detail-hero-inner">
          <div class="ba-detail-hero-main">
            <div class="ba-detail-eyebrow" data-reveal>
              <span class="dot"></span>
              <a href="/before-after">BEFORE · AFTER</a>
              {treatment ? <><span class="sep">·</span><span>{treatment.name}</span></> : null}
            </div>
            <h1 class="ba-detail-title" data-reveal data-reveal-delay="1">{caseRow.title}</h1>
            {caseRow.summary ? <p class="ba-detail-lead" data-reveal data-reveal-delay="2">{caseRow.summary}</p> : null}
            <div class="ba-detail-cta" data-reveal data-reveal-delay="3">
              <a href={CLINIC.socialLinks.naverBooking} target="_blank" rel="noopener" class="btn btn-primary" style="background:#03C75A; border-color:#03C75A;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z"/></svg>
                같은 진료 상담 예약
              </a>
              {treatment ? (
                <a href={`/treatments/${treatment.slug}`} class="btn btn-ghost">
                  <i class="fas fa-tooth"></i> {treatment.name} 자세히 보기
                </a>
              ) : null}
            </div>
          </div>

          <aside class="ba-detail-card" data-reveal data-reveal-delay="2">
            <div class="ba-detail-card-head">
              <div class="ba-detail-card-eyebrow">CASE INFO</div>
              <div class="ba-detail-card-title">진료 정보</div>
            </div>
            <ul class="ba-detail-card-list">
              {treatment ? (
                <li>
                  <i class="fas fa-tooth"></i>
                  <div>
                    <span class="lbl">진료</span>
                    <strong>{treatment.name}</strong>
                  </div>
                </li>
              ) : null}
              {caseRow.age ? (
                <li>
                  <i class="fas fa-user"></i>
                  <div>
                    <span class="lbl">환자</span>
                    <strong>{caseRow.age}대 {caseRow.gender === 'M' ? '남성' : caseRow.gender === 'F' ? '여성' : caseRow.gender === 'N' ? '비공개' : ''}</strong>
                  </div>
                </li>
              ) : null}
              {caseRow.region_city || caseRow.region ? (
                <li>
                  <i class="fas fa-map-marker-alt"></i>
                  <div>
                    <span class="lbl">거주 지역</span>
                    <strong>{caseRow.region_city || caseRow.region}</strong>
                  </div>
                </li>
              ) : null}
              {caseRow.treatment_period ? (
                <li>
                  <i class="fas fa-clock"></i>
                  <div>
                    <span class="lbl">치료 기간</span>
                    <strong>{caseRow.treatment_period}</strong>
                  </div>
                </li>
              ) : null}
              {doctor ? (
                <li>
                  <i class="fas fa-user-doctor"></i>
                  <div>
                    <span class="lbl">담당 의료진</span>
                    <strong>{doctor.title} {doctor.name}</strong>
                  </div>
                </li>
              ) : null}
            </ul>
          </aside>
        </div>
      </section>

      {/* Slider sections (panoramic + intraoral) */}
      <section class="section ba-detail-section">
        <div class="container">
          <div class="ba-detail-grid">
            {/* Panoramic — BEFORE 또는 AFTER 키가 있을 때만 노출 */}
            {(caseRow.before_pano_key || caseRow.after_pano_key) && (
              <div class="ba-detail-item" data-reveal>
                <div class="ba-detail-section-head">
                  <div class="ba-detail-section-eyebrow">PANORAMIC</div>
                  <h2>파노라마 X-ray</h2>
                  <p>전체 치아·턱뼈 구조를 한눈에 보여주는 진단 영상입니다.</p>
                </div>
                <div class="ba-compare">
                  <div class="ba-compare-before">
                    {caseRow.before_pano_key ? (
                      <img src={`/media/${caseRow.before_pano_key}`} alt={`${txLabel} 치료 전 — 파노라마`} loading="lazy" decoding="async" />
                    ) : <div class="ba-placeholder"><span>Before</span></div>}
                    <span class="ba-label">BEFORE</span>
                  </div>
                  <div class="ba-compare-after">
                    {caseRow.after_pano_key && isLoggedIn ? (
                      <img src={`/media/${caseRow.after_pano_key}`} alt={`${txLabel} 치료 후 — 파노라마`} loading="lazy" decoding="async" />
                    ) : (
                      <div class="ba-locked">
                        <i class="fas fa-lock"></i>
                        <span>{isLoggedIn ? 'After' : '로그인 시 공개'}</span>
                      </div>
                    )}
                    <span class="ba-label after-label">AFTER</span>
                  </div>
                </div>
              </div>
            )}

            {/* Intraoral — BEFORE 또는 AFTER 키가 있을 때만 노출 */}
            {(caseRow.before_intra_key || caseRow.after_intra_key) && (
              <div class="ba-detail-item" data-reveal data-reveal-delay="1">
                <div class="ba-detail-section-head">
                  <div class="ba-detail-section-eyebrow">INTRAORAL</div>
                  <h2>구내 사진</h2>
                  <p>실제 구강 내 색·형태·잇몸 상태까지 정밀하게 기록합니다.</p>
                </div>
                <div class="ba-compare">
                  <div class="ba-compare-before">
                    {caseRow.before_intra_key ? (
                      <img src={`/media/${caseRow.before_intra_key}`} alt={`${txLabel} 치료 전 — 구내 사진`} loading="lazy" decoding="async" />
                    ) : <div class="ba-placeholder"><span>Before</span></div>}
                    <span class="ba-label">BEFORE</span>
                  </div>
                  <div class="ba-compare-after">
                    {caseRow.after_intra_key && isLoggedIn ? (
                      <img src={`/media/${caseRow.after_intra_key}`} alt={`${txLabel} 치료 후 — 구내 사진`} loading="lazy" decoding="async" />
                    ) : (
                      <div class="ba-locked">
                        <i class="fas fa-lock"></i>
                        <span>{isLoggedIn ? 'After' : '로그인 시 공개'}</span>
                      </div>
                    )}
                    <span class="ba-label after-label">AFTER</span>
                  </div>
                </div>
              </div>
            )}

            {/* 둘 다 없으면 안내 */}
            {!caseRow.before_pano_key && !caseRow.after_pano_key &&
             !caseRow.before_intra_key && !caseRow.after_intra_key && (
              <div class="ba-detail-item" data-reveal>
                <div class="empty-state" style="padding:48px 24px; text-align:center;">
                  <i class="fas fa-image" style="font-size:2.4rem; color:var(--ink-300);"></i>
                  <p style="margin-top:14px; color:var(--ink-500);">등록된 사진이 없는 케이스입니다.</p>
                </div>
              </div>
            )}
          </div>

          {!isLoggedIn && (
            <div class="login-banner" data-reveal>
              <div>
                <h3>After 사진을 보고 싶으신가요?</h3>
                <p>회원가입은 무료이며, 모든 비포애프터 사진이 즉시 공개됩니다.</p>
              </div>
              <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <a href={`/login?next=/before-after/${caseRow.slug}`} class="btn btn-primary">로그인</a>
                <a href="/signup" class="btn btn-dark">회원가입</a>
              </div>
            </div>
          )}

          <aside class="wr-answer" aria-label="사례 요약"><strong>사례 요약</strong><p>{summaryText}</p></aside>
          {caseRow.content ? (
            <div class="prose case-content" data-reveal>
              {/* @ts-ignore */}
              {/* Phase 3-5: 자동 내부 링크 — 진료/지역 키워드 토픽 클러스터 */}
              <div dangerouslySetInnerHTML={{ __html: autoLinkContent(caseRow.content) }} />
            </div>
          ) : null}

          <div style="margin-top:40px; display:flex; gap:10px; flex-wrap:wrap;">
            {treatment ? (
              <a href={`/treatments/${treatment.slug}`} class="btn btn-dark">
                {treatment.name} 진료 자세히 →
              </a>
            ) : null}
            <a href="/before-after" class="btn" style="background:white; border:1px solid var(--ink-200); color:var(--ink-900);">
              다른 케이스 보기
            </a>
          </div>
          <p class="wr-note">※ 치료 결과는 개인의 구강 상태에 따라 다를 수 있습니다. 전후 사진은 같은 촬영 조건을 기준으로 하며 개인차가 있습니다.</p>
          {relatedPosts.length ? (
            <div class="wr-related">
              <h2>{treatment ? `${treatment.name} 관련 칼럼` : '관련 칼럼'}</h2>
              <ul>{relatedPosts.map((r) => <li><a href={`/blog/${r.slug}`}>{r.title}</a>{r.published_at ? <span>{String(r.published_at).slice(0, 10)}</span> : null}</li>)}</ul>
            </div>
          ) : null}
        </div>
      </section>

      {/* Related */}
      {relatedCases.length > 0 && (
        <section class="section section-soft">
          <div class="container">
            <div class="section-head" data-reveal>
              <div class="section-eyebrow">RELATED</div>
              <h2 class="section-title">같은 진료 다른 <em class="ph-mint-3">케이스</em></h2>
            </div>
            <div class="ba-grid">
              {relatedCases.map((c) => (
                <a href={`/before-after/${c.slug}`} class="ba-card">
                  <div class="ba-slider">
                    <div class="ba-before">
                      {c.before_intra_key ? <img src={`/media/${c.before_intra_key}`} alt={`${txLabel} 치료 전`} loading="lazy" decoding="async" /> : <div class="ba-placeholder"><span>Before</span></div>}
                      <span class="ba-label">BEFORE</span>
                    </div>
                    <div class="ba-after">
                      {c.after_intra_key && isLoggedIn ? <img src={`/media/${c.after_intra_key}`} alt={`${txLabel} 치료 후`} loading="lazy" decoding="async" /> : <div class="ba-locked"><i class="fas fa-lock"></i></div>}
                      <span class="ba-label after-label">AFTER</span>
                    </div>
                  </div>
                  <div class="ba-meta">
                    <h3 class="ba-title" style="font-size:1.1rem;">{c.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection
        eyebrow="CONTACT · 비슷한 케이스 상담"
        title="이 케이스가 내게도 가능한지, 직접 확인하세요."
        lead="실제 진단을 통해 가능 여부와 정확한 비용을 안내드립니다. 부담 없이 문의주세요."
      />
    </Layout>
  )
}
