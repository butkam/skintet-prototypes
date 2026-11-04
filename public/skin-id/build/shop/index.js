"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["index"],{

/***/ "./public/assets/shop/js/global/emailValidation.js":
/*!*********************************************************!*\
  !*** ./public/assets/shop/js/global/emailValidation.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   emailValidation: () => (/* binding */ emailValidation)
/* harmony export */ });
function emailValidation() {
  // Attach a click event via jQuery
  $('#subscribeSubmit').on('click', function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Cache jQuery objects
    const $errorElement = $('.subscribe-error');
    const $emailInput = $('#subscribe-email');

    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

    // Check email validity
    if (!emailRegex.test($emailInput.val())) {
      // Show error message
      $errorElement.addClass('active');
    } else {
      // Hide error message
      $errorElement.removeClass('active');

      // Perform AJAX request if the email is valid
      $.ajax({
        url: '/path/to/your/endpoint',
        // Replace with your actual URL
        method: 'POST',
        data: {
          email: $emailInput.val()
        },
        success: function success(response) {
          console.log('Subscription successful:', response);
          $('.subscribe-inner').hide();
          $('.subscribe-completed').show();
          // Optionally show a success message or redirect
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          console.error('Error while subscribing:', errorThrown);
          $errorElement.text('Помилка при відправці');
          $errorElement.addClass('active');
          // Optionally show an error message to the user
        }
      });
    }
  });
}

/***/ }),

/***/ "./public/assets/shop/js/global/lazyLoad.js":
/*!**************************************************!*\
  !*** ./public/assets/shop/js/global/lazyLoad.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createLazyLoadObserver: () => (/* binding */ createLazyLoadObserver),
/* harmony export */   lazyLoadImages: () => (/* binding */ lazyLoadImages),
/* harmony export */   observeElements: () => (/* binding */ observeElements)
/* harmony export */ });
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* global document, IntersectionObserver */

/**
 * Adds loading="lazy" to images marked for lazy-loading.
 * By default, only images with [data-lazy="true"] will be processed.
 *
 * @param {HTMLElement|Document} root    – root to search under
 * @param {string} selector              – CSS selector for images to lazy-load
 */
function lazyLoadImages(root = document, selector = 'img[data-lazy="true"]') {
  const images = root.querySelectorAll(`${selector}:not([loading])`);
  images.forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
}

/**
 * Creates an IntersectionObserver that fires when the target comes into view.
 * @param {Function} callback  – called with (element, observer) on intersect
 * @param {Object} options     – same as IntersectionObserverInit
 */
function createLazyLoadObserver(callback, options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  const mergedOptions = _objectSpread(_objectSpread({}, defaultOptions), options);
  return new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target, observer);
      }
    });
  }, mergedOptions);
}

/**
 * Observe a set of elements and call `loadCallback(el)` once when they scroll into view.
 * @param {NodeList|Array<HTMLElement>} elements
 * @param {Function} loadCallback
 * @param {Object} options  – IntersectionObserverInit
 */
function observeElements(elements, loadCallback, options = {}) {
  const observer = createLazyLoadObserver((target, obs) => {
    loadCallback(target);
    obs.unobserve(target);
  }, options);
  elements.forEach(el => observer.observe(el));
  return observer;
}

/***/ }),

/***/ "./public/assets/shop/js/global/skinBrand.js":
/*!***************************************************!*\
  !*** ./public/assets/shop/js/global/skinBrand.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   skinBrand: () => (/* binding */ skinBrand)
/* harmony export */ });
/* global document, MutationObserver, NodeFilter */
// Wraps every "Skin(ID)" / "Skin(Id)" / "Skin(tet)" text occurrence so the brand gets its fonts:
// "Skin" -> Sailec 400, "(ID)" / "(tet)" -> NibProSemiBoldItalic (see .skin-brand in scss/_font.scss).
const BRAND_RE = /Skin\s*\((ID|tet)\)/gi;
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'OPTION', 'TITLE', 'SELECT', 'CODE', 'PRE']);
const shouldSkip = node => {
  for (let el = node.parentElement; el; el = el.parentElement) {
    if (SKIP_TAGS.has(el.tagName) || el.isContentEditable || el.classList.contains('skin-brand')) return true;
  }
  return false;
};
const wrapTextNode = node => {
  const text = node.nodeValue;
  BRAND_RE.lastIndex = 0;
  if (!BRAND_RE.test(text)) return;
  BRAND_RE.lastIndex = 0;
  const frag = document.createDocumentFragment();
  let last = 0;
  let m;
  while ((m = BRAND_RE.exec(text)) !== null) {
    if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
    const brand = document.createElement('span');
    brand.className = 'skin-brand';
    const tag = document.createElement('span');
    tag.className = 'skin-brand__tag';
    tag.textContent = `(${m[1]})`;
    brand.append(text.substr(m.index, 4), tag);
    frag.appendChild(brand);
    last = m.index + m[0].length;
  }
  if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
  node.parentNode.replaceChild(frag, node);
};

// Markup variant: Skin<em>(ID)</em> — only when the <em> holds exactly (ID) / (tet).
const TAG_RE = /^\(\s*(ID|tet)\s*\)$/i;
const TAIL_RE = /Skin\s*$/i;
const wrapSplitBrand = root => {
  const ems = root.nodeType === Node.ELEMENT_NODE ? [...root.querySelectorAll('em')] : [];
  if (root.tagName === 'EM') ems.push(root);
  ems.forEach(em => {
    const prev = em.previousSibling;
    if (!prev || prev.nodeType !== Node.TEXT_NODE || em.classList.contains('skin-brand__tag')) return;
    if (!TAG_RE.test(em.textContent.trim()) || !TAIL_RE.test(prev.nodeValue) || shouldSkip(em.firstChild || em)) return;
    const m = prev.nodeValue.match(TAIL_RE);
    const head = prev.nodeValue.slice(0, m.index);
    const brand = document.createElement('span');
    brand.className = 'skin-brand';
    brand.textContent = m[0].trimEnd();
    if (head) prev.nodeValue = head;else prev.remove();
    em.parentNode.insertBefore(brand, em);
    em.classList.add('skin-brand__tag');
    brand.appendChild(em);
  });
};
const processTree = root => {
  if (root.nodeType === Node.TEXT_NODE) {
    if (!shouldSkip(root)) wrapTextNode(root);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  wrapSplitBrand(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(n => {
    if (!shouldSkip(n)) wrapTextNode(n);
  });
};
const skinBrand = () => {
  processTree(document.body);
  new MutationObserver(mutations => {
    mutations.forEach(mu => mu.addedNodes.forEach(n => processTree(n)));
  }).observe(document.body, {
    childList: true,
    subtree: true
  });
};

/***/ }),

/***/ "./public/assets/shop/js/index.js":
/*!****************************************!*\
  !*** ./public/assets/shop/js/index.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _parts_header__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parts/header */ "./public/assets/shop/js/parts/header.js");
/* harmony import */ var _global_emailValidation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./global/emailValidation */ "./public/assets/shop/js/global/emailValidation.js");
/* harmony import */ var _global_skinBrand__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./global/skinBrand */ "./public/assets/shop/js/global/skinBrand.js");
/* harmony import */ var _parts_sliders__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./parts/sliders */ "./public/assets/shop/js/parts/sliders.js");
/* harmony import */ var _parts_product__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./parts/product */ "./public/assets/shop/js/parts/product.js");
/* harmony import */ var _parts_cart__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./parts/cart */ "./public/assets/shop/js/parts/cart.js");
/* harmony import */ var _parts_popup__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./parts/popup */ "./public/assets/shop/js/parts/popup.js");
/* harmony import */ var _parts_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./parts/ui */ "./public/assets/shop/js/parts/ui.js");
/* harmony import */ var _parts_mobileMenu__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./parts/mobileMenu */ "./public/assets/shop/js/parts/mobileMenu.js");
/* harmony import */ var _global_lazyLoad__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./global/lazyLoad */ "./public/assets/shop/js/global/lazyLoad.js");
/* harmony import */ var _parts_lazyImages__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./parts/lazyImages */ "./public/assets/shop/js/parts/lazyImages.js");
/* global document, window */
// Import all modules












// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
  // Apply lazy loading to all images, including dynamically loaded ones
  (0,_parts_lazyImages__WEBPACK_IMPORTED_MODULE_10__["default"])();

  // Initialize essential components immediately
  (0,_parts_header__WEBPACK_IMPORTED_MODULE_0__.header)();
  (0,_global_emailValidation__WEBPACK_IMPORTED_MODULE_1__.emailValidation)();
  (0,_global_skinBrand__WEBPACK_IMPORTED_MODULE_2__.skinBrand)();

  // Lazy load heavy components
  const lazyComponents = [{
    selector: '.slider-container',
    init: _parts_sliders__WEBPACK_IMPORTED_MODULE_3__["default"]
  }, {
    selector: '.product-item, .product-detail',
    init: _parts_product__WEBPACK_IMPORTED_MODULE_4__["default"]
  }, {
    selector: '.cart-container',
    init: _parts_cart__WEBPACK_IMPORTED_MODULE_5__["default"]
  }, {
    selector: '.popup-trigger',
    init: _parts_popup__WEBPACK_IMPORTED_MODULE_6__["default"]
  }, {
    selector: '.ui-component',
    init: _parts_ui__WEBPACK_IMPORTED_MODULE_7__["default"]
  }, {
    selector: '.mobile-menu-container',
    init: _parts_mobileMenu__WEBPACK_IMPORTED_MODULE_8__["default"]
  }];
  lazyComponents.forEach(component => {
    const elements = document.querySelectorAll(component.selector);
    if (elements.length > 0) {
      (0,_global_lazyLoad__WEBPACK_IMPORTED_MODULE_9__.observeElements)(elements, () => {
        component.init();
      }, {
        rootMargin: '100px'
      });
    } else {
      // If selector not found, initialize anyway (fallback)
      component.init();
    }
  });
});
(function () {
  function getSlugFromPath() {
    const parts = (window.location.pathname || '/').split('/').filter(Boolean);
    return parts.length ? parts[parts.length - 1] : '';
  }
  function addRedirectParam(href, redirectValue) {
    const url = new URL(href, window.location.origin);
    url.searchParams.set('redirect', redirectValue);
    return url.pathname + (url.search || '') + (url.hash || '');
  }
  document.addEventListener('click', function (e) {
    const link = e.target.closest('.need-login .js-register-link, .need-login .js-login-link');
    if (!link) return;
    e.preventDefault();
    const baseHref = link.getAttribute('href');
    if (!baseHref) return;
    const slug = getSlugFromPath();
    const redirectValue = slug || 'home';
    window.location.href = addRedirectParam(baseHref, redirectValue);
  });
})();
(function () {
  const ROOT_CLASS = 'is-interacted';
  function markInteractedOnce() {
    if (document.documentElement.classList.contains(ROOT_CLASS)) return;
    document.documentElement.classList.add(ROOT_CLASS);
    cleanupInteractionListeners();
  }

  // --- Відстеження першої взаємодії користувача
  const interactionEvents = [['scroll', markInteractedOnce, {
    passive: true
  }], ['mousemove', markInteractedOnce, {
    passive: true
  }], ['touchstart', markInteractedOnce, {
    passive: true
  }], ['keydown', markInteractedOnce, {
    passive: true
  }], ['wheel', markInteractedOnce, {
    passive: true
  }], ['pointerdown', markInteractedOnce, {
    passive: true
  }]];
  function setupInteractionListeners() {
    interactionEvents.forEach(([evt, fn, opt]) => window.addEventListener(evt, fn, opt));
  }
  function cleanupInteractionListeners() {
    interactionEvents.forEach(([evt, fn, opt]) => window.removeEventListener(evt, fn, opt));
  }
  setupInteractionListeners();
})();
(function () {
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.link');
    if (!btn) return;
    const encoded = btn.dataset.href;
    if (!encoded) return;
    try {
      const url = atob(encoded);
      window.location.href = url;
    } catch (err) {
      console.error('Invalid base64 URL', err);
    }
  });
  document.addEventListener('keydown', function (e) {
    const btn = e.target.closest('.link');
    if (!btn) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const encoded = btn.dataset.href;
      if (!encoded) return;
      const url = atob(encoded);
      window.location.href = url;
    }
  });
})();

/***/ }),

/***/ "./public/assets/shop/js/parts/cart.js":
/*!*********************************************!*\
  !*** ./public/assets/shop/js/parts/cart.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ initCartFunctionality)
/* harmony export */ });
/* global $, window, document */
function initCartFunctionality() {
  console.log('initCartFunctionality');
  // Add to cart functionality
  $(document).on('submit', '.sylius-product-adding-to-cart', function (event) {
    event.preventDefault();
    console.log('sylius-product-adding-to-cart');
    const form = $(this);
    const formData = form.serialize();
    const submitButton = form.find('button[type="submit"]');
    // set by the "Оформити замовлення" button of the installment popup
    const goToCart = !!form.data('goToCart');
    form.removeData('goToCart');
    if (submitButton.hasClass('loading')) return;
    submitButton.addClass('loading');
    $.ajax({
      url: form.attr('action'),
      type: form.attr('method'),
      data: formData,
      success(response) {
        // 1) Update cart UI
        updateCountCurt(response.count);

        // The popup's "Оформити замовлення" must not depend on the analytics
        // code below: a missing data-* attribute there throws and kills the redirect.
        if (goToCart) {
          window.location.href = '/cart';
          return;
        }

        // 2) Gather analytics data, handling both variant structures
        let productName, id, priceRaw, taxonName, variantName, brand;

        // a) “select‐options” variant (radio + label)
        const $input = form.find('input[name="sylius_add_to_cart[cartItem][variant]"]:checked');
        const $lbl = $input.closest('.wayfx-product__additional--form--select--options--label');
        if ($input.length && $lbl.length) {
          productName = $lbl.attr('data-product-name');
          id = $input.data('code');
          priceRaw = $lbl.attr('data-price');
          taxonName = $lbl.attr('data-taxon');
          variantName = $lbl.attr('data-variant-name');
          brand = $lbl.attr('data-brand');
        }
        // b) “single‐button” variant (hidden .var-item + button[data-*])
        else {
          const $btn = submitButton;
          productName = $btn.attr('data-product-name');
          id = $btn.attr('data-id');
          priceRaw = $btn.attr('data-price');
          taxonName = $btn.attr('data-taxon');
          variantName = $btn.attr('data-variant-name');
          brand = $btn.attr('data-brand');
        }

        // 3) Normalize price string into a Number
        const price = parseFloat(priceRaw.replace(/\s|₴/g, '') // strip spaces + UAH symbol
        .replace(',', '.') // comma → dot
        );
        console.log(productName);
        console.log(id);
        console.log(variantName);
        console.log(brand);
        productModalCart(response);

        // 4) Fire the GA4 add_to_cart event
        googleAddToCart(productName, id, price, taxonName, variantName, brand);
        if ($('body').hasClass('overflow') || $('body').hasClass('page-sylius_shop_checkout')) {
          updateCartDisplay();
        }
        // 5) Button feedback
        submitButton.removeClass('loading').addClass('added');
        submitButton.find('.buy').text('Додано');
        setTimeout(() => {
          submitButton.removeClass('added');
          submitButton.find('.buy').text('Купити');
        }, 1600);
      },
      error(xhr) {
        var _xhr$responseJSON;
        submitButton.removeClass('loading');
        let errMsg = 'Сталася помилка. Спробуйте ще раз.';
        if (xhr.status === 400 && (_xhr$responseJSON = xhr.responseJSON) !== null && _xhr$responseJSON !== void 0 && _xhr$responseJSON.errors) {
          var _e$form;
          const e = xhr.responseJSON.errors;
          if (Array.isArray(e.errors) && e.errors.length) {
            errMsg = e.errors[0];
          } else if (Array.isArray((_e$form = e.form) === null || _e$form === void 0 ? void 0 : _e$form.errors) && e.form.errors.length) {
            errMsg = e.form.errors[0];
          }
        }
        const $popup = $('.popup.message');
        $popup.find('.popup-message-text').text(errMsg);
        $popup.show();
      },
      complete() {
        submitButton.removeClass('loading');
      }
    });
  });
  function productModalCart(response) {
    const container = document.getElementById('notification-box__data-in');

    // Перевіряємо, чи контейнер знайдено, щоб уникнути помилок
    if (!container) {
      console.error('Error: Container #product-modal-content not found.');
      return;
    }
    $('.notification-box').removeClass('is-show');
    setTimeout(function () {
      $('.notification-box').css('display', 'none');
    }, 200);

    // 2. Отримуємо об'єкт з даними про товар
    const item = response.item;

    // 3. Створюємо HTML-рядок, використовуючи шаблонні рядки (backticks ``)
    //    Зверніть увагу на виправлення: src="${item.img}" та ${item.variantName}
    const productHtml = `
        <a href="${item.url}">
            <div class="img-holder">
              <img src="${item.img}" alt="product image" width="55" height="55">
            </div>
            <div class="data">
                <div class="title-holder">
                  <span class="title">${item.title}</span>
                  ${item.variantName ? `<span class="sub-title">${item.variantName}</span>` : ''}
                </div>
                <div class="price-box">
                    <span class="price">${item.price} ₴</span>
                </div>
            </div>
        </a>
    `;
    setTimeout(function () {
      container.innerHTML = productHtml;
    }, 300);
    setTimeout(function () {
      $('.notification-box').show(1).addClass('is-show');
    }, 300);
  }
  function googleAddToCart(productName, id, price, taxonName, variantName, brand) {
    const itemVariant = variantName && variantName.trim() !== '' ? variantName : undefined;
    const ecommerceEvent = {
      event: 'add_to_cart',
      ecommerce: {
        currency: "UAH",
        // Код валюти, в якій відбулась подія
        value: price,
        items: [{
          item_name: productName,
          item_id: id,
          price: price,
          item_category: 'Тип продукту',
          item_category2: taxonName,
          item_variant: itemVariant,
          item_brand: brand,
          quantity: 1
        }]
      }
    };
    dataLayer.push({
      ecommerce: null
    });
    dataLayer.push(ecommerceEvent);
    console.log('add_to_cart event sent:', ecommerceEvent);
  }
  function updateCountCurt($count) {
    $('.sidebar-content-top-title-counter').text($count);
    $('.cart-counter').text($count);
  }

  // Present form submission
  $(document).on('click', '.btn-present', function (e) {
    e.preventDefault();
    $(this).closest('form').submit();
  });
  $(document).on('submit', '.present-form', function (e) {
    e.preventDefault();
    const form = $(this);
    const formData = form.serialize();
    const submitButton = form.find('button[type="submit"]');

    // Check if button is already loading
    if (submitButton.hasClass('loading')) {
      return;
    }

    // стан завантаження — лише на самій кнопці
    submitButton.addClass('loading');
    $.ajax({
      url: form.attr('action'),
      type: form.attr('method'),
      data: formData,
      success(response) {
        // Update cart counters
        updateCountCurt(response.count);
        updateCartDisplay();
        submitButton.removeClass('loading');
        submitButton.find('.buy').text('Товар додано').fadeIn(200);

        // Unblock button after 3 seconds
        setTimeout(function () {
          submitButton.find('.buy').fadeOut(200, function () {
            $(this).text('Купити').fadeIn(200);
          });
        }, 3000);
      },
      error() {
        alert('Помилка: Не вдалося додати товар.');
        submitButton.removeClass('loading');
      },
      complete() {
        submitButton.removeClass('loading');
      }
    });
  });

  // Cart display functions
  function updateCartDisplay2() {
    console.log('updateCartDisplay2');
    $.ajax({
      url: '/api/cart',
      type: 'POST',
      dataType: 'json',
      success(data) {
        console.log(data.html);
        $('.cart-summary').html(data.html);
      }
    });
  }

  // Малює готовий підсумок кошика. Ту саму відповідь (count/total/html) віддає
  // і /api/cart, і /api/cart/update-quantity — тож після «+»/«−» другий запит
  // уже не потрібен.
  function renderCartSummary(response) {
    if (!response || typeof response.html !== 'string') {
      return false;
    }
    updateCountCurt(response.count);
    if (response.total && response.total > 2900000) {
      $('.checkout-form-block-to_terminal').hide();
      $('.to_terminal').hide();
      $('input[name="np-terminal-name"]').val('');
      if ($('#to_terminal').is(':checked')) {
        $('#to_warehouse').click();
      }
    } else {
      $('.checkout-form-block-to_terminal').show();
    }
    paintCart(response.html);
    $('.sidebar-inner').removeClass('loading');
    $('.checkout-wrapper-right').removeClass('loading');
    return true;
  }

  // Кладе готовий HTML кошика і синхронізує все, що живе поза ним: шкалу,
  // стан подарунків, значок подарунків у шапці шторки та підпис кнопки
  function paintCart(html) {
    // Що вже було в кошику до перемальовування: нове з'являється анімовано,
    // решта не блимає. Ключ — id варіанта; подарунок і товар різні за класом
    const seen = new Set();
    $('.sidebar-content-replace').first().find('.checkout-product-top-item, .cart-gift').each(function () {
      seen.add(`${$(this).hasClass('cart-gift') ? 'g' : 'i'}${$(this).attr('data-id') || $(this).attr('data-variant-id')}`);
    });
    const hadItems = seen.size > 0;
    $('.sidebar-content-replace, #checkout-info').html(html);
    if (hadItems) {
      $('.sidebar-content-replace, #checkout-info').find('.checkout-product-top-item, .cart-gift').each(function () {
        const $el = $(this);
        const isGift = $el.hasClass('cart-gift');
        if (!seen.has(`${isGift ? 'g' : 'i'}${$el.attr('data-id') || $el.attr('data-variant-id')}`)) {
          (isGift ? $el : $el.closest('.checkout-product-top-item-wrapper')).addClass('is-new');
        }
      });
    }
    progresBar();
    initSampleRefuse();
    syncGiftBadge();
    syncGiftCta();
    $(document).trigger('cart:painted');
  }

  // Скільки подарунків ще можна обрати — число й анімація «підскоку» у шапці
  function syncGiftBadge() {
    const left = parseInt($('.sidebar-content-replace .cart-meta').first().attr('data-gifts-count'), 10) || 0;
    const $badge = $('.sidebar-content-top-gifts');
    if (!$badge.length) return;
    const prev = parseInt($badge.attr('data-count'), 10);
    $badge.attr('data-count', left).find('.sidebar-content-top-gifts-count').text(left);
    $badge.toggleClass('has-gifts', left > 0);
    if (!Number.isNaN(prev) && prev !== left) {
      $badge.removeClass('is-bump');
      void $badge.get(0).offsetWidth; // reflow — щоб анімація повторювалась
      $badge.addClass('is-bump');
    }
  }

  // silent — перемалювати без затемнення кошика. Для «+»/«−» кількість
  // змінюється в інтерфейсі одразу, тож лоадер лише тримав би людину в
  // очікуванні відповіді.
  // чекаут перемальовує підсумок після вирівнювання суми з 1С (checkout.js, precheck)
  window.skRefreshCart = function () {
    updateCartDisplay({
      silent: true
    });
  };

  // Повноекранний лоадер лише поки шторка ще порожня (перше відкриття). Далі +/−, додавання рекомендації,
  // видалення й вибір подарунка оновлюють кошик на місці, без «завантаження», що перекриває весь список
  // (див. Planfix 4885, п. 8): кнопки рядка на час запиту блокуються, а відповідь вставляється готовим HTML.
  function cartHasContent() {
    return $('.sidebar-inner .checkout-product-top, .checkout-wrapper-right .checkout-product-top, .empty-cart').length > 0;
  }
  function updateCartDisplay(options) {
    const silent = Boolean(options && options.silent) || cartHasContent();
    if (!silent) {
      $('.sidebar-inner').addClass('loading');
      $('.checkout-wrapper-right').addClass('loading');
    }
    $('.notification-box').removeClass('is-show');
    $.ajax({
      type: 'POST',
      url: '/api/cart',
      dataType: 'json',
      success(response) {
        renderCartSummary(response);
      }
    });
  }
  function progresBar() {
    // 1. Check if progress bars exist before running loop
    const $progressBlocks = $('.progress-bar__block');
    if ($progressBlocks.length > 0) {
      console.log('progressBar');
      $progressBlocks.each(function () {
        const $holder = $(this);
        function parseNumber(value) {
          return parseFloat(String(value).replace(/\s/g, '').replace(',', '.')) || 0;
        }
        const currentValue = parseNumber($holder.data('current'));
        const minValue = parseNumber($holder.data('min'));
        const maxValue = parseNumber($holder.data('max'));
        const deliveryValue = parseNumber($holder.data('delivery'));
        const lastValueLimit = parseNumber($holder.data('last'));
        // Є зароблений, але ще не обраний набір — шкала стоїть на пройденому
        // порозі, і замість «Вітаємо, ви отримали» кажемо «можеш обрати»
        const giftReady = String($holder.data('gift-ready')) === '1';
        const $moreText = $holder.find('.more-txt');
        const $moreValue = $moreText.find('.amount span');
        const $lastText = $holder.find('.last-txt');
        const $lastValue = $lastText.find('.amount span');
        const $giftText = $holder.find('.gift-txt');
        const $giftValue = $giftText.find('.amount span');
        const $minText = $holder.find('.min-txt span');
        const $maxHolder = $holder.find('.max-txt');
        const $maxText = $maxHolder.find('span');
        const $deliveryHolder = $holder.find('.delivery-txt');
        const $deliveryText = $deliveryHolder.find('span');
        const $progressBar = $holder.find('.progress-bar__progress');
        const amount = maxValue - currentValue;
        const delivery = deliveryValue - currentValue;
        // Як у макеті: шкала — це два рівні відрізки, 0 → доставка і
        // доставка → ціль. Позиція значка доставки тому завжди посередині, а не
        // пропорційна сумі: при цілі 55 000 поріг 3 000 стискався б у кілька
        // відсотків і його підпис налазив би на «0 ₴».
        const splitPos = 50;
        const hasSplit = maxValue > 0 && deliveryValue > 0 && deliveryValue < maxValue;
        const posOf = value => {
          if (!maxValue) return 0;
          const pos = hasSplit ? value <= deliveryValue ? value / deliveryValue * splitPos : splitPos + (value - deliveryValue) / (maxValue - deliveryValue) * (100 - splitPos) : value / maxValue * 100;
          return Math.min(100, Math.max(0, pos));
        };
        const progress = maxValue ? posOf(currentValue).toFixed(1) : 0;
        const deliveryPos = maxValue ? posOf(deliveryValue).toFixed(1) : 0;
        const readyPos = deliveryValue ? (currentValue * 100 / deliveryValue).toFixed(1) : 0;
        $holder.removeClass('is-ready is-full is-delivery is-gift-ready');
        $maxHolder.removeClass('is-hidden');
        $minText.text(minValue);
        $maxText.text(maxValue);
        $deliveryText.text(deliveryValue);
        if (!maxValue) {
          $maxHolder.addClass('is-hidden');
          $deliveryHolder.css({
            display: 'block',
            left: '',
            right: '0'
          });
          if (delivery <= 0) {
            $holder.addClass('is-ready');
          } else {
            $holder.removeClass('is-ready');
            $progressBar.css('width', readyPos + '%');
            $moreText.show();
            $moreValue.text(delivery);
          }
          return;
        }
        const sameAsDelivery = maxValue === deliveryValue;
        if (!sameAsDelivery) {
          $deliveryHolder.css({
            display: 'block',
            right: '',
            left: `${deliveryPos}%`
          });
        } else {
          // Подарунок на тому ж порозі, що й доставка (бронзер від 3000):
          // окрема ціль лише налізла б на значок доставки — лишаємо один
          $maxHolder.addClass('is-hidden');
          $deliveryHolder.css({
            display: 'block',
            left: '',
            right: '0'
          });
        }
        if (amount <= 0) {
          $holder.addClass(giftReady ? 'is-gift-ready' : 'is-full');
          return;
        }
        $holder.removeClass('is-full');
        $progressBar.css('width', progress + '%');
        if (delivery <= 0) {
          $holder.addClass('is-delivery');
          if (amount <= lastValueLimit) {
            $lastText.show();
            $lastValue.text(amount);
          } else {
            $giftText.show();
            $giftValue.text(amount);
          }
        } else {
          $moreText.show();
          $moreValue.text(delivery);
        }
      });
    }

    // 2. Check if Slider exists AND is not already initialized
    const $slider = $('.more-slider__slider');
    if ($slider.length > 0 && !$slider.hasClass('slick-initialized')) {
      // рекомендації: коли всі картки вміщаються й гортати нічого, слайдер центрується
      function centerFewSlides() {
        const $list = $slider.find('.slick-list');
        let width = 0;
        $slider.find('.slick-slide').each(function () {
          width += $(this).outerWidth(true);
        });
        // шторка кошика ініціалізує слайдер прихованою (ширина 0): рахуємо лише коли список має ширину
        if ($list.width() > 0) $slider.toggleClass('is-centered', width - 12 <= $list.width());
      }
      $slider.on('init reInit setPosition', centerFewSlides);
      if (window.ResizeObserver) new ResizeObserver(centerFewSlides).observe($slider[0]);
      $slider.slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        variableWidth: true,
        arrows: true,
        responsive: [{
          breakpoint: 500,
          settings: {
            slidesToShow: 2
          }
        }]
      });
    }
  }
  // Cart quantity update
  $(document).on('click', '.checkout-product-top-info-left-quantity-remove', function () {
    updateQuantity($(this), -1);
    console.log('click minus');
  });
  $(document).on('click', '.checkout-product-top-info-left-quantity-add', function () {
    const $btn = $(this);

    // 1) bump quantity in UI
    updateQuantity($btn, 1);
    console.log('click plus');
  });
  $(document).on('click', '.checkout-product-top-info-right-remove', function () {
    confirmAndRemove($(this), true);
  });
  $(document).on('click', '.checkout-form-block', function (e) {
    // Якщо клік по самому <input> або <label>, нехай стандартна обробка йде далі
    if ($(e.target).is('input[type="radio"], label')) {
      return;
    }

    // Інакше знаходимо input[type="radio"] в середині блоку...
    const $radio = $(this).find('input[type="radio"]');

    // ...і зробимо його checked
    if (!$radio.prop('checked')) {
      $radio.prop('checked', true).trigger('change');
    }
  });
  function updateQuantity(button, amount) {
    // Кнопки цього рядка блокуємо на час круговороту — інакше швидкі кліки
    // наздоганяють один одного й кількість розʼїжджається з сервером
    const $controls = button.closest('.checkout-product-top-info-left-quantity').find('.checkout-product-top-info-left-quantity-remove, .checkout-product-top-info-left-quantity-add');
    $controls.prop('disabled', true);
    const quantityElement = button.closest('.checkout-product-top-info-left-quantity').find('.checkout-product-top-info-left-quantity-text');
    const quantity = parseInt(quantityElement.is('input') ? quantityElement.val() : quantityElement.text(), 10);
    const maxQuantity = parseInt(quantityElement.data('max-val'), 10);
    const newQuantity = quantity + amount;
    if (newQuantity < 0) {
      $controls.prop('disabled', false);
      return false;
    }
    if (newQuantity > maxQuantity) {
      alert(`Максимальна кількість товару: ${maxQuantity}`);
      $controls.prop('disabled', false);
      return false;
    }

    // «−» при кількості 1 стає кошиком (і прибирає позицію)
    button.closest('.checkout-product-top-info-left-quantity').toggleClass('is-single', newQuantity === 1);

    // UI update
    if (quantityElement.is('input')) {
      quantityElement.prop('readonly', false).val(newQuantity).prop('readonly', true);
    } else {
      quantityElement.text(newQuantity);
    }
    const $readonlyInput = $('#readonlyInput');
    if ($readonlyInput.length) {
      updateInput(newQuantity);
    }
    const product = button.data('id');
    if (newQuantity > 0) {
      // Запит один і повертає готовий підсумок; кількість у рядку вже оновлено, лоадера на весь кошик немає
      $('.notification-box').removeClass('is-show');
      $.ajax({
        url: '/api/cart/update-quantity',
        type: 'POST',
        data: {
          productId: product,
          quantity: newQuantity
        },
        success(response) {
          // Відповідь уже містить готовий HTML підсумку; запасний варіант —
          // старий окремий запит, якщо сервер його чомусь не віддав
          if (!renderCartSummary(response)) {
            updateCartDisplay({
              silent: true
            });
          }
          $(`div.error[data-id="${product}"]`).hide();
          $('.checkout-form-submit').removeClass('loading');

          // ✅ Fire GA addToCart on success (only on add)
          if (amount > 0) {
            const productName = button.attr('data-product-name');
            const itemId = button.attr('data-variant-id');
            const priceRaw = button.attr('data-price');
            const category = button.attr('data-taxon');
            const variantName = button.attr('data-variant-name');
            const brand = button.attr('data-brand');
            const price = parseFloat(priceRaw.replace(/\s|₴/g, '').replace(',', '.'));
            googleAddToCart(productName, itemId, price, category, variantName, brand);
          }
        },
        error(response) {
          const responseData = JSON.parse(response.responseText);
          $(`div.error[data-id="${product}"]`).text(responseData.error);
          $controls.prop('disabled', false);
          $('.sidebar-inner').removeClass('loading');
          $('.checkout-wrapper-right').removeClass('loading');
        }
      });
    } else {
      confirmAndRemove(button, false);
    }
    return true;
  }
  function updateInput(value, $element) {
    if ($element && $element.is('input')) {
      $element.val(value);
      $element.css('width', `${$element.val().length || 1}ch`); // Minimum 1 character
    } else if ($element) {
      $element.text(value);
    }
  }
  function confirmAndRemove(button, isDirectDelete) {
    const itemWrapper = button.closest('.checkout-product-top-item-wrapper');
    const quantityElement = itemWrapper.find('.checkout-product-top-info-left-quantity-text');
    $.ajax({
      url: `/${button.data('id')}/remove`,
      type: 'DELETE',
      data: {
        _csrf_token: button.data('csrf')
      },
      success() {
        updateCartDisplay();
      },
      error(response) {
        updateCartDisplay();
        const responseData = JSON.parse(response.responseText);
        // console.log(responseData);
      }
    });
  }

  // Shopping cart click handler
  $(document).on('click', '.shopping-cart', function () {
    waitForElements('.checkout-product-top-info-left-quantity-text', function ($inputs) {
      $inputs.each(function () {
        const value = $(this).val() || $(this).text();
        updateInput(value, $(this));
      });
    });
  });

  // Shopping cart sidebar toggle
  $(document).on('click', '.shopping-cart,.open-cart', function () {
    // Кнопка в шапці лежить усередині .menu поруч зі своїм сайдбаром, а
    // нижнє мобільне меню — ні, тому для нього беремо сайдбар кошика з меню.
    const $inMenu = $(this).closest('.menu').find('.sidebar');
    const $closestSidebar = $inMenu.length ? $inMenu : $('.menu .sidebar').first();
    if ($closestSidebar.length) {
      $('.sidebar').removeClass('active'); // Close all other sidebars
      $closestSidebar.addClass('active'); // Open the closest one
      $('body').addClass('overflow');
      updateCartDisplay(); // Update cart
    }
  });

  // Close nearest sidebar when clicking on close button
  $('.sidebar-content-top-close').click(function () {
    $(this).closest('.sidebar').removeClass('active');
    $('body').removeClass('overflow');
  });
  $('.sidebar').click(function (event) {
    if ($(event.target).closest('.sidebar-content-top-close').length || event.target === this) {
      $(this).removeClass('active');
      $('body').removeClass('overflow');
    }
  });

  // Helper function to wait for elements to be available
  function waitForElements(selector, callback) {
    const checkExist = setInterval(function () {
      const $elements = $(selector);
      if ($elements.length) {
        clearInterval(checkExist);
        callback($elements);
      }
    }, 50);
    setTimeout(function () {
      clearInterval(checkExist);
    }, 5000);
  }
  $(document).on('change', '.sample-checkbox', function () {
    const $cb = $(this);

    // If any sample is checked — auto-uncheck refuse checkbox
    if ($cb.is(':checked')) {
      const $brand = $cb.closest('.sample-sidebar-brand');
      const $refuseCheckbox = $brand.find('.sample-refuse-checkbox');
      if ($refuseCheckbox.is(':checked')) {
        $refuseCheckbox.prop('checked', false);
        applySampleRefuseState($brand.find('.sample-checkbox'), $refuseCheckbox);
      }
    }

    // Remove error state on interaction
    $cb.removeClass('error');
    const variantId = $cb.data('id');
    const csrfToken = $cb.data('csrf');
    const isChecked = $cb.is(':checked');
    const url = isChecked ? '/cart/add-one' : '/cart/remove-one';

    // GA data attributes
    const productName = $cb.data('product-name');
    const itemId = $cb.data('variant-id');
    const price = parseFloat($cb.data('price'));
    const category = $cb.data('taxon');
    const variantName = $cb.data('variant-name');
    const brand = $cb.data('brand');
    $.ajax({
      url: url,
      method: 'POST',
      data: {
        variantId: variantId,
        csrfToken: csrfToken
      },
      success(response) {
        // update counters and HTML
        updateCountCurt(response.count);
        paintCart(response.html);

        // ✅ Fire GA add_to_cart event only if checked
        if (isChecked) {
          googleAddToCart(productName, itemId, price, category, variantName, brand);
        }
      },
      error(xhr) {
        var _xhr$responseJSON2;
        const err = ((_xhr$responseJSON2 = xhr.responseJSON) === null || _xhr$responseJSON2 === void 0 ? void 0 : _xhr$responseJSON2.error) || 'Помилка оновлення кошика.';
        alert(err);
        $cb.prop('checked', !isChecked); // rollback state
      },
      complete() {
        $('.sidebar-inner, .checkout-wrapper-right').removeClass('loading');
      }
    });
  });

  // -----------------------------------------------------------------------
  // Sample refuse checkbox logic
  // - Checking "refuse" disables all sample-checkbox inputs
  // - Unchecking "refuse" re-enables them
  // - Checking any sample-checkbox auto-unchecks and disables refuse
  // Called on init and after every updateCartDisplay
  // -----------------------------------------------------------------------
  function initSampleRefuse() {
    const $brand = $('.sample-sidebar-brand');
    if (!$brand.length) return;
    const $sampleCheckboxes = $brand.find('.sample-checkbox');
    const $refuseCheckbox = $brand.find('.sample-refuse-checkbox');
    if (!$refuseCheckbox.length) return;
    if ($refuseCheckbox.is(':checked')) {
      // Refuse is already checked (rendered from server) —
      // just disable sample checkboxes WITHOUT touching their checked state
      // The server already rendered them correctly (checked = in cart, disabled = refuse active)
      $sampleCheckboxes.each(function () {
        $(this).prop('disabled', true);
        $(this).closest('.sample-card').addClass('disabled');
      });
    } else {
      // Refuse not checked — ensure sample checkboxes are enabled
      $sampleCheckboxes.each(function () {
        $(this).prop('disabled', false);
        $(this).closest('.sample-card').removeClass('disabled');
      });
    }
  }
  function applySampleRefuseState($sampleCheckboxes, $refuseCheckbox) {
    if ($refuseCheckbox.is(':checked')) {
      // Refuse is checked — save each checkbox state to sessionStorage,
      // then disable WITHOUT unchecking (visual state preserved)
      $sampleCheckboxes.each(function () {
        const $cb = $(this);
        const key = 'sample-was-checked-' + $cb.attr('id');
        sessionStorage.setItem(key, $cb.is(':checked') ? '1' : '0');
        $cb.prop('disabled', true);
        $cb.closest('.sample-card').addClass('disabled');
      });
    } else {
      // Refuse is unchecked — re-enable and restore previously selected state
      $sampleCheckboxes.each(function () {
        const $cb = $(this);
        const key = 'sample-was-checked-' + $cb.attr('id');
        const wasChecked = sessionStorage.getItem(key) === '1';
        $cb.prop('disabled', false);
        if (wasChecked) {
          $cb.prop('checked', true);
        }
        $cb.closest('.sample-card').removeClass('disabled');
        sessionStorage.removeItem(key);
      });
    }
  }

  // When refuse checkbox changes — persist to server and update UI
  $(document).on('change', '.sample-refuse-checkbox', function () {
    const $refuseCheckbox = $(this);
    const $brand = $refuseCheckbox.closest('.sample-sidebar-brand');
    const $sampleCheckboxes = $brand.find('.sample-checkbox');
    const isRefused = $refuseCheckbox.is(':checked');

    // Remove error state
    $refuseCheckbox.removeClass('error');
    $sampleCheckboxes.removeClass('error');

    // Apply UI immediately
    applySampleRefuseState($sampleCheckboxes, $refuseCheckbox);

    // Persist choice in session via server
    resetGiftNudge();
    syncGiftCta();
    $.ajax({
      url: '/api/cart/refuse-samples',
      method: 'POST',
      data: {
        refuse: isRefused ? '1' : '0'
      },
      error() {
        // Rollback UI on failure
        $refuseCheckbox.prop('checked', !isRefused);
        applySampleRefuseState($sampleCheckboxes, $refuseCheckbox);
      }
    });
  });

  // ------------------------------------------------------------------
  // Подарунки-семпли: нагадуємо, але не тримаємо в кошику силою.
  // Перший клік по «Замовити» без обраного подарунка веде до вибору й міняє
  // підпис кнопки на «Без подарунків»; другий — пропускає на оформлення.
  // Лічильник живе в межах сесії: людина, яка вже відмахнулась, не проходить
  // це коло вдруге. Підпис кнопки перемальовується разом із кошиком.
  // ------------------------------------------------------------------
  const GIFT_NUDGE_KEY = 'giftNudgeCount';
  const GIFT_NUDGE_LIMIT = 2;
  function giftNudgeCount() {
    try {
      return parseInt(sessionStorage.getItem(GIFT_NUDGE_KEY), 10) || 0;
    } catch (err) {
      return 0;
    }
  }
  function resetGiftNudge() {
    try {
      sessionStorage.removeItem(GIFT_NUDGE_KEY);
    } catch (err) {/* приватний режим */}
  }
  function bumpGiftNudge() {
    const next = giftNudgeCount() + 1;
    try {
      sessionStorage.setItem(GIFT_NUDGE_KEY, String(next));
    } catch (err) {/* приватний режим — просто не запам'ятаємо */}
    return next;
  }

  // Ще є подарунки, які людина могла б обрати, і вона від них не відмовилась.
  // Квоту рахує сервер: коли набори вичерпано, решту чекбоксів він віддає
  // disabled, тому «усе обрано або вимкнено» і означає «ліміт використано».
  function giftsPending() {
    const $brand = $('.sample-sidebar-brand').first();
    if (!$brand.length) return false;
    const $sampleCheckboxes = $brand.find('.sample-checkbox');
    if (!$sampleCheckboxes.length) return false;
    if ($brand.find('.sample-refuse-checkbox').is(':checked')) return false;
    return !$sampleCheckboxes.toArray().every(function (cb) {
      return $(cb).is(':checked') || $(cb).is(':disabled');
    });
  }
  function syncGiftCta() {
    const pending = giftsPending();
    if (!pending) resetGiftNudge();
    const skip = pending && giftNudgeCount() > 0;
    // лише кнопка кошика: на сторінці оформлення є ще submit форми з тим самим класом
    $('.cart__checkout .checkout-form-submit').toggleClass('is-skip-gifts', skip).find('.checkout-form-submit-text').text(skip ? 'Без подарунків' : 'Замовити');
  }

  // Сайдбар кошика прокручується всередині себе, сторінка оформлення — вікном
  function scrollToGifts() {
    const target = $('.sample-sidebar').get(0);
    if (!target) return;

    // На десктопі подарунки — власна фіксована колонка на весь екран: вона
    // і так перед очима, прокручувати нічого не треба
    if (window.getComputedStyle(target).position === 'fixed') {
      return;
    }

    // найближчий предок, який справді має власний скрол
    let box = target.parentElement;
    while (box && box !== document.body) {
      const style = window.getComputedStyle(box);
      if (/(auto|scroll)/.test(style.overflowY) && box.scrollHeight > box.clientHeight) break;
      box = box.parentElement;
    }
    const scrolls = box && box !== document.body;
    const viewTop = scrolls ? box.getBoundingClientRect().top : 0;
    const viewBottom = scrolls ? box.getBoundingClientRect().bottom : window.innerHeight;
    const targetTop = target.getBoundingClientRect().top;

    // Панель уже у верхній половині видимої області — смикати нічого не треба
    if (targetTop >= viewTop - 1 && targetTop <= viewTop + (viewBottom - viewTop) * 0.5) {
      return;
    }
    if (!scrolls) {
      $('html, body').animate({
        scrollTop: $(target).offset().top - 20
      }, 400);
      return;
    }
    box.scrollTo({
      top: box.scrollTop + targetTop - viewTop - 12,
      behavior: 'smooth'
    });
  }

  // «Тицьни сюди»: рука з ripple над карткою подарунка, поки вибір не зроблено (як у прототипі).
  // Показуємо над першою повністю видимою карткою, найкраще другою; зникає, щойно щось обрано
  function showGiftHint() {
    const $viewport = $('.sample-viewport').first();
    if (!$viewport.length || $viewport.find('.tap-hint').length) return;
    const vp = $viewport[0].getBoundingClientRect();
    const cards = $viewport.find('.sample-card:not(.disabled)').toArray();
    const visible = cards.filter(function (card) {
      const r = card.getBoundingClientRect();
      return r.left >= vp.left && r.right <= vp.right;
    });
    const card = visible[1] || visible[0] || cards[0];
    if (!card) return;
    const r = card.getBoundingClientRect();
    $viewport.append('<span class="tap-hint" aria-hidden="true" style="--start:700ms;left:' + Math.round(r.left - vp.left + r.width * 0.4) + 'px;top:' + Math.round(r.top - vp.top + r.height * 0.65) + 'px">' + '<span class="tap-hint__ripples"><span class="tap-hint__ring" style="--i:0"></span><span class="tap-hint__ring" style="--i:1"></span><span class="tap-hint__ring" style="--i:2"></span></span>' + '<span class="tap-hint__hand"><span class="tap-hint__finger"></span></span></span>');
  }

  // Стрілки стрічки подарунків: показуємо ту, куди ще є що гортати
  function syncGiftArrows() {
    $('.sample-viewport').each(function () {
      const track = $(this).find('.sample-cards').get(0);
      if (!track) return;
      const max = track.scrollWidth - track.clientWidth;
      $(this).find('.sample-arrow--prev').toggleClass('is-shown', track.scrollLeft > 4);
      $(this).find('.sample-arrow--next').toggleClass('is-shown', max > 4 && track.scrollLeft < max - 4);
    });
  }
  $(document).on('click', '.sample-arrow', function () {
    const track = $(this).siblings('.sample-cards').get(0);
    if (!track) return;
    const dir = $(this).hasClass('sample-arrow--next') ? 1 : -1;
    track.scrollBy({
      left: dir * Math.max(track.clientWidth - 60, 135),
      behavior: 'smooth'
    });
  });

  // scroll не спливає — ловимо на фазі занурення
  document.addEventListener('scroll', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('sample-cards')) syncGiftArrows();
  }, true);
  $(window).on('resize', syncGiftArrows);
  $(document).on('cart:painted', syncGiftArrows);
  $(document).on('click', '.sample-card', function () {
    const $hint = $('.tap-hint').addClass('is-leaving');
    setTimeout(function () {
      $hint.remove();
    }, 180);

    // Подарунків можна обрати кілька, і ми не знаємо, чи людина зупиниться: після будь-якого вибору
    // кнопка знову «Замовити», а не «Без подарунків». Нагадування спрацює при наступному кліку по ній
    resetGiftNudge();
    syncGiftCta();
  });
  $(document).on('click', '.checkout-form-submit', function (e) {
    if (!giftsPending()) {
      resetGiftNudge();
      return;
    }
    const nudge = bumpGiftNudge();

    // Наполягли достатньо — далі не заважаємо
    if (nudge >= GIFT_NUDGE_LIMIT) {
      resetGiftNudge();
      return;
    }
    e.preventDefault();
    e.stopImmediatePropagation();
    syncGiftCta();
    scrollToGifts();
    showGiftHint();
  });

  // ------------------------------------------------------------------
  // Промокод у кошику (шторка й права колонка чекауту — одна розмітка)
  // ------------------------------------------------------------------
  function couponRequest(url, data, $btn) {
    const $areas = $('.sidebar-inner, .checkout-wrapper-right');
    $areas.addClass('loading');
    $btn.addClass('loading');
    return $.ajax({
      url,
      method: 'POST',
      data,
      dataType: 'json'
    }).always(() => {
      $areas.removeClass('loading');
      $btn.removeClass('loading');
    });
  }

  // Відкриває/закриває поле промокоду; після відкриття ставимо в нього курсор
  $(document).on('click', '.checkout-product-top-extra-promo-main', function () {
    const $header = $(this);
    const $form = $header.siblings('.checkout-product-top-extra-promo-form');
    $header.toggleClass('active');
    $form.toggleClass('active');
    if ($form.hasClass('active')) {
      // фокус після розгортання: у фокусі рамка темна й товстіша, а під час росту висоти вона була б видна
      // обрізаною. Без прокрутки: контейнер уже на місці
      setTimeout(() => {
        if ($form.hasClass('active')) $form.find('input').first()[0].focus({
          preventScroll: true
        });
      }, 240);
    }
  });
  $(document).on('submit', '.js-coupon-form', function (e) {
    e.preventDefault();
    // форма може лежати всередині іншої (чекаут) — її submit не має ставати відправкою замовлення
    e.stopPropagation();
    const $form = $(this);
    const $input = $form.find('#promo');
    const code = $input.val().trim();
    const $btn = $form.find('button');
    // помилка лежить поза формою, поруч із нею
    const $error = $form.siblings('.js-coupon-error');
    $error.text('');
    if (!code) {
      $error.text('Промокод не може бути порожнім');
      return;
    }
    couponRequest($form.attr('action'), {
      coupon: code,
      _csrf_token: $input.data('csrf'),
      // ліміт промокоду на одну людину рахується і за телефоном/email з форми оформлення
      phone: window.SkinPhoneMask ? window.SkinPhoneMask.toLegacy($('#phone').val()) : ($('#phone').val() || '').trim(),
      email: ($('#email').val() || '').trim()
    }, $btn).done(response => {
      renderCartSummary(response);
    }).fail(xhr => {
      var _xhr$responseJSON3;
      $error.text(((_xhr$responseJSON3 = xhr.responseJSON) === null || _xhr$responseJSON3 === void 0 ? void 0 : _xhr$responseJSON3.error) || 'Сталася помилка. Спробуйте пізніше.');
    });
  });
  $(document).on('click', '.js-remove-coupon', function (e) {
    e.preventDefault();
    const $btn = $(this);
    couponRequest($btn.data('remove-url') || '/cart/remove-coupon', {
      _csrf_token: $btn.data('csrf')
    }, $btn).done(response => {
      renderCartSummary(response);
    }).fail(xhr => {
      var _xhr$responseJSON4;
      alert(((_xhr$responseJSON4 = xhr.responseJSON) === null || _xhr$responseJSON4 === void 0 ? void 0 : _xhr$responseJSON4.error) || 'Помилка при видаленні');
    });
  });

  // Init on page load
  initSampleRefuse();
  $('.notification-box__close').on('click', function (event) {
    event.preventDefault();
    if ($('.notification-box').length) {
      $('.notification-box').removeClass('is-show');
      setTimeout(function () {
        $('.notification-box').css('display', 'none');
      }, 600);
    }
  });
}

/***/ }),

/***/ "./public/assets/shop/js/parts/header.js":
/*!***********************************************!*\
  !*** ./public/assets/shop/js/parts/header.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   header: () => (/* binding */ header)
/* harmony export */ });
function header() {
  // 1. DOM Elements (Vanilla)
  const menu = document.querySelector('.menu');
  const menuItems = document.querySelectorAll('.menu-main-item');
  const catalogs = document.querySelectorAll('.catalog');
  // const menuLink = document.querySelector('.menu-main-link');
  const menuMain = document.querySelector('.menu-main');

  // 2. Search Overlay Logic
  function initSearchOverlay() {
    const $body = $('body');
    const $searchBtn = $body.find('.search-btn a');
    const $searchData = $body.find('.search-box');
    const $searchForm = $searchData.find('.search-box__wrapper');
    const $searchClose = $searchData.find('.btn-close');
    $searchBtn.on('click', function (e) {
      e.stopPropagation();
      $searchData.addClass('is-active');
    });
    $searchData.on('click', function (e) {
      if (!$searchForm.is(e.target) && $searchForm.has(e.target).length === 0) {
        $searchData.removeClass('is-active');
      }
    });
    $searchClose.on('click', function (e) {
      e.preventDefault();
      $searchData.removeClass('is-active');
    });
  }
  initSearchOverlay();

  // 3. Search Slider Initialization
  function initSearchSlider() {
    const $searchSlider = $('.search-products-list');
    $searchSlider.each(function () {
      if ($(this).hasClass('slick-initialized')) {
        return;
      }
      $(this).slick({
        infinite: false,
        arrows: true,
        mobileFirst: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        focusOnSelect: true,
        dots: true,
        responsive: [{
          breakpoint: 1023,
          settings: {
            slidesToShow: 4,
            swipe: false,
            draggable: false,
            dots: false
          }
        }]
      });
    });
  }
  initSearchSlider();

  // 4. Message Bar Slider
  function initMessageBarSlider() {
    const $sliders = $('.message-bar__slider');
    $sliders.each(function () {
      const $slider = $(this);
      if ($slider.hasClass('slick-initialized')) {
        $slider.slick('unslick');
      }
      $slider.slick({
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
        mobileFirst: true,
        slidesToShow: 1,
        variableWidth: true
      });
    });
  }
  initMessageBarSlider();

  // 5. Меню-каталог на десктопі: розкривається наведенням, а клік по пункту
  // веде на його сторінку (каталог відкривається кліком, як і будь-яке
  // посилання) — поведінка, яка була до редизайну 2026.
  const desktopMenu = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  (function initDesktopDropdowns() {
    if (!menuMain) return;
    function catalogIsEmpty(catalog) {
      const catalogIn = catalog === null || catalog === void 0 ? void 0 : catalog.querySelector('.catalog-in');
      if (!catalogIn) return true;
      return catalogIn.textContent.trim() === '';
    }
    function closeAll() {
      menu === null || menu === void 0 || menu.classList.remove('active');
      menuItems.forEach(item => {
        item.classList.remove('active');
        const link = item.querySelector('.menu-main-link');
        link === null || link === void 0 || link.classList.remove('active');
        if (link !== null && link !== void 0 && link.hasAttribute('aria-haspopup')) {
          link.setAttribute('aria-expanded', 'false');
        }
      });
      catalogs.forEach(catalog => {
        catalog.classList.remove('active');
      });
    }
    function openDropdown(item, catalog) {
      closeAll();
      menu === null || menu === void 0 || menu.classList.add('active');
      item.classList.add('active');
      const link = item.querySelector('.menu-main-link');
      link === null || link === void 0 || link.classList.add('active');
      link === null || link === void 0 || link.setAttribute('aria-expanded', 'true');
      catalog.classList.add('active');
    }
    menuItems.forEach(item => {
      const catalog = document.querySelector(`.catalog[data-parent-id="${item.dataset.menuId}"]`);
      const link = item.querySelector('.menu-main-link');
      if (!link || !catalog || catalogIsEmpty(catalog)) return;
      link.setAttribute('aria-haspopup', 'true');
      link.setAttribute('aria-expanded', 'false');

      // навели на пункт — розкрили його панель; клік лишається звичайним
      // переходом за посиланням (на мобільному працює висувне меню)
      item.addEventListener('mouseenter', function () {
        if (!desktopMenu.matches) return;
        openDropdown(item, catalog);
      });

      // панель лежить під шапкою: поки курсор у ній — вона відкрита
      catalog.addEventListener('mouseenter', function () {
        if (!desktopMenu.matches) return;
        openDropdown(item, catalog);
      });
      catalog.addEventListener('mouseleave', function () {
        if (!desktopMenu.matches) return;
        closeAll();
      });
    });
    menuMain.addEventListener('mouseleave', function () {
      if (!desktopMenu.matches) return;
      closeAll();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });
    desktopMenu.addEventListener('change', closeAll);
  })();
  function initAjaxSearch() {
    const $input = $('#search-input');
    const $form = $('.search-form');

    // Safety check: Don't run this if the input isn't on the page
    if (!$input.length) return;
    const $container = $('#search-results-container');
    const $default = $('#search-results-default');
    const $hint = $('.js-search-hint');
    const searchUrl = $form.attr('action');
    let typingTimer;
    const doneTypingInterval = 300;

    // FIX 1: Go by URL on Enter (only block if query is too short)
    $form.off('submit').on('submit', function (e) {
      const query = $input.val().trim();
      // If the input is empty or less than 3 chars, don't submit the form
      if (query.length < 3) {
        e.preventDefault();
      }
      // Otherwise, the browser handles the submit naturally and navigates to the search page.
    });
    $input.off('input').on('input', function () {
      clearTimeout(typingTimer);
      const query = $(this).val().trim();

      // 1. Empty field
      if (query.length === 0) {
        $default.removeClass('is-hidden');
        $container.addClass('is-hidden').removeClass('is-loading');
        $hint.addClass('is-hidden');
        return;
      }

      // 2. Not enough characters
      if (query.length < 3) {
        const charsLeft = 3 - query.length;
        $hint.text(`Введіть ще ${charsLeft} символ(и) для пошуку...`).removeClass('is-hidden');
        $default.removeClass('is-hidden');
        $container.addClass('is-hidden').removeClass('is-loading');
        return;
      }

      // 3. Ready to search
      $hint.addClass('is-hidden');
      typingTimer = setTimeout(function () {
        $default.addClass('is-hidden');
        $container.removeClass('is-hidden').addClass('is-loading');
        $.ajax({
          url: searchUrl,
          method: 'GET',
          data: {
            q: query,
            is_ajax: 1
          },
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          },
          success: function success(htmlResponse) {
            $container.html(htmlResponse);
            $container.removeClass('is-loading');

            // FIX 2: Replace /catalog href with the actual search results URL
            const fullSearchUrl = searchUrl + '?q=' + encodeURIComponent(query);
            $container.find('a[href="/catalog"]').attr('href', fullSearchUrl);

            // Re-initialize slider because new DOM elements were just injected
            if (typeof initSearchSlider === 'function') {
              initSearchSlider();
            }
          },
          error: function error() {
            console.error('Помилка пошуку');
            $container.removeClass('is-loading');
          }
        });
      }, doneTypingInterval);
    });
  }
  initAjaxSearch();

  // 6. Висота шапки для фіксованих панелей (--header-offset)
  // Стрічка-анонс на вузьких екранах переносить рядки, тож рахуємо фактичну
  // нижню межу рядка шапки, а не константу.
  function syncHeaderOffset() {
    const row = document.querySelector('.menu-in');
    if (!row) return;
    const bottom = Math.max(0, Math.round(row.getBoundingClientRect().bottom));
    document.body.style.setProperty('--header-offset', bottom + 'px');
  }
  syncHeaderOffset();
  $(window).on('resize.headerOffset', syncHeaderOffset);

  // 7. Announcement Bar

  function announcementBar() {
    const $body = $('body');
    const $announcement = $body.find('.announcement-bar');
    function announcement() {
      syncHeaderOffset();
      if ($announcement.length) {
        const scrollTop = $(window).scrollTop();
        const threshold = $(window).width() > 767 ? 50 : 69;
        if (scrollTop > threshold) {
          $body.addClass('no-announcement');
        } else {
          $body.removeClass('no-announcement');
        }
      } else {
        $body.addClass('no-announcement');
      }
    }
    announcement();
    $(window).off('scroll').on('scroll', announcement);
  }
  announcementBar();
}

/***/ }),

/***/ "./public/assets/shop/js/parts/lazyImages.js":
/*!***************************************************!*\
  !*** ./public/assets/shop/js/parts/lazyImages.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   initLazyImages: () => (/* binding */ initLazyImages)
/* harmony export */ });
/* harmony import */ var _global_lazyLoad__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../global/lazyLoad */ "./public/assets/shop/js/global/lazyLoad.js");
/* global document, MutationObserver */


/**
 * Initialize lazy loading for images, including dynamically loaded content
 */
function initLazyImages() {
  // Apply lazy loading to all existing images
  (0,_global_lazyLoad__WEBPACK_IMPORTED_MODULE_0__.lazyLoadImages)();

  // Set up a MutationObserver to watch for dynamically added images
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if any of the added nodes are images or contain images
        mutation.addedNodes.forEach(node => {
          // If it's an element node
          if (node.nodeType === 1) {
            // If it's an image
            if (node.tagName === 'IMG') {
              if (!node.hasAttribute('loading')) {
                node.setAttribute('loading', 'lazy');
              }
            } else if (node.querySelectorAll) {
              // If it contains images
              (0,_global_lazyLoad__WEBPACK_IMPORTED_MODULE_0__.lazyLoadImages)(node);
            }
          }
        });
      }
    });
  });

  // Start observing the document with the configured parameters
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  return observer;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (initLazyImages);

/***/ }),

/***/ "./public/assets/shop/js/parts/mobileMenu.js":
/*!***************************************************!*\
  !*** ./public/assets/shop/js/parts/mobileMenu.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ initMobileMenu)
/* harmony export */ });
/* global $ */
function initMobileMenu() {
  function closeMobileMenu() {
    $('#burger, body, .menu-main-mobile-all, .menu-main-mobile-account, #account').removeClass('active');
    $('.menu-main-mobile-all').removeClass('on-it');
    $('.menu-main-mobile-catalog').removeClass('active');
    $('#menu').removeClass('mobile');
    $('#burger').attr('aria-expanded', 'false');
  }

  // Burger menu toggle
  $('#burger').on('click', () => {
    const isAccountActive = $('#burger').hasClass('active');

    // Якщо була відкрита account-панель — закриваємо її теж
    if (isAccountActive) {
      closeMobileMenu();
    } else {
      $('#burger, body, .menu-main-mobile-all').addClass('active');
      $('#menu').addClass('mobile');
      $('#burger').attr('aria-expanded', 'true');
    }
  });

  // Бургер доступний з клавіатури: він не <button>, тому Enter/Space вручну
  $('#burger').on('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      $('#burger').trigger('click');
    }
  });
  $(document).on('keydown', e => {
    if (e.key === 'Escape' && $('#burger').hasClass('active')) {
      closeMobileMenu();
    }
  });

  // Mobile search toggle
  $('.search-btn-mobile').on('click', () => {
    $('.menu').toggleClass('search-active');
    $('.menu-main-mobile-all').toggleClass('on-it');
    $('.menu-additional-search').toggleClass('active');
  });

  // Mobile menu item icon click (open submenu)
  $('.menu-main-mobile-item-icon, .menu-main-mobile-link-sub').on('click', function () {
    const menuId = $(this).data('id');
    $(`#item_${menuId}`).addClass('active');
    $('.menu-main-mobile-all').addClass('on-it');
  });

  // Back from submenu
  $('.menu-main-mobile-catalog-title').on('click', function () {
    const menuId = $(this).closest('.menu-main-mobile-catalog').data('menu-id');
    $(`#item_${menuId}`).removeClass('active');
    $('.menu-main-mobile-all').removeClass('on-it');
  });

  // Nested submenu toggle
  $('.menu-main-mobile-link-sub-sub, .menu-main-mobile-catalog-header-icon').on('click', function () {
    const $inner = $(this).closest('.menu-main-mobile-catalog-inner');
    const isActive = $inner.hasClass('active');

    // Collapse all first
    $('.menu-main-mobile-catalog-inner').removeClass('active');

    // Expand clicked one
    if (!isActive) {
      $inner.addClass('active');
    }
  });

  // ✅ New: Account panel toggle
  $('#account').on('click', () => {
    $('#account').toggleClass('active');
    $('#burger, #account, body, .menu-main-mobile-account').toggleClass('active');
    $('#menu').toggleClass('mobile');
  });
}

/***/ }),

/***/ "./public/assets/shop/js/parts/popup.js":
/*!**********************************************!*\
  !*** ./public/assets/shop/js/parts/popup.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ initPopups)
/* harmony export */ });
/* global $, document, window */

// Copy the product preview (image / name / capacity / price) into the out-of-stock
// popup card, so the customer sees the product they are subscribing to instead of
// the hardcoded placeholder. The button can live in a listing card (catalog /
// related / schema) or on the product detail page, so the source is resolved from
// the clicked button's nearest product container.
function fillOutOfStockProduct(btn) {
  const $card = $('.out-of-stock-popup .popup-product');
  if (!$card.length) return;

  // Nearest product container: a listing card, or the whole detail page.
  const $src = $(btn).closest('.catalog-shema-item, .p-card, .product, .wayfx-product').first();
  const $page = $src.length ? $src : $('.wayfx-product').first();
  if (!$page.length) return;

  // The detail gallery is a slick slider that clones/reorders slides, so prefer
  // the visible slide, then the first real slide. Listing cards expose a single
  // image. Only use an <img> that actually has a src.
  const $img = $page.find('.catalog-shema-item-image img,' + '.product-image,' + '.wayfx-product__featured-photo .slick-current img,' + '.wayfx-product__featured-photo .slick-slide:not(.slick-cloned) img,' + '.wayfx-product__featured-photo img,' + '.ultra__img-holder img,' + '.wayfx-product__photos-wrapper img').filter(function () {
    return Boolean(this.getAttribute('src'));
  }).first();
  if ($img.length) {
    $card.find('.img-holder img').attr('src', $img.attr('src')).attr('alt', $img.attr('alt') || '').attr('title', $img.attr('title') || '');
  }
  const name = $page.find('.catalog-shema-item-name, .product-name, .wayfx-product__title').first().text().trim();
  if (name) $card.find('.product-info .row').first().find('p').text(name);
  const capacity = $page.find('.product-capacity').first().text().trim();
  $card.find('.product-capacity').text(capacity).toggle(Boolean(capacity));
  const price = $page.find('.catalog-shema-item-price-new,' + '.product-price-new,' + '.wayfx-product__additional--info--description--item.price').first().text().trim();
  if (price) $card.find('.price').text(price);
  const oldPrice = $page.find('.catalog-shema-item-price-old, .product-price-old, .old-price').first().text().trim();
  const $oldPrice = $card.find('.wayfx-product__additional--form--select--options--right--price--old');
  if (oldPrice) {
    $oldPrice.text(oldPrice).show();
  } else {
    $oldPrice.text('').hide();
  }
}
function initPopups() {
  // Out of stock popup
  $(document).on('click', '.out-of-stock,.out-of-stock-button', function () {
    // Refresh the preview from the clicked product before showing the popup
    fillOutOfStockProduct(this);
    // Reset the form back to its initial state (in case it was already submitted)
    const $form = $('.out-of-stock-form');
    $form.removeClass('sent');
    $form.find('.popup-form-error').removeClass('active');
    $form.find('#popup-email').removeClass('error');
    // Show the element smoothly over 0.5 seconds (500 ms)
    $('.out-of-stock-popup').fadeIn(500);
    $('#popup-product').val($(this).data('id'));
  });

  // Close popup when clicking on background (.popup) or close button
  $(document).on('click', '.popup-close, .popup', () => {
    $('.popup').fadeOut(500);
  });

  // «Вже маєш Skin(ID)? Увійти» у промо-картці каталогу: та сама форма, що й на
  // /login, тільки в попапі. Саму форму оживляє build/shop/login.js
  $(document).on('click', '.js-login-popup', function (e) {
    e.preventDefault();
    const $popup = $('.login-popup');
    if (!$popup.length) {
      window.location.href = '/login';
      return;
    }
    $popup.fadeIn(300);
    $popup.find('#lg-phone').trigger('focus');
  });

  // Prevent popup from closing when clicking inside .popup-content
  $(document).on('click', '.popup-inner, .popup__wrapper', e => {
    e.stopPropagation();
  });

  // Clear the error state as soon as the user starts fixing the email
  $(document).on('input', '.out-of-stock-form #popup-email', function () {
    $(this).removeClass('error');
    $(this).closest('.out-of-stock-form').find('.popup-form-error').removeClass('active');
  });

  // Handle out of stock form submission
  $(document).on('submit', '.out-of-stock-form', function (e) {
    e.preventDefault();
    const form = $(this);
    const $error = form.find('.popup-form-error');

    // Do not send the request with an empty / invalid email
    const $email = form.find('#popup-email, input[name="email"]');
    const email = ($email.val() || '').trim();
    const emailError = window.SkinEmail ? window.SkinEmail.error(email) : /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(email) ? null : 'Введіть коректний email';
    if (emailError) {
      $email.addClass('error').trigger('focus');
      $error.text(emailError).addClass('active');
      return;
    }
    $email.removeClass('error');
    $error.removeClass('active');
    const formData = form.serialize();
    $('.popup-form-button').addClass('loading');
    $.ajax({
      url: '/api/ajax/request',
      type: 'POST',
      data: formData,
      dataType: 'json',
      success(response) {
        $('.popup-form-button').removeClass('loading');
        if (response && response.data === 'success') {
          // Show the success state (.completed elements) via the `sent` class
          form.addClass('sent');
          setTimeout(() => {
            $('.out-of-stock-popup').fadeOut(500);
          }, 2500);
        } else {
          $error.text('Сталася помилка. Спробуйте ще раз.').addClass('active');
        }
      },
      error(xhr) {
        $('.popup-form-button').removeClass('loading');
        // Show the backend's (localised) message only for validation errors (4xx);
        // for server/network errors fall back to a friendly message.
        const isClientError = xhr && xhr.status >= 400 && xhr.status < 500;
        const msg = isClientError && xhr.responseJSON && xhr.responseJSON.message || 'Сталася помилка. Спробуйте ще раз.';
        $error.text(msg).addClass('active');
      }
    });
  });
}

/***/ }),

/***/ "./public/assets/shop/js/parts/product.js":
/*!************************************************!*\
  !*** ./public/assets/shop/js/parts/product.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ initProductInteractions)
/* harmony export */ });
/* global $, window, document */
function initProductInteractions() {
  // Event delegation for hover events on products
  const desktopMq = window.matchMedia('(min-width: 769px)');
  function bindProductHover() {
    $('body').on('mouseenter.productHover mouseleave.productHover', '.product', function (event) {
      const $product = $(this);

      // toggle .active
      $product.toggleClass('active', event.type === 'mouseenter');
    });
  }
  function unbindProductHover() {
    $('body').off('.productHover');
  }

  // Listen for changes (e.g. if you resize in devtools)
  desktopMq.addListener(e => {
    if (e.matches) bindProductHover();else unbindProductHover();
  });

  // Run once on load
  if (desktopMq.matches) {
    bindProductHover();
  }

  // Truncate product descriptions
  $('.product-description').each(function () {
    const text = $(this).text();
    if (text.length > 100) {
      const truncatedText = `${text.slice(0, 100)}...`;
      $(this).text(truncatedText);
    }
  });

  // Wishlist functionality
  $(document).on('click', '.product-heart,.wayfx-product__additional--form--favourite', function (e) {
    e.preventDefault();
    const $heart = $(this);
    const productId = $heart.data('id');
    const user = $heart.data('user');
    const wishlistType = $heart.data('type') || 'wishlist';
    const isCurrentlyAdded = $heart.hasClass('added');
    if (user === 0) {
      $('.need-login').show();
      $('.need-login').html('<div class="popup-inner">\n' + '    <div class="popup-close"></div>\n' + '    <div class="popup-message-text">\n' + '      <span>\n' + '        Доступний лише для зареєстрованих користувачів\n' + '      </span>\n' + '      <a href="/register" class="btn js-register-link">Зареєструватись</a>\n' + '      <a href="/login" class="btn-simple js-login-link">Я вже маю аккаунт</a>\n' + '    </div>\n' + '  </div>');
      return;
    }
    if (!isCurrentlyAdded) {
      // Add product to wishlist
      $.ajax({
        url: `/wishlists/${wishlistType}/add`,
        type: 'POST',
        data: {
          product_id: [productId]
        },
        success(response) {
          $heart.addClass('added');
          $('#wish-counter').text(response.count);
          console.log('Product added to wishlist:', response);
        },
        error(xhr) {
          console.error('Error adding product:', xhr);
        }
      });
    } else {
      // Remove product from wishlist
      $.ajax({
        url: `/wishlists/${wishlistType}/remove/${productId}`,
        type: 'DELETE',
        success(response) {
          $heart.removeClass('added');
          $('#wish-counter').text(response.count);
          console.log('Product removed from wishlist:', response);
        },
        error(xhr) {
          console.error('Error removing product:', xhr);
        }
      });
    }
  });

  // Remove product from shelf
  $(document).on('click', '.product-remove-shelf', function (e) {
    e.preventDefault();
    const $heart = $(this);
    const productId = $heart.data('id');
    $.ajax({
      url: `/wishlists/shelf/remove/${productId}`,
      type: 'DELETE',
      success() {
        window.location.reload();
      },
      error(xhr) {
        console.error('Error removing product:', xhr);
        window.location.reload();
      }
    });
  });

  // Delivery popup
  $(document).on('click', '.wayfx-product__additional--info--description--item.delivery', function () {
    // Show the element smoothly over 0.5 seconds (500 ms)
    $('.delivery-popup').show();
  });

  // Parts pay popup
  function formatUahAmount(amount) {
    return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  function updatePartsPayPopup() {
    const $popup = $('.parts-pay-popup');
    const price = parseInt($popup.find('.choose-bank').data('price'), 10);
    if (!price) return;
    $popup.find('.choose-bank .row').each(function () {
      const $row = $(this);
      const months = parseInt($row.find('select').val(), 10) || 3;
      const monthly = Math.ceil(price / months);
      $row.find('.for-month').text(`${formatUahAmount(monthly)}₴/міс`);
      if ($row.find('input[name="bank"]').prop('checked')) {
        $popup.find('.parts-pay-popup__footer .monthly-price').text(`${formatUahAmount(monthly)} ₴`);
      }
    });
  }
  $(document).on('change', '.parts-pay-popup .choose-bank select, .parts-pay-popup .choose-bank input[name="bank"]', updatePartsPayPopup);

  // A product page carries several .sylius-product-adding-to-cart forms — the
  // main panel, the sticky panel and every related-product card render one — so
  // the popup keeps a reference to the form it was opened from. Submitting the
  // whole set added the product twice and dropped the related products into the
  // cart as well.
  let $partsPayForm = $();
  function mainProductForm($opener) {
    const $scoped = $opener.closest('.product-form-panel, .product-sticky-panel').find('.sylius-product-adding-to-cart').first();
    if ($scoped.length) return $scoped;
    return $('.product-form-panel .sylius-product-adding-to-cart').first();
  }
  function partsPayTargetForm() {
    if ($partsPayForm.length && $.contains(document, $partsPayForm[0])) {
      return $partsPayForm;
    }
    return $('.product-form-panel .sylius-product-adding-to-cart').first();
  }

  // "Оформити замовлення": remember the chosen bank (payment method code) so the
  // checkout page can preselect it, add the product to the cart and send the
  // customer to the cart page (see the submit handler in cart.js).
  $(document).on('click', '.parts-pay-popup__footer .btn', function (e) {
    e.preventDefault();
    const $form = partsPayTargetForm();
    if (!$form.length) return;
    const $bank = $('.parts-pay-popup .choose-bank input[name="bank"]:checked');
    const bank = $bank.val();
    if (bank) {
      localStorage.setItem('installmentBank', bank);
      // разом із банком переносимо на чекаут і обрану кількість платежів
      const parts = $bank.closest('.row').find('.select-holder select').val();
      if (parts) {
        localStorage.setItem('installmentParts', parts);
      } else {
        localStorage.removeItem('installmentParts');
      }
    }
    $form.data('goToCart', true).trigger('submit');
  });
  $(document).on('click', '.product-form-panel .btn-part, .wayfx-product__additional--info--description--item.parts-pay', function (e) {
    // Show the element smoothly over 0.5 seconds (500 ms)
    e.preventDefault();
    $partsPayForm = mainProductForm($(this));
    updatePartsPayPopup();
    $('.parts-pay-popup').show();
  });

  // Howe to use popup
  $(document).on('click', '.how-to-use__button', function (e) {
    // Show the element smoothly over 0.5 seconds (500 ms)
    e.preventDefault();
    // Each button opens its own popup, targeted via the data-popup selector
    // (read with attr() so attribute selectors like [data-popup-id="..."] are
    // returned verbatim and not parsed as JSON by jQuery.data()).
    const target = $(this).attr('data-popup') || '.how-to-use__popup--1';
    $(target).show();
  });

  // Details popup
  $(document).on('click', '.details-box__opener', function (e) {
    e.preventDefault();
    // Each item opens its own popup, targeted via the data-popup selector
    // (read with attr() so attribute selectors like [data-popup-id="..."] are
    // returned verbatim and not parsed as JSON by jQuery.data()). Items without
    // a data-popup attribute are inert.
    const target = $(this).attr('data-popup');
    if (target) {
      $(target).show();
    }
  });

  // certifacations popup
  $(document).on('click', '.certification-block__button', function (e) {
    e.preventDefault();
    // Each item opens its own popup, targeted via the data-popup selector
    // (read with attr() so attribute selectors like [data-popup-id="..."] are
    // returned verbatim and not parsed as JSON by jQuery.data()). Items without
    // a data-popup attribute are inert.
    const target = $(this).attr('data-popup');
    if (target) {
      $(target).show();
    }
  });
}

/***/ }),

/***/ "./public/assets/shop/js/parts/sliders.js":
/*!************************************************!*\
  !*** ./public/assets/shop/js/parts/sliders.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ initSliders)
/* harmony export */ });
/* global $, window */
function initSliders() {
  // Cooperation slider
  $('.cooperation-list').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    pauseOnFocus: false,
    pauseOnHover: true,
    cssEase: 'linear',
    autoplay: true,
    autoplaySpeed: 15,
    infinite: true,
    speed: 15000,
    arrows: false,
    centerMode: false,
    loop: true,
    responsive: [{
      breakpoint: 1024,
      settings: {
        slidesToShow: 2
      }
    }]
  });
  if (window.innerWidth <= 767) {
    $('.buttons_list').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      autoplay: true,
      fade: true,
      dots: true
    });
  }
  // Benefits slider
  // $('.benefits-item').slick({
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   arrows: false,
  //   autoplay: true,
  //   fade: true,
  //   infinite: true,
  //   asNavFor: '.benefits-item-right',
  // });
  //
  // $('.benefits-item-right').slick({
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   asNavFor: '.benefits-item',
  //   dots: true,
  //   autoplay: true,
  //   infinite: true,
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         arrows: false,
  //       },
  //     },
  //   ],
  // });

  // New products slider
  $('.new-list').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: true,
    dots: true,
    responsive: [{
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
        arrows: false
      }
    }, {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        arrows: false
      }
    }]
  });

  // Promo slider
  $('.promo-list').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: true,
    dots: true,
    responsive: [{
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
        arrows: false
      }
    }, {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        arrows: false
      }
    }]
  });

  // Add margin to slick dots
  const $dots = $('.slick-dots');
  $dots.first().css('bottom', '150px');
  $dots.last().css('bottom', '150px');

  // Related products slider
  $('.related-box__list').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: true,
    dots: false,
    arrows: true,
    responsive: [{
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        arrows: false,
        dots: true,
        appendDots: $('.related-box__dots')
      }
    }]
  });
}

/***/ }),

/***/ "./public/assets/shop/js/parts/ui.js":
/*!*******************************************!*\
  !*** ./public/assets/shop/js/parts/ui.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ initUI)
/* harmony export */ });
/* global $, document */
function initUI() {
  // Additional button functionality
  $(document).ready(() => {
    const $btn = $('#additionalButton');
    const $elements = $('.additional-description, .additional-item:nth-child(2)');
    function updateButton() {
      const expanded = $elements.first().hasClass('active');
      $btn.text(expanded ? 'Згорнути' : 'Розгорнути');
    }

    // Click handler
    $btn.on('click', () => {
      $elements.toggleClass('active');
      updateButton();
    });

    // Initialize on start
    updateButton();
  });

  // Login form input handling
  $('.login-form-input').each(function () {
    const $input = $(this);
    const update = () => {
      $input.toggleClass('filled', $input.val().length > 0);
    };
    $input.on('input change', update);
    update();
  });

  // Accordion functionality
  $(document).on('click', '.accordion-details', function () {
    const $details = $(this);
    const $item = $details.parent();
    const $content = $details.next('.accordion-content');
    const isInsideViewSteps = $details.closest('.view-steps__data .item, .accordion__default').length;
    if (!isInsideViewSteps) {
      if ($item.hasClass('open')) {
        $item.removeClass('open');
        $content.stop(true, true).slideUp();
      } else {
        $item.addClass('open');
        $content.stop(true, true).slideDown();
      }
      return;
    }
    const $parentItem = $details.closest('.view-steps__data .item, .accordion__default');
    const $accordions = $parentItem.find('.accordion-wrapper');
    $accordions.not($item).removeClass('open').find('.accordion-content').stop(true, true).slideUp();
    if ($item.hasClass('open')) {
      $item.removeClass('open');
      $content.stop(true, true).slideUp();
    } else {
      $item.addClass('open');
      $content.stop(true, true).slideDown();
    }
  });

  // Smooth scrolling for anchor links
  $('a[href^="#"]').on('click', event => {
    const href = event.currentTarget.getAttribute('href');

    // Skip if href is just "#" to avoid jQuery selector error
    if (href === '#') {
      event.preventDefault();
      return;
    }
    const target = $(href);
    if (target.length) {
      event.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top - 160 // Offset from top
      }, 600); // Animation duration (ms)
    }
  });

  // Sample sidebar functionality
  $(document).on('click', '.sample-sidebar-header', function () {
    const $section = $(this).closest('.sample-sidebar-section');
    if (!$section.length) return; // додаткова перевірка, хоча closest не знайде нічого

    // Знаходимо контент і переключаємо стан
    $section.toggleClass('open');
  });

  // Footer accordion functionality
  const footerElements = document.querySelectorAll('.footer-list-inner');

  // Function to update height
  function updateHeight(element) {
    const el = element; // Create a local variable to avoid reassigning parameter
    if (el.classList.contains('active')) {
      const childrenCount = el.children.length;
      const newHeight = 50 + (childrenCount - 1) * 39;
      el.style.height = `${newHeight}px`;
    } else {
      el.style.height = '';
    }
  }

  // Add event handler to each element
  footerElements.forEach(element => {
    element.addEventListener('click', () => {
      // Toggle 'active' class for 'footer-list-inner'
      element.classList.toggle('active');

      // Find child element with class 'footer-item-inner'
      const innerItem = element.querySelector('.footer-item-inner');

      // If element is found, toggle 'active' class for it
      if (innerItem) {
        innerItem.classList.toggle('active');
      }

      // Update height after class change
      updateHeight(element);
    });
  });
}

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./public/assets/shop/js/index.js"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUFBRSxNQUFNO01BQ3RDO01BQ0EyYixPQUFPLENBQUNoZ0IsU0FBUyxDQUFDZ2MsTUFBTSxDQUFDLFFBQVEsQ0FBQzs7TUFFbEM7TUFDQSxNQUFNb0UsU0FBUyxHQUFHSixPQUFPLENBQUNuSSxhQUFhLENBQUMsb0JBQW9CLENBQUM7O01BRTdEO01BQ0EsSUFBSXVJLFNBQVMsRUFBRTtRQUNiQSxTQUFTLENBQUNwZ0IsU0FBUyxDQUFDZ2MsTUFBTSxDQUFDLFFBQVEsQ0FBQztNQUN0Qzs7TUFFQTtNQUNBK0QsWUFBWSxDQUFDQyxPQUFPLENBQUM7SUFDdkIsQ0FBQyxDQUFDO0VBQ0osQ0FBQyxDQUFDO0FBQ0oiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL3Nob3AvanMvZ2xvYmFsL2VtYWlsVmFsaWRhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL3Nob3AvanMvZ2xvYmFsL2xhenlMb2FkLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvc2hvcC9qcy9nbG9iYWwvc2tpbkJyYW5kLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvc2hvcC9qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL3Nob3AvanMvcGFydHMvY2FydC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL3Nob3AvanMvcGFydHMvaGVhZGVyLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvc2hvcC9qcy9wYXJ0cy9sYXp5SW1hZ2VzLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvc2hvcC9qcy9wYXJ0cy9tb2JpbGVNZW51LmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvc2hvcC9qcy9wYXJ0cy9wb3B1cC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL3Nob3AvanMvcGFydHMvcHJvZHVjdC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL3Nob3AvanMvcGFydHMvc2xpZGVycy5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL3Nob3AvanMvcGFydHMvdWkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGVtYWlsVmFsaWRhdGlvbigpIHtcbiAgLy8gQXR0YWNoIGEgY2xpY2sgZXZlbnQgdmlhIGpRdWVyeVxuICAkKCcjc3Vic2NyaWJlU3VibWl0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTsgLy8gUHJldmVudCB0aGUgZGVmYXVsdCBmb3JtIHN1Ym1pc3Npb25cblxuICAgIC8vIENhY2hlIGpRdWVyeSBvYmplY3RzXG4gICAgY29uc3QgJGVycm9yRWxlbWVudCA9ICQoJy5zdWJzY3JpYmUtZXJyb3InKTtcbiAgICBjb25zdCAkZW1haWxJbnB1dCAgID0gJCgnI3N1YnNjcmliZS1lbWFpbCcpO1xuXG4gICAgLy8gUmVndWxhciBleHByZXNzaW9uIGZvciBlbWFpbCB2YWxpZGF0aW9uXG4gICAgY29uc3QgZW1haWxSZWdleCA9IC9eW2EtekEtWjAtOS5fJStcXC1dK0BbYS16QS1aMC05LlxcLV0rXFwuW2EtekEtWl17Mix9JC87XG5cbiAgICAvLyBDaGVjayBlbWFpbCB2YWxpZGl0eVxuICAgIGlmICghZW1haWxSZWdleC50ZXN0KCRlbWFpbElucHV0LnZhbCgpKSkge1xuICAgICAgLy8gU2hvdyBlcnJvciBtZXNzYWdlXG4gICAgICAkZXJyb3JFbGVtZW50LmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSGlkZSBlcnJvciBtZXNzYWdlXG4gICAgICAkZXJyb3JFbGVtZW50LnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgLy8gUGVyZm9ybSBBSkFYIHJlcXVlc3QgaWYgdGhlIGVtYWlsIGlzIHZhbGlkXG4gICAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6ICcvcGF0aC90by95b3VyL2VuZHBvaW50JywgLy8gUmVwbGFjZSB3aXRoIHlvdXIgYWN0dWFsIFVSTFxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZGF0YTogeyBlbWFpbDogJGVtYWlsSW5wdXQudmFsKCkgfSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnU3Vic2NyaXB0aW9uIHN1Y2Nlc3NmdWw6JywgcmVzcG9uc2UpO1xuICAgICAgICAgICQoJy5zdWJzY3JpYmUtaW5uZXInKS5oaWRlKCk7XG4gICAgICAgICAgJCgnLnN1YnNjcmliZS1jb21wbGV0ZWQnKS5zaG93KCk7XG4gICAgICAgICAgLy8gT3B0aW9uYWxseSBzaG93IGEgc3VjY2VzcyBtZXNzYWdlIG9yIHJlZGlyZWN0XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciB3aGlsZSBzdWJzY3JpYmluZzonLCBlcnJvclRocm93bik7XG4gICAgICAgICAgJGVycm9yRWxlbWVudC50ZXh0KCfQn9C+0LzQuNC70LrQsCDQv9GA0Lgg0LLRltC00L/RgNCw0LLRhtGWJyk7XG4gICAgICAgICAgJGVycm9yRWxlbWVudC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgLy8gT3B0aW9uYWxseSBzaG93IGFuIGVycm9yIG1lc3NhZ2UgdG8gdGhlIHVzZXJcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbiIsIi8qIGdsb2JhbCBkb2N1bWVudCwgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgKi9cblxuLyoqXG4gKiBBZGRzIGxvYWRpbmc9XCJsYXp5XCIgdG8gaW1hZ2VzIG1hcmtlZCBmb3IgbGF6eS1sb2FkaW5nLlxuICogQnkgZGVmYXVsdCwgb25seSBpbWFnZXMgd2l0aCBbZGF0YS1sYXp5PVwidHJ1ZVwiXSB3aWxsIGJlIHByb2Nlc3NlZC5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fERvY3VtZW50fSByb290ICAgIOKAkyByb290IHRvIHNlYXJjaCB1bmRlclxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yICAgICAgICAgICAgICDigJMgQ1NTIHNlbGVjdG9yIGZvciBpbWFnZXMgdG8gbGF6eS1sb2FkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXp5TG9hZEltYWdlcyhyb290ID0gZG9jdW1lbnQsIHNlbGVjdG9yID0gJ2ltZ1tkYXRhLWxhenk9XCJ0cnVlXCJdJykge1xuICBjb25zdCBpbWFnZXMgPSByb290LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7c2VsZWN0b3J9Om5vdChbbG9hZGluZ10pYCk7XG4gIGltYWdlcy5mb3JFYWNoKChpbWcpID0+IHtcbiAgICBpbWcuc2V0QXR0cmlidXRlKCdsb2FkaW5nJywgJ2xhenknKTtcbiAgfSk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBJbnRlcnNlY3Rpb25PYnNlcnZlciB0aGF0IGZpcmVzIHdoZW4gdGhlIHRhcmdldCBjb21lcyBpbnRvIHZpZXcuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAg4oCTIGNhbGxlZCB3aXRoIChlbGVtZW50LCBvYnNlcnZlcikgb24gaW50ZXJzZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAgICAg4oCTIHNhbWUgYXMgSW50ZXJzZWN0aW9uT2JzZXJ2ZXJJbml0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMYXp5TG9hZE9ic2VydmVyKGNhbGxiYWNrLCBvcHRpb25zID0ge30pIHtcbiAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgcm9vdDogbnVsbCxcbiAgICByb290TWFyZ2luOiAnMHB4JyxcbiAgICB0aHJlc2hvbGQ6IDAuMSxcbiAgfTtcbiAgY29uc3QgbWVyZ2VkT3B0aW9ucyA9IHsgLi4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdGlvbnMgfTtcblxuICByZXR1cm4gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKChlbnRyaWVzLCBvYnNlcnZlcikgPT4ge1xuICAgIGVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIGlmIChlbnRyeS5pc0ludGVyc2VjdGluZykge1xuICAgICAgICBjYWxsYmFjayhlbnRyeS50YXJnZXQsIG9ic2VydmVyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSwgbWVyZ2VkT3B0aW9ucyk7XG59XG5cbi8qKlxuICogT2JzZXJ2ZSBhIHNldCBvZiBlbGVtZW50cyBhbmQgY2FsbCBgbG9hZENhbGxiYWNrKGVsKWAgb25jZSB3aGVuIHRoZXkgc2Nyb2xsIGludG8gdmlldy5cbiAqIEBwYXJhbSB7Tm9kZUxpc3R8QXJyYXk8SFRNTEVsZW1lbnQ+fSBlbGVtZW50c1xuICogQHBhcmFtIHtGdW5jdGlvbn0gbG9hZENhbGxiYWNrXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAg4oCTIEludGVyc2VjdGlvbk9ic2VydmVySW5pdFxuICovXG5leHBvcnQgZnVuY3Rpb24gb2JzZXJ2ZUVsZW1lbnRzKGVsZW1lbnRzLCBsb2FkQ2FsbGJhY2ssIG9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBvYnNlcnZlciA9IGNyZWF0ZUxhenlMb2FkT2JzZXJ2ZXIoKHRhcmdldCwgb2JzKSA9PiB7XG4gICAgbG9hZENhbGxiYWNrKHRhcmdldCk7XG4gICAgb2JzLnVub2JzZXJ2ZSh0YXJnZXQpO1xuICB9LCBvcHRpb25zKTtcblxuICBlbGVtZW50cy5mb3JFYWNoKChlbCkgPT4gb2JzZXJ2ZXIub2JzZXJ2ZShlbCkpO1xuICByZXR1cm4gb2JzZXJ2ZXI7XG59XG4iLCIvKiBnbG9iYWwgZG9jdW1lbnQsIE11dGF0aW9uT2JzZXJ2ZXIsIE5vZGVGaWx0ZXIgKi9cbi8vIFdyYXBzIGV2ZXJ5IFwiU2tpbihJRClcIiAvIFwiU2tpbihJZClcIiAvIFwiU2tpbih0ZXQpXCIgdGV4dCBvY2N1cnJlbmNlIHNvIHRoZSBicmFuZCBnZXRzIGl0cyBmb250czpcbi8vIFwiU2tpblwiIC0+IFNhaWxlYyA0MDAsIFwiKElEKVwiIC8gXCIodGV0KVwiIC0+IE5pYlByb1NlbWlCb2xkSXRhbGljIChzZWUgLnNraW4tYnJhbmQgaW4gc2Nzcy9fZm9udC5zY3NzKS5cbmNvbnN0IEJSQU5EX1JFID0gL1NraW5cXHMqXFwoKElEfHRldClcXCkvZ2k7XG5jb25zdCBTS0lQX1RBR1MgPSBuZXcgU2V0KFsnU0NSSVBUJywgJ1NUWUxFJywgJ05PU0NSSVBUJywgJ1RFWFRBUkVBJywgJ0lOUFVUJywgJ09QVElPTicsICdUSVRMRScsICdTRUxFQ1QnLCAnQ09ERScsICdQUkUnXSk7XG5cbmNvbnN0IHNob3VsZFNraXAgPSAobm9kZSkgPT4ge1xuICBmb3IgKGxldCBlbCA9IG5vZGUucGFyZW50RWxlbWVudDsgZWw7IGVsID0gZWwucGFyZW50RWxlbWVudCkge1xuICAgIGlmIChTS0lQX1RBR1MuaGFzKGVsLnRhZ05hbWUpIHx8IGVsLmlzQ29udGVudEVkaXRhYmxlIHx8IGVsLmNsYXNzTGlzdC5jb250YWlucygnc2tpbi1icmFuZCcpKSByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5jb25zdCB3cmFwVGV4dE5vZGUgPSAobm9kZSkgPT4ge1xuICBjb25zdCB0ZXh0ID0gbm9kZS5ub2RlVmFsdWU7XG4gIEJSQU5EX1JFLmxhc3RJbmRleCA9IDA7XG4gIGlmICghQlJBTkRfUkUudGVzdCh0ZXh0KSkgcmV0dXJuO1xuICBCUkFORF9SRS5sYXN0SW5kZXggPSAwO1xuXG4gIGNvbnN0IGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIGxldCBsYXN0ID0gMDtcbiAgbGV0IG07XG4gIHdoaWxlICgobSA9IEJSQU5EX1JFLmV4ZWModGV4dCkpICE9PSBudWxsKSB7XG4gICAgaWYgKG0uaW5kZXggPiBsYXN0KSBmcmFnLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQuc2xpY2UobGFzdCwgbS5pbmRleCkpKTtcbiAgICBjb25zdCBicmFuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBicmFuZC5jbGFzc05hbWUgPSAnc2tpbi1icmFuZCc7XG4gICAgY29uc3QgdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHRhZy5jbGFzc05hbWUgPSAnc2tpbi1icmFuZF9fdGFnJztcbiAgICB0YWcudGV4dENvbnRlbnQgPSBgKCR7bVsxXX0pYDtcbiAgICBicmFuZC5hcHBlbmQodGV4dC5zdWJzdHIobS5pbmRleCwgNCksIHRhZyk7XG4gICAgZnJhZy5hcHBlbmRDaGlsZChicmFuZCk7XG4gICAgbGFzdCA9IG0uaW5kZXggKyBtWzBdLmxlbmd0aDtcbiAgfVxuICBpZiAobGFzdCA8IHRleHQubGVuZ3RoKSBmcmFnLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQuc2xpY2UobGFzdCkpKTtcbiAgbm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChmcmFnLCBub2RlKTtcbn07XG5cbi8vIE1hcmt1cCB2YXJpYW50OiBTa2luPGVtPihJRCk8L2VtPiDigJQgb25seSB3aGVuIHRoZSA8ZW0+IGhvbGRzIGV4YWN0bHkgKElEKSAvICh0ZXQpLlxuY29uc3QgVEFHX1JFID0gL15cXChcXHMqKElEfHRldClcXHMqXFwpJC9pO1xuY29uc3QgVEFJTF9SRSA9IC9Ta2luXFxzKiQvaTtcblxuY29uc3Qgd3JhcFNwbGl0QnJhbmQgPSAocm9vdCkgPT4ge1xuICBjb25zdCBlbXMgPSByb290Lm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSA/IFsuLi5yb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ2VtJyldIDogW107XG4gIGlmIChyb290LnRhZ05hbWUgPT09ICdFTScpIGVtcy5wdXNoKHJvb3QpO1xuICBlbXMuZm9yRWFjaCgoZW0pID0+IHtcbiAgICBjb25zdCBwcmV2ID0gZW0ucHJldmlvdXNTaWJsaW5nO1xuICAgIGlmICghcHJldiB8fCBwcmV2Lm5vZGVUeXBlICE9PSBOb2RlLlRFWFRfTk9ERSB8fCBlbS5jbGFzc0xpc3QuY29udGFpbnMoJ3NraW4tYnJhbmRfX3RhZycpKSByZXR1cm47XG4gICAgaWYgKCFUQUdfUkUudGVzdChlbS50ZXh0Q29udGVudC50cmltKCkpIHx8ICFUQUlMX1JFLnRlc3QocHJldi5ub2RlVmFsdWUpIHx8IHNob3VsZFNraXAoZW0uZmlyc3RDaGlsZCB8fCBlbSkpIHJldHVybjtcbiAgICBjb25zdCBtID0gcHJldi5ub2RlVmFsdWUubWF0Y2goVEFJTF9SRSk7XG4gICAgY29uc3QgaGVhZCA9IHByZXYubm9kZVZhbHVlLnNsaWNlKDAsIG0uaW5kZXgpO1xuICAgIGNvbnN0IGJyYW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGJyYW5kLmNsYXNzTmFtZSA9ICdza2luLWJyYW5kJztcbiAgICBicmFuZC50ZXh0Q29udGVudCA9IG1bMF0udHJpbUVuZCgpO1xuICAgIGlmIChoZWFkKSBwcmV2Lm5vZGVWYWx1ZSA9IGhlYWQ7IGVsc2UgcHJldi5yZW1vdmUoKTtcbiAgICBlbS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShicmFuZCwgZW0pO1xuICAgIGVtLmNsYXNzTGlzdC5hZGQoJ3NraW4tYnJhbmRfX3RhZycpO1xuICAgIGJyYW5kLmFwcGVuZENoaWxkKGVtKTtcbiAgfSk7XG59O1xuXG5jb25zdCBwcm9jZXNzVHJlZSA9IChyb290KSA9PiB7XG4gIGlmIChyb290Lm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xuICAgIGlmICghc2hvdWxkU2tpcChyb290KSkgd3JhcFRleHROb2RlKHJvb3QpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAocm9vdC5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHJldHVybjtcbiAgd3JhcFNwbGl0QnJhbmQocm9vdCk7XG4gIGNvbnN0IHdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIocm9vdCwgTm9kZUZpbHRlci5TSE9XX1RFWFQpO1xuICBjb25zdCBub2RlcyA9IFtdO1xuICB3aGlsZSAod2Fsa2VyLm5leHROb2RlKCkpIG5vZGVzLnB1c2god2Fsa2VyLmN1cnJlbnROb2RlKTtcbiAgbm9kZXMuZm9yRWFjaCgobikgPT4geyBpZiAoIXNob3VsZFNraXAobikpIHdyYXBUZXh0Tm9kZShuKTsgfSk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2tpbkJyYW5kID0gKCkgPT4ge1xuICBwcm9jZXNzVHJlZShkb2N1bWVudC5ib2R5KTtcbiAgbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdSkgPT4gbXUuYWRkZWROb2Rlcy5mb3JFYWNoKChuKSA9PiBwcm9jZXNzVHJlZShuKSkpO1xuICB9KS5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xufTtcbiIsIi8qIGdsb2JhbCBkb2N1bWVudCwgd2luZG93ICovXG4vLyBJbXBvcnQgYWxsIG1vZHVsZXNcbmltcG9ydCB7IGhlYWRlciB9IGZyb20gJy4vcGFydHMvaGVhZGVyJztcbmltcG9ydCB7IGVtYWlsVmFsaWRhdGlvbiB9IGZyb20gJy4vZ2xvYmFsL2VtYWlsVmFsaWRhdGlvbic7XG5pbXBvcnQgeyBza2luQnJhbmQgfSBmcm9tICcuL2dsb2JhbC9za2luQnJhbmQnO1xuaW1wb3J0IGluaXRTbGlkZXJzIGZyb20gJy4vcGFydHMvc2xpZGVycyc7XG5pbXBvcnQgaW5pdFByb2R1Y3RJbnRlcmFjdGlvbnMgZnJvbSAnLi9wYXJ0cy9wcm9kdWN0JztcbmltcG9ydCBpbml0Q2FydEZ1bmN0aW9uYWxpdHkgZnJvbSAnLi9wYXJ0cy9jYXJ0JztcbmltcG9ydCBpbml0UG9wdXBzIGZyb20gJy4vcGFydHMvcG9wdXAnO1xuaW1wb3J0IGluaXRVSSBmcm9tICcuL3BhcnRzL3VpJztcbmltcG9ydCBpbml0TW9iaWxlTWVudSBmcm9tICcuL3BhcnRzL21vYmlsZU1lbnUnO1xuaW1wb3J0IHsgb2JzZXJ2ZUVsZW1lbnRzIH0gZnJvbSAnLi9nbG9iYWwvbGF6eUxvYWQnO1xuaW1wb3J0IGxhenlJbWFnZXMgZnJvbSAnLi9wYXJ0cy9sYXp5SW1hZ2VzJztcblxuLy8gSW5pdGlhbGl6ZSBhbGwgbW9kdWxlc1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgLy8gQXBwbHkgbGF6eSBsb2FkaW5nIHRvIGFsbCBpbWFnZXMsIGluY2x1ZGluZyBkeW5hbWljYWxseSBsb2FkZWQgb25lc1xuICBsYXp5SW1hZ2VzKCk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBlc3NlbnRpYWwgY29tcG9uZW50cyBpbW1lZGlhdGVseVxuICBoZWFkZXIoKTtcbiAgZW1haWxWYWxpZGF0aW9uKCk7XG4gIHNraW5CcmFuZCgpO1xuXG4gIC8vIExhenkgbG9hZCBoZWF2eSBjb21wb25lbnRzXG4gIGNvbnN0IGxhenlDb21wb25lbnRzID0gW1xuICAgIHsgc2VsZWN0b3I6ICcuc2xpZGVyLWNvbnRhaW5lcicsIGluaXQ6IGluaXRTbGlkZXJzIH0sXG4gICAgeyBzZWxlY3RvcjogJy5wcm9kdWN0LWl0ZW0sIC5wcm9kdWN0LWRldGFpbCcsIGluaXQ6IGluaXRQcm9kdWN0SW50ZXJhY3Rpb25zIH0sXG4gICAgeyBzZWxlY3RvcjogJy5jYXJ0LWNvbnRhaW5lcicsIGluaXQ6IGluaXRDYXJ0RnVuY3Rpb25hbGl0eSB9LFxuICAgIHsgc2VsZWN0b3I6ICcucG9wdXAtdHJpZ2dlcicsIGluaXQ6IGluaXRQb3B1cHMgfSxcbiAgICB7IHNlbGVjdG9yOiAnLnVpLWNvbXBvbmVudCcsIGluaXQ6IGluaXRVSSB9LFxuICAgIHsgc2VsZWN0b3I6ICcubW9iaWxlLW1lbnUtY29udGFpbmVyJywgaW5pdDogaW5pdE1vYmlsZU1lbnUgfSxcbiAgXTtcblxuICBsYXp5Q29tcG9uZW50cy5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICBjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoY29tcG9uZW50LnNlbGVjdG9yKTtcbiAgICBpZiAoZWxlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgb2JzZXJ2ZUVsZW1lbnRzKGVsZW1lbnRzLCAoKSA9PiB7XG4gICAgICAgIGNvbXBvbmVudC5pbml0KCk7XG4gICAgICB9LCB7IHJvb3RNYXJnaW46ICcxMDBweCcgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHNlbGVjdG9yIG5vdCBmb3VuZCwgaW5pdGlhbGl6ZSBhbnl3YXkgKGZhbGxiYWNrKVxuICAgICAgY29tcG9uZW50LmluaXQoKTtcbiAgICB9XG4gIH0pO1xufSk7XG5cbihmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGdldFNsdWdGcm9tUGF0aCgpIHtcblxuICAgIGNvbnN0IHBhcnRzID0gKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSB8fCAnLycpXG4gICAgLnNwbGl0KCcvJylcbiAgICAuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgcmV0dXJuIHBhcnRzLmxlbmd0aCA/IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdIDogJyc7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRSZWRpcmVjdFBhcmFtKGhyZWYsIHJlZGlyZWN0VmFsdWUpIHtcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGhyZWYsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pO1xuXG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoJ3JlZGlyZWN0JywgcmVkaXJlY3RWYWx1ZSk7XG5cbiAgICByZXR1cm4gdXJsLnBhdGhuYW1lICsgKHVybC5zZWFyY2ggfHwgJycpICsgKHVybC5oYXNoIHx8ICcnKTtcbiAgfVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBjb25zdCBsaW5rID0gZS50YXJnZXQuY2xvc2VzdCgnLm5lZWQtbG9naW4gLmpzLXJlZ2lzdGVyLWxpbmssIC5uZWVkLWxvZ2luIC5qcy1sb2dpbi1saW5rJyk7XG4gICAgaWYgKCFsaW5rKSByZXR1cm47XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCBiYXNlSHJlZiA9IGxpbmsuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgaWYgKCFiYXNlSHJlZikgcmV0dXJuO1xuXG4gICAgY29uc3Qgc2x1ZyA9IGdldFNsdWdGcm9tUGF0aCgpO1xuXG4gICAgY29uc3QgcmVkaXJlY3RWYWx1ZSA9IHNsdWcgfHwgJ2hvbWUnO1xuXG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBhZGRSZWRpcmVjdFBhcmFtKGJhc2VIcmVmLCByZWRpcmVjdFZhbHVlKTtcbiAgfSk7XG59KSgpO1xuXG4oZnVuY3Rpb24gKCkge1xuICBjb25zdCBST09UX0NMQVNTID0gJ2lzLWludGVyYWN0ZWQnO1xuXG4gIGZ1bmN0aW9uIG1hcmtJbnRlcmFjdGVkT25jZSgpIHtcbiAgICBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhST09UX0NMQVNTKSkgcmV0dXJuO1xuXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoUk9PVF9DTEFTUyk7XG5cbiAgICBjbGVhbnVwSW50ZXJhY3Rpb25MaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIC8vIC0tLSDQktGW0LTRgdGC0LXQttC10L3QvdGPINC/0LXRgNGI0L7RlyDQstC30LDRlNC80L7QtNGW0Zcg0LrQvtGA0LjRgdGC0YPQstCw0YfQsFxuICBjb25zdCBpbnRlcmFjdGlvbkV2ZW50cyA9IFtcbiAgICBbJ3Njcm9sbCcsIG1hcmtJbnRlcmFjdGVkT25jZSwgeyBwYXNzaXZlOiB0cnVlIH1dLFxuICAgIFsnbW91c2Vtb3ZlJywgbWFya0ludGVyYWN0ZWRPbmNlLCB7IHBhc3NpdmU6IHRydWUgfV0sXG4gICAgWyd0b3VjaHN0YXJ0JywgbWFya0ludGVyYWN0ZWRPbmNlLCB7IHBhc3NpdmU6IHRydWUgfV0sXG4gICAgWydrZXlkb3duJywgbWFya0ludGVyYWN0ZWRPbmNlLCB7IHBhc3NpdmU6IHRydWUgfV0sXG4gICAgWyd3aGVlbCcsIG1hcmtJbnRlcmFjdGVkT25jZSwgeyBwYXNzaXZlOiB0cnVlIH1dLFxuICAgIFsncG9pbnRlcmRvd24nLCBtYXJrSW50ZXJhY3RlZE9uY2UsIHsgcGFzc2l2ZTogdHJ1ZSB9XSxcbiAgXTtcblxuICBmdW5jdGlvbiBzZXR1cEludGVyYWN0aW9uTGlzdGVuZXJzKCkge1xuICAgIGludGVyYWN0aW9uRXZlbnRzLmZvckVhY2goKFtldnQsIGZuLCBvcHRdKSA9PiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldnQsIGZuLCBvcHQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFudXBJbnRlcmFjdGlvbkxpc3RlbmVycygpIHtcbiAgICBpbnRlcmFjdGlvbkV2ZW50cy5mb3JFYWNoKChbZXZ0LCBmbiwgb3B0XSkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZ0LCBmbiwgb3B0KSk7XG4gIH1cblxuICBzZXR1cEludGVyYWN0aW9uTGlzdGVuZXJzKCk7XG59KSgpO1xuXG4oZnVuY3Rpb24gKCkge1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG5cbiAgICBjb25zdCBidG4gPSBlLnRhcmdldC5jbG9zZXN0KCcubGluaycpO1xuICAgIGlmICghYnRuKSByZXR1cm47XG5cbiAgICBjb25zdCBlbmNvZGVkID0gYnRuLmRhdGFzZXQuaHJlZjtcbiAgICBpZiAoIWVuY29kZWQpIHJldHVybjtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCB1cmwgPSBhdG9iKGVuY29kZWQpO1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkIGJhc2U2NCBVUkwnLCBlcnIpO1xuICAgIH1cbiAgfSk7XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uIChlKSB7XG5cbiAgICBjb25zdCBidG4gPSBlLnRhcmdldC5jbG9zZXN0KCcubGluaycpO1xuICAgIGlmICghYnRuKSByZXR1cm47XG5cbiAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICcgJykge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBjb25zdCBlbmNvZGVkID0gYnRuLmRhdGFzZXQuaHJlZjtcbiAgICAgIGlmICghZW5jb2RlZCkgcmV0dXJuO1xuXG4gICAgICBjb25zdCB1cmwgPSBhdG9iKGVuY29kZWQpO1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG4gICAgfVxuXG4gIH0pO1xufSkoKTtcbiIsIi8qIGdsb2JhbCAkLCB3aW5kb3csIGRvY3VtZW50ICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbml0Q2FydEZ1bmN0aW9uYWxpdHkoKSB7XG5cbiAgY29uc29sZS5sb2coJ2luaXRDYXJ0RnVuY3Rpb25hbGl0eScpO1xuICAvLyBBZGQgdG8gY2FydCBmdW5jdGlvbmFsaXR5XG4gICQoZG9jdW1lbnQpLm9uKCdzdWJtaXQnLCAnLnN5bGl1cy1wcm9kdWN0LWFkZGluZy10by1jYXJ0JywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNvbnNvbGUubG9nKCdzeWxpdXMtcHJvZHVjdC1hZGRpbmctdG8tY2FydCcpO1xuICAgIGNvbnN0IGZvcm0gICAgICAgICA9ICQodGhpcyk7XG4gICAgY29uc3QgZm9ybURhdGEgICAgID0gZm9ybS5zZXJpYWxpemUoKTtcbiAgICBjb25zdCBzdWJtaXRCdXR0b24gPSBmb3JtLmZpbmQoJ2J1dHRvblt0eXBlPVwic3VibWl0XCJdJyk7XG4gICAgLy8gc2V0IGJ5IHRoZSBcItCe0YTQvtGA0LzQuNGC0Lgg0LfQsNC80L7QstC70LXQvdC90Y9cIiBidXR0b24gb2YgdGhlIGluc3RhbGxtZW50IHBvcHVwXG4gICAgY29uc3QgZ29Ub0NhcnQgICAgID0gISFmb3JtLmRhdGEoJ2dvVG9DYXJ0Jyk7XG4gICAgZm9ybS5yZW1vdmVEYXRhKCdnb1RvQ2FydCcpO1xuXG4gICAgaWYgKHN1Ym1pdEJ1dHRvbi5oYXNDbGFzcygnbG9hZGluZycpKSByZXR1cm47XG4gICAgc3VibWl0QnV0dG9uLmFkZENsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiAgICBmb3JtLmF0dHIoJ2FjdGlvbicpLFxuICAgICAgdHlwZTogICBmb3JtLmF0dHIoJ21ldGhvZCcpLFxuICAgICAgZGF0YTogICBmb3JtRGF0YSxcbiAgICAgIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgLy8gMSkgVXBkYXRlIGNhcnQgVUlcbiAgICAgICAgdXBkYXRlQ291bnRDdXJ0KHJlc3BvbnNlLmNvdW50KTtcblxuICAgICAgICAvLyBUaGUgcG9wdXAncyBcItCe0YTQvtGA0LzQuNGC0Lgg0LfQsNC80L7QstC70LXQvdC90Y9cIiBtdXN0IG5vdCBkZXBlbmQgb24gdGhlIGFuYWx5dGljc1xuICAgICAgICAvLyBjb2RlIGJlbG93OiBhIG1pc3NpbmcgZGF0YS0qIGF0dHJpYnV0ZSB0aGVyZSB0aHJvd3MgYW5kIGtpbGxzIHRoZSByZWRpcmVjdC5cbiAgICAgICAgaWYgKGdvVG9DYXJ0KSB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2NhcnQnO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDIpIEdhdGhlciBhbmFseXRpY3MgZGF0YSwgaGFuZGxpbmcgYm90aCB2YXJpYW50IHN0cnVjdHVyZXNcbiAgICAgICAgbGV0IHByb2R1Y3ROYW1lLCBpZCwgcHJpY2VSYXcsIHRheG9uTmFtZSwgdmFyaWFudE5hbWUsIGJyYW5kO1xuXG4gICAgICAgIC8vIGEpIOKAnHNlbGVjdOKAkG9wdGlvbnPigJ0gdmFyaWFudCAocmFkaW8gKyBsYWJlbClcbiAgICAgICAgY29uc3QgJGlucHV0ID0gZm9ybS5maW5kKCdpbnB1dFtuYW1lPVwic3lsaXVzX2FkZF90b19jYXJ0W2NhcnRJdGVtXVt2YXJpYW50XVwiXTpjaGVja2VkJyk7XG4gICAgICAgIGNvbnN0ICRsYmwgICA9ICRpbnB1dC5jbG9zZXN0KCcud2F5ZngtcHJvZHVjdF9fYWRkaXRpb25hbC0tZm9ybS0tc2VsZWN0LS1vcHRpb25zLS1sYWJlbCcpO1xuICAgICAgICBpZiAoJGlucHV0Lmxlbmd0aCAmJiAkbGJsLmxlbmd0aCkge1xuICAgICAgICAgIHByb2R1Y3ROYW1lID0gJGxibC5hdHRyKCdkYXRhLXByb2R1Y3QtbmFtZScpO1xuICAgICAgICAgIGlkICAgICAgICAgID0gJGlucHV0LmRhdGEoJ2NvZGUnKTtcbiAgICAgICAgICBwcmljZVJhdyAgICA9ICRsYmwuYXR0cignZGF0YS1wcmljZScpO1xuICAgICAgICAgIHRheG9uTmFtZSAgID0gJGxibC5hdHRyKCdkYXRhLXRheG9uJyk7XG4gICAgICAgICAgdmFyaWFudE5hbWUgPSAkbGJsLmF0dHIoJ2RhdGEtdmFyaWFudC1uYW1lJyk7XG4gICAgICAgICAgYnJhbmQgICAgICAgPSAkbGJsLmF0dHIoJ2RhdGEtYnJhbmQnKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBiKSDigJxzaW5nbGXigJBidXR0b27igJ0gdmFyaWFudCAoaGlkZGVuIC52YXItaXRlbSArIGJ1dHRvbltkYXRhLSpdKVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBjb25zdCAkYnRuID0gc3VibWl0QnV0dG9uO1xuICAgICAgICAgIHByb2R1Y3ROYW1lID0gJGJ0bi5hdHRyKCdkYXRhLXByb2R1Y3QtbmFtZScpO1xuICAgICAgICAgIGlkICAgICAgICAgID0gJGJ0bi5hdHRyKCdkYXRhLWlkJyk7XG4gICAgICAgICAgcHJpY2VSYXcgICAgPSAkYnRuLmF0dHIoJ2RhdGEtcHJpY2UnKTtcbiAgICAgICAgICB0YXhvbk5hbWUgICA9ICRidG4uYXR0cignZGF0YS10YXhvbicpO1xuICAgICAgICAgIHZhcmlhbnROYW1lID0gJGJ0bi5hdHRyKCdkYXRhLXZhcmlhbnQtbmFtZScpO1xuICAgICAgICAgIGJyYW5kICAgICAgID0gJGJ0bi5hdHRyKCdkYXRhLWJyYW5kJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAzKSBOb3JtYWxpemUgcHJpY2Ugc3RyaW5nIGludG8gYSBOdW1iZXJcbiAgICAgICAgY29uc3QgcHJpY2UgPSBwYXJzZUZsb2F0KFxuICAgICAgICAgIHByaWNlUmF3XG4gICAgICAgICAgICAucmVwbGFjZSgvXFxzfOKCtC9nLCAnJykgIC8vIHN0cmlwIHNwYWNlcyArIFVBSCBzeW1ib2xcbiAgICAgICAgICAgIC5yZXBsYWNlKCcsJywgJy4nKSAgICAgLy8gY29tbWEg4oaSIGRvdFxuICAgICAgICApO1xuICAgICAgICBjb25zb2xlLmxvZyhwcm9kdWN0TmFtZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKGlkKTtcbiAgICAgICAgY29uc29sZS5sb2codmFyaWFudE5hbWUpO1xuICAgICAgICBjb25zb2xlLmxvZyhicmFuZCk7XG4gICAgICAgIHByb2R1Y3RNb2RhbENhcnQocmVzcG9uc2UpO1xuXG4gICAgICAgIC8vIDQpIEZpcmUgdGhlIEdBNCBhZGRfdG9fY2FydCBldmVudFxuICAgICAgICBnb29nbGVBZGRUb0NhcnQocHJvZHVjdE5hbWUsIGlkLCBwcmljZSwgdGF4b25OYW1lLCB2YXJpYW50TmFtZSxicmFuZCk7XG5cbiAgICAgICAgaWYgKCQoJ2JvZHknKS5oYXNDbGFzcygnb3ZlcmZsb3cnKSB8fCAkKCdib2R5JykuaGFzQ2xhc3MoJ3BhZ2Utc3lsaXVzX3Nob3BfY2hlY2tvdXQnKSkge1xuICAgICAgICAgIHVwZGF0ZUNhcnREaXNwbGF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNSkgQnV0dG9uIGZlZWRiYWNrXG4gICAgICAgIHN1Ym1pdEJ1dHRvbi5yZW1vdmVDbGFzcygnbG9hZGluZycpLmFkZENsYXNzKCdhZGRlZCcpO1xuICAgICAgICBzdWJtaXRCdXR0b24uZmluZCgnLmJ1eScpLnRleHQoJ9CU0L7QtNCw0L3QvicpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBzdWJtaXRCdXR0b24ucmVtb3ZlQ2xhc3MoJ2FkZGVkJyk7XG4gICAgICAgICAgc3VibWl0QnV0dG9uLmZpbmQoJy5idXknKS50ZXh0KCfQmtGD0L/QuNGC0LgnKTtcbiAgICAgICAgfSwgMTYwMCk7XG4gICAgICB9LFxuICAgICAgZXJyb3IoeGhyKSB7XG4gICAgICAgIHN1Ym1pdEJ1dHRvbi5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuICAgICAgICBsZXQgZXJyTXNnID0gJ9Ch0YLQsNC70LDRgdGPINC/0L7QvNC40LvQutCwLiDQodC/0YDQvtCx0YPQudGC0LUg0YnQtSDRgNCw0LcuJztcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDQwMCAmJiB4aHIucmVzcG9uc2VKU09OPy5lcnJvcnMpIHtcbiAgICAgICAgICBjb25zdCBlID0geGhyLnJlc3BvbnNlSlNPTi5lcnJvcnM7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZS5lcnJvcnMpICYmIGUuZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgZXJyTXNnID0gZS5lcnJvcnNbMF07XG4gICAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGUuZm9ybT8uZXJyb3JzKSAmJiBlLmZvcm0uZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgZXJyTXNnID0gZS5mb3JtLmVycm9yc1swXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgJHBvcHVwID0gJCgnLnBvcHVwLm1lc3NhZ2UnKTtcbiAgICAgICAgJHBvcHVwLmZpbmQoJy5wb3B1cC1tZXNzYWdlLXRleHQnKS50ZXh0KGVyck1zZyk7XG4gICAgICAgICRwb3B1cC5zaG93KCk7XG4gICAgICB9LFxuICAgICAgY29tcGxldGUoKSB7XG4gICAgICAgIHN1Ym1pdEJ1dHRvbi5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBmdW5jdGlvbiBwcm9kdWN0TW9kYWxDYXJ0KHJlc3BvbnNlKSB7XG5cbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbm90aWZpY2F0aW9uLWJveF9fZGF0YS1pbicpO1xuXG4gICAgLy8g0J/QtdGA0LXQstGW0YDRj9GU0LzQviwg0YfQuCDQutC+0L3RgtC10LnQvdC10YAg0LfQvdCw0LnQtNC10L3Qviwg0YnQvtCxINGD0L3QuNC60L3Rg9GC0Lgg0L/QvtC80LjQu9C+0LpcbiAgICBpZiAoIWNvbnRhaW5lcikge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3I6IENvbnRhaW5lciAjcHJvZHVjdC1tb2RhbC1jb250ZW50IG5vdCBmb3VuZC4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAkKCcubm90aWZpY2F0aW9uLWJveCcpLnJlbW92ZUNsYXNzKCdpcy1zaG93Jyk7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJy5ub3RpZmljYXRpb24tYm94JylcbiAgICAgICAgLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgfSwgMjAwKTtcblxuICAgIC8vIDIuINCe0YLRgNC40LzRg9GU0LzQviDQvtCxJ9GU0LrRgiDQtyDQtNCw0L3QuNC80Lgg0L/RgNC+INGC0L7QstCw0YBcbiAgICBjb25zdCBpdGVtID0gcmVzcG9uc2UuaXRlbTtcblxuICAgIC8vIDMuINCh0YLQstC+0YDRjtGU0LzQviBIVE1MLdGA0Y/QtNC+0LosINCy0LjQutC+0YDQuNGB0YLQvtCy0YPRjtGH0Lgg0YjQsNCx0LvQvtC90L3RliDRgNGP0LTQutC4IChiYWNrdGlja3MgYGApXG4gICAgLy8gICAg0JfQstC10YDQvdGW0YLRjCDRg9Cy0LDQs9GDINC90LAg0LLQuNC/0YDQsNCy0LvQtdC90L3Rjzogc3JjPVwiJHtpdGVtLmltZ31cIiDRgtCwICR7aXRlbS52YXJpYW50TmFtZX1cbiAgICBjb25zdCBwcm9kdWN0SHRtbCA9IGBcbiAgICAgICAgPGEgaHJlZj1cIiR7aXRlbS51cmx9XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW1nLWhvbGRlclwiPlxuICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7aXRlbS5pbWd9XCIgYWx0PVwicHJvZHVjdCBpbWFnZVwiIHdpZHRoPVwiNTVcIiBoZWlnaHQ9XCI1NVwiPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGF0YVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZS1ob2xkZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGl0bGVcIj4ke2l0ZW0udGl0bGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgJHtpdGVtLnZhcmlhbnROYW1lID8gYDxzcGFuIGNsYXNzPVwic3ViLXRpdGxlXCI+JHtpdGVtLnZhcmlhbnROYW1lfTwvc3Bhbj5gIDogJyd9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByaWNlLWJveFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInByaWNlXCI+JHtpdGVtLnByaWNlfSDigrQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9hPlxuICAgIGA7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBwcm9kdWN0SHRtbDtcbiAgICB9LCAzMDApO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAkKCcubm90aWZpY2F0aW9uLWJveCcpLnNob3coMSkuYWRkQ2xhc3MoJ2lzLXNob3cnKTtcbiAgICB9LCAzMDApO1xuICB9XG5cblxuICBmdW5jdGlvbiBnb29nbGVBZGRUb0NhcnQocHJvZHVjdE5hbWUsIGlkLCBwcmljZSwgdGF4b25OYW1lLCB2YXJpYW50TmFtZSxicmFuZCkge1xuICAgIGNvbnN0IGl0ZW1WYXJpYW50ID0gdmFyaWFudE5hbWUgJiYgdmFyaWFudE5hbWUudHJpbSgpICE9PSAnJyA/IHZhcmlhbnROYW1lIDogdW5kZWZpbmVkO1xuXG4gICAgY29uc3QgZWNvbW1lcmNlRXZlbnQgPSB7XG4gICAgICBldmVudDogJ2FkZF90b19jYXJ0JyxcbiAgICAgIGVjb21tZXJjZToge1xuICAgICAgICBjdXJyZW5jeTogXCJVQUhcIiwgLy8g0JrQvtC0INCy0LDQu9GO0YLQuCwg0LIg0Y/QutGW0Lkg0LLRltC00LHRg9C70LDRgdGMINC/0L7QtNGW0Y9cbiAgICAgICAgdmFsdWU6IHByaWNlLFxuICAgICAgICBpdGVtczogW3tcbiAgICAgICAgICBpdGVtX25hbWU6IHByb2R1Y3ROYW1lLFxuICAgICAgICAgIGl0ZW1faWQ6IGlkLFxuICAgICAgICAgIHByaWNlOiBwcmljZSxcbiAgICAgICAgICBpdGVtX2NhdGVnb3J5OiAn0KLQuNC/INC/0YDQvtC00YPQutGC0YMnLFxuICAgICAgICAgIGl0ZW1fY2F0ZWdvcnkyOiB0YXhvbk5hbWUsXG4gICAgICAgICAgaXRlbV92YXJpYW50OiBpdGVtVmFyaWFudCxcbiAgICAgICAgICBpdGVtX2JyYW5kOiBicmFuZCxcbiAgICAgICAgICBxdWFudGl0eTogMVxuICAgICAgICB9XVxuICAgICAgfVxuICAgIH07XG5cbiAgICBkYXRhTGF5ZXIucHVzaCh7IGVjb21tZXJjZTogbnVsbCB9KTtcbiAgICBkYXRhTGF5ZXIucHVzaChlY29tbWVyY2VFdmVudCk7XG5cbiAgICBjb25zb2xlLmxvZygnYWRkX3RvX2NhcnQgZXZlbnQgc2VudDonLCBlY29tbWVyY2VFdmVudCk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVDb3VudEN1cnQoJGNvdW50KSB7XG4gICAgJCgnLnNpZGViYXItY29udGVudC10b3AtdGl0bGUtY291bnRlcicpXG4gICAgICAudGV4dCgkY291bnQpO1xuICAgICQoJy5jYXJ0LWNvdW50ZXInKVxuICAgICAgLnRleHQoJGNvdW50KTtcbiAgfVxuXG4gIC8vIFByZXNlbnQgZm9ybSBzdWJtaXNzaW9uXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljaycsICcuYnRuLXByZXNlbnQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgJCh0aGlzKVxuICAgICAgICAuY2xvc2VzdCgnZm9ybScpXG4gICAgICAgIC5zdWJtaXQoKTtcbiAgICB9KTtcblxuICAkKGRvY3VtZW50KVxuICAgIC5vbignc3VibWl0JywgJy5wcmVzZW50LWZvcm0nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgZm9ybSA9ICQodGhpcyk7XG4gICAgICBjb25zdCBmb3JtRGF0YSA9IGZvcm0uc2VyaWFsaXplKCk7XG4gICAgICBjb25zdCBzdWJtaXRCdXR0b24gPSBmb3JtLmZpbmQoJ2J1dHRvblt0eXBlPVwic3VibWl0XCJdJyk7XG5cbiAgICAgIC8vIENoZWNrIGlmIGJ1dHRvbiBpcyBhbHJlYWR5IGxvYWRpbmdcbiAgICAgIGlmIChzdWJtaXRCdXR0b24uaGFzQ2xhc3MoJ2xvYWRpbmcnKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vINGB0YLQsNC9INC30LDQstCw0L3RgtCw0LbQtdC90L3RjyDigJQg0LvQuNGI0LUg0L3QsCDRgdCw0LzRltC5INC60L3QvtC/0YbRllxuICAgICAgc3VibWl0QnV0dG9uLmFkZENsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgICQuYWpheCh7XG4gICAgICAgIHVybDogZm9ybS5hdHRyKCdhY3Rpb24nKSxcbiAgICAgICAgdHlwZTogZm9ybS5hdHRyKCdtZXRob2QnKSxcbiAgICAgICAgZGF0YTogZm9ybURhdGEsXG4gICAgICAgIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAvLyBVcGRhdGUgY2FydCBjb3VudGVyc1xuICAgICAgICAgIHVwZGF0ZUNvdW50Q3VydChyZXNwb25zZS5jb3VudCk7XG5cbiAgICAgICAgICB1cGRhdGVDYXJ0RGlzcGxheSgpO1xuICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5maW5kKCcuYnV5JylcbiAgICAgICAgICAgIC50ZXh0KCfQotC+0LLQsNGAINC00L7QtNCw0L3QvicpXG4gICAgICAgICAgICAuZmFkZUluKDIwMCk7XG5cbiAgICAgICAgICAvLyBVbmJsb2NrIGJ1dHRvbiBhZnRlciAzIHNlY29uZHNcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5maW5kKCcuYnV5JylcbiAgICAgICAgICAgICAgLmZhZGVPdXQoMjAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgICAgLnRleHQoJ9Ca0YPQv9C40YLQuCcpXG4gICAgICAgICAgICAgICAgICAuZmFkZUluKDIwMCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sIDMwMDApO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcigpIHtcbiAgICAgICAgICBhbGVydCgn0J/QvtC80LjQu9C60LA6INCd0LUg0LLQtNCw0LvQvtGB0Y8g0LTQvtC00LDRgtC4INGC0L7QstCw0YAuJyk7XG4gICAgICAgICAgc3VibWl0QnV0dG9uLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbXBsZXRlKCkge1xuICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgLy8gQ2FydCBkaXNwbGF5IGZ1bmN0aW9uc1xuICBmdW5jdGlvbiB1cGRhdGVDYXJ0RGlzcGxheTIoKSB7XG4gICAgY29uc29sZS5sb2coJ3VwZGF0ZUNhcnREaXNwbGF5MicpO1xuICAgICQuYWpheCh7XG4gICAgICB1cmw6ICcvYXBpL2NhcnQnLFxuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgIHN1Y2Nlc3MoZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhLmh0bWwpO1xuICAgICAgICAkKCcuY2FydC1zdW1tYXJ5JylcbiAgICAgICAgICAuaHRtbChkYXRhLmh0bWwpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIC8vINCc0LDQu9GO0ZQg0LPQvtGC0L7QstC40Lkg0L/RltC00YHRg9C80L7QuiDQutC+0YjQuNC60LAuINCi0YMg0YHQsNC80YMg0LLRltC00L/QvtCy0ZbQtNGMIChjb3VudC90b3RhbC9odG1sKSDQstGW0LTQtNCw0ZRcbiAgLy8g0ZYgL2FwaS9jYXJ0LCDRliAvYXBpL2NhcnQvdXBkYXRlLXF1YW50aXR5IOKAlCDRgtC+0LYg0L/RltGB0LvRjyDCqyvCuy/Cq+KIksK7INC00YDRg9Cz0LjQuSDQt9Cw0L/QuNGCXG4gIC8vINGD0LbQtSDQvdC1INC/0L7RgtGA0ZbQsdC10L0uXG4gIGZ1bmN0aW9uIHJlbmRlckNhcnRTdW1tYXJ5KHJlc3BvbnNlKSB7XG4gICAgaWYgKCFyZXNwb25zZSB8fCB0eXBlb2YgcmVzcG9uc2UuaHRtbCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB1cGRhdGVDb3VudEN1cnQocmVzcG9uc2UuY291bnQpO1xuXG4gICAgaWYgKHJlc3BvbnNlLnRvdGFsICYmIHJlc3BvbnNlLnRvdGFsID4gMjkwMDAwMCkge1xuICAgICAgJCgnLmNoZWNrb3V0LWZvcm0tYmxvY2stdG9fdGVybWluYWwnKS5oaWRlKCk7XG4gICAgICAkKCcudG9fdGVybWluYWwnKS5oaWRlKCk7XG4gICAgICAkKCdpbnB1dFtuYW1lPVwibnAtdGVybWluYWwtbmFtZVwiXScpLnZhbCgnJyk7XG4gICAgICBpZiAoJCgnI3RvX3Rlcm1pbmFsJykuaXMoJzpjaGVja2VkJykpIHtcbiAgICAgICAgJCgnI3RvX3dhcmVob3VzZScpLmNsaWNrKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJy5jaGVja291dC1mb3JtLWJsb2NrLXRvX3Rlcm1pbmFsJykuc2hvdygpO1xuICAgIH1cblxuICAgIHBhaW50Q2FydChyZXNwb25zZS5odG1sKTtcbiAgICAkKCcuc2lkZWJhci1pbm5lcicpXG4gICAgICAucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICAkKCcuY2hlY2tvdXQtd3JhcHBlci1yaWdodCcpXG4gICAgICAucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8g0JrQu9Cw0LTQtSDQs9C+0YLQvtCy0LjQuSBIVE1MINC60L7RiNC40LrQsCDRliDRgdC40L3RhdGA0L7QvdGW0LfRg9GUINCy0YHQtSwg0YnQviDQttC40LLQtSDQv9C+0LfQsCDQvdC40Lw6INGI0LrQsNC70YMsXG4gIC8vINGB0YLQsNC9INC/0L7QtNCw0YDRg9C90LrRltCyLCDQt9C90LDRh9C+0Log0L/QvtC00LDRgNGD0L3QutGW0LIg0YMg0YjQsNC/0YbRliDRiNGC0L7RgNC60Lgg0YLQsCDQv9GW0LTQv9C40YEg0LrQvdC+0L/QutC4XG4gIGZ1bmN0aW9uIHBhaW50Q2FydChodG1sKSB7XG4gICAgLy8g0KnQviDQstC20LUg0LHRg9C70L4g0LIg0LrQvtGI0LjQutGDINC00L4g0L/QtdGA0LXQvNCw0LvRjNC+0LLRg9Cy0LDQvdC90Y86INC90L7QstC1INC3J9GP0LLQu9GP0ZTRgtGM0YHRjyDQsNC90ZbQvNC+0LLQsNC90L4sXG4gICAgLy8g0YDQtdGI0YLQsCDQvdC1INCx0LvQuNC80LDRlC4g0JrQu9GO0Ycg4oCUIGlkINCy0LDRgNGW0LDQvdGC0LA7INC/0L7QtNCw0YDRg9C90L7QuiDRliDRgtC+0LLQsNGAINGA0ZbQt9C90ZYg0LfQsCDQutC70LDRgdC+0LxcbiAgICBjb25zdCBzZWVuID0gbmV3IFNldCgpO1xuICAgICQoJy5zaWRlYmFyLWNvbnRlbnQtcmVwbGFjZScpLmZpcnN0KClcbiAgICAgIC5maW5kKCcuY2hlY2tvdXQtcHJvZHVjdC10b3AtaXRlbSwgLmNhcnQtZ2lmdCcpXG4gICAgICAuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlZW4uYWRkKGAkeyQodGhpcykuaGFzQ2xhc3MoJ2NhcnQtZ2lmdCcpID8gJ2cnIDogJ2knfSR7JCh0aGlzKS5hdHRyKCdkYXRhLWlkJykgfHwgJCh0aGlzKS5hdHRyKCdkYXRhLXZhcmlhbnQtaWQnKX1gKTtcbiAgICAgIH0pO1xuICAgIGNvbnN0IGhhZEl0ZW1zID0gc2Vlbi5zaXplID4gMDtcblxuICAgICQoJy5zaWRlYmFyLWNvbnRlbnQtcmVwbGFjZSwgI2NoZWNrb3V0LWluZm8nKS5odG1sKGh0bWwpO1xuXG4gICAgaWYgKGhhZEl0ZW1zKSB7XG4gICAgICAkKCcuc2lkZWJhci1jb250ZW50LXJlcGxhY2UsICNjaGVja291dC1pbmZvJylcbiAgICAgICAgLmZpbmQoJy5jaGVja291dC1wcm9kdWN0LXRvcC1pdGVtLCAuY2FydC1naWZ0JylcbiAgICAgICAgLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnN0ICRlbCA9ICQodGhpcyk7XG4gICAgICAgICAgY29uc3QgaXNHaWZ0ID0gJGVsLmhhc0NsYXNzKCdjYXJ0LWdpZnQnKTtcbiAgICAgICAgICBpZiAoIXNlZW4uaGFzKGAke2lzR2lmdCA/ICdnJyA6ICdpJ30keyRlbC5hdHRyKCdkYXRhLWlkJykgfHwgJGVsLmF0dHIoJ2RhdGEtdmFyaWFudC1pZCcpfWApKSB7XG4gICAgICAgICAgICAoaXNHaWZ0ID8gJGVsIDogJGVsLmNsb3Nlc3QoJy5jaGVja291dC1wcm9kdWN0LXRvcC1pdGVtLXdyYXBwZXInKSkuYWRkQ2xhc3MoJ2lzLW5ldycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvZ3Jlc0JhcigpO1xuICAgIGluaXRTYW1wbGVSZWZ1c2UoKTtcbiAgICBzeW5jR2lmdEJhZGdlKCk7XG4gICAgc3luY0dpZnRDdGEoKTtcbiAgICAkKGRvY3VtZW50KS50cmlnZ2VyKCdjYXJ0OnBhaW50ZWQnKTtcbiAgfVxuXG4gIC8vINCh0LrRltC70YzQutC4INC/0L7QtNCw0YDRg9C90LrRltCyINGJ0LUg0LzQvtC20L3QsCDQvtCx0YDQsNGC0Lgg4oCUINGH0LjRgdC70L4g0Lkg0LDQvdGW0LzQsNGG0ZbRjyDCq9C/0ZbQtNGB0LrQvtC60YPCuyDRgyDRiNCw0L/RhtGWXG4gIGZ1bmN0aW9uIHN5bmNHaWZ0QmFkZ2UoKSB7XG4gICAgY29uc3QgbGVmdCA9IHBhcnNlSW50KCQoJy5zaWRlYmFyLWNvbnRlbnQtcmVwbGFjZSAuY2FydC1tZXRhJykuZmlyc3QoKS5hdHRyKCdkYXRhLWdpZnRzLWNvdW50JyksIDEwKSB8fCAwO1xuICAgIGNvbnN0ICRiYWRnZSA9ICQoJy5zaWRlYmFyLWNvbnRlbnQtdG9wLWdpZnRzJyk7XG4gICAgaWYgKCEkYmFkZ2UubGVuZ3RoKSByZXR1cm47XG5cbiAgICBjb25zdCBwcmV2ID0gcGFyc2VJbnQoJGJhZGdlLmF0dHIoJ2RhdGEtY291bnQnKSwgMTApO1xuICAgICRiYWRnZS5hdHRyKCdkYXRhLWNvdW50JywgbGVmdCkuZmluZCgnLnNpZGViYXItY29udGVudC10b3AtZ2lmdHMtY291bnQnKS50ZXh0KGxlZnQpO1xuICAgICRiYWRnZS50b2dnbGVDbGFzcygnaGFzLWdpZnRzJywgbGVmdCA+IDApO1xuXG4gICAgaWYgKCFOdW1iZXIuaXNOYU4ocHJldikgJiYgcHJldiAhPT0gbGVmdCkge1xuICAgICAgJGJhZGdlLnJlbW92ZUNsYXNzKCdpcy1idW1wJyk7XG4gICAgICB2b2lkICRiYWRnZS5nZXQoMCkub2Zmc2V0V2lkdGg7IC8vIHJlZmxvdyDigJQg0YnQvtCxINCw0L3RltC80LDRhtGW0Y8g0L/QvtCy0YLQvtGA0Y7QstCw0LvQsNGB0YxcbiAgICAgICRiYWRnZS5hZGRDbGFzcygnaXMtYnVtcCcpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHNpbGVudCDigJQg0L/QtdGA0LXQvNCw0LvRjtCy0LDRgtC4INCx0LXQtyDQt9Cw0YLQtdC80L3QtdC90L3RjyDQutC+0YjQuNC60LAuINCU0LvRjyDCqyvCuy/Cq+KIksK7INC60ZbQu9GM0LrRltGB0YLRjFxuICAvLyDQt9C80ZbQvdGO0ZTRgtGM0YHRjyDQsiDRltC90YLQtdGA0YTQtdC50YHRliDQvtC00YDQsNC30YMsINGC0L7QtiDQu9C+0LDQtNC10YAg0LvQuNGI0LUg0YLRgNC40LzQsNCyINCx0Lgg0LvRjtC00LjQvdGDINCyXG4gIC8vINC+0YfRltC60YPQstCw0L3QvdGWINCy0ZbQtNC/0L7QstGW0LTRli5cbiAgLy8g0YfQtdC60LDRg9GCINC/0LXRgNC10LzQsNC70YzQvtCy0YPRlCDQv9GW0LTRgdGD0LzQvtC6INC/0ZbRgdC70Y8g0LLQuNGA0ZbQstC90Y7QstCw0L3QvdGPINGB0YPQvNC4INC3IDHQoSAoY2hlY2tvdXQuanMsIHByZWNoZWNrKVxuICB3aW5kb3cuc2tSZWZyZXNoQ2FydCA9IGZ1bmN0aW9uICgpIHsgdXBkYXRlQ2FydERpc3BsYXkoeyBzaWxlbnQ6IHRydWUgfSk7IH07XG5cbiAgLy8g0J/QvtCy0L3QvtC10LrRgNCw0L3QvdC40Lkg0LvQvtCw0LTQtdGAINC70LjRiNC1INC/0L7QutC4INGI0YLQvtGA0LrQsCDRidC1INC/0L7RgNC+0LbQvdGPICjQv9C10YDRiNC1INCy0ZbQtNC60YDQuNGC0YLRjykuINCU0LDQu9GWICsv4oiSLCDQtNC+0LTQsNCy0LDQvdC90Y8g0YDQtdC60L7QvNC10L3QtNCw0YbRltGXLFxuICAvLyDQstC40LTQsNC70LXQvdC90Y8g0Lkg0LLQuNCx0ZbRgCDQv9C+0LTQsNGA0YPQvdC60LAg0L7QvdC+0LLQu9GO0Y7RgtGMINC60L7RiNC40Log0L3QsCDQvNGW0YHRhtGWLCDQsdC10LcgwqvQt9Cw0LLQsNC90YLQsNC20LXQvdC90Y/Cuywg0YnQviDQv9C10YDQtdC60YDQuNCy0LDRlCDQstC10YHRjCDRgdC/0LjRgdC+0LpcbiAgLy8gKNC00LjQsi4gUGxhbmZpeCA0ODg1LCDQvy4gOCk6INC60L3QvtC/0LrQuCDRgNGP0LTQutCwINC90LAg0YfQsNGBINC30LDQv9C40YLRgyDQsdC70L7QutGD0Y7RgtGM0YHRjywg0LAg0LLRltC00L/QvtCy0ZbQtNGMINCy0YHRgtCw0LLQu9GP0ZTRgtGM0YHRjyDQs9C+0YLQvtCy0LjQvCBIVE1MLlxuICBmdW5jdGlvbiBjYXJ0SGFzQ29udGVudCgpIHtcbiAgICByZXR1cm4gJCgnLnNpZGViYXItaW5uZXIgLmNoZWNrb3V0LXByb2R1Y3QtdG9wLCAuY2hlY2tvdXQtd3JhcHBlci1yaWdodCAuY2hlY2tvdXQtcHJvZHVjdC10b3AsIC5lbXB0eS1jYXJ0JykubGVuZ3RoID4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZUNhcnREaXNwbGF5KG9wdGlvbnMpIHtcbiAgICBjb25zdCBzaWxlbnQgPSBCb29sZWFuKG9wdGlvbnMgJiYgb3B0aW9ucy5zaWxlbnQpIHx8IGNhcnRIYXNDb250ZW50KCk7XG5cbiAgICBpZiAoIXNpbGVudCkge1xuICAgICAgJCgnLnNpZGViYXItaW5uZXInKVxuICAgICAgICAuYWRkQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICAgICQoJy5jaGVja291dC13cmFwcGVyLXJpZ2h0JylcbiAgICAgICAgLmFkZENsYXNzKCdsb2FkaW5nJyk7XG4gICAgfVxuXG4gICAgJCgnLm5vdGlmaWNhdGlvbi1ib3gnKVxuICAgICAgLnJlbW92ZUNsYXNzKCdpcy1zaG93Jyk7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgdXJsOiAnL2FwaS9jYXJ0JyxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgIHJlbmRlckNhcnRTdW1tYXJ5KHJlc3BvbnNlKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBwcm9ncmVzQmFyKCkge1xuICAgIC8vIDEuIENoZWNrIGlmIHByb2dyZXNzIGJhcnMgZXhpc3QgYmVmb3JlIHJ1bm5pbmcgbG9vcFxuICAgIGNvbnN0ICRwcm9ncmVzc0Jsb2NrcyA9ICQoJy5wcm9ncmVzcy1iYXJfX2Jsb2NrJyk7XG5cbiAgICBpZiAoJHByb2dyZXNzQmxvY2tzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKCdwcm9ncmVzc0JhcicpO1xuICAgICAgJHByb2dyZXNzQmxvY2tzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCAkaG9sZGVyID0gJCh0aGlzKTtcblxuICAgICAgICBmdW5jdGlvbiBwYXJzZU51bWJlcih2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KFN0cmluZyh2YWx1ZSkucmVwbGFjZSgvXFxzL2csICcnKS5yZXBsYWNlKCcsJywgJy4nKSkgfHwgMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHBhcnNlTnVtYmVyKCRob2xkZXIuZGF0YSgnY3VycmVudCcpKTtcbiAgICAgICAgY29uc3QgbWluVmFsdWUgPSBwYXJzZU51bWJlcigkaG9sZGVyLmRhdGEoJ21pbicpKTtcbiAgICAgICAgY29uc3QgbWF4VmFsdWUgPSBwYXJzZU51bWJlcigkaG9sZGVyLmRhdGEoJ21heCcpKTtcbiAgICAgICAgY29uc3QgZGVsaXZlcnlWYWx1ZSA9IHBhcnNlTnVtYmVyKCRob2xkZXIuZGF0YSgnZGVsaXZlcnknKSk7XG4gICAgICAgIGNvbnN0IGxhc3RWYWx1ZUxpbWl0ID0gcGFyc2VOdW1iZXIoJGhvbGRlci5kYXRhKCdsYXN0JykpO1xuICAgICAgICAvLyDQhCDQt9Cw0YDQvtCx0LvQtdC90LjQuSwg0LDQu9C1INGJ0LUg0L3QtSDQvtCx0YDQsNC90LjQuSDQvdCw0LHRltGAIOKAlCDRiNC60LDQu9CwINGB0YLQvtGX0YLRjCDQvdCwINC/0YDQvtC50LTQtdC90L7QvNGDXG4gICAgICAgIC8vINC/0L7RgNC+0LfRliwg0ZYg0LfQsNC80ZbRgdGC0YwgwqvQktGW0YLQsNGU0LzQviwg0LLQuCDQvtGC0YDQuNC80LDQu9C4wrsg0LrQsNC20LXQvNC+IMKr0LzQvtC20LXRiCDQvtCx0YDQsNGC0LjCu1xuICAgICAgICBjb25zdCBnaWZ0UmVhZHkgPSBTdHJpbmcoJGhvbGRlci5kYXRhKCdnaWZ0LXJlYWR5JykpID09PSAnMSc7XG5cbiAgICAgICAgY29uc3QgJG1vcmVUZXh0ID0gJGhvbGRlci5maW5kKCcubW9yZS10eHQnKTtcbiAgICAgICAgY29uc3QgJG1vcmVWYWx1ZSA9ICRtb3JlVGV4dC5maW5kKCcuYW1vdW50IHNwYW4nKTtcblxuICAgICAgICBjb25zdCAkbGFzdFRleHQgPSAkaG9sZGVyLmZpbmQoJy5sYXN0LXR4dCcpO1xuICAgICAgICBjb25zdCAkbGFzdFZhbHVlID0gJGxhc3RUZXh0LmZpbmQoJy5hbW91bnQgc3BhbicpO1xuXG4gICAgICAgIGNvbnN0ICRnaWZ0VGV4dCA9ICRob2xkZXIuZmluZCgnLmdpZnQtdHh0Jyk7XG4gICAgICAgIGNvbnN0ICRnaWZ0VmFsdWUgPSAkZ2lmdFRleHQuZmluZCgnLmFtb3VudCBzcGFuJyk7XG5cbiAgICAgICAgY29uc3QgJG1pblRleHQgPSAkaG9sZGVyLmZpbmQoJy5taW4tdHh0IHNwYW4nKTtcbiAgICAgICAgY29uc3QgJG1heEhvbGRlciA9ICRob2xkZXIuZmluZCgnLm1heC10eHQnKTtcbiAgICAgICAgY29uc3QgJG1heFRleHQgPSAkbWF4SG9sZGVyLmZpbmQoJ3NwYW4nKTtcblxuICAgICAgICBjb25zdCAkZGVsaXZlcnlIb2xkZXIgPSAkaG9sZGVyLmZpbmQoJy5kZWxpdmVyeS10eHQnKTtcbiAgICAgICAgY29uc3QgJGRlbGl2ZXJ5VGV4dCA9ICRkZWxpdmVyeUhvbGRlci5maW5kKCdzcGFuJyk7XG5cbiAgICAgICAgY29uc3QgJHByb2dyZXNzQmFyID0gJGhvbGRlci5maW5kKCcucHJvZ3Jlc3MtYmFyX19wcm9ncmVzcycpO1xuXG4gICAgICAgIGNvbnN0IGFtb3VudCA9IG1heFZhbHVlIC0gY3VycmVudFZhbHVlO1xuICAgICAgICBjb25zdCBkZWxpdmVyeSA9IGRlbGl2ZXJ5VmFsdWUgLSBjdXJyZW50VmFsdWU7XG4gICAgICAgIC8vINCv0Log0YMg0LzQsNC60LXRgtGWOiDRiNC60LDQu9CwIOKAlCDRhtC1INC00LLQsCDRgNGW0LLQvdGWINCy0ZbQtNGA0ZbQt9C60LgsIDAg4oaSINC00L7RgdGC0LDQstC60LAg0ZZcbiAgICAgICAgLy8g0LTQvtGB0YLQsNCy0LrQsCDihpIg0YbRltC70YwuINCf0L7Qt9C40YbRltGPINC30L3QsNGH0LrQsCDQtNC+0YHRgtCw0LLQutC4INGC0L7QvNGDINC30LDQstC20LTQuCDQv9C+0YHQtdGA0LXQtNC40L3Rliwg0LAg0L3QtVxuICAgICAgICAvLyDQv9GA0L7Qv9C+0YDRhtGW0LnQvdCwINGB0YPQvNGWOiDQv9GA0Lgg0YbRltC70ZYgNTUgMDAwINC/0L7RgNGW0LMgMyAwMDAg0YHRgtC40YHQutCw0LLRgdGPINCxINGDINC60ZbQu9GM0LrQsFxuICAgICAgICAvLyDQstGW0LTRgdC+0YLQutGW0LIg0ZYg0LnQvtCz0L4g0L/RltC00L/QuNGBINC90LDQu9Cw0LfQuNCyINCx0Lgg0L3QsCDCqzAg4oK0wrsuXG4gICAgICAgIGNvbnN0IHNwbGl0UG9zID0gNTA7XG4gICAgICAgIGNvbnN0IGhhc1NwbGl0ID0gbWF4VmFsdWUgPiAwICYmIGRlbGl2ZXJ5VmFsdWUgPiAwICYmIGRlbGl2ZXJ5VmFsdWUgPCBtYXhWYWx1ZTtcbiAgICAgICAgY29uc3QgcG9zT2YgPSAodmFsdWUpID0+IHtcbiAgICAgICAgICBpZiAoIW1heFZhbHVlKSByZXR1cm4gMDtcbiAgICAgICAgICBjb25zdCBwb3MgPSBoYXNTcGxpdFxuICAgICAgICAgICAgPyAodmFsdWUgPD0gZGVsaXZlcnlWYWx1ZVxuICAgICAgICAgICAgICA/ICh2YWx1ZSAvIGRlbGl2ZXJ5VmFsdWUpICogc3BsaXRQb3NcbiAgICAgICAgICAgICAgOiBzcGxpdFBvcyArICgodmFsdWUgLSBkZWxpdmVyeVZhbHVlKSAvIChtYXhWYWx1ZSAtIGRlbGl2ZXJ5VmFsdWUpKSAqICgxMDAgLSBzcGxpdFBvcykpXG4gICAgICAgICAgICA6ICh2YWx1ZSAvIG1heFZhbHVlKSAqIDEwMDtcblxuICAgICAgICAgIHJldHVybiBNYXRoLm1pbigxMDAsIE1hdGgubWF4KDAsIHBvcykpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHByb2dyZXNzID0gbWF4VmFsdWUgPyBwb3NPZihjdXJyZW50VmFsdWUpLnRvRml4ZWQoMSkgOiAwO1xuICAgICAgICBjb25zdCBkZWxpdmVyeVBvcyA9IG1heFZhbHVlID8gcG9zT2YoZGVsaXZlcnlWYWx1ZSkudG9GaXhlZCgxKSA6IDA7XG4gICAgICAgIGNvbnN0IHJlYWR5UG9zID0gZGVsaXZlcnlWYWx1ZSA/ICgoY3VycmVudFZhbHVlICogMTAwKSAvIGRlbGl2ZXJ5VmFsdWUpLnRvRml4ZWQoMSkgOiAwO1xuXG4gICAgICAgICRob2xkZXIucmVtb3ZlQ2xhc3MoJ2lzLXJlYWR5IGlzLWZ1bGwgaXMtZGVsaXZlcnkgaXMtZ2lmdC1yZWFkeScpO1xuICAgICAgICAkbWF4SG9sZGVyLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcblxuICAgICAgICAkbWluVGV4dC50ZXh0KG1pblZhbHVlKTtcbiAgICAgICAgJG1heFRleHQudGV4dChtYXhWYWx1ZSk7XG4gICAgICAgICRkZWxpdmVyeVRleHQudGV4dChkZWxpdmVyeVZhbHVlKTtcblxuICAgICAgICBpZiAoIW1heFZhbHVlKSB7XG4gICAgICAgICAgJG1heEhvbGRlci5hZGRDbGFzcygnaXMtaGlkZGVuJyk7XG5cbiAgICAgICAgICAkZGVsaXZlcnlIb2xkZXIuY3NzKHtcbiAgICAgICAgICAgIGRpc3BsYXk6ICdibG9jaycsXG4gICAgICAgICAgICBsZWZ0OiAnJyxcbiAgICAgICAgICAgIHJpZ2h0OiAnMCdcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmIChkZWxpdmVyeSA8PSAwKSB7XG4gICAgICAgICAgICAkaG9sZGVyLmFkZENsYXNzKCdpcy1yZWFkeScpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkaG9sZGVyLnJlbW92ZUNsYXNzKCdpcy1yZWFkeScpO1xuICAgICAgICAgICAgJHByb2dyZXNzQmFyLmNzcygnd2lkdGgnLCByZWFkeVBvcyArICclJyk7XG4gICAgICAgICAgICAkbW9yZVRleHQuc2hvdygpO1xuICAgICAgICAgICAgJG1vcmVWYWx1ZS50ZXh0KGRlbGl2ZXJ5KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzYW1lQXNEZWxpdmVyeSA9IG1heFZhbHVlID09PSBkZWxpdmVyeVZhbHVlO1xuXG4gICAgICAgIGlmICghc2FtZUFzRGVsaXZlcnkpIHtcbiAgICAgICAgICAkZGVsaXZlcnlIb2xkZXIuY3NzKHtcbiAgICAgICAgICAgIGRpc3BsYXk6ICdibG9jaycsXG4gICAgICAgICAgICByaWdodDogJycsXG4gICAgICAgICAgICBsZWZ0OiBgJHtkZWxpdmVyeVBvc30lYFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vINCf0L7QtNCw0YDRg9C90L7QuiDQvdCwINGC0L7QvNGDINC2INC/0L7RgNC+0LfRliwg0YnQviDQuSDQtNC+0YHRgtCw0LLQutCwICjQsdGA0L7QvdC30LXRgCDQstGW0LQgMzAwMCk6XG4gICAgICAgICAgLy8g0L7QutGA0LXQvNCwINGG0ZbQu9GMINC70LjRiNC1INC90LDQu9GW0LfQu9CwINCxINC90LAg0LfQvdCw0YfQvtC6INC00L7RgdGC0LDQstC60Lgg4oCUINC70LjRiNCw0ZTQvNC+INC+0LTQuNC9XG4gICAgICAgICAgJG1heEhvbGRlci5hZGRDbGFzcygnaXMtaGlkZGVuJyk7XG4gICAgICAgICAgJGRlbGl2ZXJ5SG9sZGVyLmNzcyh7XG4gICAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgICAgbGVmdDogJycsXG4gICAgICAgICAgICByaWdodDogJzAnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYW1vdW50IDw9IDApIHtcbiAgICAgICAgICAkaG9sZGVyLmFkZENsYXNzKGdpZnRSZWFkeSA/ICdpcy1naWZ0LXJlYWR5JyA6ICdpcy1mdWxsJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJGhvbGRlci5yZW1vdmVDbGFzcygnaXMtZnVsbCcpO1xuICAgICAgICAkcHJvZ3Jlc3NCYXIuY3NzKCd3aWR0aCcsIHByb2dyZXNzICsgJyUnKTtcblxuICAgICAgICBpZiAoZGVsaXZlcnkgPD0gMCkge1xuICAgICAgICAgICRob2xkZXIuYWRkQ2xhc3MoJ2lzLWRlbGl2ZXJ5Jyk7XG5cbiAgICAgICAgICBpZiAoYW1vdW50IDw9IGxhc3RWYWx1ZUxpbWl0KSB7XG4gICAgICAgICAgICAkbGFzdFRleHQuc2hvdygpO1xuICAgICAgICAgICAgJGxhc3RWYWx1ZS50ZXh0KGFtb3VudCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRnaWZ0VGV4dC5zaG93KCk7XG4gICAgICAgICAgICAkZ2lmdFZhbHVlLnRleHQoYW1vdW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJG1vcmVUZXh0LnNob3coKTtcbiAgICAgICAgICAkbW9yZVZhbHVlLnRleHQoZGVsaXZlcnkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyAyLiBDaGVjayBpZiBTbGlkZXIgZXhpc3RzIEFORCBpcyBub3QgYWxyZWFkeSBpbml0aWFsaXplZFxuICAgIGNvbnN0ICRzbGlkZXIgPSAkKCcubW9yZS1zbGlkZXJfX3NsaWRlcicpO1xuXG4gICAgaWYgKCRzbGlkZXIubGVuZ3RoID4gMCAmJiAhJHNsaWRlci5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuICAgICAgLy8g0YDQtdC60L7QvNC10L3QtNCw0YbRltGXOiDQutC+0LvQuCDQstGB0ZYg0LrQsNGA0YLQutC4INCy0LzRltGJ0LDRjtGC0YzRgdGPINC5INCz0L7RgNGC0LDRgtC4INC90ZbRh9C+0LPQviwg0YHQu9Cw0LnQtNC10YAg0YbQtdC90YLRgNGD0ZTRgtGM0YHRj1xuICAgICAgZnVuY3Rpb24gY2VudGVyRmV3U2xpZGVzKCkge1xuICAgICAgICBjb25zdCAkbGlzdCA9ICRzbGlkZXIuZmluZCgnLnNsaWNrLWxpc3QnKTtcbiAgICAgICAgbGV0IHdpZHRoID0gMDtcbiAgICAgICAgJHNsaWRlci5maW5kKCcuc2xpY2stc2xpZGUnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB3aWR0aCArPSAkKHRoaXMpLm91dGVyV2lkdGgodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyDRiNGC0L7RgNC60LAg0LrQvtGI0LjQutCwINGW0L3RltGG0ZbQsNC70ZbQt9GD0ZQg0YHQu9Cw0LnQtNC10YAg0L/RgNC40YXQvtCy0LDQvdC+0Y4gKNGI0LjRgNC40L3QsCAwKTog0YDQsNGF0YPRlNC80L4g0LvQuNGI0LUg0LrQvtC70Lgg0YHQv9C40YHQvtC6INC80LDRlCDRiNC40YDQuNC90YNcbiAgICAgIGlmICgkbGlzdC53aWR0aCgpID4gMCkgJHNsaWRlci50b2dnbGVDbGFzcygnaXMtY2VudGVyZWQnLCB3aWR0aCAtIDEyIDw9ICRsaXN0LndpZHRoKCkpO1xuICAgICAgfVxuICAgICAgJHNsaWRlci5vbignaW5pdCByZUluaXQgc2V0UG9zaXRpb24nLCBjZW50ZXJGZXdTbGlkZXMpO1xuICAgICAgaWYgKHdpbmRvdy5SZXNpemVPYnNlcnZlcikgbmV3IFJlc2l6ZU9ic2VydmVyKGNlbnRlckZld1NsaWRlcykub2JzZXJ2ZSgkc2xpZGVyWzBdKTtcblxuICAgICAgJHNsaWRlci5zbGljayh7XG4gICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgc2xpZGVzVG9TaG93OiAzLFxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZSxcbiAgICAgICAgYXJyb3dzOiB0cnVlLFxuICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYnJlYWtwb2ludDogNTAwLFxuICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAyXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgLy8gQ2FydCBxdWFudGl0eSB1cGRhdGVcbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrJywgJy5jaGVja291dC1wcm9kdWN0LXRvcC1pbmZvLWxlZnQtcXVhbnRpdHktcmVtb3ZlJywgZnVuY3Rpb24gKCkge1xuICAgICAgdXBkYXRlUXVhbnRpdHkoJCh0aGlzKSwgLTEpO1xuICAgICAgY29uc29sZS5sb2coJ2NsaWNrIG1pbnVzJyk7XG4gICAgfSk7XG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5jaGVja291dC1wcm9kdWN0LXRvcC1pbmZvLWxlZnQtcXVhbnRpdHktYWRkJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0ICRidG4gPSAkKHRoaXMpO1xuXG4gICAgLy8gMSkgYnVtcCBxdWFudGl0eSBpbiBVSVxuICAgIHVwZGF0ZVF1YW50aXR5KCRidG4sIDEpO1xuICAgIGNvbnNvbGUubG9nKCdjbGljayBwbHVzJyk7XG5cbiAgfSk7XG5cbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrJywgJy5jaGVja291dC1wcm9kdWN0LXRvcC1pbmZvLXJpZ2h0LXJlbW92ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbmZpcm1BbmRSZW1vdmUoJCh0aGlzKSwgdHJ1ZSk7XG4gICAgfSk7XG5cbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrJywgJy5jaGVja291dC1mb3JtLWJsb2NrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIC8vINCv0LrRidC+INC60LvRltC6INC/0L4g0YHQsNC80L7QvNGDIDxpbnB1dD4g0LDQsdC+IDxsYWJlbD4sINC90LXRhdCw0Lkg0YHRgtCw0L3QtNCw0YDRgtC90LAg0L7QsdGA0L7QsdC60LAg0LnQtNC1INC00LDQu9GWXG4gICAgICBpZiAoJChlLnRhcmdldClcbiAgICAgICAgLmlzKCdpbnB1dFt0eXBlPVwicmFkaW9cIl0sIGxhYmVsJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyDQhtC90LDQutGI0LUg0LfQvdCw0YXQvtC00LjQvNC+IGlucHV0W3R5cGU9XCJyYWRpb1wiXSDQsiDRgdC10YDQtdC00LjQvdGWINCx0LvQvtC60YMuLi5cbiAgICAgIGNvbnN0ICRyYWRpbyA9ICQodGhpcylcbiAgICAgICAgLmZpbmQoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpO1xuXG4gICAgICAvLyAuLi7RliDQt9GA0L7QsdC40LzQviDQudC+0LPQviBjaGVja2VkXG4gICAgICBpZiAoISRyYWRpby5wcm9wKCdjaGVja2VkJykpIHtcbiAgICAgICAgJHJhZGlvLnByb3AoJ2NoZWNrZWQnLCB0cnVlKVxuICAgICAgICAgIC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICBmdW5jdGlvbiB1cGRhdGVRdWFudGl0eShidXR0b24sIGFtb3VudCkge1xuICAgIC8vINCa0L3QvtC/0LrQuCDRhtGM0L7Qs9C+INGA0Y/QtNC60LAg0LHQu9C+0LrRg9GU0LzQviDQvdCwINGH0LDRgSDQutGA0YPQs9C+0LLQvtGA0L7RgtGDIOKAlCDRltC90LDQutGI0LUg0YjQstC40LTQutGWINC60LvRltC60LhcbiAgICAvLyDQvdCw0LfQtNC+0LPQsNC90Y/RjtGC0Ywg0L7QtNC40L0g0L7QtNC90L7Qs9C+INC5INC60ZbQu9GM0LrRltGB0YLRjCDRgNC+0LfKvNGX0LbQtNC20LDRlNGC0YzRgdGPINC3INGB0LXRgNCy0LXRgNC+0LxcbiAgICBjb25zdCAkY29udHJvbHMgPSBidXR0b24uY2xvc2VzdCgnLmNoZWNrb3V0LXByb2R1Y3QtdG9wLWluZm8tbGVmdC1xdWFudGl0eScpXG4gICAgICAuZmluZCgnLmNoZWNrb3V0LXByb2R1Y3QtdG9wLWluZm8tbGVmdC1xdWFudGl0eS1yZW1vdmUsIC5jaGVja291dC1wcm9kdWN0LXRvcC1pbmZvLWxlZnQtcXVhbnRpdHktYWRkJyk7XG4gICAgJGNvbnRyb2xzLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cbiAgICBjb25zdCBxdWFudGl0eUVsZW1lbnQgPSBidXR0b24uY2xvc2VzdCgnLmNoZWNrb3V0LXByb2R1Y3QtdG9wLWluZm8tbGVmdC1xdWFudGl0eScpXG4gICAgICAuZmluZCgnLmNoZWNrb3V0LXByb2R1Y3QtdG9wLWluZm8tbGVmdC1xdWFudGl0eS10ZXh0Jyk7XG5cbiAgICBjb25zdCBxdWFudGl0eSA9IHBhcnNlSW50KHF1YW50aXR5RWxlbWVudC5pcygnaW5wdXQnKSA/IHF1YW50aXR5RWxlbWVudC52YWwoKSA6IHF1YW50aXR5RWxlbWVudC50ZXh0KCksIDEwKTtcbiAgICBjb25zdCBtYXhRdWFudGl0eSA9IHBhcnNlSW50KHF1YW50aXR5RWxlbWVudC5kYXRhKCdtYXgtdmFsJyksIDEwKTtcbiAgICBjb25zdCBuZXdRdWFudGl0eSA9IHF1YW50aXR5ICsgYW1vdW50O1xuXG4gICAgaWYgKG5ld1F1YW50aXR5IDwgMCkge1xuICAgICAgJGNvbnRyb2xzLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChuZXdRdWFudGl0eSA+IG1heFF1YW50aXR5KSB7XG4gICAgICBhbGVydChg0JzQsNC60YHQuNC80LDQu9GM0L3QsCDQutGW0LvRjNC60ZbRgdGC0Ywg0YLQvtCy0LDRgNGDOiAke21heFF1YW50aXR5fWApO1xuICAgICAgJGNvbnRyb2xzLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gwqviiJLCuyDQv9GA0Lgg0LrRltC70YzQutC+0YHRgtGWIDEg0YHRgtCw0ZQg0LrQvtGI0LjQutC+0LwgKNGWINC/0YDQuNCx0LjRgNCw0ZQg0L/QvtC30LjRhtGW0Y4pXG4gICAgYnV0dG9uLmNsb3Nlc3QoJy5jaGVja291dC1wcm9kdWN0LXRvcC1pbmZvLWxlZnQtcXVhbnRpdHknKS50b2dnbGVDbGFzcygnaXMtc2luZ2xlJywgbmV3UXVhbnRpdHkgPT09IDEpO1xuXG4gICAgLy8gVUkgdXBkYXRlXG4gICAgaWYgKHF1YW50aXR5RWxlbWVudC5pcygnaW5wdXQnKSkge1xuICAgICAgcXVhbnRpdHlFbGVtZW50LnByb3AoJ3JlYWRvbmx5JywgZmFsc2UpLnZhbChuZXdRdWFudGl0eSkucHJvcCgncmVhZG9ubHknLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcXVhbnRpdHlFbGVtZW50LnRleHQobmV3UXVhbnRpdHkpO1xuICAgIH1cblxuICAgIGNvbnN0ICRyZWFkb25seUlucHV0ID0gJCgnI3JlYWRvbmx5SW5wdXQnKTtcbiAgICBpZiAoJHJlYWRvbmx5SW5wdXQubGVuZ3RoKSB7XG4gICAgICB1cGRhdGVJbnB1dChuZXdRdWFudGl0eSk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJvZHVjdCA9IGJ1dHRvbi5kYXRhKCdpZCcpO1xuXG4gICAgaWYgKG5ld1F1YW50aXR5ID4gMCkge1xuICAgICAgLy8g0JfQsNC/0LjRgiDQvtC00LjQvSDRliDQv9C+0LLQtdGA0YLQsNGUINCz0L7RgtC+0LLQuNC5INC/0ZbQtNGB0YPQvNC+0Lo7INC60ZbQu9GM0LrRltGB0YLRjCDRgyDRgNGP0LTQutGDINCy0LbQtSDQvtC90L7QstC70LXQvdC+LCDQu9C+0LDQtNC10YDQsCDQvdCwINCy0LXRgdGMINC60L7RiNC40Log0L3QtdC80LDRlFxuICAgICAgJCgnLm5vdGlmaWNhdGlvbi1ib3gnKS5yZW1vdmVDbGFzcygnaXMtc2hvdycpO1xuXG4gICAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6ICcvYXBpL2NhcnQvdXBkYXRlLXF1YW50aXR5JyxcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcHJvZHVjdElkOiBwcm9kdWN0LFxuICAgICAgICAgIHF1YW50aXR5OiBuZXdRdWFudGl0eSxcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgIC8vINCS0ZbQtNC/0L7QstGW0LTRjCDRg9C20LUg0LzRltGB0YLQuNGC0Ywg0LPQvtGC0L7QstC40LkgSFRNTCDQv9GW0LTRgdGD0LzQutGDOyDQt9Cw0L/QsNGB0L3QuNC5INCy0LDRgNGW0LDQvdGCIOKAlFxuICAgICAgICAgIC8vINGB0YLQsNGA0LjQuSDQvtC60YDQtdC80LjQuSDQt9Cw0L/QuNGCLCDRj9C60YnQviDRgdC10YDQstC10YAg0LnQvtCz0L4g0YfQvtC80YPRgdGMINC90LUg0LLRltC00LTQsNCyXG4gICAgICAgICAgaWYgKCFyZW5kZXJDYXJ0U3VtbWFyeShyZXNwb25zZSkpIHtcbiAgICAgICAgICAgIHVwZGF0ZUNhcnREaXNwbGF5KHsgc2lsZW50OiB0cnVlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkKGBkaXYuZXJyb3JbZGF0YS1pZD1cIiR7cHJvZHVjdH1cIl1gKS5oaWRlKCk7XG4gICAgICAgICAgJCgnLmNoZWNrb3V0LWZvcm0tc3VibWl0JykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgICAgICAgIC8vIOKchSBGaXJlIEdBIGFkZFRvQ2FydCBvbiBzdWNjZXNzIChvbmx5IG9uIGFkZClcbiAgICAgICAgICBpZiAoYW1vdW50ID4gMCkge1xuICAgICAgICAgICAgY29uc3QgcHJvZHVjdE5hbWUgPSBidXR0b24uYXR0cignZGF0YS1wcm9kdWN0LW5hbWUnKTtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1JZCAgICAgID0gYnV0dG9uLmF0dHIoJ2RhdGEtdmFyaWFudC1pZCcpO1xuICAgICAgICAgICAgY29uc3QgcHJpY2VSYXcgICAgPSBidXR0b24uYXR0cignZGF0YS1wcmljZScpO1xuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnkgICAgPSBidXR0b24uYXR0cignZGF0YS10YXhvbicpO1xuICAgICAgICAgICAgY29uc3QgdmFyaWFudE5hbWUgPSBidXR0b24uYXR0cignZGF0YS12YXJpYW50LW5hbWUnKTtcbiAgICAgICAgICAgIGNvbnN0IGJyYW5kICAgICAgID0gYnV0dG9uLmF0dHIoJ2RhdGEtYnJhbmQnKTtcbiAgICAgICAgICAgIGNvbnN0IHByaWNlID0gcGFyc2VGbG9hdChwcmljZVJhdy5yZXBsYWNlKC9cXHN84oK0L2csICcnKS5yZXBsYWNlKCcsJywgJy4nKSk7XG5cbiAgICAgICAgICAgIGdvb2dsZUFkZFRvQ2FydChwcm9kdWN0TmFtZSwgaXRlbUlkLCBwcmljZSwgY2F0ZWdvcnksIHZhcmlhbnROYW1lLCBicmFuZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcihyZXNwb25zZSkge1xuICAgICAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9IEpTT04ucGFyc2UocmVzcG9uc2UucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAkKGBkaXYuZXJyb3JbZGF0YS1pZD1cIiR7cHJvZHVjdH1cIl1gKS50ZXh0KHJlc3BvbnNlRGF0YS5lcnJvcik7XG4gICAgICAgICAgJGNvbnRyb2xzLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICQoJy5zaWRlYmFyLWlubmVyJykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICAgICAgICAkKCcuY2hlY2tvdXQtd3JhcHBlci1yaWdodCcpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmlybUFuZFJlbW92ZShidXR0b24sIGZhbHNlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZUlucHV0KHZhbHVlLCAkZWxlbWVudCkge1xuICAgIGlmICgkZWxlbWVudCAmJiAkZWxlbWVudC5pcygnaW5wdXQnKSkge1xuICAgICAgJGVsZW1lbnQudmFsKHZhbHVlKTtcbiAgICAgICRlbGVtZW50LmNzcygnd2lkdGgnLCBgJHsoJGVsZW1lbnQudmFsKCkubGVuZ3RoIHx8IDEpfWNoYCk7IC8vIE1pbmltdW0gMSBjaGFyYWN0ZXJcbiAgICB9IGVsc2UgaWYgKCRlbGVtZW50KSB7XG4gICAgICAkZWxlbWVudC50ZXh0KHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjb25maXJtQW5kUmVtb3ZlKGJ1dHRvbiwgaXNEaXJlY3REZWxldGUpIHtcbiAgICBjb25zdCBpdGVtV3JhcHBlciA9IGJ1dHRvbi5jbG9zZXN0KCcuY2hlY2tvdXQtcHJvZHVjdC10b3AtaXRlbS13cmFwcGVyJyk7XG4gICAgY29uc3QgcXVhbnRpdHlFbGVtZW50ID0gaXRlbVdyYXBwZXIuZmluZCgnLmNoZWNrb3V0LXByb2R1Y3QtdG9wLWluZm8tbGVmdC1xdWFudGl0eS10ZXh0Jyk7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiBgLyR7YnV0dG9uLmRhdGEoJ2lkJyl9L3JlbW92ZWAsXG4gICAgICB0eXBlOiAnREVMRVRFJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgX2NzcmZfdG9rZW46IGJ1dHRvbi5kYXRhKCdjc3JmJyksXG4gICAgICB9LFxuICAgICAgc3VjY2VzcygpIHtcbiAgICAgICAgdXBkYXRlQ2FydERpc3BsYXkoKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcihyZXNwb25zZSkge1xuICAgICAgICB1cGRhdGVDYXJ0RGlzcGxheSgpO1xuICAgICAgICBjb25zdCByZXNwb25zZURhdGEgPSBKU09OLnBhcnNlKHJlc3BvbnNlLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlRGF0YSk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLy8gU2hvcHBpbmcgY2FydCBjbGljayBoYW5kbGVyXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljaycsICcuc2hvcHBpbmctY2FydCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHdhaXRGb3JFbGVtZW50cygnLmNoZWNrb3V0LXByb2R1Y3QtdG9wLWluZm8tbGVmdC1xdWFudGl0eS10ZXh0JywgZnVuY3Rpb24gKCRpbnB1dHMpIHtcbiAgICAgICAgJGlucHV0cy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9ICQodGhpcylcbiAgICAgICAgICAgIC52YWwoKSB8fCAkKHRoaXMpXG4gICAgICAgICAgICAudGV4dCgpO1xuICAgICAgICAgIHVwZGF0ZUlucHV0KHZhbHVlLCAkKHRoaXMpKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAvLyBTaG9wcGluZyBjYXJ0IHNpZGViYXIgdG9nZ2xlXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljaycsICcuc2hvcHBpbmctY2FydCwub3Blbi1jYXJ0JywgZnVuY3Rpb24gKCkge1xuICAgICAgLy8g0JrQvdC+0L/QutCwINCyINGI0LDQv9GG0ZYg0LvQtdC20LjRgtGMINGD0YHQtdGA0LXQtNC40L3RliAubWVudSDQv9C+0YDRg9GHINC30ZYg0YHQstC+0ZfQvCDRgdCw0LnQtNCx0LDRgNC+0LwsINCwXG4gICAgICAvLyDQvdC40LbQvdGUINC80L7QsdGW0LvRjNC90LUg0LzQtdC90Y4g4oCUINC90ZYsINGC0L7QvNGDINC00LvRjyDQvdGM0L7Qs9C+INCx0LXRgNC10LzQviDRgdCw0LnQtNCx0LDRgCDQutC+0YjQuNC60LAg0Lcg0LzQtdC90Y4uXG4gICAgICBjb25zdCAkaW5NZW51ID0gJCh0aGlzKVxuICAgICAgICAuY2xvc2VzdCgnLm1lbnUnKVxuICAgICAgICAuZmluZCgnLnNpZGViYXInKTtcbiAgICAgIGNvbnN0ICRjbG9zZXN0U2lkZWJhciA9ICRpbk1lbnUubGVuZ3RoID8gJGluTWVudSA6ICQoJy5tZW51IC5zaWRlYmFyJykuZmlyc3QoKTtcblxuICAgICAgaWYgKCRjbG9zZXN0U2lkZWJhci5sZW5ndGgpIHtcbiAgICAgICAgJCgnLnNpZGViYXInKVxuICAgICAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7IC8vIENsb3NlIGFsbCBvdGhlciBzaWRlYmFyc1xuICAgICAgICAkY2xvc2VzdFNpZGViYXIuYWRkQ2xhc3MoJ2FjdGl2ZScpOyAvLyBPcGVuIHRoZSBjbG9zZXN0IG9uZVxuICAgICAgICAkKCdib2R5JylcbiAgICAgICAgICAuYWRkQ2xhc3MoJ292ZXJmbG93Jyk7XG4gICAgICAgIHVwZGF0ZUNhcnREaXNwbGF5KCk7IC8vIFVwZGF0ZSBjYXJ0XG4gICAgICB9XG4gICAgfSk7XG5cbiAgLy8gQ2xvc2UgbmVhcmVzdCBzaWRlYmFyIHdoZW4gY2xpY2tpbmcgb24gY2xvc2UgYnV0dG9uXG4gICQoJy5zaWRlYmFyLWNvbnRlbnQtdG9wLWNsb3NlJylcbiAgICAuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgJCh0aGlzKVxuICAgICAgICAuY2xvc2VzdCgnLnNpZGViYXInKVxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgJCgnYm9keScpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnb3ZlcmZsb3cnKTtcbiAgICB9KTtcblxuICAkKCcuc2lkZWJhcicpXG4gICAgLmNsaWNrKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYgKCQoZXZlbnQudGFyZ2V0KVxuICAgICAgICAuY2xvc2VzdCgnLnNpZGViYXItY29udGVudC10b3AtY2xvc2UnKS5sZW5ndGggfHwgZXZlbnQudGFyZ2V0ID09PSB0aGlzKSB7XG4gICAgICAgICQodGhpcylcbiAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAkKCdib2R5JylcbiAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ292ZXJmbG93Jyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIHdhaXQgZm9yIGVsZW1lbnRzIHRvIGJlIGF2YWlsYWJsZVxuICBmdW5jdGlvbiB3YWl0Rm9yRWxlbWVudHMoc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgY2hlY2tFeGlzdCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0ICRlbGVtZW50cyA9ICQoc2VsZWN0b3IpO1xuICAgICAgaWYgKCRlbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChjaGVja0V4aXN0KTtcbiAgICAgICAgY2FsbGJhY2soJGVsZW1lbnRzKTtcbiAgICAgIH1cbiAgICB9LCA1MCk7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwoY2hlY2tFeGlzdCk7XG4gICAgfSwgNTAwMCk7XG4gIH1cblxuICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgJy5zYW1wbGUtY2hlY2tib3gnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgJGNiID0gJCh0aGlzKTtcblxuICAgIC8vIElmIGFueSBzYW1wbGUgaXMgY2hlY2tlZCDigJQgYXV0by11bmNoZWNrIHJlZnVzZSBjaGVja2JveFxuICAgIGlmICgkY2IuaXMoJzpjaGVja2VkJykpIHtcbiAgICAgIGNvbnN0ICRicmFuZCAgICAgICAgICA9ICRjYi5jbG9zZXN0KCcuc2FtcGxlLXNpZGViYXItYnJhbmQnKTtcbiAgICAgIGNvbnN0ICRyZWZ1c2VDaGVja2JveCA9ICRicmFuZC5maW5kKCcuc2FtcGxlLXJlZnVzZS1jaGVja2JveCcpO1xuICAgICAgaWYgKCRyZWZ1c2VDaGVja2JveC5pcygnOmNoZWNrZWQnKSkge1xuICAgICAgICAkcmVmdXNlQ2hlY2tib3gucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgYXBwbHlTYW1wbGVSZWZ1c2VTdGF0ZSgkYnJhbmQuZmluZCgnLnNhbXBsZS1jaGVja2JveCcpLCAkcmVmdXNlQ2hlY2tib3gpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBlcnJvciBzdGF0ZSBvbiBpbnRlcmFjdGlvblxuICAgICRjYi5yZW1vdmVDbGFzcygnZXJyb3InKTtcblxuICAgIGNvbnN0IHZhcmlhbnRJZCAgID0gJGNiLmRhdGEoJ2lkJyk7XG4gICAgY29uc3QgY3NyZlRva2VuICAgPSAkY2IuZGF0YSgnY3NyZicpO1xuICAgIGNvbnN0IGlzQ2hlY2tlZCAgID0gJGNiLmlzKCc6Y2hlY2tlZCcpO1xuICAgIGNvbnN0IHVybCAgICAgICAgID0gaXNDaGVja2VkID8gJy9jYXJ0L2FkZC1vbmUnIDogJy9jYXJ0L3JlbW92ZS1vbmUnO1xuXG4gICAgLy8gR0EgZGF0YSBhdHRyaWJ1dGVzXG4gICAgY29uc3QgcHJvZHVjdE5hbWUgPSAkY2IuZGF0YSgncHJvZHVjdC1uYW1lJyk7XG4gICAgY29uc3QgaXRlbUlkICAgICAgPSAkY2IuZGF0YSgndmFyaWFudC1pZCcpO1xuICAgIGNvbnN0IHByaWNlICAgICAgID0gcGFyc2VGbG9hdCgkY2IuZGF0YSgncHJpY2UnKSk7XG4gICAgY29uc3QgY2F0ZWdvcnkgICAgPSAkY2IuZGF0YSgndGF4b24nKTtcbiAgICBjb25zdCB2YXJpYW50TmFtZSA9ICRjYi5kYXRhKCd2YXJpYW50LW5hbWUnKTtcbiAgICBjb25zdCBicmFuZCAgICAgICA9ICRjYi5kYXRhKCdicmFuZCcpO1xuXG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHZhcmlhbnRJZDogdmFyaWFudElkLFxuICAgICAgICBjc3JmVG9rZW46IGNzcmZUb2tlblxuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgLy8gdXBkYXRlIGNvdW50ZXJzIGFuZCBIVE1MXG4gICAgICAgIHVwZGF0ZUNvdW50Q3VydChyZXNwb25zZS5jb3VudCk7XG4gICAgICAgIHBhaW50Q2FydChyZXNwb25zZS5odG1sKTtcblxuICAgICAgICAvLyDinIUgRmlyZSBHQSBhZGRfdG9fY2FydCBldmVudCBvbmx5IGlmIGNoZWNrZWRcbiAgICAgICAgaWYgKGlzQ2hlY2tlZCkge1xuICAgICAgICAgIGdvb2dsZUFkZFRvQ2FydChwcm9kdWN0TmFtZSwgaXRlbUlkLCBwcmljZSwgY2F0ZWdvcnksIHZhcmlhbnROYW1lLCBicmFuZCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBlcnJvcih4aHIpIHtcbiAgICAgICAgY29uc3QgZXJyID0geGhyLnJlc3BvbnNlSlNPTj8uZXJyb3IgfHwgJ9Cf0L7QvNC40LvQutCwINC+0L3QvtCy0LvQtdC90L3RjyDQutC+0YjQuNC60LAuJztcbiAgICAgICAgYWxlcnQoZXJyKTtcbiAgICAgICAgJGNiLnByb3AoJ2NoZWNrZWQnLCAhaXNDaGVja2VkKTsgLy8gcm9sbGJhY2sgc3RhdGVcbiAgICAgIH0sXG4gICAgICBjb21wbGV0ZSgpIHtcbiAgICAgICAgJCgnLnNpZGViYXItaW5uZXIsIC5jaGVja291dC13cmFwcGVyLXJpZ2h0JykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gU2FtcGxlIHJlZnVzZSBjaGVja2JveCBsb2dpY1xuICAvLyAtIENoZWNraW5nIFwicmVmdXNlXCIgZGlzYWJsZXMgYWxsIHNhbXBsZS1jaGVja2JveCBpbnB1dHNcbiAgLy8gLSBVbmNoZWNraW5nIFwicmVmdXNlXCIgcmUtZW5hYmxlcyB0aGVtXG4gIC8vIC0gQ2hlY2tpbmcgYW55IHNhbXBsZS1jaGVja2JveCBhdXRvLXVuY2hlY2tzIGFuZCBkaXNhYmxlcyByZWZ1c2VcbiAgLy8gQ2FsbGVkIG9uIGluaXQgYW5kIGFmdGVyIGV2ZXJ5IHVwZGF0ZUNhcnREaXNwbGF5XG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGZ1bmN0aW9uIGluaXRTYW1wbGVSZWZ1c2UoKSB7XG4gICAgY29uc3QgJGJyYW5kID0gJCgnLnNhbXBsZS1zaWRlYmFyLWJyYW5kJyk7XG4gICAgaWYgKCEkYnJhbmQubGVuZ3RoKSByZXR1cm47XG5cbiAgICBjb25zdCAkc2FtcGxlQ2hlY2tib3hlcyA9ICRicmFuZC5maW5kKCcuc2FtcGxlLWNoZWNrYm94Jyk7XG4gICAgY29uc3QgJHJlZnVzZUNoZWNrYm94ICAgPSAkYnJhbmQuZmluZCgnLnNhbXBsZS1yZWZ1c2UtY2hlY2tib3gnKTtcblxuICAgIGlmICghJHJlZnVzZUNoZWNrYm94Lmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgaWYgKCRyZWZ1c2VDaGVja2JveC5pcygnOmNoZWNrZWQnKSkge1xuICAgICAgLy8gUmVmdXNlIGlzIGFscmVhZHkgY2hlY2tlZCAocmVuZGVyZWQgZnJvbSBzZXJ2ZXIpIOKAlFxuICAgICAgLy8ganVzdCBkaXNhYmxlIHNhbXBsZSBjaGVja2JveGVzIFdJVEhPVVQgdG91Y2hpbmcgdGhlaXIgY2hlY2tlZCBzdGF0ZVxuICAgICAgLy8gVGhlIHNlcnZlciBhbHJlYWR5IHJlbmRlcmVkIHRoZW0gY29ycmVjdGx5IChjaGVja2VkID0gaW4gY2FydCwgZGlzYWJsZWQgPSByZWZ1c2UgYWN0aXZlKVxuICAgICAgJHNhbXBsZUNoZWNrYm94ZXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuc2FtcGxlLWNhcmQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZWZ1c2Ugbm90IGNoZWNrZWQg4oCUIGVuc3VyZSBzYW1wbGUgY2hlY2tib3hlcyBhcmUgZW5hYmxlZFxuICAgICAgJHNhbXBsZUNoZWNrYm94ZXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICAgICQodGhpcykuY2xvc2VzdCgnLnNhbXBsZS1jYXJkJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhcHBseVNhbXBsZVJlZnVzZVN0YXRlKCRzYW1wbGVDaGVja2JveGVzLCAkcmVmdXNlQ2hlY2tib3gpIHtcbiAgICBpZiAoJHJlZnVzZUNoZWNrYm94LmlzKCc6Y2hlY2tlZCcpKSB7XG4gICAgICAvLyBSZWZ1c2UgaXMgY2hlY2tlZCDigJQgc2F2ZSBlYWNoIGNoZWNrYm94IHN0YXRlIHRvIHNlc3Npb25TdG9yYWdlLFxuICAgICAgLy8gdGhlbiBkaXNhYmxlIFdJVEhPVVQgdW5jaGVja2luZyAodmlzdWFsIHN0YXRlIHByZXNlcnZlZClcbiAgICAgICRzYW1wbGVDaGVja2JveGVzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCAkY2IgPSAkKHRoaXMpO1xuICAgICAgICBjb25zdCBrZXkgPSAnc2FtcGxlLXdhcy1jaGVja2VkLScgKyAkY2IuYXR0cignaWQnKTtcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrZXksICRjYi5pcygnOmNoZWNrZWQnKSA/ICcxJyA6ICcwJyk7XG4gICAgICAgICRjYi5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAkY2IuY2xvc2VzdCgnLnNhbXBsZS1jYXJkJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmVmdXNlIGlzIHVuY2hlY2tlZCDigJQgcmUtZW5hYmxlIGFuZCByZXN0b3JlIHByZXZpb3VzbHkgc2VsZWN0ZWQgc3RhdGVcbiAgICAgICRzYW1wbGVDaGVja2JveGVzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCAkY2IgICAgICAgID0gJCh0aGlzKTtcbiAgICAgICAgY29uc3Qga2V5ICAgICAgICA9ICdzYW1wbGUtd2FzLWNoZWNrZWQtJyArICRjYi5hdHRyKCdpZCcpO1xuICAgICAgICBjb25zdCB3YXNDaGVja2VkID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShrZXkpID09PSAnMSc7XG4gICAgICAgICRjYi5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgaWYgKHdhc0NoZWNrZWQpIHtcbiAgICAgICAgICAkY2IucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgICRjYi5jbG9zZXN0KCcuc2FtcGxlLWNhcmQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gV2hlbiByZWZ1c2UgY2hlY2tib3ggY2hhbmdlcyDigJQgcGVyc2lzdCB0byBzZXJ2ZXIgYW5kIHVwZGF0ZSBVSVxuICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgJy5zYW1wbGUtcmVmdXNlLWNoZWNrYm94JywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0ICRyZWZ1c2VDaGVja2JveCAgID0gJCh0aGlzKTtcbiAgICBjb25zdCAkYnJhbmQgICAgICAgICAgICA9ICRyZWZ1c2VDaGVja2JveC5jbG9zZXN0KCcuc2FtcGxlLXNpZGViYXItYnJhbmQnKTtcbiAgICBjb25zdCAkc2FtcGxlQ2hlY2tib3hlcyA9ICRicmFuZC5maW5kKCcuc2FtcGxlLWNoZWNrYm94Jyk7XG4gICAgY29uc3QgaXNSZWZ1c2VkICAgICAgICAgPSAkcmVmdXNlQ2hlY2tib3guaXMoJzpjaGVja2VkJyk7XG5cbiAgICAvLyBSZW1vdmUgZXJyb3Igc3RhdGVcbiAgICAkcmVmdXNlQ2hlY2tib3gucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XG4gICAgJHNhbXBsZUNoZWNrYm94ZXMucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XG5cbiAgICAvLyBBcHBseSBVSSBpbW1lZGlhdGVseVxuICAgIGFwcGx5U2FtcGxlUmVmdXNlU3RhdGUoJHNhbXBsZUNoZWNrYm94ZXMsICRyZWZ1c2VDaGVja2JveCk7XG5cbiAgICAvLyBQZXJzaXN0IGNob2ljZSBpbiBzZXNzaW9uIHZpYSBzZXJ2ZXJcbiAgICByZXNldEdpZnROdWRnZSgpO1xuICAgIHN5bmNHaWZ0Q3RhKCk7XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogICAgJy9hcGkvY2FydC9yZWZ1c2Utc2FtcGxlcycsXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGRhdGE6ICAgeyByZWZ1c2U6IGlzUmVmdXNlZCA/ICcxJyA6ICcwJyB9LFxuICAgICAgZXJyb3IoKSB7XG4gICAgICAgIC8vIFJvbGxiYWNrIFVJIG9uIGZhaWx1cmVcbiAgICAgICAgJHJlZnVzZUNoZWNrYm94LnByb3AoJ2NoZWNrZWQnLCAhaXNSZWZ1c2VkKTtcbiAgICAgICAgYXBwbHlTYW1wbGVSZWZ1c2VTdGF0ZSgkc2FtcGxlQ2hlY2tib3hlcywgJHJlZnVzZUNoZWNrYm94KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cblxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyDQn9C+0LTQsNGA0YPQvdC60Lgt0YHQtdC80L/Qu9C4OiDQvdCw0LPQsNC00YPRlNC80L4sINCw0LvQtSDQvdC1INGC0YDQuNC80LDRlNC80L4g0LIg0LrQvtGI0LjQutGDINGB0LjQu9C+0Y4uXG4gIC8vINCf0LXRgNGI0LjQuSDQutC70ZbQuiDQv9C+IMKr0JfQsNC80L7QstC40YLQuMK7INCx0LXQtyDQvtCx0YDQsNC90L7Qs9C+INC/0L7QtNCw0YDRg9C90LrQsCDQstC10LTQtSDQtNC+INCy0LjQsdC+0YDRgyDQuSDQvNGW0L3Rj9GUXG4gIC8vINC/0ZbQtNC/0LjRgSDQutC90L7Qv9C60Lgg0L3QsCDCq9CR0LXQtyDQv9C+0LTQsNGA0YPQvdC60ZbQssK7OyDQtNGA0YPQs9C40Lkg4oCUINC/0YDQvtC/0YPRgdC60LDRlCDQvdCwINC+0YTQvtGA0LzQu9C10L3QvdGPLlxuICAvLyDQm9GW0YfQuNC70YzQvdC40Log0LbQuNCy0LUg0LIg0LzQtdC20LDRhSDRgdC10YHRltGXOiDQu9GO0LTQuNC90LAsINGP0LrQsCDQstC20LUg0LLRltC00LzQsNGF0L3Rg9C70LDRgdGMLCDQvdC1INC/0YDQvtGF0L7QtNC40YLRjFxuICAvLyDRhtC1INC60L7Qu9C+INCy0LTRgNGD0LPQtS4g0J/RltC00L/QuNGBINC60L3QvtC/0LrQuCDQv9C10YDQtdC80LDQu9GM0L7QstGD0ZTRgtGM0YHRjyDRgNCw0LfQvtC8INGW0Lcg0LrQvtGI0LjQutC+0LwuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBjb25zdCBHSUZUX05VREdFX0tFWSA9ICdnaWZ0TnVkZ2VDb3VudCc7XG4gIGNvbnN0IEdJRlRfTlVER0VfTElNSVQgPSAyO1xuXG4gIGZ1bmN0aW9uIGdpZnROdWRnZUNvdW50KCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gcGFyc2VJbnQoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShHSUZUX05VREdFX0tFWSksIDEwKSB8fCAwO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRHaWZ0TnVkZ2UoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oR0lGVF9OVURHRV9LRVkpO1xuICAgIH0gY2F0Y2ggKGVycikgeyAvKiDQv9GA0LjQstCw0YLQvdC40Lkg0YDQtdC20LjQvCAqLyB9XG4gIH1cblxuICBmdW5jdGlvbiBidW1wR2lmdE51ZGdlKCkge1xuICAgIGNvbnN0IG5leHQgPSBnaWZ0TnVkZ2VDb3VudCgpICsgMTtcbiAgICB0cnkge1xuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShHSUZUX05VREdFX0tFWSwgU3RyaW5nKG5leHQpKTtcbiAgICB9IGNhdGNoIChlcnIpIHsgLyog0L/RgNC40LLQsNGC0L3QuNC5INGA0LXQttC40Lwg4oCUINC/0YDQvtGB0YLQviDQvdC1INC30LDQv9Cw0Lwn0Y/RgtCw0ZTQvNC+ICovIH1cblxuICAgIHJldHVybiBuZXh0O1xuICB9XG5cbiAgLy8g0KnQtSDRlCDQv9C+0LTQsNGA0YPQvdC60LgsINGP0LrRliDQu9GO0LTQuNC90LAg0LzQvtCz0LvQsCDQsSDQvtCx0YDQsNGC0LgsINGWINCy0L7QvdCwINCy0ZbQtCDQvdC40YUg0L3QtSDQstGW0LTQvNC+0LLQuNC70LDRgdGMLlxuICAvLyDQmtCy0L7RgtGDINGA0LDRhdGD0ZQg0YHQtdGA0LLQtdGAOiDQutC+0LvQuCDQvdCw0LHQvtGA0Lgg0LLQuNGH0LXRgNC/0LDQvdC+LCDRgNC10YjRgtGDINGH0LXQutCx0L7QutGB0ZbQsiDQstGW0L0g0LLRltC00LTQsNGUXG4gIC8vIGRpc2FibGVkLCDRgtC+0LzRgyDCq9GD0YHQtSDQvtCx0YDQsNC90L4g0LDQsdC+INCy0LjQvNC60L3QtdC90L7CuyDRliDQvtC30L3QsNGH0LDRlCDCq9C70ZbQvNGW0YIg0LLQuNC60L7RgNC40YHRgtCw0L3QvsK7LlxuICBmdW5jdGlvbiBnaWZ0c1BlbmRpbmcoKSB7XG4gICAgY29uc3QgJGJyYW5kID0gJCgnLnNhbXBsZS1zaWRlYmFyLWJyYW5kJykuZmlyc3QoKTtcbiAgICBpZiAoISRicmFuZC5sZW5ndGgpIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0ICRzYW1wbGVDaGVja2JveGVzID0gJGJyYW5kLmZpbmQoJy5zYW1wbGUtY2hlY2tib3gnKTtcbiAgICBpZiAoISRzYW1wbGVDaGVja2JveGVzLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICgkYnJhbmQuZmluZCgnLnNhbXBsZS1yZWZ1c2UtY2hlY2tib3gnKS5pcygnOmNoZWNrZWQnKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuICEkc2FtcGxlQ2hlY2tib3hlcy50b0FycmF5KCkuZXZlcnkoZnVuY3Rpb24gKGNiKSB7XG4gICAgICByZXR1cm4gJChjYikuaXMoJzpjaGVja2VkJykgfHwgJChjYikuaXMoJzpkaXNhYmxlZCcpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc3luY0dpZnRDdGEoKSB7XG4gICAgY29uc3QgcGVuZGluZyA9IGdpZnRzUGVuZGluZygpO1xuICAgIGlmICghcGVuZGluZykgcmVzZXRHaWZ0TnVkZ2UoKTtcblxuICAgIGNvbnN0IHNraXAgPSBwZW5kaW5nICYmIGdpZnROdWRnZUNvdW50KCkgPiAwO1xuICAgIC8vINC70LjRiNC1INC60L3QvtC/0LrQsCDQutC+0YjQuNC60LA6INC90LAg0YHRgtC+0YDRltC90YbRliDQvtGE0L7RgNC80LvQtdC90L3RjyDRlCDRidC1IHN1Ym1pdCDRhNC+0YDQvNC4INC3INGC0LjQvCDRgdCw0LzQuNC8INC60LvQsNGB0L7QvFxuICAgICQoJy5jYXJ0X19jaGVja291dCAuY2hlY2tvdXQtZm9ybS1zdWJtaXQnKVxuICAgICAgLnRvZ2dsZUNsYXNzKCdpcy1za2lwLWdpZnRzJywgc2tpcClcbiAgICAgIC5maW5kKCcuY2hlY2tvdXQtZm9ybS1zdWJtaXQtdGV4dCcpXG4gICAgICAudGV4dChza2lwID8gJ9CR0LXQtyDQv9C+0LTQsNGA0YPQvdC60ZbQsicgOiAn0JfQsNC80L7QstC40YLQuCcpO1xuICB9XG5cbiAgLy8g0KHQsNC50LTQsdCw0YAg0LrQvtGI0LjQutCwINC/0YDQvtC60YDRg9GH0YPRlNGC0YzRgdGPINCy0YHQtdGA0LXQtNC40L3RliDRgdC10LHQtSwg0YHRgtC+0YDRltC90LrQsCDQvtGE0L7RgNC80LvQtdC90L3RjyDigJQg0LLRltC60L3QvtC8XG4gIGZ1bmN0aW9uIHNjcm9sbFRvR2lmdHMoKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gJCgnLnNhbXBsZS1zaWRlYmFyJykuZ2V0KDApO1xuICAgIGlmICghdGFyZ2V0KSByZXR1cm47XG5cbiAgICAvLyDQndCwINC00LXRgdC60YLQvtC/0ZYg0L/QvtC00LDRgNGD0L3QutC4IOKAlCDQstC70LDRgdC90LAg0YTRltC60YHQvtCy0LDQvdCwINC60L7Qu9C+0L3QutCwINC90LAg0LLQtdGB0Ywg0LXQutGA0LDQvTog0LLQvtC90LBcbiAgICAvLyDRliDRgtCw0Log0L/QtdGA0LXQtCDQvtGH0LjQvNCwLCDQv9GA0L7QutGA0YPRh9GD0LLQsNGC0Lgg0L3RltGH0L7Qs9C+INC90LUg0YLRgNC10LHQsFxuICAgIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0YXJnZXQpLnBvc2l0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8g0L3QsNC50LHQu9C40LbRh9C40Lkg0L/RgNC10LTQvtC6LCDRj9C60LjQuSDRgdC/0YDQsNCy0LTRliDQvNCw0ZQg0LLQu9Cw0YHQvdC40Lkg0YHQutGA0L7Qu1xuICAgIGxldCBib3ggPSB0YXJnZXQucGFyZW50RWxlbWVudDtcbiAgICB3aGlsZSAoYm94ICYmIGJveCAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShib3gpO1xuICAgICAgaWYgKC8oYXV0b3xzY3JvbGwpLy50ZXN0KHN0eWxlLm92ZXJmbG93WSkgJiYgYm94LnNjcm9sbEhlaWdodCA+IGJveC5jbGllbnRIZWlnaHQpIGJyZWFrO1xuICAgICAgYm94ID0gYm94LnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuXG4gICAgY29uc3Qgc2Nyb2xscyA9IGJveCAmJiBib3ggIT09IGRvY3VtZW50LmJvZHk7XG4gICAgY29uc3Qgdmlld1RvcCA9IHNjcm9sbHMgPyBib3guZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIDogMDtcbiAgICBjb25zdCB2aWV3Qm90dG9tID0gc2Nyb2xscyA/IGJveC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20gOiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgY29uc3QgdGFyZ2V0VG9wID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcblxuICAgIC8vINCf0LDQvdC10LvRjCDRg9C20LUg0YMg0LLQtdGA0YXQvdGW0Lkg0L/QvtC70L7QstC40L3RliDQstC40LTQuNC80L7RlyDQvtCx0LvQsNGB0YLRliDigJQg0YHQvNC40LrQsNGC0Lgg0L3RltGH0L7Qs9C+INC90LUg0YLRgNC10LHQsFxuICAgIGlmICh0YXJnZXRUb3AgPj0gdmlld1RvcCAtIDEgJiYgdGFyZ2V0VG9wIDw9IHZpZXdUb3AgKyAodmlld0JvdHRvbSAtIHZpZXdUb3ApICogMC41KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFzY3JvbGxzKSB7XG4gICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogJCh0YXJnZXQpLm9mZnNldCgpLnRvcCAtIDIwIH0sIDQwMCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYm94LnNjcm9sbFRvKHsgdG9wOiBib3guc2Nyb2xsVG9wICsgdGFyZ2V0VG9wIC0gdmlld1RvcCAtIDEyLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG4gIH1cblxuICAvLyDCq9Ci0LjRhtGM0L3QuCDRgdGO0LTQuMK7OiDRgNGD0LrQsCDQtyByaXBwbGUg0L3QsNC0INC60LDRgNGC0LrQvtGOINC/0L7QtNCw0YDRg9C90LrQsCwg0L/QvtC60Lgg0LLQuNCx0ZbRgCDQvdC1INC30YDQvtCx0LvQtdC90L4gKNGP0Log0YMg0L/RgNC+0YLQvtGC0LjQv9GWKS5cbiAgLy8g0J/QvtC60LDQt9GD0ZTQvNC+INC90LDQtCDQv9C10YDRiNC+0Y4g0L/QvtCy0L3RltGB0YLRjiDQstC40LTQuNC80L7RjiDQutCw0YDRgtC60L7Rjiwg0L3QsNC50LrRgNCw0YnQtSDQtNGA0YPQs9C+0Y47INC30L3QuNC60LDRlCwg0YnQvtC50L3QviDRidC+0YHRjCDQvtCx0YDQsNC90L5cbiAgZnVuY3Rpb24gc2hvd0dpZnRIaW50KCkge1xuICAgIGNvbnN0ICR2aWV3cG9ydCA9ICQoJy5zYW1wbGUtdmlld3BvcnQnKS5maXJzdCgpO1xuICAgIGlmICghJHZpZXdwb3J0Lmxlbmd0aCB8fCAkdmlld3BvcnQuZmluZCgnLnRhcC1oaW50JykubGVuZ3RoKSByZXR1cm47XG5cbiAgICBjb25zdCB2cCA9ICR2aWV3cG9ydFswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjYXJkcyA9ICR2aWV3cG9ydC5maW5kKCcuc2FtcGxlLWNhcmQ6bm90KC5kaXNhYmxlZCknKS50b0FycmF5KCk7XG4gICAgY29uc3QgdmlzaWJsZSA9IGNhcmRzLmZpbHRlcihmdW5jdGlvbiAoY2FyZCkge1xuICAgICAgY29uc3QgciA9IGNhcmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICByZXR1cm4gci5sZWZ0ID49IHZwLmxlZnQgJiYgci5yaWdodCA8PSB2cC5yaWdodDtcbiAgICB9KTtcbiAgICBjb25zdCBjYXJkID0gdmlzaWJsZVsxXSB8fCB2aXNpYmxlWzBdIHx8IGNhcmRzWzBdO1xuICAgIGlmICghY2FyZCkgcmV0dXJuO1xuXG4gICAgY29uc3QgciA9IGNhcmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgJHZpZXdwb3J0LmFwcGVuZChcbiAgICAgICc8c3BhbiBjbGFzcz1cInRhcC1oaW50XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9XCItLXN0YXJ0OjcwMG1zO2xlZnQ6JyArIE1hdGgucm91bmQoci5sZWZ0IC0gdnAubGVmdCArIHIud2lkdGggKiAwLjQpXG4gICAgICArICdweDt0b3A6JyArIE1hdGgucm91bmQoci50b3AgLSB2cC50b3AgKyByLmhlaWdodCAqIDAuNjUpICsgJ3B4XCI+J1xuICAgICAgKyAnPHNwYW4gY2xhc3M9XCJ0YXAtaGludF9fcmlwcGxlc1wiPjxzcGFuIGNsYXNzPVwidGFwLWhpbnRfX3JpbmdcIiBzdHlsZT1cIi0taTowXCI+PC9zcGFuPjxzcGFuIGNsYXNzPVwidGFwLWhpbnRfX3JpbmdcIiBzdHlsZT1cIi0taToxXCI+PC9zcGFuPjxzcGFuIGNsYXNzPVwidGFwLWhpbnRfX3JpbmdcIiBzdHlsZT1cIi0taToyXCI+PC9zcGFuPjwvc3Bhbj4nXG4gICAgICArICc8c3BhbiBjbGFzcz1cInRhcC1oaW50X19oYW5kXCI+PHNwYW4gY2xhc3M9XCJ0YXAtaGludF9fZmluZ2VyXCI+PC9zcGFuPjwvc3Bhbj48L3NwYW4+J1xuICAgICk7XG4gIH1cblxuICAvLyDQodGC0YDRltC70LrQuCDRgdGC0YDRltGH0LrQuCDQv9C+0LTQsNGA0YPQvdC60ZbQsjog0L/QvtC60LDQt9GD0ZTQvNC+INGC0YMsINC60YPQtNC4INGJ0LUg0ZQg0YnQviDQs9C+0YDRgtCw0YLQuFxuICBmdW5jdGlvbiBzeW5jR2lmdEFycm93cygpIHtcbiAgICAkKCcuc2FtcGxlLXZpZXdwb3J0JykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCB0cmFjayA9ICQodGhpcykuZmluZCgnLnNhbXBsZS1jYXJkcycpLmdldCgwKTtcbiAgICAgIGlmICghdHJhY2spIHJldHVybjtcbiAgICAgIGNvbnN0IG1heCA9IHRyYWNrLnNjcm9sbFdpZHRoIC0gdHJhY2suY2xpZW50V2lkdGg7XG4gICAgICAkKHRoaXMpLmZpbmQoJy5zYW1wbGUtYXJyb3ctLXByZXYnKS50b2dnbGVDbGFzcygnaXMtc2hvd24nLCB0cmFjay5zY3JvbGxMZWZ0ID4gNCk7XG4gICAgICAkKHRoaXMpLmZpbmQoJy5zYW1wbGUtYXJyb3ctLW5leHQnKS50b2dnbGVDbGFzcygnaXMtc2hvd24nLCBtYXggPiA0ICYmIHRyYWNrLnNjcm9sbExlZnQgPCBtYXggLSA0KTtcbiAgICB9KTtcbiAgfVxuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuc2FtcGxlLWFycm93JywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHRyYWNrID0gJCh0aGlzKS5zaWJsaW5ncygnLnNhbXBsZS1jYXJkcycpLmdldCgwKTtcbiAgICBpZiAoIXRyYWNrKSByZXR1cm47XG4gICAgY29uc3QgZGlyID0gJCh0aGlzKS5oYXNDbGFzcygnc2FtcGxlLWFycm93LS1uZXh0JykgPyAxIDogLTE7XG4gICAgdHJhY2suc2Nyb2xsQnkoeyBsZWZ0OiBkaXIgKiBNYXRoLm1heCh0cmFjay5jbGllbnRXaWR0aCAtIDYwLCAxMzUpLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG4gIH0pO1xuXG4gIC8vIHNjcm9sbCDQvdC1INGB0L/Qu9C40LLQsNGUIOKAlCDQu9C+0LLQuNC80L4g0L3QsCDRhNCw0LfRliDQt9Cw0L3Rg9GA0LXQvdC90Y9cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoZS50YXJnZXQgJiYgZS50YXJnZXQuY2xhc3NMaXN0ICYmIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnc2FtcGxlLWNhcmRzJykpIHN5bmNHaWZ0QXJyb3dzKCk7XG4gIH0sIHRydWUpO1xuICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIHN5bmNHaWZ0QXJyb3dzKTtcbiAgJChkb2N1bWVudCkub24oJ2NhcnQ6cGFpbnRlZCcsIHN5bmNHaWZ0QXJyb3dzKTtcblxuICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnNhbXBsZS1jYXJkJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0ICRoaW50ID0gJCgnLnRhcC1oaW50JykuYWRkQ2xhc3MoJ2lzLWxlYXZpbmcnKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgJGhpbnQucmVtb3ZlKCk7IH0sIDE4MCk7XG5cbiAgICAvLyDQn9C+0LTQsNGA0YPQvdC60ZbQsiDQvNC+0LbQvdCwINC+0LHRgNCw0YLQuCDQutGW0LvRjNC60LAsINGWINC80Lgg0L3QtSDQt9C90LDRlNC80L4sINGH0Lgg0LvRjtC00LjQvdCwINC30YPQv9C40L3QuNGC0YzRgdGPOiDQv9GW0YHQu9GPINCx0YPQtNGMLdGP0LrQvtCz0L4g0LLQuNCx0L7RgNGDXG4gICAgLy8g0LrQvdC+0L/QutCwINC30L3QvtCy0YMgwqvQl9Cw0LzQvtCy0LjRgtC4wrssINCwINC90LUgwqvQkdC10Lcg0L/QvtC00LDRgNGD0L3QutGW0LLCuy4g0J3QsNCz0LDQtNGD0LLQsNC90L3RjyDRgdC/0YDQsNGG0Y7RlCDQv9GA0Lgg0L3QsNGB0YLRg9C/0L3QvtC80YMg0LrQu9GW0LrRgyDQv9C+INC90ZbQuVxuICAgIHJlc2V0R2lmdE51ZGdlKCk7XG4gICAgc3luY0dpZnRDdGEoKTtcbiAgfSk7XG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5jaGVja291dC1mb3JtLXN1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKCFnaWZ0c1BlbmRpbmcoKSkge1xuICAgICAgcmVzZXRHaWZ0TnVkZ2UoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBudWRnZSA9IGJ1bXBHaWZ0TnVkZ2UoKTtcblxuICAgIC8vINCd0LDQv9C+0LvRj9Cz0LvQuCDQtNC+0YHRgtCw0YLQvdGM0L4g4oCUINC00LDQu9GWINC90LUg0LfQsNCy0LDQttCw0ZTQvNC+XG4gICAgaWYgKG51ZGdlID49IEdJRlRfTlVER0VfTElNSVQpIHtcbiAgICAgIHJlc2V0R2lmdE51ZGdlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cbiAgICBzeW5jR2lmdEN0YSgpO1xuICAgIHNjcm9sbFRvR2lmdHMoKTtcbiAgICBzaG93R2lmdEhpbnQoKTtcbiAgfSk7XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vINCf0YDQvtC80L7QutC+0LQg0YMg0LrQvtGI0LjQutGDICjRiNGC0L7RgNC60LAg0Lkg0L/RgNCw0LLQsCDQutC+0LvQvtC90LrQsCDRh9C10LrQsNGD0YLRgyDigJQg0L7QtNC90LAg0YDQvtC30LzRltGC0LrQsClcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGZ1bmN0aW9uIGNvdXBvblJlcXVlc3QodXJsLCBkYXRhLCAkYnRuKSB7XG4gICAgY29uc3QgJGFyZWFzID0gJCgnLnNpZGViYXItaW5uZXIsIC5jaGVja291dC13cmFwcGVyLXJpZ2h0Jyk7XG4gICAgJGFyZWFzLmFkZENsYXNzKCdsb2FkaW5nJyk7XG4gICAgJGJ0bi5hZGRDbGFzcygnbG9hZGluZycpO1xuXG4gICAgcmV0dXJuICQuYWpheCh7XG4gICAgICB1cmwsXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGRhdGEsXG4gICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgIH0pLmFsd2F5cygoKSA9PiB7XG4gICAgICAkYXJlYXMucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICAgICRidG4ucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vINCS0ZbQtNC60YDQuNCy0LDRlC/Qt9Cw0LrRgNC40LLQsNGUINC/0L7Qu9C1INC/0YDQvtC80L7QutC+0LTRgzsg0L/RltGB0LvRjyDQstGW0LTQutGA0LjRgtGC0Y8g0YHRgtCw0LLQuNC80L4g0LIg0L3RjNC+0LPQviDQutGD0YDRgdC+0YBcbiAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5jaGVja291dC1wcm9kdWN0LXRvcC1leHRyYS1wcm9tby1tYWluJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0ICRoZWFkZXIgPSAkKHRoaXMpO1xuICAgIGNvbnN0ICRmb3JtID0gJGhlYWRlci5zaWJsaW5ncygnLmNoZWNrb3V0LXByb2R1Y3QtdG9wLWV4dHJhLXByb21vLWZvcm0nKTtcblxuICAgICRoZWFkZXIudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICRmb3JtLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICBpZiAoJGZvcm0uaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG4gICAgICAvLyDRhNC+0LrRg9GBINC/0ZbRgdC70Y8g0YDQvtC30LPQvtGA0YLQsNC90L3Rjzog0YMg0YTQvtC60YPRgdGWINGA0LDQvNC60LAg0YLQtdC80L3QsCDQuSDRgtC+0LLRgdGC0ZbRiNCwLCDQsCDQv9GW0LQg0YfQsNGBINGA0L7RgdGC0YMg0LLQuNGB0L7RgtC4INCy0L7QvdCwINCx0YPQu9CwINCxINCy0LjQtNC90LBcbiAgICAgIC8vINC+0LHRgNGW0LfQsNC90L7Rji4g0JHQtdC3INC/0YDQvtC60YDRg9GC0LrQuDog0LrQvtC90YLQtdC50L3QtdGAINGD0LbQtSDQvdCwINC80ZbRgdGG0ZZcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAoJGZvcm0uaGFzQ2xhc3MoJ2FjdGl2ZScpKSAkZm9ybS5maW5kKCdpbnB1dCcpLmZpcnN0KClbMF0uZm9jdXMoeyBwcmV2ZW50U2Nyb2xsOiB0cnVlIH0pO1xuICAgICAgfSwgMjQwKTtcbiAgICB9XG4gIH0pO1xuXG4gICQoZG9jdW1lbnQpLm9uKCdzdWJtaXQnLCAnLmpzLWNvdXBvbi1mb3JtJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgLy8g0YTQvtGA0LzQsCDQvNC+0LbQtSDQu9C10LbQsNGC0Lgg0LLRgdC10YDQtdC00LjQvdGWINGW0L3RiNC+0ZcgKNGH0LXQutCw0YPRgikg4oCUINGX0Zcgc3VibWl0INC90LUg0LzQsNGUINGB0YLQsNCy0LDRgtC4INCy0ZbQtNC/0YDQsNCy0LrQvtGOINC30LDQvNC+0LLQu9C10L3QvdGPXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCAkZm9ybSA9ICQodGhpcyk7XG4gICAgY29uc3QgJGlucHV0ID0gJGZvcm0uZmluZCgnI3Byb21vJyk7XG4gICAgY29uc3QgY29kZSA9ICRpbnB1dC52YWwoKS50cmltKCk7XG4gICAgY29uc3QgJGJ0biA9ICRmb3JtLmZpbmQoJ2J1dHRvbicpO1xuICAgIC8vINC/0L7QvNC40LvQutCwINC70LXQttC40YLRjCDQv9C+0LfQsCDRhNC+0YDQvNC+0Y4sINC/0L7RgNGD0Ycg0ZbQtyDQvdC10Y5cbiAgICBjb25zdCAkZXJyb3IgPSAkZm9ybS5zaWJsaW5ncygnLmpzLWNvdXBvbi1lcnJvcicpO1xuXG4gICAgJGVycm9yLnRleHQoJycpO1xuICAgIGlmICghY29kZSkge1xuICAgICAgJGVycm9yLnRleHQoJ9Cf0YDQvtC80L7QutC+0LQg0L3QtSDQvNC+0LbQtSDQsdGD0YLQuCDQv9C+0YDQvtC20L3RltC8Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY291cG9uUmVxdWVzdCgkZm9ybS5hdHRyKCdhY3Rpb24nKSwge1xuICAgICAgY291cG9uOiBjb2RlLFxuICAgICAgX2NzcmZfdG9rZW46ICRpbnB1dC5kYXRhKCdjc3JmJyksXG4gICAgICAvLyDQu9GW0LzRltGCINC/0YDQvtC80L7QutC+0LTRgyDQvdCwINC+0LTQvdGDINC70Y7QtNC40L3RgyDRgNCw0YXRg9GU0YLRjNGB0Y8g0ZYg0LfQsCDRgtC10LvQtdGE0L7QvdC+0LwvZW1haWwg0Lcg0YTQvtGA0LzQuCDQvtGE0L7RgNC80LvQtdC90L3Rj1xuICAgICAgcGhvbmU6IHdpbmRvdy5Ta2luUGhvbmVNYXNrID8gd2luZG93LlNraW5QaG9uZU1hc2sudG9MZWdhY3koJCgnI3Bob25lJykudmFsKCkpIDogKCQoJyNwaG9uZScpLnZhbCgpIHx8ICcnKS50cmltKCksXG4gICAgICBlbWFpbDogKCQoJyNlbWFpbCcpLnZhbCgpIHx8ICcnKS50cmltKCksXG4gICAgfSwgJGJ0bilcbiAgICAgIC5kb25lKChyZXNwb25zZSkgPT4ge1xuICAgICAgICByZW5kZXJDYXJ0U3VtbWFyeShyZXNwb25zZSk7XG4gICAgICB9KVxuICAgICAgLmZhaWwoKHhocikgPT4ge1xuICAgICAgICAkZXJyb3IudGV4dCh4aHIucmVzcG9uc2VKU09OPy5lcnJvciB8fCAn0KHRgtCw0LvQsNGB0Y8g0L/QvtC80LjQu9C60LAuINCh0L/RgNC+0LHRg9C50YLQtSDQv9GW0LfQvdGW0YjQtS4nKTtcbiAgICAgIH0pO1xuICB9KTtcblxuICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLXJlbW92ZS1jb3Vwb24nLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCAkYnRuID0gJCh0aGlzKTtcblxuICAgIGNvdXBvblJlcXVlc3QoJGJ0bi5kYXRhKCdyZW1vdmUtdXJsJykgfHwgJy9jYXJ0L3JlbW92ZS1jb3Vwb24nLCB7IF9jc3JmX3Rva2VuOiAkYnRuLmRhdGEoJ2NzcmYnKSB9LCAkYnRuKVxuICAgICAgLmRvbmUoKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHJlbmRlckNhcnRTdW1tYXJ5KHJlc3BvbnNlKTtcbiAgICAgIH0pXG4gICAgICAuZmFpbCgoeGhyKSA9PiB7XG4gICAgICAgIGFsZXJ0KHhoci5yZXNwb25zZUpTT04/LmVycm9yIHx8ICfQn9C+0LzQuNC70LrQsCDQv9GA0Lgg0LLQuNC00LDQu9C10L3QvdGWJyk7XG4gICAgICB9KTtcbiAgfSk7XG5cbiAgLy8gSW5pdCBvbiBwYWdlIGxvYWRcbiAgaW5pdFNhbXBsZVJlZnVzZSgpO1xuXG4gICQoJy5ub3RpZmljYXRpb24tYm94X19jbG9zZScpXG4gICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgaWYgKCQoJy5ub3RpZmljYXRpb24tYm94JykubGVuZ3RoKSB7XG4gICAgICAgICQoJy5ub3RpZmljYXRpb24tYm94JylcbiAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2lzLXNob3cnKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkKCcubm90aWZpY2F0aW9uLWJveCcpXG4gICAgICAgICAgICAuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICAgfSwgNjAwKTtcbiAgICAgIH1cbiAgICB9KTtcblxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGhlYWRlcigpIHtcbiAgLy8gMS4gRE9NIEVsZW1lbnRzIChWYW5pbGxhKVxuICBjb25zdCBtZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnUnKTtcbiAgY29uc3QgbWVudUl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1lbnUtbWFpbi1pdGVtJyk7XG4gIGNvbnN0IGNhdGFsb2dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhdGFsb2cnKTtcbiAgLy8gY29uc3QgbWVudUxpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWVudS1tYWluLWxpbmsnKTtcbiAgY29uc3QgbWVudU1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWVudS1tYWluJyk7XG5cbiAgLy8gMi4gU2VhcmNoIE92ZXJsYXkgTG9naWNcbiAgZnVuY3Rpb24gaW5pdFNlYXJjaE92ZXJsYXkoKSB7XG4gICAgY29uc3QgJGJvZHkgPSAkKCdib2R5Jyk7XG4gICAgY29uc3QgJHNlYXJjaEJ0biA9ICRib2R5LmZpbmQoJy5zZWFyY2gtYnRuIGEnKTtcbiAgICBjb25zdCAkc2VhcmNoRGF0YSA9ICRib2R5LmZpbmQoJy5zZWFyY2gtYm94Jyk7XG4gICAgY29uc3QgJHNlYXJjaEZvcm0gPSAkc2VhcmNoRGF0YS5maW5kKCcuc2VhcmNoLWJveF9fd3JhcHBlcicpO1xuICAgIGNvbnN0ICRzZWFyY2hDbG9zZSA9ICRzZWFyY2hEYXRhLmZpbmQoJy5idG4tY2xvc2UnKTtcblxuICAgICRzZWFyY2hCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAkc2VhcmNoRGF0YS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgfSk7XG5cbiAgICAkc2VhcmNoRGF0YS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgaWYgKCEkc2VhcmNoRm9ybS5pcyhlLnRhcmdldCkgJiYgJHNlYXJjaEZvcm0uaGFzKGUudGFyZ2V0KS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgJHNlYXJjaERhdGEucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJHNlYXJjaENsb3NlLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAkc2VhcmNoRGF0YS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgfSk7XG4gIH1cblxuICBpbml0U2VhcmNoT3ZlcmxheSgpO1xuXG4gIC8vIDMuIFNlYXJjaCBTbGlkZXIgSW5pdGlhbGl6YXRpb25cbiAgZnVuY3Rpb24gaW5pdFNlYXJjaFNsaWRlcigpIHtcbiAgICBjb25zdCAkc2VhcmNoU2xpZGVyID0gJCgnLnNlYXJjaC1wcm9kdWN0cy1saXN0Jyk7XG5cbiAgICAkc2VhcmNoU2xpZGVyLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgJCh0aGlzKS5zbGljayh7XG4gICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgYXJyb3dzOiB0cnVlLFxuICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgc2xpZGVzVG9TaG93OiAyLFxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgZm9jdXNPblNlbGVjdDogdHJ1ZSxcbiAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDEwMjMsXG4gICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDQsXG4gICAgICAgICAgICAgIHN3aXBlOiBmYWxzZSxcbiAgICAgICAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgZG90czogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdFNlYXJjaFNsaWRlcigpO1xuXG4gIC8vIDQuIE1lc3NhZ2UgQmFyIFNsaWRlclxuICBmdW5jdGlvbiBpbml0TWVzc2FnZUJhclNsaWRlcigpIHtcbiAgICBjb25zdCAkc2xpZGVycyA9ICQoJy5tZXNzYWdlLWJhcl9fc2xpZGVyJyk7XG5cbiAgICAkc2xpZGVycy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0ICRzbGlkZXIgPSAkKHRoaXMpO1xuXG4gICAgICBpZiAoJHNsaWRlci5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuICAgICAgICAkc2xpZGVyLnNsaWNrKCd1bnNsaWNrJyk7XG4gICAgICB9XG4gICAgICAkc2xpZGVyLnNsaWNrKHtcbiAgICAgICAgYXV0b3BsYXk6IHRydWUsXG4gICAgICAgIGF1dG9wbGF5U3BlZWQ6IDUwMDAsXG4gICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWVcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdE1lc3NhZ2VCYXJTbGlkZXIoKTtcblxuICAvLyA1LiDQnNC10L3Rji3QutCw0YLQsNC70L7QsyDQvdCwINC00LXRgdC60YLQvtC/0ZY6INGA0L7Qt9C60YDQuNCy0LDRlNGC0YzRgdGPINC90LDQstC10LTQtdC90L3Rj9C8LCDQsCDQutC70ZbQuiDQv9C+INC/0YPQvdC60YLRg1xuICAvLyDQstC10LTQtSDQvdCwINC50L7Qs9C+INGB0YLQvtGA0ZbQvdC60YMgKNC60LDRgtCw0LvQvtCzINCy0ZbQtNC60YDQuNCy0LDRlNGC0YzRgdGPINC60LvRltC60L7QvCwg0Y/QuiDRliDQsdGD0LTRjC3Rj9C60LVcbiAgLy8g0L/QvtGB0LjQu9Cw0L3QvdGPKSDigJQg0L/QvtCy0LXQtNGW0L3QutCwLCDRj9C60LAg0LHRg9C70LAg0LTQviDRgNC10LTQuNC30LDQudC90YMgMjAyNi5cbiAgY29uc3QgZGVza3RvcE1lbnUgPSB3aW5kb3cubWF0Y2hNZWRpYSgnKGhvdmVyOiBob3ZlcikgYW5kIChtaW4td2lkdGg6IDEwMjVweCknKTtcblxuICAoZnVuY3Rpb24gaW5pdERlc2t0b3BEcm9wZG93bnMoKSB7XG4gICAgaWYgKCFtZW51TWFpbikgcmV0dXJuO1xuXG4gICAgZnVuY3Rpb24gY2F0YWxvZ0lzRW1wdHkoY2F0YWxvZykge1xuICAgICAgY29uc3QgY2F0YWxvZ0luID0gY2F0YWxvZz8ucXVlcnlTZWxlY3RvcignLmNhdGFsb2ctaW4nKTtcblxuICAgICAgaWYgKCFjYXRhbG9nSW4pIHJldHVybiB0cnVlO1xuXG4gICAgICByZXR1cm4gY2F0YWxvZ0luLnRleHRDb250ZW50LnRyaW0oKSA9PT0gJyc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvc2VBbGwoKSB7XG4gICAgICBtZW51Py5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblxuICAgICAgbWVudUl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cbiAgICAgICAgY29uc3QgbGluayA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLm1lbnUtbWFpbi1saW5rJyk7XG5cbiAgICAgICAgbGluaz8uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cbiAgICAgICAgaWYgKGxpbms/Lmhhc0F0dHJpYnV0ZSgnYXJpYS1oYXNwb3B1cCcpKSB7XG4gICAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNhdGFsb2dzLmZvckVhY2goY2F0YWxvZyA9PiB7XG4gICAgICAgIGNhdGFsb2cuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvcGVuRHJvcGRvd24oaXRlbSwgY2F0YWxvZykge1xuICAgICAgY2xvc2VBbGwoKTtcblxuICAgICAgbWVudT8uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXG4gICAgICBjb25zdCBsaW5rID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcubWVudS1tYWluLWxpbmsnKTtcblxuICAgICAgbGluaz8uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICBsaW5rPy5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuXG4gICAgICBjYXRhbG9nLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1cblxuICAgIG1lbnVJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgY2F0YWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAuY2F0YWxvZ1tkYXRhLXBhcmVudC1pZD1cIiR7aXRlbS5kYXRhc2V0Lm1lbnVJZH1cIl1gXG4gICAgICApO1xuICAgICAgY29uc3QgbGluayA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLm1lbnUtbWFpbi1saW5rJyk7XG5cbiAgICAgIGlmICghbGluayB8fCAhY2F0YWxvZyB8fCBjYXRhbG9nSXNFbXB0eShjYXRhbG9nKSkgcmV0dXJuO1xuXG4gICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnYXJpYS1oYXNwb3B1cCcsICd0cnVlJyk7XG4gICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuXG4gICAgICAvLyDQvdCw0LLQtdC70Lgg0L3QsCDQv9GD0L3QutGCIOKAlCDRgNC+0LfQutGA0LjQu9C4INC50L7Qs9C+INC/0LDQvdC10LvRjDsg0LrQu9GW0Log0LvQuNGI0LDRlNGC0YzRgdGPINC30LLQuNGH0LDQudC90LjQvFxuICAgICAgLy8g0L/QtdGA0LXRhdC+0LTQvtC8INC30LAg0L/QvtGB0LjQu9Cw0L3QvdGP0LwgKNC90LAg0LzQvtCx0ZbQu9GM0L3QvtC80YMg0L/RgNCw0YbRjtGUINCy0LjRgdGD0LLQvdC1INC80LXQvdGOKVxuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWRlc2t0b3BNZW51Lm1hdGNoZXMpIHJldHVybjtcblxuICAgICAgICBvcGVuRHJvcGRvd24oaXRlbSwgY2F0YWxvZyk7XG4gICAgICB9KTtcblxuICAgICAgLy8g0L/QsNC90LXQu9GMINC70LXQttC40YLRjCDQv9GW0LQg0YjQsNC/0LrQvtGOOiDQv9C+0LrQuCDQutGD0YDRgdC+0YAg0YMg0L3RltC5IOKAlCDQstC+0L3QsCDQstGW0LTQutGA0LjRgtCwXG4gICAgICBjYXRhbG9nLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghZGVza3RvcE1lbnUubWF0Y2hlcykgcmV0dXJuO1xuXG4gICAgICAgIG9wZW5Ecm9wZG93bihpdGVtLCBjYXRhbG9nKTtcbiAgICAgIH0pO1xuXG4gICAgICBjYXRhbG9nLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghZGVza3RvcE1lbnUubWF0Y2hlcykgcmV0dXJuO1xuXG4gICAgICAgIGNsb3NlQWxsKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIG1lbnVNYWluLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWRlc2t0b3BNZW51Lm1hdGNoZXMpIHJldHVybjtcblxuICAgICAgY2xvc2VBbGwoKTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgY2xvc2VBbGwoKTtcbiAgICB9KTtcblxuICAgIGRlc2t0b3BNZW51LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGNsb3NlQWxsKTtcbiAgfSkoKTtcblxuICBmdW5jdGlvbiBpbml0QWpheFNlYXJjaCgpIHtcbiAgICBjb25zdCAkaW5wdXQgPSAkKCcjc2VhcmNoLWlucHV0Jyk7XG4gICAgY29uc3QgJGZvcm0gPSAkKCcuc2VhcmNoLWZvcm0nKTtcblxuICAgIC8vIFNhZmV0eSBjaGVjazogRG9uJ3QgcnVuIHRoaXMgaWYgdGhlIGlucHV0IGlzbid0IG9uIHRoZSBwYWdlXG4gICAgaWYgKCEkaW5wdXQubGVuZ3RoKSByZXR1cm47XG5cbiAgICBjb25zdCAkY29udGFpbmVyID0gJCgnI3NlYXJjaC1yZXN1bHRzLWNvbnRhaW5lcicpO1xuICAgIGNvbnN0ICRkZWZhdWx0ID0gJCgnI3NlYXJjaC1yZXN1bHRzLWRlZmF1bHQnKTtcbiAgICBjb25zdCAkaGludCA9ICQoJy5qcy1zZWFyY2gtaGludCcpO1xuICAgIGNvbnN0IHNlYXJjaFVybCA9ICRmb3JtLmF0dHIoJ2FjdGlvbicpO1xuXG4gICAgbGV0IHR5cGluZ1RpbWVyO1xuICAgIGNvbnN0IGRvbmVUeXBpbmdJbnRlcnZhbCA9IDMwMDtcblxuICAgIC8vIEZJWCAxOiBHbyBieSBVUkwgb24gRW50ZXIgKG9ubHkgYmxvY2sgaWYgcXVlcnkgaXMgdG9vIHNob3J0KVxuICAgICRmb3JtLm9mZignc3VibWl0Jykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGNvbnN0IHF1ZXJ5ID0gJGlucHV0LnZhbCgpLnRyaW0oKTtcbiAgICAgIC8vIElmIHRoZSBpbnB1dCBpcyBlbXB0eSBvciBsZXNzIHRoYW4gMyBjaGFycywgZG9uJ3Qgc3VibWl0IHRoZSBmb3JtXG4gICAgICBpZiAocXVlcnkubGVuZ3RoIDwgMykge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgICAvLyBPdGhlcndpc2UsIHRoZSBicm93c2VyIGhhbmRsZXMgdGhlIHN1Ym1pdCBuYXR1cmFsbHkgYW5kIG5hdmlnYXRlcyB0byB0aGUgc2VhcmNoIHBhZ2UuXG4gICAgfSk7XG5cbiAgICAkaW5wdXQub2ZmKCdpbnB1dCcpLm9uKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0eXBpbmdUaW1lcik7XG4gICAgICBjb25zdCBxdWVyeSA9ICQodGhpcykudmFsKCkudHJpbSgpO1xuXG4gICAgICAvLyAxLiBFbXB0eSBmaWVsZFxuICAgICAgaWYgKHF1ZXJ5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAkZGVmYXVsdC5yZW1vdmVDbGFzcygnaXMtaGlkZGVuJyk7XG4gICAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpLnJlbW92ZUNsYXNzKCdpcy1sb2FkaW5nJyk7XG4gICAgICAgICRoaW50LmFkZENsYXNzKCdpcy1oaWRkZW4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyAyLiBOb3QgZW5vdWdoIGNoYXJhY3RlcnNcbiAgICAgIGlmIChxdWVyeS5sZW5ndGggPCAzKSB7XG4gICAgICAgIGNvbnN0IGNoYXJzTGVmdCA9IDMgLSBxdWVyeS5sZW5ndGg7XG4gICAgICAgICRoaW50LnRleHQoYNCS0LLQtdC00ZbRgtGMINGJ0LUgJHtjaGFyc0xlZnR9INGB0LjQvNCy0L7QuyjQuCkg0LTQu9GPINC/0L7RiNGD0LrRgy4uLmApLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcbiAgICAgICAgJGRlZmF1bHQucmVtb3ZlQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgICAkY29udGFpbmVyLmFkZENsYXNzKCdpcy1oaWRkZW4nKS5yZW1vdmVDbGFzcygnaXMtbG9hZGluZycpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIDMuIFJlYWR5IHRvIHNlYXJjaFxuICAgICAgJGhpbnQuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuXG4gICAgICB0eXBpbmdUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAkZGVmYXVsdC5hZGRDbGFzcygnaXMtaGlkZGVuJyk7XG4gICAgICAgICRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ2lzLWhpZGRlbicpLmFkZENsYXNzKCdpcy1sb2FkaW5nJyk7XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICB1cmw6IHNlYXJjaFVybCxcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgIGRhdGE6IHsgcTogcXVlcnksIGlzX2FqYXg6IDEgfSxcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnWC1SZXF1ZXN0ZWQtV2l0aCc6ICdYTUxIdHRwUmVxdWVzdCdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChodG1sUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRjb250YWluZXIuaHRtbChodG1sUmVzcG9uc2UpO1xuICAgICAgICAgICAgJGNvbnRhaW5lci5yZW1vdmVDbGFzcygnaXMtbG9hZGluZycpO1xuXG4gICAgICAgICAgICAvLyBGSVggMjogUmVwbGFjZSAvY2F0YWxvZyBocmVmIHdpdGggdGhlIGFjdHVhbCBzZWFyY2ggcmVzdWx0cyBVUkxcbiAgICAgICAgICAgIGNvbnN0IGZ1bGxTZWFyY2hVcmwgPSBzZWFyY2hVcmwgKyAnP3E9JyArIGVuY29kZVVSSUNvbXBvbmVudChxdWVyeSk7XG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQoJ2FbaHJlZj1cIi9jYXRhbG9nXCJdJykuYXR0cignaHJlZicsIGZ1bGxTZWFyY2hVcmwpO1xuXG4gICAgICAgICAgICAvLyBSZS1pbml0aWFsaXplIHNsaWRlciBiZWNhdXNlIG5ldyBET00gZWxlbWVudHMgd2VyZSBqdXN0IGluamVjdGVkXG4gICAgICAgICAgICBpZiAodHlwZW9mIGluaXRTZWFyY2hTbGlkZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgaW5pdFNlYXJjaFNsaWRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ9Cf0L7QvNC40LvQutCwINC/0L7RiNGD0LrRgycpO1xuICAgICAgICAgICAgJGNvbnRhaW5lci5yZW1vdmVDbGFzcygnaXMtbG9hZGluZycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LCBkb25lVHlwaW5nSW50ZXJ2YWwpO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdEFqYXhTZWFyY2goKTtcblxuXG4gIC8vIDYuINCS0LjRgdC+0YLQsCDRiNCw0L/QutC4INC00LvRjyDRhNGW0LrRgdC+0LLQsNC90LjRhSDQv9Cw0L3QtdC70LXQuSAoLS1oZWFkZXItb2Zmc2V0KVxuICAvLyDQodGC0YDRltGH0LrQsC3QsNC90L7QvdGBINC90LAg0LLRg9C30YzQutC40YUg0LXQutGA0LDQvdCw0YUg0L/QtdGA0LXQvdC+0YHQuNGC0Ywg0YDRj9C00LrQuCwg0YLQvtC2INGA0LDRhdGD0ZTQvNC+INGE0LDQutGC0LjRh9C90YNcbiAgLy8g0L3QuNC20L3RjiDQvNC10LbRgyDRgNGP0LTQutCwINGI0LDQv9C60LgsINCwINC90LUg0LrQvtC90YHRgtCw0L3RgtGDLlxuICBmdW5jdGlvbiBzeW5jSGVhZGVyT2Zmc2V0KCkge1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZW51LWluJyk7XG5cbiAgICBpZiAoIXJvdykgcmV0dXJuO1xuXG4gICAgY29uc3QgYm90dG9tID0gTWF0aC5tYXgoMCwgTWF0aC5yb3VuZChyb3cuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tKSk7XG5cbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnNldFByb3BlcnR5KCctLWhlYWRlci1vZmZzZXQnLCBib3R0b20gKyAncHgnKTtcbiAgfVxuXG4gIHN5bmNIZWFkZXJPZmZzZXQoKTtcbiAgJCh3aW5kb3cpLm9uKCdyZXNpemUuaGVhZGVyT2Zmc2V0Jywgc3luY0hlYWRlck9mZnNldCk7XG5cbiAgLy8gNy4gQW5ub3VuY2VtZW50IEJhclxuXG4gIGZ1bmN0aW9uIGFubm91bmNlbWVudEJhcigpIHtcbiAgICBjb25zdCAkYm9keSA9ICQoJ2JvZHknKTtcbiAgICBjb25zdCAkYW5ub3VuY2VtZW50ID0gJGJvZHkuZmluZCgnLmFubm91bmNlbWVudC1iYXInKTtcblxuICAgIGZ1bmN0aW9uIGFubm91bmNlbWVudCgpIHtcbiAgICAgIHN5bmNIZWFkZXJPZmZzZXQoKTtcblxuICAgICAgaWYoJGFubm91bmNlbWVudC5sZW5ndGgpIHtcbiAgICAgICAgY29uc3Qgc2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgICAgICBjb25zdCB0aHJlc2hvbGQgPSAkKHdpbmRvdykud2lkdGgoKSA+IDc2NyA/IDUwIDogNjk7XG5cbiAgICAgICAgaWYgKHNjcm9sbFRvcCA+IHRocmVzaG9sZCkge1xuICAgICAgICAgICRib2R5LmFkZENsYXNzKCduby1hbm5vdW5jZW1lbnQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkYm9keS5yZW1vdmVDbGFzcygnbm8tYW5ub3VuY2VtZW50Jyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRib2R5LmFkZENsYXNzKCduby1hbm5vdW5jZW1lbnQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhbm5vdW5jZW1lbnQoKTtcbiAgICAkKHdpbmRvdykub2ZmKCdzY3JvbGwnKS5vbignc2Nyb2xsJywgYW5ub3VuY2VtZW50KTtcbiAgfVxuXG4gIGFubm91bmNlbWVudEJhcigpO1xufVxuIiwiLyogZ2xvYmFsIGRvY3VtZW50LCBNdXRhdGlvbk9ic2VydmVyICovXG5pbXBvcnQgeyBsYXp5TG9hZEltYWdlcyB9IGZyb20gJy4uL2dsb2JhbC9sYXp5TG9hZCc7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBsYXp5IGxvYWRpbmcgZm9yIGltYWdlcywgaW5jbHVkaW5nIGR5bmFtaWNhbGx5IGxvYWRlZCBjb250ZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0TGF6eUltYWdlcygpIHtcbiAgLy8gQXBwbHkgbGF6eSBsb2FkaW5nIHRvIGFsbCBleGlzdGluZyBpbWFnZXNcbiAgbGF6eUxvYWRJbWFnZXMoKTtcblxuICAvLyBTZXQgdXAgYSBNdXRhdGlvbk9ic2VydmVyIHRvIHdhdGNoIGZvciBkeW5hbWljYWxseSBhZGRlZCBpbWFnZXNcbiAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XG4gICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gJ2NoaWxkTGlzdCcgJiYgbXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIENoZWNrIGlmIGFueSBvZiB0aGUgYWRkZWQgbm9kZXMgYXJlIGltYWdlcyBvciBjb250YWluIGltYWdlc1xuICAgICAgICBtdXRhdGlvbi5hZGRlZE5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgICAvLyBJZiBpdCdzIGFuIGVsZW1lbnQgbm9kZVxuICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICAvLyBJZiBpdCdzIGFuIGltYWdlXG4gICAgICAgICAgICBpZiAobm9kZS50YWdOYW1lID09PSAnSU1HJykge1xuICAgICAgICAgICAgICBpZiAoIW5vZGUuaGFzQXR0cmlidXRlKCdsb2FkaW5nJykpIHtcbiAgICAgICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZSgnbG9hZGluZycsICdsYXp5Jyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZS5xdWVyeVNlbGVjdG9yQWxsKSB7IC8vIElmIGl0IGNvbnRhaW5zIGltYWdlc1xuICAgICAgICAgICAgICBsYXp5TG9hZEltYWdlcyhub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICAvLyBTdGFydCBvYnNlcnZpbmcgdGhlIGRvY3VtZW50IHdpdGggdGhlIGNvbmZpZ3VyZWQgcGFyYW1ldGVyc1xuICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgc3VidHJlZTogdHJ1ZSxcbiAgfSk7XG5cbiAgcmV0dXJuIG9ic2VydmVyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpbml0TGF6eUltYWdlcztcbiIsIi8qIGdsb2JhbCAkICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbml0TW9iaWxlTWVudSgpIHtcbiAgZnVuY3Rpb24gY2xvc2VNb2JpbGVNZW51KCkge1xuICAgICQoJyNidXJnZXIsIGJvZHksIC5tZW51LW1haW4tbW9iaWxlLWFsbCwgLm1lbnUtbWFpbi1tb2JpbGUtYWNjb3VudCwgI2FjY291bnQnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgJCgnLm1lbnUtbWFpbi1tb2JpbGUtYWxsJykucmVtb3ZlQ2xhc3MoJ29uLWl0Jyk7XG4gICAgJCgnLm1lbnUtbWFpbi1tb2JpbGUtY2F0YWxvZycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKCcjbWVudScpLnJlbW92ZUNsYXNzKCdtb2JpbGUnKTtcbiAgICAkKCcjYnVyZ2VyJykuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICB9XG5cbiAgLy8gQnVyZ2VyIG1lbnUgdG9nZ2xlXG4gICQoJyNidXJnZXInKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgY29uc3QgaXNBY2NvdW50QWN0aXZlID0gJCgnI2J1cmdlcicpLmhhc0NsYXNzKCdhY3RpdmUnKTtcblxuICAgIC8vINCv0LrRidC+INCx0YPQu9CwINCy0ZbQtNC60YDQuNGC0LAgYWNjb3VudC3Qv9Cw0L3QtdC70Ywg4oCUINC30LDQutGA0LjQstCw0ZTQvNC+INGX0Zcg0YLQtdC2XG4gICAgaWYgKGlzQWNjb3VudEFjdGl2ZSkge1xuICAgICAgY2xvc2VNb2JpbGVNZW51KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJyNidXJnZXIsIGJvZHksIC5tZW51LW1haW4tbW9iaWxlLWFsbCcpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICQoJyNtZW51JykuYWRkQ2xhc3MoJ21vYmlsZScpO1xuICAgICAgJCgnI2J1cmdlcicpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgIH1cblxuICB9KTtcblxuICAvLyDQkdGD0YDQs9C10YAg0LTQvtGB0YLRg9C/0L3QuNC5INC3INC60LvQsNCy0ZbQsNGC0YPRgNC4OiDQstGW0L0g0L3QtSA8YnV0dG9uPiwg0YLQvtC80YMgRW50ZXIvU3BhY2Ug0LLRgNGD0YfQvdGDXG4gICQoJyNidXJnZXInKS5vbigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnICcpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICQoJyNidXJnZXInKS50cmlnZ2VyKCdjbGljaycpO1xuICAgIH1cbiAgfSk7XG5cbiAgJChkb2N1bWVudCkub24oJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScgJiYgJCgnI2J1cmdlcicpLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xuICAgICAgY2xvc2VNb2JpbGVNZW51KCk7XG4gICAgfVxuICB9KTtcblxuICAvLyBNb2JpbGUgc2VhcmNoIHRvZ2dsZVxuICAkKCcuc2VhcmNoLWJ0bi1tb2JpbGUnKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgJCgnLm1lbnUnKS50b2dnbGVDbGFzcygnc2VhcmNoLWFjdGl2ZScpO1xuICAgICQoJy5tZW51LW1haW4tbW9iaWxlLWFsbCcpLnRvZ2dsZUNsYXNzKCdvbi1pdCcpO1xuICAgICQoJy5tZW51LWFkZGl0aW9uYWwtc2VhcmNoJykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICB9KTtcblxuICAvLyBNb2JpbGUgbWVudSBpdGVtIGljb24gY2xpY2sgKG9wZW4gc3VibWVudSlcbiAgJCgnLm1lbnUtbWFpbi1tb2JpbGUtaXRlbS1pY29uLCAubWVudS1tYWluLW1vYmlsZS1saW5rLXN1YicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtZW51SWQgPSAkKHRoaXMpLmRhdGEoJ2lkJyk7XG4gICAgJChgI2l0ZW1fJHttZW51SWR9YCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQoJy5tZW51LW1haW4tbW9iaWxlLWFsbCcpLmFkZENsYXNzKCdvbi1pdCcpO1xuICB9KTtcblxuICAvLyBCYWNrIGZyb20gc3VibWVudVxuICAkKCcubWVudS1tYWluLW1vYmlsZS1jYXRhbG9nLXRpdGxlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IG1lbnVJZCA9ICQodGhpcykuY2xvc2VzdCgnLm1lbnUtbWFpbi1tb2JpbGUtY2F0YWxvZycpLmRhdGEoJ21lbnUtaWQnKTtcbiAgICAkKGAjaXRlbV8ke21lbnVJZH1gKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgJCgnLm1lbnUtbWFpbi1tb2JpbGUtYWxsJykucmVtb3ZlQ2xhc3MoJ29uLWl0Jyk7XG4gIH0pO1xuXG4gIC8vIE5lc3RlZCBzdWJtZW51IHRvZ2dsZVxuICAkKCcubWVudS1tYWluLW1vYmlsZS1saW5rLXN1Yi1zdWIsIC5tZW51LW1haW4tbW9iaWxlLWNhdGFsb2ctaGVhZGVyLWljb24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgJGlubmVyID0gJCh0aGlzKS5jbG9zZXN0KCcubWVudS1tYWluLW1vYmlsZS1jYXRhbG9nLWlubmVyJyk7XG4gICAgY29uc3QgaXNBY3RpdmUgPSAkaW5uZXIuaGFzQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgLy8gQ29sbGFwc2UgYWxsIGZpcnN0XG4gICAgJCgnLm1lbnUtbWFpbi1tb2JpbGUtY2F0YWxvZy1pbm5lcicpXG4gICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgLy8gRXhwYW5kIGNsaWNrZWQgb25lXG4gICAgaWYgKCFpc0FjdGl2ZSkge1xuICAgICAgJGlubmVyLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIOKchSBOZXc6IEFjY291bnQgcGFuZWwgdG9nZ2xlXG4gICQoJyNhY2NvdW50Jykub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICQoJyNhY2NvdW50JykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQoJyNidXJnZXIsICNhY2NvdW50LCBib2R5LCAubWVudS1tYWluLW1vYmlsZS1hY2NvdW50JykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQoJyNtZW51JykudG9nZ2xlQ2xhc3MoJ21vYmlsZScpO1xuICB9KTtcbn1cbiIsIi8qIGdsb2JhbCAkLCBkb2N1bWVudCwgd2luZG93ICovXG5cbi8vIENvcHkgdGhlIHByb2R1Y3QgcHJldmlldyAoaW1hZ2UgLyBuYW1lIC8gY2FwYWNpdHkgLyBwcmljZSkgaW50byB0aGUgb3V0LW9mLXN0b2NrXG4vLyBwb3B1cCBjYXJkLCBzbyB0aGUgY3VzdG9tZXIgc2VlcyB0aGUgcHJvZHVjdCB0aGV5IGFyZSBzdWJzY3JpYmluZyB0byBpbnN0ZWFkIG9mXG4vLyB0aGUgaGFyZGNvZGVkIHBsYWNlaG9sZGVyLiBUaGUgYnV0dG9uIGNhbiBsaXZlIGluIGEgbGlzdGluZyBjYXJkIChjYXRhbG9nIC9cbi8vIHJlbGF0ZWQgLyBzY2hlbWEpIG9yIG9uIHRoZSBwcm9kdWN0IGRldGFpbCBwYWdlLCBzbyB0aGUgc291cmNlIGlzIHJlc29sdmVkIGZyb21cbi8vIHRoZSBjbGlja2VkIGJ1dHRvbidzIG5lYXJlc3QgcHJvZHVjdCBjb250YWluZXIuXG5mdW5jdGlvbiBmaWxsT3V0T2ZTdG9ja1Byb2R1Y3QoYnRuKSB7XG4gIGNvbnN0ICRjYXJkID0gJCgnLm91dC1vZi1zdG9jay1wb3B1cCAucG9wdXAtcHJvZHVjdCcpO1xuICBpZiAoISRjYXJkLmxlbmd0aCkgcmV0dXJuO1xuXG4gIC8vIE5lYXJlc3QgcHJvZHVjdCBjb250YWluZXI6IGEgbGlzdGluZyBjYXJkLCBvciB0aGUgd2hvbGUgZGV0YWlsIHBhZ2UuXG4gIGNvbnN0ICRzcmMgPSAkKGJ0bilcbiAgICAuY2xvc2VzdCgnLmNhdGFsb2ctc2hlbWEtaXRlbSwgLnAtY2FyZCwgLnByb2R1Y3QsIC53YXlmeC1wcm9kdWN0JylcbiAgICAuZmlyc3QoKTtcbiAgY29uc3QgJHBhZ2UgPSAkc3JjLmxlbmd0aCA/ICRzcmMgOiAkKCcud2F5ZngtcHJvZHVjdCcpLmZpcnN0KCk7XG4gIGlmICghJHBhZ2UubGVuZ3RoKSByZXR1cm47XG5cbiAgLy8gVGhlIGRldGFpbCBnYWxsZXJ5IGlzIGEgc2xpY2sgc2xpZGVyIHRoYXQgY2xvbmVzL3Jlb3JkZXJzIHNsaWRlcywgc28gcHJlZmVyXG4gIC8vIHRoZSB2aXNpYmxlIHNsaWRlLCB0aGVuIHRoZSBmaXJzdCByZWFsIHNsaWRlLiBMaXN0aW5nIGNhcmRzIGV4cG9zZSBhIHNpbmdsZVxuICAvLyBpbWFnZS4gT25seSB1c2UgYW4gPGltZz4gdGhhdCBhY3R1YWxseSBoYXMgYSBzcmMuXG4gIGNvbnN0ICRpbWcgPSAkcGFnZVxuICAgIC5maW5kKFxuICAgICAgJy5jYXRhbG9nLXNoZW1hLWl0ZW0taW1hZ2UgaW1nLCdcbiAgICAgICsgJy5wcm9kdWN0LWltYWdlLCdcbiAgICAgICsgJy53YXlmeC1wcm9kdWN0X19mZWF0dXJlZC1waG90byAuc2xpY2stY3VycmVudCBpbWcsJ1xuICAgICAgKyAnLndheWZ4LXByb2R1Y3RfX2ZlYXR1cmVkLXBob3RvIC5zbGljay1zbGlkZTpub3QoLnNsaWNrLWNsb25lZCkgaW1nLCdcbiAgICAgICsgJy53YXlmeC1wcm9kdWN0X19mZWF0dXJlZC1waG90byBpbWcsJ1xuICAgICAgKyAnLnVsdHJhX19pbWctaG9sZGVyIGltZywnXG4gICAgICArICcud2F5ZngtcHJvZHVjdF9fcGhvdG9zLXdyYXBwZXIgaW1nJ1xuICAgIClcbiAgICAuZmlsdGVyKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBCb29sZWFuKHRoaXMuZ2V0QXR0cmlidXRlKCdzcmMnKSk7XG4gICAgfSlcbiAgICAuZmlyc3QoKTtcbiAgaWYgKCRpbWcubGVuZ3RoKSB7XG4gICAgJGNhcmQuZmluZCgnLmltZy1ob2xkZXIgaW1nJylcbiAgICAgIC5hdHRyKCdzcmMnLCAkaW1nLmF0dHIoJ3NyYycpKVxuICAgICAgLmF0dHIoJ2FsdCcsICRpbWcuYXR0cignYWx0JykgfHwgJycpXG4gICAgICAuYXR0cigndGl0bGUnLCAkaW1nLmF0dHIoJ3RpdGxlJykgfHwgJycpO1xuICB9XG5cbiAgY29uc3QgbmFtZSA9ICRwYWdlXG4gICAgLmZpbmQoJy5jYXRhbG9nLXNoZW1hLWl0ZW0tbmFtZSwgLnByb2R1Y3QtbmFtZSwgLndheWZ4LXByb2R1Y3RfX3RpdGxlJylcbiAgICAuZmlyc3QoKVxuICAgIC50ZXh0KClcbiAgICAudHJpbSgpO1xuICBpZiAobmFtZSkgJGNhcmQuZmluZCgnLnByb2R1Y3QtaW5mbyAucm93JykuZmlyc3QoKS5maW5kKCdwJykudGV4dChuYW1lKTtcblxuICBjb25zdCBjYXBhY2l0eSA9ICRwYWdlLmZpbmQoJy5wcm9kdWN0LWNhcGFjaXR5JykuZmlyc3QoKS50ZXh0KCkudHJpbSgpO1xuICAkY2FyZC5maW5kKCcucHJvZHVjdC1jYXBhY2l0eScpLnRleHQoY2FwYWNpdHkpLnRvZ2dsZShCb29sZWFuKGNhcGFjaXR5KSk7XG5cbiAgY29uc3QgcHJpY2UgPSAkcGFnZVxuICAgIC5maW5kKFxuICAgICAgJy5jYXRhbG9nLXNoZW1hLWl0ZW0tcHJpY2UtbmV3LCdcbiAgICAgICsgJy5wcm9kdWN0LXByaWNlLW5ldywnXG4gICAgICArICcud2F5ZngtcHJvZHVjdF9fYWRkaXRpb25hbC0taW5mby0tZGVzY3JpcHRpb24tLWl0ZW0ucHJpY2UnXG4gICAgKVxuICAgIC5maXJzdCgpXG4gICAgLnRleHQoKVxuICAgIC50cmltKCk7XG4gIGlmIChwcmljZSkgJGNhcmQuZmluZCgnLnByaWNlJykudGV4dChwcmljZSk7XG5cbiAgY29uc3Qgb2xkUHJpY2UgPSAkcGFnZVxuICAgIC5maW5kKCcuY2F0YWxvZy1zaGVtYS1pdGVtLXByaWNlLW9sZCwgLnByb2R1Y3QtcHJpY2Utb2xkLCAub2xkLXByaWNlJylcbiAgICAuZmlyc3QoKVxuICAgIC50ZXh0KClcbiAgICAudHJpbSgpO1xuICBjb25zdCAkb2xkUHJpY2UgPSAkY2FyZC5maW5kKFxuICAgICcud2F5ZngtcHJvZHVjdF9fYWRkaXRpb25hbC0tZm9ybS0tc2VsZWN0LS1vcHRpb25zLS1yaWdodC0tcHJpY2UtLW9sZCdcbiAgKTtcbiAgaWYgKG9sZFByaWNlKSB7XG4gICAgJG9sZFByaWNlLnRleHQob2xkUHJpY2UpLnNob3coKTtcbiAgfSBlbHNlIHtcbiAgICAkb2xkUHJpY2UudGV4dCgnJykuaGlkZSgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluaXRQb3B1cHMoKSB7XG4gIC8vIE91dCBvZiBzdG9jayBwb3B1cFxuICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLm91dC1vZi1zdG9jaywub3V0LW9mLXN0b2NrLWJ1dHRvbicsIGZ1bmN0aW9uICgpIHtcbiAgICAvLyBSZWZyZXNoIHRoZSBwcmV2aWV3IGZyb20gdGhlIGNsaWNrZWQgcHJvZHVjdCBiZWZvcmUgc2hvd2luZyB0aGUgcG9wdXBcbiAgICBmaWxsT3V0T2ZTdG9ja1Byb2R1Y3QodGhpcyk7XG4gICAgLy8gUmVzZXQgdGhlIGZvcm0gYmFjayB0byBpdHMgaW5pdGlhbCBzdGF0ZSAoaW4gY2FzZSBpdCB3YXMgYWxyZWFkeSBzdWJtaXR0ZWQpXG4gICAgY29uc3QgJGZvcm0gPSAkKCcub3V0LW9mLXN0b2NrLWZvcm0nKTtcbiAgICAkZm9ybS5yZW1vdmVDbGFzcygnc2VudCcpO1xuICAgICRmb3JtLmZpbmQoJy5wb3B1cC1mb3JtLWVycm9yJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICRmb3JtLmZpbmQoJyNwb3B1cC1lbWFpbCcpLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xuICAgIC8vIFNob3cgdGhlIGVsZW1lbnQgc21vb3RobHkgb3ZlciAwLjUgc2Vjb25kcyAoNTAwIG1zKVxuICAgICQoJy5vdXQtb2Ytc3RvY2stcG9wdXAnKS5mYWRlSW4oNTAwKTtcbiAgICAkKCcjcG9wdXAtcHJvZHVjdCcpLnZhbCgkKHRoaXMpLmRhdGEoJ2lkJykpO1xuICB9KTtcblxuICAvLyBDbG9zZSBwb3B1cCB3aGVuIGNsaWNraW5nIG9uIGJhY2tncm91bmQgKC5wb3B1cCkgb3IgY2xvc2UgYnV0dG9uXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcucG9wdXAtY2xvc2UsIC5wb3B1cCcsICgpID0+IHtcbiAgICAkKCcucG9wdXAnKS5mYWRlT3V0KDUwMCk7XG4gIH0pO1xuXG4gIC8vIMKr0JLQttC1INC80LDRlNGIIFNraW4oSUQpPyDQo9Cy0ZbQudGC0LjCuyDRgyDQv9GA0L7QvNC+LdC60LDRgNGC0YbRliDQutCw0YLQsNC70L7Qs9GDOiDRgtCwINGB0LDQvNCwINGE0L7RgNC80LAsINGJ0L4g0Lkg0L3QsFxuICAvLyAvbG9naW4sINGC0ZbQu9GM0LrQuCDQsiDQv9C+0L/QsNC/0ZYuINCh0LDQvNGDINGE0L7RgNC80YMg0L7QttC40LLQu9GP0ZQgYnVpbGQvc2hvcC9sb2dpbi5qc1xuICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmpzLWxvZ2luLXBvcHVwJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCAkcG9wdXAgPSAkKCcubG9naW4tcG9wdXAnKTtcbiAgICBpZiAoISRwb3B1cC5sZW5ndGgpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9sb2dpbic7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAkcG9wdXAuZmFkZUluKDMwMCk7XG4gICAgJHBvcHVwLmZpbmQoJyNsZy1waG9uZScpLnRyaWdnZXIoJ2ZvY3VzJyk7XG4gIH0pO1xuXG4gIC8vIFByZXZlbnQgcG9wdXAgZnJvbSBjbG9zaW5nIHdoZW4gY2xpY2tpbmcgaW5zaWRlIC5wb3B1cC1jb250ZW50XG4gICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcucG9wdXAtaW5uZXIsIC5wb3B1cF9fd3JhcHBlcicsIChlKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfSk7XG5cbiAgLy8gQ2xlYXIgdGhlIGVycm9yIHN0YXRlIGFzIHNvb24gYXMgdGhlIHVzZXIgc3RhcnRzIGZpeGluZyB0aGUgZW1haWxcbiAgJChkb2N1bWVudCkub24oJ2lucHV0JywgJy5vdXQtb2Ytc3RvY2stZm9ybSAjcG9wdXAtZW1haWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnZXJyb3InKTtcbiAgICAkKHRoaXMpLmNsb3Nlc3QoJy5vdXQtb2Ytc3RvY2stZm9ybScpLmZpbmQoJy5wb3B1cC1mb3JtLWVycm9yJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICB9KTtcblxuICAvLyBIYW5kbGUgb3V0IG9mIHN0b2NrIGZvcm0gc3VibWlzc2lvblxuICAkKGRvY3VtZW50KS5vbignc3VibWl0JywgJy5vdXQtb2Ytc3RvY2stZm9ybScsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGZvcm0gPSAkKHRoaXMpO1xuICAgIGNvbnN0ICRlcnJvciA9IGZvcm0uZmluZCgnLnBvcHVwLWZvcm0tZXJyb3InKTtcblxuICAgIC8vIERvIG5vdCBzZW5kIHRoZSByZXF1ZXN0IHdpdGggYW4gZW1wdHkgLyBpbnZhbGlkIGVtYWlsXG4gICAgY29uc3QgJGVtYWlsID0gZm9ybS5maW5kKCcjcG9wdXAtZW1haWwsIGlucHV0W25hbWU9XCJlbWFpbFwiXScpO1xuICAgIGNvbnN0IGVtYWlsID0gKCRlbWFpbC52YWwoKSB8fCAnJykudHJpbSgpO1xuICAgIGNvbnN0IGVtYWlsRXJyb3IgPSB3aW5kb3cuU2tpbkVtYWlsID8gd2luZG93LlNraW5FbWFpbC5lcnJvcihlbWFpbCkgOiAoL15bQS1aYS16MC05LiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rQFtBLVphLXowLTktXSsoXFwuW0EtWmEtejAtOS1dKykqXFwuW0EtWmEtel17Mix9JC8udGVzdChlbWFpbCkgPyBudWxsIDogJ9CS0LLQtdC00ZbRgtGMINC60L7RgNC10LrRgtC90LjQuSBlbWFpbCcpO1xuICAgIGlmIChlbWFpbEVycm9yKSB7XG4gICAgICAkZW1haWwuYWRkQ2xhc3MoJ2Vycm9yJykudHJpZ2dlcignZm9jdXMnKTtcbiAgICAgICRlcnJvci50ZXh0KGVtYWlsRXJyb3IpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgJGVtYWlsLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xuICAgICRlcnJvci5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICBjb25zdCBmb3JtRGF0YSA9IGZvcm0uc2VyaWFsaXplKCk7XG4gICAgJCgnLnBvcHVwLWZvcm0tYnV0dG9uJykuYWRkQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgICQuYWpheCh7XG4gICAgICB1cmw6ICcvYXBpL2FqYXgvcmVxdWVzdCcsXG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICQoJy5wb3B1cC1mb3JtLWJ1dHRvbicpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgICAgaWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLmRhdGEgPT09ICdzdWNjZXNzJykge1xuICAgICAgICAgIC8vIFNob3cgdGhlIHN1Y2Nlc3Mgc3RhdGUgKC5jb21wbGV0ZWQgZWxlbWVudHMpIHZpYSB0aGUgYHNlbnRgIGNsYXNzXG4gICAgICAgICAgZm9ybS5hZGRDbGFzcygnc2VudCcpO1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgJCgnLm91dC1vZi1zdG9jay1wb3B1cCcpLmZhZGVPdXQoNTAwKTtcbiAgICAgICAgICB9LCAyNTAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkZXJyb3IudGV4dCgn0KHRgtCw0LvQsNGB0Y8g0L/QvtC80LjQu9C60LAuINCh0L/RgNC+0LHRg9C50YLQtSDRidC1INGA0LDQty4nKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBlcnJvcih4aHIpIHtcbiAgICAgICAgJCgnLnBvcHVwLWZvcm0tYnV0dG9uJykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICAgICAgLy8gU2hvdyB0aGUgYmFja2VuZCdzIChsb2NhbGlzZWQpIG1lc3NhZ2Ugb25seSBmb3IgdmFsaWRhdGlvbiBlcnJvcnMgKDR4eCk7XG4gICAgICAgIC8vIGZvciBzZXJ2ZXIvbmV0d29yayBlcnJvcnMgZmFsbCBiYWNrIHRvIGEgZnJpZW5kbHkgbWVzc2FnZS5cbiAgICAgICAgY29uc3QgaXNDbGllbnRFcnJvciA9IHhociAmJiB4aHIuc3RhdHVzID49IDQwMCAmJiB4aHIuc3RhdHVzIDwgNTAwO1xuICAgICAgICBjb25zdCBtc2cgPSAoaXNDbGllbnRFcnJvciAmJiB4aHIucmVzcG9uc2VKU09OICYmIHhoci5yZXNwb25zZUpTT04ubWVzc2FnZSlcbiAgICAgICAgICB8fCAn0KHRgtCw0LvQsNGB0Y8g0L/QvtC80LjQu9C60LAuINCh0L/RgNC+0LHRg9C50YLQtSDRidC1INGA0LDQty4nO1xuICAgICAgICAkZXJyb3IudGV4dChtc2cpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiLyogZ2xvYmFsICQsIHdpbmRvdywgZG9jdW1lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluaXRQcm9kdWN0SW50ZXJhY3Rpb25zKCkge1xuICAvLyBFdmVudCBkZWxlZ2F0aW9uIGZvciBob3ZlciBldmVudHMgb24gcHJvZHVjdHNcbiAgY29uc3QgZGVza3RvcE1xID0gd2luZG93Lm1hdGNoTWVkaWEoJyhtaW4td2lkdGg6IDc2OXB4KScpO1xuXG4gIGZ1bmN0aW9uIGJpbmRQcm9kdWN0SG92ZXIoKSB7XG4gICAgJCgnYm9keScpLm9uKCdtb3VzZWVudGVyLnByb2R1Y3RIb3ZlciBtb3VzZWxlYXZlLnByb2R1Y3RIb3ZlcicsICcucHJvZHVjdCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgY29uc3QgJHByb2R1Y3QgPSAkKHRoaXMpO1xuXG4gICAgICAvLyB0b2dnbGUgLmFjdGl2ZVxuICAgICAgJHByb2R1Y3QudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScsIGV2ZW50LnR5cGUgPT09ICdtb3VzZWVudGVyJyk7XG5cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVuYmluZFByb2R1Y3RIb3ZlcigpIHtcbiAgICAkKCdib2R5Jykub2ZmKCcucHJvZHVjdEhvdmVyJyk7XG4gIH1cblxuICAvLyBMaXN0ZW4gZm9yIGNoYW5nZXMgKGUuZy4gaWYgeW91IHJlc2l6ZSBpbiBkZXZ0b29scylcbiAgZGVza3RvcE1xLmFkZExpc3RlbmVyKChlKSA9PiB7XG4gICAgaWYgKGUubWF0Y2hlcykgYmluZFByb2R1Y3RIb3ZlcigpO1xuICAgIGVsc2UgdW5iaW5kUHJvZHVjdEhvdmVyKCk7XG4gIH0pO1xuXG4gIC8vIFJ1biBvbmNlIG9uIGxvYWRcbiAgaWYgKGRlc2t0b3BNcS5tYXRjaGVzKSB7XG4gICAgYmluZFByb2R1Y3RIb3ZlcigpO1xuICB9XG5cbiAgLy8gVHJ1bmNhdGUgcHJvZHVjdCBkZXNjcmlwdGlvbnNcbiAgJCgnLnByb2R1Y3QtZGVzY3JpcHRpb24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCB0ZXh0ID0gJCh0aGlzKS50ZXh0KCk7XG4gICAgaWYgKHRleHQubGVuZ3RoID4gMTAwKSB7XG4gICAgICBjb25zdCB0cnVuY2F0ZWRUZXh0ID0gYCR7dGV4dC5zbGljZSgwLCAxMDApfS4uLmA7XG4gICAgICAkKHRoaXMpLnRleHQodHJ1bmNhdGVkVGV4dCk7XG4gICAgfVxuICB9KTtcblxuICAvLyBXaXNobGlzdCBmdW5jdGlvbmFsaXR5XG4gICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcucHJvZHVjdC1oZWFydCwud2F5ZngtcHJvZHVjdF9fYWRkaXRpb25hbC0tZm9ybS0tZmF2b3VyaXRlJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCAkaGVhcnQgPSAkKHRoaXMpO1xuICAgIGNvbnN0IHByb2R1Y3RJZCA9ICRoZWFydC5kYXRhKCdpZCcpO1xuICAgIGNvbnN0IHVzZXIgPSAkaGVhcnQuZGF0YSgndXNlcicpO1xuICAgIGNvbnN0IHdpc2hsaXN0VHlwZSA9ICRoZWFydC5kYXRhKCd0eXBlJykgfHwgJ3dpc2hsaXN0JztcbiAgICBjb25zdCBpc0N1cnJlbnRseUFkZGVkID0gJGhlYXJ0Lmhhc0NsYXNzKCdhZGRlZCcpO1xuXG4gICAgaWYodXNlciA9PT0gMCl7XG4gICAgICAkKCcubmVlZC1sb2dpbicpLnNob3coKTtcbiAgICAgICQoJy5uZWVkLWxvZ2luJykuaHRtbCgnPGRpdiBjbGFzcz1cInBvcHVwLWlubmVyXCI+XFxuJyArXG4gICAgICAgICcgICAgPGRpdiBjbGFzcz1cInBvcHVwLWNsb3NlXCI+PC9kaXY+XFxuJyArXG4gICAgICAgICcgICAgPGRpdiBjbGFzcz1cInBvcHVwLW1lc3NhZ2UtdGV4dFwiPlxcbicgK1xuICAgICAgICAnICAgICAgPHNwYW4+XFxuJyArXG4gICAgICAgICcgICAgICAgINCU0L7RgdGC0YPQv9C90LjQuSDQu9C40YjQtSDQtNC70Y8g0LfQsNGA0LXRlNGB0YLRgNC+0LLQsNC90LjRhSDQutC+0YDQuNGB0YLRg9Cy0LDRh9GW0LJcXG4nICtcbiAgICAgICAgJyAgICAgIDwvc3Bhbj5cXG4nICtcbiAgICAgICAgJyAgICAgIDxhIGhyZWY9XCIvcmVnaXN0ZXJcIiBjbGFzcz1cImJ0biBqcy1yZWdpc3Rlci1saW5rXCI+0JfQsNGA0LXRlNGB0YLRgNGD0LLQsNGC0LjRgdGMPC9hPlxcbicgK1xuICAgICAgICAnICAgICAgPGEgaHJlZj1cIi9sb2dpblwiIGNsYXNzPVwiYnRuLXNpbXBsZSBqcy1sb2dpbi1saW5rXCI+0K8g0LLQttC1INC80LDRjiDQsNC60LrQsNGD0L3RgjwvYT5cXG4nICtcbiAgICAgICAgJyAgICA8L2Rpdj5cXG4nICtcbiAgICAgICAgJyAgPC9kaXY+Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghaXNDdXJyZW50bHlBZGRlZCkge1xuICAgICAgLy8gQWRkIHByb2R1Y3QgdG8gd2lzaGxpc3RcbiAgICAgICQuYWpheCh7XG4gICAgICAgIHVybDogYC93aXNobGlzdHMvJHt3aXNobGlzdFR5cGV9L2FkZGAsXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHByb2R1Y3RfaWQ6IFtwcm9kdWN0SWRdLFxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgJGhlYXJ0LmFkZENsYXNzKCdhZGRlZCcpO1xuICAgICAgICAgICQoJyN3aXNoLWNvdW50ZXInKS50ZXh0KHJlc3BvbnNlLmNvdW50KTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnUHJvZHVjdCBhZGRlZCB0byB3aXNobGlzdDonLCByZXNwb25zZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yKHhocikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGFkZGluZyBwcm9kdWN0OicsIHhocik7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmVtb3ZlIHByb2R1Y3QgZnJvbSB3aXNobGlzdFxuICAgICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBgL3dpc2hsaXN0cy8ke3dpc2hsaXN0VHlwZX0vcmVtb3ZlLyR7cHJvZHVjdElkfWAsXG4gICAgICAgIHR5cGU6ICdERUxFVEUnLFxuICAgICAgICBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgJGhlYXJ0LnJlbW92ZUNsYXNzKCdhZGRlZCcpO1xuICAgICAgICAgICQoJyN3aXNoLWNvdW50ZXInKS50ZXh0KHJlc3BvbnNlLmNvdW50KTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnUHJvZHVjdCByZW1vdmVkIGZyb20gd2lzaGxpc3Q6JywgcmVzcG9uc2UpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcih4aHIpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciByZW1vdmluZyBwcm9kdWN0OicsIHhocik7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFJlbW92ZSBwcm9kdWN0IGZyb20gc2hlbGZcbiAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5wcm9kdWN0LXJlbW92ZS1zaGVsZicsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3QgJGhlYXJ0ID0gJCh0aGlzKTtcbiAgICBjb25zdCBwcm9kdWN0SWQgPSAkaGVhcnQuZGF0YSgnaWQnKTtcblxuICAgICQuYWpheCh7XG4gICAgICB1cmw6IGAvd2lzaGxpc3RzL3NoZWxmL3JlbW92ZS8ke3Byb2R1Y3RJZH1gLFxuICAgICAgdHlwZTogJ0RFTEVURScsXG4gICAgICBzdWNjZXNzKCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICB9LFxuICAgICAgZXJyb3IoeGhyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHJlbW92aW5nIHByb2R1Y3Q6JywgeGhyKTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gRGVsaXZlcnkgcG9wdXBcbiAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy53YXlmeC1wcm9kdWN0X19hZGRpdGlvbmFsLS1pbmZvLS1kZXNjcmlwdGlvbi0taXRlbS5kZWxpdmVyeScsIGZ1bmN0aW9uICgpIHtcbiAgICAvLyBTaG93IHRoZSBlbGVtZW50IHNtb290aGx5IG92ZXIgMC41IHNlY29uZHMgKDUwMCBtcylcbiAgICAkKCcuZGVsaXZlcnktcG9wdXAnKS5zaG93KCk7XG4gIH0pO1xuXG4gIC8vIFBhcnRzIHBheSBwb3B1cFxuICBmdW5jdGlvbiBmb3JtYXRVYWhBbW91bnQoYW1vdW50KSB7XG4gICAgcmV0dXJuIFN0cmluZyhhbW91bnQpLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcgJyk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVQYXJ0c1BheVBvcHVwKCkge1xuICAgIGNvbnN0ICRwb3B1cCA9ICQoJy5wYXJ0cy1wYXktcG9wdXAnKTtcbiAgICBjb25zdCBwcmljZSA9IHBhcnNlSW50KCRwb3B1cC5maW5kKCcuY2hvb3NlLWJhbmsnKS5kYXRhKCdwcmljZScpLCAxMCk7XG5cbiAgICBpZiAoIXByaWNlKSByZXR1cm47XG5cbiAgICAkcG9wdXAuZmluZCgnLmNob29zZS1iYW5rIC5yb3cnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0ICRyb3cgPSAkKHRoaXMpO1xuICAgICAgY29uc3QgbW9udGhzID0gcGFyc2VJbnQoJHJvdy5maW5kKCdzZWxlY3QnKS52YWwoKSwgMTApIHx8IDM7XG4gICAgICBjb25zdCBtb250aGx5ID0gTWF0aC5jZWlsKHByaWNlIC8gbW9udGhzKTtcblxuICAgICAgJHJvdy5maW5kKCcuZm9yLW1vbnRoJykudGV4dChgJHtmb3JtYXRVYWhBbW91bnQobW9udGhseSl94oK0L9C80ZbRgWApO1xuXG4gICAgICBpZiAoJHJvdy5maW5kKCdpbnB1dFtuYW1lPVwiYmFua1wiXScpLnByb3AoJ2NoZWNrZWQnKSkge1xuICAgICAgICAkcG9wdXAuZmluZCgnLnBhcnRzLXBheS1wb3B1cF9fZm9vdGVyIC5tb250aGx5LXByaWNlJykudGV4dChgJHtmb3JtYXRVYWhBbW91bnQobW9udGhseSl9IOKCtGApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgJChkb2N1bWVudCkub24oJ2NoYW5nZScsICcucGFydHMtcGF5LXBvcHVwIC5jaG9vc2UtYmFuayBzZWxlY3QsIC5wYXJ0cy1wYXktcG9wdXAgLmNob29zZS1iYW5rIGlucHV0W25hbWU9XCJiYW5rXCJdJywgdXBkYXRlUGFydHNQYXlQb3B1cCk7XG5cbiAgLy8gQSBwcm9kdWN0IHBhZ2UgY2FycmllcyBzZXZlcmFsIC5zeWxpdXMtcHJvZHVjdC1hZGRpbmctdG8tY2FydCBmb3JtcyDigJQgdGhlXG4gIC8vIG1haW4gcGFuZWwsIHRoZSBzdGlja3kgcGFuZWwgYW5kIGV2ZXJ5IHJlbGF0ZWQtcHJvZHVjdCBjYXJkIHJlbmRlciBvbmUg4oCUIHNvXG4gIC8vIHRoZSBwb3B1cCBrZWVwcyBhIHJlZmVyZW5jZSB0byB0aGUgZm9ybSBpdCB3YXMgb3BlbmVkIGZyb20uIFN1Ym1pdHRpbmcgdGhlXG4gIC8vIHdob2xlIHNldCBhZGRlZCB0aGUgcHJvZHVjdCB0d2ljZSBhbmQgZHJvcHBlZCB0aGUgcmVsYXRlZCBwcm9kdWN0cyBpbnRvIHRoZVxuICAvLyBjYXJ0IGFzIHdlbGwuXG4gIGxldCAkcGFydHNQYXlGb3JtID0gJCgpO1xuXG4gIGZ1bmN0aW9uIG1haW5Qcm9kdWN0Rm9ybSgkb3BlbmVyKSB7XG4gICAgY29uc3QgJHNjb3BlZCA9ICRvcGVuZXJcbiAgICAgIC5jbG9zZXN0KCcucHJvZHVjdC1mb3JtLXBhbmVsLCAucHJvZHVjdC1zdGlja3ktcGFuZWwnKVxuICAgICAgLmZpbmQoJy5zeWxpdXMtcHJvZHVjdC1hZGRpbmctdG8tY2FydCcpXG4gICAgICAuZmlyc3QoKTtcblxuICAgIGlmICgkc2NvcGVkLmxlbmd0aCkgcmV0dXJuICRzY29wZWQ7XG5cbiAgICByZXR1cm4gJCgnLnByb2R1Y3QtZm9ybS1wYW5lbCAuc3lsaXVzLXByb2R1Y3QtYWRkaW5nLXRvLWNhcnQnKS5maXJzdCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFydHNQYXlUYXJnZXRGb3JtKCkge1xuICAgIGlmICgkcGFydHNQYXlGb3JtLmxlbmd0aCAmJiAkLmNvbnRhaW5zKGRvY3VtZW50LCAkcGFydHNQYXlGb3JtWzBdKSkge1xuICAgICAgcmV0dXJuICRwYXJ0c1BheUZvcm07XG4gICAgfVxuXG4gICAgcmV0dXJuICQoJy5wcm9kdWN0LWZvcm0tcGFuZWwgLnN5bGl1cy1wcm9kdWN0LWFkZGluZy10by1jYXJ0JykuZmlyc3QoKTtcbiAgfVxuXG4gIC8vIFwi0J7RhNC+0YDQvNC40YLQuCDQt9Cw0LzQvtCy0LvQtdC90L3Rj1wiOiByZW1lbWJlciB0aGUgY2hvc2VuIGJhbmsgKHBheW1lbnQgbWV0aG9kIGNvZGUpIHNvIHRoZVxuICAvLyBjaGVja291dCBwYWdlIGNhbiBwcmVzZWxlY3QgaXQsIGFkZCB0aGUgcHJvZHVjdCB0byB0aGUgY2FydCBhbmQgc2VuZCB0aGVcbiAgLy8gY3VzdG9tZXIgdG8gdGhlIGNhcnQgcGFnZSAoc2VlIHRoZSBzdWJtaXQgaGFuZGxlciBpbiBjYXJ0LmpzKS5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5wYXJ0cy1wYXktcG9wdXBfX2Zvb3RlciAuYnRuJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCAkZm9ybSA9IHBhcnRzUGF5VGFyZ2V0Rm9ybSgpO1xuICAgIGlmICghJGZvcm0ubGVuZ3RoKSByZXR1cm47XG5cbiAgICBjb25zdCAkYmFuayA9ICQoJy5wYXJ0cy1wYXktcG9wdXAgLmNob29zZS1iYW5rIGlucHV0W25hbWU9XCJiYW5rXCJdOmNoZWNrZWQnKTtcbiAgICBjb25zdCBiYW5rID0gJGJhbmsudmFsKCk7XG4gICAgaWYgKGJhbmspIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdpbnN0YWxsbWVudEJhbmsnLCBiYW5rKTtcbiAgICAgIC8vINGA0LDQt9C+0Lwg0ZbQtyDQsdCw0L3QutC+0Lwg0L/QtdGA0LXQvdC+0YHQuNC80L4g0L3QsCDRh9C10LrQsNGD0YIg0ZYg0L7QsdGA0LDQvdGDINC60ZbQu9GM0LrRltGB0YLRjCDQv9C70LDRgtC10LbRltCyXG4gICAgICBjb25zdCBwYXJ0cyA9ICRiYW5rLmNsb3Nlc3QoJy5yb3cnKVxuICAgICAgICAuZmluZCgnLnNlbGVjdC1ob2xkZXIgc2VsZWN0JylcbiAgICAgICAgLnZhbCgpO1xuICAgICAgaWYgKHBhcnRzKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdpbnN0YWxsbWVudFBhcnRzJywgcGFydHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2luc3RhbGxtZW50UGFydHMnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkZm9ybS5kYXRhKCdnb1RvQ2FydCcsIHRydWUpLnRyaWdnZXIoJ3N1Ym1pdCcpO1xuICB9KTtcblxuICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnByb2R1Y3QtZm9ybS1wYW5lbCAuYnRuLXBhcnQsIC53YXlmeC1wcm9kdWN0X19hZGRpdGlvbmFsLS1pbmZvLS1kZXNjcmlwdGlvbi0taXRlbS5wYXJ0cy1wYXknLCBmdW5jdGlvbiAoZSkge1xuICAgIC8vIFNob3cgdGhlIGVsZW1lbnQgc21vb3RobHkgb3ZlciAwLjUgc2Vjb25kcyAoNTAwIG1zKVxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAkcGFydHNQYXlGb3JtID0gbWFpblByb2R1Y3RGb3JtKCQodGhpcykpO1xuICAgIHVwZGF0ZVBhcnRzUGF5UG9wdXAoKTtcbiAgICAkKCcucGFydHMtcGF5LXBvcHVwJykuc2hvdygpO1xuICB9KTtcblxuICAvLyBIb3dlIHRvIHVzZSBwb3B1cFxuICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmhvdy10by11c2VfX2J1dHRvbicsIGZ1bmN0aW9uIChlKSB7XG4gICAgLy8gU2hvdyB0aGUgZWxlbWVudCBzbW9vdGhseSBvdmVyIDAuNSBzZWNvbmRzICg1MDAgbXMpXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIC8vIEVhY2ggYnV0dG9uIG9wZW5zIGl0cyBvd24gcG9wdXAsIHRhcmdldGVkIHZpYSB0aGUgZGF0YS1wb3B1cCBzZWxlY3RvclxuICAgIC8vIChyZWFkIHdpdGggYXR0cigpIHNvIGF0dHJpYnV0ZSBzZWxlY3RvcnMgbGlrZSBbZGF0YS1wb3B1cC1pZD1cIi4uLlwiXSBhcmVcbiAgICAvLyByZXR1cm5lZCB2ZXJiYXRpbSBhbmQgbm90IHBhcnNlZCBhcyBKU09OIGJ5IGpRdWVyeS5kYXRhKCkpLlxuICAgIGNvbnN0IHRhcmdldCA9ICQodGhpcykuYXR0cignZGF0YS1wb3B1cCcpIHx8ICcuaG93LXRvLXVzZV9fcG9wdXAtLTEnO1xuICAgICQodGFyZ2V0KS5zaG93KCk7XG4gIH0pO1xuXG4gIC8vIERldGFpbHMgcG9wdXBcbiAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5kZXRhaWxzLWJveF9fb3BlbmVyJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgLy8gRWFjaCBpdGVtIG9wZW5zIGl0cyBvd24gcG9wdXAsIHRhcmdldGVkIHZpYSB0aGUgZGF0YS1wb3B1cCBzZWxlY3RvclxuICAgIC8vIChyZWFkIHdpdGggYXR0cigpIHNvIGF0dHJpYnV0ZSBzZWxlY3RvcnMgbGlrZSBbZGF0YS1wb3B1cC1pZD1cIi4uLlwiXSBhcmVcbiAgICAvLyByZXR1cm5lZCB2ZXJiYXRpbSBhbmQgbm90IHBhcnNlZCBhcyBKU09OIGJ5IGpRdWVyeS5kYXRhKCkpLiBJdGVtcyB3aXRob3V0XG4gICAgLy8gYSBkYXRhLXBvcHVwIGF0dHJpYnV0ZSBhcmUgaW5lcnQuXG4gICAgY29uc3QgdGFyZ2V0ID0gJCh0aGlzKS5hdHRyKCdkYXRhLXBvcHVwJyk7XG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgJCh0YXJnZXQpLnNob3coKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIGNlcnRpZmFjYXRpb25zIHBvcHVwXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuY2VydGlmaWNhdGlvbi1ibG9ja19fYnV0dG9uJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgLy8gRWFjaCBpdGVtIG9wZW5zIGl0cyBvd24gcG9wdXAsIHRhcmdldGVkIHZpYSB0aGUgZGF0YS1wb3B1cCBzZWxlY3RvclxuICAgIC8vIChyZWFkIHdpdGggYXR0cigpIHNvIGF0dHJpYnV0ZSBzZWxlY3RvcnMgbGlrZSBbZGF0YS1wb3B1cC1pZD1cIi4uLlwiXSBhcmVcbiAgICAvLyByZXR1cm5lZCB2ZXJiYXRpbSBhbmQgbm90IHBhcnNlZCBhcyBKU09OIGJ5IGpRdWVyeS5kYXRhKCkpLiBJdGVtcyB3aXRob3V0XG4gICAgLy8gYSBkYXRhLXBvcHVwIGF0dHJpYnV0ZSBhcmUgaW5lcnQuXG4gICAgY29uc3QgdGFyZ2V0ID0gJCh0aGlzKS5hdHRyKCdkYXRhLXBvcHVwJyk7XG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgJCh0YXJnZXQpLnNob3coKTtcbiAgICB9XG4gIH0pO1xufVxuIiwiLyogZ2xvYmFsICQsIHdpbmRvdyAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW5pdFNsaWRlcnMoKSB7XG4gIC8vIENvb3BlcmF0aW9uIHNsaWRlclxuICAkKCcuY29vcGVyYXRpb24tbGlzdCcpLnNsaWNrKHtcbiAgICBzbGlkZXNUb1Nob3c6IDMsXG4gICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgcGF1c2VPbkZvY3VzOiBmYWxzZSxcbiAgICBwYXVzZU9uSG92ZXI6IHRydWUsXG4gICAgY3NzRWFzZTogJ2xpbmVhcicsXG4gICAgYXV0b3BsYXk6IHRydWUsXG4gICAgYXV0b3BsYXlTcGVlZDogMTUsXG4gICAgaW5maW5pdGU6IHRydWUsXG4gICAgc3BlZWQ6IDE1MDAwLFxuICAgIGFycm93czogZmFsc2UsXG4gICAgY2VudGVyTW9kZTogZmFsc2UsXG4gICAgbG9vcDogdHJ1ZSxcbiAgICByZXNwb25zaXZlOiBbXG4gICAgICB7XG4gICAgICAgIGJyZWFrcG9pbnQ6IDEwMjQsXG4gICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgc2xpZGVzVG9TaG93OiAyLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcblxuICBpZiAod2luZG93LmlubmVyV2lkdGggPD0gNzY3KSB7XG4gICAgJCgnLmJ1dHRvbnNfbGlzdCcpLnNsaWNrKHtcbiAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgIGF1dG9wbGF5OiB0cnVlLFxuICAgICAgZmFkZTogdHJ1ZSxcbiAgICAgIGRvdHM6IHRydWUsXG4gICAgfSk7XG4gIH1cbiAgLy8gQmVuZWZpdHMgc2xpZGVyXG4gIC8vICQoJy5iZW5lZml0cy1pdGVtJykuc2xpY2soe1xuICAvLyAgIHNsaWRlc1RvU2hvdzogMSxcbiAgLy8gICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgLy8gICBhcnJvd3M6IGZhbHNlLFxuICAvLyAgIGF1dG9wbGF5OiB0cnVlLFxuICAvLyAgIGZhZGU6IHRydWUsXG4gIC8vICAgaW5maW5pdGU6IHRydWUsXG4gIC8vICAgYXNOYXZGb3I6ICcuYmVuZWZpdHMtaXRlbS1yaWdodCcsXG4gIC8vIH0pO1xuICAvL1xuICAvLyAkKCcuYmVuZWZpdHMtaXRlbS1yaWdodCcpLnNsaWNrKHtcbiAgLy8gICBzbGlkZXNUb1Nob3c6IDEsXG4gIC8vICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gIC8vICAgYXNOYXZGb3I6ICcuYmVuZWZpdHMtaXRlbScsXG4gIC8vICAgZG90czogdHJ1ZSxcbiAgLy8gICBhdXRvcGxheTogdHJ1ZSxcbiAgLy8gICBpbmZpbml0ZTogdHJ1ZSxcbiAgLy8gICByZXNwb25zaXZlOiBbXG4gIC8vICAgICB7XG4gIC8vICAgICAgIGJyZWFrcG9pbnQ6IDEwMjQsXG4gIC8vICAgICAgIHNldHRpbmdzOiB7XG4gIC8vICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgLy8gICAgICAgfSxcbiAgLy8gICAgIH0sXG4gIC8vICAgXSxcbiAgLy8gfSk7XG5cbiAgLy8gTmV3IHByb2R1Y3RzIHNsaWRlclxuICAkKCcubmV3LWxpc3QnKS5zbGljayh7XG4gICAgc2xpZGVzVG9TaG93OiAzLFxuICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgIGluZmluaXRlOiB0cnVlLFxuICAgIGRvdHM6IHRydWUsXG4gICAgcmVzcG9uc2l2ZTogW1xuICAgICAge1xuICAgICAgICBicmVha3BvaW50OiAxMjAwLFxuICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgIHNsaWRlc1RvU2hvdzogMixcbiAgICAgICAgICBhcnJvd3M6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYnJlYWtwb2ludDogMTAyNCxcbiAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG5cbiAgLy8gUHJvbW8gc2xpZGVyXG4gICQoJy5wcm9tby1saXN0Jykuc2xpY2soe1xuICAgIHNsaWRlc1RvU2hvdzogMyxcbiAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICBpbmZpbml0ZTogdHJ1ZSxcbiAgICBkb3RzOiB0cnVlLFxuICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgIHtcbiAgICAgICAgYnJlYWtwb2ludDogMTIwMCxcbiAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICBzbGlkZXNUb1Nob3c6IDIsXG4gICAgICAgICAgYXJyb3dzOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJyZWFrcG9pbnQ6IDEwMjQsXG4gICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xuXG4gIC8vIEFkZCBtYXJnaW4gdG8gc2xpY2sgZG90c1xuICBjb25zdCAkZG90cyA9ICQoJy5zbGljay1kb3RzJyk7XG5cbiAgJGRvdHMuZmlyc3QoKS5jc3MoJ2JvdHRvbScsICcxNTBweCcpO1xuICAkZG90cy5sYXN0KCkuY3NzKCdib3R0b20nLCAnMTUwcHgnKTtcblxuICAvLyBSZWxhdGVkIHByb2R1Y3RzIHNsaWRlclxuICAkKCcucmVsYXRlZC1ib3hfX2xpc3QnKS5zbGljayh7XG4gICAgc2xpZGVzVG9TaG93OiA0LFxuICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgIGluZmluaXRlOiB0cnVlLFxuICAgIGRvdHM6IGZhbHNlLFxuICAgIGFycm93czogdHJ1ZSxcbiAgICByZXNwb25zaXZlOiBbXG4gICAgICB7XG4gICAgICAgIGJyZWFrcG9pbnQ6IDEwMjQsXG4gICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgc2xpZGVzVG9TaG93OiAyLFxuICAgICAgICAgIGFycm93czogZmFsc2UsXG4gICAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgICBhcHBlbmREb3RzOiAkKCcucmVsYXRlZC1ib3hfX2RvdHMnKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG59XG4iLCIvKiBnbG9iYWwgJCwgZG9jdW1lbnQgKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluaXRVSSgpIHtcbiAgLy8gQWRkaXRpb25hbCBidXR0b24gZnVuY3Rpb25hbGl0eVxuICAkKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XG4gICAgY29uc3QgJGJ0biA9ICQoJyNhZGRpdGlvbmFsQnV0dG9uJyk7XG4gICAgY29uc3QgJGVsZW1lbnRzID0gJCgnLmFkZGl0aW9uYWwtZGVzY3JpcHRpb24sIC5hZGRpdGlvbmFsLWl0ZW06bnRoLWNoaWxkKDIpJyk7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVCdXR0b24oKSB7XG4gICAgICBjb25zdCBleHBhbmRlZCA9ICRlbGVtZW50cy5maXJzdCgpLmhhc0NsYXNzKCdhY3RpdmUnKTtcbiAgICAgICRidG4udGV4dChleHBhbmRlZCA/ICfQl9Cz0L7RgNC90YPRgtC4JyA6ICfQoNC+0LfQs9C+0YDQvdGD0YLQuCcpO1xuICAgIH1cblxuICAgIC8vIENsaWNrIGhhbmRsZXJcbiAgICAkYnRuLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgICRlbGVtZW50cy50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gICAgICB1cGRhdGVCdXR0b24oKTtcbiAgICB9KTtcblxuICAgIC8vIEluaXRpYWxpemUgb24gc3RhcnRcbiAgICB1cGRhdGVCdXR0b24oKTtcbiAgfSk7XG5cbiAgLy8gTG9naW4gZm9ybSBpbnB1dCBoYW5kbGluZ1xuICAkKCcubG9naW4tZm9ybS1pbnB1dCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0ICRpbnB1dCA9ICQodGhpcyk7XG4gICAgY29uc3QgdXBkYXRlID0gKCkgPT4ge1xuICAgICAgJGlucHV0LnRvZ2dsZUNsYXNzKCdmaWxsZWQnLCAkaW5wdXQudmFsKCkubGVuZ3RoID4gMCk7XG4gICAgfTtcbiAgICAkaW5wdXQub24oJ2lucHV0IGNoYW5nZScsIHVwZGF0ZSk7XG4gICAgdXBkYXRlKCk7XG4gIH0pO1xuXG4gIC8vIEFjY29yZGlvbiBmdW5jdGlvbmFsaXR5XG4gICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuYWNjb3JkaW9uLWRldGFpbHMnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICBjb25zdCAkZGV0YWlscyA9ICQodGhpcyk7XG4gICAgY29uc3QgJGl0ZW0gPSAkZGV0YWlscy5wYXJlbnQoKTtcbiAgICBjb25zdCAkY29udGVudCA9ICRkZXRhaWxzLm5leHQoJy5hY2NvcmRpb24tY29udGVudCcpO1xuXG4gICAgY29uc3QgaXNJbnNpZGVWaWV3U3RlcHMgPSAkZGV0YWlscy5jbG9zZXN0KCcudmlldy1zdGVwc19fZGF0YSAuaXRlbSwgLmFjY29yZGlvbl9fZGVmYXVsdCcpLmxlbmd0aDtcblxuICAgIGlmICghaXNJbnNpZGVWaWV3U3RlcHMpIHtcblxuICAgICAgaWYgKCRpdGVtLmhhc0NsYXNzKCdvcGVuJykpIHtcbiAgICAgICAgJGl0ZW0ucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgJGNvbnRlbnQuc3RvcCh0cnVlLCB0cnVlKS5zbGlkZVVwKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkaXRlbS5hZGRDbGFzcygnb3BlbicpO1xuICAgICAgICAkY29udGVudC5zdG9wKHRydWUsIHRydWUpLnNsaWRlRG93bigpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgJHBhcmVudEl0ZW0gPSAkZGV0YWlscy5jbG9zZXN0KCcudmlldy1zdGVwc19fZGF0YSAuaXRlbSwgLmFjY29yZGlvbl9fZGVmYXVsdCcpO1xuICAgIGNvbnN0ICRhY2NvcmRpb25zID0gJHBhcmVudEl0ZW0uZmluZCgnLmFjY29yZGlvbi13cmFwcGVyJyk7XG5cbiAgICAkYWNjb3JkaW9ucy5ub3QoJGl0ZW0pLnJlbW92ZUNsYXNzKCdvcGVuJylcbiAgICAuZmluZCgnLmFjY29yZGlvbi1jb250ZW50JylcbiAgICAuc3RvcCh0cnVlLCB0cnVlKVxuICAgIC5zbGlkZVVwKCk7XG5cbiAgICBpZiAoJGl0ZW0uaGFzQ2xhc3MoJ29wZW4nKSkge1xuICAgICAgJGl0ZW0ucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICRjb250ZW50LnN0b3AodHJ1ZSwgdHJ1ZSkuc2xpZGVVcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkaXRlbS5hZGRDbGFzcygnb3BlbicpO1xuICAgICAgJGNvbnRlbnQuc3RvcCh0cnVlLCB0cnVlKS5zbGlkZURvd24oKTtcbiAgICB9XG5cbiAgfSk7XG5cbiAgLy8gU21vb3RoIHNjcm9sbGluZyBmb3IgYW5jaG9yIGxpbmtzXG4gICQoJ2FbaHJlZl49XCIjXCJdJykub24oJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgaHJlZiA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG5cbiAgICAvLyBTa2lwIGlmIGhyZWYgaXMganVzdCBcIiNcIiB0byBhdm9pZCBqUXVlcnkgc2VsZWN0b3IgZXJyb3JcbiAgICBpZiAoaHJlZiA9PT0gJyMnKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRhcmdldCA9ICQoaHJlZik7XG5cbiAgICBpZiAodGFyZ2V0Lmxlbmd0aCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgICAgc2Nyb2xsVG9wOiB0YXJnZXQub2Zmc2V0KCkudG9wIC0gMTYwLCAvLyBPZmZzZXQgZnJvbSB0b3BcbiAgICAgIH0sIDYwMCk7IC8vIEFuaW1hdGlvbiBkdXJhdGlvbiAobXMpXG4gICAgfVxuICB9KTtcblxuICAvLyBTYW1wbGUgc2lkZWJhciBmdW5jdGlvbmFsaXR5XG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljaycsICcuc2FtcGxlLXNpZGViYXItaGVhZGVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgJHNlY3Rpb24gPSAkKHRoaXMpLmNsb3Nlc3QoJy5zYW1wbGUtc2lkZWJhci1zZWN0aW9uJyk7XG4gICAgICBpZiAoISRzZWN0aW9uLmxlbmd0aCkgcmV0dXJuOyAvLyDQtNC+0LTQsNGC0LrQvtCy0LAg0L/QtdGA0LXQstGW0YDQutCwLCDRhdC+0YfQsCBjbG9zZXN0INC90LUg0LfQvdCw0LnQtNC1INC90ZbRh9C+0LPQvlxuXG4gICAgICAvLyDQl9C90LDRhdC+0LTQuNC80L4g0LrQvtC90YLQtdC90YIg0ZYg0L/QtdGA0LXQutC70Y7Rh9Cw0ZTQvNC+INGB0YLQsNC9XG4gICAgICAkc2VjdGlvbi50b2dnbGVDbGFzcygnb3BlbicpO1xuICAgIH0pO1xuXG4gIC8vIEZvb3RlciBhY2NvcmRpb24gZnVuY3Rpb25hbGl0eVxuICBjb25zdCBmb290ZXJFbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mb290ZXItbGlzdC1pbm5lcicpO1xuXG4gIC8vIEZ1bmN0aW9uIHRvIHVwZGF0ZSBoZWlnaHRcbiAgZnVuY3Rpb24gdXBkYXRlSGVpZ2h0KGVsZW1lbnQpIHtcbiAgICBjb25zdCBlbCA9IGVsZW1lbnQ7IC8vIENyZWF0ZSBhIGxvY2FsIHZhcmlhYmxlIHRvIGF2b2lkIHJlYXNzaWduaW5nIHBhcmFtZXRlclxuICAgIGlmIChlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICBjb25zdCBjaGlsZHJlbkNvdW50ID0gZWwuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgY29uc3QgbmV3SGVpZ2h0ID0gNTAgKyAoY2hpbGRyZW5Db3VudCAtIDEpICogMzk7XG4gICAgICBlbC5zdHlsZS5oZWlnaHQgPSBgJHtuZXdIZWlnaHR9cHhgO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICB9XG4gIH1cblxuICAvLyBBZGQgZXZlbnQgaGFuZGxlciB0byBlYWNoIGVsZW1lbnRcbiAgZm9vdGVyRWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAvLyBUb2dnbGUgJ2FjdGl2ZScgY2xhc3MgZm9yICdmb290ZXItbGlzdC1pbm5lcidcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG5cbiAgICAgIC8vIEZpbmQgY2hpbGQgZWxlbWVudCB3aXRoIGNsYXNzICdmb290ZXItaXRlbS1pbm5lcidcbiAgICAgIGNvbnN0IGlubmVySXRlbSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignLmZvb3Rlci1pdGVtLWlubmVyJyk7XG5cbiAgICAgIC8vIElmIGVsZW1lbnQgaXMgZm91bmQsIHRvZ2dsZSAnYWN0aXZlJyBjbGFzcyBmb3IgaXRcbiAgICAgIGlmIChpbm5lckl0ZW0pIHtcbiAgICAgICAgaW5uZXJJdGVtLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuICAgICAgfVxuXG4gICAgICAvLyBVcGRhdGUgaGVpZ2h0IGFmdGVyIGNsYXNzIGNoYW5nZVxuICAgICAgdXBkYXRlSGVpZ2h0KGVsZW1lbnQpO1xuICAgIH0pO1xuICB9KTtcbn1cbiJdLCJuYW1lcyI6WyJlbWFpbFZhbGlkYXRpb24iLCIkIiwib24iLCJlIiwicHJldmVudERlZmF1bHQiLCIkZXJyb3JFbGVtZW50IiwiJGVtYWlsSW5wdXQiLCJlbWFpbFJlZ2V4IiwidGVzdCIsInZhbCIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJhamF4IiwidXJsIiwibWV0aG9kIiwiZGF0YSIsImVtYWlsIiwic3VjY2VzcyIsInJlc3BvbnNlIiwiY29uc29sZSIsImxvZyIsImhpZGUiLCJzaG93IiwiZXJyb3IiLCJqcVhIUiIsInRleHRTdGF0dXMiLCJlcnJvclRocm93biIsInRleHQiLCJsYXp5TG9hZEltYWdlcyIsInJvb3QiLCJkb2N1bWVudCIsInNlbGVjdG9yIiwiaW1hZ2VzIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJpbWciLCJzZXRBdHRyaWJ1dGUiLCJjcmVhdGVMYXp5TG9hZE9ic2VydmVyIiwiY2FsbGJhY2siLCJvcHRpb25zIiwiZGVmYXVsdE9wdGlvbnMiLCJyb290TWFyZ2luIiwidGhyZXNob2xkIiwibWVyZ2VkT3B0aW9ucyIsIl9vYmplY3RTcHJlYWQiLCJJbnRlcnNlY3Rpb25PYnNlcnZlciIsImVudHJpZXMiLCJvYnNlcnZlciIsImVudHJ5IiwiaXNJbnRlcnNlY3RpbmciLCJ0YXJnZXQiLCJvYnNlcnZlRWxlbWVudHMiLCJlbGVtZW50cyIsImxvYWRDYWxsYmFjayIsIm9icyIsInVub2JzZXJ2ZSIsImVsIiwib2JzZXJ2ZSIsIkJSQU5EX1JFIiwiU0tJUF9UQUdTIiwiU2V0Iiwic2hvdWxkU2tpcCIsIm5vZGUiLCJwYXJlbnRFbGVtZW50IiwiaGFzIiwidGFnTmFtZSIsImlzQ29udGVudEVkaXRhYmxlIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJ3cmFwVGV4dE5vZGUiLCJub2RlVmFsdWUiLCJsYXN0SW5kZXgiLCJmcmFnIiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsImxhc3QiLCJtIiwiZXhlYyIsImluZGV4IiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVUZXh0Tm9kZSIsInNsaWNlIiwiYnJhbmQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwidGFnIiwidGV4dENvbnRlbnQiLCJhcHBlbmQiLCJzdWJzdHIiLCJsZW5ndGgiLCJwYXJlbnROb2RlIiwicmVwbGFjZUNoaWxkIiwiVEFHX1JFIiwiVEFJTF9SRSIsIndyYXBTcGxpdEJyYW5kIiwiZW1zIiwibm9kZVR5cGUiLCJOb2RlIiwiRUxFTUVOVF9OT0RFIiwicHVzaCIsImVtIiwicHJldiIsInByZXZpb3VzU2libGluZyIsIlRFWFRfTk9ERSIsInRyaW0iLCJmaXJzdENoaWxkIiwibWF0Y2giLCJoZWFkIiwidHJpbUVuZCIsInJlbW92ZSIsImluc2VydEJlZm9yZSIsImFkZCIsInByb2Nlc3NUcmVlIiwid2Fsa2VyIiwiY3JlYXRlVHJlZVdhbGtlciIsIk5vZGVGaWx0ZXIiLCJTSE9XX1RFWFQiLCJub2RlcyIsIm5leHROb2RlIiwiY3VycmVudE5vZGUiLCJuIiwic2tpbkJyYW5kIiwiYm9keSIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJtdSIsImFkZGVkTm9kZXMiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwiaGVhZGVyIiwiaW5pdFNsaWRlcnMiLCJpbml0UHJvZHVjdEludGVyYWN0aW9ucyIsImluaXRDYXJ0RnVuY3Rpb25hbGl0eSIsImluaXRQb3B1cHMiLCJpbml0VUkiLCJpbml0TW9iaWxlTWVudSIsImxhenlJbWFnZXMiLCJhZGRFdmVudExpc3RlbmVyIiwibGF6eUNvbXBvbmVudHMiLCJpbml0IiwiY29tcG9uZW50IiwiZ2V0U2x1Z0Zyb21QYXRoIiwicGFydHMiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwic3BsaXQiLCJmaWx0ZXIiLCJCb29sZWFuIiwiYWRkUmVkaXJlY3RQYXJhbSIsImhyZWYiLCJyZWRpcmVjdFZhbHVlIiwiVVJMIiwib3JpZ2luIiwic2VhcmNoUGFyYW1zIiwic2V0Iiwic2VhcmNoIiwiaGFzaCIsImxpbmsiLCJjbG9zZXN0IiwiYmFzZUhyZWYiLCJnZXRBdHRyaWJ1dGUiLCJzbHVnIiwiUk9PVF9DTEFTUyIsIm1hcmtJbnRlcmFjdGVkT25jZSIsImRvY3VtZW50RWxlbWVudCIsImNsZWFudXBJbnRlcmFjdGlvbkxpc3RlbmVycyIsImludGVyYWN0aW9uRXZlbnRzIiwicGFzc2l2ZSIsInNldHVwSW50ZXJhY3Rpb25MaXN0ZW5lcnMiLCJldnQiLCJmbiIsIm9wdCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJidG4iLCJlbmNvZGVkIiwiZGF0YXNldCIsImF0b2IiLCJlcnIiLCJrZXkiLCJldmVudCIsImZvcm0iLCJmb3JtRGF0YSIsInNlcmlhbGl6ZSIsInN1Ym1pdEJ1dHRvbiIsImZpbmQiLCJnb1RvQ2FydCIsInJlbW92ZURhdGEiLCJoYXNDbGFzcyIsImF0dHIiLCJ0eXBlIiwidXBkYXRlQ291bnRDdXJ0IiwiY291bnQiLCJwcm9kdWN0TmFtZSIsImlkIiwicHJpY2VSYXciLCJ0YXhvbk5hbWUiLCJ2YXJpYW50TmFtZSIsIiRpbnB1dCIsIiRsYmwiLCIkYnRuIiwicHJpY2UiLCJwYXJzZUZsb2F0IiwicmVwbGFjZSIsInByb2R1Y3RNb2RhbENhcnQiLCJnb29nbGVBZGRUb0NhcnQiLCJ1cGRhdGVDYXJ0RGlzcGxheSIsInNldFRpbWVvdXQiLCJ4aHIiLCJfeGhyJHJlc3BvbnNlSlNPTiIsImVyck1zZyIsInN0YXR1cyIsInJlc3BvbnNlSlNPTiIsImVycm9ycyIsIl9lJGZvcm0iLCJBcnJheSIsImlzQXJyYXkiLCIkcG9wdXAiLCJjb21wbGV0ZSIsImNvbnRhaW5lciIsImdldEVsZW1lbnRCeUlkIiwiY3NzIiwiaXRlbSIsInByb2R1Y3RIdG1sIiwidGl0bGUiLCJpbm5lckhUTUwiLCJpdGVtVmFyaWFudCIsInVuZGVmaW5lZCIsImVjb21tZXJjZUV2ZW50IiwiZWNvbW1lcmNlIiwiY3VycmVuY3kiLCJ2YWx1ZSIsIml0ZW1zIiwiaXRlbV9uYW1lIiwiaXRlbV9pZCIsIml0ZW1fY2F0ZWdvcnkiLCJpdGVtX2NhdGVnb3J5MiIsIml0ZW1fdmFyaWFudCIsIml0ZW1fYnJhbmQiLCJxdWFudGl0eSIsImRhdGFMYXllciIsIiRjb3VudCIsInN1Ym1pdCIsImZhZGVJbiIsImZhZGVPdXQiLCJhbGVydCIsInVwZGF0ZUNhcnREaXNwbGF5MiIsImRhdGFUeXBlIiwiaHRtbCIsInJlbmRlckNhcnRTdW1tYXJ5IiwidG90YWwiLCJpcyIsImNsaWNrIiwicGFpbnRDYXJ0Iiwic2VlbiIsImZpcnN0IiwiZWFjaCIsImhhZEl0ZW1zIiwic2l6ZSIsIiRlbCIsImlzR2lmdCIsInByb2dyZXNCYXIiLCJpbml0U2FtcGxlUmVmdXNlIiwic3luY0dpZnRCYWRnZSIsInN5bmNHaWZ0Q3RhIiwidHJpZ2dlciIsImxlZnQiLCJwYXJzZUludCIsIiRiYWRnZSIsInRvZ2dsZUNsYXNzIiwiTnVtYmVyIiwiaXNOYU4iLCJnZXQiLCJvZmZzZXRXaWR0aCIsInNrUmVmcmVzaENhcnQiLCJzaWxlbnQiLCJjYXJ0SGFzQ29udGVudCIsIiRwcm9ncmVzc0Jsb2NrcyIsIiRob2xkZXIiLCJwYXJzZU51bWJlciIsIlN0cmluZyIsImN1cnJlbnRWYWx1ZSIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCJkZWxpdmVyeVZhbHVlIiwibGFzdFZhbHVlTGltaXQiLCJnaWZ0UmVhZHkiLCIkbW9yZVRleHQiLCIkbW9yZVZhbHVlIiwiJGxhc3RUZXh0IiwiJGxhc3RWYWx1ZSIsIiRnaWZ0VGV4dCIsIiRnaWZ0VmFsdWUiLCIkbWluVGV4dCIsIiRtYXhIb2xkZXIiLCIkbWF4VGV4dCIsIiRkZWxpdmVyeUhvbGRlciIsIiRkZWxpdmVyeVRleHQiLCIkcHJvZ3Jlc3NCYXIiLCJhbW91bnQiLCJkZWxpdmVyeSIsInNwbGl0UG9zIiwiaGFzU3BsaXQiLCJwb3NPZiIsInBvcyIsIk1hdGgiLCJtaW4iLCJtYXgiLCJwcm9ncmVzcyIsInRvRml4ZWQiLCJkZWxpdmVyeVBvcyIsInJlYWR5UG9zIiwiZGlzcGxheSIsInJpZ2h0Iiwic2FtZUFzRGVsaXZlcnkiLCIkc2xpZGVyIiwiY2VudGVyRmV3U2xpZGVzIiwiJGxpc3QiLCJ3aWR0aCIsIm91dGVyV2lkdGgiLCJSZXNpemVPYnNlcnZlciIsInNsaWNrIiwiaW5maW5pdGUiLCJzbGlkZXNUb1Nob3ciLCJzbGlkZXNUb1Njcm9sbCIsInZhcmlhYmxlV2lkdGgiLCJhcnJvd3MiLCJyZXNwb25zaXZlIiwiYnJlYWtwb2ludCIsInNldHRpbmdzIiwidXBkYXRlUXVhbnRpdHkiLCJjb25maXJtQW5kUmVtb3ZlIiwiJHJhZGlvIiwicHJvcCIsImJ1dHRvbiIsIiRjb250cm9scyIsInF1YW50aXR5RWxlbWVudCIsIm1heFF1YW50aXR5IiwibmV3UXVhbnRpdHkiLCIkcmVhZG9ubHlJbnB1dCIsInVwZGF0ZUlucHV0IiwicHJvZHVjdCIsInByb2R1Y3RJZCIsIml0ZW1JZCIsImNhdGVnb3J5IiwicmVzcG9uc2VEYXRhIiwiSlNPTiIsInBhcnNlIiwicmVzcG9uc2VUZXh0IiwiJGVsZW1lbnQiLCJpc0RpcmVjdERlbGV0ZSIsIml0ZW1XcmFwcGVyIiwiX2NzcmZfdG9rZW4iLCJ3YWl0Rm9yRWxlbWVudHMiLCIkaW5wdXRzIiwiJGluTWVudSIsIiRjbG9zZXN0U2lkZWJhciIsImNoZWNrRXhpc3QiLCJzZXRJbnRlcnZhbCIsIiRlbGVtZW50cyIsImNsZWFySW50ZXJ2YWwiLCIkY2IiLCIkYnJhbmQiLCIkcmVmdXNlQ2hlY2tib3giLCJhcHBseVNhbXBsZVJlZnVzZVN0YXRlIiwidmFyaWFudElkIiwiY3NyZlRva2VuIiwiaXNDaGVja2VkIiwiX3hociRyZXNwb25zZUpTT04yIiwiJHNhbXBsZUNoZWNrYm94ZXMiLCJzZXNzaW9uU3RvcmFnZSIsInNldEl0ZW0iLCJ3YXNDaGVja2VkIiwiZ2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJpc1JlZnVzZWQiLCJyZXNldEdpZnROdWRnZSIsInJlZnVzZSIsIkdJRlRfTlVER0VfS0VZIiwiR0lGVF9OVURHRV9MSU1JVCIsImdpZnROdWRnZUNvdW50IiwiYnVtcEdpZnROdWRnZSIsIm5leHQiLCJnaWZ0c1BlbmRpbmciLCJ0b0FycmF5IiwiZXZlcnkiLCJjYiIsInBlbmRpbmciLCJza2lwIiwic2Nyb2xsVG9HaWZ0cyIsImdldENvbXB1dGVkU3R5bGUiLCJwb3NpdGlvbiIsImJveCIsInN0eWxlIiwib3ZlcmZsb3dZIiwic2Nyb2xsSGVpZ2h0IiwiY2xpZW50SGVpZ2h0Iiwic2Nyb2xscyIsInZpZXdUb3AiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJ2aWV3Qm90dG9tIiwiYm90dG9tIiwiaW5uZXJIZWlnaHQiLCJ0YXJnZXRUb3AiLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwib2Zmc2V0Iiwic2Nyb2xsVG8iLCJiZWhhdmlvciIsInNob3dHaWZ0SGludCIsIiR2aWV3cG9ydCIsInZwIiwiY2FyZHMiLCJ2aXNpYmxlIiwiY2FyZCIsInIiLCJyb3VuZCIsImhlaWdodCIsInN5bmNHaWZ0QXJyb3dzIiwidHJhY2siLCJzY3JvbGxXaWR0aCIsImNsaWVudFdpZHRoIiwic2Nyb2xsTGVmdCIsInNpYmxpbmdzIiwiZGlyIiwic2Nyb2xsQnkiLCIkaGludCIsIm51ZGdlIiwic3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uIiwiY291cG9uUmVxdWVzdCIsIiRhcmVhcyIsImFsd2F5cyIsIiRoZWFkZXIiLCIkZm9ybSIsImZvY3VzIiwicHJldmVudFNjcm9sbCIsInN0b3BQcm9wYWdhdGlvbiIsImNvZGUiLCIkZXJyb3IiLCJjb3Vwb24iLCJwaG9uZSIsIlNraW5QaG9uZU1hc2siLCJ0b0xlZ2FjeSIsImRvbmUiLCJmYWlsIiwiX3hociRyZXNwb25zZUpTT04zIiwiX3hociRyZXNwb25zZUpTT040IiwibWVudSIsInF1ZXJ5U2VsZWN0b3IiLCJtZW51SXRlbXMiLCJjYXRhbG9ncyIsIm1lbnVNYWluIiwiaW5pdFNlYXJjaE92ZXJsYXkiLCIkYm9keSIsIiRzZWFyY2hCdG4iLCIkc2VhcmNoRGF0YSIsIiRzZWFyY2hGb3JtIiwiJHNlYXJjaENsb3NlIiwiaW5pdFNlYXJjaFNsaWRlciIsIiRzZWFyY2hTbGlkZXIiLCJtb2JpbGVGaXJzdCIsImZvY3VzT25TZWxlY3QiLCJkb3RzIiwic3dpcGUiLCJkcmFnZ2FibGUiLCJpbml0TWVzc2FnZUJhclNsaWRlciIsIiRzbGlkZXJzIiwiYXV0b3BsYXkiLCJhdXRvcGxheVNwZWVkIiwiZGVza3RvcE1lbnUiLCJtYXRjaE1lZGlhIiwiaW5pdERlc2t0b3BEcm9wZG93bnMiLCJjYXRhbG9nSXNFbXB0eSIsImNhdGFsb2ciLCJjYXRhbG9nSW4iLCJjbG9zZUFsbCIsImhhc0F0dHJpYnV0ZSIsIm9wZW5Ecm9wZG93biIsIm1lbnVJZCIsIm1hdGNoZXMiLCJpbml0QWpheFNlYXJjaCIsIiRjb250YWluZXIiLCIkZGVmYXVsdCIsInNlYXJjaFVybCIsInR5cGluZ1RpbWVyIiwiZG9uZVR5cGluZ0ludGVydmFsIiwib2ZmIiwicXVlcnkiLCJjbGVhclRpbWVvdXQiLCJjaGFyc0xlZnQiLCJxIiwiaXNfYWpheCIsImhlYWRlcnMiLCJodG1sUmVzcG9uc2UiLCJmdWxsU2VhcmNoVXJsIiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwic3luY0hlYWRlck9mZnNldCIsInJvdyIsInNldFByb3BlcnR5IiwiYW5ub3VuY2VtZW50QmFyIiwiJGFubm91bmNlbWVudCIsImFubm91bmNlbWVudCIsImluaXRMYXp5SW1hZ2VzIiwibXV0YXRpb24iLCJjbG9zZU1vYmlsZU1lbnUiLCJpc0FjY291bnRBY3RpdmUiLCIkaW5uZXIiLCJpc0FjdGl2ZSIsImZpbGxPdXRPZlN0b2NrUHJvZHVjdCIsIiRjYXJkIiwiJHNyYyIsIiRwYWdlIiwiJGltZyIsIm5hbWUiLCJjYXBhY2l0eSIsInRvZ2dsZSIsIm9sZFByaWNlIiwiJG9sZFByaWNlIiwiJGVtYWlsIiwiZW1haWxFcnJvciIsIlNraW5FbWFpbCIsImlzQ2xpZW50RXJyb3IiLCJtc2ciLCJtZXNzYWdlIiwiZGVza3RvcE1xIiwiYmluZFByb2R1Y3RIb3ZlciIsIiRwcm9kdWN0IiwidW5iaW5kUHJvZHVjdEhvdmVyIiwiYWRkTGlzdGVuZXIiLCJ0cnVuY2F0ZWRUZXh0IiwiJGhlYXJ0IiwidXNlciIsIndpc2hsaXN0VHlwZSIsImlzQ3VycmVudGx5QWRkZWQiLCJwcm9kdWN0X2lkIiwicmVsb2FkIiwiZm9ybWF0VWFoQW1vdW50IiwidXBkYXRlUGFydHNQYXlQb3B1cCIsIiRyb3ciLCJtb250aHMiLCJtb250aGx5IiwiY2VpbCIsIiRwYXJ0c1BheUZvcm0iLCJtYWluUHJvZHVjdEZvcm0iLCIkb3BlbmVyIiwiJHNjb3BlZCIsInBhcnRzUGF5VGFyZ2V0Rm9ybSIsIiRiYW5rIiwiYmFuayIsImxvY2FsU3RvcmFnZSIsInBhdXNlT25Gb2N1cyIsInBhdXNlT25Ib3ZlciIsImNzc0Vhc2UiLCJzcGVlZCIsImNlbnRlck1vZGUiLCJsb29wIiwiaW5uZXJXaWR0aCIsImZhZGUiLCIkZG90cyIsImFwcGVuZERvdHMiLCJyZWFkeSIsInVwZGF0ZUJ1dHRvbiIsImV4cGFuZGVkIiwidXBkYXRlIiwiJGRldGFpbHMiLCIkaXRlbSIsInBhcmVudCIsIiRjb250ZW50IiwiaXNJbnNpZGVWaWV3U3RlcHMiLCJzdG9wIiwic2xpZGVVcCIsInNsaWRlRG93biIsIiRwYXJlbnRJdGVtIiwiJGFjY29yZGlvbnMiLCJub3QiLCJjdXJyZW50VGFyZ2V0IiwiJHNlY3Rpb24iLCJmb290ZXJFbGVtZW50cyIsInVwZGF0ZUhlaWdodCIsImVsZW1lbnQiLCJjaGlsZHJlbkNvdW50IiwiY2hpbGRyZW4iLCJuZXdIZWlnaHQiLCJpbm5lckl0ZW0iXSwic291cmNlUm9vdCI6IiJ9