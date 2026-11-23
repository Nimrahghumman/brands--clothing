import React, { useEffect, useMemo, useState } from 'react';
import {
  ALL_COLLECTIONS,
  getEffectivePriceCents,
  PRODUCTS,
  type FashionCollection,
} from '../lib/products';
import { useStore } from '../lib/localStorage';
import {
  ProductFilters,
  type ShopFilterState,
} from '../components/ProductFilters';
import { ProductGrid } from '../components/ProductGrid';

function parseSearchIntoFilters(searchStr: string): ShopFilterState {
  const params = new URLSearchParams(searchStr);
  const rawCat = params.get('category');
  const validCat =
    rawCat && (ALL_COLLECTIONS as string[]).includes(rawCat)
      ? (rawCat as FashionCollection)
      : 'All';

  const filterFlag = params.get('filter');
  const query = params.get('q') || '';

  return {
    search: query,
    category: validCat,
    priceTier: 'all',
    size: 'All',
    color: 'All',
    onlyNew: filterFlag === 'new',
    onlySale: filterFlag === 'sale',
    sortBy: filterFlag === 'new' ? 'newest' : 'featured',
  };
}

export const ShopPage: React.FC = () => {
  const { currentSearch } = useStore();
  const [filters, setFilters] = useState<ShopFilterState>(() =>
    parseSearchIntoFilters(currentSearch)
  );

  // Sync when URL query params change via navbar/collection clicks
  useEffect(() => {
    setFilters(parseSearchIntoFilters(currentSearch));
  }, [currentSearch]);

  const availableColors = useMemo(() => {
    const map = new Map<string, string>();
    PRODUCTS.forEach((product) => {
      product.colors.forEach((c) => {
        if (!map.has(c.name)) {
          map.set(c.name, c.hex);
        }
      });
    });
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, []);

  const filteredProducts = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    const list = PRODUCTS.filter((product) => {
      if (q) {
        const haystack = `${product.name} ${product.shortCategory} ${product.fabricSpec} ${product.description} ${product.collections.join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (filters.category !== 'All' && !product.collections.includes(filters.category)) {
        return false;
      }

      if (filters.size !== 'All') {
        const hasSizeInStock =
          product.sizes.includes(filters.size) &&
          !product.soldOutSizes.includes(filters.size);
        if (!hasSizeInStock) return false;
      }

      if (filters.color !== 'All') {
        const hasColorInStock = product.colors.some(
          (c) => c.name === filters.color && c.inStock
        );
        if (!hasColorInStock) return false;
      }

      const effectiveCents = getEffectivePriceCents(product);
      if (filters.priceTier === 'under_80' && effectiveCents >= 8000) return false;
      if (
        filters.priceTier === '80_to_160' &&
        (effectiveCents < 8000 || effectiveCents > 16000)
      ) {
        return false;
      }
      if (filters.priceTier === 'over_160' && effectiveCents <= 16000) return false;

      if (filters.onlyNew && !product.isNewArrival) return false;
      if (
        filters.onlySale &&
        !(
          typeof product.salePriceCents === 'number' &&
          product.salePriceCents < product.priceCents
        )
      ) {
        return false;
      }

      return true;
    });

    const sorted = [...list];
    if (filters.sortBy === 'newest') {
      sorted.sort((a, b) => b.createdAtOrder - a.createdAtOrder);
    } else if (filters.sortBy === 'price_asc') {
      sorted.sort((a, b) => getEffectivePriceCents(a) - getEffectivePriceCents(b));
    } else if (filters.sortBy === 'price_desc') {
      sorted.sort((a, b) => getEffectivePriceCents(b) - getEffectivePriceCents(a));
    }

    return sorted;
  }, [filters]);

  const handleFilterChange = (next: Partial<ShopFilterState>) => {
    setFilters((prev) => ({ ...prev, ...next }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      category: 'All',
      priceTier: 'all',
      size: 'All',
      color: 'All',
      onlyNew: false,
      onlySale: false,
      sortBy: 'featured',
    });
  };

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mb-8">
        <h1 className="font-display text-display text-foreground">
          {filters.category === 'All' ? 'Complete wardrobe catalog' : filters.category}
        </h1>
        <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted">
          Filter by collection, size, colorway, or price range. Select your variant on any piece to add directly to your shopping bag.
        </p>
      </div>

      <ProductFilters
        filters={filters}
        availableColors={availableColors}
        resultCount={filteredProducts.length}
        totalCount={PRODUCTS.length}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      <ProductGrid
        products={filteredProducts}
        onResetFilters={handleReset}
      />
    </div>
  );
};
