import type { Meta, StoryObj } from "@storybook/react-vite";
import {
    MultiStepForm,
    MultiStepHeader,
    MultiStepStepIndicator,
    MultiStepContent,
    MultiStepField,
    MultiStepReview,
    MultiStepNavigation,
} from "./";
import {
    PersonIcon,
    EnvelopeClosedIcon,
    ReaderIcon,
    LapTimerIcon,
    ChatBubbleIcon,
    EnvelopeOpenIcon,
    HeartIcon,
    BellIcon,
    LockClosedIcon,
    HomeIcon,
    RocketIcon,
    LightningBoltIcon,
    CheckCircledIcon,
    MobileIcon,
    ClockIcon,
    CardStackIcon,
    StarIcon,
    CalendarIcon,
    DrawingPinIcon,
    CrumpledPaperIcon,
    GlobeIcon,
    CheckboxIcon,
    RadiobuttonIcon,
    LayersIcon,
} from "@radix-ui/react-icons";
import { Typography } from "../../../../components/typography";

const meta: Meta<typeof MultiStepForm> = {
    title: "Templates/Pages/Forms/MultiStepForm",
    component: MultiStepForm,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Multi-step wizard form for guided data collection with step navigation, validation, and review screen. Uses compound components for flexible composition.",
            },
        },
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "gradient", "card", "glass", "dark"],
            description: "Visual theme for the form",
        },
        animationVariant: {
            control: "select",
            options: ["fadeUp", "scaleIn", "slideUp", "slideLeft", "slideRight"],
            description: "Animation variant for step transitions",
        },
        showReviewStep: {
            control: "boolean",
            description: "Show review step before submission",
        },
    },
};

export default meta;
type Story = StoryObj<typeof MultiStepForm>;

// Sample step configurations
const onboardingSteps = [
    {
        id: 'personal-info',
        title: 'Personal Info',
        description: 'Tell us a bit about yourself.',
        fields: [
            {
                id: 'first-name',
                name: 'firstName',
                label: 'First Name',
                type: 'text' as const,
                placeholder: 'John',
                required: true,
                icon: PersonIcon,
                colSpan: 'half' as const,
            },
            {
                id: 'last-name',
                name: 'lastName',
                label: 'Last Name',
                type: 'text' as const,
                placeholder: 'Doe',
                required: true,
                icon: PersonIcon,
                colSpan: 'half' as const,
            },
            {
                id: 'email',
                name: 'email',
                label: 'Email Address',
                type: 'email' as const,
                placeholder: 'john@example.com',
                required: true,
                icon: EnvelopeClosedIcon,
                colSpan: 'full' as const,
                emailValidation: {
                    pattern: true,
                }
            },
        ],
    },
    {
        id: 'additional-details',
        title: 'Additional Details',
        description: 'Help us understand your needs better.',
        fields: [
            {
                id: 'role',
                name: 'role',
                label: 'Your Role',
                type: 'select' as const,
                placeholder: 'Select your role',
                required: true,
                options: [
                    { value: 'developer', label: 'Developer' },
                    { value: 'designer', label: 'Designer' },
                    { value: 'manager', label: 'Manager' },
                    { value: 'other', label: 'Other' },
                ],
                icon: ReaderIcon,
                colSpan: 'full' as const,
            },
            {
                id: 'experience',
                name: 'experience',
                label: 'Experience Level',
                type: 'radio' as const,
                required: true,
                options: [
                    { value: 'beginner', label: 'Beginner (0–2 years)' },
                    { value: 'intermediate', label: 'Intermediate (3–5 years)' },
                    { value: 'senior', label: 'Senior (5+ years)' },
                ],
                icon: LapTimerIcon,
                colSpan: 'full' as const,
            },
            {
                id: 'bio',
                name: 'bio',
                label: 'Short Bio',
                type: 'textarea' as const,
                placeholder: 'Tell us about yourself in a few sentences...',
                required: false,
                icon: ChatBubbleIcon,
                colSpan: 'full' as const,
            },
        ],
    },
    {
        id: 'preferences',
        title: 'Preferences',
        description: 'Almost done! Set your preferences.',
        fields: [
            {
                id: 'email-notifications',
                name: 'emailNotifications',
                label: 'Receive email notifications',
                type: 'checkbox' as const,
                placeholder: 'Receive email notifications',
                required: false,
                defaultValue: false,
                icon: EnvelopeOpenIcon,
                colSpan: 'full' as const,
            },
            {
                id: 'newsletter',
                name: 'newsletter',
                label: 'Subscribe to our newsletter',
                type: 'checkbox' as const,
                placeholder: 'Subscribe to our newsletter',
                required: false,
                defaultValue: false,
                icon: HeartIcon,
                colSpan: 'full' as const,
            },
            {
                id: 'contact-method',
                name: 'contactMethod',
                label: 'Preferred Contact Method',
                type: 'select' as const,
                placeholder: 'How should we reach you?',
                required: true,
                options: [
                    { value: 'email', label: 'Email' },
                    { value: 'phone', label: 'Phone' },
                    { value: 'sms', label: 'SMS' },
                ],
                icon: ChatBubbleIcon,
                colSpan: 'full' as const,
            },
        ],
    },
];

