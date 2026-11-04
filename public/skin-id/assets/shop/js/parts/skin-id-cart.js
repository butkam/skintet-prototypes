/**
 * Skin ID — add routine products to the cart.
 *
 * Delegated, dependency-free handlers for:
 *   - [data-add-to-cart] : add a single product (data-code, data-url)
 *   - #skin-id-add-all   : add the whole routine as a discounted set
 *     (data-codes, data-name, data-morning, data-evening, data-url)
 */
(function () {
  'use strict';

  // Guard against double-binding (script may be included on more than one layout).
  if (window.__skinIdCartBound) {
    return;
  }
  window.__skinIdCartBound = true;
  console.log('[skin-id-cart] initialized');

  function updateCartCount(data) {
    if (!data || typeof data.count === 'undefined') {
      return;
    }
    var cartCount = document.getElementById('CartCount');
    if (cartCount) {
      cartCount.textContent = data.count;
    }
    document.querySelectorAll('.cart-counter, .sidebar-content-top-title-counter').forEach(function (el) {
      el.textContent = data.count;
    });
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Populate and show the shared "added to cart" notification box (same element the catalog uses).
  function showNotification(item) {
    if (!item) {
      console.log('[skin-id-cart] notify: no item in response');
      return;
    }
    var box = document.querySelector('.notification-box');
    var container = document.getElementById('notification-box__data-in');
    if (!box || !container) {
      console.warn('[skin-id-cart] notify: element missing', { box: !!box, container: !!container });
      return;
    }
    console.log('[skin-id-cart] notify: showing', item);

    var subTitle = item.variantName ? '<span class="sub-title">' + escapeHtml(item.variantName) + '</span>' : '';
    container.innerHTML =
      '<a href="' + escapeHtml(item.url || '#') + '">' +
        '<div class="img-holder"><img src="' + escapeHtml(item.img || '') + '" alt="product image" width="55" height="55"></div>' +
        '<div class="data">' +
          '<div class="title-holder"><span class="title">' + escapeHtml(item.title) + '</span>' + subTitle + '</div>' +
          '<div class="price-box"><span class="price">' + escapeHtml(item.price) + ' ₴</span></div>' +
        '</div>' +
      '</a>';

    box.style.display = '';
    void box.offsetHeight;
    box.classList.add('is-show');

    clearTimeout(window.__skinIdNotifyTimer);
    window.__skinIdNotifyTimer = window.setTimeout(function () {
      box.classList.remove('is-show');
    }, 5000);
  }

  function parseJSONAttr(el, attr) {
    try {
      return JSON.parse(el.getAttribute(attr) || '[]');
    } catch (err) {
      return [];
    }
  }

  // Resolve a root-relative URL against the bare origin. fetch() throws if the resolved URL
  // carries credentials (the page is served behind basic auth: https://user:pass@host/...),
  // and location.origin excludes the "user:pass@" part.
  function resolveUrl(url) {
    if (!url) {
      return url;
    }
    if (/^https?:\/\//i.test(url)) {
      return url;
    }
    return window.location.origin + url;
  }

  function post(url, body, btn, onDone) {
    return fetch(resolveUrl(url), {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      body: body,
      credentials: 'same-origin'
    })
      .then(function (response) {
        if (!response.ok) {
          console.warn('[skin-id-cart] request failed', url, response.status);
        }
        return response.json().catch(function () { return {}; });
      })
      .then(function (data) {
        console.log('[skin-id-cart] response', url, data);
        updateCartCount(data);
        showNotification(data ? data.item : null);
        if (typeof onDone === 'function') {
          onDone(data);
        }
      })
      .catch(function (err) {
        console.error('[skin-id-cart] network error', url, err);
        btn.classList.add('skin-id-buy--error');
      })
      .then(function () {
        btn.classList.remove('loading');
      });
  }

  function setLabel(btn, text) {
    var label = btn.querySelector('span');
    if (label) {
      label.textContent = text;
    }
  }

  // ── Routine regeneration (AJAX, no page reload) ──────────────────────────

  var CARE_POLL_INTERVAL = 3000; // ms between readiness checks
  var CARE_POLL_ATTEMPTS = 60;   // ~3 minutes, then fall back to a full reload

  function setCareLoading(on) {
    var section = document.querySelector('.main__content-care');
    if (section) {
      section.classList.toggle('is-regenerating', on);
    }
    var btn = document.getElementById('skin-id-refresh');
    if (btn) {
      btn.classList.toggle('is-loading', on);
      if (on) {
        btn.setAttribute('data-idle-text', btn.textContent.trim());
        btn.textContent = 'Оновлення…';
      } else if (btn.getAttribute('data-idle-text')) {
        btn.textContent = btn.getAttribute('data-idle-text');
      }
    }
  }

  // Swap the whole care section (message + tabs + buy-all set) with the freshly
  // rendered HTML and re-bind the Ранок/Вечір tabs (exposed by result-sliders.js).
  function replaceCareSection(html) {
    var section = document.querySelector('.main__content-care');
    if (!section) {
      return false;
    }
    var holder = document.createElement('div');
    holder.innerHTML = html;
    var fresh = holder.querySelector('.main__content-care');
    if (!fresh) {
      return false;
    }
    section.replaceWith(fresh);
    if (typeof window.skinIdCareTabs === 'function') {
      window.skinIdCareTabs();
    }
    return true;
  }

  // The AI generates the new routine asynchronously: keep asking the backend for
  // the care-section HTML until it answers 200 (202 = still processing).
  function pollCareContent(url, attempt) {
    if (attempt >= CARE_POLL_ATTEMPTS) {
      console.warn('[skin-id-cart] regenerate: polling timed out, reloading page');
      window.location.reload();
      return;
    }
    window.setTimeout(function () {
      fetch(resolveUrl(url), {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin'
      })
        .then(function (response) {
          if (response.status === 200) {
            return response.text().then(function (html) {
              if (html.trim() && replaceCareSection(html)) {
                console.log('[skin-id-cart] regenerate: care section updated');
              } else {
                window.location.reload();
              }
            });
          }
          pollCareContent(url, attempt + 1);
        })
        .catch(function (err) {
          console.warn('[skin-id-cart] regenerate: poll error', err);
          pollCareContent(url, attempt + 1);
        });
    }, CARE_POLL_INTERVAL);
  }

  function regenerateCare(btn) {
    var regenerateUrl = btn.getAttribute('data-url');
    var careUrl = btn.getAttribute('data-care-url')
      || regenerateUrl.replace(/\/regenerate$/, '/care-content');

    setCareLoading(true);

    fetch(resolveUrl(regenerateUrl), {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      credentials: 'same-origin'
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('regenerate failed: ' + response.status);
        }
        pollCareContent(careUrl, 0);
      })
      .catch(function (err) {
        console.error('[skin-id-cart] regenerate error', err);
        setCareLoading(false);
      });
  }

  // Capture phase: run even if a theme/bundle handler calls stopPropagation() on .btn clicks
  // (that's why these buttons fired the Facebook pixel but not a bubble-phase listener).
  document.addEventListener('click', function (e) {
    if (!e.target || !e.target.closest) {
      return;
    }

    // Add a single routine product to the cart.
    var buyBtn = e.target.closest('[data-add-to-cart]');
    if (buyBtn && !buyBtn.classList.contains('loading')) {
      e.preventDefault();
      var code = buyBtn.getAttribute('data-code');
      console.log('[skin-id-cart] buy click', code);
      if (!code) {
        return;
      }
      buyBtn.classList.add('loading');
      var single = new URLSearchParams();
      single.append('code', code);
      post(buyBtn.getAttribute('data-url'), single, buyBtn, function () {
        // The same product can appear in several routine steps (morning + evening) —
        // switch every buy button with this code to the "in cart" state, not just the clicked one.
        document.querySelectorAll('[data-add-to-cart][data-code="' + code + '"]').forEach(function (btn) {
          btn.classList.add('skin-id-buy--done');
          setLabel(btn, 'В кошику');
        });
      });
      return;
    }

    // Regenerate the routine via AI and swap the care section in place:
    // loading state → POST regenerate → poll care-content → replace HTML.
    var refreshBtn = e.target.closest('#skin-id-refresh');
    if (refreshBtn && !refreshBtn.classList.contains('is-loading')) {
      e.preventDefault();
      console.log('[skin-id-cart] regenerate click');
      regenerateCare(refreshBtn);
      return;
    }

    // Add the whole routine to the cart as a set.
    var allBtn = e.target.closest('#skin-id-add-all');
    if (allBtn && !allBtn.disabled && !allBtn.classList.contains('loading')) {
      e.preventDefault();
      var codes = parseJSONAttr(allBtn, 'data-codes');
      console.log('[skin-id-cart] add-all click', codes);
      if (!codes.length) {
        return;
      }
      allBtn.classList.add('loading');

      var body = new URLSearchParams();
      codes.forEach(function (c) { body.append('codes[]', c); });

      var setName = allBtn.getAttribute('data-name');
      if (setName) {
        body.append('name', setName);
      }

      // Skin ID submission token — the backend uses it to set the Skin ID picture as the set image.
      var token = allBtn.getAttribute('data-token');
      if (token) {
        body.append('token', token);
      }

      ['morning', 'evening'].forEach(function (period) {
        parseJSONAttr(allBtn, 'data-' + period).forEach(function (c) {
          body.append(period + '[]', c);
        });
      });

      post(allBtn.getAttribute('data-url'), body, allBtn, function () {
        allBtn.classList.add('skin-id-buy--done');
        setLabel(allBtn, 'Всі товари додано в кошик');
      });
    }
  }, true);
})();
