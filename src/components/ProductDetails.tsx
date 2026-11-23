import React, { useEffect, useState } from 'react';
import {
  Check,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  Ruler,
  ShoppingBag,
  Star,
  X,
} from 'lucide-react';
import {
  ALL_SIZES,
  getEffectivePriceCents,
  PRODUCTS,
  type GarmentSize,
  type Product,
  type ProductReview,
} from '../lib/products';
import { useStore } from '../lib/localStorage';
import {
  clampQuantity,
  formatLocalDate,
  formatMoney,
} from '../lib/utils';
import {
  buildSingleProductWhatsAppMessage,
  buildWhatsAppUrl,
  formatWhatsAppDisplayNumber,
} from '../lib/whatsapp';
import { ProductGallery } from './ProductGallery';
import { ProductGrid } from './ProductGrid';
import { Button, Field, inputBaseClasses } from './ui';

interface ProductDetailsProps {
  product: Product;
}

const SIZE_GUIDE_MEASUREMENTS: Array<{
  size: GarmentSize;
  chestCm: string;
  waistCm: string;
  shoulderCm: string;
  lengthCm: string;
}> = [
  { size: 'XS', chestCm: '86–90', waistCm: '70–74', shoulderCm: '45', lengthCm: '66' },
  { size: 'S', chestCm: '91–96', waistCm: '75–80', shoulderCm: '47', lengthCm: '68' },
  { size: 'M', chestCm: '97–102', waistCm: '81–86', shoulderCm: '49', lengthCm: '70' },
  { size: 'L', chestCm: '103–108', waistCm: '87–92', shoulderCm: '51', lengthCm: '72' },
  { size: 'XL', chestCm: '109–115', waistCm: '93–99', shoulderCm: '53', lengthCm: '74' },
  { size: 'XXL', chestCm: '116–122', waistCm: '100–106', shoulderCm: '55', lengthCm: '76' },
];

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const {
    preferences,
    customReviews,
    addToCart,
    toggleWishlist,
    isInWishlist,
    rememberVariant,
    addProductReview,
    navigate,
  } = useStore();

  const savedVariant = preferences.productVariants[product.id];

  const computeInitialSize = (): GarmentSize => {
    if (savedVariant?.size && !product.soldOutSizes.includes(savedVariant.size)) {
      return savedVariant.size;
    }
    if (!product.soldOutSizes.includes(preferences.preferredSize)) {
      return preferences.preferredSize;
    }
    return product.sizes.find((s) => !product.soldOutSizes.includes(s)) || 'M';
  };

  const computeInitialColor = (): string => {
    if (
      savedVariant?.color &&
      product.colors.some((c) => c.name === savedVariant.color && c.inStock)
    ) {
      return savedVariant.color;
    }
    return product.colors.find((c) => c.inStock)?.name || product.colors[0].name;
  };

  const [selectedSize, setSelectedSize] = useState<GarmentSize>(computeInitialSize);
  const [selectedColor, setSelectedColor] = useState<string>(computeInitialColor);
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);

  // Quick WhatsApp order optional details prefilled from saved customer profile
  const [waName, setWaName] = useState(preferences.savedProfile.fullName || '');
  const [waPhone, setWaPhone] = useState(preferences.savedProfile.phone || '');
  const [waAddress, setWaAddress] = useState(
    preferences.savedProfile.address
      ? `${preferences.savedProfile.address}${
          preferences.savedProfile.city ? `, ${preferences.savedProfile.city}` : ''
        }`
      : ''
  );
  const [copiedWaText, setCopiedWaText] = useState(false);

  // Review submission state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewFit, setReviewFit] = useState<'Runs small' | 'True to size' | 'Relaxed fit'>(
    'True to size'
  );
  const [reviewError, setReviewError] = useState('');

  // Reset local selections when navigating between products
  useEffect(() => {
    setSelectedSize(computeInitialSize());
    setSelectedColor(computeInitialColor());
    setQuantity(1);
    setSizeGuideOpen(false);
    setWhatsAppModalOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  // Close dialogs on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSizeGuideOpen(false);
        setWhatsAppModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const activeColorObj =
    product.colors.find((c) => c.name === selectedColor) || product.colors[0];
  const effectivePrice = getEffectivePriceCents(product);
  const hasSale =
    typeof product.salePriceCents === 'number' &&
    product.salePriceCents < product.priceCents;
  const savingsCents = hasSale ? product.priceCents - effectivePrice : 0;

  const isSizeSoldOut = product.soldOutSizes.includes(selectedSize);
  const isColorSoldOut = !activeColorObj.inStock;
  const isVariantUnavailable = isSizeSoldOut || isColorSoldOut;
  const wishlisted = isInWishlist(product.id);

  const handleSizeChange = (sz: GarmentSize) => {
    setSelectedSize(sz);
    rememberVariant(product.id, { size: sz, color: selectedColor });
  };

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    rememberVariant(product.id, { size: selectedSize, color: colorName });
  };

  const handleAddToCart = () => {
    if (isVariantUnavailable) return;
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
      quantity,
    });
  };

  const handleBuyNow = () => {
    if (isVariantUnavailable) return;
    addToCart(
      {
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
        quantity,
      },
      { openDrawer: false }
    );
    navigate('/checkout');
  };

  const directWhatsAppMessage = buildSingleProductWhatsAppMessage({
    productName: product.name,
    size: selectedSize,
    color: activeColorObj.name,
    quantity,
    unitPriceCents: effectivePrice,
    currency: preferences.currency,
    customerName: waName,
    phone: waPhone,
    deliveryAddress: waAddress,
  });

  const directWhatsAppUrl = buildWhatsAppUrl(directWhatsAppMessage);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(directWhatsAppMessage);
      setCopiedWaText(true);
      window.setTimeout(() => setCopiedWaText(false), 2500);
    } catch {
      setCopiedWaText(false);
    }
  };

  const allProductReviews: ProductReview[] = [
    ...(customReviews[product.id] || []),
    ...product.reviews,
  ];

  const averageRating =
    allProductReviews.length > 0
      ? (
          allProductReviews.reduce((sum, r) => sum + r.rating, 0) /
          allProductReviews.length
        ).toFixed(1)
      : '5.0';

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewAuthor.trim().length < 2 || reviewComment.trim().length < 10) {
      setReviewError('Please enter your name and at least 10 characters of feedback.');
      return;
    }
    const now = new Date();
    const newReview: ProductReview = {
      id: `rev-custom-${Date.now()}`,
      author: reviewAuthor.trim(),
      city: reviewCity.trim() || 'Verified Client',
      rating: reviewRating,
      title: reviewTitle.trim() || 'Impressive cut and textile quality',
      comment: reviewComment.trim(),
      purchasedSize: selectedSize,
      purchasedColor: activeColorObj.name,
      fitFeedback: reviewFit,
      dateLabel: formatLocalDate(now.getFullYear(), now.getMonth() + 1, now.getDate()),
    };
    addProductReview(product.id, newReview);
    setReviewAuthor('');
    setReviewCity('');
    setReviewTitle('');
    setReviewComment('');
    setReviewError('');
    setShowReviewForm(false);
  };

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id)
    .sort((a, b) => {
      const aShared = a.collections.filter((c) => product.collections.includes(c)).length;
      const bShared = b.collections.filter((c) => product.collections.includes(c)).length;
      return bShared - aShared;
    })
    .slice(0, 4);

  return (
    <div className="pb-24 lg:pb-12">
      {/* Breadcrumb Trail */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-[90rem] px-4 pt-6 sm:px-6 lg:px-10">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <li>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="hover:text-foreground"
            >
              Home
            </a>
          </li>
          <li>/</li>
          <li>
            <a
              href="/shop"
              onClick={(e) => {
                e.preventDefault();
                navigate('/shop');
              }}
              className="hover:text-foreground"
            >
              Shop
            </a>
          </li>
          <li>/</li>
          <li className="text-foreground font-medium">{product.name}</li>
        </ol>
      </nav>

      {/* Main Split: Gallery + Sticky Purchase Module */}
      <section className="mx-auto max-w-[90rem] px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left 7 Cols: Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery product={product} activeColor={activeColorObj} />
          </div>

          {/* Right 5 Cols: Sticky Purchase Module */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start border border-border bg-surface p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted">
                  {product.gender} · {product.shortCategory}
                </p>
                <h1 className="mt-1.5 font-display text-2xl sm:text-3xl text-foreground">
                  {product.name}
                </h1>
              </div>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id, product.name)}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={wishlisted}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-control border border-border bg-background text-foreground hover:border-foreground"
              >
                <Heart
                  className={`h-4 w-4 ${
                    wishlisted ? 'fill-foreground text-foreground' : ''
                  }`}
                />
              </button>
            </div>

            {/* Price & Availability */}
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3 pb-5 border-b border-border">
              <div className="flex items-baseline gap-3 tabular-nums">
                <span className="text-xl font-semibold text-foreground">
                  {formatMoney(effectivePrice, preferences.currency)}
                </span>
                {hasSale && (
                  <>
                    <span className="text-sm text-muted line-through">
                      {formatMoney(product.priceCents, preferences.currency)}
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      Save {formatMoney(savingsCents, preferences.currency)}
                    </span>
                  </>
                )}
              </div>

              <span className="text-xs font-medium text-muted">
                {isVariantUnavailable ? 'Selected option sold out' : 'In stock · Ready to dispatch'}
              </span>
            </div>

            {/* Description */}
            <p className="mt-5 text-sm leading-relaxed text-muted">{product.description}</p>

            {/* Color Selector */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-medium text-foreground">
                  Color: <span className="font-normal text-muted">{activeColorObj.name}</span>
                </span>
                {!activeColorObj.inStock && (
                  <span className="font-medium text-danger">Sold out in this shade</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="Color options">
                {product.colors.map((color) => {
                  const selected = color.name === selectedColor;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => handleColorChange(color.name)}
                      aria-pressed={selected}
                      className={`inline-flex min-h-10 items-center gap-2 rounded-control border px-3 text-xs transition-colors whitespace-nowrap ${
                        selected
                          ? 'border-foreground bg-background font-medium text-foreground'
                          : 'border-border bg-surface text-muted hover:border-foreground hover:text-foreground'
                      }`}
                    >
                      <span
                        style={{ backgroundColor: color.hex }}
                        className="h-3.5 w-3.5 rounded-full border border-foreground/30 shrink-0"
                      />
                      <span>{color.name}</span>
                      {!color.inStock && <span className="text-[11px] text-muted">(Sold out)</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector (XS - XXL) */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-medium text-foreground">
                  Size: <span className="font-normal text-muted tabular-nums">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-foreground underline hover:text-muted"
                >
                  <Ruler className="h-3.5 w-3.5" />
                  <span>Size guide</span>
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2" role="group" aria-label="Size options">
                {ALL_SIZES.map((sz) => {
                  const soldOut = product.soldOutSizes.includes(sz);
                  const selected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      disabled={soldOut}
                      onClick={() => handleSizeChange(sz)}
                      aria-pressed={selected}
                      className={`min-h-11 rounded-control border text-xs tabular-nums transition-colors whitespace-nowrap ${
                        soldOut
                          ? 'border-border/60 bg-background/50 text-muted/50 cursor-not-allowed line-through'
                          : selected
                          ? 'border-foreground bg-foreground text-surface font-semibold'
                          : 'border-border bg-surface text-foreground hover:border-foreground'
                      }`}
                    >
                      {soldOut ? `${sz} · Out` : sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="text-xs font-medium text-foreground">Quantity</span>
              <div className="inline-flex items-center border border-border rounded-control bg-background">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => clampQuantity(q - 1, 1, 10))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="inline-flex h-10 w-10 items-center justify-center text-foreground hover:bg-surface disabled:opacity-40"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-medium tabular-nums text-foreground">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => clampQuantity(q + 1, 1, 10))}
                  disabled={quantity >= 10}
                  aria-label="Increase quantity"
                  className="inline-flex h-10 w-10 items-center justify-center text-foreground hover:bg-surface disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Cart, Buy Now, Order on WhatsApp */}
            <div className="mt-6 flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  tone="primary"
                  disabled={isVariantUnavailable}
                  onClick={handleAddToCart}
                  className="w-full"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>{isVariantUnavailable ? 'Sold out' : 'Add to Cart'}</span>
                </Button>

                <Button
                  tone="secondary"
                  disabled={isVariantUnavailable}
                  onClick={handleBuyNow}
                  className="w-full"
                >
                  <span>Buy Now</span>
                </Button>
              </div>

              <Button
                tone="whatsapp"
                disabled={isVariantUnavailable}
                onClick={() => setWhatsAppModalOpen(true)}
                className="w-full"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Order on WhatsApp</span>
              </Button>
            </div>

            {/* Hairline Specifications */}
            <dl className="mt-8 divide-y divide-border border-t border-border text-xs">
              <div className="py-3">
                <dt className="font-medium text-foreground">Material &amp; Weave</dt>
                <dd className="mt-1 text-muted">
                  {product.fabricSpec} · {product.weightSpec}
                </dd>
              </div>
              <div className="py-3">
                <dt className="font-medium text-foreground">Fit &amp; Proportion</dt>
                <dd className="mt-1 text-muted">{product.fitNotes}</dd>
              </div>
              <div className="py-3">
                <dt className="font-medium text-foreground">Garment Care &amp; Origin</dt>
                <dd className="mt-1 text-muted">
                  {product.careInstructions} ({product.origin})
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Product Reviews Section */}
      <section
        aria-labelledby="product-reviews-heading"
        className="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:px-10 border-t border-border"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 id="product-reviews-heading" className="font-display text-display text-foreground">
              Client fit &amp; fabric impressions
            </h2>
            <p className="mt-1 text-sm text-muted tabular-nums">
              Rated {averageRating} out of 5 across {allProductReviews.length} verified client{' '}
              {allProductReviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          <Button tone="quiet" onClick={() => setShowReviewForm((v) => !v)}>
            {showReviewForm ? 'Close review form' : 'Write a review'}
          </Button>
        </div>

        {showReviewForm && (
          <form
            onSubmit={handleReviewSubmit}
            className="mb-10 border border-border bg-surface p-6 sm:p-8"
          >
            <h3 className="font-display text-xl text-foreground mb-5">
              Share your experience with {product.name}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Your name" htmlFor="rev-author" required>
                <input
                  id="rev-author"
                  type="text"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="e.g. Ayesha K."
                  className={inputBaseClasses}
                />
              </Field>

              <Field label="City" htmlFor="rev-city">
                <input
                  id="rev-city"
                  type="text"
                  value={reviewCity}
                  onChange={(e) => setReviewCity(e.target.value)}
                  placeholder="e.g. Lahore, Dubai, London"
                  className={inputBaseClasses}
                />
              </Field>

              <Field label="Rating" htmlFor="rev-rating">
                <select
                  id="rev-rating"
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className={inputBaseClasses}
                >
                  <option value={5}>5 Stars — Exceptional</option>
                  <option value={4}>4 Stars — Very good</option>
                  <option value={3}>3 Stars — Satisfactory</option>
                </select>
              </Field>

              <Field label="How did it fit?" htmlFor="rev-fit">
                <select
                  id="rev-fit"
                  value={reviewFit}
                  onChange={(e) =>
                    setReviewFit(
                      e.target.value as 'Runs small' | 'True to size' | 'Relaxed fit'
                    )
                  }
                  className={inputBaseClasses}
                >
                  <option value="True to size">True to size</option>
                  <option value="Relaxed fit">Relaxed / Generous fit</option>
                  <option value="Runs small">Runs slightly small</option>
                </select>
              </Field>

              <Field label="Headline" htmlFor="rev-title" className="sm:col-span-2">
                <input
                  id="rev-title"
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Summarize the drape, comfort, or tailoring"
                  className={inputBaseClasses}
                />
              </Field>

              <Field
                label="Review"
                htmlFor="rev-comment"
                required
                error={reviewError}
                className="sm:col-span-2"
              >
                <textarea
                  id="rev-comment"
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell fellow clients how the fabric feels and wears..."
                  className={inputBaseClasses}
                />
              </Field>
            </div>

            <div className="mt-5 flex justify-end">
              <Button type="submit" tone="primary">
                Publish Review
              </Button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {allProductReviews.map((rev) => (
            <article
              key={rev.id}
              className="flex flex-col justify-between border border-border bg-surface p-6"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-foreground" aria-label={`${rev.rating} out of 5 stars`}>
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-foreground" />
                    ))}
                  </div>
                  <span className="text-xs text-muted">{rev.dateLabel}</span>
                </div>

                <h3 className="mt-3 text-base font-semibold text-foreground">{rev.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{rev.comment}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                <span className="font-medium text-foreground">
                  {rev.author} · {rev.city}
                </span>
                <span>
                  Purchased {rev.purchasedSize} in {rev.purchasedColor} · {rev.fitFeedback}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Related Products Section */}
      <section
        aria-labelledby="related-heading"
        className="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:px-10 border-t border-border"
      >
        <div className="mb-8">
          <h2 id="related-heading" className="font-display text-display text-foreground">
            Complementary wardrobe pieces
          </h2>
          <p className="mt-1 text-sm text-muted">
            Designed in matching neutral tones to pair directly with {product.name}.
          </p>
        </div>

        <ProductGrid products={relatedProducts} />
      </section>

      {/* Sticky Mobile Purchase Bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface p-3 lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-foreground">{product.name}</p>
            <p className="text-xs text-muted tabular-nums">
              {formatMoney(effectivePrice, preferences.currency)} · {selectedSize} ·{' '}
              {activeColorObj.name}
            </p>
          </div>
          <Button
            tone="primary"
            disabled={isVariantUnavailable}
            onClick={handleAddToCart}
            className="px-4 min-h-10 shrink-0"
          >
            {isVariantUnavailable ? 'Sold out' : 'Add to Bag'}
          </Button>
        </div>
      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
        >
          <div
            className="fixed inset-0 bg-foreground/50"
            onClick={() => setSizeGuideOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-xl border border-border bg-surface p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h2 id="size-guide-title" className="font-display text-2xl text-foreground">
                Atelier Size &amp; Measurement Guide
              </h2>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                aria-label="Close size guide"
                className="inline-flex h-10 w-10 items-center justify-center rounded-control hover:bg-background"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-xs text-muted">{product.fitNotes}</p>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-xs tabular-nums border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted">
                    <th className="py-2.5 pr-4 uppercase tracking-wider font-medium">Size</th>
                    <th className="py-2.5 px-3 uppercase tracking-wider font-medium">Chest (cm)</th>
                    <th className="py-2.5 px-3 uppercase tracking-wider font-medium">Waist (cm)</th>
                    <th className="py-2.5 px-3 uppercase tracking-wider font-medium">Shoulder (cm)</th>
                    <th className="py-2.5 pl-3 uppercase tracking-wider font-medium">Length (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {SIZE_GUIDE_MEASUREMENTS.map((row) => (
                    <tr
                      key={row.size}
                      className={
                        selectedSize === row.size ? 'bg-background font-semibold text-foreground' : ''
                      }
                    >
                      <td className="py-2.5 pr-4">{row.size}</td>
                      <td className="py-2.5 px-3">{row.chestCm}</td>
                      <td className="py-2.5 px-3">{row.waistCm}</td>
                      <td className="py-2.5 px-3">{row.shoulderCm}</td>
                      <td className="py-2.5 pl-3">{row.lengthCm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Direct WhatsApp Product Order Modal */}
      {whatsAppModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wa-direct-order-title"
        >
          <div
            className="fixed inset-0 bg-foreground/50"
            onClick={() => setWhatsAppModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-lg border border-border bg-surface p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h2 id="wa-direct-order-title" className="font-display text-2xl text-foreground">
                  Order on WhatsApp
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Concierge line: {formatWhatsAppDisplayNumber()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWhatsAppModalOpen(false)}
                aria-label="Close WhatsApp order modal"
                className="inline-flex h-10 w-10 items-center justify-center rounded-control hover:bg-background"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 pb-4 border-b border-border text-xs flex justify-between gap-4">
              <div>
                <p className="font-medium text-foreground">{product.name}</p>
                <p className="text-muted mt-0.5">
                  Size {selectedSize} · {activeColorObj.name} · Qty {quantity}
                </p>
              </div>
              <p className="font-semibold text-foreground tabular-nums shrink-0">
                {formatMoney(effectivePrice * quantity, preferences.currency)}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <Field label="Your Name (optional — included in message)" htmlFor="wa-quick-name">
                <input
                  id="wa-quick-name"
                  type="text"
                  autoComplete="name"
                  value={waName}
                  onChange={(e) => setWaName(e.target.value)}
                  placeholder="Full name"
                  className={inputBaseClasses}
                />
              </Field>

              <Field label="Phone Number (optional)" htmlFor="wa-quick-phone">
                <input
                  id="wa-quick-phone"
                  type="tel"
                  autoComplete="tel"
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className={inputBaseClasses}
                />
              </Field>

              <Field label="Delivery Address & City (optional)" htmlFor="wa-quick-addr">
                <input
                  id="wa-quick-addr"
                  type="text"
                  autoComplete="street-address"
                  value={waAddress}
                  onChange={(e) => setWaAddress(e.target.value)}
                  placeholder="House / Street / City"
                  className={inputBaseClasses}
                />
              </Field>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-control bg-whatsapp px-5 text-sm font-medium text-surface hover:brightness-95 whitespace-nowrap"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Send Order on WhatsApp</span>
              </a>

              <Button tone="quiet" onClick={handleCopyMessage}>
                {copiedWaText ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied</span>
                  </>
                ) : (
                  <span>Copy Order Text</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
