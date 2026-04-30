import { CLINIC } from '../lib/constants'

// 우하단 floating 상담/예약 버튼
// 모든 페이지 공통, JS는 app.js에서 스크롤/토글 처리
export const FloatingCta = () => {
  return (
    <div class="floating-cta" id="floating-cta" aria-label="상담·예약 바로가기">
      <button
        type="button"
        class="floating-cta-toggle"
        id="floating-cta-toggle"
        aria-expanded="false"
        aria-controls="floating-cta-menu"
        title="상담·예약"
      >
        <span class="floating-cta-icon-default" aria-hidden="true">
          <i class="fas fa-comment-dots"></i>
        </span>
        <span class="floating-cta-icon-close" aria-hidden="true">
          <i class="fas fa-xmark"></i>
        </span>
        <span class="sr-only">상담·예약 메뉴 열기</span>
      </button>
      <div class="floating-cta-menu" id="floating-cta-menu" role="menu">
        <a
          href={CLINIC.socialLinks.kakao}
          target="_blank"
          rel="noopener"
          class="floating-cta-item floating-cta-kakao"
          role="menuitem"
          title="카카오톡 상담"
        >
          <span class="floating-cta-item-icon"><i class="fas fa-comment"></i></span>
          <span class="floating-cta-item-label">카카오톡 상담</span>
        </a>
        <a
          href={CLINIC.socialLinks.naverBooking}
          target="_blank"
          rel="noopener"
          class="floating-cta-item floating-cta-naver"
          role="menuitem"
          title="네이버 예약"
        >
          <span class="floating-cta-item-icon"><i class="fas fa-calendar-check"></i></span>
          <span class="floating-cta-item-label">네이버 예약</span>
        </a>
        <a
          href={`tel:${CLINIC.phone}`}
          class="floating-cta-item floating-cta-phone"
          role="menuitem"
          title="전화 상담"
        >
          <span class="floating-cta-item-icon"><i class="fas fa-phone"></i></span>
          <span class="floating-cta-item-label">{CLINIC.phone}</span>
        </a>
      </div>
    </div>
  )
}
