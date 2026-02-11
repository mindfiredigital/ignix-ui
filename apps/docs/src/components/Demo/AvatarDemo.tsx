import React, { useState } from 'react';
import { Avatar, AvatarGroup } from '@site/src/components/UI/avatar';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { User, Mail, Star, Users, Bell } from 'lucide-react';

const avatarSizes = [
    { value: 'xs', label: 'Extra Small' },
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra Large' },
    { value: '2xl', label: '2X Large' },
    { value: '3xl', label: '3X Large' },
    { value: '4xl', label: '4X Large' },
    { value: '5xl', label: '5X Large' },
];

const avatarShapes = [
    { value: 'circle', label: 'Circle' },
    { value: 'square', label: 'Square' },
    { value: 'rounded', label: 'Rounded' },
    { value: 'hexagon', label: 'Hexagon' },
    { value: 'pentagon', label: 'Pentagon' },
    { value: 'star', label: 'Star' },
    { value: 'diamond', label: 'Diamond' },
];

const avatarStatuses = [
    { value: 'none', label: 'None' },
    { value: 'online', label: 'Online' },
    { value: 'offline', label: 'Offline' },
    { value: 'away', label: 'Away' },
    { value: 'busy', label: 'Busy' },
];

const avatarTypes = [
    { value: 'image', label: 'Image' },
    { value: 'letter', label: 'Letter' },
    { value: 'icon', label: 'Icon' },
    { value: 'fallback', label: 'Fallback' },
];

const sampleImages = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
];

