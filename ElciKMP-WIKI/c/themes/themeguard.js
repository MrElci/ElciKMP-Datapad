/* ===========================================
   THEME-GUARD.JS – V3
   - Float çakışması
   - Metin kırpılması (text truncation) ← YENİ
   - Kutu taşması
   - Debug overlay
   =========================================== */
(function () {
  'use strict';

  const DEBUG = new URLSearchParams(location.search).has('theme-debug');
  const SCAN_DELAY = 250;

  /* ===========================================
     KIRPILMA TESPİTİ
     =========================================== */
  function isTruncated(el) {
    if (!el || el.nodeType !== 1) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;

    // Yatay kırpılma
    const hTrunc = el.scrollWidth > el.clientWidth + 2 &&
                   cs.overflowX !== 'visible' &&
                   el.clientWidth > 0;

    // Dikey kırpılma
    const vTrunc = el.scrollHeight > el.clientHeight + 2 &&
                   cs.overflowY !== 'visible' &&
                   el.clientHeight > 0 &&
                   el.clientHeight < 300; // çok uzun listeleri görmezden gel

    return hTrunc || vTrunc;
  }

  function detectTruncations() {
    const found = [];
    const selectors = [
      '.infobox-value', '.infobox-label',
      '.warinfobox td', '.warinfobox th',
      '.infobox-title', '.infobox-subtitle',
      '.flag-label', '.map-label',
      '.xp-preview-text',
      '.theme-item span',
      '.sidebar li',
      '.toolbar a', '.menu-bar > *',
      '.players-table td', '.players-table th',
      'summary', 'blockquote p', 'p',
      'h1.article-title', 'h2', 'h3'
    ];

    const seen = new Set();
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (seen.has(el)) return;
        seen.add(el);
        if (isTruncated(el)) {
          found.push({
            element: el,
            type: 'text-truncation',
            detail: `Metin kırpılıyor: içerik ${el.scrollWidth}px, alan ${el.clientWidth}px`
          });
        }
      });
    });

    return found;
  }

  function fixTruncations(items) {
    let fixed = 0;
    items.forEach(item => {
      const el = item.element;
      try {
        // Satır kaydırmayı zorla
        el.style.setProperty('white-space', 'normal', 'important');
        el.style.setProperty('word-break', 'break-word', 'important');
        el.style.setProperty('overflow-wrap', 'anywhere', 'important');
        el.style.setProperty('text-overflow', 'clip', 'important');
        el.style.setProperty('overflow', 'visible', 'important');
        el.style.setProperty('min-width', '0', 'important');
        fixed++;
      } catch (e) {
        console.warn('[theme-guard] fix failed:', e);
      }
    });
    return fixed;
  }

  /* ===========================================
     FLOAT ÇAKIŞMASI
     =========================================== */
  function rectsOverlap(a, b, tol = 2) {
    return !(a.right <= b.left + tol || b.right <= a.left + tol ||
             a.bottom <= b.top + tol || b.bottom <= a.top + tol);
  }

  function fixFloatOverlaps() {
    const fixes = [];
    const rightSel = '.wiki-thumb, .infobox, .warinfobox, .krono-box, .rff-right';
    const leftSel = '.rff-left';
    const isVis = el => {
      const cs = getComputedStyle(el);
      return cs.display !== 'none' && cs.visibility !== 'hidden' &&
             el.getBoundingClientRect().width > 0;
    };

    const rightEls = Array.from(document.querySelectorAll(rightSel))
      .filter(isVis).map(el => ({ el, rect: el.getBoundingClientRect() }))
      .sort((a, b) => a.rect.top - b.rect.top);

    for (let i = 0; i < rightEls.length; i++) {
      for (let j = i + 1; j < rightEls.length; j++) {
        const a = rightEls[i], b = rightEls[j];
        if (rectsOverlap(a.rect, b.rect)) {
          b.el.style.setProperty('clear', 'right', 'important');
          fixes.push({ element: b.el, type: 'float-overlap', detail: 'clear: right uygulandı' });
          b.rect = b.el.getBoundingClientRect();
        }
      }
    }

    const leftEls = Array.from(document.querySelectorAll(leftSel))
      .filter(isVis).map(el => ({ el, rect: el.getBoundingClientRect() }))
      .sort((a, b) => a.rect.top - b.rect.top);

    for (let i = 0; i < leftEls.length; i++) {
      for (let j = i + 1; j < leftEls.length; j++) {
        const a = leftEls[i], b = leftEls[j];
        if (rectsOverlap(a.rect, b.rect)) {
          b.el.style.setProperty('clear', 'left', 'important');
          fixes.push({ element: b.el, type: 'float-overlap', detail: 'clear: left uygulandı' });
          b.rect = b.el.getBoundingClientRect();
        }
      }
    }

    return fixes;
  }

  /* ===========================================
     PARENT TAŞMASI
     =========================================== */
  function fixOverflows() {
    const fixes = [];
    document.querySelectorAll('.infobox, .warinfobox, .krono-box, .wiki-thumb').forEach(el => {
      if (!el.parentElement) return;
      const p = el.parentElement.getBoundingClientRect();
      const e = el.getBoundingClientRect();
      if (e.right > p.right + 2 || e.left < p.left - 2) {
        const maxW = Math.max(240, Math.min(p.width - 20, 400));
        el.style.setProperty('max-width', maxW + 'px', 'important');
        fixes.push({ element: el, type: 'width-overflow', detail: `max-width: ${maxW}px` });
      }
    });
    return fixes;
  }

  /* ===========================================
     TÜMÜNÜ ÇALIŞTIR
     =========================================== */
  function runAll() {
    const all = [];
    try { all.push(...fixTruncations(detectTruncations())); } catch(e){ console.warn(e); }
    try { all.push(...fixFloatOverlaps()); } catch(e){ console.warn(e); }
    try { all.push(...fixOverflows()); } catch(e){ console.warn(e); }
    return all;
  }

  /* ===========================================
     DEBUG OVERLAY
     =========================================== */
  let overlay = null;
  function clearDebug() {
    if (overlay) { overlay.remove(); overlay = null; }
    document.querySelectorAll('[data-tg-mark]').forEach(el => {
      el.style.outline = '';
      el.style.outlineOffset = '';
      delete el.dataset.tgMark;
    });
  }

  function enableDebug(items) {
    clearDebug();
    overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; top: 12px; right: 12px;
      background: #1e1e1e; color: #fff;
      border: 1px solid #4cc2ff; border-radius: 10px;
      padding: 14px; font-family: 'Segoe UI', sans-serif;
      font-size: 12px; z-index: 2147483647;
      max-height: 75vh; width: 340px; overflow-y: auto;
      box-shadow: 0 12px 40px rgba(0,0,0,0.7);
    `;

    const grouped = {};
    items.forEach(f => {
      const t = typeof f === 'string' ? 'genel' : f.type;
      grouped[t] = (grouped[t] || 0) + 1;
    });

    overlay.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <strong style="color:#4cc2ff;">🛡 Theme Guard v3</strong>
        <button id="tg-close" style="background:transparent;border:none;color:#fff;font-size:16px;cursor:pointer;">✕</button>
      </div>
      <div style="background:#252525;border-radius:6px;padding:8px;margin-bottom:10px;">
        <div style="color:#9a9a9a;font-size:11px;">Tema: <span style="color:#ffb454;font-weight:600;">${document.documentElement.getAttribute('data-theme') || 'datapad'}</span></div>
        <div style="color:#9a9a9a;font-size:11px;margin-top:4px;">Düzeltme: <span style="color:#7ee787;font-weight:600;">${items.length}</span></div>
        ${Object.entries(grouped).map(([t, c]) => `<div style="color:#9a9a9a;font-size:10px;margin-top:2px;">• ${t}: <span style="color:#60cdff;">${c}</span></div>`).join('')}
      </div>
      <button id="tg-refix" style="width:100%;padding:6px;background:#4cc2ff;color:#000;border:none;border-radius:4px;font-weight:600;cursor:pointer;font-size:11px;margin-bottom:8px;">↻ Yeniden Düzelt</button>
      <div id="tg-list" style="border-top:1px solid #333;padding-top:8px;max-height:50vh;overflow-y:auto;"></div>
    `;
    document.body.appendChild(overlay);

    const list = overlay.querySelector('#tg-list');
    if (items.length === 0) {
      list.innerHTML = '<div style="color:#7ee787;padding:12px;text-align:center;">✓ Sorun yok</div>';
    } else {
      items.forEach(fix => {
        if (typeof fix === 'number') return;
        const el = fix.element;
        if (!el) return;
        const item = document.createElement('div');
        item.style.cssText = 'padding:6px 8px;margin-bottom:4px;background:#252525;border-radius:4px;cursor:pointer;border-left:2px solid #4cc2ff;';
        const tag = el.tagName.toLowerCase();
        const cls = (el.className || '').toString().split(' ').filter(c => c).slice(0, 2).join('.');
        item.innerHTML = `
          <div style="color:#60cdff;font-size:10px;font-weight:600;">&lt;${tag}${cls ? '.' + cls : ''}&gt;</div>
          <div style="color:#c5c5c5;font-size:11px;">${fix.detail}</div>
        `;
        item.onclick = () => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.style.outline = '3px solid #f85149';
          el.style.outlineOffset = '2px';
          setTimeout(() => { el.style.outline = ''; el.style.outlineOffset = ''; }, 2000);
        };
        item.onmouseenter = () => {
          el.dataset.tgMark = '1';
          el.style.outline = '2px dashed #4cc2ff';
          el.style.outlineOffset = '2px';
        };
        item.onmouseleave = () => {
          if (el.dataset.tgMark) {
            el.style.outline = '';
            el.style.outlineOffset = '';
            delete el.dataset.tgMark;
          }
        };
        list.appendChild(item);
      });
    }

    overlay.querySelector('#tg-close').onclick = () => {
      clearDebug();
      const url = new URL(location.href);
      url.searchParams.delete('theme-debug');
      history.replaceState(null, '', url);
    };
    overlay.querySelector('#tg-refix').onclick = () => {
      const newFixes = runAll();
      enableDebug(newFixes);
    };
  }

  /* ===========================================
     ANA
     =========================================== */
  let timer = null;
  function run() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const fixes = runAll();

      if (fixes.length > 0) {
        const types = {};
        fixes.forEach(f => types[f.type] = (types[f.type] || 0) + 1);
        console.log(
          `%c[theme-guard] %c${fixes.length} düzeltme`,
          'background:#7ee787;color:#000;padding:2px 8px;border-radius:3px;font-weight:bold',
          'color:#7ee787',
          types
        );
      } else {
        console.log('%c[theme-guard] ✓ Çakışma yok.', 'color:#7ee787');
      }

      if (DEBUG) enableDebug(fixes);
    }, SCAN_DELAY);
  }

  const observer = new MutationObserver(muts => {
    let shouldRun = false;
    muts.forEach(m => {
      if (m.type === 'attributes' &&
         (m.attributeName === 'data-theme' || m.attributeName === 'class')) shouldRun = true;
      if (m.type === 'childList' && m.addedNodes.length > 0) shouldRun = true;
    });
    if (shouldRun) run();
  });

  function init() {
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true });

    const linkObs = new MutationObserver(muts => {
      muts.forEach(m => m.addedNodes.forEach(n => {
        if (n.tagName === 'LINK' && n.id === '__theme_link') {
          n.addEventListener('load', () => setTimeout(run, 150));
        }
      }));
    });
    linkObs.observe(document.head, { childList: true });

    run();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener('load', () => setTimeout(run, 400));
  window.addEventListener('resize', () => setTimeout(run, 400));

  window.ThemeGuard = {
    scan: runAll,
    debug: () => enableDebug(runAll()),
    clear: clearDebug,
    toggleDebug: () => {
      const url = new URL(location.href);
      if (url.searchParams.has('theme-debug')) url.searchParams.delete('theme-debug');
      else url.searchParams.set('theme-debug', '1');
      location.href = url.toString();
    }
  };

  console.log(
    '%c[theme-guard] v3 %cHazır.',
    'background:#4cc2ff;color:#000;padding:2px 8px;border-radius:3px;font-weight:bold',
    'color:#7ee787'
  );
})();
