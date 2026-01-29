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
import { useDashboard } from '../hooks/useDashboard';
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
    case 'PENDING': return 'pending';
    case 'FAILED': return 'error';
    default: return 'pending';
  }
};

const templateTypeLabels: Record<string, string> = {
  'BUNDLE_OVERVIEW': 'Bundle Overview',
  'VOCABULARY_PACK': 'Vocabulary Pack',
  'ANCHOR_READING_PASSAGE': 'Reading Passage',
  'READING_COMPREHENSION_QUESTIONS': 'Comprehension',
  'SHORT_QUIZ': 'Short Quiz',
  'EXIT_TICKETS': 'Exit Tickets'
};

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading } = useDashboard();

  return (
    <PageContainer>
      <PageHeader
        title="ELA Template Dashboard"
        description="Overview of your Christian-facing ELA content generation"
      />
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Total Templates</h3>
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <p className="text-3xl font-bold text-primary-600">{stats?.total_products || 0}</p>
              <p className="text-sm text-neutral-500 mt-1">ELA templates</p>
            </>
          )}
        </Card>
        
        <Card>
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Generation Jobs</h3>
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <p className="text-3xl font-bold text-success-500">{stats?.total_generation_jobs || 0}</p>
              <p className="text-sm text-neutral-500 mt-1">Total jobs</p>
            </>
          )}
        </Card>
        
        <Card>
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Christian Content</h3>
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <p className="text-3xl font-bold text-blue-600">{stats?.content_by_worldview?.CHRISTIAN || 0}</p>
              <p className="text-sm text-neutral-500 mt-1">Faith-conscious</p>
            </>
          )}
        </Card>
        
        <Card>
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Generated</h3>
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <p className="text-3xl font-bold text-success-500">{stats?.products_by_status?.GENERATED || 0}</p>
              <p className="text-sm text-neutral-500 mt-1">Ready templates</p>
            </>
          )}
        </Card>
      </div>

      {/* Template Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Template Types */}
        <Card>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Template Types</h3>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="md" />
            </div>
          ) : stats?.templates_by_type ? (
            <div className="space-y-3">
              {Object.entries(stats.templates_by_type).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                  <span className="font-medium text-neutral-900">
                    {templateTypeLabels[type] || type}
                  </span>
                  <span className="text-2xl font-bold text-primary-600">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No templates yet"
              description="Generate your first template to see distribution"
            />
          )}
        </Card>

        {/* Grade Distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Grade Distribution</h3>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="md" />
            </div>
          ) : stats?.content_by_grade ? (
            <div className="space-y-3">
              {Object.entries(stats.content_by_grade).map(([grade, count]) => (
                <div key={grade} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                  <span className="font-medium text-neutral-900">Grade {grade}</span>
                  <span className="text-2xl font-bold text-primary-600">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No grade data yet"
              description="Templates will be organized by grade level"
            />
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Section title="Quick Actions" description="Generate and manage ELA templates">
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="primary" as={Link} to="/quick-generate" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">⚡</span>
              <span>Generate Template</span>
            </Button>
            <Button variant="secondary" as={Link} to="/products" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📝</span>
              <span>View Templates</span>
            </Button>
            <Button variant="outline" as={Link} to="/jobs" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">🔄</span>
              <span>Generation Jobs</span>
            </Button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-neutral-900 mb-2">Content Types Available:</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Bundle Overview</li>
                  <li>• Vocabulary Pack</li>
                  <li>• Anchor Reading Passage</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900 mb-2">Features:</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Christian worldview option</li>
                  <li>• SEO-optimized content</li>
                  <li>• Grade-appropriate difficulty</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </Section>
    </PageContainer>
  );
};
