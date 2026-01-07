import React, { useState } from 'react';
import DatePicker from './';
import { Calendar, Search, Moon, Sun } from 'lucide-react';
import { Typography } from '../typography';
import { Button } from '../button';
import type { DateRange, ThemeMode, ColorScheme } from './types';

export default {
    title: 'Components/DatePicker',
    component: DatePicker,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['single', 'range'],
        },
        size: {
            control: { type: 'select' },
            options: ['sm', 'md', 'lg', 'xl'],
        },
        themeMode: {
            control: { type: 'select' },
            options: ['light', 'dark'],
        },
        colorScheme: {
            control: { type: 'select' },
            options: ['blue', 'green', 'purple', 'orange', 'slate', 'rose'],
        },
        popupPosition: {
            control: { type: 'select' },
            options: ['bottom-left', 'bottom-right', 'top-left', 'top-right', 'left', 'right'],
        },
        format: {
            control: { type: 'select' },
            options: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'MMM DD, YYYY', 'DD MMM YYYY', 'YYYY/MM/DD'],
        },
    },
};

export const Default = {
    args: {
        placeholder: 'Select a date',
    },
};

export const CombinedThemes = () => (
    <div className="space-y-8">
        <Typography variant="h3" weight="semibold">
            Combined Theme & Color Schemes
        </Typography>

        <div className="grid grid-cols-2 gap-6">
            {/* Light theme with different colors */}
            <div className="space-y-4 p-4 bg-gray-100 rounded-lg">
                <Typography variant="h4" weight="medium" className="text-gray-900">Light Theme</Typography>
                <DatePicker themeMode="light" colorScheme="blue" placeholder="Light Blue" />
                <DatePicker themeMode="light" colorScheme="green" placeholder="Light Green" />
                <DatePicker themeMode="light" colorScheme="rose" placeholder="Light Rose" />
            </div>

            {/* Dark theme with different colors */}
            <div className="space-y-4 p-4 bg-gray-950 rounded-lg">
                <Typography variant="h4" weight="medium" className="text-gray-100">Dark Theme</Typography>
                <DatePicker themeMode="dark" colorScheme="blue" placeholder="Dark Blue" />
                <DatePicker themeMode="dark" colorScheme="orange" placeholder="Dark Orange" />
                <DatePicker themeMode="dark" colorScheme="purple" placeholder="Dark Purple" />
            </div>
        </div>
    </div>
);


export const CustomCombinations = () => (
    <div className="space-y-6">
        <Typography variant="h3" weight="semibold">
            Custom Theme Combinations
        </Typography>

        <div className="grid grid-cols-3 gap-4">
            <DatePicker
                themeMode="light"
                colorScheme="rose"
                placeholder="Light Rose"
                label="Light Rose"
                helperText="Light theme with rose color scheme"
            />

            <DatePicker
                themeMode="dark"
                colorScheme="blue"
                placeholder="Dark Blue"
                label="Dark Blue"
                helperText="Dark theme with blue color scheme"
            />

            <DatePicker
                themeMode="light"
                colorScheme="orange"
                placeholder="Light Orange"
                label="Light Orange"
                helperText="Light theme with orange color scheme"
            />
        </div>
    </div>
);

export const SingleDatePicker = () => {
    const [date, setDate] = useState<Date | null>(null);

    return (
        <div className="space-y-4">
            <DatePicker
                value={date || undefined}
                onChange={setDate}
                placeholder="Pick a date"
                label="Select Date"
                helperText="Choose any date from the calendar"
                themeMode="light"
                colorScheme="blue"
            />
            {date && (
                <Typography variant="body-small" color="muted">
                    Selected: {date.toLocaleDateString()}
                </Typography>
            )}
        </div>
    );
};

export const RangeDatePicker = () => {
    const [range, setRange] = useState<DateRange>({ start: null, end: null });

    return (
        <div className="space-y-4">
            <DatePicker
                variant="range"
                value={range}
                onChange={setRange}
                placeholder={['Start date', 'End date']}
                label="Select Date Range"
                helperText="Choose start and end dates"
                themeMode="light"
                colorScheme="green"
            />
            {range.start && range.end && (
                <Typography variant="body-small" color="muted">
                    Selected: {range.start.toLocaleDateString()} – {range.end.toLocaleDateString()}
                </Typography>
            )}
        </div>
    );
};

