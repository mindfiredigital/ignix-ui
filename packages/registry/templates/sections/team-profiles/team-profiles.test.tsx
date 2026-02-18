// team-profiles.test.tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import React from "react"
import userEvent from "@testing-library/user-event"

// Mock the Button and Typography components
vi.mock("@ignix-ui/button", () => ({
    Button: ({ children, variant, size, onClick, disabled, className, ...props }: any) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={className}
            data-testid="button"
            data-variant={variant}
            data-size={size}
            {...props}
        >
            {children}
        </button>
    )
}))

vi.mock("@ignix-ui/typography", () => ({
    Typography: ({ children, variant, weight, className, ...props }: any) => (
        <div
            className={className}
            data-testid="typography"
            data-variant={variant}
            data-weight={weight}
            {...props}
        >
            {children}
        </div>
    )
}))

// Mock the cn utility
vi.mock("../../../utils/cn", () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(' ')
}))

// Mock framer-motion
vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, className, ...props }: any) => (
            <div className={className} data-testid="motion-div" {...props}>
                {children}
            </div>
        )
    }
}))

// Import components after mocking
import {
    TeamProfiles,
    TeamGrid,
    TeamHeader,
    TeamFooter,
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
    TeamModal,
    SocialIcon,
    type TeamMember
} from "./"

// Mock data for testing
const mockMember: TeamMember = {
    id: "1",
    name: "John Doe",
    role: "Senior Developer",
    bio: "Experienced developer with 10+ years in web technologies",
    photo: "/test-photo.jpg",
    photoAlt: "John Doe profile photo",
    department: "Engineering",
    location: "San Francisco, CA",
    expertise: ["React", "TypeScript", "Node.js"],
    awards: ["Employee of the Year 2023", "Innovation Award"],
    joinDate: "2020-01-15",
    email: "john@example.com",
    socialLinks: [
        { platform: "linkedin", url: "https://linkedin.com/in/johndoe" },
        { platform: "github", url: "https://github.com/johndoe" },
        { platform: "twitter", url: "https://twitter.com/johndoe" }
    ]
}

const mockMembers: TeamMember[] = [
    mockMember,
    {
        id: "2",
        name: "Jane Smith",
        role: "Product Manager",
        bio: "Product leader with focus on user-centered design",
        department: "Product",
        location: "New York, NY",
        expertise: ["Product Strategy", "Agile", "UX Research"],
        socialLinks: [
            { platform: "linkedin", url: "https://linkedin.com/in/janesmith" }
        ]
    },
    {
        id: "3",
        name: "Bob Johnson",
        role: "UX Designer",
        bio: "Creating beautiful and intuitive user experiences",
        photo: "/bob-photo.jpg",
        location: "Austin, TX",
        expertise: ["Figma", "UI Design", "User Research"]
    }
]

