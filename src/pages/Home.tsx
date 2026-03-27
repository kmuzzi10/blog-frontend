import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClayCard } from '../components/ui/ClayCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ArrowRight, Flame, Loader2, MessageSquare, Sparkles, Gamepad2 } from 'lucide-react';
import { cn } from '../components/ui/Button';
import { ThreeDCard } from '../components/ui/ThreeDCard';
import { IdeaCatcherGame } from '../components/ui/IdeaCatcherGame';
import { motion } from 'framer-motion';

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
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Hero Section / Featured Post */}
        {featuredPost && (
          <section className="pt-8 px-4">
            <ThreeDCard>
              <ClayCard padding="lg" interactive className="flex flex-col lg:flex-row gap-8 items-center relative overflow-hidden group p-6 sm:p-10 border-4 border-white/80 bg-white/40 backdrop-blur-md">
                <div className="lg:w-1/2 space-y-4 sm:space-y-6 relative z-10 text-center lg:text-left">
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center lg:justify-start"
                  >
                    <Badge variant="accent" className="shadow-clay uppercase tracking-widest px-4 py-1 border-0">Featured Article</Badge>
                  </motion.div>
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 tracking-tight"
                  >
                    {featuredPost.title}
                  </motion.h1>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 text-base sm:text-lg leading-relaxed line-clamp-3"
                  >
                    {featuredPost.excerpt}
                  </motion.p>
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center lg:justify-start gap-4 pt-4"
                  >
                    <Link to={`/post/${featuredPost._id}`} className="w-full sm:w-auto">
                      <Button variant="primary" size="lg" className="rounded-full shadow-clay text-sm px-8 w-full group/btn relative overflow-hidden">
                        <span className="relative z-10 flex items-center">Read Full Story <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" /></span>
                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
                <div className="lg:w-1/2 relative z-10 rounded-[2.5rem] overflow-hidden shadow-clay h-72 sm:h-80 md:h-[28rem] w-full group-hover:shadow-clay-hover transition-all duration-700 border-8 border-white group-hover:border-primary/20">
                  <img 
                    src={featuredPost.featuredImage || featuredPost.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200'} 
                    alt={featuredPost.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
              </ClayCard>
            </ThreeDCard>
          </section>
        )}

        {/* Interactive Game Section - Eyecatching 3D Game Widget */}
        <section className="py-12 relative overflow-hidden">
           <div className="absolute inset-0 bg-primary/5 -skew-y-3 pointer-events-none transform origin-left scale-110" />
           <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto px-4 relative z-10">
              <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
                 <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-clay border-2 border-primary/20">
                    <Gamepad2 className="text-primary animate-bounce" size={24} />
                    <span className="font-black text-gray-800 uppercase tracking-widest text-xs">Unlock Rewards</span>
                 </div>
                 <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">Bored? Catch Some <span className="text-primary">Insights!</span></h2>
                 <p className="text-lg text-gray-600 font-medium leading-relaxed">Play our mini-game to sharpen your focus. Reach a score of 20 to earn the <span className="text-accent font-black">Insight Master</span> badge for your profile!</p>
                 <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                    <div className="flex items-center -space-x-3">
                       {[1,2,3,4].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-4 border-white shadow-clay bg-gray-200 overflow-hidden">
                             <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Player" />
                          </div>
                       ))}
                       <div className="w-10 h-10 rounded-full border-4 border-white shadow-clay bg-primary flex items-center justify-center text-[10px] text-white font-bold">+500</div>
                    </div>
                    <span className="text-sm font-bold text-gray-400">Join 500+ players today!</span>
                 </div>
              </div>
              <div className="lg:w-1/2 w-full flex justify-center px-4">
                  <IdeaCatcherGame />
              </div>
           </div>
        </section>

        {/* Categories Filter */}
        <section className="flex flex-col items-center gap-8 px-4">
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-full shadow-clay border border-white max-w-full overflow-x-auto scrollbar-hide">
             <div className="flex items-center gap-3 min-w-max">
                <Button 
                  variant={activeCategory === 'All' ? 'primary' : 'ghost'} 
                  size="sm" 
                  className={cn(
                    "rounded-full !px-8 font-black uppercase text-[10px] tracking-widest transition-all",
                    activeCategory === 'All' && "shadow-clay"
                  )}
                  onClick={() => setActiveCategory('All')}
                >
                  All Hubs
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
          </div>
        </section>

        {/* Grid Posts with 3D effects */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/10 p-3 rounded-2xl shadow-clay-inset">
                <Flame className="text-secondary" size={28} />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-gray-900 tracking-tight">Trending Now</h2>
                 <p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1"><Sparkles size={14} className="text-accent" /> Popular picks</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <Link to="/search">
                <Button variant="ghost" className="font-bold text-gray-400 hover:text-primary transition-colors">View All <ArrowRight size={16} className="ml-2" /></Button>
              </Link>
            </div>
          </div>
          
          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {recentPosts.map((post, idx) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <ThreeDCard>
                    <Link to={`/post/${post._id}`} className="block h-full">
                      <ClayCard interactive className="h-full flex flex-col items-start gap-4 p-6 hover:shadow-clay-hover border-4 border-white/50 bg-white/40 backdrop-blur-md transition-all group rounded-[2.5rem]">
                        <div className="w-full h-60 rounded-[2rem] overflow-hidden shadow-clay-inset mb-2 relative border-4 border-white">
                          <img 
                            src={post.featuredImage || post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800'} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                          {post.category && (
                            <Badge variant="secondary" className="absolute top-4 left-4 shadow-clay !bg-white/90 backdrop-blur-md border-0 uppercase font-black text-[10px]">{post.category.name}</Badge>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-4 right-4 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                             <div className="bg-white p-2 rounded-full shadow-clay border border-gray-100">
                                <ArrowRight size={20} className="text-primary" />
                             </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 w-full">
                          {post.tags && post.tags.slice(0, 2).map(tag => (
                             <span key={tag} className="text-[10px] font-black text-primary/80 bg-primary/5 border border-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">#{tag}</span>
                          ))}
                        </div>

                        <h3 className="font-extrabold text-gray-900 text-2xl line-clamp-2 group-hover:text-primary transition-colors leading-tight">{post.title}</h3>
                        <p className="text-gray-500 font-medium line-clamp-2 mb-4 leading-relaxed">{post.excerpt}</p>
                        
                        <div className="mt-auto flex items-center justify-between w-full pt-6 border-t border-gray-100/30">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full shadow-clay border-2 border-white overflow-hidden bg-gray-50">
                              <img src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.name}&background=random`} alt={post.author.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-gray-800 leading-none">{post.author.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Curator</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1.5 rounded-full shadow-clay border border-white">
                            <MessageSquare size={14} className="text-primary" />
                            <span className="text-xs font-black text-gray-700">{post.commentCount || 0}</span>
                          </div>
                        </div>
                      </ClayCard>
                    </Link>
                  </ThreeDCard>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-white/30 backdrop-blur-md shadow-clay-inset rounded-[4rem] border-4 border-white">
               <div className="bg-white/80 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-clay">
                  <Sparkles size={40} className="text-gray-300" />
               </div>
               <p className="text-2xl font-black text-gray-400 italic">No stories found in this hub yet.</p>
               <p className="text-gray-500 mt-2 font-medium">Be the first player to contribute here!</p>
            </div>
          )}
        </section>
      </div>
  );
}

