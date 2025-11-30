'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Truck,
  CreditCard,
  Shield,
  Store,
  Sparkles,
  Package,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';

const categories = [
  {
    name: 'Papier & Drucken',
    slug: 'papier-drucken',
    icon: '📄',
    color: 'from-blue-500/20 to-blue-600/20',
    description: 'Kopierpapier, Druckerpapier & mehr',
    productCount: '500+',
  },
  {
    name: 'Schreibwaren',
    slug: 'schreibwaren',
    icon: '✏️',
    color: 'from-amber-500/20 to-orange-600/20',
    description: 'Stifte, Marker, Textmarker',
    productCount: '800+',
  },
  {
    name: 'Ordnen & Archivieren',
    slug: 'ordnen-archivieren',
    icon: '📁',
    color: 'from-emerald-500/20 to-green-600/20',
    description: 'Ordner, Ringbücher, Mappen',
    productCount: '400+',
  },
  {
    name: 'Tinte & Toner',
    slug: 'tinte-toner',
    icon: '🖨️',
    color: 'from-purple-500/20 to-violet-600/20',
    description: 'Druckerpatronen & Toner',
    productCount: '1000+',
  },
  {
    name: 'Bürotechnik',
    slug: 'buerotechnik',
    icon: '💻',
    color: 'from-cyan-500/20 to-blue-600/20',
    description: 'Taschenrechner, Laminiergeräte',
    productCount: '300+',
  },
  {
    name: 'Hygiene & Reinigung',
    slug: 'hygiene-reinigung',
    icon: '🧴',
    color: 'from-teal-500/20 to-emerald-600/20',
    description: 'Papierhandtücher, Reinigungsmittel',
    productCount: '200+',
  },
];

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
        url: 'https://picsum.photos/seed/nav1/400/400',
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
        url: 'https://picsum.photos/seed/sta2/400/400',
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
        url: 'https://picsum.photos/seed/lei3/400/400',
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
        url: 'https://picsum.photos/seed/edd4/400/400',
        altText: 'edding Permanentmarker',
        sortOrder: 0,
        isPrimary: true,
      },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[700px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-600/30 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-red-500/20 rounded-full blur-[128px]" />

        <div className="container relative z-10 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8 border border-white/10"
            >
              <Sparkles size={16} className="text-red-400" />
              <span>Über 10.000 Produkte verfügbar</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-amber-100">Ihr Partner für</span>
              <span className="block bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
                professionellen Bürobedarf
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Entdecken Sie unser umfangreiches Sortiment an Büroartikeln, Schreibwaren
              und Technik. Schnelle Lieferung, persönlicher Service und exklusive Vorteile
              für Geschäftskunden.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/kategorie/papier-drucken"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-colors shadow-lg shadow-red-600/25"
                >
                  Jetzt entdecken
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/registrieren"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-colors border border-white/20 backdrop-blur-sm"
                >
                  Geschäftskonto erstellen
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 lg:mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: '10.000+', label: 'Produkte' },
              { value: '50+', label: 'Marken' },
              { value: '2-3', label: 'Tage Lieferung' },
              { value: '15%', label: 'B2B Rabatt' },
            ].map((stat, index) => (
              <div key={index} className="text-center md:text-left">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* USP Bar */}
      <section className="bg-white border-y border-gray-100 py-8">
        <div className="container py-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { icon: Truck, title: 'Schnelle Lieferung', desc: '2-3 Werktage' },
              { icon: CreditCard, title: 'Kauf auf Rechnung', desc: 'Für Geschäftskunden' },
              { icon: Shield, title: 'Sichere Zahlung', desc: 'SSL-verschlüsselt' },
              { icon: Store, title: 'Filialgutscheine', desc: 'Ab 100€ Bestellwert' },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-red-600" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Unsere Kategorien
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Finden Sie alles, was Sie für Ihr Büro brauchen - von Papier über
              Schreibwaren bis hin zu Bürotechnik.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {categories.map((category) => (
              <motion.div key={category.slug} variants={itemVariants}>
                <Link
                  href={`/kategorie/${category.slug}`}
                  className="group block bg-white rounded-2xl p-6 border border-gray-100 hover:border-red-200 hover:shadow-lg hover:shadow-red-500/5 transition-all h-full"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{category.description}</p>
                  <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    {category.productCount} Produkte
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              href="/kategorien"
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
            >
              Alle Kategorien anzeigen
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Bestseller
              </h2>
              <p className="text-gray-600">
                Die beliebtesten Produkte unserer Kunden
              </p>
            </div>
            <Link
              href="/bestseller"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-full transition-colors"
            >
              Alle Bestseller
              <ArrowRight size={18} />
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Voucher Banner */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <Store size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Filialgutscheine bei
              <br />Online-Bestellungen
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Bei jeder Online-Bestellung erhalten Sie einen Gutschein für Ihre nächste
              Filialbestellung! Ab 100€ = 5€ Gutschein, ab 150€ = 10€ Gutschein.
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/registrieren"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors shadow-lg"
              >
                Jetzt registrieren
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* B2B Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ihre Vorteile als
                <span className="block text-red-600">Geschäftskunde</span>
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: CreditCard,
                    title: 'Kauf auf Rechnung',
                    desc: 'Bequem online und in der Filiale mit einer Kundennummer bestellen',
                  },
                  {
                    icon: Package,
                    title: 'Exklusive Rabatte',
                    desc: 'Bis zu 15% Rabatt je nach Kundengruppe',
                  },
                  {
                    icon: Clock,
                    title: 'Gespeicherte Warenkörbe',
                    desc: 'Warenkörbe speichern und wiederverwenden für wiederkehrende Bestellungen',
                  },
                  {
                    icon: Store,
                    title: 'Filialgutscheine',
                    desc: 'Bei jeder Online-Bestellung ab 100€ einen Gutschein für die Filiale erhalten',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="text-red-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8"
              >
                <Link
                  href="/registrieren"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-colors shadow-lg shadow-red-600/25"
                >
                  Geschäftskonto erstellen
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl p-8 lg:p-12">
                <div className="space-y-4">
                  {[
                    'Persönlicher Ansprechpartner',
                    'Individuelle Angebote',
                    'Schneller Versand',
                    'Flexible Zahlungsmöglichkeiten',
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm"
                    >
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={24} />
                      <span className="font-medium text-gray-900">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-red-500/10 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Unsere Marken
            </h2>
            <p className="text-gray-600">
              Qualitätsprodukte von führenden Herstellern
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="flex flex-wrap justify-center items-center gap-6 md:gap-10"
          >
            {['Leitz', 'Staedtler', 'edding', 'Pelikan', 'Brother', 'HP', 'Canon', 'Tork'].map(
              (brand, index) => (
                <motion.div
                  key={brand}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="w-28 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer border border-gray-100"
                >
                  <span className="font-bold text-gray-500 hover:text-gray-900 transition-colors">
                    {brand}
                  </span>
                </motion.div>
              )
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
