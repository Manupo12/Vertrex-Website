import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";

import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import { documentTemplates } from "@/lib/docs/template-catalog";
import { listPortalClients } from "@/lib/portal/client-portal-data";

loadEnvConfig(process.cwd());

async function main() {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL no está configurada. Define tu conexión de Neon antes de correr el seed.");
  }

  const db = getDb();
  const defaultPasswordHash = await bcrypt.hash(process.env.SEED_DEFAULT_PASSWORD?.trim() || "vertrex123", 10);
  const ownerAccess = getOwnerAccessConfig();
  const demoClientAccess = getDemoClientAccessConfig();

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
        passwordHash: defaultPasswordHash,
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

    if (projectId) {
      for (const milestone of buildSeedMilestones(portalClient.progress)) {
        const [existingMilestone] = await db
          .select({ id: schema.milestones.id })
          .from(schema.milestones)
          .where(and(eq(schema.milestones.projectId, projectId), eq(schema.milestones.title, milestone.title)))
          .limit(1);

        if (!existingMilestone) {
          await db.insert(schema.milestones).values({
            projectId,
            title: milestone.title,
            description: milestone.description,
            status: milestone.status,
            targetDate: milestone.targetDate,
            completedAt: milestone.completedAt,
            clientVisible: milestone.clientVisible,
            weight: milestone.weight,
            orderIndex: milestone.orderIndex,
            metadata: {
              source: "seed",
            },
          });
        }
      }

      await ensureSeedBusinessEvents(db, {
        clientId,
        clientName: portalClient.displayName,
        projectId,
        projectName,
        progress: portalClient.progress,
        paidCents: parseMoney(portalClient.paid),
        pendingCents: parseMoney(portalClient.pending),
      });
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
            requestType: ticket.requestType,
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

    const demoLinks = [
      {
        title: `Dashboard operativo · ${portalClient.brand}`,
        url: `https://app.${portalClient.id}.vertrex.co`,
        kind: "dashboard" as const,
        description: "Panel de control operativo del cliente",
      },
      {
        title: `Drive compartido · ${portalClient.brand}`,
        url: `https://drive.google.com/drive/folders/${portalClient.id}`,
        kind: "url" as const,
        description: "Carpeta compartida de archivos",
      },
    ];

    for (const link of demoLinks) {
      const [existingLink] = await db
        .select({ id: schema.links.id })
        .from(schema.links)
        .where(eq(schema.links.url, link.url))
        .limit(1);

      if (!existingLink) {
        await db.insert(schema.links).values({
          clientId,
          projectId,
          title: link.title,
          url: link.url,
          kind: link.kind,
          description: link.description,
          domain: new URL(link.url).hostname,
          metadata: { source: "seed" },
        });
      }
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
      passwordHash: defaultPasswordHash,
      role: "team",
    });
  }

  const ownerPasswordHash = await bcrypt.hash(ownerAccess.password, 10);
  await upsertUser(db, {
    email: ownerAccess.email,
    name: ownerAccess.name,
    passwordHash: ownerPasswordHash,
    role: "team",
    clientId: null,
  });

  const demoClientId = await ensureDemoClient(db, demoClientAccess);
  const demoClientPasswordHash = await bcrypt.hash(demoClientAccess.password, 10);
  await upsertUser(db, {
    email: demoClientAccess.email,
    name: demoClientAccess.name,
    passwordHash: demoClientPasswordHash,
    role: "client",
    clientId: demoClientId,
  });

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

  await ensureSeedAutomationData(db);

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

