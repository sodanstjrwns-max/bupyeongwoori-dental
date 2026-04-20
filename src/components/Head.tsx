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

export const Head = (props: HeadProps) => {
  const title = props.title
    ? `${props.title} | ${CLINIC.name}`
    : SEO_DEFAULT.title
  const description = props.description ?? SEO_DEFAULT.description
  const keywords = props.keywords ?? SEO_DEFAULT.keywords
  const ogImage = props.ogImage ?? SEO_DEFAULT.ogImage
  const canonical = props.canonical ?? ''

  const jsonLds = Array.isArray(props.jsonLd) ? props.jsonLd : props.jsonLd ? [props.jsonLd] : []

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="theme-color" content="#0ABAB5" />
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
      <meta property="og:locale" content="ko_KR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Icons (placeholders - favicon을 public/static에 배치) */}
      <link rel="icon" href="/static/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/static/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.webmanifest" />

      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Bodoni+Moda:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Serif+KR:wght@300;400;500;600&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
      />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css" />
      <link rel="stylesheet" href="/static/style.css" />

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
