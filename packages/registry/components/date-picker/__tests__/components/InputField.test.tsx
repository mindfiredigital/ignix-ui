// InputField.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InputField from '../../components/InputField';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
    Calendar: ({ className, ...props }: any) => (
        <span data-testid="icon-calendar" className={className} {...props} />
    ),
}));

// Mock utils
vi.mock('../../../../../utils/cn', () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

// Mock utils
vi.mock('../../utils', () => ({
    getThemeStyles: () => ({
        text: { primary: '' },
        placeholder: '',
    }),
}));

describe('InputField Component', () => {
    const mockOnChange = vi.fn();
    const mockOnFocus = vi.fn();
    const defaultProps = {
        ref: React.createRef(),
        value: '',
        onChange: mockOnChange,
        placeholder: 'Select date',
        themeMode: 'light' as const,
        disabled: false,
        readOnly: false,
        showIcon: true,
        icon: undefined,
        onFocus: mockOnFocus,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders input with placeholder', () => {
        render(<InputField {...defaultProps} />);

        expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
    });

    it('renders input with value', () => {
        const props = { ...defaultProps, value: '12/25/2024' };
        render(<InputField {...props} />);

        const input = screen.getByDisplayValue('12/25/2024');
        expect(input).toBeInTheDocument();
    });

    it('calls onChange when input value changes', () => {
        render(<InputField {...defaultProps} />);

        const input = screen.getByPlaceholderText('Select date');
        fireEvent.change(input, { target: { value: '12/25/2024' } });

        expect(mockOnChange).toHaveBeenCalled();
    });

    it('calls onFocus when input is focused', () => {
        render(<InputField {...defaultProps} />);

        const input = screen.getByPlaceholderText('Select date');
        fireEvent.focus(input);

        expect(mockOnFocus).toHaveBeenCalled();
    });

    it('renders calendar icon when showIcon is true', () => {
        render(<InputField {...defaultProps} />);

        expect(screen.getByTestId('icon-calendar')).toBeInTheDocument();
    });

    it('does not render calendar icon when showIcon is false', () => {
        const props = { ...defaultProps, showIcon: false };
        render(<InputField {...props} />);

        expect(screen.queryByTestId('icon-calendar')).not.toBeInTheDocument();
    });

    it('renders custom icon when provided', () => {
        const customIcon = <span data-testid="custom-icon">📅</span>;
        const props = { ...defaultProps, icon: customIcon };
        render(<InputField {...props} />);

        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
        const props = { ...defaultProps, disabled: true };
        render(<InputField {...props} />);

        const input = screen.getByPlaceholderText('Select date');
        expect(input).toBeDisabled();
    });

    it('is readOnly when readOnly prop is true', () => {
        const props = { ...defaultProps, readOnly: true };
        render(<InputField {...props} />);

        const input = screen.getByPlaceholderText('Select date');
        expect(input).toHaveAttribute('readonly');
    });

    it('renders with dark theme', () => {
        const props = { ...defaultProps, themeMode: 'dark' as const };
        render(<InputField {...props} />);

        // Component should render without errors
        expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
    });

    it('applies custom placeholder', () => {
        const props = { ...defaultProps, placeholder: 'Choose a date' };
        render(<InputField {...props} />);

        expect(screen.getByPlaceholderText('Choose a date')).toBeInTheDocument();
    });

    it('handles empty value', () => {
        render(<InputField {...defaultProps} />);

        const input = screen.getByPlaceholderText('Select date');
        expect(input).toHaveValue('');
    });

    it('handles long value', () => {
        const longValue = 'December 25, 2024 - January 1, 2025';
        const props = { ...defaultProps, value: longValue };
        render(<InputField {...props} />);

        const input = screen.getByDisplayValue(longValue);
        expect(input).toBeInTheDocument();
    });
});