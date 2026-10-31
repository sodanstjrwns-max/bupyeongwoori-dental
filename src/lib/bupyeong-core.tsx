// ============================================================
// "부평 치과" 핵심 하위 페이지 6개 + 사진 카드 (2026-10-14)
// - 허브 /areas/bupyeong-gu 아래 지역×진료 8개 중 핵심 6개(URL 유지).
// - 페이지마다 고유 실사 1장: og(1200×630 jpg) = 본문 첫 사진 = JSON-LD image = 사이트맵 image:image.
//   카드 썸네일은 같은 사진의 600×600 정사각 크롭 (public/static/img/cards/).
// - 사진 출처: R2 bupyeongwoori-media 의 원내·진료 사진(/media/clinic·doctors·treatments) — 전후 사진 사용 안 함.
// - 카드 한 줄 설명은 진료 데이터(treatments.ts)의 기존 tagline 그대로.
// ============================================================
import { CLINIC } from './constants'
import { TREATMENT_LIST } from '../data/treatments'

const BASE = `https://${CLINIC.domain}`
export const BUPYEONG_HUB = 'bupyeong-gu'
const IMG = '/static/img/cards'

export type CoreCard = {
  /** 진료 slug (/areas/bupyeong-gu/<slug>) */
  slug: string
  /** 카드·제목 앞부분 "부평 {진료}" */
  name: string
  /** 제목 뒤 선택 기준 */
  criterion: string
  /** 메타 디스크립션 (기존 페이지 본문에 있는 사실만) */
  description: string
  /** 카드 한 줄 (treatments.ts tagline) */
  line: string
  /** 사진 설명 (alt·image:title) */
  alt: string
  og: string
  card: string
  cardWebp: string
}

const RAW: Omit<CoreCard, 'line' | 'og' | 'card' | 'cardWebp'>[] = [
  {
    slug: 'implant',
    name: '부평 임플란트',
    criterion: 'CBCT 진단·내원 횟수·회복 일정',
    description: `부평구 부평역 26번 출구 앞 ${CLINIC.name} 임플란트 안내. CBCT 3D로 잇몸뼈를 확인한 뒤 통합치의학과 전문의 대표원장과 의료진이 수술 계획을 세웁니다. 수술 뒤 내원 횟수와 상담 방법을 정리했습니다.`,
    alt: '부평 임플란트 — 부평우리치과 진료실에서 모니터 영상을 보며 진료하는 장면',
  },
  {
    slug: 'ortho',
    name: '부평 치아교정',
    criterion: '매월 내원 동선과 교정 장치 선택',
    description: `부평구에서 치아교정을 알아보신다면 — 1.5~3년 매월 내원이 필요한 교정은 동선이 중요합니다. 부평역 26번 출구 앞 ${CLINIC.name}의 교정과 전문의 진료, 메탈·세라믹·투명교정 선택 기준을 안내합니다.`,
    alt: '부평 치아교정 — 부평우리치과 교정 치료 상담실',
  },
  {
    slug: 'esthetic',
    name: '부평 심미보철',
    criterion: '내원 횟수와 자연스러운 보철 기준',
    description: `부평구 ${CLINIC.name} 심미보철 안내. 칼짜이스 미세현미경 Extaro 300과 디지털 구강스캐너로 치아를 확인하고, 단순 보철 2~3회·여러 치아 4~6회 내원 기준으로 계획합니다.`,
    alt: '부평 심미보철 — 부평우리치과 디지털 구강스캐너와 보철 설계 화면',
  },
  {
    slug: 'laminate',
    name: '부평 라미네이트',
    criterion: '치료 기간·소재 선택 기준',
    description: `부평구에서 라미네이트를 알아보신다면 — 진단부터 부착까지 평균 2~3주, 2~3회 내원. 이맥스·글로우네이트 등 소재와 범위는 진단 뒤 정합니다. 부평역 26번 출구 앞 ${CLINIC.name}.`,
    alt: '부평 라미네이트 — 트레이 위에 놓인 앞니 라미네이트 보철물',
  },
  {
    slug: 'clear-aligner',
    name: '부평 투명교정',
    criterion: '인비절라인 내원 주기와 착용 관리',
    description: `부평구 ${CLINIC.name} 투명교정 안내. Invisalign 우수인증의 원장이 ClinCheck 시뮬레이션으로 계획하고, 평균 6~8주에 한 번 점검합니다. 탈착식이라 식사·양치가 자유로운 대신 착용 시간 관리가 중요합니다.`,
    alt: '부평 투명교정 — 투명 장치로 치아가 이동하는 과정을 보여주는 모형',
  },
  {
    slug: 'wisdom-tooth',
    name: '부평 사랑니발치',
    criterion: '매복 사랑니 CBCT 확인과 사후 관리',
    description: `부평구에서 사랑니 발치를 고민하신다면 — CBCT 3D로 신경 위치를 확인한 뒤 매복·수평 사랑니를 발치합니다. 발치 다음날 소독도 부평역 26번 출구 앞에서.`,
    alt: '부평 사랑니발치 — 부평우리치과 대표원장이 X-ray 영상을 보며 설명하는 장면',
  },
]

