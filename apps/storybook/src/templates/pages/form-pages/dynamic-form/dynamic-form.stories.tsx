import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DynamicForm,
    DynamicHeader,
    DynamicContent,
    DynamicField,
    DynamicSection,
    DynamicNavigation,
    ThemeToggle,
    DynamicDebugger,
} from "./";
import type { DynamicFormField, FormValues, FieldValue } from './index';
import {
    PersonIcon,
    EnvelopeClosedIcon,
    HeartIcon,
    LockClosedIcon,
    HomeIcon,
    RocketIcon,
    LightningBoltIcon,
    CheckCircledIcon,
    GlobeIcon,
    CheckboxIcon,
    LayersIcon,
    IdCardIcon,
    MagicWandIcon,
    SunIcon,
    StarIcon,
    DrawingPinIcon,
    ClockIcon,
    ChevronRightIcon,
    ReaderIcon,
    ChatBubbleIcon,
    MobileIcon,
    CardStackIcon,
    LinkedInLogoIcon,
    GitHubLogoIcon,
    CubeIcon,
    BookmarkIcon,
} from "@radix-ui/react-icons";
import { Button } from '../../../../components/button';
import { Typography } from '../../../../components/typography';
import { cn } from '../../../../../utils/cn';

/* ============================================
   TYPE DEFINITIONS
============================================ */

type DynamicFormVariant = "default" | "vibrant" | "pastel" | "neon" | "earthy" | "ocean" | "sunset" | "forest" | "galaxy" | "candy";
type CardVariant = "default" | "glass" | "border" | "elevated" | "neon" | "vibrant";

interface FormSection {
    title: string;
    description?: string;
    fields: string[];
}

interface FormType {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    color: string;
    fields: DynamicFormField[];
    sections?: FormSection[];
}

interface ThemeOption {
    id: string;
    name: string;
    variant: DynamicFormVariant;
    cardVariant: CardVariant;
    icon: React.ElementType;
    colors: string[];
}

interface FormTypeSelectorProps {
    onSelect: (type: FormType) => void;
    selectedType?: string;
}

interface ThemeCustomizerProps {
    onThemeChange: (theme: ThemeOption) => void;
    currentTheme?: string;
}

/* ============================================
   VALIDATION FUNCTIONS
============================================ */

// Update the validation function to make allValues optional
const confirmPasswordValidation = (value: FieldValue, allValues?: FormValues): string | undefined => {
    if (allValues && value !== allValues.password) {
        return 'Passwords do not match';
    }
    return undefined;
};

/* ============================================
   FIELD DEFINITIONS
============================================ */

// Basic fields for all stories
const basicFields: DynamicFormField[] = [
    {
        id: 'name',
        name: 'name',
        label: 'Your Name',
        type: 'text',
        placeholder: 'Enter your name',
        required: true,
        icon: PersonIcon,
        colSpan: 'full',
    },
    {
        id: 'email',
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'email@example.com',
        required: true,
        icon: EnvelopeClosedIcon,
        colSpan: 'full',
        emailValidation: {
            pattern: true,
        },
    },
    {
        id: 'account-type',
        name: 'accountType',
        label: 'Account Type',
        type: 'radio',
        required: true,
        icon: HeartIcon,
        colSpan: 'full',
        options: [
            { value: 'personal', label: 'Personal' },
            { value: 'business', label: 'Business' },
        ],
        conditionalFields: [
            {
                fieldId: 'company-name',
                condition: {
                    field: 'accountType',
                    operator: 'equals',
                    value: 'business'
                }
            }
        ]
    },
    {
        id: 'company-name',
        name: 'companyName',
        label: 'Company Name',
        type: 'text',
        placeholder: 'Enter your company name',
        icon: HomeIcon,
        colSpan: 'full',
        conditions: [
            {
                field: 'accountType',
                operator: 'equals',
                value: 'business'
            }
        ]
    }
];

