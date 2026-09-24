<script setup lang="ts">
// Figma «Оплата» (node 112:1567) і «Декілька платежів» (node 112:1613)
import { computed, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import SkOptionCard from '@/components/SkOptionCard.vue'
import SkButton from '@/components/SkButton.vue'
import SkSelect from '@/components/SkSelect.vue'
import BankSelect from '@/components/BankSelect.vue'
import CartPromo from '@/components/CartPromo.vue'
import CheckoutTopBar from '@/components/checkout/CheckoutTopBar.vue'
import CheckoutSummaryRow from '@/components/checkout/CheckoutSummaryRow.vue'
import { useCart } from '@/composables/useCart'
import { PAYMENT_OPTIONS, useCheckout } from '@/composables/useCheckout'
import { formatAmount, formatMonthly, formatPrice, pluralPayments } from '@/data/catalog'
import PaymentLogos from '@/components/checkout/PaymentLogos.vue'
import { backTo } from '@/router'

const router = useRouter()
const cart = useCart()
const { payment, plans, deliveryTitle, recipientLine, groups, isSplit, schedule, placeOrder, settleOrder } = useCheckout()

const installments = computed(() => payment.method === 'installments')

const installmentsHint = computed(() =>
  isSplit.value ? 'У вашому кошику діють різні умови' : groups.value[0]?.kind === 'device' ? 'До 6 платежів без переплат' : 'До 3 платежів без переплат',
)

const cta = computed(() =>
  installments.value
    ? { action: 'Оформити', amount: `сьогодні ${formatPrice(schedule.value.today)}` }
    : { action: 'Оплатити', amount: formatPrice(cart.total.value) },
)

const methodError = ref('')
const methodsSection = ref<HTMLElement | null>(null)
watch(() => payment.method, () => (methodError.value = ''))

function submit() {
  if (!payment.method) {
    methodError.value = 'Оберіть спосіб оплати'
    methodsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }
  placeOrder()
  placed = true
  router.replace({ name: 'checkout-done' })
}

// Unmounted only after the slide-out transition — the screen keeps its content while it leaves
let placed = false
onUnmounted(() => placed && settleOrder())
</script>

<template>
  <div class="page">
    <CheckoutTopBar :step="2">
      <CheckoutSummaryRow icon="Shipping" :title="deliveryTitle" :caption="recipientLine">
        <template #aside>
          <RouterLink
            :to="{ name: 'checkout-delivery' }"
            class="body-m"
            @click.prevent="backTo({ name: 'checkout-delivery' })"
          >
            Змінити
          </RouterLink>
        </template>
      </CheckoutSummaryRow>
    </CheckoutTopBar>

    <main class="page__content">
      <section ref="methodsSection" aria-labelledby="payment-title">
        <h2 id="payment-title" class="section__title heading-s">Спосіб оплати</h2>
        <Transition name="method-error">
          <p v-if="methodError" class="method-error body-s" role="alert">{{ methodError }}</p>
        </Transition>

        <div class="methods" role="radiogroup" aria-label="Спосіб оплати">
          <SkOptionCard label="Онлайн карткою" :selected="payment.method === 'card'" @select="payment.method = 'card'">
            <PaymentLogos />
          </SkOptionCard>

          <div class="installments" :class="{ 'is-open': installments }">
            <SkOptionCard
              label="Оплата частинами"
              :hint="installmentsHint"
              :selected="installments"
              @select="payment.method = 'installments'"
            />

            <Transition name="reveal">
              <div v-if="installments" class="installments__body">
                <!-- Figma 202:911 — сіра смуга на всю ширину відділяє розгорнуту опцію від сусідніх -->
                <div class="band">
                  <!-- Figma 112:1640 -->
                  <div v-if="isSplit" class="info">
                  <p class="body-m">Замовлення розділиться на дві оплати</p>
                    <p class="info__text body-s">
                      Кількість платежів залежить від типу товару: апарати&nbsp;— до 6, косметика&nbsp;— до 3. Це одне&nbsp;замовлення й одна&nbsp;доставка.
                    </p>
                  </div>

                  <!-- Figma 112:1643 / 112:1663 -->
                  <article v-for="g in groups" :key="g.kind" class="plan">
                    <header class="plan__head">
                      <p class="body-m">{{ isSplit ? `Оплата ${g.index} · ${g.title}` : g.title }}</p>
                      <p class="heading-s">{{ formatMonthly(g.regular) }}</p>
                    </header>
                    <!-- Same terms at both banks -->
                    <p class="plan__label body-s">до {{ Math.max(...PAYMENT_OPTIONS[g.kind]) }} міс під 0,01%</p>
                    <div class="plan__controls">
                      <BankSelect v-model="plans[g.kind].bank" />
                      <SkSelect v-model="plans[g.kind].payments" :options="PAYMENT_OPTIONS[g.kind]" label="Кількість платежів" />
                    </div>
                    <p class="plan__label body-s">
                      {{ g.payments }} {{ pluralPayments(g.payments) }} по {{ formatAmount(Math.round(g.regular)) }} · перший сьогодні
                    </p>
                  </article>

                  <!-- Figma 112:1615, 112:1680–1690 -->
                  <section class="schedule" aria-labelledby="schedule-title">
                    <h3 id="schedule-title" class="schedule__title heading-s">Графік платежів</h3>
                    <dl class="schedule__rows">
                      <div v-for="row in schedule.rows" :key="row.label" class="schedule__row">
                        <dt class="body-s">{{ row.label }}</dt>
                        <dd class="body-m">{{ row.value }}</dd>
                      </div>
                      <div class="schedule__row schedule__row--total">
                        <dt class="body-s">Разом</dt>
                        <dd class="heading-s">{{ formatPrice(cart.total.value) }}</dd>
                      </div>
                    </dl>
                  </section>
                </div>

                <!-- Поза смугою: у макеті примітка читається вже на чистому тлі -->
                <p v-if="isSplit" class="installments__note body-s">
                  У банківській виписці буде дві операції — це не подвійне списання. Доставка одна,
                  {{ cart.freeDelivery.value ? 'безкоштовна' : formatPrice(cart.delivery.value) }}.
                </p>
              </div>
            </Transition>
          </div>

          <SkOptionCard label="Після доставки" :selected="payment.method === 'cod'" @select="payment.method = 'cod'" />
        </div>
      </section>

      <!-- Same promo state as in the cart: a code applied there shows up here already applied -->
      <CartPromo class="promo" />

      <div class="page__cta">
        <SkButton block @click="submit">
          {{ cta.action }}
          <template #amount>{{ cta.amount }}</template>
        </SkButton>
      </div>

      <p class="legal body-s">
        Підтверджуючи ви погоджуєтесь з умовами оферти, політики конфіденційності, заявою про обробку персональних даних та
        приймаєте їх.
      </p>
    </main>
  </div>
</template>

<style scoped>
.page__content {
  display: flex;
  flex-direction: column;
  padding: var(--space-4) var(--space-4) calc(env(safe-area-inset-bottom) + var(--space-5));
}

.section__title {
  padding: 0 var(--space-2);
  margin-bottom: var(--space-4);
  color: var(--action-secondary-fg);
}

.method-error {
  margin: calc(var(--space-2) - var(--space-4)) 0 var(--space-4);
  padding: 0 var(--space-2);
  color: var(--status-danger-fg);
}

.method-error-enter-active {
  transition: opacity 0.15s ease, transform 0.2s ease;
}
.method-error-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.methods {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* ---------- Installments ---------- */

/* The option card stays above the band that slides under it */
.installments > :first-child {
  position: relative;
  z-index: 1;
}

.installments__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-top: var(--space-4);
}

.installments__note {
  color: var(--fg-muted);
}

/* Figma 202:911 — full-bleed neutral/50 band behind the open option, fading at both ends.
   `isolation` keeps the z-index: -1 layer inside this block, otherwise it slips under the
   page's own white background and disappears. */
.band {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.band::before {
  content: '';
  position: absolute;
  /* 16 (gap above) + 36 (into the card, right under its label) */
  top: -52px;
  bottom: 0;
  left: calc(var(--space-4) * -1);
  right: calc(var(--space-4) * -1);
  z-index: -1;
  background: linear-gradient(
    to bottom,
    var(--neutral-0) 0%,
    var(--neutral-50) 15%,
    var(--neutral-50) 85%,
    var(--neutral-0) 100%
  );
}

.info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: 15px 23px 17px;
  border: var(--border-width-hairline) solid var(--neutral-100);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
}

.info__text {
  color: var(--neutral-700);
}

.plan {
  padding: 15px 23px 17px 19px;
  border: var(--border-width-hairline) solid var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--bg-canvas);
}

