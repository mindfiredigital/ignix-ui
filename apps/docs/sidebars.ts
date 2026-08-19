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
      items: [
        {
          type: 'doc',
          id: 'components/all-components/index',
          label: 'All Components',
        },
        {
          type: 'category',
          label: 'Inputs',
          items: [
            'components/button',
            'components/checkbox',
            'components/date-picker',
            'components/dropdown',
            'components/exploding-input',
            'components/file-upload',
            'components/input',
            'components/radio',
            'components/rating',
            'components/slider',
            'components/switch',
            'components/textarea',
          ],
        },
        {
          type: 'category',
          label: 'Data Display',
          items: [
            'components/accordion',
            'components/avatar',
            'components/badge',
            'components/breadcrumbs',
            'components/card',
            'components/carousel',
            'components/dialog-box',
            'components/drawer',
            'components/image-card',
            'components/list-with-actions',
            'components/list-with-avatars',
            'components/list',
            'components/modals',
            'components/navbar',
            'components/progress-indicator',
            'components/scroll-area',
            'components/sidebar',
            'components/spinner',
            'components/stepper',
            'components/table',
            'components/toast',
            'components/tooltip',
            'components/typography',
            'components/user-card',
          ],
        },
        {
          type: 'category',
          label: 'AI Components',
          items: [
            'components/ai-thinking-indicator',
            'components/ai-status-badge',
            'components/ai-chat-input',
            'components/ai-message-bubble',
            'components/ai-messages',
            'components/ai-model-selector',
            'components/ai-suggested-actions',
            'components/ai-chat',
            'components/ai-conversation-history',
            'components/ai-code-block'
           
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Layouts',
      items: [
        {
          type: 'doc',
          id: 'components/all-layouts/index',
          label: 'All Layouts',
        },
        {
          type: 'doc',
          id: 'components/box',
          label: 'Box',
        },
      ],
    },
    {
      type: 'category',
      label: 'Templates',
      items: [
        {
          type: 'doc',
          id: 'components/all-templates/index',
          label: 'All Templates',
        },
      ],
    },
  ],
};

export default sidebars;
