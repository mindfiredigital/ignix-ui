const path = require('path');
const validScopes = ['cli', 'docs', 'release', 'component', 'registry', 'storybook', 'cli-tool'];
const scopeMultiPlugin = require(path.resolve(__dirname, 'commitlint-plugin-scope-multi.cjs'));

module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: [scopeMultiPlugin],
  rules: {
    'scope-enum': [0], // Disable default scope-enum to use custom multi-scope validation
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-multi-enum': [2, 'always', validScopes],
  },
  ignores: [message => message.includes('[skip-commitlint]')],
};