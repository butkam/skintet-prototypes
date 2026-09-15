<script setup lang="ts">
import { computed } from 'vue'
import shoppingBag from '@/assets/icons/shopping-bag.svg'
import shoppingBagLarge from '@/assets/icons/shopping-bag-large.svg'
import barsThree from '@/assets/icons/bars-three.svg'
import crossLarge from '@/assets/icons/cross-large.svg'
import gift from '@/assets/icons/gift.svg'
import giftSmall from '@/assets/icons/gift-small.svg'
import giftSmallDark from '@/assets/icons/gift-small-dark.svg'
import fastShipping from '@/assets/icons/fast-shipping.svg'
import plusCircle from '@/assets/icons/plus-circle.svg'
import plusMedium from '@/assets/icons/plus-medium.svg'
import plusMediumDisabled from '@/assets/icons/plus-medium-disabled.svg'
import minusMedium from '@/assets/icons/minus-medium.svg'
import trashCan from '@/assets/icons/trash-can.svg'
import trashCanDisabled from '@/assets/icons/trash-can-disabled.svg'
import chevronDownSmall from '@/assets/icons/chevron-down-small.svg'
import check from '@/assets/icons/check.svg'
import checkboxChecked from '@/assets/icons/checkbox-checked.svg'
import peopleCircle from '@/assets/icons/people-circle.svg'
import magnifyingGlass from '@/assets/icons/magnifying-glass.svg'
import shipping from '@/assets/icons/shipping.svg'
import caretDownXs from '@/assets/icons/caret-down-xs.svg'
import radioSelected from '@/assets/icons/radio-selected.svg'
import chevronDownDropdown from '@/assets/icons/chevron-down-dropdown.svg'

// Glyphs exported from Figma (Icon component 62:1641 and screen-level icons)
const glyphs = {
  ShoppingBag: shoppingBag,
  /** 48px, 2px stroke — empty states */
  ShoppingBagLarge: shoppingBagLarge,
  BarsThree: barsThree,
  CrossLarge: crossLarge,
  Gift: gift,
  /** 16px, neutral-300 stroke — progress scale */
  GiftSmall: giftSmall,
  /** 16px, dark stroke — gift pill */
  GiftSmallDark: giftSmallDark,
  /** 16px, neutral-300 stroke — progress scale */
  FastShipping: fastShipping,
  /** 30px outlined circle with plus */
  PlusCircle: plusCircle,
  PlusMedium: plusMedium,
  PlusMediumDisabled: plusMediumDisabled,
  MinusMedium: minusMedium,
  TrashCan: trashCan,
  TrashCanDisabled: trashCanDisabled,
  ChevronDownSmall: chevronDownSmall,
  /** 18px hand-drawn check — achieved milestone */
  Check: check,
  /** 18px filled checkbox, checked state (Checkbox 51:1255) */
  CheckboxChecked: checkboxChecked,
  PeopleCircle: peopleCircle,
  MagnifyingGlass: magnifyingGlass,
  Shipping: shipping,
  /** 12px filled triangle — «Розгорнути» */
  CaretDownXs: caretDownXs,
  /** 18px radio, selected state (Radio 112:1076) */
  RadioSelected: radioSelected,
  /** 16px filled triangle — dropdown */
  ChevronDownDropdown: chevronDownDropdown,
} as const

export type IconName = keyof typeof glyphs

const props = withDefaults(defineProps<{ name?: IconName; size?: number; color?: string }>(), {
  name: 'ShoppingBag',
  size: 24,
  color: undefined,
})

const src = computed(() => glyphs[props.name])

// `color` recolours the exported glyph via CSS mask (Figma: "override instance layer colour")
const style = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  ...(props.color && {
    backgroundColor: props.color,
    maskImage: `url("${src.value}")`,
    WebkitMaskImage: `url("${src.value}")`,
  }),
}))
</script>

<template>
  <span class="sk-icon" :class="{ 'sk-icon--tinted': color }" :style="style" aria-hidden="true">
    <img v-if="!color" :src="src" alt="" />
  </span>
</template>

<style scoped>
.sk-icon {
  display: inline-block;
  flex-shrink: 0;
  overflow: hidden;
}

.sk-icon img {
  width: 100%;
  height: 100%;
}

.sk-icon--tinted {
  mask-size: 100% 100%;
  -webkit-mask-size: 100% 100%;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  transition: background-color 0.3s ease;
}
</style>
