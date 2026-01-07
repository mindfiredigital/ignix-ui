// constants.ts
import { type NavLink } from "./types";

export const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Contact", href: "#" },
];

export const DEFAULT_Z_INDEX = {
  header: 100,
  footer: 50,
  mobileMenu: 95,
};

export const DEFAULT_ANIMATION_VARIANTS = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
  slide: { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 } },
  scale: { initial: { scale: 0.98, opacity: 0 }, animate: { scale: 1, opacity: 1 } },
  none: { initial: {}, animate: {} },
};

export const FOOTER_CONTENT = {
  default: "© 2025 My Application. All rights reserved.",
};

export const LOGO_TEXT = {
  modern: "YourBrand",
  default: "Logo",
};