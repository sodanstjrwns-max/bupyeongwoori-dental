// ============================================================
// 콘텐츠 최종 검토일 — 고정값 (단일 출처)
// 스키마 lastReviewed/dateModified, 화면 감수 줄, sitemap lastmod 가 모두 이 값을 쓴다.
// "오늘 날짜" 자동 생성 금지 — 해당 콘텐츠를 실제로 수정한 날에만 갱신한다.
// (값 = 해당 데이터 파일의 실제 최종 콘텐츠 수정 커밋 날짜)
// ============================================================
export const CONTENT_DATES = {
  /** 진료 상세·핵심 정적 페이지 — src/data/treatments.ts 3차 업글(D5 용어 병기 + C4 진료장면) */
  treatments: '2026-08-18',
  /** 지역×진료 랜딩 — src/data/areas.ts 2026-05-26 생성 이후 콘텐츠 변경 없음 */
  areas: '2026-05-26',
  /** 치과 백과사전 용어 본문 — 2026-10-08 전 용어 본문 보강(src/data/glossary-content, 용어별 modified 와 동일) */
  glossary: '2026-10-08',
  /** "부평 치과" 대표 허브(/areas/bupyeong-gu) — 2026-10-08 허브 본문 신설 */
  bupyeongHub: '2026-10-08',
  /** 의료진 프로필 — src/data/doctors.ts 최종 수정 커밋 */
  doctors: '2026-04-30',
} as const

/**
 * 정적 페이지별 실제 최종 수정일 (sitemap lastmod) — 해당 페이지 파일의 마지막 콘텐츠 커밋일.
 * 페이지를 실제로 고친 날에만 그 줄을 갱신한다. (한 값으로 전부 고정하던 방식 폐기, 2026-10-08)
 */
export const PAGE_DATES: Record<string, string> = {
  '/': '2026-10-08',            // 홈 title·첫 문단 "부평 치과" + 허브 앵커
  '/mission': '2026-04-30',
  '/doctors': '2026-06-11',
  '/doctors/kim-jaein': '2026-06-11',
  '/treatments': CONTENT_DATES.treatments,
  '/before-after': '2026-10-03',
  '/blog': '2026-10-03',
  '/notices': '2026-05-26',
  '/glossary': CONTENT_DATES.glossary,
  '/faq': '2026-06-11',
  '/visit': '2026-09-06',
  '/areas': '2026-10-08',       // 지역 인덱스에 "부평 치과" 허브 안내 추가
}

/** YYYY-MM-DD → sitemap/meta 용 ISO (정오 KST) */
export const toKstNoonIso = (d: string) => `${d}T12:00:00+09:00`
