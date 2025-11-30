import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';
import ProductCard from '@/components/shop/ProductCard';

export const metadata = {
  title: 'Meine Favoriten - McPaper',
};

export default async function FavoritesPage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.id },
    include: {
      product: {
        include: {
          images: { where: { isPrimary: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meine Favoriten</h1>
        <p className="text-gray-500 mt-1">
          {favorites.length > 0
            ? `${favorites.length} Produkte in Ihren Favoriten`
            : 'Speichern Sie Ihre Lieblingsprodukte'
          }
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={36} className="text-pink-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Keine Favoriten vorhanden</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Speichern Sie Ihre Lieblingsprodukte, um sie später schnell wiederzufinden.
          </p>
          <Link
            href="/kategorie/schreibwaren"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all"
          >
            Produkte entdecken
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <ProductCard
              key={fav.id}
              product={fav.product as any}
              isFavorite={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
