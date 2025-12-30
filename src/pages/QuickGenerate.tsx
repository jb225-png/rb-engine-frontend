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
  standard_id: number;
  product_type: Product['product_type'];
  grade_level: number;
  locale: string;
  curriculum_board: string;
}

interface FormErrors {
  standard_id?: string;
  product_type?: string;
  grade_level?: string;
}

const productTypeOptions = [
  { value: 'WORKSHEET', label: 'Worksheet' },
  { value: 'PASSAGE', label: 'Passage' },
  { value: 'QUIZ', label: 'Quiz' },
  { value: 'ASSESSMENT', label: 'Assessment' },
];

const getStatusVariant = (status: GenerationJob['status']) => {
  switch (status) {
    case 'COMPLETED': return 'success';
    case 'RUNNING': return 'generating';
    case 'PENDING': return 'pending';
    case 'FAILED': return 'error';
    default: return 'pending';
  }
};

export const QuickGenerate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    standard_id: 1,
    product_type: 'WORKSHEET',
    grade_level: 5,
    locale: 'IN',
    curriculum_board: 'CBSE',
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

    if (!formData.standard_id) {
      errors.standard_id = 'Standard ID is required';
    }

    if (!formData.grade_level || formData.grade_level < 1 || formData.grade_level > 12) {
      errors.grade_level = 'Grade level must be between 1 and 12';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = () => {
    return formData.standard_id > 0 && 
           formData.grade_level >= 1 && formData.grade_level <= 12;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await createJobMutation.mutateAsync({
        standard_id: formData.standard_id,
        product_type: formData.product_type,
        grade_level: formData.grade_level,
        locale: formData.locale,
        curriculum_board: formData.curriculum_board,
      });

      setSuccessMessage(
        `Generation job created successfully! Job ID: ${result.id}. ` +
        `The system will process your request and create the content.`
      );
      
      // Reset form
      setFormData({
        standard_id: 1,
        product_type: 'WORKSHEET',
        grade_level: 5,
        locale: 'IN',
        curriculum_board: 'CBSE',
      });
      setFormErrors({});

    } catch (error: any) {
      console.error('Failed to create generation job:', error);
      console.error('Error response:', error.response);
      
      let errorMsg = 'Failed to create generation job. Please check your input and try again.';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Handle FastAPI validation errors
        if (Array.isArray(errorData.detail)) {
          errorMsg = errorData.detail.map((err: any) => 
            `${err.loc?.join('.')}: ${err.msg}`
          ).join(', ');
        } else if (typeof errorData.detail === 'string') {
          errorMsg = errorData.detail;
        } else if (errorData.message) {
          errorMsg = errorData.message;
        } else {
          errorMsg = 'Validation error: ' + JSON.stringify(errorData);
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setErrorMessage(errorMsg);
    }
  };

  const handleReset = () => {
    setFormData({
      standard_id: 1,
      product_type: 'WORKSHEET',
      grade_level: 5,
      locale: 'IN',
      curriculum_board: 'CBSE',
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
                  label="Standard ID"
                  type="number"
                  value={formData.standard_id.toString()}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, standard_id: parseInt(e.target.value) || 1 }));
                    if (formErrors.standard_id) {
                      setFormErrors(prev => ({ ...prev, standard_id: undefined }));
                    }
                  }}
                  placeholder="1"
                  helperText="Enter a valid standard ID from the database"
                  error={formErrors.standard_id}
                  required
                  disabled={createJobMutation.isPending}
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
                    value={formData.product_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, product_type: e.target.value as Product['product_type'] }))}
                    helperText="Select the type of content to generate"
                    disabled={createJobMutation.isPending}
                  />
                  
                  <Input
                    label="Grade Level"
                    type="number"
                    min="1"
                    max="12"
                    value={formData.grade_level.toString()}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, grade_level: parseInt(e.target.value) || 5 }));
                      if (formErrors.grade_level) {
                        setFormErrors(prev => ({ ...prev, grade_level: undefined }));
                      }
                    }}
                    placeholder="5"
                    helperText="Grade level from 1 to 12"
                    error={formErrors.grade_level}
                    disabled={createJobMutation.isPending}
                  />
                </div>
              </FormSection>

              {/* Submit Section */}
              <div className="flex gap-4 pt-6 border-t border-neutral-200">
                <Button
                  type="submit"
                  variant="primary"
                  loading={createJobMutation.isPending}
                  disabled={!isFormValid() || createJobMutation.isPending}
                  className="min-w-[140px]"
                >
                  {createJobMutation.isPending ? 'Creating...' : 'Generate Product'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={createJobMutation.isPending}
                >
                  Reset Form
                </Button>
                {!isFormValid() && formData.standard_id > 0 && (
                  <p className="text-sm text-neutral-500 self-center ml-2">
                    {formData.grade_level < 1 || formData.grade_level > 12 ? 'Invalid grade level' : 'Check form errors'}
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
                          Standard #{job.standard_id}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Job #{job.id.slice(-8)}
                        </p>
                      </div>
                      <StatusBadge status={getStatusVariant(job.status)}>
                        {job.status}
                      </StatusBadge>
                    </div>
                    {job.total_products && (
                      <p className="text-xs text-neutral-600 mb-2">
                        {job.total_products} product{job.total_products !== 1 ? 's' : ''} total
                      </p>
                    )}
                    <p className="text-xs text-neutral-400">
                      {new Date(job.created_at).toLocaleDateString()}
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
                    <span className="font-medium">Standard #{job.standard_id}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={getStatusVariant(job.status)}>
                      {job.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{job.total_products || '—'}</TableCell>
                  <TableCell>{new Date(job.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled>
                        View
                      </Button>
                      {job.status === 'FAILED' && (
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