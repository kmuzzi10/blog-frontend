import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClayCard } from '../components/ui/ClayCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      if (bio) formData.append('bio', bio);
      if (avatar) formData.append('avatar', avatar);

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        // DO NOT set Content-Type header manually when using FormData
        // Fetch will automatically set it to 'multipart/form-data' with the correct boundary
        body: formData,
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || 'Registration failed');
      }

      // Success, save tokens and user
      login(json.data.user, json.data.tokens);
      const role = json.data.user.role?.toLowerCase() || 'author';
      navigate(role === 'admin' ? '/admin/dashboard' : '/author/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-500 py-12">
      <ClayCard className="w-full max-w-[500px] space-y-8 p-10">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Join ClayBlog</h1>
          <p className="text-gray-500 font-medium">Create your profile to start publishing engaging stories.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl shadow-clay-inset text-sm font-semibold text-center border border-red-100">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input 
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input 
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            label="Password"
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 tracking-wide uppercase">Bio (Optional)</label>
            <textarea
              className="w-full bg-background rounded-2xl px-6 py-4 text-gray-700 shadow-clay-inset focus:outline-none focus:shadow-clay-inset-hover transition-all placeholder:text-gray-400 min-h-[100px] resize-none border-0"
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 tracking-wide uppercase">Profile Picture / Avatar (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              className="w-full bg-background rounded-2xl px-6 py-4 text-gray-700 shadow-clay-inset focus:outline-none focus:shadow-clay-inset-hover transition-all font-medium text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setAvatar(e.target.files[0]);
                }
              }}
            />
          </div>

          <Button type="submit" variant="secondary" disabled={loading} className="w-full py-4 rounded-xl text-lg flex justify-center mt-6">
            {loading ? 'Processing...' : 'Register Account'}
          </Button>
        </form>

        <p className="text-center text-gray-500 font-medium mt-8">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors">
            Log in instead
          </Link>
        </p>
      </ClayCard>
    </div>
  );
}
