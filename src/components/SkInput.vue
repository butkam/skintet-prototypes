<script setup lang="ts">
// Figma "Input" (node 107:739), Type = Single: pill radius/full, 48h, padding space/5, Body/M.
// States: Default · Hover (border/strong) · Focus (border/focus 2px) · Error (status/danger 2px + message).
import { computed, nextTick, ref, useAttrs } from 'vue'

// Extra attrs/listeners (role, aria-*, @focus, @keydown…) go to the <input>; class/style stay on the root
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

defineProps<{
  placeholder?: string
  type?: string
  inputmode?: 'text' | 'tel' | 'email' | 'numeric' | 'search'
  autocomplete?: string
  error?: string
  name?: string
}>()

const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ input: [value: string] }>()

const input = ref<HTMLInputElement | null>(null)
defineExpose({ focus: () => input.value?.focus() })

function onInput(e: Event) {
  const el = e.target as HTMLInputElement
  model.value = el.value
  emit('input', el.value)
  // A parent may reformat the value (phone mask) back to what it already was — Vue then
  // skips the re-render and the raw text would stay in the field
  nextTick(() => {
    if (el.value !== model.value) el.value = model.value
  })
}

// iOS AutoFill may write other fields with only a `change` event — don't lose those values
function onChange(e: Event) {
  if ((e.target as HTMLInputElement).value !== model.value) onInput(e)
}
</script>

<template>
  <div v-bind="rootAttrs" class="sk-input" :class="{ 'has-error': error }">
    <label class="sk-input__field">
      <input
        ref="input"
        v-bind="inputAttrs"
        class="sk-input__control body-m"
        :type="type ?? 'text'"
        :name="name"
        :value="model"
        :placeholder="placeholder"
        :inputmode="inputmode"
        :autocomplete="autocomplete"
        :aria-invalid="!!error || undefined"
        @input="onInput"
        @change="onChange"
      />
      <slot name="trailing" />
    </label>
    <Transition name="sk-input-error">
      <p v-if="error" class="sk-input__error body-s" role="alert">{{ error }}</p>
    </Transition>
  </div>
</template>

<style scoped>
.sk-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 0;
}

.sk-input__field {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  height: 48px;
  padding: 0 var(--space-5);
  border: var(--border-width-hairline) solid var(--border-default);
  border-radius: var(--radius-full);
  background: var(--bg-canvas);
  /* 2px focus/error ring without layout shift: 1px border + 1px inset shadow */
  box-shadow: inset 0 0 0 0 transparent;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  cursor: text;
}

@media (hover: hover) and (pointer: fine) {
  .sk-input__field:hover {
    border-color: var(--border-strong);
  }
}

.sk-input__field:focus-within {
  border-color: var(--border-focus);
  box-shadow: inset 0 0 0 1px var(--border-focus);
}

.has-error .sk-input__field {
  border-color: var(--status-danger-border);
  box-shadow: inset 0 0 0 1px var(--status-danger-border);
}

.sk-input__control {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--fg-default);
  /* 14px per design; iOS focus auto-zoom is disabled via maximum-scale in index.html */
  font-size: var(--font-size-sm);
}

.sk-input__control::placeholder {
  color: var(--fg-muted);
  opacity: 1;
}

.sk-input__error {
  padding-left: var(--space-5);
  color: var(--status-danger-fg);
}

.sk-input-error-enter-active,
.sk-input-error-leave-active {
  transition: opacity 0.15s ease, transform 0.2s ease;
}
.sk-input-error-enter-from,
.sk-input-error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
