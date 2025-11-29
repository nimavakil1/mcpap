import Link from 'next/link';
import { ChevronRight, CreditCard, FileText, Wallet, Building2, Shield } from 'lucide-react';

export const metadata = {
  title: 'Zahlungsarten - McPaper',
  description: 'Verfügbare Zahlungsarten bei McPaper',
};

export default function ZahlungsartenPage() {
  return (
    <div className="container py-6">
      <nav className="breadcrumb mb-6">
        <Link href="/">Startseite</Link>
        <ChevronRight size={16} className="breadcrumb-separator" />
        <span className="text-[#1A1A1A] font-medium">Zahlungsarten</span>
      </nav>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Zahlungsarten</h1>

        <div className="bg-[#FF6B00]/10 border border-[#FF6B00] rounded-lg p-4 mb-8">
          <p className="text-[#FF6B00] font-medium">
            ⚠️ DEMO - Dies ist eine Testumgebung und keine echte Shop-Website.
          </p>
        </div>

        <p className="text-[#666] mb-8">
          Bei McPaper bieten wir Ihnen verschiedene sichere Zahlungsmöglichkeiten an. Wählen Sie einfach
          Ihre bevorzugte Zahlungsart im Checkout-Prozess aus.
        </p>

        <div className="space-y-6">
          {/* Rechnung */}
          <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#E31E24]/10 rounded-lg">
                <FileText size={28} className="text-[#E31E24]" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold mb-2">Rechnung</h2>
                <p className="text-[#666] mb-4">
                  Bezahlen Sie bequem nach Erhalt der Ware. Die Rechnung liegt Ihrer Lieferung bei.
                </p>
                <div className="bg-[#F5F5F5] rounded p-4">
                  <h4 className="font-medium mb-2">So funktioniert&apos;s:</h4>
                  <ul className="text-sm text-[#666] space-y-1">
                    <li>• Wählen Sie „Rechnung" als Zahlungsart</li>
                    <li>• Wir versenden Ihre Bestellung sofort</li>
                    <li>• Bezahlen Sie innerhalb von 14 Tagen nach Erhalt</li>
                    <li>• Bankverbindung finden Sie auf der Rechnung</li>
                  </ul>
                </div>
                <p className="text-sm text-[#28A745] mt-3 font-medium">
                  ✓ Verfügbar für registrierte Geschäftskunden
                </p>
              </div>
            </div>
          </div>

          {/* Kreditkarte */}
          <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#E31E24]/10 rounded-lg">
                <CreditCard size={28} className="text-[#E31E24]" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold mb-2">Kreditkarte</h2>
                <p className="text-[#666] mb-4">
                  Bezahlen Sie schnell und sicher mit Ihrer Kreditkarte. Wir akzeptieren alle gängigen Kreditkarten.
                </p>
                <div className="flex gap-3 mb-4">
                  <div className="px-3 py-2 bg-[#F5F5F5] rounded text-sm font-medium">Visa</div>
                  <div className="px-3 py-2 bg-[#F5F5F5] rounded text-sm font-medium">Mastercard</div>
                  <div className="px-3 py-2 bg-[#F5F5F5] rounded text-sm font-medium">American Express</div>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#666]">
                  <Shield size={16} className="text-[#28A745]" />
                  SSL-verschlüsselte Übertragung
                </div>
              </div>
            </div>
          </div>

          {/* PayPal */}
          <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#E31E24]/10 rounded-lg">
                <Wallet size={28} className="text-[#E31E24]" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold mb-2">PayPal</h2>
                <p className="text-[#666] mb-4">
                  Zahlen Sie schnell und sicher mit Ihrem PayPal-Konto. Sie werden während des
                  Bestellvorgangs zu PayPal weitergeleitet.
                </p>
                <div className="bg-[#F5F5F5] rounded p-4">
                  <h4 className="font-medium mb-2">Ihre Vorteile:</h4>
                  <ul className="text-sm text-[#666] space-y-1">
                    <li>• Käuferschutz inklusive</li>
                    <li>• Keine Eingabe von Bankdaten erforderlich</li>
                    <li>• Schnelle Zahlung mit nur wenigen Klicks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* SEPA */}
          <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#E31E24]/10 rounded-lg">
                <Building2 size={28} className="text-[#E31E24]" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold mb-2">SEPA-Lastschrift</h2>
                <p className="text-[#666] mb-4">
                  Erteilen Sie uns ein SEPA-Lastschriftmandat und wir buchen den Betrag bequem von Ihrem
                  Bankkonto ab.
                </p>
                <div className="bg-[#F5F5F5] rounded p-4">
                  <h4 className="font-medium mb-2">So funktioniert&apos;s:</h4>
                  <ul className="text-sm text-[#666] space-y-1">
                    <li>• Geben Sie Ihre IBAN ein</li>
                    <li>• Bestätigen Sie das Lastschriftmandat</li>
                    <li>• Der Betrag wird nach 2-3 Werktagen abgebucht</li>
                  </ul>
                </div>
                <p className="text-sm text-[#666] mt-3">
                  Hinweis: Sie haben 8 Wochen Zeit, eine Lastschrift bei Ihrer Bank zurückzubuchen.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sicherheitshinweis */}
        <div className="mt-8 bg-[#28A745]/10 border border-[#28A745] rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Shield size={28} className="text-[#28A745] flex-shrink-0" />
            <div>
              <h3 className="font-bold text-[#28A745] mb-2">Sichere Zahlungsabwicklung</h3>
              <p className="text-sm text-[#666]">
                Alle Zahlungen werden über verschlüsselte Verbindungen (SSL/TLS) abgewickelt.
                Ihre sensiblen Daten werden zu keinem Zeitpunkt auf unseren Servern gespeichert.
                Die Zahlungsabwicklung erfolgt über zertifizierte Payment Service Provider.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#666]">
            Haben Sie Fragen zu den Zahlungsarten?{' '}
            <Link href="/kontakt" className="text-[#E31E24] hover:underline">
              Kontaktieren Sie uns
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
