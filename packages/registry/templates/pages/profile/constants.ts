import { type ProfileData } from './types';

export const defaultProfileData: ProfileData = {
    displayName: 'Alex Thompson',
    email: 'alex.thompson@example.com',
    bio: 'Product designer with 8+ years of experience creating digital experiences. Passionate about user-centered design and building products that make a difference.',
    avatarUrl: null,
    socialLinks: [
        { id: '1', platform: 'Twitter', url: 'https://twitter.com/alexthompson' },
        { id: '2', platform: 'GitHub', url: 'https://github.com/alexthompson' },
    ],
    location: 'San Francisco, CA',
    jobTitle: 'Senior Product Designer',
    website: 'https://alexthompson.design',
    phone: '+1 (555) 123-4567',
};

export const platformIcons: Record<string, React.ReactNode> = {
    twitter: 'twitter',
    github: 'github',
    linkedin: 'linkedin',
    website: 'website',
    default: 'link',
} as const;