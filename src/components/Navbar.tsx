import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { PenTool, Search, Menu } from 'lucide-react';
import { ClayCard } from './ui/ClayCard';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { currentUser, role, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none">
      <div className="max-w-7xl mx-auto">
        <ClayCard padding="none" className="pointer-events-auto shadow-clay/50 flex items-center justify-between px-6 py-4 rounded-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-white p-2 rounded-xl shadow-clay-inset group-hover:scale-110 transition-transform">
              <PenTool size={20} />
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight hidden sm:block">ClayBlog</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 font-medium hover:text-primary transition-colors hover:scale-105">Home</Link>
            <Link to="/search" className="text-gray-600 font-medium hover:text-primary transition-colors hover:scale-105">Explore</Link>
            <Link to="/about" className="text-gray-600 font-medium hover:text-primary transition-colors hover:scale-105">About</Link>
            <Link to="/contact" className="text-gray-600 font-medium hover:text-primary transition-colors hover:scale-105">Contact</Link>
            {currentUser && role && (
              <Link to={`/${role.toLowerCase()}/dashboard`} className="text-gray-600 font-medium hover:text-primary transition-colors hover:scale-105">Dashboard</Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to="/search">
              <Button variant="ghost" size="sm" className="hidden sm:flex px-2 py-2 rounded-full">
                <Search size={20} />
              </Button>
            </Link>
            <div className="hidden sm:flex items-center gap-3 border-l pl-4 border-gray-200">
              {currentUser ? (
                <>
                  <Link to={`/${role?.toLowerCase()}/dashboard`}>
                    <Button variant="primary" size="sm" className="rounded-full shadow-clay text-sm flex gap-2"><img src={currentUser.avatar} className="w-5 h-5 rounded-full bg-white/20"/> {currentUser.name}</Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="rounded-full px-4" onClick={handleLogout}>Log Out</Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="rounded-full">Log In</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm" className="rounded-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="sm" className="md:hidden px-2 py-2 rounded-xl">
              <Menu size={24} />
            </Button>
          </div>
        </ClayCard>
      </div>
    </div>
  );
}
