import React from 'react';
import { cn } from './Button';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full flex-col flex pointer-events-auto">
        {label && <label className="mb-2 text-sm font-semibold text-gray-600 block">{label}</label>}
        <input
          ref={ref}
          className={cn(
            "w-full bg-background rounded-clay-sm px-4 py-3 placeholder:text-gray-400 focus:outline-none transition-shadow duration-300 shadow-clay-inset focus:shadow-clay-inset-hover",
            error && "shadow-red-200 focus:shadow-red-200 border border-red-300",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-2 ml-1 font-medium">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="mb-2 text-sm font-semibold text-gray-600 block">{label}</label>}
        <textarea
          ref={ref}
          className={cn(
            "w-full bg-background rounded-clay-sm px-4 py-3 placeholder:text-gray-400 focus:outline-none transition-shadow duration-300 shadow-clay-inset focus:shadow-clay-inset-hover min-h-[120px] resize-y",
            error && "shadow-red-200 focus:shadow-red-200 border border-red-300",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-1 ml-1">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
