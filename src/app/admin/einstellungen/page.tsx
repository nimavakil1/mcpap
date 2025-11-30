'use client';

import { useEffect, useState } from 'react';
import { Settings, Save, Loader2, Store, Truck, Mail, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

interface SettingItem {
  key: string;
  value: string;
  description?: string;
}

const defaultSettings = [
  { key: 'shop_name', value: 'McPaper', description: 'Name des Shops' },
  { key: 'shop_email', value: 'info@mcpaper.de', description: 'Kontakt-E-Mail' },
  { key: 'shop_phone', value: '', description: 'Telefonnummer' },
  { key: 'shop_address', value: '', description: 'Geschäftsadresse' },
  { key: 'shipping_free_threshold', value: '50', description: 'Kostenloser Versand ab (€)' },
  { key: 'shipping_standard_cost', value: '4.95', description: 'Standard-Versandkosten (€)' },
  { key: 'tax_rate_standard', value: '19', description: 'Standard-MwSt. (%)' },
  { key: 'tax_rate_reduced', value: '7', description: 'Ermäßigter MwSt.-Satz (%)' },
  { key: 'voucher_threshold_small', value: '100', description: 'Gutschein ab Bestellwert (€) - Klein' },
  { key: 'voucher_amount_small', value: '5', description: 'Gutscheinwert Klein (€)' },
  { key: 'voucher_threshold_large', value: '200', description: 'Gutschein ab Bestellwert (€) - Groß' },
  { key: 'voucher_amount_large', value: '10', description: 'Gutscheinwert Groß (€)' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingItem[]>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();

      // Merge with defaults
      const merged = defaultSettings.map(def => {
        const saved = data.find((s: SettingItem) => s.key === def.key);
        return saved ? { ...def, value: saved.value } : def;
      });

      setSettings(merged);
    } catch (error) {
      console.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      toast.success('Einstellungen gespeichert');
    } catch (error) {
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(settings.map(s => s.key === key ? { ...s, value } : s));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const getSetting = (key: string) => settings.find(s => s.key === key);

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Einstellungen</h1>
          <p className="text-gray-600">Shop-Konfiguration verwalten</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Speichern
        </button>
      </div>

      <div className="space-y-6">
        {/* Shop Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Store className="text-gray-500" size={20} />
            <h2 className="text-lg font-semibold">Shop-Informationen</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop-Name
              </label>
              <input
                type="text"
                value={getSetting('shop_name')?.value || ''}
                onChange={(e) => updateSetting('shop_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kontakt-E-Mail
              </label>
              <input
                type="email"
                value={getSetting('shop_email')?.value || ''}
                onChange={(e) => updateSetting('shop_email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                value={getSetting('shop_phone')?.value || ''}
                onChange={(e) => updateSetting('shop_phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Geschäftsadresse
              </label>
              <input
                type="text"
                value={getSetting('shop_address')?.value || ''}
                onChange={(e) => updateSetting('shop_address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="text-gray-500" size={20} />
            <h2 className="text-lg font-semibold">Versand</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kostenloser Versand ab (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={getSetting('shipping_free_threshold')?.value || ''}
                onChange={(e) => updateSetting('shipping_free_threshold', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Standard-Versandkosten (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={getSetting('shipping_standard_cost')?.value || ''}
                onChange={(e) => updateSetting('shipping_standard_cost', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Tax */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="text-gray-500" size={20} />
            <h2 className="text-lg font-semibold">Steuern</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Standard-MwSt. (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={getSetting('tax_rate_standard')?.value || ''}
                onChange={(e) => updateSetting('tax_rate_standard', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ermäßigter MwSt.-Satz (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={getSetting('tax_rate_reduced')?.value || ''}
                onChange={(e) => updateSetting('tax_rate_reduced', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Vouchers */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="text-gray-500" size={20} />
            <h2 className="text-lg font-semibold">Gutschein-Konfiguration</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kleiner Gutschein ab Bestellwert (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={getSetting('voucher_threshold_small')?.value || ''}
                onChange={(e) => updateSetting('voucher_threshold_small', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kleiner Gutscheinwert (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={getSetting('voucher_amount_small')?.value || ''}
                onChange={(e) => updateSetting('voucher_amount_small', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Großer Gutschein ab Bestellwert (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={getSetting('voucher_threshold_large')?.value || ''}
                onChange={(e) => updateSetting('voucher_threshold_large', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Großer Gutscheinwert (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={getSetting('voucher_amount_large')?.value || ''}
                onChange={(e) => updateSetting('voucher_amount_large', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
