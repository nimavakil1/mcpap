'use client';

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const checkboxId = id || props.name;

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={cn(
              'peer w-5 h-5 rounded border-2 border-[#E0E0E0] appearance-none cursor-pointer',
              'checked:bg-[#E31E24] checked:border-[#E31E24]',
              'focus:ring-2 focus:ring-[#E31E24] focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-[#DC3545]',
              className
            )}
            {...props}
          />
          <Check
            size={14}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none opacity-0 peer-checked:opacity-100"
          />
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className={cn(
              'text-sm cursor-pointer',
              props.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {label}
          </label>
        )}
        {error && <p className="error-text ml-8 -mt-1">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
