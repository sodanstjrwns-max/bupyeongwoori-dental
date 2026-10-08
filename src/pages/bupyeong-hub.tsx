// ============================================================
// "부평 치과" 대표 허브 — /areas/bupyeong-gu (URL 유지, 2026-10-08 허브 승격)
// 검색어 "부평 치과"·"부평역 치과"로 찾는 분께 필요한 실제 정보만 한 페이지에:
// 위치·찾아오는 길 / 진료시간 / 의료진 / 주요 진료 / 장비 / 지역 주민 FAQ / 지도·예약.
// 주소·시간·의료진·장비 값은 모두 constants.ts·doctors.ts·treatments.ts 단일 출처에서 가져온다.
// 문장은 다른 지역 페이지와 재사용하지 않는다.
// ============================================================
import { Layout } from '../components/Layout'
import { CLINIC, EQUIPMENTS, HOURS, OG_IMAGES } from '../lib/constants'
import { CONTENT_DATES } from '../lib/content-dates'
import { DOCTORS } from '../data/doctors'
import { TREATMENT_LIST } from '../data/treatments'
import { AREAS, TREATMENT_LOCAL, type AreaInfo } from '../data/areas'
import { breadcrumbSchema, dentistSchema, faqSchema } from '../lib/schema'
import { CtaSection } from '../components/CtaSection'

const BASE = `https://${CLINIC.domain}`
export const BUPYEONG_HUB_SLUG = 'bupyeong-gu'
const HUB_URL = `${BASE}/areas/${BUPYEONG_HUB_SLUG}`

const open = HOURS.filter((h) => h.opens)
const latest = [...open].sort((a, b) => (a.closes! < b.closes! ? 1 : -1))[0]
const sat = HOURS.find((h) => h.en === 'Saturday')!
const lateDays = open.filter((h) => h.en !== 'Saturday' && h.closes! > '18:00')

// 지역 주민이 실제로 묻는 질문 — 화면(#hub-faq)과 FAQPage 스키마가 같은 배열을 쓴다 (1:1)
const HUB_FAQS: { q: string; a: string }[] = [
  {
    q: '부평역에서 부평우리치과까지 어떻게 가나요?',
    a: `지하철 1호선·인천1호선 부평역에서 지하상가 26번 출구로 올라오시면 바로 앞 건물(${CLINIC.addressShort} 에이플러스에셋빌딩)입니다. 출구에서 걸어서 1분 정도 걸립니다.`,
  },
  {
    q: '퇴근 후나 토요일에도 진료를 받을 수 있나요?',
    a: `${lateDays.map((h) => `${h.day}은 ${h.closes}`).join(', ')}까지 진료해 퇴근 뒤 방문이 가능하고, 토요일은 ${sat.opens}–${sat.closes}에 진료합니다. 일요일은 휴진이며 ${CLINIC.lunch.replace('점심시간 ', '점심시간은 ')}입니다.`,
  },
  {
    q: '차를 가지고 가도 주차할 수 있나요?',
    a: '건물 지하 주차장을 이용하실 수 있고, 진료를 받으시면 주차권을 확인해 드립니다. 주차 가능 여부가 걱정되시면 방문 전에 전화로 문의해 주세요.',
  },
  {
    q: '예약은 어떻게 하나요? 당일 방문도 되나요?',
    a: `예약제로 운영합니다. 네이버 예약, 전화(${CLINIC.phone}), 카카오톡 채널로 예약하실 수 있으며 ${CLINIC.responseExpectation.kakao} 통증이 심한 당일 내원은 먼저 전화로 가능한 시간을 확인해 주세요.`,
  },
  {
    q: '계양구·부천처럼 부평구 밖에서도 다니기 편한가요?',
    a: '부평역은 1호선과 인천1호선이 만나는 환승역이라 계양구·서구·남동구와 부천 송내·중동 방면에서도 갈아타지 않거나 한 번만 갈아타고 오실 수 있습니다. 교정처럼 여러 번 내원하는 진료라면 오가는 동선도 함께 따져 보시길 권합니다.',
  },
  {
    q: '어떤 진료를 받을 수 있나요?',
    a: `임플란트·심미보철·치아교정·일반보철·예방치료·라미네이트·투명교정·사랑니발치를 진료합니다. 구강외과 의학박사 대표원장과 교정과·보존과 전문의, 보철학회 인정의 원장이 함께 진료해 한 곳에서 진단부터 마무리까지 이어집니다.`,
  },
]

