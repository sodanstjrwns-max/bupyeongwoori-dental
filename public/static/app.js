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
  // Admin Editor v2 (contenteditable + uploads + 강화)
  // 적용 대상: form[data-has-editor] (blog / before-after / notices 공통)
  // 강화 사항:
  // - 인라인 이미지: <figure data-align data-width data-link><img/><figcaption/></figure>
  // - 너비 4단계 (S 50% / M 75% / L 100% / Full 풀폭) + 정렬 (좌/중/우)
  // - 이미지 링크 연결 (LINK 버튼)
  // - 드래그 핸들 ⠿ 좌상단 표시
  // - 위/아래 이동 버튼 (드래그 폴백)
  // - 이미지 교체 (REPLACE) — 기존 이미지를 다른 파일로
  // - 클립보드 paste 이미지 자동 업로드
  // - 업로드 진행 토스트
  // - ESC 키로 figure 선택 해제
  // =============================================================

  // ----- 업로드 토스트 -----
  let uploadToast = null;
  function showUploadToast(msg, isError) {
    if (!uploadToast) {
      uploadToast = document.createElement('div');
      uploadToast.className = 'editor-toast';
      document.body.appendChild(uploadToast);
    }
    uploadToast.textContent = msg;
    uploadToast.classList.toggle('is-error', !!isError);
    uploadToast.classList.add('is-visible');
    clearTimeout(uploadToast._t);
    uploadToast._t = setTimeout(() => {
      uploadToast.classList.remove('is-visible');
    }, isError ? 4200 : 1800);
  }

  async function uploadFileToR2(file, onProgress) {
    const fd = new FormData();
    fd.append('file', file);
    // XHR 사용해서 진행률 추적
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/admin/upload', true);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && typeof onProgress === 'function') {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try { resolve(JSON.parse(xhr.responseText)); }
          catch { reject(new Error('invalid json')); }
        } else {
          reject(new Error('upload failed (' + xhr.status + ')'));
        }
      };
      xhr.onerror = () => reject(new Error('network error'));
      xhr.send(fd);
    });
  }

  function makeFigure(url, alt) {
    const fig = document.createElement('figure');
    fig.className = 'editor-figure';
    fig.setAttribute('data-align', 'center');
    fig.setAttribute('data-width', 'l'); // s / m / l / full
    fig.setAttribute('draggable', 'true');
    fig.setAttribute('contenteditable', 'false');

    // 드래그 핸들
    const handle = document.createElement('span');
    handle.className = 'editor-fig-handle';
    handle.setAttribute('contenteditable', 'false');
    handle.setAttribute('aria-label', '드래그하여 이동');
    handle.title = '드래그하여 위치 이동';
    handle.textContent = '⠿';
    fig.appendChild(handle);

    const img = document.createElement('img');
    img.src = url;
    img.alt = alt || '';
    img.draggable = false;
    fig.appendChild(img);

    const cap = document.createElement('figcaption');
    cap.setAttribute('contenteditable', 'true');
    cap.setAttribute('data-placeholder', '캡션을 입력하세요 (선택)');
    fig.appendChild(cap);
    return fig;
  }

  function appendFigureToEditor(editor, url, alt) {
    const fig = makeFigure(url, alt);
    editor.appendChild(fig);
    const p = document.createElement('p');
    p.innerHTML = '<br/>';
    editor.appendChild(p);
    return fig;
  }

  function insertFigureAtCursor(editor, url, alt) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !editor.contains(sel.anchorNode)) {
      return appendFigureToEditor(editor, url, alt);
    }
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const fig = makeFigure(url, alt);
    // figure는 블록이라 가까운 블록 형제 다음에 삽입
    let node = range.startContainer;
    while (node && node !== editor && node.parentNode !== editor) node = node.parentNode;
    if (node && node !== editor) {
      node.parentNode.insertBefore(fig, node.nextSibling);
      const p = document.createElement('p'); p.innerHTML = '<br/>';
      fig.parentNode.insertBefore(p, fig.nextSibling);
    } else {
      editor.appendChild(fig);
    }
    return fig;
  }

  // ----- 플로팅 툴바 (이미지 선택 시 표시) -----
  let floatingBar = null;
  let activeFigure = null;
  let activeEditor = null;
  let replaceInput = null;

  function ensureReplaceInput() {
    if (replaceInput) return replaceInput;
    replaceInput = document.createElement('input');
    replaceInput.type = 'file';
    replaceInput.accept = 'image/*';
    replaceInput.style.display = 'none';
    document.body.appendChild(replaceInput);
    replaceInput.addEventListener('change', async (e) => {
      const f = (e.target.files || [])[0];
      if (!f || !activeFigure) return;
      const img = activeFigure.querySelector('img');
      try {
        showUploadToast('이미지 교체 중...');
        const r = await uploadFileToR2(f, (p) => {
          showUploadToast('업로드 ' + p + '%');
        });
        if (r && r.ok && img) {
          img.src = r.url;
          showUploadToast('이미지 교체 완료');
        }
      } catch (err) {
        showUploadToast('교체 실패: ' + (err.message || ''), true);
      } finally {
        replaceInput.value = '';
      }
    });
    return replaceInput;
  }

  function ensureFloatingBar() {
    if (floatingBar) return floatingBar;
    floatingBar = document.createElement('div');
    floatingBar.className = 'editor-fig-bar';
    floatingBar.innerHTML = `
      <button type="button" data-fig-cmd="left"   title="좌측 정렬">⇤</button>
      <button type="button" data-fig-cmd="center" title="가운데 정렬">↔</button>
      <button type="button" data-fig-cmd="right"  title="우측 정렬">⇥</button>
      <span class="sep"></span>
      <button type="button" data-fig-cmd="w-s"    title="작게 50%">S</button>
      <button type="button" data-fig-cmd="w-m"    title="중간 75%">M</button>
      <button type="button" data-fig-cmd="w-l"    title="크게 100%">L</button>
      <button type="button" data-fig-cmd="w-full" title="풀폭" class="full-w">⤢</button>
      <span class="sep"></span>
      <button type="button" data-fig-cmd="up"      title="위로 이동">↑</button>
      <button type="button" data-fig-cmd="down"    title="아래로 이동">↓</button>
      <span class="sep"></span>
      <button type="button" data-fig-cmd="caption" title="캡션 토글">✏</button>
      <button type="button" data-fig-cmd="alt"     title="ALT 텍스트">ALT</button>
      <button type="button" data-fig-cmd="link"    title="링크 연결">🔗</button>
      <button type="button" data-fig-cmd="replace" title="이미지 교체">↻</button>
      <span class="sep"></span>
      <button type="button" data-fig-cmd="delete"  title="삭제" class="danger">🗑</button>
    `;
    document.body.appendChild(floatingBar);

    floatingBar.addEventListener('mousedown', (e) => e.preventDefault());
    floatingBar.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-fig-cmd]');
      if (!btn || !activeFigure) return;
      const cmd = btn.getAttribute('data-fig-cmd');
      const cap = activeFigure.querySelector('figcaption');
      const img = activeFigure.querySelector('img');
      switch (cmd) {
        case 'left':
        case 'center':
        case 'right':
          activeFigure.setAttribute('data-align', cmd);
          // 풀폭이면 자동으로 L로 강등
          if (activeFigure.getAttribute('data-width') === 'full') {
            activeFigure.setAttribute('data-width', 'l');
          }
          break;
        case 'w-s':   activeFigure.setAttribute('data-width', 's'); break;
        case 'w-m':   activeFigure.setAttribute('data-width', 'm'); break;
        case 'w-l':   activeFigure.setAttribute('data-width', 'l'); break;
        case 'w-full':
          activeFigure.setAttribute('data-width', 'full');
          activeFigure.setAttribute('data-align', 'center');
          break;
        case 'up': {
          const prev = activeFigure.previousElementSibling;
          if (prev) activeFigure.parentNode.insertBefore(activeFigure, prev);
          break;
        }
        case 'down': {
          const next = activeFigure.nextElementSibling;
          if (next) activeFigure.parentNode.insertBefore(next, activeFigure);
          break;
        }
        case 'caption':
          if (cap) cap.focus();
          break;
        case 'alt': {
          const v = prompt('대체 텍스트(ALT)를 입력하세요:', img?.alt || '');
          if (v !== null && img) img.alt = v;
          break;
        }
        case 'link': {
          const cur = activeFigure.getAttribute('data-link') || '';
          const v = prompt('이미지에 연결할 URL을 입력하세요. (비우면 링크 해제)', cur || 'https://');
          if (v === null) break;
          const trimmed = v.trim();
          if (!trimmed || trimmed === 'https://') {
            activeFigure.removeAttribute('data-link');
          } else {
            activeFigure.setAttribute('data-link', trimmed);
          }
          break;
        }
        case 'replace':
          ensureReplaceInput().click();
          break;
        case 'delete':
          if (!confirm('이 이미지를 삭제하시겠습니까?')) break;
          activeFigure.remove();
          activeFigure = null;
          hideFloatingBar();
          return;
      }
      updateBarState();
      positionFloatingBar();
    });

    return floatingBar;
  }

  function updateBarState() {
    if (!floatingBar || !activeFigure) return;
    const align = activeFigure.getAttribute('data-align') || 'center';
    const width = activeFigure.getAttribute('data-width') || 'l';
    floatingBar.querySelectorAll('[data-fig-cmd]').forEach((b) => {
      const cmd = b.getAttribute('data-fig-cmd');
      b.classList.remove('is-active');
      if (cmd === align) b.classList.add('is-active');
      if (cmd === 'w-' + width) b.classList.add('is-active');
    });
    // 링크 표시
    const linkBtn = floatingBar.querySelector('[data-fig-cmd="link"]');
    if (linkBtn) linkBtn.classList.toggle('is-active', !!activeFigure.getAttribute('data-link'));
  }

  function positionFloatingBar() {
    if (!activeFigure || !floatingBar) return;
    const r = activeFigure.getBoundingClientRect();
    floatingBar.style.display = 'flex';
    const barH = floatingBar.offsetHeight || 40;
    const barW = floatingBar.offsetWidth || 0;
    let top = r.top + window.scrollY - barH - 10;
    if (top < window.scrollY + 8) top = r.bottom + window.scrollY + 10;
    let left = r.left + window.scrollX + r.width / 2 - barW / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - barW - 8));
    floatingBar.style.top = top + 'px';
    floatingBar.style.left = left + 'px';
  }

  function showFloatingBar(fig) {
    ensureFloatingBar();
    if (activeFigure && activeFigure !== fig) activeFigure.classList.remove('is-selected');
    activeFigure = fig;
    fig.classList.add('is-selected');
    updateBarState();
    requestAnimationFrame(positionFloatingBar);
  }

  function hideFloatingBar() {
    if (!floatingBar) return;
    if (activeFigure) activeFigure.classList.remove('is-selected');
    activeFigure = null;
    floatingBar.style.display = 'none';
  }

  document.addEventListener('click', (e) => {
    const fig = e.target.closest && e.target.closest('.editor-figure');
    const onBar = e.target.closest && e.target.closest('.editor-fig-bar');
    if (fig) {
      if (e.target.tagName === 'FIGCAPTION') return;
      e.preventDefault();
      showFloatingBar(fig);
    } else if (!onBar) {
      hideFloatingBar();
    }
  });

  // ESC 로 선택 해제
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeFigure) {
      hideFloatingBar();
    }
    // Delete / Backspace 로 선택된 figure 삭제 (캡션 편집 중이 아닐 때)
    if ((e.key === 'Delete' || e.key === 'Backspace') && activeFigure) {
      const ae = document.activeElement;
      if (ae && ae.tagName === 'FIGCAPTION') return;
      e.preventDefault();
      activeFigure.remove();
      activeFigure = null;
      hideFloatingBar();
    }
  });

  window.addEventListener('scroll', () => positionFloatingBar(), true);
  window.addEventListener('resize', () => positionFloatingBar());

  // ----- figure 드래그 순서 변경 -----
  function setupFigureDragSort(editor) {
    let dragging = null;
    let guide = null;

    function ensureGuide() {
      if (guide) return guide;
      guide = document.createElement('div');
      guide.className = 'editor-drop-guide';
      return guide;
    }

    editor.addEventListener('dragstart', (e) => {
      const fig = e.target.closest && e.target.closest('.editor-figure');
      if (!fig || !editor.contains(fig)) return;
      dragging = fig;
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', 'figure-move'); } catch (_) {}
      fig.classList.add('is-dragging');
      hideFloatingBar();
    });

    editor.addEventListener('dragend', () => {
      if (dragging) dragging.classList.remove('is-dragging');
      dragging = null;
      if (guide && guide.parentNode) guide.parentNode.removeChild(guide);
    });

    editor.addEventListener('dragover', (e) => {
      if (!dragging) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const target = e.target.closest && e.target.closest('p, h2, h3, ul, ol, blockquote, .editor-figure');
      ensureGuide();
      if (!target || target === dragging) {
        if (guide.parentNode) guide.parentNode.removeChild(guide);
        return;
      }
      const r = target.getBoundingClientRect();
      const before = (e.clientY - r.top) < r.height / 2;
      if (before) target.parentNode.insertBefore(guide, target);
      else target.parentNode.insertBefore(guide, target.nextSibling);
    });

    editor.addEventListener('drop', (e) => {
      if (!dragging) return;
      e.preventDefault();
      if (guide && guide.parentNode) {
        guide.parentNode.insertBefore(dragging, guide);
        guide.parentNode.removeChild(guide);
      }
      dragging.classList.remove('is-dragging');
      dragging = null;
    });
  }

  function initAdminEditor(form) {
    const editor = form.querySelector('[data-editor]');
    const output = form.querySelector('[data-editor-output]');
    const editorDrop = form.querySelector('[data-editor-drop]');
    const inlineUpload = form.querySelector('[data-editor-inline]');
    if (!editor || !output) return;

    // 기존 콘텐츠 안의 단순 <img>를 figure로 마이그레이션 (일회성)
    editor.querySelectorAll('img').forEach((img) => {
      if (img.closest('figure')) return;
      const fig = makeFigure(img.src, img.alt || '');
      img.parentNode.replaceChild(fig, img);
    });
    // 모든 figure에 드래그 속성 + 핸들 보장
    editor.querySelectorAll('figure').forEach((f) => {
      f.classList.add('editor-figure');
      f.setAttribute('draggable', 'true');
      f.setAttribute('contenteditable', 'false');
      const cap = f.querySelector('figcaption');
      if (cap) cap.setAttribute('contenteditable', 'true');
      if (!f.getAttribute('data-align')) f.setAttribute('data-align', 'center');
      if (!f.getAttribute('data-width')) f.setAttribute('data-width', 'l');
      // 핸들 없으면 추가
      if (!f.querySelector('.editor-fig-handle')) {
        const handle = document.createElement('span');
        handle.className = 'editor-fig-handle';
        handle.setAttribute('contenteditable', 'false');
        handle.title = '드래그하여 위치 이동';
        handle.textContent = '⠿';
        f.insertBefore(handle, f.firstChild);
      }
      const img = f.querySelector('img');
      if (img) img.draggable = false;
    });

    setupFigureDragSort(editor);

    // 에디터 포커스 시 활성 에디터 추적 (클립보드 paste 용)
    editor.addEventListener('focus', () => { activeEditor = editor; });
    editor.addEventListener('click', () => { activeEditor = editor; });

    // 툴바 버튼 (해당 폼 내부 한정)
    form.querySelectorAll('.editor-btn').forEach((btn) => {
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
          case 'undo': document.execCommand('undo'); break;
          case 'redo': document.execCommand('redo'); break;
          case 'quote': document.execCommand('formatBlock', false, 'BLOCKQUOTE'); break;
          case 'hr': document.execCommand('insertHorizontalRule'); break;
          case 'clear': document.execCommand('removeFormat'); break;
          case 'link': {
            const url = prompt('링크 URL을 입력하세요:', 'https://');
            if (url && url !== 'https://') document.execCommand('createLink', false, url);
            break;
          }
          case 'img':
            if (inlineUpload) inlineUpload.click();
            break;
        }
      });
    });

    // 인라인 이미지 업로드 (툴바 버튼 → 파일 선택)
    if (inlineUpload) {
      inlineUpload.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files || []);
        await uploadAndInsert(files, editor);
        inlineUpload.value = '';
      });
    }

    // 외부 파일 드래그&드롭 (편집창에 파일 끌어다 놓기)
    if (editorDrop) {
      ['dragenter', 'dragover'].forEach((ev) => {
        editorDrop.addEventListener(ev, (e) => {
          if (e.dataTransfer && Array.from(e.dataTransfer.types || []).indexOf('Files') === -1) return;
          e.preventDefault(); e.stopPropagation();
          editorDrop.classList.add('drop-active');
        });
      });
      ['dragleave', 'drop'].forEach((ev) => {
        editorDrop.addEventListener(ev, (e) => {
          if (e.dataTransfer && Array.from(e.dataTransfer.types || []).indexOf('Files') === -1) return;
          e.preventDefault(); e.stopPropagation();
          editorDrop.classList.remove('drop-active');
        });
      });
      editorDrop.addEventListener('drop', async (e) => {
        const dt = e.dataTransfer;
        if (!dt || !dt.files || !dt.files.length) return;
        const files = Array.from(dt.files).filter((f) => f.type.startsWith('image/'));
        if (!files.length) return;
        await uploadAndInsert(files, editor);
      });
    }

    // 클립보드 paste 이미지
    editor.addEventListener('paste', async (e) => {
      const items = e.clipboardData && e.clipboardData.items;
      if (!items) return;
      const files = [];
      for (const it of items) {
        if (it.kind === 'file' && it.type.startsWith('image/')) {
          const f = it.getAsFile();
          if (f) files.push(f);
        }
      }
      if (files.length === 0) return;
      e.preventDefault();
      await uploadAndInsert(files, editor);
    });

    // 폼 제출 시 contenteditable → hidden textarea 동기화
    form.addEventListener('submit', () => {
      const clone = editor.cloneNode(true);
      // 핸들 제거, 편집 속성 제거, data-link 있으면 <a>로 감싸기
      clone.querySelectorAll('.editor-figure').forEach((f) => {
        f.classList.remove('is-selected', 'is-dragging');
        f.removeAttribute('draggable');
        f.removeAttribute('contenteditable');
        const handle = f.querySelector('.editor-fig-handle');
        if (handle) handle.remove();
        const cap = f.querySelector('figcaption');
        if (cap) {
          cap.removeAttribute('contenteditable');
          cap.removeAttribute('data-placeholder');
          if (!cap.textContent.trim()) cap.remove();
        }
        const img = f.querySelector('img');
        if (img) img.removeAttribute('draggable');
        // data-link → 실제 <a> 래퍼
        const linkUrl = f.getAttribute('data-link');
        if (linkUrl && img && !img.closest('a')) {
          const a = document.createElement('a');
          a.href = linkUrl;
          a.target = '_blank';
          a.rel = 'noopener';
          img.parentNode.insertBefore(a, img);
          a.appendChild(img);
        }
      });
      output.value = clone.innerHTML;
    });
  }

  // 공통: 파일 배열 업로드 후 figure 삽입 + 진행 토스트
  async function uploadAndInsert(files, editor) {
    let ok = 0, fail = 0;
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      try {
        showUploadToast(`업로드 ${i + 1}/${files.length} 시작...`);
        const r = await uploadFileToR2(f, (p) => {
          showUploadToast(`업로드 ${i + 1}/${files.length} ${p}%`);
        });
        if (r && r.ok) {
          insertFigureAtCursor(editor, r.url, f.name);
          ok++;
        } else {
          fail++;
        }
      } catch (err) {
        console.error('upload failed:', err);
        fail++;
      }
    }
    if (fail > 0) showUploadToast(`업로드 완료 (성공 ${ok} / 실패 ${fail})`, true);
    else if (ok > 0) showUploadToast(`✓ 이미지 ${ok}장 추가됨`);
  }

  document.querySelectorAll('form[data-has-editor]').forEach(initAdminEditor);
})();

