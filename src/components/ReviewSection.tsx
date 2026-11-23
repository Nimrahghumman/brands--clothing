import React from 'react';
import { Star } from 'lucide-react';
import { BRAND_REVIEWS } from '../lib/products';
import { useStore } from '../lib/localStorage';

const StylizedPortraitAvatar: React.FC<{ tone: string; index: number; name: string }> = ({
  tone,
  index,
  name,
}) => (
  <svg
    viewBox="0 0 48 48"
    className="h-11 w-11 shrink-0 rounded-full border border-border bg-background"
    role="img"
    aria-label={`Stylized portrait illustration for ${name}`}
  >
    <rect width="48" height="48" fill="#F5F1E9" />
    {/* Minimalist editorial line-art portrait silhouette */}
    <circle cx="24" cy="18" r="8" fill={tone} fillOpacity="0.85" />
    {index === 0 && (
      <path
        d="M15 18 C15 10, 33 10, 33 18 C33 22, 31 25, 30 26 L18 26 C17 25, 15 22, 15 18 Z"
        fill="none"
        stroke="#111111"
        strokeWidth="1.2"
      />
    )}
    {index === 1 && (
      <path
        d="M17 15 C19 11, 29 11, 31 15"
        fill="none"
        stroke="#F5F1E9"
        strokeWidth="1.5"
      />
    )}
    {index === 2 && (
      <circle cx="24" cy="18" r="9.5" fill="none" stroke="#111111" strokeWidth="1" />
    )}
    <path
      d="M10 44 C11 33, 17 29, 24 29 C31 29, 37 33, 38 44 Z"
      fill={tone}
    />
  </svg>
);

export const ReviewSection: React.FC = () => {
  const { navigate } = useStore();

  return (
    <section
      aria-labelledby="client-reviews-heading"
      className="border-b border-border bg-surface py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl mb-12">
          <h2 id="client-reviews-heading" className="font-display text-display text-foreground">
            Worn &amp; reviewed by our clients
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted">
            Notes on fabric weight, tailoring proportions, and concierge ordering from wardrobes across the region.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {BRAND_REVIEWS.map((review, idx) => (
            <article
              key={review.id}
              className="flex flex-col justify-between border border-border bg-background p-6 sm:p-8"
            >
              <div>
                <div className="flex items-center gap-1 text-foreground" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-foreground" />
                  ))}
                </div>

                <blockquote className="mt-4 text-sm sm:text-base leading-relaxed text-foreground">
                  “{review.quote}”
                </blockquote>
              </div>

              <div className="mt-6 pt-5 border-t border-border">
                <div className="flex items-center gap-3.5">
                  <StylizedPortraitAvatar
                    tone={review.avatarTone}
                    index={idx}
                    name={review.author}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{review.author}</p>
                    <p className="text-xs text-muted">{review.roleAndCity}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <a
                    href={`/product/${review.purchasedSlug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/product/${review.purchasedSlug}`);
                    }}
                    className="text-xs font-medium text-muted underline hover:text-foreground"
                  >
                    {review.purchasedItem}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
