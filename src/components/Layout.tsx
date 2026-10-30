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
    immersive?: boolean // 메인 스크롤 몰입 연출(홈만)
  }
>

export const Layout = ({ children, heroDark, hideFooter, hideFloatingCta, user, immersive, ...head }: LayoutProps) => {
  return (
    <html lang="ko">
      <head>
        <Head {...head} />
        {immersive && <link rel="stylesheet" href="/static/immersive.css?v=4d724a4c3f" />}
      </head>
      <body>
        <a href="#main" class="sr-only">본문으로 바로가기</a>
        <Nav onDark={!!heroDark} user={user ?? null} />
        <main id="main">{children}</main>
        {!hideFooter && <Footer canonical={head.canonical} />}
        {!hideFloatingCta && <FloatingCta />}
        <script src="/static/app.js?v=20261031c" defer></script>
        {immersive && <>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
          <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" defer></script>
          <script src="/static/immersive.js?v=700b16e39b" defer></script>
        </>}
      </body>
    </html>
  )
}
