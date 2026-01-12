// types.test.ts
import { describe, it, expect } from "vitest";
import type {
  ApiKeyScope,
  ApiKey,
  FilterOptions,
  StatsData,
  ApiKeysPageProps,
  NotificationType,
} from "../types";

describe("Type Definitions", () => {
  it("defines valid ApiKeyScope types", () => {
    const validScopes: ApiKeyScope[] = [
      "read:users",
      "write:users",
      "read:data",
      "write:data",
      "read:analytics",
      "admin",
    ];
    
    expect(validScopes).toBeDefined();
  });

  it("ApiKey interface has correct properties", () => {
    const apiKey: ApiKey = {
      id: "1",
      name: "Test Key",
      keyPrefix: "sk_live_",
      keySuffix: "abcd",
      fullKey: "sk_live_test123",
      scopes: ["read:users"],
      createdAt: new Date(),
      lastUsed: new Date(),
      usageCount: 100,
      usageHistory: [{ date: "2024-01-01", count: 50 }],
      status: "active",
      expiresAt: new Date(),
      description: "Test description",
    };

    expect(apiKey.id).toBe("1");
    expect(apiKey.name).toBe("Test Key");
    expect(apiKey.status).toBe("active");
    expect(apiKey.scopes).toContain("read:users");
  });

  it("FilterOptions interface has correct structure", () => {
    const filters: FilterOptions = {
      status: ["active", "revoked"],
      scopes: ["read:users", "write:data"],
      dateRange: {
        start: new Date("2024-01-01"),
        end: new Date("2024-12-31"),
      },
    };

    expect(filters.status).toHaveLength(2);
    expect(filters.scopes).toContain("read:users");
    expect(filters.dateRange.start).toBeInstanceOf(Date);
  });

  it("StatsData interface has correct properties", () => {
    const stats: StatsData = {
      totalKeys: 10,
      activeKeys: 7,
      totalCalls: 15000,
      callsToday: 500,
      revokedKeys: 2,
    };

    expect(stats.totalKeys).toBe(10);
    expect(stats.activeKeys).toBe(7);
    expect(stats.totalCalls).toBe(15000);
    expect(stats.callsToday).toBe(500);
  });

  it("ApiKeysPageProps interface has optional properties", () => {
    const props: ApiKeysPageProps = {
      headerTitle: "Custom Title",
      isLoading: true,
      showStats: false,
      darkMode: true,
    };

    expect(props.headerTitle).toBe("Custom Title");
    expect(props.isLoading).toBe(true);
    expect(props.showStats).toBe(false);
    expect(props.darkMode).toBe(true);
  });

  it("NotificationType interface has correct structure", () => {
    const notification: NotificationType = {
      id: "123",
      type: "success",
      message: "Key generated successfully",
      duration: 3000,
    };

    expect(notification.id).toBe("123");
    expect(notification.type).toBe("success");
    expect(notification.message).toContain("generated");
  });
});