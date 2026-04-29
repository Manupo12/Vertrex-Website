"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Command,
  ShieldCheck,
} from "lucide-react";

import { OperationalStatsGrid } from "@/components/dashboard/operational-stats-grid";
import type { OperationalStatsSnapshot } from "@/lib/dashboard/operational-stats";

type LoginScreenProps = {
  defaultRole?: "team" | "client";
  statsSnapshot: OperationalStatsSnapshot;
};

export default function LoginScreen({ defaultRole = "team", statsSnapshot }: LoginScreenProps) {
  const router = useRouter();
  const [role, setRole] = useState<"team" | "client">(defaultRole);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRole(defaultRole);
  }, [defaultRole]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
          role,
        }),
      });

      const data = (await response.json()) as { error?: string; redirectTo?: string };

      if (!response.ok || !data.redirectTo) {
        throw new Error(data.error ?? "No fue posible iniciar sesión.");
      }

      router.push(data.redirectTo);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No fue posible iniciar sesión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#020202] selection:bg-primary/30">
      <div className="relative hidden w-[45%] flex-col justify-between border-r border-border bg-[#050505] p-12 lg:flex">
        <div className="absolute inset-0 z-0">
          <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_20%_20%,_var(--color-primary)_0%,_transparent_25%)] opacity-10"></div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
              <Command className="h-6 w-6 text-black" />
            </div>
            <div>
              <span className="block text-xl font-bold leading-none tracking-tighter text-white">VERTREX</span>
              <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Access Hub</span>
            </div>
          </div>
          <div className="rounded-md border border-border bg-secondary/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Acceso real
          </div>
        </div>

        <div className="relative z-10 w-full max-w-xl">
          <header className="mb-10">
            <h1 className="mb-2 text-4xl font-semibold tracking-tight text-white">Bienvenido a Vertrex.</h1>
            <p className="text-sm text-muted-foreground">Acceso operativo unificado para equipo interno y clientes del portal.</p>
          </header>

          <OperationalStatsGrid snapshot={statsSnapshot} variant="login" />
        </div>

        <div className="relative z-10 flex items-center gap-4 border-t border-border/50 pt-8 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Sesión auditada
          </div>
          <div className="h-1 w-1 rounded-full bg-border"></div>
          <span>Vertrex Tech © 2026</span>
        </div>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center p-8 sm:p-12 lg:w-[55%]">
        <div className="absolute left-8 top-8 flex items-center gap-2 lg:hidden">
          <Command className="h-6 w-6 text-white" />
          <span className="text-xl font-bold tracking-tighter text-white">VERTREX</span>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-[400px] space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-white">Identificación</h2>
            <p className="text-sm text-muted-foreground">Selecciona el tipo de acceso e ingresa tus credenciales.</p>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card/40 p-2">
            <RoleToggle active={role === "team"} label="Equipo Vertrex" onClick={() => setRole("team")} />
            <RoleToggle active={role === "client"} label="Cliente Portal" onClick={() => setRole("client")} />
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {role === "team" ? "ID de Vertrex" : "Cliente / correo"}
              </label>
              <div className="relative flex items-center overflow-hidden rounded-xl border border-border bg-card transition-all focus-within:border-primary">
                <input
                  type="text"
                  name="identifier"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder={role === "team" ? "socio@empresa.com o admin" : "cliente@empresa.com o slug"}
                  className="w-full bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-muted-foreground/30"
                  autoComplete="username"
                  required
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                {role === "team"
                  ? "Usa tu correo completo o tu identificador interno."
                  : "Usa el slug del cliente o el correo del usuario del portal."}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Contraseña</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm tracking-widest text-white outline-none transition-all focus:ring-1 focus:ring-primary"
                autoComplete="current-password"
                required
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-black transition-all hover:bg-primary hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Autorizando..." : "Autorizar acceso"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RoleToggle({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
        active ? "bg-white text-black" : "text-muted-foreground hover:bg-white/5 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
