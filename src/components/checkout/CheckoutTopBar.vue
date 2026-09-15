<script setup lang="ts">
// Figma 112:1544 / 112:1593 / 125:5494 — sticky steps bar with progress line
// canvas → transparent fade at the bottom so content disappears under it
import { nextTick, onMounted, ref, watch } from 'vue'
import { spring } from '@/motion/spring'
import { backTo } from '@/router'

const props = defineProps<{ step: 1 | 2 | 3 }>()

const steps = [
  { label: 'Дані й доставка', to: 'checkout-delivery' },
  { label: 'Оплата', to: 'checkout-payment' },
  { label: 'Створення профілю', to: null },
] as const

const list = ref<HTMLElement | null>(null)
const fill = ref(0)
const animate = ref(false)
const s = spring({ stiffness: 170, damping: 26, mass: 1 })

// Progress line fills up to the right edge of the current step label
function measure() {
  const items = list.value?.querySelectorAll<HTMLElement>('[data-step]')
  const current = items?.[props.step - 1]
  if (!current || !list.value) return
  fill.value = current.offsetLeft + current.offsetWidth - list.value.offsetLeft
}

onMounted(() => {
  // Start from the previous step's edge, then spring to the current one
  const items = list.value?.querySelectorAll<HTMLElement>('[data-step]')
  const prev = props.step > 1 ? items?.[props.step - 2] : null
  fill.value = prev && list.value ? prev.offsetLeft + prev.offsetWidth - list.value.offsetLeft : 0
  requestAnimationFrame(() => {
    animate.value = true
    measure()
  })
  document.fonts?.ready.then(measure)
})
watch(() => props.step, () => nextTick(measure))

function go(i: number) {
  const target = steps[i].to
  if (i + 1 < props.step && target) backTo({ name: target })
}
</script>

<template>
  <div class="topbar">
    <nav class="topbar__steps" aria-label="Кроки оформлення">
      <ol ref="list" class="topbar__list">
        <template v-for="(item, i) in steps" :key="item.label">
          <li
            :data-step="i + 1"
            class="topbar__step body-s"
            :class="{ 'is-done': i + 1 <= step }"
            :aria-current="i + 1 === step ? 'step' : undefined"
          >
            <button v-if="i + 1 < step && item.to" type="button" @click="go(i)">{{ item.label }}</button>
            <span v-else>{{ item.label }}</span>
          </li>
          <li v-if="i < steps.length - 1" class="topbar__sep body-s" aria-hidden="true">›</li>
        </template>
      </ol>
      <div class="topbar__track">
        <span
          class="topbar__fill"
          :style="{ width: `${fill}px`, transition: animate ? `width ${s.duration}ms ${s.easing}` : 'none' }"
        />
      </div>
    </nav>
    <div v-if="$slots.default" class="topbar__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: var(--checkout-header-h);
  z-index: 15;
  padding: var(--space-4) var(--space-5) var(--space-4);
}

/* Figma: solid canvas, fading out over the last 18px */
.topbar::before {
  content: '';
  position: absolute;
  inset: 0 0 -18px 0;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    var(--bg-canvas) calc(100% - 18px),
    color-mix(in oklch, var(--bg-canvas) 0%, transparent) 100%
  );
}

.topbar__list {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
  white-space: nowrap;
}

.topbar__step,
.topbar__sep {
  color: var(--action-primary-fg-disabled);
  transition: color 0.3s ease;
}

.topbar__step.is-done {
  color: var(--fg-default);
}

.topbar__step button {
  color: inherit;
}

.topbar__track {
  position: relative;
  height: var(--border-width-thick);
  margin-top: 11px;
  background: var(--progress-track);
}

.topbar__fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: var(--progress-fill);
}

.topbar__content {
  margin-top: var(--space-4);
}
</style>
