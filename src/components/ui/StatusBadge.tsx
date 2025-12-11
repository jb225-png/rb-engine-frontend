import React from 'react';

type StatusType = 'success' | 'error' | 'pending' | 'generating';

interface StatusBadgeProps {
  status: StatusType;
  children: React.ReactNode;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  success: 'bg-success-100 text-success-700 border-success-200',
  error: 'bg-error-100 text-error-700 border-error-200',
  pending: 'bg-warning-100 text-warning-700 border-warning-200',
  generating: 'bg-primary-100 text-primary-700 border-primary-200',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${statusStyles[status]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};