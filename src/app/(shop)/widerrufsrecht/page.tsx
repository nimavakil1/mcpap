import Link from 'next/link';
import { ChevronRight, RotateCcw, Clock, AlertCircle, FileText, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Widerrufsrecht - McPaper',
  description: 'Widerrufsbelehrung der McPaper Demo-Plattform',
};

export default function WiderrufsrechtPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors">
            Startseite
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-900 font-medium">Widerrufsrecht</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <RotateCcw size={32} className="text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Widerrufsbelehrung</h1>
            <p className="text-gray-500">Ihre Rechte als Verbraucher</p>
          </div>

          {/* Demo Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8">
            <p className="text-amber-700 font-medium text-center">
              DEMO - Dies ist eine Testumgebung und keine echte Shop-Website.
            </p>
          </div>

          {/* Key Info */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Clock size={24} className="text-green-600" />
              <h2 className="text-xl font-bold text-green-800">14 Tage Widerrufsrecht</h2>
            </div>
            <p className="text-green-700">
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
              Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter
              Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.
            </p>
          </div>

          <div className="space-y-6">
            {/* Widerrufsrecht */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <RotateCcw size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Widerrufsrecht</h2>
              </div>

              <div className="text-gray-600 space-y-4">
                <p>
                  Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung
                  (z. B. ein mit der Post versandter Brief, Telefax oder E-Mail) über Ihren Entschluss,
                  diesen Vertrag zu widerrufen, informieren.
                </p>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-semibold text-gray-900 mb-2">Kontaktdaten für den Widerruf:</p>
                  <p className="text-sm">
                    McPaper AG (Demo)<br />
                    Musterstraße 123<br />
                    10115 Berlin<br />
                    Telefon: +49 (0) 30 123456-0<br />
                    E-Mail: widerruf@mcpaper-demo.de
                  </p>
                </div>

                <p>
                  Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
                </p>
              </div>
            </section>

            {/* Folgen des Widerrufs */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <ArrowRight size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Folgen des Widerrufs</h2>
              </div>

              <div className="text-gray-600 space-y-4">
                <p>
                  Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben,
                  einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass
                  Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt
                  haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die
                  Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="font-semibold text-green-700 mb-2">Rückzahlung</p>
                    <p className="text-sm text-green-600">
                      Wir verwenden dasselbe Zahlungsmittel wie bei der ursprünglichen Transaktion.
                      Keine zusätzlichen Entgelte.
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="font-semibold text-blue-700 mb-2">Rücksendung</p>
                    <p className="text-sm text-blue-600">
                      Senden Sie die Waren binnen 14 Tagen zurück.
                      Sie tragen die unmittelbaren Kosten der Rücksendung.
                    </p>
                  </div>
                </div>

                <p>
                  Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen
                  zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang
                  mit ihnen zurückzuführen ist.
                </p>
              </div>
            </section>

            {/* Ausschluss */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Ausschluss des Widerrufsrechts</h2>
              </div>

              <p className="text-gray-600 mb-4">
                Das Widerrufsrecht besteht nicht bei Verträgen:
              </p>

              <ul className="space-y-3">
                {[
                  'zur Lieferung von Waren, die nicht vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist oder die eindeutig auf die persönlichen Bedürfnisse des Verbrauchers zugeschnitten sind;',
                  'zur Lieferung von Waren, die schnell verderben können oder deren Verfallsdatum schnell überschritten würde;',
                  'zur Lieferung versiegelter Waren, die aus Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind, wenn ihre Versiegelung nach der Lieferung entfernt wurde;',
                  'zur Lieferung von Waren, wenn diese nach der Lieferung aufgrund ihrer Beschaffenheit untrennbar mit anderen Gütern vermischt wurden.',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                    <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-red-600">{index + 1}</span>
                    </div>
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Muster-Widerrufsformular */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <FileText size={20} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Muster-Widerrufsformular</h2>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)
              </p>

              <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-200">
                <p className="text-gray-700 mb-4">
                  An McPaper AG (Demo), Musterstraße 123, 10115 Berlin, E-Mail: widerruf@mcpaper-demo.de:
                </p>
                <p className="text-gray-600 mb-4">
                  Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der
                  folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)
                </p>
                <div className="space-y-2 text-gray-600">
                  <p>• Bestellt am (*)/erhalten am (*):</p>
                  <p>• Name des/der Verbraucher(s):</p>
                  <p>• Anschrift des/der Verbraucher(s):</p>
                  <p>• Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</p>
                  <p>• Datum:</p>
                </div>
                <p className="text-xs text-gray-500 mt-4">(*) Unzutreffendes streichen.</p>
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
