'use client'

import React, { useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Loader2 } from "lucide-react";
import Card from "@/components/ui/card";
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';

const Cart: React.FC = () => {
  const router = useRouter();

  const { 
    items, 
    isLoading, 
    error, 
    fetchItems, 
    updateQuantity, 
    removeFromCart,
    getTotalPrice 
  } = useCart();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleUpdateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity > 0) {
      await updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = async (id: number) => {
    await removeFromCart(id);
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

  if (items.length === 0) {
    return (
      <Card className="text-center py-16">
        <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700">Your cart is empty</h3>
        <p className="text-gray-500 mt-2">Add some items to get started</p>
      </Card>
    );
  }

  const cartFooter = (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">Total</div>
        <div className="text-xl font-bold">${getTotalPrice().toFixed(2)}</div>
      </div>
      <button 
        onClick={() => router.push('/checkout')} // Navigate to checkout page
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        Proceed to Checkout
      </button>
    </div>
  );

  return (
    <Card className="max-w-4xl mx-auto" footer={cartFooter}>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xl font-bold mb-6">
          <ShoppingCart className="w-6 h-6" />
          Your Cart ({items.length} items)
        </div>
        
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <p className="text-gray-600 text-sm">Stock: {item.stock}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  className="h-8 w-8 flex items-center justify-center border rounded-md hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button 
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  className="h-8 w-8 flex items-center justify-center border rounded-md hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="w-24 text-right font-semibold">
                ${(+item.price * item.quantity).toFixed(2)}
              </div>
              
              <button 
                onClick={() => handleRemoveItem(item.id)}
                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default Cart;