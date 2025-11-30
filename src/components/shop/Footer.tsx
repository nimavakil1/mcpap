import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, CreditCard, Truck, Shield, Headphones, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-3">Bleiben Sie informiert</h3>
            <p className="text-gray-400 mb-6">
              Abonnieren Sie unseren Newsletter für exklusive Angebote und Neuheiten.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Ihre E-Mail-Adresse"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors flex items-center justify-center gap-2"
              >
                Anmelden
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-b border-gray-800">
        <div className="container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: 'Schnelle Lieferung', desc: '2-3 Werktage' },
              { icon: CreditCard, title: 'Sichere Zahlung', desc: 'SSL-verschlüsselt' },
              { icon: Shield, title: 'Kauf auf Rechnung', desc: 'Für Geschäftskunden' },
              { icon: Headphones, title: 'Persönlicher Service', desc: 'Mo-Fr 8-18 Uhr' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon size={22} className="text-red-500" />
                </div>
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <img
                src="https://mcpaper.de/wp-content/uploads/2025/02/mcpaper-logo.png"
                alt="McPaper"
                className="h-10 brightness-0 invert"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('span');
                  fallback.className = 'text-2xl font-bold';
                  fallback.innerHTML = 'Mc<span class="text-red-500">Paper</span>';
                  target.parentElement?.appendChild(fallback);
                }}
              />
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Deutschlands führender Fachmarkt für Bürobedarf, Schreibwaren und Geschenkartikel.
            </p>
            <div className="space-y-3">
              <a
                href="tel:+4930123456780"
                className="flex items-center gap-3 text-gray-400 hover:text-red-500 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Phone size={14} />
                </div>
                +49 (0) 30 123 456 780
              </a>
              <a
                href="mailto:service@mcpaper-demo.de"
                className="flex items-center gap-3 text-gray-400 hover:text-red-500 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Mail size={14} />
                </div>
                service@mcpaper-demo.de
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Clock size={14} />
                </div>
                Mo-Fr 8:00-18:00 Uhr
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-4">Kategorien</h4>
            <ul className="space-y-3">
              {[
                { href: '/kategorie/papier-drucken', label: 'Papier & Drucken' },
                { href: '/kategorie/schreibwaren', label: 'Schreibwaren' },
                { href: '/kategorie/ordnen-archivieren', label: 'Ordnen & Archivieren' },
                { href: '/kategorie/tinte-toner', label: 'Tinte & Toner' },
                { href: '/kategorie/buerotechnik', label: 'Bürotechnik' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service */}
          <div>
            <h4 className="font-semibold text-white mb-4">Service</h4>
            <ul className="space-y-3">
              {[
                { href: '/versand', label: 'Versand & Lieferung' },
                { href: '/zahlungsarten', label: 'Zahlungsarten' },
                { href: '/widerrufsrecht', label: 'Widerrufsrecht' },
                { href: '/filialen', label: 'Filialfinder' },
                { href: '/kontakt', label: 'Kontakt' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Informationen</h4>
            <ul className="space-y-3">
              {[
                { href: '/ueber-uns', label: 'Über uns' },
                { href: '/agb', label: 'AGB' },
                { href: '/datenschutz', label: 'Datenschutz' },
                { href: '/impressum', label: 'Impressum' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} McPaper AG (Demo). Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center gap-3">
              {['VISA', 'Mastercard', 'PayPal', 'SEPA'].map((payment) => (
                <div
                  key={payment}
                  className="px-3 py-1.5 bg-gray-800 rounded text-xs font-medium text-gray-400"
                >
                  {payment}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
