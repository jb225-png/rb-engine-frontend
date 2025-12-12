import React from 'react';
import { Input } from '../ui/Input';
import { FormSection } from '../ui/FormSection';
import { Curriculum } from '../../config/locales';

interface StandardSectionProps {
  curriculum: Curriculum;
  standardCode: string;
  onStandardCodeChange: (code: string) => void;
}

export const StandardSection: React.FC<StandardSectionProps> = ({
  curriculum,
  standardCode,
  onStandardCodeChange,
}) => {
  const placeholder = curriculum === 'CBSE' 
    ? 'e.g., CBSE.MATH.CLASS3.NUMBERS' 
    : 'e.g., CCSS.MATH.CONTENT.3.OA.A.1';
    
  const helperText = curriculum === 'CBSE'
    ? 'Enter CBSE standard format: CBSE.SUBJECT.CLASS.TOPIC'
    : 'Enter Common Core standard identifier';

  return (
    <FormSection
      title="Standard Input"
      description="Enter the educational standard code to generate content for"
    >
      <Input
        label="Standard Code"
        value={standardCode}
        onChange={(e) => onStandardCodeChange(e.target.value)}
        placeholder={placeholder}
        helperText={helperText}
        required
      />
    </FormSection>
  );
};