import React from 'react';

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  error,
  helperText,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`
            mt-1 w-4 h-4 rounded border-2 transition-colors
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            ${error 
              ? 'border-error-500 text-error-600' 
              : 'border-neutral-300 text-primary-600'
            }
          `}
        />
        {label && (
          <span className={`text-sm ${disabled ? 'text-neutral-500' : 'text-neutral-700'}`}>
            {label}
          </span>
        )}
      </label>
      
      {error && (
        <p className="text-sm text-error-600 ml-7">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-neutral-500 ml-7">{helperText}</p>
      )}
    </div>
  );
};