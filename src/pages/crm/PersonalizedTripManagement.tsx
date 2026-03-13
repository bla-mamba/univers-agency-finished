import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, RefreshCw, Eye, X, CheckCircle, Clock, PhoneCall, ChevronDown } from 'lucide-react';

interface TripRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  destinations: string;
  travel_dates: string;
  duration: string;
  group_size: number;
  group_type: string;
  interests: string[];
  accommodation_preference: string;
  transport_preference: string;
  budget_range: string;
  special_requests: string;
  status: string;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800', icon: Clock },
  contacted: { label: 'Contacted', color: 'bg-blue-100 text-blue-800', icon: PhoneCall },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
};

export default function PersonalizedTripManagement() {
  const [requests, setRequests] = useState<TripRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<TripRequest | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openStatusId, setOpenStatusId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('personalized_trip_requests')
      .select('*')
      .order('created_at', { ascending: false });
    setRequests(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    setOpenStatusId(null);
    await supabase
      .from('personalized_trip_requests')
      .update({ status })
      .eq('id', id);
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    if (selected?.id === id) setSelected((s) => s ? { ...s, status } : s);
    setUpdatingId(null);
  };

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.destinations.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    contacted: requests.filter((r) => r.status === 'contacted').length,
    completed: requests.filter((r) => r.status === 'completed').length,
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personalized Trip Requests</h1>
          <p className="text-gray-500 text-sm mt-1">Manage custom itinerary requests from clients</p>
        </div>
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {(['all', 'pending', 'contacted', 'completed'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`p-4 border text-left transition-colors ${
              statusFilter === s
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 bg-white hover:border-gray-400'
            }`}
          >
            <div className={`text-2xl font-bold mb-1 ${statusFilter === s ? 'text-white' : 'text-gray-900'}`}>
              {counts[s]}
            </div>
            <div className={`text-xs uppercase tracking-wide font-semibold capitalize ${statusFilter === s ? 'text-gray-300' : 'text-gray-500'}`}>
              {s === 'all' ? 'Total Requests' : s}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or destination..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-gray-900"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading requests...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Destinations</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Group</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Budget</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((req) => {
                  const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-900">{req.full_name}</div>
                        <div className="text-gray-500 text-xs">{req.email}</div>
                      </td>
                      <td className="px-5 py-4 text-gray-700 max-w-[200px] truncate">{req.destinations}</td>
                      <td className="px-5 py-4 text-gray-600">
                        {req.group_size} pax · {req.group_type}
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-xs">{req.budget_range || '—'}</td>
                      <td className="px-5 py-4">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setOpenStatusId(openStatusId === req.id ? null : req.id)}
                            disabled={updatingId === req.id}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${cfg.color}`}
                          >
                            {cfg.label}
                            <ChevronDown className="h-3 w-3" />
                          </button>
                          {openStatusId === req.id && (
                            <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-200 shadow-lg min-w-[130px]">
                              {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                                <button
                                  key={key}
                                  onClick={() => updateStatus(req.id, key)}
                                  className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 font-medium"
                                >
                                  {val.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs">
                        {new Date(req.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelected(req)}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                          title="View details"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selected.full_name}</h2>
                <p className="text-sm text-gray-500">{selected.email} · {selected.phone || 'No phone'}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status:</span>
                <div className="flex gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => updateStatus(selected.id, key)}
                      disabled={updatingId === selected.id}
                      className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                        selected.status === key
                          ? val.color + ' border-transparent'
                          : 'border-gray-300 text-gray-500 hover:border-gray-500'
                      }`}
                    >
                      {val.label}
                    </button>
                  ))}
                </div>
              </div>

              <DetailRow label="Submitted" value={new Date(selected.created_at).toLocaleString()} />

              <div className="grid grid-cols-2 gap-4">
                <DetailRow label="Destinations" value={selected.destinations} />
                <DetailRow label="Travel Dates" value={selected.travel_dates || '—'} />
                <DetailRow label="Duration" value={selected.duration || '—'} />
                <DetailRow label="Group Size" value={`${selected.group_size} traveler(s)`} />
                <DetailRow label="Group Type" value={selected.group_type} />
                <DetailRow label="Budget Range" value={selected.budget_range || '—'} />
                <DetailRow label="Accommodation" value={selected.accommodation_preference} />
                <DetailRow label="Transport" value={selected.transport_preference} />
              </div>

              {selected.interests.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.interests.map((i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium">{i}</span>
                    ))}
                  </div>
                </div>
              )}

              {selected.special_requests && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Special Requests / Notes</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 leading-relaxed">{selected.special_requests}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  );
}
