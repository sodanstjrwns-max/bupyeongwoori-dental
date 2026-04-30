import type { PropsWithChildren } from 'hono/jsx'
import { Head, type HeadProps } from './Head'
import { Nav, type NavUser } from './Nav'
import { Footer } from './Footer'
import { FloatingCta } from './FloatingCta'

export type LayoutProps = PropsWithChildren<
  HeadProps & {
    heroDark?: boolean // 페이지 최상단이 어두운 히어로인 경우 nav를 dark 모드로
    hideFooter?: boolean
    hideFloatingCta?: boolean // 관리자/로그인 등 일부 페이지에서 비활성화
    user?: NavUser
  }
>

export const Layout = ({ children, heroDark, hideFooter, hideFloatingCta, user, ...head }: LayoutProps) => {
  return (
    <html lang="ko">
      <head>
        <Head {...head} />
      </head>
      <body>
        <a href="#main" class="sr-only">본문으로 바로가기</a>
        <Nav onDark={!!heroDark} user={user ?? null} />
        <main id="main">{children}</main>
        {!hideFooter && <Footer />}
        {!hideFloatingCta && <FloatingCta />}
        <script src="/static/app.js?v=20260429b" defer></script>
      </body>
    </html>
  )
}
