import React from 'react';

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        {description && (
          <p className="text-sm text-neutral-600 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};