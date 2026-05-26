// ============================================================
// 지역 × 진료 SEO 랜딩 페이지 데이터
// 목표: "부평역 임플란트", "산곡동 라미네이트" 같은 롱테일 키워드 잡기
// 원칙:
//   1. 각 지역마다 고유 정보 (거리/교통/주민특성) — doorway page 회피
//   2. 진료별 본문은 진료 데이터(treatments.ts)에서 가져와 지역 컨텍스트로 wrap
//   3. JSON-LD GeoCoordinates / MedicalBusiness 풀세트
// ============================================================

import { CLINIC } from '../lib/constants'

export type AreaInfo = {
  slug: string           // URL slug (영문)
  name: string           // 표시명 (예: 부평역)
  nameFull: string       // 풀네임 (예: 인천 부평구 부평역)
  district: string       // 행정구역 (예: 부평구)
  /** 우리 치과로부터 도보/대중교통 거리 */
  distance: string       // 예: "도보 1분", "지하철 1정거장 (5분)"
  /** 가장 가까운 지하철역/버스 정보 */
  transport: string
  /** 거리 (km) — JSON-LD에 사용 */
  distanceKm: number
  /** 지역 SEO 키워드 (제목/메타용) */
  keywords: string[]
  /** 지역 소개 (이 지역 환자분이 우리 치과를 선택하는 이유) */
  intro: string
  /** 지역의 위도/경도 (선택) */
  geo?: { lat: number; lng: number }
  /** 검색 빈도 우선순위 (1.0이 최대) */
  priority: number
}

