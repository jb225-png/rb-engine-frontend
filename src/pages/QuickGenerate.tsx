import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { FormSection } from '../components/ui/FormSection';
import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { Locale, Curriculum, DEFAULT_LOCALE, LOCALE_CONFIGS, CURRICULUM_LABELS } from '../config/locales';
import { getDefaultCurriculum, getSupportedCurricula, getGradeRangesForCurriculum } from '../utils/locale';
import { api, GenerateProductRequest } from '../api/client';

interface FormData {
  locale: Locale;
  curriculum: Curriculum;
  grade: string;
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

export const QuickGenerate: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    locale: DEFAULT_LOCALE,
    curriculum: getDefaultCurriculum(DEFAULT_LOCALE),
    grade: '',
    standardCode: '',
    fullBundle: true,
    selectedProducts: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleProductToggle = (productValue: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productValue)
        ? prev.selectedProducts.filter(p => p !== productValue)
        : [...prev.selectedProducts, productValue]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const productTypeMap: Record<string, any> = {
        'course': 'WORKSHEET',
        'module': 'WORKSHEET', 
        'lesson': 'WORKSHEET',
        'assessment': 'ASSESSMENT',
        'activity': 'WORKSHEET',
        'resource': 'WORKSHEET'
      };
      
      const productType = formData.fullBundle ? 'WORKSHEET' : 
        productTypeMap[formData.selectedProducts[0]] || 'WORKSHEET';
      
      const request: GenerateProductRequest = {
        standard_id: 1,
        product_type: productType,
        locale: formData.locale,
        curriculum_board: formData.curriculum,
        grade_level: parseInt(formData.grade)
      };
      
      const result = await api.generateProduct(request);
      alert(`Generation started! Job ID: ${result.job_id}, Product ID: ${result.product_ids[0]}`);
    } catch (error: any) {
      console.error('Generation failed:', error);
      alert(`Generation failed: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      locale: DEFAULT_LOCALE, 
      curriculum: getDefaultCurriculum(DEFAULT_LOCALE), 
      grade: '', 
      standardCode: '', 
      fullBundle: true, 
      selectedProducts: [] 
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Quick Generate"
        description="Generate curriculum content quickly using AI-powered tools"
        actions={<Button variant="outline">View Templates</Button>}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Locale & Curriculum Section */}
              <FormSection
                title="Locale & Curriculum"
                description="Select your region and educational curriculum"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Locale"
                    value={formData.locale}
                    onChange={(e) => setFormData(prev => ({ ...prev, locale: e.target.value as Locale }))}
                    required
                  >
                    {Object.entries(LOCALE_CONFIGS).map(([code, config]) => (
                      <option key={code} value={code}>{config.name}</option>
                    ))}
                  </Select>

                  <Select
                    label="Curriculum"
                    value={formData.curriculum}
                    onChange={(e) => setFormData(prev => ({ ...prev, curriculum: e.target.value as Curriculum }))}
                    required
                  >
                    {getSupportedCurricula(formData.locale).map((curriculum) => (
                      <option key={curriculum} value={curriculum}>
                        {CURRICULUM_LABELS[curriculum]}
                      </option>
                    ))}
                  </Select>
                </div>
              </FormSection>

              {/* Grade Level Section */}
              <FormSection
                title="Grade Level"
                description="Select the grade level for content generation"
              >
                <Select
                  label="Grade"
                  value={formData.grade}
                  onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                  required
                >
                  <option value="">Select grade level</option>
                  {getGradeRangesForCurriculum(formData.curriculum).map((grade) => (
                    <option key={grade} value={grade}>
                      {formData.curriculum === 'CBSE' ? `Class ${grade}` : `Grade ${grade}`}
                    </option>
                  ))}
                </Select>
              </FormSection>

              {/* Standard Input Section */}
              <FormSection
                title="Standard Input"
                description="Enter the educational standard code to generate content for"
              >
                <Input
                  label="Standard Code"
                  value={formData.standardCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, standardCode: e.target.value }))}
                  placeholder={formData.curriculum === 'CBSE' ? 'e.g., CBSE.MATH.CLASS3.NUMBERS' : 'e.g., CCSS.MATH.CONTENT.3.OA.A.1'}
                  helperText={formData.curriculum === 'CBSE' ? 'Enter CBSE standard format: CBSE.SUBJECT.CLASS.TOPIC' : 'Enter Common Core standard identifier'}
                  required
                />
              </FormSection>

              {/* Product Selection Section */}
              <FormSection
                title="Product Selection"
                description="Choose which products to generate for this standard"
              >
                <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg mb-4">
                  <Checkbox
                    label="Full 12-Product Bundle (Recommended)"
                    checked={formData.fullBundle}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullBundle: e.target.checked }))}
                    helperText="Complete curriculum package with all product types"
                  />
                </div>

                {!formData.fullBundle && (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-neutral-700">Or select individual products:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Core Content</p>
                        {productOptions.slice(0, 3).map((product) => (
                          <Checkbox
                            key={product.value}
                            label={product.label}
                            checked={formData.selectedProducts.includes(product.value)}
                            onChange={() => handleProductToggle(product.value)}
                          />
                        ))}
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Support Materials</p>
                        {productOptions.slice(3).map((product) => (
                          <Checkbox
                            key={product.value}
                            label={product.label}
                            checked={formData.selectedProducts.includes(product.value)}
                            onChange={() => handleProductToggle(product.value)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </FormSection>

              {/* Submit Section */}
              <div className="flex gap-4 pt-4 border-t border-neutral-200">
                <Button
                  type="submit"
                  variant="primary"
                  loading={isLoading}
                  disabled={!formData.standardCode || !formData.grade}
                >
                  Generate Products
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isLoading}
                >
                  Reset Form
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* History Sidebar */}
        <div>
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Generations</h3>
            <EmptyState
              title="No recent runs yet"
              description="Your generation history will appear here"
            />
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <Button variant="outline" fullWidth className="text-sm">
                View All History
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};