import React, { useState, useEffect } from 'react';
import type { JSX } from 'react';
import {
    DynamicForm,
    DynamicHeader,
    DynamicContent,
    DynamicField,
    DynamicSection,
    DynamicNavigation,
} from '../UI/dynamic-form';
import type { DynamicFormField, FormValues } from '../UI/dynamic-form';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import VariantSelector from './VariantSelector';
import { useColorMode } from '@docusaurus/theme-common';
import {
    PersonIcon,
    EnvelopeClosedIcon,
    LockClosedIcon,
    HeartIcon,
    HomeIcon,
    RocketIcon,
    LightningBoltIcon,
    GlobeIcon,
    LayersIcon,
    IdCardIcon,
    StarIcon,
    DrawingPinIcon,
    ClockIcon,
    ReaderIcon,
    ChatBubbleIcon,
    MobileIcon,
    CardStackIcon,
    LinkedInLogoIcon,
    GitHubLogoIcon,
    CubeIcon,
    BookmarkIcon,
    MixIcon,
    SpeakerLoudIcon,
} from '@radix-ui/react-icons';
import { cn } from '@site/src/utils/cn';
import { Button } from '@site/src/components/UI/button';

type ThemeVariant = 'default' | 'vibrant' | 'pastel' | 'neon' | 'earthy' | 'ocean' | 'sunset' | 'forest' | 'galaxy' | 'candy' | 'dark';
type CardVariant = 'default' | 'glass' | 'border' | 'elevated' | 'neon' | 'vibrant';
type AnimationIntensity = 'subtle' | 'moderate' | 'high';
type FormType = 'registration' | 'business' | 'developer' | 'survey' | 'health' | 'checkout' | 'job' | 'travel' | 'education';

const themeOptions = [
    { value: 'default', label: 'Default' },
    { value: 'vibrant', label: 'Vibrant' },
    { value: 'pastel', label: 'Pastel' },
    { value: 'neon', label: 'Neon' },
    { value: 'earthy', label: 'Earthy' },
    { value: 'ocean', label: 'Ocean' },
    { value: 'sunset', label: 'Sunset' },
    { value: 'forest', label: 'Forest' },
    { value: 'galaxy', label: 'Galaxy' },
    { value: 'candy', label: 'Candy' },
    { value: 'dark', label: 'Pure Dark' },
];

// Form type options
const formTypeOptions = [
    { value: 'registration', label: 'User Registration' },
    { value: 'business', label: 'Business Onboarding' },
    { value: 'developer', label: 'Developer Profile' },
    { value: 'survey', label: 'Survey & Feedback' },
    { value: 'health', label: 'Health & Fitness' },
    { value: 'checkout', label: 'E-commerce Checkout' },
    { value: 'job', label: 'Job Application' },
    { value: 'travel', label: 'Travel Booking' },
    { value: 'education', label: 'Education Enrollment' },
];

// Form icons mapping
const formIcons = {
    registration: PersonIcon,
    business: HomeIcon,
    developer: GitHubLogoIcon,
    survey: ChatBubbleIcon,
    health: HeartIcon,
    checkout: CardStackIcon,
    job: ReaderIcon,
    travel: GlobeIcon,
    education: BookmarkIcon,
};

