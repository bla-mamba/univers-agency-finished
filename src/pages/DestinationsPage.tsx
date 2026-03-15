import { useEffect, useRef, useState, useMemo} from'react';
import { Link} from'react-router-dom';
import { MapPin, Search, ArrowRight, ChevronRight, Compass} from'lucide-react';
import { supabase} from'../lib/supabase';
import { useHeroMedia} from'../hooks/useHeroMedia';

interface Destination {
 id: string;
 name: string;
 slug: string;
 country: string;
 description: string;
 image_url: string;
 video_url: string | null;
 featured: boolean;
}


export default function DestinationsPage() {
 const hero = useHeroMedia('destinations', {
 media_type:'image',
 url:'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=1920',
 overlay_opacity: 0.6,
});
 const [destinations, setDestinations] = useState<Destination[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');

 useEffect(() => {
 loadDestinations();
}, []);

 const loadDestinations = async () => {
 try {
 const { data, error} = await supabase
 .from('destinations')
 .select('*')
 .order('featured', { ascending: false})
 .order('name');
 if (error) throw error;
 setDestinations(data || []);
} catch (error) {
 console.error('Error loading destinations:', error);
} finally {
 setLoading(false);
}
};

 const filtered = useMemo(
 () =>
 destinations.filter(
 (d) =>
 d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
 d.country.toLowerCase().includes(searchTerm.toLowerCase())
 ),
 [destinations, searchTerm]
 );

 const featured = filtered.filter((d) => d.featured);
 const all = filtered;

 return (
 <div className="min-h-screen bg-[#f5f4f2]">

 {/* HERO */}
 <div className="relative h-[420px] overflow-hidden">
 {hero.media_type ==='video' ? (
 <video src={hero.url} className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline />
 ) : (
 <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage:`url(${hero.url})`}} />
 )}
 <div className="absolute inset-0" style={{ backgroundColor:`rgba(0,0,0,${hero.overlay_opacity})`}} />
 <div className="relative max-w-7xl mx-auto px-6 lg:px-8 h-full flex flex-col justify-end pb-14">
 <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400 mb-4">Ku Operojmë</p>
 <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">Destinacionet</h1>
 <p className="text-white/60 max-w-xl leading-relaxed text-base font-light">
  Çdo destinacion që ofrojmë është parë dhe vlerësuar nga ekipi ynë. Hotelet, transporti dhe organizimi i udhëtimit verifikohen para se të përfshihen në ofertat tona.
</p>
 </div>
 </div>


 <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

 {/* SEARCH + HEADER */}
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-6 border-b border-gray-200">
 <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Lista e Destinacioneve</h2>
 <div className="relative w-full sm:w-72">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
 <input
 type="text"
 placeholder="Kërko sipas qytetit ose shtetit..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-9 pr-4 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-gray-900 bg-white transition-colors"
 />
 </div>
 </div>

 {loading ? (
 <div className="text-center py-16">
 <div className="inline-block animate-spin h-8 w-8 border-2 border-gray-300 border-t-gray-900" />
 </div>
 ) : filtered.length === 0 ? (
 <div className="text-center py-20 bg-white border border-gray-200">
 <Compass className="h-8 w-8 mx-auto mb-4 text-gray-300" />
 <p className="text-base font-semibold text-gray-700 mb-1">Nuk u gjet asnjë destinacion</p>
 <p className="text-sm text-gray-400 mb-6">Provoni me një emër tjetër qyteti ose vendi.</p>
 <button
 onClick={() => setSearchTerm('')}
 className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-3 text-sm font-semibold hover:bg-red-600 transition uppercase tracking-wide"
 >
 Fshi kërkimin
 </button>
 </div>
 ) : (
 <>
 {/* FEATURED */}
 {featured.length > 0 && (
 <div className="mb-14">
 <div className="flex items-center gap-4 mb-6">
 <div className="w-6 h-px bg-red-600" />
 <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Destinacionet Kryesore</h3>
 <span className="text-xs text-gray-400">
  — destinacionet ku kemi më shumë eksperiencë dhe programe udhëtimi
</span>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
 {featured.map((dest) => (
 <DestinationCard key={dest.id} destination={dest} featured />
 ))}
 </div>
 </div>
 )}

 {/* ALL */}
 <div>
 <div className="flex items-center gap-4 mb-6">
 <div className="w-6 h-px bg-gray-400" />
 <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Të Gjitha Destinacionet</h3>
 <span className="text-xs text-gray-400">— {all.length} vendndodhje</span>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
 {all.map((dest) => (
 <DestinationCard key={dest.id} destination={dest} />
 ))}
 </div>
 </div>
 </>
 )}
 </div>

 {/* METHODOLOGY SECTION */}
 {!loading && destinations.length > 0 && (
 <div className="bg-white border-t border-gray-200 py-20">
 <div className="max-w-7xl mx-auto px-6 lg:px-8">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
 <div>
 <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-600 mb-4">Si Zgjedhim Destinacionet</p>
 <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
 Si hyjnë destinacionet në portofolin tonë
 </h2>
 <p className="text-gray-500 text-sm leading-relaxed mb-4">
 Nuk i listojmë destinacionet bazuar në popularitet apo kërkesa partnerësh. Çdo vendndodhje në portofolin tonë ka kaluar nëpër vlerësim operacional: marrëdhëniet me furnizuesit janë vendosur, standardet e akomodimit janë shqyrtuar dhe logjistika e itinerarit është testuar.
 </p>
 <p className="text-gray-500 text-sm leading-relaxed mb-8">
 Ky proces zakonisht zgjat disa muaj për çdo destinacion. Rezultati është një portofol më i vogël por më i besueshëm — ku çdo program që ofrojmë është konfirmuar të funksionojë sipas standardit që garantojmë klientëve.
 </p>
 <Link
 to="/about"
 className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-red-600 transition uppercase tracking-wide border-b border-gray-900 hover:border-red-600 pb-0.5"
 >
 Rreth metodologjisë sonë <ChevronRight className="h-4 w-4" />
 </Link>
 </div>
 <div className="border border-gray-200">
 {[
 {
 step:'01',
 title:'Vlerësimi në Terren',
 desc:'Ekipi ynë viziton çdo destinacion për të vlerësuar cilësinë e akomodimit, rrugët e transfereve, aksesin në vendndodhje dhe standardet e shërbimit tokësor.',
},
 {
 step:'02',
 title:'Verifikimi i Furnizuesve',
 desc:'Hotelet lokale, transportuesit dhe guidat kontraktohen vetëm pasi plotësojnë standardet tona të besueshmërisë dhe komunikimit.',
},
 {
 step:'03',
 title:'Testimi i Itinerarit',
 desc:'Programet e hartuara testohen operacionalisht para se të publikohen — koha, logjistika dhe aktivitetet e përfshira konfirmohen të gjitha në praktikë.',
},
 {
 step:'04',
 title:'Rishikim i Vazhdueshëm',
 desc:'Destinacionet aktive rishikohen çdo vit. Ndryshimet te furnizuesit, problemet e infrastrukturës apo rënia e shërbimit nxisin rivlerësim.',
},
 ].map((item, i, arr) => (
 <div key={item.step} className={`flex items-start gap-5 p-6 ${i < arr.length - 1 ?'border-b border-gray-200' :''}`}>
 <span className="text-xs font-bold text-red-600 flex-shrink-0 pt-0.5">{item.step}</span>
 <div>
 <p className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wide">{item.title}</p>
 <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 )}

 {/* CTA */}
 <div className="bg-gray-900 py-14">
 <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
 <div>
 <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400 mb-3">Kërkesa të Personalizuara</p>
 <h3 className="text-2xl font-bold text-white leading-tight mb-1 tracking-tight">
 Kërkoni një destinacion që nuk është në këtë listë
 </h3>
 <p className="text-white/40 text-sm max-w-md">
 Shpesh mund të vlerësojmë dhe ndërtojmë një program brenda disa javësh për vendndodhje të njohura.
 </p>
 </div>
 <Link
 to="/contact"
 className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-semibold text-sm transition flex-shrink-0 uppercase tracking-wide"
 >
 Kontaktoni Ekipin Tonë <ArrowRight className="h-4 w-4" />
 </Link>
 </div>
 </div>

 </div>
 );
}

function DestinationCard({
 destination,
 featured,
}: {
 destination: Destination;
 featured?: boolean;
}) {
 const videoRef = useRef<HTMLVideoElement>(null);

 const handleMouseEnter = () => { videoRef.current?.play();};
 const handleMouseLeave = () => {
 if (videoRef.current) {
 videoRef.current.pause();
 videoRef.current.currentTime = 0;
}
};

 return (
 <Link
 to={`/destinations/${destination.slug}`}
 className="group bg-white overflow-hidden flex flex-col"
 onMouseEnter={handleMouseEnter}
 onMouseLeave={handleMouseLeave}
 >
 <div className="relative h-56 overflow-hidden">
 {destination.video_url ? (
 <video
 ref={videoRef}
 src={destination.video_url}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
 muted
 loop
 playsInline
 />
 ) : (
 <img
 src={
 destination.image_url ||
'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=800'
}
 alt={destination.name}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
 />
 )}
 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
 {featured && (
 <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs px-2.5 py-1 font-bold uppercase tracking-wider">
 Kryesor
 </div>
 )}
 <div className="absolute bottom-0 left-0 right-0 p-5">
 <h3 className="text-lg font-bold text-white leading-tight tracking-tight">{destination.name}</h3>
 <div className="flex items-center gap-1 text-xs text-white/60 mt-1 uppercase tracking-wide">
 <MapPin className="h-3 w-3" />
 {destination.country}
 </div>
 </div>
 </div>
 <div className="p-5 flex flex-col flex-1 border-b border-l border-r border-gray-100">
 <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">
 {destination.description ||'Një destinacion i zgjedhur me kujdes me programe të koordinuara plotësisht, të disponueshme me kërkesë.'}
 </p>
 <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
 <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Shiko Programet</span>
 <span className="flex items-center gap-1 text-red-600 text-sm font-semibold group-hover:gap-2 transition-all">
 Zbulo <ArrowRight className="h-3.5 w-3.5" />
 </span>
 </div>
 </div>
 </Link>
 );
}
