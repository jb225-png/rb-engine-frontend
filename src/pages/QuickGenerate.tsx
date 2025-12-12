import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { FormSection } from '../components/ui/FormSection';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';
import { Locale, Curriculum, DEFAULT_LOCALE, LOCALE_CONFIGS, CURRICULUM_LABELS } from '../config/locales';
import { getDefaultCurriculum, getSupportedCurricula, getGradeRangesForCurriculum, isCurriculumValidForLocale } from '../utils/locale';

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

// Dummy history data - India-first examples
const historyData = [
  {
    id: 1,
    standard: 'CBSE.MATH.CLASS3.NUMBERS',
    productsCount: 12,
    status: 'success' as const,
    createdAt: '2024-01-15 14:30',
    locale: 'IN' as Locale,
    curriculum: 'CBSE' as Curriculum,
  },
  {
    id: 2,
    standard: 'CBSE.ENGLISH.CLASS4.READING',
    productsCount: 8,
    status: 'generating' as const,
    createdAt: '2024-01-15 13:45',
    locale: 'IN' as Locale,
    curriculum: 'CBSE' as Curriculum,
  },
  {
    id: 3,
    standard: 'CBSE.SCIENCE.CLASS5.PLANTS',
    productsCount: 6,
    status: 'error' as const,
    createdAt: '2024-01-15 12:20',
    locale: 'IN' as Locale,
    curriculum: 'CBSE' as Curriculum,
  },
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

  // Update curriculum when locale changes
  useEffect(() => {
    const defaultCurriculum = getDefaultCurriculum(formData.locale);
    if (!isCurriculumValidForLocale(formData.curriculum, formData.locale)) {
      setFormData(prev => ({ ...prev, curriculum: defaultCurriculum, grade: '' }));
    }
  }, [formData.locale, formData.curriculum]);

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
                    <p className="text-xs text-neutral-500">Bundle includes: Courses, Modules, Lessons, Assessments, Activities, and Resources</p>
                  </div>
                )}
              </FormSection>

              {/* Submit Section */}
              <div className="flex gap-4 pt-4 border-t border-neutral-200">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading || !formData.standardCode || !formData.grade}
                >
                  {isLoading ? 'Generating...' : 'Generate Products'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormData({ 
                    locale: DEFAULT_LOCALE, 
                    curriculum: getDefaultCurriculum(DEFAULT_LOCALE), 
                    grade: '', 
                    standardCode: '', 
                    fullBundle: true, 
                    selectedProducts: [] 
                  })}
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
            
            {historyData.length > 0 ? (
              <div className="space-y-4">
                {historyData.map((item) => (
                  <div key={item.id} className="p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {item.standard}
                      </p>
                      <StatusBadge status={item.status}>
                        {item.status === 'success' ? 'Completed' : 
                         item.status === 'generating' ? 'Pending' : 'Draft'}
                      </StatusBadge>
                    </div>
                    <p className="text-xs text-neutral-500 mb-1">
                      {item.productsCount} products • {CURRICULUM_LABELS[item.curriculum]}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {item.createdAt}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <p className="text-sm">No recent runs yet</p>
                <p className="text-xs mt-1">Your generation history will appear here</p>
              </div>
            )}

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
            {historyData.length > 0 ? (
              historyData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <span className="font-medium">{item.standard}</span>
                      <p className="text-xs text-neutral-500">{CURRICULUM_LABELS[item.curriculum]}</p>
                    </div>
                  </TableCell>
                  <TableCell>{item.productsCount}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status}>
                      {item.status === 'success' ? 'Completed' : 
                       item.status === 'generating' ? 'Pending' : 'Draft'}
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-neutral-500 py-8">
                  No generation history yet. Start by generating your first product bundle.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};