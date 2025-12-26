import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { FormSection } from '../components/ui/FormSection';
import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';
import { useCreateGenerationJob, useGenerationJobsQuery } from '../hooks/useGeneration';
import { Product, GenerationJob } from '../types/api';

interface FormData {
  standardCode: string;
  productType: Product['type'] | '';
  description: string;
}

interface FormErrors {
  standardCode?: string;
  productType?: string;
  description?: string;
}

const productTypeOptions = [
  { value: '', label: 'Auto-select best type' },
  { value: 'course', label: 'Course' },
  { value: 'module', label: 'Module' },
  { value: 'lesson', label: 'Lesson' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'activity', label: 'Activity' },
  { value: 'resource', label: 'Resource' },
];

const getStatusVariant = (status: GenerationJob['status']) => {
  switch (status) {
    case 'success': return 'success';
    case 'generating': return 'generating';
    case 'pending': return 'pending';
    case 'error': return 'error';
    default: return 'pending';
  }
};

export const QuickGenerate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    standardCode: '',
    productType: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const createJobMutation = useCreateGenerationJob();
  const { data: recentJobs, isLoading: jobsLoading } = useGenerationJobsQuery({ limit: 5 });

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.standardCode.trim()) {
      errors.standardCode = 'Standard code is required';
    } else if (formData.standardCode.trim().length < 3) {
      errors.standardCode = 'Standard code must be at least 3 characters';
    }

    if (formData.description.trim().length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = () => {
    return formData.standardCode.trim().length >= 3 && 
           formData.description.trim().length <= 500;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await createJobMutation.mutateAsync({
        standardCode: formData.standardCode.trim(),
        productType: formData.productType || undefined,
        description: formData.description.trim() || undefined,
      });

      setSuccessMessage(
        `Generation job created successfully! Job ID: ${result.id}. ` +
        `The system will process your request and create the content.`
      );
      
      // Reset form
      setFormData({
        standardCode: '',
        productType: '',
        description: '',
      });
      setFormErrors({});

    } catch (error: any) {
      console.error('Failed to create generation job:', error);
      const errorMsg = error.response?.data?.error?.message || 
                      error.response?.data?.message ||
                      'Failed to create generation job. Please check your input and try again.';
      setErrorMessage(errorMsg);
    }
  };

  const handleReset = () => {
    setFormData({
      standardCode: '',
      productType: '',
      description: '',
    });
    setFormErrors({});
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Quick Generate"
        description="Generate curriculum content quickly using AI-powered tools"
        actions={
          <Button variant="outline" onClick={() => navigate('/products')}>
            View Products
          </Button>
        }
      />

      {/* Success and Error Messages */}
      {successMessage && (
        <Alert variant="success" title="Generation Job Created!" description={successMessage} />
      )}

      {errorMessage && (
        <Alert variant="error" title="Generation Failed" description={errorMessage} />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="xl:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Standard Input Section */}
              <FormSection
                title="Standard Input"
                description="Enter the educational standard code to generate content for"
              >
                <Input
                  label="Standard Code"
                  value={formData.standardCode}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, standardCode: e.target.value }));
                    if (formErrors.standardCode) {
                      setFormErrors(prev => ({ ...prev, standardCode: undefined }));
                    }
                  }}
                  placeholder="e.g., CCSS.MATH.CONTENT.3.OA.A.1"
                  helperText="Enter a valid educational standard identifier (minimum 3 characters)"
                  error={formErrors.standardCode}
                  required
                  disabled={createJobMutation.isLoading}
                />
              </FormSection>

              {/* Product Configuration Section */}
              <FormSection
                title="Product Configuration"
                description="Specify the type of content to generate (optional)"
              >
                <div className="space-y-4">
                  <Select
                    label="Product Type"
                    options={productTypeOptions}
                    value={formData.productType}
                    onChange={(e) => setFormData(prev => ({ ...prev, productType: e.target.value as Product['type'] || '' }))}
                    helperText="Leave blank to let AI choose the best product type for your standard"
                    disabled={createJobMutation.isLoading}
                  />
                  
                  <Input
                    label="Additional Description"
                    value={formData.description}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, description: e.target.value }));
                      if (formErrors.description) {
                        setFormErrors(prev => ({ ...prev, description: undefined }));
                      }
                    }}
                    placeholder="Any specific requirements, grade level, or context..."
                    helperText={`Optional: Provide additional context to improve generation quality (${formData.description.length}/500 characters)`}
                    error={formErrors.description}
                    disabled={createJobMutation.isLoading}
                  />
                </div>
              </FormSection>

              {/* Submit Section */}
              <div className="flex gap-4 pt-6 border-t border-neutral-200">
                <Button
                  type="submit"
                  variant="primary"
                  loading={createJobMutation.isLoading}
                  disabled={!isFormValid() || createJobMutation.isLoading}
                  className="min-w-[140px]"
                >
                  {createJobMutation.isLoading ? 'Creating...' : 'Generate Product'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={createJobMutation.isLoading}
                >
                  Reset Form
                </Button>
                {!isFormValid() && formData.standardCode.trim().length > 0 && (
                  <p className="text-sm text-neutral-500 self-center ml-2">
                    {formData.standardCode.trim().length < 3 ? 'Standard code too short' : 'Check form errors'}
                  </p>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* Recent Jobs Sidebar */}
        <div>
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Jobs</h3>
            
            {jobsLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="md" />
              </div>
            ) : recentJobs?.data.length ? (
              <div className="space-y-3">
                {recentJobs.data.map((job) => (
                  <div key={job.id} className="p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {job.standardCode}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Job #{job.id.slice(-8)}
                        </p>
                      </div>
                      <StatusBadge status={getStatusVariant(job.status)}>
                        {job.status}
                      </StatusBadge>
                    </div>
                    {job.productsCount && (
                      <p className="text-xs text-neutral-600 mb-2">
                        {job.productsCount} product{job.productsCount !== 1 ? 's' : ''} generated
                      </p>
                    )}
                    <p className="text-xs text-neutral-400">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No recent jobs"
                description="Your generation jobs will appear here after you create them"
              />
            )}

            <div className="mt-6 pt-4 border-t border-neutral-200">
              <Button 
                variant="outline" 
                className="w-full text-sm"
                onClick={() => navigate('/jobs')}
              >
                View All Jobs
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Full History Table */}
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Generation History</h3>
        
        {jobsLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : recentJobs?.data.length ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Job ID</TableHeader>
                <TableHeader>Standard</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Products</TableHeader>
                <TableHeader>Created At</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentJobs.data.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <span className="font-mono text-sm">#{job.id.slice(-8)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{job.standardCode}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={getStatusVariant(job.status)}>
                      {job.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{job.productsCount || '—'}</TableCell>
                  <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled>
                        View
                      </Button>
                      {job.status === 'error' && (
                        <Button variant="outline" size="sm" disabled>
                          Retry
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState
            title="No generation jobs yet"
            description="Create your first generation job using the form above"
          />
        )}
      </Card>
    </PageContainer>
  );
};