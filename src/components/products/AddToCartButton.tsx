"use client";

import { useState } from "react";
import { Loader2, LogIn, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Button, ButtonProps } from "@/components/ui/button";

interface AddToCartButtonProps extends Omit<ButtonProps, "onClick"> {
  readonly product: Product;
  readonly returnUrl: string;
}

export default function AddToCartButton({
  product,
  returnUrl,
  ...buttonProps
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const handleAdd = async () => {
    if (!user) {
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
      toast({
        className: "bg-background",
        title: "Added to cart",
        description: product.name,
        duration: 2200,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Could not add this item",
        description: "Check the available stock and try again.",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <Button
      {...buttonProps}
      type="button"
      onClick={handleAdd}
      disabled={isOutOfStock || isAdding || buttonProps.disabled}
      variant={isOutOfStock ? "secondary" : buttonProps.variant}
    >
      {isAdding ? (
        <Loader2 className="animate-spin" />
      ) : user ? (
        <ShoppingBag />
      ) : (
        <LogIn />
      )}
      {isOutOfStock
        ? "Out of stock"
        : user
          ? isAdding
            ? "Adding..."
            : "Add to cart"
          : "Sign in to add"}
    </Button>
  );
}
