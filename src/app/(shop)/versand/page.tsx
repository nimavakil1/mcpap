import Link from 'next/link';
import { ChevronRight, Truck, Package, Clock, MapPin, Euro, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Versand & Lieferung - McPaper',
  description: 'Informationen zu Versand und Lieferung bei McPaper',
};

export default function VersandPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors">
            Startseite
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-900 font-medium">Versand & Lieferung</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Truck size={32} className="text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Versand & Lieferung</h1>
            <p className="text-gray-500">Schnell, zuverlässig und transparent</p>
          </div>

          {/* Demo Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8">
            <p className="text-amber-700 font-medium text-center">
              DEMO - Dies ist eine Testumgebung und keine echte Shop-Website.
            </p>
          </div>

          {/* Highlights */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Euro, title: 'Kostenloser Versand', desc: 'Ab 50€ Bestellwert innerhalb Deutschlands' },
              { icon: Clock, title: 'Schnelle Lieferung', desc: '2-3 Werktage nach Zahlungseingang' },
              { icon: MapPin, title: 'DACH-Region', desc: 'Lieferung nach DE, AT und CH' },
            ].map((highlight) => (
              <div
                key={highlight.title}
                className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg hover:shadow-gray-200/50 transition-all group"
              >
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600 transition-colors">
                  <highlight.icon size={28} className="text-red-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{highlight.title}</h3>
                <p className="text-sm text-gray-600">{highlight.desc}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {/* Versandkosten */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Truck size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Versandkosten</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Land</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Versandkosten</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Kostenlos ab</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { country: 'Deutschland', cost: '4,95 €', free: '50,00 €' },
                      { country: 'Österreich', cost: '9,95 €', free: '100,00 €' },
                      { country: 'Schweiz', cost: '14,95 €', free: '150,00 €' },
                    ].map((row) => (
                      <tr key={row.country} className="border-b border-gray-50">
                        <td className="py-4 px-4 text-gray-900">{row.country}</td>
                        <td className="py-4 px-4 text-gray-600">{row.cost}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                            <CheckCircle size={16} />
                            {row.free}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                * Alle Preise inkl. MwSt. Bei Lieferungen in die Schweiz können zusätzliche Zoll- und Importgebühren anfallen.
              </p>
            </section>

            {/* Lieferzeiten */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Clock size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Lieferzeiten</h2>
              </div>

              <div className="space-y-4">
                {[
                  { country: 'Deutschland', time: '2-3 Werktage nach Zahlungseingang' },
                  { country: 'Österreich', time: '3-5 Werktage nach Zahlungseingang' },
                  { country: 'Schweiz', time: '5-7 Werktage nach Zahlungseingang' },
                ].map((item) => (
                  <div key={item.country} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-gray-900">{item.country}</p>
                      <p className="text-sm text-gray-600">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Versandpartner */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Package size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Versandpartner</h2>
              </div>

              <p className="text-gray-600 mb-4">
                Wir versenden Ihre Bestellung mit folgenden Logistikpartnern:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: 'DHL', desc: 'Standardversand' },
                  { name: 'DPD', desc: 'Geschäftskunden' },
                  { name: 'UPS', desc: 'Express' },
                  { name: 'Spedition', desc: 'Großbestellungen' },
                ].map((partner) => (
                  <div key={partner.name} className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="font-semibold text-gray-900">{partner.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{partner.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Sendungsverfolgung */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <MapPin size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Sendungsverfolgung</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Nach dem Versand Ihrer Bestellung erhalten Sie eine E-Mail mit der Sendungsverfolgungsnummer.
                Mit dieser können Sie den aktuellen Status Ihrer Lieferung jederzeit online verfolgen.
              </p>
              <p className="text-sm text-gray-500">
                Sie können Ihre Bestellungen und deren Status auch jederzeit in Ihrem{' '}
                <Link href="/konto/bestellungen" className="text-red-600 hover:underline font-medium">
                  Kundenkonto
                </Link>{' '}
                einsehen.
              </p>
            </section>

            {/* Wichtige Hinweise */}
            <section className="bg-gray-900 rounded-2xl p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Wichtige Hinweise</h2>
              <ul className="space-y-3 text-sm text-white/80">
                {[
                  'Bei Bestellungen nach 14:00 Uhr beginnt die Bearbeitung am nächsten Werktag.',
                  'An Wochenenden und Feiertagen erfolgt kein Versand.',
                  'Bei Vorkasse beginnt die Lieferzeit nach Zahlungseingang auf unserem Konto.',
                  'Die angegebenen Lieferzeiten sind Richtwerte und können in Ausnahmefällen abweichen.',
                ].map((note, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
