-- Migration: AI Approvals Queue (Cola persistida de aprobaciones IA)
-- Created: 2026-04-28

CREATE TYPE "public"."ai_approval_status" AS ENUM(
  'pending',
  'approved',
  'rejected',
  'expired',
  'cancelled'
);

CREATE TYPE "public"."ai_action_type" AS ENUM(
  'create_task',
  'update_task',
  'delete_task',
  'create_invoice',
  'update_invoice',
  'send_document',
  'update_deal_stage',
  'create_project',
  'add_milestone',
  'update_milestone',
  'send_message',
  'provision_portal',
  'rotate_credential',
  'execute_playbook',
  'modify_budget'
);

CREATE TABLE "ai_approvals" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "action_type" "public"."ai_action_type" NOT NULL,
  "status" "public"."ai_approval_status" NOT NULL DEFAULT 'pending',
  "description" text NOT NULL,
  "context" jsonb NOT NULL DEFAULT '{}',
  "proposed_changes" jsonb NOT NULL DEFAULT '{}',
  "requested_by_id" uuid,
  "requested_by_name" text,
  "approved_by_id" uuid,
  "approved_by_name" text,
  "approved_at" timestamp with time zone,
  "rejected_by_id" uuid,
  "rejected_by_name" text,
  "rejected_at" timestamp with time zone,
  "rejection_reason" text,
  "expires_at" timestamp with time zone,
  "executed_at" timestamp with time zone,
  "execution_result" jsonb,
  "client_id" uuid,
  "project_id" uuid,
  "entity_type" text,
  "entity_id" uuid,
  "priority" text NOT NULL DEFAULT 'normal',
  "risk_level" text NOT NULL DEFAULT 'medium',
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX "ai_approvals_status_idx" ON "ai_approvals" ("status");
CREATE INDEX "ai_approvals_requested_by_idx" ON "ai_approvals" ("requested_by_id");
CREATE INDEX "ai_approvals_client_idx" ON "ai_approvals" ("client_id");
CREATE INDEX "ai_approvals_project_idx" ON "ai_approvals" ("project_id");
CREATE INDEX "ai_approvals_entity_idx" ON "ai_approvals" ("entity_type", "entity_id");
CREATE INDEX "ai_approvals_pending_priority_idx" ON "ai_approvals" ("status", "priority");

ALTER TABLE "ai_approvals" ADD CONSTRAINT "ai_approvals_requested_by_id_users_id_fk" 
  FOREIGN KEY ("requested_by_id") REFERENCES "public"."users"("id") ON DELETE set null;

ALTER TABLE "ai_approvals" ADD CONSTRAINT "ai_approvals_approved_by_id_users_id_fk" 
  FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null;

ALTER TABLE "ai_approvals" ADD CONSTRAINT "ai_approvals_rejected_by_id_users_id_fk" 
  FOREIGN KEY ("rejected_by_id") REFERENCES "public"."users"("id") ON DELETE set null;

ALTER TABLE "ai_approvals" ADD CONSTRAINT "ai_approvals_client_id_clients_id_fk" 
  FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null;

ALTER TABLE "ai_approvals" ADD CONSTRAINT "ai_approvals_project_id_projects_id_fk" 
  FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null;
