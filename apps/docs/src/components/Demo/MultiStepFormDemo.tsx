import React, { useState, useEffect } from 'react';
import type { JSX } from 'react';
import {
    MultiStepForm,
    type FormStep,
    // type FormValues,
} from '../UI/multi-step-form';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import VariantSelector from './VariantSelector';
import { useColorMode } from '@docusaurus/theme-common';
import {
    PersonIcon,
    EnvelopeClosedIcon,
    ReaderIcon,
    LapTimerIcon,
    ChatBubbleIcon,
    LockClosedIcon,
    CalendarIcon,
    CardStackIcon,
    HomeIcon,
    BellIcon,
    GlobeIcon,
    GitHubLogoIcon,
    LinkedInLogoIcon,
    RocketIcon,
    HeartIcon,
    FileTextIcon,
    CodeIcon,
    DrawingPinIcon,
    CrumpledPaperIcon,
    BookmarkIcon,
    PlusIcon,
    CheckCircledIcon,
    CheckIcon,
    LightningBoltIcon,
    LayersIcon,
} from '@radix-ui/react-icons';
import { cn } from '@site/src/utils/cn';
import { Button } from '@site/src/components/UI/button';

// Types for our variant selectors
type ThemeVariant = 'default' | 'gradient' | 'card' | 'glass' | 'dark';
type AnimationVariant = 'fadeUp' | 'scaleIn' | 'slideUp' | 'slideLeft' | 'slideRight';
type InputVariant = 'clean' | 'borderGlow' | 'glassmorphism' | 'shimmer' | 'borderBeam';
type ButtonVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger' | 'warning' | 'glass';
type FormType = 'onboarding' | 'registration' | 'payment' | 'job' | 'event' | 'profile';

// Animation options
const animationTypes = [
    'fadeUp',
    'scaleIn',
    'slideUp',
    'slideLeft',
    'slideRight'
] as const;

// Theme options
const themeOptions = [
    { value: 'default', label: 'Default' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'card', label: 'Card' },
    { value: 'glass', label: 'Glass' },
    { value: 'dark', label: 'Dark' },
];

// Input variant options
const inputVariantOptions = [
    { value: 'clean', label: 'Clean' },
    { value: 'borderGlow', label: 'Border Glow' },
    { value: 'glassmorphism', label: 'Glass' },
    { value: 'shimmer', label: 'Shimmer' },
    { value: 'borderBeam', label: 'Border Beam' },
];

// Button variant options
const buttonVariantOptions = [
    { value: 'default', label: 'Default' },
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'outline', label: 'Outline' },
    { value: 'ghost', label: 'Ghost' },
    { value: 'success', label: 'Success' },
    { value: 'danger', label: 'Danger' },
    { value: 'warning', label: 'Warning' },
    { value: 'glass', label: 'Glass' },
];

// Form type options
const formTypeOptions = [
    { value: 'onboarding', label: 'Onboarding' },
    { value: 'registration', label: 'Registration' },
    { value: 'payment', label: 'Payment' },
    { value: 'job', label: 'Job Application' },
    { value: 'event', label: 'Event' },
    { value: 'profile', label: 'Profile' },
];

// Form icons mapping
const formIcons = {
    onboarding: PersonIcon,
    registration: LockClosedIcon,
    payment: CardStackIcon,
    job: ReaderIcon,
    event: CalendarIcon,
    profile: PersonIcon,
};

// Icon names for code generation
const iconNames = {
    onboarding: 'PersonIcon',
    registration: 'LockClosedIcon',
    payment: 'CardStackIcon',
    job: 'BriefcaseIcon',
    event: 'CalendarIcon',
    profile: 'PersonIcon',
};

// ==============================
// VALIDATION UTILITIES
// ==============================

const validateEmail = (email: string): string | undefined => {
    if (!email) return undefined;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return undefined;
};

const validatePhone = (phone: string): string | undefined => {
    if (!phone) return undefined;
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        return 'Please enter a valid phone number';
    }
    return undefined;
};

const validateUrl = (url: string): string | undefined => {
    if (!url) return undefined;
    try {
        new URL(url);
        return undefined;
    } catch {
        return 'Please enter a valid URL (include https://)';
    }
};

const validatePassword = (password: string): string | undefined => {
    if (!password) return undefined;
    if (password.length < 8) {
        return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }
    return undefined;
};

const validateCreditCard = (cardNumber: string): string | undefined => {
    if (!cardNumber) return undefined;
    const cleaned = cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cleaned)) {
        return 'Card number must be 16 digits';
    }
    // Luhn algorithm check
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned.charAt(i), 10);
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
    }
    if (sum % 10 !== 0) {
        return 'Invalid card number';
    }
    return undefined;
};

const validateExpiry = (expiry: string): string | undefined => {
    if (!expiry) return undefined;
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(expiry)) {
        return 'Use MM/YY format';
    }
    const [month, year] = expiry.split('/');
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    const expYear = parseInt(year, 10);
    const expMonth = parseInt(month, 10);

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        return 'Card has expired';
    }
    return undefined;
};

const validateCVV = (cvv: string): string | undefined => {
    if (!cvv) return undefined;
    if (!/^\d{3,4}$/.test(cvv)) {
        return 'CVV must be 3 or 4 digits';
    }
    return undefined;
};

// ==============================
// FORM TYPE CONFIGURATIONS WITH VALIDATION
// ==============================

