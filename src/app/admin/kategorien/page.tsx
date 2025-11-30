'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, FolderTree, ChevronRight, X, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  _count: { products: number };
  children?: Category[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast.error('Fehler beim Laden der Kategorien');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditCategory({ ...category });
    setIsNew(false);
  };

  const handleNew = (parentId?: string) => {
    setEditCategory({
      id: '',
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      parentId: parentId || undefined,
      sortOrder: 0,
      isActive: true,
      _count: { products: 0 },
    });
    setIsNew(true);
  };

  const handleSave = async () => {
    if (!editCategory) return;

    setSaving(true);
    try {
      const url = isNew ? '/api/admin/categories' : `/api/admin/categories/${editCategory.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editCategory.name,
          slug: editCategory.slug || editCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: editCategory.description,
          imageUrl: editCategory.imageUrl,
          parentId: editCategory.parentId,
          sortOrder: editCategory.sortOrder,
          isActive: editCategory.isActive,
        }),
      });

      if (!res.ok) throw new Error('Failed to save');

      toast.success(isNew ? 'Kategorie erstellt' : 'Kategorie gespeichert');
      setEditCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Kategorie wirklich löschen?')) return;

    try {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      toast.success('Kategorie gelöscht');
      fetchCategories();
    } catch (error) {
      toast.error('Fehler beim Löschen');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Kategorien</h1>
          <p className="text-gray-600">{categories.length} Hauptkategorien</p>
        </div>
        <button
          onClick={() => handleNew()}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
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
                        {category._count.products} Produkte direkt, {category.children?.length || 0} Unterkategorien
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleNew(category.id)}
                      className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                      title="Unterkategorie hinzufügen"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Bearbeiten"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      title="Löschen"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Child Categories */}
                {category.children?.map((child) => (
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
                      <button
                        onClick={() => handleEdit(child)}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Bearbeiten"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(child.id)}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                        title="Löschen"
                      >
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

      {/* Edit Modal */}
      {editCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">
                {isNew ? 'Neue Kategorie' : 'Kategorie bearbeiten'}
              </h2>
              <button
                onClick={() => setEditCategory(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={editCategory.name}
                  onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={editCategory.slug}
                  onChange={(e) => setEditCategory({ ...editCategory, slug: e.target.value })}
                  placeholder="wird-automatisch-generiert"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
                <textarea
                  value={editCategory.description || ''}
                  onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bild-URL</label>
                <input
                  type="text"
                  value={editCategory.imageUrl || ''}
                  onChange={(e) => setEditCategory({ ...editCategory, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sortierung</label>
                  <input
                    type="number"
                    value={editCategory.sortOrder}
                    onChange={(e) => setEditCategory({ ...editCategory, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editCategory.isActive}
                      onChange={(e) => setEditCategory({ ...editCategory, isActive: e.target.checked })}
                      className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                    />
                    <span>Aktiv</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setEditCategory(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editCategory.name}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
