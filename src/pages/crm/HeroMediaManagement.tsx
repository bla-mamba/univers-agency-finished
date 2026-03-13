import { useEffect, useRef, useState } from 'react';
import { CreditCard as Edit, Save, X, Image, Video, Eye, Upload, Link as LinkIcon, Loader2 } from 'lucide-react';
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
};

const PAGE_DESCRIPTIONS: Record<string, string> = {
  home: 'Full-screen background shown on the main landing page',
  about: 'Hero banner at the top of the About Us page',
  blog: 'Hero banner at the top of the Blog listing page',
  offers: 'Hero banner at the top of the Offers page',
  contact: 'Hero banner at the top of the Contact page',
  packages: 'Hero banner at the top of the Packages listing page',
  destinations: 'Hero banner at the top of the Destinations listing page',
};

const PAGE_ORDER = ['home', 'about', 'blog', 'offers', 'contact', 'packages', 'destinations'];

const ACTIVE_PAGES = new Set(PAGE_ORDER);

type InputMode = 'url' | 'upload';

export default function HeroMediaManagement() {
  const [heroes, setHeroes] = useState<HeroMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ media_type: 'image' as 'image' | 'video', url: '', overlay_opacity: 0.6 });
  const [inputMode, setInputMode] = useState<InputMode>('url');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [previewId, setPreviewId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase
      .from('hero_media')
      .select('*')
      .order('page_key');
    setHeroes(data || []);
    setLoading(false);
  };

  const sorted = [...heroes]
    .filter((h) => ACTIVE_PAGES.has(h.page_key))
    .sort((a, b) => {
      const ai = PAGE_ORDER.indexOf(a.page_key);
      const bi = PAGE_ORDER.indexOf(b.page_key);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

  const startEdit = (hero: HeroMedia) => {
    setEditId(hero.id);
    setForm({ media_type: hero.media_type, url: hero.url, overlay_opacity: hero.overlay_opacity });
    setInputMode('url');
    setUploadFile(null);
    setUploadPreview('');
    setError('');
    setPreviewId(null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setUploadFile(null);
    setUploadPreview('');
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    const isVideo = file.type.startsWith('video/');
    setForm((f) => ({ ...f, media_type: isVideo ? 'video' : 'image' }));
    const objectUrl = URL.createObjectURL(file);
    setUploadPreview(objectUrl);
  };

  const uploadAndGetUrl = async (pageKey: string): Promise<string> => {
    if (!uploadFile) return form.url;
    setUploading(true);
    const ext = uploadFile.name.split('.').pop();
    const path = `${pageKey}-${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from('hero-media')
      .upload(path, uploadFile, { upsert: true });
    if (uploadErr) throw uploadErr;
    const { data } = supabase.storage.from('hero-media').getPublicUrl(path);
    setUploading(false);
    return data.publicUrl;
  };

  const save = async (id: string, pageKey: string) => {
    if (inputMode === 'url' && !form.url.trim()) { setError('URL is required'); return; }
    if (inputMode === 'upload' && !uploadFile) { setError('Please select a file to upload'); return; }
    setSaving(true);
    setError('');
    try {
      const finalUrl = inputMode === 'upload' ? await uploadAndGetUrl(pageKey) : form.url.trim();
      const { error: err } = await supabase
        .from('hero_media')
        .update({ media_type: form.media_type, url: finalUrl, overlay_opacity: form.overlay_opacity, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (err) throw err;
      await load();
      setEditId(null);
      setUploadFile(null);
      setUploadPreview('');
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
      setUploading(false);
    }
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
          const livePreviewUrl = inputMode === 'upload' ? uploadPreview : form.url;

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
                      <p className="text-xs text-gray-400 mt-0.5">{PAGE_DESCRIPTIONS[hero.page_key]}</p>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
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
                      <video src={hero.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                    ) : (
                      <img src={hero.url} alt="Hero preview" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${hero.overlay_opacity})` }} />
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                      <div className="flex rounded-lg border border-gray-200 overflow-hidden w-fit mb-3">
                        <button
                          onClick={() => { setInputMode('url'); setUploadFile(null); setUploadPreview(''); }}
                          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition ${
                            inputMode === 'url' ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <LinkIcon className="h-4 w-4" />
                          URL
                        </button>
                        <button
                          onClick={() => setInputMode('upload')}
                          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition ${
                            inputMode === 'upload' ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Upload className="h-4 w-4" />
                          Upload
                        </button>
                      </div>

                      {inputMode === 'url' && (
                        <input
                          type="text"
                          value={form.url}
                          onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                          placeholder={form.media_type === 'video' ? 'https://... or /local-video.mp4' : 'https://...'}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      )}

                      {inputMode === 'upload' && (
                        <div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept={form.media_type === 'video' ? 'video/*' : 'image/*'}
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-gray-200 rounded-lg px-4 py-6 flex flex-col items-center gap-2 text-gray-500 hover:border-red-400 hover:text-red-500 transition"
                          >
                            <Upload className="h-6 w-6" />
                            <span className="text-sm font-medium">
                              {uploadFile ? uploadFile.name : `Click to select a ${form.media_type} file`}
                            </span>
                            {uploadFile && (
                              <span className="text-xs text-gray-400">
                                {(uploadFile.size / 1024 / 1024).toFixed(1)} MB
                              </span>
                            )}
                          </button>
                        </div>
                      )}
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

                    {livePreviewUrl && (
                      <div className="rounded-xl overflow-hidden h-48 relative bg-gray-900">
                        {form.media_type === 'video' ? (
                          <video
                            key={livePreviewUrl}
                            src={livePreviewUrl}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <img src={livePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${form.overlay_opacity})` }} />
                        <div className="absolute bottom-3 left-3 text-white text-xs font-medium">Live Preview</div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={() => save(hero.id, hero.page_key)}
                        disabled={saving || uploading}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition disabled:opacity-60"
                      >
                        {(saving || uploading) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {uploading ? 'Uploading...' : saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={saving || uploading}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60"
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
