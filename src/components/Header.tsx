import React, { useState } from 'react';
import { ArrowRight, Heart, Menu, PhoneCall, X } from 'lucide-react';
import { Logo } from './Logo';
import { PublicRoute } from '../types';

interface HeaderProps {
  currentRoute: PublicRoute;
  favouritesCount: number;
  onNavigateRoute: (route: PublicRoute) => void;
  onOpenFavourites: () => void;
  onOpenEnquire: () => void;
  officialPhone?: string;
}

const NAV_ITEMS: { route: PublicRoute; label: string }[] = [
  { route: 'home', label: 'Home' },
  { route: 'properties', label: 'Properties' },
  { route: 'estate-projects', label: 'Estate Projects' },
  { route: 'about', label: 'About' },
  { route: 'contact', label: 'Contact' },
];

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  favouritesCount,
  onNavigateRoute,
  onOpenFavourites,
  onOpenEnquire,
  officialPhone,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectRoute = (route: PublicRoute) => {
    setMobileMenuOpen(false);
    onNavigateRoute(route);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#102F2B] text-white border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => handleSelectRoute('home')}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B779] rounded-md transition-opacity hover:opacity-95 shrink-0"
          aria-label="King Zion's Estate Home"
        >
          <Logo variant="dark" />
        </button>

        {/* Strict 5-Page Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-3" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => handleSelectRoute(item.route)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#B58C48] text-white font-semibold shadow-xs'
                    : 'text-[#F5F3ED]/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {favouritesCount > 0 && (
            <button
              onClick={onOpenFavourites}
              className="relative p-2 rounded-lg text-[#F5F3ED] hover:text-white hover:bg-white/10 transition-colors"
              aria-label={`View saved properties (${favouritesCount})`}
              title="Saved Properties"
            >
              <Heart className="w-5 h-5 fill-[#D6B779] text-[#D6B779]" />
              <span className="absolute -top-1 -right-1 bg-[#B58C48] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {favouritesCount}
              </span>
            </button>
          )}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenEnquire();
            }}
            className="hidden sm:inline-flex items-center gap-2 bg-[#B58C48] hover:bg-[#967139] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <span>Enquire Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg text-[#F5F3ED] hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B779]"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-[#102F2B] text-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto border-l border-white/10">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <span className="font-serif-display font-bold text-base tracking-wide text-[#D6B779]">
                  Navigation
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-1.5">
                {NAV_ITEMS.map((item) => {
                  const isActive = currentRoute === item.route;
                  return (
                    <button
                      key={item.route}
                      onClick={() => handleSelectRoute(item.route)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#B58C48] text-white font-semibold'
                          : 'text-[#F5F3ED] hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-3">
              {favouritesCount > 0 && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenFavourites();
                  }}
                  className="w-full py-2.5 px-4 rounded-lg bg-white/10 text-[#F5F3ED] text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-[#D6B779] text-[#D6B779]" />
                  <span>Saved Properties ({favouritesCount})</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEnquire();
                }}
                className="w-full bg-[#B58C48] hover:bg-[#967139] text-white py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {officialPhone && (
                <a
                  href={`tel:${officialPhone.replace(/\s+/g, '')}`}
                  className="w-full bg-white/10 hover:bg-white/15 text-[#F5F3ED] py-2.5 px-4 rounded-lg text-xs font-medium flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-[#D6B779]" />
                  <span>Call {officialPhone}</span>
                </a>
              )}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
};
