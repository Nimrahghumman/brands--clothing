import heroEditorialCampaign from '../assets/images/hero_editorial_campaign_1793708388350.jpg';
import catMensAtelier from '../assets/images/cat_mens_atelier_1793708389605.jpg';
import catWomensAtelier from '../assets/images/cat_womens_atelier_1793708391272.jpg';
import promoSeasonalAtelier from '../assets/images/promo_seasonal_atelier_1793708393227.jpg';

import prodOversizedTee from '../assets/images/prod_oversized_tee_1793708394661.jpg';
import prodPremiumHoodie from '../assets/images/prod_premium_hoodie_1793708395817.jpg';
import prodCasualShirt from '../assets/images/prod_casual_shirt_1793708397015.jpg';
import prodSelvedgeDenim from '../assets/images/prod_selvedge_denim_1793708398525.jpg';
import prodWoolCoat from '../assets/images/prod_wool_coat_1793708400677.jpg';
import prodLinenSet from '../assets/images/prod_linen_set_1793708401807.jpg';
import prodStreetJacket from '../assets/images/prod_street_jacket_1793708403641.jpg';
import prodLeatherTote from '../assets/images/prod_leather_tote_1793708405417.jpg';

import instaEditorialOne from '../assets/images/insta_editorial_one_1793708407363.jpg';
import instaEditorialTwo from '../assets/images/insta_editorial_two_1793708408373.jpg';
import instaEditorialThree from '../assets/images/insta_editorial_three_1793708409925.jpg';
import instaEditorialFour from '../assets/images/insta_editorial_four_1793708409807.jpg';

export type GarmentSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export const ALL_SIZES: GarmentSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export type FashionCollection =
  | 'Men'
  | 'Women'
  | 'Oversized T-shirts'
  | 'Premium Hoodies'
  | 'Casual Shirts'
  | 'Denim Jeans'
  | 'Streetwear'
  | 'Summer Collection'
  | 'Winter Collection'
  | 'Accessories';

export const ALL_COLLECTIONS: FashionCollection[] = [
  'Men',
  'Women',
  'Oversized T-shirts',
  'Premium Hoodies',
  'Casual Shirts',
  'Denim Jeans',
  'Streetwear',
  'Summer Collection',
  'Winter Collection',
  'Accessories',
];

export interface ColorOption {
  name: string;
  hex: string;
  inStock: boolean;
}

export type GarmentSilhouetteType =
  | 'tee'
  | 'hoodie'
  | 'shirt'
  | 'denim'
  | 'coat'
  | 'dress'
  | 'jacket'
  | 'tote';

export interface ProductReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  title: string;
  comment: string;
  purchasedSize: GarmentSize;
  purchasedColor: string;
  fitFeedback: 'Runs small' | 'True to size' | 'Relaxed fit';
  dateLabel: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortCategory: string;
  gender: 'Men' | 'Women' | 'Unisex';
  collections: FashionCollection[];
  priceCents: number;
  salePriceCents?: number;
  image: string;
  imageAlt: string;
  silhouette: GarmentSilhouetteType;
  description: string;
  fabricSpec: string;
  weightSpec: string;
  fitNotes: string;
  careInstructions: string;
  origin: string;
  sizes: GarmentSize[];
  soldOutSizes: GarmentSize[];
  colors: ColorOption[];
  isNewArrival: boolean;
  isBestSeller: boolean;
  createdAtOrder: number;
  reviews: ProductReview[];
}

export const CAMPAIGN_ASSETS = {
  hero: {
    src: heroEditorialCampaign,
    alt: 'Two models in oversized tailored black wool coats and ivory linen trousers standing in a minimalist sunlit travertine studio',
  },
  menBanner: {
    src: catMensAtelier,
    alt: 'Menswear look featuring a sand-beige cotton gabardine overshirt layered over a crisp white tee and dark charcoal tailored trousers',
  },
  womenBanner: {
    src: catWomensAtelier,
    alt: 'Womenswear look featuring an architectural belted cream silk-linen blazer and wide-leg black wool trousers',
  },
  promoBanner: {
    src: promoSeasonalAtelier,
    alt: 'Seasonal capsule rail displaying brushed merino coats, cashmere knitwear, and folded neutral textiles on travertine stone',
  },
};

