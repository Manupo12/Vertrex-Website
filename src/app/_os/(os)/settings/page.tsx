import React from "react";
import { 
  Settings as SettingsIcon, User, Users, Shield, 
  CreditCard, Blocks, Zap
} from "lucide-react";

import { AccessSettingsPanel } from "@/components/settings/access-settings-panel";
import { getAccessManagementSnapshot } from "@/lib/admin/access-service";

export default async function SettingsPage() {
  const snapshot = await getAccessManagementSnapshot();

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-8 animate-fade-in pb-4">
      
      {/* 1. SIDEBAR: NAVEGACIÓN DE CONFIGURACIÓN */}
      <aside className="w-[240px] shrink-0 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2 mb-1">
            Configuración
          </h1>
          <p className="text-xs text-muted-foreground">Administración de Vertrex OS</p>
        </div>

        <nav className="space-y-6">
          {/* Sección: Personal */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2 block">Mi Cuenta</span>
            <SettingsNavItem icon={User} label="Perfil" />
            <SettingsNavItem icon={SettingsIcon} label="Preferencias" />
          </div>

          {/* Sección: Organización (Activa) */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2 block">Organización</span>
            <SettingsNavItem icon={Blocks} label="General" />
            <SettingsNavItem icon={Users} label="Miembros y Roles" active />
            <SettingsNavItem icon={Shield} label="Seguridad & Auditoría" />
            <SettingsNavItem icon={CreditCard} label="Facturación" />
          </div>

          {/* Sección: Ecosistema */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2 block">Ecosistema</span>
            <SettingsNavItem icon={Blocks} label="Integraciones" />
            <SettingsNavItem icon={Zap} label="Motor de IA (Config)" />
          </div>
        </nav>
      </aside>

      {/* 2. ÁREA PRINCIPAL: GESTIÓN DE MIEMBROS Y AUDITORÍA */}
      <main className="flex-1 overflow-y-auto no-scrollbar pr-2 space-y-8">
        {/* Header de la Vista Principal */}
        <div className="border-b border-border pb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Miembros y Roles</h2>
            <p className="text-sm text-muted-foreground mt-1">Gestiona accesos reales, clientes activos y overrides manuales de las cards públicas.</p>
          </div>
        </div>

        <AccessSettingsPanel initialSnapshot={snapshot} />

      </main>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES DE CONFIGURACIÓN
// ==========================================

function SettingsNavItem({ icon: Icon, label, active }: any) {
  return (
    <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
      active 
        ? "bg-primary/10 text-primary font-medium border border-primary/20" 
        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-transparent"
    }`}>
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}