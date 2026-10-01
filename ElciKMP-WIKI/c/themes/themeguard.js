/* ===========================================
   THEME-GUARD.JS – V2 (Otomatik Overlap FIX)
   - Float çakışmalarını tespit eder
   - Otomatik clear uygular
   - Kutu taşmalarını düzeltir
   - Debug overlay ile görsel rapor
   =========================================== */
(function () {
  'use strict';

  const DEBUG = new URLSearchParams(location.search).has('theme-debug');
  const SCAN_DELAY = 200;

  /* ===== FLOAT GRUPLARI ===== */
  const FLOAT_RIGHT_SEL = '.wiki-thumb, .infobox, .warinfobox, .krono-box, .rff-right';
  const FLOAT_LEFT_SEL  = '.rff-left';

  const SCAN_SELECTORS = [
    '.app-window', '.title-bar', '.menu-bar', '.toolbar',
    '.sidebar', '.content-pane', '.status-bar',
    '.infobox', '.warinfobox', '.krono-box', '.wiki-thumb', '.rff-box',
    '.infobox-title', '.infobox-row', '.flag-box', '.infobox-map',
    '.players-table',
    'details', 'summary', '.details-content',
    'blockquote', 'h1.article-title', 'h2', 'h3',
    '.vid-button', '.qa-button', '.lightbox-download',
    '.view-dropdown-fixed', '.theme-item',
    '.xp-explorer', '.xp-tree', '.xp-preview-pane'
  ];

  /* ===========================================
     GEOMETRİK YARDIMCILAR
     =========================================== */
  function rectsOverlap(a, b, tolerance = 1) {
    return !(
      a.right <= b.left + tolerance ||
      b.right <= a.left + tolerance ||
      a.bottom <= b.top + tolerance ||
      b.bottom <= a.top + tolerance
    );
  }

  function area(r) { return Math.max(0, r.width) * Math.max(0, r.height); }

  function intersectionArea(a, b) {
    const left = Math.max(a.left, b.left);
    const right = Math.min(a.right, b.right);
    const top = Math.max(a.top, b.top);
    const bottom = Math.min(a.bottom, b.bottom);
    if (right <= left || bottom <= top) return 0;
    return (right - left) * (bottom - top);
  }

  function isVisible(el) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  /* ===========================================
     FLOAT ÇAKIŞMA TESPİTİ + OTOMATİK DÜZELTME
     =========================================== */
  function fixFloatOverlaps() {
    const fixes = [];

    // Aynı yöne float eden tüm elementleri al
    const floatRight = Array.from(document.querySelectorAll(FLOAT_RIGHT_SEL))
      .filter(isVisible)
      .map(el => ({ el, rect: el.getBoundingClientRect() }));

    const floatLeft = Array.from(document.querySelectorAll(FLOAT_LEFT_SEL))
      .filter(isVisible)
      .map(el => ({ el, rect: el.getBoundingClientRect() }));

    // Sağa float edenleri Y konumuna göre sırala
    floatRight.sort((a, b) => a.rect.top - b.rect.top);
    floatLeft.sort((a, b) => a.rect.top - b.rect.top);

    // Çakışma kontrolü – aynı yönde
    [floatRight, floatLeft].forEach(group => {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          const a = group[i], b = group[j];
          if (rectsOverlap(a.rect, b.rect, 2)) {
            // b, a ile çakışıyor → b'ye clear ver
            const dir = group === floatRight ? 'right' : 'left';
            b.el.style.setProperty('clear', dir, 'important');
            fixes.push({
              type: 'float-overlap',
              element: b.el,
              detail: `${b.el.className.split(' ')[0]} ile çakışıyor → clear: ${dir}`
            });
            // Yeniden hesapla
            b.rect = b.el.getBoundingClientRect();
          }
        }
      }
    });

    // Farklı yöndeki float'lar da çakışıyorsa (nadir)
    floatRight.forEach(r => {
      floatLeft.forEach(l => {
        if (rectsOverlap(r.rect, l.rect, 2)) {
          const overlap = intersectionArea(r.rect, l.rect);
          if (overlap > 500) {
            // Sağdaki daha büyük olduğu için soldakine clear ver
            l.el.style.setProperty('clear', 'left', 'important');
            fixes.push({
              type: 'float-cross-overlap',
              element: l.el,
              detail: `Sol ve sağ float çakışıyor (${Math.round(overlap)}px²) → clear: left`
            });
          }
        }
      });
    });

    return fixes;
  }

  /* ===========================================
     CONTENT OVERFLOW – Parent taşması
     =========================================== */
  function fixContentOverflow() {
    const fixes = [];

    // Infobox'lar parent'tan büyükse max-width sınırla
    document.querySelectorAll('.infobox, .warinfobox, .krono-box, .wiki-thumb').forEach(el => {
      if (!isVisible(el)) return;
      const parent = el.parentElement;
      if (!parent) return;
      const pRect = parent.getBoundingClientRect();
      const eRect = el.getBoundingClientRect();

      // Parent'ı aşan genişlik
      if (eRect.right > pRect.right + 2 && !parent.matches('.app-window, .content-pane')) {
        const overflow = eRect.right - pRect.right;
        if (overflow > 10) {
          // Parent'ın sağ kenarından taşıyor → max-width sınırla
          const maxW = Math.max(200, pRect.width - 40);
          if (eRect.width > maxW) {
            el.style.setProperty('max-width', maxW + 'px', 'important');
            fixes.push({
              type: 'width-overflow',
              element: el,
              detail: `Parent'tan ${Math.round(overflow)}px taşıyor → max-width: ${maxW}px`
            });
          }
        }
      }
    });

    // Inline genişlik / negative margin sıfırla
    document.querySelectorAll('.content-pane *').forEach(el => {
      const cs = getComputedStyle(el);
      const mt = parseFloat(cs.marginTop) || 0;
      const ml = parseFloat(cs.marginLeft) || 0;
      const mr = parseFloat(cs.marginRight) || 0;
      if (mt < -5 || ml < -5 || mr < -5) {
        el.style.setProperty('margin-top', Math.max(0, mt) + 'px', 'important');
        el.style.setProperty('margin-left', Math.max(0, ml) + 'px', 'important');
        el.style.setProperty('margin-right', Math.max(0, mr) + 'px', 'important');
        fixes.push({
          type: 'negative-margin',
          element: el,
          detail: `Negatif margin sıfırlandı`
        });
      }
    });

    return fixes;
  }

  /* ===========================================
     ABSOLUTE/FIXED ÇAKIŞMA
     =========================================== */
  function fixPositionedOverlaps() {
    const fixes = [];

    // Infobox'ların içindeki absolute elementler parent'ı aşmasın
    document.querySelectorAll('.infobox, .warinfobox, .wiki-thumb').forEach(el => {
      const cs = getComputedStyle(el);
      if (cs.position === 'absolute' || cs.position === 'fixed') {
        // Parent'a relative ekle
        const parent = el.parentElement;
        if (parent && getComputedStyle(parent).position === 'static') {
          parent.style.setProperty('position', 'relative', 'important');
          fixes.push({
            type: 'positioned-parent',
            element: parent,
            detail: 'Absolute child için parent relative yapıldı'
          });
        }
      }
    });

    return fixes;
  }

  /* ===========================================
     BORDER/OUTLINE ÇAKIŞMASI
     =========================================== */
  function fixBorderConflicts() {
    const fixes = [];
    document.querySelectorAll('.content-pane *').forEach(el => {
      if (!isVisible(el)) return;
      const cs = getComputedStyle(el);
      const bw = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
      const oW = parseFloat(cs.outlineWidth) || 0;

      // Hem border hem outline
      if (bw > 0 && oW > 0 && cs.outlineStyle !== 'none' && !el.matches(':focus, :focus-visible')) {
        el.style.setProperty('outline', 'none', 'important');
        fixes.push({
          type: 'border-outline-conflict',
          element: el,
          detail: 'Border + outline çakışması → outline kaldırıldı'
        });
      }

      // Şeffaf border (yer kaplıyor)
      if (bw > 0) {
        const colorTop = cs.borderTopColor;
        const isTransparent = colorTop === 'rgba(0, 0, 0, 0)' || colorTop === 'transparent';
        if (isTransparent && !el.matches('.wiki-thumb, .infobox')) {
          const colorLeft = cs.borderLeftColor;
          if (colorLeft === 'rgba(0, 0, 0, 0)' || colorLeft === 'transparent') {
            el.style.setProperty('border', 'none', 'important');
            fixes.push({
              type: 'invisible-border',
              element: el,
              detail: 'Şeffaf border kaldırıldı'
            });
          }
        }
      }
    });
    return fixes;
  }

  /* ===========================================
     ANA TARAMA VE DÜZELTME
     =========================================== */
  function runAllFixes() {
    const allFixes = [];
    try { allFixes.push(...fixFloatOverlaps()); } catch(e) { console.warn(e); }
    try { allFixes.push(...fixContentOverflow()); } catch(e) { console.warn(e); }
    try { allFixes.push(...fixPositionedOverlaps()); } catch(e) { console.warn(e); }
    try { allFixes.push(...fixBorderConflicts()); } catch(e) { console.warn(e); }
    return allFixes;
  }

  /* ===========================================
     DEBUG OVERLAY
     =========================================== */
  let debugOverlay = null;
  function clearDebug() {
    if (debugOverlay) { debugOverlay.remove(); debugOverlay = null; }
    document.querySelectorAll('[data-tg-mark]').forEach(el => {
      el.style.outline = el.dataset.tgOldOutline || '';
      el.style.outlineOffset = el.dataset.tgOldOffset || '';
      delete el.dataset.tgMark;
      delete el.dataset.tgOldOutline;
      delete el.dataset.tgOldOffset;
    });
  }

  function enableDebug(fixes) {
    clearDebug();

    debugOverlay = document.createElement('div');
    debugOverlay.id = 'theme-guard-overlay';
    debugOverlay.style.cssText = `
      position: fixed; top: 12px; right: 12px;
      background: #1e1e1e; color: #fff;
      border: 1px solid #4cc2ff;
      border-radius: 10px;
      padding: 14px 16px;
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 12px;
      z-index: 2147483647;
      max-height: 70vh;
      width: 320px;
      overflow-y: auto;
      box-shadow: 0 12px 40px rgba(0,0,0,0.7);
    `;

    const grouped = {};
    fixes.forEach(f => {
      grouped[f.type] = grouped[f.type] || [];
      grouped[f.type].push(f);
    });

    const theme = document.documentElement.getAttribute('data-theme') || 'datapad';

    debugOverlay.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <strong style="color:#4cc2ff;font-size:13px;">🛡 Theme Guard</strong>
        <button id="tg-close" style="background:transparent;border:none;color:#fff;font-size:16px;cursor:pointer;padding:0 4px;">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;padding:8px;background:#252525;border-radius:6px;">
        <div><span style="color:#9a9a9a;">Tema:</span><br><span style="color:#ffb454;font-weight:600;">${theme}</span></div>
        <div><span style="color:#9a9a9a;">Düzeltme:</span><br><span style="color:${fixes.length > 0 ? '#7ee787' : '#9a9a9a'};font-weight:600;">${fixes.length}</span></div>
      </div>
      <div style="display:flex;gap:6px;margin-bottom:10px;">
        <button id="tg-refix" style="flex:1;padding:6px;background:#4cc2ff;color:#000;border:none;border-radius:4px;font-weight:600;cursor:pointer;font-size:11px;">Yeniden Düzelt</button>
        <button id="tg-clear" style="flex:1;padding:6px;background:#333;color:#fff;border:1px solid #555;border-radius:4px;font-weight:600;cursor:pointer;font-size:11px;">Vurguları Sil</button>
      </div>
      <div id="tg-issues" style="border-top:1px solid #333;padding-top:10px;max-height:50vh;overflow-y:auto;"></div>
    `;
    document.body.appendChild(debugOverlay);

    const list = debugOverlay.querySelector('#tg-issues');
    if (fixes.length === 0) {
      list.innerHTML = '<div style="color:#7ee787;padding:12px 0;text-align:center;">✓ Çakışma bulunamadı</div>';
    } else {
      Object.entries(grouped).forEach(([type, items]) => {
        const typeHeader = document.createElement('div');
        typeHeader.style.cssText = 'color:#ffb454;font-weight:700;margin:10px 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;';
        typeHeader.textContent = `${type} (${items.length})`;
        list.appendChild(typeHeader);

        items.slice(0, 30).forEach(fix => {
          const item = document.createElement('div');
          item.style.cssText = 'padding:6px 8px;margin-bottom:4px;background:#252525;border-radius:4px;cursor:pointer;border-left:2px solid #4cc2ff;';
          const el = fix.element;
          const tag = el.tagName.toLowerCase();
          const cls = (el.className || '').toString().split(' ').filter(c => c && !c.startsWith('theme-')).slice(0, 2).join('.');
          item.innerHTML = `
            <div style="color:#60cdff;font-size:10px;font-weight:600;margin-bottom:2px;">&lt;${tag}${cls ? '.' + cls : ''}&gt;</div>
            <div style="color:#c5c5c5;font-size:11px;">${fix.detail}</div>
          `;
          item.addEventListener('click', () => {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const oldOutline = el.style.outline;
            const oldOffset = el.style.outlineOffset;
            el.style.outline = '3px solid #f85149';
            el.style.outlineOffset = '2px';
            setTimeout(() => {
              el.style.outline = oldOutline;
              el.style.outlineOffset = oldOffset;
            }, 2000);
          });
          item.addEventListener('mouseenter', () => {
            el.dataset.tgMark = '1';
            el.dataset.tgOldOutline = el.style.outline;
            el.dataset.tgOldOffset = el.style.outlineOffset;
            el.style.outline = '2px dashed #4cc2ff';
            el.style.outlineOffset = '2px';
          });
          item.addEventListener('mouseleave', () => {
            if (el.dataset.tgMark) {
              el.style.outline = el.dataset.tgOldOutline || '';
              el.style.outlineOffset = el.dataset.tgOldOffset || '';
              delete el.dataset.tgMark;
            }
          });
          list.appendChild(item);
        });

        if (items.length > 30) {
          const more = document.createElement('div');
          more.style.cssText = 'color:#9a9a9a;font-size:10px;padding:4px;';
          more.textContent = `... ve ${items.length - 30} tane daha`;
          list.appendChild(more);
        }
      });
    }

    debugOverlay.querySelector('#tg-close').onclick = () => {
      clearDebug();
      const url = new URL(location.href);
      url.searchParams.delete('theme-debug');
      history.replaceState(null, '', url);
    };
    debugOverlay.querySelector('#tg-refix').onclick = () => {
      const newFixes = runAllFixes();
      console.log(`[theme-guard] ${newFixes.length} ek düzeltme`);
      enableDebug(newFixes);
    };
    debugOverlay.querySelector('#tg-clear').onclick = clearDebug;
  }

  /* ===========================================
     ANA ÇALIŞTIRICI
     =========================================== */
  let scanTimer = null;
  function run() {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(() => {
      const fixes = runAllFixes();

      if (fixes.length > 0) {
        console.log(
          `%c[theme-guard] %c${fixes.length} çakışma düzeltildi.`,
          'background:#7ee787;color:#000;padding:2px 8px;border-radius:3px;font-weight:bold',
          'color:#7ee787'
        );
        // Grup özeti
        const grouped = {};
        fixes.forEach(f => grouped[f.type] = (grouped[f.type] || 0) + 1);
        Object.entries(grouped).forEach(([t, c]) => {
          console.log(`  ${t}: ${c}`);
        });
      } else {
        console.log('%c[theme-guard] ✓ Çakışma yok.', 'color:#7ee787');
      }

      if (DEBUG) enableDebug(fixes);
    }, SCAN_DELAY);
  }

  /* İzleyiciler */
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      if (m.type === 'attributes' &&
         (m.attributeName === 'data-theme' || m.attributeName === 'class')) {
        run();
      }
      if (m.type === 'childList' && m.addedNodes.length > 0) {
        // Yeni içerik yüklendiğinde tekrar tara
        setTimeout(run, 400);
      }
    });
  });

  function init() {
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true });

    // Tema CSS yüklendiğinde de tara
    const linkObserver = new MutationObserver(muts => {
      muts.forEach(m => {
        m.addedNodes.forEach(n => {
          if (n.tagName === 'LINK' && n.id === '__theme_link') {
            n.addEventListener('load', () => setTimeout(run, 100));
          }
        });
      });
    });
    linkObserver.observe(document.head, { childList: true });

    run();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('load', () => setTimeout(run, 300));
  window.addEventListener('resize', () => setTimeout(run, 300));

  /* Global API */
  window.ThemeGuard = {
    scan: runAllFixes,
    report: () => runAllFixes(),
    debug: () => enableDebug(runAllFixes()),
    clear: clearDebug,
    toggleDebug: () => {
      const url = new URL(location.href);
      if (url.searchParams.has('theme-debug')) url.searchParams.delete('theme-debug');
      else url.searchParams.set('theme-debug', '1');
      location.href = url.toString();
    }
  };

  console.log(
    '%c[theme-guard] v2 %cHazır. %cThemeGuard.debug() %cile görsel denetim.',
    'background:#4cc2ff;color:#000;padding:2px 8px;border-radius:3px;font-weight:bold',
    'color:#7ee787', 'color:#ffb454;font-weight:bold', 'color:#c5c5c5'
  );
})();
