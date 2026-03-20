import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { Dropdown, DropdownItem } from ".";

vi.mock("react-dom", async () => {
  const actual = await vi.importActual("react-dom");
  return { ...actual, createPortal: (node: React.ReactNode) => node };
});

const renderDropdown = (props = {}) =>
  render(
    <Dropdown trigger={<button>Open</button>} {...props}>
      <DropdownItem>Item 1</DropdownItem>
      <DropdownItem>Item 2</DropdownItem>
    </Dropdown>
  );

describe("Dropdown", () => {
  it("renders the trigger", () => {
    renderDropdown();
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
  });

  it("does not show items before trigger is clicked", () => {
    renderDropdown();
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
  });

  it("shows items after trigger click", async () => {
    const user = userEvent.setup();
    renderDropdown();
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("calls onSelect when an item is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Dropdown trigger={<button>Open</button>}>
        <DropdownItem onSelect={onSelect}>Action</DropdownItem>
      </Dropdown>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(screen.getByText("Action"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("applies custom className to DropdownItem", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown trigger={<button>Open</button>}>
        <DropdownItem className="my-item">Click me</DropdownItem>
      </Dropdown>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Click me")).toHaveClass("my-item");
  });
});
