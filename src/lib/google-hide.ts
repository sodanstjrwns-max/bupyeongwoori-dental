// ============================================================
// 구글 전용 검색 제외 (2026-11-10)
//
// 배경: 방문의 대부분은 네이버에서 백과(용어) 페이지로 들어온다. 반면 구글은 대량 생성 구역을
//       사이트 단위로 낮게 평가하므로, 백과 구역을 **구글에만** 검색 제외해
//       구글이 보는 사이트를 병원 핵심 페이지(진료·의료진·지역·안내)로 줄인다.
//
// 방식: 요청 User-Agent 가 구글 크롤러(Googlebot, Google-InspectionTool)이고
//       경로가 아래 대상 구역이며 응답이 200 HTML 일 때만
//       응답 헤더 `X-Robots-Tag: googlebot: noindex` 를 붙인다.
//       그 밖의 요청(네이버 Yeti, Bing, 일반 브라우저, AI 봇)은 헤더·본문이 전혀 달라지지 않는다.
//       HTML 메타 태그, robots.txt, sitemap, canonical, 본문, 스키마는 건드리지 않는다.
//       이 사이트는 HTML 응답을 캐시에 저장하지 않으므로(매 요청 SSR) 다른 방문자에게 헤더가 새지 않는다.
//
// 범위: 백과만 — /glossary (목록, ?category·?q 포함), /glossary/<용어>.
//       지역(/areas)·진료·의료진·블로그·공지 등 다른 구역은 대상이 아니다.
//
// 되돌리기: isGoogleHiddenPath 가 항상 false 를 돌려주게 하면 끝.
// ============================================================

/** 구글 검색 크롤러인가 — Google-Extended·GoogleOther·AdsBot·Mediapartners 는 대상이 아니다 */
export function isGoogleCrawler(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false
  return /googlebot|google-inspectiontool/i.test(userAgent)
}

/** 구글에만 검색 제외할 경로인가 (백과 구역). 되돌리려면 `return false` 한 줄로 바꾼다. */
export function isGoogleHiddenPath(pathname: string): boolean {
  return pathname === '/glossary' || pathname.startsWith('/glossary/')
}

export const GOOGLE_HIDE_HEADER_VALUE = 'googlebot: noindex'
