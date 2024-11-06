'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Loader2 } from "lucide-react";
import { useCart } from '@/hooks/use-cart';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import api from '@/lib/axios';

const Cart: React.FC = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { 
    items, 
    isLoading, 
    fetchItems, 
    updateQuantity, 
    removeFromCart,
    getTotalPrice 
  } = useCart();

  const { toast }  = useToast()
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<Record<number, boolean>>({});
  const [localQuantities, setLocalQuantities] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      const currentPath = window.location.pathname;
      router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [user, authLoading, router]);

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to checkout",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCheckingOut(true);
      
      const token = localStorage.getItem('token');
      const { data } = await api.post('/orders/checkout', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log(data)

      toast({
        title: "Order placed successfully!",
        description: "You will be redirected to the order confirmation page.",
        variant: "default",
      });

      await fetchItems();
      router.push('/checkout');

    } catch (error: unknown) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  useEffect(() => {
    const initialQuantities: Record<number, number> = {};
    items.forEach(item => {
      initialQuantities[item.id] = item.quantity;
    });
    setLocalQuantities(initialQuantities);
  }, [items]);
  
  const debouncedUpdate = useMemo(
    () =>
      debounce(async (id: number, quantity: number) => {
        try {
          setPendingUpdates(prev => ({ ...prev, [id]: true }));
          await updateQuantity(id, quantity);
        } finally {
          setPendingUpdates(prev => ({ ...prev, [id]: false }));
        }
      }, 3000),
    [updateQuantity]
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    setLocalQuantities(prev => ({ ...prev, [id]: newQuantity }));
    debouncedUpdate(id, newQuantity);
  };

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [fetchItems, user]);

  const handleRemoveItem = async (id: number) => {
    setPendingUpdates(prev => ({ ...prev, [id]: true }));
    await removeFromCart(id);
    setPendingUpdates(prev => ({ ...prev, [id]: false }));
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (items.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto mt-[40px]">
        <CardContent className="pt-6 pb-8 text-center">
          <ShoppingCart className="w-12 h-12 mx-auto text-purple-400 mb-4" />
          <h3 className="text-lg text-purple-400 font-semibold">Your cart is empty</h3>
          <p className="text-sm text-purple-300 mt-2">Add some items to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Your Cart ({items.length} items)
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 rounded-lg border bg-card">
                <div className="col-span-3">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <p className="text-sm text-muted-foreground">Stock: {item.stock}</p>
                </div>

                <div className="flex items-center gap-2 col-span-2 justify-end">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={pendingUpdates[item.id]}
                    onClick={() => handleQuantityChange(
                      item.id,
                      (localQuantities[item.id] ?? item.quantity) - 1
                    )}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <div className="w-8 text-center relative">
                    {localQuantities[item.id] ?? item.quantity}
                    {pendingUpdates[item.id] && (
                      <div className="absolute -top-1 -right-1">
                        <Loader2 className="w-3 h-3 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={pendingUpdates[item.id]}
                    onClick={() => handleQuantityChange(
                      item.id,
                      (localQuantities[item.id] ?? item.quantity) + 1
                    )}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>

                  <div className="w-24 text-right font-medium">
                    ${(+item.price * (localQuantities[item.id] ?? item.quantity)).toFixed(2)}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={Object.values(pendingUpdates).some(pending => pending)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <Separator />
        <div className="flex justify-between items-center w-full">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-xl font-bold">${getTotalPrice().toFixed(2)}</span>
        </div>
        <Button 
          className="w-full"
          size="lg"
          onClick={handleCheckout}
          disabled={
            Object.values(pendingUpdates).some(pending => pending) || 
            isCheckingOut || 
            items.length === 0
          }
        >
          {isCheckingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Proceed to Checkout'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Cart;