import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Star, ArrowLeft, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  description: string;
  image_url: string;
  video_url: string;
  featured: boolean;
}

interface PackageItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  original_price: number | null;
  duration_days: number;
  images: string[];
  video_url: string | null;
  featured: boolean;
  category: { name: string } | null;
}

function DestPkgCard({ pkg }: { pkg: PackageItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Link
      to={`/packages/${pkg.slug}`}
      className="bg-white overflow-hidden shadow-lg hover:shadow-2xl transition group"
      onMouseEnter={() => videoRef.current?.play()}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      <div className="relative h-56 overflow-hidden bg-gray-100">
        {pkg.video_url ? (
          <video
            ref={videoRef}
            src={pkg.video_url}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={
              pkg.images?.[0] ||
              'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800'
            }
            alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />
        )}

        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1.5 text-sm font-semibold shadow">
          {pkg.original_price != null ? (
            <div className="flex flex-col items-end leading-tight">
              <span className="line-through text-white/70 font-normal text-xs">
                €{pkg.original_price.toLocaleString()}
              </span>
              <span>€{pkg.price.toLocaleString()}</span>
            </div>
          ) : (
            <span>€{pkg.price.toLocaleString()}</span>
          )}
        </div>

        {pkg.featured && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 font-semibold">
            E rekomanduar
          </div>
        )}

        {pkg.category && (
          <div className="absolute bottom-4 left-4 bg-white/90 text-gray-800 text-xs px-2 py-1 font-medium">
            {pkg.category.name}
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition line-clamp-2">
          {pkg.title}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {pkg.duration_days} ditë
          </div>

          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-gray-700 font-medium">4.8</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-red-600 text-sm font-semibold group-hover:underline">
            Shiko detajet e paketës &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      loadData(slug);
    }
  }, [slug]);

  const loadData = async (destSlug: string) => {
    try {
      setLoading(true);
      setNotFound(false);

      const { data: dest, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('slug', destSlug)
        .maybeSingle();

      if (error) throw error;

      if (!dest) {
        setNotFound(true);
        setDestination(null);
        setPackages([]);
        return;
      }

      setDestination(dest);

      const { data: pkgs, error: packagesError } = await supabase
        .from('packages')
        .select(
          'id, title, slug, price, original_price, duration_days, images, video_url, featured, category:categories(name)'
        )
        .eq('destination_id', dest.id)
        .eq('status', 'published')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (packagesError) throw packagesError;

      setPackages(pkgs || []);
    } catch (error) {
      console.error('Gabim gjatë ngarkimit të destinacionit:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-red-600" />
      </div>
    );
  }

  if (notFound || !destination) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
        <MapPin className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Destinacioni nuk u gjet
        </h2>
        <p className="text-gray-500 mb-6 max-w-md">
          Na vjen keq, por destinacioni që po kërkoni nuk ekziston ose nuk është më i disponueshëm.
        </p>
        <Link
          to="/destinations"
          className="text-red-600 font-semibold hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Kthehu te destinacionet
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/destinations"
            className="inline-flex items-center text-gray-500 hover:text-red-600 text-sm transition"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Të gjitha destinacionet
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden shadow-xl mb-12">
          <div className="relative h-80 lg:h-[500px] overflow-hidden bg-gray-900">
            {destination.video_url ? (
              <video
                src={destination.video_url}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={
                  destination.image_url ||
                  'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=1200'
                }
                alt={destination.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          <div className="bg-gray-900 flex flex-col justify-center px-10 py-12">
            {destination.featured && (
              <span className="inline-block mb-4 bg-red-600 text-white text-xs px-3 py-1 font-semibold w-fit uppercase tracking-wide">
                Destinacion i rekomanduar
              </span>
            )}
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              {destination.name}
            </h1>
            <div className="flex items-center text-gray-300 text-base mb-6">
              <MapPin className="h-5 w-5 mr-2 text-red-400" />
              {destination.country}
            </div>
            {destination.description && (
              <p className="text-gray-300 text-base leading-relaxed line-clamp-5 whitespace-pre-wrap">
                {destination.description}
              </p>
            )}
            <div className="mt-8 flex items-center gap-3 text-sm text-gray-400">
              <Package className="h-4 w-4" />
              <span>{packages.length} {packages.length === 1 ? 'paketë e disponueshme' : 'paketa të disponueshme'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Paketat e disponueshme
            <span className="ml-2 text-base font-normal text-gray-400">
              ({packages.length} {packages.length === 1 ? 'paketë' : 'paketa'})
            </span>
          </h2>
        </div>

        {packages.length === 0 ? (
          <div className="bg-white shadow-sm p-16 flex flex-col items-center text-center">
            <Package className="h-16 w-16 text-gray-200 mb-4" />
            <p className="text-gray-600 text-lg font-medium">
              Për momentin nuk ka paketa të disponueshme
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Ju ftojmë të riktheheni së shpejti për oferta të reja për këtë destinacion.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <DestPkgCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}