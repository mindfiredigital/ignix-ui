import type { ThemeState, ThemeAction } from '../types/theme';
import { defaultTheme } from './defaultTheme';

export const initialThemeState: ThemeState = {
  currentTheme: defaultTheme,
  mode: 'light',
  systemPreference: 'light',
  isLoading: false,
  error: null,
  persistKey: 'ignix-theme',
  enableSystemPreference: true,
};

export function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  let newMode: 'light' | 'dark';
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        currentTheme: action.payload,
        error: null,
      };

    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload,
      };

    case 'TOGGLE_MODE':
      newMode = state.mode === 'light' ? 'dark' : 'light';
      return {
        ...state,
        mode: newMode,
      };

    case 'SET_SYSTEM_PREFERENCE':
      return {
        ...state,
        systemPreference: action.payload,
        mode: state.enableSystemPreference && state.mode === 'system' ? action.payload : state.mode,
      };

    case 'LOAD_PERSISTED_THEME':
      // This would typically load from PresetLoader
      return {
        ...state,
        mode: action.payload.mode,
        // currentTheme would be loaded via PresetLoader
      };

    case 'RESET_THEME':
      return {
        ...state,
        currentTheme: defaultTheme,
        mode: 'light',
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
}
