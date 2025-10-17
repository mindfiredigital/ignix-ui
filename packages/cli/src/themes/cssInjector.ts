import type { ThemeColors } from '../types/theme';

// CSS variable prefix
const CSS_VAR_PREFIX = '--ignix';

// Keep track of injected themes for cleanup
const injectedThemes = new Set<string>();

/**
 * Inject theme colors as CSS custom properties
 */
export function injectCSSVariables(colors: ThemeColors, themeId: string): void {
  const root = document.documentElement;

  // Remove previously injected theme if different
  if (injectedThemes.size > 0 && !injectedThemes.has(themeId)) {
    removeAllCSSVariables();
  }

  // Inject new variables
  Object.entries(colors).forEach(([key, value]) => {
    const cssVar = `${CSS_VAR_PREFIX}-${camelToKebab(key)}`;
    root.style.setProperty(cssVar, value);
  });

  // Track this theme
  injectedThemes.add(themeId);

  // Add theme class to body for CSS targeting
  document.body.className = document.body.className
    .replace(/ignix-theme-\S+/g, '')
    .concat(` ignix-theme-${themeId}`)
    .trim();
}

/**
 * Remove CSS variables for a specific theme
 */
export function removeCSSVariables(themeId: string): void {
  if (!injectedThemes.has(themeId)) return;

  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  // Find and remove all ignix variables
  Array.from(computedStyle).forEach((property) => {
    if (property.startsWith(CSS_VAR_PREFIX)) {
      root.style.removeProperty(property);
    }
  });

  injectedThemes.delete(themeId);

  // Remove theme class
  document.body.className = document.body.className.replace(/ignix-theme-\S+/g, '').trim();
}

/**
 * Remove all injected CSS variables
 */
export function removeAllCSSVariables(): void {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  // Remove all ignix variables
  Array.from(computedStyle).forEach((property) => {
    if (property.startsWith(CSS_VAR_PREFIX)) {
      root.style.removeProperty(property);
    }
  });

  injectedThemes.clear();

  // Remove all theme classes
  document.body.className = document.body.className.replace(/ignix-theme-\S+/g, '').trim();
}

/**
 * Get current CSS variable value
 */
export function getCSSVariable(name: string): string {
  const cssVar = name.startsWith('--') ? name : `${CSS_VAR_PREFIX}-${camelToKebab(name)}`;
  return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
}

/**
 * Convert camelCase to kebab-case
 */
function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Generate CSS custom properties string
 */
export function generateCSSVariables(colors: ThemeColors): string {
  const variables = Object.entries(colors)
    .map(([key, value]) => `  ${CSS_VAR_PREFIX}-${camelToKebab(key)}: ${value};`)
    .join('\n');

  return `:root {\n${variables}\n}`;
}

/**
 * Generate CSS file content for a theme
 */
export function generateThemeCSS(colors: ThemeColors, themeName: string): string {
  const lightVars = generateCSSVariables(colors);

  return `/* ${themeName} Theme */
${lightVars}

/* Component styles using theme variables */
.ignix-button {
  background-color: var(${CSS_VAR_PREFIX}-primary);
  color: var(${CSS_VAR_PREFIX}-text-inverse);
  border: 1px solid var(${CSS_VAR_PREFIX}-primary);
  border-radius: 6px;
  padding: 8px 16px;
  transition: all 0.2s ease;
}

.ignix-button:hover {
  background-color: var(${CSS_VAR_PREFIX}-primary-hover);
  border-color: var(${CSS_VAR_PREFIX}-primary-hover);
}

.ignix-button:active {
  background-color: var(${CSS_VAR_PREFIX}-primary-active);
  border-color: var(${CSS_VAR_PREFIX}-primary-active);
}

.ignix-container {
  background-color: var(${CSS_VAR_PREFIX}-background);
  color: var(${CSS_VAR_PREFIX}-text);
  border: 1px solid var(${CSS_VAR_PREFIX}-border);
}

.ignix-surface {
  background-color: var(${CSS_VAR_PREFIX}-surface);
  color: var(${CSS_VAR_PREFIX}-text);
  border: 1px solid var(${CSS_VAR_PREFIX}-border-light);
}
`;
}