// ============================================================
// 8개 핵심 지역 (부평구 중심 + 인접 지역)
// ============================================================
export const AREAS: AreaInfo[] = [
  {
    slug: 'bupyeong-station',
    name: '부평역',
    nameFull: '인천 부평구 부평역',
    district: '부평구',
    distance: '도보 1분 (26번 출구)',
    transport: '지하철 1호선·인천1호선 부평역 26번 출구 바로 앞',
    distanceKm: 0.1,
    keywords: ['부평역 치과', '부평역 임플란트', '부평역 교정', '부평역 라미네이트', '부평역 사랑니'],
    intro: '부평역 26번 출구로 나오시면 바로 앞에 위치한 ' + CLINIC.name + '. 출퇴근·등하교 동선에서 가장 가까운 치과로, 직장인·학생분들이 점심시간과 퇴근길에 부담 없이 방문하실 수 있습니다. 부평역 환승 거점 특성상 부평구·계양구·서구·부천에서도 1정거장 안에 접근 가능합니다.',
    geo: { lat: 37.4894, lng: 126.7245 },
    priority: 1.0,
  },
  {
    slug: 'bupyeong-gu',
    name: '부평구',
    nameFull: '인천광역시 부평구',
    district: '부평구',
    distance: '부평구 중심 부평역 도보 1분',
    transport: '지하철 1호선 부평역 26번 출구 / 부평구 전역에서 버스 다수',
    distanceKm: 1.0,
    keywords: ['부평구 치과', '부평구 임플란트', '부평구 교정', '부평 치과 추천'],
    intro: '인천 부평구의 중심 상권인 부평역 바로 앞에 위치한 ' + CLINIC.name + '은(는) 부평구 56만 주민분들의 구강 건강을 14년째 책임지고 있습니다. 부평1~6동, 십정동, 산곡동, 청천동, 갈산동, 부개동, 삼산동, 일신동 어디서든 부평역으로 모이는 교통 구조 덕분에 부평구 전역에서 가장 접근성 높은 치과 중 한 곳입니다.',
    geo: { lat: 37.4894, lng: 126.7245 },
    priority: 0.95,
  },
  {
    slug: 'bupyeong-dong',
    name: '부평동',
    nameFull: '인천 부평구 부평동',
    district: '부평구',
    distance: '부평동 핵심 상권 (부평역 바로 옆)',
    transport: '부평역 도보권 / 부평동 전 지역에서 도보 또는 마을버스 5분 이내',
    distanceKm: 0.5,
    keywords: ['부평동 치과', '부평동 임플란트', '부평동 교정', '부평1동 치과', '부평2동 치과'],
    intro: '부평동(부평1동~6동) 주민분들께 가장 가까운 종합 치과. 부평역 중앙상권에 위치해 부평동 어느 골목에서도 도보 또는 마을버스 한 정거장 거리입니다. 부평동의 오랜 주민들과 새롭게 이사오신 분들 모두 14년간 신뢰해 주신 ' + CLINIC.name + '입니다.',
    geo: { lat: 37.4901, lng: 126.7218 },
    priority: 0.9,
  },
  {
    slug: 'sipjeong-dong',
    name: '십정동',
    nameFull: '인천 부평구 십정동',
    district: '부평구',
    distance: '지하철 1정거장 (백운역 ↔ 부평역, 3분)',
    transport: '지하철 1호선 백운역에서 1정거장 또는 마을버스 564·570번 10분',
    distanceKm: 1.5,
    keywords: ['십정동 치과', '십정동 임플란트', '백운역 치과', '십정동 교정'],
    intro: '십정동은 부평역과 백운역 사이의 주거 밀집 지역으로, 1호선 1정거장 또는 마을버스 10분 거리에 ' + CLINIC.name + '이(가) 위치합니다. 십정1·2동의 오래된 주민분들이 14년간 변하지 않는 진료 퀄리티로 꾸준히 찾아주시는 곳입니다.',
    geo: { lat: 37.4769, lng: 126.7186 },
    priority: 0.85,
  },
  {
    slug: 'sangok-dong',
    name: '산곡동',
    nameFull: '인천 부평구 산곡동',
    district: '부평구',
    distance: '버스 10분 (511·530·556번)',
    transport: '버스 511·530·556번 부평역 정차 / 마을버스 5분',
    distanceKm: 2.0,
    keywords: ['산곡동 치과', '산곡동 임플란트', '산곡동 교정', '산곡동 라미네이트'],
    intro: '산곡1~4동은 부평구의 대표적인 주거 밀집 지역으로, 버스 한 번에 부평역까지 10분이면 도착합니다. 산곡동 가족 단위 환자분들이 자녀 교정부터 부모님 임플란트까지 한 곳에서 받으실 수 있도록 ' + CLINIC.name + '이(가) 함께합니다.',
    geo: { lat: 37.4796, lng: 126.7124 },
    priority: 0.85,
  },
  {
    slug: 'bugae-dong',
    name: '부개동',
    nameFull: '인천 부평구 부개동',
    district: '부평구',
    distance: '지하철 1정거장 (부개역 ↔ 부평역, 2분)',
    transport: '지하철 1호선 부개역에서 1정거장',
    distanceKm: 1.2,
    keywords: ['부개동 치과', '부개역 치과', '부개동 임플란트', '부개동 교정'],
    intro: '부개역에서 1호선 한 정거장이면 부평역, 도보 1분에 ' + CLINIC.name + '. 부개1~3동 주민분들이 출퇴근 동선에서 자연스럽게 들르실 수 있는 위치입니다.',
    geo: { lat: 37.4895, lng: 126.7444 },
    priority: 0.8,
  },
  {
    slug: 'samsan-dong',
    name: '삼산동',
    nameFull: '인천 부평구 삼산동',
    district: '부평구',
    distance: '버스 15분 (28·45·555번)',
    transport: '삼산동 정류장에서 부평역행 버스 다수',
    distanceKm: 3.5,
    keywords: ['삼산동 치과', '삼산동 임플란트', '삼산월드체육관 치과'],
    intro: '삼산동·삼산월드체육관 인근 주민분들도 부평역행 버스 15분이면 ' + CLINIC.name + '에 도착합니다. 삼산동의 젊은 가족 단위 환자분들이 자녀 교정·예방치료부터 라미네이트까지 폭넓게 받으시는 곳입니다.',
    geo: { lat: 37.5097, lng: 126.7459 },
    priority: 0.75,
  },
  {
    slug: 'galsan-dong',
    name: '갈산동',
    nameFull: '인천 부평구 갈산동',
    district: '부평구',
    distance: '지하철 1정거장 (갈산역 ↔ 부평구청 ↔ 부평역)',
    transport: '인천1호선 갈산역에서 부평구청 환승 후 부평역',
    distanceKm: 2.5,
    keywords: ['갈산동 치과', '갈산역 치과', '갈산동 임플란트', '갈산동 교정'],
    intro: '갈산1·2동 주민분들은 인천1호선 갈산역에서 부평구청 환승 한 번에 부평역에 도착, ' + CLINIC.name + '으로 바로 연결됩니다.',
    geo: { lat: 37.5165, lng: 126.7228 },
    priority: 0.75,
  },
]

