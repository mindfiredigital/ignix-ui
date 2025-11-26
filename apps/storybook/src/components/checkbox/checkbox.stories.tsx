import { Checkbox } from '.';
import { useState } from 'react';

export default {
    title: 'Components/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['default', 'primary', 'success', 'warning', 'danger', 'outline', 'subtle', 'glass', 'neon'],
        },
        size: {
            control: { type: 'select' },
            options: ['xs', 'sm', 'md', 'lg', 'xl'],
        },
        labelPosition: {
            control: { type: 'select' },
            options: ['left', 'right'],
        },
        animationVariant: {
            control: { type: 'select' },
            options: ['bounce', 'scale', 'pulse', 'glow', 'shake', 'flip', 'nina'],
        },
    },
};

export const Default = {
    args: {
        label: 'Accept terms and conditions',
        variant: 'default',
        size: 'md',
    },
};

export const LabelPositions = () => (
    <div className="flex flex-col gap-4">
        <Checkbox
            label="Label on right (default)"
            labelPosition="right"
        />
        <Checkbox
            label="Label on left"
            labelPosition="left"
        />
    </div>
);

export const WithAnimations = () => (
    <div className="flex flex-col gap-4">
        <Checkbox label="Bounce Animation" animationVariant="bounce" />
        <Checkbox label="Scale Animation" animationVariant="scale" />
        <Checkbox label="Pulse Animation" animationVariant="pulse" />
        <Checkbox label="Glow Animation" animationVariant="glow" />
        <Checkbox label="Shake Animation" animationVariant="shake" />
        <Checkbox label="Flip Animation" animationVariant="flip" />
        <Checkbox label="Nina Animation" animationVariant="nina" />
    </div>
);

export const AnimationShowcase = () => {
    const [checkedStates, setCheckedStates] = useState({
        bounce: false,
        pulse: false,
        glow: false,
        shake: false,
        nina: false,
    });

    const handleChange = (key: string) => (checked: boolean) => {
        setCheckedStates(prev => ({ ...prev, [key]: checked }));
    };

    return (
        <div className="flex flex-col gap-4 p-6 border rounded-lg">
            <h3 className="font-bold text-lg mb-2">Animation Showcase</h3>
            <Checkbox
                label="Bounce on tap"
                animationVariant="bounce"
                checked={checkedStates.bounce}
                onChange={handleChange('bounce')}
            />
            <Checkbox
                label="Pulse on hover"
                animationVariant="pulse"
                checked={checkedStates.pulse}
                onChange={handleChange('pulse')}
            />
            <Checkbox
                label="Glow on hover"
                animationVariant="glow"
                checked={checkedStates.glow}
                onChange={handleChange('glow')}
            />
            <Checkbox
                label="Shake on hover"
                animationVariant="shake"
                checked={checkedStates.shake}
                onChange={handleChange('shake')}
            />
            <Checkbox
                label="Nina special effect"
                animationVariant="nina"
                checked={checkedStates.nina}
                onChange={handleChange('nina')}
            />
        </div>
    );
};

export const Checked = {
    args: {
        label: 'Checked by default',
        defaultChecked: true,
    },
};

export const Disabled = {
    args: {
        label: 'Disabled checkbox',
        disabled: true,
    },
};

export const WithError = {
    args: {
        label: 'Invalid selection',
        error: 'This field is required',
    },
};

export const DifferentSizes = () => (
    <div className="flex flex-col gap-4">
        <Checkbox label="Extra Small" size="xs" />
        <Checkbox label="Small" size="sm" />
        <Checkbox label="Medium" size="md" />
        <Checkbox label="Large" size="lg" />
        <Checkbox label="Extra Large" size="xl" />
    </div>
);

export const DifferentVariants = () => (
    <div className="flex flex-col gap-4">
        <Checkbox label="Default" variant="default" />
        <Checkbox label="Primary" variant="primary" />
        <Checkbox label="Success" variant="success" />
        <Checkbox label="Warning" variant="warning" />
        <Checkbox label="Danger" variant="danger" />
        <Checkbox label="Outline" variant="outline" />
        <Checkbox label="Glass" variant="glass" />
        <Checkbox label="Neon" variant="neon" />
    </div>
);

export const ControlledExample = () => {
    const [checked, setChecked] = useState(false);

    return (
        <div className="flex flex-col gap-2">
            <Checkbox
                label={checked ? 'Checked!' : 'Unchecked'}
                checked={checked}
                onChange={setChecked}
            />
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setChecked(!checked)}
            >
                Toggle Checkbox
            </button>
        </div>
    );
};

export const FormIntegration = () => {
    const [formData, setFormData] = useState({
        newsletter: false,
        terms: false,
        notifications: true,
    });

    const handleChange = (field: string) => (checked: boolean) => {
        setFormData(prev => ({ ...prev, [field]: checked }));
    };

    return (
        <div className="flex flex-col gap-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Preferences</h3>
            <Checkbox
                label="Subscribe to newsletter"
                checked={formData.newsletter}
                onChange={handleChange('newsletter')}
            />
            <Checkbox
                label="Accept terms and conditions"
                checked={formData.terms}
                onChange={handleChange('terms')}
            />
            <Checkbox
                label="Enable notifications"
                checked={formData.notifications}
                onChange={handleChange('notifications')}
            />
            <div className="mt-4 p-2 bg-gray-100 rounded">
                <pre>{JSON.stringify(formData, null, 2)}</pre>
            </div>
        </div>
    );
};