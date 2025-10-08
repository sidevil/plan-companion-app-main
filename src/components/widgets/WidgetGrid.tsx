import React from 'react';
import { cn } from '@/lib/utils';

interface WidgetGridProps {
  children: React.ReactNode;
  className?: string;
}

export const WidgetGrid = ({ children, className }: WidgetGridProps) => {
  return (
    <div className={cn(
      'grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      className
    )}>
      {children}
    </div>
  );
};

// Individual widget container for consistent sizing
interface WidgetContainerProps {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const WidgetContainer = ({ children, size = 'medium', className }: WidgetContainerProps) => {
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 md:col-span-1 row-span-1',
    large: 'col-span-1 md:col-span-2 row-span-1'
  };

  return (
    <div className={cn(sizeClasses[size], className)}>
      {children}
    </div>
  );
};