// ============================================================
// 진료 × 지역 페이지에서 사용할 "왜 이 지역에서 우리 치과인가" 메시지
// 각 진료별로 지역 환자 특성에 맞춘 본문 (doorway 회피용 고유 콘텐츠)
// ============================================================
export type TreatmentLocalAngle = {
  treatmentSlug: string
  /** 이 진료를 이 지역에서 우리 치과로 받아야 하는 이유 (지역+진료 결합) */
  localAngle: (areaName: string) => string
  /** 이 지역 환자분들의 자주 묻는 질문 (지역 컨텍스트) */
  localFaqs: (areaName: string) => { q: string; a: string }[]
}

const angleFn = (msg: (area: string) => string, faqs: (area: string) => { q: string; a: string }[]): TreatmentLocalAngle['localAngle'] => msg as any

export const TREATMENT_LOCAL: Record<string, {
  localAngle: (areaName: string) => string
  localFaqs: (areaName: string) => { q: string; a: string }[]
  whyHereBullets: (areaName: string) => string[]
}> = {
  'implant': {
    localAngle: (area) => `${area}에서 임플란트를 고민하시는 분들 중 다수가 "수술 후 회복 동안 자주 들를 수 있는 가까운 치과"를 찾으십니다. ${CLINIC.name}은(는) 부평역 26번 출구 도보 1분 거리로, ${area} 어디서도 빠르게 접근 가능합니다. 더불어 고려대 구강악안면외과 의학박사 출신 대표원장이 직접 수술을 집도하며, 스트라우만·오스템·네오 자문의 자격을 보유해 ${area} 주민분들이 멀리 강남까지 가지 않아도 같은 수준의 임플란트를 받으실 수 있습니다.`,
    localFaqs: (area) => [
      { q: `${area}에서 ${CLINIC.name}까지 어떻게 가나요?`, a: `${area}에서는 부평역행 대중교통으로 ${CLINIC.name}에 접근하실 수 있으며, 부평역 26번 출구 도보 1분 거리입니다. 자세한 길찾기는 내원안내 페이지를 참고해 주세요.` },
      { q: '임플란트 수술 후 자주 내원해야 하나요?', a: '수술 후 1주차 봉합 제거, 4~6주차 보철 진행, 이후 정기검진까지 평균 3~5회 내원이 필요합니다. 가까운 위치라 회복 관리가 수월합니다.' },
      { q: '임플란트 비용 상담만 받아도 되나요?', a: '네, CBCT 3D 진단 포함 무료 상담을 진행합니다. 정확한 비용은 잇몸뼈 상태·필요 본수에 따라 다르므로 진단 후 안내해 드립니다.' },
    ],
    whyHereBullets: (area) => [
      `${area}에서 부평역 도보 1분 — 수술 후 잦은 내원도 부담 없음`,
      `의학박사·스트라우만·오스템·네오 공식 자문의 — 강남급 임플란트를 ${area}에서`,
      'CBCT 3D 진단 + 디지털 가이드 수술로 정확도 극대화',
      `${area}에서 ${CLINIC.name}만의 14년 케이스 — 변하지 않는 결과`,
    ],
  },
  'ortho': {
    localAngle: (area) => `${area}에서 교정 치료는 1.5~3년의 장기간 동안 매월 정기 내원이 필수입니다. 출퇴근·등하교 동선에서 자연스럽게 들를 수 있는 위치가 결정적이며, ${CLINIC.name}은(는) 부평역 26번 출구 바로 앞이라 ${area} 학생·직장인분들이 학교/회사 가는 길에 편하게 내원하실 수 있습니다. 인비절라인 우수인증의(Diamond Provider) 자격을 보유한 원장이 투명교정부터 메탈·세라믹·설측까지 라이프스타일에 맞게 설계합니다.`,
    localFaqs: (area) => [
      { q: `${area}에서 부평역까지 매월 내원이 가능할까요?`, a: `${area}에서 부평역까지는 대중교통으로 5~15분 거리로, 한 달에 한 번 정기 점검을 위한 내원은 부담 없는 거리입니다.` },
      { q: '인비절라인(투명교정)도 가능한가요?', a: '네, 인비절라인 Diamond Provider 자격 보유 의사가 진단부터 마무리까지 전 과정을 직접 담당합니다.' },
      { q: '학생 교정 비용은 얼마인가요?', a: '교정 종류와 난이도에 따라 차이가 있으며, 무료 진단 후 정확한 비용을 안내해 드립니다.' },
    ],
    whyHereBullets: (area) => [
      `${area}에서 매월 정기 내원에 최적 — 부평역 도보 1분`,
      '인비절라인 Diamond Provider — 투명교정 1% 의사 자격',
      '메탈·세라믹·설측·투명교정까지 모두 가능',
      `${area} 학생·직장인 라이프스타일에 맞춘 교정 플랜`,
    ],
  },
  'esthetic': {
    localAngle: (area) => `${area} 거주자분들이 ${CLINIC.name}에서 심미보철을 선택하시는 가장 큰 이유는 "강남까지 가지 않아도 같은 수준"이라는 점입니다. 칼짜이스 미세현미경 Extaro 300과 국내 최고 수준의 보철 시스템으로, 원래 내 치아보다 더 자연스러운 결과를 만듭니다. 부평역 도보 1분이라 ${area}에서 통원 부담이 적습니다.`,
    localFaqs: (area) => [
      { q: '심미보철 치료는 몇 번 내원해야 하나요?', a: '단순 보철은 2~3회, 다수 치아 심미 개선은 4~6회 내원이 일반적입니다.' },
      { q: `${area}에서 강남까지 가는 것과 비교해 어떤 차이가 있나요?`, a: `${CLINIC.name}은 칼짜이스 미세현미경, 동일 보철 시스템을 사용하며 강남급 결과물을 만듭니다. 통원 거리·시간·비용 면에서 ${area} 거주자분들께 훨씬 효율적입니다.` },
    ],
    whyHereBullets: (area) => [
      `${area}에서 ${CLINIC.name} — 강남까지 안 가도 같은 결과`,
      '칼짜이스 미세현미경 Extaro 300 — 1mm 단위 정밀 가공',
      '14년 누적 심미보철 케이스 — 자연스러움의 답',
      '내 원래 치아보다 더 아름다운 결과',
    ],
  },
  'laminate': {
    localAngle: (area) => `${area}에서 라미네이트를 알아보시는 분들 중 다수가 결혼·면접·대외 활동 같은 중요한 일정을 앞두고 계십니다. ${CLINIC.name}은(는) 부평역 도보 1분 위치라 ${area}에서 짧은 일정에도 빠르게 진료받으실 수 있으며, 디지털 시뮬레이션으로 결과를 미리 확인한 후 진행합니다.`,
    localFaqs: (area) => [
      { q: '라미네이트 치료 기간은 얼마나 걸리나요?', a: '진단부터 부착까지 평균 2~3주, 보통 2~3회 내원으로 완성됩니다.' },
      { q: `${area}에서 라미네이트 가격은?`, a: '치아 개수·소재(이맥스 / 글로우네이트 등)·범위에 따라 다르므로 진단 후 정확히 안내해 드립니다.' },
    ],
    whyHereBullets: (area) => [
      `${area}에서 부평역 1분 — 결혼·면접 앞두고 빠르게`,
      '디지털 시뮬레이션으로 결과 미리 확인',
      '글로우네이트·이맥스 등 최상위 소재 선택',
      '14년 누적 심미 케이스 노하우',
    ],
  },
  'clear-aligner': {
    localAngle: (area) => `투명교정은 ${area} 직장인·학생분들이 가장 선호하는 교정 방법입니다. ${CLINIC.name}의 인비절라인 Diamond Provider 의사가 ${area}에서 부평역까지의 통원 동선까지 고려해 가장 효율적인 교정 플랜을 설계합니다.`,
    localFaqs: (area) => [
      { q: '인비절라인과 일반 투명교정의 차이는?', a: '인비절라인은 세계 표준 ClinCheck 시뮬레이션과 임상 데이터로 정확도가 가장 높습니다.' },
      { q: `${area}에서 투명교정 진행 시 내원 빈도는?`, a: '평균 6~8주에 1회 정기 점검이 필요하며, 부평역 도보 1분이라 부담이 적습니다.' },
    ],
    whyHereBullets: (area) => [
      `${area}에서 직장인·학생에게 최적 — 거의 보이지 않음`,
      '인비절라인 Diamond Provider 자격',
      'ClinCheck 시뮬레이션 — 결과 미리 확인',
      '식사·양치 자유로워 일상 그대로',
    ],
  },
  'wisdom-tooth': {
    localAngle: (area) => `${area}에서 사랑니로 고민하시는 분들께 가장 중요한 것은 "안전한 발치"입니다. ${CLINIC.name}의 대표원장은 고려대 구강악안면외과 의학박사로, 매복 사랑니·신경 인접 사랑니까지 CBCT 3D 진단으로 안전하게 발치합니다. ${area}에서 부평역 도보 1분이라 부어오름·통증 관리도 빠르게 케어 가능합니다.`,
    localFaqs: (area) => [
      { q: `${area}에서 사랑니 발치 후 빠른 케어가 가능한가요?`, a: `네, 부평역 도보 1분 거리라 ${area} 어디서도 30분 안에 재방문이 가능합니다. 발치 다음날 소독·확인도 부담 없이 진행하실 수 있습니다.` },
      { q: '매복 사랑니도 발치 가능한가요?', a: '구강악안면외과 의학박사가 직접 발치합니다. CBCT 3D 진단으로 신경 위치를 확인 후 안전하게 진행합니다.' },
    ],
    whyHereBullets: (area) => [
      `${area}에서 부평역 1분 — 발치 후 빠른 케어`,
      '구강악안면외과 의학박사 직접 집도',
      'CBCT 3D 진단 — 신경·혈관 위치 확인 후 안전 발치',
      '매복 사랑니·수평 사랑니까지 가능',
    ],
  },
  'general-prosthesis': {
    localAngle: (area) => `${area} 환자분들의 일반보철(크라운·브릿지·틀니)은 정확한 진단과 오래 유지되는 적합도가 핵심입니다. ${CLINIC.name}은(는) 14년간 ${area} 일대 환자분들의 일반보철을 진행하며 축적된 경험으로 오래 가는 결과를 만듭니다.`,
    localFaqs: (area) => [
      { q: '크라운 치료는 몇 번 내원하나요?', a: '평균 2~3회 내원으로 완성됩니다.' },
      { q: `${area}에서 보험 적용 보철이 가능한가요?`, a: '국민건강보험 적용 보철은 만 65세 이상 틀니 등이 있으며, 자세한 사항은 상담 시 안내드립니다.' },
    ],
    whyHereBullets: (area) => [
      `${area} 환자분들의 14년 일반보철 케이스 축적`,
      '오래 가는 적합도 — 미세현미경 정밀 가공',
      '크라운·브릿지·틀니 모든 옵션',
      '보험 적용 여부 정확히 안내',
    ],
  },
  'prevention': {
    localAngle: (area) => `${area} 가족 단위 환자분들의 예방치료(스케일링·불소도포·실란트)는 평생 치아를 지키는 첫 단추입니다. ${CLINIC.name}은(는) 어린이부터 성인까지 ${area} 가족 전체의 정기 관리를 담당합니다.`,
    localFaqs: (area) => [
      { q: '스케일링은 얼마나 자주 받아야 하나요?', a: '국민건강보험 적용으로 1년에 1회 본인부담 약 1만 5천원 선에서 가능합니다.' },
      { q: `${area} 자녀 실란트(치아 홈 메우기) 가능한가요?`, a: '만 18세 이하 영구치 어금니에 대해 건강보험 적용으로 가능합니다.' },
    ],
    whyHereBullets: (area) => [
      `${area} 가족 단위 14년 정기 관리 노하우`,
      '스케일링 건강보험 적용 — 연 1회 약 1.5만원',
      '어린이 실란트·불소도포까지',
      '평생 치아 관리의 시작',
    ],
  },
}

