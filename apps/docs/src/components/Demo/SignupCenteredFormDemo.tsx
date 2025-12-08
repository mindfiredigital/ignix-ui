import React, { useState } from 'react';
import { CenteredSignupForm } from '@site/src/components/UI/signup-centered';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

// Variant Selector Component
interface VariantSelectorProps {
    variants: string[];
    selectedVariant: string;
    onSelectVariant: (variant: string) => void;
    type: string;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
    variants,
    selectedVariant,
    onSelectVariant,
    type
}) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
                {type}
            </label>
            <select
                value={selectedVariant}
                onChange={(e) => onSelectVariant(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
                {variants.map((variant) => (
                    <option key={variant} value={variant}>
                        {variant.charAt(0).toUpperCase() + variant.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
};

// Main Demo Component
const formVariants = ['default', 'modern', 'glass', 'dark'];
<<<<<<< HEAD
const formStates = ['default', 'loading', 'success', 'with-errors'];

const CenteredSignupFormDemo = () => {
    const [variant, setVariant] = useState('default');
    const [formState, setFormState] = useState('default');
=======

const CenteredSignupFormDemo = () => {
    const [variant, setVariant] = useState('default');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [formState, setFormState] = useState('default');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
>>>>>>> df41387 (feat(docs): complete sign-in implementation across storybook, docs, registry and UI components)
    const [showThemeToggle, setShowThemeToggle] = useState(false);

    // Mock form submission handler
    const handleFormSubmit = async (data: any) => {
        console.log("Form submitted:", data);
        return new Promise((resolve) => setTimeout(resolve, 2000));
    };

    const getFormProps = () => {
        const baseProps = {
            variant: variant as any,
            showThemeToggle,
            onSubmit: handleFormSubmit,
        };

        switch (formState) {
            case 'loading':
                return { ...baseProps, loading: true };
            case 'success':
                return { ...baseProps, success: true };
            case 'with-errors':
                return { ...baseProps };
            default:
                return baseProps;
        }
    };

    const codeString = `
import { CenteredSignupForm } from "./index";

function App() {
    const handleSubmit = async (formData) => {
        console.log("Form data:", formData);
        // Handle form submission
    };

    return (
        <CenteredSignupForm
            variant="${variant}"
            ${showThemeToggle ? 'showThemeToggle={true}' : ''}
            ${formState === 'loading' ? 'loading={true}' : ''}
            ${formState === 'success' ? 'success={true}' : ''}
            onSubmit={handleSubmit}
            ${formState === 'success' ? `successMessage="Account created successfully! Please check your email."` : ''}
        />
    );
}

export default App;
`.trim();

    return (
        <div className="space-y-6 mb-8">
            {/* Controls */}
            <div className="flex flex-wrap gap-4 justify-start sm:justify-end items-center">
                <VariantSelector
                    variants={formVariants}
                    selectedVariant={variant}
                    onSelectVariant={setVariant}
                    type="Variant"
                />
            </div>

            <Tabs>
                <TabItem value="preview" label="Preview" default>
                    <div className="border rounded-lg overflow-hidden bg-background">
                        <div className="p-1 bg-muted/20">
                            <div className="text-xs text-muted-foreground px-2 py-1">
                                Preview - {variant} variant • {formState} state
                            </div>
                        </div>
                        <CenteredSignupForm {...getFormProps()} />
                    </div>
                </TabItem>

                <TabItem value="code" label="Code">
                    <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-auto text-black">
                        {codeString}
                    </CodeBlock>
                </TabItem>
            </Tabs>
        </div>
    );
};

export default CenteredSignupFormDemo;