import type { Meta, StoryObj } from "@storybook/react-vite";
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
    TeamModal,
} from ".";
import { Users, Award, MapPin } from "lucide-react";
import { User, UserCircle, UserRound, UserCircle2, Sparkles } from 'lucide-react';

import { Button } from "../../../../components/button";
import { Typography } from "../../../../components/typography";
import React from "react";
import { cn } from '../../../../../utils/cn';


const meta: Meta<typeof TeamProfiles> = {
    title: "Templates/Section/Content/Team Profiles",
    component: TeamProfiles,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "A responsive team profiles section with customizable cards, grid layouts, and theme support using compound components.",
            },
        },
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "primary", "secondary", "accent", "muted", "gradient", "glass", "dark", "light"],
            description: "Visual variant of the section",
        },
        cardVariant: {
            control: "select",
            options: ["default", "minimal", "elevated", "bordered"],
            description: "Visual style of team cards",
        },
        enableModal: {
            control: "boolean",
            description: "Enable modal view for member details",
        },
    },
};

export default meta;
type Story = StoryObj<typeof TeamProfiles>;

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
    {
        id: "5",
        name: "David Kim",
        role: "Senior Software Engineer",
        bio: "Backend specialist with deep expertise in distributed systems and microservices architecture. Open source contributor.",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        photoAlt: "David Kim - Senior Engineer",
        department: "Engineering",
        location: "Chicago, IL",
        expertise: ["Backend Systems", "Microservices", "Database Design"],
        joinDate: "2022",
        socialLinks: [
            { platform: "github", url: "https://github.com/davidk", label: "GitHub" },
            { platform: "linkedin", url: "https://linkedin.com/in/davidk", label: "LinkedIn" },
        ],
    },
    {
        id: "6",
        name: "Jessica Martinez",
        role: "Marketing Director",
        bio: "Creative marketing leader driving brand growth and customer acquisition. Expertise in digital strategy and content marketing.",
        photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        photoAlt: "Jessica Martinez - Marketing Director",
        department: "Marketing",
        location: "Los Angeles, CA",
        expertise: ["Brand Strategy", "Digital Marketing", "Content Strategy"],
        awards: ["Marketing Excellence Award 2023"],
        joinDate: "2021",
        socialLinks: [
            { platform: "linkedin", url: "https://linkedin.com/in/jessicam", label: "LinkedIn" },
            { platform: "twitter", url: "https://twitter.com/jessicam", label: "Twitter" },
        ],
    },
];

/* ============================================
   1. BASIC STORIES
============================================ */

