import { Layout } from '../components/Layout'
import { CLINIC } from '../lib/constants'
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
      jsonLd={[
        breadcrumbSchema([{ name: '홈', url: '/' }, { name: 'FAQ', url: '/faq' }]),
        faqSchema(allFaqs.map((f) => ({ q: f.q, a: f.a })).slice(0, 100)),
      ]}
    >
      <section class="page-hero">
        <div class="container">
          <div class="page-eyebrow">FAQ</div>
          <h1 class="page-title">
            자주 묻는 <em>질문</em>
          </h1>
          <p class="page-lead">
            총 <strong>{allFaqs.length}개</strong>의 질문과 답변이 진료별로 정리되어 있습니다.
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
            <h2 style="font-family:var(--font-display); font-weight:300;">
              원하시는 답변이 없으셨나요?
            </h2>
            <p>직접 상담하시면 구체적으로 안내해 드립니다.</p>
            <div class="btns">
              <a href={`tel:${CLINIC.phone}`} class="btn btn-primary">
                <i class="fas fa-phone"></i> {CLINIC.phone}
              </a>
              <a href="/visit" class="btn btn-ghost">
                <i class="fas fa-map-marker-alt"></i> 오시는 길
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
