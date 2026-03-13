import { useEffect, useState } from 'react';
import { CreditCard as Edit, Save, X, Image, Video, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface HeroMedia {
  id: string;
  page_key: string;
  media_type: 'image' | 'video';
  url: string;
  overlay_opacity: number;
  updated_at: string;
}

const PAGE_LABELS: Record<string, string> = {
  home: 'Home Page',
  about: 'About Page',
  blog: 'Blog Page',
  offers: 'Offers Page',
  contact: 'Contact Page',
  packages: 'Packages Page',
  destinations: 'Destinations Page',
  gallery: 'Gallery Page',
  faq: 'FAQ Page',
};

const PAGE_ORDER = ['home', 'about', 'blog', 'offers', 'contact', 'packages', 'destinations', 'gallery', 'faq'];

export default function HeroMediaManagement() {
  const [heroes, setHeroes] = useState<HeroMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ media_type: 'image' as 'image' | 'video', url: '', overlay_opacity: 0.6 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase
      .from('hero_media')
      .select('*')
      .order('page_key');
    setHeroes(data || []);
    setLoading(false);
  };

  const sorted = [...heroes].sort((a, b) => {
    const ai = PAGE_ORDER.indexOf(a.page_key);
    const bi = PAGE_ORDER.indexOf(b.page_key);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const startEdit = (hero: HeroMedia) => {
    setEditId(hero.id);
    setForm({ media_type: hero.media_type, url: hero.url, overlay_opacity: hero.overlay_opacity });
    setError('');
    setPreviewId(null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setError('');
  };

  const save = async (id: string) => {
    if (!form.url.trim()) { setError('URL is required'); return; }
    setSaving(true);
    setError('');
    const { error: err } = await supabase
      .from('hero_media')
      .update({ media_type: form.media_type, url: form.url.trim(), overlay_opacity: form.overlay_opacity, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (err) { setError(err.message); setSaving(false); return; }
    await load();
    setEditId(null);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hero Media</h1>
        <p className="text-gray-500 mt-1">Manage hero images and videos displayed at the top of each page.</p>
      </div>

      <div className="space-y-4">
        {sorted.map((hero) => {
          const isEditing = editId === hero.id;
          const isPreviewing = previewId === hero.id;

          return (
            <div key={hero.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                      {hero.media_type === 'video' ? (
                        <Video className="h-5 w-5 text-red-600" />
                      ) : (
                        <Image className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{PAGE_LABELS[hero.page_key] || hero.page_key}</h3>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 ${
                        hero.media_type === 'video' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                      }`}>
                        {hero.media_type === 'video' ? <Video className="h-3 w-3" /> : <Image className="h-3 w-3" />}
                        {hero.media_type}
                      </span>
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreviewId(isPreviewing ? null : hero.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Eye className="h-4 w-4" />
                        {isPreviewing ? 'Hide' : 'Preview'}
                      </button>
                      <button
                        onClick={() => startEdit(hero)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <p className="mt-3 text-sm text-gray-400 truncate font-mono">{hero.url}</p>
                )}

                {isPreviewing && !isEditing && (
                  <div className="mt-4 rounded-xl overflow-hidden h-48 relative bg-gray-900">
                    {hero.media_type === 'video' ? (
                      <video
                        src={hero.url}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img src={hero.url} alt="Hero preview" className="w-full h-full object-cover" />
                    )}
                    <div
                      className="absolute inset-0"
                      style={{ backgroundColor: `rgba(0,0,0,${hero.overlay_opacity})` }}
                    />
                    <div className="absolute bottom-3 left-3 text-white text-xs font-medium">
                      Overlay: {Math.round(hero.overlay_opacity * 100)}%
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="mt-4 space-y-4">
                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
                      <div className="flex gap-3">
                        {(['image', 'video'] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() => setForm((f) => ({ ...f, media_type: type }))}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition ${
                              form.media_type === type
                                ? 'border-red-600 bg-red-50 text-red-700'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {type === 'video' ? <Video className="h-4 w-4" /> : <Image className="h-4 w-4" />}
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {form.media_type === 'video' ? 'Video URL' : 'Image URL'}
                      </label>
                      <input
                        type="text"
                        value={form.url}
                        onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                        placeholder={form.media_type === 'video' ? 'https://... or /local-video.mp4' : 'https://...'}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Overlay Darkness: {Math.round(form.overlay_opacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={form.overlay_opacity}
                        onChange={(e) => setForm((f) => ({ ...f, overlay_opacity: parseFloat(e.target.value) }))}
                        className="w-full accent-red-600"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                        <span>0% (no overlay)</span>
                        <span>100% (full black)</span>
                      </div>
                    </div>

                    {form.url && (
                      <div className="rounded-xl overflow-hidden h-48 relative bg-gray-900">
                        {form.media_type === 'video' ? (
                          <video
                            src={form.url}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <img src={form.url} alt="Preview" className="w-full h-full object-cover" />
                        )}
                        <div
                          className="absolute inset-0"
                          style={{ backgroundColor: `rgba(0,0,0,${form.overlay_opacity})` }}
                        />
                        <div className="absolute bottom-3 left-3 text-white text-xs font-medium">Live Preview</div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={() => save(hero.id)}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition disabled:opacity-60"
                      >
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
