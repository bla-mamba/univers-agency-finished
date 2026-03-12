import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, MapPin, Calendar, Users, DollarSign, Tag, BarChart2, ListChecks } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCompare } from '../contexts/CompareContext';

interface PackageDetail {
  id: string;
  title: string;
  slug: string;
  price: number;
  duration_days: number;
  max_group_size: number;
  images: string[];
  inclusions: string[];
  exclusions: string[];
  description: string;
  destination: { name: string; country: string; slug: string } | null;
  category: { name: string } | null;
}

const FALLBACK_IMG = 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=600';

export default function ComparePage() {
  const { compareList, clearCompare } = useCompare();
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PackageDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (compareList.length < 2) {
      navigate('/packages');
      return;
    }
    loadPackages();
  }, [compareList]);

  const loadPackages = async () => {
    try {
      const ids = compareList.map((p) => p.id);
      const { data, error } = await supabase
        .from('packages')
        .select(`
          id, title, slug, price, duration_days, max_group_size, images, inclusions, exclusions, description,
          destination:destinations(name, country, slug),
          category:categories(name)
        `)
        .in('id', ids);

      if (error) throw error;
      const ordered = ids.map((id) => data?.find((p) => p.id === id)).filter(Boolean) as PackageDetail[];
      setPackages(ordered);
    } catch (err) {
      console.error('Error loading packages:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    );
  }

  const rows = [
    {
      icon: <DollarSign className="h-4 w-4 text-red-500" />,
      label: 'Price',
      render: (pkg: PackageDetail) => (
        <span className="font-bold text-red-600">€{Number(pkg.price).toLocaleString()}</span>
      ),
    },
    {
      icon: <Calendar className="h-4 w-4 text-red-500" />,
      label: 'Duration',
      render: (pkg: PackageDetail) => `${pkg.duration_days} days`,
    },
    {
      icon: <Users className="h-4 w-4 text-red-500" />,
      label: 'Group Size',
      render: (pkg: PackageDetail) => `Max ${pkg.max_group_size}`,
    },
    {
      icon: <MapPin className="h-4 w-4 text-red-500" />,
      label: 'Destination',
      render: (pkg: PackageDetail) =>
        pkg.destination ? `${pkg.destination.name}, ${pkg.destination.country}` : '—',
    },
    {
      icon: <Tag className="h-4 w-4 text-red-500" />,
      label: 'Category',
      render: (pkg: PackageDetail) => pkg.category?.name || '—',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/packages" className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm mb-4 transition">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Packages
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <BarChart2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Compare Packages</h1>
                <p className="text-gray-500 text-sm">Comparing {packages.length} packages side by side</p>
              </div>
            </div>
            <button onClick={clearCompare} className="text-sm text-gray-500 hover:text-red-600 transition font-medium whitespace-nowrap ml-4">
              Clear All
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Package header cards */}
        <div className={`grid gap-4 sm:gap-6 ${packages.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="relative h-44 sm:h-52 overflow-hidden">
                <img
                  src={pkg.images?.[0] || FALLBACK_IMG}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-white font-bold text-base sm:text-lg leading-snug">{pkg.title}</h2>
                </div>
              </div>
              <div className="p-4 sm:p-5 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-red-600">€{Number(pkg.price).toLocaleString()}</p>
                <p className="text-xs text-gray-400">per person</p>
                <Link
                  to={`/packages/${pkg.slug}`}
                  className="mt-4 block w-full bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition"
                >
                  Book This Package
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table layout */}
        <div className="mt-6 sm:mt-8 bg-white rounded-3xl shadow-sm overflow-hidden hidden sm:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 w-44">Feature</th>
                  {packages.map((pkg) => (
                    <th key={pkg.id} className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{pkg.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((row) => (
                  <tr key={row.label} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-500">
                      <span className="flex items-center gap-2">{row.icon} {row.label}</span>
                    </td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="px-6 py-4 text-sm text-gray-700">{row.render(pkg)}</td>
                    ))}
                  </tr>
                ))}

                <tr className="bg-gray-50">
                  <td colSpan={packages.length + 1} className="px-6 py-3">
                    <span className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <ListChecks className="h-4 w-4" /> Inclusions
                    </span>
                  </td>
                </tr>
                <tr className="align-top">
                  <td className="px-6 py-5 text-sm font-medium text-gray-400 italic">What's included</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="px-6 py-5 align-top">
                      {(pkg.inclusions || []).length > 0 ? (
                        <ul className="space-y-2">
                          {pkg.inclusions.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                  ))}
                </tr>

                {packages.some((p) => (p.exclusions || []).length > 0) && (
                  <>
                    <tr className="bg-gray-50">
                      <td colSpan={packages.length + 1} className="px-6 py-3">
                        <span className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          <X className="h-4 w-4" /> Exclusions
                        </span>
                      </td>
                    </tr>
                    <tr className="align-top">
                      <td className="px-6 py-5 text-sm font-medium text-gray-400 italic">Not included</td>
                      {packages.map((pkg) => (
                        <td key={pkg.id} className="px-6 py-5 align-top">
                          {(pkg.exclusions || []).length > 0 ? (
                            <ul className="space-y-2">
                              {pkg.exclusions.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                  <X className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile: stacked per-package breakdown */}
        <div className="mt-6 space-y-6 sm:hidden">
          {packages.map((pkg, idx) => (
            <div key={pkg.id} className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="bg-red-600 px-4 py-3">
                <p className="text-white font-bold text-sm">Package {idx + 1}</p>
                <p className="text-white/90 text-xs mt-0.5">{pkg.title}</p>
              </div>
              <div className="divide-y divide-gray-50">
                {rows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between px-4 py-3">
                    <span className="flex items-center gap-2 text-xs font-medium text-gray-500">
                      {row.icon} {row.label}
                    </span>
                    <span className="text-sm text-gray-800 font-medium text-right">{row.render(pkg)}</span>
                  </div>
                ))}
              </div>

              {(pkg.inclusions || []).length > 0 && (
                <div className="px-4 pb-4">
                  <p className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider py-3 border-t border-gray-50">
                    <ListChecks className="h-4 w-4" /> Inclusions
                  </p>
                  <ul className="space-y-2">
                    {pkg.inclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(pkg.exclusions || []).length > 0 && (
                <div className="px-4 pb-4">
                  <p className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider py-3 border-t border-gray-50">
                    <X className="h-4 w-4" /> Exclusions
                  </p>
                  <ul className="space-y-2">
                    {pkg.exclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <X className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
