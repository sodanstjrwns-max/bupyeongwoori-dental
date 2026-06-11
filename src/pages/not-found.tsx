// ============================================================
// 커스텀 404 — 크롤러/사용자 모두에게 친절한 소프트랜딩
// 죽은 링크로 들어온 검색 유입을 핵심 페이지로 회수 (SEO 링크 에쿼티 보존)
// ============================================================
import { Layout } from '../components/Layout'
import { CLINIC, CORE_TREATMENTS } from '../lib/constants'

export const NotFoundPage = ({ path }: { path?: string }) => {
  return (
    <Layout title="페이지를 찾을 수 없습니다 (404)" noindex>
      <section class="section" id="not-found" style="padding-top:160px; min-height:75vh;">
        <div class="container" style="max-width:760px; text-align:center;">
          <div class="page-eyebrow">404 NOT FOUND</div>
          <h1 class="page-title" style="margin-top:16px;">
            찾으시는 페이지가 <em class="ph-mint-3">이사</em>했나 봅니다.
          </h1>
          <p class="page-lead" style="margin-top:16px;">
            주소가 바뀌었거나 삭제된 페이지입니다.{path ? <> (<code>{path}</code>)</> : null}
            <br />
            아래에서 원하시는 정보를 바로 찾아보세요.
          </p>

          <form method="get" action="/search" class="glossary-search" role="search" style="margin-top:32px; justify-content:center;">
            <input type="search" name="q" placeholder="예: 임플란트, 사랑니, 교정..." aria-label="사이트 검색" />
            <button type="submit" class="btn btn-dark">검색</button>
          </form>

          <nav aria-label="주요 페이지" style="margin-top:40px;">
            <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
              <a href="/" class="chip">홈</a>
              {CORE_TREATMENTS.map((t) => (
                <a href={`/treatments/${t.slug}`} class="chip">{t.name}</a>
              ))}
              <a href="/treatments" class="chip">전체 진료</a>
              <a href="/doctors" class="chip">의료진</a>
              <a href="/faq" class="chip">FAQ</a>
              <a href="/glossary" class="chip">백과사전</a>
              <a href="/blog" class="chip">블로그</a>
              <a href="/visit" class="chip">오시는 길</a>
            </div>
          </nav>

          <p style="margin-top:48px; color:var(--ink-500); font-size:0.92rem;">
            급하신 문의는 전화로 — <a href={`tel:${CLINIC.phone}`} style="font-weight:700;">{CLINIC.phone}</a>
          </p>
        </div>
      </section>
    </Layout>
  )
}
