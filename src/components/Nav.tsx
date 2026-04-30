import { CLINIC, CORE_TREATMENTS, OTHER_TREATMENTS } from '../lib/constants'
import { DOCTORS } from '../data/doctors'

export type NavUser = {
  id: number
  name: string
  email: string
  role: string
} | null

export const Nav = ({ onDark = false, user = null }: { onDark?: boolean; user?: NavUser }) => {
  return (
    <>
      <header class={`nav ${onDark ? 'on-dark' : ''}`} id="site-nav">
        <div class="nav-inner">
          <a href="/" class="nav-logo" aria-label={`${CLINIC.name} 홈`}>
            <span class="nav-logo-mark" aria-hidden="true">
              <img src="/media/brand/mark-256.png" alt="" width="36" height="36" loading="eager" />
            </span>
            <span class="nav-logo-text">{CLINIC.name}</span>
          </a>

          <nav class="nav-menu" aria-label="주요 메뉴">
            <div class="nav-item">
              <a href="/mission" class="nav-link">병원미션</a>
            </div>

            <div class="nav-item">
              <a href="/doctors" class="nav-link">의료진소개 ▾</a>
              <div class="nav-dropdown">
                <a href="/doctors">전체 의료진</a>
                {DOCTORS.filter((d) => d.name && d.role !== 'doctor' || d.slug === 'kim-jaein').map((d) => (
                  <a href={`/doctors/${d.slug}`}>{d.title} {d.name}</a>
                ))}
              </div>
            </div>

            <div class="nav-item">
              <a href="/treatments" class="nav-link">진료과목 ▾</a>
              <div class="nav-dropdown">
                <a href="/treatments"><strong>전체 진료 안내</strong></a>
                {CORE_TREATMENTS.map((t) => (
                  <a href={`/treatments/${t.slug}`}>★ {t.name}</a>
                ))}
                {OTHER_TREATMENTS.map((t) => (
                  <a href={`/treatments/${t.slug}`}>{t.name}</a>
                ))}
              </div>
            </div>

            <div class="nav-item">
              <a href="/blog" class="nav-link">콘텐츠 ▾</a>
              <div class="nav-dropdown">
                <a href="/before-after">비포애프터</a>
                <a href="/blog">블로그</a>
                <a href="/notices">공지사항</a>
                <a href="/glossary">치과 백과사전</a>
                <a href="/faq">자주 묻는 질문</a>
              </div>
            </div>

            <div class="nav-item">
              <a href="/visit" class="nav-link">내원안내 ▾</a>
              <div class="nav-dropdown">
                <a href="/visit">오시는 길</a>
                <a href="/visit#hours">진료 시간</a>
                <a href="/visit#pricing">수가 안내</a>
              </div>
            </div>
          </nav>

          <div class="nav-cta-group">
            <a href={CLINIC.socialLinks.naverBooking} target="_blank" rel="noopener" class="nav-cta nav-cta-book" aria-label="네이버 예약">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z"/></svg>
              <span>예약</span>
            </a>
            <a href={CLINIC.socialLinks.kakao} target="_blank" rel="noopener" class="nav-cta nav-cta-kakao" aria-label="카카오톡 상담" title="카카오톡 상담">
              <i class="fas fa-comment"></i>
              <span>상담</span>
            </a>
            {user ? (
              <div class="nav-item nav-item-account">
                <a href="/mypage" class="nav-cta nav-cta-account" title={`${user.name}님 마이페이지`}>
                  <i class="fas fa-user-circle"></i>
                  <span>{user.name}</span>
                </a>
                <div class="nav-dropdown nav-dropdown-account">
                  <a href="/mypage"><i class="fas fa-id-card-clip"></i> 마이페이지</a>
                  {user.role === 'admin' ? (
                    <a href="/admin"><i class="fas fa-gauge"></i> 관리자</a>
                  ) : null}
                  <a href="/api/auth/logout"><i class="fas fa-right-from-bracket"></i> 로그아웃</a>
                </div>
              </div>
            ) : (
              <a href="/login" class="nav-cta nav-cta-login" title="로그인">
                <i class="fas fa-right-to-bracket"></i>
                <span>로그인</span>
              </a>
            )}
          </div>

          <button class="nav-burger" id="nav-burger" aria-label="메뉴 열기" aria-expanded="false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div class="mobile-menu" id="mobile-menu">
        <details>
          <summary>병원미션</summary>
          <a href="/mission">병원의 미션과 철학</a>
        </details>
        <details>
          <summary>의료진소개</summary>
          <a href="/doctors">전체 의료진</a>
          {DOCTORS.map((d) => (
            <a href={`/doctors/${d.slug}`}>{`${d.title} ${d.name}`}</a>
          ))}
        </details>
        <details>
          <summary>진료과목</summary>
          <a href="/treatments"><strong>전체 진료 안내</strong></a>
          {[...CORE_TREATMENTS].map((t) => (
            <a href={`/treatments/${t.slug}`}>★ {t.name}</a>
          ))}
          {OTHER_TREATMENTS.map((t) => (
            <a href={`/treatments/${t.slug}`}>{t.name}</a>
          ))}
        </details>
        <details>
          <summary>콘텐츠</summary>
          <a href="/before-after">비포애프터</a>
          <a href="/blog">블로그</a>
          <a href="/notices">공지사항</a>
          <a href="/glossary">치과 백과사전</a>
          <a href="/faq">자주 묻는 질문</a>
        </details>
        <details>
          <summary>내원안내</summary>
          <a href="/visit">오시는 길</a>
          <a href="/visit#hours">진료 시간</a>
          <a href="/visit#pricing">수가 안내</a>
        </details>
        {user ? (
          <div style="margin-top:32px; display:flex; flex-direction:column; gap:10px; padding:16px 18px; background:#F4FBFA; border:1px solid #C9EAE7; border-radius:14px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <i class="fas fa-user-circle" style="font-size:1.4rem; color:var(--brand-600);"></i>
              <div>
                <div style="font-weight:700; color:var(--ink-900);">{user.name}님</div>
                <div style="font-size:0.78rem; color:var(--ink-500);">{user.email}</div>
              </div>
            </div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <a href="/mypage" class="btn btn-primary" style="flex:1; justify-content:center;">마이페이지</a>
              {user.role === 'admin' ? (
                <a href="/admin" class="btn btn-dark" style="flex:1; justify-content:center;">관리자</a>
              ) : null}
              <a href="/api/auth/logout" class="btn btn-ghost" style="flex:1; justify-content:center; border:1px solid var(--ink-200); color:var(--ink-900);">로그아웃</a>
            </div>
          </div>
        ) : (
          <div style="margin-top:32px; display:flex; gap:12px;">
            <a href="/login" class="btn btn-ghost" style="flex:1; justify-content:center; border:1px solid var(--ink-200); color:var(--ink-900);">로그인</a>
            <a href="/signup" class="btn btn-primary" style="flex:1; justify-content:center;">회원가입</a>
          </div>
        )}
        <a href={CLINIC.socialLinks.naverBooking} target="_blank" rel="noopener" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:12px; background:#03C75A; border-color:#03C75A;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z"/></svg>
          네이버 예약
        </a>
        <a href={CLINIC.socialLinks.kakao} target="_blank" rel="noopener" class="btn" style="width:100%; justify-content:center; margin-top:8px; background:#FEE500; color:#3A1D1D; border:none;">
          <i class="fas fa-comment"></i> 카카오톡 상담
        </a>
        <a href={`tel:${CLINIC.phone}`} class="btn btn-dark" style="width:100%; justify-content:center; margin-top:8px;">
          <i class="fas fa-phone"></i> {CLINIC.phone}
        </a>
        <div style="margin-top:24px; display:flex; gap:14px; justify-content:center; padding-top:20px; border-top:1px solid var(--ink-100);">
          <a href={CLINIC.socialLinks.naverPlace} target="_blank" rel="noopener" aria-label="네이버 플레이스" style="color:var(--ink-500); font-size:1.2rem;"><i class="fas fa-map-marker-alt"></i></a>
          <a href={CLINIC.socialLinks.blog} target="_blank" rel="noopener" aria-label="블로그" style="color:var(--ink-500); font-size:1.2rem;"><i class="fas fa-blog"></i></a>
          <a href={CLINIC.socialLinks.instagram} target="_blank" rel="noopener" aria-label="인스타그램" style="color:var(--ink-500); font-size:1.2rem;"><i class="fab fa-instagram"></i></a>
          <a href={CLINIC.socialLinks.youtube} target="_blank" rel="noopener" aria-label="유튜브" style="color:var(--ink-500); font-size:1.2rem;"><i class="fab fa-youtube"></i></a>
          <a href={CLINIC.socialLinks.facebook} target="_blank" rel="noopener" aria-label="페이스북" style="color:var(--ink-500); font-size:1.2rem;"><i class="fab fa-facebook-f"></i></a>
        </div>
      </div>
    </>
  )
}
