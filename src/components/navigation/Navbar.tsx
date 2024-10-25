'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/types/auth';
import api from '@/lib/axios'; // Import your custom Axios instance

interface NavItem {
  label: string;
  href: string;
  requiresAuth?: boolean;
}

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const userString = localStorage.getItem('user');
  const user: User | null = userString ? JSON.parse(userString) : null;

  const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Profile', href: '/profile', requiresAuth: true },
  ];

  const getBreadcrumbs = () => {
    const paths = pathname ? pathname.split('/').filter(path => path) : [];
    return [
      { label: 'Home', href: '/' },
      ...paths.map((path, index) => ({
        label: path.charAt(0).toUpperCase() + path.slice(1),
        href: '/' + paths.slice(0, index + 1).join('/')
      }))
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token'); // Ensure this is the correct key for your token
      if (!token) {
        throw new Error('Access token is empty');
      }

      const response = await api.post('/auth/logout', { access_token: token }); // Use your custom Axios instance
      if (response.status === 201) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login page after logout
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <Link 
            href="/" 
            className="text-lg font-semibold text-purple-400 hover:text-purple-700"
          >
            ProductPulse
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              if (item.requiresAuth && !user) return null;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                    ${pathname === item.href 
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text -purple-600 hover:bg-purple-50'
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-4">
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
              <div className="flex items-center space-x-2 text-gray-600 hover:text-purple-600">
                <span className="text-sm font-medium">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-white-600 text-purple px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-100 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-1">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={breadcrumb.href}>
              {index > 0 && (
                <li className="text-gray-400">
                  <span>/</span>
                </li>
              )}
              <li className={pathname === breadcrumb.href ? 'text-purple-600 font-medium' : 'text-gray-500'}>
                <Link 
                  href={breadcrumb.href}
                  className="hover:text-purple-700 transition-colors duration-200"
                >
                  {breadcrumb.label}
                </Link>
              </li>
            </React.Fragment>
          ))}
        </ol>
      </div>
    </header>
  );
};

export default Navbar;