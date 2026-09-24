<script setup lang="ts">
import CartDrawer from '@/components/CartDrawer.vue'
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { useKeyboardAvoid } from '@/composables/useKeyboardAvoid'
import { backTo } from '@/router'

const { baseFrozen, baseTop, baseCovered, drawerOpen } = useCart()
useKeyboardAvoid()

const route = useRoute()
const router = useRouter()

// The cart is a history entry (?cart): Back closes it, and Back from checkout reopens it
watch(
  () => route.query.cart !== undefined,
  (inUrl) => (drawerOpen.value = inUrl),
)
watch(drawerOpen, (open) => {
  if (open === (route.query.cart !== undefined)) return
  const { cart: _cart, ...rest } = route.query
  if (open) router.push({ query: { ...route.query, cart: null } })
  else backTo({ path: route.path, query: rest, hash: route.hash }, { replace: true })
})
</script>

<template>
  <div
    class="app-frame"
    :class="{ 'is-frozen': baseFrozen, 'is-covered': baseCovered }"
    :style="baseFrozen ? { top: `${baseTop}px` } : undefined"
    :inert="baseFrozen || undefined"
  >
    <RouterView />
  </div>
  <CartDrawer />
</template>

<style>
/* Mobile-first: on wider screens, center a phone-width column */
.app-frame {
  max-width: 440px;
  margin-inline: auto;
  min-height: 100svh;
  background: var(--bg-canvas);
}

/* Held visually in place under the cart (see useCart → baseFrozen).
   Absolute, not fixed: Safari 26 treats full-width fixed layers at the viewport edges
   as toolbar-tint sources and paints a solid bar behind its bottom toolbar. */
.app-frame.is-frozen {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 0;
  background: transparent;
  pointer-events: none;
}

/* Повністю під нерухомим кошиком — див. useCart → baseCovered */
.app-frame.is-covered {
  visibility: hidden;
}

@media (min-width: 480px) {
  body {
    background: var(--bg-surface);
  }
  .app-frame {
    box-shadow: var(--elevation-s);
    /* No shadow under the bottom edge — overscroll would reveal it as a hairline */
    clip-path: inset(-24px -24px 0 -24px);
  }
}
</style>