// ============================================================
// 지역별 시그니처 — description / 키워드 다양화 (Phase 1-1: 도어웨이 박멸)
// 각 지역의 특성/랜드마크/인구 특징을 반영해 64개 페이지의 description이
// 단조롭지 않고 지역마다 유니크하게 보이도록 함
// ============================================================
export const AREA_SIGNATURE: Record<string, {
  /** 지역별 랜드마크/특성 — description에 자연 삽입 */
  landmark: string
  /** 지역별 주민 특성 키워드 (학생/직장인/가족 등) */
  demographic: string
  /** 지역별 시간/거리 — 동선 강조 문구 */
  commute: string
  /** description에 들어갈 시그니처 문구 (지역×진료 결합) */
  signature: (treatmentName: string) => string
}> = {
  'bupyeong-station': {
    landmark: '부평역 지하상가 26번 출구 바로 앞',
    demographic: '출퇴근 직장인·환승 통행객',
    commute: '도보 1분',
    signature: (t) => `부평역 26번 출구 도보 1분, 점심시간·퇴근길에도 부담 없는 ${t} 진료. 1호선·인천1호선 환승 거점.`,
  },
  'bupyeong-gu': {
    landmark: '부평구 56만 주민의 중심 상권',
    demographic: '부평1~6동·산곡·청천·갈산·부개·삼산 주민',
    commute: '부평구 전역 접근성 1위',
    signature: (t) => `인천 부평구 ${t}, 14년간 같은 자리 같은 의료진. 부평구 전역에서 부평역으로 모이는 교통 거점.`,
  },
  'bupyeong-dong': {
    landmark: '부평동(1~6동) 중앙상권',
    demographic: '부평동 토박이·신규 이주민 가족',
    commute: '도보 또는 마을버스 5분',
    signature: (t) => `부평동 중앙상권에서 도보권 ${t}. 14년간 부평동 가족 단위 환자분들이 신뢰한 동네 치과.`,
  },
  'sipjeong-dong': {
    landmark: '백운역 인근 주거 밀집지',
    demographic: '십정1·2동 오래된 주민·가족',
    commute: '백운역에서 1호선 1정거장 또는 마을버스 564·570',
    signature: (t) => `십정동에서 1호선 1정거장 ${t}. 백운역·십정시장 인근 주민분들이 14년간 꾸준히 찾으신 치과.`,
  },
  'sangok-dong': {
    landmark: '산곡1~4동 대단지 아파트 밀집',
    demographic: '산곡동 가족·학생·시니어',
    commute: '버스 511·530·556번 10분',
    signature: (t) => `산곡동에서 부평역행 버스 10분 ${t}. 자녀 교정부터 부모님 임플란트까지 가족 단위 케어 가능.`,
  },
  'bugae-dong': {
    landmark: '부개역 인근 주거지',
    demographic: '부개1~3동 직장인·가족',
    commute: '부개역에서 1호선 1정거장',
    signature: (t) => `부개동에서 부개역→부평역 한 정거장 ${t}. 출퇴근 동선 그대로 들르실 수 있는 위치.`,
  },
  'samsan-dong': {
    landmark: '삼산월드체육관·삼산타운 인근',
    demographic: '삼산동 젊은 가족 단위',
    commute: '버스 28·45·555번 15분',
    signature: (t) => `삼산동에서 부평역행 버스 15분 ${t}. 자녀 예방치료부터 라미네이트까지 폭넓게 진료.`,
  },
  'galsan-dong': {
    landmark: '갈산역 인근·인천1호선 거점',
    demographic: '갈산1·2동 직장인·신혼부부',
    commute: '갈산역→부평구청 환승→부평역',
    signature: (t) => `갈산동에서 인천1호선 환승 한 번에 부평역 ${t}. 갈산역 거주자분들의 통근 동선 친화 위치.`,
  },
}

