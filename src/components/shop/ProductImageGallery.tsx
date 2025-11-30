'use client';

import { useState } from 'react';

const FALLBACK_IMAGE = '/images/placeholder-product.svg';

interface ProductImageData {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
}

interface ProductImageGalleryProps {
  images: ProductImageData[];
  productName: string;
  isStoreOnly?: boolean;
}

export default function ProductImageGallery({
  images,
  productName,
  isStoreOnly = false,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ProductImageData | null>(
    images.find((img) => img.isPrimary) || images[0] || null
  );
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (imageId: string) => {
    setImageErrors((prev) => new Set(prev).add(imageId));
  };

  const getImageSrc = (image: ProductImageData | null) => {
    if (!image) return FALLBACK_IMAGE;
    if (!image.url) return FALLBACK_IMAGE;
    if (imageErrors.has(image.id)) return FALLBACK_IMAGE;
    return image.url;
  };

  return (
    <div>
      <div className="bg-[#F5F5F5] rounded-lg aspect-square relative overflow-hidden mb-4">
        {/* Using native img for reliable error handling */}
        <img
          src={getImageSrc(selectedImage)}
          alt={selectedImage?.altText || productName}
          className="absolute inset-0 w-full h-full object-contain p-8"
          onError={() => selectedImage && handleImageError(selectedImage.id)}
        />

        {isStoreOnly && (
          <div className="absolute top-4 left-4 bg-[#1A1A1A] text-white px-3 py-1 rounded text-sm font-medium">
            Nur in Filiale
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className={`w-20 h-20 flex-shrink-0 bg-[#F5F5F5] rounded border-2 overflow-hidden ${
                selectedImage?.id === image.id ? 'border-[#E31E24]' : 'border-transparent'
              }`}
            >
              <img
                src={getImageSrc(image)}
                alt={image.altText || ''}
                className="object-contain p-1 w-full h-full"
                onError={() => handleImageError(image.id)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
