import React from 'react';
import { MotionConfig, motion } from 'motion/react';
import { StoreProvider } from './components/StoreProvider';
import { useStore } from './lib/localStorage';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';

const StorefrontRouter: React.FC = () => {
  const { currentPath, statusMessage } = useStore();

  const renderPage = () => {
    const normalized = currentPath.replace(/\/+$/, '') || '/';

    if (normalized === '/') {
      return <HomePage />;
    }
    if (normalized === '/shop') {
      return <ShopPage />;
    }
    if (normalized.startsWith('/product/')) {
      const slug = decodeURIComponent(normalized.slice('/product/'.length));
      return <ProductPage slug={slug} />;
    }
    if (normalized === '/cart') {
      return <CartPage />;
    }
    if (normalized === '/wishlist') {
      return <WishlistPage />;
    }
    if (normalized === '/checkout') {
      return <CheckoutPage />;
    }

    // Catch-all route falls back cleanly to HomePage
    return <HomePage />;
  };

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <AnnouncementBar />
      <Navbar />

      {/* Accessible Non-Blocking Status Feedback Strip */}
      <div role="status" aria-live="polite" className="min-h-0">
        {statusMessage && (
          <div className="border-b border-border bg-accent/45 px-4 py-2 text-center text-xs font-medium text-foreground">
            {statusMessage}
          </div>
        )}
      </div>

      <main className="flex-1">
        <motion.div
          key={currentPath}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {renderPage()}
        </motion.div>
      </main>

      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
};

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <StoreProvider>
        <StorefrontRouter />
      </StoreProvider>
    </MotionConfig>
  );
}
