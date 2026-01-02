// types.test.ts
import { describe, it, expect, test, vi } from 'vitest';
import type {
  DateFormat,
  DatePickerVariant,
  DatePickerSize,
  PopupPosition,
  ThemeMode,
  ColorScheme,
  DateRange,
  DatePickerProps,
  RangeInputFieldProps
} from '../types';

describe('DatePicker Types', () => {
  describe('Type Guards and Structure', () => {
    test('DateFormat accepts valid formats', () => {
      const validFormats: DateFormat[] = [
        'MM/DD/YYYY',
        'DD/MM/YYYY',
        'YYYY-MM-DD',
        'MMM DD, YYYY',
        'DD MMM YYYY',
        'YYYY/MM/DD'
      ];

      validFormats.forEach(format => {
        expect(format).toBeDefined();
      });
    });

    test('DatePickerVariant accepts valid variants', () => {
      const variants: DatePickerVariant[] = ['single', 'range'];
      expect(variants).toHaveLength(2);
    });

    test('DatePickerSize accepts valid sizes', () => {
      const sizes: DatePickerSize[] = ['sm', 'md', 'lg', 'xl'];
      expect(sizes).toHaveLength(4);
    });

    test('PopupPosition accepts valid positions', () => {
      const positions: PopupPosition[] = [
        'bottom-left',
        'bottom-right',
        'top-left',
        'top-right',
        'left',
        'right'
      ];
      expect(positions).toHaveLength(6);
    });

    test('ThemeMode accepts valid modes', () => {
      const modes: ThemeMode[] = ['light', 'dark'];
      expect(modes).toHaveLength(2);
    });

    test('ColorScheme accepts valid schemes', () => {
      const schemes: ColorScheme[] = ['blue', 'green', 'purple', 'orange', 'slate', 'rose'];
      expect(schemes).toHaveLength(6);
    });

    describe('DateRange interface', () => {
      it('allows null values for start and end', () => {
        const range1: DateRange = { start: null, end: null };
        const range2: DateRange = { start: new Date(), end: null };
        const range3: DateRange = { start: null, end: new Date() };
        const range4: DateRange = { start: new Date(), end: new Date() };

        expect(range1).toBeDefined();
        expect(range2).toBeDefined();
        expect(range3).toBeDefined();
        expect(range4).toBeDefined();
      });
    });

    describe('DatePickerProps interface', () => {
      it('has optional properties', () => {
        const props: DatePickerProps = {};

        expect(props).toBeDefined();
        expect(props.value).toBeUndefined();
        expect(props.onChange).toBeUndefined();
        expect(props.variant).toBeUndefined();
      });

      it('allows all defined properties', () => {
        const mockOnChange = vi.fn();
        const props: DatePickerProps = {
          value: new Date(),
          onChange: mockOnChange,
          variant: 'single',
          placeholder: 'Select date',
          format: 'MM/DD/YYYY',
          size: 'md',
          disabled: false,
          readOnly: false,
          required: false,
          minDate: new Date(),
          maxDate: new Date(),
          disabledDates: [new Date()],
          highlightDates: [new Date()],
          allowEmpty: false,
          todayButton: true,
          clearButton: true,
          autoClose: false,
          className: 'custom-class',
          inputClassName: 'input-class',
          calendarClassName: 'calendar-class',
          themeMode: 'light',
          colorScheme: 'blue',
          popupPosition: 'bottom-left',
          showIcon: true,
          icon: <span>📅</span>,
          error: false,
          errorMessage: 'Error message',
          validateOnChange: true,
          label: 'Select date',
          helperText: 'Helper text',
          weekStart: 0,
          monthNames: ['Jan', 'Feb', 'Mar'],
          dayNames: ['S', 'M', 'T'],
          todayText: 'Today',
          clearText: 'Clear'
        };

        expect(props).toBeDefined();
        expect(props.variant).toBe('single');
        expect(props.size).toBe('md');
        expect(props.themeMode).toBe('light');
      });

      it('allows range variant with DateRange value', () => {
        const mockOnChange = vi.fn();
        const props: DatePickerProps = {
          variant: 'range',
          value: { start: new Date(), end: new Date() },
          onChange: mockOnChange
        };

        expect(props.variant).toBe('range');
        expect(props.value).toBeDefined();
      });

      it('allows string or array for placeholder', () => {
        const props1: DatePickerProps = {
          placeholder: 'Select date'
        };

        const props2: DatePickerProps = {
          placeholder: ['Start date', 'End date']
        };

        expect(props1.placeholder).toBe('Select date');
        expect(Array.isArray(props2.placeholder)).toBe(true);
      });
    });

    describe('RangeInputFieldProps interface', () => {
      it('has required properties', () => {
        const mockOnStartChange = vi.fn();
        const mockOnEndChange = vi.fn();
        const props: RangeInputFieldProps = {
          startRef: { current: null },
          endRef: { current: null },
          startValue: '',
          endValue: '',
          onStartChange: mockOnStartChange,
          onEndChange: mockOnEndChange,
          placeholder: ['Start', 'End'],
          themeMode: 'light'
        };

        expect(props).toBeDefined();
        expect(props.startValue).toBe('');
        expect(props.themeMode).toBe('light');
      });

      it('allows optional properties', () => {
        const mockOnStartChange = vi.fn();
        const mockOnEndChange = vi.fn();
        const mockOnFocus = vi.fn();
        const props: RangeInputFieldProps = {
          startRef: { current: null },
          endRef: { current: null },
          startValue: '2024-01-01',
          endValue: '2024-01-31',
          onStartChange: mockOnStartChange,
          onEndChange: mockOnEndChange,
          placeholder: 'Date range',
          themeMode: 'dark',
          disabled: true,
          readOnly: false,
          showIcon: true,
          icon: <span>📅</span>,
          onFocus: mockOnFocus
        };

        expect(props.disabled).toBe(true);
        expect(props.showIcon).toBe(true);
        expect(props.themeMode).toBe('dark');
      });
    });
  });
});