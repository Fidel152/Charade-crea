import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.ts';

const dbUrl = process.env.DATABASE_URL || 'file:charade.db';

export const sqliteClient = createClient({
  url: dbUrl,
});

export const db = drizzle(sqliteClient, { schema });

// Auto initialize tables if they do not exist
export async function initSqliteTables() {
  await sqliteClient.executeMultiple(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      material TEXT NOT NULL,
      color TEXT NOT NULL,
      price TEXT NOT NULL DEFAULT 'Sur devis',
      image_url TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      bag_type TEXT NOT NULL,
      description TEXT NOT NULL,
      reference_image TEXT,
      status TEXT NOT NULL DEFAULT 'Nouvelle',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT NOT NULL DEFAULT '+33 6 12 34 56 78',
      whatsapp TEXT NOT NULL DEFAULT '33612345678',
      email TEXT NOT NULL DEFAULT 'contact@charade-crea.fr',
      address TEXT NOT NULL DEFAULT 'Atelier Artisanal Charade-Crea, Diego-Suarez, Madagascar',
      instagram_url TEXT NOT NULL DEFAULT 'https://instagram.com',
      facebook_url TEXT NOT NULL DEFAULT 'https://facebook.com',
      working_hours TEXT NOT NULL DEFAULT 'Du lundi au samedi (9h - 18h30)',
      slogan TEXT NOT NULL DEFAULT 'Des sacs uniques faits main selon vos envies',
      logo_url TEXT DEFAULT '',
      hero_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1000'
    );
  `);
}

