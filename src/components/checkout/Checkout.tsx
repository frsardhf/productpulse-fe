'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, MapPin, CreditCard, ShoppingCart } from "lucide-react"
import { useCart } from '@/hooks/use-cart'
import api from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

const Checkout = () => {
  const router = useRouter()
  const { toast } = useToast()
  const { items, getTotalPrice, clearCart, fetchItems } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shippingAddress, setShippingAddress] = useState('')

  const getAuthToken = () => {
    const token = localStorage.getItem('token')
    if (!token) return null
    return token
  }

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleReturnToCart = () => {
    router.push('/cart')
  }

  const handleConfirmOrder = async () => {
    if (!shippingAddress.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a shipping address",
      })
      return
    }
  
    const token = getAuthToken()
    if (!token) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to continue",
      })
      router.push('/login')
      return
    }
  
    try {
      setIsLoading(true)
      setError(null)
      const validateResponse = await api.post('/orders/validate', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      })
      console.log(validateResponse)

      const createResponse = await api.post('/orders/create', {
        shippingAddress: shippingAddress,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
  
      if (createResponse.status === 201) {
        clearCart()
        toast({
          title: "Order Confirmed",
          description: "Your order has been successfully placed!",
        })
        router.push(`/order`)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to confirm order. Please checkout again in cart.",
      })
      console.error('Error confirming order:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(+item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your shipping address..."
              className="min-h-[100px]"
            />
            <div className="flex flex-col space-y-2">
              <Button
                onClick={handleConfirmOrder}
                disabled={isLoading || !shippingAddress.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Confirm Order'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleReturnToCart}
                className="w-full"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Return to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Checkout