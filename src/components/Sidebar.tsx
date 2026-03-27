import { NavLink } from 'react-router-dom';
import { Home, FileText, PlusCircle, Settings, LogOut, X, Users, Globe, Grid } from 'lucide-react';
import { cn, Button } from './ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from './ui/Badge';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { role } = useAuth();
  
  const prefix = role ? `/${role.toLowerCase()}/dashboard` : '/dashboard';

  const links = [
    { name: 'Home Site', to: '/', icon: Globe, roles: ['Admin', 'Author'] },
    { name: 'Dashboard', to: prefix, icon: Home, roles: ['Admin', 'Author'] },
    { name: role === 'Admin' ? 'All Posts' : 'My Posts', to: `${prefix}/posts`, icon: FileText, roles: ['Admin', 'Author'] },
    { name: 'Categories', to: `${prefix}/categories`, icon: Grid, roles: ['Admin'] },
    { name: 'Create Post', to: '/post/create', icon: PlusCircle, roles: ['Admin', 'Author'] },
    { name: 'Users', to: `${prefix}/users`, icon: Users, roles: ['Admin'] },
    { name: 'Settings', to: `${prefix}/settings`, icon: Settings, roles: ['Admin', 'Author'] },
  ];

  const visibleLinks = links.filter(link => role ? link.roles.includes(role) : false);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-800/20 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      <div className={cn(
        "w-64 flex-shrink-0 h-full fixed inset-y-0 left-0 bg-background shadow-clay-card flex flex-col p-6 pointer-events-auto z-50 transition-transform duration-300 md:translate-x-0 overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between gap-3 mb-8 pt-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-xl shadow-clay-inset">
              <FileText size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">
              {role === 'Admin' ? 'Admin Panel' : 'Author Panel'}
            </span>
          </div>
          <Button variant="ghost" size="sm" className="md:hidden !p-2" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Role Indicator */}
        <div className="mb-8 p-4 bg-background shadow-clay-inset rounded-2xl border border-gray-100/50 text-center">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Current View</p>
          <div className="flex flex-col gap-3">
             <Badge variant={role === 'Admin' ? 'primary' : 'accent'} className="justify-center w-full shadow-none">{role || 'Guest'}</Badge>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.to}
                end={link.to === prefix}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-clay transition-all",
                    isActive
                      ? "bg-primary text-white shadow-clay scale-[1.02]"
                      : "text-gray-600 hover:bg-gray-100/50 hover:shadow-clay hover:-translate-y-1"
                  )
                }
              >
                <Icon size={20} />
                <span className="font-semibold">{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto pt-8">
          <NavLink
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-clay text-red-500 hover:bg-red-50 hover:shadow-clay transition-all"
          >
            <LogOut size={20} />
            <span className="font-semibold">Logout</span>
          </NavLink>
        </div>
      </div>
    </>
  );
}
