import React from 'react';
import OrderItem from './OrderItem';
import { PackageX } from 'lucide-react';

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
  if (orders.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
        <PackageX className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          No Orders Yet
        </h3>
        <p className="text-gray-500">
          When you place orders, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Your Orders ({orders.length})
        </h1>
      </div>
      {orders.map(order => (
        <OrderItem key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrderList;