import Link from 'next/link';
import { ChevronRight, FileText, Scale, ShoppingCart, Truck, CreditCard, Shield, Users, Gift, Gavel } from 'lucide-react';

export const metadata = {
  title: 'AGB - McPaper',
  description: 'Allgemeine Geschäftsbedingungen der McPaper Demo-Plattform',
};

export default function AGBPage() {
  const sections = [
    { id: 'geltungsbereich', title: '§ 1 Geltungsbereich', icon: Scale },
    { id: 'vertragsschluss', title: '§ 2 Vertragsschluss', icon: ShoppingCart },
    { id: 'preise', title: '§ 3 Preise und Versandkosten', icon: CreditCard },
    { id: 'lieferung', title: '§ 4 Lieferung', icon: Truck },
    { id: 'zahlung', title: '§ 5 Zahlung', icon: CreditCard },
    { id: 'eigentumsvorbehalt', title: '§ 6 Eigentumsvorbehalt', icon: Shield },
    { id: 'gewaehrleistung', title: '§ 7 Gewährleistung', icon: Shield },
    { id: 'haftung', title: '§ 8 Haftung', icon: Gavel },
    { id: 'kundengruppen', title: '§ 9 Kundengruppen und Rabatte', icon: Users },
    { id: 'gutscheine', title: '§ 10 Filialgutscheine', icon: Gift },
    { id: 'schlussbestimmungen', title: '§ 11 Schlussbestimmungen', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors">
            Startseite
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-900 font-medium">AGB</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Allgemeine Geschäftsbedingungen</h1>
            <p className="text-gray-500">Gültig für alle Bestellungen über unseren Online-Shop</p>
          </div>

          {/* Demo Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8">
            <p className="text-amber-700 font-medium text-center">
              DEMO - Dies ist eine Testumgebung und keine echte Shop-Website.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-4">Schnellnavigation</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <section.icon size={14} />
                  <span className="truncate">{section.title.split(' ').slice(0, 2).join(' ')}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {/* § 1 */}
            <section id="geltungsbereich" className="bg-white rounded-2xl border border-gray-100 p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Scale size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">§ 1 Geltungsbereich</h2>
              </div>
              <div className="prose prose-gray max-w-none space-y-3 text-gray-600">
                <p>
                  (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten für alle Verträge, die zwischen
                  der McPaper AG (Demo), Musterstraße 123, 10115 Berlin (nachfolgend „Verkäufer") und dem Kunden
                  (nachfolgend „Käufer") über den Online-Shop des Verkäufers geschlossen werden.
                </p>
                <p>
                  (2) Abweichende Bedingungen des Käufers werden nicht anerkannt, es sei denn, der Verkäufer stimmt
                  ihrer Geltung ausdrücklich schriftlich zu.
                </p>
              </div>
            </section>

            {/* § 2 */}
            <section id="vertragsschluss" className="bg-white rounded-2xl border border-gray-100 p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <ShoppingCart size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">§ 2 Vertragsschluss</h2>
              </div>
              <div className="prose prose-gray max-w-none space-y-3 text-gray-600">
                <p>
                  (1) Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, sondern
                  eine Aufforderung zur Bestellung dar.
                </p>
                <p>
                  (2) Durch Anklicken des Buttons „Zahlungspflichtig bestellen" gibt der Käufer ein verbindliches
                  Angebot zum Kauf der im Warenkorb enthaltenen Waren ab.
                </p>
                <p>
                  (3) Der Verkäufer bestätigt den Eingang der Bestellung unverzüglich per E-Mail. Diese
                  Bestellbestätigung stellt die Annahme des Angebots dar.
                </p>
              </div>
            </section>

            {/* § 3 */}
            <section id="preise" className="bg-white rounded-2xl border border-gray-100 p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <CreditCard size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">§ 3 Preise und Versandkosten</h2>
              </div>
              <div className="prose prose-gray max-w-none space-y-3 text-gray-600">
                <p>
                  (1) Alle Preise sind Nettopreise und verstehen sich zuzüglich der gesetzlichen Mehrwertsteuer.
                </p>
                <p>
                  (2) Die Versandkosten werden dem Käufer im Bestellvorgang und vor Abgabe der Bestellung mitgeteilt.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 not-prose">
                  <p className="text-green-700 font-medium">
                    (3) Ab einem Bestellwert von 50,00 € erfolgt die Lieferung innerhalb Deutschlands versandkostenfrei.
                  </p>
                </div>
              </div>
            </section>

            {/* § 4 */}
            <section id="lieferung" className="bg-white rounded-2xl border border-gray-100 p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Truck size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">§ 4 Lieferung</h2>
              </div>
              <div className="prose prose-gray max-w-none space-y-3 text-gray-600">
                <p>
                  (1) Die Lieferung erfolgt innerhalb von 2-3 Werktagen nach Zahlungseingang.
                </p>
                <p>
                  (2) Lieferungen erfolgen nur innerhalb Deutschlands, Österreichs und der Schweiz.
                </p>
                <p>
                  (3) Sollte die bestellte Ware nicht lieferbar sein, wird der Käufer unverzüglich informiert.
                  Bereits geleistete Zahlungen werden in diesem Fall unverzüglich erstattet.
                </p>
              </div>
            </section>

            {/* § 5 */}
            <section id="zahlung" className="bg-white rounded-2xl border border-gray-100 p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <CreditCard size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">§ 5 Zahlung</h2>
              </div>
              <div className="prose prose-gray max-w-none space-y-3 text-gray-600">
                <p>
                  (1) Die Zahlung kann per Rechnung, Kreditkarte, PayPal oder SEPA-Lastschrift erfolgen.
                </p>
                <p>
                  (2) Bei Zahlung per Rechnung ist der Rechnungsbetrag innerhalb von 14 Tagen nach Erhalt der Ware
                  ohne Abzug zu zahlen.
                </p>
                <p>
                  (3) Kommt der Käufer in Zahlungsverzug, ist der Verkäufer berechtigt, Verzugszinsen in Höhe von
                  9 Prozentpunkten über dem Basiszinssatz zu verlangen.
                </p>
              </div>
            </section>

            {/* § 6 */}
            <section id="eigentumsvorbehalt" className="bg-white rounded-2xl border border-gray-100 p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Shield size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">§ 6 Eigentumsvorbehalt</h2>
              </div>
              <div className="prose prose-gray max-w-none text-gray-600">
                <p>
                  Die Ware bleibt bis zur vollständigen Bezahlung Eigentum des Verkäufers.
                </p>
              </div>
            </section>

            {/* § 7 */}
            <section id="gewaehrleistung" className="bg-white rounded-2xl border border-gray-100 p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Shield size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">§ 7 Gewährleistung</h2>
              </div>
              <div className="prose prose-gray max-w-none space-y-3 text-gray-600">
                <p>
                  (1) Es gelten die gesetzlichen Gewährleistungsrechte.
                </p>
                <p>
                  (2) Als Verbraucher haben Sie das Recht, innerhalb von zwei Jahren nach Erhalt der Ware Mängelansprüche
                  geltend zu machen.
                </p>
              </div>
            </section>

            {/* § 8 */}
            <section id="haftung" className="bg-white rounded-2xl border border-gray-100 p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Gavel size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">§ 8 Haftung</h2>
              </div>
              <div className="prose prose-gray max-w-none space-y-3 text-gray-600">
                <p>
                  (1) Der Verkäufer haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit.
                </p>
                <p>
                  (2) Bei leichter Fahrlässigkeit haftet der Verkäufer nur bei Verletzung wesentlicher Vertragspflichten
                  und der Höhe nach begrenzt auf die bei Vertragsschluss vorhersehbaren typischen Schäden.
                </p>
              </div>
            </section>

            {/* § 9 */}
            <section id="kundengruppen" className="bg-white rounded-2xl border border-gray-100 p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Users size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">§ 9 Kundengruppen und Rabatte</h2>
              </div>
              <div className="prose prose-gray max-w-none space-y-3 text-gray-600">
                <p>
                  (1) Der Verkäufer kann Käufern verschiedenen Kundengruppen zuordnen, die unterschiedliche Rabatte
                  auf den Nettopreis erhalten.
                </p>
                <p>(2) Die Rabattstufen sind wie folgt gestaffelt:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 not-prose my-4">
                  {[
                    { name: 'Standard', discount: '0%', color: 'gray' },
                    { name: 'Silber', discount: '5%', color: 'gray' },
                    { name: 'Gold', discount: '10%', color: 'amber' },
                    { name: 'Platin', discount: '15%', color: 'purple' },
                  ].map((tier) => (
                    <div key={tier.name} className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="font-semibold text-gray-900">{tier.name}</p>
                      <p className="text-2xl font-bold text-red-600">{tier.discount}</p>
                      <p className="text-xs text-gray-500">Rabatt</p>
                    </div>
                  ))}
                </div>
                <p>
                  (3) Die Zuordnung zu einer Kundengruppe erfolgt nach Ermessen des Verkäufers basierend auf dem
                  Bestellvolumen und der Geschäftsbeziehung.
                </p>
              </div>
            </section>

            {/* § 10 */}
            <section id="gutscheine" className="bg-white rounded-2xl border border-gray-100 p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Gift size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">§ 10 Filialgutscheine</h2>
              </div>
              <div className="prose prose-gray max-w-none space-y-3 text-gray-600">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 not-prose mb-4">
                  <p className="text-amber-800">
                    <strong>Bonus-Programm:</strong> Bei Online-Bestellungen ab einem Warenwert von 100,00 € erhält der Käufer einen Filialgutschein
                    im Wert von 5,00 €. Ab einem Warenwert von 150,00 € beträgt der Gutscheinwert 10,00 €.
                  </p>
                </div>
                <p>
                  (2) Der Filialgutschein ist 6 Monate ab Ausstellungsdatum gültig und nur in den teilnehmenden
                  McPaper Filialen einlösbar.
                </p>
                <p>
                  (3) Eine Barauszahlung ist nicht möglich.
                </p>
              </div>
            </section>

            {/* § 11 */}
            <section id="schlussbestimmungen" className="bg-white rounded-2xl border border-gray-100 p-6 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <FileText size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">§ 11 Schlussbestimmungen</h2>
              </div>
              <div className="prose prose-gray max-w-none space-y-3 text-gray-600">
                <p>
                  (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
                </p>
                <p>
                  (2) Erfüllungsort und Gerichtsstand ist Berlin.
                </p>
                <p>
                  (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen
                  Bestimmungen unberührt.
                </p>
              </div>
            </section>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 pt-6">
              Stand: November 2024
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