// 진료별 시그니처 — 페이지 메타에 들어갈 진료 핵심 USP
export const TREATMENT_SIGNATURE: Record<string, {
  /** 짧은 USP 한 문장 */
  usp: string
  /** 메타 디스크립션용 핵심 문구 */
  meta: string
}> = {
  'implant': {
    usp: '고려대 구강악안면외과 의학박사·스트라우만/오스템/네오 공식 자문의 직접 집도',
    meta: 'CBCT 3D 진단·디지털 가이드 수술·14년 임상으로 오래가는 임플란트',
  },
  'ortho': {
    usp: '인비절라인 Diamond Provider(국내 1% 의사) 직접 진단·설계',
    meta: '투명교정·메탈·세라믹·설측까지 라이프스타일 맞춤 교정 플랜',
  },
  'esthetic': {
    usp: '칼짜이스 미세현미경 Extaro 300으로 강남급 보철 결과',
    meta: '1mm 단위 정밀 가공, 원래 내 치아보다 자연스러운 심미보철',
  },
  'laminate': {
    usp: '디지털 시뮬레이션으로 결과 미리 확인 후 진행',
    meta: '결혼·면접·중요 일정 전 빠른 진행, 글로우네이트·이맥스 최상위 소재',
  },
  'clear-aligner': {
    usp: '인비절라인 Diamond Provider의 ClinCheck 시뮬레이션 기반 설계',
    meta: '식사·양치 자유로운 투명교정, 일상 그대로 진행하는 교정',
  },
  'wisdom-tooth': {
    usp: '구강악안면외과 의학박사가 CBCT 3D 진단으로 안전 발치',
    meta: '매복 사랑니·신경 인접 사랑니까지 안전하게, 빠른 사후 케어',
  },
  'general-prosthesis': {
    usp: '미세현미경 정밀 가공으로 오래 유지되는 적합도',
    meta: '크라운·브릿지·틀니 모든 옵션, 14년 케이스 축적 노하우',
  },
  'prevention': {
    usp: '어린이부터 시니어까지 가족 단위 정기 관리',
    meta: '스케일링(건강보험)·불소도포·실란트, 평생 치아 관리의 시작',
  },
}

