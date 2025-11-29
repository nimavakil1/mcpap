import Link from 'next/link';
import { ChevronRight, Building2, Users, Award, MapPin, Heart, Target } from 'lucide-react';

export const metadata = {
  title: 'Über uns - McPaper',
  description: 'Erfahren Sie mehr über McPaper - Ihr Partner für Bürobedarf',
};

export default function UeberUnsPage() {
  return (
    <div className="container py-6">
      <nav className="breadcrumb mb-6">
        <Link href="/">Startseite</Link>
        <ChevronRight size={16} className="breadcrumb-separator" />
        <span className="text-[#1A1A1A] font-medium">Über uns</span>
      </nav>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Über McPaper</h1>

        <div className="bg-[#FF6B00]/10 border border-[#FF6B00] rounded-lg p-4 mb-8">
          <p className="text-[#FF6B00] font-medium">
            ⚠️ DEMO - Dies ist eine Testumgebung und keine echte Shop-Website.
          </p>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#E31E24] to-[#FF6B00] rounded-lg p-8 text-white mb-12">
          <h2 className="text-2xl font-bold mb-4">Ihr Partner für Bürobedarf seit 1987</h2>
          <p className="text-lg opacity-90">
            McPaper ist einer der führenden Fachhändler für Papier-, Büro- und Schreibwaren (PBS) in Deutschland.
            Mit über 200 Filialen und unserem Online-Shop sind wir immer für Sie da.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#E31E24] mb-2">35+</div>
            <p className="text-[#666]">Jahre Erfahrung</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#E31E24] mb-2">200+</div>
            <p className="text-[#666]">Filialen</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#E31E24] mb-2">10.000+</div>
            <p className="text-[#666]">Produkte</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#E31E24] mb-2">1 Mio+</div>
            <p className="text-[#666]">Kunden</p>
          </div>
        </div>

        {/* Our Story */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Building2 size={28} className="text-[#E31E24]" />
            <h2 className="text-2xl font-bold">Unsere Geschichte</h2>
          </div>
          <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
            <p className="text-[#666] mb-4">
              Die Geschichte von McPaper begann 1987 mit der Eröffnung des ersten Geschäfts in Berlin.
              Was als kleiner Schreibwarenladen startete, hat sich zu einem der führenden Fachhändler
              für Bürobedarf in Deutschland entwickelt.
            </p>
            <p className="text-[#666] mb-4">
              Unser Erfolgsrezept: Qualitätsprodukte zu fairen Preisen, kompetente Beratung und ein
              Sortiment, das keine Wünsche offen lässt. Von Stiften und Papier über Ordnungssysteme
              bis hin zu Bürotechnik – bei uns finden Sie alles für den perfekten Arbeitsplatz.
            </p>
            <p className="text-[#666]">
              Heute sind wir mit über 200 Filialen in ganz Deutschland präsent und bieten unseren
              Geschäftskunden mit diesem Online-Shop eine bequeme Möglichkeit, Büromaterial zu bestellen.
            </p>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Heart size={28} className="text-[#E31E24]" />
            <h2 className="text-2xl font-bold">Unsere Werte</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
              <Award size={40} className="text-[#E31E24] mb-4" />
              <h3 className="font-bold mb-2">Qualität</h3>
              <p className="text-sm text-[#666]">
                Wir führen nur Produkte, von deren Qualität wir überzeugt sind. Unsere strengen
                Qualitätskontrollen garantieren Ihnen hochwertige Büromaterialien.
              </p>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
              <Users size={40} className="text-[#E31E24] mb-4" />
              <h3 className="font-bold mb-2">Kundenservice</h3>
              <p className="text-sm text-[#666]">
                Ihre Zufriedenheit steht bei uns an erster Stelle. Unser kompetentes Team berät
                Sie gerne und findet für jede Anforderung die passende Lösung.
              </p>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
              <Target size={40} className="text-[#E31E24] mb-4" />
              <h3 className="font-bold mb-2">Nachhaltigkeit</h3>
              <p className="text-sm text-[#666]">
                Wir setzen auf umweltfreundliche Produkte und nachhaltige Verpackungen. Der
                Schutz unserer Umwelt liegt uns am Herzen.
              </p>
            </div>
          </div>
        </section>

        {/* For Business */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Building2 size={28} className="text-[#E31E24]" />
            <h2 className="text-2xl font-bold">Für Geschäftskunden</h2>
          </div>
          <div className="bg-[#F5F5F5] rounded-lg p-6">
            <p className="text-[#666] mb-4">
              Als B2B-Partner bieten wir Ihrem Unternehmen zahlreiche Vorteile:
            </p>
            <ul className="grid md:grid-cols-2 gap-3">
              <li className="flex items-center gap-2 text-[#666]">
                <span className="w-2 h-2 bg-[#E31E24] rounded-full"></span>
                Attraktive Staffelrabatte
              </li>
              <li className="flex items-center gap-2 text-[#666]">
                <span className="w-2 h-2 bg-[#E31E24] rounded-full"></span>
                Kauf auf Rechnung
              </li>
              <li className="flex items-center gap-2 text-[#666]">
                <span className="w-2 h-2 bg-[#E31E24] rounded-full"></span>
                Persönlicher Kundenberater
              </li>
              <li className="flex items-center gap-2 text-[#666]">
                <span className="w-2 h-2 bg-[#E31E24] rounded-full"></span>
                Express-Lieferung möglich
              </li>
              <li className="flex items-center gap-2 text-[#666]">
                <span className="w-2 h-2 bg-[#E31E24] rounded-full"></span>
                Individuelle Angebote
              </li>
              <li className="flex items-center gap-2 text-[#666]">
                <span className="w-2 h-2 bg-[#E31E24] rounded-full"></span>
                Kostenloser Versand ab 50€
              </li>
            </ul>
            <div className="mt-6">
              <Link
                href="/registrieren"
                className="inline-block bg-[#E31E24] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#C41A1F] transition-colors"
              >
                Jetzt Geschäftskonto anlegen
              </Link>
            </div>
          </div>
        </section>

        {/* Locations */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <MapPin size={28} className="text-[#E31E24]" />
            <h2 className="text-2xl font-bold">Unsere Filialen</h2>
          </div>
          <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
            <p className="text-[#666] mb-4">
              Mit über 200 Filialen sind wir in ganz Deutschland für Sie da. Besuchen Sie uns vor Ort
              und lassen Sie sich persönlich beraten. Unsere Mitarbeiter helfen Ihnen gerne, das
              passende Produkt zu finden.
            </p>
            <p className="text-[#666]">
              Nutzen Sie unseren Filialfinder, um die nächste McPaper-Filiale in Ihrer Nähe zu finden.
            </p>
            <div className="mt-4">
              <Link
                href="/filialen"
                className="text-[#E31E24] hover:underline font-medium"
              >
                Zur Filialsuche →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
