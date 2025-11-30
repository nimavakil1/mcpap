import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Mail, Download, ChevronRight, Gift } from 'lucide-react';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

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
      items: true,
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
    { id: 'processing', label: 'In Bearbeitung', icon: Package, done: order.status !== 'PENDING' },
    { id: 'shipped', label: 'Versendet', icon: Truck, done: order.status === 'SHIPPED' || order.status === 'DELIVERED' },
    { id: 'delivered', label: 'Zugestellt', icon: Mail, done: order.status === 'DELIVERED' },
  ];

  return (
    <div className="container py-6">
      {/* Breadcrumb */}
      <nav className="breadcrumb mb-6">
        <Link href="/">Startseite</Link>
        <ChevronRight size={16} className="breadcrumb-separator" />
        <Link href="/konto/bestellungen">Meine Bestellungen</Link>
        <ChevronRight size={16} className="breadcrumb-separator" />
        <span className="text-[#1A1A1A] font-medium">{orderNumber}</span>
      </nav>

      {/* Success Banner */}
      <div className="bg-[#28A745]/10 border border-[#28A745] rounded-lg p-6 mb-8 text-center">
        <CheckCircle size={48} className="mx-auto text-[#28A745] mb-4" />
        <h1 className="text-2xl font-bold text-[#28A745] mb-2">Vielen Dank für Ihre Bestellung!</h1>
        <p className="text-[#666]">
          Ihre Bestellung wurde erfolgreich aufgegeben. Sie erhalten in Kürze eine Bestätigungs-E-Mail.
        </p>
        <p className="mt-2 font-medium">Bestellnummer: {order.orderNumber}</p>
      </div>

      {/* Order Status */}
      <div className="bg-white border border-[#E0E0E0] rounded-lg p-6 mb-8">
        <h2 className="text-lg font-bold mb-6">Bestellstatus</h2>
        <div className="flex items-center justify-between overflow-x-auto">
          {statusSteps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center min-w-[80px]">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.done ? 'bg-[#28A745] text-white' : 'bg-[#E0E0E0] text-[#666]'
                    }`}
                  >
                    <StepIcon size={20} />
                  </div>
                  <span className={`text-xs mt-2 ${step.done ? 'text-[#28A745] font-medium' : 'text-[#666]'}`}>
                    {step.label}
                  </span>
                </div>
                {index < statusSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 min-w-[40px] ${step.done ? 'bg-[#28A745]' : 'bg-[#E0E0E0]'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Voucher if available */}
      {order.voucher && (
        <div className="bg-[#FF6B00]/10 border border-[#FF6B00] rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <Gift size={40} className="text-[#FF6B00]" />
            <div>
              <h3 className="font-bold text-[#FF6B00]">Ihr Filialgutschein</h3>
              <p className="text-[#666] text-sm">
                Als Dankeschön für Ihre Bestellung erhalten Sie einen Gutschein für Ihren nächsten Einkauf in einer unserer Filialen.
              </p>
              <div className="mt-3 p-3 bg-white rounded border border-[#FF6B00]">
                <p className="font-mono text-lg font-bold">{order.voucher.code}</p>
                <p className="text-sm">
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
        <div className="lg:col-span-2">
          <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Bestellte Artikel</h2>
            <div className="divide-y divide-[#E0E0E0]">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex justify-between">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-[#666]">Art.-Nr.: {item.productSku}</p>
                    <p className="text-sm text-[#666]">
                      {item.quantity} × {formatPrice(Number(item.unitPrice))}
                      {item.discountPercentage > 0 && (
                        <span className="ml-2 text-[#28A745]">(-{item.discountPercentage}%)</span>
                      )}
                    </p>
                  </div>
                  <p className="font-bold">{formatPrice(Number(item.totalPrice))}</p>
                </div>
              ))}
            </div>

            <hr className="border-[#E0E0E0] my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#666]">Zwischensumme</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between text-[#28A745]">
                  <span>Kundenrabatt</span>
                  <span>-{formatPrice(Number(order.discountAmount))}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#666]">Versandkosten</span>
                <span>{Number(order.shippingCost) === 0 ? 'Kostenlos' : formatPrice(Number(order.shippingCost))}</span>
              </div>
              <hr className="border-[#E0E0E0]" />
              <div className="flex justify-between text-lg font-bold">
                <span>Gesamt</span>
                <span className="text-[#E31E24]">{formatPrice(Number(order.total))}</span>
              </div>
              <p className="text-xs text-[#666]">inkl. {formatPrice(Number(order.taxAmount))} MwSt.</p>
            </div>
          </div>

          {/* Addresses */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
              <h3 className="font-bold mb-3">Rechnungsadresse</h3>
              <div className="text-sm text-[#666]">
                {billingAddress.company && <p>{billingAddress.company}</p>}
                <p>{billingAddress.firstName} {billingAddress.lastName}</p>
                <p>{billingAddress.street} {billingAddress.houseNumber}</p>
                <p>{billingAddress.postalCode} {billingAddress.city}</p>
                <p>{countries[billingAddress.country] || billingAddress.country}</p>
              </div>
            </div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
              <h3 className="font-bold mb-3">Lieferadresse</h3>
              <div className="text-sm text-[#666]">
                {shippingAddress.company && <p>{shippingAddress.company}</p>}
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
          <div className="bg-white border border-[#E0E0E0] rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Bestellinformationen</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-[#666]">Bestellnummer</dt>
                <dd className="font-medium">{order.orderNumber}</dd>
              </div>
              <div>
                <dt className="text-[#666]">Bestelldatum</dt>
                <dd className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-[#666]">Zahlungsart</dt>
                <dd className="font-medium">
                  {order.paymentMethod === 'invoice' && 'Rechnung'}
                  {order.paymentMethod === 'card' && 'Kreditkarte'}
                  {order.paymentMethod === 'paypal' && 'PayPal'}
                  {order.paymentMethod === 'sepa' && 'SEPA-Lastschrift'}
                </dd>
              </div>
              <div>
                <dt className="text-[#666]">Zahlungsstatus</dt>
                <dd>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      order.paymentStatus === 'PAID'
                        ? 'bg-[#28A745]/10 text-[#28A745]'
                        : order.paymentStatus === 'FAILED'
                        ? 'bg-[#DC3545]/10 text-[#DC3545]'
                        : 'bg-[#FF6B00]/10 text-[#FF6B00]'
                    }`}
                  >
                    {order.paymentStatus === 'PAID' && 'Bezahlt'}
                    {order.paymentStatus === 'PENDING' && 'Ausstehend'}
                    {order.paymentStatus === 'FAILED' && 'Fehlgeschlagen'}
                    {order.paymentStatus === 'REFUNDED' && 'Erstattet'}
                  </span>
                </dd>
              </div>
            </dl>

            {order.notes && (
              <div className="mt-4 pt-4 border-t border-[#E0E0E0]">
                <p className="text-sm text-[#666]">Bestellnotiz:</p>
                <p className="text-sm">{order.notes}</p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <Button variant="outline" className="w-full" leftIcon={<Download size={16} />}>
                Rechnung herunterladen
              </Button>
              <Link href="/konto/bestellungen">
                <Button variant="ghost" className="w-full">
                  Alle Bestellungen ansehen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Shopping */}
      <div className="text-center mt-12">
        <Link href="/kategorie/schreibwaren">
          <Button variant="primary" size="lg">
            Weiter einkaufen
          </Button>
        </Link>
      </div>
    </div>
  );
}
