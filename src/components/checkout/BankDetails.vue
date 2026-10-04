<script setup lang="ts">
// «Оплата за реквізитами»: реквізити магазину, кожен рядок копіюється окремо.
// IBAN показуємо групами по 4 знаки, а копіюємо без пробілів — так його приймає будь-який банк.
// Згори — платіжний QR-код НБУ з реквізитами, сумою й призначенням (paymentQr): на десктопі його сканують
// телефоном, а на телефоні те саме посилання відкриває застосунок банку — свій екран не відскануєш
import { computed, onBeforeUnmount, ref } from 'vue'
import SkIcon from '@/components/SkIcon.vue'
import { useCart } from '@/composables/useCart'
import { BANK_DETAILS, useCheckout } from '@/composables/useCheckout'
import { paymentQrLink, qrPath } from '@/composables/paymentQr'
import { formatPrice } from '@/data/catalog'
import { useWideCart } from '@/composables/useWideCart'

const { orderNumber } = useCheckout()
const cart = useCart()
const wide = useWideCart()

const purpose = computed(() => `Оплата рахунку № ${orderNumber.value}`)
const link = computed(() =>
  paymentQrLink({
    recipient: BANK_DETAILS.recipient,
    iban: BANK_DETAILS.iban,
    code: BANK_DETAILS.code,
    amount: cart.total.value,
    purpose: purpose.value,
  }),
)
const qr = computed(() => qrPath(link.value))
/** Тиха зона довкола коду — 4 модулі, як вимагає стандарт QR */
const QUIET = 4
const QR_PX = 152
/** Тиха зона в пікселях: від неї вирівнюємо текст і край коду з видимими модулями, а не з білим полем */
const quietPx = computed(() => (QR_PX * QUIET) / (qr.value.size + QUIET * 2))

const rows = computed(() => [
  {
    id: 'iban',
    label: 'IBAN',
    value: BANK_DETAILS.iban,
    shown: BANK_DETAILS.iban.replace(/(.{4})(?=.)/g, '$1 '),
  },
  { id: 'recipient', label: 'Отримувач', value: BANK_DETAILS.recipient, shown: BANK_DETAILS.recipient },
  { id: 'code', label: 'Код ЄДРПОУ', value: BANK_DETAILS.code, shown: BANK_DETAILS.code },
  {
    id: 'purpose',
    label: 'Призначення платежу',
    value: purpose.value,
    shown: purpose.value,
  },
])

/** Щойно скопійований рядок: галочка замість іконки на 1,5 с */
const copied = ref<string | null>(null)
let timer: ReturnType<typeof setTimeout> | undefined
onBeforeUnmount(() => clearTimeout(timer))

// Clipboard API є лише в захищеному контексті (https, localhost) — інакше старий шлях через виділення
async function writeText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
    document.body.append(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

async function copy(id: string, value: string) {
  if (!(await writeText(value))) return
  copied.value = id
  clearTimeout(timer)
  timer = setTimeout(() => (copied.value = null), 1500)
}

const formatSum = computed(() => formatPrice(cart.total.value))

const announce = computed(() => {
  const row = rows.value.find((r) => r.id === copied.value)
  return row ? `${row.label} скопійовано` : ''
})
</script>

<template>
  <section class="details" aria-labelledby="details-title">
    <h3 id="details-title" class="visually-hidden">Реквізити для оплати</h3>

    <!-- Десктоп: QR-код сканують телефоном -->
    <div v-if="wide" class="details__qr" :style="{ '--qr-quiet': `${quietPx}px` }">
      <div class="details__qr-text">
        <p class="body-m">Відскануйте камерою телефона</p>
        <p class="details__qr-hint body-s">
          Застосунок банку відкриє переказ із заповненими реквізитами й сумою&nbsp;{{ formatSum }}.
        </p>
      </div>
      <svg
        class="details__code"
        :viewBox="`${-QUIET} ${-QUIET} ${qr.size + QUIET * 2} ${qr.size + QUIET * 2}`"
        shape-rendering="crispEdges"
        role="img"
        aria-label="QR-код для оплати в застосунку банку"
      >
        <path :d="qr.d" fill="currentColor" />
      </svg>
    </div>

    <!-- Телефон: те саме посилання відкриває застосунок банку -->
    <a v-else class="details__app body-m" :href="link" target="_blank" rel="noopener">
      Відкрити в застосунку банку
      <SkIcon name="OpenExternal" :size="18" color="currentColor" />
    </a>
    <dl class="details__rows">
      <div v-for="row in rows" :key="row.id" class="details__row">
        <div class="details__text">
          <dt class="details__label body-s">{{ row.label }}</dt>
          <dd class="details__value body-m">{{ row.shown }}</dd>
        </div>
        <button
          class="details__copy"
          :class="{ 'is-copied': copied === row.id }"
          type="button"
          :aria-label="`Скопіювати: ${row.label}`"
          @click="copy(row.id, row.value)"
        >
          <Transition name="details-icon" mode="out-in">
            <SkIcon v-if="copied === row.id" key="done" name="Check" :size="18" color="var(--status-success-fg)" />
            <SkIcon v-else key="copy" name="Copy" :size="18" color="var(--fg-default)" />
          </Transition>
        </button>
      </div>
    </dl>
    <p class="visually-hidden" aria-live="polite">{{ announce }}</p>
  </section>
</template>

<style scoped>
/* Та сама картка, що й план розстрочки (.plan у CheckoutPayment): біла на сірій смузі */
.details {
  padding: 7px 7px 7px 19px;
  border: var(--border-width-hairline) solid var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--bg-canvas);
}

