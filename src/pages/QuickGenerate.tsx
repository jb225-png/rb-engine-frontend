import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { FormSection } from '../components/ui/FormSection';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';

interface FormData {
  standardCode: string;
  fullBundle: boolean;
  selectedProducts: string[];
}

const productOptions = [
  { value: 'course', label: 'Course' },
  { value: 'module', label: 'Module' },
  { value: 'lesson', label: 'Lesson' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'activity', label: 'Activity' },
  { value: 'resource', label: 'Resource' },
];

// Dummy history data
const historyData = [
  {
    id: 1,
    standard: 'CCSS.MATH.CONTENT.3.OA.A.1',
    productsCount: 12,
    status: 'success' as const,
    createdAt: '2024-01-15 14:30',
  },
  {
    id: 2,
    standard: 'CCSS.ELA-LITERACY.RL.4.1',
    productsCount: 8,
    status: 'generating' as const,
    createdAt: '2024-01-15 13:45',
  },
  {
    id: 3,
    standard: 'NGSS.K-ESS2-1',
    productsCount: 6,
    status: 'error' as const,
    createdAt: '2024-01-15 12:20',
  },
];

export const QuickGenerate: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    standardCode: '',
    fullBundle: true,
    selectedProducts: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    console.log('Form submitted:', formData);
    
    setTimeout(() => {
      setIsLoading(false);
      alert('Generation started! Check the history section for updates.');
    }, 2000);
  };

  const handleProductToggle = (productValue: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productValue)
        ? prev.selectedProducts.filter(p => p !== productValue)
        : [...prev.selectedProducts, productValue]
    }));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Quick Generate"
        description="Generate curriculum content quickly using AI-powered tools"
        actions={
          <Button variant="outline">
            View Templates
          </Button>
        }
      />

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
                  onChange={(e) => setFormData(prev => ({ ...prev, standardCode: e.target.value }))}
                  placeholder="e.g., CCSS.MATH.CONTENT.3.OA.A.1"
                  helperText="Enter a valid educational standard identifier"
                  required
                />
              </FormSection>

              {/* Product Selection Section */}
              <FormSection
                title="Product Selection"
                description="Choose which products to generate for this standard"
              >
                <Checkbox
                  label="Generate full 12-product bundle"
                  checked={formData.fullBundle}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullBundle: e.target.checked }))}
                  helperText="Includes all product types: courses, modules, lessons, assessments, activities, and resources"
                />

                {!formData.fullBundle && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-neutral-700">Select specific products:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {productOptions.map((product) => (
                        <Checkbox
                          key={product.value}
                          label={product.label}
                          checked={formData.selectedProducts.includes(product.value)}
                          onChange={() => handleProductToggle(product.value)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </FormSection>

              {/* Submit Section */}
              <div className="flex gap-4 pt-4 border-t border-neutral-200">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading || !formData.standardCode}
                >
                  {isLoading ? 'Generating...' : 'Generate Products'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormData({ standardCode: '', fullBundle: true, selectedProducts: [] })}
                  disabled={isLoading}
                >
                  Reset Form
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* History Section */}
        <div>
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Generations</h3>
            
            <div className="space-y-4">
              {historyData.map((item) => (
                <div key={item.id} className="p-4 border border-neutral-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {item.standard}
                    </p>
                    <StatusBadge status={item.status}>
                      {item.status}
                    </StatusBadge>
                  </div>
                  <p className="text-xs text-neutral-500 mb-1">
                    {item.productsCount} products
                  </p>
                  <p className="text-xs text-neutral-400">
                    {item.createdAt}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200">
              <Button variant="outline" className="w-full text-sm">
                View All History
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Full History Table */}
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Generation History</h3>
        
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Standard</TableHeader>
              <TableHeader>Products Count</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Created At</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {historyData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <span className="font-medium">{item.standard}</span>
                </TableCell>
                <TableCell>{item.productsCount}</TableCell>
                <TableCell>
                  <StatusBadge status={item.status}>
                    {item.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>{item.createdAt}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" className="text-xs px-2 py-1">
                      View
                    </Button>
                    {item.status === 'error' && (
                      <Button variant="outline" className="text-xs px-2 py-1">
                        Retry
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};