import { useState, useEffect, useRef} from'react';
import { Link, useNavigate} from'react-router-dom';
import { Search, MapPin, Calendar, Users, Star, DollarSign, Leaf, Award, Shield, Clock, TrendingUp, Globe, ChevronRight, Phone, Mail, Quote, CheckCircle, AlertTriangle, Plane, Hotel, Headphones as HeadphonesIcon, FileCheck} from'lucide-react';
import { supabase} from'../lib/supabase';
import { useHeroMedia} from'../hooks/useHeroMedia';

interface Package {
 id: string;
 title: string;
 slug: string;
 price: number;
 original_price: number | null;
 duration_days: number;
 images: string[];
 video_url: string | null;
 featured: boolean;
 destination: {
 name: string;
 country: string;
} | null;
}

interface SearchSuggestion {
 type:'destination' |'package';
 id: string;
 label: string;
 sublabel: string;
 slug: string;
 destinationId?: string;
}

const STATS = [
 { value:'15+', label:'Vjet në Treg', icon: Clock},
 { value:'12,000+', label:'Udhëtarë të Shërbyer', icon: Users},
 { value:'60+', label:'Destinacione', icon: Globe},
 { value:'98%', label:'Klientë të Kënaqur', icon: TrendingUp},
];

const PROCESS_STEPS = [
 {
 step:'01',
 title:'Na Tregoni Çfarë Doni',
 desc:'Fillojmë me një bisedë të thjeshtë — ku doni të shkoni, kur, dhe sa jeni. Nuk keni nevojë të keni gjithçka gati; e ndërtojmë bashkë.',
},
 {
 step:'02',
 title:'Marrim një Plan për Ju',
 desc:'Ju dërgojmë një propozim konkret me hotele, transport dhe program ditor — të ndërtuar rreth jush, jo kopje e ndonjë shablloni standard.',
},
 {
 step:'03',
 title:'Ne Kujdesemi për Gjithçka',
 desc:'Fluturimet, hotelet, transferet, guidat — i koordinojmë ne. Ju merrni konfirmimin e plotë me shkrim dhe nuk keni nevojë të nxitoni pas askujt.',
},
 {
 step:'04',
 title:'Jemi Aty Gjatë Udhëtimit',
 desc:'Nëse ndodh ndonjë gjë në rrugë, keni dikë real në telefon që e njeh rezervimin tuaj. Jo një qendër thirrjesh — personi juaj i kontaktit.',
},
];

const EXPERTISE_REGIONS = [
 {
 region:'Ballkani',
 countries:'Shqipëri · Mal i Zi · Maqedonia e Veriut · Kosovë · Bosnjë',
 description:'Kjo është zona ku njohim çdo rrugë. Kemi autobusat tanë, i kemi vizituar vetë hotelet dhe kemi kontakte direkte me partnerë lokalë në të gjithë rajonin.',
 image:'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1200',
},
 {
 region:'Mesdhe',
 countries:'Greqi · Kroaci · Itali · Turqi · Maltë',
 description:'Partnerë lokalë me përvojë në Kroaci, Greqi dhe Itali. Akomodim i verifikuar, çmime të qarta dhe dikë që mund ta thërrasim nëse lind ndonjë problem.',
 image:'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1200',
},
 {
 region:'Botëror',
 countries:'Azi · Amerikë · Afrikë · Lindja e Mesme',
 description:'Akreditim të plotë IATA për bileta ndërkombëtare dhe agjenci partnere në çdo kontinent. E njëjta kujdes dhe transparencë, pavarësisht sa larg shkoni.',
 image:'https://images.pexels.com/photos/2108845/pexels-photo-2108845.jpeg?auto=compress&cs=tinysrgb&w=1200',
},
];

const TESTIMONIALS = [
 {
 name:'Arben Hoxha',
 role:'CEO, Hoxha Consulting Group',
 text:'Shkuam 45 persona në Mal të Zi dhe Shqipëri për një ngjarje kompanie. Autobusat ishin në kohë, hotelet ishin saktësisht si u premtuan, dhe gjatë gjithë udhëtimit nuk pati asnjë problem. Organizim i jashtëzakonshëm.',
 rating: 5,
},
 {
 name:'Mirela Basha',
 role:'Muaj Mjalti, Mesdhe',
 text:'Hotelet ishin fantastike dhe guidat i dinin gjërat. Kur trageti vonoi, Univers e zgjidhi situatën para se ne të kishim mundësi të shqetësoheshim. Ndihesh mirë kur ke dikë që kujdeset vërtet.',
 rating: 5,
},
 {
 name:'Dritan Kola',
 role:'Drejtor, Kryqi i Kuq Shqiptar',
 text:'Punojmë me Univers prej katër vjetësh. Çmimet janë të qarta, njohin rajonin mirë, dhe nuk "zhduken" pas konfirmimit të rezervimit. Kjo besueshmëri ka vlerë kur menaxhon udhëtime për organizata.',
 rating: 5,
},
];

