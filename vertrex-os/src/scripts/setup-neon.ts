import { execSync } from "node:child_process";

const requiredEnv = ["DATABASE_URL", "AUTH_SECRET"] as const;
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  throw new Error(`Faltan variables requeridas para activar Vertrex OS: ${missingEnv.join(", ")}`);
}

runStep("Sincronizando esquema con Neon", "npm run db:push");
runStep("Poblando catálogo, clientes y usuarios base", "npm run db:seed");
runStep("Validando TypeScript", "npm run typecheck");

console.log("Vertrex OS quedó listo contra Neon. Ahora puedes ejecutar npm run dev.");

function runStep(label: string, command: string) {
  console.log(`\n=== ${label} ===`);
  execSync(command, {
    stdio: "inherit",
    env: process.env,
  });
}
