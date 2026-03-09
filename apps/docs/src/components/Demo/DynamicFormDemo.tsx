import React, { useState, useEffect } from 'react';
import {
    DynamicForm,
    DynamicHeader,
    DynamicContent,
    DynamicField,
    DynamicSection,
    DynamicNavigation,
    ThemeToggle,
    DynamicDebugger,
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
    CheckboxIcon,
} from '@radix-ui/react-icons';
import { cn } from '@site/src/utils/cn';
import { Button } from '@site/src/components/UI/button';

// Types for our variant selectors
type ThemeVariant = 'default' | 'vibrant' | 'pastel' | 'neon' | 'earthy' | 'ocean' | 'sunset' | 'forest' | 'galaxy' | 'candy' | 'dark';
type CardVariant = 'default' | 'glass' | 'border' | 'elevated' | 'neon' | 'vibrant';
type AnimationIntensity = 'subtle' | 'moderate' | 'high';
type FormType = 'registration' | 'business' | 'developer' | 'survey' | 'health' | 'checkout' | 'job' | 'travel' | 'education';

// Theme options - Added 'dark' option
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

// Card variant options
const cardVariantOptions = [
    { value: 'default', label: 'Default' },
    { value: 'glass', label: 'Glass' },
    { value: 'border', label: 'Border' },
    { value: 'elevated', label: 'Elevated' },
    { value: 'neon', label: 'Neon' },
    { value: 'vibrant', label: 'Vibrant' },
];

// Animation intensity options
const animationIntensityOptions = [
    { value: 'subtle', label: 'Subtle' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'high', label: 'High' },
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
// FORM TYPE CONFIGURATIONS
// ==============================

// 1. User Registration Form
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
        validation: (value) => {
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
        validation: (value) => {
            if (typeof value === 'string' && value) {
                return validatePhone(value);
            }
            return undefined;
        }
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
        validation: (value) => {
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
        id: 'twoFactor',
        name: 'twoFactor',
        label: 'Enable Two-Factor Authentication',
        type: 'checkbox',
        icon: LockClosedIcon,
        colSpan: 'full',
        defaultValue: false
    }
];

const registrationSections = [
    { title: 'Personal Information', description: 'Tell us about yourself', fields: ['name', 'email', 'phone', 'dob'] },
    { title: 'Account Security', description: 'Secure your account', fields: ['password', 'confirmPassword', 'twoFactor'] }
];

// 2. Business Onboarding Form
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
        type: 'select',
        placeholder: 'Select business type',
        required: true,
        icon: LayersIcon,
        colSpan: 'half',
        options: [
            { value: 'sole', label: 'Sole Proprietorship' },
            { value: 'partnership', label: 'Partnership' },
            { value: 'llc', label: 'LLC' },
            { value: 'corporation', label: 'Corporation' },
            { value: 'nonprofit', label: 'Non-Profit' }
        ]
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
        colSpan: 'full',
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
        id: 'businessEmail',
        name: 'businessEmail',
        label: 'Business Email',
        type: 'email',
        placeholder: 'business@company.com',
        required: true,
        icon: EnvelopeClosedIcon,
        colSpan: 'half',
        validation: (value) => {
            if (typeof value === 'string') {
                return validateEmail(value);
            }
            return undefined;
        }
    },
    {
        id: 'businessPhone',
        name: 'businessPhone',
        label: 'Business Phone',
        type: 'tel',
        placeholder: '+1 (555) 123-4567',
        required: true,
        icon: MobileIcon,
        colSpan: 'half',
        validation: (value) => {
            if (typeof value === 'string' && value) {
                return validatePhone(value);
            }
            return undefined;
        }
    }
];

const businessSections = [
    { title: 'Company Details', description: 'Basic company information', fields: ['companyName', 'businessType', 'registrationNumber', 'taxId'] },
    { title: 'Business Address', description: 'Your business location', fields: ['address', 'city', 'state', 'postalCode', 'country'] },
    { title: 'Contact Information', description: 'How to reach your business', fields: ['businessEmail', 'businessPhone'] }
];

