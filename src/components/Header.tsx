import React, { useState, useEffect } from 'react';
import { ActivePage, SiteSettings } from '../types.ts';
import { ShoppingBag, Sparkles, Menu, X, Phone, Download } from 'lucide-react';

interface HeaderProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  deferredPrompt: any;
  onInstallPWA: () => void;
  siteSettings?: SiteSettings;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  deferredPrompt,
  onInstallPWA,
  siteSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: ActivePage; label: string }[] = [
    { id: 'home', label: 'Accueil' },
    { id: 'creations', label: 'Créations' },
    { id: 'order', label: 'Commander Sur-Mesure' },
    { id: 'about', label: 'À Propos' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId: ActivePage) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border-b border-[#E8E2D9] py-3'
          : 'bg-[#FAF8F5]/80 backdrop-blur-xs border-b border-[#E8E2D9]/50 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="group text-left flex items-center space-x-3 focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-full bg-[#8C6D58] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-300 overflow-hidden shrink-0">
              {siteSettings?.logoUrl ? (
                <img
                  src={siteSettings.logoUrl}
                  alt="Logo Charade-Crea"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              )}
            </div>
            <div>
              <span className="font-serif-artisan text-2xl font-bold tracking-tight text-[#2C2421] block leading-none">
                Charade-Crea
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#8C6D58] font-medium block mt-0.5">
                Création Artisanale
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#8C6D58] text-white shadow-xs'
                      : 'text-[#5C4F4A] hover:text-[#2C2421] hover:bg-[#EFE8DF]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions CTA & PWA Install */}
          <div className="hidden md:flex items-center space-x-3">
            {deferredPrompt && (
              <button
                id="pwa-install-header-btn"
                onClick={onInstallPWA}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-[#8C6D58] bg-[#F3ECE4] border border-[#D8C7B8] rounded-full hover:bg-[#8C6D58] hover:text-white transition-all duration-200"
                title="Installer l'application Charade-Crea"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Installer PWA</span>
              </button>
            )}

            <button
              id="header-cta-order-btn"
              onClick={() => handleNavClick('order')}
              className="flex items-center space-x-2 px-4 py-2 bg-[#D4A373] text-white text-sm font-semibold rounded-full shadow-xs hover:bg-[#C28E5E] transition-all duration-200 active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>Commander</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {deferredPrompt && (
              <button
                onClick={onInstallPWA}
                className="p-2 text-[#8C6D58] bg-[#F3ECE4] rounded-full"
                title="Installer"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#2C2421] rounded-lg hover:bg-[#EFE8DF] focus:outline-hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E8E2D9] px-4 pt-3 pb-6 shadow-lg animate-fadeIn">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  activePage === item.id
                    ? 'bg-[#8C6D58] text-white'
                    : 'text-[#2C2421] hover:bg-[#EFE8DF]'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-[#E8E2D9]">
              <button
                onClick={() => handleNavClick('order')}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-[#D4A373] text-white font-semibold rounded-xl shadow-xs"
              >
                <Sparkles className="w-5 h-5" />
                <span>Demander un Sac Sur-Mesure</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
