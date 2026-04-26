import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["team", "client"]);
export const documentStatusEnum = pgEnum("document_status", ["draft", "review", "approved", "sent", "signed"]);
export const documentKindEnum = pgEnum("document_kind", ["Comercial", "Legal", "Finanzas", "Requerimientos", "Operativo"]);
export const documentOriginEnum = pgEnum("document_origin", ["generator", "portal", "legal", "os"]);
export const invoiceStatusEnum = pgEnum("invoice_status", ["pending", "paid", "overdue", "cancelled"]);
export const ticketStatusEnum = pgEnum("ticket_status", ["open", "in_progress", "resolved", "closed"]);
export const taskStatusEnum = pgEnum("task_status", ["todo", "in_progress", "review", "done"]);
export const credentialStatusEnum = pgEnum("credential_status", ["requested", "shared", "updated"]);
export const fileSourceEnum = pgEnum("file_source", ["client", "vertrex"]);
export const requestStatusEnum = pgEnum("document_request_status", ["requested", "drafting", "delivered", "closed"]);

export const clients = pgTable(
  "clients",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    brand: text("brand").notNull(),
    email: text("email"),
    phone: text("phone"),
    company: text("company"),
    status: text("status").notNull().default("active"),
    phase: text("phase"),
    progress: integer("progress").notNull().default(0),
    totalInvestmentCents: integer("total_investment_cents").notNull().default(0),
    paidCents: integer("paid_cents").notNull().default(0),
    pendingCents: integer("pending_cents").notNull().default(0),
    welcomeTitle: text("welcome_title"),
    welcomeDescription: text("welcome_description"),
    nextAction: text("next_action"),
    nextActionContext: text("next_action_context"),
    nextActionCta: text("next_action_cta"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("clients_slug_idx").on(table.slug),
  }),
);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("team"),
    clientId: uuid("client_id").references(() => clients.id, { onDelete: "set null" }),
    avatarUrl: text("avatar_url"),
    isActive: boolean("is_active").notNull().default(true),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
  }),
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    sessionToken: text("session_token").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    sessionTokenIdx: uniqueIndex("sessions_session_token_idx").on(table.sessionToken),
  }),
);

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"),
  progress: integer("progress").notNull().default(0),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "cascade" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  owner: text("owner"),
  status: taskStatusEnum("status").notNull().default("todo"),
  dueLabel: text("due_label"),
  position: integer("position").notNull().default(0),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const documentTemplates = pgTable(
  "document_templates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    templateKey: text("template_key").notNull(),
    slug: text("slug").notNull(),
    clientSlug: text("client_slug").notNull(),
    clientLabel: text("client_label").notNull(),
    title: text("title").notNull(),
    kind: text("kind").notNull(),
    category: documentKindEnum("category").notNull(),
    htmlPath: text("html_path").notNull(),
    isDefault: boolean("is_default").notNull().default(false),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    templateKeyIdx: uniqueIndex("document_templates_template_key_idx").on(table.templateKey),
  }),
);

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "set null" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  templateId: uuid("template_id").references(() => documentTemplates.id, { onDelete: "set null" }),
  createdById: uuid("created_by_id").references(() => users.id, { onDelete: "set null" }),
  code: text("code").notNull(),
  title: text("title").notNull(),
  status: documentStatusEnum("status").notNull().default("draft"),
  category: documentKindEnum("category").notNull(),
  origin: documentOriginEnum("origin").notNull().default("generator"),
  htmlPath: text("html_path"),
  pdfPath: text("pdf_path"),
  summary: text("summary"),
  currentVersion: integer("current_version").notNull().default(1),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default({}),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const documentVersions = pgTable("document_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  documentId: uuid("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull().default(1),
  htmlContent: text("html_content").notNull(),
  pdfPath: text("pdf_path"),
  draft: jsonb("draft").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const documentRequests = pgTable("document_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "cascade" }),
  requestedById: uuid("requested_by_id").references(() => users.id, { onDelete: "set null" }),
  templateKey: text("template_key").notNull(),
  title: text("title").notNull(),
  status: requestStatusEnum("status").notNull().default("requested"),
  notes: text("notes"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clientId: uuid("client_id").references(() => clients.id, { onDelete: "cascade" }),
    documentId: uuid("document_id").references(() => documents.id, { onDelete: "set null" }),
    supportTicketId: uuid("support_ticket_id"),
    label: text("label").notNull(),
    invoiceNumber: text("invoice_number").notNull(),
    amountCents: integer("amount_cents").notNull().default(0),
    dueLabel: text("due_label"),
    dueDate: timestamp("due_date", { withTimezone: true }),
    status: invoiceStatusEnum("status").notNull().default("pending"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    invoiceNumberIdx: uniqueIndex("invoices_invoice_number_idx").on(table.invoiceNumber),
  }),
);

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "set null" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  type: text("type").notNull(),
  amountCents: integer("amount_cents").notNull().default(0),
  category: text("category"),
  description: text("description"),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const portalCredentials = pgTable("portal_credentials", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  scope: text("scope"),
  status: credentialStatusEnum("status").notNull().default("requested"),
  updatedLabel: text("updated_label"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const portalFiles = pgTable("portal_files", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sizeLabel: text("size_label"),
  uploadedAtLabel: text("uploaded_at_label"),
  category: text("category"),
  source: fileSourceEnum("source").notNull().default("vertrex"),
  storageKey: text("storage_key"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const tickets = pgTable("tickets", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  summary: text("summary"),
  status: ticketStatusEnum("status").notNull().default("open"),
  updatedLabel: text("updated_label"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const aiMemory = pgTable(
  "ai_memory",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: text("key").notNull(),
    category: text("category").notNull().default("global"),
    content: text("content").notNull(),
    projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
    clientId: uuid("client_id").references(() => clients.id, { onDelete: "set null" }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    aiMemoryKeyIdx: uniqueIndex("ai_memory_key_idx").on(table.key),
  }),
);

export const openclawSessions = pgTable(
  "openclaw_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionKey: text("session_key").notNull(),
    status: text("status").notNull().default("active"),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
    permissions: jsonb("permissions").$type<Record<string, unknown>>().notNull().default({}),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    openclawSessionKeyIdx: uniqueIndex("openclaw_sessions_session_key_idx").on(table.sessionKey),
  }),
);
