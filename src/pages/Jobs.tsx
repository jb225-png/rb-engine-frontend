import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Pagination } from '../components/ui/Pagination';
import { Select } from '../components/ui/Select';
import { Alert } from '../components/ui/Alert';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';
import { useGenerationJobsQuery } from '../hooks/useGeneration';
import { GenerationJob } from '../types/api';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'RUNNING', label: 'Running' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'FAILED', label: 'Failed' },
];

const getStatusVariant = (status: GenerationJob['status']) => {
  switch (status) {
    case 'COMPLETED': return 'success';
    case 'RUNNING': return 'generating';
    case 'PENDING': return 'pending';
    case 'FAILED': return 'error';
    default: return 'pending';
  }
};

export const Jobs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get filters from URL params
  const page = parseInt(searchParams.get('page') || '1');
  const statusFilter = searchParams.get('status') || '';

  const { data, isLoading, error } = useGenerationJobsQuery({
    limit: 20,
    offset: (page - 1) * 20,
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

  // Filter jobs client-side until backend supports filtering
  const jobs = data && Array.isArray(data.data) ? data.data : [];
  const filteredJobs = jobs.filter(job => 
    !statusFilter || job.status === statusFilter
  );

  return (
    <PageContainer>
      <PageHeader
        title="Generation Jobs"
        description="Monitor and manage content generation jobs"
        actions={
          <Button variant="primary" onClick={() => window.location.href = '/quick-generate'}>
            Create New Job
          </Button>
        }
      />

      <Card>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
            <span className="ml-3 text-neutral-600">Loading generation jobs...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-12">
            <Alert
              variant="error"
              title="Failed to load generation jobs"
              description="There was an error loading the generation jobs. Please try again."
            />
          </div>
        )}

        {/* Jobs Table */}
        {!isLoading && !error && (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Job ID</TableHeader>
                  <TableHeader>Standard Code</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Products</TableHeader>
                  <TableHeader>Created</TableHeader>
                  <TableHeader>Completed</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs.length ? (
                  filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <span className="font-mono text-sm">#{job.id.slice(-8)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">Standard #{job.standard_id}</span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={getStatusVariant(job.status)}>
                          {job.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{job.total_products || '—'}</TableCell>
                      <TableCell>
                        {new Date(job.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {job.updated_at 
                          ? new Date(job.updated_at).toLocaleDateString()
                          : '—'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled>
                            View
                          </Button>
                          {job.status === 'FAILED' && (
                            <Button variant="outline" size="sm" disabled>
                              Retry
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <EmptyState
                        title="No generation jobs found"
                        description={
                          statusFilter
                            ? "No jobs match your current filter. Try adjusting your search criteria."
                            : "No generation jobs have been created yet. Create your first job to get started."
                        }
                        action={
                          <Button 
                            variant="primary" 
                            onClick={() => window.location.href = '/quick-generate'}
                          >
                            Create New Job
                          </Button>
                        }
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