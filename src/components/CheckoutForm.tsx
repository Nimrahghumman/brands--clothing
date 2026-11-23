import React, { useState } from 'react';
import { Check, Copy, ExternalLink, MessageCircle, ShoppingBag } from 'lucide-react';
import { useStore } from '../lib/localStorage';
import {
  calculateOrderTotals,
  formatMoney,
  generateOrderReference,
} from '../lib/utils';
import {
  buildCheckoutWhatsAppMessage,
  buildWhatsAppUrl,
  formatWhatsAppDisplayNumber,
  validateCheckoutForm,
  type CheckoutValidationErrors,
} from '../lib/whatsapp';
import { Button, EditorialImage, Field, inputBaseClasses } from './ui';

export const CheckoutForm: React.FC = () => {
  const {
    cart,
    preferences,
    saveCustomerProfile,
    clearCart,
    announceStatus,
    navigate,
  } = useStore();

  const saved = preferences.savedProfile;

  const [fullName, setFullName] = useState(saved.fullName || '');
  const [phone, setPhone] = useState(saved.phone || '');
  const [whatsapp, setWhatsapp] = useState(saved.whatsapp || '');
  const [sameAsPhone, setSameAsPhone] = useState(
    Boolean(saved.phone && saved.phone === saved.whatsapp)
  );
  const [city, setCity] = useState(saved.city || '');
  const [address, setAddress] = useState(saved.address || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>(
    saved.paymentMethod || 'cod'
  );
  const [rememberDetails, setRememberDetails] = useState(true);
  const [errors, setErrors] = useState<CheckoutValidationErrors>({});

  // Confirmed order state
  const [confirmedOrder, setConfirmedOrder] = useState<{
    reference: string;
    whatsappUrl: string;
    messageText: string;
    totalFormatted: string;
    paymentMethod: 'cod' | 'bank_transfer';
  } | null>(null);
  const [copiedOrderText, setCopiedOrderText] = useState(false);

  const totals = calculateOrderTotals(cart);

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="border border-border bg-surface px-6 py-20 text-center">
        <ShoppingBag className="mx-auto h-8 w-8 text-muted mb-4" />
        <h2 className="font-display text-2xl text-foreground">Your bag is empty</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Add garments to your shopping bag before completing delivery and WhatsApp order confirmation.
        </p>
        <div className="mt-6">
          <Button tone="primary" onClick={() => navigate('/shop')}>
            Return to Shop
          </Button>
        </div>
      </div>
    );
  }

  if (confirmedOrder) {
    return (
      <div className="mx-auto max-w-2xl border border-border bg-surface p-6 sm:p-10">
        <div className="pb-6 border-b border-border">
          <p className="text-xs font-medium text-whatsapp">Order Prepared for Dispatch</p>
          <h2 className="mt-1.5 font-display text-3xl text-foreground">
            Order {confirmedOrder.reference}
          </h2>
          <p className="mt-2 text-sm text-muted">
            Your itemized order summary has been formatted for our WhatsApp concierge (
            {formatWhatsAppDisplayNumber()}). Send the prefilled message in WhatsApp to confirm immediate courier dispatch.
          </p>
        </div>

        <dl className="py-5 divide-y divide-border border-b border-border text-sm">
          <div className="flex justify-between py-2.5">
            <dt className="text-muted">Recipient</dt>
            <dd className="font-medium text-foreground">{fullName}</dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-muted">City &amp; Address</dt>
            <dd className="text-right font-medium text-foreground max-w-xs">
              {address}, {city}
            </dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-muted">Payment Method</dt>
            <dd className="font-medium text-foreground">
              {confirmedOrder.paymentMethod === 'cod'
                ? 'Cash on Delivery'
                : 'Direct Bank Transfer'}
            </dd>
          </div>
          <div className="flex justify-between py-2.5 tabular-nums">
            <dt className="text-muted">Order Total</dt>
            <dd className="font-semibold text-foreground">{confirmedOrder.totalFormatted}</dd>
          </div>
        </dl>

        {confirmedOrder.paymentMethod === 'bank_transfer' && (
          <div className="py-5 border-b border-border text-xs space-y-1 text-muted">
            <p className="font-semibold text-foreground">Bank Transfer Instructions</p>
            <p>Account Title: KOVA ATELIER APPAREL</p>
            <p className="tabular-nums">IBAN: PK36MEZN0002840104928174</p>
            <p>Share your transfer receipt directly in the WhatsApp thread with order reference {confirmedOrder.reference}.</p>
          </div>
        )}

        <div className="mt-6">
          <label htmlFor="wa-preview-box" className="block text-xs font-medium text-muted mb-2">
            Prefilled WhatsApp Order Message
          </label>
          <textarea
            id="wa-preview-box"
            readOnly
            rows={8}
            value={confirmedOrder.messageText}
            className="w-full rounded-control border border-border bg-background p-3.5 text-xs text-foreground leading-relaxed focus:outline-none"
          />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href={confirmedOrder.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-control bg-whatsapp px-6 text-sm font-medium text-surface hover:brightness-95 whitespace-nowrap"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Open WhatsApp to Confirm Order</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <Button
            tone="quiet"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(confirmedOrder.messageText);
                setCopiedOrderText(true);
                window.setTimeout(() => setCopiedOrderText(false), 2500);
              } catch {
                setCopiedOrderText(false);
              }
            }}
          >
            {copiedOrderText ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Message</span>
              </>
            )}
          </Button>
        </div>

        <div className="mt-6 pt-5 border-t border-border flex justify-between items-center">
          <button
            type="button"
            onClick={() => setConfirmedOrder(null)}
            className="text-xs text-muted underline hover:text-foreground"
          >
            Edit delivery details
          </button>

          <Button
            tone="ghost"
            onClick={() => {
              clearCart();
              navigate('/shop');
            }}
            className="text-xs"
          >
            Clear bag &amp; continue shopping
          </Button>
        </div>
      </div>
    );
  }

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (sameAsPhone) {
      setWhatsapp(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveWhatsapp = sameAsPhone ? phone : whatsapp;
    const customerInput = {
      fullName,
      phone,
      whatsapp: effectiveWhatsapp,
      city,
      address,
      notes,
      paymentMethod,
    };

    const validation = validateCheckoutForm(customerInput);
    if (!validation.valid) {
      setErrors(validation.errors);
      announceStatus('Please review the highlighted delivery fields.');
      return;
    }

    setErrors({});
    if (rememberDetails) {
      saveCustomerProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
        whatsapp: effectiveWhatsapp.trim(),
        city: city.trim(),
        address: address.trim(),
        paymentMethod,
      });
    }

    const orderReference = generateOrderReference();
    const messageText = buildCheckoutWhatsAppMessage({
      orderReference,
      customer: customerInput,
      items: cart,
      currency: preferences.currency,
    });
    const whatsappUrl = buildWhatsAppUrl(messageText);

    setConfirmedOrder({
      reference: orderReference,
      whatsappUrl,
      messageText,
      totalFormatted: formatMoney(totals.totalCents, preferences.currency),
      paymentMethod,
    });

    announceStatus(`Order ${orderReference} generated — ready to send via WhatsApp.`);

    // Trigger anchor click cleanly without window.open
    const anchor = document.createElement('a');
    anchor.href = whatsappUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
      {/* Left 7 Columns: Single-Column Validated Checkout Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="lg:col-span-7 border border-border bg-surface p-6 sm:p-8 space-y-8"
      >
        <div>
          <h2 className="font-display text-2xl text-foreground">Delivery details</h2>
          <p className="mt-1 text-sm text-muted">
            Provide your recipient contact and complete address for courier dispatch.
          </p>

          <div className="mt-6 space-y-5">
            <Field
              label="Full name"
              htmlFor="checkout-name"
              required
              error={errors.fullName}
            >
              <input
                id="checkout-name"
                name="name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Omar Siddiqui"
                className={inputBaseClasses}
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                label="Phone number"
                htmlFor="checkout-phone"
                required
                error={errors.phone}
              >
                <input
                  id="checkout-phone"
                  name="tel"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="+92 300 1234567"
                  className={inputBaseClasses}
                />
              </Field>

              <Field
                label="WhatsApp number"
                htmlFor="checkout-whatsapp"
                required
                error={errors.whatsapp}
              >
                <input
                  id="checkout-whatsapp"
                  name="whatsapp"
                  type="tel"
                  autoComplete="tel"
                  value={sameAsPhone ? phone : whatsapp}
                  disabled={sameAsPhone}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+92 300 1234567"
                  className={`${inputBaseClasses} disabled:opacity-60`}
                />
              </Field>
            </div>

            <div className="flex items-center gap-2.5">
              <input
                id="same-as-phone"
                type="checkbox"
                checked={sameAsPhone}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setSameAsPhone(checked);
                  if (checked) setWhatsapp(phone);
                }}
                className="h-4 w-4 accent-foreground"
              />
              <label htmlFor="same-as-phone" className="text-xs text-muted cursor-pointer">
                WhatsApp number is the same as phone number
              </label>
            </div>

            <Field
              label="City"
              htmlFor="checkout-city"
              required
              error={errors.city}
            >
              <input
                id="checkout-city"
                name="address-level2"
                type="text"
                autoComplete="address-level2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Lahore, Karachi, Islamabad, Dubai..."
                className={inputBaseClasses}
              />
            </Field>

            <Field
              label="Complete delivery address"
              htmlFor="checkout-address"
              required
              error={errors.address}
              hint="Include house or apartment number, street, sector/block, and nearby landmark."
            >
              <textarea
                id="checkout-address"
                name="street-address"
                rows={3}
                autoComplete="street-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House 14-B, Street 6, Phase 5..."
                className={inputBaseClasses}
              />
            </Field>

            <Field
              label="Delivery instructions (optional)"
              htmlFor="checkout-notes"
            >
              <input
                id="checkout-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Preferred delivery window or gate instructions"
                className={inputBaseClasses}
              />
            </Field>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="pt-6 border-t border-border">
          <h2 className="font-display text-2xl text-foreground">Payment method</h2>
          <p className="mt-1 text-sm text-muted">
            No online card entry required. Settle upon delivery or via bank transfer.
          </p>

          <div className="mt-5 divide-y divide-border border-y border-border">
            <label
              htmlFor="pay-cod"
              className="flex cursor-pointer items-start gap-3.5 py-4 transition-colors hover:bg-background/60"
            >
              <input
                id="pay-cod"
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="mt-1 h-4 w-4 accent-foreground"
              />
              <div>
                <span className="block text-sm font-medium text-foreground">
                  Cash on Delivery (COD)
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  Pay in cash directly to the courier upon receiving your sealed KOVA parcel.
                </span>
              </div>
            </label>

            <label
              htmlFor="pay-bank"
              className="flex cursor-pointer items-start gap-3.5 py-4 transition-colors hover:bg-background/60"
            >
              <input
                id="pay-bank"
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'bank_transfer'}
                onChange={() => setPaymentMethod('bank_transfer')}
                className="mt-1 h-4 w-4 accent-foreground"
              />
              <div>
                <span className="block text-sm font-medium text-foreground">
                  Bank Transfer
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  Receive our atelier IBAN details upon order generation and share transfer confirmation via WhatsApp.
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <input
              id="remember-profile"
              type="checkbox"
              checked={rememberDetails}
              onChange={(e) => setRememberDetails(e.target.checked)}
              className="h-4 w-4 accent-foreground"
            />
            <label htmlFor="remember-profile" className="text-xs text-muted cursor-pointer">
              Save my delivery details in this browser for faster future orders
            </label>
          </div>

          <Button type="submit" tone="whatsapp" className="w-full py-3.5 text-sm">
            <MessageCircle className="h-4 w-4" />
            <span>Place Order via WhatsApp</span>
          </Button>
        </div>
      </form>

      {/* Right 5 Columns: Sticky Order Summary */}
      <aside className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start border border-border bg-surface p-6 sm:p-8">
        <h2 className="font-display text-2xl text-foreground pb-4 border-b border-border">
          Order summary
        </h2>

        <div className="divide-y divide-border">
          {cart.map((item) => (
            <div key={item.variantKey} className="flex gap-3.5 py-4">
              <div className="w-16 shrink-0 bg-background">
                <EditorialImage
                  src={item.image}
                  alt={item.imageAlt}
                  fallbackTitle={item.name}
                  className="aspect-[3/4] w-full"
                />
              </div>
              <div className="min-w-0 flex-1 flex flex-col justify-between text-xs">
                <div>
                  <p className="font-medium text-foreground text-sm leading-snug">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-muted">
                    Size {item.size} · {item.color} · Qty {item.quantity}
                  </p>
                </div>
                <p className="mt-2 font-semibold text-foreground tabular-nums">
                  {formatMoney(item.unitPriceCents * item.quantity, preferences.currency)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <dl className="mt-4 pt-4 border-t border-border space-y-2.5 text-sm tabular-nums">
          <div className="flex justify-between text-muted">
            <dt>Subtotal</dt>
            <dd>{formatMoney(totals.subtotalCents, preferences.currency)}</dd>
          </div>
          <div className="flex justify-between text-muted">
            <dt>Express Courier Shipping</dt>
            <dd>
              {totals.shippingCents === 0
                ? 'Complimentary'
                : formatMoney(totals.shippingCents, preferences.currency)}
            </dd>
          </div>
          <div className="flex justify-between pt-3 border-t border-border text-base font-semibold text-foreground">
            <dt>Total</dt>
            <dd>{formatMoney(totals.totalCents, preferences.currency)}</dd>
          </div>
        </dl>

        <p className="mt-5 text-xs leading-relaxed text-muted">
          WhatsApp concierge line: <strong className="font-medium text-foreground">{formatWhatsAppDisplayNumber()}</strong>. Every parcel ships in recyclable garment wraps with 14-day size exchange eligibility.
        </p>
      </aside>
    </div>
  );
};
