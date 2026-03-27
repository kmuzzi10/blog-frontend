import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClayCard } from '../components/ui/ClayCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || 'Login failed');
      }

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
    <div className="min-h-[80vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
      <ClayCard className="w-full max-w-md space-y-8 p-10">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500 font-medium">Log in to manage your posts and read premium content.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl shadow-clay-inset text-sm font-semibold text-center border border-red-100">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" disabled={loading} className="w-full py-4 rounded-xl text-lg flex justify-center">
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-gray-500 font-medium mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-secondary hover:text-secondary-dark transition-colors">
            Create an account
          </Link>
        </p>
      </ClayCard>
    </div>
  );
}
