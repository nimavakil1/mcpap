import Link from 'next/link';
import { Gift, Search, Check, X, Calendar } from 'lucide-react';
import prisma from '@/lib/db';

export const metadata = {
  title: 'Gutscheine - Admin | McPaper',
};

export default async function VouchersPage() {
  const vouchers = await prisma.storeVoucher.findMany({
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      order: {
        select: {
          orderNumber: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const stats = {
    total: vouchers.length,
    active: vouchers.filter(v => !v.isRedeemed && new Date(v.expiresAt) > new Date()).length,
    redeemed: vouchers.filter(v => v.isRedeemed).length,
    expired: vouchers.filter(v => !v.isRedeemed && new Date(v.expiresAt) <= new Date()).length,
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gutscheine</h1>
          <p className="text-gray-600">{stats.total} Gutscheine gesamt</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Gesamt</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-500">Aktiv</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.redeemed}</div>
          <div className="text-sm text-gray-500">Eingelöst</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
          <div className="text-sm text-gray-500">Abgelaufen</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {vouchers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Gift size={40} className="mx-auto mb-2 opacity-50" />
            Keine Gutscheine vorhanden
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Code</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Wert</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Kunde</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Bestellung</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Gültig bis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vouchers.map((voucher) => {
                const isExpired = new Date(voucher.expiresAt) <= new Date();
                const status = voucher.isRedeemed ? 'redeemed' : isExpired ? 'expired' : 'active';

                return (
                  <tr key={voucher.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-mono font-medium">{voucher.code}</span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {Number(voucher.amount).toFixed(2)} €
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        {voucher.user.firstName} {voucher.user.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{voucher.user.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/bestellungen/${voucher.orderId}`}
                        className="text-red-600 hover:underline text-sm"
                      >
                        {voucher.order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {status === 'active' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          <Check size={12} />
                          Aktiv
                        </span>
                      )}
                      {status === 'redeemed' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          <Check size={12} />
                          Eingelöst
                        </span>
                      )}
                      {status === 'expired' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          <X size={12} />
                          Abgelaufen
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(voucher.expiresAt).toLocaleDateString('de-DE')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
