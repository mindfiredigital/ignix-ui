import React, { useState, useEffect } from 'react';
import {
    TeamProfiles,
    TeamHeader,
    TeamGrid,
    MemberCard,
    MemberPhoto,
    MemberContent,
    MemberName,
    MemberRole,
    MemberDepartment,
    MemberLocation,
    MemberBio,
    MemberJoinDate,
    MemberExpertise,
    MemberAwards,
    MemberSocialLinks,
    MemberCardOverlay,
    TeamFooter,
    type TeamMember,
} from '../UI/team-profiles';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import VariantSelector from './VariantSelector';
import { useColorMode } from '@docusaurus/theme-common';
import { User, UserCircle, Sparkles, Palette, Image, } from 'lucide-react';
import { cn } from '@site/src/utils/cn';
import { Typography } from '@site/src/components/UI/typography';
import { Button } from '@site/src/components/UI/button';

// Types for our variant selectors
type SectionVariant = 'default' | 'primary' | 'secondary' | 'accent' | 'muted' | 'gradient' | 'glass' | 'dark' | 'light';
type CardVariant = 'default' | 'minimal' | 'elevated' | 'bordered';
type GridColumns = '1' | '2' | '3' | '4';
type AnimationType = 'fade' | 'slide' | 'scale' | 'stagger';
type BackgroundType = 'solid' | 'gradient' | 'image';
type PhotoStyle = 'with-photos' | 'initials' | 'icons' | 'patterns';
// type ThemeType = 'light' | 'dark' | 'auto';

// Animation options array for VariantSelector
const animationTypes = [
    'fade',
    'slide',
    'scale',
    'stagger'
] as const;

// Column options
const columnOptions = [
    // { value: '1', label: '1 Column' },
    { value: '2', label: '2 Columns' },
    { value: '3', label: '3 Columns' },
    { value: '4', label: '4 Columns' },
];

// Card variant options with labels
const cardVariantOptions = [
    { value: 'default', label: 'Default' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'elevated', label: 'Elevated' },
    { value: 'bordered', label: 'Bordered' },
];

// Section theme options
const sectionThemeOptions = [
    { value: 'default', label: 'Default' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'accent', label: 'Accent' },
    { value: 'muted', label: 'Muted' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'glass', label: 'Glass' },
];

// Photo style options
const photoStyleOptions = [
    { value: 'with-photos', label: 'With Photos', icon: User },
    { value: 'initials', label: 'Initials', icon: User },
    { value: 'icons', label: 'Icons', icon: UserCircle },
    { value: 'patterns', label: 'Patterns', icon: Sparkles },
];

// Background type options
const backgroundOptions = [
    { value: 'solid', label: 'Solid', icon: Palette },
    { value: 'gradient', label: 'Gradient', icon: Palette },
    { value: 'image', label: 'Image', icon: Image },
];

