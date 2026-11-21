import { redirect } from "next/navigation";
import { ageGroup, type AgeGroup } from "@/lib/age";
import type { Profile } from "@/lib/store/types";
import { getSignedInUser, type SignedInUser } from "./session";
import { getStore } from "./store";

export type Member = SignedInUser & { profile: Profile; ageGroup: AgeGroup };

/**
 * For pages that need an account that has finished the welcome step:
 * signed out → /signin; no birth month or a teen without consent →
 * /welcome. Returns the user with their profile and age group (D12).
 */
export async function requireMember(next: string): Promise<Member> {
  const user = await getSignedInUser();
  if (!user) redirect(`/signin?next=${encodeURIComponent(next)}`);
  const store = await getStore();
  const profile = await store?.getProfile(user.id);
  if (!profile?.birthMonth) redirect("/welcome");
  const group = ageGroup(profile.birthMonth, new Date());
  if (group === "child") redirect("/welcome");
  if (group === "teen" && !profile.guardianConsentAt) redirect("/welcome");
  return { ...user, profile, ageGroup: group };
}
