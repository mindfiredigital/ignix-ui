/**
 * @fileoverview ButtonWithSpinner Demo Component
 * 
 * Interactive demo component for ButtonWithSpinner showcasing various configurations,
 * variants, and use cases.
 * 
 * @module ButtonWithSpinnerDemo
 */

import React, { useState } from 'react';
import { ButtonWithSpinner } from '@site/src/components/UI/button-with-spinner';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const buttonVariants = [
  { value: 'default', label: 'Default' },
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'danger', label: 'Danger' },
  { value: 'outline', label: 'Outline' },
  { value: 'ghost', label: 'Ghost' },
  { value: 'subtle', label: 'Subtle' },
  { value: 'elevated', label: 'Elevated' },
  { value: 'glass', label: 'Glass' },
  { value: 'neon', label: 'Neon' },
  { value: 'pill', label: 'Pill' },
];

const buttonSizes = [
  { value: 'xs', label: 'Extra Small (xs)' },
  { value: 'sm', label: 'Small (sm)' },
  { value: 'md', label: 'Medium (md)' },
  { value: 'lg', label: 'Large (lg)' },
  { value: 'xl', label: 'Extra Large (xl)' },
];

const spinnerVariants = [
  { value: 'default', label: 'Default' },
  { value: 'bars', label: 'Bars' },
  { value: 'dots-bounce', label: 'Dots Bounce' },
];

const loadingTexts = [
  { value: 'Loading...', label: 'Loading...' },
  { value: 'Saving...', label: 'Saving...' },
  { value: 'Processing...', label: 'Processing...' },
  { value: 'Submitting...', label: 'Submitting...' },
];

/**
 * Main ButtonWithSpinner Demo Component
 * 
 * Provides interactive controls to customize the ButtonWithSpinner component
 * and see live preview with code examples.
 * 
 * @component
 * @returns {JSX.Element} Interactive demo with controls and preview
 */
const ButtonWithSpinnerDemo = () => {
  const [variant, setVariant] = useState('default');
  const [size, setSize] = useState('md');
  const [spinnerVariant, setSpinnerVariant] = useState('default');
  const [loadingText, setLoadingText] = useState('Loading...');
  const [isLoading, setIsLoading] = useState(false);

  // Automatically calculate spinner size based on button size
  const sizeToSpinnerSize: Record<string, number> = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  };
  const spinnerSize = sizeToSpinnerSize[size] || 16;

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const codeString = `
<ButtonWithSpinner
  isLoading={${isLoading}}
  loadingText="${loadingText}"
  spinnerVariant="${spinnerVariant}"
  spinnerSize={${spinnerSize}}
  variant="${variant}"
  size="${size}"
  onClick={handleClick}
>
  Click Me
</ButtonWithSpinner>
`;

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div className="space-y-2">
          <VariantSelector
            variants={buttonVariants.map(v => v.value)}
            selectedVariant={variant}
            onSelectVariant={setVariant}
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={buttonSizes.map(s => s.value)}
            selectedVariant={size}
            onSelectVariant={setSize}
            type="Size"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={spinnerVariants.map(s => s.value)}
            selectedVariant={spinnerVariant}
            onSelectVariant={setSpinnerVariant}
            type="Spinner Variant"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={loadingTexts.map(t => t.value)}
            selectedVariant={loadingText}
            onSelectVariant={setLoadingText}
            type="Loading Text"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={isLoading}
              onChange={(e) => setIsLoading(e.target.checked)}
            />
            Loading State
          </label>
        </div>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-6 border rounded-lg mt-4">
            <div className="flex flex-wrap gap-4 items-center justify-center p-4">
              <ButtonWithSpinner
                isLoading={isLoading}
                loadingText={loadingText}
                spinnerVariant={spinnerVariant as any}
                spinnerSize={spinnerSize}
                variant={variant as any}
                size={size as any}
                onClick={handleClick}
              >
                Click Me
              </ButtonWithSpinner>
            </div>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <div className="mt-4">
            <CodeBlock language="tsx" className="text-sm">
              {codeString}
            </CodeBlock>
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
};

