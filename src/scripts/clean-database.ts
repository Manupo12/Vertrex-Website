import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";
import postgres from "postgres";

loadEnvConfig(process.cwd());

const ADMIN_EMAIL = "manuelvillanueva463@gmail.com";
const ADMIN_PASSWORD = "manuel1212";
const ADMIN_NAME = "Manuel Villanueva";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL no está configurada.");
  }

  const sql = postgres(databaseUrl, { max: 1, prepare: false });

  console.log("🧹 Limpiando base de datos...");

  // Truncate all tables in order (respecting foreign keys)
  const tablesToTruncate = [
    "audit_events",
    "business_events",
    "portal_activity_feed",
    "entity_relations",
    "automation_runs",
    "automation_playbooks",
    "ai_approvals",
    "ai_memory",
    "openclaw_sessions",
    "generated_documents",
    "links",
    "messages",
    "transactions",
    "invoices",
    "documents",
    "files",
    "credentials",
    "events",
    "deals",
    "milestones",
    "tasks",
    "tickets",
    "projects",
    "clients",
    "document_versions",
    "documents",
    "document_templates",
    "sessions",
    "users",
  ];

  for (const table of tablesToTruncate) {
    try {
      await sql`TRUNCATE TABLE "${sql.unsafe(table)}" CASCADE`;
      console.log(`  ✓ Truncated ${table}`);
    } catch (e) {
      console.log(`  ○ ${table} (no existe o ya vacía)`);
    }
  }

  console.log("👤 Creando usuario admin...");

  // Create admin user
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const [user] = await sql`
    INSERT INTO users (id, email, name, password_hash, role, is_active, team_subrole, capabilities, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      ${ADMIN_EMAIL},
      ${ADMIN_NAME},
      ${passwordHash},
      'team',
      true,
      'admin',
      ${JSON.stringify(["*"])},
      NOW(),
      NOW()
    )
    RETURNING id, email, name
  `;

  console.log(`✅ Usuario admin creado:`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Nombre: ${user.name}`);
  console.log(`   ID: ${user.id}`);

  await sql.end();
  console.log("\n🎁 Base de datos limpia y lista para configurar.");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
