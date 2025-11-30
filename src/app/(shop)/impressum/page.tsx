import Link from 'next/link';
import { ChevronRight, Building2, Users, Phone, BookOpen, Receipt, Scale, Link2, Copyright } from 'lucide-react';

export const metadata = {
  title: 'Impressum - McPaper',
  description: 'Impressum und rechtliche Informationen der McPaper Demo-Plattform',
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors">
            Startseite
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-900 font-medium">Impressum</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 size={32} className="text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Impressum</h1>
            <p className="text-gray-500">Rechtliche Informationen und Angaben gemäß § 5 TMG</p>
          </div>

          {/* Demo Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8">
            <p className="text-amber-700 font-medium text-center">
              DEMO - Dies ist eine Testumgebung und keine echte Shop-Website.
            </p>
          </div>

          {/* Main Company Info Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Building2 size={20} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Angaben gemäß § 5 TMG</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-4">McPaper AG (Demo)</p>
                <div className="text-gray-600 space-y-1">
                  <p>Musterstraße 123</p>
                  <p>10115 Berlin</p>
                  <p>Deutschland</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone size={18} className="text-red-600" />
                  <span>+49 (0) 30 123456-0</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone size={18} className="text-red-600" />
                  <span>Fax: +49 (0) 30 123456-99</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Link2 size={18} className="text-red-600" />
                  <span>info@mcpaper-demo.de</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Vertreten durch */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Users size={20} className="text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Vertreten durch</h2>
              </div>
              <div className="text-gray-600 space-y-2">
                <p><span className="text-gray-500">Vorstand:</span></p>
                <p>Max Mustermann (Vorsitzender)</p>
                <p>Erika Musterfrau</p>
                <p className="mt-4"><span className="text-gray-500">Aufsichtsratsvorsitzender:</span></p>
                <p>Hans Beispiel</p>
              </div>
            </div>

            {/* Registereintrag */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <BookOpen size={20} className="text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Registereintrag</h2>
              </div>
              <div className="text-gray-600 space-y-2">
                <p>Eintragung im Handelsregister</p>
                <p><span className="text-gray-500">Registergericht:</span></p>
                <p>Amtsgericht Berlin-Charlottenburg</p>
                <p className="mt-2"><span className="text-gray-500">Registernummer:</span></p>
                <p className="font-mono font-medium text-gray-900">HRB 12345 B</p>
              </div>
            </div>

            {/* Umsatzsteuer-ID */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Receipt size={20} className="text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Umsatzsteuer-ID</h2>
              </div>
              <div className="text-gray-600">
                <p className="text-sm">Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:</p>
                <p className="font-mono text-xl font-bold text-gray-900 mt-2">DE 123456789</p>
              </div>
            </div>

            {/* Verantwortlich für Inhalt */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Users size={20} className="text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Verantwortlich für Inhalt</h2>
              </div>
              <div className="text-gray-600">
                <p className="text-sm text-gray-500 mb-2">nach § 55 Abs. 2 RStV</p>
                <p className="font-medium text-gray-900">Max Mustermann</p>
                <p>Musterstraße 123</p>
                <p>10115 Berlin</p>
              </div>
            </div>
          </div>

          {/* Additional Sections */}
          <div className="space-y-6">
            {/* Streitschlichtung */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Scale size={20} className="text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Streitschlichtung</h2>
              </div>
              <div className="text-gray-600 space-y-3">
                <p>
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                  <a
                    href="https://ec.europa.eu/consumers/odr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:underline"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                </p>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm">
                    Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                    Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                </div>
              </div>
            </div>

            {/* Haftung für Inhalte */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Scale size={20} className="text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Haftung für Inhalte</h2>
              </div>
              <p className="text-gray-600">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
                allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
                verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen
                zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
            </div>

            {/* Haftung für Links */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Link2 size={20} className="text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Haftung für Links</h2>
              </div>
              <p className="text-gray-600">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
                Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
                verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
            </div>

            {/* Urheberrecht */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Copyright size={20} className="text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Urheberrecht</h2>
              </div>
              <p className="text-gray-600">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
                Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
                Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
