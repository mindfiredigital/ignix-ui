import React from 'react';
import { Link as LinkIcon, Twitter, Github, Linkedin, Globe as Earth, Plus, Trash2 } from 'lucide-react';
import { cn } from '../../../../../../utils/cn';
import { Button } from '../../../../../components/button';
import { AnimatedInput } from '../../../../../components/input';
import { Typography } from '../../../../../components/typography';
import { type SocialLinksListProps } from '../types';


/**
 * SocialLinksList Component
 * 
 * Displays a list of social media links that can be edited or viewed.
 * In edit mode, allows adding, removing, and editing links.
 * In view mode, displays links as clickable items with platform detection.
 * 
 * @component
 * @example
 * ```tsx
 * <SocialLinksList
 *   links={[
 *     { id: '1', platform: 'Twitter', url: 'https://twitter.com/user' },
 *     { id: '2', platform: 'GitHub', url: 'https://github.com/user' }
 *   ]}
 *   isEditing={true}
 *   onLinksChange={(links) => console.log(links)}
 * />
 * ```
 */

export const SocialLinksList: React.FC<SocialLinksListProps> = ({
    links,
    isEditing,
    onLinksChange
}) => {
    const platformIcons: Record<string, React.ReactNode> = {
        twitter: <Twitter className="w-4 h-4" />,
        github: <Github className="w-4 h-4" />,
        linkedin: <Linkedin className="w-4 h-4" />,
        website: <Earth className="w-4 h-4" />,
        default: <LinkIcon className="w-4 h-4" />,
    };

    const getPlatformIcon = (url: string) => {
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes('twitter') || lowerUrl.includes('x.com')) return platformIcons.twitter;
        if (lowerUrl.includes('github')) return platformIcons.github;
        if (lowerUrl.includes('linkedin')) return platformIcons.linkedin;
        if (lowerUrl.includes('http')) return platformIcons.website;
        return platformIcons.default;
    };

    const addLink = () => {
        const newLink = {
            id: Date.now().toString(),
            platform: '',
            url: '',
        };
        onLinksChange([...links, newLink]);
    };

    const updateLink = (id: string, field: 'platform' | 'url', value: string) => {
        onLinksChange(
            links.map(link =>
                link.id === id ? { ...link, [field]: value } : link
            )
        );
    };

    const removeLink = (id: string) => {
        onLinksChange(links.filter(link => link.id !== id));
    };

    return (
        <div className="space-y-4 animate-fade-in">
            {links.length === 0 && !isEditing && (
                <div className="px-4 py-3 rounded-lg bg-secondary/30 text-muted-foreground/60 italic">
                    <Typography variant="body-small" color="muted">
                        No social links added
                    </Typography>
                </div>
            )}

            <div className="space-y-3">
                {links.map((link) => (
                    <div
                        key={link.id}
                        className={cn(
                            "flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
                            isEditing ? "bg-accent/20 border border-primary/10" : "bg-secondary/30"
                        )}
                    >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {getPlatformIcon(link.url)}
                        </div>

                        {isEditing ? (
                            <>
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <AnimatedInput
                                        placeholder="Platform name"
                                        variant="clean"
                                        value={link.platform}
                                        onChange={(value) => updateLink(link.id, 'platform', value)}
                                    />
                                    <AnimatedInput
                                        placeholder="https://..."
                                        variant="clean"
                                        value={link.url}
                                        onChange={(value) => updateLink(link.id, 'url', value)}
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeLink(link.id)}
                                    className="flex-shrink-0 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </>
                        ) : (
                            <div className="flex-1 min-w-0">
                                <Typography variant="body-small" weight="medium" className="truncate text-foreground">
                                    {link.platform || 'Unnamed'}
                                </Typography>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline truncate block"
                                >
                                    <Typography variant="caption" className="truncate">
                                        {link.url}
                                    </Typography>
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {isEditing && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={addLink}
                    className="w-full border-dashed hover:border-primary hover:text-primary cursor-pointer"
                    animationVariant="scaleUp"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Social Link
                </Button>
            )}
        </div>
    );
};