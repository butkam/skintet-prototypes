<script setup lang="ts">
// Figma "Navigation" (node 125:6093), Platform = Mobile: menu icon + logo + bag icon
import { ref, watch } from 'vue'
import SkIcon from './SkIcon.vue'
import logo from '@/assets/images/logo.png'
import { prefersReducedMotion, spring, springs } from '@/motion/spring'

const props = withDefaults(defineProps<{ cartCount?: number }>(), { cartCount: 0 })
defineEmits<{ menu: []; cart: [] }>()

const badge = ref<HTMLElement | null>(null)

// Spring pop whenever the count goes up
watch(
  () => props.cartCount,
  (next, prev) => {
    if (next <= prev || prefersReducedMotion()) return
    requestAnimationFrame(() => {
      if (!badge.value) return
      const s = spring(springs.pop)
      badge.value.animate([{ transform: `scale(${prev === 0 ? 0 : 0.6})` }, { transform: 'scale(1)' }], {
        duration: s.duration,
        easing: s.easing,
      })
    })
  },
)
</script>

<template>
  <header class="app-nav header-fade" data-sticky-top>
    <button class="app-nav__action" type="button" aria-label="Меню" @click="$emit('menu')">
      <SkIcon name="BarsThree" />
    </button>
    <RouterLink to="/" class="app-nav__logo" aria-label="Skin(tet) — на головну">
      <img :src="logo" alt="Skin(tet)" />
    </RouterLink>
    <button
      class="app-nav__action"
      type="button"
      :aria-label="cartCount ? `Кошик, товарів: ${cartCount}` : 'Кошик'"
      @click="$emit('cart')"
    >
      <span class="app-nav__bag">
        <SkIcon name="ShoppingBag" />
        <span v-if="cartCount > 0" ref="badge" class="app-nav__badge body-s" aria-hidden="true">
          {{ cartCount > 99 ? '99+' : cartCount }}
        </span>
      </span>
    </button>
  </header>
</template>

<style scoped>
/* Sticky + background fade come from the global .header-fade */
.app-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(env(safe-area-inset-top) + var(--space-3)) var(--space-5) var(--space-3);
  color: var(--fg-default);
}

/* 24px glyph inside a 44px tap target, visually aligned to the 20px gutter */
.app-nav__action {
  display: grid;
  place-items: center;
  width: var(--control-tap-target-min);
  height: var(--control-tap-target-min);
  margin: -10px;
}

.app-nav__action:focus-visible,
.app-nav__logo:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: 2px;
  border-radius: var(--radius-xs);
}

.app-nav__bag {
  position: relative;
  display: block;
  width: var(--icon-md);
  height: var(--icon-md);
}

/* Figma node 125:6134 — 18px dot with 2px canvas ring, "1" in Body/S */
.app-nav__badge {
  position: absolute;
  left: 9px;
  top: -8px;
  min-width: 22px;
  height: 22px;
  padding: 0 4px;
  display: grid;
  place-items: center;
  border: 2px solid var(--bg-canvas);
  border-radius: var(--radius-full);
  background: var(--bg-inverse);
  color: var(--fg-inverse);
  font-variant-numeric: tabular-nums;
}

.app-nav__logo {
  display: block;
  width: 79px;
  height: 32px;
}

.app-nav__logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