// Icon names for code generation
const iconNames = {
    registration: 'PersonIcon',
    business: 'HomeIcon',
    developer: 'GitHubLogoIcon',
    survey: 'ChatBubbleIcon',
    health: 'HeartIcon',
    checkout: 'CardStackIcon',
    job: 'ReaderIcon',
    travel: 'GlobeIcon',
    education: 'BookmarkIcon',
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

const confirmPasswordValidation = (value: string | boolean | number | undefined, allValues?: Record<string, string | boolean | number | undefined>): string | undefined => {
    if (allValues && value !== allValues.password) {
        return 'Passwords do not match';
    }
    return undefined;
};

// ==============================
// FORM TYPE CONFIGURATIONS WITH CONDITIONAL FIELDS
// ==============================

// 1. User Registration Form - with Account Type selection
const registrationFields: DynamicFormField[] = [
    {
        id: 'name',
        name: 'name',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Enter your full name',
        required: true,
        icon: PersonIcon,
        colSpan: 'full',
        textValidation: { minLength: 2, maxLength: 100 }
    },
    {
        id: 'email',
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'your@email.com',
        required: true,
        icon: EnvelopeClosedIcon,
        colSpan: 'half',
        emailValidation: { pattern: true },
        validation: (value): string | undefined => {
            if (typeof value === 'string') {
                return validateEmail(value);
            }
            return undefined;
        }
    },
    {
        id: 'phone',
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        placeholder: '+1 (555) 123-4567',
        icon: MobileIcon,
        colSpan: 'half',
        validation: (value): string | undefined => {
            if (typeof value === 'string' && value) {
                return validatePhone(value);
            }
            return undefined;
        }
    },
    {
        id: 'accountType',
        name: 'accountType',
        label: 'Account Type',
        type: 'radio',
        required: true,
        icon: MixIcon,
        colSpan: 'full',
        options: [
            { value: 'personal', label: 'Personal Account' },
            { value: 'business', label: 'Business Account' },
            { value: 'premium', label: 'Premium Account' }
        ],
        conditionalFields: [
            {
                fieldId: 'companyName',
                condition: { field: 'accountType', operator: 'equals', value: 'business' }
            },
            {
                fieldId: 'premiumFeatures',
                condition: { field: 'accountType', operator: 'equals', value: 'premium' }
            }
        ]
    },
    {
        id: 'companyName',
        name: 'companyName',
        label: 'Company Name',
        type: 'text',
        placeholder: 'Enter your company name',
        icon: HomeIcon,
        colSpan: 'full',
        conditions: [{ field: 'accountType', operator: 'equals', value: 'business' }],
        required: true,
        textValidation: { minLength: 2 }
    },
    {
        id: 'premiumFeatures',
        name: 'premiumFeatures',
        label: 'Premium Features',
        type: 'select',
        placeholder: 'Select premium features',
        icon: StarIcon,
        colSpan: 'full',
        conditions: [{ field: 'accountType', operator: 'equals', value: 'premium' }],
        required: true,
        options: [
            { value: 'analytics', label: 'Advanced Analytics' },
            { value: 'support', label: 'Priority Support' },
            { value: 'custom', label: 'Custom Branding' },
            { value: 'api', label: 'API Access' }
        ]
    },
    {
        id: 'dob',
        name: 'dob',
        label: 'Date of Birth',
        type: 'date',
        icon: ClockIcon,
        colSpan: 'full'
    },
    {
        id: 'password',
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Create a password',
        required: true,
        icon: LockClosedIcon,
        colSpan: 'half',
        textValidation: { minLength: 8 },
        validation: (value): string | undefined => {
            if (typeof value === 'string') {
                return validatePassword(value);
            }
            return undefined;
        }
    },
    {
        id: 'confirmPassword',
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        placeholder: 'Confirm your password',
        required: true,
        icon: LockClosedIcon,
        colSpan: 'half',
        validation: confirmPasswordValidation
    },
    {
        id: 'newsletter',
        name: 'newsletter',
        label: 'Subscribe to Newsletter',
        type: 'checkbox',
        icon: HeartIcon,
        colSpan: 'full',
        defaultValue: false,
        conditionalFields: [
            {
                fieldId: 'newsletterFrequency',
                condition: { field: 'newsletter', operator: 'equals', value: true }
            }
        ]
    },
    {
        id: 'newsletterFrequency',
        name: 'newsletterFrequency',
        label: 'Newsletter Frequency',
        type: 'select',
        placeholder: 'How often?',
        icon: ClockIcon,
        colSpan: 'full',
        options: [
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
        ],
        conditions: [{ field: 'newsletter', operator: 'equals', value: true }]
    }
];

const registrationSections = [
    { title: 'Personal Information', description: 'Tell us about yourself', fields: ['name', 'email', 'phone', 'dob'] },
    { title: 'Account Type', description: 'Choose your account type', fields: ['accountType', 'companyName', 'premiumFeatures'] },
    { title: 'Account Security', description: 'Secure your account', fields: ['password', 'confirmPassword', 'newsletter', 'newsletterFrequency'] }
];

// 2. Business Onboarding Form - with Business Type selection
const businessFields: DynamicFormField[] = [
    {
        id: 'companyName',
        name: 'companyName',
        label: 'Company Name',
        type: 'text',
        placeholder: 'Enter company name',
        required: true,
        icon: HomeIcon,
        colSpan: 'full'
    },
    {
        id: 'businessType',
        name: 'businessType',
        label: 'Business Type',
        type: 'radio',
        placeholder: 'Select business type',
        required: true,
        icon: LayersIcon,
        colSpan: 'full',
        options: [
            { value: 'llc', label: 'LLC' },
            { value: 'corporation', label: 'Corporation' },
            { value: 'partnership', label: 'Partnership' },
            { value: 'nonprofit', label: 'Non-Profit' }
        ],
        conditionalFields: [
            {
                fieldId: 'llcDetails',
                condition: { field: 'businessType', operator: 'equals', value: 'llc' }
            },
            {
                fieldId: 'corpDetails',
                condition: { field: 'businessType', operator: 'equals', value: 'corporation' }
            },
            {
                fieldId: 'nonprofitDetails',
                condition: { field: 'businessType', operator: 'equals', value: 'nonprofit' }
            }
        ]
    },
    {
        id: 'llcDetails',
        name: 'llcDetails',
        label: 'LLC Operating Agreement',
        type: 'textarea',
        placeholder: 'Describe your operating agreement',
        icon: ReaderIcon,
        colSpan: 'full',
        conditions: [{ field: 'businessType', operator: 'equals', value: 'llc' }],
        required: true
    },
    {
        id: 'corpDetails',
        name: 'corpDetails',
        label: 'Corporate Bylaws',
        type: 'textarea',
        placeholder: 'Describe your corporate bylaws',
        icon: ReaderIcon,
        colSpan: 'full',
        conditions: [{ field: 'businessType', operator: 'equals', value: 'corporation' }],
        required: true
    },
    {
        id: 'nonprofitDetails',
        name: 'nonprofitDetails',
        label: 'Non-Profit Charter',
        type: 'textarea',
        placeholder: 'Describe your non-profit charter',
        icon: HeartIcon,
        colSpan: 'full',
        conditions: [{ field: 'businessType', operator: 'equals', value: 'nonprofit' }],
        required: true
    },
    {
        id: 'registrationNumber',
        name: 'registrationNumber',
        label: 'Registration Number',
        type: 'text',
        placeholder: 'Company registration number',
        icon: IdCardIcon,
        colSpan: 'half'
    },
    {
        id: 'taxId',
        name: 'taxId',
        label: 'Tax ID / EIN',
        type: 'text',
        placeholder: 'XX-XXXXXXX',
        required: true,
        icon: IdCardIcon,
        colSpan: 'half',
        textValidation: { pattern: /^\d{2}-\d{7}$/, message: 'Format: XX-XXXXXXX' }
    },
    {
        id: 'address',
        name: 'address',
        label: 'Business Address',
        type: 'text',
        placeholder: 'Street address',
        required: true,
        icon: HomeIcon,
        colSpan: 'full'
    },
    {
        id: 'city',
        name: 'city',
        label: 'City',
        type: 'text',
        placeholder: 'City',
        required: true,
        colSpan: 'third'
    },
    {
        id: 'state',
        name: 'state',
        label: 'State',
        type: 'text',
        placeholder: 'State',
        required: true,
        colSpan: 'third'
    },
    {
        id: 'postalCode',
        name: 'postalCode',
        label: 'Postal Code',
        type: 'text',
        placeholder: 'Postal code',
        required: true,
        colSpan: 'third'
    },
    {
        id: 'country',
        name: 'country',
        label: 'Country',
        type: 'select',
        placeholder: 'Select country',
        required: true,
        icon: GlobeIcon,
        colSpan: 'full',
        options: [
            { value: 'us', label: 'United States' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'ca', label: 'Canada' },
            { value: 'au', label: 'Australia' }
        ]
    },
    {
        id: 'hasBusinessEmail',
        name: 'hasBusinessEmail',
        label: 'Do you have a dedicated business email?',
        type: 'radio',
        icon: EnvelopeClosedIcon,
        colSpan: 'full',
        defaultValue: 'no',
        options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
        ],
        conditionalFields: [
            {
                fieldId: 'businessEmail',
                condition: { field: 'hasBusinessEmail', operator: 'equals', value: 'yes' }
            }
        ]
    },
    {
        id: 'businessEmail',
        name: 'businessEmail',
        label: 'Business Email',
        type: 'email',
        placeholder: 'business@company.com',
        icon: EnvelopeClosedIcon,
        colSpan: 'full',
        conditions: [{ field: 'hasBusinessEmail', operator: 'equals', value: 'yes' }],
        validation: (value): string | undefined => {
            if (typeof value === 'string' && value) {
                return validateEmail(value);
            }
            return undefined;
        }
    }
];

const businessSections = [
    { title: 'Company Details', description: 'Basic company information', fields: ['companyName', 'businessType', 'llcDetails', 'corpDetails', 'nonprofitDetails', 'registrationNumber', 'taxId'] },
    { title: 'Business Address', description: 'Your business location', fields: ['address', 'city', 'state', 'postalCode', 'country'] },
    { title: 'Contact Information', description: 'How to reach your business', fields: ['hasBusinessEmail', 'businessEmail'] }
];

// 3. Developer Profile Form - with Experience Level
const developerFields: DynamicFormField[] = [
    {
        id: 'fullName',
        name: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Jane Doe',
        required: true,
        icon: PersonIcon,
        colSpan: 'full'
    },
    {
        id: 'experienceLevel',
        name: 'experienceLevel',
        label: 'Experience Level',
        type: 'radio',
        required: true,
        icon: RocketIcon,
        colSpan: 'full',
        options: [
            { value: 'junior', label: 'Junior (0-2 years)' },
            { value: 'mid', label: 'Mid-Level (3-5 years)' },
            { value: 'senior', label: 'Senior (6+ years)' }
        ],
        conditionalFields: [
            {
                fieldId: 'juniorDetails',
                condition: { field: 'experienceLevel', operator: 'equals', value: 'junior' }
            },
            {
                fieldId: 'seniorDetails',
                condition: { field: 'experienceLevel', operator: 'equals', value: 'senior' }
            }
        ]
    },
    {
        id: 'juniorDetails',
        name: 'juniorDetails',
        label: 'Education & Bootcamps',
        type: 'textarea',
        placeholder: 'List your education, bootcamps, and learning resources',
        icon: BookmarkIcon,
        colSpan: 'full',
        conditions: [{ field: 'experienceLevel', operator: 'equals', value: 'junior' }],
        required: true
    },
    {
        id: 'seniorDetails',
        name: 'seniorDetails',
        label: 'Leadership & Architecture Experience',
        type: 'textarea',
        placeholder: 'Describe your experience leading teams and designing systems',
        icon: StarIcon,
        colSpan: 'full',
        conditions: [{ field: 'experienceLevel', operator: 'equals', value: 'senior' }],
        required: true
    },
    {
        id: 'github',
        name: 'github',
        label: 'GitHub Username',
        type: 'text',
        placeholder: 'johndoe',
        icon: GitHubLogoIcon,
        colSpan: 'half'
    },
    {
        id: 'linkedin',
        name: 'linkedin',
        label: 'LinkedIn URL',
        type: 'url',
        placeholder: 'https://linkedin.com/in/johndoe',
        icon: LinkedInLogoIcon,
        colSpan: 'half',
        validation: (value): string | undefined => {
            if (typeof value === 'string' && value) {
                return validateUrl(value);
            }
            return undefined;
        }
    },
    {
        id: 'primaryLanguage',
        name: 'primaryLanguage',
        label: 'Primary Programming Language',
        type: 'select',
        placeholder: 'Select language',
        required: true,
        icon: LightningBoltIcon,
        colSpan: 'half',
        options: [
            { value: 'javascript', label: 'JavaScript/TypeScript' },
            { value: 'python', label: 'Python' },
            { value: 'java', label: 'Java' },
            { value: 'csharp', label: 'C#' },
            { value: 'go', label: 'Go' },
            { value: 'rust', label: 'Rust' }
        ]
    },
    {
        id: 'technologies',
        name: 'technologies',
        label: 'Technologies & Tools',
        type: 'textarea',
        placeholder: 'React, Node.js, Docker, AWS...',
        required: true,
        icon: CubeIcon,
        colSpan: 'full'
    }
];

