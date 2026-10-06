"use server";

import { auth } from "@/auth";
import { projectRequestSchema, type ProjectRequestInput } from "@/app/schemas";
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/lib/project-requests";
import { revalidatePath } from "next/cache";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("You must be signed in.");
  return session.user.id;
}

function parseInput(input: unknown): ProjectRequestInput {
  const parsed = projectRequestSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Please check the form.");
  }
  return parsed.data;
}

export async function createProjectAction(input: unknown) {
  const ownerId = await requireUser();
  const data = parseInput(input);
  await createProject(ownerId, data);
  revalidatePath("/portal");
  return { ok: true as const };
}

export async function updateProjectAction(id: string, input: unknown) {
  const ownerId = await requireUser();
  const data = parseInput(input);
  await updateProject(id, ownerId, data);
  revalidatePath("/portal");
  revalidatePath(`/portal/${id}`);
  return { ok: true as const };
}

export async function deleteProjectAction(id: string) {
  const ownerId = await requireUser();
  await deleteProject(id, ownerId);
  revalidatePath("/portal");
  revalidatePath(`/portal/${id}`);
  return { ok: true as const };
}