export interface InstagramPost {
  id: string;
  image: string;
  alt: string;
  handle: string;
  location: string;
  caption: string;
  featuredProductSlug: string;
}

export const INSTAGRAM_GALLERY: InstagramPost[] = [
  {
    id: 'ig-1',
    image: instaEditorialOne,
    alt: 'Street style photograph under sunlit limestone colonnades wearing an oversized cream coat and black leather shoulder bag',
    handle: '@kova.atelier',
    location: 'Palais-Royal, Paris',
    caption: 'Morning light under limestone arcades. Sculpted Calfskin Minimalist Tote paired with unlined transitional tailoring.',
    featuredProductSlug: 'sculpted-calfskin-minimalist-tote',
  },
  {
    id: 'ig-2',
    image: instaEditorialTwo,
    alt: 'Close-up detail of layered oat and charcoal knitwear cuffs beside a ceramic espresso cup on travertine',
    handle: '@kova.journal',
    location: 'Brera District, Milan',
    caption: 'Tactile layering in 480 GSM loopback cotton and brushed merino rib.',
    featuredProductSlug: 'heavyweight-loopback-boxy-hoodie',
  },
  {
    id: 'ig-3',
    image: instaEditorialThree,
    alt: 'Minimalist portrait showing a charcoal wool blazer layered over crisp poplin shirting and pleated beige trousers',
    handle: '@kova.studio',
    location: 'Aoyama, Tokyo',
    caption: 'Clean proportions from desk to evening. Organic Cotton Poplin Relaxed Shirt beneath soft-shoulder tailoring.',
    featuredProductSlug: 'organic-poplin-relaxed-shirt',
  },
  {
    id: 'ig-4',
    image: instaEditorialFour,
    alt: 'Architectural flat-lay of folded Japanese selvedge denim, sand-beige cotton jersey tee, sunglasses, and black calfskin cardholder',
    handle: '@kova.archive',
    location: 'Södermalm, Stockholm',
    caption: 'Weekend uniform essentials: 13.5 oz Okayama raw selvedge denim and 310 GSM Supima jersey.',
    featuredProductSlug: 'japanese-raw-selvedge-straight-jeans',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    slug: 'supima-heavyweight-oversized-tee',
    name: 'Supima Heavyweight Oversized Tee',
    shortCategory: 'Oversized T-shirts',
    gender: 'Men',
    collections: ['Men', 'Oversized T-shirts', 'Streetwear', 'Summer Collection'],
    priceCents: 6800,
    salePriceCents: 5800,
    image: prodOversizedTee,
    imageAlt: 'Model wearing a boxy heavyweight off-white Supima cotton t-shirt with dropped shoulders and high ribbed collar',
    silhouette: 'tee',
    description:
      'Cut with architectural volume and a clean dropped shoulder, our signature t-shirt is knitted from long-staple 310 GSM Supima cotton jersey. The compact single-jersey structure holds its crisp drape away from the body without clinging, finished with a 2.8 cm double-ribbed crew collar.',
    fabricSpec: '100% Organic Long-Staple Supima Cotton',
    weightSpec: '310 GSM compact single jersey',
    fitNotes: 'Boxy oversized fit with dropped shoulders. Take your usual size for an editorial drape, or size down for a standard relaxed silhouette.',
    careInstructions: 'Machine wash cold gentle cycle inside out. Lay flat to dry. Cool iron on reverse.',
    origin: 'Knitted and garment-sewn in Barcelos, Portugal',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    soldOutSizes: ['XXL'],
    colors: [
      { name: 'Off-White', hex: '#F2EFE9', inStock: true },
      { name: 'Obsidian Black', hex: '#141414', inStock: true },
      { name: 'Oat Beige', hex: '#D8C7AD', inStock: true },
      { name: 'Stone Taupe', hex: '#8B8378', inStock: true },
    ],
    isNewArrival: true,
    isBestSeller: false,
    createdAtOrder: 8,
    reviews: [
      {
        id: 'rev-101',
        author: 'Zainab M.',
        city: 'Lahore',
        rating: 5,
        title: 'Collar structure stays crisp after washes',
        comment: 'The 310 GSM weight feels substantial without trapping heat. The thicker neckline sits flat and elevates everyday trousers immediately.',
        purchasedSize: 'M',
        purchasedColor: 'Off-White',
        fitFeedback: 'Relaxed fit',
        dateLabel: 'Oct 18, 2026',
      },
      {
        id: 'rev-102',
        author: 'Tariq H.',
        city: 'Karachi',
        rating: 5,
        title: 'Best boxy cut in my rotation',
        comment: 'Sleeve length hits right above the elbow and the hem falls cleanly at the hip. Ordered Off-White first and came back for Obsidian Black.',
        purchasedSize: 'L',
        purchasedColor: 'Obsidian Black',
        fitFeedback: 'True to size',
        dateLabel: 'Sep 29, 2026',
      },
    ],
  },
  {
    id: 'prod-02',
    slug: 'heavyweight-loopback-boxy-hoodie',
    name: 'Heavyweight Loopback Boxy Hoodie',
    shortCategory: 'Premium Hoodies',
    gender: 'Men',
    collections: ['Men', 'Premium Hoodies', 'Streetwear', 'Winter Collection'],
    priceCents: 13800,
    image: prodPremiumHoodie,
    imageAlt: 'Model wearing a structured charcoal-black loopback cotton boxy hoodie with double-layer drawcord-free hood',
    silhouette: 'hoodie',
    description:
      'Engineered with a drawcord-free double-lined hood that frames the collarbone cleanly, this boxy pullover is crafted from diagonal-weave 480 GSM unbrushed loopback French terry. Concealed side-seam pockets preserve an uninterrupted front silhouette.',
    fabricSpec: '100% Combed Organic Cotton French Terry',
    weightSpec: '480 GSM diagonal-weave loopback',
    fitNotes: 'Slightly cropped waist rib with generous chest room and structured Raglan-inspired shoulder drop.',
    careInstructions: 'Cold wash at 30°C with mild detergent. Do not tumble dry.',
    origin: 'Crafted in Guimarães, Portugal',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    soldOutSizes: ['XS'],
    colors: [
      { name: 'Obsidian Black', hex: '#141414', inStock: true },
      { name: 'Stone Taupe', hex: '#8B8378', inStock: true },
      { name: 'Oat Beige', hex: '#D8C7AD', inStock: true },
    ],
    isNewArrival: false,
    isBestSeller: true,
    createdAtOrder: 6,
    reviews: [
      {
        id: 'rev-201',
        author: 'Bilal K.',
        city: 'Islamabad',
        rating: 5,
        title: 'Architectural hood and zero bulk at the waist',
        comment: 'Skipping the drawstrings makes this look tailored enough to wear under a wool overcoat. Side-seam pockets keep the front completely clean.',
        purchasedSize: 'L',
        purchasedColor: 'Obsidian Black',
        fitFeedback: 'True to size',
        dateLabel: 'Oct 22, 2026',
      },
    ],
  },
  {
    id: 'prod-03',
    slug: 'organic-poplin-relaxed-shirt',
    name: 'Organic Poplin Relaxed Shirt',
    shortCategory: 'Casual Shirts',
    gender: 'Women',
    collections: ['Women', 'Men', 'Casual Shirts', 'Summer Collection'],
    priceCents: 11200,
    salePriceCents: 9400,
    image: prodCasualShirt,
    imageAlt: 'Model wearing an oat-beige crisp organic cotton poplin button-down shirt with mother-of-pearl buttons',
    silhouette: 'shirt',
    description:
      'Woven at high yarn density for a dry, paper-crisp handfeel, our Relaxed Poplin Shirt balances menswear tailoring with effortless fluidity. Detailed with genuine smoked mother-of-pearl buttons, single-needle French side seams, and a curved gusseted hem.',
    fabricSpec: '100% High-Twist Organic Cotton Poplin',
    weightSpec: '135 GSM compact plain weave',
    fitNotes: 'Fluid relaxed cut across shoulders and torso. Designed to wear untucked or half-tucked into high-rise trousers.',
    careInstructions: 'Machine wash warm 30°C. Hang dry and steam while slightly damp.',
    origin: 'Woven in Como, Italy · Tailored in Romania',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    soldOutSizes: [],
    colors: [
      { name: 'Oat Beige', hex: '#D8C7AD', inStock: true },
      { name: 'Off-White', hex: '#F2EFE9', inStock: true },
      { name: 'Obsidian Black', hex: '#141414', inStock: true },
    ],
    isNewArrival: true,
    isBestSeller: false,
    createdAtOrder: 7,
    reviews: [
      {
        id: 'rev-301',
        author: 'Ayesha R.',
        city: 'Karachi',
        rating: 5,
        title: 'Crisp Italian poplin that breathes in warm weather',
        comment: 'The Oat Beige shade is understated and rich. Mother-of-pearl buttons and fine stitching feel right on par with European luxury houses.',
        purchasedSize: 'S',
        purchasedColor: 'Oat Beige',
        fitFeedback: 'True to size',
        dateLabel: 'Oct 14, 2026',
      },
    ],
  },
  {
    id: 'prod-04',
    slug: 'japanese-raw-selvedge-straight-jeans',
    name: 'Japanese Raw Selvedge Straight Jeans',
    shortCategory: 'Denim Jeans',
    gender: 'Men',
    collections: ['Men', 'Denim Jeans', 'Streetwear', 'Winter Collection'],
    priceCents: 16500,
    image: prodSelvedgeDenim,
    imageAlt: 'Washed vintage charcoal-black Japanese selvedge wide-straight denim jeans worn with black leather loafers',
    silhouette: 'denim',
    description:
      'Shuttle-loomed in Okayama from 13.5 oz rope-dyed cotton denim with a subtle mineral charcoal wash. Cut with a mid-to-high rise and a clean straight leg that stacks softly over loafers or sneakers, finished with matte oxidized copper rivets and chain-stitched hems.',
    fabricSpec: '100% Okayama Shuttle-Loomed Selvedge Cotton',
    weightSpec: '13.5 oz (455 GSM) red-line selvedge twill',
    fitNotes: 'Mid-high rise, relaxed straight leg from thigh to ankle. Non-stretch rigid cotton softens to your posture within five wears.',
    careInstructions: 'Spot clean or cold soak inside out to preserve indigo/charcoal depth. Line dry in shade.',
    origin: 'Denim woven in Okayama, Japan',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    soldOutSizes: ['XXL'],
    colors: [
      { name: 'Obsidian Black', hex: '#141414', inStock: true },
      { name: 'Raw Indigo', hex: '#232B38', inStock: true },
      { name: 'Off-White', hex: '#F2EFE9', inStock: false },
    ],
    isNewArrival: false,
    isBestSeller: true,
    createdAtOrder: 4,
    reviews: [
      {
        id: 'rev-401',
        author: 'Omar S.',
        city: 'Lahore',
        rating: 5,
        title: 'Proper 13.5 oz drape without feeling stiff',
        comment: 'Leg opening sits cleanly over derbies and sneakers alike. The washed black tone has subtle grain and zero artificial distressing.',
        purchasedSize: 'M',
        purchasedColor: 'Obsidian Black',
        fitFeedback: 'True to size',
        dateLabel: 'Oct 05, 2026',
      },
    ],
  },
  {
    id: 'prod-05',
    slug: 'double-faced-merino-belted-coat',
    name: 'Double-Faced Merino Belted Coat',
    shortCategory: 'Winter Collection',
    gender: 'Women',
    collections: ['Women', 'Winter Collection'],
    priceCents: 32000,
    salePriceCents: 27800,
    image: prodWoolCoat,
    imageAlt: 'Female model wearing an espresso-black double-faced merino wool belted trench coat over a cream knit turtleneck',
    silhouette: 'coat',
    description:
      'Hand-finished with invisible Blind-stitch seams so the interior is as refined as the exterior, this full-length wrap coat is tailored from unlined double-faced Australian merino wool. Features storm-flap lapels, horn-buckled cuff tabs, and a detachable self-tie waist belt.',
    fabricSpec: '90% Extrafine Merino Wool, 10% Cashmere',
    weightSpec: '620 GSM double-faced Melton weave',
    fitNotes: 'Generous wrap silhouette cut to layer effortlessly over chunky winter knitwear and blazers.',
    careInstructions: 'Specialist dry clean only. Brush gently along the nap with a soft garment brush between wears.',
    origin: 'Hand-finished atelier tailoring',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    soldOutSizes: ['XL', 'XXL'],
    colors: [
      { name: 'Espresso', hex: '#221C18', inStock: true },
      { name: 'Oat Beige', hex: '#D8C7AD', inStock: true },
      { name: 'Obsidian Black', hex: '#141414', inStock: true },
    ],
    isNewArrival: false,
    isBestSeller: true,
    createdAtOrder: 5,
    reviews: [
      {
        id: 'rev-501',
        author: 'Mehreen A.',
        city: 'Islamabad',
        rating: 5,
        title: 'Featherlight warmth and museum-grade seam work',
        comment: 'Because it is true double-faced wool without heavy synthetic lining, it drapes like liquid while keeping cold evening wind out.',
        purchasedSize: 'S',
        purchasedColor: 'Espresso',
        fitFeedback: 'True to size',
        dateLabel: 'Oct 26, 2026',
      },
    ],
  },
  {
    id: 'prod-06',
    slug: 'architectural-pleated-linen-dress',
    name: 'Architectural Pleated Linen Dress',
    shortCategory: 'Summer Collection',
    gender: 'Women',
    collections: ['Women', 'Summer Collection'],
    priceCents: 15400,
    image: prodLinenSet,
    imageAlt: 'Female model in an ecru pure Belgian linen sleeveless midi dress with sculpted waist box pleats',
    silhouette: 'dress',
    description:
      'Sculpted through the waist with directional knife pleats that release into an airy A-line midi skirt, crafted fromwashed Belgian flax linen. Fully lined through the bodice in breathable organic cotton voile with discreet side-seam pockets and a concealed back zip.',
    fabricSpec: '100% European Flax Linen · 100% Cotton Voile Bodice Lining',
    weightSpec: '195 GSM enzyme-washed flax weave',
    fitNotes: 'Fitted at natural waist with relaxed bust and flared midi skirt.',
    careInstructions: 'Cold gentle wash or dry clean. Steam lightly to maintain natural flax texture.',
    origin: 'Flax harvested in Normandy, France',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    soldOutSizes: [],
    colors: [
      { name: 'Off-White', hex: '#F2EFE9', inStock: true },
      { name: 'Obsidian Black', hex: '#141414', inStock: true },
      { name: 'Oat Beige', hex: '#D8C7AD', inStock: true },
    ],
    isNewArrival: true,
    isBestSeller: false,
    createdAtOrder: 9,
    reviews: [
      {
        id: 'rev-601',
        author: 'Sana N.',
        city: 'Karachi',
        rating: 5,
        title: 'Tailored waist pleats hold their shape all day',
        comment: 'Rare to find pure linen that looks this structured. The cotton voile lining means zero sheerness in bright daylight.',
        purchasedSize: 'M',
        purchasedColor: 'Off-White',
        fitFeedback: 'True to size',
        dateLabel: 'Oct 28, 2026',
      },
    ],
  },
  {
    id: 'prod-07',
    slug: 'matte-technical-cropped-blouson',
    name: 'Matte Technical Cropped Blouson',
    shortCategory: 'Streetwear',
    gender: 'Women',
    collections: ['Women', 'Men', 'Streetwear', 'Winter Collection'],
    priceCents: 18500,
    salePriceCents: 15800,
    image: prodStreetJacket,
    imageAlt: 'Model wearing a stone-taupe matte technical utility blouson jacket with dual bellows pockets and stand collar',
    silhouette: 'jacket',
    description:
      'Bridging utilitarian outerwear and minimal gallery proportion, this water-repellent blouson is cut from peached cotton-nylon faille with a storm placket, stand funnel collar, and architectural bellows chest pockets with tonal snap closures.',
    fabricSpec: '68% Organic Cotton, 32% Recycled Matte Polyamide (PFC-Free DWR)',
    weightSpec: '245 GSM weather-resistant peached faille',
    fitNotes: 'Boxy cropped length hitting at the high hip. Unisex block suitable for layered streetwear proportions.',
    careInstructions: 'Machine wash cold 30°C. Do not use fabric softener to preserve water-repellent finish.',
    origin: 'Technical mill fabric from South Korea',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    soldOutSizes: ['XS'],
    colors: [
      { name: 'Stone Taupe', hex: '#8B8378', inStock: true },
      { name: 'Obsidian Black', hex: '#141414', inStock: true },
    ],
    isNewArrival: true,
    isBestSeller: false,
    createdAtOrder: 10,
    reviews: [
      {
        id: 'rev-701',
        author: 'Hamza D.',
        city: 'Lahore',
        rating: 4,
        title: 'Matte cotton-like handfeel, zero synthetic shine',
        comment: 'Looks like brushed cotton gabardine but sheds light rain effortlessly. Cropped hem pairs cleanly with wide trousers.',
        purchasedSize: 'L',
        purchasedColor: 'Stone Taupe',
        fitFeedback: 'Relaxed fit',
        dateLabel: 'Nov 01, 2026',
      },
    ],
  },
  {
    id: 'prod-08',
    slug: 'sculpted-calfskin-minimalist-tote',
    name: 'Sculpted Calfskin Minimalist Tote',
    shortCategory: 'Accessories',
    gender: 'Unisex',
    collections: ['Accessories', 'Women', 'Men'],
    priceCents: 24500,
    image: prodLeatherTote,
    imageAlt: 'Architectural smooth black full-grain calfskin leather shoulder tote bag resting on a honed beige travertine block',
    silhouette: 'tote',
    description:
      'Constructed from vegetable-tanned full-grain Italian calfskin with hand-painted raw edges and reinforced tubular shoulder straps. Sized to house a 16-inch laptop alongside daily documents, complete with an internal zipped suede pouch and magnetic bridge closure.',
    fabricSpec: '100% Vegetable-Tanned Full-Grain Calfskin · Micro-Suede Interior',
    weightSpec: 'Dimensions: 38 cm W × 31 cm H × 14 cm D · Strap drop: 26 cm',
    fitNotes: 'One universal size (OS mapped across size selector for seamless ordering). Stands upright unassisted on a structured leather base.',
    careInstructions: 'Wipe with a soft dry cloth. Condition twice yearly with neutral leather balm.',
    origin: 'Handcrafted in Tuscany, Italy',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    soldOutSizes: [],
    colors: [
      { name: 'Obsidian Black', hex: '#141414', inStock: true },
      { name: 'Espresso', hex: '#221C18', inStock: true },
      { name: 'Oat Beige', hex: '#D8C7AD', inStock: false },
    ],
    isNewArrival: false,
    isBestSeller: true,
    createdAtOrder: 3,
    reviews: [
      {
        id: 'rev-801',
        author: 'Nadia F.',
        city: 'Karachi',
        rating: 5,
        title: 'Holds a 16-inch laptop without losing its clean geometry',
        comment: 'Zero loud hardware or logos—just supple full-grain leather and balanced proportions. Comfortable over coat shoulders too.',
        purchasedSize: 'M',
        purchasedColor: 'Obsidian Black',
        fitFeedback: 'True to size',
        dateLabel: 'Oct 19, 2026',
      },
    ],
  },
];

