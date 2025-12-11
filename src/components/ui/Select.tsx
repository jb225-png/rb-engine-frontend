import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  options,
  disabled = false,
  required = false,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-2 border rounded-lg transition-colors appearance-none bg-white
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed
          ${error 
            ? 'border-error-500 focus:ring-error-500' 
            : 'border-neutral-300 hover:border-neutral-400'
          }
        `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  );
};