"use client";

import { useCallback, useEffect, useState } from "react";

import {
  emptyWorkspaceHealthSnapshot,
  type WorkspaceHealthSnapshot,
} from "@/lib/ops/workspace-health";

export function useWorkspaceHealth(options?: { enabled?: boolean; initialSnapshot?: WorkspaceHealthSnapshot }) {
  const enabled = options?.enabled ?? true;
  const initialSnapshot = options?.initialSnapshot ?? emptyWorkspaceHealthSnapshot;
  const [snapshot, setSnapshot] = useState<WorkspaceHealthSnapshot>(initialSnapshot);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setSnapshot(initialSnapshot);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/health", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });
      const payload = (await response.json().catch(() => null)) as WorkspaceHealthSnapshot | { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload && "error" in payload && typeof payload.error === "string" ? payload.error : "No fue posible cargar la salud operativa.");
      }

      setSnapshot(payload as WorkspaceHealthSnapshot);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "No fue posible cargar la salud operativa.");
      setSnapshot(emptyWorkspaceHealthSnapshot);
    } finally {
      setLoading(false);
    }
  }, [enabled, initialSnapshot]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    snapshot,
    loading,
    error,
    refresh,
  };
}
