'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  Phone,
  MapPin,
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
  { name: 'Papier & Drucken', slug: 'papier-drucken' },
  { name: 'Schreibwaren', slug: 'schreibwaren' },
  { name: 'Ordnen & Archivieren', slug: 'ordnen-archivieren' },
  { name: 'Tinte & Toner', slug: 'tinte-toner' },
  { name: 'Bürotechnik', slug: 'buerotechnik' },
  { name: 'Versand & Verpackung', slug: 'versand-verpackung' },
  { name: 'Hygiene & Reinigung', slug: 'hygiene-reinigung' },
  { name: 'Präsentation', slug: 'praesentation' },
  { name: 'Schule & Kreativ', slug: 'schule-kreativ' },
  { name: 'Büromöbel', slug: 'bueromoebel-accessoires' },
];

export default function Header({ cartItemCount = 0, user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/suche?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Demo Banner */}
      <div className="demo-banner">
        DEMO - Testumgebung | Dies ist keine echte Shop-Website
      </div>

      {/* Top Bar */}
      <div className="bg-[#1A1A1A] text-white text-sm">
        <div className="container flex justify-between items-center py-2">
          <div className="flex items-center gap-6">
            <a href="tel:+4930123456780" className="flex items-center gap-2 hover:text-[#E31E24]">
              <Phone size={14} />
              <span className="hidden sm:inline">+49 (0) 30 123 456 780</span>
            </a>
            <Link href="/filialen" className="flex items-center gap-2 hover:text-[#E31E24]">
              <MapPin size={14} />
              <span className="hidden sm:inline">Filialfinder</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/ueber-uns" className="hover:text-[#E31E24]">
              Über uns
            </Link>
            <Link href="/kontakt" className="hover:text-[#E31E24]">
              Kontakt
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#E31E24] rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-2xl font-bold text-[#1A1A1A]">
                Mc<span className="text-[#E31E24]">Paper</span>
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Produkte suchen..."
                className="input pr-12"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#666] hover:text-[#E31E24]"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <button className="p-2 md:hidden hover:bg-gray-100 rounded">
              <Search size={24} />
            </button>

            {/* User Account */}
            {user ? (
              <Link
                href="/konto"
                className="hidden sm:flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
              >
                <User size={24} />
                <span className="text-sm font-medium">{user.firstName}</span>
              </Link>
            ) : (
              <Link
                href="/anmelden"
                className="hidden sm:flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
              >
                <User size={24} />
                <span className="text-sm font-medium">Anmelden</span>
              </Link>
            )}

            {/* Favorites */}
            <Link href="/favoriten" className="p-2 hover:bg-gray-100 rounded relative">
              <Heart size={24} />
            </Link>

            {/* Cart */}
            <Link href="/warenkorb" className="p-2 hover:bg-gray-100 rounded relative">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E31E24] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="p-2 lg:hidden hover:bg-gray-100 rounded"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="mt-4 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Produkte suchen..."
              className="input pr-12"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#666] hover:text-[#E31E24]"
            >
              <Search size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* Navigation */}
      <nav className="bg-[#F5F5F5] border-t border-b border-[#E0E0E0]">
        <div className="container">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 py-3 px-4 bg-[#E31E24] text-white font-medium hover:bg-[#C41A1F]"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                onMouseEnter={() => setCategoriesOpen(true)}
              >
                <Menu size={20} />
                Alle Kategorien
                <ChevronDown size={16} className={categoriesOpen ? 'rotate-180' : ''} />
              </button>

              {categoriesOpen && (
                <div
                  className="absolute top-full left-0 w-64 bg-white shadow-lg border border-[#E0E0E0] z-50"
                  onMouseLeave={() => setCategoriesOpen(false)}
                >
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/kategorie/${category.slug}`}
                      className="block px-4 py-3 hover:bg-[#F5F5F5] hover:text-[#E31E24] border-b border-[#F0F0F0] last:border-b-0"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Main Nav Links */}
            <div className="flex items-center">
              <Link href="/neu" className="nav-link">
                Neuheiten
              </Link>
              <Link href="/angebote" className="nav-link">
                Angebote
              </Link>
              <Link href="/bestseller" className="nav-link">
                Bestseller
              </Link>
              <Link href="/marken" className="nav-link">
                Marken
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4">
              <div className="space-y-2">
                <Link
                  href="/neu"
                  className="block py-2 px-4 hover:bg-white rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Neuheiten
                </Link>
                <Link
                  href="/angebote"
                  className="block py-2 px-4 hover:bg-white rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Angebote
                </Link>
                <Link
                  href="/bestseller"
                  className="block py-2 px-4 hover:bg-white rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Bestseller
                </Link>
                <div className="border-t border-[#E0E0E0] my-2"></div>
                <p className="px-4 py-2 text-sm font-semibold text-[#666]">Kategorien</p>
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/kategorie/${category.slug}`}
                    className="block py-2 px-4 hover:bg-white rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
                <div className="border-t border-[#E0E0E0] my-2"></div>
                {!user && (
                  <Link
                    href="/anmelden"
                    className="block py-2 px-4 hover:bg-white rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Anmelden
                  </Link>
                )}
                {user && (
                  <Link
                    href="/konto"
                    className="block py-2 px-4 hover:bg-white rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mein Konto
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
