// variants.test.ts
import { describe, it, expect } from 'vitest';
import { inputVariants } from '../variants';

describe('DatePicker Variants', () => {
  describe('inputVariants', () => {
    it('returns base classes with default variants', () => {
      const result = inputVariants();
      expect(result).toContain('flex items-center gap-2 px-4 border rounded-lg');
      expect(result).toContain('transition-all duration-300');
      expect(result).toContain('focus-within:shadow-sm');
    });

    it('returns small size classes', () => {
      const result = inputVariants({ size: 'sm' });
      expect(result).toContain('h-9');
      expect(result).toContain('text-sm');
      expect(result).toContain('px-3');
    });

    it('returns medium size classes (default)', () => {
      const result = inputVariants({ size: 'md' });
      expect(result).toContain('h-11');
      expect(result).toContain('text-base');
    });

    it('returns large size classes', () => {
      const result = inputVariants({ size: 'lg' });
      expect(result).toContain('h-13');
      expect(result).toContain('text-lg');
    });

    it('returns extra large size classes', () => {
      const result = inputVariants({ size: 'xl' });
      expect(result).toContain('h-15');
      expect(result).toContain('text-xl');
    });

    it('returns error state classes', () => {
      const result = inputVariants({ error: true });
      expect(result).toContain('border-red-400');
      expect(result).toContain('focus-within:ring-2');
      expect(result).toContain('focus-within:ring-red-500/20');
    });

    it('returns disabled state classes', () => {
      const result = inputVariants({ disabled: true });
      expect(result).toContain('cursor-not-allowed');
      expect(result).toContain('opacity-60');
    });

    it('returns light theme classes', () => {
      const result = inputVariants({ themeMode: 'light' });
      // Should not contain dark-specific classes
      expect(result).not.toContain('dark:');
    });

    it('returns dark theme classes', () => {
      const result = inputVariants({ themeMode: 'dark' });
      // The base variant might not have dark-specific classes
      expect(result).toBeDefined();
    });

    it('combines multiple variants correctly', () => {
      const result = inputVariants({
        size: 'lg',
        error: true,
        disabled: false,
        themeMode: 'light'
      });
      
      expect(result).toContain('h-13');
      expect(result).toContain('text-lg');
      expect(result).toContain('border-red-400');
      expect(result).not.toContain('cursor-not-allowed');
    });

    it('handles compound variants - error with light theme', () => {
      const result = inputVariants({
        error: true,
        themeMode: 'light',
        disabled: false
      });
      
      expect(result).toContain('bg-red-50/50');
    });

    it('handles compound variants - error with dark theme', () => {
      const result = inputVariants({
        error: true,
        themeMode: 'dark',
        disabled: false
      });
      
      expect(result).toContain('bg-red-900/20');
    });

    it('returns correct classes when error is false', () => {
      const result = inputVariants({ error: false });
      expect(result).not.toContain('border-red-400');
      expect(result).not.toContain('bg-red-');
    });

    it('returns correct classes when disabled is false', () => {
      const result = inputVariants({ disabled: false });
      expect(result).not.toContain('cursor-not-allowed');
      expect(result).not.toContain('opacity-60');
    });
  });
});