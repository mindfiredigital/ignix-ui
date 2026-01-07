
// constants.test.ts
import { describe, it, expect } from "vitest";
import { SCOPES, STATUS_BADGE_TYPES, STATUS_LABELS, SCOPE_RISK_BADGE_TYPES, generateMockApiKeys } from "../constants";

describe("Constants", () => {
  describe("SCOPES", () => {
    it("contains all scope definitions", () => {
      expect(SCOPES).toHaveLength(6);
      expect(SCOPES.map(s => s.id)).toEqual([
        "read:users",
        "write:users",
        "read:data",
        "write:data",
        "read:analytics",
        "admin",
      ]);
    });

    it("each scope has required properties", () => {
      SCOPES.forEach(scope => {
        expect(scope).toHaveProperty("id");
        expect(scope).toHaveProperty("name");
        expect(scope).toHaveProperty("description");
        expect(scope).toHaveProperty("risk");
        expect(scope).toHaveProperty("icon");
        expect(["low", "medium", "high"]).toContain(scope.risk);
      });
    });

    it("admin scope has high risk", () => {
      const adminScope = SCOPES.find(s => s.id === "admin");
      expect(adminScope?.risk).toBe("high");
    });
  });

  describe("STATUS_BADGE_TYPES", () => {
    it("maps status to badge types correctly", () => {
      expect(STATUS_BADGE_TYPES.active).toBe("success");
      expect(STATUS_BADGE_TYPES.inactive).toBe("warning");
      expect(STATUS_BADGE_TYPES.expired).toBe("error");
      expect(STATUS_BADGE_TYPES.revoked).toBe("error");
    });
  });

  describe("STATUS_LABELS", () => {
    it("maps status to labels correctly", () => {
      expect(STATUS_LABELS.active).toBe("Active");
      expect(STATUS_LABELS.inactive).toBe("Inactive");
      expect(STATUS_LABELS.expired).toBe("Expired");
      expect(STATUS_LABELS.revoked).toBe("Revoked");
    });
  });

  describe("SCOPE_RISK_BADGE_TYPES", () => {
    it("maps risk levels to badge types", () => {
      expect(SCOPE_RISK_BADGE_TYPES.low).toBe("success");
      expect(SCOPE_RISK_BADGE_TYPES.medium).toBe("warning");
      expect(SCOPE_RISK_BADGE_TYPES.high).toBe("error");
    });
  });

  describe("generateMockApiKeys", () => {
    it("generates mock API keys", () => {
      const mockKeys = generateMockApiKeys();
      expect(mockKeys).toBeInstanceOf(Array);
      expect(mockKeys.length).toBeGreaterThan(0);
    });

    it("each key has required properties", () => {
      const mockKeys = generateMockApiKeys();
      mockKeys.forEach(key => {
        expect(key).toHaveProperty("id");
        expect(key).toHaveProperty("name");
        expect(key).toHaveProperty("keyPrefix");
        expect(key).toHaveProperty("keySuffix");
        expect(key).toHaveProperty("scopes");
        expect(key).toHaveProperty("createdAt");
        expect(key).toHaveProperty("status");
        expect(["active", "inactive", "expired", "revoked"]).toContain(key.status);
      });
    });

    it("includes various status types", () => {
      const mockKeys = generateMockApiKeys();
      const statuses = mockKeys.map(k => k.status);
      expect(statuses).toContain("active");
      expect(statuses).toContain("expired");
      expect(statuses).toContain("revoked");
    });
  });
});