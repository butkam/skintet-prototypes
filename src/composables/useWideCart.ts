import { readonly, ref } from 'vue'

/**
 * Широкий екран: кошик — двоколонковий дровер справа поверх затемнення
 * (ліворуч подарунки, рекомендовані й промокод, праворуч товари й оформлення).
 * Вужче — мобільна колонка, як у макеті. Одна точка правди для розмітки й поведінки.
 */
const query = window.matchMedia('(min-width: 960px)')
const wide = ref(query.matches)
query.addEventListener('change', (e) => (wide.value = e.matches))

export const useWideCart = () => readonly(wide)
