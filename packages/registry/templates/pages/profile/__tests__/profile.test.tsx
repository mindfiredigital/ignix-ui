// ProfilePage.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { ProfilePage } from "../";
import type { ProfileData } from "../types";

/* ---------------- Mock Button ---------------- */
vi.mock("@ignix-ui/button", () => {
    return {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Button: ({ children, animationVariant, whileHover, whileTap, ...props }: any) => (
            <button {...props} data-testid="button">
                {children}
            </button>
        ),
    };
});

/* ---------------- Mock Typography ---------------- */
vi.mock("@ignix-ui/typography", () => {
    return {
        Typography: ({ children, variant, weight, className, color }: any) => {
            const Tag = variant === "h6" ? "h6" :
                variant === "h2" ? "h2" :
                    variant === "h5" ? "h5" :
                        variant === "lead" ? "p" :
                            variant === "body-small" ? "span" : "div";
            return (
                <Tag
                    className={className}
                    data-variant={variant}
                    data-weight={weight}
                    data-color={color}
                >
                    {children}
                </Tag>
            );
        },
    };
});

/* ---------------- Mock Framer Motion ---------------- */
vi.mock("framer-motion", async () => {
    const react = await vi.importActual<typeof import("react")>("react");

    const MockMotion = react.forwardRef(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ children, whileHover, whileTap, animationVariant, ...props }: any, ref: any) =>
            react.createElement("div", { ref, ...props }, children)
    );

    return {
        motion: {
            div: MockMotion,
        },
        useReducedMotion: () => false,
    };
});

/* ---------------- Mock Lucide Icons ---------------- */
vi.mock("lucide-react", () => ({
    User: () => <div data-testid="user-icon">UserIcon</div>,
    Edit3: () => <div data-testid="edit-icon">EditIcon</div>,
    Mail: () => <div data-testid="mail-icon">MailIcon</div>,
    Briefcase: () => <div data-testid="briefcase-icon">BriefcaseIcon</div>,
    MapPin: () => <div data-testid="mappin-icon">MapPinIcon</div>,
    Globe: () => <div data-testid="globe-icon">GlobeIcon</div>,
    Loader2: () => <div data-testid="loader-icon">LoaderIcon</div>,
    Plus: () => <div data-testid="plus-icon">PlusIcon</div>,
    Trash2: () => <div data-testid="trash-icon">TrashIcon</div>,
    Twitter: () => <div data-testid="twitter-icon">TwitterIcon</div>,
    Github: () => <div data-testid="github-icon">GithubIcon</div>,
    Linkedin: () => <div data-testid="linkedin-icon">LinkedinIcon</div>,
    X: () => <div data-testid="x-icon">XIcon</div>,
    Instagram: () => <div data-testid="instagram-icon">InstagramIcon</div>,
    Facebook: () => <div data-testid="facebook-icon">FacebookIcon</div>,
    Youtube: () => <div data-testid="youtube-icon">YoutubeIcon</div>,
    ChevronRight: () => <div data-testid="chevron-right-icon">ChevronRightIcon</div>,
    CheckCircle: () => <div data-testid="check-circle-icon">CheckCircleIcon</div>,
    AlertCircle: () => <div data-testid="alert-circle-icon">AlertCircleIcon</div>,
    XCircle: () => <div data-testid="x-circle-icon">XCircleIcon</div>,
}));

