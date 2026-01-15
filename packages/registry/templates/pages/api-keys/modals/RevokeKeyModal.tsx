import { motion } from 'framer-motion';
import {
    AlertTriangle,
    Loader2,
    Ban,
} from 'lucide-react';

import { AnimatedInput } from '@ignix-ui/input';
import { Button } from '@ignix-ui/button';
import { Typography } from '@ignix-ui/typography';

import type { RevokeKeyModalProps } from '../types';
import { useState } from 'react';

export const RevokeKeyModal = ({
    isOpen,
    onClose,
    onRevoke,
    apiKey,
    isLoading = false,
    inputVariant = "clean",
    buttonVariant = "warning",
    buttonAnimationVariant
}: RevokeKeyModalProps) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen || !apiKey) return null;

    const handleRevoke = async () => {
        if (!password) {
            setError('Password is required to revoke the key');
            return;
        }

        // In a real app, you would verify the password here
        // For demo purposes, we'll just check if it's not empty
        if (password !== 'password') {
            setError('Incorrect password');
            return;
        }

        try {
            await onRevoke(apiKey);
            onClose();
            setPassword('');
            setError('');
        } catch (error) {
            setError('Failed to revoke API key');
        }
    };

    const handleClose = () => {
        onClose();
        setPassword('');
        setError('');
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg"
            >
                <div className="bg-card rounded-2xl shadow-2xl border border-border">
                    <div className="p-6 border-b border-border">
                        <Typography variant="h5" weight="semibold" className="flex items-center gap-2 text-warning">
                            <Ban className="w-5 h-5" />
                            Revoke API Key
                        </Typography>
                        <Typography variant="body-small" color="muted">
                            Disable access for "{apiKey.name}"
                        </Typography>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                                <div>
                                    <Typography variant="body-small" weight="medium" className="text-warning mb-1">
                                        Warning: Revoking this key will immediately invalidate all API requests using it.
                                    </Typography>
                                    <Typography variant="caption" color="muted">
                                        Any applications using this key will stop working. This action can be reversed by re-activating the key.
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Typography variant="label" color="default" className="mb-2 block">
                                Enter your password to confirm *
                            </Typography>
                            <AnimatedInput
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(value) => {
                                    setPassword(value);
                                    if (error) setError('');
                                }}
                                variant={inputVariant}
                            />
                            {error && (
                                <Typography variant="caption" color="error">
                                    {error}
                                </Typography>
                            )}
                            <Typography variant="caption" color="muted" className="mt-2 block">
                                You must authenticate to perform this action.
                            </Typography>
                        </div>

                        <div className="space-y-3">
                            <Typography variant="label" color="default" className="block">
                                This will affect:
                            </Typography>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-destructive" />
                                    <Typography variant="body-small" color="muted">
                                        All active API calls using this key
                                    </Typography>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-destructive" />
                                    <Typography variant="body-small" color="muted">
                                        Applications and services using this key
                                    </Typography>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-destructive" />
                                    <Typography variant="body-small" color="muted">
                                        Webhooks and integrations
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-border flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                            animationVariant={buttonAnimationVariant}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRevoke}
                            disabled={isLoading || !password}
                            variant={buttonVariant}
                            animationVariant={buttonAnimationVariant}
                            className="cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Revoking...
                                </>
                            ) : (
                                <>
                                    <Ban className="w-4 h-4 mr-2" />
                                    Revoke Key
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};