const TRAVEL_TIPS = [
 {
 icon: FileCheck,
 title:'Pasaporta — Kontrolloje Tani',
 desc:'Shumë vende refuzojnë hyrjen nëse pasaporta skadon brenda 6 muajve nga data e kthimit. Rinovimet vonojnë. Mos e lini për minutën e fundit — i ka kushtuar shtrenjtë shumëve.',
 tag:'Dokumenta',
},
 {
 icon: AlertTriangle,
 title:'Sigurimi i Udhëtimit — Merrete Gjithmonë',
 desc:'Një evakuim mjekësor nga Shqipëria e largët mund të kushtojë 15,000€+. Sigurimi për të njëjtin trip kushton rreth 50€. E rekomandojmë dhe e përfshijmë në çdo itinerar.',
 tag:'Siguri',
},
 {
 icon: Plane,
 title:'Vera Mbushet Shpejt',
 desc:'Korriku e gushti në bregdetin shqiptar dhe malazez rezervohen shumë herët. Hotelet e mira janë gati plotësisht të zëna nga marsi e tutje. Planifikoni para majit.',
 tag:'Planifikim',
},
 {
 icon: Hotel,
 title:'Katër Yje — Nuk Janë Kudo Njëlloj',
 desc:'Një hotel me 4 yje në Ballkan mund të ndryshojë shumë nga njëri në Europën Perëndimore. Ne i vizitojmë hotelet që përfshijmë, ndaj ajo që premtojmë — atë merrni.',
 tag:'Akomodim',
},
];

const COMMITMENTS = [
 {
 icon: Shield,
 title:'Akreditim IATA',
 desc:'Lëshojmë bileta ajrore drejtpërdrejt si agjenci e akredituar IATA. Kjo do të thotë mbrojtje e plotë për klientin sipas standardeve ndërkombëtare të aviacionit.',
},
 {
 icon: Award,
 title:'Çertifikim TravelLife',
 desc:'TravelLife është çertifikim i pavarur dhe i audituar çdo vit për qëndrueshmëri. Nuk e vetëdeklarojmë — e provojmë.',
},
 {
 icon: DollarSign,
 title:'Pa Surpriza në Çmim',
 desc:'Çmimi që kuotojmë është çmimi që faturojmë. Çdo kosto specifikohet me shkrim para se të angazhoheni. Zero tarifa të fshehura pas konfirmimit.',
},
 {
 icon: Leaf,
 title:'Turizëm me Përgjegjësi',
 desc:'Preferojmë transport tokësor, partnerë lokalë dhe operatorë që kujdesen për mjedisin. Nuk është marketing — është mënyra jonë e punës.',
},
];

function HomePkgCard({ pkg}: { pkg: Package}) {
 const videoRef = useRef<HTMLVideoElement>(null);

 return (
 <Link
 to={`/packages/${pkg.slug}`}
 className="bg-white group block overflow-hidden"
 onMouseEnter={() => videoRef.current?.play()}
 onMouseLeave={() => {
 if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0;}
}}
 >
 <div className="relative h-64 overflow-hidden">
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
 src={pkg.images?.[0] ||'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800'}
 alt={pkg.title}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
 />
 )}
 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
 <div className="absolute bottom-4 left-4">
 <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium uppercase tracking-wider">
 <MapPin className="h-3 w-3" />
 {pkg.destination?.name ||'Unknown'}, {pkg.destination?.country ||''}
 </div>
 </div>
 <div className="absolute top-4 right-4 bg-gray-950/90 text-white px-3 py-1.5 text-xs font-bold tracking-wider">
 {pkg.original_price != null ? (
 <div className="flex flex-col items-end leading-tight">
 <span className="line-through text-white/50 font-normal text-[10px] normal-case">€{pkg.original_price.toLocaleString()}</span>
 <span className="uppercase">€{pkg.price.toLocaleString()}</span>
 </div>
 ) : (
 <span className="uppercase">nga €{pkg.price.toLocaleString()}</span>
 )}
 </div>
 </div>
 <div className="p-6 border-b border-l border-r border-gray-100 group-hover:border-red-100 transition-colors">
 <h3 className="text-base font-bold text-gray-950 mb-4 group-hover:text-red-600 transition-colors leading-snug">
 {pkg.title}
 </h3>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase tracking-wider">
 <Calendar className="h-3.5 w-3.5" />
 {pkg.duration_days} ditë
 </div>
 <div className="flex items-center gap-1 text-xs">
 {[...Array(5)].map((_, i) => (
 <Star key={i} className="h-3 w-3 text-amber-400 fill-current" />
 ))}
 </div>
 </div>
 </div>
 </Link>
 );
}

