/**
 * Гаманець для оплати «Онлайн карткою»: Apple Pay там, де Safari вміє намалювати її кнопку
 * (iPhone, Mac), інакше Google Pay. Показуємо один — той, що є на пристрої.
 */

export type Wallet = 'apple' | 'google'

export function detectWallet(): Wallet {
  return CSS.supports('-webkit-appearance', '-apple-pay-button') ? 'apple' : 'google'
}

/* ---------- Google Pay (pay.js) ---------- */

type GooglePayButtonOptions = {
  onClick: () => void
  buttonColor?: 'default' | 'black' | 'white'
  buttonType?: 'book' | 'buy' | 'checkout' | 'donate' | 'order' | 'pay' | 'plain' | 'subscribe'
  buttonLocale?: string
  buttonSizeMode?: 'static' | 'fill'
  buttonRadius?: number
}

export type GooglePaymentsClient = { createButton: (options: GooglePayButtonOptions) => HTMLElement }

declare global {
  interface Window {
    google?: { payments: { api: { PaymentsClient: new (options: { environment: 'TEST' | 'PRODUCTION' }) => GooglePaymentsClient } } }
  }
}

let googlePay: Promise<GooglePaymentsClient> | undefined

/** Loads pay.js once. Prototype: TEST environment, no merchant */
export function loadGooglePay() {
  googlePay ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://pay.google.com/gp/p/js/pay.js'
    script.async = true
    script.onload = () => resolve(new window.google!.payments.api.PaymentsClient({ environment: 'TEST' }))
    script.onerror = () => reject(new Error('Google Pay is unavailable'))
    document.head.append(script)
  })
  return googlePay
}
