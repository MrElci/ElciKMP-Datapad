/* ===========================================
   MENU-FIX.JS – "Dosya"yı "Materyal"e Çevirir
   Bu dosya bağımsız çalışır, script.js'e bağımlı değildir.
   =========================================== */
(function () {
  'use strict';

  function fixMenu() {
    // Tüm olası seçicileri dene
    const selectors = [
      '.menu-bar > *',
      '.menu-bar span',
      '.menu-bar a',
      '.menu-bar li',
      '.menu-bar div'
    ];

    let fixed = false;

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (el.dataset.__fixed === '1') return;
        const text = (el.textContent || '').trim();

        // "Dosya" veya "File" (case-insensitive, Türkçe karakter desteği)
        if (/^(dosya|file)$/i.test(text)) {
          el.dataset.__fixed = '1';
          el.textContent = 'Materyal';
          el.style.cursor = 'pointer';
          el.style.userSelect = 'none';

          // Hem onclick hem de addEventListener ile bağla
          el.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = 'material.html';
            return false;
          };
          el.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = 'material.html';
          });

          fixed = true;
          console.log('[menu-fix] Dönüştürüldü:', el);
        }
      });
    });

    return fixed;
  }

  // Birden fazla zamanda dene
  function run() {
    if (!fixMenu()) {
      // Bulunamadıysa biraz sonra tekrar dene
      setTimeout(fixMenu, 200);
      setTimeout(fixMenu, 500);
      setTimeout(fixMenu, 1000);
      setTimeout(fixMenu, 2000);
    }
  }

  // DOM hazır olduğunda çalıştır
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  // window load'da da çalıştır
  window.addEventListener('load', run);

  // MutationObserver ile DOM değişimlerini yakala
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.addedNodes && m.addedNodes.length) {
          fixMenu();
        }
      });
    });

    document.addEventListener('DOMContentLoaded', function () {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  // Global olarak da erişilebilir yap
  window.fixMenuDosya = fixMenu;
})();