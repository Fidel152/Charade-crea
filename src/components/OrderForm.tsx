import React, { useState, useEffect } from 'react';
import { Product, ActivePage } from '../types.ts';
import { Sparkles, CheckCircle2, Image as ImageIcon, Send, AlertCircle, Info } from 'lucide-react';

interface OrderFormProps {
  prefilledProduct: Product | null;
  setActivePage: (page: ActivePage) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ prefilledProduct, setActivePage }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    bagType: 'Sac Cabas',
    color: '',
    material: '',
    description: '',
    referenceImage: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Sample bag types option list
  const bagTypesOptions = [
    'Sac Cabas',
    'Pochette de Soirée',
    'Sac Besace / Bandoulière',
    'Sac à Dos City',
    'Sac Seau',
    'Sac à Main Rigide',
    'Trousse / Vanity',
    'Autre modèle sur-mesure',
  ];

  useEffect(() => {
    if (prefilledProduct) {
      setFormData((prev) => ({
        ...prev,
        bagType: prefilledProduct.name,
        color: prefilledProduct.color,
        material: prefilledProduct.material,
        description: `Demande basée sur le modèle "${prefilledProduct.name}". Description : ${prefilledProduct.description}`,
        referenceImage: prefilledProduct.imageUrl,
      }));
    }
  }, [prefilledProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.customerName || !formData.phone || !formData.email || !formData.description) {
      setErrorMessage('Veuillez remplir votre nom, téléphone, email et la description de votre projet.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi de la commande.');
      }

      setSubmittedOrder(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur réseau est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 space-y-12">
      {/* Banner */}
      <section className="bg-[#F3ECE4] py-12 border-b border-[#E2D4C6]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#8C6D58] font-bold">Sur-Mesure & Personnalisation</span>
          <h1 className="font-serif-artisan text-4xl sm:text-5xl font-bold text-[#2C2421]">
            Demander un Sac Personnalisé
          </h1>
          <p className="text-sm sm:text-base text-[#6B5C55] font-light max-w-2xl mx-auto">
            Décrivez-nous votre projet. Nous réaliserons une étude et nous vous recontacterons rapidement avec une proposition et un devis personnalisé.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {submittedOrder ? (
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E8E2D9] shadow-lg text-center space-y-6">
            <div className="w-16 h-16 bg-[#F3ECE4] text-[#8C6D58] rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-[#8C6D58]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#8C6D58] uppercase tracking-widest">
                Demande N° #{submittedOrder.id} transmise
              </span>
              <h2 className="font-serif-artisan text-3xl font-bold text-[#2C2421]">
                Merci {submittedOrder.customerName} !
              </h2>
              <p className="text-sm text-[#6B5C55] max-w-lg mx-auto">
                Votre demande de sac sur-mesure a bien été enregistrée dans notre atelier. Nous allons examiner votre projet et vous recontacter par email (<strong className="text-[#2C2421]">{submittedOrder.email}</strong>) ou téléphone (<strong className="text-[#2C2421]">{submittedOrder.phone}</strong>) dans les plus brefs délais.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] text-left text-xs text-[#5C4F4A] space-y-1.5 max-w-md mx-auto">
              <div><strong className="text-[#2C2421]">Type de sac :</strong> {submittedOrder.bagType}</div>
              <div><strong className="text-[#2C2421]">Statut :</strong> <span className="text-[#D4A373] font-bold">Nouvelle demande reçue</span></div>
              <div><strong className="text-[#2C2421]">Date :</strong> {new Date().toLocaleDateString('fr-FR')}</div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  setSubmittedOrder(null);
                  setFormData({
                    customerName: '',
                    phone: '',
                    email: '',
                    bagType: 'Sac Cabas',
                    color: '',
                    material: '',
                    description: '',
                    referenceImage: '',
                  });
                }}
                className="px-6 py-3 bg-[#FAF8F5] border border-[#E8E2D9] text-[#2C2421] font-semibold text-xs rounded-full hover:bg-[#EFE8DF]"
              >
                Passer une autre demande
              </button>
              <button
                onClick={() => {
                  setActivePage('creations');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-[#8C6D58] text-white font-semibold text-xs rounded-full shadow-md hover:bg-[#735744]"
              >
                Découvrir d'autres créations
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E8E2D9] shadow-sm space-y-8">
            
            {prefilledProduct && (
              <div className="p-4 rounded-2xl bg-[#F3ECE4] border border-[#E2D4C6] flex items-center space-x-4">
                <img
                  src={prefilledProduct.imageUrl}
                  alt={prefilledProduct.name}
                  className="w-16 h-16 object-cover rounded-xl border border-white"
                />
                <div>
                  <div className="text-xs font-bold text-[#8C6D58] uppercase">Modèle sélectionné</div>
                  <div className="font-serif-artisan text-lg font-bold text-[#2C2421]">{prefilledProduct.name}</div>
                  <div className="text-xs text-[#7A6B63]">{prefilledProduct.price}</div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                    Votre Nom complet <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Marie Dupont"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                    Téléphone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="06 12 34 56 78"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                    Adresse Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="votre@email.fr"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                  />
                </div>
              </div>

              {/* Bag Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                    Type de sac <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.bagType}
                    onChange={(e) => setFormData({ ...formData, bagType: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                  >
                    {bagTypesOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                    Couleur souhaitée
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Cognac, Bleu Marine, Terracotta..."
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                    Matière souhaitée
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Cuir, Suédine, Jacquard, Toile bio..."
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                  Description de votre modèle souhaité <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Précisez les dimensions souhaitées, les rangements intérieurs, la longueur des anses, la présence d'une fermeture zippée..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                />
              </div>

              {/* Inspiration Image URL */}
              <div>
                <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                  Lien vers une image d'inspiration (URL optionnelle)
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-[#8C6D58] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://exemple.com/mon-image-inspiration.jpg"
                    value={formData.referenceImage || ''}
                    onChange={(e) => setFormData({ ...formData, referenceImage: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                  />
                </div>
                <p className="text-[11px] text-[#7A6B63] mt-1 flex items-center space-x-1">
                  <Info className="w-3 h-3 text-[#D4A373] inline" />
                  <span>Vous pouvez coller l'URL d'un croquis ou d'une photo d'inspiration.</span>
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  id="submit-order-form-btn"
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#8C6D58] text-white font-semibold text-base rounded-full shadow-md hover:bg-[#735744] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Envoi en cours...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Envoyer ma demande</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}
      </section>
    </div>
  );
};
