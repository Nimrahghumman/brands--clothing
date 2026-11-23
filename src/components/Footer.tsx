import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../lib/localStorage';
import {
  buildConciergeInquiryUrl,
  formatWhatsAppDisplayNumber,
} from '../lib/whatsapp';

export const Footer: React.FC = () => {
  const { navigate } = useStore();

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <footer className="bg-foreground text-surface">
      <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 pb-12 border-b border-surface/15">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <a
              href="/"
              onClick={(e) => handleLink(e, '/')}
              className="font-display text-3xl text-surface"
            >
              KOVA
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-surface/75">
              Contemporary menswear and womenswear built around natural fiber density, architectural proportion, and enduring everyday utility.
            </p>

            <div className="mt-6">
              <a
                href={buildConciergeInquiryUrl('sizing or a custom order')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-control border border-surface/30 px-4 text-xs font-medium text-surface hover:border-surface hover:bg-surface/10 whitespace-nowrap"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Support · {formatWhatsAppDisplayNumber()}</span>
              </a>
            </div>
          </div>

          {/* Departments */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold text-surface/60 mb-4">Collections</h3>
            <ul className="space-y-2.5 text-sm text-surface/85">
              <li>
                <a href="/shop?filter=new" onClick={(e) => handleLink(e, '/shop?filter=new')} className="hover:text-surface hover:underline">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="/shop?category=Men" onClick={(e) => handleLink(e, '/shop?category=Men')} className="hover:text-surface hover:underline">
                  Menswear
                </a>
              </li>
              <li>
                <a href="/shop?category=Women" onClick={(e) => handleLink(e, '/shop?category=Women')} className="hover:text-surface hover:underline">
                  Womenswear
                </a>
              </li>
              <li>
                <a href="/shop?category=Oversized%20T-shirts" onClick={(e) => handleLink(e, '/shop?category=Oversized%20T-shirts')} className="hover:text-surface hover:underline">
                  Oversized T-shirts
                </a>
              </li>
              <li>
                <a href="/shop?category=Premium%20Hoodies" onClick={(e) => handleLink(e, '/shop?category=Premium%20Hoodies')} className="hover:text-surface hover:underline">
                  Premium Hoodies
                </a>
              </li>
              <li>
                <a href="/shop?category=Denim%20Jeans" onClick={(e) => handleLink(e, '/shop?category=Denim%20Jeans')} className="hover:text-surface hover:underline">
                  Okayama Selvedge Denim
                </a>
              </li>
            </ul>
          </div>

          {/* Seasonal & Capsules */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold text-surface/60 mb-4">Edit &amp; Account</h3>
            <ul className="space-y-2.5 text-sm text-surface/85">
              <li>
                <a href="/shop?category=Summer%20Collection" onClick={(e) => handleLink(e, '/shop?category=Summer%20Collection')} className="hover:text-surface hover:underline">
                  Summer Linen
                </a>
              </li>
              <li>
                <a href="/shop?category=Winter%20Collection" onClick={(e) => handleLink(e, '/shop?category=Winter%20Collection')} className="hover:text-surface hover:underline">
                  Winter Merino
                </a>
              </li>
              <li>
                <a href="/shop?category=Accessories" onClick={(e) => handleLink(e, '/shop?category=Accessories')} className="hover:text-surface hover:underline">
                  Leather Goods
                </a>
              </li>
              <li>
                <a href="/wishlist" onClick={(e) => handleLink(e, '/wishlist')} className="hover:text-surface hover:underline">
                  Saved Wishlist
                </a>
              </li>
              <li>
                <a href="/cart" onClick={(e) => handleLink(e, '/cart')} className="hover:text-surface hover:underline">
                  Shopping Bag
                </a>
              </li>
              <li>
                <a href="/checkout" onClick={(e) => handleLink(e, '/checkout')} className="hover:text-surface hover:underline">
                  Direct Checkout
                </a>
              </li>
            </ul>
          </div>

          {/* Client Service */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold text-surface/60 mb-4">Client Care</h3>
            <dl className="space-y-3 text-xs leading-relaxed text-surface/75">
              <div>
                <dt className="font-medium text-surface">Delivery</dt>
                <dd>Express tracked dispatch in 2–4 business days. Complimentary above $150.</dd>
              </div>
              <div>
                <dt className="font-medium text-surface">Returns &amp; Exchanges</dt>
                <dd>14-day complimentary size exchange on unworn garments with original tags.</dd>
              </div>
              <div>
                <dt className="font-medium text-surface">Payment</dt>
                <dd>Cash on Delivery (COD) and Direct Bank Transfer verified via WhatsApp.</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-surface/60">
          <p>© {new Date().getFullYear()} KOVA Atelier. All rights reserved.</p>
          <p>Barcelos · Okayama · Como · Normandy</p>
        </div>
      </div>
    </footer>
  );
};
