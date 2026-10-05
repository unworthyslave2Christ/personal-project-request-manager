"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/");
  }, [status, router]);

  if (status === "loading") return <main className="mx-auto max-w-7xl px-5 py-20 text-sm text-slate-500 lg:px-8">Checking your session…</main>;
  if (status !== "authenticated") return null;
  return <>{children}</>;
}
