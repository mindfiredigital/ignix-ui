/* eslint-env node */
/** @type {import('@mindfiredigital/ignix-cli').IgnixConfig} */
module.exports = {
  // URL to the raw registry.json file on GitHub
  registryUrl:
    'https://raw.githubusercontent.com/mindfiredigital/ignix-ui/main/packages/registry/registry.json',

  // URL to the raw themes.json file on GitHub
  themeUrl:
    'https://raw.githubusercontent.com/mindfiredigital/ignix-ui/main/packages/registry/themes.json',

  // Default directory for UI components
  componentsDir: 'src/components/ui',

  // Default directory for themes
  themesDir: 'src/themes',
};
