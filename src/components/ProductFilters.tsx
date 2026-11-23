import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import {
  ALL_COLLECTIONS,
  ALL_SIZES,
  type FashionCollection,
  type GarmentSize,
} from '../lib/products';
import { useStore } from '../lib/localStorage';
import { formatMoney } from '../lib/utils';

export type PriceTier = 'all' | 'under_80' | '80_to_160' | 'over_160';
export type SortOption = 'featured' | 'newest' | 'price_asc' | 'price_desc';

export interface ShopFilterState {
  search: string;
  category: FashionCollection | 'All';
  priceTier: PriceTier;
  size: GarmentSize | 'All';
  color: string | 'All';
  onlySale: boolean;
  onlyNew: boolean;
  sortBy: SortOption;
}

interface ProductFiltersProps {
  filters: ShopFilterState;
  availableColors: Array<{ name: string; hex: string }>;
  resultCount: number;
  totalCount: number;
  onChange: (next: Partial<ShopFilterState>) => void;
  onReset: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  availableColors,
  resultCount,
  totalCount,
  onChange,
  onReset,
}) => {
  const { preferences } = useStore();

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.category !== 'All' ||
    filters.priceTier !== 'all' ||
    filters.size !== 'All' ||
    filters.color !== 'All' ||
    filters.onlySale ||
    filters.onlyNew;

  return (
    <div className="border border-border bg-surface p-4 sm:p-6 mb-8">
      {/* Top Row: Search + Sort + Result Counter */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pb-5 border-b border-border">
        <div className="relative flex-1 max-w-md">
          <label htmlFor="shop-search-input" className="sr-only">
            Search garments by name, fabric, or cut
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            id="shop-search-input"
            type="search"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search by garment, fabric, or silhouette"
            className="min-h-11 w-full rounded-control border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-foreground focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4">
          <span className="text-sm text-muted tabular-nums">
            Showing <strong className="font-semibold text-foreground">{resultCount}</strong> of{' '}
            {totalCount} pieces
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="shop-sort-select" className="text-xs font-medium text-muted whitespace-nowrap">
              Sort by
            </label>
            <select
              id="shop-sort-select"
              value={filters.sortBy}
              onChange={(e) => onChange({ sortBy: e.target.value as SortOption })}
              className="min-h-10 rounded-control border border-border bg-background px-3 text-sm text-foreground focus:border-foreground focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest arrivals</option>
              <option value="price_asc">Price: Low to high</option>
              <option value="price_desc">Price: High to low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Controls */}
      <div className="py-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2.5 text-xs font-medium text-muted">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Collection</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['All', ...ALL_COLLECTIONS] as const).map((cat) => {
            const active = filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChange({ category: cat })}
                aria-pressed={active}
                className={`min-h-9 rounded-control border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'border-foreground bg-foreground text-surface'
                    : 'border-border bg-background text-foreground hover:border-foreground'
                }`}
              >
                {cat === 'All' ? 'All Collections' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Row: Size, Color, Price & Toggles */}
      <div className="pt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Size Filter */}
        <div>
          <span className="block text-xs font-medium text-muted mb-2">Size</span>
          <div className="flex flex-wrap gap-1.5">
            {(['All', ...ALL_SIZES] as const).map((sz) => {
              const active = filters.size === sz;
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onChange({ size: sz })}
                  aria-pressed={active}
                  className={`min-h-8 min-w-9 rounded-control border px-2 text-xs tabular-nums whitespace-nowrap transition-colors ${
                    active
                      ? 'border-foreground bg-foreground text-surface font-medium'
                      : 'border-border bg-background text-foreground hover:border-foreground'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Filter */}
        <div>
          <span className="block text-xs font-medium text-muted mb-2">Colorway</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onChange({ color: 'All' })}
              aria-pressed={filters.color === 'All'}
              className={`min-h-8 rounded-control border px-2.5 text-xs whitespace-nowrap ${
                filters.color === 'All'
                  ? 'border-foreground bg-foreground text-surface font-medium'
                  : 'border-border bg-background text-foreground hover:border-foreground'
              }`}
            >
              All
            </button>
            {availableColors.map((col) => {
              const active = filters.color === col.name;
              return (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => onChange({ color: active ? 'All' : col.name })}
                  aria-pressed={active}
                  title={col.name}
                  className={`inline-flex min-h-8 items-center gap-1.5 rounded-control border px-2.5 text-xs whitespace-nowrap transition-colors ${
                    active
                      ? 'border-foreground bg-foreground text-surface font-medium'
                      : 'border-border bg-background text-foreground hover:border-foreground'
                  }`}
                >
                  <span
                    style={{ backgroundColor: col.hex }}
                    className="h-3 w-3 rounded-full border border-foreground/30 shrink-0"
                  />
                  <span>{col.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Tier & Quick Toggles */}
        <div>
          <span className="block text-xs font-medium text-muted mb-2">Price range</span>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="price-tier-select" className="sr-only">
              Filter by price range
            </label>
            <select
              id="price-tier-select"
              value={filters.priceTier}
              onChange={(e) => onChange({ priceTier: e.target.value as PriceTier })}
              className="min-h-8 rounded-control border border-border bg-background px-2.5 text-xs text-foreground focus:border-foreground focus:outline-none tabular-nums"
            >
              <option value="all">All prices</option>
              <option value="under_80">
                Under {formatMoney(8000, preferences.currency)}
              </option>
              <option value="80_to_160">
                {formatMoney(8000, preferences.currency)} – {formatMoney(16000, preferences.currency)}
              </option>
              <option value="over_160">
                Above {formatMoney(16000, preferences.currency)}
              </option>
            </select>

            <button
              type="button"
              onClick={() => onChange({ onlyNew: !filters.onlyNew })}
              aria-pressed={filters.onlyNew}
              className={`min-h-8 rounded-control border px-2.5 text-xs whitespace-nowrap transition-colors ${
                filters.onlyNew
                  ? 'border-foreground bg-foreground text-surface font-medium'
                  : 'border-border bg-background text-foreground hover:border-foreground'
              }`}
            >
              New Arrivals
            </button>

            <button
              type="button"
              onClick={() => onChange({ onlySale: !filters.onlySale })}
              aria-pressed={filters.onlySale}
              className={`min-h-8 rounded-control border px-2.5 text-xs whitespace-nowrap transition-colors ${
                filters.onlySale
                  ? 'border-foreground bg-foreground text-surface font-medium'
                  : 'border-border bg-background text-foreground hover:border-foreground'
              }`}
            >
              On Sale
            </button>
          </div>
        </div>
      </div>

      {/* Active Removable Tokens */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted">Active filters:</span>
            {filters.category !== 'All' && (
              <button
                type="button"
                onClick={() => onChange({ category: 'All' })}
                className="inline-flex min-h-7 items-center gap-1 rounded-control border border-border bg-background px-2.5 text-xs text-foreground hover:border-foreground"
              >
                <span>{filters.category}</span>
                <X className="h-3 w-3" />
              </button>
            )}
            {filters.size !== 'All' && (
              <button
                type="button"
                onClick={() => onChange({ size: 'All' })}
                className="inline-flex min-h-7 items-center gap-1 rounded-control border border-border bg-background px-2.5 text-xs text-foreground hover:border-foreground"
              >
                <span>Size {filters.size}</span>
                <X className="h-3 w-3" />
              </button>
            )}
            {filters.color !== 'All' && (
              <button
                type="button"
                onClick={() => onChange({ color: 'All' })}
                className="inline-flex min-h-7 items-center gap-1 rounded-control border border-border bg-background px-2.5 text-xs text-foreground hover:border-foreground"
              >
                <span>{filters.color}</span>
                <X className="h-3 w-3" />
              </button>
            )}
            {filters.priceTier !== 'all' && (
              <button
                type="button"
                onClick={() => onChange({ priceTier: 'all' })}
                className="inline-flex min-h-7 items-center gap-1 rounded-control border border-border bg-background px-2.5 text-xs text-foreground hover:border-foreground"
              >
                <span>Price filtered</span>
                <X className="h-3 w-3" />
              </button>
            )}
            {filters.onlyNew && (
              <button
                type="button"
                onClick={() => onChange({ onlyNew: false })}
                className="inline-flex min-h-7 items-center gap-1 rounded-control border border-border bg-background px-2.5 text-xs text-foreground hover:border-foreground"
              >
                <span>New Arrivals</span>
                <X className="h-3 w-3" />
              </button>
            )}
            {filters.onlySale && (
              <button
                type="button"
                onClick={() => onChange({ onlySale: false })}
                className="inline-flex min-h-7 items-center gap-1 rounded-control border border-border bg-background px-2.5 text-xs text-foreground hover:border-foreground"
              >
                <span>On Sale</span>
                <X className="h-3 w-3" />
              </button>
            )}
            {filters.search.trim() !== '' && (
              <button
                type="button"
                onClick={() => onChange({ search: '' })}
                className="inline-flex min-h-7 items-center gap-1 rounded-control border border-border bg-background px-2.5 text-xs text-foreground hover:border-foreground"
              >
                <span>“{filters.search.trim()}”</span>
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onReset}
            className="text-xs font-medium text-foreground underline hover:text-muted whitespace-nowrap"
          >
            Reset all
          </button>
        </div>
      )}
    </div>
  );
};
