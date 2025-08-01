/**
 * Central configuration constants for the CLI
 * Contains registry endpoints and project paths
 */
export const REGISTRY_CONFIG = {
  /** Base URL for the components registry */

  BASE_URL: 'https://raw.githubusercontent.com/mindfiredigital/ignix-ui/main/packages/registry',

  /** Registry path configuration */
  PATHS: {
    /** Path to registry index file */
    REGISTRY: '/registry.json',
    /** Base path for component files */
    COMPONENTS: '/components',
  },
} as const;

/**
 * Project-specific path configuration
 * Defines standard locations for project files and directories
 */
export const PROJECT_PATHS = {
  /** Directory for UI components */
  COMPONENTS_DIR: 'src/components/ui',
  /** Directory for utility functions */
  UTILS_DIR: 'src/utils',
  /** Directory for global styles */
  STYLES_DIR: 'src/styles',
  /** Configuration file paths */
  CONFIG_FILES: {
    /** Tailwind configuration file */
    TAILWIND: 'tailwind.config.js',
    /** Package configuration file */
    PACKAGE_JSON: 'package.json',
  },
} as const;
