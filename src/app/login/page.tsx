'use client';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [returnUrl, setReturnUrl] = useState<string>('/products');

  useEffect(() => {
    const returnUrlParam = searchParams?.get('returnUrl');
    if (returnUrlParam) {
      setReturnUrl(returnUrlParam);
    }
  }, [searchParams]);

  const handleLoginSuccess = () => {
    console.log("Login successful, redirecting to:", returnUrl);
    router.push(returnUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link 
            href="/signup" 
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Google
            </button>
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;