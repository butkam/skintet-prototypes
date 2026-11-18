/**
 * Prototype (2026-11-17.html): from 2026-11-15.js.
 *
 * 1. The header's height as --sticky-top, for the toggle and the routine card sticking under it. The morning /
 *    evening toggle switches the parts as tabs (one shown, the other [hidden]); pressed while stuck, the new
 *    part starts from its first step under it. .is-stuck for the white bar behind it once it sticks.
 * 2. The routine's purchase sticks to the bottom of the screen once the card's own «Додати в кошик» has been
 *    scrolled past (comment 7), and hides when it's back on screen; never when nothing is missing (an empty
 *    data-codes). Its button presses the card's own «Додати в кошик», so the cart logic
 *    (skin-id-cart.js) stays in one place.
 *    Desktop (1025px and up): no panel — the card itself moves into the right column (.routine-rail) and sticks
 *    there (2026-11-17.css); below 1025px it goes back into the scheme, where it was.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var header = document.querySelector('header');

  function stickyTop() {
    return header ? header.getBoundingClientRect().bottom : 0;
  }

  // ── 1. The toggle as tabs ───────────────────────────────────────────────────────────────────────────────
  var tabs = document.querySelector('.care-tabs');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.querySelector('.care-nav--anchors');
  var chips = nav ? Array.prototype.slice.call(nav.querySelectorAll('[data-part-tab]')) : [];
  var panels = chips.map(function (chip) {
    return document.getElementById(chip.getAttribute('aria-controls'));
  });

  function select(i, focus) {
    chips.forEach(function (c, k) {
      var on = k === i;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-selected', on ? 'true' : 'false');
      c.tabIndex = on ? 0 : -1;
      if (panels[k]) panels[k].hidden = !on;
    });
    if (focus) chips[i].focus();
  }
  chips.forEach(function (chip, i) {
    chip.addEventListener('click', function () {
      var stuck = nav.classList.contains('is-stuck');
      select(i);
      // pressed while stuck: the new part starts from its first step, under the toggle
      // (a jump, not a smooth scroll: the part under it has just been swapped, and a smooth scroll started over a
      // swap gets dropped by the browser)
      if (stuck && panels[i]) {
        var y = panels[i].getBoundingClientRect().top + window.scrollY - stickyTop() - nav.offsetHeight - 16;
        window.scrollTo(0, Math.max(0, y));
      }
    });
    // arrows move between the two, as tabs do
    chip.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      select((i + (e.key === 'ArrowRight' ? 1 : chips.length - 1)) % chips.length, true);
    });
  });

  // ── «Додатково з твоєї полички» folds after 3 ──────────────────────────────────────────────────────────
  // The brief: long lists fold after 3–4. With more than 4, the first 3 show and «Показати ще N» opens the rest
  // (and turns into «Згорнути»); with 4 or fewer, nothing folds. Without JS everything shows
  var foldList = document.getElementById('shelf-extra-list');
  var foldBtn = document.querySelector('.shelf-more[aria-controls="shelf-extra-list"]');
  var openFold = function () {};
  if (foldList && foldBtn) {
    var foldRows = Array.prototype.slice.call(foldList.children).slice(3);
    if (foldList.children.length > 4) {
      var foldLabel = foldBtn.querySelector('.shelf-more__label');
      var setFold = function (open) {
        foldRows.forEach(function (li) { li.hidden = !open; });
        foldBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        foldLabel.textContent = open ? 'Згорнути' : 'Показати ще ' + foldRows.length;
      };
      setFold(false);
      openFold = function () { setFold(true); };
      foldBtn.hidden = false;
      foldBtn.addEventListener('click', function () {
        var open = foldBtn.getAttribute('aria-expanded') !== 'true';
        setFold(open);
        if (open && foldRows[0]) {
          var first = foldRows[0].querySelector('.shelf-skip__name');
          if (first) { first.setAttribute('tabindex', '-1'); first.focus({ preventScroll: true }); }
        }
      });
    }
  }

  // ── The ingredients' products: dotted links to them on the page ─────────────────────────────────────────
  // A product of the evening opens the evening's tab first, a folded row of «Додатково» opens the fold; then the
  // page glides it up under the header (and the stuck toggle, inside the scheme). The browser's own smooth
  // scroll (Safari draws a script-driven one with stutters), started two frames after a swapped tab, when the
  // page has settled; if it doesn't get going (dropped), our own ease takes over. The product gets the focus
  // once the page has stopped — Safari would cut the scroll short on a focus() during it
  var glide = 0;
  function whenStill(done) {
    var last = -1, still = 0;
    var check = function () {
      var y = window.scrollY;
      still = Math.abs(y - last) < 0.5 ? still + 1 : 0;
      last = y;
      if (still >= 3) done();
      else glide = requestAnimationFrame(check);
    };
    glide = requestAnimationFrame(check);
  }
  function ease(y, done) {
    var from = window.scrollY, dist = y - from, start = 0;
    var duration = Math.min(700, Math.max(350, Math.abs(dist) * 0.35));
    var step = function (now) {
      if (!start) start = now;
      var t = Math.min(1, (now - start) / duration);
      window.scrollTo(0, from + dist * (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2));
      if (t < 1) glide = requestAnimationFrame(step);
      else done();
    };
    glide = requestAnimationFrame(step);
  }
  function glideTo(getY, done) {
    cancelAnimationFrame(glide);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var y = Math.max(0, getY());
        if (reduceMotion || Math.abs(y - window.scrollY) < 2) {
          window.scrollTo(0, y);
          done();
          return;
        }
        var from = window.scrollY;
        window.scrollTo({ top: y, behavior: 'smooth' });
        setTimeout(function () {
          if (Math.abs(window.scrollY - from) < 2) ease(y, done); // dropped: ours
          else whenStill(done);
        }, 120);
      });
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll('.ingr-list__link'), function (link) {
    link.addEventListener('click', function (e) {
      var target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      var panel = target.closest('[role="tabpanel"]');
      if (panel && panel.hidden) {
        var k = panels.indexOf(panel);
        if (k !== -1) select(k);
      }
      if (target.hidden) openFold();
      var inScheme = tabs && tabs.contains(target);
      glideTo(function () {
        return target.getBoundingClientRect().top + window.scrollY - stickyTop() - (inScheme && nav ? nav.offsetHeight : 0) - 24;
      }, function () {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  });

  // ── The empty state: «Надіслати розбір на пошту» turns into the line that we will ─────────────────────────
  Array.prototype.forEach.call(document.querySelectorAll('[data-shelf-pending-send]'), function (send) {
    send.addEventListener('click', function () {
      var box = send.closest('[data-shelf-pending]');
      var done = box && box.querySelector('[data-shelf-pending-done]');
      if (!done) return;
      send.hidden = true;
      done.hidden = false;
    });
  });

  // ── 2. The routine's purchase ─────────────────────────────────────────────────────────────────────────
  var bar = document.querySelector('.routine-bar');
  var card = document.querySelector('.care-result');
  var addAll = document.getElementById('skin-id-add-all');
  var missing = [];
  try {
    missing = JSON.parse((addAll && addAll.getAttribute('data-codes')) || '[]');
  } catch (err) {
    missing = [];
  }
  var barOn = !!(bar && card && addAll && missing.length);

  // the card between the scheme and the right column: a marker keeps its place in the scheme
  var rail = document.querySelector('.routine-rail');
  var desktop = window.matchMedia('(min-width: 1025px)');
  var home = null;
  if (rail && card) {
    home = document.createComment('care-result');
    card.parentNode.insertBefore(home, card);
  }
  function placeCard() {
    if (!home) return;
    if (desktop.matches) {
      if (card.parentNode !== rail) rail.appendChild(card);
    } else if (card.previousSibling !== home) {
      home.parentNode.insertBefore(card, home.nextSibling);
    }
  }
  placeCard();
  if (desktop.addEventListener) desktop.addEventListener('change', placeCard);
  else if (desktop.addListener) desktop.addListener(placeCard);

  if (barOn) {
    var barBtn = bar.querySelector('[data-routine-bar-add]');
    barBtn.addEventListener('click', function () {
      addAll.click();
    });
    // mirror the card button's states: loading, and «Додано в кошик» once added
    new MutationObserver(function () {
      barBtn.classList.toggle('loading', addAll.classList.contains('loading'));
      if (addAll.classList.contains('skin-id-buy--done')) {
        barBtn.classList.add('skin-id-buy--done');
        barBtn.innerHTML = '<span>Додано в кошик</span>';
        barBtn.disabled = true;
      }
    }).observe(addAll, { attributes: true, attributeFilter: ['class'] });
  }

  function showBar(show) {
    if (bar.classList.contains('is-shown') === show) return;
    bar.classList.toggle('is-shown', show);
    bar.setAttribute('aria-hidden', show ? 'false' : 'true');
    if (show) bar.removeAttribute('inert');
    else bar.setAttribute('inert', '');
    document.body.classList.toggle('has-routine-bar', show);
  }

  // ── one pass per frame ────────────────────────────────────────────────────────────────────────────────
  var frame = 0;
  function update() {
    frame = 0;
    var top = stickyTop();
    root.style.setProperty('--sticky-top', top + 'px');
    if (nav && tabs) {
      var navTop = nav.getBoundingClientRect().top;
      nav.classList.toggle('is-stuck', navTop <= top + 0.5 && tabs.getBoundingClientRect().bottom > top + nav.offsetHeight);
    }
    if (barOn) {
      // comment 7: only once the card's button has gone up under the header, not on the way to it
      var b = addAll.getBoundingClientRect();
      showBar(!desktop.matches && b.bottom < top);
    }
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
})();

/* «Чому рекомендуємо» under a step's «Коли закінчиться» (.rstep__why): only a click shows the reason; a click
   pins it open or closes it, a click anywhere else or Esc closes it */
(function () {
  'use strict';
  var whys = document.querySelectorAll('.rstep__why');
  if (!whys.length) return;
  function set(btn, open) {
    btn.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeAll(except) {
    for (var i = 0; i < whys.length; i++) if (whys[i] !== except) set(whys[i], false);
  }
  for (var i = 0; i < whys.length; i++) {
    whys[i].addEventListener('click', function (e) {
      e.stopPropagation();
      closeAll(this);
      set(this, !this.classList.contains('is-open'));
    });
  }
  document.addEventListener('click', function () { closeAll(null); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll(null);
  });
})();
