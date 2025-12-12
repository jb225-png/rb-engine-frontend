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
    <div className={`space-y-6 ${className}`}>
      <div className="border-b border-neutral-200 pb-4">
        <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
        {description && (
          <p className="text-sm text-neutral-600 mt-2">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};