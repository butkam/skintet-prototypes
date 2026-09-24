// Демо-товари з актуального каталогу https://skintet.com/catalog (станом на 14.09.2026)
// Фото — прямі посилання на CDN сайту.
// Подарунки до товарів (gift) — демо-заглушки для прототипу, не реальні акції.
// Фото подарунка — теж із каталогу: у прототипі беремо найближчий за змістом кадр.
import type { CartLine } from './catalog'

export type DemoProduct = Omit<CartLine, 'qty' | 'kind'> & { kind: 'product' | 'set'; brand: string; url: string }

const img = (path: string) => `https://skintet.com/media/cache/sylius_shop_product_original/${path}.webp`

const product = (p: {
  id: string
  brand: string
  title: string
  description: string
  price: number
  oldPrice?: number
  image: string
  gift?: CartLine['gift']
  category?: CartLine['category']
  shortName?: string
}): DemoProduct => ({
  ...p,
  kind: 'product',
  description: `${p.brand} · ${p.description}`,
  image: img(p.image),
  url: `https://skintet.com/products/${p.id}`,
})

/** Набір: виглядає як товар, але зі згорнутим списком складу (Figma 112:2289) */
const set = (p: {
  id: string
  brand: string
  title: string
  price: number
  oldPrice?: number
  image: string
  items: { title: string; image?: string }[]
}): DemoProduct => ({
  id: p.id,
  kind: 'set',
  brand: p.brand,
  title: p.title,
  price: p.price,
  oldPrice: p.oldPrice,
  image: img(p.image),
  // Where the site has no separate photo for an item, fall back to the set photo
  setItems: p.items.map((i) => ({ title: i.title, image: img(i.image ?? p.image) })),
  expanded: false,
  url: `https://skintet.com/products/${p.id}`,
})