// 3. Developer Profile Form
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
        validation: (value) => {
            if (typeof value === 'string' && value) {
                return validateUrl(value);
            }
            return undefined;
        }
    },
    {
        id: 'portfolio',
        name: 'portfolio',
        label: 'Portfolio Website',
        type: 'url',
        placeholder: 'https://johndoe.dev',
        icon: GlobeIcon,
        colSpan: 'full',
        validation: (value) => {
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
        id: 'yearsExperience',
        name: 'yearsExperience',
        label: 'Years of Experience',
        type: 'number',
        placeholder: '5',
        required: true,
        icon: ClockIcon,
        colSpan: 'half',
        numberValidation: { min: 0, max: 50 }
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
    { title: 'Basic Info', description: 'Your personal details', fields: ['fullName', 'github', 'linkedin', 'portfolio'] },
    { title: 'Skills & Experience', description: 'Your technical expertise', fields: ['primaryLanguage', 'yearsExperience', 'technologies'] }
];

// 4. Survey & Feedback Form
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
        ]
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
        conditions: [{ field: 'contactPermission', operator: 'equals', value: true }],
        validation: (value) => {
            if (typeof value === 'string' && value) {
                return validateEmail(value);
            }
            return undefined;
        }
    }
];

const surveySections = [
    { title: 'Experience Rating', description: 'How was your experience?', fields: ['satisfaction', 'recommendation'] },
    { title: 'Detailed Feedback', description: 'Tell us more', fields: ['feedback'] },
    { title: 'Follow-up', description: 'Optional contact information', fields: ['contactPermission', 'contactEmail'] }
];

// 5. Health & Fitness Form
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
        ]
    }
];

const healthSections = [
    { title: 'Personal Stats', description: 'Basic information', fields: ['age', 'gender'] },
    { title: 'Activity & Goals', description: 'Your fitness journey', fields: ['activityLevel', 'primaryGoal'] }
];

// 6. E-commerce Checkout Form
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
        validation: (value) => {
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
    { title: 'Shipping Address', description: 'Where to ship your order', fields: ['shippingName', 'shippingAddress', 'shippingCity', 'shippingState', 'shippingZip'] },
    { title: 'Payment Method', description: 'How you\'ll pay', fields: ['paymentMethod'] }
];

// 7. Job Application Form
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
        validation: (value) => {
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
            { value: 'fullstack', label: 'Full Stack Developer' }
        ]
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
        id: 'skills',
        name: 'skills',
        label: 'Skills',
        type: 'textarea',
        placeholder: 'List your key skills...',
        required: true,
        icon: CubeIcon,
        colSpan: 'full'
    }
];

const jobSections = [
    { title: 'Personal Details', description: 'Your contact information', fields: ['firstName', 'lastName', 'email'] },
    { title: 'Position Details', description: 'The role you\'re applying for', fields: ['position', 'experience'] },
    { title: 'Qualifications', description: 'Your skills and expertise', fields: ['skills'] }
];

// 8. Travel Booking Form
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
            { value: 'oneway', label: 'One Way' }
        ],
        conditionalFields: [
            {
                fieldId: 'returnDate',
                condition: { field: 'tripType', operator: 'equals', value: 'roundtrip' }
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
        conditions: [{ field: 'tripType', operator: 'equals', value: 'roundtrip' }]
    },
    {
        id: 'passengers',
        name: 'passengers',
        label: 'Number of Passengers',
        type: 'number',
        placeholder: '1',
        required: true,
        icon: PersonIcon,
        colSpan: 'full',
        numberValidation: { min: 1, max: 9 }
    }
];

const travelSections = [
    { title: 'Trip Details', description: 'Your journey information', fields: ['tripType', 'origin', 'destination', 'departureDate', 'returnDate', 'passengers'] }
];

