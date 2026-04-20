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
    <Layout title="관리자 로그인" noindex hideFooter>
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
              <span>이메일</span>
              <input type="email" name="email" required autoComplete="email" />
            </label>
            <label class="field">
              <span>비밀번호</span>
              <input type="password" name="password" required autoComplete="current-password" />
            </label>
            <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:12px;">
              로그인 <i class="fas fa-arrow-right"></i>
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
    <Layout title={`[관리자] ${title}`} noindex hideFooter>
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
      <form method="post" action={isEdit ? `/admin/before-after/${data.id}/edit` : '/admin/before-after/new'} enctype="multipart/form-data" class="admin-form">
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

          <label class="field">
            <span>상세 설명 (HTML)</span>
            <textarea name="content" rows={8} placeholder="&lt;p&gt;...&lt;/p&gt;">{data?.content ?? ''}</textarea>
          </label>
        </div>

        <div class="admin-card">
          <h2>이미지 (R2 업로드)</h2>
          <p style="color:var(--ink-500); font-size:0.9rem;">각 항목을 별도로 업로드하거나, 기존 R2 키를 직접 입력할 수 있습니다.</p>
          <div class="field-row">
            <label class="field">
              <span>파노라마 BEFORE (파일 업로드)</span>
              <input type="file" name="before_pano_file" accept="image/*" />
              <input type="text" name="before_pano_key" value={data?.before_pano_key ?? ''} placeholder="기존 R2 키 (선택)" style="margin-top:6px;" />
            </label>
            <label class="field">
              <span>파노라마 AFTER (파일 업로드)</span>
              <input type="file" name="after_pano_file" accept="image/*" />
              <input type="text" name="after_pano_key" value={data?.after_pano_key ?? ''} placeholder="기존 R2 키 (선택)" style="margin-top:6px;" />
            </label>
          </div>
          <div class="field-row">
            <label class="field">
              <span>구내 BEFORE (파일 업로드)</span>
              <input type="file" name="before_intra_file" accept="image/*" />
              <input type="text" name="before_intra_key" value={data?.before_intra_key ?? ''} placeholder="기존 R2 키 (선택)" style="margin-top:6px;" />
            </label>
            <label class="field">
              <span>구내 AFTER (파일 업로드)</span>
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
      <form method="post" action={isEdit ? `/admin/blog/${data.id}/edit` : '/admin/blog/new'} enctype="multipart/form-data" class="admin-form" id="blog-form">
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
            <button type="button" data-cmd="h2" class="editor-btn">H2</button>
            <button type="button" data-cmd="h3" class="editor-btn">H3</button>
            <button type="button" data-cmd="p" class="editor-btn">단락</button>
            <button type="button" data-cmd="bold" class="editor-btn"><b>B</b></button>
            <button type="button" data-cmd="italic" class="editor-btn"><i>I</i></button>
            <button type="button" data-cmd="ul" class="editor-btn">• 목록</button>
            <button type="button" data-cmd="ol" class="editor-btn">1. 목록</button>
            <button type="button" data-cmd="link" class="editor-btn">🔗 링크</button>
            <button type="button" data-cmd="img" class="editor-btn">🖼 이미지</button>
          </div>
          <div class="editor-drop" id="editor-drop">
            <div
              id="editor"
              class="editor-area"
              contenteditable="true"
              data-placeholder="본문을 작성하세요. 이미지는 툴바에서 업로드하거나 드래그&드롭 하시면 됩니다."
              // @ts-ignore
              dangerouslySetInnerHTML={{ __html: data?.content ?? '' }}
            />
          </div>
          <textarea name="content" id="content-output" style="display:none;">{data?.content ?? ''}</textarea>
          <input type="file" id="editor-upload-inline" accept="image/*" multiple style="display:none;" />
        </div>

        <div class="admin-card">
          <h2>커버 이미지</h2>
          <div class="field-row">
            <label class="field">
              <span>커버 이미지 파일</span>
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
      <form method="post" action={isEdit ? `/admin/notices/${data.id}/edit` : '/admin/notices/new'} enctype="multipart/form-data" class="admin-form">
        <div class="admin-card">
          <label class="field">
            <span>제목 *</span>
            <input type="text" name="title" required value={data?.title ?? ''} />
          </label>
          <label class="field">
            <span>본문 (HTML) *</span>
            <textarea name="content" rows={10} required>{data?.content ?? ''}</textarea>
          </label>
          <label class="field">
            <span>이미지 (선택)</span>
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
