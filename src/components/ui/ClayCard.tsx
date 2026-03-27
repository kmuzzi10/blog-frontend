import React from 'react';
import { cn } from './Button';

interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const ClayCard = React.forwardRef<HTMLDivElement, ClayCardProps>(
  ({ className, padding = 'md', interactive = false, children, ...props }, ref) => {
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6 sm:p-8',
      lg: 'p-10 sm:p-12',
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-background rounded-clay-lg shadow-clay-card transition-all duration-300",
          paddings[padding],
          interactive && "hover:-translate-y-2 hover:shadow-clay-hover cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ClayCard.displayName = 'ClayCard';
