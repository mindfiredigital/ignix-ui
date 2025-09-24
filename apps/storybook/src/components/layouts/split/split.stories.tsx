import { Split, Left, Right } from ".";

export default {
  title: "Layouts/Split",
  component: Split,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    ratio: {
      control: { type: "select" },
      options: ["30:70", "40:60", "50:50", "60:40", "70:30"],
    },
    mobile: {
      control: { type: "select" },
      options: ["stack", "keep-split", "reverse"],
    },
    gap: {
      control: { type: "select" },
      options: ["none", "small", "normal", "large"],
    },
    minWidth: {
      control: "text",
    },
    resizable: {
      control: "boolean",
    },
  },
};

export const Default = {
  args: {
    ratio: "50:50",
    mobile: "stack",
    gap: "normal",
    minWidth: "300px",
    resizable: false,
    children: [
      <Left key="left">
        <div className="bg-gray-200 dark:bg-gray-800 p-4 h-full text-white">
          Left Panel
        </div>
      </Left>,
      <Right key="right">
        <div className="bg-gray-100 dark:bg-gray-900 p-4 h-full text-white">
          Right Panel
        </div>
      </Right>,
    ],
  },
};

export const Resizable = {
  args: {
    ...Default.args,
    ratio: "30:70",
    resizable: true,
  },
};

export const Dashboard = {
  args: {
    ratio: "20:80",
    mobile: "keep-split",
    gap: "large",
    resizable: true,
    children: [
      <Left key="left">
        <div className="bg-gray-900 text-white p-4 h-full">Sidebar</div>
      </Left>,
      <Right key="right">
        <div className="bg-gray-100 p-4 h-full">Main Dashboard</div>
      </Right>,
    ],
  },
};
