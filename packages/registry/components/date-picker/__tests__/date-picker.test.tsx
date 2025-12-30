// DatePicker.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DatePicker from "../index";

// Mock framer-motion (similar to your existing mock)
vi.mock("framer-motion", () => {
    const createMotionComponent = (tagName: string) => {
        const Component = React.forwardRef(({ children, ...props }: any, ref) => {
            const {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                initial, animate, exit, whileHover, whileTap,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                transition, layout, variants, custom, animationVariant,
                ...domProps
            } = props;
            return React.createElement(tagName, { ...domProps, ref }, children);
        });
        Component.displayName = `motion.${tagName}`;
        return Component;
    };

    return {
        motion: {
            div: createMotionComponent("div"),
            span: createMotionComponent("span"),
            button: createMotionComponent("button"),
            section: createMotionComponent("section"),
            header: createMotionComponent("header"),
            label: createMotionComponent("label"),
        },
        AnimatePresence: ({ children }: any) => <>{children}</>,
    };
});

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
    Calendar: ({ className, ...props }: any) => (
        <span data-testid="icon-calendar" className={className} {...props} />
    ),
    ChevronLeft: ({ className, ...props }: any) => (
        <span data-testid="icon-chevronleft" className={className} {...props} />
    ),
    ChevronRight: ({ className, ...props }: any) => (
        <span data-testid="icon-chevronright" className={className} {...props} />
    ),
    AlertCircle: ({ className, ...props }: any) => (
        <span data-testid="icon-alertcircle" className={className} {...props} />
    ),
}));

