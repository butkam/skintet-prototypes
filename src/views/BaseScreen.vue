<script setup lang="ts">
// Figma "iPhone 17 - 6" (node 112:2815) → після «Купити» — "iPhone 17 - 7" (node 112:2819)
import { ref } from 'vue'
import AppNavigation from '@/components/AppNavigation.vue'
import SkButton from '@/components/SkButton.vue'
import CartBanner from '@/components/CartBanner.vue'
import { useCart } from '@/composables/useCart'
import { resetSession } from '@/composables/persist'
import type { DemoProduct } from '@/data/demoProducts'

const cart = useCart()
const bannerOpen = ref(false)
const lastAdded = ref<DemoProduct | null>(null)

function buy() {
  lastAdded.value = cart.add()
  bannerOpen.value = true
}

function goToCart() {
  bannerOpen.value = false
  cart.openDrawer()
}
</script>

<template>
  <div class="screen">
    <!-- Прототип: «Меню» скидає кошик і всі дані оформлення з сесії -->
    <AppNavigation :cart-count="cart.count.value" @menu="resetSession" @cart="cart.openDrawer" />
    <main class="screen__content">
      <SkButton @click="buy">Купити</SkButton>
    </main>
    <!-- Always mounted: mounting it already open would skip the enter spring and the auto-hide timer -->
    <CartBanner
      v-model:open="bannerOpen"
      :title="lastAdded?.title ?? ''"
      :image="lastAdded?.image ?? ''"
      :pulse-key="cart.count.value"
      @action="goToCart"
    />
  </div>
</template>

<style scoped>
.screen {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: var(--bg-canvas);
}

.screen__content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
  padding-bottom: calc(env(safe-area-inset-bottom) + var(--space-5));
}
</style>
