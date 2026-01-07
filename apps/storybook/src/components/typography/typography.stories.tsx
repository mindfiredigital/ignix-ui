import { Typography } from '.';

export default {
    title: 'Components/Typography',
    component: Typography,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: [
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'body-large', 'body', 'body-small',
                'lead', 'large', 'small',
                'label', 'caption', 'muted',
                'link', 'code', 'blockquote', 'list'
            ],
        },
        align: {
            control: { type: 'select' },
            options: ['left', 'center', 'right', 'justify'],
        },
        color: {
            control: { type: 'select' },
            options: ['default', 'primary', 'secondary', 'muted', 'error', 'success', 'warning', 'inherit'],
        },
        weight: {
            control: { type: 'select' },
            options: ['light', 'normal', 'medium', 'semibold', 'bold'],
        },
        decoration: {
            control: { type: 'select' },
            options: ['none', 'underline', 'line-through', 'overline'],
        },
        transform: {
            control: { type: 'select' },
            options: ['normal', 'uppercase', 'lowercase', 'capitalize'],
        },
        hover: {
            control: { type: 'select' },
            options: ['none', 'underline', 'color', 'scale'],
        },
    },
};

export const Default = {
    args: {
        children: 'The quick brown fox jumps over the lazy dog',
        variant: 'body',
    },
};

export const Headings = () => (
    <div className="space-y-4">
        <Typography variant="h1">Heading 1 - The quick brown fox</Typography>
        <Typography variant="h2">Heading 2 - The quick brown fox</Typography>
        <Typography variant="h3">Heading 3 - The quick brown fox</Typography>
        <Typography variant="h4">Heading 4 - The quick brown fox</Typography>
        <Typography variant="h5">Heading 5 - The quick brown fox</Typography>
        <Typography variant="h6">Heading 6 - The quick brown fox</Typography>
    </div>
);

export const BodyText = () => (
    <div className="space-y-4">
        <Typography variant="body-large">
            Body Large - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
        </Typography>
        <Typography variant="body">
            Body - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
        </Typography>
        <Typography variant="body-small">
            Body Small - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
        </Typography>
    </div>
);

export const LabelsAndCaptions = () => (
    <div className="space-y-4">
        <Typography variant="label">This is a label</Typography>
        <Typography variant="caption">This is a caption text</Typography>
        <Typography variant="muted">This is muted text</Typography>
    </div>
);

export const TextColors = () => (
    <div className="space-y-2">
        <Typography color="default">Default text color</Typography>
        <Typography color="primary">Primary text color</Typography>
        <Typography color="secondary">Secondary text color</Typography>
        <Typography color="muted">Muted text color</Typography>
        <Typography color="error">Error text color</Typography>
        <Typography color="success">Success text color</Typography>
        <Typography color="warning">Warning text color</Typography>
        <Typography color="inherit" className="text-blue-500">Inherit color (blue)</Typography>
    </div>
);

export const FontWeights = () => (
    <div className="space-y-2">
        <Typography weight="light">Light weight text</Typography>
        <Typography weight="normal">Normal weight text</Typography>
        <Typography weight="medium">Medium weight text</Typography>
        <Typography weight="semibold">Semibold weight text</Typography>
        <Typography weight="bold">Bold weight text</Typography>
    </div>
);

export const TextAlignment = () => (
    <div className="space-y-4 border p-4">
        <Typography align="left">Left aligned text</Typography>
        <Typography align="center">Center aligned text</Typography>
        <Typography align="right">Right aligned text</Typography>
        <Typography align="justify">
            Justified text - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
        </Typography>
    </div>
);

export const TextTransforms = () => (
    <div className="space-y-2 border p-4">
        <Typography transform="normal">Normal case text transformation (The Quick Brown Fox)</Typography>
        <Typography transform="uppercase">Uppercase text transformation (The Quick Brown Fox)</Typography>
        <Typography transform="lowercase">Lowercase Text Transformation (The Quick Brown Fox)</Typography>
        <Typography transform="capitalize">capitalized text example for demonstration</Typography>
    </div>
);

