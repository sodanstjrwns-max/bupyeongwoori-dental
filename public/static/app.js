// =============================================================
// 부평우리치과 - Frontend scripts
// =============================================================
(function () {
  'use strict';

  // --------- Nav scroll state ---------
  const nav = document.getElementById('site-nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --------- Mobile menu ---------
  const burger = document.getElementById('nav-burger');
  const mobile = document.getElementById('mobile-menu');
  if (burger && mobile) {
    burger.addEventListener('click', () => {
      const open = mobile.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  // --------- Reveal animations ---------
  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealItems.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.05 });
    revealItems.forEach((el) => io.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add('is-visible'));
  }

  // --------- Number counters ---------
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.getAttribute('data-count') || '0');
        const duration = 1600;
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

  // =============================================================
  // Blog Editor (contenteditable + uploads)
  // =============================================================
  const editor = document.getElementById('editor');
  const contentOutput = document.getElementById('content-output');
  const form = document.getElementById('blog-form');
  const editorDrop = document.getElementById('editor-drop');
  const inlineUpload = document.getElementById('editor-upload-inline');

  if (editor && form) {
    // Toolbar buttons
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

    // Upload helper
    async function uploadFile(file) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/admin/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('upload failed');
      return await res.json();
    }

    // Insert images on file selection
    if (inlineUpload) {
      inlineUpload.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files || []);
        for (const f of files) {
          try {
            const r = await uploadFile(f);
            if (r.ok) {
              const img = document.createElement('img');
              img.src = r.url;
              img.alt = f.name;
              editor.appendChild(img);
              editor.appendChild(document.createElement('p'));
            }
          } catch (err) { console.error(err); }
        }
        inlineUpload.value = '';
      });
    }

    // Drag & drop images
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
              img.src = r.url;
              img.alt = f.name;
              editor.appendChild(img);
              editor.appendChild(document.createElement('p'));
            }
          } catch (err) { console.error(err); }
        }
      });
    }

    // Before submit, copy HTML into hidden textarea
    form.addEventListener('submit', () => {
      if (contentOutput) contentOutput.value = editor.innerHTML;
    });
  }
})();
