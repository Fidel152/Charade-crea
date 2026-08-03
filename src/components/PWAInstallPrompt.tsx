import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles } from 'lucide-react';

interface PWAInstallPromptProps {
  deferredPrompt: any;
  onInstall: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ deferredPrompt, onInstall }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!deferredPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-[#2C2421] text-white p-4 rounded-2xl shadow-2xl border border-[#423733] animate-fadeIn flex items-start space-x-3">
      <div className="w-10 h-10 rounded-xl bg-[#D4A373] text-white flex items-center justify-center shrink-0 font-serif-artisan font-bold text-lg">
        CC
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">Application PWA</span>
          <button
            onClick={() => setDismissed(true)}
            className="text-[#9E9086] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs font-medium text-white">Installer l'application Charade-Crea</p>
        <p className="text-[11px] text-[#B8ACA3]">
          Accédez rapidement au catalogue et à vos commandes directement depuis votre écran d'accueil.
        </p>
        <div className="pt-2">
          <button
            onClick={onInstall}
            className="px-3.5 py-1.5 bg-[#D4A373] text-white text-xs font-bold rounded-lg hover:bg-[#C28E5E] transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Installer l'application</span>
          </button>
        </div>
      </div>
    </div>
  );
};
