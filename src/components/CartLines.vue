<script setup lang="ts">
// Figma node 132:6136 — список товарів кошика
import CartLineItem from './CartLineItem.vue'
import { useCart } from '@/composables/useCart'
import { prefersReducedMotion } from '@/motion/spring'
import { LINE_ENTER_MS, snap, tween } from '@/motion/tween'

const cart = useCart()

function toggleSet(id: string) {
  const line = cart.lines.value.find((l) => l.id === id)
  if (line) line.expanded = !line.expanded
}

// Рядок, що ще розгортається, міг уже піти на видалення — тоді його вхід зупиняємо
const entering = new WeakMap<Element, () => void>()

/* Новий рядок: розсуває список від нуля, вміст проявляється вже в розкритому місці */
// Той самий хід, що й у видалення, лише навпаки: висота, відступ, рамка й проміжок
// після рядка ростуть з нуля по цілих пікселях, тож товари під ним з'їжджають плавно
function onEnter(el: Element, done: () => void) {
  const node = el as HTMLElement
  if (prefersReducedMotion()) return done()
  // Поза екраном (товар додали зі стрічки внизу кошика) розгортання ніхто не побачить, а стрічка
  // тримала б палець щокадровим прокручуванням документа — на iPhone від цього стрибав увесь кошик.
  // Тож рядок стає одразу, а стрічка зсувається один раз (ProductRail → onAdd)
  const rect = node.getBoundingClientRect()
  if (rect.bottom <= 0 || rect.top >= window.innerHeight) return done()

  const cs = getComputedStyle(node)
  const height = node.getBoundingClientRect().height
  const padding = parseFloat(cs.paddingBottom)
  const border = parseFloat(cs.borderBottomWidth)
  const gap = parseFloat(getComputedStyle(node.parentElement!).rowGap) || 0

  const frame = (p: number) => {
    // Вміст з'являється, коли під нього вже є місце, а не протискається крізь щілину
    node.style.opacity = `${Math.max(0, (p - 0.35) / 0.65)}`
    node.style.height = `${snap(height * p)}px`
    node.style.paddingBottom = `${snap(padding * p)}px`
    node.style.borderBottomWidth = `${snap(border * p)}px`
    node.style.marginBottom = `${-snap(gap * (1 - p))}px`
  }
  // Синхронно, до першої промальовки: інакше рядок на кадр блимнув би на повну висоту.
  // min-height рядка (під мініатюру) не дав би йому стиснутись до нуля
  node.style.overflow = 'hidden'
  node.style.minHeight = '0'
  frame(0)

  const finish = () => {
    entering.delete(node)
    for (const prop of ['overflow', 'minHeight', 'opacity', 'height', 'paddingBottom', 'borderBottomWidth', 'marginBottom'] as const) {
      node.style[prop] = ''
    }
    done()
  }
  entering.set(node, tween(LINE_ENTER_MS, frame, finish))
}

/* Line removal: fade + collapse height */
// Висоту, відступи й рамку веде скрипт, кроками по цілому фізичному пікселю
// (див. motion/tween). Через WAAPI вони інтерполювались дробово, і на iPhone,
// поки рядок згортався (наприклад, знятий семпл), кошик під ним дрижав.
function onLeave(el: Element, done: () => void) {
  const node = el as HTMLElement
  entering.get(node)?.()
  entering.delete(node)
  if (prefersReducedMotion()) return done()

  const cs = getComputedStyle(node)
  const height = node.getBoundingClientRect().height
  const padding = parseFloat(cs.paddingBottom)
  const border = parseFloat(cs.borderBottomWidth)
  // Проміжок між рядками теж зникає, інакше після згортання лишилась би дірка
  const gap = parseFloat(getComputedStyle(node.parentElement!).rowGap) || 0

  node.style.overflow = 'hidden'
  node.style.minHeight = '0'
  tween(
    280,
    (p) => {
      node.style.opacity = `${1 - p}`
      node.style.height = `${snap(height * (1 - p))}px`
      node.style.paddingBottom = `${snap(padding * (1 - p))}px`
      node.style.borderBottomWidth = `${snap(border * (1 - p))}px`
      node.style.marginBottom = `${-snap(gap * p)}px`
    },
    done,
  )
}
</script>

<template>
  <TransitionGroup tag="div" class="lines" :css="false" @enter="onEnter" @leave="onLeave">
    <CartLineItem
      v-for="line in cart.lines.value"
      :key="line.id"
      :line="line"
      @increment="cart.increment(line.id)"
      @decrement="cart.decrement(line.id)"
      @toggle="toggleSet(line.id)"
    />
  </TransitionGroup>
</template>

<style scoped>
.lines {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding-inline: var(--space-5);
}

.lines > :last-child {
  border-bottom: 0;
}
</style>
