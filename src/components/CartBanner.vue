<script setup lang="ts">
// Figma "banner" (node 76:2763) — повідомлення «товар додано в кошик»
import { onBeforeUnmount, ref, watch } from 'vue'
import { prefersReducedMotion, spring, springs } from '@/motion/spring'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    image: string
    actionLabel?: string
    /** Auto-hide delay, ms */
    duration?: number
    /** Change this value to re-trigger the "added again" pulse while visible */
    pulseKey?: number
  }>(),
  { subtitle: '1 товар додано', actionLabel: 'До кошика', duration: 3500, pulseKey: 0 },
)

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ action: [] }>()

const card = ref<HTMLElement | null>(null)
let hideTimer: ReturnType<typeof setTimeout> | undefined

function scheduleHide() {
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => (open.value = false), props.duration)
}

watch(open, (value) => (value ? scheduleHide() : clearTimeout(hideTimer)))
onBeforeUnmount(() => clearTimeout(hideTimer))

// Repeat add while visible → spring pulse + reset timer
watch(
  () => props.pulseKey,
  () => {
    if (!open.value || !card.value || drag.active) return
    scheduleHide()
    if (prefersReducedMotion()) return
    const s = spring(springs.pop)
    card.value.animate(
      [{ transform: 'scale(0.94)' }, { transform: 'scale(1)' }],
      { duration: s.duration, easing: s.easing },
    )
  },
)

/* ---------- Enter / leave ---------- */

function onEnter(el: Element, done: () => void) {
  if (prefersReducedMotion()) {
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150 }).onfinish = done
    return
  }
  const s = spring(springs.bouncy)
  const a = el.animate(
    [
      { transform: 'translateY(calc(100% + 40px)) scale(0.9)' },
      { transform: 'translateY(0) scale(1)' },
    ],
    { duration: s.duration, easing: s.easing },
  )
  el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, easing: 'ease-out' })
  a.onfinish = done
}

function onLeave(el: Element, done: () => void) {
  const from = (el as HTMLElement).style.transform || 'translateY(0)'
  const a = el.animate(
    [
      { transform: from, opacity: 1 },
      { transform: 'translateY(calc(100% + 40px)) scale(0.96)', opacity: 0 },
    ],
    { duration: prefersReducedMotion() ? 120 : 220, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' },
  )
  a.onfinish = done
}

/* ---------- Swipe down to dismiss ---------- */

const drag = { active: false, startY: 0, dy: 0, lastY: 0, lastT: 0, velocity: 0, pointerId: -1 }

function onPointerDown(e: PointerEvent) {
  if ((e.target as HTMLElement).closest('button')) return
  drag.active = true
  drag.pointerId = e.pointerId
  drag.startY = drag.lastY = e.clientY
  drag.lastT = e.timeStamp
  drag.dy = drag.velocity = 0
  card.value?.setPointerCapture(e.pointerId)
  clearTimeout(hideTimer)
}

function onPointerMove(e: PointerEvent) {
  if (!drag.active || e.pointerId !== drag.pointerId || !card.value) return
  const raw = e.clientY - drag.startY
  // Rubber-band when pulling upward
  drag.dy = raw > 0 ? raw : raw * 0.2
  const dt = Math.max(1, e.timeStamp - drag.lastT)
  drag.velocity = ((e.clientY - drag.lastY) / dt) * 1000
  drag.lastY = e.clientY
  drag.lastT = e.timeStamp
  card.value.style.transform = `translateY(${drag.dy}px)`
}

function onPointerUp(e: PointerEvent) {
  if (!drag.active || e.pointerId !== drag.pointerId || !card.value) return
  drag.active = false
  const el = card.value
  const height = el.offsetHeight

  if (drag.dy > height * 0.5 || drag.velocity > 500) {
    open.value = false
    return
  }

  // Spring back, carrying release velocity
  const releaseVelocity = Math.abs(drag.dy) > 1 ? -drag.velocity / drag.dy : 0
  const s = spring({ ...springs.snappy, velocity: Math.max(-20, Math.min(20, Math.round(releaseVelocity))) })
  el.animate([{ transform: `translateY(${drag.dy}px)` }, { transform: 'translateY(0)' }], {
    duration: s.duration,
    easing: s.easing,
  })
  el.style.transform = ''
  scheduleHide()
}
</script>

<template>
  <div class="cart-banner-region" aria-live="polite">
    <Transition :css="false" @enter="onEnter" @leave="onLeave">
      <div
        v-if="open"
        ref="card"
        class="cart-banner"
        role="status"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <img class="cart-banner__thumb" :src="image" alt="" />
        <div class="cart-banner__text">
          <p class="cart-banner__title body-s">{{ title }}</p>
          <p class="cart-banner__subtitle body-s">{{ subtitle }}</p>
        </div>
        <button class="cart-banner__action body-s" type="button" @click="emit('action')">
          {{ actionLabel }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Offset from the bottom edge (not padded down to it): Safari 26 samples fixed elements
   within 3px of the viewport bottom to tint its toolbar and paints a solid bar */
.cart-banner-region {
  position: fixed;
  inset-inline: 0;
  bottom: calc(env(safe-area-inset-bottom) + var(--space-5));
  z-index: 50;
  display: flex;
  justify-content: center;
  padding: 0 var(--space-5);
  pointer-events: none;
}

.cart-banner {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
  height: 58px;
  padding: 6px;
  border-radius: 16px;
  background: var(--bg-canvas);
  box-shadow: 0 8px 12px oklch(0% 0 0 / 0.12), 0 0 0.5px oklch(0% 0 0 / 0.24);
  pointer-events: auto;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  will-change: transform;
}

.cart-banner__thumb {
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  border-radius: var(--radius-sm);
  background: var(--neutral-0);
  object-fit: cover;
  pointer-events: none;
}

.cart-banner__text {
  flex: 1;
  min-width: 0;
  margin-left: var(--space-2);
}

.cart-banner__title,
.cart-banner__subtitle {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cart-banner__title {
  color: var(--action-secondary-fg);
}

.cart-banner__subtitle {
  color: var(--fg-muted);
}

.cart-banner__action {
  flex-shrink: 0;
  align-self: stretch;
  margin: -6px -6px -6px var(--space-6);
  padding: 0 var(--space-5) 0 var(--space-3);
  border-radius: 0 16px 16px 0;
  color: var(--action-secondary-fg);
}

.cart-banner__action:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: -4px;
}
</style>
