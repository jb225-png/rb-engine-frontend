import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';
import { useProductsQuery } from '../hooks/useProducts';
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
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useProductsQuery({
    page,
    limit: 20,
    status: statusFilter as Product['status'] || undefined,
    type: typeFilter as Product['type'] || undefined,
    search: searchQuery || undefined,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleFilterChange = () => {
    setPage(1); // Reset to first page when filters change
  };

  return (
    <PageContainer>
      <PageHeader
        title="Products"
        description="Manage your curriculum products and content"
        actions={<Button variant="primary">Create New Product</Button>}
      />

      <Card>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleFilterChange();
            }}
          />
          <Select
            placeholder="Filter by status"
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              handleFilterChange();
            }}
          />
          <Select
            placeholder="Filter by type"
            options={typeOptions}
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              handleFilterChange();
            }}
          />
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
            <EmptyState
              title="Failed to load products"
              description="There was an error loading the products. Please try again."
              action={<Button variant="primary" onClick={() => window.location.reload()}>Retry</Button>}
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
                        <StatusBadge status={getStatusVariant(product.status)}>
                          {product.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{product.standardCode || '—'}</TableCell>
                      <TableCell>
                        {new Date(product.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            as={Link}
                            to={`/products/${product.id}`}
                          >
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <EmptyState
                        title="No products found"
                        description="No products match your current filters. Try adjusting your search criteria."
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