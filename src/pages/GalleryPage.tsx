import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ZoomIn, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface GalleryImage {
  url: string;
  title: string;
  slug: string;
  type: 'package' | 'destination';
  location: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState<'all' | 'package' | 'destination'>('all');

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const loadImages = async () => {
    try {
      const [packagesRes, destRes] = await Promise.all([
        supabase
          .from('packages')
          .select('title, slug, images, destination:destinations(name, country)')
          .eq('status', 'published'),
        supabase
          .from('destinations')
          .select('name, slug, country, image_url')
          .not('image_url', 'is', null),
      ]);

      const galleryImages: GalleryImage[] = [];

      (packagesRes.data || []).forEach((pkg: any) => {
        if (pkg.images && Array.isArray(pkg.images)) {
          pkg.images.forEach((url: string) => {
            if (url) {
              galleryImages.push({
                url,
                title: pkg.title,
                slug: `/packages/${pkg.slug}`,
                type: 'package',
                location: pkg.destination ? `${pkg.destination.name}, ${pkg.destination.country}` : '',
              });
            }
          });
        }
      });

      (destRes.data || []).forEach((dest: any) => {
        if (dest.image_url) {
          galleryImages.push({
            url: dest.image_url,
            title: dest.name,
            slug: `/destinations/${dest.slug}`,
            type: 'destination',
            location: dest.country,
          });
        }
      });

      setImages(galleryImages);
    } catch (err) {
      console.error('Error loading gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'all' ? images : images.filter((i) => i.type === filter);

  return (
    <div className="min-h-screen bg-gray-950">

      {/* HERO */}
      <section className="relative h-[420px] overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-3">
          {images.slice(0, 6).map((img, i) => (
            <div key={i} className="overflow-hidden">
              <img src={img.url} alt="" className="w-full h-full object-cover opacity-30" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gray-950/70" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 h-full flex flex-col justify-end pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400 mb-4">Visual Archive</p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">Photo Gallery</h1>
          <p className="text-white/60 max-w-xl leading-relaxed text-base font-light">
            Imagery from our destination portfolio and travel programs — shot on location by our team and clients.
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="bg-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center gap-3">
          {[
            { key: 'all', label: `All Photos (${images.length})` },
            { key: 'package', label: `Packages (${images.filter((i) => i.type === 'package').length})` },
            { key: 'destination', label: `Destinations (${images.filter((i) => i.type === 'destination').length})` },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`px-4 py-2 text-xs font-semibold transition uppercase tracking-wide ${
                filter === f.key
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin h-8 w-8 border-2 border-gray-700 border-t-white" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg">No photos available yet.</p>
            <p className="text-gray-600 text-sm mt-2">Add packages and destinations with images to see them here.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3">
            {filtered.map((img, i) => (
              <div
                key={i}
                className="break-inside-avoid relative group cursor-pointer overflow-hidden"
                onClick={() => setLightbox(img)}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4">
                  <p className="text-white font-semibold text-sm leading-snug">{img.title}</p>
                  {img.location && (
                    <p className="text-gray-300 text-xs flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />{img.location}
                    </p>
                  )}
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <ZoomIn className="h-4 w-4 text-white" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.url}
              alt={lightbox.title}
              className="max-w-full max-h-[75vh] object-contain shadow-2xl"
            />
            <div className="mt-4 text-center">
              <p className="text-white font-bold text-base uppercase tracking-wide">{lightbox.title}</p>
              {lightbox.location && (
                <p className="text-gray-500 text-sm flex items-center justify-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5" />{lightbox.location}
                </p>
              )}
              <Link
                to={lightbox.slug}
                onClick={() => setLightbox(null)}
                className="inline-block mt-3 text-red-500 hover:text-red-400 text-sm font-semibold transition uppercase tracking-wide"
              >
                View {lightbox.type === 'package' ? 'Package' : 'Destination'} &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
