import { z } from "zod";

const metadataSchema = z.record(z.string(), z.unknown()).optional();
const optionalDateSchema = z.string().datetime().optional().nullable();
const optionalUuidSchema = z.string().uuid().optional().nullable();

export const openClawProjectInputSchema = z.object({
  clientId: optionalUuidSchema,
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  status: z.string().optional(),
  progress: z.number().int().min(0).max(100).optional(),
  startDate: optionalDateSchema,
  endDate: optionalDateSchema,
  metadata: metadataSchema,
});

export const openClawProjectUpdateSchema = openClawProjectInputSchema.partial().refine(
  (payload) => Object.keys(payload).length > 0,
  "Debes enviar al menos un campo para actualizar el proyecto.",
);

export const openClawTaskInputSchema = z.object({
  clientId: optionalUuidSchema,
  projectId: optionalUuidSchema,
  title: z.string().min(1),
  owner: z.string().optional().nullable(),
  status: z.enum(["todo", "in_progress", "review", "done"]).optional(),
  dueLabel: z.string().optional().nullable(),
  position: z.number().int().min(0).optional(),
  metadata: metadataSchema,
});

export const openClawTaskUpdateSchema = openClawTaskInputSchema.partial().refine(
  (payload) => Object.keys(payload).length > 0,
  "Debes enviar al menos un campo para actualizar la tarea.",
);

export const openClawClientInputSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  brand: z.string().min(1),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  status: z.string().optional(),
  phase: z.string().optional().nullable(),
  progress: z.number().int().min(0).max(100).optional(),
  totalInvestmentCents: z.number().int().min(0).optional(),
  paidCents: z.number().int().min(0).optional(),
  pendingCents: z.number().int().min(0).optional(),
  welcomeTitle: z.string().optional().nullable(),
  welcomeDescription: z.string().optional().nullable(),
  nextAction: z.string().optional().nullable(),
  nextActionContext: z.string().optional().nullable(),
  nextActionCta: z.string().optional().nullable(),
  metadata: metadataSchema,
});

export const openClawTransactionInputSchema = z.object({
  clientId: optionalUuidSchema,
  projectId: optionalUuidSchema,
  type: z.enum(["income", "expense"]),
  amountCents: z.number().int().min(0),
  category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  occurredAt: optionalDateSchema,
  metadata: metadataSchema,
});

export const openClawDocumentInputSchema = z.object({
  clientId: optionalUuidSchema,
  projectId: optionalUuidSchema,
  templateId: optionalUuidSchema,
  createdById: optionalUuidSchema,
  code: z.string().optional(),
  title: z.string().min(1),
  status: z.enum(["draft", "review", "approved", "sent", "signed"]).optional(),
  category: z.enum(["Comercial", "Legal", "Finanzas", "Requerimientos", "Operativo"]),
  origin: z.enum(["generator", "portal", "legal", "os"]).optional(),
  summary: z.string().optional().nullable(),
  payload: metadataSchema,
});

export const openClawMemoryInputSchema = z.object({
  key: z.string().min(1),
  category: z.string().optional(),
  content: z.string().min(1),
  projectId: optionalUuidSchema,
  clientId: optionalUuidSchema,
  metadata: metadataSchema,
});

export const openClawChatInputSchema = z.object({
  message: z.string().min(1),
  sessionKey: z.string().optional(),
  saveMemory: z.boolean().optional(),
  userName: z.string().optional(),
});

export const openClawWebhookInputSchema = z.object({
  event: z.enum(["task.completed", "memory.updated", "alert", "skill.result", "custom"]),
  payload: z.unknown(),
  sessionKey: z.string().min(1),
});
