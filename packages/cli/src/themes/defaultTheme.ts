import { ThemeConfig } from '../types/theme';

export const defaultTheme: ThemeConfig = {
  id: 'cyberpunk-neon',
  name: 'Cyberpunk Neon',
  category: 'futuristic',
  description: 'High-contrast neon theme with dark background',
  colors: {
    primary: '#FF1493',
    primaryHover: '#FF69B4',
    primaryActive: '#C71585',

    secondary: '#00BFFF',
    secondaryHover: '#1E90FF',
    secondaryActive: '#4682B4',

    accent: '#39FF14',
    accentHover: '#76FF7A',
    accentActive: '#00FF00',

    background: '#0A0A0A',
    backgroundAlt: '#121212',

    surface: '#1A1A1A',
    surfaceAlt: '#222222',

    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    textMuted: '#999999',
    textInverse: '#000000',

    border: '#333333',
    borderLight: '#444444',
    borderHover: '#555555',

    success: '#39FF14',
    successHover: '#76FF7A',

    warning: '#FFD700',
    warningHover: '#FFEA70',

    error: '#FF1493',
    errorHover: '#FF69B4',

    info: '#00BFFF',
    infoHover: '#1E90FF',
  },

  dark: {
    primary: '#FF69B4',
    primaryHover: '#FF85C1',
    primaryActive: '#FF1493',

    secondary: '#87CEEB',
    secondaryHover: '#00BFFF',
    secondaryActive: '#4682B4',

    accent: '#7FFF00',
    accentHover: '#ADFF2F',
    accentActive: '#39FF14',

    background: '#000000',
    backgroundAlt: '#0D0D0D',

    surface: '#111111',
    surfaceAlt: '#1A1A1A',

    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    textMuted: '#999999',
    textInverse: '#000000',

    border: '#444444',
    borderLight: '#555555',
    borderHover: '#666666',

    success: '#7FFF00',
    successHover: '#ADFF2F',

    warning: '#FFD700',
    warningHover: '#FFEA70',

    error: '#FF69B4',
    errorHover: '#FF85C1',

    info: '#87CEEB',
    infoHover: '#00BFFF',
  },

  metadata: {
    accessibility: 'AA',
    contrastRatio: 4.8,
    mood: ['energetic', 'bold', 'futuristic'],
    tags: ['neon', 'cyberpunk', 'gaming', 'dark'],
    industry: ['gaming', 'tech', 'entertainment'],
    author: 'Ignix UI Team',
    version: '1.0.0',
    created: '2025-10-08',
    updated: '2025-10-08',
  },
};
