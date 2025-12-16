import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Section } from '../components/ui/Section';

interface ProductData {
  id: string;
  name: string;
  type: string;
  status: 'success' | 'generating' | 'error';
  standard: string;
  createdAt: string;
  description: string;
}

// TODO: Replace with real data from API
const getProductById = (id: string): ProductData | null => {
  const products = {
    '1': {
      id: '1',
      name: 'Numbers and Operations - Class 3',
      type: 'Course',
      status: 'success' as const,
      standard: 'CBSE.MATH.CLASS3.NUMBERS',
      createdAt: '2024-01-15 14:30',
      description: 'Comprehensive course covering basic number operations for Class 3 students following CBSE curriculum.'
    },
    '2': {
      id: '2',
      name: 'Reading Comprehension - Class 4',
      type: 'Module',
      status: 'generating' as const,
      standard: 'CBSE.ENGLISH.CLASS4.READING',
      createdAt: '2024-01-15 13:45',
      description: 'Interactive module focusing on reading comprehension skills for Class 4 English curriculum.'
    },
    '3': {
      id: '3',
      name: 'Plant Life Cycle - Class 5',
      type: 'Lesson',
      status: 'error' as const,
      standard: 'CBSE.SCIENCE.CLASS5.PLANTS',
      createdAt: '2024-01-15 12:20',
      description: 'Detailed lesson on plant life cycles for Class 5 Science curriculum.'
    }
  };
  return products[id as keyof typeof products] || null;
};

type TabType = 'raw' | 'final' | 'metadata' | 'files';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('raw');
  
  const product = id ? getProductById(id) : null;

  if (!product) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Product not found</h2>
          <p className="text-neutral-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </PageContainer>
    );
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success': return 'Completed';
      case 'generating': return 'Generating';
      case 'error': return 'Error';
      default: return status;
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
        title={product.name}
        description={product.description}
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
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">{product.name}</h2>
                <p className="text-neutral-600">{product.description}</p>
              </div>
              <StatusBadge status={product.status}>
                {getStatusLabel(product.status)}
              </StatusBadge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-200">
              <div>
                <p className="text-sm font-medium text-neutral-500">Type</p>
                <p className="text-sm text-neutral-900">{product.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">Standard</p>
                <p className="text-xs font-mono text-neutral-900">{product.standard}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">Created</p>
                <p className="text-sm text-neutral-900">{product.createdAt}</p>
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
                    <p className="text-neutral-600 text-sm">Raw AI-generated content will be displayed here...</p>
                    {/* TODO: Add JSON viewer or formatted content display */}
                  </div>
                </div>
              )}
              
              {activeTab === 'final' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Final Processed Output</h3>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                    <p className="text-neutral-600 text-sm">Final processed content will be displayed here...</p>
                    {/* TODO: Add formatted content display */}
                  </div>
                </div>
              )}
              
              {activeTab === 'metadata' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Product Metadata</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-neutral-700 mb-2">Generation Settings</p>
                        <p className="text-neutral-600 text-sm">AI model parameters and settings...</p>
                      </div>
                      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-neutral-700 mb-2">Processing Info</p>
                        <p className="text-neutral-600 text-sm">Processing timestamps and logs...</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'files' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Generated Files</h3>
                  <div className="space-y-3">
                    {/* TODO: Replace with real file list */}
                    <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                      <div>
                        <p className="font-medium text-neutral-900">course-content.pdf</p>
                        <p className="text-sm text-neutral-500">PDF • 2.4 MB</p>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                      <div>
                        <p className="font-medium text-neutral-900">lesson-plan.docx</p>
                        <p className="text-sm text-neutral-500">Word Document • 1.2 MB</p>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
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