'use client';
import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { AxiosError } from 'axios';
import { AdminProtection } from '@/components/auth/AdminProtection';
import { ErrorResponse } from '@/types/admin';
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Order } from '@/types/order';

type SortField = 'id' | 'status' | 'totalPrice' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface SortIconProps {
  currentSortField: SortField;
  field: SortField;
  direction: SortDirection;
}

const SortIcon: React.FC<SortIconProps> = ({ currentSortField, field, direction }) => {
  if (currentSortField !== field) return null;
  return direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
};

const badgeVariants = {
  pending: "border-transparent bg-yellow-500 text-white shadow hover:bg-yellow-500/80",
  processing: "border-transparent bg-blue-500 text-white shadow hover:bg-blue-500/80",
  shipped: "border-transparent bg-green-500 text-white shadow hover:bg-green-500/80",
  cancelled: "border-transparent bg-red-500 text-white shadow hover:bg-red-500/80",
};

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [processingOrderId, setProcessingOrderId] = useState<number | null>(null);

  function formatPrice(price: string | number) {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return (Math.round(numericPrice * 100) / 100).toFixed(2);
  }

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      console.log(err);
      setError('Failed to fetch orders');
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    setProcessingOrderId(id);
    try {
      await api.put(`/orders/${id}`, { status });
      setSuccess('Order status updated successfully');
      fetchOrders();
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(Array.isArray(axiosError.response?.data?.message)
        ? axiosError.response?.data?.message.join(', ')
        : axiosError.response?.data?.message ?? 'An error occurred');
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'id':
        comparison = a.id - b.id;
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'totalPrice':
        comparison = parseFloat(a.totalPrice) - parseFloat(b.totalPrice);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderSortableHeader = (field: SortField, label: string) => (
    <th
      className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 bg-gray-50"
      style={{ minWidth: getColumnWidth(field) }}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <SortIcon currentSortField={sortField} field={field} direction={sortDirection} />
      </div>
    </th>
  );

  const getColumnWidth = (field: SortField | 'actions') => {
    switch (field) {
      case 'id':
        return '120px';  
      case 'status':
        return '150px';  
      case 'totalPrice':
        return '150px';  
      case 'createdAt':
        return '150px';  
      case 'actions':
        return '300px';  
      default:
        return 'auto';
    }
  };

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

      <div className="h-[600px] flex flex-col border border-gray-200 rounded-lg">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {renderSortableHeader('id', 'Order ID')}
                  {renderSortableHeader('status', 'Status')}
                  {renderSortableHeader('totalPrice', 'Total Price')}
                  {renderSortableHeader('createdAt', 'Date')}
                  <th 
                    className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                    style={{ minWidth: getColumnWidth('actions') }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 overflow-y-auto">
                {sortedOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap" style={{ width: getColumnWidth('id') }}>
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ width: getColumnWidth('status') }}>
                      <span className={cn(
                        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors",
                        badgeVariants[order.status.toLowerCase() as keyof typeof badgeVariants]
                      )}>
                        {order.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ width: getColumnWidth('totalPrice') }}>
                      ${formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ width: getColumnWidth('createdAt') }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ width: getColumnWidth('actions') }}>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'processing')}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
                          disabled={processingOrderId === order.id}
                        >
                          Processing
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'shipped')}
                          className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition-colors"
                          disabled={processingOrderId === order.id}
                        >
                          Shipped
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors"
                          disabled={processingOrderId === order.id}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProtection(OrderManagement);