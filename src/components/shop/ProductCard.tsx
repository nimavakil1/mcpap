'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

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
  const imageUrl = primaryImage?.url || 'https://placehold.co/400x400/F5F5F5/666?text=Kein+Bild';

  const basePrice = Number(product.basePrice);
  const discountedPrice = discountPercentage > 0
    ? basePrice * (1 - discountPercentage / 100)
    : basePrice;

  const isStoreOnly = !product.isAvailableOnline;

  return (
    <article className="product-card group">
      <Link href={`/produkt/${product.slug}`}>
        <div className="product-card-image">
          <Image
            src={imageUrl}
            alt={primaryImage?.altText || product.name}
            width={400}
            height={400}
            className="w-full h-full object-contain p-4"
          />

          {/* Badges */}
          {isStoreOnly && (
            <span className="product-card-badge badge-store-only">Nur in Filiale</span>
          )}
          {!isStoreOnly && product.isNewArrival && (
            <span className="product-card-badge badge-new">Neu</span>
          )}
          {!isStoreOnly && discountPercentage > 0 && (
            <span className="product-card-badge badge-sale">-{discountPercentage}%</span>
          )}

          {/* Quick Actions */}
          {!isStoreOnly && (
            <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onToggleFavorite && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onToggleFavorite(product.id);
                  }}
                  className={`p-2 rounded-full shadow-md transition-colors ${
                    isFavorite
                      ? 'bg-[#E31E24] text-white'
                      : 'bg-white text-[#666] hover:text-[#E31E24]'
                  }`}
                  aria-label={isFavorite ? 'Von Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                >
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              )}
              {onAddToCart && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToCart(product.id);
                  }}
                  className="p-2 bg-[#E31E24] text-white rounded-full shadow-md hover:bg-[#C41A1F] transition-colors"
                  aria-label="In den Warenkorb"
                >
                  <ShoppingCart size={18} />
                </button>
              )}
            </div>
          )}
        </div>
      </Link>

      <div className="product-card-body">
        {product.manufacturer && (
          <p className="text-xs text-[#999] uppercase tracking-wide mb-1">{product.manufacturer}</p>
        )}

        <Link href={`/produkt/${product.slug}`}>
          <h3 className="product-card-title hover:text-[#E31E24]">{product.name}</h3>
        </Link>

        {product.shortDescription && (
          <p className="text-sm text-[#666] mt-1 line-clamp-1">{product.shortDescription}</p>
        )}

        <div className="mt-3">
          {isStoreOnly ? (
            <div className="text-sm text-[#666] font-medium">
              Nur in der Filiale erhältlich
            </div>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="product-card-price">{formatPrice(discountedPrice)}</span>
              {discountPercentage > 0 && (
                <span className="product-card-price-old">{formatPrice(basePrice)}</span>
              )}
            </div>
          )}
        </div>

        {!isStoreOnly && product.stockQuantity <= 5 && product.stockQuantity > 0 && (
          <p className="text-xs text-[#FF6B00] mt-2">Nur noch {product.stockQuantity} verfügbar</p>
        )}

        {!isStoreOnly && product.stockQuantity === 0 && (
          <p className="text-xs text-[#DC3545] mt-2">Derzeit nicht verfügbar</p>
        )}

        {!isStoreOnly && (
          <p className="text-xs text-[#999] mt-1">
            {product.unitOfMeasure}
            {product.unitsPerPackage && ` (${product.unitsPerPackage} Stück)`}
          </p>
        )}
      </div>
    </article>
  );
}
