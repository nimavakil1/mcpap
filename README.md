# McPaper B2B E-Commerce Platform

Eine vollständige B2B E-Commerce-Plattform für McPaper, einen deutschen Bürobedarf-Fachhändler.

**Live URL:** https://mcpaper.distri-smart.com

## Tech Stack

- **Frontend:** Next.js 14+ mit App Router, React 18+, Tailwind CSS
- **Backend:** Node.js mit Next.js API Routes
- **Datenbank:** PostgreSQL 14 mit Prisma ORM
- **Caching:** Redis
- **Zahlungen:** Stripe (vorbereitet)

## Features

### Kunden-Frontend
- Produktkatalog mit Kategorien und Filterung
- Volltextsuche mit Fuzzy-Matching
- Warenkorb und Checkout
- Kundenkonto mit Bestellhistorie
- Gespeicherte Warenkörbe und Favoriten
- Kundengruppen mit Rabatten (Standard, Silber, Gold, Platin)
- Filialgutscheine bei Online-Bestellungen

### Admin-Panel
- Dashboard mit Statistiken
- Produktverwaltung mit Bulk-Import
- Kategorienverwaltung
- Bestellungsübersicht
- Kundenverwaltung
- Gutscheinverwaltung
- Kontaktanfragen

## Installation

### Voraussetzungen
- Node.js 20+
- PostgreSQL 14+
- Redis (optional, für Caching)

### Setup

1. **Repository klonen:**
   ```bash
   git clone https://github.com/nimavakil1/mcpap.git
   cd mcpap
   ```

2. **Dependencies installieren:**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren:**
   ```bash
   cp .env.example .env
   # .env Datei bearbeiten und Werte anpassen
   ```

4. **Datenbank erstellen:**
   ```bash
   # PostgreSQL Datenbank erstellen
   createdb mcpaper_db

   # Oder als postgres User:
   sudo -u postgres createdb mcpaper_db
   sudo -u postgres psql -c "CREATE USER mcpaper_user WITH PASSWORD 'IhrPasswort';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE mcpaper_db TO mcpaper_user;"
   ```

5. **Prisma Schema anwenden:**
   ```bash
   npm run db:push
   ```

6. **Datenbank seeden (200 Produkte + Admin-User):**
   ```bash
   npm run db:seed
   ```

7. **Entwicklungsserver starten:**
   ```bash
   npm run dev
   ```

8. **App öffnen:** http://localhost:3000

## Admin-Zugang

Nach dem Seeding:
- **E-Mail:** general@distri-smart.com
- **Passwort:** McPaper2024!Admin

## Produktions-Deployment

### Mit PM2

```bash
# Build erstellen
npm run build

# Mit PM2 starten
pm2 start npm --name "mcpaper" -- start
pm2 save
pm2 startup
```

### nginx Konfiguration

Siehe `nginx/mcpaper.conf` für die empfohlene nginx-Konfiguration.

### Redis starten

```bash
cd docker
docker-compose up -d
```

## API Endpunkte

### Authentifizierung
- `POST /api/auth/login` - Kunden-Login
- `POST /api/auth/register` - Registrierung
- `POST /api/auth/logout` - Abmelden
- `GET /api/auth/session` - Session abrufen
- `POST /api/auth/admin-login` - Admin-Login

### Produkte
- `GET /api/products` - Produktliste (mit Pagination, Filtern, Sortierung)
- `GET /api/products/[slug]` - Einzelnes Produkt

### Kategorien
- `GET /api/categories` - Kategorienliste

### Warenkorb
- `GET /api/cart` - Warenkorb abrufen
- `POST /api/cart` - Artikel hinzufügen
- `PUT /api/cart` - Menge aktualisieren
- `DELETE /api/cart` - Artikel entfernen

### Favoriten
- `GET /api/favorites` - Favoritenliste
- `POST /api/favorites` - Favorit hinzufügen/entfernen

## Umgebungsvariablen

| Variable | Beschreibung |
|----------|--------------|
| `DATABASE_URL` | PostgreSQL Connection String |
| `REDIS_URL` | Redis Connection String |
| `NEXTAUTH_SECRET` | Secret für JWT |
| `NEXTAUTH_URL` | Basis-URL der App |
| `STRIPE_SECRET_KEY` | Stripe Secret Key |
| `STRIPE_PUBLISHABLE_KEY` | Stripe Public Key |

## Projektstruktur

```
mcpap/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (shop)/       # Shop-Seiten
│   │   ├── (auth)/       # Auth-Seiten
│   │   ├── admin/        # Admin-Panel
│   │   └── api/          # API Routes
│   ├── components/       # React Komponenten
│   │   ├── ui/           # UI Komponenten
│   │   ├── shop/         # Shop Komponenten
│   │   └── admin/        # Admin Komponenten
│   ├── lib/              # Utilities & Services
│   └── types/            # TypeScript Types
├── prisma/
│   ├── schema.prisma     # Datenbankschema
│   └── seed.ts           # Seed-Daten
├── public/               # Statische Dateien
├── docker/               # Docker Konfiguration
└── nginx/                # nginx Konfiguration
```

## Kundengruppen & Rabatte

| Gruppe | Rabatt | Beschreibung |
|--------|--------|--------------|
| Standard | 0% | Neue Kunden |
| Silber | 5% | Stammkunden |
| Gold | 10% | Premium-Kunden |
| Platin | 15% | Top-Kunden |

## Filialgutscheine

Bei Online-Bestellungen werden automatisch Gutscheine für die Filiale generiert:
- Ab 100€ Bestellwert: 5€ Gutschein
- Ab 150€ Bestellwert: 10€ Gutschein

Gültigkeit: 6 Monate

## Lizenz

Copyright © 2024 McPaper AG (Demo). Alle Rechte vorbehalten.

---

**DEMO** - Dies ist eine Testumgebung und keine echte Shop-Website.
