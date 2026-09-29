// ============================================================
// 부평우리치과 - 전역 상수/설정
// ============================================================

// ============================================================
// 진료시간 — 단일 출처 (Single Source of Truth)
// 방문 안내 표·Dentist 스키마 openingHoursSpecification·llms.txt·llms-full.txt·홈/지역 요약 문구가
// 전부 여기서 파생된다. 시간이 바뀌면 이 배열만 고친다.
// ============================================================
export const HOURS = [
  { day: '월요일', short: '월', en: 'Monday', opens: '10:00', closes: '20:00' },
  { day: '화요일', short: '화', en: 'Tuesday', opens: '10:00', closes: '18:00' },
  { day: '수요일', short: '수', en: 'Wednesday', opens: '10:00', closes: '21:00' },
  { day: '목요일', short: '목', en: 'Thursday', opens: '10:00', closes: '18:00' },
  { day: '금요일', short: '금', en: 'Friday', opens: '10:00', closes: '18:00' },
  { day: '토요일', short: '토', en: 'Saturday', opens: '09:30', closes: '13:30' },
  { day: '일요일', short: '일', en: 'Sunday', opens: null, closes: null },
] as const

/** 연속된 같은 시간대 요일을 묶은 요약 — 예: "월 10:00–20:00 · 화 10:00–18:00 · … · 일 휴진" */
export const hoursSummary = (): string => {
  const groups: { days: string[]; label: string }[] = []
  for (const h of HOURS) {
    const label = h.opens ? `${h.opens}–${h.closes}` : '휴진'
    const last = groups[groups.length - 1]
    if (last && last.label === label) last.days.push(h.short)
    else groups.push({ days: [h.short], label })
  }
  return groups.map((g) => `${g.days.join('·')} ${g.label}`).join(' · ')
}

export const CLINIC = {
  name: '부평우리치과',
  fullName: '부평우리치과의원 인천부평본점',
  nameEn: 'Bupyeong Woori Dental Clinic',
  slogan: '정직한 진료, 변하지 않는 퀄리티',
  mission:
    '제대로 된 치료를 받고 싶을 때, 믿고 찾을 수 있는 치과. 정직하게 최선을 다하여 최고의 진료를, 늘 같은 퀄리티와 같은 무드로 제공합니다.',
  representative: '김재인',
  phone: '032-529-2875',
  mobile: '010-9687-2875',
  email: 'rombardo@naver.com',
  address: '인천광역시 부평구 부평대로 16 에이플러스에셋빌딩',
  addressShort: '인천 부평구 부평대로 16',
  directions: '인천 부평역 지하상가 26번 출구로 나오시면 바로 있습니다.',
  since: 2012,
  domain: 'wooridc.kr',
  socialLinks: {
    blog: 'https://blog.naver.com/pmarkpaperb64',
    instagram: 'https://www.instagram.com/woorident/',
    youtube: 'https://www.youtube.com/@부평우리치과의원',
    facebook: 'https://www.facebook.com/woori2875',
    naverPlace: 'https://naver.me/xMj67GgD',
    naverBooking: 'https://naver.me/xMj67GgD', // 네이버 플레이스 → 예약 진입
    kakao: 'http://pf.kakao.com/_RGexmxd', // 카카오톡 채널 상담
  },
  // 진료시간 — HOURS(위) 단일 출처에서 파생. 화면·스키마·llms.txt 가 모두 같은 값을 쓴다.
  hours: HOURS.map((h) => ({ day: h.day, time: h.opens ? `${h.opens} - ${h.closes}` : '휴진', isOpen: Boolean(h.opens) })),
  lunch: '점심시간 13:00 - 14:00 (토요일 점심시간 없음)',
  // 문의 응답 기대 설정 (E5) — 환자가 "언제 답이 올지" 알 수 있게
  responseExpectation: {
    kakao: '카카오톡 문의는 진료시간 내 평균 30분 이내 답변드립니다.',
    kakaoShort: '진료시간 내 30분 내 답변',
    phone: '전화는 진료시간 내 바로 연결됩니다. 통화 중일 때는 남겨주신 번호로 회신드립니다.',
    afterHours: '진료시간 외 문의는 다음 진료일 오전 중 순서대로 답변드립니다.',
  },
  // 사업자 정보 (추후 제출 예정 - 임시)
  // registrationNumber 가 비어 있거나 '---' 같은 자리표시자면 푸터에서 해당 줄을 숨긴다(hasRealBizNumber).
  business: {
    name: '부평우리치과의원',
    representative: '김재인',
    registrationNumber: '---',
  },
} as const

/** 사업자등록번호가 실제 값(숫자 포함)인지 — 자리표시자('---' 등)면 false */
export const hasRealBizNumber = (): boolean => /\d{3}-?\d{2}-?\d{5}/.test(String(CLINIC.business.registrationNumber ?? ''))

