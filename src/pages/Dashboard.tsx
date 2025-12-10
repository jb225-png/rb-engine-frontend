import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">Total Products</h3>
          <p className="text-4xl font-bold text-primary-600">0</p>
          <p className="text-sm text-neutral-500 mt-2">Curriculum products in system</p>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">Pending Uploads</h3>
          <p className="text-4xl font-bold text-warning-500">0</p>
          <p className="text-sm text-neutral-500 mt-2">Items in upload queue</p>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">Active Bundles</h3>
          <p className="text-4xl font-bold text-success-500">0</p>
          <p className="text-sm text-neutral-500 mt-2">Product bundles configured</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Button variant="primary">Generate New Product</Button>
          <Button variant="secondary">View Upload Queue</Button>
          <Button variant="outline">Manage Bundles</Button>
        </div>
      </Card>
    </div>
  );
};