// 9. Education Enrollment Form
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
        validation: (value) => {
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
            { value: 'masters', label: 'Master\'s Degree' }
        ]
    },
    {
        id: 'courses',
        name: 'courses',
        label: 'Select Courses',
        type: 'checkbox',
        icon: CheckboxIcon,
        colSpan: 'full',
        options: [
            { value: 'cs101', label: 'Computer Science 101' },
            { value: 'math201', label: 'Advanced Mathematics' },
            { value: 'bus301', label: 'Business Management' }
        ]
    }
];

const educationSections = [
    { title: 'Student Info', description: 'Your personal information', fields: ['studentName', 'studentEmail', 'dateOfBirth', 'educationLevel'] },
    { title: 'Course Selection', description: 'Choose your courses', fields: ['courses'] }
];

// Map form types to their configurations
const formConfigs = {
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
const handleSubmit = async (data: any) => {
    console.log('Form submitted:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
};

// ==============================
// MAIN COMPREHENSIVE DEMO
// ==============================

export const DynamicFormDemo = () => {
    const { colorMode } = useColorMode();

    // Core state
    const [formType, setFormType] = useState<FormType>('registration');
    const [themeVariant, setThemeVariant] = useState<ThemeVariant>(
        colorMode === 'dark' ? 'dark' : 'default'
    );
    const [cardVariant, setCardVariant] = useState<CardVariant>('default');
    const [animationIntensity, setAnimationIntensity] = useState<AnimationIntensity>('moderate');

    // Feature toggles
    const [showDebugger, setShowDebugger] = useState<boolean>(false);
    const [showThemeToggle, setShowThemeToggle] = useState<boolean>(true);
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

    // Handle theme change
    const handleThemeChange = (value: string) => {
        setThemeVariant(value as ThemeVariant);
        setDarkMode(value === 'dark' || value === 'galaxy' || value === 'candy' || value === 'neon');
        setUserChangedTheme(true);
    };

    // Get current form config
    const currentConfig = formConfigs[formType];
    const CurrentIcon = formIcons[formType];

    // Custom submit handler
    const handleFormSubmit = async (data: FormValues) => {
        setSubmittedData(data);
        await handleSubmit(data);
    };

    const buildCodeString = () => {
        const iconName = iconNames[formType];
        const config = formConfigs[formType];

        // Create a simplified example based on the first few fields
        const exampleFields = config.fields.slice(0, 3).map(field => ({
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
                        'Submit';

        return `import {
    DynamicForm,
    DynamicHeader,
    DynamicContent,
    DynamicField,
    DynamicSection,
    DynamicNavigation,
    ThemeToggle,
    type DynamicFormField,
} from '../UI/dynamic-form';
import {
    ${iconName},
    PersonIcon,
    EnvelopeClosedIcon,
    LockClosedIcon,
    HeartIcon,
} from '@radix-ui/react-icons';

// Fields configuration (${formType} form example)
const ${formType}Fields: DynamicFormField[] = [
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
    },`).join('\n    ')}
    // Add more fields as needed
];

// Optional: Define sections for organization
const ${formType}Sections = [
    {
        title: 'Section Title',
        description: 'Section description',
        fields: ['fieldId1', 'fieldId2'],
    },
    // Add more sections
];

<DynamicForm
    ${props.join('\n    ')}
>
    <DynamicHeader
        title="${formType.charAt(0).toUpperCase() + formType.slice(1)} Form"
        description="Please fill in your details"
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

    ${showThemeToggle ? '<ThemeToggle />' : ''}
    ${showDebugger ? '<DynamicDebugger />' : ''}
</DynamicForm>`;
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
                        onSelectVariant={(value) => setFormType(value as FormType)}
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
                        variants={cardVariantOptions.map(o => o.value)}
                        selectedVariant={cardVariant}
                        onSelectVariant={(value) => setCardVariant(value as CardVariant)}
                        type="Card Style"
                        variantLabels={Object.fromEntries(cardVariantOptions.map(o => [o.value, o.label]))}
                    />
                </div>

                <div className="space-y-2 mx-1">
                    <VariantSelector
                        variants={animationIntensityOptions.map(o => o.value)}
                        selectedVariant={animationIntensity}
                        onSelectVariant={(value) => setAnimationIntensity(value as AnimationIntensity)}
                        type="Animation"
                        variantLabels={Object.fromEntries(animationIntensityOptions.map(o => [o.value, o.label]))}
                    />
                </div>
            </div>

            {/* Feature Toggles */}
            <div className={cn(
                "flex flex-row items-center justify-end gap-2 px-2 flex-wrap",
                darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-700"
            )}>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showDebugger}
                        onChange={(e) => setShowDebugger(e.target.checked)}
                        className="rounded text-primary"
                    />
                    <span className="text-sm">Debugger</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showThemeToggle}
                        onChange={(e) => setShowThemeToggle(e.target.checked)}
                        className="rounded text-primary"
                    />
                    <span className="text-sm">Theme Toggle</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showCancelButton}
                        onChange={(e) => setShowCancelButton(e.target.checked)}
                        className="rounded text-primary"
                    />
                    <span className="text-sm">Cancel Button</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showSuccessNotification}
                        onChange={(e) => setShowSuccessNotification(e.target.checked)}
                        className="rounded text-primary"
                    />
                    <span className="text-sm">Success Notification</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showFieldCount}
                        onChange={(e) => setShowFieldCount(e.target.checked)}
                        className="rounded text-primary"
                    />
                    <span className="text-sm">Field Count</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={(e) => {
                            setDarkMode(e.target.checked);
                            setThemeVariant(e.target.checked ? 'dark' : 'default');
                            setUserChangedTheme(true);
                        }}
                        className="rounded text-primary"
                    />
                    <span className="text-sm">Dark Mode</span>
                </label>
            </div>

            {/* Loading State Controls */}
            <div className="flex items-center justify-end flex-wrap gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSubmitting(!isSubmitting)}
                    className="cursor-pointer mx-1"
                >
                    {isSubmitting ? 'Stop Submitting' : 'Show Submitting State'}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsLoading(!isLoading)}
                    className="cursor-pointer mx-1"
                >
                    {isLoading ? 'Stop Loading' : 'Show Loading State'}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setFormType('registration');
                        setThemeVariant(colorMode === 'dark' ? 'dark' : 'default');
                        setCardVariant('default');
                        setAnimationIntensity('moderate');
                        setShowDebugger(false);
                        setShowThemeToggle(true);
                        setShowCancelButton(true);
                        setShowSuccessNotification(true);
                        setShowFieldCount(true);
                        setDarkMode(colorMode === 'dark');
                        setIsLoading(false);
                        setIsSubmitting(false);
                        setSubmittedData(null);
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
                    <div className={cn(
                        "border rounded-lg overflow-hidden transition-colors duration-300",
                        darkMode ? "border-gray-700 bg-gray-900" : "border-gray-300 bg-white"
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
                            debug={showDebugger}
                            theme={darkMode ? 'dark' : 'light'}
                        >
                            <DynamicHeader
                                title={`${formType.charAt(0).toUpperCase() + formType.slice(1)} Form`}
                                description={`Complete your ${formType} information below`}
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
                                onCancel={() => console.log('Form cancelled')}
                            />

                            {showThemeToggle && <ThemeToggle />}
                            {showDebugger && <DynamicDebugger />}
                        </DynamicForm>
                    </div>

                    {/* Submitted Data Display */}
                    {submittedData && Object.keys(submittedData).length > 0 && (
                        <div className={cn(
                            "mt-4 p-4 rounded-lg transition-colors duration-300",
                            darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"
                        )}>
                            <h3 className="text-lg font-semibold mb-2">📋 Last Submitted Data</h3>
                            <pre className={cn(
                                "p-4 rounded overflow-auto max-h-60 text-sm",
                                darkMode ? "bg-gray-900 text-green-400" : "bg-white text-gray-800"
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