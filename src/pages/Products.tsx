import React, { useState } from 'react';
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

interface Product {
  id: string;
  name: string;
  type: string;
  status: 'success' | 'generating' | 'error';
  standard: string;
  createdAt: string;
}

// TODO: Replace with real data from API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Numbers and Operations - Class 3',
    type: 'Course',
    status: 'success',
    standard: 'CBSE.MATH.CLASS3.NUMBERS',
    createdAt: '2024-01-15 14:30'
  },
  {
    id: '2',
    name: 'Reading Comprehension - Class 4',
    type: 'Module',
    status: 'generating',
    standard: 'CBSE.ENGLISH.CLASS4.READING',
    createdAt: '2024-01-15 13:45'
  },
  {
    id: '3',
    name: 'Plant Life Cycle - Class 5',
    type: 'Lesson',
    status: 'error',
    standard: 'CBSE.SCIENCE.CLASS5.PLANTS',
    createdAt: '2024-01-15 12:20'
  }
];

const statusOptions = [
  { value: 'success', label: 'Completed' },
  { value: 'generating', label: 'Generating' },
  { value: 'error', label: 'Error' }
];

const typeOptions = [
  { value: 'course', label: 'Course' },
  { value: 'module', label: 'Module' },
  { value: 'lesson', label: 'Lesson' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'activity', label: 'Activity' },
  { value: 'resource', label: 'Resource' }
];

export const Products: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredProducts = mockProducts.filter(product => {
    const matchesStatus = !statusFilter || product.status === statusFilter;
    const matchesType = !typeFilter || product.type.toLowerCase() === typeFilter;
    return matchesStatus && matchesType;
  });

  const clearFilters = () => {
    setStatusFilter('');
    setTypeFilter('');
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success': return 'Completed';
      case 'generating': return 'Generating';
      case 'error': return 'Error';
      default: return status;
    }
  };

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
              <TableHeader>Product Name</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Standard</TableHeader>
              <TableHeader>Created</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow 
                  key={product.id} 
                  clickable
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <TableCell>
                    <span className="font-medium">{product.name}</span>
                  </TableCell>
                  <TableCell>{product.type}</TableCell>
                  <TableCell>
                    <StatusBadge status={product.status}>
                      {getStatusLabel(product.status)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-mono">{product.standard}</span>
                  </TableCell>
                  <TableCell>{product.createdAt}</TableCell>
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
                <TableCell colSpan={6}>
                  <EmptyState
                    title={mockProducts.length === 0 ? "No products found" : "No products match your filters"}
                    description={mockProducts.length === 0 ? "Create your first product to get started" : "Try adjusting your filter criteria"}
                    action={mockProducts.length === 0 ? <Button variant="primary">Create Product</Button> : undefined}
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
