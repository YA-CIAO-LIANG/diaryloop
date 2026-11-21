import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * The color tokens in app/globals.css (docs/design-system.md): every text
 * pair meets WCAG AA in light and dark, and the two dark blocks (system
 * preference and explicit choice) stay identical.
 */
const css = readFileSync("app/globals.css", "utf8");

function tokens(blockStart: string): Record<string, string> {
  const start = css.indexOf(blockStart);
  expect(start, blockStart).toBeGreaterThanOrEqual(0);
  const body = css.slice(start, css.indexOf("}", start));
  return Object.fromEntries(
    [...body.matchAll(/--dl-([\w-]+):\s*(#[0-9a-f]{6});/g)].map((m) => [
      m[1],
      m[2],
    ]),
  );
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const light = tokens('[data-theme="light"] {');
const dark = tokens('[data-theme="dark"] {');
const darkMedia = tokens(':root:not([data-theme="light"]) {');

/** [foreground, background, minimum ratio]. */
const PAIRS: [string, string, number][] = [
  ...["ground", "surface", "band"].flatMap(
    (bg) =>
      [
        ["ink", bg, 4.5],
        ["ink-muted", bg, 4.5],
        ["accent-ink", bg, 4.5],
        ["success", bg, 4.5],
        ["error", bg, 4.5],
      ] as [string, string, number][],
  ),
  ["on-primary", "primary", 4.5],
  ["pal-ink", "pal", 4.5],
  ["ink", "pal", 4.5],
  ["ink", "mark", 4.5],
  ["mark-line", "mark", 3],
  // Non-text: borders, focus rings, icons (WCAG 1.4.11).
  ["accent", "ground", 3],
  ["focus", "ground", 3],
  ["focus", "surface", 3],
  ["primary", "ground", 3],
];

describe("design tokens", () => {
  it("the two dark blocks are identical", () => {
    expect(darkMedia).toEqual(dark);
  });

  it("light and dark define the same tokens", () => {
    expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
  });

  it.each([
    ["light", light],
    ["dark", dark],
  ])("%s: every pair meets its contrast minimum", (_, scheme) => {
    const failures = PAIRS.filter(
      ([fg, bg, min]) => contrast(scheme[fg], scheme[bg]) < min,
    ).map(
      ([fg, bg, min]) =>
        `${fg} on ${bg}: ${contrast(scheme[fg], scheme[bg]).toFixed(2)} < ${min}`,
    );
    expect(failures).toEqual([]);
  });
});
