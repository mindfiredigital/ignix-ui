import React, { useState } from 'react';
import { DatePicker, type DateRange } from '@site/src/components/UI/date-picker';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Button } from '@site/src/components/UI/button'
import { Typography } from '@site/src/components/UI/typography';
import { useColorMode } from '@docusaurus/theme-common';


// Component for individual demos
const DemoSection = ({ title, description, children, code }: {
    title: string;
    description: string;
    children: React.ReactNode;
    code?: string
}) => (
    <div className="space-y-4 mb-8">
        <div>
            <Typography variant="h4" weight="semibold">{title}</Typography>
            <Typography variant="body-small" color='muted'>{description}</Typography>
        </div>
        <Tabs>
            <TabItem value="preview" label="Preview">
                <div className="p-6 border rounded-lg mt-2 flex items-center justify-center">
                    {children}
                </div>
            </TabItem>
            {code && (
                <TabItem value="code" label="Code">
                    <CodeBlock language="tsx" className="text-sm">
                        {code}
                    </CodeBlock>
                </TabItem>
            )}
        </Tabs>
    </div>
);

const sizeOptions = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra Large' },
];

const colorSchemeOptions = [
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'purple', label: 'Purple' },
    { value: 'orange', label: 'Orange' },
    { value: 'slate', label: 'Slate' },
    { value: 'rose', label: 'Rose' },
];

const popupPositionOptions = [
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
];

// Demo 1: Basic Single Date Picker
export const BasicDatePickerDemo = () => {
    const { colorMode } = useColorMode();
    const [date, setDate] = useState<Date | null>(null);
    // Handler for single date picker
    const handleSingleDateChange = (date: Date | DateRange | null): void => {
        setDate(date as Date | null);
    };

    const codeString = `
import { DatePicker } from '@ignix-ui/datepicker';

function MyComponent() {
  const [date, setDate] = useState<Date | null>(null);
  const handleDateChange = (date: Date | null) => {
        setDate(date);
  };
  return (
    <DatePicker
      value={date || undefined}
      onChange={handleDateChange}
      placeholder="Select a date"
      label="Appointment Date"
      helperText="Choose your appointment date"
    />
  );
}
`;

    return (
        <DemoSection
            title=""
            description=""
            code={codeString}
        >
            <div className="max-w-md">
                <DatePicker
                    value={date || undefined}
                    onChange={handleSingleDateChange}
                    placeholder="Select a date"
                    label="Appointment Date"
                    helperText="Choose your appointment date"
                    themeMode={colorMode as 'light' | 'dark'}
                />
                {date && (
                    <div className="mt-4 p-3 border border-border/60 bg-muted/20 rounded-xl">
                        <Typography variant="body-small" color="muted">
                            Selected: {date.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Typography>
                    </div>
                )}
            </div>
        </DemoSection>
    );
};

// Demo 2: Range Date Selector
export const RangeDatePickerDemo = () => {
    const { colorMode } = useColorMode();
    const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
        start: null,
        end: null
    });

    // Handler for range date picker
    const handleRangeDateChange = (range: Date | DateRange | null): void => {
        setRange(range as DateRange);
    };

    const codeString = `
import { DatePicker } from '@ignix-ui/datepicker';

function MyComponent() {
  const [range, setRange] = useState({ start: null, end: null });
  // Handler for range date picker
  const handleRangeDateChange = (range: { start: Date | null; end: Date | null }) => {
      setRange(range);
  };

  return (
    <DatePicker
      variant="range"
      value={range}
      onChange={handleRangeDateChange}
      placeholder={['Start date', 'End date']}
      label="Select Date Range"
      helperText="Choose start and end dates"
      todayButton
      clearButton
    />
  );
}
`;

    return (
        <DemoSection
            title=""
            description=""
            code={codeString}
        >
            <div className="max-w-md">
                <DatePicker
                    themeMode={colorMode as 'light' | 'dark'}
                    variant="range"
                    value={range}
                    onChange={handleRangeDateChange}
                    placeholder={['Start date', 'End date']}
                    label="Select Date Range"
                    helperText="Choose start and end dates"
                    todayButton
                    clearButton
                />
                {range.start && range.end && (
                    <div className="mt-4 p-3 border border-border/60 bg-muted/20 rounded-xl">
                        <Typography variant="body-small" color="muted">
                            Selected: {range.start.toLocaleDateString()} – {range.end.toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="muted" className="block mt-1">
                            Duration: {Math.ceil((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24))} days
                        </Typography>
                    </div>
                )}
            </div>
        </DemoSection>
    );
};

