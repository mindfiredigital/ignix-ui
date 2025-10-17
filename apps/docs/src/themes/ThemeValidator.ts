import { ColorUtils } from '../utils/colorUtils';
import type { ThemeColors, ThemeConfig, ThemeMetadata } from '../types/theme';

export class ThemeValidator {
  static validateTheme(theme: ThemeConfig): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    score: number;
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    this.validateColorSet(theme.colors, 'light', errors, warnings);
    if (theme.dark) this.validateColorSet(theme.dark, 'dark', errors, warnings);

    score -= errors.length * 10;
    score -= warnings.length * 5;
    score = Math.max(0, score);

    return { isValid: errors.length === 0, errors, warnings, score };
  }

  private static validateColorSet(colors: ThemeColors, mode: string, errors: string[], warnings: string[]) {
    // Key pairs: body text, and each filled surface text
    const pairs: Array<[string, string, string]> = [
      ['text', 'background', 'Body text on background'],
      ['textSecondary', 'background', 'Secondary text on background'],
      ['primary', 'background', 'Primary on background'],
      ['text', 'surface', 'Body text on surface'],
    ];

    // For filled surfaces, ensure textInverse will pass if used
    const filledChecks: Array<[string, string]> = [
      [colors.textInverse, colors.primary],
      [colors.textInverse, colors.secondary],
      [colors.textInverse, colors.accent],
      [colors.textInverse, colors.error],
    ];

    pairs.forEach(([fgKey, bgKey, label]) => {
      const fg = colors[fgKey as keyof ThemeColors] as string;
      const bg = colors[bgKey as keyof ThemeColors] as string;
      const ratio = ColorUtils.getContrastRatio(fg, bg).toFixed(2);
      if (!ColorUtils.isAccessible(fg, bg, 'AA')) {
        errors.push(`${mode}: ${label} fails AA (${ratio}:1)`);
      } else if (!ColorUtils.isAccessible(fg, bg, 'AAA')) {
        warnings.push(`${mode}: ${label} fails AAA (${ratio}:1)`);
      }
    });

    filledChecks.forEach(([fg, bg]) => {
      const ratio = ColorUtils.getContrastRatio(fg, bg).toFixed(2);
      if (!ColorUtils.isAccessible(fg, bg, 'AA')) {
        warnings.push(`${mode}: Inverse text on filled surface may fail AA (${ratio}:1)`);
      }
    });

    // Differentiation: primary vs secondary should be distinct
    if (this.getColorSimilarity(colors.primary, colors.secondary) > 0.9) {
      warnings.push(`${mode}: Primary and secondary appear too similar`);
    }
  }

  private static getColorSimilarity(c1: string, c2: string): number {
    const [h1, s1, l1] = ColorUtils.hexToHsl(c1);
    const [h2, s2, l2] = ColorUtils.hexToHsl(c2);
    const hDiff = Math.min(Math.abs(h1 - h2), 360 - Math.abs(h1 - h2)) / 180;
    const sDiff = Math.abs(s1 - s2) / 100;
    const lDiff = Math.abs(l1 - l2) / 100;
    return 1 - (hDiff + sDiff + lDiff) / 3;
  }

  static generateMetadata(theme: ThemeConfig): ThemeMetadata {
    const validation = this.validateTheme(theme);
    const accessibility: 'AA' | 'AAA' | 'Fail' = validation.errors.length === 0 ? 'AA' : 'Fail';

    const contrastRatio = ColorUtils.getContrastRatio(
      theme.colors.text,
      theme.colors.background
    );

    const [h, s, l] = ColorUtils.hexToHsl(theme.colors.primary);
    const mood = this.determineMood(h, s, l);

    return {
      accessibility,
      contrastRatio,
      mood,
      tags: this.generateTags(theme),
      version: '1.0.0',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };
  }

  private static determineMood(h: number, s: number, l: number): string[] {
    const moods: string[] = [];
    if (h < 30) moods.push('energetic', 'passionate');
    else if (h < 60) moods.push('cheerful', 'optimistic');
    else if (h < 120) moods.push('fresh', 'natural');
    else if (h < 180) moods.push('calm', 'trustworthy');
    else if (h < 240) moods.push('cool', 'professional');
    else if (h < 300) moods.push('creative', 'mysterious');
    else moods.push('elegant', 'sophisticated');

    if (s > 70) moods.push('vibrant', 'bold');
    else if (s < 30) moods.push('minimal', 'subtle');

    if (l > 70) moods.push('light', 'airy');
    else if (l < 30) moods.push('dark', 'dramatic');

    return moods;
  }

  private static generateTags(theme: ThemeConfig): string[] {
    const tags: string[] = [];
    tags.push(theme.category);
    const [h] = ColorUtils.hexToHsl(theme.colors.primary);
    if (h < 30) tags.push('red');
    else if (h < 60) tags.push('yellow', 'orange');
    else if (h < 120) tags.push('green');
    else if (h < 180) tags.push('cyan', 'teal');
    else if (h < 240) tags.push('blue');
    else if (h < 300) tags.push('purple');
    else tags.push('pink', 'magenta');

    if (theme.dark) tags.push('dark-mode');
    return tags;
  }
}
