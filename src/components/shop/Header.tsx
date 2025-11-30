'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface HeaderProps {
  cartItemCount?: number;
  user?: {
    firstName: string;
    lastName: string;
    customerNumber: string;
  } | null;
}

const categories = [
  { name: 'Papier & Drucken', slug: 'papier-drucken', icon: '📄' },
  { name: 'Schreibwaren', slug: 'schreibwaren', icon: '✏️' },
  { name: 'Ordnen & Archivieren', slug: 'ordnen-archivieren', icon: '📁' },
  { name: 'Tinte & Toner', slug: 'tinte-toner', icon: '🖨️' },
  { name: 'Bürotechnik', slug: 'buerotechnik', icon: '💻' },
  { name: 'Versand & Verpackung', slug: 'versand-verpackung', icon: '📦' },
  { name: 'Hygiene & Reinigung', slug: 'hygiene-reinigung', icon: '🧴' },
  { name: 'Präsentation', slug: 'praesentation', icon: '📊' },
  { name: 'Schule & Kreativ', slug: 'schule-kreativ', icon: '🎨' },
  { name: 'Büromöbel', slug: 'bueromoebel-accessoires', icon: '🪑' },
];

export default function Header({ cartItemCount = 0, user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/suche?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100'
            : 'bg-white'
        }`}
      >
        {/* Demo Banner */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white text-xs font-medium tracking-wide">
          <div className="container py-2 text-center">
            DEMO - Testumgebung | Dies ist keine echte Shop-Website
          </div>
        </div>

        {/* Main Header */}
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 relative group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <img
                  src="https://mcpaper.de/wp-content/uploads/2025/02/mcpaper-logo.png"
                  alt="McPaper"
                  className="h-10 lg:h-12 w-auto object-contain"
                  onError={(e) => {
                    // Fallback to text logo if image fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement('span');
                      fallback.className = 'text-2xl font-bold text-gray-900';
                      fallback.innerHTML = 'Mc<span class="text-red-600">Paper</span>';
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </motion.div>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden lg:block">
              <motion.div
                className={`relative transition-all duration-200 ${
                  searchFocused ? 'scale-[1.02]' : ''
                }`}
              >
                <div
                  className={`relative flex items-center rounded-full border-2 transition-all duration-200 ${
                    searchFocused
                      ? 'border-red-500 bg-white shadow-lg shadow-red-500/10'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <Search
                    size={18}
                    className={`absolute left-4 transition-colors ${
                      searchFocused ? 'text-red-500' : 'text-gray-400'
                    }`}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Produkte suchen..."
                    className="w-full py-3 pl-11 pr-4 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
                  />
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        type="submit"
                        className="absolute right-2 px-4 py-1.5 bg-red-600 text-white text-sm font-medium rounded-full hover:bg-red-700 transition-colors"
                      >
                        Suchen
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Mobile Search Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 lg:hidden rounded-full hover:bg-gray-100 transition-colors"
              >
                <Search size={22} className="text-gray-700" />
              </motion.button>

              {/* User Account */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {user ? (
                  <Link
                    href="/konto"
                    className="hidden sm:flex items-center gap-2 p-2.5 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-medium text-sm">
                      {user.firstName.charAt(0)}
                    </div>
                  </Link>
                ) : (
                  <Link
                    href="/anmelden"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
                  >
                    <User size={18} />
                    <span>Anmelden</span>
                  </Link>
                )}
              </motion.div>

              {/* Favorites */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/favoriten"
                  className="p-2.5 rounded-full hover:bg-gray-100 transition-colors relative hidden sm:flex"
                >
                  <Heart size={22} className="text-gray-700" />
                </Link>
              </motion.div>

              {/* Cart */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/warenkorb"
                  className="p-2.5 rounded-full hover:bg-gray-100 transition-colors relative flex items-center gap-2"
                >
                  <div className="relative">
                    <ShoppingCart size={22} className="text-gray-700" />
                    <AnimatePresence>
                      {cartItemCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
                        >
                          {cartItemCount > 99 ? '99+' : cartItemCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </Link>
              </motion.div>

              {/* Mobile Menu Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 lg:hidden rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X size={22} className="text-gray-700" />
                ) : (
                  <Menu size={22} className="text-gray-700" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="pb-4 lg:hidden">
            <div className="relative flex items-center rounded-full border border-gray-200 bg-gray-50">
              <Search size={18} className="absolute left-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Produkte suchen..."
                className="w-full py-2.5 pl-11 pr-4 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
              />
            </div>
          </form>
        </div>

        {/* Navigation */}
        <nav className="border-t border-gray-100 hidden lg:block">
          <div className="container">
            <div className="flex items-center gap-1">
              {/* Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}
              >
                <button
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors ${
                    categoriesOpen
                      ? 'text-red-600'
                      : 'text-gray-700 hover:text-red-600'
                  }`}
                >
                  <Menu size={18} />
                  Alle Kategorien
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${categoriesOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {categoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="py-2">
                        {categories.map((category) => (
                          <Link
                            key={category.slug}
                            href={`/kategorie/${category.slug}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                          >
                            <span className="text-lg">{category.icon}</span>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors flex-1">
                              {category.name}
                            </span>
                            <ChevronRight
                              size={16}
                              className="text-gray-300 group-hover:text-red-500 transition-colors"
                            />
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Main Nav Links */}
              <div className="flex items-center">
                {[
                  { href: '/neu', label: 'Neuheiten', badge: 'NEU' },
                  { href: '/angebote', label: 'Angebote', badge: '%' },
                  { href: '/bestseller', label: 'Bestseller' },
                  { href: '/marken', label: 'Marken' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-4 py-3 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors group"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded">
                        {link.badge}
                      </span>
                    )}
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-full bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Menü</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="p-4 space-y-1">
                {/* Quick Links */}
                {[
                  { href: '/neu', label: 'Neuheiten', badge: 'NEU' },
                  { href: '/angebote', label: 'Angebote', badge: '%' },
                  { href: '/bestseller', label: 'Bestseller' },
                  { href: '/marken', label: 'Marken' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="font-medium text-gray-900">{link.label}</span>
                    {link.badge && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}

                <div className="my-4 h-px bg-gray-100" />

                {/* Categories */}
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Kategorien
                </p>
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/kategorie/${category.slug}`}
                    className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-gray-900">{category.name}</span>
                  </Link>
                ))}

                <div className="my-4 h-px bg-gray-100" />

                {/* Account Links */}
                {!user ? (
                  <Link
                    href="/anmelden"
                    className="flex items-center gap-3 py-3 px-3 rounded-lg bg-red-600 text-white font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>Anmelden</span>
                  </Link>
                ) : (
                  <Link
                    href="/konto"
                    className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-medium text-sm">
                      {user.firstName.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-900">Mein Konto</span>
                  </Link>
                )}

                <Link
                  href="/favoriten"
                  className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart size={18} className="text-gray-600" />
                  <span className="text-gray-900">Favoriten</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
