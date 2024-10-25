'use client';
import SignupForm from '@/components/auth/SignupForm';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';

const SignupPage: React.FC = () => {
  const router = useRouter();

  const handleSignupSuccess = () => {
    console.log("Signup successful, redirecting...");
    router.push('/login'); // Redirect to login after successful signup
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link 
            href="/login" 
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignupForm onSignupSuccess={handleSignupSuccess}/>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          By signing up, you agree to our{' '}
          <Link 
            href="/terms" 
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link 
            href="/privacy" 
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;