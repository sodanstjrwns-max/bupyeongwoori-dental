/* 부평우리치과 메인 스크롤 몰입 연출 (GSAP ScrollTrigger + Lenis)
   톤: "변하지 않는 진료, 신뢰, 우리" — 잉크 블랙 위 민트 한 줄. 또렷하고 단정하게, 짧고 정확한 이징
   - 글자는 모두 HTML 에 그대로 두고 움직임만 더한다(크롤러·AEO 영향 없음)
   - 동작 줄이기 사용자는 아무것도 하지 않는다 / JS 가 꺼져도 전부 보인다 */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  // app.js(defer)의 [data-reveal] IntersectionObserver 가 먼저 붙은 뒤 넘겨받는다
  // #앵커로 들어오면 브라우저의 앵커 이동(사이트의 부드러운 스크롤 포함)이 끝난 뒤에 시작한다 — ScrollTrigger 초기 계산이 이동을 끊지 않도록
  function boot() {
    if (location.hash.length < 2) { setTimeout(start, 120); return; }
    var t0 = Date.now(), timer = 0, done = false;
    function run() { if (done) return; done = true; clearTimeout(timer); removeEventListener('scroll', settle); start(); }
    function settle() { clearTimeout(timer); timer = setTimeout(run, Math.max(220, 400 - (Date.now() - t0))); }
    addEventListener('scroll', settle, { passive: true });
    settle();
    setTimeout(run, 2500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  function start() {
  var root = document.documentElement;
  root.classList.add('mx');

  // 등장 대기열: 화면 진입 때 재생, 페이지 맨 끝에 닿으면 남은 것 전부 재생(끝 근처라 기준선에 못 닿는 블록 대비)
  var pending = [], finishers = [];
  function go(tw) {
    if (tw._mxGo) return; tw._mxGo = 1;
    tw.play();
    setTimeout(function () { if (tw.progress() < 1) tw.progress(1); }, (tw.totalDuration() + 0.6) * 1000);
  }
  addEventListener('scroll', function () {
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) { pending.forEach(go); finishers.slice().forEach(function (f) { f(); }); }
  }, { passive: true });
  var mobile = matchMedia('(max-width: 767px)').matches;
  var fine = matchMedia('(pointer: fine)').matches;
  var CRISP = 'power4.out';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return gsap.utils.toArray((ctx || document).querySelectorAll(sel)); };
  var main = $('#main') || document.body;
  var hero = $('.hero', main);
  if (hero) hero.classList.add('mx-hero');

  // 기존 [data-reveal] 등장은 히어로 밖에서 넘겨받는다(속성을 떼면 CSS 가 숨기지 않음)
  $$('[data-reveal]', main).forEach(function (el) {
    if (hero && hero.contains(el)) return;
    el.removeAttribute('data-reveal');
    el.classList.remove('revealed', 'is-visible');
  });

  // 1) 관성 스크롤 — 마우스·트랙패드만. 짧고 단단하게
  // 표준 모드(<!DOCTYPE html>)에서만 — 호환(quirks) 모드는 스크롤 주체가 body 라 Lenis 가 움직이지 못한다
  if (fine && window.Lenis && document.compatMode === 'CSS1Compat') {
    var lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 1,
      prevent: function (node) { return !!(node.closest && node.closest('.mobile-menu, [data-lenis-prevent]')); } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target; try { target = document.querySelector(id); } catch (err) { return; }
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
      });
    });
  }

  // ── 엔진
  var TIMING = ['duration', 'ease', 'stagger', 'delay'];
  var claimed = [];
  function claim(list) { gsap.utils.toArray(list).forEach(function (el) { claimed.push(el); }); }
  function isClaimed(el) { return claimed.some(function (c) { return c === el || c.contains(el) || el.contains(c); }); }
  function enter(targets, vars, trigger, start) {
    targets = gsap.utils.toArray(targets);
    if (!targets.length) return null;
    claim(targets);
    var from = {}, to = { opacity: 1, x: 0, y: 0, xPercent: 0, yPercent: 0, rotate: 0, rotateX: 0, rotateY: 0, skewY: 0, scale: 1, paused: true,
      onStart: function () { gsap.set(targets, { transition: 'none' }); },
      onComplete: function () { gsap.set(targets, { clearProps: 'opacity,transform,transition,clipPath' }); } };
    Object.keys(vars).forEach(function (k) { (TIMING.indexOf(k) > -1 ? to : from)[k] = vars[k]; });
    if (from.clipPath) to.clipPath = vars.clipTo || 'inset(0% 0% 0% 0%)';
    delete from.clipTo;
    var tw = gsap.fromTo(targets, from, to);
    pending.push(tw);
    ScrollTrigger.create({ trigger: trigger || targets[0], start: start || 'top 88%', once: true, onEnter: function () { go(tw); } });
    return tw;
  }
  function scrubOnce(target, from, to, st) {
    claim(target);
    var tw = gsap.fromTo(target, from, Object.assign({ ease: 'none' }, to));
    tw.pause();
    var done = false;
    var trig = ScrollTrigger.create(Object.assign({}, st, {
      onUpdate: function (self) { if (!done) tw.progress(self.progress); },
      onLeave: finish
    }));
    function finish() {
      if (done) return; done = true;
      tw.progress(1);
      gsap.set(target, { clearProps: Object.keys(from).filter(function (k) { return k.indexOf('--') !== 0; }).join(',') || 'opacity' });
      trig.kill();
      finishers.splice(finishers.indexOf(finish), 1);
    }
    finishers.push(finish);
    if (trig.progress >= 1) finish(); else tw.progress(trig.progress);
    return tw;
  }
  // 사진 시차: CSS 변수(translate·scale 개별 속성)로 — 기존 hover transform 과 겹치지 않음
  function par(img, y0, y1, s0, s1, trigger, st) {
    if (!img) return;
    img.classList.add('mx-pimg');
    claim(img);
    gsap.fromTo(img, { '--mx-y': y0 + '%', '--mx-s': s0 }, { '--mx-y': y1 + '%', '--mx-s': s1, ease: 'none',
      scrollTrigger: Object.assign({ trigger: trigger || img, start: 'top bottom', end: 'bottom top', scrub: true }, st || {}) });
  }
  function splitWords(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      if (node.parentElement.closest('.sr-only')) return;
      var parts = node.textContent.split(/(\s+)/);
      if (parts.join('').trim() === '') return;
      var frag = document.createDocumentFragment();
      parts.forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
        var w = document.createElement('span'); w.className = 'mx-w';
        var i = document.createElement('span'); i.className = 'mx-wi'; i.textContent = p;
        w.appendChild(i); frag.appendChild(w);
      });
      var host = node.parentNode;
      host.replaceChild(frag, node);
      // 글자 그라데이션(background-clip:text)은 낱말마다 다시 입힌다
      var cs = getComputedStyle(host);
      if (cs.webkitTextFillColor === 'rgba(0, 0, 0, 0)' && cs.backgroundImage !== 'none') {
        host.querySelectorAll(':scope > .mx-w > .mx-wi').forEach(function (wi) {
          wi.style.backgroundImage = cs.backgroundImage;
          wi.style.webkitBackgroundClip = 'text'; wi.style.backgroundClip = 'text';
          wi.style.webkitTextFillColor = 'transparent';
        });
      }
    });
    return el.querySelectorAll('.mx-wi');
  }

  // ── 히어로: 가운데 줄("신뢰")은 그 자리에, 위·아래 줄은 양옆으로 벌어지며 장면이 물러남 — "변하지 않는" 축
  if (hero) {
    var rows = $$('.hero-title-row', hero);
    if (rows.length === 3) {
      [[0, -1], [2, 1]].forEach(function (p) {
        gsap.fromTo(rows[p[0]], { x: 0 }, { x: p[1] * (mobile ? 40 : 160), ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      });
    }
    var hc = $('.hero-content', hero);
    if (hc) gsap.fromTo(hc, { y: 0 }, { y: mobile ? -40 : -100, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    $$('.hero-stats .stat', hero).forEach(function (s, i) {
      gsap.fromTo(s, { y: 0 }, { y: -(20 + i * 18), ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    });
  }

  // ── 신뢰 띠·장비 띠: 스크롤 속도만큼 빨라지고, 위로 올리면 거꾸로 흐름
  $$('.marquee-track', main).forEach(function (track) {
    claim(track.parentElement);
    var anim = track.getAnimations ? track.getAnimations()[0] : null;
    if (!anim) return;
    var sec = track.closest('section');
    var rate = { v: 1 };
    var setRate = gsap.quickTo(rate, 'v', { duration: 0.6, ease: 'power3', onUpdate: function () { anim.playbackRate = rate.v; } });
    ScrollTrigger.create({ trigger: sec, start: 'top bottom', end: 'bottom top',
      onUpdate: function (self) { var v = self.getVelocity() / 260; setRate(gsap.utils.clamp(-9, 12, 1 + v)); },
      onLeave: function () { setRate(1); }, onLeaveBack: function () { setRate(1); } });
    var settle;
    window.addEventListener('scroll', function () { clearTimeout(settle); settle = setTimeout(function () { setRate(1); }, 140); }, { passive: true });
  });

  // ── 장 번호(01·02…): 숫자가 아래에서 딸깍 올라옴
  $$('.section-label', main).forEach(function (l) {
    var ch = $('.chapter', l);
    if (ch) { ch.classList.add('mx-ch'); enter(ch, { yPercent: 100, duration: 0.7, ease: CRISP }, l, 'top 90%'); }
    enter(l, { x: -16, opacity: 0, duration: 0.8, ease: CRISP }, l, 'top 90%');
  });

  // ── 철학: 네 문장이 읽는 속도대로 한 줄씩 또렷해지고, 다 읽으면 그대로
  var ph = $('.philosophy-h2', main);
  if (ph) {
    var lines = $$('.ph-line', ph);
    claim(ph);
    scrubOnce(lines, { opacity: 0.14, x: -18 }, { opacity: 1, x: 0, stagger: 0.35 }, { trigger: ph, start: 'top 78%', end: 'bottom 42%' });
    var cols = ph.nextElementSibling;
    if (cols) enter(cols.children, { x: function (i) { return (i ? 1 : -1) * (mobile ? 20 : 50); }, opacity: 0, duration: 1, ease: CRISP, stagger: 0.08 }, cols, 'top 88%');
  }

  // ── 모든 제목: 낱말이 살짝 비스듬히 마스크 아래에서 또각또각
  $$('h2', main).forEach(function (h) {
    if (isClaimed(h) || (hero && hero.contains(h))) return;
    if (h.classList.contains('cta-h2')) return;
    enter(splitWords(h), { yPercent: 110, skewY: 7, duration: 0.85, ease: CRISP, stagger: 0.035 }, h, 'top 88%');
  });

  // ── 핵심 진료 3장: 책장이 넘어가듯 왼쪽 모서리에서 펼쳐짐
  var tg = $('.treatments-grid', main);
  if (tg) {
    gsap.set(tg, { perspective: 1400 });
    enter(tg.children, { rotateY: mobile ? 0 : 70, x: mobile ? 0 : -40, y: mobile ? 40 : 0, opacity: 0, transformOrigin: '0% 50%',
      duration: 1.1, ease: 'power3.out', stagger: 0.14 }, tg, 'top 82%');
  }
  var extra = $$('.extra-treatment-link', main);
  if (extra.length) enter(extra, { x: -36, opacity: 0, duration: 0.7, ease: CRISP, stagger: 0.06 }, extra[0], 'top 92%');

  // ── 부평 진료별 사진 카드: 사진이 동그란 조리개처럼 열리고, 번호·제목이 뒤따름
  var bpc = $$('.bpc-grid > li', main);
  if (bpc.length) {
    enter(bpc, { y: mobile ? 30 : 60, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 }, bpc[0], 'top 88%');
    $$('.bpc-media', main).forEach(function (m, i) {
      enter(m, { clipPath: 'circle(8% at 50% 50%)', clipTo: 'circle(75% at 50% 50%)', duration: 1.3, ease: 'expo.out', delay: 0.15 + (i % 3) * 0.08 }, m, 'top 85%');
      par($('img', m), -4, 4, 1.12, 1.12, m);
    });
  }

  // ── 자격·인증: 공항 안내판처럼 칸이 한 장씩 뒤집혀 내려옴
  var creds = $('.creds-grid', main);
  if (creds) {
    gsap.set(creds, { perspective: 900 });
    enter(creds.children, { rotateX: -90, opacity: 0, transformOrigin: '50% 0%', duration: 0.9, ease: 'back.out(1.4)',
      stagger: { each: 0.08, grid: 'auto', from: 'start' } }, creds, 'top 84%');
  }

  // ── 의료진: 사진이 아래에서 위로 걷히고, 이름이 뒤따름
  var docs = $$('.doctors-grid > .doctor-card', main);
  if (docs.length) {
    enter(docs, { y: 50, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1 }, docs[0], 'top 88%');
    docs.forEach(function (d, i) {
      var p = $('.portrait', d);
      if (p) { enter(p, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut', delay: 0.1 + i * 0.1 }, d, 'top 88%'); par($('img', p), -5, 5, 1.1, 1.1, d); }
    });
  }

  // ── 14년 임플란트·감염관리 두 장: 의료진 카드와 같은 결로 차례로 올라오고, 사진은 살짝 시차
  var pillars = $$('.trust-pillars > .trust-pillar', main);
  if (pillars.length) {
    enter(pillars, { y: 50, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.12 }, pillars[0], 'top 88%');
    pillars.forEach(function (p) { par($('img', p), -4, 4, 1.1, 1.1, p); });
  }

  // ── 공간: 큰 사진은 액자에서 꽉 차게 펼쳐지고, 작은 사진은 엇갈려 흐름
  var space = $('.space-grid', main);
  if (space) {
    $$('.space-item', space).forEach(function (f, i) {
      if (f.classList.contains('space-item-lg')) {
        scrubOnce(f, { clipPath: mobile ? 'inset(3% 5% 3% 5% round 18px)' : 'inset(8% 10% 8% 10% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)' },
          { trigger: f, start: 'top 95%', end: 'top 30%' });
      } else {
        enter(f, { y: 70 + (i % 2) * 40, opacity: 0, duration: 1, ease: 'power3.out' }, f, 'top 92%');
      }
      par($('img', f), -(6 + (i % 3) * 3), 6 + (i % 3) * 3, 1.16, 1.16, f);
      var cap = $('figcaption', f);
      if (cap) enter(cap, { y: 24, opacity: 0, duration: 0.8, ease: CRISP }, f, 'top 70%');
    });
  }

  // ── FAQ: 질문 줄이 위에서부터 차례로
  var faqs = $$('.faq-item', main);
  if (faqs.length) enter(faqs, { y: 26, opacity: 0, duration: 0.7, ease: CRISP, stagger: 0.06 }, faqs[0], 'top 92%');

  // ── 상담 CTA: 검은 블록이 화면 쪽으로 다가오고, 세 줄이 한 줄씩
  var cta = $('.cta-block', main);
  if (cta) {
    cta.removeAttribute('data-reveal');
    scrubOnce(cta, { scale: mobile ? 0.94 : 0.86 }, { scale: 1 }, { trigger: cta, start: 'top bottom', end: 'top 30%' });
    var cl = $$('.cta-line', cta);
    if (cl.length) enter(cl, { yPercent: 60, opacity: 0, duration: 0.9, ease: CRISP, stagger: 0.12 }, cta, 'top 70%');
    var cb = $$('.btns > a', cta);
    if (cb.length) enter(cb, { y: 20, opacity: 0, duration: 0.6, ease: CRISP, stagger: 0.07 }, cta, 'top 60%');
  }

  // ── 나머지: 넘겨받은 블록 중 연출 없는 것은 짧게 올라옴
  $$('section', main).forEach(function (s) {
    if (s === hero) return;
    $$(':scope > .container > *, :scope > .container > * > *, :scope > .container > * > * > *', s).forEach(function (el) {
      if (/STYLE|SCRIPT|BR/.test(el.tagName) || isClaimed(el)) return;
      var r = el.getBoundingClientRect();
      if (r.height < 8 || r.height > innerHeight * 1.4) return;
      enter(el, { y: 32, opacity: 0, duration: 0.85, ease: CRISP }, el, 'top 90%');
    });
  });

  ScrollTrigger.refresh();
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
})();
