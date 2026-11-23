import React, { useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import type { ColorOption, Product } from '../lib/products';
import { EditorialImage } from './ui';

interface ProductGalleryProps {
  product: Product;
  activeColor: ColorOption;
}

type GalleryViewId = 'studio' | 'upper_detail' | 'lower_detail' | 'spec_plate';

interface GallerySlide {
  id: GalleryViewId;
  label: string;
}

const SLIDES: GallerySlide[] = [
  { id: 'studio', label: '01 · Full Studio Look' },
  { id: 'upper_detail', label: '02 · Collar & Shoulder Cut' },
  { id: 'lower_detail', label: '03 · Drape & Hem Finish' },
  { id: 'spec_plate', label: '04 · Textile & Fit Spec' },
];

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  product,
  activeColor,
}) => {
  const [activeSlide, setActiveSlide] = useState<GalleryViewId>('studio');
  const [isZoomed, setIsZoomed] = useState(false);
  const [pointerOrigin, setPointerOrigin] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPointerOrigin({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  };

  const renderMainStage = () => {
    if (activeSlide === 'spec_plate') {
      return (
        <div className="flex aspect-[3/4] w-full flex-col justify-between bg-surface p-6 sm:p-10">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-xs text-muted">KOVA Atelier Specification</p>
              <h3 className="mt-1 font-display text-xl text-foreground">{product.name}</h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                style={{ backgroundColor: activeColor.hex }}
                className="h-5 w-5 rounded-full border border-foreground/30"
              />
              <span className="text-xs font-medium text-foreground">{activeColor.name}</span>
            </div>
          </div>

          {/* Pure Geometric Silhouette Diagram */}
          <div className="my-6 flex flex-1 items-center justify-center">
            <svg
              viewBox="0 0 240 240"
              className="h-auto w-full max-w-[14rem] text-foreground"
              role="img"
              aria-label={`Architectural pattern block diagram for ${product.name}`}
            >
              <rect
                x="16"
                y="16"
                width="208"
                height="208"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.14"
                strokeDasharray="3 3"
              />
              {product.silhouette === 'tote' ? (
                <g fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M58 88 L182 88 L172 192 L68 192 Z" fill={activeColor.hex} fillOpacity="0.18" />
                  <path d="M92 88 C92 44, 148 44, 148 88" />
                  <line x1="74" y1="88" x2="80" y2="192" strokeOpacity="0.35" />
                  <line x1="166" y1="88" x2="160" y2="192" strokeOpacity="0.35" />
                </g>
              ) : product.silhouette === 'denim' ? (
                <g fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path
                    d="M78 42 L162 42 L170 202 L130 202 L120 96 L110 202 L70 202 Z"
                    fill={activeColor.hex}
                    fillOpacity="0.18"
                  />
                  <line x1="78" y1="54" x2="162" y2="54" strokeOpacity="0.5" />
                  <line x1="120" y1="42" x2="120" y2="96" strokeOpacity="0.5" />
                </g>
              ) : (
                <g fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path
                    d="M92 48 Q120 62 148 48 L194 78 L176 116 L156 104 L156 194 L84 194 L84 104 L64 116 L46 78 Z"
                    fill={activeColor.hex}
                    fillOpacity="0.18"
                  />
                  <line x1="84" y1="184" x2="156" y2="184" strokeOpacity="0.4" />
                  {(product.silhouette === 'shirt' ||
                    product.silhouette === 'coat' ||
                    product.silhouette === 'jacket') && (
                    <line x1="120" y1="55" x2="120" y2="194" strokeOpacity="0.45" />
                  )}
                </g>
              )}
            </svg>
          </div>

          <dl className="divide-y divide-border border-t border-border text-xs">
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-muted">Fiber composition</dt>
              <dd className="text-right font-medium text-foreground">{product.fabricSpec}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-muted">Textile weight</dt>
              <dd className="text-right font-medium text-foreground tabular-nums">{product.weightSpec}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-muted">Provenance</dt>
              <dd className="text-right font-medium text-foreground">{product.origin}</dd>
            </div>
          </dl>
        </div>
      );
    }

    const cropTransformClass =
      activeSlide === 'upper_detail'
        ? 'scale-[1.38] origin-[50%_22%]'
        : activeSlide === 'lower_detail'
        ? 'scale-[1.38] origin-[50%_78%]'
        : '';

    return (
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsZoomed(false)}
        onClick={() => setIsZoomed((z) => !z)}
        className={`relative aspect-[3/4] w-full overflow-hidden bg-surface ${
          isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
        }`}
      >
        <div
          style={
            isZoomed
              ? {
                  transform: 'scale(1.75)',
                  transformOrigin: `${pointerOrigin.x}% ${pointerOrigin.y}%`,
                }
              : undefined
          }
          className="h-full w-full transition-transform duration-200 ease-out"
        >
          <EditorialImage
            src={product.image}
            alt={`${product.imageAlt} — ${
              SLIDES.find((s) => s.id === activeSlide)?.label || ''
            }`}
            fallbackTitle={product.name}
            priority
            className="h-full w-full"
            imgClassName={`transition-transform duration-500 ${cropTransformClass}`}
          />
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed((z) => !z);
          }}
          aria-label={isZoomed ? 'Exit image zoom' : 'Zoom into garment texture'}
          className="absolute bottom-4 right-4 inline-flex min-h-9 items-center gap-1.5 rounded-control border border-border bg-surface px-3 text-xs font-medium text-foreground hover:border-foreground"
        >
          {isZoomed ? (
            <>
              <ZoomOut className="h-3.5 w-3.5" />
              <span>Reset view</span>
            </>
          ) : (
            <>
              <ZoomIn className="h-3.5 w-3.5" />
              <span>Inspect weave</span>
            </>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border border-border bg-surface">{renderMainStage()}</div>

      {/* Multi-View Selector Strip */}
      <div
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-4"
        role="tablist"
        aria-label="Product gallery views"
      >
        {SLIDES.map((slide) => {
          const selected = activeSlide === slide.id;
          return (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => {
                setActiveSlide(slide.id);
                setIsZoomed(false);
              }}
              className={`flex flex-col items-start justify-between rounded-control border p-3 text-left transition-colors ${
                selected
                  ? 'border-foreground bg-foreground text-surface'
                  : 'border-border bg-surface text-foreground hover:border-foreground'
              }`}
            >
              <span className="text-xs font-medium leading-snug">{slide.label}</span>
              <span
                className={`mt-1 text-[11px] ${
                  selected ? 'text-surface/75' : 'text-muted'
                }`}
              >
                {slide.id === 'spec_plate' ? product.weightSpec.split(' ')[0] + ' GSM/oz' : activeColor.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
