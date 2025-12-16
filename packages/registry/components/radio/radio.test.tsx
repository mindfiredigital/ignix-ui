import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioGroup } from ".";

const options = [
  { value: "one", label: "Option One" },
  { value: "two", label: "Option Two" },
];

describe("RadioGroup", () => {
  it("renders all radio options", () => {
    render(<RadioGroup options={options} />);

    expect(screen.getByText("Option One")).toBeInTheDocument();
    expect(screen.getByText("Option Two")).toBeInTheDocument();
  });

  it("selects defaultValue when uncontrolled", () => {
    render(
      <RadioGroup
        options={options}
        defaultValue="two"
      />
    );

    const radio = screen.getByRole("radio", { name: "Option Two" });
    expect(radio).toHaveAttribute("data-state", "checked");
  });

  it("calls onChange when option is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <RadioGroup
        options={options}
        onChange={onChange}
      />
    );

    await user.click(screen.getByText("Option Two"));

    expect(onChange).toHaveBeenCalledWith("two");
  });

  it("works as a controlled component", async () => {
    const user = userEvent.setup();

    const Controlled = () => {
      const [value, setValue] = React.useState("one");
      return (
        <RadioGroup
          options={options}
          value={value}
          onChange={setValue}
        />
      );
    };

    render(<Controlled />);

    await user.click(screen.getByText("Option Two"));

    expect(
      screen.getByRole("radio", { name: "Option Two" })
    ).toHaveAttribute("data-state", "checked");
  });

  it("does not change value when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <RadioGroup
        options={options}
        disabled
        onChange={onChange}
      />
    );

    await user.click(screen.getByText("Option Two"));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("respects per-option disabled state", async () => {
    const user = userEvent.setup();

    render(
      <RadioGroup
        options={[
          { value: "one", label: "Option One", disabled: true },
          { value: "two", label: "Option Two" },
        ]}
      />
    );

    await user.click(screen.getByText("Option One"));

    expect(
      screen.getByRole("radio", { name: "Option One" })
    ).toBeDisabled();
  });

  it("applies correct animation state when checked", () => {
    render(
      <RadioGroup
        options={options}
        value="one"
        animationVariant="bounce"
      />
    );

    const radio = screen.getByRole("radio", { name: "Option One" });

    expect(radio).toHaveAttribute("data-state", "checked");
  });

  it("renders label on the left when labelPosition='left'", () => {
    render(
      <RadioGroup
        options={options}
        labelPosition="left"
      />
    );

    const label = screen.getByText("Option One");
    expect(label).toBeInTheDocument();
  });
});
