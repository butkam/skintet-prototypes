<script setup lang="ts">
// Figma "iPhone 17 - 9" (node 112:1857) — кошик з товарами
// Прилипання: шкала під хедером, «Замовити» внизу (node 112:2021)
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import SkButton from './SkButton.vue'
import CartGifts from './CartGifts.vue'
import CartLineItem from './CartLineItem.vue'
import CartPromo from './CartPromo.vue'
import { useCart } from '@/composables/useCart'
import { formatAmount, formatPrice, samples } from '@/data/catalog'
import { prefersReducedMotion } from '@/motion/spring'

const cart = useCart()
const router = useRouter()

// «Замовити» → оформлення: close the cart, and land the next page at the top
// «Замовити»: open checkout underneath first, then push it in from the right while the cart exits left
async function checkout() {
  cart.baseScrollY.value = 0
  cart.baseTop.value = 0
  cart.drawerExit.value = 'forward'
  await router.push('/checkout')
  cart.closeDrawer()
}

const pickedSamples = computed(() => cart.sampleLines.value.length)

function toggleSet(id: string) {
  const line = cart.lines.value.find((l) => l.id === id)
  if (line) line.expanded = !line.expanded
}

/* Line removal: fade + collapse height */
function onLeave(el: Element, done: () => void) {
  const node = el as HTMLElement
  if (prefersReducedMotion()) return done()
  node.style.overflow = 'hidden'
  node.animate(
    [
      { opacity: 1, height: `${node.offsetHeight}px`, marginBottom: '0px' },
      { opacity: 0, height: '0px', marginBottom: 'calc(var(--space-5) * -1)', paddingBottom: '0px', borderBottomWidth: '0px' },
    ],
    { duration: 280, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  ).onfinish = done
}
</script>

<template>
  <div class="cart">
    <CartGifts />

    <TransitionGroup tag="div" class="lines" :css="false" @leave="onLeave">
      <CartLineItem
        v-for="line in cart.lines.value"
        :key="line.id"
        :line="line"
        @increment="cart.increment(line.id)"
        @decrement="cart.decrement(line.id)"
        @toggle="toggleSet(line.id)"
      />
    </TransitionGroup>

    <div class="cart__promo">
      <CartPromo />
    </div>

    <dl class="summary">
      <div class="summary__row">
        <dt class="body-m">Товари, {{ cart.goodsCount.value }}</dt>
        <dd class="body-m">{{ formatPrice(cart.subtotal.value) }}</dd>
      </div>
      <div v-if="cart.giftCount.value" class="summary__row">
        <dt class="body-m">Подарунки, {{ cart.giftCount.value }}</dt>
        <dd class="body-m">{{ formatPrice(cart.giftsTotal.value) }}</dd>
      </div>
      <div v-if="pickedSamples" class="summary__row">
        <dt class="body-m">Семпли у подарунок, {{ pickedSamples }} × {{ formatAmount(samples[0].price) }}</dt>
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

    <div class="cart__checkout">
      <SkButton class="cart__checkout-btn" block @click="checkout">Замовити · {{ formatPrice(cart.total.value) }}</SkButton>
    </div>
  </div>
</template>

<style scoped>
.cart {
  display: flex;
  flex-direction: column;
  padding-bottom: calc(env(safe-area-inset-bottom) + var(--space-5));
}

/* ---------- Lines (node 132:6136) ---------- */

.lines {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  /* 20px under the gifts panel (Figma 160:7315) */
  margin-top: var(--space-5);
  padding-inline: var(--space-5);
}

.lines > :last-child {
  border-bottom: 0;
}

/* ---------- Promo & summary (nodes 112:1976–1990) ---------- */

.cart__promo {
  margin-top: var(--space-4);
  padding-inline: var(--space-5);
}

.summary {
  display: flex;
  flex-direction: column;
  margin: var(--space-8) 0 0;
  padding-inline: var(--space-5);
}

/* Figma 112:2369 — label and value Body/M; only «До сплати» value is Heading/S */
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


/* ---------- Checkout (in normal flow at the end of the cart, not sticky) ---------- */

.cart__checkout {
  margin-top: var(--space-8);
  padding: 0 var(--space-5);
}
</style>
