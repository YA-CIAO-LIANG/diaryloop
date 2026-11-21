import { describe, expect, it } from "vitest";
import { createMemoryStore } from "@/lib/store/memory";

const fresh = () => createMemoryStore({ profiles: new Map() });

describe("memory store", () => {
  it("creates a profile on first save and merges later saves", async () => {
    const store = fresh();
    expect(await store.getProfile("u1")).toBeNull();
    await store.saveProfile("u1", { birthMonth: "2000-01" });
    await store.saveProfile("u1", { guardianConsentAt: "2026-11-21" });
    expect(await store.getProfile("u1")).toMatchObject({
      birthMonth: "2000-01",
      guardianConsentAt: "2026-11-21",
      plan: "free",
    });
  });

  it("deletes everything of an account", async () => {
    const store = fresh();
    await store.saveProfile("u1", { birthMonth: "2000-01" });
    await store.deleteAccount("u1");
    expect(await store.getProfile("u1")).toBeNull();
  });
});
