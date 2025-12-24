
import {
    Activity,
    AlertTriangle,
    X,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../../utils/cn';
import { Typography } from "../../../../components/typography";
import { useEffect } from "react";
import { NotificationVariants } from "../utils";

export const Notification = ({
    type = 'success',
    message,
    onClose,
    duration = 3000
}: {
    type: Notification['type'];
    message: string;
    onClose: () => void;
    duration?: number;
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        info: <Activity className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={cn(
                NotificationVariants({ type }),
                "top-4 right-4"
            )}
        >
            {icons[type]}
            <Typography variant="body-small" weight="medium">
                {message}
            </Typography>
            <button
                onClick={onClose}
                className="ml-4 text-current hover:opacity-70 transition-opacity cursor-pointer"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};