export const BUPYEONG_CORE: CoreCard[] = RAW.map((c) => {
  const t = TREATMENT_LIST.find((x) => x.slug === c.slug)
  const key = `bupyeong-${c.slug}`
  return {
    ...c,
    line: t?.tagline ?? '',
    og: `${IMG}/${key}-1200x630.jpg`,
    card: `${IMG}/${key}-600.jpg`,
    cardWebp: `${IMG}/${key}-600.webp`,
  }
})

/** 허브 대표 사진(og·본문) — 원내 안내데스크·라운지 */
export const BUPYEONG_HUB_IMAGE = {
  og: `${IMG}/bupyeong-hub-1200x630.jpg`,
  alt: '부평 치과 — 부평우리치과 안내데스크와 라운지형 대기 공간',
}

export const getCore = (areaSlug: string, treatmentSlug: string): CoreCard | undefined =>
  areaSlug === BUPYEONG_HUB ? BUPYEONG_CORE.find((c) => c.slug === treatmentSlug) : undefined

export const coreUrl = (c: CoreCard) => `/areas/${BUPYEONG_HUB}/${c.slug}`
export const coreTitle = (c: CoreCard) => `${c.name} | ${c.criterion} — ${CLINIC.name}`
export const abs = (p: string) => (p.startsWith('http') ? p : `${BASE}${p}`)

/** 사진 카드 그리드. compact=하위 페이지 하단 형제 카드 */
export const CoreCardGrid = ({ cards, idPrefix, compact }: { cards: CoreCard[]; idPrefix: string; compact?: boolean }) => (
  <ul class={`bpc-grid${compact ? ' bpc-grid--compact' : ''}`} role="list">
    {cards.map((c, i) => (
      <li>
        <a class="bpc-card" href={coreUrl(c)} aria-labelledby={`${idPrefix}-${c.slug}`}>
          <span class="bpc-media">
            <picture>
              <source type="image/webp" srcset={c.cardWebp} />
              <img src={c.card} width="600" height="600" loading="lazy" decoding="async" alt={c.name} />
            </picture>
          </span>
          <span class="bpc-body">
            <span class="bpc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <strong class="bpc-title" id={`${idPrefix}-${c.slug}`}>{c.name}</strong>
            {compact ? null : <span class="bpc-line">{c.line}</span>}
          </span>
        </a>
      </li>
    ))}
  </ul>
)

/** 화면 카드와 1:1 ItemList (같은 순서·이름·URL·사진) */
export const coreItemListLd = (cards: CoreCard[], pageUrl: string, name: string) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${pageUrl}#bupyeong-core`,
  name,
  numberOfItems: cards.length,
  itemListElement: cards.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    url: abs(coreUrl(c)),
    image: abs(c.card),
  })),
})
