import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Menu } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function DashboardLayout() {
  const { token, role, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
       <div className="flex items-center justify-center h-screen w-screen bg-background">
          <div className="flex flex-col items-center gap-3">
             <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
             <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Restoring Session...</span>
          </div>
       </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background text-gray-800 overflow-hidden relative">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col md:ml-64 w-full h-full relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-background shadow-clay z-10">
          <span className="text-xl font-bold">{role === 'Admin' ? 'Admin Panel' : 'Author Panel'}</span>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </Button>
        </div>
        
        {/* Content */}
        <div className="p-4 md:p-8 flex-1 overflow-y-auto w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
