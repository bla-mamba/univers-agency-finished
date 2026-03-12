import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, ArrowRight, Tag, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author_name: string;
  category: string;
  tags: string[];
  published_at: string;
}

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) loadPost(slug);
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', postSlug)
        .eq('status', 'published')
        .maybeSingle();

      if (error) throw error;
      if (!data) { setNotFound(true); return; }
      setPost(data);

      const { data: relatedData } = await supabase
        .from('blog_posts')
        .select('id, title, slug, cover_image, category, published_at, author_name, excerpt')
        .eq('status', 'published')
        .eq('category', data.category)
        .neq('id', data.id)
        .limit(3);

      setRelated(relatedData || []);
    } catch (err) {
      console.error('Error loading post:', err);
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

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Article not found</h2>
        <p className="text-sm text-gray-400 mb-6">The article you are looking for may have been moved or unpublished.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* COVER IMAGE */}
      <div className="relative h-[480px] overflow-hidden">
        <img
          src={post.cover_image || 'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=1920'}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-black/80" />

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10">
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-semibold mb-5 transition tracking-wide">
              <ArrowLeft className="h-3.5 w-3.5" /> Journal & Insights
            </Link>
            <span className="inline-block text-xs font-bold text-white uppercase tracking-widest mb-4 border-b-2 border-red-500 pb-0.5">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-5 text-xs text-gray-300">
              <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{post.author_name}</span>
              {post.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ARTICLE BODY */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <article className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 md:p-12">

          {/* EXCERPT / STANDFIRST */}
          <p className="text-lg text-gray-700 leading-relaxed mb-8 font-medium border-l-4 border-red-500 pl-6 py-1">
            {post.excerpt}
          </p>

          {/* BODY CONTENT */}
          <div
            className="text-gray-700 text-[15px] leading-[1.85] whitespace-pre-wrap"
          >
            {post.content}
          </div>

          {/* TAGS */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-8 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Tag className="h-3 w-3" /> Filed under
              </p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* DISCLAIMER */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-100  p-4">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-semibold">Editorial notice:</span> Information in this article reflects conditions at the time of publication. Entry requirements, visa policies, operating hours, and pricing are subject to change. Verify current details with the relevant embassy, operator, or service provider before travel.
              </p>
            </div>
          </div>

        </article>

        {/* RELATED ARTICLES */}
        {related.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-red-600 mb-1">More Reading</p>
                <h2 className="text-xl font-bold text-gray-900">Related in {post.category}</h2>
              </div>
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 transition"
              >
                All articles <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/blog/${r.slug}`}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition group flex flex-col"
                >
                  <div className="h-44 overflow-hidden flex-shrink-0">
                    <img
                      src={r.cover_image || 'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2 border-b border-red-100 pb-1.5 w-fit">
                      {r.category}
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-red-600 transition leading-snug line-clamp-2 flex-1">
                      {r.title}
                    </h3>
                    {r.published_at && (
                      <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(r.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
