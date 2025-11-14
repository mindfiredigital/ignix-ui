/* eslint-env node */
/** @type {import('@mindfiredigital/ignix-cli').IgnixConfig} */
module.exports = {
  // URL to the raw registry.json file on GitHub
  registryUrl:
    'https://raw.githubusercontent.com/mindfiredigital/ignix-ui/main/packages/registry/registry.json',

  // URL to the raw themes.json file on GitHub
  themeUrl:
    'https://raw.githubusercontent.com/mindfiredigital/ignix-ui/main/packages/registry/themes.json',

<<<<<<< HEAD
  // URL to the raw themes.json file on GitHub
  templateUrl:
    'https://raw.githubusercontent.com/mindfiredigital/ignix-ui/main/packages/registry/template.json',
=======
  // URL to the raw templates.json file on GitHub
  templateUrl: 'https://raw.githubusercontent.com/mindfiredigital/ignix-ui/main/packages/registry/templates.json',
>>>>>>> 897a019 (feat : Add single-column-layout template)

  // Default directory for UI components
  componentsDir: 'src/components/ui',

  // Default directory for themes
  themesDir: 'src/themes',

<<<<<<< HEAD
  // Template directory for Layouts
  templateLayoutDir: 'src/components/templates',
=======
  // Default directory for templates
  templatesDir: 'src/templates',
>>>>>>> 897a019 (feat : Add single-column-layout template)
};
