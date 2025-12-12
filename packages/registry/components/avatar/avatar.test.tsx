import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { Avatar, AvatarGroup } from './index';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        div: ({ children, whileHover, whileTap, ...props }: any) => (
            <div {...props}>{children}</div>
        ),
    },
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
    User: () => <div data-testid="user-icon">User Icon</div>,
}));


describe('Avatar', () => {
    const defaultProps = {
        alt: 'Test Avatar',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders with default props', () => {
        render(<Avatar {...defaultProps} />);

        // When no src is provided, it shows the User icon
        expect(screen.getByTestId('user-icon')).toBeInTheDocument();
        // The container should have default classes
        const avatarContainer = screen.getByTestId('user-icon').closest('div[class*="relative inline-flex"]');
        expect(avatarContainer).toBeInTheDocument();
    });

    it('renders with image source', () => {
        render(<Avatar {...defaultProps} src="test.jpg" />);

        const img = screen.getByRole('img', { name: 'Test Avatar' });
        expect(img).toHaveAttribute('src', 'test.jpg');
        expect(img).toHaveClass('object-cover');
    });

    it('shows fallback icon when no image or letters provided', () => {
        render(<Avatar {...defaultProps} />);

        expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    });

    it('renders with letters', () => {
        render(<Avatar {...defaultProps} letters="John Doe" />);

        expect(screen.getByText('JD')).toBeInTheDocument(); // Initials
    });

    it('renders single word letters correctly', () => {
        render(<Avatar {...defaultProps} letters="John" />);

        expect(screen.getByText('JO')).toBeInTheDocument();
    });

    it('renders with custom icon', () => {
        const icon = <div data-testid="custom-icon">Icon</div>;
        render(<Avatar {...defaultProps} icon={icon} />);

        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders with custom fallback', () => {
        const fallback = <div data-testid="custom-fallback">FB</div>;
        render(<Avatar {...defaultProps} fallback={fallback} />);

        expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    });

    describe('Shapes', () => {
        it('applies circle shape correctly', () => {
            render(<Avatar {...defaultProps} shape="circle" />);

            // Find the avatar container via the User icon
            const userIcon = screen.getByTestId('user-icon');
            const avatarContainer = userIcon.closest('div[class*="relative inline-flex"]');
            expect(avatarContainer).toHaveClass('rounded-full');
        });

        it('applies square shape correctly', () => {
            render(<Avatar {...defaultProps} shape="square" />);

            const userIcon = screen.getByTestId('user-icon');
            const avatarContainer = userIcon.closest('div[class*="relative inline-flex"]');
            expect(avatarContainer).toHaveClass('rounded-none');
        });

        it('applies rounded shape correctly', () => {
            render(<Avatar {...defaultProps} shape="rounded" />);

            const userIcon = screen.getByTestId('user-icon');
            const avatarContainer = userIcon.closest('div[class*="relative inline-flex"]');
            expect(avatarContainer).toHaveClass('rounded-md');
        });

        it('applies custom shapes with clip-path', () => {
            const customShapes = [
                'hexagon',
                'pentagon',
                'star',
                'diamond',
                'triangle',
                'octagon',
            ] as const;

            customShapes.forEach(shape => {
                const { unmount } = render(<Avatar {...defaultProps} shape={shape} />);

                const userIcon = screen.getByTestId('user-icon');
                const avatarContainer = userIcon.closest('div[class*="relative inline-flex"]');

                // Custom shapes shouldn't have border-radius classes
                expect(avatarContainer).not.toHaveClass('rounded-full', 'rounded-none', 'rounded-md');

                // They should have clip-path style
                expect(avatarContainer).toHaveAttribute('style');

                const style = avatarContainer.getAttribute('style');
                expect(style).toContain('clip-path');

                unmount();
            });
        });
    });

    describe('Sizes', () => {
        const sizes = [
            { size: 'xs', expected: ['h-6', 'w-6', 'text-xs'] },
            { size: 'sm', expected: ['h-8', 'w-8', 'text-sm'] },
            { size: 'md', expected: ['h-10', 'w-10', 'text-base'] },
            { size: 'lg', expected: ['h-12', 'w-12', 'text-lg'] },
            { size: 'xl', expected: ['h-14', 'w-14', 'text-xl'] },
            { size: '2xl', expected: ['h-16', 'w-16', 'text-2xl'] },
            { size: '3xl', expected: ['h-20', 'w-20', 'text-2xl'] },
            { size: '4xl', expected: ['h-24', 'w-24', 'text-3xl'] },
            { size: '5xl', expected: ['h-28', 'w-28', 'text-4xl'] },
            { size: '6xl', expected: ['h-32', 'w-32', 'text-5xl'] },
            { size: '7xl', expected: ['h-36', 'w-36', 'text-6xl'] },
            { size: '8xl', expected: ['h-40', 'w-40', 'text-7xl'] },
            { size: '9xl', expected: ['h-44', 'w-44', 'text-8xl'] },
        ] as const;

        sizes.forEach(({ size, expected }) => {
            it(`applies ${size} size correctly`, () => {
                render(<Avatar {...defaultProps} size={size} />);

                // Find via User icon since no image src
                const userIcon = screen.getByTestId('user-icon');
                const avatarContainer = userIcon.closest('div[class*="relative inline-flex"]');

                expected.forEach(className => {
                    expect(avatarContainer).toHaveClass(className);
                });
            });
        });
    });

    describe('Status Indicator', () => {
        const statuses = [
            { status: 'online', expectedClass: 'bg-green-500' },
            { status: 'offline', expectedClass: 'bg-gray-400' },
            { status: 'away', expectedClass: 'bg-yellow-500' },
            { status: 'busy', expectedClass: 'bg-red-500' },
        ] as const;

        statuses.forEach(({ status, expectedClass }) => {
            it(`shows ${status} status`, () => {
                render(<Avatar {...defaultProps} status={status} />);

                const statusIndicator = screen.getByRole('status');
                expect(statusIndicator).toHaveAttribute('aria-label', `Status: ${status}`);
                expect(statusIndicator).toHaveClass(expectedClass);
            });
        });

        it('hides status when not provided', () => {
            render(<Avatar {...defaultProps} />);

            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });
    });

    describe('Image Loading States', () => {
        it('shows loading state while image loads', () => {
            render(<Avatar {...defaultProps} src="test.jpg" />);

            // Initially shows loading state
            const img = screen.getByRole('img', { name: 'Test Avatar' });
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute('src', 'test.jpg');
        });

        it('hides loading state when image loads successfully', () => {
            render(<Avatar {...defaultProps} src="test.jpg" />);

            const img = screen.getByRole('img', { name: 'Test Avatar' });
            fireEvent.load(img);

            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute('src', 'test.jpg');
        });
    });

    describe('Bordered and Clickable', () => {
        it('applies bordered style when true', () => {
            render(<Avatar {...defaultProps} bordered />);

            const userIcon = screen.getByTestId('user-icon');
            const avatarContainer = userIcon.closest('div[class*="relative inline-flex"]');
            expect(avatarContainer).toHaveClass('border-2', 'border-background');
        });

        it('applies clickable style when true', () => {
            render(<Avatar {...defaultProps} clickable />);

            const userIcon = screen.getByTestId('user-icon');
            const avatarContainer = userIcon.closest('div[class*="relative inline-flex"]');
            expect(avatarContainer).toHaveClass('cursor-pointer');
        });

        it('does not apply clickable style when false', () => {
            render(<Avatar {...defaultProps} clickable={false} />);

            const userIcon = screen.getByTestId('user-icon');
            const avatarContainer = userIcon.closest('div[class*="relative inline-flex"]');
            expect(avatarContainer).toHaveClass('cursor-default');
        });
    });

    describe('Background Color', () => {
        it('applies custom background color', () => {
            render(<Avatar {...defaultProps} backgroundColor="#ff0000" />);

            const userIcon = screen.getByTestId('user-icon');
            const avatarContainer = userIcon.closest('div[class*="relative inline-flex"]');
            expect(avatarContainer).toHaveStyle('background-color: #ff0000');
        });

        it('uses default background when no custom color provided', () => {
            render(<Avatar {...defaultProps} />);

            const userIcon = screen.getByTestId('user-icon');
            const avatarContainer = userIcon.closest('div[class*="relative inline-flex"]');
            // Should have the default background classes
            expect(avatarContainer).toHaveClass('bg-slate-100');
        });
    });

    describe('Accessibility', () => {
        it('has proper alt text when image is rendered', () => {
            render(<Avatar alt="User profile picture" src="test.jpg" />);

            expect(screen.getByAltText('User profile picture')).toBeInTheDocument();
        });

        it('has loading="lazy" attribute on images', () => {
            render(<Avatar {...defaultProps} src="test.jpg" />);

            const img = screen.getByRole('img', { name: 'Test Avatar' });
            expect(img).toHaveAttribute('loading', 'lazy');
        });

        it('has decoding="async" attribute on images', () => {
            render(<Avatar {...defaultProps} src="test.jpg" />);

            const img = screen.getByRole('img', { name: 'Test Avatar' });
            expect(img).toHaveAttribute('decoding', 'async');
        });
    });
});