// ============================================================
// Floating CTA — 우하단 상담/예약 토글
// ============================================================
(function () {
  const root = document.getElementById('floating-cta');
  const toggle = document.getElementById('floating-cta-toggle');
  if (!root || !toggle) return;

  // 토글 클릭으로 메뉴 열고 닫기
  function setOpen(open) {
    root.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!root.classList.contains('is-open'));
  });

  // 외부 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) setOpen(false);
  });

  // ESC로 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  // 메뉴 항목 클릭 시 닫기
  root.querySelectorAll('.floating-cta-item').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });

  // 스크롤 다운 시 살짝 숨김, 업 시 다시 표시
  let lastY = window.scrollY;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const delta = y - lastY;
      // 메뉴 열려있을 땐 숨기지 않음
      if (!root.classList.contains('is-open')) {
        if (delta > 8 && y > 240) {
          root.classList.add('is-hidden');
        } else if (delta < -8) {
          root.classList.remove('is-hidden');
        }
      }
      lastY = y;
      ticking = false;
    });
  }, { passive: true });
})();

// ============================================================
// Nav 회원 영역 동적 치환 (서버 SSR 없이 cookie 기반 fetch)
// ============================================================
(function () {
  const ctaGroup = document.querySelector('.nav-cta-group');
  if (!ctaGroup) return;

  fetch('/api/auth/me', { credentials: 'same-origin' })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!data || !data.logged || !data.user) return;
      const u = data.user;
      const loginBtn = ctaGroup.querySelector('.nav-cta-login');
      if (loginBtn) loginBtn.remove();

      // 이미 SSR로 렌더된 .nav-item-account가 있으면 스킵
      if (ctaGroup.querySelector('.nav-item-account')) return;

      const wrap = document.createElement('div');
      wrap.className = 'nav-item nav-item-account';
      wrap.innerHTML = `
        <a href="/mypage" class="nav-cta nav-cta-account" title="${u.name}님 마이페이지">
          <i class="fas fa-user-circle"></i>
          <span>${u.name}</span>
        </a>
        <div class="nav-dropdown nav-dropdown-account">
          <a href="/mypage"><i class="fas fa-id-card-clip"></i> 마이페이지</a>
          ${u.role === 'admin' ? '<a href="/admin"><i class="fas fa-gauge"></i> 관리자</a>' : ''}
          <a href="/api/auth/logout"><i class="fas fa-right-from-bracket"></i> 로그아웃</a>
        </div>
      `;
      ctaGroup.appendChild(wrap);

      // 모바일 메뉴 하단도 치환
      const mobile = document.getElementById('mobile-menu');
      if (mobile) {
        const loginRow = mobile.querySelector('a[href="/login"]');
        if (loginRow && loginRow.parentElement) {
          const row = loginRow.parentElement;
          row.outerHTML = `
            <div style="margin-top:32px; display:flex; flex-direction:column; gap:10px; padding:16px 18px; background:#F4FBFA; border:1px solid #C9EAE7; border-radius:14px;">
              <div style="display:flex; align-items:center; gap:10px;">
                <i class="fas fa-user-circle" style="font-size:1.4rem; color:var(--brand-600);"></i>
                <div>
                  <div style="font-weight:700; color:var(--ink-900);">${u.name}님</div>
                  <div style="font-size:0.78rem; color:var(--ink-500);">${u.email}</div>
                </div>
              </div>
              <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <a href="/mypage" class="btn btn-primary" style="flex:1; justify-content:center;">마이페이지</a>
                ${u.role === 'admin' ? '<a href="/admin" class="btn btn-dark" style="flex:1; justify-content:center;">관리자</a>' : ''}
                <a href="/api/auth/logout" class="btn btn-ghost" style="flex:1; justify-content:center; border:1px solid var(--ink-200); color:var(--ink-900);">로그아웃</a>
              </div>
            </div>
          `;
        }
      }
    })
    .catch(() => {});
})();

