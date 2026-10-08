"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export const AdminProtection = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  function ProtectedComponent(props: P) {
    const { user, loading, isAdmin } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
      if (loading) return;
      if (!user) {
        router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      } else if (!isAdmin) {
        router.replace("/unauthorized");
      }
    }, [isAdmin, loading, pathname, router, user]);

    if (loading) {
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    return user && isAdmin ? <WrappedComponent {...props} /> : null;
  }

  ProtectedComponent.displayName = `AdminProtection(${WrappedComponent.displayName ?? WrappedComponent.name ?? "Component"})`;
  return ProtectedComponent;
};

export default AdminProtection;
