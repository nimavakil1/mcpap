import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
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
    <div className="container py-6">
      {/* Breadcrumb */}
      <nav className="breadcrumb mb-6">
        <Link href="/">Startseite</Link>
        <ChevronRight size={16} className="breadcrumb-separator" />
        {category.parent && (
          <>
            <Link href={`/kategorie/${category.parent.slug}`}>{category.parent.name}</Link>
            <ChevronRight size={16} className="breadcrumb-separator" />
          </>
        )}
        <span className="text-[#1A1A1A] font-medium">{category.name}</span>
      </nav>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <CategorySidebar categories={allCategories} currentSlug={slug} />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">{category.name}</h1>
              <p className="text-[#666] text-sm mt-1">{total} Produkte</p>
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

          {category.description && (
            <p className="text-[#666] mb-6">{category.description}</p>
          )}

          {/* Subcategories */}
          {category.children.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/kategorie/${child.slug}`}
                  className="px-4 py-2 bg-[#F5F5F5] rounded-full text-sm hover:bg-[#E31E24] hover:text-white transition-colors"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {products.length > 0 ? (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {page > 1 && (
                    <Link
                      href={`/kategorie/${slug}?page=${page - 1}`}
                      className="btn btn-outline btn-sm"
                    >
                      Zurück
                    </Link>
                  )}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Link
                        key={pageNum}
                        href={`/kategorie/${slug}?page=${pageNum}`}
                        className={`btn btn-sm ${
                          pageNum === page ? 'btn-primary' : 'btn-outline'
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                  {page < totalPages && (
                    <Link
                      href={`/kategorie/${slug}?page=${page + 1}`}
                      className="btn btn-outline btn-sm"
                    >
                      Weiter
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#666]">Keine Produkte in dieser Kategorie gefunden.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
