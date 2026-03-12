import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Calendar, ArrowLeft, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface WishlistItem {
  id: string;
  created_at: string;
  package: {
    id: string;
    title: string;
    slug: string;
    price: number;
    duration_days: number;
    images: string[];
    destination: { name: string; country: string } | null;
    category: { name: string } | null;
  } | null;
}

export default function MyWishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) loadWishlist();
  }, [user]);

  const loadWishlist = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id, created_at,
          package:packages(id, title, slug, price, duration_days, images, destination:destinations(name, country), category:categories(name))
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWishlist(data || []);
    } catch (err) {
      console.error('Error loading wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistId: string, packageId: string) => {
    setRemoving(wishlistId);
    try {
      await supabase.from('wishlists').delete().eq('id', wishlistId);
      setWishlist((prev) => prev.filter((w) => w.id !== wishlistId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    } finally {
      setRemoving(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm mb-4 transition">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-red-600 fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-500 text-sm mt-0.5">{wishlist.length} saved {wishlist.length === 1 ? 'package' : 'packages'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-10 w-10 text-red-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-400 mb-6 text-sm">Save your favorite packages to revisit them later.</p>
            <Link
              to="/packages"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition text-sm"
            >
              Explore Packages
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => {
              if (!item.package) return null;
              const pkg = item.package;
              const img =
                pkg.images?.[0] ||
                'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=600';

              return (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-lg transition">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={img}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => removeFromWishlist(item.id, pkg.id)}
                        disabled={removing === item.id}
                        className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-red-50 transition group/btn"
                        title="Remove from wishlist"
                      >
                        {removing === item.id ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500 group-hover/btn:text-red-700 transition" />
                        )}
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        €{Number(pkg.price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center text-xs text-gray-400 mb-1.5">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {pkg.destination?.name}, {pkg.destination?.country}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-red-600 transition leading-snug">
                      {pkg.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {pkg.duration_days} days
                      </div>
                      {pkg.category && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                          {pkg.category.name}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/packages/${pkg.slug}`}
                      className="block w-full text-center bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition"
                    >
                      View Package
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