export interface TrendingCapsule {
  title: string;
  collection: FashionCollection;
  fabricNote: string;
  pieceCount: number;
  swatches: string[];
  description: string;
}

export const TRENDING_CAPSULES: TrendingCapsule[] = [
  {
    title: 'Heavyweight Jersey & Tees',
    collection: 'Oversized T-shirts',
    fabricNote: '310 GSM Organic Supima',
    pieceCount: 1,
    swatches: ['#F2EFE9', '#141414', '#D8C7AD', '#8B8378'],
    description: 'Architectural boxy silhouettes with 2.8 cm high-ribbed crew collars that hold structure wear after wear.',
  },
  {
    title: 'Loopback Fleece & Streetwear',
    collection: 'Streetwear',
    fabricNote: '480 GSM Terry & Matte Faille',
    pieceCount: 4,
    swatches: ['#141414', '#8B8378', '#D8C7AD'],
    description: 'Drawcord-free hoodies, cropped utility blousons, and wide-straight selvedge cuts built for urban movement.',
  },
  {
    title: 'Summer Linen & Poplin',
    collection: 'Summer Collection',
    fabricNote: '135–195 GSM Flax & High-Twist Cotton',
    pieceCount: 3,
    swatches: ['#F2EFE9', '#D8C7AD', '#141414'],
    description: 'Breathable European flax dresses and paper-crisp Italian poplin shirting tailored for warm climates.',
  },
  {
    title: 'Winter Merino & Denim',
    collection: 'Winter Collection',
    fabricNote: '620 GSM Double-Faced Wool & 13.5 oz Denim',
    pieceCount: 4,
    swatches: ['#221C18', '#141414', '#232B38', '#D8C7AD'],
    description: 'Hand-finished unlined merino-cashmere coats paired with shuttle-loomed Okayama raw selvedge jeans.',
  },
];

