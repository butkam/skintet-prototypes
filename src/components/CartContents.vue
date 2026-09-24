<script setup lang="ts">
// Figma "iPhone 17 - 9" (node 112:1857) — кошик з товарами
// Прилипання: шкала під хедером, «Замовити» внизу (node 112:2021)
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import SkButton from './SkButton.vue'
import CartGifts from './CartGifts.vue'
import CartLineItem from './CartLineItem.vue'
import CartPromo from './CartPromo.vue'
import { useCart } from '@/composables/useCart'
import { formatAmount, formatPrice, samples } from '@/data/catalog'
import { prefersReducedMotion } from '@/motion/spring'
import { snap, tween } from '@/motion/tween'

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

/* ---------- Подарунок перед оформленням ---------- */

// Перший тап по «Замовити» з вільним слотом не веде на оформлення, а розгортає
// панель подарунків — вона липка, тож видно і її, і кнопку. Другий тап іде далі.
const giftsOffered = ref(false)
const giftsLeft = computed(() => cart.samplesAllowed.value - pickedSamples.value)

// Поки не обрано жодного подарунка, кнопка каже, що замовлення піде без них.
// Щойно щось обрано — це вже звичайне «Замовити», хай і з вільними слотами
const orderLabel = computed(() =>
  giftsOffered.value && giftsLeft.value > 0 && !pickedSamples.value
    ? giftsLeft.value === 1
      ? 'Без подарунка'
      : 'Без подарунків'
    : 'Замовити',
)

// Дія живе в панелі, лише поки та відкрита: інакше (сума впала нижче порогу)
// кошик лишився б узагалі без кнопки
const offering = computed(() => giftsOffered.value && cart.giftsOpen.value)

function order() {
  if (!giftsOffered.value && giftsLeft.value > 0 && !cart.samplesDeclined.value) {
    giftsOffered.value = true
    cart.giftsOpen.value = true
    return
  }
  checkout()
}

function toggleSet(id: string) {
  const line = cart.lines.value.find((l) => l.id === id)
  if (line) line.expanded = !line.expanded
}

/* Line removal: fade + collapse height */
// Висоту, відступи й рамку веде скрипт, кроками по цілому фізичному пікселю
// (див. motion/tween). Через WAAPI вони інтерполювались дробово, і на iPhone,
// поки рядок згортався (наприклад, знятий семпл), кошик під ним дрижав.
function onLeave(el: Element, done: () => void) {
  const node = el as HTMLElement
  if (prefersReducedMotion()) return done()

  const cs = getComputedStyle(node)
  const height = node.getBoundingClientRect().height
  const padding = parseFloat(cs.paddingBottom)
  const border = parseFloat(cs.borderBottomWidth)
  // Проміжок між рядками теж зникає, інакше після згортання лишилась би дірка
  const gap = parseFloat(getComputedStyle(node.parentElement!).rowGap) || 0

  node.style.overflow = 'hidden'
  tween(
    280,
    (p) => {
      node.style.opacity = `${1 - p}`
      node.style.height = `${snap(height * (1 - p))}px`
      node.style.paddingBottom = `${snap(padding * (1 - p))}px`
      node.style.borderBottomWidth = `${snap(border * (1 - p))}px`
      node.style.marginBottom = `${-snap(gap * p)}px`
    },
    done,
  )
}
</script>

<template>
  <div class="cart">
    <CartGifts :offering="offering" :action-label="orderLabel" @order="checkout" />

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

    <div v-if="!offering" class="cart__checkout">
      <SkButton class="cart__checkout-btn" block @click="order">
        {{ orderLabel }}
        <template #amount>{{ formatPrice(cart.total.value) }}</template>
      </SkButton>
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
