'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/products/ProductCard';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import api from '@/lib/axios';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types/product';
import { useRouter } from 'next/navigation';

export default function ProductList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 10;
  const { getTotalItems, getTotalPrice } = useCart();
  const router = useRouter();

  console.log('Total Items:', getTotalItems());
  console.log('Total Price:', getTotalPrice());

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, search],
    queryFn: () =>
      api.get(`/products?page=${page}&limit=${limit}&search=${search}`)
        .then(res => res.data),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const products = data ?? [];
  console.log('Products Data:', products);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button 
          variant="primary" 
          onClick={() => router.push('/cart')}
          className="text-sm font-medium"
        >
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button 
          variant="primary"
          onClick={() => setPage(page + 1)}
          className="w-full sm:w-auto"
        >
          Load more
        </Button>
      </div>
    </div>
  );
}