const doctorLine = (slug: string) => {
  const d = DOCTORS.find((x) => x.slug === slug)
  if (!d) return null
  // 학위(박사·석사) → 전문의·인정의 자격 → 학회 활동 순으로 대표 사실 1개 (협회 정회원은 제외)
  const fact =
    (d.education ?? []).find((e) => /박사|석사/.test(e)) ??
    (d.certifications ?? [])[0] ??
    (d.careers ?? []).find((c) => !c.includes('대한치과의사협회')) ??
    ''
  return { name: d.name, title: d.title, slug: d.slug, fact }
}

export const BupyeongHubPage = ({ area }: { area: AreaInfo }) => {
  const reviewed = CONTENT_DATES.bupyeongHub
  const treatments = Object.keys(TREATMENT_LOCAL)
    .map((slug) => TREATMENT_LIST.find((t) => t.slug === slug))
    .filter(Boolean) as typeof TREATMENT_LIST
  const doctors = DOCTORS.map((d) => doctorLine(d.slug)).filter(Boolean) as NonNullable<ReturnType<typeof doctorLine>>[]
  const nearby = AREAS.filter((a) => a.slug !== BUPYEONG_HUB_SLUG)

  return (
    <Layout
      title="부평 치과"
      description={`부평 치과 찾으신다면 — 부평역 26번 출구 바로 앞 ${CLINIC.name}. ${CLINIC.addressShort}, ${latest.day} ${latest.closes}까지 야간·토요일 진료, 의료진 ${DOCTORS.length}명, 임플란트·교정·심미보철 등 8개 진료와 찾아오는 길·주차·예약 방법을 정리했습니다.`}
      canonical={HUB_URL}
      keywords="부평 치과, 부평역 치과, 부평구 치과, 부평 치과 야간진료, 부평 치과 토요일, 부평역 26번 출구 치과, 부평우리치과"
      ogImage={OG_IMAGES.visit}
      jsonLd={[
        breadcrumbSchema([
          { name: '홈', url: '/' },
          { name: '지역별 안내', url: '/areas' },
          { name: '부평 치과', url: `/areas/${BUPYEONG_HUB_SLUG}` },
        ]),
        dentistSchema(),
        {
          '@context': 'https://schema.org',
          '@type': ['WebPage', 'MedicalWebPage'],
          '@id': `${HUB_URL}#webpage`,
          url: HUB_URL,
          name: `부평 치과 | ${CLINIC.name}`,
          description: `부평역 26번 출구 앞 ${CLINIC.name}의 위치·진료시간·의료진·진료 안내`,
          inLanguage: 'ko-KR',
          isPartOf: { '@id': `${BASE}/#website` },
          about: { '@id': `${BASE}/#clinic` },
          mainEntity: { '@id': `${BASE}/#clinic` },
          areaServed: [
            { '@type': 'AdministrativeArea', name: '인천광역시 부평구' },
            { '@type': 'Place', name: '인천 부평구 부평역', geo: { '@type': 'GeoCoordinates', latitude: 37.4894, longitude: 126.7245 } },
            ...nearby.filter((a) => a.slug !== 'bupyeong-station').map((a) => ({ '@type': 'Place', name: a.nameFull })),
          ],
          dateModified: reviewed,
          publisher: { '@id': `${BASE}/#clinic` },
          speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.page-title', '#hub-answer'] },
        },
        faqSchema(HUB_FAQS),
      ]}
    >
      <section class="page-hero">
        <div class="container">
          <div class="page-eyebrow">인천 부평구 · 부평역 26번 출구</div>
          <h1 class="page-title">
            부평 치과,<br/>
            <em class="ph-mint-3">{CLINIC.name}</em>
          </h1>
          <p class="page-lead" id="hub-answer">
            {CLINIC.name}는 {CLINIC.address}에 있는 치과입니다. 부평역 지하상가 26번 출구로 나오면 바로 앞이라
            걸어서 1분이면 도착하고, {CLINIC.since}년 개원 후 같은 자리에서 진료하고 있습니다.
            {lateDays.length > 0 ? ` ${lateDays.map((h) => `${h.day}은 ${h.closes}`).join(', ')}까지,` : ''} 토요일은 오전부터 {sat.closes}까지 문을 엽니다.
          </p>
          <div style="margin-top:24px; display:flex; gap:10px; flex-wrap:wrap;">
            <a href={CLINIC.socialLinks.naverBooking} target="_blank" rel="noopener" class="btn btn-primary" style="background:#03C75A; border-color:#03C75A;">네이버 예약</a>
            <a href={`tel:${CLINIC.phone}`} class="btn btn-dark"><i class="fas fa-phone"></i> {CLINIC.phone}</a>
            <a href={CLINIC.socialLinks.naverPlace} target="_blank" rel="noopener" class="btn btn-ghost"><i class="fas fa-map"></i> 네이버 지도</a>
          </div>
        </div>
      </section>

      {/* 위치·찾아오는 길 */}
      <section class="section section-soft">
        <div class="container" style="max-width:900px;">
          <h2 class="section-title">부평역에서 찾아오는 길</h2>
          <div class="prose">
            <p>
              병원은 부평대로의 에이플러스에셋빌딩에 있습니다. 1호선·인천1호선 부평역에서 내려 지하상가 안내판을 따라
              26번 출구로 나오시면 바로 앞이 병원 건물입니다. 버스는 부평역 정류장에 서는 노선을 이용하시면 됩니다.
            </p>
            <ul>
              <li><strong>주소</strong> — {CLINIC.address}</li>
              <li><strong>지하철</strong> — 부평역(1호선·인천1호선) 지하상가 26번 출구 앞, 도보 약 1분</li>
              <li><strong>버스</strong> — 부평역 정류장 하차</li>
              <li><strong>주차</strong> — 건물 지하 주차장, 진료 시 주차권 확인</li>
            </ul>
            <p>
              역 출구별 자세한 동선은 <a href="/areas/bupyeong-station">부평역 치과 안내</a>, 지도와 주차 안내는{' '}
              <a href="/visit">오시는 길</a> 페이지에서 확인하실 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 진료시간 */}
      <section class="section">
        <div class="container" style="max-width:900px;">
          <h2 class="section-title">부평 치과 진료시간</h2>
          <div class="hours-grid">
            {CLINIC.hours.map((h) => (
              <div class={`hours-row ${!h.isOpen ? 'closed' : ''}`}>
                <span class="hours-day">{h.day}</span>
                <span class="hours-time">{h.time}</span>
              </div>
            ))}
          </div>
          <p class="visit-note">
            {CLINIC.lunch}. 늦게까지 진료하는 요일과 토요일에 원하시는 시간이 있다면 미리 예약해 두시는 것이 좋습니다.
          </p>
        </div>
      </section>

      {/* 의료진 */}
      <section class="section section-soft">
        <div class="container" style="max-width:900px;">
          <h2 class="section-title">진료하는 의료진</h2>
          <p style="color:var(--ink-600); margin-bottom:20px;">
            분야가 다른 원장 {DOCTORS.length}명이 한 병원에서 진료합니다. 임플란트 수술과 보철, 교정, 신경치료를 각자 맡은 원장이
            상의해 계획을 세우기 때문에 여러 진료가 겹치는 경우에도 병원을 옮겨 다닐 필요가 줄어듭니다.
          </p>
          <ul class="prose" style="list-style:none; padding-left:0;">
            {doctors.map((d) => (
              <li style="margin-bottom:10px;">
                <a href={`/doctors/${d.slug}`}><strong>{d.name} {d.title}</strong></a>
                {d.fact ? <> — {d.fact}</> : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 주요 진료 */}
      <section class="section">
        <div class="container">
          <h2 class="section-title">부평우리치과 주요 진료</h2>
          <div class="area-treatment-grid">
            {treatments.map((t) => (
              <a href={`/treatments/${t.slug}`} class="area-treatment-card" data-reveal>
                <div class="area-treatment-head">
                  <div class="area-treatment-tag">{t.isCore ? '★ 핵심진료' : '진료'}</div>
                  <h3>{t.name}</h3>
                </div>
                <div class="area-treatment-cta">{t.name} 자세히 →</div>
              </a>
            ))}
          </div>
          <p style="margin-top:28px; color:var(--ink-600); text-align:center;">
            부평구 주민분께 맞춘 진료별 안내:{' '}
            {treatments.map((t, i) => (
              <>
                {i > 0 ? ' · ' : ''}
                <a href={`/areas/${BUPYEONG_HUB_SLUG}/${t.slug}`}>부평구 {t.name}</a>
              </>
            ))}
          </p>
        </div>
      </section>

      {/* 장비 */}
      <section class="section section-soft">
        <div class="container" style="max-width:900px;">
          <h2 class="section-title">진단·치료 장비</h2>
          <ul class="prose">
            {EQUIPMENTS.map((e) => (
              <li><strong>{e.name}</strong> {e.count > 1 ? `${e.count}${e.name.includes('핸드피스') ? '개' : '대'}` : ''} — {e.desc}</li>
            ))}
          </ul>
          <p style="color:var(--ink-600);">
            핸드피스는 환자 한 분마다 멸균된 것을 따로 쓰는 1인 1핸드피스 원칙으로 관리합니다. 장비 용어가 낯설다면{' '}
            <a href="/glossary/cbct">콘빔 CT</a>, <a href="/glossary/zeiss-extaro">칼짜이스 Extaro 300</a> 같은 백과사전 설명을 참고해 주세요.
          </p>
        </div>
      </section>

      {/* FAQ — 화면과 FAQPage 스키마 1:1 */}
      <section class="section" id="hub-faq">
        <div class="container" style="max-width:900px;">
          <h2 class="section-title">부평 치과, 자주 묻는 질문</h2>
          <div class="accordion">
            {HUB_FAQS.map((f) => (
              <details>
                <summary>{f.q}</summary>
                <div class="answer">{f.a}</div>
              </details>
            ))}
          </div>
          <p style="margin-top:24px; font-size:.84rem; color:var(--ink-500);">
            최종 수정 <time datetime={reviewed}>{reviewed}</time> · 진료시간·주차 등 운영 정보는 병원 사정에 따라 바뀔 수 있어 방문 전 전화로 확인해 주세요.
          </p>
        </div>
      </section>

      {/* 인근 지역 */}
      <section class="section section-soft">
        <div class="container" style="max-width:900px;">
          <h2 class="section-title">부평구 동네별 안내</h2>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            {nearby.map((a) => (
              <a href={`/areas/${a.slug}`} class="chip">{a.name} 치과</a>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        eyebrow="CONTACT · 부평역 26번 출구 앞"
        title="부평에서 치과를 찾고 계신다면."
        lead={`예약은 네이버 예약·전화(${CLINIC.phone})·카카오톡으로 받습니다. 진료 가능 여부부터 편하게 물어보세요.`}
      />
    </Layout>
  )
}
