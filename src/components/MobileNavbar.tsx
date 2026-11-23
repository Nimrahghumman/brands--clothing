import React, { useEffect } from 'react';
import { ArrowRight, MessageCircle, X } from 'lucide-react';
import { useStore } from '../lib/localStorage';
import { ALL_COLLECTIONS } from '../lib/products';
import { buildConciergeInquiryUrl } from '../lib/whatsapp';

interface MobileNavbarProps {
  isOpen: boolean;
  onClose: () => void;
  links: ReadonlyArray<{ label: string; href: string }>;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({
  isOpen,
  onClose,
  links,
}) => {
  const { navigate, wishlist, cartCount } = useStore();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNav = (href: string) => {
    navigate(href);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      <div
        className="fixed inset-0 bg-foreground/45"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-surface border-r border-border">
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <span className="font-display text-2xl text-foreground">KOVA</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-control text-foreground hover:bg-background"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto divide-y divide-border px-5 py-4">
          <nav aria-label="Mobile primary links" className="flex flex-col gap-1 pb-5">
            {links.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNav(link.href)}
                className="flex min-h-11 items-center justify-between rounded-control px-2 text-left text-base font-medium text-foreground hover:bg-background"
              >
                <span>{link.label}</span>
                <ArrowRight className="h-4 w-4 text-muted" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleNav('/wishlist')}
              className="flex min-h-11 items-center justify-between rounded-control px-2 text-left text-base font-medium text-foreground hover:bg-background"
            >
              <span>Wishlist ({wishlist.length})</span>
              <ArrowRight className="h-4 w-4 text-muted" />
            </button>
            <button
              type="button"
              onClick={() => handleNav('/cart')}
              className="flex min-h-11 items-center justify-between rounded-control px-2 text-left text-base font-medium text-foreground hover:bg-background"
            >
              <span>Shopping Bag ({cartCount})</span>
              <ArrowRight className="h-4 w-4 text-muted" />
            </button>
          </nav>

          <div className="py-5">
            <p className="text-xs font-medium text-muted mb-3">Shop by Collection</p>
            <div className="flex flex-wrap gap-2">
              {ALL_COLLECTIONS.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => handleNav(`/shop?category=${encodeURIComponent(col)}`)}
                  className="min-h-9 rounded-control border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-foreground"
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-5">
            <a
              href={buildConciergeInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-control bg-whatsapp px-4 text-sm font-medium text-surface hover:brightness-95"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Styling Concierge</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
