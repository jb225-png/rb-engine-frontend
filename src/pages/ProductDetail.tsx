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
    case 'GENERATED': return 'success';
    case 'DRAFT': return 'pending';
    case 'FAILED': return 'error';
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

  const handleViewJob = () => {
    if (product?.generation_job_id) {
      navigate(`/products?generation_job_id=${product.generation_job_id}`);
    }
  };

  const handleViewAllJobs = () => {
    navigate('/jobs');
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

      {/* Generation Job Context Banner */}
      {product.generation_job_id && (
        <Alert
          variant="info"
          title="Generation Job Context"
          description={`This product was created by generation job #${product.generation_job_id.slice(-8)}. View related products or job details.`}
          action={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleViewJob}>
                View Job Products
              </Button>
              <Button variant="outline" size="sm" onClick={handleViewAllJobs}>
                View All Jobs
              </Button>
            </div>
          }
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Product Summary */}
          <Card className="mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
                  {product.name}
                </h2>
                {product.description && (
                  <p className="text-neutral-600 text-lg leading-relaxed">{product.description}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={getStatusVariant(product.status)}>
                  {product.status}
                </StatusBadge>
                
                <select
                  value={product.status}
                  onChange={(e) => handleStatusUpdate(e.target.value as Product['status'])}
                  disabled={updateStatusMutation.isPending}
                  className="text-sm border border-neutral-300 rounded px-3 py-2 bg-white hover:border-neutral-400 focus:border-primary-500 focus:outline-none"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="GENERATED">Generated</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-6 border-t border-neutral-200">
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Product Type</p>
                <p className="text-sm text-neutral-900 capitalize font-medium">{product.product_type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Standard Code</p>
                <p className="text-xs font-mono text-neutral-900 bg-neutral-50 px-2 py-1 rounded">
                  {product.standard_id || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Grade Level</p>
                <p className="text-sm text-neutral-900 font-medium">{product.grade_level || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Generation Job</p>
                {product.generation_job_id ? (
                  <button
                    onClick={handleViewJob}
                    className="text-xs font-mono text-primary-600 bg-primary-50 px-2 py-1 rounded hover:bg-primary-100 transition-colors"
                  >
                    #{product.generation_job_id.slice(-8)}
                  </button>
                ) : (
                  <p className="text-xs font-mono text-neutral-900 bg-neutral-50 px-2 py-1 rounded">
                    —
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Created Date</p>
                <p className="text-sm text-neutral-900 font-medium">
                  {new Date(product.created_at).toLocaleDateString()}
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
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Raw JSON Data</h3>
                  {/* TODO: Add AI output rendering when available */}
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 max-h-96 overflow-auto">
                    {product.raw_json ? (
                      <pre className="text-sm text-neutral-700 whitespace-pre-wrap font-mono">
                        {JSON.stringify(product.raw_json, null, 2)}
                      </pre>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-neutral-500 mb-2">No raw JSON data available</p>
                        <p className="text-sm text-neutral-400">Raw data will appear here after the product is generated</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'final' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Final JSON Data</h3>
                  {/* TODO: Add processed content rendering when available */}
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 max-h-96 overflow-auto">
                    {product.final_json ? (
                      <pre className="text-sm text-neutral-700 whitespace-pre-wrap font-mono">
                        {JSON.stringify(product.final_json, null, 2)}
                      </pre>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-neutral-500 mb-2">No final JSON data available</p>
                        <p className="text-sm text-neutral-400">Final processed data will appear here after QC completion</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'qc' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quality Control Report</h3>
                  {/* TODO: Add QC report viewer when available */}
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 max-h-96 overflow-auto">
                    {product.qc_report ? (
                      <pre className="text-sm text-neutral-700 whitespace-pre-wrap font-mono">
                        {JSON.stringify(product.qc_report, null, 2)}
                      </pre>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-neutral-500 mb-2">No QC report available</p>
                        <p className="text-sm text-neutral-400">Quality control reports will appear here after automated review</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'metadata' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Product Metadata</h3>
                  {/* TODO: Add structured metadata viewer when available */}
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 max-h-96 overflow-auto">
                    {product.metadata ? (
                      <pre className="text-sm text-neutral-700 whitespace-pre-wrap font-mono">
                        {JSON.stringify(product.metadata, null, 2)}
                      </pre>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-neutral-500 mb-2">No metadata available</p>
                        <p className="text-sm text-neutral-400">Product metadata and configuration will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'files' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Generated Files</h3>
                  {/* TODO: Add file preview and download functionality when available */}
                  <div className="space-y-3">
                    {product.files && product.files.length > 0 ? (
                      product.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors">
                          <div>
                            <p className="font-medium text-neutral-900">{file}</p>
                            <p className="text-sm text-neutral-500">Generated file</p>
                          </div>
                          <Button variant="outline" size="sm" disabled>
                            Download
                          </Button>
                        </div>
                      ))
                    ) : (
                      <EmptyState
                        title="No files available"
                        description="Generated files will appear here once the product is processed and finalized."
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
                Regenerate Content
              </Button>
              <Button variant="outline" fullWidth disabled>
                Duplicate Product
              </Button>
              <Button variant="outline" fullWidth disabled>
                Export All Data
              </Button>
            </div>
            
            {/* Generation Job Context */}
            {product.generation_job_id && (
              <div className="mt-6 pt-4 border-t border-neutral-200">
                <h4 className="text-sm font-medium text-neutral-900 mb-3">Generation Job</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" fullWidth onClick={handleViewJob}>
                    View Job Products
                  </Button>
                  <Button variant="outline" size="sm" fullWidth onClick={handleViewAllJobs}>
                    View All Jobs
                  </Button>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Job ID: #{product.generation_job_id.slice(-8)}
                </p>
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-neutral-200">
              <p className="text-sm text-neutral-500 mb-3">Coming Soon</p>
              <div className="space-y-2 text-xs text-neutral-400">
                <p>• Automated regeneration</p>
                <p>• Product duplication</p>
                <p>• Bulk export options</p>
                <p>• Version history</p>
                <p>• AI output rendering</p>
                <p>• QC workflow automation</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};