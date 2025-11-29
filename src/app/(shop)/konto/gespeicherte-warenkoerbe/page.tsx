import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export const metadata = {
  title: 'Gespeicherte Warenkörbe - McPaper',
};

export default function SavedCartsPage() {
  // This would fetch saved carts from the database
  const savedCarts: never[] = [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gespeicherte Warenkörbe</h1>

      {savedCarts.length === 0 ? (
        <div className="bg-white border border-[#E0E0E0] rounded-lg p-12 text-center">
          <ShoppingBag size={48} className="mx-auto text-[#999] mb-4" />
          <h2 className="text-lg font-semibold mb-2">Keine gespeicherten Warenkörbe</h2>
          <p className="text-[#666] mb-6">
            Speichern Sie Ihren Warenkorb, um später darauf zurückzugreifen oder regelmäßige Bestellungen zu vereinfachen.
          </p>
          <Link
            href="/warenkorb"
            className="inline-block bg-[#E31E24] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#C41A1F] transition-colors"
          >
            Zum Warenkorb
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Saved carts would be rendered here */}
        </div>
      )}

      <div className="mt-8 bg-[#F5F5F5] rounded-lg p-6">
        <h3 className="font-bold mb-2">So funktioniert&apos;s</h3>
        <ul className="text-sm text-[#666] space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-[#E31E24]">1.</span>
            Fügen Sie Produkte zu Ihrem Warenkorb hinzu
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#E31E24]">2.</span>
            Klicken Sie im Warenkorb auf „Warenkorb speichern"
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#E31E24]">3.</span>
            Geben Sie dem Warenkorb einen Namen
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#E31E24]">4.</span>
            Laden Sie den Warenkorb jederzeit wieder, um schnell nachzubestellen
          </li>
        </ul>
      </div>
    </div>
  );
}
