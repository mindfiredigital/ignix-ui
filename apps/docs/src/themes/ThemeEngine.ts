import { ThemeGenerator } from './ThemeGenerator';
import { ThemeValidator } from './ThemeValidator';
import { ColorUtils } from '../utils/colorUtils';
import { toCssVars } from '../utils/cssEmitter';
import type {
  CreateThemeInput,
  ThemeConfig,
  ContrastLevel
} from '../types/theme';

export class ThemeEngine {
  static ColorUtils = ColorUtils;
  static Generator = ThemeGenerator;
  static Validator = ThemeValidator;

  static createTheme(input: CreateThemeInput): ThemeConfig {
    const {
      id,
      name,
      category,
      primary,
      secondary = ColorUtils.getComplementary(primary),
      accent,
      description,
      generateDark = true,
      contrastLevel = 'AA',
      mode = 'light',
    } = input;

    const colors = ThemeGenerator.generateThemeColors(primary, secondary, {
      accent,
      mode,
      contrastLevel,
    });

    const dark = generateDark
      ? ThemeGenerator.generateDarkMode(colors, contrastLevel)
      : undefined;

    const theme: ThemeConfig = {
      id,
      name,
      category,
      description,
      colors,
      dark,
    };

    theme.metadata = ThemeValidator.generateMetadata(theme);
    return theme;
  }

  static validateAndFix(theme: ThemeConfig, level: ContrastLevel = 'AA') {
    const validation = ThemeValidator.validateTheme(theme);

    if (!validation.isValid) {
      const fixedColors = ThemeGenerator.generateThemeColors(
        theme.colors.primary,
        theme.colors.secondary,
        { accent: theme.colors.accent, contrastLevel: level }
      );
      const fixedDark = theme.dark
        ? ThemeGenerator.generateDarkMode(fixedColors, level)
        : undefined;

      const fixedTheme: ThemeConfig = {
        ...theme,
        colors: fixedColors,
        dark: fixedDark,
      };

      const revalidation = ThemeValidator.validateTheme(fixedTheme);
      return { theme: fixedTheme, validation: revalidation };
    }

    return { theme, validation };
  }

  static toCss(theme: ThemeConfig): string {
    return toCssVars(theme);
  }
}
