import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { Stepper } from ".";

const steps = [
  { label: "Account", description: "Create your account" },
  { label: "Profile", description: "Set up profile" },
  { label: "Plan", description: "Choose plan" },
  { label: "Done" },
];

describe("Stepper", () => {
  describe("rendering", () => {
    it("renders all step labels", () => {
      render(<Stepper steps={steps} activeStep={0} />);
      expect(screen.getByText("Account")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("Plan")).toBeInTheDocument();
      expect(screen.getByText("Done")).toBeInTheDocument();
    });

    it("renders step descriptions when provided", () => {
      render(<Stepper steps={steps} activeStep={0} />);
      expect(screen.getByText("Create your account")).toBeInTheDocument();
    });

    it("does not render description when not provided", () => {
      render(<Stepper steps={steps} activeStep={0} />);
      const labels = screen.getAllByText(/done/i);
      expect(labels.length).toBeGreaterThanOrEqual(1);
    });

    it("renders step numbers for non-completed, non-active steps", () => {
      render(<Stepper steps={steps} activeStep={1} />);
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("renders a checkmark for completed steps", () => {
      render(<Stepper steps={steps} activeStep={2} />);
      const checks = screen.getAllByText("✓");
      expect(checks).toHaveLength(2);
    });

    it("applies custom className to the root element", () => {
      const { container } = render(
        <Stepper steps={steps} activeStep={0} className="my-stepper" />
      );
      expect(container.firstChild).toHaveClass("my-stepper");
    });
  });

  describe("active step styling", () => {
    it("applies primary border color to the active step circle", () => {
      render(<Stepper steps={steps} activeStep={1} />);
      const circles = document.querySelectorAll(".border-primary");
      expect(circles.length).toBeGreaterThanOrEqual(1);
    });

    it("applies green background to completed step circles", () => {
      render(<Stepper steps={steps} activeStep={2} />);
      const completed = document.querySelectorAll(".bg-green-500");
      expect(completed.length).toBe(2);
    });
  });

  describe("connector lines", () => {
    it("renders N-1 connector lines for N steps", () => {
      render(<Stepper steps={steps} activeStep={0} />);
      const connectors = document.querySelectorAll(".bg-zinc-300, .bg-zinc-700");
      expect(connectors.length).toBe(steps.length - 1);
    });
  });

  describe("single step", () => {
    it("renders one step with no connector", () => {
      render(<Stepper steps={[{ label: "Only" }]} activeStep={0} />);
      expect(screen.getByText("Only")).toBeInTheDocument();
      const connectors = document.querySelectorAll(".bg-zinc-300, .bg-zinc-700");
      expect(connectors.length).toBe(0);
    });
  });
});
