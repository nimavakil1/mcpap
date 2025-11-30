import Link from 'next/link';
import { Search, Eye, Package } from 'lucide-react';
import prisma from '@/lib/db';
import { formatPrice } from '@/lib/utils';

export const metadata = {
  title: 'Bestellungen - Admin | McPaper',
};

interface OrdersPageProps {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Ausstehend',
  paid: 'Bezahlt',
  processing: 'In Bearbeitung',
  shipped: 'Versendet',
  delivered: 'Zugestellt',
  cancelled: 'Storniert',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-cyan-100 text-cyan-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const status = params.status || '';
  const search = params.search || '';
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (status) {
    where.status = status;
  }
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: 'insensitive' } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
      { user: { company: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            company: true,
          },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Bestellungen</h1>
        <p className="text-gray-600">{total} Bestellungen insgesamt</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <form className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Suche nach Bestellnummer oder Kunde..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#E31E24]"
              />
            </div>
          </div>
          <select
            name="status"
            defaultValue={status}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#E31E24]"
          >
            <option value="">Alle Status</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Filtern
          </button>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold">Bestellnummer</th>
              <th className="text-left p-4 font-semibold">Kunde</th>
              <th className="text-left p-4 font-semibold">Datum</th>
              <th className="text-center p-4 font-semibold">Artikel</th>
              <th className="text-right p-4 font-semibold">Summe</th>
              <th className="text-center p-4 font-semibold">Status</th>
              <th className="text-center p-4 font-semibold">Zahlung</th>
              <th className="text-right p-4 font-semibold">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">
                  <Package size={40} className="mx-auto mb-2 opacity-50" />
                  Keine Bestellungen gefunden
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <Link
                      href={`/admin/bestellungen/${order.id}`}
                      className="font-medium text-[#E31E24] hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium">
                        {order.user?.firstName} {order.user?.lastName}
                      </p>
                      {order.user?.company && (
                        <p className="text-xs text-gray-500">{order.user.company}</p>
                      )}
                      <p className="text-xs text-gray-500">{order.user?.email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="p-4 text-center text-sm">{order.items.length}</td>
                  <td className="p-4 text-right font-medium">
                    {formatPrice(Number(order.total))}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : order.paymentStatus === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {order.paymentStatus === 'paid' && 'Bezahlt'}
                      {order.paymentStatus === 'pending' && 'Ausstehend'}
                      {order.paymentStatus === 'failed' && 'Fehlgeschlagen'}
                      {order.paymentStatus === 'refunded' && 'Erstattet'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/bestellungen/${order.id}`}
                      className="p-2 text-gray-500 hover:text-[#E31E24] transition-colors inline-block"
                      title="Details"
                    >
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Seite {page} von {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/bestellungen?page=${page - 1}${status ? `&status=${status}` : ''}${search ? `&search=${search}` : ''}`}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Zurück
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/bestellungen?page=${page + 1}${status ? `&status=${status}` : ''}${search ? `&search=${search}` : ''}`}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Weiter
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
