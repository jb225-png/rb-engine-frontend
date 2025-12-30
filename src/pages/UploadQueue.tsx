import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Select } from '../components/ui/Select';
import { Pagination } from '../components/ui/Pagination';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';
import { useUploadTasksQuery } from '../hooks/useUploadTasks';
import { UploadTask } from '../types/api';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

const getStatusVariant = (status: UploadTask['status']) => {
  switch (status) {
    case 'COMPLETED': return 'success';
    case 'IN_PROGRESS': return 'generating';
    case 'PENDING': return 'pending';
    default: return 'pending';
  }
};

export const UploadQueue: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get filters from URL params
  const page = parseInt(searchParams.get('page') || '1');
  const statusFilter = searchParams.get('status') || '';

  const { data, isLoading, error } = useUploadTasksQuery({
    page,
    limit: 20,
    status: statusFilter as UploadTask['status'] || undefined,
  });

  const updateSearchParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    // Reset page when filters change
    if (Object.keys(updates).some(key => key !== 'page')) {
      newParams.delete('page');
    }
    
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    updateSearchParams({ page: newPage.toString() });
  };

  // Calculate stats from current data
  const stats = {
    pending: data?.data.filter(task => task.status === 'PENDING').length || 0,
    processing: data?.data.filter(task => task.status === 'IN_PROGRESS').length || 0,
    completed: data?.data.filter(task => task.status === 'COMPLETED').length || 0,
  };

  return (
    <PageContainer>
      <PageHeader
        title="Upload Queue"
        description="Monitor and manage content upload processing"
        actions={<Button variant="primary" disabled>Add to Queue</Button>}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Pending</h3>
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <p className="text-3xl font-bold text-warning-500">{stats.pending}</p>
              <p className="text-sm text-neutral-500 mt-1">Awaiting processing</p>
            </>
          )}
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-neutral-500 mb-2">In Progress</h3>
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <p className="text-3xl font-bold text-primary-600">{stats.processing}</p>
              <p className="text-sm text-neutral-500 mt-1">Currently processing</p>
            </>
          )}
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Completed</h3>
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <p className="text-3xl font-bold text-success-500">{stats.completed}</p>
              <p className="text-sm text-neutral-500 mt-1">Successfully processed</p>
            </>
          )}
        </Card>
      </div>

      {/* Queue Items Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Upload Tasks</h2>
          
          {/* Filters */}
          <div className="flex gap-4">
            <Select
              placeholder="Filter by status"
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => updateSearchParams({ status: e.target.value })}
            />
            <Button
              variant="outline"
              onClick={() => setSearchParams({})}
              disabled={!statusFilter}
            >
              Clear Filters
            </Button>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
            <span className="ml-3 text-neutral-600">Loading upload tasks...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-12">
            <EmptyState
              title="Failed to load upload tasks"
              description="There was an error loading the upload tasks. Please try again."
              action={<Button variant="primary" onClick={() => window.location.reload()}>Retry</Button>}
            />
          </div>
        )}

        {/* Upload Tasks Table */}
        {!isLoading && !error && (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Product</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Assigned User</TableHeader>
                  <TableHeader>Created</TableHeader>
                  <TableHeader>Updated</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data.length ? (
                  data.data.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-neutral-900">
                            Product #{task.product_id || 'Unknown'}
                          </p>
                          <p className="text-sm text-neutral-500">Task ID: {task.id.slice(-8)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={getStatusVariant(task.status)}>
                          {task.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{task.assigned_to || '—'}</TableCell>
                      <TableCell>
                        {new Date(task.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(task.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" disabled>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <EmptyState
                        title="No upload tasks found"
                        description={
                          statusFilter
                            ? "No upload tasks match your current filter. Try adjusting your search criteria."
                            : "No upload tasks have been created yet. Upload tasks will appear here when content is queued for processing."
                        }
                        action={statusFilter ? (
                          <Button variant="outline" onClick={() => setSearchParams({})}>
                            Clear Filters
                          </Button>
                        ) : (
                          <Button variant="primary" disabled>
                            Add to Queue
                          </Button>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {data?.pagination && data.pagination.totalPages > 1 && (
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <Pagination
                  currentPage={data.pagination.page}
                  totalPages={data.pagination.totalPages}
                  totalItems={data.pagination.total}
                  itemsPerPage={data.pagination.limit}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </PageContainer>
  );
};