// Complex conditional fields
const complexConditionalFields: DynamicFormField[] = [
    {
        id: 'country',
        name: 'country',
        label: 'Country',
        type: 'select',
        placeholder: 'Select your country',
        required: true,
        icon: GlobeIcon,
        colSpan: 'full',
        options: [
            { value: 'usa', label: 'United States' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'india', label: 'India' },
            { value: 'canada', label: 'Canada' },
            { value: 'australia', label: 'Australia' },
        ],
        conditionalFields: [
            {
                fieldId: 'state',
                condition: { field: 'country', operator: 'equals', value: 'usa' }
            },
            {
                fieldId: 'province',
                condition: { field: 'country', operator: 'equals', value: 'canada' }
            },
            {
                fieldId: 'county',
                condition: { field: 'country', operator: 'equals', value: 'uk' }
            }
        ]
    },
    {
        id: 'state',
        name: 'state',
        label: 'State',
        type: 'select',
        placeholder: 'Select your state',
        icon: LayersIcon,
        colSpan: 'half',
        options: [
            { value: 'ca', label: 'California' },
            { value: 'ny', label: 'New York' },
            { value: 'tx', label: 'Texas' },
        ],
        conditions: [{ field: 'country', operator: 'equals', value: 'usa' }]
    },
    {
        id: 'province',
        name: 'province',
        label: 'Province',
        type: 'select',
        placeholder: 'Select your province',
        icon: LayersIcon,
        colSpan: 'half',
        options: [
            { value: 'on', label: 'Ontario' },
            { value: 'qc', label: 'Quebec' },
        ],
        conditions: [{ field: 'country', operator: 'equals', value: 'canada' }]
    },
    {
        id: 'county',
        name: 'county',
        label: 'County',
        type: 'select',
        placeholder: 'Select your county',
        icon: LayersIcon,
        colSpan: 'half',
        options: [
            { value: 'london', label: 'Greater London' },
            { value: 'manchester', label: 'Manchester' },
        ],
        conditions: [{ field: 'country', operator: 'equals', value: 'uk' }]
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
                fieldId: 'newsletter-frequency',
                condition: { field: 'newsletter', operator: 'equals', value: true }
            }
        ]
    },
    {
        id: 'newsletter-frequency',
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

// Validation fields
const validationFields: DynamicFormField[] = [
    {
        id: 'password',
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Create a password',
        required: true,
        icon: LockClosedIcon,
        colSpan: 'full',
        textValidation: {
            minLength: 8,
            message: 'Password must be at least 8 characters'
        }
    },
    {
        id: 'confirm-password',
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        placeholder: 'Confirm your password',
        required: true,
        icon: LockClosedIcon,
        colSpan: 'full',
        validation: confirmPasswordValidation
    }
];

/* ============================================
   USER REGISTRATION FIELDS
============================================ */

const userRegistrationFields: DynamicFormField[] = [
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
        emailValidation: { pattern: true }
    },
    {
        id: 'phone',
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        placeholder: '+1 (555) 123-4567',
        icon: MobileIcon,
        colSpan: 'half'
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
        textValidation: { minLength: 8 }
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

/* ============================================
   BUSINESS ONBOARDING FIELDS
============================================ */

const businessOnboardingFields: DynamicFormField[] = [
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
        colSpan: 'half'
    },
    {
        id: 'businessPhone',
        name: 'businessPhone',
        label: 'Business Phone',
        type: 'tel',
        placeholder: '+1 (555) 123-4567',
        required: true,
        icon: MobileIcon,
        colSpan: 'half'
    },
    {
        id: 'website',
        name: 'website',
        label: 'Website',
        type: 'url',
        placeholder: 'https://www.company.com',
        icon: GlobeIcon,
        colSpan: 'full'
    }
];

/* ============================================
   DEVELOPER PROFILE FIELDS
============================================ */

const developerProfileFields: DynamicFormField[] = [
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
        colSpan: 'half'
    },
    {
        id: 'portfolio',
        name: 'portfolio',
        label: 'Portfolio Website',
        type: 'url',
        placeholder: 'https://johndoe.dev',
        icon: GlobeIcon,
        colSpan: 'full'
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

/* ============================================
   SURVEY FIELDS
============================================ */

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
        label: 'How likely to recommend?',
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
        conditions: [{ field: 'contactPermission', operator: 'equals', value: true }]
    }
];

/* ============================================
   HEALTH & FITNESS FIELDS
============================================ */

