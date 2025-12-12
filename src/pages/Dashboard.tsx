import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Section } from '../components/ui/Section';

export const Dashboard: React.FC = () => {
  // TODO: Replace with real data from API
  const stats = {
    totalProducts: 0,
    pendingUploads: 0,
    activeBundles: 0
  };

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Overview of your RBB Engine content and activities"
      />
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">Total Products</h3>
          <p className="text-4xl font-bold text-primary-600">{stats.totalProducts}</p>
          <p className="text-sm text-neutral-500 mt-2">Curriculum products in system</p>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">Pending Uploads</h3>
          <p className="text-4xl font-bold text-warning-500">{stats.pendingUploads}</p>
          <p className="text-sm text-neutral-500 mt-2">Items in upload queue</p>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">Active Bundles</h3>
          <p className="text-4xl font-bold text-success-500">{stats.activeBundles}</p>
          <p className="text-sm text-neutral-500 mt-2">Product bundles configured</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <Section title="Quick Actions" description="Common tasks and shortcuts">
        <Card>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Generate New Product</Button>
            <Button variant="secondary">View Upload Queue</Button>
            <Button variant="outline">Manage Bundles</Button>
          </div>
        </Card>
      </Section>
    </PageContainer>
  );
};
