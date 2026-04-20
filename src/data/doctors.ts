// ============================================================
// 의료진 데이터 (추후 DB/R2 연동 전 정적 데이터)
// ============================================================

export type Doctor = {
  slug: string
  name: string
  title: string // 직책
  role: 'director' | 'vice' | 'doctor'
  photo?: string // /static/doctors/xxx.jpg
  specialties: string[] // 잘하는 진료 slug (CORE/OTHER treatments)
  tagline: string // 한 줄 카피
  intro: string[] // 자기소개 단락
  education: string[] // 학력/수련
  careers: string[] // 경력/학회
  certifications: string[] // 자문의/인증의
  quote?: string
}

export const DOCTORS: Doctor[] = [
  {
    slug: 'kim-jaein',
    name: '김재인',
    title: '대표원장',
    role: 'director',
    specialties: ['implant', 'esthetic', 'wisdom-tooth', 'general-prosthesis'],
    tagline: '직관적인 설명, 정교한 수술. 14년 한 자리에서.',
    intro: [
      '환자의 의중을 빠르게 캐치하고, 진료와 진단 과정을 직관적으로 설명드리는 것. 이것이 제가 14년 동안 지켜온 진료의 기본입니다.',
      '인천 부평의 한 자리에서 긴 시간 동안 많은 환자분들을 만나 왔습니다. 그동안 제가 가장 중요하게 생각해 온 것은 “같은 환자가 내일 오시든 5년 뒤 오시든, 언제나 같은 퀄리티와 같은 무드의 진료를 받으실 수 있게 하자”는 것이었습니다.',
      '정직하게 최선을 다해, 환자가 처한 여러 여건(경제적·신체적)을 고려하여 최적의 답을 제공하는 치과. 그것이 부평우리치과가 추구하는 방향이며, 제가 책임지고 이끌어가는 이유입니다.',
    ],
    education: [
      '고려대학교 의과대학 구강외과학 의학박사',
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
  // 추후 프로필 제출 시 활성화될 슬롯. 현재는 숨김 처리(pending: true).
]

// pending 필드가 없는 의료진만 "공개"로 간주
export const PUBLIC_DOCTORS = DOCTORS

export const getDoctor = (slug: string) => DOCTORS.find((d) => d.slug === slug)
export const getDoctorsBySpecialty = (treatmentSlug: string) =>
  DOCTORS.filter((d) => d.specialties.includes(treatmentSlug))
