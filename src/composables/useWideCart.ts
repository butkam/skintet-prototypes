import { computed, readonly, ref } from 'vue'
import { prototypeSlug } from '@/variant'

/**
 * Широкий екран: кошик — двоколонковий дровер справа поверх затемнення
 * (ліворуч подарунки, рекомендовані й промокод, праворуч товари й оформлення).
 * Вужче — мобільна колонка, як у макеті. Одна точка правди для розмітки й поведінки.
 */
const query = window.matchMedia('(min-width: 960px)')
const wide = ref(query.matches)
query.addEventListener('change', (e) => (wide.value = e.matches))

export const useWideCart = () => readonly(wide)

/**
 * Розкладка кошика у дві колонки. Прототип «6 жовтня» і на широкому екрані тримає одну колонку,
 * як на телефоні, — лише в шторці справа (CartDrawer → drawer-root--panel)
 */
const twoColumns = computed(() => wide.value && prototypeSlug !== '2026-10-06')

export const useTwoColumnCart = () => twoColumns
