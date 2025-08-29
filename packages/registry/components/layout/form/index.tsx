

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

export interface FormProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formVariants> {
  columns?: {
    desktop?: number;
    mobile?: number;
    tablet?: number;
  };
  spacing?: 'comfortable' | 'compact' | 'relaxed' | 'tight';
  labels?: 'top' | 'left' | 'floating';
  width?: 'narrow' | 'normal' | 'wide' | 'full';
  maxWidth?: 'readable' | 'content' | 'prose' | 'container' | 'none';
  children?: React.ReactNode;
}

const formVariants = cva('w-full', {
  variants: {
    spacing: {
      tight: 'space-y-2',
      compact: 'space-y-3',
      comfortable: 'space-y-4',
      relaxed: 'space-y-6',
    },
    width: {
      narrow: 'w-80',
      normal: 'w-full',
      wide: 'w-full',
      full: 'w-full',
    },
    maxWidth: {
      readable: 'max-w-2xl',
      content: 'max-w-3xl',
      prose: 'max-w-4xl',
      container: 'max-w-6xl',
      none: 'max-w-none',
    },
    labels: {
      top: '[&_label]:block [&_label]:mb-1 [&_label]:text-sm [&_label]:font-medium [&_label]:text-foreground',
      left: '[&_.form-field]:grid [&_.form-field]:grid-cols-3 [&_.form-field]:gap-4 [&_.form-field]:items-start [&_.form-field_label]:col-span-1 [&_.form-field_label]:pt-2 [&_.form-field_label]:text-sm [&_.form-field_label]:font-medium [&_.form-field_label]:text-foreground [&_.form-field_.input-wrapper]:col-span-2',
      floating: '[&_.form-field]:relative [&_.form-field_label]:absolute [&_.form-field_label]:left-3 [&_.form-field_label]:top-0 [&_.form-field_label]:-translate-y-1/2 [&_.form-field_label]:bg-background [&_.form-field_label]:px-1 [&_.form-field_label]:text-xs [&_.form-field_label]:font-medium [&_.form-field_label]:text-muted-foreground [&_.form-field_label]:transition-all [&_.form-field_input:focus~label]:text-primary [&_.form-field_input:not(:placeholder-shown)~label]:text-primary',
    },
  },
  defaultVariants: {
    spacing: 'comfortable',
    width: 'normal',
    maxWidth: 'readable',
    labels: 'top',
  },
});

const getGridColumns = (columns: FormProps['columns']) => {
  if (!columns) return '';
  
  const { desktop = 1, mobile = 1, tablet } = columns;
  
  let gridClass = '';
  
  // Mobile columns
  if (mobile === 1) {
    gridClass += 'grid-cols-1';
  } else if (mobile === 2) {
    gridClass += 'grid-cols-2';
  } else if (mobile === 3) {
    gridClass += 'grid-cols-3';
  } else if (mobile === 4) {
    gridClass += 'grid-cols-4';
  } else {
    gridClass += 'grid-cols-1';
  }
  
  // Tablet columns
  if (tablet) {
    if (tablet === 1) {
      gridClass += ' sm:grid-cols-1';
    } else if (tablet === 2) {
      gridClass += ' sm:grid-cols-2';
    } else if (tablet === 3) {
      gridClass += ' sm:grid-cols-3';
    } else if (tablet === 4) {
      gridClass += ' sm:grid-cols-4';
    }
  }
  
  // Desktop columns
  if (desktop === 1) {
    gridClass += ' md:grid-cols-1';
  } else if (desktop === 2) {
    gridClass += ' md:grid-cols-2';
  } else if (desktop === 3) {
    gridClass += ' md:grid-cols-3';
  } else if (desktop === 4) {
    gridClass += ' md:grid-cols-4';
  }
  
  return gridClass;
};

const Form = React.forwardRef<HTMLDivElement, FormProps>(
  (
    {
      className,
      spacing = 'comfortable',
      width = 'normal',
      maxWidth = 'readable',
      labels = 'top',
      columns,
      children,
      ...props
    },
    ref
  ) => {
    const hasColumns = columns && (columns.desktop! > 1 || columns.mobile! > 1 || (columns.tablet && columns.tablet > 1));
    const gridClasses = hasColumns ? `grid ${getGridColumns(columns)} gap-x-4` : '';

    return (
      <div
        ref={ref}
        className={cn(
          formVariants({ spacing, width, maxWidth, labels }),
          gridClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Form.displayName = 'Form';

// Form Field wrapper component for better structure
export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('form-field', className)} {...props}>
        {children}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

// Input wrapper for floating labels
export interface InputWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const InputWrapper = React.forwardRef<HTMLDivElement, InputWrapperProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('input-wrapper', className)} {...props}>
        {children}
      </div>
    );
  }
);

InputWrapper.displayName = 'InputWrapper';

export { Form, FormField, InputWrapper, formVariants };