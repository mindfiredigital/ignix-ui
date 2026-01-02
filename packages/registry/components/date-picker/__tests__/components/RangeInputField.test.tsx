// RangeInputField.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RangeInputField from '../../components/RangeInputField';

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

// Mock Typography
vi.mock('../../../typography', () => ({
    Typography: ({ children, variant, ...props }: any) => {
        const Component = variant === 'body' ? 'span' : 'span';
        return React.createElement(Component, props, children);
    },
}));

// Mock utils
vi.mock('../../utils', () => ({
    getThemeStyles: () => ({
        text: { primary: '', muted: '' },
        placeholder: '',
    }),
}));

describe('RangeInputField Component', () => {
    const mockOnStartChange = vi.fn();
    const mockOnEndChange = vi.fn();
    const mockOnFocus = vi.fn();
    const defaultProps = {
        startRef: React.createRef(),
        endRef: React.createRef(),
        startValue: '',
        endValue: '',
        onStartChange: mockOnStartChange,
        onEndChange: mockOnEndChange,
        placeholder: ['Start date', 'End date'],
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

    it('renders two inputs for start and end dates', () => {
        render(<RangeInputField {...defaultProps} />);

        expect(screen.getByPlaceholderText('Start date')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('End date')).toBeInTheDocument();
    });

    it('renders separator between inputs', () => {
        render(<RangeInputField {...defaultProps} />);

        expect(screen.getByText('–')).toBeInTheDocument();
    });

    it('renders inputs with values', () => {
        const props = {
            ...defaultProps,
            startValue: '12/25/2024',
            endValue: '01/01/2025'
        };
        render(<RangeInputField {...props} />);

        expect(screen.getByDisplayValue('12/25/2024')).toBeInTheDocument();
        expect(screen.getByDisplayValue('01/01/2025')).toBeInTheDocument();
    });

    it('calls onStartChange when start input value changes', () => {
        render(<RangeInputField {...defaultProps} />);

        const startInput = screen.getByPlaceholderText('Start date');
        fireEvent.change(startInput, { target: { value: '12/25/2024' } });

        expect(mockOnStartChange).toHaveBeenCalled();
    });

    it('calls onEndChange when end input value changes', () => {
        render(<RangeInputField {...defaultProps} />);

        const endInput = screen.getByPlaceholderText('End date');
        fireEvent.change(endInput, { target: { value: '01/01/2025' } });

        expect(mockOnEndChange).toHaveBeenCalled();
    });

    it('calls onFocus when either input is focused', () => {
        render(<RangeInputField {...defaultProps} />);

        const startInput = screen.getByPlaceholderText('Start date');
        fireEvent.focus(startInput);

        expect(mockOnFocus).toHaveBeenCalled();

        const endInput = screen.getByPlaceholderText('End date');
        fireEvent.focus(endInput);

        expect(mockOnFocus).toHaveBeenCalledTimes(2);
    });

    it('renders calendar icon when showIcon is true', () => {
        render(<RangeInputField {...defaultProps} />);

        expect(screen.getByTestId('icon-calendar')).toBeInTheDocument();
    });

    it('does not render calendar icon when showIcon is false', () => {
        const props = { ...defaultProps, showIcon: false };
        render(<RangeInputField {...props} />);

        expect(screen.queryByTestId('icon-calendar')).not.toBeInTheDocument();
    });

    it('renders custom icon when provided', () => {
        const customIcon = <span data-testid="custom-icon">📅</span>;
        const props = { ...defaultProps, icon: customIcon };
        render(<RangeInputField {...props} />);

        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
        const props = { ...defaultProps, disabled: true };
        render(<RangeInputField {...props} />);

        const startInput = screen.getByPlaceholderText('Start date');
        const endInput = screen.getByPlaceholderText('End date');

        expect(startInput).toBeDisabled();
        expect(endInput).toBeDisabled();
    });

    it('is readOnly when readOnly prop is true', () => {
        const props = { ...defaultProps, readOnly: true };
        render(<RangeInputField {...props} />);

        const startInput = screen.getByPlaceholderText('Start date');
        const endInput = screen.getByPlaceholderText('End date');

        expect(startInput).toHaveAttribute('readonly');
        expect(endInput).toHaveAttribute('readonly');
    });

    it('renders with dark theme', () => {
        const props = { ...defaultProps, themeMode: 'dark' as const };
        render(<RangeInputField {...props} />);

        // Component should render without errors
        expect(screen.getByPlaceholderText('Start date')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('End date')).toBeInTheDocument();
    });

    it('handles string placeholder (non-array)', () => {
        const props = { ...defaultProps, placeholder: 'Select date range' };
        render(<RangeInputField {...props} />);

        expect(screen.getAllByPlaceholderText('Start date')).toHaveLength(1);
        expect(screen.getAllByPlaceholderText('End date')).toHaveLength(1);
    });

    it('handles empty values', () => {
        render(<RangeInputField {...defaultProps} />);

        const startInput = screen.getByPlaceholderText('Start date');
        const endInput = screen.getByPlaceholderText('End date');

        expect(startInput).toHaveValue('');
        expect(endInput).toHaveValue('');
    });

    it('handles partial range (only start date)', () => {
        const props = { ...defaultProps, startValue: '12/25/2024' };
        render(<RangeInputField {...props} />);

        expect(screen.getByDisplayValue('12/25/2024')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('End date')).toHaveValue('');
    });

    it('handles partial range (only end date)', () => {
        const props = { ...defaultProps, endValue: '01/01/2025' };
        render(<RangeInputField {...props} />);

        expect(screen.getByPlaceholderText('Start date')).toHaveValue('');
        expect(screen.getByDisplayValue('01/01/2025')).toBeInTheDocument();
    });

    it('handles complete range', () => {
        const props = {
            ...defaultProps,
            startValue: '12/25/2024',
            endValue: '01/01/2025'
        };
        render(<RangeInputField {...props} />);

        expect(screen.getByDisplayValue('12/25/2024')).toBeInTheDocument();
        expect(screen.getByDisplayValue('01/01/2025')).toBeInTheDocument();
    });
});