/**
 * Age rules (docs/decisions.md D12): under 13 can't use DiaryLoop; 13 to
 * 17 need a parent's or guardian's consent and get the teen rules; 18
 * and over are adults. Only the birth year and month are asked.
 */
export type AgeGroup = "child" | "teen" | "adult";

export const MIN_AGE = 13;
export const ADULT_AGE = 18;

const MONTH = /^(\d{4})-(0[1-9]|1[0-2])$/;

/** "2008-04" if valid and not in the future (or absurdly old), else null. */
export function parseBirthMonth(value: unknown, today: Date): string | null {
  if (typeof value !== "string") return null;
  const match = MONTH.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const nowYear = today.getFullYear();
  const nowMonth = today.getMonth() + 1;
  if (year < nowYear - 120) return null;
  if (year > nowYear || (year === nowYear && month > nowMonth)) return null;
  return value.trim();
}

/**
 * Full years of age, counting from the first day of the birth month
 * (we never ask for the day, so someone may be counted a few days early).
 */
export function ageInYears(birthMonth: string, today: Date): number {
  const [year, month] = birthMonth.split("-").map(Number);
  const months =
    (today.getFullYear() - year) * 12 + (today.getMonth() + 1 - month);
  return Math.floor(months / 12);
}

export function ageGroup(birthMonth: string, today: Date): AgeGroup {
  const age = ageInYears(birthMonth, today);
  if (age < MIN_AGE) return "child";
  if (age < ADULT_AGE) return "teen";
  return "adult";
}
