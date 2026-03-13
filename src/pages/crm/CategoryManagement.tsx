import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, CreditCard as Edit, Trash2, Package } from 'lucide-react';
import { useCategories, resolveIcon, AVAILABLE_ICONS } from '../../contexts/CategoriesContext';

interface CategoryRow {
 id: string;
 name: string;
 slug: string;
 description: string;
 sort_order: number;
 icon: string;
 package_count?: number;
}

export default function CategoryManagement() {
 const { categories: ctxCategories, reload } = useCategories();
 const [categories, setCategories] = useState<CategoryRow[]>([]);
 const [loading, setLoading] = useState(true);
 const [showModal, setShowModal] = useState(false);
 const [editingCategory, setEditingCategory] = useState<string | null>(null);

 const [formData, setFormData] = useState({
 name: '',
 slug: '',
 description: '',
 sort_order: '99',
 icon: '',
 });

 useEffect(() => {
 loadCategories();
 }, [ctxCategories]);

 const loadCategories = async () => {
 try {
 const { data: pkgCounts } = await supabase
 .from('packages')
 .select('category_id')
 .not('category_id', 'is', null);

 const countMap: Record<string, number> = {};
 (pkgCounts || []).forEach((p: any) => {
 if (p.category_id) countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
 });

 setCategories(
 ctxCategories.map((c) => ({ ...c, package_count: countMap[c.id] || 0 }))
 );
 } catch (error) {
 console.error('Error loading categories:', error);
 } finally {
 setLoading(false);
 }
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 try {
 const payload = {
 name: formData.name,
 slug: formData.slug,
 description: formData.description,
 sort_order: parseInt(formData.sort_order) || 99,
 icon: formData.icon,
 };
 if (editingCategory) {
 const { error } = await supabase.from('categories').update(payload).eq('id', editingCategory);
 if (error) throw error;
 } else {
 const { error } = await supabase.from('categories').insert([payload]);
 if (error) throw error;
 }
 setShowModal(false);
 resetForm();
 reload();
 } catch (error: any) {
 console.error('Error saving category:', error);
 alert('Error: ' + error.message);
 }
 };

 const handleEdit = (category: CategoryRow) => {
 setEditingCategory(category.id);
 setFormData({
 name: category.name,
 slug: category.slug,
 description: category.description || '',
 sort_order: String(category.sort_order ?? 99),
 icon: category.icon || '',
 });
 setShowModal(true);
 };

 const handleDelete = async (id: string) => {
 if (!confirm('Are you sure you want to delete this category?')) return;
 try {
 const { error } = await supabase.from('categories').delete().eq('id', id);
 if (error) throw error;
 reload();
 } catch (error) {
 console.error('Error deleting category:', error);
 }
 };

 const resetForm = () => {
 setFormData({ name: '', slug: '', description: '', sort_order: '99', icon: '' });
 setEditingCategory(null);
 };

 const autoSlug = (name: string) =>
 name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

 const SelectedIcon = resolveIcon(formData.icon);

 if (loading) {
 return (
 <div className="flex items-center justify-center h-screen">
 <div className="animate-spin h-12 w-12 border-b-2 border-red-600" />
 </div>
 );
 }

 return (
 <div className="p-8">
 <div className="flex justify-between items-center mb-8">
 <div>
 <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
 <p className="text-gray-600 mt-2">Changes instantly update the navbar dropdown and package filter tabs</p>
 </div>
 <button
 onClick={() => { resetForm(); setShowModal(true); }}
 className="bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition flex items-center"
 >
 <Plus className="h-5 w-5 mr-2" />
 Add Category
 </button>
 </div>

 <div className="bg-white shadow overflow-hidden">
 <table className="w-full">
 <thead className="bg-gray-50">
 <tr>
 {['Order', 'Icon', 'Name', 'Slug', 'Description', 'Packages', 'Actions'].map((h) => (
 <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 {h}
 </th>
 ))}
 </tr>
 </thead>
 <tbody className="bg-white divide-y divide-gray-200">
 {categories.map((category) => {
 const Icon = resolveIcon(category.icon);
 return (
 <tr key={category.id} className="hover:bg-gray-50">
 <td className="px-6 py-4 text-sm font-mono text-gray-500 w-16">{category.sort_order}</td>
 <td className="px-6 py-4 w-12">
 {Icon ? (
 <div className="w-8 h-8 bg-red-50 flex items-center justify-center">
 <Icon className="h-4 w-4 text-red-600" />
 </div>
 ) : (
 <div className="w-8 h-8 bg-gray-100 flex items-center justify-center">
 <span className="text-xs text-gray-400">—</span>
 </div>
 )}
 </td>
 <td className="px-6 py-4 text-sm font-semibold text-gray-900">{category.name}</td>
 <td className="px-6 py-4 text-xs font-mono text-gray-500">{category.slug}</td>
 <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{category.description || '—'}</td>
 <td className="px-6 py-4">
 <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold">
 <Package className="h-3 w-3" />
 {category.package_count}
 </span>
 </td>
 <td className="px-6 py-4 text-sm font-medium space-x-2">
 <button onClick={() => handleEdit(category)} className="text-red-600 hover:text-red-900">
 <Edit className="h-4 w-4" />
 </button>
 <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">
 <Trash2 className="h-4 w-4" />
 </button>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 {categories.length === 0 && (
 <div className="text-center py-12 text-gray-500">No categories yet.</div>
 )}
 </div>

 {showModal && (
 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
 <div className="bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto">
 <div className="p-6">
 <h2 className="text-2xl font-bold mb-4">
 {editingCategory ? 'Edit Category' : 'Add New Category'}
 </h2>
 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
 <input
 type="text"
 required
 value={formData.name}
 onChange={(e) => {
 const name = e.target.value;
 setFormData((prev) => ({
 ...prev,
 name,
 slug: editingCategory ? prev.slug : autoSlug(name),
 }));
 }}
 className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
 <input
 type="text"
 required
 value={formData.slug}
 onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
 className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
 />
 <p className="text-xs text-gray-400 mt-1">Used in URLs and navbar dropdown links</p>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
 <input
 type="number"
 value={formData.sort_order}
 onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
 min="1"
 className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
 />
 <p className="text-xs text-gray-400 mt-1">Lower = appears first</p>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
 <div className="flex items-center gap-2">
 <div className="w-9 h-9 border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
 {SelectedIcon ? (
 <SelectedIcon className="h-5 w-5 text-red-600" />
 ) : (
 <span className="text-xs text-gray-400">?</span>
 )}
 </div>
 <input
 type="text"
 list="icon-options"
 value={formData.icon}
 onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
 placeholder="e.g. Waves"
 className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
 />
 <datalist id="icon-options">
 {AVAILABLE_ICONS.map((name) => (
 <option key={name} value={name} />
 ))}
 </datalist>
 </div>
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">Icon Picker</label>
 <div className="grid grid-cols-6 gap-2 p-3 border border-gray-200 bg-gray-50 max-h-40 overflow-y-auto">
 {AVAILABLE_ICONS.map((name) => {
 const Ic = resolveIcon(name);
 const isSelected = formData.icon === name;
 return (
 <button
 key={name}
 type="button"
 title={name}
 onClick={() => setFormData({ ...formData, icon: name })}
 className={`flex flex-col items-center justify-center p-2 border transition ${
 isSelected
 ? 'border-red-500 bg-red-50 text-red-600'
 : 'border-transparent hover:border-gray-300 hover:bg-white text-gray-500'
 }`}
 >
 {Ic && <Ic className="h-5 w-5" />}
 <span className="text-[9px] mt-1 truncate w-full text-center leading-tight">{name}</span>
 </button>
 );
 })}
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
 <textarea
 value={formData.description}
 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
 rows={3}
 className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
 />
 </div>

 <div className="flex justify-end space-x-3 pt-4">
 <button
 type="button"
 onClick={() => { setShowModal(false); resetForm(); }}
 className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
 >
 Cancel
 </button>
 <button
 type="submit"
 className="px-4 py-2 bg-red-600 text-white hover:bg-red-700"
 >
 {editingCategory ? 'Update' : 'Create'}
 </button>
 </div>
 </form>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
