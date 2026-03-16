import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Star,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  BarChart2,
  ChevronRight,
  Phone,
  ChevronLeft,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCompare } from '../contexts/CompareContext';
import { useHeroMedia } from '../hooks/useHeroMedia';
import { useCategories, resolveIcon, Category } from '../contexts/CategoriesContext';

interface Package {
  id: string;
  title: string;
  slug: string;
  price: number;
  original_price: number | null;
  duration_days: number;
  images: string[];
  video_url: string | null;
  destination: { id: string; name: string; country: string } | null;
  category: { id: string; name: string } | null;
}

interface Destination {
  id: string;
  name: string;
  country: string;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Më të rejat' },
  { value: 'price_asc', label: 'Çmimi: nga më i ulëti' },
  { value: 'price_desc', label: 'Çmimi: nga më i larti' },
  { value: 'duration_asc', label: 'Kohëzgjatja: më e shkurtra' },
  { value: 'duration_desc', label: 'Kohëzgjatja: më e gjata' },
];

function CategoryTabs({
  categories,
  activeCategoryObj,
  onClear,
  onSelect,
}: {
  categories: Category[];
  activeCategoryObj: Category | null;
  onClear: () => void;
  onSelect: (cat: Category) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, categories]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'left' ? -200 : 200,
      behavior: 'smooth',
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 relative">
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 flex items-center justify-center w-12 bg-gradient-to-r from-white via-white to-transparent"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-center w-12 bg-gradient-to-l from-white via-white to-transparent"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="max-w-7xl mx-auto px-10 lg:px-14 flex items-center gap-1 py-1 overflow-x-auto scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <button
          onClick={onClear}
          className={`px-6 py-4 text-sm font-semibold uppercase tracking-wider transition whitespace-nowrap flex-shrink-0 ${
            !activeCategoryObj
              ? 'bg-gray-900 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Të gjitha
        </button>

        {categories.map((cat) => {
          const Icon = resolveIcon(cat.icon);
          const isActive = activeCategoryObj?.id === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold uppercase tracking-wider transition whitespace-nowrap flex-shrink-0 ${
                isActive
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PackageCard({
  pkg,
  inCompare,
  canAdd,
  onAddToCompare,
  onRemoveFromCompare,
}: {
  pkg: Package;
  inCompare: boolean;
  canAdd: boolean;
  onAddToCompare: () => void;
  onRemoveFromCompare: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="bg-white group flex flex-col"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/packages/${pkg.slug}`} className="block">
        <div className="relative h-56 overflow-hidden">
          {pkg.video_url ? (
            <video
              ref={videoRef}
              src={pkg.video_url}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={
                pkg.images?.[0] ||
                'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800'
              }
              alt={pkg.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
            <div className="flex items-center gap-1.5 text-white/80 text-xs font-medium">
              <MapPin className="h-3 w-3" />
              {pkg.destination?.name || 'Destinacion'}, {pkg.destination?.country || ''}
            </div>

            <div className="bg-white text-gray-900 px-2.5 py-1.5 text-xs font-bold tracking-wide">
              {pkg.original_price != null ? (
                <div className="flex flex-col items-end leading-tight">
                  <span className="line-through text-gray-400 font-normal text-[10px]">
                    €{pkg.original_price.toLocaleString()}
                  </span>
                  <span className="text-red-600">€{pkg.price.toLocaleString()}</span>
                </div>
              ) : (
                <span>nga €{pkg.price.toLocaleString()}</span>
              )}
            </div>
          </div>

          {pkg.category && (
            <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-sm text-white/90 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider">
              {pkg.category.name}
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-base font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors leading-snug">
            {pkg.title}
          </h3>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              <span>{pkg.duration_days} ditë</span>
            </div>

            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
              <span className="font-semibold text-gray-700">4.8</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5 mt-auto flex gap-2">
        <Link
          to={`/packages/${pkg.slug}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gray-900 hover:bg-red-600 text-white text-xs font-semibold transition-colors uppercase tracking-wide"
        >
          Shiko detajet <ChevronRight className="h-3.5 w-3.5" />
        </Link>

        <button
          onClick={() => {
            if (inCompare) onRemoveFromCompare();
            else if (!canAdd) onAddToCompare();
          }}
          disabled={canAdd}
          title={
            inCompare
              ? 'Hiq nga krahasimi'
              : canAdd
              ? 'Lista e krahasimit është plot'
              : 'Shto në krahasim'
          }
          className={`flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition border ${
            inCompare
              ? 'bg-gray-900 border-gray-900 text-white'
              : canAdd
              ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
              : 'bg-white border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900'
          }`}
        >
          <BarChart2 className="h-3.5 w-3.5" />
          {inCompare ? 'Në krahasim' : 'Krahaso'}
        </button>
      </div>
    </div>
  );
}

export default function PackagesPage() {
  const hero = useHeroMedia('packages', {
    media_type: 'image',
    url: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1920',
    overlay_opacity: 0.6,
  });

  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompare();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState<Package[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('q') || '');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [durationMin, setDurationMin] = useState('');
  const [durationMax, setDurationMax] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const categorySlugParam = searchParams.get('category') || '';

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (categorySlugParam === 'personalized-trip') {
      navigate('/personalized-trip');
      return;
    }

    if (categorySlugParam && categories.length > 0) {
      const match = categories.find((c) => c.slug === categorySlugParam);
      if (match) setSelectedCategory(match.id);
    } else if (!categorySlugParam) {
      setSelectedCategory('');
    }
  }, [categorySlugParam, categories, navigate]);

  const loadData = async () => {
    try {
      const [pkgsRes, destsRes] = await Promise.all([
        supabase
          .from('packages')
          .select(`*, destination:destinations(id, name, country), category:categories(id, name, slug)`)
          .eq('status', 'published')
          .order('created_at', { ascending: false }),
        supabase.from('destinations').select('id, name, country').order('name'),
      ]);

      setPackages(pkgsRes.data || []);
      setDestinations(destsRes.data || []);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let result = packages.filter((pkg) => {
      const matchesSearch =
        !searchTerm ||
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destination?.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDest = !selectedDestination || pkg.destination?.id === selectedDestination;
      const matchesCat = !selectedCategory || pkg.category?.id === selectedCategory;
      const matchesPriceMin = !priceMin || pkg.price >= Number(priceMin);
      const matchesPriceMax = !priceMax || pkg.price <= Number(priceMax);
      const matchesDurMin = !durationMin || pkg.duration_days >= Number(durationMin);
      const matchesDurMax = !durationMax || pkg.duration_days <= Number(durationMax);

      return (
        matchesSearch &&
        matchesDest &&
        matchesCat &&
        matchesPriceMin &&
        matchesPriceMax &&
        matchesDurMin &&
        matchesDurMax
      );
    });

    switch (sortBy) {
      case 'price_asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'duration_asc':
        result = [...result].sort((a, b) => a.duration_days - b.duration_days);
        break;
      case 'duration_desc':
        result = [...result].sort((a, b) => b.duration_days - a.duration_days);
        break;
      default:
        break;
    }

    return result;
  }, [
    packages,
    searchTerm,
    selectedDestination,
    selectedCategory,
    priceMin,
    priceMax,
    durationMin,
    durationMax,
    sortBy,
  ]);

  const activeFilterCount = [
    selectedDestination,
    selectedCategory,
    priceMin,
    priceMax,
    durationMin,
    durationMax,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedDestination('');
    setSelectedCategory('');
    setPriceMin('');
    setPriceMax('');
    setDurationMin('');
    setDurationMax('');
    setSearchTerm('');
    setSortBy('newest');
    setSearchParams({});
  };

  const activeCategoryObj = selectedCategory
    ? categories.find((c) => c.id === selectedCategory) || null
    : null;

  return (
    <div className="min-h-screen bg-[#f5f4f2]">
      {/* HERO */}
      <div className="relative h-[420px] overflow-hidden">
        {hero.media_type === 'video' ? (
          <video
            src={hero.url}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${hero.url})` }}
          />
        )}

        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0,0,0,${hero.overlay_opacity})` }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 h-full flex flex-col justify-end pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400 mb-4">
            Portofoli ynë
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
            Paketa udhëtimi
          </h1>
          <p className="text-white/70 max-w-xl leading-relaxed text-base font-light">
            Itinerare të përgatitura me kujdes në Ballkan, Mesdhe dhe më gjerë — secila e
            verifikuar, e koordinuar dhe e mbështetur nga fillimi deri në fund.
          </p>
        </div>
      </div>

      {/* CATEGORY FILTER TABS */}
      <CategoryTabs
        categories={categories}
        activeCategoryObj={activeCategoryObj}
        onClear={clearFilters}
        onSelect={(cat) => {
          if (cat.slug === 'personalized-trip') {
            navigate('/personalized-trip');
            return;
          }
          setSelectedCategory(cat.id);
          setSearchParams({ category: cat.slug });
        }}
      />

      {/* SEARCH + FILTERS */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Kërkoni sipas destinacionit ose emrit të paketës..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 bg-white text-sm text-gray-900 placeholder-gray-400 transition-colors"
            />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 bg-white text-gray-700 text-sm font-medium cursor-pointer transition-colors"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 border font-medium text-sm transition ${
              showFilters || activeFilterCount > 0
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtrat
            {activeFilterCount > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="bg-white border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                  Filtro rezultatet
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Ngushtoni përzgjedhjen sipas destinacionit, kategorisë, çmimit ose
                  kohëzgjatjes.
                </p>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition font-medium"
                >
                  <X className="h-3.5 w-3.5" /> Pastro të gjitha
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Destinacioni
                </label>
                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 bg-white text-gray-900 transition-colors"
                >
                  <option value="">Të gjitha destinacionet</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}, {d.country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Kategoria
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 bg-white text-gray-900 transition-colors"
                >
                  <option value="">Të gjitha kategoritë</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Gama e çmimit (EUR)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    min="0"
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 bg-white transition-colors"
                  />
                  <span className="text-gray-300 text-sm flex-shrink-0">–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    min="0"
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Kohëzgjatja (ditë)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={durationMin}
                    onChange={(e) => setDurationMin(e.target.value)}
                    min="1"
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 bg-white transition-colors"
                  />
                  <span className="text-gray-300 text-sm flex-shrink-0">–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={durationMax}
                    onChange={(e) => setDurationMax(e.target.value)}
                    min="1"
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 bg-white transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS META */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{filtered.length}</span> paketë
            {activeCategoryObj ? (
              <>
                {' '}
                në <span className="font-semibold text-gray-900">{activeCategoryObj.name}</span>
              </>
            ) : activeFilterCount > 0 || searchTerm ? (
              ' që përputhen me kriteret tuaja'
            ) : (
              ' në portofolin tonë'
            )}
          </p>

          {(activeFilterCount > 0 || searchTerm) && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700 transition flex items-center gap-1 font-medium"
            >
              <X className="h-3.5 w-3.5" /> Pastro filtrat
            </button>
          )}
        </div>

        {/* PACKAGE GRID */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin h-8 w-8 border-2 border-gray-300 border-t-gray-900" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
            {filtered.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                inCompare={isInCompare(pkg.id)}
                canAdd={!isInCompare(pkg.id) && compareList.length >= 3}
                onAddToCompare={() =>
                  addToCompare({
                    id: pkg.id,
                    title: pkg.title,
                    slug: pkg.slug,
                    price: pkg.price,
                    duration_days: pkg.duration_days,
                    images: pkg.images,
                    destination: pkg.destination,
                  })
                }
                onRemoveFromCompare={() => removeFromCompare(pkg.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-gray-200">
            <SlidersHorizontal className="h-8 w-8 mx-auto mb-4 text-gray-300" />
            <p className="text-base font-semibold text-gray-700 mb-1">
              Nuk u gjet asnjë paketë me këto kritere
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Provoni të ndryshoni kërkimin ose të hiqni disa filtra.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 text-sm font-semibold hover:bg-red-600 transition uppercase tracking-wide"
            >
              Pastro të gjithë filtrat
            </button>
          </div>
        )}
      </div>

      {/* EDITORIAL NOTE */}
      {!loading && filtered.length > 0 && (
        <div className="bg-white border-t border-gray-200 py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-600 mb-4">
                  Si i ndërtojmë paketat
                </p>
                <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                  Çdo program ndërtohet me kujdes,
                  <br />
                  nuk bashkohet rastësisht.
                </h2>
                <p className="text-gray-500 leading-relaxed mb-4 text-sm">
                  Çdo paketë në portofolin tonë është rezultat i kërkimit të drejtpërdrejtë në
                  terren, negociatave me furnizuesit dhe testimit operacional. Nuk listojmë
                  paketa të marra nga agjentë të tretë. Çdo destinacion, akomodim dhe zgjidhje
                  logjistike vlerësohet personalisht nga ekipi ynë.
                </p>
                <p className="text-gray-500 leading-relaxed mb-8 text-sm">
                  Çmimet pasqyrojnë tarifa të kontraktuara përmes partneriteteve afatgjata — jo
                  luhatje të rastësishme tregu. Ajo që shihni është ajo që paguani, me
                  transparencë të plotë mbi atë që përfshihet dhe atë që nuk përfshihet.
                </p>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-red-600 transition uppercase tracking-wide border-b border-gray-900 hover:border-red-600 pb-0.5"
                >
                  Mësoni më shumë për qasjen tonë <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-0 border border-gray-200">
                {[
                  {
                    label: 'Çmim i qartë dhe gjithëpërfshirës',
                    desc: 'Nuk ka shtesa të fshehura, as gjatë pagesës dhe as pas mbërritjes.',
                  },
                  {
                    label: 'Logjistikë e konfirmuar paraprakisht',
                    desc: 'Transporti, akomodimi dhe guidat konfirmohen përpara nisjes.',
                  },
                  {
                    label: 'Mundësi përshtatjeje',
                    desc: 'Shumica e programeve mund të përshtaten sipas grupit ose kalendarit tuaj.',
                  },
                  {
                    label: 'Kontakt gjatë gjithë udhëtimit',
                    desc: 'Një numër i drejtpërdrejtë është i disponueshëm gjatë gjithë programit tuaj.',
                  },
                ].map((item, i, arr) => (
                  <div
                    key={item.label}
                    className={`flex items-start gap-5 p-6 ${
                      i < arr.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                  >
                    <div className="w-8 h-px bg-red-600 mt-2.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-1">{item.label}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL-WIDTH IMAGE BREAK */}
      {!loading && filtered.length > 0 && (
        <div
          className="relative h-72 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400 mb-3">
                Që nga viti 2009
              </p>
              <p className="text-2xl md:text-3xl font-bold text-white leading-tight">
                Mijëra udhëtarë na kanë besuar planifikimin e udhëtimeve të tyre. Ne e marrim
                këtë përgjegjësi seriozisht.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTA STRIP */}
      <div className="bg-gray-900 py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400 mb-3">
              Itinerare të personalizuara
            </p>
            <h3 className="text-3xl font-bold text-white leading-tight tracking-tight mb-2">
              Nuk po gjeni atë që kërkoni?
            </h3>
            <p className="text-white/40 text-sm max-w-md">
              Specialistët tanë përgatisin programe plotësisht të personalizuara për individë,
              familje dhe grupe korporative.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href="tel:+355684030204"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white px-6 py-3 font-semibold text-sm transition uppercase tracking-wide"
            >
              <Phone className="h-4 w-4" />
              Telefononi një specialist
            </a>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-semibold text-sm transition uppercase tracking-wide"
            >
              Kërkoni një program të personalizuar <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}