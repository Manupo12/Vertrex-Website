-- Extended operational status enums for Phase 2
-- Task statuses: add blocked, archived
ALTER TYPE "public"."task_status" ADD VALUE IF NOT EXISTS 'blocked';
ALTER TYPE "public"."task_status" ADD VALUE IF NOT EXISTS 'archived';

-- Document statuses: add published, archived, expired, void
ALTER TYPE "public"."document_status" ADD VALUE IF NOT EXISTS 'published';
ALTER TYPE "public"."document_status" ADD VALUE IF NOT EXISTS 'archived';
ALTER TYPE "public"."document_status" ADD VALUE IF NOT EXISTS 'expired';
ALTER TYPE "public"."document_status" ADD VALUE IF NOT EXISTS 'void';

-- Invoice statuses: add draft, issued, partially_paid, disputed, canceled, waived
-- Note: cancelled (double-l) already exists; canceled (single-l) added as alias for compatibility
ALTER TYPE "public"."invoice_status" ADD VALUE IF NOT EXISTS 'draft';
ALTER TYPE "public"."invoice_status" ADD VALUE IF NOT EXISTS 'issued';
ALTER TYPE "public"."invoice_status" ADD VALUE IF NOT EXISTS 'partially_paid';
ALTER TYPE "public"."invoice_status" ADD VALUE IF NOT EXISTS 'disputed';
ALTER TYPE "public"."invoice_status" ADD VALUE IF NOT EXISTS 'canceled';
ALTER TYPE "public"."invoice_status" ADD VALUE IF NOT EXISTS 'waived';
