import type { CartItemData } from './localStorage';
import type { GarmentSize } from './products';
import { calculateOrderTotals, formatMoney, type CurrencyCode } from './utils';

/**
 * Configurable brand WhatsApp number (E.164 digits without +).
 * Reads VITE_WHATSAPP_NUMBER when set, otherwise defaults to a clean valid number.
 */
const configuredEnvNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');
export const WHATSAPP_NUMBER = configuredEnvNumber.length >= 10 ? configuredEnvNumber : '923001234567';

export function formatWhatsAppDisplayNumber(raw: string = WHATSAPP_NUMBER): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('92') && digits.length === 12) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  return `+${digits}`;
}

export function buildWhatsAppUrl(message: string, phone: string = WHATSAPP_NUMBER): string {
  const cleanPhone = phone.replace(/\D/g, '') || WHATSAPP_NUMBER;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export interface CheckoutCustomerInput {
  fullName: string;
  phone: string;
  whatsapp: string;
  city: string;
  address: string;
  notes?: string;
  paymentMethod: 'cod' | 'bank_transfer';
}

export interface CheckoutValidationErrors {
  fullName?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  address?: string;
}

export function validateCheckoutForm(input: CheckoutCustomerInput): {
  valid: boolean;
  errors: CheckoutValidationErrors;
} {
  const errors: CheckoutValidationErrors = {};

  if (!input.fullName || input.fullName.trim().length < 2) {
    errors.fullName = 'Enter your full name (at least 2 characters) so our courier can address your parcel.';
  }

  const phoneDigits = (input.phone || '').replace(/\D/g, '');
  if (phoneDigits.length < 9 || phoneDigits.length > 15) {
    errors.phone = 'Enter a valid 9 to 15 digit phone number including area or country code.';
  }

  const waDigits = (input.whatsapp || '').replace(/\D/g, '');
  if (waDigits.length < 9 || waDigits.length > 15) {
    errors.whatsapp = 'Enter an active 9 to 15 digit WhatsApp number for order confirmation updates.';
  }

  if (!input.city || input.city.trim().length < 2) {
    errors.city = 'Enter your delivery city (for example, Lahore, Karachi, Islamabad, London, or Dubai).';
  }

  if (!input.address || input.address.trim().length < 10) {
    errors.address = 'Provide your complete street address, house or apartment number, and nearby landmark.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildCheckoutWhatsAppMessage(params: {
  orderReference: string;
  customer: CheckoutCustomerInput;
  items: CartItemData[];
  currency: CurrencyCode;
}): string {
  const { orderReference, customer, items, currency } = params;
  const totals = calculateOrderTotals(items);
  const paymentLabel =
    customer.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Direct Bank Transfer';

  const itemLines = items
    .map((item, idx) => {
      const unitStr = formatMoney(item.unitPriceCents, currency);
      const lineTotalStr = formatMoney(item.unitPriceCents * item.quantity, currency);
      return `${idx + 1}. ${item.name}\n   Size: ${item.size} | Color: ${item.color}\n   Qty: ${item.quantity} × ${unitStr} = ${lineTotalStr}`;
    })
    .join('\n\n');

  const shippingStr =
    totals.shippingCents === 0 ? 'Complimentary' : formatMoney(totals.shippingCents, currency);

  const lines = [
    `KOVA ATELIER — NEW ORDER (${orderReference})`,
    `--------------------------------`,
    `CUSTOMER DETAILS`,
    `Name: ${customer.fullName.trim()}`,
    `Phone: ${customer.phone.trim()}`,
    `WhatsApp: ${customer.whatsapp.trim()}`,
    `City: ${customer.city.trim()}`,
    `Delivery Address: ${customer.address.trim()}`,
    customer.notes?.trim() ? `Order Notes: ${customer.notes.trim()}` : null,
    ``,
    `ORDER ITEMS`,
    itemLines,
    ``,
    `ORDER SUMMARY`,
    `Subtotal: ${formatMoney(totals.subtotalCents, currency)}`,
    `Shipping: ${shippingStr}`,
    `Total Order Amount: ${formatMoney(totals.totalCents, currency)}`,
    `Payment Method: ${paymentLabel}`,
    `--------------------------------`,
    `Please confirm dispatch availability for my order.`,
  ].filter((line): line is string => line !== null);

  return lines.join('\n');
}

export function buildSingleProductWhatsAppMessage(params: {
  productName: string;
  size: GarmentSize;
  color: string;
  quantity: number;
  unitPriceCents: number;
  currency: CurrencyCode;
  customerName?: string;
  phone?: string;
  deliveryAddress?: string;
}): string {
  const totalCents = params.unitPriceCents * params.quantity;
  const shippingCents = totalCents >= 15000 ? 0 : 1200;
  const grandTotalCents = totalCents + shippingCents;

  const lines = [
    `KOVA ATELIER — DIRECT PRODUCT ORDER`,
    `--------------------------------`,
    `Product: ${params.productName}`,
    `Size: ${params.size}`,
    `Color: ${params.color}`,
    `Quantity: ${params.quantity}`,
    `Unit Price: ${formatMoney(params.unitPriceCents, params.currency)}`,
    `Shipping: ${shippingCents === 0 ? 'Complimentary' : formatMoney(shippingCents, params.currency)}`,
    `Total Order Amount: ${formatMoney(grandTotalCents, params.currency)}`,
    `--------------------------------`,
    `Customer Name: ${params.customerName?.trim() || 'Provided in chat'}`,
    `Phone Number: ${params.phone?.trim() || 'Provided in chat'}`,
    `Delivery Address: ${params.deliveryAddress?.trim() || 'Confirming in chat'}`,
  ];

  return lines.join('\n');
}

export function buildConciergeInquiryUrl(topic?: string): string {
  const greeting = topic
    ? `Hello KOVA Concierge, I have a question regarding ${topic}.`
    : `Hello KOVA Concierge, I would like assistance with sizing and current collection availability.`;
  return buildWhatsAppUrl(greeting);
}