/* ---------------- Mock Utils ---------------- */
vi.mock("../../../utils/cn", () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

/* ---------------- Mock Components ---------------- */
// Mock the child components to simplify testing
vi.mock("../components/Notification", () => ({
    NotificationComponent: ({ type, message, onClose }: any) => (
        <div data-testid="notification" data-type={type}>
            {message}
            <button onClick={onClose} data-testid="close-notification">Close</button>
        </div>
    ),
}));

vi.mock("../components/ProfileField", () => ({
    ProfileField: ({ label, value, isEditing, onChange, type, placeholder, readOnly }: any) => {
        if (isEditing && !readOnly) {
            if (type === "textarea") {
                return (
                    <div data-testid="profile-field">
                        {label && <label>{label}</label>}
                        <textarea
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            data-testid={`field-${label?.toLowerCase().replace(/\s+/g, '-') || 'textarea'}`}
                        />
                    </div>
                );
            }
            return (
                <div data-testid="profile-field">
                    {label && <label>{label}</label>}
                    <input
                        type={type || "text"}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        data-testid={`field-${label?.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                </div>
            );
        }
        return (
            <div data-testid="profile-field">
                {label && <strong>{label}:</strong>}
                <span data-testid={`display-${label?.toLowerCase().replace(/\s+/g, '-') || 'value'}`}>
                    {value}
                </span>
            </div>
        );
    },
}));

vi.mock("../components/SocialLinksList", () => ({
    SocialLinksList: ({ links, isEditing, onLinksChange }: any) => {
        if (isEditing) {
            return (
                <div data-testid="social-links-editor">
                    {links.map((link: any, index: number) => (
                        <div key={link.id} data-testid={`social-link-${index}`}>
                            <input
                                value={link.platform}
                                onChange={(e) => {
                                    const newLinks = [...links];
                                    newLinks[index] = { ...newLinks[index], platform: e.target.value };
                                    onLinksChange(newLinks);
                                }}
                                placeholder="Platform"
                                data-testid={`platform-input-${index}`}
                            />
                            <input
                                value={link.url}
                                onChange={(e) => {
                                    const newLinks = [...links];
                                    newLinks[index] = { ...newLinks[index], url: e.target.value };
                                    onLinksChange(newLinks);
                                }}
                                placeholder="https://"
                                data-testid={`url-input-${index}`}
                            />
                            <button
                                onClick={() => {
                                    const newLinks = links.filter((_: any, i: number) => i !== index);
                                    onLinksChange(newLinks);
                                }}
                                data-testid={`remove-link-${index}`}
                                aria-label="Remove link"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            const newLinks = [...links, { id: Date.now().toString(), platform: '', url: '' }];
                            onLinksChange(newLinks);
                        }}
                        data-testid="add-link-button"
                        aria-label="Add link"
                    >
                        Add Link
                    </button>
                </div>
            );
        }
        return (
            <div data-testid="social-links-display">
                {links.map((link: any) => (
                    <div key={link.id} data-testid={`social-link-${link.platform}`}>
                        {link.platform}: {link.url}
                    </div>
                ))}
            </div>
        );
    },
}));

vi.mock("../components/SaveCancelBar", () => ({
    SaveCancelBar: ({ onSave, onCancel, isSaving }: any) => (
        <div data-testid="save-cancel-bar">
            <button
                onClick={onSave}
                disabled={isSaving}
                data-testid="save-button"
            >
                {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
                onClick={onCancel}
                data-testid="cancel-button"
            >
                Cancel
            </button>
        </div>
    ),
}));

vi.mock("../components/AvatarUploader", () => ({
    AvatarUploader: ({ name, avatarUrl, isEditing, onAvatarChange }: any) => (
        <div data-testid="avatar-uploader">
            <div data-testid="avatar-preview">
                {avatarUrl ? "Avatar Preview" : `Initials: ${name?.charAt(0)}`}
            </div>
            {isEditing && (
                <input
                    type="file"
                    data-testid="avatar-input"
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        onAvatarChange(file, file ? "preview-url" : null);
                    }}
                />
            )}
        </div>
    ),
}));

/* ---------------- Test Suite ---------------- */
describe("ProfilePage", () => {
    const mockProfileData: ProfileData = {
        displayName: "John Doe",
        email: "john.doe@example.com",
        bio: "Software engineer with 5+ years of experience",
        avatarUrl: "https://example.com/avatar.jpg",
        socialLinks: [
            { id: "1", platform: "Twitter", url: "https://twitter.com/johndoe" },
            { id: "2", platform: "GitHub", url: "https://github.com/johndoe" },
        ],
        location: "San Francisco, CA",
        jobTitle: "Senior Software Engineer",
        website: "https://johndoe.com",
        phone: "+1 (555) 123-4567",
    };

    let onSaveMock: ReturnType<typeof vi.fn>;
    let onCancelMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        onSaveMock = vi.fn();
        onCancelMock = vi.fn();
    });

    const renderComponent = (props = {}) =>
        render(
            <ProfilePage
                initialProfileData={mockProfileData}
                onSave={onSaveMock}
                onCancel={onCancelMock}
                {...props}
            />
        );

    /* --------------------------------- */
    it("renders loading state when isLoading is true", () => {
        renderComponent({ isLoading: true });
        expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
    });

    /* --------------------------------- */
    it("renders profile header with default title", () => {
        renderComponent();
        expect(screen.getByText("Profile Settings")).toBeInTheDocument();
    });

    /* --------------------------------- */
    it("renders custom header title when provided", () => {
        renderComponent({ headerTitle: "My Custom Profile" });
        expect(screen.getByText("My Custom Profile")).toBeInTheDocument();
    });

    /* --------------------------------- */
    it("renders edit button in non-edit mode", () => {
        renderComponent();
        expect(screen.getByRole("button", { name: /edit profile/i })).toBeInTheDocument();
    });

    /* --------------------------------- */
    it("enters edit mode when edit button is clicked", async () => {
        const user = userEvent.setup();
        renderComponent();

        const editButton = screen.getByRole("button", { name: /edit profile/i });
        await user.click(editButton);

        // Should see input fields
        const displayNameInput = screen.getByTestId("field-display-name");
        expect(displayNameInput).toBeInTheDocument();

        const jobTitleInput = screen.getByTestId("field-job-title");
        expect(jobTitleInput).toBeInTheDocument();
    });

    /* --------------------------------- */
    it("calls onCancel when cancel button is clicked in edit mode", async () => {
        const user = userEvent.setup();
        renderComponent();

        // Enter edit mode
        await user.click(screen.getByRole("button", { name: /edit profile/i }));

        // Click cancel
        await user.click(screen.getByTestId("cancel-button"));

        expect(onCancelMock).toHaveBeenCalled();
    });

    /* --------------------------------- */
    it("saves profile data when save button is clicked", async () => {
        const user = userEvent.setup();
        const mockSave = vi.fn().mockResolvedValue(undefined);

        renderComponent({ onSave: mockSave });

        // Enter edit mode
        await user.click(screen.getByRole("button", { name: /edit profile/i }));

        // Change some data
        const displayNameInput = screen.getByTestId("field-display-name");
        await user.clear(displayNameInput);
        await user.type(displayNameInput, "Jane Smith");

        // Click save
        await user.click(screen.getByTestId("save-button"));

        expect(mockSave).toHaveBeenCalled();
    });

    /* --------------------------------- */
    it("shows saving state while saving", async () => {
        const user = userEvent.setup();
        const mockSave = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

        renderComponent({ onSave: mockSave });

        // Enter edit mode
        await user.click(screen.getByRole("button", { name: /edit profile/i }));

        // Click save
        await user.click(screen.getByTestId("save-button"));

        // Button should show saving state
        expect(screen.getByText("Saving...")).toBeInTheDocument();
        expect(screen.getByTestId("save-button")).toBeDisabled();
    });

    /* --------------------------------- */
    it("shows success notification after successful save", async () => {
        const user = userEvent.setup();
        const mockSave = vi.fn().mockResolvedValue(undefined);

        renderComponent({ onSave: mockSave, showSaveNotification: true });

        // Enter edit mode
        await user.click(screen.getByRole("button", { name: /edit profile/i }));

        // Click save
        await user.click(screen.getByTestId("save-button"));

        // Wait for notification
        await waitFor(() => {
            expect(screen.getByText("Changes saved successfully!")).toBeInTheDocument();
        });
    });

    /* --------------------------------- */
    it("shows error notification when save fails", async () => {
        const user = userEvent.setup();
        const mockSave = vi.fn().mockRejectedValue(new Error("Save failed"));

        renderComponent({ onSave: mockSave });

        // Enter edit mode
        await user.click(screen.getByRole("button", { name: /edit profile/i }));

        // Click save
        await user.click(screen.getByTestId("save-button"));

        // Wait for error notification
        await waitFor(() => {
            expect(screen.getByText(/failed to save changes/i)).toBeInTheDocument();
        });
    });

    /* --------------------------------- */
    it("updates social links in edit mode", async () => {
        const user = userEvent.setup();
        renderComponent();

        // Enter edit mode
        await user.click(screen.getByRole("button", { name: /edit profile/i }));

        // Edit Twitter URL
        const twitterUrlInput = screen.getByTestId("url-input-0");
        await user.clear(twitterUrlInput);
        await user.type(twitterUrlInput, "https://twitter.com/janedoe");

        // Click save
        await user.click(screen.getByTestId("save-button"));

        expect(onSaveMock).toHaveBeenCalled();
    });

    /* --------------------------------- */
    it("adds new social link when plus button is clicked", async () => {
        const user = userEvent.setup();
        renderComponent();

        // Enter edit mode
        await user.click(screen.getByRole("button", { name: /edit profile/i }));

        // Click add new social link button
        const addButton = screen.getByTestId("add-link-button");
        await user.click(addButton);

        // Should have 3 social link inputs (2 existing + 1 new)
        const platformInputs = screen.getAllByTestId(/^platform-input-/);
        expect(platformInputs.length).toBe(3);
    });

    /* --------------------------------- */
    it("removes social link when trash button is clicked", async () => {
        const user = userEvent.setup();
        renderComponent();

        // Enter edit mode
        await user.click(screen.getByRole("button", { name: /edit profile/i }));

        // Click remove button for first social link
        const removeButton = screen.getByTestId("remove-link-0");
        await user.click(removeButton);

        // Should have 1 social link left
        const platformInputs = screen.getAllByTestId(/^platform-input-/);
        expect(platformInputs.length).toBe(1);
    });

    /* --------------------------------- */
    it("handles bio textarea updates", async () => {
        const user = userEvent.setup();
        renderComponent();

        // Enter edit mode
        await user.click(screen.getByRole("button", { name: /edit profile/i }));

        // Update bio
        const bioTextarea = screen.getByTestId("field-textarea");
        await user.clear(bioTextarea);
        await user.type(bioTextarea, "New bio text");

        expect(bioTextarea).toHaveValue("New bio text");
    });

    /* --------------------------------- */
    it("renders custom notification when provided", async () => {
        const customNotification = <div data-testid="custom-notification">Custom Notification</div>;
        const user = userEvent.setup();

        renderComponent({ customNotification });

        // Enter edit mode to show notification
        await user.click(screen.getByRole("button", { name: /edit profile/i }));

        expect(screen.getByTestId("custom-notification")).toBeInTheDocument();
    });

    /* --------------------------------- */
    it("renders custom header when provided", () => {
        const customHeader = <div data-testid="custom-header">Custom Header</div>;
        renderComponent({ customHeader });
        expect(screen.getByTestId("custom-header")).toBeInTheDocument();
    });

    /* --------------------------------- */
    it("does not show notification when showSaveNotification is false", async () => {
        const user = userEvent.setup();
        const mockSave = vi.fn().mockResolvedValue(undefined);

        renderComponent({
            onSave: mockSave,
            showSaveNotification: false,
            saveNotificationMessage: "This should not appear"
        });

        // Enter edit mode
        await user.click(screen.getByRole("button", { name: /edit profile/i }));

        // Click save
        await user.click(screen.getByTestId("save-button"));

        // Wait a bit
        await waitFor(() => {
            expect(screen.queryByText("This should not appear")).not.toBeInTheDocument();
        });
    });
});