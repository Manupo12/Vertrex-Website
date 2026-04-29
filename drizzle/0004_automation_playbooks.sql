CREATE TYPE "public"."automation_playbook_status" AS ENUM('draft', 'active', 'paused');--> statement-breakpoint
CREATE TYPE "public"."automation_run_status" AS ENUM('queued', 'running', 'completed', 'needs_review', 'failed');--> statement-breakpoint
CREATE TABLE "automation_playbooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid,
	"project_id" uuid,
	"title" text NOT NULL,
	"trigger" text NOT NULL,
	"action" text NOT NULL,
	"result" text,
	"summary" text,
	"status" "automation_playbook_status" DEFAULT 'active' NOT NULL,
	"last_run_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "automation_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"playbook_id" uuid,
	"client_id" uuid,
	"project_id" uuid,
	"title" text NOT NULL,
	"status" "automation_run_status" DEFAULT 'queued' NOT NULL,
	"trigger_source" text,
	"summary" text NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "automation_playbooks" ADD CONSTRAINT "automation_playbooks_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_playbooks" ADD CONSTRAINT "automation_playbooks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_runs" ADD CONSTRAINT "automation_runs_playbook_id_automation_playbooks_id_fk" FOREIGN KEY ("playbook_id") REFERENCES "public"."automation_playbooks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_runs" ADD CONSTRAINT "automation_runs_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_runs" ADD CONSTRAINT "automation_runs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "automation_playbooks_updated_at_idx" ON "automation_playbooks" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "automation_playbooks_project_idx" ON "automation_playbooks" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "automation_runs_started_at_idx" ON "automation_runs" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "automation_runs_playbook_idx" ON "automation_runs" USING btree ("playbook_id");
