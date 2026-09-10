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

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Le Cabas Éléganza Jute & Cuir',
    description: 'Cabas spacieux et résistant confectionné artisanalement. Mariage harmonieux de la toile de jute naturelle et d\'anses robustes en cuir véritable.',
    material: 'Toile de jute bio & Anses en Cuir véritable',
    color: 'Beige naturel & Cognac',
    price: '85 €',
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Pochette Duchesse Jacquard',
    description: 'Raffinement absolu pour vos soirées ou cérémonies. Réalisée dans un tissu jacquard d\'exception agrémenté de fils dorés.',
    material: 'Jacquard brodé & Laiton vieilli',
    color: 'Bleu Nuit & Or',
    price: '48 €',
    imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 3,
    name: 'Besace Bohème Suédine Terracotta',
    description: 'Sac besace souple et velouté à rabat graphique. Fermeture aimantée sécurisée, grande poche intérieure.',
    material: 'Suédine toucher peau de pêche & Sangle jacquard',
    color: 'Terracotta & Ocre',
    price: '92 €',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-01-03T00:00:00.000Z',
  },
  {
    id: 4,
    name: 'Sac à Dos City Chics',
    description: 'Un sac à dos élégant et fonctionnel pensé pour le quotidien urbain. Toile déperlante haute qualité et renforts en cuir végétal.',
    material: 'Toile enduite & Cuir végétal',
    color: 'Gris Anthracite & Miel',
    price: '110 €',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-01-04T00:00:00.000Z',
  },
  {
    id: 5,
    name: 'Mini Sac Seau Romance',
    description: 'Modèle seau romantique au design iconique. Cordon de serrage coulissant avec pompons faits main.',
    material: 'Coton tissé lourd & Cordons tressés',
    color: 'Rose Poudré & Blanc Cassé',
    price: '65 €',
    imageUrl: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-01-05T00:00:00.000Z',
  },
];

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const cached = localStorage.getItem('charade_products_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_PRODUCTS;
  });
  const [prefilledProduct, setPrefilledProduct] = useState<Product | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const cached = localStorage.getItem('charade_settings_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return {
      phone: '+33 6 12 34 56 78',
      whatsapp: '33612345678',
      email: 'contact@charade-crea.fr',
      address: 'Atelier Artisanal Charade-Crea, Diego-Suarez, Madagascar',
      instagramUrl: 'https://instagram.com',
      facebookUrl: 'https://facebook.com',
      workingHours: 'Du lundi au samedi (9h - 18h30)',
      slogan: 'Des sacs uniques faits main selon vos envies',
    };
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
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          try {
            localStorage.setItem('charade_products_cache', JSON.stringify(data));
          } catch (e) {
            console.warn('Cache local plein ou inaccessible');
          }
        }
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
        if (data && typeof data === 'object') {
          setSiteSettings(data);
          try {
            localStorage.setItem('charade_settings_cache', JSON.stringify(data));
          } catch (e) {
            console.warn('Cache local plein ou inaccessible');
          }
        }
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
