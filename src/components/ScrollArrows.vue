<script setup lang="ts">
// Круглі стрілки поверх горизонтальної стрічки: мишею її не потягнеш, тож кнопка з краю
// підказує, що далі ще є. Кожна видна, лише поки в її бік є куди гортати.
// Стоять по центру батька заввишки — батько має бути position: relative
import { onBeforeUnmount, ref, watch } from 'vue'
import { prefersReducedMotion } from '@/motion/spring'

const props = defineProps<{ target: HTMLElement | null | undefined }>()

const canPrev = ref(false)
const canNext = ref(false)

function sync() {
  const el = props.target
  if (!el) {
    canPrev.value = canNext.value = false
    return
  }
  // 1px запасу: дробова прокрутка на ретині не доходить рівно до краю
  canPrev.value = el.scrollLeft > 1
  canNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}

// На ширину видимої частини мінус поля — прилипання докрутить до найближчої картки
function page(dir: 1 | -1) {
  const el = props.target
  if (!el) return
  const inset = parseFloat(getComputedStyle(el).paddingLeft) || 0
  el.scrollBy({ left: dir * (el.clientWidth - inset * 2), behavior: prefersReducedMotion() ? 'instant' : 'smooth' })
}

// Стрічка змінила ширину, картку додали чи прибрали — перераховуємо, які стрілки потрібні
const resizeObserver = new ResizeObserver(sync)
const mutationObserver = new MutationObserver(sync)

watch(
  () => props.target,
  (el, old) => {
    if (old) {
      old.removeEventListener('scroll', sync)
      resizeObserver.unobserve(old)
    }
    mutationObserver.disconnect()
    if (el) {
      el.addEventListener('scroll', sync, { passive: true })
      resizeObserver.observe(el)
      mutationObserver.observe(el, { childList: true })
    }
    sync()
  },
  { immediate: true, flush: 'post' },
)

onBeforeUnmount(() => {
  props.target?.removeEventListener('scroll', sync)
  resizeObserver.disconnect()
  mutationObserver.disconnect()
})
</script>

<template>
  <!-- Лише для миші (див. стилі); з клавіатури стрічку й так прогортає Tab по картках -->
  <button class="arrow arrow--prev" :class="{ 'is-shown': canPrev }" type="button" tabindex="-1" aria-hidden="true" @click="page(-1)">
    <svg viewBox="0 0 16 16"><path d="M10 4 6 8l4 4" /></svg>
  </button>
  <button class="arrow arrow--next" :class="{ 'is-shown': canNext }" type="button" tabindex="-1" aria-hidden="true" @click="page(1)">
    <svg viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" /></svg>
  </button>
</template>

<style scoped>
/* Кругла кнопка по центру стрічки заввишки, на відступі стрічки від краю */
.arrow {
  position: absolute;
  top: 50%;
  z-index: 1;
  display: none;
  place-items: center;
  width: 40px;
  height: 40px;
  margin-top: -20px;
  border-radius: var(--radius-full);
  background: var(--bg-canvas);
  color: var(--fg-default);
  box-shadow: var(--elevation-m);
  opacity: 0;
  scale: 0.8;
  pointer-events: none;
  transition: opacity 0.18s ease, scale 0.24s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.15s ease;
}
.arrow--prev {
  left: var(--space-3);
}
.arrow--next {
  right: var(--space-3);
}
.arrow.is-shown {
  opacity: 1;
  scale: 1;
  pointer-events: auto;
}
.arrow:hover {
  background: var(--bg-surface);
}
.arrow:active {
  scale: 0.92;
}

.arrow svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5px;
  stroke-linecap: square;
}

/* Тачем стрічку гортають пальцем — там стрілки лише заважали б */
@media (hover: hover) and (pointer: fine) {
  .arrow {
    display: grid;
  }
}

@media (prefers-reduced-motion: reduce) {
  .arrow {
    transition: none;
  }
}
</style>
