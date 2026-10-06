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

  return {
    id: session.user.id,
    email: session.user.email,
  };
}

function parseInput(input: unknown): ProjectRequestInput {
  const parsed = projectRequestSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Please check the form.");
  }
  return parsed.data;
}

export async function createProjectAction(input: unknown) {
  const owner = await requireUser();
  const data = parseInput(input);
  await createProject(owner, data);
  revalidatePath("/portal");
  return { ok: true as const };
}

export async function updateProjectAction(id: string, input: unknown) {
  const owner = await requireUser();
  const data = parseInput(input);
  await updateProject(id, owner, data);
  revalidatePath("/portal");
  revalidatePath(`/portal/${id}`);
  return { ok: true as const };
}

export async function deleteProjectAction(id: string) {
  const owner = await requireUser();
  await deleteProject(id, owner);
  revalidatePath("/portal");
  revalidatePath(`/portal/${id}`);
  return { ok: true as const };
}
