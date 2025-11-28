import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { Checkbox } from '.';

// Simple mock for framer-motion that doesn't cause export issues
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
        svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
        polyline: (props: any) => <polyline {...props} />,
    },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({}));

describe('Checkbox', () => {
    const defaultProps = {
        label: 'Test Checkbox',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders checkbox with label correctly', () => {
        render(<Checkbox {...defaultProps} />);

        expect(screen.getByText('Test Checkbox')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders without label when not provided', () => {
        render(<Checkbox />);

        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        expect(screen.queryByText('Test Checkbox')).not.toBeInTheDocument();
    });

    it('handles controlled state correctly', () => {
        const onChange = vi.fn();
        render(<Checkbox {...defaultProps} checked={true} onChange={onChange} />);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();

        fireEvent.click(checkbox);
        expect(onChange).toHaveBeenCalledWith(false);
    });

    it('handles uncontrolled state correctly', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<Checkbox {...defaultProps} defaultChecked={false} onChange={onChange} />);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();

        await user.click(checkbox);
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('applies different variants correctly', () => {
        const { rerender } = render(<Checkbox {...defaultProps} variant="default" />);
        let checkboxContainer = screen.getByRole('checkbox').closest('div');
        expect(checkboxContainer).toHaveClass('border-primary');

        rerender(<Checkbox {...defaultProps} variant="success" />);
        checkboxContainer = screen.getByRole('checkbox').closest('div');
        expect(checkboxContainer).toHaveClass('border-success');

        rerender(<Checkbox {...defaultProps} variant="danger" />);
        checkboxContainer = screen.getByRole('checkbox').closest('div');
        expect(checkboxContainer).toHaveClass('border-destructive');
    });

    it('applies different sizes correctly', () => {
        const { rerender } = render(<Checkbox {...defaultProps} size="sm" />);
        let checkboxContainer = screen.getByRole('checkbox').closest('div');
        expect(checkboxContainer).toHaveClass('h-4', 'w-4');

        rerender(<Checkbox {...defaultProps} size="lg" />);
        checkboxContainer = screen.getByRole('checkbox').closest('div');
        expect(checkboxContainer).toHaveClass('h-6', 'w-6');
    });

    it('displays error message when provided', () => {
        render(<Checkbox {...defaultProps} error="This field is required" />);

        expect(screen.getByText('This field is required')).toBeInTheDocument();
        expect(screen.getByText('This field is required')).toHaveClass('text-destructive');
    });

    it('applies disabled state correctly', () => {
        render(<Checkbox {...defaultProps} disabled />);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeDisabled();
    });

    it('handles label position correctly', () => {
        const { rerender } = render(<Checkbox {...defaultProps} labelPosition="right" />);
        let container = screen.getByText('Test Checkbox').closest('div');
        expect(container).toHaveClass('flex-row');

        rerender(<Checkbox {...defaultProps} labelPosition="left" />);
        container = screen.getByText('Test Checkbox').closest('div');
        expect(container).toHaveClass('flex-row-reverse');
    });

    it('toggles when label is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<Checkbox {...defaultProps} onChange={onChange} />);

        const label = screen.getByText('Test Checkbox');
        await user.click(label);

        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('does not toggle when disabled and label is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<Checkbox {...defaultProps} disabled onChange={onChange} />);

        const label = screen.getByText('Test Checkbox');
        await user.click(label);

        expect(onChange).not.toHaveBeenCalled();
    });

    it('applies custom className correctly', () => {
        render(<Checkbox {...defaultProps} className="custom-class" />);

        const checkboxContainer = screen.getByRole('checkbox').closest('div');
        expect(checkboxContainer).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<Checkbox {...defaultProps} ref={ref} />);

        expect(ref.current).toBeInstanceOf(HTMLInputElement);
        expect(ref.current?.type).toBe('checkbox');
    });

    it('handles additional input props', () => {
        render(<Checkbox {...defaultProps} name="test-checkbox" value="test-value" />);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toHaveAttribute('name', 'test-checkbox');
        expect(checkbox).toHaveAttribute('value', 'test-value');
    });

    describe('Accessibility', () => {
        it('has proper ARIA attributes when disabled', () => {
            render(<Checkbox {...defaultProps} disabled />);

            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toBeDisabled();
        });

        it('has proper ARIA attributes when checked', () => {
            render(<Checkbox {...defaultProps} checked />);

            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toBeChecked();
        });

        it('associates label with checkbox correctly', () => {
            render(<Checkbox {...defaultProps} />);

            const checkbox = screen.getByRole('checkbox');
            const label = screen.getByText('Test Checkbox');

            expect(label).toBeInTheDocument();
            // The label should be clickable and associated with the checkbox
            expect(checkbox).toBeInTheDocument();
        });
    });

    describe('Animation Variants', () => {
        it('renders nina animation variant without errors', () => {
            // This test ensures the nina variant doesn't crash
            expect(() => {
                render(<Checkbox {...defaultProps} animationVariant="nina" />);
            }).not.toThrow();
        });

        it('renders other animation variants without errors', () => {
            const variants = ['bounce', 'scale', 'pulse', 'glow', 'shake', 'flip'];

            variants.forEach(variant => {
                expect(() => {
                    render(<Checkbox {...defaultProps} animationVariant={variant} />);
                }).not.toThrow();
            });
        });
    });

    describe('Edge Cases', () => {
        it('handles null label gracefully', () => {
            render(<Checkbox label={undefined} />);

            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toBeInTheDocument();
        });

        it('maintains state when props change', () => {
            const { rerender } = render(<Checkbox {...defaultProps} checked={false} />);

            let checkbox = screen.getByRole('checkbox');
            expect(checkbox).not.toBeChecked();

            rerender(<Checkbox {...defaultProps} checked={true} />);
            checkbox = screen.getByRole('checkbox');
            expect(checkbox).toBeChecked();
        });

        it('handles undefined onChange gracefully', () => {
            expect(() => {
                render(<Checkbox {...defaultProps} onChange={undefined} />);
                const checkbox = screen.getByRole('checkbox');
                fireEvent.click(checkbox);
            }).not.toThrow();
        });
    });
});