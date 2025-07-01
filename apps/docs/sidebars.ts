import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['introduction', 'installation'],
    },
    {
      type: 'category',
      label: 'Components',
      items: ['components/accordion', 'components/badge', 'components/breadcrumbs', 'components/button', 'components/dialog-box', 'components/dropdown', 'components/input', 'components/navbar', 'components/sidebar', 'components/slider', 'components/spinner', 'components/stepper', 'components/switch', 'components/tab', 'components/table', 'components/textarea', 'components/toast', 'components/tooltip'],
    },
  ],
};

export default sidebars;
