'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Package, Search, X, Check, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  sku: string;
  ean?: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  manufacturer?: string;
  basePrice: number;
  taxRate: number;
  isAvailableOnline: boolean;
  stockQuantity: number;
  minimumOrderQuantity: number;
  unitOfMeasure: string;
  unitsPerPackage?: number;
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  categoryId?: string;
  images: { id: string; url: string; altText?: string; isPrimary: boolean }[];
}

interface Category {
  id: string;
  name: string;
  children?: Category[];
}

interface SearchImage {
  url: string;
  thumbnail: string;
  title: string;
  source: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Image search state
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [savingImages, setSavingImages] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`);
      if (!res.ok) throw new Error('Product not found');
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      toast.error('Produkt nicht gefunden');
      router.push('/admin/produkte');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error('Failed to update');

      toast.success('Produkt gespeichert');
      router.push('/admin/produkte');
    } catch (error) {
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const handleSearchImages = async () => {
    if (!product) return;

    setSearching(true);
    setSearchResults([]);
    setSelectedImages(new Set());

    try {
      const searchQuery = product.ean || product.name;
      const res = await fetch(`/api/admin/products/${productId}/search-images?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setSearchResults(data.images || []);
      if (data.images?.length === 0) {
        toast.error('Keine Bilder gefunden');
      }
    } catch (error) {
      toast.error('Fehler bei der Bildersuche');
    } finally {
      setSearching(false);
    }
  };

  const toggleImageSelection = (url: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(url)) {
      newSelected.delete(url);
    } else {
      if (newSelected.size >= 3) {
        toast.error('Maximal 3 Bilder auswählen');
        return;
      }
      newSelected.add(url);
    }
    setSelectedImages(newSelected);
  };

  const handleSaveSelectedImages = async () => {
    if (selectedImages.size === 0) {
      toast.error('Bitte wählen Sie mindestens ein Bild aus');
      return;
    }

    setSavingImages(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/save-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrls: Array.from(selectedImages) }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save images');
      }

      toast.success(`${data.saved} Bilder gespeichert`);
      setShowImageSearch(false);
      setSearchResults([]);
      setSelectedImages(new Set());
      fetchProduct(); // Refresh to show new images
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Speichern der Bilder');
    } finally {
      setSavingImages(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Bild wirklich löschen?')) return;

    try {
      const res = await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');

      toast.success('Bild gelöscht');
      fetchProduct();
    } catch (error) {
      toast.error('Fehler beim Löschen');
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}/images/${imageId}/primary`, {
        method: 'PUT',
      });

      if (!res.ok) throw new Error('Failed to set primary');

      toast.success('Hauptbild gesetzt');
      fetchProduct();
    } catch (error) {
      toast.error('Fehler beim Setzen des Hauptbildes');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/produkte"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Produkt bearbeiten</h1>
          <p className="text-gray-600">{product.sku}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Grundinformationen</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU *
              </label>
              <input
                type="text"
                value={product.sku}
                onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                EAN
              </label>
              <input
                type="text"
                value={product.ean || ''}
                onChange={(e) => setProduct({ ...product, ean: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hersteller
              </label>
              <input
                type="text"
                value={product.manufacturer || ''}
                onChange={(e) => setProduct({ ...product, manufacturer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kurzbeschreibung
              </label>
              <input
                type="text"
                value={product.shortDescription || ''}
                onChange={(e) => setProduct({ ...product, shortDescription: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beschreibung
              </label>
              <textarea
                value={product.description || ''}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Preis & Bestand</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preis (netto) *
              </label>
              <input
                type="number"
                step="0.01"
                value={product.basePrice}
                onChange={(e) => setProduct({ ...product, basePrice: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MwSt. (%)
              </label>
              <select
                value={product.taxRate}
                onChange={(e) => setProduct({ ...product, taxRate: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              >
                <option value={19}>19%</option>
                <option value={7}>7%</option>
                <option value={0}>0%</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bestand
              </label>
              <input
                type="number"
                value={product.stockQuantity}
                onChange={(e) => setProduct({ ...product, stockQuantity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mindestbestellmenge
              </label>
              <input
                type="number"
                value={product.minimumOrderQuantity}
                onChange={(e) => setProduct({ ...product, minimumOrderQuantity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Einheit
              </label>
              <input
                type="text"
                value={product.unitOfMeasure}
                onChange={(e) => setProduct({ ...product, unitOfMeasure: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategorie
              </label>
              <select
                value={product.categoryId || ''}
                onChange={(e) => setProduct({ ...product, categoryId: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              >
                <option value="">Keine Kategorie</option>
                {categories.map((cat) => (
                  <optgroup key={cat.id} label={cat.name}>
                    {cat.children?.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Status</h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={product.isActive}
                onChange={(e) => setProduct({ ...product, isActive: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span>Aktiv</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={product.isAvailableOnline}
                onChange={(e) => setProduct({ ...product, isAvailableOnline: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span>Online verfügbar</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={product.isFeatured}
                onChange={(e) => setProduct({ ...product, isFeatured: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span>Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={product.isBestseller}
                onChange={(e) => setProduct({ ...product, isBestseller: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span>Bestseller</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={product.isNewArrival}
                onChange={(e) => setProduct({ ...product, isNewArrival: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span>Neuheit</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Bilder</h2>
            <button
              type="button"
              onClick={() => {
                setShowImageSearch(true);
                handleSearchImages();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search size={18} />
              Bilder suchen
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt={image.altText || ''}
                  className="w-full h-32 object-contain bg-gray-50 rounded-lg border border-gray-200"
                />
                {image.isPrimary && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                    Hauptbild
                  </span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  {!image.isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(image.id)}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      title="Als Hauptbild setzen"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image.id)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    title="Löschen"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {product.images.length === 0 && (
              <div className="col-span-4 flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Package size={32} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Keine Bilder vorhanden</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/produkte"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Abbrechen
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Speichern
          </button>
        </div>
      </form>

      {/* Image Search Modal */}
      {showImageSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold">Bilder suchen</h2>
                <p className="text-sm text-gray-500">
                  Suche nach: {product.ean || product.name}
                </p>
              </div>
              <button
                onClick={() => setShowImageSearch(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {searching ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                  <p className="text-gray-500">Suche Bilder...</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <Package size={48} className="mb-2 opacity-50" />
                  <p>Keine Bilder gefunden</p>
                  <button
                    onClick={handleSearchImages}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Erneut suchen
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {searchResults.map((image, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleImageSelection(image.url)}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImages.has(image.url)
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.thumbnail || image.url}
                        alt={image.title}
                        className="w-full h-32 object-contain bg-gray-50"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.png';
                        }}
                      />
                      {selectedImages.has(image.url) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                      <div className="p-2 text-xs text-gray-500 truncate">
                        {image.source}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                {selectedImages.size} von max. 3 Bildern ausgewählt
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowImageSearch(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSaveSelectedImages}
                  disabled={savingImages || selectedImages.size === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {savingImages ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  Auswahl speichern
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
