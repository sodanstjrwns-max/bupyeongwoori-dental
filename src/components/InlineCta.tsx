import { CLINIC } from '../lib/constants'

type InlineCtaProps = {
  title?: string
  lead?: string
  /** 좌측에 보일 보조 액션 (목록 등). 텍스트와 href 지정 */
  backLabel?: string
  backHref?: string
  /** 카테고리 보조 링크 (백과사전 분야 보기 등) */
  extraLabel?: string
  extraHref?: string
}

/**
 * 콘텐츠 디테일 본문 하단에 박는 통일된 인라인 CTA 박스
 * - 네이버 예약 + 카카오톡 상담 + 전화 3개 동선 통일
 * - 페이지 성격에 맞춰 title/lead 차별화
 * - 좌측에 목록/카테고리 보조 액션 노출
 */
export const InlineCta = ({
  title = '바로 상담받고 싶으시다면',
  lead = '네이버 예약·카카오톡 상담·전화 — 가장 편한 방법으로 연락주세요.',
  backLabel,
  backHref,
  extraLabel,
  extraHref,
}: InlineCtaProps) => {
  return (
    <div class="inline-cta" data-reveal>
      <div class="inline-cta-copy">
        <div class="inline-cta-eyebrow">
          <i class="fas fa-comments"></i>
          <span>CONTACT</span>
        </div>
        <h3 class="inline-cta-title">{title}</h3>
        <p class="inline-cta-lead">{lead}</p>
      </div>

      <div class="inline-cta-actions">
        <a
          href={CLINIC.socialLinks.naverBooking}
          target="_blank"
          rel="noopener"
          class="inline-cta-btn inline-cta-btn-naver"
          aria-label="네이버 예약 바로가기"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z" />
          </svg>
          <span>네이버 예약</span>
        </a>
        <a
          href={CLINIC.socialLinks.kakao}
          target="_blank"
          rel="noopener"
          class="inline-cta-btn inline-cta-btn-kakao"
          aria-label="카카오톡 상담 바로가기"
        >
          <i class="fas fa-comment" aria-hidden="true"></i>
          <span>카카오톡 상담</span>
        </a>
        <a href={`tel:${CLINIC.phone}`} class="inline-cta-btn inline-cta-btn-phone" aria-label="전화 연결">
          <i class="fas fa-phone" aria-hidden="true"></i>
          <span>{CLINIC.phone}</span>
        </a>
      </div>

      {(backLabel || extraLabel) && (
        <div class="inline-cta-secondary">
          {backLabel && backHref ? (
            <a href={backHref} class="inline-cta-secondary-link">
              <i class="fas fa-arrow-left" aria-hidden="true"></i> {backLabel}
            </a>
          ) : null}
          {extraLabel && extraHref ? (
            <a href={extraHref} class="inline-cta-secondary-link">
              {extraLabel} <i class="fas fa-arrow-right" aria-hidden="true" style="font-size:0.75rem;"></i>
            </a>
          ) : null}
        </div>
      )}
    </div>
  )
}
