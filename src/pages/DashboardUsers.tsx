import { useState, useEffect, useCallback } from 'react';
import { ClayCard } from '../components/ui/ClayCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { Search as SearchIcon, Shield, Trash2, Loader2, ChevronLeft, ChevronRight, UserCheck, UserMinus } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  status: string;
  createdAt: string;
}

export function DashboardUsers() {
  const { role, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      const url = new URL(`${baseUrl}/users`);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', limit.toString());
      if (query) url.searchParams.append('search', query);

      const response = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await response.json();
      if (json.success) {
        setUsers(json.data);
        setTotal(json.meta.total);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [token, page, query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 400); // Debounce
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleDisableUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to disable this user? They will not be able to log in.')) return;
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${baseUrl}/users/${userId}/disable`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await response.json();
      if (json.success) {
        alert('User has been disabled.');
        fetchUsers();
      }
    } catch (err) {
      console.error('Error disabling user:', err);
    }
  };

  const handleEnableUser = async (userId: string) => {
    if (!window.confirm('Re-enable this user? They will regain full access to their account.')) return;
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${baseUrl}/users/${userId}/enable`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await response.json();
      if (json.success) {
        alert('User has been re-enabled.');
        fetchUsers();
      }
    } catch (err) {
      console.error('Error enabling user:', err);
    }
  };

  const handleModerateDelete = async (userId: string) => {
    if (!window.confirm('CRITICAL ACTION: This will mark the user as DELETED and HIDE all their content across the platform. This cannot be undone from this UI. Proceed?')) return;
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${baseUrl}/users/${userId}/moderate`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await response.json();
      if (json.success) {
        alert('User and all their content have been moderated.');
        fetchUsers();
      }
    } catch (err) {
      console.error('Error moderating user:', err);
    }
  };

  if (role !== 'Admin') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <ClayCard className="text-center p-12 text-red-500 font-bold border-2 border-white shadow-clay backdrop-blur-sm bg-white/50">
          Access Denied. Admins only.
        </ClayCard>
      </div>
    );
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Platform Members</h1>
          <p className="text-gray-500 font-medium mt-1">Manage, moderate, and monitor your community members.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
          <input 
            type="text"
            className="w-full bg-white rounded-2xl pl-12 pr-6 py-3.5 text-sm shadow-clay border-2 border-transparent focus:border-primary-light focus:outline-none transition-all placeholder:text-gray-300 font-bold"
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <ClayCard padding="none" className="overflow-hidden bg-white/50 backdrop-blur-sm border-2 border-white shadow-clay-hover">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100/50">
                <th className="p-6 font-black text-gray-400 text-[10px] uppercase tracking-widest">User Details</th>
                <th className="p-4 font-black text-gray-400 text-[10px] uppercase tracking-widest">Role</th>
                <th className="p-4 font-black text-gray-400 text-[10px] uppercase tracking-widest">Status</th>
                <th className="p-4 font-black text-gray-400 text-[10px] uppercase tracking-widest text-right pr-10">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50 text-sm">
              {loading && users.length === 0 ? (
                <tr>
                   <td colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                         <Loader2 className="animate-spin text-primary" size={32} />
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retrieving Community Data...</span>
                      </div>
                   </td>
                </tr>
              ) : users.map(user => (
                <tr key={user._id} className="hover:bg-white transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-clay-inset flex-shrink-0 border-2 border-white bg-gray-50 flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl font-black text-gray-300 uppercase italic leading-none">{user.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-extrabold text-gray-800 tracking-tight group-hover:text-primary transition-colors text-lg">{user.name}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={user.role === 'admin' ? 'primary' : 'gray'} className="gap-2 px-4 py-2 uppercase font-black text-[9px] shadow-clay-badge border-transparent">
                      {user.role === 'admin' && <Shield size={10} />} {user.role}
                    </Badge>
                  </td>
                  <td className="p-4">
                     <Badge 
                        variant={user.status === 'active' ? 'accent' : 'gray'} 
                        className="px-3 py-1 font-black text-[8px] uppercase tracking-tighter shadow-clay-badge border-transparent"
                     >
                        {user.status}
                     </Badge>
                  </td>
                  <td className="p-4 text-right space-x-2 pr-10">
                    <div className="flex items-center justify-end gap-2 text-right">
                      {user.status === 'disabled' ? (
                        <button 
                          className="p-2.5 bg-gray-50 text-emerald-500 rounded-xl hover:shadow-clay transition-all hover:bg-emerald-50 disabled:opacity-30" 
                          title="Enable Account"
                          onClick={() => handleEnableUser(user._id)}
                        >
                          <UserCheck size={18} />
                        </button>
                      ) : (
                        <button 
                          className="p-2.5 bg-gray-50 text-amber-500 rounded-xl hover:shadow-clay transition-all hover:bg-amber-50 disabled:opacity-30" 
                          title="Disable Account"
                          onClick={() => handleDisableUser(user._id)}
                          disabled={user.role === 'admin'}
                        >
                          <UserMinus size={18} />
                        </button>
                      )}
                      
                      <button 
                         className="p-2.5 bg-gray-50 text-red-500 rounded-xl hover:shadow-clay transition-all hover:bg-red-50 disabled:opacity-30"
                         title="Moderate Delete (Strict)"
                         onClick={() => handleModerateDelete(user._id)}
                         disabled={user.role === 'admin'}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && users.length === 0 && (
                <tr>
                   <td colSpan={4} className="p-24 text-center">
                      <div className="max-w-xs mx-auto">
                         <p className="text-lg font-black text-gray-300 uppercase italic">Empty community.</p>
                         <p className="text-gray-400 mt-2">No members match your current search criteria.</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 bg-gray-50/50 border-t border-gray-100/50 flex items-center justify-between">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Member Page {page} of {totalPages} ({total} Total)
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
