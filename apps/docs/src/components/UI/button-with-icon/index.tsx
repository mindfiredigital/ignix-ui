/**
 * ButtonWithIcon Component
 * 
 * An enhanced button component that extends the base Button with icon support.
 * Supports multiple icon positions, icon-only buttons, and loading states.
 * 
 * @file button-with-icon/index.tsx
 * @component ButtonWithIcon
 */

'use client';

import * as React from 'react';
import { Button, type ButtonProps } from '../button';
import { Spinner } from '../spinner';
import { cn } from '../../../utils/cn';

/**
 * Props for the ButtonWithIcon component.
 * Extends all ButtonProps from the base Button component.
 */
export interface ButtonWithIconProps extends ButtonProps {
  /**
   * Icon component to display. Can be from lucide-react or any React component.
   * 
   * @example
   * <ButtonWithIcon icon={<Download />}>Download</ButtonWithIcon>
   */
  icon?: React.ReactNode;
  
  /**
   * Position of the icon relative to the text.
   * 
   * - 'left': Icon appears before the text (default)
   * - 'right': Icon appears after the text
   * - 'only': Only the icon is displayed (no text)
   * 
   * @default 'left'
   * 
   * @example
   * <ButtonWithIcon icon={<Send />} iconPosition="right">Send</ButtonWithIcon>
   * <ButtonWithIcon icon={<Settings />} iconPosition="only" />
   */
  iconPosition?: 'left' | 'right' | 'only';
  
  /**
   * Show loading spinner instead of icon or text.
   * When true, the button is automatically disabled.
   * 
   * @default false
   * 
   * @example
   * <ButtonWithIcon loading={isSubmitting}>Submit</ButtonWithIcon>
   */
  loading?: boolean;
  
  /**
   * Size of the icon in pixels.
   * 
   * @default 16
   * 
   * @example
   * <ButtonWithIcon icon={<Download />} iconSize={20}>Download</ButtonWithIcon>
   */
  iconSize?: number;
}

/**
 * ButtonWithIcon Component
 * 
 * A flexible button component that supports icons in various positions,
 * icon-only buttons, and loading states with spinners.
 * 
 * @param props - ButtonWithIconProps including icon, iconPosition, loading, etc.
 * @param ref - Forwarded ref to the underlying button element
 * 
 * @returns A Button component with icon support
 * 
 * @example
 * // Icon on the left (default)
 * <ButtonWithIcon icon={<Download />}>Download</ButtonWithIcon>
 * 
 * @example
 * // Icon on the right
 * <ButtonWithIcon icon={<Send />} iconPosition="right">Send</ButtonWithIcon>
 * 
 * @example
 * // Icon only button
 * <ButtonWithIcon icon={<Settings />} iconPosition="only" />
 * 
 * @example
 * // Loading state
 * <ButtonWithIcon loading={true}>Processing...</ButtonWithIcon>
 */
export const ButtonWithIcon = React.forwardRef<HTMLButtonElement, ButtonWithIconProps>(
  (
    {
      icon,
      iconPosition = 'left',
      loading = false,
      iconSize = 16,
      children,
      className,
      disabled,
      size = 'md',
      ...props
    },
    ref
  ) => {
    // Determine if this should be an icon-only button
    // Either explicitly set via iconPosition='only' or implicitly when no children but icon exists
    const isIconOnly = iconPosition === 'only' || (!children && icon);
    
    // Button should be disabled if explicitly disabled or in loading state
    const isDisabled = disabled || loading;

    // ============================================================================
    // Loading State Rendering
    // ============================================================================
    // When loading is true, show a spinner instead of the icon/text
    // The spinner size is adjusted based on the button size for better visual balance
    if (loading) {
      // Calculate spinner size based on button size
      // Smaller buttons get smaller spinners, larger buttons get larger spinners
      const spinnerSize = size === 'xs' ? 12 : size === 'sm' ? 14 : size === 'lg' ? 18 : size === 'xl' ? 20 : 16;
      
      // Render icon-only loading button (just spinner, no text)
      if (isIconOnly) {
        return (
          <Button
            ref={ref}
            size={size}
            disabled={isDisabled}
            className={cn('p-0', className)}
            {...props}
          >
            <Spinner size={spinnerSize} variant="default" />
          </Button>
        );
      }

      // Render loading button with spinner and optional text
      // Text appears after the spinner with margin for spacing
      return (
        <Button
          ref={ref}
          size={size}
          disabled={isDisabled}
          className={className}
          {...props}
        >
          <Spinner size={spinnerSize} variant="default" />
          {children && <span className="ml-2">{children}</span>}
        </Button>
      );
    }

    // ============================================================================
    // Icon-Only Button Rendering
    // ============================================================================
    // Render a button that displays only an icon (no text)
    // Useful for toolbars, compact UIs, or when space is limited
    if (isIconOnly && icon) {
      // For icon-only buttons, prefer 'icon' size for better proportions
      // But allow size override if explicitly provided
      const iconButtonSize = size === 'icon' || iconPosition === 'only' ? 'icon' : size;
      
      return (
        <Button
          ref={ref}
          size={iconButtonSize}
          disabled={isDisabled}
          className={className}
          {...props}
        >
          {/* Wrap icon in a span with fixed dimensions for consistent sizing */}
          <span
            style={{
              width: iconSize,
              height: iconSize,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </span>
        </Button>
      );
    }

    // ============================================================================
    // Button with Icon and Text Rendering
    // ============================================================================
    // Render a button that displays both icon and text
    // Icon position is determined by iconPosition prop ('left' or 'right')
    
    // Create the icon element wrapper with consistent sizing
    // flex-shrink-0 prevents the icon from shrinking when text is long
    const iconElement = icon && (
      <span
        style={{
          width: iconSize,
          height: iconSize,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className="flex-shrink-0"
      >
        {icon}
      </span>
    );

    // Render button with icon positioned based on iconPosition prop
    // Icon appears before text when iconPosition='left' (default)
    // Icon appears after text when iconPosition='right'
    return (
      <Button
        ref={ref}
        size={size}
        disabled={isDisabled}
        className={className}
        {...props}
      >
        {/* Render icon before text when iconPosition is 'left' */}
        {iconPosition === 'left' && iconElement}
        
        {/* Render text content if provided */}
        {children && <span>{children}</span>}
        
        {/* Render icon after text when iconPosition is 'right' */}
        {iconPosition === 'right' && iconElement}
      </Button>
    );
  }
);

// Set display name for better debugging in React DevTools
ButtonWithIcon.displayName = 'ButtonWithIcon';

