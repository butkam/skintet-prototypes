/**
 * Prototype (2026-11-17.html): from 2026-11-15.js.
 *
 * 1. The header's height as --sticky-top, for the toggle and the routine card sticking under it. The morning /
 *    evening toggle switches the parts as tabs (one shown, the other [hidden]); pressed while stuck, the new
 *    part starts from its first step under it. .is-stuck for the white bar behind it once it sticks — on the
 *    title's row with the toggle (.care-head), on phones on the toggle alone.
 * 2. The routine's purchase sticks to the bottom of the screen once the card's own «Додати в кошик» has been
 *    scrolled past (comment 7), and hides when it's back on screen; never when nothing is missing (an empty
 *    data-codes). Its button presses the card's own «Додати в кошик», so the cart logic
 *    (skin-id-cart.js) stays in one place.
 *    Desktop (1025px and up): no panel — the card itself moves into the right column (.routine-rail) and sticks
 *    there (2026-11-17.css); below 1025px it goes back into the scheme, where it was.
 * 3. 18.11 (Figma 746:15673), desktop: the toggle moves into the right column too, over the card (both in
 *    .routine-rail__stick, sticking together); both parts show, the toggle's buttons are anchors to them and the
 *    part on screen is the active one. Below 1025px it goes back beside the title, sticking as before — and
 *    there too both parts are on one page and the toggle is anchors (a press glides to the part, under it).
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var header = document.querySelector('header');

  function stickyTop() {
    // never above the screen's top: on phones the header slides away while scrolling down (below)
    return header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
  }

  // ── 1. The toggle as tabs ───────────────────────────────────────────────────────────────────────────────
  var tabs = document.querySelector('.care-tabs');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.querySelector('.care-nav--anchors');
  var chips = nav ? Array.prototype.slice.call(nav.querySelectorAll('[data-part-tab]')) : [];
  // what sticks: the title's row with the toggle (.care-head) — or, on phones, where that row comes apart
  // (display: contents), the toggle alone
  var head = document.querySelector('.care-head');
  function stuckBar() {
    return head && getComputedStyle(head).display !== 'contents' ? head : nav;
  }
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
  // 18.11: anchors, not tabs, on every screen — both parts on one page (in the right column on desktop, beside
  // the title and sticking on phones and tablets)
  function anchors() {
    return !!nav;
  }
  function inRail() {
    return !!(nav && nav.parentNode && nav.parentNode.classList && nav.parentNode.classList.contains('routine-rail__stick'));
  }
  // what lies over the page under the header: on phones and tablets the stuck toggle (or its row) too
  function overlap() {
    return inRail() ? 24 : stuckBar().offsetHeight + 16;
  }
  var spyLock = -1;
  function markActive(i) {
    chips.forEach(function (c, k) {
      c.classList.toggle('is-active', k === i);
      if (k === i) c.setAttribute('aria-current', 'true');
      else c.removeAttribute('aria-current');
    });
  }
  chips.forEach(function (chip, i) {
    chip.addEventListener('click', function () {
      if (anchors()) {
        // 20.11: the parts' «РАНОК» / «ВЕЧІР» are hidden (2026-11-17.css) — then the part itself is the target
        var heading = panels[i] && panels[i].querySelector('.care-part');
        var part = heading && heading.offsetParent ? heading : panels[i];
        if (!part) return;
        spyLock = i;
        markActive(i);
        glideTo(function () {
          return part.getBoundingClientRect().top + window.scrollY - stickyTop() - overlap();
        }, function () {
          spyLock = -1;
          schedule();
        });
        return;
      }
      var stuck = stuckBar().classList.contains('is-stuck');
      select(i);
      // pressed while stuck: the page glides up to the new part's first step, under the toggle (18.11: animated,
      // not a jump — glideTo starts two frames after the swap, when the page has settled, so the browser doesn't
      // drop it, and takes over with its own ease if it does)
      if (stuck && panels[i]) {
        var panel = panels[i];
        glideTo(function () {
          return panel.getBoundingClientRect().top + window.scrollY - stickyTop() - stuckBar().offsetHeight - 16;
        }, function () {});
      }
    });
    // arrows move between the two, as tabs do
    chip.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (anchors()) return;
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
    // 20.11: while the page glides by itself, the phones' header stays as it is (it'd take a glide up for a
    // scroll up and come down mid-way, moving the sticky toggle and the target 65px)
    root.classList.add('is-gliding');
    var finish = done;
    done = function () {
      root.classList.remove('is-gliding');
      finish();
    };
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
        return target.getBoundingClientRect().top + window.scrollY - stickyTop() - (inScheme && nav && !inRail() ? stuckBar().offsetHeight : 0) - 24;
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
  var phone = window.matchMedia('(max-width: 767px)');
  var home = null;
  var stick = null;
  if (rail && card) {
    home = document.createComment('care-result');
    card.parentNode.insertBefore(home, card);
    stick = document.createElement('div');
    stick.className = 'routine-rail__stick';
    rail.appendChild(stick);
  }
  // 18.11: the toggle beside the title on phones, over the card on desktop (a marker keeps its place)
  var navHome = null;
  if (stick && nav) {
    navHome = document.createComment('care-nav');
    nav.parentNode.insertBefore(navHome, nav);
  }
  var holder = nav && nav.querySelector('.care-nav__holder');
  function placeCard() {
    if (!home) return;
    if (desktop.matches) {
      if (card.parentNode !== stick) stick.appendChild(card);
      // 20.11: the toggle stays over the scheme on desktop too, under «Твоя схема догляду» as on phones — read as
      // the scheme's navigation, not part of the sidebar; only the card goes into the right column
      if (navHome && nav.previousSibling !== navHome) navHome.parentNode.insertBefore(nav, navHome.nextSibling);
    } else {
      if (card.previousSibling !== home) home.parentNode.insertBefore(card, home.nextSibling);
      if (navHome && nav.previousSibling !== navHome) navHome.parentNode.insertBefore(nav, navHome.nextSibling);
    }
    setMode();
  }
  // desktop: both parts shown, the buttons anchors (aria-current on the part on screen); phones: tabs
  function setMode() {
    if (!chips.length) return;
    var on = anchors();
    if (holder) {
      if (on) holder.removeAttribute('role');
      else holder.setAttribute('role', 'tablist');
    }
    var current = 0;
    chips.forEach(function (c, k) {
      if (c.classList.contains('is-active')) current = k;
      if (on) {
        c.removeAttribute('role');
        c.removeAttribute('aria-selected');
        c.removeAttribute('tabindex');
        if (panels[k]) {
          panels[k].hidden = false;
          panels[k].removeAttribute('role');
        }
      } else {
        c.setAttribute('role', 'tab');
        c.removeAttribute('aria-current');
        if (panels[k]) panels[k].setAttribute('role', 'tabpanel');
      }
    });
    if (on) markActive(current);
    else select(current);
  }
  placeCard();
  if (desktop.addEventListener) desktop.addEventListener('change', placeCard);
  else if (desktop.addListener) desktop.addListener(placeCard);

  // desktop: the card starts level with the scheme's first step (--rail-offset, 2026-11-17.css) — measured, as
  // the empty state has «Розбір ще триває» over the scheme; again on resize and once the fonts are in
  var railOffset = null;
  function alignRail() {
    if (!rail || !desktop.matches) return;
    // 18.11: the toggle's top level with «Твоя схема догляду»
    var title = document.querySelector('.care-head .care-title');
    if (!title) return;
    var off = Math.max(0, Math.round(title.getBoundingClientRect().top - rail.getBoundingClientRect().top));
    if (off === railOffset) return;
    railOffset = off;
    rail.style.setProperty('--rail-offset', off + 'px');
  }
  alignRail();
  window.addEventListener('resize', alignRail);
  window.addEventListener('load', alignRail);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(alignRail);

  if (barOn) {
    var barBtn = bar.querySelector('[data-routine-bar-add]');
    barBtn.addEventListener('click', function () {
      // 18.11, phones: «Купити» glides down to the routine card (its «Додати в кошик» and «Частинами» there), the
      // panel hides on the way as the card comes up; tablets: straight to the cart, as before
      if (phone.matches) {
        glideTo(function () {
          return card.getBoundingClientRect().top + window.scrollY - stickyTop() - 24;
        }, function () {
          addAll.focus({ preventScroll: true });
        });
        return;
      }
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
    if (anchors()) {
      if (spyLock === -1) {
        // the active part: the last one whose «РАНОК» / «ВЕЧІР» is above a third of the screen
        var under = inRail() ? top : top + stuckBar().offsetHeight;
        var line = under + (window.innerHeight - under) / 3;
        var active = 0;
        panels.forEach(function (p, k) {
          if (p && p.getBoundingClientRect().top <= line) active = k;
        });
        markActive(active);
      }
      // the toggle leaves with the steps: once the last step's bottom passes the toggle's, the column rides up
      // with the page (a smaller sticky top) until the card is where the toggle was, 24px under the header —
      // then only the card sticks
      if (stick && tabs && inRail()) {
        var base = top + 24;
        var navH = nav.offsetHeight;
        var shift = Math.min(navH + 40, Math.max(0, base + navH - tabs.getBoundingClientRect().bottom));
        stick.style.top = (base - shift) + 'px';
        var gone = shift >= navH;
        if (nav.classList.contains('is-gone') !== gone) {
          nav.classList.toggle('is-gone', gone);
          if (gone) nav.setAttribute('inert', '');
          else nav.removeAttribute('inert');
        }
      }
    }
    if (nav && tabs && !inRail()) {
      if (stick) {
        stick.style.top = '';
        nav.classList.remove('is-gone');
        nav.removeAttribute('inert');
      }
      var sticky = stuckBar();
      var navTop = sticky.getBoundingClientRect().top;
      sticky.classList.toggle('is-stuck', navTop <= top + 0.5 && tabs.getBoundingClientRect().bottom > top + sticky.offsetHeight);
      if (head && sticky !== head) head.classList.remove('is-stuck');
      if (sticky !== nav) nav.classList.remove('is-stuck');
    }
    if (barOn) {
      // comment 7: only once the card's button has gone up under the header, not on the way to it;
      // 18.11, phones (up to 767px): over the bottom menu from the start, until the routine card itself comes up
      // to the panel's top edge — from there on (the card on screen, or the page past it) it stays hidden
      var b = addAll.getBoundingClientRect();
      var show;
      if (phone.matches) {
        // 20.11: to the page's end, hidden only while the routine card is in the frame (between the header's
        // bottom and the panel's top), shown again once it has gone up past the header
        var barTop = window.innerHeight - bar.offsetHeight - (document.body.classList.contains('chrome-away') ? 0 : 61);
        var c = card.getBoundingClientRect();
        show = c.top > barTop || c.bottom < top;
      } else {
        show = b.bottom < top;
      }
      showBar(!desktop.matches && show);
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

/**
 * 20.11 feedback, phones (up to 767px): fewer things fixed on screen — the header and the bottom menu slide away
 * while scrolling down and come back on any scroll up (and near the top of the page); the purchase panel
 * drops to the screen's bottom edge meanwhile. Not by transform: the mobile menus are
 * position: fixed inside the header, so it goes up by its sticky top instead (.header--away, 2026-11-17.css).
 * The toggle and the routine card stick under the header's bottom (--sticky-top), so while it slides, a scroll
 * event per frame keeps them following it. Not while a menu is open.
 */
