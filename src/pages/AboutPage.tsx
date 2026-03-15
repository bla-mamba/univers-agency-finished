import { Users, Globe, Heart, CheckCircle, ShieldCheck, DollarSign, Clock, ChevronRight} from'lucide-react';
import { Link} from'react-router-dom';
import { useHeroMedia} from'../hooks/useHeroMedia';

const stats = [
 { label:'Clients Served', value:'12,000+'},
 { label:'Destinations', value:'60+'},
 { label:'Years in Operation', value:'15+'},
];

const values = [
 {
 icon: Heart,
 title:'Genuine Expertise',
 description:
'We operate from Tirana with direct knowledge of the Balkans and Mediterranean — not sourced through aggregators or resold programs.',
},
 {
 icon: CheckCircle,
 title:'Quality at Every Level',
 description:
'Every property, transport arrangement, and local guide in our portfolio has been personally vetted by our operations team.',
},
 {
 icon: Users,
 title:'Client-First Operations',
 description:
'One point of contact from enquiry to return. No call centers, no ticket numbers — direct access to the team managing your booking.',
},
 {
 icon: Globe,
 title:'Responsible Travel',
 description:
'TravelLife certified. We select partners and transport options that minimize environmental impact and respect local communities.',
},
];

const whyChooseUs = [
 {
 icon: Clock,
 title:'15+ years of operational experience in Southeast Europe',
 description:
'We have been organizing travel in the Balkans and Mediterranean since 2009. That depth of experience translates directly into smoother itineraries, better supplier relationships, and fewer surprises.',
},
 {
 icon: ShieldCheck,
 title:'End-to-end coordination and on-trip support',
 description:
'We manage every component — flights, transfers, accommodation, guides — and remain reachable throughout your trip. If something changes, you speak to someone who knows your booking.',
},
 {
 icon: CheckCircle,
 title:'Verified standards across every supplier',
 description:
'Accommodation ratings vary significantly by market. We inspect every property we include and only work with transport and guide partners who have met our operational requirements.',
},
 {
 icon: DollarSign,
 title:'Transparent, all-inclusive pricing',
 description:
'The price quoted covers what is listed. All costs are itemized before any commitment is made. There are no supplementary charges added after confirmation.',
},
];

const partnerLogos = [
 { src:'https://elitetravel-albania.com/wp-content/uploads/2025/06/Travel-Life.png', alt:'Travel Life'},
 { src:'https://elitetravel-albania.com/wp-content/uploads/2025/06/IATA.png', alt:'IATA'},
 { src:'https://elitetravel-albania.com/wp-content/uploads/2025/06/Travel.png', alt:'Travel'},
 { src:'https://elitetravel-albania.com/wp-content/uploads/2025/06/GIN.png', alt:'GIN'},
 { src:'https://elitetravel-albania.com/wp-content/uploads/2025/06/Clia.png', alt:'Clia'},
];

