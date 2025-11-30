'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Demo Banner */}
      <div className="bg-gray-900 text-white text-center py-2 text-sm font-medium">
        DEMO - Testumgebung | Dies ist keine echte Shop-Website
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container py-4">
          <Link href="/" className="inline-block">
            {logoError ? (
              <span className="text-2xl font-bold">
                Mc<span className="text-red-500">Paper</span>
              </span>
            ) : (
              <img
                src="https://mcpaper.de/wp-content/uploads/2025/02/mcpaper-logo.png"
                alt="McPaper"
                className="h-10"
                onError={() => setLogoError(true)}
              />
            )}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <Link href="/impressum" className="hover:text-red-600 transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-red-600 transition-colors">
              Datenschutz
            </Link>
            <Link href="/agb" className="hover:text-red-600 transition-colors">
              AGB
            </Link>
            <Link href="/kontakt" className="hover:text-red-600 transition-colors">
              Kontakt
            </Link>
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">
            &copy; {new Date().getFullYear()} McPaper AG (Demo)
          </p>
        </div>
      </footer>
    </div>
  );
}
