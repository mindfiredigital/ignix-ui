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
          editUrl: undefined,
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
    image: 'img/docusaurus-social-card.jpg',
    metadata: [
      {
        name: 'description',
        content: 'Beautiful, animated UI components for modern web applications',
      },
      {
        name: 'keywords',
        content: 'Ignix UI, UI components, React components, Tailwind CSS, Tailwind Native, Animated components, Ignix UI components, Ignix UI React components, Ignix UI Tailwind CSS, Ignix UI Tailwind Native, Ignix UI Animated components',
      },{
        name: 'twitter:card',
        content: 'summary_large_image',
      },{
        name: 'twitter:site',
        content: '@mindfiredigital',
      },{
        name: 'twitter:title',
        content: 'Ignix UI',
      },{
        name: 'twitter:description',
        content: 'Beautiful, animated UI components for modern web applications',
      }
    ],
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
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