// 1. Onboarding Form with Validation
const onboardingSteps: FormStep[] = [
    {
        id: 'personal',
        title: 'Personal Information',
        description: 'Tell us a bit about yourself',
        fields: [
            {
                id: 'first-name',
                name: 'firstName',
                label: 'First Name',
                type: 'text',
                placeholder: 'John',
                required: true,
                icon: PersonIcon,
                colSpan: 'half',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value.length < 2) {
                        return 'First name must be at least 2 characters';
                    }
                    return undefined;
                },
            },
            {
                id: 'last-name',
                name: 'lastName',
                label: 'Last Name',
                type: 'text',
                placeholder: 'Doe',
                required: true,
                icon: PersonIcon,
                colSpan: 'half',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value.length < 2) {
                        return 'Last name must be at least 2 characters';
                    }
                    return undefined;
                },
            },
            {
                id: 'email',
                name: 'email',
                label: 'Email Address',
                type: 'email',
                placeholder: 'john@example.com',
                required: true,
                icon: EnvelopeClosedIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string') {
                        return validateEmail(value);
                    }
                    return undefined;
                },
            },
        ],
    },
    {
        id: 'professional',
        title: 'Professional Details',
        description: 'Tell us about your work',
        fields: [
            {
                id: 'role',
                name: 'role',
                label: 'Your Role',
                type: 'select',
                placeholder: 'Select your role',
                required: true,
                options: [
                    { value: 'developer', label: 'Developer' },
                    { value: 'designer', label: 'Designer' },
                    { value: 'manager', label: 'Manager' },
                    { value: 'other', label: 'Other' },
                ],
                icon: ReaderIcon,
                colSpan: 'full',
            },
            {
                id: 'experience',
                name: 'experience',
                label: 'Experience Level',
                type: 'radio',
                required: true,
                options: [
                    { value: 'beginner', label: 'Beginner (0-2 years)' },
                    { value: 'intermediate', label: 'Intermediate (3-5 years)' },
                    { value: 'senior', label: 'Senior (5+ years)' },
                ],
                icon: LapTimerIcon,
                colSpan: 'full',
            },
            {
                id: 'bio',
                name: 'bio',
                label: 'Short Bio',
                type: 'textarea',
                placeholder: 'Tell us about yourself in a few sentences...',
                required: false,
                icon: FileTextIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value.length > 500) {
                        return 'Bio must be less than 500 characters';
                    }
                    return undefined;
                },
            },
        ],
    },
    {
        id: 'preferences',
        title: 'Preferences',
        description: 'Set your preferences',
        fields: [
            {
                id: 'newsletter',
                name: 'newsletter',
                label: 'Subscribe to newsletter',
                type: 'checkbox',
                placeholder: 'Subscribe to our newsletter',
                required: false,
                defaultValue: true,
                icon: HeartIcon,
                colSpan: 'full',
            },
            {
                id: 'contact-method',
                name: 'contactMethod',
                label: 'Preferred Contact Method',
                type: 'select',
                placeholder: 'How should we reach you?',
                required: true,
                options: [
                    { value: 'email', label: 'Email' },
                    { value: 'phone', label: 'Phone' },
                    { value: 'sms', label: 'SMS' },
                ],
                icon: BellIcon,
                colSpan: 'full',
            },
        ],
    },
];

// 2. Registration Form with Validation
const registrationSteps: FormStep[] = [
    {
        id: 'account',
        title: 'Account Details',
        description: 'Create your account credentials',
        fields: [
            {
                id: 'username',
                name: 'username',
                label: 'Username',
                type: 'text',
                placeholder: 'johndoe',
                required: true,
                icon: PersonIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string') {
                        if (value.length < 3) {
                            return 'Username must be at least 3 characters';
                        }
                        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                            return 'Username can only contain letters, numbers, and underscores';
                        }
                    }
                    return undefined;
                },
            },
            {
                id: 'email',
                name: 'email',
                label: 'Email Address',
                type: 'email',
                placeholder: 'john@example.com',
                required: true,
                icon: EnvelopeClosedIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string') {
                        return validateEmail(value);
                    }
                    return undefined;
                },
                emailValidation: {
                    domain: ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'],
                    message: 'Please use a personal email address',
                },
            },
            {
                id: 'password',
                name: 'password',
                label: 'Password',
                type: 'password',
                placeholder: '••••••••',
                required: true,
                icon: LockClosedIcon,
                colSpan: 'half',
                validation: (value): string | undefined => {
                    if (typeof value === 'string') {
                        return validatePassword(value);
                    }
                    return undefined;
                },
            },
            {
                id: 'confirm-password',
                name: 'confirmPassword',
                label: 'Confirm Password',
                type: 'password',
                placeholder: '••••••••',
                required: true,
                icon: LockClosedIcon,
                colSpan: 'half',
            },
        ],
        validation: (values): Record<string, string> => {
            const errors: Record<string, string> = {};
            if (values.password !== values.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
            }
            return errors;
        },
    },
    {
        id: 'personal',
        title: 'Personal Information',
        description: 'Tell us about yourself',
        fields: [
            {
                id: 'first-name',
                name: 'firstName',
                label: 'First Name',
                type: 'text',
                placeholder: 'John',
                required: true,
                icon: PersonIcon,
                colSpan: 'half',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value.length < 2) {
                        return 'First name must be at least 2 characters';
                    }
                    return undefined;
                },
            },
            {
                id: 'last-name',
                name: 'lastName',
                label: 'Last Name',
                type: 'text',
                placeholder: 'Doe',
                required: true,
                icon: PersonIcon,
                colSpan: 'half',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value.length < 2) {
                        return 'Last name must be at least 2 characters';
                    }
                    return undefined;
                },
            },
            {
                id: 'phone',
                name: 'phone',
                label: 'Phone Number',
                type: 'tel',
                placeholder: '+1 (555) 123-4567',
                required: false,
                icon: ChatBubbleIcon,
                colSpan: 'half',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value) {
                        return validatePhone(value);
                    }
                    return undefined;
                },
            },
            {
                id: 'location',
                name: 'location',
                label: 'Location',
                type: 'text',
                placeholder: 'City, Country',
                required: false,
                icon: DrawingPinIcon,
                colSpan: 'half',
            },
        ],
    },
    {
        id: 'preferences',
        title: 'Preferences',
        description: 'Set your preferences',
        fields: [
            {
                id: 'newsletter',
                name: 'newsletter',
                label: 'Subscribe to newsletter',
                type: 'checkbox',
                placeholder: 'Subscribe to our newsletter for updates',
                required: false,
                defaultValue: true,
                icon: HeartIcon,
                colSpan: 'full',
            },
            {
                id: 'notifications',
                name: 'notifications',
                label: 'Notification Preferences',
                type: 'select',
                placeholder: 'Select notification type',
                required: true,
                options: [
                    { value: 'all', label: 'All notifications' },
                    { value: 'important', label: 'Important only' },
                    { value: 'none', label: 'No notifications' },
                ],
                icon: BellIcon,
                colSpan: 'full',
            },
        ],
    },
];

