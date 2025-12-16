import React from 'react';
import { Button } from './Button';

interface FilterBarProps {
  children: React.ReactNode;
  onClear?: () => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  children,
  onClear,
  className = '',
}) => {
  return (
    <div className={`p-4 bg-neutral-50 border border-neutral-200 rounded-lg mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 flex-1">
          {children}
        </div>
        {onClear && (
          <div className="flex-shrink-0">
            <Button variant="outline" size="sm" onClick={onClear}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};