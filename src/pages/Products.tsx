import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';

export const Products: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your curriculum products and content"
        actions={<Button variant="primary">Create New Product</Button>}
      />

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
