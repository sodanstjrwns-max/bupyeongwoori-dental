import { Layout } from '../components/Layout'
import { CLINIC, SEO_REGIONS, OG_IMAGES } from '../lib/constants'
import { TREATMENT_LIST, CORE_LIST } from '../data/treatments'
import { DOCTORS } from '../data/doctors'
import { breadcrumbSchema } from '../lib/schema'
import { CtaSection } from '../components/CtaSection'

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
      ogImage={OG_IMAGES.beforeAfter}
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
          <h1 class="page-title">
            변하지 않는 <em class="ph-mint-3">결과</em>로<br/>
            증명합니다.
          </h1>
          <p class="page-lead">
            허락해 주신 환자분들의 사례만 공유합니다. 14년 한 자리에서 쌓아온, <strong style="color:var(--ink-900);">변하지 않는 퀄리티</strong>의 결과물입니다.
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

      {/* Regional SEO footer (검색엔진/크롤러용 hidden links - 사용자 눈에는 비노출) */}
      <nav aria-label="지역별 케이스" class="sr-only" style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;">
        <h2>지역별 케이스</h2>
        <ul>
          {SEO_REGIONS.map((r) => (
            <li><a href={`/before-after?region=${encodeURIComponent(r)}`}>{r} 케이스</a></li>
          ))}
        </ul>
      </nav>

      <CtaSection
        eyebrow="CONTACT · 내 케이스도 가능할까?"
        title="실제 케이스, 직접 상담받아보세요."
        lead="비포애프터에서 본 결과가 내게도 가능한지, CBCT 3D 진단 포함 무료 상담으로 정직하게 안내드립니다."
      />
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
      ogImage={caseRow.before_pano_key ? `/media/${caseRow.before_pano_key}` : (caseRow.before_intra_key ? `/media/${caseRow.before_intra_key}` : OG_IMAGES.beforeAfter)}
      jsonLd={[
        breadcrumbSchema([
          { name: '홈', url: '/' },
          { name: '비포애프터', url: '/before-after' },
          { name: caseRow.title, url: `/before-after/${caseRow.slug}` },
        ]),
      ]}
    >
      <section class="ba-detail-hero">
        <div class="ba-detail-hero-bg" aria-hidden="true"></div>
        <div class="container ba-detail-hero-inner">
          <div class="ba-detail-hero-main">
            <div class="ba-detail-eyebrow" data-reveal>
              <span class="dot"></span>
              <a href="/before-after">BEFORE · AFTER</a>
              {treatment ? <><span class="sep">·</span><span>{treatment.name}</span></> : null}
            </div>
            <h1 class="ba-detail-title" data-reveal data-reveal-delay="1">{caseRow.title}</h1>
            {caseRow.summary ? <p class="ba-detail-lead" data-reveal data-reveal-delay="2">{caseRow.summary}</p> : null}
            <div class="ba-detail-cta" data-reveal data-reveal-delay="3">
              <a href={CLINIC.socialLinks.naverBooking} target="_blank" rel="noopener" class="btn btn-primary" style="background:#03C75A; border-color:#03C75A;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z"/></svg>
                같은 진료 상담 예약
              </a>
              {treatment ? (
                <a href={`/treatments/${treatment.slug}`} class="btn btn-ghost">
                  <i class="fas fa-tooth"></i> {treatment.name} 자세히 보기
                </a>
              ) : null}
            </div>
          </div>

          <aside class="ba-detail-card" data-reveal data-reveal-delay="2">
            <div class="ba-detail-card-head">
              <div class="ba-detail-card-eyebrow">CASE INFO</div>
              <div class="ba-detail-card-title">진료 정보</div>
            </div>
            <ul class="ba-detail-card-list">
              {treatment ? (
                <li>
                  <i class="fas fa-tooth"></i>
                  <div>
                    <span class="lbl">진료</span>
                    <strong>{treatment.name}</strong>
                  </div>
                </li>
              ) : null}
              {caseRow.age ? (
                <li>
                  <i class="fas fa-user"></i>
                  <div>
                    <span class="lbl">환자</span>
                    <strong>{caseRow.age}대 {caseRow.gender === 'M' ? '남성' : caseRow.gender === 'F' ? '여성' : caseRow.gender === 'N' ? '비공개' : ''}</strong>
                  </div>
                </li>
              ) : null}
              {caseRow.region_city || caseRow.region ? (
                <li>
                  <i class="fas fa-map-marker-alt"></i>
                  <div>
                    <span class="lbl">거주 지역</span>
                    <strong>{caseRow.region_city || caseRow.region}</strong>
                  </div>
                </li>
              ) : null}
              {caseRow.treatment_period ? (
                <li>
                  <i class="fas fa-clock"></i>
                  <div>
                    <span class="lbl">치료 기간</span>
                    <strong>{caseRow.treatment_period}</strong>
                  </div>
                </li>
              ) : null}
              {doctor ? (
                <li>
                  <i class="fas fa-user-doctor"></i>
                  <div>
                    <span class="lbl">담당 의료진</span>
                    <strong>{doctor.title} {doctor.name}</strong>
                  </div>
                </li>
              ) : null}
            </ul>
          </aside>
        </div>
      </section>

      {/* Slider sections (panoramic + intraoral) */}
      <section class="section ba-detail-section">
        <div class="container">
          <div class="ba-detail-grid">
            {/* Panoramic — BEFORE 또는 AFTER 키가 있을 때만 노출 */}
            {(caseRow.before_pano_key || caseRow.after_pano_key) && (
              <div class="ba-detail-item" data-reveal>
                <div class="ba-detail-section-head">
                  <div class="ba-detail-section-eyebrow">PANORAMIC</div>
                  <h2>파노라마 X-ray</h2>
                  <p>전체 치아·턱뼈 구조를 한눈에 보여주는 진단 영상입니다.</p>
                </div>
                <div class="ba-compare">
                  <div class="ba-compare-before">
                    {caseRow.before_pano_key ? (
                      <img src={`/media/${caseRow.before_pano_key}`} alt="파노라마 전" loading="lazy" decoding="async" />
                    ) : <div class="ba-placeholder"><span>Before</span></div>}
                    <span class="ba-label">BEFORE</span>
                  </div>
                  <div class="ba-compare-after">
                    {caseRow.after_pano_key && isLoggedIn ? (
                      <img src={`/media/${caseRow.after_pano_key}`} alt="파노라마 후" loading="lazy" decoding="async" />
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
            )}

            {/* Intraoral — BEFORE 또는 AFTER 키가 있을 때만 노출 */}
            {(caseRow.before_intra_key || caseRow.after_intra_key) && (
              <div class="ba-detail-item" data-reveal data-reveal-delay="1">
                <div class="ba-detail-section-head">
                  <div class="ba-detail-section-eyebrow">INTRAORAL</div>
                  <h2>구내 사진</h2>
                  <p>실제 구강 내 색·형태·잇몸 상태까지 정밀하게 기록합니다.</p>
                </div>
                <div class="ba-compare">
                  <div class="ba-compare-before">
                    {caseRow.before_intra_key ? (
                      <img src={`/media/${caseRow.before_intra_key}`} alt="구내 전" loading="lazy" decoding="async" />
                    ) : <div class="ba-placeholder"><span>Before</span></div>}
                    <span class="ba-label">BEFORE</span>
                  </div>
                  <div class="ba-compare-after">
                    {caseRow.after_intra_key && isLoggedIn ? (
                      <img src={`/media/${caseRow.after_intra_key}`} alt="구내 후" loading="lazy" decoding="async" />
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
            )}

            {/* 둘 다 없으면 안내 */}
            {!caseRow.before_pano_key && !caseRow.after_pano_key &&
             !caseRow.before_intra_key && !caseRow.after_intra_key && (
              <div class="ba-detail-item" data-reveal>
                <div class="empty-state" style="padding:48px 24px; text-align:center;">
                  <i class="fas fa-image" style="font-size:2.4rem; color:var(--ink-300);"></i>
                  <p style="margin-top:14px; color:var(--ink-500);">등록된 사진이 없는 케이스입니다.</p>
                </div>
              </div>
            )}
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
            <div class="prose case-content" data-reveal>
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
              <h2 class="section-title">같은 진료 다른 <em class="ph-mint-3">케이스</em></h2>
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

      <CtaSection
        eyebrow="CONTACT · 비슷한 케이스 상담"
        title="이 케이스가 내게도 가능한지, 직접 확인하세요."
        lead="실제 진단을 통해 가능 여부와 정확한 비용을 안내드립니다. 부담 없이 문의주세요."
      />
    </Layout>
  )
}
