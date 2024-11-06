'use client';
import React from 'react';
import ProductManagement from '@/components/admin/ProductManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import { AdminProtection } from '@/components/auth/AdminProtection';

const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-[50px]">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text:primary mb-2">
            Admin Dashboard
          </h1>
          
          <div className="space-y-8">
            <ProductManagement />
            <OrderManagement />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProtection(AdminPage);