// 핵심 진료 3가지 (상세 페이지)
export const CORE_TREATMENTS = [
  {
    slug: 'implant',
    name: '임플란트',
    nameEn: 'Dental Implant',
    tagline: '14년 임상과 박사의 손끝, 오래 쓰는 임플란트',
    description:
      '고려대 구강악안면외과 의학박사 출신 대표원장의 정교한 수술과, 스트라우만·오스템·네오 자문의 자격의 축적된 노하우로 완성되는 임플란트.',
    color: 'from-teal-500 to-cyan-600',
  },
  {
    slug: 'esthetic',
    name: '심미보철',
    nameEn: 'Esthetic Restoration',
    tagline: '티 안 나게, 자연스럽게, 오래가는 아름다움',
    description:
      '칼짜이스 미세현미경 Extaro 300과 국내 최고 수준의 보철 시스템으로 원래 내 치아보다 더 아름답게.',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    slug: 'ortho',
    name: '치아교정',
    nameEn: 'Orthodontics',
    tagline: 'Invisalign 우수인증의가 제안하는 맞춤 교정',
    description:
      '투명교정부터 메탈·세라믹까지, 라이프스타일과 얼굴형에 맞춘 최적의 교정 플랜.',
    color: 'from-blue-500 to-indigo-600',
  },
] as const

// 기타 진료
export const OTHER_TREATMENTS = [
  { slug: 'general-prosthesis', name: '일반보철', nameEn: 'General Prosthesis' },
  { slug: 'prevention', name: '예방치료', nameEn: 'Preventive Care' },
  { slug: 'laminate', name: '라미네이트', nameEn: 'Laminate' },
  { slug: 'clear-aligner', name: '투명교정', nameEn: 'Clear Aligner' },
  { slug: 'wisdom-tooth', name: '사랑니발치', nameEn: 'Wisdom Tooth Extraction' },
] as const

// 특수 장비
export const EQUIPMENTS = [
  { name: '콘빔 CT', nameEn: 'CBCT', count: 2, desc: '3D 진단으로 정확한 수술 설계', purpose: '3D Diagnosis' },
  { name: '칼짜이스 미세현미경 Extaro 300', nameEn: 'ZEISS EXTARO 300', count: 1, desc: '맨눈으로 볼 수 없는 영역까지 정밀하게', purpose: 'Microscope Precision' },
  { name: '멕트론 콤비터치', nameEn: 'Mectron Combitouch', count: 10, desc: '초음파 기반 정밀 수술·스케일링', purpose: 'Ultrasonic Surgery' },
  { name: '카보 핸드피스', nameEn: 'KaVo Handpiece', count: 160, desc: '1인 1핸드피스 원칙의 철저한 감염관리', purpose: '1:1 Infection Control' },
] as const

// 주요 지역 키워드 (SEO용)
export const SEO_REGIONS = [
  '부평', '부평구', '부평동', '부평역', '십정동', '산곡동', '청천동', '갈산동',
  '부개동', '일신동', '삼산동', '부평1동', '부평2동', '부평3동', '부평4동', '부평5동', '부평6동',
  '인천', '계양구', '남동구', '서구', '부천시', '송내동', '중동',
] as const

// 메타 기본값
// SEO 권장: title 60자 이내, description 150자 이내
export const SEO_DEFAULT = {
  // 60자 이내: 브랜드 + 핵심 8진료 압축
  title: '부평우리치과 | 임플란트·교정·심미보철·라미네이트·사랑니',
  // 150자 이내: 모든 핵심 진료 8종 + 위치 + 신뢰지표
  description:
    '부평역 26번 출구 1분. 임플란트·치아교정·심미보철·일반보철·예방치료·라미네이트·투명교정·사랑니발치까지. 의학박사 대표원장과 임플란트 자문의가 14년 한 자리에서 정직하게 진료합니다.',
  // 100자 이내: 8개 진료 + 지역 키워드
  keywords:
    '부평치과, 부평역치과, 부평 임플란트, 부평 교정, 부평 심미보철, 부평 라미네이트, 부평 투명교정, 사랑니발치, 부평우리치과, 인천치과',
  ogImage: '/static/og/og-default.png?v=20260430m',
} as const

// 페이지별 OG 이미지 매핑 — 원장님 주신 원본 로고 PNG 그대로 사용
const OG_UNIFIED = '/static/og/og-default.png?v=20260430m'
export const OG_IMAGES = {
  home: OG_UNIFIED,
  mission: OG_UNIFIED,
  doctors: OG_UNIFIED,
  treatments: OG_UNIFIED,
  beforeAfter: OG_UNIFIED,
  blog: OG_UNIFIED,
  notices: OG_UNIFIED,
  glossary: OG_UNIFIED,
  faq: OG_UNIFIED,
  visit: OG_UNIFIED,
  default: OG_UNIFIED,
} as const