const AvatarDemo = () => {
    const [size, setSize] = useState('md');
    const [shape, setShape] = useState('circle');
    const [avatarType, setAvatarType] = useState('image');
    const [status, setStatus] = useState('none');
    const [isBordered, setIsBordered] = useState(false);
    const [isClickable, setIsClickable] = useState(false);
    const [showUpload, setShowUpload] = useState(false);

    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(sampleImages[0]);

    const [clickCount, setClickCount] = useState(0);

    const handleUpload = (file: File) => {
        const url = URL.createObjectURL(file);
        setAvatarUrl(url);
        setUploadedImage(file);
    };

    const handleRemove = () => {
        if (avatarUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(avatarUrl);
        }
        setAvatarUrl(null);
        setUploadedImage(null);
    };

    const handleAvatarClick = () => {
        if (isClickable) {
            setClickCount(prev => prev + 1);
        }
    };

    const codeString = `
<Avatar 
  ${avatarType === 'image' ? `src="${avatarUrl || sampleImages[0]}"` : ''}
  ${avatarType === 'letter' ? 'letters="John Doe"' : ''}
  ${avatarType === 'icon' ? 'icon={<User className="h-1/2 w-1/2" />}' : ''}
  size="${size}"
  shape="${shape}"
  ${status !== 'none' ? `status="${status}"` : ''}
  ${isBordered ? 'bordered' : ''}
  ${isClickable ? 'clickable' : ''}
  ${showUpload ? 'showUploadButton onUpload={handleUpload}' : ''}
  ${uploadedImage ? 'onRemove={handleRemove}' : ''}
  ${isClickable ? 'onClick={handleAvatarClick}' : ''}
  alt="User avatar"
/>
`;

    return (
        <div className="space-y-8 mb-8">
            {/* Controls */}
            <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
                <div className="space-y-2">
                    <VariantSelector
                        variants={avatarSizes.map((s) => s.value)}
                        selectedVariant={size}
                        onSelectVariant={setSize}
                        type="Size"
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={avatarShapes.map((s) => s.value)}
                        selectedVariant={shape}
                        onSelectVariant={setShape}
                        type="Shape"
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={avatarTypes.map((t) => t.value)}
                        selectedVariant={avatarType}
                        onSelectVariant={setAvatarType}
                        type="Type"
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={avatarStatuses.map((s) => s.value)}
                        selectedVariant={status}
                        onSelectVariant={setStatus}
                        type="Status"
                    />
                </div>
            </div>

            {/* Additional Controls */}
            <div className="flex flex-wrap gap-6 items-center">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isBordered}
                        onChange={(e) => setIsBordered(e.target.checked)}
                    />
                    Bordered
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isClickable}
                        onChange={(e) => setIsClickable(e.target.checked)}
                    />
                    Clickable
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showUpload}
                        onChange={(e) => setShowUpload(e.target.checked)}
                    />
                    Show Upload Button
                </label>

                {isClickable && (
                    <div className="text-sm text-muted-foreground">
                        Clicks: {clickCount}
                    </div>
                )}
            </div>

            {/* Demo */}
            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="p-6 border rounded-lg mt-4">
                        <div className="flex flex-col gap-8 items-start">
                            {/* Main Demo Avatar */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-muted-foreground">Interactive Avatar</h4>
                                <div className="flex items-center gap-6">
                                    <Avatar
                                        src={avatarType === 'image' ? (avatarUrl || sampleImages[0]) : undefined}
                                        letters={avatarType === 'letter' ? 'John Doe' : undefined}
                                        icon={avatarType === 'icon' ? <User className="h-1/2 w-1/2" /> : undefined}
                                        size={size as any}
                                        shape={shape as any}
                                        status={status !== 'none' ? status as any : undefined}
                                        bordered={isBordered}
                                        clickable={isClickable}
                                        showUploadButton={showUpload}
                                        onUpload={handleUpload}
                                        onRemove={uploadedImage ? handleRemove : undefined}
                                        onClick={handleAvatarClick}
                                        alt="Demo avatar"
                                    />
                                    <div className="text-sm text-muted-foreground max-w-xs">
                                        <p className="mb-1">Current settings:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Size: {size}</li>
                                            <li>Shape: {shape}</li>
                                            <li>Type: {avatarType}</li>
                                            <li>Status: {status === 'none' ? 'None' : status}</li>
                                            <li>Bordered: {isBordered ? 'Yes' : 'No'}</li>
                                            <li>Clickable: {isClickable ? 'Yes' : 'No'}</li>
                                            <li>Upload: {showUpload ? 'Enabled' : 'Disabled'}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* All Sizes Showcase */}
                            <div className="space-y-4 w-full">
                                <h4 className="text-sm font-medium text-muted-foreground">All Sizes</h4>
                                <div className="flex flex-wrap gap-6 items-center">
                                    {avatarSizes.slice(0, 5).map((s) => (
                                        <div key={s.value} className="flex flex-col items-center gap-2">
                                            <Avatar
                                                src={sampleImages[0]}
                                                size={s.value as any}
                                                shape="circle"
                                                alt={`${s.label} avatar`}
                                            />
                                            <span className="text-xs">{s.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* All Shapes Showcase */}
                            <div className="space-y-4 w-full">
                                <h4 className="text-sm font-medium text-muted-foreground">All Shapes</h4>
                                <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
                                    {avatarShapes.map((s) => (
                                        <div key={s.value} className="flex flex-col items-center gap-2">
                                            <Avatar
                                                src={sampleImages[1]}
                                                size="md"
                                                shape={s.value as any}
                                                alt={`${s.label} avatar`}
                                            />
                                            <span className="text-xs text-center">{s.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* All Types Showcase */}
                            <div className="space-y-4 w-full">
                                <h4 className="text-sm font-medium text-muted-foreground">All Types</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {/* Image Avatars */}
                                    <div className="flex flex-col items-center gap-3">
                                        <h5 className="text-sm font-medium">Image</h5>
                                        <Avatar
                                            src={sampleImages[2]}
                                            size="lg"
                                            shape="circle"
                                            alt="Image avatar"
                                        />
                                    </div>

                                    {/* Letter Avatars */}
                                    <div className="flex flex-col items-center gap-3">
                                        <h5 className="text-sm font-medium">Letter</h5>
                                        <Avatar
                                            letters="John Doe"
                                            size="lg"
                                            shape="circle"
                                        />
                                    </div>

                                    {/* Icon Avatars */}
                                    <div className="flex flex-col items-center gap-3">
                                        <h5 className="text-sm font-medium">Icon</h5>
                                        <Avatar
                                            icon={<Users className="h-1/2 w-1/2" />}
                                            size="lg"
                                            shape="circle"
                                        />
                                    </div>

                                    {/* Fallback Avatars */}
                                    <div className="flex flex-col items-center gap-3">
                                        <h5 className="text-sm font-medium">Fallback</h5>
                                        <Avatar
                                            src="https://broken-image-url.com/image.jpg"
                                            size="lg"
                                            shape="circle"
                                            alt="Broken image"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Status Indicators */}
                            <div className="space-y-4 w-full">
                                <h4 className="text-sm font-medium text-muted-foreground">Status Indicators</h4>
                                <div className="flex flex-wrap gap-6 items-center">
                                    {avatarStatuses.filter(s => s.value !== 'none').map((s) => (
                                        <div key={s.value} className="flex flex-col items-center gap-2">
                                            <Avatar
                                                src={sampleImages[3]}
                                                size="lg"
                                                shape="circle"
                                                status={s.value as any}
                                                alt={`${s.label} status`}
                                            />
                                            <span className="text-xs">{s.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
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

// Avatar Group Demo
const AvatarGroupDemo = () => {
    const [maxVisible, setMaxVisible] = useState<number>(3);
    const [spacing, setSpacing] = useState(-8);
    const [groupSize, setGroupSize] = useState('md');

    const codeString = `
// Avatar Group Example
<AvatarGroup 
  max={${maxVisible}} 
  spacing={${spacing}}
  size="${groupSize}"
>
  <Avatar src="${sampleImages[0]}" />
  <Avatar src="${sampleImages[1]}" />
  <Avatar src="${sampleImages[2]}" />
  <Avatar src="${sampleImages[3]}" />
  <Avatar letters="John Doe" />
  <Avatar icon={<User className="h-1/2 w-1/2" />} />
</AvatarGroup>
`;

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Avatar Group</h3>

            <div className="flex flex-wrap gap-6 items-center mb-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Max Visible:</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="range"
                            min="1"
                            max="6"
                            value={maxVisible}
                            onChange={(e) => setMaxVisible(parseInt(e.target.value))}
                            className="w-32"
                        />
                        <span className="text-sm">{maxVisible}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Spacing:</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="range"
                            min="-20"
                            max="0"
                            value={spacing}
                            onChange={(e) => setSpacing(parseInt(e.target.value))}
                            className="w-32"
                        />
                        <span className="text-sm">{spacing}px</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Size:</label>
                    <select
                        value={groupSize}
                        onChange={(e) => setGroupSize(e.target.value)}
                        className="px-3 py-1 border rounded text-sm"
                    >
                        {avatarSizes.slice(0, 5).map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="p-6 border rounded-lg">
                        <div className="space-y-4">
                            <AvatarGroup
                                max={maxVisible}
                                spacing={spacing}
                                size={groupSize as any}
                            >
                                <Avatar src={sampleImages[0]} alt="User 1" />
                                <Avatar src={sampleImages[1]} alt="User 2" />
                                <Avatar src={sampleImages[2]} alt="User 3" />
                                <Avatar src={sampleImages[3]} alt="User 4" />
                                <Avatar letters="John Doe" />
                                <Avatar icon={<User className="h-1/2 w-1/2" />} />
                            </AvatarGroup>
                            <div className="text-sm text-muted-foreground">
                                Showing {Math.min(maxVisible, 6)} of 6 avatars
                            </div>
                        </div>
                    </div>
                </TabItem>

                <TabItem value="code" label="Code">
                    <CodeBlock language="tsx" className="text-sm">
                        {codeString}
                    </CodeBlock>
                </TabItem>
            </Tabs>
        </div>
    );
};

// Upload Avatar Demo
const AvatarUploadDemo = () => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(sampleImages[0]);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const handleUpload = (file: File) => {
        const url = URL.createObjectURL(file);
        setAvatarUrl(url);
        setUploadedFile(file);
    };

    const handleRemove = () => {
        if (avatarUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(avatarUrl);
        }
        setAvatarUrl(null);
        setUploadedFile(null);
    };

    const handleReset = () => {
        if (avatarUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(avatarUrl);
        }
        setAvatarUrl(sampleImages[0]);
        setUploadedFile(null);
    };

    const codeString = `
// Avatar Upload Example
const [avatarUrl, setAvatarUrl] = useState('${sampleImages[0]}');
const [uploadedFile, setUploadedFile] = useState<File | null>(null);

const handleUpload = (file: File) => {
  const url = URL.createObjectURL(file);
  setAvatarUrl(url);
  setUploadedFile(file);
};

const handleRemove = () => {
  if (avatarUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(avatarUrl);
  }
  setAvatarUrl(null);
  setUploadedFile(null);
};

<Avatar
  src={avatarUrl || undefined}
  alt="Profile picture"
  size="xl"
  showUploadButton
  onUpload={handleUpload}
  onRemove={avatarUrl ? handleRemove : undefined}
  clickable
/>
`;

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Upload & Remove Avatar</h3>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="p-6 border rounded-lg">
                        <div className="flex flex-col gap-6 items-center">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <Avatar
                                    src={avatarUrl || undefined}
                                    alt="Profile picture"
                                    size="xl"
                                    showUploadButton
                                    onUpload={handleUpload}
                                    onRemove={avatarUrl ? handleRemove : undefined}
                                    clickable
                                />

                                <div className="space-y-4 max-w-md">
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Instructions:</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                            <li>Hover over the avatar to see upload button</li>
                                            <li>Click to upload a new image</li>
                                            <li>Uploaded image will replace current one</li>
                                            <li>Hover again to see remove button (top-right)</li>
                                            <li>Click remove to delete the uploaded image</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-medium">Current Status:</h4>
                                        <div className="text-sm space-y-1">
                                            <p>Image: {avatarUrl ? '✅ Loaded' : '❌ No image'}</p>
                                            {uploadedFile && (
                                                <>
                                                    <p>File: {uploadedFile.name}</p>
                                                    <p>Size: {(uploadedFile.size / 1024).toFixed(2)} KB</p>
                                                    <p>Type: {uploadedFile.type}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleReset}
                                            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                        >
                                            Reset to Default
                                        </button>
                                        {avatarUrl && !avatarUrl.startsWith('blob:') && (
                                            <button
                                                onClick={() => setAvatarUrl(null)}
                                                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                            >
                                                Clear Image
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabItem>

                <TabItem value="code" label="Code">
                    <CodeBlock language="tsx" className="text-sm">
                        {codeString}
                    </CodeBlock>
                </TabItem>
            </Tabs>
        </div>
    );
};

// Advanced Demo
const AvatarAdvancedDemo = () => {
    const [clickedAvatar, setClickedAvatar] = useState<string>('None');

    const handleClick = (name: string) => {
        setClickedAvatar(name);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Advanced Examples</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Clickable Avatars */}
                <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Clickable Avatars</h4>
                    <div className="flex gap-4 items-center">
                        <Avatar
                            src={sampleImages[0]}
                            alt="John"
                            clickable
                            onClick={() => handleClick('John')}
                        />
                        <Avatar
                            letters="AS"
                            clickable
                            onClick={() => handleClick('Alice Smith')}
                        />
                        <Avatar
                            icon={<User className="h-1/2 w-1/2" />}
                            clickable
                            onClick={() => handleClick('User Icon')}
                        />
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                        Last clicked: {clickedAvatar}
                    </div>
                </div>

                {/* Different Content Types */}
                <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Mixed Content Types</h4>
                    <div className="flex flex-wrap gap-4">
                        <Avatar src={sampleImages[1]} alt="Image" size="md" />
                        <Avatar letters="JD" size="md" />
                        <Avatar icon={<Mail className="h-1/2 w-1/2" />} size="md" />
                        <Avatar icon={<Star className="h-1/2 w-1/2" />} size="md" />
                        <Avatar icon={<Bell className="h-1/2 w-1/2" />} size="md" />
                        <Avatar src="https://broken-image.com/img.jpg" alt="Broken" size="md" />
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                        6 different avatar types
                    </div>
                </div>

                {/* Status Indicators */}
                <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Status Indicators</h4>
                    <div className="flex gap-4 items-center">
                        <Avatar src={sampleImages[2]} status="online" alt="Online" />
                        <Avatar src={sampleImages[2]} status="away" alt="Away" />
                        <Avatar src={sampleImages[2]} status="busy" alt="Busy" />
                        <Avatar src={sampleImages[2]} status="offline" alt="Offline" />
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                        Different status indicators
                    </div>
                </div>

                {/* Different Shapes */}
                <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Different Shapes</h4>
                    <div className="flex flex-wrap gap-4">
                        <Avatar src={sampleImages[3]} shape="circle" alt="Circle" size="sm" />
                        <Avatar src={sampleImages[3]} shape="square" alt="Square" size="sm" />
                        <Avatar src={sampleImages[3]} shape="rounded" alt="Rounded" size="sm" />
                        <Avatar src={sampleImages[3]} shape="hexagon" alt="Hexagon" size="sm" />
                        <Avatar src={sampleImages[3]} shape="star" alt="Star" size="sm" />
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                        5 different shapes
                    </div>
                </div>
            </div>
        </div>
    );
};

export { AvatarDemo, AvatarGroupDemo, AvatarUploadDemo, AvatarAdvancedDemo };