const developerSections = [
    { title: 'Basic Info', description: 'Your personal details', fields: ['fullName', 'experienceLevel', 'juniorDetails', 'seniorDetails'] },
    { title: 'Professional Profiles', description: 'Your online presence', fields: ['github', 'linkedin'] },
    { title: 'Skills & Experience', description: 'Your technical expertise', fields: ['primaryLanguage', 'technologies'] }
];

// 4. Survey & Feedback Form - with conditional follow-up
const surveyFields: DynamicFormField[] = [
    {
        id: 'satisfaction',
        name: 'satisfaction',
        label: 'How satisfied are you?',
        type: 'radio',
        required: true,
        icon: HeartIcon,
        colSpan: 'full',
        options: [
            { value: 'very', label: 'Very Satisfied' },
            { value: 'somewhat', label: 'Somewhat Satisfied' },
            { value: 'neutral', label: 'Neutral' },
            { value: 'unsatisfied', label: 'Unsatisfied' }
        ],
        conditionalFields: [
            {
                fieldId: 'improvementFeedback',
                condition: { field: 'satisfaction', operator: 'equals', value: 'unsatisfied' }
            }
        ]
    },
    {
        id: 'improvementFeedback',
        name: 'improvementFeedback',
        label: 'How can we improve?',
        type: 'textarea',
        placeholder: 'Please tell us what we could do better...',
        icon: ChatBubbleIcon,
        colSpan: 'full',
        conditions: [{ field: 'satisfaction', operator: 'equals', value: 'unsatisfied' }],
        required: true
    },
    {
        id: 'recommendation',
        name: 'recommendation',
        label: 'How likely to recommend? (0-10)',
        type: 'range',
        icon: StarIcon,
        colSpan: 'full',
        numberValidation: { min: 0, max: 10 }
    },
    {
        id: 'feedback',
        name: 'feedback',
        label: 'Detailed Feedback',
        type: 'textarea',
        placeholder: 'Please share your thoughts...',
        icon: ChatBubbleIcon,
        colSpan: 'full'
    },
    {
        id: 'contactPermission',
        name: 'contactPermission',
        label: 'Can we contact you for follow-up?',
        type: 'checkbox',
        icon: EnvelopeClosedIcon,
        colSpan: 'half',
        defaultValue: false,
        conditionalFields: [
            {
                fieldId: 'contactEmail',
                condition: { field: 'contactPermission', operator: 'equals', value: true }
            },
            {
                fieldId: 'contactMethod',
                condition: { field: 'contactPermission', operator: 'equals', value: true }
            }
        ]
    },
    {
        id: 'contactMethod',
        name: 'contactMethod',
        label: 'Preferred Contact Method',
        type: 'radio',
        icon: SpeakerLoudIcon,
        colSpan: 'half',
        options: [
            { value: 'email', label: 'Email' },
            { value: 'phone', label: 'Phone' }
        ],
        conditions: [{ field: 'contactPermission', operator: 'equals', value: true }],
        defaultValue: 'email',
        conditionalFields: [
            {
                fieldId: 'contactEmail',
                condition: { field: 'contactMethod', operator: 'equals', value: 'email' }
            },
            {
                fieldId: 'contactPhone',
                condition: { field: 'contactMethod', operator: 'equals', value: 'phone' }
            }
        ]
    },
    {
        id: 'contactEmail',
        name: 'contactEmail',
        label: 'Contact Email',
        type: 'email',
        placeholder: 'your@email.com',
        icon: EnvelopeClosedIcon,
        colSpan: 'half',
        conditions: [
            { field: 'contactPermission', operator: 'equals', value: true },
            { field: 'contactMethod', operator: 'equals', value: 'email' }
        ],
        validation: (value): string | undefined => {
            if (typeof value === 'string' && value) {
                return validateEmail(value);
            }
            return undefined;
        }
    },
    {
        id: 'contactPhone',
        name: 'contactPhone',
        label: 'Contact Phone',
        type: 'tel',
        placeholder: '+1 (555) 123-4567',
        icon: MobileIcon,
        colSpan: 'half',
        conditions: [
            { field: 'contactPermission', operator: 'equals', value: true },
            { field: 'contactMethod', operator: 'equals', value: 'phone' }
        ],
        validation: (value): string | undefined => {
            if (typeof value === 'string' && value) {
                return validatePhone(value);
            }
            return undefined;
        }
    }
];

const surveySections = [
    { title: 'Experience Rating', description: 'How was your experience?', fields: ['satisfaction', 'improvementFeedback', 'recommendation'] },
    { title: 'Detailed Feedback', description: 'Tell us more', fields: ['feedback'] },
    { title: 'Follow-up', description: 'Optional contact information', fields: ['contactPermission', 'contactMethod', 'contactEmail', 'contactPhone'] }
];

