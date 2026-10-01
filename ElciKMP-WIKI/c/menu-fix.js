/* ===========================================
   MENU-FIX.JS – V10 (Tam Çalışan Sürüm)
   - Dosya → Materyal
   - Görünüm dropdown (Ölçek + Tema)
   - Temalar harici CSS dosyalarından yüklenir
   =========================================== */
(function () {
  'use strict';

  /* ===== SABİTLER ===== */
  const ZOOM_KEY = 'elcikmp_zoom';
  const THEME_KEY = 'elcikmp_theme';
  const ZOOM_STEP = 10;
  const ZOOM_DEFAULT = 100;
  const ZOOM_MIN = 50;
  const ZOOM_MAX = 200;

  /* ===== TEMA KAYIT DEFTERİ ===== */
  const THEMES = [
    { id: 'datapad',  name: 'Datapad Teması',    desc: 'GitHub Glass',             file: null },
    { id: 'halflife', name: 'Half-Life Teması',  desc: 'Valve HL2 Terminal',       file: 'themes/halflife.css' },
    { id: 'matrix',   name: 'Matrix Teması',     desc: 'Digital Rain',             file: 'themes/matrix.css' },
    { id: 'winxp',    name: 'Windows XP Teması', desc: 'Eski Tip Win Teması',      file: 'themes/winxp.css' },
    { id: 'win11',    name: 'Windows 11 Teması', desc: 'Windows 11 Karanlık Tema', file: 'themes/win11.css' },
    { id: 'github',   name: 'GitHub Teması',     desc: 'Karanlık GitHub Teması',   file: 'themes/github.css' }
  ];
  /* ===== TEMA VARSAYILAN RENKLERİ ===== */
  const THEME_DEFAULTS = {
    datapad:     null,
    halflife:    '#ff9c2e',
    matrix:      '#00ff41',
    winxp:       '#0054e3',
    win11:       '#60cdff',
    github: '#58a6ff'
  };

  /* ===========================================
     ZOOM
     =========================================== */
  function getZoom() {
    const v = parseInt(localStorage.getItem(ZOOM_KEY), 10);
    return (isNaN(v) || v < ZOOM_MIN || v > ZOOM_MAX) ? ZOOM_DEFAULT : v;
  }
  function applyZoom(value) {
    value = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.round(value)));
    document.documentElement.style.zoom = (value / 100);
    localStorage.setItem(ZOOM_KEY, value);
    document.querySelectorAll('.zoom-value').forEach(el => el.textContent = value + '%');
  }

  /* ===========================================
     TEMA YÜKLEME
     =========================================== */
  function getTheme() {
    const t = localStorage.getItem(THEME_KEY);
    return THEMES.some(x => x.id === t) ? t : 'datapad';
  }

  function loadThemeFile(file) {
    const old = document.getElementById('__theme_link');
    if (old) old.remove();
    if (!file) return;
    const link = document.createElement('link');
    link.id = '__theme_link';
    link.rel = 'stylesheet';
    link.href = file;
    document.head.appendChild(link);
  }

  function applyTheme(themeId) {
    if (!THEMES.some(t => t.id === themeId)) themeId = 'datapad';

    // 1) Attribute + body class
    document.documentElement.setAttribute('data-theme', themeId);
    // Eski tema class'larını temizle
    THEMES.forEach(t => document.body.classList.remove('theme-' + t.id));
    document.body.classList.add('theme-' + themeId);

    // 2) localStorage
    localStorage.setItem(THEME_KEY, themeId);

    // 3) Harici CSS dosyasını yükle
    const theme = THEMES.find(t => t.id === themeId);
    loadThemeFile(theme ? theme.file : null);

    // 4) Accent renk
    const defColor = THEME_DEFAULTS[themeId];
    if (defColor) {
      document.documentElement.style.setProperty('--accent-color', defColor, 'important');
      document.documentElement.style.setProperty('--accent-glow', '0 0 12px ' + defColor, 'important');
    } else {
      document.documentElement.style.removeProperty('--accent-color');
      document.documentElement.style.removeProperty('--accent-glow');
    }

    // 5) Başlıktaki özel renk kodu varsa üstüne uygula
    if (typeof window.applyAccentColor === 'function') {
      window.applyAccentColor();
    }

    // 6) UI güncelle
    document.querySelectorAll('.theme-item').forEach(el => {
      el.classList.toggle('active', el.dataset.theme === themeId);
    });

    console.log('[theme]', themeId, '| file:', theme ? theme.file : 'default');
  }

  /* ===========================================
     DOSYA → MATERYAL
     =========================================== */
  function fixMaterial() {
    document.querySelectorAll('.menu-bar > *').forEach(el => {
      if (el.dataset.__matFixed === '1') return;
      const t = (el.textContent || '').trim();
      if (/^(dosya|file)$/i.test(t)) {
        el.dataset.__matFixed = '1';
        el.textContent = 'Materyal';
        el.style.cursor = 'pointer';
        el.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = 'material.html';
        });
      }
    });
  }

  /* ===========================================
     GÖRÜNÜM MENÜSÜ
     =========================================== */
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
        <div class="theme-list" style="display:flex;flex-direction:column;gap:4px;padding:4px 0;max-height:340px;overflow-y:auto;"></div>
      `;
      document.body.appendChild(dd);

      // Tema listesi
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
          <span class="theme-dot" style="font-size:11px;color:#6e7681;">●</span>
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
          const dot = b.querySelector('.theme-dot');
          if (b.dataset.theme === cur) {
            b.style.background = 'rgba(88,166,255,0.12)';
            b.style.borderColor = '#58a6ff';
            b.style.color = '#58a6ff';
            if (dot) dot.style.color = '#58a6ff';
          } else {
            b.style.background = 'transparent';
            b.style.borderColor = 'transparent';
            b.style.color = '#8b949e';
            if (dot) dot.style.color = '#6e7681';
          }
        });
      }
      refreshThemeStyles(themeList);

      // Zoom butonları
      dd.querySelector('[data-z="minus"]').addEventListener('click', e => {
        e.stopPropagation();
        applyZoom(getZoom() - ZOOM_STEP);
      });
      dd.querySelector('[data-z="plus"]').addEventListener('click', e => {
        e.stopPropagation();
        applyZoom(getZoom() + ZOOM_STEP);
      });

      /* ---- AÇ / KAPAT ---- */
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
        e.preventDefault();
        e.stopPropagation();
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

  /* ===========================================
     ÇALIŞTIR
     =========================================== */
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