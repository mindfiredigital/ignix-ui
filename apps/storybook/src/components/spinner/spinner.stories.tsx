import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./index";

const Card = ({
  children,
  label,
  dark = false,
}: {
  children: React.ReactNode;
  label?: string;
  dark?: boolean;
}) => (
  <div
    className={[
      "flex flex-col items-center justify-center gap-3.5",
      "px-8 py-7 rounded-2xl min-w-[120px] min-h-[120px]",
      dark
        ? "bg-gradient-to-br from-[#0f0f13] to-[#1a1a24] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_8px_32px_rgba(0,0,0,0.4)]"
        : "bg-gradient-to-br from-white to-[#f4f4f8] shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_8px_32px_rgba(0,0,0,0.08)]",
    ].join(" ")}
  >
    {children}
    {label && (
      <span
        className={[
          "font-mono text-[11px] tracking-widest uppercase",
          dark ? "text-white/35" : "text-black/35",
        ].join(" ")}
      >
        {label}
      </span>
    )}
  </div>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-5 flex-wrap">{children}</div>
);

const SectionLabel = ({
  children,
  dark,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) => (
  <p
    className={[
      "font-mono text-[10px] tracking-[0.14em] uppercase mb-2",
      dark ? "text-white/25" : "text-black/30",
    ].join(" ")}
  >
    {children}
  </p>
);


const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "slate",
      values: [
        { name: "slate", value: "#0d0d12" },
        { name: "white", value: "#ffffff" },
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;


export const Default: Story = {
  args: { variant: "default", size: 40, thickness: 4, color: "bg-indigo-500" },
  decorators: [
    (Story) => (
      <Card dark label="default">
        <Story />
      </Card>
    ),
  ],
};

export const Bars: Story = {
  args: { variant: "bars", size: 48, color: "bg-indigo-400" },
  decorators: [
    (Story) => (
      <Card dark label="bars">
        <Story />
      </Card>
    ),
  ],
};

export const DotsBounce: Story = {
  name: "Dots Bounce",
  args: { variant: "dots-bounce", thickness: 12, color: "bg-indigo-400" },
  decorators: [
    (Story) => (
      <Card dark label="dots-bounce">
        <Story />
      </Card>
    ),
  ],
};

export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <Row>
      <Card dark label="default">
        <Spinner variant="default" size={40} thickness={4} color="bg-indigo-500" />
      </Card>
      <Card dark label="bars">
        <Spinner variant="bars" size={48} color="bg-indigo-400" />
      </Card>
      <Card dark label="dots-bounce">
        <Spinner variant="dots-bounce" thickness={12} color="bg-indigo-400" />
      </Card>
    </Row>
  ),
};

export const SizeScale: Story = {
  name: "Size Scale",
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <SectionLabel dark>default ring</SectionLabel>
        <Row>
          {[20, 32, 48, 64, 80].map((s) => (
            <Card key={s} dark label={`${s}px`}>
              <Spinner
                variant="default"
                size={s}
                thickness={Math.max(2, s / 10)}
                color="bg-indigo-500"
              />
            </Card>
          ))}
        </Row>
      </div>

      <div>
        <SectionLabel dark>bars</SectionLabel>
        <Row>
          {[20, 32, 48, 64, 80].map((s) => (
            <Card key={s} dark label={`${s}px`}>
              <Spinner variant="bars" size={s} color="bg-violet-400" />
            </Card>
          ))}
        </Row>
      </div>

      <div>
        <SectionLabel dark>dots-bounce</SectionLabel>
        <Row>
          {[6, 8, 12, 16, 20].map((t) => (
            <Card key={t} dark label={`dot ${t}px`}>
              <Spinner variant="dots-bounce" thickness={t} color="bg-sky-400" />
            </Card>
          ))}
        </Row>
      </div>
    </div>
  ),
};

export const OnLightBackground: Story = {
  name: "On Light Background",
  render: () => (
    <Row>
      <Card label="default">
        <Spinner variant="default" size={40} thickness={4} color="bg-indigo-600" />
      </Card>
      <Card label="bars">
        <Spinner variant="bars" size={48} color="bg-indigo-500" />
      </Card>
      <Card label="dots-bounce">
        <Spinner variant="dots-bounce" thickness={12} color="bg-indigo-500" />
      </Card>
    </Row>
  ),
};

export const InsideButton: Story = {
  name: "Inside Button",
  render: () => (
    <Row>
      <button
        disabled
        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border-none font-mono text-[13px] font-semibold tracking-wide text-white cursor-not-allowed bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_4px_14px_rgba(99,102,241,0.4)] opacity-80"
      >
        <Spinner variant="default" size={16} thickness={2} color="bg-white" />
        Saving…
      </button>
      <button
        disabled
        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-mono text-[13px] font-semibold tracking-wide text-slate-300 cursor-not-allowed border border-white/10 bg-white/5"
      >
        <Spinner variant="bars" size={16} color="bg-slate-300" />
        Loading…
      </button>
      <button
        disabled
        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border-none font-mono text-[13px] font-semibold tracking-wide text-white cursor-not-allowed bg-gradient-to-r from-rose-500 to-pink-500 shadow-[0_4px_14px_rgba(244,63,94,0.35)] opacity-80"
      >
        <Spinner variant="default" size={16} thickness={2} color="bg-white" />
        Deleting…
      </button>
    </Row>
  ),
};