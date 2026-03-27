import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  role: string | null;  // For compatibility with mock usage globally
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage (hydration)
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed parsing stored user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (user: User, tokens: AuthTokens) => {
    setCurrentUser(user);
    setToken(tokens.accessToken);
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
  };

  const updateUser = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      token, 
      isLoading,
      login, 
      logout,
      updateUser,
      role: currentUser?.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1).toLowerCase() : null
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
