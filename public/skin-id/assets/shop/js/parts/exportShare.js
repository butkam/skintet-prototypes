/**
 * Instagram Story Export
 *
 * Mobile  → Web Share API opens native share sheet (Instagram Stories target)
 * Desktop → downloads image + shows step-by-step modal
 */

(function () {
  'use strict';

  const SELECTORS = {
    btn:           '[data-story-export-btn]',
    image:         '[data-story-export-image]',
    modal:         '[data-story-modal]',
    modalClose:    '[data-story-modal-close]',
    modalBackdrop: '[data-story-modal-backdrop]',
  };

  // ─── 1. MutationObserver — чекаємо появи кнопки в DOM ───────────────────────

  function watchForBtn() {
    const existing = document.querySelector(SELECTORS.btn);
    if (existing) { initBtn(existing); return; }

    const observer = new MutationObserver(() => {
      const btn = document.querySelector(SELECTORS.btn);
      if (btn) { observer.disconnect(); initBtn(btn); }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function initBtn(btn) {
    if (btn.dataset.storyInitialized) return;
    btn.dataset.storyInitialized = '1';

    const modal = btn.closest('[data-story-export]')?.querySelector(SELECTORS.modal)
      ?? document.querySelector(SELECTORS.modal);

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleExport(btn, modal);
    });

    if (modal) {
      modal.querySelectorAll(SELECTORS.modalClose).forEach((el) => {
        el.addEventListener('click', () => closeModal(modal));
      });
      modal.querySelector(SELECTORS.modalBackdrop)
        ?.addEventListener('click', () => closeModal(modal));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(modal);
      });
    }
  }

  // ─── 2. Export ───────────────────────────────────────────────────────────────

  async function handleExport(btn, modal) {
    const img = btn.closest('[data-story-export]')?.querySelector(SELECTORS.image)
      ?? document.querySelector(SELECTORS.image);

    if (!img?.src) {
      console.warn('[story-export] Image element not found');
      return;
    }

    // Оригінальний URL з data-атрибута (PageSpeed переписує src на кешований .webp,
    // а data-story-src лишає як є) + чисте ім'я файлу з data-story-filename.
    const srcUrl = img.dataset.storySrc || img.src;

    try {
      setButtonState(btn, 'loading');

      const bgColor = btn.dataset.storyBg || '#000000';
      const blob    = await fetchAndConvertToJpeg(srcUrl, 0.92, bgColor);
      const filename = img.dataset.storyFilename
        ? img.dataset.storyFilename.replace(/\.jpe?g$/i, '') + '.jpg'
        : getFilename(srcUrl);
      const file    = new File([blob], filename, { type: 'image/jpeg' });

      if (isMobile() && navigator.canShare?.({ files: [file] })) {
        // Mobile: Web Share API → нативний share sheet
        await navigator.share({ files: [file], title: img.alt || 'Story' });
      } else {
        // Desktop (або мобільний без підтримки Share API): просто скачуємо
        downloadBlob(blob, filename);
      }

      setButtonState(btn, 'success');

    } catch (err) {
      if (err.name === 'AbortError') { setButtonState(btn, 'default'); return; }
      console.error('[story-export] Export failed:', err);
      setButtonState(btn, 'default');
      alert('Не вдалося поділитися. Спробуйте ще раз.');
    }
  }

  // ─── 3. Fetch + конвертація в JPEG ──────────────────────────────────────────
  //
  // Стратегія:
  //   1. fetch() → blob (обходить CORS краще ніж <img src>)
  //   2. createImageBitmap(blob) — браузер декодує будь-який формат (webp/avif/png)
  //      без проблем з dataURL або crossOrigin
  //   3. Малюємо ImageBitmap на canvas → toBlob('image/jpeg')

  async function fetchAndConvertToJpeg(src, quality = 0.92, bgColor = '#000000') {
    // no-store: завжди тягнемо свіжий оригінал, а не закешовану версію
    const response = await fetch(src, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status} — ${src}`);
    const blob = await response.blob();

    console.log('[story-export] fetched blob:', blob.type, blob.size);

    // createImageBitmap підтримується у всіх сучасних браузерах
    // і коректно декодує webp/avif/png/jpeg без CORS-проблем
    const bitmap = await createImageBitmap(blob);

    console.log('[story-export] bitmap size:', bitmap.width, bitmap.height);

    return new Promise((resolve, reject) => {
      const canvas  = document.createElement('canvas');
      canvas.width  = bitmap.width;
      canvas.height = bitmap.height;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0);
      bitmap.close(); // звільняємо пам'ять

      canvas.toBlob(
        (result) => result
          ? resolve(result)
          : reject(new Error('canvas.toBlob returned null')),
        'image/jpeg',
        quality
      );
    });
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  function isMobile() {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent)
      || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent)); // iPad з desktop UA
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a   = Object.assign(document.createElement('a'), { href: url, download: filename });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  function setButtonState(btn, state) {
    const textEl = btn.querySelector('.story-export__btn-text');
    if (!btn.dataset.originalText && textEl) {
      btn.dataset.originalText = textEl.textContent;
    }
    btn.classList.remove('is-loading', 'is-success');
    btn.removeAttribute('disabled');
    switch (state) {
      case 'loading':
        btn.classList.add('is-loading');
        btn.setAttribute('disabled', '');
        break;
      case 'success':
        btn.classList.add('is-success');
        if (textEl) textEl.textContent = 'Готово! ✓';
        setTimeout(() => {
          btn.classList.remove('is-success');
          if (textEl) textEl.textContent = btn.dataset.originalText;
        }, 3000);
        break;
    }
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector(SELECTORS.modalClose)?.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function getFilename(src) {
    let raw = src.split('/').pop().split('?')[0];

    // Фолбек, якщо в src таки потрапив PageSpeed-URL виду
    // "xskin,28SPA_,29.jpg.pagespeed.ic.HASH.webp":
    // прибираємо суфікс .pagespeed.*, префікс "x" і розкодовуємо ",28" → "(" тощо.
    if (raw.includes('.pagespeed.')) {
      raw = raw
        .replace(/\.pagespeed\..*$/, '')
        .replace(/^x/, '')
        .replace(/,([0-9a-fA-F]{2})/g, (m, hex) => String.fromCharCode(parseInt(hex, 16)));
    }

    const decoded = decodeURIComponent(raw);          // skin(SPW%E2%80%93).jpg → skin(SPW–).jpg
    const name = decoded.replace(/\.[^.]+$/, '');
    return (name || `story-${Date.now()}`) + '.jpg';
  }

  // ─── Bootstrap ───────────────────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchForBtn);
  } else {
    watchForBtn();
  }

})();
