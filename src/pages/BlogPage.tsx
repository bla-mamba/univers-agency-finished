import { useEffect, useState} from'react';
import { Link} from'react-router-dom';
import { Calendar, User, ArrowRight, Search, BookOpen, ChevronRight} from'lucide-react';
import { supabase} from'../lib/supabase';
import { useHeroMedia} from'../hooks/useHeroMedia';

interface BlogPost {
 id: string;
 title: string;
 slug: string;
 excerpt: string;
 cover_image: string;
 author_name: string;
 category: string;
 tags: string[];
 published_at: string;
}

const CATEGORIES = ['Të gjitha','Këshilla udhëtimi','Udhëzues destinacionesh','Lista kryesore','Kulturë','Aventurë','Ushqim & Kuzhine'];

export default function BlogPage() {
 const hero = useHeroMedia('blog', {
 media_type:'image',
 url:'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=1920',
 overlay_opacity: 0.65,
});
 const [posts, setPosts] = useState<BlogPost[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [activeCategory, setActiveCategory] = useState('All');

 useEffect(() => {
 loadPosts();
}, []);

 const loadPosts = async () => {
 try {
 const { data, error} = await supabase
 .from('blog_posts')
 .select('id, title, slug, excerpt, cover_image, author_name, category, tags, published_at')
 .eq('status','published')
 .order('published_at', { ascending: false});

 if (error) throw error;
 setPosts(data || []);
} catch (err) {
 console.error('Error loading blog posts:', err);
} finally {
 setLoading(false);
}
};

 const filtered = posts.filter((p) => {
 const matchSearch =
 !search ||
 p.title.toLowerCase().includes(search.toLowerCase()) ||
 p.excerpt.toLowerCase().includes(search.toLowerCase());
 const matchCategory = activeCategory ==='All' || p.category === activeCategory;
 return matchSearch && matchCategory;
});

 const featured = filtered[0];
 const rest = filtered.slice(1);

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
 <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400 mb-4">Editorial</p>
 <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">Revista & Njohuri</h1>
 <p className="text-white/60 max-w-xl leading-relaxed text-base font-light">
 Analiza të thelluara të destinacioneve, informacion udhëtimor dhe raporte nga terreni, të shkruara nga konsulentët tanë të lartë dhe specialistët në vend.
 </p>
 </div>
 </section>

 {/* SEARCH + FILTER BAR */}
 <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
 <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
 <div className="relative flex-1 max-w-sm">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
 <input
 type="text"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Kërko artikuj..."
 className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 bg-white focus:outline-none focus:border-gray-900 transition-colors"
 />
 </div>
 <div className="flex gap-2 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-hide">
 {CATEGORIES.map((cat) => (
 <button
 key={cat}
 onClick={() => setActiveCategory(cat)}
 className={`flex-shrink-0 px-4 py-2 text-xs font-semibold transition uppercase tracking-wide ${
 activeCategory === cat
 ?'bg-gray-900 text-white'
 :'bg-gray-100 text-gray-600 hover:bg-gray-200'
}`}
 >
 {cat}
 </button>
 ))}
 </div>
 </div>
 </div>

 <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

 {/* COUNT */}
 {!loading && (
 <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
 <p className="text-sm text-gray-500">
 {filtered.length === 0
 ?'No articles match your filters'
 :`${filtered.length} article${filtered.length !== 1 ?'s' :''}${activeCategory !=='All' ?` in ${activeCategory}` :''}`}
 </p>
 {(search || activeCategory !=='All') && (
 <button
 onClick={() => { setSearch(''); setActiveCategory('All');}}
 className="text-xs text-red-600 font-semibold hover:text-red-700 transition"
 >
 Clear filters
 </button>
 )}
 </div>
 )}

 {loading ? (
 <div className="flex items-center justify-center py-24">
 <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-gray-900" />
 </div>
 ) : filtered.length === 0 ? (
 <div className="text-center py-20 bg-white border border-gray-200">
 <BookOpen className="h-8 w-8 mx-auto mb-4 text-gray-300" />
 <h3 className="text-base font-bold text-gray-800 mb-1">Nuk u gjetën artikuj</h3>
 <p className="text-sm text-gray-400 max-w-sm mx-auto">
 {posts.length === 0
 ?'Our editorial team is preparing content. Check back soon.'
 :'Try adjusting your search terms or selecting a different category.'}
 </p>
 </div>
 ) : (
 <>
 {/* FEATURED */}
 {featured && (
 <Link
 to={`/blog/${featured.slug}`}
 className="block mb-12 bg-white border border-gray-200 overflow-hidden hover:border-gray-400 transition group"
 >
 <div className="grid grid-cols-1 lg:grid-cols-5">
 <div className="relative lg:col-span-3 h-72 lg:h-auto overflow-hidden">
 <img
 src={featured.cover_image ||'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=800'}
 alt={featured.title}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
 />
 <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
 <div className="absolute top-4 left-4">
 <span className="bg-gray-900 text-white text-xs px-3 py-1.5 font-bold uppercase tracking-wider">
Të fundit
 </span>
 </div>
 </div>
 <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col justify-between">
 <div>
 <span className="inline-block text-xs font-bold text-red-600 uppercase tracking-widest mb-4 border-b-2 border-red-600 pb-0.5">
 {featured.category}
 </span>
 <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition leading-snug tracking-tight">
 {featured.title}
 </h2>
 <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">{featured.excerpt}</p>
 </div>
 <div className="mt-6 pt-5 border-t border-gray-100">
 <div className="flex items-center justify-between">
 <div className="flex flex-col gap-1 text-xs text-gray-400">
 <span className="flex items-center gap-1.5">
 <User className="h-3 w-3" />
 {featured.author_name}
 </span>
 {featured.published_at && (
 <span className="flex items-center gap-1.5">
 <Calendar className="h-3 w-3" />
 {new Date(featured.published_at).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric'})}
 </span>
 )}
 </div>
 <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 group-hover:gap-2.5 transition-all uppercase tracking-wide">
 Read <ArrowRight className="h-4 w-4" />
 </span>
 </div>
 </div>
 </div>
 </div>
 </Link>
 )}

 {/* GRID */}
 {rest.length > 0 && (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
 {rest.map((post) => (
 <Link
 key={post.id}
 to={`/blog/${post.slug}`}
 className="bg-white overflow-hidden group flex flex-col"
 >
 <div className="relative h-48 overflow-hidden flex-shrink-0">
 <img
 src={post.cover_image ||'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=600'}
 alt={post.title}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
 </div>
 <div className="p-5 flex flex-col flex-1">
 <span className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3 border-b border-red-100 pb-2 w-fit">
 {post.category}
 </span>
 <h3 className="font-bold text-gray-900 mb-2.5 group-hover:text-red-600 transition leading-snug line-clamp-2 text-[15px]">
 {post.title}
 </h3>
 <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
 <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
 <div className="flex flex-col gap-0.5 text-xs text-gray-400">
 <span className="flex items-center gap-1">
 <User className="h-3 w-3" />{post.author_name}
 </span>
 {post.published_at && (
 <span className="flex items-center gap-1">
 <Calendar className="h-3 w-3" />
 {new Date(post.published_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric'})}
 </span>
 )}
 </div>
 <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
 </div>
 </div>
 </Link>
 ))}
 </div>
 )}
 </>
 )}
 </div>

 {/* EDITORIAL NOTE */}
 <div className="bg-white border-t border-gray-200 py-20">
 <div className="max-w-7xl mx-auto px-6 lg:px-8">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

 <div className="md:col-span-2">
 <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-600 mb-4">Standarde Redaksionale</p>
 <h2 className="text-3xl font-bold text-gray-900 mb-5 leading-tight tracking-tight">
 Si prodhohet përmbajtja jonë

 </h2>
 <p className="text-gray-500 text-sm leading-relaxed mb-4">
 Të gjithë artikujt e publikuar në këtë revistë janë hulumtuar, shkruar dhe rishikuar nga konsulentët tanë të lartë të udhëtimeve dhe specialistët e destinacioneve. Përmbajtja bazohet në përvojë direkte nga terreni, burime të verifikuara nga palë të treta dhe partneritete me operatorë lokalë. Nuk publikojmë përmbajtje të sponsorizuar pa zbardhje të qartë.
 </p>
 <p className="text-gray-500 text-sm leading-relaxed">
Kushtet e destinacionit, kërkesat për hyrje dhe detajet operative ndryshojnë shpesh. Edhe pse përmbajtja jonë përditësohet rregullisht, lexuesve u rekomandohet të verifikojnë informacionin e ndjeshëm ndaj kohës direkt me ambasadën, linjën ajrore ose ofruesin e shërbimit përpara udhëtimit.
 </p>
 </div>

 <div className="border border-gray-200">
 {[
 { label:'Shkruar nga', value:'Konsulentë të lartë udhëtimesh me përvojë nga terreni'},
 { label:'Rishikuar nga', value:'Specialistë të destinacioneve dhe menaxherë operacionesh'},
 { label:'Frekuenca e përditësimit', value:'Përmbajtja rishikohet vazhdimisht'},
 { label:'Sponsored content', value:'Disclosed explicitly. Most content is independent.'},
 ].map(({ label, value}, i, arr) => (
 <div key={label} className={`p-5 ${i < arr.length - 1 ?'border-b border-gray-200' :''}`}>
 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
 <p className="text-sm text-gray-700 font-medium leading-snug">{value}</p>
 </div>
 ))}
 </div>

 </div>
 </div>
 </div>

 </div>
 );
}
