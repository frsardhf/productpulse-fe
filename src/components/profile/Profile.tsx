'use client';
import React, { useEffect, useState } from 'react';
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import api from '@/lib/axios';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

interface AlertProps {
  variant?: 'success' | 'error';
  children: React.ReactNode;
}

interface ErrorResponse {
  message: string;
  // Add any other properties you expect in the error response
}

const Alert: React.FC<AlertProps> = ({ variant = 'success', children }) => {
  const baseStyles = "px-4 py-3 mb-4 rounded-lg text-sm font-medium";
  const variantStyles = {
    success: "bg-green-50 text-green-700 border border-green-200",
    error: "bg-red-50 text-red-700 border border-red-200"
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]}`}>
      {children}
    </div>
  );
};

// Custom Card Component
interface CardProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, footer, className }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      <div className="flex-1">{children}</div>
      {footer && <div className="mt-4 border-t pt-2">{footer}</div>}
    </div>
  );
};

const Profile: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const router = useRouter(); // Initialize useRouter

  const getAuthUserString = () => {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    return JSON.parse(userString);
  };

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return token;
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      // Redirect to login page if there is no token
      router.push('/login?returnUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    const user = getAuthUserString();
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
    setIsLoading(false); // Set loading to false after checking auth
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const user = getAuthUserString();
  
    try {
      const response = await api.put(`/users/${user?.id}`, {
        name,
        email,
        ...(password && { password }), // Only include password if it's not empty
      });
  
      if (response.status === 200) {
        setSuccess('Profile updated successfully!');
        setPassword(''); // Clear password field after successful update
      }
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || 'An error occurred while updating the profile.';
      setError(errorMessage); 
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show loading indicator while checking auth
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="bg-white">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        </div>

        {error && (
          <Alert variant="error">{error}</Alert>
        )}
        {success && (
          <Alert variant="success">{success}</Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white"
          >
            Update Profile
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Profile;