'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, CreditCard, Truck, CheckCircle, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import { formatPrice } from '@/lib/utils';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    sku: string;
    basePrice: number;
  };
}

interface CartData {
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountPercentage: number;
  total: number;
}

interface AddressData {
  company: string;
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
}

const STEPS = [
  { id: 'address', label: 'Adresse', icon: Truck },
  { id: 'payment', label: 'Zahlung', icon: CreditCard },
  { id: 'confirm', label: 'Bestätigung', icon: CheckCircle },
];

const COUNTRIES = [
  { value: 'DE', label: 'Deutschland' },
  { value: 'AT', label: 'Österreich' },
  { value: 'CH', label: 'Schweiz' },
];

const PAYMENT_METHODS = [
  { id: 'invoice', label: 'Rechnung', description: 'Zahlung innerhalb von 14 Tagen' },
  { id: 'card', label: 'Kreditkarte', description: 'Visa, Mastercard, American Express' },
  { id: 'paypal', label: 'PayPal', description: 'Sicher bezahlen mit PayPal' },
  { id: 'sepa', label: 'SEPA-Lastschrift', description: 'Bequem per Lastschrift' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<AddressData>({
    company: '',
    firstName: '',
    lastName: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    country: 'DE',
    phone: '',
  });

  const [billingAddress, setBillingAddress] = useState<AddressData>({
    company: '',
    firstName: '',
    lastName: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    country: 'DE',
    phone: '',
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('invoice');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [orderNote, setOrderNote] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          if (data.items.length === 0) {
            router.push('/warenkorb');
            return;
          }
          setCart(data);
        } else if (response.status === 401) {
          toast.error('Bitte melden Sie sich an, um fortzufahren');
          router.push('/anmelden?redirect=/checkout');
          return;
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Fehler beim Laden des Warenkorbs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [router]);

  const validateAddress = (address: AddressData): string[] => {
    const errors: string[] = [];
    if (!address.firstName) errors.push('Vorname ist erforderlich');
    if (!address.lastName) errors.push('Nachname ist erforderlich');
    if (!address.street) errors.push('Straße ist erforderlich');
    if (!address.houseNumber) errors.push('Hausnummer ist erforderlich');
    if (!address.postalCode) errors.push('PLZ ist erforderlich');
    if (!address.city) errors.push('Stadt ist erforderlich');
    return errors;
  };

  const handleNextStep = () => {
    if (currentStep === 0) {
      const billingErrors = validateAddress(billingAddress);
      if (billingErrors.length > 0) {
        toast.error(billingErrors[0]);
        return;
      }
      if (!sameAsBilling) {
        const shippingErrors = validateAddress(shippingAddress);
        if (shippingErrors.length > 0) {
          toast.error(shippingErrors[0]);
          return;
        }
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmitOrder = async () => {
    if (!acceptTerms) {
      toast.error('Bitte akzeptieren Sie die AGB');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billingAddress,
          shippingAddress: sameAsBilling ? billingAddress : shippingAddress,
          paymentMethod,
          orderNote,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler bei der Bestellung');
      }

      toast.success('Bestellung erfolgreich aufgegeben!');
      router.push(`/bestellung/${data.orderNumber}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Fehler bei der Bestellung');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart) {
    return null;
  }

  const shippingCost = cart.total >= 50 ? 0 : 4.95;
  const finalTotal = cart.total + shippingCost;
  const voucherAmount = finalTotal >= 150 ? 10 : finalTotal >= 100 ? 5 : 0;

  return (
    <div className="container py-6">
      {/* Breadcrumb */}
      <nav className="breadcrumb mb-6">
        <Link href="/">Startseite</Link>
        <ChevronRight size={16} className="breadcrumb-separator" />
        <Link href="/warenkorb">Warenkorb</Link>
        <ChevronRight size={16} className="breadcrumb-separator" />
        <span className="text-[#1A1A1A] font-medium">Kasse</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">Kasse</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8 overflow-x-auto">
        {STEPS.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-[#E31E24] text-white'
                      : isCompleted
                      ? 'bg-[#28A745] text-white'
                      : 'bg-[#E0E0E0] text-[#666]'
                  }`}
                >
                  {isCompleted ? <CheckCircle size={20} /> : <StepIcon size={20} />}
                </div>
                <span
                  className={`text-xs mt-1 ${
                    isActive ? 'text-[#E31E24] font-medium' : 'text-[#666]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-2 ${
                    isCompleted ? 'bg-[#28A745]' : 'bg-[#E0E0E0]'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {currentStep === 0 && (
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Rechnungsadresse</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Firma (optional)"
                    value={billingAddress.company}
                    onChange={(e) => setBillingAddress({ ...billingAddress, company: e.target.value })}
                    placeholder="Firmenname"
                  />
                </div>
                <Input
                  label="Vorname"
                  value={billingAddress.firstName}
                  onChange={(e) => setBillingAddress({ ...billingAddress, firstName: e.target.value })}
                  required
                />
                <Input
                  label="Nachname"
                  value={billingAddress.lastName}
                  onChange={(e) => setBillingAddress({ ...billingAddress, lastName: e.target.value })}
                  required
                />
                <div className="md:col-span-2 grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Input
                      label="Straße"
                      value={billingAddress.street}
                      onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                      required
                    />
                  </div>
                  <Input
                    label="Nr."
                    value={billingAddress.houseNumber}
                    onChange={(e) => setBillingAddress({ ...billingAddress, houseNumber: e.target.value })}
                    required
                  />
                </div>
                <Input
                  label="PLZ"
                  value={billingAddress.postalCode}
                  onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })}
                  required
                />
                <Input
                  label="Stadt"
                  value={billingAddress.city}
                  onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                  required
                />
                <Select
                  label="Land"
                  value={billingAddress.country}
                  onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                  options={COUNTRIES}
                />
                <Input
                  label="Telefon (optional)"
                  type="tel"
                  value={billingAddress.phone}
                  onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                  placeholder="+49 123 456789"
                />
              </div>

              <div className="mt-6 pt-6 border-t border-[#E0E0E0]">
                <Checkbox
                  label="Lieferadresse entspricht der Rechnungsadresse"
                  checked={sameAsBilling}
                  onChange={(e) => setSameAsBilling(e.target.checked)}
                />
              </div>

              {!sameAsBilling && (
                <div className="mt-6">
                  <h2 className="text-lg font-bold mb-4">Lieferadresse</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Firma (optional)"
                        value={shippingAddress.company}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, company: e.target.value })}
                      />
                    </div>
                    <Input
                      label="Vorname"
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                      required
                    />
                    <Input
                      label="Nachname"
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                      required
                    />
                    <div className="md:col-span-2 grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <Input
                          label="Straße"
                          value={shippingAddress.street}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                          required
                        />
                      </div>
                      <Input
                        label="Nr."
                        value={shippingAddress.houseNumber}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, houseNumber: e.target.value })}
                        required
                      />
                    </div>
                    <Input
                      label="PLZ"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      required
                    />
                    <Input
                      label="Stadt"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      required
                    />
                    <Select
                      label="Land"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      options={COUNTRIES}
                    />
                    <Input
                      label="Telefon (optional)"
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <Link href="/warenkorb">
                  <Button variant="outline">
                    <ChevronLeft size={18} className="mr-2" />
                    Zurück zum Warenkorb
                  </Button>
                </Link>
                <Button variant="primary" onClick={handleNextStep}>
                  Weiter zur Zahlung
                  <ChevronRight size={18} className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {currentStep === 1 && (
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Zahlungsart wählen</h2>

              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === method.id
                        ? 'border-[#E31E24] bg-[#E31E24]/5'
                        : 'border-[#E0E0E0] hover:border-[#999]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-[#E31E24]"
                    />
                    <div className="ml-3">
                      <p className="font-medium">{method.label}</p>
                      <p className="text-sm text-[#666]">{method.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Bestellnotiz (optional)</label>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  className="w-full border border-[#E0E0E0] rounded-lg p-3 focus:outline-none focus:border-[#E31E24]"
                  rows={3}
                  placeholder="Anmerkungen zu Ihrer Bestellung..."
                />
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrevStep}>
                  <ChevronLeft size={18} className="mr-2" />
                  Zurück
                </Button>
                <Button variant="primary" onClick={handleNextStep}>
                  Weiter zur Bestätigung
                  <ChevronRight size={18} className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Order Items */}
              <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
                <h2 className="text-lg font-bold mb-4">Ihre Bestellung</h2>
                <div className="divide-y divide-[#E0E0E0]">
                  {cart.items.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-[#666]">
                          {item.quantity}x {formatPrice(Number(item.product.basePrice))}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(Number(item.product.basePrice) * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address Summary */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
                  <h3 className="font-bold mb-3">Rechnungsadresse</h3>
                  <div className="text-sm text-[#666]">
                    {billingAddress.company && <p>{billingAddress.company}</p>}
                    <p>{billingAddress.firstName} {billingAddress.lastName}</p>
                    <p>{billingAddress.street} {billingAddress.houseNumber}</p>
                    <p>{billingAddress.postalCode} {billingAddress.city}</p>
                    <p>{COUNTRIES.find(c => c.value === billingAddress.country)?.label}</p>
                    {billingAddress.phone && <p>Tel: {billingAddress.phone}</p>}
                  </div>
                </div>
                <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
                  <h3 className="font-bold mb-3">Lieferadresse</h3>
                  <div className="text-sm text-[#666]">
                    {(sameAsBilling ? billingAddress : shippingAddress).company && (
                      <p>{(sameAsBilling ? billingAddress : shippingAddress).company}</p>
                    )}
                    <p>
                      {(sameAsBilling ? billingAddress : shippingAddress).firstName}{' '}
                      {(sameAsBilling ? billingAddress : shippingAddress).lastName}
                    </p>
                    <p>
                      {(sameAsBilling ? billingAddress : shippingAddress).street}{' '}
                      {(sameAsBilling ? billingAddress : shippingAddress).houseNumber}
                    </p>
                    <p>
                      {(sameAsBilling ? billingAddress : shippingAddress).postalCode}{' '}
                      {(sameAsBilling ? billingAddress : shippingAddress).city}
                    </p>
                    <p>
                      {COUNTRIES.find(
                        (c) => c.value === (sameAsBilling ? billingAddress : shippingAddress).country
                      )?.label}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
                <h3 className="font-bold mb-3">Zahlungsart</h3>
                <p className="text-[#666]">
                  {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}
                </p>
                {orderNote && (
                  <div className="mt-3 pt-3 border-t border-[#E0E0E0]">
                    <p className="text-sm font-medium">Bestellnotiz:</p>
                    <p className="text-sm text-[#666]">{orderNote}</p>
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="bg-white border border-[#E0E0E0] rounded-lg p-6">
                <Checkbox
                  label={
                    <span>
                      Ich habe die{' '}
                      <Link href="/agb" className="text-[#E31E24] hover:underline">
                        AGB
                      </Link>{' '}
                      und{' '}
                      <Link href="/datenschutz" className="text-[#E31E24] hover:underline">
                        Datenschutzbestimmungen
                      </Link>{' '}
                      gelesen und akzeptiere diese.
                    </span>
                  }
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevStep}>
                  <ChevronLeft size={18} className="mr-2" />
                  Zurück
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmitOrder}
                  isLoading={isSubmitting}
                  disabled={!acceptTerms}
                >
                  <Lock size={18} className="mr-2" />
                  Zahlungspflichtig bestellen
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="bg-white border border-[#E0E0E0] rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Bestellübersicht</h2>

            <div className="space-y-2 text-sm mb-4">
              {cart.items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-[#666] truncate pr-2">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="flex-shrink-0">
                    {formatPrice(Number(item.product.basePrice) * item.quantity)}
                  </span>
                </div>
              ))}
              {cart.items.length > 3 && (
                <p className="text-[#666] text-xs">
                  + {cart.items.length - 3} weitere Artikel
                </p>
              )}
            </div>

            <hr className="border-[#E0E0E0] my-4" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#666]">Zwischensumme</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>

              {cart.discount > 0 && (
                <div className="flex justify-between text-[#28A745]">
                  <span>Rabatt ({cart.discountPercentage}%)</span>
                  <span>-{formatPrice(cart.discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-[#666]">Versand</span>
                <span>{shippingCost === 0 ? 'Kostenlos' : formatPrice(shippingCost)}</span>
              </div>

              <hr className="border-[#E0E0E0]" />

              <div className="flex justify-between text-lg font-bold">
                <span>Gesamt</span>
                <span className="text-[#E31E24]">{formatPrice(finalTotal)}</span>
              </div>

              <p className="text-xs text-[#666]">inkl. MwSt.</p>
            </div>

            {voucherAmount > 0 && (
              <div className="mt-4 p-3 bg-[#28A745]/10 rounded-lg">
                <p className="text-sm text-[#28A745] font-medium">
                  🎁 Sie erhalten einen {voucherAmount}€ Filialgutschein!
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-xs text-[#666]">
              <Lock size={14} />
              <span>SSL-verschlüsselte Übertragung</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
