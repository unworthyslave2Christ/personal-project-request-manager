import type { DocumentData, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export type ProjectStatus = "new" | "reviewing" | "approved" | "completed";

export type ProjectRequest = {
  id: string;
  fullName: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  status: ProjectStatus;
  ownerId: string;
  ownerEmail?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectRequestInput = Omit<
  ProjectRequest,
  "id" | "ownerId" | "ownerEmail" | "status" | "createdAt" | "updatedAt"
>;

type Owner = {
  id: string;
  email?: string | null;
};

function normalizeEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() || null;
}

export function getStableOwnerId(_email: string | null | undefined, fallbackId: string) {
  // auth.ts assigns session.user.id from Google's stable providerAccountId.
  // Keep that value as the canonical owner key.
  return fallbackId;
}

function toDate(value: unknown) {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as Timestamp).toDate === "function"
  ) {
    return (value as Timestamp).toDate();
  }
  if (value instanceof Date) return value;
  return new Date();
}

function mapDoc(id: string, data: DocumentData): ProjectRequest {
  return {
    id,
    fullName: data.fullName,
    email: data.email,
    company: data.company,
    projectType: data.projectType,
    budget: data.budget,
    timeline: data.timeline,
    description: data.description,
    status: data.status,
    ownerId: data.ownerId,
    ownerEmail: data.ownerEmail,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

/**
 * Older versions of the project used either Auth.js user.id or Firebase uid
 * as ownerId. The current version uses Google's stable provider account ID as the
 * application owner key. Existing records whose form email matches the
 * signed-in Google email are migrated once they are encountered.
 */
async function migrateLegacyProjects(owner: Owner, stableOwnerId: string) {
  const email = normalizeEmail(owner.email);
  if (!email) return;

  const legacySnapshot = await adminDb
    .collection("projectRequests")
    .where("email", "==", email)
    .get();

  if (legacySnapshot.empty) return;

  const batch = adminDb.batch();
  let changed = 0;

  for (const item of legacySnapshot.docs) {
    const data = item.data();
    if (data.ownerId === stableOwnerId && data.ownerEmail === email) continue;

    // Do not take over a document already owned by a different stable email.
    if (typeof data.ownerEmail === "string" && normalizeEmail(data.ownerEmail) !== email) {
      continue;
    }

    batch.update(item.ref, {
      ownerId: stableOwnerId,
      ownerEmail: email,
      updatedAt: data.updatedAt ?? new Date(),
    });
    changed += 1;
  }

  if (changed) await batch.commit();
}

async function ownerMatches(data: DocumentData | undefined, owner: Owner) {
  if (!data) return false;
  const stableOwnerId = getStableOwnerId(owner.email, owner.id);
  if (data.ownerId === stableOwnerId || data.ownerId === owner.id) return true;

  const email = normalizeEmail(owner.email);
  return Boolean(email && normalizeEmail(data.ownerEmail) === email);
}

export async function listProjects(owner: Owner) {
  const stableOwnerId = getStableOwnerId(owner.email, owner.id);
  await migrateLegacyProjects(owner, stableOwnerId);

  const snapshots = await Promise.all([
    adminDb.collection("projectRequests").where("ownerId", "==", stableOwnerId).get(),
    adminDb.collection("projectRequests").where("ownerId", "==", owner.id).get(),
  ]);

  const seen = new Set<string>();
  const projects: ProjectRequest[] = [];

  for (const snapshot of snapshots) {
    for (const item of snapshot.docs) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      projects.push(mapDoc(item.id, item.data()));
    }
  }

  return projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getProject(id: string, owner: Owner) {
  const snapshot = await adminDb.collection("projectRequests").doc(id).get();
  if (!snapshot.exists || !(await ownerMatches(snapshot.data(), owner))) return null;
  return mapDoc(snapshot.id, snapshot.data()!);
}

export async function createProject(owner: Owner, data: ProjectRequestInput) {
  const normalizedEmail = normalizeEmail(owner.email);
  const ownerId = getStableOwnerId(owner.email, owner.id);

  const ref = await adminDb.collection("projectRequests").add({
    ...data,
    ownerId,
    ...(normalizedEmail ? { ownerEmail: normalizedEmail } : {}),
    status: "new",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return ref.id;
}

export async function updateProject(id: string, owner: Owner, data: ProjectRequestInput) {
  const ref = adminDb.collection("projectRequests").doc(id);
  const current = await ref.get();
  if (!current.exists || !(await ownerMatches(current.data(), owner))) {
    throw new Error("Project not found.");
  }

  await ref.update({
    ...data,
    ownerId: getStableOwnerId(owner.email, owner.id),
    ...(normalizeEmail(owner.email) ? { ownerEmail: normalizeEmail(owner.email) } : {}),
    updatedAt: new Date(),
  });
}

export async function deleteProject(id: string, owner: Owner) {
  const ref = adminDb.collection("projectRequests").doc(id);
  const current = await ref.get();
  if (!current.exists || !(await ownerMatches(current.data(), owner))) {
    throw new Error("Project not found.");
  }

  await ref.delete();
}
