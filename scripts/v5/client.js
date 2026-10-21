// The Donald Files v5 client script (inlined on every page; content renders without it).
(function () {
  var now = Date.now()
  // Relative times for posts with a real publish time ("38m ago", "5h ago"); older stay as dates.
  document.querySelectorAll('time[data-rel]').forEach(function (t) {
    var d = (now - Date.parse(t.getAttribute('datetime'))) / 60000
    if (d < 0 || d >= 1440) return
    t.textContent = d < 60 ? Math.max(1, Math.round(d)) + 'm ago' : Math.floor(d / 60) + 'h ago'
    if (d < 120) {
      var box = t.closest('.feat,.tile')
      var n = box && box.querySelector('[data-new]')
      if (n) n.hidden = false
    }
  })
  // YouTube: click-to-load (nothing from YouTube loads until the click), inline, one at a time.
  var cur = null
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a.facade')
    if (a) {
      ev.preventDefault()
      var t = a.dataset.type, id = a.dataset.id, u = a.dataset.url
      if (t === 'youtube') {
        // One player at a time: put the previous one back to its poster.
        if (cur) { cur.wrap.replaceWith(cur.facade); cur = null }
        var f = document.createElement('iframe')
        var st = Number(a.dataset.start) || 0
        f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1&modestbranding=1' + (st ? '&start=' + st : '')
        f.title = a.getAttribute('aria-label') || 'Video'
        f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        f.allowFullscreen = true
        f.referrerPolicy = 'strict-origin-when-cross-origin'
        var wrap = document.createElement('div')
        wrap.className = a.className.replace(/\bfacade\b/, '').replace(/\bfb\b/, '') + ' playing'
        wrap.appendChild(f)
        a.replaceWith(wrap)
        cur = { wrap: wrap, facade: a }
      }
      return
    }
    var c = ev.target.closest && ev.target.closest('[data-copy]')
    if (c && navigator.clipboard) {
      navigator.clipboard.writeText(c.dataset.copy).then(function () { c.textContent = 'Copied' })
    }
  })
  // X embeds render on load (widgets.js is in <head>). Poster on top until X's iframe is really there;
  // after 4s without it, or if widgets.js is blocked, the poster turns into a "Watch on X" button.
  var xs = [].slice.call(document.querySelectorAll('[data-x]'))
  if (xs.length) {
    var ready = function (box) {
      var f = box.querySelector('iframe')
      if (f && f.offsetHeight > 80) { box.classList.remove('fail'); box.classList.add('ready'); return true }
      return false
    }
    var fail = function () { xs.forEach(function (b) { if (!b.classList.contains('ready')) b.classList.add('fail') }) }
    var check = function () { xs.forEach(ready); if (xs.every(function (b) { return b.classList.contains('ready') })) { clearInterval(poll); jump() } }
    var poll = setInterval(check, 200)
    setTimeout(function () { check(); fail(); setTimeout(function () { clearInterval(poll) }, 26000) }, 4000)
    var hook = function () {
      if (!window.twttr || !window.twttr.ready) return fail()
      window.twttr.ready(function (tw) { if (tw.events) tw.events.bind('rendered', check) })
    }
    var js = document.getElementById('twjs')
    if (window.__twFail) fail()
    else if (window.twttr && window.twttr.ready) hook()
    else if (js) { js.addEventListener('error', fail); js.addEventListener('load', hook) }
    else fail()
  }
  // Tiles link to clip#play: bring the player into view on arrival (and again once the embed has grown).
  var jumped = 0
  function jump() {
    if (location.hash !== '#play' || jumped > 1) return
    var p = document.getElementById('play')
    if (p) { jumped++; p.scrollIntoView({ block: 'start', behavior: jumped > 1 ? 'smooth' : 'auto' }) }
  }
  jump()
  // Subscribe forms (double opt-in via /api/subscribe; honeypot + fill time).
  document.querySelectorAll('form[data-sub]').forEach(function (f) {
    f.elements.t.value = String(now)
    f.addEventListener('submit', function (ev) {
      ev.preventDefault()
      var msg = f.querySelector('[data-msg]'), b = f.querySelector('button')
      b.disabled = true
      fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: f.elements.email.value, website: f.elements.website.value, t: Number(f.elements.t.value), source: f.dataset.sub }),
      })
        .then(function (r) { return r.json() })
        .then(function (j) { msg.textContent = j.message || 'Done.'; if (j.ok) f.elements.email.value = '' })
        .catch(function () { msg.textContent = 'Something broke on our end. Try again in a minute.' })
        .then(function () { b.disabled = false })
    })
  })
  var st = document.querySelector('[data-status]')
  if (st) {
    var copy = {
      confirmed: 'You’re in. New files land in your inbox when they drop.',
      already: 'You’re already confirmed. Nothing else to do.',
      expired: 'That link expired. Sign up again below and we’ll send a fresh one.',
      invalid: 'That link didn’t work. Sign up again below and we’ll send a fresh one.',
      unsubscribed: 'You’re unsubscribed. No more emails from us.',
      error: 'Something broke on our end. Try the link again in a minute.',
    }[new URLSearchParams(location.search).get('status')]
    if (copy) { st.textContent = copy; st.hidden = false }
  }
  // Infinite scroll on hubs; the real ?page=N links stay for crawlers and no-JS.
  var grid = document.querySelector('[data-grid]'), next = document.querySelector('.pager .pnext')
  if (grid && next && 'IntersectionObserver' in window) {
    var busy = false
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting || busy || !next) return
      busy = true
      grid.insertAdjacentHTML('beforeend', '<div class="tile skel" data-sk><div class="thumb"></div><div class="tbody"><div class="s1"></div><div class="s2"></div><div class="s3"></div></div></div>')
      fetch(next.href).then(function (r) { return r.text() }).then(function (h) {
        var d = new DOMParser().parseFromString(h, 'text/html')
        grid.querySelectorAll('[data-sk]').forEach(function (x) { x.remove() })
        d.querySelectorAll('[data-grid] > .tile').forEach(function (t) { grid.appendChild(document.importNode(t, true)) })
        var n2 = d.querySelector('.pager .pnext')
        var pg = document.querySelector('.pager')
        if (n2) { next.href = n2.href } else { io.disconnect(); next = null; if (pg) pg.hidden = true }
        busy = false
      }).catch(function () { busy = false })
    }, { rootMargin: '600px' })
    io.observe(document.querySelector('.pager'))
  }
})()
