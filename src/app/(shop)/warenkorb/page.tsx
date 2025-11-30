'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, Shield, Package, Gift } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';

const FALLBACK_IMAGE = '/images/placeholder-product.svg';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    basePrice: number;
    stockQuantity: number;
    minimumOrderQuantity: number;
    images: { url: string; altText: string | null }[];
  };
}

interface CartData {
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountPercentage: number;
  total: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (productId: string) => {
    setImageErrors(prev => new Set(prev).add(productId));
  };

  const getImageSrc = (productId: string, url: string | undefined) => {
    if (!url || imageErrors.has(productId)) return FALLBACK_IMAGE;
    return url;
  };

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      } else if (response.status === 401) {
        setCart({ items: [], subtotal: 0, discount: 0, discountPercentage: 0, total: 0 });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId: string, productId: string, newQuantity: number) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Fehler beim Aktualisieren');
      }

      await fetchCart();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Fehler beim Aktualisieren');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Fehler beim Entfernen');
      }

      toast.success('Artikel entfernt');
      await fetchCart();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Fehler beim Entfernen');
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

  const isEmpty = !cart || cart.items.length === 0;
  const voucherAmount = cart && cart.total >= 150 ? 10 : cart && cart.total >= 100 ? 5 : 0;
  const voucherThreshold = cart && cart.total < 100 ? 100 - cart.total : cart && cart.total < 150 ? 150 - cart.total : 0;
  const shippingCost = cart && cart.total >= 50 ? 0 : 4.95;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Startseite
            </Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-900 font-medium">Warenkorb</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Warenkorb
          </h1>
          {!isEmpty && (
            <p className="text-gray-600 mt-2">
              {cart.items.length} {cart.items.length === 1 ? 'Artikel' : 'Artikel'} in Ihrem Warenkorb
            </p>
          )}
        </div>
      </div>

      <div className="container py-8">
        {isEmpty ? (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Ihr Warenkorb ist leer
            </h2>
            <p className="text-gray-600 mb-8">
              Entdecken Sie unsere Produkte und fügen Sie Artikel zum Warenkorb hinzu.
            </p>
            <Link
              href="/kategorie/schreibwaren"
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all hover:shadow-lg hover:shadow-red-600/25"
            >
              Produkte entdecken
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => {
                const primaryImage = item.product.images[0];
                const isUpdating = updatingItems.has(item.id);

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border border-gray-100 p-6 transition-all ${
                      isUpdating ? 'opacity-50' : 'hover:shadow-lg hover:shadow-gray-200/50'
                    }`}
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <Link href={`/produkt/${item.product.slug}`} className="flex-shrink-0">
                        <div className="w-28 h-28 bg-gray-50 rounded-xl overflow-hidden">
                          <img
                            src={getImageSrc(item.product.id, primaryImage?.url)}
                            alt={primaryImage?.altText || item.product.name}
                            className="w-full h-full object-contain p-3"
                            onError={() => handleImageError(item.product.id)}
                          />
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/produkt/${item.product.slug}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-red-600 transition-colors line-clamp-2 text-lg">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">Art.-Nr.: {item.product.sku}</p>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= item.product.minimumOrderQuantity || isUpdating}
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stockQuantity || isUpdating}
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">
                              {formatPrice(Number(item.product.basePrice) * item.quantity)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatPrice(Number(item.product.basePrice))} / Stück
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        title="Entfernen"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { icon: Truck, text: 'Kostenloser Versand ab 50€' },
                  { icon: Shield, text: 'Sichere Zahlung' },
                  { icon: Package, text: '14 Tage Rückgabe' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                    <item.icon size={20} className="text-red-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Bestellübersicht</h2>

                <div className="space-y-4">
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
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(cart.total + shippingCost)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">inkl. MwSt.</p>
                    </div>
                  </div>
                </div>

                {/* Voucher Info */}
                {voucherAmount > 0 ? (
                  <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="flex items-center gap-3">
                      <Gift size={20} className="text-green-600" />
                      <p className="text-sm text-green-700 font-medium">
                        Sie erhalten einen {voucherAmount}€ Filialgutschein!
                      </p>
                    </div>
                  </div>
                ) : voucherThreshold > 0 && voucherThreshold <= 50 ? (
                  <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-sm text-amber-700">
                      Noch {formatPrice(voucherThreshold)} bis zum {cart.total < 100 ? '5' : '10'}€ Filialgutschein!
                    </p>
                  </div>
                ) : null}

                {/* Free Shipping Info */}
                {cart.total < 50 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Noch {formatPrice(50 - cart.total)} bis zum kostenlosen Versand</span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-600 rounded-full transition-all"
                        style={{ width: `${Math.min((cart.total / 50) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <Link
                  href="/checkout"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all hover:shadow-lg hover:shadow-red-600/25"
                >
                  Zur Kasse
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/kategorie/schreibwaren"
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-full hover:bg-gray-200 transition-colors"
                >
                  Weiter einkaufen
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
