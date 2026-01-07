import React from 'react';
import { ProfilePage } from '@site/src/components/UI/profile'; // Adjust import path as needed
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { User, } from 'lucide-react';

export interface ProfileData {
    displayName: string;
    email: string;
    bio: string;
    avatarUrl: string | null;
    socialLinks: SocialLink[];
    location?: string;
    jobTitle?: string;
    website?: string;
    phone?: string;
}

export interface SocialLink {
    id: string;
    platform: string;
    url: string;
}

// Sample profile data
const sampleProfileData = {
    displayName: 'Alex Thompson',
    email: 'alex.thompson@example.com',
    bio: 'Product designer with 8+ years of experience creating digital experiences. Passionate about user-centered design and building products that make a difference. Currently leading design at InnovateTech.',
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
    socialLinks: [
        { id: '1', platform: 'Twitter', url: 'https://twitter.com/alexthompson' },
        { id: '2', platform: 'GitHub', url: 'https://github.com/alexthompson' },
        { id: '3', platform: 'LinkedIn', url: 'https://linkedin.com/in/alexthompson' },
        { id: '4', platform: 'Portfolio', url: 'https://alexthompson.design' },
    ],
    location: 'San Francisco, CA',
    jobTitle: 'Senior Product Designer',
    website: 'https://alexthompson.design',
    phone: '+1 (555) 123-4567',
};

const ProfilePageDemo = () => {

    const handleSave = async (data: ProfileData, avatarFile?: File): Promise<void> => {
        if (avatarFile) {
            // Handle avatar file upload
        }
        // Simulate API call
        await new Promise<void>(resolve => setTimeout(resolve, 1500));
    };


    const handleCancel = () => {
        // Handle cancel action 
    };

    const codeString = `
<ProfilePage
    variant="dark"
    darkMode={true}
    avatarShape='circle'
    avatarSize="3xl"
    inputVariant="clean"
    animationVariant="fadeUp"
    buttonVariant="primary"
    initialProfileData={sampleProfileData}
    onSave={handleSave}
    onCancel={handleCancel}
    headerTitle={"Profile Settings"}
    headerIcon={<User />}
    editButtonLabel={"Edit Profile"}
/>
`;

    return (
        <div className="space-y-8 mb-8">

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className={`rounded-lg border 'dark bg-gray-900'`}>
                        <div className="max-w-5xl mx-auto">
                            <ProfilePage
                                variant={"dark"} // Use dark variant
                                darkMode={true} // Pass dark mode state
                                avatarShape='circle'
                                avatarSize="3xl"
                                inputVariant="clean"
                                animationVariant="fadeUp"
                                buttonVariant="primary"
                                initialProfileData={sampleProfileData}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                headerTitle={"Profile Settings"}
                                headerIcon={<User />}
                                editButtonLabel={"Edit Profile"}
                            />
                        </div>
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



// Export all demos
export { ProfilePageDemo };