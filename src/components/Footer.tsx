import React from 'react';
import { ActivePage, SiteSettings } from '../types.ts';
import { ShoppingBag, Heart, Instagram, Facebook, Mail, Phone, MapPin, ShieldCheck, Lock } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
  siteSettings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage, siteSettings }) => {
  const settings = siteSettings || {
    phone: '+33 6 12 34 56 78',
    whatsapp: '33612345678',
    email: 'contact@charade-crea.fr',
    address: 'Atelier Artisanal Charade-Crea, Diego-Suarez, Madagascar',
    instagramUrl: 'https://instagram.com',
    facebookUrl: 'https://facebook.com',
    workingHours: 'Du lundi au samedi (9h - 18h30)',
    slogan: 'Des sacs uniques faits main selon vos envies',
  };

  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#2C2421] text-[#E8E2D9] pt-16 pb-12 border-t border-[#423733]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#423733]">
          {/* Column 1: Brand & Craftsmanship */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#D4A373] text-white flex items-center justify-center overflow-hidden shrink-0">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo Charade-Crea" className="w-full h-full object-cover" />
                ) : (
                  <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                )}
              </div>
              <span className="font-serif-artisan text-2xl font-bold tracking-tight text-white">
                Charade-Crea
              </span>
            </div>
            <p className="text-sm text-[#B8ACA3] leading-relaxed">
              {settings.slogan}. Créations artisanales uniques & pièces sur-mesure confectionnées avec passion dans notre atelier.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#3D332F] flex items-center justify-center text-[#D4A373] hover:bg-[#D4A373] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#3D332F] flex items-center justify-center text-[#D4A373] hover:bg-[#D4A373] hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Navigation */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 tracking-wide font-serif-artisan text-lg">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm text-[#B8ACA3]">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-[#D4A373] transition-colors"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('creations')}
                  className="hover:text-[#D4A373] transition-colors"
                >
                  Nos Créations & Galerie
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('order')}
                  className="hover:text-[#D4A373] transition-colors"
                >
                  Commander un Sac Sur-Mesure
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-[#D4A373] transition-colors"
                >
                  Savoir-faire & Histoire
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-[#D4A373] transition-colors"
                >
                  Contact & Atelier
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Hours */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 tracking-wide font-serif-artisan text-lg">
              Atelier & Contact
            </h3>
            <ul className="space-y-3 text-sm text-[#B8ACA3]">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#D4A373] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">{settings.phone}</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#D4A373] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">{settings.email}</a>
              </li>
              <li className="pt-2 text-xs text-[#9E9086]">
                {settings.workingHours}
              </li>
            </ul>
          </div>

          {/* Column 4: Engagement Qualité */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-base mb-4 tracking-wide font-serif-artisan text-lg">
              Engagements
            </h3>
            <div className="p-4 rounded-2xl bg-[#382E2A] border border-[#4A3D38] space-y-2">
              <div className="flex items-center space-x-2 text-[#D4A373] font-medium text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Fabrication 100% Artisanale</span>
              </div>
              <p className="text-xs text-[#B8ACA3] leading-normal">
                Chaque pièce est découpée, assemblée et cousue à la main avec des matériaux rigoureusement sélectionnés.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9E9086] space-y-4 sm:space-y-0">
          <p className="flex items-center space-x-1">
            <span>© {new Date().getFullYear()} Charade-Crea. Fait avec</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline mx-0.5" />
            <span>Tous droits réservés.</span>
            <button
              onClick={() => handleNav('admin')}
              className="ml-2 opacity-30 hover:opacity-100 transition-opacity p-1 text-[#D4A373]"
              title="Accès Administration"
              aria-label="Accès Administration"
            >
              <Lock className="w-3 h-3 inline" />
            </button>
          </p>
          <div className="flex items-center space-x-6">
            <span>Qualité Fait Main</span>
            <span>•</span>
            <span>Pièces Uniques</span>
            <span>•</span>
            <span>Expédition Soignée</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
