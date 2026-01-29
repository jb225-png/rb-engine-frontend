import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Section } from '../components/ui/Section';
import { api, Product } from '../api/client';

type TabType = 'raw' | 'final' | 'metadata' | 'files';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('raw');
  const [product, setProduct] = useState<Product | null>(null);
  const [productContent, setProductContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await api.getProduct(parseInt(id));
        setProduct(response.data);
        
        // Try to get content, but don't fail if endpoint doesn't exist
        try {
          const contentResponse = await api.getProductContent(parseInt(id));
          setProductContent(contentResponse.data.data);
        } catch (contentError) {
          console.log('Content endpoint not available yet');
          setProductContent(null);
        }
      } catch (error: any) {
        console.error('Failed to fetch product:', error);
        setError(error.response?.data?.detail || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-12">
          <div className="text-neutral-500">Loading product...</div>
        </div>
      </PageContainer>
    );
  }

  if (error || !product) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Product not found</h2>
          <p className="text-neutral-600 mb-4">{error || "The product you're looking for doesn't exist."}</p>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </PageContainer>
    );
  }

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

  const tabs = [
    { id: 'raw', label: 'Raw Output' },
    { id: 'final', label: 'Final Output' },
    { id: 'metadata', label: 'Metadata' },
    { id: 'files', label: 'Files' }
  ];

  return (
    <PageContainer>
      <PageHeader
        title={`${product.product_type} - Grade ${product.grade_level}`}
        description={`Product ID: ${product.id} | ${product.curriculum_board} curriculum`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/products')}>Back</Button>
            <Button variant="outline">Edit</Button>
            <Button variant="primary">Download</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Product Summary */}
          <Card className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                  {product.product_type.replace('_', ' ')} - Grade {product.grade_level}
                </h2>
                <p className="text-neutral-600">
                  Generated content for {product.curriculum_board} curriculum
                </p>
              </div>
              <StatusBadge status={getStatusVariant(product.status)}>
                {getStatusLabel(product.status)}
              </StatusBadge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-200">
              <div>
                <p className="text-sm font-medium text-neutral-500">Product ID</p>
                <p className="text-sm text-neutral-900">#{product.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">Type</p>
                <p className="text-sm text-neutral-900">{product.product_type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">Standard ID</p>
                <p className="text-sm text-neutral-900">#{product.standard_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">Created</p>
                <p className="text-sm text-neutral-900">{new Date(product.created_at).toLocaleDateString()}</p>
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
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
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
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Raw AI Output</h3>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                    {product.status === 'GENERATED' ? (
                      productContent ? (
                        <pre className="whitespace-pre-wrap text-sm text-neutral-800">
                          {JSON.stringify(productContent, null, 2)}
                        </pre>
                      ) : (
                        <div>
                          <p className="text-neutral-600 text-sm mb-3">Content endpoint not available. Showing product metadata:</p>
                          <pre className="whitespace-pre-wrap text-sm text-neutral-800">
                            {JSON.stringify(product, null, 2)}
                          </pre>
                        </div>
                      )
                    ) : (
                      <p className="text-neutral-600 text-sm">
                        Raw content will be available once generation is complete.
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'final' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Final Processed Output</h3>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                    {product.status === 'GENERATED' ? (
                      productContent ? (
                        <div className="prose max-w-none">
                          {productContent.title && <h4 className="text-lg font-semibold mb-3">{productContent.title}</h4>}
                          {productContent.instructions && <div className="mb-4"><strong>Instructions:</strong> {productContent.instructions}</div>}
                          {productContent.learning_objectives && (
                            <div className="mb-4">
                              <strong>Learning Objectives:</strong>
                              <ul className="list-disc ml-5 mt-2">
                                {productContent.learning_objectives.map((obj: string, idx: number) => (
                                  <li key={idx}>{obj}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {productContent.questions && (
                            <div className="mb-4">
                              <strong>Questions:</strong>
                              <div className="mt-2 space-y-3">
                                {productContent.questions.map((q: any, idx: number) => (
                                  <div key={idx} className="border-l-4 border-blue-200 pl-4">
                                    <p><strong>Q{idx + 1}:</strong> {q.question || q.text || q}</p>
                                    {q.options && (
                                      <ul className="list-disc ml-5 mt-1">
                                        {q.options.map((opt: string, optIdx: number) => (
                                          <li key={optIdx}>{opt}</li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {productContent.answer_key && (
                            <div className="mb-4">
                              <strong>Answer Key:</strong>
                              <div className="mt-2 bg-gray-50 p-3 rounded">
                                {Array.isArray(productContent.answer_key) ? (
                                  <ul className="space-y-1">
                                    {productContent.answer_key.map((answer: any, idx: number) => (
                                      <li key={idx}><strong>{idx + 1}:</strong> {answer.answer || answer}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p>{productContent.answer_key}</p>
                                )}
                              </div>
                            </div>
                          )}
                          {productContent.extension_activities && (
                            <div className="mb-4">
                              <strong>Extension Activities:</strong>
                              <ul className="list-disc ml-5 mt-2">
                                {productContent.extension_activities.map((activity: string, idx: number) => (
                                  <li key={idx}>{activity}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-neutral-600 text-sm">Loading content...</p>
                          <div className="bg-white border rounded p-3">
                            <h5 className="font-medium mb-2">Product Summary:</h5>
                            <p><strong>Type:</strong> {product.product_type}</p>
                            <p><strong>Grade:</strong> {product.grade_level}</p>
                            <p><strong>Curriculum:</strong> {product.curriculum_board}</p>
                            <p><strong>Status:</strong> {product.status}</p>
                          </div>
                        </div>
                      )
                    ) : (
                      <p className="text-neutral-600 text-sm">
                        Final content will be available once generation is complete.
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'metadata' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Product Metadata</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-neutral-700 mb-2">Generation Info</p>
                        <div className="space-y-1 text-sm text-neutral-600">
                          <p>Job ID: #{product.generation_job_id}</p>
                          <p>Locale: {product.locale}</p>
                          <p>Grade Level: {product.grade_level}</p>
                        </div>
                      </div>
                      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-neutral-700 mb-2">Processing Info</p>
                        <div className="space-y-1 text-sm text-neutral-600">
                          <p>Status: {product.status}</p>
                          <p>Created: {new Date(product.created_at).toLocaleString()}</p>
                          <p>Curriculum: {product.curriculum_board}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'files' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Generated Files</h3>
                  <div className="space-y-3">
                    {product.status === 'GENERATED' ? (
                      <>
                        <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                          <div>
                            <p className="font-medium text-neutral-900">{product.product_type.toLowerCase()}-content.pdf</p>
                            <p className="text-sm text-neutral-500">PDF • Generated content</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={async () => {
                              try {
                                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
                                const downloadUrl = `${apiUrl}/products/${product.id}/download/pdf`;
                                console.log('Requesting PDF from:', downloadUrl);
                                
                                const response = await fetch(downloadUrl);
                                
                                console.log('Response status:', response.status);
                                console.log('Response headers:', Object.fromEntries(response.headers.entries()));
                                
                                if (!response.ok) {
                                  const contentType = response.headers.get('content-type');
                                  if (contentType?.includes('application/json')) {
                                    const errorData = await response.json();
                                    console.error('Error response:', errorData);
                                    alert(`PDF download failed: ${errorData.detail || errorData.message || 'Unknown error'}`);
                                  } else {
                                    const errorText = await response.text();
                                    console.error('Error response body:', errorText);
                                    alert(`PDF download failed: Backend returned ${response.status}. Check console for details.`);
                                  }
                                  return;
                                }
                                
                                const contentType = response.headers.get('content-type');
                                console.log('Response content-type:', contentType);
                                
                                if (!contentType?.includes('application/pdf')) {
                                  const responseText = await response.text();
                                  console.error('Non-PDF response body:', responseText.substring(0, 500));
                                  alert(`PDF download failed: Backend returned ${contentType} instead of PDF. Check console for response details.`);
                                  return;
                                }
                                
                                const contentDisposition = response.headers.get('content-disposition');
                                const filename = contentDisposition 
                                  ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') || `product_${product.id}.pdf`
                                  : `${product.product_type.toLowerCase()}_${product.grade_level}_${product.id}.pdf`;
                                
                                const blob = await response.blob();
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = filename;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                URL.revokeObjectURL(url);
                                
                                console.log('PDF download successful:', filename);
                              } catch (error: any) {
                                console.error('PDF download failed:', error);
                                alert(`PDF download failed: ${error.message}`);
                              }
                            }}
                          >
                            Download
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                          <div>
                            <p className="font-medium text-neutral-900">{product.product_type.toLowerCase()}-metadata.json</p>
                            <p className="text-sm text-neutral-500">JSON • Metadata file</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const dataStr = JSON.stringify(product, null, 2);
                              const dataBlob = new Blob([dataStr], {type: 'application/json'});
                              const url = URL.createObjectURL(dataBlob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `product-${product.id}-metadata.json`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              URL.revokeObjectURL(url);
                            }}
                          >
                            Download
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p className="text-neutral-600 text-sm">
                        Files will be available once generation is complete.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Section title="Quick Actions">
            <Card>
              <div className="space-y-3">
                <Button variant="primary" fullWidth>Regenerate</Button>
                <Button variant="outline" fullWidth>Duplicate</Button>
                <Button variant="outline" fullWidth>Export All</Button>
              </div>
            </Card>
          </Section>
        </div>
      </div>
    </PageContainer>
  );
};