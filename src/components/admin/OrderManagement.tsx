'use client';
import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { AxiosError } from 'axios';
import { AdminProtection } from '@/components/auth/AdminProtection';

interface Order {
  id: number;
  userId: number;
  productsId: number[];
  status: string;
  totalPrice: string;
  shippingAddress: string;
  createdAt: string;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders');
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/orders/${id}`, { status });
      setSuccess('Order status updated successfully');
      fetchOrders();
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(Array.isArray(axiosError.response?.data?.message) 
        ? axiosError.response?.data?.message.join(', ') 
        : axiosError.response?.data?.message || 'An error occurred');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Order Management</h2>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-500 p-4 rounded-md mb-4">
          {success}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.totalPrice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'Completed')}
                    className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition-colors"
                  >
                    Mark as Completed
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProtection(OrderManagement);