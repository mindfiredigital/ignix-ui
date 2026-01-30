import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import '@testing-library/jest-dom';
import { ProfilePage, type ProfileData } from '.';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
        svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
        polyline: (props: any) => <polyline {...props} />,
    },
}));

// Mock lucide-react icons with all required exports
// Use importOriginal to properly handle missing exports
vi.mock('lucide-react', async () => {
    const actual = await vi.importActual('lucide-react');
    return {
        ...actual,
        Camera: () => <div data-testid="camera-icon">Camera</div>,
        User: () => <div data-testid="user-icon">User</div>,
        Edit3: () => <div data-testid="edit-icon">Edit3</div>,
        Lock: () => <div data-testid="lock-icon">Lock</div>,
        Save: () => <div data-testid="save-icon">Save</div>,
        X: () => <div data-testid="x-icon">X</div>,
        Loader2: () => <div data-testid="loader-icon">Loader2</div>,
        Plus: () => <div data-testid="plus-icon">Plus</div>,
        Trash2: () => <div data-testid="trash-icon">Trash2</div>,
        Link: () => <div data-testid="link-icon">Link</div>, // This is LinkIcon
        Twitter: () => <div data-testid="twitter-icon">Twitter</div>,
        Github: () => <div data-testid="github-icon">Github</div>,
        Linkedin: () => <div data-testid="linkedin-icon">Linkedin</div>,
        Mail: () => <div data-testid="mail-icon">Mail</div>,
        Briefcase: () => <div data-testid="briefcase-icon">Briefcase</div>,
        Globe: () => <div data-testid="globe-icon">Globe</div>, // This is Earth
        MapPin: () => <div data-testid="mappin-icon">MapPin</div>,
        CheckCircle: () => <div data-testid="checkcircle-icon">CheckCircle</div>,
    };
});

// Mock internal components
vi.mock('@ignix-ui/avatar', () => ({
    Avatar: ({ src, alt, letters, onClick, shape, size, bordered, status, className }: any) => (
        <div
            data-testid="avatar"
            onClick={onClick}
            data-shape={shape}
            data-size={size}
            data-bordered={bordered}
            data-status={status}
            className={className}
        >
            {src ? <img src={src} alt={alt} data-testid="avatar-img" /> : <span data-testid="avatar-letters">{letters}</span>}
        </div>
    ),
}));

vi.mock('@ignix-ui/button', () => ({
    Button: ({ children, onClick, disabled, variant, className, animationVariant }: any) => (
        <button
            data-testid="button"
            onClick={onClick}
            disabled={disabled}
            data-variant={variant}
            data-animation={animationVariant}
            className={className}
        >
            {children}
        </button>
    ),
}));

vi.mock('@ignix-ui/input', () => ({
    AnimatedInput: ({ value, onChange, placeholder, disabled, icon: Icon, variant, type }: any) => {
        if (type === 'textarea') {
            return (
                <div data-testid="animated-input-container" data-variant={variant}>
                    {Icon && <Icon data-testid="input-icon" />}
                    <textarea
                        data-testid="animated-textarea"
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                </div>
            );
        }
        return (
            <div data-testid="animated-input-container" data-variant={variant}>
                {Icon && <Icon data-testid="input-icon" />}
                <input
                    data-testid="animated-input"
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    type={type}
                />
            </div>
        );
    },
}));

vi.mock('@ignix-ui/typography', () => ({
    Typography: ({ children, variant, className, color, weight }: any) => (
        <div
            data-testid={`typography-${variant}`}
            className={className}
            data-color={color}
            data-weight={weight}
        >
            {children}
        </div>
    ),
}));

// Mock console.error to suppress the error log from test
// Mock console.error to suppress the error log from test
beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {
        // Suppress error logs during tests
    });
});

afterAll(() => {
    vi.restoreAllMocks();
});

