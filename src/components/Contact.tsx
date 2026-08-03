import React, { useState } from 'react';
import { ActivePage, SiteSettings } from '../types.ts';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2, Instagram, Facebook, AlertCircle, ShieldAlert } from 'lucide-react';

interface ContactProps {
  setActivePage: (page: ActivePage) => void;
  siteSettings?: SiteSettings;
}

export const Contact: React.FC<ContactProps> = ({ setActivePage, siteSettings }) => {
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMsg(false);

    const hasSecretKey =
      formData.name.toLowerCase().includes('charade') ||
      formData.email.toLowerCase().includes('charade') ||
      formData.message.toLowerCase().includes('charade');

    // If secret key is entered in any field, bypass requirement checks
    if (!hasSecretKey) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
        setErrorMessage('Veuillez remplir votre nom, email et votre message.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name || 'Admin',
        email: formData.email || 'admin@charade-crea.fr',
        phone: formData.phone || '',
        message: formData.message || 'charade',
      };

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // Check if secret trigger keyword was typed
      if (data.isSecretKey && data.redirectUrl) {
        // Redirection vers l'espace administration caché
        setActivePage('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi du message.');
      }

      setSuccessMsg(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 space-y-12">
      {/* Header */}
      <section className="bg-[#F3ECE4] py-12 border-b border-[#E2D4C6]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#8C6D58] font-bold">À votre écoute</span>
          <h1 className="font-serif-artisan text-4xl sm:text-5xl font-bold text-[#2C2421]">
            Contactez l'Atelier Charade-Crea
          </h1>
          <p className="text-sm sm:text-base text-[#6B5C55] font-light max-w-xl mx-auto">
            Une question sur une création ? Un projet spécial ? N'hésitez pas à nous contacter par téléphone, WhatsApp ou via le formulaire ci-dessous.
          </p>
        </div>
      </section>

      {/* Grid Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Info Card Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-[#E8E2D9] shadow-xs space-y-6">
              <h3 className="font-serif-artisan text-2xl font-bold text-[#2C2421]">
                Informations Pratiques
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9]">
                  <div className="w-10 h-10 rounded-xl bg-[#F3ECE4] text-[#8C6D58] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#8C6D58] uppercase">Téléphone Direct</div>
                    <a href={`tel:${settings.phone}`} className="text-base font-semibold text-[#2C2421] hover:text-[#8C6D58]">
                      {settings.phone}
                    </a>
                    <div className="text-xs text-[#7A6B63] mt-0.5">{settings.workingHours}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9]">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-700 uppercase">Discussion WhatsApp</div>
                    <a
                      href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-[#2C2421] hover:text-emerald-700 underline"
                    >
                      Échanger en direct sur WhatsApp ({settings.whatsapp})
                    </a>
                    <div className="text-xs text-[#7A6B63] mt-0.5">Réponse rapide garantie</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9]">
                  <div className="w-10 h-10 rounded-xl bg-[#F3ECE4] text-[#8C6D58] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#8C6D58] uppercase">Adresse Email</div>
                    <a href={`mailto:${settings.email}`} className="text-sm font-semibold text-[#2C2421] hover:text-[#8C6D58]">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9]">
                  <div className="w-10 h-10 rounded-xl bg-[#F3ECE4] text-[#8C6D58] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#8C6D58] uppercase">Atelier Artisan</div>
                    <div className="text-sm font-semibold text-[#2C2421]">{settings.address}</div>
                    <div className="text-xs text-[#7A6B63] mt-0.5">Visite de l'atelier uniquement sur RDV</div>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="pt-4 border-t border-[#E8E2D9]">
                <div className="text-xs font-semibold text-[#7A6B63] mb-3">Suivez-nous sur les réseaux</div>
                <div className="flex items-center space-x-3">
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs font-semibold text-[#2C2421] hover:bg-[#8C6D58] hover:text-white transition-all"
                  >
                    <Instagram className="w-4 h-4 text-[#D4A373]" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-xs font-semibold text-[#2C2421] hover:bg-[#8C6D58] hover:text-white transition-all"
                  >
                    <Facebook className="w-4 h-4 text-[#D4A373]" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E8E2D9] shadow-sm space-y-6">
              
              <div>
                <h3 className="font-serif-artisan text-2xl font-bold text-[#2C2421]">
                  Envoyez-nous un Message
                </h3>
                <p className="text-xs text-[#7A6B63] mt-1">
                  Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais.
                </p>
              </div>

              {successMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Votre message a bien été transmis à l'atelier Charade-Crea. Merci !</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                      Votre Nom <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Claire Martin"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      placeholder="06 00 00 00 00"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                    />
                  </div>
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

                <div>
                  <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                    Votre Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Posez votre question ou détaillez votre demande..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    id="contact-form-submit-btn"
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-[#8C6D58] text-white font-semibold text-sm rounded-full shadow-md hover:bg-[#735744] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Envoi en cours...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Envoyer mon message</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
