// ============================================================
// Phase 1-2: 페이지별 OG 이미지 동적 빌더
// 64개 지역×진료 + 8개 지역 허브 + 8개 진료 페이지마다
// 미리보기 이미지가 차별화되도록 함
//
// 전략:
//   - 기본은 통합 OG 이미지 사용 (현재 상태 유지)
//   - URL에 ?type=... 파라미터를 붙여 페이지별 식별 가능하게
//     → SNS/검색엔진 캐시 분리 + 향후 동적 이미지 서버로 전환 시 사용 가능
//   - 진료별/지역별 시그니처 이미지 파일이 추가되면 자동 매핑
// ============================================================
import { OG_IMAGES } from './constants'
import { getCore, BUPYEONG_HUB, BUPYEONG_HUB_IMAGE } from './bupyeong-core'

type OgImageOpts =
  | { type: 'home' }
  | { type: 'treatment'; treatment: string }
  | { type: 'area-hub'; area: string }
  | { type: 'area-treatment'; area: string; treatment: string }
  | { type: 'blog'; slug?: string; cover?: string }
  | { type: 'ba'; slug?: string; cover?: string }

/**
 * 페이지별 OG 이미지 URL 생성
 * - 진료/지역별 전용 이미지가 있으면 사용, 없으면 기본 + 식별 파라미터
 */
export function buildOgImageUrl(opts: OgImageOpts): string {
  const base = OG_IMAGES.default
  // 향후 진료별/지역별 전용 PNG가 public/static/og/ 에 추가되면 여기서 매핑
  const TREATMENT_OG: Record<string, string> = {
    // 'implant': '/static/og/og-implant.png?v=20260526',
    // 'ortho': '/static/og/og-ortho.png?v=20260526',
    // ...추후 디자이너가 만들어주면 활성화
  }
  const AREA_OG: Record<string, string> = {
    // 'bupyeong-station': '/static/og/og-bupyeong-station.png?v=20260526',
    // ...추후 디자이너 작업
  }
  if (opts.type === 'treatment' && TREATMENT_OG[opts.treatment]) {
    return TREATMENT_OG[opts.treatment]
  }
  // 2026-10-14: "부평 치과" 허브·핵심 하위 6개는 페이지마다 고유 실사 (bupyeong-core.tsx)
  if (opts.type === 'area-hub' && opts.area === BUPYEONG_HUB) return BUPYEONG_HUB_IMAGE.og
  if (opts.type === 'area-treatment') {
    const core = getCore(opts.area, opts.treatment)
    if (core) return core.og
  }
  if (opts.type === 'area-hub' && AREA_OG[opts.area]) {
    return AREA_OG[opts.area]
  }
  if (opts.type === 'area-treatment') {
    if (TREATMENT_OG[opts.treatment]) return TREATMENT_OG[opts.treatment]
    if (AREA_OG[opts.area]) return AREA_OG[opts.area]
  }
  if ((opts.type === 'blog' || opts.type === 'ba') && opts.cover) {
    // 블로그/BA는 커버 이미지가 있으면 그걸로 (R2 키 또는 절대 URL)
    if (opts.cover.startsWith('http')) return opts.cover
    if (opts.cover.startsWith('/')) return opts.cover
    return `/media/${opts.cover}`
  }
  // 폴백: 사이트 기본 og(실사 1200×630). 2026-10-14 — 같은 파일에 ?p= 쿼리만 붙이던 방식은
  // 검색엔진이 서로 다른 이미지로 보지 않아 의미가 없어 제거.
  return base
}
