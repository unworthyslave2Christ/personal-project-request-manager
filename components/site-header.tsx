import Link from "next/link";
import { auth } from "@/auth";
import { SignInButton, SignOutButton } from "@/components/auth-buttons";

export async function SiteHeader() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-slate-950 text-sm font-black text-white">CP</span>
          <span className="font-bold tracking-tight text-slate-950">Client Portal</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          <Link href="/" className="transition hover:text-slate-950">Home</Link>
          {session && <Link href="/portal" className="transition hover:text-slate-950">My projects</Link>}
        </nav>
        <div>{session ? <SignOutButton /> : <SignInButton compact />}</div>
      </div>
    </header>
  );
}