// 3. Payment Form with Validation
const paymentSteps: FormStep[] = [
    {
        id: 'billing',
        title: 'Billing Address',
        description: 'Enter your billing information',
        fields: [
            {
                id: 'full-name',
                name: 'fullName',
                label: 'Full Name',
                type: 'text',
                placeholder: 'John Doe',
                required: true,
                icon: PersonIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value.length < 3) {
                        return 'Please enter your full name';
                    }
                    return undefined;
                },
            },
            {
                id: 'address',
                name: 'address',
                label: 'Street Address',
                type: 'text',
                placeholder: '123 Main St',
                required: true,
                icon: HomeIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value.length < 5) {
                        return 'Please enter a valid address';
                    }
                    return undefined;
                },
            },
            {
                id: 'city',
                name: 'city',
                label: 'City',
                type: 'text',
                placeholder: 'San Francisco',
                required: true,
                icon: CrumpledPaperIcon,
                colSpan: 'half',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value.length < 2) {
                        return 'Please enter a valid city';
                    }
                    return undefined;
                },
            },
            {
                id: 'state',
                name: 'state',
                label: 'State',
                type: 'text',
                placeholder: 'CA',
                required: true,
                icon: DrawingPinIcon,
                colSpan: 'half',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value.length < 2) {
                        return 'Please enter a valid state';
                    }
                    return undefined;
                },
            },
            {
                id: 'zip',
                name: 'zip',
                label: 'ZIP Code',
                type: 'text',
                placeholder: '94105',
                required: true,
                icon: LayersIcon,
                colSpan: 'half',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && !/^\d{5}(-\d{4})?$/.test(value)) {
                        return 'Please enter a valid ZIP code';
                    }
                    return undefined;
                },
            },
            {
                id: 'country',
                name: 'country',
                label: 'Country',
                type: 'text',
                placeholder: 'USA',
                required: true,
                icon: GlobeIcon,
                colSpan: 'half',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value.length < 2) {
                        return 'Please enter a valid country';
                    }
                    return undefined;
                },
            },
        ],
    },
    {
        id: 'payment',
        title: 'Payment Details',
        description: 'Enter your payment information',
        fields: [
            {
                id: 'card-number',
                name: 'cardNumber',
                label: 'Card Number',
                type: 'text',
                placeholder: '4242 4242 4242 4242',
                required: true,
                icon: CardStackIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string') {
                        return validateCreditCard(value);
                    }
                    return undefined;
                },
            },
            {
                id: 'card-name',
                name: 'cardName',
                label: 'Name on Card',
                type: 'text',
                placeholder: 'John Doe',
                required: true,
                icon: PersonIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value.length < 3) {
                        return 'Please enter the name on card';
                    }
                    return undefined;
                },
            },
            {
                id: 'expiry',
                name: 'expiry',
                label: 'Expiry Date',
                type: 'text',
                placeholder: 'MM/YY',
                required: true,
                icon: CalendarIcon,
                colSpan: 'half',
                validation: (value): string | undefined => {
                    if (typeof value === 'string') {
                        return validateExpiry(value);
                    }
                    return undefined;
                },
            },
            {
                id: 'cvv',
                name: 'cvv',
                label: 'CVV',
                type: 'password',
                placeholder: '123',
                required: true,
                icon: LockClosedIcon,
                colSpan: 'half',
                validation: (value): string | undefined => {
                    if (typeof value === 'string') {
                        return validateCVV(value);
                    }
                    return undefined;
                },
            },
        ],
    },
    {
        id: 'confirm',
        title: 'Confirmation',
        description: 'Review and confirm',
        fields: [
            {
                id: 'terms',
                name: 'terms',
                label: 'I agree to the terms and conditions',
                type: 'checkbox',
                placeholder: 'I agree to the terms and conditions',
                required: true,
                defaultValue: false,
                icon: CheckIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (!value) {
                        return 'You must agree to the terms';
                    }
                    return undefined;
                },
            },
            {
                id: 'save-info',
                name: 'saveInfo',
                label: 'Save payment information for future purchases',
                type: 'checkbox',
                placeholder: 'Save payment information',
                required: false,
                defaultValue: false,
                icon: HeartIcon,
                colSpan: 'full',
            },
        ],
    },
];

