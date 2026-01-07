// constants.test.ts
import { describe, it, expect } from "vitest";
import { defaultProfileData, platformIcons } from "../constants";
import type { ProfileData } from "../types";

describe("Constants", () => {
  describe("defaultProfileData", () => {
    it("should have the correct structure", () => {
      expect(defaultProfileData).toEqual({
        displayName: 'Alex Thompson',
        email: 'alex.thompson@example.com',
        bio: 'Product designer with 8+ years of experience creating digital experiences. Passionate about user-centered design and building products that make a difference.',
        avatarUrl: null,
        socialLinks: [
          { id: '1', platform: 'Twitter', url: 'https://twitter.com/alexthompson' },
          { id: '2', platform: 'GitHub', url: 'https://github.com/alexthompson' },
        ],
        location: 'San Francisco, CA',
        jobTitle: 'Senior Product Designer',
        website: 'https://alexthompson.design',
        phone: '+1 (555) 123-4567',
      });
    });

    it("should be of type ProfileData", () => {
      const profile: ProfileData = defaultProfileData;
      expect(profile).toBeDefined();
      expect(typeof profile.displayName).toBe('string');
      expect(Array.isArray(profile.socialLinks)).toBe(true);
    });
  });

  describe("platformIcons", () => {
    it("should contain all platform icon mappings", () => {
      expect(platformIcons).toEqual({
        twitter: 'twitter',
        github: 'github',
        linkedin: 'linkedin',
        website: 'website',
        default: 'link',
      });
    });

    it("should have string values for all keys", () => {
      Object.values(platformIcons).forEach(value => {
        expect(typeof value).toBe('string');
      });
    });
  });
});