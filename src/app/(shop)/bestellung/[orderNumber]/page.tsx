import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Mail, Download, ChevronRight, Gift, ArrowRight, CreditCard, MapPin, Calendar, Hash } from 'lucide-react';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';
import { formatPrice } from '@/lib/utils';

interface OrderPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({ params }: OrderPageProps) {
  const { orderNumber } = await params;
  return {
    title: `Bestellung ${orderNumber} - McPaper`,
  };
}

export default async function OrderConfirmationPage({ params }: OrderPageProps) {
  const { orderNumber } = await params;
  const session = await getSession();

  if (!session) {
    redirect('/anmelden?redirect=/bestellung/' + orderNumber);
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      userId: session.id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      voucher: true,
    },
  });

  if (!order) {
    notFound();
  }

  const billingAddress = order.billingAddress as {
    company?: string;
    firstName: string;
    lastName: string;
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    country: string;
  };

  const shippingAddress = order.shippingAddress as {
    company?: string;
    firstName: string;
    lastName: string;
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    country: string;
  };

  const countries: Record<string, string> = {
    DE: 'Deutschland',
    AT: 'Österreich',
    CH: 'Schweiz',
  };

  const statusSteps = [
    { id: 'confirmed', label: 'Bestätigt', icon: CheckCircle, done: true },
    { id: 'processing', label: 'In Bearbeitung', icon: Package, done: order.status !== 'pending' },
    { id: 'shipped', label: 'Versendet', icon: Truck, done: order.status === 'shipped' || order.status === 'delivered' },
    { id: 'delivered', label: 'Zugestellt', icon: Mail, done: order.status === 'delivered' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors">
            Startseite
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <Link href="/konto/bestellungen" className="text-gray-500 hover:text-red-600 transition-colors">
            Meine Bestellungen
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-900 font-medium">{orderNumber}</span>
        </nav>

        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-8 mb-8 text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Vielen Dank für Ihre Bestellung!</h1>
          <p className="text-white/90 mb-4">
            Ihre Bestellung wurde erfolgreich aufgegeben. Sie erhalten in Kürze eine Bestätigungs-E-Mail.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
            <Hash size={16} />
            <span className="font-medium">Bestellnummer: {order.orderNumber}</span>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Bestellstatus</h2>
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {statusSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center min-w-[80px]">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        step.done ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <StepIcon size={24} />
                    </div>
                    <span className={`text-xs mt-2 font-medium ${step.done ? 'text-green-600' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 min-w-[40px] rounded-full ${step.done ? 'bg-green-500' : 'bg-gray-100'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Voucher if available */}
        {order.voucher && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Gift size={28} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-800 mb-1">Ihr Filialgutschein</h3>
                <p className="text-sm text-amber-700 mb-4">
                  Als Dankeschön für Ihre Bestellung erhalten Sie einen Gutschein für Ihren nächsten Einkauf in einer unserer Filialen.
                </p>
                <div className="bg-white rounded-xl p-4 border border-amber-200 inline-block">
                  <p className="font-mono text-2xl font-bold text-amber-800">{order.voucher.code}</p>
                  <p className="text-sm text-amber-600 mt-1">
                    Wert: <strong>{formatPrice(Number(order.voucher.amount))}</strong> |
                    Gültig bis: {new Date(order.voucher.expiresAt).toLocaleDateString('de-DE')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Bestellte Artikel</h2>
              <div className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Art.-Nr.: {item.product.sku}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × {formatPrice(Number(item.unitPrice))}
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">{formatPrice(Number(item.totalPrice))}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Zwischensumme</span>
                  <span>{formatPrice(Number(order.subtotal))}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Versandkosten</span>
                  <span>{Number(order.shippingCost) === 0 ? 'Kostenlos' : formatPrice(Number(order.shippingCost))}</span>
                </div>
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Gesamt</span>
                    <span className="text-red-600">{formatPrice(Number(order.total))}</span>
                  </div>
                  <p className="text-xs text-gray-500 text-right">inkl. {formatPrice(Number(order.taxAmount))} MwSt.</p>
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={18} className="text-red-600" />
                  <h3 className="font-bold text-gray-900">Rechnungsadresse</h3>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  {billingAddress.company && <p className="font-medium">{billingAddress.company}</p>}
                  <p>{billingAddress.firstName} {billingAddress.lastName}</p>
                  <p>{billingAddress.street} {billingAddress.houseNumber}</p>
                  <p>{billingAddress.postalCode} {billingAddress.city}</p>
                  <p>{countries[billingAddress.country] || billingAddress.country}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <Truck size={18} className="text-red-600" />
                  <h3 className="font-bold text-gray-900">Lieferadresse</h3>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  {shippingAddress.company && <p className="font-medium">{shippingAddress.company}</p>}
                  <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                  <p>{shippingAddress.street} {shippingAddress.houseNumber}</p>
                  <p>{shippingAddress.postalCode} {shippingAddress.city}</p>
                  <p>{countries[shippingAddress.country] || shippingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Info Sidebar */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24 hover:shadow-lg hover:shadow-gray-200/50 transition-all">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Bestellinformationen</h2>
              <dl className="space-y-4">
                <div className="flex items-start gap-3">
                  <Hash size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <dt className="text-sm text-gray-500">Bestellnummer</dt>
                    <dd className="font-medium text-gray-900">{order.orderNumber}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <dt className="text-sm text-gray-500">Bestelldatum</dt>
                    <dd className="font-medium text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <dt className="text-sm text-gray-500">Zahlungsart</dt>
                    <dd className="font-medium text-gray-900">
                      {order.paymentMethod === 'invoice' && 'Rechnung'}
                      {order.paymentMethod === 'card' && 'Kreditkarte'}
                      {order.paymentMethod === 'paypal' && 'PayPal'}
                      {order.paymentMethod === 'sepa' && 'SEPA-Lastschrift'}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <dt className="text-sm text-gray-500">Zahlungsstatus</dt>
                    <dd>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          order.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : order.paymentStatus === 'failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {order.paymentStatus === 'paid' && 'Bezahlt'}
                        {order.paymentStatus === 'pending' && 'Ausstehend'}
                        {order.paymentStatus === 'failed' && 'Fehlgeschlagen'}
                        {order.paymentStatus === 'refunded' && 'Erstattet'}
                      </span>
                    </dd>
                  </div>
                </div>
              </dl>

              {order.notes && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Bestellnotiz:</p>
                  <p className="text-sm text-gray-900">{order.notes}</p>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all">
                  <Download size={18} />
                  Rechnung herunterladen
                </button>
                <Link
                  href="/konto/bestellungen"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-all"
                >
                  Alle Bestellungen ansehen
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-12">
          <Link
            href="/kategorie/schreibwaren"
            className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all"
          >
            Weiter einkaufen
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
