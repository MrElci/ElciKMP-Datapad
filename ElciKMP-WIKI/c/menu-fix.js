/* ===========================================
   MENU-FIX.JS – V5 (Click Menu + Full Theme)
   =========================================== */
(function () {
  'use strict';

  const ZOOM_KEY = 'elcikmp_zoom';
  const THEME_KEY = 'elcikmp_theme';
  const ZOOM_MIN = 50, ZOOM_MAX = 200, ZOOM_STEP = 10, ZOOM_DEFAULT = 100;

  const THEMES = [
    { id: 'datapad',  name: 'Datapad Theme',   desc: 'GitHub Glass' },
    { id: 'halflife', name: 'Half-Life Theme', desc: 'Valve HL2 Terminal' }
  ];

  /* ===== ZOOM ===== */
  function getZoom() {
    const v = parseInt(localStorage.getItem(ZOOM_KEY), 10);
    return (isNaN(v) || v < ZOOM_MIN || v > ZOOM_MAX) ? ZOOM_DEFAULT : v;
  }
  function applyZoom(value) {
    value = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.round(value)));
    const factor = value / 100;
    if ('zoom' in document.documentElement.style || CSS.supports('zoom', '1')) {
      document.documentElement.style.zoom = factor;
    } else {
      document.body.style.transform = 'scale(' + factor + ')';
      document.body.style.transformOrigin = 'top left';
      document.body.style.width = (100 / factor) + '%';
    }
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

    // Dropdown'daki aktif işaretleri güncelle
    document.querySelectorAll('.theme-item').forEach(el => {
      el.classList.toggle('active', el.dataset.theme === themeId);
    });

    if (themeId === 'datapad') {
      // Datapad'a dönünce renk yeniden uygulanmalı
      document.documentElement.style.removeProperty('--accent-color');
      document.documentElement.style.removeProperty('--accent-glow');
      if (typeof window.applyAccentColor === 'function') {
        window.applyAccentColor();
      }
    } else {
      // Half-Life: accent rengini sabitle
      document.documentElement.style.setProperty('--accent-color', '#ff9c2e', 'important');
      document.documentElement.style.setProperty('--accent-glow', '0 0 12px rgba(255,156,46,0.6)', 'important');
    }
  }

  /* ===== DOSYA → MATERYAL ===== */
  function fixMenu() {
    document.querySelectorAll('.menu-bar > *').forEach(el => {
      if (el.dataset.__fixed === '1') return;
      const text = (el.textContent || '').trim();
      if (/^(dosya|file)$/i.test(text)) {
        el.dataset.__fixed = '1';
        el.textContent = 'Materyal';
        el.style.cursor = 'pointer';
        el.addEventListener('click', function (e) {
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
      const text = (el.textContent || '').trim();
      if (!/^görünüm$/i.test(text)) return;
      el.dataset.__viewFixed = '1';

      // Wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'view-menu-wrapper';
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
      el.classList.add('view-menu-trigger');

      // Dropdown
      const dd = document.createElement('div');
      dd.className = 'view-menu-dropdown';
      dd.innerHTML = `
        <div class="vm-row vm-zoom-row">
          <span class="vm-label">Ölçek</span>
          <div class="vm-zoom-controls">
            <button class="vm-zoom-btn" data-action="minus" type="button">−</button>
            <span class="zoom-value">${getZoom()}%</span>
            <button class="vm-zoom-btn" data-action="plus" type="button">+</button>
          </div>
        </div>
        <div class="vm-divider"></div>
        <div class="vm-row vm-theme-row">
          <span class="vm-label">Temalar</span>
          <button class="vm-theme-toggle" type="button" aria-label="Temaları aç/kapat">
            <span class="vm-arrow">▶</span>
          </button>
        </div>
        <div class="vm-theme-list" hidden>
          ${THEMES.map(t => `
            <button class="theme-item${t.id === getTheme() ? ' active' : ''}" data-theme="${t.id}" type="button">
              <span class="theme-dot">●</span>
              <span class="theme-text">
                <span class="theme-name">${t.name}</span>
                <span class="theme-desc">${t.desc}</span>
              </span>
            </button>
          `).join('')}
        </div>
      `;
      wrapper.appendChild(dd);

      const trigger = el;
      const themeToggle = dd.querySelector('.vm-theme-toggle');
      const themeList = dd.querySelector('.vm-theme-list');

      // Aç/Kapat (tıklama)
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = dd.classList.toggle('open');
        trigger.classList.toggle('active', isOpen);
      });

      // Dışarı tıklama
      document.addEventListener('click', function (e) {
        if (!wrapper.contains(e.target)) {
          dd.classList.remove('open');
          trigger.classList.remove('active');
        }
      });

      // Zoom buttons
      dd.querySelector('[data-action="minus"]').addEventListener('click', e => {
        e.stopPropagation(); applyZoom(getZoom() - ZOOM_STEP);
      });
      dd.querySelector('[data-action="plus"]').addEventListener('click', e => {
        e.stopPropagation(); applyZoom(getZoom() + ZOOM_STEP);
      });

      // Tema listesi toggle
      themeToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = themeList.hasAttribute('hidden');
        if (isOpen) {
          themeList.removeAttribute('hidden');
          themeToggle.querySelector('.vm-arrow').textContent = '▼';
        } else {
          themeList.setAttribute('hidden', '');
          themeToggle.querySelector('.vm-arrow').textContent = '▶';
        }
      });

      // Tema seçimi
      themeList.querySelectorAll('.theme-item').forEach(btn => {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          applyTheme(btn.dataset.theme);
          // Kapat
          dd.classList.remove('open');
          trigger.classList.remove('active');
        });
      });
    });
  }

  /* ===== ÇALIŞTIR ===== */
  function run() {
    fixMenu();
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