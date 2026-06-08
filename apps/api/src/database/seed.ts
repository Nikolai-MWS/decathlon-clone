import 'reflect-metadata';
import AppDataSource from './data-source';
import { Brand } from '../catalog/entities/brand.entity';
import { Category } from '../catalog/entities/category.entity';
import { Price } from '../catalog/entities/price.entity';
import { Product } from '../catalog/entities/product.entity';
import { ProductImage } from '../catalog/entities/product-image.entity';
import { ProductVariant } from '../catalog/entities/product-variant.entity';
import { ProductAttribute } from '../catalog/entities/product-attribute.entity';
import { Sku } from '../catalog/entities/sku.entity';

const img = (name: string, n: number) =>
  `https://placehold.co/600x600/3643ba/ffffff?text=${encodeURIComponent(`${name} ${n}`)}`;

interface CatSpec {
  name: string;
  slug: string;
  children?: CatSpec[];
}

// Top-level navigation mirrors decathlon.bg.
const CATEGORIES: CatSpec[] = [
  {
    name: 'Всички спортове',
    slug: 'all-sports',
    children: [
      { name: 'Колоездене', slug: 'cycling' },
      { name: 'Бягане', slug: 'running' },
      { name: 'Къмпинг', slug: 'camping' },
      { name: 'Фитнес', slug: 'fitness' },
      { name: 'Водни спортове', slug: 'water-sports' },
      { name: 'Футбол', slug: 'football' },
      { name: 'Преходи и трекинг', slug: 'hiking' },
    ],
  },
  { name: 'Мъже', slug: 'men' },
  { name: 'Жени', slug: 'women' },
  { name: 'Деца', slug: 'kids' },
  { name: 'Аксесоари', slug: 'accessories' },
  { name: 'Хранене и здраве', slug: 'nutrition' },
  { name: 'Електроника', slug: 'electronics' },
  { name: 'Намаления', slug: 'sale' },
];

const BRANDS = [
  'Quechua',
  'Kiprun',
  'Btwin',
  'Rockrider',
  'Tribord',
  'Oxelo',
  'Domyos',
  'Kipsta',
  'Adidas',
  'Puma',
  'Garmin',
];

interface VariantSpec {
  color: string;
  sizes: { size: string; stock: number }[];
}

interface ProductSpec {
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  currentEur: number;
  oldEur?: number;
  ratingAvg: number;
  reviewCount: number;
  variants: VariantSpec[];
}

const ONE_SIZE = [{ size: 'ЕДИНЕН', stock: 25 }];
const SHOE_SIZES = [
  { size: '40', stock: 5 },
  { size: '41', stock: 8 },
  { size: '42', stock: 0 },
  { size: '43', stock: 12 },
  { size: '44', stock: 3 },
  { size: '45', stock: 0 },
];
const CLOTHING_SIZES = [
  { size: 'S', stock: 10 },
  { size: 'M', stock: 14 },
  { size: 'L', stock: 6 },
  { size: 'XL', stock: 0 },
];

