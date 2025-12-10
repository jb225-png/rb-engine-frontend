import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <div className="mb-6">
        <Link to="/products" className="text-primary-600 hover:text-primary-700 text-sm">
          ← Back to Products
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Product Details</h1>
        <div className="flex gap-3">
          <Button variant="outline">Edit</Button>
          <Button variant="secondary">Generate Content</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Product Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-neutral-500">Product ID</label>
                <p className="text-neutral-900">{id || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Product Name</label>
                <p className="text-neutral-900">Sample Product</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Description</label>
                <p className="text-neutral-900">Product details will be displayed here once data is loaded.</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Generated Content</h2>
            <p className="text-neutral-500">No content generated yet for this product.</p>
          </Card>
        </div>

        <div>
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Status</h2>
            <div className="space-y-4">
              <div>
                <span className="inline-block px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Created</label>
                <p className="text-neutral-900">Not available</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Last Modified</label>
                <p className="text-neutral-900">Not available</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