// 4. Job Application Form with Validation
const jobSteps: FormStep[] = [
    {
        id: 'personal',
        title: 'Personal Information',
        description: 'Tell us about yourself',
        fields: [
            {
                id: 'full-name',
                name: 'fullName',
                label: 'Full Name',
                type: 'text',
                placeholder: 'John Doe',
                required: true,
                icon: PersonIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value.length < 3) {
                        return 'Please enter your full name';
                    }
                    return undefined;
                },
            },
            {
                id: 'email',
                name: 'email',
                label: 'Email Address',
                type: 'email',
                placeholder: 'john@example.com',
                required: true,
                icon: EnvelopeClosedIcon,
                colSpan: 'half',
                validation: (value): string | undefined => {
                    if (typeof value === 'string') {
                        return validateEmail(value);
                    }
                    return undefined;
                },
            },
            {
                id: 'phone',
                name: 'phone',
                label: 'Phone Number',
                type: 'tel',
                placeholder: '+1 (555) 123-4567',
                required: true,
                icon: ChatBubbleIcon,
                colSpan: 'half',
                validation: (value): string | undefined => {
                    if (typeof value === 'string') {
                        return validatePhone(value);
                    }
                    return undefined;
                },
            },
            {
                id: 'location',
                name: 'location',
                label: 'Location',
                type: 'text',
                placeholder: 'City, Country',
                required: true,
                icon: DrawingPinIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value.length < 3) {
                        return 'Please enter your location';
                    }
                    return undefined;
                },
            },
        ],
    },
    {
        id: 'professional',
        title: 'Professional Details',
        description: 'Tell us about your experience',
        fields: [
            {
                id: 'position',
                name: 'position',
                label: 'Position Applied For',
                type: 'select',
                placeholder: 'Select position',
                required: true,
                options: [
                    { value: 'frontend', label: 'Frontend Developer' },
                    { value: 'backend', label: 'Backend Developer' },
                    { value: 'fullstack', label: 'Full Stack Developer' },
                    { value: 'devops', label: 'DevOps Engineer' },
                    { value: 'designer', label: 'UI/UX Designer' },
                ],
                icon: ReaderIcon,
                colSpan: 'full',
            },
            {
                id: 'experience-years',
                name: 'experienceYears',
                label: 'Years of Experience',
                type: 'select',
                placeholder: 'Select years',
                required: true,
                options: [
                    { value: '0-2', label: '0-2 years' },
                    { value: '3-5', label: '3-5 years' },
                    { value: '5-8', label: '5-8 years' },
                    { value: '8+', label: '8+ years' },
                ],
                icon: LapTimerIcon,
                colSpan: 'half',
            },
            {
                id: 'education',
                name: 'education',
                label: 'Highest Education',
                type: 'select',
                placeholder: 'Select education',
                required: true,
                options: [
                    { value: 'highschool', label: 'High School' },
                    { value: 'bachelors', label: 'Bachelor\'s Degree' },
                    { value: 'masters', label: 'Master\'s Degree' },
                    { value: 'phd', label: 'PhD' },
                ],
                icon: BookmarkIcon,
                colSpan: 'half',
            },
            {
                id: 'skills',
                name: 'skills',
                label: 'Key Skills',
                type: 'textarea',
                placeholder: 'List your key skills (e.g., React, Node.js, TypeScript)',
                required: true,
                icon: CodeIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string') {
                        const skills = value.split(',').filter(s => s.trim().length > 0);
                        if (skills.length < 3) {
                            return 'Please list at least 3 skills';
                        }
                    }
                    return undefined;
                },
            },
        ],
    },
    {
        id: 'links',
        title: 'Professional Links',
        description: 'Add your professional profiles',
        fields: [
            {
                id: 'portfolio',
                name: 'portfolio',
                label: 'Portfolio URL',
                type: 'url',
                placeholder: 'https://yourportfolio.com',
                required: false,
                icon: GlobeIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value) {
                        return validateUrl(value);
                    }
                    return undefined;
                },
            },
            {
                id: 'github',
                name: 'github',
                label: 'GitHub Profile',
                type: 'url',
                placeholder: 'https://github.com/username',
                required: false,
                icon: GitHubLogoIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value) {
                        return validateUrl(value);
                    }
                    return undefined;
                },
            },
            {
                id: 'linkedin',
                name: 'linkedin',
                label: 'LinkedIn Profile',
                type: 'url',
                placeholder: 'https://linkedin.com/in/username',
                required: false,
                icon: LinkedInLogoIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value) {
                        return validateUrl(value);
                    }
                    return undefined;
                },
            },
        ],
    },
    {
        id: 'additional',
        title: 'Additional Information',
        description: 'Almost done!',
        fields: [
            {
                id: 'cover-letter',
                name: 'coverLetter',
                label: 'Cover Letter',
                type: 'textarea',
                placeholder: 'Write a brief cover letter...',
                required: true,
                icon: FileTextIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string') {
                        if (value.length < 50) {
                            return 'Cover letter must be at least 50 characters';
                        }
                        if (value.length > 2000) {
                            return 'Cover letter must be less than 2000 characters';
                        }
                    }
                    return undefined;
                },
            },
            {
                id: 'relocate',
                name: 'relocate',
                label: 'Willing to relocate',
                type: 'checkbox',
                placeholder: 'I am willing to relocate',
                required: false,
                defaultValue: false,
                icon: RocketIcon,
                colSpan: 'full',
            },
            {
                id: 'start-date',
                name: 'startDate',
                label: 'Available Start Date',
                type: 'date',
                placeholder: 'Select date',
                required: true,
                icon: CalendarIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value) {
                        const startDate = new Date(value);
                        const today = new Date();
                        if (startDate < today) {
                            return 'Start date cannot be in the past';
                        }
                    }
                    return undefined;
                },
            },
        ],
    },
];

