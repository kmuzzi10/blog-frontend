import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../components/ui/Button';
import { ClayCard } from '../components/ui/ClayCard';
import { Badge } from '../components/ui/Badge';
import { Search as SearchIcon, Loader2, MessageSquare } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
}

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  featuredImage?: string;
  readTime: number;
  commentCount?: number;
  createdAt: string;
  category?: {
    _id: string;
    name: string;
  };
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
}

export function Search() {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${baseUrl}/categories?limit=20`);
      const json = await response.json();
      if (json.success) setCategories(json.data);
    } catch (err) {
      console.error('Categories fetch error:', err);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      const url = new URL(`${baseUrl}/posts`);
      url.searchParams.append('status', 'Published');
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', '9');
      if (query) url.searchParams.append('search', query);
      if (activeCategory) url.searchParams.append('categoryId', activeCategory);

      const response = await fetch(url.toString());
      const json = await response.json();
      if (json.success) {
        setPosts(json.data);
        if (json.meta) {
          setTotalPages(json.meta.totalPages);
        }
      }
    } catch (err) {
      console.error('Posts fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 500);
    return () => clearTimeout(timer);
  }, [query, activeCategory, page]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500 min-h-[60vh] py-8 px-4">
      {/* Search Header */}
      <div className="text-center space-y-6 sm:space-y-8 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Explore Stories</h1>
        <div className="max-w-2xl mx-auto relative group">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-all" size={20} />
          <input 
            type="text"
            className="w-full bg-background rounded-full pl-14 sm:pl-16 pr-6 sm:pr-8 py-4 sm:py-5 text-base sm:text-lg font-medium shadow-clay-inset focus:outline-none focus:shadow-clay-inset-hover transition-all placeholder:text-gray-400 border-0"
            placeholder="Search by title, tag, or author..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 w-full hide-scrollbar">
          <Button 
            variant={!activeCategory ? 'primary' : 'ghost'} 
            size="sm" 
            className="rounded-full !px-6 whitespace-nowrap"
            onClick={() => {
              setActiveCategory('');
              setPage(1);
            }}
          >
            All Categories
          </Button>
          {categories.map((cat) => (
            <Button 
              key={cat._id} 
              variant={activeCategory === cat._id ? 'primary' : 'ghost'} 
              size="sm" 
              className="rounded-full !px-5 whitespace-nowrap"
              onClick={() => {
                setActiveCategory(cat._id);
                setPage(1);
              }}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {loading && posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
           <Loader2 className="animate-spin text-primary mb-4" size={48} />
           <p className="text-gray-400 font-bold tracking-widest uppercase">Searching Universe...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? posts.map(post => (
            <Link key={post._id} to={`/post/${post._id}`}>
              <ClayCard interactive padding="sm" className="h-full flex flex-col gap-4 group hover:shadow-clay-hover pointer-events-auto">
                <div className="w-full h-48 rounded-2xl overflow-hidden shadow-clay-inset relative">
                   <img 
                    src={post.featuredImage || post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  {post.category && (
                    <Badge variant="accent" className="absolute top-4 left-4 shadow-clay">{post.category.name}</Badge>
                  )}
                </div>
                <div className="px-4 pb-4 space-y-2">
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-bold px-1">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full shadow-clay-inset">
                      <MessageSquare size={12} className="text-primary/60" />
                      <span>{post.commentCount || 0}</span>
                    </div>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{post.readTime} min read</span>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 px-1">
                      {post.tags.slice(0, 3).map(tag => (
                         <span key={tag} className="text-[10px] font-bold text-primary/60 hover:text-primary transition-colors cursor-pointer">#{tag}</span>
                      ))}
                    </div>
                  )}
                  <h3 className="font-bold text-gray-800 text-xl line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  
                  {/* Author Info */}
                  <div className="pt-4 mt-auto flex items-center gap-3 border-t border-gray-100/50">
                    <div className="w-8 h-8 rounded-full shadow-clay border border-white overflow-hidden bg-gray-50">
                      <img src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.name}&background=random`} alt={post.author.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">{post.author.name}</span>
                  </div>
                </div>
              </ClayCard>
            </Link>
          )) : (
            <div className="col-span-full text-center py-20 text-gray-400 font-medium text-xl shadow-clay-inset rounded-[3rem] bg-white/50">
              No stories found matching your criteria.
            </div>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button 
            variant="ghost" 
            className="rounded-full shadow-clay disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </Button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${
                  page === num 
                    ? 'bg-primary text-white shadow-clay scale-110' 
                    : 'bg-background text-gray-500 shadow-clay-inset hover:shadow-clay'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <Button 
            variant="ghost" 
            className="rounded-full shadow-clay disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

