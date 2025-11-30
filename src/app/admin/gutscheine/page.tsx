'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Gift, Check, X, Plus, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface Voucher {
  id: string;
  code: string;
  amount: number;
  isRedeemed: boolean;
  expiresAt: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  order: {
    orderNumber: string;
  } | null;
  orderId: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newVoucher, setNewVoucher] = useState({
    userId: '',
    amount: 5,
    expiresInDays: 365,
  });

  useEffect(() => {
    fetchVouchers();
    fetchUsers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const res = await fetch('/api/admin/vouchers');
      const data = await res.json();
      setVouchers(data);
    } catch (error) {
      toast.error('Fehler beim Laden der Gutscheine');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users');
    }
  };

  const handleCreate = async () => {
    if (!newVoucher.userId) {
      toast.error('Bitte wählen Sie einen Kunden aus');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVoucher),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create');
      }

      toast.success('Gutschein erstellt');
      setShowModal(false);
      setNewVoucher({ userId: '', amount: 5, expiresInDays: 365 });
      fetchVouchers();
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Erstellen');
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    total: vouchers.length,
    active: vouchers.filter(v => !v.isRedeemed && new Date(v.expiresAt) > new Date()).length,
    redeemed: vouchers.filter(v => v.isRedeemed).length,
    expired: vouchers.filter(v => !v.isRedeemed && new Date(v.expiresAt) <= new Date()).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gutscheine</h1>
          <p className="text-gray-600">{stats.total} Gutscheine gesamt</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus size={18} />
          Neuer Gutschein
        </button>
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
                      {voucher.order ? (
                        <Link
                          href={`/admin/bestellungen/${voucher.orderId}`}
                          className="text-red-600 hover:underline text-sm"
                        >
                          {voucher.order.orderNumber}
                        </Link>
                      ) : (
                        <span className="text-gray-400 text-sm">Manuell erstellt</span>
                      )}
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

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Neuer Gutschein</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kunde *</label>
                <select
                  value={newVoucher.userId}
                  onChange={(e) => setNewVoucher({ ...newVoucher, userId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                >
                  <option value="">Kunde auswählen...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wert (€)</label>
                <select
                  value={newVoucher.amount}
                  onChange={(e) => setNewVoucher({ ...newVoucher, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                >
                  <option value={5}>5,00 €</option>
                  <option value={10}>10,00 €</option>
                  <option value={15}>15,00 €</option>
                  <option value={20}>20,00 €</option>
                  <option value={25}>25,00 €</option>
                  <option value={50}>50,00 €</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gültigkeit (Tage)</label>
                <input
                  type="number"
                  value={newVoucher.expiresInDays}
                  onChange={(e) => setNewVoucher({ ...newVoucher, expiresInDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Abbrechen
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !newVoucher.userId}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
