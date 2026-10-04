/**
 * Платіжний QR-код НБУ для кредитового переказу (Правила формування та використання QR-коду,
 * формат версії 002). Його сканують застосунки банків (monobank, Приват24…) і відкривають переказ
 * з уже заповненими реквізитами. Те саме посилання на телефоні відкриває застосунок банку напряму.
 *
 * Структура: 13 рядків, розділених Lf — службова мітка BCD, версія 002, кодування (1 — UTF-8),
 * функція UCT, BIC (зарезервовано), отримувач, IBAN, сума, код отримувача, ціль і reference
 * (зарезервовано), призначення платежу. Дані кодуються Base64URL і дописуються до https://bank.gov.ua/qr/
 */
import qrcode from 'qrcode-generator'

export type PaymentQrData = {
  /** Найменування юридичної особи чи ПІБ, до 70 символів */
  recipient: string
  iban: string
  /** ЄДРПОУ (8 цифр) або РНОКПП (10 цифр) */
  code: string
  /** Сума в гривнях; без неї суму вводять під час переказу */
  amount?: number
  /** До 140 символів */
  purpose: string
}

/** «UAH3», а не «UAH3.00»: дробова частина — лише коли вона є, і тоді рівно дві цифри */
function formatAmount(amount: number) {
  const kopecks = Math.round(amount * 100)
  const whole = Math.floor(kopecks / 100)
  const rest = kopecks % 100
  return `UAH${whole}${rest ? `.${String(rest).padStart(2, '0')}` : ''}`
}

function base64Url(text: string) {
  let binary = ''
  for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function paymentQrLink({ recipient, iban, code, amount, purpose }: PaymentQrData) {
  const lines = [
    'BCD',
    '002',
    '1',
    'UCT',
    '',
    recipient.slice(0, 70),
    iban.replace(/\s/g, ''),
    amount ? formatAmount(amount) : '',
    code,
    '',
    '',
    purpose.slice(0, 140),
  ]
  // Кожен рядок, і останній теж, закінчується Lf
  return `https://bank.gov.ua/qr/${base64Url(lines.map((l) => `${l}\n`).join(''))}`
}

/** Модулі QR-коду як один SVG-шлях: квадрат 1×1 на кожен темний модуль, без полів довкола */
export function qrPath(data: string) {
  const qr = qrcode(0, 'M')
  qr.addData(data, 'Byte')
  qr.make()
  const size = qr.getModuleCount()
  let d = ''
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) if (qr.isDark(row, col)) d += `M${col} ${row}h1v1h-1z`
  }
  return { size, d }
}