export const demoProducts: DemoProduct[] = [
  product({
    id: 'exo-pdrn-prismatic',
    brand: 'Medik8',
    title: 'Exo-PDRN Prismatic+',
    description: 'Сироватка для омолодження шкіри з екзосомами та PDRN • 30 мл',
    price: 5000,
    image: '21/ef/60523ca0eb848a7f484a8039b421',
    gift: { title: 'Брендовий масажер для ліфтингу Medik8 у подарунок', price: 1, image: img('24/f5/ec3d6f0b9f770ccb91807c43390b') },
  }),
  product({
    id: 'total-moisture-daily-cleansing-gel',
    brand: 'Medik8',
    title: 'Total Moisture Daily Cleansing Gel',
    description: 'Гель для очищення шкіри з магнітами вологи та пребіотиками • 145 мл',
    price: 1900,
    image: '85/0b/7131ab118f84a705054b77f28eaf',
    gift: { title: 'Брендова косметичка Medik8 у подарунок', price: 1, image: img('c3/ce/edabbf7cf22a86b411e3aea0d654') },
  }),
  product({
    id: 'neuropeptide-corrective-brightening-under-eye-cream',
    brand: 'Perricone MD',
    title: 'Neuropeptide Corrective Brightening Under-Eye Cream',
    description: 'Крем для зони навколо очей з нейропептидами • 15 мл',
    price: 5500,
    image: '2c/6d/20cb25d90b82d04702b0863b1f4b',
  }),
  product({
    id: 'cold-plasma-plus-advanced-hydrating-complex',
    brand: 'Perricone MD',
    title: 'Cold Plasma Plus+ Advanced Hydrating Complex',
    description: 'Крем для інтенсивного зволоження • 59 мл',
    price: 4400,
    oldPrice: 5500,
    image: 'c4/24/e9d69e6a72057cc717355b61e3e8',
  }),
  set({
    id: 'premium-set-skin-tet',
    brand: 'Skin(tet)',
    title: 'Premium Set Skin(tet)',
    price: 3555,
    image: 'bf/d4/d4239b1081593acfa4a59ec9a349',
    items: [
      { title: 'Cleansing Gel Apeer' },
      { title: 'Total Moisture Daily Facial Cream Medik8' },
      { title: 'Lift 27 Mask Cosmetics27' },
      { title: 'RevitaLash® Advanced Sensitive' },
      { title: 'Hypoallergenic Restorative Serum Perricone MD' },
      { title: 'Брендові рушники Medik8' },
    ],
  }),
  product({
    id: 'niacinamide-peptides',
    brand: 'Medik8',
    title: 'Niacinamide Peptides',
    description: 'Пептидна сироватка з 10% ніацинаміду для вирівнювання текстури шкіри • 30 мл',
    price: 3200,
    image: '5b/86/d179a78947ed0ca96a441ba626c2',
  }),
  product({
    id: 'no-makeup-mascara-black',
    brand: 'Perricone MD',
    title: 'No Makeup Mascara Black',
    description: 'Туш для вій • 8 г',
    price: 1800,
    image: '7c/d6/77c759c0f71aef79fb1f87e125b5',
    gift: { title: 'Мініатюра No Makeup Skin Tint у подарунок', price: 1, image: img('c4/24/e9d69e6a72057cc717355b61e3e8') },
  }),
  product({
    id: 'lift-complex-cream',
    brand: 'Apeer',
    title: 'Lift Complex Cream',
    description: 'Зволожувальний крем з ефектом ліфтингу • 50 мл',
    price: 4400,
    image: '24/f5/ec3d6f0b9f770ccb91807c43390b',
  }),
  product({
    id: 'liquid-peptides-advanced-mp',
    brand: 'Medik8',
    title: 'Liquid Peptides Advanced MP',
    description: 'Інноваційна ліфтинг-сироватка з технологією Dual MiniProteins • 30 мл',
    price: 5000,
    image: 'fb/c3/5d61478de110cc42b40a4a557efd',
  }),
  product({
    id: 'leave-in-hair-mask-conditioner',
    brand: 'Revitalash',
    title: 'Leave-In Hair Mask & Conditioner',
    description: 'Маска-кондиціонер для волосся 5 в 1 • 90 мл',
    price: 2075,
    image: 'c9/1e/45f54a06ec9f45f4ee8a2ff4753c',
    gift: { title: 'Шовкова резинка для волосся Revitalash у подарунок', price: 1, image: img('a3/f9/2e39f4195c9b885c5e6fcc57d1e5') },
  }),
  product({
    id: 'neuropeptide-deep-crease-serum',
    brand: 'Perricone MD',
    title: 'Neuropeptide Deep Crease Serum',
    description: 'Сироватка для омолодження шкіри з нейропептидами • 30 мл',
    price: 8500,
    image: 'e6/cf/a6d222eee0814082a51f4cf1b163',
    gift: { title: 'Мініатюра Neuropeptide Night Cream у подарунок', price: 1, image: img('8c/5c/bb4ef4fc14825903c7a1a1c2d50d') },
  }),
  set({
    id: 'spa-ritual-apeer',
    brand: 'Apeer',
    title: 'Набір Spa-Ritual Apeer',
    price: 3485,
    image: '0e/08/af4bbe1a1166c0f216cebce4de41',
    items: [
      { title: 'Renewing Body Scrub Apeer' },
      { title: 'Restore Body Lotion Apeer', image: '47/e1/9aa33db3bee8a3a5ca69c4af6c92' },
      { title: 'Брендова косметичка Apeer', image: 'c3/ce/edabbf7cf22a86b411e3aea0d654' },
    ],
  }),
  product({
    id: 'neuropeptide-the-cleansing-balm',
    brand: 'Perricone MD',
    title: 'Neuropeptide The Cleansing Balm',
    description: 'Очищувальний живильний бальзам з нейропептидами • 96 г',
    price: 2250,
    image: '8c/5c/bb4ef4fc14825903c7a1a1c2d50d',
  }),
  product({
    id: 'advanced-pro-collagen-peptide-cream',
    brand: 'Medik8',
    title: 'Advanced Pro-Collagen+ Peptide Cream',
    description: 'Антивіковий крем з комплексом пептидів та NAD⁺ Longevity Booster • 50 мл',
    price: 5000,
    image: '87/b2/9b419d92030ef19c0c28b6ea99ab',
  }),
  product({
    id: 'haircare-triple-keratin-repair-shampoo',
    brand: 'Perricone MD',
    title: 'Triple Keratin Repair Shampoo',
    description: 'Шампунь для зволоження та відновлення волосся • 300 мл',
    price: 1750,
    image: '9d/19/4986ecef03aa2aecf29226d64d1b',
  }),
  set({
    id: 'haircare-triple-keratin-repair-set',
    brand: 'Perricone MD',
    title: 'Haircare Triple Keratin Repair Set',
    price: 7350,
    image: 'd0/02/69d754f66638d573b8aebe8b529f',
    items: [
      { title: 'Triple Keratin Repair Shampoo', image: '9d/19/4986ecef03aa2aecf29226d64d1b' },
      { title: 'Haircare Hydrating & Strengthening Conditioner', image: 'a3/f9/2e39f4195c9b885c5e6fcc57d1e5' },
      { title: 'Hydrating & Strengthening Moisture Hair Mask', image: '2e/81/2178d71554f0e00c0741c40b2ddf' },
      { title: 'Strengthening Daily Leave-In Spray', image: '51/a8/73830dc81a1095409f8aa7494c63' },
      { title: 'Гребінець у подарунок' },
    ],
  }),
  set({
    id: 'calming-kit',
    brand: 'Apeer',
    title: 'Calming Kit',
    price: 8700,
    image: '95/9d/0b46641d6ff923daf828b06a45ba',
    items: [
      { title: 'Очищувальний гель' },
      { title: 'Зволожувальна маска' },
      { title: 'Заспокійлива сироватка' },
      { title: 'Крем для зменшення почервоніння' },
    ],
  }),
  product({
    id: 'express-by-deesse-pro',
    brand: 'Déesse PRO',
    title: 'Express by Déesse PRO',
    description: 'Багатофункціональна LED-маска для обличчя',
    price: 19080,
    image: '77/21/dd72dd5cc3063868d6e15f98e08d',
    category: 'device',
    shortName: 'LED-маска',
  }),
]
