// ============================================================
// 부평우리치과 - 전역 상수/설정
// ============================================================

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
  address: '인천광역시 부평구 부평대로 16 에이플러스에셋빌딩 5층, 7층',
  addressShort: '인천 부평구 부평대로 16',
  directions: '인천 부평역 지하상가 26번 출구로 나오시면 바로 있습니다.',
  since: 2012,
  domain: 'bupyeongwoori.com', // 예정
  socialLinks: {
    blog: 'https://blog.naver.com/wooridental',
    instagram: 'https://instagram.com/bupyeongwoori',
    youtube: '',
    kakao: '',
  },
  hours: [
    { day: '월요일', time: '10:00 - 20:00', isOpen: true },
    { day: '화요일', time: '10:00 - 18:00', isOpen: true },
    { day: '수요일', time: '10:00 - 21:00', isOpen: true },
    { day: '목요일', time: '10:00 - 18:00', isOpen: true },
    { day: '금요일', time: '10:00 - 18:00', isOpen: true },
    { day: '토요일', time: '09:30 - 13:30', isOpen: true },
    { day: '일요일', time: '휴진', isOpen: false },
  ],
  lunch: '점심시간 13:00 - 14:00 (토요일 점심시간 없음)',
  // 사업자 정보 (추후 제출 예정 - 임시)
  business: {
    name: '부평우리치과의원',
    representative: '김재인',
    registrationNumber: '---',
  },
} as const

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
export const SEO_DEFAULT = {
  title: '부평우리치과 | 부평역 1번지 프리미엄 치과 · 임플란트 · 심미보철 · 교정',
  description:
    '부평역 26번 출구 즉시 도착. 고려대 구강외과 의학박사, 스트라우만·오스템·네오 임플란트 자문의, Invisalign 우수인증의. 14년 한 자리에서 변하지 않는 퀄리티로 진료합니다.',
  keywords:
    '부평치과, 부평역치과, 부평 임플란트, 부평 교정, 부평 라미네이트, 부평우리치과, 인천치과, 부평구치과',
  ogImage: '/static/og-default.jpg',
} as const
