<script setup lang="ts">
// Справжня кнопка гаманця на місці «Оплатити», коли обрано «Онлайн карткою».
// Кнопки малюють Safari (Apple Pay) і pay.js (Google Pay) — перефарбовувати їх не можна.
// Прототип: платіжний лист не відкривається (для нього потрібен мерчант) — тап одразу оформлює замовлення.
import { onMounted, ref } from 'vue'
import { loadGooglePay, type Wallet } from '@/composables/wallet'

// `disabled` — ще рано платити (на кроці доставки — поки не вказано адресу): кнопка бліда й не реагує.
// `tone` — системний колір кнопки: чорна — головна дія («Оплата»), біла з обводкою — другорядна
// поруч із чорною кнопкою (крок доставки під «Перейти до оплати»)
const props = withDefaults(defineProps<{ wallet: Wallet; disabled?: boolean; tone?: 'black' | 'white' }>(), {
  tone: 'black',
})
const emit = defineEmits<{ pay: [] }>()

const host = ref<HTMLElement | null>(null)

onMounted(() => {
  if (props.wallet !== 'google') return
  loadGooglePay()
    .then((client) =>
      host.value?.replaceChildren(
        client.createButton({
          onClick: () => !props.disabled && emit('pay'),
          buttonColor: props.tone,
          buttonType: 'pay',
          buttonLocale: 'uk',
          buttonSizeMode: 'fill',
          buttonRadius: 25,
        }),
      ),
    )
    // Not loaded — the parent falls back to the regular «Оплатити»
    .catch(() => {})
})
</script>

<template>
  <button
    v-if="wallet === 'apple'"
    type="button"
    class="wallet wallet--apple"
    :class="{ 'is-disabled': disabled, 'wallet--white': tone === 'white' }"
    aria-label="Купити через Apple Pay"
    :disabled="disabled"
    @click="emit('pay')"
  />
  <div v-else ref="host" class="wallet wallet--google" :class="{ 'is-disabled': disabled }" :aria-disabled="disabled || undefined" />
</template>

<style scoped>
/* Same height and shape as SkButton, so nothing around it moves when the button swaps */
.wallet {
  --wallet-height: calc(var(--space-3) * 2 + var(--font-line-height-md) + var(--border-width-hairline) * 2);
  display: block;
  width: 100%;
  height: var(--wallet-height);
  border-radius: var(--radius-full);
}

/* Safari малює Apple Pay на 1px коротшою згори й знизу (заміряно на iPhone: 48 замість 50).
   Додаємо ці 2px і забираємо їх відступами — видима висота й проміжки як у SkButton */
.wallet--apple {
  -webkit-appearance: -apple-pay-button;
  -apple-pay-button-type: buy;
  -apple-pay-button-style: black;
  height: calc(var(--wallet-height) + 2px);
  margin-block: -1px;
}
/* Білу Safari малює з тонкою обводкою — на білому тлі без неї кнопка б зникла */
.wallet--apple.wallet--white {
  -apple-pay-button-style: white-outline;
}

.wallet:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: 4px;
}

/* Кнопки малює система, тож вимкнену лише бліднимо */
.wallet {
  transition: opacity 0.2s ease;
}
.wallet.is-disabled {
  opacity: 0.3;
  pointer-events: none;
}

/* pay.js' own wrapper — stretch it to the host */
.wallet--google :deep(> div) {
  height: 100%;
}
</style>
