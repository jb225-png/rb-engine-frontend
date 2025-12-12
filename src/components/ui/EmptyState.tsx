import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <h3 className="text-sm font-medium text-neutral-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-500 mb-4">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};