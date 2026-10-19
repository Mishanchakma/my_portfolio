document.addEventListener("DOMContentLoaded", () => {
  const D = window.DATA || {}, TR = window.LANG || {};
  const $ = (s) => document.querySelector(s), $$ = (s) => document.querySelectorAll(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
 // Images uploaded from the admin panel are saved as "/api/file/..."; they can only be shown if the backend is running
  const mediaUrl = (u) => { u = String(u || ""); return u.startsWith("/api/file/") ? (API ? API + u : "") : u; };
  const safeUrl = (u) => { u = mediaUrl(u); return /^(https?:\/\/|image\/|assets\/)[^\s"'<>]*$/.test(u) ? esc(u) : ""; };
  // Backend: local address will only run on the local page (site will not break even if mistakenly pushed to GitHub)
  const API = (() => {
    const u = String(window.API_URL || "").replace(/\/$/, ""); if (!u) return "";
    const isLocalApi = /^http:\/\/(localhost|127\.0\.0\.1)/.test(u), onLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
    return isLocalApi && !onLocal ? "" : u;
  })();
  // Items marked "draft" in the admin are never shown (the server also hides them)
  const pub = (k) => (Array.isArray(D[k]) ? D[k] : []).filter((x) => x && !x.draft);
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };

  // ---------- Language ----------
  let lang = store.get("lang");
  if (!TR[lang]) { const nl = (navigator.language || "en").slice(0, 2).toLowerCase(); lang = TR[nl] ? nl : "en"; }
  const t = (k) => (TR[lang] && TR[lang][k]) || (TR.en && TR.en[k]) || "";
  const L = (o, k) => o[k + "_" + lang] || o[k];

  // ---------- Site Settings (from admin panel) ----------
  const S = () => D.site || {};
  const LS = (k) => S()[k + "_" + lang] || S()[k] || "";
  const DEFAULT_ROLES = ["Aspiring Robotics Scientist", "Embedded Systems Learner", "Future ROS 2 Developer"];
  const DEFAULT_LOGS = ["[ROS 2] /kinematics_node loop: 50 Hz", "[BMS] Cell balance OK. Pack: 12.38 V", "[INFO] Joint telemetry synchronized", "[WARN] Control loop latency spike", "[INFO] Node graph healthy"];
  let roles = DEFAULT_ROLES, labLogs = DEFAULT_LOGS;
  // Typing animation settings (from admin): speeds in ms, clamped to safe ranges
  const num = (v, d, lo, hi) => { v = Number(v); return Number.isFinite(v) && v !== 0 ? Math.min(hi, Math.max(lo, v)) : d; };
  const T = () => {
    const t = S().typing || {};
    return { speed: num(t.speed, 60, 15, 500), deleteSpeed: num(t.deleteSpeed, 30, 10, 500), pause: num(t.pause, 2000, 300, 10000), shuffle: t.order === "Shuffle", cursor: t.cursor !== "Off" };
  };
  const term = $("#terminal-output");

  function setAvatar() {
    const wrap = $("#avatar-wrap"); if (!wrap) return;
    const f = (S().files || {}).profile;
    const src = API && f ? `${API}/api/file/profile?v=${f}` : "image/profile.jpeg";
    if (wrap.dataset.src === src) return;
    wrap.dataset.src = src;
    const name = S().name || "Mishan Chakma";
    const initials = name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const fallback = () => { const sp = document.createElement("span"); sp.className = "avatar d-inline-flex align-items-center justify-content-center fs-1 fw-bold text-accent"; sp.textContent = initials; wrap.replaceChildren(sp); };
    const img = new Image(); img.className = "avatar"; img.alt = "Portrait of " + name;
    img.onerror = () => { if (src !== "image/profile.jpeg") { img.onerror = fallback; img.src = "image/profile.jpeg"; } else fallback(); };
    img.src = src; wrap.replaceChildren(img);
  }

  function applyLab(lab) {
    const note = lab["note_" + lang] || lab.note; if (note) $("#lab-note").textContent = note;
    const intro = (lab.intro || []).filter(Boolean), key = JSON.stringify(intro);
    if (intro.length && term.dataset.intro !== key) {
      term.dataset.intro = key;
      term.replaceChildren(...intro.map((l) => { const d = document.createElement("div"); d.textContent = "> " + l; return d; }));
    }
    const logs = (lab.logs || []).filter(Boolean); labLogs = logs.length ? logs : DEFAULT_LOGS;
    if (lab.cad) $("#lab-cad").textContent = lab.cad;
    const nodes = (lab.nodes || []).filter(Boolean);
    if (nodes.length) $("#lab-nodes").innerHTML = '<span class="text-body-secondary">[ROS 2 Graph View]</span><br>' + nodes.map((n, i) => `<span class="badge border border-${["info", "warning", "success"][i % 3]} text-body">${esc(n)}</span>`).join(" &rarr; ");
    if (lab.servoLabel) $("#servo-label").textContent = lab.servoLabel;
    if (lab.powerLabel) $("#power-label").textContent = lab.powerLabel;
  }

  // Name, image, CV, text, Lab, and section hiding — all according to the values provided by the admin
  function applySite() {
    const s = S(), f = s.files || {}, name = s.name || "Mishan Chakma";
    ["#brand-name", "#hero-name", "#footer-name"].forEach((id) => { const el = $(id); if (el) el.textContent = name; });
    if (s.name) document.title = name + " | Mechatronics Portfolio";
    [["#hero-sub", "heroSub"], ["#hero-desc", "heroDesc"], ["#about-text", "aboutText"], ["#research", "research"]].forEach(([sel, k]) => { const v = LS(k), el = $(sel); if (v && el) el.textContent = v; });
    setAvatar();
    const cv = $("#cv-link"); if (cv) cv.href = API && f.cv ? `${API}/api/file/cv?dl=1&v=${f.cv}` : "assets/Mishan_Chakma_CV.pdf";
    const cvView = $("#cv-view"); if (cvView) cvView.href = API && f.cv ? `${API}/api/file/cv?v=${f.cv}` : "assets/Mishan_Chakma_CV.pdf";
    // Typing lines: current language's list first, then the shared list, then built-in defaults
    const pick = [s["roles_" + lang], s.roles].map((a) => (Array.isArray(a) ? a.filter(Boolean) : [])).find((a) => a.length);
    roles = pick || DEFAULT_ROLES;
    const typingEl = $("#typing-text"); if (typingEl) typingEl.classList.toggle("typing-cursor", T().cursor);
    const hidden = s.hidden || [];
    ["about", "education", "skills", "projects", "activities", "roadmap", "lab"].forEach((id) => {
      const off = hidden.includes(id), sec = $("#" + id), a = $('#navMenu a[href="#' + id + '"]');
      if (sec) sec.classList.toggle("d-none", off);
      if (a) a.closest("li").classList.toggle("d-none", off);
    });
    applyLab(s.lab || {});
  }

  // ---------- Theme ----------
  const root = document.documentElement, themeBtn = $("#theme-toggle");
  let rgb = "255,193,7";
  const setTheme = (th) => {
    root.setAttribute("data-bs-theme", th);
    rgb = th === "dark" ? "255,193,7" : "138,93,0";
    themeBtn.innerHTML = th === "dark" ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    themeBtn.classList.remove("spin"); void themeBtn.offsetWidth; themeBtn.classList.add("spin");
    store.set("theme", th);
  };
  setTheme(store.get("theme") === "light" ? "light" : "dark");
  themeBtn.addEventListener("click", () => setTheme(root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark"));

  // ---------- Reveal on scroll (staggered) ----------
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in"); io.unobserve(e.target);
    setTimeout(() => { e.target.style.transitionDelay = ""; }, 1000);
  }), { threshold: 0.1 });
  const reveal = () => $$(".fade-in:not(.in)").forEach((el, i) => { el.style.transitionDelay = Math.min(i % 6, 5) * 80 + "ms"; io.observe(el); });

  // ---------- Helpers ----------
  const sIcon = { "Stable": '<i class="fa-solid fa-circle-check text-success me-2"></i>', "Active Build": '<i class="fa-solid fa-spinner fa-spin text-warning me-2"></i>', "Research": '<i class="fa-solid fa-flask text-info me-2"></i>' };
  const sBadge = { "Stable": "success", "Active Build": "warning", "Research": "info" };
  const pBadge = { "Planning": "secondary", "Building": "warning", "Completed": "success" };
  const links = (o) => [["github", "fa-github", t("codeLbl")], ["video", "fa-video", t("videoLbl")], ["link", "fa-link", t("linkLbl")]].filter(([k]) => safeUrl(o[k]))
    .map(([k, i, l]) => `<a href="${safeUrl(o[k])}" target="_blank" rel="noopener" class="btn btn-sm btn-outline-warning me-1"><i class="fa-solid ${i} me-1"></i>${l}</a>`).join("");

  function filtered(gridSel, barSel, items, key, card) {
    const grid = $(gridSel), bar = $(barSel);
    const draw = (v) => {
      grid.innerHTML = items.filter((i) => v === "all" || i[key] === v).map(card).join("") || '<p class="text-center text-body-secondary">…</p>';
      reveal();
    };
    bar.innerHTML = ["all", ...new Set(items.map((i) => i[key]))].map((k, i) => `<button class="btn btn-sm btn-outline-warning ${i ? "" : "active"}" data-f="${esc(k)}">${esc(k === "all" ? t("all") : k)}</button>`).join("");
    bar.onclick = (e) => {
      const b = e.target.closest("button"); if (!b) return;
      bar.querySelectorAll("button").forEach((x) => x.classList.toggle("active", x === b));
      draw(b.dataset.f);
    };
    draw("all");
  }

  // ---------- Render all data-driven sections ----------
  function renderAll() {
    $("#education-list").innerHTML = pub("education").map((e) => `
      <div class="col-md-8 fade-in"><div class="card accent-top tilt"><div class="card-body">
        <h3 class="h5 fw-bold">${esc(L(e, "degree"))}</h3>${L(e, "place") ? `<p class="mb-1">${esc(L(e, "place"))}</p>` : ""}
        ${[e.period, e.score].filter(Boolean).length ? `<p class="mb-1 text-body-secondary small">${[e.period, e.score].filter(Boolean).map(esc).join(" · ")}</p>` : ""}<p class="mb-0 small">${esc(L(e, "note"))}</p>
      </div></div></div>`).join("");

    $("#skills-grid").innerHTML = pub("skills").map((g) => `
      <div class="col-md-4 fade-in"><div class="card accent-top h-100 tilt"><div class="card-body">
        <i class="fa-solid ${esc(g.icon)} fa-2x text-accent mb-3"></i><h3 class="h5 fw-bold mb-3">${esc(L(g, "group"))}</h3>
        <ul class="list-unstyled small mb-0">${g.items.map(([n, s]) => `<li class="d-flex justify-content-between align-items-center mb-2"><span>${sIcon[s] || ""}${esc(n)}</span><span class="badge text-bg-${sBadge[s] || "secondary"}">${esc(s)}</span></li>`).join("")}</ul>
      </div></div></div>`).join("");

    filtered("#projects-grid", "#project-filters", pub("projects"), "category", (p, i) => `
      <div class="col-md-6 fade-in"><div class="card h-100 tilt overflow-hidden">
        ${safeUrl(p.image) ? `<img src="${safeUrl(p.image)}" class="card-img-top" loading="lazy" decoding="async" alt="${esc(p.title)}">` : `<div class="d-flex flex-column align-items-center justify-content-center bg-body-secondary py-5"><i class="fa-solid ${esc(p.icon || "fa-robot")} fa-3x text-accent"></i></div>`}
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2"><h3 class="h5 fw-bold mb-0">${esc(L(p, "title"))}</h3><span class="badge text-bg-${pBadge[p.status] || "secondary"}">${esc(p.status)}</span></div>
          <p class="small text-body-secondary">${esc(L(p, "desc"))}</p>
          <p>${(p.tags || []).map((x) => `<span class="badge border text-body me-1">${esc(x)}</span>`).join("")}</p>
          ${(p.bom || []).length ? `<button class="btn btn-sm btn-outline-secondary w-100 mb-2" data-bs-toggle="collapse" data-bs-target="#bom-${i}"><i class="fa-solid fa-list-check me-2"></i>${esc(t("bom"))}</button>
            <div class="collapse" id="bom-${i}"><ul class="small font-monospace ps-3 mb-2 text-accent">${p.bom.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div>` : ""}
          ${links(p)}
        </div></div></div>`);

    const acts = [...pub("activities")].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    filtered("#activity-timeline", "#activity-filters", acts, "type", (a) => `
      <div class="timeline-item fade-in">
        <div class="small text-body-secondary">${esc(a.date)} · <span class="badge text-bg-warning">${esc(a.type)}</span></div>
        <h3 class="h5 fw-bold mb-1">${esc(L(a, "title"))}</h3>
        <div class="small">${esc(a.org)}${a.result ? ` · <strong>${esc(L(a, "result"))}</strong>` : ""}</div>
        <p class="small text-body-secondary mb-2">${esc(L(a, "desc"))}</p>
        ${safeUrl(a.image) ? `<img src="${safeUrl(a.image)}" class="img-fluid rounded mb-2" loading="lazy" decoding="async" alt="${esc(a.title)}">` : ""}${links(a)}
      </div>`);

    $("#roadmap-list").innerHTML = pub("roadmap").map((s) => `
      <div class="col-md-6 col-lg-3 fade-in"><div class="card h-100 accent-top tilt"><div class="card-body">
        <h3 class="h5 fw-bold text-accent">${esc(L(s, "stage"))}</h3><p class="small text-body-secondary mb-2">${esc(L(s, "period"))}</p><p class="small mb-0">${esc(L(s, "goal"))}</p>
      </div></div></div>`).join("");

    const sc = Object.fromEntries(Object.entries((D.site || {}).contact || {}).filter(([, v]) => v));
    const ct = { ...(D.contact || {}), ...sc };
    const hrefOk = (u) => (/^https?:\/\//i.test(String(u || "")) ? u : "#");
    $("#contact-email").textContent = ct.email ? t("emailLbl") + ": " + ct.email : "";
    $("#gh-link").href = hrefOk(ct.github); $("#in-link").href = hrefOk(ct.linkedin);
    reveal();
  }

  function applyLang() {
    root.lang = lang; $("#lang-select").value = lang;
    $$("[data-i18n]").forEach((el) => { const v = t(el.dataset.i18n); if (v) el.textContent = v; });
    renderAll();
    applySite();
  }
  $("#lang-select").addEventListener("change", (e) => { lang = TR[e.target.value] ? e.target.value : "en"; store.set("lang", lang); applyLang(); });
  applyLang();

  // ---------- Hero counters ----------
  function updateCounts() {
    const counts = { projects: pub("projects").length, activities: pub("activities").length, skills: pub("skills").reduce((a, g) => a + (g.items || []).length, 0) };
    $$("[data-count]").forEach((el) => { const n = counts[el.dataset.count] || 0; let i = 0; clearTimeout(el._t); (function s() { el.textContent = i; if (i < n) { i++; el._t = setTimeout(s, RM ? 0 : 80); } })(); });
  }
  updateCounts();

 // ---------- Live content from backend (falls back to data.js if unreachable) ----------
  if (API) {
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 15000);
    fetch(API + "/api/data", { signal: ctl.signal }).then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const kinds = ["education", "skills", "projects", "activities", "roadmap"];
        if (kinds.some((k) => Array.isArray(d[k]) && d[k].length)) kinds.forEach((k) => { if (Array.isArray(d[k])) D[k] = d[k]; });
        if (d.site && typeof d.site === "object") D.site = d.site;
        applyLang(); updateCounts();
      }).catch(() => {}).finally(() => clearTimeout(timer));
  }

  // ---------- Typing effect ----------
  const typing = $("#typing-text"); let r = 0, c = 0, del = false;
  (function type() {
    const cfg = T(), w = roles[r % roles.length] || ""; c = Math.max(0, Math.min(w.length, c + (del ? -1 : 1))); typing.textContent = w.substring(0, c);
    let d = del ? cfg.deleteSpeed : cfg.speed;
    if (!del && c >= w.length) { d = cfg.pause; del = true; }
    else if (del && c === 0) {
      del = false; d = 300;
      if (cfg.shuffle && roles.length > 1) { let n; do { n = Math.floor(Math.random() * roles.length); } while (n === r % roles.length); r = n; }
      else r = (r + 1) % roles.length;
    }
    setTimeout(type, d);
  })();

  // ---------- Scroll progress + back to top ----------
  const bar = $("#progress"), topBtn = $("#to-top");
  addEventListener("scroll", () => {
    const h = document.documentElement;
    bar.style.transform = `scaleX(${h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1)})`;
    topBtn.classList.toggle("show", h.scrollTop > 600);
  }, { passive: true });
  topBtn.addEventListener("click", () => scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" }));

  // ---------- 3D card tilt ----------
  if (!RM) {
    const reset = () => $$(".tilt.tilting").forEach((x) => { x.style.transform = ""; x.classList.remove("tilting"); });
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest && e.target.closest(".tilt");
      $$(".tilt.tilting").forEach((x) => { if (x !== card) { x.style.transform = ""; x.classList.remove("tilting"); } });
      if (!card || e.pointerType === "touch") return;
      const b = card.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
      card.classList.add("tilting");
      card.style.transform = `perspective(700px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
    });
    document.documentElement.addEventListener("mouseleave", reset);
  }

  // ---------- Hero particle network ----------
  (function () {
    const cv = $("#bg-canvas"); if (!cv || RM) return;
    const g = cv.getContext("2d"); let w, h, P = [], m = { x: -999, y: -999 }, run = true, on = false;
    const size = () => { w = cv.width = cv.offsetWidth; h = cv.height = cv.offsetHeight;
      P = Array.from({ length: Math.min(70, Math.floor(w * h / 16000)) }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5 })); };
    size(); addEventListener("resize", size);
    const hero = cv.parentElement;
    hero.addEventListener("pointermove", (e) => { const b = cv.getBoundingClientRect(); m.x = e.clientX - b.left; m.y = e.clientY - b.top; });
    hero.addEventListener("pointerleave", () => { m.x = -999; });
    const loop = () => {
      if (!run) { on = false; return; } on = true;
      g.clearRect(0, 0, w, h);
      P.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - m.x, dy = p.y - m.y, d = Math.hypot(dx, dy);
        if (d < 110 && d > 0) { p.x += dx / d * 1.5; p.y += dy / d * 1.5; }
        g.fillStyle = `rgba(${rgb},.8)`; g.beginPath(); g.arc(p.x, p.y, 2, 0, 6.283); g.fill();
        for (let j = i + 1; j < P.length; j++) {
          const q = P[j], dd = Math.hypot(p.x - q.x, p.y - q.y);
          if (dd < 120) { g.strokeStyle = `rgba(${rgb},${0.35 * (1 - dd / 120)})`; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(q.x, q.y); g.stroke(); }
        }
      });
      requestAnimationFrame(loop);
    };
    new IntersectionObserver((es) => { run = es[0].isIntersecting; if (run && !on) loop(); }).observe(cv);
  })();

  // ---------- Contact form ----------
  const form = $("#contact-form"), box = $("#form-alert"), btn = $("#form-submit-btn");
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); btn.disabled = true; btn.textContent = "...";
    const show = (ok, m) => { box.className = "alert " + (ok ? "alert-success" : "alert-danger"); box.textContent = m; };
    try {
      const res = API
        ? await fetch(API + "/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) })
        : await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(); show(true, t("ok")); form.reset();
    } catch (err) { show(false, t("err")); }
    finally { btn.disabled = false; btn.textContent = t("send"); }
  });

  // ---------- System clock ----------
  const LOC = { en: "en-US", de: "de-DE", bn: "bn-BD", hi: "hi-IN", fr: "fr-FR", zh: "zh-CN", ja: "ja-JP", ko: "ko-KR" };
  let tz = "UTC"; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; } catch (e) {}
  const tick = () => {
    const n = new Date(), loc = LOC[lang] || "en-US";
    $("#live-time").textContent = n.toLocaleTimeString(loc);
    $("#live-date").textContent = n.toLocaleDateString(loc, { dateStyle: "full" }) + " · " + tz;
    try { $("#owner-time").textContent = n.toLocaleTimeString(loc, { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit" }) + " (UTC+6)"; } catch (e) {}
  };
  tick(); setInterval(tick, 1000);

  // ---------- Simulated lab ----------
  setInterval(() => {
    if (document.hidden) return;
    const d = document.createElement("div"); d.textContent = "> " + labLogs[Math.floor(Math.random() * labLogs.length)];
    term.appendChild(d); while (term.children.length > 40) term.removeChild(term.firstChild); term.scrollTop = term.scrollHeight;
  }, 3000);
  setInterval(() => { $("#servo-bar").style.width = Math.random() * 30 + 50 + "%"; $("#power-bar").style.width = Math.random() * 15 + 80 + "%"; }, 2000);
});
