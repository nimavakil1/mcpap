import Link from 'next/link';
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50">
        {/* Hero Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="container py-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-gray-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Produktsuche
              </h1>
              <p className="text-gray-600 mb-8">
                Geben Sie einen Suchbegriff ein, um Produkte zu finden.
              </p>
              <form action="/suche" method="get" className="max-w-lg mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    name="q"
                    placeholder="Produkte suchen..."
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all text-lg"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </form>

              {/* Popular Searches */}
              <div className="mt-8">
                <p className="text-sm text-gray-500 mb-3">Beliebte Suchen:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Kugelschreiber', 'Notizbuch', 'Ordner', 'Tinte', 'Papier A4'].map((term) => (
                    <Link
                      key={term}
                      href={`/suche?q=${encodeURIComponent(term)}`}
                      className="px-4 py-2 bg-gray-100 hover:bg-red-600 hover:text-white rounded-full text-sm font-medium text-gray-700 transition-all"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Suchergebnisse für</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                &quot;{query}&quot;
              </h1>
              <p className="text-gray-600 mt-2">
                <span className="font-semibold text-gray-900">{total}</span> Produkte gefunden
              </p>
            </div>

            {/* New Search */}
            <form action="/suche" method="get" className="w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Neue Suche..."
                  className="w-full md:w-80 px-5 py-3 bg-gray-50 border border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {products.length > 0 ? (
          <>
            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  Zeige {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} von {total}
                </span>
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
                    href={`/suche?q=${encodeURIComponent(query)}&page=${page - 1}`}
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
                        href={`/suche?q=${encodeURIComponent(query)}&page=${pageNum}`}
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
                    href={`/suche?q=${encodeURIComponent(query)}&page=${page + 1}`}
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
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <SlidersHorizontal size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Keine Ergebnisse gefunden
            </h2>
            <p className="text-gray-600 mb-8">
              Versuchen Sie es mit anderen Suchbegriffen oder stöbern Sie in unseren Kategorien.
            </p>

            {/* Suggestions */}
            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-3">Stattdessen suchen nach:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Kugelschreiber', 'Notizbuch', 'Ordner', 'Papier'].map((term) => (
                  <Link
                    key={term}
                    href={`/suche?q=${encodeURIComponent(term)}`}
                    className="px-4 py-2 bg-gray-100 hover:bg-red-600 hover:text-white rounded-full text-sm font-medium text-gray-700 transition-all"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all hover:shadow-lg hover:shadow-red-600/25"
            >
              Zur Startseite
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
