import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Impressum - McPaper',
  description: 'Impressum und rechtliche Informationen der McPaper Demo-Plattform',
};

export default function ImpressumPage() {
  return (
    <div className="container py-6">
      <nav className="breadcrumb mb-6">
        <Link href="/">Startseite</Link>
        <ChevronRight size={16} className="breadcrumb-separator" />
        <span className="text-[#1A1A1A] font-medium">Impressum</span>
      </nav>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Impressum</h1>

        <div className="prose max-w-none space-y-8">
          <div className="bg-[#FF6B00]/10 border border-[#FF6B00] rounded-lg p-4 mb-8">
            <p className="text-[#FF6B00] font-medium">
              ⚠️ DEMO - Dies ist eine Testumgebung und keine echte Shop-Website.
            </p>
          </div>

          <section>
            <h2 className="text-xl font-bold mb-4">Angaben gemäß § 5 TMG</h2>
            <p>
              McPaper AG (Demo)<br />
              Musterstraße 123<br />
              10115 Berlin<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Vertreten durch</h2>
            <p>
              Vorstand: Max Mustermann (Vorsitzender), Erika Musterfrau<br />
              Aufsichtsratsvorsitzender: Hans Beispiel
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Kontakt</h2>
            <p>
              Telefon: +49 (0) 30 123456-0<br />
              Telefax: +49 (0) 30 123456-99<br />
              E-Mail: info@mcpaper-demo.de
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Registereintrag</h2>
            <p>
              Eintragung im Handelsregister<br />
              Registergericht: Amtsgericht Berlin-Charlottenburg<br />
              Registernummer: HRB 12345 B
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Umsatzsteuer-ID</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
              DE 123456789
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>
              Max Mustermann<br />
              Musterstraße 123<br />
              10115 Berlin
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-[#E31E24] hover:underline">
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p className="mt-2">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
              allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
              verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen
              zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Haftung für Links</h2>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
              Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
              verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
              Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
              Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
