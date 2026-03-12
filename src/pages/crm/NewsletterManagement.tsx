import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Trash2, ToggleLeft, ToggleRight, Download } from 'lucide-react';

interface Subscription {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

export default function NewsletterManagement() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('subscribed_at', { ascending: false });
      if (error) throw error;
      setSubscriptions(data || []);
    } catch (err) {
      console.error('Error loading subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({ is_active: !current })
        .eq('id', id);
      if (error) throw error;
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_active: !current } : s))
      );
    } catch (err) {
      console.error('Error toggling subscription:', err);
    }
  };

  const deleteSubscription = async (id: string) => {
    if (!confirm('Remove this subscription?')) return;
    try {
      const { error } = await supabase.from('newsletter_subscriptions').delete().eq('id', id);
      if (error) throw error;
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Error deleting subscription:', err);
    }
  };

  const exportCSV = () => {
    const active = subscriptions.filter((s) => s.is_active);
    const csv = ['Email,Subscribed At', ...active.map((s) => `${s.email},${s.subscribed_at}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter_subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered =
    filter === 'all' ? subscriptions :
    filter === 'active' ? subscriptions.filter((s) => s.is_active) :
    subscriptions.filter((s) => !s.is_active);

  const activeCount = subscriptions.filter((s) => s.is_active).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Newsletter Subscriptions</h1>
          <p className="text-gray-600 mt-1">Manage email newsletter subscribers</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5  font-semibold hover:bg-red-700 transition"
        >
          <Download className="h-4 w-4" /> Export Active CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Total Subscribers</p>
          <p className="text-3xl font-bold text-gray-900">{subscriptions.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Active</p>
          <p className="text-3xl font-bold text-green-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Unsubscribed</p>
          <p className="text-3xl font-bold text-gray-400">{subscriptions.length - activeCount}</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        {(['all', 'active', 'inactive'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2  text-sm font-medium transition capitalize ${
              filter === f ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                  <Mail className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No subscriptions found
                </td>
              </tr>
            ) : (
              filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{sub.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      sub.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {sub.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(sub.subscribed_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleActive(sub.id, sub.is_active)}
                        className="text-gray-400 hover:text-blue-600 transition"
                        title={sub.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {sub.is_active ? <ToggleRight className="h-5 w-5 text-green-500" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => deleteSubscription(sub.id)}
                        className="text-gray-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
