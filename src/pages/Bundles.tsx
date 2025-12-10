import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Bundles: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Product Bundles</h1>
        <Button variant="primary">Create Bundle</Button>
      </div>

      <p className="text-neutral-600 mb-6">
        Organize and group related products into bundles for easier management and distribution.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-2 border-dashed border-neutral-300 flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <p className="text-neutral-500 mb-4">No bundles created yet</p>
            <Button variant="outline" size="sm">Create Your First Bundle</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
