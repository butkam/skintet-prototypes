/**
 * Докрутити на `top` px те, що гортає вміст навколо `el`: найближчий предок, що прокручується сам
 * (шторка кошика на широкому екрані), або документ (телефон). Миттєво — це компенсація зсуву,
 * а не рух, який має побачити людина.
 */
export function scrollShift(el: Element, top: number) {
  for (let node = el.parentElement; node; node = node.parentElement) {
    const overflow = getComputedStyle(node).overflowY
    if ((overflow === 'auto' || overflow === 'scroll') && node.scrollHeight > node.clientHeight) {
      node.scrollBy({ top, behavior: 'instant' })
      return
    }
  }
  window.scrollBy({ top, behavior: 'instant' })
}
