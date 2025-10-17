export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  secondary: string;
  secondaryHover: string;
  secondaryActive: string;
  accent: string;
  accentHover: string;
  accentActive: string;
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  border: string;
  borderLight: string;
  borderHover: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeMetadata {
  accessibility: 'AA' | 'AAA';
  contrastRatio: number;
  mood: string[];
  tags: string[];
  industry?: string[];
  author?: string;
  version?: string;
  created?: string;
  updated?: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  category: string;
  description?: string;
  colors: ThemeColors;
  dark?: ThemeColors;
  metadata?: ThemeMetadata;
}

export interface ThemeCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  themes: ThemeConfig[];
}

export interface ThemePresets {
  version: string;
  categories: Record<string, ThemeCategory>;
  featured: string[];
  recent: string[];
}

export interface ThemeState {
  currentTheme: ThemeConfig | null;
  mode: ThemeMode;
  systemPreference: ThemeMode;
  isLoading: boolean;
  error: string | null;
  persistKey: string;
  enableSystemPreference: boolean;
}

export type ThemeAction =
  | { type: 'SET_THEME'; payload: ThemeConfig }
  | { type: 'SET_MODE'; payload: ThemeMode }
  | { type: 'TOGGLE_MODE' }
  | { type: 'SET_SYSTEM_PREFERENCE'; payload: 'light' | 'dark' }
  | { type: 'LOAD_PERSISTED_THEME'; payload: { themeId: string; mode: ThemeMode } }
  | { type: 'RESET_THEME' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export type ContrastLevel = 'AA' | 'AAA';

export type CreateThemeInput = {
  id: string;
  name: string;
  category: string;
  primary: string;
  secondary?: string;
  accent?: string;
  description?: string;
  generateDark?: boolean;
  contrastLevel?: ContrastLevel;
  mode?: ThemeMode; // initial generation mode, defaults to light
};
