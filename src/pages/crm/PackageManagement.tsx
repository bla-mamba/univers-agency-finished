import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, CreditCard as Edit, Trash2, Upload, X, Image, ArrowLeft, ChevronDown, Calendar, Star, Video } from 'lucide-react';

interface Package {
  id: string;
  title: string;
  slug: string;
  price: number;
  duration_days: number;
  status: string;
  featured: boolean;
  images: string[];
  destination: { name: string } | null;
  category: { name: string } | null;
}

const BUCKET = 'package-images';

export default function PackageManagement() {
  const [searchParams] = useSearchParams();
  const filterDestinationId = searchParams.get('destination');
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filterDestinationName, setFilterDestinationName] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    duration_days: '',
    max_group_size: '',
    destination_id: '',
    category_id: '',
    status: 'draft',
    featured: false,
  });

  const [inclusionInput, setInclusionInput] = useState('');
  const [exclusionInput, setExclusionInput] = useState('');
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);

  const [destinationText, setDestinationText] = useState('');
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const destinationInputRef = useRef<HTMLInputElement>(null);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadPreviews, setUploadPreviews] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [existingVideoUrl, setExistingVideoUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPackages();
    loadDestinations();
    loadCategories();
  }, [filterDestinationId]);

  const loadPackages = async () => {
    try {
      let query = supabase
        .from('packages')
        .select(`*, destination:destinations(name), category:categories(name)`)
        .order('created_at', { ascending: false });
      if (filterDestinationId) {
        query = query.eq('destination_id', filterDestinationId);
      }
      const { data, error } = await query;
      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDestinations = async () => {
    const { data } = await supabase.from('destinations').select('*').order('name');
    setDestinations(data || []);
    if (filterDestinationId && data) {
      const match = data.find((d: any) => d.id === filterDestinationId);
      if (match) setFilterDestinationName(match.name);
    }
  };

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data || []);
  };

  const handleDestinationInput = (value: string) => {
    setDestinationText(value);
    setFormData({ ...formData, destination_id: '' });
    if (value.trim().length === 0) {
      setDestinationSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const filtered = destinations.filter((d) =>
      d.name.toLowerCase().includes(value.toLowerCase())
    );
    setDestinationSuggestions(filtered);
    setShowSuggestions(true);
  };

  const selectDestinationSuggestion = (dest: any) => {
    setDestinationText(dest.name);
    setFormData((prev) => ({ ...prev, destination_id: dest.id }));
    setShowSuggestions(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadFiles((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setUploadPreviews((prev) => [...prev, ...previews]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeUploadFile = (index: number) => {
    URL.revokeObjectURL(uploadPreviews[index]);
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((u) => u !== url));
  };

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of uploadFiles) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const uploadVideo = async (): Promise<string> => {
    if (!videoFile) return existingVideoUrl;
    const ext = videoFile.name.split('.').pop();
    const path = `video-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, videoFile, { contentType: 'video/mp4' });
    if (error) throw error;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const newUrls = await uploadImages();
      const allImages = [...existingImages, ...newUrls];
      const video_url = await uploadVideo();

      const autoSlug = formData.title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      let resolvedDestinationId = formData.destination_id;

      if (!resolvedDestinationId && destinationText.trim()) {
        const slug = destinationText.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const { data: existing } = await supabase
          .from('destinations')
          .select('id')
          .ilike('name', destinationText.trim())
          .maybeSingle();

        if (existing) {
          resolvedDestinationId = existing.id;
        } else {
          const { data: created, error: createErr } = await supabase
            .from('destinations')
            .insert([{ name: destinationText.trim(), slug, country: destinationText.trim() }])
            .select('id')
            .single();
          if (createErr) throw createErr;
          resolvedDestinationId = created.id;
          loadDestinations();
        }
      }

      const packageData = {
        ...formData,
        slug: editingPackage ? formData.slug : autoSlug,
        price: parseFloat(formData.price),
        duration_days: parseInt(formData.duration_days),
        max_group_size: parseInt(formData.max_group_size) || 10,
        destination_id: resolvedDestinationId || null,
        category_id: formData.category_id || null,
        images: allImages,
        video_url: video_url || null,
        inclusions,
        exclusions,
      };

      if (editingPackage) {
        const { error } = await supabase.from('packages').update(packageData).eq('id', editingPackage);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('packages').insert([packageData]);
        if (error) throw error;
      }

      setShowModal(false);
      resetForm();
      loadPackages();
    } catch (error: any) {
      console.error('Error saving package:', error);
      alert('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async (pkg: Package) => {
    setEditingPackage(pkg.id);
    const { data } = await supabase.from('packages').select('*').eq('id', pkg.id).single();
    if (data) {
      setFormData({
        title: data.title,
        slug: data.slug,
        description: data.description || '',
        price: data.price.toString(),
        duration_days: data.duration_days.toString(),
        max_group_size: data.max_group_size?.toString() || '10',
        destination_id: data.destination_id || '',
        category_id: data.category_id || '',
        status: data.status,
        featured: data.featured,
      });
      setExistingImages(data.images || []);
      setExistingVideoUrl(data.video_url || '');
      setVideoPreview(data.video_url || '');
      setVideoFile(null);
      setInclusions(data.inclusions || []);
      setExclusions(data.exclusions || []);
      if (data.destination_id) {
        const match = destinations.find((d) => d.id === data.destination_id);
        if (match) setDestinationText(match.name);
        else {
          const { data: dest } = await supabase.from('destinations').select('name').eq('id', data.destination_id).maybeSingle();
          if (dest) setDestinationText(dest.name);
        }
      }
    }
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    try {
      const { error } = await supabase.from('packages').delete().eq('id', id);
      if (error) throw error;
      loadPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      price: '',
      duration_days: '',
      max_group_size: '',
      destination_id: '',
      category_id: '',
      status: 'draft',
      featured: false,
    });
    setEditingPackage(null);
    uploadPreviews.forEach((p) => URL.revokeObjectURL(p));
    setUploadFiles([]);
    setUploadPreviews([]);
    setExistingImages([]);
    setVideoFile(null);
    setVideoPreview('');
    setExistingVideoUrl('');
    setDestinationText('');
    setDestinationSuggestions([]);
    setShowSuggestions(false);
    setInclusions([]);
    setExclusions([]);
    setInclusionInput('');
    setExclusionInput('');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          {filterDestinationId && (
            <Link
              to="/crm/destinations"
              className="inline-flex items-center text-sm text-red-600 hover:text-red-700 mb-2 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Destinations
            </Link>
          )}
          <h1 className="text-3xl font-bold text-gray-900">Package Management</h1>
          <p className="text-gray-600 mt-2">
            {filterDestinationId && filterDestinationName
              ? `Showing packages for: ${filterDestinationName}`
              : 'Manage your tour packages'}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-red-600 text-white px-4 py-2  hover:bg-red-700 transition flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Package
        </button>
      </div>

      <div className="bg-white  shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Image', 'Title', 'Destination', 'Category', 'Price', 'Duration', 'Status', 'Manage', 'Actions'].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {packages.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {pkg.images && pkg.images[0] ? (
                    <img
                      src={pkg.images[0]}
                      alt={pkg.title}
                      className="h-12 w-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="h-12 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                      <Image className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{pkg.title}</div>
                  {pkg.featured && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{pkg.destination?.name || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{pkg.category?.name || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-900">${pkg.price.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{pkg.duration_days} days</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(pkg.status)}`}>
                    {pkg.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/crm/availability?package=${pkg.id}`}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition text-xs font-medium"
                      title="Manage Availability"
                    >
                      <Calendar className="h-3 w-3" /> Availability
                    </Link>
                    <Link
                      to={`/crm/reviews?package=${pkg.id}`}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 transition text-xs font-medium"
                      title="Manage Reviews"
                    >
                      <Star className="h-3 w-3" /> Reviews
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  <button onClick={() => handleEdit(pkg)} className="text-red-600 hover:text-red-900">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(pkg.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {packages.length === 0 && (
          <div className="text-center py-12 text-gray-500">No packages yet. Create your first one.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingPackage ? 'Edit Package' : 'Add New Package'}
                </h2>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                    <input
                      type="number"
                      required
                      value={formData.duration_days}
                      onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destination <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        ref={destinationInputRef}
                        type="text"
                        required
                        value={destinationText}
                        onChange={(e) => handleDestinationInput(e.target.value)}
                        onFocus={() => {
                          if (destinationText.trim()) setShowSuggestions(true);
                        }}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                        placeholder="Type a destination..."
                        className="w-full px-3 py-2 pr-8 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    {showSuggestions && destinationSuggestions.length > 0 && (
                      <ul className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200  shadow-lg max-h-48 overflow-y-auto">
                        {destinationSuggestions.map((dest) => (
                          <li
                            key={dest.id}
                            onMouseDown={() => selectDestinationSuggestion(dest)}
                            className="px-3 py-2 text-sm text-gray-800 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                          >
                            {dest.name}
                            <span className="text-gray-400 text-xs ml-1">— {dest.country}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {destinationText.trim() && !formData.destination_id && (
                      <p className="text-xs text-amber-600 mt-1">New destination will be created: "{destinationText.trim()}"</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Group Size</label>
                    <input
                      type="number"
                      value={formData.max_group_size}
                      onChange={(e) => setFormData({ ...formData, max_group_size: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
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
                    Featured Package
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What's Included
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={inclusionInput}
                        onChange={(e) => setInclusionInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = inclusionInput.trim();
                            if (val) { setInclusions((prev) => [...prev, val]); setInclusionInput(''); }
                          }
                        }}
                        placeholder="Add inclusion and press Enter"
                        className="flex-1 px-3 py-2 border border-gray-300  text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const val = inclusionInput.trim();
                          if (val) { setInclusions((prev) => [...prev, val]); setInclusionInput(''); }
                        }}
                        className="px-3 py-2 bg-green-600 text-white  hover:bg-green-700 transition"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <ul className="space-y-1 max-h-40 overflow-y-auto">
                      {inclusions.map((item, i) => (
                        <li key={i} className="flex items-center justify-between bg-green-50 border border-green-100  px-3 py-1.5 text-sm text-green-800">
                          <span className="flex-1 truncate">{item}</span>
                          <button type="button" onClick={() => setInclusions((prev) => prev.filter((_, idx) => idx !== i))} className="ml-2 text-green-400 hover:text-red-500 transition">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Not Included
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={exclusionInput}
                        onChange={(e) => setExclusionInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = exclusionInput.trim();
                            if (val) { setExclusions((prev) => [...prev, val]); setExclusionInput(''); }
                          }
                        }}
                        placeholder="Add exclusion and press Enter"
                        className="flex-1 px-3 py-2 border border-gray-300  text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const val = exclusionInput.trim();
                          if (val) { setExclusions((prev) => [...prev, val]); setExclusionInput(''); }
                        }}
                        className="px-3 py-2 bg-red-600 text-white  hover:bg-red-700 transition"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <ul className="space-y-1 max-h-40 overflow-y-auto">
                      {exclusions.map((item, i) => (
                        <li key={i} className="flex items-center justify-between bg-red-50 border border-red-100  px-3 py-1.5 text-sm text-red-800">
                          <span className="flex-1 truncate">{item}</span>
                          <button type="button" onClick={() => setExclusions((prev) => prev.filter((_, idx) => idx !== i))} className="ml-2 text-red-300 hover:text-red-600 transition">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package Images</label>

                  {existingImages.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">Current images</p>
                      <div className="grid grid-cols-3 gap-2">
                        {existingImages.map((url) => (
                          <div key={url} className="relative group">
                            <img
                              src={url}
                              alt="package"
                              className="h-24 w-full object-cover  border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(url)}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {uploadPreviews.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">New images to upload</p>
                      <div className="grid grid-cols-3 gap-2">
                        {uploadPreviews.map((preview, i) => (
                          <div key={preview} className="relative group">
                            <img
                              src={preview}
                              alt="preview"
                              className="h-24 w-full object-cover  border-2 border-dashed border-red-300"
                            />
                            <button
                              type="button"
                              onClick={() => removeUploadFile(i)}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300  py-6 flex flex-col items-center gap-2 text-gray-500 hover:border-red-400 hover:text-red-500 transition cursor-pointer"
                  >
                    <Upload className="h-6 w-6" />
                    <span className="text-sm font-medium">Click to upload images</span>
                    <span className="text-xs">JPG, PNG, WebP up to 10MB each</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Video (MP4)
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
                          setExistingVideoUrl('');
                          if (videoInputRef.current) videoInputRef.current.value = '';
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-80 hover:opacity-100 transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-300 py-6 flex flex-col items-center gap-2 text-gray-500 hover:border-red-400 hover:text-red-500 transition cursor-pointer"
                    >
                      <Video className="h-6 w-6" />
                      <span className="text-sm font-medium">Click to upload MP4 video</span>
                      <span className="text-xs">MP4 up to 100MB</span>
                    </button>
                  )}
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/*"
                    className="hidden"
                    onChange={handleVideoFileChange}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="px-4 py-2 border border-gray-300  text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-red-600 text-white  hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {uploading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {uploading ? 'Saving...' : editingPackage ? 'Update' : 'Create'}
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
