'use client'
import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import ProductCard from '@/components/products/ProductCard'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2, Loader, Search } from "lucide-react"
import api from '@/lib/axios'
import { Product } from '@/types/product'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export default function ProductList() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const limit = 10
  const router = useRouter()

  const debouncedSearch = useDebounce(searchInput, 500)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['products', page, debouncedSearch],
    queryFn: () => 
      api.get(`/products?page=${page}&limit=${limit}&search=${debouncedSearch}`)
        .then(res => res.data),
    refetchOnWindowFocus: false,
  })

  const isLoadingResults = isLoading || (isFetching && page === 1)
  const isLoadingMore = isFetching && page > 1

  const products = useMemo(() => data ?? [], [data])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    setIsSearching(true)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error loading products. Please try again later.</p>
      </div>
    )
  }

  return (
    <Card className="w-full h-screen max-h-[calc(100vh-100px)] flex flex-col">
      <CardHeader className="flex-none">
        <CardTitle className="text-3xl font-bold text-primary">Products</CardTitle>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full max-w-sm">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              {isSearching && isFetching && (
                <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-pulse text-primary" />
              )}
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/cart')}
            className="flex items-center gap-2 hover:text-primary hover:border-primary"
          >
            <ShoppingCart className="h-4 w-4" />
            View Cart
          </Button>
        </div>
      </CardHeader>
      <Separator className="bg-border" />
      
      <CardContent className="flex-1 overflow-y-auto pt-4">
        {isLoadingResults ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {products.length > 0 && (
              <div className="flex justify-center mt-8 mb-4">
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={isLoadingMore}
                  className="w-full sm:w-auto hover:text-primary hover:border-primary"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading more...
                    </>
                  ) : (
                    "Load more"
                  )}
                </Button>
              </div>
            )}

            {products.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchInput ? 'No products found matching your search' : 'No products available'}
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}