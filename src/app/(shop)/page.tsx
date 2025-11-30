import Link from 'next/link';
import { ArrowRight, Truck, CreditCard, Shield, Store } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';

const categories = [
  {
    name: 'Papier & Drucken',
    slug: 'papier-drucken',
    image: 'https://placehold.co/400x300/F5F5F5/333?text=Papier',
    description: 'Kopierpapier, Druckerpapier & mehr',
  },
  {
    name: 'Schreibwaren',
    slug: 'schreibwaren',
    image: 'https://placehold.co/400x300/F5F5F5/333?text=Schreibwaren',
    description: 'Stifte, Marker, Textmarker',
  },
  {
    name: 'Ordnen & Archivieren',
    slug: 'ordnen-archivieren',
    image: 'https://placehold.co/400x300/F5F5F5/333?text=Ordner',
    description: 'Ordner, Ringbücher, Mappen',
  },
  {
    name: 'Tinte & Toner',
    slug: 'tinte-toner',
    image: 'https://placehold.co/400x300/F5F5F5/333?text=Toner',
    description: 'Druckerpatronen & Toner',
  },
  {
    name: 'Bürotechnik',
    slug: 'buerotechnik',
    image: 'https://placehold.co/400x300/F5F5F5/333?text=Technik',
    description: 'Taschenrechner, Laminiergeräte',
  },
  {
    name: 'Hygiene & Reinigung',
    slug: 'hygiene-reinigung',
    image: 'https://placehold.co/400x300/F5F5F5/333?text=Hygiene',
    description: 'Papierhandtücher, Reinigungsmittel',
  },
];

