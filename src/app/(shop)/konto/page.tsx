import Link from 'next/link';
import { Package, Heart, ShoppingBag, Gift, ArrowRight } from 'lucide-react';
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
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Willkommen, {user.firstName}!
        </h1>
        <p className="text-[#666]">
          Hier finden Sie eine Übersicht Ihres Kontos und Ihrer letzten Aktivitäten.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Link
          href="/konto/bestellungen"
          className="bg-white border border-[#E0E0E0] rounded-lg p-4 hover:border-[#E31E24] transition-colors"
        >
          <Package size={24} className="text-[#E31E24] mb-2" />
          <p className="text-2xl font-bold">{recentOrders.length}</p>
          <p className="text-sm text-[#666]">Bestellungen</p>
        </Link>
        <Link
          href="/konto/favoriten"
          className="bg-white border border-[#E0E0E0] rounded-lg p-4 hover:border-[#E31E24] transition-colors"
        >
          <Heart size={24} className="text-[#E31E24] mb-2" />
          <p className="text-2xl font-bold">{favoriteCount}</p>
          <p className="text-sm text-[#666]">Favoriten</p>
        </Link>
        <Link
          href="/konto/gespeicherte-warenkoerbe"
          className="bg-white border border-[#E0E0E0] rounded-lg p-4 hover:border-[#E31E24] transition-colors"
        >
          <ShoppingBag size={24} className="text-[#E31E24] mb-2" />
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-[#666]">Gespeicherte Warenkörbe</p>
        </Link>
        <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
          <Gift size={24} className="text-[#FF6B00] mb-2" />
          <p className="text-2xl font-bold">{voucherCount}</p>
          <p className="text-sm text-[#666]">Filialgutscheine</p>
        </div>
      </div>

      {/* Customer Group Info */}
      {user.customerGroup && Number(user.customerGroup.discountPercentage) > 0 && (
        <div className="bg-[#28A745]/10 border border-[#28A745] rounded-lg p-4">
          <p className="font-medium text-[#28A745]">
            Als {user.customerGroup.name}-Kunde erhalten Sie {Number(user.customerGroup.discountPercentage)}% Rabatt auf alle Produkte!
          </p>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Letzte Bestellungen</h2>
          <Link href="/konto/bestellungen" className="text-[#E31E24] hover:underline text-sm flex items-center gap-1">
            Alle anzeigen <ArrowRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package size={40} className="mx-auto text-[#999] mb-3" />
            <p className="text-[#666]">Sie haben noch keine Bestellungen.</p>
            <Link href="/kategorie/schreibwaren" className="text-[#E31E24] hover:underline mt-2 inline-block">
              Jetzt stöbern
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#E0E0E0]">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/bestellung/${order.orderNumber}`}
                className="py-4 flex items-center justify-between hover:bg-[#F5F5F5] -mx-4 px-4 transition-colors"
              >
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-[#666]">
                    {new Date(order.createdAt).toLocaleDateString('de-DE')} · {order.items.length} Artikel
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#E31E24]">{formatPrice(Number(order.total))}</p>
                  <p className="text-xs">
                    <span
                      className={`px-2 py-0.5 rounded ${
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
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">Kontoinformationen</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[#666]">Name</dt>
              <dd>{user.firstName} {user.lastName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#666]">E-Mail</dt>
              <dd>{user.email}</dd>
            </div>
            {user.company && (
              <div className="flex justify-between">
                <dt className="text-[#666]">Firma</dt>
                <dd>{user.company}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-[#666]">Kundengruppe</dt>
              <dd>{user.customerGroup?.name || 'Standard'}</dd>
            </div>
          </dl>
          <Link href="/konto/einstellungen" className="text-[#E31E24] hover:underline text-sm mt-4 block">
            Profil bearbeiten →
          </Link>
        </div>

        <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">Standardadresse</h2>
          {user.defaultShippingAddress ? (
            <address className="not-italic text-sm text-[#666]">
              {(user.defaultShippingAddress as { firstName?: string; lastName?: string; street?: string; postalCode?: string; city?: string }).firstName}{' '}
              {(user.defaultShippingAddress as { firstName?: string; lastName?: string; street?: string; postalCode?: string; city?: string }).lastName}<br />
              {(user.defaultShippingAddress as { firstName?: string; lastName?: string; street?: string; postalCode?: string; city?: string }).street}<br />
              {(user.defaultShippingAddress as { firstName?: string; lastName?: string; street?: string; postalCode?: string; city?: string }).postalCode}{' '}
              {(user.defaultShippingAddress as { firstName?: string; lastName?: string; street?: string; postalCode?: string; city?: string }).city}
            </address>
          ) : (
            <p className="text-sm text-[#666]">Keine Standardadresse hinterlegt.</p>
          )}
          <Link href="/konto/einstellungen" className="text-[#E31E24] hover:underline text-sm mt-4 block">
            Adresse bearbeiten →
          </Link>
        </div>
      </div>
    </div>
  );
}
