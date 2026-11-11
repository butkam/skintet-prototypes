/**
 * Prototype: the shelves under the scheme steps and under the «Додатково з твоєї полички» jars change
 * perspective as the page scrolls, as if seen in 3D.
 *
 * The eye is at the middle of the screen. For each step, t is how far its plank is from there, −1 at the
 * top of the screen to 1 at the bottom: a shelf below the eye shows its top (--shelf-under: 0), one above
 * shows its underside (--shelf-under: 1), and how much of it shows, --shelf-h, grows with |t| up to the
 * shelf's --shelf-depth (linear, like a real perspective). Heights are rounded to device pixels. The
 * drawing itself is in prototype.css; the jars on the «Додатково» shelf turn with it in shelf-jars.js.
 * With reduced motion the script does nothing and the shelves keep the
 * static top view.
 */
(function () {
  'use strict';

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var items = [];
  var frame = 0;

  function update() {
    frame = 0;
    var dpr = window.devicePixelRatio || 1;
    var half = window.innerHeight / 2;
    // read everything first, then write, so the browser lays out once
    function tAt(y) {
      return Math.max(-1, Math.min(1, (y - half) / half));
    }
    var reads = items.map(function (el) {
      var r = el.getBoundingClientRect();
      var cs = getComputedStyle(el);
      var o = {
        el: el,
        visible: r.width > 0 && r.bottom > -200 && r.top < window.innerHeight + 200,
        bottom: r.bottom,
        depth: parseFloat(cs.getPropertyValue('--shelf-depth')) || 0
      };
      return o;
    });
    reads.forEach(function (o) {
      if (!o.visible) return;
      var t = tAt(o.bottom);
      var h = Math.round(Math.abs(t) * o.depth * dpr) / dpr;
      o.el.style.setProperty('--shelf-h', h + 'px');
      o.el.style.setProperty('--shelf-under', t < 0 ? '1' : '0');
    });
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  function init() {
    items = Array.prototype.slice.call(
      document.querySelectorAll('.main__content-care .care-list > .item, .shelf-extra')
    );
    if (!items.length) return;
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // a hidden tab of steps (Ранок / Вечір) gets its shelves once shown
    document.addEventListener('click', schedule);
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
