"use client";

import { Bot, MessageSquare, Paperclip, Send, Ticket, UserRound, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  EmptyWorkspacePanel,
  ErrorWorkspacePanel,
  LoadingWorkspacePanel,
  formatDateTime,
  formatNumber,
} from "@/components/os/workspace-ui";
import { useWorkspaceSnapshot } from "@/lib/ops/use-workspace-snapshot";
import { postWorkspaceCommand } from "@/lib/ops/workspace-client";
import { useUIStore } from "@/lib/store/ui";

export default function ChatWorkspaceScreen() {
  const open = useUIStore((store) => store.open);
  const { snapshot, loading, error, refresh } = useWorkspaceSnapshot();
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [composer, setComposer] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const conversations = useMemo(() => {
    return snapshot.clients
      .map((client) => {
        const messages = snapshot.messages.filter((message) => message.clientId === client.id);
        const tickets = snapshot.tickets.filter((ticket) => ticket.clientId === client.id && ticket.status !== "resolved" && ticket.status !== "closed");
        return {
          client,
          messages,
          tickets,
          lastMessageAt: messages[0]?.createdAt ?? client.lastActivityAt,
        };
      })
      .filter((entry) => entry.messages.length > 0 || entry.tickets.length > 0)
      .sort((left, right) => new Date(right.lastMessageAt ?? 0).getTime() - new Date(left.lastMessageAt ?? 0).getTime());
  }, [snapshot.clients, snapshot.messages, snapshot.tickets]);

  useEffect(() => {
    if (!selectedClientId && conversations[0]?.client.id) {
      setSelectedClientId(conversations[0].client.id);
    }
  }, [conversations, selectedClientId]);

  const selectedConversation = conversations.find((entry) => entry.client.id === selectedClientId) ?? null;

  async function handleSendMessage() {
    if (!selectedConversation || !composer.trim()) {
      return;
    }

    setSending(true);
    setSendError(null);

    try {
      await postWorkspaceCommand(
        "message",
        {
          clientId: selectedConversation.client.id,
          senderRole: "team",
          senderName: "Vertrex Ops",
          channel: "ops",
          message: composer.trim(),
          autoReply: true,
        },
        "No fue posible enviar el mensaje operativo.",
      );
      setComposer("");
      await refresh();
    } catch (submissionError) {
      setSendError(submissionError instanceof Error ? submissionError.message : "No fue posible enviar el mensaje operativo.");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return <LoadingWorkspacePanel label="Cargando comunicaciones reales del workspace..." />;
  }

  if (error) {
    return <ErrorWorkspacePanel message={error} onRetry={refresh} />;
  }

  if (conversations.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyWorkspacePanel
          title="Chat todavía no tiene conversaciones activas"
          description="Cuando clientes y equipo se comuniquen desde el portal o desde operaciones, aquí aparecerá la bandeja unificada del OS."
        />
        <button className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground" onClick={refresh}>
          Actualizar
        </button>
      </div>
    );
  }

  return (
    <div className="grid h-[calc(100vh-8rem)] gap-4 pb-4 md:grid-cols-[300px_minmax(0,1fr)] animate-fade-in">
      <aside className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border bg-secondary/20 p-4">
          <h2 className="text-lg font-semibold text-foreground">Comunicaciones</h2>
          <p className="mt-1 text-xs text-muted-foreground">Mensajes, tickets y contexto cliente dentro del mismo workspace.</p>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto p-2 no-scrollbar">
          {conversations.map((conversation) => (
            <button
              key={conversation.client.id}
              className={`w-full rounded-xl border p-4 text-left transition-colors ${selectedConversation?.client.id === conversation.client.id ? "border-primary/30 bg-primary/5" : "border-border/60 bg-secondary/20 hover:border-primary/20 hover:bg-primary/5"}`}
              onClick={() => setSelectedClientId(conversation.client.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{conversation.client.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {conversation.messages.length} mensajes · {conversation.tickets.length} tickets abiertos
                  </p>
                </div>
                <span className="rounded-full border border-border bg-background px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {conversation.client.portalAccessActive ? "portal" : "manual"}
                </span>
              </div>
              <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
                {conversation.messages[0]?.message ?? conversation.client.portalUserEmail ?? "Sin mensajes recientes"}
              </p>
            </button>
          ))}
        </div>
      </aside>

      <main className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {selectedConversation ? (
          <>
            <header className="flex items-center justify-between gap-4 border-b border-border bg-background/50 px-6 py-4 backdrop-blur-md">
              <div>
                <h2 className="text-base font-semibold text-foreground">{selectedConversation.client.name}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedConversation.client.projectCount} proyectos · {selectedConversation.client.openTicketCount} tickets abiertos · {selectedConversation.client.portalAccessActive ? "Portal activo" : "Sin portal"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground" onClick={refresh}>
                  Actualizar
                </button>
                <button className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground" onClick={() => open("uploadFile", { context: "Chat" })}>
                  <span className="inline-flex items-center gap-2">
                    <Paperclip className="h-3.5 w-3.5" /> Adjuntar
                  </span>
                </button>
              </div>
            </header>

            <div className="grid min-h-0 flex-1 gap-0 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="flex min-h-0 flex-col border-b border-border xl:border-b-0 xl:border-r xl:border-border">
                <div className="flex-1 space-y-4 overflow-y-auto p-6 no-scrollbar">
                  {selectedConversation.messages.length > 0 ? (
                    selectedConversation.messages.map((message) => (
                      <div key={message.id} className={`flex gap-3 ${message.senderRole === "team" ? "justify-end" : "justify-start"}`}>
                        {message.senderRole !== "team" ? (
                          <div className="mt-1 rounded-lg bg-secondary p-2 text-muted-foreground">
                            {message.senderRole === "assistant" ? <Bot className="h-4 w-4 text-primary" /> : <UserRound className="h-4 w-4" />}
                          </div>
                        ) : null}
                        <div className={`max-w-[720px] rounded-2xl border px-4 py-3 ${message.senderRole === "team" ? "border-primary/20 bg-primary/5" : "border-border bg-secondary/20"}`}>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                            <span className="font-semibold text-foreground">{message.senderName}</span>
                            <span>{message.channel}</span>
                            <span>·</span>
                            <span>{formatDateTime(message.createdAt)}</span>
                          </div>
                          <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">{message.message}</p>
                        </div>
                        {message.senderRole === "team" ? (
                          <div className="mt-1 rounded-lg bg-primary/10 p-2 text-primary">
                            <MessageSquare className="h-4 w-4" />
                          </div>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay mensajes para este cliente todavía.</p>
                  )}
                </div>

                <div className="border-t border-border bg-background/50 p-4">
                  <div className="rounded-2xl border border-border bg-secondary/30 p-3">
                    <textarea
                      value={composer}
                      onChange={(event) => setComposer(event.target.value)}
                      placeholder="Responder como equipo o delegar a la IA asistida..."
                      className="min-h-[90px] w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    ></textarea>
                    {sendError ? <p className="mt-2 text-xs text-destructive">{sendError}</p> : null}
                    <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/60 pt-3">
                      <button className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground" onClick={() => setComposer((current) => current ? `${current}\n\n[IA] Resume riesgos y próximos pasos.` : "[IA] Resume riesgos y próximos pasos.") }>
                        <span className="inline-flex items-center gap-2">
                          <Zap className="h-3.5 w-3.5 text-primary" /> Redactar con IA
                        </span>
                      </button>
                      <button
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={sending || !composer.trim()}
                        onClick={() => void handleSendMessage()}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Send className="h-4 w-4" /> {sending ? "Enviando..." : "Enviar"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="space-y-4 overflow-y-auto p-4 no-scrollbar">
                <div className="rounded-2xl border border-border bg-secondary/20 p-4">
                  <h3 className="text-sm font-semibold text-foreground">Resumen cliente</h3>
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <p>Proyectos: <span className="font-semibold text-foreground">{selectedConversation.client.projectCount}</span></p>
                    <p>Tareas: <span className="font-semibold text-foreground">{selectedConversation.client.taskCount}</span></p>
                    <p>Tickets abiertos: <span className="font-semibold text-foreground">{selectedConversation.client.openTicketCount}</span></p>
                    <p>Portal activo: <span className="font-semibold text-foreground">{selectedConversation.client.portalAccessActive ? "Sí" : "No"}</span></p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-secondary/20 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Ticket className="h-4 w-4 text-primary" /> Tickets relacionados
                  </h3>
                  <div className="mt-3 space-y-3">
                    {selectedConversation.tickets.length > 0 ? (
                      selectedConversation.tickets.map((ticket) => (
                        <button
                          key={ticket.id}
                          className="w-full rounded-xl border border-border/60 bg-background p-3 text-left transition-colors hover:border-primary/20 hover:bg-primary/5"
                          onClick={() => open("ticketDetail", ticket.id)}
                        >
                          <p className="text-sm font-medium text-foreground">{ticket.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {ticket.requestTypeLabel} · {ticket.slaLabel} · {ticket.priority ?? "sin prioridad"}
                          </p>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No hay tickets abiertos para esta conversación.</p>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground">
            Selecciona una conversación para abrir la bandeja operativa.
          </div>
        )}
      </main>
    </div>
  );
}
