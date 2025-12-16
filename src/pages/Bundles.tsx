import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { EmptyState } from '../components/ui/EmptyState';

export const Bundles: React.FC = () => {
  // TODO: Replace with real data from API
  const bundles: any[] = [];

  return (
    <PageContainer>
      <PageHeader
        title="Product Bundles"
        description="Organize and group related products into bundles for easier management and distribution"
        actions={<Button variant="primary">Create Bundle</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.length > 0 ? (
          bundles.map((bundle) => (
            <Card key={bundle.id}>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{bundle.name}</h3>
              <p className="text-neutral-600 text-sm mb-4">{bundle.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-500">{bundle.productCount} products</span>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="border-2 border-dashed border-neutral-300 flex items-center justify-center min-h-[200px] col-span-full">
            <EmptyState
              title="No bundles created yet"
              description="Create your first bundle to organize related products"
              action={<Button variant="primary">Create Your First Bundle</Button>}
            />
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
