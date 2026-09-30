/* ===========================================
   MENU-FIX.JS – V4 (Garantili Dropdown + Tema)
   =========================================== */
(function () {
  'use strict';

  /* ===== SABİTLER ===== */
  const ZOOM_KEY = 'elcikmp_zoom';
  const THEME_KEY = 'elcikmp_theme';
  const ZOOM_MIN = 50, ZOOM_MAX = 200, ZOOM_STEP = 10, ZOOM_DEFAULT = 100;
  const ZOOM_PRESETS = [75, 90, 100, 110, 125, 150];

  const THEMES = [
    { id: 'datapad',  name: 'Datapad Theme',   desc: 'Varsayılan GitHub Glass' },
    { id: 'halflife', name: 'Half-Life Theme', desc: 'Valve HL2 Grim Terminal' }
  ];

  /* ===== ZOOM ===== */
  function getZoom() {
    const v = parseInt(localStorage.getItem(ZOOM_KEY), 10);
    return (isNaN(v) || v < ZOOM_MIN || v > ZOOM_MAX) ? ZOOM_DEFAULT : v;
  }
  function applyZoom(value) {
    value = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.round(value)));
    const factor = value / 100;
    const root = document.documentElement;
    if ('zoom' in root.style || CSS.supports('zoom', '1')) {
      root.style.zoom = factor;
    } else {
      document.body.style.transform = 'scale(' + factor + ')';
      document.body.style.transformOrigin = 'top left';
      document.body.style.width = (100 / factor) + '%';
    }
    localStorage.setItem(ZOOM_KEY, value);
    document.querySelectorAll('.zoom-display').forEach(el => el.textContent = value + '%');
    document.querySelectorAll('.zoom-preset').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.zoom, 10) === value);
    });
  }

  /* ===== TEMA ===== */
  function getTheme() {
    const t = localStorage.getItem(THEME_KEY);
    return THEMES.some(x => x.id === t) ? t : 'datapad';
  }
  function applyTheme(themeId) {
    if (!THEMES.some(t => t.id === themeId)) themeId = 'datapad';
    // Hem html hem body üzerine yaz – garanti
    document.documentElement.setAttribute('data-theme', themeId);
    document.body.classList.remove('theme-halflife', 'theme-datapad');
    document.body.classList.add('theme-' + themeId);

    localStorage.setItem(THEME_KEY, themeId);

    document.querySelectorAll('.theme-option').forEach(el => {
      const isActive = el.dataset.theme === themeId;
      el.classList.toggle('active', isActive);
      const check = el.querySelector('.theme-check');
      if (check) check.textContent = isActive ? '▣' : '▢';
    });

    // Datapad'a dönünce accent rengi tekrar uygula
    if (themeId === 'datapad') {
      if (typeof window.applyAccentColor === 'function') {
        window.applyAccentColor();
      }
    }
  }

  /* ===== ACCENT OVERRIDE (Half-Life iken rengi sabitle) ===== */
  function overrideAccentColorForTheme() {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'halflife') {
      document.documentElement.style.setProperty('--accent-color', '#ff9c2e', 'important');
      document.documentElement.style.setProperty('--accent-glow', '0 0 10px rgba(255,156,46,0.55)', 'important');
    }
  }

  /* ===== DOSYA → MATERYAL ===== */
  function fixMenu() {
    const selectors = ['.menu-bar > *', '.menu-bar span', '.menu-bar a', '.menu-bar li', '.menu-bar div'];
    let fixed = false;
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (el.dataset.__fixed === '1') return;
        const text = (el.textContent || '').trim();
        if (/^(dosya|file)$/i.test(text)) {
          el.dataset.__fixed = '1';
          el.textContent = 'Materyal';
          el.style.cursor = 'pointer';
          el.onclick = function (e) {
            e.preventDefault(); e.stopPropagation();
            window.location.href = 'material.html';
          };
          el.addEventListener('click', function (e) {
            e.preventDefault(); e.stopPropagation();
            window.location.href = 'material.html';
          });
          fixed = true;
        }
      });
    });
    return fixed;
  }

  /* ===== GÖRÜNÜM DROPDOWN ===== */
  function buildViewDropdown() {
    document.querySelectorAll('.menu-bar > *').forEach(el => {
      if (el.dataset.__viewFixed === '1') return;
      const text = (el.textContent || '').trim();
      if (!/^görünüm$/i.test(text)) return;

      el.dataset.__viewFixed = '1';

      const wrapper = document.createElement('div');
      wrapper.className = 'menu-dropdown-wrapper';
      // INLINE POSITION GUARANTEE
      wrapper.style.position = 'relative';
      wrapper.style.display = 'inline-block';
      wrapper.style.zIndex = '90000';

      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
      el.classList.add('menu-dropdown-trigger');
      el.style.cursor = 'pointer';

      const currentTheme = getTheme();

      const dropdown = document.createElement('div');
      dropdown.className = 'menu-dropdown-content';
      // INLINE POSITION GUARANTEE
      dropdown.style.position = 'absolute';
      dropdown.style.top = 'calc(100% + 6px)';
      dropdown.style.left = '0';
      dropdown.style.minWidth = '250px';
      dropdown.style.zIndex = '90001';
      dropdown.style.pointerEvents = 'auto';
      dropdown.style.visibility = 'hidden';
      dropdown.style.opacity = '0';
      dropdown.style.transition = 'opacity 0.15s ease, transform 0.15s ease, visibility 0.15s';
      dropdown.style.transform = 'translateY(-6px)';

      dropdown.innerHTML =
        '<div class="dropdown-section">' +
          '<div class="dropdown-section-title">' +
            '<span class="section-icon">▤</span> Ölçek' +
          '</div>' +
          '<div class="dropdown-section-body">' +
            '<div class="zoom-controls">' +
              '<button class="zoom-btn zoom-out" title="Küçült" type="button">−</button>' +
              '<div class="zoom-display">' + getZoom() + '%</div>' +
              '<button class="zoom-btn zoom-in" title="Büyüt" type="button">+</button>' +
            '</div>' +
            '<div class="zoom-presets">' +
              ZOOM_PRESETS.map(z =>
                '<button class="zoom-preset" data-zoom="' + z + '" type="button">' + z + '%</button>'
              ).join('') +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="dropdown-section">' +
          '<div class="dropdown-section-title">' +
            '<span class="section-icon">◈</span> Tema' +
          '</div>' +
          '<div class="dropdown-section-body">' +
            '<div class="theme-list">' +
              THEMES.map(t =>
                '<button class="theme-option' + (t.id === currentTheme ? ' active' : '') + '" data-theme="' + t.id + '" type="button">' +
                  '<span class="theme-check">' + (t.id === currentTheme ? '▣' : '▢') + '</span>' +
                  '<span class="theme-info">' +
                    '<span class="theme-name">' + t.name + '</span>' +
                    '<span class="theme-desc">' + t.desc + '</span>' +
                  '</span>' +
                '</button>'
              ).join('') +
            '</div>' +
          '</div>' +
        '</div>';
      wrapper.appendChild(dropdown);

      /* ===== HOVER İLE AÇ/KAPAT ===== */
      let hideTimer = null;
      function showDropdown() {
        if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
        dropdown.style.visibility = 'visible';
        dropdown.style.opacity = '1';
        dropdown.style.transform = 'translateY(0)';
      }
      function scheduleHide() {
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
          dropdown.style.opacity = '0';
          dropdown.style.transform = 'translateY(-6px)';
          setTimeout(() => {
            if (dropdown.style.opacity === '0') dropdown.style.visibility = 'hidden';
          }, 200);
        }, 180);
      }

      wrapper.addEventListener('mouseenter', showDropdown);
      wrapper.addEventListener('mouseleave', scheduleHide);
      // Dropdown'a girince hide timer'ı iptal et
      dropdown.addEventListener('mouseenter', showDropdown);
      dropdown.addEventListener('mouseleave', scheduleHide);

      // Mobil: tıklama
      if (window.matchMedia('(hover: none)').matches) {
        el.addEventListener('click', function (e) {
          e.preventDefault(); e.stopPropagation();
          const isOpen = wrapper.classList.toggle('open');
          if (isOpen) showDropdown(); else scheduleHide();
        });
      }

      // Zoom olayları
      dropdown.querySelector('.zoom-out').addEventListener('click', function (e) {
        e.stopPropagation(); applyZoom(getZoom() - ZOOM_STEP);
      });
      dropdown.querySelector('.zoom-in').addEventListener('click', function (e) {
        e.stopPropagation(); applyZoom(getZoom() + ZOOM_STEP);
      });
      dropdown.querySelectorAll('.zoom-preset').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation(); applyZoom(parseInt(btn.dataset.zoom, 10));
        });
      });

      // Tema olayları
      dropdown.querySelectorAll('.theme-option').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          applyTheme(btn.dataset.theme);
          overrideAccentColorForTheme();
        });
      });
    });
  }

  /* ===== KLAVYE ===== */
  function bindZoomShortcuts() {
    if (window.__zoomShortcutsBound) return;
    window.__zoomShortcutsBound = true;
    document.addEventListener('keydown', function (e) {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === '+' || e.key === '=') {
        e.preventDefault(); applyZoom(getZoom() + ZOOM_STEP);
      } else if (e.key === '-') {
        e.preventDefault(); applyZoom(getZoom() - ZOOM_STEP);
      } else if (e.key === '0') {
        e.preventDefault(); applyZoom(ZOOM_DEFAULT);
      }
    });
  }

  /* ===== ANA ÇALIŞTIR ===== */
  function run() {
    fixMenu();
    buildViewDropdown();
    bindZoomShortcuts();
    overrideAccentColorForTheme();
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

  window.addEventListener('load', function () {
    run();
    overrideAccentColorForTheme();
  });
  setTimeout(run, 300);
  setTimeout(function () { run(); overrideAccentColorForTheme(); }, 1200);

  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function () { run(); });
    document.addEventListener('DOMContentLoaded', function () {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  window.fixMenuDosya = fixMenu;
  window.applyZoom = applyZoom;
  window.getZoom = getZoom;
  window.applyTheme = applyTheme;
  window.getTheme = getTheme;
})();