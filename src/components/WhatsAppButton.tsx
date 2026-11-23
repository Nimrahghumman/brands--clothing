import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../lib/localStorage';
import { buildConciergeInquiryUrl } from '../lib/whatsapp';

export const WhatsAppButton: React.FC = () => {
  const { currentPath } = useStore();
  const isProductPage = currentPath.startsWith('/product/');

  return (
    <a
      href={buildConciergeInquiryUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with KOVA Styling Concierge on WhatsApp"
      className={`fixed right-4 sm:right-6 z-20 inline-flex min-h-12 items-center gap-2.5 rounded-full bg-whatsapp px-4 py-3 text-xs sm:text-sm font-medium text-surface shadow-floating transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
        isProductPage ? 'bottom-20 lg:bottom-6' : 'bottom-6'
      }`}
    >
      <MessageCircle className="h-4 w-4 shrink-0" />
      <span className="whitespace-nowrap">WhatsApp Concierge</span>
    </a>
  );
};
