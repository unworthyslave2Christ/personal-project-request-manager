import type { DocumentData, Timestamp } from "firebase-admin/firestore";

import {adminDb} from "@/lib/firebase-admin"

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
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectRequestInput = Omit<
  ProjectRequest,
  "id" | "ownerId" | "status" | "createdAt" | "updatedAt"
>;

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
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export async function listProjects(ownerId: string) {
  const snapshot = await adminDb
    .collection("projectRequests")
    .where("ownerId", "==", ownerId)
    .get();

  return snapshot.docs
    .map((item) => mapDoc(item.id, item.data()))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getProject(id: string, ownerId: string) {
  const snapshot = await adminDb.collection("projectRequests").doc(id).get();
  if (!snapshot.exists || snapshot.data()?.ownerId !== ownerId) return null;
  return mapDoc(snapshot.id, snapshot.data()!);
}

export async function createProject(ownerId: string, data: ProjectRequestInput) {
  const ref = await adminDb.collection("projectRequests").add({
    ...data,
    ownerId,
    status: "new",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return ref.id;
}

export async function updateProject(
  id: string,
  ownerId: string,
  data: ProjectRequestInput,
) {
  const ref = adminDb.collection("projectRequests").doc(id);
  const current = await ref.get();
  if (!current.exists || current.data()?.ownerId !== ownerId) {
    throw new Error("Project not found.");
  }

  await ref.update({ ...data, updatedAt: new Date() });
}

export async function deleteProject(id: string, ownerId: string) {
  const ref = adminDb.collection("projectRequests").doc(id);
  const current = await ref.get();
  if (!current.exists || current.data()?.ownerId !== ownerId) {
    throw new Error("Project not found.");
  }

  await ref.delete();
}