/**
 * Phase 1-1: 지역×진료 다양화된 description 생성기
 * 64개 페이지 모두 다른 description (도어웨이 회피)
 */
export function buildAreaTreatmentDescription(areaSlug: string, treatmentSlug: string, treatmentName: string): string {
  const sig = AREA_SIGNATURE[areaSlug]
  const tSig = TREATMENT_SIGNATURE[treatmentSlug]
  const area = getArea(areaSlug)
  if (!sig || !tSig || !area) {
    return `${area?.name ?? ''} ${treatmentName} - ${CLINIC.name}`
  }
  // 패턴 1: 지역 시그니처 + 진료 USP + 거리
  return `${sig.signature(treatmentName)} ${tSig.usp}. ${area.distance} (${sig.landmark}).`
}

/**
 * Phase 1-1: 지역×진료 다양화된 title 생성기
 * 단순 "부평역 임플란트" → "부평역 임플란트 | 도보 1분, 의학박사 직접 집도 | 부평우리치과"
 */
export function buildAreaTreatmentTitle(areaSlug: string, treatmentName: string): string {
  const sig = AREA_SIGNATURE[areaSlug]
  const area = getArea(areaSlug)
  if (!sig || !area) {
    return `${area?.name ?? ''} ${treatmentName} | ${CLINIC.name}`
  }
  // 60자 이내 유지
  return `${area.name} ${treatmentName} | ${sig.commute}·14년 임상 | ${CLINIC.name}`
}

