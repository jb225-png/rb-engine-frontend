import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Pagination } from '../components/ui/Pagination';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';
import { useProductsQuery, useUpdateProductStatus } from '../hooks/useProducts';
import { Product } from '../types/api';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'Review' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'course', label: 'Course' },
  { value: 'module', label: 'Module' },
  { value: 'lesson', label: 'Lesson' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'activity', label: 'Activity' },
  { value: 'resource', label: 'Resource' },
];

const getStatusVariant = (status: Product['status']) => {
  switch (status) {
    case 'published': return 'success';
    case 'draft': return 'pending';
    case 'review': return 'generating';
    case 'archived': return 'error';
    default: return 'pending';
  }
};

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [successMessage, setSuccessMessage] = useState('');
  
  // Get filters from URL params
  const page = parseInt(searchParams.get('page') || '1');
  const statusFilter = searchParams.get('status') || '';
  const typeFilter = searchParams.get('type') || '';
  const searchQuery = searchParams.get('search') || '';

  const { data, isLoading, error } = useProductsQuery({
    page,
    limit: 20,
    status: statusFilter as Product['status'] || undefined,
    type: typeFilter as Product['type'] || undefined,
    search: searchQuery || undefined,
  });

  const updateStatusMutation = useUpdateProductStatus();

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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

  const handleStatusUpdate = async (productId: string, newStatus: Product['status']) => {
    try {
      await updateStatusMutation.mutateAsync({ id: productId, status: newStatus });
      setSuccessMessage('Product status updated successfully');
    } catch (error) {
      console.error('Failed to update product status:', error);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Products"
        description="Manage your curriculum products and content"
        actions={<Button variant="primary">Create New Product</Button>}
      />

      {successMessage && (
        <Alert variant="success" title="Success" description={successMessage} />
      )}

      <Card>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => updateSearchParams({ search: e.target.value })}
          />
          <Select
            placeholder="Filter by status"
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => updateSearchParams({ status: e.target.value })}
          />
          <Select
            placeholder="Filter by type"
            options={typeOptions}
            value={typeFilter}
            onChange={(e) => updateSearchParams({ type: e.target.value })}
          />
          <Button
            variant="outline"
            onClick={() => setSearchParams({})}
            disabled={!statusFilter && !typeFilter && !searchQuery}
          >
            Clear Filters
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
            <span className="ml-3 text-neutral-600">Loading products...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-12">
            <Alert
              variant="error"
              title="Failed to load products"
              description="There was an error loading the products. Please try again."
            />
          </div>
        )}

        {/* Products Table */}
        {!isLoading && !error && (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Product Name</TableHeader>
                  <TableHeader>Type</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Standard</TableHeader>
                  <TableHeader>Created</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data.length ? (
                  data.data.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Link 
                          to={`/products/${product.id}`}
                          className="font-medium text-primary-600 hover:text-primary-700"
                        >
                          {product.name}
                        </Link>
                      </TableCell>
                      <TableCell className="capitalize">{product.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={getStatusVariant(product.status)}>
                            {product.status}
                          </StatusBadge>
                          <select
                            value={product.status}
                            onChange={(e) => handleStatusUpdate(product.id, e.target.value as Product['status'])}
                            disabled={updateStatusMutation.isLoading}
                            className="text-xs border border-neutral-300 rounded px-1 py-0.5 ml-2"
                          >
                            <option value="draft">Draft</option>
                            <option value="review">Review</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </TableCell>
                      <TableCell>{product.standardCode || '—'}</TableCell>
                      <TableCell>
                        {new Date(product.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          as={Link}
                          to={`/products/${product.id}`}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <EmptyState
                        title="No products found"
                        description={
                          statusFilter || typeFilter || searchQuery
                            ? "No products match your current filters. Try adjusting your search criteria."
                            : "No products have been created yet. Create your first product to get started."
                        }
                        action={<Button variant="primary">Create New Product</Button>}
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