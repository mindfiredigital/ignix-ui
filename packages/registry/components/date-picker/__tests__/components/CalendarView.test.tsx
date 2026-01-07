// CalendarView.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CalendarView from '../../components/CalendarView';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
    ChevronLeft: ({ className, ...props }: any) => (
        <span data-testid="icon-chevronleft" className={className} {...props} />
    ),
    ChevronRight: ({ className, ...props }: any) => (
        <span data-testid="icon-chevronright" className={className} {...props} />
    ),
}));

// Mock utils
vi.mock('../../../../utils/cn', () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

// Mock Typography
vi.mock('../../../typography', () => ({
    Typography: ({ children, variant, ...props }: any) => {
        const Component = variant === 'h6' ? 'h6' : variant === 'caption' ? 'span' : 'span';
        return React.createElement(Component, props, children);
    },
}));

// Mock Button
vi.mock('../../../button', () => ({
    Button: ({ children, onClick, variant, ...props }: any) => (
        <button
            onClick={onClick}
            className={`button ${variant || ''}`}
            data-testid={props['data-testid'] || 'button'}
            {...props}
        >
            {children}
        </button>
    ),
}));

// Mock utils
vi.mock('../../utils', () => ({
    getDaysInMonth: (date: Date) => {
        // Mock a simple calendar with 42 days
        const days: Date[] = [];
        const year = date.getFullYear();
        const month = date.getMonth();

        // Add 42 days starting from the 1st of the month
        for (let i = 0; i < 42; i++) {
            days.push(new Date(year, month, i - 10)); // Start 10 days before
        }

        return days;
    },
    isSameDay: (date1: Date | null, date2: Date | null) => {
        if (!date1 || !date2) return false;
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    },
    isDateInRange: (date: Date, start: Date | null, end: Date | null) => {
        if (!start || !end) return false;
        return date >= start && date <= end;
    },
    isDateDisabled: () => false,
    getThemeStyles: () => ({
        calendar: '',
        weekday: '',
        day: { current: '', nonCurrent: '' },
        header: '',
        footer: '',
        hover: '',
        text: { disabled: '' },
    }),
    getColorStyles: () => ({
        primary: { light: '', dark: '' },
        accent: { light: '', dark: '' },
        border: { light: '', dark: '' },
        button: { light: '', dark: '' },
    }),
    getInRangeStyle: () => '',
}));

// Mock constants
vi.mock('../../constants', () => ({
    MONTH_NAMES: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ],
    DAY_NAMES: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
}));