(function () {
  'use strict';
  var header = document.querySelector('header');
  if (!header || !window.matchMedia) return;
  var phone = window.matchMedia('(max-width: 767px)');
  var root = document.documentElement;
  var lastY = window.scrollY;
  var away = false;
  var follow = 0;

  function menuOpen() {
    // the site's mobile menus lock the page while open
    return getComputedStyle(document.body).overflow === 'hidden' || getComputedStyle(root).overflow === 'hidden';
  }

  // the sticky things re-measure the header on scroll: nudge them every frame of the 0.25s slide
  function followSlide() {
    var until = performance.now() + 320;
    cancelAnimationFrame(follow);
    (function tick() {
      window.dispatchEvent(new Event('scroll'));
      if (performance.now() < until) follow = requestAnimationFrame(tick);
    })();
  }

  function set(next) {
    if (next === away) return;
    away = next;
    header.classList.toggle('header--away', away);
    // the bottom menu goes with it, the purchase panel drops into its place (2026-11-17.css)
    document.body.classList.toggle('chrome-away', away);
    followSlide();
  }

  var frame = 0;
  function check() {
    frame = 0;
    var y = window.scrollY;
    var dy = y - lastY;
    root.style.setProperty('--header-h', header.offsetHeight + 'px');
    if (root.classList.contains('is-gliding')) { lastY = y; return; }
    if (!phone.matches || menuOpen() || y <= header.offsetHeight) set(false);
    else if (dy > 4) set(true);
    else if (dy < -4) set(false);
    if (Math.abs(dy) > 4 || y <= header.offsetHeight) lastY = y;
  }
  window.addEventListener('scroll', function (e) {
    if (!e.isTrusted) return; // our own nudges
    if (!frame) frame = requestAnimationFrame(check);
  }, { passive: true });
  if (phone.addEventListener) phone.addEventListener('change', check);
  check();
})();