// Sample team data
const sampleTeamMembers: TeamMember[] = [
    {
        id: "1",
        name: "Alex Chen",
        role: "CEO & Co-Founder",
        bio: "Former tech lead with 10+ years of experience in building scalable platforms. Passionate about innovation and team culture.",
        photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        photoAlt: "Alex Chen - CEO",
        department: "Executive Leadership",
        location: "San Francisco, CA",
        expertise: ["Product Strategy", "Leadership", "Venture Capital"],
        awards: ["Forbes 30 Under 30", "Tech Innovator Award 2023"],
        joinDate: "2020",
        socialLinks: [
            { platform: "linkedin", url: "https://linkedin.com/in/alexchen", label: "LinkedIn" },
            { platform: "twitter", url: "https://twitter.com/alexchen", label: "Twitter" },
        ],
    },
    {
        id: "2",
        name: "Sarah Johnson",
        role: "CTO",
        bio: "Full-stack architect specializing in cloud infrastructure and AI/ML implementations. Led engineering teams at Fortune 500 companies.",
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        photoAlt: "Sarah Johnson - CTO",
        department: "Engineering",
        location: "New York, NY",
        expertise: ["Cloud Architecture", "AI/ML", "System Design"],
        awards: ["Women in Tech Leader 2023", "Patent Holder - ML Systems"],
        joinDate: "2021",
        socialLinks: [
            { platform: "linkedin", url: "https://linkedin.com/in/sarahjohnson", label: "LinkedIn" },
            { platform: "github", url: "https://github.com/sarahj", label: "GitHub" },
        ],
    },
    {
        id: "3",
        name: "Michael Rodriguez",
        role: "Head of Design",
        bio: "Award-winning designer with a passion for creating intuitive and beautiful user experiences. Previously led design at major tech companies.",
        photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        photoAlt: "Michael Rodriguez - Head of Design",
        department: "Design",
        location: "Austin, TX",
        expertise: ["UX Strategy", "Design Systems", "Product Design"],
        awards: ["Awwwards Site of the Year", "Red Dot Design Award"],
        joinDate: "2022",
        socialLinks: [
            { platform: "linkedin", url: "https://linkedin.com/in/michaelr", label: "LinkedIn" },
            { platform: "website", url: "https://michaeldesign.com", label: "Portfolio" },
            { platform: "twitter", url: "https://twitter.com/michaelr", label: "Twitter" },
        ],
    },
    {
        id: "4",
        name: "Emily Zhang",
        role: "Lead Product Manager",
        bio: "Strategic product leader with expertise in B2B and B2C products. MBA graduate with a focus on product-market fit.",
        photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        photoAlt: "Emily Zhang - Lead PM",
        department: "Product",
        location: "Seattle, WA",
        expertise: ["Product Strategy", "User Research", "Agile"],
        awards: ["Product Leader of the Year 2023"],
        joinDate: "2021",
        socialLinks: [
            { platform: "linkedin", url: "https://linkedin.com/in/emilyz", label: "LinkedIn" },
            { platform: "email", url: "mailto:emily@company.com", label: "Email" },
        ],
    },
];

// Helper function to render photo based on style
const renderMemberPhoto = (member: TeamMember, photoStyle: PhotoStyle) => {
    const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    if (photoStyle === 'with-photos' && member.photo) {
        return (
            <MemberPhoto
                src={member.photo}
                alt={member.photoAlt || member.name}
                initials={initials}
            />
        );
    }

    switch (photoStyle) {
        case 'initials': {
            const colors = [
                'from-blue-500 to-cyan-500',
                'from-purple-500 to-pink-500',
                'from-green-500 to-emerald-500',
                'from-orange-500 to-red-500',
            ];
            const colorIndex = member.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;

            return (
                <div className={cn(
                    "relative aspect-square overflow-hidden",
                    "bg-gradient-to-br",
                    colors[colorIndex]
                )}>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Typography variant="h1" weight="bold" className="text-white text-4xl">
                            {initials}
                        </Typography>
                    </div>
                </div>
            );
        }
        case 'icons': {
            const iconColors = [
                'from-blue-100 to-blue-200 text-blue-400',
                'from-purple-100 to-purple-200 text-purple-400',
                'from-green-100 to-green-200 text-green-400',
                'from-orange-100 to-orange-200 text-orange-400',
            ];
            const iconIndex = member.name.length % iconColors.length;

            return (
                <div className={cn(
                    "relative aspect-square overflow-hidden bg-gradient-to-br flex items-center justify-center",
                    iconColors[iconIndex].split(' ').slice(0, 2).join(' ')
                )}>
                    <UserCircle className={cn("w-20 h-20", iconColors[iconIndex].split(' ')[2])} />
                </div>
            );
        }
        case 'patterns': {
            const patterns = [
                'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)',
                'repeating-linear-gradient(90deg, transparent, transparent 15px, rgba(0,0,0,0.03) 15px, rgba(0,0,0,0.03) 30px)',
                'radial-gradient(circle at 20px 20px, rgba(0,0,0,0.03) 2px, transparent 2px)',
            ];
            const patternIndex = member.id.charCodeAt(0) % patterns.length;
            const bgColors = ['bg-blue-50', 'bg-purple-50', 'bg-green-50'];

            return (
                <div className={cn(
                    "relative aspect-square overflow-hidden flex items-center justify-center",
                    bgColors[patternIndex % bgColors.length]
                )}>
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{ backgroundImage: patterns[patternIndex] }}
                    />
                    <Typography variant="h2" weight="bold" className="relative z-10 text-gray-700">
                        {initials}
                    </Typography>
                </div>
            );
        }
        default:
            return (
                <MemberPhoto
                    initials={initials}
                />
            );
    }
};