.details__rows {
  margin: 0;
}

/* Десктоп: пояснення ліворуч угорі, код праворуч; під ними — рядки реквізитів.
   Перший рядок тексту — на висоті верхнього краю модулів коду, а правий край модулів —
   на одній лінії з іконками копіювання (13px від краю картки: (44 − 18) / 2) */
.details__qr {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-2) calc(13px - var(--qr-quiet)) var(--space-3) var(--space-1);
  border-bottom: var(--border-width-hairline) solid var(--border-subtle);
}
.details__code {
  flex-shrink: 0;
  width: 152px;
  height: 152px;
  color: var(--fg-default);
  background: var(--neutral-0);
}
.details__qr-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  max-width: 220px;
  padding-top: var(--qr-quiet);
}
.details__qr-hint {
  color: var(--fg-muted);
}

/* Телефон: кнопка-посилання як Button Secondary, на всю ширину картки.
   Від верху картки — ті самі 19px, що й по боках (7 падінгу картки + 12) */
.details__app {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  height: 48px;
  margin: 12px 12px var(--space-2) 0;
  border: var(--border-width-hairline) solid var(--border-default);
  border-radius: var(--radius-full);
  background: var(--action-secondary-bg);
  color: var(--action-secondary-fg);
  text-decoration: none;
  transition: background-color 0.15s ease;
}
@media (hover: hover) and (pointer: fine) {
  .details__app:hover {
    background: var(--action-secondary-bg-hover);
  }
}
.details__app:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: 2px;
}

/* Рядки розділені тонкою лінією; кнопка копіювання — праворуч на висоті значення */
.details__row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) 0;
}
.details__row + .details__row {
  border-top: var(--border-width-hairline) solid var(--border-subtle);
}

.details__text {
  flex: 1;
  min-width: 0;
  padding-left: var(--space-1);
}

.details__label {
  color: var(--fg-muted);
}

.details__value {
  margin: 0;
  color: var(--fg-default);
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}

/* 18px іконка в зоні тапу 44px */
.details__copy {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: var(--control-tap-target-min);
  height: var(--control-tap-target-min);
  border-radius: var(--radius-full);
  transition: background-color 0.15s ease, transform 0.2s ease;
}
@media (hover: hover) and (pointer: fine) {
  .details__copy:hover {
    background: var(--bg-surface);
  }
}
.details__copy:active {
  transform: scale(0.9);
}
.details__copy:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: -4px;
}

/* Іконка стискається, галочка з'являється з легким перельотом — як «Додано» на картці товару */
.details-icon-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.details-icon-enter-active {
  transition: opacity 0.15s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.details-icon-enter-from,
.details-icon-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

@media (prefers-reduced-motion: reduce) {
  .details-icon-enter-active,
  .details-icon-leave-active {
    transition: none;
  }
}
</style>
