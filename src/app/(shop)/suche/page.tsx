import Link from 'next/link';
import { Search } from 'lucide-react';
import prisma from '@/lib/db';
import ProductCard from '@/components/shop/ProductCard';
import ProductFilters from '@/components/shop/ProductFilters';

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q as string;
  return {
    title: query ? `Suche: ${query}` : 'Suche',
    description: `Suchergebnisse für "${query}" bei McPaper`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q as string) || '';
  const page = parseInt((params.page as string) || '1');
  const pageSize = 20;
  const sort = (params.sort as string) || 'name';
  const order = (params.order as string) || 'asc';
  const manufacturer = params.manufacturer as string;

  if (!query) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Search size={64} className="mx-auto text-[#E0E0E0] mb-4" />
          <h1 className="text-2xl font-bold mb-4">Produktsuche</h1>
          <p className="text-[#666] mb-6">
            Geben Sie einen Suchbegriff ein, um Produkte zu finden.
          </p>
          <form action="/suche" method="get" className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                name="q"
                placeholder="Produkte suchen..."
                className="input pr-12"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#666] hover:text-[#E31E24]"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Build where clause for full-text search
  const where = {
    isActive: true,
    OR: [
      { name: { contains: query, mode: 'insensitive' as const } },
      { description: { contains: query, mode: 'insensitive' as const } },
      { shortDescription: { contains: query, mode: 'insensitive' as const } },
      { sku: { contains: query, mode: 'insensitive' as const } },
      { ean: { contains: query, mode: 'insensitive' as const } },
      { manufacturer: { contains: query, mode: 'insensitive' as const } },
    ],
    ...(manufacturer ? { manufacturer } : {}),
  };

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
        category: true,
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  // Get manufacturers for filter
  const manufacturers = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { sku: { contains: query, mode: 'insensitive' } },
        { ean: { contains: query, mode: 'insensitive' } },
        { manufacturer: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: { manufacturer: true },
    distinct: ['manufacturer'],
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Suchergebnisse für &quot;{query}&quot;
          </h1>
          <p className="text-[#666] text-sm mt-1">{total} Produkte gefunden</p>
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
                  href={`/suche?q=${encodeURIComponent(query)}&page=${page - 1}`}
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
                    href={`/suche?q=${encodeURIComponent(query)}&page=${pageNum}`}
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
                  href={`/suche?q=${encodeURIComponent(query)}&page=${page + 1}`}
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
          <Search size={64} className="mx-auto text-[#E0E0E0] mb-4" />
          <h2 className="text-xl font-semibold mb-2">Keine Ergebnisse gefunden</h2>
          <p className="text-[#666] mb-6">
            Versuchen Sie es mit anderen Suchbegriffen oder stöbern Sie in unseren Kategorien.
          </p>
          <Link href="/" className="btn btn-primary">
            Zur Startseite
          </Link>
        </div>
      )}
    </div>
  );
}
