import type { ApiKey } from "./types";

export const generateMockApiKeys = (): ApiKey[] => [
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
        status: 'active',
        expiresAt: new Date('2025-01-15'),
        description: 'Used for production environment API calls'
    },
    {
        id: '2',
        name: 'Analytics Dashboard',
        keyPrefix: 'sk_live_',
        keySuffix: 'm2Qr',
        scopes: ['read:analytics', 'read:data'],
        createdAt: new Date('2024-03-22'),
        lastUsed: new Date(Date.now() - 86400000),
        usageCount: 8934,
        usageHistory: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
            count: Math.floor(Math.random() * 400) + 30
        })),
        status: 'active',
        expiresAt: new Date('2024-12-22'),
        description: 'Dashboard analytics integration'
    },
    {
        id: '3',
        name: 'Mobile App',
        keyPrefix: 'sk_live_',
        keySuffix: 'n9Ts',
        scopes: ['read:users', 'read:data'],
        createdAt: new Date('2024-06-10'),
        lastUsed: new Date(Date.now() - 172800000),
        usageCount: 42156,
        usageHistory: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
            count: Math.floor(Math.random() * 700) + 100
        })),
        status: 'active',
        expiresAt: new Date('2025-06-10'),
        description: 'Mobile application API access'
    },
    {
        id: '4',
        name: 'Webhook Service',
        keyPrefix: 'sk_test_',
        keySuffix: 'p5Lm',
        scopes: ['write:data'],
        createdAt: new Date('2023-11-05'),
        lastUsed: new Date('2024-10-01'),
        usageCount: 3250,
        usageHistory: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
            count: Math.floor(Math.random() * 100) + 10
        })),
        status: 'expired',
        expiresAt: new Date('2024-11-05'),
        description: 'Webhook service integration'
    },
    {
        id: '5',
        name: 'Legacy System',
        keyPrefix: 'sk_live_',
        keySuffix: 'r1Wv',
        scopes: ['admin', 'read:data', 'write:data'],
        createdAt: new Date('2023-08-20'),
        lastUsed: null,
        usageCount: 0,
        usageHistory: Array.from({ length: 7 }, () => ({ date: '', count: 0 })),
        status: 'revoked',
        description: 'Revoked due to security concerns'
    }
];