const registrationSteps = [
    {
        id: 'account',
        title: 'Account Details',
        description: 'Create your account credentials',
        fields: [
            {
                id: 'username',
                name: 'username',
                label: 'Username',
                type: 'text' as const,
                placeholder: 'johndoe',
                required: true,
                icon: PersonIcon,
                colSpan: 'full' as const,
            },
            {
                id: 'email',
                name: 'email',
                label: 'Email Address',
                type: 'email' as const,
                placeholder: 'john@example.com',
                required: true,
                icon: EnvelopeClosedIcon,
                colSpan: 'full' as const,
                emailValidation: {
                    pattern: true,
                    message: 'Please enter a valid email address'
                }
            },
            {
                id: 'password',
                name: 'password',
                label: 'Password',
                type: 'password' as const,
                placeholder: '••••••••',
                required: true,
                icon: LockClosedIcon,
                colSpan: 'half' as const,
            },
            {
                id: 'confirm-password',
                name: 'confirmPassword',
                label: 'Confirm Password',
                type: 'password' as const,
                placeholder: '••••••••',
                required: true,
                icon: LockClosedIcon,
                colSpan: 'half' as const,
            },
        ],
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
                type: 'text' as const,
                placeholder: 'John',
                required: true,
                icon: PersonIcon,
                colSpan: 'half' as const,
            },
            {
                id: 'last-name',
                name: 'lastName',
                label: 'Last Name',
                type: 'text' as const,
                placeholder: 'Doe',
                required: true,
                icon: PersonIcon,
                colSpan: 'half' as const,
            },
            {
                id: 'phone',
                name: 'phone',
                label: 'Phone Number',
                type: 'tel' as const,
                placeholder: '+1 (555) 123-4567',
                required: false,
                icon: MobileIcon,
                colSpan: 'half' as const,
            },
            {
                id: 'location',
                name: 'location',
                label: 'Location',
                type: 'text' as const,
                placeholder: 'City, Country',
                required: false,
                icon: DrawingPinIcon,
                colSpan: 'half' as const,
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
                type: 'checkbox' as const,
                placeholder: 'Subscribe to our newsletter for updates',
                required: false,
                defaultValue: true,
                icon: HeartIcon,
                colSpan: 'full' as const,
            },
            {
                id: 'notifications',
                name: 'notifications',
                label: 'Notification Preferences',
                type: 'select' as const,
                placeholder: 'Select notification type',
                required: true,
                options: [
                    { value: 'all', label: 'All notifications' },
                    { value: 'important', label: 'Important only' },
                    { value: 'none', label: 'No notifications' },
                ],
                icon: BellIcon,
                colSpan: 'full' as const,
            },
        ],
    },
];

// Create a Step helper component for cleaner syntax
const Step = ({ _step, children }: { step: number; children: React.ReactNode }) => {
    return <>{children}</>;
};

/* ============================================
   BASIC STORIES
============================================ */

