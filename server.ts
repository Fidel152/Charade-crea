import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import bcrypt from 'bcryptjs';
import { eq, desc } from 'drizzle-orm';
import { db } from './src/db/index.ts';
import { adminUsers, products, orders, messages, siteSettings } from './src/db/schema.ts';
import { requireAdminAuth, generateToken, AuthRequest } from './src/server/auth.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper function to seed initial admin & products
  async function seedInitialData() {
    try {
      // Seed Admin
      const existingAdmins = await db.select().from(adminUsers);
      if (existingAdmins.length === 0) {
        const passwordHash = await bcrypt.hash('CharadeAdmin2026!', 10);
        await db.insert(adminUsers).values({
          email: 'admin@charade-crea.fr',
          passwordHash,
          role: 'admin',
        });
        console.log('✅ Admin initialisé avec succès : admin@charade-crea.fr / CharadeAdmin2026!');
      }

      // Seed Products
      const existingProducts = await db.select().from(products);
      if (existingProducts.length === 0) {
        await db.insert(products).values([
          {
            name: 'Le Cabas Éléganza Jute & Cuir',
            description: 'Cabas spacieux et résistant confectionné artisanalement. Mariage harmonieux de la toile de jute naturelle et d\'anses robustes en cuir véritable. Doublure intérieure en coton motif floral avec poche zippée.',
            material: 'Toile de jute bio & Anses en Cuir véritable',
            color: 'Beige naturel & Cognac',
            price: '85 €',
            imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
          },
          {
            name: 'Pochette Duchesse Jacquard',
            description: 'Raffinement absolu pour vos soirées ou cérémonies. Réalisée dans un tissu jacquard d\'exception agrémenté de fils dorés. Fermoir rétro en métal brossé et petite chaînette d\'épaule amovible.',
            material: 'Jacquard brodé & Laiton vieilli',
            color: 'Bleu Nuit & Or',
            price: '48 €',
            imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=800',
          },
          {
            name: 'Besace Bohème Suédine Terracotta',
            description: 'Sac besace souple et velouté à rabat graphique. Fermeture aimantée sécurisée, grande poche intérieure et bandoulière tissée aux motifs ethniques réglable.',
            material: 'Suédine toucher peau de pêche & Sangle jacquard',
            color: 'Terracotta & Ocre',
            price: '92 €',
            imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
          },
          {
            name: 'Sac à Dos City Chics',
            description: 'Un sac à dos élégant et fonctionnel pensé pour le quotidien urbain. Toile déperlante haute qualité, renforts en cuir végétal et finitions soignées faites main.',
            material: 'Toile enduite & Cuir végétal',
            color: 'Gris Anthracite & Miel',
            price: '110 €',
            imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
          },
          {
            name: 'Mini Sac Seau Romance',
            description: 'Modèle seau romantique au design iconique. Cordon de serrage coulissant avec pompons faits main. Un charme intemporel pour transporter vos indispensables.',
            material: 'Coton tissé lourd & Cordons tressés',
            color: 'Rose Poudré & Blanc Cassé',
            price: '65 €',
            imageUrl: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800',
          },
        ]);
        console.log('✅ 5 Créations artisanales initiales ajoutées au catalogue.');
      }

      // Seed Site Settings
      const existingSettings = await db.select().from(siteSettings);
      if (existingSettings.length === 0) {
        await db.insert(siteSettings).values({
          phone: '+33 6 12 34 56 78',
          whatsapp: '33612345678',
          email: 'contact@charade-crea.fr',
          address: 'Atelier Artisanal Charade-Crea, France',
          instagramUrl: 'https://instagram.com',
          facebookUrl: 'https://facebook.com',
          workingHours: 'Du lundi au samedi (9h - 18h30)',
          slogan: 'Des sacs uniques faits main selon vos envies',
        });
        console.log('✅ Paramètres initiaux du site créés.');
      }
    } catch (error: any) {
      if (error?.cause?.code === 'ECONNREFUSED' || error?.code === 'ECONNREFUSED') {
        console.warn('\n⚠️ [BASE DE DONNÉES NON CONNECTÉE] ⚠️');
        console.warn('Le serveur PostgreSQL n\'est pas accessible sur votre machine locale (ECONNREFUSED).');
        console.warn('Pour utiliser la base de données dans VS Code :');
        console.warn('1. Installez et démarrez PostgreSQL (ou un conteneur Docker PostgreSQL).');
        console.warn('2. Créez un fichier .env à la racine avec vos identifiants (voir .env.example) :');
        console.warn('   SQL_HOST=localhost');
        console.warn('   SQL_PORT=5432');
        console.warn('   SQL_USER=postgres');
        console.warn('   SQL_PASSWORD=votre_mot_de_passe');
        console.warn('   SQL_DB_NAME=charade_db');
        console.warn('3. Exécutez "npx drizzle-kit push" pour créer les tables automatiquement.\n');
      } else {
        console.error('Erreur lors de la vérification/initialisation des données :', error);
      }
    }
  }

  // API ROUTES

  // Healthcheck
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', brand: 'Charade-Crea' });
  });

  // ADMIN AUTHENTICATION
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis.' });
      }

      const usersList = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.email, email.trim().toLowerCase()));

      if (usersList.length === 0) {
        return res.status(401).json({ error: 'Identifiants incorrects.' });
      }

      const admin = usersList[0];
      const match = await bcrypt.compare(password, admin.passwordHash);
      if (!match) {
        return res.status(401).json({ error: 'Identifiants incorrects.' });
      }

      const token = generateToken({ id: admin.id, email: admin.email, role: admin.role });
      res.json({ token, user: { email: admin.email, role: admin.role } });
    } catch (error) {
      console.error('Erreur lors de la connexion admin :', error);
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  });

  app.get('/api/admin/me', requireAdminAuth, (req: AuthRequest, res) => {
    res.json({ user: req.adminUser });
  });

  // PRODUCTS API (PUBLIC & ADMIN)
  app.get('/api/products', async (req, res) => {
    try {
      const allProducts = await db
        .select()
        .from(products)
        .orderBy(desc(products.createdAt));
      res.json(allProducts);
    } catch (error) {
      console.error('Erreur lors du chargement des produits :', error);
      res.status(500).json({ error: 'Impossible de charger les créations.' });
    }
  });

  app.post('/api/products', requireAdminAuth, async (req, res) => {
    try {
      const { name, description, material, color, price, imageUrl } = req.body;
      if (!name || !description || !material || !color || !imageUrl) {
        return res.status(400).json({ error: 'Tous les champs requis doivent être renseignés.' });
      }

      const newProduct = await db
        .insert(products)
        .values({
          name: name.trim(),
          description: description.trim(),
          material: material.trim(),
          color: color.trim(),
          price: price ? price.trim() : 'Sur devis',
          imageUrl: imageUrl.trim(),
        })
        .returning();

      res.status(201).json(newProduct[0]);
    } catch (error) {
      console.error('Erreur ajout création :', error);
      res.status(500).json({ error: 'Erreur lors de l\'ajout de la création.' });
    }
  });

  app.put('/api/products/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { name, description, material, color, price, imageUrl } = req.body;

      const updated = await db
        .update(products)
        .set({
          name: name.trim(),
          description: description.trim(),
          material: material.trim(),
          color: color.trim(),
          price: price ? price.trim() : 'Sur devis',
          imageUrl: imageUrl.trim(),
        })
        .where(eq(products.id, id))
        .returning();

      if (updated.length === 0) {
        return res.status(404).json({ error: 'Création non trouvée.' });
      }

      res.json(updated[0]);
    } catch (error) {
      console.error('Erreur modification création :', error);
      res.status(500).json({ error: 'Erreur lors de la modification.' });
    }
  });

  app.delete('/api/products/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await db.delete(products).where(eq(products.id, id)).returning();
      if (deleted.length === 0) {
        return res.status(404).json({ error: 'Création non trouvée.' });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Erreur suppression création :', error);
      res.status(500).json({ error: 'Erreur lors de la suppression.' });
    }
  });

  // ORDERS API
  app.post('/api/orders', async (req, res) => {
    try {
      const { customerName, phone, email, bagType, description, material, color, referenceImage } = req.body;
      if (!customerName || !phone || !email || !bagType || !description) {
        return res.status(400).json({ error: 'Veuillez remplir tous les champs obligatoires du formulaire de commande.' });
      }

      const fullDescription = [
        description.trim(),
        material ? `Matière souhaitée : ${material.trim()}` : null,
        color ? `Couleur souhaitée : ${color.trim()}` : null,
      ]
        .filter(Boolean)
        .join(' | ');

      const newOrder = await db
        .insert(orders)
        .values({
          customerName: customerName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          bagType: bagType.trim(),
          description: fullDescription,
          referenceImage: referenceImage ? referenceImage.trim() : null,
          status: 'Nouvelle',
        })
        .returning();

      res.status(201).json(newOrder[0]);
    } catch (error) {
      console.error('Erreur création commande :', error);
      res.status(500).json({ error: 'Erreur lors de l\'enregistrement de votre demande.' });
    }
  });

  app.get('/api/orders', requireAdminAuth, async (req, res) => {
    try {
      const allOrders = await db
        .select()
        .from(orders)
        .orderBy(desc(orders.createdAt));
      res.json(allOrders);
    } catch (error) {
      console.error('Erreur lecture commandes :', error);
      res.status(500).json({ error: 'Erreur lors du chargement des commandes.' });
    }
  });

  app.patch('/api/orders/:id/status', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'Le statut est requis.' });
      }

      const updated = await db
        .update(orders)
        .set({ status: status.trim() })
        .where(eq(orders.id, id))
        .returning();

      if (updated.length === 0) {
        return res.status(404).json({ error: 'Commande non trouvée.' });
      }

      res.json(updated[0]);
    } catch (error) {
      console.error('Erreur changement statut commande :', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
    }
  });

  app.delete('/api/orders/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await db.delete(orders).where(eq(orders.id, id)).returning();
      if (deleted.length === 0) {
        return res.status(404).json({ error: 'Commande non trouvée.' });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Erreur suppression commande :', error);
      res.status(500).json({ error: 'Erreur lors de la suppression.' });
    }
  });

  // MESSAGES & SECRET ADMIN TRIGGER API
  app.post('/api/messages', async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
      const trimmedMsg = (message || '').trim().toLowerCase();
      const trimmedName = (name || '').trim().toLowerCase();
      const trimmedEmail = (email || '').trim().toLowerCase();

      // Check if user wrote secret trigger "charade" in any field
      if (
        trimmedMsg.includes('charade') ||
        trimmedName.includes('charade') ||
        trimmedEmail.includes('charade')
      ) {
        return res.json({
          isSecretKey: true,
          redirectUrl: '/charade-admin',
          notice: 'Accès administrateur détecté.',
        });
      }

      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Nom, email et message sont obligatoires.' });
      }

      const newMessage = await db
        .insert(messages)
        .values({
          name: name.trim(),
          email: email.trim(),
          phone: phone ? phone.trim() : '',
          message: message.trim(),
        })
        .returning();

      res.status(201).json({ success: true, message: newMessage[0] });
    } catch (error) {
      console.error('Erreur enregistrement message :', error);
      res.status(500).json({ error: 'Erreur lors de l\'envoi du message.' });
    }
  });

  app.get('/api/messages', requireAdminAuth, async (req, res) => {
    try {
      const allMessages = await db
        .select()
        .from(messages)
        .orderBy(desc(messages.createdAt));
      res.json(allMessages);
    } catch (error) {
      console.error('Erreur lecture messages :', error);
      res.status(500).json({ error: 'Erreur lors du chargement des messages.' });
    }
  });

  app.delete('/api/messages/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await db.delete(messages).where(eq(messages.id, id)).returning();
      if (deleted.length === 0) {
        return res.status(404).json({ error: 'Message non trouvé.' });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Erreur suppression message :', error);
      res.status(500).json({ error: 'Erreur lors de la suppression.' });
    }
  });

  // SITE SETTINGS API
  app.get('/api/settings', async (req, res) => {
    try {
      const settingsList = await db.select().from(siteSettings);
      if (settingsList.length === 0) {
        // Return default fallback object
        return res.json({
          phone: '+33 6 12 34 56 78',
          whatsapp: '33612345678',
          email: 'contact@charade-crea.fr',
          address: 'Atelier Artisanal Charade-Crea, Diego-Suarez, Madagascar',
          instagramUrl: 'https://instagram.com',
          facebookUrl: 'https://facebook.com',
          workingHours: 'Du lundi au samedi (9h - 18h30)',
          slogan: 'Des sacs uniques faits main selon vos envies',
          logoUrl: '',
          heroImageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1000',
        });
      }
      res.json(settingsList[0]);
    } catch (error) {
      console.error('Erreur chargement paramètres :', error);
      res.status(500).json({ error: 'Erreur lors du chargement des paramètres du site.' });
    }
  });

  app.put('/api/settings', requireAdminAuth, async (req, res) => {
    try {
      const {
        phone,
        whatsapp,
        email,
        address,
        instagramUrl,
        facebookUrl,
        workingHours,
        slogan,
        logoUrl,
        heroImageUrl,
      } = req.body;

      const existing = await db.select().from(siteSettings);
      let updated;
      if (existing.length === 0) {
        updated = await db
          .insert(siteSettings)
          .values({
            phone: phone || '+33 6 12 34 56 78',
            whatsapp: whatsapp || '33612345678',
            email: email || 'contact@charade-crea.fr',
            address: address || 'Atelier Artisanal Charade-Crea, Diego-Suarez, Madagascar',
            instagramUrl: instagramUrl || 'https://instagram.com',
            facebookUrl: facebookUrl || 'https://facebook.com',
            workingHours: workingHours || 'Du lundi au samedi (9h - 18h30)',
            slogan: slogan || 'Des sacs uniques faits main selon vos envies',
            logoUrl: logoUrl || '',
            heroImageUrl: heroImageUrl || 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1000',
          })
          .returning();
      } else {
        updated = await db
          .update(siteSettings)
          .set({
            phone: phone !== undefined ? phone : existing[0].phone,
            whatsapp: whatsapp !== undefined ? whatsapp : existing[0].whatsapp,
            email: email !== undefined ? email : existing[0].email,
            address: address !== undefined ? address : existing[0].address,
            instagramUrl: instagramUrl !== undefined ? instagramUrl : existing[0].instagramUrl,
            facebookUrl: facebookUrl !== undefined ? facebookUrl : existing[0].facebookUrl,
            workingHours: workingHours !== undefined ? workingHours : existing[0].workingHours,
            slogan: slogan !== undefined ? slogan : existing[0].slogan,
            logoUrl: logoUrl !== undefined ? logoUrl : existing[0].logoUrl,
            heroImageUrl: heroImageUrl !== undefined ? heroImageUrl : existing[0].heroImageUrl,
          })
          .where(eq(siteSettings.id, existing[0].id))
          .returning();
      }

      res.json(updated[0]);
    } catch (error) {
      console.error('Erreur mise à jour paramètres :', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour des paramètres.' });
    }
  });

  // VITE OR STATIC SERVING
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur Charade-Crea démarré sur http://localhost:${PORT}`);
    seedInitialData().catch((err) => {
      console.warn('Initialisation des données exécutée avec avertissement :', err?.message || err);
    });
  });
}

startServer();