// Demo 3: Different Sizes
export const SizeVariantsDemo = () => {
    const { colorMode } = useColorMode();
    const [dates, setDates] = useState({
        sm: null as Date | null,
        md: null as Date | null,
        lg: null as Date | null,
        xl: null as Date | null,
    });

    const codeString = `
// All available sizes
<DatePicker size="sm" placeholder="Small picker" />
<DatePicker size="md" placeholder="Medium picker" />
<DatePicker size="lg" placeholder="Large picker" />
<DatePicker size="xl" placeholder="Extra large picker" />
`;

    return (
        <DemoSection
            title=""
            description=""
            code={codeString}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                <DatePicker
                    themeMode={colorMode as 'light' | 'dark'}
                    size="sm"
                    label="Small"
                    placeholder="Small date picker"
                    value={dates.sm || undefined}
                    onChange={(date) => setDates(prev => ({ ...prev, sm: date as Date | null }))}
                />
                <DatePicker
                    themeMode={colorMode as 'light' | 'dark'}
                    size="md"
                    label="Medium (Default)"
                    placeholder="Medium date picker"
                    value={dates.md || undefined}
                    onChange={(date) => setDates(prev => ({ ...prev, md: date as Date | null }))}
                />
                <DatePicker
                    themeMode={colorMode as 'light' | 'dark'}
                    size="lg"
                    label="Large"
                    placeholder="Large date picker"
                    value={dates.lg || undefined}
                    onChange={(date) => setDates(prev => ({ ...prev, lg: date as Date | null }))}
                />
                <DatePicker
                    themeMode={colorMode as 'light' | 'dark'}
                    size="xl"
                    label="Extra Large"
                    placeholder="Extra large date picker"
                    value={dates.xl || undefined}
                    onChange={(date) => setDates(prev => ({ ...prev, xl: date as Date | null }))}
                />
            </div>
        </DemoSection>
    );
};

// Demo 4: Color Schemes
export const ColorSchemesDemo = () => {
    const { colorMode } = useColorMode();

    const codeString = `
// Different color schemes
<DatePicker colorScheme="blue" placeholder="Blue theme" />
<DatePicker colorScheme="green" placeholder="Green theme" />
<DatePicker colorScheme="purple" placeholder="Purple theme" />
<DatePicker colorScheme="orange" placeholder="Orange theme" />
<DatePicker colorScheme="slate" placeholder="Slate theme" />
<DatePicker colorScheme="rose" placeholder="Rose theme" />
`;

    return (
        <DemoSection
            title=""
            description=""
            code={codeString}
        >
            <div className="space-y-4 max-w-4xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 w-full">
                    {colorSchemeOptions.map((color) => (
                        <DatePicker
                            key={color.value}
                            themeMode={colorMode as 'light' | 'dark'}
                            colorScheme={color.value as any}
                            label={color.label}
                            placeholder={`${color.label} theme`}
                            size="sm"
                        />
                    ))}
                </div>
            </div>
        </DemoSection>
    );
};

