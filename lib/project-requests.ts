import type { Timestamp } from "firebase/firestore";

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

export function firestoreTimestampToDate(value: unknown) {
  if (value && typeof value === "object" && "toDate" in value && typeof (value as Timestamp).toDate === "function") {
    return (value as Timestamp).toDate();
  }
  if (value instanceof Date) return value;
  return new Date();
}
