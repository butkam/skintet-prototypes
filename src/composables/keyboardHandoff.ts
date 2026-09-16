/**
 * iOS Safari opens the keyboard only for a focus() made inside a user gesture. A field on the next
 * screen mounts later, so its focus() alone highlights it without a keyboard.
 * Hand-off: during the tap focus an invisible proxy field (keyboard slides up), then move focus
 * to the real field once it exists — focus passing between fields keeps the keyboard open.
 */

let proxy: HTMLInputElement | null = null
let cleanup = 0

/** Call synchronously in the tap/submit handler that navigates to a screen with a field to focus */
export function holdKeyboard(inputmode: 'numeric' | 'text' = 'text') {
  proxy ??= Object.assign(document.createElement('input'), { type: 'text', tabIndex: -1 })
  proxy.setAttribute('inputmode', inputmode)
  proxy.setAttribute('aria-hidden', 'true')
  proxy.dataset.keyboardProxy = ''
  // In view (iOS won't scroll to it) but invisible; 16px, so iOS doesn't zoom
  Object.assign(proxy.style, { position: 'fixed', top: '0', left: '0', width: '1px', height: '1px', opacity: '0', fontSize: '16px', border: '0', padding: '0' })
  document.body.appendChild(proxy)
  proxy.focus({ preventScroll: true })
  // Nothing took over (navigation cancelled) — don't leave the keyboard up for an invisible field
  clearTimeout(cleanup)
  cleanup = window.setTimeout(() => {
    if (document.activeElement === proxy) proxy?.blur()
    proxy?.remove()
  }, 1500)
}

/** Moves focus from the proxy (if it holds the keyboard) to the real field */
export function takeKeyboard(field: HTMLElement | null | undefined) {
  field?.focus({ preventScroll: true })
  clearTimeout(cleanup)
  proxy?.remove()
}
