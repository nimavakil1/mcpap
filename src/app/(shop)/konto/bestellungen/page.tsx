import Link from 'next/link';
import { Package, ArrowRight, Calendar, Hash, CreditCard } from 'lucide-react';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';
import { formatPrice } from '@/lib/utils';

export const metadata = {
  title: 'Meine Bestellungen - McPaper',
};

export default async function OrdersPage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      voucher: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meine Bestellungen</h1>
        <p className="text-gray-500 mt-1">Übersicht all Ihrer Bestellungen</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={36} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Keine Bestellungen vorhanden</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Sie haben noch keine Bestellungen aufgegeben. Entdecken Sie unsere Produkte!
          </p>
          <Link
            href="/kategorie/schreibwaren"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all"
          >
            Jetzt einkaufen
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 transition-all">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-gray-400" />
                    <div>
                      <p className="text-gray-500">Bestellnummer</p>
                      <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <div>
                      <p className="text-gray-500">Bestelldatum</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-gray-400" />
                    <div>
                      <p className="text-gray-500">Gesamtsumme</p>
                      <p className="font-bold text-red-600">{formatPrice(Number(order.total))}</p>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'shipped'
                      ? 'bg-blue-100 text-blue-700'
                      : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {order.status === 'pending' && 'Ausstehend'}
                  {order.status === 'paid' && 'Bezahlt'}
                  {order.status === 'processing' && 'In Bearbeitung'}
                  {order.status === 'shipped' && 'Versendet'}
                  {order.status === 'delivered' && 'Zugestellt'}
                  {order.status === 'cancelled' && 'Storniert'}
                </span>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <div className="divide-y divide-gray-100">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × {formatPrice(Number(item.unitPrice))}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">{formatPrice(Number(item.totalPrice))}</p>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="py-3 text-sm text-gray-500">
                      + {order.items.length - 3} weitere Artikel
                    </p>
                  )}
                </div>

                {/* Voucher Info */}
                {order.voucher && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-sm text-amber-700 font-medium flex items-center gap-2">
                      <span>🎁</span>
                      Filialgutschein: {order.voucher.code} ({formatPrice(Number(order.voucher.amount))})
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/bestellung/${order.orderNumber}`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors"
                  >
                    Details anzeigen
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
