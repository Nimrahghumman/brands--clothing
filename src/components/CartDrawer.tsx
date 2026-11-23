import React, { useEffect } from 'react';
import { ArrowRight, ShoppingBag, X } from 'lucide-react';
import { useStore } from '../lib/localStorage';
import {
  calculateOrderTotals,
  FREE_SHIPPING_THRESHOLD_CENTS,
  formatMoney,
} from '../lib/utils';
import { CartItem } from './CartItem';
import { Button } from './ui';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    preferences,
    isCartDrawerOpen,
    closeCartDrawer,
    navigate,
  } = useStore();

  useEffect(() => {
    if (!isCartDrawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCartDrawer();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCartDrawerOpen, closeCartDrawer]);

  if (!isCartDrawerOpen) return null;

  const totals = calculateOrderTotals(cart);
  const progressPercent = Math.min(
    100,
    Math.round((totals.subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100)
  );

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <div
        className="fixed inset-0 bg-foreground/45"
        onClick={closeCartDrawer}
        aria-hidden="true"
      />

      <aside className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-border bg-surface">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <h2 id="cart-drawer-title" className="font-display text-2xl text-foreground">
            Shopping Bag ({cartCount})
          </h2>
          <button
            type="button"
            onClick={closeCartDrawer}
            aria-label="Close shopping bag"
            className="inline-flex h-10 w-10 items-center justify-center rounded-control text-foreground hover:bg-background"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        {cart.length > 0 && (
          <div className="border-b border-border bg-background px-6 py-3">
            <p className="text-xs text-foreground">
              {totals.qualifiesForFreeShipping ? (
                <span>Complimentary express shipping unlocked.</span>
              ) : (
                <span>
                  Add{' '}
                  <strong className="font-semibold tabular-nums">
                    {formatMoney(totals.remainingForFreeShippingCents, preferences.currency)}
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
        )}

        {/* Items List */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="h-8 w-8 text-muted mb-4" />
              <h3 className="font-display text-2xl text-foreground">Your bag is empty</h3>
              <p className="mt-2 max-w-xs text-sm text-muted">
                Explore our heavyweight jersey, Italian poplin, and Okayama denim essentials.
              </p>
              <div className="mt-6">
                <Button
                  tone="primary"
                  onClick={() => {
                    closeCartDrawer();
                    navigate('/shop');
                  }}
                >
                  Explore Collection
                </Button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {cart.map((item) => (
                <CartItem key={item.variantKey} item={item} compact />
              ))}
            </div>
          )}
        </div>

        {/* Totals & Checkout Footer */}
        {cart.length > 0 && (
          <div className="border-t border-border bg-surface p-6">
            <dl className="space-y-2 text-sm tabular-nums">
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
              <div className="flex justify-between border-t border-border pt-3 text-base font-semibold text-foreground">
                <dt>Total</dt>
                <dd>{formatMoney(totals.totalCents, preferences.currency)}</dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-col gap-2.5">
              <Button
                tone="primary"
                onClick={() => {
                  closeCartDrawer();
                  navigate('/checkout');
                }}
                className="w-full"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                tone="quiet"
                onClick={() => {
                  closeCartDrawer();
                  navigate('/cart');
                }}
                className="w-full"
              >
                View Full Shopping Bag
              </Button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
