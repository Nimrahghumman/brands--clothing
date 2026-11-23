export type CurrencyCode = 'USD' | 'EUR' | 'PKR';

interface CurrencyConfig {
  code: CurrencyCode;
  locale: string;
  multiplierFromUsdCents: number;
  minorDivisor: number;
  maximumFractionDigits: number;
}

const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    locale: 'en-US',
    multiplierFromUsdCents: 1,
    minorDivisor: 100,
    maximumFractionDigits: 2,
  },
  EUR: {
    code: 'EUR',
    locale: 'de-DE',
    multiplierFromUsdCents: 0.92,
    minorDivisor: 100,
    maximumFractionDigits: 2,
  },
  PKR: {
    code: 'PKR',
    locale: 'en-PK',
    multiplierFromUsdCents: 278,
    minorDivisor: 100,
    maximumFractionDigits: 0,
  },
};

/**
 * Formats integer USD cents into exact currency output via Intl.NumberFormat.
 * Known test case: formatMoney(6800, 'USD') === '$68.00'
 * Invariant: calculateOrderTotals([{ unitPriceCents: 6800, quantity: 2 }]).totalCents === 13600 + 1200 = 14800
 */
export function formatMoney(usdCents: number, currency: CurrencyCode = 'USD'): string {
  const safeCents = Number.isFinite(usdCents) ? Math.max(0, Math.round(usdCents)) : 0;
  const cfg = CURRENCIES[currency] || CURRENCIES.USD;
  const convertedMajor = (safeCents * cfg.multiplierFromUsdCents) / cfg.minorDivisor;
  const roundedValue =
    cfg.maximumFractionDigits === 0 ? Math.round(convertedMajor) : convertedMajor;

  return new Intl.NumberFormat(cfg.locale, {
    style: 'currency',
    currency: cfg.code,
    minimumFractionDigits: cfg.maximumFractionDigits,
    maximumFractionDigits: cfg.maximumFractionDigits,
  }).format(roundedValue);
}

export const FREE_SHIPPING_THRESHOLD_CENTS = 15000; // $150.00
export const STANDARD_SHIPPING_CENTS = 1200; // $12.00

export interface LineAmountInput {
  unitPriceCents: number;
  quantity: number;
}

export interface OrderTotals {
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  remainingForFreeShippingCents: number;
  qualifiesForFreeShipping: boolean;
}

export function calculateOrderTotals(items: LineAmountInput[]): OrderTotals {
  const subtotalCents = items.reduce((sum, item) => {
    const qty = Number.isFinite(item.quantity) ? Math.max(0, Math.floor(item.quantity)) : 0;
    const price = Number.isFinite(item.unitPriceCents) ? Math.max(0, Math.round(item.unitPriceCents)) : 0;
    return sum + price * qty;
  }, 0);

  if (subtotalCents === 0) {
    return {
      subtotalCents: 0,
      shippingCents: 0,
      totalCents: 0,
      remainingForFreeShippingCents: FREE_SHIPPING_THRESHOLD_CENTS,
      qualifiesForFreeShipping: false,
    };
  }

  const qualifiesForFreeShipping = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
  const shippingCents = qualifiesForFreeShipping ? 0 : STANDARD_SHIPPING_CENTS;
  const totalCents = subtotalCents + shippingCents;
  const remainingForFreeShippingCents = Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents);

  return {
    subtotalCents,
    shippingCents,
    totalCents,
    remainingForFreeShippingCents,
    qualifiesForFreeShipping,
  };
}

export function clampQuantity(value: number, min = 1, max = 10): number {
  if (!Number.isFinite(value) || Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, Math.floor(value)));
}

export function formatLocalDate(year: number, month: number, day: number): string {
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function generateOrderReference(): string {
  const now = new Date();
  const stamp = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `KV-${stamp}-${randomDigits}`;
}
