
import { Avatar, AvatarGroup, type AvatarShape } from '.';
import { User, Mail, Star, Camera, Settings, Users, Bell } from 'lucide-react';
import { useState } from 'react';

export default {
    title: 'Components/Avatar',
    component: Avatar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: { type: 'select' },
            options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'],
        },
        shape: {
            control: { type: 'select' },
            options: ['circle', 'square', 'rounded', 'hexagon', 'pentagon', 'star', 'diamond'],
        },
        status: {
            control: { type: 'select' },
            options: ['online', 'offline', 'away', 'busy', undefined],
        },
        bordered: {
            control: 'boolean',
        },
        clickable: {
            control: 'boolean',
        },
    },
};

export const Default = {
    args: {
        src: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
        alt: 'User avatar',
        size: 'md',
        shape: 'circle',
    },
};

export const ImageAvatars = () => (
    <div className="flex gap-4 items-center">
        <Avatar
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
            alt="User 1"
        />
        <Avatar
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
            alt="User 2"
        />
        <Avatar
            src="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop"
            alt="User 3"
        />
    </div>
);

export const LetterAvatars = () => (
    <div className="flex gap-4 items-center">
        <Avatar letters="John Doe" />
        <Avatar letters="Alice Smith" />
        <Avatar letters="Bob Johnson" />
        <Avatar letters="Emily Davis" />
    </div>
);

export const DifferentSizes = () => (
    <div className="flex items-center gap-6">
        <Avatar
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
            size="xs"
            alt="XS"
        />
        <Avatar
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
            size="sm"
            alt="SM"
        />
        <Avatar
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
            size="md"
            alt="MD"
        />
        <Avatar
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
            size="lg"
            alt="LG"
        />
        <Avatar
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
            size="xl"
            alt="XL"
        />
        <Avatar
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
            size="2xl"
            alt="2XL"
        />
        <Avatar
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
            size="3xl"
            alt="3XL"
        />
        <Avatar
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
            size="4xl"
            alt="4XL"
        />
    </div>
);

export const DifferentShapes = () => (
    <div className="grid grid-cols-3 gap-6 p-6">
        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                shape="circle"
                size="lg"
            />
            <span className="text-sm">Circle</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                shape="square"
                size="lg"
            />
            <span className="text-sm">Square</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                shape="rounded"
                size="lg"
            />
            <span className="text-sm">Rounded</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                shape="hexagon"
                size="lg"
            />
            <span className="text-sm">Hexagon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                shape="pentagon"
                size="lg"
            />
            <span className="text-sm">Pentagon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                shape="star"
                size="lg"
            />
            <span className="text-sm">Star</span>
        </div>

        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                shape="diamond"
                size="lg"
            />
            <span className="text-sm">Diamond</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                shape="triangle"
                size="lg"
            />
            <span className="text-sm">Triangle</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                shape="triangle-down"
                size="lg"
            />
            <span className="text-sm">Triangle Down</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                shape="parallelogram"
                size="lg"
            />
            <span className="text-sm">Parallelogram</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                shape="rhombus"
                size="lg"
            />
            <span className="text-sm">Rhombus</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                shape="cross"
                size="lg"
            />
            <span className="text-sm">Cross</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                shape="octagon"
                size="lg"
            />
            <span className="text-sm">Octagon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                shape="decagon"
                size="lg"
            />
            <span className="text-sm">Decagon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                shape="ellipse"
                size="lg"
            />
            <span className="text-sm">Ellipse</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                shape="egg"
                size="lg"
            />
            <span className="text-sm">Egg</span>
        </div>

        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                shape="trapezoid"
                size="lg"
            />
            <span className="text-sm">Trapezoid</span>
        </div>
    </div>
);

export const IconAvatars = () => (
    <div className="flex gap-4 items-center">
        <Avatar icon={<User className="h-1/2 w-1/2" />} />
        <Avatar icon={<Mail className="h-1/2 w-1/2" />} />
        <Avatar icon={<Star className="h-1/2 w-1/2" />} />
        <Avatar icon={<Settings className="h-1/2 w-1/2" />} />
        <Avatar icon={<Bell className="h-1/2 w-1/2" />} />
    </div>
);

