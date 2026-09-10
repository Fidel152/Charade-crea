import React, { useState, useEffect, useRef } from 'react';
import { Product, Order, MessageItem, ActivePage, SiteSettings } from '../types.ts';
import { compressImage } from '../utils/imageCompressor.ts';
import {
  Lock, KeyRound, LogOut, Plus, Trash2, Edit, RefreshCw, ShoppingBag,
  Inbox, FileText, CheckCircle, Clock, Sparkles, Image as ImageIcon,
  AlertCircle, Eye, ChevronRight, X, Filter, ExternalLink, Camera,
  Upload, Sliders, Settings, Phone, Mail, MapPin, MessageSquare, Instagram,
  Facebook, Check, Save
} from 'lucide-react';

interface AdminDashboardProps {
  setActivePage: (page: ActivePage) => void;
  onRefreshProducts: () => void;
  siteSettings?: SiteSettings;
  onRefreshSettings?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  setActivePage,
  onRefreshProducts,
  siteSettings,
  onRefreshSettings,
}) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('charade_admin_token'));
  const [loginEmail, setLoginEmail] = useState('admin@charade-crea.fr');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'messages' | 'settings'>('overview');

  // Admin Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messagesList, setMessagesList] = useState<MessageItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isCompressingImage, setIsCompressingImage] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    material: '',
    color: '',
    price: '85 €',
    imageUrl: '',
  });

  // Camera & File Upload states for Product, Logo, and Hero photos
  const [cameraTarget, setCameraTarget] = useState<'product' | 'logo' | 'hero'>('product');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const logoFileInputRef = useRef<HTMLInputElement | null>(null);
  const heroFileInputRef = useRef<HTMLInputElement | null>(null);

  // Site Settings Form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({
    phone: siteSettings?.phone || '+33 6 12 34 56 78',
    whatsapp: siteSettings?.whatsapp || '33612345678',
    email: siteSettings?.email || 'contact@charade-crea.fr',
    address: siteSettings?.address || 'Atelier Artisanal Charade-Crea, Diego-Suarez, Madagascar',
    instagramUrl: siteSettings?.instagramUrl || 'https://instagram.com',
    facebookUrl: siteSettings?.facebookUrl || 'https://facebook.com',
    workingHours: siteSettings?.workingHours || "Du lundi au samedi (9h - 18h30)",
    slogan: siteSettings?.slogan || 'Des sacs uniques faits main selon vos envies',
    logoUrl: siteSettings?.logoUrl || '',
    heroImageUrl: siteSettings?.heroImageUrl || 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1000',
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Synchronize settingsForm when siteSettings prop arrives
  useEffect(() => {
    if (siteSettings) {
      setSettingsForm(siteSettings);
    }
  }, [siteSettings]);

  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Sample image suggestions for creation upload
  const sampleImages = [
    { label: 'Cabas Cuir & Jute', url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800' },
    { label: 'Pochette Jacquard', url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=800' },
    { label: 'Besace Suédine', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800' },
    { label: 'Sac à Dos City', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800' },
    { label: 'Mini Sac Seau', url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800' },
  ];

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoadingAuth(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Connexion échouée.');
      }

      localStorage.setItem('charade_admin_token', data.token);
      setToken(data.token);
      setLoginPassword('');
    } catch (err: any) {
      setLoginError(err.message || 'Erreur de connexion');
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('charade_admin_token');
    setToken(null);
  };

  const fetchAdminData = async () => {
    if (!token) return;
    setLoadingData(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [resProd, resOrd, resMsg] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders', { headers }),
        fetch('/api/messages', { headers }),
      ]);

      if (resProd.ok) setProducts(await resProd.json());
      if (resOrd.ok) setOrders(await resOrd.json());
      if (resMsg.ok) setMessagesList(await resMsg.json());
    } catch (error) {
      console.error('Erreur chargement données admin :', error);
    } finally {
      setLoadingData(false);
    }
  };

  // Product CRUD
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsSavingProduct(true);
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productForm),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Erreur lors de la sauvegarde du produit.');
        return;
      }

      const savedProduct: Product = await res.json();

      // Immediately synchronize local storage cache so refresh never reverts
      try {
        const cached = localStorage.getItem('charade_products_cache');
        let list: Product[] = cached ? JSON.parse(cached) : [];
        if (editingProduct) {
          list = list.map((p) => (p.id === editingProduct.id ? savedProduct : p));
        } else {
          list = [savedProduct, ...list.filter((p) => p.id !== savedProduct.id)];
        }
        localStorage.setItem('charade_products_cache', JSON.stringify(list));
      } catch (errCache) {
        console.warn('Impossible d\'écrire dans le cache local :', errCache);
      }

      setIsAddProductOpen(false);
      setEditingProduct(null);
      setProductForm({ name: '', description: '', material: '', color: '', price: '85 €', imageUrl: '' });
      await fetchAdminData();
      onRefreshProducts();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette création du catalogue public ?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        try {
          const cached = localStorage.getItem('charade_products_cache');
          if (cached) {
            const list: Product[] = JSON.parse(cached);
            const filtered = list.filter((p) => p.id !== id);
            localStorage.setItem('charade_products_cache', JSON.stringify(filtered));
          }
        } catch {}
        fetchAdminData();
        onRefreshProducts();
      }
    } catch (error) {
      alert('Erreur lors de la suppression.');
    }
  };

  // Order status update
  const handleOrderStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchAdminData();
      }
    } catch (error) {
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

  const handleDeleteOrder = async (id: number) => {
    if (!confirm('Supprimer cette commande de l\'historique ?')) return;
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAdminData();
    } catch (error) {
      alert('Erreur lors de la suppression.');
    }
  };

  // Message delete
  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Supprimer ce message ?')) return;
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAdminData();
    } catch (error) {
      alert('Erreur lors de la suppression.');
    }
  };

  // CAMERA & UPLOAD HANDLERS
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingImage(true);
    try {
      const optimizedUrl = await compressImage(file, 1200, 1200, 0.82);
      setProductForm((prev) => ({ ...prev, imageUrl: optimizedUrl }));
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'optimisation de l\'image.');
    } finally {
      setIsCompressingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingImage(true);
    try {
      const optimizedUrl = await compressImage(file, 600, 600, 0.85);
      setSettingsForm((prev) => ({ ...prev, logoUrl: optimizedUrl }));
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'optimisation du logo.');
    } finally {
      setIsCompressingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingImage(true);
    try {
      const optimizedUrl = await compressImage(file, 1600, 1200, 0.82);
      setSettingsForm((prev) => ({ ...prev, heroImageUrl: optimizedUrl }));
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'optimisation de la photo.');
    } finally {
      setIsCompressingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const startCamera = async (target: 'product' | 'logo' | 'hero' = 'product') => {
    setCameraTarget(target);
    setCameraError('');
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        setCameraError('Impossible d\'accéder à l\'appareil photo. Veuillez vérifier les autorisations de votre navigateur.');
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    let width = video.videoWidth || 800;
    let height = video.videoHeight || 600;
    const maxDim = 1200;
    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      if (cameraTarget === 'product') {
        setProductForm((prev) => ({ ...prev, imageUrl: dataUrl }));
      } else if (cameraTarget === 'logo') {
        setSettingsForm((prev) => ({ ...prev, logoUrl: dataUrl }));
      } else if (cameraTarget === 'hero') {
        setSettingsForm((prev) => ({ ...prev, heroImageUrl: dataUrl }));
      }
    }
    stopCamera();
  };

  // SAVE SITE SETTINGS HANDLER
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSavingSettings(true);
    setSettingsSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingsForm),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur lors de la sauvegarde des paramètres.');
      }

      const updatedSettings = await res.json();

      try {
        localStorage.setItem('charade_settings_cache', JSON.stringify(updatedSettings));
      } catch {}

      setSettingsSuccess(true);
      if (onRefreshSettings) {
        onRefreshSettings();
      }
      setTimeout(() => setSettingsSuccess(false), 4000);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSavingSettings(false);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    if (orderStatusFilter === 'all') return true;
    return ord.status.toLowerCase() === orderStatusFilter.toLowerCase();
  });

  // If unauthenticated: show Admin Login Screen
  if (!token) {
    return (
      <div className="pt-32 pb-20 px-4 max-w-md mx-auto">
        <div className="bg-white p-8 rounded-3xl border border-[#E8E2D9] shadow-xl space-y-6 text-center">
          
          <div className="w-14 h-14 bg-[#F3ECE4] text-[#8C6D58] rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-[#8C6D58] tracking-widest">Zone Administrateur Protégée</span>
            <h1 className="font-serif-artisan text-3xl font-bold text-[#2C2421] mt-1">
              Atelier Charade-Crea
            </h1>
            <p className="text-xs text-[#7A6B63] mt-1">
              Connectez-vous pour gérer les créations, consulter les commandes et lire vos messages.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-left flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                Email Administrateur
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                Mot de Passe
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
              />
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] text-[11px] text-[#7A6B63]">
              <strong>Identifiants de démonstration :</strong><br />
              Email : <code className="text-[#8C6D58] font-bold">admin@charade-crea.fr</code><br />
              Mot de passe : <code className="text-[#8C6D58] font-bold">CharadeAdmin2026!</code>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={loadingAuth}
              className="w-full py-3.5 bg-[#8C6D58] text-white font-semibold text-sm rounded-xl shadow-md hover:bg-[#735744] transition-all flex items-center justify-center space-x-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loadingAuth ? 'Vérification...' : 'Se connecter à l\'Espace Admin'}</span>
            </button>
          </form>

          <button
            onClick={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs text-[#7A6B63] hover:text-[#2C2421] underline block w-full text-center"
          >
            &larr; Retourner sur le site public
          </button>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard View
  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Header Bar */}
      <div className="bg-[#2C2421] text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-[#8C6D58] text-white flex items-center justify-center shadow-md overflow-hidden shrink-0 border-2 border-[#D4A373]">
            {settingsForm.logoUrl ? (
              <img src={settingsForm.logoUrl} alt="Logo Charade-Crea" className="w-full h-full object-cover" />
            ) : (
              <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
            )}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#D4A373] tracking-widest block">Tableau de Bord Administrateur</span>
            <h1 className="font-serif-artisan text-2xl sm:text-3xl font-bold tracking-tight">Espace Gestion Charade-Crea</h1>
            <p className="text-xs text-[#B8ACA3] mt-0.5">Session sécurisée : admin@charade-crea.fr</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAdminData}
            className="p-2.5 bg-[#382E2A] text-[#D4A373] hover:text-white rounded-xl transition-colors border border-[#4A3D38]"
            title="Actualiser les données"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 bg-[#382E2A] text-white text-xs font-semibold rounded-xl hover:bg-[#4A3D38] border border-[#4A3D38]"
          >
            Voir le site public
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-4 py-2 bg-rose-950/60 text-rose-200 border border-rose-800/50 hover:bg-rose-900 rounded-xl text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-2 border-b border-[#E8E2D9] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
            activeTab === 'overview'
              ? 'bg-[#8C6D58] text-white shadow-xs'
              : 'bg-white text-[#5C4F4A] hover:bg-[#FAF8F5] border border-[#E8E2D9]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Vue d'ensemble</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
            activeTab === 'products'
              ? 'bg-[#8C6D58] text-white shadow-xs'
              : 'bg-white text-[#5C4F4A] hover:bg-[#FAF8F5] border border-[#E8E2D9]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Gestion des Créations ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
            activeTab === 'orders'
              ? 'bg-[#8C6D58] text-white shadow-xs'
              : 'bg-white text-[#5C4F4A] hover:bg-[#FAF8F5] border border-[#E8E2D9]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Gestion des Commandes ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
            activeTab === 'messages'
              ? 'bg-[#8C6D58] text-white shadow-xs'
              : 'bg-white text-[#5C4F4A] hover:bg-[#FAF8F5] border border-[#E8E2D9]'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Messages de Contact ({messagesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
            activeTab === 'settings'
              ? 'bg-[#8C6D58] text-white shadow-xs'
              : 'bg-white text-[#5C4F4A] hover:bg-[#FAF8F5] border border-[#E8E2D9]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Informations du Site</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[#8C6D58]">
                <ShoppingBag className="w-6 h-6" />
                <span className="text-xs bg-[#F3ECE4] px-2.5 py-1 rounded-full font-bold">Catalogue</span>
              </div>
              <div className="font-serif-artisan text-3xl font-bold text-[#2C2421]">{products.length}</div>
              <p className="text-xs text-[#7A6B63]">Créations visibles en ligne</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-amber-600">
                <FileText className="w-6 h-6" />
                <span className="text-xs bg-amber-50 px-2.5 py-1 rounded-full font-bold">Commandes</span>
              </div>
              <div className="font-serif-artisan text-3xl font-bold text-[#2C2421]">{orders.length}</div>
              <p className="text-xs text-[#7A6B63]">Demandes reçues</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-emerald-600">
                <Clock className="w-6 h-6" />
                <span className="text-xs bg-emerald-50 px-2.5 py-1 rounded-full font-bold">En fabrication</span>
              </div>
              <div className="font-serif-artisan text-3xl font-bold text-[#2C2421]">
                {orders.filter((o) => o.status === 'En fabrication' || o.status === 'Nouvelle').length}
              </div>
              <p className="text-xs text-[#7A6B63]">Commandes à traiter</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-indigo-600">
                <Inbox className="w-6 h-6" />
                <span className="text-xs bg-indigo-50 px-2.5 py-1 rounded-full font-bold">Messages</span>
              </div>
              <div className="font-serif-artisan text-3xl font-bold text-[#2C2421]">{messagesList.length}</div>
              <p className="text-xs text-[#7A6B63]">Messages formulaire contact</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-8 rounded-3xl border border-[#E8E2D9] space-y-4">
            <h3 className="font-serif-artisan text-2xl font-bold text-[#2C2421]">Actions Rapides</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setActiveTab('products');
                  setEditingProduct(null);
                  setProductForm({ name: '', description: '', material: '', color: '', price: '85 €', imageUrl: '' });
                  setIsAddProductOpen(true);
                }}
                className="px-5 py-3 bg-[#8C6D58] text-white font-semibold text-xs rounded-xl shadow-xs hover:bg-[#735744] flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un nouveau sac au catalogue</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className="px-5 py-3 bg-[#FAF8F5] border border-[#E8E2D9] text-[#2C2421] font-semibold text-xs rounded-xl hover:bg-[#EFE8DF] flex items-center space-x-2"
              >
                <FileText className="w-4 h-4 text-[#8C6D58]" />
                <span>Consulter les commandes récentes ({orders.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif-artisan text-2xl font-bold text-[#2C2421]">Catalogue des Créations</h2>
              <p className="text-xs text-[#7A6B63]">Gérez la liste des sacs affichés sur le site public.</p>
            </div>

            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({ name: '', description: '', material: '', color: '', price: '85 €', imageUrl: '' });
                setIsAddProductOpen(true);
              }}
              className="px-5 py-2.5 bg-[#8C6D58] text-white text-xs font-semibold rounded-xl shadow-xs hover:bg-[#735744] flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une création</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-4/3 overflow-hidden bg-[#FAF8F5] relative">
                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-white/90 px-2.5 py-0.5 rounded-full text-xs font-bold text-[#8C6D58]">
                      {prod.price}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-serif-artisan text-xl font-bold text-[#2C2421]">{prod.name}</h3>
                    <p className="text-xs text-[#6B5C55] line-clamp-2">{prod.description}</p>
                    <div className="text-[11px] text-[#7A6B63] space-y-0.5 pt-2 border-t border-[#F0EAE1]">
                      <div><strong>Matière:</strong> {prod.material}</div>
                      <div><strong>Couleur:</strong> {prod.color}</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setProductForm({
                        name: prod.name,
                        description: prod.description,
                        material: prod.material,
                        color: prod.color,
                        price: prod.price,
                        imageUrl: prod.imageUrl,
                      });
                      setIsAddProductOpen(true);
                    }}
                    className="flex-1 py-2 bg-[#FAF8F5] border border-[#E8E2D9] text-[#2C2421] hover:bg-[#EFE8DF] rounded-xl text-xs font-semibold flex items-center justify-center space-x-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Modifier</span>
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="p-2 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 rounded-xl transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif-artisan text-2xl font-bold text-[#2C2421]">Suivi des Commandes Sur-Mesure</h2>
              <p className="text-xs text-[#7A6B63]">Consultez et mettez à jour le statut des demandes clients.</p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
              {['all', 'Nouvelle', 'En fabrication', 'Terminée', 'Livrée'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    orderStatusFilter === st
                      ? 'bg-[#8C6D58] text-white shadow-xs'
                      : 'bg-white text-[#5C4F4A] hover:bg-[#FAF8F5] border border-[#E8E2D9]'
                  }`}
                >
                  {st === 'all' ? 'Toutes les commandes' : st}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-[#E8E2D9] text-center text-xs text-[#7A6B63]">
              Aucune commande trouvée pour le filtre sélectionné.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8E2D9] pb-4 gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-serif-artisan text-xl font-bold text-[#2C2421]">
                          Commande #{ord.id} - {ord.customerName}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F3ECE4] text-[#8C6D58]">
                          {ord.bagType}
                        </span>
                      </div>
                      <div className="text-xs text-[#7A6B63] mt-1 flex flex-wrap gap-4">
                        <span><strong>Tél :</strong> {ord.phone}</span>
                        <span><strong>Email :</strong> {ord.email}</span>
                        {ord.createdAt && (
                          <span><strong>Date :</strong> {new Date(ord.createdAt).toLocaleDateString('fr-FR')}</span>
                        )}
                      </div>
                    </div>

                    {/* Status Changer Selector */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-[#7A6B63]">Statut :</span>
                      <select
                        value={ord.status}
                        onChange={(e) => handleOrderStatusChange(ord.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-hidden ${
                          ord.status === 'Nouvelle'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : ord.status === 'En fabrication'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : ord.status === 'Terminée'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-[#FAF8F5] text-[#5C4F4A] border-[#E8E2D9]'
                        }`}
                      >
                        <option value="Nouvelle">Nouvelle</option>
                        <option value="En fabrication">En fabrication</option>
                        <option value="Terminée">Terminée</option>
                        <option value="Livrée">Livrée</option>
                        <option value="Annulée">Annulée</option>
                      </select>

                      <button
                        onClick={() => handleDeleteOrder(ord.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-[#5C4F4A] leading-relaxed bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E2D9]">
                    <strong className="text-[#2C2421] block mb-1">Description & Spécifications :</strong>
                    {ord.description}
                  </div>

                  {ord.referenceImage && (
                    <div className="flex items-center space-x-3 pt-1">
                      <ImageIcon className="w-4 h-4 text-[#8C6D58]" />
                      <a
                        href={ord.referenceImage}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#8C6D58] underline hover:text-[#2C2421] flex items-center space-x-1"
                      >
                        <span>Voir l'image d'inspiration du client</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MESSAGES */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-serif-artisan text-2xl font-bold text-[#2C2421]">Messages Reçus</h2>
            <p className="text-xs text-[#7A6B63]">Messages envoyés via le formulaire de contact public.</p>
          </div>

          {messagesList.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-[#E8E2D9] text-center text-xs text-[#7A6B63]">
              Aucun message reçu pour le moment.
            </div>
          ) : (
            <div className="space-y-4">
              {messagesList.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3">
                    <div>
                      <span className="font-bold text-[#2C2421] text-sm">{msg.name}</span>
                      <span className="text-xs text-[#7A6B63] ml-3">
                        Email: <a href={`mailto:${msg.email}`} className="underline text-[#8C6D58]">{msg.email}</a>
                        {msg.phone && ` | Tél: ${msg.phone}`}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg text-xs flex items-center space-x-1"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Supprimer</span>
                    </button>
                  </div>

                  <p className="text-xs text-[#5C4F4A] leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: SITE SETTINGS (INFORMATIONS DU PROPRIÉTAIRE DU SITE) */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D9] shadow-xs space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C6D58] tracking-widest block">Coordonnées & Réseaux</span>
              <h2 className="font-serif-artisan text-2xl font-bold text-[#2C2421]">Modifier les Informations du Propriétaire</h2>
              <p className="text-xs text-[#7A6B63] mt-1">
                Toutes les modifications effectuées ici seront mises à jour en direct sur la page utilisateur (En-tête, Pied de page, Page de contact).
              </p>
            </div>

            {settingsSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Paramètres enregistrés avec succès ! Les informations du site ont été mises à jour.</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">

              {/* Hidden File Inputs for Logo and Hero */}
              <input
                type="file"
                ref={logoFileInputRef}
                accept="image/*"
                onChange={handleLogoFileUpload}
                className="hidden"
              />
              <input
                type="file"
                ref={heroFileInputRef}
                accept="image/*"
                onChange={handleHeroFileUpload}
                className="hidden"
              />

              {/* SECTION: LOGO DU SITE */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-[#2C2421] border-b border-[#E8E2D9] pb-2 flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-[#8C6D58]" />
                  <span>Logo de la Marque (En-tête & Pied de page)</span>
                </h3>

                <p className="text-xs text-[#7A6B63]">
                  Personnalisez le logo de Charade-Crea. Ce logo s'affichera en haut à gauche de l'en-tête du site, dans l'espace d'administration et dans le pied de page.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => logoFileInputRef.current?.click()}
                    className="py-2.5 px-3 bg-[#FAF8F5] hover:bg-[#8C6D58] hover:text-white border border-[#E8E2D9] rounded-xl text-xs font-semibold text-[#5C4F4A] flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Télécharger un logo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => startCamera('logo')}
                    className="py-2.5 px-3 bg-[#FAF8F5] hover:bg-[#8C6D58] hover:text-white border border-[#E8E2D9] rounded-xl text-xs font-semibold text-[#5C4F4A] flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Prendre un logo avec la caméra</span>
                  </button>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#7A6B63] block mb-1">Ou collez le lien URL direct du logo :</span>
                  <input
                    type="url"
                    placeholder="https://... (ex: lien image du logo)"
                    value={settingsForm.logoUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                  />
                </div>

                {/* Logo Preview Box */}
                <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D9] flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-[#8C6D58] text-white flex items-center justify-center shadow-xs overflow-hidden border border-[#E8E2D9] shrink-0">
                      {settingsForm.logoUrl ? (
                        <img src={settingsForm.logoUrl} alt="Aperçu Logo" className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#2C2421] block">Aperçu de l'En-tête</span>
                      <span className="text-[11px] text-[#7A6B63]">
                        {settingsForm.logoUrl ? 'Logo personnalisé actif' : 'Logo icône par défaut'}
                      </span>
                    </div>
                  </div>

                  {settingsForm.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, logoUrl: '' })}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      Supprimer le logo
                    </button>
                  )}
                </div>
              </div>

              {/* SECTION: HERO PHOTO DE LA PAGE D'ACCUEIL */}
              <div className="space-y-4 pt-4 border-t border-[#E8E2D9]">
                <h3 className="text-sm font-bold text-[#2C2421] border-b border-[#E8E2D9] pb-2 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#8C6D58]" />
                  <span>Photo à la une (Accueil & Présentation du Sac)</span>
                </h3>

                <p className="text-xs text-[#7A6B63]">
                  Cette photo est l'image principale affichée en haut de la page d'accueil public pour présenter votre modèle phare ou votre atelier.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => heroFileInputRef.current?.click()}
                    className="py-2.5 px-3 bg-[#FAF8F5] hover:bg-[#8C6D58] hover:text-white border border-[#E8E2D9] rounded-xl text-xs font-semibold text-[#5C4F4A] flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Télécharger une photo d'accueil</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => startCamera('hero')}
                    className="py-2.5 px-3 bg-[#FAF8F5] hover:bg-[#8C6D58] hover:text-white border border-[#E8E2D9] rounded-xl text-xs font-semibold text-[#5C4F4A] flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Prendre la photo avec la caméra</span>
                  </button>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#7A6B63] block mb-1">Ou collez le lien URL d'une photo web :</span>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={settingsForm.heroImageUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroImageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                  />
                </div>

                {/* Sample image chips */}
                <div>
                  <span className="text-[11px] font-semibold text-[#7A6B63] block mb-1">Ou choisir parmi nos suggestions de photos :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleImages.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => setSettingsForm({ ...settingsForm, heroImageUrl: s.url })}
                        className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#8C6D58] hover:text-white border border-[#E8E2D9] rounded-lg text-[11px] text-[#5C4F4A] transition-colors"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hero Photo Preview */}
                {settingsForm.heroImageUrl && (
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#8C6D58]">Aperçu de la photo de la page d'accueil</span>
                      <button
                        type="button"
                        onClick={() => setSettingsForm({
                          ...settingsForm,
                          heroImageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1000'
                        })}
                        className="text-xs text-rose-600 hover:underline font-semibold"
                      >
                        Réinitialiser la photo
                      </button>
                    </div>
                    <img
                      src={settingsForm.heroImageUrl}
                      alt="Aperçu Photo d'Accueil"
                      className="w-full h-48 object-cover rounded-lg border border-[#E8E2D9]"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              
              {/* Section 1: Contact Direct */}
              <div className="space-y-4 pt-4 border-t border-[#E8E2D9]">
                <h3 className="text-sm font-bold text-[#2C2421] border-b border-[#E8E2D9] pb-2 flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-[#8C6D58]" />
                  <span>Contact Téléphonique & WhatsApp</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                      Numéro de Téléphone Direct
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+33 6 12 34 56 78"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                      Numéro WhatsApp (avec indicatif)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="33612345678"
                      value={settingsForm.whatsapp}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                    />
                    <span className="text-[10px] text-[#7A6B63] mt-0.5 block">Format sans + ni espaces (ex: 33612345678)</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Email & Adresse */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-[#2C2421] border-b border-[#E8E2D9] pb-2 flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-[#8C6D58]" />
                  <span>Email, Adresse & Horaires</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                      Adresse Email de contact
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="contact@charade-crea.fr"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                      Horaires d'ouverture / RDV
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Du lundi au samedi (9h - 18h30)"
                      value={settingsForm.workingHours}
                      onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                    Adresse complète de l'Atelier
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Atelier Artisanal Charade-Crea, Diego-Suarez, Madagascar"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                  />
                </div>
              </div>

              {/* Section 3: Réseaux Sociaux & Slogan */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-[#2C2421] border-b border-[#E8E2D9] pb-2 flex items-center space-x-2">
                  <Instagram className="w-4 h-4 text-[#8C6D58]" />
                  <span>Réseaux Sociaux & Slogan</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                      Lien Instagram
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://instagram.com/charade_crea"
                      value={settingsForm.instagramUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                      Lien Facebook
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://facebook.com/charadecrea"
                      value={settingsForm.facebookUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                    Slogan / Phrase d'accroche de la marque
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Des sacs uniques faits main selon vos envies"
                    value={settingsForm.slogan}
                    onChange={(e) => setSettingsForm({ ...settingsForm, slogan: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                  />
                </div>
              </div>

              {/* Submit Settings */}
              <div className="pt-4 border-t border-[#E8E2D9] flex justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-6 py-3 bg-[#8C6D58] text-white font-semibold text-xs rounded-xl shadow-md hover:bg-[#735744] flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSettings ? 'Enregistrement...' : 'Enregistrer les modifications du site'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD/EDIT PRODUCT MODAL */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E8E2D9] max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsAddProductOpen(false)}
              className="absolute top-4 right-4 text-[#7A6B63] hover:text-[#2C2421]"
            >
              <X className="w-6 h-6" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C6D58] tracking-widest">
                {editingProduct ? 'Modification' : 'Ajout Produit'}
              </span>
              <h3 className="font-serif-artisan text-2xl font-bold text-[#2C2421]">
                {editingProduct ? 'Modifier la création' : 'Ajouter un nouveau sac'}
              </h3>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                  Nom du sac <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Cabas Éléganza Jute & Cuir"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                    Prix <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="85 € ou Sur devis"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                    Couleur <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Beige & Cognac"
                    value={productForm.color}
                    onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                    Matière <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Cuir & Jute bio"
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2421] mb-1">
                  Description détaillée <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Décrivez les finitions, la doublure, les fermetures..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                />
              </div>

              {/* PHOTO SELECTION (FILE UPLOAD + CAMERA + URL + SAMPLES) */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-[#2C2421]">
                  Photo de la création <span className="text-rose-500">*</span>
                </label>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* File Upload Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2.5 px-3 bg-[#FAF8F5] hover:bg-[#8C6D58] hover:text-white border border-[#E8E2D9] rounded-xl text-xs font-semibold text-[#5C4F4A] flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Télécharger une photo</span>
                  </button>

                  {/* Camera Button */}
                  <button
                    type="button"
                    onClick={startCamera}
                    className="py-2.5 px-3 bg-[#FAF8F5] hover:bg-[#8C6D58] hover:text-white border border-[#E8E2D9] rounded-xl text-xs font-semibold text-[#5C4F4A] flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Prendre avec la caméra</span>
                  </button>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#7A6B63] block mb-1">Ou coller l'URL d'une photo web :</span>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-hidden focus:border-[#8C6D58]"
                  />
                </div>

                {/* Sample image chips */}
                <div>
                  <span className="text-[11px] font-semibold text-[#7A6B63] block mb-1">Ou choisir une photo exemple :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleImages.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => setProductForm({ ...productForm, imageUrl: s.url })}
                        className="px-2.5 py-1 bg-[#FAF8F5] hover:bg-[#8C6D58] hover:text-white border border-[#E8E2D9] rounded-lg text-[11px] text-[#5C4F4A] transition-colors"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Photo Preview */}
              {productForm.imageUrl && (
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] relative space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#8C6D58]">Aperçu de la photo sélectionnée</span>
                    <button
                      type="button"
                      onClick={() => setProductForm({ ...productForm, imageUrl: '' })}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Supprimer la photo
                    </button>
                  </div>
                  <img
                    src={productForm.imageUrl}
                    alt="Aperçu"
                    className="w-full h-40 object-cover rounded-lg border border-[#E8E2D9]"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {isCompressingImage && (
                <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-xs flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                  <span>Optimisation et préparation de la photo en cours...</span>
                </div>
              )}

              <div className="pt-4 flex items-center space-x-3">
                <button
                  type="submit"
                  disabled={!productForm.imageUrl || isSavingProduct || isCompressingImage}
                  className="flex-1 py-3 bg-[#8C6D58] text-white font-semibold text-xs rounded-xl shadow-md hover:bg-[#735744] disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isSavingProduct ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Enregistrement sécurisé...</span>
                    </>
                  ) : (
                    <span>{editingProduct ? 'Enregistrer les modifications' : 'Ajouter au catalogue'}</span>
                  )}
                </button>
                <button
                  type="button"
                  disabled={isSavingProduct}
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-3 bg-[#FAF8F5] text-[#5C4F4A] font-semibold text-xs rounded-xl hover:bg-[#EFE8DF] disabled:opacity-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CAMERA STREAM MODAL */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#2C2421] text-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#4A3D38] text-center relative">
            <button
              onClick={stopCamera}
              className="absolute top-4 right-4 p-2 text-[#B8ACA3] hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-1 text-left">
              <span className="text-[10px] uppercase font-bold text-[#D4A373] tracking-widest block">Prise de vue directe</span>
              <h3 className="font-serif-artisan text-xl font-bold">Appareil Photo / Caméra</h3>
            </div>

            {cameraError ? (
              <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs">
                {cameraError}
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl bg-black border border-[#4A3D38]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            <div className="flex items-center space-x-3 pt-2">
              {!cameraError && (
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="flex-1 py-3 bg-[#D4A373] text-white font-bold text-xs rounded-xl shadow-lg hover:bg-[#C28E5E] flex items-center justify-center space-x-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capturer la photo</span>
                </button>
              )}
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-3 bg-[#382E2A] text-[#E8E2D9] font-semibold text-xs rounded-xl hover:bg-[#4A3D38]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
