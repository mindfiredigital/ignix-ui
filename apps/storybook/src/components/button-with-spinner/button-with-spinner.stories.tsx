/**
 * @fileoverview Storybook Stories for ButtonWithSpinner Component
 * 
 * This file contains all Storybook stories demonstrating the ButtonWithSpinner component
 * with various configurations, states, and use cases.
 * 
 * @module ButtonWithSpinner.stories
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ButtonWithSpinner } from './index';

/**
 * Storybook metadata configuration for ButtonWithSpinner component.
 * 
 * Defines the component's title, controls, and documentation settings.
 * 
 * @type {Meta<typeof ButtonWithSpinner>}
 */
const meta: Meta<typeof ButtonWithSpinner> = {
  title: 'Components/Button With Spinner',
  component: ButtonWithSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: { type: 'boolean' },
      description: 'Controls whether the button is in loading state',
    },
    loadingText: {
      control: { type: 'text' },
      description: 'Text to display when loading',
    },
    spinnerSize: {
      control: { type: 'number', min: 8, max: 40, step: 2 },
      description: 'Size of the spinner in pixels',
    },
    spinnerVariant: {
      control: { type: 'select' },
      options: ['default', 'bars', 'dots-bounce'],
      description: 'Variant of the spinner animation',
    },
    spinnerColor: {
      control: { type: 'text' },
      description: 'Color class for the spinner (e.g., "bg-white", "bg-primary", "border-white"). Auto-determined based on button variant if not provided.',
    },
    variant: {
      control: { type: 'select' },
      options: [
        'default',
        'primary',
        'secondary',
        'success',
        'warning',
        'danger',
        'outline',
        'ghost',
        'link',
        'subtle',
        'elevated',
        'glass',
        'neon',
        'pill',
        'none',
      ],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'icon', 'pill', 'compact', 'wide', 'block'],
    },
  },
};

export default meta;

/**
 * Story type for ButtonWithSpinner component stories.
 * 
 * @typedef {StoryObj<typeof ButtonWithSpinner>} Story
 */
type Story = StoryObj<typeof ButtonWithSpinner>;

/**
 * Default story - Basic button with loading state control.
 * 
 * Demonstrates the default appearance and basic loading state functionality.
 * 
 * @type {Story}
 */
export const Default: Story = {
  args: {
    children: 'Click Me',
    isLoading: false,
    loadingText: 'Loading...',
    variant: 'default',
    size: 'md',
    spinnerSize: 16,
    spinnerVariant: 'default',
  },
};

/**
 * Interactive story - Simulates loading on button click.
 * 
 * Demonstrates how the button handles loading state transitions in a real-world scenario.
 * Clicking the button triggers a 2-second loading state simulation.
 * 
 * @type {Story}
 */
export const Interactive: Story = {
  render: (args) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };

    return (
      <ButtonWithSpinner
        {...args}
        isLoading={isLoading}
        onClick={handleClick}
      />
    );
  },
  args: {
    children: 'Save Changes',
    loadingText: 'Saving...',
    variant: 'default',
    size: 'md',
    spinnerSize: 16,
    spinnerVariant: 'default',
  },
};

/**
 * Loading state story - Button permanently in loading state.
 * 
 * Shows the button with spinner and loading text. Useful for testing
 * the loading appearance without interaction.
 * 
 * @type {Story}
 */
export const Loading: Story = {
  args: {
    children: 'Submit',
    isLoading: true,
    loadingText: 'Loading...',
    variant: 'default',
    size: 'md',
    spinnerSize: 16,
    spinnerVariant: 'default',
  },
};

/**
 * Saving state story - Button with success variant in loading state.
 * 
 * Demonstrates the button with "Saving..." text and success variant styling.
 * Shows how different button variants work with the loading state.
 * 
 * @type {Story}
 */
export const Saving: Story = {
  args: {
    children: 'Save',
    isLoading: true,
    loadingText: 'Saving...',
    variant: 'success',
    size: 'md',
    spinnerSize: 16,
    spinnerVariant: 'default',
  },
};

/**
 * Spinner variants story - Demonstrates all available spinner animation types.
 * 
 * Shows the three spinner variants (default, bars, dots-bounce) side by side.
 * All spinners automatically adjust their colors for optimal visibility on dark backgrounds.
 * 
 * @type {Story}
 */
