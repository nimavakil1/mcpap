import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Widerrufsrecht - McPaper',
  description: 'Widerrufsbelehrung der McPaper Demo-Plattform',
};

export default function WiderrufsrechtPage() {
  return (
    <div className="container py-6">
      <nav className="breadcrumb mb-6">
        <Link href="/">Startseite</Link>
        <ChevronRight size={16} className="breadcrumb-separator" />
        <span className="text-[#1A1A1A] font-medium">Widerrufsrecht</span>
      </nav>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Widerrufsbelehrung</h1>

        <div className="prose max-w-none space-y-8">
          <div className="bg-[#FF6B00]/10 border border-[#FF6B00] rounded-lg p-4 mb-8">
            <p className="text-[#FF6B00] font-medium">
              ⚠️ DEMO - Dies ist eine Testumgebung und keine echte Shop-Website.
            </p>
          </div>

          <section>
            <h2 className="text-xl font-bold mb-4">Widerrufsrecht</h2>
            <p>
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
            </p>
            <p className="mt-2">
              Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter
              Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.
            </p>
            <p className="mt-2">
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
            </p>
            <div className="bg-[#F5F5F5] p-4 rounded-lg mt-2">
              <p>
                McPaper AG (Demo)<br />
                Musterstraße 123<br />
                10115 Berlin<br />
                Telefon: +49 (0) 30 123456-0<br />
                E-Mail: widerruf@mcpaper-demo.de
              </p>
            </div>
            <p className="mt-4">
              mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief, Telefax oder E-Mail)
              über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte
              Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Folgen des Widerrufs</h2>
            <p>
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben,
              einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass
              Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt
              haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die
              Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
            </p>
            <p className="mt-2">
              Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion
              eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall
              werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
            </p>
            <p className="mt-2">
              Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den
              Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere
              Zeitpunkt ist.
            </p>
            <p className="mt-2">
              Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem
              Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder zu übergeben. Die
              Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.
            </p>
            <p className="mt-2">
              Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.
            </p>
            <p className="mt-2">
              Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen
              zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang
              mit ihnen zurückzuführen ist.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Ausschluss des Widerrufsrechts</h2>
            <p>
              Das Widerrufsrecht besteht nicht bei Verträgen:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                zur Lieferung von Waren, die nicht vorgefertigt sind und für deren Herstellung eine individuelle
                Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist oder die eindeutig auf die
                persönlichen Bedürfnisse des Verbrauchers zugeschnitten sind;
              </li>
              <li>
                zur Lieferung von Waren, die schnell verderben können oder deren Verfallsdatum schnell
                überschritten würde;
              </li>
              <li>
                zur Lieferung versiegelter Waren, die aus Gründen des Gesundheitsschutzes oder der Hygiene nicht
                zur Rückgabe geeignet sind, wenn ihre Versiegelung nach der Lieferung entfernt wurde;
              </li>
              <li>
                zur Lieferung von Waren, wenn diese nach der Lieferung aufgrund ihrer Beschaffenheit untrennbar
                mit anderen Gütern vermischt wurden.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Muster-Widerrufsformular</h2>
            <div className="bg-[#F5F5F5] p-4 rounded-lg">
              <p className="font-medium mb-2">
                (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden
                Sie es zurück.)
              </p>
              <p>
                An McPaper AG (Demo), Musterstraße 123, 10115 Berlin, E-Mail: widerruf@mcpaper-demo.de:
              </p>
              <p className="mt-2">
                Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der
                folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)
              </p>
              <ul className="mt-2">
                <li>Bestellt am (*)/erhalten am (*):</li>
                <li>Name des/der Verbraucher(s):</li>
                <li>Anschrift des/der Verbraucher(s):</li>
                <li>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</li>
                <li>Datum:</li>
              </ul>
              <p className="mt-2 text-sm text-[#666]">(*) Unzutreffendes streichen.</p>
            </div>
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
