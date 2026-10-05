"use client";
import { signIn, signOut } from "next-auth/react";

export function SignInButton({ compact = false }: { compact?: boolean }) {
  async function handleSignIn() {
    await signIn("google", { redirectTo: "/portal" });
  }

  return (
    <button
      type="button"
      onClick={() => void handleSignIn()}
      className={
        compact
          ? "rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          : "inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
      }
    >
      Continue with Google
    </button>
  );
}

export function SignOutButton() {
  async function handleSignOut() {
    // await firebaseSignOut(firebaseAuth);
    await signOut({ redirectTo: "/" });
  }

  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
    >
      Sign out
    </button>
  );
}
