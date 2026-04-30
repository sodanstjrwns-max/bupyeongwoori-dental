import { Layout } from '../components/Layout'
import { CLINIC } from '../lib/constants'
import { CtaSection } from '../components/CtaSection'

export type MyPageUser = {
  id: number
  email: string
  name: string
  phone: string | null
  role: string
  created_at?: string
  agreed_marketing?: number
}

type MyPageProps = {
  user: MyPageUser
  stats: {
    baCount: number
    blogCount: number
    noticeCount: number
  }
  notice?: string
  error?: string
}

// ============================================================
// 마이페이지 — 회원 전용
// ============================================================
export const MyPage = ({ user, stats, notice, error }: MyPageProps) => {
  const formatDate = (s?: string) => {
    if (!s) return '-'
    try {
      const d = new Date(s.replace(' ', 'T'))
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
    } catch {
      return s
    }
  }

  return (
    <Layout
      title="마이페이지"
      description={`${CLINIC.name} 회원 전용 마이페이지. 비포애프터 전체 케이스 열람, 회원 정보 관리, 마케팅 수신 동의 변경 등을 확인하실 수 있습니다.`}
      canonical={`https://${CLINIC.domain}/mypage`}
      noindex
    >
      <section class="hero" style="min-height:38vh; padding-top:120px; padding-bottom:40px;">
        <div class="container hero-content">
          <div class="hero-eyebrow" data-reveal>
            <span class="dot"></span>
            <span>MYPAGE · 회원 전용</span>
          </div>
          <h1 class="hero-title" data-reveal data-reveal-delay="1" style="font-size:clamp(2rem, 4vw, 3rem);">
            <span class="hero-title-row">{user.name}<em class="ph-mint-1">님</em>, 안녕하세요.</span>
          </h1>
          <p class="hero-sub" data-reveal data-reveal-delay="2" style="margin-top:12px;">
            회원 전용 비포애프터 전체 케이스 열람, 진료 정보, 회원 정보를 한 곳에서 관리하실 수 있습니다.
          </p>
        </div>
      </section>

      <section class="section" style="padding-top:0;">
        <div class="container">
          {notice ? (
            <div style="background:#dfffe4; color:#0a6e2c; padding:14px 18px; border-radius:12px; border:1px solid #a7e7b8; margin-bottom:24px;">
              <i class="fas fa-check-circle"></i> {notice}
            </div>
          ) : null}
          {error ? (
            <div style="background:#ffe1e1; color:#992020; padding:14px 18px; border-radius:12px; border:1px solid #ffb4b4; margin-bottom:24px;">
              <i class="fas fa-times-circle"></i> {error}
            </div>
          ) : null}

          {/* 회원 카드 + 통계 */}
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:20px; margin-bottom:48px;">
            <div class="mypage-stat" style="background:linear-gradient(135deg, #0F1817, #143735 60%, #0E7C75); color:white; border-radius:var(--radius-md); padding:28px 30px;">
              <div style="font-size:0.78rem; letter-spacing:0.2em; text-transform:uppercase; color:#5BCEC9; font-weight:600;">MEMBER</div>
              <div style="font-size:1.6rem; font-weight:800; margin-top:8px;">{user.name}</div>
              <div style="font-size:0.9rem; color:rgba(255,255,255,0.75); margin-top:4px;">{user.email}</div>
              <div style="margin-top:16px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.1); font-size:0.82rem; color:rgba(255,255,255,0.65);">
                <i class="fas fa-calendar"></i> 가입일 · {formatDate(user.created_at)}
              </div>
            </div>

            <a href="/before-after" class="mypage-stat" style="background:white; border:1px solid var(--ink-100); border-radius:var(--radius-md); padding:28px 30px; text-decoration:none; color:inherit; transition:all 0.2s;">
              <div style="font-size:0.78rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--brand-600); font-weight:600;">BEFORE-AFTER</div>
              <div style="display:flex; align-items:baseline; gap:8px; margin-top:8px;">
                <span style="font-size:2rem; font-weight:800; color:var(--ink-900);">{stats.baCount}</span>
                <span style="font-size:0.9rem; color:var(--ink-500);">전체 케이스 열람 가능</span>
              </div>
              <div style="font-size:0.85rem; color:var(--ink-500); margin-top:12px;">
                회원 전용으로 모든 비포애프터 사진을 확인하실 수 있습니다.
              </div>
              <div style="margin-top:16px; color:var(--brand-600); font-size:0.9rem; font-weight:600;">
                케이스 보러가기 <i class="fas fa-arrow-right" style="font-size:0.75rem;"></i>
              </div>
            </a>

            <a href="/blog" class="mypage-stat" style="background:white; border:1px solid var(--ink-100); border-radius:var(--radius-md); padding:28px 30px; text-decoration:none; color:inherit; transition:all 0.2s;">
              <div style="font-size:0.78rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--brand-600); font-weight:600;">BLOG</div>
              <div style="display:flex; align-items:baseline; gap:8px; margin-top:8px;">
                <span style="font-size:2rem; font-weight:800; color:var(--ink-900);">{stats.blogCount}</span>
                <span style="font-size:0.9rem; color:var(--ink-500);">진료 정보 글</span>
              </div>
              <div style="font-size:0.85rem; color:var(--ink-500); margin-top:12px;">
                새로 발행되는 진료 정보를 받아보세요.
              </div>
              <div style="margin-top:16px; color:var(--brand-600); font-size:0.9rem; font-weight:600;">
                블로그 보러가기 <i class="fas fa-arrow-right" style="font-size:0.75rem;"></i>
              </div>
            </a>

            <a href="/notices" class="mypage-stat" style="background:white; border:1px solid var(--ink-100); border-radius:var(--radius-md); padding:28px 30px; text-decoration:none; color:inherit; transition:all 0.2s;">
              <div style="font-size:0.78rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--brand-600); font-weight:600;">NOTICES</div>
              <div style="display:flex; align-items:baseline; gap:8px; margin-top:8px;">
                <span style="font-size:2rem; font-weight:800; color:var(--ink-900);">{stats.noticeCount}</span>
                <span style="font-size:0.9rem; color:var(--ink-500);">병원 공지</span>
              </div>
              <div style="font-size:0.85rem; color:var(--ink-500); margin-top:12px;">
                진료 시간 변경, 휴진, 이벤트 등을 확인하세요.
              </div>
              <div style="margin-top:16px; color:var(--brand-600); font-size:0.9rem; font-weight:600;">
                공지 보러가기 <i class="fas fa-arrow-right" style="font-size:0.75rem;"></i>
              </div>
            </a>
          </div>

          {/* 회원 정보 폼 */}
          <div style="display:grid; grid-template-columns:1fr; gap:32px; max-width:720px;">
            <div style="background:white; border:1px solid var(--ink-100); border-radius:var(--radius-md); padding:32px;">
              <h2 style="font-size:1.3rem; font-weight:700; margin-bottom:20px; display:flex; align-items:center; gap:10px;">
                <i class="fas fa-user-pen" style="color:var(--brand-500);"></i> 회원 정보 수정
              </h2>
              <form method="post" action="/mypage/update" style="display:grid; gap:16px;">
                <label class="field">
                  <span>이름</span>
                  <input type="text" name="name" defaultValue={user.name} required maxLength={50} />
                </label>
                <label class="field">
                  <span>이메일</span>
                  <input type="email" defaultValue={user.email} disabled style="opacity:0.6;" />
                  <small style="color:var(--ink-400); font-size:0.8rem;">이메일은 변경할 수 없습니다.</small>
                </label>
                <label class="field">
                  <span>전화번호</span>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={user.phone ?? ''}
                    pattern="[0-9\-]+"
                    placeholder="010-0000-0000"
                  />
                </label>
                <label class="checkbox" style="margin-top:8px;">
                  <input
                    type="checkbox"
                    name="agreed_marketing"
                    value="1"
                    checked={user.agreed_marketing === 1}
                  />
                  <span>마케팅 정보 수신 동의 (이벤트·신규 진료 안내)</span>
                </label>
                <div style="display:flex; gap:10px; margin-top:8px;">
                  <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> 저장
                  </button>
                </div>
              </form>
            </div>

            {/* 비밀번호 변경 */}
            <div style="background:white; border:1px solid var(--ink-100); border-radius:var(--radius-md); padding:32px;">
              <h2 style="font-size:1.3rem; font-weight:700; margin-bottom:20px; display:flex; align-items:center; gap:10px;">
                <i class="fas fa-lock" style="color:var(--brand-500);"></i> 비밀번호 변경
              </h2>
              <form method="post" action="/mypage/password" style="display:grid; gap:16px;">
                <label class="field">
                  <span>현재 비밀번호</span>
                  <input type="password" name="current" required minLength={8} maxLength={80} autoComplete="current-password" />
                </label>
                <label class="field">
                  <span>새 비밀번호 (8~80자)</span>
                  <input type="password" name="next" required minLength={8} maxLength={80} autoComplete="new-password" />
                </label>
                <label class="field">
                  <span>새 비밀번호 확인</span>
                  <input type="password" name="confirm" required minLength={8} maxLength={80} autoComplete="new-password" />
                </label>
                <div style="display:flex; gap:10px; margin-top:8px;">
                  <button type="submit" class="btn btn-primary">
                    <i class="fas fa-key"></i> 비밀번호 변경
                  </button>
                </div>
              </form>
            </div>

            {/* 위험 영역 */}
            <div style="background:#fafafa; border:1px solid var(--ink-100); border-radius:var(--radius-md); padding:24px 32px;">
              <h2 style="font-size:1.05rem; font-weight:700; margin-bottom:8px; color:var(--ink-700);">로그아웃 / 회원 탈퇴</h2>
              <p style="color:var(--ink-500); font-size:0.88rem; margin-bottom:16px;">
                로그아웃하시거나 회원 탈퇴를 원하시는 경우 아래 버튼을 사용하세요. 탈퇴 시 모든 회원 정보가 삭제되며 복구할 수 없습니다.
              </p>
              <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <a href="/api/auth/logout" class="btn" style="background:white; border:1px solid var(--ink-200);">
                  <i class="fas fa-right-from-bracket"></i> 로그아웃
                </a>
                <form method="post" action="/mypage/delete" onsubmit="return confirm('정말 탈퇴하시겠습니까? 모든 회원 정보가 삭제되며 복구할 수 없습니다.');" style="display:inline;">
                  <button type="submit" class="btn" style="background:white; border:1px solid #ffb4b4; color:#992020;">
                    <i class="fas fa-user-xmark"></i> 회원 탈퇴
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaSection
        variant="light"
        eyebrow="CONTACT · 진료 상담은 언제든"
        title="필요하실 때, 언제든 편하게 문의주세요."
        lead="회원이라면 더 빠르게, 정확하게 안내드립니다."
      />
    </Layout>
  )
}
