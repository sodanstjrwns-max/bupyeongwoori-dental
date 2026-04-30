import { Layout } from '../components/Layout'
import { CLINIC, OG_IMAGES } from '../lib/constants'
import { breadcrumbSchema, dentistSchema } from '../lib/schema'

export const VisitPage = () => {
  const priceRows = [
    { cat: '인레이', items: [
      { name: 'Ceramic Inlay (세라믹 인레이)', price: '250,000원' },
    ]},
    { cat: '레진', items: [
      { name: '전치부 레진', price: '200,000원' },
      { name: '구치부 레진', price: '100,000원' },
      { name: 'C/A (치경부 마모 수복)', price: '70,000원' },
      { name: 'Diastema (치아 사이 공간 수복)', price: '200,000원' },
      { name: '레진 빌드업', price: '300,000원' },
    ]},
    { cat: '보존', items: [
      { name: 'Core (코어)', price: '50,000원' },
      { name: 'Casting Post (캐스팅 포스트)', price: '200,000원' },
      { name: 'Post (포스트)', price: '150,000원' },
    ]},
    { cat: '크라운', items: [
      { name: 'Zirconia 전치부 (앞니 지르코니아)', price: '600,000원' },
      { name: 'Zirconia (지르코니아)', price: '450,000원' },
      { name: 'PFM (도재금속관)', price: '420,000원' },
    ]},
    { cat: '임플란트', items: [
      { name: 'Straumann (스트라우만, 스위스)', price: '1,300,000원' },
      { name: 'SIC (스위스)', price: '990,000원' },
      { name: 'Osstem / Point (오스템 / 포인트)', price: '580,000원' },
      { name: 'MEGAGEN (메가젠)', price: '690,000원' },
      { name: 'Neo (CUS ZIR)', price: '500,000원' },
      { name: '기본 뼈이식', price: '300,000원 ~' },
      { name: '상악동 수술', price: '500,000원 ~' },
    ]},
    { cat: '임플란트 보철물', items: [
      { name: 'Zirconia Crown 변경 시', price: '500,000원' },
      { name: 'Pontic (Zirconia)', price: '400,000원' },
      { name: 'Pontic (PFM)', price: '300,000원' },
    ]},
    { cat: '틀니', items: [
      { name: 'RPD (부분 틀니)', price: '1,500,000원' },
      { name: 'FULL (전체 틀니)', price: '2,000,000원' },
    ]},
    { cat: '교정', items: [
      { name: '교정 진단', price: '100,000원' },
      { name: 'Metal Crown (교정용 메탈 크라운)', price: '100,000원' },
      { name: 'Clippy-C (클리피 씨, 자가결찰)', price: '3,200,000원' },
      { name: '인비절라인 (Invisalign)', price: '6,500,000원' },
      { name: '투명 교정', price: '4,500,000원 ~' },
      { name: '설측 교정', price: '5,000,000원 ~' },
      { name: '미니스크류', price: '100,000원' },
      { name: '일반 월 조정료', price: '50,000원' },
      { name: '인비절라인 / 인코그니토 월 조정료', price: '70,000원' },
      { name: '유지장치 (리테이너)', price: '400,000원' },
    ]},
    { cat: '기타', items: [
      { name: '나이트가드 (Night Guard)', price: '400,000원' },
    ]},
  ]

  return (
    <Layout
      title="내원 안내 (오시는 길·진료 시간·수가)"
      description={`${CLINIC.name} 내원 안내 — 부평역 26번 출구 1분 거리, 평일·토요일 진료 시간, 주차 안내, 임플란트·교정·라미네이트 주요 진료 수가까지 모든 방문 정보를 한 페이지에서.`}
      keywords="부평우리치과 오시는 길, 부평역 치과, 부평 치과 위치, 부평 치과 진료시간, 부평 치과 수가"
      canonical={`https://${CLINIC.domain}/visit`}
      ogImage={OG_IMAGES.visit}
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
                <a href={CLINIC.socialLinks.naverBooking} target="_blank" rel="noopener" class="btn btn-primary" style="background:#03C75A; border-color:#03C75A;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z"/></svg>
                  네이버 예약
                </a>
                <a href={CLINIC.socialLinks.kakao} target="_blank" rel="noopener" class="btn" style="background:#FEE500; color:#3A1D1D; border:none;">
                  <i class="fas fa-comment"></i> 카카오톡 상담
                </a>
                <a href={`tel:${CLINIC.phone}`} class="btn btn-dark">
                  <i class="fas fa-phone"></i> 전화 상담
                </a>
                <a href={CLINIC.socialLinks.naverPlace} target="_blank" rel="noopener" class="btn btn-ghost">
                  <i class="fas fa-map"></i> 네이버 지도
                </a>
              </div>

              <div style="margin-top:24px; padding-top:20px; border-top:1px solid var(--ink-100); display:flex; gap:14px; align-items:center; flex-wrap:wrap;">
                <span style="font-size:.85rem; color:var(--ink-500); font-weight:600; letter-spacing:.05em;">SNS</span>
                <a href={CLINIC.socialLinks.blog} target="_blank" rel="noopener" aria-label="네이버 블로그" title="네이버 블로그" style="width:38px; height:38px; border-radius:50%; background:var(--paper); display:inline-flex; align-items:center; justify-content:center; color:var(--ink-700); transition:all .2s;"><i class="fas fa-blog"></i></a>
                <a href={CLINIC.socialLinks.instagram} target="_blank" rel="noopener" aria-label="인스타그램" title="인스타그램" style="width:38px; height:38px; border-radius:50%; background:var(--paper); display:inline-flex; align-items:center; justify-content:center; color:var(--ink-700);"><i class="fab fa-instagram"></i></a>
                <a href={CLINIC.socialLinks.youtube} target="_blank" rel="noopener" aria-label="유튜브" title="유튜브" style="width:38px; height:38px; border-radius:50%; background:var(--paper); display:inline-flex; align-items:center; justify-content:center; color:var(--ink-700);"><i class="fab fa-youtube"></i></a>
                <a href={CLINIC.socialLinks.facebook} target="_blank" rel="noopener" aria-label="페이스북" title="페이스북" style="width:38px; height:38px; border-radius:50%; background:var(--paper); display:inline-flex; align-items:center; justify-content:center; color:var(--ink-700);"><i class="fab fa-facebook-f"></i></a>
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
            <p class="section-lead">야간·주말 진료도 제공합니다. <a href={CLINIC.socialLinks.naverBooking} target="_blank" rel="noopener" style="color:#03C75A; font-weight:700; border-bottom:1px solid currentColor;">네이버 예약</a> 또는 전화로 사전 예약을 권장드립니다.</p>
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
            위 수가는 <strong>비급여 항목의 표준 안내가</strong>이며, 부가세 별도입니다.
            구강 상태·뼈 조건·재료·난이도에 따라 달라질 수 있어 <strong>정밀 진단 후 개별 플랜으로 정확히 안내</strong>드립니다.
            건강보험 적용 항목(스케일링·신경치료·발치·만 65세 이상 임플란트 등)과 의료비 공제 여부도 함께 확인해 드립니다.
          </p>
        </div>
      </section>
    </Layout>
  )
}
