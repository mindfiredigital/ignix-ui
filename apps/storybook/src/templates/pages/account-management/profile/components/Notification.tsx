import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X, Loader2 } from 'lucide-react';
import { cn } from '../../../../../../utils/cn';
import { Typography } from '../../../../../components/typography';
import { NotificationVariants } from '../variants';
import { type NotificationProps } from '../types';


export const NotificationComponent: React.FC<NotificationProps> = ({
    type = 'success',
    message,
    onClose,
    duration = 3000
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <X className="w-5 h-5" />,
        info: <Loader2 className="w-5 h-5" />,
        warning: <Loader2 className="w-5 h-5" />
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={cn(
                NotificationVariants({ type }),
                "fixed top-4 right-4 z-50"
            )}
        >
            {icons[type]}
            <Typography variant="body-small" weight="medium">
                {message}
            </Typography>
            <button
                onClick={onClose}
                className="ml-4 text-current hover:opacity-70 transition-opacity"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};