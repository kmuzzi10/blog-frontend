import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from './Button';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full flex-col flex pointer-events-auto">
        {label && <label className="mb-2 text-sm font-semibold text-gray-600 block">{label}</label>}
        <div className="relative group">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full bg-background rounded-clay-sm px-4 py-3 placeholder:text-gray-400 focus:outline-none transition-shadow duration-300 shadow-clay-inset focus:shadow-clay-inset-hover pr-12",
              error && "shadow-red-200 focus:shadow-red-200 border border-red-300",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none p-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
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
