import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Package, Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';

interface Stats {
 totalBookings: number;
 totalRevenue: number;
 totalPackages: number;
 totalCustomers: number;
}

interface RecentBooking {
 id: string;
 customer_name: string;
 customer_email: string;
 total_price: number;
 status: string;
 created_at: string;
 package: { title: string } | null;
}

interface MonthlyData {
 month: string;
 bookings: number;
 revenue: number;
}

interface TopPackage {
 title: string;
 bookings: number;
 revenue: number;
}

export default function Dashboard() {
 const [stats, setStats] = useState<Stats>({ totalBookings: 0, totalRevenue: 0, totalPackages: 0, totalCustomers: 0 });
 const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
 const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
 const [topPackages, setTopPackages] = useState<TopPackage[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 loadDashboardData();
 }, []);

 const loadDashboardData = async () => {
 try {
 const [bookingsRes, packagesRes, profilesRes, recentRes] = await Promise.all([
 supabase.from('bookings').select('total_price, created_at, status, package_id', { count: 'exact' }),
 supabase.from('packages').select('id, title', { count: 'exact' }),
 supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'customer'),
 supabase.from('bookings').select(`*, package:packages(title)`).order('created_at', { ascending: false }).limit(5),
 ]);

 const allBookings = bookingsRes.data || [];
 const totalRevenue = allBookings.reduce((sum, b) => sum + Number(b.total_price), 0);

 setStats({
 totalBookings: bookingsRes.count || 0,
 totalRevenue,
 totalPackages: packagesRes.count || 0,
 totalCustomers: profilesRes.count || 0,
 });

 setRecentBookings(recentRes.data || []);

 const monthMap: Record<string, { bookings: number; revenue: number }> = {};
 const now = new Date();
 for (let i = 5; i >= 0; i--) {
 const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
 const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
 monthMap[key] = { bookings: 0, revenue: 0 };
 }

 allBookings.forEach((b) => {
 const d = new Date(b.created_at);
 const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
 if (monthMap[key]) {
 monthMap[key].bookings += 1;
 monthMap[key].revenue += Number(b.total_price);
 }
 });

 setMonthlyData(
 Object.entries(monthMap).map(([month, v]) => ({ month, ...v }))
 );

 const packageBookings: Record<string, { title: string; bookings: number; revenue: number }> = {};
 const packages = packagesRes.data || [];
 packages.forEach((p) => {
 packageBookings[p.id] = { title: p.title, bookings: 0, revenue: 0 };
 });

 allBookings.forEach((b) => {
 if (b.package_id && packageBookings[b.package_id]) {
 packageBookings[b.package_id].bookings += 1;
 packageBookings[b.package_id].revenue += Number(b.total_price);
 }
 });

 const sorted = Object.values(packageBookings)
 .sort((a, b) => b.bookings - a.bookings)
 .slice(0, 5);

 setTopPackages(sorted);
 } catch (error) {
 console.error('Error loading dashboard:', error);
 } finally {
 setLoading(false);
 }
 };

 const getStatusColor = (status: string) => {
 const colors: Record<string, string> = {
 pending: 'bg-yellow-100 text-yellow-800',
 confirmed: 'bg-green-100 text-green-800',
 cancelled: 'bg-red-100 text-red-800',
 completed: 'bg-blue-100 text-blue-800',
 };
 return colors[status] || 'bg-gray-100 text-gray-800';
 };

 const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue), 1);
 const maxBookings = Math.max(...monthlyData.map((d) => d.bookings), 1);
 const maxPkgBookings = Math.max(...topPackages.map((p) => p.bookings), 1);

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
 <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
 <p className="text-gray-600 mt-1">Welcome to your admin panel</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
 {[
 { title: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'bg-red-500' },
 { title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
 { title: 'Total Packages', value: stats.totalPackages, icon: Package, color: 'bg-blue-500' },
 { title: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'bg-orange-500' },
 ].map((stat) => {
 const Icon = stat.icon;
 return (
 <div key={stat.title} className="bg-white shadow p-6">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
 <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
 </div>
 <div className={`${stat.color} p-3 `}>
 <Icon className="h-6 w-6 text-white" />
 </div>
 </div>
 </div>
 );
 })}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
 <div className="bg-white shadow p-6">
 <div className="flex items-center gap-2 mb-6">
 <TrendingUp className="h-5 w-5 text-green-500" />
 <h2 className="text-lg font-bold text-gray-900">Monthly Revenue</h2>
 <span className="text-xs text-gray-400 ml-auto">Last 6 months</span>
 </div>
 {monthlyData.every((d) => d.revenue === 0) ? (
 <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No revenue data yet</div>
 ) : (
 <div className="flex items-end gap-3 h-40">
 {monthlyData.map((d) => (
 <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
 <span className="text-xs text-gray-500 font-medium">
 {d.revenue > 0 ? `$${(d.revenue / 1000).toFixed(0)}k` : ''}
 </span>
 <div className="w-full relative flex items-end" style={{ height: '100px' }}>
 <div
 className="w-full bg-red-500 transition-all duration-700"
 style={{ height: `${(d.revenue / maxRevenue) * 100}%`, minHeight: d.revenue > 0 ? '4px' : '0' }}
 />
 </div>
 <span className="text-xs text-gray-500 whitespace-nowrap">{d.month}</span>
 </div>
 ))}
 </div>
 )}
 </div>

 <div className="bg-white shadow p-6">
 <div className="flex items-center gap-2 mb-6">
 <Calendar className="h-5 w-5 text-blue-500" />
 <h2 className="text-lg font-bold text-gray-900">Monthly Bookings</h2>
 <span className="text-xs text-gray-400 ml-auto">Last 6 months</span>
 </div>
 {monthlyData.every((d) => d.bookings === 0) ? (
 <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No booking data yet</div>
 ) : (
 <div className="flex items-end gap-3 h-40">
 {monthlyData.map((d) => (
 <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
 <span className="text-xs text-gray-500 font-medium">
 {d.bookings > 0 ? d.bookings : ''}
 </span>
 <div className="w-full relative flex items-end" style={{ height: '100px' }}>
 <div
 className="w-full bg-blue-500 transition-all duration-700"
 style={{ height: `${(d.bookings / maxBookings) * 100}%`, minHeight: d.bookings > 0 ? '4px' : '0' }}
 />
 </div>
 <span className="text-xs text-gray-500 whitespace-nowrap">{d.month}</span>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
 <div className="bg-white shadow p-6">
 <div className="flex items-center gap-2 mb-6">
 <Package className="h-5 w-5 text-orange-500" />
 <h2 className="text-lg font-bold text-gray-900">Top Packages</h2>
 <span className="text-xs text-gray-400 ml-auto">By bookings</span>
 </div>
 {topPackages.every((p) => p.bookings === 0) ? (
 <div className="flex items-center justify-center py-8 text-gray-400 text-sm">No booking data yet</div>
 ) : (
 <div className="space-y-4">
 {topPackages.map((pkg, i) => (
 <div key={i}>
 <div className="flex items-center justify-between text-sm mb-1">
 <span className="text-gray-700 font-medium truncate max-w-[60%]">{pkg.title}</span>
 <span className="text-gray-500 text-xs">{pkg.bookings} bookings</span>
 </div>
 <div className="h-2 bg-gray-100 overflow-hidden">
 <div
 className="h-full bg-orange-400 transition-all duration-700"
 style={{ width: `${(pkg.bookings / maxPkgBookings) * 100}%` }}
 />
 </div>
 </div>
 ))}
 </div>
 )}
 </div>

 <div className="bg-white shadow overflow-hidden">
 <div className="p-6 border-b border-gray-100">
 <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-gray-50">
 <tr>
 <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
 <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
 <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100">
 {recentBookings.length > 0 ? (
 recentBookings.map((booking) => (
 <tr key={booking.id} className="hover:bg-gray-50">
 <td className="px-5 py-3">
 <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{booking.customer_name}</div>
 <div className="text-xs text-gray-400 truncate max-w-[120px]">{booking.package?.title}</div>
 </td>
 <td className="px-5 py-3 text-sm text-gray-900 whitespace-nowrap">
 €{Number(booking.total_price).toLocaleString()}
 </td>
 <td className="px-5 py-3">
 <span className={`px-2 py-0.5 inline-flex text-xs font-semibold ${getStatusColor(booking.status)}`}>
 {booking.status}
 </span>
 </td>
 </tr>
 ))
 ) : (
 <tr>
 <td colSpan={3} className="px-5 py-8 text-center text-gray-400 text-sm">No bookings yet</td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 </div>
 );
}
