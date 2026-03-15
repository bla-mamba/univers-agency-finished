import { useEffect, useState} from'react';
import { useParams, Link} from'react-router-dom';
import {
 MapPin, Calendar, Users, ArrowLeft, Check, X,
 Star, ChevronLeft, ChevronRight, Tag, Heart, Send,
 BarChart2
} from'lucide-react';
import { supabase} from'../lib/supabase';
import { useAuth} from'../contexts/AuthContext';
import { useCompare} from'../contexts/CompareContext';

interface PackageDetail {
 id: string;
 title: string;
 slug: string;
 description: string;
 price: number;
 original_price: number | null;
 duration_days: number;
 max_group_size: number;
 images: string[];
 video_url: string | null;
 featured: boolean;
 inclusions: string[];
 exclusions: string[];
 destination: {
 id: string;
 name: string;
 slug: string;
 country: string;
 image_url: string;
 video_url: string | null;
} | null;
 category: { name: string} | null;
}

interface Review {
 id: string;
 reviewer_name: string;
 rating: number;
 comment: string;
 created_at: string;
}

interface AvailabilitySlot {
 id: string;
 available_date: string;
 total_seats: number;
 booked_seats: number;
 is_blocked: boolean;
 notes: string;
}

export default function PackageDetailPage() {
 const { slug} = useParams<{ slug: string}>();
 const { user, profile} = useAuth();
 const { addToCompare, removeFromCompare, isInCompare} = useCompare();

 const [pkg, setPkg] = useState<PackageDetail | null>(null);
 const [loading, setLoading] = useState(true);
 const [notFound, setNotFound] = useState(false);
 const [activeImage, setActiveImage] = useState(0);

 const [reviews, setReviews] = useState<Review[]>([]);
 const [avgRating, setAvgRating] = useState<number | null>(null);

 const [inWishlist, setInWishlist] = useState(false);
 const [wishlistLoading, setWishlistLoading] = useState(false);

 const [reviewForm, setReviewForm] = useState({ rating: 5, comment:''});
 const [reviewSubmitting, setReviewSubmitting] = useState(false);
 const [reviewSuccess, setReviewSuccess] = useState(false);
 const [reviewError, setReviewError] = useState('');

 const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
 const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
 const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
 const [selectedDate, setSelectedDate] = useState<string | null>(null);

 const [bookingModal, setBookingModal] = useState(false);
 const [bookingForm, setBookingForm] = useState({
 customer_name:'',
 customer_email:'',
 customer_phone:'',
 num_travelers: 1,
 special_requests:'',
});
 const [bookingSubmitting, setBookingSubmitting] = useState(false);
 const [bookingSuccess, setBookingSuccess] = useState(false);
 const [bookingError, setBookingError] = useState('');

 useEffect(() => {
 if (slug) loadPackage(slug);
}, [slug]);

 useEffect(() => {
 if (pkg && user) checkWishlist(pkg.id);
}, [pkg, user]);

 useEffect(() => {
 if (user && profile) {
 setBookingForm((f) => ({
 ...f,
 customer_name: profile.full_name ||'',
 customer_email: user.email ||'',
 customer_phone: profile.phone ||'',
}));
}
}, [user, profile]);

 const loadPackage = async (pkgSlug: string) => {
 try {
 const { data, error} = await supabase
 .from('packages')
 .select(`
 *,
 destination:destinations(id, name, slug, country, image_url, video_url),
 category:categories(name)
`)
 .eq('slug', pkgSlug)
 .maybeSingle();

 if (error) throw error;
 if (!data) { setNotFound(true); return;}
 setPkg(data);
 loadReviews(data.id);
 loadAvailability(data.id);
} catch (error) {
 console.error('Error loading package:', error);
} finally {
 setLoading(false);
}
};

 const loadReviews = async (packageId: string) => {
 const { data} = await supabase
 .from('package_reviews')
 .select('id, reviewer_name, rating, comment, created_at')
 .eq('package_id', packageId)
 .eq('status','approved')
 .order('created_at', { ascending: false});

 const list = data || [];
 setReviews(list);
 if (list.length > 0) {
 const avg = list.reduce((sum, r) => sum + r.rating, 0) / list.length;
 setAvgRating(Math.round(avg * 10) / 10);
}
};

 const loadAvailability = async (packageId: string) => {
 const today = new Date().toISOString().split('T')[0];
 const { data} = await supabase
 .from('package_availability')
 .select('*')
 .eq('package_id', packageId)
 .gte('available_date', today)
 .order('available_date', { ascending: true});
 setAvailability(data || []);
};

 const checkWishlist = async (packageId: string) => {
 if (!user) return;
 const { data} = await supabase
 .from('wishlists')
 .select('id')
 .eq('user_id', user.id)
 .eq('package_id', packageId)
 .maybeSingle();
 setInWishlist(!!data);
};

 const toggleWishlist = async () => {
 if (!user || !pkg) return;
 setWishlistLoading(true);
 try {
 if (inWishlist) {
 await supabase.from('wishlists').delete().eq('user_id', user.id).eq('package_id', pkg.id);
 setInWishlist(false);
} else {
 await supabase.from('wishlists').insert({ user_id: user.id, package_id: pkg.id});
 setInWishlist(true);
}
} catch (err) {
 console.error('Wishlist error:', err);
} finally {
 setWishlistLoading(false);
}
};

 const submitReview = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!user || !pkg) return;
 if (!reviewForm.comment.trim()) {
 setReviewError('Please write a comment.');
 return;
}
 setReviewSubmitting(true);
 setReviewError('');
 try {
 const { error} = await supabase.from('package_reviews').insert({
 package_id: pkg.id,
 user_id: user.id,
 reviewer_name: profile?.full_name ||'Anonymous',
 reviewer_email: user.email ||'',
 rating: reviewForm.rating,
 comment: reviewForm.comment.trim(),
 status:'pending',
});
 if (error) throw error;
 setReviewSuccess(true);
 setReviewForm({ rating: 5, comment:''});
} catch (err) {
 setReviewError('Failed to submit review. Please try again.');
} finally {
 setReviewSubmitting(false);
}
};

 const submitBooking = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!pkg || !selectedDate) return;
 if (!bookingForm.customer_name.trim() || !bookingForm.customer_email.trim()) {
 setBookingError('Please fill in all required fields.');
 return;
}
 setBookingSubmitting(true);
 setBookingError('');
 try {
 const totalPrice = pkg.price * bookingForm.num_travelers;
 const { error} = await supabase.from('bookings').insert({
 user_id: user?.id || null,
 package_id: pkg.id,
 booking_date: new Date().toISOString().split('T')[0],
 travel_date: selectedDate,
 num_travelers: bookingForm.num_travelers,
 total_price: totalPrice,
 status:'pending',
 payment_status:'pending',
 customer_name: bookingForm.customer_name.trim(),
 customer_email: bookingForm.customer_email.trim(),
 customer_phone: bookingForm.customer_phone.trim(),
 special_requests: bookingForm.special_requests.trim(),
});
 if (error) throw error;
 setBookingSuccess(true);
} catch (err: any) {
 setBookingError(err.message ||'Failed to submit booking. Please try again.');
} finally {
 setBookingSubmitting(false);
}
};

 const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
 const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

 const getSlotForDate = (dateStr: string) => availability.find((a) => a.available_date === dateStr);

 const getDateStr = (year: number, month: number, day: number) => {
 const m = String(month + 1).padStart(2,'0');
 const d = String(day).padStart(2,'0');
 return`${year}-${m}-${d}`;
};

 const today = new Date().toISOString().split('T')[0];

 const prevMonth = () => {
 if (calendarMonth === 0) { setCalendarYear((y) => y - 1); setCalendarMonth(11);}
 else setCalendarMonth((m) => m - 1);
};

 const nextMonth = () => {
 if (calendarMonth === 11) { setCalendarYear((y) => y + 1); setCalendarMonth(0);}
 else setCalendarMonth((m) => m + 1);
};

 const nextImage = () => pkg && setActiveImage((prev) => (prev + 1) % pkg.images.length);
 const prevImage = () => pkg && setActiveImage((prev) => (prev - 1 + pkg.images.length) % pkg.images.length);

 const handleCompareToggle = () => {
 if (!pkg) return;
 if (isInCompare(pkg.id)) {
 removeFromCompare(pkg.id);
} else {
 addToCompare({
 id: pkg.id,
 title: pkg.title,
 slug: pkg.slug,
 price: pkg.price,
 duration_days: pkg.duration_days,
 images: pkg.images,
 destination: pkg.destination,
});
}
};

 if (loading) {
 return (
 <div className="min-h-screen bg-gray-50 flex items-center justify-center">
 <div className="animate-spin h-12 w-12 border-b-2 border-red-600" />
 </div>
 );
}

 if (notFound || !pkg) {
 return (
 <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
 <h2 className="text-2xl font-bold text-gray-800 mb-2">Package not found</h2>
 <p className="text-gray-500 mb-6">This package doesn't exist or has been removed.</p>
 <Link to="/packages" className="text-red-600 font-semibold hover:underline flex items-center gap-1">
 <ArrowLeft className="h-4 w-4" /> Back to Packages
 </Link>
 </div>
 );
}

 const images = pkg.images && pkg.images.length > 0
 ? pkg.images
 : ['https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1200'];

 const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
 const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);
 const monthName = new Date(calendarYear, calendarMonth).toLocaleString('default', { month:'long', year:'numeric'});
 const selectedSlot = selectedDate ? getSlotForDate(selectedDate) : null;
 const inCompare = isInCompare(pkg.id);

 return (
 <div className="min-h-screen bg-gray-50 pb-20">
 <div className="relative h-[480px] overflow-hidden bg-gray-900">
 {pkg.video_url ? (
 <video
 src={pkg.video_url}
 className="w-full h-full object-cover opacity-90"
 autoPlay
 muted
 loop
 playsInline
 />
 ) : (
 <img
 src={images[activeImage]}
 alt={pkg.title}
 className="w-full h-full object-cover opacity-90 transition-all duration-500"
 />
 )}
 <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />

 {!pkg.video_url && images.length > 1 && (
 <>
 <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 transition">
 <ChevronLeft className="h-6 w-6" />
 </button>
 <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 transition">
 <ChevronRight className="h-6 w-6" />
 </button>
 <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
 {images.map((_, i) => (
 <button key={i} onClick={() => setActiveImage(i)} className={`w-2 h-2 transition ${i === activeImage ?'bg-white scale-125' :'bg-white/50'}`} />
 ))}
 </div>
 </>
 )}

 <div className="absolute bottom-0 left-0 right-0 p-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="mb-3 flex items-center gap-2 flex-wrap">
 {pkg.destination && (
 <Link to={`/destinations/${pkg.destination.slug}`} className="inline-flex items-center text-white/80 hover:text-white text-sm transition">
 <ArrowLeft className="h-4 w-4 mr-1" />{pkg.destination.name}
 </Link>
 )}
 </div>
 <div className="flex flex-wrap items-center gap-2 mb-3">
 {pkg.featured && <span className="bg-red-600 text-white text-xs px-3 py-1 font-semibold">Featured</span>}
 {pkg.category && (
 <span className="bg-white/20 text-white text-xs px-3 py-1 font-medium flex items-center gap-1">
 <Tag className="h-3 w-3" />{pkg.category.name}
 </span>
 )}
 </div>
 <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">{pkg.title}</h1>
 {pkg.destination && (
 <div className="flex items-center mt-2 text-gray-200">
 <MapPin className="h-4 w-4 mr-1" />{pkg.destination.name}, {pkg.destination.country}
 </div>
 )}
 </div>
 </div>

 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 space-y-8">
 <div className="bg-white shadow-sm p-8">
 <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
 <p className="text-gray-600 text-lg leading-relaxed">{pkg.description}</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {pkg.inclusions && pkg.inclusions.length > 0 && (
 <div className="bg-white shadow-sm p-6">
 <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
 <span className="w-6 h-6 bg-green-100 flex items-center justify-center"><Check className="h-4 w-4 text-green-600" /></span>
 What's Included
 </h3>
 <ul className="space-y-2">
 {pkg.inclusions.map((item, i) => (
 <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
 <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />{item}
 </li>
 ))}
 </ul>
 </div>
 )}
 {pkg.exclusions && pkg.exclusions.length > 0 && (
 <div className="bg-white shadow-sm p-6">
 <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
 <span className="w-6 h-6 bg-red-100 flex items-center justify-center"><X className="h-4 w-4 text-red-500" /></span>
 Not Included
 </h3>
 <ul className="space-y-2">
 {pkg.exclusions.map((item, i) => (
 <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
 <X className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />{item}
 </li>
 ))}
 </ul>
 </div>
 )}
 </div>

 <div className="bg-white shadow-sm p-6">
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-2xl font-bold text-gray-900">Availability</h2>
 <div className="flex items-center gap-3 text-xs text-gray-500">
 <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-400 inline-block"></span>Available</span>
 <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-orange-400 inline-block"></span>Limited</span>
 <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-300 inline-block"></span>Full/Blocked</span>
 </div>
 </div>

 <div className="flex items-center justify-between mb-4">
 <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 transition">
 <ChevronLeft className="h-5 w-5 text-gray-600" />
 </button>
 <span className="font-semibold text-gray-800">{monthName}</span>
 <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 transition">
 <ChevronRight className="h-5 w-5 text-gray-600" />
 </button>
 </div>

 <div className="grid grid-cols-7 gap-1 mb-2">
 {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d) => (
 <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
 ))}
 </div>

 <div className="grid grid-cols-7 gap-1">
 {Array.from({ length: firstDay}).map((_, i) => <div key={`e-${i}`} />)}
 {Array.from({ length: daysInMonth}).map((_, i) => {
 const day = i + 1;
 const dateStr = getDateStr(calendarYear, calendarMonth, day);
 const slot = getSlotForDate(dateStr);
 const isPast = dateStr < today;
 const isSelected = selectedDate === dateStr;
 const isBlocked = slot?.is_blocked;
 const isFull = slot && !isBlocked && slot.booked_seats >= slot.total_seats;
 const isLimited = slot && !isBlocked && !isFull && slot.total_seats - slot.booked_seats <= 3;
 const isAvailable = slot && !isBlocked && !isFull;
 const seatsLeft = slot ? slot.total_seats - slot.booked_seats : null;

 let cellClass ='relative text-center py-2 px-1 text-sm transition';
 if (isPast) {
 cellClass +='text-gray-300 cursor-default';
} else if (!slot) {
 cellClass +='text-gray-400 cursor-default';
} else if (isBlocked || isFull) {
 cellClass +='bg-red-100 text-red-400 cursor-not-allowed';
} else if (isSelected) {
 cellClass +='bg-red-600 text-white font-semibold shadow-md cursor-pointer';
} else if (isLimited) {
 cellClass +='bg-orange-100 text-orange-700 hover:bg-orange-200 cursor-pointer font-medium';
} else if (isAvailable) {
 cellClass +='bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer font-medium';
} else {
 cellClass +='text-gray-400 cursor-default';
}

 const canSelect = !isPast && slot && !isBlocked && !isFull;

 return (
 <button
 key={day}
 disabled={!canSelect}
 onClick={() => canSelect && setSelectedDate(isSelected ? null : dateStr)}
 className={cellClass}
 title={slot ? (isBlocked ?'Blocked' : isFull ?'Fully booked' :`${seatsLeft} seats left`) :''}
 >
 {day}
 {slot && !isBlocked && !isFull && seatsLeft !== null && (
 <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] leading-none opacity-70">
 {seatsLeft}
 </span>
 )}
 </button>
 );
})}
 </div>

 {selectedDate && (
 <div className="mt-4 p-4 bg-green-50 border border-green-200 flex items-center justify-between">
 <div>
 <p className="text-sm font-semibold text-green-800">
 Selected: {new Date(selectedDate +'T00:00:00').toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric'})}
 </p>
 {selectedSlot && (
 <p className="text-xs text-green-600 mt-0.5">
 {selectedSlot.total_seats - selectedSlot.booked_seats} seats available
 {selectedSlot.notes &&` · ${selectedSlot.notes}`}
 </p>
 )}
 </div>
 <button
 onClick={() => setBookingModal(true)}
 className="bg-green-600 text-white px-4 py-2 text-sm font-semibold hover:bg-green-700 transition"
 >
 Book This Date
 </button>
 </div>
 )}

 {availability.length === 0 && (
 <p className="text-center text-gray-400 text-sm mt-4 py-4">
 No availability slots configured. Contact us to book.
 </p>
 )}
 </div>

 {pkg.destination && (
 <div className="bg-white shadow-sm overflow-hidden">
 <div className="relative h-48">
 {pkg.destination.video_url ? (
 <video
 src={pkg.destination.video_url}
 className="w-full h-full object-cover"
 autoPlay
 muted
 loop
 playsInline
 />
 ) : (
 <img
 src={pkg.destination.image_url ||'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800'}
 alt={pkg.destination.name}
 className="w-full h-full object-cover"
 />
 )}
 <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
 <div className="absolute inset-0 flex items-center px-8">
 <div>
 <p className="text-white/70 text-sm mb-1">Destination</p>
 <h3 className="text-2xl font-bold text-white">{pkg.destination.name}</h3>
 <p className="text-gray-200 text-sm">{pkg.destination.country}</p>
 </div>
 </div>
 </div>
 <div className="p-5 flex items-center justify-between">
 <p className="text-gray-600 text-sm">Explore more packages in this destination</p>
 <Link to={`/destinations/${pkg.destination.slug}`} className="text-red-600 font-semibold text-sm hover:underline flex items-center gap-1">
 View Destination &rarr;
 </Link>
 </div>
 </div>
 )}

 <div className="bg-white shadow-sm p-8">
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-2xl font-bold text-gray-900">
 Customer Reviews
 {reviews.length > 0 && <span className="text-base font-normal text-gray-500 ml-2">({reviews.length})</span>}
 </h2>
 {avgRating && (
 <div className="flex items-center gap-2">
 <div className="flex gap-0.5">
 {[1, 2, 3, 4, 5].map((s) => (
 <Star key={s} className={`h-5 w-5 ${s <= Math.round(avgRating) ?'text-yellow-400 fill-current' :'text-gray-200 fill-current'}`} />
 ))}
 </div>
 <span className="font-bold text-gray-900 text-lg">{avgRating}</span>
 </div>
 )}
 </div>

 {reviews.length === 0 ? (
 <p className="text-gray-400 text-sm mb-8">No reviews yet. Be the first to share your experience!</p>
 ) : (
 <div className="space-y-5 mb-8">
 {reviews.map((review) => (
 <div key={review.id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
 <div className="flex items-center justify-between mb-2">
 <div>
 <span className="font-semibold text-gray-900">{review.reviewer_name}</span>
 <span className="text-xs text-gray-400 ml-3">{new Date(review.created_at).toLocaleDateString()}</span>
 </div>
 <div className="flex gap-0.5">
 {[1, 2, 3, 4, 5].map((s) => (
 <Star key={s} className={`h-4 w-4 ${s <= review.rating ?'text-yellow-400 fill-current' :'text-gray-200 fill-current'}`} />
 ))}
 </div>
 </div>
 <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
 </div>
 ))}
 </div>
 )}

 {user ? (
 reviewSuccess ? (
 <div className="bg-green-50 border border-green-200 p-5 text-center">
 <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
 <p className="font-semibold text-green-800">Review submitted!</p>
 <p className="text-sm text-green-600 mt-1">Thank you!</p>
 </div>
 ) : (
 <form onSubmit={submitReview} className="border-t border-gray-100 pt-6">
 <h3 className="font-bold text-gray-900 mb-4">Leave a Review</h3>
 <div className="mb-4">
 <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
 <div className="flex gap-2">
 {[1, 2, 3, 4, 5].map((s) => (
 <button key={s} type="button" onClick={() => setReviewForm((f) => ({ ...f, rating: s}))}>
 <Star className={`h-7 w-7 transition ${s <= reviewForm.rating ?'text-yellow-400 fill-current' :'text-gray-300 fill-current hover:text-yellow-300'}`} />
 </button>
 ))}
 </div>
 </div>
 <div className="mb-4">
 <label className="block text-sm font-medium text-gray-700 mb-2">Your Comment</label>
 <textarea
 value={reviewForm.comment}
 onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value}))}
 rows={4}
 placeholder="Share your experience with this package..."
 className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
 />
 </div>
 {reviewError && <p className="text-red-600 text-sm mb-3">{reviewError}</p>}
 <button
 type="submit"
 disabled={reviewSubmitting}
 className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 font-semibold hover:bg-red-700 transition disabled:opacity-60"
 >
 <Send className="h-4 w-4" />
 {reviewSubmitting ?'Submitting...' :'Submit Review'}
 </button>
 </form>
 )
 ) : (
 <div className="border-t border-gray-100 pt-6 text-center">
 <p className="text-gray-500 text-sm mb-3">Sign in to leave a review</p>
 <Link to="/login" className="text-red-600 font-semibold hover:underline text-sm">Sign In &rarr;</Link>
 </div>
 )}
 </div>
 </div>

 <div className="lg:col-span-1">
 <div className="bg-white shadow-lg p-6 sticky top-6">
 <div className="text-center border-b border-gray-100 pb-5 mb-5">
 <p className="text-gray-500 text-sm mb-1">Starting from</p>
 {pkg.original_price != null && (
 <p className="text-gray-400 text-lg line-through mb-0.5">€{pkg.original_price.toLocaleString()}</p>
 )}
 <p className="text-4xl font-bold text-red-600">€{pkg.price.toLocaleString()}</p>
 {pkg.original_price != null && (
 <p className="text-green-600 text-xs font-semibold mt-1 uppercase tracking-wide">
 Save €{(pkg.original_price - pkg.price).toLocaleString()} per person
 </p>
 )}
 <p className="text-gray-400 text-sm mt-0.5">per person</p>
 </div>

 <div className="space-y-3 mb-6">
 <div className="flex items-center justify-between text-sm">
 <div className="flex items-center gap-2 text-gray-600"><Calendar className="h-4 w-4 text-red-500" />Duration</div>
 <span className="font-semibold text-gray-900">{pkg.duration_days} days</span>
 </div>
 <div className="flex items-center justify-between text-sm">
 <div className="flex items-center gap-2 text-gray-600"><Users className="h-4 w-4 text-red-500" />Group size</div>
 <span className="font-semibold text-gray-900">Max {pkg.max_group_size} people</span>
 </div>
 {pkg.destination && (
 <div className="flex items-center justify-between text-sm">
 <div className="flex items-center gap-2 text-gray-600"><MapPin className="h-4 w-4 text-red-500" />Destination</div>
 <span className="font-semibold text-gray-900">{pkg.destination.name}</span>
 </div>
 )}
 <div className="flex items-center justify-between text-sm">
 <div className="flex items-center gap-2 text-gray-600"><Star className="h-4 w-4 text-red-500" />Rating</div>
 <div className="flex items-center gap-1">
 {avgRating ? (
 <>
 {[1, 2, 3, 4, 5].map((s) => (
 <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.round(avgRating) ?'text-yellow-400 fill-current' :'text-gray-200 fill-current'}`} />
 ))}
 <span className="font-semibold text-gray-900 ml-1">{avgRating}</span>
 </>
 ) : (
 <span className="text-gray-400 text-xs">No reviews yet</span>
 )}
 </div>
 </div>
 </div>

 {selectedDate ? (
 <button
 onClick={() => setBookingModal(true)}
 className="block w-full bg-red-600 text-white text-center py-3 font-semibold hover:bg-red-700 transition text-base"
 >
 Book — {new Date(selectedDate +'T00:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric'})}
 </button>
 ) : (
 <button
 onClick={() => {
 const calEl = document.getElementById('availability-calendar');
 if (calEl) calEl.scrollIntoView({ behavior:'smooth'});
}}
 className="block w-full bg-red-600 text-white text-center py-3 font-semibold hover:bg-red-700 transition text-base"
 >
 Select a Date to Book
 </button>
 )}

 {user ? (
 <button
 onClick={toggleWishlist}
 disabled={wishlistLoading}
 className={`flex w-full mt-3 border text-center py-3 font-semibold transition text-base items-center justify-center gap-2 ${
 inWishlist ?'border-red-600 bg-red-50 text-red-600 hover:bg-red-100' :'border-gray-300 text-gray-700 hover:bg-gray-50'
}`}
 >
 <Heart className={`h-4 w-4 ${inWishlist ?'fill-current' :''}`} />
 {inWishlist ?'Saved to Wishlist' :'Save to Wishlist'}
 </button>
 ) : (
 <Link
 to="/login"
 className="flex w-full mt-3 border border-gray-300 text-gray-700 text-center py-3 font-semibold hover:bg-gray-50 transition text-base items-center justify-center gap-2"
 >
 <Heart className="h-4 w-4" />Save to Wishlist
 </Link>
 )}

 <button
 onClick={handleCompareToggle}
 className={`flex w-full mt-3 border text-center py-3 font-semibold transition text-base items-center justify-center gap-2 ${
 inCompare ?'border-blue-600 bg-blue-50 text-blue-600 hover:bg-blue-100' :'border-gray-300 text-gray-700 hover:bg-gray-50'
}`}
 >
 <BarChart2 className="h-4 w-4" />
 {inCompare ?'Remove from Compare' :'Add to Compare'}
 </button>

 <Link
 to="/contact"
 className="block w-full mt-3 border border-red-600 text-red-600 text-center py-3 font-semibold hover:bg-red-50 transition text-base"
 >
 Ask a Question
 </Link>
 <p className="text-center text-gray-400 text-xs mt-4">Free cancellation up to 48 hours before departure</p>
 </div>
 </div>
 </div>
 </div>

 {bookingModal && (
 <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
 <div className="bg-white shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
 <div className="p-6 border-b border-gray-100 flex items-center justify-between">
 <div>
 <h2 className="text-xl font-bold text-gray-900">Book Your Trip</h2>
 {selectedDate && (
 <p className="text-sm text-gray-500 mt-0.5">
 {new Date(selectedDate +'T00:00:00').toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric'})}
 </p>
 )}
 </div>
 <button onClick={() => { setBookingModal(false); setBookingError(''); setBookingSuccess(false);}} className="text-gray-400 hover:text-gray-600 transition">
 <X className="h-6 w-6" />
 </button>
 </div>

 {bookingSuccess ? (
 <div className="p-8 text-center">
 <div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-4">
 <Check className="h-8 w-8 text-green-500" />
 </div>
 <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Submitted!</h3>
 <p className="text-gray-500 text-sm mb-6">Your booking request has been received. Our team will confirm it shortly.</p>
 <button
 onClick={() => { setBookingModal(false); setBookingSuccess(false);}}
 className="bg-red-600 text-white px-6 py-2.5 font-semibold hover:bg-red-700 transition text-sm"
 >
 Close
 </button>
 </div>
 ) : (
 <form onSubmit={submitBooking} className="p-6 space-y-4">
 <div className="bg-gray-50 p-4 mb-2">
 <div className="flex items-center justify-between mb-1">
 <span className="text-sm font-semibold text-gray-700">{pkg.title}</span>
 <span className="text-sm font-bold text-red-600">${pkg.price.toLocaleString()}/person</span>
 </div>
 {selectedDate && (
 <p className="text-xs text-gray-500">
 Travel date: {new Date(selectedDate +'T00:00:00').toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric'})}
 </p>
 )}
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
 <input
 type="text"
 required
 value={bookingForm.customer_name}
 onChange={(e) => setBookingForm((f) => ({ ...f, customer_name: e.target.value}))}
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
 placeholder="Your full name"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
 <input
 type="email"
 required
 value={bookingForm.customer_email}
 onChange={(e) => setBookingForm((f) => ({ ...f, customer_email: e.target.value}))}
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
 placeholder="your@email.com"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
 <input
 type="tel"
 value={bookingForm.customer_phone}
 onChange={(e) => setBookingForm((f) => ({ ...f, customer_phone: e.target.value}))}
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
 placeholder="+1 (555) 000-0000"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Travelers *</label>
 <select
 value={bookingForm.num_travelers}
 onChange={(e) => setBookingForm((f) => ({ ...f, num_travelers: Number(e.target.value)}))}
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
 >
 {Array.from({
 length: Math.min(
 pkg.max_group_size,
 selectedSlot ? Math.max(selectedSlot.total_seats - selectedSlot.booked_seats, 1) : pkg.max_group_size
 )
}, (_, i) => i + 1).map((n) => (
 <option key={n} value={n}>{n} {n === 1 ?'traveler' :'travelers'}</option>
 ))}
 </select>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Special Requests</label>
 <textarea
 value={bookingForm.special_requests}
 onChange={(e) => setBookingForm((f) => ({ ...f, special_requests: e.target.value}))}
 rows={3}
 placeholder="Any dietary requirements, accessibility needs, etc."
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
 />
 </div>

 <div className="bg-red-50 p-4 flex items-center justify-between">
 <span className="text-sm font-semibold text-gray-700">Total Price</span>
 <span className="text-xl font-bold text-red-600">${(pkg.price * bookingForm.num_travelers).toLocaleString()}</span>
 </div>

 {bookingError && <p className="text-red-600 text-sm">{bookingError}</p>}

 <button
 type="submit"
 disabled={bookingSubmitting}
 className="w-full bg-red-600 text-white py-3 font-semibold hover:bg-red-700 transition text-sm disabled:opacity-60"
 >
 {bookingSubmitting ?'Submitting...' :'Confirm Booking Request'}
 </button>
 <p className="text-xs text-gray-400 text-center">No payment required now. Our team will contact you to confirm.</p>
 </form>
 )}
 </div>
 </div>
 )}
 </div>
 );
}
