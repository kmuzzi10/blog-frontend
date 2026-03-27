import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    
    const baseClass = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-clay outline-none active:scale-95";
    
    const variants = {
      primary: "bg-primary text-white shadow-clay hover:shadow-clay-hover hover:-translate-y-1 active:shadow-clay-inset",
      secondary: "bg-secondary text-white shadow-clay hover:shadow-clay-hover hover:-translate-y-1 active:shadow-clay-inset",
      danger: "bg-red-500 text-white shadow-clay hover:shadow-clay-hover hover:-translate-y-1 active:shadow-clay-inset",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100/50 hover:shadow-clay",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          baseClass,
          variants[variant],
          sizes[size],
          (isLoading || props.disabled) && "opacity-60 cursor-not-allowed hover:translate-y-0 active:scale-100 hover:shadow-clay",
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
