<script setup lang="ts">
// Figma «Введіть код з SMS» (node 125:5940): 4 code cells, resend countdown, back to change the number
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SkIcon from '@/components/SkIcon.vue'
import CheckoutTopBar from '@/components/checkout/CheckoutTopBar.vue'
import { takeKeyboard } from '@/composables/keyboardHandoff'
import { useWideCart } from '@/composables/useWideCart'
import { RESEND_SECONDS, formatPhoneDisplay, useCheckout } from '@/composables/useCheckout'
import { backTo } from '@/router'

const LENGTH = 4

const router = useRouter()
// Desktop: the screen sits in the middle of the page, as «Замовлення прийнято» before it
const wide = useWideCart()
const { profile, resetAfterOrder } = useCheckout()

/* ---------- Code ---------- */

// One real input under the cells: SMS AutoFill (one-time-code), paste and the numeric keyboard just work
const code = ref('')
const input = ref<HTMLInputElement | null>(null)
const focused = ref(false)
const cells = computed(() => Array.from({ length: LENGTH }, (_, i) => code.value[i] ?? ''))
const active = computed(() => (focused.value ? Math.min(code.value.length, LENGTH - 1) : -1))

function onInput(e: Event) {
  const el = e.target as HTMLInputElement
  code.value = el.value.replace(/\D/g, '').slice(0, LENGTH)
  nextTick(() => {
    if (el.value !== code.value) el.value = code.value
  })
  if (code.value.length === LENGTH) complete(el)
}

// Prototype: any code is accepted — hide the keyboard, let the last digit show, then back to the start
let doneTimer = 0
function complete(el: HTMLInputElement) {
  el.blur()
  doneTimer = window.setTimeout(() => {
    resetAfterOrder()
    router.push({ name: 'base' })
  }, 400)
}

// Keep the caret at the end, so the highlighted cell is always the one being typed
function toEnd() {
  const el = input.value
  if (el) requestAnimationFrame(() => el.setSelectionRange(el.value.length, el.value.length))
}

// The keyboard is already up from the «Отримати код» tap — keep it for this field
onMounted(() => takeKeyboard(input.value))

// Focused without a keyboard (e.g. after a reload): a tap on the cells must still bring it up —
// iOS ignores taps on an already focused field, so re-focus inside the gesture
function onCellsTap() {
  const el = input.value
  if (!el) return
  if (document.activeElement === el) el.blur()
  el.focus({ preventScroll: true })
  toEnd()
}

/* ---------- Resend countdown ---------- */

const now = ref(Date.now())
const timer = window.setInterval(() => (now.value = Date.now()), 250)
onBeforeUnmount(() => {
  clearInterval(timer)
  clearTimeout(doneTimer)
})

const secondsLeft = computed(() => Math.max(0, Math.ceil((profile.codeSentAt + RESEND_SECONDS * 1000 - now.value) / 1000)))
const countdown = computed(() => `${Math.floor(secondsLeft.value / 60)}:${String(secondsLeft.value % 60).padStart(2, '0')}`)

function resend() {
  profile.codeSentAt = Date.now()
  now.value = profile.codeSentAt
  code.value = ''
  input.value?.focus()
}

function changeNumber() {
  backTo({ name: 'checkout-profile' })
}
</script>

<template>
  <div class="page" :class="{ 'page--wide': wide }">
    <CheckoutTopBar :step="3" />

    <main class="code">
      <SkIcon name="PeopleCircleLarge" :size="48" />
      <h1 class="code__title heading-s">Введіть код з SMS</h1>
      <p class="code__text body-s">Надіслали на {{ formatPhoneDisplay(profile.phone) }}</p>
      <button type="button" class="code__change body-s" @click="changeNumber">Змінити номер</button>

      <div class="code__cells" @click="onCellsTap">
        <input
          ref="input"
          :value="code"
          class="code__input"
          type="text"
          inputmode="numeric"
          autocomplete="one-time-code"
          pattern="[0-9]*"
          :maxlength="LENGTH"
          aria-label="Код з SMS"
          @input="onInput"
          @focus="focused = true; toEnd()"
          @blur="focused = false"
        />
        <span
          v-for="(digit, i) in cells"
          :key="i"
          class="code__cell body-m"
          :class="{ 'is-active': i === active }"
          aria-hidden="true"
        >
          {{ digit }}
          <span v-if="i === active && !digit" class="code__caret" />
        </span>
      </div>

      <p v-if="secondsLeft" class="code__resend body-s" aria-live="polite">Надіслати ще раз через {{ countdown }}</p>
      <button v-else type="button" class="code__resend code__resend--action body-s" @click="resend">Надіслати ще раз</button>
    </main>
  </div>
</template>

<style scoped>
/* Figma: 96px higher than on «Підтвердіть номер» (the keyboard is up), title +16, number +8, «Змінити номер» +8,
   cells +36, resend +36 */
.code {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 22px var(--space-4) calc(env(safe-area-inset-bottom) + var(--space-8));
  text-align: center;
}

.code__title {
  margin-top: var(--space-4);
  color: var(--action-secondary-fg);
}

.code__text {
  max-width: 319px;
  margin-top: var(--space-2);
  color: var(--fg-muted);
}

/* Text link; padding widens the tap area without moving it */
.code__change {
  margin: calc(var(--space-2) - 6px) -8px -6px;
  padding: 6px 8px;
  color: var(--fg-default);
}

.code__cells {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 296px;
  max-width: 100%;
  margin-top: 36px;
}

/* Invisible but real: taps, paste and AutoFill land here */
.code__input {
  position: absolute;
  inset: 0;
  width: 100%;
  opacity: 0;
  border: 0;
  color: transparent;
  caret-color: transparent;
  font-size: 16px;
}

.code__cell {
  position: relative;
  display: grid;
  place-items: center;
  width: 63px;
  height: 48px;
  border: var(--border-width-hairline) solid var(--border-default);
  border-radius: var(--radius-full);
  background: var(--bg-canvas);
  color: var(--fg-default);
  pointer-events: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

/* Focus: 2px ring without layout shift, as in SkInput */
.code__cell.is-active {
  border-color: var(--border-focus);
  box-shadow: inset 0 0 0 1px var(--border-focus);
}

.code__caret {
  position: absolute;
  width: 1.5px;
  height: 22px;
  background: var(--fg-default);
  animation: caret 1s steps(1) infinite;
}

@keyframes caret {
  50% {
    opacity: 0;
  }
}

.code__resend {
  margin-top: 36px;
  color: var(--fg-muted);
  font-variant-numeric: tabular-nums;
}

.code__resend--action {
  margin-top: calc(36px - 6px);
  padding: 6px 8px;
  color: var(--fg-default);
}

/* ---------- Desktop: centred under the steps bar, like «Замовлення прийнято» ---------- */

/* Fills the screen under the steps bar (CheckoutLayout: its height + the 16px under its line) */
.page--wide {
  display: flex;
  flex-direction: column;
  min-height: calc(100svh - var(--checkout-header-h) - var(--checkout-steps-h, 0px) - var(--space-4));
}

/* No keyboard to make room for — in the middle, a bit higher than the exact middle */
.page--wide .code {
  flex: 1;
  justify-content: center;
  padding-block: var(--space-10) calc(var(--space-10) + 8vh);
}
</style>
