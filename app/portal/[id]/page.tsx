import Link from "next/link";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getProject } from "@/lib/project-requests";
import { ProjectRequestForm } from "@/components/project-request-form";
import { DeleteProjectButton } from "@/components/delete-project-button";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const { id } = await params;
  const project = await getProject(id, { id: session.user.id, email: session.user.email });
  if (!project) notFound();

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/portal" className="text-sm font-semibold text-slate-500 hover:text-slate-950">← Back to projects</Link>
          <h1 className="mt-4 text-4xl font-black tracking-tight">Edit project request</h1>
          <p className="mt-2 text-sm text-slate-500">Last updated {project.updatedAt.toLocaleDateString()}</p>
        </div>
        <DeleteProjectButton id={project.id} />
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <ProjectRequestForm
          projectId={project.id}
          defaultValues={{
            fullName: project.fullName,
            email: project.email,
            company: project.company,
            projectType: project.projectType,
            budget: project.budget,
            timeline: project.timeline,
            description: project.description,
          }}
        />
      </div>
    </main>
  );
}
