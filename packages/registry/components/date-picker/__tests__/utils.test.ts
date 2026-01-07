// utils.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  formatDate,
  parseDate,
  isSameDay,
  isDateInRange,
  isDateDisabled,
  getDaysInMonth,
  getThemeStyles,
  getColorStyles,
  getInRangeStyle,
  getPopupPositionClasses
} from '../utils';
import {  COLOR_SCHEMES, THEME_MODES } from '../constants';

describe('DatePicker Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('formatDate', () => {
    it('formats date in MM/DD/YYYY format', () => {
      const date = new Date(2024, 11, 25);
      expect(formatDate(date, 'MM/DD/YYYY')).toBe('12/25/2024');
    });

    it('formats date in DD/MM/YYYY format', () => {
      const date = new Date(2024, 0, 5);
      expect(formatDate(date, 'DD/MM/YYYY')).toBe('05/01/2024');
    });

    it('formats date in YYYY-MM-DD format', () => {
      const date = new Date(2024, 11, 25);
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-12-25');
    });

    it('formats date in MMM DD, YYYY format', () => {
      const date = new Date(2024, 11, 25);
      expect(formatDate(date, 'MMM DD, YYYY')).toBe('Dec 25, 2024');
    });

    it('formats date in DD MMM YYYY format', () => {
      const date = new Date(2024, 0, 15);
      expect(formatDate(date, 'DD MMM YYYY')).toBe('15 Jan 2024');
    });

    it('formats date in YYYY/MM/DD format', () => {
      const date = new Date(2024, 0, 1);
      expect(formatDate(date, 'YYYY/MM/DD')).toBe('2024/01/01');
    });

    it('returns empty string for null date', () => {
      expect(formatDate(null, 'MM/DD/YYYY')).toBe('');
    });

    it('handles single digit months and days', () => {
      const date = new Date(2024, 0, 1);
      expect(formatDate(date, 'MM/DD/YYYY')).toBe('01/01/2024');
    });
  });

  describe('parseDate', () => {
    it('parses MM/DD/YYYY string', () => {
      const date = parseDate('12/25/2024', 'MM/DD/YYYY');
      expect(date).toBeInstanceOf(Date);
      expect(date?.getFullYear()).toBe(2024);
      expect(date?.getMonth()).toBe(11); // December is 11
      expect(date?.getDate()).toBe(25);
    });

    it('parses DD/MM/YYYY string', () => {
      const date = parseDate('25/12/2024', 'DD/MM/YYYY');
      expect(date).toBeInstanceOf(Date);
      expect(date?.getFullYear()).toBe(2024);
      expect(date?.getMonth()).toBe(11);
      expect(date?.getDate()).toBe(25);
    });

    it('parses YYYY-MM-DD string', () => {
      const date = parseDate('2024-12-25', 'YYYY-MM-DD');
      expect(date).toBeInstanceOf(Date);
      expect(date?.getFullYear()).toBe(2024);
      expect(date?.getMonth()).toBe(11);
      expect(date?.getDate()).toBe(25);
    });

    it('parses MMM DD, YYYY string', () => {
      const date = parseDate('Dec 25, 2024', 'MMM DD, YYYY');
      expect(date).toBeInstanceOf(Date);
      expect(date?.getFullYear()).toBe(2024);
      expect(date?.getMonth()).toBe(11);
      expect(date?.getDate()).toBe(25);
    });

    it('parses DD MMM YYYY string', () => {
      const date = parseDate('25 Dec 2024', 'DD MMM YYYY');
      expect(date).toBeInstanceOf(Date);
      expect(date?.getFullYear()).toBe(2024);
      expect(date?.getMonth()).toBe(11);
      expect(date?.getDate()).toBe(25);
    });

    it('returns null for invalid date string', () => {
      expect(parseDate('invalid', 'MM/DD/YYYY')).toBeNull();
    });

    it('returns null for empty string', () => {
      expect(parseDate('', 'MM/DD/YYYY')).toBeNull();
    });

  });

  describe('isSameDay', () => {
    it('returns true for same day', () => {
      const date1 = new Date(2024, 11, 25, 10, 30, 0);
      const date2 = new Date(2024, 11, 25, 14, 45, 0);
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('returns false for different days', () => {
      const date1 = new Date(2024, 11, 25);
      const date2 = new Date(2024, 11, 26);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('returns false for different months', () => {
      const date1 = new Date(2024, 11, 25);
      const date2 = new Date(2024, 10, 25);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('returns false for different years', () => {
      const date1 = new Date(2024, 11, 25);
      const date2 = new Date(2023, 11, 25);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('returns false if either date is null', () => {
      const date1 = new Date(2024, 11, 25);
      expect(isSameDay(date1, null)).toBe(false);
      expect(isSameDay(null, date1)).toBe(false);
      expect(isSameDay(null, null)).toBe(false);
    });
  });

  describe('isDateInRange', () => {
    it('returns true when date is within range', () => {
      const date = new Date(2024, 11, 20);
      const start = new Date(2024, 11, 15);
      const end = new Date(2024, 11, 25);
      expect(isDateInRange(date, start, end)).toBe(true);
    });

    it('returns false when date is before range', () => {
      const date = new Date(2024, 11, 10);
      const start = new Date(2024, 11, 15);
      const end = new Date(2024, 11, 25);
      expect(isDateInRange(date, start, end)).toBe(false);
    });

    it('returns false when date is after range', () => {
      const date = new Date(2024, 11, 30);
      const start = new Date(2024, 11, 15);
      const end = new Date(2024, 11, 25);
      expect(isDateInRange(date, start, end)).toBe(false);
    });

    it('returns false when start is null', () => {
      const date = new Date(2024, 11, 20);
      const start = null;
      const end = new Date(2024, 11, 25);
      expect(isDateInRange(date, start, end)).toBe(false);
    });

    it('returns false when end is null', () => {
      const date = new Date(2024, 11, 20);
      const start = new Date(2024, 11, 15);
      const end = null;
      expect(isDateInRange(date, start, end)).toBe(false);
    });
  });

  describe('isDateDisabled', () => {
    const minDate = new Date(2024, 0, 15);
    const maxDate = new Date(2024, 0, 30);
    const disabledDates = [
      new Date(2024, 0, 20),
      new Date(2024, 0, 25)
    ];

    it('returns true when date is before minDate', () => {
      const date = new Date(2024, 0, 10);
      expect(isDateDisabled(date, minDate, maxDate)).toBe(true);
    });

    it('returns true when date is after maxDate', () => {
      const date = new Date(2024, 1, 1);
      expect(isDateDisabled(date, minDate, maxDate)).toBe(true);
    });

    it('returns true when date is in disabledDates', () => {
      const date = new Date(2024, 0, 20);
      expect(isDateDisabled(date, minDate, maxDate, disabledDates)).toBe(true);
    });

    it('returns false when date is valid', () => {
      const date = new Date(2024, 0, 18);
      expect(isDateDisabled(date, minDate, maxDate, disabledDates)).toBe(false);
    });

    it('handles undefined minDate and maxDate', () => {
      const date = new Date(2024, 0, 20);
      expect(isDateDisabled(date, undefined, undefined, disabledDates)).toBe(true);
    });

    it('handles undefined disabledDates', () => {
      const date = new Date(2024, 0, 20);
      expect(isDateDisabled(date, minDate, maxDate)).toBe(false);
    });
  });

  describe('getDaysInMonth', () => {
    it('returns correct number of days for month', () => {
      const date = new Date(2024, 0, 1); // January 2024
      const days = getDaysInMonth(date);
      
      // Should include days from previous month, current month, and next month
      expect(days.length).toBe(42); // 6 weeks * 7 days
      
      // Check some specific dates
      expect(days[0].getDate()).toBe(31); // December 31, 2023
      expect(days[30].getDate()).toBe(30); // January 30, 2024
      expect(days[41].getDate()).toBe(10); // February 10, 2024
    });

    it('handles February in leap year', () => {
      const date = new Date(2024, 1, 1); // February 2024 (leap year)
      const days = getDaysInMonth(date);
      
      // Should have 29 days in February 2024
      const febDays = days.filter(d => d.getMonth() === 1);
      expect(febDays.length).toBe(29);
    });

    it('handles February in non-leap year', () => {
      const date = new Date(2023, 1, 1); // February 2023 (non-leap year)
      const days = getDaysInMonth(date);
      
      // Should have 28 days in February 2023
      const febDays = days.filter(d => d.getMonth() === 1);
      expect(febDays.length).toBe(28);
    });
  });

  describe('getThemeStyles', () => {
    it('returns light theme styles', () => {
      const styles = getThemeStyles('light');
      expect(styles).toEqual(THEME_MODES.light);
    });

    it('returns dark theme styles', () => {
      const styles = getThemeStyles('dark');
      expect(styles).toEqual(THEME_MODES.dark);
    });
  });

  describe('getColorStyles', () => {
    it('returns blue color scheme', () => {
      const styles = getColorStyles('blue');
      expect(styles).toEqual(COLOR_SCHEMES.blue);
    });

    it('returns green color scheme', () => {
      const styles = getColorStyles('green');
      expect(styles).toEqual(COLOR_SCHEMES.green);
    });

    it('returns purple color scheme', () => {
      const styles = getColorStyles('purple');
      expect(styles).toEqual(COLOR_SCHEMES.purple);
    });

    it('returns orange color scheme', () => {
      const styles = getColorStyles('orange');
      expect(styles).toEqual(COLOR_SCHEMES.orange);
    });

    it('returns slate color scheme', () => {
      const styles = getColorStyles('slate');
      expect(styles).toEqual(COLOR_SCHEMES.slate);
    });

    it('returns rose color scheme', () => {
      const styles = getColorStyles('rose');
      expect(styles).toEqual(COLOR_SCHEMES.rose);
    });
  });

  describe('getInRangeStyle', () => {
    it('returns light theme in-range style for blue', () => {
      const style = getInRangeStyle('light', 'blue');
      expect(style).toContain('bg-opacity-30');
      expect(style).toContain('bg-blue');
    });

    it('returns dark theme in-range style for green', () => {
      const style = getInRangeStyle('dark', 'green');
      expect(style).toContain('bg-opacity-30');
      expect(style).toContain('bg-emerald');
    });
  });

  describe('getPopupPositionClasses', () => {
    it('returns classes for bottom-left position', () => {
      expect(getPopupPositionClasses('bottom-left')).toBe('top-full left-0 mt-2');
    });

    it('returns classes for bottom-right position', () => {
      expect(getPopupPositionClasses('bottom-right')).toBe('top-full right-0 mt-2');
    });

    it('returns classes for top-left position', () => {
      expect(getPopupPositionClasses('top-left')).toBe('bottom-full left-0 mb-2');
    });

    it('returns classes for top-right position', () => {
      expect(getPopupPositionClasses('top-right')).toBe('bottom-full right-0 mb-2');
    });

    it('returns classes for left position', () => {
      expect(getPopupPositionClasses('left')).toBe('right-full top-0 mr-2');
    });

    it('returns classes for right position', () => {
      expect(getPopupPositionClasses('right')).toBe('left-full top-0 ml-2');
    });

    it('returns default (bottom-left) for invalid position', () => {
      expect(getPopupPositionClasses('invalid')).toBe('top-full left-0 mt-2');
    });
  });
});