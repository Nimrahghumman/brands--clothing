import React, { useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useStore } from '../lib/localStorage';
import { MobileNavbar } from './MobileNavbar';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Men', href: '/shop?category=Men' },
  { label: 'Women', href: '/shop?category=Women' },
  { label: 'New Arrivals', href: '/shop?filter=new' },
] as const;

export const Navbar: React.FC = () => {
  const {
    cartCount,
    wishlist,
    openCartDrawer,
    navigate,
    currentPath,
    currentSearch,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fullCurrentUrl = `${currentPath}${currentSearch}`;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    navigate(href);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/shop');
    }
    setSearchOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-10">
          {/* Left: Mobile Menu Trigger + Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-control text-foreground hover:bg-background md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <a
              href="/"
              onClick={(e) => handleLinkClick(e, '/')}
              className="font-display text-2xl sm:text-3xl tracking-tight text-foreground whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
            >
              KOVA
            </a>
          </div>

          {/* Center: 5 Quiet Editorial Links */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === '/'
                  ? currentPath === '/'
                  : fullCurrentUrl === link.href ||
                    (link.href === '/shop' && currentPath === '/shop' && !currentSearch);

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`whitespace-nowrap shrink-0 py-1 text-sm transition-colors ${
                    isActive
                      ? 'font-semibold text-foreground border-b border-foreground'
                      : 'font-normal text-muted hover:text-foreground'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right: Search, Wishlist, Bag */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-expanded={searchOpen}
              aria-label="Search garments"
              className="inline-flex h-11 w-11 items-center justify-center rounded-control text-foreground hover:bg-background focus-visible:outline-2 focus-visible:outline-foreground"
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            <a
              href="/wishlist"
              onClick={(e) => handleLinkClick(e, '/wishlist')}
              aria-label={`Saved wishlist (${wishlist.length} items)`}
              className="relative inline-flex h-11 items-center justify-center gap-1.5 rounded-control px-2.5 text-sm text-foreground hover:bg-background focus-visible:outline-2 focus-visible:outline-foreground"
            >
              <Heart
                className={`h-5 w-5 ${
                  wishlist.length > 0 ? 'fill-foreground text-foreground' : ''
                }`}
              />
              {wishlist.length > 0 && (
                <span className="tabular-nums text-xs font-medium text-foreground">
                  {wishlist.length}
                </span>
              )}
            </a>

            <button
              type="button"
              onClick={openCartDrawer}
              aria-label={`Open shopping bag (${cartCount} items)`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-control bg-foreground px-3.5 text-sm font-medium text-surface hover:bg-foreground/90 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Bag</span>
              <span className="tabular-nums text-xs font-semibold">({cartCount})</span>
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-t border-border bg-background px-4 py-3 sm:px-6 lg:px-10">
            <form
              onSubmit={handleSearchSubmit}
              className="mx-auto flex max-w-2xl items-center gap-3"
            >
              <label htmlFor="header-search-input" className="sr-only">
                Search garments
              </label>
              <input
                id="header-search-input"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search garments"
                autoFocus
                className="min-h-11 flex-1 rounded-control border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-foreground focus:outline-none"
              />
              <button
                type="submit"
                className="min-h-11 whitespace-nowrap rounded-control bg-foreground px-5 text-sm font-medium text-surface hover:bg-foreground/90"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      <MobileNavbar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={NAV_LINKS}
      />
    </>
  );
};
