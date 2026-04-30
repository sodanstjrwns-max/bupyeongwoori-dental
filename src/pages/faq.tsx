import { Layout } from '../components/Layout'
import { CLINIC, OG_IMAGES } from '../lib/constants'
import { TREATMENT_LIST } from '../data/treatments'
import { breadcrumbSchema, faqSchema } from '../lib/schema'

export const FaqAllPage = () => {
  // 모든 FAQ 통합
  const allFaqs = TREATMENT_LIST.flatMap((t) =>
    t.faqs.map((f) => ({ ...f, treatment: t.name, treatmentSlug: t.slug })),
  )
  const grouped = TREATMENT_LIST.map((t) => ({
    treatment: t,
    faqs: t.faqs,
  }))

  return (
    <Layout
      title="자주 묻는 질문 (FAQ)"
      description="부평우리치과의 모든 진료 FAQ — 임플란트·심미보철·교정·라미네이트 등 160+ 질문과 답변을 한 곳에서."
      keywords="부평치과 FAQ, 임플란트 질문, 교정 FAQ, 부평우리치과 FAQ, 치과 자주 묻는 질문"
      canonical={`https://${CLINIC.domain}/faq`}
      ogImage={OG_IMAGES.faq}
      jsonLd={[
        breadcrumbSchema([{ name: '홈', url: '/' }, { name: 'FAQ', url: '/faq' }]),
        faqSchema(allFaqs.map((f) => ({ q: f.q, a: f.a })).slice(0, 100)),
      ]}
    >
      <section class="page-hero">
        <div class="container">
          <div class="page-eyebrow">FAQ · 자주 묻는 질문</div>
          <h1 class="page-title">
            궁금한 점은 <em class="ph-mint-3">먼저</em>,<br/>
            정직하게 답합니다.
          </h1>
          <p class="page-lead">
            총 <strong>{allFaqs.length}개</strong>의 질문과 답변을 진료별로 정리했습니다. 검색했을 때 충분한 정보를 드리는 것이 부평우리치과의 약속입니다.
          </p>
        </div>
      </section>

      <section class="section" style="padding-top:40px;">
        <div class="container" style="max-width:900px;">
          {/* TOC */}
          <div class="faq-toc" data-reveal>
            <span style="color:var(--ink-500); font-size:0.88rem;">바로 이동:</span>
            {grouped.map((g) => (
              <a href={`#${g.treatment.slug}`} class="chip">
                {g.treatment.isCore ? '★ ' : ''}{g.treatment.name} ({g.faqs.length})
              </a>
            ))}
          </div>

          {grouped.map((g) => (
            <div id={g.treatment.slug} class="faq-section" data-reveal>
              <div class="section-eyebrow" style="padding-left:0; margin-top:48px;">{g.treatment.nameEn}</div>
              <h2 style="font-family:var(--font-display); font-weight:300; font-size:clamp(1.6rem, 2.6vw, 2.2rem); margin-top:12px;">
                {g.treatment.name} <span style="color:var(--ink-400); font-size:0.75em;">({g.faqs.length}개)</span>
              </h2>
              <div class="faq-list">
                {g.faqs.map((f, i) => (
                  <details class="faq-item" name={`faq-${g.treatment.slug}`}>
                    <summary>
                      <span class="faq-q-num">Q{i + 1}.</span>
                      <span class="faq-q-text">{f.q}</span>
                      <span class="faq-q-icon"><i class="fas fa-chevron-down"></i></span>
                    </summary>
                    <div class="faq-a">{f.a}</div>
                  </details>
                ))}
              </div>
              <div style="margin-top:24px;">
                <a href={`/treatments/${g.treatment.slug}`} class="btn" style="background:white; border:1px solid var(--ink-200); color:var(--ink-900);">
                  {g.treatment.name} 진료 자세히 →
                </a>
              </div>
            </div>
          ))}

          <div class="cta-block" style="margin-top:80px;">
            <h2 class="cta-h2">
              <span class="cta-line">원하시는 <em class="cta-mint-1">답변</em>이 없으셨나요?</span><br/>
              <span class="cta-line">직접 상담하시면,</span><br/>
              <span class="cta-line">변하지 않는 <em class="cta-mint-3">우리</em>가 답합니다.</span>
            </h2>
            <p>상담은 언제나 무료입니다. 진료 가능 여부와 비용을 <strong style="color:#fff;">정직하게</strong> 안내드립니다.</p>
            <div class="btns">
              <a href={CLINIC.socialLinks.naverBooking} target="_blank" rel="noopener" class="btn btn-primary" style="background:#03C75A; border-color:#03C75A;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z"/></svg>
                네이버 예약
              </a>
              <a href={CLINIC.socialLinks.kakao} target="_blank" rel="noopener" class="btn" style="background:#FEE500; color:#3A1D1D; border:none;">
                <i class="fas fa-comment"></i> 카카오톡 상담
              </a>
              <a href={`tel:${CLINIC.phone}`} class="btn btn-ghost">
                <i class="fas fa-phone"></i> {CLINIC.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
