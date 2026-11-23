import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DEFAULT_PREFERENCES,
  isCartArray,
  isPreferencesObject,
  isReviewsRecord,
  isStringArray,
  safeReadStorage,
  safeWriteStorage,
  STORAGE_KEYS,
  StoreContext,
  type CartItemData,
  type CustomerPreferences,
  type SavedCustomerProfile,
  type VariantMemory,
} from '../lib/localStorage';
import type { ProductReview } from '../lib/products';
import { clampQuantity, type CurrencyCode } from '../lib/utils';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartItemData[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<CustomerPreferences>(DEFAULT_PREFERENCES);
  const [customReviews, setCustomReviews] = useState<Record<string, ProductReview[]>>({});
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const statusTimerRef = useRef<number | null>(null);

  const [locationState, setLocationState] = useState<{ pathname: string; search: string }>(() => ({
    pathname: typeof window !== 'undefined' ? window.location.pathname : '/',
    search: typeof window !== 'undefined' ? window.location.search : '',
  }));

  // Client-only Local Storage hydration
  useEffect(() => {
    const savedCart = safeReadStorage(STORAGE_KEYS.CART, [], isCartArray);
    const savedWishlist = safeReadStorage(STORAGE_KEYS.WISHLIST, [], isStringArray);
    const savedPrefs = safeReadStorage(
      STORAGE_KEYS.PREFS,
      DEFAULT_PREFERENCES,
      isPreferencesObject
    );
    const savedReviews = safeReadStorage(STORAGE_KEYS.REVIEWS, {}, isReviewsRecord);

    setCart(savedCart);
    setWishlist(savedWishlist);
    setPreferences({
      ...DEFAULT_PREFERENCES,
      ...savedPrefs,
      savedProfile: {
        ...DEFAULT_PREFERENCES.savedProfile,
        ...(savedPrefs.savedProfile || {}),
      },
      productVariants: {
        ...(savedPrefs.productVariants || {}),
      },
    });
    setCustomReviews(savedReviews);
    setHydrated(true);
  }, []);

  // Sync changes back to Local Storage once hydrated
  useEffect(() => {
    if (!hydrated) return;
    safeWriteStorage(STORAGE_KEYS.CART, cart);
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    safeWriteStorage(STORAGE_KEYS.WISHLIST, wishlist);
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    safeWriteStorage(STORAGE_KEYS.PREFS, preferences);
  }, [preferences, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    safeWriteStorage(STORAGE_KEYS.REVIEWS, customReviews);
  }, [customReviews, hydrated]);

  // Listen to browser back/forward navigation
  useEffect(() => {
    const onPopState = () => {
      setLocationState({
        pathname: window.location.pathname,
        search: window.location.search,
      });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const announceStatus = useCallback((msg: string) => {
    setStatusMessage(msg);
    if (statusTimerRef.current) {
      window.clearTimeout(statusTimerRef.current);
    }
    statusTimerRef.current = window.setTimeout(() => {
      setStatusMessage(null);
    }, 3600);
  }, []);

  const navigate = useCallback((to: string) => {
    if (typeof window === 'undefined') return;
    const url = new URL(to, window.location.origin);
    window.history.pushState({}, '', `${url.pathname}${url.search}`);
    setLocationState({
      pathname: url.pathname,
      search: url.search,
    });
    setIsCartDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openCartDrawer = useCallback(() => setIsCartDrawerOpen(true), []);
  const closeCartDrawer = useCallback(() => setIsCartDrawerOpen(false), []);

  const addToCart = useCallback(
    (item: Omit<CartItemData, 'variantKey'>, options?: { openDrawer?: boolean }) => {
      const variantKey = `${item.productId}::${item.size}::${item.color}`;
      const safeQty = clampQuantity(item.quantity, 1, 10);

      setCart((prev) => {
        const existingIndex = prev.findIndex((entry) => entry.variantKey === variantKey);
        if (existingIndex >= 0) {
          const updated = [...prev];
          const existing = updated[existingIndex];
          updated[existingIndex] = {
            ...existing,
            quantity: clampQuantity(existing.quantity + safeQty, 1, 20),
          };
          return updated;
        }
        return [
          ...prev,
          {
            ...item,
            variantKey,
            quantity: safeQty,
          },
        ];
      });

      setPreferences((prev) => ({
        ...prev,
        preferredSize: item.size,
        productVariants: {
          ...prev.productVariants,
          [item.productId]: { size: item.size, color: item.color },
        },
      }));

      announceStatus(`Added ${item.name} (${item.size} · ${item.color}) to bag`);
      if (options?.openDrawer !== false) {
        setIsCartDrawerOpen(true);
      }
    },
    [announceStatus]
  );

  const updateCartQuantity = useCallback((variantKey: string, nextQuantity: number) => {
    if (nextQuantity <= 0) {
      setCart((prev) => prev.filter((entry) => entry.variantKey !== variantKey));
      return;
    }
    const clamped = clampQuantity(nextQuantity, 1, 20);
    setCart((prev) =>
      prev.map((entry) =>
        entry.variantKey === variantKey ? { ...entry, quantity: clamped } : entry
      )
    );
  }, []);

  const removeFromCart = useCallback(
    (variantKey: string) => {
      setCart((prev) => {
        const target = prev.find((i) => i.variantKey === variantKey);
        if (target) {
          announceStatus(`Removed ${target.name} from bag`);
        }
        return prev.filter((entry) => entry.variantKey !== variantKey);
      });
    },
    [announceStatus]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback(
    (productId: string, productName?: string) => {
      setWishlist((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          if (productName) announceStatus(`Removed ${productName} from wishlist`);
          return prev.filter((id) => id !== productId);
        } else {
          if (productName) announceStatus(`Saved ${productName} to wishlist`);
          return [...prev, productId];
        }
      });
    },
    [announceStatus]
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const setCurrency = useCallback((currency: CurrencyCode) => {
    setPreferences((prev) => ({ ...prev, currency }));
  }, []);

  const dismissAnnouncement = useCallback(() => {
    setPreferences((prev) => ({ ...prev, announcementDismissed: true }));
  }, []);

  const rememberVariant = useCallback((productId: string, variant: VariantMemory) => {
    setPreferences((prev) => ({
      ...prev,
      preferredSize: variant.size || prev.preferredSize,
      productVariants: {
        ...prev.productVariants,
        [productId]: {
          ...(prev.productVariants[productId] || {}),
          ...variant,
        },
      },
    }));
  }, []);

  const subscribeNewsletter = useCallback(
    (email: string) => {
      setPreferences((prev) => ({ ...prev, newsletterEmail: email }));
      announceStatus(`Subscribed ${email} to KOVA private dispatches`);
    },
    [announceStatus]
  );

  const saveCustomerProfile = useCallback((profile: SavedCustomerProfile) => {
    setPreferences((prev) => ({
      ...prev,
      savedProfile: profile,
    }));
  }, []);

  const addProductReview = useCallback(
    (productId: string, review: ProductReview) => {
      setCustomReviews((prev) => ({
        ...prev,
        [productId]: [review, ...(prev[productId] || [])],
      }));
      announceStatus('Thank you — your garment review has been published');
    },
    [announceStatus]
  );

  const cartCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      hydrated,
      cart,
      cartCount,
      wishlist,
      preferences,
      customReviews,
      isCartDrawerOpen,
      statusMessage,
      openCartDrawer,
      closeCartDrawer,
      announceStatus,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isInWishlist,
      setCurrency,
      dismissAnnouncement,
      rememberVariant,
      subscribeNewsletter,
      saveCustomerProfile,
      addProductReview,
      navigate,
      currentPath: locationState.pathname,
      currentSearch: locationState.search,
    }),
    [
      hydrated,
      cart,
      cartCount,
      wishlist,
      preferences,
      customReviews,
      isCartDrawerOpen,
      statusMessage,
      openCartDrawer,
      closeCartDrawer,
      announceStatus,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isInWishlist,
      setCurrency,
      dismissAnnouncement,
      rememberVariant,
      subscribeNewsletter,
      saveCustomerProfile,
      addProductReview,
      navigate,
      locationState.pathname,
      locationState.search,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