// 5. Health & Fitness Form - with conditional goals
const healthFields: DynamicFormField[] = [
    {
        id: 'age',
        name: 'age',
        label: 'Age',
        type: 'number',
        placeholder: 'Enter your age',
        required: true,
        icon: PersonIcon,
        colSpan: 'third',
        numberValidation: { min: 1, max: 120 }
    },
    {
        id: 'gender',
        name: 'gender',
        label: 'Gender',
        type: 'select',
        placeholder: 'Select gender',
        icon: PersonIcon,
        colSpan: 'third',
        options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'non-binary', label: 'Non-binary' },
            { value: 'prefer-not', label: 'Prefer not to say' }
        ]
    },
    {
        id: 'activityLevel',
        name: 'activityLevel',
        label: 'Activity Level',
        type: 'select',
        placeholder: 'Select activity level',
        required: true,
        icon: RocketIcon,
        colSpan: 'third',
        options: [
            { value: 'sedentary', label: 'Sedentary' },
            { value: 'light', label: 'Lightly active' },
            { value: 'moderate', label: 'Moderately active' },
            { value: 'very', label: 'Very active' }
        ]
    },
    {
        id: 'primaryGoal',
        name: 'primaryGoal',
        label: 'Primary Fitness Goal',
        type: 'radio',
        required: true,
        icon: StarIcon,
        colSpan: 'full',
        options: [
            { value: 'weight-loss', label: 'Weight Loss' },
            { value: 'muscle-gain', label: 'Muscle Gain' },
            { value: 'endurance', label: 'Endurance' },
            { value: 'general', label: 'General Health' }
        ],
        conditionalFields: [
            {
                fieldId: 'weightLossDetails',
                condition: { field: 'primaryGoal', operator: 'equals', value: 'weight-loss' }
            },
            {
                fieldId: 'muscleGainDetails',
                condition: { field: 'primaryGoal', operator: 'equals', value: 'muscle-gain' }
            },
            {
                fieldId: 'enduranceDetails',
                condition: { field: 'primaryGoal', operator: 'equals', value: 'endurance' }
            }
        ]
    },
    {
        id: 'weightLossDetails',
        name: 'weightLossDetails',
        label: 'Target Weight Loss',
        type: 'number',
        placeholder: 'How many pounds?',
        icon: StarIcon,
        colSpan: 'half',
        conditions: [{ field: 'primaryGoal', operator: 'equals', value: 'weight-loss' }],
        numberValidation: { min: 1, max: 200 }
    },
    {
        id: 'muscleGainDetails',
        name: 'muscleGainDetails',
        label: 'Target Muscle Groups',
        type: 'textarea',
        placeholder: 'Which muscle groups do you want to focus on?',
        icon: LightningBoltIcon,
        colSpan: 'half',
        conditions: [{ field: 'primaryGoal', operator: 'equals', value: 'muscle-gain' }]
    },
    {
        id: 'enduranceDetails',
        name: 'enduranceDetails',
        label: 'Endurance Goals',
        type: 'textarea',
        placeholder: 'Describe your endurance goals (run distance, time, etc.)',
        icon: RocketIcon,
        colSpan: 'half',
        conditions: [{ field: 'primaryGoal', operator: 'equals', value: 'endurance' }]
    },
    {
        id: 'dietaryRestrictions',
        name: 'dietaryRestrictions',
        label: 'Do you have dietary restrictions?',
        type: 'radio',
        icon: HeartIcon,
        colSpan: 'full',
        defaultValue: 'no',
        options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
        ],
        conditionalFields: [
            {
                fieldId: 'dietaryDetails',
                condition: { field: 'dietaryRestrictions', operator: 'equals', value: 'yes' }
            }
        ]
    },
    {
        id: 'dietaryDetails',
        name: 'dietaryDetails',
        label: 'Dietary Restrictions Details',
        type: 'textarea',
        placeholder: 'Please describe your dietary restrictions...',
        icon: HeartIcon,
        colSpan: 'full',
        conditions: [{ field: 'dietaryRestrictions', operator: 'equals', value: 'yes' }]
    }
];

const healthSections = [
    { title: 'Personal Stats', description: 'Basic information', fields: ['age', 'gender', 'activityLevel'] },
    { title: 'Fitness Goals', description: 'Your fitness journey', fields: ['primaryGoal', 'weightLossDetails', 'muscleGainDetails', 'enduranceDetails'] },
    { title: 'Health Considerations', description: 'Additional health information', fields: ['dietaryRestrictions', 'dietaryDetails'] }
];

// 6. E-commerce Checkout Form - with shipping options
const checkoutFields: DynamicFormField[] = [
    {
        id: 'email',
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'your@email.com',
        required: true,
        icon: EnvelopeClosedIcon,
        colSpan: 'full',
        validation: (value): string | undefined => {
            if (typeof value === 'string') {
                return validateEmail(value);
            }
            return undefined;
        }
    },
    {
        id: 'shippingName',
        name: 'shippingName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Enter full name',
        required: true,
        icon: PersonIcon,
        colSpan: 'full'
    },
    {
        id: 'shippingMethod',
        name: 'shippingMethod',
        label: 'Shipping Method',
        type: 'radio',
        required: true,
        icon: RocketIcon,
        colSpan: 'full',
        options: [
            { value: 'standard', label: 'Standard (5-7 business days)' },
            { value: 'express', label: 'Express (2-3 business days)' },
            { value: 'overnight', label: 'Overnight (1 business day)' }
        ],
        defaultValue: 'standard',
        conditionalFields: [
            {
                fieldId: 'expressInstructions',
                condition: { field: 'shippingMethod', operator: 'equals', value: 'express' }
            },
            {
                fieldId: 'overnightInstructions',
                condition: { field: 'shippingMethod', operator: 'equals', value: 'overnight' }
            }
        ]
    },
    {
        id: 'expressInstructions',
        name: 'expressInstructions',
        label: 'Express Shipping Notes',
        type: 'textarea',
        placeholder: 'Any special instructions for express delivery?',
        icon: ChatBubbleIcon,
        colSpan: 'full',
        conditions: [{ field: 'shippingMethod', operator: 'equals', value: 'express' }]
    },
    {
        id: 'overnightInstructions',
        name: 'overnightInstructions',
        label: 'Overnight Shipping Notes',
        type: 'textarea',
        placeholder: 'Any special instructions for overnight delivery?',
        icon: ChatBubbleIcon,
        colSpan: 'full',
        conditions: [{ field: 'shippingMethod', operator: 'equals', value: 'overnight' }]
    },
    {
        id: 'shippingAddress',
        name: 'shippingAddress',
        label: 'Street Address',
        type: 'text',
        placeholder: 'Street address',
        required: true,
        icon: HomeIcon,
        colSpan: 'full'
    },
    {
        id: 'shippingCity',
        name: 'shippingCity',
        label: 'City',
        type: 'text',
        placeholder: 'City',
        required: true,
        colSpan: 'third'
    },
    {
        id: 'shippingState',
        name: 'shippingState',
        label: 'State',
        type: 'text',
        placeholder: 'State',
        required: true,
        colSpan: 'third'
    },
    {
        id: 'shippingZip',
        name: 'shippingZip',
        label: 'ZIP Code',
        type: 'text',
        placeholder: 'ZIP code',
        required: true,
        colSpan: 'third'
    },
    {
        id: 'giftOption',
        name: 'giftOption',
        label: 'This is a gift',
        type: 'checkbox',
        icon: HeartIcon,
        colSpan: 'half',
        defaultValue: false,
        conditionalFields: [
            {
                fieldId: 'giftMessage',
                condition: { field: 'giftOption', operator: 'equals', value: true }
            }
        ]
    },
    {
        id: 'giftMessage',
        name: 'giftMessage',
        label: 'Gift Message',
        type: 'textarea',
        placeholder: 'Enter your gift message...',
        icon: HeartIcon,
        colSpan: 'half',
        conditions: [{ field: 'giftOption', operator: 'equals', value: true }]
    },
    {
        id: 'paymentMethod',
        name: 'paymentMethod',
        label: 'Payment Method',
        type: 'radio',
        required: true,
        icon: CardStackIcon,
        colSpan: 'full',
        options: [
            { value: 'credit', label: 'Credit Card' },
            { value: 'paypal', label: 'PayPal' }
        ]
    }
];

const checkoutSections = [
    { title: 'Contact Information', description: 'Where to send updates', fields: ['email'] },
    { title: 'Shipping Address', description: 'Where to ship your order', fields: ['shippingName', 'shippingMethod', 'expressInstructions', 'overnightInstructions', 'shippingAddress', 'shippingCity', 'shippingState', 'shippingZip'] },
    { title: 'Gift Options', description: 'Make it special', fields: ['giftOption', 'giftMessage'] },
    { title: 'Payment Method', description: 'How you\'ll pay', fields: ['paymentMethod'] }
];

