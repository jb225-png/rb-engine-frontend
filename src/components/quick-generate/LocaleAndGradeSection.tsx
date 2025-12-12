import React from 'react';
import { Select } from '../ui/Select';
import { FormSection } from '../ui/FormSection';
import { Locale, Curriculum, LOCALE_CONFIGS, CURRICULUM_LABELS } from '../../config/locales';
import { getSupportedCurricula, getGradeRangesForCurriculum } from '../../utils/locale';

interface LocaleAndGradeSectionProps {
  locale: Locale;
  curriculum: Curriculum;
  grade: string;
  onLocaleChange: (locale: Locale) => void;
  onCurriculumChange: (curriculum: Curriculum) => void;
  onGradeChange: (grade: string) => void;
}

export const LocaleAndGradeSection: React.FC<LocaleAndGradeSectionProps> = ({
  locale,
  curriculum,
  grade,
  onLocaleChange,
  onCurriculumChange,
  onGradeChange,
}) => {
  return (
    <>
      <FormSection
        title="Locale & Curriculum"
        description="Select your region and educational curriculum"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Locale"
            value={locale}
            onChange={(e) => onLocaleChange(e.target.value as Locale)}
            required
          >
            {Object.entries(LOCALE_CONFIGS).map(([code, config]) => (
              <option key={code} value={code}>{config.name}</option>
            ))}
          </Select>

          <Select
            label="Curriculum"
            value={curriculum}
            onChange={(e) => onCurriculumChange(e.target.value as Curriculum)}
            required
          >
            {getSupportedCurricula(locale).map((curr) => (
              <option key={curr} value={curr}>
                {CURRICULUM_LABELS[curr]}
              </option>
            ))}
          </Select>
        </div>
      </FormSection>

      <FormSection
        title="Grade Level"
        description="Select the grade level for content generation"
      >
        <Select
          label="Grade"
          value={grade}
          onChange={(e) => onGradeChange(e.target.value)}
          required
        >
          <option value="">Select grade level</option>
          {getGradeRangesForCurriculum(curriculum).map((gradeLevel) => (
            <option key={gradeLevel} value={gradeLevel}>
              {curriculum === 'CBSE' ? `Class ${gradeLevel}` : `Grade ${gradeLevel}`}
            </option>
          ))}
        </Select>
      </FormSection>
    </>
  );
};