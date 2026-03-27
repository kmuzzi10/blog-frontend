import React from 'react';
import { cn } from './Button';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'gray';
}

export function Badge({ className, variant = 'primary', children, ...props }: BadgeProps) {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    accent: "bg-accent/10 text-accent border-accent/30",
    gray: "bg-gray-200/50 text-gray-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-clay-badge border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
