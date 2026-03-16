import { Phone, MapPin, Clock, Instagram, Mail} from'lucide-react';
import { useHeroMedia} from'../hooks/useHeroMedia';

const contactInfo = [
 {
 icon: Phone,
 title:'Telefon',
 lines: ['+355 68 403 0204'],
 href:'tel:+355684030204',
},
 {
 icon: Mail,
 title:'Email',
 lines: ['info@universstravel.com'],
 href:'mailto:info@universstravel.com',
},
 {
 icon: Instagram,
 title:'Instagram',
 lines: ['@universstravel'],
 href:'https://www.instagram.com/universstravel/',
},
 {
 icon: Clock,
 title:'Working Hours',
 lines: ['Mon – Fri: 9am – 7pm','Sat – Sun: 10am – 4pm'],
 href: null,
},
];

export default function ContactPage() {
 const hero = useHeroMedia('contact', {
 media_type:'image',
 url:'https://images.pexels.com/photos/1591382/pexels-photo-1591382.jpeg?auto=compress&cs=tinysrgb&w=1920',
 overlay_opacity: 0.6,
});

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
 <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400 mb-4">Lidhuni me ne</p>
 <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">Na kontaktoni</h1>
 <p className="text-white/60 max-w-xl leading-relaxed text-base font-light">
  Kontaktoni ekipin tonë direkt përmes telefonit ose email-it. Ne përgjigjemi shpejt dhe mund t’ju këshillojmë mbi disponueshmërinë, çmimet dhe logjistikën për çdo lloj udhëtimi.
 </p>
 </div>
 </div>

 {/* CONTACT GRID */}
 <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

 {/* LEFT — CONTACT INFO */}
 <div className="flex flex-col gap-4">
 <div className="grid grid-cols-2 gap-px bg-gray-200">
 {contactInfo.map((item) => {
 const Icon = item.icon;
 return (
 <div key={item.title} className="bg-white p-6 flex flex-col gap-4">
 <div className="w-10 h-10 bg-gray-950 flex items-center justify-center flex-shrink-0">
 <Icon className="h-4 w-4 text-white" />
 </div>
 <div>
 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{item.title}</p>
 {item.lines.map((line) =>
 item.href ? (
 <a
 key={line}
 href={item.href}
 target={item.href.startsWith('http') ?'_blank' : undefined}
 rel="noopener noreferrer"
 className="text-sm font-semibold text-gray-900 hover:text-red-600 transition block"
 >
 {line}
 </a>
 ) : (
 <p key={line} className="text-sm text-gray-600">{line}</p>
 )
 )}
 </div>
 </div>
 );
})}
 </div>

 {/* URGENT HELP */}
 <div className="bg-gray-950 p-7">
 <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400 mb-3">Linjë emergjente</p>
 <h3 className="text-lg font-bold text-white mb-2">Keni nevojë për ndihmë urgjente gjatë një udhëtimi?</h3>
 <p className="text-white/50 text-sm mb-5 leading-relaxed">
 Ekipi ynë operacional është i arritshëm jashtë orarit të zyrës për klientët që ndodhen aktualisht në një program.
 </p>
 <a
 href="tel:+35568663351"
 className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 font-semibold text-sm transition uppercase tracking-wide"
 >
 <Phone className="h-4 w-4" />
 +355 68 663 3351
 </a>
 </div>
 </div>

 {/* RIGHT — VIDEO */}
 <div className="overflow-hidden bg-gray-900" style={{ height:'540px'}}>
 <video
 src="/trip3.mp4"
 autoPlay
 loop
 muted
 playsInline
 className="w-full h-full object-cover"
 />
 </div>
 </div>

 {/* MAP */}
 <div className="mt-12 overflow-hidden bg-gray-200 h-80">
 <iframe
 title="Office Location"
 width="100%"
 height="100%"
 style={{ border: 0, display:'block'}}
 loading="lazy"
 allowFullScreen
 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000.0!2d19.7561707!3d41.3580576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13502f401b37ca23%3A0x36a8984ccace952a!2sUnivers%20Travel!5e0!3m2!1sen!2s!4v1741000000000"
 />
 </div>
 </div>
 </div>
 );
}