// 7. Job Application Form - with conditional questions
const jobFields: DynamicFormField[] = [
    {
        id: 'firstName',
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'John',
        required: true,
        icon: PersonIcon,
        colSpan: 'half'
    },
    {
        id: 'lastName',
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Doe',
        required: true,
        icon: PersonIcon,
        colSpan: 'half'
    },
    {
        id: 'email',
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'john.doe@email.com',
        required: true,
        icon: EnvelopeClosedIcon,
        colSpan: 'full',
        validation: (value): string | undefined => {
            if (typeof value === 'string') {
                return validateEmail(value);
            }
            return undefined;
        }
    },
    {
        id: 'position',
        name: 'position',
        label: 'Position Applied For',
        type: 'select',
        placeholder: 'Select position',
        required: true,
        icon: RocketIcon,
        colSpan: 'half',
        options: [
            { value: 'frontend', label: 'Frontend Developer' },
            { value: 'backend', label: 'Backend Developer' },
            { value: 'fullstack', label: 'Full Stack Developer' },
            { value: 'devops', label: 'DevOps Engineer' }
        ],
        conditionalFields: [
            {
                fieldId: 'frontendSkills',
                condition: { field: 'position', operator: 'equals', value: 'frontend' }
            },
            {
                fieldId: 'backendSkills',
                condition: { field: 'position', operator: 'equals', value: 'backend' }
            },
            {
                fieldId: 'devopsSkills',
                condition: { field: 'position', operator: 'equals', value: 'devops' }
            }
        ]
    },
    {
        id: 'frontendSkills',
        name: 'frontendSkills',
        label: 'Frontend Frameworks',
        type: 'textarea',
        placeholder: 'List your frontend skills (React, Vue, Angular, etc.)',
        icon: CubeIcon,
        colSpan: 'half',
        conditions: [{ field: 'position', operator: 'equals', value: 'frontend' }],
        required: true
    },
    {
        id: 'backendSkills',
        name: 'backendSkills',
        label: 'Backend Technologies',
        type: 'textarea',
        placeholder: 'List your backend skills (Node.js, Python, Java, etc.)',
        icon: CubeIcon,
        colSpan: 'half',
        conditions: [{ field: 'position', operator: 'equals', value: 'backend' }],
        required: true
    },
    {
        id: 'devopsSkills',
        name: 'devopsSkills',
        label: 'DevOps Tools',
        type: 'textarea',
        placeholder: 'List your DevOps tools (Docker, Kubernetes, AWS, etc.)',
        icon: CubeIcon,
        colSpan: 'half',
        conditions: [{ field: 'position', operator: 'equals', value: 'devops' }],
        required: true
    },
    {
        id: 'experience',
        name: 'experience',
        label: 'Years of Experience',
        type: 'number',
        placeholder: '5',
        required: true,
        icon: ClockIcon,
        colSpan: 'half',
        numberValidation: { min: 0, max: 50 }
    },
    {
        id: 'remoteWork',
        name: 'remoteWork',
        label: 'Are you open to remote work?',
        type: 'radio',
        icon: GlobeIcon,
        colSpan: 'full',
        defaultValue: 'yes',
        options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
            { value: 'hybrid', label: 'Hybrid' }
        ],
        conditionalFields: [
            {
                fieldId: 'remotePreferences',
                condition: { field: 'remoteWork', operator: 'equals', value: 'yes' }
            },
            {
                fieldId: 'hybridPreferences',
                condition: { field: 'remoteWork', operator: 'equals', value: 'hybrid' }
            }
        ]
    },
    {
        id: 'remotePreferences',
        name: 'remotePreferences',
        label: 'Remote Work Preferences',
        type: 'textarea',
        placeholder: 'Describe your remote work setup and preferences...',
        icon: GlobeIcon,
        colSpan: 'full',
        conditions: [{ field: 'remoteWork', operator: 'equals', value: 'yes' }]
    },
    {
        id: 'hybridPreferences',
        name: 'hybridPreferences',
        label: 'Hybrid Work Preferences',
        type: 'textarea',
        placeholder: 'Describe your ideal hybrid work arrangement...',
        icon: GlobeIcon,
        colSpan: 'full',
        conditions: [{ field: 'remoteWork', operator: 'equals', value: 'hybrid' }]
    }
];

const jobSections = [
    { title: 'Personal Details', description: 'Your contact information', fields: ['firstName', 'lastName', 'email'] },
    { title: 'Position Details', description: 'The role you\'re applying for', fields: ['position', 'frontendSkills', 'backendSkills', 'devopsSkills', 'experience'] },
    { title: 'Work Preferences', description: 'Your work style', fields: ['remoteWork', 'remotePreferences', 'hybridPreferences'] }
];

// 8. Travel Booking Form - with enhanced conditional logic
const travelFields: DynamicFormField[] = [
    {
        id: 'tripType',
        name: 'tripType',
        label: 'Trip Type',
        type: 'radio',
        required: true,
        icon: GlobeIcon,
        colSpan: 'full',
        options: [
            { value: 'roundtrip', label: 'Round Trip' },
            { value: 'oneway', label: 'One Way' },
            { value: 'multicity', label: 'Multi-City' }
        ],
        conditionalFields: [
            {
                fieldId: 'returnDate',
                condition: { field: 'tripType', operator: 'equals', value: 'roundtrip' }
            },
            {
                fieldId: 'multiCityDetails',
                condition: { field: 'tripType', operator: 'equals', value: 'multicity' }
            }
        ]
    },
    {
        id: 'origin',
        name: 'origin',
        label: 'From',
        type: 'text',
        placeholder: 'City or Airport',
        required: true,
        icon: DrawingPinIcon,
        colSpan: 'half'
    },
    {
        id: 'destination',
        name: 'destination',
        label: 'To',
        type: 'text',
        placeholder: 'City or Airport',
        required: true,
        icon: DrawingPinIcon,
        colSpan: 'half'
    },
    {
        id: 'departureDate',
        name: 'departureDate',
        label: 'Departure Date',
        type: 'date',
        required: true,
        icon: ClockIcon,
        colSpan: 'half'
    },
    {
        id: 'returnDate',
        name: 'returnDate',
        label: 'Return Date',
        type: 'date',
        icon: ClockIcon,
        colSpan: 'half',
        conditions: [{ field: 'tripType', operator: 'equals', value: 'roundtrip' }],
        required: true
    },
    {
        id: 'multiCityDetails',
        name: 'multiCityDetails',
        label: 'Multi-City Itinerary',
        type: 'textarea',
        placeholder: 'List your cities and dates (e.g., NYC → London (June 1), London → Paris (June 5))',
        icon: GlobeIcon,
        colSpan: 'full',
        conditions: [{ field: 'tripType', operator: 'equals', value: 'multicity' }],
        required: true
    },
    {
        id: 'passengers',
        name: 'passengers',
        label: 'Number of Passengers',
        type: 'number',
        placeholder: '1',
        required: true,
        icon: PersonIcon,
        colSpan: 'half',
        numberValidation: { min: 1, max: 9 },
        conditionalFields: [
            {
                fieldId: 'passengerDetails',
                condition: { field: 'passengers', operator: 'greaterThan', value: 1 }
            }
        ]
    },
    {
        id: 'passengerDetails',
        name: 'passengerDetails',
        label: 'Passenger Names',
        type: 'textarea',
        placeholder: 'Enter names of all passengers',
        icon: PersonIcon,
        colSpan: 'half',
        conditions: [{ field: 'passengers', operator: 'greaterThan', value: 1 }],
        required: true
    },
    {
        id: 'travelClass',
        name: 'travelClass',
        label: 'Travel Class',
        type: 'radio',
        required: true,
        icon: RocketIcon,
        colSpan: 'full',
        options: [
            { value: 'economy', label: 'Economy' },
            { value: 'premium', label: 'Premium Economy' },
            { value: 'business', label: 'Business' },
            { value: 'first', label: 'First Class' }
        ],
        conditionalFields: [
            {
                fieldId: 'businessLounge',
                condition: { field: 'travelClass', operator: 'equals', value: 'business' }
            },
            {
                fieldId: 'firstClassAmenities',
                condition: { field: 'travelClass', operator: 'equals', value: 'first' }
            }
        ]
    },
    {
        id: 'businessLounge',
        name: 'businessLounge',
        label: 'Lounge Access Preference',
        type: 'checkbox',
        icon: HeartIcon,
        colSpan: 'full',
        defaultValue: false,
        conditions: [{ field: 'travelClass', operator: 'equals', value: 'business' }]
    },
    {
        id: 'firstClassAmenities',
        name: 'firstClassAmenities',
        label: 'Special Amenities Request',
        type: 'textarea',
        placeholder: 'Any special requests for first class?',
        icon: StarIcon,
        colSpan: 'full',
        conditions: [{ field: 'travelClass', operator: 'equals', value: 'first' }]
    }
];

