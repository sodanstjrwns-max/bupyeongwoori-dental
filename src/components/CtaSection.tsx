import { CLINIC } from '../lib/constants'

type CtaSectionProps = {
  eyebrow?: string
  title?: string
  lead?: string
  variant?: 'dark' | 'light'
}

// 페이지 하단 공용 CTA 섹션
// 네이버 예약 + 카카오톡 상담 + 전화 3개 동선
export const CtaSection = ({
  eyebrow = 'CONTACT · 상담은 언제나 무료',
  title = '직접 상담하시면, 가장 정확합니다.',
  lead = '진료 가능 여부와 비용·치료 플랜을 정직하게 안내드립니다. 부담 없이 문의주세요.',
  variant = 'dark',
}: CtaSectionProps) => {
  const isDark = variant === 'dark'
  return (
    <section
      class="section cta-section"
      style={
        isDark
          ? 'background:linear-gradient(135deg, #0F1817 0%, #143735 60%, #0E7C75 110%); color:white; padding:80px 0;'
          : 'background:linear-gradient(135deg, var(--brand-50, #E8F8F7), white); padding:64px 0;'
      }
    >
      <div class="container" style="text-align:center;">
        <div
          class="section-eyebrow"
          style={isDark ? 'color:#5BCEC9; padding-left:0;' : 'padding-left:0;'}
        >
          {eyebrow}
        </div>
        <h2
          class="section-title"
          style={isDark ? 'color:white; margin-top:8px;' : 'margin-top:8px;'}
        >
          {title}
        </h2>
        <p
          class="section-lead"
          style={
            isDark
              ? 'color:rgba(255,255,255,0.78); max-width:640px; margin:16px auto 32px;'
              : 'max-width:640px; margin:16px auto 32px;'
          }
        >
          {lead}
        </p>
        <div
          class="cta-buttons"
          style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center;"
        >
          <a
            href={CLINIC.socialLinks.naverBooking}
            target="_blank"
            rel="noopener"
            class="btn btn-primary btn-lg"
            data-magnetic
            style="background:#03C75A; border-color:#03C75A;"
          >
            <i class="fas fa-calendar-check"></i> 네이버 예약
          </a>
          <a
            href={CLINIC.socialLinks.kakao}
            target="_blank"
            rel="noopener"
            class="btn btn-lg"
            style="background:#FEE500; color:#3A1D1D; border:none;"
          >
            <i class="fas fa-comment"></i> 카카오톡 상담
          </a>
          <a
            href={`tel:${CLINIC.phone}`}
            class="btn btn-lg"
            style={
              isDark
                ? 'background:rgba(255,255,255,0.08); color:white; border:1px solid rgba(255,255,255,0.25);'
                : 'background:white; color:var(--ink-900); border:1px solid var(--ink-200);'
            }
          >
            <i class="fas fa-phone"></i> {CLINIC.phone}
          </a>
        </div>
      </div>
    </section>
  )
}
