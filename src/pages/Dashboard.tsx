import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Section } from '../components/ui/Section';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useDashboardStats, useRecentProducts, useRecentJobs } from '../hooks/useDashboard';
import { Product, GenerationJob } from '../types/api';

const getProductStatusVariant = (status: Product['status']) => {
  switch (status) {
    case 'GENERATED': return 'success';
    case 'DRAFT': return 'pending';
    case 'FAILED': return 'error';
    default: return 'pending';
  }
};

const getJobStatusVariant = (status: GenerationJob['status']) => {
  switch (status) {
    case 'COMPLETED': return 'success';
    case 'RUNNING': return 'generating';
    case 'PENDING': return 'pending';
    case 'FAILED': return 'error';
    default: return 'pending';
  }
};

export const Dashboard: React.FC = () => {
  const { data: metrics, isLoading: metricsLoading } = useDashboardStats();
  const { data: recentProducts, isLoading: productsLoading } = useRecentProducts(5);
  const { data: recentJobs, isLoading: jobsLoading } = useRecentJobs(5);

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Overview of your RBB Engine content and activities"
      />
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Total Products</h3>
          {metricsLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <p className="text-3xl font-bold text-primary-600">{metrics?.total_products || 0}</p>
              <p className="text-sm text-neutral-500 mt-1">Curriculum products</p>
            </>
          )}
        </Card>
        
        <Card>
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Generation Jobs</h3>
          {metricsLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <p className="text-3xl font-bold text-success-500">{metrics?.total_generation_jobs || 0}</p>
              <p className="text-sm text-neutral-500 mt-1">Total jobs created</p>
            </>
          )}
        </Card>
        
        <Card>
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Published</h3>
          {metricsLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <p className="text-3xl font-bold text-success-500">{metrics?.products_by_status.GENERATED || 0}</p>
              <p className="text-sm text-neutral-500 mt-1">Ready products</p>
            </>
          )}
        </Card>
        
        <Card>
          <h3 className="text-sm font-medium text-neutral-500 mb-2">In Draft</h3>
          {metricsLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <p className="text-3xl font-bold text-warning-500">{metrics?.products_by_status.DRAFT || 0}</p>
              <p className="text-sm text-neutral-500 mt-1">Pending generation</p>
            </>
          )}
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Products */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Recent Products</h3>
            <Button variant="outline" size="sm" as={Link} to="/products">
              View All
            </Button>
          </div>
          
          {productsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="md" />
            </div>
          ) : recentProducts?.length ? (
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/products/${product.id}`}
                      className="font-medium text-primary-600 hover:text-primary-700 truncate block"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm text-neutral-500 capitalize">{product.product_type}</p>
                  </div>
                  <StatusBadge status={getProductStatusVariant(product.status)}>
                    {product.status}
                  </StatusBadge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No products yet"
              description="Create your first product to get started"
              action={<Button variant="primary" as={Link} to="/quick-generate">Generate Product</Button>}
            />
          )}
        </Card>

        {/* Recent Generation Jobs */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Recent Generation Jobs</h3>
            <Button variant="outline" size="sm" as={Link} to="/jobs">
              View All
            </Button>
          </div>
          
          {jobsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="md" />
            </div>
          ) : recentJobs?.length ? (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 truncate">Standard #{job.standard_id}</p>
                    <p className="text-sm text-neutral-500">Job #{job.id.slice(-8)}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={getJobStatusVariant(job.status)}>
                      {job.status}
                    </StatusBadge>
                    {job.total_products && (
                      <p className="text-xs text-neutral-500 mt-1">{job.total_products} products</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No generation jobs yet"
              description="Create your first generation job"
              action={<Button variant="primary" as={Link} to="/quick-generate">Quick Generate</Button>}
            />
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Section title="Quick Actions" description="Common tasks and shortcuts">
        <Card>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" as={Link} to="/quick-generate">
              Generate New Product
            </Button>
            <Button variant="secondary" as={Link} to="/upload-queue">
              View Upload Queue
            </Button>
            <Button variant="outline" as={Link} to="/bundles">
              Manage Bundles
            </Button>
          </div>
          
          {/* TODO: Add automation features in future milestones */}
          <div className="mt-6 pt-4 border-t border-neutral-200">
            <p className="text-sm text-neutral-500 mb-2">Coming Soon - Automation Features:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-neutral-400">
              <p>• Automated content generation workflows</p>
              <p>• Scheduled batch processing</p>
              <p>• Quality control automation</p>
              <p>• Content distribution pipelines</p>
            </div>
          </div>
        </Card>
      </Section>
    </PageContainer>
  );
};
