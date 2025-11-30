import Link from 'next/link';
import { Package, Heart, ShoppingBag, Gift, ArrowRight, TrendingUp } from 'lucide-react';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';
import { formatPrice } from '@/lib/utils';

export const metadata = {
  title: 'Mein Konto - McPaper',
};

export default async function AccountPage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  // Fetch user data with stats
  const [user, recentOrders, favoriteCount, voucherCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.id },
      include: {
        customerGroup: true,
      },
    }),
    prisma.order.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        items: true,
      },
    }),
    prisma.favorite.count({
      where: { userId: session.id },
    }),
    prisma.storeVoucher.count({
      where: {
        userId: session.id,
        isRedeemed: false,
        expiresAt: { gte: new Date() },
      },
    }),
  ]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Willkommen zurück, {user.firstName}!
        </h1>
        <p className="text-red-100">
          Hier finden Sie eine Übersicht Ihres Kontos und Ihrer letzten Aktivitäten.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href: '/konto/bestellungen', icon: Package, value: recentOrders.length, label: 'Bestellungen', color: 'red' },
          { href: '/konto/favoriten', icon: Heart, value: favoriteCount, label: 'Favoriten', color: 'pink' },
          { href: '/konto/gespeicherte-warenkoerbe', icon: ShoppingBag, value: 0, label: 'Warenkörbe', color: 'blue' },
          { href: '#', icon: Gift, value: voucherCount, label: 'Gutscheine', color: 'amber' },
        ].map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
              stat.color === 'red' ? 'bg-red-100' :
              stat.color === 'pink' ? 'bg-pink-100' :
              stat.color === 'blue' ? 'bg-blue-100' : 'bg-amber-100'
            }`}>
              <stat.icon size={22} className={
                stat.color === 'red' ? 'text-red-600' :
                stat.color === 'pink' ? 'text-pink-600' :
                stat.color === 'blue' ? 'text-blue-600' : 'text-amber-600'
              } />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Customer Group Info */}
      {user.customerGroup && Number(user.customerGroup.discountPercentage) > 0 && (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <TrendingUp size={22} className="text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-green-800">
              {user.customerGroup.name}-Kunde
            </p>
            <p className="text-sm text-green-700">
              Sie erhalten {Number(user.customerGroup.discountPercentage)}% Rabatt auf alle Produkte!
            </p>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Letzte Bestellungen</h2>
          <Link
            href="/konto/bestellungen"
            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            Alle anzeigen <ArrowRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-gray-400" />
            </div>
            <p className="text-gray-900 font-semibold mb-2">Keine Bestellungen vorhanden</p>
            <p className="text-gray-500 mb-6">Sie haben noch keine Bestellungen aufgegeben.</p>
            <Link
              href="/kategorie/schreibwaren"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all"
            >
              Jetzt stöbern
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/bestellung/${order.orderNumber}`}
                className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('de-DE')} · {order.items.length} Artikel
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatPrice(Number(order.total))}</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
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
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Account Info Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Kontoinformationen</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium text-gray-900">{user.firstName} {user.lastName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">E-Mail</dt>
              <dd className="font-medium text-gray-900 truncate ml-4">{user.email}</dd>
            </div>
            {user.companyName && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Firma</dt>
                <dd className="font-medium text-gray-900">{user.companyName}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">Kundengruppe</dt>
              <dd className="font-medium text-gray-900">{user.customerGroup?.name || 'Standard'}</dd>
            </div>
          </dl>
          <Link
            href="/konto/einstellungen"
            className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium mt-4 transition-colors"
          >
            Profil bearbeiten <ArrowRight size={14} />
          </Link>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Lieferadresse</h2>
          {user.shippingStreet ? (
            <address className="not-italic text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
              <p>{user.shippingStreet}</p>
              <p>{user.shippingPostalCode} {user.shippingCity}</p>
            </address>
          ) : (
            <p className="text-gray-500">Keine Lieferadresse hinterlegt.</p>
          )}
          <Link
            href="/konto/einstellungen"
            className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium mt-4 transition-colors"
          >
            Adresse bearbeiten <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
