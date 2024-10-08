import { cn } from '@/lib/utils';
import React from 'react';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-800',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
