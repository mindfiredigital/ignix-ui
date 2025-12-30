'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import { Typography } from '../../typography';
import type { IconProps, RangeInputFieldProps } from '../types';
import { getThemeStyles } from '../utils';



const isIconElement = (node: React.ReactNode): node is React.ReactElement<IconProps> => {
    return React.isValidElement(node);
};


const RangeInputField: React.FC<RangeInputFieldProps> = ({
    startRef,
    endRef,
    startValue,
    endValue,
    onStartChange,
    onEndChange,
    placeholder,
    themeMode,
    disabled,
    readOnly,
    showIcon = true,
    icon,
    onFocus,
}) => {

    const themeStyles = getThemeStyles(themeMode);
    const themedIcon = React.useMemo(() => {
        if (!showIcon) return null;

        if (isIconElement(icon)) {
            return React.cloneElement(icon, {
                ...icon.props,
                className: cn(
                    icon.props.className,
                    themeMode === 'dark' ? 'text-gray-400' : 'text-gray-400'
                )
            });
        }

        return <Calendar className={cn("w-4 h-4", themeMode === 'dark' ? 'text-gray-400' : 'text-gray-400')} />;
    }, [showIcon, icon, themeMode]);

    return (
        <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1">
                <input
                    ref={startRef}
                    type="text"
                    value={startValue}
                    onChange={onStartChange}
                    placeholder={Array.isArray(placeholder) ? placeholder[0] : 'Start date'}
                    className={cn(
                        "w-full bg-transparent outline-none font-medium tracking-wide",
                        themeStyles.text.primary,
                        themeStyles.placeholder,
                        disabled && "cursor-not-allowed",
                        readOnly && "cursor-default"
                    )}
                    disabled={disabled}
                    readOnly={readOnly}
                    onFocus={onFocus}
                />
            </div>

            <Typography
                variant="body"
                className={themeStyles.text.muted}
            >
                –
            </Typography>

            <div className="relative flex-1">
                <input
                    ref={endRef}
                    type="text"
                    value={endValue}
                    onChange={onEndChange}
                    placeholder={Array.isArray(placeholder) ? placeholder[1] : 'End date'}
                    className={cn(
                        "w-full bg-transparent outline-none font-medium tracking-wide",
                        themeStyles.text.primary,
                        themeStyles.placeholder,
                        disabled && "cursor-not-allowed",
                        readOnly && "cursor-default"
                    )}
                    disabled={disabled}
                    readOnly={readOnly}
                    onFocus={onFocus}
                />
                {showIcon && (
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                        {themedIcon}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default RangeInputField;