import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Instagram, X } from 'lucide-react';
import {
  getEffectivePriceCents,
  getProductBySlug,
  INSTAGRAM_GALLERY,
  type InstagramPost,
} from '../lib/products';
import { useStore } from '../lib/localStorage';
import { formatMoney } from '../lib/utils';
import { Button, EditorialImage } from './ui';

export const InstagramGallery: React.FC = () => {
  const { preferences, navigate } = useStore();
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);

  useEffect(() => {
    if (!selectedPost) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPost(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedPost]);

  const featuredProduct = selectedPost
    ? getProductBySlug(selectedPost.featuredProductSlug)
    : undefined;

  return (
    <section
      aria-labelledby="instagram-heading"
      className="border-b border-border bg-background py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 id="instagram-heading" className="font-display text-display text-foreground">
              In movement · @kova.atelier
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted">
              Daily dispatches from Paris, Milan, Tokyo, and Stockholm. Select a frame to shop the featured garment.
            </p>
          </div>
          <Button tone="quiet" onClick={() => navigate('/shop')}>
            <span>Shop Full Lookbook</span>
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {INSTAGRAM_GALLERY.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => setSelectedPost(post)}
              className="group relative flex flex-col border border-border bg-surface text-left transition-colors hover:border-foreground focus-visible:outline-2 focus-visible:outline-foreground"
            >
              <EditorialImage
                src={post.image}
                alt={post.alt}
                fallbackTitle={post.location}
                className="aspect-square w-full"
                imgClassName="group-hover:scale-[1.04] transition-transform duration-500 ease-out"
              />
              <div className="flex items-center justify-between gap-2 p-4 border-t border-border w-full">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground">{post.handle}</p>
                  <p className="text-xs text-muted truncate">{post.location}</p>
                </div>
                <Instagram className="h-4 w-4 text-muted group-hover:text-foreground shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Shop-the-Look Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ig-modal-title"
        >
          <div
            className="fixed inset-0 bg-foreground/55"
            onClick={() => setSelectedPost(null)}
            aria-hidden="true"
          />
          <div className="relative z-10 grid w-full max-w-2xl grid-cols-1 border border-border bg-surface sm:grid-cols-2">
            <EditorialImage
              src={selectedPost.image}
              alt={selectedPost.alt}
              fallbackTitle={selectedPost.location}
              className="aspect-square w-full border-b sm:border-b-0 sm:border-r border-border"
            />

            <div className="flex flex-col justify-between p-6">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 id="ig-modal-title" className="text-sm font-semibold text-foreground">
                      {selectedPost.handle}
                    </h3>
                    <p className="text-xs text-muted">{selectedPost.location}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPost(null)}
                    aria-label="Close lookbook preview"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-control hover:bg-background"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {selectedPost.caption}
                </p>
              </div>

              {featuredProduct && (
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-xs text-muted">Featured garment</p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {featuredProduct.name}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold tabular-nums text-foreground">
                    {formatMoney(
                      getEffectivePriceCents(featuredProduct),
                      preferences.currency
                    )}
                  </p>
                  <div className="mt-4">
                    <Button
                      tone="primary"
                      onClick={() => {
                        const slug = featuredProduct.slug;
                        setSelectedPost(null);
                        navigate(`/product/${slug}`);
                      }}
                      className="w-full"
                    >
                      View Garment
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