// Default Onboarding Wizard Story
export const Default: Story = {
    render: () => (
        <MultiStepForm
            steps={onboardingSteps}
            onSubmit={(data) => console.log('Form submitted:', data)}
            variant="default"
            animationVariant="fadeUp"
        >
            <MultiStepHeader
                titleVariant="h3"
                title="Onboarding Wizard"
                icon={<LightningBoltIcon className="text-white" />}
                titleClassName="text-4xl font-bold text-foreground"
                iconSize={32}
                iconClassName="w-14 h-14"
            />

            <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <MultiStepStepIndicator />
            </div>

            <MultiStepContent>
                {/* Step 1 Fields */}
                <Step step={1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[0].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                {/* Step 2 Fields */}
                <Step step={2}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[1].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                {/* Step 3 Fields */}
                <Step step={3}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[2].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                {/* Review Step - This will only show on step 4 */}
                <MultiStepReview />
            </MultiStepContent>
            <MultiStepNavigation />
        </MultiStepForm>
    ),
    name: "1.1 Default Onboarding Wizard",
};

export const RegistrationForm: Story = {
    render: () => (
        <MultiStepForm
            steps={registrationSteps}
            onSubmit={(data) => console.log('Registration submitted:', data)}
            variant="default"
            animationVariant="slideUp"
            inputVariant="borderGlow"
            buttonVariant="primary"
            buttonAnimationVariant="scaleHeartBeat"
        >
            <MultiStepHeader
                titleVariant="h3"
                title="Create Account"
                icon={<PersonIcon className="text-white" />}
                titleClassName="text-3xl font-bold text-foreground"
                iconSize={28}
                iconClassName="w-12 h-12"
            />

            <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <MultiStepStepIndicator />
            </div>

            <MultiStepContent>
                {/* Step 1 Fields */}
                <Step step={1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {registrationSteps[0].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                {/* Step 2 Fields */}
                <Step step={2}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {registrationSteps[1].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                {/* Step 3 Fields */}
                <Step step={3}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {registrationSteps[2].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <MultiStepReview />
            </MultiStepContent>
            <MultiStepNavigation submitButtonLabel="Create Account" />
        </MultiStepForm>
    ),
    name: "1.2 Registration Form",
};

/* ============================================
   THEME VARIATIONS
============================================ */

export const GlassTheme: Story = {
    render: () => (
        <MultiStepForm
            steps={onboardingSteps}
            onSubmit={(data) => console.log('Form submitted:', data)}
            variant="glass"
            inputVariant="glassmorphism"
            buttonVariant="glass"
        >
            <MultiStepHeader
                titleVariant="h3"
                title="Glass Theme"
                icon={<LightningBoltIcon className="text-white" />}
                titleClassName="text-4xl font-bold text-foreground/90"
                iconSize={30}
                iconClassName="w-13 h-13 bg-white/20 backdrop-blur-sm"
            />

            <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <MultiStepStepIndicator />
            </div>

            <MultiStepContent>
                <Step step={1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[0].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={2}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[1].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={3}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[2].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <MultiStepReview />
            </MultiStepContent>
            <MultiStepNavigation />
        </MultiStepForm>
    ),
    name: "2.1 Glass Theme",
};

export const DarkTheme: Story = {
    render: () => (
        <MultiStepForm
            steps={onboardingSteps}
            onSubmit={(data) => console.log('Form submitted:', data)}
            variant="dark"
            darkMode
        >
            <MultiStepHeader
                titleVariant="h3"
                title="Dark Theme"
                icon={<LightningBoltIcon className="text-yellow-400" />}
                titleClassName="text-4xl font-bold text-white"
                iconSize={30}
                iconClassName="w-13 h-13 bg-gray-800"
            />

            <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <MultiStepStepIndicator />
            </div>


            <MultiStepContent>
                <Step step={1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[0].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={2}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[1].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={3}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[2].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <MultiStepReview />
            </MultiStepContent>
            <MultiStepNavigation />
        </MultiStepForm>
    ),
    name: "2.2 Dark Theme",
};

/* ============================================
   LAYOUT VARIATIONS
============================================ */

export const MinimalForm: Story = {
    render: () => {
        const singleStep = [{
            id: 'step1',
            title: 'Quick Feedback',
            description: 'We\'d love to hear from you',
            fields: [
                {
                    id: 'name',
                    name: 'name',
                    label: 'Name',
                    type: 'text' as const,
                    placeholder: 'Your name',
                    required: true,
                    icon: PersonIcon,
                    colSpan: 'full' as const,
                },
                {
                    id: 'email',
                    name: 'email',
                    label: 'Email',
                    type: 'email' as const,
                    placeholder: 'your@email.com',
                    required: true,
                    icon: EnvelopeClosedIcon,
                    colSpan: 'full' as const,
                },
                {
                    id: 'feedback',
                    name: 'feedback',
                    label: 'Feedback',
                    type: 'textarea' as const,
                    placeholder: 'Your feedback',
                    required: true,
                    icon: ChatBubbleIcon,
                    colSpan: 'full' as const,
                },
            ],
        }];

        return (
            <MultiStepForm
                steps={singleStep}
                onSubmit={(data) => console.log('Feedback submitted:', data)}
                showReviewStep={false}
                buttonVariant="primary"
            >
                <MultiStepHeader
                    titleVariant="h3"
                    title="Quick Survey"
                    titleClassName="text-3xl font-bold"
                    iconSize={24}
                />

                <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <MultiStepStepIndicator />
                </div>

                <MultiStepContent>
                    <Step step={1}>
                        <div className="grid grid-cols-1 gap-6">
                            {singleStep[0].fields.map(field => (
                                <MultiStepField key={field.id} field={field} />
                            ))}
                        </div>
                    </Step>
                </MultiStepContent>
                <MultiStepNavigation submitButtonLabel="Submit Feedback" showCancelButton={false} />
            </MultiStepForm>
        );
    },
    name: "3.1 Minimal Form (Single Step)",
};

export const WithoutReviewStep: Story = {
    render: () => (
        <MultiStepForm
            steps={onboardingSteps}
            onSubmit={(data) => console.log('Form submitted:', data)}
            showReviewStep={false}
        >
            <MultiStepHeader
                titleVariant="h3"
                title="Quick Onboarding"
                icon={<LightningBoltIcon className="text-white" />}
                titleClassName="text-3xl font-bold"
                iconSize={24}
                iconClassName="w-12 h-12"
            />

            <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <MultiStepStepIndicator />
            </div>
            <MultiStepContent>
                <Step step={1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[0].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={2}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[1].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={3}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[2].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>
            </MultiStepContent>
            <MultiStepNavigation />
        </MultiStepForm>
    ),
    name: "3.2 Without Review Step",
};

/* ============================================
   ANIMATION VARIATIONS
============================================ */

export const SlideAnimation: Story = {
    render: () => (
        <MultiStepForm
            steps={onboardingSteps}
            onSubmit={(data) => console.log('Form submitted:', data)}
            animationVariant="slideUp"
        >
            <MultiStepHeader
                titleVariant="h3"
                title="Slide Animation"
                icon={<LightningBoltIcon className="text-white" />}
                titleClassName="text-4xl font-bold"
                iconSize={28}
                iconClassName="w-12 h-12"
            />
            <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <MultiStepStepIndicator />
            </div>
            <MultiStepContent>
                <Step step={1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[0].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={2}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[1].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={3}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[2].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <MultiStepReview />
            </MultiStepContent>
            <MultiStepNavigation />
        </MultiStepForm>
    ),
    name: "4.1 Slide Animation",
};

export const ScaleAnimation: Story = {
    render: () => (
        <MultiStepForm
            steps={onboardingSteps}
            onSubmit={(data) => console.log('Form submitted:', data)}
            animationVariant="scaleIn"
        >
            <MultiStepHeader
                titleVariant="h3"
                title="Scale Animation"
                icon={<LightningBoltIcon className="text-white" />}
                titleClassName="text-4xl font-bold"
                iconSize={28}
                iconClassName="w-12 h-12"
            />
            <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <MultiStepStepIndicator />
            </div>
            <MultiStepContent>
                <Step step={1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[0].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={2}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[1].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={3}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[2].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <MultiStepReview />
            </MultiStepContent>
            <MultiStepNavigation />
        </MultiStepForm>
    ),
    name: "4.2 Scale Animation",
};

/* ============================================
   COMPLEX EXAMPLES
============================================ */

export const PaymentForm: Story = {
    render: () => {
        const paymentSteps = [
            {
                id: 'billing',
                title: 'Billing Address',
                description: 'Enter your billing information',
                fields: [
                    {
                        id: 'full-name',
                        name: 'fullName',
                        label: 'Full Name',
                        type: 'text' as const,
                        placeholder: 'John Doe',
                        required: true,
                        icon: PersonIcon,
                        colSpan: 'full' as const,
                    },
                    {
                        id: 'address',
                        name: 'address',
                        label: 'Street Address',
                        type: 'text' as const,
                        placeholder: '123 Main St',
                        required: true,
                        icon: HomeIcon,
                        colSpan: 'full' as const,
                    },
                    {
                        id: 'city',
                        name: 'city',
                        label: 'City',
                        type: 'text' as const,
                        placeholder: 'San Francisco',
                        required: true,
                        icon: CrumpledPaperIcon,
                        colSpan: 'half' as const,
                    },
                    {
                        id: 'state',
                        name: 'state',
                        label: 'State',
                        type: 'text' as const,
                        placeholder: 'CA',
                        required: true,
                        icon: LayersIcon,
                        colSpan: 'half' as const,
                    },
                    {
                        id: 'zip',
                        name: 'zip',
                        label: 'ZIP Code',
                        type: 'text' as const,
                        placeholder: '94105',
                        required: true,
                        icon: LayersIcon,
                        colSpan: 'half' as const,
                    },
                    {
                        id: 'country',
                        name: 'country',
                        label: 'Country',
                        type: 'text' as const,
                        placeholder: 'USA',
                        required: true,
                        icon: GlobeIcon,
                        colSpan: 'half' as const,
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
                        type: 'text' as const,
                        placeholder: '4242 4242 4242 4242',
                        required: true,
                        icon: CardStackIcon,
                        colSpan: 'full' as const,
                    },
                    {
                        id: 'card-name',
                        name: 'cardName',
                        label: 'Name on Card',
                        type: 'text' as const,
                        placeholder: 'John Doe',
                        required: true,
                        icon: PersonIcon,
                        colSpan: 'full' as const,
                    },
                    {
                        id: 'expiry',
                        name: 'expiry',
                        label: 'Expiry Date',
                        type: 'text' as const,
                        placeholder: 'MM/YY',
                        required: true,
                        icon: CalendarIcon,
                        colSpan: 'half' as const,
                    },
                    {
                        id: 'cvv',
                        name: 'cvv',
                        label: 'CVV',
                        type: 'password' as const,
                        placeholder: '123',
                        required: true,
                        icon: LockClosedIcon,
                        colSpan: 'half' as const,
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
                        type: 'checkbox' as const,
                        placeholder: 'I agree to the terms and conditions',
                        required: true,
                        defaultValue: false,
                        icon: CheckboxIcon,
                        colSpan: 'full' as const,
                    },
                    {
                        id: 'save-info',
                        name: 'saveInfo',
                        label: 'Save payment information for future purchases',
                        type: 'checkbox' as const,
                        placeholder: 'Save payment information',
                        required: false,
                        defaultValue: false,
                        icon: StarIcon,
                        colSpan: 'full' as const,
                    },
                ],
            },
        ];

        return (
            <MultiStepForm
                steps={paymentSteps}
                onSubmit={(data) => console.log('Payment submitted:', data)}
                variant="gradient"
                animationVariant="slideLeft"
                inputVariant="shimmer"
                buttonVariant="success"
            >
                <MultiStepHeader
                    titleVariant="h3"
                    title="Checkout"
                    icon={<CardStackIcon className="text-white" />}
                    titleClassName="text-4xl font-bold"
                    iconSize={30}
                    iconClassName="w-13 h-13"
                />
                <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <MultiStepStepIndicator />
                </div>
                <MultiStepContent>
                    <Step step={1}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {paymentSteps[0].fields.map(field => (
                                <div
                                    key={field.id}
                                    className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                                >
                                    <MultiStepField field={field} />
                                </div>
                            ))}
                        </div>
                    </Step>

                    <Step step={2}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {paymentSteps[1].fields.map(field => (
                                <div
                                    key={field.id}
                                    className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                                >
                                    <MultiStepField field={field} />
                                </div>
                            ))}
                        </div>
                    </Step>

                    <Step step={3}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {paymentSteps[2].fields.map(field => (
                                <div
                                    key={field.id}
                                    className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                                >
                                    <MultiStepField field={field} />
                                </div>
                            ))}
                        </div>
                    </Step>

                    <MultiStepReview />
                </MultiStepContent>
                <MultiStepNavigation submitButtonLabel="Pay Now" />
            </MultiStepForm>
        );
    },
    name: "5.1 Payment Form",
};

export const PremiumMembership: Story = {
    render: () => {
        const membershipSteps = [
            {
                id: 'account',
                title: 'Account Setup',
                description: 'Create your premium account',
                fields: [
                    {
                        id: 'email',
                        name: 'email',
                        label: 'Email Address',
                        type: 'email' as const,
                        placeholder: 'your@email.com',
                        required: true,
                        icon: EnvelopeClosedIcon,
                        colSpan: 'full' as const,
                    },
                    {
                        id: 'password',
                        name: 'password',
                        label: 'Password',
                        type: 'password' as const,
                        placeholder: 'Create a strong password',
                        required: true,
                        icon: LockClosedIcon,
                        colSpan: 'full' as const,
                    },
                ],
            },
            {
                id: 'plan',
                title: 'Choose Your Plan',
                description: 'Select the perfect plan for you',
                fields: [
                    {
                        id: 'plan-type',
                        name: 'planType',
                        label: 'Membership Plan',
                        type: 'radio' as const,
                        required: true,
                        options: [
                            { value: 'basic', label: 'Basic - $9.99/month' },
                            { value: 'pro', label: 'Pro - $19.99/month' },
                            { value: 'enterprise', label: 'Enterprise - $49.99/month' },
                        ],
                        icon: RadiobuttonIcon,
                        colSpan: 'full' as const,
                    },
                    {
                        id: 'billing-cycle',
                        name: 'billingCycle',
                        label: 'Billing Cycle',
                        type: 'radio' as const,
                        required: true,
                        options: [
                            { value: 'monthly', label: 'Monthly' },
                            { value: 'yearly', label: 'Yearly (Save 20%)' },
                        ],
                        icon: ClockIcon,
                        colSpan: 'full' as const,
                    },
                ],
            },
            {
                id: 'payment',
                title: 'Payment Information',
                description: 'Enter your payment details',
                fields: [
                    {
                        id: 'card-number',
                        name: 'cardNumber',
                        label: 'Card Number',
                        type: 'text' as const,
                        placeholder: '4242 4242 4242 4242',
                        required: true,
                        icon: CardStackIcon,
                        colSpan: 'full' as const,
                    },
                    {
                        id: 'expiry',
                        name: 'expiry',
                        label: 'Expiry Date',
                        type: 'text' as const,
                        placeholder: 'MM/YY',
                        required: true,
                        icon: CalendarIcon,
                        colSpan: 'half' as const,
                    },
                    {
                        id: 'cvv',
                        name: 'cvv',
                        label: 'CVV',
                        type: 'password' as const,
                        placeholder: '123',
                        required: true,
                        icon: LockClosedIcon,
                        colSpan: 'half' as const,
                    },
                ],
            },
        ];

        return (
            <MultiStepForm
                steps={membershipSteps}
                onSubmit={(data) => console.log('Membership submitted:', data)}
                variant="gradient"
                inputVariant="borderBeam"
                buttonVariant="primary"
                buttonAnimationVariant="nina"
            >
                <MultiStepHeader
                    titleVariant="h3"
                    title="Premium Membership"
                    icon={<RocketIcon className="text-white" />}
                    titleClassName="text-4xl font-bold"
                    iconSize={30}
                    iconClassName="w-13 h-13"
                />
                <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <MultiStepStepIndicator />
                </div>
                <MultiStepContent>
                    <Step step={1}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {membershipSteps[0].fields.map(field => (
                                <div
                                    key={field.id}
                                    className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                                >
                                    <MultiStepField field={field} />
                                </div>
                            ))}
                        </div>
                    </Step>

                    <Step step={2}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {membershipSteps[1].fields.map(field => (
                                <div
                                    key={field.id}
                                    className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                                >
                                    <MultiStepField field={field} />
                                </div>
                            ))}
                        </div>
                    </Step>

                    <Step step={3}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {membershipSteps[2].fields.map(field => (
                                <div
                                    key={field.id}
                                    className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                                >
                                    <MultiStepField field={field} />
                                </div>
                            ))}
                        </div>
                    </Step>

                    <MultiStepReview />
                </MultiStepContent>
                <MultiStepNavigation submitButtonLabel="Upgrade Now" />
            </MultiStepForm>
        );
    },
    name: "5.2 Premium Membership",
};

/* ============================================
   STATE VARIATIONS
============================================ */

export const LoadingState: Story = {
    render: () => (
        <MultiStepForm
            steps={onboardingSteps}
            onSubmit={(data) => console.log('Form submitted:', data)}
            isLoading={true}
        >
            <MultiStepHeader
                titleVariant="h3"
                title="Onboarding Wizard"
                icon={<LightningBoltIcon className="text-white" />}
                titleClassName="text-3xl font-bold"
                iconSize={24}
                iconClassName="w-12 h-12"
            />
            <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <MultiStepStepIndicator />
            </div>
            <MultiStepContent>
                <Step step={1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[0].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={2}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[1].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={3}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[2].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <MultiStepReview />
            </MultiStepContent>
            <MultiStepNavigation />
        </MultiStepForm>
    ),
    name: "6.1 Loading State",
};

export const SubmittingState: Story = {
    render: () => (
        <MultiStepForm
            steps={onboardingSteps}
            onSubmit={(data) => console.log('Form submitted:', data)}
            isSubmitting={true}
        >
            <MultiStepHeader
                titleVariant="h3"
                title="Onboarding Wizard"
                icon={<LightningBoltIcon className="text-white" />}
                titleClassName="text-3xl font-bold"
                iconSize={24}
                iconClassName="w-12 h-12"
            />
            <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <MultiStepStepIndicator />
            </div>
            <MultiStepContent>
                <Step step={1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[0].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={2}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[1].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={3}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[2].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <MultiStepReview />
            </MultiStepContent>
            <MultiStepNavigation />
        </MultiStepForm>
    ),
    name: "6.2 Submitting State",
};

/* ============================================
   CUSTOM CONTENT
============================================ */

export const CustomHeader: Story = {
    render: () => (
        <MultiStepForm
            steps={onboardingSteps}
            onSubmit={(data) => console.log('Form submitted:', data)}
        >
            <MultiStepHeader>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <RocketIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <Typography variant="h6" weight="bold">Custom Header</Typography>
                        <Typography variant="small" color="muted">With gradient icon</Typography>
                    </div>
                </div>
            </MultiStepHeader>
            <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <MultiStepStepIndicator />
            </div>
            <MultiStepContent>
                <Step step={1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[0].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={2}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[1].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={3}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[2].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <MultiStepReview />
            </MultiStepContent>
            <MultiStepNavigation />
        </MultiStepForm>
    ),
    name: "7.1 Custom Header",
};

export const CustomReview: Story = {
    render: () => (
        <MultiStepForm
            steps={onboardingSteps}
            onSubmit={(data) => console.log('Form submitted:', data)}
            initialData={{
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                role: "developer",
                experience: "intermediate",
                emailNotifications: true,
                newsletter: true,
                contactMethod: "email",
            }}
        >
            <MultiStepHeader
                titleVariant="h3"
                title="Onboarding Wizard"
                icon={<LightningBoltIcon className="text-white" />}
                titleClassName="text-3xl font-bold"
                iconSize={24}
                iconClassName="w-12 h-12"
            />
            <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <MultiStepStepIndicator />
            </div>
            <MultiStepContent>
                <Step step={1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[0].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={2}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[1].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={3}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[2].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <MultiStepReview>
                    <div className="space-y-4">
                        <div className="text-center">
                            <CheckCircledIcon className="w-16 h-16 text-green-500 mx-auto" />
                            <Typography variant="h3" weight="bold" className="mt-4">
                                Almost There!
                            </Typography>
                            <Typography variant="body" color="muted">
                                Please review your information before submitting.
                            </Typography>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <Typography variant="body" weight="medium">
                                Summary:
                            </Typography>
                            <ul className="mt-2 space-y-1">
                                <li>• Name: John Doe</li>
                                <li>• Email: john@example.com</li>
                                <li>• Role: Developer</li>
                                <li>• Experience: Intermediate</li>
                            </ul>
                        </div>
                    </div>
                </MultiStepReview>
            </MultiStepContent>
            <MultiStepNavigation />
        </MultiStepForm>
    ),
    name: "7.2 Custom Review Section",
};

/* ============================================
   RESPONSIVE VIEWS
============================================ */

export const MobileView: Story = {
    parameters: {
        viewport: {
            defaultViewport: "mobile1",
        },
    },
    render: () => (
        <MultiStepForm
            steps={onboardingSteps}
            onSubmit={(data) => console.log('Form submitted:', data)}
        >
            <MultiStepHeader
                titleVariant="h3"
                title="Mobile View"
                icon={<LightningBoltIcon className="text-white" />}
                titleClassName="text-2xl font-bold"
                iconSize={20}
                iconClassName="w-10 h-10"
            />
            <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <MultiStepStepIndicator />
            </div>
            <MultiStepContent>
                <Step step={1}>
                    <div className="grid grid-cols-1 gap-6">
                        {onboardingSteps[0].fields.map(field => (
                            <MultiStepField key={field.id} field={field} />
                        ))}
                    </div>
                </Step>

                <Step step={2}>
                    <div className="grid grid-cols-1 gap-6">
                        {onboardingSteps[1].fields.map(field => (
                            <MultiStepField key={field.id} field={field} />
                        ))}
                    </div>
                </Step>

                <Step step={3}>
                    <div className="grid grid-cols-1 gap-6">
                        {onboardingSteps[2].fields.map(field => (
                            <MultiStepField key={field.id} field={field} />
                        ))}
                    </div>
                </Step>

                <MultiStepReview />
            </MultiStepContent>
            <MultiStepNavigation />
        </MultiStepForm>
    ),
    name: "8.1 Mobile View",
};

export const TabletView: Story = {
    parameters: {
        viewport: {
            defaultViewport: "tablet",
        },
    },
    render: () => (
        <MultiStepForm
            steps={onboardingSteps}
            onSubmit={(data) => console.log('Form submitted:', data)}
        >
            <MultiStepHeader
                titleVariant="h3"
                title="Tablet View"
                icon={<LightningBoltIcon className="text-white" />}
                titleClassName="text-3xl font-bold"
                iconSize={24}
                iconClassName="w-12 h-12"
            />
            <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <MultiStepStepIndicator />
            </div>
            <MultiStepContent>
                <Step step={1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[0].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={2}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[1].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <Step step={3}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {onboardingSteps[2].fields.map(field => (
                            <div
                                key={field.id}
                                className={field.colSpan === 'full' ? 'md:col-span-2' : ''}
                            >
                                <MultiStepField field={field} />
                            </div>
                        ))}
                    </div>
                </Step>

                <MultiStepReview />
            </MultiStepContent>
            <MultiStepNavigation />
        </MultiStepForm>
    ),
    name: "8.2 Tablet View",
};