describe('AvatarGroup', () => {
    const defaultAvatars = [
        <Avatar key="1" alt="User 1" letters="JD" />,
        <Avatar key="2" alt="User 2" letters="AB" />,
        <Avatar key="3" alt="User 3" letters="CD" />,
        <Avatar key="4" alt="User 4" letters="EF" />,
    ];

    it('renders all avatars when no max limit', () => {
        render(<AvatarGroup>{defaultAvatars}</AvatarGroup>);

        expect(screen.getByText('JD')).toBeInTheDocument();
        expect(screen.getByText('AB')).toBeInTheDocument();
        expect(screen.getByText('CD')).toBeInTheDocument();
        expect(screen.getByText('EF')).toBeInTheDocument();
    });

    it('limits avatars when max is specified', () => {
        render(<AvatarGroup max={2}>{defaultAvatars}</AvatarGroup>);

        expect(screen.getByText('JD')).toBeInTheDocument();
        expect(screen.getByText('AB')).toBeInTheDocument();
        expect(screen.queryByText('CD')).not.toBeInTheDocument();
        expect(screen.queryByText('EF')).not.toBeInTheDocument();
    });

    it('shows +X count for extra avatars', () => {
        render(<AvatarGroup max={2}>{defaultAvatars}</AvatarGroup>);

        expect(screen.getByText('+2')).toBeInTheDocument();
        expect(screen.getByLabelText('2 more avatars')).toBeInTheDocument();
    });

    it('applies custom spacing', () => {
        render(<AvatarGroup spacing={-8}>{defaultAvatars.slice(0, 2)}</AvatarGroup>);

        const groupContainer = screen.getByRole('group');
        expect(groupContainer).toHaveStyle('margin-left: 8px');
    });

    it('applies consistent size to all avatars', () => {
        render(<AvatarGroup size="lg">{defaultAvatars.slice(0, 2)}</AvatarGroup>);

        // Find all avatar containers by looking for the text content
        const avatarTexts = screen.getAllByText(/JD|AB/);

        avatarTexts.forEach(text => {
            const container = text.closest('div[class*="relative inline-flex"]');
            expect(container).toHaveClass('h-12', 'w-12', 'text-lg'); // lg size
        });
    });

    it('adds bordered style to avatars in group', () => {
        render(<AvatarGroup>{defaultAvatars.slice(0, 2)}</AvatarGroup>);

        const avatarTexts = screen.getAllByText(/JD|AB/);

        avatarTexts.forEach(text => {
            const container = text.closest('div[class*="relative inline-flex"]');
            expect(container).toHaveClass('border-2', 'border-background');
        });
    });
    describe('Accessibility', () => {
        it('has proper group role and label', () => {
            render(<AvatarGroup>{defaultAvatars.slice(0, 2)}</AvatarGroup>);

            const group = screen.getByRole('group');
            expect(group).toHaveAttribute('aria-label', 'Avatar group');
        });

        it('extra count has proper aria-label', () => {
            render(<AvatarGroup max={2}>{defaultAvatars}</AvatarGroup>);

            const extraCount = screen.getByText('+2');
            expect(extraCount.closest('div')).toHaveAttribute('aria-label', '2 more avatars');
        });
    });
});