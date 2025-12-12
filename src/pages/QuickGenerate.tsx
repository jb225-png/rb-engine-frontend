import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { LocaleAndGradeSection } from '../components/quick-generate/LocaleAndGradeSection';
import { StandardSection } from '../components/quick-generate/StandardSection';
import { ProductSelectionSection } from '../components/quick-generate/ProductSelectionSection';
import { HistorySection } from '../components/quick-generate/HistorySection';
import { Locale, Curriculum, DEFAULT_LOCALE } from '../config/locales';
import { getDefaultCurriculum, isCurriculumValidForLocale } from '../utils/locale';

interface FormData {
  locale: Locale;
  curriculum: Curriculum;
  grade: string;
  standardCode: string;
  fullBundle: boolean;
  selectedProducts: string[];
}

// TODO: Replace with real data from API when backend is ready
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

  const handleProductToggle = (productValue: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productValue)
        ? prev.selectedProducts.filter(p => p !== productValue)
        : [...prev.selectedProducts, productValue]
    }));
  };

  // TODO: Replace with real API call when backend is ready
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Form submitted:', formData);
    
    setTimeout(() => {
      setIsLoading(false);
      alert('Generation started! Check the history section for updates.');
    }, 2000);
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
              <LocaleAndGradeSection
                locale={formData.locale}
                curriculum={formData.curriculum}
                grade={formData.grade}
                onLocaleChange={(locale) => setFormData(prev => ({ ...prev, locale }))}
                onCurriculumChange={(curriculum) => setFormData(prev => ({ ...prev, curriculum }))}
                onGradeChange={(grade) => setFormData(prev => ({ ...prev, grade }))}
              />

              <StandardSection
                curriculum={formData.curriculum}
                standardCode={formData.standardCode}
                onStandardCodeChange={(standardCode) => setFormData(prev => ({ ...prev, standardCode }))}
              />

              <ProductSelectionSection
                fullBundle={formData.fullBundle}
                selectedProducts={formData.selectedProducts}
                onFullBundleChange={(fullBundle) => setFormData(prev => ({ ...prev, fullBundle }))}
                onProductToggle={handleProductToggle}
              />

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
          <HistorySection historyData={historyData} />
        </div>
      </div>
    </PageContainer>
  );
};