function buildSeedMilestones(progress: number) {
  const normalizedProgress = Math.max(0, Math.min(100, progress));

  return [
    {
      title: "Kickoff operativo",
      description: "Activación inicial, responsables y alcance alineados.",
      status: normalizedProgress >= 25 ? "completed" : normalizedProgress > 0 ? "in_progress" : "pending",
      targetDate: daysFromNow(-7),
      completedAt: normalizedProgress >= 25 ? daysFromNow(-6) : null,
      clientVisible: true,
      weight: 1,
      orderIndex: 0,
    },
    {
      title: "Entrega núcleo",
      description: "Entrega central del proyecto con trazabilidad documental y tareas operativas.",
      status: normalizedProgress >= 80 ? "approved" : normalizedProgress >= 45 ? "under_review" : normalizedProgress >= 20 ? "in_progress" : "pending",
      targetDate: daysFromNow(10),
      completedAt: normalizedProgress >= 90 ? daysFromNow(-1) : null,
      clientVisible: true,
      weight: 2,
      orderIndex: 1,
    },
    {
      title: "Go-live y handoff",
      description: "Cierre operativo, handoff y validación final con cliente.",
      status: normalizedProgress >= 100 ? "completed" : normalizedProgress >= 70 ? "under_review" : "pending",
      targetDate: daysFromNow(21),
      completedAt: normalizedProgress >= 100 ? daysFromNow(0) : null,
      clientVisible: true,
      weight: 1,
      orderIndex: 2,
    },
  ] as const;
}

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function ensureSeedBusinessEvents(
  db: ReturnType<typeof getDb>,
  input: {
    clientId: string;
    clientName: string;
    projectId: string;
    projectName: string;
    progress: number;
    paidCents: number;
    pendingCents: number;
  },
) {
  const seedEvents = [
    {
      eventType: "projects.seeded",
      module: "projects",
      action: "seed-project",
      entityType: "project",
      entityId: input.projectId,
      summary: `Proyecto base sincronizado para ${input.clientName}.`,
      clientVisible: true,
      payload: {
        progress: input.progress,
        source: "seed",
      },
    },
    {
      eventType: "projects.milestone-plan-seeded",
      module: "projects",
      action: "seed-milestone-plan",
      entityType: "milestone",
      entityId: `${input.projectId}:milestone-plan`,
      summary: `Plan inicial de milestones cargado para ${input.projectName}.`,
      clientVisible: true,
      payload: {
        source: "seed",
      },
    },
    {
      eventType: "finance.billing-baseline-seeded",
      module: "finance",
      action: "seed-billing-baseline",
      entityType: "invoice",
      entityId: `${input.projectId}:billing-baseline`,
      summary: input.pendingCents > 0
        ? `Se sincronizó la línea base financiera con saldo pendiente en ${input.clientName}.`
        : `Se registró la línea base financiera cerrada para ${input.clientName}.`,
      clientVisible: true,
      payload: {
        paidCents: input.paidCents,
        pendingCents: input.pendingCents,
        source: "seed",
      },
    },
  ] as const;

  for (const seedEvent of seedEvents) {
    const [existingEvent] = await db
      .select({ id: schema.businessEvents.id })
      .from(schema.businessEvents)
      .where(and(eq(schema.businessEvents.eventType, seedEvent.eventType), eq(schema.businessEvents.entityId, seedEvent.entityId)))
      .limit(1);

    if (!existingEvent) {
      await db.insert(schema.businessEvents).values({
        eventType: seedEvent.eventType,
        module: seedEvent.module,
        action: seedEvent.action,
        entityType: seedEvent.entityType,
        entityId: seedEvent.entityId,
        actorType: "system",
        actorUserId: null,
        actorName: "Vertrex Seed",
        clientId: input.clientId,
        clientName: input.clientName,
        projectId: input.projectId,
        projectName: input.projectName,
        summary: seedEvent.summary,
        clientVisible: seedEvent.clientVisible,
        payload: seedEvent.payload,
      });
    }
  }
}

