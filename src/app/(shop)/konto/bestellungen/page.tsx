import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';
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
    <div>
      <h1 className="text-2xl font-bold mb-6">Meine Bestellungen</h1>

      {orders.length === 0 ? (
        <div className="bg-white border border-[#E0E0E0] rounded-lg p-12 text-center">
          <Package size={48} className="mx-auto text-[#999] mb-4" />
          <h2 className="text-lg font-semibold mb-2">Keine Bestellungen vorhanden</h2>
          <p className="text-[#666] mb-6">
            Sie haben noch keine Bestellungen aufgegeben.
          </p>
          <Link
            href="/kategorie/schreibwaren"
            className="inline-block bg-[#E31E24] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#C41A1F] transition-colors"
          >
            Jetzt einkaufen
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-[#E0E0E0] rounded-lg overflow-hidden">
              {/* Order Header */}
              <div className="bg-[#F5F5F5] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-6 text-sm">
                  <div>
                    <p className="text-[#666]">Bestellnummer</p>
                    <p className="font-medium">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-[#666]">Bestelldatum</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#666]">Gesamtsumme</p>
                    <p className="font-medium text-[#E31E24]">{formatPrice(Number(order.total))}</p>
                  </div>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      order.status === 'delivered'
                        ? 'bg-[#28A745]/10 text-[#28A745]'
                        : order.status === 'shipped'
                        ? 'bg-[#17A2B8]/10 text-[#17A2B8]'
                        : order.status === 'cancelled'
                        ? 'bg-[#DC3545]/10 text-[#DC3545]'
                        : 'bg-[#FF6B00]/10 text-[#FF6B00]'
                    }`}
                  >
                    {order.status === 'pending' && 'Ausstehend'}
                    {order.status === 'paid' && 'Bezahlt'}
                    {order.status === 'processing' && 'Wird verarbeitet'}
                    {order.status === 'shipped' && 'Versendet'}
                    {order.status === 'delivered' && 'Zugestellt'}
                    {order.status === 'cancelled' && 'Storniert'}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <div className="divide-y divide-[#E0E0E0]">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="py-3 flex justify-between">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-[#666]">
                          {item.quantity} × {formatPrice(Number(item.unitPrice))}
                        </p>
                      </div>
                      <p className="font-medium">{formatPrice(Number(item.totalPrice))}</p>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="py-3 text-sm text-[#666]">
                      + {order.items.length - 3} weitere Artikel
                    </p>
                  )}
                </div>

                {/* Voucher Info */}
                {order.voucher && (
                  <div className="mt-4 p-3 bg-[#FF6B00]/10 rounded">
                    <p className="text-sm text-[#FF6B00] font-medium">
                      🎁 Filialgutschein: {order.voucher.code} ({formatPrice(Number(order.voucher.amount))})
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/bestellung/${order.orderNumber}`}
                    className="text-[#E31E24] hover:underline text-sm flex items-center gap-1"
                  >
                    Details anzeigen <ArrowRight size={14} />
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