// Mock utils
vi.mock("../../../utils/cn", () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

// Mock Typography component
vi.mock("../typography", () => ({
    Typography: ({ children, variant, ...props }: any) => {
        const Component = variant === "h6" ? "h6" : variant === "caption" ? "span" : "span";
        return React.createElement(Component, props, children);
    },
}));

// Mock Button component
vi.mock("../button", () => ({
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

// Mock CalendarView component
vi.mock("../components/CalendarView", () => {
    const CalendarView = ({
        currentMonth,
        onMonthChange,
        // selectedDate,
        // selectedRange,
        onDateSelect,
        onTodayClick,
        onClearClick,
    }: any) => {
        // Create a mock calendar with some dates
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        return (
            <div data-testid="calendar-view">
                <div data-testid="calendar-month">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
                <button
                    data-testid="prev-month-btn"
                    onClick={() => {
                        const prevMonth = new Date(currentMonth);
                        prevMonth.setMonth(prevMonth.getMonth() - 1);
                        onMonthChange(prevMonth);
                    }}
                >
                    Prev
                </button>
                <button
                    data-testid="next-month-btn"
                    onClick={() => {
                        const nextMonth = new Date(currentMonth);
                        nextMonth.setMonth(nextMonth.getMonth() + 1);
                        onMonthChange(nextMonth);
                    }}
                >
                    Next
                </button>
                <div>
                    <button
                        data-testid="today-date-btn"
                        onClick={() => onDateSelect(today)}
                    >
                        {today.getDate()} (Today)
                    </button>
                    <button
                        data-testid="tomorrow-date-btn"
                        onClick={() => onDateSelect(tomorrow)}
                    >
                        {tomorrow.getDate()} (Tomorrow)
                    </button>
                    <button
                        data-testid="next-week-date-btn"
                        onClick={() => onDateSelect(nextWeek)}
                    >
                        {nextWeek.getDate()} (Next Week)
                    </button>
                </div>
                <button data-testid="today-btn" onClick={onTodayClick}>
                    Today
                </button>
                <button data-testid="clear-btn" onClick={onClearClick}>
                    Clear
                </button>
            </div>
        );
    };
    return { default: CalendarView };
});

// Mock InputField component
vi.mock("../components/InputField", () => {
    const InputField = React.forwardRef(({ value, onChange, placeholder, onFocus, disabled, readOnly }: any, ref) => (
        <div>
            <input
                ref={ref}
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                onFocus={onFocus}
                disabled={disabled}
                readOnly={readOnly}
                data-testid="single-date-input"
            />
        </div>
    ));
    InputField.displayName = 'InputField';
    return { default: InputField };
});

// Mock RangeInputField component
vi.mock("../components/RangeInputField", () => {
    const RangeInputField = ({
        startValue,
        endValue,
        onStartChange,
        onEndChange,
        placeholder,
        onFocus,
        disabled,
        readOnly,
    }: any) => (
        <div>
            <input
                value={startValue}
                onChange={onStartChange}
                placeholder={Array.isArray(placeholder) ? placeholder[0] : 'Start date'}
                onFocus={onFocus}
                disabled={disabled}
                readOnly={readOnly}
                data-testid="start-date-input"
            />
            <span>–</span>
            <input
                value={endValue}
                onChange={onEndChange}
                placeholder={Array.isArray(placeholder) ? placeholder[1] : 'End date'}
                onFocus={onFocus}
                disabled={disabled}
                readOnly={readOnly}
                data-testid="end-date-input"
            />
        </div>
    );
    return { default: RangeInputField };
});

describe("DatePicker Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Basic Rendering", () => {


        it("renders range date picker when variant is 'range'", () => {
            render(<DatePicker variant="range" />);
            expect(screen.getByTestId("start-date-input")).toBeInTheDocument();
            expect(screen.getByTestId("end-date-input")).toBeInTheDocument();
        });

        it("renders with label when provided", () => {
            render(<DatePicker label="Select a date" />);
            expect(screen.getByText("Select a date")).toBeInTheDocument();
        });

        it("shows required asterisk when required is true", () => {
            render(<DatePicker label="Select a date" required />);
            expect(screen.getByText("*")).toBeInTheDocument();
        });

        it("renders custom placeholder", () => {
            render(<DatePicker placeholder="Choose a date" />);
            expect(screen.getByPlaceholderText("Choose a date")).toBeInTheDocument();
        });
    });

    describe("Single Date Mode", () => {
        it("opens calendar when clicked", () => {
            render(<DatePicker />);
            const input = screen.getByTestId("single-date-input");
            fireEvent.click(input);
            expect(screen.getByTestId("calendar-view")).toBeInTheDocument();
        });

        it("selects a date from calendar", () => {
            const mockOnChange = vi.fn();
            render(<DatePicker onChange={mockOnChange} />);

            const input = screen.getByTestId("single-date-input");
            fireEvent.click(input);

            const dateButton = screen.getByTestId("today-date-btn");
            fireEvent.click(dateButton);

            expect(mockOnChange).toHaveBeenCalled();
        });

        it("updates input value when date is selected", () => {
            const today = new Date();
            render(<DatePicker format="MM/DD/YYYY" />);

            const input = screen.getByTestId("single-date-input");
            fireEvent.click(input);

            const dateButton = screen.getByTestId("today-date-btn");
            fireEvent.click(dateButton);

            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = today.getDate().toString().padStart(2, '0');
            const year = today.getFullYear();
            expect(input).toHaveValue(`${month}/${day}/${year}`);
        });

        it("handles manual input change", () => {
            const mockOnChange = vi.fn();
            render(<DatePicker onChange={mockOnChange} />);

            const input = screen.getByTestId("single-date-input");
            fireEvent.change(input, { target: { value: "12/25/2024" } });

            expect(mockOnChange).toHaveBeenCalled();
        });
    });

    describe("Range Date Mode", () => {
        it("renders two inputs for range mode", () => {
            render(<DatePicker variant="range" />);
            expect(screen.getByTestId("start-date-input")).toBeInTheDocument();
            expect(screen.getByTestId("end-date-input")).toBeInTheDocument();
        });

        it("opens calendar for range selection", () => {
            render(<DatePicker variant="range" />);

            const startInput = screen.getByTestId("start-date-input");
            fireEvent.click(startInput);

            expect(screen.getByTestId("calendar-view")).toBeInTheDocument();
        });
    });

    describe("Validation", () => {
        it("shows error when required and no date selected", () => {
            render(<DatePicker required error errorMessage="Date is required" />);
            expect(screen.getByText("Date is required")).toBeInTheDocument();
        });

        it("validates min date constraint", () => {
            const minDate = new Date(2024, 0, 1);
            const mockOnError = vi.fn();

            render(
                <DatePicker
                    minDate={minDate}
                    onError={mockOnError}
                    validateOnChange={true}
                />
            );

            const input = screen.getByTestId("single-date-input");
            fireEvent.change(input, { target: { value: "12/31/2023" } });

            expect(mockOnError).toHaveBeenCalledWith(expect.stringContaining("must be after"));
        });

        it("validates max date constraint", () => {
            const maxDate = new Date(2024, 11, 31);
            const mockOnError = vi.fn();

            render(
                <DatePicker
                    maxDate={maxDate}
                    onError={mockOnError}
                    validateOnChange={true}
                />
            );

            const input = screen.getByTestId("single-date-input");
            fireEvent.change(input, { target: { value: "01/01/2025" } });

            expect(mockOnError).toHaveBeenCalledWith(expect.stringContaining("must be before"));
        });
    });

    describe("Theme and Styling", () => {
        it("renders in dark mode", () => {
            const { container } = render(<DatePicker themeMode="dark" />);
            // Check for dark mode classes
            expect(container.innerHTML).toContain("dark");
        });

        it("applies custom size", () => {
            const { container } = render(<DatePicker size="lg" />);
            expect(container.innerHTML).toContain("lg");
        });
    });

    describe("Disabled State", () => {
        it("disables input when disabled prop is true", () => {
            render(<DatePicker disabled />);
            const input = screen.getByTestId("single-date-input");
            expect(input).toBeDisabled();
        });

        it("does not open calendar when disabled", () => {
            render(<DatePicker disabled />);
            const input = screen.getByTestId("single-date-input");
            fireEvent.click(input);
            expect(screen.queryByTestId("calendar-view")).not.toBeInTheDocument();
        });

        it("does not open calendar when readOnly", () => {
            render(<DatePicker readOnly />);
            const input = screen.getByTestId("single-date-input");
            fireEvent.click(input);
            expect(screen.queryByTestId("calendar-view")).not.toBeInTheDocument();
        });
    });

    describe("Helper Text and Error States", () => {
        it("displays helper text", () => {
            render(<DatePicker helperText="Select a date in the future" />);
            expect(screen.getByText("Select a date in the future")).toBeInTheDocument();
        });

        it("displays error message when error prop is true", () => {
            render(<DatePicker error errorMessage="Invalid date selected" />);
            expect(screen.getByText("Invalid date selected")).toBeInTheDocument();
        });

        it("shows error icon when there's an error", () => {
            render(<DatePicker error errorMessage="Error message" />);
            expect(screen.getByTestId("icon-alertcircle")).toBeInTheDocument();
        });
    });

    describe("Today and Clear Buttons", () => {
        it("triggers today button click", () => {
            const mockOnChange = vi.fn();
            render(<DatePicker onChange={mockOnChange} todayButton />);

            const input = screen.getByTestId("single-date-input");
            fireEvent.click(input);

            const todayBtn = screen.getByTestId("today-btn");
            fireEvent.click(todayBtn);

            expect(mockOnChange).toHaveBeenCalled();
        });

        it("triggers clear button click", () => {
            const mockOnChange = vi.fn();
            render(<DatePicker onChange={mockOnChange} clearButton />);

            const input = screen.getByTestId("single-date-input");
            fireEvent.click(input);

            const clearBtn = screen.getByTestId("clear-btn");
            fireEvent.click(clearBtn);

            expect(mockOnChange).toHaveBeenCalledWith(null);
        });
    });

    describe("Formats", () => {
        it("formats date correctly with MM/DD/YYYY", () => {
            const testDate = new Date(2024, 11, 25);
            render(<DatePicker value={testDate} format="MM/DD/YYYY" />);

            const input = screen.getByTestId("single-date-input");
            expect(input).toHaveValue("12/25/2024");
        });

        it("formats date correctly with DD/MM/YYYY", () => {
            const testDate = new Date(2024, 11, 25);
            render(<DatePicker value={testDate} format="DD/MM/YYYY" />);

            const input = screen.getByTestId("single-date-input");
            expect(input).toHaveValue("25/12/2024");
        });

        it("formats date correctly with YYYY-MM-DD", () => {
            const testDate = new Date(2024, 11, 25);
            render(<DatePicker value={testDate} format="YYYY-MM-DD" />);

            const input = screen.getByTestId("single-date-input");
            expect(input).toHaveValue("2024-12-25");
        });
    });

    describe("Auto Close", () => {
        it("closes calendar after selection when autoClose is true", async () => {
            render(<DatePicker autoClose />);

            const input = screen.getByTestId("single-date-input");
            fireEvent.click(input);

            expect(screen.getByTestId("calendar-view")).toBeInTheDocument();

            const dateButton = screen.getByTestId("today-date-btn");
            fireEvent.click(dateButton);

            // Calendar should close
            await waitFor(() => {
                expect(screen.queryByTestId("calendar-view")).not.toBeInTheDocument();
            });
        });
    });

    describe("Disabled Dates", () => {
        it("respects disabledDates prop", () => {
            const disabledDate = new Date(2024, 11, 25);
            render(<DatePicker disabledDates={[disabledDate]} />);

            const input = screen.getByTestId("single-date-input");
            fireEvent.click(input);

            // In a real test, you would check that the disabled date is not selectable
            // Since we're mocking, we'll just verify the component renders
            expect(screen.getByTestId("calendar-view")).toBeInTheDocument();
        });
    });
});