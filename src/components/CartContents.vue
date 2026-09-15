<script setup lang="ts">
// Figma "iPhone 17 - 9" (node 112:1857) — кошик з товарами
// Прилипання: шкала під хедером, «Замовити» внизу (node 112:2021)
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import SkButton from './SkButton.vue'
import CartProgress from './CartProgress.vue'
import CartLineItem from './CartLineItem.vue'
import SampleCard from './SampleCard.vue'
import { useCart } from '@/composables/useCart'
import { formatAmount, formatPrice, milestones, pluralSamples, samples } from '@/data/catalog'
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

const samplesThreshold = milestones.find((m) => m.samples === 1)!.amount

// Figma 112:2389–2390 / 112:2412: «Оберіть N семпл(и) у подарунок» + лічильник «k/N»
const samplesUnlocked = computed(() => cart.samplesAllowed.value > 0)
const pickedSamples = computed(() => cart.sampleLines.value.length)
const limitReached = computed(() => pickedSamples.value >= cart.samplesAllowed.value)

const samplesTitle = computed(() =>
  samplesUnlocked.value
    ? `Оберіть ${cart.samplesAllowed.value} ${pluralSamples(cart.samplesAllowed.value)} у подарунок`
    : 'Семпли у подарунок',
)

const samplesHint = computed(() =>
  samplesUnlocked.value
    ? 'Семпли у подарунок'
    : `Доступно від ${formatAmount(samplesThreshold)}, додайте ще ${formatAmount(samplesThreshold - cart.subtotal.value)}`,
)

function toggleSample(sample: (typeof samples)[number], e: MouseEvent) {
  if (cart.toggleSample(sample) || prefersReducedMotion()) return
  // Can't add → gentle horizontal shake
  ;(e.currentTarget as HTMLElement).animate(
    [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }],
    { duration: 320, easing: 'ease-out' },
  )
}

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
    <CartProgress :subtotal="cart.subtotal.value" />

    <section class="samples" aria-labelledby="samples-title">
      <div class="samples__head">
        <h3 id="samples-title" class="samples__title body-l">{{ samplesTitle }}</h3>
        <span v-if="samplesUnlocked" class="samples__counter body-s" aria-live="polite">
          {{ pickedSamples }}/{{ cart.samplesAllowed.value }}
        </span>
      </div>
      <p class="samples__hint body-s">{{ samplesHint }}</p>
      <div class="samples__track">
        <SampleCard
          v-for="s in samples"
          :key="s.id"
          :title="s.title"
          :image="s.image"
          :price="s.price"
          :selectable="samplesUnlocked"
          :selected="cart.hasSample(s.id)"
          :disabled="samplesUnlocked && limitReached && !cart.hasSample(s.id)"
          @click="toggleSample(s, $event)"
        />
      </div>
    </section>

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
      <SkButton variant="secondary" block>+ Додати промокод</SkButton>
    </div>

    <dl class="summary">
      <div class="summary__row">
        <dt class="body-m">Товари, {{ cart.goodsCount.value }}</dt>
        <dd class="heading-s">{{ formatPrice(cart.subtotal.value) }}</dd>
      </div>
      <div v-if="cart.giftCount.value" class="summary__row">
        <dt class="body-m">Подарунки, {{ cart.giftCount.value }}</dt>
        <dd class="heading-s">{{ formatPrice(cart.giftsTotal.value) }}</dd>
      </div>
      <div v-if="pickedSamples" class="summary__row">
        <dt class="body-m">Семпли у подарунок, {{ pickedSamples }} × {{ formatAmount(samples[0].price) }}</dt>
        <dd class="heading-s">{{ formatPrice(cart.samplesTotal.value) }}</dd>
      </div>
      <div class="summary__row">
        <dt class="body-m">Доставка</dt>
        <dd class="heading-s">{{ cart.freeDelivery.value ? 'Безкоштовна' : formatPrice(cart.delivery.value) }}</dd>
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

/* ---------- Samples (nodes 112:1991–1993) ---------- */

.samples {
  padding-top: var(--space-6);
}

.samples__head,
.samples__hint {
  padding-inline: var(--space-5);
}

.samples__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.samples__counter {
  flex-shrink: 0;
  color: var(--action-primary-fg-disabled);
  font-variant-numeric: tabular-nums;
}

.samples__hint {
  margin-top: 2px;
  color: var(--fg-muted);
}

.samples__track {
  display: flex;
  gap: var(--space-3);
  /* 4px vertical breathing room so the selected-border spring isn't clipped */
  margin: 14px 0 -4px;
  padding: 4px var(--space-5);
  /* Horizontal only: overflow-x alone would make overflow-y compute to auto */
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--space-5);
  scrollbar-width: none;
  touch-action: pan-x pan-y;
}
.samples__track::-webkit-scrollbar {
  display: none;
}

/* ---------- Lines (node 132:6136) ---------- */

.lines {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  margin-top: 36px;
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

/* Figma 112:2369 — label: Body/M, value: Heading/S */
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


/* ---------- Checkout (in normal flow at the end of the cart, not sticky) ---------- */

.cart__checkout {
  margin-top: var(--space-8);
  padding: 0 var(--space-5);
}
</style>
