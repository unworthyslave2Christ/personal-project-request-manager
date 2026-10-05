import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ProjectRequestForm } from "@/components/project-request-form";

export default async function NewProjectPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  return (
    <main className="mx-auto max-w-4xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="mb-8">
        <p className="text-sm font-semibold text-slate-500">New request</p>
        <h1 className="mt-1 text-4xl font-black tracking-tight">
          Start a project
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Give enough context for a productive first conversation. You can edit
          these details later.
        </p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <ProjectRequestForm />
      </div>
    </main>
  );
}
