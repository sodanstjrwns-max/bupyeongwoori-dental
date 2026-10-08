/**
 * "부평 치과" 허브(/areas/bupyeong-gu)로 보내는 내부 링크 (2026-10-08 허브 내부 링크 몰아주기)
 *
 * - 앵커 텍스트는 대표 키워드 "부평 치과" 그대로, nofollow 없음.
 * - 한 페이지에 허브 링크는 최대 2개(전역 푸터 1 + 본문 1). 허브 자신에는 넣지 않는다.
 * - 블로그 끝 문장은 slug 해시로 4개 문형 중 하나를 고정 선택 (글마다 같은 문장 반복 방지).
 * - 문장 속 사실(부평역 26번 출구, 야간·토요일 진료, 의료진)은 lib/constants.ts·허브 본문에 이미 있는 값만.
 */
import { CLINIC } from './constants'

export const HUB_PATH = '/areas/bupyeong-gu'
export const HUB_ANCHOR = '부평 치과'

export function slugHash(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  return h
}

const BLOG_LINES: [string, string][] = [
  [`${CLINIC.name}는 `, '를 찾는 부평동·부평구 주민분들께 진료시간과 찾아오는 길을 한 페이지로 정리해 안내합니다.'],
  ['글을 읽고 상담이 필요하다고 느끼셨다면, ', ' 안내에서 부평역 26번 출구 기준 위치와 요일별 진료시간을 먼저 확인해 보세요.'],
  ['퇴근 뒤 야간 진료나 토요일 진료 가능 시간은 ', ' 안내 페이지에 요일별로 모아 두었습니다.'],
  ['부평역 근처에서 다니기 편한 ', `를 알아보고 계시다면 ${CLINIC.name}의 의료진과 주요 진료를 함께 살펴보세요.`],
]

const linkStyle = 'font-weight:700; color:var(--brand-700, #1d7a78); border-bottom:1px solid currentColor;'

export const HubLink = ({ style }: { style?: string }) => <a href={HUB_PATH} style={style ?? linkStyle}>{HUB_ANCHOR}</a>

/** 블로그 본문 끝(글쓴이 박스 위) 지역 안내 1문장 */
export const BlogHubLine = ({ slug }: { slug: string }) => {
  const [pre, post] = BLOG_LINES[slugHash(slug || '') % BLOG_LINES.length]
  return (
    <p class="hub-local-line" style="margin:40px 0 0; padding:16px 20px; background:var(--ink-50, #f4f7f7); border-left:3px solid var(--brand-500, #6DBBB9); border-radius:0 12px 12px 0; line-height:1.75; font-size:0.95rem;">
      {pre}<HubLink />{post}
    </p>
  )
}

/** HTML 에 이미 허브 링크가 있는지 (있으면 문장 블록 생략 → 페이지당 2개 이하) */
export function htmlHasHubLink(html: string): boolean {
  return /href=["'](?:https?:\/\/(?:www\.)?wooridc\.kr)?\/areas\/bupyeong-gu\/?["'#?]/i.test(html || '')
}
