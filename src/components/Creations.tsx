import React, { useState } from 'react';
import { Product, ActivePage } from '../types.ts';
import { Search, Filter, Sparkles, X, ChevronRight, ShoppingBag, Eye } from 'lucide-react';

interface CreationsProps {
  products: Product[];
  setActivePage: (page: ActivePage) => void;
  onSelectProductForOrder: (product: Product) => void;
}

export const Creations: React.FC<CreationsProps> = ({
  products,
  setActivePage,
  onSelectProductForOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);

  // Extract unique materials
  const materials = ['all', ...Array.from(new Set(products.map((p) => p.material.split('&')[0].trim()).filter(Boolean)))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.material.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMaterial =
      selectedMaterial === 'all' ||
      p.material.toLowerCase().includes(selectedMaterial.toLowerCase());

    return matchesSearch && matchesMaterial;
  });

  return (
    <div className="pt-28 pb-20 space-y-12">
      {/* Header Banner */}
      <section className="bg-[#F3ECE4] py-12 border-b border-[#E2D4C6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#8C6D58] font-bold">Galerie Artisanale</span>
          <h1 className="font-serif-artisan text-4xl sm:text-5xl font-bold text-[#2C2421]">
            Nos Créations & Modèles
          </h1>
          <p className="text-sm sm:text-base text-[#6B5C55] max-w-2xl mx-auto font-light">
            Découvrez nos sacs confectionnés à la main. Chaque modèle peut être reproduit à l'identique ou personnalisé selon vos souhaits.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Search & Filter Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E8E2D9] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#8C6D58] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom, couleur, matière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58] transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C6D58] hover:text-[#2C2421]"
              >
                Effacer
              </button>
            )}
          </div>

          {/* Material Pills Filter */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-[#8C6D58] shrink-0 mr-1 hidden sm:block" />
            {materials.map((mat) => (
              <button
                key={mat}
                onClick={() => setSelectedMaterial(mat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedMaterial === mat
                    ? 'bg-[#8C6D58] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#5C4F4A] hover:bg-[#EFE8DF] border border-[#E8E2D9]'
                }`}
              >
                {mat === 'all' ? 'Toutes les matières' : mat}
              </button>
            ))}
          </div>

        </div>

        {/* Gallery Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E8E2D9] text-center space-y-4">
            <div className="w-12 h-12 bg-[#F3ECE4] text-[#8C6D58] rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-serif-artisan text-2xl font-bold text-[#2C2421]">Aucun sac trouvé</h3>
            <p className="text-sm text-[#7A6B63] max-w-md mx-auto">
              Aucun résultat ne correspond à votre recherche "{searchTerm}". Essayez d'autres mots-clés ou consultez toute la collection.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedMaterial('all');
              }}
              className="px-4 py-2 bg-[#8C6D58] text-white text-xs font-semibold rounded-full"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-[#E8E2D9] flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-4/3 overflow-hidden bg-[#FAF8F5]">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-[#8C6D58] shadow-xs">
                      {prod.price}
                    </div>
                    <button
                      onClick={() => setSelectedProductModal(prod)}
                      className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-xs space-x-1.5 backdrop-blur-xs"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Aperçu rapide</span>
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-6 space-y-3">
                    <h3 className="font-serif-artisan text-2xl font-bold text-[#2C2421] group-hover:text-[#8C6D58] transition-colors">
                      {prod.name}
                    </h3>

                    <p className="text-xs text-[#6B5C55] leading-relaxed line-clamp-3">
                      {prod.description}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
                      <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E8E2D9] text-[#7A6B63]">
                        <strong className="text-[#2C2421]">Matière:</strong> {prod.material}
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E8E2D9] text-[#7A6B63]">
                        <strong className="text-[#2C2421]">Couleur:</strong> {prod.color}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions footer */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => onSelectProductForOrder(prod)}
                    className="w-full py-3 bg-[#FAF8F5] border border-[#D4A373] text-[#2C2421] hover:bg-[#8C6D58] hover:text-white hover:border-[#8C6D58] rounded-xl font-semibold text-xs transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span>Demander ce modèle sur-mesure</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Product Quick View Modal */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E8E2D9] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProductModal(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#2C2421] flex items-center justify-center shadow-md transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-square bg-[#FAF8F5] overflow-hidden">
                <img
                  src={selectedProductModal.imageUrl}
                  alt={selectedProductModal.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs uppercase font-bold text-[#8C6D58] tracking-widest">Création Charade-Crea</span>
                    <h2 className="font-serif-artisan text-3xl font-bold text-[#2C2421] mt-1">
                      {selectedProductModal.name}
                    </h2>
                    <div className="text-lg font-bold text-[#D4A373] mt-1">
                      {selectedProductModal.price}
                    </div>
                  </div>

                  <p className="text-xs text-[#6B5C55] leading-relaxed">
                    {selectedProductModal.description}
                  </p>

                  <div className="space-y-2 text-xs text-[#5C4F4A] pt-2 border-t border-[#E8E2D9]">
                    <div>
                      <strong className="text-[#2C2421]">Matières :</strong> {selectedProductModal.material}
                    </div>
                    <div>
                      <strong className="text-[#2C2421]">Teinte / Couleur :</strong> {selectedProductModal.color}
                    </div>
                    <div>
                      <strong className="text-[#2C2421]">Fabrication :</strong> Fait main sur commande
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <button
                    onClick={() => {
                      const p = selectedProductModal;
                      setSelectedProductModal(null);
                      onSelectProductForOrder(p);
                    }}
                    className="w-full py-3.5 bg-[#8C6D58] text-white font-semibold rounded-xl text-xs shadow-md hover:bg-[#735744] transition-all flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Commander ce modèle personnalisé</span>
                  </button>
                  <button
                    onClick={() => setSelectedProductModal(null)}
                    className="w-full py-2 text-xs text-[#7A6B63] hover:text-[#2C2421]"
                  >
                    Continuer la navigation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
