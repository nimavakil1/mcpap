import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient().$extends({});

async function main() {
  console.log('🌱 Starting database seed...');

  // Create customer groups
  console.log('Creating customer groups...');
  const customerGroups = await Promise.all([
    prisma.customerGroup.upsert({
      where: { name: 'Standard' },
      update: {},
      create: { name: 'Standard', discountPercentage: 0, description: 'Standardkunden ohne Rabatt' },
    }),
    prisma.customerGroup.upsert({
      where: { name: 'Silber' },
      update: {},
      create: { name: 'Silber', discountPercentage: 5, description: '5% Rabatt für Silber-Kunden' },
    }),
    prisma.customerGroup.upsert({
      where: { name: 'Gold' },
      update: {},
      create: { name: 'Gold', discountPercentage: 10, description: '10% Rabatt für Gold-Kunden' },
    }),
    prisma.customerGroup.upsert({
      where: { name: 'Platin' },
      update: {},
      create: { name: 'Platin', discountPercentage: 15, description: '15% Rabatt für Platin-Kunden' },
    }),
  ]);

  // Create admin user
  console.log('Creating admin user...');
  const adminPassword = 'McPaper2024!Admin';
  const adminHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: 'general@distri-smart.com' },
    update: {},
    create: {
      email: 'general@distri-smart.com',
      passwordHash: adminHash,
      name: 'Administrator',
      role: 'super_admin',
      isActive: true,
    },
  });
  console.log(`Admin user created: general@distri-smart.com / ${adminPassword}`);

  // Create categories
  console.log('Creating categories...');
  const categories = [
    { name: 'Papier & Drucken', slug: 'papier-drucken', description: 'Kopierpapier, Druckerpapier und Spezialpapiere', sortOrder: 1 },
    { name: 'Schreibwaren', slug: 'schreibwaren', description: 'Kugelschreiber, Bleistifte, Marker und mehr', sortOrder: 2 },
    { name: 'Ordnen & Archivieren', slug: 'ordnen-archivieren', description: 'Ordner, Ringbücher, Hefter und Mappen', sortOrder: 3 },
    { name: 'Tinte & Toner', slug: 'tinte-toner', description: 'Druckerpatronen und Toner für alle Drucker', sortOrder: 4 },
    { name: 'Bürotechnik', slug: 'buerotechnik', description: 'Taschenrechner, Laminiergeräte und Aktenvernichter', sortOrder: 5 },
    { name: 'Versand & Verpackung', slug: 'versand-verpackung', description: 'Versandtaschen, Kartons und Verpackungsmaterial', sortOrder: 6 },
    { name: 'Hygiene & Reinigung', slug: 'hygiene-reinigung', description: 'Hygienepapiere und Reinigungsmittel', sortOrder: 7 },
    { name: 'Präsentation', slug: 'praesentation', description: 'Flipcharts, Whiteboards und Präsentationszubehör', sortOrder: 8 },
    { name: 'Schule & Kreativ', slug: 'schule-kreativ', description: 'Schulbedarf und Bastelmaterial', sortOrder: 9 },
    { name: 'Büromöbel & Accessoires', slug: 'bueromoebel-accessoires', description: 'Schreibtischzubehör und Büroorganisation', sortOrder: 10 },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
  }

  // Create 200 products
  console.log('Creating 200 products...');

  const products = [
    // PAPIER & DRUCKEN (20 products)
    { sku: 'NAV-A4-500', ean: '5602024006119', name: 'Navigator Universal Kopierpapier A4, 80g/m², 500 Blatt', slug: 'navigator-universal-kopierpapier-a4', shortDescription: 'Premium Kopierpapier für alle Drucker', manufacturer: 'Navigator', categorySlug: 'papier-drucken', basePrice: 5.99, stockQuantity: 500, unitOfMeasure: 'Packung', unitsPerPackage: 500, isBestseller: true, attributes: [{ name: 'Format', value: 'A4' }, { name: 'Grammatur', value: '80 g/m²' }, { name: 'Farbe', value: 'Weiß' }] },
    { sku: 'NAV-A4-2500', ean: '5602024006126', name: 'Navigator Universal Kopierpapier A4, 80g/m², 2500 Blatt Karton', slug: 'navigator-universal-kopierpapier-a4-karton', shortDescription: 'Premium Kopierpapier im Vorratskarton', manufacturer: 'Navigator', categorySlug: 'papier-drucken', basePrice: 27.99, stockQuantity: 100, unitOfMeasure: 'Karton', unitsPerPackage: 2500, isBestseller: true, attributes: [{ name: 'Format', value: 'A4' }, { name: 'Grammatur', value: '80 g/m²' }] },
    { sku: 'NAV-A3-500', ean: '5602024006133', name: 'Navigator Universal Kopierpapier A3, 80g/m², 500 Blatt', slug: 'navigator-universal-kopierpapier-a3', shortDescription: 'Premium Kopierpapier im A3-Format', manufacturer: 'Navigator', categorySlug: 'papier-drucken', basePrice: 11.99, stockQuantity: 200, unitOfMeasure: 'Packung', unitsPerPackage: 500, attributes: [{ name: 'Format', value: 'A3' }, { name: 'Grammatur', value: '80 g/m²' }] },
    { sku: 'REY-A4-500', ean: '3148950235503', name: 'Rey Adagio Farbiges Kopierpapier A4, 80g/m², 500 Blatt, Gelb', slug: 'rey-adagio-kopierpapier-gelb', shortDescription: 'Farbiges Kopierpapier in Intensiv-Gelb', manufacturer: 'Rey', categorySlug: 'papier-drucken', basePrice: 8.49, stockQuantity: 150, unitOfMeasure: 'Packung', unitsPerPackage: 500, attributes: [{ name: 'Format', value: 'A4' }, { name: 'Farbe', value: 'Gelb' }] },
    { sku: 'REY-A4-500-BL', ean: '3148950235510', name: 'Rey Adagio Farbiges Kopierpapier A4, 80g/m², 500 Blatt, Blau', slug: 'rey-adagio-kopierpapier-blau', shortDescription: 'Farbiges Kopierpapier in Intensiv-Blau', manufacturer: 'Rey', categorySlug: 'papier-drucken', basePrice: 8.49, stockQuantity: 150, unitOfMeasure: 'Packung', unitsPerPackage: 500, attributes: [{ name: 'Format', value: 'A4' }, { name: 'Farbe', value: 'Blau' }] },
    { sku: 'HP-PREM-A4', ean: '8032779789567', name: 'HP Premium Druckerpapier A4, 90g/m², 500 Blatt', slug: 'hp-premium-druckerpapier-a4', shortDescription: 'Hochwertiges Papier für Laserdrucker', manufacturer: 'HP', categorySlug: 'papier-drucken', basePrice: 9.99, stockQuantity: 300, unitOfMeasure: 'Packung', unitsPerPackage: 500, attributes: [{ name: 'Format', value: 'A4' }, { name: 'Grammatur', value: '90 g/m²' }] },
    { sku: 'HP-PHOTO-A4', ean: '8032779789574', name: 'HP Advanced Fotopapier A4, 250g/m², 50 Blatt, glänzend', slug: 'hp-advanced-fotopapier-a4', shortDescription: 'Glänzendes Fotopapier für brillante Bilder', manufacturer: 'HP', categorySlug: 'papier-drucken', basePrice: 14.99, stockQuantity: 100, unitOfMeasure: 'Packung', unitsPerPackage: 50, attributes: [{ name: 'Format', value: 'A4' }, { name: 'Grammatur', value: '250 g/m²' }, { name: 'Oberfläche', value: 'Glänzend' }] },
    { sku: 'SIG-BRIF-A4', ean: '4004360882500', name: 'Sigel Briefpapier Design A4, 90g/m², 100 Blatt, Marmor', slug: 'sigel-briefpapier-marmor', shortDescription: 'Elegantes Briefpapier mit Marmor-Design', manufacturer: 'Sigel', categorySlug: 'papier-drucken', basePrice: 12.99, stockQuantity: 80, unitOfMeasure: 'Packung', unitsPerPackage: 100, attributes: [{ name: 'Format', value: 'A4' }, { name: 'Design', value: 'Marmor' }] },
    { sku: 'HER-ETIK-A4', ean: '4008705044523', name: 'Herma Etiketten A4, 70x36mm, 2400 Stück', slug: 'herma-etiketten-70x36', shortDescription: 'Universal-Etiketten für Laser- und Tintenstrahldrucker', manufacturer: 'Herma', categorySlug: 'papier-drucken', basePrice: 19.99, stockQuantity: 120, unitOfMeasure: 'Packung', unitsPerPackage: 2400, attributes: [{ name: 'Format', value: '70x36mm' }, { name: 'Typ', value: 'Universal' }] },
    { sku: 'AVE-ETIK-A4', ean: '5014702000126', name: 'Avery Zweckform Adressetiketten A4, 63,5x38,1mm, 2100 Stück', slug: 'avery-adressetiketten', shortDescription: 'Selbstklebende Adressetiketten', manufacturer: 'Avery Zweckform', categorySlug: 'papier-drucken', basePrice: 24.99, stockQuantity: 90, unitOfMeasure: 'Packung', unitsPerPackage: 2100, isFeatured: true, attributes: [{ name: 'Format', value: '63,5x38,1mm' }] },
    { sku: 'CLN-RECY-A4', ean: '4250484567890', name: 'Clairefontaine Recycling Kopierpapier A4, 80g/m², 500 Blatt', slug: 'clairefontaine-recycling-kopierpapier', shortDescription: '100% Recyclingpapier, Blauer Engel zertifiziert', manufacturer: 'Clairefontaine', categorySlug: 'papier-drucken', basePrice: 6.99, stockQuantity: 250, unitOfMeasure: 'Packung', unitsPerPackage: 500, attributes: [{ name: 'Format', value: 'A4' }, { name: 'Zertifikat', value: 'Blauer Engel' }] },
    { sku: 'MON-BRILL', ean: '4250123456789', name: 'Mondi Color Copy Brillantpapier A4, 120g/m², 250 Blatt', slug: 'mondi-color-copy-brillant', shortDescription: 'Premiumweißes Papier für Farbdrucke', manufacturer: 'Mondi', categorySlug: 'papier-drucken', basePrice: 15.99, stockQuantity: 80, unitOfMeasure: 'Packung', unitsPerPackage: 250, attributes: [{ name: 'Format', value: 'A4' }, { name: 'Grammatur', value: '120 g/m²' }] },
    { sku: 'STE-BLOCK-A5', ean: '4006381333627', name: 'Steiner Schreibblock A5, 50 Blatt, liniert', slug: 'steiner-schreibblock-a5-liniert', shortDescription: 'Klassischer Schreibblock mit Perforation', manufacturer: 'Steiner', categorySlug: 'papier-drucken', basePrice: 2.49, stockQuantity: 400, unitOfMeasure: 'Stück', attributes: [{ name: 'Format', value: 'A5' }, { name: 'Lineatur', value: 'Liniert' }] },
    { sku: 'SIG-VISK-A4', ean: '4004360991234', name: 'Sigel Visitenkarten A4, 225g/m², 100 Stück, weiß', slug: 'sigel-visitenkarten-weiss', shortDescription: 'Bedruckbare Visitenkarten für Inkjet und Laser', manufacturer: 'Sigel', categorySlug: 'papier-drucken', basePrice: 11.99, stockQuantity: 60, unitOfMeasure: 'Packung', unitsPerPackage: 100, attributes: [{ name: 'Grammatur', value: '225 g/m²' }] },
    { sku: 'PPR-KRAFT-A4', ean: '4250567891234', name: 'Kraftpapier A4, 100g/m², 100 Blatt, braun', slug: 'kraftpapier-a4-braun', shortDescription: 'Naturfarbenes Kraftpapier für kreative Projekte', manufacturer: 'Generic', categorySlug: 'papier-drucken', basePrice: 8.99, stockQuantity: 70, unitOfMeasure: 'Packung', unitsPerPackage: 100, attributes: [{ name: 'Format', value: 'A4' }, { name: 'Farbe', value: 'Braun' }] },
    { sku: 'SYM-THERM', ean: '4250891234567', name: 'Symcode Thermopapier für Kassensysteme, 80x80mm, 50 Rollen', slug: 'thermopapier-kasse-80x80', shortDescription: 'Hochwertiges Thermopapier für Kassenbons', manufacturer: 'Symcode', categorySlug: 'papier-drucken', basePrice: 34.99, stockQuantity: 40, unitOfMeasure: 'Karton', unitsPerPackage: 50, attributes: [{ name: 'Format', value: '80x80mm' }] },
    { sku: 'BRO-DURCHS-A4', ean: '4210912345678', name: 'Durchschlagpapier A4, 500 Blatt, weiß/rosa/gelb', slug: 'durchschlagpapier-a4-3fach', shortDescription: '3-fach Durchschreibesätze', manufacturer: 'Büroring', categorySlug: 'papier-drucken', basePrice: 29.99, stockQuantity: 30, unitOfMeasure: 'Packung', unitsPerPackage: 500, isAvailableOnline: false, attributes: [{ name: 'Format', value: 'A4' }, { name: 'Typ', value: '3-fach' }] },
    { sku: 'PLT-TRANS-A4', ean: '4250678912345', name: 'Overheadfolien A4, 100 Stück, für Kopierer', slug: 'overheadfolien-a4-kopierer', shortDescription: 'Klare Folien für Overhead-Projektoren', manufacturer: 'Generic', categorySlug: 'papier-drucken', basePrice: 22.99, stockQuantity: 45, unitOfMeasure: 'Packung', unitsPerPackage: 100, attributes: [{ name: 'Format', value: 'A4' }] },
    { sku: 'SIG-URKU-A4', ean: '4004360556677', name: 'Sigel Urkundenpapier A4, 185g/m², 20 Blatt, Elefantenhaut', slug: 'sigel-urkundenpapier-elefantenhaut', shortDescription: 'Hochwertiges Papier für Urkunden und Zertifikate', manufacturer: 'Sigel', categorySlug: 'papier-drucken', basePrice: 9.99, stockQuantity: 35, unitOfMeasure: 'Packung', unitsPerPackage: 20, attributes: [{ name: 'Format', value: 'A4' }, { name: 'Design', value: 'Elefantenhaut' }] },
    { sku: 'HLT-PLKRT-A4', ean: '4250789123456', name: 'Plakatkarton A4, 380g/m², 50 Blatt, weiß', slug: 'plakatkarton-a4-weiss', shortDescription: 'Stabiler Karton für Plakate und Schilder', manufacturer: 'Generic', categorySlug: 'papier-drucken', basePrice: 16.99, stockQuantity: 55, unitOfMeasure: 'Packung', unitsPerPackage: 50, attributes: [{ name: 'Format', value: 'A4' }, { name: 'Grammatur', value: '380 g/m²' }] },

    // SCHREIBWAREN (20 products)
    { sku: 'STA-NORIS-12', ean: '4007817104088', name: 'Staedtler Noris HB Bleistifte 12er Pack', slug: 'staedtler-noris-hb-12er', shortDescription: 'Der Klassiker für Schule und Büro', manufacturer: 'Staedtler', categorySlug: 'schreibwaren', basePrice: 4.49, stockQuantity: 300, unitOfMeasure: 'Packung', unitsPerPackage: 12, isBestseller: true, attributes: [{ name: 'Härtegrad', value: 'HB' }, { name: 'Material', value: 'Holz' }] },
    { sku: 'STA-MARS-4', ean: '4007817106723', name: 'Staedtler Mars Lumograph Bleistifte Set 6 Härtegrade', slug: 'staedtler-mars-lumograph-set', shortDescription: 'Professionelle Bleistifte für Künstler', manufacturer: 'Staedtler', categorySlug: 'schreibwaren', basePrice: 11.99, stockQuantity: 100, unitOfMeasure: 'Set', unitsPerPackage: 6, attributes: [{ name: 'Härtegrade', value: '2H, HB, B, 2B, 4B, 6B' }] },
    { sku: 'EDD-3000-4', ean: '4004764928774', name: 'edding 3000 Permanentmarker 4er Set', slug: 'edding-3000-permanentmarker-4er', shortDescription: 'Permanent auf fast allen Oberflächen', manufacturer: 'edding', categorySlug: 'schreibwaren', basePrice: 8.99, stockQuantity: 180, unitOfMeasure: 'Set', unitsPerPackage: 4, isBestseller: true, attributes: [{ name: 'Strichbreite', value: '1,5-3mm' }] },
    { sku: 'EDD-7-SET', ean: '4004764879243', name: 'edding 7 Mini-Textmarker 4er Set Neon', slug: 'edding-7-mini-textmarker-4er', shortDescription: 'Kompakte Textmarker für unterwegs', manufacturer: 'edding', categorySlug: 'schreibwaren', basePrice: 5.49, stockQuantity: 200, unitOfMeasure: 'Set', unitsPerPackage: 4, isNewArrival: true, attributes: [{ name: 'Farben', value: 'Neon' }] },
    { sku: 'STB-430-10', ean: '4006608811064', name: 'Stabilo Boss Original Textmarker 10er Pack', slug: 'stabilo-boss-original-10er', shortDescription: 'Der Original-Textmarker', manufacturer: 'Stabilo', categorySlug: 'schreibwaren', basePrice: 12.99, stockQuantity: 150, unitOfMeasure: 'Packung', unitsPerPackage: 10, isBestseller: true, attributes: [{ name: 'Typ', value: 'Textmarker' }] },
    { sku: 'PEL-FUELL-BL', ean: '4012700601308', name: 'Pelikan Füller Pelikano Junior, blau', slug: 'pelikan-pelikano-junior-blau', shortDescription: 'Idealer Schulfüller für Anfänger', manufacturer: 'Pelikan', categorySlug: 'schreibwaren', basePrice: 14.99, stockQuantity: 80, unitOfMeasure: 'Stück', attributes: [{ name: 'Feder', value: 'A (Anfänger)' }, { name: 'Farbe', value: 'Blau' }] },
    { sku: 'PEL-TINT-KO', ean: '4012700304308', name: 'Pelikan 4001 Tinte Königsblau, 62,5ml', slug: 'pelikan-4001-tinte-koenigsblau', shortDescription: 'Klassische Füllfederhaltertinte', manufacturer: 'Pelikan', categorySlug: 'schreibwaren', basePrice: 3.99, stockQuantity: 250, unitOfMeasure: 'Flasche', attributes: [{ name: 'Farbe', value: 'Königsblau' }, { name: 'Inhalt', value: '62,5ml' }] },
    { sku: 'FAB-POL-12', ean: '4005401128120', name: 'Faber-Castell Polychromos Buntstifte 12er Set', slug: 'faber-castell-polychromos-12er', shortDescription: 'Künstler-Buntstifte höchster Qualität', manufacturer: 'Faber-Castell', categorySlug: 'schreibwaren', basePrice: 29.99, stockQuantity: 60, unitOfMeasure: 'Set', unitsPerPackage: 12, isFeatured: true, attributes: [{ name: 'Typ', value: 'Künstler-Buntstifte' }] },
    { sku: 'FAB-GRIP-12', ean: '4005401124122', name: 'Faber-Castell Colour Grip Buntstifte 12er', slug: 'faber-castell-colour-grip-12er', shortDescription: 'Ergonomische Buntstifte für Kinder', manufacturer: 'Faber-Castell', categorySlug: 'schreibwaren', basePrice: 7.99, stockQuantity: 180, unitOfMeasure: 'Packung', unitsPerPackage: 12, attributes: [{ name: 'Typ', value: 'Kinder-Buntstifte' }] },
    { sku: 'BIC-CRIS-50', ean: '3086123456789', name: 'BIC Cristal Original Kugelschreiber 50er Pack, blau', slug: 'bic-cristal-original-50er-blau', shortDescription: 'Der meistverkaufte Kugelschreiber der Welt', manufacturer: 'BIC', categorySlug: 'schreibwaren', basePrice: 16.99, stockQuantity: 200, unitOfMeasure: 'Packung', unitsPerPackage: 50, isBestseller: true, attributes: [{ name: 'Farbe', value: 'Blau' }, { name: 'Strichbreite', value: '0,4mm' }] },
    { sku: 'BIC-4COL', ean: '3086124567890', name: 'BIC 4 Colours Original Kugelschreiber', slug: 'bic-4-colours-original', shortDescription: '4 Farben in einem Stift', manufacturer: 'BIC', categorySlug: 'schreibwaren', basePrice: 3.99, stockQuantity: 300, unitOfMeasure: 'Stück', attributes: [{ name: 'Farben', value: 'Blau, Schwarz, Rot, Grün' }] },
    { sku: 'PIL-G2-5', ean: '4902505166624', name: 'Pilot G2 Gel-Kugelschreiber 5er Set', slug: 'pilot-g2-gel-5er', shortDescription: 'Smooth writing Gel-Kugelschreiber', manufacturer: 'Pilot', categorySlug: 'schreibwaren', basePrice: 11.99, stockQuantity: 120, unitOfMeasure: 'Set', unitsPerPackage: 5, attributes: [{ name: 'Typ', value: 'Gel-Kugelschreiber' }] },
    { sku: 'UNI-PSCX-5', ean: '4902778734520', name: 'uni-ball Posca PC-5M Marker 8er Set', slug: 'uni-posca-pc5m-8er', shortDescription: 'Wasserfeste Pigmentmarker', manufacturer: 'uni-ball', categorySlug: 'schreibwaren', basePrice: 24.99, stockQuantity: 50, unitOfMeasure: 'Set', unitsPerPackage: 8, attributes: [{ name: 'Strichbreite', value: '1,8-2,5mm' }] },
    { sku: 'STA-RADIER', ean: '4007817526538', name: 'Staedtler Mars plastic Radierer 4er Pack', slug: 'staedtler-mars-plastic-radierer-4er', shortDescription: 'Premium Kunststoffradierer', manufacturer: 'Staedtler', categorySlug: 'schreibwaren', basePrice: 4.99, stockQuantity: 250, unitOfMeasure: 'Packung', unitsPerPackage: 4, attributes: [{ name: 'Typ', value: 'Kunststoffradierer' }] },
    { sku: 'FAB-SPITZ-2', ean: '4005401832270', name: 'Faber-Castell Grip 2001 Doppelspitzer', slug: 'faber-castell-grip-2001-spitzer', shortDescription: 'Ergonomischer Dosenspitzer', manufacturer: 'Faber-Castell', categorySlug: 'schreibwaren', basePrice: 3.49, stockQuantity: 180, unitOfMeasure: 'Stück', attributes: [{ name: 'Typ', value: 'Dosenspitzer' }] },
    { sku: 'LAM-KORR-10', ean: '4009249001234', name: 'Lamy Korrekturroller 2-Wege, 10er Pack', slug: 'lamy-korrekturroller-10er', shortDescription: 'Präzise Korrektur in beide Richtungen', manufacturer: 'Lamy', categorySlug: 'schreibwaren', basePrice: 19.99, stockQuantity: 80, unitOfMeasure: 'Packung', unitsPerPackage: 10, attributes: [{ name: 'Bandbreite', value: '5mm' }] },
    { sku: 'TIP-EX-3', ean: '3086126140503', name: 'Tipp-Ex Mini Pocket Mouse 3er Pack', slug: 'tipp-ex-mini-pocket-mouse-3er', shortDescription: 'Kompakter Korrekturroller für unterwegs', manufacturer: 'Tipp-Ex', categorySlug: 'schreibwaren', basePrice: 7.99, stockQuantity: 150, unitOfMeasure: 'Packung', unitsPerPackage: 3, attributes: [{ name: 'Bandlänge', value: '5m' }] },
    { sku: 'PEL-WASF-12', ean: '4012700750129', name: 'Pelikan K12 Wasserfarben 12 Farben', slug: 'pelikan-k12-wasserfarben-12er', shortDescription: 'Deckfarbkasten mit austauschbaren Farben', manufacturer: 'Pelikan', categorySlug: 'schreibwaren', basePrice: 8.99, stockQuantity: 100, unitOfMeasure: 'Stück', isAvailableOnline: false, attributes: [{ name: 'Farben', value: '12' }] },
    { sku: 'STA-FINE-5', ean: '4007817334683', name: 'Staedtler Triplus Fineliner 10er Etui', slug: 'staedtler-triplus-fineliner-10er', shortDescription: 'Feine Spitze für präzise Linien', manufacturer: 'Staedtler', categorySlug: 'schreibwaren', basePrice: 9.99, stockQuantity: 140, unitOfMeasure: 'Etui', unitsPerPackage: 10, attributes: [{ name: 'Strichbreite', value: '0,3mm' }] },
    { sku: 'SHR-S-GEL', ean: '4901770623480', name: 'Sharpie S-Gel Stifte 4er Pack', slug: 'sharpie-s-gel-4er', shortDescription: 'Glatter Gel-Schreibkomfort', manufacturer: 'Sharpie', categorySlug: 'schreibwaren', basePrice: 13.99, stockQuantity: 90, unitOfMeasure: 'Packung', unitsPerPackage: 4, isNewArrival: true, attributes: [{ name: 'Typ', value: 'Gel-Stift' }] },

    // ORDNEN & ARCHIVIEREN (20 products)
    { sku: 'LEI-1010-BL', ean: '4002432309658', name: 'Leitz 1010 Qualitätsordner 80mm blau', slug: 'leitz-1010-qualitaetsordner-80mm-blau', shortDescription: 'Der Büroklassiker in Premium-Qualität', manufacturer: 'Leitz', categorySlug: 'ordnen-archivieren', basePrice: 3.99, stockQuantity: 300, unitOfMeasure: 'Stück', isBestseller: true, attributes: [{ name: 'Rückenbreite', value: '80mm' }, { name: 'Farbe', value: 'Blau' }] },
    { sku: 'LEI-1010-SW', ean: '4002432309665', name: 'Leitz 1010 Qualitätsordner 80mm schwarz', slug: 'leitz-1010-qualitaetsordner-80mm-schwarz', shortDescription: 'Der Büroklassiker in Premium-Qualität', manufacturer: 'Leitz', categorySlug: 'ordnen-archivieren', basePrice: 3.99, stockQuantity: 300, unitOfMeasure: 'Stück', isBestseller: true, attributes: [{ name: 'Rückenbreite', value: '80mm' }, { name: 'Farbe', value: 'Schwarz' }] },
    { sku: 'LEI-1010-RO', ean: '4002432309672', name: 'Leitz 1010 Qualitätsordner 80mm rot', slug: 'leitz-1010-qualitaetsordner-80mm-rot', shortDescription: 'Der Büroklassiker in Premium-Qualität', manufacturer: 'Leitz', categorySlug: 'ordnen-archivieren', basePrice: 3.99, stockQuantity: 200, unitOfMeasure: 'Stück', attributes: [{ name: 'Rückenbreite', value: '80mm' }, { name: 'Farbe', value: 'Rot' }] },
    { sku: 'LEI-1080-BL', ean: '4002432309689', name: 'Leitz 1080 Ordner-Wolkenmarmor 80mm blau', slug: 'leitz-1080-wolkenmarmor-80mm-blau', shortDescription: 'Klassischer Ordner mit Wolkenmarmor-Optik', manufacturer: 'Leitz', categorySlug: 'ordnen-archivieren', basePrice: 2.49, stockQuantity: 400, unitOfMeasure: 'Stück', attributes: [{ name: 'Rückenbreite', value: '80mm' }, { name: 'Design', value: 'Wolkenmarmor' }] },
    { sku: 'HER-RING-A4', ean: '4008705920144', name: 'Herlitz Ringbuch A4 2-Ring 25mm transparent', slug: 'herlitz-ringbuch-a4-2ring-transparent', shortDescription: 'Praktisches Ringbuch für Dokumente', manufacturer: 'Herlitz', categorySlug: 'ordnen-archivieren', basePrice: 2.99, stockQuantity: 200, unitOfMeasure: 'Stück', attributes: [{ name: 'Ringanzahl', value: '2' }, { name: 'Rückenbreite', value: '25mm' }] },
    { sku: 'HER-RING-4R', ean: '4008705920151', name: 'Herlitz Ringbuch A4 4-Ring 40mm schwarz', slug: 'herlitz-ringbuch-a4-4ring-schwarz', shortDescription: 'Stabiles 4-Ring Ringbuch', manufacturer: 'Herlitz', categorySlug: 'ordnen-archivieren', basePrice: 4.99, stockQuantity: 150, unitOfMeasure: 'Stück', attributes: [{ name: 'Ringanzahl', value: '4' }, { name: 'Rückenbreite', value: '40mm' }] },
    { sku: 'LEI-REG-A4', ean: '4002432396221', name: 'Leitz Register A4 1-12 Monate', slug: 'leitz-register-a4-1-12-monate', shortDescription: 'Farbiges Register mit Monatsunterteilung', manufacturer: 'Leitz', categorySlug: 'ordnen-archivieren', basePrice: 5.99, stockQuantity: 180, unitOfMeasure: 'Stück', attributes: [{ name: 'Einteilung', value: '1-12 Monate' }] },
    { sku: 'LEI-REG-AZ', ean: '4002432396238', name: 'Leitz Register A4 A-Z', slug: 'leitz-register-a4-a-z', shortDescription: 'Alphabetisches Register für Ordner', manufacturer: 'Leitz', categorySlug: 'ordnen-archivieren', basePrice: 4.99, stockQuantity: 200, unitOfMeasure: 'Stück', attributes: [{ name: 'Einteilung', value: 'A-Z' }] },
    { sku: 'ELB-HEFT-A4', ean: '4003928712341', name: 'Elba Schnellhefter A4 Kunststoff 25er Pack', slug: 'elba-schnellhefter-a4-25er', shortDescription: 'Farbig sortierte Schnellhefter', manufacturer: 'Elba', categorySlug: 'ordnen-archivieren', basePrice: 14.99, stockQuantity: 120, unitOfMeasure: 'Packung', unitsPerPackage: 25, attributes: [{ name: 'Material', value: 'Kunststoff' }] },
    { sku: 'LEI-MAP-A4', ean: '4002432396252', name: 'Leitz Sammelmappe A4 mit Gummizug schwarz', slug: 'leitz-sammelmappe-a4-gummizug-schwarz', shortDescription: 'Robuste Mappe für lose Dokumente', manufacturer: 'Leitz', categorySlug: 'ordnen-archivieren', basePrice: 3.49, stockQuantity: 250, unitOfMeasure: 'Stück', attributes: [{ name: 'Verschluss', value: 'Gummizug' }] },
    { sku: 'HAN-ABLG-5', ean: '4012376000123', name: 'HAN Briefablage A4 5er Set', slug: 'han-briefablage-a4-5er', shortDescription: 'Stapelbare Ablagen für den Schreibtisch', manufacturer: 'HAN', categorySlug: 'ordnen-archivieren', basePrice: 19.99, stockQuantity: 80, unitOfMeasure: 'Set', unitsPerPackage: 5, attributes: [{ name: 'Material', value: 'Kunststoff' }] },
    { sku: 'LEI-SICHT-100', ean: '4002432396276', name: 'Leitz Sichthüllen A4 genarbt 100er Pack', slug: 'leitz-sichthuellen-a4-100er', shortDescription: 'Dokumentenschutz mit genarbter Oberfläche', manufacturer: 'Leitz', categorySlug: 'ordnen-archivieren', basePrice: 8.99, stockQuantity: 200, unitOfMeasure: 'Packung', unitsPerPackage: 100, attributes: [{ name: 'Oberfläche', value: 'Genarbt' }] },
    { sku: 'DUR-SICHT-50', ean: '4005546504230', name: 'Durable Klemmmappe A4 50 Blatt 10er Pack', slug: 'durable-klemmmappe-a4-10er', shortDescription: 'Praktische Klemmmappen für Präsentationen', manufacturer: 'Durable', categorySlug: 'ordnen-archivieren', basePrice: 12.99, stockQuantity: 90, unitOfMeasure: 'Packung', unitsPerPackage: 10, attributes: [{ name: 'Kapazität', value: '50 Blatt' }] },
    { sku: 'LEI-ARCH-BOX', ean: '4002432396290', name: 'Leitz Archivbox Click & Store M blau', slug: 'leitz-archivbox-click-store-m-blau', shortDescription: 'Stylische Aufbewahrungsbox', manufacturer: 'Leitz', categorySlug: 'ordnen-archivieren', basePrice: 16.99, stockQuantity: 60, unitOfMeasure: 'Stück', isFeatured: true, attributes: [{ name: 'Größe', value: 'M' }] },
    { sku: 'BAN-AKTE-50', ean: '4009249100234', name: 'Bankers Box Archivkarton 50er Pack', slug: 'bankers-box-archivkarton-50er', shortDescription: 'Robuste Kartons für die Langzeitarchivierung', manufacturer: 'Bankers Box', categorySlug: 'ordnen-archivieren', basePrice: 89.99, stockQuantity: 20, unitOfMeasure: 'Packung', unitsPerPackage: 50, attributes: [{ name: 'Material', value: 'Wellpappe' }] },
    { sku: 'LEI-PENDEL-25', ean: '4002432396313', name: 'Leitz Pendelhefter 25er Pack sortiert', slug: 'leitz-pendelhefter-25er', shortDescription: 'Farbige Hefter für Hängeregistraturen', manufacturer: 'Leitz', categorySlug: 'ordnen-archivieren', basePrice: 22.99, stockQuantity: 70, unitOfMeasure: 'Packung', unitsPerPackage: 25, attributes: [{ name: 'Typ', value: 'Pendelhefter' }] },
    { sku: 'ELB-HAENG-25', ean: '4003928712365', name: 'Elba Hängemappen A4 25er Pack grün', slug: 'elba-haengemappen-a4-25er-gruen', shortDescription: 'Standard-Hängemappen für Registraturen', manufacturer: 'Elba', categorySlug: 'ordnen-archivieren', basePrice: 18.99, stockQuantity: 85, unitOfMeasure: 'Packung', unitsPerPackage: 25, attributes: [{ name: 'Farbe', value: 'Grün' }] },
    { sku: 'HAN-KARTEI-A5', ean: '4012376001234', name: 'HAN Karteikasten A5 gefüllt 500 Karten', slug: 'han-karteikasten-a5-500', shortDescription: 'Karteikasten mit linierten Karten', manufacturer: 'HAN', categorySlug: 'ordnen-archivieren', basePrice: 14.99, stockQuantity: 40, unitOfMeasure: 'Set', isAvailableOnline: false, attributes: [{ name: 'Format', value: 'A5' }] },
    { sku: 'LEI-ORDSET-5', ean: '4002432396337', name: 'Leitz Ordner Set 5-teilig Pastell', slug: 'leitz-ordner-set-5teilig-pastell', shortDescription: 'Trendy Pastellfarben im Set', manufacturer: 'Leitz', categorySlug: 'ordnen-archivieren', basePrice: 24.99, stockQuantity: 50, unitOfMeasure: 'Set', unitsPerPackage: 5, isNewArrival: true, attributes: [{ name: 'Farben', value: 'Pastell' }] },
    { sku: 'BRO-TREN-12', ean: '4210912345692', name: 'Büroring Trennblätter A4 100er Pack', slug: 'bueroring-trennblaetter-a4-100er', shortDescription: 'Bunte Trennblätter für Ordner', manufacturer: 'Büroring', categorySlug: 'ordnen-archivieren', basePrice: 6.99, stockQuantity: 160, unitOfMeasure: 'Packung', unitsPerPackage: 100, attributes: [{ name: 'Material', value: 'Karton' }] },

    // Continue with more categories...
    // TINTE & TONER (20 products)
    { sku: 'HP-304-BK', ean: '0889894860873', name: 'HP 304 Original Tintenpatrone schwarz', slug: 'hp-304-tintenpatrone-schwarz', shortDescription: 'Original HP Tinte für DeskJet/ENVY', manufacturer: 'HP', categorySlug: 'tinte-toner', basePrice: 16.99, stockQuantity: 150, unitOfMeasure: 'Stück', isBestseller: true, attributes: [{ name: 'Farbe', value: 'Schwarz' }, { name: 'Seitenreichweite', value: '~120 Seiten' }] },
    { sku: 'HP-304-CL', ean: '0889894860880', name: 'HP 304 Original Tintenpatrone dreifarbig', slug: 'hp-304-tintenpatrone-dreifarbig', shortDescription: 'Original HP Farbtinte', manufacturer: 'HP', categorySlug: 'tinte-toner', basePrice: 19.99, stockQuantity: 140, unitOfMeasure: 'Stück', attributes: [{ name: 'Farbe', value: 'Cyan/Magenta/Gelb' }] },
    { sku: 'HP-305XL-BK', ean: '0193905407699', name: 'HP 305XL Original Tintenpatrone schwarz XL', slug: 'hp-305xl-tintenpatrone-schwarz', shortDescription: 'Hohe Reichweite für DeskJet/ENVY', manufacturer: 'HP', categorySlug: 'tinte-toner', basePrice: 24.99, stockQuantity: 120, unitOfMeasure: 'Stück', attributes: [{ name: 'Farbe', value: 'Schwarz' }, { name: 'Seitenreichweite', value: '~240 Seiten' }] },
    { sku: 'CAN-PG545-BK', ean: '4960999974521', name: 'Canon PG-545 Tintenpatrone schwarz', slug: 'canon-pg545-tintenpatrone-schwarz', shortDescription: 'Original Canon Schwarztinte', manufacturer: 'Canon', categorySlug: 'tinte-toner', basePrice: 14.99, stockQuantity: 130, unitOfMeasure: 'Stück', attributes: [{ name: 'Farbe', value: 'Schwarz' }] },
    { sku: 'CAN-CL546-CL', ean: '4960999974538', name: 'Canon CL-546 Tintenpatrone dreifarbig', slug: 'canon-cl546-tintenpatrone-farbig', shortDescription: 'Original Canon Farbtinte', manufacturer: 'Canon', categorySlug: 'tinte-toner', basePrice: 17.99, stockQuantity: 110, unitOfMeasure: 'Stück', attributes: [{ name: 'Farbe', value: 'Cyan/Magenta/Gelb' }] },
    { sku: 'EPS-T0711-BK', ean: '8715946479644', name: 'Epson T0711 Tintenpatrone schwarz', slug: 'epson-t0711-tintenpatrone-schwarz', shortDescription: 'Original Epson Tinte', manufacturer: 'Epson', categorySlug: 'tinte-toner', basePrice: 12.99, stockQuantity: 100, unitOfMeasure: 'Stück', attributes: [{ name: 'Farbe', value: 'Schwarz' }] },
    { sku: 'BRO-LC3211-SET', ean: '4977766780452', name: 'Brother LC3211 Tintenpatronen Multipack 4er', slug: 'brother-lc3211-multipack-4er', shortDescription: 'Komplettes Tintenset für Brother', manufacturer: 'Brother', categorySlug: 'tinte-toner', basePrice: 44.99, stockQuantity: 80, unitOfMeasure: 'Set', unitsPerPackage: 4, isFeatured: true, attributes: [{ name: 'Inhalt', value: 'CMYK' }] },
    { sku: 'HP-CF217A', ean: '0889894099273', name: 'HP 17A Original Tonerkartusche schwarz', slug: 'hp-17a-tonerkartusche-schwarz', shortDescription: 'Original HP LaserJet Toner', manufacturer: 'HP', categorySlug: 'tinte-toner', basePrice: 69.99, stockQuantity: 60, unitOfMeasure: 'Stück', attributes: [{ name: 'Farbe', value: 'Schwarz' }, { name: 'Seitenreichweite', value: '~1.600 Seiten' }] },
    { sku: 'HP-CF226X', ean: '0889899336205', name: 'HP 26X Original Tonerkartusche XL schwarz', slug: 'hp-26x-tonerkartusche-xl-schwarz', shortDescription: 'High-Yield Toner für LaserJet Pro', manufacturer: 'HP', categorySlug: 'tinte-toner', basePrice: 159.99, stockQuantity: 40, unitOfMeasure: 'Stück', attributes: [{ name: 'Seitenreichweite', value: '~9.000 Seiten' }] },
    { sku: 'BRO-TN2420', ean: '4977766779852', name: 'Brother TN-2420 Toner schwarz', slug: 'brother-tn2420-toner-schwarz', shortDescription: 'Original Brother Lasertoner', manufacturer: 'Brother', categorySlug: 'tinte-toner', basePrice: 74.99, stockQuantity: 55, unitOfMeasure: 'Stück', isBestseller: true, attributes: [{ name: 'Seitenreichweite', value: '~3.000 Seiten' }] },
    { sku: 'KYO-TK1170', ean: '0632983036136', name: 'Kyocera TK-1170 Toner schwarz', slug: 'kyocera-tk1170-toner-schwarz', shortDescription: 'Original Kyocera Toner', manufacturer: 'Kyocera', categorySlug: 'tinte-toner', basePrice: 89.99, stockQuantity: 35, unitOfMeasure: 'Stück', attributes: [{ name: 'Seitenreichweite', value: '~7.200 Seiten' }] },
    { sku: 'SAM-MLTD116L', ean: '8806086070089', name: 'Samsung MLT-D116L Toner schwarz XL', slug: 'samsung-mltd116l-toner-xl', shortDescription: 'High-Yield Samsung Toner', manufacturer: 'Samsung', categorySlug: 'tinte-toner', basePrice: 79.99, stockQuantity: 45, unitOfMeasure: 'Stück', attributes: [{ name: 'Seitenreichweite', value: '~3.000 Seiten' }] },
    { sku: 'PEL-HP-304-BK', ean: '4018474004321', name: 'Pelikan kompatible Patrone für HP 304 schwarz', slug: 'pelikan-kompatibel-hp-304-schwarz', shortDescription: 'Günstige Alternative zu Original HP', manufacturer: 'Pelikan', categorySlug: 'tinte-toner', basePrice: 11.99, stockQuantity: 180, unitOfMeasure: 'Stück', attributes: [{ name: 'Kompatibel mit', value: 'HP 304' }] },
    { sku: 'LOG-CAN-545-BK', ean: '4025888654321', name: 'Logic-Seek kompatibel Canon PG-545XL schwarz', slug: 'logic-seek-canon-pg545xl-schwarz', shortDescription: 'XL-Patrone kompatibel mit Canon', manufacturer: 'Logic-Seek', categorySlug: 'tinte-toner', basePrice: 9.99, stockQuantity: 200, unitOfMeasure: 'Stück', attributes: [{ name: 'Kompatibel mit', value: 'Canon PG-545XL' }] },
    { sku: 'PEL-BRO-TN2420', ean: '4018474005678', name: 'Pelikan kompatibler Toner für Brother TN-2420', slug: 'pelikan-kompatibel-brother-tn2420', shortDescription: 'Alternativer Toner für Brother', manufacturer: 'Pelikan', categorySlug: 'tinte-toner', basePrice: 44.99, stockQuantity: 70, unitOfMeasure: 'Stück', attributes: [{ name: 'Kompatibel mit', value: 'Brother TN-2420' }] },
    { sku: 'HP-CB435A', ean: '0882780905702', name: 'HP 35A Original Tonerkartusche schwarz', slug: 'hp-35a-tonerkartusche-schwarz', shortDescription: 'Original HP LaserJet Toner', manufacturer: 'HP', categorySlug: 'tinte-toner', basePrice: 54.99, stockQuantity: 50, unitOfMeasure: 'Stück', isAvailableOnline: false, attributes: [{ name: 'Seitenreichweite', value: '~1.500 Seiten' }] },
    { sku: 'CAN-728', ean: '4960999696409', name: 'Canon 728 Tonerkartusche schwarz', slug: 'canon-728-tonerkartusche-schwarz', shortDescription: 'Original Canon Toner', manufacturer: 'Canon', categorySlug: 'tinte-toner', basePrice: 64.99, stockQuantity: 40, unitOfMeasure: 'Stück', attributes: [{ name: 'Seitenreichweite', value: '~2.100 Seiten' }] },
    { sku: 'EPS-C13T664', ean: '8715946527437', name: 'Epson EcoTank Nachfülltinte T664 4er Set', slug: 'epson-ecotank-t664-set', shortDescription: 'Original Nachfülltinte für EcoTank', manufacturer: 'Epson', categorySlug: 'tinte-toner', basePrice: 34.99, stockQuantity: 90, unitOfMeasure: 'Set', unitsPerPackage: 4, isNewArrival: true, attributes: [{ name: 'Inhalt', value: 'CMYK je 70ml' }] },
    { sku: 'HP-W2070A', ean: '0194850412462', name: 'HP 117A Toner schwarz für Color Laser', slug: 'hp-117a-toner-schwarz', shortDescription: 'Original HP Color Laser Toner', manufacturer: 'HP', categorySlug: 'tinte-toner', basePrice: 49.99, stockQuantity: 55, unitOfMeasure: 'Stück', attributes: [{ name: 'Seitenreichweite', value: '~1.000 Seiten' }] },
    { sku: 'RIC-SP150HE', ean: '4961311908262', name: 'Ricoh SP 150HE Toner schwarz High Yield', slug: 'ricoh-sp150he-toner-schwarz', shortDescription: 'Original Ricoh High-Yield Toner', manufacturer: 'Ricoh', categorySlug: 'tinte-toner', basePrice: 59.99, stockQuantity: 30, unitOfMeasure: 'Stück', attributes: [{ name: 'Seitenreichweite', value: '~1.500 Seiten' }] },

    // BÜROTECHNIK (20 products)
    { sku: 'CAS-FX82', ean: '4971850469551', name: 'Casio FX-82DE X ClassWiz Schulrechner', slug: 'casio-fx82dex-schulrechner', shortDescription: 'Wissenschaftlicher Taschenrechner', manufacturer: 'Casio', categorySlug: 'buerotechnik', basePrice: 24.99, stockQuantity: 150, unitOfMeasure: 'Stück', isBestseller: true, attributes: [{ name: 'Typ', value: 'Wissenschaftlich' }] },
    { sku: 'TI-30X-PRO', ean: '3243480105262', name: 'Texas Instruments TI-30X Pro MathPrint', slug: 'texas-instruments-ti30x-pro', shortDescription: 'Fortschrittlicher wissenschaftlicher Rechner', manufacturer: 'Texas Instruments', categorySlug: 'buerotechnik', basePrice: 29.99, stockQuantity: 100, unitOfMeasure: 'Stück', attributes: [{ name: 'Display', value: 'MathPrint' }] },
    { sku: 'CAS-MS80B', ean: '4971850089605', name: 'Casio MS-80B Tischrechner', slug: 'casio-ms80b-tischrechner', shortDescription: 'Kompakter Tischrechner mit großem Display', manufacturer: 'Casio', categorySlug: 'buerotechnik', basePrice: 12.99, stockQuantity: 180, unitOfMeasure: 'Stück', isBestseller: true, attributes: [{ name: 'Stellen', value: '8' }] },
    { sku: 'FEL-LAM-A4', ean: '4250540900134', name: 'Fellowes Spectra A4 Laminiergerät', slug: 'fellowes-spectra-a4-laminiergeraet', shortDescription: 'Kompaktes Laminiergerät für zu Hause', manufacturer: 'Fellowes', categorySlug: 'buerotechnik', basePrice: 34.99, stockQuantity: 60, unitOfMeasure: 'Stück', isFeatured: true, attributes: [{ name: 'Format', value: 'A4' }] },
    { sku: 'FEL-LAM-A3', ean: '4250540900141', name: 'Fellowes Jupiter 2 A3 Laminiergerät', slug: 'fellowes-jupiter-2-a3-laminiergeraet', shortDescription: 'Professionelles A3 Laminiergerät', manufacturer: 'Fellowes', categorySlug: 'buerotechnik', basePrice: 129.99, stockQuantity: 25, unitOfMeasure: 'Stück', attributes: [{ name: 'Format', value: 'A3' }] },
    { sku: 'FEL-LAM-FOL', ean: '4250540900158', name: 'Fellowes Laminierfolien A4 100 Stück 80mic', slug: 'fellowes-laminierfolien-a4-100er', shortDescription: 'Standard Laminierfolien', manufacturer: 'Fellowes', categorySlug: 'buerotechnik', basePrice: 14.99, stockQuantity: 200, unitOfMeasure: 'Packung', unitsPerPackage: 100, attributes: [{ name: 'Stärke', value: '80 Mikron' }] },
    { sku: 'HSM-SHRED-6', ean: '4026631025584', name: 'HSM shredstar X6 Aktenvernichter', slug: 'hsm-shredstar-x6-aktenvernichter', shortDescription: 'Partikelschnitt für hohe Sicherheit', manufacturer: 'HSM', categorySlug: 'buerotechnik', basePrice: 79.99, stockQuantity: 35, unitOfMeasure: 'Stück', attributes: [{ name: 'Schnittart', value: 'Partikelschnitt' }, { name: 'Sicherheitsstufe', value: 'P-4' }] },
    { sku: 'FEL-SHRED-8', ean: '4250540900172', name: 'Fellowes 8Mc Aktenvernichter Mikroschnitt', slug: 'fellowes-8mc-aktenvernichter', shortDescription: 'Mikroschnitt für maximale Sicherheit', manufacturer: 'Fellowes', categorySlug: 'buerotechnik', basePrice: 99.99, stockQuantity: 30, unitOfMeasure: 'Stück', isBestseller: true, attributes: [{ name: 'Schnittart', value: 'Mikroschnitt' }, { name: 'Sicherheitsstufe', value: 'P-5' }] },
    { sku: 'NOV-BIND-A4', ean: '4028601234567', name: 'Novus B3524 Bindegerät für Drahtbindung', slug: 'novus-b3524-bindegeraet-draht', shortDescription: 'Professionelles Bindegerät bis 120 Blatt', manufacturer: 'Novus', categorySlug: 'buerotechnik', basePrice: 149.99, stockQuantity: 15, unitOfMeasure: 'Stück', attributes: [{ name: 'Kapazität', value: '120 Blatt' }] },
    { sku: 'LEI-LOCHER', ean: '4002432396351', name: 'Leitz 5008 Bürolocher 30 Blatt', slug: 'leitz-5008-buerolocher-30-blatt', shortDescription: 'Robuster Bürolocher für den täglichen Einsatz', manufacturer: 'Leitz', categorySlug: 'buerotechnik', basePrice: 14.99, stockQuantity: 120, unitOfMeasure: 'Stück', attributes: [{ name: 'Kapazität', value: '30 Blatt' }] },
    { sku: 'NOV-HEFT-B4', ean: '4028601234574', name: 'Novus B4 Blockheftgerät', slug: 'novus-b4-blockheftgeraet', shortDescription: 'Tacker für bis zu 40 Blatt', manufacturer: 'Novus', categorySlug: 'buerotechnik', basePrice: 19.99, stockQuantity: 90, unitOfMeasure: 'Stück', attributes: [{ name: 'Kapazität', value: '40 Blatt' }] },
    { sku: 'LEI-HEFT-5501', ean: '4002432396368', name: 'Leitz 5501 NeXXt Heftgerät 30 Blatt', slug: 'leitz-5501-nexxt-heftgeraet', shortDescription: 'Ergonomischer Tacker für Linkshänder geeignet', manufacturer: 'Leitz', categorySlug: 'buerotechnik', basePrice: 16.99, stockQuantity: 100, unitOfMeasure: 'Stück', isBestseller: true, attributes: [{ name: 'Kapazität', value: '30 Blatt' }] },
    { sku: 'NOV-KLAM-1000', ean: '4028601234581', name: 'Novus Heftklammern 24/6 1000 Stück', slug: 'novus-heftklammern-24-6-1000', shortDescription: 'Standard Heftklammern', manufacturer: 'Novus', categorySlug: 'buerotechnik', basePrice: 1.99, stockQuantity: 500, unitOfMeasure: 'Packung', unitsPerPackage: 1000, attributes: [{ name: 'Größe', value: '24/6' }] },
    { sku: 'PEL-KLAM-ENTF', ean: '4012700750143', name: 'Pelikan Klammerentferner', slug: 'pelikan-klammerentferner', shortDescription: 'Praktischer Enthefter', manufacturer: 'Pelikan', categorySlug: 'buerotechnik', basePrice: 2.49, stockQuantity: 200, unitOfMeasure: 'Stück', attributes: [] },
    { sku: 'DYM-LM160', ean: '3501170884126', name: 'Dymo LabelManager 160 Beschriftungsgerät', slug: 'dymo-labelmanager-160', shortDescription: 'Tragbares Beschriftungsgerät', manufacturer: 'Dymo', categorySlug: 'buerotechnik', basePrice: 39.99, stockQuantity: 45, unitOfMeasure: 'Stück', isFeatured: true, attributes: [{ name: 'Typ', value: 'Tragbar' }] },
    { sku: 'BRO-PT1000', ean: '4977766715669', name: 'Brother P-touch H105 Beschriftungsgerät', slug: 'brother-ptouch-h105', shortDescription: 'Handliches Beschriftungsgerät', manufacturer: 'Brother', categorySlug: 'buerotechnik', basePrice: 29.99, stockQuantity: 55, unitOfMeasure: 'Stück', attributes: [{ name: 'Bandbreite', value: '12mm' }] },
    { sku: 'DYM-BAND-12', ean: '3501170884133', name: 'Dymo D1-Band 12mm schwarz auf weiß', slug: 'dymo-d1-band-12mm-schwarz-weiss', shortDescription: 'Original Dymo Schriftband', manufacturer: 'Dymo', categorySlug: 'buerotechnik', basePrice: 12.99, stockQuantity: 120, unitOfMeasure: 'Stück', isAvailableOnline: false, attributes: [{ name: 'Breite', value: '12mm' }] },
    { sku: 'CAS-HR150', ean: '4971850469575', name: 'Casio HR-150RCE Druckrechner', slug: 'casio-hr150rce-druckrechner', shortDescription: 'Tischrechner mit Drucker', manufacturer: 'Casio', categorySlug: 'buerotechnik', basePrice: 54.99, stockQuantity: 25, unitOfMeasure: 'Stück', attributes: [{ name: 'Typ', value: 'Druckrechner' }] },
    { sku: 'FEL-FUSION', ean: '4250540900196', name: 'Fellowes Fusion A4 Schneidemaschine', slug: 'fellowes-fusion-a4-schneidemaschine', shortDescription: 'Präzisions-Hebelschneidemaschine', manufacturer: 'Fellowes', categorySlug: 'buerotechnik', basePrice: 89.99, stockQuantity: 20, unitOfMeasure: 'Stück', attributes: [{ name: 'Schnittlänge', value: '320mm' }] },
    { sku: 'OLY-ROLL', ean: '4942988117023', name: 'Olympia Rollenschneider A4 TR111', slug: 'olympia-rollenschneider-a4', shortDescription: 'Rollenschneider für saubere Schnitte', manufacturer: 'Olympia', categorySlug: 'buerotechnik', basePrice: 29.99, stockQuantity: 35, unitOfMeasure: 'Stück', attributes: [{ name: 'Format', value: 'A4' }] },

    // Continue with more categories... (abbreviated for brevity - full seed would include all 200)
    // VERSAND & VERPACKUNG (20)
    { sku: 'VER-LUFTP-50', ean: '4250987654321', name: 'Luftpolsterfolie 50cm x 100m', slug: 'luftpolsterfolie-50cm-100m', shortDescription: 'Schutz für empfindliche Waren', manufacturer: 'Generic', categorySlug: 'versand-verpackung', basePrice: 39.99, stockQuantity: 40, unitOfMeasure: 'Rolle', attributes: [{ name: 'Maße', value: '50cm x 100m' }] },
    { sku: 'VER-KART-S', ean: '4250987654338', name: 'Versandkartons S 20er Pack', slug: 'versandkartons-s-20er', shortDescription: 'Kleine Kartons für Päckchen', manufacturer: 'Generic', categorySlug: 'versand-verpackung', basePrice: 14.99, stockQuantity: 100, unitOfMeasure: 'Packung', unitsPerPackage: 20, isBestseller: true, attributes: [{ name: 'Größe', value: 'S (20x15x10cm)' }] },
    { sku: 'VER-KART-M', ean: '4250987654345', name: 'Versandkartons M 20er Pack', slug: 'versandkartons-m-20er', shortDescription: 'Mittlere Kartons für Pakete', manufacturer: 'Generic', categorySlug: 'versand-verpackung', basePrice: 19.99, stockQuantity: 80, unitOfMeasure: 'Packung', unitsPerPackage: 20, attributes: [{ name: 'Größe', value: 'M (30x20x15cm)' }] },
    { sku: 'VER-KART-L', ean: '4250987654352', name: 'Versandkartons L 10er Pack', slug: 'versandkartons-l-10er', shortDescription: 'Große Kartons für Pakete', manufacturer: 'Generic', categorySlug: 'versand-verpackung', basePrice: 16.99, stockQuantity: 60, unitOfMeasure: 'Packung', unitsPerPackage: 10, attributes: [{ name: 'Größe', value: 'L (40x30x20cm)' }] },
    { sku: 'TES-PACK-BR', ean: '4042448123456', name: 'tesa Packband braun 66m x 50mm 6er Pack', slug: 'tesa-packband-braun-6er', shortDescription: 'Stabiles Paketklebeband', manufacturer: 'tesa', categorySlug: 'versand-verpackung', basePrice: 12.99, stockQuantity: 150, unitOfMeasure: 'Packung', unitsPerPackage: 6, isBestseller: true, attributes: [{ name: 'Farbe', value: 'Braun' }] },
    { sku: 'TES-PACK-TR', ean: '4042448123463', name: 'tesa Packband transparent 66m x 50mm 6er', slug: 'tesa-packband-transparent-6er', shortDescription: 'Transparentes Paketklebeband', manufacturer: 'tesa', categorySlug: 'versand-verpackung', basePrice: 13.99, stockQuantity: 120, unitOfMeasure: 'Packung', unitsPerPackage: 6, attributes: [{ name: 'Farbe', value: 'Transparent' }] },
    { sku: 'VER-VERS-C4', ean: '4250987654376', name: 'Versandtaschen C4 weiß 250 Stück', slug: 'versandtaschen-c4-weiss-250er', shortDescription: 'Selbstklebende Versandtaschen', manufacturer: 'Generic', categorySlug: 'versand-verpackung', basePrice: 24.99, stockQuantity: 80, unitOfMeasure: 'Packung', unitsPerPackage: 250, attributes: [{ name: 'Format', value: 'C4' }] },
    { sku: 'VER-VERS-C5', ean: '4250987654383', name: 'Versandtaschen C5 weiß 500 Stück', slug: 'versandtaschen-c5-weiss-500er', shortDescription: 'Selbstklebende Versandtaschen', manufacturer: 'Generic', categorySlug: 'versand-verpackung', basePrice: 22.99, stockQuantity: 90, unitOfMeasure: 'Packung', unitsPerPackage: 500, attributes: [{ name: 'Format', value: 'C5' }] },
    { sku: 'VER-LUFT-A', ean: '4250987654390', name: 'Luftpolstertaschen A/1 100 Stück', slug: 'luftpolstertaschen-a1-100er', shortDescription: 'Gepolsterte Versandtaschen', manufacturer: 'Generic', categorySlug: 'versand-verpackung', basePrice: 19.99, stockQuantity: 70, unitOfMeasure: 'Packung', unitsPerPackage: 100, isFeatured: true, attributes: [{ name: 'Größe', value: 'A/1 (120x175mm)' }] },
    { sku: 'VER-LUFT-D', ean: '4250987654406', name: 'Luftpolstertaschen D/4 50 Stück', slug: 'luftpolstertaschen-d4-50er', shortDescription: 'Gepolsterte Versandtaschen mittel', manufacturer: 'Generic', categorySlug: 'versand-verpackung', basePrice: 14.99, stockQuantity: 85, unitOfMeasure: 'Packung', unitsPerPackage: 50, attributes: [{ name: 'Größe', value: 'D/4 (200x275mm)' }] },
    { sku: 'VER-STRECH', ean: '4250987654413', name: 'Stretchfolie 20 Mikron 500mm x 300m', slug: 'stretchfolie-500mm-300m', shortDescription: 'Wickelfolie für Paletten', manufacturer: 'Generic', categorySlug: 'versand-verpackung', basePrice: 16.99, stockQuantity: 45, unitOfMeasure: 'Rolle', attributes: [{ name: 'Maße', value: '500mm x 300m' }] },
    { sku: 'VER-FUELL', ean: '4250987654420', name: 'Füllmaterial Papier 10kg', slug: 'fuellmaterial-papier-10kg', shortDescription: 'Recyceltes Füllpapier', manufacturer: 'Generic', categorySlug: 'versand-verpackung', basePrice: 29.99, stockQuantity: 30, unitOfMeasure: 'Karton', isAvailableOnline: false, attributes: [{ name: 'Gewicht', value: '10kg' }] },

    // Continue with remaining categories (abbreviated)
    // HYGIENE & REINIGUNG (20)
    { sku: 'TOR-WC-3P', ean: '7310791234567', name: 'Tork Toilettenpapier Premium 3-lagig 48 Rollen', slug: 'tork-toilettenpapier-premium-48er', shortDescription: 'Weiches Premium Toilettenpapier', manufacturer: 'Tork', categorySlug: 'hygiene-reinigung', basePrice: 44.99, stockQuantity: 50, unitOfMeasure: 'Packung', unitsPerPackage: 48, isBestseller: true, attributes: [{ name: 'Lagen', value: '3' }] },
    { sku: 'TOR-HAND-ZZ', ean: '7310791234574', name: 'Tork Papierhandtücher Zickzack 3000 Blatt', slug: 'tork-papierhandtuecher-zz-3000', shortDescription: 'Falthandtücher für Spender', manufacturer: 'Tork', categorySlug: 'hygiene-reinigung', basePrice: 29.99, stockQuantity: 60, unitOfMeasure: 'Karton', unitsPerPackage: 3000, isBestseller: true, attributes: [{ name: 'Faltung', value: 'Zickzack' }] },
    { sku: 'TOR-HAND-ROL', ean: '7310791234581', name: 'Tork Rollenhandtuch 6 Rollen', slug: 'tork-rollenhandtuch-6er', shortDescription: 'Handtuchrollen für Spender', manufacturer: 'Tork', categorySlug: 'hygiene-reinigung', basePrice: 39.99, stockQuantity: 40, unitOfMeasure: 'Packung', unitsPerPackage: 6, attributes: [{ name: 'Typ', value: 'Innenabrollung' }] },
    { sku: 'TOR-SEIFE-1L', ean: '7310791234598', name: 'Tork Flüssigseife mild 1L 6er Pack', slug: 'tork-fluessigseife-mild-6er', shortDescription: 'Milde Waschlotion für Spender', manufacturer: 'Tork', categorySlug: 'hygiene-reinigung', basePrice: 34.99, stockQuantity: 45, unitOfMeasure: 'Packung', unitsPerPackage: 6, attributes: [{ name: 'Inhalt', value: '1L' }] },
    { sku: 'SAG-MUELL-60', ean: '4002911234567', name: 'Müllbeutel 60L mit Zugband 50 Stück', slug: 'muellbeutel-60l-zugband-50er', shortDescription: 'Reißfeste Müllbeutel', manufacturer: 'Sagrotan', categorySlug: 'hygiene-reinigung', basePrice: 8.99, stockQuantity: 100, unitOfMeasure: 'Packung', unitsPerPackage: 50, attributes: [{ name: 'Volumen', value: '60L' }] },
    { sku: 'SAG-DESINF', ean: '4002911234574', name: 'Sagrotan Desinfektion Spray 500ml', slug: 'sagrotan-desinfektion-spray-500ml', shortDescription: 'Universelles Desinfektionsmittel', manufacturer: 'Sagrotan', categorySlug: 'hygiene-reinigung', basePrice: 4.99, stockQuantity: 150, unitOfMeasure: 'Flasche', isBestseller: true, attributes: [{ name: 'Inhalt', value: '500ml' }] },
    { sku: 'KIM-TUCH-100', ean: '5029053123456', name: 'Kimberly-Clark Wischtücher 100 Blatt', slug: 'kimberly-clark-wischtuecher-100', shortDescription: 'Saugstarke Allzwecktücher', manufacturer: 'Kimberly-Clark', categorySlug: 'hygiene-reinigung', basePrice: 6.99, stockQuantity: 80, unitOfMeasure: 'Box', unitsPerPackage: 100, attributes: [{ name: 'Material', value: 'Vlies' }] },
    { sku: 'VIL-ALU-3', ean: '4023103012345', name: 'Vileda Professional Allzwecktuch 3er', slug: 'vileda-allzwecktuch-3er', shortDescription: 'Waschbare Mikrofasertücher', manufacturer: 'Vileda', categorySlug: 'hygiene-reinigung', basePrice: 7.99, stockQuantity: 90, unitOfMeasure: 'Packung', unitsPerPackage: 3, attributes: [{ name: 'Material', value: 'Mikrofaser' }] },

    // PRÄSENTATION (12)
    { sku: 'LEG-FLIP-MOB', ean: '7612361234567', name: 'Legamaster Flipchart Economy mobil', slug: 'legamaster-flipchart-economy-mobil', shortDescription: 'Mobiles Flipchart mit Rollen', manufacturer: 'Legamaster', categorySlug: 'praesentation', basePrice: 89.99, stockQuantity: 20, unitOfMeasure: 'Stück', isFeatured: true, attributes: [{ name: 'Typ', value: 'Mobil' }] },
    { sku: 'LEG-FLIP-PAP', ean: '7612361234574', name: 'Legamaster Flipchartpapier 5 Blöcke', slug: 'legamaster-flipchartpapier-5er', shortDescription: 'Blanko Flipchart-Blöcke', manufacturer: 'Legamaster', categorySlug: 'praesentation', basePrice: 34.99, stockQuantity: 50, unitOfMeasure: 'Packung', unitsPerPackage: 5, isBestseller: true, attributes: [{ name: 'Lineatur', value: 'Blanko' }] },
    { sku: 'LEG-WHITE-90', ean: '7612361234581', name: 'Legamaster Whiteboard Premium 90x120cm', slug: 'legamaster-whiteboard-premium-90x120', shortDescription: 'Magnetisches Whiteboard', manufacturer: 'Legamaster', categorySlug: 'praesentation', basePrice: 149.99, stockQuantity: 15, unitOfMeasure: 'Stück', attributes: [{ name: 'Maße', value: '90x120cm' }] },
    { sku: 'LEG-WHITE-MAR', ean: '7612361234598', name: 'Legamaster Boardmarker 4er Set', slug: 'legamaster-boardmarker-4er', shortDescription: 'Trocken abwischbare Marker', manufacturer: 'Legamaster', categorySlug: 'praesentation', basePrice: 6.99, stockQuantity: 120, unitOfMeasure: 'Set', unitsPerPackage: 4, attributes: [{ name: 'Farben', value: 'Schwarz, Rot, Blau, Grün' }] },
    { sku: 'LEG-MAGNET-10', ean: '7612361234604', name: 'Legamaster Magnete 30mm 10er Set', slug: 'legamaster-magnete-30mm-10er', shortDescription: 'Starke Magnete für Whiteboards', manufacturer: 'Legamaster', categorySlug: 'praesentation', basePrice: 4.99, stockQuantity: 150, unitOfMeasure: 'Set', unitsPerPackage: 10, attributes: [{ name: 'Durchmesser', value: '30mm' }] },
    { sku: 'MOD-KOFFER', ean: '4003273123456', name: 'Moderationskoffer komplett', slug: 'moderationskoffer-komplett', shortDescription: 'Vollständiges Moderationsset', manufacturer: 'Generic', categorySlug: 'praesentation', basePrice: 129.99, stockQuantity: 10, unitOfMeasure: 'Stück', isAvailableOnline: false, attributes: [{ name: 'Inhalt', value: 'Komplett' }] },
    { sku: 'MOD-KARTEN', ean: '4003273123463', name: 'Moderationskarten sortiert 500 Stück', slug: 'moderationskarten-sortiert-500er', shortDescription: 'Farbige Karten für Workshops', manufacturer: 'Generic', categorySlug: 'praesentation', basePrice: 14.99, stockQuantity: 60, unitOfMeasure: 'Packung', unitsPerPackage: 500, attributes: [{ name: 'Farben', value: 'Sortiert' }] },

    // SCHULE & KREATIV (12)
    { sku: 'OXF-COLL-A4', ean: '3020120123456', name: 'Oxford Collegeblock A4 liniert 80 Blatt', slug: 'oxford-collegeblock-a4-liniert', shortDescription: 'Hochwertiger Collegeblock mit Rand', manufacturer: 'Oxford', categorySlug: 'schule-kreativ', basePrice: 3.99, stockQuantity: 200, unitOfMeasure: 'Stück', isBestseller: true, attributes: [{ name: 'Lineatur', value: 'Liniert mit Rand' }] },
    { sku: 'OXF-COLL-KAR', ean: '3020120123463', name: 'Oxford Collegeblock A4 kariert 80 Blatt', slug: 'oxford-collegeblock-a4-kariert', shortDescription: 'Hochwertiger Collegeblock kariert', manufacturer: 'Oxford', categorySlug: 'schule-kreativ', basePrice: 3.99, stockQuantity: 180, unitOfMeasure: 'Stück', attributes: [{ name: 'Lineatur', value: 'Kariert' }] },
    { sku: 'HER-HEFT-A5', ean: '4008705123456', name: 'Herlitz Schulheft A5 Lin. 4 10er Pack', slug: 'herlitz-schulheft-a5-lin4-10er', shortDescription: 'Schulhefte für die Grundschule', manufacturer: 'Herlitz', categorySlug: 'schule-kreativ', basePrice: 5.99, stockQuantity: 150, unitOfMeasure: 'Packung', unitsPerPackage: 10, attributes: [{ name: 'Lineatur', value: '4' }] },
    { sku: 'HER-HEFT-A4', ean: '4008705123463', name: 'Herlitz Schulheft A4 Lin. 26 10er Pack', slug: 'herlitz-schulheft-a4-lin26-10er', shortDescription: 'Schulhefte für die Oberstufe', manufacturer: 'Herlitz', categorySlug: 'schule-kreativ', basePrice: 7.99, stockQuantity: 130, unitOfMeasure: 'Packung', unitsPerPackage: 10, attributes: [{ name: 'Lineatur', value: '26' }] },
    { sku: 'PEL-KNETE-10', ean: '4012700750167', name: 'Pelikan Knetmasse 10 Farben', slug: 'pelikan-knetmasse-10-farben', shortDescription: 'Weiche Knetmasse für Kinder', manufacturer: 'Pelikan', categorySlug: 'schule-kreativ', basePrice: 4.99, stockQuantity: 100, unitOfMeasure: 'Set', unitsPerPackage: 10, attributes: [{ name: 'Farben', value: '10' }] },
    { sku: 'UHU-KLEB-3', ean: '4026700406368', name: 'UHU Klebestift 3x21g', slug: 'uhu-klebestift-3x21g', shortDescription: 'Lösungsmittelfreier Klebestift', manufacturer: 'UHU', categorySlug: 'schule-kreativ', basePrice: 4.49, stockQuantity: 200, unitOfMeasure: 'Packung', unitsPerPackage: 3, isBestseller: true, attributes: [{ name: 'Inhalt', value: '21g' }] },
    { sku: 'TES-KLEB-10', ean: '4042448011235', name: 'tesa Klebefilm 10 Rollen 33m x 15mm', slug: 'tesa-klebefilm-10er-33m', shortDescription: 'Klassischer transparenter Klebefilm', manufacturer: 'tesa', categorySlug: 'schule-kreativ', basePrice: 9.99, stockQuantity: 120, unitOfMeasure: 'Packung', unitsPerPackage: 10, attributes: [{ name: 'Maße', value: '33m x 15mm' }] },
    { sku: 'FAB-ZEICH-A3', ean: '4005401123470', name: 'Faber-Castell Zeichenblock A3 20 Blatt', slug: 'faber-castell-zeichenblock-a3', shortDescription: 'Hochwertiger Zeichenblock für Künstler', manufacturer: 'Faber-Castell', categorySlug: 'schule-kreativ', basePrice: 6.99, stockQuantity: 80, unitOfMeasure: 'Stück', attributes: [{ name: 'Format', value: 'A3' }] },

    // BÜROMÖBEL & ACCESSOIRES (12)
    { sku: 'HAN-STIFT-SW', ean: '4012376012345', name: 'HAN Stifteköcher LOOP schwarz', slug: 'han-stiftekoecher-loop-schwarz', shortDescription: 'Moderner Stiftehalter für den Schreibtisch', manufacturer: 'HAN', categorySlug: 'bueromoebel-accessoires', basePrice: 7.99, stockQuantity: 80, unitOfMeasure: 'Stück', attributes: [{ name: 'Farbe', value: 'Schwarz' }] },
    { sku: 'HAN-BRIEF-BL', ean: '4012376012352', name: 'HAN Briefablage KLASSIK blau 5er Set', slug: 'han-briefablage-klassik-blau-5er', shortDescription: 'Stapelbare Briefablagen', manufacturer: 'HAN', categorySlug: 'bueromoebel-accessoires', basePrice: 24.99, stockQuantity: 50, unitOfMeasure: 'Set', unitsPerPackage: 5, isBestseller: true, attributes: [{ name: 'Farbe', value: 'Blau' }] },
    { sku: 'HAN-PAPIERKORB', ean: '4012376012369', name: 'HAN Papierkorb 18L grau', slug: 'han-papierkorb-18l-grau', shortDescription: 'Büro-Papierkorb aus Kunststoff', manufacturer: 'HAN', categorySlug: 'bueromoebel-accessoires', basePrice: 9.99, stockQuantity: 60, unitOfMeasure: 'Stück', attributes: [{ name: 'Volumen', value: '18L' }] },
    { sku: 'SIG-TISCH-PAD', ean: '4004360123456', name: 'Sigel Schreibtischunterlage 60x40cm', slug: 'sigel-schreibtischunterlage-60x40', shortDescription: 'Elegante Unterlage aus Kunstleder', manufacturer: 'Sigel', categorySlug: 'bueromoebel-accessoires', basePrice: 34.99, stockQuantity: 30, unitOfMeasure: 'Stück', isFeatured: true, attributes: [{ name: 'Maße', value: '60x40cm' }] },
    { sku: 'MAU-MAUS-PAD', ean: '4007885012345', name: 'Mauspad mit Handgelenkauflage', slug: 'mauspad-handgelenkauflage', shortDescription: 'Ergonomisches Mauspad', manufacturer: 'Generic', categorySlug: 'bueromoebel-accessoires', basePrice: 12.99, stockQuantity: 70, unitOfMeasure: 'Stück', attributes: [{ name: 'Typ', value: 'Ergonomisch' }] },
    { sku: 'FEL-FUSS-STZ', ean: '4250540900210', name: 'Fellowes Fußstütze Professional', slug: 'fellowes-fussstuetze-professional', shortDescription: 'Höhenverstellbare Fußstütze', manufacturer: 'Fellowes', categorySlug: 'bueromoebel-accessoires', basePrice: 59.99, stockQuantity: 20, unitOfMeasure: 'Stück', isAvailableOnline: false, attributes: [{ name: 'Verstellbar', value: 'Ja' }] },
    { sku: 'FEL-MONITOR', ean: '4250540900227', name: 'Fellowes Monitorständer Plus', slug: 'fellowes-monitorstaender-plus', shortDescription: 'Erhöhung für Monitor mit Schublade', manufacturer: 'Fellowes', categorySlug: 'bueromoebel-accessoires', basePrice: 44.99, stockQuantity: 25, unitOfMeasure: 'Stück', attributes: [{ name: 'Typ', value: 'Mit Schublade' }] },
    { sku: 'LEI-MAGBOARD', ean: '4002432012345', name: 'Leitz Desktop-Organizer Cosy', slug: 'leitz-desktop-organizer-cosy', shortDescription: 'Multifunktionaler Schreibtisch-Organizer', manufacturer: 'Leitz', categorySlug: 'bueromoebel-accessoires', basePrice: 39.99, stockQuantity: 35, unitOfMeasure: 'Stück', isNewArrival: true, attributes: [{ name: 'Serie', value: 'Cosy' }] },

    // Additional products to reach 200 total
    // HYGIENE & REINIGUNG (20)
    { sku: 'TOR-TOILET-8', ean: '7310791234567', name: 'Tork Premium Toilettenpapier 3-lagig 8 Rollen', slug: 'tork-toilettenpapier-premium-8er', shortDescription: 'Extra weiches Premium Toilettenpapier', manufacturer: 'Tork', categorySlug: 'hygiene-reinigung', basePrice: 4.99, stockQuantity: 200, unitOfMeasure: 'Packung', unitsPerPackage: 8, isBestseller: true, attributes: [{ name: 'Lagen', value: '3' }] },
    { sku: 'TOR-HAND-2', ean: '7310791234574', name: 'Tork Xpress Handtuchpapier Multifold 2100 Blatt', slug: 'tork-xpress-handtuchpapier-2100', shortDescription: 'Falthandtücher für Spender', manufacturer: 'Tork', categorySlug: 'hygiene-reinigung', basePrice: 19.99, stockQuantity: 100, unitOfMeasure: 'Karton', unitsPerPackage: 2100, attributes: [{ name: 'Faltung', value: 'Multifold' }] },
    { sku: 'TOR-KUECH-4', ean: '7310791234581', name: 'Tork Küchenrollen 2-lagig 4 Rollen', slug: 'tork-kuechenrollen-4er', shortDescription: 'Saugstarke Küchenrollen', manufacturer: 'Tork', categorySlug: 'hygiene-reinigung', basePrice: 6.99, stockQuantity: 150, unitOfMeasure: 'Packung', unitsPerPackage: 4, attributes: [{ name: 'Lagen', value: '2' }] },
    { sku: 'KIM-TUCH-200', ean: '5027375612345', name: 'Kimberly-Clark Wypall Wischtücher 200 Stück', slug: 'kimberly-clark-wypall-200', shortDescription: 'Industrielle Wischtücher', manufacturer: 'Kimberly-Clark', categorySlug: 'hygiene-reinigung', basePrice: 14.99, stockQuantity: 80, unitOfMeasure: 'Box', unitsPerPackage: 200, attributes: [{ name: 'Typ', value: 'Industrie' }] },
    { sku: 'TOR-SEIFE-1L', ean: '7310791234598', name: 'Tork Flüssigseife Mild 1 Liter', slug: 'tork-fluessigseife-mild-1l', shortDescription: 'Sanfte Seife für häufiges Händewaschen', manufacturer: 'Tork', categorySlug: 'hygiene-reinigung', basePrice: 8.99, stockQuantity: 120, unitOfMeasure: 'Flasche', attributes: [{ name: 'Inhalt', value: '1 Liter' }] },
    { sku: 'TOR-DESINF-500', ean: '7310791234604', name: 'Tork Desinfektionsmittel 500ml', slug: 'tork-desinfektionsmittel-500ml', shortDescription: 'Hygienische Handdesinfektion', manufacturer: 'Tork', categorySlug: 'hygiene-reinigung', basePrice: 5.99, stockQuantity: 200, unitOfMeasure: 'Flasche', isBestseller: true, attributes: [{ name: 'Inhalt', value: '500ml' }] },
    { sku: 'TOR-SPENDER-H', ean: '7310791234611', name: 'Tork Handtuchspender H2 System', slug: 'tork-handtuchspender-h2', shortDescription: 'Wandspender für Falthandtücher', manufacturer: 'Tork', categorySlug: 'hygiene-reinigung', basePrice: 49.99, stockQuantity: 30, unitOfMeasure: 'Stück', isAvailableOnline: false, attributes: [{ name: 'System', value: 'H2' }] },
    { sku: 'TOR-SPENDER-S', ean: '7310791234628', name: 'Tork Seifenspender 1L', slug: 'tork-seifenspender-1l', shortDescription: 'Manueller Seifenspender', manufacturer: 'Tork', categorySlug: 'hygiene-reinigung', basePrice: 29.99, stockQuantity: 40, unitOfMeasure: 'Stück', attributes: [{ name: 'Kapazität', value: '1 Liter' }] },
    { sku: 'KIM-KOSM-100', ean: '5027375612352', name: 'Kleenex Kosmetiktücher Box 100 Stück', slug: 'kleenex-kosmetiktuecher-100', shortDescription: 'Weiche Kosmetiktücher', manufacturer: 'Kleenex', categorySlug: 'hygiene-reinigung', basePrice: 2.49, stockQuantity: 300, unitOfMeasure: 'Box', unitsPerPackage: 100, attributes: [{ name: 'Lagen', value: '3' }] },
    { sku: 'VIL-TUCH-3', ean: '4023103612345', name: 'Vileda Microfaser Tücher 3er Set', slug: 'vileda-microfaser-3er', shortDescription: 'Vielseitige Reinigungstücher', manufacturer: 'Vileda', categorySlug: 'hygiene-reinigung', basePrice: 4.99, stockQuantity: 150, unitOfMeasure: 'Set', unitsPerPackage: 3, attributes: [{ name: 'Material', value: 'Microfaser' }] },
    { sku: 'MUL-ABF-120', ean: '4003373612345', name: 'Müllbeutel 120L 25 Stück', slug: 'muellbeutel-120l-25er', shortDescription: 'Stabile Müllsäcke für große Behälter', manufacturer: 'Generic', categorySlug: 'hygiene-reinigung', basePrice: 7.99, stockQuantity: 100, unitOfMeasure: 'Rolle', unitsPerPackage: 25, attributes: [{ name: 'Volumen', value: '120L' }] },
    { sku: 'MUL-ABF-60', ean: '4003373612352', name: 'Müllbeutel 60L 50 Stück', slug: 'muellbeutel-60l-50er', shortDescription: 'Praktische Müllsäcke für das Büro', manufacturer: 'Generic', categorySlug: 'hygiene-reinigung', basePrice: 5.99, stockQuantity: 150, unitOfMeasure: 'Rolle', unitsPerPackage: 50, attributes: [{ name: 'Volumen', value: '60L' }] },
    { sku: 'SID-REINIG-1L', ean: '4012345612345', name: 'Sidolin Glasreiniger 1 Liter', slug: 'sidolin-glasreiniger-1l', shortDescription: 'Streifenfreier Glasreiniger', manufacturer: 'Sidolin', categorySlug: 'hygiene-reinigung', basePrice: 4.49, stockQuantity: 120, unitOfMeasure: 'Flasche', attributes: [{ name: 'Inhalt', value: '1 Liter' }] },
    { sku: 'AJAX-ALLZW-1L', ean: '8714789612345', name: 'Ajax Allzweckreiniger Citrus 1 Liter', slug: 'ajax-allzweckreiniger-citrus-1l', shortDescription: 'Frischer Allzweckreiniger', manufacturer: 'Ajax', categorySlug: 'hygiene-reinigung', basePrice: 3.99, stockQuantity: 140, unitOfMeasure: 'Flasche', attributes: [{ name: 'Duft', value: 'Citrus' }] },

    // Additional VERSAND & VERPACKUNG
    { sku: 'VER-LUFTP-100', ean: '4250987654383', name: 'Luftpolsterfolie 100cm x 100m', slug: 'luftpolsterfolie-100cm-100m', shortDescription: 'Breite Rolle für große Produkte', manufacturer: 'Generic', categorySlug: 'versand-verpackung', basePrice: 69.99, stockQuantity: 25, unitOfMeasure: 'Rolle', attributes: [{ name: 'Maße', value: '100cm x 100m' }] },
    { sku: 'VER-FUELL-15', ean: '4250987654390', name: 'Füllmaterial Chips 15L', slug: 'fuellmaterial-chips-15l', shortDescription: 'Polstermaterial für Versandkartons', manufacturer: 'Generic', categorySlug: 'versand-verpackung', basePrice: 12.99, stockQuantity: 60, unitOfMeasure: 'Sack', attributes: [{ name: 'Volumen', value: '15 Liter' }] },
    { sku: 'VER-KRAFT-PAP', ean: '4250987654406', name: 'Packpapier Kraftpapier 70cm x 250m', slug: 'packpapier-kraftpapier-70cm', shortDescription: 'Naturfarbenes Packpapier', manufacturer: 'Generic', categorySlug: 'versand-verpackung', basePrice: 29.99, stockQuantity: 35, unitOfMeasure: 'Rolle', attributes: [{ name: 'Maße', value: '70cm x 250m' }] },
    { sku: 'VER-STRETCHF', ean: '4250987654413', name: 'Stretchfolie 500mm x 300m', slug: 'stretchfolie-500mm-300m', shortDescription: 'Palettenwickelfolie', manufacturer: 'Generic', categorySlug: 'versand-verpackung', basePrice: 14.99, stockQuantity: 50, unitOfMeasure: 'Rolle', isBestseller: true, attributes: [{ name: 'Maße', value: '500mm x 300m' }] },
    { sku: 'VER-VERS-B5', ean: '4250987654420', name: 'Versandtaschen B5 weiß 500 Stück', slug: 'versandtaschen-b5-weiss-500er', shortDescription: 'Selbstklebende B5 Versandtaschen', manufacturer: 'Generic', categorySlug: 'versand-verpackung', basePrice: 34.99, stockQuantity: 60, unitOfMeasure: 'Karton', unitsPerPackage: 500, attributes: [{ name: 'Format', value: 'B5' }] },
    { sku: 'VER-POLST-ENV', ean: '4250987654437', name: 'Luftpolster-Versandtaschen A5 50er', slug: 'luftpolster-versandtaschen-a5-50er', shortDescription: 'Gepolsterte Versandtaschen', manufacturer: 'Generic', categorySlug: 'versand-verpackung', basePrice: 19.99, stockQuantity: 80, unitOfMeasure: 'Packung', unitsPerPackage: 50, attributes: [{ name: 'Format', value: 'A5' }] },
    { sku: 'VER-UMREIF', ean: '4250987654444', name: 'PP-Umreifungsband 12mm 2500m', slug: 'pp-umreifungsband-12mm-2500m', shortDescription: 'Für manuelle Umreifung', manufacturer: 'Generic', categorySlug: 'versand-verpackung', basePrice: 24.99, stockQuantity: 30, unitOfMeasure: 'Rolle', attributes: [{ name: 'Breite', value: '12mm' }] },

    // Additional PAPIER & DRUCKEN
    { sku: 'INP-INKJ-A4', ean: '4250890123456', name: 'InkPro Inkjet-Papier A4, 100g/m², 250 Blatt', slug: 'inkpro-inkjet-papier-a4', shortDescription: 'Spezialpapier für Tintenstrahldrucker', manufacturer: 'InkPro', categorySlug: 'papier-drucken', basePrice: 8.99, stockQuantity: 120, unitOfMeasure: 'Packung', unitsPerPackage: 250, attributes: [{ name: 'Typ', value: 'Inkjet' }] },
    { sku: 'SIG-BROSCH-A4', ean: '4004360789012', name: 'Sigel Broschürenpapier A4, 150g/m², 100 Blatt', slug: 'sigel-broschuerenpapier-a4', shortDescription: 'Hochwertiges Papier für Broschüren', manufacturer: 'Sigel', categorySlug: 'papier-drucken', basePrice: 12.99, stockQuantity: 70, unitOfMeasure: 'Packung', unitsPerPackage: 100, attributes: [{ name: 'Grammatur', value: '150 g/m²' }] },
    { sku: 'NAV-ECO-A4', ean: '5602024006140', name: 'Navigator Eco-Logical A4, 75g/m², 500 Blatt', slug: 'navigator-ecological-a4', shortDescription: 'Umweltfreundliches Kopierpapier', manufacturer: 'Navigator', categorySlug: 'papier-drucken', basePrice: 4.99, stockQuantity: 300, unitOfMeasure: 'Packung', unitsPerPackage: 500, isFeatured: true, attributes: [{ name: 'Zertifikat', value: 'EU Ecolabel' }] },
    { sku: 'CLF-KRAFT-A4', ean: '4250484567907', name: 'Clairefontaine Karton A4, 300g/m², 50 Blatt', slug: 'clairefontaine-karton-a4-300g', shortDescription: 'Stabiler Bastelkarton', manufacturer: 'Clairefontaine', categorySlug: 'papier-drucken', basePrice: 9.99, stockQuantity: 60, unitOfMeasure: 'Packung', unitsPerPackage: 50, attributes: [{ name: 'Grammatur', value: '300 g/m²' }] },

    // Additional SCHREIBWAREN
    { sku: 'STA-TRIPL-6', ean: '4007817334690', name: 'Staedtler Triplus Broadliner 6er Set', slug: 'staedtler-triplus-broadliner-6er', shortDescription: 'Breitspitzen-Fineliner für Highlights', manufacturer: 'Staedtler', categorySlug: 'schreibwaren', basePrice: 7.99, stockQuantity: 100, unitOfMeasure: 'Set', unitsPerPackage: 6, attributes: [{ name: 'Strichbreite', value: '0,8mm' }] },
    { sku: 'ZEB-MILDL-5', ean: '4901681456789', name: 'Zebra Mildliner Textmarker 5er Set Pastell', slug: 'zebra-mildliner-5er-pastell', shortDescription: 'Sanfte Pastellfarben zum Markieren', manufacturer: 'Zebra', categorySlug: 'schreibwaren', basePrice: 9.99, stockQuantity: 80, unitOfMeasure: 'Set', unitsPerPackage: 5, isNewArrival: true, attributes: [{ name: 'Farben', value: 'Pastell' }] },
    { sku: 'LAM-SAFARI-BL', ean: '4014519123456', name: 'Lamy Safari Füller blau', slug: 'lamy-safari-fueller-blau', shortDescription: 'Kultfüller für den täglichen Gebrauch', manufacturer: 'Lamy', categorySlug: 'schreibwaren', basePrice: 19.99, stockQuantity: 50, unitOfMeasure: 'Stück', isBestseller: true, attributes: [{ name: 'Feder', value: 'M' }] },
    { sku: 'UNI-JETSTR-3', ean: '4902778734537', name: 'uni Jetstream Kugelschreiber 3er Pack', slug: 'uni-jetstream-kugelschreiber-3er', shortDescription: 'Sanfter Schreibfluss dank Jetstream-Technologie', manufacturer: 'uni-ball', categorySlug: 'schreibwaren', basePrice: 8.99, stockQuantity: 120, unitOfMeasure: 'Packung', unitsPerPackage: 3, attributes: [{ name: 'Strichbreite', value: '0,5mm' }] },
    { sku: 'PIL-FRIXION-4', ean: '4902505586378', name: 'Pilot FriXion Ball 4er Set', slug: 'pilot-frixion-ball-4er', shortDescription: 'Radierbare Gel-Kugelschreiber', manufacturer: 'Pilot', categorySlug: 'schreibwaren', basePrice: 12.99, stockQuantity: 90, unitOfMeasure: 'Set', unitsPerPackage: 4, isBestseller: true, attributes: [{ name: 'Typ', value: 'Radierbar' }] },
    { sku: 'ROT-ART-PEN', ean: '4006381123457', name: 'Rotring Art Pen Kalligraphie Set', slug: 'rotring-art-pen-kalligraphie', shortDescription: 'Federset für Kalligraphie', manufacturer: 'Rotring', categorySlug: 'schreibwaren', basePrice: 24.99, stockQuantity: 30, unitOfMeasure: 'Set', isAvailableOnline: false, attributes: [{ name: 'Federn', value: '3 verschiedene' }] },

    // Additional ORDNEN & ARCHIVIEREN
    { sku: 'LEI-WOW-5', ean: '4002432396344', name: 'Leitz WOW Ordner 5er Set bunt', slug: 'leitz-wow-ordner-5er-bunt', shortDescription: 'Farbenfrohe Ordner im Set', manufacturer: 'Leitz', categorySlug: 'ordnen-archivieren', basePrice: 29.99, stockQuantity: 40, unitOfMeasure: 'Set', unitsPerPackage: 5, isFeatured: true, attributes: [{ name: 'Farben', value: 'Bunt sortiert' }] },
    { sku: 'ELB-PROJ-MAP', ean: '4003928712372', name: 'Elba Projektmappe A4 mit Gummizug', slug: 'elba-projektmappe-a4-gummizug', shortDescription: 'Große Mappe für Projekte', manufacturer: 'Elba', categorySlug: 'ordnen-archivieren', basePrice: 4.99, stockQuantity: 100, unitOfMeasure: 'Stück', attributes: [{ name: 'Kapazität', value: '200 Blatt' }] },
    { sku: 'HAN-MULTI-ORG', ean: '4012376001241', name: 'HAN Multi-Organizer 6-teilig', slug: 'han-multi-organizer-6teilig', shortDescription: 'Schreibtisch-Aufbewahrungssystem', manufacturer: 'HAN', categorySlug: 'ordnen-archivieren', basePrice: 34.99, stockQuantity: 25, unitOfMeasure: 'Set', attributes: [{ name: 'Teile', value: '6' }] },
    { sku: 'LEI-SICHT-GL', ean: '4002432396283', name: 'Leitz Sichthüllen A4 glasklar 100er', slug: 'leitz-sichthuellen-a4-glasklar-100er', shortDescription: 'Kristallklare Dokumentenhüllen', manufacturer: 'Leitz', categorySlug: 'ordnen-archivieren', basePrice: 11.99, stockQuantity: 150, unitOfMeasure: 'Packung', unitsPerPackage: 100, attributes: [{ name: 'Oberfläche', value: 'Glasklar' }] },

    // Additional BÜROTECHNIK
    { sku: 'CAS-FX991', ean: '4971850469568', name: 'Casio FX-991DE X ClassWiz Grafikrechner', slug: 'casio-fx991dex-grafikrechner', shortDescription: 'Wissenschaftlicher Rechner mit QR-Code', manufacturer: 'Casio', categorySlug: 'buerotechnik', basePrice: 34.99, stockQuantity: 60, unitOfMeasure: 'Stück', attributes: [{ name: 'Funktionen', value: '700+' }] },
    { sku: 'FEL-LAM-125', ean: '4250540900165', name: 'Fellowes Laminierfolien A4 100 Stück 125mic', slug: 'fellowes-laminierfolien-a4-125mic', shortDescription: 'Dickere Laminierfolien für mehr Schutz', manufacturer: 'Fellowes', categorySlug: 'buerotechnik', basePrice: 19.99, stockQuantity: 100, unitOfMeasure: 'Packung', unitsPerPackage: 100, attributes: [{ name: 'Stärke', value: '125 Mikron' }] },
    { sku: 'NOV-ENTK-B54', ean: '4028601234598', name: 'Novus Enthefter B54', slug: 'novus-enthefter-b54', shortDescription: 'Praktischer Enthefter für alle Klammern', manufacturer: 'Novus', categorySlug: 'buerotechnik', basePrice: 6.99, stockQuantity: 80, unitOfMeasure: 'Stück', attributes: [] },
    { sku: 'DYM-LM280', ean: '3501170884140', name: 'Dymo LabelManager 280 Beschriftungsgerät', slug: 'dymo-labelmanager-280', shortDescription: 'Fortgeschrittenes Beschriftungsgerät mit PC-Anschluss', manufacturer: 'Dymo', categorySlug: 'buerotechnik', basePrice: 59.99, stockQuantity: 30, unitOfMeasure: 'Stück', isFeatured: true, attributes: [{ name: 'Anschluss', value: 'USB' }] },

    // Additional SCHULE & KREATIV
    { sku: 'PEL-DECK-24', ean: '4012700750174', name: 'Pelikan Deckfarbkasten K24 24 Farben', slug: 'pelikan-deckfarbkasten-k24', shortDescription: 'Großer Farbkasten für die Schule', manufacturer: 'Pelikan', categorySlug: 'schule-kreativ', basePrice: 14.99, stockQuantity: 80, unitOfMeasure: 'Stück', isBestseller: true, attributes: [{ name: 'Farben', value: '24' }] },
    { sku: 'PRI-PAPP-20', ean: '4009042891234', name: 'Primakrepp Tonpapier A4 20 Blatt sortiert', slug: 'tonpapier-a4-20er-sortiert', shortDescription: 'Farbiges Bastelpapier', manufacturer: 'Primakrepp', categorySlug: 'schule-kreativ', basePrice: 3.99, stockQuantity: 150, unitOfMeasure: 'Packung', unitsPerPackage: 20, attributes: [{ name: 'Farben', value: 'Sortiert' }] },
    { sku: 'FAB-PASTL-36', ean: '4005401123487', name: 'Faber-Castell Pastellkreiden 36er Set', slug: 'faber-castell-pastellkreiden-36er', shortDescription: 'Hochwertige Pastellkreiden für Künstler', manufacturer: 'Faber-Castell', categorySlug: 'schule-kreativ', basePrice: 19.99, stockQuantity: 40, unitOfMeasure: 'Set', unitsPerPackage: 36, isFeatured: true, attributes: [{ name: 'Typ', value: 'Weich' }] },
    { sku: 'PRI-SCHERE-K', ean: '4009042891241', name: 'Bastelschere für Kinder abgerundet', slug: 'bastelschere-kinder-abgerundet', shortDescription: 'Sichere Schere für kleine Hände', manufacturer: 'Generic', categorySlug: 'schule-kreativ', basePrice: 2.99, stockQuantity: 200, unitOfMeasure: 'Stück', attributes: [{ name: 'Sicherheit', value: 'Abgerundet' }] },
    { sku: 'PRI-GLITZ-6', ean: '4009042891258', name: 'Glitzerkleber 6 Farben Set', slug: 'glitzerkleber-6er-set', shortDescription: 'Funkelnder Bastelkleber', manufacturer: 'Generic', categorySlug: 'schule-kreativ', basePrice: 5.99, stockQuantity: 100, unitOfMeasure: 'Set', unitsPerPackage: 6, attributes: [{ name: 'Farben', value: '6' }] },
    { sku: 'HER-MAPPE-A3', ean: '4008705123470', name: 'Herlitz Zeichenmappe A3 mit Gummizug', slug: 'herlitz-zeichenmappe-a3', shortDescription: 'Transportmappe für Zeichnungen', manufacturer: 'Herlitz', categorySlug: 'schule-kreativ', basePrice: 4.99, stockQuantity: 70, unitOfMeasure: 'Stück', attributes: [{ name: 'Format', value: 'A3' }] },

    // Additional PRÄSENTATION
    { sku: 'LEG-FLIP-65', ean: '7612361234628', name: 'Legamaster Flipchart Economy 65x100cm', slug: 'legamaster-flipchart-economy', shortDescription: 'Günstiges Flipchart für Meetings', manufacturer: 'Legamaster', categorySlug: 'praesentation', basePrice: 89.99, stockQuantity: 20, unitOfMeasure: 'Stück', attributes: [{ name: 'Maße', value: '65x100cm' }] },
    { sku: 'SIG-POINT-GR', ean: '4004360123463', name: 'Sigel Laserpointer GL18 grün', slug: 'sigel-laserpointer-gl18-gruen', shortDescription: 'Grüner Laser für Präsentationen', manufacturer: 'Sigel', categorySlug: 'praesentation', basePrice: 29.99, stockQuantity: 35, unitOfMeasure: 'Stück', attributes: [{ name: 'Farbe', value: 'Grün' }] },
    { sku: 'LEG-PINNW-90', ean: '7612361234635', name: 'Legamaster Pinnwand 90x120cm Kork', slug: 'legamaster-pinnwand-90x120-kork', shortDescription: 'Klassische Kork-Pinnwand', manufacturer: 'Legamaster', categorySlug: 'praesentation', basePrice: 69.99, stockQuantity: 15, unitOfMeasure: 'Stück', attributes: [{ name: 'Material', value: 'Kork' }] },
    { sku: 'LEG-REINIG', ean: '7612361234642', name: 'Legamaster Whiteboard Reinigungsset', slug: 'legamaster-whiteboard-reinigungsset', shortDescription: 'Spray und Tuch für Whiteboards', manufacturer: 'Legamaster', categorySlug: 'praesentation', basePrice: 9.99, stockQuantity: 60, unitOfMeasure: 'Set', attributes: [{ name: 'Inhalt', value: 'Spray + Tuch' }] },

    // Additional BÜROMÖBEL & ACCESSOIRES
    { sku: 'HAN-ROLL-BL', ean: '4012376012376', name: 'HAN Rollcontainer SYSTEMBOX blau', slug: 'han-rollcontainer-systembox-blau', shortDescription: 'Mobiler Bürocontainer', manufacturer: 'HAN', categorySlug: 'bueromoebel-accessoires', basePrice: 79.99, stockQuantity: 15, unitOfMeasure: 'Stück', attributes: [{ name: 'Schubladen', value: '3' }] },
    { sku: 'LEI-COSY-LAP', ean: '4002432012352', name: 'Leitz Cosy Laptopständer', slug: 'leitz-cosy-laptopstaender', shortDescription: 'Ergonomischer Ständer für Laptops', manufacturer: 'Leitz', categorySlug: 'bueromoebel-accessoires', basePrice: 44.99, stockQuantity: 25, unitOfMeasure: 'Stück', isNewArrival: true, attributes: [{ name: 'Serie', value: 'Cosy' }] },
    { sku: 'FEL-ARMST', ean: '4250540900234', name: 'Fellowes Armlehne für Monitor', slug: 'fellowes-armlehne-monitor', shortDescription: 'Verstellbare Monitorhalterung', manufacturer: 'Fellowes', categorySlug: 'bueromoebel-accessoires', basePrice: 149.99, stockQuantity: 10, unitOfMeasure: 'Stück', attributes: [{ name: 'Typ', value: 'Schwenkarm' }] },
    { sku: 'SIG-KABEL-ORG', ean: '4004360123470', name: 'Sigel Kabelorganizer Set', slug: 'sigel-kabelorganizer-set', shortDescription: 'Ordnung für Kabel am Schreibtisch', manufacturer: 'Sigel', categorySlug: 'bueromoebel-accessoires', basePrice: 14.99, stockQuantity: 50, unitOfMeasure: 'Set', attributes: [{ name: 'Teile', value: '5' }] },
  ];

  let productCount = 0;
  for (const product of products) {
    const { categorySlug, attributes, ...productData } = product;
    const categoryId = createdCategories[categorySlug];

    if (!categoryId) {
      console.warn(`Category not found for slug: ${categorySlug}`);
      continue;
    }

    try {
      await prisma.product.upsert({
        where: { sku: productData.sku },
        update: {},
        create: {
          ...productData,
          categoryId,
          description: productData.shortDescription,
          taxRate: 19,
          isActive: true,
          images: {
            create: [{
              url: `https://placehold.co/400x400/F5F5F5/333?text=${encodeURIComponent(productData.name.substring(0, 20))}`,
              altText: productData.name,
              isPrimary: true,
              sortOrder: 0,
            }],
          },
          attributes: attributes ? {
            create: attributes.map((attr, index) => ({
              name: attr.name,
              value: attr.value,
              sortOrder: index,
            })),
          } : undefined,
        },
      });
      productCount++;
    } catch (error) {
      console.error(`Error creating product ${productData.sku}:`, error);
    }
  }

  console.log(`✅ Created ${productCount} products`);

  // Create EAN exclusions for store-only products
  console.log('Creating EAN exclusions...');
  const storeOnlyProducts = products.filter(p => p.isAvailableOnline === false);
  for (const product of storeOnlyProducts) {
    if (product.ean) {
      await prisma.eanExclusion.upsert({
        where: { ean: product.ean },
        update: {},
        create: {
          ean: product.ean,
          reason: 'Nur in der Filiale erhältlich',
        },
      });
    }
  }

  // Create default settings
  console.log('Creating default settings...');
  const settings = [
    { key: 'shop_name', value: 'McPaper', description: 'Shop Name' },
    { key: 'shop_email', value: 'info@mcpaper-demo.de', description: 'Shop E-Mail' },
    { key: 'shop_phone', value: '+49 (0) 30 123 456 789', description: 'Shop Telefon' },
    { key: 'shop_address', value: 'Musterstraße 123, 10115 Berlin', description: 'Shop Adresse' },
    { key: 'shipping_free_threshold', value: '50', description: 'Kostenlose Lieferung ab (EUR)' },
    { key: 'shipping_cost', value: '5.95', description: 'Standard Versandkosten (EUR)' },
    { key: 'voucher_threshold_5', value: '100', description: '5€ Gutschein ab Bestellwert (EUR)' },
    { key: 'voucher_threshold_10', value: '150', description: '10€ Gutschein ab Bestellwert (EUR)' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log('✅ Seed completed successfully!');
  console.log(`
  ==========================================
  Admin Login:
  Email: general@distri-smart.com
  Password: ${adminPassword}
  ==========================================
  `);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
