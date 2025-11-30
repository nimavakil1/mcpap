import Link from 'next/link';
import { ChevronRight, Shield, Eye, Server, Cookie, UserCheck, ShoppingBag, Scale } from 'lucide-react';

export const metadata = {
  title: 'Datenschutz - McPaper',
  description: 'Datenschutzerklärung der McPaper Demo-Plattform',
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors">
            Startseite
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-900 font-medium">Datenschutz</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Datenschutzerklärung</h1>
            <p className="text-gray-500">Informationen zum Schutz Ihrer personenbezogenen Daten</p>
          </div>

          {/* Demo Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8">
            <p className="text-amber-700 font-medium text-center">
              DEMO - Dies ist eine Testumgebung und keine echte Shop-Website.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {/* Section 1 */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Eye size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">1. Datenschutz auf einen Blick</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Allgemeine Hinweise</h3>
                  <p className="text-gray-600">
                    Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen
                    Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen
                    Sie persönlich identifiziert werden können.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Datenerfassung auf dieser Website</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</p>
                      <p className="text-gray-600 text-sm">
                        Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten
                        können Sie dem Impressum dieser Website entnehmen.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Wie erfassen wir Ihre Daten?</p>
                      <p className="text-gray-600 text-sm">
                        Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich
                        z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch
                        oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Server size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">2. Hosting</h2>
              </div>
              <div className="text-gray-600 space-y-3">
                <p>
                  Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
                </p>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-semibold text-gray-900 mb-2">Externes Hosting</p>
                  <p className="text-sm">
                    Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst
                    werden, werden auf den Servern des Hosters gespeichert.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Shield size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">3. Allgemeine Hinweise und Pflichtinformationen</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Datenschutz</h3>
                  <p className="text-gray-600">
                    Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln
                    Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften
                    sowie dieser Datenschutzerklärung.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Hinweis zur verantwortlichen Stelle</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-600 text-sm">
                      Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
                    </p>
                    <div className="mt-3 text-gray-900">
                      <p className="font-medium">McPaper AG (Demo)</p>
                      <p>Musterstraße 123</p>
                      <p>10115 Berlin</p>
                      <p className="mt-2">
                        <span className="text-gray-500">E-Mail:</span> datenschutz@mcpaper-demo.de
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Cookie size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">4. Datenerfassung auf dieser Website</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies</h3>
                  <p className="text-gray-600">
                    Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Datenpakete und richten
                    auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung
                    (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Kontaktformular</h3>
                  <p className="text-gray-600">
                    Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem
                    Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der
                    Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Registrierung auf dieser Website</h3>
                  <p className="text-gray-600">
                    Sie können sich auf dieser Website registrieren, um zusätzliche Funktionen auf der Seite zu nutzen.
                    Die dazu eingegebenen Daten verwenden wir nur zum Zwecke der Nutzung des jeweiligen Angebotes oder
                    Dienstes, für den Sie sich registriert haben.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">5. E-Commerce und Zahlungsanbieter</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Verarbeiten von Kunden- und Vertragsdaten</h3>
                  <p className="text-gray-600">
                    Wir erheben, verarbeiten und nutzen personenbezogene Kunden- und Vertragsdaten zur Begründung,
                    inhaltlichen Ausgestaltung und Änderung unserer Vertragsbeziehungen.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Zahlungsdienste</h3>
                  <p className="text-gray-600">
                    Wir binden Zahlungsdienste von Drittunternehmen auf unserer Website ein. Wenn Sie einen Kauf bei
                    uns tätigen, werden Ihre Zahlungsdaten (z. B. Name, Zahlungssumme, Kontoverbindung, Kreditkartennummer)
                    vom Zahlungsdienstleister zum Zwecke der Zahlungsabwicklung verarbeitet.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Scale size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">6. Ihre Rechte</h2>
              </div>

              <div className="text-gray-600 space-y-3">
                <p>
                  Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer
                  gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung
                  oder Löschung dieser Daten zu verlangen.
                </p>
                <p>
                  Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                  {[
                    { title: 'Auskunft', desc: 'Über gespeicherte Daten' },
                    { title: 'Berichtigung', desc: 'Falscher Daten' },
                    { title: 'Löschung', desc: 'Ihrer Daten' },
                    { title: 'Widerspruch', desc: 'Gegen Verarbeitung' },
                  ].map((right) => (
                    <div key={right.title} className="bg-green-50 rounded-xl p-4 text-center">
                      <p className="font-semibold text-green-700">{right.title}</p>
                      <p className="text-xs text-green-600 mt-1">{right.desc}</p>
                    </div>
                  ))}
                </div>
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
