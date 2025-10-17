import type { ThemePresets, ThemeConfig, ThemeCategory } from '../types/theme';

// Cache for loaded presets
const presetCache = new Map<string, ThemePresets>();
const themeCache = new Map<string, ThemeConfig>();

export class PresetLoader {
  private static baseUrl = '/themes';
  private static version = '1.0.0';

  /**
   * Load all theme presets
   */
  static async loadPresets(): Promise<ThemePresets> {
    const cacheKey = `presets-${this.version}`;

    if (presetCache.has(cacheKey)) {
      return presetCache.get(cacheKey)!;
    }

    try {
      const response = await fetch(`${this.baseUrl}/presets.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch presets: ${response.statusText}`);
      }

      const presets: ThemePresets = await response.json();

      // Validate presets structure
      this.validatePresets(presets);

      // Cache the result
      presetCache.set(cacheKey, presets);

      // Pre-cache individual themes
      this.precacheThemes(presets);

      return presets;
    } catch (error) {
      console.error('Failed to load theme presets:', error);
      // Return fallback presets
      return this.getFallbackPresets();
    }
  }

  /**
   * Load themes by category
   */
  static async loadCategory(categoryId: string): Promise<ThemeCategory | null> {
    try {
      const presets = await this.loadPresets();
      return presets.categories[categoryId] || null;
    } catch (error) {
      console.error(`Failed to load category ${categoryId}:`, error);
      return null;
    }
  }

  /**
   * Load a specific theme by ID
   */
  static async loadTheme(themeId: string): Promise<ThemeConfig | null> {
    // Check cache first
    if (themeCache.has(themeId)) {
      return themeCache.get(themeId)!;
    }

    try {
      const presets = await this.loadPresets();

      // Search through all categories
      for (const category of Object.values(presets.categories)) {
        const theme = category.themes.find((t) => t.id === themeId);
        if (theme) {
          themeCache.set(themeId, theme);
          return theme;
        }
      }

      return null;
    } catch (error) {
      console.error(`Failed to load theme ${themeId}:`, error);
      return null;
    }
  }

  /**
   * Search themes by query
   */
  static async searchThemes(query: string): Promise<ThemeConfig[]> {
    try {
      const presets = await this.loadPresets();
      const results: ThemeConfig[] = [];
      const lowerQuery = query.toLowerCase();

      for (const category of Object.values(presets.categories)) {
        for (const theme of category.themes) {
          // Search in name, description, category, and tags
          const searchableText = [
            theme.name,
            theme.description || '',
            theme.category,
            ...(theme.metadata?.tags || []),
            ...(theme.metadata?.mood || []),
          ]
            .join(' ')
            .toLowerCase();

          if (searchableText.includes(lowerQuery)) {
            results.push(theme);
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Failed to search themes:', error);
      return [];
    }
  }

  /**
   * Get themes by category
   */
  static async getThemesByCategory(categoryId: string): Promise<ThemeConfig[]> {
    try {
      const category = await this.loadCategory(categoryId);
      return category?.themes || [];
    } catch (error) {
      console.error(`Failed to get themes for category ${categoryId}:`, error);
      return [];
    }
  }

  /**
   * Get featured themes
   */
  static async getFeaturedThemes(): Promise<ThemeConfig[]> {
    try {
      const presets = await this.loadPresets();
      const featured: ThemeConfig[] = [];

      for (const themeId of presets.featured) {
        const theme = await this.loadTheme(themeId);
        if (theme) {
          featured.push(theme);
        }
      }

      return featured;
    } catch (error) {
      console.error('Failed to load featured themes:', error);
      return [];
    }
  }

  /**
   * Get recently used themes
   */
  static async getRecentThemes(): Promise<ThemeConfig[]> {
    try {
      const presets = await this.loadPresets();
      const recent: ThemeConfig[] = [];

      for (const themeId of presets.recent) {
        const theme = await this.loadTheme(themeId);
        if (theme) {
          recent.push(theme);
        }
      }

      return recent;
    } catch (error) {
      console.error('Failed to load recent themes:', error);
      return [];
    }
  }

  /**
   * Filter themes by criteria
   */
  static async filterThemes(criteria: {
    category?: string;
    accessibility?: 'AA' | 'AAA';
    mood?: string[];
    tags?: string[];
    hasDarkMode?: boolean;
  }): Promise<ThemeConfig[]> {
    try {
      const presets = await this.loadPresets();
      let results: ThemeConfig[] = [];

      // Get themes from specified category or all categories
      if (criteria.category) {
        const category = presets.categories[criteria.category];
        if (category) {
          results = [...category.themes];
        }
      } else {
        results = Object.values(presets.categories).flatMap((cat) => cat.themes);
      }

      // Apply filters
      return results.filter((theme) => {
        // Accessibility filter
        if (criteria.accessibility && theme.metadata?.accessibility !== criteria.accessibility) {
          return false;
        }

        // Mood filter
        if (criteria.mood?.length) {
          const themeMoods = theme.metadata?.mood || [];
          if (!criteria.mood.some((mood) => themeMoods.includes(mood))) {
            return false;
          }
        }

        // Tags filter
        if (criteria.tags?.length) {
          const themeTags = theme.metadata?.tags || [];
          if (!criteria.tags.some((tag) => themeTags.includes(tag))) {
            return false;
          }
        }

        // Dark mode filter
        if (criteria.hasDarkMode !== undefined) {
          if (criteria.hasDarkMode && !theme.dark) {
            return false;
          }
          if (!criteria.hasDarkMode && theme.dark) {
            return false;
          }
        }

        return true;
      });
    } catch (error) {
      console.error('Failed to filter themes:', error);
      return [];
    }
  }

  /**
   * Get theme statistics
   */
  static async getStatistics(): Promise<{
    totalThemes: number;
    totalCategories: number;
    accessibilityBreakdown: Record<string, number>;
    categoryBreakdown: Record<string, number>;
  }> {
    try {
      const presets = await this.loadPresets();
      const categories = Object.values(presets.categories);
      const allThemes = categories.flatMap((cat) => cat.themes);

      const accessibilityBreakdown = allThemes.reduce((acc, theme) => {
        const level = theme.metadata?.accessibility || 'Unknown';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const categoryBreakdown = categories.reduce((acc, category) => {
        acc[category.name] = category.themes.length;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalThemes: allThemes.length,
        totalCategories: categories.length,
        accessibilityBreakdown,
        categoryBreakdown,
      };
    } catch (error) {
      console.error('Failed to get statistics:', error);
      return {
        totalThemes: 0,
        totalCategories: 0,
        accessibilityBreakdown: {},
        categoryBreakdown: {},
      };
    }
  }

  /**
   * Validate presets structure
   */
  private static validatePresets(presets: ThemePresets): void {
    if (!presets.version) {
      throw new Error('Presets missing version');
    }

    if (!presets.categories || typeof presets.categories !== 'object') {
      throw new Error('Presets missing categories');
    }

    // Validate each category
    for (const [categoryId, category] of Object.entries(presets.categories)) {
      if (!category.name || !category.themes || !Array.isArray(category.themes)) {
        throw new Error(`Invalid category: ${categoryId}`);
      }

      // Validate each theme
      for (const theme of category.themes) {
        this.validateTheme(theme);
      }
    }
  }

  /**
   * Validate individual theme structure
   */
  private static validateTheme(theme: ThemeConfig): void {
    const required = ['id', 'name', 'category', 'colors'];

    for (const field of required) {
      if (!theme[field as keyof ThemeConfig]) {
        throw new Error(`Theme ${theme.id || 'unknown'} missing required field: ${field}`);
      }
    }

    // Validate colors object
    const requiredColors = [
      'primary',
      'secondary',
      'accent',
      'background',
      'surface',
      'text',
      'textSecondary',
      'border',
    ];

    for (const color of requiredColors) {
      if (!theme.colors[color as keyof typeof theme.colors]) {
        throw new Error(`Theme ${theme.id} missing required color: ${color}`);
      }
    }
  }

  /**
   * Pre-cache themes for better performance
   */
  private static precacheThemes(presets: ThemePresets): void {
    for (const category of Object.values(presets.categories)) {
      for (const theme of category.themes) {
        themeCache.set(theme.id, theme);
      }
    }
  }

  /**
   * Get fallback presets when loading fails
   */
  private static getFallbackPresets(): ThemePresets {
    return {
      version: '1.0.0',
      categories: {
        accessibility: {
          id: 'accessibility',
          name: 'Accessibility-First',
          description: 'High contrast, WCAG compliant themes',
          themes: [
            {
              id: 'high-contrast-noir',
              name: 'High-Contrast Noir',
              category: 'accessibility',
              description: 'Maximum contrast black and white theme',
              colors: {
                primary: '#000000',
                primaryHover: '#333333',
                primaryActive: '#666666',
                secondary: '#333333',
                secondaryHover: '#666666',
                secondaryActive: '#999999',
                accent: '#0066FF',
                accentHover: '#0052CC',
                accentActive: '#003D99',
                background: '#FFFFFF',
                backgroundAlt: '#FAFAFA',
                surface: '#F8F8F8',
                surfaceAlt: '#F3F3F3',
                text: '#000000',
                textSecondary: '#333333',
                textMuted: '#666666',
                textInverse: '#FFFFFF',
                border: '#000000',
                borderLight: '#333333',
                borderHover: '#666666',
                success: '#008000',
                warning: '#FF8C00',
                error: '#FF0000',
                info: '#0066FF',
              },
              dark: {
                primary: '#FFFFFF',
                primaryHover: '#CCCCCC',
                primaryActive: '#999999',
                secondary: '#CCCCCC',
                secondaryHover: '#999999',
                secondaryActive: '#666666',
                accent: '#66B3FF',
                accentHover: '#99CCFF',
                accentActive: '#CCE5FF',
                background: '#000000',
                backgroundAlt: '#050505',
                surface: '#111111',
                surfaceAlt: '#1A1A1A',
                text: '#FFFFFF',
                textSecondary: '#CCCCCC',
                textMuted: '#999999',
                textInverse: '#000000',
                border: '#FFFFFF',
                borderLight: '#CCCCCC',
                borderHover: '#999999',
                success: '#00FF00',
                warning: '#FFD700',
                error: '#FF6666',
                info: '#66B3FF',
              },
              metadata: {
                accessibility: 'AAA',
                contrastRatio: 21,
                mood: ['professional', 'high-contrast'],
                tags: ['accessibility', 'high-contrast', 'monochrome'],
              },
            },
          ],
        },
      },
      featured: ['high-contrast-noir'],
      recent: [],
    };
  }

  /**
   * Clear all caches
   */
  static clearCache(): void {
    presetCache.clear();
    themeCache.clear();
  }

  /**
   * Set custom base URL for theme loading
   */
  static setBaseUrl(url: string): void {
    this.baseUrl = url;
    this.clearCache(); // Clear cache when URL changes
  }
}

// React hooks for easier integration
import { useState, useEffect } from 'react';

/**
 * Hook to load and manage theme presets
 */
export function useThemePresets() {
  const [presets, setPresets] = useState<ThemePresets | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    PresetLoader.loadPresets()
      .then(setPresets)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    PresetLoader.clearCache();

    try {
      const newPresets = await PresetLoader.loadPresets();
      setPresets(newPresets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load presets');
    } finally {
      setLoading(false);
    }
  };

  return {
    presets,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to search themes
 */
export function useThemeSearch(query: string) {
  const [results, setResults] = useState<ThemeConfig[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    PresetLoader.searchThemes(query)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [query]);

  return { results, loading };
}

/**
 * Hook to filter themes
 */
export function useThemeFilter(criteria: Parameters<typeof PresetLoader.filterThemes>[0]) {
  const [results, setResults] = useState<ThemeConfig[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    PresetLoader.filterThemes(criteria)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [JSON.stringify(criteria)]);

  return { results, loading };
}

/**
 * Hook to load a specific theme
 */
export function useTheme(themeId: string) {
  const [theme, setTheme] = useState<ThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!themeId) {
      setTheme(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    PresetLoader.loadTheme(themeId)
      .then(setTheme)
      .finally(() => setLoading(false));
  }, [themeId]);

  return { theme, loading };
}
