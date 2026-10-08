"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/types/order";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ApiError {
  message?: string | string[];
}

function checkoutError(error: unknown): string {
  const response = (error as AxiosError<ApiError>).response;
  const message = response?.data?.message;
  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string") return message;
  return "The order could not be confirmed. Your cart is still available.";
}

export default function Checkout() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { items, isLoading, getTotalPrice, clearCart, fetchItems } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const idempotencyKey = useRef<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?returnUrl=%2Fcheckout");
    } else if (user) {
      void fetchItems();
    }
  }, [authLoading, fetchItems, router, user]);

  const handleConfirmOrder = async (event: FormEvent) => {
    event.preventDefault();
    const address = shippingAddress.trim();
    if (address.length < 10 || address.length > 500) {
      setError(
        "Enter a fictitious shipping address between 10 and 500 characters.",
      );
      return;
    }

    if (!idempotencyKey.current) {
      idempotencyKey.current = crypto.randomUUID();
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await api.post<Order>("/orders/checkout", {
        shippingAddress: address,
        idempotencyKey: idempotencyKey.current,
      });

      clearCart();
      toast({
        title: `Demo order #${response.data.id} confirmed`,
        description: "No payment was collected.",
      });
      router.replace(`/order?created=${response.data.id}`);
    } catch (requestError) {
      setError(checkoutError(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading || !user) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading checkout</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="px-6 py-14 text-center">
          <AlertCircle className="mx-auto h-9 w-9 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-semibold">
            There is nothing to confirm
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add an in-stock item before starting checkout.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Browse catalogue</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to cart
      </Link>

      <div className="mt-5">
        <p className="text-sm font-medium text-primary">Final review</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Confirm demo order
        </h1>
      </div>

      <Alert className="mt-6 border-amber-200 bg-amber-50 text-amber-950">
        <ShieldCheck className="h-4 w-4" />
        <AlertTitle>Simulated checkout</AlertTitle>
        <AlertDescription>
          Use fictitious address details. No payment is collected and this order
          is not sent to Good Smile US.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive" className="mt-4" role="alert">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Could not confirm order</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={handleConfirmOrder}
        className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.75fr)]"
      >
        <Card>
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-5 py-4 first:pt-0"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.quantity} × ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t pt-5 text-lg font-semibold">
              <span>Estimated total</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              The backend derives the final total from current product records.
            </p>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Demo shipping address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <label htmlFor="shipping-address" className="text-sm font-medium">
              Address
            </label>
            <Textarea
              id="shipping-address"
              value={shippingAddress}
              onChange={(event) => setShippingAddress(event.target.value)}
              placeholder="123 Demo Street, Sample City"
              minLength={10}
              maxLength={500}
              required
              disabled={isSubmitting}
              className="mt-2 min-h-32"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Do not enter a real home address in this public portfolio demo.
            </p>
            <Button
              type="submit"
              className="mt-5 w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" /> Confirming safely...
                </>
              ) : (
                <>
                  <CheckCircle2 /> Confirm demo order
                </>
              )}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Retrying a failed submission reuses the same confirmation key.
            </p>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
