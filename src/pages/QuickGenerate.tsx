import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { FormSection } from '../components/ui/FormSection';
import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer } from '../components/layout/PageContainer';
import { EmptyState } from '../components/ui/EmptyState';
import { generationApi } from '../api/generation';
import { useStandards } from '../hooks/useStandards';
import { TemplateType, ELAStandardType, GradeLevel, WorldviewFlag, GenerateTemplateRequest } from '../types/api';

interface FormData {
  grade_level: GradeLevel;
  ela_standard_type: ELAStandardType;
  ela_standard_code: string;
  template_type: TemplateType;
  worldview_flag: WorldviewFlag;
  standard_id: number | null;
}

const templateOptions: { value: TemplateType; label: string; description: string }[] = [
  { value: 'BUNDLE_OVERVIEW', label: 'Bundle Overview', description: 'Complete curriculum package overview' },
  { value: 'VOCABULARY_PACK', label: 'Vocabulary Pack', description: 'Key terms and definitions' },
  { value: 'ANCHOR_READING_PASSAGE', label: 'Anchor Reading Passage', description: 'Core reading text with analysis' },
  { value: 'READING_COMPREHENSION_QUESTIONS', label: 'Reading Comprehension', description: 'Questions to test understanding' },
  { value: 'SHORT_QUIZ', label: 'Short Quiz', description: 'Quick assessment tool' },
  { value: 'EXIT_TICKETS', label: 'Exit Tickets', description: 'End-of-lesson check for understanding' },
];

export const QuickGenerate: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    grade_level: 6,
    ela_standard_type: 'RI',
    ela_standard_code: '',
    template_type: 'ANCHOR_READING_PASSAGE',
    worldview_flag: 'NEUTRAL',
    standard_id: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: standards } = useStandards({
    grade_level: formData.grade_level,
    ela_standard_type: formData.ela_standard_type,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.standard_id) return;
    
    setIsLoading(true);
    
    try {
      const request: GenerateTemplateRequest = {
        standard_id: formData.standard_id,
        template_type: formData.template_type,
        grade_level: formData.grade_level,
        ela_standard_type: formData.ela_standard_type,
        ela_standard_code: formData.ela_standard_code,
        worldview_flag: formData.worldview_flag,
      };
      
      const result = await generationApi.generateTemplate(request);
      alert(`Template generation started! Job ID: ${result.job_id}`);
    } catch (error: any) {
      console.error('Generation failed:', error);
      alert(`Generation failed: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      grade_level: 6,
      ela_standard_type: 'RI',
      ela_standard_code: '',
      template_type: 'ANCHOR_READING_PASSAGE',
      worldview_flag: 'NEUTRAL',
      standard_id: null,
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Generate ELA Template"
        description="Create Christian-facing ELA content using structured templates"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Grade & Standard Section */}
              <FormSection
                title="Grade & ELA Standard"
                description="Select grade level and ELA standard type"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Grade Level"
                    value={formData.grade_level.toString()}
                    onChange={(e) => setFormData(prev => ({ ...prev, grade_level: parseInt(e.target.value) as GradeLevel }))}
                    required
                  >
                    <option value="6">Grade 6</option>
                    <option value="7">Grade 7</option>
                    <option value="8">Grade 8</option>
                  </Select>

                  <Select
                    label="ELA Standard Type"
                    value={formData.ela_standard_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, ela_standard_type: e.target.value as ELAStandardType }))}
                    required
                  >
                    <option value="RI">Reading Informational (RI)</option>
                    <option value="RL">Reading Literature (RL)</option>
                  </Select>
                </div>
              </FormSection>

              {/* Standard Selection */}
              <FormSection
                title="Specific Standard"
                description="Choose the specific ELA standard"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Standard Code"
                    value={formData.ela_standard_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, ela_standard_code: e.target.value }))}
                    placeholder="e.g., RI.6.1 or RL.7.2"
                    required
                  />
                  
                  <Select
                    label="Available Standards"
                    value={formData.standard_id?.toString() || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, standard_id: parseInt(e.target.value) }))}
                    required
                  >
                    <option value="">Select a standard</option>
                    {standards?.data?.map((standard) => (
                      <option key={standard.id} value={standard.id}>
                        {standard.code} - {standard.description}
                      </option>
                    ))}
                  </Select>
                </div>
              </FormSection>

              {/* Template Selection */}
              <FormSection
                title="Template Type"
                description="Choose the type of content to generate"
              >
                <Select
                  label="Template"
                  value={formData.template_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, template_type: e.target.value as TemplateType }))}
                  required
                >
                  {templateOptions.map((template) => (
                    <option key={template.value} value={template.value}>
                      {template.label}
                    </option>
                  ))}
                </Select>
                <p className="text-sm text-neutral-600 mt-2">
                  {templateOptions.find(t => t.value === formData.template_type)?.description}
                </p>
              </FormSection>

              {/* Worldview Selection */}
              <FormSection
                title="Content Worldview"
                description="Choose content perspective"
              >
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="worldview"
                      value="NEUTRAL"
                      checked={formData.worldview_flag === 'NEUTRAL'}
                      onChange={(e) => setFormData(prev => ({ ...prev, worldview_flag: e.target.value as WorldviewFlag }))}
                      className="w-4 h-4 text-primary-600"
                    />
                    <div>
                      <span className="font-medium text-neutral-900">Neutral Content</span>
                      <p className="text-sm text-neutral-600">Standard academic content without religious perspective</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="worldview"
                      value="CHRISTIAN"
                      checked={formData.worldview_flag === 'CHRISTIAN'}
                      onChange={(e) => setFormData(prev => ({ ...prev, worldview_flag: e.target.value as WorldviewFlag }))}
                      className="w-4 h-4 text-primary-600"
                    />
                    <div>
                      <span className="font-medium text-neutral-900">Christian-Facing Content</span>
                      <p className="text-sm text-neutral-600">Values-aligned academic content (not preachy)</p>
                    </div>
                  </label>
                </div>
              </FormSection>

              {/* Submit Section */}
              <div className="flex gap-4 pt-4 border-t border-neutral-200">
                <Button
                  type="submit"
                  variant="primary"
                  loading={isLoading}
                  disabled={!formData.standard_id || !formData.ela_standard_code}
                >
                  Generate Template
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

        {/* Template Info Sidebar */}
        <div>
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Template Output</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-neutral-700">Includes:</span>
                <ul className="mt-1 space-y-1 text-neutral-600">
                  <li>• Final content (PDF-ready)</li>
                  <li>• SEO title & description</li>
                  <li>• Internal linking block</li>
                  <li>• Social media snippets</li>
                </ul>
              </div>
              
              <div className="pt-3 border-t border-neutral-200">
                <span className="font-medium text-neutral-700">Christian Content:</span>
                <p className="mt-1 text-neutral-600">Academic focus with values alignment, no sermon tone</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};