import { describe, expect, it } from "vitest";
import { dataMode } from "@/lib/runtime";
import { isAdminEmail } from "@/lib/admin";

describe("data mode", () => {
  it("uses memory only when asked and never on production", () => {
    expect(dataMode({ DATA_STORE: "memory" }, false)).toBe("memory");
    expect(
      dataMode({ DATA_STORE: "memory", VERCEL_ENV: "production" }, true),
    ).toBe("supabase");
    expect(
      dataMode({ DATA_STORE: "memory", VERCEL_ENV: "production" }, false),
    ).toBe("none");
  });

  it("uses Supabase when configured, else none", () => {
    expect(dataMode({}, true)).toBe("supabase");
    expect(dataMode({}, false)).toBe("none");
  });
});

describe("admin emails", () => {
  it("matches case-insensitively and never an empty list", () => {
    expect(isAdminEmail("Joe@Example.com", "joe@example.com, a@b.c")).toBe(
      true,
    );
    expect(isAdminEmail("x@example.com", "joe@example.com")).toBe(false);
    expect(isAdminEmail("joe@example.com", "")).toBe(false);
  });
});