export const DifferentSizes = () => (
    <div className="space-y-6 p-6 border rounded-lg dark:border-gray-700">
        <div className="space-y-2">
            <Typography variant="label" color="muted">Small</Typography>
            <DatePicker size="sm" placeholder="Small picker" themeMode="light" colorScheme="blue" />
        </div>
        <div className="space-y-2">
            <Typography variant="label" color="muted">Medium (Default)</Typography>
            <DatePicker size="md" placeholder="Medium picker" themeMode="light" colorScheme="green" />
        </div>
        <div className="space-y-2">
            <Typography variant="label" color="muted">Large</Typography>
            <DatePicker size="lg" placeholder="Large picker" themeMode="light" colorScheme="purple" />
        </div>
        <div className="space-y-2">
            <Typography variant="label" color="muted">Extra Large</Typography>
            <DatePicker size="xl" placeholder="Extra large picker" themeMode="light" colorScheme="orange" />
        </div>
    </div>
);

export const AllColorSchemes = () => {
    const [themeMode, setThemeMode] = useState<ThemeMode>('light');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Typography variant="h3" weight="semibold">
                    All Color Schemes - Solid Backgrounds
                </Typography>
                <Button
                    onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
                    variant="outline"
                    className="flex items-center gap-2"
                    animationVariant="press3DSoft"
                >
                    {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <Typography variant="body-small" weight="medium">
                        Switch to {themeMode === 'light' ? 'Dark' : 'Light'}
                    </Typography>
                </Button>
            </div>

            <div className={cn(
                "p-6 border rounded-2xl space-y-6",
                themeMode === 'dark'
                    ? "bg-gray-950 border-gray-800"
                    : "bg-white border-gray-200"
            )}>
                {(['blue', 'green', 'purple', 'orange', 'slate', 'rose'] as ColorScheme[]).map((colorScheme) => (
                    <div key={colorScheme} className="space-y-2">
                        <Typography
                            variant="label"
                            className={themeMode === 'dark' ? "text-gray-300" : "text-gray-700"}
                            transform="capitalize"
                        >
                            {colorScheme} Color Scheme
                        </Typography>
                        <DatePicker
                            themeMode={themeMode}
                            colorScheme={colorScheme}
                            placeholder={`${colorScheme} theme`}
                            helperText={`${themeMode === 'light' ? 'Light' : 'Dark'} theme with ${colorScheme} colors`}
                        />
                    </div>
                ))}
            </div>

            <div className={cn(
                "p-4 rounded-lg",
                themeMode === 'dark' ? "bg-gray-800" : "bg-gray-100"
            )}>
                <Typography variant="body-small" weight="medium" className={themeMode === 'dark' ? "text-gray-300" : "text-gray-700"}>
                    Note: All backgrounds are now solid:
                </Typography>
                <ul className="mt-2 space-y-1">
                    <Typography variant="body-small" className={themeMode === 'dark' ? "text-gray-400" : "text-gray-600"} as="li">
                        • Light theme: Pure white backgrounds
                    </Typography>
                    <Typography variant="body-small" className={themeMode === 'dark' ? "text-gray-400" : "text-gray-600"} as="li">
                        • Dark theme: Solid black/gray-900 backgrounds
                    </Typography>
                    <Typography variant="body-small" className={themeMode === 'dark' ? "text-gray-400" : "text-gray-600"} as="li">
                        • No transparency or blur effects
                    </Typography>
                    <Typography variant="body-small" className={themeMode === 'dark' ? "text-gray-400" : "text-gray-600"} as="li">
                        • Better contrast and readability
                    </Typography>
                </ul>
            </div>
        </div>
    );
};
export const WithMinMaxDates = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return (
        <div className="space-y-4">
            <DatePicker
                minDate={today}
                maxDate={nextWeek}
                placeholder="Select date (within next week)"
                label="Date Range: Today to Next Week"
                helperText="You can only select dates within the next 7 days"
                themeMode="light"
                colorScheme="blue"
            />
            <div className="space-y-1">
                <Typography variant="body-small" color="muted">
                    Min date: {today.toLocaleDateString()}
                </Typography>
                <Typography variant="body-small" color="muted">
                    Max date: {nextWeek.toLocaleDateString()}
                </Typography>
            </div>
        </div>
    );
};

