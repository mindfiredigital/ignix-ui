import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Container } from "./index";
import type { ContainerSize, ContainerPadding } from "./index";

type ContainerArgs = Omit<React.ComponentProps<typeof Container>, 'children'> & {
  children: React.ReactNode;
};

const meta = {
  title: "Layouts/Container",
  component: Container,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A flexible layout wrapper that controls max-width, padding, centering, and responsive gutters. Supports predefined size tokens and arbitrary `maxWidth` values.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["small", "normal", "large", "full", "readable"] satisfies ContainerSize[],
      description: "Predefined max-width token",
      table: { defaultValue: { summary: "normal" } },
    },
    padding: {
      control: "select",
      options: ["none", "small", "normal", "large", "xl"] satisfies ContainerPadding[],
      description: "Internal padding",
      table: { defaultValue: { summary: "normal" } },
    },
    center: {
      control: "boolean",
      description: "Apply `mx-auto` to horizontally center the container",
      table: { defaultValue: { summary: "true" } },
    },
    responsive: {
      control: "boolean",
      description: "Add responsive horizontal gutters (px-4 sm:px-6 lg:px-8)",
      table: { defaultValue: { summary: "true" } },
    },
    maxWidth: {
      control: "text",
      description:
        "Override max-width. Accepts predefined keys (sm/md/lg/xl/full) or any CSS value (e.g. 720px, 75%, 48rem).",
    },
    className: {
      control: "text",
      description: "Extra Tailwind classes merged via `cn()`",
    },
  },
} satisfies Meta<ContainerArgs>;

export default meta;
type Story = StoryObj<Meta<ContainerArgs>>;

const ArticleContent = () => (
  <article className="space-y-4">
    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
      The Container Component
    </h2>
    <p className="text-slate-600 leading-relaxed">
      A well-designed container is invisible. It simply makes the content feel
      at home. This component handles max-width clamping, horizontal centering,
      internal padding, and responsive gutters so you never have to think about
      them again.
    </p>
  </article>
);

const WidthRuler = ({ label }: { label: string }) => (
  <div className="w-full bg-indigo-50 border border-dashed border-indigo-300 rounded-lg p-4 text-center">
    <span className="text-xs font-mono text-indigo-500 uppercase tracking-widest">
      {label}
    </span>
    <div className="mt-2 h-2 rounded-full bg-indigo-200 relative overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-full bg-indigo-400 animate-pulse" />
    </div>
  </div>
);

const CardGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {["Design", "Develop", "Deploy"].map((label) => (
      <div
        key={label}
        className="rounded-xl bg-white border border-slate-200 shadow-sm p-5"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 mb-3" />
        <h3 className="font-semibold text-slate-800">{label}</h3>
        <p className="mt-1 text-sm text-slate-500">
          Placeholder description for the {label.toLowerCase()} stage of your
          workflow.
        </p>
      </div>
    ))}
  </div>
);

export const Default: Story = {
  args: {
    size: "normal",
    padding: "normal",
    center: true,
    responsive: true,
  },
  render: (args) => (
    <div className="min-h-screen bg-slate-100 py-12">
      <Container {...args} className="bg-white rounded-2xl shadow-md">
        <ArticleContent />
      </Container>
    </div>
  ),
};

export const AllSizes: Story = {
  name: "All Sizes",
  render: () => (
    <div className="min-h-screen bg-slate-50 py-10 space-y-6">
      {(["small", "normal", "large", "readable", "full"] as ContainerSize[]).map(
        (size) => (
          <Container key={size} size={size} padding="normal" className="group">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="inline-flex items-center gap-2 mb-2">
                <span className="text-xs font-mono bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                  size="{size}"
                </span>
              </span>
              <WidthRuler label={`max-width • size="${size}"`} />
            </div>
          </Container>
        )
      )}
    </div>
  ),
};

export const CenteredVsNotCentered: Story = {
  name: "Centered vs Not Centered",
  render: () => (
    <div className="min-h-screen bg-slate-100 py-10 space-y-6">
      <p className="px-6 text-xs font-mono text-slate-500 tracking-widest">
        center=true 
      </p>
      <Container size="normal" center={true} className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <ArticleContent />
      </Container>

      <p className="px-6 text-xs font-mono text-slate-500 tracking-widest">
        center=false
      </p>
      <Container size="normal" center={false} className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <ArticleContent />
      </Container>
    </div>
  ),
};

export const Responsive: Story = {
  name: "Responsive",
  render: () => (
      <div>
        <p className="px-4 mb-2 text-xs font-mono text-amber-700 uppercase tracking-widest">
          responsive=true
        </p>
        <Container size="large" responsive={true} className="bg-white border border-amber-200 rounded-xl shadow-sm">
          <CardGrid />
        </Container>
      </div>
  ),
};

export const MaxWidthPredefinedKeys: Story = {
  name: "MaxWidth with predefined keys",
  render: () => (
    <div className="min-h-screen bg-slate-50 py-10 space-y-4">
      {(["sm", "md", "lg", "xl", "full"] as const).map((key) => (
        <Container key={key} maxWidth={key} padding="normal">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <WidthRuler label={`maxWidth="${key}"`} />
          </div>
        </Container>
      ))}
    </div>
  ),
};

export const ClassNamePassthrough: Story = {
  name: "Paasing custom classnames",
  render: () => (
    <div className="min-h-screen bg-slate-100 py-12 space-y-6">
      <Container
        size="normal"
        className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl shadow-xl"
      >
        <p className="text-white font-semibold text-center py-2">
          className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl shadow-xl"
        </p>
      </Container>
      <Container
        size="normal"
        className="border-4 border-dashed border-rose-400 rounded-2xl"
      >
        <p className="text-rose-600 font-semibold text-center py-2">
          className="border-4 border-dashed border-rose-400 rounded-2xl"
        </p>
      </Container>
    </div>
  ),
};