.plan__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-3);
  padding-left: var(--space-1);
  color: var(--action-secondary-fg);
}

.plan__head .body-m {
  min-width: 0;
}

.plan__head .heading-s {
  flex-shrink: 0;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.plan__label {
  padding-left: var(--space-1);
  color: var(--fg-muted);
}

.plan__head + .plan__label {
  margin-top: var(--space-1);
}

.plan__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  margin: var(--space-3) 0;
}

.schedule {
  padding: var(--space-1) var(--space-2) 0;
}

.schedule__title {
  margin-bottom: var(--space-4);
}

.schedule__rows {
  margin: 0;
}

.schedule__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  min-height: 28px;
  font-variant-numeric: tabular-nums;
}

.schedule__row dt,
.schedule__row dd {
  margin: 0;
}

.schedule__row--total {
  margin-top: var(--space-2);
  padding-top: var(--space-2);
  border-top: var(--border-width-hairline) solid var(--border-default);
}

.reveal-enter-active {
  transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.reveal-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.reveal-leave-active {
  display: none;
}

/* ---------- Bottom ---------- */

.promo {
  margin-top: 36px;
}

/* In normal flow at the end of the page (not sticky), followed by the legal note */
.page__cta {
  margin-top: 36px;
}

.legal {
  margin: var(--space-4) auto 0;
  max-width: 335px;
  text-align: center;
  color: var(--fg-muted);
}
</style>