const PRODUCTS: ProductSpec[] = [
  {
    name: 'КОМПЛЕКТ НАДУВАЕМ SUP 100 10\'6"',
    slug: 'inflatable-sup-100',
    brand: 'Tribord',
    category: 'water-sports',
    description: 'Надуваем SUP за начинаещи, стабилен и лесен за транспорт.',
    currentEur: 19999,
    oldEur: 27999,
    ratingAvg: 4.7,
    reviewCount: 409,
    variants: [{ color: 'Синьо', sizes: ONE_SIZE }],
  },
  {
    name: 'ФУТБОЛНА ТОПКА СВЕТОВНО ПЪРВЕНСТВО 2026',
    slug: 'football-world-cup-2026',
    brand: 'Kipsta',
    category: 'football',
    description: 'Официална реплика на топката за сезона.',
    currentEur: 3834,
    ratingAvg: 4.7,
    reviewCount: 86,
    variants: [{ color: 'Бяло/Червено', sizes: [{ size: '5', stock: 30 }] }],
  },
  {
    name: 'ДЕТСКИ ВЕЛОСИПЕД 16 ИНЧА DISCOVER 900',
    slug: 'kids-bike-discover-900-16',
    brand: 'Btwin',
    category: 'cycling',
    description: 'Лек детски велосипед за деца 4–6 години.',
    currentEur: 20400,
    ratingAvg: 4.7,
    reviewCount: 639,
    variants: [{ color: 'Зелен', sizes: ONE_SIZE }],
  },
  {
    name: 'ПАЛАТКА ЗА КЪМПИНГ MH100, 2-МЕСТНА',
    slug: 'camping-tent-mh100-2',
    brand: 'Quechua',
    category: 'camping',
    description: 'Двуслойна палатка за двама, бърз монтаж.',
    currentEur: 2999,
    ratingAvg: 4.6,
    reviewCount: 3606,
    variants: [{ color: 'Сиво', sizes: ONE_SIZE }],
  },
  {
    name: 'ДЕТСКИ ПЛАНИНСКИ ВЕЛОСИПЕД EXPL 500, 26"',
    slug: 'kids-mtb-expl-500-26',
    brand: 'Rockrider',
    category: 'cycling',
    description: 'Планински велосипед за деца 9–12 години.',
    currentEur: 28070,
    ratingAvg: 4.6,
    reviewCount: 2821,
    variants: [{ color: 'Каки', sizes: ONE_SIZE }],
  },
  {
    name: 'ДЕТСКИ РОЛЕРИ PLAY 3',
    slug: 'kids-rollers-play-3',
    brand: 'Oxelo',
    category: 'kids',
    description: 'Регулируеми ролери за деца.',
    currentEur: 2289,
    ratingAvg: 4.7,
    reviewCount: 4338,
    variants: [{ color: 'Розово/Лилаво', sizes: [{ size: '30-32', stock: 9 }, { size: '33-36', stock: 4 }] }],
  },
  {
    name: 'МЪЖКИ ВОДОУСТОЙЧИВИ ТУРИСТИЧЕСКИ ОБУВКИ MH500',
    slug: 'mens-hiking-shoes-mh500',
    brand: 'Quechua',
    category: 'hiking',
    description: 'Непромокаеми обувки за преходи във всякакви условия.',
    currentEur: 5899,
    oldEur: 6649,
    ratingAvg: 4.6,
    reviewCount: 502,
    variants: [
      { color: 'Черно/Сиво', sizes: SHOE_SIZES },
      { color: 'Зелено/Черно', sizes: SHOE_SIZES },
    ],
  },
  {
    name: 'СЛЪНЦЕЗАЩИТЕН СПРЕЙ ACTIVE IP50, 150 МЛ',
    slug: 'sunscreen-active-ip50',
    brand: 'Tribord',
    category: 'nutrition',
    description: 'Слънцезащитен спрей с висока защита SPF50.',
    currentEur: 999,
    oldEur: 1099,
    ratingAvg: 4.7,
    reviewCount: 435,
    variants: [{ color: 'Стандарт', sizes: ONE_SIZE }],
  },
  {
    name: 'РАНИЦА ЗА ПРЕХОДИ NH100, 20 ЛИТРА',
    slug: 'hiking-backpack-nh100-20',
    brand: 'Quechua',
    category: 'hiking',
    description: 'Лека раница 20 литра за еднодневни преходи.',
    currentEur: 999,
    oldEur: 1226,
    ratingAvg: 4.8,
    reviewCount: 19164,
    variants: [{ color: 'Черна', sizes: ONE_SIZE }],
  },
  {
    name: 'МЪЖКА ТЕНИСКА ЗА БЯГАНЕ KIPRUN 100 DRY',
    slug: 'mens-running-tshirt-kiprun-100',
    brand: 'Kiprun',
    category: 'running',
    description: 'Дишаща тениска за бягане, отвежда потта.',
    currentEur: 499,
    oldEur: 613,
    ratingAvg: 4.7,
    reviewCount: 25171,
    variants: [
      { color: 'Бяла', sizes: CLOTHING_SIZES },
      { color: 'Черна', sizes: CLOTHING_SIZES },
    ],
  },
  {
    name: 'ТЕРМОС ОТ НЕРЪЖДАЕМА СТОМАНА 900, 0.5 Л',
    slug: 'thermos-900-05l',
    brand: 'Quechua',
    category: 'camping',
    description: 'Термос с бързо отваряне, 0.5 литра.',
    currentEur: 999,
    oldEur: 1432,
    ratingAvg: 4.7,
    reviewCount: 6483,
    variants: [{ color: 'Синьо', sizes: ONE_SIZE }],
  },
  {
    name: 'МАСКА ЗА ШНОРХЕЛИНГ EASYBREATH +',
    slug: 'snorkeling-mask-easybreath',
    brand: 'Tribord',
    category: 'water-sports',
    description: 'Маска за шнорхелинг с акустичен клапан.',
    currentEur: 1891,
    oldEur: 2812,
    ratingAvg: 4.5,
    reviewCount: 2092,
    variants: [{ color: 'Синя', sizes: [{ size: 'S/M', stock: 7 }, { size: 'L/XL', stock: 11 }] }],
  },
  {
    name: 'ДАМСКИ КЛИН ЗА ФИТНЕС 500',
    slug: 'womens-fitness-leggings-500',
    brand: 'Domyos',
    category: 'fitness',
    description: 'Еластичен клин с висока талия за фитнес.',
    currentEur: 1299,
    ratingAvg: 4.5,
    reviewCount: 1320,
    variants: [
      { color: 'Черен', sizes: CLOTHING_SIZES },
      { color: 'Тъмносин', sizes: CLOTHING_SIZES },
    ],
  },
  {
    name: 'ДЪМБЕЛИ КОМПЛЕКТ 20 КГ',
    slug: 'dumbbell-set-20kg',
    brand: 'Domyos',
    category: 'fitness',
    description: 'Регулируем комплект дъмбели до 20 кг.',
    currentEur: 5999,
    ratingAvg: 4.6,
    reviewCount: 880,
    variants: [{ color: 'Черно', sizes: ONE_SIZE }],
  },
  {
    name: 'ШОСЕЕН ВЕЛОСИПЕД RC 100',
    slug: 'road-bike-rc-100',
    brand: 'Btwin',
    category: 'cycling',
    description: 'Шосеен велосипед за начинаещи.',
    currentEur: 49999,
    oldEur: 59999,
    ratingAvg: 4.4,
    reviewCount: 540,
    variants: [{ color: 'Червен', sizes: [{ size: 'M', stock: 4 }, { size: 'L', stock: 2 }] }],
  },
  {
    name: 'МЪЖКИ МАРАТОНКИ ЗА БЯГАНЕ KIPRUN KS500',
    slug: 'mens-running-shoes-ks500',
    brand: 'Kiprun',
    category: 'running',
    description: 'Омекотени маратонки за редовно бягане.',
    currentEur: 5999,
    ratingAvg: 4.6,
    reviewCount: 3110,
    variants: [{ color: 'Сиво/Оранжево', sizes: SHOE_SIZES }],
  },
  {
    name: 'СПАЛЕН ЧУВАЛ ЗА КЪМПИНГ BASIC, 20°C',
    slug: 'sleeping-bag-basic-20',
    brand: 'Quechua',
    category: 'camping',
    description: 'Лек спален чувал за летен къмпинг.',
    currentEur: 1319,
    ratingAvg: 4.7,
    reviewCount: 121,
    variants: [{ color: 'Синьо', sizes: ONE_SIZE }],
  },
  {
    name: 'ФУТБОЛНИ БУТОНКИ AGILITY 500',
    slug: 'football-boots-agility-500',
    brand: 'Kipsta',
    category: 'football',
    description: 'Бутонки за твърд терен.',
    currentEur: 3499,
    oldEur: 3999,
    ratingAvg: 4.3,
    reviewCount: 760,
    variants: [{ color: 'Черно/Жълто', sizes: SHOE_SIZES }],
  },
  {
    name: 'ДАМСКА СПОРТНА ТЕНИСКА ADIDAS ESSENTIALS',
    slug: 'womens-adidas-essentials-tee',
    brand: 'Adidas',
    category: 'women',
    description: 'Памучна спортна тениска за всеки ден.',
    currentEur: 1999,
    oldEur: 2499,
    ratingAvg: 4.5,
    reviewCount: 210,
    variants: [{ color: 'Бяла', sizes: CLOTHING_SIZES }],
  },
  {
    name: 'МЪЖКИ ШОРТИ PUMA TRAIN',
    slug: 'mens-puma-train-shorts',
    brand: 'Puma',
    category: 'men',
    description: 'Леки тренировъчни шорти.',
    currentEur: 2299,
    ratingAvg: 4.4,
    reviewCount: 142,
    variants: [{ color: 'Черни', sizes: CLOTHING_SIZES }],
  },
  {
    name: 'GPS ЧАСОВНИК ЗА БЯГАНЕ KIPRUN 500',
    slug: 'gps-watch-kiprun-500',
    brand: 'Kiprun',
    category: 'electronics',
    description: 'GPS часовник с измерване на пулс.',
    currentEur: 9999,
    oldEur: 12999,
    ratingAvg: 4.5,
    reviewCount: 980,
    variants: [{ color: 'Черен', sizes: ONE_SIZE }],
  },
  {
    name: 'ТРОТИНЕТКА TOWN 5',
    slug: 'scooter-town-5',
    brand: 'Oxelo',
    category: 'accessories',
    description: 'Сгъваема тротинетка за град.',
    currentEur: 11999,
    ratingAvg: 4.6,
    reviewCount: 4100,
    variants: [{ color: 'Сива', sizes: ONE_SIZE }],
  },
  {
    name: 'ПРОТЕИН СУРОВАТЪЧЕН ВАНИЛИЯ 900 Г',
    slug: 'whey-protein-vanilla-900',
    brand: 'Domyos',
    category: 'nutrition',
    description: 'Суроватъчен протеин с вкус на ванилия.',
    currentEur: 2499,
    ratingAvg: 4.4,
    reviewCount: 530,
    variants: [{ color: 'Ванилия', sizes: ONE_SIZE }],
  },
  {
    name: 'ДЕТСКА РАНИЦА ЗА УЧИЛИЩЕ 17 Л',
    slug: 'kids-school-backpack-17l',
    brand: 'Quechua',
    category: 'kids',
    description: 'Удобна детска раница за училище.',
    currentEur: 1499,
    oldEur: 1999,
    ratingAvg: 4.7,
    reviewCount: 320,
    variants: [{ color: 'Синя', sizes: ONE_SIZE }, { color: 'Розова', sizes: ONE_SIZE }],
  },
  {
    name: 'КАЯК НАДУВАЕМ 100, 1-МЕСТЕН',
    slug: 'inflatable-kayak-100',
    brand: 'Tribord',
    category: 'water-sports',
    description: 'Надуваем каяк за един човек.',
    currentEur: 17999,
    oldEur: 19999,
    ratingAvg: 4.6,
    reviewCount: 136,
    variants: [{ color: 'Жълт', sizes: ONE_SIZE }],
  },
  {
    name: 'ЛЕНТА ЗА СЪПРОТИВЛЕНИЕ КОМПЛЕКТ',
    slug: 'resistance-band-set',
    brand: 'Domyos',
    category: 'fitness',
    description: 'Комплект ленти за тренировки у дома.',
    currentEur: 1499,
    ratingAvg: 4.5,
    reviewCount: 2200,
    variants: [{ color: 'Микс', sizes: ONE_SIZE }],
  },
  {
    name: 'ДАМСКИ ХЛАЗ ЗА ПРЕХОДИ MH500',
    slug: 'womens-hiking-jacket-mh500',
    brand: 'Quechua',
    category: 'hiking',
    description: 'Водоустойчиво яке за планински преходи.',
    currentEur: 6999,
    oldEur: 8999,
    ratingAvg: 4.6,
    reviewCount: 410,
    variants: [{ color: 'Бордо', sizes: CLOTHING_SIZES }],
  },
  {
    name: 'ВРАТАРСКИ РЪКАВИЦИ F500',
    slug: 'goalkeeper-gloves-f500',
    brand: 'Kipsta',
    category: 'football',
    description: 'Вратарски ръкавици с добро сцепление.',
    currentEur: 1799,
    ratingAvg: 4.4,
    reviewCount: 305,
    variants: [{ color: 'Сиво', sizes: [{ size: '8', stock: 6 }, { size: '9', stock: 4 }, { size: '10', stock: 0 }] }],
  },
];