export default function HomePage() {
 const hero = useHeroMedia('home', {
 media_type:'video',
 url:'/trip.mp4',
 overlay_opacity: 0.6,
});
 const navigate = useNavigate();
 const [featuredPackages, setFeaturedPackages] = useState<Package[]>([]);
 const [loading, setLoading] = useState(true);

 const [searchQuery, setSearchQuery] = useState('');
 const [searchDate, setSearchDate] = useState('');
 const [searchTravelers, setSearchTravelers] = useState('');
 const [showTravelersDropdown, setShowTravelersDropdown] = useState(false);
 const travelersRef = useRef<HTMLDivElement>(null);
 const [showDateDropdown, setShowDateDropdown] = useState(false);
 const dateRef = useRef<HTMLDivElement>(null);
 const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
 const [showSuggestions, setShowSuggestions] = useState(false);
 const [allDestinations, setAllDestinations] = useState<{ id: string; name: string; country: string; slug: string}[]>([]);
 const [allPackages, setAllPackages] = useState<{ id: string; title: string; slug: string; destination: { name: string; country: string} | null}[]>([]);
 const searchRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 loadFeaturedPackages();
 loadSearchData();
}, []);

 useEffect(() => {
 const handler = (e: MouseEvent) => {
 if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
 setShowSuggestions(false);
}
 if (travelersRef.current && !travelersRef.current.contains(e.target as Node)) {
 setShowTravelersDropdown(false);
}
 if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
 setShowDateDropdown(false);
}
};
 document.addEventListener('mousedown', handler);
 return () => document.removeEventListener('mousedown', handler);
}, []);

 useEffect(() => {
 const q = searchQuery.trim().toLowerCase();
 if (!q) { setSuggestions([]); return;}
 const destMatches: SearchSuggestion[] = allDestinations
 .filter((d) => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q))
 .slice(0, 4)
 .map((d) => ({ type:'destination', id: d.id, label: d.name, sublabel: d.country, slug: d.slug}));
 const pkgMatches: SearchSuggestion[] = allPackages
 .filter((p) =>
 p.title.toLowerCase().includes(q) ||
 p.destination?.name.toLowerCase().includes(q) ||
 p.destination?.country.toLowerCase().includes(q)
 )
 .slice(0, 5)
 .map((p) => ({ type:'package', id: p.id, label: p.title, sublabel: p.destination ?`${p.destination.name}, ${p.destination.country}` :'', slug: p.slug}));
 setSuggestions([...destMatches, ...pkgMatches]);
}, [searchQuery, allDestinations, allPackages]);

 const loadSearchData = async () => {
 const [destsRes, pkgsRes] = await Promise.all([
 supabase.from('destinations').select('id, name, country, slug').order('name'),
 supabase.from('packages').select('id, title, slug, destination:destinations(name, country)').eq('status','published'),
 ]);
 setAllDestinations(destsRes.data || []);
 setAllPackages(pkgsRes.data || []);
};

 const handleSearch = (e?: React.FormEvent) => {
 e?.preventDefault();
 const params = new URLSearchParams();
 if (searchQuery.trim()) params.set('q', searchQuery.trim());
 if (searchDate) params.set('date', searchDate);
 if (searchTravelers) params.set('travelers', searchTravelers);
 navigate(`/packages?${params.toString()}`);
};

 const handleSuggestionClick = (s: SearchSuggestion) => {
 setSearchQuery(s.label);
 setShowSuggestions(false);
};

 const loadFeaturedPackages = async () => {
 try {
 const { data, error} = await supabase
 .from('packages')
 .select(`id, title, slug, price, duration_days, images, video_url, featured, destination:destinations(name, country)`)
 .eq('status','published')
 .eq('featured', true)
 .limit(6);
 if (error) throw error;
 setFeaturedPackages(data || []);
} catch (error) {
 console.error('Error loading packages:', error);
} finally {
 setLoading(false);
}
};

 return (
 <div className="min-h-screen bg-white">

 {/* HERO */}
 <section className="relative h-screen min-h-[680px] max-h-[900px]">
 <div className="absolute inset-0 overflow-hidden">
 {hero.media_type ==='video' ? (
 <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
 <source src={hero.url} type="video/mp4" />
 </video>
 ) : (
 <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage:`url(${hero.url})`}} />
 )}
 </div>
 <div className="absolute inset-0" style={{ backgroundColor:`rgba(0,0,0,${hero.overlay_opacity})`}} />
 <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />
 <div className="relative h-full flex flex-col justify-center pb-0">
 <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full pb-14">
 <div className="mb-10">
 <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400 mb-5">
 Tiranë, Shqipëri — Est. 2009
 </p>
