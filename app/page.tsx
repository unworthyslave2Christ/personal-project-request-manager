import Link from "next/link";
import { auth } from "@/auth";
import { SignInButton } from "@/components/auth-buttons";

export default async function HomePage() {
  const session = await auth();
  return (
    <main>
      <section className="overflow-hidden border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Project intake, organised
            </div>
            <h1 className="max-w-3xl text-5xl font-black tracking-[-0.04em] text-slate-950 sm:text-6xl">
              Turn a project idea into a clear starting point.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Submit project requirements, keep your requests in one secure
              workspace, and follow each project from first conversation to
              completion.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {session ? (
                <Link
                  href="/portal"
                  className="rounded-2xl bg-slate-950 px-5 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Open my portal
                </Link>
              ) : (
                <SignInButton />
              )}
              <a
                href="#how-it-works"
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                How it works
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-[2rem] bg-slate-950 p-3 shadow-2xl shadow-slate-950/20">
              <div className="rounded-[1.5rem] bg-white p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-950">
                    Project pipeline
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    Live
                  </span>
                </div>
                <div className="mt-7 space-y-3">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex justify-between text-sm font-bold">
                      <span>Website redesign</span>
                      <span className="text-blue-600">New</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div className="h-2 w-1/4 rounded-full bg-blue-500" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex justify-between text-sm font-bold">
                      <span>Client dashboard</span>
                      <span className="text-amber-600">Reviewing</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div className="h-2 w-1/2 rounded-full bg-amber-500" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex justify-between text-sm font-bold">
                      <span>Brand launch</span>
                      <span className="text-emerald-600">Completed</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div className="h-2 w-full rounded-full bg-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-5 py-20 lg:px-8"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            One simple workflow
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">
            A professional intake experience from end to end.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <span className="text-sm font-black text-slate-400">01</span>
            <h3 className="mt-8 text-lg font-bold">Sign in securely</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use your Google account to access your private project workspace.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <span className="text-sm font-black text-slate-400">02</span>
            <h3 className="mt-8 text-lg font-bold">Submit the brief</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Capture the project, budget, timeline, organisation, and goals in
              one place.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <span className="text-sm font-black text-slate-400">03</span>
            <h3 className="mt-8 text-lg font-bold">Manage the request</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review, update, and remove your own requests from your protected
              portal.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