// Procedurally broaden the catalog so every category has depth for browsing,
// pagination, and facets. Deterministic (no randomness) for reproducible seeds.
interface GenTemplate {
  category: string;
  noun: string; // base product noun (BG)
  models: string[];
  brands: string[];
  sizeType: 'one' | 'shoe' | 'clothing';
  baseEur: number;
  colors: string[];
}

const GEN_TEMPLATES: GenTemplate[] = [
  { category: 'cycling', noun: 'ВЕЛОСИПЕД', models: ['ROCKRIDER ST 120', 'ROCKRIDER ST 540', 'RIVERSIDE 120', 'ELOPS 120'], brands: ['Btwin', 'Rockrider'], sizeType: 'one', baseEur: 29999, colors: ['Черен', 'Син'] },
  { category: 'running', noun: 'МАРАТОНКИ', models: ['KIPRUN KD500', 'KIPRUN KS900', 'JOGFLOW 500', 'RUN ACTIVE'], brands: ['Kiprun'], sizeType: 'shoe', baseEur: 6999, colors: ['Черно', 'Синьо'] },
  { category: 'camping', noun: 'ПАЛАТКА', models: ['MH100 3-МЕСТНА', 'ARPENAZ 4.2', 'AIR SECONDS 3', 'QUICKHIKER 2'], brands: ['Quechua'], sizeType: 'one', baseEur: 8999, colors: ['Сиво', 'Зелено'] },
  { category: 'fitness', noun: 'КОМПЛЕКТ ЗА ФИТНЕС', models: ['STRONG 100', 'CROSS 500', 'CARDIO 120', 'YOGA ESSENTIAL'], brands: ['Domyos'], sizeType: 'one', baseEur: 3999, colors: ['Черно'] },
  { category: 'water-sports', noun: 'НЕОПРЕН', models: ['100 1.5MM', '500 4/3MM', 'OWS 900', 'SURF 100'], brands: ['Tribord'], sizeType: 'clothing', baseEur: 5999, colors: ['Черно', 'Синьо'] },
  { category: 'football', noun: 'ЕКИП ЗА ФУТБОЛ', models: ['VIRALTO 1', 'F100', 'ESSENTIEL', 'TRAXIUM'], brands: ['Kipsta', 'Adidas', 'Puma'], sizeType: 'clothing', baseEur: 2499, colors: ['Червено', 'Бяло'] },
  { category: 'hiking', noun: 'ОБУВКИ ЗА ПРЕХОДИ', models: ['MH100', 'MH500 MID', 'NH100', 'TREK 100'], brands: ['Quechua'], sizeType: 'shoe', baseEur: 4999, colors: ['Кафяво', 'Сиво'] },
  { category: 'men', noun: 'МЪЖКА ТЕНИСКА', models: ['ESSENTIAL', 'DRY+', 'SPORT 500', 'TRAIN'], brands: ['Domyos', 'Adidas', 'Puma'], sizeType: 'clothing', baseEur: 1499, colors: ['Черна', 'Сива'] },
  { category: 'women', noun: 'ДАМСКА ПОТНИК', models: ['ESSENTIAL', 'YOGA 500', 'RUN DRY', 'CARDIO'], brands: ['Domyos', 'Kiprun'], sizeType: 'clothing', baseEur: 1599, colors: ['Розова', 'Черна'] },
  { category: 'kids', noun: 'ДЕТСКИ КОМПЛЕКТ', models: ['FIRST 100', 'PLAY 500', 'SCHOOL', 'ACTIVE'], brands: ['Domyos', 'Kipsta'], sizeType: 'clothing', baseEur: 1299, colors: ['Синьо', 'Зелено'] },
  { category: 'accessories', noun: 'АКСЕСОАР', models: ['РАНИЦА 25Л', 'БУТИЛКА 0.8Л', 'ШАПКА', 'ЧОРАПИ 3 ЧИФТА'], brands: ['Quechua', 'Kiprun'], sizeType: 'one', baseEur: 999, colors: ['Черно', 'Синьо'] },
  { category: 'nutrition', noun: 'ХРАНИТЕЛНА ДОБАВКА', models: ['ПРОТЕИН БАР', 'ИЗОТОНИК', 'ГЕЛ ЕНЕРГИЯ', 'МАГНЕЗИЙ'], brands: ['Domyos'], sizeType: 'one', baseEur: 799, colors: ['Микс'] },
  { category: 'electronics', noun: 'ЕЛЕКТРОНИКА', models: ['GPS ЧАСОВНИК 100', 'ФЕНЕР 500', 'ПУЛСОМЕР', 'СТЕП БРОЯЧ'], brands: ['Kiprun', 'Garmin'], sizeType: 'one', baseEur: 4999, colors: ['Черен'] },
];

