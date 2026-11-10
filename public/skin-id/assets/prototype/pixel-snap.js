/**
 * Prototype: snap small icons that sit in running text onto whole device pixels.
 *
 * An icon inline after text lands wherever the text ends (x = 520.63…), so its straight edges fall between
 * pixels and blur. Each [data-pixel-snap] element is nudged by the sub-pixel remainder (< half a device
 * pixel) with `translate`, recomputed on resize and once the web fonts have loaded and reflowed the text.
 */
(function () {
  'use strict';

  function snap() {
    var dpr = window.devicePixelRatio || 1;
    document.querySelectorAll('[data-pixel-snap]').forEach(function (el) {
      el.style.translate = '';
      var r = el.getBoundingClientRect();
      var x = r.left + window.scrollX;
      var y = r.top + window.scrollY;
      var dx = Math.round(x * dpr) / dpr - x;
      var dy = Math.round(y * dpr) / dpr - y;
      if (dx || dy) {
        el.style.translate = dx.toFixed(4) + 'px ' + dy.toFixed(4) + 'px';
      }
    });
  }

  var frame;
  function schedule() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(snap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }
  window.addEventListener('load', schedule);
  window.addEventListener('resize', schedule);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(schedule);
  }
})();
