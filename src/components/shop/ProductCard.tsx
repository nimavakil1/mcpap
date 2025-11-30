'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

const FALLBACK_IMAGE = '/images/placeholder-product.svg';

interface ProductCardProps {
  product: Product;
  discountPercentage?: number;
  onAddToCart?: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

export default function ProductCard({
  product,
  discountPercentage = 0,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const originalImageUrl = primaryImage?.url;
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = (!originalImageUrl || hasError) ? FALLBACK_IMAGE : originalImageUrl;

  const basePrice = Number(product.basePrice);
  const discountedPrice = discountPercentage > 0
    ? basePrice * (1 - discountPercentage / 100)
    : basePrice;

  const isStoreOnly = !product.isAvailableOnline;

  return (
    <article
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-200 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/produkt/${product.slug}`}>
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <img
            src={imageUrl}
            alt={primaryImage?.altText || product.name}
            className={`w-full h-full object-contain p-6 transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            onError={() => setHasError(true)}
            loading="lazy"
          />

          {/* Gradient overlay on hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/5 to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isStoreOnly && (
              <span className="px-2.5 py-1 bg-gray-900 text-white text-xs font-medium rounded-full">
                Nur in Filiale
              </span>
            )}
            {!isStoreOnly && product.isNewArrival && (
              <span className="px-2.5 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                Neu
              </span>
            )}
            {!isStoreOnly && product.isBestseller && (
              <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                <Star size={10} fill="currentColor" />
                Bestseller
              </span>
            )}
            {!isStoreOnly && discountPercentage > 0 && (
              <span className="px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Quick Actions */}
          {!isStoreOnly && (
            <div
              className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
              }`}
            >
              {onToggleFavorite && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onToggleFavorite(product.id);
                  }}
                  className={`w-9 h-9 rounded-full shadow-lg flex items-center justify-center transition-all ${
                    isFavorite
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                  aria-label={isFavorite ? 'Von Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                >
                  <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              )}
              {onAddToCart && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToCart(product.id);
                  }}
                  className="w-9 h-9 bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 transition-colors"
                  aria-label="In den Warenkorb"
                >
                  <ShoppingCart size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        {product.manufacturer && (
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
            {product.manufacturer}
          </p>
        )}

        <Link href={`/produkt/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-red-600 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-end justify-between gap-2">
          {isStoreOnly ? (
            <div className="text-sm text-gray-500">
              Nur in der Filiale
            </div>
          ) : (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(discountedPrice)}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(basePrice)}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {product.unitOfMeasure}
                {product.unitsPerPackage && ` · ${product.unitsPerPackage} Stück`}
              </p>
            </div>
          )}
        </div>

        {/* Stock indicator */}
        {!isStoreOnly && (
          <div className="mt-3 flex items-center gap-2">
            {product.stockQuantity > 5 ? (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs text-green-600">Auf Lager</span>
              </div>
            ) : product.stockQuantity > 0 ? (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-amber-500 rounded-full" />
                <span className="text-xs text-amber-600">Nur noch {product.stockQuantity}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-xs text-red-600">Nicht verfügbar</span>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
