import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const adminUsers = sqliteTable('admin', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('admin'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  material: text('material').notNull(),
  color: text('color').notNull(),
  price: text('price').notNull().default('Sur devis'),
  imageUrl: text('image_url').notNull(),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  customerName: text('customer_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  bagType: text('bag_type').notNull(),
  description: text('description').notNull(),
  referenceImage: text('reference_image'),
  status: text('status').notNull().default('Nouvelle'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  message: text('message').notNull(),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const siteSettings = sqliteTable('site_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  phone: text('phone').notNull().default('+33 6 12 34 56 78'),
  whatsapp: text('whatsapp').notNull().default('33612345678'),
  email: text('email').notNull().default('contact@charade-crea.fr'),
  address: text('address').notNull().default('Atelier Artisanal Charade-Crea, Diego-Suarez, Madagascar'),
  instagramUrl: text('instagram_url').notNull().default('https://instagram.com'),
  facebookUrl: text('facebook_url').notNull().default('https://facebook.com'),
  workingHours: text('working_hours').notNull().default('Du lundi au samedi (9h - 18h30)'),
  slogan: text('slogan').notNull().default('Des sacs uniques faits main selon vos envies'),
  logoUrl: text('logo_url').default(''),
  heroImageUrl: text('hero_image_url').default('https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1000'),
});
