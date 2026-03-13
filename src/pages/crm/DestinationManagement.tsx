import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Upload, Link, X, ImageIcon, Package, Video } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  description: string;
  image_url: string;
  video_url: string;
  featured: boolean;
  package_count?: number;
}

type ImageMode = 'url' | 'upload';

export default function DestinationManagement() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDestination, setEditingDestination] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState<ImageMode>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    country: '',
    description: '',
    image_url: '',
    video_url: '',
    featured: false,
  });

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      const { data: dests, error } = await supabase
        .from('destinations')
        .select('*')
        .order('name');
      if (error) throw error;

      const { data: counts } = await supabase
        .from('packages')
        .select('destination_id');

      const countMap: Record<string, number> = {};
      (counts || []).forEach((p: { destination_id: string }) => {
        countMap[p.destination_id] = (countMap[p.destination_id] || 0) + 1;
      });

      setDestinations(
        (dests || []).map((d) => ({ ...d, package_count: countMap[d.id] || 0 }))
      );
    } catch (error) {
      console.error('Error loading destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return formData.image_url;
    const ext = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from('destination-images')
      .upload(fileName, imageFile, { upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from('destination-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const uploadVideo = async (): Promise<string> => {
    if (!videoFile) return formData.video_url;
    const ext = videoFile.name.split('.').pop();
    const fileName = `video-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from('destination-images')
      .upload(fileName, videoFile, { upsert: false, contentType: 'video/mp4' });
    if (error) throw error;
    const { data } = supabase.storage.from('destination-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      setUploading(true);
      let image_url = formData.image_url;
      let video_url = formData.video_url;

      if (imageMode === 'upload' && imageFile) {
        image_url = await uploadImage();
      }
      if (videoFile) {
        video_url = await uploadVideo();
      }
      setUploading(false);

      const payload = { ...formData, image_url, video_url };

      if (editingDestination) {
        const { error } = await supabase
          .from('destinations')
          .update(payload)
          .eq('id', editingDestination);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('destinations').insert([payload]);
        if (error) throw error;
      }

      setShowModal(false);
      resetForm();
      loadDestinations();
    } catch (error: any) {
      console.error('Error saving destination:', error);
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination.id);
    setFormData({
      name: destination.name,
      slug: destination.slug,
      country: destination.country,
      description: destination.description,
      image_url: destination.image_url,
      video_url: destination.video_url || '',
      featured: destination.featured,
    });
    if (destination.image_url) {
      setImagePreview(destination.image_url);
      setImageMode('url');
    } else {
      setImageMode('upload');
      setImagePreview('');
    }
    if (destination.video_url) {
      setVideoPreview(destination.video_url);
    } else {
      setVideoPreview('');
    }
    setImageFile(null);
    setVideoFile(null);
    setShowModal(true);
  };

  const handleDelete = async (destination: Destination) => {
    if ((destination.package_count ?? 0) > 0) {
      alert(
        `Cannot delete "${destination.name}" — it has ${destination.package_count} package(s) linked to it.\n\nReassign or delete those packages first.`
      );
      return;
    }
    if (!confirm(`Delete destination "${destination.name}"? This cannot be undone.`)) return;
    try {
      const { error } = await supabase.from('destinations').delete().eq('id', destination.id);
      if (error) throw error;
      loadDestinations();
    } catch (error: any) {
      console.error('Error deleting destination:', error);
      alert('Error: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', country: '', description: '', image_url: '', video_url: '', featured: false });
    setEditingDestination(null);
    setImageFile(null);
    setImagePreview('');
    setImageMode('upload');
    setVideoFile(null);
    setVideoPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Destination Management</h1>
          <p className="text-gray-600 mt-2">Manage travel destinations and their packages</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-red-600 text-white px-4 py-2  hover:bg-red-700 transition flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Destination
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <div key={destination.id} className="bg-white  shadow overflow-hidden flex flex-col">
            <div className="relative h-48 bg-gray-100">
              {destination.video_url ? (
                <video
                  src={destination.video_url}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLVideoElement).pause(); (e.currentTarget as HTMLVideoElement).currentTime = 0; }}
                />
              ) : destination.image_url ? (
                <img
                  src={destination.image_url}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <ImageIcon className="h-16 w-16" />
                </div>
              )}
              {destination.video_url && (
                <span className="absolute top-2 left-2 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                  <Video className="h-3 w-3" /> Video
                </span>
              )}
              {destination.featured && (
                <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
                  Featured
                </span>
              )}
              <div className="absolute bottom-2 left-2">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  (destination.package_count ?? 0) > 0
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  <Package className="h-3 w-3" />
                  {destination.package_count ?? 0} package{destination.package_count !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-gray-900">{destination.name}</h3>
              <p className="text-sm text-gray-500 mb-1">{destination.country}</p>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{destination.description}</p>
              <div className="flex flex-col gap-2">
                {(destination.package_count ?? 0) > 0 && (
                  <button
                    onClick={() => navigate(`/crm/packages?destination=${destination.id}`)}
                    className="w-full flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-medium"
                  >
                    <Package className="h-4 w-4 mr-1" />
                    View {destination.package_count} Package{destination.package_count !== 1 ? 's' : ''}
                  </button>
                )}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(destination)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(destination)}
                    disabled={(destination.package_count ?? 0) > 0}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    title={(destination.package_count ?? 0) > 0 ? 'Cannot delete — has linked packages' : 'Delete destination'}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingDestination ? 'Edit Destination' : 'Add New Destination'}
              </h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination Image</label>
                <div className="flex  border border-gray-300 overflow-hidden mb-3">
                  <button
                    type="button"
                    onClick={() => { setImageMode('upload'); setImagePreview(''); setImageFile(null); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition ${
                      imageMode === 'upload' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </button>
                  <button
                    type="button"
                    onClick={() => { setImageMode('url'); setImageFile(null); setImagePreview(formData.image_url); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition ${
                      imageMode === 'url' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Link className="h-4 w-4" />
                    Image URL
                  </button>
                </div>

                {imageMode === 'upload' ? (
                  <div>
                    <div
                      className="border-2 border-dashed border-gray-300  p-6 text-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition"
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      {imagePreview ? (
                        <div className="relative">
                          <img src={imagePreview} alt="Preview" className="mx-auto max-h-48  object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageFile(null);
                              setImagePreview('');
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50 transition"
                          >
                            <X className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-gray-400">
                          <Upload className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm font-medium text-gray-600">Click or drag & drop to upload</p>
                          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP up to 10MB</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image_url}
                      onChange={(e) => {
                        setFormData({ ...formData, image_url: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    {imagePreview && (
                      <div className="mt-3  overflow-hidden border border-gray-200">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full max-h-48 object-cover"
                          onError={() => setImagePreview('')}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Video (MP4)
                  <span className="ml-1 text-xs font-normal text-gray-400">— optional</span>
                </label>
                {videoPreview ? (
                  <div className="relative mb-2">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full max-h-48 rounded border border-gray-200 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null);
                        setVideoPreview('');
                        setFormData({ ...formData, video_url: '' });
                        if (videoInputRef.current) videoInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50 transition"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <Video className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm font-medium text-gray-600">Click to upload MP4 video</p>
                    <p className="text-xs text-gray-400 mt-1">MP4 up to 100MB</p>
                  </div>
                )}
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/*"
                  onChange={handleVideoFileChange}
                  className="hidden"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Featured Destination
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 border border-gray-300  text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-6 py-2 bg-red-600 text-white  hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {(saving || uploading) && (
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {editingDestination ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
