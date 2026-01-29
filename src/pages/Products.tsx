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
import { useProducts } from '../hooks/useProducts';
import { Product, TemplateType, WorldviewFlag, GradeLevel } from '../types/api';

const statusOptions = [
  { value: 'GENERATED', label: 'Generated' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'FAILED', label: 'Failed' }
];

const templateOptions = [
  { value: 'BUNDLE_OVERVIEW', label: 'Bundle Overview' },
  { value: 'VOCABULARY_PACK', label: 'Vocabulary Pack' },
  { value: 'ANCHOR_READING_PASSAGE', label: 'Reading Passage' },
  { value: 'READING_COMPREHENSION_QUESTIONS', label: 'Comprehension' },
  { value: 'SHORT_QUIZ', label: 'Short Quiz' },
  { value: 'EXIT_TICKETS', label: 'Exit Tickets' }
];

const worldviewOptions = [
  { value: 'CHRISTIAN', label: 'Christian' },
  { value: 'NEUTRAL', label: 'Neutral' }
];

export const Products: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [templateFilter, setTemplateFilter] = useState('');
  const [worldviewFilter, setWorldviewFilter] = useState('');
  
  const { data: productsData, isLoading } = useProducts({
    status: statusFilter as any,
    template_type: templateFilter as TemplateType,
    worldview_flag: worldviewFilter as WorldviewFlag,
  });

  const clearFilters = () => {
    setStatusFilter('');
    setTemplateFilter('');
    setWorldviewFilter('');
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'GENERATED': return 'success';
      case 'DRAFT': return 'pending';
      case 'FAILED': return 'error';
      default: return 'pending';
    }
  };

  const getTemplateLabel = (templateType: TemplateType) => {
    return templateOptions.find(t => t.value === templateType)?.label || templateType;
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Templates" description="Loading templates..." />
        <div className="flex justify-center py-12">
          <div className="text-neutral-500">Loading templates...</div>
        </div>
      </PageContainer>
    );
  }

  const products = productsData?.data || [];

  return (
    <PageContainer>
      <PageHeader
        title="ELA Templates"
        description="Manage your generated ELA content templates"
        actions={<Button variant="primary" onClick={() => navigate('/quick-generate')}>Generate Template</Button>}
      />

      <Card>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">All Templates</h2>
        
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
            label="Template Type"
            value={templateFilter}
            options={templateOptions}
            onChange={setTemplateFilter}
            placeholder="All Templates"
          />
          <FilterSelect
            label="Worldview"
            value={worldviewFilter}
            options={worldviewOptions}
            onChange={setWorldviewFilter}
            placeholder="All Content"
          />
        </FilterBar>
        
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Template ID</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Grade</TableHeader>
              <TableHeader>Standard</TableHeader>
              <TableHeader>Worldview</TableHeader>
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
                  <TableCell>{getTemplateLabel(product.template_type)}</TableCell>
                  <TableCell>
                    <StatusBadge status={getStatusVariant(product.status)}>
                      {product.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>Grade {product.grade_level}</TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{product.ela_standard_code}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.worldview_flag === 'CHRISTIAN' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.worldview_flag === 'CHRISTIAN' ? '✝️ Christian' : '📚 Neutral'}
                    </span>
                  </TableCell>
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
                <TableCell colSpan={8}>
                  <EmptyState
                    title="No templates found"
                    description="No templates match your current filters or none have been created yet"
                    action={<Button variant="primary" onClick={() => navigate('/quick-generate')}>Generate Template</Button>}
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