/* Prototype: the logo opens a menu to switch between the Skin(ID) prototypes, instead of going to skintet.com.
   The list is public/skin-id/prototypes.json (src/variant.ts reads it too, for the checkout's menu). The
   current page is ticked, a page's states hang under it with a corner, as in the checkout's menu
   (AppNavigation.vue). Closes on a click elsewhere, Esc (back to the logo) or a second click on the logo */
(function () {
  'use strict';
  var logo = document.querySelector('.menu-logo a');
  if (!logo) return;

  var css =
    '.proto-switch{position:fixed;z-index:10000;min-width:240px;width:max-content;max-width:calc(100vw - 32px);' +
    'max-height:calc(100vh - 32px);overflow:auto;padding:8px;border-radius:16px;background:#fff;' +
    'box-shadow:0 8px 32px rgba(0,0,0,.12),0 1px 4px rgba(0,0,0,.06);font-family:Sailec,sans-serif;color:#1b1b1b;' +
    'transform-origin:top left;transition:opacity .16s ease,transform .22s cubic-bezier(.2,.8,.2,1)}' +
    '.proto-switch[hidden]{display:block!important;opacity:0;transform:translateY(-4px) scale(.98);visibility:hidden;' +
    'pointer-events:none;transition:opacity .12s ease,visibility 0s linear .12s}' +
    '.proto-switch__caption{margin:0;padding:8px 12px 4px;font-size:12px;line-height:16px;color:#6b6b6b}' +
    '.proto-switch__list{margin:0;padding:0;list-style:none}' +
    '.proto-switch__item{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:44px;' +
    'padding:0 12px;border-radius:10px;font-size:14px;line-height:20px;color:#1b1b1b;text-decoration:none;' +
    'transition:background-color .15s ease}' +
    '.proto-switch__item:focus-visible{outline:2px solid #1b1b1b;outline-offset:-2px}' +
    '@media (hover:hover) and (pointer:fine){.proto-switch__item:hover{background:#f5f5f5}}' +
    '.proto-switch__title{display:inline-flex;align-items:center;gap:8px}' +
    '.proto-switch__branch{flex:none;width:10px;height:10px;margin-top:-10px;border-left:1px solid #a4a4a4;' +
    'border-bottom:1px solid #a4a4a4;border-bottom-left-radius:2px}' +
    '.proto-switch__check{flex:none;display:block}' +
    '@media (prefers-reduced-motion:reduce){.proto-switch,.proto-switch[hidden]{transition:none}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var menu = document.createElement('nav');
  menu.className = 'proto-switch';
  menu.id = 'proto-switch';
  menu.setAttribute('aria-label', 'Прототипи');
  menu.hidden = true;
  menu.innerHTML = '<p class="proto-switch__caption">Прототипи</p><ul class="proto-switch__list"></ul>';
  document.body.appendChild(menu);
  var list = menu.querySelector('ul');

  logo.setAttribute('role', 'button');
  logo.setAttribute('aria-label', 'Прототипи');
  logo.setAttribute('aria-haspopup', 'true');
  logo.setAttribute('aria-controls', menu.id);
  logo.setAttribute('aria-expanded', 'false');

  // the page itself without index.html, and only the query that tells prototypes apart (?nav=anchors)
  function key(url) {
    var u = new URL(url, location.href);
    return u.pathname.replace(/index\.html$/, '') + '|' + (u.searchParams.get('nav') || '');
  }
  var here = key(location.href);
  var CHECK =
    '<svg class="proto-switch__check" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">' +
    '<path d="M3.75 9.34372C5.39062 10.375 6.26881 11.3215 7.25 13.125C8.34375 10.375 10.9688 6.25 14.25 4.875" ' +
    'stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function render(pages) {
    list.innerHTML = '';
    pages.forEach(function (p) {
      if (p.hidden) return; // older prototypes: out of the menu, still at their address
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.className = 'proto-switch__item';
      a.href = p.href;
      var title = document.createElement('span');
      title.className = 'proto-switch__title';
      if (p.branch) title.innerHTML = '<span class="proto-switch__branch" aria-hidden="true"></span>';
      title.appendChild(document.createTextNode(p.title));
      a.appendChild(title);
      if (key(p.href) === here) {
        a.setAttribute('aria-current', 'page');
        a.insertAdjacentHTML('beforeend', CHECK);
      }
      li.appendChild(a);
      list.appendChild(li);
    });
  }
  var loaded = fetch('prototypes.json', { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(render)
    .catch(function () {
      list.innerHTML = '<li class="proto-switch__item">Не вдалося завантажити список</li>';
    });

  function place() {
    var r = logo.getBoundingClientRect();
    var left = Math.max(16, Math.min(r.left - 12, window.innerWidth - menu.offsetWidth - 16));
    menu.style.left = left + 'px';
    menu.style.top = r.bottom + 8 + 'px';
  }
  function isOpen() { return !menu.hidden; }
  function open() {
    menu.hidden = false;
    logo.setAttribute('aria-expanded', 'true');
    place();
    loaded.then(function () {
      place();
      var first = menu.querySelector('[aria-current]') || menu.querySelector('a');
      if (first) first.focus({ preventScroll: true });
    });
  }
  function close(refocus) {
    if (!isOpen()) return;
    menu.hidden = true;
    logo.setAttribute('aria-expanded', 'false');
    if (refocus) logo.focus();
  }

  logo.addEventListener('click', function (e) {
    e.preventDefault();
    if (isOpen()) close(false);
    else open();
  });
  logo.addEventListener('keydown', function (e) {
    if (e.key === ' ') { e.preventDefault(); logo.click(); }
  });
  document.addEventListener('pointerdown', function (e) {
    if (isOpen() && !menu.contains(e.target) && !logo.contains(e.target)) close(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) close(true);
  });
  window.addEventListener('resize', function () { if (isOpen()) place(); });
  window.addEventListener('scroll', function () { if (isOpen()) place(); }, { passive: true });
})();
