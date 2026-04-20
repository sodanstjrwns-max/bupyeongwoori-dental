import type { PropsWithChildren } from 'hono/jsx'
import { Head, type HeadProps } from './Head'
import { Nav } from './Nav'
import { Footer } from './Footer'

export type LayoutProps = PropsWithChildren<
  HeadProps & {
    heroDark?: boolean // 페이지 최상단이 어두운 히어로인 경우 nav를 dark 모드로
    hideFooter?: boolean
  }
>

export const Layout = ({ children, heroDark, hideFooter, ...head }: LayoutProps) => {
  return (
    <html lang="ko">
      <head>
        <Head {...head} />
      </head>
      <body>
        <a href="#main" class="sr-only">본문으로 바로가기</a>
        <Nav onDark={!!heroDark} />
        <main id="main">{children}</main>
        {!hideFooter && <Footer />}
        <script src="/static/app.js" defer></script>
      </body>
    </html>
  )
}
