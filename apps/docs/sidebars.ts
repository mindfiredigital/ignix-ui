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
            'components/dropdown',
            'components/input',
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
            'components/badge',
            'components/breadcrumbs',
            'components/card',
            'components/dialog-box',
            'components/navbar',
            'components/sidebar',
            'components/spinner',
            'components/stepper',
            'components/table',
            'components/toast',
            'components/tooltip',
          ],
        },
        {
          type: 'category',
          label: 'AI Components',
          items: [
            'components/ai-chat',
            'components/ai-chat-input',
            'components/ai-code-block',
            'components/ai-conversation-history',
            'components/ai-message-bubble',
            'components/ai-messages',
            'components/ai-model-selector',
            'components/ai-response-actions',
            'components/ai-status-badge',
            'components/ai-streaming-text',
            'components/ai-suggested-actions',
            'components/ai-thinking-indicator',
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
          id: 'components/box',
          label: 'Box',
        },
      ],
    },
  ],
};

export default sidebars;