/**
 * 20.11 feedback: no «З твоєї полички» / «Наша рекомендація» in the step's meta any more — the badge on the photo's
 * corner (.rstep::after, its place set per screen width in 2026-11-17.css) says it, and the label is its tooltip
 * on hover / focus / tap. The label (.rstep__mark) is moved over the badge as a transparent target, measured from
 * the badge itself, again on resize; its text becomes the tooltip (still read by screen readers).
 */
(function () {
  'use strict';
  var marks = Array.prototype.slice.call(document.querySelectorAll('.rstep .rstep__mark'));
  if (!marks.length) return;
  var items = marks.map(function (mark) {
    var step = mark.closest('.rstep');
    var text = mark.textContent.trim();
    mark.textContent = '';
    var tip = document.createElement('span');
    tip.className = 'rstep__mark-tip';
    tip.textContent = text;
    mark.appendChild(tip);
    mark.classList.add('rstep__mark--badge');
    mark.setAttribute('tabindex', '0');
    step.appendChild(mark); // out of the meta, straight in the step (position: relative)
    return { step: step, mark: mark };
  });
  function place() {
    items.forEach(function (it) {
      var a = getComputedStyle(it.step, '::after');
      var off = a.content === 'none' || a.display === 'none';
      it.mark.hidden = off;
      if (off) return;
      it.mark.style.top = a.top;
      it.mark.style.right = a.right;
      it.mark.style.width = a.width;
      it.mark.style.height = a.height;
    });
  }
  place();
  window.addEventListener('resize', place);
  window.addEventListener('load', place);
  // a tap elsewhere closes a tooltip opened by a tap (focus)
  document.addEventListener('touchstart', function (e) {
    var a = document.activeElement;
    if (a && a.classList && a.classList.contains('rstep__mark--badge') && !a.contains(e.target)) a.blur();
  }, { passive: true });
})();
