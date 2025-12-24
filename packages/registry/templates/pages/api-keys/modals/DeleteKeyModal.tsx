import { motion } from 'framer-motion';
import {
    Trash2,
    AlertTriangle,
    Loader2,
} from 'lucide-react';
import { Button } from '../../../../components/button';
import { AnimatedInput } from '../../../../components/input';
import { Typography } from '../../../../components/typography';
import type { DeleteKeyModalProps } from '../types';
import { useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';

export const DeleteKeyModal = ({
    isOpen,
    onClose,
    onDelete,
    apiKey,
    isLoading = false,
    inputVariant = "clean",
    buttonVariant = "destructive",
    buttonAnimationVariant
}: DeleteKeyModalProps) => {
    const [confirmationText, setConfirmationText] = useState('');
    const [error, setError] = useState('');

    if (!isOpen || !apiKey) return null;

    const handleDelete = async () => {
        if (confirmationText !== apiKey.name) {
            setError(`Please type "${apiKey.name}" to confirm deletion.`);
            return;
        }

        try {
            await onDelete(apiKey);
            onClose();
            setConfirmationText('');
            setError('');
        } catch (error) {
            setError('Failed to delete API key');
        }
    };

    const handleClose = () => {
        onClose();
        setConfirmationText('');
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
                        <Typography variant="h5" weight="semibold" className="flex items-center gap-2 text-destructive">
                            <Trash2 className="w-5 h-5" />
                            Delete API Key
                        </Typography>
                        <Typography variant="body-small" color="muted">
                            Permanently delete "{apiKey.name}"
                        </Typography>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
                                <div>
                                    <Typography variant="body-small" weight="medium" className="text-destructive mb-1">
                                        Warning: Irreversible Action
                                    </Typography>
                                    <Typography variant="caption" color="muted">
                                        Deleting this key is permanent and cannot be undone. Any applications using this key will stop working immediately.
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Typography variant="label" color="default">
                                Type the key name to confirm deletion *
                            </Typography>
                            <Typography variant="caption" color="muted" className="mb-3">
                                Type "<span className="font-mono font-semibold">{apiKey.name}</span>" to confirm
                            </Typography>
                            <AnimatedInput
                                placeholder={`Type "${apiKey.name}"`}
                                value={confirmationText}
                                onChange={(value) => {
                                    setConfirmationText(value);
                                    if (error) setError('');
                                }}
                                variant={inputVariant}
                            />
                            {error && (
                                <Typography variant="caption" color="error">
                                    {error}
                                </Typography>
                            )}
                        </div>

                        <div>
                            <Typography variant="label" color="default" className="mb-2 block">
                                Key Details
                            </Typography>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Key ID:</span>
                                    <code className="font-mono">{apiKey.id}</code>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status:</span>
                                    <StatusBadge status={apiKey.status} />
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Created:</span>
                                    <span>{new Date(apiKey.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Permissions:</span>
                                    <span>{apiKey.scopes.length} scope(s)</span>
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
                            onClick={handleDelete}
                            disabled={isLoading || confirmationText !== apiKey.name}
                            variant={buttonVariant as any}
                            animationVariant={buttonAnimationVariant}
                            className="cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Key
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};