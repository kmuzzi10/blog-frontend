import React, { useState } from 'react';
import { cn } from './Button'; // Reusing cn for class composition
import { Loader2 } from 'lucide-react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
  spinnerSize?: number;
}

export function LazyImage({ 
  src, 
  alt, 
  className, 
  wrapperClassName, 
  spinnerSize = 24,
  ...props 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {(!isLoaded && !hasError) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 backdrop-blur-sm animate-pulse z-0">
          <Loader2 className="animate-spin text-primary/50" size={spinnerSize} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={cn(
          "transition-opacity duration-500 z-10 relative object-cover",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      />
    </div>
  );
}