describe("TeamProfiles - Core Components", () => {
    describe("Basic TeamProfiles", () => {
        it("renders without crashing", () => {
            render(
                <TeamProfiles>
                    <TeamHeader title="Our Team" />
                    <TeamGrid>
                        {mockMembers.map(member => (
                            <MemberCard key={member.id} member={member}>
                                <MemberContent>
                                    <MemberName>{member.name}</MemberName>
                                    <MemberRole>{member.role}</MemberRole>
                                    {member.bio && <MemberBio>{member.bio}</MemberBio>}
                                </MemberContent>
                            </MemberCard>
                        ))}
                    </TeamGrid>
                </TeamProfiles>
            )

            expect(screen.getByLabelText("Team profiles section")).toBeInTheDocument()
            expect(screen.getByText("Our Team")).toBeInTheDocument()
            expect(screen.getByText("John Doe")).toBeInTheDocument()
            expect(screen.getByText("Jane Smith")).toBeInTheDocument()
            expect(screen.getByText("Bob Johnson")).toBeInTheDocument()
        })

        it("applies dark theme variant", () => {
            render(
                <TeamProfiles variant="dark">
                    <TeamHeader title="Dark Theme Team" />
                </TeamProfiles>
            )

            const section = screen.getByLabelText("Team profiles section")
            expect(section).toBeInTheDocument()
            expect(screen.getByText("Dark Theme Team")).toBeInTheDocument()
        })

        it("applies different card variants", () => {
            const { rerender } = render(
                <TeamProfiles cardVariant="default">
                    <MemberCard member={mockMember}>
                        <MemberName>{mockMember.name}</MemberName>
                    </MemberCard>
                </TeamProfiles>
            )

            expect(screen.getByText("John Doe")).toBeInTheDocument()

            rerender(
                <TeamProfiles cardVariant="elevated">
                    <MemberCard member={mockMember}>
                        <MemberName>{mockMember.name}</MemberName>
                    </MemberCard>
                </TeamProfiles>
            )

            expect(screen.getByText("John Doe")).toBeInTheDocument()
        })

        it("applies accessibility attributes", () => {
            render(
                <TeamProfiles ariaLabel="Custom team section">
                    <div>Team Content</div>
                </TeamProfiles>
            )

            expect(screen.getByLabelText("Custom team section")).toBeInTheDocument()
            expect(screen.getByText("Team Content")).toBeInTheDocument()
        })
    })

    describe("MemberCard Components", () => {
        it("renders member card with all basic information", () => {
            render(
                <TeamProfiles>
                    <MemberCard member={mockMember}>
                        <MemberPhoto src={mockMember.photo} alt={mockMember.photoAlt} />
                        <MemberContent>
                            <MemberName>{mockMember.name}</MemberName>
                            <MemberRole>{mockMember.role}</MemberRole>
                            <MemberBio>{mockMember.bio}</MemberBio>
                        </MemberContent>
                    </MemberCard>
                </TeamProfiles>
            )

            expect(screen.getByText("John Doe")).toBeInTheDocument()
            expect(screen.getByText("Senior Developer")).toBeInTheDocument()
            expect(screen.getByText(/Experienced developer/i)).toBeInTheDocument()

            const image = screen.getByAltText("John Doe profile photo")
            expect(image).toBeInTheDocument()
            expect(image).toHaveAttribute("src", "/test-photo.jpg")
        })

        it("handles image load error by showing initials", async () => {
            render(
                <TeamProfiles>
                    <MemberCard member={mockMember}>
                        <MemberPhoto src="invalid-image.jpg" alt="Invalid" />
                        <MemberName>{mockMember.name}</MemberName>
                    </MemberCard>
                </TeamProfiles>
            )

            const image = screen.getByAltText("Invalid")

            // Trigger error event
            image.dispatchEvent(new Event('error'))

            // Wait for fallback to appear
            await waitFor(() => {
                expect(screen.queryByAltText("Invalid")).not.toBeInTheDocument()
            })
        })

        it("shows initials when no photo provided", () => {
            render(
                <TeamProfiles>
                    <MemberCard member={mockMember}>
                        <MemberPhoto initials="JD" />
                        <MemberName>{mockMember.name}</MemberName>
                    </MemberCard>
                </TeamProfiles>
            )

            expect(screen.getByText("JD")).toBeInTheDocument()
        })

        it("handles member card click", async () => {
            const mockClick = vi.fn()
            const user = userEvent.setup()

            render(
                <TeamProfiles onMemberClick={mockClick}>
                    <MemberCard member={mockMember}>
                        <MemberName>{mockMember.name}</MemberName>
                    </MemberCard>
                </TeamProfiles>
            )

            await user.click(screen.getByRole("article"))
            expect(mockClick).toHaveBeenCalledWith(mockMember)
        })
    })

    describe("Additional Information Components", () => {
        it("renders department information", () => {
            render(
                <TeamProfiles showDepartment>
                    <MemberCard member={mockMember}>
                        <MemberContent>
                            <MemberName>{mockMember.name}</MemberName>
                            <MemberDepartment>{mockMember.department}</MemberDepartment>
                        </MemberContent>
                    </MemberCard>
                </TeamProfiles>
            )

            expect(screen.getByText("Engineering")).toBeInTheDocument()
        })

        it("renders location information", () => {
            render(
                <TeamProfiles showLocation>
                    <MemberCard member={mockMember}>
                        <MemberContent>
                            <MemberName>{mockMember.name}</MemberName>
                            <MemberLocation>{mockMember.location}</MemberLocation>
                        </MemberContent>
                    </MemberCard>
                </TeamProfiles>
            )

            expect(screen.getByText("San Francisco, CA")).toBeInTheDocument()
        })

        it("renders expertise tags", () => {
            render(
                <TeamProfiles showExpertise>
                    <MemberCard member={mockMember}>
                        <MemberContent>
                            <MemberName>{mockMember.name}</MemberName>
                            <MemberExpertise items={mockMember.expertise || []} />
                        </MemberContent>
                    </MemberCard>
                </TeamProfiles>
            )

            expect(screen.getByText("React")).toBeInTheDocument()
            expect(screen.getByText("TypeScript")).toBeInTheDocument()
            expect(screen.getByText("Node.js")).toBeInTheDocument()
        })

        it("limits expertise tags with +remaining indicator", () => {
            const manySkills = ["React", "TypeScript", "Node.js", "GraphQL", "Docker"]

            render(
                <TeamProfiles showExpertise>
                    <MemberCard member={mockMember}>
                        <MemberContent>
                            <MemberName>{mockMember.name}</MemberName>
                            <MemberExpertise items={manySkills} limit={3} />
                        </MemberContent>
                    </MemberCard>
                </TeamProfiles>
            )

            expect(screen.getByText("+2")).toBeInTheDocument()
        })

        it("renders join date", () => {
            render(
                <TeamProfiles showJoinDate>
                    <MemberCard member={mockMember}>
                        <MemberContent>
                            <MemberName>{mockMember.name}</MemberName>
                            <MemberJoinDate>{mockMember.joinDate}</MemberJoinDate>
                        </MemberContent>
                    </MemberCard>
                </TeamProfiles>
            )

            expect(screen.getByText(/Joined 2020-01-15/i)).toBeInTheDocument()
        })

        it("renders social links", () => {
            render(
                <TeamProfiles showSocialLinks>
                    <MemberCard member={mockMember}>
                        <MemberContent>
                            <MemberName>{mockMember.name}</MemberName>
                            <MemberSocialLinks
                                links={mockMember.socialLinks || []}
                                memberId={mockMember.id}
                                memberName={mockMember.name}
                            />
                        </MemberContent>
                    </MemberCard>
                </TeamProfiles>
            )

            const socialButtons = screen.getAllByRole("button")
            expect(socialButtons.length).toBe(3)
        })

        it("handles social link click", async () => {
            const mockSocialClick = vi.fn()
            const user = userEvent.setup()

            // Mock window.open
            const mockOpen = vi.spyOn(window, 'open').mockImplementation(() => null)

            render(
                <TeamProfiles onSocialClick={mockSocialClick}>
                    <MemberCard member={mockMember}>
                        <MemberContent>
                            <MemberName>{mockMember.name}</MemberName>
                            <MemberSocialLinks
                                links={mockMember.socialLinks || []}
                                memberId={mockMember.id}
                                memberName={mockMember.name}
                            />
                        </MemberContent>
                    </MemberCard>
                </TeamProfiles>
            )

            const socialButtons = screen.getAllByRole("button")
            await user.click(socialButtons[0])

            expect(mockSocialClick).toHaveBeenCalled()
            expect(mockOpen).toHaveBeenCalled()

            mockOpen.mockRestore()
        })
    })

    describe("TeamGrid Component", () => {
        it("renders grid with specified columns", () => {
            render(
                <TeamProfiles>
                    <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
                        {mockMembers.map(member => (
                            <MemberCard key={member.id} member={member}>
                                <MemberName>{member.name}</MemberName>
                            </MemberCard>
                        ))}
                    </TeamGrid>
                </TeamProfiles>
            )

            expect(screen.getByText("John Doe")).toBeInTheDocument()
            expect(screen.getByText("Jane Smith")).toBeInTheDocument()
            expect(screen.getByText("Bob Johnson")).toBeInTheDocument()
        })
    })

    describe("TeamHeader and TeamFooter", () => {
        it("renders header with title and subtitle", () => {
            render(
                <TeamProfiles>
                    <TeamHeader
                        title="Meet Our Team"
                        subtitle="Talented professionals ready to help you"
                    />
                </TeamProfiles>
            )

            expect(screen.getByText("Meet Our Team")).toBeInTheDocument()
            expect(screen.getByText("Talented professionals ready to help you")).toBeInTheDocument()
        })

        it("renders custom header content", () => {
            render(
                <TeamProfiles>
                    <TeamHeader>
                        <h2>Custom Header</h2>
                        <p>Custom description</p>
                    </TeamHeader>
                </TeamProfiles>
            )

            expect(screen.getByText("Custom Header")).toBeInTheDocument()
            expect(screen.getByText("Custom description")).toBeInTheDocument()
        })

        it("renders footer", () => {
            render(
                <TeamProfiles>
                    <TeamFooter>
                        <button>View All Team Members</button>
                    </TeamFooter>
                </TeamProfiles>
            )

            expect(screen.getByRole("button", { name: "View All Team Members" })).toBeInTheDocument()
        })
    })

    describe("MemberCardOverlay", () => {
        it("renders overlay with default content", () => {
            render(
                <TeamProfiles>
                    <MemberCard member={mockMember}>
                        <MemberName>{mockMember.name}</MemberName>
                        <MemberCardOverlay />
                    </MemberCard>
                </TeamProfiles>
            )

            // The overlay content might not be visible but should be in the DOM
            expect(screen.getByRole("article")).toBeInTheDocument()
        })

        it("renders overlay with custom content", () => {
            render(
                <TeamProfiles>
                    <MemberCard member={mockMember}>
                        <MemberName>{mockMember.name}</MemberName>
                        <MemberCardOverlay>
                            <span>Quick View</span>
                        </MemberCardOverlay>
                    </MemberCard>
                </TeamProfiles>
            )

            expect(screen.getByText("Quick View")).toBeInTheDocument()
        })
    })

    describe("TeamModal", () => {
        it("renders modal when open", () => {
            const handleClose = vi.fn()
            render(
                <TeamProfiles enableModal>
                    <TeamModal
                        isOpen={true}
                        onClose={handleClose}
                        member={mockMember}
                    />
                </TeamProfiles>
            )

            expect(screen.getByRole("dialog")).toBeInTheDocument()
            expect(screen.getByText("John Doe")).toBeInTheDocument()
            expect(screen.getByText("Senior Developer")).toBeInTheDocument()
        })

        it("does not render modal when closed", () => {
            const handleClose = vi.fn()
            render(
                <TeamProfiles enableModal>
                    <TeamModal
                        isOpen={false}
                        onClose={handleClose}
                        member={mockMember}
                    />
                </TeamProfiles>
            )

            expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
        })

        it("closes modal when backdrop is clicked", async () => {
            const mockClose = vi.fn()
            const user = userEvent.setup()

            render(
                <TeamProfiles enableModal>
                    <TeamModal
                        isOpen={true}
                        onClose={mockClose}
                        member={mockMember}
                    />
                </TeamProfiles>
            )

            const backdrop = screen.getByRole("dialog")
            await user.click(backdrop)

            expect(mockClose).toHaveBeenCalled()
        })

        it("closes modal when close button is clicked", async () => {
            const mockClose = vi.fn()
            const user = userEvent.setup()

            render(
                <TeamProfiles enableModal>
                    <TeamModal
                        isOpen={true}
                        onClose={mockClose}
                        member={mockMember}
                    />
                </TeamProfiles>
            )

            const closeButton = screen.getByLabelText("Close modal")
            await user.click(closeButton)

            expect(mockClose).toHaveBeenCalled()
        })

        it("shows initials in modal when no photo", () => {
            const memberWithoutPhoto = { ...mockMember, photo: undefined }
            const handleClose = vi.fn()
            render(
                <TeamProfiles enableModal>
                    <TeamModal
                        isOpen={true}
                        onClose={handleClose}
                        member={memberWithoutPhoto}
                    />
                </TeamProfiles>
            )

            expect(screen.getByText("JD")).toBeInTheDocument()
        })
    })

    describe("SocialIcon Component", () => {
        it("renders correct icon for each platform", () => {
            // Since SocialIcon renders an SVG directly, we need to check for the SVG elements
            const { rerender } = render(<SocialIcon platform="linkedin" />)
            expect(document.querySelector('.lucide-linkedin')).toBeInTheDocument()

            rerender(<SocialIcon platform="github" />)
            expect(document.querySelector('.lucide-github')).toBeInTheDocument()

            rerender(<SocialIcon platform="twitter" />)
            expect(document.querySelector('.lucide-twitter')).toBeInTheDocument()

            rerender(<SocialIcon platform="website" />)
            expect(document.querySelector('.lucide-globe')).toBeInTheDocument()

            rerender(<SocialIcon platform="email" />)
            expect(document.querySelector('.lucide-mail')).toBeInTheDocument()

            rerender(<SocialIcon platform="other" />)
            expect(document.querySelector('.lucide-globe')).toBeInTheDocument()
        })
        it("applies custom className to icons", () => {
            render(<SocialIcon platform="linkedin" className="custom-class" />)
            const icon = document.querySelector('.lucide-linkedin')
            expect(icon).toHaveClass('custom-class')
        })
    })
})

