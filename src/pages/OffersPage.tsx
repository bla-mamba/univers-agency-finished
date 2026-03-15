import { useEffect, useState} from'react';
import { Link} from'react-router-dom';
import { Tag, Calendar, MapPin, Clock, ArrowRight, AlertCircle, CheckCircle2, FileText, Users} from'lucide-react';
import { supabase} from'../lib/supabase';
import { useHeroMedia} from'../hooks/useHeroMedia';

interface Offer {
 id: string;
 title: string;
 description: string;
 discount_percent: number;
 badge_text: string;
 valid_from: string;
 valid_until: string | null;
 package: {
 title: string;
 slug: string;
 price: number;
 duration_days: number;
 images: string[];
 destination: { name: string; country: string} | null;
} | null;
}

const OFFER_CONDITIONS = [
'Të gjitha çmimet e publikuara janë për person dhe bazohen në akomodim për dy persona në një dhomë. Shtesa për akomodim tek aplikohet aty ku është e specifikuar në kushtet e paketës.',
'Zbritja aplikohet vetëm mbi çmimin bazë të paketës dhe nuk përfshin shërbimet shtesë opsionale, përmirësimet e fluturimit apo sigurimin e udhëtimit.',
'Çmimet konfirmohen në momentin e pagesës së depozitës. Fiksimi i çmimit aplikohet vetëm pasi depozita të jetë marrë dhe përpunuar.',
'Ofertat janë të kufizuara sipas kapacitetit. Disponueshmëria nuk garantohet derisa rezervimi të konfirmohet me shkrim nga ekipi ynë i operacioneve.',
];

const OFFER_POLICY = [
 {
 icon: FileText,
 title:'Booking Confirmation',
 body:'All offers require a signed booking form and deposit to secure the rate. Verbal reservations are not binding.',
},
 {
 icon: Users,
 title:'Group Eligibility',
 body:'Corporate and group bookings (10+ pax) may qualify for negotiated rates outside of these published offers. Contact us separately.',
},
 {
 icon: CheckCircle2,
 title:'Price Lock',
 body:'Once your deposit is received, the offered rate is locked for the confirmed travel dates. No further adjustments apply.',
},
];

