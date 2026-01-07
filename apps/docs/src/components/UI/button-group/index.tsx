/**
 * ButtonGroup Component
 * 
 * A component that groups multiple buttons together with consistent spacing,
 * active state highlighting, and responsive wrapping capabilities.
 * 
 * @file button-group/index.tsx
 * @component ButtonGroup
 */

'use client';

import * as React from 'react';
import { Button, type ButtonProps } from '../button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

/**
 * CVA variants for the ButtonGroup container.
 * Defines layout and spacing options.
 */
const buttonGroupVariants = cva(
  'inline-flex items-center',
  {
    variants: {
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
      },
      wrap: {
        true: 'flex-wrap',
        false: 'flex-nowrap',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      wrap: true,
    },
  }
);

/**
 * Props for individual button items in the ButtonGroup.
 * Extends ButtonProps with an optional value identifier.
 */
export interface ButtonGroupItem extends Omit<ButtonProps, 'onClick'> {
  /**
   * Unique identifier for the button.
   * Used to track which button is active.
   */
  value: string;
  
  /**
   * Click handler for the button.
   * Receives the button's value as the first argument.
   */
  onClick?: (value: string, event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Props for the ButtonGroup component.
 */
export interface ButtonGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof buttonGroupVariants> {
  /**
   * Array of button items to display in the group.
   * Each item must have a unique value.
   */
  items: ButtonGroupItem[];
  
  /**
   * Currently active button value.
   * When provided, the button with matching value will be highlighted.
   */
  activeValue?: string;
  
  /**
   * Default active button value (uncontrolled mode).
   */
  defaultValue?: string;
  
  /**
   * Callback fired when a button is clicked.
   * Receives the clicked button's value.
   */
  onChange?: (value: string) => void;
  
  /**
   * Spacing between buttons in pixels or Tailwind spacing unit.
   * 
   * @default 'gap-2'
   */
  spacing?: string;
  
  /**
   * Variant to apply to active buttons.
   * If not specified, uses the button's own variant.
   */
  activeVariant?: ButtonProps['variant'];
  
  /**
   * Whether to allow multiple buttons to be active simultaneously.
   * 
   * @default false
   */
  multiple?: boolean;
  
  /**
   * Array of active values when multiple selection is enabled.
   */
  activeValues?: string[];
}

/**
 * ButtonGroup Component
 * 
 * Groups multiple buttons together with consistent spacing and active state management.
 * Supports both controlled and uncontrolled modes, single and multiple selection.
 */
export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      items,
      activeValue: controlledActiveValue,
      defaultValue,
      onChange,
      wrap = true,
      spacing = 'gap-2',
      activeVariant,
      multiple = false,
      activeValues: controlledActiveValues,
      orientation = 'horizontal',
      className,
      ...props
    },
    ref
  ) => {
    // Internal state for uncontrolled mode
    const [internalActiveValue, setInternalActiveValue] = React.useState<string | undefined>(
      defaultValue
    );
    const [internalActiveValues, setInternalActiveValues] = React.useState<string[]>(
      controlledActiveValues || (defaultValue ? [defaultValue] : [])
    );

    // Determine if we're in controlled mode
    const isControlled = controlledActiveValue !== undefined || controlledActiveValues !== undefined;
    
    // Get current active state
    const activeValue = isControlled && !multiple ? controlledActiveValue : internalActiveValue;
    const activeValues = isControlled && multiple 
      ? controlledActiveValues || [] 
      : internalActiveValues;

    /**
     * Handles button click events.
     * Updates active state and calls onChange callback.
     */
    const handleButtonClick = (
      itemValue: string,
      itemOnClick?: (value: string, event: React.MouseEvent<HTMLButtonElement>) => void
    ) => {
      return (event: React.MouseEvent<HTMLButtonElement>) => {
        // Call item-specific onClick if provided
        itemOnClick?.(itemValue, event);

        if (multiple) {
          // Multiple selection mode
          const newActiveValues = activeValues.includes(itemValue)
            ? activeValues.filter(v => v !== itemValue)
            : [...activeValues, itemValue];
          
          if (!isControlled) {
            setInternalActiveValues(newActiveValues);
          }
          
          onChange?.(itemValue);
        } else {
          // Single selection mode
          if (!isControlled) {
            setInternalActiveValue(itemValue);
          }
          
          onChange?.(itemValue);
        }
      };
    };

    /**
     * Determines if a button should be highlighted as active.
     */
    const isButtonActive = (itemValue: string): boolean => {
      if (multiple) {
        return activeValues.includes(itemValue);
      }
      return activeValue === itemValue;
    };

    return (
      <div
        ref={ref}
        className={cn(
          buttonGroupVariants({ orientation, wrap }),
          spacing,
          className
        )}
        role="group"
        aria-label="Button group"
        {...props}
      >
        {items.map((item) => {
          const { value, onClick: itemOnClick, variant, className: itemClassName, ...itemProps } = item;
          const isActive = isButtonActive(value);
          
          // Determine which variant to use
          const buttonVariant = isActive && activeVariant 
            ? activeVariant 
            : variant || 'default';

          return (
            <Button
              key={value}
              variant={buttonVariant}
              className={cn(
                // Active state styling
                isActive && !activeVariant && 'ring-2 ring-offset-2 ring-primary',
                itemClassName
              )}
              onClick={handleButtonClick(value, itemOnClick)}
              aria-pressed={isActive}
              {...itemProps}
            >
              {item.children}
            </Button>
          );
        })}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

