<script setup lang="ts">
// Figma 169:8280 — промокод і сертифікати: кнопка → поле з «Застосувати» (default · focus · error) → застосовані коди з «Видалити».
// Промокод до замовлення лише один, сертифікатів — скільки завгодно. Кожен застосований код — свій рядок,
// поле для нового стає під ними, а кнопка додавання завжди лишається найнижче: «+ Додати сертифікат», коли промокод уже є.
// Figma 223:2931 — закритий блок як смуга на всю ширину з текстовою кнопкою (кошик і «Оплата»).
// Відкриваючись, смуга гасить свої лінії й градієнт, а кнопка лишається текстовою
import { computed, nextTick, ref } from 'vue'
import SkButton from './SkButton.vue'
import SkIcon from './SkIcon.vue'
import SkInput from './SkInput.vue'
import { useCart } from '@/composables/useCart'
import { formatAmount } from '@/data/catalog'

const cart = useCart()

const editing = ref(false)
const value = ref('')
const error = ref('')
const input = ref<InstanceType<typeof SkInput> | null>(null)

/** Застосовані коди по черзі: спершу промокод, далі сертифікати */
const applied = computed(() => [
  ...(cart.promo.value
    ? [{ kind: 'promo' as const, code: cart.promo.value.code, text: `${cart.promo.value.code} · ${cart.promo.value.label}` }]
    : []),
  ...cart.certificates.value.map((c) => ({
    kind: 'certificate' as const,
    code: c.code,
    text: `${c.code} · ${formatAmount(c.amount)}`,
  })),
])

const open = computed(() => editing.value || applied.value.length > 0)
const addLabel = computed(() => (cart.promo.value ? '+ Додати сертифікат' : '+ Додати промокод або сертифікат'))
// Коротко: поле ділить рядок із «Застосувати». Що саме вводити, вже сказала кнопка
const placeholder = computed(() => (cart.promo.value ? 'Номер сертифіката' : 'Введіть код'))
const fieldLabel = computed(() => (cart.promo.value ? 'Сертифікат' : 'Промокод або сертифікат'))

// Some goods are already discounted — the code only covers the rest
const partialNote = computed(() => {
  const discounted = cart.lines.value.some((l) => l.kind !== 'sample' && l.oldPrice)
  if (!cart.promo.value || !discounted) return ''
  return `Промокод не діє на товари зі знижкою. Він застосується до решти позицій — ${formatAmount(cart.promoBase.value)}.`
})

// Поле вже відкрите — кнопка лише повертає в нього
async function start() {
  editing.value = true
  await nextTick()
  input.value?.focus()
}

function apply() {
  if (!value.value.trim()) return input.value?.focus()
  error.value = cart.applyCode(value.value) ?? ''
  if (error.value) return
  // Код став рядком над кнопкою — поле ховається до наступного «+ Додати»
  value.value = ''
  editing.value = false
}

function remove(item: (typeof applied.value)[number]) {
  if (item.kind === 'promo') cart.removePromo()
  else cart.removeCertificate(item.code)
}

// Editing the code clears the previous error
function onInput() {
  error.value = ''
}
</script>

<template>
  <div class="promo" :class="{ 'is-open': open }">
    <TransitionGroup tag="ul" name="promo-item" class="promo__list">
      <li v-for="item in applied" :key="item.code" class="promo__row promo__row--applied">
        <p class="promo__applied body-m" role="status">
          <SkIcon name="Check" :size="18" color="var(--status-success-fg)" />
          <span class="promo__applied-text">{{ item.text }}</span>
        </p>
        <SkButton
          class="promo__action"
          variant="secondary"
          :aria-label="`Видалити ${item.kind === 'promo' ? 'промокод' : 'сертифікат'} ${item.code}`"
          @click="remove(item)"
        >
          Видалити
        </SkButton>
      </li>
    </TransitionGroup>

    <Transition name="promo-item">
      <form v-if="editing" class="promo__row" novalidate @submit.prevent="apply">
        <SkInput
          ref="input"
          v-model="value"
          class="promo__input"
          :placeholder="placeholder"
          autocomplete="off"
          autocapitalize="characters"
          spellcheck="false"
          :aria-label="fieldLabel"
          :error="error"
          @input="onInput"
        />
        <SkButton class="promo__action" variant="secondary" type="submit">Застосувати</SkButton>
      </form>
    </Transition>

    <SkButton class="promo__add" variant="secondary" block @click="start">
      <Transition name="promo-label" mode="out-in">
        <span :key="addLabel">{{ addLabel }}</span>
      </Transition>
    </SkButton>

    <p v-if="partialNote" class="promo__note body-s">{{ partialNote }}</p>
  </div>
