import type { Meta, StoryObj } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import { AICodeBlock } from "./index";

const meta: Meta<typeof AICodeBlock> = {
  title: "Components/AI/AICodeBlock",
  component: AICodeBlock,
  tags: ["autodocs"],
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "dark",
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "A GitHub-style code renderer matching the exact aesthetic of AI assistant chat interfaces. Features streaming-aware rendering, zero-dependency syntax highlighting, copy-to-clipboard, line numbers, and collapsible expand/collapse.",
      },
    },
  },
  argTypes: {
    language: {
      control: "select",
      options: ["typescript", "javascript", "python", "html", "css", "bash", "json"],
    },
    streaming: { control: "boolean" },
    showLineNumbers: { control: "boolean" },
    lineNumberToggle: { control: "boolean" },
    collapsible: { control: "boolean" },
    maxLines: { control: { type: "number", min: 5, max: 50, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<typeof AICodeBlock>;

const tsCode = `import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

async function fetchUser(id: string): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
}

export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading };
}`;

const pyCode = `def bubble_sort(arr: list[int]) -> list[int]:
    """Sort a list using bubble sort algorithm."""
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

numbers = [64, 34, 25, 12, 22, 11, 90]
print(bubble_sort(numbers))`;

const bashCode = `#!/bin/bash
# Setup script for ignix-ui project

set -e

echo "Installing dependencies..."
pnpm install

echo "Building packages..."
pnpm build:packages

echo "Starting dev servers..."
pnpm docs:dev &
pnpm storybook &

echo "Done! Servers running."`;

const jsonCode = `{
  "name": "@mindfiredigital/ignix-ui",
  "version": "1.2.0",
  "description": "Premium animated UI components",
  "keywords": ["react", "ui", "animation", "ai"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "vitest run"
  },
  "dependencies": {
    "framer-motion": "^12.0.0",
    "lucide-react": "^0.400.0"
  }
}`;

export const TypeScript: Story = {
  args: { code: tsCode, language: "typescript", showLineNumbers: false, collapsible: true, maxLines: 10 },
};

export const Python: Story = {
  args: { code: pyCode, language: "python", showLineNumbers: false },
};

export const Bash: Story = {
  args: { code: bashCode, language: "bash", showLineNumbers: false },
};

export const JSON: Story = {
  args: { code: jsonCode, language: "json", showLineNumbers: false },
};

export const WithLineNumbers: Story = {
  args: { code: tsCode, language: "typescript", showLineNumbers: true, collapsible: true, maxLines: 10 },
};

export const Streaming: Story = {
  args: { code: tsCode, language: "typescript", streaming: true, streamSpeed: 12, showLineNumbers: false },
};