// 5. Event Registration Form with Validation
const eventSteps: FormStep[] = [
    {
        id: 'attendee',
        title: 'Attendee Information',
        description: 'Tell us about yourself',
        fields: [
            {
                id: 'full-name',
                name: 'fullName',
                label: 'Full Name',
                type: 'text',
                placeholder: 'John Doe',
                required: true,
                icon: PersonIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value.length < 3) {
                        return 'Please enter your full name';
                    }
                    return undefined;
                },
            },
            {
                id: 'email',
                name: 'email',
                label: 'Email Address',
                type: 'email',
                placeholder: 'john@example.com',
                required: true,
                icon: EnvelopeClosedIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string') {
                        return validateEmail(value);
                    }
                    return undefined;
                },
            },
            {
                id: 'company',
                name: 'company',
                label: 'Company/Organization',
                type: 'text',
                placeholder: 'Acme Inc.',
                required: false,
                icon: CrumpledPaperIcon,
                colSpan: 'half',
            },
            {
                id: 'job-title',
                name: 'jobTitle',
                label: 'Job Title',
                type: 'text',
                placeholder: 'Software Engineer',
                required: false,
                icon: ReaderIcon,
                colSpan: 'half',
            },
        ],
    },
    {
        id: 'ticket',
        title: 'Ticket Selection',
        description: 'Choose your ticket type',
        fields: [
            {
                id: 'ticket-type',
                name: 'ticketType',
                label: 'Ticket Type',
                type: 'radio',
                required: true,
                options: [
                    { value: 'general', label: 'General Admission - $99' },
                    { value: 'vip', label: 'VIP - $249 (Includes meet & greet)' },
                    { value: 'student', label: 'Student - $49 (Valid ID required)' },
                    { value: 'group', label: 'Group (5+) - $79 per person' },
                ],
                icon: CheckCircledIcon,
                colSpan: 'full',
            },
            {
                id: 'quantity',
                name: 'quantity',
                label: 'Number of Tickets',
                type: 'select',
                placeholder: 'Select quantity',
                required: true,
                options: [
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                    { value: '4', label: '4' },
                    { value: '5', label: '5' },
                    { value: '6', label: '6+' },
                ],
                icon: PlusIcon,
                colSpan: 'half',
            },
            {
                id: 'dietary',
                name: 'dietary',
                label: 'Dietary Restrictions',
                type: 'select',
                placeholder: 'Select if any',
                required: false,
                options: [
                    { value: 'none', label: 'None' },
                    { value: 'vegetarian', label: 'Vegetarian' },
                    { value: 'vegan', label: 'Vegan' },
                    { value: 'gluten-free', label: 'Gluten-Free' },
                ],
                icon: HeartIcon,
                colSpan: 'half',
            },
        ],
    },
    {
        id: 'workshops',
        title: 'Workshop Selection',
        description: 'Choose your preferred workshops',
        fields: [
            {
                id: 'workshop1',
                name: 'workshop1',
                label: 'Morning Workshop (10 AM - 12 PM)',
                type: 'checkbox',
                placeholder: 'React Advanced Patterns',
                required: false,
                defaultValue: false,
                icon: CodeIcon,
                colSpan: 'full',
            },
            {
                id: 'workshop2',
                name: 'workshop2',
                label: 'Afternoon Workshop (2 PM - 4 PM)',
                type: 'checkbox',
                placeholder: 'TypeScript Best Practices',
                required: false,
                defaultValue: false,
                icon: CodeIcon,
                colSpan: 'full',
            },
            {
                id: 'workshop3',
                name: 'workshop3',
                label: 'Evening Workshop (5 PM - 7 PM)',
                type: 'checkbox',
                placeholder: 'UI/UX Design Principles',
                required: false,
                defaultValue: false,
                icon: CodeIcon,
                colSpan: 'full',
            },
        ],
        validation: (values): Record<string, string> => {
            const errors: Record<string, string> = {};
            const selectedWorkshops = ['workshop1', 'workshop2', 'workshop3'].filter(w => values[w]);
            if (selectedWorkshops.length === 0) {
                errors.workshops = 'Please select at least one workshop';
            }
            return errors;
        },
    },
];

