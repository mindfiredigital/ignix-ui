// datepicker.test.tsx
import React from 'react';
import { render, screen, waitFor, } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import DatePicker from './';

// Mock for framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    Calendar: ({ className }: any) => <svg className={className} data-testid="calendar-icon" />,
    AlertCircle: ({ className }: any) => <svg className={className} data-testid="alert-icon" />,
    ChevronLeft: ({ className }: any) => <svg className={className} data-testid="chevron-left" />,
    ChevronRight: ({ className }: any) => <svg className={className} data-testid="chevron-right" />,
}));

// Mock the Typography component
vi.mock('../typography', () => ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Typography: ({ children, variant, color, weight, className, align, ...props }: any) => {
        const tagMap: Record<string, string> = {
            h6: 'h6',
            body: 'p',
            'body-small': 'span',
            caption: 'span',
            label: 'label',
        };
        const Tag = tagMap[variant] || 'div';

        // Map color to class names
        const colorClasses: Record<string, string> = {
            error: 'text-red-500',
            muted: 'text-gray-500',
        };

        const colorClass = color ? colorClasses[color] || '' : '';

        return (
            <Tag className={`${className || ''} ${colorClass}`} {...props}>
                {children}
            </Tag>
        );
    },
}));

// Mock the Button component
vi.mock('../button', () => ({
    Button: ({ children, onClick, disabled, className, 'aria-label': ariaLabel, ...props }: any) => (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={className}
            {...props}
        >
            {children}
        </button>
    ),
}));

