// ============================================================
// 부평우리치과 - Client interactions
// ============================================================
(function () {
  'use strict'

  // 1) Sticky nav scroll state
  const nav = document.getElementById('site-nav')
  const updateNav = () => {
    if (!nav) return
    if (window.scrollY > 20) nav.classList.add('is-scrolled')
    else nav.classList.remove('is-scrolled')
  }
  updateNav()
  window.addEventListener('scroll', updateNav, { passive: true })

  // 2) Mobile menu
  const burger = document.getElementById('nav-burger')
  const mobile = document.getElementById('mobile-menu')
  if (burger && mobile) {
    burger.addEventListener('click', () => {
      const open = mobile.classList.toggle('is-open')
      burger.setAttribute('aria-expanded', String(open))
      document.body.style.overflow = open ? 'hidden' : ''
    })
    // close on link click
    mobile.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        mobile.classList.remove('is-open')
        document.body.style.overflow = ''
        burger.setAttribute('aria-expanded', 'false')
      })
    })
  }

  // 3) Reveal on scroll
  const reveal = document.querySelectorAll('[data-reveal]')
  if ('IntersectionObserver' in window && reveal.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    reveal.forEach((el) => io.observe(el))
  } else {
    reveal.forEach((el) => el.classList.add('is-visible'))
  }

  // 4) Counter animation for stats
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseFloat(el.getAttribute('data-count') || '0')
    const suffix = el.getAttribute('data-suffix') || ''
    const dur = 1800
    const start = performance.now()
    const easeOut = (t) => 1 - Math.pow(1 - t, 3)
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1)
      const v = target * easeOut(p)
      el.textContent = (target % 1 === 0 ? Math.round(v) : v.toFixed(1)) + suffix
      if (p < 1) requestAnimationFrame(step)
    }
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          requestAnimationFrame(step)
          io2.unobserve(el)
        }
      })
    })
    io2.observe(el)
  })

  // 5) Before/After slider
  document.querySelectorAll('[data-ba-slider]').forEach((slider) => {
    const before = slider.querySelector('.ba-before')
    const after = slider.querySelector('.ba-after')
    const handle = slider.querySelector('.ba-handle')
    if (!before || !after || !handle) return

    let dragging = false
    const setPos = (pct) => {
      pct = Math.max(0, Math.min(100, pct))
      after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`
      handle.style.left = pct + '%'
    }
    setPos(50)

    const onMove = (clientX) => {
      const rect = slider.getBoundingClientRect()
      const pct = ((clientX - rect.left) / rect.width) * 100
      setPos(pct)
    }
    slider.addEventListener('mousedown', (e) => { dragging = true; onMove(e.clientX) })
    window.addEventListener('mouseup', () => { dragging = false })
    window.addEventListener('mousemove', (e) => { if (dragging) onMove(e.clientX) })
    slider.addEventListener('touchstart', (e) => { dragging = true; onMove(e.touches[0].clientX) }, { passive: true })
    window.addEventListener('touchend', () => { dragging = false })
    window.addEventListener('touchmove', (e) => { if (dragging) onMove(e.touches[0].clientX) }, { passive: true })
  })
})()
