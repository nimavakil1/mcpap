import Link from 'next/link';
import { Heart } from 'lucide-react';
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
    <div>
      <h1 className="text-2xl font-bold mb-6">Meine Favoriten</h1>

      {favorites.length === 0 ? (
        <div className="bg-white border border-[#E0E0E0] rounded-lg p-12 text-center">
          <Heart size={48} className="mx-auto text-[#999] mb-4" />
          <h2 className="text-lg font-semibold mb-2">Keine Favoriten vorhanden</h2>
          <p className="text-[#666] mb-6">
            Speichern Sie Ihre Lieblingsprodukte, um sie später schnell wiederzufinden.
          </p>
          <Link
            href="/kategorie/schreibwaren"
            className="inline-block bg-[#E31E24] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#C41A1F] transition-colors"
          >
            Produkte entdecken
          </Link>
        </div>
      ) : (
        <>
          <p className="text-[#666] mb-6">{favorites.length} Produkte in Ihren Favoriten</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <ProductCard
                key={fav.id}
                product={fav.product as any}
                isFavorite={true}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