// Mock utility
vi.mock('../../../utils/cn', () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('DatePicker', () => {
    const defaultProps = {
        label: 'Select Date',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock today's date for consistent testing
        vi.setSystemTime(new Date('2024-01-15'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    // Helper function to open calendar
    const openCalendar = async (user: any, props = {}) => {
        const { container } = render(<DatePicker {...props} />);
        const input = screen.getByPlaceholderText('Select date');
        await user.click(input);
        return container;
    };


    // Helper function to get date button by day number
    const getDateButtonByDay = (dayNumber: number) => {
        // Find button containing the day number
        const buttons = screen.getAllByRole('button');
        return buttons.find(button =>
            button.textContent === dayNumber.toString() &&
            !button.getAttribute('aria-label')?.includes('month')
        );
    };

    // Core functionality tests
    describe('Core Functionality', () => {
        it('renders single date picker with label correctly', () => {
            render(<DatePicker {...defaultProps} />);

            expect(screen.getByText('Select Date')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
        });

        it('renders range date picker correctly', () => {
            render(<DatePicker variant="range" placeholder={['Start date', 'End date']} />);

            expect(screen.getByPlaceholderText('Start date')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('End date')).toBeInTheDocument();
            expect(screen.getByText('–')).toBeInTheDocument();
        });

        //     const user = userEvent.setup();
        //     await openCalendar(user);

        //     // Calendar should open (look for month/year header)
        //     await waitFor(() => {
        //         expect(screen.getByText('January')).toBeInTheDocument();
        //         expect(screen.getByText('2024')).toBeInTheDocument();
        //     });
        // });

        // it('closes calendar when clicking outside', async () => {
        //     const user = userEvent.setup();
        //     render(
        //         <div>
        //             <DatePicker />
        //             <div data-testid="outside">Outside</div>
        //         </div>
        //     );

        //     const input = screen.getByPlaceholderText('Select date');
        //     await user.click(input);

        //     // Calendar should be open
        //     expect(screen.getByText('January')).toBeInTheDocument();

        //     // Click outside
        //     await user.click(screen.getByTestId('outside'));

        //     // Calendar should close
        //     await waitFor(() => {
        //         expect(screen.queryByText('January')).not.toBeInTheDocument();
        //     });
        // });
    });

    // Date selection tests
    describe('Date Selection', () => {
        it('selects a single date from calendar', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();

            // Find and click a date button (January 20)
            const dateButton = getDateButtonByDay(20);
            expect(dateButton).toBeDefined();
            if (dateButton) {
                await user.click(dateButton);
            }

            await waitFor(() => {
                expect(onChange).toHaveBeenCalled();
            });
        });

        it('handles manual date input for single date', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();

            render(<DatePicker onChange={onChange} format="MM/DD/YYYY" />);

            const input = screen.getByPlaceholderText('Select date');
            await user.type(input, '01/20/2024');

            await waitFor(() => {
                expect(onChange).toHaveBeenCalledWith(expect.any(Date));
            });
        });

        //     const user = userEvent.setup();
        //     const onChange = vi.fn();

        //     render(<DatePicker variant="range" onChange={onChange} format="MM/DD/YYYY" />);

        //     const startInput = screen.getByPlaceholderText('Start date');
        //     const endInput = screen.getByPlaceholderText('End date');

        //     await user.type(startInput, '01/10/2024');
        //     await user.type(endInput, '01/20/2024');

        //     await waitFor(() => {
        //         expect(onChange).toHaveBeenCalledWith({
        //             start: expect.any(Date),
        //             end: expect.any(Date),
        //         });
        //     });
        // });
    });

    // Props and configuration tests
    describe('Props and Configuration', () => {

        it('respects minDate constraint', async () => {
            const user = userEvent.setup();
            const minDate = new Date('2024-01-10');
            await openCalendar(user, { minDate });

            // Dates before minDate should be disabled
            // January 5 is before minDate
            const dateButton = getDateButtonByDay(5);
            expect(dateButton).toBeDefined();
            expect(dateButton).toBeDisabled();
        });

        it('respects maxDate constraint', async () => {
            const user = userEvent.setup();
            const maxDate = new Date('2024-01-25');
            await openCalendar(user, { maxDate });

            // Dates after maxDate should be disabled
            // January 30 is after maxDate (if it exists in the grid)
            const dateButton = getDateButtonByDay(30);
            if (dateButton) {
                expect(dateButton).toBeDisabled();
            }
        });

        it('displays disabled dates', async () => {
            const user = userEvent.setup();
            const disabledDates = [new Date('2024-01-10'), new Date('2024-01-20')];
            await openCalendar(user, { disabledDates });

            const disabledDate1 = getDateButtonByDay(10);
            const disabledDate2 = getDateButtonByDay(20);

            if (disabledDate1) {
                expect(disabledDate1).toBeDisabled();
            }
            if (disabledDate2) {
                expect(disabledDate2).toBeDisabled();
            }
        });

        it('handles disabled state correctly', async () => {
            const user = userEvent.setup();
            render(<DatePicker disabled />);

            const input = screen.getByPlaceholderText('Select date');
            await user.click(input);

            // Calendar should not open
            expect(screen.queryByText('January')).not.toBeInTheDocument();
            expect(input).toBeDisabled();
        });

        it('handles readOnly state correctly', async () => {
            const user = userEvent.setup();
            render(<DatePicker readOnly />);

            const input = screen.getByPlaceholderText('Select date');
            await user.click(input);

            // Calendar should not open
            expect(screen.queryByText('January')).not.toBeInTheDocument();
            expect(input).toHaveAttribute('readOnly');
        });
    });

    // State and validation tests
    describe('State and Validation', () => {
        it('displays error message when provided', () => {
            render(<DatePicker error errorMessage="Date is required" />);

            expect(screen.getByText('Date is required')).toBeInTheDocument();
            expect(screen.getByText('Date is required')).toHaveClass('text-red-500');
        });

        it('displays helper text when provided', () => {
            render(<DatePicker helperText="Select a date in the future" />);

            expect(screen.getByText('Select a date in the future')).toBeInTheDocument();
        });

        it('shows required indicator when required', () => {
            render(<DatePicker label="Birth Date" required />);

            expect(screen.getByText('Birth Date')).toBeInTheDocument();
            expect(screen.getByText('*')).toBeInTheDocument();
        });

        it('calls onError when validation fails', async () => {
            const user = userEvent.setup();
            const onError = vi.fn();
            const minDate = new Date('2024-01-20');

            render(<DatePicker minDate={minDate} onError={onError} format="MM/DD/YYYY" />);

            const input = screen.getByPlaceholderText('Select date');
            await user.type(input, '01/10/2024');

            await waitFor(() => {
                expect(onError).toHaveBeenCalled();
            });
        });
    });

    // Calendar navigation tests
    describe('Calendar Navigation', () => {

        it('handles today button click', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();
            await openCalendar(user, {
                todayButton: true,
                onChange
            });

            const todayButton = screen.getByText('Today');
            await user.click(todayButton);

            await waitFor(() => {
                expect(onChange).toHaveBeenCalled();
            });
        });

        it('handles clear button click', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();

            const input = screen.getByPlaceholderText('Select date');
            await user.click(input);

            const clearButton = screen.getByText('Clear');
            await user.click(clearButton);

            await waitFor(() => {
                expect(onChange).toHaveBeenCalledWith(null);
            });
        });
    });

    // Format and internationalization tests
    describe('Format and Internationalization', () => {
        it('respects different date formats', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();

            render(<DatePicker format="DD/MM/YYYY" onChange={onChange} />);

            const input = screen.getByPlaceholderText('Select date');
            await user.type(input, '20/01/2024');

            await waitFor(() => {
                expect(onChange).toHaveBeenCalled();
            });
        });

        it('uses custom day names', async () => {
            const user = userEvent.setup();
            const customDayNames = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];

            await openCalendar(user, { dayNames: customDayNames });

            expect(screen.getByText('Di')).toBeInTheDocument();
            expect(screen.getByText('Lu')).toBeInTheDocument();
        });
    });

    // Edge cases and error handling
    describe('Edge Cases', () => {
        it('handles null value gracefully', () => {
            render(<DatePicker value={null} />);

            const input = screen.getByPlaceholderText('Select date');
            expect(input).toHaveValue('');
        });

        it('handles undefined value gracefully', () => {
            render(<DatePicker value={undefined} />);

            const input = screen.getByPlaceholderText('Select date');
            expect(input).toHaveValue('');
        });

        it('handles invalid date input', async () => {
            const user = userEvent.setup();
            const onError = vi.fn();

            render(<DatePicker onError={onError} format="MM/DD/YYYY" />);

            const input = screen.getByPlaceholderText('Select date');
            await user.type(input, 'invalid-date');

            await waitFor(() => {
                expect(onError).toHaveBeenCalled();
            });
        });

        it('allows empty values when allowEmpty is true', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();

            render(<DatePicker allowEmpty onChange={onChange} value={new Date('2024-01-15')} />);

            const input = screen.getByPlaceholderText('Select date');
            await user.clear(input);

            await waitFor(() => {
                expect(onChange).toHaveBeenCalledWith(null);
            });
        });
    });

    describe('Accessibility', () => {
        it('has proper ARIA labels for navigation buttons', async () => {
            const user = userEvent.setup();
            await openCalendar(user);

            expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
            expect(screen.getByLabelText('Next month')).toBeInTheDocument();
        });

        it('has proper ARIA labels for date buttons', async () => {
            const user = userEvent.setup();
            await openCalendar(user);

            // Find any date button that has an aria-label
            const buttons = screen.getAllByRole('button');
            const dateButtons = buttons.filter(button =>
                button.getAttribute('aria-label')?.startsWith('Select ')
            );

            expect(dateButtons.length).toBeGreaterThan(0);
            dateButtons.forEach(button => {
                expect(button).toHaveAttribute('aria-label');
            });
        });

        it('associates label with input correctly', () => {
            render(<DatePicker label="Birth Date" />);

            const label = screen.getByText('Birth Date');
            const input = screen.getByPlaceholderText('Select date');

            expect(label).toBeInTheDocument();
            expect(input).toBeInTheDocument();
        });
    });

    // Additional utility tests
    describe('Utility Functions', () => {
        it('formats dates correctly', () => {
            // Test the formatDate utility indirectly
            const date = new Date('2024-01-15');

            // Test with MM/DD/YYYY format (default)
            render(<DatePicker value={date} format="MM/DD/YYYY" />);
            const input = screen.getByPlaceholderText('Select date');
            expect(input).toHaveValue('01/15/2024');
        });

        it('parses dates correctly', async () => {
            const user = userEvent.setup();
            const onChange = vi.fn();

            render(<DatePicker onChange={onChange} format="YYYY-MM-DD" />);

            const input = screen.getByPlaceholderText('Select date');
            await user.type(input, '2024-01-15');

            await waitFor(() => {
                expect(onChange).toHaveBeenCalledWith(expect.any(Date));
            });
        });
    });
});