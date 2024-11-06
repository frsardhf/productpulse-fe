'use client'
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import api from '@/lib/axios';
import { jwtDecode } from 'jwt-decode';
import { Menu, X, ChevronDown } from 'lucide-react';
import { User } from '@/types/auth';

interface NavItem {
  label: string;
  href: string;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

interface JWTPayload {
  exp: number;
}

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, setUser, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const router = useRouter();

  const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Cart', href: '/cart', requiresAuth: true },
    { label: 'Order', href: '/order', requiresAuth: true },
    { label: 'Profile', href: '/profile', requiresAuth: true },
    { 
      label: 'Admin', 
      href: '/admin', 
      requiresAuth: true,
      requiresAdmin: true
    },
  ];

  const isAdmin = (user: User | null) => {
    return user?.role === 'ADMIN';
  };

  const shouldShowNavItem = (item: NavItem) => {
    if (item.requiresAdmin && !isAdmin(user)) return false;
    if (item.requiresAuth && !user) return false;
    return true;
  };

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await api.post('/auth/logout', { access_token: token });
        } catch (error) {
          console.error('Logout API error:', error);
        }
      }
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setIsOpen(false);
      setIsProfileDropdownOpen(false);
      router.push('/login');
    }
  }, [router, setUser]);

  const validateSession = useCallback(async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      handleLogout();
      return;
    }

    if (isTokenExpired(token)) {
      handleLogout();
      router.push('/login')
    }
  }, [handleLogout, router]);

  useEffect(() => {
    validateSession();
    const intervalId = setInterval(validateSession, 1 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [validateSession]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.getElementById('mobile-menu');
      const hamburgerButton = document.getElementById('hamburger-button');
      
      if (mobileMenu && hamburgerButton) {
        if (!mobileMenu.contains(event.target as Node) && 
            !hamburgerButton.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsProfileDropdownOpen(false);
  }, [pathname]);

  if (loading) {
    return <div className="h-16 bg-white border-b"></div>;
  }

  return (
    <header className="bg-white border-b fixed top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/" 
            className="text-lg font-semibold text-purple-400 hover:text-purple-700"
          >
            ProductPulse
          </Link>

          <div className="hidden md:flex items-center justify-between flex-1 pl-8">
            <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              shouldShowNavItem(item) && (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'px-3 text-primary font-bold'
                      : 'px-3 text-gray-600 hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
            </div>

            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-purple-600 text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 focus:outline-none"
                  >
                    <span className="text-sm font-medium">{user.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            id="hamburger-button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-purple-50"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isOpen && (
          <div 
            id="mobile-menu" 
            className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                shouldShowNavItem(item) && (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${
                      pathname === item.href
                        ? 'block px-3 py-2 rounded-md text-base font-bold text-primary'
                        : 'block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              ))}
              
              {!user ? (
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="px-3 py-2">
                    <p className="text-base font-medium text-gray-800">{user.name}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;