describe("TeamProfiles - Integration Tests", () => {
    it("renders complete team section with all features", () => {
        render(
            <TeamProfiles
                variant="gradient"
                cardVariant="elevated"
                showBio
                showSocialLinks
                showDepartment
                showLocation
                showExpertise
                showAwards
                showJoinDate
                enableHover
            >
                <TeamHeader
                    title="Our Amazing Team"
                    subtitle="Meet the people behind our success"
                />
                <TeamGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
                    {mockMembers.map(member => (
                        <MemberCard key={member.id} member={member}>
                            <MemberPhoto src={member.photo} />
                            <MemberContent>
                                <MemberName>{member.name}</MemberName>
                                <MemberRole>{member.role}</MemberRole>
                                {member.department && <MemberDepartment>{member.department}</MemberDepartment>}
                                {member.location && <MemberLocation>{member.location}</MemberLocation>}
                                {member.bio && <MemberBio lines={3}>{member.bio}</MemberBio>}
                                {member.expertise && <MemberExpertise items={member.expertise} />}
                                {member.awards && <MemberAwards items={member.awards} />}
                                {member.joinDate && <MemberJoinDate>{member.joinDate}</MemberJoinDate>}
                                {member.socialLinks && (
                                    <MemberSocialLinks
                                        links={member.socialLinks}
                                        memberId={member.id}
                                        memberName={member.name}
                                    />
                                )}
                            </MemberContent>
                            <MemberCardOverlay />
                        </MemberCard>
                    ))}
                </TeamGrid>
                <TeamFooter>
                    <button>View All Team Members</button>
                </TeamFooter>
            </TeamProfiles>
        )

        // Check header
        expect(screen.getByText("Our Amazing Team")).toBeInTheDocument()
        expect(screen.getByText("Meet the people behind our success")).toBeInTheDocument()

        // Check all members are present
        expect(screen.getByText("John Doe")).toBeInTheDocument()
        expect(screen.getByText("Jane Smith")).toBeInTheDocument()
        expect(screen.getByText("Bob Johnson")).toBeInTheDocument()

        // Check footer
        expect(screen.getByRole("button", { name: "View All Team Members" })).toBeInTheDocument()
    })

    it("handles modal integration with member click", async () => {
        const user = userEvent.setup()

        render(
            <TeamProfiles enableModal>
                <TeamGrid>
                    {mockMembers.map(member => (
                        <MemberCard key={member.id} member={member}>
                            <MemberName>{member.name}</MemberName>
                        </MemberCard>
                    ))}
                </TeamGrid>
            </TeamProfiles>
        )

        // Get the first member card by its article role
        const memberCards = screen.getAllByRole("article")
        expect(memberCards.length).toBe(3)

        // Click on the first member card (John Doe)
        await user.click(memberCards[0])

        // Modal should appear
        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeInTheDocument()
        })

        // Check modal content - use getAllByText since name appears in both card and modal
        const nameElements = screen.getAllByText("John Doe")
        expect(nameElements.length).toBe(2) // One in card, one in modal
        expect(nameElements[1]).toBeInTheDocument() // The modal one

        // Check other modal content
        expect(screen.getByText("Senior Developer")).toBeInTheDocument()
        expect(screen.getByText("Engineering")).toBeInTheDocument()
        expect(screen.getByText("San Francisco, CA")).toBeInTheDocument()
    })

    it("handles different themes with context propagation", () => {
        const { rerender } = render(
            <TeamProfiles theme="dark">
                <MemberCard member={mockMember}>
                    <MemberName>Dark Theme</MemberName>
                </MemberCard>
            </TeamProfiles>
        )

        expect(screen.getByText("Dark Theme")).toBeInTheDocument()

        rerender(
            <TeamProfiles theme="light">
                <MemberCard member={mockMember}>
                    <MemberName>Light Theme</MemberName>
                </MemberCard>
            </TeamProfiles>
        )

        expect(screen.getByText("Light Theme")).toBeInTheDocument()
    })
})

