import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;
  direction?: 'vertical' | 'horizontal' | 'both';
  responsive?: {
    mobile?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;
    tablet?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;
    desktop?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;
  };
}

const spacerVariants = cva('', {
  variants: {
    size: {
      xs: 'h-1 w-1',
      sm: 'h-2 w-2',
      md: 'h-4 w-4',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
    },
    direction: {
      vertical: 'w-0',
      horizontal: 'h-0',
      both: '',
    },
  },
  defaultVariants: {
    size: 'md',
    direction: 'vertical',
  },
});

const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  (
    { className, size = 'md', direction = 'vertical', responsive, style, ...props },
    ref
  ) => {
    const designTokenSizes = ['xs', 'sm', 'md', 'lg', 'xl'];

    const responsiveClasses: string[] = [];
    if (responsive) {
      if (responsive.mobile && designTokenSizes.includes(responsive.mobile as string)) {
        responsiveClasses.push(spacerVariants({ size: responsive.mobile as any, direction }));
      }
      if (responsive.tablet && designTokenSizes.includes(responsive.tablet as string)) {
        responsiveClasses.push(
          `sm:${spacerVariants({ size: responsive.tablet as any, direction })}`
        );
      }
      if (responsive.desktop && designTokenSizes.includes(responsive.desktop as string)) {
        responsiveClasses.push(
          `md:${spacerVariants({ size: responsive.desktop as any, direction })}`
        );
      }
    }

    const isCustomSize = size && !designTokenSizes.includes(size as string);
    const dynamicStyle: React.CSSProperties = { ...style };

    if (isCustomSize) {
      const value =
        typeof size === 'number'
          ? `${size}px`
          : /^\d+$/.test(size as string)
          ? `${size}px`
          : size;

      if (direction === 'vertical') {
        dynamicStyle.height = value;
        dynamicStyle.width = 0;
      } else if (direction === 'horizontal') {
        dynamicStyle.width = value;
        dynamicStyle.height = 0;
      } else {
        dynamicStyle.height = value;
        dynamicStyle.width = value;
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          !isCustomSize && spacerVariants({ size: size as any, direction }),
          responsiveClasses,
          className
        )}
        style={dynamicStyle}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Spacer.displayName = 'Spacer';

export { Spacer, spacerVariants };
