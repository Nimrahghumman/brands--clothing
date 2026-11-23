import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CAMPAIGN_ASSETS, PRODUCTS } from '../lib/products';
import { useStore } from '../lib/localStorage';
import { HeroSection } from '../components/HeroSection';
import { ProductGrid } from '../components/ProductGrid';
import { CategorySection } from '../components/CategorySection';
import { ReviewSection } from '../components/ReviewSection';
import { InstagramGallery } from '../components/InstagramGallery';
import { Newsletter } from '../components/Newsletter';
import { Button, EditorialImage } from '../components/ui';

export const HomePage: React.FC = () => {
  const { navigate } = useStore();

  const newArrivals = PRODUCTS.filter((p) => p.isNewArrival);
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller);

  return (
    <div>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. New Arrivals Section */}
      <section
        aria-labelledby="new-arrivals-heading"
        className="border-b border-border bg-background py-16 sm:py-24"
      >
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 id="new-arrivals-heading" className="font-display text-display text-foreground">
                New arrivals
              </h2>
              <p className="mt-2 max-w-[34em] text-sm sm:text-base text-muted">
                First-release silhouettes in heavyweight Supima jersey, crisp Italian poplin, and washed Belgian flax.
              </p>
            </div>
            <Button tone="quiet" onClick={() => navigate('/shop?filter=new')}>
              <span>View All New</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <ProductGrid products={newArrivals} />
        </div>
      </section>

      {/* 3. Men & Women Category Banners + Trending Collections */}
      <CategorySection />

      {/* 4. Best Sellers Section */}
      <section
        aria-labelledby="best-sellers-heading"
        className="border-b border-border bg-surface py-16 sm:py-24"
      >
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 id="best-sellers-heading" className="font-display text-display text-foreground">
                Signature wardrobe essentials
              </h2>
              <p className="mt-2 max-w-[34em] text-sm sm:text-base text-muted">
                Our most requested foundational garments—from Okayama 13.5 oz selvedge denim to hand-finished merino outerwear.
              </p>
            </div>
            <Button tone="quiet" onClick={() => navigate('/shop')}>
              <span>Shop Entire Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <ProductGrid products={bestSellers} />
        </div>
      </section>

      {/* 5. Promotional Banner */}
      <section
        aria-labelledby="promo-banner-heading"
        className="border-b border-border bg-background py-16 sm:py-24"
      >
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 border border-border bg-surface lg:grid-cols-12">
            <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-border">
              <EditorialImage
                src={CAMPAIGN_ASSETS.promoBanner.src}
                alt={CAMPAIGN_ASSETS.promoBanner.alt}
                fallbackTitle="Winter Merino & Cashmere Edit"
                className="aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[26rem]"
              />
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12">
              <p className="text-xs font-medium text-muted">
                Seasonal Archive · Limited Mill Allocation
              </p>

              <div className="my-8">
                <h2 id="promo-banner-heading" className="font-display text-display text-foreground">
                  Unlined merino &amp; winter layering
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted">
                  Tailored from 620 GSM double-faced Australian merino wool and 480 GSM loopback cotton. Enjoy seasonal reductions on select outerwear and shirting.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Button
                    tone="primary"
                    onClick={() => navigate('/shop?category=Winter%20Collection')}
                  >
                    <span>Explore Winter Edit</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    tone="quiet"
                    onClick={() => navigate('/shop?filter=sale')}
                  >
                    Seasonal Reductions
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted pt-4 border-t border-border">
                Complimentary courier delivery on orders above $150 · Cash on Delivery available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews */}
      <ReviewSection />

      {/* 7. Instagram-Style Lookbook Gallery */}
      <InstagramGallery />

      {/* 8. Newsletter Subscription */}
      <Newsletter />
    </div>
  );
};
