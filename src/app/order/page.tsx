'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import OrderList from '@/components/order/OrderList';

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
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

  const fetchOrders = async () => {
    const token = getAuthToken();
    if (!token) {
      setError('Authentication required');
      router.push('/login?returnUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    const user = getAuthUserString();
    console.log("User :", user.id);

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
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <OrderList orders={orders} />
    </div>
  );
};

export default OrdersPage;