import React from 'react';

interface LoadingPlaceholderProps {
  lines?: number;
  className?: string;
}

export const LoadingPlaceholder: React.FC<LoadingPlaceholderProps> = ({
  lines = 3,
  className = '',
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-neutral-200 rounded h-4 mb-3 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};