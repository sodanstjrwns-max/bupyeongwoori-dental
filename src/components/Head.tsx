import { CLINIC, SEO_DEFAULT } from '../lib/constants'

export type HeadProps = {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  canonical?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  noindex?: boolean
}

// SNS 크롤러(Facebook/Kakao/Naver)는 상대경로를 못 읽기 때문에 절대 URL로 변환
function toAbsoluteUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = `https://${CLINIC.domain}`
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`
}

export const Head = (props: HeadProps) => {
  const title = props.title
    ? `${props.title} | ${CLINIC.name}`
    : SEO_DEFAULT.title
  const description = props.description ?? SEO_DEFAULT.description
  const keywords = props.keywords ?? SEO_DEFAULT.keywords
  const ogImage = toAbsoluteUrl(props.ogImage ?? SEO_DEFAULT.ogImage)
  const canonical = props.canonical ?? ''

  const jsonLds = Array.isArray(props.jsonLd) ? props.jsonLd : props.jsonLd ? [props.jsonLd] : []

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="theme-color" content="#6DBBB9" />

      {/* Search Console Verification */}
      <meta name="google-site-verification" content="Fg6QZAkw-0h_r3Uh0r2PT5_mmyfc10ZZKV1Eu9gEZYU" />
      <meta name="naver-site-verification" content="0684e6a6e84fd7041c19b72c18d1f17176a3c6ed" />

      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {props.noindex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
      )}
      {canonical ? <link rel="canonical" href={canonical} /> : null}

      {/* OpenGraph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={CLINIC.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content="ko_KR" />
      {canonical ? <meta property="og:url" content={canonical} /> : null}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Icons - 로고 마크와 통일된 디자인 (민트 꽃잎) */}
      <link rel="icon" href="/static/favicon.svg?v=20260430g" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/static/apple-touch-icon.png?v=20260430g" />
      <link rel="manifest" href="/manifest.webmanifest" />

      {/* Fonts — 비디치과(bdbddc.com)와 완전히 동일: Pretendard static 단독 */}
      <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
      />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" />
      <link rel="stylesheet" href="/static/style.css?v=20260430k" />

      {/* Structured data */}
      {jsonLds.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          // @ts-ignore
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
    </>
  )
}
