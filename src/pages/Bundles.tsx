import React from 'react';
import { Link } from 'react-router-dom';
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
        actions={<Button variant="primary" disabled>Create Bundle</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.length > 0 ? (
          bundles.map((bundle) => (
            <Card key={bundle.id}>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{bundle.name}</h3>
              <p className="text-neutral-600 text-sm mb-4">{bundle.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-500">{bundle.productCount} products</span>
                <Button variant="outline" size="sm" disabled>View</Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="border-2 border-dashed border-neutral-300 flex items-center justify-center min-h-[300px] col-span-full">
            <EmptyState
              title="Product Bundles Coming Soon"
              description="Bundle functionality will allow you to group related products for easier management and distribution."
              action={
                <div className="space-y-3">
                  <Button variant="primary" as={Link} to="/products">
                    View Products
                  </Button>
                  <div className="text-sm text-neutral-500">
                    <p className="mb-2">Coming features:</p>
                    <ul className="text-xs space-y-1 text-left">
                      <li>• Group products by curriculum or theme</li>
                      <li>• Bulk operations on bundled products</li>
                      <li>• Bundle-level metadata and settings</li>
                      <li>• Export entire bundles</li>
                    </ul>
                  </div>
                </div>
              }
            />
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
