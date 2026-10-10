import type {
  DocumentData,
  Timestamp,
  Transaction,
} from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import {
  PROJECT_STATUSES,
  type ProjectRequest,
  type ProjectRequestInput,
  type ProjectStatus,
} from "@/lib/project-request-types";

type Owner = { id: string; email?: string | null };

function normalizeEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() || null;
}

export function getStableOwnerId(
  _email: string | null | undefined,
  fallbackId: string,
) {
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

function isProjectStatus(value: unknown): value is ProjectStatus {
  return (
    typeof value === "string" &&
    PROJECT_STATUSES.includes(value as ProjectStatus)
  );
}

function mapHistory(
  value: unknown,
  fallbackStatus: ProjectStatus,
  createdAt: Date,
): ProjectStatusHistoryItem[] {
  if (!Array.isArray(value)) {
    return [
      { status: fallbackStatus, changedAt: createdAt, changedBy: "System" },
    ];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const status = isProjectStatus(record.status) ? record.status : null;
      if (!status) return null;
      return {
        status,
        changedAt: toDate(record.changedAt),
        changedBy:
          typeof record.changedBy === "string" ? record.changedBy : "System",
      };
    })
    .filter((item): item is ProjectStatusHistoryItem => item !== null);
}

function mapDoc(id: string, data: DocumentData): ProjectRequest {
  const createdAt = toDate(data.createdAt);
  const status = isProjectStatus(data.status) ? data.status : "new";

  return {
    id,
    fullName: data.fullName,
    email: data.email,
    company: data.company,
    projectType: data.projectType,
    budget: data.budget,
    timeline: data.timeline,
    description: data.description,
    status,
    statusHistory: mapHistory(data.statusHistory, status, createdAt),
    ownerId: data.ownerId,
    ownerEmail: data.ownerEmail,
    createdAt,
    updatedAt: toDate(data.updatedAt),
  };
}

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
    if (
      typeof data.ownerEmail === "string" &&
      normalizeEmail(data.ownerEmail) !== email
    )
      continue;

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
    adminDb
      .collection("projectRequests")
      .where("ownerId", "==", stableOwnerId)
      .get(),
    adminDb
      .collection("projectRequests")
      .where("ownerId", "==", owner.id)
      .get(),
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
  if (!snapshot.exists || !(await ownerMatches(snapshot.data(), owner)))
    return null;
  return mapDoc(snapshot.id, snapshot.data()!);
}

export async function createProject(owner: Owner, data: ProjectRequestInput) {
  const normalizedEmail = normalizeEmail(owner.email);
  const ownerId = getStableOwnerId(owner.email, owner.id);
  const now = new Date();
  const changedBy = normalizedEmail ?? owner.id;

  const ref = await adminDb.collection("projectRequests").add({
    ...data,
    ownerId,
    ...(normalizedEmail ? { ownerEmail: normalizedEmail } : {}),
    status: "new",
    statusHistory: [{ status: "new", changedAt: now, changedBy }],
    createdAt: now,
    updatedAt: now,
  });

  return ref.id;
}

export async function updateProject(
  id: string,
  owner: Owner,
  data: ProjectRequestInput,
) {
  const ref = adminDb.collection("projectRequests").doc(id);
  const current = await ref.get();
  if (!current.exists || !(await ownerMatches(current.data(), owner))) {
    throw new Error("Project not found.");
  }

  await ref.update({
    ...data,
    ownerId: getStableOwnerId(owner.email, owner.id),
    ...(normalizeEmail(owner.email)
      ? { ownerEmail: normalizeEmail(owner.email) }
      : {}),
    updatedAt: new Date(),
  });
}

export async function updateProjectStatus(
  id: string,
  owner: Owner,
  status: ProjectStatus,
) {
  if (!PROJECT_STATUSES.includes(status))
    throw new Error("Invalid project status.");

  const ref = adminDb.collection("projectRequests").doc(id);
  const now = new Date();
  const changedBy = normalizeEmail(owner.email) ?? owner.id;

  await adminDb.runTransaction(async (transaction: Transaction) => {
    const current = await transaction.get(ref);
    if (!current.exists || !(await ownerMatches(current.data(), owner))) {
      throw new Error("Project not found.");
    }

    const data = current.data()!;
    const currentStatus = isProjectStatus(data.status) ? data.status : "new";
    if (currentStatus === status) return;

    const history = Array.isArray(data.statusHistory)
      ? [...data.statusHistory]
      : [
          {
            status: currentStatus,
            changedAt: data.createdAt ?? now,
            changedBy: "System",
          },
        ];
    history.push({ status, changedAt: now, changedBy });

    transaction.update(ref, {
      status,
      statusHistory: history,
      updatedAt: now,
    });
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
