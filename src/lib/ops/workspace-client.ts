export type WorkspaceCommandKind =
  | "client"
  | "project"
  | "task"
  | "milestone"
  | "deal"
  | "event"
  | "transaction"
  | "invoice"
  | "credential"
  | "ticket"
  | "message";

export async function postWorkspaceCommand<T = unknown>(kind: WorkspaceCommandKind, payload: unknown, fallbackMessage: string) {
  return postJson<T>("/api/admin/workspace", { kind, payload }, fallbackMessage);
}

export async function postJson<T = unknown>(url: string, body: unknown, fallbackMessage: string) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => null)) as T | { error?: string } | null;

  if (!response.ok) {
    throw new Error(payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string" ? payload.error : fallbackMessage);
  }

  return payload as T;
}
