// Позначає «Ready for dev» екрани й компоненти, де стилі вже правильні:
// кожен текст привʼязаний до текстового стилю, кожен суцільний колір — до змінної чи стилю кольору.
// Figma MCP не вміє ставити devStatus, тож це робить плагін у десктопній Figma.
// Діє на виділення, а без нього — на кожну секцію-екран чи секцію-компонент поточної сторінки
// (найглибші секції; якщо секцій нема — на фрейми верхнього рівня). Решту показує списком з причинами.
// Спершу запусти «Relink text styles»: тексти, які редагував Claude, приходять без привʼязки до стилю.

// Картки документації навмисно в Inter і JetBrains Mono
const DOCS = /^Docs$/
// Системне оточення: статус-бар, Dynamic Island, тулбар Safari, кнопки Apple Pay / Google Pay —
// їх малює система (наближення в макеті), а не дизайн-система
const CHROME = /status bar|dynamic island|home indicator|safari|^wallet/i
// Логотипи брендів і платіжних систем — їхні кольори фіксовані, токени до них не застосовні
const LOGO = /logo|apple pay|google pay|mastercard|visa|24 ?pay|monobank|privat|nova ?po[sš]hta|нова пошта|^XMLID/i

const MAX_REASONS = 4

function skipSubtree(node) {
  return DOCS.test(node.name) || CHROME.test(node.name)
}

function inLogo(node) {
  for (let p = node; p && p.type !== 'PAGE'; p = p.parent) {
    if (LOGO.test(p.name)) return true
    if (p.type === 'INSTANCE' && p.mainComponent && LOGO.test(p.mainComponent.name)) return true
  }
  return false
}

const solidUnbound = (paints, styleId) =>
  Array.isArray(paints) &&
  !(typeof styleId === 'string' && styleId) &&
  paints.some((p) => p.visible !== false && p.type === 'SOLID' && !(p.boundVariables && p.boundVariables.color))

function audit(root) {
  const reasons = []
  let texts = 0
  const walk = (node) => {
    if (node !== root && skipSubtree(node)) return
    if (node.type === 'TEXT') {
      texts++
      if (node.textStyleId === figma.mixed || !node.textStyleId) {
        reasons.push(`текст без стилю: «${node.characters.slice(0, 32)}»`)
      }
    }
    // Фон і рамка секцій — це полотно, а пунктирну рамку набору варіантів малює Figma
    const ownFill = node.type !== 'SECTION'
    const ownStroke = node.type !== 'SECTION' && node.type !== 'COMPONENT_SET'
    if (!inLogo(node)) {
      if (ownFill && 'fills' in node && solidUnbound(node.fills, node.fillStyleId)) {
        reasons.push(`заливка без токена: ${node.name}`)
      }
      if (ownStroke && 'strokes' in node && solidUnbound(node.strokes, node.strokeStyleId)) {
        reasons.push(`обводка без токена: ${node.name}`)
      }
    }
    if ('children' in node) for (const c of node.children) walk(c)
  }
  walk(root)
  return { reasons, texts }
}

function units() {
  const sel = figma.currentPage.selection
  if (sel.length) return [...sel]
  const sections = figma.currentPage.findAllWithCriteria({ types: ['SECTION'] })
  const leaves = sections.filter((s) => !s.children.some((c) => c.type === 'SECTION'))
  if (leaves.length) return leaves
  return figma.currentPage.children.filter((n) => ['FRAME', 'COMPONENT', 'COMPONENT_SET'].includes(n.type))
}

const label = (node) => {
  const path = []
  for (let p = node; p && p.type !== 'PAGE'; p = p.parent) if (p.type === 'SECTION' || p === node) path.unshift(p.name)
  return path.join(' / ')
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

async function run() {
  const ready = []
  const failed = []
  const errors = []
  for (const unit of units()) {
    const { reasons, texts } = audit(unit)
    if (reasons.length) {
      failed.push({ name: label(unit), reasons })
      continue
    }
    try {
      if (!unit.devStatus || unit.devStatus.type !== 'READY_FOR_DEV') unit.devStatus = { type: 'READY_FOR_DEV' }
      ready.push(`${label(unit)}${texts ? '' : ' (без текстів)'}`)
    } catch (e) {
      errors.push(`${label(unit)}: ${e.message}`)
    }
  }

  const list = (items) => items.map((i) => `<li>${esc(i)}</li>`).join('')
  const html = `
    <style>
      body { font: 12px/1.5 Inter, system-ui, sans-serif; margin: 0; padding: 12px 16px; color: #1a1a1a; }
      h2 { font-size: 13px; margin: 14px 0 6px; }
      ul { margin: 0; padding-left: 16px; }
      li { margin: 2px 0; }
      .muted { color: #6b6b6b; }
    </style>
    <h2>Ready for dev: ${ready.length}</h2>
    <ul>${list(ready) || '<li class="muted">—</li>'}</ul>
    <h2>Ще ні: ${failed.length}</h2>
    <ul>${
      failed
        .map(
          (f) =>
            `<li><b>${esc(f.name)}</b><br><span class="muted">${f.reasons
              .slice(0, MAX_REASONS)
              .map(esc)
              .join('<br>')}${f.reasons.length > MAX_REASONS ? `<br>…ще ${f.reasons.length - MAX_REASONS}` : ''}</span></li>`,
        )
        .join('') || '<li class="muted">—</li>'
    }</ul>
    ${errors.length ? `<h2>Не вдалося позначити</h2><ul>${list(errors)}</ul>` : ''}`
  figma.showUI(html, { width: 420, height: 560, title: 'Mark ready for dev' })
}

run().catch((e) => figma.closePlugin(`Помилка: ${e.message}`))
