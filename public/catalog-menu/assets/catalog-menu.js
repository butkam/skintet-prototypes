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

  /* 15px pill glyphs (Обличчя only for now): the body in a top-to-bottom fade, details solid.
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
    'Креми для обличчя': glyph('M3.75 5.25H11.25C12.355 5.25 13.25 6.145 13.25 7.25V11.5C13.25 12.605 12.355 13.5 11.25 13.5H3.75C2.645 13.5 1.75 12.605 1.75 11.5V7.25C1.75 6.145 2.645 5.25 3.75 5.25Z', ['M4 1.5H11C11.414 1.5 11.75 1.836 11.75 2.25V3.5C11.75 3.914 11.414 4.25 11 4.25H4C3.586 4.25 3.25 3.914 3.25 3.5V2.25C3.25 1.836 3.586 1.5 4 1.5Z']),
    'Сироватки для обличчя': glyph('M5.5 6.5H9.5C10.605 6.5 11.5 7.395 11.5 8.5V11.75C11.5 12.855 10.605 13.75 9.5 13.75H5.5C4.395 13.75 3.5 12.855 3.5 11.75V8.5C3.5 7.395 4.395 6.5 5.5 6.5Z', ['M7.5 0.75C8.328 0.75 9 1.422 9 2.25V2.75C9 3.578 8.328 4.25 7.5 4.25C6.672 4.25 6 3.578 6 2.75V2.25C6 1.422 6.672 0.75 7.5 0.75Z', 'M5.5 4.5H9.5C9.776 4.5 10 4.724 10 5V5.5C10 5.776 9.776 6 9.5 6H5.5C5.224 6 5 5.776 5 5.5V5C5 4.724 5.224 4.5 5.5 4.5Z']),
    'Пілінги та ексфоліанти': glyph('M3.75 1.75H11.25C12.355 1.75 13.25 2.645 13.25 3.75V6.5L7 7L6.5 13.25H3.75C2.645 13.25 1.75 12.355 1.75 11.25V3.75C1.75 2.645 2.645 1.75 3.75 1.75Z', ['M13.25 7.25L7.75 7.75L7.25 13.25C9.75 12.75 12.75 9.75 13.25 7.25Z']),
    'Тоніки для обличчя': glyph('M5.5 5H9.5C10.743 5 11.75 6.007 11.75 7.25V11.5C11.75 12.743 10.743 13.75 9.5 13.75H5.5C4.257 13.75 3.25 12.743 3.25 11.5V7.25C3.25 6.007 4.257 5 5.5 5Z', ['M6 1.25H9C9.414 1.25 9.75 1.586 9.75 2V3.25C9.75 3.664 9.414 4 9 4H6C5.586 4 5.25 3.664 5.25 3.25V2C5.25 1.586 5.586 1.25 6 1.25Z']),
    'Очищення обличчя': glyph('M9 4.75C11.485 4.75 13.5 6.765 13.5 9.25C13.5 11.735 11.485 13.75 9 13.75C6.515 13.75 4.5 11.735 4.5 9.25C4.5 6.765 6.515 4.75 9 4.75ZM7.4 6.6C7.98 6.6 8.45 7.07 8.45 7.65C8.45 8.23 7.98 8.7 7.4 8.7C6.82 8.7 6.35 8.23 6.35 7.65C6.35 7.07 6.82 6.6 7.4 6.6Z', ['M3.75 2.65C4.91 2.65 5.85 3.59 5.85 4.75C5.85 5.91 4.91 6.85 3.75 6.85C2.59 6.85 1.65 5.91 1.65 4.75C1.65 3.59 2.59 2.65 3.75 2.65Z', 'M8.4 1.25C9.035 1.25 9.55 1.765 9.55 2.4C9.55 3.035 9.035 3.55 8.4 3.55C7.765 3.55 7.25 3.035 7.25 2.4C7.25 1.765 7.765 1.25 8.4 1.25Z'], true),
    'Зняття макіяжу': glyph('M6.5 3.25C9.4 3.25 11.75 5.6 11.75 8.5C11.75 11.4 9.4 13.75 6.5 13.75C3.6 13.75 1.25 11.4 1.25 8.5C1.25 5.6 3.6 3.25 6.5 3.25ZM4.6 5.95C4.959 5.95 5.25 6.241 5.25 6.6C5.25 6.959 4.959 7.25 4.6 7.25C4.241 7.25 3.95 6.959 3.95 6.6C3.95 6.241 4.241 5.95 4.6 5.95ZM8.4 5.95C8.759 5.95 9.05 6.241 9.05 6.6C9.05 6.959 8.759 7.25 8.4 7.25C8.041 7.25 7.75 6.959 7.75 6.6C7.75 6.241 8.041 5.95 8.4 5.95ZM6.5 7.85C6.859 7.85 7.15 8.141 7.15 8.5C7.15 8.859 6.859 9.15 6.5 9.15C6.141 9.15 5.85 8.859 5.85 8.5C5.85 8.141 6.141 7.85 6.5 7.85ZM4.6 9.75C4.959 9.75 5.25 10.041 5.25 10.4C5.25 10.759 4.959 11.05 4.6 11.05C4.241 11.05 3.95 10.759 3.95 10.4C3.95 10.041 4.241 9.75 4.6 9.75ZM8.4 9.75C8.759 9.75 9.05 10.041 9.05 10.4C9.05 10.759 8.759 11.05 8.4 11.05C8.041 11.05 7.75 10.759 7.75 10.4C7.75 10.041 8.041 9.75 8.4 9.75Z', ['M12.25 1.25C13 2.2 13.65 3.2 13.65 4.25C13.65 5.02 13.02 5.65 12.25 5.65C11.48 5.65 10.85 5.02 10.85 4.25C10.85 3.2 11.5 2.2 12.25 1.25Z'], true),
    'Сонцезахист для обличчя': glyph('M7.5 4.4C9.212 4.4 10.6 5.788 10.6 7.5C10.6 9.212 9.212 10.6 7.5 10.6C5.788 10.6 4.4 9.212 4.4 7.5C4.4 5.788 5.788 4.4 7.5 4.4Z', [
      'M8.05 2.9V1.15C8.05 0.846 7.804 0.6 7.5 0.6C7.196 0.6 6.95 0.846 6.95 1.15V2.9C6.95 3.204 7.196 3.45 7.5 3.45C7.804 3.45 8.05 3.204 8.05 2.9Z',
      'M11.142 4.636L12.379 3.399C12.594 3.184 12.594 2.836 12.379 2.621C12.164 2.406 11.816 2.406 11.601 2.621L10.364 3.858C10.149 4.073 10.149 4.421 10.364 4.636C10.579 4.851 10.927 4.851 11.142 4.636Z',
      'M12.1 8.05H13.85C14.154 8.05 14.4 7.804 14.4 7.5C14.4 7.196 14.154 6.95 13.85 6.95H12.1C11.796 6.95 11.55 7.196 11.55 7.5C11.55 7.804 11.796 8.05 12.1 8.05Z',
      'M10.364 11.142L11.601 12.379C11.816 12.594 12.164 12.594 12.379 12.379C12.594 12.164 12.594 11.816 12.379 11.601L11.142 10.364C10.927 10.149 10.579 10.149 10.364 10.364C10.149 10.579 10.149 10.927 10.364 11.142Z',
      'M6.95 12.1V13.85C6.95 14.154 7.196 14.4 7.5 14.4C7.804 14.4 8.05 14.154 8.05 13.85V12.1C8.05 11.796 7.804 11.55 7.5 11.55C7.196 11.55 6.95 11.796 6.95 12.1Z',
      'M3.858 10.364L2.621 11.601C2.406 11.816 2.406 12.164 2.621 12.379C2.836 12.594 3.184 12.594 3.399 12.379L4.636 11.142C4.851 10.927 4.851 10.579 4.636 10.364C4.421 10.149 4.073 10.149 3.858 10.364Z',
      'M2.9 6.95H1.15C0.846 6.95 0.6 7.196 0.6 7.5C0.6 7.804 0.846 8.05 1.15 8.05H2.9C3.204 8.05 3.45 7.804 3.45 7.5C3.45 7.196 3.204 6.95 2.9 6.95Z',
      'M4.636 3.858L3.399 2.621C3.184 2.406 2.836 2.406 2.621 2.621C2.406 2.836 2.406 3.184 2.621 3.399L3.858 4.636C4.073 4.851 4.421 4.851 4.636 4.636C4.851 4.421 4.851 4.073 4.636 3.858Z',
    ]),
  }

  /* Pill glyphs for the other sections, in the same style: a 15px glyph, the main shape in the fade, details solid.
     Small shape helpers keep the paths readable */
  const n = (v) => +v.toFixed(2)
  const rr = (x, y, w, h, r) => {
    const k = r * 0.5523
    return `M${n(x + r)} ${n(y)}H${n(x + w - r)}C${n(x + w - r + k)} ${n(y)} ${n(x + w)} ${n(y + r - k)} ${n(x + w)} ${n(y + r)}V${n(y + h - r)}C${n(x + w)} ${n(y + h - r + k)} ${n(x + w - r + k)} ${n(y + h)} ${n(x + w - r)} ${n(y + h)}H${n(x + r)}C${n(x + r - k)} ${n(y + h)} ${n(x)} ${n(y + h - r + k)} ${n(x)} ${n(y + h - r)}V${n(y + r)}C${n(x)} ${n(y + r - k)} ${n(x + r - k)} ${n(y)} ${n(x + r)} ${n(y)}Z`
  }
  const el = (cx, cy, rx, ry = rx) => {
    const kx = rx * 0.5523, ky = ry * 0.5523
    return `M${n(cx)} ${n(cy - ry)}C${n(cx + kx)} ${n(cy - ry)} ${n(cx + rx)} ${n(cy - ky)} ${n(cx + rx)} ${n(cy)}C${n(cx + rx)} ${n(cy + ky)} ${n(cx + kx)} ${n(cy + ry)} ${n(cx)} ${n(cy + ry)}C${n(cx - kx)} ${n(cy + ry)} ${n(cx - rx)} ${n(cy + ky)} ${n(cx - rx)} ${n(cy)}C${n(cx - rx)} ${n(cy - ky)} ${n(cx - kx)} ${n(cy - ry)} ${n(cx)} ${n(cy - ry)}Z`
  }
  /* A stroke with round ends from (x1, y1) to (x2, y2), w wide */
  const cap = (x1, y1, x2, y2, w) => {
    const len = Math.hypot(x2 - x1, y2 - y1), h = w / 2
    const nx = (-(y2 - y1) / len) * h, ny = ((x2 - x1) / len) * h
    return `M${n(x1 + nx)} ${n(y1 + ny)}L${n(x2 + nx)} ${n(y2 + ny)}A${h} ${h} 0 0 0 ${n(x2 - nx)} ${n(y2 - ny)}L${n(x1 - nx)} ${n(y1 - ny)}A${h} ${h} 0 0 0 ${n(x1 + nx)} ${n(y1 + ny)}Z`
  }
  const drop = (cx, top, r) => {
    const cy = top + r * 2.1
    return `M${n(cx)} ${n(top)}C${n(cx + r * 0.6)} ${n(top + r * 0.75)} ${n(cx + r)} ${n(cy - r * 0.75)} ${n(cx + r)} ${n(cy)}C${n(cx + r)} ${n(cy + r * 0.55)} ${n(cx + r * 0.55)} ${n(cy + r)} ${n(cx)} ${n(cy + r)}C${n(cx - r * 0.55)} ${n(cy + r)} ${n(cx - r)} ${n(cy + r * 0.55)} ${n(cx - r)} ${n(cy)}C${n(cx - r)} ${n(cy - r * 0.75)} ${n(cx - r * 0.6)} ${n(top + r * 0.75)} ${n(cx)} ${n(top)}Z`
  }
  const closedEye = 'M1.5 5.25C4.5 10.5 10.5 10.5 13.5 5.25C10.5 7.25 4.5 7.25 1.5 5.25Z'
  const lashes = [cap(7.5, 9.7, 7.5, 12.6, 0.85), cap(4.4, 9, 3.6, 11.6, 0.85), cap(10.6, 9, 11.4, 11.6, 0.85)]
  const brow = 'M1.5 9.25C3.75 4.75 9.25 3.5 13.5 6L13 7.4C9.5 5.75 5.25 6.75 2.75 10.25Z'
  const wave = (y) => `M1.75 ${y}C3.4 ${y - 1} 4.85 ${y + 1} 6.5 ${y}C8.15 ${y - 1} 9.6 ${y + 1} 11.25 ${y}C12 ${y - 0.45} 12.7 ${y - 0.4} 13.25 ${y - 0.1}V${y + 1.1}C12.7 ${y + 0.8} 12 ${y + 0.75} 11.25 ${y + 1.2}C9.6 ${y + 2.2} 8.15 ${y + 0.2} 6.5 ${y + 1.2}C4.85 ${y + 2.2} 3.4 ${y + 0.2} 1.75 ${y + 1.2}Z`

  Object.assign(PILL_ICON, {
    // Макіяж
    'Макіяж обличчя': glyph('M7.5 1C10 2.5 10.5 5.5 9.75 7H5.25C4.5 5.5 5 2.5 7.5 1Z', [rr(5.25, 7.5, 4.5, 2, 0.5), 'M6.25 10H8.75L8.25 14H6.75Z']),
    'Макіяж очей': glyph(rr(1.25, 3.5, 12.5, 8, 2) + el(4.5, 7.5, 1.7) + el(7.5, 7.5, 1.7) + el(10.5, 7.5, 1.7), [el(4.5, 7.5, 1), el(7.5, 7.5, 1), el(10.5, 7.5, 1)], true),
    'Макіяж брів': glyph('M2.32 10.92L9.12 4.12L10.88 5.88L4.08 12.68Z', ['M9.12 4.12L11.9 3.1L10.88 5.88Z', cap(2.2, 12.8, 3.2, 11.8, 2.5)]),
    'Макіяж губ': glyph(rr(4.25, 8, 6.5, 5.75, 1.25), ['M5.5 7V3.75L9.5 1.5V7Z']),
    // Зона навколо очей
    'Креми для шкіри навколо очей': glyph('M4.25 13.75H10.75L9.75 6.25H5.25Z', [rr(3.75, 12.5, 7.5, 1.5, 0.5), 'M6.5 6.25L7 2.1C7.1 1.45 7.9 1.45 8 2.1L8.5 6.25Z']),
    'Сироватки для шкіри навколо очей': glyph(rr(4.5, 5.5, 6, 8.25, 1.75), [el(7.5, 2.75, 1.75), rr(5.75, 4, 3.5, 1.75, 0.4)]),
    // Губи
    'Догляд за губами': glyph(
      'M1.4 7.5C3 5.55 4.65 3.9 5.93 3.9C6.68 3.9 7.13 4.35 7.5 4.8C7.88 4.35 8.33 3.9 9.08 3.9C10.35 3.9 12 5.55 13.6 7.5C12 9.9 9.9 11.25 7.5 11.25C5.1 11.25 3 9.9 1.4 7.5Z' +
        'M1.4 7.5C4.5 8.3 10.5 8.3 13.6 7.5C10.5 9 4.5 9 1.4 7.5Z',
      [el(10.25, 5.6, 0.7)],
      true
    ),
    // Вії та брови
    'Догляд за віями': glyph(closedEye, lashes),
    'Догляд за бровами': glyph(brow, [drop(11.25, 8.25, 1.5)]),
    'Очищення вій та брів': glyph(closedEye, [...lashes, el(10.75, 2.25, 1.2), el(13.1, 3.6, 0.75), el(8.4, 1.75, 0.6)]),
    // Волосся
    'Шампуні для волосся': glyph(rr(3.75, 6, 7.5, 8, 2), ['M6.75 6V4.75H5.5V3.5H12.25V4.75H8.25V6Z']),
    'Кондиціонери для волосся': glyph('M3.75 1.75H11.25C11.25 5 10.75 7.5 10 9.5H5C4.25 7.5 3.75 5 3.75 1.75Z', [rr(4.5, 10, 6, 3.75, 1)]),
    'Маски для волосся': glyph(rr(1.75, 6, 11.5, 7.25, 2) + wave(9.1), [rr(2.5, 3, 10, 2.25, 0.75)], true),
    'Незмивний догляд': glyph(rr(4.25, 6.5, 6, 7.25, 1.75), ['M5.75 6.5V2.75H9L11.25 3.75V5H9V6.5Z', el(12.75, 2.25, 0.55), el(13.6, 4, 0.55), el(12.75, 5.75, 0.55)]),
    'Догляд за шкірою голови': glyph(drop(7.5, 1, 3.4), [wave(12.25)]),
    'Догляд за бородою': glyph('M2.5 3C2.5 9 4.5 13.5 7.5 13.5C10.5 13.5 12.5 9 12.5 3C11.5 6 10 7.25 7.5 7.25C5 7.25 3.5 6 2.5 3Z', ['M3.75 6.6C5.4 5.25 6.75 5.5 7.5 6.3C8.25 5.5 9.6 5.25 11.25 6.6C9.85 7.5 8.5 7.6 7.5 7.2C6.5 7.6 5.15 7.5 3.75 6.6Z']),
    // Тіло
    'Зволоження тіла': glyph(drop(6.25, 2, 4), [drop(12.25, 1.25, 1.35), drop(12, 7.75, 1)]),
    'Ексфоліація тіла': glyph(rr(1.75, 4.5, 11.5, 9, 3.25) + el(5, 8, 0.8) + el(8.5, 7.25, 0.65) + el(10.25, 10.25, 0.8) + el(6.25, 11.25, 0.65), [el(4, 2.25, 0.75), el(7.5, 1.6, 0.75), el(11, 2.4, 0.75)], true),
    'Догляд за шиєю та декольте': glyph('M5.25 1.5H9.75V5.75C9.75 7.5 11 8.25 13.5 9V13.75H1.5V9C4 8.25 5.25 7.5 5.25 5.75Z', [el(7.5, 10.4, 1.05)]),
    // Набори
    'Набори косметики': glyph(rr(2, 6.5, 11, 7.25, 1.5), [rr(1.25, 4.25, 12.5, 2.5, 0.75), rr(6.75, 6.75, 1.5, 7, 0.2), el(5.6, 2.9, 1.25), el(9.4, 2.9, 1.25)]),
    // Гаджети та аксесуари
    'Косметологічні гаджети': glyph(el(7.5, 8, 5, 6) + el(5.4, 7.25, 1.1, 0.8) + el(9.6, 7.25, 1.1, 0.8) + cap(6, 11, 9, 11, 1), [el(6, 3.5, 0.5), el(7.5, 3, 0.5), el(9, 3.5, 0.5)], true),
    'Аксесуари для вій та брів': glyph('M6 2.75H9L11.25 13C11.3 13.6 10.6 13.95 10.2 13.55L7.5 6.25L4.8 13.55C4.4 13.95 3.7 13.6 3.75 13Z', [rr(5.5, 1.25, 4, 2, 0.6)]),
    'Аксесуари для волосся': glyph(rr(1.5, 2.25, 12, 3.75, 1.5), Array.from({ length: 7 }, (_, i) => rr(2.4 + i * 1.62, 6.25, 0.85, 6.5, 0.42))),
  })

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
    const setDock = (open) => dock.classList.toggle('is-open', open)
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
      if (!menuOpen) setDock(false)
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
