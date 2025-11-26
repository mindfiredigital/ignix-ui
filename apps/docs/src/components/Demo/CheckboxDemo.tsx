// CheckboxDemo.tsx
import React, { useState } from 'react';
import { Checkbox } from '@site/src/components/UI/checkbox';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const checkboxVariants = [
    { value: 'default', label: 'Default' },
    { value: 'primary', label: 'Primary' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'danger', label: 'Danger' },
    { value: 'outline', label: 'Outline' },
    { value: 'subtle', label: 'Subtle' },
    { value: 'glass', label: 'Glass' },
    { value: 'neon', label: 'Neon' },
];

const checkboxSizes = [
    { value: 'xs', label: 'Extra Small' },
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra Large' },
];

const checkboxAnimations = [
    { value: 'none', label: 'None' },
    { value: 'bounce', label: 'Bounce' },
    { value: 'scale', label: 'Scale' },
    { value: 'pulse', label: 'Pulse' },
    { value: 'glow', label: 'Glow' },
    { value: 'shake', label: 'Shake' },
    { value: 'flip', label: 'Flip' },
    { value: 'nina', label: 'Nina' },
];

const CheckboxDemo = () => {
    const [variant, setVariant] = useState('default');
    const [size, setSize] = useState('md');
    const [animation, setAnimation] = useState('none');
    const [labelPosition, setLabelPosition] = useState<'left' | 'right'>('right');
    const [showError, setShowError] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const [checkedState, setCheckedState] = useState({
        basic: false,
        withLabel: true,
        error: false,
        disabled: false,
    });

    const handleCheckboxChange = (key: string) => (checked: boolean) => {
        setCheckedState(prev => ({ ...prev, [key]: checked }));
    };

    const codeString = `
<Checkbox 
  variant="${variant}" 
  size="${size}" 
  animationVariant="${animation}"
  label="${checkedState.withLabel ? 'Checkbox Label' : ''}"
  labelPosition="${labelPosition}"
  ${showError ? 'error="This field is required"' : ''}
  ${isDisabled ? 'disabled' : ''}
  onChange={(checked) => console.log(checked)}
/>
`;

    return (
        <div className="space-y-8 mb-8">
            {/* Controls */}
            <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
                <div className="space-y-2">
                    <VariantSelector
                        variants={checkboxVariants.map((v) => v.value)}
                        selectedVariant={variant}
                        onSelectVariant={setVariant}
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={checkboxSizes.map((s) => s.value)}
                        selectedVariant={size}
                        onSelectVariant={setSize}
                        type="Size"
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={checkboxAnimations.map((a) => a.value)}
                        selectedVariant={animation}
                        onSelectVariant={setAnimation}
                        type="Animation"
                    />
                </div>
            </div>

            {/* Additional Controls */}
            <div className="flex flex-wrap gap-6 items-center">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={labelPosition === 'left'}
                        onChange={(e) => setLabelPosition(e.target.checked ? 'left' : 'right')}
                    />
                    Label on Left
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showError}
                        onChange={(e) => setShowError(e.target.checked)}
                    />
                    Show Error
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isDisabled}
                        onChange={(e) => setIsDisabled(e.target.checked)}
                    />
                    Disabled
                </label>
            </div>

            {/* Demo */}
            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="p-6 border rounded-lg mt-4">
                        <div className="flex flex-col gap-6 items-start">
                            {/* Basic Checkbox */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-muted-foreground">Basic Checkbox</h4>
                                <Checkbox
                                    variant={variant as any}
                                    size={size as any}
                                    animationVariant={animation}
                                    checked={checkedState.basic}
                                    onChange={handleCheckboxChange('basic')}
                                    disabled={isDisabled}
                                />
                            </div>

                            {/* Checkbox with Label */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-muted-foreground">With Label</h4>
                                <Checkbox
                                    variant={variant as any}
                                    size={size as any}
                                    animationVariant={animation}
                                    label="Checkbox Label"
                                    labelPosition={labelPosition}
                                    checked={checkedState.withLabel}
                                    onChange={handleCheckboxChange('withLabel')}
                                    disabled={isDisabled}
                                />
                            </div>

                            {/* Checkbox with Error */}
                            {showError && (
                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium text-muted-foreground">With Error State</h4>
                                    <Checkbox
                                        variant={variant as any}
                                        size={size as any}
                                        animationVariant={animation}
                                        label="Invalid Option"
                                        error="This field is required"
                                        checked={checkedState.error}
                                        onChange={handleCheckboxChange('error')}
                                        disabled={isDisabled}
                                    />
                                </div>
                            )}

                            {/* All Variants Showcase */}
                            <div className="space-y-4 w-full">
                                <h4 className="text-sm font-medium text-muted-foreground">All Variants</h4>
                                <div className="flex flex-wrap gap-4">
                                    {checkboxVariants.map((v) => (
                                        <div key={v.value} className="flex flex-col items-center gap-2">
                                            <Checkbox
                                                variant={v.value as any}
                                                size="md"
                                                label={v.label}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* All Sizes Showcase */}
                            <div className="space-y-4 w-full">
                                <h4 className="text-sm font-medium text-muted-foreground">All Sizes</h4>
                                <div className="flex flex-wrap gap-6 items-center">
                                    {checkboxSizes.map((s) => (
                                        <div key={s.value} className="flex flex-col items-center gap-2">
                                            <Checkbox
                                                variant="default"
                                                size={s.value as any}
                                                label={s.label}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
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

// Group Checkbox Demo
const CheckboxGroupDemo = () => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>(['option1']);

    const handleOptionChange = (option: string) => (checked: boolean) => {
        setSelectedOptions(prev =>
            checked
                ? [...prev, option]
                : prev.filter(item => item !== option)
        );
    };

    const codeString = `
// Checkbox Group Example
const [selectedOptions, setSelectedOptions] = useState(['option1']);

const handleChange = (option: string) => (checked: boolean) => {
  setSelectedOptions(prev =>
    checked
      ? [...prev, option]
      : prev.filter(item => item !== option)
  );
};

<div className="space-y-3">
  <Checkbox
    label="Option 1"
    checked={selectedOptions.includes('option1')}
    onChange={handleChange('option1')}
  />
  <br />
  <Checkbox
  label="Option 2" 
  checked={selectedOptions.includes('option2')}
  onChange={handleChange('option2')}
  />
  <br />
  <Checkbox
    label="Option 3"
    checked={selectedOptions.includes('option3')}
    onChange={handleChange('option3')}
  />
</div>
`;

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Checkbox Group</h3>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="p-6 border rounded-lg">
                        <div className="space-y-3">
                            <Checkbox
                                label="Option 1"
                                checked={selectedOptions.includes('option1')}
                                onChange={handleOptionChange('option1')}
                            />
                            <br />
                            <Checkbox
                                label="Option 2"
                                checked={selectedOptions.includes('option2')}
                                onChange={handleOptionChange('option2')}
                            />
                            <br />
                            <Checkbox
                                label="Option 3"
                                checked={selectedOptions.includes('option3')}
                                onChange={handleOptionChange('option3')}
                            />
                        </div>
                        <div className="mt-4 text-md text-muted-foreground">
                            Selected: {selectedOptions.join(', ') || 'None'}
                        </div>
                    </div>
                </TabItem>

                <TabItem value="code" label="Code">
                    <CodeBlock language="tsx" className="text-sm">
                        {codeString}
                    </CodeBlock>
                </TabItem>
            </Tabs>
        </div>
    );
};

// Advanced Animation Demo
const CheckboxAnimationDemo = () => {
    const [checkedStates, setCheckedStates] = useState<Record<string, boolean>>({});

    const handleAnimationChange = (animation: string) => (checked: boolean) => {
        setCheckedStates(prev => ({ ...prev, [animation]: checked }));
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Animation Variants</h3>

            <div className="p-6 border rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {checkboxAnimations.map((animation) => (
                        <div key={animation.value} className="flex flex-col items-center gap-3">
                            <Checkbox
                                variant="default"
                                size="lg"
                                animationVariant={animation.value}
                                label={animation.label}
                                checked={checkedStates[animation.value] || false}
                                onChange={handleAnimationChange(animation.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export { CheckboxDemo, CheckboxGroupDemo, CheckboxAnimationDemo };