const healthFitnessFields: DynamicFormField[] = [
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

/* ============================================
   E-COMMERCE CHECKOUT FIELDS
============================================ */

const ecommerceFields: DynamicFormField[] = [
    {
        id: 'email',
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'your@email.com',
        required: true,
        icon: EnvelopeClosedIcon,
        colSpan: 'full'
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

/* ============================================
   JOB APPLICATION FIELDS
============================================ */

const jobApplicationFields: DynamicFormField[] = [
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
        colSpan: 'full'
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

/* ============================================
   TRAVEL BOOKING FIELDS
============================================ */

const travelBookingFields: DynamicFormField[] = [
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

/* ============================================
   EDUCATION ENROLLMENT FIELDS
============================================ */

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
        colSpan: 'half'
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

/* ============================================
   FORM TYPE ARRAY
============================================ */

const formTypes: FormType[] = [
    {
        id: 'user-registration',
        name: 'User Registration',
        description: 'Basic user signup with profile information',
        icon: PersonIcon,
        color: 'blue',
        fields: userRegistrationFields,
        sections: [
            { title: 'Personal Information', fields: ['name', 'email', 'phone', 'dob'] },
            { title: 'Account Security', fields: ['password', 'confirmPassword', 'twoFactor'] }
        ]
    },
    {
        id: 'business-onboarding',
        name: 'Business Onboarding',
        description: 'Complete business registration with tax info',
        icon: HomeIcon,
        color: 'green',
        fields: businessOnboardingFields,
        sections: [
            { title: 'Company Details', fields: ['companyName', 'businessType', 'registrationNumber', 'taxId'] },
            { title: 'Business Address', fields: ['address', 'city', 'state', 'country', 'postalCode'] },
            { title: 'Contact Information', fields: ['businessEmail', 'businessPhone', 'website'] }
        ]
    },
    {
        id: 'developer-profile',
        name: 'Developer Profile',
        description: 'Portfolio and skills for developers',
        icon: GitHubLogoIcon,
        color: 'purple',
        fields: developerProfileFields,
        sections: [
            { title: 'Basic Info', fields: ['fullName', 'github', 'linkedin', 'portfolio'] },
            { title: 'Skills & Experience', fields: ['primaryLanguage', 'yearsExperience', 'technologies'] }
        ]
    },
    {
        id: 'event-registration',
        name: 'Event Registration',
        description: 'Conference and workshop signup',
        icon: RocketIcon,
        color: 'orange',
        fields: [...userRegistrationFields.slice(0, 3), ...surveyFields.slice(0, 2)],
        sections: [
            { title: 'Attendee Info', fields: ['name', 'email', 'phone'] },
            { title: 'Experience', fields: ['satisfaction', 'recommendation'] }
        ]
    },
    {
        id: 'survey-feedback',
        name: 'Survey & Feedback',
        description: 'Customer satisfaction and feedback forms',
        icon: ChatBubbleIcon,
        color: 'pink',
        fields: surveyFields,
        sections: [
            { title: 'Experience Rating', fields: ['satisfaction', 'recommendation'] },
            { title: 'Detailed Feedback', fields: ['feedback'] },
            { title: 'Follow-up', fields: ['contactPermission', 'contactEmail'] }
        ]
    },
    {
        id: 'health-fitness',
        name: 'Health & Fitness',
        description: 'Wellness tracking and health profiles',
        icon: HeartIcon,
        color: 'red',
        fields: healthFitnessFields,
        sections: [
            { title: 'Personal Stats', fields: ['age', 'gender'] },
            { title: 'Activity & Goals', fields: ['activityLevel', 'primaryGoal'] }
        ]
    },
    {
        id: 'ecommerce-checkout',
        name: 'E-commerce Checkout',
        description: 'Shopping cart and payment processing',
        icon: CardStackIcon,
        color: 'yellow',
        fields: ecommerceFields,
        sections: [
            { title: 'Contact Info', fields: ['email'] },
            { title: 'Shipping Address', fields: ['shippingName', 'shippingAddress', 'shippingCity', 'shippingState', 'shippingZip'] },
            { title: 'Payment', fields: ['paymentMethod'] }
        ]
    },
    {
        id: 'job-application',
        name: 'Job Application',
        description: 'Candidate application with resume upload',
        icon: ReaderIcon,
        color: 'indigo',
        fields: jobApplicationFields,
        sections: [
            { title: 'Personal Details', fields: ['firstName', 'lastName', 'email'] },
            { title: 'Position Details', fields: ['position', 'experience'] },
            { title: 'Qualifications', fields: ['skills'] }
        ]
    },
    {
        id: 'travel-booking',
        name: 'Travel Booking',
        description: 'Flight and hotel reservations',
        icon: GlobeIcon,
        color: 'teal',
        fields: travelBookingFields,
        sections: [
            { title: 'Trip Details', fields: ['tripType', 'origin', 'destination', 'departureDate', 'returnDate', 'passengers'] }
        ]
    },
    {
        id: 'education-enrollment',
        name: 'Education Enrollment',
        description: 'Course registration and student info',
        icon: BookmarkIcon,
        color: 'cyan',
        fields: educationFields,
        sections: [
            { title: 'Student Info', fields: ['studentName', 'studentEmail', 'dateOfBirth', 'educationLevel'] },
            { title: 'Course Selection', fields: ['courses'] }
        ]
    }
];

const themes: ThemeOption[] = [
    { id: 'default', name: 'Default', variant: 'default', cardVariant: 'default', icon: SunIcon, colors: ['gray', 'slate'] },
    { id: 'vibrant', name: 'Vibrant', variant: 'vibrant', cardVariant: 'glass', icon: MagicWandIcon, colors: ['purple', 'pink', 'orange'] },
    { id: 'neon', name: 'Neon', variant: 'neon', cardVariant: 'neon', icon: LightningBoltIcon, colors: ['fuchsia', 'cyan', 'lime'] },
    { id: 'ocean', name: 'Ocean', variant: 'ocean', cardVariant: 'glass', icon: GlobeIcon, colors: ['cyan', 'blue', 'indigo'] },
    { id: 'sunset', name: 'Sunset', variant: 'sunset', cardVariant: 'elevated', icon: SunIcon, colors: ['orange', 'rose', 'purple'] },
    { id: 'forest', name: 'Forest', variant: 'forest', cardVariant: 'border', icon: LayersIcon, colors: ['green', 'teal', 'lime'] },
    { id: 'galaxy', name: 'Galaxy', variant: 'galaxy', cardVariant: 'glass', icon: StarIcon, colors: ['indigo', 'purple', 'pink'] },
    { id: 'candy', name: 'Candy', variant: 'candy', cardVariant: 'vibrant', icon: HeartIcon, colors: ['pink', 'purple', 'indigo'] },
    { id: 'earthy', name: 'Earthy', variant: 'earthy', cardVariant: 'default', icon: CubeIcon, colors: ['amber', 'stone', 'emerald'] }
];

/* ============================================
   COMPONENTS
============================================ */

const FormTypeSelector: React.FC<FormTypeSelectorProps> = ({
    onSelect,
    selectedType
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {formTypes.map((type) => (
                <motion.button
                    key={type.id}
                    onClick={() => onSelect(type)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                        "p-6 rounded-xl border-2 transition-all duration-300 text-left",
                        selectedType === type.id
                            ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-950/20 shadow-lg`
                            : "border-border hover:border-primary/50 bg-card hover:shadow-md"
                    )}
                >
                    <div className="flex items-start gap-4">
                        <div className={cn(
                            "p-3 rounded-lg",
                            `bg-${type.color}-100 dark:bg-${type.color}-900/30 text-${type.color}-600 dark:text-${type.color}-400`
                        )}>
                            <type.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <Typography variant="h6" weight="semibold" className="mb-1">
                                {type.name}
                            </Typography>
                            <Typography variant="caption" color="muted" className="block mb-3">
                                {type.description}
                            </Typography>
                            <div className="flex flex-wrap gap-1">
                                <span className="text-xs bg-secondary px-2 py-1 rounded">
                                    {type.fields.length} fields
                                </span>
                                <span className="text-xs bg-secondary px-2 py-1 rounded">
                                    {type.sections?.length || 0} sections
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.button>
            ))}
        </div>
    );
};

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
    onThemeChange,
    currentTheme
}) => {
    return (
        <div className="mb-8">
            <Typography variant="h6" weight="semibold" className="mb-4">
                Theme Customization
            </Typography>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {themes.map((theme) => (
                    <motion.button
                        key={theme.id}
                        onClick={() => onThemeChange(theme)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "p-3 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2",
                            currentTheme === theme.id
                                ? `border-${theme.colors[0]}-500 bg-${theme.colors[0]}-50 dark:bg-${theme.colors[0]}-950/20`
                                : "border-border hover:border-primary/50 bg-card"
                        )}
                    >
                        <div className={cn(
                            "p-2 rounded-full",
                            `bg-gradient-to-br from-${theme.colors[0]}-500 to-${theme.colors[1] || theme.colors[0]}-500`
                        )}>
                            <theme.icon className="w-4 h-4 text-white" />
                        </div>
                        <Typography variant="caption" weight="medium">
                            {theme.name}
                        </Typography>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

/* ============================================
   META CONFIGURATION
============================================ */

const meta: Meta<typeof DynamicForm> = {
    title: "Templates/Pages/Forms/DynamicForm",
    component: DynamicForm,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "vibrant", "pastel", "neon", "earthy", "ocean", "sunset", "forest", "galaxy", "candy"],
        },
        cardVariant: {
            control: "select",
            options: ["default", "glass", "border", "elevated", "neon", "vibrant"],
        },
        animationIntensity: {
            control: "select",
            options: ["subtle", "moderate", "high"],
        },
    },
};

export default meta;
type Story = StoryObj<typeof DynamicForm>;

/* ============================================
   STORIES
============================================ */

export const FormCustomizer: Story = {
    render: function Render() {
        const [selectedForm, setSelectedForm] = useState<FormType>(formTypes[0]);
        const [selectedTheme, setSelectedTheme] = useState<ThemeOption>({
            id: 'default',
            name: 'Default',
            variant: 'default',
            cardVariant: 'default',
            icon: SunIcon,
            colors: ['gray', 'slate']
        });
        const [showDebug, setShowDebug] = useState<boolean>(false);
        const [formData, setFormData] = useState<FormValues>({});

        const handleFormTypeSelect = (type: FormType) => {
            setSelectedForm(type);
        };

        const handleThemeChange = (theme: ThemeOption) => {
            setSelectedTheme(theme);
        };

        const handleSubmit = (data: FormValues) => {
            alert(`Form submitted: ${JSON.stringify(data)}`);
            setFormData(data);
        };

        return (
            <div className="min-h-screen bg-background">
                <div className="container max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <Typography variant="h2" weight="bold" className="mb-2">
                            🎨 Dynamic Form Customizer
                        </Typography>
                        <Typography variant="lead" color="muted" className="mb-6">
                            Select a form type, customize the theme, and see real-time changes
                        </Typography>
                    </div>

                    <FormTypeSelector
                        onSelect={handleFormTypeSelect}
                        selectedType={selectedForm.id}
                    />

                    <ThemeCustomizer
                        onThemeChange={handleThemeChange}
                        currentTheme={selectedTheme.id}
                    />

                    <div className="flex justify-end mb-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowDebug(!showDebug)}
                            className="ml-auto"
                        >
                            {showDebug ? 'Hide Debugger' : 'Show Debugger'}
                        </Button>
                    </div>

                    <DynamicForm
                        fields={selectedForm.fields}
                        onSubmit={handleSubmit}
                        variant={selectedTheme.variant}
                        cardVariant={selectedTheme.cardVariant}
                        animationIntensity="moderate"
                        showSuccessNotification={true}
                        debug={showDebug}
                        onChange={(data: FormValues) => alert(`Form changed: ${JSON.stringify(data)}`)}
                    >
                        <DynamicHeader
                            title={selectedForm.name}
                            description={selectedForm.description}
                            icon={<RocketIcon className="w-6 h-6" />}
                            gradient
                            animated
                        />

                        <DynamicContent showFieldCount>
                            {selectedForm.sections ? (
                                selectedForm.sections.map((section: FormSection, idx: number) => (
                                    <DynamicSection
                                        key={idx}
                                        title={section.title}
                                        description={section.description}
                                        collapsible
                                        gradient
                                    >
                                        {section.fields.map((fieldId: string) => {
                                            const field = selectedForm.fields.find((f: DynamicFormField) => f.id === fieldId);
                                            return field ? <DynamicField key={field.id} field={field} /> : null;
                                        })}
                                    </DynamicSection>
                                ))
                            ) : (
                                selectedForm.fields.map((field: DynamicFormField) => (
                                    <DynamicField key={field.id} field={field} />
                                ))
                            )}
                        </DynamicContent>

                        <DynamicNavigation
                            submitButtonLabel="Submit"
                            showCancelButton={true}
                            cancelButtonLabel="Reset"
                            onCancel={() => alert('Form cancelled')}
                        />

                        <ThemeToggle />
                    </DynamicForm>

                    {Object.keys(formData).length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 p-4 bg-secondary/30 rounded-lg"
                        >
                            <Typography variant="h6" weight="semibold" className="mb-2">
                                📋 Last Submitted Data
                            </Typography>
                            <pre className="bg-background p-4 rounded overflow-auto max-h-60">
                                {JSON.stringify(formData, null, 2)}
                            </pre>
                        </motion.div>
                    )}
                </div>
            </div>
        );
    }
};

// Vibrant theme story
export const VibrantTheme: Story = {
    render: () => (
        <DynamicForm
            fields={basicFields}
            onSubmit={(data: FormValues) => alert(`Form submitted: ${JSON.stringify(data)}`)}
            variant="vibrant"
            cardVariant="glass"
            animationIntensity="high"
        >
            <DynamicHeader
                title="✨ Registration Form"
                description="Please fill in your details"
                icon={<MagicWandIcon className="w-6 h-6" />}
                gradient
                animated
            />
            <DynamicContent showFieldCount>
                {basicFields.map((field: DynamicFormField) => (
                    <DynamicField key={field.id} field={field} />
                ))}
            </DynamicContent>
            <DynamicNavigation submitButtonLabel="Submit" />
            <ThemeToggle />
        </DynamicForm>
    ),
};

// Neon theme story
export const NeonTheme: Story = {
    render: () => (
        <DynamicForm
            fields={basicFields}
            onSubmit={(data: FormValues) => alert(`Form submitted: ${JSON.stringify(data)}`)}
            variant="neon"
            cardVariant="neon"
            animationIntensity="high"
        >
            <DynamicHeader
                title="⚡ Gamer Registration"
                description="Join the gaming community"
                icon={<RocketIcon className="w-6 h-6" />}
                gradient
                animated
            />
            <DynamicContent showFieldCount>
                {basicFields.map((field: DynamicFormField) => (
                    <DynamicField key={field.id} field={field} />
                ))}
            </DynamicContent>
            <DynamicNavigation submitButtonLabel="Join Now" />
            <ThemeToggle />
        </DynamicForm>
    ),
};

// Ocean theme story
export const OceanTheme: Story = {
    render: () => (
        <DynamicForm
            fields={basicFields}
            onSubmit={(data: FormValues) => alert(`Form submitted: ${JSON.stringify(data)}`)}
            variant="ocean"
            cardVariant="glass"
        >
            <DynamicHeader
                title="🌊 Ocean Explorer"
                description="Dive into your adventure"
                icon={<GlobeIcon className="w-6 h-6" />}
                gradient
                animated
            />
            <DynamicContent showFieldCount>
                {basicFields.map((field: DynamicFormField) => (
                    <DynamicField key={field.id} field={field} />
                ))}
            </DynamicContent>
            <DynamicNavigation submitButtonLabel="Start Journey" />
            <ThemeToggle />
        </DynamicForm>
    ),
};

// Sunset theme story
export const SunsetTheme: Story = {
    render: () => (
        <DynamicForm
            fields={basicFields}
            onSubmit={(data: FormValues) => alert(`Form submitted: ${JSON.stringify(data)}`)}
            variant="sunset"
            cardVariant="elevated"
        >
            <DynamicHeader
                title="🌅 Wanderer Registration"
                description="Begin your sunset journey"
                icon={<SunIcon className="w-6 h-6" />}
                gradient
                animated
            />
            <DynamicContent showFieldCount>
                {basicFields.map((field: DynamicFormField) => (
                    <DynamicField key={field.id} field={field} />
                ))}
            </DynamicContent>
            <DynamicNavigation submitButtonLabel="Start Journey" />
            <ThemeToggle />
        </DynamicForm>
    ),
};

// Forest theme story
export const ForestTheme: Story = {
    render: () => (
        <DynamicForm
            fields={basicFields}
            onSubmit={(data: FormValues) => alert(`Form submitted: ${JSON.stringify(data)}`)}
            variant="forest"
            cardVariant="border"
        >
            <DynamicHeader
                title="🌲 Forest Explorer"
                description="Connect with nature"
                icon={<LayersIcon className="w-6 h-6" />}
                gradient
                animated
            />
            <DynamicContent showFieldCount>
                {basicFields.map((field: DynamicFormField) => (
                    <DynamicField key={field.id} field={field} />
                ))}
            </DynamicContent>
            <DynamicNavigation submitButtonLabel="Explore" />
            <ThemeToggle />
        </DynamicForm>
    ),
};

// Galaxy theme story
export const GalaxyTheme: Story = {
    render: () => (
        <DynamicForm
            fields={basicFields}
            onSubmit={(data: FormValues) => alert(`Form submitted: ${JSON.stringify(data)}`)}
            variant="galaxy"
            cardVariant="glass"
        >
            <DynamicHeader
                title="🌌 Space Explorer"
                description="To infinity and beyond"
                icon={<RocketIcon className="w-6 h-6" />}
                gradient
                animated
            />
            <DynamicContent showFieldCount>
                {basicFields.map((field: DynamicFormField) => (
                    <DynamicField key={field.id} field={field} />
                ))}
            </DynamicContent>
            <DynamicNavigation submitButtonLabel="Launch" />
            <ThemeToggle />
        </DynamicForm>
    ),
};

// Multi-step story
export const MultiStepForm: Story = {
    render: () => {
        const [step, setStep] = useState<number>(1);
        const steps = [
            { title: "Personal", icon: PersonIcon },
            { title: "Account", icon: HeartIcon },
            { title: "Review", icon: CheckCircledIcon }
        ];

        return (
            <DynamicForm
                fields={basicFields}
                onSubmit={(data: FormValues) => alert(`Form submitted: ${JSON.stringify(data)}`)}
                variant="vibrant"
                cardVariant="glass"
            >
                <DynamicHeader>
                    <div className="flex items-center gap-2">
                        {steps.map((s, i) => (
                            <React.Fragment key={i}>
                                <motion.div
                                    className="flex items-center gap-2"
                                    animate={{
                                        scale: step === i + 1 ? 1.1 : 1,
                                    }}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center",
                                        step === i + 1 ? "bg-primary text-white" : "bg-secondary"
                                    )}>
                                        <s.icon className="w-4 h-4" />
                                    </div>
                                    <span className="hidden sm:inline">{s.title}</span>
                                </motion.div>
                                {i < steps.length - 1 && (
                                    <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </DynamicHeader>

                <DynamicContent>
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <DynamicField field={basicFields[0]} />
                                <DynamicField field={basicFields[1]} />
                            </motion.div>
                        )}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <DynamicField field={basicFields[2]} />
                                <DynamicField field={basicFields[3]} />
                            </motion.div>
                        )}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <div className="p-4 bg-secondary/30 rounded-lg">
                                    <Typography variant="h6">Review Your Information</Typography>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </DynamicContent>

                <DynamicNavigation>
                    <div className="flex gap-3">
                        {step > 1 && (
                            <Button variant="outline" onClick={() => setStep(step - 1)}>
                                Previous
                            </Button>
                        )}
                        {step < 3 ? (
                            <Button onClick={() => setStep(step + 1)}>
                                Next
                            </Button>
                        ) : (
                            <Button onClick={() => alert("Complete")}>
                                Complete
                            </Button>
                        )}
                    </div>
                </DynamicNavigation>
                <ThemeToggle />
            </DynamicForm >
        );
    },
};

// Conditional Logic Demo
export const ConditionalLogicDemo: Story = {
    render: () => (
        <DynamicForm
            fields={complexConditionalFields}
            onSubmit={(data: FormValues) => alert(`Form submitted: ${JSON.stringify(data)}`)}
            variant="vibrant"
            cardVariant="glass"
            animationIntensity="high"
        >
            <DynamicHeader
                title="🔀 Conditional Logic Demo"
                description="Watch fields appear/disappear based on your selections"
                icon={<MagicWandIcon className="w-6 h-6" />}
                gradient
            />

            <DynamicContent showFieldCount>
                {complexConditionalFields.map((field: DynamicFormField) => (
                    <DynamicField key={field.id} field={field} animationVariant="slide" />
                ))}
            </DynamicContent>

            <DynamicNavigation submitButtonLabel="Submit" />
            <ThemeToggle />
        </DynamicForm>
    )
};

// Animation Intensity Demo
export const AnimationIntensity: Story = {
    render: function Render() {
        const [intensity, setIntensity] = useState<'subtle' | 'moderate' | 'high'>('moderate');

        return (
            <div className="min-h-screen bg-background">
                <div className="container max-w-4xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <Typography variant="h3" weight="bold" className="mb-4">
                            Animation Intensity
                        </Typography>
                        <div className="flex gap-3 mb-6">
                            {(['subtle', 'moderate', 'high'] as const).map((level) => (
                                <Button
                                    key={level}
                                    variant={intensity === level ? "default" : "outline"}
                                    onClick={() => setIntensity(level)}
                                >
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <DynamicForm
                        fields={basicFields}
                        onSubmit={(data: FormValues) => alert(`Form submitted: ${JSON.stringify(data)}`)}
                        variant="default"
                        animationIntensity={intensity}
                    >
                        <DynamicHeader
                            title={`${intensity.charAt(0).toUpperCase() + intensity.slice(1)} Animations`}
                            description="Experience different animation intensities"
                            icon={<LightningBoltIcon className="w-6 h-6" />}
                        />

                        <DynamicContent>
                            {basicFields.map((field: DynamicFormField) => (
                                <DynamicField key={field.id} field={field} />
                            ))}
                        </DynamicContent>

                        <DynamicNavigation submitButtonLabel="Submit" />
                    </DynamicForm>
                </div>
            </div>
        );
    }
};

// Compact View
export const CompactView: Story = {
    render: () => (
        <DynamicForm
            fields={basicFields}
            onSubmit={(data: FormValues) => alert(`Form submitted: ${JSON.stringify(data)}`)}
            variant="default"
            cardVariant="border"
        >
            <DynamicHeader
                title="Compact Form"
                description="Minimal design with essential fields"
                icon={<CheckCircledIcon className="w-6 h-6" />}
            />

            <DynamicContent showFieldCount={false}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {basicFields.map((field: DynamicFormField) => (
                        <DynamicField key={field.id} field={field} showLabel={false} />
                    ))}
                </div>
            </DynamicContent>

            <DynamicNavigation submitButtonLabel="Save" />
        </DynamicForm>
    )
};

// Form Presets
export const FormPresets: Story = {
    render: function Render() {
        const [preset, setPreset] = useState<string>('basic');

        interface Preset {
            fields: DynamicFormField[];
            title: string;
            description: string;
        }

        interface Presets {
            [key: string]: Preset;
        }

        const presets: Presets = {
            basic: {
                fields: userRegistrationFields,
                title: 'Basic Registration',
                description: 'Simple user registration form'
            },
            complex: {
                fields: complexConditionalFields,
                title: 'Complex Conditional Form',
                description: 'Advanced form with multiple conditional fields'
            },
            validation: {
                fields: validationFields,
                title: 'Validation Demo',
                description: 'Form with extensive validation rules'
            },
            survey: {
                fields: surveyFields,
                title: 'Customer Survey',
                description: 'Feedback collection form'
            }
        };

        return (
            <div className="min-h-screen bg-background">
                <div className="container max-w-4xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <Typography variant="h3" weight="bold" className="mb-4">
                            Form Presets
                        </Typography>
                        <div className="flex gap-3 flex-wrap mb-6">
                            {Object.entries(presets).map(([key, value]) => (
                                <Button
                                    key={key}
                                    variant={preset === key ? "default" : "outline"}
                                    onClick={() => setPreset(key)}
                                >
                                    {value.title}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <DynamicForm
                        fields={presets[preset].fields}
                        onSubmit={(data: FormValues) => alert(`Form submitted: ${JSON.stringify(data)}`)}
                        variant="default"
                        cardVariant="elevated"
                        animationIntensity="moderate"
                    >
                        <DynamicHeader
                            title={presets[preset].title}
                            description={presets[preset].description}
                            icon={<MagicWandIcon className="w-6 h-6" />}
                            gradient
                        />

                        <DynamicContent>
                            {presets[preset].fields.map((field: DynamicFormField) => (
                                <DynamicField key={field.id} field={field} />
                            ))}
                        </DynamicContent>

                        <DynamicNavigation submitButtonLabel="Submit" />
                    </DynamicForm>
                </div>
            </div>
        );
    }
};

// Full Featured Demo
export const FullFeaturedDemo: Story = {
    render: function Render() {
        const [activeTab, setActiveTab] = useState<string>('personal');

        const tabs = [
            { id: 'personal', label: 'Personal Info', icon: PersonIcon },
            { id: 'professional', label: 'Professional', icon: RocketIcon },
            { id: 'preferences', label: 'Preferences', icon: HeartIcon },
            { id: 'review', label: 'Review', icon: CheckCircledIcon }
        ];

        const allFields: DynamicFormField[] = [
            ...userRegistrationFields,
            ...developerProfileFields.slice(0, 3),
            ...surveyFields.slice(0, 2)
        ];

        return (
            <DynamicForm
                fields={allFields}
                onSubmit={(data: FormValues) => alert(`Form submitted: ${JSON.stringify(data)}`)}
                variant="galaxy"
                cardVariant="glass"
                animationIntensity="high"
                showSuccessNotification={true}
                successNotificationMessage="✨ Form submitted successfully! Thank you for your response."
            >
                <DynamicHeader>
                    <div className="flex items-center gap-4 w-full">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                whileHover={{ y: -2 }}
                                whileTap={{ y: 0 }}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
                                    activeTab === tab.id
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-secondary"
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </DynamicHeader>

                <DynamicContent>
                    <AnimatePresence mode="wait">
                        {activeTab === 'personal' && (
                            <motion.div
                                key="personal"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                {userRegistrationFields.slice(0, 4).map((field: DynamicFormField) => (
                                    <DynamicField key={field.id} field={field} />
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'professional' && (
                            <motion.div
                                key="professional"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                {developerProfileFields.slice(0, 3).map((field: DynamicFormField) => (
                                    <DynamicField key={field.id} field={field} />
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'preferences' && (
                            <motion.div
                                key="preferences"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                {surveyFields.slice(0, 2).map((field: DynamicFormField) => (
                                    <DynamicField key={field.id} field={field} />
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'review' && (
                            <motion.div
                                key="review"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="space-y-4"
                            >
                                <div className="p-6 bg-secondary/30 rounded-lg text-center">
                                    <CheckCircledIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
                                    <Typography variant="h5" weight="bold" className="mb-2">
                                        Ready to Submit!
                                    </Typography>
                                    <Typography variant="body" color="muted">
                                        Please review your information before submitting.
                                    </Typography>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </DynamicContent>

                <DynamicNavigation>
                    <div className="flex gap-3">
                        {activeTab !== 'personal' && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    const index = tabs.findIndex(t => t.id === activeTab);
                                    if (index > 0) setActiveTab(tabs[index - 1].id);
                                }}
                            >
                                Previous
                            </Button>
                        )}
                        {activeTab !== 'review' ? (
                            <Button
                                onClick={() => {
                                    const index = tabs.findIndex(t => t.id === activeTab);
                                    if (index < tabs.length - 1) setActiveTab(tabs[index + 1].id);
                                }}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button onClick={() => alert('Submitting...')}>
                                Submit Form
                            </Button>
                        )}
                    </div>
                </DynamicNavigation>

                <ThemeToggle />
                <DynamicDebugger />
            </DynamicForm>
        );
    }
};

export {
    FormCustomizer as CustomizableForm
};