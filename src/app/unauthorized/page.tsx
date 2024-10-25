import React from 'react';
import Unauthorized from '@/components/ui/unauthorized';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="space-y-8">
        <Unauthorized />
      </div>
    </div>
  );
};

export default UnauthorizedPage;