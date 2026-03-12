import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Booking {
  id: string;
  booking_date: string;
  travel_date: string;
  num_travelers: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded';
  special_requests: string;
  created_at: string;
  package: {
    title: string;
    slug: string;
    images: string[];
    duration_days: number;
    destination: { name: string; country: string } | null;
  } | null;
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  confirmed: { label: 'Confirmed', bg: 'bg-green-100', text: 'text-green-800' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-800' },
  completed: { label: 'Completed', bg: 'bg-blue-100', text: 'text-blue-800' },
};

const paymentConfig: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Payment Pending', bg: 'bg-orange-100', text: 'text-orange-800' },
  paid: { label: 'Paid', bg: 'bg-green-100', text: 'text-green-800' },
  refunded: { label: 'Refunded', bg: 'bg-gray-100', text: 'text-gray-700' },
};

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) loadBookings();
  }, [user]);

  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          package:packages(title, slug, images, duration_days, destination:destinations(name, country))
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

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
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 mt-1">Track all your travel reservations</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition capitalize ${
                filter === s
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-red-400 hover:text-red-600'
              }`}
            >
              {s === 'all' ? 'All Bookings' : s}
              {s === 'all' && ` (${bookings.length})`}
              {s !== 'all' && ` (${bookings.filter((b) => b.status === s).length})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
            </h3>
            <p className="text-gray-400 mb-6 text-sm">
              {filter === 'all'
                ? 'Start exploring our packages and book your dream trip.'
                : `You don't have any ${filter} bookings at the moment.`}
            </p>
            <Link
              to="/packages"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition text-sm"
            >
              Browse Packages
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => {
              const sc = statusConfig[booking.status] || statusConfig.pending;
              const pc = paymentConfig[booking.payment_status] || paymentConfig.pending;
              const img =
                booking.package?.images?.[0] ||
                'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=400';

              return (
                <div key={booking.id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col sm:flex-row">
                  <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0">
                    <img src={img} alt={booking.package?.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        {booking.package ? (
                          <Link
                            to={`/packages/${booking.package.slug}`}
                            className="text-xl font-bold text-gray-900 hover:text-red-600 transition"
                          >
                            {booking.package.title}
                          </Link>
                        ) : (
                          <span className="text-xl font-bold text-gray-900">Package Unavailable</span>
                        )}
                        {booking.package?.destination && (
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {booking.package.destination.name}, {booking.package.destination.country}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
                          {sc.label}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pc.bg} ${pc.text}`}>
                          {pc.label}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Travel Date</p>
                        <div className="flex items-center text-sm font-medium text-gray-700">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-red-500" />
                          {new Date(booking.travel_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Travelers</p>
                        <div className="flex items-center text-sm font-medium text-gray-700">
                          <Users className="h-3.5 w-3.5 mr-1 text-red-500" />
                          {booking.num_travelers} {booking.num_travelers === 1 ? 'person' : 'people'}
                        </div>
                      </div>
                      {booking.package?.duration_days && (
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Duration</p>
                          <div className="flex items-center text-sm font-medium text-gray-700">
                            <Clock className="h-3.5 w-3.5 mr-1 text-red-500" />
                            {booking.package.duration_days} days
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Total Price</p>
                        <p className="text-sm font-bold text-gray-900">€{Number(booking.total_price).toLocaleString()}</p>
                      </div>
                    </div>

                    {booking.special_requests && (
                      <div className="bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-600 border border-gray-100">
                        <span className="font-medium text-gray-700">Special requests: </span>
                        {booking.special_requests}
                      </div>
                    )}

                    <div className="mt-3 text-xs text-gray-400">
                      Booked on {new Date(booking.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
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
