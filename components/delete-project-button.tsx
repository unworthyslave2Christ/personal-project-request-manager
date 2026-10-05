"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { deleteProject } from "@/lib/project-requests-client";

export function DeleteProjectButton({ id }: { id: string }) {
  const { data: session } = useSession();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (
      !session?.user?.id ||
      !window.confirm("Delete this project request? This cannot be undone.")
    )
      return;
    setPending(true);
    try {
      await deleteProject(id, session.user.id);
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
