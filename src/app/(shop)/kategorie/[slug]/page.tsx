import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Grid3X3, LayoutGrid, Filter, SlidersHorizontal } from 'lucide-react';
import prisma from '@/lib/db';
import ProductCard from '@/components/shop/ProductCard';
import CategorySidebar from '@/components/shop/CategorySidebar';
import ProductFilters from '@/components/shop/ProductFilters';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return { title: 'Kategorie nicht gefunden' };
  }

  return {
    title: category.seoTitle || category.name,
    description: category.seoDescription || category.description,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
    include: {
      parent: true,
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!category) {
    notFound();
  }

  // Get filter parameters
  const page = parseInt((resolvedSearchParams.page as string) || '1');
  const pageSize = 20;
  const sort = (resolvedSearchParams.sort as string) || 'name';
  const order = (resolvedSearchParams.order as string) || 'asc';
  const minPrice = resolvedSearchParams.minPrice ? parseFloat(resolvedSearchParams.minPrice as string) : undefined;
  const maxPrice = resolvedSearchParams.maxPrice ? parseFloat(resolvedSearchParams.maxPrice as string) : undefined;
  const manufacturer = resolvedSearchParams.manufacturer as string;

  // Build where clause for products
  const where: Record<string, unknown> = {
    isActive: true,
    OR: [{ categoryId: category.id }, { category: { parentId: category.id } }],
  };

  if (minPrice !== undefined) {
    where.basePrice = { ...((where.basePrice as object) || {}), gte: minPrice };
  }
  if (maxPrice !== undefined) {
    where.basePrice = { ...((where.basePrice as object) || {}), lte: maxPrice };
  }
  if (manufacturer) {
    where.manufacturer = manufacturer;
  }

  // Build orderBy
  const orderBy: Record<string, string> = {};
  if (sort === 'price') {
    orderBy.basePrice = order;
  } else if (sort === 'newest') {
    orderBy.createdAt = 'desc';
  } else {
    orderBy.name = order;
  }

  // Get products
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { where: { isPrimary: true } },
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  // Get all manufacturers for filter
  const manufacturers = await prisma.product.findMany({
    where: { categoryId: category.id, isActive: true },
    select: { manufacturer: true },
    distinct: ['manufacturer'],
  });

  // Get all categories for sidebar
  const allCategories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });

  const totalPages = Math.ceil(total / pageSize);

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
            {category.parent && (
              <>
                <Link
                  href={`/kategorie/${category.parent.slug}`}
                  className="hover:text-red-600 transition-colors"
                >
                  {category.parent.name}
                </Link>
                <ChevronRight size={14} className="text-gray-300" />
              </>
            )}
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-gray-600 max-w-2xl">{category.description}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{total}</span> Produkte
              </span>
            </div>
          </div>

          {/* Subcategories */}
          {category.children.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/kategorie/${child.slug}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-red-600 hover:text-white rounded-full text-sm font-medium text-gray-700 transition-all"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <CategorySidebar categories={allCategories} currentSlug={slug} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                  <Filter size={16} />
                  Filter
                </button>
                <div className="hidden sm:flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                  <button className="p-2 rounded-md bg-white shadow-sm text-gray-900">
                    <Grid3X3 size={16} />
                  </button>
                  <button className="p-2 rounded-md text-gray-500 hover:text-gray-900 transition-colors">
                    <LayoutGrid size={16} />
                  </button>
                </div>
              </div>

              <ProductFilters
                manufacturers={manufacturers
                  .map((m) => m.manufacturer)
                  .filter((m): m is string => !!m)}
                currentManufacturer={manufacturer}
                currentSort={sort}
                currentOrder={order}
              />
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {page > 1 && (
                      <Link
                        href={`/kategorie/${slug}?page=${page - 1}`}
                        className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                      >
                        Zurück
                      </Link>
                    )}

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }

                        return (
                          <Link
                            key={pageNum}
                            href={`/kategorie/${slug}?page=${pageNum}`}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                              pageNum === page
                                ? 'bg-red-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </Link>
                        );
                      })}
                    </div>

                    {page < totalPages && (
                      <Link
                        href={`/kategorie/${slug}?page=${page + 1}`}
                        className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                      >
                        Weiter
                      </Link>
                    )}
                  </div>
                )}

                {/* Results info */}
                <p className="text-center text-sm text-gray-500 mt-6">
                  Zeige {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} von{' '}
                  {total} Produkten
                </p>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Keine Produkte gefunden
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  In dieser Kategorie wurden keine Produkte gefunden. Versuchen Sie, die
                  Filter anzupassen oder eine andere Kategorie zu wählen.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-colors"
                >
                  Zur Startseite
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