// Demo 5: Popup Positions
export const PopupPositionsDemo = () => {
    const { colorMode } = useColorMode();
    const [selectedPositions, setSelectedPositions] = useState<Record<string, Date | null>>({});

    const codeString = `
// Different popup positions
<DatePicker popupPosition="bottom-left" placeholder="Bottom Left" />
<DatePicker popupPosition="bottom-right" placeholder="Bottom Right" />
<DatePicker popupPosition="top-left" placeholder="Top Left" />
<DatePicker popupPosition="top-right" placeholder="Top Right" />
<DatePicker popupPosition="left" placeholder="Left Side" />
<DatePicker popupPosition="right" placeholder="Right Side" />
`;

    return (
        <DemoSection
            title=""
            description=""
            code={codeString}
        >
            <div className="space-y-6 max-w-4xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                    {popupPositionOptions.map((position) => (
                        <DatePicker
                            key={position.value}
                            themeMode={colorMode as 'light' | 'dark'}
                            popupPosition={position.value as any}
                            label={position.label}
                            placeholder={position.label}
                            size="sm"
                            value={selectedPositions[position.value] || undefined}
                            onChange={(date) => setSelectedPositions(prev => ({
                                ...prev,
                                [position.value]: date as Date | null
                            }))}
                        />
                    ))}
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <Typography variant="body-small" className="text-amber-800 dark:text-amber-300">
                        Tip: The popup position automatically adjusts on small screens to ensure calendar visibility
                    </Typography>
                </div>
            </div>
        </DemoSection>
    );
};

