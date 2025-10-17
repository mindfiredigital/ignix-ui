import type { ThemeColors } from '../types/theme';

// Map internal ThemeColors to shadcn-style tokens chosen earlier.
export function mapToIgnixTokens(colors: ThemeColors): Record<string, string> {
  return {
    '--background': colors.background,
    '--foreground': colors.text,

    '--muted': colors.surfaceAlt ?? colors.backgroundAlt,
    '--muted-foreground': colors.textMuted,

    '--border': colors.border,

    '--primary': colors.primary,
    '--primary-foreground': colors.textInverse,

    '--secondary': colors.secondary,
    '--secondary-foreground': colors.textInverse,

    '--accent': colors.accent,
    '--accent-foreground': colors.textInverse,

    '--destructive': colors.error, // destructive mapped to error hue
    '--destructive-foreground': colors.textInverse,

    '--success': colors.success,
    '--warning': colors.warning,
    '--error': colors.error,
    '--info': colors.info,
  } as const;
}
