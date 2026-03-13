import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Car, Hotel, Compass, Bus, Sparkles, Palette, Leaf, Landmark, Music,
  CheckCircle, ChevronDown, ChevronUp, Users, MapPin, Calendar, Clock,
  DollarSign, Plane, Send
} from 'lucide-react';

const SERVICES = [
  { icon: Car, text: 'Private Car and Limousine Transfers' },
  { icon: Hotel, text: 'Hotels and Private Accommodations' },
  { icon: Compass, text: 'Tours and Excursions designed just for you' },
  { icon: Bus, text: 'Bus or Plane Programs' },
  { icon: Sparkles, text: 'Special Interest Tours' },
  { icon: Palette, text: 'Thematic Tours' },
  { icon: Leaf, text: 'Nature Trips (hiking, rafting, bike tours)' },
  { icon: Landmark, text: 'Cultural Day Excursions' },
  { icon: Music, text: 'Concert, Theater and Restaurant Reservations' },
];

const INTERESTS = [
  'Hiking & Trekking', 'Rafting & Water Sports', 'Cycling & Bike Tours',
  'Cultural Heritage', 'Food & Gastronomy', 'History & Archaeology',
  'Wildlife & Nature', 'Photography', 'Religious Sites',
  'Beach & Coastal', 'City Breaks', 'Festivals & Events',
];

const GROUP_TYPES = ['Solo', 'Couple', 'Family', 'Friends Group', 'Corporate'];
const ACCOMMODATION = ['Hotel (3-star)', 'Hotel (4-star)', 'Hotel (5-star)', 'Private Villa/Apartment', 'Boutique/Local', 'Flexible'];
const TRANSPORT = ['Private Car/Transfer', 'Rental Car', 'Bus', 'Plane', 'Mixed/Flexible'];
const BUDGET_RANGES = ['Under €500', '€500 – €1,000', '€1,000 – €2,000', '€2,000 – €5,000', '€5,000+', 'Flexible'];

interface FormData {
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
}

const INITIAL: FormData = {
  full_name: '',
  email: '',
  phone: '',
  destinations: '',
  travel_dates: '',
  duration: '',
  group_size: 2,
  group_type: 'Couple',
  interests: [],
  accommodation_preference: 'Flexible',
  transport_preference: 'Mixed/Flexible',
  budget_range: 'Flexible',
  special_requests: '',
};

