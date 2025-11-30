import Link from 'next/link';
import { ShoppingBag, ArrowRight, Bookmark, RefreshCw, List, Archive } from 'lucide-react';

export const metadata = {
  title: 'Gespeicherte Warenkörbe - McPaper',
};

export default function SavedCartsPage() {
  // This would fetch saved carts from the database
  const savedCarts: never[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gespeicherte Warenkörbe</h1>
        <p className="text-gray-500 mt-1">Verwalten Sie Ihre gespeicherten Warenkörbe</p>
      </div>

      {savedCarts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={36} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Keine gespeicherten Warenkörbe</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Speichern Sie Ihren Warenkorb, um später darauf zurückzugreifen oder regelmäßige Bestellungen zu vereinfachen.
          </p>
          <Link
            href="/warenkorb"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all"
          >
            Zum Warenkorb
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Saved carts would be rendered here */}
        </div>
      )}

      {/* How It Works */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">So funktioniert&apos;s</h3>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: 1, icon: ShoppingBag, title: 'Warenkorb füllen', desc: 'Fügen Sie Produkte zu Ihrem Warenkorb hinzu' },
            { step: 2, icon: Bookmark, title: 'Speichern', desc: 'Klicken Sie auf „Warenkorb speichern"' },
            { step: 3, icon: List, title: 'Benennen', desc: 'Geben Sie dem Warenkorb einen Namen' },
            { step: 4, icon: RefreshCw, title: 'Wiederverwenden', desc: 'Laden Sie ihn jederzeit wieder' },
          ].map((item) => (
            <div key={item.step} className="relative">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                <item.icon size={22} className="text-red-600" />
              </div>
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {item.step}
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <RefreshCw size={22} className="text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Schnell nachbestellen</h4>
            <p className="text-sm text-gray-500">Regelmäßige Bestellungen mit einem Klick wiederholen</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Archive size={22} className="text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Projekte organisieren</h4>
            <p className="text-sm text-gray-500">Separate Warenkörbe für verschiedene Projekte anlegen</p>
          </div>
        </div>
      </div>
    </div>
  );
}
