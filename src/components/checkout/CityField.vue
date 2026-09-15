<script setup lang="ts">
// «Місто» for Nova Poshta: combobox with suggestions only from the Ukrainian cities list (see data/cities)
import { computed, ref, useId } from 'vue'
import SkInput from '@/components/SkInput.vue'
import { findCity, searchCities, type City } from '@/data/cities'

defineProps<{ error?: string }>()
const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ input: [] }>()

const field = ref<InstanceType<typeof SkInput> | null>(null)
defineExpose({ focus: () => field.value?.focus() })

const listId = useId()
const open = ref(false)
const active = ref(-1)

const suggestions = computed(() => searchCities(model.value))
// Nothing left to suggest once the field holds exactly the only match
const expanded = computed(
  () => open.value && !(suggestions.value.length === 1 && suggestions.value[0].name === model.value),
)
const activeId = computed(() => (expanded.value && active.value >= 0 ? `${listId}-${active.value}` : undefined))

function onInput() {
  open.value = true
  active.value = model.value.trim() ? 0 : -1
  emit('input')
}

function onBlur() {
  open.value = false
  // Typed a full name (or an old one, e.g. «Кіровоград») — snap to the canonical spelling
  const city = findCity(model.value)
  if (city && city.name !== model.value) {
    model.value = city.name
    emit('input')
  }
}

function choose(city: City) {
  model.value = city.name
  open.value = false
  active.value = -1
  emit('input')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    open.value = false
    return
  }
  if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) return
  if (!expanded.value) {
    if (e.key !== 'Enter') open.value = true
    return
  }
  const n = suggestions.value.length
  if (!n) return
  e.preventDefault()
  if (e.key === 'ArrowDown') active.value = (active.value + 1) % n
  else if (e.key === 'ArrowUp') active.value = (active.value - 1 + n) % n
  else if (active.value >= 0) choose(suggestions.value[active.value])
}
</script>

<template>
  <div class="city">
    <SkInput
      ref="field"
      v-model="model"
      placeholder="Місто"
      autocomplete="off"
      :error="error"
      role="combobox"
      aria-autocomplete="list"
      :aria-expanded="expanded"
      :aria-controls="listId"
      :aria-activedescendant="activeId"
      autocapitalize="words"
      spellcheck="false"
      @input="onInput"
      @focus="open = true"
      @click="open = true"
      @blur="onBlur"
      @keydown="onKeydown"
    />

    <Transition name="city-list">
      <ul v-if="expanded" :id="listId" class="city__list" role="listbox" aria-label="Міста України">
        <li
          v-for="(c, i) in suggestions"
          :id="`${listId}-${i}`"
          :key="c.name"
          class="city__option"
          :class="{ 'is-active': i === active }"
          role="option"
          :aria-selected="i === active"
          @pointerdown.prevent
          @pointermove="active = i"
          @click="choose(c)"
        >
          <span class="body-m">{{ c.name }}</span>
          <span v-if="c.region" class="city__region body-s">{{ c.region }}</span>
        </li>
        <li v-if="!suggestions.length" class="city__empty body-s" role="presentation">
          Не знайшли такого міста в Україні
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.city {
  position: relative;
}

/* Floats over the content below, 4px under the 48px field */
.city__list {
  position: absolute;
  top: calc(48px + var(--space-1));
  left: 0;
  right: 0;
  z-index: 10;
  margin: 0;
  padding: var(--space-1);
  list-style: none;
  border: var(--border-width-hairline) solid var(--border-subtle);
  border-radius: var(--radius-lg);
  background: var(--bg-canvas);
  box-shadow: var(--elevation-m);
}

/* Text lines up with the input's 20px inset (4px list + 16px option) */
.city__option {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-full);
  color: var(--fg-default);
  cursor: pointer;
}

.city__option.is-active {
  background: var(--bg-surface);
}

.city__region {
  flex-shrink: 0;
  color: var(--fg-muted);
}

.city__empty {
  padding: var(--space-3) var(--space-4);
  color: var(--fg-muted);
}

.city-list-enter-active {
  transition: opacity 0.15s ease, transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.city-list-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
.city-list-leave-active {
  transition: opacity 0.1s ease;
}
.city-list-leave-to {
  opacity: 0;
}
</style>
