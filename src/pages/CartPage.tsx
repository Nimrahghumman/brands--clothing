import React from 'react';
import { ArrowRight, MessageCircle, ShoppingBag } from 'lucide-react';
import { useStore } from '../lib/localStorage';
import {
  calculateOrderTotals,
  FREE_SHIPPING_THRESHOLD_CENTS,
  formatMoney,
} from '../lib/utils';
import { buildConciergeInquiryUrl } from '../lib/whatsapp';
import { CartItem } from '../components/CartItem';
import { Button } from '../components/ui';

export const CartPage: React.FC = () => {
  const { cart, cartCount, preferences, clearCart, navigate } = useStore();
  const totals = calculateOrderTotals(cart);

  const progressPercent = Math.min(
    100,
    Math.round((totals.subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100)
  );

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-display text-foreground">
            Shopping bag ({cartCount})
          </h1>
          <p className="mt-1 text-sm text-muted">
            Review selected sizes, colors, and quantities before proceeding to delivery checkout.
          </p>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-medium text-muted underline hover:text-danger"
          >
            Empty bag
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="border border-border bg-surface px-6 py-20 text-center">
          <ShoppingBag className="mx-auto h-8 w-8 text-muted mb-4" />
          <h2 className="font-display text-2xl text-foreground">Your shopping bag is empty</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Your bag remains saved across refreshes once you add pieces from our collection.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button tone="primary" onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
            <Button tone="quiet" onClick={() => navigate('/wishlist')}>
              View Saved Wishlist
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left 8 Columns: Line Items */}
          <div className="lg:col-span-8 border border-border bg-surface px-6">
            <div className="divide-y divide-border">
              {cart.map((item) => (
                <CartItem key={item.variantKey} item={item} />
              ))}
            </div>
          </div>

          {/* Right 4 Columns: Sticky Totals */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start border border-border bg-surface p-6 sm:p-8">
            <h2 className="font-display text-2xl text-foreground pb-4 border-b border-border">
              Bag summary
            </h2>

            <div className="py-4 border-b border-border">
              <p className="text-xs text-muted">
                {totals.qualifiesForFreeShipping ? (
                  <span className="text-foreground font-medium">
                    Complimentary express courier shipping unlocked.
                  </span>
                ) : (
                  <span>
                    Add{' '}
                    <strong className="font-semibold text-foreground tabular-nums">
                      {formatMoney(
                        totals.remainingForFreeShippingCents,
                        preferences.currency
                      )}
                    </strong>{' '}
                    more for complimentary shipping.
                  </span>
                )}
              </p>
              <div className="mt-2 h-1 w-full bg-border overflow-hidden">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="h-full bg-foreground transition-all duration-300"
                />
              </div>
            </div>

            <dl className="mt-5 space-y-3 text-sm tabular-nums">
              <div className="flex justify-between text-muted">
                <dt>Subtotal</dt>
                <dd>{formatMoney(totals.subtotalCents, preferences.currency)}</dd>
              </div>
              <div className="flex justify-between text-muted">
                <dt>Shipping</dt>
                <dd>
                  {totals.shippingCents === 0
                    ? 'Complimentary'
                    : formatMoney(totals.shippingCents, preferences.currency)}
                </dd>
              </div>
              <div className="flex justify-between pt-3 border-t border-border text-base font-semibold text-foreground">
                <dt>Estimated Total</dt>
                <dd>{formatMoney(totals.totalCents, preferences.currency)}</dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                tone="primary"
                onClick={() => navigate('/checkout')}
                className="w-full"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                tone="quiet"
                onClick={() => navigate('/shop')}
                className="w-full"
              >
                Continue Shopping
              </Button>

              <a
                href={buildConciergeInquiryUrl('items in my shopping bag')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center justify-center gap-2 text-xs font-medium text-muted hover:text-foreground pt-2"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Ask sizing concierge on WhatsApp</span>
              </a>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
