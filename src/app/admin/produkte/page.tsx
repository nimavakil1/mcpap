import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, Package } from 'lucide-react';
import prisma from '@/lib/db';
import { formatPrice } from '@/lib/utils';

export const metadata = {
  title: 'Produkte - Admin | McPaper',
};

interface ProductsPageProps {
  searchParams: Promise<{ page?: string; search?: string; category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const search = params.search || '';
  const categorySlug = params.category || '';
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { ean: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (categorySlug) {
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (category) {
      where.categoryId = category.id;
    }
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { parentId: null },
      include: { children: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Produkte</h1>
          <p className="text-gray-600">{total} Produkte insgesamt</p>
        </div>
        <Link
          href="/admin/produkte/neu"
          className="flex items-center gap-2 bg-[#E31E24] text-white px-4 py-2 rounded-lg hover:bg-[#C41A1F] transition-colors"
        >
          <Plus size={18} />
          Neues Produkt
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <form className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Suche nach Name, SKU oder EAN..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#E31E24]"
              />
            </div>
          </div>
          <select
            name="category"
            defaultValue={categorySlug}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#E31E24]"
          >
            <option value="">Alle Kategorien</option>
            {categories.map((cat) => (
              <optgroup key={cat.id} label={cat.name}>
                {cat.children.map((child) => (
                  <option key={child.id} value={child.slug}>
                    {child.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Filtern
          </button>
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold">Produkt</th>
              <th className="text-left p-4 font-semibold">SKU</th>
              <th className="text-left p-4 font-semibold">Kategorie</th>
              <th className="text-right p-4 font-semibold">Preis</th>
              <th className="text-center p-4 font-semibold">Bestand</th>
              <th className="text-center p-4 font-semibold">Status</th>
              <th className="text-right p-4 font-semibold">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  <Package size={40} className="mx-auto mb-2 opacity-50" />
                  Keine Produkte gefunden
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        {product.images[0] ? (
                          <img
                            src={product.images[0].url}
                            alt=""
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Package size={20} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{product.name}</p>
                        {product.manufacturer && (
                          <p className="text-xs text-gray-500">{product.manufacturer}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{product.sku}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {product.category?.name || '-'}
                  </td>
                  <td className="p-4 text-right font-medium">
                    {formatPrice(Number(product.basePrice))}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        product.stockQuantity > 10
                          ? 'bg-green-100 text-green-700'
                          : product.stockQuantity > 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        product.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {product.isActive ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/produkt/${product.slug}`}
                        target="_blank"
                        className="p-2 text-gray-500 hover:text-[#E31E24] transition-colors"
                        title="Ansehen"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/admin/produkte/${product.id}`}
                        className="p-2 text-gray-500 hover:text-[#E31E24] transition-colors"
                        title="Bearbeiten"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                        title="Löschen"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Seite {page} von {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/produkte?page=${page - 1}${search ? `&search=${search}` : ''}${categorySlug ? `&category=${categorySlug}` : ''}`}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Zurück
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/produkte?page=${page + 1}${search ? `&search=${search}` : ''}${categorySlug ? `&category=${categorySlug}` : ''}`}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Weiter
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