const travelSections = [
    { title: 'Trip Details', description: 'Your journey information', fields: ['tripType', 'origin', 'destination', 'departureDate', 'returnDate', 'multiCityDetails'] },
    { title: 'Passenger Information', description: 'Who\'s traveling', fields: ['passengers', 'passengerDetails'] },
    { title: 'Travel Preferences', description: 'Your comfort level', fields: ['travelClass', 'businessLounge', 'firstClassAmenities'] }
];

// 9. Education Enrollment Form - with conditional courses
const educationFields: DynamicFormField[] = [
    {
        id: 'studentName',
        name: 'studentName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Enter your full name',
        required: true,
        icon: PersonIcon,
        colSpan: 'full'
    },
    {
        id: 'studentEmail',
        name: 'studentEmail',
        label: 'Email Address',
        type: 'email',
        placeholder: 'student@email.com',
        required: true,
        icon: EnvelopeClosedIcon,
        colSpan: 'half',
        validation: (value): string | undefined => {
            if (typeof value === 'string') {
                return validateEmail(value);
            }
            return undefined;
        }
    },
    {
        id: 'dateOfBirth',
        name: 'dateOfBirth',
        label: 'Date of Birth',
        type: 'date',
        required: true,
        icon: ClockIcon,
        colSpan: 'half'
    },
    {
        id: 'educationLevel',
        name: 'educationLevel',
        label: 'Current Education Level',
        type: 'select',
        placeholder: 'Select level',
        required: true,
        icon: BookmarkIcon,
        colSpan: 'full',
        options: [
            { value: 'highschool', label: 'High School' },
            { value: 'bachelors', label: 'Bachelor\'s Degree' },
            { value: 'masters', label: 'Master\'s Degree' },
            { value: 'phd', label: 'PhD' }
        ],
        conditionalFields: [
            {
                fieldId: 'highschoolDetails',
                condition: { field: 'educationLevel', operator: 'equals', value: 'highschool' }
            },
            {
                fieldId: 'graduateDetails',
                condition: { field: 'educationLevel', operator: 'equals', value: 'masters' }
            },
            {
                fieldId: 'phdDetails',
                condition: { field: 'educationLevel', operator: 'equals', value: 'phd' }
            }
        ]
    },
    {
        id: 'highschoolDetails',
        name: 'highschoolDetails',
        label: 'High School Information',
        type: 'textarea',
        placeholder: 'Enter your high school name and graduation year',
        icon: BookmarkIcon,
        colSpan: 'full',
        conditions: [{ field: 'educationLevel', operator: 'equals', value: 'highschool' }]
    },
    {
        id: 'graduateDetails',
        name: 'graduateDetails',
        label: 'Previous Degree Information',
        type: 'textarea',
        placeholder: 'Enter your bachelor\'s degree details',
        icon: BookmarkIcon,
        colSpan: 'full',
        conditions: [{ field: 'educationLevel', operator: 'equals', value: 'masters' }]
    },
    {
        id: 'phdDetails',
        name: 'phdDetails',
        label: 'Research Area',
        type: 'textarea',
        placeholder: 'Describe your research interests',
        icon: StarIcon,
        colSpan: 'full',
        conditions: [{ field: 'educationLevel', operator: 'equals', value: 'phd' }]
    },
    {
        id: 'enrollmentType',
        name: 'enrollmentType',
        label: 'Enrollment Type',
        type: 'radio',
        required: true,
        icon: LayersIcon,
        colSpan: 'full',
        options: [
            { value: 'fulltime', label: 'Full Time' },
            { value: 'parttime', label: 'Part Time' },
            { value: 'online', label: 'Online' }
        ],
        conditionalFields: [
            {
                fieldId: 'courseLoad',
                condition: { field: 'enrollmentType', operator: 'equals', value: 'parttime' }
            }
        ]
    },
    {
        id: 'courseLoad',
        name: 'courseLoad',
        label: 'Desired Course Load',
        type: 'number',
        placeholder: 'Number of courses per semester',
        icon: ClockIcon,
        colSpan: 'full',
        conditions: [{ field: 'enrollmentType', operator: 'equals', value: 'parttime' }],
        numberValidation: { min: 1, max: 3 }
    },
    {
        id: 'financialAid',
        name: 'financialAid',
        label: 'Applying for Financial Aid?',
        type: 'radio',
        icon: HeartIcon,
        colSpan: 'full',
        defaultValue: 'no',
        options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
        ],
        conditionalFields: [
            {
                fieldId: 'aidDetails',
                condition: { field: 'financialAid', operator: 'equals', value: 'yes' }
            }
        ]
    },
    {
        id: 'aidDetails',
        name: 'aidDetails',
        label: 'Financial Aid Information',
        type: 'textarea',
        placeholder: 'Please provide details about your financial aid requirements',
        icon: HeartIcon,
        colSpan: 'full',
        conditions: [{ field: 'financialAid', operator: 'equals', value: 'yes' }]
    }
];

const educationSections = [
    { title: 'Student Info', description: 'Your personal information', fields: ['studentName', 'studentEmail', 'dateOfBirth'] },
    { title: 'Education Background', description: 'Your academic history', fields: ['educationLevel', 'highschoolDetails', 'graduateDetails', 'phdDetails'] },
    { title: 'Enrollment Details', description: 'Your study preferences', fields: ['enrollmentType', 'courseLoad', 'financialAid', 'aidDetails'] }
];

// Map form types to their configurations
const formConfigs: Record<FormType, { fields: DynamicFormField[]; sections: { title: string; description: string; fields: string[] }[] }> = {
    registration: { fields: registrationFields, sections: registrationSections },
    business: { fields: businessFields, sections: businessSections },
    developer: { fields: developerFields, sections: developerSections },
    survey: { fields: surveyFields, sections: surveySections },
    health: { fields: healthFields, sections: healthSections },
    checkout: { fields: checkoutFields, sections: checkoutSections },
    job: { fields: jobFields, sections: jobSections },
    travel: { fields: travelFields, sections: travelSections },
    education: { fields: educationFields, sections: educationSections },
};

// Handle submit
const handleSubmit = async (data: FormValues): Promise<void> => {
    alert(`Form submitted: ${JSON.stringify(data)}`);
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));
};

// ==============================
// MAIN COMPREHENSIVE DEMO
// ==============================