export default function OffersPage() {
 const hero = useHeroMedia('offers', {
 media_type:'image',
 url:'https://images.pexels.com/photos/2161449/pexels-photo-2161449.jpeg?auto=compress&cs=tinysrgb&w=1920',
 overlay_opacity: 0.6,
});
 const [offers, setOffers] = useState<Offer[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 loadOffers();
}, []);

 const loadOffers = async () => {
 try {
 const { data, error} = await supabase
 .from('offers')
 .select(`
 *,
 package:packages(title, slug, price, duration_days, images, destination:destinations(name, country))
`)
 .eq('is_active', true)
 .order('created_at', { ascending: false});

 if (error) throw error;
 setOffers(data || []);
} catch (err) {
 console.error('Error loading offers:', err);
} finally {
 setLoading(false);
}
};

 const getDaysLeft = (validUntil: string | null) => {
 if (!validUntil) return null;
 const diff = Math.ceil((new Date(validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
 return diff > 0 ? diff : null;
};

 const getSalePrice = (price: number, discountPercent: number) => {
 return price * (1 - discountPercent / 100);
};

 return (
 <div className="min-h-screen bg-[#f5f4f2]">

 {/* HERO */}
 <section className="relative h-[420px] overflow-hidden">
 {hero.media_type ==='video' ? (
 <video src={hero.url} className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline />
 ) : (
 <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage:`url(${hero.url})`}} />
 )}
 <div className="absolute inset-0" style={{ backgroundColor:`rgba(0,0,0,${hero.overlay_opacity})`}} />
 <div className="relative max-w-7xl mx-auto px-6 lg:px-8 h-full flex flex-col justify-end pb-14">
 <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400 mb-4">Oferta aktive</p>
 <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">Ofertat aktive</h1>
 <p className="text-white/60 max-w-xl leading-relaxed text-base font-light">
Zbritje të përkohshme në disa paketa të përzgjedhura. Ofertat janë të kufizuara dhe varen nga disponueshmëria në momentin e rezervimit.
 </p>
 </div>
 </section>

 {/* TERMS NOTICE STRIP */}
 <div className="bg-amber-50 border-b border-amber-200">
 <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
 <div className="flex items-start gap-3">
 <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
 <p className="text-xs text-amber-800 leading-relaxed">
 <span className="font-semibold">E rëndësishme:</span> Ofertat vlejnë vetëm për rezervime të reja dhe varen nga disponueshmëria. Nuk mund të kombinohen me oferta ose zbritje të tjera.
 </p>
 </div>
 </div>
 </div>

 <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

 {/* HEADER ROW */}
 <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 pb-6 border-b border-gray-200">
 <div>
 <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Ofertat e publikuara</h2>
 <p className="text-sm text-gray-500 mt-1">
 {loading ?'Loading…' :`${offers.length} active offer${offers.length !== 1 ?'s' :''} as of today`}
 </p>
 </div>
 <Link
 to="/packages"
 className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600 transition uppercase tracking-wide"
 >
Shiko të gjitha paketat <ArrowRight className="h-4 w-4" />
 </Link>
 </div>

 {loading ? (
 <div className="flex items-center justify-center py-24">
 <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-gray-900" />
 </div>
 ) : offers.length === 0 ? (
 <div className="text-center py-20 bg-white border border-gray-200">
 <Tag className="h-8 w-8 mx-auto mb-4 text-gray-300" />
 <h3 className="text-base font-bold text-gray-800 mb-1">Nuk ka oferta aktive për momentin</h3>
 <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
Ofertat përditësohen rregullisht. Kontrolloni përsëri së shpejti ose na kontaktoni për çmime të veçanta për grupe.
 </p>
 <Link
 to="/packages"
 className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-3 text-sm font-semibold hover:bg-red-600 transition uppercase tracking-wide"
 >
Shiko të gjitha paketat <ArrowRight className="h-4 w-4" />
 </Link>
 </div>
 ) : (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-gray-200">
 {offers.map((offer) => {
 const pkg = offer.package;
 const img = pkg?.images?.[0] ||'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800';
 const daysLeft = getDaysLeft(offer.valid_until);
 const salePrice = pkg ? getSalePrice(pkg.price, offer.discount_percent) : null;
 const saving = pkg ? pkg.price - (salePrice ?? pkg.price) : null;

 return (
 <div key={offer.id} className="bg-white overflow-hidden group flex flex-col">

 {/* IMAGE */}
 <div className="relative h-56 overflow-hidden flex-shrink-0">
 <img
 src={img}
 alt={offer.title}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

 <div className="absolute top-4 left-4 flex flex-wrap gap-2">
 <span className="bg-red-600 text-white text-xs px-2.5 py-1 font-bold uppercase tracking-wider">
 {offer.discount_percent}% OFF
 </span>
 {offer.badge_text && (
 <span className="bg-white text-gray-800 text-xs px-2.5 py-1 font-semibold uppercase tracking-wider">
 {offer.badge_text}
 </span>
 )}
 </div>

 {daysLeft !== null && (
 <div className="absolute top-4 right-4 bg-gray-900/90 text-white text-xs px-2.5 py-1 font-medium flex items-center gap-1.5">
 <Clock className="h-3 w-3 text-amber-400" />
 {daysLeft} day{daysLeft !== 1 ?'s' :''} remaining
 </div>
 )}

 {pkg?.destination && (
 <div className="absolute bottom-4 left-4 flex items-center gap-1 text-xs text-white/80 uppercase tracking-wide">
 <MapPin className="h-3 w-3" />
 {pkg.destination.name}, {pkg.destination.country}
 </div>
 )}
 </div>

 {/* BODY */}
 <div className="p-6 flex flex-col flex-1">
 <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-red-600 transition leading-snug tracking-tight">
 {offer.title}
 </h3>
 <p className="text-gray-500 text-sm leading-relaxed mb-5">{offer.description}</p>

 {/* PACKAGE REF */}
 {pkg && (
 <div className="bg-gray-50 border border-gray-200 p-4 mb-5">
 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Vlen për paketën</p>
 <p className="text-sm font-semibold text-gray-800 mb-2">{pkg.title}</p>
 <div className="flex items-center gap-4 text-xs text-gray-500">
 <span className="flex items-center gap-1">
 <Clock className="h-3 w-3 text-gray-400" />
 {pkg.duration_days}-ditë
 </span>
 {offer.valid_until && (
 <span className="flex items-center gap-1">
 <Calendar className="h-3 w-3 text-gray-400" />
 Skadon {new Date(offer.valid_until).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric'})}
 </span>
 )}
 </div>
 </div>
 )}

 {/* PRICING */}
 <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-100">
 <div>
 {salePrice && pkg ? (
 <>
 <p className="text-xs text-gray-400 mb-0.5 line-through">
Nga €{Number(pkg.price).toLocaleString()} / person
 </p>
 <p className="text-2xl font-bold text-gray-900">
 ${Math.round(salePrice).toLocaleString()}
 <span className="text-sm font-normal text-gray-400 ml-1">/ person</span>
 </p>
 {saving && (
 <p className="text-xs text-green-700 font-semibold mt-1 uppercase tracking-wide">
 Kurseni ${Math.round(saving).toLocaleString()} per person
 </p>
 )}
 </>
 ) : (
 <p className="text-sm text-gray-400">Na kontaktoni për çmimin</p>
 )}
 </div>
 {pkg && (
 <Link
 to={`/packages/${pkg.slug}`}
 className="inline-flex items-center gap-2 bg-gray-900 hover:bg-red-600 text-white px-5 py-2.5 text-sm font-semibold transition uppercase tracking-wide"
 >
 Shiko paketën<ArrowRight className="h-4 w-4" />
 </Link>
 )}
 </div>
 </div>
 </div>
 );
})}
 </div>
 )}
 </div>

 {/* OFFER CONDITIONS */}
 <div className="bg-white border-t border-gray-200 py-20">
 <div className="max-w-7xl mx-auto px-6 lg:px-8">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

 <div>
 <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-600 mb-4">Kushtet e Ofertës</p>
 <h2 className="text-3xl font-bold text-gray-900 mb-5 leading-tight tracking-tight">
Kushtet që vlejnë për të gjitha ofertat
 </h2>
 <p className="text-gray-500 text-sm leading-relaxed mb-6">
 Të gjitha ofertat në këtë faqe janë subjekt i kushteve të mëposhtme standarde dhe vlejnë për çdo rezervim.
 </p>
 <ul className="space-y-3">
 {OFFER_CONDITIONS.map((condition, i) => (
 <li key={i} className="flex items-start gap-4 text-sm text-gray-600 leading-relaxed">
 <span className="flex-shrink-0 w-5 h-5 bg-gray-950 flex items-center justify-center text-xs font-bold text-white mt-0.5">
 {i + 1}
 </span>
 {condition}
 </li>
 ))}
 </ul>
 </div>

 <div className="space-y-0 border border-gray-200">
 {OFFER_POLICY.map(({ icon: Icon, title, body}, i, arr) => (
 <div key={title} className={`flex gap-5 p-6 ${i < arr.length - 1 ?'border-b border-gray-200' :''}`}>
 <div className="w-10 h-10 bg-gray-950 flex items-center justify-center flex-shrink-0">
 <Icon className="h-4 w-4 text-white" />
 </div>
 <div>
 <p className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wide">{title}</p>
 <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
 </div>
 </div>
 ))}

 <div className="p-6 bg-gray-950 border-t border-gray-200">
 <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400 mb-3">Keni pyetje për një ofertë?</p>
 <p className="text-sm text-white/50 leading-relaxed mb-5">
 Nëse keni nevojë për sqarime mbi kushtet e ofertës ose doni të konfirmoni disponueshmërinë, na kontaktoni menjehere.
 </p>
 <Link
 to="/contact"
 className="inline-flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 px-5 py-3 text-sm font-semibold transition uppercase tracking-wide"
 >
 Na kontaktoni <ArrowRight className="h-4 w-4" />
 </Link>
 </div>
 </div>

 </div>
 </div>
 </div>

 </div>
 );
}
