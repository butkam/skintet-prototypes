/**
 * Prototype: «Додатково з твоєї полички» — a native horizontal scroller with prev/next arrows (desktop only).
 *
 * An arrow scrolls by one card (its width + the gap); each arrow is disabled at its end of the row.
 */
(function () {
  'use strict';

  function init() {
    var list = document.querySelector('[data-shelf-extra-list]');
    if (!list) return;
    var section = list.closest('.shelf-extra');
    var prev = section.querySelector('[data-shelf-extra-prev]');
    var next = section.querySelector('[data-shelf-extra-next]');

    function step() {
      var card = list.firstElementChild;
      var gap = parseFloat(getComputedStyle(list).columnGap) || 0;
      return card ? card.getBoundingClientRect().width + gap : list.clientWidth;
    }

    function update() {
      var max = list.scrollWidth - list.clientWidth;
      prev.disabled = list.scrollLeft <= 1;
      next.disabled = list.scrollLeft >= max - 1;
    }

    prev.addEventListener('click', function () {
      list.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    next.addEventListener('click', function () {
      list.scrollBy({ left: step(), behavior: 'smooth' });
    });
    list.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
