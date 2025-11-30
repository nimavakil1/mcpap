'use client';

import { useState } from 'react';
import Image from 'next/image';

const FALLBACK_IMAGE = '/images/placeholder-product.svg';

interface ProductImageProps {
  src: string | undefined | null;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}

export default function ProductImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
}: ProductImageProps) {
  const originalSrc = src || FALLBACK_IMAGE;
  const [imageSrc, setImageSrc] = useState(originalSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(FALLBACK_IMAGE);
    }
  };

  const isExternal = imageSrc.startsWith('http');

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        priority={priority}
        onError={handleError}
        unoptimized={isExternal}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width || 400}
      height={height || 400}
      className={className}
      priority={priority}
      onError={handleError}
      unoptimized={isExternal}
    />
  );
}