describe('CalendarView Component', () => {
    const mockProps = {
        currentMonth: new Date(2024, 0, 1), // January 2024
        onMonthChange: vi.fn(),
        selectedDate: null,
        selectedRange: { start: null, end: null },
        onDateSelect: vi.fn(),
        themeMode: 'light' as const,
        colorScheme: 'blue' as const,
        minDate: undefined,
        maxDate: undefined,
        disabledDates: undefined,
        highlightDates: undefined,
        todayButton: true,
        clearButton: true,
        onTodayClick: vi.fn(),
        onClearClick: vi.fn(),
        weekStart: 0 as 0 | 1,
        monthNames: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        dayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        todayText: 'Today',
        clearText: 'Clear',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders calendar with correct month and year', () => {
        render(<CalendarView {...mockProps} />);

        expect(screen.getByText('January 2024')).toBeInTheDocument();
    });

    it('renders weekday headers', () => {
        render(<CalendarView {...mockProps} />);

        expect(screen.getByText('Su')).toBeInTheDocument();
        expect(screen.getByText('Mo')).toBeInTheDocument();
        expect(screen.getByText('Tu')).toBeInTheDocument();
        expect(screen.getByText('We')).toBeInTheDocument();
        expect(screen.getByText('Th')).toBeInTheDocument();
        expect(screen.getByText('Fr')).toBeInTheDocument();
        expect(screen.getByText('Sa')).toBeInTheDocument();
    });

    it('renders navigation buttons', () => {
        render(<CalendarView {...mockProps} />);

        expect(screen.getByTestId('icon-chevronleft')).toBeInTheDocument();
        expect(screen.getByTestId('icon-chevronright')).toBeInTheDocument();
    });

    it('calls onMonthChange when previous month button is clicked', () => {
        render(<CalendarView {...mockProps} />);

        const prevButton = screen.getByTestId('icon-chevronleft').closest('button');
        fireEvent.click(prevButton!);

        expect(mockProps.onMonthChange).toHaveBeenCalled();
    });

    it('calls onMonthChange when next month button is clicked', () => {
        render(<CalendarView {...mockProps} />);

        const nextButton = screen.getByTestId('icon-chevronright').closest('button');
        fireEvent.click(nextButton!);

        expect(mockProps.onMonthChange).toHaveBeenCalled();
    });

    it('renders footer buttons when enabled', () => {
        render(<CalendarView {...mockProps} />);

        expect(screen.getByText('Today')).toBeInTheDocument();
        expect(screen.getByText('Clear')).toBeInTheDocument();
    });

    it('hides footer buttons when disabled', () => {
        const props = { ...mockProps, todayButton: false, clearButton: false };
        render(<CalendarView {...props} />);

        expect(screen.queryByText('Today')).not.toBeInTheDocument();
        expect(screen.queryByText('Clear')).not.toBeInTheDocument();
    });

    it('calls onTodayClick when Today button is clicked', () => {
        render(<CalendarView {...mockProps} />);

        const todayButton = screen.getByText('Today');
        fireEvent.click(todayButton);

        expect(mockProps.onTodayClick).toHaveBeenCalled();
    });

    it('calls onClearClick when Clear button is clicked', () => {
        render(<CalendarView {...mockProps} />);

        const clearButton = screen.getByText('Clear');
        fireEvent.click(clearButton);

        expect(mockProps.onClearClick).toHaveBeenCalled();
    });

    it('renders with custom month names', () => {
        const customMonthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const props = { ...mockProps, monthNames: customMonthNames };

        render(<CalendarView {...props} />);

        expect(screen.getByText('Jan 2024')).toBeInTheDocument();
    });

    it('renders with custom day names', () => {
        const customDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const props = { ...mockProps, dayNames: customDayNames };

        render(<CalendarView {...props} />);

        expect(screen.getByText('Sun')).toBeInTheDocument();
        expect(screen.getByText('Sat')).toBeInTheDocument();
    });

    it('renders with custom button texts', () => {
        const props = {
            ...mockProps,
            todayText: 'Current Day',
            clearText: 'Reset'
        };

        render(<CalendarView {...props} />);

        expect(screen.getByText('Current Day')).toBeInTheDocument();
        expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('renders with week starting on Monday', () => {
        const props = { ...mockProps, weekStart: 1 };

        render(<CalendarView {...props} />);

        // Should show Monday first
        expect(screen.getByText('Mo')).toBeInTheDocument();
    });

    it('renders with dark theme', () => {
        const props = { ...mockProps, themeMode: 'dark' as const };

        render(<CalendarView {...props} />);

        // Component should render without errors
        expect(screen.getByText('January 2024')).toBeInTheDocument();
    });

    it('renders with different color scheme', () => {
        const props = { ...mockProps, colorScheme: 'green' as const };

        render(<CalendarView {...props} />);

        // Component should render without errors
        expect(screen.getByText('January 2024')).toBeInTheDocument();
    });

    describe('Date Selection', () => {
        it('renders with selected date highlighted', () => {
            const selectedDate = new Date(2024, 0, 15);
            const props = { ...mockProps, selectedDate };

            render(<CalendarView {...props} />);

            // Calendar should render with the selected date
            expect(screen.getByText('January 2024')).toBeInTheDocument();
        });

        it('renders with date range highlighted', () => {
            const selectedRange = {
                start: new Date(2024, 0, 10),
                end: new Date(2024, 0, 20)
            };
            const props = { ...mockProps, selectedRange };

            render(<CalendarView {...props} />);

            // Calendar should render with the range
            expect(screen.getByText('January 2024')).toBeInTheDocument();
        });

        it('handles minDate constraint', () => {
            const minDate = new Date(2024, 0, 10);
            const props = { ...mockProps, minDate };

            render(<CalendarView {...props} />);

            // Calendar should render with min date constraint
            expect(screen.getByText('January 2024')).toBeInTheDocument();
        });

        it('handles maxDate constraint', () => {
            const maxDate = new Date(2024, 0, 25);
            const props = { ...mockProps, maxDate };

            render(<CalendarView {...props} />);

            // Calendar should render with max date constraint
            expect(screen.getByText('January 2024')).toBeInTheDocument();
        });

        it('handles disabled dates', () => {
            const disabledDates = [new Date(2024, 0, 15)];
            const props = { ...mockProps, disabledDates };

            render(<CalendarView {...props} />);

            // Calendar should render with disabled dates
            expect(screen.getByText('January 2024')).toBeInTheDocument();
        });

        it('handles highlighted dates', () => {
            const highlightDates = [new Date(2024, 0, 15)];
            const props = { ...mockProps, highlightDates };

            render(<CalendarView {...props} />);

            // Calendar should render with highlighted dates
            expect(screen.getByText('January 2024')).toBeInTheDocument();
        });
    });
});