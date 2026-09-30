/* ===========================================
   MENU-FIX.JS – V7 (Fixed Position Dropdown)
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

    // Her yere yaz
    document.documentElement.setAttribute('data-theme', themeId);
    document.body.classList.remove('theme-halflife', 'theme-datapad');
    document.body.classList.add('theme-' + themeId);
    localStorage.setItem(THEME_KEY, themeId);

    // Accent rengini sabitle / temizle
    if (themeId === 'halflife') {
      document.documentElement.style.setProperty('--accent-color', '#ff9c2e', 'important');
      document.documentElement.style.setProperty('--accent-glow', '0 0 14px rgba(255,156,46,0.6)', 'important');
    } else {
      document.documentElement.style.removeProperty('--accent-color');
      document.documentElement.style.removeProperty('--accent-glow');
      if (typeof window.applyAccentColor === 'function') window.applyAccentColor();
    }

    // Aktif tema işaretini güncelle
    document.querySelectorAll('.theme-item').forEach(el => {
      el.classList.toggle('active', el.dataset.theme === themeId);
    });

    console.log('[theme] Uygulandı:', themeId);
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

      // Body'ye eklenen dropdown (fixed position)
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

      // Tema listesini doldur
      const themeList = dd.querySelector('.theme-list');
      THEMES.forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'theme-item' + (t.id === getTheme() ? ' active' : '');
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
        btn.addEventListener('mouseenter', () => {
          if (!btn.classList.contains('active')) {
            btn.style.background = '#21262d';
            btn.style.borderColor = '#30363d';
            btn.style.color = '#c9d1d9';
          }
        });
        btn.addEventListener('mouseleave', () => {
          if (!btn.classList.contains('active')) {
            btn.style.background = 'transparent';
            btn.style.borderColor = 'transparent';
            btn.style.color = '#8b949e';
          }
        });
        btn.addEventListener('click', e => {
          e.stopPropagation();
          applyTheme(btn.dataset.theme);
          refreshThemeStyles(themeList);
          closeMenu();
        });
        themeList.appendChild(btn);
      });

      function refreshThemeStyles(list) {
        list.querySelectorAll('.theme-item').forEach(b => {
          if (b.dataset.theme === getTheme()) {
            b.classList.add('active');
            b.style.background = 'rgba(88,166,255,0.12)';
            b.style.borderColor = '#58a6ff';
            b.style.color = '#58a6ff';
            b.querySelector('.theme-dot').style.color = '#58a6ff';
          } else {
            b.classList.remove('active');
            b.style.background = 'transparent';
            b.style.borderColor = 'transparent';
            b.style.color = '#8b949e';
            b.querySelector('.theme-dot').style.color = '#6e7681';
          }
        });
      }
      refreshThemeStyles(themeList);

      // Zoom butonları
      dd.querySelector('[data-z="minus"]').addEventListener('click', e => {
        e.stopPropagation(); applyZoom(getZoom() - ZOOM_STEP);
      });
      dd.querySelector('[data-z="plus"]').addEventListener('click', e => {
        e.stopPropagation(); applyZoom(getZoom() + ZOOM_STEP);
      });

      /* ---- AÇ / KAPAT ---- */
      let isOpen = false;
      function openMenu() {
        // Tetikleyicinin altına konumlandır
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

      // Dışına tıklama
      document.addEventListener('click', e => {
        if (!dd.contains(e.target) && e.target !== el) closeMenu();
      });

      // ESC
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenu();
      });

      // Scroll / resize: konumu güncelle
      window.addEventListener('resize', () => { if (isOpen) openMenu(); });
      window.addEventListener('scroll', () => { if (isOpen) closeMenu(); }, true);
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
  setTimeout(run, 500);

  window.applyZoom = applyZoom;
  window.applyTheme = applyTheme;
  window.getTheme = getTheme;
})();