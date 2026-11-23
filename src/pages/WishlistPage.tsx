import React from 'react';
import { Wishlist } from '../components/Wishlist';

export const WishlistPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mb-8">
        <h1 className="font-display text-display text-foreground">Saved wishlist</h1>
        <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted">
          Your saved pieces persist automatically in your browser. Select your preferred size and shade to move any garment into your bag.
        </p>
      </div>

      <Wishlist />
    </div>
  );
};