export const BrokenImagePlaceholder = () => (
    <div className="flex gap-4 items-center">
        <Avatar
            src="https://broken-image-url.com/image.jpg"
            alt="Broken Image"
        />
        <Avatar
            src="https://broken-image-url.com/image.jpg"
            alt="Broken Image"
            fallback={<Camera className="h-1/2 w-1/2" />}
        />
        <Avatar
            src="https://broken-image-url.com/image.jpg"
            alt="Broken Image"
            letters="JD"
        />
    </div>
);

export const GroupedAvatars = () => (
    <div className="flex flex-col gap-6 p-4">
        <div>
            <h3 className="mb-2 font-semibold">Default Group</h3>
            <AvatarGroup >
                <Avatar src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop" />
                <Avatar src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" />
                <Avatar src="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop" />
                <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" />
            </AvatarGroup>
        </div>

        <div>
            <h3 className="mb-2 font-semibold">With Max Limit</h3>
            <AvatarGroup size='2xl' max={3}>
                <Avatar src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop" />
                <Avatar src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" />
                <Avatar src="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop" />
                <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" />
                <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop" />
                <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop" />
                <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop" />
                <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop" />
                <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop" />
                <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop" />
                <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop" />
                <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop" />
            </AvatarGroup>
        </div>

        <div>
            <h3 className="mb-2 font-semibold">Different Sizes</h3>
            <AvatarGroup size="3xl" max={4}>
                <Avatar src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop" />
                <Avatar src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" />
                <Avatar src="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop" />
                <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" />
                <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop" />
            </AvatarGroup>
        </div>
    </div>
);


export const WithStatusIndicators = () => (
    <div className="flex gap-6 items-center p-4">
        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                status="online"
                bordered
            />
            <span className="text-sm">Online</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                status="offline"
                bordered
            />
            <span className="text-sm">Offline</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                status="away"
                bordered
            />
            <span className="text-sm">Away</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                status="busy"
                bordered
            />
            <span className="text-sm">Busy</span>
        </div>
    </div>
);

export const InteractiveExample = () => {
    const [clicked, setClicked] = useState<string>('None');

    return (
        <div className="flex flex-col gap-4 items-center p-6 border rounded-lg">
            <h3 className="font-semibold">Click an Avatar</h3>
            <div className="flex gap-4">
                <Avatar
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                    clickable
                    onClick={() => setClicked('John')}
                />
                <Avatar
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
                    clickable
                    onClick={() => setClicked('Alice')}
                />
                <Avatar
                    letters="BS"
                    clickable
                    onClick={() => setClicked('Bob Smith')}
                />
            </div>
            <p className="mt-2">Clicked: {clicked}</p>
        </div>
    );
};

export const MixedExamples = () => (
    <div className="flex flex-col gap-6 p-6 border rounded-lg">
        <h3 className="font-semibold mb-2">All Avatar Types</h3>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <p className="text-sm font-medium">Image with Status</p>
                <Avatar
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
                    status="online"
                    size="lg"
                />
            </div>

            <div className="space-y-2">
                <p className="text-sm font-medium">Letter Avatar</p>
                <Avatar
                    letters="JD"
                    size="lg"
                    shape="rounded"
                />
            </div>

            <div className="space-y-2">
                <p className="text-sm font-medium">Icon Avatar</p>
                <Avatar
                    icon={<Users className="h-1/2 w-1/2" />}
                    size="lg"
                    shape="hexagon"
                />
            </div>

            <div className="space-y-2">
                <p className="text-sm font-medium">Bordered</p>
                <Avatar
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
                    bordered
                    size="lg"
                    shape="star"
                />
            </div>
        </div>
    </div>
);



