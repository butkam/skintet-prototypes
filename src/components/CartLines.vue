<script setup lang="ts">
// Figma node 132:6136 — список товарів кошика
import CartLineItem from './CartLineItem.vue'
import { useCart } from '@/composables/useCart'
import { prefersReducedMotion } from '@/motion/spring'
import { snap, tween } from '@/motion/tween'

const cart = useCart()

function toggleSet(id: string) {
  const line = cart.lines.value.find((l) => l.id === id)
  if (line) line.expanded = !line.expanded
}

/* Line removal: fade + collapse height */
// Висоту, відступи й рамку веде скрипт, кроками по цілому фізичному пікселю
// (див. motion/tween). Через WAAPI вони інтерполювались дробово, і на iPhone,
// поки рядок згортався (наприклад, знятий семпл), кошик під ним дрижав.
function onLeave(el: Element, done: () => void) {
  const node = el as HTMLElement
  if (prefersReducedMotion()) return done()

  const cs = getComputedStyle(node)
  const height = node.getBoundingClientRect().height
  const padding = parseFloat(cs.paddingBottom)
  const border = parseFloat(cs.borderBottomWidth)
  // Проміжок між рядками теж зникає, інакше після згортання лишилась би дірка
  const gap = parseFloat(getComputedStyle(node.parentElement!).rowGap) || 0

  node.style.overflow = 'hidden'
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
  <TransitionGroup tag="div" class="lines" :css="false" @leave="onLeave">
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
