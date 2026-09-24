<script setup lang="ts">
// Figma «Декілька платежів» (112:1613) — Segmented Control 204:1457: обидва банки видно одразу,
// вибір в один тап. Логотип 20 (radius/full) + коротка назва.
import SkSegmented from './SkSegmented.vue'
import { BANKS, type Bank } from '@/composables/useCheckout'
import monobankLogo from '@/assets/images/bank-monobank.svg'
import privatbankLogo from '@/assets/images/bank-privatbank.jpg'

const model = defineModel<Bank>({ required: true })

const options = BANKS.map((b) => b.id)
const logos: Record<Bank, string> = { monobank: monobankLogo, privatbank: privatbankLogo }
const shortNames = Object.fromEntries(BANKS.map((b) => [b.id, b.short])) as Record<Bank, string>
</script>

<template>
  <SkSegmented v-model="model" class="banks" :options="options" label="Банк для оплати частинами">
    <template #default="{ option, active }">
      <span class="banks__logo" :class="{ 'is-dimmed': !active }">
        <img :src="logos[option]" alt="" />
      </span>
      {{ shortNames[option] }}
    </template>
  </SkSegmented>
</template>

<style scoped>
.banks :deep(.sk-segmented__item) {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  white-space: nowrap;
}

.banks__logo {
  display: grid;
  place-items: center;
  width: var(--icon-sm);
  height: var(--icon-sm);
  /* Round: the monobank mark comes as a circle */
  border-radius: var(--radius-full);
  overflow: hidden;
}

.banks__logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* The unselected mark fades along with its muted label */
.banks__logo.is-dimmed {
  opacity: 0.45;
  transition: opacity 0.2s ease;
}
</style>
