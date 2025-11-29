'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Filter, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

interface ProductFiltersProps {
  manufacturers: string[];
  currentManufacturer?: string;
  currentSort: string;
  currentOrder: string;
}

export default function ProductFilters({
  manufacturers,
  currentManufacturer,
  currentSort,
  currentOrder,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset to page 1 when filters change
    router.push(`${pathname}?${params.toString()}`);
  };

  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Preis (aufsteigend)' },
    { value: 'price-desc', label: 'Preis (absteigend)' },
    { value: 'newest-desc', label: 'Neueste zuerst' },
  ];

  const currentSortValue = `${currentSort}-${currentOrder}`;

  const handleSortChange = (value: string) => {
    const [sort, order] = value.split('-');
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    params.set('order', order);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Sort */}
      <div className="flex items-center gap-2">
        <ArrowUpDown size={18} className="text-[#666]" />
        <select
          value={currentSortValue}
          onChange={(e) => handleSortChange(e.target.value)}
          className="input py-2 text-sm w-auto"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Toggle (Mobile) */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="btn btn-outline btn-sm md:hidden"
      >
        <Filter size={18} />
        Filter
      </button>

      {/* Manufacturer Filter */}
      {manufacturers.length > 0 && (
        <div className="hidden md:flex items-center gap-2">
          <Filter size={18} className="text-[#666]" />
          <select
            value={currentManufacturer || ''}
            onChange={(e) => updateParams('manufacturer', e.target.value)}
            className="input py-2 text-sm w-auto"
          >
            <option value="">Alle Hersteller</option>
            {manufacturers.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Mobile Filter Panel */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg">Filter</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-[#666] hover:text-[#1A1A1A]"
              >
                Schließen
              </button>
            </div>

            {manufacturers.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-2">Hersteller</h4>
                <select
                  value={currentManufacturer || ''}
                  onChange={(e) => {
                    updateParams('manufacturer', e.target.value);
                    setShowFilters(false);
                  }}
                  className="input"
                >
                  <option value="">Alle Hersteller</option>
                  {manufacturers.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => {
                router.push(pathname);
                setShowFilters(false);
              }}
              className="btn btn-outline w-full"
            >
              Filter zurücksetzen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