export const SpinnerVariants: Story = {
  render: () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };

    return (
      <div className="flex flex-col gap-4 items-center">
        <div className="flex gap-4 flex-wrap justify-center">
          <ButtonWithSpinner
            isLoading={isLoading}
            loadingText="Loading..."
            spinnerVariant="default"
            variant="default"
            onClick={handleClick}
          >
            Default Spinner
          </ButtonWithSpinner>
          <ButtonWithSpinner
            isLoading={isLoading}
            loadingText="Loading..."
            spinnerVariant="bars"
            variant="default"
            onClick={handleClick}
          >
            Bars Spinner
          </ButtonWithSpinner>
          <ButtonWithSpinner
            isLoading={isLoading}
            loadingText="Loading..."
            spinnerVariant="dots-bounce"
            variant="default"
            onClick={handleClick}
          >
            Dots Bounce
          </ButtonWithSpinner>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Spinner colors are automatically adjusted based on button variant for optimal visibility
        </p>
      </div>
    );
  },
};

/**
 * Button variants story - Shows loading state across different button styles.
 * 
 * Demonstrates how the ButtonWithSpinner component works with various button variants:
 * default, success, danger, and outline. Spinner colors are automatically adjusted
 * for each variant to ensure visibility.
 * 
 * @type {Story}
 */
export const ButtonVariants: Story = {
  render: () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };

    return (
      <div className="flex flex-col gap-4 items-center">
        <div className="flex gap-4 flex-wrap justify-center">
          <ButtonWithSpinner
            isLoading={isLoading}
            loadingText="Loading..."
            variant="default"
            onClick={handleClick}
          >
            Default
          </ButtonWithSpinner>
          <ButtonWithSpinner
            isLoading={isLoading}
            loadingText="Loading..."
            variant="success"
            onClick={handleClick}
          >
            Success
          </ButtonWithSpinner>
          <ButtonWithSpinner
            isLoading={isLoading}
            loadingText="Loading..."
            variant="danger"
            onClick={handleClick}
          >
            Danger
          </ButtonWithSpinner>
          <ButtonWithSpinner
            isLoading={isLoading}
            loadingText="Loading..."
            variant="outline"
            onClick={handleClick}
          >
            Outline
          </ButtonWithSpinner>
        </div>
      </div>
    );
  },
};

/**
 * Different sizes story - Demonstrates button and spinner sizing.
 * 
 * Shows the ButtonWithSpinner component in various sizes (xs, sm, md, lg, xl)
 * with appropriately sized spinners. Spinner size should be adjusted proportionally
 * to the button size for optimal appearance.
 * 
 * @type {Story}
 */
export const DifferentSizes: Story = {
  render: () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };

    return (
      <div className="flex flex-col gap-4 items-center">
        <div className="flex gap-4 items-center flex-wrap justify-center">
          <ButtonWithSpinner
            isLoading={isLoading}
            loadingText="Loading..."
            size="xs"
            spinnerSize={12}
            onClick={handleClick}
          >
            Extra Small
          </ButtonWithSpinner>
          <ButtonWithSpinner
            isLoading={isLoading}
            loadingText="Loading..."
            size="sm"
            spinnerSize={14}
            onClick={handleClick}
          >
            Small
          </ButtonWithSpinner>
          <ButtonWithSpinner
            isLoading={isLoading}
            loadingText="Loading..."
            size="md"
            spinnerSize={16}
            onClick={handleClick}
          >
            Medium
          </ButtonWithSpinner>
          <ButtonWithSpinner
            isLoading={isLoading}
            loadingText="Loading..."
            size="lg"
            spinnerSize={20}
            onClick={handleClick}
          >
            Large
          </ButtonWithSpinner>
          <ButtonWithSpinner
            isLoading={isLoading}
            loadingText="Loading..."
            size="xl"
            spinnerSize={24}
            onClick={handleClick}
          >
            Extra Large
          </ButtonWithSpinner>
        </div>
      </div>
    );
  },
};

/**
 * Custom loading text story - Examples with different loading messages.
 * 
 * Demonstrates various loading text options such as "Loading...", "Saving...",
 * "Processing...", and "Submitting...". Shows how the component can be used
 * for different action types with contextually appropriate messages.
 * 
 * @type {Story}
 */
export const CustomLoadingText: Story = {
  render: () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };

    return (
      <div className="flex flex-col gap-4 items-center">
        <div className="flex gap-4 flex-wrap justify-center">
          <ButtonWithSpinner
            isLoading={isLoading}
            loadingText="Loading..."
            onClick={handleClick}
          >
            Load Data
          </ButtonWithSpinner>
          <ButtonWithSpinner
            isLoading={isLoading}
            loadingText="Saving..."
            onClick={handleClick}
          >
            Save Changes
          </ButtonWithSpinner>
          <ButtonWithSpinner
            isLoading={isLoading}
            loadingText="Processing..."
            onClick={handleClick}
          >
            Process
          </ButtonWithSpinner>
          <ButtonWithSpinner
            isLoading={isLoading}
            loadingText="Submitting..."
            onClick={handleClick}
          >
            Submit Form
          </ButtonWithSpinner>
        </div>
      </div>
    );
  },
};

