import { CLINIC, CORE_TREATMENTS, OTHER_TREATMENTS } from '../lib/constants'
import { DOCTORS } from '../data/doctors'

export const Nav = ({ onDark = false }: { onDark?: boolean }) => {
  return (
    <>
      <header class={`nav ${onDark ? 'on-dark' : ''}`} id="site-nav">
        <div class="nav-inner">
          <a href="/" class="nav-logo" aria-label={`${CLINIC.name} 홈`}>
            <span class="nav-logo-mark" aria-hidden="true">우</span>
            <span>{CLINIC.name}</span>
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

          <a href={`tel:${CLINIC.phone}`} class="nav-cta">
            <i class="fas fa-phone"></i>
            <span>{CLINIC.phone}</span>
          </a>

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
        <div style="margin-top:32px; display:flex; gap:12px;">
          <a href="/login" class="btn btn-ghost" style="flex:1; justify-content:center; border:1px solid var(--ink-200); color:var(--ink-900);">로그인</a>
          <a href="/signup" class="btn btn-primary" style="flex:1; justify-content:center;">회원가입</a>
        </div>
        <a href={`tel:${CLINIC.phone}`} class="btn btn-dark" style="width:100%; justify-content:center; margin-top:12px;">
          <i class="fas fa-phone"></i> {CLINIC.phone}
        </a>
      </div>
    </>
  )
}
