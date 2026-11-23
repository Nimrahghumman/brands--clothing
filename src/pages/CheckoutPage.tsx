import React from 'react';
import { CheckoutForm } from '../components/CheckoutForm';

export const CheckoutPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mb-8">
        <h1 className="font-display text-display text-foreground">
          Complete your order
        </h1>
        <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted">
          Confirm your recipient address and select Cash on Delivery or Bank Transfer to dispatch your itemized order directly through WhatsApp.
        </p>
      </div>

      <CheckoutForm />
    </div>
  );
};