export const Default: Story = {
    render: () => (
        <TeamProfiles
            variant="light"
            cardVariant="default"
        >
            <TeamHeader
                title="Our Leadership Team"
                subtitle="Meet the experts behind our success"
            />
            <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                {sampleTeamMembers.map((member) => (
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
                            <MemberSocialLinks
                                links={member.socialLinks || []}
                                memberId={member.id}
                                memberName={member.name}
                            />
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "1.1 Default Grid Layout",
};

export const MinimalCards: Story = {
    render: () => (
        <TeamProfiles
            variant="light"
            cardVariant="minimal"
        >
            <TeamHeader
                title="Core Team"
                subtitle="The people driving our vision forward"
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
                            {member.expertise && (
                                <MemberExpertise items={member.expertise} />
                            )}
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "1.2 Minimal Card Style",
};

export const ElevatedCards: Story = {
    render: () => (
        <TeamProfiles
            variant="light"
            cardVariant="elevated"
            enableHover={true}
        >
            <TeamHeader
                title="Meet Our Team"
                subtitle="Passionate experts dedicated to your success"
            />
            <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                {sampleTeamMembers.map((member) => (
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
                            <MemberSocialLinks
                                links={member.socialLinks || []}
                                memberId={member.id}
                                memberName={member.name}
                            />
                        </MemberContent>
                        <MemberCardOverlay />
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "1.3 Elevated Cards with Hover Effects",
};

export const BorderedCards: Story = {
    render: () => (
        <TeamProfiles
            variant="light"
            cardVariant="bordered"
        >
            <TeamHeader
                title="Leadership"
                subtitle="Experienced leaders guiding our journey"
            />
            <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                {sampleTeamMembers.slice(0, 4).map((member) => (
                    <MemberCard key={member.id} member={member}>
                        <MemberPhoto
                            src={member.photo}
                            alt={member.photoAlt || member.name}
                            initials={member.name.split(' ').map(n => n[0]).join('')}
                        />
                        <MemberContent>
                            <MemberName>{member.name}</MemberName>
                            <MemberRole>{member.role}</MemberRole>
                            {member.department && (
                                <MemberDepartment>{member.department}</MemberDepartment>
                            )}
                            {member.location && (
                                <MemberLocation>{member.location}</MemberLocation>
                            )}
                            <MemberSocialLinks
                                links={member.socialLinks || []}
                                memberId={member.id}
                                memberName={member.name}
                            />
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "1.4 Bordered Card Style",
};

/* ============================================
   2. THEME STORIES
============================================ */

export const LightTheme: Story = {
    render: () => (
        <TeamProfiles
            variant="light"
            cardVariant="default"
        >
            <TeamHeader
                title="Light Theme"
                subtitle="Clean and professional light design"
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
                            {member.expertise && (
                                <MemberExpertise items={member.expertise} />
                            )}
                            {member.location && (
                                <MemberLocation>{member.location}</MemberLocation>
                            )}
                            <MemberSocialLinks
                                links={member.socialLinks || []}
                                memberId={member.id}
                                memberName={member.name}
                            />
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "2.1 Light Theme",
};

export const DarkTheme: Story = {
    render: () => (
        <TeamProfiles
            variant="dark"
            cardVariant="elevated"
        >
            <TeamHeader
                title="Dark Theme"
                subtitle="Sophisticated dark design for modern interfaces"
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
                            {member.expertise && (
                                <MemberExpertise items={member.expertise} />
                            )}
                            {member.location && (
                                <MemberLocation>{member.location}</MemberLocation>
                            )}
                            <MemberSocialLinks
                                links={member.socialLinks || []}
                                memberId={member.id}
                                memberName={member.name}
                            />
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "2.2 Dark Theme",
};

// export const PrimaryTheme: Story = {
//     render: () => (
//         <TeamProfiles
//             variant="primary"
//             cardVariant="elevated"
//         >
//             <TeamHeader
//                 title="Primary Brand Theme"
//                 subtitle="Brand-forward design with primary colors"
//             />
//             <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
//                 {sampleTeamMembers.slice(0, 3).map((member) => (
//                     <MemberCard key={member.id} member={member}>
//                         <MemberPhoto
//                             src={member.photo}
//                             alt={member.photoAlt || member.name}
//                             initials={member.name.split(' ').map(n => n[0]).join('')}
//                         />
//                         <MemberContent>
//                             <MemberName className="text-primary-foreground">{member.name}</MemberName>
//                             <MemberRole className="text-primary-foreground/80">{member.role}</MemberRole>
//                             <MemberBio className="text-primary-foreground/70">{member.bio}</MemberBio>
//                             <MemberSocialLinks
//                                 links={member.socialLinks || []}
//                                 memberId={member.id}
//                                 memberName={member.name}
//                             />
//                         </MemberContent>
//                     </MemberCard>
//                 ))}
//             </TeamGrid>
//         </TeamProfiles>
//     ),
//     name: "2.3 Primary Theme",
// };
export const PrimaryTheme: Story = {
    render: () => (
        <TeamProfiles
            variant="primary"
            cardVariant="elevated"
        >
            <TeamHeader
                title="Primary Brand Theme"
                subtitle="Brand-forward design with primary colors"
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
                            <MemberName className="text-gray-900">{member.name}</MemberName>
                            <MemberRole className="text-gray-600">{member.role}</MemberRole>
                            <MemberBio className="text-gray-600">{member.bio}</MemberBio>
                            <MemberSocialLinks
                                links={member.socialLinks || []}
                                memberId={member.id}
                                memberName={member.name}
                            />
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "2.3 Primary Theme",
};
export const GradientTheme: Story = {
    render: () => (
        <TeamProfiles
            variant="gradient"
            cardVariant="default"
        >
            <TeamHeader
                title="Gradient Background"
                subtitle="Vibrant gradient backdrop"
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
                            <MemberName className="text-white">{member.name}</MemberName>
                            <MemberRole className="text-white/80">{member.role}</MemberRole>
                            <MemberBio className="text-white/70">{member.bio}</MemberBio>
                            <MemberSocialLinks
                                links={member.socialLinks || []}
                                memberId={member.id}
                                memberName={member.name}
                            />
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "2.4 Gradient Theme",
};

export const GlassMorphism: Story = {
    render: () => (
        <TeamProfiles
            variant="glass"
            cardVariant="default"
        >
            <TeamHeader
                title="Glass Morphism"
                subtitle="Modern glass effect with blur"
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
                            <MemberSocialLinks
                                links={member.socialLinks || []}
                                memberId={member.id}
                                memberName={member.name}
                            />
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "2.5 Glass Morphism Theme",
};

/* ============================================
   3. GRID CONFIGURATIONS
============================================ */

export const TwoColumns: Story = {
    render: () => (
        <TeamProfiles variant="light">
            <TeamHeader
                title="Two Column Layout"
                subtitle="Clean two-column grid for better focus"
            />
            <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 2 }}>
                {sampleTeamMembers.slice(0, 4).map((member) => (
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
                            <MemberSocialLinks
                                links={member.socialLinks || []}
                                memberId={member.id}
                                memberName={member.name}
                            />
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "3.1 Two Column Grid",
};

export const ThreeColumns: Story = {
    render: () => (
        <TeamProfiles variant="light">
            <TeamHeader
                title="Three Column Layout"
                subtitle="Standard three-column grid for desktop"
            />
            <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                {sampleTeamMembers.map((member) => (
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
                            <MemberSocialLinks
                                links={member.socialLinks || []}
                                memberId={member.id}
                                memberName={member.name}
                            />
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "3.2 Three Column Grid",
};

export const FourColumns: Story = {
    render: () => (
        <TeamProfiles
            variant="light"
            cardVariant="minimal"
        >
            <TeamHeader
                title="Four Column Layout"
                subtitle="Dense grid for larger teams"
            />
            <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3, wide: 4 }}>
                {[...sampleTeamMembers, ...sampleTeamMembers.slice(0, 2)].map((member, index) => (
                    <MemberCard key={`${member.id}-${index}`} member={member}>
                        <MemberPhoto
                            src={member.photo}
                            alt={member.photoAlt || member.name}
                            initials={member.name.split(' ').map(n => n[0]).join('')}
                        />
                        <MemberContent>
                            <MemberName>{member.name}</MemberName>
                            <MemberRole>{member.role}</MemberRole>
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "3.3 Four Column Grid",
};

export const WideGap: Story = {
    render: () => (
        <TeamProfiles variant="light">
            <TeamHeader
                title="Wide Spacing"
                subtitle="Extra space between cards for breathing room"
            />
            <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="xl">
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
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "3.4 Wide Gap Grid",
};

/* ============================================
   4. FEATURE CONFIGURATIONS
============================================ */

export const WithExpertiseTags: Story = {
    render: () => (
        <TeamProfiles variant="light">
            <TeamHeader
                title="Expertise Tags"
                subtitle="See team members' areas of expertise"
            />
            <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                {sampleTeamMembers.map((member) => (
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
                            {member.expertise && (
                                <MemberExpertise items={member.expertise} />
                            )}
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "4.1 With Expertise Tags",
};

export const WithDepartmentAndLocation: Story = {
    render: () => (
        <TeamProfiles variant="light">
            <TeamHeader
                title="Department & Location"
                subtitle="Additional context about team members"
            />
            <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                {sampleTeamMembers.map((member) => (
                    <MemberCard key={member.id} member={member}>
                        <MemberPhoto
                            src={member.photo}
                            alt={member.photoAlt || member.name}
                            initials={member.name.split(' ').map(n => n[0]).join('')}
                        />
                        <MemberContent>
                            <MemberName>{member.name}</MemberName>
                            <MemberRole>{member.role}</MemberRole>
                            {member.department && (
                                <MemberDepartment>{member.department}</MemberDepartment>
                            )}
                            {member.location && (
                                <MemberLocation>{member.location}</MemberLocation>
                            )}
                            <MemberBio>{member.bio}</MemberBio>
                            {member.joinDate && (
                                <MemberJoinDate>{member.joinDate}</MemberJoinDate>
                            )}
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "4.2 With Department and Location",
};

export const WithAwards: Story = {
    render: () => (
        <TeamProfiles variant="light">
            <TeamHeader
                title="Awards & Recognition"
                subtitle="Celebrating team achievements"
            />
            <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                {sampleTeamMembers.map((member) => (
                    <MemberCard key={member.id} member={member}>
                        <MemberPhoto
                            src={member.photo}
                            alt={member.photoAlt || member.name}
                            initials={member.name.split(' ').map(n => n[0]).join('')}
                        />
                        <MemberContent>
                            <MemberName>{member.name}</MemberName>
                            <MemberRole>{member.role}</MemberRole>
                            {member.awards && (
                                <MemberAwards items={member.awards} />
                            )}
                            {member.expertise && (
                                <MemberExpertise items={member.expertise} />
                            )}
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "4.3 With Awards",
};

export const MinimalInfo: Story = {
    render: () => (
        <TeamProfiles
            variant="light"
            cardVariant="minimal"
        >
            <TeamHeader
                title="Minimal Information"
                subtitle="Just the essentials - name, role, and photo"
            />
            <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                {sampleTeamMembers.map((member) => (
                    <MemberCard key={member.id} member={member}>
                        <MemberPhoto
                            src={member.photo}
                            alt={member.photoAlt || member.name}
                            initials={member.name.split(' ').map(n => n[0]).join('')}
                        />
                        <MemberContent>
                            <MemberName>{member.name}</MemberName>
                            <MemberRole>{member.role}</MemberRole>
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "4.4 Minimal Information",
};

/* ============================================
   5. ANIMATION STORIES
============================================ */

export const FadeAnimation: Story = {
    render: () => (
        <TeamProfiles
            variant="light"
            animate={true}
            animationType="fade"
            animationDelay={0.2}
        >
            <TeamHeader
                title="Fade Animation"
                subtitle="Cards fade in smoothly"
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
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "5.1 Fade Animation",
};

export const SlideAnimation: Story = {
    render: () => (
        <TeamProfiles
            variant="light"
            animate={true}
            animationType="slide"
        >
            <TeamHeader
                title="Slide Animation"
                subtitle="Cards slide up from below"
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
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "5.2 Slide Animation",
};

export const ScaleAnimation: Story = {
    render: () => (
        <TeamProfiles
            variant="light"
            animate={true}
            animationType="scale"
        >
            <TeamHeader
                title="Scale Animation"
                subtitle="Cards scale in with a bounce"
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
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "5.3 Scale Animation",
};

export const StaggerAnimation: Story = {
    render: () => (
        <TeamProfiles
            variant="light"
            animate={true}
            animationType="stagger"
        >
            <TeamHeader
                title="Stagger Animation"
                subtitle="Cards animate sequentially"
            />
            <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                {sampleTeamMembers.map((member) => (
                    <MemberCard key={member.id} member={member}>
                        <MemberPhoto
                            src={member.photo}
                            alt={member.photoAlt || member.name}
                            initials={member.name.split(' ').map(n => n[0]).join('')}
                        />
                        <MemberContent>
                            <MemberName>{member.name}</MemberName>
                            <MemberRole>{member.role}</MemberRole>
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "5.4 Stagger Animation",
};

/* ============================================
   6. BACKGROUND IMAGE STORIES
============================================ */

export const BackgroundImageLight: Story = {
    render: () => (
        <TeamProfiles
            variant="light"
            cardVariant="elevated"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        >
            <TeamHeader
                title="Background Image"
                subtitle="Team profiles with image background"
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
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "6.1 Background Image - Light Overlay",
};

export const BackgroundImageDark: Story = {
    render: () => (
        <TeamProfiles
            variant="dark"
            cardVariant="elevated"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        >
            <TeamHeader
                title="Background Image Dark"
                subtitle="Team profiles with dark overlay"
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
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "6.2 Background Image - Dark Overlay",
};

/* ============================================
   7. MODAL AND INTERACTION STORIES
============================================ */

export const WithModalView: Story = {
    render: () => (
        <TeamProfiles
            variant="light"
            cardVariant="elevated"
            enableModal={true}
        >
            <TeamHeader
                title="Click for Details"
                subtitle="Click any card to view full profile"
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
                            {member.expertise && (
                                <MemberExpertise items={member.expertise} />
                            )}
                        </MemberContent>
                        <MemberCardOverlay />
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "7.1 With Modal View",
};

export const WithCustomClickHandlers: Story = {
    render: () => (
        <TeamProfiles
            variant="light"
            cardVariant="default"
            onMemberClick={(member) => alert(`Clicked: ${member.name}`)}
            onSocialClick={(member, platform) => alert(`Opening ${platform} for ${member.name}`)}
        >
            <TeamHeader
                title="Custom Interactions"
                subtitle="Cards trigger custom actions"
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
                            <MemberSocialLinks
                                links={member.socialLinks || []}
                                memberId={member.id}
                                memberName={member.name}
                            />
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "7.2 With Custom Click Handlers",
};

export const DarkThemeModal: Story = {
    render: () => {
        const [selectedMember, setSelectedMember] = React.useState<TeamMember | null>(null);

        return (
            <>
                <TeamProfiles
                    variant="dark"
                    cardVariant="elevated"
                    enableModal={true}
                    theme="dark"
                >
                    <TeamHeader
                        title="Dark Theme Modal"
                        subtitle="Click any card to view the profile in dark mode"
                    />
                    <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                        {sampleTeamMembers.slice(0, 3).map((member) => (
                            <MemberCard
                                key={member.id}
                                member={member}
                                onClick={() => setSelectedMember(member)}
                            >
                                <MemberPhoto
                                    src={member.photo}
                                    alt={member.photoAlt || member.name}
                                    initials={member.name.split(' ').map(n => n[0]).join('')}
                                />
                                <MemberContent>
                                    <MemberName className="text-white">{member.name}</MemberName>
                                    <MemberRole className="text-gray-300">{member.role}</MemberRole>
                                    <MemberBio className="text-gray-300">{member.bio}</MemberBio>
                                    {member.expertise && (
                                        <MemberExpertise items={member.expertise} />
                                    )}
                                </MemberContent>
                                <MemberCardOverlay />
                            </MemberCard>
                        ))}
                    </TeamGrid>
                </TeamProfiles>

                {/* Dark Theme Modal */}
                {selectedMember && (
                    <TeamModal
                        isOpen={!!selectedMember}
                        onClose={() => setSelectedMember(null)}
                        member={selectedMember}
                    >
                        <div className="flex flex-col md:flex-row bg-gray-900 text-white">
                            <div className="md:w-2/5">
                                {selectedMember.photo ? (
                                    <img
                                        src={selectedMember.photo}
                                        alt={selectedMember.photoAlt || selectedMember.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                        <Typography variant="h1" weight="bold" className="text-primary">
                                            {selectedMember.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                        </Typography>
                                    </div>
                                )}
                            </div>
                            <div className="md:w-3/5 p-6">
                                <Typography variant="h2" weight="bold" className="mb-1 text-white">
                                    {selectedMember.name}
                                </Typography>
                                <Typography variant="h4" className="mb-4 text-gray-300">
                                    {selectedMember.role}
                                </Typography>

                                {selectedMember.department && (
                                    <div className="flex items-center gap-2 mb-4">
                                        <Award className="w-4 h-4 text-gray-400" />
                                        <Typography variant="body" className="text-gray-300">
                                            {selectedMember.department}
                                        </Typography>
                                    </div>
                                )}

                                {selectedMember.location && (
                                    <div className="flex items-center gap-2 mb-4">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <Typography variant="body" className="text-gray-300">
                                            {selectedMember.location}
                                        </Typography>
                                    </div>
                                )}

                                <Typography variant="body" className="mb-6 leading-relaxed text-gray-300">
                                    {selectedMember.bio}
                                </Typography>

                                {selectedMember.expertise && selectedMember.expertise.length > 0 && (
                                    <div className="mb-6">
                                        <Typography variant="small" weight="bold" className="mb-2 text-gray-200">
                                            Expertise
                                        </Typography>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedMember.expertise.map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 text-sm rounded-full bg-gray-700 text-gray-200"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedMember.awards && selectedMember.awards.length > 0 && (
                                    <div className="mb-6">
                                        <Typography variant="small" weight="bold" className="mb-2 text-gray-200">
                                            Awards
                                        </Typography>
                                        <div className="space-y-1">
                                            {selectedMember.awards.map((award, idx) => (
                                                <Typography key={idx} variant="small" className="text-gray-300">
                                                    🏆 {award}
                                                </Typography>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedMember.socialLinks && selectedMember.socialLinks.length > 0 && (
                                    <div className="flex items-center gap-3">
                                        {selectedMember.socialLinks.map((link, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => window.open(link.url, '_blank')}
                                                className="p-3 rounded-full transition-colors hover:bg-gray-600 text-gray-400 hover:text-white"
                                                aria-label={link.label || `Social link`}
                                            >
                                                <SocialIcon platform={link.platform} className="w-5 h-5" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </TeamModal>
                )}
            </>
        );
    },
    name: "7.3 Dark Theme Modal",
};

/* ============================================
   8. RESPONSIVE DEMOS
============================================ */

export const MobileView: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
    render: () => (
        <TeamProfiles variant="light">
            <TeamHeader
                title="Mobile View"
                subtitle="Optimized for small screens"
            />
            <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                {sampleTeamMembers.map((member) => (
                    <MemberCard key={member.id} member={member}>
                        <MemberPhoto
                            src={member.photo}
                            alt={member.photoAlt || member.name}
                            initials={member.name.split(' ').map(n => n[0]).join('')}
                        />
                        <MemberContent>
                            <MemberName>{member.name}</MemberName>
                            <MemberRole>{member.role}</MemberRole>
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "8.1 Mobile View",
};

export const TabletView: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'tablet',
        },
    },
    render: () => (
        <TeamProfiles variant="light">
            <TeamHeader
                title="Tablet View"
                subtitle="Optimized for medium screens"
            />
            <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                {sampleTeamMembers.map((member) => (
                    <MemberCard key={member.id} member={member}>
                        <MemberPhoto
                            src={member.photo}
                            alt={member.photoAlt || member.name}
                            initials={member.name.split(' ').map(n => n[0]).join('')}
                        />
                        <MemberContent>
                            <MemberName>{member.name}</MemberName>
                            <MemberRole>{member.role}</MemberRole>
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "8.2 Tablet View",
};

/* ============================================
   9. CUSTOM CONTENT STORIES
============================================ */

export const WithHeaderContent: Story = {
    render: () => (
        <TeamProfiles variant="light">
            <TeamHeader>
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Users className="w-6 h-6 text-primary" />
                    <Typography variant="h3" weight="bold">Dream Team</Typography>
                </div>
                <Typography variant="lead" className="text-gray-600">
                    Custom header with icon and title
                </Typography>
            </TeamHeader>
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
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "9.1 With Custom Header",
};

export const WithFooterContent: Story = {
    render: () => (
        <TeamProfiles variant="light">
            <TeamHeader
                title="Join Our Team"
                subtitle="We're always looking for talented individuals"
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
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
            <TeamFooter>
                <div className="text-center mt-8">
                    <Button variant="primary" size="lg">
                        View Open Positions
                    </Button>
                </div>
            </TeamFooter>
        </TeamProfiles>
    ),
    name: "9.2 With Footer Button",
};

export const WithChildrenContent: Story = {
    render: () => (
        <TeamProfiles variant="light">
            <div className="text-center mb-8">
                <Typography variant="h2" weight="bold" className="mb-2">
                    <span className="text-primary">Meet</span> Our Team
                </Typography>
                <Typography variant="lead" className="mb-4">
                    The people behind our success
                </Typography>
                <div className="flex justify-center gap-4 mb-8">
                    <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        <span>10+ Years Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span>Global Team</span>
                    </div>
                </div>
            </div>
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
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "9.3 With Children Content",
};

/* ============================================
   10. COMPLEX EXAMPLES
============================================ */

export const CompleteTeamSection: Story = {
    render: () => (
        <TeamProfiles
            variant="light"
            cardVariant="elevated"
            enableModal={true}
            enableHover={true}
            animate={true}
            animationType="stagger"
        >
            <TeamHeader
                title="Our Leadership Team"
                subtitle="Meet the experienced professionals driving our vision forward"
            />
            <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }}>
                {sampleTeamMembers.map((member) => (
                    <MemberCard key={member.id} member={member}>
                        <MemberPhoto
                            src={member.photo}
                            alt={member.photoAlt || member.name}
                            initials={member.name.split(' ').map(n => n[0]).join('')}
                        />
                        <MemberContent>
                            <MemberName>{member.name}</MemberName>
                            <MemberRole>{member.role}</MemberRole>
                            {member.department && (
                                <MemberDepartment>{member.department}</MemberDepartment>
                            )}
                            {member.location && (
                                <MemberLocation>{member.location}</MemberLocation>
                            )}
                            <MemberBio>{member.bio}</MemberBio>
                            {member.expertise && (
                                <MemberExpertise items={member.expertise} />
                            )}
                            {member.awards && (
                                <MemberAwards items={member.awards} />
                            )}
                            <MemberSocialLinks
                                links={member.socialLinks || []}
                                memberId={member.id}
                                memberName={member.name}
                            />
                        </MemberContent>
                        <MemberCardOverlay />
                    </MemberCard>
                ))}
            </TeamGrid>
            <TeamFooter>
                <div className="text-center mt-12">
                    <Typography variant="body" className="mb-4 text-gray-600">
                        Interested in joining our team? We're always looking for talented individuals.
                    </Typography>
                    <Button variant="primary" size="lg">
                        View Careers
                    </Button>
                </div>
            </TeamFooter>
        </TeamProfiles>
    ),
    name: "10.1 Complete Team Section",
};

export const DepartmentShowcase: Story = {
    render: () => (
        <div className="space-y-16">
            <TeamProfiles variant="light" cardVariant="elevated">
                <TeamHeader
                    title="Executive Leadership"
                    subtitle="Guiding our company vision and strategy"
                />
                <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                    {sampleTeamMembers.filter(m => m.department === "Executive Leadership").map((member) => (
                        <MemberCard key={member.id} member={member}>
                            <MemberPhoto
                                src={member.photo}
                                alt={member.photoAlt || member.name}
                                initials={member.name.split(' ').map(n => n[0]).join('')}
                            />
                            <MemberContent>
                                <MemberName>{member.name}</MemberName>
                                <MemberRole>{member.role}</MemberRole>
                                {member.awards && (
                                    <MemberAwards items={member.awards} />
                                )}
                            </MemberContent>
                        </MemberCard>
                    ))}
                </TeamGrid>
            </TeamProfiles>

            <TeamProfiles variant="muted" cardVariant="default">
                <TeamHeader
                    title="Engineering Team"
                    subtitle="Building the technology that powers our platform"
                />
                <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                    {sampleTeamMembers.filter(m => m.department === "Engineering").map((member) => (
                        <MemberCard key={member.id} member={member}>
                            <MemberPhoto
                                src={member.photo}
                                alt={member.photoAlt || member.name}
                                initials={member.name.split(' ').map(n => n[0]).join('')}
                            />
                            <MemberContent>
                                <MemberName>{member.name}</MemberName>
                                <MemberRole>{member.role}</MemberRole>
                                {member.expertise && (
                                    <MemberExpertise items={member.expertise} />
                                )}
                            </MemberContent>
                        </MemberCard>
                    ))}
                </TeamGrid>
            </TeamProfiles>

            <TeamProfiles variant="light" cardVariant="minimal">
                <TeamHeader
                    title="Product Team"
                    subtitle="Creating experiences our users love"
                />
                <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                    {sampleTeamMembers.filter(m => m.department === "Product").map((member) => (
                        <MemberCard key={member.id} member={member}>
                            <MemberPhoto
                                src={member.photo}
                                alt={member.photoAlt || member.name}
                                initials={member.name.split(' ').map(n => n[0]).join('')}
                            />
                            <MemberContent>
                                <MemberName>{member.name}</MemberName>
                                <MemberRole>{member.role}</MemberRole>
                            </MemberContent>
                        </MemberCard>
                    ))}
                </TeamGrid>
            </TeamProfiles>
        </div>
    ),
    name: "10.2 Department Showcase",
};

export const GradientWithStats: Story = {
    render: () => (
        <TeamProfiles
            variant="gradient"
            cardVariant="elevated"
        >
            <TeamHeader>
                <div className="text-center text-white">
                    <Typography variant="h2" weight="bold" className="mb-3">
                        Our Global Team
                    </Typography>
                    <Typography variant="lead" className="mb-8 text-white/90">
                        Diverse talent from around the world
                    </Typography>
                    <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                        <div className="text-center p-4 bg-white/10 rounded-lg">
                            <Typography variant="h3" weight="bold" className="text-white">50+</Typography>
                            <Typography variant="small" className="text-white/80">Team Members</Typography>
                        </div>
                        <div className="text-center p-4 bg-white/10 rounded-lg">
                            <Typography variant="h3" weight="bold" className="text-white">15</Typography>
                            <Typography variant="small" className="text-white/80">Countries</Typography>
                        </div>
                        <div className="text-center p-4 bg-white/10 rounded-lg">
                            <Typography variant="h3" weight="bold" className="text-white">8</Typography>
                            <Typography variant="small" className="text-white/80">Languages</Typography>
                        </div>
                    </div>
                </div>
            </TeamHeader>
            <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                {sampleTeamMembers.slice(0, 3).map((member) => (
                    <MemberCard key={member.id} member={member}>
                        <MemberPhoto
                            src={member.photo}
                            alt={member.photoAlt || member.name}
                            initials={member.name.split(' ').map(n => n[0]).join('')}
                        />
                        <MemberContent>
                            <MemberName className="text-white">{member.name}</MemberName>
                            <MemberRole className="text-white/80">{member.role}</MemberRole>
                            {member.location && (
                                <MemberLocation>{member.location}</MemberLocation>
                            )}
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "10.3 Gradient Theme with Stats",
};

export const NoPhotosPlaceholder: Story = {
    render: () => {
        const teamWithoutPhotos = sampleTeamMembers.slice(0, 3).map(member => ({
            ...member,
            photo: undefined,
        }));

        return (
            <TeamProfiles variant="light" cardVariant="elevated">
                <TeamHeader
                    title="Elegant Placeholders"
                    subtitle="Beautiful initials-based avatars when photos are missing"
                />
                <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                    {teamWithoutPhotos.map((member) => {
                        const initials = member.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2);

                        // Generate a consistent color based on the member's name
                        const colors = [
                            'from-blue-500 to-cyan-500',
                            'from-purple-500 to-pink-500',
                            'from-green-500 to-emerald-500',
                            'from-orange-500 to-red-500',
                            'from-indigo-500 to-purple-500',
                            'from-pink-500 to-rose-500',
                        ];

                        const colorIndex = member.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
                        const gradientColor = colors[colorIndex];

                        return (
                            <MemberCard key={member.id} member={member}>
                                <div className={cn(
                                    "relative aspect-square overflow-hidden",
                                    "bg-gradient-to-br",
                                    gradientColor
                                )}>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Typography
                                            variant="h1"
                                            weight="bold"
                                            className="text-white text-4xl md:text-5xl opacity-90"
                                        >
                                            {initials}
                                        </Typography>
                                    </div>
                                    {/* Decorative pattern overlay */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="w-full h-full" style={{
                                            backgroundImage: `radial-gradient(circle at 30% 50%, white 1px, transparent 1px)`,
                                            backgroundSize: '20px 20px'
                                        }} />
                                    </div>
                                </div>
                                <MemberContent>
                                    <MemberName>{member.name}</MemberName>
                                    <MemberRole>{member.role}</MemberRole>
                                    <MemberBio>{member.bio}</MemberBio>
                                    {member.expertise && (
                                        <MemberExpertise items={member.expertise} />
                                    )}
                                    <MemberSocialLinks
                                        links={member.socialLinks || []}
                                        memberId={member.id}
                                        memberName={member.name}
                                    />
                                </MemberContent>
                            </MemberCard>
                        );
                    })}
                </TeamGrid>
            </TeamProfiles>
        );
    },
    name: "10.4 No Photos - Beautiful Placeholders",
};

export const MinimalistPlaceholders: Story = {
    render: () => {
        const teamWithoutPhotos = sampleTeamMembers.slice(0, 3).map(member => ({
            ...member,
            photo: undefined,
        }));

        return (
            <TeamProfiles variant="light" cardVariant="minimal">
                <TeamHeader
                    title="Minimalist Placeholders"
                    subtitle="Clean and subtle avatar placeholders"
                />
                <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                    {teamWithoutPhotos.map((member) => {
                        const initials = member.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2);

                        return (
                            <MemberCard key={member.id} member={member}>
                                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                    <Typography
                                        variant="h2"
                                        weight="semibold"
                                        className="text-gray-400 dark:text-gray-500"
                                    >
                                        {initials}
                                    </Typography>
                                </div>
                                <MemberContent>
                                    <MemberName>{member.name}</MemberName>
                                    <MemberRole>{member.role}</MemberRole>
                                </MemberContent>
                            </MemberCard>
                        );
                    })}
                </TeamGrid>
            </TeamProfiles>
        );
    },
    name: "10.5 No Photos - Minimalist Placeholders",
};

export const PatternPlaceholders: Story = {
    render: () => {
        const teamWithoutPhotos = sampleTeamMembers.slice(0, 3).map(member => ({
            ...member,
            photo: undefined,
        }));

        const patterns = [
            'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)',
            'repeating-linear-gradient(90deg, transparent, transparent 15px, rgba(0,0,0,0.03) 15px, rgba(0,0,0,0.03) 30px)',
            'radial-gradient(circle at 20px 20px, rgba(0,0,0,0.03) 2px, transparent 2px), radial-gradient(circle at 40px 40px, rgba(0,0,0,0.03) 2px, transparent 2px)',
            'repeating-linear-gradient(135deg, transparent, transparent 8px, rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.04) 16px)',
        ];

        return (
            <TeamProfiles variant="light" cardVariant="bordered">
                <TeamHeader
                    title="Pattern Placeholders"
                    subtitle="Subtle patterns add visual interest"
                />
                <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                    {teamWithoutPhotos.map((member, index) => {
                        const initials = member.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2);

                        const bgColors = [
                            'bg-blue-50',
                            'bg-purple-50',
                            'bg-green-50',
                            'bg-orange-50',
                        ];

                        return (
                            <MemberCard key={member.id} member={member}>
                                <div className={cn(
                                    "relative aspect-square overflow-hidden flex items-center justify-center",
                                    bgColors[index % bgColors.length]
                                )}>
                                    <div
                                        className="absolute inset-0 opacity-30"
                                        style={{ backgroundImage: patterns[index % patterns.length] }}
                                    />
                                    <Typography
                                        variant="h2"
                                        weight="bold"
                                        className="relative z-10 text-gray-700"
                                    >
                                        {initials}
                                    </Typography>
                                </div>
                                <MemberContent>
                                    <MemberName>{member.name}</MemberName>
                                    <MemberRole>{member.role}</MemberRole>
                                    {member.expertise && (
                                        <MemberExpertise items={member.expertise} />
                                    )}
                                </MemberContent>
                            </MemberCard>
                        );
                    })}
                </TeamGrid>
            </TeamProfiles>
        );
    },
    name: "10.6 No Photos - Pattern Placeholders",
};

export const AvatarPlaceholders: Story = {
    render: () => {
        const teamWithoutPhotos = sampleTeamMembers.slice(0, 4).map(member => ({
            ...member,
            photo: undefined,
        }));

        return (
            <TeamProfiles variant="light" cardVariant="default">
                <TeamHeader
                    title="Avatar Style Placeholders"
                    subtitle="Circular avatars with professional look"
                />
                <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }}>
                    {teamWithoutPhotos.map((member) => {
                        const initials = member.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2);

                        // Professional color palette
                        const avatarColors = [
                            'bg-indigo-100 text-indigo-700 border-indigo-200',
                            'bg-emerald-100 text-emerald-700 border-emerald-200',
                            'bg-amber-100 text-amber-700 border-amber-200',
                            'bg-rose-100 text-rose-700 border-rose-200',
                            'bg-cyan-100 text-cyan-700 border-cyan-200',
                            'bg-violet-100 text-violet-700 border-violet-200',
                        ];

                        const colorIndex = member.name.length % avatarColors.length;

                        return (
                            <MemberCard key={member.id} member={member}>
                                <div className="p-6 flex flex-col items-center">
                                    <div className={cn(
                                        "w-32 h-32 rounded-full flex items-center justify-center border-4 mb-4",
                                        avatarColors[colorIndex]
                                    )}>
                                        <Typography variant="h2" weight="bold">
                                            {initials}
                                        </Typography>
                                    </div>
                                    <MemberName className="text-center">{member.name}</MemberName>
                                    <MemberRole className="text-center">{member.role}</MemberRole>
                                </div>
                            </MemberCard>
                        );
                    })}
                </TeamGrid>
            </TeamProfiles>
        );
    },
    name: "10.7 No Photos - Avatar Style Placeholders",
};


/* ============================================
   10. NO PHOTOS - ICON PLACEHOLDERS
============================================ */

export const SimpleUserIconPlaceholders: Story = {
    render: () => {
        const teamWithoutPhotos = sampleTeamMembers.slice(0, 3).map(member => ({
            ...member,
            photo: undefined,
        }));

        return (
            <TeamProfiles variant="light" cardVariant="elevated">
                <TeamHeader
                    title="Simple User Icons"
                    subtitle="Clean and minimal user icon placeholders"
                />
                <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                    {teamWithoutPhotos.map((member) => (
                        <MemberCard key={member.id} member={member}>
                            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                                <User className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                            </div>
                            <MemberContent>
                                <MemberName>{member.name}</MemberName>
                                <MemberRole>{member.role}</MemberRole>
                                <MemberBio>{member.bio}</MemberBio>
                                <MemberSocialLinks
                                    links={member.socialLinks || []}
                                    memberId={member.id}
                                    memberName={member.name}
                                />
                            </MemberContent>
                        </MemberCard>
                    ))}
                </TeamGrid>
            </TeamProfiles>
        );
    },
    name: "10.4 Simple User Icons",
};

export const RoundedUserIcons: Story = {
    render: () => {
        const teamWithoutPhotos = sampleTeamMembers.slice(0, 3).map(member => ({
            ...member,
            photo: undefined,
        }));

        return (
            <TeamProfiles variant="light" cardVariant="minimal">
                <TeamHeader
                    title="Rounded User Icons"
                    subtitle="Friendly circular user icons"
                />
                <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                    {teamWithoutPhotos.map((member) => (
                        <MemberCard key={member.id} member={member}>
                            <div className="p-6 flex flex-col items-center">
                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 border-2 border-primary/20">
                                    <UserCircle className="w-16 h-16 text-primary/60" />
                                </div>
                                <MemberName>{member.name}</MemberName>
                                <MemberRole>{member.role}</MemberRole>
                            </div>
                        </MemberCard>
                    ))}
                </TeamGrid>
            </TeamProfiles>
        );
    },
    name: "10.5 Rounded User Icons",
};

export const UserRoundIcons: Story = {
    render: () => {
        const teamWithoutPhotos = sampleTeamMembers.slice(0, 3).map(member => ({
            ...member,
            photo: undefined,
        }));

        return (
            <TeamProfiles variant="light" cardVariant="bordered">
                <TeamHeader
                    title="User Round Icons"
                    subtitle="Modern circular silhouette icons"
                />
                <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                    {teamWithoutPhotos.map((member, index) => {
                        const colors = [
                            'from-blue-400 to-blue-600',
                            'from-purple-400 to-purple-600',
                            'from-green-400 to-green-600',
                            'from-orange-400 to-orange-600',
                        ];

                        return (
                            <MemberCard key={member.id} member={member}>
                                <div className="relative aspect-square overflow-hidden flex items-center justify-center">
                                    <div className={cn(
                                        "absolute inset-0 bg-gradient-to-br",
                                        colors[index % colors.length],
                                        "opacity-90"
                                    )} />
                                    <UserRound className="w-20 h-20 text-white relative z-10" />
                                </div>
                                <MemberContent>
                                    <MemberName>{member.name}</MemberName>
                                    <MemberRole>{member.role}</MemberRole>
                                    {member.expertise && (
                                        <MemberExpertise items={member.expertise} />
                                    )}
                                </MemberContent>
                            </MemberCard>
                        );
                    })}
                </TeamGrid>
            </TeamProfiles>
        );
    },
    name: "10.6 User Round Icons",
};

export const GroupIconPlaceholders: Story = {
    render: () => {
        const teamWithoutPhotos = sampleTeamMembers.slice(0, 3).map(member => ({
            ...member,
            photo: undefined,
        }));

        return (
            <TeamProfiles variant="light" cardVariant="elevated">
                <TeamHeader
                    title="Team Group Icons"
                    subtitle="Abstract team representation"
                />
                <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                    {teamWithoutPhotos.map((member) => (
                        <MemberCard key={member.id} member={member}>
                            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 flex items-center justify-center">
                                <Users className="w-16 h-16 text-indigo-300 dark:text-indigo-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                            </div>
                            <MemberContent>
                                <MemberName>{member.name}</MemberName>
                                <MemberRole>{member.role}</MemberRole>
                                <MemberBio>{member.bio}</MemberBio>
                            </MemberContent>
                        </MemberCard>
                    ))}
                </TeamGrid>
            </TeamProfiles>
        );
    },
    name: "10.7 Team Group Icons",
};

export const AnimatedIconPlaceholders: Story = {
    render: () => {
        const teamWithoutPhotos = sampleTeamMembers.slice(0, 3).map(member => ({
            ...member,
            photo: undefined,
        }));

        return (
            <TeamProfiles variant="light" cardVariant="elevated" animate={true}>
                <TeamHeader
                    title="Animated Icon Placeholders"
                    subtitle="Subtle hover animations on icons"
                />
                <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                    {teamWithoutPhotos.map((member) => (
                        <MemberCard key={member.id} member={member}>
                            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 flex items-center justify-center group">
                                <UserCircle2 className="w-20 h-20 text-amber-300 dark:text-amber-700 transition-all duration-300 group-hover:scale-110 group-hover:text-amber-400" />
                                <Sparkles className="absolute w-6 h-6 text-amber-200 dark:text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 top-4 right-4" />
                            </div>
                            <MemberContent>
                                <MemberName>{member.name}</MemberName>
                                <MemberRole>{member.role}</MemberRole>
                                <MemberBio>{member.bio}</MemberBio>
                            </MemberContent>
                        </MemberCard>
                    ))}
                </TeamGrid>
            </TeamProfiles>
        );
    },
    name: "10.8 Animated Icon Placeholders",
};

export const IconWithInitials: Story = {
    render: () => {
        const teamWithoutPhotos = sampleTeamMembers.slice(0, 4).map(member => ({
            ...member,
            photo: undefined,
        }));

        return (
            <TeamProfiles variant="light" cardVariant="minimal">
                <TeamHeader
                    title="Icon + Initials Combo"
                    subtitle="Combine icons with initials for clarity"
                />
                <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }}>
                    {teamWithoutPhotos.map((member) => {
                        const initials = member.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2);

                        return (
                            <MemberCard key={member.id} member={member}>
                                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                                    <div className="relative">
                                        <User className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Typography variant="small" weight="bold" className="text-gray-500 dark:text-gray-400 text-sm">
                                                {initials}
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                                <MemberContent>
                                    <MemberName>{member.name}</MemberName>
                                    <MemberRole>{member.role}</MemberRole>
                                </MemberContent>
                            </MemberCard>
                        );
                    })}
                </TeamGrid>
            </TeamProfiles>
        );
    },
    name: "10.9 Icon with Initials",
};

export const AllIconVariants: Story = {
    render: () => {
        const iconStyles = [
            { icon: User, label: "Simple User", gradient: "from-gray-100 to-gray-200", iconColor: "text-gray-400" },
            { icon: UserCircle, label: "User Circle", gradient: "from-blue-100 to-blue-200", iconColor: "text-blue-400" },
            { icon: UserRound, label: "User Round", gradient: "from-purple-100 to-purple-200", iconColor: "text-purple-400" },
            { icon: Users, label: "Team", gradient: "from-green-100 to-green-200", iconColor: "text-green-400" },
            { icon: UserCircle2, label: "User Circle 2", gradient: "from-orange-100 to-orange-200", iconColor: "text-orange-400" },
        ];

        return (
            <TeamProfiles variant="light" cardVariant="elevated">
                <TeamHeader
                    title="Icon Placeholder Gallery"
                    subtitle="Various icon styles for different aesthetics"
                />
                <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3, wide: 5 }}>
                    {iconStyles.map((style, index) => {
                        const IconComponent = style.icon;
                        return (
                            <MemberCard key={index} member={sampleTeamMembers[index % sampleTeamMembers.length]}>
                                <div className={cn(
                                    "relative aspect-square overflow-hidden bg-gradient-to-br flex items-center justify-center",
                                    style.gradient
                                )}>
                                    <IconComponent className={cn("w-20 h-20", style.iconColor)} />
                                </div>
                                <MemberContent>
                                    <MemberName>{style.label}</MemberName>
                                    <MemberRole>Placeholder Style</MemberRole>
                                    <Typography variant="small" className="text-center text-gray-500">
                                        Using {style.label} icon
                                    </Typography>
                                </MemberContent>
                            </MemberCard>
                        );
                    })}
                </TeamGrid>
            </TeamProfiles>
        );
    },
    name: "10.10 All Icon Variants",
};

/* ============================================
   11. EDGE CASES
============================================ */

export const SingleMember: Story = {
    render: () => (
        <TeamProfiles variant="light">
            <TeamHeader
                title="Single Member"
                subtitle="Works great with just one person too"
            />
            <TeamGrid columns={{ mobile: 1, tablet: 1, desktop: 1 }}>
                <MemberCard member={sampleTeamMembers[0]}>
                    <div className="flex flex-col md:flex-row">
                        <MemberPhoto
                            src={sampleTeamMembers[0].photo}
                            alt={sampleTeamMembers[0].photoAlt}
                            initials={sampleTeamMembers[0].name.split(' ').map(n => n[0]).join('')}
                            className="md:w-1/3"
                        />
                        <MemberContent className="md:w-2/3">
                            <MemberName>{sampleTeamMembers[0].name}</MemberName>
                            <MemberRole>{sampleTeamMembers[0].role}</MemberRole>
                            <MemberBio>{sampleTeamMembers[0].bio}</MemberBio>
                            <MemberSocialLinks
                                links={sampleTeamMembers[0].socialLinks || []}
                                memberId={sampleTeamMembers[0].id}
                                memberName={sampleTeamMembers[0].name}
                            />
                        </MemberContent>
                    </div>
                </MemberCard>
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "11.1 Single Team Member",
};

export const ManyMembers: Story = {
    render: () => {
        const manyMembers = Array(12).fill(null).map((_, i) => ({
            ...sampleTeamMembers[i % sampleTeamMembers.length],
            id: `extra-${i}`,
            name: `${sampleTeamMembers[i % sampleTeamMembers.length].name} ${i + 1}`,
        }));

        return (
            <TeamProfiles
                variant="light"
                cardVariant="minimal"
            >
                <TeamHeader
                    title="Large Team"
                    subtitle="Handles many members gracefully"
                />
                <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3, wide: 4 }}>
                    {manyMembers.map((member) => (
                        <MemberCard key={member.id} member={member}>
                            <MemberPhoto
                                src={member.photo}
                                alt={member.photoAlt || member.name}
                                initials={member.name.split(' ').map(n => n[0]).join('')}
                            />
                            <MemberContent>
                                <MemberName>{member.name}</MemberName>
                                <MemberRole>{member.role}</MemberRole>
                            </MemberContent>
                        </MemberCard>
                    ))}
                </TeamGrid>
            </TeamProfiles>
        );
    },
    name: "11.2 Many Team Members",
};

export const NoSocialLinks: Story = {
    render: () => {
        const teamWithoutSocial = sampleTeamMembers.slice(0, 3).map(member => ({
            ...member,
            socialLinks: [],
        }));

        return (
            <TeamProfiles variant="light">
                <TeamHeader
                    title="No Social Links"
                    subtitle="Cards adapt when social links are missing"
                />
                <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                    {teamWithoutSocial.map((member) => (
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
                            </MemberContent>
                        </MemberCard>
                    ))}
                </TeamGrid>
            </TeamProfiles>
        );
    },
    name: "11.3 No Social Links",
};

export const AllFeaturesOff: Story = {
    render: () => (
        <TeamProfiles
            variant="light"
            cardVariant="minimal"
        >
            <TeamHeader
                title="Minimal Display"
                subtitle="Just names and roles"
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
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "11.4 All Features Disabled",
};

/* ============================================
   12. ACCESSIBILITY EXAMPLES
============================================ */

export const HighContrastLight: Story = {
    render: () => (
        <TeamProfiles
            variant="light"
            cardVariant="bordered"
            backgroundColor="#ffffff"
        >
            <TeamHeader
                title="High Contrast Light"
                subtitle="Optimized for readability"
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
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "12.1 High Contrast Light",
};

export const HighContrastDark: Story = {
    render: () => (
        <TeamProfiles
            variant="dark"
            cardVariant="bordered"
            backgroundColor="#000000"
        >
            <TeamHeader
                title="High Contrast Dark"
                subtitle="Maximum readability in dark mode"
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
                            <MemberName className="text-white">{member.name}</MemberName>
                            <MemberRole className="text-gray-300">{member.role}</MemberRole>
                            <MemberBio className="text-gray-300">{member.bio}</MemberBio>
                        </MemberContent>
                    </MemberCard>
                ))}
            </TeamGrid>
        </TeamProfiles>
    ),
    name: "12.2 High Contrast Dark",
};