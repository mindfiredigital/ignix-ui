import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AITemperatureSlider } from "./index";
import React from "react";

describe("AITemperatureSlider component test suite", () => {
  it("renders with defaultValue successfully", () => {
    render(<AITemperatureSlider defaultValue={0.8} />);
    // Displayed temperature label should show 0.8
    expect(screen.getByText("0.8")).toBeInTheDocument();
  });

  it("calls onChange callback when preset value is clicked", () => {
    const handleChange = vi.fn();
    render(<AITemperatureSlider value={0.7} onChange={handleChange} showPresets />);

    const presetBtn = screen.getByText("Creative (1.2)");
    fireEvent.click(presetBtn);
    expect(handleChange).toHaveBeenCalledWith(1.2);
  });

  it("renders quick-snap presets if showPresets is enabled", () => {
    render(<AITemperatureSlider showPresets />);
    expect(screen.getByText("Precise (0.2)")).toBeInTheDocument();
    expect(screen.getByText("Balanced (0.7)")).toBeInTheDocument();
    expect(screen.getByText("Creative (1.2)")).toBeInTheDocument();
  });

  it("shows hallucination risk alert panel if showRiskIndicator is enabled and temp is high", () => {
    const { rerender } = render(<AITemperatureSlider value={0.5} showRiskIndicator />);
    // Under 1.0 hallucination risk warning should not render
    expect(screen.queryByText(/hallucination risk/i)).not.toBeInTheDocument();

    rerender(<AITemperatureSlider value={1.5} showRiskIndicator />);
    expect(screen.getByText(/hallucination risk/i)).toBeInTheDocument();
  });
});