export interface BrandTestimonial {
  id: string;
  author: string;
  roleAndCity: string;
  quote: string;
  purchasedItem: string;
  purchasedSlug: string;
  avatarTone: string;
  initials: string;
}

export const BRAND_REVIEWS: BrandTestimonial[] = [
  {
    id: 'br-1',
    author: 'Mehreen Alvi',
    roleAndCity: 'Architect · Islamabad',
    quote:
      'Every seam on the Double-Faced Merino Coat is finished cleanly inside and out. Confirming my sizing with the concierge on WhatsApp before dispatch made ordering effortless.',
    purchasedItem: 'Double-Faced Merino Belted Coat · Size S',
    purchasedSlug: 'double-faced-merino-belted-coat',
    avatarTone: '#D8C7AD',
    initials: 'MA',
  },
  {
    id: 'br-2',
    author: 'Omar Siddiqui',
    roleAndCity: 'Creative Director · Lahore',
    quote:
      'Finally a minimalist label that gets fabric weight right. Both the 310 GSM Oversized Tee and 13.5 oz Okayama denim drape like pieces twice their price.',
    purchasedItem: 'Japanese Raw Selvedge Straight Jeans · Size M',
    purchasedSlug: 'japanese-raw-selvedge-straight-jeans',
    avatarTone: '#111111',
    initials: 'OS',
  },
  {
    id: 'br-3',
    author: 'Ayesha Rahman',
    roleAndCity: 'Editorial Stylist · Karachi',
    quote:
      'The Oat Beige Poplin Shirt and Calfskin Tote have become my daily studio uniform. Quiet proportions, zero loud branding, and prompt doorstep delivery.',
    purchasedItem: 'Organic Poplin Relaxed Shirt · Size S',
    purchasedSlug: 'organic-poplin-relaxed-shirt',
    avatarTone: '#595550',
    initials: 'AR',
  },
];

export function getEffectivePriceCents(product: Product): number {
  return typeof product.salePriceCents === 'number' && product.salePriceCents < product.priceCents
    ? product.salePriceCents
    : product.priceCents;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
