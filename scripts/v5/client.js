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
  // Click-to-load players: nothing third-party loads until the click.
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a.facade')
    if (a) {
      ev.preventDefault()
      var t = a.dataset.type, id = a.dataset.id, u = a.dataset.url
      if (t === 'youtube') {
        var f = document.createElement('iframe')
        f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1'
        f.title = a.getAttribute('aria-label') || 'Video'
        f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        f.allowFullscreen = true
        f.referrerPolicy = 'strict-origin-when-cross-origin'
        f.className = 'yt'
        a.replaceWith(f)
      } else if (t === 'x') {
        var q = document.createElement('blockquote')
        q.className = 'twitter-tweet'
        q.setAttribute('data-dnt', 'true')
        q.setAttribute('data-align', 'center')
        var l = document.createElement('a')
        l.href = u.replace('https://x.com/', 'https://twitter.com/')
        l.textContent = 'View the post on X'
        q.appendChild(l)
        var w = document.createElement('div')
        w.className = 'x-wrap'
        w.appendChild(q)
        a.replaceWith(w)
        if (window.twttr && window.twttr.widgets) window.twttr.widgets.load(w)
        else if (!document.getElementById('twjs')) {
          var s = document.createElement('script')
          s.id = 'twjs'; s.async = true; s.src = 'https://platform.twitter.com/widgets.js'
          document.body.appendChild(s)
        }
      }
      return
    }
    var c = ev.target.closest && ev.target.closest('[data-copy]')
    if (c && navigator.clipboard) {
      navigator.clipboard.writeText(c.dataset.copy).then(function () { c.textContent = 'Copied' })
    }
  })
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