export const BackgroundColors = () => (
    <div className="grid grid-cols-3 gap-6 p-6">
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="JD"
                backgroundColor="#3b82f6" // Blue
                size="lg"
            />
            <span className="text-sm">Blue</span>
            <code className="text-xs text-gray-500">#3b82f6</code>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="AS"
                backgroundColor="#10b981" // Emerald
                size="lg"
            />
            <span className="text-sm">Emerald</span>
            <code className="text-xs text-gray-500">#10b981</code>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="MJ"
                backgroundColor="#8b5cf6" // Violet
                size="lg"
            />
            <span className="text-sm">Violet</span>
            <code className="text-xs text-gray-500">#8b5cf6</code>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="TB"
                backgroundColor="#f59e0b" // Amber
                size="lg"
            />
            <span className="text-sm">Amber</span>
            <code className="text-xs text-gray-500">#f59e0b</code>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="CP"
                backgroundColor="#ef4444" // Red
                size="lg"
            />
            <span className="text-sm">Red</span>
            <code className="text-xs text-gray-500">#ef4444</code>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="RW"
                backgroundColor="#ec4899" // Pink
                size="lg"
            />
            <span className="text-sm">Pink</span>
            <code className="text-xs text-gray-500">#ec4899</code>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="LD"
                backgroundColor="#06b6d4" // Cyan
                size="lg"
            />
            <span className="text-sm">Cyan</span>
            <code className="text-xs text-gray-500">#06b6d4</code>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="KG"
                backgroundColor="#84cc16" // Lime
                size="lg"
            />
            <span className="text-sm">Lime</span>
            <code className="text-xs text-gray-500">#84cc16</code>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="WF"
                backgroundColor="#f97316" // Orange
                size="lg"
            />
            <span className="text-sm">Orange</span>
            <code className="text-xs text-gray-500">#f97316</code>
        </div>
    </div>
);

export const GradientBackgrounds = () => (
    <div className="grid grid-cols-2 gap-6 p-6">
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="AB"
                size="xl"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
            />
            <span className="text-sm">Purple Gradient</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="CD"
                size="xl"
                style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                }}
            />
            <span className="text-sm">Pink Gradient</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="EF"
                size="xl"
                style={{
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                }}
            />
            <span className="text-sm">Blue Gradient</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="GH"
                size="xl"
                style={{
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                }}
            />
            <span className="text-sm">Green Gradient</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="IJ"
                size="xl"
                style={{
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                }}
            />
            <span className="text-sm">Sunset Gradient</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="KL"
                size="xl"
                style={{
                    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                }}
            />
            <span className="text-sm">Pastel Gradient</span>
        </div>
    </div>
);

export const TransparentBackground = () => (
    <div className="flex flex-col gap-6 p-6 border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
        <h3 className="font-semibold">Transparent Background Examples</h3>
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center gap-2">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                    <Avatar
                        letters="TM"
                        size="lg"
                        className="bg-transparent border-2 border-gray-300"
                    />
                </div>
                <span className="text-sm">Transparent with Border</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm">
                    <Avatar
                        icon={<User className="h-1/2 w-1/2 text-blue-600" />}
                        size="lg"
                        className="bg-transparent"
                    />
                </div>
                <span className="text-sm">Icon on Gradient</span>
            </div>
        </div>
        <p className="text-sm text-gray-600 text-center">
            Use <code>className="bg-transparent"</code> for transparent backgrounds
        </p>
    </div>
);

export const CustomStyling = () => (
    <div className="grid grid-cols-2 gap-6 p-6">
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="JD"
                size="lg"
                className="shadow-lg shadow-blue-500/30"
                backgroundColor="#3b82f6"
            />
            <span className="text-sm">With Shadow</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="AS"
                size="lg"
                className="ring-4 ring-yellow-400 ring-offset-2"
                backgroundColor="#f59e0b"
            />
            <span className="text-sm">With Ring</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                icon={<Star className="h-1/2 w-1/2 text-white" />}
                size="lg"
                className="shadow-inner"
                backgroundColor="#8b5cf6"
            />
            <span className="text-sm">Inner Shadow</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="MJ"
                size="lg"
                className="hover:shadow-xl transition-shadow duration-300"
                backgroundColor="#10b981"
            />
            <span className="text-sm">Hover Effects</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="TB"
                size="lg"
                className="opacity-80 hover:opacity-100 transition-opacity"
                backgroundColor="#ef4444"
            />
            <span className="text-sm">Opacity Effects</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="CP"
                size="lg"
                className="blur-sm hover:blur-none transition-all"
                backgroundColor="#ec4899"
            />
            <span className="text-sm">Blur Effects</span>
        </div>
    </div>
);

export const ColoredStatusIndicators = () => (
    <div className="grid grid-cols-3 gap-6 p-6">
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="AM"
                backgroundColor="#3b82f6"
                status="online"
                size="lg"
                bordered
            />
            <span className="text-sm">Blue Avatar</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="BN"
                backgroundColor="#10b981"
                status="away"
                size="lg"
                bordered
            />
            <span className="text-sm">Green Avatar</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="CO"
                backgroundColor="#8b5cf6"
                status="busy"
                size="lg"
                bordered
            />
            <span className="text-sm">Purple Avatar</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="DP"
                backgroundColor="#f59e0b"
                status="offline"
                size="lg"
                bordered
            />
            <span className="text-sm">Orange Avatar</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="EQ"
                backgroundColor="#ef4444"
                status="online"
                size="lg"
                bordered
            />
            <span className="text-sm">Red Avatar</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Avatar
                letters="FR"
                backgroundColor="#ec4899"
                status="away"
                size="lg"
                bordered
            />
            <span className="text-sm">Pink Avatar</span>
        </div>
    </div>
);

