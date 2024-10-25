'use client';
import { Product } from '@/types/product';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="w-full">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.description}</p>
      <p className="text-lg font-bold mt-2">${product.price}</p>
      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
      <Button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent the link from triggering
            addToCart(product.id, 1);
          }}
          disabled={product.stock === 0}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-1 mt-4"
        >
          Add to Cart </Button>
    </Card> 
  );
}