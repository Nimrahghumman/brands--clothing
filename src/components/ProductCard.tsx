import React, { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import {
  getEffectivePriceCents,
  type GarmentSize,
  type Product,
} from '../lib/products';
import { useStore } from '../lib/localStorage';
import { formatMoney } from '../lib/utils';
import { EditorialImage } from './ui';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    preferences,
    addToCart,
    toggleWishlist,
    isInWishlist,
    rememberVariant,
    navigate,
  } = useStore();

  const savedVariant = preferences.productVariants[product.id];
  const initialAvailableSize: GarmentSize =
    savedVariant?.size && !product.soldOutSizes.includes(savedVariant.size)
      ? savedVariant.size
      : !product.soldOutSizes.includes(preferences.preferredSize)
      ? preferences.preferredSize
      : product.sizes.find((s) => !product.soldOutSizes.includes(s)) || 'M';

  const initialAvailableColor =
    savedVariant?.color &&
    product.colors.some((c) => c.name === savedVariant.color && c.inStock)
      ? savedVariant.color
      : product.colors.find((c) => c.inStock)?.name || product.colors[0].name;

  const [selectedSize, setSelectedSize] = useState<GarmentSize>(initialAvailableSize);
  const [selectedColor, setSelectedColor] = useState<string>(initialAvailableColor);

  const wishlisted = isInWishlist(product.id);
  const effectivePrice = getEffectivePriceCents(product);
  const hasSale =
    typeof product.salePriceCents === 'number' &&
    product.salePriceCents < product.priceCents;

  const activeColorObj =
    product.colors.find((c) => c.name === selectedColor) || product.colors[0];
  const isVariantSoldOut =
    product.soldOutSizes.includes(selectedSize) || !activeColorObj.inStock;

  const handleProductClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(`/product/${product.slug}`);
  };

  const handleSizeSelect = (size: GarmentSize) => {
    setSelectedSize(size);
    rememberVariant(product.id, { size, color: selectedColor });
  };

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    rememberVariant(product.id, { size: selectedSize, color: colorName });
  };

  const handleQuickAdd = () => {
    if (isVariantSoldOut) return;
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      imageAlt: product.imageAlt,
      size: selectedSize,
      color: activeColorObj.name,
      colorHex: activeColorObj.hex,
      unitPriceCents: effectivePrice,
      originalPriceCents: product.priceCents,
      quantity: 1,
    });
  };

  return (
    <article className="group flex flex-col border border-border bg-surface transition-colors hover:border-foreground/50">
      {/* 3:4 Portrait Image Container */}
      <div className="relative">
        <a
          href={`/product/${product.slug}`}
          onClick={handleProductClick}
          className="block focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-foreground"
        >
          <EditorialImage
            src={product.image}
            alt={product.imageAlt}
            fallbackTitle={product.name}
            className="aspect-[3/4] w-full"
            imgClassName="group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
        </a>

        {/* Wishlist Toggle Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id, product.name)}
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
          aria-pressed={wishlisted}
          className="absolute top-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-control border border-border bg-surface text-foreground transition-colors hover:border-foreground focus-visible:outline-2 focus-visible:outline-foreground"
        >
          <Heart
            className={`h-4 w-4 ${
              wishlisted ? 'fill-foreground text-foreground' : 'text-foreground'
            }`}
          />
        </button>
      </div>

      {/* Consistent Card Body */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div className="min-w-0">
          {/* Scoped Category Label + Status */}
          <p className="text-xs text-muted">
            {product.gender} · {product.shortCategory}
            {hasSale ? (
              <span className="text-foreground font-medium"> · Seasonal Reduction</span>
            ) : product.isNewArrival ? (
              <span> · New Arrival</span>
            ) : null}
          </p>

          <h3 className="mt-1.5 text-base font-medium leading-snug text-foreground">
            <a
              href={`/product/${product.slug}`}
              onClick={handleProductClick}
              className="hover:underline focus-visible:outline-2 focus-visible:outline-foreground"
            >
              {product.name}
            </a>
          </h3>

          {/* Price Row */}
          <div className="mt-2 flex items-baseline gap-2.5 tabular-nums">
            <span className="text-sm font-semibold text-foreground">
              {formatMoney(effectivePrice, preferences.currency)}
            </span>
            {hasSale && (
              <span className="text-xs text-muted line-through">
                {formatMoney(product.priceCents, preferences.currency)}
              </span>
            )}
          </div>
        </div>

        {/* Interactive Variants + Add to Bag */}
        <div className="mt-4 pt-3.5 border-t border-border flex flex-col gap-3">
          {/* Color Swatches */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Select color">
              {product.colors.map((color) => {
                const isSelected = color.name === selectedColor;
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => handleColorSelect(color.name)}
                    aria-label={`${color.name}${color.inStock ? '' : ' (Sold out)'}`}
                    aria-pressed={isSelected}
                    title={color.inStock ? color.name : `${color.name} — Sold out`}
                    style={{ backgroundColor: color.hex }}
                    className={`relative h-5 w-5 rounded-full border transition-transform ${
                      isSelected
                        ? 'ring-2 ring-foreground ring-offset-2 ring-offset-surface border-foreground/40 scale-105'
                        : 'border-foreground/25 hover:scale-105'
                    } ${!color.inStock ? 'opacity-35' : ''}`}
                  />
                );
              })}
            </div>
            <span className="text-xs text-muted truncate max-w-[8rem]" title={selectedColor}>
              {selectedColor}
            </span>
          </div>

          {/* Compact Size Selector */}
          <div className="flex flex-wrap gap-1" role="group" aria-label="Select size">
            {product.sizes.map((size) => {
              const soldOut = product.soldOutSizes.includes(size);
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  disabled={soldOut}
                  onClick={() => handleSizeSelect(size)}
                  aria-pressed={isSelected}
                  title={soldOut ? `${size} — Sold out` : `Size ${size}`}
                  className={`min-h-7 min-w-8 px-1.5 text-xs tabular-nums rounded-control border transition-colors whitespace-nowrap ${
                    soldOut
                      ? 'border-border/60 text-muted/50 line-through cursor-not-allowed'
                      : isSelected
                      ? 'border-foreground bg-foreground text-surface font-medium'
                      : 'border-border bg-surface text-foreground hover:border-foreground'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            disabled={isVariantSoldOut}
            onClick={handleQuickAdd}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-control border border-foreground bg-foreground px-3 text-xs font-medium text-surface transition-colors hover:bg-foreground/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:border-border disabled:bg-background disabled:text-muted disabled:cursor-not-allowed"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{isVariantSoldOut ? 'Sold out' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
