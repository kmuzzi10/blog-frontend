import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClayCard } from '../components/ui/ClayCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ArrowRight, Flame, Loader2, MessageSquare } from 'lucide-react';
import { cn } from '../components/ui/Button';

interface Category {
  _id: string;
  name: string;
  slug: string;
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
  tags: string[];
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

export function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  const fetchCategories = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${baseUrl}/categories?limit=20`);
      const json = await response.json();
      if (json.success) setCategories(json.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      let url = `${baseUrl}/posts?status=Published&limit=10`;
      if (activeCategory !== 'All') {
        url += `&categoryId=${activeCategory}`;
      }
      const response = await fetch(url);
      const json = await response.json();
      if (json.success) setPosts(json.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [activeCategory]);

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-gray-400 font-bold tracking-widest uppercase">Loading Stories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section / Featured Post */}
      {featuredPost && (
        <section>
          <ClayCard padding="lg" interactive className="flex flex-col lg:flex-row gap-8 items-center relative overflow-hidden group p-6 sm:p-10">
            <div className="lg:w-1/2 space-y-4 sm:space-y-6 relative z-10 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <Badge variant="accent">Featured Post</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 tracking-tight">
                {featuredPost.title}
              </h1>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                <Link to={`/post/${featuredPost._id}`} className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="rounded-full shadow-clay text-sm px-8 w-full">Read Story <ArrowRight size={18} className="ml-2" /></Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 relative z-10 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-clay h-60 sm:h-80 md:h-96 w-full group-hover:shadow-clay-hover transition-all duration-500 border-4 border-white/50">
              <img 
                src={featuredPost.featuredImage || featuredPost.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200'} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
              />
            </div>
          </ClayCard>
        </section>
      )}

      {/* Categories Filter */}
      <section className="flex items-center gap-4 overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        <div className="flex items-center gap-3 p-2 rounded-full border-2 border-white/50 shadow-clay-badge bg-white/30 backdrop-blur-sm min-w-max">
          <Button 
            variant={activeCategory === 'All' ? 'primary' : 'ghost'} 
            size="sm" 
            className={cn(
              "rounded-full !px-8 font-black uppercase text-[10px] tracking-widest transition-all",
              activeCategory === 'All' && "shadow-clay"
            )}
            onClick={() => setActiveCategory('All')}
          >
            All Stories
          </Button>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          {categories.map((cat) => (
            <Button 
              key={cat._id} 
              variant={activeCategory === cat._id ? 'primary' : 'ghost'} 
              size="sm" 
              className={cn(
                "rounded-full !px-6 whitespace-nowrap font-bold text-sm transition-all",
                activeCategory === cat._id && "shadow-clay"
              )}
              onClick={() => setActiveCategory(cat._id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </section>

      {/* Grid Posts */}
      <section>
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-secondary/10 p-2 rounded-xl shadow-clay-inset">
            <Flame className="text-secondary" size={24} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Trending Stories</h2>
        </div>
        
        {recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {recentPosts.map(post => (
              <Link key={post._id} to={`/post/${post._id}`}>
                <ClayCard interactive className="h-full flex flex-col items-start gap-4 p-6 hover:shadow-clay-hover pointer-events-auto border border-transparent hover:border-white/50 transition-all group">
                  <div className="w-full h-52 rounded-3xl overflow-hidden shadow-clay-inset mb-2 relative">
                    <img 
                      src={post.featuredImage || post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800'} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    {post.category && (
                      <Badge variant="secondary" className="absolute top-4 left-4 shadow-clay !bg-white/90 backdrop-blur-sm border-0">{post.category.name}</Badge>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 overflow-hidden h-6">
                      {post.tags.slice(0, 3).map(tag => (
                         <span key={tag} className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-tighter">#{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 w-full px-1">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full shadow-clay-inset">
                      <MessageSquare size={12} className="text-primary/60" />
                      <span className="text-xs text-gray-500 font-bold">{post.commentCount || 0}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-bold ml-auto">{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{post.readTime} min read</span>
                  </div>


                  <h3 className="font-bold text-gray-800 text-xl line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-gray-500 font-medium line-clamp-2 mb-4 leading-relaxed">{post.excerpt}</p>
                  
                  <div className="mt-auto flex items-center gap-3 pt-6 border-t border-gray-100/50 w-full">
                    <div className="shrink-0 w-11 h-11 h- rounded-full shadow-clay border-2 border-white overflow-hidden bg-gray-50">
                      <img src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.name}&background=random`} alt={post.author.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-800 leading-none">{post.author.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Author</p>
                    </div>
                  </div>
                </ClayCard>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-background shadow-clay-inset rounded-[3rem] border-2 border-white/50">
             <p className="text-xl font-bold text-gray-400 italic">No stories found in this category yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}

