import { Layout } from '../components/Layout'
import { HubLink } from '../lib/hub-link'
import { CLINIC, OG_IMAGES } from '../lib/constants'
import { GLOSSARY, GLOSSARY_CATEGORIES, getRelatedTerms, type GlossaryTerm } from '../data/glossary'
import { TREATMENT_LIST } from '../data/treatments'
import { breadcrumbSchema, faqSchema, medicalWebPageSchema } from '../lib/schema'
import { CONTENT_DATES, toKstNoonIso } from '../lib/content-dates'
import { CtaSection } from '../components/CtaSection'
import { InlineCta } from '../components/InlineCta'

// ============================================================
// 목록 페이지
// ============================================================
export const GlossaryListPage = ({
  activeCategory,
  query,
}: {
  activeCategory?: string
  query?: string
}) => {
  let filtered = GLOSSARY
  if (activeCategory) filtered = filtered.filter((t) => t.category === activeCategory)
  if (query) {
    const q = query.toLowerCase()
    filtered = filtered.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        (t.termEn ?? '').toLowerCase().includes(q) ||
        t.short.toLowerCase().includes(q),
    )
  }

  // 한글 초성 그룹
  const groupByInitial = (terms: GlossaryTerm[]): Record<string, GlossaryTerm[]> => {
    const initials: Record<string, GlossaryTerm[]> = {}
    const getKorean = (c: string) => {
      const code = c.charCodeAt(0)
      if (code < 0xac00 || code > 0xd7a3) return c.toUpperCase()
      const cho = Math.floor((code - 0xac00) / 588)
      const ch = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
      return ch[cho] ?? c
    }
    for (const t of terms) {
      const k = getKorean(t.term.charAt(0))
      if (!initials[k]) initials[k] = []
      initials[k].push(t)
    }
    return initials
  }
  const initialGroups = groupByInitial(filtered)
  const sortedInitials = Object.keys(initialGroups).sort((a, b) => a.localeCompare(b, 'ko'))

  return (
    <Layout
      title="치과 백과사전"
      description={`치과 용어 ${GLOSSARY.length}개 이상을 한 곳에서 검색. 임플란트·교정·심미·예방 등 분야별로 정리된 치과 용어 사전.`}
      keywords="치과 백과사전, 치과 용어, 임플란트 용어, 교정 용어, 치과 용어 사전, 부평우리치과"
      canonical={`https://${CLINIC.domain}/glossary`}
      ogImage={OG_IMAGES.glossary}
      jsonLd={[breadcrumbSchema([{ name: '홈', url: '/' }, { name: '백과사전', url: '/glossary' }])]}
    >
      <section class="page-hero">
        <div class="container">
          <div class="page-eyebrow">ENCYCLOPEDIA</div>
          <h1 class="page-title">
            치과 <em>백과사전</em>
          </h1>
          <p class="page-lead">
            <strong>{GLOSSARY.length}개</strong>의 치과 용어를 분야별로 정리했습니다.
            모르시는 용어를 검색해 보세요.
          </p>
        </div>
      </section>

      <section class="section" style="padding-top:40px; padding-bottom:40px;">
        <div class="container">
          {/* Search */}
          <form method="get" action="/glossary" class="glossary-search">
            <input
              type="text"
              name="q"
              placeholder="예: 임플란트, 법랑질, 교정..."
              value={query ?? ''}
              class="glossary-search-input"
            />
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-search"></i> 검색
            </button>
          </form>

          {/* Category chips */}
          <div class="glossary-cats">
            <a href="/glossary" class={`chip ${!activeCategory ? 'active' : ''}`}>전체 ({GLOSSARY.length})</a>
            {GLOSSARY_CATEGORIES.map((cat) => {
              const count = GLOSSARY.filter((t) => t.category === cat.slug).length
              return (
                <a href={`/glossary?category=${cat.slug}`} class={`chip ${activeCategory === cat.slug ? 'active' : ''}`}>
                  <i class={`fas ${cat.icon}`} style="margin-right:4px;"></i>
                  {cat.name} ({count})
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <section class="section" style="padding-top:0;">
        <div class="container">
          {filtered.length === 0 ? (
            <div class="empty-state">
              <i class="fas fa-search" style="font-size:3rem; color:var(--ink-300);"></i>
              <h3 style="margin-top:16px;">검색 결과가 없습니다</h3>
              <p>다른 키워드로 검색해 보세요.</p>
            </div>
          ) : (
            sortedInitials.map((initial) => (
              <div class="glossary-group" data-reveal>
                <div class="glossary-initial">{initial}</div>
                <div class="glossary-list">
                  {initialGroups[initial].map((t) => (
                    <a href={`/glossary/${t.slug}`} class="glossary-item">
                      <div class="glossary-term">
                        <strong>{t.term}</strong>
                        {t.termEn ? <em>{t.termEn}</em> : null}
                      </div>
                      <div class="glossary-short">{t.short}</div>
                    </a>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <CtaSection
        variant="light"
        eyebrow="CONTACT · 용어를 넘어 직접 진료 상담"
        title="용어로 다 못 풀리는 건, 직접 듣는 게 빠릅니다."
        lead="궁금한 진료 용어가 내 케이스에 어떻게 적용되는지, 무료 상담으로 정직하게 안내드립니다."
      />
    </Layout>
  )
}

// ============================================================
// 상세 페이지
// ============================================================

/** 본문 문단 안의 관련 용어 이름을 첫 등장 1회만 링크 (용어당 1회, 페이지당 최대 8개) */
type LinkTarget = { name: string; href: string }
const linkify = (text: string, targets: LinkTarget[], used: Set<string>): any[] => {
  let parts: any[] = [text]
  for (const t of targets) {
    if (used.has(t.href) || used.size >= 8) continue
    const next: any[] = []
    let done = false
    for (const part of parts) {
      if (done || typeof part !== 'string') { next.push(part); continue }
      const i = part.indexOf(t.name)
      if (i < 0) { next.push(part); continue }
      next.push(part.slice(0, i), <a href={t.href}>{t.name}</a>, part.slice(i + t.name.length))
      done = true
      used.add(t.href)
    }
    parts = next
  }
  return parts.filter((x) => x !== '')
}
const displayName = (term: string) => term.replace(/\s*\(.*?\)\s*/g, '').trim()

export const GlossaryDetailPage = ({ term }: { term: GlossaryTerm }) => {
  const related = getRelatedTerms(term)
  const cat = GLOSSARY_CATEGORIES.find((c) => c.slug === term.category)
  const relatedTreatments = (term.relatedTreatments ?? term.treatments ?? [])
    .map((s) => TREATMENT_LIST.find((t) => t.slug === s))
    .filter(Boolean)
  const content = term.content
  // 화면 수정일·MedicalWebPage dateModified·sitemap lastmod 가 같은 값 (보강일 고정값)
  const reviewed = term.modified ?? CONTENT_DATES.glossary
  const url = `https://${CLINIC.domain}/glossary/${term.slug}`

  // 본문 인라인 링크 대상: 관련 용어(이름 2자 이상, 긴 이름 먼저) + 관련 진료
  const linkTargets: LinkTarget[] = [
    ...related
      .map((r) => ({ name: displayName(r.term), href: `/glossary/${r.slug}` }))
      .filter((x) => x.name.length >= 2 && x.name !== displayName(term.term)),
    ...relatedTreatments.map((t) => ({ name: t!.name, href: `/treatments/${t!.slug}` })),
  ].sort((a, b) => b.name.length - a.name.length)
  const used = new Set<string>()

  return (
    <Layout
      title={`${term.term}${term.termEn ? ` (${term.termEn})` : ''} | 치과 백과사전`}
      description={`${term.term}${term.termEn ? ` (${term.termEn})` : ''} — ${term.short}${content ? ` ${content.lead}`.slice(0, 90) : ''}`.slice(0, 155)}
      keywords={`${term.term}, ${term.termEn ?? ''}, 치과 용어, 부평우리치과`}
      canonical={url}
      ogImage={OG_IMAGES.glossary}
      ogType={content ? 'article' : 'website'}
      articleMeta={content ? { modifiedTime: toKstNoonIso(reviewed), author: CLINIC.name, section: cat?.name ?? '치과 백과사전' } : undefined}
      jsonLd={[
        breadcrumbSchema([
          { name: '홈', url: '/' },
          { name: '백과사전', url: '/glossary' },
          { name: term.term, url: `/glossary/${term.slug}` },
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'DefinedTerm',
          '@id': `${url}#term`,
          name: term.term,
          alternateName: term.termEn,
          description: term.short,
          inDefinedTermSet: `https://${CLINIC.domain}/glossary`,
          url,
        },
        // 의학 용어 해설 — 원장 검토 기록이 없으므로 reviewedBy·lastReviewed 를 두지 않는다(2026-10-08).
        // 발행 주체는 병원(publisher=#clinic), dateModified 는 보강일 고정값.
        {
          ...medicalWebPageSchema({
            url,
            name: `${term.term} | 치과 백과사전`,
            description: content?.lead ?? term.short ?? term.definition,
            about: term.term,
            noReviewer: true,
            speakableSelectors: ['.glossary-detail-title', '.glossary-detail-short', '.glossary-lead'],
          }),
          ...(content ? { dateModified: reviewed } : {}),
          mainEntity: { '@id': `${url}#term` },
        },
        // FAQPage — 화면 #glossary-faq 의 <details> 와 같은 배열 (1:1)
        content && content.faqs.length > 0 ? faqSchema(content.faqs) : null,
      ]}
    >
      <article class="section" style="padding-top:120px;">
        <div class="container" style="max-width:820px;">
          <div class="page-breadcrumb">
            <a href="/glossary">백과사전</a>
            {cat ? <> · <a href={`/glossary?category=${cat.slug}`}>{cat.name}</a></> : null}
          </div>
          <h1 class="glossary-detail-title">
            {term.term}
            {term.termEn ? <em class="glossary-detail-en">{term.termEn}</em> : null}
          </h1>
          <p class="glossary-detail-short">{term.short}</p>

          {content ? (
            <div class="glossary-detail-body prose">
              <p class="glossary-lead">{linkify(content.lead, linkTargets, used)}</p>
              {content.sections.map((sec) => (
                <section>
                  <h2>{sec.h}</h2>
                  {sec.p.map((para) => <p>{linkify(para, linkTargets, used)}</p>)}
                  {sec.list && sec.list.length > 0 ? (
                    <ul>{sec.list.map((li) => <li>{linkify(li, linkTargets, used)}</li>)}</ul>
                  ) : null}
                </section>
              ))}
            </div>
          ) : (
            <div class="glossary-detail-body prose">
              <p>{term.definition}</p>
            </div>
          )}

          {content && content.faqs.length > 0 ? (
            <section id="glossary-faq" style="margin-top:40px;">
              <h2 style="font-size:var(--h-4); margin-bottom:16px;">{displayName(term.term)}, 자주 묻는 질문</h2>
              <div class="accordion">
                {content.faqs.map((f) => (
                  <details>
                    <summary>{f.q}</summary>
                    <div class="answer">{f.a}</div>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          {/* 정직 안내 — 원장 감수 표시 없음(검토 기록 없음). 날짜는 스키마 dateModified 와 동일 */}
          <p class="medical-review-line" style="margin-top:24px; font-size:0.84rem; color:var(--ink-500);">
            일반 건강정보입니다. 진료 판단은 내원 상담에서 원장이 직접 합니다. · 최종 수정 <time datetime={reviewed}>{reviewed}</time>
          </p>

          {relatedTreatments.length > 0 && (
            <div class="glossary-related-block">
              <h3>관련 진료</h3>
              <div class="glossary-related-grid">
                {relatedTreatments.map((t) => (
                  <a href={`/treatments/${t!.slug}`} class="glossary-related-card">
                    <strong>{t!.name}</strong>
                    <span>{t!.tagline}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div class="glossary-related-block">
              <h3>관련 용어</h3>
              <div class="glossary-related-terms">
                {related.map((r) => (
                  <a href={`/glossary/${r.slug}`} class="chip">
                    {r.term}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 허브 링크 한 줄 — "부평 치과" */}
          <p class="hub-local-line" style="margin:28px 0 0; font-size:0.92rem; color:var(--ink-600); line-height:1.7;">
            <i class="fas fa-map-marker-alt" style="margin-right:6px; color:var(--brand-600, #2a9d9a);"></i>{CLINIC.name} 위치·진료시간은 <HubLink /> 안내에서 확인하실 수 있습니다.
          </p>

          <InlineCta
            title={`'${term.term}' — 내 케이스에선 어떻게 적용될까요?`}
            lead="용어 설명만으로는 부족합니다. 직접 진단을 받으시면 본인의 구강 상태에 맞는 정확한 치료 방향을 확인하실 수 있습니다."
            backLabel="백과사전 목록으로"
            backHref="/glossary"
            extraLabel={cat ? `${cat.name} 분야 더 보기` : undefined}
            extraHref={cat ? `/glossary?category=${cat.slug}` : undefined}
          />
        </div>
      </article>

      <CtaSection
        eyebrow="CONTACT · 이 용어, 내 케이스에 어떻게?"
        title="궁금한 용어가 내 진료에 어떻게 적용되는지."
        lead="용어 설명만으로는 부족할 때, 직접 진단으로 가장 정확하게 안내드립니다."
      />
    </Layout>
  )
}
