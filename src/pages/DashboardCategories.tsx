import { useState, useEffect } from 'react';
import { ClayCard } from '../components/ui/ClayCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Trash2, Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export function DashboardCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Create Category State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${baseUrl}/categories?limit=100`);
      const json = await response.json();
      if (json.success) {
        setCategories(json.data);
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${baseUrl}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
      });
      const json = await response.json();
      if (json.success) {
        setName('');
        setDescription('');
        fetchCategories();
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${baseUrl}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await response.json();
      if (json.success) {
        fetchCategories();
      } else {
        alert(json.message);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Categories</h1>
          <p className="text-gray-500 font-medium mt-2">Manage your blog categories.</p>
        </div>
        <Button 
          variant="ghost" 
          onClick={fetchCategories} 
          disabled={loading}
          className="rounded-full h-12 w-12 p-0 bg-white shadow-clay hover:shadow-clay-hover"
        >
          <RefreshCw className={loading ? 'animate-spin' : ''} size={24} />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <ClayCard className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Plus size={20} className="text-primary" />
              New Category
            </h2>
            <form onSubmit={handleCreateCategory} className="space-y-6">
              <Input 
                label="Category Name" 
                placeholder="e.g., Technology"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 tracking-wide uppercase">Description</label>
                <textarea
                  className="w-full bg-background rounded-2xl px-6 py-4 text-gray-700 shadow-clay-inset focus:outline-none focus:shadow-clay-inset-hover transition-all placeholder:text-gray-400 min-h-[100px] resize-none border-0"
                  placeholder="Tell us about this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={creating} className="w-full py-4 rounded-xl shadow-clay">
                {creating ? 'Creating...' : 'Create Category'}
              </Button>
            </form>
          </ClayCard>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 space-y-4">
          {loading && categories.length === 0 ? (
            <div className="text-center py-20 bg-white/50 rounded-3xl animate-pulse">
              <p className="text-gray-400 font-medium tracking-widest uppercase">Loading Categories...</p>
            </div>
          ) : error ? (
            <div className="p-8 bg-red-50 rounded-3xl border border-red-100 text-center">
              <p className="text-red-500 font-bold">{error}</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20 bg-white/50 rounded-3xl">
              <p className="text-gray-400 font-medium tracking-widest uppercase">No categories found.</p>
            </div>
          ) : (
            categories.map((cat) => (
              <ClayCard key={cat._id} className="flex items-center justify-between p-6 group hover:shadow-clay-hover transition-all border border-transparent hover:border-gray-100">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{cat.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{cat.description || 'No description provided.'}</p>
                  <span className="text-xs bg-gray-100 text-gray-400 py-1 px-3 rounded-full mt-3 inline-block font-mono">
                    /{cat.slug}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 size={20} />
                </Button>
              </ClayCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