// 6. Profile Setup Form with Validation
const profileSteps: FormStep[] = [
    {
        id: 'basic',
        title: 'Basic Information',
        description: 'Tell us about yourself',
        fields: [
            {
                id: 'display-name',
                name: 'displayName',
                label: 'Display Name',
                type: 'text',
                placeholder: 'Alex Thompson',
                required: true,
                icon: PersonIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string') {
                        if (value.length < 3) {
                            return 'Display name must be at least 3 characters';
                        }
                        if (value.length > 30) {
                            return 'Display name must be less than 30 characters';
                        }
                    }
                    return undefined;
                },
            },
            {
                id: 'bio',
                name: 'bio',
                label: 'Bio',
                type: 'textarea',
                placeholder: 'Tell us about yourself...',
                required: false,
                icon: FileTextIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value.length > 500) {
                        return 'Bio must be less than 500 characters';
                    }
                    return undefined;
                },
            },
            {
                id: 'location',
                name: 'location',
                label: 'Location',
                type: 'text',
                placeholder: 'San Francisco, CA',
                required: false,
                icon: DrawingPinIcon,
                colSpan: 'half',
            },
            {
                id: 'website',
                name: 'website',
                label: 'Website',
                type: 'url',
                placeholder: 'https://yourwebsite.com',
                required: false,
                icon: GlobeIcon,
                colSpan: 'half',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value) {
                        return validateUrl(value);
                    }
                    return undefined;
                },
            },
        ],
    },
    {
        id: 'social',
        title: 'Social Links',
        description: 'Connect your social profiles',
        fields: [
            {
                id: 'twitter',
                name: 'twitter',
                label: 'Twitter',
                type: 'url',
                placeholder: 'https://twitter.com/username',
                required: false,
                icon: LinkedInLogoIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value) {
                        return validateUrl(value);
                    }
                    return undefined;
                },
            },
            {
                id: 'github',
                name: 'github',
                label: 'GitHub',
                type: 'url',
                placeholder: 'https://github.com/username',
                required: false,
                icon: GitHubLogoIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value) {
                        return validateUrl(value);
                    }
                    return undefined;
                },
            },
            {
                id: 'linkedin',
                name: 'linkedin',
                label: 'LinkedIn',
                type: 'url',
                placeholder: 'https://linkedin.com/in/username',
                required: false,
                icon: LinkedInLogoIcon,
                colSpan: 'full',
                validation: (value): string | undefined => {
                    if (typeof value === 'string' && value) {
                        return validateUrl(value);
                    }
                    return undefined;
                },
            },
        ],
    },
    {
        id: 'preferences',
        title: 'Preferences',
        description: 'Set your preferences',
        fields: [
            {
                id: 'theme',
                name: 'theme',
                label: 'Theme Preference',
                type: 'radio',
                required: true,
                options: [
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'system', label: 'System' },
                ],
                icon: LightningBoltIcon,
                colSpan: 'full',
            },
            {
                id: 'email-notifications',
                name: 'emailNotifications',
                label: 'Email Notifications',
                type: 'checkbox',
                placeholder: 'Receive email notifications',
                required: false,
                defaultValue: true,
                icon: BellIcon,
                colSpan: 'full',
            },
        ],
    },
];

// Helper component
const Step = ({ step: _step, children }: { step: number; children: React.ReactNode }): JSX.Element => {
    return <>{children}</>;
};

