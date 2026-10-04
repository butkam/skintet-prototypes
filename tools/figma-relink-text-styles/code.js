// Привʼязує тексти без стилю до локальних текстових стилів файлу.
// Figma MCP виконується на сервері, де немає Sailec і Nib Pro, тож стилі звідти не ставляться —
// а десктопна Figma шрифти має. Діє на виділення, а без нього — на всю поточну сторінку.

// Тексти, які Claude тимчасово лишає в Inter (там, де стиль прибрав би закреслення чи підкреслення),
// теж підтягуємо за розміром: Inter → стиль того ж розміру.
const INTER_FALLBACK = {
  'Regular|12|16': 'Body/S',
  'Regular|14|20': 'Body/M',
  'Regular|16|24': 'Body/L',
  'Bold|16|20': 'Heading/S',
  'Bold|24|28': 'Heading/M',
}

const lineHeightPx = (lh, size) =>
  lh.unit === 'PIXELS' ? lh.value : lh.unit === 'PERCENT' ? Math.round((lh.value / 100) * size) : null

const key = (family, style, size, lh) => `${family}|${style}|${size}|${lh}`

// Картки документації (фрейми «Docs») навмисно в Inter: жирний і моно, яких немає в Sailec
const inDocs = (node) => {
  for (let p = node.parent; p && p.type !== 'PAGE'; p = p.parent) if (p.name === 'Docs') return true
  return false
}

async function run() {
  const styles = await figma.getLocalTextStylesAsync()
  const byKey = new Map()
  const byName = new Map()
  for (const s of styles) {
    byName.set(s.name, s)
    byKey.set(key(s.fontName.family, s.fontName.style, s.fontSize, lineHeightPx(s.lineHeight, s.fontSize)), s)
  }

  const roots = figma.currentPage.selection.length ? figma.currentPage.selection : [figma.currentPage]
  const texts = []
  for (const root of roots) {
    if (root.type === 'TEXT') texts.push(root)
    if ('findAllWithCriteria' in root) texts.push(...root.findAllWithCriteria({ types: ['TEXT'] }))
  }

  await Promise.all(styles.map((s) => figma.loadFontAsync(s.fontName)))

  let linked = 0
  let skipped = 0
  for (const t of texts) {
    if (t.textStyleId !== '' || t.fontName === figma.mixed || t.fontSize === figma.mixed || inDocs(t)) {
      skipped++
      continue
    }
    const size = t.fontSize
    const lh = lineHeightPx(t.lineHeight, size)
    let style = byKey.get(key(t.fontName.family, t.fontName.style, size, lh))
    if (!style && t.fontName.family === 'Inter') {
      style = byName.get(INTER_FALLBACK[`${t.fontName.style}|${size}|${lh}`])
    }
    if (!style) {
      skipped++
      continue
    }
    // Стиль скидає декорацію — закреслена стара ціна й підкреслені посилання мають її зберегти
    const decoration = t.textDecoration
    await figma.loadFontAsync(t.fontName).catch(() => {})
    await t.setTextStyleIdAsync(style.id)
    if (decoration !== figma.mixed && decoration !== 'NONE') t.textDecoration = decoration
    linked++
  }

  figma.closePlugin(`Привʼязано стилів: ${linked}. Без змін: ${skipped}.`)
}

run().catch((e) => figma.closePlugin(`Помилка: ${e.message}`))
