/**
 * Prototype: the jars of «Додатково з твоєї полички», drawn as an SVG behind each card's text, turning in
 * perspective with the page's scroll like the shelf under them (shelf-perspective.js).
 *
 * A wide jar with rounded edges: a lid band and a body. The eye is at the middle of the screen; each rim
 * (the top, the lid's seam, the bottom) is as round as how far it is from there (t from −1 at the top of
 * the screen to 1 at the bottom, up to --jar-ry): mostly the shelf's t, a rim's own height adding only a
 * little (SPREAD), so the jar turns with the shelf; and seen from above or below by its side of the eye: from
 * above the top rim shows whole and the others their front, lower half; from below every rim shows its
 * front as the upper half. The rounded edges: the top and bottom outlines are the rim's ellipse taken
 * --jar-corner in and offset back out by it, so the corners keep that radius at any angle (at eye level the
 * jar is a rectangle with rounded corners). The jar stands on the shelf --jar-stand back from its front
 * edge, foreshortened like the shelf's top: lifted off the plank seen from above, sunk behind it (the plank
 * is drawn over the jars) seen from below, the whole jar with its text moving (--jar-shift, a transform),
 * so it keeps its height. All jars in the row are the same, so one set of paths is drawn
 * into each. With reduced motion the jars stay as seen from a little above.
 */