/* ============================================================
   Cinematic Video Player (Mission page)
   ============================================================ */
;(function initCinema() {
  const frames = document.querySelectorAll('[data-cinema]');
  if (!frames.length) return;

  frames.forEach((frame) => {
    const video = frame.querySelector('[data-cinema-video]');
    if (!video) return;
    const playBtn = frame.querySelector('[data-cinema-play]');
    const muteBtn = frame.querySelector('[data-cinema-mute]');
    const fsBtn = frame.querySelector('[data-cinema-fullscreen]');

    // 초기 상태: 음소거 + 자동재생 시도
    video.muted = true;
    frame.classList.add('is-needs-sound');

    const tryPlay = () => {
      const p = video.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          frame.classList.add('is-paused');
        });
      }
    };

    // Intersection Observer — 뷰포트 들어오면 재생, 나가면 일시정지
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
            tryPlay();
          } else {
            video.pause();
          }
        });
      }, { threshold: [0, 0.35, 0.6] });
      io.observe(frame);
    } else {
      tryPlay();
    }

    // 영상 상태 → 클래스 동기화
    video.addEventListener('play', () => {
      frame.classList.remove('is-paused');
      const i = playBtn && playBtn.querySelector('i');
      if (i) i.className = 'fas fa-pause';
    });
    video.addEventListener('pause', () => {
      frame.classList.add('is-paused');
      const i = playBtn && playBtn.querySelector('i');
      if (i) i.className = 'fas fa-play';
    });
    video.addEventListener('volumechange', () => {
      if (video.muted) {
        frame.classList.remove('is-unmuted');
        frame.classList.add('is-needs-sound');
      } else {
        frame.classList.add('is-unmuted');
        frame.classList.remove('is-needs-sound');
      }
    });

    // 재생/일시정지 토글
    const togglePlay = (e) => {
      if (e) e.stopPropagation();
      if (video.paused) {
        tryPlay();
      } else {
        video.pause();
      }
    };

    // 음소거 토글
    const toggleMute = (e) => {
      if (e) e.stopPropagation();
      video.muted = !video.muted;
      if (!video.muted) {
        // 사용자가 음소거 해제 = 사운드 ON 액션, 재생도 같이 보장
        tryPlay();
      }
    };

    // 풀스크린 토글
    const toggleFs = (e) => {
      if (e) e.stopPropagation();
      const doc = document;
      const isFs = doc.fullscreenElement || doc.webkitFullscreenElement;
      if (isFs) {
        if (doc.exitFullscreen) doc.exitFullscreen();
        else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
      } else {
        const target = frame;
        if (target.requestFullscreen) target.requestFullscreen();
        else if (target.webkitRequestFullscreen) target.webkitRequestFullscreen();
        else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen(); // iOS
      }
    };

    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (muteBtn) muteBtn.addEventListener('click', toggleMute);
    if (fsBtn) fsBtn.addEventListener('click', toggleFs);

    // 프레임 클릭 시 음소거 해제 (첫 클릭) / 그 다음부턴 재생/일시정지
    let firstClickConsumed = false;
    frame.addEventListener('click', (e) => {
      // 컨트롤 버튼 클릭은 위에서 처리됐으니 제외
      if (e.target.closest('.cinema-btn')) return;
      if (!firstClickConsumed && video.muted) {
        firstClickConsumed = true;
        video.muted = false;
        tryPlay();
        return;
      }
      togglePlay();
    });

    // 호버 시 컨트롤 보이기 활성 클래스
    frame.addEventListener('mouseenter', () => frame.classList.add('is-active'));
    frame.addEventListener('mouseleave', () => frame.classList.remove('is-active'));
  });
})();

