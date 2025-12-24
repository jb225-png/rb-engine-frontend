import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Alert } from '../components/ui/Alert';
import { useProductQuery, useUpdateProductStatus } from '../hooks/useProducts';
import { Product } from '../types/api';

type TabType = 'raw' | 'final' | 'qc' | 'metadata' | 'files';

const getStatusVariant = (status: Product['status']) => {
  switch (status) {
    case 'published': return 'success';
    case 'draft': return 'pending';
    case 'review': return 'generating';
    case 'archived': return 'error';
    default: return 'pending';
  }
};

const tabs = [
  { id: 'raw', label: 'Raw JSON' },
  { id: 'final', label: 'Final JSON' },
  { id: 'qc', label: 'QC Report' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'files', label: 'Files' }
];

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [successMessage, setSuccessMessage] = useState('');
  
  // Get active tab from URL params, default to 'raw'
  const activeTab = (searchParams.get('tab') as TabType) || 'raw';
  
  const { data: product, isLoading, error } = useProductQuery(id!);
  const updateStatusMutation = useUpdateProductStatus();

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const setActiveTab = (tab: TabType) => {
    const newParams = new URLSearchParams(searchParams);
    if (tab === 'raw') {
      newParams.delete('tab'); // Remove tab param for default tab
    } else {
      newParams.set('tab', tab);
    }
    setSearchParams(newParams);
  };

  const handleStatusUpdate = async (newStatus: Product['status']) => {
    if (!id) return;
    
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus });
      setSuccessMessage('Product status updated successfully');
    } catch (error) {
      console.error('Failed to update product status:', error);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
          <span className="ml-3 text-neutral-600">Loading product details...</span>
        </div>
      </PageContainer>
    );
  }

  if (error || !product) {
    return (
      <PageContainer>
        <Alert
          variant="error"
          title="Product not found"
          description="The product you're looking for doesn't exist or failed to load."
        />
        <div className="mt-4">
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={product.name}
        description={product.description}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/products')}>
              Back
            </Button>
            <Button variant="outline" disabled>
              Edit
            </Button>
            <Button variant="primary" disabled>
              Download
            </Button>
          </div>
        }
      />

      {successMessage && (
        <Alert variant="success" title="Success" description={successMessage} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Product Summary */}
          <Card className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                  {product.name}
                </h2>
                {product.description && (
                  <p className="text-neutral-600">{product.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={getStatusVariant(product.status)}>
                  {product.status}
                </StatusBadge>
                
                <select
                  value={product.status}
                  onChange={(e) => handleStatusUpdate(e.target.value as Product['status'])}
                  disabled={updateStatusMutation.isLoading}
                  className="text-sm border border-neutral-300 rounded px-2 py-1"
                >
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-neutral-200">
              <div>
                <p className="text-sm font-medium text-neutral-500">Type</p>
                <p className="text-sm text-neutral-900 capitalize">{product.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">Standard</p>
                <p className="text-xs font-mono text-neutral-900">
                  {product.standardCode || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">Grade</p>
                <p className="text-sm text-neutral-900">{product.grade || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">Related Job</p>
                <p className="text-xs font-mono text-neutral-900">
                  {product.jobId ? `#${product.jobId.slice(-8)}` : '—'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">Created</p>
                <p className="text-sm text-neutral-900">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Card>
            <div className="border-b border-neutral-200 mb-6">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-96">
              {activeTab === 'raw' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Raw JSON</h3>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 max-h-96 overflow-auto">
                    {product.rawJson ? (
                      <pre className="text-sm text-neutral-700 whitespace-pre-wrap">
                        {JSON.stringify(product.rawJson, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-neutral-600 text-sm">No raw JSON data available</p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'final' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Final JSON</h3>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 max-h-96 overflow-auto">
                    {product.finalJson ? (
                      <pre className="text-sm text-neutral-700 whitespace-pre-wrap">
                        {JSON.stringify(product.finalJson, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-neutral-600 text-sm">No final JSON data available</p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'qc' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">QC Report</h3>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 max-h-96 overflow-auto">
                    {product.qcReport ? (
                      <pre className="text-sm text-neutral-700 whitespace-pre-wrap">
                        {JSON.stringify(product.qcReport, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-neutral-600 text-sm">No QC report available</p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'metadata' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Product Metadata</h3>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 max-h-96 overflow-auto">
                    {product.metadata ? (
                      <pre className="text-sm text-neutral-700 whitespace-pre-wrap">
                        {JSON.stringify(product.metadata, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-neutral-600 text-sm">No metadata available</p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'files' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Generated Files</h3>
                  <div className="space-y-3">
                    {product.files && product.files.length > 0 ? (
                      product.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                          <div>
                            <p className="font-medium text-neutral-900">{file}</p>
                            <p className="text-sm text-neutral-500">File</p>
                          </div>
                          <Button variant="outline" size="sm" disabled>
                            Download
                          </Button>
                        </div>
                      ))
                    ) : (
                      <EmptyState
                        title="No files available"
                        description="Generated files will appear here once the product is processed."
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="primary" fullWidth disabled>
                Regenerate
              </Button>
              <Button variant="outline" fullWidth disabled>
                Duplicate
              </Button>
              <Button variant="outline" fullWidth disabled>
                Export All
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};