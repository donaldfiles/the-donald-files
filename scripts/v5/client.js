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
  // Watches the YouTube frame's player state. onPlay fires once it is really playing (state 1) or paused (2);
  // onMuted(true/false) fires when YouTube reports the player muted or unmuted (or our fallback muted it).
  function ytWatch(f, onPlay, onMuted) {
    var state = -9, origin = 'https://www.youtube-nocookie.com', done = false, muted = null
    var send = function (o) { try { f.contentWindow.postMessage(JSON.stringify(o), origin) } catch (e) {} }
    var setMuted = function (m) { if (m !== muted) { muted = m; onMuted(m) } }
    var onMsg = function (ev) {
      if (ev.source !== f.contentWindow) return
      try {
        var d = JSON.parse(ev.data)
        if (d.info && typeof d.info.playerState === 'number') state = d.info.playerState
        if (d.info && typeof d.info.muted === 'boolean' && (state === 1 || state === 3 || muted !== null)) setMuted(d.info.muted)
      } catch (e) {}
      if (!done && (state === 1 || state === 2)) { done = true; onPlay() }
    }
    window.addEventListener('message', onMsg)
    f.addEventListener('load', function () {
      var n = 0, hello = setInterval(function () { send({ event: 'listening', id: 1, channel: 'widget' }); if (++n > 20 || state !== -9) clearInterval(hello) }, 250)
      // Safari and strict autoplay setups block unmuted autoplay even after our click. If it isn't playing
      // (or buffering) ~0.8s after the frame loads, start it muted and offer the "Tap for sound" pill.
      setTimeout(function () {
        if (state !== 1 && state !== 3 && document.contains(f)) { send({ event: 'command', func: 'mute', args: [] }); send({ event: 'command', func: 'playVideo', args: [] }); setMuted(true) }
      }, 800)
    })
    return {
      unmute: function () { send({ event: 'command', func: 'unMute', args: [] }); send({ event: 'command', func: 'setVolume', args: [100] }); muted = false }
    }
  }
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
        f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1&modestbranding=1&enablejsapi=1&origin=' + encodeURIComponent(location.origin) + (st ? '&start=' + st : '')
        f.title = a.getAttribute('aria-label') || 'Video'
        f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share'
        f.allowFullscreen = true
        f.referrerPolicy = 'strict-origin-when-cross-origin'
        var wrap = document.createElement('div')
        wrap.className = a.className.replace(/\bfacade\b/, '').replace(/\bfb\b/, '') + ' playing'
        wrap.appendChild(f)
        // Long livestream offsets can take a while to buffer: keep the poster up with a spinner until the
        // player reports playing, 8s at most. pointer-events:none so taps still reach YouTube's frame.
        var ld = document.createElement('div'), img = a.querySelector('img')
        ld.className = 'ldg'; ld.setAttribute('role', 'status')
        if (img) { var im = img.cloneNode(); im.removeAttribute('loading'); im.alt = ''; ld.appendChild(im) }
        ld.insertAdjacentHTML('beforeend', '<span class="ldg-in"><span class="spin" aria-hidden="true"></span>Loading clip…</span>')
        wrap.appendChild(ld)
        var hide = function () { if (ld.parentNode) { ld.classList.add('out'); setTimeout(function () { ld.remove() }, 250) } }
        setTimeout(hide, 8000)
        a.replaceWith(wrap)
        cur = { wrap: wrap, facade: a }
        // Muted fallback: a "Tap for sound" pill (the tap is a user gesture, so iOS allows unMute).
        var pill = document.createElement('button')
        pill.type = 'button'; pill.className = 'unm'; pill.hidden = true
        pill.innerHTML = '<span aria-hidden="true">🔇</span> Tap for sound'
        wrap.appendChild(pill)
        var yt = ytWatch(f, hide, function (m) { pill.hidden = !m })
        pill.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); yt.unmute(); pill.hidden = true })
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
      var msg = f.querySelector('[data-msg]'), b = f.querySelector('button'), label = b.dataset.label || (b.dataset.label = b.textContent)
      b.disabled = true; b.setAttribute('aria-busy', 'true'); b.textContent = 'Sending…'
      delete b.dataset.state; f.removeAttribute('data-state'); msg.textContent = ''
      fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: f.elements.email.value, website: f.elements.website.value, t: Number(f.elements.t.value), source: f.dataset.sub }),
      })
        .then(function (r) { return r.json() })
        .then(function (j) {
          msg.textContent = j.message || 'Done.'
          if (j.ok) { f.elements.email.value = ''; b.dataset.state = 'sent'; b.textContent = 'Check your inbox'; try { localStorage.setItem('tdf_subscribed', '1') } catch (e) {} var cbar = document.querySelector('[data-clipbar]'); if (cbar) cbar.hidden = true; document.body.classList.remove('hasbar') }
          else f.dataset.state = 'error'
        })
        .catch(function () { f.dataset.state = 'error'; msg.textContent = 'Something broke on our end. Try again in a minute.' })
        .then(function () {
          b.disabled = false; b.removeAttribute('aria-busy')
          if (b.dataset.state === 'sent') setTimeout(function () { if (b.dataset.state === 'sent') { delete b.dataset.state; b.textContent = label } }, 4000)
          else b.textContent = label
        })
    })
  })
  // Clip-page sticky digest bar: shows once the player is out of view, hides while the card or bottom band is on screen.
  var cbar = document.querySelector('[data-clipbar]'), ccard = document.getElementById('clipsub'), cplay = document.getElementById('play')
  if (cbar && ccard && 'IntersectionObserver' in window) {
    var ls = function (k) { try { return localStorage.getItem(k) } catch (e) { return null } }
    var gone = ls('tdf_subscribed') === '1' || Number(ls('tdf_clipbar_dismissed') || 0) > Date.now()
    if (!gone) {
      var vis = { play: !!cplay, card: false, band: false }, dead = false
      var upd = function () { var show = !dead && !vis.play && !vis.card && !vis.band; cbar.hidden = !show; document.body.classList.toggle('hasbar', show) }
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { vis[e.target === cplay ? 'play' : e.target === ccard ? 'card' : 'band'] = e.isIntersecting }); upd() })
      if (cplay) io.observe(cplay); io.observe(ccard)
      var band = document.getElementById('subscribe'); if (band) io.observe(band)
      cbar.querySelector('[data-cbx]').addEventListener('click', function () { dead = true; try { localStorage.setItem('tdf_clipbar_dismissed', String(Date.now() + 7 * 864e5)) } catch (e) {} upd() })
      cbar.querySelector('[data-cbgo]').addEventListener('click', function (ev) {
        ev.preventDefault()
        var f = ccard.querySelector('form[data-sub]'); if (f && ccard.dataset.barsrc) f.dataset.sub = ccard.dataset.barsrc
        ccard.scrollIntoView({ block: 'center', behavior: 'smooth' })
        var inp = ccard.querySelector('input[type=email]'); if (inp) setTimeout(function () { inp.focus({ preventScroll: true }) }, 350)
      })
    }
  }
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
  // Midterms hub: tag chips filter the lead clip and grid in place (all clips render without JS).
  var mtc = document.querySelector('[data-mtchips]')
  if (mtc) {
    mtc.addEventListener('click', function (ev) {
      var b = ev.target.closest('button[data-mt]')
      if (!b) return
      var k = b.dataset.mt, n = 0
      mtc.querySelectorAll('button[data-mt]').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false') })
      document.querySelectorAll('[data-mttags]').forEach(function (el) {
        var show = !k || (' ' + el.dataset.mttags + ' ').indexOf(' ' + k + ' ') > -1
        el.hidden = !show
        if (show) n++
      })
      var em = document.querySelector('[data-mtempty]')
      if (em) em.hidden = n > 0
    })
  }
})()
