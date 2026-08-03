import React, { useState, useEffect } from 'react';
import { Product, ActivePage, SiteSettings } from './types.ts';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { Home } from './components/Home.tsx';
import { About } from './components/About.tsx';
import { Creations } from './components/Creations.tsx';
import { OrderForm } from './components/OrderForm.tsx';
import { Contact } from './components/Contact.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { PWAInstallPrompt } from './components/PWAInstallPrompt.tsx';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [prefilledProduct, setPrefilledProduct] = useState<Product | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    phone: '+33 6 12 34 56 78',
    whatsapp: '33612345678',
    email: 'contact@charade-crea.fr',
    address: 'Atelier Artisanal Charade-Crea, Diego-Suarez, Madagascar',
    instagramUrl: 'https://instagram.com',
    facebookUrl: 'https://facebook.com',
    workingHours: 'Du lundi au samedi (9h - 18h30)',
    slogan: 'Des sacs uniques faits main selon vos envies',
  });

  // Check URL path on load (support direct navigate to /charade-admin)
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('charade-admin')) {
      setActivePage('admin');
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Fetch public products catalog
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des créations :', err);
    }
  };

  // Fetch site settings
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSiteSettings(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres du site :', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleSelectProductForOrder = (product: Product) => {
    setPrefilledProduct(product);
    setActivePage('order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C2421] flex flex-col justify-between font-sans">
      {/* Navigation Header */}
      <Header
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          if (page !== 'order') {
            setPrefilledProduct(null);
          }
        }}
        deferredPrompt={deferredPrompt}
        onInstallPWA={handleInstallPWA}
        siteSettings={siteSettings}
      />

      {/* Main Page View Router */}
      <main className="flex-grow">
        {activePage === 'home' && (
          <Home
            products={products}
            setActivePage={setActivePage}
            onSelectProduct={handleSelectProductForOrder}
            siteSettings={siteSettings}
          />
        )}

        {activePage === 'about' && (
          <About setActivePage={setActivePage} />
        )}

        {activePage === 'creations' && (
          <Creations
            products={products}
            setActivePage={setActivePage}
            onSelectProductForOrder={handleSelectProductForOrder}
          />
        )}

        {activePage === 'order' && (
          <OrderForm
            prefilledProduct={prefilledProduct}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'contact' && (
          <Contact setActivePage={setActivePage} siteSettings={siteSettings} />
        )}

        {activePage === 'admin' && (
          <AdminDashboard
            setActivePage={setActivePage}
            onRefreshProducts={fetchProducts}
            siteSettings={siteSettings}
            onRefreshSettings={fetchSettings}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActivePage={setActivePage} siteSettings={siteSettings} />

      {/* PWA Floating Prompt */}
      <PWAInstallPrompt
        deferredPrompt={deferredPrompt}
        onInstall={handleInstallPWA}
      />
    </div>
  );
}
