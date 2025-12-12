import React from 'react';
import { Checkbox } from '../ui/Checkbox';
import { FormSection } from '../ui/FormSection';

interface ProductSelectionSectionProps {
  fullBundle: boolean;
  selectedProducts: string[];
  onFullBundleChange: (checked: boolean) => void;
  onProductToggle: (productValue: string) => void;
}

const productOptions = [
  { value: 'course', label: 'Course' },
  { value: 'module', label: 'Module' },
  { value: 'lesson', label: 'Lesson' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'activity', label: 'Activity' },
  { value: 'resource', label: 'Resource' },
];

export const ProductSelectionSection: React.FC<ProductSelectionSectionProps> = ({
  fullBundle,
  selectedProducts,
  onFullBundleChange,
  onProductToggle,
}) => {
  return (
    <FormSection
      title="Product Selection"
      description="Choose which products to generate for this standard"
    >
      <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg mb-4">
        <Checkbox
          label="Full 12-Product Bundle (Recommended)"
          checked={fullBundle}
          onChange={(e) => onFullBundleChange(e.target.checked)}
          helperText="Complete curriculum package with all product types"
        />
      </div>

      {!fullBundle && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-neutral-700">Or select individual products:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Core Content</p>
              {productOptions.slice(0, 3).map((product) => (
                <Checkbox
                  key={product.value}
                  label={product.label}
                  checked={selectedProducts.includes(product.value)}
                  onChange={() => onProductToggle(product.value)}
                />
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Support Materials</p>
              {productOptions.slice(3).map((product) => (
                <Checkbox
                  key={product.value}
                  label={product.label}
                  checked={selectedProducts.includes(product.value)}
                  onChange={() => onProductToggle(product.value)}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-neutral-500">Bundle includes: Courses, Modules, Lessons, Assessments, Activities, and Resources</p>
        </div>
      )}
    </FormSection>
  );
};