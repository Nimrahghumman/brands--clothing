import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CAMPAIGN_ASSETS } from '../lib/products';
import { useStore } from '../lib/localStorage';
import { Button, EditorialImage } from './ui';

export const HeroSection: React.FC = () => {
  const { navigate } = useStore();

  return (
    <section aria-label="Seasonal Campaign" className="border-b border-border bg-background">
      {/* Desktop / Tablet Full-Bleed Editorial Frame */}
      <div className="relative mx-auto max-w-[120rem]">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-stretch">
          {/* Copy Column on Calm Plaster Ground */}
          <div className="order-2 lg:order-1 lg:col-span-5 flex flex-col justify-between bg-background px-4 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16 xl:px-16">
            <div className="text-xs font-medium text-muted">
              310 GSM Supima · 13.5 oz Okayama Denim · 620 GSM Merino
            </div>

            <div className="my-8 lg:my-12">
              <h1 className="font-display text-hero font-normal text-foreground tracking-tight">
                DRESS BEYOND ORDINARY
              </h1>
              <p className="mt-5 max-w-[30em] text-base sm:text-lg leading-relaxed text-muted">
                Discover timeless style. Designed for everyday confidence.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Button
                  tone="primary"
                  onClick={() => navigate('/shop')}
                  className="px-7"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button
                  tone="quiet"
                  onClick={() => navigate('/shop?filter=new')}
                >
                  New Arrivals
                </Button>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs text-muted">
              <span>Architectural Menswear &amp; Womenswear</span>
              <span className="tabular-nums">Sizes XS — XXL</span>
            </div>
          </div>

          {/* Primary Campaign Photograph */}
          <div className="order-1 lg:order-2 lg:col-span-7 border-b lg:border-b-0 lg:border-l border-border">
            <EditorialImage
              src={CAMPAIGN_ASSETS.hero.src}
              alt={CAMPAIGN_ASSETS.hero.alt}
              fallbackTitle="KOVA Autumn / Winter Atelier"
              priority
              className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[36rem]"
              imgClassName="object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
