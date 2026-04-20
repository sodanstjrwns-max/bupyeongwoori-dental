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
  image: `https://${CLINIC.domain}/static/og-default.jpg`,
  logo: `https://${CLINIC.domain}/static/logo.png`,
  priceRange: '₩₩',
  foundingDate: String(CLINIC.since),
  address: {
    '@type': 'PostalAddress',
    streetAddress: '부평대로 16 에이플러스에셋빌딩 5층, 7층',
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
  datePublished: string
  dateModified?: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: opts.title,
  description: opts.description,
  image: opts.image ?? `https://${CLINIC.domain}/static/og-default.jpg`,
  datePublished: opts.datePublished,
  dateModified: opts.dateModified ?? opts.datePublished,
  author: { '@type': 'Person', name: opts.author ?? CLINIC.representative },
  publisher: {
    '@type': 'Organization',
    name: CLINIC.name,
    logo: { '@type': 'ImageObject', url: `https://${CLINIC.domain}/static/logo.png` },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url },
})

export const doctorSchema = (d: {
  name: string
  title: string
  slug: string
  education?: string[]
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Physician',
  name: d.name,
  jobTitle: d.title,
  url: `https://${CLINIC.domain}/doctors/${d.slug}`,
  worksFor: { '@type': 'Dentist', name: CLINIC.name },
  alumniOf: (d.education ?? []).map((e) => ({
    '@type': 'EducationalOrganization',
    name: e,
  })),
})