export const DynamicFormDemo = (): JSX.Element => {
    const { colorMode } = useColorMode();

    const [formType, setFormType] = useState<FormType>('registration');
    const [themeVariant, setThemeVariant] = useState<ThemeVariant>(
        colorMode === 'dark' ? 'dark' : 'default'
    );
    const [cardVariant, setCardVariant] = useState<CardVariant>('default');
    const [animationIntensity, setAnimationIntensity] = useState<AnimationIntensity>('moderate');

    // Feature toggles
    const [showCancelButton, setShowCancelButton] = useState<boolean>(true);
    const [showSuccessNotification, setShowSuccessNotification] = useState<boolean>(true);
    const [showFieldCount, setShowFieldCount] = useState<boolean>(true);
    const [darkMode, setDarkMode] = useState<boolean>(colorMode === 'dark');

    // Loading states
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submittedData, setSubmittedData] = useState<FormValues | null>(null);

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
    }, [formType, themeVariant, cardVariant, animationIntensity]);

    const handleThemeChange = (value: string): void => {
        setThemeVariant(value as ThemeVariant);
        setDarkMode(value === 'dark' || value === 'galaxy' || value === 'candy' || value === 'neon');
        setUserChangedTheme(true);
    };

    // Get current form config
    const currentConfig = formConfigs[formType];
    const CurrentIcon = formIcons[formType];

    // Custom submit handler
    const handleFormSubmit = async (data: FormValues): Promise<void> => {
        setSubmittedData(data);
        await handleSubmit(data);
    };

    const buildCodeString = (): string => {
        const iconName = iconNames[formType];
        const config = formConfigs[formType];

        const props = [
            `fields={${formType}Fields}`,
            `onSubmit={handleSubmit}`,
            `variant="${themeVariant}"`,
            `cardVariant="${cardVariant}"`,
            `animationIntensity="${animationIntensity}"`,
            `showSuccessNotification={${showSuccessNotification}}`,
        ];

        const submitLabel = formType === 'checkout' ? 'Pay Now' :
            formType === 'registration' ? 'Create Account' :
                formType === 'job' ? 'Submit Application' :
                    formType === 'survey' ? 'Submit Feedback' :
                        formType === 'travel' ? 'Book Now' :
                            formType === 'education' ? 'Enroll Now' :
                                'Submit';

        // Build field strings manually
        const fieldStrings = config.fields.slice(0, 5).map(field => {
            let fieldStr = `    {
        id: '${field.id}',
        name: '${field.name}',
        label: '${field.label}',
        type: '${field.type}',
        required: ${field.required},`;

            if (field.colSpan) {
                fieldStr += `\n        colSpan: '${field.colSpan}',`;
            }

            if (field.icon) {
                const iconMap: Record<string, string> = {
                    PersonIcon: 'PersonIcon',
                    EnvelopeClosedIcon: 'EnvelopeClosedIcon',
                    LockClosedIcon: 'LockClosedIcon',
                    HeartIcon: 'HeartIcon',
                    HomeIcon: 'HomeIcon',
                    RocketIcon: 'RocketIcon',
                    LightningBoltIcon: 'LightningBoltIcon',
                    GlobeIcon: 'GlobeIcon',
                    LayersIcon: 'LayersIcon',
                    IdCardIcon: 'IdCardIcon',
                    StarIcon: 'StarIcon',
                    DrawingPinIcon: 'DrawingPinIcon',
                    ClockIcon: 'ClockIcon',
                    ReaderIcon: 'ReaderIcon',
                    ChatBubbleIcon: 'ChatBubbleIcon',
                    MobileIcon: 'MobileIcon',
                    CardStackIcon: 'CardStackIcon',
                    LinkedInLogoIcon: 'LinkedInLogoIcon',
                    GitHubLogoIcon: 'GitHubLogoIcon',
                    CubeIcon: 'CubeIcon',
                    BookmarkIcon: 'BookmarkIcon',
                    MixIcon: 'MixIcon',
                    SpeakerLoudIcon: 'SpeakerLoudIcon',
                };

                const iconName = field.icon ||
                    Object.keys(iconMap).find(key => field.icon.toString().includes(key)) ||
                    'PersonIcon';
                fieldStr += `\n        icon: ${iconName},`;
            }

            if (field.options) {
                fieldStr += `\n        options: [`;
                field.options.forEach((opt) => {
                    fieldStr += `\n            { value: '${opt.value}', label: '${opt.label}' },`;
                });
                fieldStr += `\n        ],`;
            }

            if (field.conditionalFields) {
                fieldStr += `\n        conditionalFields: [`;
                field.conditionalFields.forEach((cf) => {
                    fieldStr += `\n            {`;
                    fieldStr += `\n                fieldId: '${cf.fieldId}',`;
                    fieldStr += `\n                condition: {`;
                    fieldStr += `\n                    field: '${cf.condition.field}',`;
                    fieldStr += `\n                    operator: '${cf.condition.operator}',`;

                    const valueStr = typeof cf.condition.value === 'string'
                        ? `'${cf.condition.value}'`
                        : cf.condition.value;
                    fieldStr += `\n                    value: ${valueStr}`;

                    fieldStr += `\n                }`;
                    fieldStr += `\n            },`;
                });
                fieldStr += `\n        ],`;
            }

            if (field.conditions) {
                fieldStr += `\n        conditions: [`;
                field.conditions.forEach((cond) => {
                    fieldStr += `\n            {`;
                    fieldStr += `\n                field: '${cond.field}',`;
                    fieldStr += `\n                operator: '${cond.operator}',`;

                    const valueStr = typeof cond.value === 'string'
                        ? `'${cond.value}'`
                        : cond.value;
                    fieldStr += `\n                value: ${valueStr}`;

                    fieldStr += `\n            },`;
                });
                fieldStr += `\n        ],`;
            }

            fieldStr += `\n    },`;
            return fieldStr;
        }).join('\n');

        // Build section fields string
        const sectionFields1 = config.sections && config.sections[0]
            ? config.sections[0].fields.map(f => `'${f}'`).join(', ')
            : '';

        const sectionFields2 = config.sections && config.sections[1]
            ? config.sections[1].fields.map(f => `'${f}'`).join(', ')
            : '';

        return `import {
    DynamicForm,
    DynamicHeader,
    DynamicContent,
    DynamicField,
    DynamicSection,
    DynamicNavigation,
    ThemeToggle,
    type DynamicFormField,
} from '@ignix-ui/dynamicform';
import {
    ${iconName},
    PersonIcon,
    EnvelopeClosedIcon,
    LockClosedIcon,
    HeartIcon,
    MixIcon,
    HomeIcon,
    LayersIcon,
    RocketIcon,
    GlobeIcon,
    StarIcon,
    ClockIcon,
    ReaderIcon,
    ChatBubbleIcon,
    MobileIcon,
    CardStackIcon,
    LinkedInLogoIcon,
    GitHubLogoIcon,
    CubeIcon,
    BookmarkIcon,
    DrawingPinIcon,
    SpeakerLoudIcon,
    LightningBoltIcon,
    IdCardIcon,
} from '@radix-ui/react-icons';

// Fields configuration with conditional logic (${formType} form example)
const ${formType}Fields: DynamicFormField[] = [
${fieldStrings}
    // Add more fields as needed
];

// Optional: Define sections for organization
const ${formType}Sections = [
    {
        title: '${config.sections && config.sections[0] ? config.sections[0].title : 'Section 1'}',
        description: '${config.sections && config.sections[0] ? config.sections[0].description : 'Description'}',
        fields: [${sectionFields1}],
    },
    {
        title: '${config.sections && config.sections[1] ? config.sections[1].title : 'Section 2'}',
        description: '${config.sections && config.sections[1] ? config.sections[1].description : 'Description'}',
        fields: [${sectionFields2}],
    },
    // Add more sections as needed
];

<DynamicForm
    ${props.join('\n    ')}
>
    <DynamicHeader
        title="${formType.charAt(0).toUpperCase() + formType.slice(1)} Form"
        description="Please fill in your details - watch fields appear based on your selections"
        icon={<${iconName} className="w-6 h-6" />}
        gradient
        animated
    />

    <DynamicContent showFieldCount={${showFieldCount}}>
        {${formType}Sections ? (
            ${formType}Sections.map((section, idx) => (
                <DynamicSection
                    key={idx}
                    title={section.title}
                    description={section.description}
                    collapsible
                    gradient
                >
                    {section.fields.map((fieldId) => {
                        const field = ${formType}Fields.find(f => f.id === fieldId);
                        return field ? <DynamicField key={field.id} field={field} /> : null;
                    })}
                </DynamicSection>
            ))
        ) : (
            ${formType}Fields.map((field) => (
                <DynamicField key={field.id} field={field} />
            ))
        )}
    </DynamicContent>

    <DynamicNavigation
        submitButtonLabel="${submitLabel}"
        showCancelButton={${showCancelButton}}
        cancelButtonLabel="Cancel"
    />

</DynamicForm>`;
    };

    return (
        <div className="space-y-8 p-6">
            {/* Theme Controls - First Row */}
            <div className="flex flex-wrap items-center justify-end gap-3">
                {/* Form Type Selector */}
                <div className="space-y-2">
                    <VariantSelector
                        variants={formTypeOptions.map(o => o.value)}
                        selectedVariant={formType}
                        onSelectVariant={(value): void => setFormType(value as FormType)}
                        type="Form Type"
                        variantLabels={Object.fromEntries(formTypeOptions.map(o => [o.value, o.label]))}
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={themeOptions.map(o => o.value)}
                        selectedVariant={themeVariant}
                        onSelectVariant={handleThemeChange}
                        type="Theme"
                        variantLabels={Object.fromEntries(themeOptions.map(o => [o.value, o.label]))}
                    />
                </div>
            </div>

            {/* Feature Toggles */}
            <div className={cn(
                "flex flex-wrap items-center justify-end gap-4",
                darkMode ? "text-gray-300" : "text-gray-700"
            )}>
                <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <input
                        type="checkbox"
                        checked={showSuccessNotification}
                        onChange={(e): void => setShowSuccessNotification(e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium">Success Notification</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <input
                        type="checkbox"
                        checked={showFieldCount}
                        onChange={(e): void => setShowFieldCount(e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium">Field Count</span>
                </label>
            </div>

            {/* Loading State Controls */}
            <div className="flex flex-wrap items-center justify-end gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(): void => setIsSubmitting(!isSubmitting)}
                    className="cursor-pointer transition-all duration-200 hover:scale-105"
                >
                    {isSubmitting ? 'Stop Submitting' : 'Show Submitting State'}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(): void => setIsLoading(!isLoading)}
                    className="cursor-pointer transition-all duration-200 hover:scale-105"
                >
                    {isLoading ? 'Stop Loading' : 'Show Loading State'}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(): void => {
                        setFormType('registration');
                        setThemeVariant(colorMode === 'dark' ? 'dark' : 'default');
                        setCardVariant('default');
                        setAnimationIntensity('moderate');
                        setShowCancelButton(true);
                        setShowSuccessNotification(true);
                        setShowFieldCount(true);
                        setDarkMode(colorMode === 'dark');
                        setIsLoading(false);
                        setIsSubmitting(false);
                        setSubmittedData(null);
                        setUserChangedTheme(false);
                    }}
                    className="cursor-pointer transition-all duration-200 hover:scale-105"
                >
                    Reset All
                </Button>
            </div>

            {/* Preview and Code Tabs */}
            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className={cn(
                        " rounded-lg overflow-hidden transition-all duration-300 shadow-lg",
                        darkMode
                            ? "bg-gray-900 border border-gray-700"
                            : "bg-white border border-gray-200"
                    )}>
                        {/* The Dynamic Form component - now properly placed inside the preview */}
                        <DynamicForm
                            key={`demo-${animationKey}`}
                            fields={currentConfig.fields}
                            onSubmit={handleFormSubmit}
                            variant={themeVariant}
                            cardVariant={cardVariant}
                            animationIntensity={animationIntensity}
                            showSuccessNotification={showSuccessNotification}
                            successNotificationMessage={`✨ ${formType.charAt(0).toUpperCase() + formType.slice(1)} form submitted successfully!`}
                            isLoading={isLoading}
                            isSubmitting={isSubmitting}
                            theme={darkMode ? 'dark' : 'light'}
                        >
                            <DynamicHeader
                                title={`${formType.charAt(0).toUpperCase() + formType.slice(1)} Form`}
                                description={`Complete your ${formType} information below - watch fields appear based on your selections`}
                                icon={<CurrentIcon className="w-6 h-6" />}
                                gradient
                                animated
                                iconSize={32}
                            />

                            <DynamicContent showFieldCount={showFieldCount} cardVariant={cardVariant}>
                                {currentConfig.sections ? (
                                    currentConfig.sections.map((section, idx) => (
                                        <DynamicSection
                                            key={idx}
                                            title={section.title}
                                            description={section.description}
                                            collapsible
                                            gradient
                                        >
                                            {section.fields.map((fieldId) => {
                                                const field = currentConfig.fields.find(f => f.id === fieldId);
                                                return field ? <DynamicField key={field.id} field={field} /> : null;
                                            })}
                                        </DynamicSection>
                                    ))
                                ) : (
                                    currentConfig.fields.map((field) => (
                                        <DynamicField key={field.id} field={field} />
                                    ))
                                )}
                            </DynamicContent>

                            <DynamicNavigation
                                submitButtonLabel={
                                    formType === 'checkout' ? 'Pay Now' :
                                        formType === 'registration' ? 'Create Account' :
                                            formType === 'job' ? 'Submit Application' :
                                                formType === 'survey' ? 'Submit Feedback' :
                                                    formType === 'travel' ? 'Book Now' :
                                                        formType === 'education' ? 'Enroll Now' :
                                                            'Submit'
                                }
                                showCancelButton={showCancelButton}
                                cancelButtonLabel="Cancel"
                                onCancel={(): void => alert('Form cancelled')}
                            />
                        </DynamicForm>
                    </div>

                    {/* Submitted Data Display */}
                    {submittedData && Object.keys(submittedData).length > 0 && (
                        <div className={cn(
                            "mt-6 p-5 rounded-lg transition-all duration-300 shadow-md",
                            darkMode
                                ? "bg-gray-800 border border-gray-700"
                                : "bg-gray-50 border border-gray-200"
                        )}>
                            <h3 className={cn(
                                "text-lg font-semibold mb-3 flex items-center gap-2",
                                darkMode ? "text-gray-200" : "text-gray-800"
                            )}>
                                <span>📋</span> Last Submitted Data
                            </h3>
                            <pre className={cn(
                                "p-4 rounded-lg overflow-auto max-h-80 text-sm font-mono",
                                darkMode
                                    ? "bg-gray-900 text-green-400 border border-gray-700"
                                    : "bg-white text-gray-800 border border-gray-200"
                            )}>
                                {JSON.stringify(submittedData, null, 2)}
                            </pre>
                        </div>
                    )}
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

export default DynamicFormDemo;