function genSizes(type: GenTemplate['sizeType'], seed: number) {
  if (type === 'shoe') {
    return ['40', '41', '42', '43', '44', '45'].map((s, i) => ({ size: s, stock: (seed + i) % 4 === 0 ? 0 : (seed + i) % 9 }));
  }
  if (type === 'clothing') {
    return ['S', 'M', 'L', 'XL'].map((s, i) => ({ size: s, stock: (seed + i) % 5 === 0 ? 0 : (seed + i) % 12 }));
  }
  return [{ size: 'ЕДИНЕН', stock: 10 + (seed % 20) }];
}

function generateExtraProducts(): ProductSpec[] {
  const out: ProductSpec[] = [];
  GEN_TEMPLATES.forEach((t, ti) => {
    t.models.forEach((model, mi) => {
      const seed = ti * 7 + mi * 3 + 1;
      const brand = t.brands[mi % t.brands.length];
      const discounted = seed % 3 === 0;
      const current = t.baseEur + mi * 500 + (seed % 5) * 100;
      const colors = [t.colors[mi % t.colors.length]];
      if (t.colors.length > 1 && mi % 2 === 0) colors.push(t.colors[(mi + 1) % t.colors.length]);
      out.push({
        name: `${t.noun} ${model}`,
        slug: `${t.category}-gen-${ti}-${mi}`,
        brand,
        category: t.category,
        description: `${t.noun} ${model} — изработено от ${brand} за любимия ти спорт.`,
        currentEur: current,
        oldEur: discounted ? Math.round(current * 1.25) : undefined,
        ratingAvg: 4 + ((seed % 10) / 10),
        reviewCount: 20 + seed * 13,
        variants: colors.map((color) => ({ color, sizes: genSizes(t.sizeType, seed) })),
      });
    });
  });
  return out;
}

