<script setup lang="ts">
// Figma 169:8280 — промокод: кнопка → поле з «Застосувати» (default · focus · error) → застосований код з «Видалити»
// Одна кнопка на всі стани: «+ Додати промокод» стискається праворуч у «Застосувати», а поле виростає з-під неї.
import { computed, nextTick, ref } from 'vue'
import SkButton from './SkButton.vue'
import SkIcon from './SkIcon.vue'
import SkInput from './SkInput.vue'
import { useCart } from '@/composables/useCart'
import { formatAmount } from '@/data/catalog'
import { spring } from '@/motion/spring'

const cart = useCart()

const editing = ref(false)
const value = ref('')
const error = ref('')
const input = ref<InstanceType<typeof SkInput> | null>(null)

const open = computed(() => editing.value || !!cart.promo.value)
const label = computed(() => (cart.promo.value ? 'Видалити' : open.value ? 'Застосувати' : '+ Додати промокод'))

// Critically damped: the button must not overshoot past the row's edges
const morph = spring({ stiffness: 260, damping: 32, mass: 1 })

// Some goods are already discounted — the code only covers the rest
const partialNote = computed(() => {
  const discounted = cart.lines.value.some((l) => l.kind !== 'sample' && l.oldPrice)
  if (!cart.promo.value || !discounted) return ''
  return `Промокод не діє на товари зі знижкою. Він застосується до решти позицій — ${formatAmount(cart.promoBase.value)}.`
})

async function start() {
  editing.value = true
  await nextTick()
  input.value?.focus()
}

function apply() {
  if (!value.value.trim()) return input.value?.focus()
  error.value = cart.applyPromo(value.value) ?? ''
  if (!error.value) value.value = ''
}

async function remove() {
  cart.removePromo()
  await start()
}

function onAction() {
  if (cart.promo.value) remove()
  else if (editing.value) apply()
  else start()
}

// Editing the code clears the previous error
function onInput() {
  error.value = ''
}
</script>

<template>
  <div class="promo">
    <div class="promo__row">
      <p v-if="cart.promo.value" class="promo__applied body-m" role="status">
        <SkIcon name="Check" :size="18" color="var(--status-success-fg)" />
        <span class="promo__applied-text">{{ cart.promo.value.code }}, {{ cart.promo.value.label }}</span>
      </p>

      <form v-else-if="editing" novalidate @submit.prevent="apply">
        <SkInput
          ref="input"
          v-model="value"
          class="promo__input"
          placeholder="Введіть промокод"
          autocomplete="off"
          autocapitalize="characters"
          spellcheck="false"
          aria-label="Промокод"
          :error="error"
          @input="onInput"
        />
      </form>

      <SkButton
        class="promo__action"
        :class="{ 'is-open': open }"
        :style="{ transition: `width ${morph.duration}ms ${morph.easing}, background-color 0.15s ease` }"
        variant="secondary"
        @click="onAction"
      >
        <Transition name="promo-label" mode="out-in">
          <span :key="label">{{ label }}</span>
        </Transition>
      </SkButton>
    </div>
    <p v-if="partialNote" class="promo__note body-s">{{ partialNote }}</p>
  </div>
</template>

<style scoped>
/* Field and button share one 48px row: the field fills it, the button lies on top of its right end
   (Figma: field 270, button 149, 57 overlap). Closed, the button covers the whole row. */
.promo__row {
  --promo-action-w: 149px;
  position: relative;
  min-height: 48px;
}

.promo__action {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 48px;
  padding-block: 0;
  padding-inline: 0;
  overflow: hidden;
}
.promo__action.is-open {
  width: var(--promo-action-w);
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
  margin-top: var(--space-2);
  padding-inline: var(--space-5);
  color: var(--fg-muted);
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
  .promo__action {
    transition: none !important;
  }
}
</style>
