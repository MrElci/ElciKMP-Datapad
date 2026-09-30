/* ===========================================
   MENU-FIX.JS – V8 (JS-enjekte tema, garanti)
   =========================================== */
(function () {
  'use strict';

  const ZOOM_KEY = 'elcikmp_zoom';
  const THEME_KEY = 'elcikmp_theme';
  const ZOOM_STEP = 10, ZOOM_DEFAULT = 100;

  const THEMES = [
    { id: 'datapad',  name: 'Datapad Theme',   desc: 'GitHub Glass' },
    { id: 'halflife', name: 'Half-Life Theme', desc: 'Valve HL2' }
  ];

  /* ========== HALF-LIFE 2 STİLLERİ (JS ile enjekte) ========== */
  const HL2_CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap');

    body.theme-halflife {
      background-color: #0e1108 !important;
      background-image:
        linear-gradient(rgba(255,156,46,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,156,46,0.04) 1px, transparent 1px) !important;
      background-size: 40px 40px !important;
      color: #d4d0b4 !important;
    }
    body.theme-halflife *,
    body.theme-halflife *::before,
    body.theme-halflife *::after {
      font-family: 'Rajdhani', 'Segoe UI', Tahoma, sans-serif !important;
      border-radius: 0 !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
    }
    body.theme-halflife::after {
      background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%) !important;
      mix-blend-mode: normal !important;
      animation: none !important;
    }
    body.theme-halflife::before {
      background: radial-gradient(circle at 50% 0%, rgba(255,156,46,0.06), transparent 60%) !important;
      animation: none !important;
    }
    body.theme-halflife .app-window {
      background: #131608 !important;
      border: 2px solid #3a3d2e !important;
      border-top: 4px solid #ff9c2e !important;
      box-shadow: 0 0 60px rgba(255,156,46,0.1), inset 0 0 120px rgba(0,0,0,0.6) !important;
    }
    body.theme-halflife .title-bar {
      background: linear-gradient(180deg, #1e2214 0%, #0a0c06 100%) !important;
      border-bottom: 2px solid #ff9c2e !important;
      padding: 14px 20px !important;
    }
    body.theme-halflife .title-bar::after { display: none !important; }
    body.theme-halflife .title-bar-text {
      color: #ff9c2e !important;
      font-size: 17px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 4px !important;
      text-shadow: 0 0 12px rgba(255,156,46,0.6) !important;
    }
    body.theme-halflife .title-bar-text::before {
      content: "λ " !important;
      color: #ff9c2e !important;
      font-size: 22px !important;
      font-weight: 900 !important;
      margin-right: 8px !important;
      display: inline !important;
    }
    body.theme-halflife .window-buttons span {
      background: #3a3d2e !important;
      border: 1px solid #ff9c2e !important;
      box-shadow: none !important;
    }
    body.theme-halflife .menu-bar {
      background: #000 !important;
      border-bottom: 2px solid #3a3d2e !important;
      padding: 0 12px !important;
    }
    body.theme-halflife .menu-bar > * {
      color: #8a8672 !important;
      font-size: 13px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 3px !important;
      padding: 12px 20px !important;
      border-bottom: 3px solid transparent !important;
      background: transparent !important;
    }
    body.theme-halflife .menu-bar > *::before { display: none !important; content: none !important; }
    body.theme-halflife .menu-bar > *:hover {
      background: transparent !important;
      color: #ff9c2e !important;
      border-bottom-color: #ff9c2e !important;
      transform: none !important;
    }
    body.theme-halflife .menu-bar > *.active {
      color: #ff9c2e !important;
      border-bottom-color: #ff9c2e !important;
    }
    body.theme-halflife .toolbar {
      background: #0a0c06 !important;
      border-bottom: 2px solid #3a3d2e !important;
      padding: 10px 16px !important;
      gap: 4px !important;
    }
    body.theme-halflife .toolbar a {
      background: transparent !important;
      border: none !important;
      border-left: 3px solid transparent !important;
      color: #8a8672 !important;
      font-size: 14px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 2px !important;
      padding: 6px 16px !important;
      box-shadow: none !important;
    }
    body.theme-halflife .toolbar a::before,
    body.theme-halflife .toolbar a::after { content: none !important; display: none !important; }
    body.theme-halflife .toolbar a:hover {
      background: rgba(255,156,46,0.08) !important;
      color: #ff9c2e !important;
      border-left-color: #ff9c2e !important;
      transform: none !important;
      box-shadow: none !important;
    }
    body.theme-halflife .toolbar a.active {
      background: rgba(255,156,46,0.15) !important;
      color: #ff9c2e !important;
      border-left-color: #ff9c2e !important;
      box-shadow: none !important;
    }
    body.theme-halflife .sidebar {
      background: #000 !important;
      border-right: 3px solid #3a3d2e !important;
      padding: 20px 14px !important;
    }
    body.theme-halflife .sidebar-title {
      color: #ff9c2e !important;
      font-size: 14px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 3px !important;
      border-bottom: 2px solid #ff9c2e !important;
      padding: 10px 0 !important;
      margin-bottom: 16px !important;
      text-align: center !important;
    }
    body.theme-halflife .sidebar-title::before {
      content: "◤ " !important;
      color: #ff9c2e !important;
    }
    body.theme-halflife .sidebar ul { gap: 4px !important; }
    body.theme-halflife .sidebar li {
      background: #0a0c06 !important;
      border: 1px solid #3a3d2e !important;
      border-left: 4px solid #3a3d2e !important;
      color: #8a8672 !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
      letter-spacing: 1.5px !important;
      padding: 10px 14px !important;
      margin-bottom: 0 !important;
    }
    body.theme-halflife .sidebar li::before {
      content: "▸ " !important;
      color: #ff9c2e !important;
      opacity: 0.5 !important;
      margin-right: 4px !important;
      display: inline !important;
    }
    body.theme-halflife .sidebar li:hover {
      background: rgba(255,156,46,0.08) !important;
      border-color: #ff9c2e !important;
      border-left-color: #ff9c2e !important;
      color: #d4d0b4 !important;
      padding-left: 14px !important;
    }
    body.theme-halflife .sidebar li:hover::before { opacity: 1 !important; }
    body.theme-halflife .sidebar li.active {
      background: rgba(255,156,46,0.18) !important;
      border-color: #ff9c2e !important;
      border-left-color: #ff9c2e !important;
      color: #ff9c2e !important;
    }
    body.theme-halflife .content-pane {
      background: #0e1108 !important;
      padding: 40px 48px !important;
    }
    body.theme-halflife h1.article-title {
      color: #ff9c2e !important;
      font-size: 2.4rem !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 4px !important;
      border-bottom: 3px double #ff9c2e !important;
      padding: 0 0 18px 20px !important;
      margin-bottom: 24px !important;
      text-shadow: 0 0 20px rgba(255,156,46,0.5) !important;
      background: linear-gradient(90deg, rgba(255,156,46,0.08) 0%, transparent 100%) !important;
    }
    body.theme-halflife h1.article-title::before {
      content: "λ " !important;
      color: #ff9c2e !important;
      font-size: 2.6rem !important;
      font-weight: 900 !important;
      margin-right: 12px !important;
      text-shadow: 0 0 20px #ff9c2e !important;
    }
    body.theme-halflife h1.article-title::after {
      content: "▌" !important;
      color: #ff9c2e !important;
      font-size: 1.6rem !important;
      margin-left: 8px !important;
      animation: hl2blink 1.1s step-end infinite !important;
      opacity: 1 !important;
    }
    @keyframes hl2blink { 50% { opacity: 0; } }
    body.theme-halflife h2 {
      color: #ff9c2e !important;
      font-size: 1.5rem !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 3px !important;
      padding: 12px 18px !important;
      margin: 40px 0 20px !important;
      background: linear-gradient(90deg, #1e2214 0%, transparent 100%) !important;
      border-left: 5px solid #ff9c2e !important;
      border-top: none !important;
      border-bottom: none !important;
      box-shadow: inset 0 0 20px rgba(255,156,46,0.08) !important;
    }
    body.theme-halflife h2::before { content: none !important; }
    body.theme-halflife h3 {
      color: #d4d0b4 !important;
      font-size: 1.15rem !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 2px !important;
      border-left: 4px solid #a8c44c !important;
      padding-left: 16px !important;
      margin: 28px 0 12px !important;
    }
    body.theme-halflife p {
      font-size: 16px !important;
      line-height: 1.75 !important;
      color: #c4c0a4 !important;
    }
    body.theme-halflife a {
      color: #ff9c2e !important;
      font-weight: 600 !important;
      border-bottom: 1px dashed rgba(255,156,46,0.4) !important;
    }
    body.theme-halflife a:hover {
      color: #ffbb55 !important;
      text-shadow: 0 0 10px rgba(255,156,46,0.6) !important;
      border-bottom-style: solid !important;
    }
    body.theme-halflife .infobox,
    body.theme-halflife .warinfobox,
    body.theme-halflife .krono-box,
    body.theme-halflife .wiki-thumb,
    body.theme-halflife .rff-box {
      background: #131608 !important;
      border: 1px solid #3a3d2e !important;
      border-top: 5px solid #ff9c2e !important;
      box-shadow: 8px 8px 0 rgba(0,0,0,0.6) !important;
      padding: 16px !important;
    }
    body.theme-halflife .infobox::before,
    body.theme-halflife .infobox::after { content: none !important; display: none !important; }
    body.theme-halflife .infobox-title {
      color: #ff9c2e !important;
      font-size: 1.3rem !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 3px !important;
      border-bottom: 2px solid #ff9c2e !important;
      padding-bottom: 12px !important;
      margin-bottom: 14px !important;
    }
    body.theme-halflife .infobox-subtitle {
      color: #8a8672 !important;
      font-style: normal !important;
      text-transform: uppercase !important;
      letter-spacing: 1.5px !important;
      font-size: 12px !important;
    }
    body.theme-halflife .infobox-label {
      color: #ff9c2e !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 1.2px !important;
      font-size: 11px !important;
    }
    body.theme-halflife .infobox-value { color: #d4d0b4 !important; font-weight: 500 !important; }
    body.theme-halflife .infobox-row {
      border-bottom: 1px dashed #3a3d2e !important;
      padding: 8px 0 !important;
    }
    body.theme-halflife .flag-box {
      background: #000 !important;
      border: 1px solid #3a3d2e !important;
      padding: 6px !important;
    }
    body.theme-halflife .flag-label,
    body.theme-halflife .map-label {
      color: #ff9c2e !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 2px !important;
    }
    body.theme-halflife .infobox-map {
      background: #000 !important;
      border: 1px solid #3a3d2e !important;
      padding: 6px !important;
    }
    body.theme-halflife blockquote {
      background: #000 !important;
      border-left: 6px solid #ff9c2e !important;
      border-top: 1px solid #3a3d2e !important;
      border-bottom: 1px solid #3a3d2e !important;
      padding: 18px 24px !important;
      color: #d4d0b4 !important;
      font-style: normal !important;
      font-size: 15px !important;
    }
    body.theme-halflife blockquote::before {
      content: "❝" !important;
      color: #ff9c2e !important;
      font-size: 26px !important;
      top: 0 !important;
      left: 8px !important;
      opacity: 1 !important;
    }
    body.theme-halflife details {
      background: #0a0c06 !important;
      border: 1px solid #3a3d2e !important;
      margin: 16px 0 !important;
    }
    body.theme-halflife details[open] {
      border-color: #ff9c2e !important;
      box-shadow: 0 0 20px rgba(255,156,46,0.15) !important;
    }
    body.theme-halflife summary {
      background: linear-gradient(90deg, #1e2214 0%, #0a0c06 100%) !important;
      color: #ff9c2e !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 2.5px !important;
      padding: 14px 18px !important;
      font-size: 13px !important;
    }
    body.theme-halflife summary::before { content: "► " !important; color: #ff9c2e !important; }
    body.theme-halflife details[open] summary::before { content: "▼ " !important; transform: none !important; }
    body.theme-halflife .details-content {
      background: #000 !important;
      border-top: 1px solid #3a3d2e !important;
      padding: 18px 22px !important;
      color: #c4c0a4 !important;
    }
    body.theme-halflife .vid-button,
    body.theme-halflife .qa-button,
    body.theme-halflife .lightbox-download {
      background: #0a0c06 !important;
      border: 2px solid #ff9c2e !important;
      color: #ff9c2e !important;
      font-size: 14px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 2.5px !important;
      padding: 12px 24px !important;
      box-shadow: 6px 6px 0 rgba(255,156,46,0.2) !important;
      filter: none !important;
    }
    body.theme-halflife .vid-button:hover,
    body.theme-halflife .qa-button:hover,
    body.theme-halflife .lightbox-download:hover {
      background: #ff9c2e !important;
      color: #0a0c06 !important;
      box-shadow: 6px 6px 0 #ff9c2e, 0 0 30px rgba(255,156,46,0.6) !important;
      transform: translate(-2px, -2px) !important;
    }
    body.theme-halflife .vid-button::before {
      content: "▶ " !important;
      color: inherit !important;
      animation: none !important;
    }
    body.theme-halflife .players-table {
      background: #0a0c06 !important;
      border: 2px solid #3a3d2e !important;
    }
    body.theme-halflife .players-table th {
      background: linear-gradient(180deg, #1e2214 0%, #000 100%) !important;
      color: #ff9c2e !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 2.5px !important;
      border-bottom: 3px solid #ff9c2e !important;
      padding: 14px 18px !important;
      font-size: 13px !important;
    }
    body.theme-halflife .players-table td {
      color: #c4c0a4 !important;
      border-bottom: 1px solid #262a1c !important;
      padding: 12px 18px !important;
      font-size: 14px !important;
    }
    body.theme-halflife .players-table tr:hover td {
      background: rgba(255,156,46,0.08) !important;
    }
    body.theme-halflife .status-bar {
      background: #000 !important;
      border-top: 3px solid #ff9c2e !important;
      color: #ff9c2e !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 2.5px !important;
      font-size: 12px !important;
      padding: 10px 18px !important;
    }
    body.theme-halflife .status-bar::before { display: none !important; }
    body.theme-halflife .lightbox-window,
    body.theme-halflife .video-window {
      background: #131608 !important;
      border: 3px solid #ff9c2e !important;
      box-shadow: 0 0 80px rgba(255,156,46,0.3) !important;
    }
    body.theme-halflife .lightbox-title-bar,
    body.theme-halflife .video-title-bar {
      background: #000 !important;
      color: #ff9c2e !important;
      border-bottom: 2px solid #ff9c2e !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 2.5px !important;
    }
    body.theme-halflife .lightbox-close,
    body.theme-halflife .video-close {
      background: transparent !important;
      border: 2px solid #ff9c2e !important;
      color: #ff9c2e !important;
    }
    body.theme-halflife .lightbox-close:hover,
    body.theme-halflife .video-close:hover {
      background: #ff9c2e !important;
      color: #000 !important;
    }
    body.theme-halflife ::-webkit-scrollbar { width: 12px !important; }
    body.theme-halflife ::-webkit-scrollbar-track { background: #000 !important; }
    body.theme-halflife ::-webkit-scrollbar-thumb {
      background: #3a3d2e !important;
      border: 2px solid #000 !important;
    }
    body.theme-halflife ::-webkit-scrollbar-thumb:hover { background: #ff9c2e !important; }
  `;

  /* ========== TEMA STİLİNİ ENJEKTE ET ========== */
  function injectThemeStyles(themeId) {
    // Eski enjekte edilmiş stili kaldır
    const old = document.getElementById('__theme_inject');
    if (old) old.remove();

    if (themeId === 'halflife') {
      const style = document.createElement('style');
      style.id = '__theme_inject';
      style.textContent = HL2_CSS;
      document.head.appendChild(style);
      console.log('[theme] HL2 stilleri enjekte edildi.');
    } else {
      console.log('[theme] Datapad teması aktif.');
    }
  }

  /* ---- ZOOM ---- */
  function getZoom() {
    const v = parseInt(localStorage.getItem(ZOOM_KEY), 10);
    return isNaN(v) ? ZOOM_DEFAULT : v;
  }
  function applyZoom(value) {
    value = Math.max(50, Math.min(200, Math.round(value)));
    document.documentElement.style.zoom = (value / 100);
    localStorage.setItem(ZOOM_KEY, value);
    document.querySelectorAll('.zoom-value').forEach(el => el.textContent = value + '%');
  }

  /* ---- TEMA ---- */
  function getTheme() {
    const t = localStorage.getItem(THEME_KEY);
    return THEMES.some(x => x.id === t) ? t : 'datapad';
  }
  function applyTheme(themeId) {
    if (!THEMES.some(t => t.id === themeId)) themeId = 'datapad';
    document.documentElement.setAttribute('data-theme', themeId);
    document.body.classList.remove('theme-halflife', 'theme-datapad');
    document.body.classList.add('theme-' + themeId);
    localStorage.setItem(THEME_KEY, themeId);

    injectThemeStyles(themeId);

    // Accent renk kontrolü
    if (themeId === 'halflife') {
      document.documentElement.style.setProperty('--accent-color', '#ff9c2e', 'important');
      document.documentElement.style.setProperty('--accent-glow', '0 0 14px rgba(255,156,46,0.6)', 'important');
    } else {
      document.documentElement.style.removeProperty('--accent-color');
      document.documentElement.style.removeProperty('--accent-glow');
      if (typeof window.applyAccentColor === 'function') window.applyAccentColor();
    }

    document.querySelectorAll('.theme-item').forEach(el => {
      el.classList.toggle('active', el.dataset.theme === themeId);
    });

    console.log('[theme] Uygulandı:', themeId, '| body class:', document.body.className);
  }

  /* ---- MATERYAL ---- */
  function fixMaterial() {
    document.querySelectorAll('.menu-bar > *').forEach(el => {
      if (el.dataset.__matFixed === '1') return;
      const t = (el.textContent || '').trim();
      if (/^(dosya|file)$/i.test(t)) {
        el.dataset.__matFixed = '1';
        el.textContent = 'Materyal';
        el.style.cursor = 'pointer';
        el.addEventListener('click', e => {
          e.preventDefault(); e.stopPropagation();
          window.location.href = 'material.html';
        });
      }
    });
  }

  /* ---- GÖRÜNÜM MENÜSÜ ---- */
  function buildViewMenu() {
    document.querySelectorAll('.menu-bar > *').forEach(el => {
      if (el.dataset.__viewFixed === '1') return;
      const t = (el.textContent || '').trim();
      if (!/^görünüm$/i.test(t)) return;
      el.dataset.__viewFixed = '1';
      el.style.cursor = 'pointer';
      el.classList.add('view-trigger');

      const dd = document.createElement('div');
      dd.className = 'view-dropdown-fixed';
      dd.style.cssText = `
        position: fixed;
        display: none;
        min-width: 280px;
        background: #161b22;
        border: 1px solid #30363d;
        border-radius: 8px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.9), 0 0 0 1px rgba(88,166,255,0.15);
        padding: 10px;
        z-index: 2147483647;
        font-family: 'JetBrains Mono', monospace;
        opacity: 0;
        transition: opacity 0.15s ease;
        pointer-events: auto;
      `;
      dd.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;gap:12px;">
          <span style="font-size:12px;font-weight:600;color:#c9d1d9;text-transform:uppercase;letter-spacing:1px;">Ölçek</span>
          <div style="display:flex;align-items:center;gap:4px;">
            <button data-z="minus" style="width:28px;height:28px;background:#21262d;border:1px solid #30363d;border-radius:5px;color:#c9d1d9;cursor:pointer;font-size:15px;font-weight:700;padding:0;">−</button>
            <span class="zoom-value" style="min-width:56px;text-align:center;font-size:12px;font-weight:600;color:#58a6ff;background:rgba(0,0,0,0.4);border:1px solid #21262d;border-radius:5px;padding:5px 8px;">${getZoom()}%</span>
            <button data-z="plus" style="width:28px;height:28px;background:#21262d;border:1px solid #30363d;border-radius:5px;color:#c9d1d9;cursor:pointer;font-size:15px;font-weight:700;padding:0;">+</button>
          </div>
        </div>
        <div style="height:1px;background:#21262d;margin:6px 0;"></div>
        <div style="padding:4px 10px 2px;font-size:11px;font-weight:600;color:#8b949e;text-transform:uppercase;letter-spacing:1.2px;">Temalar</div>
        <div class="theme-list" style="display:flex;flex-direction:column;gap:4px;padding:4px 0;"></div>
      `;
      document.body.appendChild(dd);

      const themeList = dd.querySelector('.theme-list');
      THEMES.forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'theme-item';
        btn.dataset.theme = t.id;
        btn.style.cssText = `
          display:flex;align-items:center;gap:10px;padding:10px 12px;
          background:transparent;border:1px solid transparent;border-radius:6px;
          color:#8b949e;cursor:pointer;text-align:left;width:100%;
          font-family:inherit;font-size:12px;transition:all 0.15s ease;
        `;
        btn.innerHTML = `
          <span style="font-size:11px;color:#6e7681;">●</span>
          <span style="display:flex;flex-direction:column;gap:2px;flex:1;">
            <span style="font-weight:600;font-size:12px;color:inherit;">${t.name}</span>
            <span style="font-size:10px;opacity:0.7;">${t.desc}</span>
          </span>
        `;
        btn.addEventListener('click', e => {
          e.stopPropagation();
          applyTheme(btn.dataset.theme);
          refreshThemeStyles(themeList);
          closeMenu();
        });
        themeList.appendChild(btn);
      });

      function refreshThemeStyles(list) {
        const cur = getTheme();
        list.querySelectorAll('.theme-item').forEach(b => {
          if (b.dataset.theme === cur) {
            b.style.background = 'rgba(88,166,255,0.12)';
            b.style.borderColor = '#58a6ff';
            b.style.color = '#58a6ff';
            b.querySelector('span:first-child').style.color = '#58a6ff';
          } else {
            b.style.background = 'transparent';
            b.style.borderColor = 'transparent';
            b.style.color = '#8b949e';
            b.querySelector('span:first-child').style.color = '#6e7681';
          }
        });
      }
      refreshThemeStyles(themeList);

      dd.querySelector('[data-z="minus"]').addEventListener('click', e => {
        e.stopPropagation(); applyZoom(getZoom() - ZOOM_STEP);
      });
      dd.querySelector('[data-z="plus"]').addEventListener('click', e => {
        e.stopPropagation(); applyZoom(getZoom() + ZOOM_STEP);
      });

      let isOpen = false;
      function openMenu() {
        const r = el.getBoundingClientRect();
        dd.style.top = (r.bottom + 4) + 'px';
        dd.style.left = r.left + 'px';
        dd.style.display = 'block';
        requestAnimationFrame(() => { dd.style.opacity = '1'; });
        el.classList.add('active');
        el.style.color = '#58a6ff';
        isOpen = true;
      }
      function closeMenu() {
        dd.style.opacity = '0';
        el.classList.remove('active');
        el.style.color = '';
        isOpen = false;
        setTimeout(() => { if (!isOpen) dd.style.display = 'none'; }, 150);
      }

      el.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        isOpen ? closeMenu() : openMenu();
      });

      document.addEventListener('click', e => {
        if (!dd.contains(e.target) && e.target !== el) closeMenu();
      });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenu();
      });
      window.addEventListener('resize', () => { if (isOpen) openMenu(); });
    });
  }

  /* ---- BAŞLAT ---- */
  function run() {
    fixMaterial();
    buildViewMenu();
  }
  function init() {
    applyZoom(getZoom());
    applyTheme(getTheme());
    run();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener('load', run);

  window.applyZoom = applyZoom;
  window.applyTheme = applyTheme;
  window.getTheme = getTheme;
})();