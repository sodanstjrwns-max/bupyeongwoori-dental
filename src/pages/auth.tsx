import { Layout } from '../components/Layout'
import { CLINIC } from '../lib/constants'

export const SignupPage = ({ error }: { error?: string }) => {
  return (
    <Layout
      title="회원가입"
      description={`${CLINIC.name} 회원가입. 가입 시 비포애프터 전체 사진 열람, 다양한 진료 정보 이용이 가능합니다.`}
      canonical={`https://${CLINIC.domain}/signup`}
    >
      <section class="page-hero" style="padding:140px 0 60px;">
        <div class="container">
          <div class="breadcrumb"><a href="/">홈</a><span class="sep">/</span>회원가입</div>
          <h1>회원 <em>가입</em></h1>
          <p>가입하시면 비포애프터의 전체 사진(치료 후) 열람 등 회원 전용 혜택을 이용하실 수 있습니다.</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <form class="form-wrap wide" method="post" action="/api/auth/signup" id="signup-form">
            <h2 class="form-title">회원가입</h2>
            <p class="form-sub">부평우리치과 회원이 되어 주세요.</p>

            {error && <div class="alert alert-error">{error}</div>}

            <div class="field">
              <label>이름 <span class="required">*</span></label>
              <input type="text" name="name" required maxlength="50" placeholder="홍길동" />
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
              <div class="field">
                <label>이메일 <span class="required">*</span></label>
                <input type="email" name="email" required placeholder="email@example.com" />
                <div class="help">아이디로 사용됩니다.</div>
              </div>
              <div class="field">
                <label>전화번호 <span class="required">*</span></label>
                <input type="tel" name="phone" required pattern="[0-9\-]*" placeholder="010-1234-5678" />
                <div class="help">예약 및 중요 공지 안내용.</div>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
              <div class="field">
                <label>비밀번호 <span class="required">*</span></label>
                <input type="password" name="password" required minlength="8" maxlength="80" />
                <div class="help">8자 이상.</div>
              </div>
              <div class="field">
                <label>비밀번호 확인 <span class="required">*</span></label>
                <input type="password" name="password_confirm" required minlength="8" maxlength="80" />
              </div>
            </div>

            <div style="margin-top:20px; padding:20px; background:var(--ink-50); border-radius:var(--radius);">
              <label class="checkbox-row" style="font-weight:600; color:var(--ink-900); border-bottom:1px solid var(--ink-200); padding-bottom:12px;">
                <input type="checkbox" id="agree-all" />
                <span>전체 동의</span>
              </label>
              <label class="checkbox-row">
                <input type="checkbox" name="agreed_privacy" value="1" required />
                <span><strong>[필수]</strong> 개인정보 수집 및 이용 동의 <a href="/privacy" target="_blank">[전문]</a></span>
              </label>
              <label class="checkbox-row">
                <input type="checkbox" name="agreed_marketing" value="1" />
                <span>[선택] 마케팅 정보 수신 동의 (이벤트·공지·진료 안내)</span>
              </label>
            </div>

            <div class="form-actions">
              <a href="/" class="btn" style="background:white; border:1px solid var(--ink-200); color:var(--ink-700);">취소</a>
              <button type="submit" class="btn btn-primary">가입 완료</button>
            </div>

            <div class="form-footer">
              이미 회원이신가요? <a href="/login">로그인</a>
            </div>
          </form>
        </div>
      </section>

      <script dangerouslySetInnerHTML={{ __html: `
        document.getElementById('agree-all')?.addEventListener('change', function(e) {
          const boxes = document.querySelectorAll('#signup-form input[type=checkbox][name^="agreed"]');
          boxes.forEach(b => b.checked = e.target.checked);
        });
        document.getElementById('signup-form')?.addEventListener('submit', function(e) {
          e.preventDefault();
          const fd = new FormData(e.target);
          const p1 = fd.get('password'), p2 = fd.get('password_confirm');
          if (p1 !== p2) { alert('비밀번호가 일치하지 않습니다.'); return; }
          fetch('/api/auth/signup', { method:'POST', body: fd })
            .then(r => r.json())
            .then(j => {
              if (j.ok) { alert('가입이 완료되었습니다. 환영합니다!'); location.href = '/'; }
              else { alert(j.error || '가입 실패'); }
            })
            .catch(() => alert('네트워크 오류'));
        });
      `}} />
    </Layout>
  )
}

export const LoginPage = ({ redirect, error }: { redirect?: string; error?: string }) => {
  return (
    <Layout
      title="로그인"
      description={`${CLINIC.name} 회원 로그인.`}
      canonical={`https://${CLINIC.domain}/login`}
    >
      <section class="page-hero" style="padding:140px 0 60px;">
        <div class="container">
          <div class="breadcrumb"><a href="/">홈</a><span class="sep">/</span>로그인</div>
          <h1>로그 <em>인</em></h1>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <form class="form-wrap" method="post" action="/api/auth/login" id="login-form">
            <h2 class="form-title">로그인</h2>
            <p class="form-sub">비포애프터 전체 사진 열람은 로그인이 필요합니다.</p>

            {error && <div class="alert alert-error">{error}</div>}

            <input type="hidden" name="redirect" value={redirect ?? '/'} />

            <div class="field">
              <label>이메일</label>
              <input type="email" name="email" required placeholder="email@example.com" />
            </div>

            <div class="field">
              <label>비밀번호</label>
              <input type="password" name="password" required />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" style="width:100%;">로그인</button>
            </div>

            <div class="form-footer">
              아직 회원이 아니신가요? <a href="/signup">회원가입</a>
            </div>
          </form>
        </div>
      </section>

      <script dangerouslySetInnerHTML={{ __html: `
        document.getElementById('login-form')?.addEventListener('submit', function(e) {
          e.preventDefault();
          const fd = new FormData(e.target);
          fetch('/api/auth/login', { method:'POST', body: fd })
            .then(r => r.json())
            .then(j => {
              if (j.ok) { location.href = j.redirect || '/'; }
              else { alert(j.error || '로그인 실패'); }
            })
            .catch(() => alert('네트워크 오류'));
        });
      `}} />
    </Layout>
  )
}
