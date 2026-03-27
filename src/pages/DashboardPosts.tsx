import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClayCard } from '../components/ui/ClayCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { Search as SearchIcon, Edit, Trash2, ChevronLeft, ChevronRight, Loader2, ExternalLink } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  status: string;
  category?: { name: string };
  createdAt: string;
  author?: { name: string; avatar: string };
}

export function DashboardPosts() {
  const { role, token } = useAuth();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const limit = 10;

  const fetchPosts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      // If admin, they might want all posts, but user asked for "posts/me" integration specifically
      const endpoint = role === 'Admin' ? '/posts' : '/posts/me';
      const url = new URL(`${baseUrl}${endpoint}`);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', limit.toString());
      if (search) url.searchParams.append('search', search);

      const response = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await response.json();
      if (json.success) {
        setPosts(json.data);
        setTotal(json.meta.total);
      }
    } catch (err) {
      console.error('Error fetching dashboard posts:', err);
    } finally {
      setLoading(false);
    }
  }, [token, role, page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchPosts]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this story forever?')) return;
    
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${baseUrl}/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await response.json();
      if (json.success) {
        fetchPosts(); // Refresh list
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100/50 pb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
             Story Management
          </h1>
          <p className="text-gray-500 font-medium mt-2">Manage, filter, and analyze your published stories.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full md:w-80">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
            <input 
              type="text"
              className="w-full bg-white rounded-2xl pl-12 pr-6 py-3.5 text-sm shadow-clay border-2 border-transparent focus:border-primary-light focus:outline-none transition-all placeholder:text-gray-300 font-bold"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset to page 1 for new search
              }}
            />
          </div>
          <Link to="/post/create">
            <Button className="h-full shadow-clay px-8 font-black uppercase text-xs tracking-widest">Create New Story</Button>
          </Link>
        </div>
      </div>

      <ClayCard padding="none" className="overflow-hidden bg-white/50 backdrop-blur-sm border-2 border-white shadow-clay-hover">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100/50">
                <th className="p-6 font-black text-gray-400 text-[10px] uppercase tracking-widest">Post Content</th>
                {role === 'Admin' && <th className="p-6 font-black text-gray-400 text-[10px] uppercase tracking-widest">Author</th>}
                <th className="p-6 font-black text-gray-400 text-[10px] uppercase tracking-widest">Status</th>
                <th className="p-6 font-black text-gray-400 text-[10px] uppercase tracking-widest">Analytics</th>
                <th className="p-6 font-black text-gray-400 text-[10px] uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50">
              {loading && !posts.length ? (
                <tr>
                   <td colSpan={role === 'Admin' ? 5 : 4} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                         <Loader2 className="animate-spin text-primary" size={32} />
                         <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Syncing with database...</span>
                      </div>
                   </td>
                </tr>
              ) : posts.map(post => (
                <tr key={post._id} className="hover:bg-white transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-clay-inset border-2 border-white bg-gray-100 flex-shrink-0">
                        <img src={post.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=200'} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <Link to={`/post/${post._id}`} className="font-extrabold text-gray-800 line-clamp-1 group-hover:text-primary transition-colors text-lg">{post.title}</Link>
                        <div className="flex items-center gap-2 mt-1">
                           <Badge variant="gray" className="!text-[9px] !px-2.5 !py-1 uppercase font-black border-transparent shadow-clay-inset">{post.category?.name || 'Uncategorized'}</Badge>
                           <span className="text-[10px] font-black text-gray-300 uppercase">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  {role === 'Admin' && (
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <img src={post.author?.avatar} alt={post.author?.name} className="w-8 h-8 rounded-full shadow-clay-inset border border-white" />
                        <span className="text-sm font-bold text-gray-700">{post.author?.name}</span>
                      </div>
                    </td>
                  )}
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      post.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="p-6">
                     <div className="flex items-center gap-4 text-gray-400">
                        <div className="flex flex-col">
                           <span className="text-xs font-black text-gray-700">0</span>
                           <span className="text-[8px] font-black uppercase tracking-widest">Views</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs font-black text-gray-700">0</span>
                           <span className="text-[8px] font-black uppercase tracking-widest">Feedback</span>
                        </div>
                     </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                        onClick={() => navigate(`/post/${post._id}`)}
                        className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:shadow-clay transition-all hover:text-primary"
                        title="View Public Link"
                       >
                          <ExternalLink size={18} />
                       </button>
                       <Link to={`/post/edit/${post._id}`}>
                          <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:shadow-clay transition-all hover:text-secondary" title="Edit Post">
                             <Edit size={18} />
                          </button>
                       </Link>
                       <button 
                        onClick={() => handleDelete(post._id)}
                        className="p-2.5 bg-gray-50 text-red-400 rounded-xl hover:shadow-clay transition-all hover:bg-red-50"
                        title="Delete Post"
                       >
                          <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-24 text-center">
                     <div className="max-w-xs mx-auto">
                        <p className="text-lg font-black text-gray-300 uppercase italic">Silence in the library.</p>
                        <p className="text-gray-400 mt-2">No posts match your filters or you haven't written any stories yet.</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="p-6 bg-gray-50/50 border-t border-gray-100/50 flex items-center justify-between">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Showing page {page} of {totalPages} ({total} Total)
            </p>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="bg-white shadow-clay !rounded-xl !p-3 disabled:opacity-30"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={20} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="bg-white shadow-clay !rounded-xl !p-3 disabled:opacity-30"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>
        )}
      </ClayCard>
    </div>
  );
}
