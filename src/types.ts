export interface Product {
  id: number;
  name: string;
  description: string;
  material: string;
  color: string;
  price: string;
  imageUrl: string;
  createdAt?: string;
}

export interface Order {
  id: number;
  customerName: string;
  phone: string;
  email: string;
  bagType: string;
  description: string;
  referenceImage?: string | null;
  status: 'Nouvelle' | 'En fabrication' | 'Terminée' | 'Livrée' | 'Annulée' | string;
  createdAt?: string;
}

export interface MessageItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt?: string;
}

export interface AdminUser {
  email: string;
  role: string;
}

export interface SiteSettings {
  id?: number;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
  workingHours: string;
  slogan: string;
  logoUrl?: string;
  heroImageUrl?: string;
}

export type ActivePage = 'home' | 'about' | 'creations' | 'order' | 'contact' | 'admin';
