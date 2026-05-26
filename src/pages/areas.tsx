// ============================================================
// 지역 × 진료 SEO 랜딩 페이지
// 목표: "부평역 임플란트", "산곡동 라미네이트" 등 롱테일 키워드 잡기
// 페이지 구조:
//   /areas                       — 지역 인덱스 (8개 지역 카드)
//   /areas/:region               — 지역 허브 (예: /areas/bupyeong-station)
//   /areas/:region/:treatment    — 지역×진료 랜딩 (예: /areas/bupyeong-station/implant)
// ============================================================

import { Layout } from '../components/Layout'
import { CLINIC, OG_IMAGES } from '../lib/constants'
import { AREAS, type AreaInfo, TREATMENT_LOCAL } from '../data/areas'
import { TREATMENT_LIST } from '../data/treatments'
import type { TreatmentDetail } from '../data/treatments'
import { breadcrumbSchema, dentistSchema, faqSchema, serviceSchema } from '../lib/schema'
import { CtaSection } from '../components/CtaSection'
import { InlineCta } from '../components/InlineCta'

const BASE = `https://${CLINIC.domain}`

// ============================================================
// /areas — 지역 인덱스 페이지
// ============================================================
export const AreasIndexPage = () => {
  const title = `부평·부평역·부평구 지역별 치과 안내 | ${CLINIC.name}`
  const description = `부평역·부평동·십정동·산곡동·부개동·삼산동·갈산동 등 부평구 전 지역에서 ${CLINIC.name}까지의 거리·교통편·지역별 진료 안내. 14년간 부평 일대 주민분들과 함께해온 치과입니다.`
  return (
    <Layout
      title="지역별 치과 안내"
      description={description}
      canonical={`${BASE}/areas`}
      keywords="부평 치과, 부평역 치과, 부평구 치과, 부평동 치과, 십정동 치과, 산곡동 치과, 부개동 치과, 삼산동 치과, 갈산동 치과"
      ogImage={OG_IMAGES.home}
      jsonLd={[
        breadcrumbSchema([
          { name: '홈', url: '/' },
          { name: '지역별 안내', url: '/areas' },
        ]),
        dentistSchema(),
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: '부평 지역별 치과 안내',
          numberOfItems: AREAS.length,
          itemListElement: AREAS.map((a, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: `${a.name} 치과 안내`,
            url: `${BASE}/areas/${a.slug}`,
          })),
        },
      ]}
    >
      <section class="page-hero">
        <div class="container">
          <div class="page-eyebrow">AREAS · 지역별 안내</div>
          <h1 class="page-title">
            부평 전 지역에서<br/>
            <em class="ph-mint-3">가장 가까운</em> 치과.
          </h1>
          <p class="page-lead">
            부평역 26번 출구 도보 1분, {CLINIC.name}. 부평구 전 지역과 인접 지역에서 어떻게 오시는지, 지역별 진료 안내를 한눈에 확인하세요.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <h2 class="section-title">부평구 지역별 안내</h2>
          <div class="area-grid">
            {AREAS.map((a) => (
              <a href={`/areas/${a.slug}`} class="area-card" data-reveal>
                <div class="area-card-head">
                  <div class="area-card-name">{a.name}</div>
                  <div class="area-card-district">{a.district}</div>
                </div>
                <div class="area-card-meta">
                  <div><i class="fas fa-route"></i> {a.distance}</div>
                  <div><i class="fas fa-subway"></i> {a.transport}</div>
                </div>
                <div class="area-card-cta">
                  {a.name} 진료 안내 →
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        eyebrow="CONTACT · 지역 무관, 같은 퀄리티"
        title="부평 어디서든, 같은 정직한 진료."
        lead="부평역 26번 출구 도보 1분. 14년간 변하지 않는 진료 퀄리티로 안내드립니다."
      />
    </Layout>
  )
}

// ============================================================
// /areas/:region — 지역 허브 페이지 (예: /areas/bupyeong-station)
// ============================================================
export const AreaHubPage = ({ area }: { area: AreaInfo }) => {
  const title = `${area.name} 치과 | ${CLINIC.name} (${area.distance})`
  const description = `${area.nameFull}에서 ${CLINIC.name}까지 ${area.distance}. ${area.intro.slice(0, 100)}...`

  const treatments = Object.keys(TREATMENT_LOCAL)
    .map(slug => TREATMENT_LIST.find(t => t.slug === slug))
    .filter(Boolean) as TreatmentDetail[]

  return (
    <Layout
      title={`${area.name} 치과`}
      description={description}
      canonical={`${BASE}/areas/${area.slug}`}
      keywords={area.keywords.join(', ')}
      ogImage={OG_IMAGES.home}
      jsonLd={[
        breadcrumbSchema([
          { name: '홈', url: '/' },
          { name: '지역별 안내', url: '/areas' },
          { name: `${area.name} 치과`, url: `/areas/${area.slug}` },
        ]),
        // MedicalBusiness 스키마 (지역 특화)
        {
          '@context': 'https://schema.org',
          '@type': ['Dentist', 'MedicalBusiness'],
          '@id': `${BASE}/areas/${area.slug}#business`,
          name: `${CLINIC.name} (${area.name} 진료)`,
          description,
          url: `${BASE}/areas/${area.slug}`,
          telephone: CLINIC.phone,
          image: `${BASE}${OG_IMAGES.home}`,
          logo: `${BASE}/media/brand/mark-256.png`,
          priceRange: '₩₩',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '부평대로 16 에이플러스에셋빌딩',
            addressLocality: '부평구',
            addressRegion: '인천광역시',
            postalCode: '21315',
            addressCountry: 'KR',
          },
          geo: area.geo ? {
            '@type': 'GeoCoordinates',
            latitude: area.geo.lat,
            longitude: area.geo.lng,
          } : undefined,
          areaServed: [
            {
              '@type': 'Place',
              name: area.nameFull,
              address: { '@type': 'PostalAddress', addressLocality: area.district, addressRegion: '인천광역시', addressCountry: 'KR' },
            },
            {
              '@type': 'City',
              name: area.name,
            },
          ],
          medicalSpecialty: 'Dentistry',
          availableService: treatments.map(t => ({
            '@type': 'MedicalProcedure',
            name: `${area.name} ${t.name}`,
            url: `${BASE}/areas/${area.slug}/${t.slug}`,
          })),
        },
        // FAQPage — 지역 환자분들이 자주 묻는 질문
        faqSchema([
          { q: `${area.name}에서 ${CLINIC.name}까지 어떻게 가나요?`, a: `${area.transport}. ${area.distance}.` },
          { q: `${area.name} 거주자입니다. 어떤 진료를 받을 수 있나요?`, a: `임플란트·치아교정·심미보철·라미네이트·투명교정·사랑니발치·일반보철·예방치료까지 8개 진료 모두 가능합니다.` },
          { q: `${area.name}에서 진료받으려면 예약이 필수인가요?`, a: '예약제로 운영되며, 네이버 예약 또는 전화(032-529-2875)로 예약 가능합니다.' },
        ]),
      ]}
    >
      <section class="page-hero">
        <div class="container">
          <div class="page-eyebrow">{area.nameFull.toUpperCase()}</div>
          <h1 class="page-title">
            {area.name} 치과,<br/>
            <em class="ph-mint-3">{CLINIC.name}</em>
          </h1>
          <p class="page-lead">
            {area.intro}
          </p>
        </div>
      </section>

      {/* 교통/거리 안내 */}
      <section class="section section-soft">
        <div class="container">
          <h2 class="section-title">{area.name}에서 오시는 길</h2>
          <div class="area-transport-grid">
            <div class="area-transport-card" data-reveal>
              <div class="icon"><i class="fas fa-route"></i></div>
              <div class="label">거리</div>
              <div class="value">{area.distance}</div>
            </div>
            <div class="area-transport-card" data-reveal data-reveal-delay="1">
              <div class="icon"><i class="fas fa-subway"></i></div>
              <div class="label">교통편</div>
              <div class="value">{area.transport}</div>
            </div>
            <div class="area-transport-card" data-reveal data-reveal-delay="2">
              <div class="icon"><i class="fas fa-map-marker-alt"></i></div>
              <div class="label">주소</div>
              <div class="value">{CLINIC.address}</div>
            </div>
          </div>
          <div style="margin-top:32px; text-align:center;">
            <a href="/visit" class="btn btn-dark">상세 길찾기 · 주차 안내 →</a>
          </div>
        </div>
      </section>

      {/* 진료별 안내 — 지역×진료 페이지로 링크 */}
      <section class="section">
        <div class="container">
          <h2 class="section-title">{area.name} 거주자분께 추천하는 진료</h2>
          <p style="text-align:center; color:var(--ink-500); margin-bottom:40px;">
            아래 진료별 상세 페이지에서 {area.name}에서 ${CLINIC.name}을(를) 선택하시는 이유를 자세히 안내드립니다.
          </p>
          <div class="area-treatment-grid">
            {treatments.map((t) => (
              <a href={`/areas/${area.slug}/${t.slug}`} class="area-treatment-card" data-reveal>
                <div class="area-treatment-head">
                  <div class="area-treatment-tag">{t.isCore ? '★ 핵심진료' : '진료'}</div>
                  <h3>{area.name} {t.name}</h3>
                </div>
                <p>{t.tagline}</p>
                <div class="area-treatment-cta">
                  {area.name} {t.name} 자세히 →
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        eyebrow={`CONTACT · ${area.name} 환자분 상담`}
        title={`${area.name}에서 가장 가까운 정직한 진료.`}
        lead={`${area.name}에서 ${CLINIC.name}까지 ${area.distance}. CBCT 3D 진단 포함 무료 상담으로 정직하게 안내드립니다.`}
      />
    </Layout>
  )
}

// ============================================================
// /areas/:region/:treatment — 지역×진료 랜딩 페이지 (64개)
// ============================================================
export const AreaTreatmentPage = ({ area, treatment }: { area: AreaInfo; treatment: TreatmentDetail }) => {
  const local = TREATMENT_LOCAL[treatment.slug]
  if (!local) return null

  const title = `${area.name} ${treatment.name}`
  const description = `${area.name}에서 ${treatment.name} — ${CLINIC.name} (부평역 26번 출구 도보 1분). ${treatment.metaDescription.slice(0, 100)}`
  const url = `${BASE}/areas/${area.slug}/${treatment.slug}`
  const angle = local.localAngle(area.name)
  const bullets = local.whyHereBullets(area.name)
  const localFaqs = local.localFaqs(area.name)

  // 같은 지역의 다른 진료 (cross-link)
  const otherTreatments = Object.keys(TREATMENT_LOCAL)
    .filter(s => s !== treatment.slug)
    .map(s => TREATMENT_LIST.find(t => t.slug === s))
    .filter(Boolean) as TreatmentDetail[]

  // 다른 지역의 같은 진료 (cross-link)
  const otherAreas = AREAS.filter(a => a.slug !== area.slug)

  return (
    <Layout
      title={`${area.name} ${treatment.name}`}
      description={description}
      canonical={url}
      keywords={[
        `${area.name} ${treatment.name}`,
        `${area.name} 치과`,
        `${area.district} ${treatment.name}`,
        treatment.keywords,
      ].filter(Boolean).join(', ')}
      ogImage={OG_IMAGES.home}
      ogType="article"
      articleMeta={{
        publishedTime: '2026-05-14T00:00:00+09:00',
        modifiedTime: new Date().toISOString(),
        author: CLINIC.representative,
        section: `${area.name} ${treatment.name}`,
        tags: [`${area.name} ${treatment.name}`, `${area.name} 치과`, treatment.name, `${area.district} 치과`],
      }}
      jsonLd={[
        breadcrumbSchema([
          { name: '홈', url: '/' },
          { name: '지역별 안내', url: '/areas' },
          { name: `${area.name} 치과`, url: `/areas/${area.slug}` },
          { name: `${area.name} ${treatment.name}`, url: `/areas/${area.slug}/${treatment.slug}` },
        ]),
        // MedicalBusiness — 지역 특화
        {
          '@context': 'https://schema.org',
          '@type': ['Dentist', 'MedicalBusiness'],
          '@id': `${url}#business`,
          name: `${CLINIC.name} - ${area.name} ${treatment.name}`,
          description,
          url,
          telephone: CLINIC.phone,
          image: `${BASE}${OG_IMAGES.home}`,
          logo: `${BASE}/media/brand/mark-256.png`,
          priceRange: '₩₩',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '부평대로 16 에이플러스에셋빌딩',
            addressLocality: '부평구',
            addressRegion: '인천광역시',
            postalCode: '21315',
            addressCountry: 'KR',
          },
          geo: area.geo ? {
            '@type': 'GeoCoordinates',
            latitude: area.geo.lat,
            longitude: area.geo.lng,
          } : undefined,
          areaServed: {
            '@type': 'Place',
            name: area.nameFull,
          },
        },
        // Service / MedicalProcedure
        {
          ...serviceSchema({
            name: `${area.name} ${treatment.name}`,
            nameEn: treatment.nameEn,
            description: angle,
            slug: treatment.slug,
            category: 'Dentistry',
          }),
          '@id': `${url}#procedure`,
          areaServed: { '@type': 'Place', name: area.nameFull },
        },
        // FAQPage
        faqSchema([
          ...localFaqs,
          ...(treatment.faqs?.slice(0, 3) ?? []),
        ]),
      ]}
    >
      <section class="page-hero area-treatment-hero">
        <div class="container">
          <div class="page-eyebrow">{area.nameFull.toUpperCase()} · {treatment.name.toUpperCase()}</div>
          <h1 class="page-title">
            {area.name}에서 {treatment.name},<br/>
            <em class="ph-mint-3">{CLINIC.name}</em>
          </h1>
          <p class="page-lead">{angle}</p>
          <div style="margin-top:24px; display:flex; gap:10px; flex-wrap:wrap;">
            <a href="tel:032-529-2875" class="btn btn-primary"><i class="fas fa-phone"></i> 전화 상담</a>
            <a href={CLINIC.socialLinks.naverBooking} target="_blank" rel="noopener" class="btn btn-dark">네이버 예약</a>
          </div>
        </div>
      </section>

      {/* 왜 이 지역에서 우리 치과인가 */}
      <section class="section section-soft">
        <div class="container">
          <h2 class="section-title">왜 {area.name}에서 {CLINIC.name}인가?</h2>
          <div class="why-here-grid">
            {bullets.map((b, idx) => (
              <div class="why-here-card" data-reveal data-reveal-delay={String(idx)}>
                <div class="why-here-num">0{idx + 1}</div>
                <p>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 진료 정보 (treatments.ts에서 가져옴) */}
      <section class="section">
        <div class="container">
          <h2 class="section-title">{treatment.name} 진료 안내</h2>
          <p style="text-align:center; color:var(--ink-500); margin-bottom:32px; max-width:720px; margin-left:auto; margin-right:auto;">{treatment.heroSub}</p>

          {treatment.whyUs?.length > 0 && (
            <div class="treatment-feature-grid">
              {treatment.whyUs.slice(0, 4).map((w) => (
                <div class="treatment-feature-card" data-reveal>
                  <div class="treatment-feature-icon"><i class={w.icon}></i></div>
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                </div>
              ))}
            </div>
          )}

          <div style="margin-top:40px; text-align:center;">
            <a href={`/treatments/${treatment.slug}`} class="btn btn-dark">{treatment.name} 진료 전체 보기 →</a>
          </div>
        </div>
      </section>

      {/* 교통/거리 — 지역 특화 */}
      <section class="section section-soft">
        <div class="container">
          <h2 class="section-title">{area.name}에서 오시는 길</h2>
          <div class="area-transport-grid">
            <div class="area-transport-card">
              <div class="icon"><i class="fas fa-route"></i></div>
              <div class="label">거리</div>
              <div class="value">{area.distance}</div>
            </div>
            <div class="area-transport-card">
              <div class="icon"><i class="fas fa-subway"></i></div>
              <div class="label">교통편</div>
              <div class="value">{area.transport}</div>
            </div>
            <div class="area-transport-card">
              <div class="icon"><i class="fas fa-clock"></i></div>
              <div class="label">진료 시간</div>
              <div class="value">평일 10~20시 · 토 09:30~13:30</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — 지역 환자분 자주 묻는 질문 */}
      <section class="section">
        <div class="container" style="max-width:820px;">
          <h2 class="section-title">{area.name} {treatment.name} 자주 묻는 질문</h2>
          <div class="faq-accordion">
            {localFaqs.map((f, idx) => (
              <details class="faq-item" {...(idx === 0 ? { open: true } : {})}>
                <summary>{f.q}</summary>
                <div class="faq-answer">{f.a}</div>
              </details>
            ))}
            {(treatment.faqs ?? []).slice(0, 3).map((f) => (
              <details class="faq-item">
                <summary>{f.q}</summary>
                <div class="faq-answer">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 같은 지역의 다른 진료 */}
      <section class="section section-soft">
        <div class="container">
          <h2 class="section-title">{area.name}에서 받을 수 있는 다른 진료</h2>
          <div class="area-cross-grid">
            {otherTreatments.slice(0, 6).map((t) => (
              <a href={`/areas/${area.slug}/${t.slug}`} class="area-cross-card" data-reveal>
                <span>{area.name} {t.name}</span>
                <i class="fas fa-arrow-right"></i>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 다른 지역의 같은 진료 */}
      <section class="section">
        <div class="container">
          <h2 class="section-title">다른 지역에서 {treatment.name} 안내</h2>
          <div class="area-cross-grid">
            {otherAreas.slice(0, 7).map((a) => (
              <a href={`/areas/${a.slug}/${treatment.slug}`} class="area-cross-card" data-reveal>
                <span>{a.name} {treatment.name}</span>
                <i class="fas fa-arrow-right"></i>
              </a>
            ))}
            <a href="/areas" class="area-cross-card" data-reveal>
              <span><strong>모든 지역 보기</strong></span>
              <i class="fas fa-th"></i>
            </a>
          </div>
        </div>
      </section>

      <InlineCta
        title={`${area.name}에서 ${treatment.name}, 직접 상담받아보세요`}
        lead={`${area.name}에서 부평역까지 ${area.distance}. CBCT 3D 진단 포함 무료 상담으로 정직하게 안내드립니다.`}
        backLabel={`${area.name} 진료 안내로`}
        backHref={`/areas/${area.slug}`}
        extraLabel={`${treatment.name} 전체 보기`}
        extraHref={`/treatments/${treatment.slug}`}
      />

      <CtaSection
        eyebrow={`CONTACT · ${area.name} ${treatment.name}`}
        title={`${area.name}에서 ${treatment.name}, ${CLINIC.name}.`}
        lead={`${area.distance}. 14년 한 자리에서, 변하지 않는 진료 퀄리티.`}
      />
    </Layout>
  )
}
