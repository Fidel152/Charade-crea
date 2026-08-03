import React from 'react';
import { ActivePage, Product, SiteSettings } from '../types.ts';
import { Sparkles, ArrowRight, ShieldCheck, Scissors, Heart, Palette, Star, ChevronRight } from 'lucide-react';

interface HomeProps {
  products: Product[];
  setActivePage: (page: ActivePage) => void;
  onSelectProduct: (product: Product) => void;
  siteSettings?: SiteSettings;
}

export const Home: React.FC<HomeProps> = ({ products, setActivePage, onSelectProduct, siteSettings }) => {
  const featured = products.slice(0, 3);
  const heroImg = siteSettings?.heroImageUrl || "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1000";

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Text Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F3ECE4] border border-[#E2D4C6] text-[#8C6D58] text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>Atelier de Maroquinerie Artisanale</span>
              </div>

              <h1 className="font-serif-artisan text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C2421] leading-[1.15] tracking-tight">
                Des sacs uniques créés selon vos envies
              </h1>

              <p className="text-lg sm:text-xl text-[#6B5C55] font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Bienvenue chez <strong className="font-semibold text-[#2C2421]">Charade-Crea</strong>. Chaque sac est pensé, découpé et confectionné à la main avec des matériaux nobles pour refléter votre personnalité.
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  id="hero-cta-creations"
                  onClick={() => {
                    setActivePage('creations');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-[#8C6D58] text-white font-semibold text-base rounded-full shadow-md hover:bg-[#735744] hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <span>Voir nos créations</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="hero-cta-order"
                  onClick={() => {
                    setActivePage('order');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-[#FAF8F5] text-[#2C2421] border-2 border-[#D4A373] font-semibold text-base rounded-full hover:bg-[#D4A373] hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-[#D4A373] group-hover:text-white" />
                  <span>Commander</span>
                </button>
              </div>

              {/* Badges / Guarantees */}
              <div className="pt-8 border-t border-[#E8E2D9] grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <div className="font-serif-artisan text-2xl font-bold text-[#8C6D58]">100%</div>
                  <div className="text-xs text-[#7A6B63]">Fait Main</div>
                </div>
                <div>
                  <div className="font-serif-artisan text-2xl font-bold text-[#8C6D58]">Sur-Mesure</div>
                  <div className="text-xs text-[#7A6B63]">Personnalisable</div>
                </div>
                <div>
                  <div className="font-serif-artisan text-2xl font-bold text-[#8C6D58]">Qualité</div>
                  <div className="text-xs text-[#7A6B63]">Matériaux Nobles</div>
                </div>
              </div>
            </div>

            {/* Hero Image Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative Frame Effect */}
                <div className="absolute -inset-3 bg-gradient-to-tr from-[#D4A373]/30 to-[#8C6D58]/20 rounded-3xl transform rotate-2 blur-xs"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-4/5">
                  <img
                    src={heroImg}
                    alt="Sac artisanal sur-mesure Charade-Crea"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#8C6D58] text-white flex items-center justify-center font-bold text-sm">
                        CC
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#2C2421]">Création Fait Main</div>
                        <div className="text-xs text-[#7A6B63]">Cabas Éléganza en cuir & jute bio</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Craftsmanship Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#8C6D58] font-bold">Pourquoi choisir Charade-Crea ?</span>
          <h2 className="font-serif-artisan text-3xl sm:text-4xl font-bold text-[#2C2421] mt-1">
            L'Art de la Création Personnalisée
          </h2>
          <div className="w-16 h-0.5 bg-[#D4A373] mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#E8E2D9] shadow-xs hover:shadow-md transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#F3ECE4] text-[#8C6D58] flex items-center justify-center">
              <Scissors className="w-6 h-6" />
            </div>
            <h3 className="font-serif-artisan text-2xl font-bold text-[#2C2421]">Savoir-Faire Artisanal</h3>
            <p className="text-sm text-[#6B5C55] leading-relaxed">
              Chaque sac est confectionné un par un dans notre atelier. Du patron initial à la dernière couture, une attention minutieuse est portée à chaque détail.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E8E2D9] shadow-xs hover:shadow-md transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#F3ECE4] text-[#8C6D58] flex items-center justify-center">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="font-serif-artisan text-2xl font-bold text-[#2C2421]">Personnalisation Totale</h3>
            <p className="text-sm text-[#6B5C55] leading-relaxed">
              Choix des matières, des couleurs, du format, de la doublure et des finitions. Exprimez vos préférences pour un accessoire totalement unique.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E8E2D9] shadow-xs hover:shadow-md transition-all duration-300 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#F3ECE4] text-[#8C6D58] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif-artisan text-2xl font-bold text-[#2C2421]">Qualité & Durabilité</h3>
            <p className="text-sm text-[#6B5C55] leading-relaxed">
              Nous sélectionnons des matières de premier choix (cuir pleine fleur, jacquard noble, coton bio) assurant longévité et esthétique irréprochable.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Creations Showcase */}
      <section className="bg-[#F3ECE4] py-16 border-y border-[#E2D4C6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8C6D58] font-bold">Galerie d'Inspiration</span>
              <h2 className="font-serif-artisan text-3xl sm:text-4xl font-bold text-[#2C2421] mt-1">
                Dernières Créations Réalisées
              </h2>
            </div>
            <button
              onClick={() => {
                setActivePage('creations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="mt-4 md:mt-0 flex items-center space-x-1 text-sm font-semibold text-[#8C6D58] hover:text-[#2C2421] transition-colors"
            >
              <span>Voir toute la collection</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-[#E8E2D9] cursor-pointer flex flex-col"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-[#FAF8F5]">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-[#8C6D58] shadow-xs">
                    {prod.price}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-artisan text-2xl font-bold text-[#2C2421] group-hover:text-[#8C6D58] transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-[#7A6B63] mt-1 line-clamp-2">
                      {prod.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F0EAE1] flex items-center justify-between text-xs text-[#8C6D58] font-medium">
                    <span>{prod.material}</span>
                    <span className="flex items-center text-[#D4A373] group-hover:translate-x-1 transition-transform">
                      Détails &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Custom Order Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#8C6D58] font-bold">Simple & Sur-Mesure</span>
          <h2 className="font-serif-artisan text-3xl sm:text-4xl font-bold text-[#2C2421] mt-1">
            Comment commander votre sac ?
          </h2>
          <p className="text-sm text-[#7A6B63] mt-2"> Un accompagnement personnalisé à chaque étape de la réalisation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] text-center space-y-3 relative">
            <div className="w-10 h-10 rounded-full bg-[#8C6D58] text-white font-serif-artisan text-lg font-bold flex items-center justify-center mx-auto">
              1
            </div>
            <h4 className="font-bold text-[#2C2421] text-base">Votre Idée</h4>
            <p className="text-xs text-[#7A6B63]">
              Remplissez notre formulaire de commande en décrivant le sac de vos rêves (matière, couleur, forme).
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] text-center space-y-3 relative">
            <div className="w-10 h-10 rounded-full bg-[#8C6D58] text-white font-serif-artisan text-lg font-bold flex items-center justify-center mx-auto">
              2
            </div>
            <h4 className="font-bold text-[#2C2421] text-base">Échanges & Devis</h4>
            <p className="text-xs text-[#7A6B63]">
              Nous vous contactons pour valider les détails techniques, le choix des tissus et vous proposer un devis personnalisé.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] text-center space-y-3 relative">
            <div className="w-10 h-10 rounded-full bg-[#8C6D58] text-white font-serif-artisan text-lg font-bold flex items-center justify-center mx-auto">
              3
            </div>
            <h4 className="font-bold text-[#2C2421] text-base">Fabrication Main</h4>
            <p className="text-xs text-[#7A6B63]">
              Votre sac prend vie dans notre atelier avec un suivi photos des étapes de création si vous le souhaitez.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] text-center space-y-3 relative">
            <div className="w-10 h-10 rounded-full bg-[#8C6D58] text-white font-serif-artisan text-lg font-bold flex items-center justify-center mx-auto">
              4
            </div>
            <h4 className="font-bold text-[#2C2421] text-base">Expédition Soignée</h4>
            <p className="text-xs text-[#7A6B63]">
              Votre pièce unique est emballée avec soin et expédiée directement chez vous ou prête à être offerte.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => {
              setActivePage('order');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-[#D4A373] text-white font-semibold rounded-full shadow-md hover:bg-[#C28E5E] transition-all"
          >
            Lancer votre commande personnalisée
          </button>
        </div>
      </section>
    </div>
  );
};
