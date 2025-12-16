import React from 'react';
import { Select } from './Select';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = 'All',
  className = '',
}) => {
  return (
    <div className={className}>
      <Select
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
};