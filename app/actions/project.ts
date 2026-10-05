"use server";

import { auth } from "@/auth";
import { projectRequestSchema } from "@/app/schemas";
import { revalidatePath } from "next/cache";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("You must be signed in.");
  return session.user.id;
}

/**
 * Compatibility Server Actions retained from the original project.
 * Firestore CRUD now runs through the Firebase Web SDK in the client so that
 * Firestore Security Rules receive Firebase Auth context. These actions remain
 * available for server-side validation/revalidation and preserve the original
 * public action API without reintroducing the privileged Admin SDK.
 */
export async function createProjectAction(input: unknown) {
  await requireUser();
  const parsed = projectRequestSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check the form." };
  revalidatePath("/portal");
  return { ok: true };
}

export async function updateProjectAction(id: string, input: unknown) {
  await requireUser();
  const parsed = projectRequestSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check the form." };
  revalidatePath("/portal");
  revalidatePath(`/portal/${id}`);
  return { ok: true };
}

export async function deleteProjectAction(id: string) {
  await requireUser();
  revalidatePath("/portal");
  revalidatePath(`/portal/${id}`);
  return { ok: true };
}
