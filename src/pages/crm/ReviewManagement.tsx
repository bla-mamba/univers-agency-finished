import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Star, Check, X, Trash2, Eye } from 'lucide-react';

interface Review {
 id: string;
 package_id: string;
 user_id: string | null;
 reviewer_name: string;
 reviewer_email: string;
 rating: number;
 comment: string;
 status: 'pending' | 'approved' | 'rejected';
 created_at: string;
 package: { title: string } | null;
}

export default function ReviewManagement() {
 const [searchParams] = useSearchParams();
 const packageFilter = searchParams.get('package') || '';
 const [reviews, setReviews] = useState<Review[]>([]);
 const [packages, setPackages] = useState<{ id: string; title: string }[]>([]);
 const [selectedPackage, setSelectedPackage] = useState(packageFilter);
 const [loading, setLoading] = useState(true);
 const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
 const [selected, setSelected] = useState<Review | null>(null);

 useEffect(() => {
 loadData();
 }, []);

 const loadData = async () => {
 try {
 const [reviewsRes, pkgsRes] = await Promise.all([
 supabase.from('package_reviews').select(`*, package:packages(title)`).order('created_at', { ascending: false }),
 supabase.from('packages').select('id, title').order('title'),
 ]);
 if (reviewsRes.error) throw reviewsRes.error;
 setReviews(reviewsRes.data || []);
 setPackages(pkgsRes.data || []);
 } catch (err) {
 console.error('Error loading reviews:', err);
 } finally {
 setLoading(false);
 }
 };

 const loadReviews = loadData;

 const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
 try {
 const { error } = await supabase
 .from('package_reviews')
 .update({ status })
 .eq('id', id);
 if (error) throw error;
 setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
 if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
 } catch (err) {
 console.error('Error updating review:', err);
 }
 };

 const deleteReview = async (id: string) => {
 if (!confirm('Delete this review?')) return;
 try {
 const { error } = await supabase.from('package_reviews').delete().eq('id', id);
 if (error) throw error;
 setReviews((prev) => prev.filter((r) => r.id !== id));
 if (selected?.id === id) setSelected(null);
 } catch (err) {
 console.error('Error deleting review:', err);
 }
 };

 const filtered = reviews
 .filter((r) => filter === 'all' || r.status === filter)
 .filter((r) => !selectedPackage || r.package_id === selectedPackage);

 const statusBadge = (status: string) => {
 const map: Record<string, string> = {
 pending: 'bg-yellow-100 text-yellow-800',
 approved: 'bg-green-100 text-green-800',
 rejected: 'bg-red-100 text-red-800',
 };
 return map[status] || 'bg-gray-100 text-gray-800';
 };

 const counts = {
 all: reviews.length,
 pending: reviews.filter((r) => r.status === 'pending').length,
 approved: reviews.filter((r) => r.status === 'approved').length,
 rejected: reviews.filter((r) => r.status === 'rejected').length,
 };

 if (loading) {
 return (
 <div className="flex items-center justify-center h-screen">
 <div className="animate-spin h-12 w-12 border-b-2 border-red-600" />
 </div>
 );
 }

 return (
 <div className="p-8">
 <div className="mb-8">
 <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
 <p className="text-gray-600 mt-1">Moderate customer reviews before they appear publicly</p>
 </div>

 <div className="flex gap-3 mb-6 flex-wrap items-center">
 {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
 <button
 key={f}
 onClick={() => setFilter(f)}
 className={`px-4 py-2 text-sm font-medium transition capitalize ${
 filter === f ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
 }`}
 >
 {f} ({counts[f]})
 </button>
 ))}
 <div className="ml-auto">
 <select
 value={selectedPackage}
 onChange={(e) => setSelectedPackage(e.target.value)}
 className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
 >
 <option value="">All packages</option>
 {packages.map((p) => (
 <option key={p.id} value={p.id}>{p.title}</option>
 ))}
 </select>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 <div className="space-y-4">
 {filtered.length === 0 ? (
 <div className="bg-white shadow p-8 text-center text-gray-500">No reviews found</div>
 ) : (
 filtered.map((review) => (
 <div
 key={review.id}
 onClick={() => setSelected(review)}
 className={`bg-white shadow p-5 cursor-pointer transition hover:shadow-md border-2 ${
 selected?.id === review.id ? 'border-red-500' : 'border-transparent'
 }`}
 >
 <div className="flex items-start justify-between gap-3">
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-1">
 <span className="font-semibold text-gray-900 truncate">{review.reviewer_name}</span>
 <span className={`text-xs px-2 py-0.5 font-medium ${statusBadge(review.status)}`}>
 {review.status}
 </span>
 </div>
 <p className="text-xs text-gray-500 mb-2">{review.package?.title || 'Unknown package'}</p>
 <div className="flex gap-0.5 mb-2">
 {[1, 2, 3, 4, 5].map((s) => (
 <Star
 key={s}
 className={`h-3.5 w-3.5 ${s <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`}
 />
 ))}
 </div>
 <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
 </div>
 <div className="flex flex-col gap-1 shrink-0">
 <button onClick={(e) => { e.stopPropagation(); setSelected(review); }} className="p-1.5 text-gray-400 hover:text-blue-600 transition">
 <Eye className="h-4 w-4" />
 </button>
 <button onClick={(e) => { e.stopPropagation(); deleteReview(review.id); }} className="p-1.5 text-gray-400 hover:text-red-600 transition">
 <Trash2 className="h-4 w-4" />
 </button>
 </div>
 </div>
 <p className="text-xs text-gray-400 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
 </div>
 ))
 )}
 </div>

 <div className="lg:sticky lg:top-6 self-start">
 {selected ? (
 <div className="bg-white shadow p-6">
 <h3 className="text-lg font-bold text-gray-900 mb-4">Review Detail</h3>
 <div className="space-y-3 mb-6">
 <div>
 <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Package</p>
 <p className="font-semibold text-gray-900">{selected.package?.title}</p>
 </div>
 <div>
 <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Reviewer</p>
 <p className="font-semibold text-gray-900">{selected.reviewer_name}</p>
 <p className="text-sm text-gray-500">{selected.reviewer_email}</p>
 </div>
 <div>
 <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Rating</p>
 <div className="flex gap-1">
 {[1, 2, 3, 4, 5].map((s) => (
 <Star
 key={s}
 className={`h-5 w-5 ${s <= selected.rating ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`}
 />
 ))}
 <span className="ml-1 text-sm font-semibold text-gray-700">{selected.rating}/5</span>
 </div>
 </div>
 <div>
 <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Comment</p>
 <p className="text-gray-700 leading-relaxed">{selected.comment}</p>
 </div>
 <div>
 <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</p>
 <span className={`text-sm px-2 py-1 font-medium ${statusBadge(selected.status)}`}>
 {selected.status}
 </span>
 </div>
 <div>
 <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Submitted</p>
 <p className="text-sm text-gray-700">{new Date(selected.created_at).toLocaleString()}</p>
 </div>
 </div>

 {selected.status !== 'approved' && (
 <button
 onClick={() => updateStatus(selected.id, 'approved')}
 className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 font-semibold hover:bg-green-700 transition mb-2"
 >
 <Check className="h-4 w-4" /> Approve Review
 </button>
 )}
 {selected.status !== 'rejected' && (
 <button
 onClick={() => updateStatus(selected.id, 'rejected')}
 className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white py-2.5 font-semibold hover:bg-gray-700 transition mb-2"
 >
 <X className="h-4 w-4" /> Reject Review
 </button>
 )}
 <button
 onClick={() => deleteReview(selected.id)}
 className="w-full flex items-center justify-center gap-2 border border-red-300 text-red-600 py-2.5 font-semibold hover:bg-red-50 transition"
 >
 <Trash2 className="h-4 w-4" /> Delete Review
 </button>
 </div>
 ) : (
 <div className="bg-white shadow p-8 text-center text-gray-400">
 <Eye className="h-10 w-10 mx-auto mb-3 opacity-30" />
 <p>Select a review to see details and take action</p>
 </div>
 )}
 </div>
 </div>
 </div>
 );
}
