import Link from 'next/link';
import { ChevronRight, Truck, Package, Clock, MapPin, Euro } from 'lucide-react';

export const metadata = {
  title: 'Versand & Lieferung - McPaper',
  description: 'Informationen zu Versand und Lieferung bei McPaper',
};

export default function VersandPage() {
  return (
    <div className="container py-6">
      <nav className="breadcrumb mb-6">
        <Link href="/">Startseite</Link>
        <ChevronRight size={16} className="breadcrumb-separator" />
        <span className="text-[#1A1A1A] font-medium">Versand & Lieferung</span>
      </nav>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Versand & Lieferung</h1>

        <div className="bg-[#FF6B00]/10 border border-[#FF6B00] rounded-lg p-4 mb-8">
          <p className="text-[#FF6B00] font-medium">
            ⚠️ DEMO - Dies ist eine Testumgebung und keine echte Shop-Website.
          </p>
        </div>

        {/* Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-[#E0E0E0] rounded-lg p-6 text-center">
            <Euro size={40} className="mx-auto text-[#E31E24] mb-4" />
            <h3 className="font-bold mb-2">Kostenloser Versand</h3>
            <p className="text-sm text-[#666]">Ab 50€ Bestellwert innerhalb Deutschlands</p>
          </div>
          <div className="bg-white border border-[#E0E0E0] rounded-lg p-6 text-center">
            <Clock size={40} className="mx-auto text-[#E31E24] mb-4" />
            <h3 className="font-bold mb-2">Schnelle Lieferung</h3>
            <p className="text-sm text-[#666]">2-3 Werktage nach Zahlungseingang</p>
          </div>
          <div className="bg-white border border-[#E0E0E0] rounded-lg p-6 text-center">
            <MapPin size={40} className="mx-auto text-[#E31E24] mb-4" />
            <h3 className="font-bold mb-2">DACH-Region</h3>
            <p className="text-sm text-[#666]">Lieferung nach DE, AT und CH</p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Truck size={24} className="text-[#E31E24]" />
              Versandkosten
            </h2>
            <div className="bg-white border border-[#E0E0E0] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F5F5F5]">
                  <tr>
                    <th className="text-left p-4 font-semibold">Land</th>
                    <th className="text-left p-4 font-semibold">Versandkosten</th>
                    <th className="text-left p-4 font-semibold">Kostenlos ab</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[#E0E0E0]">
                    <td className="p-4">Deutschland</td>
                    <td className="p-4">4,95 €</td>
                    <td className="p-4 text-[#28A745] font-medium">50,00 €</td>
                  </tr>
                  <tr className="border-t border-[#E0E0E0]">
                    <td className="p-4">Österreich</td>
                    <td className="p-4">9,95 €</td>
                    <td className="p-4 text-[#28A745] font-medium">100,00 €</td>
                  </tr>
                  <tr className="border-t border-[#E0E0E0]">
                    <td className="p-4">Schweiz</td>
                    <td className="p-4">14,95 €</td>
                    <td className="p-4 text-[#28A745] font-medium">150,00 €</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-[#666] mt-2">
              * Alle Preise inkl. MwSt. Bei Lieferungen in die Schweiz können zusätzliche Zoll- und Importgebühren anfallen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock size={24} className="text-[#E31E24]" />
              Lieferzeiten
            </h2>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#E31E24] rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Deutschland</p>
                    <p className="text-sm text-[#666]">2-3 Werktage nach Zahlungseingang</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#E31E24] rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Österreich</p>
                    <p className="text-sm text-[#666]">3-5 Werktage nach Zahlungseingang</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#E31E24] rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Schweiz</p>
                    <p className="text-sm text-[#666]">5-7 Werktage nach Zahlungseingang</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package size={24} className="text-[#E31E24]" />
              Versandpartner
            </h2>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
              <p>
                Wir versenden Ihre Bestellung mit folgenden Logistikpartnern:
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#E31E24] rounded-full"></span>
                  DHL (Standardversand Deutschland)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#E31E24] rounded-full"></span>
                  DPD (Geschäftskundenversand)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#E31E24] rounded-full"></span>
                  UPS (Express-Lieferungen)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#E31E24] rounded-full"></span>
                  Spedition (bei Großbestellungen)
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Sendungsverfolgung</h2>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
              <p>
                Nach dem Versand Ihrer Bestellung erhalten Sie eine E-Mail mit der Sendungsverfolgungsnummer.
                Mit dieser können Sie den aktuellen Status Ihrer Lieferung jederzeit online verfolgen.
              </p>
              <p className="mt-4 text-sm text-[#666]">
                Sie können Ihre Bestellungen und deren Status auch jederzeit in Ihrem{' '}
                <Link href="/konto/bestellungen" className="text-[#E31E24] hover:underline">
                  Kundenkonto
                </Link>{' '}
                einsehen.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Wichtige Hinweise</h2>
            <div className="bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg p-6">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-[#E31E24]">•</span>
                  <span>
                    Bei Bestellungen nach 14:00 Uhr beginnt die Bearbeitung am nächsten Werktag.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#E31E24]">•</span>
                  <span>
                    An Wochenenden und Feiertagen erfolgt kein Versand.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#E31E24]">•</span>
                  <span>
                    Bei Vorkasse beginnt die Lieferzeit nach Zahlungseingang auf unserem Konto.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#E31E24]">•</span>
                  <span>
                    Die angegebenen Lieferzeiten sind Richtwerte und können in Ausnahmefällen abweichen.
                  </span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
