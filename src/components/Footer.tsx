import { CLINIC, CORE_TREATMENTS, OTHER_TREATMENTS } from '../lib/constants'

export const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="logo">{CLINIC.name}</div>
            <p>{CLINIC.mission}</p>
            <div class="footer-social" aria-label="SNS">
              <a href={CLINIC.socialLinks.blog} target="_blank" rel="noopener" aria-label="네이버 블로그">
                <i class="fas fa-blog"></i>
              </a>
              <a href={CLINIC.socialLinks.instagram} target="_blank" rel="noopener" aria-label="인스타그램">
                <i class="fab fa-instagram"></i>
              </a>
              <a href={`tel:${CLINIC.phone}`} aria-label="전화">
                <i class="fas fa-phone"></i>
              </a>
            </div>
          </div>

          <div>
            <h4>병원 안내</h4>
            <a href="/mission">병원미션</a>
            <a href="/doctors">의료진소개</a>
            <a href="/visit">오시는 길</a>
            <a href="/visit#hours">진료 시간</a>
            <a href="/visit#pricing">수가 안내</a>
          </div>

          <div>
            <h4>진료과목</h4>
            {CORE_TREATMENTS.map((t) => (
              <a href={`/treatments/${t.slug}`}>★ {t.name}</a>
            ))}
            {OTHER_TREATMENTS.slice(0, 3).map((t) => (
              <a href={`/treatments/${t.slug}`}>{t.name}</a>
            ))}
            <a href="/treatments">전체 진료 보기 →</a>
          </div>

          <div>
            <h4>고객센터</h4>
            <a href="/before-after">비포애프터</a>
            <a href="/blog">블로그</a>
            <a href="/notices">공지사항</a>
            <a href="/glossary">치과 백과사전</a>
            <a href="/faq">자주 묻는 질문</a>
          </div>
        </div>

        <div style="margin-top:56px; padding-top:28px; border-top:1px solid rgba(255,255,255,0.08); display:grid; gap:20px; grid-template-columns:1fr; font-size:0.85rem; color:rgba(255,255,255,0.55);">
          <div style="display:grid; gap:6px;">
            <div><strong style="color:rgba(255,255,255,0.8);">{CLINIC.business.name}</strong> · 대표원장 {CLINIC.business.representative}</div>
            <div>주소 : {CLINIC.address}</div>
            <div>대표전화 : <a href={`tel:${CLINIC.phone}`} style="display:inline;">{CLINIC.phone}</a> · 이메일 : <a href={`mailto:${CLINIC.email}`} style="display:inline;">{CLINIC.email}</a></div>
            <div>사업자등록번호 : {CLINIC.business.registrationNumber}</div>
          </div>
        </div>

        <div class="footer-bottom">
          <span>© {year} {CLINIC.name}. All rights reserved.</span>
          <span>Since {CLINIC.since} · 부평역 26번 출구</span>
        </div>
      </div>
    </footer>
  )
}
