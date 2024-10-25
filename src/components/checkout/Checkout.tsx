'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, MapPin, CreditCard } from "lucide-react";
import Card from "@/components/ui/card";
import { useCart } from '@/hooks/useCart';
import api from '@/lib/axios';

const Checkout = () => {
  const router = useRouter();
  const { items, getTotalPrice, clearCart, fetchItems } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutDetails, setCheckoutDetails] = useState<any>(null);
  const [shippingAddress, setShippingAddress] = useState('');

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return token;
  };

  useEffect(() => {
    fetchItems()
    fetchCheckoutDetails();
  }, []);

  const fetchCheckoutDetails = async () => {
    const token = getAuthToken();
    if (!token) {
      setError('Authentication required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await api.post('/orders/checkout', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        setCheckoutDetails(response.data);
      }
    } catch (error) {
      setError('Failed to fetch checkout details');
      console.error('Error fetching checkout details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!shippingAddress.trim()) {
      setError('Please enter a shipping address');
      return;
    }
  
    const token = getAuthToken();
    if (!token) {
      setError('Authentication required');
      return;
    }
  
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.post('/orders/confirm', {
        shippingAddress: shippingAddress, // Only the data here
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 201) {
        // Clear the cart after successful order
        clearCart();
        // Redirect to order confirmation page
        router.push(`/orders`);
      }
    } catch (error) {
      setError('Failed to confirm order');
      console.error('Error confirming order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CreditCard className="w-6 h-6" />
        Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold">${(+item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center font-bold">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Shipping Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Shipping Address
          </h2>
          <div className="space-y-4">
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full p-3 border rounded-lg min-h-[100px]"
              placeholder="Enter your shipping address..."
            />
            <button
              onClick={handleConfirmOrder}
              disabled={isLoading || !shippingAddress.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-300"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                'Confirm Order'
              )}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;