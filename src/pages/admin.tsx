import { Layout } from '../components/Layout'
import { CLINIC } from '../lib/constants'
import { TREATMENT_LIST } from '../data/treatments'
import { DOCTORS } from '../data/doctors'
import { SEO_REGIONS } from '../lib/constants'

// ============================================================
// 관리자 로그인
// ============================================================
export const AdminLoginPage = ({ error }: { error?: string }) => {
  return (
    <Layout title="관리자 로그인" noindex hideFooter hideFloatingCta>
      <section class="auth-section" style="min-height:100vh;">
        <div class="auth-card" style="max-width:440px;">
          <div class="auth-head">
            <div class="section-eyebrow" style="padding-left:0;">ADMIN</div>
            <h1 class="auth-title">관리자 로그인</h1>
            <p class="auth-sub">관리자 전용 페이지입니다.</p>
          </div>
          {error ? <div class="auth-alert">{error}</div> : null}
          <form method="post" action="/admin/login" class="auth-form">
            <label class="field">
              <span>관리자 비밀번호</span>
              <input type="password" name="password" required autoComplete="current-password" autoFocus />
            </label>
            <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:12px;">
              관리자 진입 <i class="fas fa-arrow-right"></i>
            </button>
          </form>
        </div>
      </section>
    </Layout>
  )
}

// ============================================================
// 관리자 대시보드 레이아웃
// ============================================================
const AdminShell = ({ active, children, title }: { active: string; children: any; title: string }) => {
  return (
    <Layout title={`[관리자] ${title}`} noindex hideFooter hideFloatingCta>
      <section class="admin-shell">
        <aside class="admin-side">
          <div class="admin-brand">
            <span class="nav-logo-mark">관</span>
            <div>
              <div style="font-family:var(--font-display); font-size:1.1rem;">부평우리치과</div>
              <small style="color:var(--ink-400);">Admin</small>
            </div>
          </div>
          <nav class="admin-nav">
            <a href="/admin" class={active === 'dashboard' ? 'active' : ''}><i class="fas fa-chart-line"></i> 대시보드</a>
            <a href="/admin/users" class={active === 'users' ? 'active' : ''}><i class="fas fa-users"></i> 회원 관리</a>
            <a href="/admin/before-after" class={active === 'ba' ? 'active' : ''}><i class="fas fa-images"></i> 비포애프터</a>
            <a href="/admin/blog" class={active === 'blog' ? 'active' : ''}><i class="fas fa-newspaper"></i> 블로그</a>
            <a href="/admin/notices" class={active === 'notices' ? 'active' : ''}><i class="fas fa-bullhorn"></i> 공지사항</a>
            <a href="/admin/og-preview" class={active === 'og' ? 'active' : ''}><i class="fas fa-share-nodes"></i> OG 미리보기</a>
            <a href="/" target="_blank" style="margin-top:20px; border-top:1px solid var(--ink-100); padding-top:20px;"><i class="fas fa-arrow-up-right-from-square"></i> 사이트 보기</a>
            <a href="/admin/logout"><i class="fas fa-right-from-bracket"></i> 로그아웃</a>
          </nav>
        </aside>
        <main class="admin-main">
          <header class="admin-header">
            <h1>{title}</h1>
          </header>
          <div class="admin-body">
            {children}
          </div>
        </main>
      </section>
    </Layout>
  )
}

// ============================================================
// 대시보드
// ============================================================
export const AdminDashboard = ({
  stats,
}: {
  stats: { users: number; bas: number; blogs: number; notices: number; totalViews: number }
}) => {
  return (
    <AdminShell active="dashboard" title="대시보드">
      <div class="admin-stats">
        <div class="admin-stat">
          <div class="label">총 회원</div>
          <div class="num">{stats.users.toLocaleString()}</div>
          <a href="/admin/users" class="link">관리 →</a>
        </div>
        <div class="admin-stat">
          <div class="label">비포애프터</div>
          <div class="num">{stats.bas.toLocaleString()}</div>
          <a href="/admin/before-after" class="link">관리 →</a>
        </div>
        <div class="admin-stat">
          <div class="label">블로그 글</div>
          <div class="num">{stats.blogs.toLocaleString()}</div>
          <a href="/admin/blog" class="link">관리 →</a>
        </div>
        <div class="admin-stat">
          <div class="label">공지사항</div>
          <div class="num">{stats.notices.toLocaleString()}</div>
          <a href="/admin/notices" class="link">관리 →</a>
        </div>
        <div class="admin-stat" style="grid-column: span 2;">
          <div class="label">총 콘텐츠 조회수</div>
          <div class="num">{stats.totalViews.toLocaleString()}</div>
        </div>
      </div>

      <div class="admin-card" style="margin-top:32px;">
        <h2 style="font-family:var(--font-display); font-weight:400; font-size:1.4rem;">빠른 작업</h2>
        <div style="display:flex; flex-wrap:wrap; gap:12px; margin-top:16px;">
          <a href="/admin/blog/new" class="btn btn-primary"><i class="fas fa-plus"></i> 블로그 작성</a>
          <a href="/admin/before-after/new" class="btn btn-dark"><i class="fas fa-plus"></i> 비포애프터 등록</a>
          <a href="/admin/notices/new" class="btn" style="background:white; border:1px solid var(--ink-200); color:var(--ink-900);"><i class="fas fa-plus"></i> 공지 작성</a>
        </div>
      </div>
    </AdminShell>
  )
}

