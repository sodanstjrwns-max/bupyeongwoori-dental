import { Layout } from '../components/Layout'
import { CLINIC } from '../lib/constants'
import { breadcrumbSchema, dentistSchema } from '../lib/schema'

export const VisitPage = () => {
  const priceRows = [
    { cat: '진단', items: [
      { name: '구강 검진 + 파노라마', price: '무료' },
      { name: 'CBCT 3D 촬영', price: '30,000 ~ 80,000원' },
      { name: '진단·상담', price: '무료' },
    ]},
    { cat: '보존·예방', items: [
      { name: '스케일링 (건강보험)', price: '연 1회 건강보험 적용' },
      { name: '불소 도포', price: '30,000 ~ 50,000원' },
      { name: '실란트 (어린이)', price: '건강보험 적용' },
      { name: '레진 수복 (치아당)', price: '100,000 ~ 180,000원' },
      { name: '신경치료', price: '150,000원대 ~ (보험 일부 적용)' },
    ]},
    { cat: '보철', items: [
      { name: 'PFM 크라운', price: '400,000 ~ 550,000원' },
      { name: '지르코니아 크라운', price: '550,000 ~ 750,000원' },
      { name: 'e.max 올세라믹 크라운', price: '650,000 ~ 900,000원' },
      { name: '라미네이트', price: '650,000 ~ 900,000원' },
      { name: '인레이/온레이', price: '250,000 ~ 450,000원' },
    ]},
    { cat: '임플란트', items: [
      { name: '국산 임플란트 (픽스쳐 + 보철)', price: '1,100,000원대 ~' },
      { name: '스트라우만 임플란트', price: '1,500,000원대 ~' },
      { name: '뼈이식 추가', price: '200,000 ~ 500,000원' },
      { name: '상악동 거상술', price: '500,000 ~ 1,000,000원' },
      { name: '만 65세 이상 건강보험 임플란트', price: '평생 2개, 본인부담금 30%' },
    ]},
    { cat: '교정', items: [
      { name: '메탈 교정 (전체)', price: '3,500,000 ~ 5,000,000원' },
      { name: '세라믹 교정 (전체)', price: '4,500,000 ~ 6,000,000원' },
      { name: '투명교정 인비절라인', price: '5,500,000 ~ 8,000,000원' },
      { name: '부분 교정', price: '1,500,000 ~ 3,000,000원' },
    ]},
    { cat: '외과', items: [
      { name: '단순 발치', price: '건강보험 적용' },
      { name: '매복 사랑니 발치', price: '건강보험 적용 (난이도별 차등)' },
      { name: '완전 매복 사랑니 발치', price: '건강보험 + 본인부담 소정' },
    ]},
  ]

  return (
    <Layout
      title="내원 안내 (오시는 길·진료 시간·수가)"
      description={`${CLINIC.name} 오시는 길, 진료 시간, 주요 진료 수가 안내.`}
      keywords="부평우리치과 오시는 길, 부평역 치과, 부평 치과 위치, 부평 치과 진료시간, 부평 치과 수가"
      canonical={`https://${CLINIC.domain}/visit`}
      jsonLd={[
        dentistSchema(),
        breadcrumbSchema([{ name: '홈', url: '/' }, { name: '내원안내', url: '/visit' }]),
      ]}
    >
      <section class="page-hero">
        <div class="container">
          <div class="page-eyebrow">VISIT</div>
          <h1 class="page-title">오시는 길</h1>
          <p class="page-lead">부평역 지하상가 26번 출구로 나오시면 바로입니다.</p>
        </div>
      </section>

      {/* Address + Map */}
      <section class="section" style="padding-top:40px;">
        <div class="container">
          <div class="visit-grid">
            <div class="visit-info">
              <h2 class="visit-h">주소 & 연락처</h2>
              <ul class="visit-list">
                <li><strong>주소</strong><span>{CLINIC.address}</span></li>
                <li><strong>가는 길</strong><span>{CLINIC.directions}</span></li>
                <li><strong>대표전화</strong><a href={`tel:${CLINIC.phone}`}>{CLINIC.phone}</a></li>
                <li><strong>이메일</strong><a href={`mailto:${CLINIC.email}`}>{CLINIC.email}</a></li>
              </ul>

              <div class="visit-route">
                <h3>대중교통</h3>
                <ul>
                  <li><strong>지하철 1호선·인천1호선 부평역</strong> 지하상가 26번 출구 도보 1분</li>
                  <li>버스 정류장: 부평역 각 노선</li>
                </ul>
              </div>
              <div class="visit-route">
                <h3>주차 안내</h3>
                <p>건물 지하 주차장 이용 가능. 진료 시 주차권 확인 발행.</p>
              </div>

              <div style="margin-top:32px; display:flex; gap:10px; flex-wrap:wrap;">
                <a href={`tel:${CLINIC.phone}`} class="btn btn-primary">
                  <i class="fas fa-phone"></i> 전화 상담
                </a>
                <a href="https://map.naver.com/v5/search/부평우리치과" target="_blank" rel="noopener" class="btn btn-dark">
                  <i class="fas fa-map"></i> 네이버 지도
                </a>
              </div>
            </div>

            <div class="visit-map">
              <iframe
                src="https://www.google.com/maps?q=인천광역시+부평구+부평대로+16&output=embed"
                width="100%"
                height="520"
                style="border:0; border-radius:16px;"
                allowfullscreen={true}
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="부평우리치과 위치"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Hours */}
      <section id="hours" class="section section-soft">
        <div class="container">
          <div class="section-head" data-reveal>
            <div class="section-eyebrow">HOURS</div>
            <h2 class="section-title">진료 <em>시간</em></h2>
            <p class="section-lead">야간·주말 진료도 제공합니다. 내원 전 전화 예약을 권장드립니다.</p>
          </div>

          <div class="hours-grid">
            {CLINIC.hours.map((h) => (
              <div class={`hours-row ${!h.isOpen ? 'closed' : ''}`}>
                <span class="hours-day">{h.day}</span>
                <span class="hours-time">{h.time}</span>
              </div>
            ))}
          </div>
          <p class="visit-note">{CLINIC.lunch}</p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" class="section">
        <div class="container">
          <div class="section-head" data-reveal>
            <div class="section-eyebrow">PRICING</div>
            <h2 class="section-title">수가 <em>안내</em></h2>
            <p class="section-lead">
              실제 비용은 구강 상태·사용 재료·뼈 조건에 따라 달라질 수 있습니다.
              <br />
              진단 후 정확한 플랜과 함께 투명하게 안내드립니다.
            </p>
          </div>

          <div class="price-table-wrap" data-reveal>
            {priceRows.map((cat) => (
              <table class="price-table">
                <thead>
                  <tr>
                    <th>{cat.cat}</th>
                    <th>안내 수가</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.items.map((it) => (
                    <tr>
                      <td>{it.name}</td>
                      <td>{it.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>

          <p class="visit-note">
            위 수가는 참고용이며, <strong>CBCT 3D 진단 후 개별 상담으로 정확히 안내</strong>드립니다.
            건강보험·의료비 공제 적용 여부도 함께 확인해 드립니다.
          </p>
        </div>
      </section>
    </Layout>
  )
}
