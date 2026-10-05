"use client";

import { useState } from "react";
import { useFirebaseAuth } from "@/components/firebase-auth-provider";
import { deleteProject } from "@/lib/project-requests-client";

export function DeleteProjectButton({ id }: { id: string }) {
  const { user } = useFirebaseAuth();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (
      !user ||
      !window.confirm("Delete this project request? This cannot be undone.")
    )
      return;
    setPending(true);
    try {
      await deleteProject(id, user.uid);
      window.location.href = "/portal";
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => void handleDelete()}
      className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete request"}
    </button>
  );
}
