import React from 'react';
import { PackageX } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import OrderItem from './OrderItem';

interface Order {
  id: number;
  userId: number;
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
}

interface OrderListProps {
  orders: Order[];
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <PackageX className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-1">
          No Orders Yet
        </h3>
        <p className="text-muted-foreground">
          When you place orders, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">
          Your Orders ({orders.length})
        </h1>
      </div>
      <ScrollArea className="flex-1 -mx-6 px-4">
        <div className="space-y-2 pb-2">
        {sortedOrders.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default OrderList;