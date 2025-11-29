import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Datenschutz - McPaper',
  description: 'Datenschutzerklärung der McPaper Demo-Plattform',
};

export default function DatenschutzPage() {
  return (
    <div className="container py-6">
      <nav className="breadcrumb mb-6">
        <Link href="/">Startseite</Link>
        <ChevronRight size={16} className="breadcrumb-separator" />
        <span className="text-[#1A1A1A] font-medium">Datenschutz</span>
      </nav>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>

        <div className="prose max-w-none space-y-8">
          <div className="bg-[#FF6B00]/10 border border-[#FF6B00] rounded-lg p-4 mb-8">
            <p className="text-[#FF6B00] font-medium">
              ⚠️ DEMO - Dies ist eine Testumgebung und keine echte Shop-Website.
            </p>
          </div>

          <section>
            <h2 className="text-xl font-bold mb-4">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-lg font-semibold mt-4 mb-2">Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen
              Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen
              Sie persönlich identifiziert werden können.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Datenerfassung auf dieser Website</h3>
            <p className="font-medium">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</p>
            <p>
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten
              können Sie dem Impressum dieser Website entnehmen.
            </p>

            <p className="font-medium mt-4">Wie erfassen wir Ihre Daten?</p>
            <p>
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich
              z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch
              oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">2. Hosting</h2>
            <p>
              Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
            </p>
            <p className="mt-2">
              <strong>Externes Hosting</strong><br />
              Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst
              werden, werden auf den Servern des Hosters gespeichert.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">3. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3 className="text-lg font-semibold mt-4 mb-2">Datenschutz</h3>
            <p>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln
              Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften
              sowie dieser Datenschutzerklärung.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Hinweis zur verantwortlichen Stelle</h3>
            <p>
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br /><br />
              McPaper AG (Demo)<br />
              Musterstraße 123<br />
              10115 Berlin<br />
              E-Mail: datenschutz@mcpaper-demo.de
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">4. Datenerfassung auf dieser Website</h2>
            <h3 className="text-lg font-semibold mt-4 mb-2">Cookies</h3>
            <p>
              Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Datenpakete und richten
              auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung
              (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Kontaktformular</h3>
            <p>
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem
              Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der
              Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Registrierung auf dieser Website</h3>
            <p>
              Sie können sich auf dieser Website registrieren, um zusätzliche Funktionen auf der Seite zu nutzen.
              Die dazu eingegebenen Daten verwenden wir nur zum Zwecke der Nutzung des jeweiligen Angebotes oder
              Dienstes, für den Sie sich registriert haben.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">5. E-Commerce und Zahlungsanbieter</h2>
            <h3 className="text-lg font-semibold mt-4 mb-2">Verarbeiten von Kunden- und Vertragsdaten</h3>
            <p>
              Wir erheben, verarbeiten und nutzen personenbezogene Kunden- und Vertragsdaten zur Begründung,
              inhaltlichen Ausgestaltung und Änderung unserer Vertragsbeziehungen.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Zahlungsdienste</h3>
            <p>
              Wir binden Zahlungsdienste von Drittunternehmen auf unserer Website ein. Wenn Sie einen Kauf bei
              uns tätigen, werden Ihre Zahlungsdaten (z. B. Name, Zahlungssumme, Kontoverbindung, Kreditkartennummer)
              vom Zahlungsdienstleister zum Zwecke der Zahlungsabwicklung verarbeitet.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">6. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer
              gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung
              oder Löschung dieser Daten zu verlangen.
            </p>
            <p className="mt-2">
              Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.
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
