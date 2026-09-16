import { onBeforeUnmount, onMounted } from 'vue'

/**
 * iOS Safari and the on-screen keyboard:
 * - focusing a field scrolls it just under the top of the visual viewport — behind our sticky
 *   bars (header, checkout steps, gifts scale), which iOS doesn't account for;
 * - after the keyboard hides, the page can stay pushed up past its real end.
 * Sticky bars that cover content are marked with `data-sticky-top`.
 */

// The keyboard hand-off proxy (keyboardHandoff.ts) is invisible — nothing to reveal
const FIELD = 'input:not([type="checkbox"]):not([type="radio"]):not([data-keyboard-proxy]), textarea, select'
/** Breathing room between a field and whatever covers it */
const GAP = 16

const isField = (el: Element | null): el is HTMLElement => !!el && el.matches(FIELD)

/** Bottom edge (layout-viewport coords) of the sticky bars currently stuck at the top */
function stickyBottom() {
  let bottom = 0
  for (const el of document.querySelectorAll<HTMLElement>('[data-sticky-top]')) {
    const rect = el.getBoundingClientRect()
    if (rect.height && rect.top < window.innerHeight / 2) bottom = Math.max(bottom, rect.bottom)
  }
  return bottom
}

/** How far to scroll so the field (with its error message) sits between the bars and the keyboard */
function offsetFor(field: HTMLElement) {
  const target = field.closest<HTMLElement>('.sk-input') ?? field
  const rect = target.getBoundingClientRect()
  const vv = window.visualViewport
  const viewTop = vv?.offsetTop ?? 0
  const viewBottom = viewTop + (vv?.height ?? window.innerHeight)
  const top = Math.max(viewTop, stickyBottom()) + GAP
  const bottom = viewBottom - GAP

  if (rect.top < top) return rect.top - top
  if (rect.bottom > bottom) return Math.min(rect.bottom - bottom, rect.top - top)
  return 0
}

/** Scroll to `top`, clamped to the page — iOS may leave it pushed past the end after the keyboard */
function scrollToClamped(top: number, behavior: ScrollBehavior) {
  const max = document.documentElement.scrollHeight - window.innerHeight
  const target = Math.max(0, Math.min(top, max))
  if (Math.abs(target - window.scrollY) > 1) window.scrollTo({ top: target, behavior })
}

export function useKeyboardAvoid() {
  const timers: number[] = []
  const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms))
  const cancel = () => timers.splice(0).forEach(clearTimeout)
  /** Last focused field — kept after blur, so it can be re-checked once the keyboard is gone */
  let lastField: HTMLElement | null = null

  // iOS keeps scrolling on its own while the keyboard slides in and can cancel a smooth scroll —
  // so a smooth pass first, then an instant correction once everything has settled
  const reveal = () => {
    cancel()
    const pass = (behavior: ScrollBehavior) => () => {
      const field = document.activeElement
      if (!isField(field)) return
      const delta = offsetFor(field)
      if (Math.abs(delta) > 1) scrollToClamped(window.scrollY + delta, behavior)
    }
    later(pass('smooth'), 350)
    later(pass('instant'), 900)
  }

  // Keyboard gone: pull the page back within its end and keep the last field out from under the bars
  const settle = () => {
    cancel()
    const startY = window.scrollY
    later(() => {
      if (isField(document.activeElement)) return
      // The page is already moving (e.g. validation scrolling to an error) — don't fight it
      const moved = Math.abs(window.scrollY - startY) > 2
      const delta = lastField?.isConnected && !moved ? Math.min(0, offsetFor(lastField)) : 0
      scrollToClamped(window.scrollY + delta, 'instant')
    }, 250)
  }

  const onFocusIn = (e: FocusEvent) => {
    if (!isField(e.target as Element)) return
    lastField = e.target as HTMLElement
    reveal()
  }

  /** When a field last lost focus — the keyboard is still sliding away for a moment after that */
  let blurredAt = -Infinity
  const KEYBOARD_HIDE_MS = 1000

  // Focus moving to another field fires focusin right after — that one wins
  const onFocusOut = (e: FocusEvent) => {
    if (!isField(e.target as Element)) return
    blurredAt = performance.now()
    settle()
  }

  // Keyboard opening/closing resizes the visual viewport. So does Safari collapsing its toolbars
  // on scroll — reacting to that scrolled the page mid-gesture (jitter on short pages like «Оплата»),
  // so only resizes around a field's focus count.
  let lastHeight = window.visualViewport?.height ?? window.innerHeight
  const onViewportResize = () => {
    const height = window.visualViewport!.height
    const grew = height > lastHeight
    lastHeight = height
    const keyboard = isField(document.activeElement) || performance.now() - blurredAt < KEYBOARD_HIDE_MS
    if (!keyboard) return
    if (grew) settle()
    else reveal()
  }

  onMounted(() => {
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    window.visualViewport?.addEventListener('resize', onViewportResize)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('focusin', onFocusIn)
    document.removeEventListener('focusout', onFocusOut)
    window.visualViewport?.removeEventListener('resize', onViewportResize)
    cancel()
  })
}
