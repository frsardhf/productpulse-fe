import React from 'react';
import { Package, Truck, Calendar, MapPin } from 'lucide-react';

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

const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColors = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColors(status)}`}>
      {status}
    </span>
  );
};

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Order #{order.id}
            </h2>
            <OrderStatusBadge status={order.status} />
          </div>
          <span className="text-lg font-bold text-gray-900">
            ${Number(order.totalPrice).toFixed(2)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Truck className="w-5 h-5" />
            <span>{order.status}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span className="truncate">{order.shippingAddress}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Order Items
          </h3>
          <div className="space-y-3">
            {order.orderItems.map(item => (
              <div 
                key={item.id}
                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Product ID: {item.productId}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  ${Number(item.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;