<h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.0] tracking-tight mb-6 max-w-4xl">
  Udhëtoni pa stres.<br />Për pjesën tjetër kujdesemi ne.
</h1>
<p className="text-lg text-white/65 font-light max-w-2xl leading-relaxed">
  Për familje, çifte dhe grupe – organizojmë udhëtime në Ballkan, Mesdhe dhe destinacione në të gjithë botën.
</p>
 </div>

 <form onSubmit={handleSearch} className="bg-white/[0.06] backdrop-blur-md border border-white/15 p-1 w-full max-w-4xl">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
 <div className="relative col-span-2 md:col-span-1 border-r border-white/15" ref={searchRef}>
 <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none z-10" />
 <input
 type="text"
 placeholder="Ku doni të udhëtoni?"
 value={searchQuery}
 onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true);}}
 onFocus={() => setShowSuggestions(true)}
 className="w-full pl-11 pr-4 py-4 bg-transparent text-white placeholder-white/40 text-sm focus:outline-none"
 />
 {showSuggestions && suggestions.length > 0 && (
 <div className="absolute left-0 right-0 bottom-full mb-1 bg-white border border-gray-200 shadow-2xl z-[9999] overflow-hidden" style={{ minWidth:'100%'}}>
 {suggestions.slice(0, 4).map((s) => (
 <button
 key={`${s.type}-${s.id}`}
 type="button"
 onClick={() => handleSuggestionClick(s)}
 className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left border-b border-gray-50 last:border-0"
 >
 <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center ${s.type ==='destination' ?'bg-red-50' :'bg-gray-50'}`}>
 {s.type ==='destination'
 ? <MapPin className="h-3.5 w-3.5 text-red-600" />
 : <Search className="h-3.5 w-3.5 text-gray-500" />
}
 </span>
 <span>
 <span className="block text-sm font-semibold text-gray-900">{s.label}</span>
 <span className="block text-xs text-gray-400">{s.sublabel}</span>
 </span>
 </button>
 ))}
 </div>
 )}
 </div>

 <div className="relative col-span-1 border-r border-white/15" ref={dateRef}>
 <button
 type="button"
 onClick={() => setShowDateDropdown(v => !v)}
 className="w-full flex items-center gap-2 pl-11 pr-4 py-4 bg-transparent text-sm text-left focus:outline-none"
 >
 <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
 <span className={searchDate ?'text-white' :'text-white/40'}>
 {searchDate ? new Date(searchDate +'T00:00:00').toLocaleDateString('sq-AL', { day:'2-digit', month:'short', year:'numeric'}) :'Nisja'}
 </span>
 <svg className={`ml-auto h-4 w-4 text-white/40 transition-transform duration-200 ${showDateDropdown ?'rotate-180' :''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
 </button>
 {showDateDropdown && (
 <div className="absolute left-0 bottom-full mb-1 bg-white border border-gray-200 shadow-2xl z-[9999] overflow-hidden" style={{ minWidth:'260px'}}>
 <div className="px-4 pt-3 pb-2 border-b border-gray-100">
 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Zgjidhni Datën</p>
 </div>
 <div className="p-3">
 <input
 type="date"
 value={searchDate}
 min={new Date().toISOString().split('T')[0]}
 onChange={(e) => { setSearchDate(e.target.value); setShowDateDropdown(false);}}
 className="w-full border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-red-500"
 />
 </div>
 {searchDate && (
 <div className="px-4 py-2 border-t border-gray-100">
 <button type="button" onClick={() => { setSearchDate(''); setShowDateDropdown(false);}} className="text-xs text-gray-400 hover:text-red-500 transition">Fshi datën</button>
 </div>
 )}
 </div>
 )}
 </div>

 <div className="relative col-span-1 border-r border-white/15" ref={travelersRef}>
 <button
 type="button"
 onClick={() => setShowTravelersDropdown(v => !v)}
 className="w-full flex items-center gap-2 pl-11 pr-4 py-4 bg-transparent text-sm text-left focus:outline-none"
 >
 <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
 <span className={searchTravelers ?'text-white' :'text-white/40'}>
 {searchTravelers ==='1' ?'1 Udhëtar' : searchTravelers ==='2' ?'2 Udhëtarë' : searchTravelers ==='3' ?'3 Udhëtarë' : searchTravelers ==='4' ?'4+ Udhëtarë' :'Udhëtarët'}
 </span>
 <svg className={`ml-auto h-4 w-4 text-white/40 transition-transform duration-200 ${showTravelersDropdown ?'rotate-180' :''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
 </button>
 {showTravelersDropdown && (
 <div className="absolute left-0 right-0 bottom-full mb-1 bg-white border border-gray-200 shadow-2xl z-[9999] overflow-hidden" style={{ minWidth:'100%'}}>
 <div className="px-4 pt-3 pb-1 border-b border-gray-100">
 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Madhësia e Grupit</p>
 </div>
 {[
 { value:'1', label:'Vetëm', sub:'1 udhëtar'},
 { value:'2', label:'Dyshe', sub:'2 udhëtarë'},
 { value:'3', label:'Grup i Vogël', sub:'3 udhëtarë'},
 { value:'4', label:'Grup i Madh', sub:'4+ udhëtarë'},
 ].map(opt => (
 <button
 key={opt.value}
 type="button"
 onClick={() => { setSearchTravelers(opt.value); setShowTravelersDropdown(false);}}
 className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left border-b border-gray-50 last:border-0 ${searchTravelers === opt.value ?'bg-red-50' :''}`}
 >
 <span className="flex-1">
 <span className={`block text-sm font-semibold ${searchTravelers === opt.value ?'text-red-600' :'text-gray-900'}`}>{opt.label}</span>
 <span className="block text-xs text-gray-400">{opt.sub}</span>
 </span>
 {searchTravelers === opt.value && (
 <svg className="h-4 w-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
 )}
 </button>
 ))}
 {searchTravelers && (
 <div className="px-4 py-2 border-t border-gray-100">
 <button type="button" onClick={() => { setSearchTravelers(''); setShowTravelersDropdown(false);}} className="text-xs text-gray-400 hover:text-red-500 transition">Fshi zgjedhjen</button>
 </div>
 )}
 </div>
 )}
 </div>

 <button
 type="submit"
 className="col-span-2 md:col-span-1 bg-red-600 text-white px-6 py-4 hover:bg-red-700 transition font-semibold text-sm flex items-center justify-center gap-2 tracking-wide uppercase"
 >
 <Search className="h-4 w-4" />
 Kërko
 </button>
 </div>
 </form>
 </div>
 </div>
 </section>

 {/* STATS BAR */}
 <section className="bg-gray-950 py-0">
 <div className="max-w-7xl mx-auto px-6 lg:px-8">
 <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
 {STATS.map(({ value, label}) => (
 <div key={label} className="py-8 px-8 text-center">
 <p className="text-3xl font-bold text-white mb-1">{value}</p>
 <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">{label}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* FEATURED PACKAGES */}
 <section className="py-24 bg-white">
 <div className="max-w-7xl mx-auto px-6 lg:px-8">
 <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
 <div>
 <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-600 mb-4">Paketa Udhëtimi</p>
 <h2 className="text-4xl md:text-5xl font-bold text-gray-950 leading-tight">
  Paketat Më të Preferuara
</h2>
<p className="text-gray-500 mt-3 max-w-lg text-base leading-relaxed">
  Disa nga udhëtimet më të zgjedhura nga klientët tanë. Itinerar i plotë, çmime transparente dhe akomodime të përzgjedhura me kujdes.
</p>
 </div>
 <Link to="/packages" className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition uppercase tracking-wider whitespace-nowrap border-b-2 border-red-600 pb-0.5">
 Shiko të Gjitha <ChevronRight className="h-4 w-4" />
 </Link>
 </div>
 {loading ? (
 <div className="text-center py-16">
 <div className="inline-block animate-spin h-10 w-10 border-2 border-red-600 border-t-transparent" />
 </div>
 ) : featuredPackages.length > 0 ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
 {featuredPackages.map((pkg) => (
 <HomePkgCard key={pkg.id} pkg={pkg} />
 ))}
 </div>
 ) : (
 <div className="text-center py-16 text-gray-400 border border-gray-100">Nuk ka paketa të zgjedhura për momentin.</div>
 )}
 </div>
 </section>

 {/* ABOUT — SPLIT FULL-BLEED */}
 <section className="bg-gray-950">
 <div className="max-w-7xl mx-auto">
 <div className="grid grid-cols-1 lg:grid-cols-2">
 <div className="relative h-[520px] lg:h-auto overflow-hidden">
 <img
 src="https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=1200"
 alt="Travel planning"
 className="w-full h-full object-cover"
 />
 <div className="absolute inset-0 bg-black/30" />
 <div className="absolute bottom-8 left-8 right-8">
 <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-4 flex items-center gap-4">
 <div>
 <p className="text-2xl font-bold text-white">4.9 / 5</p>
 <p className="text-xs text-white/60 uppercase tracking-widest font-medium">Vlerësimi mesatar i klientëve</p>
 </div>
 <div className="ml-auto flex gap-1">
 {[...Array(5)].map((_, i) => (
 <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
 ))}
 </div>
 </div>
 </div>
 </div>
 <div className="px-10 lg:px-16 py-20 flex flex-col justify-center">
 <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500 mb-6">Rreth Univers</p>
<h2 className="text-4xl font-bold text-white leading-tight mb-7">
  Agjenci udhëtimi me bazë në Tiranë.
</h2>
<p className="text-gray-400 text-base leading-relaxed mb-5">
  Organizojmë udhëtime për familje, çifte, kompani dhe institucione. Paketa turistike, bileta avioni, transport për grupe dhe itinerare të personalizuara – të gjitha nga i njëjti ekip, nga fillimi deri në fund.
</p>
 <p className="text-gray-500 leading-relaxed mb-10 text-sm">
  Jemi të akredituar nga IATA dhe të certifikuar nga TravelLife. Punojmë me partnerë të besuar dhe hotele të verifikuara në Ballkan, Mesdhe dhe destinacione të tjera ndërkombëtare.
</p>
 <div className="flex flex-wrap gap-3">
 <Link to="/about" className="inline-flex items-center gap-2 bg-red-600 text-white px-7 py-3.5 hover:bg-red-700 transition font-semibold text-sm tracking-wide uppercase">
 Rreth Nesh <ChevronRight className="h-4 w-4" />
 </Link>
 <Link to="/contact" className="inline-flex items-center gap-2 border border-white/20 text-white px-7 py-3.5 hover:border-white/40 hover:bg-white/5 transition font-semibold text-sm tracking-wide uppercase">
 Kontakt
 </Link>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* TRUST STRIP */}
 <section className="py-14 bg-red-600">
 <div className="max-w-7xl mx-auto px-6 lg:px-8">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-red-500">
 {[
 { icon: CheckCircle, label:'Çmime pa Surpriza', sub:'Çdo kosto konfirmohet me shkrim para se të paguani. Nuk ka asnjë tarifë shtesë që shfaqet pas konfirmimit.'},
 { icon: HeadphonesIcon, label:'Person Real në Telefon', sub:'Keni dikë që e njeh rezervimin tuaj — jo një qendër thirrjesh. Mund të na kontaktoni direkt gjatë gjithë udhëtimit.'},
 { icon: Shield, label:'Akreditim IATA', sub:'Lëshojmë bileta ajrore drejtpërdrejt si agjenci e akredituar. Mbrojtja e klientit sipas standardeve ndërkombëtare.'},
 { icon: Leaf, label:'Çertifikim TravelLife', sub:'Çertifikim i pavarur dhe i audituar çdo vit. Jo vetëdeklarim — verifikohet nga jashtë.'},
 ].map(({ icon: Icon, label, sub}) => (
 <div key={label} className="flex flex-col items-start text-white px-8 py-6">
 <Icon className="h-6 w-6 mb-4 opacity-80" />
 <p className="font-bold text-sm uppercase tracking-widest mb-2">{label}</p>
 <p className="text-red-100 text-sm leading-relaxed font-light">{sub}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* REGIONAL EXPERTISE */}
 <section className="py-24 bg-white">
 <div className="max-w-7xl mx-auto px-6 lg:px-8">
 <div className="mb-16">
 <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-600 mb-4">Ku Operojmë</p>
 <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
 <h2 className="text-4xl md:text-5xl font-bold text-gray-950">Ku Shkojmë</h2>
 <p className="text-gray-500 max-w-lg text-sm leading-relaxed">
 Punojmë vetëm në destinacionet që i njohim personalisht — jo gjëra të marra nga katalogje ndërkombëtare pa kontakt lokal.
 </p>
 </div>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100">
 {EXPERTISE_REGIONS.map((r) => (
 <div key={r.region} className="group bg-white overflow-hidden">
 <div className="relative h-72 overflow-hidden">
 <img
 src={r.image}
 alt={r.region}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
 <div className="absolute bottom-0 left-0 right-0 p-6">
 <p className="text-white font-bold text-2xl tracking-tight mb-1">{r.region}</p>
 <p className="text-white/55 text-xs uppercase tracking-wider font-medium">{r.countries}</p>
 </div>
 </div>
 <div className="p-6 border border-t-0 border-gray-100">
 <p className="text-gray-500 text-sm leading-relaxed">{r.description}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* HOW WE WORK */}
 <section className="py-24 bg-gray-50 border-t border-gray-100">
 <div className="max-w-7xl mx-auto px-6 lg:px-8">
 <div className="mb-16">
 <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-600 mb-4">Procesi Ynë</p>
 <h2 className="text-4xl md:text-5xl font-bold text-gray-950 mb-3">Nga Ideja deri te Udhëtimi</h2>
 <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
 E mbajmë të thjeshtë. Komunikim i qartë, furnizues të besuar dhe dikush përgjegjës nga biseda e parë deri sa të ktheheni.
 </p>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-gray-200">
 {PROCESS_STEPS.map((s, idx) => (
 <div key={s.step} className={`p-8 ${idx < 3 ?'border-b lg:border-b-0 lg:border-r border-gray-200' :''} ${idx === 1 ?'border-b sm:border-b-0 sm:border-r lg:border-r lg:border-b-0' :''}`}>
 <p className="text-6xl font-black text-gray-100 leading-none mb-6 select-none">{s.step}</p>
 <div className="w-6 h-0.5 bg-red-600 mb-5" />
 <h3 className="text-base font-bold text-gray-950 mb-3 uppercase tracking-wide">{s.title}</h3>
 <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* TESTIMONIALS */}
 <section className="py-24 bg-white">
 <div className="max-w-7xl mx-auto px-6 lg:px-8">
 <div className="mb-14">
 <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-600 mb-4">Klientët Tanë</p>
 <h2 className="text-4xl md:text-5xl font-bold text-gray-950">Çfarë Thonë Ata Që Kanë Udhëtuar me Ne</h2>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100">
 {TESTIMONIALS.map(({ name, role, text, rating}) => (
 <div key={name} className="bg-white p-8 relative">
 <div className="flex items-center gap-1 mb-6">
 {Array.from({ length: rating}).map((_, i) => (
 <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-current" />
 ))}
 </div>
 <p className="text-gray-700 text-sm leading-relaxed mb-8">"{text}"</p>
 <div className="border-t border-gray-100 pt-5">
 <p className="font-bold text-gray-950 text-sm">{name}</p>
 <p className="text-gray-400 text-xs mt-1 uppercase tracking-wide">{role}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* CORPORATE — FULL IMAGE BANNER */}
 <section className="relative h-[520px] overflow-hidden">
 <img
 src="https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=1600"
 alt="Corporate travel"
 className="absolute inset-0 w-full h-full object-cover"
 />
 <div className="absolute inset-0 bg-black/65" />
 <div className="relative h-full flex items-center">
 <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
 <div className="max-w-2xl">
 <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-400 mb-6">Udhëtime Korporatash & Grupesh</p>
<h2 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6 tracking-tight">
  Po udhëtoni në grup? Ne organizojmë gjithçka për ju.
</h2>
 <div className="w-10 h-0.5 bg-amber-400 mb-8" />
 <Link
 to="/contact"
 className="inline-flex items-center gap-3 bg-white text-gray-950 px-8 py-4 font-bold text-sm hover:bg-gray-100 transition uppercase tracking-wider"
 >
 Kërkoni një Ofertë Grupi <ChevronRight className="h-4 w-4" />
 </Link>
 </div>
 </div>
 </div>
 </section>

 {/* COMMITMENTS */}
 <section className="py-24 bg-gray-950">
 <div className="max-w-7xl mx-auto px-6 lg:px-8">
 <div className="mb-16">
 <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500 mb-4">Standarde & Akreditime</p>
 <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Pse Mund të na Besoni</h2>
 <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
 Akreditimet dhe çertifikimet tona nuk janë thjesht logo — verifikohen çdo vit nga organizma të pavarura ndërkombëtare.
 </p>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
 {COMMITMENTS.map(({ icon: Icon, title, desc}) => (
 <div key={title} className="bg-gray-950 p-8 hover:bg-gray-900 transition-colors duration-300">
 <div className="mb-6">
 <Icon className="h-7 w-7 text-red-500" />
 </div>
 <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">{title}</h3>
 <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* TRAVEL TIPS */}
 <section className="py-24 bg-white border-t border-gray-100">
 <div className="max-w-7xl mx-auto px-6 lg:px-8">
 <div className="mb-16">
 <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-600 mb-4">Këshilla Udhëtimi</p>
 <h2 className="text-4xl md:text-5xl font-bold text-gray-950 mb-3">Gjëra që Duhen Ditur</h2>
 <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
 Këto i diskutojmë me çdo klient. Ndoshta disa i dini, por ja ato që kanë bërë diferencën.
 </p>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
 {TRAVEL_TIPS.map(({ icon: Icon, title, desc, tag}) => (
 <div key={title} className="bg-white p-8 hover:bg-gray-50 transition-colors duration-300">
 <div className="flex items-start justify-between mb-6">
 <Icon className="h-6 w-6 text-gray-700" />
 <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{tag}</span>
 </div>
 <h3 className="text-sm font-bold text-gray-950 mb-3 uppercase tracking-wide leading-snug">{title}</h3>
 <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* CONTACT CTA */}
 <section className="py-0 bg-gray-950">
 <div className="max-w-7xl mx-auto">
 <div className="grid grid-cols-1 lg:grid-cols-2">
 <div className="relative h-80 lg:h-auto overflow-hidden">
 <img
 src="https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1200"
 alt="Contact"
 className="w-full h-full object-cover"
 />
 <div className="absolute inset-0 bg-black/50" />
 <div className="absolute inset-0 flex items-center justify-center">
 <p className="text-5xl font-black text-white/10 uppercase tracking-widest text-center leading-none">KONTAKT</p>
 </div>
 </div>
 <div className="px-10 lg:px-16 py-20 flex flex-col justify-center">
 <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500 mb-6">Na Kontaktoni</p>
<h2 className="text-4xl font-bold text-white leading-tight mb-4">
  Keni pyetje? Jemi këtu për t’ju ndihmuar.
</h2>
 <p className="text-gray-500 text-sm leading-relaxed mb-10">
 Nuk keni nevojë të keni gjithçka gati. Na shkruani ose telefononi dhe e ndërtojmë bashkë — çmimet, datat, destinacionin dhe gjithçka tjetër.
 </p>
 <div className="flex flex-col gap-3">
 <a
 href="tel:+355684030204"
 className="flex items-center gap-4 border border-white/10 hover:border-white/25 px-6 py-4 transition group"
 >
 <Phone className="h-5 w-5 text-red-500 flex-shrink-0" />
 <div>
 <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mb-0.5">Telefononi</p>
 <p className="text-white font-semibold text-sm group-hover:text-red-400 transition">+355 68 403 0204</p>
 </div>
 </a>
 <a
 href="mailto:info@universtravel.al"
 className="flex items-center gap-4 border border-white/10 hover:border-white/25 px-6 py-4 transition group"
 >
 <Mail className="h-5 w-5 text-red-500 flex-shrink-0" />
 <div>
 <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mb-0.5">Shkruani</p>
 <p className="text-white font-semibold text-sm group-hover:text-red-400 transition">info@universtravel.al</p>
 </div>
 </a>
 <Link
 to="/contact"
 className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-4 font-bold text-sm transition uppercase tracking-wider"
 >
 Na Shkruani <ChevronRight className="h-4 w-4" />
 </Link>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* PARTNER LOGOS */}
 <section className="py-12 bg-gray-950 border-t border-white/5 bg-white">
 <div className="max-w-7xl mx-auto px-6 lg:px-8">
 <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-gray-700 mb-8">Akreditime & Anëtarësi</p>
 <div className="hidden md:flex items-center justify-center gap-12">
 <img src="https://elitetravel-albania.com/wp-content/uploads/2025/06/Travel-Life.png" alt="Travel Life" className="h-9 w-auto object-contain" />
 <img src="https://elitetravel-albania.com/wp-content/uploads/2025/06/IATA.png" alt="IATA" className="h-9 w-auto object-contain" />
 <img src="https://elitetravel-albania.com/wp-content/uploads/2025/06/Travel.png" alt="Travel" className="h-9 w-auto object-contain" />
 <img src="https://elitetravel-albania.com/wp-content/uploads/2025/06/GIN.png" alt="GIN" className="h-9 w-auto object-contain" />
 <img src="https://elitetravel-albania.com/wp-content/uploads/2025/06/Clia.png" alt="Clia" className="h-9 w-auto object-contain" />
 </div>
 <div className="md:hidden overflow-hidden">
 <div className="flex animate-marquee" style={{ width:'max-content'}}>
 {[0, 1].map((set) => (
 <div key={set} className="flex items-center gap-10 pr-10">
 <img src="https://elitetravel-albania.com/wp-content/uploads/2025/06/Travel-Life.png" alt="Travel Life" className="h-8 w-auto object-contain opacity-40" />
 <img src="https://elitetravel-albania.com/wp-content/uploads/2025/06/IATA.png" alt="IATA" className="h-8 w-auto object-contain opacity-40" />
 <img src="https://elitetravel-albania.com/wp-content/uploads/2025/06/Travel.png" alt="Travel" className="h-8 w-auto object-contain opacity-40" />
 <img src="https://elitetravel-albania.com/wp-content/uploads/2025/06/GIN.png" alt="GIN" className="h-8 w-auto object-contain opacity-40" />
 <img src="https://elitetravel-albania.com/wp-content/uploads/2025/06/Clia.png" alt="Clia" className="h-8 w-auto object-contain opacity-40" />
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>

 </div>
 );
}
