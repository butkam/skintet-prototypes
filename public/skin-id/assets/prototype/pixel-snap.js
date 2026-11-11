/**
 * Prototype: snap small icons that sit in running text onto whole device pixels.
 *
 * An icon inline after text lands wherever the text ends (x = 520.63…), so its straight edges fall between
 * pixels and blur. Each [data-pixel-snap] element is nudged by the sub-pixel remainder (< half a device
 * pixel) with `translate`, recomputed on resize and once the web fonts have loaded and reflowed the text.
 *
 * A [data-pixel-snap-box] element is not moved: it gets --snap-left, --snap-right and --snap-bottom, the
 * remainders of its own edges, for its pseudo-elements to add to their offsets (the shelf under a scheme
 * step, whose column starts at x = 300.16…). Recomputed also when such a box changes size, e.g. when a
 * hidden tab of steps is shown.
 */
(function () {
  'use strict';

  function remainder(v, dpr) {
    return Math.round(v * dpr) / dpr - v;
  }

  function snap() {
    var dpr = window.devicePixelRatio || 1;
    document.querySelectorAll('[data-pixel-snap]').forEach(function (el) {
      el.style.translate = '';
      var r = el.getBoundingClientRect();
      var dx = remainder(r.left + window.scrollX, dpr);
      var dy = remainder(r.top + window.scrollY, dpr);
      if (dx || dy) {
        el.style.translate = dx.toFixed(4) + 'px ' + dy.toFixed(4) + 'px';
      }
    });
    document.querySelectorAll('[data-pixel-snap-box]').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (!r.width) return;
      el.style.setProperty('--snap-left', remainder(r.left + window.scrollX, dpr).toFixed(4) + 'px');
      el.style.setProperty('--snap-right', remainder(r.right + window.scrollX, dpr).toFixed(4) + 'px');
      el.style.setProperty('--snap-bottom', remainder(r.bottom + window.scrollY, dpr).toFixed(4) + 'px');
    });
  }

  var frame;
  function schedule() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(snap);
  }

  function observe() {
    if (!window.ResizeObserver) return;
    var ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    document.querySelectorAll('[data-pixel-snap-box]').forEach(function (el) {
      ro.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      observe();
      schedule();
    });
  } else {
    observe();
    schedule();
  }
  window.addEventListener('load', schedule);
  window.addEventListener('resize', schedule);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(schedule);
  }
})();