PRODUCTS.push(...generateExtraProducts());

function buildAttributes(spec: ProductSpec): ProductAttribute[] {
  const rows: { section: ProductAttribute['section']; label: string; value: string }[] = [
    { section: 'advantages', label: '', value: 'Качество, доказано от хиляди клиенти' },
    { section: 'advantages', label: '', value: 'Отлично съотношение цена/качество' },
    { section: 'advantages', label: '', value: 'Дизайн и тестове от DECATHLON' },
    { section: 'specs', label: 'Марка', value: spec.brand },
    { section: 'specs', label: 'Гаранция', value: '2 години' },
    { section: 'specs', label: 'Цвят', value: spec.variants.map((v) => v.color).join(', ') },
    { section: 'care', label: '', value: 'Съхранявай на сухо и проветриво място.' },
    { section: 'care', label: '', value: 'Следвай инструкциите на етикета.' },
    { section: 'environment', label: '', value: 'Произведено с грижа за околната среда.' },
  ];
  return rows.map((r, i) => {
    const attr = new ProductAttribute();
    attr.section = r.section;
    attr.label = r.label;
    attr.value = r.value;
    attr.position = i;
    return attr;
  });
}

async function seed(): Promise<void> {
  const ds = await AppDataSource.initialize();
  console.log('Connected. Clearing existing catalog data...');

  // FK-safe truncate.
  await ds.query(
    'TRUNCATE TABLE "skus","product_images","product_variants","product_attributes","prices","products","categories","brands" RESTART IDENTITY CASCADE',
  );

  const brandRepo = ds.getRepository(Brand);
  const categoryRepo = ds.getRepository(Category);
  const productRepo = ds.getRepository(Product);

  const brandBySlug = new Map<string, Brand>();
  for (const name of BRANDS) {
    const slug = name.toLowerCase();
    brandBySlug.set(slug, await brandRepo.save(brandRepo.create({ name, slug })));
  }
  // also key brands by name for product lookup
  const brandByName = new Map<string, Brand>();
  for (const b of brandBySlug.values()) brandByName.set(b.name, b);

  const categoryBySlug = new Map<string, Category>();
  let position = 0;
  for (const top of CATEGORIES) {
    const parent = await categoryRepo.save(
      categoryRepo.create({ name: top.name, slug: top.slug, position: position++, parentId: null }),
    );
    categoryBySlug.set(top.slug, parent);
    let childPos = 0;
    for (const child of top.children ?? []) {
      const c = await categoryRepo.save(
        categoryRepo.create({
          name: child.name,
          slug: child.slug,
          position: childPos++,
          parentId: parent.id,
        }),
      );
      categoryBySlug.set(child.slug, c);
    }
  }

  const now = Date.now();
  const promoEnd = new Date(now + 30 * 24 * 60 * 60 * 1000);
  const promoStart = new Date(now - 7 * 24 * 60 * 60 * 1000);

  let count = 0;
  for (const spec of PRODUCTS) {
    const brand = brandByName.get(spec.brand);
    const category = categoryBySlug.get(spec.category);
    if (!brand || !category) {
      throw new Error(`Missing brand/category for ${spec.slug}`);
    }

    const product = new Product();
    product.name = spec.name;
    product.slug = spec.slug;
    product.description = spec.description;
    product.brand = brand;
    product.category = category;
    product.ratingAvg = spec.ratingAvg;
    product.reviewCount = spec.reviewCount;

    const price = new Price();
    price.currentEur = spec.currentEur;
    price.oldEur = spec.oldEur ?? null;
    price.discountPct = spec.oldEur
      ? Math.round((1 - spec.currentEur / spec.oldEur) * 100)
      : null;
    price.promoStart = spec.oldEur ? promoStart : null;
    price.promoEnd = spec.oldEur ? promoEnd : null;
    product.price = price;

    product.variants = spec.variants.map((v, vi) => {
      const variant = new ProductVariant();
      variant.colorName = v.color;
      variant.slug = `${spec.slug}-${vi}`;
      variant.images = [0, 1].map((n) => {
        const image = new ProductImage();
        image.url = img(spec.name, n + 1);
        image.position = n;
        return image;
      });
      variant.skus = v.sizes.map((s) => {
        const sku = new Sku();
        sku.size = s.size;
        sku.stock = s.stock;
        return sku;
      });
      return variant;
    });

    product.attributes = buildAttributes(spec);

    await productRepo.save(product);
    count++;
  }

  console.log(
    `Seeded ${BRANDS.length} brands, ${categoryBySlug.size} categories, ${count} products.`,
  );
  await ds.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
