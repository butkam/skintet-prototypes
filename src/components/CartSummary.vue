<script setup lang="ts">
// Figma 112:2369 — підсумок кошика
import { useCart } from '@/composables/useCart'
import { formatAmount, formatPrice, samples } from '@/data/catalog'

const cart = useCart()
</script>

<template>
  <dl class="summary">
    <div class="summary__row">
      <dt class="body-m">Товари, {{ cart.goodsCount.value }}</dt>
      <dd class="body-m">{{ formatPrice(cart.subtotal.value) }}</dd>
    </div>
    <div v-if="cart.giftCount.value" class="summary__row">
      <dt class="body-m">Подарунки, {{ cart.giftCount.value }}</dt>
      <dd class="body-m">{{ formatPrice(cart.giftsTotal.value) }}</dd>
    </div>
    <div v-if="cart.sampleLines.value.length" class="summary__row">
      <dt class="body-m">Семпли у подарунок, {{ cart.sampleLines.value.length }} × {{ formatAmount(samples[0].price) }}</dt>
      <dd class="body-m">{{ formatPrice(cart.samplesTotal.value) }}</dd>
    </div>
    <div v-if="cart.promo.value" class="summary__row">
      <dt class="body-m">Промокод {{ cart.promo.value.code }}</dt>
      <dd class="body-m summary__discount">−{{ formatPrice(cart.promoDiscount.value) }}</dd>
    </div>
    <div class="summary__row">
      <dt class="body-m">Доставка</dt>
      <dd class="body-m">{{ cart.freeDelivery.value ? 'Безкоштовна' : formatPrice(cart.delivery.value) }}</dd>
    </div>
    <div class="summary__row summary__row--total">
      <dt class="body-m">До сплати</dt>
      <dd class="heading-s">{{ formatPrice(cart.total.value) }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.summary {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding-inline: var(--space-5);
}

/* Label and value Body/M; only «До сплати» value is Heading/S */
.summary__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-block: var(--space-2);
  color: var(--fg-default);
}

.summary dd {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.summary__row:first-child {
  padding-top: 0;
}
.summary__row + .summary__row {
  border-top: var(--border-width-hairline) solid var(--border-subtle);
}

.summary dt,
.summary dd {
  margin: 0;
}

.summary .summary__discount {
  color: var(--status-success-fg);
}
</style>
