import React from 'react';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

const alertStyles: Record<AlertVariant, string> = {
  success: 'bg-success-50 border-success-200 text-success-800',
  error: 'bg-error-50 border-error-200 text-error-800',
  warning: 'bg-warning-50 border-warning-200 text-warning-800',
  info: 'bg-primary-50 border-primary-200 text-primary-800',
};

const iconMap: Record<AlertVariant, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

export const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div className={`border rounded-lg p-4 ${alertStyles[variant]} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <span className="text-lg">{iconMap[variant]}</span>
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">{title}</h3>
          )}
          {description && (
            <p className="text-sm">{description}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};