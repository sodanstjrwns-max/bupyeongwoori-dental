// ============================================================
// 의료진 데이터 (추후 DB/R2 연동 전 정적 데이터)
// ============================================================

export type Doctor = {
  slug: string
  name: string
  title: string // 직책
  role: 'director' | 'vice' | 'doctor'
  photo?: string // R2 key (e.g., 'doctors/kim-jaein.jpg') OR full URL OR /static/path
  specialties: string[] // 잘하는 진료 slug (CORE/OTHER treatments)
  tagline: string // 한 줄 카피
  intro: string[] // 자기소개 단락
  education: string[] // 학력/수련
  careers: string[] // 경력/학회
  certifications: string[] // 자문의/인증의
  quote?: string
}

// 사진 URL 헬퍼: R2 key든 절대 URL이든 정적 경로든 모두 안전하게 변환
// v 파라미터로 캐시 버스팅 (이미지 업스케일 후 엣지 캐시 무효화 목적)
const PHOTO_CACHE_VERSION = '20260429u'
export const doctorPhotoSrc = (photo?: string): string | null => {
  if (!photo) return null
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo
  if (photo.startsWith('/')) return photo
  // R2 key (e.g., 'doctors/kim-jaein.jpg') -> /media/<key>?v=<ver>
  return `/media/${photo}?v=${PHOTO_CACHE_VERSION}`
}

