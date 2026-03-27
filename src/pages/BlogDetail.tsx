import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ClayCard } from '../components/ui/ClayCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Textarea } from '../components/ui/Input';
import { ChevronLeft, Loader2, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  coverImage?: string;
  readTime: number;
  viewCount: number;
  commentCount?: number;
  createdAt: string;
  category?: {
    name: string;
  };
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  comments?: Array<{
    _id: string;
    content: string;
    createdAt: string;
    author: {
      name: string;
      avatar?: string;
    };
  }>;
}


export function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentUser, token } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
        const response = await fetch(`${baseUrl}/posts/id/${id}`);
        const json = await response.json();
        if (json.success) {
          setPost(json.data);
        } else {
          setError(json.message || 'Failed to retrieve post');
        }
      } catch (err) {
        setError('An error occurred while fetching the story.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !token || !commentContent.trim() || !id) return;

    setIsSubmitting(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${baseUrl}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: commentContent,
          postId: id
        })
      });

      const json = await response.json();
      if (json.success) {
        setCommentContent('');
        // Refresh the post to show the new comment
        const postRes = await fetch(`${baseUrl}/posts/id/${id}`);
        const postJson = await postRes.json();
        if (postJson.success) {
          setPost(postJson.data);
        }
      } else {
        alert(json.message || 'Failed to post comment');
      }
    } catch (err) {
      alert('An error occurred while posting your comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-gray-400 font-bold tracking-widest uppercase">Opening Story...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="text-red-400" size={64} />
        <h2 className="text-2xl font-bold text-gray-800">Oops! Story not found.</h2>
        <p className="text-gray-500">{error || 'This story might have been moved or deleted.'}</p>
        <Link to="/">
          <Button variant="primary" className="rounded-full">Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <Link to="/" className="inline-flex items-center text-gray-500 font-medium hover:text-primary transition-colors group">
        <div className="p-2 rounded-xl group-hover:bg-primary/10 mr-2 transition-all">
          <ChevronLeft size={20} />
        </div>
        Back to stories
      </Link>
      
      {/* Header Info */}
      <div className="space-y-6 text-center px-4">
        <div className="flex justify-center">
          <Badge variant="accent" className="px-6 py-1.5 shadow-clay-badge border-0">{post.category?.name || 'Uncategorized'}</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-gray-900 !leading-tight">
          {post.title}
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">{post.excerpt}</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <div className="w-16 h-16 rounded-full shadow-clay border-4 border-white overflow-hidden bg-gray-50 flex-shrink-0">
             <img src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.name}&background=random`} alt={post.author.name} className="w-full h-full object-cover" />
          </div>
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-gray-800 text-lg leading-tight">{post.author.name}</h4>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span className="hidden xs:inline">•</span>
              <span>{post.readTime} min read</span>
              {post.viewCount !== undefined && (
                <>
                  <span className="hidden xs:inline">•</span>
                  <span>{post.viewCount} views</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        {(post as any).tags && (post as any).tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {(post as any).tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="px-3 py-0.5 text-xs font-bold uppercase tracking-wider bg-gray-100 hover:bg-gray-200 border-0">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Hero Image */}
      <ClayCard padding="none" className="overflow-hidden rounded-[3rem] shadow-clay-card aspect-video relative group border-8 border-white">
        <img 
          src={post.featuredImage || post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200'} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
        />
      </ClayCard>


      {/* Actions */}
      {/* <ClayCard className="max-w-[750px] mx-auto flex items-center justify-center py-6 rounded-[2.5rem] px-10 border-2 border-white/50">
        <Button variant="ghost" className="rounded-full !px-4 !py-3 hover:bg-primary/5 transition-all text-gray-600 group">
          <MessageSquare size={24} className="group-hover:text-primary transition-colors" />
          <span className="ml-2 font-black text-gray-800">{post.commentCount || 0}</span>
        </Button>
      </ClayCard> */}

      {/* Comments Section */}
      <section className="max-w-[750px] mx-auto pt-16">

        <h3 className="text-3xl font-black mb-10 text-gray-900 flex items-center gap-4">
          Comments 
          <span className="bg-primary/10 text-primary text-sm px-4 py-1.5 rounded-full shadow-clay-inset font-bold">
            {post.commentCount || 0}
          </span>
        </h3>

        
        {currentUser ? (
          <ClayCard className="p-10 mb-16 border-2 border-white/50">
            <h4 className="font-black mb-8 text-xl text-gray-800">Join the Conversation</h4>
            <form className="space-y-6" onSubmit={handleCommentSubmit}>
              <Textarea 
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Share your perspective..." 
                className="min-h-[160px] text-lg border-0 shadow-clay-inset focus:shadow-clay-inset-hover" 
                required
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={isSubmitting || !commentContent.trim()}
                  className="rounded-full px-10 py-4 font-bold tracking-wide flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Posting...
                    </>
                  ) : 'Post Comment'}
                </Button>
              </div>
            </form>
          </ClayCard>
        ) : (
          <ClayCard className="p-12 mb-16 border-2 border-white/50 text-center space-y-6 bg-gray-50/50 backdrop-blur-sm group hover:bg-primary/5 transition-colors duration-500">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto shadow-clay group-hover:scale-110 transition-transform duration-500">
              <Lock className="text-primary" size={36} />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-black text-gray-900 tracking-tight">Thoughts to share?</h4>
              <p className="text-gray-500 font-bold text-lg">Please sign in to join the conversation on this story.</p>
            </div>
            <div className="pt-4">
              <Link to="/login">
                <Button variant="primary" size="lg" className="rounded-full shadow-clay-badge px-12 py-6 text-lg font-black tracking-widest uppercase">Sign In Now</Button>
              </Link>
            </div>
          </ClayCard>
        )}

        {/* Real comments list */}
        <div className="space-y-8">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment._id} className="flex gap-4 group animate-in slide-in-from-left-4 duration-500">
                <div className="w-12 h-12 shrink-0 rounded-full shadow-clay border-2 border-white overflow-hidden bg-gray-50">
                  <img 
                    src={comment.author.avatar || `https://ui-avatars.com/api/?name=${comment.author.name}&background=random`} 
                    alt={comment.author.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 bg-background shadow-clay-inset p-8 rounded-3xl rounded-tl-none border-2 border-white/50 hover:bg-white/40 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-black text-gray-800 text-lg">{comment.author.name}</h5>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-medium">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 opacity-50">
              <p className="text-gray-400 italic">No comments yet. Be the first to start the discussion!</p>
            </div>
          )}
        </div>
      </section>


    </article>
  );
}


