import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { DialogProvider } from "./index";
import { useDialog } from "./use-dialog";

const DialogExample: React.FC<{
    dialogType?: "success" | "confirm" | "error" | "alert" | "info" | "warning";
    animationKey?: any;
    size?: "sm" | "md" | "lg" | "xl";
    title?: string;
    content?: string;
}> = ({ dialogType, animationKey, size, title, content }) => {
    const { openDialog } = useDialog();

    return (
        <div style={{ padding: "2rem" }}>
            <button
                onClick={() =>
                    openDialog({
                        dialogType,
                        animationKey,
                        size,
                        title,
                        content,
                        confirmationCallBack: (confirm) =>
                            alert(confirm ? " Confirmed!" : " Cancelled"),
                    })
                }
                style={{
                    padding: "10px 20px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                }}
            >
                Open Dialog
            </button>
        </div>
    );
};

const meta: Meta<typeof DialogExample> = {
    title: "Components/DialogBox",
    component: DialogExample,
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component:
                    "A highly customizable Dialog/Modal component with multiple types, animations, sizes, and confirmation callbacks.",
            },
        },
        controls: { expanded: true },
    },
    decorators: [
        (Story) => (
            <DialogProvider>
                <Story />
            </DialogProvider>
        ),
    ],
    argTypes: {
        dialogType: {
            control: "select",
            options: ["success", "confirm", "error", "alert", "info", "warning"],
            description: "Select the type of dialog to display.",
        },
        animationKey: {
            control: "select",
            options: [
                "popIn",
                "springPop",
                "backdropZoom",
                "flip3D",
                "skewSlide",
                "glassBlur",
                "skyDrop",
                "morphSlide",
                "quantumFold",
                "prismBreak",
                "liquidFloat",
                "dimensionRip",
            ],
            description: "Choose an animation style for the dialog.",
        },
        size: {
            control: "radio",
            options: ["sm", "md", "lg", "xl"],
            description: "Dialog box size.",
        },
        title: {
            control: "text",
            description: "Title text for the dialog.",
        },
        content: {
            control: "text",
            description: "Content inside the dialog.",
        },
    },
    args: {
        dialogType: "info",
        animationKey: "popIn",
        size: "md",
        title: "Default Dialog",
        content: "This is a sample dialog content.",
    },
};

export default meta;
type Story = StoryObj<typeof DialogExample>;


export const BasicDialog: Story = {
    args: {
        dialogType: "info",
        title: "Information",
        content: "This is a simple information dialog box.",
    },
    parameters: {
        docs: {
            storyDescription:
                "Use this dialog type to display general information messages to users. No confirmation required.",
        },
    },
};

export const ConfirmDialog: Story = {
    args: {
        dialogType: "confirm",
        title: "Are you sure?",
        content: "Do you really want to delete this item?",
    },
    parameters: {
        docs: {
            storyDescription:
                "A confirmation dialog that executes a callback when the user confirms or cancels. Useful for destructive actions.",
        },
    },
};

export const SuccessDialog: Story = {
    args: {
        dialogType: "success",
        title: "Success!",
        content: "Your operation was completed successfully.",
    },
    parameters: {
        docs: {
            storyDescription:
                "Shows a positive feedback message for successful operations.",
        },
    },
};


export const ErrorDialog: Story = {
    args: {
        dialogType: "error",
        title: "Error!",
        content: "Something went wrong. Please try again.",
    },
    parameters: {
        docs: {
            storyDescription: "Displays an error message to notify the user.",
        },
    },
};