// Demo 6: Hotel Booking Example - FIXED
export const HotelBookingDemo = () => {
    const { colorMode } = useColorMode();
    const [booking, setBooking] = useState({
        start: null as Date | null,
        end: null as Date | null,
    });

    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 3);

    // Disable weekends and create some disabled dates
    const disabledDates = Array.from({ length: 90 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        // Disable weekends
        if (date.getDay() === 0 || date.getDay() === 6) {
            return date;
        }
        // Randomly disable some weekdays for demo
        if (Math.random() < 0.1) {
            return date;
        }
        return null;
    }).filter(Boolean) as Date[];

    // Handler for booking date range change
    const handleBookingChange = (newRange: Date | DateRange | null) => {
        const range = newRange as DateRange;
        setBooking({
            start: range.start,
            end: range.end
        });
    };

    const codeString = `
function HotelBooking() {
  const [bookingRange, setBookingRange] = useState({ start: null, end: null });
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 3);

  // Disable weekends
  const disabledDates = Array.from({ length: 90 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date.getDay() === 0 || date.getDay() === 6 ? date : null;
  }).filter(Boolean);

  const handleBookingChange = (newRange: { start: Date | null; end: Date | null }) => {
    setBooking({
      start: newRange.start,
      end: newRange.end
    });
  };

  return (
    <DatePicker
      variant="range"
      value={bookingRange}
      onChange={handleBookingChange}
      placeholder={['Check-in date', 'Check-out date']}
      label="Hotel Booking"
      helperText="Select your stay dates (weekends disabled)"
      minDate={today}
      maxDate={nextMonth}
      disabledDates={disabledDates}
      required
      size="lg"
      colorScheme="blue"
      todayButton
      clearButton
      format="MM/DD/YYYY"
    />
  );
}
`;

    return (
        <DemoSection
            title=""
            description=""
            code={codeString}
        >
            <div className="space-y-6 max-w-2xl">
                <DatePicker
                    themeMode={colorMode as 'light' | 'dark'}
                    variant="range"
                    value={booking}
                    onChange={handleBookingChange}
                    placeholder={['Check-in date', 'Check-out date']}
                    label="Select Your Stay"
                    helperText="Choose check-in and check-out dates (weekends are unavailable)"
                    minDate={today}
                    maxDate={nextMonth}
                    disabledDates={disabledDates}
                    required
                    size="lg"
                    colorScheme="blue"
                    todayButton
                    clearButton
                    format="MM/DD/YYYY"
                />

                {booking.start && booking.end && (
                    <div className="p-4 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Typography variant="h6" weight="semibold" className="text-green-800 dark:text-green-300 mb-2">
                            Booking Summary
                        </Typography>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Typography variant="caption" className="text-gray-500 dark:text-gray-400">Check-in</Typography>
                                <Typography variant="body" className="font-medium">
                                    {booking.start.toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="caption" className="text-gray-500 dark:text-gray-400">Check-out</Typography>
                                <Typography variant="body" className="font-medium">
                                    {booking.end.toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </Typography>
                            </div>
                            <div className="col-span-2">
                                <Typography variant="caption" className="text-gray-500 dark:text-gray-400">Total Nights</Typography>
                                <Typography variant="body" weight="bold" className="text-green-600 dark:text-green-400">
                                    {Math.ceil((booking.end.getTime() - booking.start.getTime()) / (1000 * 60 * 60 * 24))} nights
                                </Typography>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DemoSection>
    );
};

// Demo 8: Validation Examples
export const ValidationExamplesDemo = () => {
    const { colorMode } = useColorMode();
    const [dates, setDates] = useState({
        required: null as Date | null,
        minMax: null as Date | null,
        disabled: null as Date | null,
        error: null as Date | null,
    });

    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const disabledDates = [
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
    ];

    return (
        <DemoSection
            title=""
            description=""
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                <DatePicker
                    themeMode={colorMode as 'light' | 'dark'}
                    required
                    placeholder="Select a date (required)"
                    value={dates.required || undefined}
                    onChange={(date) => setDates(prev => ({ ...prev, required: date as Date | null }))}
                    helperText="This field must be filled"
                    colorScheme="blue"
                    label="Required Field"
                />

                <DatePicker
                    themeMode={colorMode as 'light' | 'dark'}
                    minDate={today}
                    maxDate={nextWeek}
                    placeholder="Select date within next week"
                    value={dates.minMax || undefined}
                    onChange={(date) => setDates(prev => ({ ...prev, minMax: date as Date | null }))}
                    helperText={`Dates between ${today.toLocaleDateString()} and ${nextWeek.toLocaleDateString()}`}
                    colorScheme="green"
                    label="Min/Max Date Constraints"
                />

                <DatePicker
                    themeMode={colorMode as 'light' | 'dark'}
                    disabledDates={disabledDates}
                    placeholder="Select date (some dates disabled)"
                    value={dates.disabled || undefined}
                    onChange={(date) => setDates(prev => ({ ...prev, disabled: date as Date | null }))}
                    helperText="2nd and 4th from today are unavailable"
                    colorScheme="orange"
                    label="Disabled Dates"
                />

                <DatePicker
                    themeMode={colorMode as 'light' | 'dark'}
                    error
                    errorMessage="Invalid date selected"
                    placeholder="This field has an error"
                    value={dates.error || undefined}
                    onChange={(date) => setDates(prev => ({ ...prev, error: date as Date | null }))}
                    helperText="Showing error state"
                    colorScheme="rose"
                    label="Error State"
                />
            </div>
        </DemoSection>
    );
};

// Demo 9: Interactive Playground - FIXED
export const DatePickerPlayground = () => {
    const [config, setConfig] = useState<PlaygroundConfig>({
        variant: 'single',
        size: 'md',
        colorScheme: 'blue',
        popupPosition: 'bottom-left',
        showIcon: true,
        todayButton: true,
        clearButton: true,
        required: false,
        disabled: false,
    });

    const [date, setDate] = useState<Date | null>(null);
    const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
        start: null,
        end: null
    });

    const handleConfigChange = <K extends keyof PlaygroundConfig>(
        key: K,
        value: PlaygroundConfig[K]
    ): void => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    // Handler for single date picker
    const handleSingleDateChange = (date: Date | null): void => {
        setDate(date);
    };

    // Handler for range date picker
    const handleRangeDateChange = (range: { start: Date | null; end: Date | null }): void => {
        setRange(range);
    };

    return (
        <DemoSection
            title=""
            description=""
        >
            <div className="space-y-8 max-w-4xl">
                {/* Controls */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 rounded-2xl border-border/60 ">
                    <div className="space-y-2">
                        <Typography variant="caption" weight="bold" color="muted" className='pb-1'>Variant</Typography>
                        <select
                            value={config.variant}
                            onChange={(e) => handleConfigChange('variant', e.target.value as 'single' | 'range')}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-border/60 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 cursor-pointer"
                        >
                            <option value="single">Single Date</option>
                            <option value="range">Date Range</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Typography variant="caption" weight="bold" color="muted" className='pb-1'>Size</Typography>
                        <select
                            value={config.size}
                            onChange={(e) => handleConfigChange('size', e.target.value as 'sm' | 'md' | 'lg' | 'xl')}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-border/60 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 cursor-pointer"
                        >
                            {sizeOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Typography variant="caption" weight="bold" color="muted" className='pb-1'>Color Scheme</Typography>
                        <select
                            value={config.colorScheme}
                            onChange={(e) => handleConfigChange('colorScheme', e.target.value as 'blue' | 'green' | 'purple' | 'orange' | 'slate' | 'rose')}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-border/60 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 cursor-pointer"
                        >
                            {colorSchemeOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Typography variant="caption" weight="bold" color="muted" className='pb-1'>Popup Position</Typography>
                        <select
                            value={config.popupPosition}
                            onChange={(e) => handleConfigChange('popupPosition', e.target.value as 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'left' | 'right')}
                            className="w-full px-3 py-2 text-sm rounded-xl border border-border/60 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 cursor-pointer"
                        >
                            {popupPositionOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            id="showIcon"
                            checked={config.showIcon}
                            onChange={(e) => handleConfigChange('showIcon', e.target.checked)}
                            className="rounded border-border/60 text-primary focus:ring-ring cursor-pointer h-4 w-4 bg-background"
                        />
                        <label htmlFor="showIcon" className="text-sm text-muted-foreground cursor-pointer font-medium select-none">Show Icon</label>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            id="todayButton"
                            checked={config.todayButton}
                            onChange={(e) => handleConfigChange('todayButton', e.target.checked)}
                            className="rounded border-border/60 text-primary focus:ring-ring cursor-pointer h-4 w-4 bg-background"
                        />
                        <label htmlFor="todayButton" className="text-sm text-muted-foreground cursor-pointer font-medium select-none">Today Button</label>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            id="clearButton"
                            checked={config.clearButton}
                            onChange={(e) => handleConfigChange('clearButton', e.target.checked)}
                            className="rounded border-border/60 text-primary focus:ring-ring cursor-pointer h-4 w-4 bg-background"
                        />
                        <label htmlFor="clearButton" className="text-sm text-muted-foreground cursor-pointer font-medium select-none">Clear Button</label>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            id="required"
                            checked={config.required}
                            onChange={(e) => handleConfigChange('required', e.target.checked)}
                            className="rounded border-border/60 text-primary focus:ring-ring cursor-pointer h-4 w-4 bg-background"
                        />
                        <label htmlFor="required" className="text-sm text-muted-foreground cursor-pointer font-medium select-none">Required</label>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="disabled"
                            checked={config.disabled}
                            onChange={(e) => handleConfigChange('disabled', e.target.checked)}
                            className="rounded border-border/60 text-primary focus:ring-ring cursor-pointer h-4 w-4 bg-background"
                        />
                        <label htmlFor="disabled" className="text-sm text-muted-foreground cursor-pointer font-medium select-none">Disabled</label>
                    </div>
                </div>

                {/* Preview */}
                <div className="max-w-md mx-auto">
                    <DatePicker
                        variant={config.variant}
                        size={config.size}
                        colorScheme={config.colorScheme as any}
                        popupPosition={config.popupPosition as any}
                        showIcon={config.showIcon}
                        todayButton={config.todayButton}
                        clearButton={config.clearButton}
                        required={config.required}
                        disabled={config.disabled}
                        label={`${config.variant === 'single' ? 'Select Date' : 'Select Date Range'}`}
                        placeholder={config.variant === 'single' ? 'Choose a date' : ['Start date', 'End date']}
                        helperText="Interactive playground - customize using controls above"
                        value={config.variant === 'single' ? date || undefined : range}
                        onChange={config.variant === 'single' ? handleSingleDateChange : handleRangeDateChange}
                    />
                </div>
            </div>
        </DemoSection>
    );
};

type PlaygroundConfig = {
    variant: 'single' | 'range';
    size: 'sm' | 'md' | 'lg' | 'xl';
    colorScheme: string;
    popupPosition: string;
    showIcon: boolean;
    todayButton: boolean;
    clearButton: boolean;
    required: boolean;
    disabled: boolean;
};

export const ControlledDatePickerDemo = () => {
    const { colorMode } = useColorMode();
    const [singleDate, setSingleDate] = useState<Date | null>(null);
    const [rangeDate, setRangeDate] = useState<{ start: Date | null; end: Date | null }>({
        start: null,
        end: null
    });

    // Handler for single date picker
    const handleSingleDateChange = (date: Date | null) => {
        setSingleDate(date);
    };

    // Handler for range date picker
    const handleRangeDateChange = (range: { start: Date | null; end: Date | null }) => {
        setRangeDate(range);
    };

    const singleCodeString = `import { useState } from 'react';
import { DatePicker } from '@ignix-ui/datepicker';

function SingleDateExample() {
  const [date, setDate] = useState<Date | null>(null);

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate || null);
  };

  return (
    <DatePicker
      value={date || undefined}
      onChange={handleDateChange}
      placeholder="Select a date"
      label="Appointment Date"
      helperText="Choose your appointment date"
    />
  );
}`;


    const rangeCodeString = `import { useState } from 'react';
import { DatePicker } from '@ignix-ui/datepicker';

function RangeDateExample() {
  const [range, setRange] = useState({ 
    start: null, 
    end: null 
  });

  const handleRangeChange = (selectedRange: { start: Date | null; end: Date | null }) => {
    setRange(selectedRange);
  };

  return (
    <DatePicker
      variant="range"
      value={range}
      onChange={handleRangeChange}
      placeholder={['Start date', 'End date']}
      label="Select Date Range"
      helperText="Choose start and end dates"
    />
  );
}`;

    return (
        <div className="space-y-8">
            <DemoSection
                title="Single Date Picker"
                description=""
                code={singleCodeString}
            >
                <div className="max-w-md space-y-4">
                    <DatePicker
                        value={singleDate || undefined}
                        onChange={handleSingleDateChange}
                        placeholder="Select a date"
                        label="Single Date Picker"
                        helperText="Date is controlled by React state"
                        themeMode={colorMode as 'light' | 'dark'}
                    />
                    <div className="flex items-center justify-between">
                        <Typography variant="body-small">
                            Selected: {singleDate ? singleDate.toLocaleDateString() : 'No date selected'}
                        </Typography>
                        <Button
                            size="sm"
                            onClick={() => setSingleDate(null)}
                            variant="ghost"
                        >
                            Clear
                        </Button>
                    </div>
                </div>
            </DemoSection>

            <DemoSection
                title="Range Date Picker"
                description=""
                code={rangeCodeString}
            >
                <div className="max-w-md space-y-4">
                    <DatePicker
                        variant="range"
                        value={rangeDate}
                        onChange={handleRangeDateChange}
                        placeholder={['Start date', 'End date']}
                        label="Range Date Picker"
                        helperText="Range is controlled by React state"
                        themeMode={colorMode as 'light' | 'dark'}
                    />
                    <div className="space-y-2">
                        <Typography variant="body-small">
                            Selected Range:
                        </Typography>
                        <Typography variant="caption" className="block pb-1">
                            Start: {rangeDate.start ? rangeDate.start.toLocaleDateString() : 'Not selected'}
                        </Typography>
                        <Typography variant="caption" className="block">
                            End: {rangeDate.end ? rangeDate.end.toLocaleDateString() : 'Not selected'}
                        </Typography>
                    </div>
                </div>
            </DemoSection>
        </div>
    );
};