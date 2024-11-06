'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const AdminProtection = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return function ProtectedComponent(props: P) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          router.push('/login');
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
          console.log(error);
          router.push('/login');
        }
        setIsLoading(false);
      };

      checkAuth();
    }, [router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }

    return isAuthorized ? <WrappedComponent {...props} /> : null;
  };
};

export default AdminProtection;