// =============================================================
// 부평우리치과 — Frontend scripts v3 "Editorial Motion"
// =============================================================
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(pointer:coarse)').matches;

  // --------- Nav scroll state ---------
  const nav = document.getElementById('site-nav');
  let lastY = -1;
  const onScroll = () => {
    const y = window.scrollY;
    if (!nav) return;
    if (y > 40) nav.classList.add('scrolled', 'is-scrolled');
    else nav.classList.remove('scrolled', 'is-scrolled');
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --------- Scroll progress bar ---------
  let progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
  }
  const updateProgress = () => {
    const h = document.documentElement;
    const scrollTop = h.scrollTop || document.body.scrollTop;
    const scrollHeight = h.scrollHeight - h.clientHeight;
    const ratio = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = ratio + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // --------- Mobile menu ---------
  const burger = document.getElementById('nav-burger');
  const mobile = document.getElementById('mobile-menu');
  if (burger && mobile) {
    const toggleMenu = (force) => {
      const willOpen = typeof force === 'boolean'
        ? force
        : !mobile.classList.contains('open');
      mobile.classList.toggle('open', willOpen);
      mobile.classList.toggle('is-open', willOpen);
      burger.setAttribute('aria-expanded', String(willOpen));
      document.body.style.overflow = willOpen ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggleMenu());
    // Close on link click
    mobile.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => toggleMenu(false));
    });
    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobile.classList.contains('open')) toggleMenu(false);
    });
  }

  // --------- Reveal animations (IntersectionObserver) ---------
  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealItems.length) {
    // Auto-assign --reveal-delay from data-reveal-delay attr
    revealItems.forEach((el) => {
      const d = el.getAttribute('data-reveal-delay');
      if (d) el.style.setProperty('--reveal-delay', d);
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed', 'is-visible');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

    revealItems.forEach((el) => io.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add('revealed', 'is-visible'));
  }

  // --------- Text reveal (lines) ---------
  document.querySelectorAll('.text-reveal').forEach((el) => {
    // already wrapped by server? assume yes
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.2 });
      io.observe(el);
    } else {
      el.classList.add('revealed');
    }
  });

  // --------- Number counters ---------
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.getAttribute('data-count') || '0');
        const duration = reduceMotion ? 0 : 1600;
        if (duration === 0) { el.textContent = target.toLocaleString(); io.unobserve(el); return; }
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.floor(target * eased).toLocaleString();
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = target.toLocaleString();
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach((el) => io.observe(el));
  }

  // --------- Cursor follower ---------
  if (!isTouch && !reduceMotion) {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);
    let tx = 0, ty = 0, x = 0, y = 0;
    document.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      dot.classList.add('active');
    });
    document.addEventListener('mouseleave', () => dot.classList.remove('active'));
    const animate = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    };
    animate();
    // Hover state on interactive elements
    document.addEventListener('mouseover', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest('a, button, [data-cursor="hover"]')) {
        dot.classList.add('hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest('a, button, [data-cursor="hover"]')) {
        dot.classList.remove('hover');
      }
    });
  }

  // --------- Magnetic buttons (subtle pull toward cursor) ---------
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll('[data-magnetic], .btn-primary, .btn-dark').forEach((btn) => {
      const strength = 0.25;
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const mx = e.clientX - rect.left - rect.width / 2;
        const my = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // --------- Smooth internal anchor scroll (offset by nav height) ---------
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const a = t.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;
    const el = document.querySelector(href);
    if (!el) return;
    e.preventDefault();
    const navH = (nav ? nav.offsetHeight : 72) + 10;
    const top = el.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  // =============================================================
  // Blog/Admin Editor (contenteditable + uploads)
  // =============================================================
  const editor = document.getElementById('editor');
  const contentOutput = document.getElementById('content-output');
  const form = document.getElementById('blog-form');
  const editorDrop = document.getElementById('editor-drop');
  const inlineUpload = document.getElementById('editor-upload-inline');

  if (editor && form) {
    document.querySelectorAll('.editor-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        editor.focus();
        switch (cmd) {
          case 'h2': document.execCommand('formatBlock', false, 'H2'); break;
          case 'h3': document.execCommand('formatBlock', false, 'H3'); break;
          case 'p':  document.execCommand('formatBlock', false, 'P'); break;
          case 'bold': document.execCommand('bold'); break;
          case 'italic': document.execCommand('italic'); break;
          case 'ul': document.execCommand('insertUnorderedList'); break;
          case 'ol': document.execCommand('insertOrderedList'); break;
          case 'link': {
            const url = prompt('링크 URL을 입력하세요:', 'https://');
            if (url) document.execCommand('createLink', false, url);
            break;
          }
          case 'img':
            if (inlineUpload) inlineUpload.click();
            break;
        }
      });
    });

    async function uploadFile(file) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/admin/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('upload failed');
      return await res.json();
    }

    if (inlineUpload) {
      inlineUpload.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files || []);
        for (const f of files) {
          try {
            const r = await uploadFile(f);
            if (r.ok) {
              const img = document.createElement('img');
              img.src = r.url; img.alt = f.name;
              editor.appendChild(img);
              editor.appendChild(document.createElement('p'));
            }
          } catch (err) { console.error(err); }
        }
        inlineUpload.value = '';
      });
    }

    if (editorDrop) {
      ['dragenter', 'dragover'].forEach((ev) => {
        editorDrop.addEventListener(ev, (e) => {
          e.preventDefault(); e.stopPropagation();
          editorDrop.classList.add('drop-active');
        });
      });
      ['dragleave', 'drop'].forEach((ev) => {
        editorDrop.addEventListener(ev, (e) => {
          e.preventDefault(); e.stopPropagation();
          editorDrop.classList.remove('drop-active');
        });
      });
      editorDrop.addEventListener('drop', async (e) => {
        const dt = e.dataTransfer;
        if (!dt || !dt.files || !dt.files.length) return;
        const files = Array.from(dt.files).filter((f) => f.type.startsWith('image/'));
        for (const f of files) {
          try {
            const r = await uploadFile(f);
            if (r.ok) {
              const img = document.createElement('img');
              img.src = r.url; img.alt = f.name;
              editor.appendChild(img);
              editor.appendChild(document.createElement('p'));
            }
          } catch (err) { console.error(err); }
        }
      });
    }

    form.addEventListener('submit', () => {
      if (contentOutput) contentOutput.value = editor.innerHTML;
    });
  }
})();
