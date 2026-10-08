"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { AlertCircle, Loader2, PackageCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { useAuth } from "@/contexts/auth-context";
import OrderList from "@/components/order/OrderList";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightedOrderId = Number(searchParams.get("created")) || undefined;

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Order[]>("/orders/history");
      setOrders(response.data);
    } catch {
      setError("Your order history could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?returnUrl=%2Forder");
      return;
    }
    void fetchOrders();
  }, [authLoading, fetchOrders, router, user]);

  if (authLoading || isLoading || !user) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading order history</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <PackageCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary">Your account</p>
            <h1 className="text-3xl font-bold tracking-tight">Order history</h1>
          </div>
        </div>

        <p className="mb-6 max-w-2xl text-sm leading-6 text-muted-foreground">
          These are simulated ProductPulse orders. No payment was collected and
          no order was submitted to the catalogue source.
        </p>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-red-600" />
            <p className="mt-4 font-medium text-red-950">{error}</p>
            <Button className="mt-5" variant="outline" onClick={fetchOrders}>
              Try again
            </Button>
          </div>
        ) : (
          <OrderList orders={orders} highlightedOrderId={highlightedOrderId} />
        )}
      </div>
    </main>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <OrdersContent />
    </Suspense>
  );
}
