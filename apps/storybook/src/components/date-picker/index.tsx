'use client';

import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Calendar } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Typography } from '../typography';
import CalendarView from './components/CalendarView';
import InputField from './components/InputField';
import RangeInputField from './components/RangeInputField';
import type { DatePickerProps, DateRange } from './types';
import { getThemeStyles, getColorStyles, getPopupPositionClasses, formatDate, parseDate, isSameDay } from './utils';
import { inputVariants } from './variants';
import { MONTH_NAMES, DAY_NAMES } from './constants';

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
    (
        {
            value,
            onChange,
            onError,
            variant = 'single',
            placeholder = 'Select date',
            format = 'MM/DD/YYYY',
            size = 'md',
            disabled = false,
            readOnly = false,
            required = false,
            minDate,
            maxDate,
            disabledDates,
            highlightDates,
            allowEmpty = false,
            todayButton = true,
            clearButton = true,
            autoClose = false,
            className,
            inputClassName,
            calendarClassName,
            themeMode = 'light',
            colorScheme = 'blue',
            popupPosition = 'bottom-left',
            showIcon = true,
            icon = <Calendar className="w-4 h-4" />,
            error = false,
            errorMessage,
            validateOnChange = true,
            label,
            helperText,
            weekStart = 0,
            monthNames = MONTH_NAMES,
            dayNames = DAY_NAMES,
            todayText = 'Today',
            clearText = 'Clear',
            ...props
        },
        ref
    ) => {
        const isDate = (value: unknown): value is Date => {
            return value instanceof Date;
        };

        const isDateRange = (value: unknown): value is DateRange => {
            return (
                typeof value === 'object' &&
                value !== null &&
                'start' in value &&
                'end' in value
            );
        };

        const [isOpen, setIsOpen] = useState(false);
        const [selectedDate, setSelectedDate] = useState<Date | null>(null);
        const [selectedRange, setSelectedRange] = useState<DateRange>({ start: null, end: null });
        const [currentMonth, setCurrentMonth] = useState(new Date());
        const [inputValue, setInputValue] = useState('');
        const [rangeInputValue, setRangeInputValue] = useState<[string, string]>(['', '']);
        const [internalError, setInternalError] = useState<string | null>(null);

        const containerRef = useRef<HTMLDivElement>(null);
        const inputRef = useRef<HTMLInputElement>(null);
        const startInputRef = useRef<HTMLInputElement>(null);
        const endInputRef = useRef<HTMLInputElement>(null);

        const themeStyles = getThemeStyles(themeMode);
        const colorStyles = getColorStyles(colorScheme);

        useEffect(() => {
            if (variant === 'single' && isDate(value)) {
                setSelectedDate(value);
                setInputValue(formatDate(value, format));
                setCurrentMonth(value);
            } else if (variant === 'range' && isDateRange(value)) {
                setSelectedRange(value);
                setRangeInputValue([
                    formatDate(value.start, format),
                    formatDate(value.end, format)
                ]);
                if (value.start) setCurrentMonth(value.start);

            } else if (value === null || value === undefined) {
                // Handle null/undefined values
                if (variant === 'single') {
                    setSelectedDate(null);
                    setInputValue('');
                } else {
                    setSelectedRange({ start: null, end: null });
                    setRangeInputValue(['', '']);
                }
            }
        }, [value, variant, format]);

        // Handle click outside
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(event.target as Node)
                ) {
                    setIsOpen(false);
                }
            };

            if (isOpen) {
                document.addEventListener('mousedown', handleClickOutside);
                return () => document.removeEventListener('mousedown', handleClickOutside);
            }
        }, [isOpen]);

        // Validate date
        const validateDate = (date: Date | null): string | null => {
            if (required && !date) return 'Date is required';
            if (date && minDate && date < minDate) return `Date must be after ${formatDate(minDate, format)}`;
            if (date && maxDate && date > maxDate) return `Date must be before ${formatDate(maxDate, format)}`;
            if (date && disabledDates?.some(d => isSameDay(d, date))) return 'This date is not available';
            return null;
        };


        // Handle single date selection
        const handleDateSelect = (date: Date) => {
            const error = validateOnChange ? validateDate(date) : null;
            setInternalError(error);
            onError?.(error);

            setSelectedDate(date);
            setInputValue(formatDate(date, format));

            if (onChange) {
                onChange(date);
            }

            if (autoClose) {
                setTimeout(() => setIsOpen(false), 100);
            }
        };

        // Handle range date selection
        const handleRangeDateSelect = (date: Date) => {
            let newRange = { ...selectedRange };
            const error = validateOnChange ? validateDate(date) : null;
            setInternalError(error);
            onError?.(error);

            if (!newRange.start || (newRange.start && newRange.end)) {
                // Start new range
                newRange = { start: date, end: null };
            } else if (newRange.start && !newRange.end) {
                // Complete the range
                if (date < newRange.start) {
                    newRange = { start: date, end: newRange.start };
                } else {
                    newRange = { start: newRange.start, end: date };
                }
            }

            setSelectedRange(newRange);
            setRangeInputValue([
                formatDate(newRange.start, format),
                formatDate(newRange.end, format)
            ]);

            if (onChange && newRange.start && newRange.end) {
                onChange(newRange);
                if (autoClose) {
                    setTimeout(() => setIsOpen(false), 100);
                }
            } else if (onChange && allowEmpty) {
                onChange(newRange);
            }
        };

        // Handle input change for single date
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setInputValue(value);

            if (value) {
                const date = parseDate(value, format);
                if (date) {
                    const error = validateDate(date);
                    setInternalError(error);
                    onError?.(error);

                    if (!error) {
                        setSelectedDate(date);
                        onChange?.(date);
                        setCurrentMonth(date);
                    }
                } else {
                    setInternalError('Invalid date format');
                    onError?.('Invalid date format');
                }
            } else if (allowEmpty) {
                setSelectedDate(null);
                onChange?.(null);
                setInternalError(null);
                onError?.(null);
            }
        };

        // Handle input change for range dates
        const handleRangeInputChange = (index: 0 | 1, value: string) => {
            const newValues = [...rangeInputValue] as [string, string];
            newValues[index] = value;
            setRangeInputValue(newValues);

            const date = parseDate(value, format);
            const newRange = { ...selectedRange };

            if (index === 0) {
                newRange.start = date;
            } else {
                newRange.end = date;
            }

            // Validate if both dates are set
            if (newRange.start && newRange.end) {
                const error = validateOnChange ? validateDate(newRange.start) || validateDate(newRange.end) : null;
                setInternalError(error);
                onError?.(error);

                if (!error) {
                    setSelectedRange(newRange);
                    onChange?.(newRange);
                }
            } else if (allowEmpty) {
                setSelectedRange(newRange);
                onChange?.(newRange);
            }
        };

        // Handle today button click
        const handleTodayClick = () => {
            const today = new Date();
            const error = validateDate(today);

            if (!error) {
                if (variant === 'single') {
                    handleDateSelect(today);
                } else {
                    handleRangeDateSelect(today);
                }
            } else {
                setInternalError(error);
                onError?.(error);
            }
        };

        // Handle clear button click
        const handleClearClick = () => {
            if (variant === 'single') {
                setSelectedDate(null);
                setInputValue('');
                onChange?.(null);
            } else {
                setSelectedRange({ start: null, end: null });
                setRangeInputValue(['', '']);
                onChange?.({ start: null, end: null });
            }
            setInternalError(null);
            onError?.(null);
        };

        const hasError = Boolean(error) || !!internalError;

        return (
            <div ref={containerRef} className={cn("relative", className)}>
                {label && (
                    <motion.label
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="block mb-2"
                    >
                        <Typography
                            variant="label"
                            weight="semibold"
                            className={cn("tracking-wide", themeStyles.text.primary)}
                        >
                            {label}
                            {required && <span className="text-red-500 ml-1">*</span>}
                        </Typography>
                    </motion.label>
                )}

                <motion.div
                    ref={ref}
                    className={cn(
                        inputVariants({ size, error: hasError, disabled, themeMode }),
                        themeStyles.bg.input,
                        themeStyles.text.primary,
                        themeStyles.border,
                        !hasError && colorStyles.ring[themeMode],
                        !hasError && !disabled && "hover:border-gray-300 dark:hover:border-gray-600",
                        "shadow-sm hover:shadow transition-shadow duration-300",
                        inputClassName
                    )}
                    onClick={() => !disabled && !readOnly && setIsOpen(true)}
                    whileHover={{ scale: disabled ? 1 : 1.005 }}
                    whileTap={{ scale: disabled ? 1 : 0.995 }}
                    {...props}
                >
                    {variant === 'single' ? (
                        <InputField
                            ref={inputRef}
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder={typeof placeholder === 'string' ? placeholder : placeholder[0]}
                            themeMode={themeMode}
                            disabled={disabled}
                            readOnly={readOnly}
                            showIcon={showIcon}
                            icon={icon}
                            onFocus={() => !disabled && !readOnly && setIsOpen(true)}
                        />
                    ) : (
                        <RangeInputField
                            startRef={startInputRef}
                            endRef={endInputRef}
                            startValue={rangeInputValue[0]}
                            endValue={rangeInputValue[1]}
                            onStartChange={(e) => handleRangeInputChange(0, e.target.value)}
                            onEndChange={(e) => handleRangeInputChange(1, e.target.value)}
                            placeholder={placeholder}
                            themeMode={themeMode}
                            disabled={disabled}
                            readOnly={readOnly}
                            showIcon={showIcon}
                            icon={icon}
                            onFocus={() => !disabled && !readOnly && setIsOpen(true)}
                        />
                    )}
                </motion.div>

                <AnimatePresence>
                    {isOpen && !disabled && !readOnly && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25
                            }}
                            className={cn(
                                "absolute z-50",
                                getPopupPositionClasses(popupPosition),
                                calendarClassName
                            )}
                        >
                            <CalendarView
                                currentMonth={currentMonth}
                                onMonthChange={setCurrentMonth}
                                selectedDate={selectedDate}
                                selectedRange={selectedRange}
                                onDateSelect={variant === 'single' ? handleDateSelect : handleRangeDateSelect}
                                themeMode={themeMode}
                                colorScheme={colorScheme}
                                minDate={minDate}
                                maxDate={maxDate}
                                disabledDates={disabledDates}
                                highlightDates={highlightDates}
                                todayButton={todayButton}
                                clearButton={clearButton}
                                onTodayClick={handleTodayClick}
                                onClearClick={handleClearClick}
                                weekStart={weekStart}
                                monthNames={monthNames}
                                dayNames={dayNames}
                                todayText={todayText}
                                clearText={clearText}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {(hasError || helperText) && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex items-center gap-2"
                    >
                        {hasError && (
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                <AlertCircle className="w-4 h-4 text-red-500" />
                            </motion.div>
                        )}
                        <Typography
                            variant="caption"
                            color={hasError ? "error" : "muted"}
                            weight="medium"
                            className="tracking-wide"
                        >
                            {hasError ? internalError || errorMessage : helperText}
                        </Typography>
                    </motion.div>
                )}
            </div>
        );
    }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
