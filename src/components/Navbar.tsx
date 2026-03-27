import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { PenTool, Search, Menu, X, Home, Compass, Info, Mail, LayoutDashboard, LogOut } from 'lucide-react';
import { ClayCard } from './ui/ClayCard';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { currentUser, role, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', to: '/', icon: Home },
    { name: 'Explore', to: '/search', icon: Compass },
    { name: 'About', to: '/about', icon: Info },
    { name: 'Contact', to: '/contact', icon: Mail },
  ];

  if (currentUser && role) {
    navLinks.push({ name: 'Dashboard', to: `/${role.toLowerCase()}/dashboard`, icon: LayoutDashboard });
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none">
      <div className="max-w-7xl mx-auto">
        <ClayCard padding="none" className="pointer-events-auto shadow-clay/50 flex items-center justify-between px-6 py-4 rounded-full bg-white/90 backdrop-blur-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-white p-2 rounded-xl shadow-clay-inset group-hover:scale-110 transition-transform">
              <PenTool size={20} />
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight hidden xs:block">ClayBlog</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.to} className="text-gray-600 font-medium hover:text-primary transition-colors hover:scale-105">
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/search" className="hidden xs:block">
              <Button variant="ghost" size="sm" className="px-3 py-3 rounded-full">
                <Search size={20} />
              </Button>
            </Link>
            
            <div className="hidden md:flex items-center gap-3 border-l pl-4 border-gray-200">
              {currentUser ? (
                <>
                  <Link to={`/${role?.toLowerCase()}/dashboard`}>
                    <Button variant="primary" size="sm" className="rounded-full shadow-clay text-sm flex gap-2 items-center">
                      <img src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}`} className="w-5 h-5 rounded-full bg-white/20"/>
                      <span className="max-w-[100px] truncate">{currentUser.name}</span>
                    </Button>
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
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden px-3 py-3 rounded-xl hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </ClayCard>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-0 left-0 w-full h-full bg-background z-[60] p-6 lg:hidden animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto overflow-y-auto">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-12">
               <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <div className="bg-primary text-white p-2 rounded-xl shadow-clay-inset">
                  <PenTool size={20} />
                </div>
                <span className="text-xl font-bold text-gray-800 tracking-tight">ClayBlog</span>
              </Link>
              <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </Button>
            </div>

            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.name} 
                    to={link.to} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-5 rounded-3xl bg-white shadow-clay hover:text-primary transition-all active:scale-95"
                  >
                    <div className="p-2 bg-gray-50 rounded-xl text-primary/60">
                      <Icon size={24} />
                    </div>
                    <span className="text-lg font-bold text-gray-800">{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-12 space-y-4 pt-8 border-t border-gray-100">
              {currentUser ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-3xl">
                    <img src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}`} className="w-12 h-12 rounded-2xl shadow-clay border-2 border-white"/>
                    <div>
                      <p className="font-bold text-gray-800">{currentUser.name}</p>
                      <p className="text-xs font-bold text-primary uppercase tracking-widest">{role}</p>
                    </div>
                  </div>
                  <Button variant="secondary" className="w-full py-5 rounded-3xl font-black uppercase text-xs tracking-widest gap-2 shadow-clay" onClick={handleLogout}>
                    <LogOut size={18} /> Log Out
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full py-5 rounded-3xl font-bold">Log In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full py-5 rounded-3xl font-bold shadow-clay">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

