"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectRequestSchema, type ProjectRequestInput } from "@/app/schemas";
import { createProjectAction, updateProjectAction } from "@/app/actions/project";

const fieldClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100";

export function ProjectRequestForm({
  projectId,
  defaultValues,
}: {
  projectId?: string;
  defaultValues?: Partial<ProjectRequestInput>;
}) {
  const [serverError, setServerError] = useState("");
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectRequestInput>({
    resolver: zodResolver(projectRequestSchema),
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      projectType: "",
      budget: "",
      timeline: "",
      description: "",
      ...defaultValues,
    },
  });

  async function submit(values: ProjectRequestInput) {
    setServerError("");
    setSaved(false);
    try {
      if (projectId) {
        await updateProjectAction(projectId, values);
      } else {
        await createProjectAction(values);
      }
      setSaved(true);
      if (!projectId) window.location.href = "/portal";
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to save the project request.");
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-7">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">Full name<input {...register("fullName")} className={fieldClass} placeholder="Jane Doe" />{errors.fullName && <span className="mt-1 block text-xs font-medium text-red-600">{errors.fullName.message}</span>}</label>
        <label className="block text-sm font-semibold text-slate-700">Email<input {...register("email")} type="email" className={fieldClass} placeholder="jane@company.com" />{errors.email && <span className="mt-1 block text-xs font-medium text-red-600">{errors.email.message}</span>}</label>
        <label className="block text-sm font-semibold text-slate-700">Company / organisation<input {...register("company")} className={fieldClass} placeholder="Acme Studio" />{errors.company && <span className="mt-1 block text-xs font-medium text-red-600">{errors.company.message}</span>}</label>
        <label className="block text-sm font-semibold text-slate-700">Project type<select {...register("projectType")} className={fieldClass}><option value="">Select one</option><option>Website</option><option>Web application</option><option>Mobile product</option><option>Brand / landing page</option><option>Other</option></select>{errors.projectType && <span className="mt-1 block text-xs font-medium text-red-600">{errors.projectType.message}</span>}</label>
        <label className="block text-sm font-semibold text-slate-700">Budget<select {...register("budget")} className={fieldClass}><option value="">Select one</option><option>Under $2,500</option><option>$2,500–$5,000</option><option>$5,000–$10,000</option><option>$10,000+</option></select>{errors.budget && <span className="mt-1 block text-xs font-medium text-red-600">{errors.budget.message}</span>}</label>
        <label className="block text-sm font-semibold text-slate-700">Preferred timeline<select {...register("timeline")} className={fieldClass}><option value="">Select one</option><option>ASAP</option><option>2–4 weeks</option><option>1–2 months</option><option>3+ months</option></select>{errors.timeline && <span className="mt-1 block text-xs font-medium text-red-600">{errors.timeline.message}</span>}</label>
      </div>
      <label className="block text-sm font-semibold text-slate-700">Project brief<textarea {...register("description")} rows={7} className={fieldClass} placeholder="What are you trying to build? Who is it for? What outcome matters most?" />{errors.description && <span className="mt-1 block text-xs font-medium text-red-600">{errors.description.message}</span>}</label>
      {serverError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{serverError}</div>}
      {saved && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">Changes saved successfully.</div>}
      <button disabled={isSubmitting} className="w-full rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
        {isSubmitting ? "Saving…" : projectId ? "Save changes" : "Submit project request"}
      </button>
    </form>
  );
}