export default function PersonalizedTripPage() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState<FormData>({
    ...INITIAL,
    full_name: profile?.full_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleInterest = (interest: string) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : [...f.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.destinations) {
      setError('Please fill in your name, email, and desired destinations.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        destinations: form.destinations,
        travel_dates: form.travel_dates,
        duration: form.duration,
        group_size: form.group_size,
        group_type: form.group_type,
        interests: form.interests,
        accommodation_preference: form.accommodation_preference,
        transport_preference: form.transport_preference,
        budget_range: form.budget_range,
        special_requests: form.special_requests,
        status: 'pending',
      };
      if (user) {
        payload.user_id = user.id;
      }
      const { error: dbError } = await supabase
        .from('personalized_trip_requests')
        .insert(payload);
      if (dbError) throw dbError;
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white max-w-lg w-full p-10 text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Request Received!</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Thank you for reaching out. Our team will review your personalized trip request and contact you shortly to make <span className="font-semibold text-gray-900">YOUR TOUR</span> possible.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ ...INITIAL }); }}
            className="px-8 py-3 bg-gray-900 text-white text-sm font-semibold hover:bg-red-600 transition-colors uppercase tracking-wide"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  const faqs = [
    { q: 'How long does it take to receive a proposal?', a: 'Our team typically responds within 24–48 hours with an initial proposal based on your request.' },
    { q: 'Is there a fee for the personalized planning service?', a: 'The planning consultation is complimentary. You only pay once you confirm the itinerary.' },
    { q: 'Can I modify the itinerary after submission?', a: 'Absolutely. The submitted form is just the starting point — our specialists will work with you to refine every detail.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[480px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Personalized Travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="text-red-400 text-xs font-bold uppercase tracking-[0.3em] mb-4">Univers Travel Agency</span>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
            Personalized Travel
          </h1>
          <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
            Tailored experiences for individuals and groups exploring the Balkans and Europe — designed around your budget, preferences, and style.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-6 leading-tight">
              Your journey,<br />our expertise
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              For individuals or groups who enjoy exploring and traveling in the Balkan and European countries, Univers Travel Agency offers a selection of services and programs personalized according to your budget, preferences and style.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              We strive to create original programs that meet the desires and fit the budgets of our clients, putting imagination, innovation and creativity according to the clients' requests, and aiming to provide as many special details as possible for each program.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our staff is specially trained to provide the best possible services down to the smallest details of the program.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {SERVICES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 hover:border-red-200 hover:bg-red-50 transition-colors group">
                <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-white border border-gray-200 group-hover:border-red-300 group-hover:bg-red-600 transition-colors">
                  <Icon className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-medium text-gray-700">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-20">
          <div className="text-center mb-12">
            <span className="text-red-600 text-xs font-bold uppercase tracking-[0.25em] mb-3 block">Personalized Request</span>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Tell Us About Your Dream Trip</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Fill out the form below in as much detail as possible. Our team will contact you to make <strong className="text-gray-800">YOUR TOUR</strong> possible.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="p-8 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-6">
                  <Users className="h-4 w-4 text-red-600" />
                  Contact Information
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={form.full_name}
                      onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                      placeholder="Your full name"
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="+355 ..."
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-6">
                  <MapPin className="h-4 w-4 text-red-600" />
                  Destination & Travel Details
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Desired Destinations / Countries <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={form.destinations}
                      onChange={(e) => setForm((f) => ({ ...f, destinations: e.target.value }))}
                      placeholder="e.g. Albania, Montenegro, Croatia..."
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Preferred Travel Dates</span>
                      </label>
                      <input
                        type="text"
                        value={form.travel_dates}
                        onChange={(e) => setForm((f) => ({ ...f, travel_dates: e.target.value }))}
                        placeholder="e.g. July 2025, flexible in summer..."
                        className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Trip Duration</span>
                      </label>
                      <input
                        type="text"
                        value={form.duration}
                        onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                        placeholder="e.g. 7 days, 2 weeks..."
                        className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-6">
                  <Users className="h-4 w-4 text-red-600" />
                  Group Information
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Number of Travelers</label>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      value={form.group_size}
                      onChange={(e) => setForm((f) => ({ ...f, group_size: Number(e.target.value) }))}
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Group Type</label>
                    <select
                      value={form.group_type}
                      onChange={(e) => setForm((f) => ({ ...f, group_type: e.target.value }))}
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-colors bg-white"
                    >
                      {GROUP_TYPES.map((g) => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-8 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-6">
                  <Sparkles className="h-4 w-4 text-red-600" />
                  Interests & Activities
                </h3>
                <p className="text-xs text-gray-500 mb-4">Select all that apply</p>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => {
                    const active = form.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2 text-xs font-semibold border transition-colors uppercase tracking-wide ${
                          active
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-8 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-6">
                  <Plane className="h-4 w-4 text-red-600" />
                  Preferences
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Accommodation</label>
                    <select
                      value={form.accommodation_preference}
                      onChange={(e) => setForm((f) => ({ ...f, accommodation_preference: e.target.value }))}
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-colors bg-white"
                    >
                      {ACCOMMODATION.map((a) => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Transport</label>
                    <select
                      value={form.transport_preference}
                      onChange={(e) => setForm((f) => ({ ...f, transport_preference: e.target.value }))}
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-colors bg-white"
                    >
                      {TRANSPORT.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                      <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" />Budget Range (per person)</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {BUDGET_RANGES.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, budget_range: b }))}
                          className={`px-3 py-2.5 text-xs font-semibold border transition-colors ${
                            form.budget_range === b
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-gray-600'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-6">
                  <Compass className="h-4 w-4 text-red-600" />
                  Special Requests & Notes
                </h3>
                <textarea
                  value={form.special_requests}
                  onChange={(e) => setForm((f) => ({ ...f, special_requests: e.target.value }))}
                  rows={5}
                  placeholder="Tell us anything else that would help us create the perfect itinerary for you — dietary needs, accessibility requirements, specific must-see places, occasion celebrations, etc."
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-colors resize-none"
                />
              </div>

              <div className="p-8">
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-gray-900 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold text-sm uppercase tracking-widest transition-colors"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send My Request
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">
                  Our team will contact you within 24–48 hours to discuss your personalized itinerary.
                </p>
              </div>
            </div>
          </form>
        </div>

        <div className="max-w-3xl mx-auto mt-20">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h3>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 bg-white">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                  {expandedFaq === i ? <ChevronUp className="h-4 w-4 text-gray-500 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />}
                </button>
                {expandedFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
