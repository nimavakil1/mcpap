'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, CreditCard, Truck, CheckCircle, Lock, MapPin, Gift, Shield, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
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
  { id: 'address', label: 'Adresse', icon: MapPin },
  { id: 'payment', label: 'Zahlung', icon: CreditCard },
  { id: 'confirm', label: 'Bestätigung', icon: CheckCircle },
];

const COUNTRIES = [
  { value: 'DE', label: 'Deutschland' },
  { value: 'AT', label: 'Österreich' },
  { value: 'CH', label: 'Schweiz' },
];

const PAYMENT_METHODS = [
  { id: 'invoice', label: 'Rechnung', description: 'Zahlung innerhalb von 14 Tagen', icon: FileText },
  { id: 'card', label: 'Kreditkarte', description: 'Visa, Mastercard, American Express', icon: CreditCard },
  { id: 'sepa', label: 'SEPA-Lastschrift', description: 'Bequem per Lastschrift', icon: CreditCard },
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
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg w-48 mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
                ))}
              </div>
              <div className="h-80 bg-gray-200 rounded-2xl"></div>
            </div>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-red-600 transition-colors">Startseite</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <Link href="/warenkorb" className="hover:text-red-600 transition-colors">Warenkorb</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-900 font-medium">Kasse</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Kasse</h1>
        </div>
      </div>

      <div className="container py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle size={22} /> : <StepIcon size={22} />}
                  </div>
                  <span
                    className={`text-sm mt-2 font-medium ${
                      isActive ? 'text-red-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-20 md:w-32 h-1 mx-2 rounded-full ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
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
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                      <MapPin size={20} className="text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Rechnungsadresse</h2>
                      <p className="text-sm text-gray-500">Ihre Rechnungsdaten</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Firma (optional)</label>
                        <input
                          type="text"
                          value={billingAddress.company}
                          onChange={(e) => setBillingAddress({ ...billingAddress, company: e.target.value })}
                          placeholder="Firmenname"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vorname <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={billingAddress.firstName}
                          onChange={(e) => setBillingAddress({ ...billingAddress, firstName: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nachname <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={billingAddress.lastName}
                          onChange={(e) => setBillingAddress({ ...billingAddress, lastName: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                          required
                        />
                      </div>
                      <div className="md:col-span-2 grid grid-cols-4 gap-4">
                        <div className="col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Straße <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={billingAddress.street}
                            onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nr. <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={billingAddress.houseNumber}
                            onChange={(e) => setBillingAddress({ ...billingAddress, houseNumber: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PLZ <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={billingAddress.postalCode}
                          onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Stadt <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={billingAddress.city}
                          onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Land</label>
                        <select
                          value={billingAddress.country}
                          onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefon (optional)</label>
                        <input
                          type="tel"
                          value={billingAddress.phone}
                          onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                          placeholder="+49 123 456789"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                        />
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sameAsBilling}
                          onChange={(e) => setSameAsBilling(e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-gray-700">Lieferadresse entspricht der Rechnungsadresse</span>
                      </label>
                    </div>
                  </div>
                </div>

                {!sameAsBilling && (
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Truck size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Lieferadresse</h2>
                        <p className="text-sm text-gray-500">Ihre Lieferdaten</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Firma (optional)</label>
                          <input
                            type="text"
                            value={shippingAddress.company}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, company: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Vorname <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={shippingAddress.firstName}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nachname <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={shippingAddress.lastName}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                            required
                          />
                        </div>
                        <div className="md:col-span-2 grid grid-cols-4 gap-4">
                          <div className="col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Straße <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              value={shippingAddress.street}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nr. <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              value={shippingAddress.houseNumber}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, houseNumber: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">PLZ <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={shippingAddress.postalCode}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Stadt <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Land</label>
                          <select
                            value={shippingAddress.country}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                          >
                            {COUNTRIES.map((c) => (
                              <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Telefon (optional)</label>
                          <input
                            type="tel"
                            value={shippingAddress.phone}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Link
                    href="/warenkorb"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 bg-white text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={18} />
                    Zurück zum Warenkorb
                  </Link>
                  <button
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all hover:shadow-lg hover:shadow-red-600/25"
                  >
                    Weiter zur Zahlung
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <CreditCard size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Zahlungsart wählen</h2>
                      <p className="text-sm text-gray-500">Wie möchten Sie bezahlen?</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    {PAYMENT_METHODS.map((method) => {
                      const Icon = method.icon;
                      return (
                        <label
                          key={method.id}
                          className={`flex items-center p-5 rounded-xl cursor-pointer transition-all border-2 ${
                            paymentMethod === method.id
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-5 h-5 text-red-600 border-gray-300 focus:ring-red-500"
                          />
                          <div className="ml-4 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              paymentMethod === method.id ? 'bg-red-100' : 'bg-gray-100'
                            }`}>
                              <Icon size={20} className={paymentMethod === method.id ? 'text-red-600' : 'text-gray-500'} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{method.label}</p>
                              <p className="text-sm text-gray-500">{method.description}</p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bestellnotiz (optional)</label>
                  <textarea
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all resize-none"
                    rows={3}
                    placeholder="Anmerkungen zu Ihrer Bestellung..."
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 bg-white text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={18} />
                    Zurück
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all hover:shadow-lg hover:shadow-red-600/25"
                  >
                    Weiter zur Bestätigung
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Order Items */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Ihre Bestellung</h2>
                  </div>
                  <div className="p-6">
                    <div className="divide-y divide-gray-100">
                      {cart.items.map((item) => (
                        <div key={item.id} className="py-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{item.product.name}</p>
                            <p className="text-sm text-gray-500">
                              {item.quantity}x {formatPrice(Number(item.product.basePrice))}
                            </p>
                          </div>
                          <p className="font-bold text-gray-900">
                            {formatPrice(Number(item.product.basePrice) * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Address Summary */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-3">Rechnungsadresse</h3>
                    <div className="text-gray-600 space-y-1">
                      {billingAddress.company && <p>{billingAddress.company}</p>}
                      <p className="font-medium text-gray-900">{billingAddress.firstName} {billingAddress.lastName}</p>
                      <p>{billingAddress.street} {billingAddress.houseNumber}</p>
                      <p>{billingAddress.postalCode} {billingAddress.city}</p>
                      <p>{COUNTRIES.find(c => c.value === billingAddress.country)?.label}</p>
                      {billingAddress.phone && <p className="text-gray-500">Tel: {billingAddress.phone}</p>}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-3">Lieferadresse</h3>
                    <div className="text-gray-600 space-y-1">
                      {(sameAsBilling ? billingAddress : shippingAddress).company && (
                        <p>{(sameAsBilling ? billingAddress : shippingAddress).company}</p>
                      )}
                      <p className="font-medium text-gray-900">
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
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-3">Zahlungsart</h3>
                  <p className="text-gray-600">
                    {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}
                  </p>
                  {orderNote && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-900 mb-1">Bestellnotiz:</p>
                      <p className="text-sm text-gray-600">{orderNote}</p>
                    </div>
                  )}
                </div>

                {/* Terms */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-gray-700">
                      Ich habe die{' '}
                      <Link href="/agb" className="text-red-600 hover:underline">AGB</Link>{' '}
                      und{' '}
                      <Link href="/datenschutz" className="text-red-600 hover:underline">Datenschutzbestimmungen</Link>{' '}
                      gelesen und akzeptiere diese.
                    </span>
                  </label>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 bg-white text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={18} />
                    Zurück
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={!acceptTerms || isSubmitting}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all hover:shadow-lg hover:shadow-red-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Lock size={18} />
                    )}
                    Zahlungspflichtig bestellen
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Bestellübersicht</h2>

              <div className="space-y-2 text-sm mb-4">
                {cart.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-600 truncate pr-2">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="flex-shrink-0 font-medium">
                      {formatPrice(Number(item.product.basePrice) * item.quantity)}
                    </span>
                  </div>
                ))}
                {cart.items.length > 3 && (
                  <p className="text-gray-400 text-xs">
                    + {cart.items.length - 3} weitere Artikel
                  </p>
                )}
              </div>

              <div className="h-px bg-gray-100 my-4" />

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Zwischensumme</span>
                  <span className="font-medium text-gray-900">{formatPrice(cart.subtotal)}</span>
                </div>

                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Rabatt ({cart.discountPercentage}%)</span>
                    <span className="font-medium">-{formatPrice(cart.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Versand</span>
                  <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {shippingCost === 0 ? 'Kostenlos' : formatPrice(shippingCost)}
                  </span>
                </div>

                <div className="h-px bg-gray-100" />

                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold text-gray-900">Gesamt</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-red-600">{formatPrice(finalTotal)}</span>
                    <p className="text-xs text-gray-500">inkl. MwSt.</p>
                  </div>
                </div>
              </div>

              {voucherAmount > 0 && (
                <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-center gap-3">
                    <Gift size={20} className="text-green-600" />
                    <p className="text-sm text-green-700 font-medium">
                      Sie erhalten einen {voucherAmount}€ Filialgutschein!
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <Shield size={14} />
                <span>SSL-verschlüsselte Übertragung</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
