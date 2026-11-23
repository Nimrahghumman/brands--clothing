import React from 'react';
import { X } from 'lucide-react';
import { useStore } from '../lib/localStorage';
import { FREE_SHIPPING_THRESHOLD_CENTS, formatMoney, type CurrencyCode } from '../lib/utils';

export const AnnouncementBar: React.FC = () => {
  const { preferences, setCurrency, dismissAnnouncement } = useStore();

  if (preferences.announcementDismissed) {
    return null;
  }

  return (
    <div className="bg-foreground text-surface border-b border-foreground/20">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 lg:px-10">
        <div className="hidden sm:block text-surface/80">
          Autumn / Winter Atelier Collection
        </div>

        <p className="min-w-0 flex-1 text-center text-surface sm:flex-initial">
          Complimentary express delivery on orders above{' '}
          <span className="tabular-nums font-medium">
            {formatMoney(FREE_SHIPPING_THRESHOLD_CENTS, preferences.currency)}
          </span>{' '}
          · 14-day exchanges
        </p>

        <div className="flex items-center gap-3 shrink-0">
          <label htmlFor="currency-select" className="sr-only">
            Display currency
          </label>
          <select
            id="currency-select"
            value={preferences.currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="bg-foreground text-surface text-xs font-medium border border-surface/30 rounded-control px-2 py-0.5 focus:outline-none focus-visible:outline-1 focus-visible:outline-surface cursor-pointer"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="PKR">PKR (Rs)</option>
          </select>

          <button
            type="button"
            onClick={dismissAnnouncement}
            aria-label="Dismiss announcement"
            className="inline-flex h-6 w-6 items-center justify-center text-surface/80 hover:text-surface focus-visible:outline-1 focus-visible:outline-surface"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
