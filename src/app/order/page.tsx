'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";
import api from '@/lib/axios';
import OrderList from '@/components/order/OrderList';
import { Card, CardContent } from "@/components/ui/card";
import { Order } from '@/types/order';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return token;
  };

  const getAuthUserString = () => {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    return JSON.parse(userString);
  };

  const fetchOrders = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setError('Authentication required');
      router.push('/login?returnUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    const user = getAuthUserString();

    try {
      const response = await api.get(`/orders/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        setOrders(response.data);
      }
    } catch (error) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto max-w-4xl mt-4">
        <CardContent className="p-6">
          <div className="text-destructive">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-[calc(100vh-5px)] p-4 pt-[72px]">
      <Card className="max-w-4xl mx-auto h-full">
        <CardContent className="p-6 h-full pt-[20px]">
          <OrderList orders={orders} />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;