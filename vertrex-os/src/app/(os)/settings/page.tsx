import React from "react";
import { 
  Settings as SettingsIcon, User, Users, Shield, 
  CreditCard, Blocks, Zap, Search, UserPlus, 
  MoreHorizontal, Activity, ShieldCheck, Mail,
  AlertTriangle, Key, ChevronDown
} from "lucide-react";

export default function SettingsPage() {
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
            <p className="text-sm text-muted-foreground mt-1">Gestiona el acceso de tu equipo (RBAC) y clientes al sistema.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg shadow-[0_0_15px_rgba(0,255,135,0.2)] hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all">
            <UserPlus className="w-4 h-4" /> Invitar Usuario
          </button>
        </div>

        {/* Sección: Lista de Miembros (RBAC) */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center justify-between bg-secondary/20">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Buscar por nombre o email..." className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Filtro:</span>
              <button className="text-xs border border-border bg-background px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-secondary transition-colors">
                Todos los roles <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] uppercase tracking-wider text-muted-foreground bg-secondary/10">
              <tr>
                <th className="px-6 py-3 font-medium">Usuario</th>
                <th className="px-6 py-3 font-medium">Rol (RBAC)</th>
                <th className="px-6 py-3 font-medium">Último Acceso</th>
                <th className="px-6 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <MemberRow 
                name="Juan M." 
                email="juan@vertrex.com" 
                avatar="JM" 
                role="Owner" 
                lastAccess="En línea ahora" 
                isOwner 
              />
              <MemberRow 
                name="Sarah Connor" 
                email="sarah@vertrex.com" 
                avatar="SC" 
                role="Admin" 
                lastAccess="Hace 2 horas" 
              />
              <MemberRow 
                name="Carlos Dev" 
                email="carlos@vertrex.com" 
                avatar="CD" 
                role="Developer" 
                lastAccess="Ayer" 
              />
              <MemberRow 
                name="Cliente Acme" 
                email="contacto@acmecorp.com" 
                avatar="CA" 
                role="Client (Restricted)" 
                lastAccess="Hace 3 días" 
                isClient 
              />
            </tbody>
          </table>
        </div>

        {/* Sección: Auditoría de Seguridad Total (PRD 4.0) */}
        <div className="mt-12 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> Log de Auditoría Reciente
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Registro inmutable de acciones críticas (Últimas 24h).</p>
            </div>
            <button className="text-sm text-primary hover:underline font-medium">Ver log completo</button>
          </div>

          <div className="bg-[#0a0a0a] border border-border rounded-xl p-2 font-mono text-xs overflow-x-auto no-scrollbar relative group">
            {/* Overlay de Cifrado */}
            <div className="absolute top-2 right-4 flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold px-2 py-1 rounded border border-emerald-500/20 z-10 opacity-50 group-hover:opacity-100 transition-opacity">
              <ShieldCheck className="w-3 h-3" /> Hash verificado
            </div>

            <div className="space-y-2 p-3 text-muted-foreground">
              <AuditLogEntry 
                time="10:45:02" 
                ip="192.168.1.102" 
                user="JM" 
                action="UPDATE_PERMISSIONS" 
                target="User: Sarah Connor -> Promoted to Admin" 
                color="text-amber-400" 
              />
              <AuditLogEntry 
                time="09:12:15" 
                ip="203.0.113.45" 
                user="IA COO" 
                action="CREATE_TASK" 
                target="Project: Nexus -> Task NEX-146 created autonomously" 
                color="text-purple-400" 
              />
              <AuditLogEntry 
                time="08:30:00" 
                ip="198.51.100.2" 
                user="SC" 
                action="VIEW_VAULT_SECRET" 
                target="Vault: Stripe Secret Key (Prod)" 
                color="text-destructive" 
                alert
              />
              <AuditLogEntry 
                time="08:05:22" 
                ip="192.168.1.102" 
                user="JM" 
                action="LOGIN_SUCCESS" 
                target="System login via 2FA" 
                color="text-emerald-400" 
              />
            </div>
          </div>
        </div>

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

function MemberRow({ name, email, avatar, role, lastAccess, isOwner, isClient }: any) {
  return (
    <tr className="hover:bg-secondary/20 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${isClient ? 'bg-background border-border text-muted-foreground' : 'bg-primary border-primary text-primary-foreground shadow-sm'}`}>
            {avatar}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
              {name} {isOwner && <span className="bg-primary/20 text-primary text-[10px] px-1.5 rounded uppercase font-bold border border-primary/30">Owner</span>}
            </p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <button className={`flex items-center justify-between w-36 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
          isClient 
            ? 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary' 
            : 'bg-background border-border text-foreground hover:border-primary/50'
        }`}>
          <div className="flex items-center gap-2">
            {isClient ? <Blocks className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
            {role}
          </div>
          {!isOwner && <ChevronDown className="w-3 h-3 text-muted-foreground" />}
        </button>
      </td>
      <td className="px-6 py-4 text-xs text-muted-foreground">
        {lastAccess}
      </td>
      <td className="px-6 py-4 text-right">
        {isOwner ? (
          <span className="text-xs text-muted-foreground italic mr-2">No editable</span>
        ) : (
          <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        )}
      </td>
    </tr>
  );
}

function AuditLogEntry({ time, ip, user, action, target, color, alert }: any) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-1 hover:bg-secondary/30 px-2 rounded transition-colors ${alert ? 'bg-destructive/5 border border-destructive/20' : ''}`}>
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-muted-foreground/50 w-16">{time}</span>
        <span className="text-muted-foreground/40 w-24 hidden md:inline-block">{ip}</span>
        <span className="font-bold text-foreground w-12">[{user}]</span>
      </div>
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
        <span className={`font-semibold ${color}`}>{action}</span>
        <span className="text-muted-foreground">→</span>
        <span className="text-foreground/80 break-all">{target}</span>
      </div>
      {alert && <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />}
    </div>
  );
}