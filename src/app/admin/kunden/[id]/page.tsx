'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, User, Package, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  customerNumber: string;
  phone?: string;
  isActive: boolean;
  isVerifiedBusiness: boolean;
  canPurchaseOnInvoice: boolean;
  billingStreet?: string;
  billingCity?: string;
  billingPostalCode?: string;
  billingCountry?: string;
  shippingStreet?: string;
  shippingCity?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
  customerGroup?: { id: string; name: string; discountPercentage: number };
  customerGroupId?: string;
  createdAt: string;
  _count?: { orders: number; favorites: number };
}

interface CustomerGroup {
  id: string;
  name: string;
  discountPercentage: number;
}

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerGroups, setCustomerGroups] = useState<CustomerGroup[]>([]);

  useEffect(() => {
    fetchCustomer();
    fetchCustomerGroups();
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`);
      if (!res.ok) throw new Error('Customer not found');
      const data = await res.json();
      setCustomer(data);
    } catch (error) {
      toast.error('Kunde nicht gefunden');
      router.push('/admin/kunden');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerGroups = async () => {
    try {
      const res = await fetch('/api/admin/customer-groups');
      const data = await res.json();
      setCustomerGroups(data);
    } catch (error) {
      console.error('Failed to fetch customer groups');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
      });

      if (!res.ok) throw new Error('Failed to update');

      toast.success('Kunde gespeichert');
    } catch (error) {
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/kunden"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-gray-600">{customer.customerNumber}</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <ShoppingCart size={16} />
            {customer._count?.orders || 0} Bestellungen
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Persönliche Daten</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vorname *
              </label>
              <input
                type="text"
                value={customer.firstName}
                onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nachname *
              </label>
              <input
                type="text"
                value={customer.lastName}
                onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail *
              </label>
              <input
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                value={customer.phone || ''}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Firma
              </label>
              <input
                type="text"
                value={customer.companyName || ''}
                onChange={(e) => setCustomer({ ...customer, companyName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Rechnungsadresse</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Straße
              </label>
              <input
                type="text"
                value={customer.billingStreet || ''}
                onChange={(e) => setCustomer({ ...customer, billingStreet: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PLZ
              </label>
              <input
                type="text"
                value={customer.billingPostalCode || ''}
                onChange={(e) => setCustomer({ ...customer, billingPostalCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stadt
              </label>
              <input
                type="text"
                value={customer.billingCity || ''}
                onChange={(e) => setCustomer({ ...customer, billingCity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Customer Group & Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Kundengruppe & Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kundengruppe
              </label>
              <select
                value={customer.customerGroupId || ''}
                onChange={(e) => setCustomer({ ...customer, customerGroupId: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              >
                <option value="">Keine Gruppe</option>
                {customerGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name} ({group.discountPercentage}% Rabatt)
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col justify-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customer.isActive}
                  onChange={(e) => setCustomer({ ...customer, isActive: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                <span>Aktiv</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customer.isVerifiedBusiness}
                  onChange={(e) => setCustomer({ ...customer, isVerifiedBusiness: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                <span>Verifizierter Geschäftskunde</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customer.canPurchaseOnInvoice}
                  onChange={(e) => setCustomer({ ...customer, canPurchaseOnInvoice: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                <span>Kauf auf Rechnung erlaubt</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/kunden"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Abbrechen
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Speichern
          </button>
        </div>
      </form>
    </div>
  );
}
