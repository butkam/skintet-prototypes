<script setup lang="ts">
// Figma "Button" (node 48:869): Type Primary/Secondary/Icon × State Default/Hover/Disabled/Focus
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'icon'
    disabled?: boolean
    type?: 'button' | 'submit'
    block?: boolean
  }>(),
  { variant: 'primary', disabled: false, type: 'button', block: false },
)

// `amount` — сума праворуч від назви дії, відділена не мідлдотом, а тонкою неконтрастною рискою
defineSlots<{ default?: () => unknown; amount?: () => unknown }>()
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="sk-button body-l"
    :class="[`sk-button--${variant}`, { 'sk-button--block': block }]"
  >
    <slot />
    <template v-if="$slots.amount">
      <span class="sk-button__rule" aria-hidden="true" />
      <slot name="amount" />
    </template>
  </button>
</template>

<style scoped>
.sk-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-10);
  border-radius: var(--radius-full);
  border: var(--border-width-hairline) solid transparent;
  white-space: nowrap;
  transition: background-color 0.15s ease;
}

/* Трохи нижча за рядок тексту, майже зливається з фоном кнопки.
   margin додається до gap кнопки — разом 16px повітря з кожного боку */
.sk-button__rule {
  flex: none;
  width: 1px;
  height: 0.875em;
  margin-inline: var(--space-2);
  border-radius: 1px;
  background: currentColor;
  opacity: 0.3;
}

.sk-button--block {
  display: flex;
  width: 100%;
}

/* Focus = offset ring, 4px gap, no layout shift */
.sk-button:focus-visible {
  outline: var(--border-width-focus) solid var(--border-focus);
  outline-offset: 4px;
}

.sk-button--primary {
  background: var(--action-primary-bg);
  color: var(--action-primary-fg);
}
/* Hover only on devices that really hover: on iOS a tap leaves :hover "stuck" on whatever
   ends up under the finger — e.g. «Замовити» after «До кошика» opens the cart in the same spot */
@media (hover: hover) and (pointer: fine) {
  .sk-button--primary:hover:not(:disabled) {
    background: var(--action-primary-bg-hover);
  }
  .sk-button--secondary:hover:not(:disabled),
  .sk-button--icon:hover:not(:disabled) {
    background: var(--action-secondary-bg-hover);
  }
}
.sk-button--primary:active:not(:disabled) {
  background: var(--action-primary-bg-active);
}
.sk-button--primary:disabled {
  background: var(--action-primary-bg-disabled);
  color: var(--action-primary-fg-disabled);
  cursor: not-allowed;
}

/* Secondary & Icon — resolved from Figma variants: white fill, border/default stroke */
.sk-button--secondary,
.sk-button--icon {
  background: var(--action-secondary-bg);
  color: var(--action-secondary-fg);
  border-color: var(--border-default);
}
.sk-button--secondary:disabled,
.sk-button--icon:disabled {
  color: var(--neutral-600);
  cursor: not-allowed;
}

.sk-button--icon {
  padding: var(--space-3);
}
</style>
