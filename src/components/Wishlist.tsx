import React, { useState } from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import {
  getEffectivePriceCents,
  PRODUCTS,
  type GarmentSize,
  type Product,
} from '../lib/products';
import { useStore } from '../lib/localStorage';
import { formatMoney } from '../lib/utils';
import { Button, EditorialImage } from './ui';

const WishlistCard: React.FC<{ product: Product }> = ({ product }) => {
  const { preferences, addToCart, toggleWishlist, rememberVariant, navigate } = useStore();

  const savedVariant = preferences.productVariants[product.id];
  const initialSize: GarmentSize =
    savedVariant?.size && !product.soldOutSizes.includes(savedVariant.size)
      ? savedVariant.size
      : !product.soldOutSizes.includes(preferences.preferredSize)
      ? preferences.preferredSize
      : product.sizes.find((s) => !product.soldOutSizes.includes(s)) || 'M';

  const initialColor =
    savedVariant?.color &&
    product.colors.some((c) => c.name === savedVariant.color && c.inStock)
      ? savedVariant.color
      : product.colors.find((c) => c.inStock)?.name || product.colors[0].name;

  const [size, setSize] = useState<GarmentSize>(initialSize);
  const [colorName, setColorName] = useState<string>(initialColor);

  const colorObj = product.colors.find((c) => c.name === colorName) || product.colors[0];
  const effectivePrice = getEffectivePriceCents(product);

  const handleMoveToBag = () => {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      imageAlt: product.imageAlt,
      size,
      color: colorObj.name,
      colorHex: colorObj.hex,
      unitPriceCents: effectivePrice,
      originalPriceCents: product.priceCents,
      quantity: 1,
    });
  };

  return (
    <article className="flex flex-col border border-border bg-surface">
      <div className="relative">
        <a
          href={`/product/${product.slug}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/product/${product.slug}`);
          }}
          className="block"
        >
          <EditorialImage
            src={product.image}
            alt={product.imageAlt}
            fallbackTitle={product.name}
            className="aspect-[3/4] w-full"
          />
        </a>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id, product.name)}
          aria-label={`Remove ${product.name} from wishlist`}
          className="absolute top-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-control border border-border bg-surface text-foreground hover:text-danger"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <p className="text-xs text-muted">
            {product.gender} · {product.shortCategory}
          </p>
          <h3 className="mt-1 text-base font-medium text-foreground">
            <a
              href={`/product/${product.slug}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/product/${product.slug}`);
              }}
              className="hover:underline"
            >
              {product.name}
            </a>
          </h3>
          <p className="mt-1.5 text-sm font-semibold tabular-nums text-foreground">
            {formatMoney(effectivePrice, preferences.currency)}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-border space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor={`wl-size-${product.id}`} className="sr-only">
                Size
              </label>
              <select
                id={`wl-size-${product.id}`}
                value={size}
                onChange={(e) => {
                  const next = e.target.value as GarmentSize;
                  setSize(next);
                  rememberVariant(product.id, { size: next, color: colorName });
                }}
                className="min-h-9 w-full rounded-control border border-border bg-background px-2.5 text-xs text-foreground tabular-nums"
              >
                {product.sizes.map((sz) => {
                  const out = product.soldOutSizes.includes(sz);
                  return (
                    <option key={sz} value={sz} disabled={out}>
                      Size {sz} {out ? '(Sold out)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label htmlFor={`wl-color-${product.id}`} className="sr-only">
                Color
              </label>
              <select
                id={`wl-color-${product.id}`}
                value={colorName}
                onChange={(e) => {
                  const next = e.target.value;
                  setColorName(next);
                  rememberVariant(product.id, { size, color: next });
                }}
                className="min-h-9 w-full rounded-control border border-border bg-background px-2.5 text-xs text-foreground"
              >
                {product.colors.map((col) => (
                  <option key={col.name} value={col.name} disabled={!col.inStock}>
                    {col.name} {!col.inStock ? '(Out)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button tone="primary" onClick={handleMoveToBag} className="w-full min-h-10 text-xs">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Add to Bag</span>
          </Button>
        </div>
      </div>
    </article>
  );
};

export const Wishlist: React.FC = () => {
  const { wishlist, preferences, addToCart, navigate } = useStore();

  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    savedProducts.forEach((product) => {
      const savedVariant = preferences.productVariants[product.id];
      const sz =
        savedVariant?.size && !product.soldOutSizes.includes(savedVariant.size)
          ? savedVariant.size
          : product.sizes.find((s) => !product.soldOutSizes.includes(s)) || 'M';
      const col =
        product.colors.find((c) => c.name === savedVariant?.color && c.inStock) ||
        product.colors.find((c) => c.inStock) ||
        product.colors[0];

      addToCart(
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.image,
          imageAlt: product.imageAlt,
          size: sz,
          color: col.name,
          colorHex: col.hex,
          unitPriceCents: getEffectivePriceCents(product),
          originalPriceCents: product.priceCents,
          quantity: 1,
        },
        { openDrawer: true }
      );
    });
  };

  if (savedProducts.length === 0) {
    return (
      <div className="border border-border bg-surface px-6 py-20 text-center">
        <Heart className="mx-auto h-8 w-8 text-muted mb-4" />
        <h2 className="font-display text-2xl text-foreground">Your wishlist is empty</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Save favorite coats, heavyweight jersey tees, and tailored pieces while browsing to revisit them anytime.
        </p>
        <div className="mt-6">
          <Button tone="primary" onClick={() => navigate('/shop')}>
            Browse Collection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted tabular-nums">
          {savedProducts.length} saved {savedProducts.length === 1 ? 'piece' : 'pieces'}
        </p>
        <Button tone="quiet" onClick={handleAddAllToCart}>
          <ShoppingBag className="h-4 w-4" />
          <span>Add All to Bag</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {savedProducts.map((product) => (
          <WishlistCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
