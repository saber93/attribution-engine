import { describe, expect, it } from "vitest";
import { isUuid } from "@/lib/route-params";
import {
  formatCompactCount,
  formatCompactCurrency,
  formatDate,
  formatDateTime,
  formatDetailedCurrency,
  formatMultiplier,
  formatPercentFromRatio,
} from "@/lib/formatters";
import { getCompanyDisplayMeta, getInitials } from "@/lib/display";

describe("shared formatters and helpers", () => {
  it("validates UUIDs", () => {
    expect(isUuid("10000000-0000-4000-8000-000000000001")).toBe(true);
    expect(isUuid("not-a-uuid")).toBe(false);
    expect(isUuid(undefined)).toBe(false);
  });

  it("formats compact currency values", () => {
    expect(formatCompactCurrency(67800)).toBe("$67.8K");
    expect(formatCompactCurrency(950)).toBe("$950");
  });

  it("formats detailed currency values with a null fallback", () => {
    expect(formatDetailedCurrency(125000, "USD")).toBe("$125,000.00");
    expect(formatDetailedCurrency(null, "USD")).toBe("—");
  });

  it("formats compact counts", () => {
    expect(formatCompactCount(5)).toBe("5");
    expect(formatCompactCount(465000)).toBe("465.0K");
  });

  it("formats percentages and multipliers", () => {
    expect(formatPercentFromRatio(0.02597802197802198)).toBe("2.60%");
    expect(formatPercentFromRatio(null)).toBe("—");
    expect(formatMultiplier(7.259100642398286)).toBe("7.26x");
    expect(formatMultiplier(null)).toBe("—");
  });

  it("formats dates and date-times with null handling", () => {
    expect(formatDate("2026-04-20T08:15:00")).toBe("Apr 20, 2026");
    expect(formatDateTime("2026-04-20T08:15:00")).toBe("Apr 20, 2026 8:15 AM");
    expect(formatDate(null)).toBe("—");
    expect(formatDateTime(undefined, "No due date")).toBe("No due date");
  });

  it("formats initials and company display metadata", () => {
    expect(getInitials("TechCorp Solutions")).toBe("TS");
    expect(getInitials("Alex Thompson")).toBe("AT");
    expect(
      getCompanyDisplayMeta({
        websiteUrl: "https://techcorp.example",
        domain: "techcorp.example",
      }),
    ).toBe("https://techcorp.example");
    expect(
      getCompanyDisplayMeta({
        websiteUrl: null,
        domain: "techcorp.example",
      }),
    ).toBe("techcorp.example");
  });
});
