import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit, Trash2, Search, X, Check, Tag } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Offer {
 id: string;
 title: string;
 description: string;
 discount_percent: number;
 badge_text: string;
 valid_from: string;
 valid_until: string | null;
 is_active: boolean;
 created_at: string;
 package: { title: string; slug: string; price: number } | null;
}

interface Package {
 id: string;
 title: string;
 slug: string;
 price: number;
}

const emptyForm = {
 package_id: '',
 title: '',
 description: '',
 discount_percent: 10,
 badge_text: 'Special Offer',
 valid_from: new Date().toISOString().split('T')[0],
 valid_until: '',
 is_active: true,
};

export default function OffersManagement() {
 const [offers, setOffers] = useState<Offer[]>([]);
 const [packages, setPackages] = useState<Package[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [modal, setModal] = useState(false);
 const [editOffer, setEditOffer] = useState<Offer | null>(null);
 const [form, setForm] = useState(emptyForm);
 const [saving, setSaving] = useState(false);
 const [error, setError] = useState('');

 useEffect(() => { loadData(); }, []);

 const loadData = async () => {
 const [offersRes, pkgsRes] = await Promise.all([
 supabase.from('offers').select('*, package:packages(title, slug, price)').order('created_at', { ascending: false }),
 supabase.from('packages').select('id, title, slug, price').eq('status', 'published').order('title'),
 ]);
 setOffers(offersRes.data || []);
 setPackages(pkgsRes.data || []);
 setLoading(false);
 };

 const openCreate = () => {
 setEditOffer(null);
 setForm(emptyForm);
 setError('');
 setModal(true);
 };

 const openEdit = (offer: Offer) => {
 setEditOffer(offer);
 setForm({
 package_id: '',
 title: offer.title,
 description: offer.description,
 discount_percent: offer.discount_percent,
 badge_text: offer.badge_text,
 valid_from: offer.valid_from ? offer.valid_from.split('T')[0] : '',
 valid_until: offer.valid_until ? offer.valid_until.split('T')[0] : '',
 is_active: offer.is_active,
 });
 setError('');
 setModal(true);
 };

 const handleSave = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!form.title.trim()) { setError('Title is required.'); return; }
 setSaving(true);
 setError('');
 try {
 const payload: any = {
 title: form.title.trim(),
 description: form.description.trim(),
 discount_percent: form.discount_percent,
 badge_text: form.badge_text.trim(),
 valid_from: form.valid_from || new Date().toISOString(),
 valid_until: form.valid_until || null,
 is_active: form.is_active,
 updated_at: new Date().toISOString(),
 };
 if (!editOffer && form.package_id) payload.package_id = form.package_id;

 if (editOffer) {
 await supabase.from('offers').update(payload).eq('id', editOffer.id);
 } else {
 await supabase.from('offers').insert(payload);
 }
 setModal(false);
 loadData();
 } catch (err: any) {
 setError(err.message || 'Failed to save offer.');
 } finally {
 setSaving(false);
 }
 };

 const toggleActive = async (offer: Offer) => {
 await supabase.from('offers').update({ is_active: !offer.is_active }).eq('id', offer.id);
 loadData();
 };

 const deleteOffer = async (id: string) => {
 if (!confirm('Delete this offer?')) return;
 await supabase.from('offers').delete().eq('id', id);
 loadData();
 };

 const filtered = offers.filter((o) =>
 !search || o.title.toLowerCase().includes(search.toLowerCase())
 );

 return (
 <div className="p-8">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h1 className="text-3xl font-bold text-gray-900">Offers & Promotions</h1>
 <p className="text-gray-500 mt-1">{offers.length} offers</p>
 </div>
 <button
 onClick={openCreate}
 className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 font-semibold hover:bg-red-700 transition text-sm"
 >
 <Plus className="h-4 w-4" /> New Offer
 </button>
 </div>

 <div className="bg-white shadow-sm overflow-hidden">
 <div className="p-4 border-b border-gray-100">
 <div className="relative max-w-sm">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
 <input
 type="text"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Search offers..."
 className="w-full pl-9 pr-4 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
 />
 </div>
 </div>

 {loading ? (
 <div className="flex items-center justify-center py-16">
 <div className="animate-spin h-8 w-8 border-b-2 border-red-600" />
 </div>
 ) : (
 <table className="w-full">
 <thead className="bg-gray-50 border-b border-gray-100">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Offer</th>
 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Package</th>
 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Discount</th>
 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Valid Until</th>
 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
 <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100">
 {filtered.length === 0 ? (
 <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No offers yet.</td></tr>
 ) : filtered.map((offer) => (
 <tr key={offer.id} className="hover:bg-gray-50 transition">
 <td className="px-6 py-4">
 <p className="font-medium text-gray-900 text-sm">{offer.title}</p>
 <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-0.5">
 <Tag className="h-3 w-3" />{offer.badge_text}
 </span>
 </td>
 <td className="px-6 py-4 text-sm text-gray-600">{offer.package?.title || '—'}</td>
 <td className="px-6 py-4">
 <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1">{offer.discount_percent}% OFF</span>
 </td>
 <td className="px-6 py-4 text-sm text-gray-500">
 {offer.valid_until ? new Date(offer.valid_until).toLocaleDateString() : 'No expiry'}
 </td>
 <td className="px-6 py-4">
 <button onClick={() => toggleActive(offer)} className={`px-2.5 py-1 text-xs font-semibold transition ${offer.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
 {offer.is_active ? 'Active' : 'Inactive'}
 </button>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center justify-end gap-2">
 <button onClick={() => openEdit(offer)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition">
 <Edit className="h-4 w-4" />
 </button>
 <button onClick={() => deleteOffer(offer.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 transition">
 <Trash2 className="h-4 w-4" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>

 {modal && (
 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
 <div className="bg-white shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
 <div className="p-6 border-b border-gray-100 flex items-center justify-between">
 <h2 className="text-xl font-bold text-gray-900">{editOffer ? 'Edit Offer' : 'New Offer'}</h2>
 <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
 </div>
 <form onSubmit={handleSave} className="p-6 space-y-4">
 {!editOffer && (
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Package</label>
 <select
 value={form.package_id}
 onChange={(e) => setForm((f) => ({ ...f, package_id: e.target.value }))}
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
 >
 <option value="">Select a package (optional)</option>
 {packages.map((p) => <option key={p.id} value={p.id}>{p.title} — ${p.price}</option>)}
 </select>
 </div>
 )}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Offer Title *</label>
 <input type="text" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
 <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount %</label>
 <input type="number" min={1} max={100} value={form.discount_percent}
 onChange={(e) => setForm((f) => ({ ...f, discount_percent: Number(e.target.value) }))}
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Badge Text</label>
 <input type="text" value={form.badge_text} onChange={(e) => setForm((f) => ({ ...f, badge_text: e.target.value }))}
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Valid From</label>
 <input type="date" value={form.valid_from} onChange={(e) => setForm((f) => ({ ...f, valid_from: e.target.value }))}
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Valid Until</label>
 <input type="date" value={form.valid_until} onChange={(e) => setForm((f) => ({ ...f, valid_until: e.target.value }))}
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
 </div>
 </div>
 <label className="flex items-center gap-2 cursor-pointer">
 <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-red-600" />
 <span className="text-sm font-medium text-gray-700">Active (visible on website)</span>
 </label>
 {error && <p className="text-red-600 text-sm">{error}</p>}
 <div className="flex gap-3 pt-2">
 <button type="submit" disabled={saving} className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 font-semibold hover:bg-red-700 transition disabled:opacity-60 text-sm">
 <Check className="h-4 w-4" />{saving ? 'Saving...' : editOffer ? 'Update Offer' : 'Create Offer'}
 </button>
 <button type="button" onClick={() => setModal(false)} className="px-6 py-2.5 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">Cancel</button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
}
