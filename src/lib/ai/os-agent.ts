export const osTools = {
  getProjects: { description: "Lista proyectos con filtros" },
  getProject: { description: "Detalle de un proyecto específico" },
  createTask: { description: "Crea una tarea en un proyecto" },
  updateTask: { description: "Actualiza estado o responsable de una tarea" },
  getClients: { description: "Lista clientes" },
  getClient: { description: "Detalle de cliente" },
  createDocument: { description: "Crea un documento" },
  getFinanceSummary: { description: "Resumen financiero" },
  createTransaction: { description: "Registra una transacción" },
  getCalendarEvents: { description: "Eventos próximos" },
  createEvent: { description: "Crea un evento" },
  getTickets: { description: "Lista tickets" },
  updateTicket: { description: "Actualiza un ticket" },
  searchMemory: { description: "Busca en ai_memory" },
  saveMemory: { description: "Guarda en ai_memory" },
  callOpenClaw: { description: "Llama a una skill de OpenClaw" },
};

type OsAgentSnapshot = {
  userName?: string;
  generatedAt: string;
  clientCount: number;
  projectCount: number;
  openTaskCount: number;
  pendingInvoiceCount: number;
  pendingInvoiceCents: number;
  openTicketCount: number;
  recentMemory: Array<{ key: string; category: string; content: string }>;
};

export function buildOsAgentReply(message: string, snapshot: OsAgentSnapshot) {
  const normalizedMessage = message.toLowerCase();
  const toolsUsed = pickTools(normalizedMessage);

  const headline = normalizedMessage.includes("finanz")
    ? `Resumen financiero: ${snapshot.pendingInvoiceCount} facturas pendientes por ${formatMoney(snapshot.pendingInvoiceCents)}.`
    : normalizedMessage.includes("cliente")
      ? `Actualmente Vertrex tiene ${snapshot.clientCount} clientes con ${snapshot.projectCount} proyectos registrados.`
      : normalizedMessage.includes("ticket") || normalizedMessage.includes("soporte")
        ? `Hay ${snapshot.openTicketCount} tickets abiertos o en progreso que requieren seguimiento.`
        : `Snapshot operativo: ${snapshot.projectCount} proyectos, ${snapshot.openTaskCount} tareas abiertas y ${snapshot.pendingInvoiceCount} facturas pendientes.`;

  const memoryContext = snapshot.recentMemory.length > 0
    ? `Memoria reciente: ${snapshot.recentMemory
        .slice(0, 2)
        .map((item) => `${item.key} (${item.category})`)
        .join(" · ")}.`
    : "Sin memorias recientes registradas todavía.";

  const reply = [
    `Reporte generado para ${snapshot.userName ?? "OpenClaw"} el ${snapshot.generatedAt}.`,
    headline,
    memoryContext,
    toolsUsed.length > 0 ? `Tools sugeridas/activadas: ${toolsUsed.join(", ")}.` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    reply,
    toolsUsed,
    snapshot,
  };
}

function pickTools(message: string) {
  const selected = new Set<string>();

  if (message.includes("cliente")) {
    selected.add("getClients");
  }

  if (message.includes("proyecto")) {
    selected.add("getProjects");
  }

  if (message.includes("tarea")) {
    selected.add("createTask");
  }

  if (message.includes("finanz") || message.includes("factura")) {
    selected.add("getFinanceSummary");
  }

  if (message.includes("ticket") || message.includes("soporte")) {
    selected.add("getTickets");
  }

  if (message.includes("memoria")) {
    selected.add("searchMemory");
  }

  return Array.from(selected);
}

function formatMoney(amountCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amountCents / 100);
}