(function () {
  'use strict';

  var SVG = 'http://www.w3.org/2000/svg';
  var LINE = '#dcdcdc';
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function num(cs, name) {
    return parseFloat(cs.getPropertyValue(name)) || 0;
  }

  // points of the outline of an ellipse (centre cx, y; radii a, b) offset out by c, the upper half
  // (upper = true, left to right) or the lower one (right to left). Sampled both along the ellipse and
  // along the offset's direction, so the round ends stay round even when the ellipse is nearly flat
  function offsetHalf(cx, y, a, b, c, upper) {
    b = Math.max(b, 0.05);
    var ts = [];
    var n = 40;
    for (var i = 0; i <= n; i++) {
      var f = i / n;
      ts.push(Math.PI * f);                                                     // along the ellipse
      var phi = Math.PI * f;
      ts.push(Math.atan2(b * Math.sin(phi), a * Math.cos(phi)));                // along the normal
    }
    ts = ts.map(function (t) { return t < 0 ? t + Math.PI * 2 : t; })
      .filter(function (t) { return t >= 0 && t <= Math.PI + 1e-9; })
      .sort(function (p, q) { return p - q; });
    var pts = ts.map(function (t) {
      var ct = Math.cos(t), st = Math.sin(t);
      var nx = b * ct, ny = a * st, len = Math.hypot(nx, ny) || 1;
      // lower half: sin > 0 (down on the screen); upper: mirrored
      var sy = upper ? -1 : 1;
      return [cx + a * ct + c * nx / len, y + sy * (b * st + c * ny / len)];
    });
    // lower half runs right to left (t: 0 → π); the upper one we want left to right
    if (upper) pts.reverse();
    return pts;
  }

  function line(pts, move) {
    return pts.map(function (p, i) {
      return (i === 0 && move ? 'M' : 'L') + p[0].toFixed(2) + ' ' + p[1].toFixed(2);
    }).join('');
  }

  // the front half of a plain rim (no corner), from side to side: lower (from above) or upper (from below)
  function rim(cx, y, R, ry, under) {
    return 'M' + (cx - R) + ' ' + y.toFixed(2) + 'A' + R + ' ' + Math.max(ry, 0.01).toFixed(2) + ' 0 0 ' +
      (under ? 1 : 0) + ' ' + (cx + R) + ' ' + y.toFixed(2);
  }

  function init() {
    var section = document.querySelector('.shelf-extra');
    if (!section) return;
    var cards = Array.prototype.slice.call(section.querySelectorAll('.shelf-extra__card'));
    var jars = cards.map(function (card) {
      var holder = card.querySelector('.shelf-extra__jar');
      var svg = document.createElementNS(SVG, 'svg');
      svg.setAttribute('aria-hidden', 'true');
      var fill = document.createElementNS(SVG, 'path');
      fill.setAttribute('fill', '#fff');
      var lines = document.createElementNS(SVG, 'path');
      lines.setAttribute('fill', 'none');
      lines.setAttribute('stroke', LINE);
      lines.setAttribute('stroke-linejoin', 'round');
      svg.appendChild(fill);
      svg.appendChild(lines);
      holder.appendChild(svg);
      return { card: card, svg: svg, fill: fill, lines: lines };
    });
    if (!jars.length) return;

    var frame = 0;
    var shift = 0; // the jars' current shift (a transform, so the layout never moves)
    function draw() {
      frame = 0;
      var cs = getComputedStyle(section);
      var dpr = window.devicePixelRatio || 1;
      var half = window.innerHeight / 2;
      var first = jars[0].card.getBoundingClientRect();
      var cardTop = first.top - shift; // where the card is laid out, without the shift
      var plankScreen = section.getBoundingClientRect().bottom - num(cs, '--shelf-plank');
      var W = first.width, H = first.height;
      if (!W) return;
      var ryMax = num(cs, '--jar-ry'), lid = num(cs, '--jar-lid'), corner = num(cs, '--jar-corner');
      var stand = num(cs, '--jar-stand'), plank = num(cs, '--shelf-plank');

      var cx = W / 2, R = (W - 1) / 2, a = R - corner;
      var y0 = 1 + ryMax + corner;     // the top face's centre (the rounded edge rises corner above it)
      var yl = y0 + lid;               // the lid's seam
      var tShelf = still ? 0.6 : Math.max(-1, Math.min(1, (plankScreen - half) / half));
      // a rim higher up the jar is a little nearer the eye line, but only a little: taken fully, the eye at
      // the middle of the screen reads like a wide-angle lens, the lid flat while the shelf still tilts
      var SPREAD = 0.3;
      function tAt(y) {
        if (still) return 0.6;
        var own = Math.max(-1, Math.min(1, (cardTop + shift + y - half) / half));
        return tShelf + (own - tShelf) * SPREAD;
      }
      var tTop = tAt(y0), tLid = tAt(yl);
      var tBot = still ? 0.6 : tShelf;
      var ryTop = Math.abs(tTop) * ryMax, ryLid = Math.abs(tLid) * ryMax, ryBot = Math.abs(tBot) * ryMax;
      // the inner ellipses (the flat top and bottom faces) keep the rims' proportions, taken in by the corner
      var bTop = ryTop * a / R, bBot = ryBot * a / R;
      // the jar is rigid: its bottom face sits where its outline's front (corner below it) is on the
      // plank's top, and the whole jar with its text moves (--jar-shift) to stand on the shelf: lifted by
      // the stand foreshortened like the shelf's top, and by the bottom rim's curve, seen from above; sunk
      // behind the plank seen from below. So it keeps its height and slides with the shelf instead
      var yb = H - plank - corner;
      var next = tShelf >= 0 ? -(stand * tShelf + bBot) : stand * -tShelf;
      shift = Math.round(next * dpr) / dpr;
      section.style.setProperty('--jar-shift', shift + 'px');

      var top = offsetHalf(cx, y0, a, bTop, corner, true);     // upper half, left to right
      var bottom = offsetHalf(cx, yb, a, bBot, corner, false); // lower half, right to left
      var outline = line(top, true) + line(bottom, false) + 'Z';
      var d = outline;
      // from above, the front of the flat top: where the rounded edge starts
      if (tTop >= 0) {
        d += rim(cx, y0, a, bTop, false);
      }
      d += rim(cx, yl, R, ryLid, tLid < 0);

      jars.forEach(function (j) {
        j.svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
        j.fill.setAttribute('d', outline);
        j.lines.setAttribute('d', d);
      });
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(draw);
    }
    draw();
    if (!still) window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
