import { Cluster } from ".";

export default {
  title: "Layouts/Cluster",
  component: Cluster,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    spacing: {
      control: { type: "select" },
      options: ["none", "small", "normal", "large"],
    },
    align: {
      control: { type: "select" },
      options: ["start", "center", "end", "stretch", "baseline"],
    },
    justify: {
      control: { type: "select" },
      options: ["start", "center", "end", "between", "around", "evenly"],
    },
    wrap: {
      control: "boolean",
    },
  },
};

export const Default = {
  args: {
    spacing: "normal",
    align: "center",
    justify: "start",
    wrap: true,
    children: [
      <button
        key="1"
        className="px-3 py-1 bg-green-500 text-white rounded"
      >
        Button 1
      </button>,
      <button
        key="2"
        className="px-3 py-1 bg-green-500 text-white rounded"
      >
        Button 2
      </button>,
      <button
        key="3"
        className="px-3 py-1 bg-green-500 text-white rounded"
      >
        Button 3
      </button>,
            <button
            key="3"
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Button 3
          </button>,      <button
        key="3"
        className="px-3 py-1 bg-green-500 text-white rounded"
      >
        Button 3
      </button>,      <button
        key="3"
        className="px-3 py-1 bg-green-500 text-white rounded"
      >
        Button 3
      </button>,      <button
        key="3"
        className="px-3 py-1 bg-green-500 text-white rounded"
      >
        Button 3
      </button>,      <button
        key="3"
        className="px-3 py-1 bg-green-500 text-white rounded"
      >
        Button 3
      </button>,      <button
        key="3"
        className="px-3 py-1 bg-green-500 text-white rounded"
      >
        Button 3
      </button>,      <button
        key="3"
        className="px-3 py-1 bg-green-500 text-white rounded"
      >
        Button 3
      </button>,
    ],
  },
};

export const Tags = {
  args: {
    spacing: "small",
    align: "center",
    justify: "start",
    wrap: true,
    children: [
      <span key="1" className="px-2 py-1 bg-green-200 rounded">
        React
      </span>,
      <span key="2" className="px-2 py-1 bg-green-200 rounded">
        Next.js
      </span>,
      <span key="3" className="px-2 py-1 bg-green-200 rounded">
        Tailwind
      </span>,
      <span key="4" className="px-2 py-1 bg-green-200 rounded">
        Shadcn
      </span>,
    ],
  },
};

export const Navigation = {
  args: {
    spacing: "large",
    align: "center",
    justify: "between",
    wrap: false,
    children: [
      <a key="1" href="#" className="text-blue-500 hover:underline">
        Home
      </a>,
      <a key="2" href="#" className="text-blue-500 hover:underline">
        About
      </a>,
      <a key="3" href="#" className="text-blue-500 hover:underline">
        Services
      </a>,
      <a key="4" href="#" className="text-blue-500 hover:underline">
        Contact
      </a>,
    ],
  },
};
