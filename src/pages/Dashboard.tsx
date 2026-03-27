import { useState, useEffect } from 'react';
import { ClayCard } from '../components/ui/ClayCard';
import { Users, FileText, Activity, TrendingUp, MessageSquare, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface DashboardData {
  stats: {
    totalPosts: number;
    totalComments: number;
  };
  recentPosts: any[];
  recentComments: any[];
}

export function Dashboard() {
  const { role, currentUser, token } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token || !role) return;
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
        const endpoint = role === 'Author' ? '/users/dashboard/author' : '/users/dashboard/admin';
        
        const response = await fetch(`${baseUrl}${endpoint}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await response.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token, role]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-pulse">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-gray-400 font-bold tracking-widest uppercase italic">Preparing Overview...</p>
      </div>
    );
  }

  const stats = [
    { 
      label: 'Total Posts', 
      value: String(data?.stats.totalPosts || 0), 
      icon: FileText, 
      color: 'text-primary' 
    },
    { 
      label: 'Total Comments', 
      value: String(data?.stats.totalComments || 0), 
      icon: MessageSquare, 
      color: 'text-secondary' 
    },
    { 
      label: role === 'Admin' ? 'Total Users' : 'Views', 
      value: String(role === 'Admin' ? (data as any)?.stats?.totalUsers || 0 : 0), 
      icon: Users, 
      color: 'text-accent' 
    },
    { 
      label: role === 'Admin' ? 'Global Views' : 'Growth', 
      value: role === 'Admin' ? String((data as any)?.stats?.totalViews || 0) : '+0%', 
      icon: role === 'Admin' ? Activity : TrendingUp, 
      color: role === 'Admin' ? 'text-indigo-500' : 'text-green-500' 
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-100/50">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 font-medium mt-2">
            Welcome back, {currentUser?.name}. {role === 'Admin' ? "Here's the platform pulse." : "Here's what's happening today."}
          </p>
        </div>
        <div className="w-16 h-16 rounded-[2rem] shadow-clay border-4 border-white overflow-hidden bg-gray-50">
           <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name}&background=random`} alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <ClayCard key={idx} className="flex flex-col gap-4 relative overflow-hidden group hover:shadow-clay-hover transition-all duration-500">
              <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                <Icon size={120} />
              </div>
              <div className="flex justify-between items-start">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{stat.label}</p>
                <div className={`p-2.5 bg-gray-50 shadow-clay-inset rounded-xl ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-4xl font-black text-gray-800 tracking-tighter">{stat.value}</p>
            </ClayCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Posts List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-black text-gray-800 tracking-tight">
               {role === 'Admin' ? 'Platform Hot Topics' : 'My Latest Stories'}
             </h2>
          </div>
          <ClayCard padding="sm" className="space-y-4 bg-white/50 border-2 border-white">
            {data?.recentPosts.length ? data.recentPosts.map(post => (
              <Link key={post._id} to={`/post/${post._id}`}>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 hover:bg-white hover:shadow-clay transition-all group border border-transparent hover:border-gray-50 mb-2">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-clay-inset border border-white">
                      <img src={post.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=200'} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-1">{post.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] font-black uppercase text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                         <span className="w-1 h-1 bg-gray-300 rounded-full" />
                         <span className="text-[10px] font-black uppercase text-secondary">{post.categoryName || 'General'}</span>
                         {role === 'Admin' && (
                           <>
                              <span className="w-1 h-1 bg-gray-300 rounded-full" />
                              <span className="text-[10px] font-black uppercase text-primary">by {post.authorName || 'Staff'}</span>
                           </>
                         )}
                      </div>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    post.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {post.status}
                  </span>
                </div>
              </Link>
            )) : <p className="text-center py-10 text-gray-400 font-medium italic">No stories published yet.</p>}
          </ClayCard>
        </div>

        {/* Recent Feedback (Comments) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-black text-gray-800 tracking-tight">Recent Feedback</h2>
          </div>
          <ClayCard padding="sm" className="space-y-4 bg-white/50 border-2 border-white">
            {data?.recentComments.length ? data.recentComments.map(comment => (
              <div key={comment._id} className="p-4 rounded-2xl bg-white/80 border border-transparent hover:border-gray-50 group hover:shadow-clay transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                   <img src={comment.author?.avatar || `https://ui-avatars.com/api/?name=${comment.author?.name}`} className="w-6 h-6 rounded-full shadow-clay-inset" />
                   <div className="flex flex-col">
                      <span className="text-xs font-black text-gray-700">{comment.author?.name}</span>
                      {role === 'Admin' && <span className="text-[8px] font-black uppercase text-gray-400">On: {comment.postTitle}</span>}
                   </div>
                   <span className="text-[10px] text-gray-400 ml-auto">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm font-medium text-gray-600 line-clamp-2 leading-relaxed italic">"{comment.content}"</p>
              </div>
            )) : <p className="text-center py-10 text-gray-400 font-medium italic">No comments received yet.</p>}
          </ClayCard>
        </div>
      </div>
    </div>
  );
}
