import Link from 'next/link';
import { Plus, Edit, Trash2, FolderTree, ChevronRight } from 'lucide-react';
import prisma from '@/lib/db';

export const metadata = {
  title: 'Kategorien - Admin | McPaper',
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: {
          _count: { select: { products: true } },
        },
        orderBy: { sortOrder: 'asc' },
      },
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Kategorien</h1>
          <p className="text-gray-600">{categories.length} Hauptkategorien</p>
        </div>
        <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
          <Plus size={18} />
          Neue Kategorie
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FolderTree size={40} className="mx-auto mb-2 opacity-50" />
            Keine Kategorien vorhanden
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {categories.map((category) => (
              <div key={category.id}>
                {/* Parent Category */}
                <div className="flex items-center justify-between p-4 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FolderTree size={20} className="text-gray-500" />
                    <div>
                      <p className="font-semibold">{category.name}</p>
                      <p className="text-sm text-gray-500">
                        {category._count.products} Produkte direkt, {category.children.length} Unterkategorien
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Child Categories */}
                {category.children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between p-4 pl-12 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronRight size={16} className="text-gray-400" />
                      <div>
                        <p className="font-medium">{child.name}</p>
                        <p className="text-sm text-gray-500">
                          {child._count.products} Produkte | Slug: {child.slug}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
