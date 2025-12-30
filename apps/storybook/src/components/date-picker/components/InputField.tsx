'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import type { InputFieldProps } from '../types';
import { getThemeStyles } from '../utils';

const isReactElementWithProps = (
    element: React.ReactNode
): element is React.ReactElement<{ className?: string }> => {
    return React.isValidElement(element);
};

const InputField: React.FC<InputFieldProps> = ({
    ref,
    value,
    onChange,
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

        if (isReactElementWithProps(icon)) {
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
        <div className="relative flex-1">
            <input
                ref={ref}
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
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
    );
};

export default InputField;