export const THEME_STORAGE_KEY = "dl-theme";

export const themePreferences = ["system", "light", "dark"] as const;

export type ThemePreference = (typeof themePreferences)[number];

/** A valid preference, "system" for missing or unknown values. */
export function parseThemePreference(value: unknown): ThemePreference {
  return themePreferences.includes(value as ThemePreference)
    ? (value as ThemePreference)
    : "system";
}

/**
 * The `data-theme` value for <html>. "system" maps to null so the
 * `prefers-color-scheme` media query in globals.css decides.
 */
export function themeAttribute(
  preference: ThemePreference,
): "light" | "dark" | null {
  return preference === "system" ? null : preference;
}

/**
 * Inline script for <head>: runs before first paint so a saved choice
 * never flashes the default. Dependency-free: it's serialized into HTML.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

/** While `change` swaps the theme, colors fade (app/globals.css). */
export function withThemeTransition(change: () => void) {
  if (typeof document === "undefined") return change();
  const root = document.documentElement;
  root.setAttribute("data-theme-switching", "");
  change();
  setTimeout(() => root.removeAttribute("data-theme-switching"), 400);
}
