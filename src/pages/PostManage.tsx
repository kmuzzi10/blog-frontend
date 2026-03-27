import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Textarea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ClayCard } from '../components/ui/ClayCard';
import { ImagePlus, Loader2, CheckCircle, UploadCloud } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Category {
  _id: string;
  name: string;
}

interface PostManageProps {
  editMode?: boolean;
}

export function PostManage({ editMode }: PostManageProps) {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('Draft');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
        const response = await fetch(`${baseUrl}/categories?limit=50`);
        const json = await response.json();
        if (json.success) setCategories(json.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch existing post data if in edit mode
  useEffect(() => {
    if (editMode && id && token) {
      const fetchPost = async () => {
        setLoading(true);
        try {
          const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
          const response = await fetch(`${baseUrl}/posts/id/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const json = await response.json();
          if (json.success) {
            const p = json.data;
            setTitle(p.title);
            setContent(p.content);
            setExcerpt(p.excerpt || '');
            setCategoryId(p.categoryId?._id || p.categoryId || '');
            setTags(Array.isArray(p.tags) ? p.tags.join(', ') : '');
            setStatus(p.status);
            if (p.featuredImage) setPreviewUrl(p.featuredImage);
          }
        } catch (err) {
          console.error('Failed to fetch post:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [editMode, id, token]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (targetStatus?: string) => {
    if (!token) return;
    setSubmitting(true);

    const activeStatus = targetStatus || status;

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('excerpt', excerpt);
      formData.append('categoryId', categoryId);
      formData.append('tags', tags);
      formData.append('status', activeStatus);
      if (imageFile) {
        formData.append('featuredImage', imageFile);
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      const endpoint = editMode ? `/posts/${id}` : '/posts';
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const json = await response.json();
      if (json.success) {
        navigate(editMode ? `/post/${id}` : `/author/dashboard/posts`);
      } else {
        alert(json.message || 'Operation failed');
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Network error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
     return (
       <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="animate-spin text-primary mb-4" size={48} />
          <p className="text-gray-400 font-bold tracking-widest uppercase">Fetching Post Content...</p>
       </div>
     );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 py-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-gray-100 px-2 lg:px-0">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
             {editMode ? 'Refine Story' : 'New Story'}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium italic">Unleash your creativity and engage your audience.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <Button 
            variant="ghost" 
            className="rounded-2xl !px-6 border-2 border-transparent hover:border-gray-100 flex-1 md:flex-none shadow-clay transition-all w-full sm:w-auto"
            onClick={() => handleSubmit('Draft')}
            disabled={submitting}
          >
             {submitting ? <Loader2 className="animate-spin" /> : 'Save Draft'}
          </Button>
          <Button 
            variant="primary" 
            className="rounded-2xl !px-8 shadow-clay-badge flex-1 md:flex-none font-black uppercase text-xs tracking-widest w-full sm:w-auto py-5 md:py-3"
            onClick={() => handleSubmit('Published')}
            disabled={submitting}
          >
            {submitting ? <Loader2 className="animate-spin" /> : (
              <>
                 <CheckCircle className="mr-2" size={18} />
                 {editMode ? 'Update' : 'Publish'}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
        <ClayCard className="space-y-8 sm:space-y-10 bg-white/50 backdrop-blur-sm border-2 border-white shadow-clay-hover p-6 sm:p-10">
          {/* Title Editor */}
          <div className="space-y-2">
             <input 
              placeholder="Post Title..." 
              className="w-full text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 border-0 focus:outline-none focus:ring-0 placeholder:text-gray-200 !bg-transparent tracking-tighter" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="h-1.5 w-16 sm:w-24 bg-primary/20 rounded-full" />
          </div>
          
          {/* Image Uploader */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full aspect-video rounded-3xl border-4 border-dashed border-gray-100/50 bg-gray-50 hover:bg-white hover:border-primary/20 transition-all cursor-pointer group flex flex-col items-center justify-center overflow-hidden"
          >
            {previewUrl ? (
              <img src={previewUrl} className="w-full h-full object-cover" />
            ) : (
              <>
                <div className="p-6 bg-white rounded-full shadow-clay group-hover:scale-110 transition-all mb-4 text-primary opacity-50 group-hover:opacity-100">
                   <ImagePlus size={40} />
                </div>
                <p className="font-black text-gray-300 uppercase tracking-widest text-xs">Drop Image or Click to Browse</p>
              </>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            {previewUrl && (
               <div className="absolute bottom-6 right-6 p-3 bg-white/90 backdrop-blur rounded-2xl shadow-clay text-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <UploadCloud size={16} /> Update Image
               </div>
            )}
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Short Excerpt (Optional)</label>
             <Textarea 
              placeholder="A brief summary for previews..." 
              className="min-h-[100px] text-gray-500 font-medium italic !bg-gray-50/50 !shadow-clay-inset rounded-2xl border-0 p-6"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>

          {/* Content Area */}
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Story Content</label>
             <Textarea 
              placeholder="Start typing your masterpiece..." 
              className="min-h-[500px] text-xl leading-relaxed text-gray-700 !bg-white/70 !shadow-clay rounded-3xl border-0 p-8 focus:shadow-clay-hover transition-all"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Metadata Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-gray-50/50 rounded-[2.5rem] shadow-clay-inset">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Topic Category</label>
              <select 
                className="w-full bg-white rounded-2xl px-6 py-4 text-gray-700 shadow-clay hover:shadow-clay-hover focus:outline-none transition-all font-bold appearance-none cursor-pointer border-0"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
               <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Search Tags</label>
               <input 
                 className="w-full bg-white rounded-2xl px-6 py-4 text-gray-700 shadow-clay hover:shadow-clay-hover focus:outline-none transition-all font-bold border-0"
                 placeholder="e.g. tech, design, lifestyle"
                 value={tags}
                 onChange={(e) => setTags(e.target.value)}
               />
            </div>
          </div>
        </ClayCard>
      </div>
    </div>
  );
}

