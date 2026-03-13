import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit, Trash2, Eye, EyeOff, Search, X, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface BlogPost {
 id: string;
 title: string;
 slug: string;
 excerpt: string;
 content: string;
 cover_image: string;
 author_name: string;
 category: string;
 status: 'draft' | 'published';
 published_at: string | null;
 created_at: string;
}

const CATEGORIES = ['Travel Tips', 'Destination Guides', 'Top Lists', 'Culture', 'Adventure', 'Food & Cuisine'];

const emptyForm = {
 title: '', slug: '', excerpt: '', content: '', cover_image: '',
 author_name: 'Univers Travel Agency Team', category: 'Travel Tips', status: 'draft' as const,
};

export default function BlogManagement() {
 const [posts, setPosts] = useState<BlogPost[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [modal, setModal] = useState(false);
 const [editPost, setEditPost] = useState<BlogPost | null>(null);
 const [form, setForm] = useState(emptyForm);
 const [saving, setSaving] = useState(false);
 const [error, setError] = useState('');

 useEffect(() => { loadPosts(); }, []);

 const loadPosts = async () => {
 const { data } = await supabase
 .from('blog_posts')
 .select('*')
 .order('created_at', { ascending: false });
 setPosts(data || []);
 setLoading(false);
 };

 const openCreate = () => {
 setEditPost(null);
 setForm(emptyForm);
 setError('');
 setModal(true);
 };

 const openEdit = (post: BlogPost) => {
 setEditPost(post);
 setForm({
 title: post.title,
 slug: post.slug,
 excerpt: post.excerpt,
 content: post.content,
 cover_image: post.cover_image,
 author_name: post.author_name,
 category: post.category,
 status: post.status,
 });
 setError('');
 setModal(true);
 };

 const generateSlug = (title: string) =>
 title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

 const handleSave = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!form.title.trim()) { setError('Title is required.'); return; }
 setSaving(true);
 setError('');
 try {
 const slug = form.slug || generateSlug(form.title);
 const payload = {
 title: form.title.trim(),
 slug,
 excerpt: form.excerpt.trim(),
 content: form.content.trim(),
 cover_image: form.cover_image.trim(),
 author_name: form.author_name.trim(),
 category: form.category,
 status: form.status,
 published_at: form.status === 'published' ? (editPost?.published_at || new Date().toISOString()) : null,
 updated_at: new Date().toISOString(),
 };

 if (editPost) {
 await supabase.from('blog_posts').update(payload).eq('id', editPost.id);
 } else {
 await supabase.from('blog_posts').insert(payload);
 }
 setModal(false);
 loadPosts();
 } catch (err: any) {
 setError(err.message || 'Failed to save post.');
 } finally {
 setSaving(false);
 }
 };

 const toggleStatus = async (post: BlogPost) => {
 const newStatus = post.status === 'published' ? 'draft' : 'published';
 await supabase.from('blog_posts').update({
 status: newStatus,
 published_at: newStatus === 'published' ? new Date().toISOString() : null,
 }).eq('id', post.id);
 loadPosts();
 };

 const deletePost = async (id: string) => {
 if (!confirm('Delete this blog post?')) return;
 await supabase.from('blog_posts').delete().eq('id', id);
 loadPosts();
 };

 const filtered = posts.filter((p) =>
 !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
 );

 return (
 <div className="p-8">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
 <p className="text-gray-500 mt-1">{posts.length} posts</p>
 </div>
 <button
 onClick={openCreate}
 className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 font-semibold hover:bg-red-700 transition text-sm"
 >
 <Plus className="h-4 w-4" /> New Post
 </button>
 </div>

 <div className="bg-white shadow-sm overflow-hidden">
 <div className="p-4 border-b border-gray-100">
 <div className="relative max-w-sm">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
 <input
 type="text"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Search posts..."
 className="w-full pl-9 pr-4 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
 />
 </div>
 </div>

 {loading ? (
 <div className="flex items-center justify-center py-16">
 <div className="animate-spin h-8 w-8 border-b-2 border-red-600" />
 </div>
 ) : (
 <table className="w-full">
 <thead className="bg-gray-50 border-b border-gray-100">
 <tr>
 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Author</th>
 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
 <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100">
 {filtered.length === 0 ? (
 <tr>
 <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
 {search ? 'No posts match your search.' : 'No blog posts yet. Create your first one!'}
 </td>
 </tr>
 ) : filtered.map((post) => (
 <tr key={post.id} className="hover:bg-gray-50 transition">
 <td className="px-6 py-4">
 <p className="font-medium text-gray-900 text-sm">{post.title}</p>
 <p className="text-xs text-gray-400 mt-0.5">/blog/{post.slug}</p>
 </td>
 <td className="px-6 py-4 text-sm text-gray-600">{post.category}</td>
 <td className="px-6 py-4 text-sm text-gray-600">{post.author_name}</td>
 <td className="px-6 py-4">
 <span className={`px-2.5 py-1 text-xs font-semibold ${
 post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
 }`}>
 {post.status}
 </span>
 </td>
 <td className="px-6 py-4 text-sm text-gray-500">
 {new Date(post.created_at).toLocaleDateString()}
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center justify-end gap-2">
 <button
 onClick={() => toggleStatus(post)}
 className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 transition"
 title={post.status === 'published' ? 'Unpublish' : 'Publish'}
 >
 {post.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
 </button>
 <button onClick={() => openEdit(post)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition">
 <Edit className="h-4 w-4" />
 </button>
 <button onClick={() => deletePost(post.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 transition">
 <Trash2 className="h-4 w-4" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>

 {modal && (
 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
 <div className="bg-white shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
 <div className="p-6 border-b border-gray-100 flex items-center justify-between">
 <h2 className="text-xl font-bold text-gray-900">{editPost ? 'Edit Post' : 'New Blog Post'}</h2>
 <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600 transition">
 <X className="h-6 w-6" />
 </button>
 </div>
 <form onSubmit={handleSave} className="p-6 space-y-4">
 <div className="grid grid-cols-2 gap-4">
 <div className="col-span-2">
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
 <input
 type="text"
 required
 value={form.title}
 onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: generateSlug(e.target.value) }))}
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
 <input
 type="text"
 value={form.slug}
 onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Author</label>
 <input
 type="text"
 value={form.author_name}
 onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
 <select
 value={form.category}
 onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
 >
 {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
 </select>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
 <select
 value={form.status}
 onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'draft' | 'published' }))}
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
 >
 <option value="draft">Draft</option>
 <option value="published">Published</option>
 </select>
 </div>
 <div className="col-span-2">
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image URL</label>
 <input
 type="url"
 value={form.cover_image}
 onChange={(e) => setForm((f) => ({ ...f, cover_image: e.target.value }))}
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
 placeholder="https://..."
 />
 </div>
 <div className="col-span-2">
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt</label>
 <textarea
 rows={2}
 value={form.excerpt}
 onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
 placeholder="Short description..."
 />
 </div>
 <div className="col-span-2">
 <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
 <textarea
 rows={8}
 value={form.content}
 onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
 className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none font-mono"
 placeholder="Full article content..."
 />
 </div>
 </div>

 {error && <p className="text-red-600 text-sm">{error}</p>}

 <div className="flex gap-3 pt-2">
 <button
 type="submit"
 disabled={saving}
 className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 font-semibold hover:bg-red-700 transition disabled:opacity-60 text-sm"
 >
 <Check className="h-4 w-4" />
 {saving ? 'Saving...' : editPost ? 'Update Post' : 'Create Post'}
 </button>
 <button type="button" onClick={() => setModal(false)} className="px-6 py-2.5 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
 Cancel
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
}