// Placeholder products for demo
const featuredProducts = [
  {
    id: '1',
    sku: 'NAV-A4-500',
    name: 'Navigator Universal Kopierpapier A4, 80g/m², 500 Blatt',
    slug: 'navigator-universal-kopierpapier-a4',
    shortDescription: 'Premium Kopierpapier für alle Drucker',
    manufacturer: 'Navigator',
    basePrice: 5.99,
    taxRate: 19,
    isAvailableOnline: true,
    stockQuantity: 500,
    minimumOrderQuantity: 1,
    unitOfMeasure: 'Packung',
    unitsPerPackage: 500,
    isActive: true,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: '1',
        productId: '1',
        url: 'https://placehold.co/400x400/F5F5F5/333?text=Kopierpapier',
        altText: 'Navigator Kopierpapier',
        sortOrder: 0,
        isPrimary: true,
      },
    ],
  },
  {
    id: '2',
    sku: 'STA-NORIS-12',
    name: 'Staedtler Noris HB Bleistift 12er Pack',
    slug: 'staedtler-noris-hb-bleistift-12er',
    shortDescription: 'Der Klassiker für Schule und Büro',
    manufacturer: 'Staedtler',
    basePrice: 4.49,
    taxRate: 19,
    isAvailableOnline: true,
    stockQuantity: 200,
    minimumOrderQuantity: 1,
    unitOfMeasure: 'Packung',
    unitsPerPackage: 12,
    isActive: true,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: '2',
        productId: '2',
        url: 'https://placehold.co/400x400/F5F5F5/333?text=Bleistifte',
        altText: 'Staedtler Noris Bleistifte',
        sortOrder: 0,
        isPrimary: true,
      },
    ],
  },
  {
    id: '3',
    sku: 'LEI-1010-BL',
    name: 'Leitz 1010 Qualitätsordner 80mm blau',
    slug: 'leitz-1010-qualitaetsordner-80mm-blau',
    shortDescription: 'Der Büroklassiker in Premium-Qualität',
    manufacturer: 'Leitz',
    basePrice: 3.99,
    taxRate: 19,
    isAvailableOnline: true,
    stockQuantity: 150,
    minimumOrderQuantity: 1,
    unitOfMeasure: 'Stück',
    isActive: true,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: '3',
        productId: '3',
        url: 'https://placehold.co/400x400/F5F5F5/333?text=Ordner',
        altText: 'Leitz Ordner blau',
        sortOrder: 0,
        isPrimary: true,
      },
    ],
  },
  {
    id: '4',
    sku: 'EDD-3000-SET',
    name: 'edding 3000 Permanentmarker 4er Set',
    slug: 'edding-3000-permanentmarker-4er-set',
    shortDescription: 'Permanent auf fast allen Oberflächen',
    manufacturer: 'edding',
    basePrice: 8.99,
    taxRate: 19,
    isAvailableOnline: true,
    stockQuantity: 80,
    minimumOrderQuantity: 1,
    unitOfMeasure: 'Set',
    unitsPerPackage: 4,
    isActive: true,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: '4',
        productId: '4',
        url: 'https://placehold.co/400x400/F5F5F5/333?text=Marker',
        altText: 'edding Permanentmarker',
        sortOrder: 0,
        isPrimary: true,
      },
    ],
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-[#1A1A1A] to-[#333] text-white">
        <div className="container py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Ihr Partner für{' '}
              <span className="text-[#E31E24]">Bürobedarf</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Über 10.000 Produkte für Büro, Schule und Zuhause.
              Schnelle Lieferung und persönlicher Service.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/kategorie/papier-drucken" className="btn btn-primary btn-lg">
                Jetzt entdecken
                <ArrowRight size={20} />
              </Link>
              <Link href="/registrieren" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-[#1A1A1A]">
                Geschäftskonto erstellen
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute right-0 bottom-0 w-1/3 h-full opacity-10">
          <div className="absolute inset-0 bg-[url('https://placehold.co/600x400/E31E24/E31E24')] bg-contain bg-no-repeat bg-right-bottom"></div>
        </div>
      </section>

      {/* USP Bar */}
      <section className="bg-[#F5F5F5] border-b border-[#E0E0E0]">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="flex items-center gap-3">
              <Truck className="text-[#E31E24] flex-shrink-0" size={28} />
              <div>
                <p className="font-semibold text-sm">Schnelle Lieferung</p>
                <p className="text-xs text-[#666]">2-3 Werktage</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="text-[#E31E24] flex-shrink-0" size={28} />
              <div>
                <p className="font-semibold text-sm">Kauf auf Rechnung</p>
                <p className="text-xs text-[#666]">Für Geschäftskunden</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="text-[#E31E24] flex-shrink-0" size={28} />
              <div>
                <p className="font-semibold text-sm">Sichere Zahlung</p>
                <p className="text-xs text-[#666]">SSL-verschlüsselt</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Store className="text-[#E31E24] flex-shrink-0" size={28} />
              <div>
                <p className="font-semibold text-sm">Filialgutscheine</p>
                <p className="text-xs text-[#666]">Ab 100€ Bestellwert</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Unsere Kategorien</h2>
            <Link
              href="/kategorien"
              className="text-[#E31E24] hover:text-[#C41A1F] font-medium flex items-center gap-1"
            >
              Alle anzeigen
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/kategorie/${category.slug}`}
                className="group block bg-white rounded-lg border border-[#E0E0E0] overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] bg-[#F5F5F5] relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm group-hover:text-[#E31E24] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-[#666] mt-1">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-12 md:py-16 bg-[#F5F5F5]">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Bestseller</h2>
            <Link
              href="/bestseller"
              className="text-[#E31E24] hover:text-[#C41A1F] font-medium flex items-center gap-1"
            >
              Alle Bestseller
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Voucher Info */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#E31E24] to-[#FF6B00] text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Store size={48} className="mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Filialgutscheine bei Online-Bestellungen
            </h2>
            <p className="text-lg mb-6 text-white/90">
              Bei jeder Online-Bestellung erhalten Sie einen Gutschein für Ihre nächste
              Filialbestellung! Ab 100€ = 5€ Gutschein, ab 150€ = 10€ Gutschein.
            </p>
            <Link href="/registrieren" className="btn bg-white text-[#E31E24] hover:bg-gray-100 btn-lg">
              Jetzt registrieren
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* B2B Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ihre Vorteile als Geschäftskunde
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#E31E24] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Kauf auf Rechnung</h3>
                    <p className="text-[#666] text-sm">
                      Bequem online und in der Filiale mit einer Kundennummer bestellen
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#E31E24] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Exklusive Rabatte</h3>
                    <p className="text-[#666] text-sm">
                      Bis zu 15% Rabatt je nach Kundengruppe
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#E31E24] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Gespeicherte Warenkörbe</h3>
                    <p className="text-[#666] text-sm">
                      Warenkörbe speichern und wiederverwenden für wiederkehrende Bestellungen
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#E31E24] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Filialgutscheine</h3>
                    <p className="text-[#666] text-sm">
                      Bei jeder Online-Bestellung ab 100€ einen Gutschein für die Filiale erhalten
                    </p>
                  </div>
                </li>
              </ul>
              <Link href="/registrieren" className="btn btn-primary mt-6">
                Geschäftskonto erstellen
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="bg-[#F5F5F5] rounded-lg p-8">
              <img
                src="https://placehold.co/500x400/F5F5F5/333?text=B2B+Vorteile"
                alt="B2B Vorteile"
                className="w-full rounded"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-12 md:py-16 bg-[#F5F5F5]">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-8">Unsere Marken</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {['Leitz', 'Staedtler', 'edding', 'Pelikan', 'Brother', 'HP', 'Canon', 'Tork'].map(
              (brand) => (
                <div
                  key={brand}
                  className="w-24 h-12 bg-white rounded flex items-center justify-center grayscale hover:grayscale-0 transition-all"
                >
                  <span className="font-bold text-[#666]">{brand}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
