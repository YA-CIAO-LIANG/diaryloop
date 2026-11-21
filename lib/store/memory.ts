import type { AccountDeleter, Profile, Store } from "./types";

/**
 * The in-memory store (D11) for end-to-end tests and offline development.
 * Kept on globalThis so every server bundle in the process shares one
 * copy. Data is fake and disappears when the server stops.
 */
type MemoryData = { profiles: Map<string, Profile> };

const KEY = Symbol.for("diaryloop.memory-store");

export function memoryData(): MemoryData {
  const global = globalThis as typeof globalThis & { [KEY]?: MemoryData };
  global[KEY] ??= { profiles: new Map() };
  return global[KEY];
}

/**
 * Test accounts: any id like "e2e-free-3" (so parallel tests each get
 * their own), with a fake email. Ids starting "e2e-paid" are on the paid
 * plan; ids starting "e2e-admin" are admins.
 */
export function memoryUserEmail(id: string): string | null {
  return /^e2e-[a-z0-9-]{1,40}$/.test(id) ? `${id}@example.com` : null;
}

export function createMemoryStore(
  data: MemoryData = memoryData(),
): Store & AccountDeleter {
  return {
    async getProfile(userId) {
      const profile = data.profiles.get(userId);
      return profile ? { ...profile } : null;
    },
    async saveProfile(userId, patch) {
      const current = data.profiles.get(userId) ?? {
        userId,
        birthMonth: null,
        guardianConsentAt: null,
        plan: userId.startsWith("e2e-paid")
          ? ("paid" as const)
          : ("free" as const),
        createdAt: new Date().toISOString(),
      };
      data.profiles.set(userId, { ...current, ...patch });
    },
    async deleteAccount(userId) {
      data.profiles.delete(userId);
    },
  };
}
