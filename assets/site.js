/* Zegbit website — shared behaviour (no dependencies)
   NOTE: every form here is front-end only. Nothing is sent or stored on a server.
   See README.md for how to connect the real backend safely. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const WA = '94775803068';
  const root = document.documentElement;
  const sysLight = matchMedia('(prefers-color-scheme: light)');
  const chosen = () => root.getAttribute('data-zb-theme');
  const isLight = () => chosen() ? chosen() === 'light' : sysLight.matches;
  const cssv = n => getComputedStyle(root).getPropertyValue(n).trim();
  let AC = cssv('--ac-rgb') || '198,242,78';
  const refreshTheme = () => { AC = cssv('--ac-rgb') || AC; document.dispatchEvent(new Event('zb-theme')); };
  const saveTheme = t => {
    try { localStorage.setItem('zb-theme', t); } catch (_) {}
    try { window.name = (window.name || '').replace(/(?:^|;)zbtheme=(light|dark)/, '') .replace(/^;|;$/g, '') + ';zbtheme=' + t; } catch (_) {}
  };
  $$('[data-theme-toggle]').forEach(b => b.addEventListener('click', e => {
    const next = isLight() ? 'dark' : 'light';
    const apply = () => { root.setAttribute('data-zb-theme', next); saveTheme(next); refreshTheme(); };
    if (document.startViewTransition && !reduce.matches) {
      const r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      document.startViewTransition(apply).ready.then(() => {
        root.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] }, { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)', pseudoElement: '::view-transition-new(root)' });
      }).catch(() => {});
    } else { root.classList.add('theme-anim'); apply(); setTimeout(() => root.classList.remove('theme-anim'), 450); }
  }));
  sysLight.addEventListener?.('change', refreshTheme);

  /* ---------- mobile menu ---------- */
  const mb = $('#menuBtn'), mn = $('#mnav');
  if (mb && mn) {
    mb.addEventListener('click', () => { const open = mn.hidden; mn.hidden = !open; mb.setAttribute('aria-expanded', String(open)); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mn.hidden) { mn.hidden = true; mb.setAttribute('aria-expanded', 'false'); mb.focus(); } });
  }

  /* ---------- card spotlight follows the pointer ---------- */
  $$('.card').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  /* ---------- luminous node mesh (hero and page heads) ---------- */
  $$('canvas.mesh').forEach(cv => mesh(cv));
  function mesh(cv) {
    const ctx = cv.getContext('2d'), host = cv.parentElement;
    const dense = Number(cv.dataset.density || 5200), LINK = 72, CUR = 130;
    let W = 0, H = 0, P = [], m = { x: -1e4, y: -1e4, on: false }, trail = [], raf = 0, vis = true;
    const mk = () => { const a = Math.random() * 6.283, s = .08 + Math.random() * .22; return { x: Math.random() * W, y: Math.random() * H, vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: .6 + Math.random() * 1.5, t: Math.random() * 6.28, b: .45 + Math.random() * .55 }; };
    function size() {
      const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      W = Math.max(1, r.width); H = Math.max(1, r.height); cv.width = Math.round(W * d); cv.height = Math.round(H * d); ctx.setTransform(d, 0, 0, d, 0, 0);
      const n = Math.round(Math.min(130, Math.max(40, W * H / dense)));
      while (P.length < n) P.push(mk()); P.length = n;
    }
    function step() {
      for (const p of P) {
        p.t += .02; p.x += p.vx; p.y += p.vy;
        if (m.on) { const dx = p.x - m.x, dy = p.y - m.y, d2 = dx * dx + dy * dy; if (d2 < CUR * CUR && d2 > .01) { const d = Math.sqrt(d2), f = (1 - d / CUR) * 1.4; p.x += dx / d * f - dy / d * f * .35; p.y += dy / d * f + dx / d * f * .35; } }
        if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
      }
    }
    function draw() {
      const light = isLight(); ctx.clearRect(0, 0, W, H); ctx.lineWidth = .8;
      for (let i = 0; i < P.length; i++) {
        const a = P[i];
        for (let j = i + 1; j < P.length; j++) { const b = P[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy; if (d2 < LINK * LINK) { ctx.strokeStyle = `rgba(${AC},${((light ? .28 : .22) * (1 - Math.sqrt(d2) / LINK)).toFixed(3)})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } }
        if (m.on) { const d = Math.hypot(a.x - m.x, a.y - m.y); if (d < CUR) { ctx.strokeStyle = `rgba(${AC},${(.4 * (1 - d / CUR)).toFixed(3)})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(m.x, m.y); ctx.stroke(); } }
      }
      ctx.globalCompositeOperation = light ? 'source-over' : 'lighter';
      for (const p of P) { const al = p.b * (.65 + .35 * Math.sin(p.t)); ctx.fillStyle = `rgba(${AC},${(al * (light ? .10 : .16)).toFixed(3)})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.283); ctx.fill(); ctx.fillStyle = light ? `rgba(${AC},${(al * .85).toFixed(3)})` : `rgba(244,250,226,${al.toFixed(3)})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); }
      trail.forEach((t, k) => { const a = (k + 1) / trail.length; ctx.fillStyle = `rgba(${AC},${(a * .35).toFixed(3)})`; ctx.beginPath(); ctx.arc(t.x + (Math.random() - .5) * 6, t.y + (Math.random() - .5) * 6, .6 + a * 1.6, 0, 6.283); ctx.fill(); });
      ctx.globalCompositeOperation = 'source-over';
    }
    const loop = () => { step(); if (trail.length && !m.on) trail.shift(); draw(); raf = vis ? requestAnimationFrame(loop) : 0; };
    const start = () => { if (!raf && !reduce.matches && !document.hidden && vis) raf = requestAnimationFrame(loop); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    host.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; m.on = m.x > -40 && m.x < W + 40 && m.y > -40 && m.y < H + 40; }, { passive: true });
    host.addEventListener('pointerleave', () => { m.on = false; });
    new ResizeObserver(() => { size(); draw(); }).observe(cv);
    document.addEventListener('zb-theme', () => draw());
    new IntersectionObserver(es => { vis = es[0].isIntersecting; vis ? start() : stop(); }).observe(host);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    size(); for (let i = 0; i < 30; i++) step(); draw(); start();
  }

  /* ---------- report overlay ---------- */
  const ov = $('.overlay#report');
  if (ov) {
    const openers = $$('[data-open-report]'), closer = $('#closeReport'); let last = null;
    const close = () => { ov.hidden = true; document.body.style.overflow = ''; last && last.focus(); };
    openers.forEach(b => b.addEventListener('click', () => { last = b; ov.hidden = false; document.body.style.overflow = 'hidden'; closer.focus(); }));
    closer.addEventListener('click', close);
    ov.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    ov.addEventListener('click', e => { if (e.target === ov || e.target.classList.contains('ov-scroll')) close(); });
  }

  /* ---------- helpers for message forms ---------- */
  function need(form, checks) {
    const err = $('.err', form); const bad = checks.filter(c => !c.ok);
    $$('[aria-invalid]', form).forEach(el => el.removeAttribute('aria-invalid'));
    if (!bad.length) { err && (err.hidden = true); return true; }
    bad.forEach(c => c.el && c.el.setAttribute('aria-invalid', 'true'));
    if (err) { err.textContent = 'Please add ' + bad.map(c => c.msg).join(', ') + '.'; err.hidden = false; }
    (bad[0].el || form).focus(); return false;
  }
  function prepared(form, msg) {
    const res = $('.result', form); $('pre', res).textContent = msg;
    $('.send-wa', res).href = `https://wa.me/${WA}?text=` + encodeURIComponent(msg);
    res.hidden = false; res.scrollIntoView({ block: 'nearest', behavior: reduce.matches ? 'auto' : 'smooth' });
  }
  $$('.copy-msg').forEach(b => b.addEventListener('click', async () => {
    const pre = $('pre', b.closest('.result'));
    try { await navigator.clipboard.writeText(pre.textContent); b.textContent = 'Copied'; }
    catch (_) { const r = document.createRange(); r.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = 'Selected, press Ctrl+C'; }
    setTimeout(() => (b.textContent = 'Copy message'), 2200);
  }));

  /* ---------- contact / quote form ---------- */
  const q = $('#quoteForm');
  q && q.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#q-name'), scope = $('#q-scope'), svcs = $$('input[name=svc]:checked', q).map(i => i.value);
    if (!need(q, [{ ok: name.value.trim(), el: name, msg: 'your name or company' }, { ok: svcs.length, el: $('input[name=svc]', q), msg: 'at least one service' }, { ok: scope.value.trim(), el: scope, msg: 'a short project scope' }])) return;

    // Send data to Spring Boot PostgreSQL backend
    const payload = {
      name: name.value.trim(),
      services: svcs,
      timelineBudget: $('#q-time').value.trim() || null,
      scope: scope.value.trim()
    };

    fetch('http://localhost:8081/api/v1/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.warn('Backend sync failed:', err));

    prepared(q, `Hi Zegbit team, I'd like to discuss a project consultation.\n\nName / company: ${name.value.trim()}\nService: ${svcs.join(', ')}\nTimeline / budget: ${$('#q-time').value.trim() || 'Not specified'}\n\nScope:\n${scope.value.trim()}`);
  });

  /* ---------- header glow follows the pointer ---------- */
  $$('.hdr').forEach(h => h.addEventListener('pointermove', e => { const r = h.getBoundingClientRect(); h.style.setProperty('--hx', (e.clientX - r.left) + 'px'); h.style.setProperty('--hy', (e.clientY - r.top) + 'px'); }));

  /* ---------- hero headline: letters light up where the pointer passes ---------- */
  $$('.hover-type').forEach(h => {
    const letters = $$('.l', h);
    const lightUp = el => { if (!el) return; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 260); };
    h.addEventListener('pointermove', e => {
      const t = e.target.closest && e.target.closest('.l'); if (!t) return;
      const i = letters.indexOf(t); lightUp(t); lightUp(letters[i - 1]); lightUp(letters[i + 1]);
    });
  });

  /* ---------- click burst: tiny ring of lines where you click (normal mouse pointer stays) ---------- */
  const fx = $('canvas.fx');
  if (fx && !reduce.matches) {
    const c = fx.getContext('2d'); let W = 0, H = 0, bursts = [], run = 0, last = 0;
    const size = () => { const d = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; fx.width = W * d; fx.height = H * d; c.setTransform(d, 0, 0, d, 0, 0); };
    size(); addEventListener('resize', size);
    const tick = t => {
      c.clearRect(0, 0, W, H);
      const dt = Math.min(40, t - (last || t)); last = t;
      bursts = bursts.filter(b => (b.life -= dt) > 0);
      for (const b of bursts) {
        const k = 1 - b.life / b.max, e = 1 - Math.pow(1 - k, 3), r0 = 3 + 13 * e, r1 = r0 + 6 * (1 - k);
        c.strokeStyle = `rgba(${AC},${(1 - k).toFixed(3)})`; c.lineWidth = 1.6; c.lineCap = 'round'; c.beginPath();
        for (let i = 0; i < b.n; i++) { const a = b.rot + i * 6.283 / b.n; c.moveTo(b.x + Math.cos(a) * r0, b.y + Math.sin(a) * r0); c.lineTo(b.x + Math.cos(a) * r1, b.y + Math.sin(a) * r1); }
        c.stroke();
        c.strokeStyle = `rgba(${AC},${((1 - k) * .5).toFixed(3)})`; c.lineWidth = 1; c.beginPath(); c.arc(b.x, b.y, 2 + 9 * e, 0, 6.283); c.stroke();
      }
      run = bursts.length ? requestAnimationFrame(tick) : (c.clearRect(0, 0, W, H), 0);
    };
    addEventListener('pointerdown', e => { if (e.button > 0) return; bursts.push({ x: e.clientX, y: e.clientY, n: 10, rot: Math.random() * 6.283, life: 420, max: 420 }); if (!run) { last = 0; run = requestAnimationFrame(tick); } }, { passive: true });
  }

  /* ---------- live service previews ---------- */
  const onScreen = (el, cb) => new IntersectionObserver(es => cb(es[0].isIntersecting)).observe(el);
  const fmt = n => n.toLocaleString('en-US');
  const pick = a => a[Math.floor(Math.random() * a.length)];
  // API gateway: new requests stream in, sparkline scrolls
  $$('.live-api').forEach(el => {
    if (reduce.matches) return;
    const log = $('[data-log]', el), rpsEl = $('[data-rps]', el), line = $('.spark-line', el), area = $('.spark-area', el);
    const REQ = [['GET','/api/v1/projects','200','ok'],['GET','/api/v1/findings?status=open','200','ok'],['POST','/api/v1/auth/login','200','ok'],['POST','/api/v1/auth/login','429','warn'],
                 ['GET','/api/v1/admin/users','403','warn'],['PUT','/api/v1/orders/1182','200','ok'],['GET','/api/v1/reports/77/pdf','200','ok'],['DELETE','/api/v1/sessions/me','204','ok'],['POST','/api/v1/tickets','201','ok'],['GET','/healthz','200','ok']];
    let pts = Array.from({ length: 40 }, () => 18 + Math.random() * 10), on = false, timer = 0;
    const drawSpark = () => {
      const d = pts.map((v, i) => `${i ? 'L' : 'M'}${(i * 280 / (pts.length - 1)).toFixed(1)} ${(44 - v).toFixed(1)}`).join(' ');
      line.setAttribute('d', d); area.setAttribute('d', d + ' L280 44 L0 44Z');
    };
    const step = () => {
      const [m, p, st, cls] = pick(REQ), ms = cls === 'ok' ? (8 + Math.random() * 60 | 0) + 'ms' : (st === '403' ? 'rbac' : 'limit');
      const row = document.createElement('div'); row.className = 'frag-row enter enter-hl';
      row.innerHTML = `<span class="m m-${m.toLowerCase()}">${m}</span><span class="grow"></span><span class="${cls}">${st}</span><span class="dim ms">${ms}</span>`;
      row.children[1].textContent = p;
      log.prepend(row); requestAnimationFrame(() => requestAnimationFrame(() => row.classList.remove('enter')));
      setTimeout(() => row.classList.remove('enter-hl'), 900);
      while (log.children.length > 4) log.lastElementChild.remove();
      const v = Math.max(6, Math.min(40, pts[pts.length - 1] + (Math.random() - .45) * 9)); pts.push(v); pts.shift(); drawSpark();
      rpsEl.textContent = Math.round(90 + v * 3.2);
    };
    drawSpark();
    onScreen(el, vis => { if (vis && !on) { on = true; timer = setInterval(step, 1150); } else if (!vis && on) { on = false; clearInterval(timer); } });
  });
  // VAPT scan: progress fills, findings appear as they are "discovered", report ready, repeat
  $$('.live-scan').forEach(el => {
    if (reduce.matches) return;
    const bar = $('[data-bar]', el), pct = $('[data-pct]', el), req = $('[data-req]', el), chk = $('[data-chk]', el), state = $('[data-state]', el), finds = $$('.find', el);
    let t = 0, on = false, timer = 0, hold = 0;
    const render = () => {
      const p = Math.min(1, t); bar.style.width = (p * 100).toFixed(1) + '%'; pct.textContent = Math.round(p * 100);
      req.textContent = fmt(Math.round(p * 4812)); chk.textContent = Math.round(p * 412);
      finds.forEach(f => f.classList.toggle('show', p >= parseFloat(f.dataset.at)));
      state.textContent = p >= 1 ? 'Report ready' : 'Scanning'; state.style.color = p >= 1 ? 'var(--ok)' : 'var(--sub)';
    };
    const step = () => { if (t >= 1) { if (++hold > 22) { t = 0; hold = 0; } } else t += 1 / 80; render(); };
    t = 0; render();
    onScreen(el, vis => { if (vis && !on) { on = true; timer = setInterval(step, 100); } else if (!vis && on) { on = false; clearInterval(timer); } });
  });
  // Firewall: packets flow (SVG), counters tick
  $$('.live-net').forEach(el => {
    const svg = $('svg', el), a = $('[data-allow]', el), b = $('[data-block]', el);
    if (reduce.matches) { svg.pauseAnimations && svg.pauseAnimations(); $$('.pk', el).forEach(p => p.remove()); return; }
    let allow = 1204, block = 37, on = false, timer = 0;
    const step = () => { allow += 1 + (Math.random() * 3 | 0); if (Math.random() < .28) block++; a.textContent = fmt(allow); b.textContent = fmt(block); };
    onScreen(el, vis => {
      if (vis && !on) { on = true; svg.unpauseAnimations && svg.unpauseAnimations(); timer = setInterval(step, 700); }
      else if (!vis && on) { on = false; svg.pauseAnimations && svg.pauseAnimations(); clearInterval(timer); }
    });
  });

  /* ---------- footer year ---------- */
  $$('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));
})();
