'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import { Typography } from '../../typography';
import { Button } from '../../button';
import { type CalendarViewProps } from '../types';
import { getDaysInMonth, isSameDay, isDateInRange, isDateDisabled, getThemeStyles, getColorStyles, getInRangeStyle } from '../utils';
import { MONTH_NAMES, DAY_NAMES } from '../constants';


/**
 * CalendarView component - The main calendar grid UI
 * Displays month view with selection, range highlighting, and navigation
 * 
 * @component
 * @example
 * <CalendarView
 *   currentMonth={currentMonth}
 *   onMonthChange={setCurrentMonth}
 *   selectedDate={selectedDate}
 *   onDateSelect={handleDateSelect}
 *   themeMode="light"
 *   colorScheme="blue"
 * />
 */
const CalendarView: React.FC<CalendarViewProps> = ({
    currentMonth,
    onMonthChange,
    selectedDate,
    selectedRange,
    onDateSelect,
    themeMode = 'light',
    colorScheme = 'blue',
    minDate,
    maxDate,
    disabledDates,
    highlightDates,
    todayButton = true,
    clearButton = true,
    onTodayClick,
    onClearClick,
    weekStart = 0,
    monthNames = MONTH_NAMES,
    dayNames = DAY_NAMES,
    todayText = 'Today',
    clearText = 'Clear',
}) => {
    const themeStyles = getThemeStyles(themeMode);
    const colorStyles = getColorStyles(colorScheme);
    const days = getDaysInMonth(currentMonth, weekStart);
    const currentYear = currentMonth.getFullYear();
    const currentMonthIndex = currentMonth.getMonth();

    const handlePrevMonth = () => {
        const prevMonth = new Date(currentYear, currentMonthIndex - 1, 1);
        onMonthChange(prevMonth);
    };

    const handleNextMonth = () => {
        const nextMonth = new Date(currentYear, currentMonthIndex + 1, 1);
        onMonthChange(nextMonth);
    };

    const isCurrentMonth = (date: Date): boolean => {
        return date.getMonth() === currentMonthIndex;
    };

    const getDayName = (index: number): string => {
        const adjustedIndex = weekStart === 1 ? (index === 6 ? 0 : index + 1) : index;
        return dayNames[adjustedIndex] || DAY_NAMES[adjustedIndex];
    };

    return (
        <div className={cn(
            "w-80 p-5 rounded-2xl shadow-xl border",
            themeStyles.calendar,
            colorStyles.border[themeMode]
        )}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevMonth}
                    className={cn(
                        "rounded-xl transition-all duration-300 hover:scale-105 active:scale-95",
                        colorStyles.button[themeMode]
                    )}
                    aria-label="Previous month"
                    animationVariant="press3DSoft"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>

                <div className="flex items-center gap-2">
                    <Typography
                        variant="h6"
                        weight="bold"
                        className={cn("tracking-tight", themeStyles.header)}
                    >
                        {monthNames[currentMonthIndex]} {currentYear}
                    </Typography>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextMonth}
                    className={cn(
                        "rounded-xl transition-all duration-300 hover:scale-105 active:scale-95",
                        colorStyles.button[themeMode]
                    )}
                    aria-label="Next month"
                    animationVariant="press3DSoft"
                >
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>

            {/* Week days */}
            <div className="grid grid-cols-7 gap-2 mb-3">
                {Array.from({ length: 7 }).map((_, index) => (
                    <Typography
                        key={index}
                        variant="caption"
                        weight="semibold"
                        align="center"
                        className={cn("py-2 tracking-wide", themeStyles.weekday)}
                    >
                        {getDayName(index)}
                    </Typography>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
                {days.map((date, index) => {
                    const isSelected = isSameDay(date, selectedDate);
                    const isInRange = isDateInRange(date, selectedRange.start, selectedRange.end);
                    const isDisabled = isDateDisabled(date, minDate, maxDate, disabledDates);
                    const isHighlighted = highlightDates?.some(d => isSameDay(d, date));
                    const isToday = isSameDay(date, new Date());

                    const isStart = selectedRange.start && isSameDay(date, selectedRange.start);
                    const isEnd = selectedRange.end && isSameDay(date, selectedRange.end);
                    const isCurrent = isCurrentMonth(date);

                    return (
                        <motion.div
                            key={index}
                            className="relative"
                            whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => !isDisabled && onDateSelect(date)}
                                disabled={isDisabled}
                                className={cn(
                                    "h-11 w-11 rounded-xl text-sm font-medium transition-all duration-300 relative cursor-pointer",
                                    !isCurrent && "opacity-40",  // 🔹 Gray out dates from other months
                                    isDisabled && cn("cursor-not-allowed opacity-20", themeStyles.text.disabled),

                                    // Range styling
                                    isInRange && !isStart && !isEnd && cn(
                                        getInRangeStyle(themeMode, colorScheme),
                                        "rounded-xl"
                                    ),
                                    isStart && cn("rounded-l-xl bg-gradient-to-r", colorStyles.primary[themeMode], "text-white shadow-sm"),
                                    isEnd && cn("rounded-r-xl bg-gradient-to-r", colorStyles.primary[themeMode], "text-white shadow-sm"),

                                    // Single date selection
                                    isSelected && !isStart && !isEnd && cn("bg-gradient-to-r", colorStyles.primary[themeMode], "text-white shadow-sm"),

                                    // Today
                                    isToday && !isSelected && !isInRange && cn(colorStyles.accent[themeMode]),

                                    // Highlighted dates
                                    isHighlighted && !isSelected && !isInRange && "ring-2 ring-yellow-400 shadow-sm",

                                    // Default hover
                                    !isSelected && !isInRange && !isDisabled && cn(
                                        "hover:bg-opacity-50",
                                        themeStyles.hover
                                    ),

                                    // Base styling
                                    "shadow-sm"
                                )}
                                aria-label={`Select ${date.toLocaleDateString()}`}
                                animationVariant={isDisabled ? undefined : "press3DSoft"}
                            >
                                <Typography
                                    variant="body-small"
                                    weight={(isSelected || isStart || isEnd) ? "bold" : "normal"}
                                    className={cn(
                                        "relative z-10",
                                        !isSelected && !isStart && !isEnd && isCurrent
                                            ? themeStyles.day.current
                                            : themeStyles.day.nonCurrent
                                    )}
                                >
                                    {date.getDate()}
                                </Typography>

                                {/* Range indicators */}
                                {isStart && selectedRange.end && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '50%' }}
                                        className="absolute inset-y-0 right-0 h-full bg-gradient-to-l from-white/20 to-transparent rounded-r-xl"
                                    />
                                )}
                                {isEnd && selectedRange.start && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '50%' }}
                                        className="absolute inset-y-0 left-0 h-full bg-gradient-to-r from-white/20 to-transparent rounded-l-xl"
                                    />
                                )}

                                {/* Today indicator dot */}
                                {isToday && !isSelected && !isInRange && (
                                    <div className={cn(
                                        "absolute -top-1 right-1 w-1.5 h-1.5 rounded-full opacity-60",
                                        themeMode === 'dark' ? 'bg-blue-300' : 'bg-blue-500'
                                    )} />
                                )}
                            </Button>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer buttons */}
            {(todayButton || clearButton) && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex gap-3 mt-6 pt-5 border-t", themeStyles.footer)}
                >
                    {todayButton && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onTodayClick}
                            className="flex-1 rounded-xl shadow-sm hover:shadow text-slate-500 cursor-pointer"
                            animationVariant="press3DSoft"
                        >
                            <Typography variant="body-small" weight="medium">
                                {todayText}
                            </Typography>
                        </Button>
                    )}
                    {clearButton && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearClick}
                            className={cn(
                                "flex-1 rounded-xl shadow-sm hover:shadow cursor-pointer",
                                themeMode === 'dark'
                                    ? "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-300"
                                    : "bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-600"
                            )}
                            animationVariant="press3DSoft"
                        >
                            <Typography variant="body-small" weight="medium">
                                {clearText}
                            </Typography>
                        </Button>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default CalendarView;