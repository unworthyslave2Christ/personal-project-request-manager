export const PROJECT_STATUSES = [
  "new",
  "reviewing",
  "approved",
  "in_progress",
  "on_hold",
  "completed",
  "cancelled",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_META: Record<
  ProjectStatus,
  { label: string; description: string }
> = {
  new: { label: "New", description: "Request submitted" },
  reviewing: { label: "Reviewing", description: "Request is being reviewed" },
  approved: { label: "Approved", description: "Request has been approved" },
  in_progress: { label: "In Progress", description: "Work is underway" },
  on_hold: { label: "On Hold", description: "Work is temporarily paused" },
  completed: { label: "Completed", description: "Project request completed" },
  cancelled: { label: "Cancelled", description: "Request was cancelled" },
};

export type ProjectStatusHistoryItem = {
  status: ProjectStatus;
  changedAt: Date;
  changedBy: string;
};

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
  statusHistory: ProjectStatusHistoryItem[];
  ownerId: string;
  ownerEmail?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectRequestInput = Omit<
  ProjectRequest,
  | "id"
  | "ownerId"
  | "ownerEmail"
  | "status"
  | "statusHistory"
  | "createdAt"
  | "updatedAt"
>;