// Handle submit
const handleSubmit = async (data: any): Promise<void> => {
    console.log('Form submitted:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
};

// ==============================
// MAIN COMPREHENSIVE DEMO
// ==============================

export const MultiStepFormDemo = (): JSX.Element => {
    const { colorMode } = useColorMode();

    // Core state
    const [formType, setFormType] = useState<FormType>('onboarding');
    const [themeVariant, setThemeVariant] = useState<ThemeVariant>(
        colorMode === 'dark' ? 'dark' : 'default'
    );
    const [animationVariant, setAnimationVariant] = useState<AnimationVariant>('fadeUp');
    const [inputVariant, setInputVariant] = useState<InputVariant>('clean');
    const [buttonVariant, setButtonVariant] = useState<ButtonVariant>('primary');

    // Feature toggles
    const [showReviewStep, setShowReviewStep] = useState<boolean>(true);
    const [showStepIndicator, setShowStepIndicator] = useState<boolean>(true);
    const [showCancelButton, setShowCancelButton] = useState<boolean>(true);
    const [showSuccessNotification, setShowSuccessNotification] = useState<boolean>(true);
    const [darkMode, setDarkMode] = useState<boolean>(colorMode === 'dark');

    // Loading states
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Track user changes
    const [userChangedTheme, setUserChangedTheme] = useState<boolean>(false);
    const [animationKey, setAnimationKey] = useState<number>(0);

    // Update theme when color mode changes, but only if user hasn't manually changed it
    useEffect(() => {
        if (!userChangedTheme) {
            setThemeVariant(colorMode === 'dark' ? 'dark' : 'default');
            setDarkMode(colorMode === 'dark');
        }
    }, [colorMode, userChangedTheme]);

    // Force remount when key settings change
    useEffect(() => {
        setAnimationKey((k) => k + 1);
    }, [formType, themeVariant, animationVariant, inputVariant, buttonVariant]);

    // Handle theme change
    const handleThemeChange = (value: string): void => {
        setThemeVariant(value as ThemeVariant);
        setDarkMode(value === 'dark');
        setUserChangedTheme(true);
    };

    // Get current form steps
    const getCurrentSteps = (): FormStep[] => {
        switch (formType) {
            case 'onboarding': return onboardingSteps;
            case 'registration': return registrationSteps;
            case 'payment': return paymentSteps;
            case 'job': return jobSteps;
            case 'event': return eventSteps;
            case 'profile': return profileSteps;
            default: return onboardingSteps;
        }
    };

    const steps = getCurrentSteps();
    const CurrentIcon = formIcons[formType];

    const buildCodeString = (): string => {
        const iconName = iconNames[formType];
        const currentSteps = getCurrentSteps();

        // Create a simplified example based on the first step
        const firstStep = currentSteps[0];
        const exampleFields = firstStep.fields.slice(0, 2).map(field => ({
            id: field.id,
            name: field.name,
            label: field.label,
            type: field.type,
            required: field.required,
            ...(field.options ? { options: field.options.slice(0, 2) } : {}),
            ...(field.colSpan ? { colSpan: field.colSpan } : {}),
            ...(field.icon ? { icon: field.icon } : {}),
            ...(field.validation ? { validation: '(value) => { /* validation logic */ }' } : {})
        }));

        const props = [
            `steps={${formType}Steps}`,
            `onSubmit={handleSubmit}`,
            `variant="${themeVariant}"`,
            `animationVariant="${animationVariant}"`,
            `inputVariant="${inputVariant}"`,
            `buttonVariant="${buttonVariant}"`,
            `showReviewStep={${showReviewStep}}`,
            `showCancelButton={${showCancelButton}}`,
            `showSuccessNotification={${showSuccessNotification}}`,
            `darkMode={${darkMode}}`,
        ];

        const submitLabel = formType === 'payment' ? 'Pay Now' :
            formType === 'registration' ? 'Create Account' :
                formType === 'job' ? 'Submit Application' :
                    formType === 'event' ? 'Register Now' :
                        'Submit';

        return `import {
    MultiStepForm,
    MultiStepHeader,
    MultiStepStepIndicator,
    MultiStepContent,
    MultiStepNavigation,
    MultiStepReview,
    MultiStepField,
    type FormStep,
} from '../UI/multi-step-form';
import {
    ${iconName},
    PersonIcon,
    EnvelopeClosedIcon,
    BriefcaseIcon,
    LockClosedIcon,
} from '@radix-ui/react-icons';

// Steps configuration (${formType} form example)
const ${formType}Steps: FormStep[] = [
    {
        id: 'step-1',
        title: '${firstStep.title}',
        description: '${firstStep.description || 'Enter your information'}',
        fields: [
            ${exampleFields.map(field => `{
                id: '${field.id}',
                name: '${field.name}',
                label: '${field.label}',
                type: '${field.type}',
                required: ${field.required},
                ${field.colSpan ? `colSpan: '${field.colSpan}',` : ''}
                ${field.icon ? `icon: ${field.icon},` : ''}
                ${field.options ? `options: ${JSON.stringify(field.options, null, 8).replace(/"([^"]+)":/g, '$1:')},` : ''}
                ${field.validation ? `validation: (value) => {
                    // Add your validation logic here
                    if (!value) return 'This field is required';
                    return undefined;
                },` : ''}
            },`).join('\n            ')}
            // Add more fields as needed
        ],
    },
    // Add more steps as needed
];

<MultiStepForm
    ${props.join('\n    ')}
>
    <MultiStepHeader 
        title="${formType.charAt(0).toUpperCase() + formType.slice(1)} Form" 
        icon={<${iconName} className="w-4 h-4" />}
        titleVariant="h1"
        titleClassName="text-4xl font-bold"
    />
    ${showStepIndicator ? '<MultiStepStepIndicator />' : ''}
    
    <MultiStepContent>
        {${formType}Steps.map((step, index) => (
            <Step key={step.id} step={index + 1}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {step.fields.map(field => (
                        <div key={field.id} className={field.colSpan === 'full' ? 'md:col-span-2' : ''}>
                            <MultiStepField field={field} />
                        </div>
                    ))}
                </div>
            </Step>
        ))}
        
        ${showReviewStep ? '<MultiStepReview />' : ''}
    </MultiStepContent>
    
    <MultiStepNavigation 
        showCancelButton={${showCancelButton}}
        submitButtonLabel="${submitLabel}"
    />
</MultiStepForm>`;
    };

    return (
        <div className="space-y-6">
            {/* Theme Controls - First Row */}
            <div className="flex items-center justify-end flex-wrap gap-2">
                {/* Form Type Selector */}
                <div className="space-y-2 mx-1">
                    <VariantSelector
                        variants={formTypeOptions.map(o => o.value)}
                        selectedVariant={formType}
                        onSelectVariant={(value): void => setFormType(value as FormType)}
                        type="Form Type"
                        variantLabels={Object.fromEntries(formTypeOptions.map(o => [o.value, o.label]))}
                    />
                </div>

                <div className="space-y-2 mx-1">
                    <VariantSelector
                        variants={themeOptions.map(o => o.value)}
                        selectedVariant={themeVariant}
                        onSelectVariant={handleThemeChange}
                        type="Theme"
                        variantLabels={Object.fromEntries(themeOptions.map(o => [o.value, o.label]))}
                    />
                </div>

                <div className="space-y-2 mx-1">
                    <VariantSelector
                        variants={animationTypes as unknown as string[]}
                        selectedVariant={animationVariant}
                        onSelectVariant={(value): void => setAnimationVariant(value as AnimationVariant)}
                        type="Animation"
                        variantLabels={{
                            fadeUp: 'Fade Up',
                            scaleIn: 'Scale In',
                            slideUp: 'Slide Up',
                            slideLeft: 'Slide Left',
                            slideRight: 'Slide Right'
                        }}
                    />
                </div>

                <div className="space-y-2 mx-1">
                    <VariantSelector
                        variants={inputVariantOptions.map(o => o.value)}
                        selectedVariant={inputVariant}
                        onSelectVariant={(value): void => setInputVariant(value as InputVariant)}
                        type="Input"
                        variantLabels={Object.fromEntries(inputVariantOptions.map(o => [o.value, o.label]))}
                    />
                </div>

                <div className="space-y-2 mx-1">
                    <VariantSelector
                        variants={buttonVariantOptions.map(o => o.value)}
                        selectedVariant={buttonVariant}
                        onSelectVariant={(value): void => setButtonVariant(value as ButtonVariant)}
                        type="Button"
                        variantLabels={Object.fromEntries(buttonVariantOptions.map(o => [o.value, o.label]))}
                    />
                </div>
            </div>

            {/* Feature Toggles */}
            <div className={cn(
                "flex flex-row items-center justify-end gap-2 px-2",
            )}>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showReviewStep}
                        onChange={(e): void => setShowReviewStep(e.target.checked)}
                        className="rounded text-primary"
                    />
                    <span className={cn(
                        "text-sm",
                        darkMode ? "text-gray-200" : "text-gray-700"
                    )}>Review Step</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showStepIndicator}
                        onChange={(e): void => setShowStepIndicator(e.target.checked)}
                        className="rounded text-primary"
                    />
                    <span className={cn(
                        "text-sm",
                        darkMode ? "text-gray-200" : "text-gray-700"
                    )}>Step Indicator</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showCancelButton}
                        onChange={(e): void => setShowCancelButton(e.target.checked)}
                        className="rounded text-primary"
                    />
                    <span className={cn(
                        "text-sm",
                        darkMode ? "text-gray-200" : "text-gray-700"
                    )}>Cancel Button</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showSuccessNotification}
                        onChange={(e): void => setShowSuccessNotification(e.target.checked)}
                        className="rounded text-primary"
                    />
                    <span className={cn(
                        "text-sm",
                        darkMode ? "text-gray-200" : "text-gray-700"
                    )}>Success Notification</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={(e): void => {
                            setDarkMode(e.target.checked);
                            setThemeVariant(e.target.checked ? 'dark' : 'default');
                            setUserChangedTheme(true);
                        }}
                        className="rounded text-primary"
                    />
                    <span className={cn(
                        "text-sm",
                        darkMode ? "text-gray-200" : "text-gray-700"
                    )}>Dark Mode</span>
                </label>
            </div>

            {/* Loading State Controls */}
            <div className="flex items-center justify-end flex-wrap gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(): void => setIsSubmitting(!isSubmitting)}
                    className="cursor-pointer mx-1"
                >
                    {isSubmitting ? 'Stop Submitting' : 'Show Submitting State'}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(): void => {
                        setFormType('onboarding');
                        setThemeVariant('default');
                        setAnimationVariant('fadeUp');
                        setInputVariant('clean');
                        setButtonVariant('primary');
                        setShowReviewStep(true);
                        setShowStepIndicator(true);
                        setShowCancelButton(true);
                        setShowSuccessNotification(true);
                        setDarkMode(colorMode === 'dark');
                        setIsLoading(false);
                        setIsSubmitting(false);
                        setUserChangedTheme(false);
                    }}
                    className="cursor-pointer mx-2"
                >
                    Reset All
                </Button>
            </div>

            {/* Preview and Code Tabs */}
            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                        <MultiStepForm
                            key={`demo-${animationKey}`}
                            steps={steps}
                            onSubmit={handleSubmit}
                            variant={themeVariant}
                            animationVariant={animationVariant}
                            inputVariant={inputVariant}
                            buttonVariant={buttonVariant}
                            buttonAnimationVariant={buttonVariant !== 'default' ? 'scaleHeartBeat' : undefined}
                            showReviewStep={showReviewStep}
                            showCancelButton={showCancelButton}
                            showSuccessNotification={showSuccessNotification}
                            isLoading={isLoading}
                            isSubmitting={isSubmitting}
                            darkMode={darkMode}
                        >
                            <MultiStepForm.Header
                                title={`${formType.charAt(0).toUpperCase() + formType.slice(1)} Form`}
                                icon={<CurrentIcon className="w-4 h-4" />}
                                titleVariant="h1"
                                titleClassName="text-4xl font-bold"
                                iconSize={32}
                                iconClassName="w-12 h-12"
                            />

                            {showStepIndicator && (
                                <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <MultiStepForm.StepIndicator className='my-8' />
                                </div>
                            )}

                            <MultiStepForm.Content>
                                {steps.map((step, index) => (
                                    <Step key={step.id} step={index + 1}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {step.fields.map(field => (
                                                <div
                                                    key={field.id}
                                                    className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                                                >
                                                    <MultiStepForm.Field field={field} />
                                                </div>
                                            ))}
                                        </div>
                                    </Step>
                                ))}

                                {showReviewStep && <MultiStepForm.Review />}
                            </MultiStepForm.Content>

                            <MultiStepForm.Navigation
                                showCancelButton={showCancelButton}
                                submitButtonLabel={
                                    formType === 'payment' ? 'Pay Now' :
                                        formType === 'registration' ? 'Create Account' :
                                            formType === 'job' ? 'Submit Application' :
                                                formType === 'event' ? 'Register Now' :
                                                    'Submit'
                                }
                            />
                        </MultiStepForm>
                    </div>
                </TabItem>

                <TabItem value="code" label="Code">
                    <div className="mt-4">
                        <CodeBlock language="tsx" className="text-sm">
                            {buildCodeString()}
                        </CodeBlock>
                    </div>
                </TabItem>
            </Tabs>
        </div>
    );
};

export default MultiStepFormDemo;