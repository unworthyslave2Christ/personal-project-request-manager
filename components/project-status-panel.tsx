"use client";

import { useState } from "react";
import {
  PROJECT_STATUS_META,
  PROJECT_STATUSES,
  type ProjectRequest,
  type ProjectStatus,
} from "@/lib/project-request-types";
import { updateProjectStatusAction } from "@/app/actions/project";

const statusClasses: Record<ProjectStatus, string> = {
  new: "bg-blue-50 text-blue-700 ring-blue-200",
  reviewing: "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-violet-50 text-violet-700 ring-violet-200",
  in_progress: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  on_hold: "bg-orange-50 text-orange-700 ring-orange-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
};

const trackerStatuses: ProjectStatus[] = [
  "new",
  "reviewing",
  "approved",
  "in_progress",
  "completed",
];

function label(status: ProjectStatus) {
  return PROJECT_STATUS_META[status].label;
}

export function ProjectStatusPanel({ project }: { project: ProjectRequest }) {
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const currentIndex = trackerStatuses.indexOf(status);
  const isExceptional = status === "on_hold" || status === "cancelled";

  async function saveStatus() {
    setPending(true);
    setError("");
    setSaved(false);
    try {
      await updateProjectStatusAction(project.id, status);
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update the request status.",
      );
      setStatus(project.status);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Request lifecycle
            </p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950">
              Project status
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Track where this request currently sits in the delivery process.
            </p>
          </div>
          <span
            className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${statusClasses[status]}`}
          >
            {label(status)}
          </span>
        </div>

        <div className="mt-8">
          <div className="hidden md:block">
            <div className="flex items-start">
              {trackerStatuses.map((item, index) => {
                const active = item === status;
                const complete = !isExceptional && currentIndex > index;
                return (
                  <div
                    key={item}
                    className="relative flex flex-1 flex-col items-center text-center"
                  >
                    {index < trackerStatuses.length - 1 && (
                      <span
                        className={`absolute left-1/2 top-3 h-px w-full ${complete ? "bg-slate-950" : "bg-slate-200"}`}
                      />
                    )}
                    <span
                      className={`relative z-10 grid size-6 place-items-center rounded-full border-2 text-[10px] font-black ${
                        active
                          ? "border-slate-950 bg-slate-950 text-white"
                          : complete
                            ? "border-slate-950 bg-white text-slate-950"
                            : "border-slate-200 bg-white text-slate-400"
                      }`}
                    >
                      {complete ? "✓" : index + 1}
                    </span>
                    <span
                      className={`mt-3 text-xs font-bold ${active ? "text-slate-950" : "text-slate-500"}`}
                    >
                      {label(item)}
                    </span>
                  </div>
                );
              })}
            </div>
            {isExceptional && (
              <div
                className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${status === "on_hold" ? "bg-orange-50 text-orange-800" : "bg-red-50 text-red-800"}`}
              >
                {PROJECT_STATUS_META[status].description}.
              </div>
            )}
          </div>

          <div className="space-y-3 md:hidden">
            {trackerStatuses.map((item, index) => {
              const active = item === status;
              const complete = !isExceptional && currentIndex > index;
              return (
                <div key={item} className="flex items-center gap-3">
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full border-2 text-[10px] font-black ${
                      active
                        ? "border-slate-950 bg-slate-950 text-white"
                        : complete
                          ? "border-slate-950 text-slate-950"
                          : "border-slate-200 text-slate-400"
                    }`}
                  >
                    {complete ? "✓" : index + 1}
                  </span>
                  <div>
                    <p
                      className={`text-sm font-bold ${active ? "text-slate-950" : "text-slate-500"}`}
                    >
                      {label(item)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {PROJECT_STATUS_META[item].description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex-1 text-sm font-semibold text-slate-700">
              Change status
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value as ProjectStatus);
                  setSaved(false);
                }}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
              >
                {PROJECT_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {label(item)}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => void saveStatus()}
              disabled={pending || status === project.status}
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {pending ? "Updating…" : "Update status"}
            </button>
          </div>
          {error && (
            <p
              role="alert"
              className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {error}
            </p>
          )}
          {saved && (
            <p
              role="status"
              className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
            >
              Status updated successfully.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
          Activity
        </p>
        <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950">
          Status history
        </h2>
        <div className="mt-6 space-y-0">
          {project.statusHistory.map((item, index) => (
            <div
              key={`${item.status}-${item.changedAt.getTime()}-${index}`}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {index < project.statusHistory.length - 1 && (
                <span className="absolute left-2.5 top-6 h-full w-px bg-slate-200" />
              )}
              <span className="relative z-10 mt-1 grid size-5 shrink-0 place-items-center rounded-full border border-slate-300 bg-white text-[9px] text-slate-500">
                ✓
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">
                  {label(item.status)}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {PROJECT_STATUS_META[item.status].description} ·{" "}
                  {item.changedAt.toLocaleString()}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  Changed by {item.changedBy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
