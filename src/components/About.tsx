import React from 'react';
import { ActivePage } from '../types.ts';
import { Heart, Sparkles, Scissors, ShieldCheck, Award, Layers } from 'lucide-react';

interface AboutProps {
  setActivePage: (page: ActivePage) => void;
}

export const About: React.FC<AboutProps> = ({ setActivePage }) => {
  return (
    <div className="pt-28 pb-16 space-y-16">
      {/* Page Header */}
      <section className="bg-[#F3ECE4] py-16 border-b border-[#E2D4C6]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#8C6D58] font-bold">Notre Passion & Engagements</span>
          <h1 className="font-serif-artisan text-4xl sm:text-5xl font-bold text-[#2C2421]">
            L'Histoire & le Savoir-Faire de Charade-Crea
          </h1>
          <p className="text-base sm:text-lg text-[#6B5C55] font-light leading-relaxed max-w-2xl mx-auto">
            Une démarche passionnée au service de la maroquinerie faite main, où chaque fil, chaque couture et chaque coupe célèbrent la singularité.
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#F3ECE4] text-[#8C6D58] text-xs font-semibold rounded-full">
              <Heart className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Création Artisanale - Diego-Suarez, Madagascar</span>
            </div>
            <h2 className="font-serif-artisan text-3xl sm:text-4xl font-bold text-[#2C2421] leading-tight">
              Une histoire née du goût du fait-main et du beau geste
            </h2>
            <p className="text-sm sm:text-base text-[#6B5C55] leading-relaxed">
              Fondée par une créatrice passionnée de textile et de maroquinerie, <strong>Charade-Crea</strong> est née d'un désir simple : proposer des sacs durables, esthétiques et empreints d'authenticité.
            </p>
            <p className="text-sm sm:text-base text-[#6B5C55] leading-relaxed">
              Dans un monde dominé par la production industrielle en série, Charade-Crea remet l'humain et la créativité au cœur du processus. Chaque sac est pensé comme un objet d'art quotidien, fait pour traverser le temps avec grâce.
            </p>
            <div className="p-4 rounded-xl bg-[#FAF8F5] border-l-4 border-[#8C6D58] text-[#5C4F4A] italic text-sm">
              « Créer un sac sur mesure, c'est façonner un complice du quotidien qui vous ressemble vraiment. »
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white aspect-4/3">
              <img
                src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1000"
                alt="Atelier de confection artisanale Charade-Crea"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-lg border border-[#E8E2D9] hidden sm:block max-w-xs">
              <div className="flex items-center space-x-3">
                <Scissors className="w-8 h-8 text-[#8C6D58]" />
                <div>
                  <div className="font-serif-artisan text-xl font-bold text-[#2C2421]">100% Main</div>
                  <div className="text-xs text-[#7A6B63]">Découpe & assemblage atelier</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Materials & Know-How Grid */}
      <section className="bg-[#FAF8F5] py-16 border-y border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#8C6D58] font-bold">Matériaux d'exception</span>
            <h2 className="font-serif-artisan text-3xl font-bold text-[#2C2421] mt-1">
              Des matières sélectionnées avec exigence
            </h2>
            <p className="text-sm text-[#7A6B63] mt-2">
              Le secret d'un sac d'exception réside dans la qualité irréprochable de ses composants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-[#E8E2D9] space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#F3ECE4] text-[#8C6D58] flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-serif-artisan text-2xl font-bold text-[#2C2421]">Cuir & Suédine Nobles</h3>
              <p className="text-sm text-[#6B5C55] leading-relaxed">
                Des cuirs souples au toucher soyeux, sélectionnés auprès de tanneries respectueuses, associés à des suédines aux teintes chaleureuses.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#E8E2D9] space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#F3ECE4] text-[#8C6D58] flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-serif-artisan text-2xl font-bold text-[#2C2421]">Tissus & Jacquards Rares</h3>
              <p className="text-sm text-[#6B5C55] leading-relaxed">
                Des toiles de jute bio, des jacquards tissés riches en motifs et des cotons imprimés qui apportent une touche graphique originale.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#E8E2D9] space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#F3ECE4] text-[#8C6D58] flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-serif-artisan text-2xl font-bold text-[#2C2421]">Bouclerie & Finitions</h3>
              <p className="text-sm text-[#6B5C55] leading-relaxed">
                Fermoirs magnétiques robustes, mousquetons en laiton vieilli, mousses de maintien et coutures renforcées pour un sac prêt à durer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Creation Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#8C6D58] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#E8D1BE] font-bold">Inspiration Sur-Mesure</span>
            <h2 className="font-serif-artisan text-3xl sm:text-4xl font-bold">
              Vous avez un projet de sac en tête ?
            </h2>
            <p className="text-sm sm:text-base text-[#F3ECE4] font-light leading-relaxed">
              Confiez-nous votre idée : choix des dimensions, compartiments intérieurs, couleurs préférées et matières de votre choix.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setActivePage('order');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-[#D4A373] text-white font-semibold rounded-full shadow-lg hover:bg-[#C28E5E] transition-colors"
              >
                Créer mon sac personnalisé
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
