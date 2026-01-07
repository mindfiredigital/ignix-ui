'use client';

/**
 * @fileoverview ButtonWithSpinner Component
 * 
 * A button component that displays a loading spinner and changes text during loading states.
 * Automatically adjusts spinner colors based on button variant for optimal visibility.
 * 
 * @module ButtonWithSpinner
 */

import * as React from 'react';
import { Button, type ButtonProps } from '../button';
import { Spinner } from '../spinner';
import { cn } from '../../../utils/cn';

/**
 * Props for the ButtonWithSpinner component.
 * 
 * @interface ButtonWithSpinnerProps
 * @extends {Omit<ButtonProps, 'disabled'>}
 * 
 * @property {boolean} [isLoading=false] - Whether the button is in a loading state. When true, the button is disabled and shows a spinner.
 * @property {string} [loadingText='Loading...'] - Text to display when the button is in loading state.
 * @property {number} [spinnerSize=16] - Size of the spinner in pixels. Should be adjusted based on button size.
 * @property {'default' | 'bars' | 'dots-bounce'} [spinnerVariant='default'] - Variant of the spinner animation.
 *   - 'default': Circular spinning border
 *   - 'bars': Rotating bars animation
 *   - 'dots-bounce': Bouncing dots animation
 * @property {string} [spinnerColor] - Tailwind CSS class for spinner color (e.g., "bg-white", "border-white", "bg-primary").
 *   If not provided, automatically determined based on button variant for optimal contrast.
 * @property {React.ReactNode} children - The button text/content to display when not loading.
 */
export interface ButtonWithSpinnerProps extends Omit<ButtonProps, 'disabled'> {
  isLoading?: boolean;
  loadingText?: string;
  spinnerSize?: number;
  spinnerVariant?: 'default' | 'bars' | 'dots-bounce';
  spinnerColor?: string;
  children: React.ReactNode;
}

/**
 * ButtonWithSpinner Component
 * 
 * A button component that displays a loading spinner and changes text during loading states.
 * The button is automatically disabled when loading, and the spinner color is intelligently
 * adjusted based on the button variant to ensure optimal visibility.
 * 
 * @component
 * @example
 * ```tsx
 * <ButtonWithSpinner
 *   isLoading={isLoading}
 *   loadingText="Saving..."
 *   onClick={handleSave}
 * >
 *   Save Changes
 * </ButtonWithSpinner>
 * ```
 * 
 * @param {ButtonWithSpinnerProps} props - Component props
 * @param {React.Ref<HTMLButtonElement>} ref - Forwarded ref to the button element
 * 
 * @returns {JSX.Element} A button element with spinner and loading state support
 */
export const ButtonWithSpinner = React.forwardRef<
  HTMLButtonElement,
  ButtonWithSpinnerProps
>(
  (
    {
      isLoading = false,
      loadingText = 'Loading...',
      spinnerSize = 16,
      spinnerVariant = 'default',
      spinnerColor,
      children,
      className,
      variant,
      ...props
    },
    ref
  ) => {
    /**
     * Determines the appropriate spinner color based on button variant.
     * 
     * Automatically selects a contrasting color for optimal visibility:
     * - Dark button backgrounds (default, primary, success, etc.) → white spinner
     * - Light button backgrounds (outline, ghost, etc.) → primary/dark spinner
     * 
     * @private
     * @function getSpinnerColor
     * @returns {string} Tailwind CSS class for spinner color
     */
    const getSpinnerColor = (): string => {
      if (spinnerColor) return spinnerColor;
      
      // For variants with dark backgrounds, use white/light spinner
      const darkBackgroundVariants = ['default', 'primary', 'secondary', 'success', 'warning', 'danger', 'pill', 'neon'];
      // For variants with light/transparent backgrounds, use dark spinner
      const lightBackgroundVariants = ['outline', 'ghost', 'subtle', 'elevated', 'glass'];
      
      if (variant && darkBackgroundVariants.includes(variant)) {
        // For bars and dots-bounce, use bg-white
        if (spinnerVariant === 'bars' || spinnerVariant === 'dots-bounce') {
          return 'bg-white';
        }
        // For default spinner, use border-white (border width is set via style)
        return 'border-white';
      } else if (variant && lightBackgroundVariants.includes(variant)) {
        // For bars and dots-bounce, use bg-primary
        if (spinnerVariant === 'bars' || spinnerVariant === 'dots-bounce') {
          return 'bg-primary';
        }
        // For default spinner, use border-primary (border width is set via style)
        return 'border-primary';
      }
      
      // Default fallback - assume dark background
      if (spinnerVariant === 'bars' || spinnerVariant === 'dots-bounce') {
        return 'bg-white';
      }
      return 'border-white';
    };

    return (
      <Button
        ref={ref}
        disabled={isLoading}
        className={cn('relative', className)}
        variant={variant}
        {...props}
      >
        {isLoading && (
          <Spinner
            size={spinnerSize}
            variant={spinnerVariant}
            color={getSpinnerColor()}
            className="mr-2"
          />
        )}
        <span>{isLoading ? loadingText : children}</span>
      </Button>
    );
  }
);

ButtonWithSpinner.displayName = 'ButtonWithSpinner';

