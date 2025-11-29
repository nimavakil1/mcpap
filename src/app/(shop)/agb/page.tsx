import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'AGB - McPaper',
  description: 'Allgemeine Geschäftsbedingungen der McPaper Demo-Plattform',
};

export default function AGBPage() {
  return (
    <div className="container py-6">
      <nav className="breadcrumb mb-6">
        <Link href="/">Startseite</Link>
        <ChevronRight size={16} className="breadcrumb-separator" />
        <span className="text-[#1A1A1A] font-medium">AGB</span>
      </nav>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Allgemeine Geschäftsbedingungen</h1>

        <div className="prose max-w-none space-y-8">
          <div className="bg-[#FF6B00]/10 border border-[#FF6B00] rounded-lg p-4 mb-8">
            <p className="text-[#FF6B00] font-medium">
              ⚠️ DEMO - Dies ist eine Testumgebung und keine echte Shop-Website.
            </p>
          </div>

          <section>
            <h2 className="text-xl font-bold mb-4">§ 1 Geltungsbereich</h2>
            <p>
              (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten für alle Verträge, die zwischen
              der McPaper AG (Demo), Musterstraße 123, 10115 Berlin (nachfolgend „Verkäufer") und dem Kunden
              (nachfolgend „Käufer") über den Online-Shop des Verkäufers geschlossen werden.
            </p>
            <p>
              (2) Abweichende Bedingungen des Käufers werden nicht anerkannt, es sei denn, der Verkäufer stimmt
              ihrer Geltung ausdrücklich schriftlich zu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">§ 2 Vertragsschluss</h2>
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
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">§ 3 Preise und Versandkosten</h2>
            <p>
              (1) Alle Preise sind Nettopreise und verstehen sich zuzüglich der gesetzlichen Mehrwertsteuer.
            </p>
            <p>
              (2) Die Versandkosten werden dem Käufer im Bestellvorgang und vor Abgabe der Bestellung mitgeteilt.
            </p>
            <p>
              (3) Ab einem Bestellwert von 50,00 € erfolgt die Lieferung innerhalb Deutschlands versandkostenfrei.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">§ 4 Lieferung</h2>
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
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">§ 5 Zahlung</h2>
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
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">§ 6 Eigentumsvorbehalt</h2>
            <p>
              Die Ware bleibt bis zur vollständigen Bezahlung Eigentum des Verkäufers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">§ 7 Gewährleistung</h2>
            <p>
              (1) Es gelten die gesetzlichen Gewährleistungsrechte.
            </p>
            <p>
              (2) Als Verbraucher haben Sie das Recht, innerhalb von zwei Jahren nach Erhalt der Ware Mängelansprüche
              geltend zu machen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">§ 8 Haftung</h2>
            <p>
              (1) Der Verkäufer haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit.
            </p>
            <p>
              (2) Bei leichter Fahrlässigkeit haftet der Verkäufer nur bei Verletzung wesentlicher Vertragspflichten
              und der Höhe nach begrenzt auf die bei Vertragsschluss vorhersehbaren typischen Schäden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">§ 9 Kundengruppen und Rabatte</h2>
            <p>
              (1) Der Verkäufer kann Käufern verschiedenen Kundengruppen zuordnen, die unterschiedliche Rabatte
              auf den Nettopreis erhalten.
            </p>
            <p>
              (2) Die Rabattstufen sind wie folgt gestaffelt:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Standard: 0% Rabatt</li>
              <li>Silber: 5% Rabatt</li>
              <li>Gold: 10% Rabatt</li>
              <li>Platin: 15% Rabatt</li>
            </ul>
            <p>
              (3) Die Zuordnung zu einer Kundengruppe erfolgt nach Ermessen des Verkäufers basierend auf dem
              Bestellvolumen und der Geschäftsbeziehung.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">§ 10 Filialgutscheine</h2>
            <p>
              (1) Bei Online-Bestellungen ab einem Warenwert von 100,00 € erhält der Käufer einen Filialgutschein
              im Wert von 5,00 €. Ab einem Warenwert von 150,00 € beträgt der Gutscheinwert 10,00 €.
            </p>
            <p>
              (2) Der Filialgutschein ist 6 Monate ab Ausstellungsdatum gültig und nur in den teilnehmenden
              McPaper Filialen einlösbar.
            </p>
            <p>
              (3) Eine Barauszahlung ist nicht möglich.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">§ 11 Schlussbestimmungen</h2>
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
          </section>

          <section>
            <p className="text-sm text-[#666]">
              Stand: November 2024
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