describe("TeamProfiles - Error Handling and Edge Cases", () => {
    it("throws error when team components used outside TeamProfiles", () => {
        // Suppress console error for this test
        const consoleError = console.error
        console.error = vi.fn()

        expect(() => {
            render(<MemberName>Test</MemberName>)
        }).toThrow('Team components must be used within TeamProfiles')

        console.error = consoleError
    })

    it("handles members with minimal data", () => {
        const minimalMember: TeamMember = {
            id: "4",
            name: "Minimal Member",
            role: "Intern",
            bio: "New team member"
        }

        render(
            <TeamProfiles>
                <MemberCard member={minimalMember}>
                    <MemberName>{minimalMember.name}</MemberName>
                    <MemberRole>{minimalMember.role}</MemberRole>
                    <MemberBio>{minimalMember.bio}</MemberBio>
                </MemberCard>
            </TeamProfiles>
        )

        expect(screen.getByText("Minimal Member")).toBeInTheDocument()
        expect(screen.getByText("Intern")).toBeInTheDocument()
        expect(screen.getByText("New team member")).toBeInTheDocument()
    })

    it("handles empty arrays for optional props", () => {
        const memberWithoutExtras: TeamMember = {
            id: "5",
            name: "No Extras",
            role: "Specialist",
            bio: "Just bio"
        }

        render(
            <TeamProfiles showExpertise showAwards>
                <MemberCard member={memberWithoutExtras}>
                    <MemberName>{memberWithoutExtras.name}</MemberName>
                    <MemberExpertise items={[]} />
                    <MemberAwards items={[]} />
                </MemberCard>
            </TeamProfiles>
        )

        expect(screen.getByText("No Extras")).toBeInTheDocument()
        expect(screen.queryByText("Awards")).not.toBeInTheDocument()
    })


    it("handles different background types", () => {
        const { rerender } = render(
            <TeamProfiles backgroundType="solid" backgroundColor="#ff0000">
                <div>Solid Background</div>
            </TeamProfiles>
        )
        expect(screen.getByText("Solid Background")).toBeInTheDocument()

        rerender(
            <TeamProfiles backgroundType="gradient" gradientFrom="#ff0000" gradientTo="#00ff00">
                <div>Gradient Background</div>
            </TeamProfiles>
        )
        expect(screen.getByText("Gradient Background")).toBeInTheDocument()

        rerender(
            <TeamProfiles backgroundType="image" backgroundImage="/test-bg.jpg">
                <div>Image Background</div>
            </TeamProfiles>
        )
        expect(screen.getByText("Image Background")).toBeInTheDocument()
    })

    it("handles animation props correctly", () => {
        render(
            <TeamProfiles animate={false} animationType="scale" animationDelay={0.2}>
                <MemberCard member={mockMember}>
                    <MemberName>No Animation</MemberName>
                </MemberCard>
            </TeamProfiles>
        )

        expect(screen.getByText("No Animation")).toBeInTheDocument()
    })
})


