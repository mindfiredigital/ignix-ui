import { ColorUtils } from './colorUtils';
import type { ThemeColors, ContrastLevel, ThemeMode } from '../types/theme';

export class ThemeGenerator {
  static generateHoverColor(base: string): string {
    const [h, s, l] = ColorUtils.hexToHsl(base);
    const adj = l > 50 ? -8 : 8; // small perceptual step
    return ColorUtils.hslToHex(h, s, l + adj);
  }

  static generateActiveColor(base: string): string {
    const [h, s, l] = ColorUtils.hexToHsl(base);
    const adj = l > 50 ? -15 : 15; // stronger than hover
    return ColorUtils.hslToHex(h, s, l + adj);
  }

  static ensureContrast(color: string, background: string, level: ContrastLevel = 'AA'): string {
    const target = level === 'AAA' ? 7 : 4.5;
    if (ColorUtils.getContrastRatio(color, background) >= target) return color;

    // Attempt adjusting L first
    const [h, s, l] = ColorUtils.hexToHsl(color);
    const bgL = ColorUtils.getLuminance(background);
    const isDarkBg = bgL < 0.5;

    for (let step = 5; step <= 50; step += 5) {
      const cand = ColorUtils.hslToHex(
        h,
        s,
        ColorUtils.clamp(isDarkBg ? l + step : l - step, 0, 100)
      );
      if (ColorUtils.getContrastRatio(cand, background) >= target) return cand;
    }

    // Try saturation tweak to reduce color glare but keep hue
    for (let sAdj = 10; sAdj <= 40; sAdj += 10) {
      const cand = ColorUtils.hslToHex(
        h,
        ColorUtils.clamp(s + (isDarkBg ? -sAdj : sAdj), 0, 100),
        l
      );
      if (ColorUtils.getContrastRatio(cand, background) >= target) return cand;
    }

    // Fallback to hard black/white
    return isDarkBg ? '#FFFFFF' : '#000000';
  }

  static generateThemeColors(
    primary: string,
    secondary: string,
    options: {
      accent?: string;
      mode?: ThemeMode;
      contrastLevel?: ContrastLevel;
    } = {}
  ): ThemeColors {
    const { accent, mode = 'light', contrastLevel = 'AA' } = options;
    const isDark = mode === 'dark';

    // TODO: Allow custom neutrals
    // Neutrals similar to shadcn baselines (tuned for legibility)
    const background = isDark ? '#0B0B0C' : '#FFFFFF';
    const backgroundAlt = isDark ? '#080809' : '#FAFAFA';
    const surface = isDark ? '#141417' : '#F7F8FA';
    const surfaceAlt = isDark ? '#1A1B1E' : '#F1F2F5';

    // TODO: Allow custom text colors
    // Base text
    const text = this.ensureContrast(isDark ? '#F5F7FA' : '#0F172A', background, contrastLevel);
    const textSecondary = this.ensureContrast(
      isDark ? '#D1D5DB' : '#475569',
      background,
      contrastLevel
    );
    const textMuted = this.ensureContrast(
      isDark ? '#9CA3AF' : '#6B7280',
      background,
      contrastLevel
    );
    const textInverse = isDark ? '#0F172A' : '#FFFFFF';

    // TODO: Allow custom border colors
    // Borders
    const border = isDark ? '#2A2B31' : '#D1D5DB';
    const borderLight = isDark ? '#202127' : '#E5E7EB';
    const borderHover = isDark ? '#3A3B45' : '#BFC3CA';

    // Actions
    const primaryFixed = this.ensureContrast(primary, background, contrastLevel);
    const secondaryFixed = this.ensureContrast(secondary, background, contrastLevel);
    const acc = accent || ColorUtils.getComplementary(primary);
    const accentFixed = this.ensureContrast(acc, background, contrastLevel);

    // TODO: Allow custom status colors
    // Status (can be tuned; ensure AA vs background)
    const successBase = isDark ? '#10B981' : '#059669';
    const warningBase = isDark ? '#F59E0B' : '#D97706';
    const errorBase = isDark ? '#EF4444' : '#DC2626';
    const infoBase = isDark ? '#3B82F6' : '#2563EB';

    const success = this.ensureContrast(successBase, background, contrastLevel);
    const warning = this.ensureContrast(warningBase, background, contrastLevel);
    const error = this.ensureContrast(errorBase, background, contrastLevel);
    const info = this.ensureContrast(infoBase, background, contrastLevel);

    return {
      background,
      backgroundAlt,
      surface,
      surfaceAlt,
      text,
      textSecondary,
      textMuted,
      textInverse,

      primary: primaryFixed,
      primaryHover: this.generateHoverColor(primaryFixed),
      primaryActive: this.generateActiveColor(primaryFixed),

      secondary: secondaryFixed,
      secondaryHover: this.generateHoverColor(secondaryFixed),
      secondaryActive: this.generateActiveColor(secondaryFixed),

      accent: accentFixed,
      accentHover: this.generateHoverColor(accentFixed),
      accentActive: this.generateActiveColor(accentFixed),

      border,
      borderLight,
      borderHover,

      success,
      successHover: this.generateHoverColor(success),
      warning,
      warningHover: this.generateHoverColor(warning),
      error,
      errorHover: this.generateHoverColor(error),
      info,
      infoHover: this.generateHoverColor(info),
    };
  }

  static generateDarkMode(light: ThemeColors, contrastLevel: ContrastLevel = 'AA'): ThemeColors {
    return this.generateThemeColors(light.primary, light.secondary, {
      accent: light.accent,
      mode: 'dark',
      contrastLevel,
    });
  }
}