/**
 * Phase 1-1: 지역×진료 다양화된 키워드 생성기
 * 지역명 + 진료명 + 동선/랜드마크/인구특성까지 풀세트
 */
export function buildAreaTreatmentKeywords(areaSlug: string, treatmentSlug: string, treatmentName: string, treatmentBaseKeywords?: string): string {
  const sig = AREA_SIGNATURE[areaSlug]
  const area = getArea(areaSlug)
  if (!sig || !area) return treatmentBaseKeywords ?? ''
  const list = [
    `${area.name} ${treatmentName}`,
    `${area.name} 치과`,
    `${area.name} ${treatmentName} 잘하는 곳`,
    `${area.name} ${treatmentName} 추천`,
    `${area.name} ${treatmentName} 가격`,
    `${area.district} ${treatmentName}`,
    `${area.name} 근처 치과`,
    treatmentBaseKeywords,
  ].filter(Boolean)
  return list.join(', ')
}

// 헬퍼: 지역 슬러그로 AreaInfo 가져오기
export function getArea(slug: string): AreaInfo | undefined {
  return AREAS.find(a => a.slug === slug)
}

// 헬퍼: 모든 지역×진료 조합 생성 (총 64개)
export function getAllAreaTreatmentCombos(): { area: AreaInfo; treatmentSlug: string }[] {
  const result: { area: AreaInfo; treatmentSlug: string }[] = []
  for (const area of AREAS) {
    for (const tSlug of Object.keys(TREATMENT_LOCAL)) {
      result.push({ area, treatmentSlug: tSlug })
    }
  }
  return result
}
