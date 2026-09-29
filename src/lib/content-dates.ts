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
  /** 치과 백과사전 용어 본문 — 2026-04-20 마지막 시드 이후 정의 변경 없음 (09-29는 중복 slug 301 정리만) */
  glossary: '2026-04-20',
  /** 의료진 프로필 — src/data/doctors.ts 최종 수정 커밋 */
  doctors: '2026-04-30',
} as const

/** YYYY-MM-DD → sitemap/meta 용 ISO (정오 KST) */
export const toKstNoonIso = (d: string) => `${d}T12:00:00+09:00`
