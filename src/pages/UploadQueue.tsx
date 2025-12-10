import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';

export const UploadQueue: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Upload Queue</h1>
        <Button variant="primary">Add to Queue</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-warning-500">0</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Processing</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Completed</h3>
          <p className="text-3xl font-bold text-success-500">0</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Queue Items</h2>
        
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Item Name</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Added</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center text-neutral-500 py-8">
                No items in queue. Add items to start processing.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
