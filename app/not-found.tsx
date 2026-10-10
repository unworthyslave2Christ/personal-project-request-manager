import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[65vh] max-w-2xl items-center justify-center px-5 py-16 text-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
          404
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">
          Project not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          The request may have been removed, or you may not have access to it.
        </p>
        <Link
          href="/portal"
          className="mt-7 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
        >
          Return to portal
        </Link>
      </div>
    </main>
  );
}
