/* ===========================================
   MENU-FIX.JS – V6 (Garantili Görünüm Menüsü)
   =========================================== */
(function () {
  'use strict';

  const ZOOM_KEY = 'elcikmp_zoom';
  const THEME_KEY = 'elcikmp_theme';
  const ZOOM_MIN = 50, ZOOM_MAX = 200, ZOOM_STEP = 10, ZOOM_DEFAULT = 100;

  const THEMES = [
    { id: 'datapad',  name: 'Datapad Theme',   desc: 'GitHub Glass' },
    { id: 'halflife', name: 'Half-Life Theme', desc: 'Valve HL2' }
  ];

  /* ===== ZOOM ===== */
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

  /* ===== TEMA ===== */
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

    document.querySelectorAll('.theme-item').forEach(el => {
      el.classList.toggle('active', el.dataset.theme === themeId);
    });

    if (themeId === 'halflife') {
      document.documentElement.style.setProperty('--accent-color', '#ff9c2e', 'important');
      document.documentElement.style.setProperty('--accent-glow', '0 0 14px rgba(255,156,46,0.6)', 'important');
    } else {
      document.documentElement.style.removeProperty('--accent-color');
      document.documentElement.style.removeProperty('--accent-glow');
      if (typeof window.applyAccentColor === 'function') window.applyAccentColor();
    }
  }

  /* ===== MATERYAL ===== */
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

  /* ===== GÖRÜNÜM MENÜSÜ ===== */
  function buildViewMenu() {
    document.querySelectorAll('.menu-bar > *').forEach(el => {
      if (el.dataset.__viewFixed === '1') return;
      const t = (el.textContent || '').trim();
      if (!/^görünüm$/i.test(t)) return;
      el.dataset.__viewFixed = '1';

      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.display = 'inline-block';
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
      el.classList.add('view-trigger');
      el.style.cursor = 'pointer';

      const dd = document.createElement('div');
      dd.className = 'view-dropdown';
      // KRİTİK: Inline style ile başlangıçta GİZLİ
      dd.style.position = 'absolute';
      dd.style.top = 'calc(100% + 4px)';
      dd.style.left = '0';
      dd.style.minWidth = '270px';
      dd.style.background = '#161b22';
      dd.style.border = '1px solid #30363d';
      dd.style.borderRadius = '8px';
      dd.style.boxShadow = '0 20px 50px rgba(0,0,0,0.85), 0 0 0 1px rgba(88,166,255,0.1)';
      dd.style.padding = '8px';
      dd.style.zIndex = '999999';
      dd.style.display = 'none';        // ← KAPALI
      dd.style.opacity = '0';
      dd.style.transition = 'opacity 0.15s ease';
      dd.style.fontFamily = "'JetBrains Mono', monospace";

      dd.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;gap:12px;">
          <span style="font-size:12px;font-weight:600;color:#c9d1d9;text-transform:uppercase;letter-spacing:1px;">Ölçek</span>
          <div style="display:flex;align-items:center;gap:4px;">
            <button data-action="minus" style="width:26px;height:26px;background:#21262d;border:1px solid #30363d;border-radius:5px;color:#c9d1d9;cursor:pointer;font-size:15px;font-weight:700;line-height:1;padding:0;">−</button>
            <span class="zoom-value" style="min-width:50px;text-align:center;font-size:12px;font-weight:600;color:#58a6ff;background:rgba(0,0,0,0.4);border:1px solid #21262d;border-radius:5px;padding:4px 6px;">${getZoom()}%</span>
            <button data-action="plus" style="width:26px;height:26px;background:#21262d;border:1px solid #30363d;border-radius:5px;color:#c9d1d9;cursor:pointer;font-size:15px;font-weight:700;line-height:1;padding:0;">+</button>
          </div>
        </div>
        <div style="height:1px;background:#21262d;margin:4px 0;"></div>
        <div style="padding:6px 10px;">
          <div style="font-size:12px;font-weight:600;color:#c9d1d9;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Temalar</div>
          <div class="theme-list-inner" style="display:flex;flex-direction:column;gap:4px;">
            ${THEMES.map(t => `
              <button class="theme-item${t.id === getTheme() ? ' active' : ''}" data-theme="${t.id}"
                style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:transparent;border:1px solid transparent;border-radius:6px;color:#8b949e;cursor:pointer;text-align:left;width:100%;font-family:inherit;font-size:12px;transition:all 0.15s ease;">
                <span style="font-size:10px;color:#6e7681;">●</span>
                <span style="display:flex;flex-direction:column;gap:1px;flex:1;">
                  <span style="font-weight:600;font-size:12px;">${t.name}</span>
                  <span style="font-size:10px;opacity:0.7;">${t.desc}</span>
                </span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
      wrapper.appendChild(dd);

      // Aç/Kapat
      let isOpen = false;
      function toggleMenu(show) {
        isOpen = show !== undefined ? show : !isOpen;
        if (isOpen) {
          dd.style.display = 'block';
          requestAnimationFrame(() => { dd.style.opacity = '1'; });
          el.style.color = '#58a6ff';
        } else {
          dd.style.opacity = '0';
          setTimeout(() => { if (!isOpen) dd.style.display = 'none'; }, 150);
          el.style.color = '';
        }
      }

      el.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        toggleMenu();
      });

      // Dışarı tıklama
      document.addEventListener('click', e => {
        if (!wrapper.contains(e.target)) toggleMenu(false);
      });

      // ESC
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') toggleMenu(false);
      });

      // Zoom butonları
      dd.querySelector('[data-action="minus"]').addEventListener('click', e => {
        e.stopPropagation(); applyZoom(getZoom() - ZOOM_STEP);
      });
      dd.querySelector('[data-action="plus"]').addEventListener('click', e => {
        e.stopPropagation(); applyZoom(getZoom() + ZOOM_STEP);
      });

      // Tema seçimi
      dd.querySelectorAll('.theme-item').forEach(btn => {
        // Hover stili inline
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
          // Aktif olanları güncelle
          dd.querySelectorAll('.theme-item').forEach(b => {
            if (b === btn) {
              b.classList.add('active');
              b.style.background = 'rgba(88,166,255,0.12)';
              b.style.borderColor = '#58a6ff';
              b.style.color = '#58a6ff';
              b.querySelector('span:first-child').style.color = '#58a6ff';
            } else {
              b.classList.remove('active');
              b.style.background = 'transparent';
              b.style.borderColor = 'transparent';
              b.style.color = '#8b949e';
              b.querySelector('span:first-child').style.color = '#6e7681';
            }
          });
          toggleMenu(false);
        });
      });

      // Aktif tema başlangıç stili
      dd.querySelectorAll('.theme-item.active').forEach(b => {
        b.style.background = 'rgba(88,166,255,0.12)';
        b.style.borderColor = '#58a6ff';
        b.style.color = '#58a6ff';
        b.querySelector('span:first-child').style.color = '#58a6ff';
      });
    });
  }

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
  setTimeout(run, 400);
  setTimeout(run, 1500);

  if (typeof MutationObserver !== 'undefined') {
    const ob = new MutationObserver(run);
    document.addEventListener('DOMContentLoaded', () => {
      ob.observe(document.body, { childList: true, subtree: true });
    });
  }

  window.applyZoom = applyZoom;
  window.applyTheme = applyTheme;
  window.getTheme = getTheme;
})();