export const ThemedAvatars = () => (
    <div className="space-y-8 p-6">
        <div>
            <h3 className="font-semibold mb-4">Light Theme</h3>
            <div className="flex gap-4 p-4 bg-white rounded-lg">
                <Avatar letters="JD" backgroundColor="#f1f5f9" />
                <Avatar letters="AS" backgroundColor="#e2e8f0" />
                <Avatar letters="MJ" backgroundColor="#cbd5e1" />
                <Avatar letters="TB" backgroundColor="#94a3b8" />
            </div>
        </div>

        <div>
            <h3 className="font-semibold mb-4">Dark Theme</h3>
            <div className="flex gap-4 p-4 bg-gray-900 rounded-lg">
                <Avatar letters="JD" backgroundColor="#1e293b" />
                <Avatar letters="AS" backgroundColor="#334155" />
                <Avatar letters="MJ" backgroundColor="#475569" />
                <Avatar letters="TB" backgroundColor="#64748b" />
            </div>
        </div>

        <div>
            <h3 className="font-semibold mb-4">Brand Colors</h3>
            <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                    <Avatar
                        letters="TW"
                        backgroundColor="#1da1f2"
                        size="lg"
                    />
                    <span className="text-sm">Twitter Blue</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Avatar
                        letters="FB"
                        backgroundColor="#1877f2"
                        size="lg"
                    />
                    <span className="text-sm">Facebook Blue</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Avatar
                        letters="IG"
                        backgroundColor="#e4405f"
                        size="lg"
                    />
                    <span className="text-sm">Instagram Pink</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Avatar
                        letters="GH"
                        backgroundColor="#181717"
                        size="lg"
                    />
                    <span className="text-sm">GitHub Black</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Avatar
                        letters="LI"
                        backgroundColor="#0a66c2"
                        size="lg"
                    />
                    <span className="text-sm">LinkedIn Blue</span>
                </div>
            </div>
        </div>
    </div>
);

export const BackgroundWithDifferentShapes = () => {
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];
    const shapes: AvatarShape[] = ['circle', 'square', 'rounded', 'hexagon', 'star', 'diamond'];

    return (
        <div className="grid grid-cols-3 gap-6 p-6">
            {shapes.map((shape, index) => (
                <div key={shape} className="flex flex-col items-center gap-2">
                    <Avatar
                        letters={shape.charAt(0).toUpperCase()}
                        shape={shape}
                        backgroundColor={colors[index]}
                        size="lg"
                    />
                    <span className="text-sm capitalize">{shape}</span>
                    <code className="text-xs text-gray-500">{colors[index]}</code>
                </div>
            ))}
        </div>
    );
};

export const DynamicBackgroundExample = () => {
    const colors = [
        '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b',
        '#ef4444', '#ec4899', '#06b6d4', '#84cc16'
    ];
    const [colorIndex, setColorIndex] = useState(0);

    const cycleColor = () => {
        setColorIndex((prev) => (prev + 1) % colors.length);
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
            <h3 className="font-semibold">Click to Cycle Background Colors</h3>

            <Avatar
                letters="DY"
                backgroundColor={colors[colorIndex]}
                size="xl"
                clickable
                onClick={cycleColor}
            />

            <div className="flex flex-col items-center gap-2">
                <p className="text-sm">Current Color: <code>{colors[colorIndex]}</code></p>
                <div className="flex gap-2">
                    {colors.map((color, index) => (
                        <button
                            key={color}
                            onClick={() => setColorIndex(index)}
                            className={`w-6 h-6 rounded-full ${index === colorIndex ? 'ring-2 ring-gray-400' : ''}`}
                            style={{ backgroundColor: color }}
                            aria-label={`Select color ${color}`}
                        />
                    ))}
                </div>
            </div>

            <button
                onClick={cycleColor}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
                Cycle Color
            </button>
        </div>
    );
};