export const WithDisabledDates = () => {
    const today = new Date();
    const disabledDates = [
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
    ];

    return (
        <div className="space-y-4">
            <DatePicker
                disabledDates={disabledDates}
                placeholder="Select date (some dates disabled)"
                label="Date Picker with Disabled Dates"
                helperText="Tomorrow, 3 days from now, and 5 days from now are disabled"
                themeMode="light"
                colorScheme="orange"
            />
            <div>
                <Typography variant="body-small" color="muted" className="mb-2">
                    Disabled dates:
                </Typography>
                <ul className="list-disc pl-5 space-y-1">
                    {disabledDates.map((date, i) => (
                        <Typography key={i} variant="body-small" color="muted" as="li">
                            {date.toLocaleDateString()}
                        </Typography>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export const WithHighlightedDates = () => {
    const today = new Date();
    const highlightDates = [
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6),
    ];

    return (
        <div className="space-y-4">
            <DatePicker
                highlightDates={highlightDates}
                placeholder="Select date (some dates highlighted)"
                label="Date Picker with Highlighted Dates"
                helperText="Special dates are highlighted with a yellow ring"
                themeMode="light"
                colorScheme="green"
            />
        </div>
    );
};

export const ErrorStates = () => (
    <div className="space-y-6 p-6 border rounded-lg dark:border-gray-700">
        <div className="space-y-2">
            <Typography variant="label" color="muted">Required Field (Empty)</Typography>
            <DatePicker
                required
                errorMessage="Date is required"
                placeholder="Required field"
                themeMode="light"
                colorScheme="rose"
            />
        </div>
        <div className="space-y-2">
            <Typography variant="label" color="muted">Manual Error State</Typography>
            <DatePicker
                error
                errorMessage="Please select a valid date"
                placeholder="With error"
                themeMode="light"
                colorScheme="blue"
            />
        </div>
        <div className="space-y-2">
            <Typography variant="label" color="muted">Dark Theme Error</Typography>
            <div className="p-4 bg-gray-900 rounded-lg">
                <DatePicker
                    themeMode="dark"
                    colorScheme="blue"
                    error
                    errorMessage="Invalid date selection"
                    placeholder="Dark theme error"
                />
            </div>
        </div>
    </div>
);

export const DifferentPopupPositions = () => (
    <div className="grid grid-cols-2 gap-6 p-6">
        <div className="space-y-2">
            <Typography variant="label" color="muted">Bottom Left (Default)</Typography>
            <DatePicker popupPosition="bottom-left" placeholder="Bottom left" themeMode="light" colorScheme="blue" />
        </div>
        <div className="space-y-2">
            <Typography variant="label" color="muted">Bottom Right</Typography>
            <DatePicker popupPosition="bottom-right" placeholder="Bottom right" themeMode="light" colorScheme="green" />
        </div>
        <div className="space-y-2">
            <Typography variant="label" color="muted">Top Left</Typography>
            <DatePicker popupPosition="top-left" placeholder="Top left" themeMode="light" colorScheme="purple" />
        </div>
        <div className="space-y-2">
            <Typography variant="label" color="muted">Top Right</Typography>
            <DatePicker popupPosition="top-right" placeholder="Top right" themeMode="light" colorScheme="orange" />
        </div>
        <div className="space-y-2">
            <Typography variant="label" color="muted">Left</Typography>
            <DatePicker popupPosition="left" placeholder="Left side" themeMode="light" colorScheme="slate" />
        </div>
        <div className="space-y-2">
            <Typography variant="label" color="muted">Right</Typography>
            <DatePicker popupPosition="right" placeholder="Right side" themeMode="light" colorScheme="rose" />
        </div>
    </div>
);

export const DisabledAndReadOnly = () => (
    <div className="space-y-6 p-6 border rounded-lg dark:border-gray-700">
        <div className="space-y-2">
            <Typography variant="label" color="muted">Disabled</Typography>
            <DatePicker disabled placeholder="Disabled picker" themeMode="light" colorScheme="blue" />
        </div>
        <div className="space-y-2">
            <Typography variant="label" color="muted">Read Only</Typography>
            <DatePicker readOnly value={new Date()} placeholder="Read only picker" themeMode="light" colorScheme="green" />
        </div>
        <div className="space-y-2">
            <Typography variant="label" color="muted">Disabled Dark Theme</Typography>
            <div className="p-4 bg-gray-900 rounded-lg">
                <DatePicker
                    themeMode="dark"
                    colorScheme="purple"
                    disabled
                    value={new Date()}
                    placeholder="Disabled with value"
                />
            </div>
        </div>
    </div>
);

export const CustomIcons = () => (
    <div className="grid grid-cols-2 gap-6 p-6">
        <div className="space-y-2">
            <Typography variant="label" color="muted">Calendar Icon</Typography>
            <DatePicker
                icon={<Calendar className="w-4 h-4 text-blue-500" />}
                placeholder="Calendar icon"
                themeMode="light"
                colorScheme="blue"
            />
        </div>
        <div className="space-y-2">
            <Typography variant="label" color="muted">Search Icon</Typography>
            <DatePicker
                icon={<Search className="w-4 h-4 text-green-500" />}
                placeholder="Search icon"
                themeMode="light"
                colorScheme="green"
            />
        </div>
        <div className="space-y-2">
            <Typography variant="label" color="muted">Dark Theme Icon</Typography>
            <div className="p-4 bg-gray-900 rounded-lg">
                <DatePicker
                    themeMode="dark"
                    colorScheme="blue"
                    icon={<Calendar className="w-4 h-4 text-blue-400" />}
                    placeholder="Dark theme icon"
                />
            </div>
        </div>
        <div className="space-y-2">
            <Typography variant="label" color="muted">No Icon</Typography>
            <DatePicker
                showIcon={false}
                placeholder="No icon"
                themeMode="light"
                colorScheme="slate"
            />
        </div>
    </div>
);

export const WeekStartsMonday = () => (
    <div className="space-y-4">
        <DatePicker
            weekStart={1}
            placeholder="Week starts Monday"
            label="Week Starts Monday"
            helperText="Calendar shows Monday as the first day of the week"
            themeMode="light"
            colorScheme="blue"
        />
    </div>
);

export const WithAutoClose = () => (
    <div className="space-y-4">
        <DatePicker
            autoClose
            placeholder="Auto-closes after selection"
            label="Auto Close Date Picker"
            helperText="Calendar automatically closes after selecting a date"
            themeMode="light"
            colorScheme="green"
        />
    </div>
);

export const ComplexExample = () => {
    const [selectedRange, setSelectedRange] = useState<DateRange>({ start: null, end: null });
    const [themeMode, setThemeMode] = useState<ThemeMode>('light');
    const [colorScheme, setColorScheme] = useState<ColorScheme>('blue');

    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);

    const disabledDates = [
        new Date(today.getFullYear(), today.getMonth(), 15),
        new Date(today.getFullYear(), today.getMonth(), 20),
        new Date(today.getFullYear(), today.getMonth(), 25),
    ];

    const highlightDates = [
        new Date(today.getFullYear(), today.getMonth(), 10),
        new Date(today.getFullYear(), today.getMonth(), 18),
        new Date(today.getFullYear(), today.getMonth(), 28),
    ];

    return (
        <div className={cn(
            "space-y-6 p-6 border rounded-2xl max-w-2xl",
            themeMode === 'dark' ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
        )}>
            <div className="flex items-center justify-between">
                <Typography variant="h3" weight="semibold" className={themeMode === 'dark' ? "text-gray-100" : "text-gray-900"}>
                    Advanced Hotel Booking
                </Typography>
                <div className="flex items-center gap-3">
                    <select
                        value={colorScheme}
                        onChange={(e) => setColorScheme(e.target.value as ColorScheme)}
                        className={cn(
                            "px-3 py-1.5 rounded-lg border text-sm",
                            themeMode === 'dark'
                                ? "bg-gray-800 border-gray-700 text-gray-100"
                                : "bg-white border-gray-300 text-gray-900"
                        )}
                    >
                        {['blue', 'green', 'purple', 'orange', 'slate', 'rose'].map((color) => (
                            <option key={color} value={color}>{color}</option>
                        ))}
                    </select>
                    <Button
                        onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
                        variant={themeMode === 'dark' ? "outline" : "secondary"}
                        className="flex items-center gap-2"
                        animationVariant="press3DSoft"
                    >
                        {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        <Typography variant="body-small" weight="medium">
                            {themeMode === 'dark' ? 'Light' : 'Dark'} Mode
                        </Typography>
                    </Button>
                </div>
            </div>

            <DatePicker
                variant="range"
                value={selectedRange}
                onChange={setSelectedRange}
                placeholder={['Check-in date', 'Check-out date']}
                label="Booking Dates"
                helperText="Select your check-in and check-out dates"
                minDate={today}
                maxDate={nextMonth}
                disabledDates={disabledDates}
                highlightDates={highlightDates}
                themeMode={themeMode}
                colorScheme={colorScheme}
                size="lg"
                todayButton
                clearButton
                format="MMM DD, YYYY"
                required
                showIcon
                icon={<Calendar className={cn(
                    "w-5 h-5",
                    themeMode === 'dark' ? "text-gray-400" : "text-gray-400"
                )} />}
                popupPosition="bottom-left"
                weekStart={1}
            />

            {selectedRange.start && selectedRange.end && (
                <div className={cn(
                    "p-4 rounded-xl",
                    themeMode === 'dark'
                        ? "bg-blue-900/20 text-blue-300 border border-blue-800/30"
                        : "bg-blue-50 text-blue-700"
                )}>
                    <Typography variant="h4" weight="medium" className="mb-2">
                        Selected Booking:
                    </Typography>
                    <div className="space-y-1">
                        <Typography variant="body-small">
                            Check-in: {selectedRange.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Typography>
                        <Typography variant="body-small">
                            Check-out: {selectedRange.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Typography>
                        <Typography variant="body-small" weight="medium">
                            Duration: {Math.ceil((selectedRange.end.getTime() - selectedRange.start.getTime()) / (1000 * 60 * 60 * 24))} nights
                        </Typography>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <Typography variant="body-small" weight="medium" className={themeMode === 'dark' ? "text-gray-300" : "text-gray-600"}>
                    Booking Constraints:
                </Typography>
                <ul className="list-disc pl-5 space-y-1">
                    {[
                        "Cannot select dates before today",
                        `Cannot select dates beyond ${nextMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
                        "Disabled dates: 15th, 20th, 25th of this month",
                        "Special dates highlighted: 10th, 18th, 28th of this month"
                    ].map((constraint, index) => (
                        <Typography
                            key={index}
                            variant="body-small"
                            className={themeMode === 'dark' ? "text-gray-400" : "text-gray-500"}
                            as="li"
                        >
                            {constraint}
                        </Typography>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export const ResponsiveExample = () => (
    <div className="space-y-6 p-4 max-w-md mx-auto">
        <Typography variant="h3" weight="semibold" align="center">
            Responsive Date Picker
        </Typography>

        <div className="space-y-4">
            <Typography variant="body-small" color="muted" align="center">
                This date picker is responsive and works well on mobile, tablet, and desktop.
            </Typography>

            <DatePicker
                placeholder="Mobile-friendly picker"
                label="Date Selection"
                helperText="Try resizing your browser window or open on mobile"
                themeMode="light"
                colorScheme="blue"
            />

            <div className="space-y-1">
                <Typography variant="caption" weight="medium" color="muted">
                    Responsive Features:
                </Typography>
                <ul className="list-disc pl-4 space-y-0.5">
                    {[
                        "Adaptive popup positioning on small screens",
                        "Touch-friendly buttons and date cells",
                        "Optimized spacing for mobile",
                        "Responsive typography"
                    ].map((feature, index) => (
                        <Typography key={index} variant="caption" color="muted" as="li">
                            {feature}
                        </Typography>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

export const CustomMonthDayNames = () => {
    const frenchMonthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const frenchDayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    return (
        <div className="space-y-4">
            <DatePicker
                monthNames={frenchMonthNames}
                dayNames={frenchDayNames}
                placeholder="French calendar"
                label="Calendrier Français"
                helperText="Calendar with French month and day names"
                themeMode="light"
                colorScheme="blue"
            />
        </div>
    );
};

export const TodayAndClearButtons = () => (
    <div className="grid grid-cols-2 gap-6 p-6">
        <div className="space-y-2">
            <Typography variant="label" color="muted">With Today Button</Typography>
            <DatePicker todayButton clearButton={false} placeholder="Pick date" themeMode="light" colorScheme="green" />
        </div>
        <div className="space-y-2">
            <Typography variant="label" color="muted">With Clear Button</Typography>
            <DatePicker todayButton={false} clearButton placeholder="Pick date" themeMode="light" colorScheme="orange" />
        </div>
        <div className="space-y-2">
            <Typography variant="label" color="muted">Both Buttons</Typography>
            <DatePicker todayButton clearButton placeholder="Pick date" themeMode="light" colorScheme="purple" />
        </div>
        <div className="space-y-2">
            <Typography variant="label" color="muted">Dark Theme Buttons</Typography>
            <div className="p-4 bg-gray-900 rounded-lg">
                <DatePicker
                    themeMode="dark"
                    colorScheme="blue"
                    todayButton
                    clearButton
                    placeholder="Pick date"
                />
            </div>
        </div>
    </div>
);

export const MultipleDatePickersForm = () => {
    const [formData, setFormData] = useState({
        startDate: null as Date | null,
        endDate: null as Date | null,
        birthDate: null as Date | null,
        appointmentDate: null as Date | null,
    });

    return (
        <div className="space-y-6 p-6 border rounded-lg max-w-2xl dark:border-gray-700">
            <Typography variant="h3" weight="semibold" className="dark:text-gray-100">
                Multi Date Picker Form
            </Typography>

            <div className="grid grid-cols-2 gap-4">
                <DatePicker
                    label="Start Date"
                    placeholder="MM/DD/YYYY"
                    value={formData.startDate || undefined}
                    onChange={(date) => setFormData(prev => ({ ...prev, startDate: date as Date }))}
                    required
                    themeMode="light"
                    colorScheme="blue"
                />

                <DatePicker
                    label="End Date"
                    placeholder="MM/DD/YYYY"
                    value={formData.endDate || undefined}
                    onChange={(date) => setFormData(prev => ({ ...prev, endDate: date as Date }))}
                    required
                    themeMode="light"
                    colorScheme="green"
                />

                <DatePicker
                    label="Date of Birth"
                    placeholder="Select birth date"
                    value={formData.birthDate || undefined}
                    onChange={(date) => setFormData(prev => ({ ...prev, birthDate: date as Date }))}
                    maxDate={new Date()}
                    helperText="Must be in the past"
                    themeMode="light"
                    colorScheme="purple"
                />

                <DatePicker
                    label="Appointment Date"
                    placeholder="Select appointment"
                    value={formData.appointmentDate || undefined}
                    onChange={(date) => setFormData(prev => ({ ...prev, appointmentDate: date as Date }))}
                    minDate={new Date()}
                    helperText="Must be in the future"
                    themeMode="light"
                    colorScheme="orange"
                />
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded">
                <Typography variant="h4" weight="medium" className="mb-2 dark:text-gray-300">
                    Form Data:
                </Typography>
                <pre className="text-sm dark:text-gray-400">
                    {JSON.stringify(formData, (key, value) =>
                        value instanceof Date ? value.toLocaleDateString() : value, 2)}
                </pre>
            </div>
        </div>
    );
};

// Helper function for className merging
function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}
