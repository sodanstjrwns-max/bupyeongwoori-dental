// ============================================================
// 통합 검색 페이지 — SearchAction(JSON-LD) 실동작 엔드포인트
// 정적 데이터(진료/용어집/지역/FAQ) + DB(블로그/공지) 통합 검색
// ============================================================
import { Layout } from '../components/Layout'
import { CLINIC } from '../lib/constants'
import { breadcrumbSchema } from '../lib/schema'
import { TREATMENT_LIST } from '../data/treatments'
import { GLOSSARY } from '../data/glossary'
import { AREAS } from '../data/areas'

export type SearchResultItem = {
  type: '진료' | '용어' | '지역' | 'FAQ' | '블로그' | '공지'
  title: string
  url: string
  snippet: string
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '')

/** 정적 데이터 검색 (Workers CPU 한도 내 가벼운 includes 매칭) */
export function searchStatic(q: string, limit = 40): SearchResultItem[] {
  const nq = norm(q)
  if (!nq) return []
  const out: SearchResultItem[] = []

  // 1) 진료과목
  for (const t of TREATMENT_LIST) {
    if (out.length >= limit) break
    const hay = norm(`${t.name}${t.nameEn}${t.tagline}${t.keywords}${t.overview}`)
    if (hay.includes(nq)) {
      out.push({ type: '진료', title: t.name, url: `/treatments/${t.slug}`, snippet: t.tagline })
    }
  }

  // 2) 지역 허브
  for (const a of AREAS) {
    if (out.length >= limit) break
    const hay = norm(`${a.name}${a.nameFull}${a.keywords.join('')}`)
    if (hay.includes(nq)) {
      out.push({ type: '지역', title: `${a.name} 치과 안내`, url: `/areas/${a.slug}`, snippet: `${a.nameFull} — ${a.distance}` })
    }
  }

  // 3) FAQ
  outer: for (const t of TREATMENT_LIST) {
    for (const f of t.faqs) {
      if (out.length >= limit) break outer
      if (norm(f.q).includes(nq) || norm(f.a).includes(nq)) {
        out.push({ type: 'FAQ', title: f.q, url: `/faq#${t.slug}`, snippet: f.a.length > 110 ? f.a.slice(0, 110) + '…' : f.a })
      }
    }
  }

  // 4) 백과사전 용어 (582개 — 이름/정의 우선 매칭)
  for (const g of GLOSSARY) {
    if (out.length >= limit) break
    const hay = norm(`${g.term}${g.termEn ?? ''}${g.definition}`)
    if (hay.includes(nq)) {
      out.push({ type: '용어', title: g.term + (g.termEn ? ` (${g.termEn})` : ''), url: `/glossary/${g.slug}`, snippet: g.definition })
    }
  }

  return out.slice(0, limit)
}

export const SearchPage = ({ q, results }: { q: string; results: SearchResultItem[] }) => {
  const base = `https://${CLINIC.domain}`
  const hasQuery = q.trim().length > 0
  const typeColors: Record<string, string> = {
    진료: 'var(--brand-600, #2a9d9a)',
    용어: '#7c6df2',
    지역: '#e08e3c',
    FAQ: '#3c8de0',
    블로그: '#d05c8c',
    공지: '#6b7280',
  }

  return (
    <Layout
      title={hasQuery ? `'${q}' 검색 결과` : '통합 검색'}
      description={`부평우리치과 통합 검색 — 진료과목·치과 백과사전 ${GLOSSARY.length}개 용어·FAQ·블로그·공지사항을 한 번에 검색하세요.`}
      canonical={hasQuery ? undefined : `${base}/search`}
      noindex={hasQuery /* 검색 결과 페이지는 색인 제외(씬 콘텐츠 방지), 검색 홈만 색인 */}
      jsonLd={[breadcrumbSchema([{ name: '홈', url: '/' }, { name: '검색', url: '/search' }])]}
    >
      <section class="page-hero" id="search-hero">
        <div class="container">
          <div class="page-eyebrow">SEARCH · 통합 검색</div>
          <h1 class="page-title">
            무엇이든 <em class="ph-mint-3">검색</em>해 보세요.
          </h1>
          <p class="page-lead">
            진료과목 · 백과사전 {GLOSSARY.length}개 용어 · FAQ · 블로그 · 공지사항을 한 번에 찾아드립니다.
          </p>
        </div>
      </section>

      <section class="section" style="padding-top:32px; min-height:50vh;">
        <div class="container" style="max-width:860px;">
          <form method="get" action="/search" class="glossary-search" role="search" aria-label="사이트 통합 검색">
            <input
              type="search"
              name="q"
              id="search-input"
              value={q}
              placeholder="예: 임플란트 비용, 사랑니, 부평역 교정..."
              aria-label="검색어"
              autofocus
            />
            <button type="submit" class="btn btn-dark">검색</button>
          </form>

          {hasQuery ? (
            <div style="margin-top:36px;">
              <p style="color:var(--ink-500); font-size:0.95rem;">
                <strong>'{q}'</strong> 검색 결과 <strong>{results.length}</strong>건
              </p>
              {results.length === 0 ? (
                <div style="margin-top:32px; padding:40px; background:var(--ink-50, #f7f8f8); border-radius:16px; text-align:center;">
                  <p style="font-weight:600;">검색 결과가 없습니다.</p>
                  <p style="color:var(--ink-500); margin-top:8px; font-size:0.92rem;">
                    다른 키워드로 검색하시거나, 아래 콘텐츠 허브에서 직접 찾아보세요.
                  </p>
                  <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap; margin-top:20px;">
                    <a href="/treatments" class="chip">진료과목</a>
                    <a href="/glossary" class="chip">백과사전</a>
                    <a href="/faq" class="chip">FAQ</a>
                    <a href="/blog" class="chip">블로그</a>
                  </div>
                </div>
              ) : (
                <ul style="list-style:none; padding:0; margin-top:20px; display:flex; flex-direction:column; gap:14px;" id="search-results">
                  {results.map((r) => (
                    <li>
                      <a
                        href={r.url}
                        style="display:block; padding:20px 24px; background:#fff; border:1px solid var(--ink-100, #e8eaea); border-radius:14px; text-decoration:none; color:inherit; transition:border-color .2s, box-shadow .2s;"
                        class="search-result-card"
                      >
                        <span style={`display:inline-block; font-size:0.72rem; font-weight:700; letter-spacing:0.04em; padding:3px 10px; border-radius:999px; color:#fff; background:${typeColors[r.type] ?? '#6b7280'};`}>
                          {r.type}
                        </span>
                        <h2 style="font-size:1.05rem; font-weight:700; margin-top:10px;">{r.title}</h2>
                        <p style="color:var(--ink-500); font-size:0.9rem; margin-top:6px; line-height:1.6;">{r.snippet}</p>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div style="margin-top:40px;">
              <p style="color:var(--ink-500); font-size:0.92rem; font-weight:600;">인기 검색어</p>
              <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:12px;">
                {['임플란트', '라미네이트', '투명교정', '사랑니 발치', '스케일링', '임플란트 비용', '부평역 치과'].map((kw) => (
                  <a href={`/search?q=${encodeURIComponent(kw)}`} class="chip">{kw}</a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