/**
 * ButtonWithSpinner Variants Demo
 * 
 * Shows ButtonWithSpinner with different button variants in loading state.
 * 
 * @component
 * @returns {JSX.Element} Grid of buttons showing different variants
 */
export const ButtonWithSpinnerVariantsDemo = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">Button Variants</h3>
      <p className="text-lg font-semibold">
        Use the <span className="text-red-500">variant</span> prop to control the button style.
        Spinner colors are automatically adjusted for optimal visibility.
      </p>
      <div className="p-6 border rounded-lg">
        <div className="flex flex-wrap gap-4 justify-center">
          {buttonVariants.slice(0, 8).map((variant) => (
            <ButtonWithSpinner
              key={variant.value}
              isLoading={isLoading}
              loadingText="Loading..."
              variant={variant.value as any}
              onClick={handleClick}
            >
              {variant.label}
            </ButtonWithSpinner>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * ButtonWithSpinner Spinner Variants Demo
 * 
 * Shows ButtonWithSpinner with different spinner animation types.
 * 
 * @component
 * @returns {JSX.Element} Grid of buttons showing different spinner variants
 */
export const ButtonWithSpinnerSpinnerVariantsDemo = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">Spinner Variants</h3>
      <p className="text-lg font-semibold">
        Use the <span className="text-red-500">spinnerVariant</span> prop to control the spinner animation type.
      </p>
      <div className="p-6 border rounded-lg">
        <div className="flex flex-wrap gap-4 justify-center">
          {spinnerVariants.map((variant) => (
            <ButtonWithSpinner
              key={variant.value}
              isLoading={isLoading}
              loadingText="Loading..."
              spinnerVariant={variant.value as any}
              variant="default"
              onClick={handleClick}
            >
              {variant.label} Spinner
            </ButtonWithSpinner>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * ButtonWithSpinner Sizes Demo
 * 
 * Shows ButtonWithSpinner in different sizes with appropriately sized spinners.
 * 
 * @component
 * @returns {JSX.Element} Grid of buttons showing different sizes
 */
export const ButtonWithSpinnerSizesDemo = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const sizeToSpinnerSize: Record<string, number> = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">Sizes</h3>
      <p className="text-lg font-semibold">
        Use the <span className="text-red-500">size</span> prop to control the button size.
        Spinner size is automatically adjusted proportionally.
      </p>
      <div className="p-6 border rounded-lg">
        <div className="flex flex-wrap gap-4 items-center justify-center">
          {buttonSizes.map((size) => (
            <ButtonWithSpinner
              key={size.value}
              isLoading={isLoading}
              loadingText="Loading..."
              size={size.value as any}
              spinnerSize={sizeToSpinnerSize[size.value]}
              onClick={handleClick}
            >
              {size.label}
            </ButtonWithSpinner>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * ButtonWithSpinner Loading Text Demo
 * 
 * Shows ButtonWithSpinner with different loading text messages.
 * 
 * @component
 * @returns {JSX.Element} Grid of buttons showing different loading texts
 */
export const ButtonWithSpinnerLoadingTextDemo = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">Loading Text</h3>
      <p className="text-lg font-semibold">
        Use the <span className="text-red-500">loadingText</span> prop to customize the message
        displayed during loading state.
      </p>
      <div className="p-6 border rounded-lg">
        <div className="flex flex-wrap gap-4 justify-center">
          {loadingTexts.map((text) => (
            <ButtonWithSpinner
              key={text.value}
              isLoading={isLoading}
              loadingText={text.value}
              onClick={handleClick}
            >
              {text.label.replace('...', '')}
            </ButtonWithSpinner>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ButtonWithSpinnerDemo;