// ============================================================
// 회원 관리
// ============================================================
export const AdminUsersPage = ({ users }: { users: any[] }) => {
  return (
    <AdminShell active="users" title="회원 관리">
      <div class="admin-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>이름</th><th>이메일</th><th>휴대폰</th><th>역할</th><th>가입일</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={6} style="text-align:center; padding:32px; color:var(--ink-400);">등록된 회원이 없습니다.</td></tr>
            ) : (
              users.map((u) => (
                <tr>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone ?? '-'}</td>
                  <td>
                    <span class={`badge ${u.role === 'admin' ? 'badge-brand' : ''}`}>{u.role}</span>
                  </td>
                  <td>{new Date(u.created_at).toLocaleDateString('ko-KR')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}

// ============================================================
// 비포애프터 관리 (목록)
// ============================================================
export const AdminBAListPage = ({ cases }: { cases: any[] }) => {
  return (
    <AdminShell active="ba" title="비포애프터 관리">
      <div style="display:flex; justify-content:flex-end; margin-bottom:16px;">
        <a href="/admin/before-after/new" class="btn btn-primary"><i class="fas fa-plus"></i> 새 케이스 등록</a>
      </div>
      <div class="admin-card">
        <table class="admin-table">
          <thead>
            <tr><th>ID</th><th>제목</th><th>진료</th><th>지역</th><th>조회수</th><th>공개</th><th>등록일</th><th></th></tr>
          </thead>
          <tbody>
            {cases.length === 0 ? (
              <tr><td colSpan={8} style="text-align:center; padding:32px; color:var(--ink-400);">등록된 케이스가 없습니다.</td></tr>
            ) : cases.map((c) => (
              <tr>
                <td>{c.id}</td>
                <td><a href={`/before-after/${c.slug}`} target="_blank">{c.title}</a></td>
                <td>{TREATMENT_LIST.find(t=>t.slug===c.treatment_slug)?.name ?? c.treatment_slug}</td>
                <td>{c.region ?? '-'}</td>
                <td>{c.view_count}</td>
                <td><span class={`badge ${c.is_published ? 'badge-brand' : ''}`}>{c.is_published ? '공개' : '비공개'}</span></td>
                <td>{new Date(c.created_at).toLocaleDateString('ko-KR')}</td>
                <td style="display:flex; gap:6px;">
                  <a href={`/admin/before-after/${c.id}/edit`} class="chip">수정</a>
                  <form method="post" action={`/admin/before-after/${c.id}/delete`} onsubmit="return confirm('정말 삭제하시겠습니까?')" style="display:inline;">
                    <button type="submit" class="chip" style="border-color:#e04848; color:#e04848; cursor:pointer; background:transparent;">삭제</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}

// ============================================================
// 비포애프터 등록/수정
// ============================================================
export const AdminBAFormPage = ({
  mode,
  data,
}: {
  mode: 'new' | 'edit'
  data?: any
}) => {
  const isEdit = mode === 'edit'
  return (
    <AdminShell active="ba" title={isEdit ? '비포애프터 수정' : '비포애프터 등록'}>
      <form method="post" action={isEdit ? `/admin/before-after/${data.id}/edit` : '/admin/before-after/new'} enctype="multipart/form-data" class="admin-form" data-has-editor>
        <div class="admin-card">
          <h2>기본 정보</h2>
          <div class="field-row">
            <label class="field">
              <span>제목 *</span>
              <input type="text" name="title" required value={data?.title ?? ''} placeholder="예: 50대 남성 어금니 임플란트 2개" />
            </label>
            <label class="field">
              <span>슬러그 (URL) *</span>
              <input type="text" name="slug" required value={data?.slug ?? ''} placeholder="case-implant-50m-bupyeong (영문/숫자/하이픈)" />
            </label>
          </div>

          <div class="field-row">
            <label class="field">
              <span>진료 *</span>
              <select name="treatment_slug" required>
                {TREATMENT_LIST.map(t => <option value={t.slug} selected={data?.treatment_slug === t.slug}>{t.name}</option>)}
              </select>
            </label>
            <label class="field">
              <span>담당 원장 *</span>
              <select name="doctor_slug" required>
                {DOCTORS.map(d => <option value={d.slug} selected={data?.doctor_slug === d.slug}>{d.title} {d.name}</option>)}
              </select>
            </label>
          </div>

          <div class="field-row">
            <label class="field">
              <span>연령대</span>
              <input type="number" name="age" value={data?.age ?? ''} placeholder="50" />
            </label>
            <label class="field">
              <span>성별</span>
              <select name="gender">
                <option value="">선택안함</option>
                <option value="M" selected={data?.gender === 'M'}>남성</option>
                <option value="F" selected={data?.gender === 'F'}>여성</option>
                <option value="N" selected={data?.gender === 'N'}>비공개</option>
              </select>
            </label>
            <label class="field">
              <span>치료 기간</span>
              <input type="text" name="treatment_period" value={data?.treatment_period ?? ''} placeholder="3개월" />
            </label>
          </div>

          <div class="field-row">
            <label class="field">
              <span>지역 (동)</span>
              <input type="text" name="region" list="region-list" value={data?.region ?? ''} placeholder="예: 부평동, 초지동" />
              <datalist id="region-list">
                {SEO_REGIONS.map(r => <option value={r} />)}
              </datalist>
            </label>
            <label class="field">
              <span>상세 지역 (SEO 자동완성용)</span>
              <input type="text" name="region_city" value={data?.region_city ?? ''} placeholder="예: 안산시 상록구 초지동" />
            </label>
          </div>

          <label class="field">
            <span>요약</span>
            <textarea name="summary" rows={2} placeholder="목록 카드에 표시될 1~2문장 요약">{data?.summary ?? ''}</textarea>
          </label>

        </div>

        <div class="admin-card">
          <h2>본문 에디터</h2>
          <div class="editor-toolbar">
            <button type="button" data-cmd="h2" class="editor-btn" title="대제목">H2</button>
            <button type="button" data-cmd="h3" class="editor-btn" title="소제목">H3</button>
            <button type="button" data-cmd="p" class="editor-btn" title="단락">단락</button>
            <span class="editor-toolbar-sep"></span>
            <button type="button" data-cmd="bold" class="editor-btn" title="굵게"><b>B</b></button>
            <button type="button" data-cmd="italic" class="editor-btn" title="기울임"><i>I</i></button>
            <button type="button" data-cmd="ul" class="editor-btn" title="목록">• 목록</button>
            <button type="button" data-cmd="ol" class="editor-btn" title="번호 목록">1. 목록</button>
            <button type="button" data-cmd="quote" class="editor-btn" title="인용">❝</button>
            <button type="button" data-cmd="hr" class="editor-btn" title="구분선">―</button>
            <button type="button" data-cmd="clear" class="editor-btn" title="서식 지우기">✕서식</button>
            <span class="editor-toolbar-sep"></span>
            <button type="button" data-cmd="link" class="editor-btn" title="링크">🔗 링크</button>
            <button type="button" data-cmd="img" class="editor-btn editor-btn-primary" title="이미지 업로드">🖼 이미지</button>
            <span class="editor-toolbar-sep"></span>
            <button type="button" data-cmd="undo" class="editor-btn" title="실행 취소">↶</button>
            <button type="button" data-cmd="redo" class="editor-btn" title="다시 실행">↷</button>
          </div>
          <div class="editor-drop" data-editor-drop>
            <div
              class="editor-area"
              contenteditable="true"
              data-editor
              data-placeholder="본문을 작성하세요. 이미지는 툴바에서 업로드하거나 드래그&드롭, 클립보드 붙여넣기도 가능합니다."
              // @ts-ignore
              dangerouslySetInnerHTML={{ __html: data?.content ?? '' }}
            />
          </div>
          <p class="editor-hint">팁: 이미지를 클릭하면 정렬/너비/링크/캡션/교체 툴바가 뜹니다 · 좌상단 ⠿ 핸들로 드래그 이동 · ESC로 선택 해제</p>
          <textarea name="content" data-editor-output style="display:none;">{data?.content ?? ''}</textarea>
          <input type="file" data-editor-inline accept="image/*" multiple style="display:none;" />
        </div>

        <div class="admin-card">
          <h2>이미지 (R2 업로드)</h2>
          <p style="color:var(--ink-500); font-size:0.9rem;">각 항목을 별도로 업로드하거나, 기존 R2 키를 직접 입력할 수 있습니다.</p>
          <div class="field-row">
            <label class="field">
              <span>파노라마 BEFORE</span>
              {data?.before_pano_key ? <img src={`/media/${data.before_pano_key}`} class="admin-thumb" alt="현재 파노라마 BEFORE" /> : null}
              <input type="file" name="before_pano_file" accept="image/*" />
              <input type="text" name="before_pano_key" value={data?.before_pano_key ?? ''} placeholder="기존 R2 키 (선택)" style="margin-top:6px;" />
            </label>
            <label class="field">
              <span>파노라마 AFTER</span>
              {data?.after_pano_key ? <img src={`/media/${data.after_pano_key}`} class="admin-thumb" alt="현재 파노라마 AFTER" /> : null}
              <input type="file" name="after_pano_file" accept="image/*" />
              <input type="text" name="after_pano_key" value={data?.after_pano_key ?? ''} placeholder="기존 R2 키 (선택)" style="margin-top:6px;" />
            </label>
          </div>
          <div class="field-row">
            <label class="field">
              <span>구내 BEFORE</span>
              {data?.before_intra_key ? <img src={`/media/${data.before_intra_key}`} class="admin-thumb" alt="현재 구내 BEFORE" /> : null}
              <input type="file" name="before_intra_file" accept="image/*" />
              <input type="text" name="before_intra_key" value={data?.before_intra_key ?? ''} placeholder="기존 R2 키 (선택)" style="margin-top:6px;" />
            </label>
            <label class="field">
              <span>구내 AFTER</span>
              {data?.after_intra_key ? <img src={`/media/${data.after_intra_key}`} class="admin-thumb" alt="현재 구내 AFTER" /> : null}
              <input type="file" name="after_intra_file" accept="image/*" />
              <input type="text" name="after_intra_key" value={data?.after_intra_key ?? ''} placeholder="기존 R2 키 (선택)" style="margin-top:6px;" />
            </label>
          </div>
        </div>

        <div class="admin-card">
          <label class="checkbox">
            <input type="checkbox" name="is_published" value="1" checked={data ? data.is_published === 1 : true} />
            <span>공개</span>
          </label>
        </div>

        <div style="display:flex; gap:12px; margin-top:24px;">
          <button type="submit" class="btn btn-primary">{isEdit ? '수정 저장' : '등록'}</button>
          <a href="/admin/before-after" class="btn btn-dark">취소</a>
        </div>
      </form>
    </AdminShell>
  )
}

// ============================================================
// 블로그 목록
// ============================================================
export const AdminBlogListPage = ({ posts }: { posts: any[] }) => {
  return (
    <AdminShell active="blog" title="블로그 관리">
      <div style="display:flex; justify-content:flex-end; margin-bottom:16px;">
        <a href="/admin/blog/new" class="btn btn-primary"><i class="fas fa-plus"></i> 새 글 작성</a>
      </div>
      <div class="admin-card">
        <table class="admin-table">
          <thead>
            <tr><th>ID</th><th>제목</th><th>카테고리</th><th>작성자</th><th>조회수</th><th>공개</th><th>게시일</th><th></th></tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr><td colSpan={8} style="text-align:center; padding:32px; color:var(--ink-400);">등록된 글이 없습니다.</td></tr>
            ) : posts.map((p) => (
              <tr>
                <td>{p.id}</td>
                <td><a href={`/blog/${p.slug}`} target="_blank">{p.title}</a></td>
                <td>{p.category ?? '-'}</td>
                <td>{DOCTORS.find(d=>d.slug===p.author_slug)?.name ?? p.author_slug}</td>
                <td>{p.view_count}</td>
                <td><span class={`badge ${p.is_published ? 'badge-brand' : ''}`}>{p.is_published ? '공개' : '비공개'}</span></td>
                <td>{new Date(p.published_at).toLocaleDateString('ko-KR')}</td>
                <td style="display:flex; gap:6px;">
                  <a href={`/admin/blog/${p.id}/edit`} class="chip">수정</a>
                  <form method="post" action={`/admin/blog/${p.id}/delete`} onsubmit="return confirm('정말 삭제하시겠습니까?')" style="display:inline;">
                    <button type="submit" class="chip" style="border-color:#e04848; color:#e04848; cursor:pointer; background:transparent;">삭제</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}

// ============================================================
// 블로그 작성/수정 (에디터)
// ============================================================
export const AdminBlogFormPage = ({
  mode,
  data,
}: {
  mode: 'new' | 'edit'
  data?: any
}) => {
  const isEdit = mode === 'edit'
  return (
    <AdminShell active="blog" title={isEdit ? '블로그 수정' : '블로그 작성'}>
      <form method="post" action={isEdit ? `/admin/blog/${data.id}/edit` : '/admin/blog/new'} enctype="multipart/form-data" class="admin-form" data-has-editor>
        <div class="admin-card">
          <div class="field-row">
            <label class="field">
              <span>제목 *</span>
              <input type="text" name="title" required value={data?.title ?? ''} />
            </label>
            <label class="field">
              <span>슬러그 (URL) *</span>
              <input type="text" name="slug" required value={data?.slug ?? ''} placeholder="영문/숫자/하이픈" />
            </label>
          </div>
          <div class="field-row">
            <label class="field">
              <span>카테고리</span>
              <input type="text" name="category" value={data?.category ?? ''} placeholder="예: 임플란트, 교정, 심미보철" />
            </label>
            <label class="field">
              <span>작성자 *</span>
              <select name="author_slug" required>
                {DOCTORS.map(d => <option value={d.slug} selected={data?.author_slug === d.slug}>{d.title} {d.name}</option>)}
              </select>
            </label>
          </div>
          <label class="field">
            <span>요약 (목록 카드용)</span>
            <textarea name="excerpt" rows={2}>{data?.excerpt ?? ''}</textarea>
          </label>
          <label class="field">
            <span>태그 (쉼표로 구분)</span>
            <input type="text" name="tags" value={data?.tags ?? ''} placeholder="임플란트,부평,장기예후" />
          </label>
        </div>

        <div class="admin-card">
          <h2>본문 에디터</h2>
          <div class="editor-toolbar">
            <button type="button" data-cmd="h2" class="editor-btn" title="대제목">H2</button>
            <button type="button" data-cmd="h3" class="editor-btn" title="소제목">H3</button>
            <button type="button" data-cmd="p" class="editor-btn" title="단락">단락</button>
            <span class="editor-toolbar-sep"></span>
            <button type="button" data-cmd="bold" class="editor-btn" title="굵게"><b>B</b></button>
            <button type="button" data-cmd="italic" class="editor-btn" title="기울임"><i>I</i></button>
            <button type="button" data-cmd="ul" class="editor-btn" title="목록">• 목록</button>
            <button type="button" data-cmd="ol" class="editor-btn" title="번호 목록">1. 목록</button>
            <button type="button" data-cmd="quote" class="editor-btn" title="인용">❝</button>
            <button type="button" data-cmd="hr" class="editor-btn" title="구분선">―</button>
            <button type="button" data-cmd="clear" class="editor-btn" title="서식 지우기">✕서식</button>
            <span class="editor-toolbar-sep"></span>
            <button type="button" data-cmd="link" class="editor-btn" title="링크">🔗 링크</button>
            <button type="button" data-cmd="img" class="editor-btn editor-btn-primary" title="이미지 업로드">🖼 이미지</button>
            <span class="editor-toolbar-sep"></span>
            <button type="button" data-cmd="undo" class="editor-btn" title="실행 취소">↶</button>
            <button type="button" data-cmd="redo" class="editor-btn" title="다시 실행">↷</button>
          </div>
          <div class="editor-drop" data-editor-drop>
            <div
              class="editor-area"
              contenteditable="true"
              data-editor
              data-placeholder="본문을 작성하세요. 이미지는 툴바에서 업로드하거나 드래그&드롭, 클립보드 붙여넣기도 가능합니다."
              // @ts-ignore
              dangerouslySetInnerHTML={{ __html: data?.content ?? '' }}
            />
          </div>
          <p class="editor-hint">팁: 이미지를 클릭하면 정렬/너비/링크/캡션/교체 툴바가 뜹니다 · 좌상단 ⠿ 핸들로 드래그 이동 · ESC로 선택 해제</p>
          <textarea name="content" data-editor-output style="display:none;">{data?.content ?? ''}</textarea>
          <input type="file" data-editor-inline accept="image/*" multiple style="display:none;" />
        </div>

        <div class="admin-card">
          <h2>커버 이미지</h2>
          <div class="field-row">
            <label class="field">
              <span>커버 이미지 파일</span>
              {data?.cover_key ? <img src={`/media/${data.cover_key}`} class="admin-thumb" alt="현재 커버" /> : null}
              <input type="file" name="cover_file" accept="image/*" />
            </label>
            <label class="field">
              <span>기존 커버 R2 키</span>
              <input type="text" name="cover_key" value={data?.cover_key ?? ''} />
            </label>
          </div>
        </div>

        <div class="admin-card">
          <h2>SEO</h2>
          <label class="field">
            <span>메타 설명 (150자 이내 권장)</span>
            <textarea name="meta_description" rows={2}>{data?.meta_description ?? ''}</textarea>
          </label>
          <label class="field">
            <span>메타 키워드</span>
            <input type="text" name="meta_keywords" value={data?.meta_keywords ?? ''} />
          </label>
        </div>

        <div class="admin-card">
          <label class="checkbox">
            <input type="checkbox" name="is_published" value="1" checked={data ? data.is_published === 1 : true} />
            <span>공개 발행</span>
          </label>
        </div>

        <div style="display:flex; gap:12px; margin-top:24px;">
          <button type="submit" class="btn btn-primary">{isEdit ? '수정 저장' : '등록'}</button>
          <a href="/admin/blog" class="btn btn-dark">취소</a>
        </div>
      </form>
    </AdminShell>
  )
}

// ============================================================
// 공지 목록
// ============================================================
export const AdminNoticesListPage = ({ notices }: { notices: any[] }) => {
  return (
    <AdminShell active="notices" title="공지사항 관리">
      <div style="display:flex; justify-content:flex-end; margin-bottom:16px;">
        <a href="/admin/notices/new" class="btn btn-primary"><i class="fas fa-plus"></i> 새 공지 작성</a>
      </div>
      <div class="admin-card">
        <table class="admin-table">
          <thead><tr><th>ID</th><th>제목</th><th>대공지</th><th>조회수</th><th>공개</th><th>게시일</th><th></th></tr></thead>
          <tbody>
            {notices.length === 0 ? (
              <tr><td colSpan={7} style="text-align:center; padding:32px; color:var(--ink-400);">등록된 공지가 없습니다.</td></tr>
            ) : notices.map((n) => (
              <tr>
                <td>{n.id}</td>
                <td><a href={`/notices/${n.id}`} target="_blank">{n.title}</a></td>
                <td>{n.is_major === 1 ? <span class="badge badge-brand">대공지</span> : '-'}</td>
                <td>{n.view_count}</td>
                <td><span class={`badge ${n.is_published ? 'badge-brand' : ''}`}>{n.is_published ? '공개' : '비공개'}</span></td>
                <td>{new Date(n.published_at).toLocaleDateString('ko-KR')}</td>
                <td style="display:flex; gap:6px;">
                  <a href={`/admin/notices/${n.id}/edit`} class="chip">수정</a>
                  <form method="post" action={`/admin/notices/${n.id}/delete`} onsubmit="return confirm('정말 삭제하시겠습니까?')" style="display:inline;">
                    <button type="submit" class="chip" style="border-color:#e04848; color:#e04848; cursor:pointer; background:transparent;">삭제</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}

// ============================================================
// 공지 폼
// ============================================================
export const AdminNoticeFormPage = ({ mode, data }: { mode: 'new' | 'edit'; data?: any }) => {
  const isEdit = mode === 'edit'
  return (
    <AdminShell active="notices" title={isEdit ? '공지 수정' : '공지 작성'}>
      <form method="post" action={isEdit ? `/admin/notices/${data.id}/edit` : '/admin/notices/new'} enctype="multipart/form-data" class="admin-form" data-has-editor>
        <div class="admin-card">
          <label class="field">
            <span>제목 *</span>
            <input type="text" name="title" required value={data?.title ?? ''} />
          </label>
        </div>

        <div class="admin-card">
          <h2>본문 에디터</h2>
          <div class="editor-toolbar">
            <button type="button" data-cmd="h2" class="editor-btn" title="대제목">H2</button>
            <button type="button" data-cmd="h3" class="editor-btn" title="소제목">H3</button>
            <button type="button" data-cmd="p" class="editor-btn" title="단락">단락</button>
            <span class="editor-toolbar-sep"></span>
            <button type="button" data-cmd="bold" class="editor-btn" title="굵게"><b>B</b></button>
            <button type="button" data-cmd="italic" class="editor-btn" title="기울임"><i>I</i></button>
            <button type="button" data-cmd="ul" class="editor-btn" title="목록">• 목록</button>
            <button type="button" data-cmd="ol" class="editor-btn" title="번호 목록">1. 목록</button>
            <button type="button" data-cmd="quote" class="editor-btn" title="인용">❝</button>
            <button type="button" data-cmd="hr" class="editor-btn" title="구분선">―</button>
            <button type="button" data-cmd="clear" class="editor-btn" title="서식 지우기">✕서식</button>
            <span class="editor-toolbar-sep"></span>
            <button type="button" data-cmd="link" class="editor-btn" title="링크">🔗 링크</button>
            <button type="button" data-cmd="img" class="editor-btn editor-btn-primary" title="이미지 업로드">🖼 이미지</button>
            <span class="editor-toolbar-sep"></span>
            <button type="button" data-cmd="undo" class="editor-btn" title="실행 취소">↶</button>
            <button type="button" data-cmd="redo" class="editor-btn" title="다시 실행">↷</button>
          </div>
          <div class="editor-drop" data-editor-drop>
            <div
              class="editor-area"
              contenteditable="true"
              data-editor
              data-placeholder="본문을 작성하세요. 이미지는 툴바에서 업로드하거나 드래그&드롭, 클립보드 붙여넣기도 가능합니다."
              // @ts-ignore
              dangerouslySetInnerHTML={{ __html: data?.content ?? '' }}
            />
          </div>
          <p class="editor-hint">팁: 이미지를 클릭하면 정렬/너비/링크/캡션/교체 툴바가 뜹니다 · 좌상단 ⠿ 핸들로 드래그 이동 · ESC로 선택 해제</p>
          <textarea name="content" data-editor-output style="display:none;">{data?.content ?? ''}</textarea>
          <input type="file" data-editor-inline accept="image/*" multiple style="display:none;" />
        </div>

        <div class="admin-card">
          <h2>대표 이미지 (선택)</h2>
          <label class="field">
            <span>대표 이미지</span>
            {data?.image_key ? <img src={`/media/${data.image_key}`} class="admin-thumb" alt="현재 대표 이미지" /> : null}
            <input type="file" name="image_file" accept="image/*" />
            <input type="text" name="image_key" value={data?.image_key ?? ''} placeholder="기존 R2 키" style="margin-top:6px;" />
          </label>
          <div style="display:flex; gap:24px; margin-top:12px;">
            <label class="checkbox">
              <input type="checkbox" name="is_major" value="1" checked={data?.is_major === 1} />
              <span>대공지 지정</span>
            </label>
            <label class="checkbox">
              <input type="checkbox" name="is_published" value="1" checked={data ? data.is_published === 1 : true} />
              <span>공개 발행</span>
            </label>
          </div>
        </div>
        <div style="display:flex; gap:12px; margin-top:24px;">
          <button type="submit" class="btn btn-primary">{isEdit ? '수정 저장' : '등록'}</button>
          <a href="/admin/notices" class="btn btn-dark">취소</a>
        </div>
      </form>
    </AdminShell>
  )
}

// ============================================================
// OG 미리보기 페이지 — 카카오/페이스북/네이버 카드 시뮬레이션
// ============================================================
type OgPagePreview = {
  path: string
  label: string
  url: string
  title: string | null
  description: string | null
  ogImage: string | null
  canonical: string | null
  ogUrl: string | null
  issues: string[]
  warnings: string[]
}

export const AdminOgPreviewPage = ({ pages }: { pages: OgPagePreview[] }) => {
  const totalIssues = pages.reduce((s, p) => s + p.issues.length, 0)
  const totalWarnings = pages.reduce((s, p) => s + p.warnings.length, 0)

  return (
    <AdminShell active="og" title="OG 미리보기 검증">
      <div style="margin-bottom:24px; padding:20px 24px; background:linear-gradient(135deg, var(--brand-50), white); border:1px solid var(--brand-100); border-radius:var(--radius-md);">
        <div style="display:flex; gap:32px; align-items:center; flex-wrap:wrap;">
          <div>
            <div style="font-size:0.85rem; color:var(--ink-500);">검사 페이지</div>
            <div style="font-size:1.6rem; font-weight:700;">{pages.length}개</div>
          </div>
          <div>
            <div style="font-size:0.85rem; color:var(--ink-500);">Critical Issues</div>
            <div style={`font-size:1.6rem; font-weight:700; color:${totalIssues > 0 ? '#d33' : '#0a0'};`}>{totalIssues}</div>
          </div>
          <div>
            <div style="font-size:0.85rem; color:var(--ink-500);">Warnings</div>
            <div style={`font-size:1.6rem; font-weight:700; color:${totalWarnings > 0 ? '#d80' : '#0a0'};`}>{totalWarnings}</div>
          </div>
          <div style="margin-left:auto; display:flex; gap:8px;">
            <a href="https://developers.facebook.com/tools/debug/" target="_blank" class="btn btn-ghost" style="font-size:0.85rem;">FB 디버거</a>
            <a href="https://developers.kakao.com/tool/debugger/sharing" target="_blank" class="btn btn-ghost" style="font-size:0.85rem;">카카오</a>
            <a href="https://searchadvisor.naver.com/" target="_blank" class="btn btn-ghost" style="font-size:0.85rem;">네이버 SA</a>
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr; gap:20px;">
        {pages.map((p) => {
          const hasIssue = p.issues.length > 0
          const hasWarn = p.warnings.length > 0
          const status = hasIssue ? 'critical' : hasWarn ? 'warn' : 'ok'
          const statusColor = status === 'critical' ? '#d33' : status === 'warn' ? '#d80' : '#0a8a3a'
          const statusLabel = status === 'critical' ? 'CRITICAL' : status === 'warn' ? 'WARN' : 'OK'
          return (
            <div style="background:white; border:1px solid var(--ink-100); border-radius:var(--radius-md); padding:20px 24px;">
              <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:14px;">
                <div style={`padding:4px 10px; border-radius:999px; background:${statusColor}; color:#fff; font-size:0.72rem; font-weight:700; letter-spacing:0.05em;`}>{statusLabel}</div>
                <div style="font-weight:700; font-size:1.05rem;">{p.label}</div>
                <a href={p.url} target="_blank" style="font-size:0.82rem; color:var(--brand-600);">{p.path} <i class="fas fa-arrow-up-right-from-square" style="font-size:0.7rem;"></i></a>
              </div>

              {hasIssue ? (
                <ul style="margin:0 0 12px; padding:10px 14px 10px 28px; background:#fff0f0; border:1px solid #ffd0d0; border-radius:8px; color:#992020; font-size:0.85rem;">
                  {p.issues.map((i) => <li>{i}</li>)}
                </ul>
              ) : null}
              {hasWarn ? (
                <ul style="margin:0 0 12px; padding:10px 14px 10px 28px; background:#fff8e6; border:1px solid #ffe2a8; border-radius:8px; color:#7a4d00; font-size:0.85rem;">
                  {p.warnings.map((w) => <li>{w}</li>)}
                </ul>
              ) : null}

              {/* 카카오/페이스북/네이버 카드 시뮬레이션 */}
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px; margin-top:8px;">
                {/* 카카오 카드 */}
                <div style="border:1px solid #ececec; border-radius:12px; overflow:hidden; background:#fff;">
                  <div style="padding:6px 12px; background:#FEE500; color:#3A1D1D; font-size:0.72rem; font-weight:700;">카카오톡</div>
                  {p.ogImage ? <img src={p.ogImage} alt="" style="width:100%; aspect-ratio:1.91/1; object-fit:cover; display:block;" /> : <div style="height:140px; background:#f4f4f4; display:flex; align-items:center; justify-content:center; color:#999;">no image</div>}
                  <div style="padding:10px 12px;">
                    <div style="font-size:0.78rem; color:#888;">{(() => { try { return new URL(p.url).hostname } catch { return '' } })()}</div>
                    <div style="font-weight:700; font-size:0.9rem; line-height:1.3; margin-top:2px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">{p.title || '(no title)'}</div>
                    <div style="font-size:0.78rem; color:#666; line-height:1.4; margin-top:4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">{p.description || '(no description)'}</div>
                  </div>
                </div>

                {/* 페이스북 카드 */}
                <div style="border:1px solid #dadde1; border-radius:12px; overflow:hidden; background:#f0f2f5;">
                  <div style="padding:6px 12px; background:#1877F2; color:#fff; font-size:0.72rem; font-weight:700;">페이스북</div>
                  {p.ogImage ? <img src={p.ogImage} alt="" style="width:100%; aspect-ratio:1.91/1; object-fit:cover; display:block;" /> : <div style="height:140px; background:#e4e6eb; display:flex; align-items:center; justify-content:center; color:#999;">no image</div>}
                  <div style="padding:10px 12px; background:#fff;">
                    <div style="font-size:0.7rem; color:#65676b; text-transform:uppercase;">{(() => { try { return new URL(p.url).hostname } catch { return '' } })()}</div>
                    <div style="font-weight:700; font-size:0.95rem; line-height:1.3; margin-top:2px; color:#1c1e21;">{p.title || '(no title)'}</div>
                    <div style="font-size:0.78rem; color:#65676b; line-height:1.4; margin-top:4px;">{p.description || '(no description)'}</div>
                  </div>
                </div>

                {/* 네이버 카드 */}
                <div style="border:1px solid #ececec; border-radius:12px; overflow:hidden; background:#fff;">
                  <div style="padding:6px 12px; background:#03C75A; color:#fff; font-size:0.72rem; font-weight:700;">네이버</div>
                  <div style="display:flex; gap:10px; padding:10px;">
                    {p.ogImage ? <img src={p.ogImage} alt="" style="width:100px; height:100px; object-fit:cover; flex-shrink:0; border-radius:6px;" /> : <div style="width:100px; height:100px; background:#f4f4f4; flex-shrink:0; border-radius:6px;"></div>}
                    <div style="min-width:0;">
                      <div style="font-weight:700; font-size:0.9rem; line-height:1.3; color:#222; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">{p.title || '(no title)'}</div>
                      <div style="font-size:0.78rem; color:#666; line-height:1.4; margin-top:4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">{p.description || '(no description)'}</div>
                      <div style="font-size:0.7rem; color:#03C75A; margin-top:6px;">{(() => { try { return new URL(p.url).hostname } catch { return '' } })()}</div>
                    </div>
                  </div>
                </div>
              </div>

              <details style="margin-top:12px;">
                <summary style="cursor:pointer; font-size:0.82rem; color:var(--ink-500);">원본 메타데이터 보기</summary>
                <div style="margin-top:8px; padding:10px 12px; background:#f7f7f7; border-radius:8px; font-family:ui-monospace, monospace; font-size:0.78rem; line-height:1.6;">
                  <div><strong>title:</strong> {p.title || '(없음)'}</div>
                  <div><strong>description:</strong> {p.description || '(없음)'}</div>
                  <div><strong>og:image:</strong> {p.ogImage || '(없음)'}</div>
                  <div><strong>og:url:</strong> {p.ogUrl || '(없음)'}</div>
                  <div><strong>canonical:</strong> {p.canonical || '(없음)'}</div>
                </div>
              </details>
            </div>
          )
        })}
      </div>
    </AdminShell>
  )
}