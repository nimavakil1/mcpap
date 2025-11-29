'use client';

import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface CategorySidebarProps {
  categories: Category[];
  currentSlug?: string;
}

export default function CategorySidebar({ categories, currentSlug }: CategorySidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const isActive = (slug: string) => slug === currentSlug;
  const isExpanded = (categoryId: string) => expandedCategories.includes(categoryId);

  return (
    <div className="bg-white rounded-lg border border-[#E0E0E0]">
      <div className="p-4 border-b border-[#E0E0E0]">
        <h3 className="font-semibold">Kategorien</h3>
      </div>
      <nav className="p-2">
        {categories.map((category) => (
          <div key={category.id}>
            <div className="flex items-center">
              <Link
                href={`/kategorie/${category.slug}`}
                className={cn(
                  'flex-1 px-3 py-2 text-sm rounded hover:bg-[#F5F5F5] transition-colors',
                  isActive(category.slug) && 'text-[#E31E24] font-medium bg-red-50'
                )}
              >
                {category.name}
              </Link>
              {category.children && category.children.length > 0 && (
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="p-2 hover:bg-[#F5F5F5] rounded"
                  aria-label={isExpanded(category.id) ? 'Schließen' : 'Öffnen'}
                >
                  {isExpanded(category.id) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              )}
            </div>

            {/* Subcategories */}
            {category.children && category.children.length > 0 && isExpanded(category.id) && (
              <div className="ml-4 border-l border-[#E0E0E0] pl-2 mt-1 mb-2">
                {category.children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/kategorie/${child.slug}`}
                    className={cn(
                      'block px-3 py-1.5 text-sm rounded hover:bg-[#F5F5F5] transition-colors',
                      isActive(child.slug) && 'text-[#E31E24] font-medium'
                    )}
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
