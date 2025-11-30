import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Store, Package, Truck, Shield, RotateCcw, CheckCircle2 } from 'lucide-react';
import prisma from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import { getSession } from '@/lib/auth';
import ProductCard from '@/components/shop/ProductCard';
import AddToCartButton from '@/components/shop/AddToCartButton';
import ProductImageGallery from '@/components/shop/ProductImageGallery';

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Startseite
            </Link>
            <ChevronRight size={14} className="text-gray-300" />
            {product.category?.parent && (
              <>
                <Link
                  href={`/kategorie/${product.category.parent.slug}`}
                  className="hover:text-red-600 transition-colors"
                >
                  {product.category.parent.name}
                </Link>
                <ChevronRight size={14} className="text-gray-300" />
              </>
            )}
            {product.category && (
              <>
                <Link
                  href={`/kategorie/${product.category.slug}`}
                  className="hover:text-red-600 transition-colors"
                >
                  {product.category.name}
                </Link>
                <ChevronRight size={14} className="text-gray-300" />
              </>
            )}
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Product Images */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
              isStoreOnly={isStoreOnly}
            />
          </div>

          {/* Product Info */}
          <div>
            {product.manufacturer && (
              <Link
                href={`/suche?manufacturer=${encodeURIComponent(product.manufacturer)}`}
                className="inline-block text-sm text-gray-400 uppercase tracking-wider font-medium mb-2 hover:text-red-600 transition-colors"
              >
                {product.manufacturer}
              </Link>
            )}

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="text-gray-600 text-lg mb-6">{product.shortDescription}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Art.-Nr.: {product.sku}
              </span>
              {product.ean && (
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  EAN: {product.ean}
                </span>
              )}
            </div>

            {/* Price Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              {isStoreOnly ? (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Store size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      Nur in der Filiale erhältlich
                    </p>
                    <p className="text-sm text-gray-500">
                      Dieses Produkt ist nicht online verfügbar. Besuchen Sie eine unserer Filialen.
                    </p>
                    <Link
                      href="/filialen"
                      className="inline-flex items-center gap-2 mt-3 text-red-600 text-sm font-medium hover:text-red-700 transition-colors"
                    >
                      Filiale finden
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(discountedPrice)}
                    </span>
                    {discountPercentage > 0 && (
                      <>
                        <span className="text-xl text-gray-400 line-through">
                          {formatPrice(basePrice)}
                        </span>
                        <span className="px-2.5 py-1 bg-red-600 text-white text-sm font-bold rounded-full">
                          -{discountPercentage}%
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mb-4">
                    inkl. {Number(product.taxRate)}% MwSt., zzgl. Versandkosten
                  </p>

                  {/* Stock Status */}
                  {product.stockQuantity > 0 ? (
                    <div className="flex items-center gap-2 mb-6">
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-sm font-medium text-green-600">
                        Auf Lager
                        {product.stockQuantity <= 5 && (
                          <span className="text-amber-600 ml-1">
                            (nur noch {product.stockQuantity} verfügbar)
                          </span>
                        )}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-6">
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                      <span className="text-sm font-medium text-red-600">
                        Derzeit nicht verfügbar
                      </span>
                    </div>
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

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Truck, text: 'Lieferzeit 2-3 Werktage' },
                { icon: Package, text: 'Kostenloser Versand ab 50€' },
                { icon: Shield, text: 'Sichere Zahlung' },
                { icon: RotateCcw, text: '14 Tage Rückgaberecht' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100"
                >
                  <item.icon size={18} className="text-red-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Description */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Produktbeschreibung</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.description || product.shortDescription || 'Keine Beschreibung verfügbar.'}
                </p>
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Spezifikationen</h2>
              <div className="space-y-3">
                {product.attributes.map((attr: { id: string; name: string; value: string }) => (
                  <div
                    key={attr.id}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-sm text-gray-500">{attr.name}</span>
                    <span className="text-sm font-medium text-gray-900">{attr.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Einheit</span>
                  <span className="text-sm font-medium text-gray-900">{product.unitOfMeasure}</span>
                </div>
                {product.unitsPerPackage && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Inhalt</span>
                    <span className="text-sm font-medium text-gray-900">
                      {product.unitsPerPackage} Stück
                    </span>
                  </div>
                )}
                {product.weightGrams && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-500">Gewicht</span>
                    <span className="text-sm font-medium text-gray-900">{product.weightGrams}g</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Ähnliche Produkte</h2>
              {product.category && (
                <Link
                  href={`/kategorie/${product.category.slug}`}
                  className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1 transition-colors"
                >
                  Alle anzeigen
                  <ChevronRight size={16} />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relProduct: any) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
