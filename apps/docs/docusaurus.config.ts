import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Ignix UI',
  tagline: 'Beautiful, animated UI components for modern web applications',
  favicon: 'img/logo.png',
  url: 'https://ignix-ui.com',
  baseUrl: '/ignix-ui/',
  organizationName: 'mindfiredigital',
  projectName: 'ignix-ui',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://mindfiredigital.github.io/ignix-ui/',
          sidebarCollapsed: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    image: 'img/social-card.jpg',
    navbar: {
      title: 'Ignix UI',
      logo: {
        alt: 'Ignix UI Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          versions: {
            '1.0.0': {label: 'Version 1.0'},
          },
        },
        {
          href: 'https://github.com/mindfiredigital/ignix-ui',
          className: 'header--github-link',
          "aria-label": 'GitHub repository',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      copyright: `Copyright © ${new Date().getFullYear()} Ignix UI.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: {start: 'highlight-start', end: 'highlight-end'},
        },
        {
          className: 'code-block-error-line',
          line: 'error-next-line',
        },
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config; 