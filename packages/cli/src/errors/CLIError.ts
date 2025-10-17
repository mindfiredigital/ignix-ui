/**
 * Custom error classes for CLI operations
 * Provides structured error handling with suggestions
 */

/**
 * Base CLI error class
 * Includes error code and optional recovery suggestions
 */
export class CLIError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly suggestions?: string[]
  ) {
    super(message);
    this.name = 'CLIError';
  }
}

/**
 * Specific error for component not found scenarios
 * Provides helpful suggestions for recovery
 */
export class ComponentNotFoundError extends CLIError {
  constructor(componentName: string) {
    super(`Component "${componentName}" not found in registry`, 'COMPONENT_NOT_FOUND', [
      'Check available components with: ignix list components',
    ]);
  }
}

/**
 * Error class for registry-related failures
 * Handles network and data validation errors
 */
export class RegistryError extends CLIError {
  constructor(message: string) {
    super(`Registry error: ${message}`, 'REGISTRY_ERROR', ['Try again later or report this issue']);
  }
}
