<script setup lang="ts">
// «Замовлення · N позицій / Розгорнути ▾ / сума» (Figma 112:1545–1550) — expands to the order contents
import { ref } from 'vue'
import SkIcon from '@/components/SkIcon.vue'
import CheckoutSummaryRow from './CheckoutSummaryRow.vue'
import { useCart } from '@/composables/useCart'
import { useCheckout } from '@/composables/useCheckout'
import { formatPrice } from '@/data/catalog'

const cart = useCart()
const { positions, deliveryPriceLabel } = useCheckout()
const open = ref(false)
</script>

<template>
  <div class="order">
    <CheckoutSummaryRow icon="ShoppingBag" :title="`Замовлення · ${positions}`">
      <template #caption>
        <button class="order__toggle body-s" type="button" :aria-expanded="open" @click="open = !open">
          {{ open ? 'Згорнути' : 'Розгорнути' }}
          <SkIcon name="CaretDownXs" :size="12" class="order__caret" :class="{ 'is-open': open }" />
        </button>
      </template>
      <template #aside>
        <span class="heading-s">{{ formatPrice(cart.total.value) }}</span>
      </template>
    </CheckoutSummaryRow>

    <div class="order__details" :class="{ 'is-open': open }">
      <div class="order__inner">
        <ul class="order__lines">
          <li v-for="line in cart.lines.value" :key="line.id" class="order__line">
            <img class="order__thumb" :src="line.image" alt="" />
            <div class="order__line-text">
              <p class="order__line-title body-m">{{ line.title }}</p>
              <p class="order__line-meta body-s">{{ line.qty }} × {{ formatPrice(line.price) }}</p>
            </div>
            <span class="heading-s">{{ formatPrice(line.price * line.qty) }}</span>
          </li>
        </ul>
        <dl class="order__totals">
          <div><dt class="body-m">Доставка</dt><dd class="heading-s">{{ deliveryPriceLabel }}</dd></div>
          <div v-if="cart.giftCount.value"><dt class="body-m">Подарунки, {{ cart.giftCount.value }}</dt><dd class="heading-s">{{ formatPrice(cart.giftsTotal.value) }}</dd></div>
        </dl>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order__toggle {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin: -4px -6px;
  padding: 4px 6px;
  color: var(--action-primary-fg-disabled);
}

.order__caret {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.order__caret.is-open {
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
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin: 0;
  padding: var(--space-4) 0 0;
  list-style: none;
}

/* Line sum sits on the title's baseline */
.order__line {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
}

.order__line > .heading-s {
  flex-shrink: 0;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.order__thumb {
  align-self: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.order__line-text {
  flex: 1;
  min-width: 0;
}

.order__line-title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.order__line-meta {
  color: var(--fg-muted);
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
</style>
