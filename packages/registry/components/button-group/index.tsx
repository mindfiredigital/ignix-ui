/**
 * ButtonGroup Component
 *
 * A component that groups multiple buttons together with consistent spacing,
 * active state highlighting, and responsive wrapping capabilities.
 *
 * @file components/button-group/index.tsx
 * @component ButtonGroup
 */

'use client';

import * as React from 'react';
import { Button, type ButtonProps } from '../button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

/**
 * CVA variants for the ButtonGroup container.
 * Defines layout and spacing options like orientation and wrapping behavior.
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
 * Extends ButtonProps with a required value identifier and a typed onClick handler.
 */
export interface ButtonGroupItem extends Omit<ButtonProps, 'onClick'> {
  /**
   * Unique identifier for the button.
   * Used to track which button is active.
   *
   * @example
   * { value: 'save', children: 'Save' }
   */
  value: string;

  /**
   * Click handler for the button.
   * Receives the button's value as the first argument and the click event as the second.
   *
   * @param value - The value of the clicked button
   * @param event - The click event
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
   *
   * @example
   * [
   *   { value: 'save', children: 'Save', variant: 'default' },
   *   { value: 'cancel', children: 'Cancel', variant: 'outline' }
   * ]
   */
  items: ButtonGroupItem[];

  /**
   * Currently active button value (controlled mode, single selection).
   * When provided, the button with the matching value will be highlighted.
   */
  activeValue?: string;

  /**
   * Default active button value (uncontrolled mode, single selection).
   */
  defaultValue?: string;

  /**
   * Callback fired when a button is clicked.
   * Receives the clicked button's value.
   *
   * @param value - The value of the clicked button
   */
  onChange?: (value: string) => void;

  /**
   * Spacing between buttons in Tailwind spacing class format.
   *
   * @default 'gap-2'
   *
   * @example
   * spacing="gap-4"
   */
  spacing?: string;

  /**
   * Variant to apply to active buttons.
   * If not specified, uses the button's own variant.
   *
   * @example
   * activeVariant="primary"
   */
  activeVariant?: ButtonProps['variant'];

  /**
   * Whether to allow multiple buttons to be active simultaneously.
   *
   * @default false
   */
  multiple?: boolean;

  /**
   * Array of active values when multiple selection is enabled (controlled mode).
   *
   * @example
   * activeValues={['bold', 'italic']}
   */
  activeValues?: string[];
}

/**
 * ButtonGroup Component
 *
 * Groups multiple buttons together with consistent spacing and active state management.
 * Supports both controlled and uncontrolled modes, single and multiple selection.
 *
 * @param props - ButtonGroupProps including items, activeValue/activeValues, onChange, etc.
 * @param ref - Forwarded ref to the container div element.
 *
 * @returns A div containing grouped buttons with proper spacing and active states.
 *
 * @example
 * // Basic usage (controlled, single selection)
 * <ButtonGroup
 *   items={[
 *     { value: 'save', children: 'Save' },
 *     { value: 'cancel', children: 'Cancel' }
 *   ]}
 *   activeValue="save"
 *   onChange={(value) => console.log(value)}
 * />
 *
 * @example
 * // Uncontrolled mode with default value
 * <ButtonGroup
 *   items={[
 *     { value: 'option1', children: 'Option 1' },
 *     { value: 'option2', children: 'Option 2' }
 *   ]}
 *   defaultValue="option1"
 * />
 *
 * @example
 * // Multiple selection
 * <ButtonGroup
 *   items={[
 *     { value: 'bold', children: 'Bold' },
 *     { value: 'italic', children: 'Italic' },
 *     { value: 'underline', children: 'Underline' }
 *   ]}
 *   multiple
 *   activeValues={['bold']}
 *   onChange={(value) => console.log(value)}
 * />
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
    // Internal state for uncontrolled single-selection mode
    const [internalActiveValue, setInternalActiveValue] = React.useState<string | undefined>(
      defaultValue
    );

    // Internal state for uncontrolled multiple-selection mode
    const [internalActiveValues, setInternalActiveValues] = React.useState<string[]>(
      controlledActiveValues || (defaultValue ? [defaultValue] : [])
    );

    // Determine if the component is in controlled mode
    const isControlled =
      controlledActiveValue !== undefined || controlledActiveValues !== undefined;

    // Resolve current active value(s) based on mode
    const activeValue = isControlled && !multiple ? controlledActiveValue : internalActiveValue;
    const activeValues = isControlled && multiple
      ? controlledActiveValues || []
      : internalActiveValues;

    /**
     * Handles button click events.
     * Updates active state (if uncontrolled) and calls the onChange callback.
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
            ? activeValues.filter((v) => v !== itemValue)
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
     *
     * @param itemValue - The value of the button item
     * @returns True if the button is active, false otherwise
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
          const {
            value,
            onClick: itemOnClick,
            variant,
            className: itemClassName,
            ...itemProps
          } = item;

          const isActive = isButtonActive(value);

          // Determine which variant to use for this button
          const buttonVariant: ButtonProps['variant'] =
            isActive && activeVariant
              ? activeVariant
              : variant ?? 'default';

          return (
            <Button
              key={value}
              variant={buttonVariant}
              className={cn(
                // Active state styling when no explicit activeVariant is provided
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


