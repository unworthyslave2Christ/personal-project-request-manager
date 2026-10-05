"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { useFirebaseAuth } from "@/components/firebase-auth-provider";
import { getProject, type ProjectRequest } from "@/lib/project-requests-client";
import { ProjectRequestForm } from "@/components/project-request-form";
import { DeleteProjectButton } from "@/components/delete-project-button";

function ProjectDetailContent({ id }: { id: string }) {
  const { user } = useFirebaseAuth();
  const [project, setProject] = useState<ProjectRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!user) return;
    getProject(id, user.uid).then((item) => {
      setProject(item);
      setMissing(!item);
    }).finally(() => setLoading(false));
  }, [id, user]);

  if (loading) return <main className="mx-auto max-w-4xl px-5 py-20 text-sm text-slate-500 lg:px-8">Loading project…</main>;
  if (missing || !project) return <main className="mx-auto max-w-4xl px-5 py-20 lg:px-8"><h1 className="text-3xl font-black">Project not found</h1><Link href="/portal" className="mt-4 inline-flex text-sm font-semibold text-slate-600 hover:text-slate-950">← Back to projects</Link></main>;

  return <main className="mx-auto max-w-4xl px-5 py-10 lg:px-8 lg:py-14"><div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><Link href="/portal" className="text-sm font-semibold text-slate-500 hover:text-slate-950">← Back to projects</Link><h1 className="mt-4 text-4xl font-black tracking-tight">Edit project request</h1><p className="mt-2 text-sm text-slate-500">Last updated {project.updatedAt.toLocaleDateString()}</p></div><DeleteProjectButton id={project.id} /></div><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><ProjectRequestForm projectId={project.id} defaultValues={{ fullName: project.fullName, email: project.email, company: project.company, projectType: project.projectType, budget: project.budget, timeline: project.timeline, description: project.description }} /></div></main>;
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <AuthGuard><ProjectDetailContent id={id} /></AuthGuard>;
}
