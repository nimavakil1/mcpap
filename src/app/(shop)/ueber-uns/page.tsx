import Link from 'next/link';
import { ChevronRight, Building2, Users, Award, MapPin, Heart, Target, ArrowRight, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Über uns - McPaper',
  description: 'Erfahren Sie mehr über McPaper - Ihr Partner für Bürobedarf',
};

export default function UeberUnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors">
            Startseite
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-900 font-medium">Über uns</span>
        </nav>

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 size={32} className="text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Über McPaper</h1>
            <p className="text-gray-500">Ihr Partner für Bürobedarf seit 1987</p>
          </div>

          {/* Demo Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8">
            <p className="text-amber-700 font-medium text-center">
              DEMO - Dies ist eine Testumgebung und keine echte Shop-Website.
            </p>
          </div>

          {/* Hero Section */}
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2di00aC0ydjRoMnptMC02di00aC0ydjRoMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-white/80" />
                <span className="text-white/80 text-sm font-medium">Tradition trifft Innovation</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ihr Partner für Bürobedarf seit 1987</h2>
              <p className="text-lg text-white/90 max-w-2xl">
                McPaper ist einer der führenden Fachhändler für Papier-, Büro- und Schreibwaren (PBS) in Deutschland.
                Mit über 200 Filialen und unserem Online-Shop sind wir immer für Sie da.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { value: '35+', label: 'Jahre Erfahrung' },
              { value: '200+', label: 'Filialen' },
              { value: '10.000+', label: 'Produkte' },
              { value: '1 Mio+', label: 'Kunden' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg hover:shadow-gray-200/50 transition-all">
                <div className="text-3xl md:text-4xl font-bold text-red-600 mb-1">{stat.value}</div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Our Story */}
          <section className="mb-12">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Building2 size={24} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Unsere Geschichte</h2>
              </div>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
                <p>
                  Die Geschichte von McPaper begann 1987 mit der Eröffnung des ersten Geschäfts in Berlin.
                  Was als kleiner Schreibwarenladen startete, hat sich zu einem der führenden Fachhändler
                  für Bürobedarf in Deutschland entwickelt.
                </p>
                <p>
                  Unser Erfolgsrezept: Qualitätsprodukte zu fairen Preisen, kompetente Beratung und ein
                  Sortiment, das keine Wünsche offen lässt. Von Stiften und Papier über Ordnungssysteme
                  bis hin zu Bürotechnik – bei uns finden Sie alles für den perfekten Arbeitsplatz.
                </p>
                <p>
                  Heute sind wir mit über 200 Filialen in ganz Deutschland präsent und bieten unseren
                  Geschäftskunden mit diesem Online-Shop eine bequeme Möglichkeit, Büromaterial zu bestellen.
                </p>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart size={24} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Unsere Werte</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Award,
                  title: 'Qualität',
                  description: 'Wir führen nur Produkte, von deren Qualität wir überzeugt sind. Unsere strengen Qualitätskontrollen garantieren Ihnen hochwertige Büromaterialien.',
                },
                {
                  icon: Users,
                  title: 'Kundenservice',
                  description: 'Ihre Zufriedenheit steht bei uns an erster Stelle. Unser kompetentes Team berät Sie gerne und findet für jede Anforderung die passende Lösung.',
                },
                {
                  icon: Target,
                  title: 'Nachhaltigkeit',
                  description: 'Wir setzen auf umweltfreundliche Produkte und nachhaltige Verpackungen. Der Schutz unserer Umwelt liegt uns am Herzen.',
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all group"
                >
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                    <value.icon size={28} className="text-red-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* For Business */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 md:p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Building2 size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold">Für Geschäftskunden</h2>
              </div>
              <p className="text-white/80 mb-6">
                Als B2B-Partner bieten wir Ihrem Unternehmen zahlreiche Vorteile:
              </p>
              <div className="grid md:grid-cols-2 gap-3 mb-8">
                {[
                  'Attraktive Staffelrabatte',
                  'Kauf auf Rechnung',
                  'Persönlicher Kundenberater',
                  'Express-Lieferung möglich',
                  'Individuelle Angebote',
                  'Kostenloser Versand ab 50€',
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/registrieren"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all"
              >
                Jetzt Geschäftskonto anlegen
                <ArrowRight size={18} />
              </Link>
            </div>
          </section>

          {/* Locations */}
          <section>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <MapPin size={24} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Unsere Filialen</h2>
              </div>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
                <p>
                  Mit über 200 Filialen sind wir in ganz Deutschland für Sie da. Besuchen Sie uns vor Ort
                  und lassen Sie sich persönlich beraten. Unsere Mitarbeiter helfen Ihnen gerne, das
                  passende Produkt zu finden.
                </p>
                <p>
                  Nutzen Sie unseren Filialfinder, um die nächste McPaper-Filiale in Ihrer Nähe zu finden.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/filialen"
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors"
                >
                  Zur Filialsuche
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
