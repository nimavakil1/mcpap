'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
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
      <div className="container py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  // Calculate voucher eligibility
  const voucherAmount = cart && cart.total >= 150 ? 10 : cart && cart.total >= 100 ? 5 : 0;
  const voucherThreshold = cart && cart.total < 100 ? 100 - cart.total : cart && cart.total < 150 ? 150 - cart.total : 0;

  return (
    <div className="container py-6">
      {/* Breadcrumb */}
      <nav className="breadcrumb mb-6">
        <Link href="/">Startseite</Link>
        <ChevronRight size={16} className="breadcrumb-separator" />
        <span className="text-[#1A1A1A] font-medium">Warenkorb</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">Warenkorb</h1>

      {isEmpty ? (
        <div className="text-center py-16">
          <ShoppingBag size={64} className="mx-auto text-[#999] mb-4" />
          <h2 className="text-xl font-semibold mb-2">Ihr Warenkorb ist leer</h2>
          <p className="text-[#666] mb-6">
            Entdecken Sie unsere Produkte und fügen Sie Artikel zum Warenkorb hinzu.
          </p>
          <Link href="/kategorie/schreibwaren">
            <Button variant="primary">
              Produkte entdecken
              <ArrowRight size={18} className="ml-2" />
            </Button>
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
                  className={`bg-white border border-[#E0E0E0] rounded-lg p-4 ${isUpdating ? 'opacity-50' : ''}`}
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link href={`/produkt/${item.product.slug}`} className="flex-shrink-0">
                      <div className="w-24 h-24 bg-[#F5F5F5] rounded relative overflow-hidden">
                        <Image
                          src={getImageSrc(item.product.id, primaryImage?.url)}
                          alt={primaryImage?.altText || item.product.name}
                          fill
                          className="object-contain p-2"
                          onError={() => handleImageError(item.product.id)}
                          unoptimized={primaryImage?.url?.startsWith('http')}
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/produkt/${item.product.slug}`}>
                        <h3 className="font-semibold text-[#1A1A1A] hover:text-[#E31E24] transition-colors line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-[#666] mt-1">Art.-Nr.: {item.product.sku}</p>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-[#E0E0E0] rounded">
                          <button
                            onClick={() => updateQuantity(item.id, item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= item.product.minimumOrderQuantity || isUpdating}
                            className="p-2 hover:bg-[#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stockQuantity || isUpdating}
                            className="p-2 hover:bg-[#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-bold text-[#E31E24]">
                            {formatPrice(Number(item.product.basePrice) * item.quantity)}
                          </p>
                          <p className="text-xs text-[#666]">
                            {formatPrice(Number(item.product.basePrice))} / Stück
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-[#999] hover:text-[#DC3545] transition-colors p-2"
                      title="Entfernen"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white border border-[#E0E0E0] rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Bestellübersicht</h2>

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
                  <span>{cart.total >= 50 ? 'Kostenlos' : formatPrice(4.95)}</span>
                </div>

                <hr className="border-[#E0E0E0]" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Gesamt</span>
                  <span className="text-[#E31E24]">
                    {formatPrice(cart.total + (cart.total >= 50 ? 0 : 4.95))}
                  </span>
                </div>

                <p className="text-xs text-[#666]">inkl. MwSt.</p>
              </div>

              {/* Voucher Info */}
              {voucherAmount > 0 ? (
                <div className="mt-4 p-3 bg-[#28A745]/10 rounded-lg">
                  <p className="text-sm text-[#28A745] font-medium">
                    🎁 Sie erhalten einen {voucherAmount}€ Filialgutschein!
                  </p>
                </div>
              ) : voucherThreshold > 0 && voucherThreshold <= 50 ? (
                <div className="mt-4 p-3 bg-[#FF6B00]/10 rounded-lg">
                  <p className="text-sm text-[#FF6B00]">
                    Noch {formatPrice(voucherThreshold)} bis zum {cart.total < 100 ? '5' : '10'}€ Filialgutschein!
                  </p>
                </div>
              ) : null}

              {/* Free Shipping Info */}
              {cart.total < 50 && (
                <div className="mt-3 p-3 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#666]">
                    Noch {formatPrice(50 - cart.total)} bis zum kostenlosen Versand
                  </p>
                </div>
              )}

              <Link href="/checkout" className="block mt-6">
                <Button variant="primary" className="w-full" size="lg">
                  Zur Kasse
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>

              <Link href="/kategorie/schreibwaren" className="block mt-3">
                <Button variant="outline" className="w-full">
                  Weiter einkaufen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
