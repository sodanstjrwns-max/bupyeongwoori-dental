import { Layout } from '../components/Layout'
import { CLINIC } from '../lib/constants'
import { GLOSSARY, GLOSSARY_CATEGORIES, getRelatedTerms, type GlossaryTerm } from '../data/glossary'
import { TREATMENT_LIST } from '../data/treatments'
import { breadcrumbSchema } from '../lib/schema'

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
    </Layout>
  )
}

// ============================================================
// 상세 페이지
// ============================================================
export const GlossaryDetailPage = ({ term }: { term: GlossaryTerm }) => {
  const related = getRelatedTerms(term)
  const cat = GLOSSARY_CATEGORIES.find((c) => c.slug === term.category)
  const relatedTreatments = (term.treatments ?? [])
    .map((s) => TREATMENT_LIST.find((t) => t.slug === s))
    .filter(Boolean)

  return (
    <Layout
      title={`${term.term}${term.termEn ? ` (${term.termEn})` : ''} | 치과 백과사전`}
      description={`${term.term}${term.termEn ? ` (${term.termEn})` : ''} — ${term.short}. 부평우리치과 치과 백과사전.`}
      keywords={`${term.term}, ${term.termEn ?? ''}, 치과 용어, 부평우리치과`}
      canonical={`https://${CLINIC.domain}/glossary/${term.slug}`}
      jsonLd={[
        breadcrumbSchema([
          { name: '홈', url: '/' },
          { name: '백과사전', url: '/glossary' },
          { name: term.term, url: `/glossary/${term.slug}` },
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'DefinedTerm',
          name: term.term,
          alternateName: term.termEn,
          description: term.short,
          inDefinedTermSet: `https://${CLINIC.domain}/glossary`,
          url: `https://${CLINIC.domain}/glossary/${term.slug}`,
        },
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

          <div class="glossary-detail-body prose">
            <p>{term.definition}</p>
          </div>

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

          <div style="margin-top:48px; padding-top:32px; border-top:1px solid var(--ink-100); display:flex; gap:12px; flex-wrap:wrap;">
            <a href="/glossary" class="btn btn-dark">← 백과사전 목록</a>
            {cat ? (
              <a href={`/glossary?category=${cat.slug}`} class="btn" style="background:white; border:1px solid var(--ink-200); color:var(--ink-900);">
                {cat.name} 분야 보기
              </a>
            ) : null}
          </div>
        </div>
      </article>
    </Layout>
  )
}