async function ensureSeedAutomationData(db: ReturnType<typeof getDb>) {
  const [primaryClient] = await db
    .select({ id: schema.clients.id, name: schema.clients.name })
    .from(schema.clients)
    .limit(1);

  if (!primaryClient) {
    return;
  }

  const [primaryProject] = await db
    .select({ id: schema.projects.id, name: schema.projects.name, clientId: schema.projects.clientId })
    .from(schema.projects)
    .where(eq(schema.projects.clientId, primaryClient.id))
    .limit(1);

  const automationSeeds = [
    {
      title: "Cliente activo → delivery",
      trigger: "Deal activo sin proyecto",
      action: "Crear proyecto, kickoff y tarea base",
      result: "Origina delivery con trazabilidad completa",
      summary: "Convierte activación comercial en operación real sin fricción entre CRM y proyectos.",
      status: "active" as const,
      clientId: primaryClient.id,
      projectId: primaryProject?.id ?? null,
      runs: [
        {
          title: "Cliente activo → delivery",
          status: "completed" as const,
          triggerSource: "seed:deal-gap",
          summary: `Se registró el traspaso comercial a delivery para ${primaryClient.name}.`,
          startedAt: daysFromNow(-2),
          finishedAt: daysFromNow(-2),
        },
      ],
    },
    {
      title: "Proyecto nuevo → kickoff",
      trigger: "Proyecto creado sin evento futuro",
      action: "Agendar kickoff y notificar ownership",
      result: "Asegura arranque operativo con agenda compartida",
      summary: "Evita proyectos sin contexto inicial y fuerza primer ritual operativo.",
      status: "active" as const,
      clientId: primaryClient.id,
      projectId: primaryProject?.id ?? null,
      runs: [
        {
          title: "Proyecto nuevo → kickoff",
          status: "needs_review" as const,
          triggerSource: "seed:kickoff-gap",
          summary: primaryProject
            ? `El kickoff de ${primaryProject.name} quedó pendiente de confirmar con el cliente.`
            : "Hay un kickoff pendiente de confirmar para un proyecto recién activado.",
          startedAt: daysFromNow(-1),
          finishedAt: daysFromNow(-1),
        },
      ],
    },
    {
      title: "Onboarding cliente → portal",
      trigger: "Cliente con proyecto activo sin acceso portal",
      action: "Provisionar acceso, canal de soporte y assets base",
      result: "Abre autoservicio y seguimiento desde portal",
      summary: "Activa el portal cuando la cuenta ya está operativa para reducir fricción manual.",
      status: "draft" as const,
      clientId: primaryClient.id,
      projectId: primaryProject?.id ?? null,
      runs: [
        {
          title: "Onboarding cliente → portal",
          status: "queued" as const,
          triggerSource: "seed:portal-rollout",
          summary: `El rollout de portal para ${primaryClient.name} quedó en cola para validación operativa.`,
          startedAt: daysFromNow(0),
          finishedAt: null,
        },
      ],
    },
  ] as const;

  for (const automationSeed of automationSeeds) {
    const [existingPlaybook] = await db
      .select({ id: schema.automationPlaybooks.id })
      .from(schema.automationPlaybooks)
      .where(eq(schema.automationPlaybooks.title, automationSeed.title))
      .limit(1);

    const playbookId = existingPlaybook?.id
      ?? (
        await db
          .insert(schema.automationPlaybooks)
          .values({
            clientId: automationSeed.clientId,
            projectId: automationSeed.projectId,
            title: automationSeed.title,
            trigger: automationSeed.trigger,
            action: automationSeed.action,
            result: automationSeed.result,
            summary: automationSeed.summary,
            status: automationSeed.status,
            metadata: {
              source: "seed",
            },
            updatedAt: automationSeed.runs[0]?.startedAt ?? new Date(),
            lastRunAt: automationSeed.runs.find((run) => run.finishedAt)?.finishedAt ?? null,
          })
          .returning({ id: schema.automationPlaybooks.id })
      )[0]?.id;

    if (!playbookId) {
      continue;
    }

    for (const run of automationSeed.runs) {
      const [existingRun] = await db
        .select({ id: schema.automationRuns.id })
        .from(schema.automationRuns)
        .where(
          and(
            eq(schema.automationRuns.playbookId, playbookId),
            eq(schema.automationRuns.title, run.title),
            eq(schema.automationRuns.status, run.status),
            eq(schema.automationRuns.summary, run.summary),
          ),
        )
        .limit(1);

      if (!existingRun) {
        await db.insert(schema.automationRuns).values({
          playbookId,
          clientId: automationSeed.clientId,
          projectId: automationSeed.projectId,
          title: run.title,
          status: run.status,
          triggerSource: run.triggerSource,
          summary: run.summary,
          startedAt: run.startedAt,
          finishedAt: run.finishedAt,
          metadata: {
            source: "seed",
            playbookTitle: automationSeed.title,
          },
          updatedAt: run.finishedAt ?? run.startedAt,
        });
      }
    }

    const latestRunAt = [...automationSeed.runs]
      .map((run) => run.finishedAt ?? run.startedAt)
      .sort((left, right) => right.getTime() - left.getTime())[0];

    if (latestRunAt) {
      await db
        .update(schema.automationPlaybooks)
        .set({
          lastRunAt: latestRunAt,
          updatedAt: latestRunAt,
        })
        .where(eq(schema.automationPlaybooks.id, playbookId));
    }
  }
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

type AccessConfig = {
  email: string;
  name: string;
  password: string;
};

type DemoClientConfig = AccessConfig & {
  slug: string;
  brand: string;
};

async function upsertUser(
  db: ReturnType<typeof getDb>,
  input: {
    email: string;
    name: string;
    passwordHash: string;
    role: "team" | "client";
    clientId: string | null;
  },
) {
  const [existingUser] = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, input.email))
    .limit(1);

  if (existingUser) {
    await db
      .update(schema.users)
      .set({
        name: input.name,
        passwordHash: input.passwordHash,
        role: input.role,
        clientId: input.clientId,
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, existingUser.id));

    return existingUser.id;
  }

  const [createdUser] = await db
    .insert(schema.users)
    .values({
      email: input.email,
      name: input.name,
      passwordHash: input.passwordHash,
      role: input.role,
      clientId: input.clientId,
      isActive: true,
    })
    .returning({ id: schema.users.id });

  return createdUser.id;
}

