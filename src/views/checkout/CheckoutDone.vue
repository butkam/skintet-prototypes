<script setup lang="ts">
// Figma «Замовлення прийнято» (node 125:5422)
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SkIcon from '@/components/SkIcon.vue'
import SkButton from '@/components/SkButton.vue'
import CheckoutTopBar from '@/components/checkout/CheckoutTopBar.vue'
import { useCheckout } from '@/composables/useCheckout'
import { formatPrice } from '@/data/catalog'
import { prefersReducedMotion, spring } from '@/motion/spring'

const router = useRouter()
const { placedOrder, resetAfterOrder } = useCheckout()
const order = placedOrder.value!

const icon = ref<HTMLElement | null>(null)
onMounted(() => {
  if (prefersReducedMotion() || !icon.value) return
  const s = spring({ stiffness: 260, damping: 14, mass: 1 })
  icon.value.animate([{ transform: 'scale(0.4) rotate(-12deg)', opacity: 0 }, { transform: 'scale(1) rotate(0)', opacity: 1 }], {
    duration: s.duration,
    easing: s.easing,
  })
})

function toCatalog() {
  resetAfterOrder()
  router.push({ name: 'base' })
}
</script>

<template>
  <div class="page">
    <CheckoutTopBar :step="3" />

    <main class="done">
      <span ref="icon" class="done__icon"><SkIcon name="ShoppingBagLarge" :size="48" /></span>
      <h1 class="done__title heading-s">Замовлення {{ order.number }} прийнято</h1>
      <p class="done__text body-s">Статус надішлемо в SMS на {{ order.phone }}. Відправимо завтра, {{ order.deliveryShort }}.</p>

      <ul class="done__rows">
        <li v-for="row in order.rows" :key="row.label" class="done__row">
          <SkIcon name="Check" :size="18" />
          <span class="done__label body-m">{{ row.label }}</span>
          <span class="heading-s">{{ formatPrice(row.amount) }}</span>
        </li>
      </ul>

      <div class="done__actions">
        <SkButton block>Створити профіль</SkButton>
        <SkButton variant="secondary" block @click="toCatalog">Перейти до каталогу</SkButton>
      </div>
    </main>
  </div>
</template>

<style scoped>
.done {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px var(--space-4) calc(env(safe-area-inset-bottom) + var(--space-8));
  text-align: center;
}

.done__title {
  margin-top: var(--space-4);
  color: var(--action-secondary-fg);
}

.done__text {
  max-width: 283px;
  margin-top: var(--space-2);
  color: var(--fg-muted);
}

.done__rows {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
  margin: var(--space-6) 0 0;
  padding: 15px 19px;
  border: var(--border-width-hairline) solid var(--border-default);
  border-radius: var(--radius-lg);
  list-style: none;
  text-align: left;
}

.done__row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--action-secondary-fg);
}

.done__label {
  flex: 1;
  min-width: 0;
}

.done__row .heading-s {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.done__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  margin-top: 36px;
}
</style>
