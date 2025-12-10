import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';

export const Products: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Products</h1>
        <Button variant="primary">Create New Product</Button>
      </div>

      <Card>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Product Name</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Created</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center text-neutral-500 py-8">
                No products found. Create your first product to get started.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
