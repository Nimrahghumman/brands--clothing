import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CAMPAIGN_ASSETS, TRENDING_CAPSULES, ALL_COLLECTIONS } from '../lib/products';
import { useStore } from '../lib/localStorage';
import { Button, EditorialImage } from './ui';

export const CategorySection: React.FC = () => {
  const { navigate } = useStore();

  return (
    <>
      {/* Men & Women Editorial Category Banners */}
      <section aria-labelledby="categories-heading" className="border-b border-border bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 id="categories-heading" className="font-display text-display text-foreground">
                Tailored by department
              </h2>
              <p className="mt-2 max-w-[34em] text-sm sm:text-base text-muted">
                Architectural silhouettes cut from natural European flax, Japanese shuttle-loomed denim, and extrafine merino.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Men's Atelier Banner */}
            <div className="group flex flex-col border border-border bg-background">
              <a
                href="/shop?category=Men"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/shop?category=Men');
                }}
                className="block overflow-hidden"
              >
                <EditorialImage
                  src={CAMPAIGN_ASSETS.menBanner.src}
                  alt={CAMPAIGN_ASSETS.menBanner.alt}
                  fallbackTitle="Menswear Collection"
                  className="aspect-[3/4] sm:aspect-[4/5] w-full"
                  imgClassName="group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
              </a>
              <div className="flex items-center justify-between gap-4 p-6 sm:p-8 border-t border-border">
                <div className="min-w-0">
                  <h3 className="font-display text-2xl text-foreground">Menswear</h3>
                  <p className="mt-1 text-sm text-muted">
                    Oversized jersey, selvedge denim, loopback fleece &amp; relaxed shirting
                  </p>
                </div>
                <Button
                  tone="quiet"
                  onClick={() => navigate('/shop?category=Men')}
                  className="shrink-0"
                >
                  <span>Shop Men</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Women's Atelier Banner */}
            <div className="group flex flex-col border border-border bg-background">
              <a
                href="/shop?category=Women"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/shop?category=Women');
                }}
                className="block overflow-hidden"
              >
                <EditorialImage
                  src={CAMPAIGN_ASSETS.womenBanner.src}
                  alt={CAMPAIGN_ASSETS.womenBanner.alt}
                  fallbackTitle="Womenswear Collection"
                  className="aspect-[3/4] sm:aspect-[4/5] w-full"
                  imgClassName="group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
              </a>
              <div className="flex items-center justify-between gap-4 p-6 sm:p-8 border-t border-border">
                <div className="min-w-0">
                  <h3 className="font-display text-2xl text-foreground">Womenswear</h3>
                  <p className="mt-1 text-sm text-muted">
                    Double-faced merino coats, pleated flax linen &amp; sculpted leather goods
                  </p>
                </div>
                <Button
                  tone="quiet"
                  onClick={() => navigate('/shop?category=Women')}
                  className="shrink-0"
                >
                  <span>Shop Women</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Collection Section (Type-Led Architectural Capsules — Zero Repeated Photos) */}
      <section aria-labelledby="trending-heading" className="border-b border-border bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 id="trending-heading" className="font-display text-display text-foreground">
                Trending collections
              </h2>
              <p className="mt-2 max-w-[34em] text-sm sm:text-base text-muted">
                Explore our signature textile capsules engineered by weight, season, and silhouette.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_COLLECTIONS.slice(2).map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => navigate(`/shop?category=${encodeURIComponent(col)}`)}
                  className="min-h-9 whitespace-nowrap rounded-control border border-border bg-surface px-3.5 text-xs font-medium text-foreground transition-colors hover:border-foreground"
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRENDING_CAPSULES.map((capsule) => (
              <div
                key={capsule.title}
                className="flex flex-col justify-between border border-border bg-surface p-6 transition-colors hover:border-foreground"
              >
                <div>
                  <p className="text-xs text-muted">{capsule.fabricNote}</p>
                  <h3 className="mt-2 font-display text-xl text-foreground">
                    {capsule.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {capsule.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5" aria-label="Capsule color palette">
                    {capsule.swatches.map((hex, idx) => (
                      <span
                        key={`${capsule.title}-${idx}`}
                        style={{ backgroundColor: hex }}
                        className="h-4 w-4 rounded-control border border-foreground/20"
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/shop?category=${encodeURIComponent(capsule.collection)}`)
                    }
                    className="inline-flex min-h-9 items-center gap-1.5 whitespace-nowrap text-xs font-medium text-foreground hover:underline"
                  >
                    <span>Explore</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
