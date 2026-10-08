"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ApiError {
  message?: string | string[];
}

function errorMessage(error: unknown): string {
  const message = (error as AxiosError<ApiError>).response?.data?.message;
  if (Array.isArray(message)) return message.join(", ");
  return message ?? "Please try again.";
}

export default function Cart() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const {
    items,
    isLoading,
    error,
    fetchItems,
    updateQuantity,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
  } = useCart();
  const [updatingProductId, setUpdatingProductId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?returnUrl=%2Fcart");
    } else if (user) {
      void fetchItems();
    }
  }, [authLoading, fetchItems, router, user]);

  const changeQuantity = async (productId: number, quantity: number) => {
    setUpdatingProductId(productId);
    try {
      await updateQuantity(productId, quantity);
    } catch (requestError) {
      toast({
        variant: "destructive",
        title: "Could not update quantity",
        description: errorMessage(requestError),
      });
    } finally {
      setUpdatingProductId(null);
    }
  };

  const removeItem = async (productId: number) => {
    setUpdatingProductId(productId);
    try {
      await removeFromCart(productId);
    } catch (requestError) {
      toast({
        variant: "destructive",
        title: "Could not remove item",
        description: errorMessage(requestError),
      });
    } finally {
      setUpdatingProductId(null);
    }
  };

  if (authLoading || isLoading || !user) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading cart</span>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-red-600" />
        <h1 className="mt-4 text-xl font-semibold text-red-950">
          Your cart could not be loaded
        </h1>
        <Button className="mt-5" variant="outline" onClick={() => fetchItems()}>
          Try again
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="mx-auto max-w-3xl">
        <CardContent className="px-6 py-16 text-center">
          <ShoppingCart className="mx-auto h-11 w-11 text-primary/60" />
          <h1 className="mt-4 text-2xl font-semibold">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse the catalogue to add a demo item.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Browse catalogue</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isUpdating = updatingProductId !== null;

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section aria-labelledby="cart-heading">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Shopping cart</p>
            <h1 id="cart-heading" className="text-3xl font-bold tracking-tight">
              {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
            </h1>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-primary hover:underline"
          >
            Continue shopping
          </Link>
        </div>

        <div className="space-y-3">
          {items.map((item) => {
            const pending = updatingProductId === item.id;
            return (
              <article
                key={item.id}
                className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-slate-950">
                      {item.name}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="mt-2 text-sm font-medium">
                      ${Number(item.price).toFixed(2)} each
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                    <div
                      className="flex items-center rounded-lg border"
                      aria-label={`Quantity for ${item.name}`}
                    >
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label={`Decrease ${item.name} quantity`}
                        disabled={isUpdating || item.quantity <= 1}
                        onClick={() =>
                          changeQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span
                        className="w-9 text-center text-sm font-semibold"
                        aria-live="polite"
                      >
                        {pending ? (
                          <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label={`Increase ${item.name} quantity`}
                        disabled={isUpdating || item.quantity >= item.stock}
                        onClick={() =>
                          changeQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="w-24 text-right font-semibold">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label={`Remove ${item.name} from cart`}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      disabled={isUpdating}
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {item.stock} available in local demo inventory
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <aside className="h-fit rounded-2xl border bg-white p-5 shadow-sm lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <div className="mt-5 flex items-center justify-between border-t pt-5">
          <span className="font-medium">Demo total</span>
          <span className="text-2xl font-bold">
            ${getTotalPrice().toFixed(2)}
          </span>
        </div>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          The server recalculates prices and inventory when the order is
          confirmed.
        </p>
        <Button
          className="mt-5 w-full"
          size="lg"
          disabled={isUpdating}
          onClick={() => router.push("/checkout")}
        >
          Continue to checkout
        </Button>
        <div className="mt-4 flex gap-2 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          Portfolio demo only. No payment is collected and no order is sent to
          the merchandise source.
        </div>
      </aside>
    </div>
  );
}
