import { LazyLoad } from "./index";

export default {
  title: "Layouts/LazyLoad",
  component: LazyLoad,
   tags: ['autodocs'],
  argTypes: {
    threshold: {
      control: { type: "text" },
      defaultValue: "100px",
    },
    placeholder: {
      control: { type: "text" },
      defaultValue: "Loading...",
    },
    once: {
      control: { type: "boolean" },
      defaultValue: true,
    },
    animation: {
      control: { type: "select" },
      options: ["fade", "slide", "none"],
      defaultValue: "fade",
    },
  },
};

const Template = (args) => (
  <LazyLoad {...args}>
    <div style={{ height: "200px", background: "#ccc" ,display: "flex", 
    justifyContent: "center", 
    alignItems: "center" }}>Loaded Content</div>
  </LazyLoad>
);

export const Default = Template.bind({});
Default.args = {
  threshold: "100px",
  placeholder: <div style={{ height: "200px", background: "#eee" }}>Loading...</div>,
  once: true,
  animation: "fade",
};

export const SlideAnimation = Template.bind({});
SlideAnimation.args = {
  threshold: "50px",
  placeholder: <div style={{ height: "200px", background: "#eee" }}>Loading...</div>,
  once: false,
  animation: "slide",
};