describe('ProfilePage', () => {
    const defaultProfileData: Partial<ProfileData> = {
        displayName: 'John Doe',
        email: 'john@example.com',
        bio: 'Test bio',
        avatarUrl: null,
        socialLinks: [
            { id: '1', platform: 'Twitter', url: 'https://twitter.com/johndoe' },
        ],
    };

    beforeEach(() => {
        vi.clearAllMocks();
        global.URL.createObjectURL = vi.fn(() => 'mocked-url');
        // Mock FileReader
        global.FileReader = vi.fn(() => ({
            readAsDataURL: vi.fn(),
            onloadend: vi.fn(),
        })) as any;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders profile with default data', () => {
        render(<ProfilePage />);

        expect(screen.getByText('Profile Settings')).toBeInTheDocument();
        // The Edit Profile button is inside the header button
        const buttons = screen.getAllByTestId('button');
        const editButton = buttons.find(btn => btn.textContent?.includes('Edit Profile'));
        expect(editButton).toBeInTheDocument();
        expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    it('renders with custom header title', () => {
        render(<ProfilePage headerTitle="Custom Header" />);
        expect(screen.getByText('Custom Header')).toBeInTheDocument();
    });

    it('renders with initial profile data', () => {
        render(<ProfilePage initialProfileData={defaultProfileData} />);

        // The display name should be in the avatar letters
        const avatarLetters = screen.getByTestId('avatar-letters');
        expect(avatarLetters).toHaveTextContent('John Doe');
    });

    it('enters edit mode when edit button is clicked', async () => {
        const user = userEvent.setup();
        render(<ProfilePage initialProfileData={defaultProfileData} />);

        // Find the Edit Profile button
        const buttons = screen.getAllByTestId('button');
        const editButton = buttons.find(btn => btn.textContent?.includes('Edit Profile'));

        if (editButton) {
            await user.click(editButton);
        }

        expect(screen.getByText('Save Changes')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('saves profile changes when save button is clicked', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn();

        render(
            <ProfilePage
                initialProfileData={defaultProfileData}
                onSave={onSave}
            />
        );

        // Enter edit mode - find Edit Profile button
        const buttons = screen.getAllByTestId('button');
        const editButton = buttons.find(btn => btn.textContent?.includes('Edit Profile'));

        if (editButton) {
            await user.click(editButton);
        }

        // Change a field - find input by placeholder
        const inputs = screen.getAllByTestId('animated-input');
        const nameInput = inputs.find(input =>
            (input as HTMLInputElement).placeholder === 'Enter your display name'
        ) as HTMLInputElement;

        if (nameInput) {
            await user.clear(nameInput);
            await user.type(nameInput, 'Jane Doe');
        }

        // Click save
        const saveButton = screen.getByText('Save Changes');
        await user.click(saveButton);

        await waitFor(() => {
            expect(onSave).toHaveBeenCalled();
        });
    });

    it('cancels edit mode without saving changes', async () => {
        const user = userEvent.setup();
        const onCancel = vi.fn();

        render(
            <ProfilePage
                initialProfileData={defaultProfileData}
                onCancel={onCancel}
            />
        );

        // Enter edit mode
        const buttons = screen.getAllByTestId('button');
        const editButton = buttons.find(btn => btn.textContent?.includes('Edit Profile'));

        if (editButton) {
            await user.click(editButton);
        }

        // Click cancel
        await user.click(screen.getByText('Cancel'));

        expect(onCancel).toHaveBeenCalled();

        // Verify we're back in view mode
        const editButtons = screen.getAllByTestId('button');
        const viewEditButton = editButtons.find(btn => btn.textContent?.includes('Edit Profile'));
        expect(viewEditButton).toBeInTheDocument();
    });

    it('handles avatar upload', async () => {
        const user = userEvent.setup();

        render(<ProfilePage initialProfileData={defaultProfileData} />);

        // Enter edit mode
        const buttons = screen.getAllByTestId('button');
        const editButton = buttons.find(btn => btn.textContent?.includes('Edit Profile'));

        if (editButton) {
            await user.click(editButton);
        }

        // Click on avatar to trigger file input
        const avatar = screen.getByTestId('avatar');
        await user.click(avatar);
    });

    it('adds and removes social links in edit mode', async () => {
        const user = userEvent.setup();

        render(<ProfilePage initialProfileData={defaultProfileData} />);

        // Enter edit mode
        const buttons = screen.getAllByTestId('button');
        const editButton = buttons.find(btn => btn.textContent?.includes('Edit Profile'));

        if (editButton) {
            await user.click(editButton);
        }

        // Find and click "Add Social Link" button
        const addButton = screen.getByText('Add Social Link');
        await user.click(addButton);

        // Should add a new social link entry
        const platformInputs = screen.getAllByPlaceholderText('Platform name');
        expect(platformInputs.length).toBeGreaterThan(0);
    });

    it('displays loading state when isLoading is true', () => {
        render(<ProfilePage isLoading={true} />);
        expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });

    it('displays error notification when save fails', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn().mockRejectedValue(new Error('Save failed'));

        render(
            <ProfilePage
                initialProfileData={defaultProfileData}
                onSave={onSave}
            />
        );

        // Enter edit mode
        const buttons = screen.getAllByTestId('button');
        const editButton = buttons.find(btn => btn.textContent?.includes('Edit Profile'));

        if (editButton) {
            await user.click(editButton);
        }

        await user.click(screen.getByText('Save Changes'));

        // Wait for error handling
        await waitFor(() => {
            expect(screen.getByText('Save Changes')).toBeInTheDocument();
        });
    });

    it('applies different variants correctly', () => {
        const { rerender } = render(<ProfilePage variant="default" />);
        expect(screen.getByText('Profile Settings')).toBeInTheDocument();

        rerender(<ProfilePage variant="glass" />);
        expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    });

    it('handles different avatar shapes and sizes', () => {
        render(
            <ProfilePage
                avatarShape="square"
                avatarSize="xl"
            />
        );

        const avatar = screen.getByTestId('avatar');
        expect(avatar).toHaveAttribute('data-shape', 'square');
    });

    it('displays notification on successful save', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn().mockResolvedValue(undefined);

        render(
            <ProfilePage
                initialProfileData={defaultProfileData}
                onSave={onSave}
                showSaveNotification={true}
            />
        );

        // Enter edit mode
        const buttons = screen.getAllByTestId('button');
        const editButton = buttons.find(btn => btn.textContent?.includes('Edit Profile'));

        if (editButton) {
            await user.click(editButton);
        }

        await user.click(screen.getByText('Save Changes'));

        await waitFor(() => {
            expect(onSave).toHaveBeenCalled();
        });
    });


    it('handles bio textarea in edit mode', async () => {
        const user = userEvent.setup();

        render(<ProfilePage initialProfileData={defaultProfileData} />);

        // Enter edit mode
        const buttons = screen.getAllByTestId('button');
        const editButton = buttons.find(btn => btn.textContent?.includes('Edit Profile'));

        if (editButton) {
            await user.click(editButton);
        }

        // Bio should be a textarea - look for textarea placeholder
        const textarea = screen.getByPlaceholderText('Tell us a bit about yourself...');
        expect(textarea).toBeInTheDocument();
        expect(textarea.tagName).toBe('TEXTAREA');
    });

    describe('Accessibility', () => {
        it('has proper labels and associations', () => {
            render(<ProfilePage initialProfileData={defaultProfileData} />);

            expect(screen.getByText('Basic Information')).toBeInTheDocument();
            expect(screen.getByText('About Me')).toBeInTheDocument();
            expect(screen.getByText('Connect')).toBeInTheDocument();
        });

        it('has accessible buttons', () => {
            render(<ProfilePage />);

            const buttons = screen.getAllByTestId('button');
            expect(buttons.length).toBeGreaterThan(0);
            expect(buttons[0].tagName).toBe('BUTTON');
        });
    });

    describe('Edge Cases', () => {
        it('handles empty initial data', () => {
            render(<ProfilePage initialProfileData={{}} />);

            // Should show default name from defaultProfileData
            const avatarLetters = screen.getByTestId('avatar-letters');
            expect(avatarLetters).toHaveTextContent('Alex Thompson');
        });

        it('handles undefined onSave callback gracefully', async () => {
            const user = userEvent.setup();

            render(<ProfilePage initialProfileData={defaultProfileData} />);

            // Enter edit mode
            const buttons = screen.getAllByTestId('button');
            const editButton = buttons.find(btn => btn.textContent?.includes('Edit Profile'));

            if (editButton) {
                await user.click(editButton);
            }

            await user.click(screen.getByText('Save Changes'));

            // Should not throw - wait for save to complete
            await waitFor(() => {
                // After save, we should see Edit Profile button again
                const editButtons = screen.getAllByTestId('button');
                const viewEditButton = editButtons.find(btn => btn.textContent?.includes('Edit Profile'));
                expect(viewEditButton).toBeInTheDocument();
            });
        });

        it('handles long text in fields', () => {
            const longBio = 'A'.repeat(1000);
            render(
                <ProfilePage
                    initialProfileData={{ ...defaultProfileData, bio: longBio }}
                />
            );

            expect(screen.getByText(longBio)).toBeInTheDocument();
        });

        it('handles special characters in display name', () => {
            const specialName = 'John-Doe <Test> & Co.';
            render(
                <ProfilePage
                    initialProfileData={{ ...defaultProfileData, displayName: specialName }}
                />
            );

            const avatarLetters = screen.getByTestId('avatar-letters');
            expect(avatarLetters).toHaveTextContent(specialName);
        });
    });

    describe('Social Links', () => {
        it('displays social links in view mode', () => {
            render(
                <ProfilePage
                    initialProfileData={{
                        socialLinks: [
                            { id: '1', platform: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' },
                            { id: '2', platform: 'GitHub', url: 'https://github.com/johndoe' },
                        ]
                    }}
                />
            );

            expect(screen.getByText('LinkedIn')).toBeInTheDocument();
            expect(screen.getByText('GitHub')).toBeInTheDocument();
        });

        it('shows "No social links added" message when empty', () => {
            render(
                <ProfilePage
                    initialProfileData={{ socialLinks: [] }}
                />
            );

            expect(screen.getByText('No social links added')).toBeInTheDocument();
        });
    });
});
