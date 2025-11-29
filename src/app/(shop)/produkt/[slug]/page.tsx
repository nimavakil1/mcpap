import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Minus, Plus, ShoppingCart, Heart, Store, Package, Truck } from 'lucide-react';
import prisma from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import { getSession } from '@/lib/auth';
import ProductCard from '@/components/shop/ProductCard';
import AddToCartButton from '@/components/shop/AddToCartButton';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return { title: 'Produkt nicht gefunden' };
  }

  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription || product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: {
        include: {
          parent: true,
        },
      },
      images: {
        orderBy: { sortOrder: 'asc' },
      },
      attributes: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Check if product is store-only
  let isStoreOnly = !product.isAvailableOnline;
  if (product.ean) {
    const exclusion = await prisma.eanExclusion.findUnique({
      where: { ean: product.ean },
    });
    if (exclusion) {
      isStoreOnly = true;
    }
  }

  // Get related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: {
      images: { where: { isPrimary: true } },
    },
    take: 4,
  });

  // Get user session for discount
  const session = await getSession();
  const discountPercentage = session?.discountPercentage || 0;

  const basePrice = Number(product.basePrice);
  const discountedPrice = discountPercentage > 0
    ? basePrice * (1 - discountPercentage / 100)
    : basePrice;

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

  return (
    <div className="container py-6">
      {/* Breadcrumb */}
      <nav className="breadcrumb mb-6">
        <Link href="/">Startseite</Link>
        <ChevronRight size={16} className="breadcrumb-separator" />
        {product.category?.parent && (
          <>
            <Link href={`/kategorie/${product.category.parent.slug}`}>
              {product.category.parent.name}
            </Link>
            <ChevronRight size={16} className="breadcrumb-separator" />
          </>
        )}
        {product.category && (
          <>
            <Link href={`/kategorie/${product.category.slug}`}>{product.category.name}</Link>
            <ChevronRight size={16} className="breadcrumb-separator" />
          </>
        )}
        <span className="text-[#1A1A1A] font-medium">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <div className="bg-[#F5F5F5] rounded-lg aspect-square relative overflow-hidden mb-4">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText || product.name}
                fill
                className="object-contain p-8"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#999]">
                Kein Bild verfügbar
              </div>
            )}

            {isStoreOnly && (
              <div className="absolute top-4 left-4 bg-[#1A1A1A] text-white px-3 py-1 rounded text-sm font-medium">
                Nur in Filiale
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image) => (
                <button
                  key={image.id}
                  className={`w-20 h-20 flex-shrink-0 bg-[#F5F5F5] rounded border-2 overflow-hidden ${
                    image.isPrimary ? 'border-[#E31E24]' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || ''}
                    width={80}
                    height={80}
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {product.manufacturer && (
            <p className="text-sm text-[#999] uppercase tracking-wide mb-1">
              {product.manufacturer}
            </p>
          )}

          <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>

          {product.shortDescription && (
            <p className="text-[#666] mb-4">{product.shortDescription}</p>
          )}

          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-[#666]">Art.-Nr.: {product.sku}</span>
            {product.ean && <span className="text-sm text-[#666]">EAN: {product.ean}</span>}
          </div>

          {/* Price */}
          <div className="bg-[#F5F5F5] rounded-lg p-6 mb-6">
            {isStoreOnly ? (
              <div className="flex items-center gap-3 text-[#666]">
                <Store size={24} />
                <div>
                  <p className="font-semibold">Nur in der Filiale erhältlich</p>
                  <p className="text-sm">
                    Dieses Produkt ist nicht online verfügbar. Besuchen Sie eine unserer Filialen.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold text-[#E31E24]">
                    {formatPrice(discountedPrice)}
                  </span>
                  {discountPercentage > 0 && (
                    <>
                      <span className="text-lg text-[#999] line-through">
                        {formatPrice(basePrice)}
                      </span>
                      <span className="bg-[#E31E24] text-white text-sm px-2 py-1 rounded">
                        -{discountPercentage}%
                      </span>
                    </>
                  )}
                </div>

                <p className="text-sm text-[#666] mb-4">
                  inkl. {Number(product.taxRate)}% MwSt., zzgl. Versandkosten
                </p>

                {/* Stock Status */}
                {product.stockQuantity > 0 ? (
                  <p className="text-sm text-[#28A745] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#28A745] rounded-full"></span>
                    Auf Lager
                    {product.stockQuantity <= 5 && ` (nur noch ${product.stockQuantity} verfügbar)`}
                  </p>
                ) : (
                  <p className="text-sm text-[#DC3545] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#DC3545] rounded-full"></span>
                    Derzeit nicht verfügbar
                  </p>
                )}

                {/* Add to Cart */}
                <AddToCartButton
                  productId={product.id}
                  productName={product.name}
                  minQuantity={product.minimumOrderQuantity}
                  maxQuantity={product.stockQuantity}
                  disabled={product.stockQuantity === 0}
                />
              </>
            )}
          </div>

          {/* USPs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Truck size={18} className="text-[#E31E24]" />
              Lieferzeit 2-3 Werktage
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Package size={18} className="text-[#E31E24]" />
              Kostenloser Versand ab 50€
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Description */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Produktbeschreibung</h2>
          <div className="prose max-w-none text-[#666]">
            {product.description || product.shortDescription || 'Keine Beschreibung verfügbar.'}
          </div>
        </div>

        {/* Attributes */}
        {product.attributes.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Spezifikationen</h2>
            <table className="w-full text-sm">
              <tbody>
                {product.attributes.map((attr) => (
                  <tr key={attr.id} className="border-b border-[#E0E0E0]">
                    <td className="py-2 text-[#666]">{attr.name}</td>
                    <td className="py-2 font-medium text-right">{attr.value}</td>
                  </tr>
                ))}
                <tr className="border-b border-[#E0E0E0]">
                  <td className="py-2 text-[#666]">Einheit</td>
                  <td className="py-2 font-medium text-right">{product.unitOfMeasure}</td>
                </tr>
                {product.unitsPerPackage && (
                  <tr className="border-b border-[#E0E0E0]">
                    <td className="py-2 text-[#666]">Inhalt</td>
                    <td className="py-2 font-medium text-right">
                      {product.unitsPerPackage} Stück
                    </td>
                  </tr>
                )}
                {product.weightGrams && (
                  <tr className="border-b border-[#E0E0E0]">
                    <td className="py-2 text-[#666]">Gewicht</td>
                    <td className="py-2 font-medium text-right">{product.weightGrams}g</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-6">Ähnliche Produkte</h2>
          <div className="product-grid">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct as any} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
