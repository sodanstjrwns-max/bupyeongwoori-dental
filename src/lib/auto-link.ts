// ============================================================
// Phase 3-5: 본문 자동 내부 링크 — 토픽 클러스터 권위 강화
// 블로그/BA/공지 본문에서 진료/지역 키워드 발견 시
// 자동으로 해당 페이지로 링크 → 검색엔진이 사이트 구조를 토픽으로 인식
//
// 원칙:
//   1. 같은 키워드는 첫 등장 1회만 링크 (스팸 방지)
//   2. 이미 <a> 안에 있는 텍스트는 절대 링크 추가 X
//   3. 헤딩/제목 안의 텍스트는 링크 추가 X (디자인 깨짐 방지)
//   4. HTML 안전 처리 — 태그 내부 속성값에는 영향 없도록
// ============================================================

type LinkMap = { keyword: string; href: string; title?: string }[]

// 진료 8종 + 지역 8개 = 16개 우선순위 키워드 (긴 것부터 매칭)
const DEFAULT_LINKS: LinkMap = [
  // 지역 (구체적인 것 먼저)
  { keyword: '부평역 26번 출구', href: '/visit', title: '오시는 길' },
  { keyword: '부평역', href: '/areas/bupyeong-station', title: '부평역 치과 안내' },
  { keyword: '부평구', href: '/areas/bupyeong-gu', title: '부평구 치과 안내' },
  { keyword: '부평동', href: '/areas/bupyeong-dong', title: '부평동 치과 안내' },
  { keyword: '십정동', href: '/areas/sipjeong-dong', title: '십정동 치과 안내' },
  { keyword: '산곡동', href: '/areas/sangok-dong', title: '산곡동 치과 안내' },
  { keyword: '부개동', href: '/areas/bugae-dong', title: '부개동 치과 안내' },
  { keyword: '삼산동', href: '/areas/samsan-dong', title: '삼산동 치과 안내' },
  { keyword: '갈산동', href: '/areas/galsan-dong', title: '갈산동 치과 안내' },
  // 진료 (긴 단어 먼저)
  { keyword: '인비절라인', href: '/treatments/clear-aligner', title: '투명교정 (인비절라인)' },
  { keyword: '투명교정', href: '/treatments/clear-aligner', title: '투명교정' },
  { keyword: '심미보철', href: '/treatments/esthetic', title: '심미보철' },
  { keyword: '일반보철', href: '/treatments/general-prosthesis', title: '일반보철' },
  { keyword: '라미네이트', href: '/treatments/laminate', title: '라미네이트' },
  { keyword: '글로우네이트', href: '/treatments/laminate', title: '라미네이트 (글로우네이트)' },
  { keyword: '사랑니발치', href: '/treatments/wisdom-tooth', title: '사랑니발치' },
  { keyword: '사랑니', href: '/treatments/wisdom-tooth', title: '사랑니발치' },
  { keyword: '치아교정', href: '/treatments/ortho', title: '치아교정' },
  { keyword: '임플란트', href: '/treatments/implant', title: '임플란트' },
  { keyword: '예방치료', href: '/treatments/prevention', title: '예방치료' },
  { keyword: '스케일링', href: '/treatments/prevention', title: '예방치료 (스케일링)' },
]

/**
 * HTML 문자열의 본문 텍스트에 자동 내부 링크 삽입
 * - 태그 속성 내부, 기존 <a> 안쪽, 헤딩 안쪽은 회피
 * - 키워드당 최대 1회만 (스팸 방지)
 */
export function autoLinkContent(html: string, links: LinkMap = DEFAULT_LINKS): string {
  if (!html || typeof html !== 'string') return html
  // 이미 링크된 키워드 추적
  const linkedKeywords = new Set<string>()

  // HTML을 텍스트/태그 토큰으로 분리하는 단순 파서
  // - <a>...</a>, <h1~h6>...</h6>, <code>, <pre>, 속성값은 건드리지 않음
  const SKIP_TAGS = /^(a|h1|h2|h3|h4|h5|h6|code|pre|script|style|button)$/i

  let result = ''
  let pos = 0
  const len = html.length
  const skipStack: string[] = [] // 현재 열려있는 스킵 대상 태그 스택

  while (pos < len) {
    const ltIdx = html.indexOf('<', pos)
    if (ltIdx < 0) {
      // 남은 텍스트 처리
      result += linkifyText(html.slice(pos), links, linkedKeywords, skipStack.length > 0)
      break
    }
    // 태그 이전 텍스트 처리
    if (ltIdx > pos) {
      result += linkifyText(html.slice(pos, ltIdx), links, linkedKeywords, skipStack.length > 0)
    }
    // 태그 추출
    const gtIdx = html.indexOf('>', ltIdx)
    if (gtIdx < 0) {
      result += html.slice(ltIdx)
      break
    }
    const tagFull = html.slice(ltIdx, gtIdx + 1)
    result += tagFull
    // 태그명 파싱
    const tagMatch = tagFull.match(/^<(\/?)([a-zA-Z0-9]+)/)
    if (tagMatch) {
      const isClose = tagMatch[1] === '/'
      const tagName = tagMatch[2]
      const isSelfClose = tagFull.endsWith('/>')
      if (SKIP_TAGS.test(tagName)) {
        if (isClose) {
          // 스킵 태그 닫힘
          const last = skipStack[skipStack.length - 1]
          if (last && last.toLowerCase() === tagName.toLowerCase()) {
            skipStack.pop()
          }
        } else if (!isSelfClose) {
          // 스킵 태그 열림
          skipStack.push(tagName)
        }
      }
    }
    pos = gtIdx + 1
  }
  return result
}

/**
 * 텍스트 노드 내에서 키워드 1회씩 링크화
 */
function linkifyText(text: string, links: LinkMap, linkedKeywords: Set<string>, isInsideSkipTag: boolean): string {
  if (!text || isInsideSkipTag) return text
  let result = text
  for (const link of links) {
    if (linkedKeywords.has(link.keyword)) continue
    const idx = result.indexOf(link.keyword)
    if (idx < 0) continue
    // 첫 등장만 링크화
    const before = result.slice(0, idx)
    const matched = result.slice(idx, idx + link.keyword.length)
    const after = result.slice(idx + link.keyword.length)
    const titleAttr = link.title ? ` title="${escapeAttr(link.title)}"` : ''
    result = `${before}<a href="${link.href}" class="auto-link"${titleAttr}>${matched}</a>${after}`
    linkedKeywords.add(link.keyword)
  }
  return result
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

export const AUTO_LINK_DEFAULTS = DEFAULT_LINKS
