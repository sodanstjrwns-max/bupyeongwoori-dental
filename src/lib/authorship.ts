// ===== 블로그 글 작성 주체 (2026-10-08, 사용자 승인) =====
// 원장을 저자·감수자로 표시하는 건 원장이 쓰거나 검토했다는 근거가 있을 때만 한다.
//
// 대행사 투입 글 — 원장 작성·검토 근거 없음:
//   id 1 implant-cbct-3d-diagnosis / id 2 why-laminate-not-just-cosmetic / id 3 orthodontics-when-to-start
//   근거: migrations/seed_content_2026_04.sql (커밋 dae4251, 2026-04-30 납품 전 일괄 시드)로 들어간 글.
//   라이브 D1 의 세 글 모두 created_at 이 2026-04-30 04:55:21 로 같다(일괄 투입). author_slug(kim-jaein·
//   jo-heeyoung·lim-sunyoung)는 시드/대행사가 붙인 값이라 원장 작성 근거가 아니다.
// → 작성·발행 = 병원(Organization #clinic), reviewedBy·lastReviewed 없음, 화면엔 일반 건강정보 안내.
//
// 관리자 화면에서 병원이 원장을 직접 지정해 올린 글(위 목록 밖, author_slug = 의사 slug)은 기존 표시를 유지한다.
// 관리자에서 '병원 발행'(author_slug = 'clinic')을 고르면 원장 이름이 붙지 않는다(기본값).
import { getDoctor } from '../data/doctors'
import { CLINIC } from './constants'

export const AGENCY_SEED_POST_IDS = new Set<number>([1, 2, 3])
export const CLINIC_AUTHOR_SLUG = 'clinic'
export const CLINIC_GENERAL_INFO_NOTE = '일반 건강정보입니다. 진료 판단은 내원 상담에서 원장이 직접 합니다.'

export const isAgencyPost = (p: { id?: number | string | null }) => AGENCY_SEED_POST_IDS.has(Number(p.id))

/** 글에 원장 저자를 표시해도 되면 그 원장, 아니면 undefined(= 병원 발행) */
export const postDoctor = (p: { id?: number | string | null; author_slug?: string | null }) =>
  isAgencyPost(p) || !p.author_slug ? undefined : getDoctor(p.author_slug)

export const clinicOrgRef = () => ({
  '@type': 'Organization',
  '@id': `https://${CLINIC.domain}/#clinic`,
  name: CLINIC.name,
  url: `https://${CLINIC.domain}/`,
})
