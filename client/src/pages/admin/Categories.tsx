import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Tag,
  Layers,
} from 'lucide-react';
import categoryService, { Category } from '../../services/category.service';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Card from '../../components/ui/Card';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    baseFeeRupees: '500',
    icon: 'alert-circle',
  });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await categoryService.getAdminCategories({
        search: search.trim() || undefined,
        isActive: statusFilter === '' ? undefined : statusFilter,
        limit: 50,
      });
      setCategories(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCategories]);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      baseFeeRupees: '500',
      icon: 'alert-circle',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      baseFeeRupees: (cat.baseFeePaise / 100).toString(),
      icon: cat.icon || 'alert-circle',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    if (!editingCategory) {
      // Auto-generate slug when creating new category
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData((prev) => ({ ...prev, name: val, slug: autoSlug }));
    } else {
      setFormData((prev) => ({ ...prev, name: val }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const rupees = parseFloat(formData.baseFeeRupees);
    if (isNaN(rupees) || rupees < 0) {
      setFormError('Please enter a valid non-negative base fee.');
      return;
    }
    const baseFeePaise = Math.round(rupees * 100);

    try {
      setFormLoading(true);
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, {
          name: formData.name.trim(),
          description: formData.description.trim(),
          baseFeePaise,
          icon: formData.icon.trim() || 'alert-circle',
        });
        setSuccessMessage(`Category '${formData.name}' updated successfully.`);
      } else {
        await categoryService.createCategory({
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim(),
          baseFeePaise,
          icon: formData.icon.trim() || 'alert-circle',
        });
        setSuccessMessage(`Category '${formData.name}' created successfully.`);
      }
      setIsModalOpen(false);
      fetchCategories();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Failed to save category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (cat: Category) => {
    try {
      const nextStatus = !cat.isActive;
      await categoryService.toggleCategoryStatus(cat._id, nextStatus);
      setCategories((prev) =>
        prev.map((item) => (item._id === cat._id ? { ...item, isActive: nextStatus } : item))
      );
      setSuccessMessage(
        `Category '${cat.name}' ${nextStatus ? 'activated' : 'disabled'} successfully.`
      );
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to toggle category status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#1E293B] flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-[#7C3AED]" />
            Civic Issue Categories
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Manage citizen classification categories, baseline fees in integer paise, and availability.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleOpenAddModal}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-sm"
        >
          Add Category
        </Button>
      </div>

      {/* Flash Messages */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-80 relative">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, slug or description..."
              leftIcon={<Search className="w-4 h-4 text-[#64748B]" />}
              className="w-full text-sm"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
            >
              <option value="">All Statuses</option>
              <option value="true">Active Only</option>
              <option value="false">Disabled Only</option>
            </select>

            <button
              onClick={() => fetchCategories()}
              className="p-2 border border-[#E2E8F0] rounded-lg text-[#64748B] hover:text-[#7C3AED] hover:bg-[#EDE9FE]/50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </Card>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#1E293B]">
            <thead className="bg-[#F8F7FC] border-b border-[#E2E8F0] text-xs font-semibold uppercase tracking-wider text-[#475569]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Category Details</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4">Base Fee</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#64748B]">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-[#7C3AED]" />
                      <span>Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#64748B]">
                    No categories found matching your query.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-[#F8F7FC]/70 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shrink-0 mt-0.5">
                          <Tag className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#1E293B]">{cat.name}</div>
                          <div className="text-xs text-[#64748B] mt-0.5 line-clamp-1">
                            {cat.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs text-[#475569]">
                      <span className="bg-[#EDE9FE]/50 text-[#312E81] px-2 py-0.5 rounded border border-[#E2E8F0]">
                        {cat.slug}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-semibold text-[#1E293B]">
                      ₹{(cat.baseFeePaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      <span className="block text-[11px] font-normal text-[#64748B]">
                        {cat.baseFeePaise.toLocaleString()} paise
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {cat.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Disabled
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(cat)}
                          className="p-1.5 text-[#64748B] hover:text-[#7C3AED] hover:bg-[#EDE9FE] rounded-lg transition-colors"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(cat)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            cat.isActive
                              ? 'text-rose-600 hover:bg-rose-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={cat.isActive ? 'Disable Category' : 'Activate Category'}
                        >
                          {cat.isActive ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Civic Category' : 'Create New Category'}
        description={
          editingCategory
            ? 'Update the category details and base fee.'
            : 'Add a new civic classification with a baseline fee.'
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <Input
            label="Category Name"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Drainage & Sewage"
            required
          />

          <div>
            <Input
              label="URL Slug"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase() }))}
              placeholder="e.g. drainage-sewage"
              disabled={Boolean(editingCategory)}
              required
            />
            {editingCategory && (
              <p className="text-[11px] text-[#64748B] mt-1">
                Slugs cannot be altered after creation to preserve relational integrity.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
              Base Fee (₹ INR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] text-sm font-semibold">
                ₹
              </span>
              <input
                type="number"
                step="1"
                min="0"
                value={formData.baseFeeRupees}
                onChange={(e) => setFormData((prev) => ({ ...prev, baseFeeRupees: e.target.value }))}
                className="w-full pl-8 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                placeholder="500"
                required
              />
            </div>
            <p className="text-[11px] text-[#64748B] mt-1">
              Stored as{' '}
              <strong className="text-[#312E81]">
                {(parseFloat(formData.baseFeeRupees || '0') * 100).toLocaleString()} paise
              </strong>{' '}
              in MongoDB.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
              placeholder="Describe what kind of civic issues fall under this category..."
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={formLoading}>
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
