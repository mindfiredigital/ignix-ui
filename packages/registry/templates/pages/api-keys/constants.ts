import {
    Users,
    Database,
    BarChart3,
    Settings
} from 'lucide-react';
import type {  ScopeInfo } from './types';

export const SCOPES: ScopeInfo[] = [
    { id: 'read:users', name: 'Read Users', description: 'Access to read user data', risk: 'low', icon: Users },
    { id: 'write:users', name: 'Write Users', description: 'Create and update user data', risk: 'medium', icon: Users },
    { id: 'read:data', name: 'Read Data', description: 'Access to read application data', risk: 'low', icon: Database },
    { id: 'write:data', name: 'Write Data', description: 'Create and update application data', risk: 'medium', icon: Database },
    { id: 'read:analytics', name: 'Read Analytics', description: 'Access to analytics and metrics', risk: 'low', icon: BarChart3 },
    { id: 'admin', name: 'Admin Access', description: 'Full administrative privileges', risk: 'high', icon: Settings },
];

export const STATUS_BADGE_TYPES = {
    active: 'success' as const,
    inactive: 'warning' as const,
    expired: 'error' as const,
    revoked: 'error' as const
} as const;

export const STATUS_LABELS = {
    active: 'Active',
    inactive: 'Inactive',
    expired: 'Expired',
    revoked: 'Revoked'
} as const;

export const SCOPE_RISK_BADGE_TYPES = {
    low: 'success' as const,
    medium: 'warning' as const,
    high: 'error' as const
} as const;


