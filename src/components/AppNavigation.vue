<script setup lang="ts">
// Figma "Navigation" (node 125:6093), Platform = Mobile: menu icon + logo + bag icon
// Прототип: меню — випадалка з перемиканням між прототипами, вибором подарунків (товари чи семпли) та скиданням покупок
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import SkIcon from './SkIcon.vue'
import logo from '@/assets/images/logo.png'
import { resetSession } from '@/composables/persist'
import { prefersReducedMotion, spring, springs } from '@/motion/spring'
import { giftCardModel, giftStyle, giftStyles, prototypes, setGiftStyle } from '@/variant'

const props = withDefaults(defineProps<{ cartCount?: number }>(), { cartCount: 0 })
defineEmits<{ cart: [] }>()

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

/* ---------- Меню ---------- */

const menuOpen = ref(false)
const menuRoot = ref<HTMLElement | null>(null)
const menuButton = ref<HTMLButtonElement | null>(null)
const menu = ref<HTMLElement | null>(null)

// Закривається тапом повз меню й Esc; з Esc фокус повертається на кнопку
function onPointerDown(e: PointerEvent) {
  if (!menuRoot.value?.contains(e.target as Node)) menuOpen.value = false
}
function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  menuOpen.value = false
  menuButton.value?.focus()
}

watch(menuOpen, async (open) => {
  if (!open) {
    document.removeEventListener('pointerdown', onPointerDown)
    document.removeEventListener('keydown', onKeydown)
    return
  }
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('keydown', onKeydown)
  await nextTick()
  menu.value?.querySelector<HTMLElement>('a, button')?.focus({ preventScroll: true })
})
onBeforeUnmount(() => (menuOpen.value = false))
</script>

<template>
  <header class="app-nav header-fade" data-sticky-top>
    <div ref="menuRoot" class="app-nav__menu-root">
      <button
        ref="menuButton"
        class="app-nav__action"
        type="button"
        aria-label="Меню"
        aria-haspopup="true"
        aria-controls="app-nav-menu"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      >
        <SkIcon name="BarsThree" />
      </button>
      <Transition name="app-nav-menu">
        <nav v-if="menuOpen" id="app-nav-menu" ref="menu" class="app-nav__menu" aria-label="Прототипи">
          <p class="app-nav__menu-caption body-s">Прототипи</p>
          <ul class="app-nav__menu-list">
            <li v-for="p in prototypes" :key="p.href">
              <a class="app-nav__menu-item body-m" :href="p.href" :aria-current="p.current ? 'page' : undefined">
                {{ p.title }}
                <SkIcon v-if="p.current" name="Check" :size="18" />
              </a>
            </li>
          </ul>
          <!-- Прототип /gift-card вибору не має — перемикати там нічого -->
          <template v-if="!giftCardModel">
            <hr class="app-nav__menu-divider" />
            <p class="app-nav__menu-caption body-s">Що дарувати</p>
            <ul class="app-nav__menu-list">
              <li v-for="s in giftStyles" :key="s.value">
                <button
                  class="app-nav__menu-item body-m"
                  type="button"
                  :aria-pressed="s.value === giftStyle"
                  @click="setGiftStyle(s.value)"
                >
                  {{ s.title }}
                  <SkIcon v-if="s.value === giftStyle" name="Check" :size="18" />
                </button>
              </li>
            </ul>
          </template>
          <hr class="app-nav__menu-divider" />
          <!-- Скидає кошик і всі дані оформлення цього прототипу -->
          <button class="app-nav__menu-item app-nav__menu-item--danger body-m" type="button" @click="resetSession">
            Скинути покупки
          </button>
        </nav>
      </Transition>
    </div>
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

/* ---------- Меню: картка під кнопкою, лівим краєм по її гліфу ---------- */

.app-nav__menu-root {
  position: relative;
}

.app-nav__menu {
  position: absolute;
  top: calc(100% - 10px + var(--space-2));
  left: -10px;
  width: max-content;
  min-width: 240px;
  padding: var(--space-2);
  border-radius: var(--radius-md);
  background: var(--bg-canvas);
  box-shadow: var(--elevation-m);
  transform-origin: top left;
}

.app-nav__menu-caption {
  padding: var(--space-2) var(--space-3) var(--space-1);
  color: var(--fg-muted);
}

.app-nav__menu-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.app-nav__menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  width: 100%;
  min-height: var(--control-tap-target-min);
  padding: 0 var(--space-3);
  border-radius: var(--radius-sm);
  color: var(--fg-default);
  text-align: left;
  text-decoration: none;
  transition: background-color 0.15s ease;
}

.app-nav__menu-item--danger {
  color: var(--status-danger-fg);
}

/* Лише там, де справді наводять мишею: на iOS тап лишає :hover «залиплим» (див. SkButton) */
@media (hover: hover) and (pointer: fine) {
  .app-nav__menu-item:hover {
    background: var(--action-secondary-bg-hover);
  }
}

.app-nav__menu-item:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: -2px;
}

.app-nav__menu-divider {
  margin: var(--space-2) var(--space-3);
  border: 0;
  border-top: var(--border-width-hairline) solid var(--border-default);
}

.app-nav-menu-enter-active {
  transition: opacity 0.16s ease, transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.app-nav-menu-leave-active {
  transition: opacity 0.12s ease;
}
.app-nav-menu-enter-from {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
.app-nav-menu-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .app-nav-menu-enter-active,
  .app-nav-menu-leave-active {
    transition: none;
  }
}
</style>
