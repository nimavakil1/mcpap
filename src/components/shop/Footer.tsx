import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, CreditCard, Truck, Shield, Headphones } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white mt-auto">
      {/* Trust Badges */}
      <div className="border-b border-[#333]">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#E31E24] rounded-full flex items-center justify-center flex-shrink-0">
                <Truck size={24} />
              </div>
              <div>
                <p className="font-semibold">Schnelle Lieferung</p>
                <p className="text-sm text-gray-400">2-3 Werktage</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#E31E24] rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="font-semibold">Sichere Zahlung</p>
                <p className="text-sm text-gray-400">SSL-verschlüsselt</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#E31E24] rounded-full flex items-center justify-center flex-shrink-0">
                <Shield size={24} />
              </div>
              <div>
                <p className="font-semibold">Kauf auf Rechnung</p>
                <p className="text-sm text-gray-400">Für Geschäftskunden</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#E31E24] rounded-full flex items-center justify-center flex-shrink-0">
                <Headphones size={24} />
              </div>
              <div>
                <p className="font-semibold">Persönlicher Service</p>
                <p className="text-sm text-gray-400">Mo-Fr 8-18 Uhr</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#E31E24] rounded flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="text-xl font-bold">
                Mc<span className="text-[#E31E24]">Paper</span>
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Deutschlands führender Fachmarkt für Bürobedarf, Schreibwaren und Geschenkartikel.
            </p>
            <div className="space-y-2">
              <a
                href="tel:+4930123456780"
                className="flex items-center gap-2 text-gray-400 hover:text-[#E31E24]"
              >
                <Phone size={16} />
                +49 (0) 30 123 456 780
              </a>
              <a
                href="mailto:service@mcpaper-demo.de"
                className="flex items-center gap-2 text-gray-400 hover:text-[#E31E24]"
              >
                <Mail size={16} />
                service@mcpaper-demo.de
              </a>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock size={16} />
                Mo-Fr 8:00-18:00 Uhr
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Kategorien</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/kategorie/papier-drucken" className="text-gray-400 hover:text-[#E31E24]">
                  Papier & Drucken
                </Link>
              </li>
              <li>
                <Link href="/kategorie/schreibwaren" className="text-gray-400 hover:text-[#E31E24]">
                  Schreibwaren
                </Link>
              </li>
              <li>
                <Link
                  href="/kategorie/ordnen-archivieren"
                  className="text-gray-400 hover:text-[#E31E24]"
                >
                  Ordnen & Archivieren
                </Link>
              </li>
              <li>
                <Link href="/kategorie/tinte-toner" className="text-gray-400 hover:text-[#E31E24]">
                  Tinte & Toner
                </Link>
              </li>
              <li>
                <Link href="/kategorie/buerotechnik" className="text-gray-400 hover:text-[#E31E24]">
                  Bürotechnik
                </Link>
              </li>
            </ul>
          </div>

          {/* Service */}
          <div>
            <h4 className="font-semibold mb-4">Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/versand-lieferung" className="text-gray-400 hover:text-[#E31E24]">
                  Versand & Lieferung
                </Link>
              </li>
              <li>
                <Link href="/zahlungsarten" className="text-gray-400 hover:text-[#E31E24]">
                  Zahlungsarten
                </Link>
              </li>
              <li>
                <Link href="/widerrufsrecht" className="text-gray-400 hover:text-[#E31E24]">
                  Widerrufsrecht
                </Link>
              </li>
              <li>
                <Link href="/filialen" className="text-gray-400 hover:text-[#E31E24]">
                  Filialfinder
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-gray-400 hover:text-[#E31E24]">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-4">Informationen</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/ueber-uns" className="text-gray-400 hover:text-[#E31E24]">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/agb" className="text-gray-400 hover:text-[#E31E24]">
                  AGB
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-gray-400 hover:text-[#E31E24]">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="text-gray-400 hover:text-[#E31E24]">
                  Impressum
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#333]">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} McPaper AG (Demo). Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center gap-4">
              <img
                src="https://placehold.co/60x30/1A1A1A/666?text=VISA"
                alt="Visa"
                className="h-6"
              />
              <img
                src="https://placehold.co/60x30/1A1A1A/666?text=MC"
                alt="Mastercard"
                className="h-6"
              />
              <img
                src="https://placehold.co/60x30/1A1A1A/666?text=PayPal"
                alt="PayPal"
                className="h-6"
              />
              <img
                src="https://placehold.co/60x30/1A1A1A/666?text=SEPA"
                alt="SEPA"
                className="h-6"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
