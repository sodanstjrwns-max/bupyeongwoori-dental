import { Layout } from '../components/Layout'
import { CLINIC, SEO_REGIONS } from '../lib/constants'
import { TREATMENT_LIST, CORE_LIST } from '../data/treatments'
import { DOCTORS } from '../data/doctors'
import { breadcrumbSchema } from '../lib/schema'

type BeforeAfterRow = {
  id: number
  slug: string
  title: string
  treatment_slug: string
  doctor_slug: string
  age: number | null
  gender: string | null
  region: string | null
  region_city: string | null
  treatment_period: string | null
  summary: string | null
  content: string | null
  before_pano_key: string | null
  after_pano_key: string | null
  before_intra_key: string | null
  after_intra_key: string | null
  view_count: number
  created_at: string
}

// ============================================================
// 목록 페이지 (Gallery)
// ============================================================
export const BeforeAfterListPage = ({
  cases,
  isLoggedIn,
  activeTreatment,
  activeRegion,
  query,
}: {
  cases: BeforeAfterRow[]
  isLoggedIn: boolean
  activeTreatment?: string
  activeRegion?: string
  query?: string
}) => {
  const treatmentName = (slug: string) => TREATMENT_LIST.find((t) => t.slug === slug)?.name ?? slug
  const doctorName = (slug: string) => DOCTORS.find((d) => d.slug === slug)?.name ?? slug

  return (
    <Layout
      title="비포애프터 갤러리"
      description="부평우리치과의 실제 전후 케이스를 확인해 보세요. 임플란트·심미보철·교정·라미네이트 등 진료별 결과를 공유합니다."
      canonical={`https://${CLINIC.domain}/before-after`}
      keywords="부평 치과 비포애프터, 부평 임플란트 전후, 부평 심미보철 사례, 부평 교정 사례, 부평우리치과 케이스"
      jsonLd={[
        breadcrumbSchema([
          { name: '홈', url: '/' },
          { name: '비포애프터', url: '/before-after' },
        ]),
      ]}
    >
      <section class="page-hero">
        <div class="container">
          <div class="page-eyebrow">BEFORE · AFTER</div>
          <h1 class="page-title">실제 환자분들의 변화</h1>
          <p class="page-lead">
            허락해 주신 환자분들의 사례만을 공유합니다.
            {isLoggedIn ? (
              <> 로그인하신 회원이시므로 <strong>모든 After 사진을 확인하실 수 있습니다.</strong></>
            ) : (
              <> <a href="/login?next=/before-after" style="color:var(--brand-600); font-weight:600;">로그인</a>하시면 After 사진을 모두 확인하실 수 있습니다.</>
            )}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section class="section" style="padding-top:40px; padding-bottom:40px;">
        <div class="container">
          <form method="get" action="/before-after" class="ba-filters">
            <div class="ba-filter-row">
              <label>
                <span>진료 선택</span>
                <select name="treatment">
                  <option value="">전체 진료</option>
                  {TREATMENT_LIST.map((t) => (
                    <option value={t.slug} selected={activeTreatment === t.slug}>{t.name}{t.isCore ? ' ★' : ''}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>지역 검색 (동/구)</span>
                <input
                  type="text"
                  name="region"
                  list="region-list"
                  placeholder="예: 부평동, 초지동, 십정동"
                  value={activeRegion ?? ''}
                />
                <datalist id="region-list">
                  {SEO_REGIONS.map((r) => <option value={r} />)}
                </datalist>
              </label>
              <label>
                <span>키워드 검색</span>
                <input type="text" name="q" placeholder="제목·요약 검색" value={query ?? ''} />
              </label>
              <button type="submit" class="btn btn-dark" style="height:44px;">
                <i class="fas fa-search"></i> 검색
              </button>
            </div>

            <div class="ba-quick">
              <span style="color:var(--ink-500); font-size:0.85rem; margin-right:8px;">빠른 선택:</span>
              {CORE_LIST.map((t) => (
                <a href={`/before-after?treatment=${t.slug}`} class="chip">★ {t.name}</a>
              ))}
              <a href="/before-after" class="chip">전체</a>
            </div>
          </form>
        </div>
      </section>

      {/* Grid */}
      <section class="section" style="padding-top:0;">
        <div class="container">
          {cases.length === 0 ? (
            <div class="empty-state">
              <i class="fas fa-images" style="font-size:3rem; color:var(--ink-300);"></i>
              <h3 style="margin-top:16px;">아직 등록된 케이스가 없습니다</h3>
              <p>곧 풍부한 사례가 업데이트될 예정입니다.</p>
            </div>
          ) : (
            <div class="ba-grid">
              {cases.map((c) => (
                <a href={`/before-after/${c.slug}`} class="ba-card">
                  <div class="ba-slider" data-reveal>
                    <div class="ba-before">
                      {c.before_intra_key ? (
                        <img src={`/media/${c.before_intra_key}`} alt={`${c.title} 전`} />
                      ) : (
                        <div class="ba-placeholder">
                          <span>Before</span>
                        </div>
                      )}
                      <span class="ba-label">BEFORE</span>
                    </div>
                    <div class="ba-after">
                      {c.after_intra_key && isLoggedIn ? (
                        <img src={`/media/${c.after_intra_key}`} alt={`${c.title} 후`} />
                      ) : (
                        <div class="ba-locked">
                          <i class="fas fa-lock"></i>
                          <span>{isLoggedIn ? 'After' : '로그인 시 공개'}</span>
                        </div>
                      )}
                      <span class="ba-label after-label">AFTER</span>
                    </div>
                  </div>
                  <div class="ba-meta">
                    <div class="ba-tags">
                      <span class="ba-tag">{treatmentName(c.treatment_slug)}</span>
                      {c.region ? <span class="ba-tag ghost">{c.region}</span> : null}
                      {c.treatment_period ? <span class="ba-tag ghost">{c.treatment_period}</span> : null}
                    </div>
                    <h3 class="ba-title">{c.title}</h3>
                    {c.summary ? <p class="ba-summary">{c.summary}</p> : null}
                    <div class="ba-bottom">
                      <span>{c.age ? `${c.age}대${c.gender === 'M' ? ' 남성' : c.gender === 'F' ? ' 여성' : ''}` : ''}</span>
                      <span>{doctorName(c.doctor_slug)}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Regional SEO footer */}
      <section class="section section-soft">
        <div class="container">
          <h2 class="section-title" style="font-size:1.5rem;">지역별 케이스 빠른 이동</h2>
          <div class="ba-region-links">
            {SEO_REGIONS.map((r) => (
              <a href={`/before-after?region=${encodeURIComponent(r)}`} class="region-chip">{r} 케이스 →</a>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

// ============================================================
// 상세 페이지
// ============================================================
export const BeforeAfterDetailPage = ({
  caseRow,
  isLoggedIn,
  relatedCases,
}: {
  caseRow: BeforeAfterRow
  isLoggedIn: boolean
  relatedCases: BeforeAfterRow[]
}) => {
  const treatment = TREATMENT_LIST.find((t) => t.slug === caseRow.treatment_slug)
  const doctor = DOCTORS.find((d) => d.slug === caseRow.doctor_slug)

  return (
    <Layout
      title={caseRow.title}
      description={caseRow.summary ?? `${treatment?.name ?? '진료'} 케이스 — ${caseRow.title}`}
      canonical={`https://${CLINIC.domain}/before-after/${caseRow.slug}`}
      keywords={`${treatment?.keywords ?? ''}, 부평 치과 비포애프터, ${caseRow.region ?? ''}`}
      jsonLd={[
        breadcrumbSchema([
          { name: '홈', url: '/' },
          { name: '비포애프터', url: '/before-after' },
          { name: caseRow.title, url: `/before-after/${caseRow.slug}` },
        ]),
      ]}
    >
      <section class="page-hero">
        <div class="container">
          <div class="page-breadcrumb">
            <a href="/before-after">비포애프터</a> · {treatment?.name}
          </div>
          <h1 class="page-title">{caseRow.title}</h1>
          {caseRow.summary ? <p class="page-lead">{caseRow.summary}</p> : null}

          <div class="ba-detail-meta">
            {caseRow.age ? <span>{caseRow.age}대 {caseRow.gender === 'M' ? '남성' : caseRow.gender === 'F' ? '여성' : ''}</span> : null}
            {caseRow.region_city ? <span>거주: {caseRow.region_city}</span> : null}
            {caseRow.treatment_period ? <span>치료 기간: {caseRow.treatment_period}</span> : null}
            {doctor ? <span>담당: {doctor.title} {doctor.name}</span> : null}
          </div>
        </div>
      </section>

      {/* Slider sections (panoramic + intraoral) */}
      <section class="section" style="padding-top:40px;">
        <div class="container">
          <div class="ba-detail-grid">
            {/* Panoramic */}
            <div class="ba-detail-item">
              <h3>파노라마 (Panoramic)</h3>
              <div class="ba-compare">
                <div class="ba-compare-before">
                  {caseRow.before_pano_key ? (
                    <img src={`/media/${caseRow.before_pano_key}`} alt="파노라마 전" />
                  ) : <div class="ba-placeholder"><span>Before</span></div>}
                  <span class="ba-label">BEFORE</span>
                </div>
                <div class="ba-compare-after">
                  {caseRow.after_pano_key && isLoggedIn ? (
                    <img src={`/media/${caseRow.after_pano_key}`} alt="파노라마 후" />
                  ) : (
                    <div class="ba-locked">
                      <i class="fas fa-lock"></i>
                      <span>{isLoggedIn ? 'After' : '로그인 시 공개'}</span>
                    </div>
                  )}
                  <span class="ba-label after-label">AFTER</span>
                </div>
              </div>
            </div>

            {/* Intraoral */}
            <div class="ba-detail-item">
              <h3>구내 사진 (Intraoral)</h3>
              <div class="ba-compare">
                <div class="ba-compare-before">
                  {caseRow.before_intra_key ? (
                    <img src={`/media/${caseRow.before_intra_key}`} alt="구내 전" />
                  ) : <div class="ba-placeholder"><span>Before</span></div>}
                  <span class="ba-label">BEFORE</span>
                </div>
                <div class="ba-compare-after">
                  {caseRow.after_intra_key && isLoggedIn ? (
                    <img src={`/media/${caseRow.after_intra_key}`} alt="구내 후" />
                  ) : (
                    <div class="ba-locked">
                      <i class="fas fa-lock"></i>
                      <span>{isLoggedIn ? 'After' : '로그인 시 공개'}</span>
                    </div>
                  )}
                  <span class="ba-label after-label">AFTER</span>
                </div>
              </div>
            </div>
          </div>

          {!isLoggedIn && (
            <div class="login-banner" data-reveal>
              <div>
                <h3>After 사진을 보고 싶으신가요?</h3>
                <p>회원가입은 무료이며, 모든 비포애프터 사진이 즉시 공개됩니다.</p>
              </div>
              <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <a href={`/login?next=/before-after/${caseRow.slug}`} class="btn btn-primary">로그인</a>
                <a href="/signup" class="btn btn-dark">회원가입</a>
              </div>
            </div>
          )}

          {caseRow.content ? (
            <div class="prose" data-reveal>
              {/* @ts-ignore */}
              <div dangerouslySetInnerHTML={{ __html: caseRow.content }} />
            </div>
          ) : null}

          <div style="margin-top:40px; display:flex; gap:10px; flex-wrap:wrap;">
            {treatment ? (
              <a href={`/treatments/${treatment.slug}`} class="btn btn-dark">
                {treatment.name} 진료 자세히 →
              </a>
            ) : null}
            <a href="/before-after" class="btn" style="background:white; border:1px solid var(--ink-200); color:var(--ink-900);">
              다른 케이스 보기
            </a>
          </div>
        </div>
      </section>

      {/* Related */}
      {relatedCases.length > 0 && (
        <section class="section section-soft">
          <div class="container">
            <div class="section-head" data-reveal>
              <div class="section-eyebrow">RELATED</div>
              <h2 class="section-title">같은 진료 다른 <em>케이스</em></h2>
            </div>
            <div class="ba-grid">
              {relatedCases.map((c) => (
                <a href={`/before-after/${c.slug}`} class="ba-card">
                  <div class="ba-slider">
                    <div class="ba-before">
                      {c.before_intra_key ? <img src={`/media/${c.before_intra_key}`} alt={c.title} /> : <div class="ba-placeholder"><span>Before</span></div>}
                      <span class="ba-label">BEFORE</span>
                    </div>
                    <div class="ba-after">
                      {c.after_intra_key && isLoggedIn ? <img src={`/media/${c.after_intra_key}`} alt={c.title} /> : <div class="ba-locked"><i class="fas fa-lock"></i></div>}
                      <span class="ba-label after-label">AFTER</span>
                    </div>
                  </div>
                  <div class="ba-meta">
                    <h3 class="ba-title" style="font-size:1.1rem;">{c.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  )
}
