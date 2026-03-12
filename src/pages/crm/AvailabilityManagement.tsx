import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Trash2, Search, X, Check, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AvailabilitySlot {
  id: string;
  package_id: string;
  available_date: string;
  total_seats: number;
  booked_seats: number;
  is_blocked: boolean;
  notes: string;
  package: { title: string; slug: string } | null;
}

interface Package {
  id: string;
  title: string;
  slug: string;
  max_group_size: number;
}

export default function AvailabilityManagement() {
  const [searchParams] = useSearchParams();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(searchParams.get('package') || '');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    package_id: '',
    available_date: '',
    total_seats: 10,
    is_blocked: false,
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [bulkModal, setBulkModal] = useState(false);
  const [bulk, setBulk] = useState({ package_id: '', start_date: '', end_date: '', total_seats: 10, exclude_weekends: false });
  const [bulkSaving, setBulkSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [slotsRes, pkgsRes] = await Promise.all([
      supabase.from('package_availability').select('*, package:packages(title, slug)').order('available_date', { ascending: false }).limit(200),
      supabase.from('packages').select('id, title, slug, max_group_size').eq('status', 'published').order('title'),
    ]);
    setSlots(slotsRes.data || []);
    setPackages(pkgsRes.data || []);
    setLoading(false);
  };

  const filtered = selectedPackage
    ? slots.filter((s) => s.package_id === selectedPackage)
    : slots;

  const openCreate = () => {
    setForm({ package_id: selectedPackage || '', available_date: '', total_seats: 10, is_blocked: false, notes: '' });
    setError('');
    setModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.package_id || !form.available_date) { setError('Package and date are required.'); return; }
    setSaving(true);
    setError('');
    try {
      await supabase.from('package_availability').insert({
        package_id: form.package_id,
        available_date: form.available_date,
        total_seats: form.total_seats,
        booked_seats: 0,
        is_blocked: form.is_blocked,
        notes: form.notes.trim(),
      });
      setModal(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to save. Date may already exist for this package.');
    } finally {
      setSaving(false);
    }
  };

  const handleBulkCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulk.package_id || !bulk.start_date || !bulk.end_date) { return; }
    setBulkSaving(true);
    try {
      const start = new Date(bulk.start_date);
      const end = new Date(bulk.end_date);
      const dates: string[] = [];
      const cur = new Date(start);
      while (cur <= end) {
        const day = cur.getDay();
        if (!bulk.exclude_weekends || (day !== 0 && day !== 6)) {
          dates.push(cur.toISOString().split('T')[0]);
        }
        cur.setDate(cur.getDate() + 1);
      }
      if (dates.length === 0) { setBulkSaving(false); return; }
      const rows = dates.map((d) => ({
        package_id: bulk.package_id,
        available_date: d,
        total_seats: bulk.total_seats,
        booked_seats: 0,
        is_blocked: false,
        notes: '',
      }));
      await supabase.from('package_availability').upsert(rows, { onConflict: 'package_id,available_date', ignoreDuplicates: true });
      setBulkModal(false);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setBulkSaving(false);
    }
  };

  const toggleBlock = async (slot: AvailabilitySlot) => {
    await supabase.from('package_availability').update({ is_blocked: !slot.is_blocked }).eq('id', slot.id);
    loadData();
  };

  const deleteSlot = async (id: string) => {
    if (!confirm('Delete this availability slot?')) return;
    await supabase.from('package_availability').delete().eq('id', id);
    loadData();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Availability Calendar</h1>
          <p className="text-gray-500 mt-1">{slots.length} slots total</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setBulkModal(true)}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition text-sm">
            <Calendar className="h-4 w-4" /> Bulk Add
          </button>
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition text-sm">
            <Plus className="h-4 w-4" /> Add Slot
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <select value={selectedPackage} onChange={(e) => setSelectedPackage(e.target.value)}
              className="border border-gray-300  px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="">All packages</option>
              {packages.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 ml-auto">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-400 inline-block"></span>Available</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-400 inline-block"></span>Limited (&le;3)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>Full/Blocked</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Package</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Seats</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Notes</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No availability slots.</td></tr>
              ) : filtered.map((slot) => {
                const seatsLeft = slot.total_seats - slot.booked_seats;
                const isPast = slot.available_date < today;
                return (
                  <tr key={slot.id} className={`hover:bg-gray-50 transition ${isPast ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{slot.package?.title || '—'}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {new Date(slot.available_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${slot.is_blocked || seatsLeft === 0 ? 'bg-red-400' : seatsLeft <= 3 ? 'bg-orange-400' : 'bg-green-400'}`} />
                        <span className="text-sm text-gray-700">{slot.booked_seats}/{slot.total_seats}</span>
                        <span className="text-xs text-gray-400">({seatsLeft} left)</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <button onClick={() => toggleBlock(slot)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition ${slot.is_blocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {slot.is_blocked ? 'Blocked' : 'Open'}
                      </button>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500 max-w-xs truncate">{slot.notes || '—'}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end">
                        <button onClick={() => deleteSlot(slot.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50  transition">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add Availability Slot</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Package *</label>
                <select required value={form.package_id} onChange={(e) => setForm((f) => ({ ...f, package_id: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="">Select package</option>
                  {packages.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date *</label>
                <input type="date" required value={form.available_date} onChange={(e) => setForm((f) => ({ ...f, available_date: e.target.value }))}
                  min={today}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Seats</label>
                <input type="number" min={1} value={form.total_seats} onChange={(e) => setForm((f) => ({ ...f, total_seats: Number(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
                <input type="text" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Optional note..." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_blocked} onChange={(e) => setForm((f) => ({ ...f, is_blocked: e.target.checked }))} className="w-4 h-4 accent-red-600" />
                <span className="text-sm font-medium text-gray-700">Mark as blocked</span>
              </label>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-60 text-sm">
                  <Check className="h-4 w-4" />{saving ? 'Saving...' : 'Add Slot'}
                </button>
                <button type="button" onClick={() => setModal(false)} className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {bulkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Bulk Add Availability</h2>
              <button onClick={() => setBulkModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handleBulkCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Package *</label>
                <select required value={bulk.package_id} onChange={(e) => setBulk((b) => ({ ...b, package_id: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="">Select package</option>
                  {packages.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date *</label>
                  <input type="date" required min={today} value={bulk.start_date} onChange={(e) => setBulk((b) => ({ ...b, start_date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date *</label>
                  <input type="date" required min={bulk.start_date || today} value={bulk.end_date} onChange={(e) => setBulk((b) => ({ ...b, end_date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Seats per day</label>
                <input type="number" min={1} value={bulk.total_seats} onChange={(e) => setBulk((b) => ({ ...b, total_seats: Number(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={bulk.exclude_weekends} onChange={(e) => setBulk((b) => ({ ...b, exclude_weekends: e.target.checked }))} className="w-4 h-4 accent-red-600" />
                <span className="text-sm font-medium text-gray-700">Exclude weekends</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={bulkSaving} className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-60 text-sm">
                  <Check className="h-4 w-4" />{bulkSaving ? 'Creating...' : 'Create Slots'}
                </button>
                <button type="button" onClick={() => setBulkModal(false)} className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
