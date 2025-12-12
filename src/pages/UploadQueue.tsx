import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { EmptyState } from '../components/ui/EmptyState';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';

export const UploadQueue: React.FC = () => {
  // TODO: Replace with real data from API
  const queueItems: any[] = [];

  return (
    <PageContainer>
      <PageHeader
        title="Upload Queue"
        description="Monitor and manage content upload processing"
        actions={<Button variant="primary">Add to Queue</Button>}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Queue Items Table */}
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
            {queueItems.length > 0 ? (
              queueItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.addedAt}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState
                    title="No items in queue"
                    description="Add items to start processing"
                    action={<Button variant="primary">Add to Queue</Button>}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </PageContainer>
  );
};
