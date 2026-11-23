import React from 'react';
import type { Product } from '../lib/products';
import { ProductCard } from './ProductCard';
import { Button } from './ui';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  emptyMessage = 'No garments match your current filter selection.',
  onResetFilters,
}) => {
  if (products.length === 0) {
    return (
      <div className="border border-border bg-surface px-6 py-16 text-center">
        <h3 className="font-display text-2xl text-foreground">No matching pieces</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">{emptyMessage}</p>
        {onResetFilters && (
          <div className="mt-6">
            <Button tone="quiet" onClick={onResetFilters}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