export default function AboutPage() {
 const hero = useHeroMedia('about', {
 media_type:'image',
 url:'https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=1920',
 overlay_opacity: 0.6,
});

 return (
 <div className="min-h-screen bg-white">

 {/* HERO */}
 <div className="relative h-[420px] overflow-hidden">
 {hero.media_type ==='video' ? (
 <video src={hero.url} className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline />
 ) : (
 <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage:`url(${hero.url})`}} />
 )}
 <div className="absolute inset-0" style={{ backgroundColor:`rgba(0,0,0,${hero.overlay_opacity})`}} />
 <div className="relative max-w-7xl mx-auto px-6 lg:px-8 h-full flex flex-col justify-end pb-14">
 <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400 mb-4">Tirana, Albania — Est. 2009</p>
 <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">Rreth Univers</h1>
 <p className="text-white/60 max-w-xl leading-relaxed text-base font-light">
  Jemi një agjenci udhëtimesh me shërbim të plotë, me mbi pesëmbëdhjetë vjet eksperiencë në krijimin e udhëtimeve të qeta në Ballkan, Mesdhe dhe më gjerë.
 </p>
 </div>
 </div>

 {/* STATS BAR */}
 <div className="bg-gray-950">
 <div className="max-w-7xl mx-auto px-6 lg:px-8">
 <div className="grid grid-cols-3 divide-x divide-white/10">
 {stats.map((stat) => (
 <div key={stat.label} className="py-10 px-8 text-center">
 <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
 <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">{stat.label}</p>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* OUR STORY — SPLIT */}
 <section className="bg-white">
 <div className="max-w-7xl mx-auto">
 <div className="grid grid-cols-1 lg:grid-cols-2">
 <div className="relative h-[500px] lg:h-auto overflow-hidden">
 <img
 src="https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=1200"
 alt="Our team"
 className="w-full h-full object-cover"
 />
 <div className="absolute inset-0 bg-black/25" />
 </div>
 <div className="px-10 lg:px-16 py-20 flex flex-col justify-center bg-white">
 <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-600 mb-5">Historia jonë</p>
 <h2 className="text-4xl font-bold text-gray-950 mb-6 leading-tight tracking-tight">
 Ndërtuar mbi përvojën praktike, jo mbi tekstet e marketingut.
 </h2>
 <p className="text-gray-500 text-sm leading-relaxed mb-4">
  Univers u themelua në Tiranë në vitin 2009. Që atëherë, kemi evoluar nga një operator lokal në një agjenci me shërbim të plotë, duke menaxhuar gjithçka, nga udhëtimet personale dhe pushimet familjare, te grupet korporative dhe programet institucionale.
 </p>
 <p className="text-gray-500 text-sm leading-relaxed mb-4">
  Ne menaxhojmë transportin tonë tokësor dhe kemi partneritete direkte me hotele dhe ofrues shërbimesh në Ballkan dhe Mesdhe. Çdo destinacion në portofolin tonë është vlerësuar me kujdes nga ekipi ynë para se t’i ofrohet klientëve.
 </p>
 <p className="text-gray-500 text-sm leading-relaxed mb-10">
 Jemi të akredituar nga IATA për biletimin ndërkombëtar dhe të certifikuar nga TravelLife për operacione të qëndrueshme — të dyja të verifikuara në mënyrë të pavarur për transparencë dhe cilësi.
 </p>
 <Link
 to="/contact"
 className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-7 py-3.5 font-semibold text-sm transition uppercase tracking-wide w-fit"
 >
Kontaktoni ekipin tonë <ChevronRight className="h-4 w-4" />
 </Link>
 </div>
 </div>
 </div>
 </section>

 {/* WHY CHOOSE US */}
 <section className="py-20 bg-[#f5f4f2]">
 <div className="max-w-7xl mx-auto px-6 lg:px-8">
 <div className="mb-14">
 <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-600 mb-4">Pse të punoni me ne?</p>
 <h2 className="text-4xl font-bold text-gray-950 leading-tight tracking-tight">
 Çfarë i veçon operacionet tona nga të tjerat?
 </h2>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
 {whyChooseUs.map((item) => {
 const Icon = item.icon;
 return (
 <div key={item.title} className="flex gap-6 p-8 bg-white">
 <div className="flex-shrink-0 w-10 h-10 bg-gray-950 flex items-center justify-center">
 <Icon className="h-4 w-4 text-white" />
 </div>
 <div>
 <h3 className="text-sm font-bold text-gray-950 mb-2 uppercase tracking-wide leading-snug">{item.title}</h3>
 <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
 </div>
 </div>
 );
})}
 </div>
 </div>
 </section>

 {/* FULL-WIDTH IMAGE BREAK */}
 <div
 className="relative h-80 bg-cover bg-center"
 style={{ backgroundImage:'url(https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=1920)'}}
 >
 <div className="absolute inset-0 bg-black/60" />
 <div className="relative max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center">
 <div className="max-w-2xl">
 <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400 mb-4">Udhëtime Korporative dhe Institucionale</p>
 <p className="text-3xl md:text-4xl font-bold text-white leading-tight">
  Ne specializohemi në organizimin e udhëtimeve grupore për kompani, OJQ dhe institucione qeveritare në gjithë rajonin.
 </p>
 </div>
 </div>
 </div>

 {/* VALUES */}
 <section className="py-20 bg-white border-t border-gray-100">
 <div className="max-w-7xl mx-auto px-6 lg:px-8">
 <div className="mb-14">
 <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-600 mb-4">Parimet e Operimit
</p>
 <h2 className="text-4xl font-bold text-gray-950 tracking-tight">Cfare mbështesim me bindje
</h2>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
 {values.map((value) => {
 const Icon = value.icon;
 return (
 <div key={value.title} className="bg-white p-8">
 <div className="mb-6">
 <Icon className="h-6 w-6 text-red-600" />
 </div>
 <h3 className="text-sm font-bold text-gray-950 mb-3 uppercase tracking-wide">{value.title}</h3>
 <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
 </div>
 );
})}
 </div>
 </div>
 </section>

 {/* PARTNER LOGOS */}
 <section className="py-14 bg-white border-t border-white/5">
 <div className="max-w-7xl mx-auto px-6 lg:px-8">
 <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-gray-600 mb-10">Akreditimet dhe Anëtarësimet
</p>
 <div className="hidden md:flex items-center justify-center gap-14">
 {partnerLogos.map((logo) => (
 <img
 key={logo.alt}
 src={logo.src}
 alt={logo.alt}
 className="h-10 w-auto object-contain transition-opacity duration-300"
 />
 ))}
 </div>
 <div className="md:hidden overflow-hidden">
 <div className="flex animate-marquee" style={{ width:'max-content'}}>
 {[0, 1].map((set) => (
 <div key={set} className="flex items-center gap-10 pr-10">
 {partnerLogos.map((logo) => (
 <img key={logo.alt} src={logo.src} alt={logo.alt} className="h-8 w-auto object-contain opacity-40" />
 ))}
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>

 </div>
 );
}
