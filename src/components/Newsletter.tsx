import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useStore } from '../lib/localStorage';
import { Button, inputBaseClasses } from './ui';

export const Newsletter: React.FC = () => {
  const { preferences, subscribeNewsletter } = useStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!isValidEmail) {
      setError('Enter a valid email address (for example, name@domain.com).');
      return;
    }
    setError('');
    subscribeNewsletter(trimmed);
    setEmail('');
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="border-b border-border bg-surface py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <h2 id="newsletter-heading" className="font-display text-display text-foreground">
              Private atelier dispatches
            </h2>
            <p className="mt-2 max-w-[34em] text-sm sm:text-base text-muted">
              Receive early invitations to seasonal wool and linen releases, restock alerts on core weights, and private archive reductions.
            </p>
          </div>

          <div className="lg:col-span-6">
            {preferences.newsletterEmail ? (
              <div className="flex items-center gap-3 border border-border bg-background p-5 text-sm text-foreground">
                <Check className="h-4 w-4 shrink-0 text-whatsapp" />
                <span>
                  Subscribed as <strong>{preferences.newsletterEmail}</strong>. You will receive our next seasonal lookbook dispatch.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="max-w-lg lg:ml-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className={inputBaseClasses}
                    />
                  </div>
                  <Button type="submit" tone="primary">
                    Subscribe
                  </Button>
                </div>
                {error && (
                  <p role="alert" className="mt-2 text-xs font-medium text-danger">
                    {error}
                  </p>
                )}
                <p className="mt-2.5 text-xs text-muted">
                  Zero weekly clutter — sent only upon new capsule releases.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
