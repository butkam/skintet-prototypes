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

  /* ── Icons (exported from Figma; colours are currentColor so a selected pill turns them white) ── */

  const ICON = {
    // «›»: opens the next level of the menu (the desktop sections' chevron, at 20px)
    chevron20:
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M8.33 5L13.33 10L8.33 15" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrowRight:
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3.75 10H16.25M11.25 5L16.25 10L11.25 15" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrowSmall:
      '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    back:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 12H4.5M10.5 6L4.5 12L10.5 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevron:
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6.667 4L10.667 8L6.667 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    // «↗»: a link that leads to a page (a category without subcategories, «Всі продукти»)
    out14:
      '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M4.08 9.92L9.92 4.08M9.92 9.33V4.08H4.67" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    out16:
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4.67 11.33L11.33 4.67M11.33 10.67V4.67H5.33" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    out20:
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5.83 14.17L14.17 5.83M14.17 13.33V5.83H6.67" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrowUpRight:
      '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M4.375 10.625L10.625 4.375M10.625 10V4.375H5" stroke="currentColor" stroke-width="0.9375" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  }

  const stroke = (paths, width = 1.25) =>
    `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">${paths
      .map((d) => `<path d="${d}" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`)
      .join('')}</svg>`

  const SECTION_ICON = {
    'Всі продукти': stroke(['M3.125 3.125H8.542V6.875H3.125Z', 'M11.458 13.125H16.875V16.875H11.458Z', 'M3.125 9.792H8.542V16.875H3.125Z', 'M11.458 3.125H16.875V10.208H11.458Z']),
    Обличчя:
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 17.708C14.257 17.708 17.708 14.257 17.708 10C17.708 5.743 14.257 2.292 10 2.292C5.743 2.292 2.292 5.743 2.292 10C2.292 14.257 5.743 17.708 10 17.708Z" stroke="currentColor" stroke-width="1.25"/><path d="M13.812 11.663C13.493 11.526 13.174 11.39 12.854 11.254C12.799 11.366 12.741 11.469 12.675 11.572C12.102 12.494 11.065 13.027 10.002 13.021C8.939 13.025 7.902 12.491 7.325 11.57C7.259 11.467 7.201 11.364 7.145 11.252C6.826 11.39 6.507 11.527 6.188 11.664C6.246 11.816 6.31 11.96 6.385 12.105C7.039 13.419 8.523 14.289 10.001 14.271C11.479 14.293 12.967 13.422 13.617 12.104C13.692 11.958 13.755 11.815 13.812 11.663Z" fill="currentColor"/><path d="M8.958 8.25C8.958 9.171 8.399 9.792 7.708 9.792C7.018 9.792 6.458 9.171 6.458 8.25C6.458 7.33 7.018 6.667 7.708 6.667C8.399 6.667 8.958 7.33 8.958 8.25Z" fill="currentColor"/><path d="M13.542 8.25C13.542 9.171 12.982 9.792 12.292 9.792C11.601 9.792 11.042 9.171 11.042 8.25C11.042 7.33 11.601 6.667 12.292 6.667C12.982 6.667 13.542 7.33 13.542 8.25Z" fill="currentColor"/></svg>',
    Макіяж: stroke(['M8.25 7.5V4.4C8.25 4.05 8.43 3.73 8.73 3.55L11 2.15C11.33 1.95 11.75 2.19 11.75 2.58V7.5', 'M7.5 7.5H12.5V10.5H7.5Z', 'M7 10.5H13V17.25C13 17.8 12.55 18.25 12 18.25H8C7.45 18.25 7 17.8 7 17.25Z']),
    'Зона навколо очей': stroke(['M2.5 8.75C6 3.5 14 3.5 17.5 8.75C14 14 6 14 2.5 8.75Z', 'M10 6.5C11.243 6.5 12.25 7.507 12.25 8.75C12.25 9.993 11.243 11 10 11C8.757 11 7.75 9.993 7.75 8.75C7.75 7.507 8.757 6.5 10 6.5Z', 'M4.5 15.25C7.5 17.5 12.5 17.5 15.5 15.25']),
    Губи: stroke(['M1.875 10C4 7.4 6.2 5.2 7.9 5.2C8.9 5.2 9.5 5.8 10 6.4C10.5 5.8 11.1 5.2 12.1 5.2C13.8 5.2 16 7.4 18.125 10C16 13.2 13.2 15 10 15C6.8 15 4 13.2 1.875 10Z', 'M1.875 10C6 10.9 14 10.9 18.125 10']),
    'Вії та брови': stroke(['M3 6.25C6.5 3.25 12.5 3 17 5.25', 'M3.5 10.5C6.5 14.25 13.5 14.25 16.5 10.5', 'M10 13.3V16.25', 'M6.6 12.6L5.6 15.1', 'M13.4 12.6L14.4 15.1']),
    Волосся: stroke(['M5 3C7 5.5 3 8 5 10.5C7 13 3 15.5 5 17M10 3C12 5.5 8 8 10 10.5C12 13 8 15.5 10 17M15 3C17 5.5 13 8 15 10.5C17 13 13 15.5 15 17'], 1.3),
    Тіло: stroke(['M10 5.208C11.036 5.208 11.875 4.369 11.875 3.333C11.875 2.298 11.036 1.458 10 1.458C8.964 1.458 8.125 2.298 8.125 3.333C8.125 4.369 8.964 5.208 10 5.208Z', 'M12.708 18.542V15.625H14.792L12.708 7.292H7.292L5.208 15.625H7.292V18.542']),
    Набори: stroke(['M2.75 10.25H17.25V16.75C17.25 17.44 16.69 18 16 18H4C3.31 18 2.75 17.44 2.75 16.75Z', 'M5 10.25V6.75C5 6.2 5.45 5.75 6 5.75H8C8.55 5.75 9 6.2 9 6.75V10.25', 'M6 5.75V3H8V5.75', 'M11 10.25V8.75C11 8.2 11.45 7.75 12 7.75H14.75C15.3 7.75 15.75 8.2 15.75 8.75V10.25', 'M11.5 7.75V6H15.25V7.75', 'M8 14.25H12']),
    'Гаджети та аксесуари': stroke(['M5.208 11.667L11.25 3.75L10.833 8.333H14.792L8.75 16.25L9.167 11.667Z']),
  }

  /* 15px pill glyphs, exported from Figma «Cat» → «Іконки субменю · 30» (components «Pill icon/…», 9 листопада 2026):
     the body («Форма») in a top-to-bottom fade, details («Деталь») solid.
     A function, so every render gets its own gradient id: the same pills sit in the mobile panel and the
     desktop dropdown, and Safari draws nothing for a url(#id) that points into a hidden copy */
  let gradients = 0
  const glyph = (body, details, evenodd) => () => {
    const id = `cm-g-${++gradients}`
    return `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="currentColor"/><stop offset="1" stop-color="currentColor" stop-opacity="0.4"/></linearGradient></defs><path d="${body}" fill="url(#${id})"${evenodd ? ' fill-rule="evenodd"' : ''}/>${details
      .map((d) => `<path d="${d}" fill="currentColor"/>`)
      .join('')}</svg>`
  }

  const PILL_ICON = {
    'Креми для обличчя': glyph('M3.75 5.25L11.25 5.25C12.355 5.25 13.25 6.145 13.25 7.25L13.25 11.5C13.25 12.605 12.355 13.5 11.25 13.5L3.75 13.5C2.645 13.5 1.75 12.605 1.75 11.5L1.75 7.25C1.75 6.145 2.645 5.25 3.75 5.25Z', ['M4 1.5L11 1.5C11.414 1.5 11.75 1.836 11.75 2.25L11.75 3.5C11.75 3.914 11.414 4.25 11 4.25L4 4.25C3.586 4.25 3.25 3.914 3.25 3.5L3.25 2.25C3.25 1.836 3.586 1.5 4 1.5Z']),
    'Сироватки для обличчя': glyph('M5.5 6.5L9.5 6.5C10.605 6.5 11.5 7.395 11.5 8.5L11.5 11.75C11.5 12.855 10.605 13.75 9.5 13.75L5.5 13.75C4.395 13.75 3.5 12.855 3.5 11.75L3.5 8.5C3.5 7.395 4.395 6.5 5.5 6.5Z', ['M7.5 0.75C8.328 0.75 9 1.422 9 2.25L9 2.75C9 3.578 8.328 4.25 7.5 4.25C6.672 4.25 6 3.578 6 2.75L6 2.25C6 1.422 6.672 0.75 7.5 0.75Z', 'M5.5 4.5L9.5 4.5C9.776 4.5 10 4.724 10 5L10 5.5C10 5.776 9.776 6 9.5 6L5.5 6C5.224 6 5 5.776 5 5.5L5 5C5 4.724 5.224 4.5 5.5 4.5Z']),
    'Пілінги та ексфоліанти': glyph('M3.75 1.75L11.25 1.75C12.355 1.75 13.25 2.645 13.25 3.75L13.25 6.5L7 7L6.5 13.25L3.75 13.25C2.645 13.25 1.75 12.355 1.75 11.25L1.75 3.75C1.75 2.645 2.645 1.75 3.75 1.75Z', ['M13.25 7.25L7.75 7.75L7.25 13.25C9.75 12.75 12.75 9.75 13.25 7.25Z']),
    'Тоніки для обличчя': glyph('M5.5 5L9.5 5C10.743 5 11.75 6.007 11.75 7.25L11.75 11.5C11.75 12.743 10.743 13.75 9.5 13.75L5.5 13.75C4.257 13.75 3.25 12.743 3.25 11.5L3.25 7.25C3.25 6.007 4.257 5 5.5 5Z', ['M6 1.25L9 1.25C9.414 1.25 9.75 1.586 9.75 2L9.75 3.25C9.75 3.664 9.414 4 9 4L6 4C5.586 4 5.25 3.664 5.25 3.25L5.25 2C5.25 1.586 5.586 1.25 6 1.25Z']),
    'Очищення обличчя': glyph('M9 4.75C11.485 4.75 13.5 6.765 13.5 9.25C13.5 11.735 11.485 13.75 9 13.75C6.515 13.75 4.5 11.735 4.5 9.25C4.5 6.765 6.515 4.75 9 4.75ZM7.4 6.6C7.98 6.6 8.45 7.07 8.45 7.65C8.45 8.23 7.98 8.7 7.4 8.7C6.82 8.7 6.35 8.23 6.35 7.65C6.35 7.07 6.82 6.6 7.4 6.6Z', ['M3.75 2.65C4.91 2.65 5.85 3.59 5.85 4.75C5.85 5.91 4.91 6.85 3.75 6.85C2.59 6.85 1.65 5.91 1.65 4.75C1.65 3.59 2.59 2.65 3.75 2.65Z', 'M8.4 1.25C9.035 1.25 9.55 1.765 9.55 2.4C9.55 3.035 9.035 3.55 8.4 3.55C7.765 3.55 7.25 3.035 7.25 2.4C7.25 1.765 7.765 1.25 8.4 1.25Z'], true),
    'Зняття макіяжу': glyph('M6.5 3.25C9.4 3.25 11.75 5.6 11.75 8.5C11.75 11.4 9.4 13.75 6.5 13.75C3.6 13.75 1.25 11.4 1.25 8.5C1.25 5.6 3.6 3.25 6.5 3.25ZM4.6 5.95C4.959 5.95 5.25 6.241 5.25 6.6C5.25 6.959 4.959 7.25 4.6 7.25C4.241 7.25 3.95 6.959 3.95 6.6C3.95 6.241 4.241 5.95 4.6 5.95ZM8.4 5.95C8.759 5.95 9.05 6.241 9.05 6.6C9.05 6.959 8.759 7.25 8.4 7.25C8.041 7.25 7.75 6.959 7.75 6.6C7.75 6.241 8.041 5.95 8.4 5.95ZM6.5 7.85C6.859 7.85 7.15 8.141 7.15 8.5C7.15 8.859 6.859 9.15 6.5 9.15C6.141 9.15 5.85 8.859 5.85 8.5C5.85 8.141 6.141 7.85 6.5 7.85ZM4.6 9.75C4.959 9.75 5.25 10.041 5.25 10.4C5.25 10.759 4.959 11.05 4.6 11.05C4.241 11.05 3.95 10.759 3.95 10.4C3.95 10.041 4.241 9.75 4.6 9.75ZM8.4 9.75C8.759 9.75 9.05 10.041 9.05 10.4C9.05 10.759 8.759 11.05 8.4 11.05C8.041 11.05 7.75 10.759 7.75 10.4C7.75 10.041 8.041 9.75 8.4 9.75Z', ['M12.25 1.25C13 2.2 13.65 3.2 13.65 4.25C13.65 5.02 13.02 5.65 12.25 5.65C11.48 5.65 10.85 5.02 10.85 4.25C10.85 3.2 11.5 2.2 12.25 1.25Z'], true),
    'Сонцезахист для обличчя': glyph('M7.5 4.4C9.212 4.4 10.6 5.788 10.6 7.5C10.6 9.212 9.212 10.6 7.5 10.6C5.788 10.6 4.4 9.212 4.4 7.5C4.4 5.788 5.788 4.4 7.5 4.4Z', ['M8.05 2.9L8.05 1.15C8.05 0.846 7.804 0.6 7.5 0.6C7.196 0.6 6.95 0.846 6.95 1.15L6.95 2.9C6.95 3.204 7.196 3.45 7.5 3.45C7.804 3.45 8.05 3.204 8.05 2.9Z', 'M11.142 4.636L12.379 3.399C12.594 3.184 12.594 2.836 12.379 2.621C12.164 2.406 11.816 2.406 11.601 2.621L10.364 3.858C10.149 4.073 10.149 4.421 10.364 4.636C10.579 4.851 10.927 4.851 11.142 4.636Z', 'M12.1 8.05L13.85 8.05C14.154 8.05 14.4 7.804 14.4 7.5C14.4 7.196 14.154 6.95 13.85 6.95L12.1 6.95C11.796 6.95 11.55 7.196 11.55 7.5C11.55 7.804 11.796 8.05 12.1 8.05Z', 'M10.364 11.142L11.601 12.379C11.816 12.594 12.164 12.594 12.379 12.379C12.594 12.164 12.594 11.816 12.379 11.601L11.142 10.364C10.927 10.149 10.579 10.149 10.364 10.364C10.149 10.579 10.149 10.927 10.364 11.142Z', 'M6.95 12.1L6.95 13.85C6.95 14.154 7.196 14.4 7.5 14.4C7.804 14.4 8.05 14.154 8.05 13.85L8.05 12.1C8.05 11.796 7.804 11.55 7.5 11.55C7.196 11.55 6.95 11.796 6.95 12.1Z', 'M3.858 10.364L2.621 11.601C2.406 11.816 2.406 12.164 2.621 12.379C2.836 12.594 3.184 12.594 3.399 12.379L4.636 11.142C4.851 10.927 4.851 10.579 4.636 10.364C4.421 10.149 4.073 10.149 3.858 10.364Z', 'M2.9 6.95L1.15 6.95C0.846 6.95 0.6 7.196 0.6 7.5C0.6 7.804 0.846 8.05 1.15 8.05L2.9 8.05C3.204 8.05 3.45 7.804 3.45 7.5C3.45 7.196 3.204 6.95 2.9 6.95Z', 'M4.636 3.858L3.399 2.621C3.184 2.406 2.836 2.406 2.621 2.621C2.406 2.836 2.406 3.184 2.621 3.399L3.858 4.636C4.073 4.851 4.421 4.851 4.636 4.636C4.851 4.421 4.851 4.073 4.636 3.858Z']),
    'Макіяж обличчя': glyph('M7.5 1C10 2.5 10.5 5.5 9.75 7L5.25 7C4.5 5.5 5 2.5 7.5 1Z', ['M5.75 7.5L9.25 7.5C9.53 7.5 9.75 7.72 9.75 8L9.75 9C9.75 9.28 9.53 9.5 9.25 9.5L5.75 9.5C5.47 9.5 5.25 9.28 5.25 9L5.25 8C5.25 7.72 5.47 7.5 5.75 7.5Z', 'M6.25 10L8.75 10L8.25 14L6.75 14L6.25 10Z']),
    'Макіяж очей': glyph('M3 4.5L12 4.5C12.97 4.5 13.75 5.28 13.75 6.25L13.75 8.75C13.75 9.72 12.97 10.5 12 10.5L3 10.5C2.03 10.5 1.25 9.72 1.25 8.75L1.25 6.25C1.25 5.28 2.03 4.5 3 4.5ZM4 6.25C4.69 6.25 5.25 6.81 5.25 7.5C5.25 8.19 4.69 8.75 4 8.75C3.31 8.75 2.75 8.19 2.75 7.5C2.75 6.81 3.31 6.25 4 6.25ZM7.5 6.25C8.19 6.25 8.75 6.81 8.75 7.5C8.75 8.19 8.19 8.75 7.5 8.75C6.81 8.75 6.25 8.19 6.25 7.5C6.25 6.81 6.81 6.25 7.5 6.25ZM11 6.25C11.69 6.25 12.25 6.81 12.25 7.5C12.25 8.19 11.69 8.75 11 8.75C10.31 8.75 9.75 8.19 9.75 7.5C9.75 6.81 10.31 6.25 11 6.25Z', [], true),
    'Макіяж брів': glyph('M2.32 10.92L9.12 4.12L10.88 5.88L4.08 12.68L2.32 10.92Z', ['M9.12 4.12L11.9 3.1L10.88 5.88L9.12 4.12Z', 'M3.08 13.68L4.08 12.68C4.279 12.44 4.38 12.135 4.366 11.824C4.351 11.513 4.221 11.219 4.001 10.999C3.781 10.779 3.487 10.649 3.176 10.634C2.865 10.62 2.56 10.721 2.32 10.92L1.32 11.92C1.121 12.16 1.02 12.465 1.034 12.776C1.049 13.087 1.179 13.381 1.399 13.601C1.619 13.821 1.913 13.951 2.224 13.966C2.535 13.98 2.84 13.879 3.08 13.68Z']),
    'Макіяж губ': glyph('M4.75 8.5L10.25 8.5L10.25 12.85C10.25 13.35 9.85 13.75 9.35 13.75L5.65 13.75C5.15 13.75 4.75 13.35 4.75 12.85L4.75 8.5Z', ['M5.55 6L9.45 6C9.62 6 9.75 6.13 9.75 6.3L9.75 7.7C9.75 7.87 9.62 8 9.45 8L5.55 8C5.38 8 5.25 7.87 5.25 7.7L5.25 6.3C5.25 6.13 5.38 6 5.55 6Z', 'M5.75 5.5L5.75 3.3C5.75 3.03 5.89 2.78 6.12 2.64L8.49 1.21C8.82 1.01 9.25 1.25 9.25 1.64L9.25 5.5L5.75 5.5Z']),
    'Креми для шкіри навколо очей': glyph('M4.25 13.75L10.75 13.75L9.75 6.25L5.25 6.25L4.25 13.75Z', ['M4.25 12.5L10.75 12.5C11.03 12.5 11.25 12.72 11.25 13L11.25 13.5C11.25 13.78 11.03 14 10.75 14L4.25 14C3.97 14 3.75 13.78 3.75 13.5L3.75 13C3.75 12.72 3.97 12.5 4.25 12.5Z', 'M6.5 6.25L7 2.1C7.1 1.45 7.9 1.45 8 2.1L8.5 6.25L6.5 6.25Z']),
    'Сироватки для шкіри навколо очей': glyph('M6.25 5.5L8.75 5.5C9.72 5.5 10.5 6.28 10.5 7.25L10.5 12C10.5 12.97 9.72 13.75 8.75 13.75L6.25 13.75C5.28 13.75 4.5 12.97 4.5 12L4.5 7.25C4.5 6.28 5.28 5.5 6.25 5.5Z', ['M7.5 1C8.47 1 9.25 1.78 9.25 2.75C9.25 3.72 8.47 4.5 7.5 4.5C6.53 4.5 5.75 3.72 5.75 2.75C5.75 1.78 6.53 1 7.5 1Z', 'M6.15 4L8.85 4C9.07 4 9.25 4.18 9.25 4.4L9.25 5.35C9.25 5.57 9.07 5.75 8.85 5.75L6.15 5.75C5.93 5.75 5.75 5.57 5.75 5.35L5.75 4.4C5.75 4.18 5.93 4 6.15 4Z']),
    'Догляд за губами': glyph('M1.4 7.5C3 5.55 4.65 3.9 5.93 3.9C6.68 3.9 7.13 4.35 7.5 4.8C7.88 4.35 8.33 3.9 9.08 3.9C10.35 3.9 12 5.55 13.6 7.5C12 9.9 9.9 11.25 7.5 11.25C5.1 11.25 3 9.9 1.4 7.5ZM1.4 7.5C4.5 8.3 10.5 8.3 13.6 7.5C10.5 9 4.5 9 1.4 7.5Z', ['M10.25 4.9C10.64 4.9 10.95 5.21 10.95 5.6C10.95 5.99 10.64 6.3 10.25 6.3C9.86 6.3 9.55 5.99 9.55 5.6C9.55 5.21 9.86 4.9 10.25 4.9Z'], true),
    'Догляд за віями': glyph('M1.5 5.25C4.5 10.5 10.5 10.5 13.5 5.25C10.5 7.25 4.5 7.25 1.5 5.25Z', ['M7.08 9.7L7.08 12.6C7.096 12.7 7.146 12.792 7.223 12.858C7.3 12.924 7.399 12.96 7.5 12.96C7.601 12.96 7.7 12.924 7.777 12.858C7.854 12.792 7.904 12.7 7.92 12.6L7.92 9.7C7.904 9.6 7.854 9.508 7.777 9.442C7.7 9.376 7.601 9.34 7.5 9.34C7.399 9.34 7.3 9.376 7.223 9.442C7.146 9.508 7.096 9.6 7.08 9.7Z', 'M3.99 8.88L3.19 11.48C3.158 11.589 3.171 11.706 3.225 11.805C3.28 11.904 3.371 11.978 3.48 12.01C3.589 12.042 3.706 12.029 3.805 11.975C3.904 11.92 3.978 11.829 4.01 11.72L4.81 9.12C4.842 9.011 4.829 8.894 4.775 8.795C4.72 8.696 4.629 8.622 4.52 8.59C4.411 8.558 4.294 8.571 4.195 8.625C4.096 8.68 4.022 8.771 3.99 8.88Z', 'M10.19 9.12L10.99 11.72C11.022 11.829 11.096 11.92 11.195 11.975C11.294 12.029 11.411 12.042 11.52 12.01C11.629 11.978 11.72 11.904 11.775 11.805C11.829 11.706 11.842 11.589 11.81 11.48L11.01 8.88C10.978 8.771 10.904 8.68 10.805 8.625C10.706 8.571 10.589 8.558 10.48 8.59C10.371 8.622 10.28 8.696 10.225 8.795C10.171 8.894 10.158 9.011 10.19 9.12Z']),
    'Догляд за бровами': glyph('M1.5 9.25C3.75 4.75 9.25 3.5 13.5 6L13 7.4C9.5 5.75 5.25 6.75 2.75 10.25L1.5 9.25Z', ['M11.25 8.25C12.15 9.38 12.75 10.28 12.75 11.4C12.75 12.22 12.07 12.9 11.25 12.9C10.43 12.9 9.75 12.22 9.75 11.4C9.75 10.28 10.35 9.38 11.25 8.25Z']),
    'Очищення вій та брів': glyph('M1.5 5.25C4.5 10.5 10.5 10.5 13.5 5.25C10.5 7.25 4.5 7.25 1.5 5.25Z', ['M7.08 9.7L7.08 12.6C7.096 12.7 7.146 12.792 7.223 12.858C7.3 12.924 7.399 12.96 7.5 12.96C7.601 12.96 7.7 12.924 7.777 12.858C7.854 12.792 7.904 12.7 7.92 12.6L7.92 9.7C7.904 9.6 7.854 9.508 7.777 9.442C7.7 9.376 7.601 9.34 7.5 9.34C7.399 9.34 7.3 9.376 7.223 9.442C7.146 9.508 7.096 9.6 7.08 9.7Z', 'M3.99 8.88L3.19 11.48C3.158 11.589 3.171 11.706 3.225 11.805C3.28 11.904 3.371 11.978 3.48 12.01C3.589 12.042 3.706 12.029 3.805 11.975C3.904 11.92 3.978 11.829 4.01 11.72L4.81 9.12C4.842 9.011 4.829 8.894 4.775 8.795C4.72 8.696 4.629 8.622 4.52 8.59C4.411 8.558 4.294 8.571 4.195 8.625C4.096 8.68 4.022 8.771 3.99 8.88Z', 'M10.19 9.12L10.99 11.72C11.022 11.829 11.096 11.92 11.195 11.975C11.294 12.029 11.411 12.042 11.52 12.01C11.629 11.978 11.72 11.904 11.775 11.805C11.829 11.706 11.842 11.589 11.81 11.48L11.01 8.88C10.978 8.771 10.904 8.68 10.805 8.625C10.706 8.571 10.589 8.558 10.48 8.59C10.371 8.622 10.28 8.696 10.225 8.795C10.171 8.894 10.158 9.011 10.19 9.12Z', 'M10.75 1.05C11.41 1.05 11.95 1.59 11.95 2.25C11.95 2.91 11.41 3.45 10.75 3.45C10.09 3.45 9.55 2.91 9.55 2.25C9.55 1.59 10.09 1.05 10.75 1.05Z', 'M13.1 2.85C13.51 2.85 13.85 3.19 13.85 3.6C13.85 4.01 13.51 4.35 13.1 4.35C12.69 4.35 12.35 4.01 12.35 3.6C12.35 3.19 12.69 2.85 13.1 2.85Z', 'M8.4 1.15C8.73 1.15 9 1.42 9 1.75C9 2.08 8.73 2.35 8.4 2.35C8.07 2.35 7.8 2.08 7.8 1.75C7.8 1.42 8.07 1.15 8.4 1.15Z']),
    'Шампуні для волосся': glyph('M5.75 6L9.25 6C10.35 6 11.25 6.9 11.25 8L11.25 12C11.25 13.1 10.35 14 9.25 14L5.75 14C4.65 14 3.75 13.1 3.75 12L3.75 8C3.75 6.9 4.65 6 5.75 6Z', ['M6.75 6L6.75 4.75L5.5 4.75L5.5 3.5L12.25 3.5L12.25 4.75L8.25 4.75L8.25 6L6.75 6Z']),
    'Кондиціонери для волосся': glyph('M3.75 1.75L11.25 1.75C11.25 5 10.75 7.5 10 9.5L5 9.5C4.25 7.5 3.75 5 3.75 1.75Z', ['M5.5 10L9.5 10C10.05 10 10.5 10.45 10.5 11L10.5 12.75C10.5 13.3 10.05 13.75 9.5 13.75L5.5 13.75C4.95 13.75 4.5 13.3 4.5 12.75L4.5 11C4.5 10.45 4.95 10 5.5 10Z']),
    'Маски для волосся': glyph('M3.75 6L11.25 6C12.35 6 13.25 6.9 13.25 8L13.25 11.25C13.25 12.35 12.35 13.25 11.25 13.25L3.75 13.25C2.65 13.25 1.75 12.35 1.75 11.25L1.75 8C1.75 6.9 2.65 6 3.75 6ZM1.75 9.1C3.4 8.1 4.85 10.1 6.5 9.1C8.15 8.1 9.6 10.1 11.25 9.1C12 8.65 12.7 8.7 13.25 9L13.25 10.2C12.7 9.9 12 9.85 11.25 10.3C9.6 11.3 8.15 9.3 6.5 10.3C4.85 11.3 3.4 9.3 1.75 10.3L1.75 9.1Z', ['M3.25 3L11.75 3C12.16 3 12.5 3.34 12.5 3.75L12.5 4.5C12.5 4.91 12.16 5.25 11.75 5.25L3.25 5.25C2.84 5.25 2.5 4.91 2.5 4.5L2.5 3.75C2.5 3.34 2.84 3 3.25 3Z'], true),
    'Незмивний догляд': glyph('M6 6.5L8.5 6.5C9.47 6.5 10.25 7.28 10.25 8.25L10.25 12C10.25 12.97 9.47 13.75 8.5 13.75L6 13.75C5.03 13.75 4.25 12.97 4.25 12L4.25 8.25C4.25 7.28 5.03 6.5 6 6.5Z', ['M5.75 6.5L5.75 2.75L9 2.75L11.25 3.75L11.25 5L9 5L9 6.5L5.75 6.5Z', 'M12.75 1.7C13.05 1.7 13.3 1.95 13.3 2.25C13.3 2.55 13.05 2.8 12.75 2.8C12.45 2.8 12.2 2.55 12.2 2.25C12.2 1.95 12.45 1.7 12.75 1.7Z', 'M13.6 3.45C13.9 3.45 14.15 3.7 14.15 4C14.15 4.3 13.9 4.55 13.6 4.55C13.3 4.55 13.05 4.3 13.05 4C13.05 3.7 13.3 3.45 13.6 3.45Z', 'M12.75 5.2C13.05 5.2 13.3 5.45 13.3 5.75C13.3 6.05 13.05 6.3 12.75 6.3C12.45 6.3 12.2 6.05 12.2 5.75C12.2 5.45 12.45 5.2 12.75 5.2Z']),
    'Догляд за шкірою голови': glyph('M7.5 1C9.54 3.55 10.9 5.59 10.9 8.14C10.9 10.01 9.37 11.54 7.5 11.54C5.63 11.54 4.1 10.01 4.1 8.14C4.1 5.59 5.46 3.55 7.5 1Z', ['M1.75 12.25C3.4 11.25 4.85 13.25 6.5 12.25C8.15 11.25 9.6 13.25 11.25 12.25C12 11.8 12.7 11.85 13.25 12.15L13.25 13.35C12.7 13.05 12 13 11.25 13.45C9.6 14.45 8.15 12.45 6.5 13.45C4.85 14.45 3.4 12.45 1.75 13.45L1.75 12.25Z']),
    'Догляд за бородою': glyph('M2.5 3C2.5 9 4.5 13.5 7.5 13.5C10.5 13.5 12.5 9 12.5 3C11.5 6 10 7.25 7.5 7.25C5 7.25 3.5 6 2.5 3Z', ['M3.75 6.6C5.4 5.25 6.75 5.5 7.5 6.3C8.25 5.5 9.6 5.25 11.25 6.6C9.85 7.5 8.5 7.6 7.5 7.2C6.5 7.6 5.15 7.5 3.75 6.6Z']),
    'Зволоження тіла': glyph('M6.25 2C8.65 5 10.25 7.4 10.25 10.4C10.25 12.6 8.45 14.4 6.25 14.4C4.05 14.4 2.25 12.6 2.25 10.4C2.25 7.4 3.85 5 6.25 2Z', ['M12 1.75C12.81 2.76 13.35 3.57 13.35 4.59C13.35 5.33 12.74 5.94 12 5.94C11.26 5.94 10.65 5.33 10.65 4.59C10.65 3.57 11.19 2.76 12 1.75Z']),
    'Ексфоліація тіла': glyph('M5 4.5L10 4.5C11.79 4.5 13.25 5.96 13.25 7.75L13.25 10.25C13.25 12.04 11.79 13.5 10 13.5L5 13.5C3.21 13.5 1.75 12.04 1.75 10.25L1.75 7.75C1.75 5.96 3.21 4.5 5 4.5ZM5 7.2C5.44 7.2 5.8 7.56 5.8 8C5.8 8.44 5.44 8.8 5 8.8C4.56 8.8 4.2 8.44 4.2 8C4.2 7.56 4.56 7.2 5 7.2ZM8.5 6.6C8.86 6.6 9.15 6.89 9.15 7.25C9.15 7.61 8.86 7.9 8.5 7.9C8.14 7.9 7.85 7.61 7.85 7.25C7.85 6.89 8.14 6.6 8.5 6.6ZM10.25 9.45C10.69 9.45 11.05 9.81 11.05 10.25C11.05 10.69 10.69 11.05 10.25 11.05C9.81 11.05 9.45 10.69 9.45 10.25C9.45 9.81 9.81 9.45 10.25 9.45ZM6.25 10.6C6.61 10.6 6.9 10.89 6.9 11.25C6.9 11.61 6.61 11.9 6.25 11.9C5.89 11.9 5.6 11.61 5.6 11.25C5.6 10.89 5.89 10.6 6.25 10.6Z', ['M4 1.5C4.41 1.5 4.75 1.84 4.75 2.25C4.75 2.66 4.41 3 4 3C3.59 3 3.25 2.66 3.25 2.25C3.25 1.84 3.59 1.5 4 1.5Z', 'M7.5 0.85C7.91 0.85 8.25 1.19 8.25 1.6C8.25 2.01 7.91 2.35 7.5 2.35C7.09 2.35 6.75 2.01 6.75 1.6C6.75 1.19 7.09 0.85 7.5 0.85Z', 'M11 1.65C11.41 1.65 11.75 1.99 11.75 2.4C11.75 2.81 11.41 3.15 11 3.15C10.59 3.15 10.25 2.81 10.25 2.4C10.25 1.99 10.59 1.65 11 1.65Z'], true),
    'Догляд за шиєю та декольте': glyph('M5.5 4.25C6.1 4.6 6.8 4.8 7.5 4.8C8.2 4.8 8.9 4.6 9.5 4.25L9.5 7.15C9.5 8.5 10.75 9.3 13.5 10.1L13.5 13.75L1.5 13.75L1.5 10.1C4.25 9.3 5.5 8.5 5.5 7.15L5.5 4.25Z', ['M7.5 10.35C8 10.35 8.4 10.75 8.4 11.25C8.4 11.75 8 12.15 7.5 12.15C7 12.15 6.6 11.75 6.6 11.25C6.6 10.75 7 10.35 7.5 10.35Z']),
    'Набори косметики': glyph('M3 7.5L12 7.5C12.69 7.5 13.25 8.06 13.25 8.75L13.25 12.5C13.25 13.19 12.69 13.75 12 13.75L3 13.75C2.31 13.75 1.75 13.19 1.75 12.5L1.75 8.75C1.75 8.06 2.31 7.5 3 7.5ZM6 11.25L9 11.25C9.133 11.25 9.26 11.197 9.354 11.104C9.447 11.01 9.5 10.883 9.5 10.75C9.5 10.617 9.447 10.49 9.354 10.396C9.26 10.303 9.133 10.25 9 10.25L6 10.25C5.867 10.25 5.74 10.303 5.646 10.396C5.553 10.49 5.5 10.617 5.5 10.75C5.5 10.883 5.553 11.01 5.646 11.104C5.74 11.197 5.867 11.25 6 11.25Z', ['M4.1 3.5L5.9 3.5C6.23 3.5 6.5 3.77 6.5 4.1L6.5 6.4C6.5 6.73 6.23 7 5.9 7L4.1 7C3.77 7 3.5 6.73 3.5 6.4L3.5 4.1C3.5 3.77 3.77 3.5 4.1 3.5Z', 'M4.6 1.25L5.4 1.25C5.59 1.25 5.75 1.41 5.75 1.6L5.75 2.65C5.75 2.84 5.59 3 5.4 3L4.6 3C4.41 3 4.25 2.84 4.25 2.65L4.25 1.6C4.25 1.41 4.41 1.25 4.6 1.25Z', 'M8.6 5L11.15 5C11.48 5 11.75 5.27 11.75 5.6L11.75 6.4C11.75 6.73 11.48 7 11.15 7L8.6 7C8.27 7 8 6.73 8 6.4L8 5.6C8 5.27 8.27 5 8.6 5Z', 'M8.8 3.5L10.95 3.5C11.12 3.5 11.25 3.63 11.25 3.8L11.25 4.2C11.25 4.37 11.12 4.5 10.95 4.5L8.8 4.5C8.63 4.5 8.5 4.37 8.5 4.2L8.5 3.8C8.5 3.63 8.63 3.5 8.8 3.5Z'], true),
    'Косметологічні гаджети': glyph('M7.5 2C10.26 2 12.5 4.69 12.5 8C12.5 11.31 10.26 14 7.5 14C4.74 14 2.5 11.31 2.5 8C2.5 4.69 4.74 2 7.5 2ZM5.4 6.45C6.01 6.45 6.5 6.81 6.5 7.25C6.5 7.69 6.01 8.05 5.4 8.05C4.79 8.05 4.3 7.69 4.3 7.25C4.3 6.81 4.79 6.45 5.4 6.45ZM9.6 6.45C10.21 6.45 10.7 6.81 10.7 7.25C10.7 7.69 10.21 8.05 9.6 8.05C8.99 8.05 8.5 7.690 8.5 7.25C8.5 6.81 8.99 6.45 9.6 6.45ZM6 11.5L9 11.5C9.133 11.5 9.26 11.447 9.354 11.354C9.447 11.26 9.5 11.133 9.5 11C9.5 10.867 9.447 10.74 9.354 10.646C9.26 10.553 9.133 10.5 9 10.5L6 10.5C5.867 10.5 5.74 10.553 5.646 10.646C5.553 10.74 5.5 10.867 5.5 11C5.5 11.133 5.553 11.26 5.646 11.354C5.74 11.447 5.867 11.5 6 11.5Z', ['M6 3C6.28 3 6.5 3.22 6.5 3.5C6.5 3.78 6.28 4 6 4C5.72 4 5.5 3.78 5.5 3.5C5.5 3.22 5.72 3 6 3Z', 'M7.5 2.5C7.78 2.5 8 2.72 8 3C8 3.28 7.78 3.5 7.5 3.5C7.22 3.5 7 3.28 7 3C7 2.72 7.22 2.5 7.5 2.5Z', 'M9 3C9.28 3 9.5 3.22 9.5 3.5C9.5 3.78 9.28 4 9 4C8.72 4 8.5 3.78 8.5 3.5C8.5 3.22 8.72 3 9 3Z'], true),
    'Аксесуари для вій та брів': glyph('M6 2.75L9 2.75L11.25 13C11.3 13.6 10.6 13.95 10.2 13.55L7.5 6.25L4.8 13.55C4.4 13.95 3.7 13.6 3.75 13L6 2.75Z', ['M6.1 1.25L8.9 1.25C9.23 1.25 9.5 1.52 9.5 1.85L9.5 2.65C9.5 2.98 9.23 3.25 8.9 3.25L6.1 3.25C5.77 3.25 5.5 2.98 5.5 2.65L5.5 1.85C5.5 1.52 5.77 1.25 6.1 1.25Z']),
    'Аксесуари для волосся': glyph('M2.375 8L3.625 8L3.625 10.625C3.625 10.97 3.345 11.25 3 11.25C2.655 11.25 2.375 10.97 2.375 10.625L2.375 8ZM4.625 8L5.875 8L5.875 10.625C5.875 10.97 5.595 11.25 5.25 11.25C4.905 11.25 4.625 10.97 4.625 10.625L4.625 8ZM6.875 8L8.125 8L8.125 10.625C8.125 10.97 7.845 11.25 7.5 11.25C7.155 11.25 6.875 10.97 6.875 10.625L6.875 8ZM9.125 8L10.375 8L10.375 10.625C10.375 10.97 10.095 11.25 9.75 11.25C9.405 11.25 9.125 10.97 9.125 10.625L9.125 8ZM11.375 8L12.625 8L12.625 10.625C12.625 10.97 12.345 11.25 12 11.25C11.655 11.25 11.375 10.97 11.375 10.625L11.375 8Z', ['M1.75 6.75C1.75 4.5 4.25 3.25 7.5 3.25C10.75 3.25 13.25 4.5 13.25 6.75L13.25 7.5C13.25 7.78 13.03 8 12.75 8L2.25 8C1.97 8 1.75 7.78 1.75 7.5L1.75 6.75Z']),
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

    // The Skin(ID) promo docked at the bottom of every level: its top peeks out, a tap opens it whole,
    // a tap on the dimmed menu above (or on the card outside its button) tucks it back.
    // On <body>, outside the live menu: that menu has a transform, so a fixed box inside it would scroll
    const dock = document.createElement('div')
    dock.className = 'cm-dock'
    dock.innerHTML = `<div class="cm-dock__scrim"></div><div class="cm-dock__sheet">${promo()}</div>`
    document.body.append(dock)
    const sheet = dock.querySelector('.cm-dock__sheet')
    const setDock = (open) => {
      dock.classList.toggle('is-open', open)
      follow(true)
    }

    // At the end of a list the card scrolls out with it: every list ends with room for the whole card
    // (--cm-sheet-h, see .cm-prototype), and over the last stretch — as long as the card's hidden part — the
    // card rises 1:1 with the scroll, so at the very bottom it stands whole under the last item
    const peekPx = () => parseFloat(getComputedStyle(sheet).getPropertyValue('--cm-peek')) || 68
    const scroller = () => {
      const open = panels()
      return section.classList.contains('active') ? section : open.length ? open[open.length - 1] : all
    }
    const follow = (animate) => {
      if (!dock.classList.contains('is-shown') || dock.classList.contains('is-open')) {
        sheet.style.transform = ''
        sheet.style.transition = ''
        return
      }
      const strip = parseFloat(getComputedStyle(dock, '::after').height) || 16
      const hidden = Math.max(0, sheet.offsetHeight - peekPx() - strip)
      const box = scroller()
      const left = box.scrollHeight - box.scrollTop - box.clientHeight
      sheet.style.transition = animate ? '' : 'none'
      sheet.style.transform = `translateY(${Math.floor(Math.min(Math.max(left, 0), hidden))}px)`
    }
    const measure = () => document.documentElement.style.setProperty('--cm-sheet-h', `${sheet.offsetHeight}px`)
    new ResizeObserver(() => {
      measure()
      follow(false)
    }).observe(sheet)
    document.addEventListener('scroll', (e) => e.target === scroller() && follow(false), { capture: true, passive: true })

    dock.addEventListener('click', (e) => {
      if (e.target.closest('.cm-dock__scrim')) return setDock(false)
      if (!dock.classList.contains('is-open')) {
        e.preventDefault()
        return setDock(true)
      }
      if (!e.target.closest('.cm-promo__button')) setDock(false)
    })

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
      // The dock shows while the mobile menu is open (the live burger puts .active on <body>)
      const menuOpen = mobile.matches && document.body.classList.contains('active')
      dock.classList.toggle('is-shown', menuOpen)
      if (!menuOpen) dock.classList.remove('is-open')
      measure()
      // after the panel slide has set the new list's scroll: back to peeking, or out if that list is short
      requestAnimationFrame(() => follow(true))
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
      section.innerHTML = `<div class="cm-level">${pills(s, Number(row.dataset.section))}${bestsellers(s)}</div>`
      section.scrollTop = 0
      section.classList.add('active')
      sync()
    })

    section.addEventListener('click', onPillsClick)

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
