'use client';
import React, { createContext, useContext, useState, useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import { User } from '@/types/auth';

export interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const loadUser = () => {
      try {
        if (typeof window !== 'undefined') {
          const userString = localStorage.getItem('user');
          const userData: User | null = userString ? JSON.parse(userString) : null;
          
          if (
            userData &&
            typeof userData.id === 'number' &&
            typeof userData.name === 'string' &&
            typeof userData.email === 'string' &&
            typeof userData.role === 'string'
          ) {
            setUser(userData);
          } else {
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        loadUser();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    setUser ,
    loading,
    isAdmin
  }), [user, loading, isAdmin]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}