export const TextDecorations = () => (
    <div className="space-y-2">
        <Typography decoration="none">No decoration text</Typography>
        <Typography decoration="underline">Underlined text decoration</Typography>
        <Typography decoration="line-through">Line through text decoration</Typography>
        <Typography decoration="overline">Overline text decoration</Typography>
    </div>
);

export const HoverEffects = () => (
    <div className="space-y-4 p-4 border rounded-lg">
        <Typography hover="underline" className="block p-2 border rounded">Hover to underline</Typography>
        <Typography hover="color" className="block p-2 border rounded">Hover to change color</Typography>
        <Typography hover="scale" className="block p-2 border rounded">Hover to scale</Typography>
    </div>
);

export const SpecialText = () => (
    <div className="space-y-4">
        <Typography variant="link">This looks like a link</Typography>
        <Typography variant="code">console.log('Hello, world!');</Typography>
        <Typography variant="blockquote">
            "The only way to do great work is to love what you do."
        </Typography>
        <Typography mark>This text is highlighted with mark</Typography>
    </div>
);

export const TruncateExample = {
    args: {
        truncate: true,
        children: 'This is a very long text that will be truncated with an ellipsis when it exceeds the container width',
        className: 'max-w-xs',
    },
};

export const CustomElement = () => (
    <div className="space-y-2">
        <Typography as="span" variant="h3">
            This is an H3 variant rendered as a span element
        </Typography>
        <Typography as="div" variant="label">
            This is a label variant rendered as a div
        </Typography>
    </div>
);

export const ResponsiveExample = () => (
    <div className="space-y-4">
        <Typography variant="h3" className="text-lg md:text-2xl lg:text-3xl">
            This heading scales across breakpoints
        </Typography>
        <Typography variant="body" className="text-sm md:text-base lg:text-lg">
            This body text also responds to different screen sizes for optimal readability.
        </Typography>
    </div>
);

export const RealWorldExample = () => (
    <div className="max-w-2xl space-y-6">
        <header className="space-y-2">
            <Typography variant="h1">Building a Design System</Typography>
            <Typography variant="lead">
                Learn how to create scalable and maintainable typography systems for modern web applications.
            </Typography>
            <div className="flex gap-2">
                <Typography variant="label">Published: March 15, 2024</Typography>
                <Typography variant="label">Author: Jane Doe</Typography>
            </div>
        </header>

        <section className="space-y-4">
            <Typography variant="h2">Introduction</Typography>
            <Typography variant="body">
                Typography is a crucial aspect of user interface design. A well-implemented typography system
                ensures consistency, improves readability, and enhances the overall user experience.
            </Typography>

            <Typography variant="h3">Key Principles</Typography>
            <Typography variant="body">
                When building a typography system, consider these essential principles:
            </Typography>

            <Typography variant="list">
                <li>
                    <Typography variant="body-small">
                        <strong>Consistency:</strong> Maintain uniform spacing and sizing across all text elements
                    </Typography>
                </li>
                <li>
                    <Typography variant="body-small">
                        <strong>Hierarchy:</strong> Establish clear visual hierarchy through size and weight
                    </Typography>
                </li>
                <li>
                    <Typography variant="body-small">
                        <strong>Accessibility:</strong> Ensure sufficient contrast and readable font sizes
                    </Typography>
                </li>
            </Typography>

            <Typography variant="blockquote">
                "Good typography is invisible. Bad typography is everywhere."
            </Typography>

            <Typography variant="h4">Implementation Tips</Typography>
            <Typography variant="body">
                Use semantic HTML elements and CSS custom properties to create a flexible system
                that can adapt to different contexts and requirements.
            </Typography>

            <Typography variant="code">
                {`const TypographySystem = () => (
  <Typography variant="h1">Welcome to our design system</Typography>
);`}
            </Typography>
        </section>

        <footer className="pt-6 border-t">
            <Typography variant="caption">
                © 2024 Design System Inc. All rights reserved.
            </Typography>
        </footer>
    </div>
);
