/*
 * Prototype: the catalog menu on top of the live skintet.com header (Figma page «Cat»).
 *
 * Mobile (≤1024px, the live burger menu):
 *   Меню → Каталог: sections with icons → a section: its categories as pills, a tap opens the
 *   subcategory links under the pill → Бестселери (Обличчя only), Skin(ID) promo at the bottom of every level.
 *   The live script still opens #item_1 on «Каталог» and closes everything on the burger / Escape.
 * Desktop (>1024px, the live hover dropdown under «Каталог»): the mega menu from Figma 521:7110 —
 *   sections on the left, the section's pills in the middle with the open pill's links under its row,
 *   Бестселери, Skin(ID) promo on the right.
 *
 * Data: Google Sheet «Каталог меню» → «Каталог (меню навігації)», 5 листопада 2026.
 */
(function () {
  'use strict'

  const IMG = '../catalog-menu/assets/images/'

  /* ── Icons (exported from Figma «Іконки меню» → «UI icon/…»: 1px strokes on half pixels, so they sit on the pixel grid;
     colours are currentColor so a selected pill turns them white) ── */

  const ICON = {
    // «›»: opens the next level of the menu (the desktop sections' chevron, at 20px)
    chevron20:
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M8.5 5.5L12.5 9.5L8.5 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrowRight:
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3.75 10H16.25M11.25 5L16.25 10L11.25 15" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrowSmall:
      '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2.5 7.5H11.5M8.5 4.5L11.5 7.5L8.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    back:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 11.5H4.5M10.5 5.5L4.5 11.5L10.5 17.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevron:
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6.5 3.5L10.5 7.5L6.5 11.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    // «↗»: a link that leads to a page (a category without subcategories, «Всі продукти»)
    out14:
      '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M4.5 9.5L9.5 4.5M9.5 8.5V4.5H5.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    out16:
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M5.5 10.5L10.5 5.5M10.5 9.5V5.5H6.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    out20:
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6.5 13.5L13.5 6.5M13.5 12.5V6.5H7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrowUpRight:
      '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M4.375 10.625L10.625 4.375M10.625 10V4.375H5" stroke="currentColor" stroke-width="0.9375" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  }

  /* 20px section icons, exported from Figma «Cat» → «Іконки меню» (components «Section icon/…»): 1px strokes with
     every straight line centred on a half pixel, so they sit on the pixel grid */
  const SECTION_ICON = {
    'Всі продукти':
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3.5 3.5H8.5V7.5H3.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.5 12.5H16.5V16.5H11.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5 10.5H8.5V16.5H3.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.5 3.5H16.5V9.5H11.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'Обличчя':
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 17.5C14.142 17.5 17.5 14.142 17.5 10C17.5 5.858 14.142 2.5 10 2.5C5.858 2.5 2.5 5.858 2.5 10C2.5 14.142 5.858 17.5 10 17.5Z" stroke="currentColor"/><path d="M13.812 11.663C13.493 11.526 13.174 11.39 12.854 11.254C12.799 11.366 12.741 11.469 12.675 11.572C12.102 12.494 11.065 13.027 10.002 13.021C8.939 13.025 7.902 12.491 7.325 11.57C7.259 11.467 7.201 11.364 7.145 11.252C6.826 11.39 6.507 11.527 6.188 11.664C6.246 11.816 6.31 11.96 6.385 12.105C7.039 13.419 8.523 14.289 10.001 14.271C11.479 14.293 12.967 13.422 13.617 12.104C13.692 11.958 13.755 11.815 13.812 11.663Z" fill="currentColor"/><path d="M9 8.25C9 9.172 8.44 9.75 7.75 9.75C7.06 9.75 6.5 9.172 6.5 8.25C6.5 7.328 7.06 6.75 7.75 6.75C8.44 6.75 9 7.328 9 8.25Z" fill="currentColor"/><path d="M13.5 8.25C13.5 9.172 12.94 9.75 12.25 9.75C11.56 9.75 11 9.172 11 8.25C11 7.328 11.56 6.75 12.25 6.75C12.94 6.75 13.5 7.328 13.5 8.25Z" fill="currentColor"/></svg>',
    'Макіяж':
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M8.5 7.5V4.5L11.5 2.5V7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.5 7.5H12.5V10.5H7.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 10.5H13.5V16.5C13.5 17.052 13.052 17.5 12.5 17.5H7.5C6.948 17.5 6.5 17.052 6.5 16.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'Зона навколо очей':
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2.5 8.5C6 3.5 14 3.5 17.5 8.5C14 13.5 6 13.5 2.5 8.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 6C11.381 6 12.5 7.119 12.5 8.5C12.5 9.881 11.381 11 10 11C8.619 11 7.5 9.881 7.5 8.5C7.5 7.119 8.619 6 10 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.5 15.5C8 16.833 12 16.833 14.5 15.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'Губи':
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2 10C4 7.5 6.2 5.5 7.9 5.5C8.9 5.5 9.5 6 10 6.5C10.5 6 11.1 5.5 12.1 5.5C13.8 5.5 16 7.5 18 10C16 13 13.2 14.5 10 14.5C6.8 14.5 4 13 2 10Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 10C6 10.9 14 10.9 18 10" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'Вії та брови':
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3.5 6.5C7 3.5 13 3.25 17.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 10.5C7 14.25 14 14.25 17 10.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5 13.5V16.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.1 12.6L6.1 15.1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.9 12.6L14.9 15.1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'Волосся':
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 2.5C7 5 3 7.5 5 10C7 12.5 3 15 5 17.5M10 2.5C12 5 8 7.5 10 10C12 12.5 8 15 10 17.5M15 2.5C17 5 13 7.5 15 10C17 12.5 13 15 15 17.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'Тіло':
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 5.5C11.105 5.5 12 4.605 12 3.5C12 2.395 11.105 1.5 10 1.5C8.895 1.5 8 2.395 8 3.5C8 4.605 8.895 5.5 10 5.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.5 18.5V15.5H14.5L12.5 7.5H7.5L5.5 15.5H7.5V18.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'Набори':
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2.5 10.5H17.5V16.5C17.5 17.052 17.052 17.5 16.5 17.5H3.5C2.948 17.5 2.5 17.052 2.5 16.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.5 10.5V6.5C5.5 5.948 5.948 5.5 6.5 5.5H7.5C8.052 5.5 8.5 5.948 8.5 6.5V10.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 5.5V3.5H7.5V5.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5 10.5V8.5C10.5 7.948 10.948 7.5 11.5 7.5H13.5C14.052 7.5 14.5 7.948 14.5 8.5V10.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.5 7.5V5.5H13.5V7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 14.5H11.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'Гаджети та аксесуари':
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5.5 11.5L11.5 3.5L11 8.5H14.5L8.5 16.5L9 11.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  }


  /* 15px pill glyphs, exported from Figma «Cat» → «Іконки субменю · 30» (components «Pill icon/…», 9 листопада 2026),
     in the style of the icons on skintet.com: the body («Форма») in a top-to-bottom fade, details («Деталь») at 40%
     with square ends, never over the body: plain space of 0.6px or more between them.
     A function, so every render gets its own gradient id: the same pills sit in the mobile panel and the
     desktop dropdown, and Safari draws nothing for a url(#id) that points into a hidden copy */
  let gradients = 0
  const glyph = (body, details, evenodd) => () => {
    const id = `cm-g-${++gradients}`
    return `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="currentColor"/><stop offset="1" stop-color="currentColor" stop-opacity="0.4"/></linearGradient></defs><path d="${body}" fill="url(#${id})"${evenodd ? ' fill-rule="evenodd"' : ''}/>${details
      .map((d) => `<path d="${d}" fill="currentColor" opacity="0.4"/>`)
      .join('')}</svg>`
  }

  const PILL_ICON = {
    'Креми для обличчя': glyph('M3.75 5.25L11.25 5.25C12.355 5.25 13.25 6.145 13.25 7.25L13.25 11.5C13.25 12.605 12.355 13.5 11.25 13.5L3.75 13.5C2.645 13.5 1.75 12.605 1.75 11.5L1.75 7.25C1.75 6.145 2.645 5.25 3.75 5.25Z', ['M4 1.5L11 1.5C11.414 1.5 11.75 1.836 11.75 2.25L11.75 3.5C11.75 3.914 11.414 4.25 11 4.25L4 4.25C3.586 4.25 3.25 3.914 3.25 3.5L3.25 2.25C3.25 1.836 3.586 1.5 4 1.5Z']),
    'Сироватки для обличчя': glyph('M5.5 6.5L9.5 6.5C10.605 6.5 11.5 7.395 11.5 8.5L11.5 11.75C11.5 12.855 10.605 13.75 9.5 13.75L5.5 13.75C4.395 13.75 3.5 12.855 3.5 11.75L3.5 8.5C3.5 7.395 4.395 6.5 5.5 6.5Z', ['M7.375 0.75L7.625 0.75C8.384 0.75 9 1.366 9 2.125C9 2.884 8.384 3.5 7.625 3.5L7.375 3.5C6.616 3.5 6 2.884 6 2.125C6 1.366 6.616 0.75 7.375 0.75Z', 'M5.5 4.25L9.5 4.25C9.776 4.25 10 4.474 10 4.75L10 5.25C10 5.526 9.776 5.75 9.5 5.75L5.5 5.75C5.224 5.75 5 5.526 5 5.25L5 4.75C5 4.474 5.224 4.25 5.5 4.25Z']),
    'Пілінги та ексфоліанти': glyph('M3.75 1.75L11.25 1.75C12.355 1.75 13.25 2.645 13.25 3.75L13.25 6.5L7 7L6.5 13.25L3.75 13.25C2.645 13.25 1.75 12.355 1.75 11.25L1.75 3.75C1.75 2.645 2.645 1.75 3.75 1.75Z', ['M13.25 7.25L7.75 7.75L7.25 13.25C9.75 12.75 12.75 9.75 13.25 7.25Z']),
    'Тоніки для обличчя': glyph('M5.5 5L9.5 5C10.743 5 11.75 6.007 11.75 7.25L11.75 11.5C11.75 12.743 10.743 13.75 9.5 13.75L5.5 13.75C4.257 13.75 3.25 12.743 3.25 11.5L3.25 7.25C3.25 6.007 4.257 5 5.5 5Z', ['M6 1.25L9 1.25C9.414 1.25 9.75 1.586 9.75 2L9.75 3.25C9.75 3.664 9.414 4 9 4L6 4C5.586 4 5.25 3.664 5.25 3.25L5.25 2C5.25 1.586 5.586 1.25 6 1.25Z']),
    'Очищення обличчя': glyph('M9 4.75C11.485 4.75 13.5 6.765 13.5 9.25C13.5 11.735 11.485 13.75 9 13.75C6.515 13.75 4.5 11.735 4.5 9.25C4.5 6.765 6.515 4.75 9 4.75ZM7.4 6.6C7.98 6.6 8.45 7.07 8.45 7.65C8.45 8.23 7.98 8.7 7.4 8.7C6.82 8.7 6.35 8.23 6.35 7.65C6.35 7.07 6.82 6.6 7.4 6.6Z', ['M3.5 2.4C4.605 2.4 5.5 3.295 5.5 4.4C5.5 5.505 4.605 6.4 3.5 6.4C2.395 6.4 1.5 5.505 1.5 4.4C1.5 3.295 2.395 2.4 3.5 2.4Z', 'M8.4 1.25C9.035 1.25 9.55 1.765 9.55 2.4C9.55 3.035 9.035 3.55 8.4 3.55C7.765 3.55 7.25 3.035 7.25 2.4C7.25 1.765 7.765 1.25 8.4 1.25Z'], true),
    'Зняття макіяжу': glyph('M6.5 3.25C9.4 3.25 11.75 5.6 11.75 8.5C11.75 11.4 9.4 13.75 6.5 13.75C3.6 13.75 1.25 11.4 1.25 8.5C1.25 5.6 3.6 3.25 6.5 3.25ZM4.6 5.95C4.959 5.95 5.25 6.241 5.25 6.6C5.25 6.959 4.959 7.25 4.6 7.25C4.241 7.25 3.95 6.959 3.95 6.6C3.95 6.241 4.241 5.95 4.6 5.95ZM8.4 5.95C8.759 5.95 9.05 6.241 9.05 6.6C9.05 6.959 8.759 7.25 8.4 7.25C8.041 7.25 7.75 6.959 7.75 6.6C7.75 6.241 8.041 5.95 8.4 5.95ZM6.5 7.85C6.859 7.85 7.15 8.141 7.15 8.5C7.15 8.859 6.859 9.15 6.5 9.15C6.141 9.15 5.85 8.859 5.85 8.5C5.85 8.141 6.141 7.85 6.5 7.85ZM4.6 9.75C4.959 9.75 5.25 10.041 5.25 10.4C5.25 10.759 4.959 11.05 4.6 11.05C4.241 11.05 3.95 10.759 3.95 10.4C3.95 10.041 4.241 9.75 4.6 9.75ZM8.4 9.75C8.759 9.75 9.05 10.041 9.05 10.4C9.05 10.759 8.759 11.05 8.4 11.05C8.041 11.05 7.75 10.759 7.75 10.4C7.75 10.041 8.041 9.75 8.4 9.75Z', ['M12.5 0.9C13.25 1.85 13.9 2.85 13.9 3.9C13.9 4.67 13.27 5.3 12.5 5.3C11.73 5.3 11.1 4.67 11.1 3.9C11.1 2.85 11.75 1.85 12.5 0.9Z'], true),
    'Сонцезахист для обличчя': glyph('M7.5 3.75C9.571 3.75 11.25 5.429 11.25 7.5C11.25 9.571 9.571 11.25 7.5 11.25C5.429 11.25 3.75 9.571 3.75 7.5C3.75 5.429 5.429 3.75 7.5 3.75Z', ['M7.969 2.526L7.969 0.636L7.031 0.636L7.031 2.526Z', 'M11.349 4.314L12.685 2.978L12.022 2.315L10.686 3.651Z', 'M12.474 7.969L14.364 7.969L14.364 7.031L12.474 7.031Z', 'M10.686 11.349L12.022 12.685L12.685 12.022L11.349 10.686Z', 'M7.031 12.474L7.031 14.364L7.969 14.364L7.969 12.474Z', 'M3.651 10.686L2.315 12.022L2.978 12.685L4.314 11.349Z', 'M2.526 7.031L0.636 7.031L0.636 7.969L2.526 7.969Z', 'M4.314 3.651L2.978 2.315L2.315 2.978L3.651 4.314Z']),
    'Макіяж обличчя': glyph('M7.5 1C10 2.5 10.5 5.5 9.75 7L5.25 7C4.5 5.5 5 2.5 7.5 1Z', ['M5.75 7.75L9.25 7.75C9.526 7.75 9.75 7.974 9.75 8.25L9.75 9.25C9.75 9.526 9.526 9.75 9.25 9.75L5.75 9.75C5.474 9.75 5.25 9.526 5.25 9.25L5.25 8.25C5.25 7.974 5.474 7.75 5.75 7.75Z', 'M6.25 10.5L8.75 10.5L8.3 14.25L6.7 14.25L6.25 10.5Z']),
    'Макіяж очей': glyph('M3 4.5L12 4.5C12.967 4.5 13.75 5.283 13.75 6.25L13.75 8.75C13.75 9.717 12.967 10.5 12 10.5L3 10.5C2.033 10.5 1.25 9.717 1.25 8.75L1.25 6.25C1.25 5.283 2.033 4.5 3 4.5ZM4 6.25C4.69 6.25 5.25 6.81 5.25 7.5C5.25 8.19 4.69 8.75 4 8.75C3.31 8.75 2.75 8.19 2.75 7.5C2.75 6.81 3.31 6.25 4 6.25ZM7.5 6.25C8.19 6.25 8.75 6.81 8.75 7.5C8.75 8.19 8.19 8.75 7.5 8.75C6.81 8.75 6.25 8.19 6.25 7.5C6.25 6.81 6.81 6.25 7.5 6.25ZM11 6.25C11.69 6.25 12.25 6.81 12.25 7.5C12.25 8.19 11.69 8.75 11 8.75C10.31 8.75 9.75 8.19 9.75 7.5C9.75 6.81 10.31 6.25 11 6.25Z', [], true),
    'Макіяж брів': glyph('M4.634 12.134L10.334 6.434L8.566 4.666L2.866 10.366L4.634 12.134Z', ['M9.12 4.12L11.9 3.1L10.88 5.88L9.12 4.12Z', 'M2.384 14.384L4.084 12.684L2.316 10.916L0.616 12.616L2.384 14.384Z']),
    'Макіяж губ': glyph('M4.75 8.75L10.25 8.75L10.25 12.85C10.25 13.35 9.85 13.75 9.35 13.75L5.65 13.75C5.15 13.75 4.75 13.35 4.75 12.85L4.75 8.75Z', ['M5.55 6L9.45 6C9.616 6 9.75 6.134 9.75 6.3L9.75 7.7C9.75 7.866 9.616 8 9.45 8L5.55 8C5.384 8 5.25 7.866 5.25 7.7L5.25 6.3C5.25 6.134 5.384 6 5.55 6Z', 'M5.75 5.25L5.75 3.05C5.75 2.78 5.89 2.53 6.12 2.39L8.49 0.96C8.82 0.76 9.25 1 9.25 1.39L9.25 5.25L5.75 5.25Z']),
    'Креми для шкіри навколо очей': glyph('M4.52 11.75L10.48 11.75L9.75 6.25L5.25 6.25L4.52 11.75Z', ['M4.25 12.5L10.75 12.5C11.026 12.5 11.25 12.724 11.25 13L11.25 13.5C11.25 13.776 11.026 14 10.75 14L4.25 14C3.974 14 3.75 13.776 3.75 13.5L3.75 13C3.75 12.724 3.974 12.5 4.25 12.5Z', 'M6.5 5.5L6.95 2.15C7.05 1.5 7.95 1.5 8.05 2.15L8.5 5.5L6.5 5.5Z']),
    'Сироватки для шкіри навколо очей': glyph('M6.25 6.25L8.75 6.25C9.717 6.25 10.5 7.033 10.5 8L10.5 12C10.5 12.967 9.717 13.75 8.75 13.75L6.25 13.75C5.283 13.75 4.5 12.967 4.5 12L4.5 8C4.5 7.033 5.283 6.25 6.25 6.25Z', ['M7.5 0.75C8.19 0.75 8.75 1.31 8.75 2C8.75 2.69 8.19 3.25 7.5 3.25C6.81 3.25 6.25 2.69 6.25 2C6.25 1.31 6.81 0.75 7.5 0.75Z', 'M6.15 4L8.85 4C9.071 4 9.25 4.179 9.25 4.4L9.25 5.1C9.25 5.321 9.071 5.5 8.85 5.5L6.15 5.5C5.929 5.5 5.75 5.321 5.75 5.1L5.75 4.4C5.75 4.179 5.929 4 6.15 4Z']),
    'Догляд за губами': glyph('M1.4 8.25C3 6.3 4.65 4.65 5.93 4.65C6.68 4.65 7.13 5.1 7.5 5.55C7.88 5.1 8.33 4.65 9.08 4.65C10.35 4.65 12 6.3 13.6 8.25C12 10.65 9.9 12 7.5 12C5.1 12 3 10.65 1.4 8.25ZM1.4 8.25C4.5 9.05 10.5 9.05 13.6 8.25C10.5 9.75 4.5 9.75 1.4 8.25Z', ['M12.4 0.8L12.82 1.78L13.8 2.2L12.82 2.62L12.4 3.6L11.98 2.62L11 2.2L11.98 1.78L12.4 0.8Z'], true),
    'Догляд за віями': glyph('M1.5 4.5C4.5 9.75 10.5 9.75 13.5 4.5C10.5 6.5 4.5 6.5 1.5 4.5Z', ['M7.05 9.2L7.05 12.2L7.95 12.2L7.95 9.2L7.05 9.2Z', 'M3.869 8.372L3.069 11.072L3.931 11.328L4.731 8.628L3.869 8.372Z', 'M10.269 8.628L11.069 11.328L11.931 11.072L11.131 8.372L10.269 8.628Z']),
    'Догляд за бровами': glyph('M1.5 9.25C3.75 4.75 9.25 3.5 13.5 6L13 7.4C9.5 5.75 5.25 6.75 2.75 10.25L1.5 9.25Z', ['M11.25 8.25C12.15 9.375 12.75 10.275 12.75 11.4C12.75 12.225 12.075 12.9 11.25 12.9C10.425 12.9 9.75 12.225 9.75 11.4C9.75 10.275 10.35 9.375 11.25 8.25Z']),
    'Очищення вій та брів': glyph('M1.5 5C4.5 10.25 10.5 10.25 13.5 5C10.5 7 4.5 7 1.5 5Z', ['M7.05 9.7L7.05 12.7L7.95 12.7L7.95 9.7L7.05 9.7Z', 'M3.869 8.872L3.069 11.572L3.931 11.828L4.731 9.128L3.869 8.872Z', 'M10.269 9.128L11.069 11.828L11.931 11.572L11.131 8.872L10.269 9.128Z', 'M10.75 1.05C11.413 1.05 11.95 1.587 11.95 2.25C11.95 2.913 11.413 3.45 10.75 3.45C10.087 3.45 9.55 2.913 9.55 2.25C9.55 1.587 10.087 1.05 10.75 1.05Z', 'M13.1 2.85C13.514 2.85 13.85 3.186 13.85 3.6C13.85 4.014 13.514 4.35 13.1 4.35C12.686 4.35 12.35 4.014 12.35 3.6C12.35 3.186 12.686 2.85 13.1 2.85Z', 'M8.4 1.15C8.731 1.15 9 1.419 9 1.75C9 2.081 8.731 2.35 8.4 2.35C8.069 2.35 7.8 2.081 7.8 1.75C7.8 1.419 8.069 1.15 8.4 1.15Z']),
    'Шампуні для волосся': glyph('M5.75 5.5L9.25 5.5C10.355 5.5 11.25 6.395 11.25 7.5L11.25 11.5C11.25 12.605 10.355 13.5 9.25 13.5L5.75 13.5C4.645 13.5 3.75 12.605 3.75 11.5L3.75 7.5C3.75 6.395 4.645 5.5 5.75 5.5Z', ['M6.75 4.75L6.75 3.5L5.5 3.5L5.5 2.25L12.25 2.25L12.25 3.5L8.25 3.5L8.25 4.75L6.75 4.75Z']),
    'Кондиціонери для волосся': glyph('M3.75 1.75L11.25 1.75C11.25 5 10.75 7.5 10 9.5L5 9.5C4.25 7.5 3.75 5 3.75 1.75Z', ['M5.5 10.25L9.5 10.25C10.052 10.25 10.5 10.698 10.5 11.25L10.5 12.75C10.5 13.302 10.052 13.75 9.5 13.75L5.5 13.75C4.948 13.75 4.5 13.302 4.5 12.75L4.5 11.25C4.5 10.698 4.948 10.25 5.5 10.25Z']),
    'Маски для волосся': glyph('M3.75 6L11.25 6C12.355 6 13.25 6.895 13.25 8L13.25 11.25C13.25 12.355 12.355 13.25 11.25 13.25L3.75 13.25C2.645 13.25 1.75 12.355 1.75 11.25L1.75 8C1.75 6.895 2.645 6 3.75 6ZM1.75 9.1C3.4 8.1 4.85 10.1 6.5 9.1C8.15 8.1 9.6 10.1 11.25 9.1C12 8.65 12.7 8.7 13.25 9L13.25 10.2C12.7 9.9 12 9.85 11.25 10.3C9.6 11.3 8.15 9.3 6.5 10.3C4.85 11.3 3.4 9.3 1.75 10.3L1.75 9.1Z', ['M3.25 3L11.75 3C12.164 3 12.5 3.336 12.5 3.75L12.5 4.5C12.5 4.914 12.164 5.25 11.75 5.25L3.25 5.25C2.836 5.25 2.5 4.914 2.5 4.5L2.5 3.75C2.5 3.336 2.836 3 3.25 3Z'], true),
    'Незмивний догляд': glyph('M6 6.5L8.5 6.5C9.467 6.5 10.25 7.283 10.25 8.25L10.25 12C10.25 12.967 9.467 13.75 8.5 13.75L6 13.75C5.033 13.75 4.25 12.967 4.25 12L4.25 8.25C4.25 7.283 5.033 6.5 6 6.5Z', ['M5.75 5.75L5.75 2.75L9 2.75L11.25 3.75L11.25 5L9 5L9 5.75L5.75 5.75Z', 'M12.75 1.7C13.054 1.7 13.3 1.946 13.3 2.25C13.3 2.554 13.054 2.8 12.75 2.8C12.446 2.8 12.2 2.554 12.2 2.25C12.2 1.946 12.446 1.7 12.75 1.7Z', 'M13.6 3.45C13.904 3.45 14.15 3.696 14.15 4C14.15 4.304 13.904 4.55 13.6 4.55C13.296 4.55 13.05 4.304 13.05 4C13.05 3.696 13.296 3.45 13.6 3.45Z', 'M12.75 5.2C13.054 5.2 13.3 5.446 13.3 5.75C13.3 6.054 13.054 6.3 12.75 6.3C12.446 6.3 12.2 6.054 12.2 5.75C12.2 5.446 12.446 5.2 12.75 5.2Z']),
    'Догляд за шкірою голови': glyph('M7.5 0.75C9.42 3.15 10.7 5.07 10.7 7.47C10.7 9.23 9.26 10.67 7.5 10.67C5.74 10.67 4.3 9.23 4.3 7.47C4.3 5.07 5.58 3.15 7.5 0.75Z', ['M1.75 12.25C3.4 11.25 4.85 13.25 6.5 12.25C8.15 11.25 9.6 13.25 11.25 12.25C12 11.8 12.7 11.85 13.25 12.15L13.25 13.35C12.7 13.05 12 13 11.25 13.45C9.6 14.45 8.15 12.45 6.5 13.45C4.85 14.45 3.4 12.45 1.75 13.45L1.75 12.25Z']),
    'Догляд за бородою': glyph('M2.5 4.5C2.5 10 4.5 13.75 7.5 13.75C10.5 13.75 12.5 10 12.5 4.5C11.5 7.25 10 8.5 7.5 8.5C5 8.5 3.5 7.25 2.5 4.5Z', ['M3.9 5C5.45 3.75 6.75 3.95 7.5 4.7C8.25 3.95 9.55 3.75 11.1 5C9.8 5.85 8.5 5.95 7.5 5.55C6.5 5.95 5.2 5.85 3.9 5Z']),
    'Зволоження тіла': glyph('M6.25 2C8.65 5 10.25 7.4 10.25 10.4C10.25 12.6 8.45 14.4 6.25 14.4C4.05 14.4 2.25 12.6 2.25 10.4C2.25 7.4 3.85 5 6.25 2Z', ['M12 1.75C12.81 2.763 13.35 3.573 13.35 4.585C13.35 5.328 12.742 5.935 12 5.935C11.258 5.935 10.65 5.328 10.65 4.585C10.65 3.573 11.19 2.763 12 1.75Z']),
    'Ексфоліація тіла': glyph('M5 4.5L10 4.5C11.795 4.5 13.25 5.955 13.25 7.75L13.25 10.25C13.25 12.045 11.795 13.5 10 13.5L5 13.5C3.205 13.5 1.75 12.045 1.75 10.25L1.75 7.75C1.75 5.955 3.205 4.5 5 4.5ZM5 7.2C5.442 7.2 5.8 7.558 5.8 8C5.8 8.442 5.442 8.8 5 8.8C4.558 8.8 4.2 8.442 4.2 8C4.2 7.558 4.558 7.2 5 7.2ZM8.5 6.6C8.859 6.6 9.15 6.891 9.15 7.25C9.15 7.609 8.859 7.9 8.5 7.9C8.141 7.9 7.85 7.609 7.85 7.25C7.85 6.891 8.141 6.6 8.5 6.6ZM10.25 9.45C10.692 9.45 11.05 9.808 11.05 10.25C11.05 10.692 10.692 11.05 10.25 11.05C9.808 11.05 9.45 10.692 9.45 10.25C9.45 9.808 9.808 9.45 10.25 9.45ZM6.25 10.6C6.609 10.6 6.9 10.891 6.9 11.25C6.9 11.609 6.609 11.9 6.25 11.9C5.891 11.9 5.6 11.609 5.6 11.25C5.6 10.891 5.891 10.6 6.25 10.6Z', ['M4 1.5C4.414 1.5 4.75 1.836 4.75 2.25C4.75 2.664 4.414 3 4 3C3.586 3 3.25 2.664 3.25 2.25C3.25 1.836 3.586 1.5 4 1.5Z', 'M7.5 0.85C7.914 0.85 8.25 1.186 8.25 1.6C8.25 2.014 7.914 2.35 7.5 2.35C7.086 2.35 6.75 2.014 6.75 1.6C6.75 1.186 7.086 0.85 7.5 0.85Z', 'M11 1.65C11.414 1.65 11.75 1.986 11.75 2.4C11.75 2.814 11.414 3.15 11 3.15C10.586 3.15 10.25 2.814 10.25 2.4C10.25 1.986 10.586 1.65 11 1.65Z'], true),
    'Догляд за шиєю та декольте': glyph('M5.5 4.25C6.1 4.6 6.8 4.8 7.5 4.8C8.2 4.8 8.9 4.6 9.5 4.25L9.5 7.15C9.5 8.5 10.75 9.3 13.5 10.1L13.5 13.75L1.5 13.75L1.5 10.1C4.25 9.3 5.5 8.5 5.5 7.15L5.5 4.25Z', []),
    'Набори косметики': glyph('M3 7.5L12 7.5C12.69 7.5 13.25 8.06 13.25 8.75L13.25 12.5C13.25 13.19 12.69 13.75 12 13.75L3 13.75C2.31 13.75 1.75 13.19 1.75 12.5L1.75 8.75C1.75 8.06 2.31 7.5 3 7.5ZM6 11.25L9 11.25C9.133 11.25 9.26 11.197 9.354 11.104C9.447 11.01 9.5 10.883 9.5 10.75C9.5 10.617 9.447 10.49 9.354 10.396C9.26 10.303 9.133 10.25 9 10.25L6 10.25C5.867 10.25 5.74 10.303 5.646 10.396C5.553 10.49 5.5 10.617 5.5 10.75C5.5 10.883 5.553 11.01 5.646 11.104C5.74 11.197 5.867 11.25 6 11.25Z', ['M4.1 3.25L5.9 3.25C6.231 3.25 6.5 3.519 6.5 3.85L6.5 6.15C6.5 6.481 6.231 6.75 5.9 6.75L4.1 6.75C3.769 6.75 3.5 6.481 3.5 6.15L3.5 3.85C3.5 3.519 3.769 3.25 4.1 3.25Z', 'M4.6 1L5.4 1C5.593 1 5.75 1.157 5.75 1.35L5.75 2.4C5.75 2.593 5.593 2.75 5.4 2.75L4.6 2.75C4.407 2.75 4.25 2.593 4.25 2.4L4.25 1.35C4.25 1.157 4.407 1 4.6 1Z', 'M8.6 4.75L11.15 4.75C11.481 4.75 11.75 5.019 11.75 5.35L11.75 6.15C11.75 6.481 11.481 6.75 11.15 6.75L8.6 6.75C8.269 6.75 8 6.481 8 6.15L8 5.35C8 5.019 8.269 4.75 8.6 4.75Z', 'M8.8 3.25L10.95 3.25C11.116 3.25 11.25 3.384 11.25 3.55L11.25 3.95C11.25 4.116 11.116 4.25 10.95 4.25L8.8 4.25C8.634 4.25 8.5 4.116 8.5 3.95L8.5 3.55C8.5 3.384 8.634 3.25 8.8 3.25Z'], true),
    'Косметологічні гаджети': glyph('M7.5 3C10.261 3 12.5 5.462 12.5 8.5C12.5 11.538 10.261 14 7.5 14C4.739 14 2.5 11.538 2.5 8.5C2.5 5.462 4.739 3 7.5 3ZM5.4 6.95C6.008 6.95 6.5 7.308 6.5 7.75C6.5 8.192 6.008 8.55 5.4 8.55C4.792 8.55 4.3 8.192 4.3 7.75C4.3 7.308 4.792 6.95 5.4 6.95ZM9.6 6.95C10.208 6.95 10.7 7.308 10.7 7.75C10.7 8.192 10.208 8.55 9.6 8.55C8.992 8.55 8.5 8.192 8.5 7.75C8.5 7.308 8.992 6.95 9.6 6.95ZM6 12L9 12C9.133 12 9.26 11.947 9.354 11.854C9.447 11.76 9.5 11.633 9.5 11.5C9.5 11.367 9.447 11.24 9.354 11.146C9.26 11.053 9.133 11 9 11L6 11C5.867 11 5.74 11.053 5.646 11.146C5.553 11.24 5.5 11.367 5.5 11.5C5.5 11.633 5.553 11.76 5.646 11.854C5.74 11.947 5.867 12 6 12Z', ['M5.5 1C5.831 1 6.1 1.269 6.1 1.6C6.1 1.931 5.831 2.2 5.5 2.2C5.169 2.2 4.9 1.931 4.9 1.6C4.9 1.269 5.169 1 5.5 1Z', 'M7.5 0.5C7.831 0.5 8.1 0.769 8.1 1.1C8.1 1.431 7.831 1.7 7.5 1.7C7.169 1.7 6.9 1.431 6.9 1.1C6.9 0.769 7.169 0.5 7.5 0.5Z', 'M9.5 1C9.831 1 10.1 1.269 10.1 1.6C10.1 1.931 9.831 2.2 9.5 2.2C9.169 2.2 8.9 1.931 8.9 1.6C8.9 1.269 9.169 1 9.5 1Z'], true),
    'Аксесуари для вій та брів': glyph('M5.73 4L9.27 4L11.25 13C11.3 13.6 10.6 13.95 10.2 13.55L7.5 6.25L4.8 13.55C4.4 13.95 3.7 13.6 3.75 13L5.73 4Z', ['M6.1 1.25L8.9 1.25C9.231 1.25 9.5 1.519 9.5 1.85L9.5 2.65C9.5 2.981 9.231 3.25 8.9 3.25L6.1 3.25C5.769 3.25 5.5 2.981 5.5 2.65L5.5 1.85C5.5 1.519 5.769 1.25 6.1 1.25Z']),
    'Аксесуари для волосся': glyph('M1.75 6.75C1.75 4.5 4.25 3.25 7.5 3.25C10.75 3.25 13.25 4.5 13.25 6.75L13.25 7.5C13.25 7.78 13.03 8 12.75 8L2.25 8C1.97 8 1.75 7.78 1.75 7.5L1.75 6.75Z', ['M2.375 8.75L3.625 8.75L3.625 11.75L2.375 11.75Z', 'M4.625 8.75L5.875 8.75L5.875 11.75L4.625 11.75Z', 'M6.875 8.75L8.125 8.75L8.125 11.75L6.875 11.75Z', 'M9.125 8.75L10.375 8.75L10.375 11.75L9.125 11.75Z', 'M11.375 8.75L12.625 8.75L12.625 11.75L11.375 11.75Z']),
  }



  /* ── Data: Google Sheet «Каталог меню» → «Каталог (меню навігації)».
     A category without subcategories is a plain link; more: the sheet's «Кнопка "Показати ще"» ── */

  const cat = (label, links = [], more = false) => ({ label, links, more })

  /* Bestsellers: the first three products of the section's page on skintet.com (sorted by popularity),
     5 листопада 2026; photos saved at 320px in assets/images/best */
  const product = (name, price, img, slug) => ({ name, price, img: `best/${img}.webp`, href: `https://skintet.com/products/${slug}` })

  const SECTIONS = [
    {
      label: 'Обличчя',
      best: [
        { name: 'Нічна сироватка з ретиналем нового покоління', price: '4 300 ₴', img: 'retinal-serum.webp', href: 'https://skintet.com/products/crystal-retinal' },
        { name: 'Сироватка для омолодження шкіри з екзосомами та PDRN', price: '5 000 ₴', img: 'exo-pdrn.webp', href: 'https://skintet.com/products/exo-pdrn-prismatic' },
        { name: 'Крем для інтенсивного зволоження', price: '4 400 ₴', img: 'cold-plasma.webp', href: 'https://skintet.com/products/cold-plasma-plus-advanced-hydrating-complex' },
      ],
      cats: [
        cat('Креми для обличчя', ['Зволожуючий крем', 'Крем з SPF', 'Антивікові креми', 'Креми з ретинолом', 'Креми для сухої шкіри', 'Креми для чутливої шкіри', 'Денні креми', 'Нічні креми'], true),
        cat('Сироватки для обличчя'),
        cat('Пілінги та ексфоліанти'),
        cat('Тоніки для обличчя'),
        cat('Очищення обличчя', ['Гелі для вмивання', 'Пінки та муси для вмивання', 'Креми для очищення обличчя'], true),
        cat('Зняття макіяжу', ['Міцелярна вода', 'Очищувальні олії', 'Очищувальні бальзами', 'Засоби для зняття макіяжу з очей та губ'], true),
        cat('Сонцезахист для обличчя'),
      ],
    },
    {
      label: 'Макіяж',
      best: [
        product('Туш для вій', '1 625 ₴', 'makeup-mascara', 'tush-dlia-vii-length-define'),
        product('Денний тонуючий крем з SPF 30+', '2 400 ₴', 'makeup-tinted-cream', 'advanced-tinted-day-cream-spf-30-light-tint'),
        product('Пензель для нанесення бронзеру', '2 050 ₴', 'makeup-bronzer-brush', 'no-makeup-bronzer-brush'),
      ],
      cats: [
        cat('Макіяж обличчя', ['Праймери', 'Тональний крем', 'Рум’яна та бронзери', 'Хайлайтери']),
        cat('Макіяж очей', ['Туші для вій', 'Праймери для вій', 'Олівці для очей', 'Тіні для повік']),
        cat('Макіяж брів', ['Гелі для брів', 'Олівці для брів']),
        cat('Макіяж губ', ['Помади', 'Олійки та бальзами для губ']),
      ],
    },
    {
      label: 'Зона навколо очей',
      best: [
        product('Сироватка для зони навколо очей з потрійним ретинолом', '4 100 ₴', 'eyes-retinol-serum', 'high-potency-triple-retinol-renewal-eye-serum'),
        product('Сонцезахисний крем навколо очей з SPF 30', '2 700 ₴', 'eyes-spf-cream', 'advanced-day-eye-protect'),
        product('Відновлювальний та зволожувальний крем навколо очей', '4 100 ₴', 'eyes-firming-cream', 'hypoallergenic-clean-correction-firming-brightening-eye-cream'),
      ],
      cats: [cat('Креми для шкіри навколо очей'), cat('Сироватки для шкіри навколо очей')],
    },
    {
      label: 'Губи',
      best: [
        product('Зволожувальний бальзам для губ', '1 700 ₴', 'lips-cold-plasma-balm', 'cold-plasma-plus-lip-therapy-black'),
        product('Олія для губ', '1 750 ₴', 'lips-oil', 'no-makeup-lip-oil'),
        product('Відновлювальний бальзам для губ', '2 900 ₴', 'lips-baume-27', 'baume-27-lips-and-contour'),
      ],
      cats: [cat('Догляд за губами', ['Бальзами та відновлювальні засоби', 'Засоби для губ'])],
    },
    {
      label: 'Вії та брови',
      best: [
        product('Праймер для вій з ефектом обʼєму', '1 375 ₴', 'lashes-primer', 'volumizing-primer'),
        product('Маска для брів та вій', '2 450 ₴', 'lashes-masque', 'lash-brow-masque'),
        product('Стайлер для вій та брів', '1 000 ₴', 'lashes-styler', 'lash-brow-styler'),
      ],
      cats: [
        cat('Догляд за віями', ['Сироватки та кондиціонери для вій', 'Маски для вій']),
        cat('Догляд за бровами', ['Сироватки та кондиціонери для брів', 'Маски для брів']),
        cat('Очищення вій та брів', ['Міцелярні засоби для очей']),
      ],
    },
    {
      label: 'Волосся',
      best: [
        product('Маска-кондиціонер для волосся 5 в 1', '2 075 ₴', 'hair-mask-conditioner', 'leave-in-hair-mask-conditioner'),
        product('Шампунь для зволоження та відновлення волосся', '1 750 ₴', 'hair-shampoo', 'haircare-triple-keratin-repair-shampoo'),
        product('Реконструюючий кондиціонер для волосся', '1 750 ₴', 'hair-conditioner', 'haircare-hydrating-strengthening-conditioner'),
      ],
      cats: [
        cat('Шампуні для волосся', ['Звичайні та відлущувальні шампуні']),
        cat('Кондиціонери для волосся'),
        cat('Маски для волосся'),
        cat('Незмивний догляд', ['Спреї, креми та маски 5-в-1']),
        cat('Догляд за шкірою голови', ['Сироватки, лосьйони та пінки', 'Пілінги для шкіри голови']),
        cat('Догляд за бородою', ['Сироватки та засоби для росту бороди']),
      ],
    },
    {
      label: 'Тіло',
      best: [
        product('Інтенсивний зволожувальний бальзам для тіла', '2 250 ₴', 'body-balm', 'cold-plasma-plus-the-intensive-hydrating-body-balm'),
        product('Поживна олія жожоба для шкіри тіла', '2 050 ₴', 'body-jojoba-oil', 'nourishing-body-oil'),
        product('Зволожувальний крем для рук зі скваланом', '1 150 ₴', 'body-hand-cream', 'hand-cream'),
      ],
      cats: [
        cat('Зволоження тіла', ['Креми, лосьйони та бальзами для тіла']),
        cat('Ексфоліація тіла', ['Скраби та пілінги для тіла']),
        cat('Догляд за шиєю та декольте', ['Креми для шиї та декольте']),
      ],
    },
    {
      label: 'Набори',
      best: [
        product('Набір для глибокого зволоження шкіри', '5 733 ₴', 'kits-hydration', 'hydration-ritual'),
        product('Набір для шкіри, схильної до висипань', '5 915 ₴', 'kits-clear-skin', 'clear-skin-pro'),
        product('Набір «Досконалість вій» з сироваткою для брів у подарунок', '6 850 ₴', 'kits-lash-brow', 'lash-brow-best-value-set'),
      ],
      cats: [cat('Набори косметики', ['Набори для догляду за обличчям', 'Набори для вій та брів', 'Набори для волосся', 'Тревел-набори', 'Подарункові набори'])],
    },
    {
      label: 'Гаджети та аксесуари',
      best: [
        product('Багатофункціональна LED-маска для обличчя', '19 080 ₴', 'gadgets-express', 'express-by-deesse-pro'),
        product('Портативний гаджет для скульптурування обличчя', '31 620 ₴', 'gadgets-sculpta', 'sculpta-by-deesse-pro'),
        product('Професійна LED-маска для обличчя', '93 600 ₴', 'gadgets-pro', 'pro-by-deesse-pro'),
      ],
      cats: [
        cat('Косметологічні гаджети', ['LED-маски', 'RF, мікрострумові та масажні пристрої']),
        cat('Аксесуари для вій та брів', ['Щипці для вій та пінцети']),
        cat('Аксесуари для волосся', ['Щітки та ролери для шкіри голови']),
      ],
    },
  ]


  /* ── Markup ── */

  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

  const promo = (extra = '') => `
    <div class="cm-promo ${extra}">
      <div class="cm-promo__stones" aria-hidden="true">
        ${['suw', 'rue', 'sua', 'sue'].map((s) => `<img src="${IMG}stone-${s}.webp" alt="" width="88" height="88">`).join('')}
      </div>
      <p class="cm-promo__title">Не знаєш, що обрати?</p>
      <p class="cm-promo__text">Пройди Skin(ID) тест за 3 хвилини і отримай персональні рекомендації.</p>
      <a class="cm-promo__button" href="./">Дізнатися свій Skin(ID) ${ICON.arrowUpRight}</a>
    </div>`

  /* A pill with subcategories opens them; one without is a link to its category page, marked with an arrow */
  const pills = (section, si) => `
    <div class="cm-pills" aria-label="${esc(section.label)}">
      ${section.cats
        .map((c, ci) => {
          const icon = PILL_ICON[c.label] ? PILL_ICON[c.label]() : ''
          const cls = `cm-pill${icon ? '' : ' cm-pill--plain'}`
          const label = `<span>${esc(c.label)}</span>`
          return c.links.length
            ? `<button type="button" class="${cls}" aria-expanded="false" data-s="${si}" data-c="${ci}">${icon}${label}</button>`
            : `<a class="${cls} cm-pill--link" href="#">${icon}${label}<span class="cm-pill__go">${ICON.out14}</span></a>`
        })
        .join('')}
    </div>`

  const bestsellers = (section) =>
    section.best
      ? `<section class="cm-best" aria-label="Бестселери">
          <p class="cm-best__title">Бестселери</p>
          <div class="cm-best__rail">
            ${section.best.map(
              (b) => `<a class="cm-card" href="${b.href}">
                <span class="cm-card__photo"><img src="${IMG}${b.img}" alt="" width="160" height="160" loading="lazy"></span>
                <span class="cm-card__name">${esc(b.name)}</span>
                <span class="cm-card__price">${b.price}</span>
              </a>`
            ).join('')}
          </div>
        </section>`
      : ''

  const subLinks = (c) => `
    <div class="cm-sub__inner">
      ${c.links.map((l) => `<a href="#"><span class="cm-sub__label">${esc(l)}</span></a>`).join('')}
      ${c.more ? `<a href="#" class="cm-sub__more">Показати ще ${ICON.arrowSmall}</a>` : ''}
    </div>`

  /* ── Pills: one open at a time; its links open as a full row right under the pill's row ── */

  const OPEN_MS = 250

  function togglePill(pill) {
    const list = pill.closest('.cm-pills')
    const wasOpen = pill.getAttribute('aria-expanded') === 'true'

    if (wasOpen) {
      pill.setAttribute('aria-expanded', 'false')
      list.querySelectorAll('.cm-sub:not(.is-closing)').forEach(collapse)
      return
    }

    // Another pill is open: its links fold away while the new ones open, so the pills glide into place
    list.querySelectorAll('.cm-pill[aria-expanded="true"]').forEach((p) => p.setAttribute('aria-expanded', 'false'))
    list.querySelectorAll('.cm-sub:not(.is-closing)').forEach(collapse)

    const c = SECTIONS[Number(pill.dataset.s)].cats[Number(pill.dataset.c)]
    const sub = document.createElement('div')
    sub.className = 'cm-sub'
    sub.innerHTML = subLinks(c)

    // After the last pill on the open pill's line (on a phone that is the pill itself)
    const line = [...list.querySelectorAll('.cm-pill')].filter((p) => p.offsetTop === pill.offsetTop)
    line[line.length - 1].after(sub)
    pill.setAttribute('aria-expanded', 'true')
    fitColumns(sub.firstElementChild)
    expand(sub)
  }

  /* Height 0 → the links' height, then back to auto; a plain height transition works the same everywhere */
  function expand(sub) {
    const target = sub.firstElementChild.scrollHeight
    sub.style.height = '0px'
    void sub.offsetHeight
    sub.style.height = `${target}px`
    setTimeout(() => {
      if (sub.isConnected && !sub.classList.contains('is-closing')) sub.style.height = 'auto'
    }, OPEN_MS)
  }

  function collapse(sub) {
    if (!sub) return
    sub.classList.add('is-closing')
    sub.style.height = `${sub.offsetHeight}px`
    void sub.offsetHeight
    sub.style.height = '0px'
    setTimeout(() => sub.remove(), OPEN_MS)
  }

  /* Desktop: as many columns as the longest name allows on one line, up to three (Figma: three).
     Measured on a canvas, so nothing on the page has to change to find out */
  const measure = document.createElement('canvas').getContext('2d')
  function fitColumns(inner) {
    if (!inner.closest('.cm-mega')) return
    measure.font = '400 14px Sailec, Arial, sans-serif'
    const widest = Math.max(...[...inner.children].map((a) => measure.measureText(a.textContent.trim()).width + (a.querySelector('svg') ? 20 : 0)))
    const style = getComputedStyle(inner)
    const gap = parseFloat(style.columnGap) || 0
    const room = inner.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
    const cols = Math.max(1, Math.min(3, Math.floor((room + gap) / (Math.ceil(widest) + 2 + gap))))
    inner.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`
  }

  /* Diagnostics, off by default. ?perf logs where the time goes after a pill click (Safari opens late);
     ?noblur also switches off every blur on the page, to compare */
  const params = new URLSearchParams(location.search)
  const PERF = params.has('perf')
  if (params.has('noblur')) document.documentElement.classList.add('cm-noblur')
  if (params.has('noshadow')) document.documentElement.classList.add('cm-noshadow')

  /* Frames (rAF) and, alongside, a 4ms timer: if the timer keeps ticking while frames stall, the main thread
     is free and the drawing (compositing / GPU) is slow; if the timer stalls too, style / layout is busy */
  function perfProbe(label, t0, handlerMs) {
    const frames = []
    let last = t0
    let timerLast = performance.now()
    let timerGap = 0
    let timing = true
    const timer = () => {
      const now = performance.now()
      timerGap = Math.max(timerGap, now - timerLast)
      timerLast = now
      if (timing) setTimeout(timer, 4)
    }
    setTimeout(timer, 4)
    const subs = document.querySelectorAll('.cm-sub').length
    const tick = (now) => {
      frames.push(Math.round(now - last))
      last = now
      if (frames.length < 4 || now - t0 < OPEN_MS + 150) requestAnimationFrame(tick)
      else {
        timing = false
        console.log(
          `[cm-perf] ${label}: handler ${handlerMs.toFixed(1)}ms, first frame +${frames[0]}ms, then ${frames.slice(1).join(' ')}ms; ` +
            `main thread longest gap ${Math.round(timerGap)}ms; rows open ${subs}; noblur ${document.documentElement.classList.contains('cm-noblur')}; noshadow ${document.documentElement.classList.contains('cm-noshadow')}`
        )
      }
    }
    requestAnimationFrame(tick)
  }

  function onPillsClick(e) {
    const pill = e.target.closest('button.cm-pill')
    if (pill && PERF) {
      const t0 = performance.now()
      togglePill(pill)
      perfProbe(pill.innerText.trim(), e.timeStamp || t0, performance.now() - t0)
    } else if (pill) togglePill(pill)
    if (e.target.closest('a.cm-pill, .cm-sub a')) e.preventDefault()
  }

  /* ── Mobile: the live burger menu ── */

  const mobile = window.matchMedia('(max-width: 1024px)')

  function initMobile() {
    const all = document.querySelector('.menu-main-mobile-all')
    const catalog = document.getElementById('item_1')
    const menuIn = document.querySelector('#menu .menu-in')
    if (!all || !catalog || !menuIn) return

    // Level 2: «Каталог» — the live panel, filled with the sections
    catalog.classList.add('cm-panel')
    catalog.innerHTML = `
      <div class="cm-level">
        <nav class="cm-rows" aria-label="Каталог">
          <a class="cm-row" href="https://skintet.com/catalog">
            <span class="cm-row__icon">${SECTION_ICON['Всі продукти']}</span><span class="cm-row__label">Всі продукти</span>
            <span class="cm-row__arrow">${ICON.out20}</span>
          </a>
          ${SECTIONS.map(
            (s, si) => `<button type="button" class="cm-row" data-section="${si}">
              <span class="cm-row__icon">${SECTION_ICON[s.label]}</span>
              <span class="cm-row__label">${esc(s.label)}</span>
              <span class="cm-row__arrow">${ICON.chevron20}</span>
            </button>`
          ).join('')}
        </nav>
      </div>`

    // Level 3: a section — a panel of the same kind, so the live close-all resets it too
    const section = document.createElement('div')
    section.className = 'menu-main-mobile-catalog cm-panel'
    section.id = 'item_section'
    section.dataset.menuId = 'section'
    catalog.after(section)

    // The strip across the bottom of the screen the peeking card tucks behind. On <body>, outside the live
    // menu: that menu has a transform, so a fixed box inside it would scroll
    const strip = document.createElement('div')
    strip.className = 'cm-strip'
    document.body.append(strip)

    // The Skin(ID) promo at the end of every list (the root menu, «Каталог», a section), position: sticky
    // with a negative bottom: until the list's end it sticks to the screen's bottom edge with only its top
    // (--cm-peek) showing, and at the end it simply scrolls out with the list. One scroll, run by the browser.
    // The negative bottom is the card's own height less what peeks out, measured by a ResizeObserver
    const peekObserver = new ResizeObserver((entries) =>
      entries.forEach(({ target }) => {
        const css = getComputedStyle(target)
        const shown = (parseFloat(css.getPropertyValue('--cm-peek')) || 68) + (strip.offsetHeight || 16)
        target.style.bottom = `${Math.min(0, Math.round(shown - target.offsetHeight))}px`
      })
    )
    const peekCard = () => {
      const card = document.createElement('div')
      card.className = 'cm-peek'
      card.innerHTML = promo()
      peekObserver.observe(card)
      return card
    }
    // a tap on the peeking card scrolls its list to the end, where the card stands whole
    const onPeekClick = (e) => {
      const card = e.target.closest('.cm-peek')
      if (!card || !mobile.matches) return
      const box = card.parentElement
      if (box.scrollHeight - box.scrollTop - box.clientHeight > 1) {
        e.preventDefault()
        box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' })
      }
    }
    all.append(peekCard())
    catalog.append(peekCard())
    ;[all, catalog].forEach((box) => box.addEventListener('click', onPeekClick))

    // Back arrow before the logo, while a catalog level is open
    const back = document.createElement('button')
    back.type = 'button'
    back.className = 'cm-back'
    back.setAttribute('aria-label', 'Назад')
    back.innerHTML = ICON.back
    menuIn.prepend(back)

    // «Каталог» opens its panel from the whole row: on the live page the text is a link to /catalog
    // and only the arrow opens the panel (the live script still does the opening)
    // The panels sit inside the root list's scroller: back to its top first, or a panel opened from a
    // scrolled list starts that far up and the list shows under it
    document.querySelectorAll('.menu-main-mobile-link-sub').forEach((a) =>
      a.addEventListener('click', (e) => {
        if (!mobile.matches) return
        e.preventDefault()
        all.scrollTop = 0
      })
    )

    const panels = () => [...document.querySelectorAll('.menu-main-mobile-catalog.active')]
    const sync = () => {
      document.body.classList.toggle('cm-deep', mobile.matches && panels().length > 0)
      // The strip shows while the mobile menu is open (the live burger puts .active on <body>)
      strip.classList.toggle('is-shown', mobile.matches && document.body.classList.contains('active'))
    }
    mobile.addEventListener('change', sync)

    back.addEventListener('click', () => {
      if (section.classList.contains('active')) {
        section.classList.remove('active')
      } else {
        panels().forEach((p) => p.classList.remove('active'))
        all.classList.remove('on-it')
      }
      sync()
    })

    catalog.addEventListener('click', (e) => {
      const row = e.target.closest('[data-section]')
      if (!row) return
      const s = SECTIONS[Number(row.dataset.section)]
      section.querySelectorAll('.cm-peek').forEach((c) => peekObserver.unobserve(c))
      section.innerHTML = `<div class="cm-level">${pills(s, Number(row.dataset.section))}${bestsellers(s)}</div>`
      section.append(peekCard())
      section.scrollTop = 0
      section.classList.add('active')
      sync()
    })

    section.addEventListener('click', onPillsClick)
    section.addEventListener('click', onPeekClick)

    // The live script opens / closes panels on its own clicks (Каталог, burger, Escape): follow them
    document.addEventListener('click', () => setTimeout(sync), true)
    document.addEventListener('keydown', () => setTimeout(sync), true)
  }

  /* ── Desktop: the live hover dropdown under «Каталог» becomes the Figma mega menu ── */

  function initDesktop() {
    const inner = document.querySelector('#sub_item_1 .catalog-in')
    if (!inner) return
    inner.classList.add('cm-mega')
    inner.innerHTML = `
      <nav class="cm-mega__sections" aria-label="Каталог">
        <a class="cm-section" href="https://skintet.com/catalog">
          <span class="cm-section__icon">${SECTION_ICON['Всі продукти']}</span><span class="cm-section__label">Всі продукти</span>
          <span class="cm-section__out">${ICON.out16}</span>
        </a>
        ${SECTIONS.map(
          (s, si) => `<a class="cm-section" href="#" data-section="${si}">
            <span class="cm-section__icon">${SECTION_ICON[s.label]}</span>
            <span class="cm-section__label">${esc(s.label)}</span>
            <span class="cm-section__chevron">${ICON.chevron}</span>
          </a>`
        ).join('')}
      </nav>
      <div class="cm-mega__content"></div>
      ${promo('cm-promo--tall')}`

    const content = inner.querySelector('.cm-mega__content')
    const show = (si) => {
      inner.querySelectorAll('.cm-section[data-section]').forEach((a) => a.classList.toggle('is-active', Number(a.dataset.section) === si))
      const s = SECTIONS[si]
      content.innerHTML = pills(s, si) + bestsellers(s)
    }
    show(0)

    // Sections switch on click only
    inner.querySelectorAll('.cm-section[data-section]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault()
        if (!a.classList.contains('is-active')) show(Number(a.dataset.section))
      })
    })

    content.addEventListener('click', onPillsClick)

    initDesktopToggle()
  }

  /* «Каталог» opens the mega menu on click, not on hover: a second click, a click outside or Escape closes it.
     The live script opens the dropdown on mouseenter and closes it on mouseleave, and on a click «Каталог»
     opens the mobile panel; on desktop those events are stopped on their way down (capture), before they
     reach its handlers. Mobile keeps the live behaviour */
  function initDesktopToggle() {
    const menu = document.getElementById('menu')
    const dropdown = document.getElementById('sub_item_1')
    const link = document.querySelector('.menu-main-mobile-link-sub')
    const item = link && link.closest('.menu-main-item')
    if (!menu || !dropdown || !link || !item) return
    const desktop = () => !mobile.matches
    const isOpen = () => dropdown.classList.contains('active')

    const hoverTargets = (t) => t instanceof Element && (t === item || t === dropdown || t.matches('.menu-main'))
    for (const type of ['mouseenter', 'mouseleave']) {
      document.addEventListener(
        type,
        (e) => {
          if (desktop() && hoverTargets(e.target)) e.stopPropagation()
        },
        true
      )
    }

    const setOpen = (open) => {
      menu.classList.toggle('active', open)
      item.classList.toggle('active', open)
      link.classList.toggle('active', open)
      link.setAttribute('aria-haspopup', 'true')
      link.setAttribute('aria-expanded', String(open))
      dropdown.classList.toggle('active', open)
    }

    document.addEventListener(
      'click',
      (e) => {
        if (!desktop()) return
        if (e.target.closest('.menu-main-mobile-link-sub')) {
          e.preventDefault()
          e.stopPropagation()
          setOpen(!isOpen())
          return
        }
        if (isOpen() && !dropdown.contains(e.target)) setOpen(false)
      },
      true
    )

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) setOpen(false)
    })
    mobile.addEventListener('change', () => setOpen(false))
  }

  function init() {
    document.body.classList.add('cm-prototype')
    initMobile()
    initDesktop()
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
  else init()
})()
