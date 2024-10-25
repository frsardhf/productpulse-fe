'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const AdminProtection = (WrappedComponent: React.ComponentType) => {
  return function ProtectedComponent(props: any) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          router.push('/login'); // Redirect to login if no user
          return;
        }

        try {
          const user: User = JSON.parse(userStr);
          if (user.role !== 'ADMIN') {
            router.push('/unauthorized');
            return;
          }
          setIsAuthorized(true);
        } catch (error) {
          console.log(error)
          router.push('/login');
        }
        setIsLoading(false);
      };

      checkAuth();
    }, [router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return isAuthorized ? <WrappedComponent {...props} /> : null;
  };
};

export default AdminProtection;