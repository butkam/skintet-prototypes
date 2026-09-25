<script setup lang="ts">
// «Замовлення / N позицій ⌄ / сума» (Figma 112:1545–1550) — expands to the order contents;
// same header as the desktop order column (CheckoutAside)
import { nextTick, ref } from 'vue'
import CheckoutSummaryRow from './CheckoutSummaryRow.vue'
import CheckoutLines from './CheckoutLines.vue'
import SkIcon from '@/components/SkIcon.vue'
import { useCart } from '@/composables/useCart'
import { useCheckout } from '@/composables/useCheckout'
import { formatPrice } from '@/data/catalog'

const cart = useCart()
const { positions, deliveryPriceLabel } = useCheckout()
const open = ref(false)
const root = ref<HTMLElement | null>(null)

// Expanded, the order leaves the sticky bar and scrolls with the page (see CheckoutTopBar).
// Keep it where it is on screen at the moment it unsticks/sticks.
async function toggle() {
  const before = root.value?.getBoundingClientRect().top ?? 0
  open.value = !open.value
  await nextTick()
  if (!open.value) return
  const shift = (root.value?.getBoundingClientRect().top ?? 0) - before
  if (Math.abs(shift) > 1) window.scrollBy({ top: shift, behavior: 'instant' })
}
</script>

<template>
  <div ref="root" class="order" :data-topbar-scroll="open || undefined">
    <CheckoutSummaryRow icon="ShoppingBag" title="Замовлення">
      <template #caption>
        <button class="order__toggle body-s" type="button" :aria-expanded="open" @click="toggle">
          {{ positions }}
          <SkIcon name="ChevronDownSmall" :size="16" class="order__chevron" :class="{ 'is-open': open }" />
        </button>
      </template>
      <template #aside>
        <span class="heading-s">{{ formatPrice(cart.total.value) }}</span>
      </template>
    </CheckoutSummaryRow>

    <div class="order__details" :class="{ 'is-open': open }">
      <div class="order__inner">
        <CheckoutLines class="order__lines" />
        <dl class="order__totals">
          <div><dt class="body-m">Доставка</dt><dd class="body-m">{{ deliveryPriceLabel }}</dd></div>
          <div v-if="cart.giftCount.value"><dt class="body-m">Подарунки, {{ cart.giftCount.value }}</dt><dd class="body-m">{{ formatPrice(cart.giftsTotal.value) }}</dd></div>
          <div v-if="cart.promo.value"><dt class="body-m">Промокод {{ cart.promo.value.code }}</dt><dd class="body-m order__discount">−{{ formatPrice(cart.promoDiscount.value) }}</dd></div>
        </dl>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order__toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  position: relative;
  /* Pulled 3px up towards «Замовлення»; the padding keeps the tap area */
  top: -3px;
  margin: -4px -6px;
  padding: 4px 6px;
  color: var(--action-primary-fg-disabled);
}

.order__chevron {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.order__chevron.is-open {
  transform: scaleY(-1);
}

.order__details {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.order__details.is-open {
  grid-template-rows: 1fr;
}

.order__inner {
  min-height: 0;
  overflow: hidden;
}

.order__lines {
  padding-top: var(--space-4);
}

.order__totals {
  margin: var(--space-3) 0 0;
  padding-top: var(--space-3);
  border-top: var(--border-width-hairline) solid var(--border-subtle);
}

.order__totals div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-block: 2px;
}

.order__totals dt,
.order__totals dd {
  margin: 0;
}

.order__totals .order__discount {
  color: var(--status-success-fg);
}
</style>