// ==============================
// BASIC TEAM DEMO
// ==============================
export const BasicTeamDemo = () => {
    const { colorMode } = useColorMode();
    const [theme, setTheme] = useState<'light' | 'dark'>(colorMode === 'dark' ? 'dark' : 'light');

    // Update theme when color mode changes
    useEffect(() => {
        setTheme(colorMode === 'dark' ? 'dark' : 'light');
    }, [colorMode]);

    // Build code string
    const codeString = `import {
    TeamProfiles,
    TeamHeader,
    TeamGrid,
    MemberCard,
    MemberPhoto,
    MemberContent,
    MemberName,
    MemberRole,
    MemberBio,
    MemberSocialLinks,
} from '../UI/team-profiles';

const teamMembers = [
    {
        id: "1",
        name: "Alex Chen",
        role: "CEO & Co-Founder",
        bio: "Former tech lead with 10+ years of experience...",
        photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
        socialLinks: [
            { platform: "linkedin", url: "https://linkedin.com/in/alexchen" },
            { platform: "twitter", url: "https://twitter.com/alexchen" },
        ],
    },
    // ... more members
];

<TeamProfiles
    variant="${theme}"
    cardVariant="default"
    enableHover={true}
>
    <TeamHeader
        title="Our Core Team"
        subtitle="Meet the talented people behind our success"
    />
    <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
        {teamMembers.slice(0, 3).map((member) => (
            <MemberCard key={member.id} member={member}>
                <MemberPhoto
                    src={member.photo}
                    initials={member.name.split(' ').map(n => n[0]).join('')}
                />
                <MemberContent>
                    <MemberName>{member.name}</MemberName>
                    <MemberRole>{member.role}</MemberRole>
                    <MemberBio>{member.bio}</MemberBio>
                    <MemberSocialLinks links={member.socialLinks} />
                </MemberContent>
            </MemberCard>
        ))}
    </TeamGrid>
</TeamProfiles>`;

    return (
        <div className="space-y-4">
            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden mt-4">
                        <TeamProfiles
                            key={`basic-${0}`}
                            variant={theme}
                            cardVariant={'default'}
                            enableHover={true}
                        >
                            <TeamHeader
                                title="Our Core Team"
                                subtitle="Meet the talented people behind our success"
                            />
                            <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                                {sampleTeamMembers.slice(0, 3).map((member) => (
                                    <MemberCard key={member.id} member={member}>
                                        <MemberPhoto
                                            src={member.photo}
                                            alt={member.photoAlt || member.name}
                                            initials={member.name.split(' ').map(n => n[0]).join('')}
                                        />
                                        <MemberContent>
                                            <MemberName>{member.name}</MemberName>
                                            <MemberRole>{member.role}</MemberRole>
                                            <MemberBio>{member.bio}</MemberBio>
                                            {/* {showSocial && ( */}
                                            <MemberSocialLinks
                                                links={member.socialLinks || []}
                                                memberId={member.id}
                                                memberName={member.name}
                                            />
                                            {/* )} */}
                                        </MemberContent>
                                    </MemberCard>
                                ))}
                            </TeamGrid>
                        </TeamProfiles>
                    </div>
                </TabItem>

                <TabItem value="code" label="Code">
                    <div className="mt-4">
                        <CodeBlock language="tsx" className="text-sm">
                            {codeString}
                        </CodeBlock>
                    </div>
                </TabItem>
            </Tabs>
        </div>
    );
};
export const AdvancedTeamDemo = () => {
    const { colorMode } = useColorMode();

    // Initialize section variant based on parent color mode
    const [sectionVariant, setSectionVariant] = useState<SectionVariant>(
        colorMode === 'dark' ? 'dark' : 'light'
    );
    const [cardVariant, setCardVariant] = useState<CardVariant>('elevated');
    const [columns, setColumns] = useState<GridColumns>('3');
    const [photoStyle, setPhotoStyle] = useState<PhotoStyle>('with-photos');
    const [animationType, setAnimationType] = useState<AnimationType>('stagger');
    const [backgroundType, setBackgroundType] = useState<BackgroundType>('solid');

    // Track if user has manually changed the theme
    const [userChangedTheme, setUserChangedTheme] = useState<boolean>(false);

    // Feature toggles
    const [enableModal, setEnableModal] = useState<boolean>(true);
    const [enableHover, setEnableHover] = useState<boolean>(true);
    const [animate, setAnimate] = useState<boolean>(true);
    const [showExpertise, setShowExpertise] = useState<boolean>(false);
    const [showAwards, setShowAwards] = useState<boolean>(false);
    const [showDepartment, setShowDepartment] = useState<boolean>(false);
    const [showLocation, setShowLocation] = useState<boolean>(false);
    const [showJoinDate, setShowJoinDate] = useState<boolean>(false);

    const [animationKey, setAnimationKey] = useState<number>(0);

    // Background image URL
    const backgroundImage = "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";

    // Update theme when color mode changes, but only if user hasn't manually changed it
    useEffect(() => {
        if (!userChangedTheme) {
            setSectionVariant(colorMode === 'dark' ? 'dark' : 'light');
        }
    }, [colorMode, userChangedTheme]);

    // Force remount when animation type changes
    useEffect(() => {
        setAnimationKey((k) => k + 1);
    }, [animationType, sectionVariant, cardVariant, columns, photoStyle, backgroundType]);

    // Handle theme change from dropdown
    const handleThemeChange = (value: string) => {
        setSectionVariant(value as SectionVariant);
        setUserChangedTheme(true); // Mark that user has manually changed the theme
    };

    // Prepare props based on current state
    const teamProps: any = {
        variant: sectionVariant,
        cardVariant,
        enableModal,
        enableHover,
    };

    if (animate) {
        teamProps.animate = true;
        teamProps.animationType = animationType;
    }

    if (backgroundType === 'image') {
        teamProps.backgroundType = 'image';
        teamProps.backgroundImage = backgroundImage;
    } else if (backgroundType === 'gradient') {
        teamProps.backgroundType = 'gradient';
        teamProps.gradientFrom = '#3b82f6';
        teamProps.gradientTo = '#8b5cf6';
    }

    // Build code string
    const buildCodeString = () => {
        const props = [
            `variant="${sectionVariant}"`,
            `cardVariant="${cardVariant}"`,
            enableModal && `enableModal={true}`,
            enableHover && `enableHover={true}`,
            animate && `animate={true}`,
            animate && `animationType="${animationType}"`,
            backgroundType === 'image' && `backgroundType="image"\n    backgroundImage="${backgroundImage}"`,
            backgroundType === 'gradient' && `backgroundType="gradient"\n    gradientFrom="#3b82f6"\n    gradientTo="#8b5cf6"`,
        ].filter(Boolean);

        const photoCode = photoStyle === 'with-photos'
            ? `<MemberPhoto src={member.photo} initials={member.name.split(' ').map(n => n[0]).join('')} />`
            : photoStyle === 'initials'
                ? `<div className="aspect-square bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Typography variant="h1" className="text-white text-4xl">
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </Typography>
                </div>`
                : photoStyle === 'icons'
                    ? `<div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <UserCircle className="w-20 h-20 text-blue-400" />
                </div>`
                    : `<div className="aspect-square bg-blue-50 flex items-center justify-center relative">
                    <div className="absolute inset-0 opacity-30" style={{ 
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)' 
                    }} />
                    <Typography variant="h2" className="relative z-10 text-gray-700">
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </Typography>
                </div>`;

        return `import {
    TeamProfiles,
    TeamHeader,
    TeamGrid,
    MemberCard,
    MemberPhoto,
    MemberContent,
    MemberName,
    MemberRole,
    MemberDepartment,
    MemberLocation,
    MemberBio,
    MemberJoinDate,
    MemberExpertise,
    MemberAwards,
    MemberSocialLinks,
    MemberCardOverlay,
    TeamFooter,
} from '../UI/team-profiles';
import { UserCircle } from 'lucide-react';
import { Typography } from '../../components/typography';
import { Button } from '../../components/button';

<TeamProfiles
    ${props.join('\n    ')}
>
    <TeamHeader
        title="Our Leadership Team"
        subtitle="Experienced professionals driving our vision forward"
    />
    
    <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: ${columns} }}>
        {teamMembers.map((member) => (
            <MemberCard key={member.id} member={member}>
                ${photoCode.replace(/\n/g, '\n                ')}
                
                <MemberContent>
                    <MemberName>{member.name}</MemberName>
                    <MemberRole>{member.role}</MemberRole>
                    
                    ${showDepartment ? '<MemberDepartment>{member.department}</MemberDepartment>' : ''}
                    ${showLocation ? '<MemberLocation>{member.location}</MemberLocation>' : ''}
                    
                    <MemberBio>{member.bio}</MemberBio>
                    
                    ${showExpertise ? '<MemberExpertise items={member.expertise} />' : ''}
                    ${showAwards ? '<MemberAwards items={member.awards} limit={2} />' : ''}
                    ${showJoinDate ? '<MemberJoinDate>{member.joinDate}</MemberJoinDate>' : ''}
                    
                    <MemberSocialLinks links={member.socialLinks} />
                </MemberContent>
                
                ${enableModal ? `<MemberCardOverlay>
                    <Button variant="ghost" size="sm" className="text-white border-white hover:bg-white/20">
                        View Full Profile
                    </Button>
                </MemberCardOverlay>` : ''}
            </MemberCard>
        ))}
    </TeamGrid>
    
    <TeamFooter>
        <div className="text-center mt-8">
            <Button variant="primary" size="lg">
                Meet the Full Team
            </Button>
        </div>
    </TeamFooter>
</TeamProfiles>`;
    };

    return (
        <div className="space-y-4">
            {/* Theme indicator and reset button */}


            {/* First row of controls - Using VariantSelector */}
            <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
                <div className="space-y-2">
                    <VariantSelector
                        variants={sectionThemeOptions.map(o => o.value)}
                        selectedVariant={sectionVariant}
                        onSelectVariant={handleThemeChange}
                        type="Section Theme"
                    // variantLabels={Object.fromEntries(sectionThemeOptions.map(o => [o.value, o.label]))}
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={cardVariantOptions.map(o => o.value)}
                        selectedVariant={cardVariant}
                        onSelectVariant={(value) => setCardVariant(value as CardVariant)}
                        type="Card Style"
                    // variantLabels={Object.fromEntries(cardVariantOptions.map(o => [o.value, o.label]))}
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={columnOptions.map(o => o.value)}
                        selectedVariant={columns}
                        onSelectVariant={(value) => setColumns(value as GridColumns)}
                        type="Columns"
                    // variantLabels={Object.fromEntries(columnOptions.map(o => [o.value, o.label]))}
                    />
                </div>
            </div>

            {/* Second row of controls */}
            <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
                <div className="space-y-2">
                    <VariantSelector
                        variants={photoStyleOptions.map(o => o.value)}
                        selectedVariant={photoStyle}
                        onSelectVariant={(value) => setPhotoStyle(value as PhotoStyle)}
                        type="Photo Style"
                    // variantLabels={Object.fromEntries(photoStyleOptions.map(o => [o.value, o.label]))}
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={animationTypes as unknown as string[]}
                        selectedVariant={animationType}
                        onSelectVariant={(value) => setAnimationType(value as AnimationType)}
                        type="Animation"
                    // variantLabels={{
                    //     'fade': 'Fade',
                    //     'slide': 'Slide',
                    //     'scale': 'Scale',
                    //     'stagger': 'Stagger'
                    // }}
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={backgroundOptions.map(o => o.value)}
                        selectedVariant={backgroundType}
                        onSelectVariant={(value) => setBackgroundType(value as BackgroundType)}
                        type="Background"
                    // variantLabels={Object.fromEntries(backgroundOptions.map(o => [o.value, o.label]))}
                    />
                </div>
            </div>

            {/* Checkbox controls */}
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 p-4 bg-gray-100 dark:${colorMode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`}>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={enableModal}
                        onChange={(e) => setEnableModal(e.target.checked)}
                        className="rounded"
                    />
                    <span className="text-sm">Modal View</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={enableHover}
                        onChange={(e) => setEnableHover(e.target.checked)}
                        className="rounded"
                    />
                    <span className="text-sm">Hover Effects</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={animate}
                        onChange={(e) => setAnimate(e.target.checked)}
                        className="rounded"
                    />
                    <span className="text-sm">Animations</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showExpertise}
                        onChange={(e) => setShowExpertise(e.target.checked)}
                        className="rounded"
                    />
                    <span className="text-sm">Expertise Tags</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showAwards}
                        onChange={(e) => setShowAwards(e.target.checked)}
                        className="rounded"
                    />
                    <span className="text-sm">Awards</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showDepartment}
                        onChange={(e) => setShowDepartment(e.target.checked)}
                        className="rounded"
                    />
                    <span className="text-sm">Department</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showLocation}
                        onChange={(e) => setShowLocation(e.target.checked)}
                        className="rounded"
                    />
                    <span className="text-sm">Location</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showJoinDate}
                        onChange={(e) => setShowJoinDate(e.target.checked)}
                        className="rounded"
                    />
                    <span className="text-sm">Join Date</span>
                </label>
            </div>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden mt-4">
                        <TeamProfiles
                            key={`advanced-${animationKey}`}
                            {...teamProps}
                        >
                            <TeamHeader
                                title="Our Leadership Team"
                                subtitle="Experienced professionals driving our vision forward"
                            />
                            <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: parseInt(columns) as 1 | 2 | 3 | 4 }}>
                                {sampleTeamMembers.slice(0, parseInt(columns) * 2).map((member) => (
                                    <MemberCard key={member.id} member={member}>
                                        {renderMemberPhoto(member, photoStyle)}
                                        <MemberContent>
                                            <MemberName>{member.name}</MemberName>
                                            <MemberRole>{member.role}</MemberRole>

                                            {showDepartment && member.department && (
                                                <MemberDepartment>{member.department}</MemberDepartment>
                                            )}

                                            {showLocation && member.location && (
                                                <MemberLocation>{member.location}</MemberLocation>
                                            )}

                                            <MemberBio>{member.bio}</MemberBio>

                                            {showExpertise && member.expertise && (
                                                <MemberExpertise items={member.expertise} />
                                            )}

                                            {showAwards && member.awards && (
                                                <MemberAwards items={member.awards} limit={2} />
                                            )}

                                            {showJoinDate && member.joinDate && (
                                                <MemberJoinDate>{member.joinDate}</MemberJoinDate>
                                            )}

                                            <MemberSocialLinks
                                                links={member.socialLinks || []}
                                                memberId={member.id}
                                                memberName={member.name}
                                            />
                                        </MemberContent>

                                        {enableModal && (
                                            <MemberCardOverlay>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-white border-white hover:bg-white/20"
                                                >
                                                    View Full Profile
                                                </Button>
                                            </MemberCardOverlay>
                                        )}
                                    </MemberCard>
                                ))}
                            </TeamGrid>

                            <TeamFooter>
                                <div className="text-center mt-8">
                                    <Button variant="primary" size="lg">
                                        Meet the Full Team
                                    </Button>
                                </div>
                            </TeamFooter>
                        </TeamProfiles>
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
// Export both demos
// export { BasicTeamDemo, AdvancedTeamDemo };