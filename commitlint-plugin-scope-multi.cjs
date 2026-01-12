module.exports = {
  rules: {
    'scope-multi-enum': (parsed, when = 'always', value) => {
      if (!parsed.scope) {
        return [true]; // scope-empty will handle empty scope
      }

      const validScopes = value || ['cli', 'docs', 'release', 'component', 'registry', 'storybook', 'cli-tool'];
      const delimiters = [',', '/'];
      const scopes = parsed.scope
        .split(new RegExp(`[${delimiters.map(d => d === '/' ? '\\/' : d).join('')}]`))
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const invalidScopes = scopes.filter(s => !validScopes.includes(s));
      if (invalidScopes.length > 0) {
        return [
          false,
          `scope must be one of: ${validScopes.join(', ')}. Found invalid scope(s): ${invalidScopes.join(', ')}`,
        ];
      }

      return [true];
    },
  },
};

