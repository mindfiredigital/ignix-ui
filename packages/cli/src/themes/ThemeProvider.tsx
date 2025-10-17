import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ThemeConfig, ThemeMode, ThemeState } from '../types/theme';
import { themeReducer, initialThemeState } from './ThemeReducer';
import { injectCSSVariables, removeCSSVariables } from './cssInjector';

interface ThemeContextValue {
  state: ThemeState;
  setTheme: (theme: ThemeConfig) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeConfig;
  defaultMode?: ThemeMode;
  persistKey?: string;
  enableSystemPreference?: boolean;
  onThemeChange?: (theme: ThemeConfig) => void;
  onModeChange?: (mode: ThemeMode) => void;
}

export function ThemeProvider({
  children,
  defaultTheme,
  defaultMode = 'light',
  persistKey = 'ignix-theme',
  enableSystemPreference = true,
  onThemeChange,
  onModeChange,
}: ThemeProviderProps) {
  // Initialize state with reducer
  const [state, dispatch] = useReducer(themeReducer, {
    ...initialThemeState,
    currentTheme: defaultTheme || initialThemeState.currentTheme,
    mode: defaultMode,
    persistKey,
    enableSystemPreference,
  });

  // Load persisted theme on mount
  useEffect(() => {
    const loadPersistedTheme = async () => {
      try {
        const stored = localStorage.getItem(persistKey);
        if (stored) {
          const { themeId, mode } = JSON.parse(stored);
          dispatch({ type: 'LOAD_PERSISTED_THEME', payload: { themeId, mode } });
        }
      } catch (error) {
        console.warn('Failed to load persisted theme:', error);
      }

      // Handle system preference for dark mode
      if (enableSystemPreference) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemChange = (e: MediaQueryListEvent) => {
          dispatch({
            type: 'SET_SYSTEM_PREFERENCE',
            payload: e.matches ? 'dark' : 'light',
          });
        };

        mediaQuery.addEventListener('change', handleSystemChange);
        dispatch({
          type: 'SET_SYSTEM_PREFERENCE',
          payload: mediaQuery.matches ? 'dark' : 'light',
        });

        return () => mediaQuery.removeEventListener('change', handleSystemChange);
      }
    };

    loadPersistedTheme();
  }, [persistKey, enableSystemPreference]);

  // Apply CSS variables when theme or mode changes
  useEffect(() => {
    if (state.currentTheme) {
      const colors =
        state.mode === 'dark' && state.currentTheme.dark
          ? state.currentTheme.dark
          : state.currentTheme.colors;

      injectCSSVariables(colors, state.currentTheme.id);

      // Persist theme selection
      try {
        localStorage.setItem(
          persistKey,
          JSON.stringify({
            themeId: state.currentTheme.id,
            mode: state.mode,
          })
        );
      } catch (error) {
        console.warn('Failed to persist theme:', error);
      }
    }

    return () => {
      if (state.currentTheme) {
        removeCSSVariables(state.currentTheme.id);
      }
    };
  }, [state.currentTheme, state.mode, persistKey]);

  // Notify parent components of changes
  useEffect(() => {
    if (state.currentTheme && onThemeChange) {
      onThemeChange(state.currentTheme);
    }
  }, [state.currentTheme, onThemeChange]);

  useEffect(() => {
    if (onModeChange) {
      onModeChange(state.mode);
    }
  }, [state.mode, onModeChange]);

  // Action handlers
  const setTheme = useCallback((theme: ThemeConfig) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  }, []);

  const setMode = useCallback((mode: ThemeMode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  }, []);

  const toggleMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_MODE' });
  }, []);

  const resetTheme = useCallback(() => {
    dispatch({ type: 'RESET_THEME' });
  }, []);

  const contextValue: ThemeContextValue = {
    state,
    setTheme,
    setMode,
    toggleMode,
    resetTheme,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

// Hook for consuming theme context
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Convenience hooks
export function useCurrentTheme(): ThemeConfig | null {
  const { state } = useTheme();
  return state.currentTheme;
}

export function useThemeMode(): ThemeMode {
  const { state } = useTheme();
  return state.mode;
}

export function useThemeColors() {
  const { state } = useTheme();
  if (!state.currentTheme) return null;

  return state.mode === 'dark' && state.currentTheme.dark
    ? state.currentTheme.dark
    : state.currentTheme.colors;
}
