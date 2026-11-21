import { describe, expect, it } from "vitest";
import { ageGroup, ageInYears, parseBirthMonth } from "@/lib/age";

const today = new Date(2026, 10, 21); // 2026-11-21

describe("age rules", () => {
  it("accepts YYYY-MM in the past only", () => {
    expect(parseBirthMonth("2008-04", today)).toBe("2008-04");
    expect(parseBirthMonth("2026-12", today)).toBeNull();
    expect(parseBirthMonth("2008-13", today)).toBeNull();
    expect(parseBirthMonth("1890-01", today)).toBeNull();
    expect(parseBirthMonth("04/2008", today)).toBeNull();
    expect(parseBirthMonth(2008, today)).toBeNull();
  });

  it("counts full years from the birth month", () => {
    expect(ageInYears("2013-11", today)).toBe(13);
    expect(ageInYears("2013-12", today)).toBe(12);
  });

  it("groups children, teens, and adults at 13 and 18", () => {
    expect(ageGroup("2013-12", today)).toBe("child");
    expect(ageGroup("2013-11", today)).toBe("teen");
    expect(ageGroup("2008-12", today)).toBe("teen");
    expect(ageGroup("2008-11", today)).toBe("adult");
  });
});
