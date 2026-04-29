export type AIActionPlan = {
  title: string;
  actions: Array<{
    type: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
};

export function generateAIActionPlan(context: {
  openTasks: number;
  pendingInvoices: number;
  pendingTickets: number;
  clientsWithoutPortal: number;
}): AIActionPlan {
  const actions: AIActionPlan["actions"] = [];

  if (context.pendingTickets > 0) {
    actions.push({ type: "ticket", description: `Atender ${context.pendingTickets} tickets pendientes`, priority: "high" });
  }

  if (context.pendingInvoices > 0) {
    actions.push({ type: "invoice", description: `Seguimiento de ${context.pendingInvoices} invoices pendientes`, priority: "medium" });
  }

  if (context.openTasks > 0) {
    actions.push({ type: "task", description: `Revisar ${context.openTasks} tareas abiertas`, priority: "medium" });
  }

  if (context.clientsWithoutPortal > 0) {
    actions.push({ type: "portal", description: `Activar portal para ${context.clientsWithoutPortal} clientes`, priority: "low" });
  }

  return { title: "Plan de acción sugerido", actions };
}
