import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { listProjects } from "@/lib/project-requests";
import { ProjectCard } from "@/components/project-card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PortalPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const projects = await listProjects({ id: session.user.id, email: session.user.email });
  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Welcome back, {firstName}</p>
          <h1 className="mt-1 text-4xl font-black tracking-tight">Your projects</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Everything you have submitted lives here. Open a request to review or update its details.
          </p>
        </div>
        <Link href="/portal/new" className="rounded-xl bg-slate-950 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-slate-800">
          New project request
        </Link>
      </div>

      <div className="mt-8">
        {projects.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-xl">＋</div>
            <h2 className="mt-5 text-xl font-bold">No project requests yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first request and keep the project details, timeline, and budget together from day one.
            </p>
            <Link href="/portal/new" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">
              Create your first request
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
