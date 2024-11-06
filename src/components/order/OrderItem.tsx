import React, { useEffect, useState } from 'react';
import { Package, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from '@/types/product';
import api from '@/lib/axios';

interface OrderItemProps {
  order: {
    id: number;
    status: string;
    totalPrice: string;
    shippingAddress: string;
    createdAt: string;
    orderItems: {
      id: number;
      orderId: number;
      productId: number;
      quantity: number;
      price: string;
    }[];
  };
}

const ProductInfo: React.FC<{ productId: number; quantity: number }> = ({ productId, quantity }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <span className="text-sm font-medium text-destructive">
          Product ID: {productId}
        </span>
        <span className="text-sm text-muted-foreground ml-2">
          Qty: {quantity}
        </span>
      </div>
    );
  }

  return (
    <div>
      <div className="text-sm font-medium">
        {product?.name}
      </div>
      <div className="text-sm text-muted-foreground">
        ID: {productId} • Qty: {quantity}
      </div>
    </div>
  );
};

const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'pending';
      case 'processing':
        return 'processing';
      case 'shipped':
        return 'shipped';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'default';
    }
  };

  return (
    <Badge variant={getStatusVariant(status)}>
      {status.toLowerCase()}
    </Badge>
  );
};

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">
              Order #{order.id}
            </h2>
            <OrderStatusBadge status={order.status} />
          </div>
          <span className="text-lg font-bold">
            ${Number(order.totalPrice).toFixed(2)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-5 h-5" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            <span className="truncate">{order.shippingAddress}</span>
          </div>
        </div>

        <div className="border-t">
          <h3 className="text-sm font-semibold mt-2 mb-1">
            Order Items
          </h3>
          <ScrollArea className="h-[120px]">
            <div className="space-y-1">
              {order.orderItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 px-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-muted-foreground" />
                    <ProductInfo productId={item.productId} quantity={item.quantity} />
                  </div>
                  <span className="text-sm font-medium">
                    ${Number(item.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderItem;