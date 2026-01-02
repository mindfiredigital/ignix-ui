import React, { useState } from 'react';
import DatePicker from '@site/src/components/UI/date-picker';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Button } from '@site/src/components/UI/button';
import { Moon, Sun } from 'lucide-react';
import { Typography } from '@site/src/components/UI/typography';

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
            <Typography variant="body-small" color="muted">{description}</Typography>
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
    const [date, setDate] = useState<Date | null>(null);
    // Handler for single date picker
    const handleSingleDateChange = (date: Date | null) => {
        setDate(date);
    };

    const codeString = `
import { DatePicker } from '@mindfiredigital/ignix-ui';

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
            <div className="max-w-lg">
                <DatePicker
                    value={date || undefined}
                    onChange={handleSingleDateChange}
                    placeholder="Select a date"
                    label="Appointment Date"
                    helperText="Choose your appointment date"
                    themeMode='dark'
                />
                {date && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <Typography variant="body-small">
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
    const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
        start: null,
        end: null
    });

    // Handler for range date picker
    const handleRangeDateChange = (range: { start: Date | null; end: Date | null }) => {
        setRange(range);
    };

    const codeString = `
import { DatePicker } from '@mindfiredigital/ignix-ui';

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
                    themeMode='dark'
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
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded">
                        <Typography variant="body-small">
                            Selected: {range.start.toLocaleDateString()} – {range.end.toLocaleDateString()}
                            <br />
                            <Typography variant="caption" className="text-green-600 dark:text-green-400">
                                Duration: {Math.ceil((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24))} days
                            </Typography>
                        </Typography>
                    </div>
                )}
            </div>
        </DemoSection>
    );
};

// Demo 3: Different Sizes
export const SizeVariantsDemo = () => {
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
            <div className="space-y-6 max-w-2xl">
                <div className="space-y-2">
                    <Typography variant="label" className="text-gray-700 dark:text-gray-300">Small</Typography>
                    <DatePicker
                        themeMode='dark'
                        size="sm"
                        placeholder="Small date picker"
                        value={dates.sm || undefined}
                        onChange={(date) => setDates(prev => ({ ...prev, sm: date as Date }))}
                    />
                </div>
                <div className="space-y-2">
                    <Typography variant="label" className="text-gray-700 dark:text-gray-300">Medium (Default)</Typography>
                    <DatePicker
                        themeMode='dark'
                        size="md"
                        placeholder="Medium date picker"
                        value={dates.md || undefined}
                        onChange={(date) => setDates(prev => ({ ...prev, md: date as Date }))}
                    />
                </div>
                <div className="space-y-2">
                    <Typography variant="label" className="text-gray-700 dark:text-gray-300">Large</Typography>
                    <DatePicker
                        themeMode='dark'
                        size="lg"
                        placeholder="Large date picker"
                        value={dates.lg || undefined}
                        onChange={(date) => setDates(prev => ({ ...prev, lg: date as Date }))}
                    />
                </div>
                <div className="space-y-2">
                    <Typography variant="label" className="text-gray-700 dark:text-gray-300">Extra Large</Typography>
                    <DatePicker
                        themeMode='dark'
                        size="xl"
                        placeholder="Extra large date picker"
                        value={dates.xl || undefined}
                        onChange={(date) => setDates(prev => ({ ...prev, xl: date as Date }))}
                    />
                </div>
            </div>
        </DemoSection>
    );
};

// Demo 4: Color Schemes
export const ColorSchemesDemo = () => {
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');

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
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <Typography variant="body" weight="medium">Theme Mode</Typography>
                    <Button
                        onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </Button>
                </div>

                <div className={`grid grid-cols-2 gap-4 p-4 rounded-lg ${themeMode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    {colorSchemeOptions.map((color) => (
                        <div key={color.value} className="space-y-2">
                            <Typography variant="label" className={themeMode === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                                {color.label}
                            </Typography>
                            <DatePicker
                                themeMode={themeMode}
                                colorScheme={color.value as any}
                                placeholder={`${color.label} theme`}
                                size="sm"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </DemoSection>
    );
};

// Demo 5: Popup Positions
export const PopupPositionsDemo = () => {
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
            <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                    {popupPositionOptions.map((position) => (
                        <div key={position.value} className="space-y-2">
                            <Typography variant="label" className="text-gray-700 dark:text-gray-300">
                                {position.label}
                            </Typography>
                            <DatePicker
                                themeMode='dark'
                                popupPosition={position.value as any}
                                placeholder={position.label}
                                size="sm"
                                value={selectedPositions[position.value] || undefined}
                                onChange={(date) => setSelectedPositions(prev => ({
                                    ...prev,
                                    [position.value]: date as Date
                                }))}
                            />
                        </div>
                    ))}
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <Typography variant="body-small" className="text-amber-800 dark:text-amber-300">
                        💡 Tip: The popup position automatically adjusts on small screens to ensure calendar visibility
                    </Typography>
                </div>
            </div>
        </DemoSection>
    );
};

// Demo 6: Hotel Booking Example
export const HotelBookingDemo = () => {
    const [booking, setBooking] = useState({
        checkIn: null as Date | null,
        checkOut: null as Date | null,
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
    }).filter(Boolean);

    // Handler for booking date range change
    const handleBookingChange = (newRange: { start: Date | null; end: Date | null }) => {
        setBooking({
            checkIn: newRange.start,
            checkOut: newRange.end
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
      checkIn: newRange.start,
      checkOut: newRange.end
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
      format="MMM DD, YYYY"
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
                    themeMode='dark'
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
                    format="MMM DD, YYYY"
                />

                {booking.checkIn && booking.checkOut && (
                    <div className="p-4 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Typography variant="h6" weight="semibold" className="text-green-800 dark:text-green-300 mb-2">
                            Booking Summary
                        </Typography>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Typography variant="caption" className="text-gray-500 dark:text-gray-400">Check-in</Typography>
                                <Typography variant="body" className="font-medium">
                                    {booking.checkIn.toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="caption" className="text-gray-500 dark:text-gray-400">Check-out</Typography>
                                <Typography variant="body" className="font-medium">
                                    {booking.checkOut.toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </Typography>
                            </div>
                            <div className="col-span-2">
                                <Typography variant="caption" className="text-gray-500 dark:text-gray-400">Total Nights</Typography>
                                <Typography variant="body" weight="bold" className="text-green-600 dark:text-green-400">
                                    {Math.ceil((booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights
                                </Typography>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <Typography variant="body-small" weight="medium" className="mb-1">Features demonstrated:</Typography>
                    <ul className="list-disc pl-5 space-y-1">
                        <Typography variant="caption" as="li">Date range selection</Typography>
                        <Typography variant="caption" as="li">Min/max date constraints</Typography>
                        <Typography variant="caption" as="li">Disabled dates (weekends)</Typography>
                        <Typography variant="caption" as="li">Today and Clear buttons</Typography>
                        <Typography variant="caption" as="li">Custom date format (MMM DD, YYYY)</Typography>
                    </ul>
                </div>
            </div>
        </DemoSection>
    );
};
// Demo 8: Validation Examples
export const ValidationExamplesDemo = () => {
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Typography variant="label" className="text-gray-700 dark:text-gray-300">Required Field</Typography>
                    <DatePicker
                        themeMode='dark'
                        required
                        placeholder="Select a date (required)"
                        value={dates.required || undefined}
                        onChange={(date) => setDates(prev => ({ ...prev, required: date as Date }))}
                        helperText="This field must be filled"
                        colorScheme="blue"
                    />
                </div>

                <div className="space-y-2">
                    <Typography variant="label" className="text-gray-700 dark:text-gray-300">Min/Max Date Constraints</Typography>
                    <DatePicker
                        themeMode='dark'
                        minDate={today}
                        maxDate={nextWeek}
                        placeholder={`Select date within next week`}
                        value={dates.minMax || undefined}
                        onChange={(date) => setDates(prev => ({ ...prev, minMax: date as Date }))}
                        helperText={`Dates between ${today.toLocaleDateString()} and ${nextWeek.toLocaleDateString()}`}
                        colorScheme="green"
                    />
                </div>

                <div className="space-y-2">
                    <Typography variant="label" className="text-gray-700 dark:text-gray-300">Disabled Dates</Typography>
                    <DatePicker
                        themeMode='dark'
                        disabledDates={disabledDates}
                        placeholder="Select date (some dates disabled)"
                        value={dates.disabled || undefined}
                        onChange={(date) => setDates(prev => ({ ...prev, disabled: date as Date }))}
                        helperText="2nd and 4th from today are unavailable"
                        colorScheme="orange"
                    />
                </div>

                <div className="space-y-2">
                    <Typography variant="label" className="text-gray-700 dark:text-gray-300">Error State</Typography>
                    <DatePicker
                        themeMode='dark'
                        error
                        errorMessage="Invalid date selected"
                        placeholder="This field has an error"
                        value={dates.error || undefined}
                        onChange={(date) => setDates(prev => ({ ...prev, error: date as Date }))}
                        helperText="Showing error state"
                        colorScheme="rose"
                    />
                </div>
            </div>
        </DemoSection>
    );
};

// Demo 9: Interactive Playground
export const DatePickerPlayground = () => {
    const [config, setConfig] = useState({
        variant: 'single' as 'single' | 'range',
        size: 'md' as 'sm' | 'md' | 'lg' | 'xl',
        themeMode: 'dark' as 'light' | 'dark',
        colorScheme: 'blue' as string,
        popupPosition: 'bottom-left' as string,
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

    const handleConfigChange = (key: string, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };
    // Handler for single date picker
    const handleSingleDateChange = (date: Date | null) => {
        setDate(date);
    };

    // Handler for range date picker
    const handleRangeDateChange = (range: { start: Date | null; end: Date | null }) => {
        setRange(range);
    };

    return (
        <DemoSection
            title=""
            description="Customize the DatePicker and see changes in real-time"
        >
            <div className="space-y-8">
                {/* Controls */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                        <Typography variant="caption" weight="medium">Variant</Typography>
                        <select
                            value={config.variant}
                            onChange={(e) => handleConfigChange('variant', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded"
                        >
                            <option value="single">Single Date</option>
                            <option value="range">Date Range</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Typography variant="caption" weight="medium">Size</Typography>
                        <select
                            value={config.size}
                            onChange={(e) => handleConfigChange('size', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded"
                        >
                            {sizeOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Typography variant="caption" weight="medium">Color Scheme</Typography>
                        <select
                            value={config.colorScheme}
                            onChange={(e) => handleConfigChange('colorScheme', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded"
                        >
                            {colorSchemeOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Typography variant="caption" weight="medium">Popup Position</Typography>
                        <select
                            value={config.popupPosition}
                            onChange={(e) => handleConfigChange('popupPosition', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded"
                        >
                            {popupPositionOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="showIcon"
                            checked={config.showIcon}
                            onChange={(e) => handleConfigChange('showIcon', e.target.checked)}
                        />
                        <label htmlFor="showIcon" className="text-sm">Show Icon</label>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="todayButton"
                            checked={config.todayButton}
                            onChange={(e) => handleConfigChange('todayButton', e.target.checked)}
                        />
                        <label htmlFor="todayButton" className="text-sm">Today Button</label>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="clearButton"
                            checked={config.clearButton}
                            onChange={(e) => handleConfigChange('clearButton', e.target.checked)}
                        />
                        <label htmlFor="clearButton" className="text-sm">Clear Button</label>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="required"
                            checked={config.required}
                            onChange={(e) => handleConfigChange('required', e.target.checked)}
                        />
                        <label htmlFor="required" className="text-sm">Required</label>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="disabled"
                            checked={config.disabled}
                            onChange={(e) => handleConfigChange('disabled', e.target.checked)}
                        />
                        <label htmlFor="disabled" className="text-sm">Disabled</label>
                    </div>

                    <div className="col-span-2 md:col-span-3 lg:col-span-4">
                        <Button
                            onClick={() => handleConfigChange('themeMode', config.themeMode === 'light' ? 'dark' : 'light')}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            {config.themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            Switch to {config.themeMode === 'light' ? 'Dark' : 'Light'} Theme
                        </Button>
                    </div>
                </div>

                {/* Preview */}
                <div className={`p-6 rounded-lg ${config.themeMode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    <div className="max-w-md mx-auto">
                        <DatePicker
                            variant={config.variant}
                            size={config.size}
                            themeMode={config.themeMode}
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
            </div>
        </DemoSection>
    );
};



export const ControlledDatePickerDemo = () => {
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
import { DatePicker } from '@mindfiredigital/ignix-ui';

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
import { DatePicker } from '@mindfiredigital/ignix-ui';

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
                        themeMode='dark'
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
                        themeMode='dark'
                    />
                    <div className="space-y-2">
                        <Typography variant="body-small">
                            Selected Range:
                        </Typography>
                        <Typography variant="caption" className="block">
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