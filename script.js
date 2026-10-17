document.addEventListener("DOMContentLoaded", () => {
  const D = window.DATA || {}, TR = window.LANG || {};
  const $ = (s) => document.querySelector(s), $$ = (s) => document.querySelectorAll(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = (u) => (/^https?:\/\//.test(u) ? esc(u) : "");
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };

  // ---------- Language ----------
  let lang = store.get("lang");
  if (!TR[lang]) { const nl = (navigator.language || "en").slice(0, 2).toLowerCase(); lang = TR[nl] ? nl : "en"; }
  const t = (k) => (TR[lang] && TR[lang][k]) || (TR.en && TR.en[k]) || "";
  const L = (o, k) => o[k + "_" + lang] || o[k];

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
  const links = (o) => [["github", "fa-github", "Code"], ["video", "fa-video", "Video"], ["link", "fa-link", "Link"]].filter(([k]) => safeUrl(o[k]))
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
    $("#education-list").innerHTML = (D.education || []).map((e) => `
      <div class="col-md-8 fade-in"><div class="card accent-top tilt"><div class="card-body">
        <h3 class="h5 fw-bold">${esc(L(e, "degree"))}</h3><p class="mb-1">${esc(L(e, "place"))}</p>
        <p class="mb-1 text-body-secondary small">${esc(e.period)} · ${esc(e.score)}</p><p class="mb-0 small">${esc(L(e, "note"))}</p>
      </div></div></div>`).join("");

    $("#skills-grid").innerHTML = (D.skills || []).map((g) => `
      <div class="col-md-4 fade-in"><div class="card accent-top h-100 tilt"><div class="card-body">
        <i class="fa-solid ${esc(g.icon)} fa-2x text-accent mb-3"></i><h3 class="h5 fw-bold mb-3">${esc(L(g, "group"))}</h3>
        <ul class="list-unstyled small mb-0">${g.items.map(([n, s]) => `<li class="d-flex justify-content-between align-items-center mb-2"><span>${sIcon[s] || ""}${esc(n)}</span><span class="badge text-bg-${sBadge[s] || "secondary"}">${esc(s)}</span></li>`).join("")}</ul>
      </div></div></div>`).join("");

    filtered("#projects-grid", "#project-filters", D.projects || [], "category", (p, i) => `
      <div class="col-md-6 fade-in"><div class="card h-100 tilt overflow-hidden">
        ${safeUrl(p.image) ? `<img src="${safeUrl(p.image)}" class="card-img-top" alt="${esc(p.title)}">` : `<div class="d-flex flex-column align-items-center justify-content-center bg-body-secondary py-5"><i class="fa-solid ${esc(p.icon || "fa-robot")} fa-3x text-accent"></i></div>`}
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2"><h3 class="h5 fw-bold mb-0">${esc(L(p, "title"))}</h3><span class="badge text-bg-${pBadge[p.status] || "secondary"}">${esc(p.status)}</span></div>
          <p class="small text-body-secondary">${esc(L(p, "desc"))}</p>
          <p>${(p.tags || []).map((x) => `<span class="badge border text-body me-1">${esc(x)}</span>`).join("")}</p>
          ${(p.bom || []).length ? `<button class="btn btn-sm btn-outline-secondary w-100 mb-2" data-bs-toggle="collapse" data-bs-target="#bom-${i}"><i class="fa-solid fa-list-check me-2"></i>${esc(t("bom"))}</button>
            <div class="collapse" id="bom-${i}"><ul class="small font-monospace ps-3 mb-2 text-accent">${p.bom.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div>` : ""}
          ${links(p)}
        </div></div></div>`);

    const acts = [...(D.activities || [])].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    filtered("#activity-timeline", "#activity-filters", acts, "type", (a) => `
      <div class="timeline-item fade-in">
        <div class="small text-body-secondary">${esc(a.date)} · <span class="badge text-bg-warning">${esc(a.type)}</span></div>
        <h3 class="h5 fw-bold mb-1">${esc(L(a, "title"))}</h3>
        <div class="small">${esc(a.org)}${a.result ? ` · <strong>${esc(L(a, "result"))}</strong>` : ""}</div>
        <p class="small text-body-secondary mb-2">${esc(L(a, "desc"))}</p>
        ${safeUrl(a.image) ? `<img src="${safeUrl(a.image)}" class="img-fluid rounded mb-2" alt="${esc(a.title)}">` : ""}${links(a)}
      </div>`);

    $("#roadmap-list").innerHTML = (D.roadmap || []).map((s) => `
      <div class="col-md-6 col-lg-3 fade-in"><div class="card h-100 accent-top tilt"><div class="card-body">
        <h3 class="h5 fw-bold text-accent">${esc(L(s, "stage"))}</h3><p class="small text-body-secondary mb-2">${esc(L(s, "period"))}</p><p class="small mb-0">${esc(L(s, "goal"))}</p>
      </div></div></div>`).join("");

    const ct = D.contact || {};
    $("#contact-email").textContent = ct.email ? "Email: " + ct.email : "";
    $("#gh-link").href = ct.github || "#"; $("#in-link").href = ct.linkedin || "#";
    reveal();
  }

  function applyLang() {
    root.lang = lang; $("#lang-select").value = lang;
    $$("[data-i18n]").forEach((el) => { const v = t(el.dataset.i18n); if (v) el.textContent = v; });
    renderAll();
  }
  $("#lang-select").addEventListener("change", (e) => { lang = TR[e.target.value] ? e.target.value : "en"; store.set("lang", lang); applyLang(); });
  applyLang();

  // ---------- Hero counters ----------
  const counts = { projects: (D.projects || []).length, activities: (D.activities || []).length, skills: (D.skills || []).reduce((a, g) => a + g.items.length, 0) };
  $$("[data-count]").forEach((el) => { const n = counts[el.dataset.count] || 0; let i = 0; (function s() { el.textContent = i; if (i < n) { i++; setTimeout(s, RM ? 0 : 80); } })(); });

  // ---------- Typing effect ----------
  const roles = ["Aspiring Robotics Scientist", "Embedded Systems Learner", "Future ROS 2 Developer"];
  const typing = $("#typing-text"); let r = 0, c = 0, del = false;
  (function type() {
    const w = roles[r]; c += del ? -1 : 1; typing.textContent = w.substring(0, c);
    let d = del ? 30 : 60;
    if (!del && c === w.length) { d = 2000; del = true; } else if (del && c === 0) { del = false; r = (r + 1) % roles.length; d = 300; }
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
      const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
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
  const term = $("#terminal-output");
  const logs = ["[ROS 2] /kinematics_node loop: 50 Hz", "[BMS] Cell balance OK. Pack: 12.38 V", "[INFO] Joint telemetry synchronized", "[WARN] Control loop latency spike", "[INFO] Node graph healthy"];
  setInterval(() => {
    if (document.hidden) return;
    const d = document.createElement("div"); d.textContent = "> " + logs[Math.floor(Math.random() * logs.length)];
    term.appendChild(d); while (term.children.length > 40) term.removeChild(term.firstChild); term.scrollTop = term.scrollHeight;
  }, 3000);
  setInterval(() => { $("#servo-bar").style.width = Math.random() * 30 + 50 + "%"; $("#power-bar").style.width = Math.random() * 15 + 80 + "%"; }, 2000);
});