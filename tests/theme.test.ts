import { describe, expect, it } from "vitest";
import {
  parseThemePreference,
  themeAttribute,
  themeInitScript,
} from "@/lib/theme";

describe("theme", () => {
  it("parses saved preferences, defaulting to system", () => {
    expect(parseThemePreference("dark")).toBe("dark");
    expect(parseThemePreference("blue")).toBe("system");
    expect(parseThemePreference(null)).toBe("system");
  });

  it("lets the media query decide for system", () => {
    expect(themeAttribute("system")).toBeNull();
    expect(themeAttribute("light")).toBe("light");
  });

  it("the init script reads the DiaryLoop key", () => {
    expect(themeInitScript).toContain('"dl-theme"');
  });
});
