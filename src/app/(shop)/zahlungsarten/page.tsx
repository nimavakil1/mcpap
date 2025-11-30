import Link from 'next/link';
import { ChevronRight, CreditCard, FileText, Wallet, Building2, Shield, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Zahlungsarten - McPaper',
  description: 'Verfügbare Zahlungsarten bei McPaper',
};

export default function ZahlungsartenPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors">
            Startseite
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-900 font-medium">Zahlungsarten</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard size={32} className="text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Zahlungsarten</h1>
            <p className="text-gray-500">Sichere und bequeme Zahlungsmöglichkeiten</p>
          </div>

          {/* Demo Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8">
            <p className="text-amber-700 font-medium text-center">
              DEMO - Dies ist eine Testumgebung und keine echte Shop-Website.
            </p>
          </div>

          <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
            Bei McPaper bieten wir Ihnen verschiedene sichere Zahlungsmöglichkeiten an. Wählen Sie einfach
            Ihre bevorzugte Zahlungsart im Checkout-Prozess aus.
          </p>

          <div className="space-y-6">
            {/* Rechnung */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FileText size={28} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Rechnung</h2>
                  <p className="text-gray-600 mb-4">
                    Bezahlen Sie bequem nach Erhalt der Ware. Die Rechnung liegt Ihrer Lieferung bei.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">So funktioniert&apos;s:</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      {[
                        'Wählen Sie „Rechnung" als Zahlungsart',
                        'Wir versenden Ihre Bestellung sofort',
                        'Bezahlen Sie innerhalb von 14 Tagen nach Erhalt',
                        'Bankverbindung finden Sie auf der Rechnung',
                      ].map((step, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-green-500" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    <CheckCircle size={14} />
                    Verfügbar für registrierte Geschäftskunden
                  </span>
                </div>
              </div>
            </div>

            {/* Kreditkarte */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <CreditCard size={28} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Kreditkarte</h2>
                  <p className="text-gray-600 mb-4">
                    Bezahlen Sie schnell und sicher mit Ihrer Kreditkarte. Wir akzeptieren alle gängigen Kreditkarten.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Visa', 'Mastercard', 'American Express'].map((card) => (
                      <span key={card} className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700">
                        {card}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield size={16} className="text-green-500" />
                    SSL-verschlüsselte Übertragung
                  </div>
                </div>
              </div>
            </div>

            {/* PayPal */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Wallet size={28} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">PayPal</h2>
                  <p className="text-gray-600 mb-4">
                    Zahlen Sie schnell und sicher mit Ihrem PayPal-Konto. Sie werden während des
                    Bestellvorgangs zu PayPal weitergeleitet.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Ihre Vorteile:</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      {[
                        'Käuferschutz inklusive',
                        'Keine Eingabe von Bankdaten erforderlich',
                        'Schnelle Zahlung mit nur wenigen Klicks',
                      ].map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-green-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* SEPA */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Building2 size={28} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">SEPA-Lastschrift</h2>
                  <p className="text-gray-600 mb-4">
                    Erteilen Sie uns ein SEPA-Lastschriftmandat und wir buchen den Betrag bequem von Ihrem
                    Bankkonto ab.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">So funktioniert&apos;s:</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      {[
                        'Geben Sie Ihre IBAN ein',
                        'Bestätigen Sie das Lastschriftmandat',
                        'Der Betrag wird nach 2-3 Werktagen abgebucht',
                      ].map((step, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-green-500" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-gray-500">
                    Hinweis: Sie haben 8 Wochen Zeit, eine Lastschrift bei Ihrer Bank zurückzubuchen.
                  </p>
                </div>
              </div>
            </div>

            {/* Sicherheitshinweis */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 p-6">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-green-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Shield size={28} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-green-800 mb-2">Sichere Zahlungsabwicklung</h3>
                  <p className="text-sm text-green-700">
                    Alle Zahlungen werden über verschlüsselte Verbindungen (SSL/TLS) abgewickelt.
                    Ihre sensiblen Daten werden zu keinem Zeitpunkt auf unseren Servern gespeichert.
                    Die Zahlungsabwicklung erfolgt über zertifizierte Payment Service Provider.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                Haben Sie Fragen zu den Zahlungsarten?{' '}
                <Link href="/kontakt" className="text-red-600 hover:underline font-medium">
                  Kontaktieren Sie uns
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
