import type { Meta, StoryObj } from '@storybook/react';
import { Navbar } from './index';
import { Button } from '../button/index';

type AnimationType =
    | 'slide'
    | 'glow'
    | 'basic'
    | 'spotlight'
    | 'hoverSubmenu'
    | 'clickSubmenu';

type Variant =
    | 'default'
    | 'dark'
    | 'transparent'
    | 'glass'
    | 'gradient'
    | 'primary';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface NavbarStoryProps {
    variant?: Variant;
    size?: Size;
    direction?: 'horizontal' | 'vertical';
    animationType?: AnimationType;
    header?: string;
    submenuContent?: React.ReactNode;
    children?: React.ReactNode;
}

const meta: Meta<NavbarStoryProps> = {
    title: 'Components/Navbar',
    component: Navbar,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: `
The **Navbar** component is a flexible, animated navigation bar built with **Framer Motion** and **class-variance-authority**.
It supports multiple animation styles, submenu behaviors, and layout directions.

### Features
- 6 animation types (slide, glow, spotlight, hoverSubmenu, clickSubmenu, basic)
- Responsive horizontal/vertical layout
- Submenu support with hover or click triggers
- Variant-based styling (glass, gradient, dark, etc.)
        `,
            },
        },
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'dark', 'transparent', 'glass', 'gradient', 'primary'],
            description: 'Visual style of the navbar',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'xl'],
            description: 'Height of the navbar',
        },
        direction: {
            control: 'radio',
            options: ['horizontal', 'vertical'],
            description: 'Layout direction of navbar items',
        },
        animationType: {
            control: 'select',
            options: ['slide', 'glow', 'basic', 'spotlight', 'hoverSubmenu', 'clickSubmenu'],
            description: 'Animation style applied to navbar',
        },
        header: {
            control: 'text',
            description: 'Header text for submenu triggers',
        },
        submenuContent: {
            control: 'text',
            description: 'Content shown inside submenu',
        },
        children: {
            control: 'text',
            description: 'Main content inside navbar',
        },
    },
};

export default meta;
type Story = StoryObj<NavbarStoryProps>;

const Template = (args: NavbarStoryProps) => {
    const {
        variant = 'default',
        size = 'md',
        direction = 'horizontal',
        animationType = 'slide',
        header = 'Menu',
        submenuContent,
        children,
    } = args;

    return (
        <Navbar
            variant={variant}
            size={size}
            direction={direction}
            animationType={animationType}
            header={header}
            submenuContent={
                submenuContent || (
                    <div className="flex flex-col space-y-2 p-2">
                        <Button variant="primary">Profile</Button>
                        <Button variant="primary">Settings</Button>
                        <Button variant="primary">Logout</Button>
                    </div>
                )
            }
        >
            {children || (
                <>
                    <div className='flex'>
                        <Button variant="ghost">Home</Button>
                        <Button variant="ghost">About</Button>
                        <Button variant="ghost">Contact</Button>
                    </div>
                </>
            )}
        </Navbar>
    );
};

export const Default: Story = {
    render: Template,
    args: {
        variant: 'default',
        size: 'md',
        direction: 'horizontal',
        animationType: 'slide',
    },
};


export const SpotlightHover: Story = {
    render: Template,
    args: {
        variant: 'glass',
        size: 'md',
        animationType: 'spotlight',
    },
};

export const HoverSubmenu: Story = {
    render: Template,
    args: {
        variant: 'primary',
        size: 'md',
        animationType: 'hoverSubmenu',
        header: 'Explore',
    },
};

export const ClickSubmenu: Story = {
    render: Template,
    args: {
        variant: 'dark',
        size: 'md',
        animationType: 'clickSubmenu',
        header: 'Options',
    },
}
