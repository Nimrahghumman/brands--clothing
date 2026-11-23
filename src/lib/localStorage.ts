import { createContext, useContext } from 'react';
import type { GarmentSize, ProductReview } from './products';
import type { CurrencyCode } from './utils';

export interface CartItemData {
  variantKey: string; // `${productId}::${size}::${color}`
  productId: string;
  slug: string;
  name: string;
  image: string;
  imageAlt: string;
  size: GarmentSize;
  color: string;
  colorHex: string;
  unitPriceCents: number;
  originalPriceCents: number;
  quantity: number;
}

export interface VariantMemory {
  size?: GarmentSize;
  color?: string;
}

export interface SavedCustomerProfile {
  fullName: string;
  phone: string;
  whatsapp: string;
  city: string;
  address: string;
  paymentMethod: 'cod' | 'bank_transfer';
}

export interface CustomerPreferences {
  currency: CurrencyCode;
  preferredSize: GarmentSize;
  announcementDismissed: boolean;
  newsletterEmail: string | null;
  savedProfile: SavedCustomerProfile;
  productVariants: Record<string, VariantMemory>;
}

export const STORAGE_KEYS = {
  CART: 'kova.store.cart.v1',
  WISHLIST: 'kova.store.wishlist.v1',
  PREFS: 'kova.store.preferences.v1',
  REVIEWS: 'kova.store.reviews.v1',
} as const;

export const DEFAULT_PREFERENCES: CustomerPreferences = {
  currency: 'USD',
  preferredSize: 'M',
  announcementDismissed: false,
  newsletterEmail: null,
  savedProfile: {
    fullName: '',
    phone: '',
    whatsapp: '',
    city: '',
    address: '',
    paymentMethod: 'cod',
  },
  productVariants: {},
};

export function safeReadStorage<T>(key: string, fallback: T, validate?: (val: unknown) => val is T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (validate && !validate(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function safeWriteStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function isCartArray(val: unknown): val is CartItemData[] {
  return (
    Array.isArray(val) &&
    val.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as CartItemData).variantKey === 'string' &&
        typeof (item as CartItemData).productId === 'string' &&
        typeof (item as CartItemData).quantity === 'number' &&
        typeof (item as CartItemData).unitPriceCents === 'number'
    )
  );
}

export function isStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every((v) => typeof v === 'string');
}

export function isPreferencesObject(val: unknown): val is CustomerPreferences {
  return (
    typeof val === 'object' &&
    val !== null &&
    typeof (val as CustomerPreferences).currency === 'string' &&
    typeof (val as CustomerPreferences).preferredSize === 'string'
  );
}

export function isReviewsRecord(val: unknown): val is Record<string, ProductReview[]> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

export interface StoreContextValue {
  hydrated: boolean;
  cart: CartItemData[];
  cartCount: number;
  wishlist: string[];
  preferences: CustomerPreferences;
  customReviews: Record<string, ProductReview[]>;
  isCartDrawerOpen: boolean;
  statusMessage: string | null;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  announceStatus: (msg: string) => void;
  addToCart: (
    item: Omit<CartItemData, 'variantKey'>,
    options?: { openDrawer?: boolean }
  ) => void;
  updateCartQuantity: (variantKey: string, nextQuantity: number) => void;
  removeFromCart: (variantKey: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string, productName?: string) => void;
  isInWishlist: (productId: string) => boolean;
  setCurrency: (currency: CurrencyCode) => void;
  dismissAnnouncement: () => void;
  rememberVariant: (productId: string, variant: VariantMemory) => void;
  subscribeNewsletter: (email: string) => void;
  saveCustomerProfile: (profile: SavedCustomerProfile) => void;
  addProductReview: (productId: string, review: ProductReview) => void;
  navigate: (to: string) => void;
  currentPath: string;
  currentSearch: string;
}

export const StoreContext = createContext<StoreContextValue | null>(null);

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
