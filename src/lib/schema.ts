// ============================================================
// JSON-LD Schema builders (SEO/AEO)
// ============================================================
import { CLINIC, CORE_TREATMENTS, OTHER_TREATMENTS } from './constants'

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
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '10:00', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Tuesday', opens: '10:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '10:00', closes: '21:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '10:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '10:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:30', closes: '13:30' },
  ],
  sameAs: Object.values(CLINIC.socialLinks).filter(Boolean),
  medicalSpecialty: 'Dentistry',
  availableService: [
    ...CORE_TREATMENTS.map((t) => ({
      '@type': 'MedicalProcedure',
      name: t.name,
      alternateName: t.nameEn,
      url: `https://${CLINIC.domain}/treatments/${t.slug}`,
    })),
    ...OTHER_TREATMENTS.map((t) => ({
      '@type': 'MedicalProcedure',
      name: t.name,
      alternateName: t.nameEn,
      url: `https://${CLINIC.domain}/treatments/${t.slug}`,
    })),
  ],
})

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: CLINIC.name,
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
  lastReviewed?: string
  /** 페이지가 다루는 의학 주제 (예: '임플란트') */
  about?: string
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
    ...(opts.about ? { about: { '@type': 'MedicalEntity', name: opts.about } } : {}),
    lastReviewed: opts.lastReviewed ?? new Date().toISOString().slice(0, 10),
    reviewedBy: {
      '@type': 'Physician',
      '@id': `https://${CLINIC.domain}/doctors/${reviewer.slug}#person`,
      name: reviewer.name,
      jobTitle: reviewer.title,
      url: `https://${CLINIC.domain}/doctors/${reviewer.slug}`,
      medicalSpecialty: 'Dentistry',
      worksFor: { '@type': 'Dentist', '@id': `https://${CLINIC.domain}/#clinic`, name: CLINIC.name },
    },
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
}) => ({
  '@context': 'https://schema.org',
  '@type': 'MedicalProcedure',
  name: s.name,
  alternateName: s.nameEn,
  description: s.description,
  url: `https://${CLINIC.domain}/treatments/${s.slug}`,
  procedureType: 'https://schema.org/TherapeuticProcedure',
  category: s.category ?? 'Dentistry',
  bodyLocation: '구강',
  followup: '정기검진 및 유지관리 권장',
  provider: {
    '@type': 'Dentist',
    '@id': `https://${CLINIC.domain}/#clinic`,
    name: CLINIC.name,
    url: `https://${CLINIC.domain}/`,
  },
})

// ============================================================
// Phase 2-3: AggregateRating — 실제 네이버 플레이스 리뷰 기반
// ⚠️ 정직성 원칙: 가짜 별점 절대 X — 실제 리뷰 수치만 사용
// 네이버 플레이스 https://naver.me/xMj67GgD 의 실제 리뷰 수를 확인 후 입력
// ============================================================
const REAL_REVIEW_DATA = {
  ratingValue: 4.9,        // ⚠️ 실제 네이버 플레이스 평점으로 업데이트 필요
  reviewCount: 0,          // ⚠️ 실제 리뷰 수로 업데이트 필요 (0이면 스키마 비활성)
  bestRating: 5,
  worstRating: 1,
}

/**
 * Dentist + AggregateRating 스키마
 * ⚠️ reviewCount가 0이면 null 반환 → 가짜 별점 방지
 * 실제 리뷰 수치 확정 후 REAL_REVIEW_DATA 업데이트하면 자동 활성화
 */
export const dentistAggregateRatingSchema = () => {
  // 정직성 가드: 실제 리뷰 수가 입력 안 된 상태면 스키마 생성 안 함
  if (!REAL_REVIEW_DATA.reviewCount || REAL_REVIEW_DATA.reviewCount < 1) {
    return null
  }
  return {
  '@context': 'https://schema.org',
  '@type': 'Dentist',
  '@id': `https://${CLINIC.domain}/#clinic-rating`,
  name: CLINIC.name,
  url: `https://${CLINIC.domain}/`,
  image: `https://${CLINIC.domain}/static/og/og-default.png?v=20260430m`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '부평대로 16 에이플러스에셋빌딩',
    addressLocality: '부평구',
    addressRegion: '인천광역시',
    postalCode: '21315',
    addressCountry: 'KR',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: REAL_REVIEW_DATA.ratingValue,
    reviewCount: REAL_REVIEW_DATA.reviewCount,
    bestRating: REAL_REVIEW_DATA.bestRating,
    worstRating: REAL_REVIEW_DATA.worstRating,
  },
  }
}

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
