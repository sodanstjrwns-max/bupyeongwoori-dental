// ============================================================
// 치과 백과사전 보강 본문 (2026-10-08)
// 용어마다 그 용어에만 해당하는 700~1,200자 본문: 쉬운 정의 → 유형별(질환/시술/재료/장비/해부/제도/개념)
// 섹션 → 자주 묻는 질문(FAQPage 스키마와 화면 1:1) → 관련 진료·용어.
// 배치(약 50개 단위) JSON 으로 나눠 관리한다. 내용을 고치면 GLOSSARY_CONTENT_DATE 를
// 실제 수정일로 바꾼다 (오늘 날짜 자동 생성 금지 — sitemap lastmod·dateModified 가 이 값을 쓴다).
// ============================================================
import type { GlossaryContent } from '../glossary'
import b01 from './b01.json'
import b02 from './b02.json'
import b03 from './b03.json'
import b04 from './b04.json'
import b05 from './b05.json'
import b06 from './b06.json'
import b07 from './b07.json'
import b08 from './b08.json'
import b09 from './b09.json'
import b10 from './b10.json'

/** 보강 본문 최종 수정일 — 고정값 */
export const GLOSSARY_CONTENT_DATE = '2026-10-08'

export const GLOSSARY_CONTENT: Record<string, GlossaryContent> = Object.assign(
  {},
  b01, b02, b03, b04, b05, b06, b07, b08, b09, b10,
) as Record<string, GlossaryContent>
