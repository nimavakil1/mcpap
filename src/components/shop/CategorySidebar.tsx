'use client';

import Link from 'next/link';
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
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

  // Auto-expand parent category if a child is selected
  useEffect(() => {
    if (currentSlug) {
      const parentCategory = categories.find((cat) =>
        cat.children?.some((child) => child.slug === currentSlug)
      );
      if (parentCategory && !expandedCategories.includes(parentCategory.id)) {
        setExpandedCategories((prev) => [...prev, parentCategory.id]);
      }
    }
  }, [currentSlug, categories]);

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
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Kategorien</h3>
      </div>
      <nav className="p-3">
        {categories.map((category) => (
          <div key={category.id} className="mb-1">
            <div className="flex items-center group">
              <Link
                href={`/kategorie/${category.slug}`}
                className={cn(
                  'flex-1 flex items-center gap-2 px-3 py-2.5 text-sm rounded-xl transition-all',
                  isActive(category.slug)
                    ? 'text-red-600 font-medium bg-red-50'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                {isExpanded(category.id) ? (
                  <FolderOpen size={16} className="text-gray-400" />
                ) : (
                  <Folder size={16} className="text-gray-400" />
                )}
                {category.name}
              </Link>
              {category.children && category.children.length > 0 && (
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={isExpanded(category.id) ? 'Schließen' : 'Öffnen'}
                >
                  <ChevronDown
                    size={16}
                    className={cn(
                      'transition-transform duration-200',
                      isExpanded(category.id) ? 'rotate-180' : ''
                    )}
                  />
                </button>
              )}
            </div>

            {/* Subcategories */}
            {category.children && category.children.length > 0 && (
              <div
                className={cn(
                  'ml-4 overflow-hidden transition-all duration-200',
                  isExpanded(category.id)
                    ? 'max-h-96 opacity-100 mt-1'
                    : 'max-h-0 opacity-0'
                )}
              >
                <div className="border-l-2 border-gray-100 pl-3 space-y-0.5">
                  {category.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/kategorie/${child.slug}`}
                      className={cn(
                        'block px-3 py-2 text-sm rounded-lg transition-all',
                        isActive(child.slug)
                          ? 'text-red-600 font-medium bg-red-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