/* ============================================================
   Cinema YouTube — click-to-load iframe (대표원장 인터뷰 영상)
   - 첫 LCP 가볍게: 처음엔 maxres 썸네일만 노출
   - Play 버튼/포스터 클릭 시 iframe 마운트 + autoplay
   - 한 페이지 여러 개 지원
   ============================================================ */
(function () {
  const frames = document.querySelectorAll('[data-cinema-yt]');
  if (!frames.length) return;

  frames.forEach((frame) => {
    const ytId = frame.getAttribute('data-yt-id');
    if (!ytId) return;

    const playBtn = frame.querySelector('[data-cinema-yt-play]');
    const poster = frame.querySelector('.cinema-yt-poster');

    const mount = () => {
      if (frame.classList.contains('is-playing')) return;

      const iframe = document.createElement('iframe');
      iframe.setAttribute(
        'src',
        `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&color=white&iv_load_policy=3`
      );
      iframe.setAttribute('title', '대표원장 인터뷰 영상');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute(
        'allow',
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen'
      );
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('loading', 'lazy');

      frame.appendChild(iframe);
      frame.classList.add('is-playing');
    };

    // Play 버튼 / 포스터 / 프레임 클릭 (외부 링크는 stopPropagation으로 제외)
    if (playBtn) playBtn.addEventListener('click', mount);
    if (poster) poster.addEventListener('click', mount);
    frame.addEventListener('click', (e) => {
      if (e.target.closest('.cinema-yt-external')) return;
      if (e.target.closest('iframe')) return;
      mount();
    });

    // 키보드 접근성 (Enter/Space)
    frame.setAttribute('tabindex', '0');
    frame.setAttribute('role', 'button');
    frame.setAttribute('aria-label', '대표원장 인터뷰 영상 재생');
    frame.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        mount();
      }
    });
  });
})();
