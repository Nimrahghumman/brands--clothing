import React from 'react';
import { getProductBySlug } from '../lib/products';
import { useStore } from '../lib/localStorage';
import { ProductDetails } from '../components/ProductDetails';
import { Button } from '../components/ui';

interface ProductPageProps {
  slug: string;
}

export const ProductPage: React.FC<ProductPageProps> = ({ slug }) => {
  const { navigate } = useStore();
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="border border-border bg-surface p-10">
          <h1 className="font-display text-2xl text-foreground">Garment not found</h1>
          <p className="mt-2 text-sm text-muted">
            This archive piece may have moved or sold through. Browse our active seasonal collection instead.
          </p>
          <div className="mt-6">
            <Button tone="primary" onClick={() => navigate('/shop')}>
              Return to Catalog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <ProductDetails product={product} />;
};
