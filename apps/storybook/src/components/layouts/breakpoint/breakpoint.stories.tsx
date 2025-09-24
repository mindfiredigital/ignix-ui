import { Breakpoint } from "./index";

export default {
  title: "Layouts/Breakpoint",
  component: Breakpoint,
   tags: ['autodocs'],
  argTypes: {
    show: {
      control: { type: "select" },
      options: ["mobile", "tablet", "desktop"],
    },
    hide: {
      control: { type: "select" },
      options: ["mobile", "tablet", "desktop"],
    },
    from: {
      control: { type: "select" },
      options: ["mobile", "tablet", "desktop"],
    },
    to: {
      control: { type: "select" },
      options: ["mobile", "tablet", "desktop"],
    },
  },
};


const Template: ComponentStory<typeof Breakpoint> = (args) => (
  <Breakpoint {...args}>
    <p>This content is conditionally rendered based on the viewport size.</p>
  </Breakpoint>
);

export const ShowMobile = Template.bind({});
ShowMobile.args = {
  show: "mobile",
};

export const HideDesktop = Template.bind({});
HideDesktop.args = {
  hide: "desktop",
};

export const FromTabletToDesktop = Template.bind({});
FromTabletToDesktop.args = {
  from: "tablet",
  to: "desktop",
};

export const CustomRange = Template.bind({});
CustomRange.args = {
  from: "mobile",
  to: "tablet",
};