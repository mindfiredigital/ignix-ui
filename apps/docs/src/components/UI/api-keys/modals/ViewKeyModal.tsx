import { motion } from 'framer-motion';
import {
    Eye,
    Copy,
    AlertTriangle,
    Loader2,
    CheckCircle,
} from 'lucide-react';
import { Button } from '../../button';
import { AnimatedInput } from '../../input';
import { Typography } from '../../typography';
import type { ViewKeyModalProps } from '../types';
import { useEffect, useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { ScopeBadge } from '../components/ScopeBadge';

export const ViewKeyModal = ({
    isOpen,
    onClose,
    onReveal,
    apiKey,
    isLoading = false,
    inputVariant = "clean",
    buttonVariant = "default",
    buttonAnimationVariant,
    autoHideDelay = 30
}: ViewKeyModalProps) => {
    const [password, setPassword] = useState('');
    const [revealedKey, setRevealedKey] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(autoHideDelay);

    useEffect(() => {
        if (revealedKey && autoHideDelay > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setRevealedKey(null);
                        setPassword('');
                        onClose();
                        return autoHideDelay;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [revealedKey, autoHideDelay, onClose]);

    if (!isOpen || !apiKey) return null;

    const handleReveal = async () => {
        if (!password) {
            setError('Password is required to view the key');
            return;
        }

        // In a real app, you would verify the password here
        // For demo purposes, we'll just check if it's not empty
        if (password !== 'password') {
            setError('Incorrect password');
            return;
        }

        try {
            // Simulate fetching the full key
            const fullKey = `sk_live_${Math.random().toString(36).substring(2, 42)}`;
            setRevealedKey(fullKey);
            await onReveal(apiKey);
            setError('');
        } catch (error) {
            setError('Failed to reveal API key');
        }
    };

    const handleClose = () => {
        onClose();
        setPassword('');
        setRevealedKey(null);
        setError('');
        setCountdown(autoHideDelay);
    };

    const handleCopy = () => {
        if (revealedKey) {
            navigator.clipboard.writeText(revealedKey);
        }
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
                        <Typography variant="h5" weight="semibold" className="flex items-center gap-2 text-foreground">
                            <Eye className="w-5 h-5" />
                            {revealedKey ? 'API Key Revealed' : 'View API Key'}
                        </Typography>
                        <Typography variant="body-small" color="muted">
                            {revealedKey ? `This key will auto-hide in ${countdown}s` : `View full key for "${apiKey.name}"`}
                        </Typography>
                    </div>

                    <div className="p-6 space-y-6">
                        {!revealedKey ? (
                            <>
                                <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                                        <div>
                                            <Typography variant="body-small" weight="medium" className="text-warning mb-1">
                                                Security Notice
                                            </Typography>
                                            <Typography variant="caption" color="muted">
                                                This key will only be shown once. Copy it immediately and store it securely. You won't be able to see it again.
                                            </Typography>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Typography variant="label" color="default" className="mb-2 block">
                                        Enter your password to view the key *
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
                                        Authentication required for security purposes.
                                    </Typography>
                                </div>

                                <div className="space-y-2">
                                    <Typography variant="label" color="default">
                                        Key Information
                                    </Typography>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Name:</span>
                                            <span>{apiKey.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Status:</span>
                                            <StatusBadge status={apiKey.status} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-muted-foreground">Permissions:</span>
                                            <div className="flex flex-wrap gap-2 justify-end">
                                                {apiKey.scopes.map(scope => (
                                                    <ScopeBadge
                                                        key={scope}
                                                        scope={scope}
                                                        showIcon={false}
                                                        className="text-xs"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                                        <div>
                                            <Typography variant="body-small" weight="medium" className="text-success mb-1">
                                                Copy this key now
                                            </Typography>
                                            <Typography variant="caption" color="muted">
                                                This key will auto-hide in {countdown} seconds. Make sure to store it securely.
                                            </Typography>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Typography variant="label" color="default" className="mb-2 block">
                                        Your API Key
                                    </Typography>
                                    <div className="flex gap-2">
                                        <div className="flex-1 p-3 rounded-lg bg-secondary/30 border border-border font-mono text-sm break-all text-foreground">
                                            {revealedKey}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleCopy}
                                            className="flex-shrink-0 cursor-pointer"
                                            animationVariant={buttonAnimationVariant}
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <Typography variant="caption" color="muted">
                                        Auto-hiding in {countdown} seconds...
                                    </Typography>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="p-6 border-t border-border flex justify-end gap-3">
                        {!revealedKey ? (
                            <>
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
                                    onClick={handleReveal}
                                    disabled={isLoading || !password}
                                    variant={buttonVariant as any}
                                    animationVariant={buttonAnimationVariant}
                                    className="cursor-pointer"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Key
                                        </>
                                    )}
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={handleClose}
                                animationVariant={buttonAnimationVariant}
                                className="cursor-pointer"
                            >
                                Close
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