export const DOCTORS: Doctor[] = [
  // ========================================================
  // 대표원장 김재인 — 임플란트·구강외과
  // ========================================================
  {
    slug: 'kim-jaein',
    name: '김재인',
    title: '대표원장',
    role: 'director',
    photo: 'doctors/kim-jaein.jpg',
    specialties: ['implant', 'esthetic', 'wisdom-tooth', 'general-prosthesis'],
    tagline: '직관적인 설명, 정교한 수술. 14년 한 자리에서.',
    intro: [
      '환자의 의중을 빠르게 캐치하고, 진료와 진단 과정을 직관적으로 설명드리는 것. 이것이 제가 14년 동안 지켜온 진료의 기본입니다.',
      '인천 부평의 한 자리에서 긴 시간 동안 많은 환자분들을 만나 왔습니다. 그동안 제가 가장 중요하게 생각해 온 것은 “같은 환자가 내일 오시든 5년 뒤 오시든, 언제나 같은 퀄리티와 같은 무드의 진료를 받으실 수 있게 하자”는 것이었습니다.',
      '정직하게 최선을 다해, 환자가 처한 여러 여건(경제적·신체적)을 고려하여 최적의 답을 제공하는 치과. 그것이 부평우리치과가 추구하는 방향이며, 제가 책임지고 이끌어가는 이유입니다.',
    ],
    education: [
      '고려대학교 의과대학 구강외과 의학박사',
      '고려대학교 구강악안면외과학과 (임플란트 전공)',
      '고려대학교 의료원 외래교수 (구강악안면외과)',
    ],
    careers: [
      '대한구강악안면임플란트학회 복지이사',
      '대한구강악안면임플란트학회 우수회원',
      '대한치과감염학회 재무이사',
      'ICOI (국제임플란트학회) 한국지부 이사',
      'WAUPS (세계초음파수술학회) 이사',
      'WAUPS Diplomate (세계초음파수술학회 인증의)',
      '대한보철학회 우수회원',
      '대한치과턱관절교합학회 정회원',
    ],
    certifications: [
      '보건복지부 인증 치과전문의',
      '스트라우만 임플란트 자문의사',
      '오스템 임플란트 임상자문위원',
      '네오 임플란트 임상자문위원',
      'Invisalign 우수인증의사',
    ],
    quote:
      '“높은 퀄리티의 진료 경험을, 변하지 않고, 항상성 있게.” — 그것이 제가 14년간 지켜온 약속입니다.',
  },

  // ========================================================
  // 원장 임선영 — 교정 (연세치대원 박사수료)
  // ========================================================
  {
    slug: 'lim-sunyoung',
    name: '임선영',
    title: '원장',
    role: 'doctor',
    photo: 'doctors/lim-sunyoung.jpg',
    specialties: ['orthodontics', 'invisalign'],
    tagline: '연세치대원 박사수료. 치아 교정의 디테일을 책임집니다.',
    intro: [
      '교정은 단순히 치아를 가지런히 하는 것을 넘어, 환자분의 얼굴 균형과 입술 라인, 그리고 평생의 치아 건강까지 함께 설계하는 진료입니다.',
      '연세대학교 치과대학병원에서 교정과 레지던트를 수료하고, UCLA·University of Pennsylvania 교정과 교환연수를 거치며 다양한 케이스를 경험했습니다.',
      '환자분 한 분 한 분의 라이프스타일에 맞는 교정 플랜 — 메탈/세라믹 브라켓부터 인비절라인까지 — 을 정확히 제시해 드리겠습니다.',
    ],
    education: [
      '연세대학교 치과대학 졸업',
      '연세대학교 치과대학원 교정과 석박사 통합과정 (박사수료)',
      '연세대학교 치과대학병원 인턴 수료',
      '연세대학교 치과대학병원 교정과 레지던트 수료',
      'University of California, Los Angeles 치과대학 교환연수',
      'University of Pennsylvania 교정과 교환연수',
    ],
    careers: [
      '대한치과교정학회 정회원',
      '연세대학교 교정연구회 정회원',
    ],
    certifications: [
      '보건복지부 인증 치과전문의 (교정과)',
    ],
  },

  // ========================================================
  // 원장 조정하 — 치과보존 (근관·신경치료)
  // ========================================================
  {
    slug: 'jo-jeongha',
    name: '조정하',
    title: '원장',
    role: 'doctor',
    photo: 'doctors/jo-jeongha.jpg',
    specialties: ['preservation', 'esthetic'],
    tagline: '치아를 살리는 치료, 치과보존과 전문의.',
    intro: [
      '“가능하다면 자연치를 살리는 것” — 이것이 보존과 의사로서의 첫 번째 원칙입니다.',
      '원주세브란스기독병원에서 인턴과 전공의 과정을 거치며 신경치료(근관치료)와 정밀 보존 진료에 집중해 왔습니다.',
      '미세현미경(ZEISS EXTARO 300)을 활용한 정확한 진단과 정밀한 치료로, 발치를 최소화하고 자연치를 오래 쓸 수 있도록 도와드립니다.',
    ],
    education: [
      '미국 오하이오 주립대학교 졸업',
      '전남대학교 치의학전문대학원 석사',
      '원주세브란스기독병원 인턴',
      '원주세브란스기독병원 전공의',
    ],
    careers: [
      '치과보존과 인정의',
    ],
    certifications: [
      '치과보존과 전문의',
    ],
  },

  // ========================================================
  // 원장 조희영 — 치과보철 (심미보철·노년치의)
  // ========================================================
  {
    slug: 'jo-heeyoung',
    name: '조희영',
    title: '원장',
    role: 'doctor',
    photo: 'doctors/jo-heeyoung.jpg',
    specialties: ['esthetic', 'general-prosthesis', 'implant'],
    tagline: '연세치대원 보철 석사. 심미와 기능을 동시에.',
    intro: [
      '보철은 단순히 망가진 치아를 복원하는 것이 아니라, 환자분의 표정과 일상의 자신감을 복원하는 일이라고 생각합니다.',
      '연세대학교 치과대학원에서 보철학 석사를 마치고, 강남세브란스 치과병원에서 인턴·레지던트를 수료했습니다.',
      '심미보철·임플란트 보철·노년치의학까지 — 정밀한 디자인과 자연스러운 색조 매칭으로 만족스러운 결과를 만들어 드리겠습니다.',
    ],
    education: [
      '연세대학교 치과대학 졸업',
      '연세대학교 치과대학원 치과보철학 석사',
      '강남세브란스 치과병원 인턴',
      '강남세브란스 치과보철과 레지던트',
    ],
    careers: [
      '대한치과보철학회 정회원',
      '대한구강악안면임플란트학회 정회원',
      '대한심미치과학회 정회원',
      '대한노년치의학회 정회원',
    ],
    certifications: [
      '대한치과보철학회 인정의',
    ],
  },

  // ========================================================
  // 원장 오영준 — 임플란트·심미
  // ========================================================
  {
    slug: 'oh-youngjun',
    name: '오영준',
    title: '원장',
    role: 'doctor',
    photo: 'doctors/oh-youngjun.jpg',
    specialties: ['implant', 'esthetic', 'general-prosthesis'],
    tagline: '튼튼한 잇몸 위에 오래 가는 임플란트.',
    intro: [
      '임플란트는 ‘심는 것’보다 ‘오래 쓰게 하는 것’이 훨씬 중요합니다. 그 핵심은 잇몸과 뼈, 그리고 정밀한 식립 위치입니다.',
      '대한치과의사협회·대한심미치과학회 정회원으로서, 임플란트와 심미 진료를 전문으로 합니다.',
      '환자분의 구강 상태를 정확히 진단하고, 무리 없이 오래 사용할 수 있는 임플란트 플랜을 제시해 드리겠습니다.',
    ],
    education: [],
    careers: [
      '대한치과의사협회 정회원',
      '대한심미치과학회 정회원',
      '오스템 AIC 임플란트 코스 수료',
      '오스템 발치즉시 연수회 수료',
    ],
    certifications: [],
  },

  // ========================================================
  // 원장 임용민 — 보존·보철
  // ========================================================
  {
    slug: 'lim-yongmin',
    name: '임용민',
    title: '원장',
    role: 'doctor',
    photo: 'doctors/lim-yongmin.jpg',
    specialties: ['preservation', 'general-prosthesis', 'esthetic'],
    tagline: '꼼꼼한 진단, 깔끔한 마무리.',
    intro: [
      '치과 진료의 본질은 ‘꼼꼼한 진단’과 ‘깔끔한 마무리’에 있다고 믿습니다.',
      '보존(신경치료)·보철(크라운·인레이) 분야의 코스를 꾸준히 이수하며, 정밀하고 신뢰할 수 있는 진료를 위해 매일 공부합니다.',
      '환자분께 부담 없이 설명드리고, 결과까지 책임지는 진료를 약속드립니다.',
    ],
    education: [],
    careers: [
      '대한치과의사협회 정회원',
      '대한심미치과학회 정회원',
      '대한 디지털악안면임플란트학회 정회원',
      '대한치과보철과 디지털 코스 수료',
      'Apex 발근관학회 endodontic course 수료',
      'GC Prosthetics course 수료',
    ],
    certifications: [],
  },
]

// pending 필드가 없는 의료진만 "공개"로 간주
export const PUBLIC_DOCTORS = DOCTORS

export const getDoctor = (slug: string) => DOCTORS.find((d) => d.slug === slug)
export const getDoctorsBySpecialty = (treatmentSlug: string) =>
  DOCTORS.filter((d) => d.specialties.includes(treatmentSlug))
