import React from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="border-b border-neutral-200 pb-4">
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        {description && (
          <p className="text-sm text-neutral-600 mt-1">{description}</p>
        )}
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};