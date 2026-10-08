// ============================================================
// JSON-LD Schema builders (SEO/AEO)
// ============================================================
import { CLINIC, CORE_TREATMENTS, OTHER_TREATMENTS, HOURS } from './constants'
import { CONTENT_DATES } from './content-dates'
import { AREAS } from '../data/areas'

export const dentistSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Dentist',
  '@id': `https://${CLINIC.domain}/#clinic`,
  name: CLINIC.name,
  alternateName: CLINIC.nameEn,
  description: CLINIC.mission,
  url: `https://${CLINIC.domain}/`,
  telephone: CLINIC.phone,
  email: CLINIC.email,
  image: `https://${CLINIC.domain}/static/og/og-default.png?v=20260430m`,
  logo: `https://${CLINIC.domain}/media/brand/mark-256.png`,
  priceRange: '₩₩',
  foundingDate: String(CLINIC.since),
  address: {
    '@type': 'PostalAddress',
    streetAddress: '부평대로 16 에이플러스에셋빌딩',
    addressLocality: '부평구',
    addressRegion: '인천광역시',
    postalCode: '21315',
    addressCountry: 'KR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 37.4894,
    longitude: 126.7245,
  },
  // 진료시간 단일 출처(constants.ts HOURS)에서 파생 — 방문 안내 표·llms.txt 와 항상 동일
  openingHoursSpecification: HOURS.filter((h) => h.opens).map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.en,
    opens: h.opens,
    closes: h.closes,
  })),
  sameAs: Object.values(CLINIC.socialLinks).filter(Boolean),
  medicalSpecialty: 'Dentistry',
  // 월드클래스 LocalBusiness 시그널 — 지도/서비스권/연락채널/예약액션/시설
  hasMap: CLINIC.socialLinks.naverPlace,
  areaServed: AREAS.map((a) => ({
    '@type': 'Place',
    name: a.nameFull,
    ...(a.geo ? { geo: { '@type': 'GeoCoordinates', latitude: a.geo.lat, longitude: a.geo.lng } } : {}),
  })),
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: CLINIC.phone,
      contactType: 'reservations',
      availableLanguage: ['Korean'],
      areaServed: 'KR',
    },
    {
      '@type': 'ContactPoint',
      url: CLINIC.socialLinks.kakao,
      contactType: 'customer service',
      name: '카카오톡 상담',
      availableLanguage: ['Korean'],
    },
  ],
  potentialAction: {
    '@type': 'ReserveAction',
    name: '네이버 예약',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: CLINIC.socialLinks.naverBooking,
      actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'],
    },
    result: { '@type': 'Reservation', name: '치과 진료 예약' },
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: '주차 가능', value: true },
    { '@type': 'LocationFeatureSpecification', name: '부평역 26번 출구 도보 1분', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'CBCT 3D 정밀진단 (2대)', value: true },
    { '@type': 'LocationFeatureSpecification', name: '칼짜이스 미세현미경 Extaro 300', value: true },
    { '@type': 'LocationFeatureSpecification', name: '1인 1핸드피스 감염관리', value: true },
  ],
  knowsLanguage: 'ko',
  currenciesAccepted: 'KRW',
  paymentAccepted: '현금, 카드, 계좌이체',
  availableService: [
    ...CORE_TREATMENTS.map((t) => ({
      '@type': 'MedicalProcedure',
      '@id': `https://${CLINIC.domain}/treatments/${t.slug}#procedure`,
      name: t.name,
      alternateName: t.nameEn,
      url: `https://${CLINIC.domain}/treatments/${t.slug}`,
    })),
    ...OTHER_TREATMENTS.map((t) => ({
      '@type': 'MedicalProcedure',
      '@id': `https://${CLINIC.domain}/treatments/${t.slug}#procedure`,
      name: t.name,
      alternateName: t.nameEn,
      url: `https://${CLINIC.domain}/treatments/${t.slug}`,
    })),
  ],
})

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `https://${CLINIC.domain}/#website`,
  name: CLINIC.name,
  publisher: { '@id': `https://${CLINIC.domain}/#clinic` },
  url: `https://${CLINIC.domain}/`,
  inLanguage: 'ko-KR',
  potentialAction: {
    '@type': 'SearchAction',
    target: `https://${CLINIC.domain}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
})

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: it.name,
    item: it.url.startsWith('http') ? it.url : `https://${CLINIC.domain}${it.url}`,
  })),
})

