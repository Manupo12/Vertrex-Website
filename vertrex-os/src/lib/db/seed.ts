import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import { documentTemplates } from "@/lib/docs/template-catalog";
import { listPortalClients } from "@/lib/portal/client-portal-data";

async function main() {
  if (!isDatabaseConfigured) {
    throw new Error("DATABASE_URL no está configurada. Define tu conexión de Neon antes de correr el seed.");
  }

  const db = getDb();
  const passwordHash = await bcrypt.hash("vertrex123", 10);

  for (const template of documentTemplates) {
    const [existingTemplate] = await db
      .select({ id: schema.documentTemplates.id })
      .from(schema.documentTemplates)
      .where(eq(schema.documentTemplates.templateKey, template.id))
      .limit(1);

    if (!existingTemplate) {
      await db.insert(schema.documentTemplates).values({
        templateKey: template.id,
        slug: template.slug,
        clientSlug: template.clientId,
        clientLabel: template.clientLabel,
        title: template.title,
        kind: template.kind,
        category: template.type,
        htmlPath: template.htmlPath,
        isDefault: template.clientId === "universales",
        metadata: {
          description: template.description,
          scopeLabel: template.scopeLabel,
          requirementsLabel: template.requirementsLabel,
          lineItemsLabel: template.lineItemsLabel,
        },
      });
    }
  }

  for (const portalClient of listPortalClients()) {
    let clientId: string;
    const [existingClient] = await db
      .select({ id: schema.clients.id })
      .from(schema.clients)
      .where(eq(schema.clients.slug, portalClient.id))
      .limit(1);

    if (existingClient) {
      clientId = existingClient.id;
    } else {
      const [createdClient] = await db
        .insert(schema.clients)
        .values({
          slug: portalClient.id,
          name: portalClient.displayName,
          brand: portalClient.brand,
          email: `${portalClient.id}@client.vertrex.co`,
          phone: null,
          company: portalClient.displayName,
          status: "active",
          phase: portalClient.phase,
          progress: portalClient.progress,
          totalInvestmentCents: parseMoney(portalClient.totalInvestment),
          paidCents: parseMoney(portalClient.paid),
          pendingCents: parseMoney(portalClient.pending),
          welcomeTitle: portalClient.welcomeTitle,
          welcomeDescription: portalClient.welcomeDescription,
          nextAction: portalClient.nextAction,
          nextActionContext: portalClient.nextActionContext,
          nextActionCta: portalClient.nextActionCta,
          metadata: {
            statusLabel: portalClient.statusLabel,
            statusHighlights: portalClient.statusHighlights,
          },
        })
        .returning({ id: schema.clients.id });

      clientId = createdClient.id;
    }

    const projectName = `${portalClient.brand} · Portal Cliente`;
    let projectId: string | null = null;
    const [existingProject] = await db
      .select({ id: schema.projects.id })
      .from(schema.projects)
      .where(eq(schema.projects.name, projectName))
      .limit(1);

    if (existingProject) {
      projectId = existingProject.id;
    } else {
      const [createdProject] = await db
        .insert(schema.projects)
        .values({
          clientId,
          name: projectName,
          description: `Implementación y operación continua del portal de ${portalClient.displayName}.`,
          status: "active",
          progress: portalClient.progress,
          metadata: {
            source: "seed",
            phase: portalClient.phase,
          },
        })
        .returning({ id: schema.projects.id });

      projectId = createdProject.id;
    }

    const [existingClientUser] = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, `${portalClient.id}@client.vertrex.co`))
      .limit(1);

    if (!existingClientUser) {
      await db.insert(schema.users).values({
        email: `${portalClient.id}@client.vertrex.co`,
        name: portalClient.displayName,
        passwordHash,
        role: "client",
        clientId,
      });
    }

    for (const task of portalClient.tasks) {
      const [existingTask] = await db
        .select({ id: schema.tasks.id })
        .from(schema.tasks)
        .where(eq(schema.tasks.title, task.title))
        .limit(1);

      if (!existingTask) {
        await db.insert(schema.tasks).values({
          clientId,
          projectId,
          title: task.title,
          owner: task.owner,
          status: mapTaskStatus(task.status),
          dueLabel: task.dueLabel,
        });
      } else {
        await db
          .update(schema.tasks)
          .set({
            clientId,
            projectId,
            owner: task.owner,
            status: mapTaskStatus(task.status),
            dueLabel: task.dueLabel,
            updatedAt: new Date(),
          })
          .where(eq(schema.tasks.id, existingTask.id));
      }
    }

    for (const invoice of portalClient.invoices) {
      const [existingInvoice] = await db
        .select({ id: schema.invoices.id })
        .from(schema.invoices)
        .where(eq(schema.invoices.invoiceNumber, invoice.invoiceNumber))
        .limit(1);

      if (!existingInvoice) {
        await db.insert(schema.invoices).values({
          clientId,
          label: invoice.label,
          invoiceNumber: invoice.invoiceNumber,
          amountCents: parseMoney(invoice.amount),
          dueLabel: invoice.dueDate,
          status: invoice.status,
          metadata: {
            supportId: invoice.supportId,
          },
        });
      }
    }

    for (const credential of portalClient.credentials) {
      const [existingCredential] = await db
        .select({ id: schema.portalCredentials.id })
        .from(schema.portalCredentials)
        .where(eq(schema.portalCredentials.title, credential.title))
        .limit(1);

      if (!existingCredential) {
        await db.insert(schema.portalCredentials).values({
          clientId,
          title: credential.title,
          scope: credential.scope,
          status: credential.status,
          updatedLabel: credential.updatedAt,
        });
      }
    }

    for (const file of portalClient.files) {
      const [existingFile] = await db
        .select({ id: schema.portalFiles.id })
        .from(schema.portalFiles)
        .where(eq(schema.portalFiles.name, file.name))
        .limit(1);

      if (!existingFile) {
        await db.insert(schema.portalFiles).values({
          clientId,
          name: file.name,
          sizeLabel: file.size,
          uploadedAtLabel: file.uploadedAt,
          category: file.category,
          source: file.source,
          metadata: {
            legacyId: file.id,
          },
        });
      }
    }

    for (const ticket of portalClient.tickets) {
      const [existingTicket] = await db
        .select({ id: schema.tickets.id })
        .from(schema.tickets)
        .where(eq(schema.tickets.title, ticket.title))
        .limit(1);

      if (!existingTicket) {
        await db.insert(schema.tickets).values({
          clientId,
          title: ticket.title,
          summary: ticket.summary,
          status: mapTicketStatus(ticket.status),
          updatedLabel: ticket.updatedAt,
          metadata: {
            legacyId: ticket.id,
          },
        });
      }
    }

    const transactionDescription = `Movimiento operativo ${portalClient.brand}`;
    const [existingTransaction] = await db
      .select({ id: schema.transactions.id })
      .from(schema.transactions)
      .where(eq(schema.transactions.description, transactionDescription))
      .limit(1);

    if (!existingTransaction) {
      await db.insert(schema.transactions).values({
        clientId,
        projectId,
        type: "income",
        amountCents: parseMoney(portalClient.paid),
        category: "Proyecto",
        description: transactionDescription,
        metadata: {
          source: "seed",
          pendingCents: parseMoney(portalClient.pending),
        },
      });
    }
  }

  const [existingAdmin] = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, "admin@vertrex.co"))
    .limit(1);

  if (!existingAdmin) {
    await db.insert(schema.users).values({
      email: "admin@vertrex.co",
      name: "Vertrex Admin",
      passwordHash,
      role: "team",
    });
  }

  const [existingAIMemory] = await db
    .select({ id: schema.aiMemory.id })
    .from(schema.aiMemory)
    .where(eq(schema.aiMemory.key, "config:ai-model"))
    .limit(1);

  if (!existingAIMemory) {
    await db.insert(schema.aiMemory).values({
      key: "config:ai-model",
      category: "global",
      content: "gpt-4o",
      metadata: {
        provider: "OpenAI",
        source: "seed",
      },
    });
  }

  const [existingGlobalMemory] = await db
    .select({ id: schema.aiMemory.id })
    .from(schema.aiMemory)
    .where(eq(schema.aiMemory.key, "global:vertrex-context"))
    .limit(1);

  if (!existingGlobalMemory) {
    await db.insert(schema.aiMemory).values({
      key: "global:vertrex-context",
      category: "global",
      content: "Vertrex opera portales de cliente, generación documental, legal y soporte centralizado sobre Neon.",
      metadata: {
        source: "seed",
      },
    });
  }

  const [existingOpenClawSession] = await db
    .select({ id: schema.openclawSessions.id })
    .from(schema.openclawSessions)
    .where(eq(schema.openclawSessions.sessionKey, "local-openclaw"))
    .limit(1);

  if (!existingOpenClawSession) {
    await db.insert(schema.openclawSessions).values({
      sessionKey: "local-openclaw",
      status: "active",
      permissions: {
        scope: "full",
      },
      metadata: {
        source: "seed",
        label: "OpenClaw local dev",
      },
    });
  }

  console.log("Seed completado para Vertrex OS.");
}

function parseMoney(value: string) {
  return Number.parseInt(value.replace(/[^\d-]/g, "") || "0", 10) * 100;
}

function mapTaskStatus(status: "done" | "active" | "pending") {
  if (status === "done") {
    return "done" as const;
  }

  if (status === "active") {
    return "in_progress" as const;
  }

  return "todo" as const;
}

function mapTicketStatus(status: "open" | "in_progress" | "resolved") {
  if (status === "resolved") {
    return "resolved" as const;
  }

  if (status === "in_progress") {
    return "in_progress" as const;
  }

  return "open" as const;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