async function ensureDemoClient(db: ReturnType<typeof getDb>, config: DemoClientConfig) {
  const [existingClient] = await db
    .select({ id: schema.clients.id })
    .from(schema.clients)
    .where(eq(schema.clients.slug, config.slug))
    .limit(1);

  if (existingClient) {
    return existingClient.id;
  }

  const [createdClient] = await db
    .insert(schema.clients)
    .values({
      slug: config.slug,
      name: config.name,
      brand: config.brand,
      email: config.email,
      company: config.name,
      status: "active",
      phase: "Portal Demo",
      progress: 35,
      totalInvestmentCents: 2500000,
      paidCents: 1000000,
      pendingCents: 1500000,
      welcomeTitle: "Bienvenido de nuevo.",
      welcomeDescription: "Portal demo listo para revisar avance, documentos, facturación y soporte.",
      nextAction: "Validar accesos y revisar entregables prioritarios.",
      nextActionContext: "Usa este cliente demo para probar el flujo completo del portal.",
      nextActionCta: "Entrar al portal",
      metadata: {
        displayName: config.name,
        statusLabel: "Portal Demo",
        statusHighlights: [
          { label: "Modo", value: "Demo" },
          { label: "Acceso", value: "Activo" },
        ],
      },
    })
    .returning({ id: schema.clients.id });

  return createdClient.id;
}

function getOwnerAccessConfig(): AccessConfig {
  return {
    email: normalizeEmail(process.env.OWNER_EMAIL) ?? "owner@vertrex.co",
    name: process.env.OWNER_NAME?.trim() || "Vertrex Owner",
    password: process.env.OWNER_PASSWORD?.trim() || "vertrex123",
  };
}

function getDemoClientAccessConfig(): DemoClientConfig {
  const slug = normalizeSlug(process.env.TEST_CLIENT_SLUG) ?? "budaphone";

  return {
    slug,
    email: normalizeEmail(process.env.TEST_CLIENT_EMAIL) ?? `${slug}@client.vertrex.co`,
    name: process.env.TEST_CLIENT_NAME?.trim() || "Cliente Demo",
    brand: process.env.TEST_CLIENT_BRAND?.trim() || formatBrand(slug),
    password: process.env.TEST_CLIENT_PASSWORD?.trim() || "vertrex123",
  };
}

function normalizeEmail(value: string | undefined) {
  const normalized = value?.trim().toLowerCase();
  return normalized ? normalized : null;
}

function normalizeSlug(value: string | undefined) {
  const normalized = value?.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-{2,}/g, "-").replace(/^-|-$/g, "");
  return normalized ? normalized : null;
}

function formatBrand(slug: string) {
  return slug.replace(/-/g, " ").toUpperCase();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
