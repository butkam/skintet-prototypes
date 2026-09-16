<script setup lang="ts">
// Figma checkout header (node 112:1560): logo left, «Увійти» + PeopleCircle right
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SkIcon from '@/components/SkIcon.vue'
import logo from '@/assets/images/logo.png'
import { prefersReducedMotion, spring } from '@/motion/spring'
import { takeInAppBack } from '@/router'

const route = useRoute()

/* ---------- Push / pop transition between steps ---------- */

// forward: new step slides in from the right over the old one (old drifts left)
// back:    current step slides out to the right, revealing the previous one
const direction = ref<'forward' | 'back'>('forward')
// Browser back/forward (incl. iOS edge-swipe, which Safari already animates) → swap instantly
let fromHistory = false
const instant = ref(false)
// In-app «back» controls also go through history, but should still slide
const markHistoryNav = () => (fromHistory = !takeInAppBack())
onMounted(() => window.addEventListener('popstate', markHistoryNav))
onBeforeUnmount(() => window.removeEventListener('popstate', markHistoryNav))

watch(
  () => Number(route.meta.step ?? 0),
  (next, prev) => {
    direction.value = next >= (prev ?? 0) ? 'forward' : 'back'
    instant.value = fromHistory
    fromHistory = false
  },
)

// Clip the off-screen part only while sliding: a permanent overflow clip around the pages made iOS Safari
// lag their sticky bars (steps, summary row) behind the scroll — they jittered
const sliding = ref(0)
const track = (done: () => void) => {
  sliding.value++
  return () => {
    sliding.value--
    done()
  }
}

const slide = spring({ stiffness: 380, damping: 39, mass: 1 }) // critically damped — no overshoot
const PARALLAX = '-30%'

function onEnter(el: Element, finish: () => void) {
  if (instant.value) return finish()
  const done = track(finish)
  const page = el as HTMLElement
  if (prefersReducedMotion()) {
    page.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150 }).onfinish = done
    return
  }
  const forward = direction.value === 'forward'
  page.classList.add('is-sliding', forward ? 'is-above' : 'is-below')
  page
    .animate([{ transform: `translateX(${forward ? '100%' : PARALLAX})` }, { transform: 'translateX(0)' }], {
      duration: slide.duration,
      easing: slide.easing,
    })
    .onfinish = () => {
    page.classList.remove('is-sliding', 'is-above', 'is-below')
    done()
  }
}

function onLeave(el: Element, finish: () => void) {
  if (instant.value) return finish()
  const done = track(finish)
  const page = el as HTMLElement
  // Take the old page out of flow but keep it visually where it is — the router scrolls to top next
  page.style.top = `${-window.scrollY}px`
  // Reach the bottom of the screen, so a shorter page underneath never peeks out below it
  page.style.minHeight = `calc(${window.scrollY}px + 100lvh - var(--checkout-header-h))`
  page.classList.add('is-leaving')
  if (prefersReducedMotion()) {
    page.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' }).onfinish = done
    return
  }
  const forward = direction.value === 'forward'
  page.classList.add(forward ? 'is-below' : 'is-above')
  page.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${forward ? PARALLAX : '100%'})` }], {
    duration: slide.duration,
    easing: slide.easing,
    fill: 'forwards',
  }).onfinish = done
}
</script>

<template>
  <div class="checkout">
    <header class="checkout-header" data-sticky-top>
      <RouterLink to="/" class="checkout-header__logo" aria-label="Skin(tet) — на головну">
        <img :src="logo" alt="Skin(tet)" />
      </RouterLink>
      <button class="checkout-header__login body-l" type="button">
        <SkIcon name="PeopleCircle" />
        Увійти
      </button>
    </header>

    <div class="checkout__pages" :class="{ 'is-sliding': sliding }">
      <RouterView v-slot="{ Component, route: r }">
        <Transition :css="false" @enter="onEnter" @leave="onLeave">
          <component :is="Component" :key="r.name" class="checkout__page" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style scoped>
.checkout {
  --checkout-header-h: calc(env(safe-area-inset-top) + 56px);
  min-height: 100svh;
  background: var(--bg-canvas);
}

/* Solid, sticky. Background lives on ::before — Safari 26 samples sticky elements'
   own background near the top edge to tint its status bar */
.checkout-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--checkout-header-h);
  padding: env(safe-area-inset-top) var(--space-5) 0;
}

.checkout-header::before {
  content: '';
  position: absolute;
  inset: 0 0 -2px 0;
  z-index: -1;
  background: var(--bg-canvas);
}

.checkout-header__logo {
  display: block;
  width: 79px;
  height: 32px;
}

.checkout-header__logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.checkout-header__login {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  margin-right: -2px;
  color: var(--neutral-1000);
}

/* ---------- Page transitions ---------- */

.checkout__pages {
  position: relative;
}

/* Hide the off-screen part while sliding, without creating a scroll container */
.checkout__pages.is-sliding {
  overflow-x: clip;
}

.checkout__page {
  position: relative;
  background: var(--bg-canvas);
}

.checkout__page.is-leaving {
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
}

/* Sliding pages cover the whole screen: a short page (e.g. «Замовлення прийнято») otherwise
   ended mid-screen and the other page, moving at a different speed, showed below it */
.checkout__page.is-sliding {
  min-height: calc(100lvh - var(--checkout-header-h));
}

.checkout__page.is-above {
  z-index: 2;
  box-shadow: var(--elevation-l);
}

.checkout__page.is-below {
  z-index: 1;
}
</style>