export const faqSchema = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
})

export const articleSchema = (opts: {
  title: string
  description: string
  url: string
  image?: string
  author?: string
  authorSlug?: string
  datePublished: string
  dateModified?: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: opts.title,
  description: opts.description,
  image: opts.image ?? `https://${CLINIC.domain}/static/og/og-default.png?v=20260430m`,
  datePublished: opts.datePublished,
  dateModified: opts.dateModified ?? opts.datePublished,
  author: opts.authorSlug
    ? {
        '@type': 'Person',
        '@id': `https://${CLINIC.domain}/doctors/${opts.authorSlug}#person`,
        name: opts.author ?? CLINIC.representative,
        url: `https://${CLINIC.domain}/doctors/${opts.authorSlug}`,
      }
    : { '@type': 'Person', name: opts.author ?? CLINIC.representative },
  publisher: {
    '@type': 'Organization',
    '@id': `https://${CLINIC.domain}/#clinic`,
    name: CLINIC.name,
    logo: { '@type': 'ImageObject', url: `https://${CLINIC.domain}/media/brand/mark-256.png` },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url },
})

export const doctorSchema = (d: {
  name: string
  title: string
  slug: string
  education?: string[]
  specialties?: string[]
  photo?: string | null
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Physician',
  '@id': `https://${CLINIC.domain}/doctors/${d.slug}#person`,
  name: d.name,
  jobTitle: d.title,
  url: `https://${CLINIC.domain}/doctors/${d.slug}`,
  ...(d.photo ? { image: d.photo.startsWith('http') ? d.photo : `https://${CLINIC.domain}${d.photo}` } : {}),
  medicalSpecialty: 'Dentistry',
  ...(d.specialties && d.specialties.length > 0 ? { knowsAbout: d.specialties } : {}),
  worksFor: { '@type': 'Dentist', '@id': `https://${CLINIC.domain}/#clinic`, name: CLINIC.name },
  alumniOf: (d.education ?? []).map((e) => ({
    '@type': 'EducationalOrganization',
    name: e,
  })),
})

/**
 * MedicalWebPage — E-E-A-T 핵심 스키마
 * 의료 콘텐츠임을 명시하고, 검수자(reviewedBy)를 Physician으로 연결.
 * 진료 상세/용어집/블로그 등 모든 의료 정보 페이지에 적용.
 */
export const medicalWebPageSchema = (opts: {
  url: string
  name: string
  description: string
  /** 검수 의료진 — 없으면 대표원장 기본값 */
  reviewer?: { name: string; title: string; slug: string }
  /** true 면 reviewedBy 생략 — 원장 검토 기록이 없는 페이지(백과사전 용어 등). 2026-10-08 */
  noReviewer?: boolean
  lastReviewed?: string
  /** 페이지가 다루는 의학 주제 (예: '임플란트') */
  about?: string
  /** about 을 이 @id 의 MedicalProcedure 로 연결 (진료 상세) */
  aboutId?: string
  speakableSelectors?: string[]
}) => {
  const reviewer = opts.reviewer ?? { name: CLINIC.representative, title: '대표원장', slug: 'kim-jaein' }
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    '@id': `${opts.url}#webpage`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    inLanguage: 'ko-KR',
    medicalAudience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
    ...(opts.aboutId
      ? { about: { '@type': 'MedicalProcedure', '@id': opts.aboutId, name: opts.about } }
      : opts.about
        ? { about: { '@type': 'MedicalEntity', name: opts.about } }
        : {}),
    // 고정 날짜만 — 값이 없으면 생략 (오늘 날짜 자동 생성 금지)
    ...(opts.lastReviewed ? { lastReviewed: opts.lastReviewed } : {}),
    isPartOf: { '@type': 'WebSite', '@id': `https://${CLINIC.domain}/#website`, name: CLINIC.name, url: `https://${CLINIC.domain}/` },
    ...(opts.noReviewer
      ? {}
      : {
          reviewedBy: {
            '@type': 'Physician',
            '@id': `https://${CLINIC.domain}/doctors/${reviewer.slug}#person`,
            name: reviewer.name,
            jobTitle: reviewer.title,
            url: `https://${CLINIC.domain}/doctors/${reviewer.slug}`,
            medicalSpecialty: 'Dentistry',
            worksFor: { '@type': 'Dentist', '@id': `https://${CLINIC.domain}/#clinic`, name: CLINIC.name },
          },
        }),
    publisher: { '@type': 'Organization', '@id': `https://${CLINIC.domain}/#clinic`, name: CLINIC.name },
    ...(opts.speakableSelectors && opts.speakableSelectors.length > 0
      ? { speakable: { '@type': 'SpeakableSpecification', cssSelector: opts.speakableSelectors } }
      : {}),
  }
}

