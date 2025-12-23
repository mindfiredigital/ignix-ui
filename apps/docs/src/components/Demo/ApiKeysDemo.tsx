import React from 'react';
import { ApiKeysPage } from '@site/src/components/UI/api-keys';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

const ApiKeysPageDemo = () => {

    const codeString = `
const keys = [
    {
        id: '1',
        name: 'Production API',
        keyPrefix: 'sk_live_',
        keySuffix: 'x7Kp',
        scopes: ['read:users', 'write:users', 'read:data', 'write:data'],
        createdAt: new Date('2024-01-15'),
        lastUsed: new Date(),
        usageCount: 15420,
        usageHistory: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
            count: Math.floor(Math.random() * 500) + 50
        })),
        status: 'active' as const,
        expiresAt: new Date('2025-01-15'),
        description: 'Used for production environment API calls'
    },
    ... rest of the api keys
]

<ApiKeysPage
  headerTitle="API Keys Management"
  headerDescription="Manage your API access keys and permissions"
  initialApiKeys={keys},
  variant="default"
  animationVariant="fadeUp"
  cardVariant="default"
  badgeVariant="tinypop"
  showFilters={true}
  showSearch={true}
  showStats={true}
  showExport={true}
  showNotifications={true}
  generateButtonLabel="Generate Key"
  searchPlaceholder="Search API keys..."
  darkMode={true}
/>`;

    return (
        <div className="flex flex-col space-y-6 mb-8">

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="dark" >
                        <div className="p-1 border rounded-lg mt-2 max-h-fit">
                            <ApiKeysPage
                                headerTitle="API Keys Management"
                                headerDescription="Manage your API access keys and permissions"
                                variant='default'
                                animationVariant="fadeUp"
                                cardVariant="default"
                                badgeVariant="tinypop"
                                showFilters={true}
                                showSearch={true}
                                showStats={true}
                                showExport={true}
                                showNotifications={true}
                                generateButtonLabel="Generate Key"
                                searchPlaceholder="Search API keys..."
                                darkMode={true}
                            />
                        </div>
                    </div>
                </TabItem>
                <TabItem value="code" label="Code">
                    <CodeBlock language="tsx" className='whitespace-pre-wrap max-h-[500px] overflow-y-scroll'>
                        {codeString}
                    </CodeBlock>
                </TabItem>
            </Tabs>
        </div>
    );
};

export default ApiKeysPageDemo;