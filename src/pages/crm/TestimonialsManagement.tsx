import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, GripVertical, X, Check } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar_url: string | null;
  rating: number;
  message: string;
  package_name: string | null;
  travel_date: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

const emptyForm = {
  name: '',
  location: '',
  avatar_url: '',
  rating: 5,
  message: '',
  package_name: '',
  travel_date: '',
  is_featured: true,
  display_order: 0,
};

export default function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });
      if (data) setTestimonials(data);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, display_order: testimonials.length + 1 });
    setShowModal(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      location: t.location,
      avatar_url: t.avatar_url ?? '',
      rating: t.rating,
      message: t.message,
      package_name: t.package_name ?? '',
      travel_date: t.travel_date ?? '',
      is_featured: t.is_featured,
      display_order: t.display_order,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.message.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        location: form.location.trim(),
        avatar_url: form.avatar_url.trim() || null,
        rating: form.rating,
        message: form.message.trim(),
        package_name: form.package_name.trim() || null,
        travel_date: form.travel_date.trim() || null,
        is_featured: form.is_featured,
        display_order: form.display_order,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        await supabase.from('testimonials').update(payload).eq('id', editingId);
      } else {
        await supabase.from('testimonials').insert(payload);
      }
      setShowModal(false);
      loadTestimonials();
    } finally {
      setSaving(false);
    }
  };

  const toggleFeatured = async (t: Testimonial) => {
    await supabase
      .from('testimonials')
      .update({ is_featured: !t.is_featured, updated_at: new Date().toISOString() })
      .eq('id', t.id);
    setTestimonials((prev) =>
      prev.map((item) => (item.id === t.id ? { ...item, is_featured: !item.is_featured } : item))
    );
  };

  const handleDelete = async (id: string) => {
    await supabase.from('testimonials').delete().eq('id', id);
    setDeleteConfirm(null);
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const filtered = testimonials.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.package_name ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">
            {testimonials.filter((t) => t.is_featured).length} featured · {testimonials.length} total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5  hover:bg-red-700 transition text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Testimonial
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Search by name, location or package..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm px-4 py-2 border border-gray-200  text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Star className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No testimonials found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((t) => (
              <div key={t.id} className="flex items-start gap-4 p-5 hover:bg-gray-50 transition">
                <GripVertical className="h-5 w-5 text-gray-300 mt-1 flex-shrink-0" />

                <div className="flex-shrink-0">
                  {t.avatar_url ? (
                    <img
                      src={t.avatar_url}
                      alt={t.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold">
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{t.name}</span>
                    <span className="text-xs text-gray-400">{t.location}</span>
                    {t.package_name && (
                      <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                        {t.package_name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{t.message}</p>
                  {t.travel_date && (
                    <p className="text-xs text-gray-400 mt-1">{t.travel_date}</p>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleFeatured(t)}
                    title={t.is_featured ? 'Hide from homepage' : 'Show on homepage'}
                    className={`p-2  transition ${
                      t.is_featured
                        ? 'bg-green-50 text-green-600 hover:bg-green-100'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {t.is_featured ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => openEdit(t)}
                    className="p-2  bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  {deleteConfirm === t.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-2  bg-red-600 text-white hover:bg-red-700 transition"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="p-2  bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(t.id)}
                      className="p-2  bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2  hover:bg-gray-100 transition"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200  text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g. Sarah Johnson"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200  text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g. New York, USA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL (optional)</label>
                <input
                  type="url"
                  value={form.avatar_url}
                  onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200  text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-7 w-7 transition ${
                          star <= form.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200 hover:text-amber-200 hover:fill-amber-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-gray-500 ml-1">{form.rating}/5</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-200  text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  placeholder="What did this traveler say about their experience?"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
                  <input
                    type="text"
                    value={form.package_name}
                    onChange={(e) => setForm({ ...form, package_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200  text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g. Bali Paradise Escape"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                  <input
                    type="text"
                    value={form.travel_date}
                    onChange={(e) => setForm({ ...form, travel_date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200  text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g. March 2025"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-200  text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    min={0}
                  />
                </div>
                <div className="flex items-center mt-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
                      className={`relative w-11 h-6 rounded-full transition ${
                        form.is_featured ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          form.is_featured ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                    <span className="text-sm text-gray-700">Show on homepage</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border border-gray-200  text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim() || !form.message.trim()}
                className="px-5 py-2.5 bg-red-600 text-white  text-sm font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Testimonial'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