// Service 스키마 — 시술 페이지용 (LocalBusiness 연결)
export const serviceSchema = (s: {
  name: string
  nameEn?: string
  description: string
  slug: string
  category?: string
  /** 치료 과정 스텝 — howPerformed로 주입 (AI 답변엔진이 '치료 과정' 질문에 인용) */
  steps?: { step: string; title: string; desc: string }[]
  /** 사용 장비 — 전문성 시그널 */
  devices?: string[]
}) => ({
  '@context': 'https://schema.org',
  '@type': 'MedicalProcedure',
  '@id': `https://${CLINIC.domain}/treatments/${s.slug}#procedure`,
  name: s.name,
  alternateName: s.nameEn,
  description: s.description,
  url: `https://${CLINIC.domain}/treatments/${s.slug}`,
  procedureType: 'https://schema.org/TherapeuticProcedure',
  category: s.category ?? 'Dentistry',
  bodyLocation: '구강',
  followup: '정기검진 및 유지관리 권장',
  ...(s.steps && s.steps.length > 0
    ? {
        howPerformed: s.steps.map((p) => `${p.step}단계 ${p.title}: ${p.desc}`).join(' → '),
        // HowTo 병행 — 구조화된 스텝 (일부 검색엔진이 스텝 UI로 활용)
        step: s.steps.map((p, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: p.title,
          text: p.desc,
        })),
      }
    : {}),
  ...(s.devices && s.devices.length > 0 ? { device: s.devices.join(', ') } : {}),
  provider: {
    '@type': 'Dentist',
    '@id': `https://${CLINIC.domain}/#clinic`,
    name: CLINIC.name,
    url: `https://${CLINIC.domain}/`,
  },
})

/**
 * ProfilePage 스키마 — 의료진 상세 페이지용
 * 구글이 2024년부터 공식 지원하는 리치결과 타입 — 인물 검색 노출 강화
 */
export const profilePageSchema = (d: {
  name: string
  title: string
  slug: string
  dateModified?: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `https://${CLINIC.domain}/doctors/${d.slug}#profilepage`,
  url: `https://${CLINIC.domain}/doctors/${d.slug}`,
  name: `${d.title} ${d.name} | ${CLINIC.name}`,
  inLanguage: 'ko-KR',
  // 의료진 프로필 데이터의 고정 수정일 (오늘 날짜 자동 생성 금지)
  dateModified: d.dateModified ?? CONTENT_DATES.doctors,
  mainEntity: { '@id': `https://${CLINIC.domain}/doctors/${d.slug}#person` },
  isPartOf: { '@type': 'WebSite', '@id': `https://${CLINIC.domain}/#website`, name: CLINIC.name, url: `https://${CLINIC.domain}/` },
})

// AggregateRating/Review 스키마는 사용하지 않는다 (PFWE-SPEC §6 — 근거 없는 별점은 YMYL 수동조치 리스크).

/**
 * Phase 2-4: Speakable Specification 빌더
 * 음성 검색 대응 — 시리/구글 어시스턴트가 읽어줄 영역 지정
 */
export const speakableSpec = (selectors: string[]) => ({
  '@type': 'SpeakableSpecification',
  cssSelector: selectors,
})

// ItemList 스키마 — 블로그/공지/시술 리스트 페이지용
export const itemListSchema = (items: { name: string; url: string }[], listName?: string) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: listName,
  numberOfItems: items.length,
  itemListElement: items.map((it, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: it.name,
    url: it.url.startsWith('http') ? it.url : `https://${CLINIC.domain}${it.url}`,
  })),
})
