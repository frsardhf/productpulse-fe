'use client'
import { Product } from '@/types/product'
import { useCart } from '@/hooks/use-cart'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useState } from 'react'

interface ProductCardProps {
  readonly product: Product
}

function formatPrice(price: number) {
  return (Math.round(price * 100) / 100).toFixed(2);
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    setIsButtonDisabled(true);
    
    try {
      await addToCart(product.id, 1)
      
      toast({
        className: "bg-background",
        description: `${product.name} added to cart`,
        duration: 2000,
      });
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
      })
    } finally {
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 2000); 
    }
  }
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-none">
        <div className="h-8 mb-2">
          <CardTitle className="text-xl line-clamp-2">{product.name}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 min-h-0">
        <div className="h-8 mb-4">
          <CardDescription className="line-clamp-3">
            {product.description}
          </CardDescription>
        </div>
        
        <div className="pt-2">
          <p className="text-lg font-semibold">
            ${formatPrice(product.price)}
          </p>
          <Badge
            variant={product.stock > 0 ? "secondary" : "destructive"}
            className="whitespace-nowrap"
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="flex-none mt-auto">
        <Button
          className="w-full"
          variant={product.stock > 0 ? "default" : "secondary"}
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isButtonDisabled}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}