// Add a new test for the MemberAwards component with custom limit
describe("MemberAwards Component", () => {
    it("displays all awards when limit is higher", () => {
        render(
            <TeamProfiles showAwards>
                <MemberCard member={mockMember}>
                    <MemberContent>
                        <MemberName>{mockMember.name}</MemberName>
                        <MemberAwards items={mockMember.awards || []} limit={2} />
                    </MemberContent>
                </MemberCard>
            </TeamProfiles>
        )

        expect(screen.getByText("Awards")).toBeInTheDocument()
        expect(screen.getByText(/Employee of the Year 2023/i)).toBeInTheDocument()
        expect(screen.getByText(/Innovation Award/i)).toBeInTheDocument()
        expect(screen.queryByText(/\+/)).not.toBeInTheDocument()
    })

    it("shows nothing when items array is empty", () => {
        render(
            <TeamProfiles showAwards>
                <MemberCard member={mockMember}>
                    <MemberContent>
                        <MemberName>{mockMember.name}</MemberName>
                        <MemberAwards items={[]} />
                    </MemberContent>
                </MemberCard>
            </TeamProfiles>
        )

        expect(screen.queryByText("Awards")).not.toBeInTheDocument()
    })
})

// Add a test for the MemberExpertise component with custom limit
describe("MemberExpertise Component", () => {
    it("displays all expertise when limit is higher", () => {
        const expertise = ["React", "TypeScript", "Node.js", "GraphQL"]

        render(
            <TeamProfiles showExpertise>
                <MemberCard member={mockMember}>
                    <MemberContent>
                        <MemberName>{mockMember.name}</MemberName>
                        <MemberExpertise items={expertise} limit={4} />
                    </MemberContent>
                </MemberCard>
            </TeamProfiles>
        )

        expect(screen.getByText("React")).toBeInTheDocument()
        expect(screen.getByText("TypeScript")).toBeInTheDocument()
        expect(screen.getByText("Node.js")).toBeInTheDocument()
        expect(screen.getByText("GraphQL")).toBeInTheDocument()
        expect(screen.queryByText(/\+/)).not.toBeInTheDocument()
    })
})