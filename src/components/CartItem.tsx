import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useStore, type CartItemData } from '../lib/localStorage';
import { formatMoney } from '../lib/utils';
import { EditorialImage } from './ui';

interface CartItemProps {
  item: CartItemData;
  compact?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({ item, compact = false }) => {
  const { preferences, updateCartQuantity, removeFromCart, navigate } = useStore();

  const lineTotalCents = item.unitPriceCents * item.quantity;

  const handleTitleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(`/product/${item.slug}`);
  };

  return (
    <div className="flex gap-4 py-5">
      <a
        href={`/product/${item.slug}`}
        onClick={handleTitleClick}
        className={`shrink-0 bg-background ${
          compact ? 'w-20' : 'w-24 sm:w-28'
        }`}
      >
        <EditorialImage
          src={item.image}
          alt={item.imageAlt}
          fallbackTitle={item.name}
          className="aspect-[3/4] w-full"
        />
      </a>

      <div className="min-w-0 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-medium text-foreground leading-snug">
              <a
                href={`/product/${item.slug}`}
                onClick={handleTitleClick}
                className="hover:underline"
              >
                {item.name}
              </a>
            </h3>

            <button
              type="button"
              onClick={() => removeFromCart(item.variantKey)}
              aria-label={`Remove ${item.name} from bag`}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-control text-muted hover:text-danger focus-visible:outline-2 focus-visible:outline-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-1 flex items-center gap-2 text-xs text-muted">
            <span>Size {item.size}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5">
              <span
                style={{ backgroundColor: item.colorHex }}
                className="h-2.5 w-2.5 rounded-control border border-foreground/30"
              />
              <span>{item.color}</span>
            </span>
          </p>

          <p className="mt-1 text-xs text-muted tabular-nums">
            {formatMoney(item.unitPriceCents, preferences.currency)} each
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-control border border-border bg-background">
            <button
              type="button"
              onClick={() => updateCartQuantity(item.variantKey, item.quantity - 1)}
              aria-label={`Decrease quantity of ${item.name}`}
              className="inline-flex h-8 w-8 items-center justify-center text-foreground hover:bg-surface"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-xs font-medium tabular-nums text-foreground">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateCartQuantity(item.variantKey, item.quantity + 1)}
              aria-label={`Increase quantity of ${item.name}`}
              className="inline-flex h-8 w-8 items-center justify-center text-foreground hover:bg-surface"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <span className="text-sm font-semibold text-foreground tabular-nums">
            {formatMoney(lineTotalCents, preferences.currency)}
          </span>
        </div>
      </div>
    </div>
  );
};
