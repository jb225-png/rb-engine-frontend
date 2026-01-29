import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { StatusBadge } from '../components/ui/StatusBadge';
import { FilterBar } from '../components/ui/FilterBar';
import { FilterSelect } from '../components/ui/FilterSelect';
import { EmptyState } from '../components/ui/EmptyState';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';
import { api, Product } from '../api/client';

const statusOptions = [
  { value: 'GENERATED', label: 'Generated' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'FAILED', label: 'Failed' }
];

const typeOptions = [
  { value: 'WORKSHEET', label: 'Worksheet' },
  { value: 'QUIZ', label: 'Quiz' },
  { value: 'PASSAGE', label: 'Passage' },
  { value: 'ASSESSMENT', label: 'Assessment' }
];

export const Products: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchProducts = React.useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.product_type = typeFilter;
      
      const response = await api.getProducts(params);
      setProducts(response.data?.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    fetchProducts();
  }, [statusFilter, typeFilter]);

  const clearFilters = () => {
    setStatusFilter('');
    setTypeFilter('');
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'GENERATED': return 'Generated';
      case 'DRAFT': return 'Draft';
      case 'FAILED': return 'Failed';
      default: return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'GENERATED': return 'success';
      case 'DRAFT': return 'pending';
      case 'FAILED': return 'error';
      default: return 'pending';
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Products" description="Loading products..." />
        <div className="flex justify-center py-12">
          <div className="text-neutral-500">Loading products...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Products"
        description="Manage your curriculum products and content"
        actions={<Button variant="primary">Create Product</Button>}
      />

      <Card>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">All Products</h2>
        
        {/* Filters */}
        <FilterBar onClear={clearFilters}>
          <FilterSelect
            label="Status"
            value={statusFilter}
            options={statusOptions}
            onChange={setStatusFilter}
            placeholder="All Statuses"
          />
          <FilterSelect
            label="Type"
            value={typeFilter}
            options={typeOptions}
            onChange={setTypeFilter}
            placeholder="All Types"
          />
        </FilterBar>
        
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Product ID</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Grade</TableHeader>
              <TableHeader>Curriculum</TableHeader>
              <TableHeader>Created</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow 
                  key={product.id} 
                  clickable
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <TableCell>
                    <span className="font-medium">#{product.id}</span>
                  </TableCell>
                  <TableCell>{product.product_type}</TableCell>
                  <TableCell>
                    <StatusBadge status={getStatusVariant(product.status)}>
                      {getStatusLabel(product.status)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>Grade {product.grade_level}</TableCell>
                  <TableCell>{product.curriculum_board}</TableCell>
                  <TableCell>{new Date(product.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${product.id}`);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyState
                    title="No products found"
                    description="No products match your current filters or none have been created yet"
                    action={<Button variant="primary">Create Product</Button>}
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