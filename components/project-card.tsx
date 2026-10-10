import Link from "next/link";
import type { ProjectRequest } from "@/lib/project-request-types";
// TO ADD
const statusStyles: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  reviewing: "bg-amber-50 text-amber-700",
  approved: "bg-violet-50 text-violet-700",
  in_progress: "bg-cyan-50 text-cyan-700",
  on_hold: "bg-orange-50 text-orange-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

export function ProjectCard({ project }: { project: ProjectRequest }) {
  return (
    <Link
      href={`/portal/${project.id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            {project.projectType}
          </p>
          <h3 className="mt-2 text-lg font-bold tracking-tight text-slate-950 group-hover:text-slate-700">
            {project.company}
          </h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyles[project.status] ?? "bg-slate-100 text-slate-700"}`}
        >
          {/* TO ADD */}
          {project.status.replace("_", " ")}
        </span>
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
        {project.description}
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
        <span>{project.timeline}</span>
        <span>{project.createdAt.toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
