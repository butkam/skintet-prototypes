/**
 * Prototype (2026-11-15.html): the feedback round of 14.11 (docs/skin-id-feedback-2026-11-14.md).
 *
 * 1. The morning / evening toggle sticks under the header (CSS position: sticky in .care-tabs, so it leaves
 *    with the last step). Here: the header's height as --sticky-top, .is-stuck for the bar behind the chips.
 *    Variant А (default): tabs, as before; a chip pressed while stuck brings the new tab's first step up.
 *    Variant Б (?nav=anchors): both parts on one page, the chips jump to them, the active chip follows the scroll.
 * 7. The routine's purchase sticks to the bottom of the screen whenever the card's own «Додати в кошик» is off
 *    screen: before it's reached and after it's scrolled past. Coming from above, it hides as the button
 *    reaches the panel's top edge, so the button takes over from it; never when nothing is missing (an
 *    empty data-codes). Its button
 *    presses the card's own «Додати в кошик», so the cart logic (skin-id-cart.js) stays in one place.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var header = document.querySelector('header');
  var tabs = document.querySelector('.care-tabs');
  var nav = tabs && tabs.querySelector('.care-nav');
  if (!tabs || !nav) return;

  var chips = Array.prototype.slice.call(nav.querySelectorAll('[data-nav]'));
  var sections = Array.prototype.slice.call(tabs.querySelectorAll('.care-section[data-section]'));
  var anchors = new URLSearchParams(window.location.search).get('nav') === 'anchors';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function stickyTop() {
    return header ? header.getBoundingClientRect().bottom : 0;
  }
  function scrollToY(y) {
    window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  // ── 1. Sticky toggle ──────────────────────────────────────────────────────────────────────────────────
  if (anchors) {
    tabs.classList.add('care-tabs--anchors');
    // the chips aren't tabs here: stop the site's tab switch (result-sliders.js, on the chips themselves)
    nav.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-nav]');
      if (!chip) return;
      e.stopPropagation();
      var section = tabs.querySelector('.care-section[data-section="' + chip.getAttribute('data-nav') + '"]');
      var heading = section && section.querySelector('.care-part');
      if (!heading) return;
      setActive(chip);
      spyLockUntil = Date.now() + 800; // let the smooth scroll land before the scroll spy takes over
      var gap = nav.offsetHeight + 16;
      scrollToY(heading.getBoundingClientRect().top + window.scrollY - stickyTop() - gap);
    }, true);
  } else {
    // a chip pressed while stuck: the new tab starts from its first step, under the toggle
    nav.addEventListener('click', function (e) {
      if (!e.target.closest('[data-nav]') || !nav.classList.contains('is-stuck')) return;
      requestAnimationFrame(function () {
        scrollToY(tabs.getBoundingClientRect().top + window.scrollY - stickyTop());
      });
    });
  }

  function setActive(chip) {
    chips.forEach(function (c) {
      c.classList.toggle('is-active', c === chip);
    });
  }

  var spyLockUntil = 0;
  function spy() {
    if (!anchors || Date.now() < spyLockUntil) return;
    var line = stickyTop() + nav.offsetHeight + 40;
    var current = sections[0];
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= line) current = s;
    });
    var chip = chips.filter(function (c) {
      return c.getAttribute('data-nav') === current.getAttribute('data-section');
    })[0];
    if (chip && !chip.classList.contains('is-active')) setActive(chip);
  }

  // ── 7. The routine's purchase at the bottom ───────────────────────────────────────────────────────────
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

  if (barOn) {
    bar.querySelector('[data-routine-bar-add]').addEventListener('click', function () {
      addAll.click();
    });
    // mirror the card button's states: loading, and «Всі товари додано в кошик» once added
    var barBtn = bar.querySelector('[data-routine-bar-add]');
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
    var navTop = nav.getBoundingClientRect().top;
    var tabsBottom = tabs.getBoundingClientRect().bottom;
    nav.classList.toggle('is-stuck', navTop <= top + 0.5 && tabsBottom > top + nav.offsetHeight);
    spy();
    if (barOn) {
      // the card's button is on screen between the header and the panel's top edge (the panel stands on the
      // bottom menu on phones): there the panel hides
      var menu = document.querySelector('.bottom-nav');
      var navH = menu && getComputedStyle(menu).display !== 'none' ? menu.offsetHeight : 0;
      var floor = window.innerHeight - navH - bar.offsetHeight;
      var b = addAll.getBoundingClientRect();
      showBar(b.bottom < top || b.top > floor);
    }
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
})();