</template>

<style scoped>
/* Рядки (застосовані коди, поле) один під одним, кнопка додавання — найнижче */
.promo__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.promo__list:empty {
  display: none;
}

/* Field and button share one 48px row: the field fills it, the button lies on top of its right end
   (Figma: field 270, button 149, 57 overlap) */
.promo__row {
  --promo-action-w: 149px;
  position: relative;
  min-height: 48px;
}

.promo__action {
  position: absolute;
  top: 0;
  right: 0;
  width: var(--promo-action-w);
  height: 48px;
  padding-block: 0;
  padding-inline: 0;
}

/* Застосований код: «Видалити» коротше за «Застосувати» — більше місця під сам код */
.promo__row--applied {
  --promo-action-w: 112px;
}

/* «+ Додати…» — текстова кнопка на смузі: без заливки й обводки, і тоді, коли над нею вже є рядки */
.promo__add {
  height: 48px;
  padding-block: 0;
  background: transparent;
  border-color: transparent;
}

/* Keep the typed code clear of the button */
.promo__input :deep(.sk-input__field) {
  padding-right: calc(var(--promo-action-w) + var(--space-1));
}
.promo__input :deep(.sk-input__error) {
  padding-right: var(--space-5);
}

/* Error: the typed code turns red too */
.promo__input.has-error :deep(.sk-input__control) {
  color: var(--status-danger-fg);
}

/* Applied: same pill as the field, green check + code */
.promo__applied {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  height: 48px;
  margin: 0;
  padding: 0 calc(var(--promo-action-w) + var(--space-1)) 0 var(--space-5);
  border: var(--border-width-hairline) solid var(--border-default);
  border-radius: var(--radius-full);
  color: var(--status-success-fg);
  font-size: var(--font-size-sm);
}

.promo__applied-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.promo__note {
  margin: 0;
  padding-inline: var(--space-5);
  color: var(--fg-muted);
}

/* ---------- Strip (Figma 223:2931) ---------- */

/* 60px strip: the 48px row sits 6px from its hairlines. The parent bleeds it to the screen edges
   and sets --promo-inset to line the row up with its own content */
.promo {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: 6px var(--promo-inset, var(--space-4));
}

/* Hairlines and the neutral/100 glow (70%) share one radial fade from the centre — the lines
   thin out to nothing towards the edges, like the fill */
.promo::before {
  --glow: circle 214.5px at 50% 50%;
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(var(--glow), var(--border-strong), transparent) top / 100% var(--border-width-hairline) no-repeat,
    radial-gradient(var(--glow), var(--border-strong), transparent) bottom / 100% var(--border-width-hairline) no-repeat,
    radial-gradient(var(--glow), color-mix(in oklch, var(--neutral-100) 70%, transparent), transparent);
  pointer-events: none;
  transition: opacity 0.25s ease;
}
.promo.is-open::before {
  opacity: 0;
}

/* Новий рядок проявляється й трохи з'їжджає згори, знятий — гасне */
.promo-item-enter-active,
.promo-item-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.promo-item-enter-from,
.promo-item-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Label swap while the button morphs */
.promo-label-enter-active,
.promo-label-leave-active {
  transition: opacity 0.12s ease;
}
.promo-label-enter-from,
.promo-label-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .promo-item-enter-active,
  .promo-item-leave-active,
  .promo::before {
    transition: none !important;
  }
}
</style>
